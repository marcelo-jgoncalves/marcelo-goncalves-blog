import { APIGatewayEventRequestContext, APIGatewayProxyEvent, Context } from 'aws-lambda';
import { handler } from './index';
import { dynamo } from '../../common/dynamodb';
import { verifyIdToken } from '../../common/cognitoJwt';

jest.mock('../../common/dynamodb', () => ({
  dynamo: { send: jest.fn() },
}));

jest.mock('../../common/cognitoJwt', () => ({
  verifyIdToken: jest.fn(),
}));

const mockSend = dynamo.send as jest.Mock;
const mockVerifyIdToken = verifyIdToken as jest.Mock;

const ctx = {
  awsRequestId: 'req-session-123',
  callbackWaitsForEmptyEventLoop: false,
  functionName: 'adminSession',
  functionVersion: '$LATEST',
  invokedFunctionArn: 'arn:aws:lambda:us-east-1:123:function:adminSession',
  memoryLimitInMB: '128',
  logGroupName: '/aws/lambda/adminSession',
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
    path: '/admin/session',
    pathParameters: null,
    queryStringParameters: null,
    requestContext: {} as APIGatewayEventRequestContext,
    resource: '/admin/session',
    stageVariables: null,
    ...overrides,
  } as APIGatewayProxyEvent;
}

describe('adminSession handler', () => {
  beforeEach(() => {
    mockSend.mockReset();
    mockVerifyIdToken.mockReset();
  });

  it('responde OPTIONS sem tocar no Dynamo', async () => {
    const res = await handler(event({ httpMethod: 'OPTIONS' }), ctx, jest.fn());
    expect(res?.statusCode).toBe(200);
    expect(mockSend).not.toHaveBeenCalled();
  });

  describe('POST (login)', () => {
    it('400 quando idToken não vem no body', async () => {
      const res = await handler(event({ httpMethod: 'POST', body: JSON.stringify({}) }), ctx, jest.fn());
      expect(res?.statusCode).toBe(400);
    });

    it('401 quando o idToken é inválido', async () => {
      mockVerifyIdToken.mockRejectedValue(new Error('invalid token'));
      const res = await handler(
        event({ httpMethod: 'POST', body: JSON.stringify({ idToken: 'bad' }) }),
        ctx,
        jest.fn(),
      );
      expect(res?.statusCode).toBe(401);
    });

    it('200 + Set-Cookie httpOnly quando o idToken é válido', async () => {
      mockVerifyIdToken.mockResolvedValue({ sub: 'user-sub-1', email: 'marcelo@example.com', username: 'marcelo-goncalves' });
      mockSend.mockResolvedValue({});

      const res = await handler(
        event({ httpMethod: 'POST', body: JSON.stringify({ idToken: 'good-token' }) }),
        ctx,
        jest.fn(),
      );

      expect(res?.statusCode).toBe(200);
      expect(JSON.parse(res?.body ?? '{}')).toEqual({ email: 'marcelo@example.com', username: 'marcelo-goncalves' });
      expect(res?.headers?.['Set-Cookie']).toMatch(/^admin_session=[0-9a-f-]{36}; HttpOnly; Secure; SameSite=Strict; Path=\/; Max-Age=3600$/);
      expect(mockSend).toHaveBeenCalledTimes(1); // session PutCommand
    });
  });

  describe('GET (me)', () => {
    it('401 sem cookie de sessão', async () => {
      const res = await handler(event({ httpMethod: 'GET', headers: {} }), ctx, jest.fn());
      expect(res?.statusCode).toBe(401);
    });

    it('401 quando a sessão não existe/expirou', async () => {
      mockSend.mockResolvedValue({ Item: undefined });
      const res = await handler(
        event({ httpMethod: 'GET', headers: { Cookie: 'admin_session=abc-123' } }),
        ctx,
        jest.fn(),
      );
      expect(res?.statusCode).toBe(401);
    });

    it('200 quando a sessão é válida', async () => {
      const future = Math.floor(Date.now() / 1000) + 600;
      mockSend.mockResolvedValue({ Item: { session_id: 'abc-123', sub: 'user-sub-1', email: 'marcelo@example.com', username: 'marcelo-goncalves', expires_at: future } });
      const res = await handler(
        event({ httpMethod: 'GET', headers: { Cookie: 'admin_session=abc-123' } }),
        ctx,
        jest.fn(),
      );
      expect(res?.statusCode).toBe(200);
      expect(JSON.parse(res?.body ?? '{}')).toEqual({ email: 'marcelo@example.com', username: 'marcelo-goncalves' });
    });
  });

  describe('DELETE (logout)', () => {
    it('200 e limpa o cookie mesmo sem sessão prévia', async () => {
      const res = await handler(event({ httpMethod: 'DELETE', headers: {} }), ctx, jest.fn());
      expect(res?.statusCode).toBe(200);
      expect(res?.headers?.['Set-Cookie']).toBe('admin_session=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0');
      expect(mockSend).not.toHaveBeenCalled();
    });

    it('200 e apaga a sessão quando o cookie existe', async () => {
      mockSend.mockResolvedValue({});
      const res = await handler(
        event({ httpMethod: 'DELETE', headers: { Cookie: 'admin_session=abc-123' } }),
        ctx,
        jest.fn(),
      );
      expect(res?.statusCode).toBe(200);
      expect(mockSend).toHaveBeenCalledTimes(1); // DeleteCommand
    });
  });

  it('405 para método não suportado', async () => {
    const res = await handler(event({ httpMethod: 'PATCH' }), ctx, jest.fn());
    expect(res?.statusCode).toBe(405);
  });

  it('500 quando o Dynamo falha', async () => {
    mockVerifyIdToken.mockResolvedValue({ sub: 'user-sub-1', email: 'marcelo@example.com', username: 'marcelo-goncalves' });
    mockSend.mockRejectedValue(new Error('Throttled'));
    const res = await handler(
      event({ httpMethod: 'POST', body: JSON.stringify({ idToken: 'good-token' }) }),
      ctx,
      jest.fn(),
    );
    expect(res?.statusCode).toBe(500);
    expect(JSON.parse(res?.body ?? '{}').requestId).toBe('req-session-123');
  });
});
