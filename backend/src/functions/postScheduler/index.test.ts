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

beforeAll(() => {
  process.env.POSTS_TABLE = 'test-posts-table';
  process.env.LOG_LEVEL = 'ERROR';
});

describe('postScheduler handler', () => {
  describe('no posts to publish', () => {
    it('returns without updating when no scheduled posts due', async () => {
      mockSend.mockResolvedValueOnce({ Items: [], LastEvaluatedKey: undefined });

      await expect(handler({})).resolves.toBeUndefined();
      expect(mockSend).toHaveBeenCalledTimes(1);
    });

    it('queries StatusProgramadoPorData GSI with status=Programado and now as upper bound', async () => {
      mockSend.mockResolvedValueOnce({ Items: [] });

      await handler({});

      const cmd = mockSend.mock.calls[0][0];
      expect(cmd.input.IndexName).toBe('StatusProgramadoPorData');
      expect(cmd.input.ExpressionAttributeValues[':programado']).toBe('Programado');
      expect(cmd.input.ExpressionAttributeValues[':now']).toBeDefined();
    });
  });

  describe('posts to publish', () => {
    it('calls UpdateItem for each scheduled post (+ atualização do contador agregado)', async () => {
      const scheduledPosts = [
        { slug: 'post-a', data_publicacao_programada: '2026-01-01T00:00:00.000Z' },
        { slug: 'post-b', data_publicacao_programada: '2026-01-02T00:00:00.000Z' },
      ];

      mockSend
        .mockResolvedValueOnce({ Items: scheduledPosts, LastEvaluatedKey: undefined })
        .mockResolvedValue({});

      await handler({});

      // 1 Query + (1 UpdateItem de status + 1 ADD no contador) por post publicado
      expect(mockSend).toHaveBeenCalledTimes(5);
    });

    it('incrementa total_publicado ao publicar (Programado nunca contava no agregado)', async () => {
      const post = { slug: 'my-post', data_publicacao_programada: '2026-01-01T00:00:00.000Z', e_projeto: 1 };
      mockSend
        .mockResolvedValueOnce({ Items: [post] }) // Query
        .mockResolvedValueOnce({}) // UpdateItem (status)
        .mockResolvedValueOnce({}); // contador

      await handler({});

      const counterCmd = mockSend.mock.calls[2][0];
      expect(counterCmd.input.ExpressionAttributeValues).toEqual({ ':dt': 1, ':dp': 1 });
    });

    it('invalida /post/{slug} e "/" ao publicar (sempre afeta a home)', async () => {
      const post = { slug: 'my-post', data_publicacao_programada: '2026-01-01T00:00:00.000Z' };
      mockSend
        .mockResolvedValueOnce({ Items: [post] }) // Query
        .mockResolvedValueOnce({}) // UpdateItem (status)
        .mockResolvedValueOnce({}); // contador

      await handler({});

      expect(mockInvalidatePostCache).toHaveBeenCalledWith(['/post/my-post', '/']);
    });

    it('updates status to Publicado for each post', async () => {
      const post = { slug: 'my-post', data_publicacao_programada: '2026-01-01T00:00:00.000Z' };
      mockSend
        .mockResolvedValueOnce({ Items: [post] })
        .mockResolvedValueOnce({});

      await handler({});

      const updateCmd = mockSend.mock.calls[1][0];
      expect(updateCmd.input.Key).toEqual({ slug: 'my-post' });
      expect(updateCmd.input.ExpressionAttributeValues[':published']).toBe('Publicado');
      expect(updateCmd.input.ExpressionAttributeValues[':scheduledDate']).toBe(post.data_publicacao_programada);
    });

    it('uses ConditionExpression to avoid double-publish race condition', async () => {
      const post = { slug: 'my-post', data_publicacao_programada: '2026-01-01T00:00:00.000Z' };
      mockSend
        .mockResolvedValueOnce({ Items: [post] })
        .mockResolvedValueOnce({});

      await handler({});

      const updateCmd = mockSend.mock.calls[1][0];
      expect(updateCmd.input.ConditionExpression).toBe('#status = :programado');
    });

    it('continues publishing other posts when one UpdateItem fails', async () => {
      const posts = [
        { slug: 'post-ok', data_publicacao_programada: '2026-01-01T00:00:00.000Z' },
        { slug: 'post-fail', data_publicacao_programada: '2026-01-02T00:00:00.000Z' },
      ];

      mockSend
        .mockResolvedValueOnce({ Items: posts })
        .mockRejectedValueOnce(new Error('ConditionalCheckFailedException'))
        .mockResolvedValueOnce({});

      await expect(handler({})).resolves.toBeUndefined();
    });
  });

  describe('pagination', () => {
    it('follows LastEvaluatedKey to fetch all pages', async () => {
      const page1LastKey = { slug: 'post-a', status: 'Programado' };

      mockSend
        .mockResolvedValueOnce({ Items: [{ slug: 'post-a', data_publicacao_programada: '2026-01-01T00:00:00.000Z' }], LastEvaluatedKey: page1LastKey })
        .mockResolvedValueOnce({ Items: [{ slug: 'post-b', data_publicacao_programada: '2026-01-02T00:00:00.000Z' }], LastEvaluatedKey: undefined })
        .mockResolvedValue({});

      await handler({});

      const firstQuery = mockSend.mock.calls[0][0];
      const secondQuery = mockSend.mock.calls[1][0];
      expect(firstQuery.input.ExclusiveStartKey).toBeUndefined();
      expect(secondQuery.input.ExclusiveStartKey).toEqual(page1LastKey);
    });
  });

  describe('error handling', () => {
    it('throws when DynamoDB query itself fails', async () => {
      mockSend.mockRejectedValueOnce(new Error('DynamoDB unavailable'));
      await expect(handler({})).rejects.toThrow('DynamoDB unavailable');
    });
  });
});
