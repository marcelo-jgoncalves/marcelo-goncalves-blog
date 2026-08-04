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
    router.push('/')
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
  height: 100vh; background-color: var(--slate-50);
}
.login-box {
  background: white; padding: var(--space-5); border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.08); width: 100%; max-width: 400px;
}
h2 { text-align: center; color: var(--dark-900); margin-bottom: var(--space-3); }
.form-group { margin-bottom: var(--space-2); }
label { display: block; margin-bottom: var(--space-1); color: var(--dark-700); font-size: var(--text-sm); }
input { width: 100%; padding: 10px; border: 1px solid var(--border-color); border-radius: 4px; font-size: var(--text-base); }
input:focus { outline: none; border-color: var(--accent); }
.btn-primary {
  width: 100%; padding: 12px; background-color: var(--accent);
  color: white; border: none; border-radius: 4px;
  font-weight: 700; cursor: pointer; font-family: var(--font-display);
  font-size: var(--text-base); transition: background-color 0.2s;
}
.btn-primary:hover { background-color: var(--accent-hover); }
.error { color: #c0392b; font-size: var(--text-sm); text-align: center; margin-bottom: var(--space-1); }
</style>
