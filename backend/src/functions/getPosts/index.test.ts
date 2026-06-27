import { APIGatewayEventRequestContext, APIGatewayProxyEvent, Context } from 'aws-lambda';
import { handler } from './index';
import { dynamo } from '../../common/dynamodb';

jest.mock('../../common/dynamodb', () => ({
  dynamo: { send: jest.fn() },
}));

const mockSend = dynamo.send as jest.Mock;

const ctx = {
  awsRequestId: 'req-test-456',
  callbackWaitsForEmptyEventLoop: false,
  functionName: 'getPosts',
  functionVersion: '$LATEST',
  invokedFunctionArn: 'arn:aws:lambda:us-east-1:123:function:getPosts',
  memoryLimitInMB: '128',
  logGroupName: '/aws/lambda/getPosts',
  logStreamName: '2026/01/01/[$LATEST]test',
  getRemainingTimeInMillis: () => 30000,
  done: jest.fn(),
  fail: jest.fn(),
  succeed: jest.fn(),
} as Context;

function event(overrides: Partial<APIGatewayProxyEvent> = {}): APIGatewayProxyEvent {
  return {
    body: null,
    headers: {},
    httpMethod: 'GET',
    isBase64Encoded: false,
    multiValueHeaders: {},
    multiValueQueryStringParameters: null,
    path: '/posts',
    pathParameters: null,
    queryStringParameters: null,
    requestContext: {} as APIGatewayEventRequestContext,
    resource: '/posts',
    stageVariables: null,
    ...overrides,
  } as APIGatewayProxyEvent;
}

const POST_A = { slug: 'post-a', status: 'Publicado', titulo: 'Post A' };
const POST_B = { slug: 'post-b', status: 'Publicado', titulo: 'Post B' };

beforeAll(() => {
  process.env.POSTS_TABLE = 'test-posts-table';
  process.env.LOG_LEVEL = 'ERROR';
});

describe('getPosts handler', () => {
  describe('/posts/recentes', () => {
    it('returns recent posts from StatusPorData GSI', async () => {
      mockSend.mockResolvedValueOnce({ Items: [POST_A, POST_B] });

      const result = await handler(event({ resource: '/posts/recentes' }), ctx, jest.fn());

      expect(result?.statusCode).toBe(200);
      const body = JSON.parse(result?.body ?? '{}');
      expect(body.posts).toHaveLength(2);
    });

    it('queries with ScanIndexForward false (newest first)', async () => {
      mockSend.mockResolvedValueOnce({ Items: [] });
      await handler(event({ resource: '/posts/recentes' }), ctx, jest.fn());

      const cmd = mockSend.mock.calls[0][0];
      expect(cmd.input.IndexName).toBe('StatusPorData');
      expect(cmd.input.ScanIndexForward).toBe(false);
      expect(cmd.input.Limit).toBe(6);
    });
  });

  describe('/posts/populares', () => {
    it('uses PopularesPorData GSI with e_popular=1', async () => {
      mockSend.mockResolvedValueOnce({ Items: [POST_A] });

      await handler(event({ resource: '/posts/populares' }), ctx, jest.fn());

      const cmd = mockSend.mock.calls[0][0];
      expect(cmd.input.IndexName).toBe('PopularesPorData');
      expect(cmd.input.ExpressionAttributeValues[':popular']).toBe(1);
    });

    it('filters only Publicado status', async () => {
      mockSend.mockResolvedValueOnce({ Items: [POST_A] });

      await handler(event({ resource: '/posts/populares' }), ctx, jest.fn());

      const cmd = mockSend.mock.calls[0][0];
      expect(cmd.input.ExpressionAttributeValues[':published']).toBe('Publicado');
    });

    it('returns posts array with status 200', async () => {
      mockSend.mockResolvedValueOnce({ Items: [POST_A, POST_B] });

      const result = await handler(event({ resource: '/posts/populares' }), ctx, jest.fn());

      expect(result?.statusCode).toBe(200);
      const body = JSON.parse(result?.body ?? '{}');
      expect(body.posts).toHaveLength(2);
    });

    it('uses default limit 6', async () => {
      mockSend.mockResolvedValueOnce({ Items: [] });

      await handler(event({ resource: '/posts/populares' }), ctx, jest.fn());

      const cmd = mockSend.mock.calls[0][0];
      expect(cmd.input.Limit).toBe(6);
    });

    it('respects custom limit from query param', async () => {
      mockSend.mockResolvedValueOnce({ Items: [] });

      await handler(
        event({ resource: '/posts/populares', queryStringParameters: { limit: '3' } }),
        ctx,
        jest.fn(),
      );

      const cmd = mockSend.mock.calls[0][0];
      expect(cmd.input.Limit).toBe(3);
    });

    it('orders newest first (ScanIndexForward false)', async () => {
      mockSend.mockResolvedValueOnce({ Items: [] });

      await handler(event({ resource: '/posts/populares' }), ctx, jest.fn());

      const cmd = mockSend.mock.calls[0][0];
      expect(cmd.input.ScanIndexForward).toBe(false);
    });

    it('does NOT fall through to getAllPosts', async () => {
      mockSend.mockResolvedValueOnce({ Items: [] });

      await handler(event({ resource: '/posts/populares' }), ctx, jest.fn());

      // getAllPosts dispara 2 queries (data + COUNT); populares dispara apenas 1
      expect(mockSend).toHaveBeenCalledTimes(1);
    });
  });

  describe('/categoria/:slug', () => {
    it('returns posts filtered by category and only Publicado', async () => {
      mockSend.mockResolvedValueOnce({ Items: [POST_A] });

      const result = await handler(
        event({ resource: '/categoria/{slug}', pathParameters: { slug: 'aws' } }),
        ctx,
        jest.fn(),
      );

      expect(result?.statusCode).toBe(200);
      const body = JSON.parse(result?.body ?? '{}');
      expect(body.posts).toHaveLength(1);
    });

    it('uses CategoriaPorData GSI and queries by slug', async () => {
      mockSend.mockResolvedValueOnce({ Items: [] });
      await handler(
        event({ resource: '/categoria/{slug}', pathParameters: { slug: 'devops' } }),
        ctx,
        jest.fn(),
      );

      const cmd = mockSend.mock.calls[0][0];
      expect(cmd.input.IndexName).toBe('CategoriaPorData');
      expect(cmd.input.ExpressionAttributeValues[':cat']).toBe('devops');
    });

    it('sem FilterExpression — evita truncação Limit+Filter no DynamoDB', async () => {
      mockSend.mockResolvedValueOnce({ Items: [] });
      await handler(
        event({ resource: '/categoria/{slug}', pathParameters: { slug: 'aws' } }),
        ctx,
        jest.fn(),
      );

      const cmd = mockSend.mock.calls[0][0];
      // FilterExpression no QueryCommand faz Limit contar itens ANTES do filtro;
      // sem ele, Limit conta apenas itens da categoria e filtramos status em memória.
      expect(cmd.input.FilterExpression).toBeUndefined();
    });

    it('filtra apenas posts Publicado em memória', async () => {
      const draft = { slug: 'draft', status: 'Rascunho', titulo: 'Draft' };
      mockSend.mockResolvedValueOnce({ Items: [POST_A, draft] });

      const result = await handler(
        event({ resource: '/categoria/{slug}', pathParameters: { slug: 'aws' } }),
        ctx,
        jest.fn(),
      );

      const body = JSON.parse(result?.body ?? '{}');
      expect(body.posts).toHaveLength(1);
      expect(body.posts[0].slug).toBe('post-a');
    });

    it('returns nextToken when DynamoDB has more results', async () => {
      const lastKey = { slug: 'post-x', status: 'Publicado', data_publicacao: '2026-01-01' };
      mockSend.mockResolvedValueOnce({ Items: [POST_A], LastEvaluatedKey: lastKey });

      const result = await handler(
        event({ resource: '/categoria/{slug}', pathParameters: { slug: 'aws' } }),
        ctx,
        jest.fn(),
      );

      const body = JSON.parse(result?.body ?? '{}');
      expect(body.nextToken).not.toBeNull();
    });
  });

  describe('/busca', () => {
    it('returns empty array for blank search term', async () => {
      const result = await handler(
        event({ resource: '/busca', queryStringParameters: { q: '' } }),
        ctx,
        jest.fn(),
      );

      expect(result?.statusCode).toBe(200);
      expect(JSON.parse(result?.body ?? '{}').posts).toHaveLength(0);
      expect(mockSend).not.toHaveBeenCalled();
    });

    it('searches with Publicado filter in ScanCommand', async () => {
      mockSend.mockResolvedValueOnce({ Items: [POST_A] });

      await handler(
        event({ resource: '/busca', queryStringParameters: { q: 'aws' } }),
        ctx,
        jest.fn(),
      );

      const cmd = mockSend.mock.calls[0][0];
      expect(cmd.input.ExpressionAttributeValues[':published']).toBe('Publicado');
    });

    it('does not set Limit (evita truncação pré-filtro do DynamoDB)', async () => {
      mockSend.mockResolvedValueOnce({ Items: [POST_A] });

      await handler(
        event({ resource: '/busca', queryStringParameters: { q: 'lambda' } }),
        ctx,
        jest.fn(),
      );

      const cmd = mockSend.mock.calls[0][0];
      // Limit no ScanCommand com FilterExpression lê N itens ANTES de filtrar —
      // com Limit:9, se os primeiros 9 itens não matcharem, retorna array vazio.
      expect(cmd.input.Limit).toBeUndefined();
    });

    it('searches título e resumo com três variantes de capitalização', async () => {
      mockSend.mockResolvedValueOnce({ Items: [] });

      await handler(
        event({ resource: '/busca', queryStringParameters: { q: 'serverless' } }),
        ctx,
        jest.fn(),
      );

      const cmd = mockSend.mock.calls[0][0];
      expect(cmd.input.ExpressionAttributeValues[':t1']).toBe('serverless');   // lower
      expect(cmd.input.ExpressionAttributeValues[':t2']).toBe('SERVERLESS');   // upper
      expect(cmd.input.ExpressionAttributeValues[':t3']).toBe('Serverless');   // title
    });

    it('also triggers when queryStringParameters has q', async () => {
      mockSend.mockResolvedValueOnce({ Items: [] });

      const result = await handler(
        event({ resource: '/posts', queryStringParameters: { q: 'lambda' } }),
        ctx,
        jest.fn(),
      );

      expect(result?.statusCode).toBe(200);
    });
  });

  describe('/projeto', () => {
    it('uses ProjetoPorData GSI with Publicado filter', async () => {
      mockSend.mockResolvedValueOnce({ Items: [POST_A] });

      await handler(event({ resource: '/posts/projeto' }), ctx, jest.fn());

      const cmd = mockSend.mock.calls[0][0];
      expect(cmd.input.IndexName).toBe('ProjetoPorData');
      expect(cmd.input.ExpressionAttributeValues[':published']).toBe('Publicado');
    });
  });

  describe('default (all posts)', () => {
    it('returns all published posts with totalCount', async () => {
      mockSend.mockResolvedValueOnce({ Items: [POST_A, POST_B] }); // posts query
      mockSend.mockResolvedValueOnce({ Count: 2 });                // count query

      const result = await handler(event(), ctx, jest.fn());

      expect(result?.statusCode).toBe(200);
      const body = JSON.parse(result?.body ?? '{}');
      expect(body.posts).toHaveLength(2);
      expect(body.totalCount).toBe(2);
    });

    it('uses StatusPorData GSI with default limit 9', async () => {
      mockSend.mockResolvedValueOnce({ Items: [] }); // posts query
      mockSend.mockResolvedValueOnce({ Count: 0 });  // count query
      await handler(event(), ctx, jest.fn());

      const cmd = mockSend.mock.calls[0][0];
      expect(cmd.input.IndexName).toBe('StatusPorData');
      expect(cmd.input.Limit).toBe(9);
      expect(cmd.input.ExpressionAttributeValues[':status']).toBe('Publicado');
    });

    it('count query uses SELECT COUNT without Limit', async () => {
      mockSend.mockResolvedValueOnce({ Items: [] }); // posts query
      mockSend.mockResolvedValueOnce({ Count: 5 });  // count query
      await handler(event(), ctx, jest.fn());

      const countCmd = mockSend.mock.calls[1][0];
      expect(countCmd.input.Select).toBe('COUNT');
      expect(countCmd.input.Limit).toBeUndefined();
    });

    it('respects custom limit from query param', async () => {
      mockSend.mockResolvedValueOnce({ Items: [] }); // posts query
      mockSend.mockResolvedValueOnce({ Count: 0 });  // count query
      await handler(event({ queryStringParameters: { limit: '3' } }), ctx, jest.fn());

      const cmd = mockSend.mock.calls[0][0];
      expect(cmd.input.Limit).toBe(3);
    });
  });

  describe('error handling', () => {
    it('returns 500 when DynamoDB throws', async () => {
      mockSend.mockRejectedValueOnce(new Error('Throttled'));
      const result = await handler(event(), ctx, jest.fn());
      expect(result?.statusCode).toBe(500);
    });
  });
});
