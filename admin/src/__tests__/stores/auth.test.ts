import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

// The BFF contract this store implements: the password only ever goes to
// Cognito via SRP (Amplify), the idToken is exchanged once for an opaque
// httpOnly cookie session, and Amplify is discarded (signOut) right after:
// from then on the cookie is the only credential. These tests pin each of
// those steps, since none of them is enforced by types.
const signIn = vi.fn()
const signOut = vi.fn()
const fetchAuthSession = vi.fn()

vi.mock('aws-amplify/auth', () => ({
  signIn: (...args: unknown[]) => signIn(...args),
  signOut: (...args: unknown[]) => signOut(...args),
  fetchAuthSession: (...args: unknown[]) => fetchAuthSession(...args),
}))

import { useAuthStore } from '../../stores/auth'

function mockFetchResponse(status: number, body: unknown) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(body),
  } as Response
}

beforeEach(() => {
  setActivePinia(createPinia())
  vi.clearAllMocks()
  signOut.mockResolvedValue(undefined)
})

describe('login', () => {
  it('exchanges the idToken for a server session and signs Amplify out', async () => {
    signIn.mockResolvedValue({ isSignedIn: true })
    fetchAuthSession.mockResolvedValue({ tokens: { idToken: { toString: () => 'jwt-123' } } })
    globalThis.fetch = vi
      .fn()
      .mockResolvedValue(mockFetchResponse(200, { email: 'a@b.com', username: 'marcelo' }))

    const store = useAuthStore()
    const result = await store.login('marcelo', 'senha-secreta')

    expect(result.success).toBe(true)
    expect(store.isAuthenticated).toBe(true)
    expect(store.email).toBe('a@b.com')

    expect(globalThis.fetch).toHaveBeenCalledWith(
      '/admin/session',
      expect.objectContaining({
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify({ idToken: 'jwt-123' }),
      }),
    )
    expect(signOut).toHaveBeenCalled()
  })

  it('fails without creating a session when Cognito rejects the credentials', async () => {
    signIn.mockResolvedValue({ isSignedIn: false, nextStep: { signInStep: 'CONFIRM' } })
    globalThis.fetch = vi.fn()

    const store = useAuthStore()
    const result = await store.login('marcelo', 'senha-errada')

    expect(result.success).toBe(false)
    expect(store.isAuthenticated).toBe(false)
    expect(globalThis.fetch).not.toHaveBeenCalled()
  })

  it('fails when Amplify has no idToken after sign-in', async () => {
    signIn.mockResolvedValue({ isSignedIn: true })
    fetchAuthSession.mockResolvedValue({ tokens: undefined })
    globalThis.fetch = vi.fn()

    const store = useAuthStore()
    const result = await store.login('marcelo', 'senha')

    expect(result.success).toBe(false)
    expect(globalThis.fetch).not.toHaveBeenCalled()
  })

  it('fails (and stays unauthenticated) when the session exchange returns non-ok', async () => {
    signIn.mockResolvedValue({ isSignedIn: true })
    fetchAuthSession.mockResolvedValue({ tokens: { idToken: { toString: () => 'jwt-123' } } })
    globalThis.fetch = vi.fn().mockResolvedValue(mockFetchResponse(401, { message: 'Token inválido' }))

    const store = useAuthStore()
    const result = await store.login('marcelo', 'senha')

    expect(result.success).toBe(false)
    expect(store.isAuthenticated).toBe(false)
    // Amplify credentials must be discarded even when the exchange fails:
    // nothing client-side should keep a usable token after login ends.
    expect(signOut).toHaveBeenCalled()
  })

  it('returns the thrown error message when Amplify throws', async () => {
    signIn.mockRejectedValue(new Error('Network down'))

    const store = useAuthStore()
    const result = await store.login('marcelo', 'senha')

    expect(result.success).toBe(false)
    expect(result.error).toBe('Network down')
  })
})

describe('checkSession', () => {
  it('hydrates the store from GET /admin/session', async () => {
    globalThis.fetch = vi
      .fn()
      .mockResolvedValue(mockFetchResponse(200, { email: 'a@b.com', username: 'marcelo' }))

    const store = useAuthStore()
    await store.checkSession()

    expect(store.isAuthenticated).toBe(true)
    expect(globalThis.fetch).toHaveBeenCalledWith('/admin/session', { credentials: 'include' })
  })

  it('clears state on 401 (expired/absent session)', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue(mockFetchResponse(401, { message: 'Sem sessão' }))

    const store = useAuthStore()
    await store.checkSession()

    expect(store.isAuthenticated).toBe(false)
    expect(store.email).toBeNull()
  })

  it('clears state when the network call throws', async () => {
    globalThis.fetch = vi.fn().mockRejectedValue(new Error('offline'))

    const store = useAuthStore()
    await store.checkSession()

    expect(store.isAuthenticated).toBe(false)
  })
})

describe('logout', () => {
  it('deletes the server session and clears local state even if the call fails', async () => {
    globalThis.fetch = vi.fn().mockRejectedValue(new Error('offline'))

    const store = useAuthStore()
    store.email = 'a@b.com'

    await store.logout()

    expect(globalThis.fetch).toHaveBeenCalledWith('/admin/session', {
      method: 'DELETE',
      credentials: 'include',
    })
    expect(store.isAuthenticated).toBe(false)
  })
})
