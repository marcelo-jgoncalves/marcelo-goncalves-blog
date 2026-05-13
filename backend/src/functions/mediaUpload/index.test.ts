// backend/src/functions/mediaUpload/index.test.ts
import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { handler } from './index';

jest.mock('@aws-sdk/client-s3', () => ({
  S3Client: jest.fn().mockImplementation(() => ({ send: jest.fn() })),
  PutObjectCommand: jest.fn().mockImplementation((args) => args),
}));

jest.mock('@aws-sdk/s3-request-presigner', () => ({
  getSignedUrl: jest.fn().mockResolvedValue('https://s3.example.com/presigned'),
}));

jest.mock('../../common/logger', () => ({
  logger: { debug: jest.fn(), info: jest.fn(), error: jest.fn() },
}));

const ctx = { awsRequestId: 'req-test' } as Context;

function makeEvent(body: object | null, method = 'POST'): APIGatewayProxyEvent {
  return {
    httpMethod: method,
    body: body ? JSON.stringify(body) : null,
    headers: {},
    multiValueHeaders: {},
    isBase64Encoded: false,
    path: '/admin/media/upload-url',
    pathParameters: null,
    queryStringParameters: null,
    multiValueQueryStringParameters: null,
    stageVariables: null,
    requestContext: {} as any,
    resource: '',
  };
}

describe('mediaUpload', () => {
  beforeEach(() => {
    process.env.UPLOADS_BUCKET = 'uploads-bucket';
    process.env.ADMIN_ORIGIN = 'https://admin.example.com';
  });

  it('retorna uploadURL e basePath sem extensão', async () => {
    const res = await handler(makeEvent({ nome_arquivo: 'foto.jpg', tipo_arquivo: 'image/jpeg' }), ctx, jest.fn());
    expect(res!.statusCode).toBe(200);
    const body = JSON.parse(res!.body);
    expect(body.uploadURL).toBe('https://s3.example.com/presigned');
    expect(body.basePath).toMatch(/^media\//);
    expect(body.basePath).not.toMatch(/\.(webp|jpg|jpeg|png|heic|heif)$/);
  });

  it('basePath inclui prefixo de data YYYY/MM/DD', async () => {
    const res = await handler(makeEvent({ nome_arquivo: 'foto.jpg', tipo_arquivo: 'image/jpeg' }), ctx, jest.fn());
    const { basePath } = JSON.parse(res!.body);
    // Formato: media/YYYY/MM/DD/timestamp-random-nome
    expect(basePath).toMatch(/^media\/\d{4}\/\d{2}\/\d{2}\//);
  });

  it('basePath termina com o nome base do arquivo (sem extensão)', async () => {
    const res = await handler(makeEvent({ nome_arquivo: 'minha-foto.png', tipo_arquivo: 'image/png' }), ctx, jest.fn());
    const { basePath } = JSON.parse(res!.body);
    expect(basePath).toMatch(/minha-foto$/);
    expect(basePath).not.toContain('.png');
  });

  it('normaliza extensão maiúscula JPG → jpg no basePath', async () => {
    const res = await handler(makeEvent({ nome_arquivo: 'PHOTO.JPG', tipo_arquivo: 'image/jpeg' }), ctx, jest.fn());
    const { basePath } = JSON.parse(res!.body);
    expect(basePath).not.toContain('.JPG');
    expect(basePath).toMatch(/PHOTO$/);
  });

  it('normaliza extensão maiúscula PNG → png', async () => {
    const res = await handler(makeEvent({ nome_arquivo: 'Screenshot.PNG', tipo_arquivo: 'image/png' }), ctx, jest.fn());
    const { basePath } = JSON.parse(res!.body);
    expect(basePath).not.toContain('.PNG');
  });

  it('aceita WebP — gera basePath correto', async () => {
    const res = await handler(makeEvent({ nome_arquivo: 'design.webp', tipo_arquivo: 'image/webp' }), ctx, jest.fn());
    expect(res!.statusCode).toBe(200);
    const { basePath } = JSON.parse(res!.body);
    expect(basePath).toMatch(/design$/);
    expect(basePath).not.toContain('.webp');
  });

  it('aceita HEIC (iPhone) — gera basePath correto', async () => {
    const res = await handler(makeEvent({ nome_arquivo: 'photo.heic', tipo_arquivo: 'image/heic' }), ctx, jest.fn());
    expect(res!.statusCode).toBe(200);
    const { basePath } = JSON.parse(res!.body);
    expect(basePath).toMatch(/photo$/);
    expect(basePath).not.toContain('.heic');
  });

  it('responde 400 quando nome_arquivo está ausente', async () => {
    const res = await handler(makeEvent({ tipo_arquivo: 'image/jpeg' }), ctx, jest.fn());
    expect(res!.statusCode).toBe(400);
  });

  it('responde 400 quando tipo_arquivo está ausente', async () => {
    const res = await handler(makeEvent({ nome_arquivo: 'foto.jpg' }), ctx, jest.fn());
    expect(res!.statusCode).toBe(400);
  });

  it('responde 200 para OPTIONS (CORS preflight)', async () => {
    const res = await handler(makeEvent(null, 'OPTIONS'), ctx, jest.fn());
    expect(res!.statusCode).toBe(200);
  });
});
