import { dynamo } from './dynamodb';
import {
  computeCounterDeltas,
  getPostCounters,
  applyCounterDeltas,
  COUNTERS_SLUG,
} from './postCounters';

jest.mock('./dynamodb', () => ({
  dynamo: { send: jest.fn() },
}));

const mockSend = dynamo.send as jest.Mock;

beforeEach(() => {
  process.env.POSTS_TABLE = 'test-posts-table';
  mockSend.mockReset();
});

describe('computeCounterDeltas', () => {
  it('criação de post Publicado: deltaTotal=1, deltaProjeto=0', () => {
    const result = computeCounterDeltas(undefined, { status: 'Publicado', e_projeto: 0 });
    expect(result).toEqual({ deltaTotal: 1, deltaProjeto: 0 });
  });

  it('criação de post Publicado + projeto: deltaTotal=1, deltaProjeto=1', () => {
    const result = computeCounterDeltas(undefined, { status: 'Publicado', e_projeto: 1 });
    expect(result).toEqual({ deltaTotal: 1, deltaProjeto: 1 });
  });

  it('criação de Rascunho: nenhum contador muda', () => {
    const result = computeCounterDeltas(undefined, { status: 'Rascunho', e_projeto: 0 });
    expect(result).toEqual({ deltaTotal: 0, deltaProjeto: 0 });
  });

  it('atualização Rascunho → Publicado: deltaTotal=1', () => {
    const result = computeCounterDeltas(
      { status: 'Rascunho', e_projeto: 0 },
      { status: 'Publicado', e_projeto: 0 },
    );
    expect(result).toEqual({ deltaTotal: 1, deltaProjeto: 0 });
  });

  it('atualização Publicado → Rascunho: deltaTotal=-1', () => {
    const result = computeCounterDeltas(
      { status: 'Publicado', e_projeto: 0 },
      { status: 'Rascunho', e_projeto: 0 },
    );
    expect(result).toEqual({ deltaTotal: -1, deltaProjeto: 0 });
  });

  it('post já Publicado ganha e_projeto=1: deltaTotal=0, deltaProjeto=1', () => {
    const result = computeCounterDeltas(
      { status: 'Publicado', e_projeto: 0 },
      { status: 'Publicado', e_projeto: 1 },
    );
    expect(result).toEqual({ deltaTotal: 0, deltaProjeto: 1 });
  });

  it('post Programado nunca conta — transição Programado → Publicado é a mesma matemática de uma criação', () => {
    const result = computeCounterDeltas(
      { status: 'Programado', e_projeto: 1 },
      { status: 'Publicado', e_projeto: 1 },
    );
    expect(result).toEqual({ deltaTotal: 1, deltaProjeto: 1 });
  });

  it('exclusão de post Publicado: deltaTotal=-1', () => {
    const result = computeCounterDeltas({ status: 'Publicado', e_projeto: 0 }, undefined);
    expect(result).toEqual({ deltaTotal: -1, deltaProjeto: 0 });
  });

  it('exclusão de Rascunho: nenhum contador muda', () => {
    const result = computeCounterDeltas({ status: 'Rascunho', e_projeto: 0 }, undefined);
    expect(result).toEqual({ deltaTotal: 0, deltaProjeto: 0 });
  });

  it('sem mudança de status/e_projeto: delta zero (no-op)', () => {
    const result = computeCounterDeltas(
      { status: 'Rascunho', e_projeto: 0 },
      { status: 'Rascunho', e_projeto: 0 },
    );
    expect(result).toEqual({ deltaTotal: 0, deltaProjeto: 0 });
  });
});

describe('getPostCounters', () => {
  it('retorna 0/0 quando o item de metadata ainda não existe', async () => {
    mockSend.mockResolvedValueOnce({ Item: undefined });
    const result = await getPostCounters();
    expect(result).toEqual({ total_publicado: 0, total_projeto_publicado: 0 });
  });

  it('lê o Key correto (COUNTERS_SLUG)', async () => {
    mockSend.mockResolvedValueOnce({ Item: undefined });
    await getPostCounters();
    const cmd = mockSend.mock.calls[0][0];
    expect(cmd.input.Key).toEqual({ slug: COUNTERS_SLUG });
  });

  it('retorna os valores reais quando o item existe', async () => {
    mockSend.mockResolvedValueOnce({ Item: { total_publicado: 14, total_projeto_publicado: 13 } });
    const result = await getPostCounters();
    expect(result).toEqual({ total_publicado: 14, total_projeto_publicado: 13 });
  });
});

describe('applyCounterDeltas', () => {
  it('não chama o DynamoDB quando ambos os deltas são zero', async () => {
    await applyCounterDeltas({ deltaTotal: 0, deltaProjeto: 0 });
    expect(mockSend).not.toHaveBeenCalled();
  });

  it('usa ADD para incrementar/decrementar atomicamente', async () => {
    mockSend.mockResolvedValueOnce({});
    await applyCounterDeltas({ deltaTotal: 1, deltaProjeto: -1 });

    const cmd = mockSend.mock.calls[0][0];
    expect(cmd.input.Key).toEqual({ slug: COUNTERS_SLUG });
    expect(cmd.input.UpdateExpression).toBe('ADD total_publicado :dt, total_projeto_publicado :dp');
    expect(cmd.input.ExpressionAttributeValues).toEqual({ ':dt': 1, ':dp': -1 });
  });
});
