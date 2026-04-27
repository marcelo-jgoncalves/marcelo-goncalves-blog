// backend/src/functions/imageProcessor/index.test.ts
import { S3Event } from 'aws-lambda';

const mockSend = jest.fn();
const mockToBuffer = jest.fn();

jest.mock('@aws-sdk/client-s3', () => ({
  S3Client: jest.fn().mockImplementation(() => ({ send: mockSend })),
  GetObjectCommand: jest.fn().mockImplementation((args) => ({ ...args, __type: 'Get' })),
  PutObjectCommand: jest.fn().mockImplementation((args) => ({ ...args, __type: 'Put' })),
}));

const mockSharpInstance = {
  resize: jest.fn().mockReturnThis(),
  toFormat: jest.fn().mockReturnThis(),
  toBuffer: mockToBuffer,
};
jest.mock('sharp', () => jest.fn().mockImplementation(() => mockSharpInstance));

jest.mock('../../common/logger', () => ({
  logger: { debug: jest.fn(), info: jest.fn(), error: jest.fn() },
}));

function makeS3Event(key: string): S3Event {
  return {
    Records: [{
      s3: {
        bucket: { name: 'uploads-bucket' },
        object: { key: encodeURIComponent(key) },
      },
    }],
  } as unknown as S3Event;
}

describe('imageProcessor', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.DESTINATION_BUCKET = 'assets-bucket';

    // S3 GetObject retorna um stream mockado
    const fakeStream = {
      on: jest.fn().mockImplementation(function (this: any, event: string, cb: any) {
        if (event === 'data') cb(Buffer.from('fake-image-data'));
        if (event === 'end') cb();
        return this;
      }),
    };
    mockSend.mockResolvedValue({ Body: fakeStream });
    mockToBuffer.mockResolvedValue(Buffer.from('processed'));
  });

  it('gera 6 variantes (480/768/1280 × avif/webp) para JPG', async () => {
    const { handler } = await import('./index');
    await handler(makeS3Event('photo.jpg'));

    const putCalls = mockSend.mock.calls.filter((c) => c[0].__type === 'Put');
    expect(putCalls).toHaveLength(6);

    const destKeys = putCalls.map((c) => c[0].Key as string);
    expect(destKeys).toContain('media/photo-480.avif');
    expect(destKeys).toContain('media/photo-480.webp');
    expect(destKeys).toContain('media/photo-768.avif');
    expect(destKeys).toContain('media/photo-768.webp');
    expect(destKeys).toContain('media/photo-1280.avif');
    expect(destKeys).toContain('media/photo-1280.webp');
  });

  it('gera 6 variantes para JPEG maiúsculo', async () => {
    const { handler } = await import('./index');
    await handler(makeS3Event('IMG_001.JPEG'));

    const putCalls = mockSend.mock.calls.filter((c) => c[0].__type === 'Put');
    expect(putCalls).toHaveLength(6);
  });

  it('gera 6 variantes para PNG', async () => {
    const { handler } = await import('./index');
    await handler(makeS3Event('banner.png'));

    const putCalls = mockSend.mock.calls.filter((c) => c[0].__type === 'Put');
    expect(putCalls).toHaveLength(6);
  });

  it('ignora arquivos sem extensão suportada', async () => {
    const { handler } = await import('./index');
    await handler(makeS3Event('document.pdf'));

    expect(mockSend).not.toHaveBeenCalled();
  });

  it('usa Cache-Control imutável em todas as variantes', async () => {
    const { handler } = await import('./index');
    await handler(makeS3Event('hero.jpg'));

    const putCalls = mockSend.mock.calls.filter((c) => c[0].__type === 'Put');
    for (const call of putCalls) {
      expect(call[0].CacheControl).toBe('public, max-age=31536000, immutable');
    }
  });

  it('define ContentType correto para AVIF e WebP', async () => {
    const { handler } = await import('./index');
    await handler(makeS3Event('img.png'));

    const putCalls = mockSend.mock.calls.filter((c) => c[0].__type === 'Put');
    const avifCalls = putCalls.filter((c) => (c[0].Key as string).endsWith('.avif'));
    const webpCalls = putCalls.filter((c) => (c[0].Key as string).endsWith('.webp'));

    expect(avifCalls).toHaveLength(3);
    expect(webpCalls).toHaveLength(3);
    avifCalls.forEach((c) => expect(c[0].ContentType).toBe('image/avif'));
    webpCalls.forEach((c) => expect(c[0].ContentType).toBe('image/webp'));
  });

  it('propaga erro e relança para retry do Lambda', async () => {
    mockSend.mockRejectedValueOnce(new Error('S3 falhou'));
    const { handler } = await import('./index');
    await expect(handler(makeS3Event('img.jpg'))).rejects.toThrow('S3 falhou');
  });
});
