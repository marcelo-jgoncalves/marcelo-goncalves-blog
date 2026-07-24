/* admin/src/main;ts */

import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { Amplify } from 'aws-amplify'
import { cognitoUserPoolsTokenProvider } from 'aws-amplify/auth/cognito'
import { sessionStorage as amplifySessionStorage } from 'aws-amplify/utils'

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

// Tokens do Cognito em sessionStorage em vez do padrão do Amplify (localStorage).
// Não elimina o risco de exfiltração via XSS (só httpOnly cookie setado por um
// backend faria isso, exigindo redesenho de sessão fora do escopo desta correção),
// mas reduz a janela de exposição: o token some ao fechar a aba/navegador em vez
// de persistir indefinidamente entre sessões.
cognitoUserPoolsTokenProvider.setKeyValueStorage(amplifySessionStorage)

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')