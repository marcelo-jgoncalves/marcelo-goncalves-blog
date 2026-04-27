// backend/src/functions/mediaUpload/index.test.ts
import { APIGatewayProxyEvent, Context } from 'aws-lambda';

const mockSend = jest.fn();
const mockGetSignedUrl = jest.fn().mockResolvedValue('https://s3.example.com/presigned');

jest.mock('@aws-sdk/client-s3', () => ({
  S3Client: jest.fn().mockImplementation(() => ({ send: mockSend })),
  PutObjectCommand: jest.fn().mockImplementation((args) => args),
}));
jest.mock('@aws-sdk/s3-request-presigner', () => ({ getSignedUrl: mockGetSignedUrl }));
jest.mock('../../common/logger', () => ({
  logger: { debug: jest.fn(), info: jest.fn(), error: jest.fn() },
}));

function makeEvent(body: object): APIGatewayProxyEvent {
  return {
    httpMethod: 'POST',
    body: JSON.stringify(body),
    headers: {},
  } as unknown as APIGatewayProxyEvent;
}

const ctx = { awsRequestId: 'req-test' } as Context;

describe('mediaUpload', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.UPLOADS_BUCKET = 'uploads-bucket';
  });

  it('retorna basePath sem extensão para uso no ResponsiveImage', async () => {
    const { handler } = await import('./index');
    const res = await handler(makeEvent({ nome_arquivo: 'foto.jpg', tipo_arquivo: 'image/jpeg' }), ctx, jest.fn());

    expect(res!.statusCode).toBe(200);
    const body = JSON.parse(res!.body);

    expect(body.uploadURL).toBe('https://s3.example.com/presigned');
    expect(body.basePath).toMatch(/^media\/.+-foto$/);   // sem extensão
    expect(body.basePath).not.toMatch(/\.webp$/);
    expect(body.basePath).not.toMatch(/\.jpg$/);
  });

  it('basePath não contém a extensão original do arquivo', async () => {
    const { handler } = await import('./index');
    const res = await handler(makeEvent({ nome_arquivo: 'banner.png', tipo_arquivo: 'image/png' }), ctx, jest.fn());
    const { basePath } = JSON.parse(res!.body);
    expect(basePath).not.toContain('.png');
    expect(basePath).not.toContain('.webp');
  });

  it('responde 400 quando faltam parâmetros', async () => {
    const { handler } = await import('./index');
    const res = await handler(makeEvent({ nome_arquivo: 'x.jpg' }), ctx, jest.fn());
    expect(res!.statusCode).toBe(400);
  });

  it('responde 200 para OPTIONS (preflight CORS)', async () => {
    const { handler } = await import('./index');
    const event = { httpMethod: 'OPTIONS', body: null } as unknown as APIGatewayProxyEvent;
    const res = await handler(event, ctx, jest.fn());
    expect(res!.statusCode).toBe(200);
  });
});
