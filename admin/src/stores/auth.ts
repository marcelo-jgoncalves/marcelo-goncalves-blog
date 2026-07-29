import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { signIn, signOut, fetchAuthSession } from 'aws-amplify/auth'

// The password still only goes as far as Cognito via SRP (Amplify
// client-side, never reaches our backend) — after login, we exchange the
// idToken (kept only in memory, never persisted) for an opaque server
// session and discard Amplify (signOut()) immediately. From then on, the
// httpOnly cookie the browser receives is the only source of truth for the
// session — see backend/src/functions/adminSession and services/api.ts
// (credentials: 'include' on every call, no Authorization header).
export const useAuthStore = defineStore('auth', () => {
  const email = ref<string | null>(null)
  const username = ref<string | null>(null)
  const isAuthenticated = computed(() => !!email.value)

  async function checkSession() {
    try {
      const res = await fetch('/admin/session', { credentials: 'include' })
      if (!res.ok) {
        email.value = null
        username.value = null
        return
      }
      const data = await res.json()
      email.value = data.email ?? null
      username.value = data.username ?? null
    } catch {
      email.value = null
      username.value = null
    }
  }

  async function login(loginId: string, password: string) {
    try {
      const { isSignedIn, nextStep } = await signIn({ username: loginId, password })
      if (!isSignedIn) {
        return { success: false, nextStep }
      }

      const session = await fetchAuthSession()
      const idToken = session.tokens?.idToken?.toString()
      if (!idToken) {
        return { success: false, error: 'Sessão inválida após login' }
      }

      const res = await fetch('/admin/session', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      })

      // Amplify doesn't need to hold onto anything past this point — the
      // server session (httpOnly cookie) is the only credential used from now on.
      await signOut().catch(() => {})

      if (!res.ok) {
        return { success: false, error: 'Não foi possível iniciar a sessão' }
      }

      const data = await res.json()
      email.value = data.email ?? null
      username.value = data.username ?? null
      return { success: true }
    } catch (error) {
      console.error('Erro no login:', error)
      const message = error instanceof Error ? error.message : 'Erro desconhecido'
      return { success: false, error: message }
    }
  }

  async function logout() {
    await fetch('/admin/session', { method: 'DELETE', credentials: 'include' }).catch(() => {})
    email.value = null
    username.value = null
  }

  return { email, username, isAuthenticated, checkSession, login, logout }
})
