<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

const username = ref('')
const password = ref('')
const errorMsg = ref('')
const loading = ref(false)

const auth = useAuthStore()
const router = useRouter()

async function handleLogin() {
  loading.value = true
  errorMsg.value = ''
  
  const result = await auth.login(username.value, password.value)
  
  loading.value = false
  
  if (result.success) {
    router.push('/') // Redireciona para Dashboard
  } else {
    errorMsg.value = result.error || 'Falha no login. Verifique suas credenciais.'
  }
}
</script>

<template>
  <div class="login-container">
    <div class="login-box">
      <h2>Admin Login</h2>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label>Usuário</label>
          <input v-model="username" type="text" placeholder="admin" required />
        </div>
        <div class="form-group">
          <label>Senha</label>
          <input v-model="password" type="password" placeholder="••••••" required />
        </div>
        
        <p v-if="errorMsg" class="error">{{ errorMsg }}</p>
        
        <button type="submit" class="btn-primary" :disabled="loading">
          {{ loading ? 'Entrando...' : 'Entrar' }}
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  display: flex; justify-content: center; align-items: center;
  height: 100vh; background-color: #f8fafc;
}
.login-box {
  background: white; padding: 40px; border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1); width: 100%; max-width: 400px;
}
h2 { text-align: center; color: #232F3E; margin-bottom: 20px; }
.form-group { margin-bottom: 15px; }
label { display: block; margin-bottom: 5px; color: #555; }
input { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; }
.btn-primary {
  width: 100%; padding: 12px; background-color: #FF9900;
  color: #232F3E; border: none; border-radius: 4px;
  font-weight: bold; cursor: pointer;
}
.btn-primary:hover { background-color: #e68a00; }
.error { color: red; font-size: 0.9rem; text-align: center; margin-bottom: 10px; }
</style>
