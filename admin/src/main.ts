import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { Amplify } from 'aws-amplify'

import App from './App.vue'
import router from './router'

// 1. Importar Quill (Editor de Texto) e seus estilos
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';

// Configuração do Cognito
Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
      userPoolClientId: import.meta.env.VITE_COGNITO_CLIENT_ID,
    }
  }
})

const app = createApp(App)

// 2. Registrar Quill Globalmente (para usar <QuillEditor /> em qualquer lugar)
app.component('QuillEditor', QuillEditor)

app.use(createPinia())
app.use(router)

app.mount('#app')