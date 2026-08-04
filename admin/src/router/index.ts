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
      path: '/',
      component: AdminLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'dashboard',
          component: DashboardView
        },
        {
          path: 'profile',
          name: 'profile',
          component: AuthorEditView
        },
        {
          path: 'categories',
          name: 'categories',
          component: () => import('../views/CategoriesView.vue'),
          meta: {
            layout: 'AdminLayout',
            requiresAuth: true
          }
        }
      ]
    },
    // The writing screen is full-bleed (no Admin sidebar): it has its own
    // top bar with "‹ Posts".
    {
      path: '/posts/new',
      name: 'new-post',
      component: EditorView,
      meta: { requiresAuth: true }
    },
    {
      path: '/post/:slug',
      name: 'edit-post',
      component: EditorView,
      meta: { requiresAuth: true }
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore()
  if (!auth.email) await auth.checkSession()

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    next('/login')
  } else if (to.path === '/login' && auth.isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

export default router
