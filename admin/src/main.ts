/* admin/src/main;ts */

import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { Amplify } from 'aws-amplify'
import { cognitoUserPoolsTokenProvider } from 'aws-amplify/auth/cognito'
import { sharedInMemoryStorage } from 'aws-amplify/utils'

import App from './App.vue'
import router from './router'

// Configuração do Cognito
Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
      userPoolClientId: import.meta.env.VITE_COGNITO_CLIENT_ID,
    }
  }
})

// Amplify só é usado para o handshake SRP (login) — a sessão de verdade
// depois disso é o cookie httpOnly do BFF (ver stores/auth.ts, POST
// /admin/session). Por isso o Amplify guarda tokens só em memória
// (sharedInMemoryStorage), nunca em localStorage/sessionStorage: eles vivem
// só durante o instante do login e são descartados (signOut()) assim que a
// sessão de servidor é criada. Histórico desta linha: localStorage (padrão
// do Amplify) -> sessionStorage (mitigação rápida) -> in-memory + BFF
// (sessão 2026-07-24, auditoria world-class).
cognitoUserPoolsTokenProvider.setKeyValueStorage(sharedInMemoryStorage)

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')