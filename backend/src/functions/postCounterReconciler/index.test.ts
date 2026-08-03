// requireEnv() throws at module load if POSTS_TABLE is unset — this must
// run before the `./index` import below, not in beforeAll (too late).
process.env.POSTS_TABLE = 'test-posts-table';

import { handler } from './index';
import { dynamo } from '../../common/dynamodb';
import { COUNTERS_SLUG } from '../../common/postCounters';

jest.mock('../../common/dynamodb', () => ({
  dynamo: { send: jest.fn() },
}));

const mockSend = dynamo.send as jest.Mock;

beforeAll(() => {
  process.env.POSTS_TABLE = 'test-posts-table';
  process.env.LOG_LEVEL = 'ERROR';
});

beforeEach(() => {
  mockSend.mockReset();
});

describe('postCounterReconciler handler', () => {
  it('does nothing when the stored counters already match reality', async () => {
    mockSend
      .mockResolvedValueOnce({ // Scan
        Items: [
          { slug: 'post-a', status: 'Publicado', e_projeto: 1 },
          { slug: 'post-b', status: 'Rascunho', e_projeto: 0 },
        ],
        LastEvaluatedKey: undefined,
      })
      .mockResolvedValueOnce({ Item: { total_publicado: 1, total_projeto_publicado: 1 } }); // getPostCounters

    await handler({});

    // 1 Scan + 1 Get, no UpdateCommand (no drift to correct)
    expect(mockSend).toHaveBeenCalledTimes(2);
  });

  it('excludes the counters metadata item itself from the recount', async () => {
    mockSend
      .mockResolvedValueOnce({
        Items: [
          { slug: COUNTERS_SLUG, total_publicado: 5 },
          { slug: 'post-a', status: 'Publicado', e_projeto: 0 },
        ],
        LastEvaluatedKey: undefined,
      })
      .mockResolvedValueOnce({ Item: { total_publicado: 1, total_projeto_publicado: 0 } });

    await handler({});

    expect(mockSend).toHaveBeenCalledTimes(2); // real count (1) matches stored (1) — no correction
  });

  it('paginates the Scan across multiple pages', async () => {
    mockSend
      .mockResolvedValueOnce({ Items: [{ slug: 'post-a', status: 'Publicado', e_projeto: 0 }], LastEvaluatedKey: { slug: 'post-a' } })
      .mockResolvedValueOnce({ Items: [{ slug: 'post-b', status: 'Publicado', e_projeto: 0 }], LastEvaluatedKey: undefined })
      .mockResolvedValueOnce({ Item: { total_publicado: 2, total_projeto_publicado: 0 } });

    await handler({});

    expect(mockSend).toHaveBeenCalledTimes(3); // 2 Scan pages + 1 Get
  });

  it('self-heals via an ADD delta when the stored counters drifted from reality', async () => {
    mockSend
      .mockResolvedValueOnce({
        Items: [
          { slug: 'post-a', status: 'Publicado', e_projeto: 1 },
          { slug: 'post-b', status: 'Publicado', e_projeto: 0 },
        ],
        LastEvaluatedKey: undefined,
      })
      .mockResolvedValueOnce({ Item: { total_publicado: 5, total_projeto_publicado: 5 } }) // stale/drifted
      .mockResolvedValueOnce({}); // UpdateCommand (correction)

    await handler({});

    expect(mockSend).toHaveBeenCalledTimes(3);
    const correction = mockSend.mock.calls[2][0].input;
    expect(correction.Key).toEqual({ slug: COUNTERS_SLUG });
    // real total_publicado=2 (was 5, delta -3), real total_projeto_publicado=1 (was 5, delta -4)
    expect(correction.ExpressionAttributeValues).toEqual({ ':dt': -3, ':dp': -4 });
  });

  it('propagates a DynamoDB failure instead of swallowing it', async () => {
    mockSend.mockRejectedValueOnce(new Error('boom'));

    await expect(handler({})).rejects.toThrow('boom');
  });
});
