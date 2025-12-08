import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import LoginView from '../views/LoginView.vue'
import DashboardView from '../views/DashboardView.vue'
import AdminLayout from '../layouts/AdminLayout.vue'
import EditorView from '../views/EditorView.vue'
import AuthorEditView from '../views/AuthorEditView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      // Rota Pai (Layout)
      path: '/',
      component: AdminLayout,
      meta: { requiresAuth: true },
      // Rotas Filhas (Conteúdo)
      children: [
        {
          path: '', // Caminho vazio = "/"
          name: 'dashboard',
          component: DashboardView
        },
        {
          path: 'posts/new',
          name: 'new-post',
          component: EditorView
        },
        {
          path: 'post/:slug', // Rota de edição
          name: 'edit-post',
          component: EditorView
        },
        {
          path: 'profile', // Rota será /profile
          name: 'profile',
          component: AuthorEditView
        }
        // Futuro: { path: 'posts/new', component: EditorView }
      ]
    }
  ]
})

// Navigation Guard (MANTIDO IGUAL)
router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore()
  if (!auth.user) await auth.checkSession()

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    next('/login')
  } else if (to.path === '/login' && auth.isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

export default router
