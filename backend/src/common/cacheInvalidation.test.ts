const mockSend = jest.fn();

jest.mock('@aws-sdk/client-cloudfront', () => ({
  CloudFrontClient: jest.fn().mockImplementation(() => ({ send: mockSend })),
  CreateInvalidationCommand: jest.fn().mockImplementation((input) => ({ input })),
}));

jest.mock('./logger', () => ({
  logger: { warn: jest.fn() },
}));

describe('invalidatePostCache', () => {
  beforeEach(() => {
    jest.resetModules();
    mockSend.mockReset();
    process.env.FRONTEND_DISTRIBUTION_ID = 'E1XI31PS4HFJIH';
  });

  it('não chama o CloudFront quando a lista de paths está vazia', async () => {
    const { invalidatePostCache } = await import('./cacheInvalidation');
    await invalidatePostCache([]);
    expect(mockSend).not.toHaveBeenCalled();
  });

  it('não chama o CloudFront quando FRONTEND_DISTRIBUTION_ID não está definido', async () => {
    delete process.env.FRONTEND_DISTRIBUTION_ID;
    const { invalidatePostCache } = await import('./cacheInvalidation');
    await invalidatePostCache(['/post/exemplo']);
    expect(mockSend).not.toHaveBeenCalled();
  });

  it('cria a invalidação com os paths e o DistributionId corretos', async () => {
    mockSend.mockResolvedValueOnce({});
    const { invalidatePostCache } = await import('./cacheInvalidation');
    await invalidatePostCache(['/post/exemplo', '/']);

    const cmd = mockSend.mock.calls[0][0];
    expect(cmd.input.DistributionId).toBe('E1XI31PS4HFJIH');
    expect(cmd.input.InvalidationBatch.Paths).toEqual({ Quantity: 2, Items: ['/post/exemplo', '/'] });
    expect(cmd.input.InvalidationBatch.CallerReference).toContain('/post/exemplo');
  });

  it('best-effort: falha do CloudFront não lança, só registra warn', async () => {
    mockSend.mockRejectedValueOnce(new Error('boom'));
    const { invalidatePostCache } = await import('./cacheInvalidation');
    const { logger } = await import('./logger');

    await expect(invalidatePostCache(['/post/exemplo'])).resolves.toBeUndefined();
    expect(logger.warn).toHaveBeenCalledWith(
      'cache_invalidation_failed',
      expect.objectContaining({ paths: ['/post/exemplo'] }),
    );
  });
});
