import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { signIn, signOut, fetchAuthSession } from 'aws-amplify/auth'

// A senha continua indo só até o Cognito via SRP (Amplify client-side,
// nunca chega ao nosso backend) — depois do login, trocamos o idToken (só
// em memória, nunca persistido) por uma sessão de servidor opaca e
// descartamos o Amplify (signOut()) imediatamente. Daí em diante, o cookie
// httpOnly que o navegador recebe é a única fonte de verdade da sessão —
// ver backend/src/functions/adminSession e services/api.ts (credentials:
// 'include' em toda chamada, sem Authorization header).
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

      // Amplify não precisa manter nada depois daqui — a sessão de servidor
      // (cookie httpOnly) é a única credencial usada a partir de agora.
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
