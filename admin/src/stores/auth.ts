import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { signIn, signOut, getCurrentUser, fetchAuthSession } from 'aws-amplify/auth'

type AuthUser = Awaited<ReturnType<typeof getCurrentUser>>

export const useAuthStore = defineStore('auth', () => {
  const user = ref<AuthUser | null>(null)
  const isAuthenticated = computed(() => !!user.value)

  // Inicializa verificando se já existe sessão
  async function checkSession() {
    try {
      const currentUser = await getCurrentUser()
      user.value = currentUser
    } catch {
      user.value = null
    }
  }

  // Login
  async function login(username: string, password: string) {
    try {
      const { isSignedIn, nextStep } = await signIn({ username, password })
      if (isSignedIn) {
        await checkSession()
        return { success: true }
      }
      // Se pedir nova senha (primeiro acesso), tratamos depois. 
      // Para o user 'admin' que criamos via CLI, o status deve ser CONFIRMED.
      return { success: false, nextStep }
    } catch (error) {
      console.error('Erro no login:', error)
      const message = error instanceof Error ? error.message : 'Erro desconhecido'
      return { success: false, error: message }
    }
  }

  // Logout
  async function logout() {
    await signOut()
    user.value = null
    // router.push('/login') // Será tratado no componente ou router guard
  }

  // Obter Token JWT para API
  async function getToken() {
    try {
      const session = await fetchAuthSession()
      return session.tokens?.idToken?.toString()
    } catch {
      return null
    }
  }

  return { user, isAuthenticated, checkSession, login, logout, getToken }
})
