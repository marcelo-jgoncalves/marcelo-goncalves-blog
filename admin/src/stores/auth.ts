import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { signIn, signOut, getCurrentUser, fetchAuthSession } from 'aws-amplify/auth'
import { useRouter } from 'vue-router'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<any>(null)
  const isAuthenticated = computed(() => !!user.value)
  const router = useRouter()

  // Inicializa verificando se já existe sessão
  async function checkSession() {
    try {
      const currentUser = await getCurrentUser()
      user.value = currentUser
    } catch (error) {
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
    } catch (error: any) {
      console.error('Erro no login:', error)
      return { success: false, error: error.message }
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
