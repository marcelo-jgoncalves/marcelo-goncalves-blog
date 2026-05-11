// admin/src/__tests__/services/api.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// ─── Mocks ────────────────────────────────────────────────────────────────────

const mockToken = 'mock-id-token-value'

vi.mock('aws-amplify/auth', () => ({
  fetchAuthSession: vi.fn().mockResolvedValue({
    tokens: { idToken: { toString: () => mockToken } },
  }),
}))

vi.mock('../../services/api', async () => {
  // Re-importa o módulo real mas com import.meta.env mockado
  const mod = await vi.importActual<typeof import('../../services/api')>('../../services/api')
  return mod
})

// Sobrescreve import.meta.env antes de importar o módulo
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

describe('apiCall', () => {
  let apiCall: (endpoint: string, options?: RequestInit) => Promise<unknown>

  beforeEach(async () => {
    vi.resetModules()
    vi.doMock('aws-amplify/auth', () => ({
      fetchAuthSession: vi.fn().mockResolvedValue({
        tokens: { idToken: { toString: () => mockToken } },
      }),
      signOut: vi.fn().mockResolvedValue(undefined),
    }))
    // Importa dinamicamente para garantir que os mocks estão aplicados
    const mod = await import('../../services/api')
    apiCall = mod.apiCall
  })

  afterEach(() => vi.clearAllMocks())

  it('throws when user is not authenticated (no token)', async () => {
    vi.stubGlobal('window', { location: { href: '' } })
    const { fetchAuthSession } = await import('aws-amplify/auth')
    vi.mocked(fetchAuthSession).mockResolvedValueOnce({ tokens: undefined } as never)
    mockFetch(200, {})
    await expect(apiCall('/admin/posts')).rejects.toThrow('Sessão expirada')
  })

  it('includes Authorization Bearer token in headers', async () => {
    mockFetch(200, { items: [] })
    await apiCall('/admin/posts')
    const call = (globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls[0]
    expect(call[1].headers['Authorization']).toBe(`Bearer ${mockToken}`)
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
    vi.doMock('aws-amplify/auth', () => ({
      fetchAuthSession: vi.fn().mockResolvedValue({
        tokens: { idToken: { toString: () => mockToken } },
      }),
    }))
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
    vi.doMock('aws-amplify/auth', () => ({
      fetchAuthSession: vi.fn().mockResolvedValue({
        tokens: { idToken: { toString: () => mockToken } },
      }),
    }))
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

  it('create calls POST /admin/posts', async () => {
    mockFetch(200, {})
    await postsApi.create({ slug: 'new', titulo: 'New Post' })
    const call = (globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls[0]
    expect(call[1].method).toBe('POST')
    expect(call[0]).toContain('/admin/posts')
  })

  it('update calls PUT /admin/post/:slug', async () => {
    mockFetch(200, {})
    await postsApi.update('my-post', { titulo: 'Updated' })
    const call = (globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls[0]
    expect(call[1].method).toBe('PUT')
    expect(call[0]).toContain('/admin/post/my-post')
  })

  it('delete calls DELETE /admin/post/:slug', async () => {
    mockFetch(200, {})
    await postsApi.delete('my-post')
    const call = (globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls[0]
    expect(call[1].method).toBe('DELETE')
    expect(call[0]).toContain('/admin/post/my-post')
  })
})
