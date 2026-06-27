// backend/src/functions/imageProcessor/index.test.ts
import { S3Event } from 'aws-lambda';

const mockS3Send    = jest.fn();
const mockDynSend   = jest.fn();
const mockToBuffer  = jest.fn();

jest.mock('@aws-sdk/client-s3', () => ({
  S3Client: jest.fn().mockImplementation(() => ({ send: mockS3Send })),
  GetObjectCommand: jest.fn().mockImplementation((args) => ({ ...args, __type: 'Get' })),
  PutObjectCommand: jest.fn().mockImplementation((args) => ({ ...args, __type: 'Put' })),
}));

jest.mock('@aws-sdk/client-dynamodb', () => ({
  DynamoDBClient: jest.fn().mockImplementation(() => ({})),
}));

jest.mock('@aws-sdk/lib-dynamodb', () => ({
  DynamoDBDocumentClient: { from: jest.fn().mockReturnValue({ send: mockDynSend }) },
  ScanCommand:   jest.fn().mockImplementation((args) => ({ ...args, __type: 'Scan' })),
  UpdateCommand: jest.fn().mockImplementation((args) => ({ ...args, __type: 'Update' })),
}));

const mockSharpInstance = {
  resize:   jest.fn().mockReturnThis(),
  toFormat: jest.fn().mockReturnThis(),
  toBuffer: mockToBuffer,
};
jest.mock('sharp', () => jest.fn().mockImplementation(() => mockSharpInstance));

jest.mock('../../common/logger', () => ({
  logger: { debug: jest.fn(), info: jest.fn(), warn: jest.fn(), error: jest.fn() },
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
    delete process.env.POSTS_TABLE;

    interface FakeStream {
      on: (event: string, cb: (chunk?: Buffer) => void) => FakeStream;
    }
    const fakeStream: FakeStream = {
      on: jest.fn().mockImplementation(function (this: FakeStream, event: string, cb: (chunk?: Buffer) => void) {
        if (event === 'data') cb(Buffer.from('fake-image-data'));
        if (event === 'end')  cb();
        return this;
      }),
    };
    mockS3Send.mockResolvedValue({ Body: fakeStream });
    mockToBuffer.mockResolvedValue(Buffer.from('processed'));
    mockDynSend.mockResolvedValue({ Items: [] });
  });

  it('gera 7 variantes (480/768/1280 × avif/webp + lqip) para JPG', async () => {
    const { handler } = await import('./index');
    await handler(makeS3Event('photo.jpg'));

    const putCalls = mockS3Send.mock.calls.filter((c) => c[0].__type === 'Put');
    expect(putCalls).toHaveLength(7);

    const destKeys = putCalls.map((c) => c[0].Key as string);
    expect(destKeys).toContain('media/photo-480.avif');
    expect(destKeys).toContain('media/photo-480.webp');
    expect(destKeys).toContain('media/photo-768.avif');
    expect(destKeys).toContain('media/photo-768.webp');
    expect(destKeys).toContain('media/photo-1280.avif');
    expect(destKeys).toContain('media/photo-1280.webp');
    expect(destKeys).toContain('media/photo-lqip.webp');
  });

  it('gera 7 variantes para JPEG maiúsculo', async () => {
    const { handler } = await import('./index');
    await handler(makeS3Event('IMG_001.JPEG'));

    const putCalls = mockS3Send.mock.calls.filter((c) => c[0].__type === 'Put');
    expect(putCalls).toHaveLength(7);
  });

  it('gera 7 variantes para PNG', async () => {
    const { handler } = await import('./index');
    await handler(makeS3Event('banner.png'));

    const putCalls = mockS3Send.mock.calls.filter((c) => c[0].__type === 'Put');
    expect(putCalls).toHaveLength(7);
  });

  it('gera 7 variantes para WebP', async () => {
    const { handler } = await import('./index');
    await handler(makeS3Event('screenshot.webp'));

    const putCalls = mockS3Send.mock.calls.filter((c) => c[0].__type === 'Put');
    expect(putCalls).toHaveLength(7);
  });

  it('gera 7 variantes para HEIC (formato padrão iPhone)', async () => {
    const { handler } = await import('./index');
    await handler(makeS3Event('iphone-photo.heic'));

    const putCalls = mockS3Send.mock.calls.filter((c) => c[0].__type === 'Put');
    expect(putCalls).toHaveLength(7);
  });

  it('gera 7 variantes para HEIF', async () => {
    const { handler } = await import('./index');
    await handler(makeS3Event('photo.heif'));

    const putCalls = mockS3Send.mock.calls.filter((c) => c[0].__type === 'Put');
    expect(putCalls).toHaveLength(7);
  });

  it('ignora arquivos sem extensão suportada', async () => {
    const { handler } = await import('./index');
    await handler(makeS3Event('document.pdf'));

    expect(mockS3Send).not.toHaveBeenCalled();
    expect(mockDynSend).not.toHaveBeenCalled();
  });

  it('usa Cache-Control imutável em todas as variantes', async () => {
    const { handler } = await import('./index');
    await handler(makeS3Event('hero.jpg'));

    const putCalls = mockS3Send.mock.calls.filter((c) => c[0].__type === 'Put');
    for (const call of putCalls) {
      expect(call[0].CacheControl).toBe('public, max-age=31536000, immutable');
    }
  });

  it('define ContentType correto para AVIF e WebP', async () => {
    const { handler } = await import('./index');
    await handler(makeS3Event('img.png'));

    const putCalls = mockS3Send.mock.calls.filter((c) => c[0].__type === 'Put');
    const avifCalls = putCalls.filter((c) => (c[0].Key as string).endsWith('.avif'));
    const webpCalls = putCalls.filter((c) => (c[0].Key as string).endsWith('.webp'));

    expect(avifCalls).toHaveLength(3);
    expect(webpCalls).toHaveLength(4); // 3 standard + 1 LQIP
    avifCalls.forEach((c) => expect(c[0].ContentType).toBe('image/avif'));
    webpCalls.forEach((c) => expect(c[0].ContentType).toBe('image/webp'));
  });

  it('propaga erro e relança para retry do Lambda', async () => {
    mockS3Send.mockRejectedValueOnce(new Error('S3 falhou'));
    const { handler } = await import('./index');
    await expect(handler(makeS3Event('img.jpg'))).rejects.toThrow('S3 falhou');
  });

  // --- Testes LQIP + DynamoDB ---

  it('não tenta salvar no DynamoDB quando POSTS_TABLE não está definida', async () => {
    // POSTS_TABLE deletado no beforeEach
    const { handler } = await import('./index');
    await handler(makeS3Event('hero.jpg'));

    expect(mockDynSend).not.toHaveBeenCalled();
  });

  it('faz Scan no DynamoDB com basename correto quando POSTS_TABLE está definida', async () => {
    process.env.POSTS_TABLE = 'posts-table';
    mockDynSend.mockResolvedValue({ Items: [] }); // nenhum post encontrado

    const { handler } = await import('./index');
    await handler(makeS3Event('hero.jpg'));

    const scanCalls = mockDynSend.mock.calls.filter((c) => c[0].__type === 'Scan');
    expect(scanCalls).toHaveLength(1);
    expect(scanCalls[0][0].FilterExpression).toContain('contains(imagem_destaque_url');
    expect(scanCalls[0][0].ExpressionAttributeValues[':basename']).toBe('hero');
  });

  it('faz UpdateItem com data URI base64 quando post é encontrado', async () => {
    process.env.POSTS_TABLE = 'posts-table';
    mockDynSend
      .mockResolvedValueOnce({ Items: [{ slug: 'meu-post' }] }) // Scan
      .mockResolvedValueOnce({});                                 // UpdateItem

    const { handler } = await import('./index');
    await handler(makeS3Event('hero.jpg'));

    const updateCalls = mockDynSend.mock.calls.filter((c) => c[0].__type === 'Update');
    expect(updateCalls).toHaveLength(1);
    expect(updateCalls[0][0].Key).toEqual({ slug: 'meu-post' });

    const lqipValue = updateCalls[0][0].ExpressionAttributeValues[':lqip'] as string;
    expect(lqipValue).toMatch(/^data:image\/webp;base64,/);
  });

  it('atualiza múltiplos posts se a mesma imagem for usada em mais de um', async () => {
    process.env.POSTS_TABLE = 'posts-table';
    mockDynSend
      .mockResolvedValueOnce({ Items: [{ slug: 'post-a' }, { slug: 'post-b' }] })
      .mockResolvedValue({});

    const { handler } = await import('./index');
    await handler(makeS3Event('shared-img.jpg'));

    const updateCalls = mockDynSend.mock.calls.filter((c) => c[0].__type === 'Update');
    expect(updateCalls).toHaveLength(2);
    const slugs = updateCalls.map((c) => c[0].Key.slug);
    expect(slugs).toContain('post-a');
    expect(slugs).toContain('post-b');
  });

  it('não lança erro se UpdateItem falhar — degrada silenciosamente', async () => {
    process.env.POSTS_TABLE = 'posts-table';
    mockDynSend
      .mockResolvedValueOnce({ Items: [{ slug: 'meu-post' }] })
      .mockRejectedValueOnce(new Error('DynamoDB indisponível'));

    const { handler } = await import('./index');
    // Não deve lançar — o erro do DynamoDB é logado como warn e ignorado
    await expect(handler(makeS3Event('hero.jpg'))).resolves.not.toThrow();
  });

  it('não lança erro se Scan falhar — degrada silenciosamente', async () => {
    process.env.POSTS_TABLE = 'posts-table';
    mockDynSend.mockRejectedValueOnce(new Error('Scan error'));

    const { handler } = await import('./index');
    await expect(handler(makeS3Event('hero.jpg'))).resolves.not.toThrow();
  });
});
