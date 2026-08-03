import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

vi.stubGlobal('import', { meta: { env: { VITE_API_BASE_URL: 'https://test-api.example.com/v1' } } })

// ─── Helpers ──────────────────────────────────────────────────────────────────

function mockFetch(status: number, body: unknown) {
  globalThis.fetch = vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(body),
  } as Response)
}

// ─── apiCall ──────────────────────────────────────────────────────────────────
// The BFF session travels in an httpOnly cookie sent automatically by the
// browser (credentials: 'include') — no token/Authorization header built on
// the client. 401/403 mean "invalid session" and redirect to login (see
// services/api.ts and the Lambda Authorizer, which returns 403 on an
// explicit Deny policy and 401 only when it can't identify the request at all).

describe('apiCall', () => {
  let apiCall: (endpoint: string, options?: RequestInit) => Promise<unknown>

  beforeEach(async () => {
    vi.resetModules()
    const mod = await import('../../services/api')
    apiCall = mod.apiCall
  })

  afterEach(() => vi.clearAllMocks())

  it.each([401, 403])('redireciona pro login e lança erro quando a API responde %i', async (status) => {
    vi.stubGlobal('window', { location: { href: '' } })
    mockFetch(status, {})
    await expect(apiCall('/admin/posts')).rejects.toThrow('Sessão expirada')
  })

  it('inclui credentials: include (cookie de sessão same-origin)', async () => {
    mockFetch(200, {})
    await apiCall('/admin/posts')
    const call = (globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls[0]
    expect(call[1].credentials).toBe('include')
  })

  it('não monta header Authorization (sessão vem só do cookie)', async () => {
    mockFetch(200, {})
    await apiCall('/admin/posts')
    const call = (globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls[0]
    expect(call[1].headers['Authorization']).toBeUndefined()
  })

  it('includes Content-Type application/json', async () => {
    mockFetch(200, {})
    await apiCall('/admin/posts')
    const call = (globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls[0]
    expect(call[1].headers['Content-Type']).toBe('application/json')
  })

  it('throws with API error message on non-ok response', async () => {
    mockFetch(400, { message: 'Slug already exists' })
    await expect(apiCall('/admin/posts', { method: 'POST' })).rejects.toThrow('Slug already exists')
  })

  it('throws generic error when error body has no message', async () => {
    mockFetch(500, {})
    await expect(apiCall('/admin/posts')).rejects.toThrow('Erro na API')
  })

  it('returns parsed JSON on success', async () => {
    mockFetch(200, { items: [{ slug: 'test' }] })
    const result = await apiCall('/admin/posts')
    expect(result).toEqual({ items: [{ slug: 'test' }] })
  })

  it('merges custom options (method, body) with auth headers', async () => {
    mockFetch(200, {})
    await apiCall('/admin/posts', {
      method: 'POST',
      body: JSON.stringify({ slug: 'new' }),
    })
    const call = (globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls[0]
    expect(call[1].method).toBe('POST')
    expect(call[1].body).toBe(JSON.stringify({ slug: 'new' }))
  })
})

// ─── categoriesApi ────────────────────────────────────────────────────────────

describe('categoriesApi', () => {
  let categoriesApi: typeof import('../../services/api')['categoriesApi']

  beforeEach(async () => {
    vi.resetModules()
    const mod = await import('../../services/api')
    categoriesApi = mod.categoriesApi
  })

  afterEach(() => vi.clearAllMocks())

  it('list calls GET /admin/categorias', async () => {
    mockFetch(200, { items: [] })
    await categoriesApi.list()
    const url = (globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls[0][0] as string
    expect(url).toContain('/admin/categorias')
  })

  it('create calls POST /admin/categorias with body', async () => {
    mockFetch(200, {})
    await categoriesApi.create({ categoria_slug: 'ia', nome: 'Inteligência Artificial' })
    const call = (globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls[0]
    expect(call[1].method).toBe('POST')
    expect(call[1].body).toContain('ia')
  })

  it('update calls PUT /admin/categorias/:slug', async () => {
    mockFetch(200, {})
    await categoriesApi.update('ia', { categoria_slug: 'ia', nome: 'IA' })
    const call = (globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls[0]
    expect(call[0]).toContain('/admin/categorias/ia')
    expect(call[1].method).toBe('PUT')
  })

  it('delete calls DELETE /admin/categorias/:slug', async () => {
    mockFetch(200, {})
    await categoriesApi.delete('ia')
    const call = (globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls[0]
    expect(call[0]).toContain('/admin/categorias/ia')
    expect(call[1].method).toBe('DELETE')
  })
})

// ─── postsApi ────────────────────────────────────────────────────────────────

describe('postsApi', () => {
  let postsApi: typeof import('../../services/api')['postsApi']

  beforeEach(async () => {
    vi.resetModules()
    const mod = await import('../../services/api')
    postsApi = mod.postsApi
  })

  afterEach(() => vi.clearAllMocks())

  it('list calls GET /admin/posts', async () => {
    mockFetch(200, { items: [] })
    await postsApi.list()
    expect((globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls[0][0]).toContain('/admin/posts')
  })

  it('get calls GET /admin/post/:slug', async () => {
    mockFetch(200, { slug: 'test' })
    await postsApi.get('test-post')
    expect((globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls[0][0]).toContain('/admin/post/test-post')
  })

  const SAVE_RESPONSE = { message: 'Post created', slug: 'new', version: 1, data_atualizacao: '2026-08-03T00:00:00.000Z' }

  it('create calls POST /admin/posts', async () => {
    mockFetch(201, SAVE_RESPONSE)
    await postsApi.create({ slug: 'new', titulo: 'New Post' })
    const call = (globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls[0]
    expect(call[1].method).toBe('POST')
    expect(call[0]).toContain('/admin/posts')
  })

  it('create parses and returns the savePostResponseSchema body (slug/version/data_atualizacao)', async () => {
    mockFetch(201, SAVE_RESPONSE)
    const result = await postsApi.create({ slug: 'new', titulo: 'New Post' })
    expect(result).toEqual(SAVE_RESPONSE)
  })

  it('update calls PATCH /admin/post/:slug', async () => {
    mockFetch(200, { ...SAVE_RESPONSE, message: 'Post updated', slug: 'my-post', version: 2 })
    await postsApi.update('my-post', { titulo: 'Updated' })
    const call = (globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls[0]
    expect(call[1].method).toBe('PATCH')
    expect(call[0]).toContain('/admin/post/my-post')
  })

  it('delete calls DELETE /admin/post/:slug with the known version as a query param', async () => {
    mockFetch(200, {})
    await postsApi.delete('my-post', 3)
    const call = (globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls[0]
    expect(call[1].method).toBe('DELETE')
    expect(call[0]).toContain('/admin/post/my-post?version=3')
  })
})
