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

vi.mock('vue-router', () => ({
  useRoute: () => ({ params: {} }),
  useRouter: () => ({ replace: vi.fn(), push: vi.fn() }),
}))

vi.mock('../../services/api', () => ({
  postsApi: {
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
// tests under the "node" environment) — irrelevant to this test's concern
// (the scheduling date field), so it's mocked as a pass-through.
vi.mock('../../utils/sanitizeHtml', () => ({
  sanitizeHtml: (html: string) => html,
}))

import { usePostForm } from '../../composables/usePostForm'

beforeEach(() => {
  setActivePinia(createPinia())
  vi.clearAllMocks()
  create.mockResolvedValue({})
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
