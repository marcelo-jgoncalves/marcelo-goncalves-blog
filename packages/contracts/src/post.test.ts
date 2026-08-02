import { postInputSchema } from './post';

const BASE = {
  slug: 'meu-post',
  titulo: 'Meu Post',
  autor_id: 'marcelo-goncalves',
};

describe('postInputSchema', () => {
  it('accepts a minimal valid post', () => {
    expect(postInputSchema.safeParse(BASE).success).toBe(true);
  });

  it('rejects a slug with uppercase or spaces', () => {
    expect(postInputSchema.safeParse({ ...BASE, slug: 'Meu Post' }).success).toBe(false);
  });

  it('accepts every real slug shape seen in production (alphanumeric segments joined by hyphens)', () => {
    const realSlugs = [
      'terraform-em-producao-as-licoes-que-so-um-incidente-real-ensina',
      'decima-primeira-pagina-para-teste-futuro-de-paginacao',
      'testeerroedicao',
    ];
    for (const slug of realSlugs) {
      expect(postInputSchema.safeParse({ ...BASE, slug }).success).toBe(true);
    }
  });

  it('rejects a slug longer than 200 chars', () => {
    expect(postInputSchema.safeParse({ ...BASE, slug: 'a'.repeat(201) }).success).toBe(false);
  });

  it('rejects titulo longer than 300 chars', () => {
    expect(postInputSchema.safeParse({ ...BASE, titulo: 'a'.repeat(301) }).success).toBe(false);
  });

  it('rejects tempo_leitura_min when not an integer', () => {
    expect(postInputSchema.safeParse({ ...BASE, tempo_leitura_min: 3.5 }).success).toBe(false);
  });

  it('rejects tempo_leitura_min of 0 or below', () => {
    expect(postInputSchema.safeParse({ ...BASE, tempo_leitura_min: 0 }).success).toBe(false);
  });

  it('rejects tempo_leitura_min above 180', () => {
    expect(postInputSchema.safeParse({ ...BASE, tempo_leitura_min: 181 }).success).toBe(false);
  });

  it('accepts data_publicacao in the admin datetime-local shape (no seconds, no timezone)', () => {
    const result = postInputSchema.safeParse({ ...BASE, data_publicacao: '2026-08-02T14:30' });
    expect(result.success).toBe(true);
  });

  it('rejects status "Programado" without data_publicacao_programada', () => {
    const result = postInputSchema.safeParse({ ...BASE, status: 'Programado' });
    expect(result.success).toBe(false);
  });

  it('accepts status "Programado" with data_publicacao_programada', () => {
    const result = postInputSchema.safeParse({
      ...BASE,
      status: 'Programado',
      data_publicacao_programada: '2026-08-02T14:30',
    });
    expect(result.success).toBe(true);
  });

  it('does not require data_publicacao_programada for other statuses', () => {
    expect(postInputSchema.safeParse({ ...BASE, status: 'Rascunho' }).success).toBe(true);
    expect(postInputSchema.safeParse({ ...BASE, status: 'Publicado' }).success).toBe(true);
  });

  it('strips unknown fields (mass assignment protection)', () => {
    const result = postInputSchema.safeParse({ ...BASE, isAdmin: true });
    expect(result.success).toBe(true);
    expect((result as { data: Record<string, unknown> }).data.isAdmin).toBeUndefined();
  });
});
