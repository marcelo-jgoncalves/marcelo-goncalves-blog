import { APIGatewayEventRequestContextWithAuthorizer, APIGatewayRequestAuthorizerEvent, Context } from 'aws-lambda';
import { handler } from './index';
import { dynamo } from '../../common/dynamodb';

jest.mock('../../common/dynamodb', () => ({
  dynamo: { send: jest.fn() },
}));

const mockSend = dynamo.send as jest.Mock;

const METHOD_ARN = 'arn:aws:execute-api:us-east-1:123:abc/v1/GET/admin/posts';

const ctx = {} as Context;

function event(headers: Record<string, string> = {}): APIGatewayRequestAuthorizerEvent {
  return {
    type: 'REQUEST',
    methodArn: METHOD_ARN,
    resource: '/admin/posts',
    path: '/admin/posts',
    httpMethod: 'GET',
    headers,
    multiValueHeaders: {},
    pathParameters: null,
    queryStringParameters: null,
    multiValueQueryStringParameters: null,
    stageVariables: null,
    requestContext: {} as APIGatewayEventRequestContextWithAuthorizer<undefined>,
  };
}

describe('adminAuthorizer handler', () => {
  beforeEach(() => {
    mockSend.mockReset();
  });

  it('Allow quando o cookie de sessão é válido', async () => {
    const future = Math.floor(Date.now() / 1000) + 600;
    mockSend.mockResolvedValue({ Item: { session_id: 'abc-123', sub: 'user-sub-1', email: 'e@x.com', username: 'user1', expires_at: future } });

    const result = await handler(event({ Cookie: 'admin_session=abc-123' }), ctx, jest.fn());

    expect(result?.policyDocument.Statement[0].Effect).toBe('Allow');
    expect(result?.principalId).toBe('user-sub-1');
  });

  it('Deny quando o cookie de sessão não existe/expirou no Dynamo', async () => {
    mockSend.mockResolvedValue({ Item: undefined });
    const result = await handler(event({ Cookie: 'admin_session=expirado' }), ctx, jest.fn());
    expect(result?.policyDocument.Statement[0].Effect).toBe('Deny');
  });

  it('Deny quando um Authorization Bearer é enviado sem cookie (fallback legado removido)', async () => {
    const result = await handler(event({ Authorization: 'Bearer any-token' }), ctx, jest.fn());
    expect(result?.policyDocument.Statement[0].Effect).toBe('Deny');
    expect(mockSend).not.toHaveBeenCalled();
  });

  it('Deny quando não há cookie nem Authorization header', async () => {
    const result = await handler(event({}), ctx, jest.fn());
    expect(result?.policyDocument.Statement[0].Effect).toBe('Deny');
    expect(mockSend).not.toHaveBeenCalled();
  });
});
