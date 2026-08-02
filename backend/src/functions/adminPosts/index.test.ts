// requireEnv() throws at module load if POSTS_TABLE/ADMIN_ORIGIN are unset —
// this must run before the `./index` import below, not in beforeAll (too late).
process.env.POSTS_TABLE = 'test-posts-table';
process.env.ADMIN_ORIGIN = 'https://test-admin.example.com';

import { APIGatewayEventRequestContext, APIGatewayProxyEvent, Context } from 'aws-lambda';
import { handler } from './index';
import { dynamo } from '../../common/dynamodb';
import { invalidatePostCache } from '../../common/cacheInvalidation';

jest.mock('../../common/dynamodb', () => ({
  dynamo: { send: jest.fn() },
}));

jest.mock('../../common/cacheInvalidation', () => ({
  invalidatePostCache: jest.fn(),
}));

const mockSend = dynamo.send as jest.Mock;
const mockInvalidatePostCache = invalidatePostCache as jest.Mock;

const ctx = {
  awsRequestId: 'req-admin-789',
  callbackWaitsForEmptyEventLoop: false,
  functionName: 'adminPosts',
  functionVersion: '$LATEST',
  invokedFunctionArn: 'arn:aws:lambda:us-east-1:123:function:adminPosts',
  memoryLimitInMB: '128',
  logGroupName: '/aws/lambda/adminPosts',
  logStreamName: '2026/01/01/[$LATEST]test',
  getRemainingTimeInMillis: () => 30000,
  done: jest.fn(),
  fail: jest.fn(),
  succeed: jest.fn(),
} as Context;

function event(overrides: Partial<APIGatewayProxyEvent> = {}): APIGatewayProxyEvent {
  return {
    body: null,
    headers: { Authorization: 'Bearer token' },
    httpMethod: 'GET',
    isBase64Encoded: false,
    multiValueHeaders: {},
    multiValueQueryStringParameters: null,
    path: '/admin/posts',
    pathParameters: null,
    queryStringParameters: null,
    requestContext: {} as APIGatewayEventRequestContext,
    resource: '/admin/posts',
    stageVariables: null,
    ...overrides,
  } as APIGatewayProxyEvent;
}

// The written Item lives in a different place depending on the write shape:
// plain Put (zero counter delta) vs TransactWrite (Put + counter ADD).
function writtenItem(cmd: { input: { Item?: unknown; TransactItems?: Array<{ Put?: { Item: unknown } }> } }) {
  return (cmd.input.Item ?? cmd.input.TransactItems?.[0]?.Put?.Item) as Record<string, unknown>;
}

const SAMPLE_POST = {
  slug: 'meu-post',
  titulo: 'Meu Post',
  autor_id: 'marcelo-goncalves',
  conteudo_html: '<p>Content</p>',
  resumo: 'Resumo',
  imagem_destaque_url: 'https://example.com/img.jpg',
  imagem_destaque_alt_text: 'Alt text',
  categoria_slug: 'aws',
  status: 'Publicado' as const,
  data_publicacao: '2026-01-01T00:00:00.000Z',
  data_atualizacao: '2026-01-01T00:00:00.000Z',
  tempo_leitura_min: 5,
  e_popular: 0,
  e_projeto: 0,
};

beforeAll(() => {
  process.env.POSTS_TABLE = 'test-posts-table';
  process.env.LOG_LEVEL = 'ERROR';
});

// Without this, values queued via mockResolvedValueOnce that a test doesn't
// consume leak into the next test, shifting the whole response queue.
beforeEach(() => {
  jest.resetAllMocks();
});

describe('adminPosts handler', () => {
  describe('OPTIONS (CORS preflight)', () => {
    it('returns 200 with empty body', async () => {
      const result = await handler(event({ httpMethod: 'OPTIONS' }), ctx, jest.fn());
      expect(result?.statusCode).toBe(200);
      expect(result?.body).toBe('');
      expect(mockSend).not.toHaveBeenCalled();
    });
  });

  describe('GET /admin/posts (list all)', () => {
    it('queries all three statuses and merges results', async () => {
      const published = { slug: 'a', status: 'Publicado' };
      const draft = { slug: 'b', status: 'Rascunho' };
      const scheduled = { slug: 'c', status: 'Programado' };

      mockSend
        .mockResolvedValueOnce({ Items: [published] })
        .mockResolvedValueOnce({ Items: [draft] })
        .mockResolvedValueOnce({ Items: [scheduled] });

      const result = await handler(event({ httpMethod: 'GET' }), ctx, jest.fn());

      expect(result?.statusCode).toBe(200);
      const body = JSON.parse(result?.body ?? '{}');
      expect(body.count).toBe(3);
      expect(body.items).toHaveLength(3);
      expect(mockSend).toHaveBeenCalledTimes(3);
    });

    it('uses StatusPorData GSI for each status', async () => {
      mockSend.mockResolvedValue({ Items: [] });
      await handler(event({ httpMethod: 'GET' }), ctx, jest.fn());

      const calls = mockSend.mock.calls as Array<[{ input: { ExpressionAttributeValues: Record<string, string> } }]>;
      const statuses = calls.map((c) => c[0].input.ExpressionAttributeValues[':status']);
      expect(statuses).toEqual(['Publicado', 'Rascunho', 'Programado']);
    });

    it('envia as 3 queries em paralelo — todas chegam mesmo que uma retorne vazio', async () => {
      mockSend
        .mockResolvedValueOnce({ Items: [{ slug: 'a', status: 'Publicado' }] })
        .mockResolvedValueOnce({ Items: [] })
        .mockResolvedValueOnce({ Items: [{ slug: 'c', status: 'Programado' }] });

      const result = await handler(event({ httpMethod: 'GET' }), ctx, jest.fn());
      const body = JSON.parse(result?.body ?? '{}');

      // Promise.all guarantees all 3 queries were fired
      expect(mockSend).toHaveBeenCalledTimes(3);
      // and the result combines items from all 3, even with an empty Rascunho
      expect(body.count).toBe(2);
      expect(body.items.map((i: { slug: string }) => i.slug)).toEqual(expect.arrayContaining(['a', 'c']));
    });

    it('usa ProjectionExpression para retornar apenas campos necessários', async () => {
      mockSend.mockResolvedValue({ Items: [] });
      await handler(event({ httpMethod: 'GET' }), ctx, jest.fn());

      const cmd = mockSend.mock.calls[0][0];
      expect(cmd.input.ProjectionExpression).toContain('slug');
      expect(cmd.input.ProjectionExpression).toContain('titulo');
    });
  });

  describe('GET /admin/posts/:slug (get one)', () => {
    it('returns the post when found', async () => {
      mockSend.mockResolvedValueOnce({ Item: SAMPLE_POST });

      const result = await handler(
        event({ httpMethod: 'GET', pathParameters: { slug: 'meu-post' } }),
        ctx,
        jest.fn(),
      );

      expect(result?.statusCode).toBe(200);
      const body = JSON.parse(result?.body ?? '{}');
      expect(body.slug).toBe('meu-post');
    });

    it('returns 404 when post not found', async () => {
      mockSend.mockResolvedValueOnce({ Item: undefined });

      const result = await handler(
        event({ httpMethod: 'GET', pathParameters: { slug: 'nao-existe' } }),
        ctx,
        jest.fn(),
      );

      expect(result?.statusCode).toBe(404);
    });
  });

  describe('POST /admin/posts (create)', () => {
    it('creates a new post and returns 200', async () => {
      mockSend.mockResolvedValueOnce({}); // PutCommand
      mockSend.mockResolvedValueOnce({}); // contador (post novo é Publicado → ADD total_publicado :1)

      const result = await handler(
        event({ httpMethod: 'POST', body: JSON.stringify(SAMPLE_POST) }),
        ctx,
        jest.fn(),
      );

      expect(result?.statusCode).toBe(200);
      const body = JSON.parse(result?.body ?? '{}');
      expect(body.message).toBe('Post saved');
      expect(body.slug).toBe('meu-post');
    });

    it('incrementa total_publicado na MESMA transação do Put ao criar um post Publicado', async () => {
      mockSend.mockResolvedValueOnce({}); // TransactWriteCommand (Put + contador)

      await handler(
        event({ httpMethod: 'POST', body: JSON.stringify(SAMPLE_POST) }),
        ctx,
        jest.fn(),
      );

      expect(mockSend).toHaveBeenCalledTimes(1);
      const transact = mockSend.mock.calls[0][0].input.TransactItems;
      expect(transact).toHaveLength(2);
      expect(transact[0].Put.Item.slug).toBe('meu-post');
      expect(transact[1].Update.UpdateExpression).toBe('ADD total_publicado :dt, total_projeto_publicado :dp');
      expect(transact[1].Update.ExpressionAttributeValues).toEqual({ ':dt': 1, ':dp': 0 });
    });

    it('usa um Put simples (sem transação) ao criar um Rascunho (delta zero)', async () => {
      mockSend.mockResolvedValueOnce({}); // PutCommand

      await handler(
        event({ httpMethod: 'POST', body: JSON.stringify({ ...SAMPLE_POST, status: 'Rascunho' }) }),
        ctx,
        jest.fn(),
      );

      expect(mockSend).toHaveBeenCalledTimes(1);
      expect(mockSend.mock.calls[0][0].input.TransactItems).toBeUndefined();
    });

    it('invalida /post/{slug} e "/" ao criar um post já Publicado', async () => {
      mockSend.mockResolvedValueOnce({}); // PutCommand
      mockSend.mockResolvedValueOnce({}); // contador

      await handler(
        event({ httpMethod: 'POST', body: JSON.stringify(SAMPLE_POST) }),
        ctx,
        jest.fn(),
      );

      expect(mockInvalidatePostCache).toHaveBeenCalledWith(['/post/meu-post', '/', '/artigos', '/todos-artigos', '/categoria/*']);
    });

    it('invalida só /post/{slug} (sem "/") ao criar um Rascunho', async () => {
      mockSend.mockResolvedValueOnce({}); // PutCommand

      await handler(
        event({ httpMethod: 'POST', body: JSON.stringify({ ...SAMPLE_POST, status: 'Rascunho' }) }),
        ctx,
        jest.fn(),
      );

      expect(mockInvalidatePostCache).toHaveBeenCalledWith(['/post/meu-post']);
    });

    it('returns 400 when slug is missing', async () => {
      const { slug, ...noSlug } = SAMPLE_POST;
      const result = await handler(
        event({ httpMethod: 'POST', body: JSON.stringify(noSlug) }),
        ctx,
        jest.fn(),
      );
      expect(result?.statusCode).toBe(400);
      expect(mockSend).not.toHaveBeenCalled();
    });

    it('returns 400 when titulo is missing', async () => {
      const { titulo, ...noTitulo } = SAMPLE_POST;
      const result = await handler(
        event({ httpMethod: 'POST', body: JSON.stringify(noTitulo) }),
        ctx,
        jest.fn(),
      );
      expect(result?.statusCode).toBe(400);
    });

    it('returns 400 when autor_id is missing', async () => {
      const { autor_id, ...noAutor } = SAMPLE_POST;
      const result = await handler(
        event({ httpMethod: 'POST', body: JSON.stringify(noAutor) }),
        ctx,
        jest.fn(),
      );
      expect(result?.statusCode).toBe(400);
    });

    it('sets data_atualizacao automatically', async () => {
      mockSend.mockResolvedValueOnce({});
      await handler(
        event({ httpMethod: 'POST', body: JSON.stringify(SAMPLE_POST) }),
        ctx,
        jest.fn(),
      );

      const sentCmd = mockSend.mock.calls[0][0];
      expect(writtenItem(sentCmd).data_atualizacao).toBeDefined();
    });

    it('converts e_popular and e_projeto to Number', async () => {
      mockSend.mockResolvedValueOnce({});
      const postWithBooleans = { ...SAMPLE_POST, e_popular: 1, e_projeto: 1 };
      await handler(
        event({ httpMethod: 'POST', body: JSON.stringify(postWithBooleans) }),
        ctx,
        jest.fn(),
      );

      const sentCmd = mockSend.mock.calls[0][0];
      expect(typeof writtenItem(sentCmd).e_popular).toBe('number');
      expect(typeof writtenItem(sentCmd).e_projeto).toBe('number');
    });

    it('descarta campos desconhecidos (mass assignment / overposting)', async () => {
      mockSend.mockResolvedValueOnce({});
      const postWithExtra = { ...SAMPLE_POST, isAdmin: true, e_popular_marker: 'POP' };
      await handler(
        event({ httpMethod: 'POST', body: JSON.stringify(postWithExtra) }),
        ctx,
        jest.fn(),
      );

      const sentCmd = mockSend.mock.calls[0][0];
      expect(writtenItem(sentCmd).isAdmin).toBeUndefined();
      // e_popular_marker is derived from e_popular server-side, never accepted from the client
      expect(writtenItem(sentCmd).e_popular_marker).toBeUndefined();
    });

    it('returns 400 when e_popular não é 0 ou 1', async () => {
      const postWithInvalidFlag = { ...SAMPLE_POST, e_popular: 2 };
      const result = await handler(
        event({ httpMethod: 'POST', body: JSON.stringify(postWithInvalidFlag) }),
        ctx,
        jest.fn(),
      );
      expect(result?.statusCode).toBe(400);
      expect(mockSend).not.toHaveBeenCalled();
    });

    it('returns 409 when the slug already exists (ConditionExpression rejects the Put)', async () => {
      const conditionalError = Object.assign(new Error('The conditional request failed'), {
        name: 'ConditionalCheckFailedException',
      });
      mockSend.mockRejectedValueOnce(conditionalError);

      const result = await handler(
        event({ httpMethod: 'POST', body: JSON.stringify(SAMPLE_POST) }),
        ctx,
        jest.fn(),
      );

      expect(result?.statusCode).toBe(409);
    });

    it('sends attribute_not_exists(slug) as the ConditionExpression', async () => {
      mockSend.mockResolvedValueOnce({}); // TransactWriteCommand (SAMPLE_POST is Publicado)
      await handler(
        event({ httpMethod: 'POST', body: JSON.stringify(SAMPLE_POST) }),
        ctx,
        jest.fn(),
      );

      const sentCmd = mockSend.mock.calls[0][0];
      expect(sentCmd.input.TransactItems[0].Put.ConditionExpression).toBe('attribute_not_exists(slug)');
    });

    it('sets version to 1 on a brand-new post', async () => {
      mockSend.mockResolvedValueOnce({});
      await handler(
        event({ httpMethod: 'POST', body: JSON.stringify(SAMPLE_POST) }),
        ctx,
        jest.fn(),
      );

      expect(writtenItem(mockSend.mock.calls[0][0]).version).toBe(1);
    });
  });

  describe('PUT /admin/posts/:slug (update)', () => {
    it('updates an existing post', async () => {
      mockSend.mockResolvedValueOnce({ Item: { status: 'Publicado', e_projeto: 0 } }); // Get (existing)
      mockSend.mockResolvedValueOnce({}); // PutCommand

      const result = await handler(
        event({
          httpMethod: 'PUT',
          pathParameters: { slug: 'meu-post' },
          body: JSON.stringify(SAMPLE_POST),
        }),
        ctx,
        jest.fn(),
      );

      expect(result?.statusCode).toBe(200);
      // same status (Publicado → Publicado) and same e_projeto: zero delta, no 3rd call
      expect(mockSend).toHaveBeenCalledTimes(2);
    });

    it('nunca grava data_publicacao vazia — cai para o valor existente quando o client manda "" (regressão: crashava o GSI esparso ProjetoPorData_v2)', async () => {
      mockSend.mockResolvedValueOnce({
        Item: { status: 'Rascunho', e_projeto: 0, data_publicacao: '2026-05-01T00:00:00.000Z' },
      }); // Get (existing)
      mockSend.mockResolvedValueOnce({}); // PutCommand

      await handler(
        event({
          httpMethod: 'PUT',
          pathParameters: { slug: 'meu-post' },
          body: JSON.stringify({ ...SAMPLE_POST, status: 'Rascunho', e_projeto: 1, data_publicacao: '' }),
        }),
        ctx,
        jest.fn(),
      );

      const sentCmd = mockSend.mock.calls[1][0];
      expect(sentCmd.input.Item.data_publicacao).toBe('2026-05-01T00:00:00.000Z');
      expect(sentCmd.input.Item.data_publicacao).not.toBe('');
    });

    it('atualiza o contador (na transação do Put) quando o status muda de Rascunho para Publicado', async () => {
      mockSend.mockResolvedValueOnce({ Item: { status: 'Rascunho', e_projeto: 0 } }); // Get (existing)
      mockSend.mockResolvedValueOnce({}); // TransactWriteCommand (Put + contador)

      await handler(
        event({
          httpMethod: 'PUT',
          pathParameters: { slug: 'meu-post' },
          body: JSON.stringify(SAMPLE_POST), // SAMPLE_POST.status === 'Publicado'
        }),
        ctx,
        jest.fn(),
      );

      expect(mockSend).toHaveBeenCalledTimes(2);
      const transact = mockSend.mock.calls[1][0].input.TransactItems;
      expect(transact[1].Update.ExpressionAttributeValues).toEqual({ ':dt': 1, ':dp': 0 });
    });

    it('decrementa o contador (na transação do Put) quando o status muda de Publicado para Rascunho', async () => {
      mockSend.mockResolvedValueOnce({ Item: { status: 'Publicado', e_projeto: 0 } }); // Get (existing)
      mockSend.mockResolvedValueOnce({}); // TransactWriteCommand (Put + contador)

      await handler(
        event({
          httpMethod: 'PUT',
          pathParameters: { slug: 'meu-post' },
          body: JSON.stringify({ ...SAMPLE_POST, status: 'Rascunho' }),
        }),
        ctx,
        jest.fn(),
      );

      const transact = mockSend.mock.calls[1][0].input.TransactItems;
      expect(transact[1].Update.ExpressionAttributeValues).toEqual({ ':dt': -1, ':dp': 0 });
    });

    it('invalida "/" também quando o status muda de Rascunho para Publicado', async () => {
      mockSend.mockResolvedValueOnce({ Item: { status: 'Rascunho', e_projeto: 0 } }); // Get (existing)
      mockSend.mockResolvedValueOnce({}); // TransactWriteCommand (Put + contador)

      await handler(
        event({
          httpMethod: 'PUT',
          pathParameters: { slug: 'meu-post' },
          body: JSON.stringify(SAMPLE_POST), // SAMPLE_POST.status === 'Publicado'
        }),
        ctx,
        jest.fn(),
      );

      expect(mockInvalidatePostCache).toHaveBeenCalledWith(['/post/meu-post', '/', '/artigos', '/todos-artigos', '/categoria/*']);
    });

    it('NÃO invalida "/" quando o post já era Publicado e continua Publicado (edição de conteúdo)', async () => {
      mockSend.mockResolvedValueOnce({ Item: { status: 'Publicado', e_projeto: 0 } }); // Get (existing)
      mockSend.mockResolvedValueOnce({}); // PutCommand

      await handler(
        event({
          httpMethod: 'PUT',
          pathParameters: { slug: 'meu-post' },
          body: JSON.stringify(SAMPLE_POST),
        }),
        ctx,
        jest.fn(),
      );

      expect(mockInvalidatePostCache).toHaveBeenCalledWith(['/post/meu-post']);
    });

    it('returns 400 on slug mismatch', async () => {
      const result = await handler(
        event({
          httpMethod: 'PUT',
          pathParameters: { slug: 'outro-slug' },
          body: JSON.stringify(SAMPLE_POST),
        }),
        ctx,
        jest.fn(),
      );

      expect(result?.statusCode).toBe(400);
    });

    it('returns 404 when updating a post that does not exist, without attempting a write', async () => {
      mockSend.mockResolvedValueOnce({ Item: undefined }); // Get finds nothing

      const result = await handler(
        event({
          httpMethod: 'PUT',
          pathParameters: { slug: 'meu-post' },
          body: JSON.stringify(SAMPLE_POST),
        }),
        ctx,
        jest.fn(),
      );

      expect(result?.statusCode).toBe(404);
      expect(mockSend).toHaveBeenCalledTimes(1); // only the Get, no Put attempted
    });

    it('sends attribute_exists(slug) as the ConditionExpression', async () => {
      mockSend.mockResolvedValueOnce({ Item: { status: 'Publicado', e_projeto: 0 } }); // Get
      mockSend.mockResolvedValueOnce({}); // Put

      await handler(
        event({
          httpMethod: 'PUT',
          pathParameters: { slug: 'meu-post' },
          body: JSON.stringify(SAMPLE_POST),
        }),
        ctx,
        jest.fn(),
      );

      expect(mockSend.mock.calls[1][0].input.ConditionExpression).toBe('attribute_exists(slug)');
    });

    it('increments version on update', async () => {
      mockSend.mockResolvedValueOnce({ Item: { status: 'Publicado', e_projeto: 0, version: 4 } }); // Get
      mockSend.mockResolvedValueOnce({}); // Put

      await handler(
        event({
          httpMethod: 'PUT',
          pathParameters: { slug: 'meu-post' },
          body: JSON.stringify(SAMPLE_POST),
        }),
        ctx,
        jest.fn(),
      );

      expect(writtenItem(mockSend.mock.calls[1][0]).version).toBe(5);
    });

    it('adds an extra version-match clause when the client echoes back the version it read', async () => {
      mockSend.mockResolvedValueOnce({ Item: { status: 'Publicado', e_projeto: 0, version: 4 } }); // Get
      mockSend.mockResolvedValueOnce({}); // Put

      await handler(
        event({
          httpMethod: 'PUT',
          pathParameters: { slug: 'meu-post' },
          body: JSON.stringify({ ...SAMPLE_POST, version: 4 }),
        }),
        ctx,
        jest.fn(),
      );

      const cmd = mockSend.mock.calls[1][0].input;
      expect(cmd.ConditionExpression).toBe('attribute_exists(slug) AND #version = :expectedVersion');
      expect(cmd.ExpressionAttributeValues).toEqual({ ':expectedVersion': 4 });
    });

    it('returns 409 when the version sent by the client is stale (concurrent edit)', async () => {
      mockSend.mockResolvedValueOnce({ Item: { status: 'Publicado', e_projeto: 0, version: 5 } }); // Get
      const conditionalError = Object.assign(new Error('The conditional request failed'), {
        name: 'ConditionalCheckFailedException',
      });
      mockSend.mockRejectedValueOnce(conditionalError);

      const result = await handler(
        event({
          httpMethod: 'PUT',
          pathParameters: { slug: 'meu-post' },
          body: JSON.stringify({ ...SAMPLE_POST, version: 4 }), // stale — real version is 5
        }),
        ctx,
        jest.fn(),
      );

      expect(result?.statusCode).toBe(409);
    });
  });

  describe('DELETE /admin/posts/:slug', () => {
    it('deletes the post and returns 200', async () => {
      mockSend.mockResolvedValueOnce({ Item: { status: 'Rascunho', e_projeto: 0 } }); // Get (existing)
      mockSend.mockResolvedValueOnce({}); // DeleteCommand

      const result = await handler(
        event({ httpMethod: 'DELETE', pathParameters: { slug: 'meu-post' } }),
        ctx,
        jest.fn(),
      );

      expect(result?.statusCode).toBe(200);
      expect(JSON.parse(result?.body ?? '{}').message).toBe('Post deleted');
      // Rascunho didn't count toward the aggregate: zero delta, no 3rd call
      expect(mockSend).toHaveBeenCalledTimes(2);
    });

    it('calls DynamoDB DeleteCommand with correct key', async () => {
      mockSend.mockResolvedValueOnce({ Item: { status: 'Rascunho', e_projeto: 0 } }); // Get (existing)
      mockSend.mockResolvedValueOnce({}); // DeleteCommand
      await handler(
        event({ httpMethod: 'DELETE', pathParameters: { slug: 'meu-post' } }),
        ctx,
        jest.fn(),
      );

      const cmd = mockSend.mock.calls[1][0]; // call[0] agora é o Get prévio
      expect(cmd.input.Key).toEqual({ slug: 'meu-post' });
    });

    it('decrementa o contador (na transação do Delete) ao deletar um post Publicado', async () => {
      mockSend.mockResolvedValueOnce({ Item: { status: 'Publicado', e_projeto: 1 } }); // Get (existing)
      mockSend.mockResolvedValueOnce({}); // TransactWriteCommand (Delete + contador)

      await handler(
        event({ httpMethod: 'DELETE', pathParameters: { slug: 'meu-post' } }),
        ctx,
        jest.fn(),
      );

      expect(mockSend).toHaveBeenCalledTimes(2);
      const transact = mockSend.mock.calls[1][0].input.TransactItems;
      expect(transact[0].Delete.Key).toEqual({ slug: 'meu-post' });
      expect(transact[1].Update.ExpressionAttributeValues).toEqual({ ':dt': -1, ':dp': -1 });
    });

    it('invalida /post/{slug} e "/" ao deletar um post Publicado', async () => {
      mockSend.mockResolvedValueOnce({ Item: { status: 'Publicado', e_projeto: 1 } }); // Get (existing)
      mockSend.mockResolvedValueOnce({}); // TransactWriteCommand (Delete + contador)

      await handler(
        event({ httpMethod: 'DELETE', pathParameters: { slug: 'meu-post' } }),
        ctx,
        jest.fn(),
      );

      expect(mockInvalidatePostCache).toHaveBeenCalledWith(['/post/meu-post', '/', '/artigos', '/todos-artigos', '/categoria/*']);
    });

    it('invalida só /post/{slug} (sem "/") ao deletar um Rascunho', async () => {
      mockSend.mockResolvedValueOnce({ Item: { status: 'Rascunho', e_projeto: 0 } }); // Get (existing)
      mockSend.mockResolvedValueOnce({}); // DeleteCommand

      await handler(
        event({ httpMethod: 'DELETE', pathParameters: { slug: 'meu-post' } }),
        ctx,
        jest.fn(),
      );

      expect(mockInvalidatePostCache).toHaveBeenCalledWith(['/post/meu-post']);
    });
  });

  describe('unknown method', () => {
    it('returns 405 Method Not Allowed', async () => {
      const result = await handler(event({ httpMethod: 'PATCH' }), ctx, jest.fn());
      expect(result?.statusCode).toBe(405);
    });
  });

  describe('CORS headers', () => {
    it('all responses include Access-Control-Allow-Origin', async () => {
      mockSend.mockResolvedValue({ Items: [] });
      const result = await handler(event({ httpMethod: 'GET' }), ctx, jest.fn());
      expect(result?.headers?.['Access-Control-Allow-Origin']).toBe('https://test-admin.example.com');
    });
  });
});
