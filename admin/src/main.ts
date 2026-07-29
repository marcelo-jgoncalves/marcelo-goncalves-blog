import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { Amplify } from 'aws-amplify'
import { cognitoUserPoolsTokenProvider } from 'aws-amplify/auth/cognito'
import { sharedInMemoryStorage } from 'aws-amplify/utils'

import App from './App.vue'
import router from './router'

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
      userPoolClientId: import.meta.env.VITE_COGNITO_CLIENT_ID,
    }
  }
})

// Amplify is only used for the SRP handshake (login) — after that, the
// real session is the BFF's httpOnly cookie (see stores/auth.ts, POST
// /admin/session). That's why Amplify keeps tokens only in memory
// (sharedInMemoryStorage), never in localStorage/sessionStorage: they live
// only for the instant of login and are discarded (signOut()) as soon as
// the server session is created.
cognitoUserPoolsTokenProvider.setKeyValueStorage(sharedInMemoryStorage)

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')