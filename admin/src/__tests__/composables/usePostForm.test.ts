import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

// Regression test for the field mismatch between SettingsDrawer.vue (writes
// data_publicacao_programada) and usePostForm's save() payload: it used to
// validate/send data_publicacao, a field the backend never reads for
// scheduling (packages/contracts' superRefine requires
// data_publicacao_programada when status === "Programado"), so every
// scheduled post was rejected by the API. The test drives the real save()
// code path instead of hand-building a payload, so it fails the same way
// the UI did.

const create = vi.fn()
const update = vi.fn()
const getPost = vi.fn()

// Mutable so individual tests can switch between the "new post" (no slug
// param) and "editing" (slug param present) routes usePostForm's isEditing
// computed branches on.
const mockRoute: { params: Record<string, string> } = { params: {} }

vi.mock('vue-router', () => ({
  useRoute: () => mockRoute,
  useRouter: () => ({ replace: vi.fn(), push: vi.fn() }),
}))

vi.mock('../../services/api', () => ({
  postsApi: {
    get: (...args: unknown[]) => getPost(...args),
    create: (...args: unknown[]) => create(...args),
    update: (...args: unknown[]) => update(...args),
  },
  categoriesApi: { list: vi.fn().mockResolvedValue({ items: [] }) },
  authorsApi: { get: vi.fn().mockRejectedValue(new Error('not found')) },
}))

vi.mock('aws-amplify/auth', () => ({
  signIn: vi.fn(),
  signOut: vi.fn(),
  fetchAuthSession: vi.fn(),
}))

// sanitizeHtml uses DOMPurify, which needs a DOM (vitest.config.ts runs
// tests under the "node" environment): irrelevant to this test's concern
// (the scheduling date field), so it's mocked as a pass-through.
vi.mock('../../utils/sanitizeHtml', () => ({
  sanitizeHtml: (html: string) => html,
}))

import { usePostForm } from '../../composables/usePostForm'

beforeEach(() => {
  setActivePinia(createPinia())
  vi.clearAllMocks()
  create.mockResolvedValue({ message: 'Post created', slug: 'post-agendado', version: 1, data_atualizacao: '2026-08-03T00:00:00.000Z' })
  update.mockResolvedValue({ message: 'Post updated', slug: 'post-existente', version: 8, data_atualizacao: '2026-08-03T01:00:00.000Z' })
  mockRoute.params = {}
})

describe('usePostForm save() — agendamento', () => {
  it('sends data_publicacao_programada (not data_publicacao) when scheduling a post', async () => {
    const { form, save } = usePostForm()
    const future = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()

    form.value.titulo = 'Post agendado'
    form.value.slug = 'post-agendado'
    form.value.status = 'Programado'
    form.value.data_publicacao_programada = future

    await save()

    expect(create).toHaveBeenCalledTimes(1)
    const payload = create.mock.calls[0]![0] as Record<string, unknown>
    expect(payload.data_publicacao_programada).toBe(future)
  })

  it('blocks save with a validation toast when scheduling without a date', async () => {
    const { form, save, toast } = usePostForm()

    form.value.titulo = 'Post sem data'
    form.value.slug = 'post-sem-data'
    form.value.status = 'Programado'
    form.value.data_publicacao_programada = ''

    await save()

    expect(create).not.toHaveBeenCalled()
    expect(toast.value?.type).toBe('error')
  })
})

describe('usePostForm save() — versionamento otimista', () => {
  it('round-trips the version loaded from GET unchanged in the update payload', async () => {
    mockRoute.params = { slug: 'post-existente' }
    getPost.mockResolvedValue({
      slug: 'post-existente',
      titulo: 'Post existente',
      status: 'Rascunho',
      conteudo_html: '',
      version: 7,
    })
    update.mockResolvedValue({})

    const { form, loadInitialData, save } = usePostForm()
    await loadInitialData()
    expect(form.value.version).toBe(7)

    form.value.titulo = 'Post editado'
    await save()

    expect(update).toHaveBeenCalledTimes(1)
    const [, payload] = update.mock.calls[0]! as [string, Record<string, unknown>]
    expect(payload.version).toBe(7)
  })
})

describe('usePostForm save() — sincronização de estado local após salvar', () => {
  it('creating twice in a row (no reload) calls create only once — the second save is an update', async () => {
    const { form, save } = usePostForm()

    form.value.titulo = 'Post novo'
    form.value.slug = 'post-novo'

    await save()
    expect(create).toHaveBeenCalledTimes(1)
    expect(form.value.slug).toBe('post-agendado') // synced from the mocked create response
    expect(form.value.version).toBe(1)

    // Route hasn't actually changed yet in this test double (router.replace
    // is mocked as a no-op): createdInSession is what prevents a second
    // create from firing here, not route.params.slug.
    await save()
    expect(create).toHaveBeenCalledTimes(1)
    expect(update).toHaveBeenCalledTimes(1)
  })

  it('syncs form.value.slug/version/data_atualizacao from the update response', async () => {
    mockRoute.params = { slug: 'post-existente' }
    getPost.mockResolvedValue({
      slug: 'post-existente',
      titulo: 'Post existente',
      status: 'Rascunho',
      conteudo_html: '',
      version: 7,
    })

    const { form, loadInitialData, save } = usePostForm()
    await loadInitialData()

    form.value.titulo = 'Post editado'
    await save()

    expect(form.value.version).toBe(8)
    expect(form.value.data_atualizacao).toBe('2026-08-03T01:00:00.000Z')
  })

  it('shows a conflict-specific toast on a real 409 from a concurrent editor, distinct from other errors', async () => {
    mockRoute.params = { slug: 'post-existente' }
    getPost.mockResolvedValue({
      slug: 'post-existente',
      titulo: 'Post existente',
      status: 'Rascunho',
      conteudo_html: '',
      version: 7,
    })
    const conflictError = Object.assign(new Error('Post was modified by someone else since it was loaded'), { status: 409 })
    update.mockRejectedValueOnce(conflictError)

    const { form, loadInitialData, save, toast } = usePostForm()
    await loadInitialData()

    form.value.titulo = 'Post editado concorrentemente'
    await save()

    expect(toast.value?.type).toBe('error')
    expect(toast.value?.message).toContain('outra sessão')
  })

  it('shows a slug-conflict toast (not the generic concurrent-edit message) on a 409 during create', async () => {
    const slugConflictError = Object.assign(new Error('A post with this slug already exists'), { status: 409 })
    create.mockRejectedValueOnce(slugConflictError)

    const { form, save, toast } = usePostForm()
    form.value.titulo = 'Post duplicado'
    form.value.slug = 'post-duplicado'

    await save()

    expect(toast.value?.type).toBe('error')
    expect(toast.value?.message).toContain('slug')
    expect(toast.value?.message).not.toContain('outra sessão')
  })
})
