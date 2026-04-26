import { APIGatewayProxyEvent, Context } from 'aws-lambda';
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
    requestContext: {} as any,
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
      expect(cmd.input.Limit).toBe(3);
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

    it('uses CategoriaPorData GSI with Publicado filter', async () => {
      mockSend.mockResolvedValueOnce({ Items: [] });
      await handler(
        event({ resource: '/categoria/{slug}', pathParameters: { slug: 'devops' } }),
        ctx,
        jest.fn(),
      );

      const cmd = mockSend.mock.calls[0][0];
      expect(cmd.input.IndexName).toBe('CategoriaPorData');
      expect(cmd.input.ExpressionAttributeValues[':published']).toBe('Publicado');
      expect(cmd.input.ExpressionAttributeValues[':cat']).toBe('devops');
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
    it('returns all published posts', async () => {
      mockSend.mockResolvedValueOnce({ Items: [POST_A, POST_B] });

      const result = await handler(event(), ctx, jest.fn());

      expect(result?.statusCode).toBe(200);
      const body = JSON.parse(result?.body ?? '{}');
      expect(body.posts).toHaveLength(2);
    });

    it('uses StatusPorData GSI with default limit 9', async () => {
      mockSend.mockResolvedValueOnce({ Items: [] });
      await handler(event(), ctx, jest.fn());

      const cmd = mockSend.mock.calls[0][0];
      expect(cmd.input.IndexName).toBe('StatusPorData');
      expect(cmd.input.Limit).toBe(9);
      expect(cmd.input.ExpressionAttributeValues[':status']).toBe('Publicado');
    });

    it('respects custom limit from query param', async () => {
      mockSend.mockResolvedValueOnce({ Items: [] });
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
