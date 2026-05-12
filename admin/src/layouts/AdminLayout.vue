/** admin/src/layouts/AdminLayout.vue */

<script setup lang="ts">
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()

async function handleLogout() {
  try {
    await auth.logout()
  } catch {
    // Erro no signOut remoto não impede limpeza local
  } finally {
    auth.$reset()
    router.push('/login')
  }
}
</script>

<template>
  <div class="admin-layout">
    <aside class="sidebar">
      <div class="sidebar-logo">
        Marcelo<span>Gonçalves</span> <small>(Admin)</small>
      </div>
      
      <nav>
        <ul class="sidebar-nav">
          <li>
            <router-link to="/" class="nav-link" active-class="active">
              <i class="fas fa-tachometer-alt"></i> Dashboard
            </router-link>
          </li>
          <li>
            <router-link to="/posts/new" class="nav-link" active-class="active">
              <i class="fas fa-plus"></i> Novo Post
            </router-link>
          </li>
          <li>
            <router-link to="/categories" class="nav-link" active-class="active">
              <i class="fas fa-tags"></i> Gerenciar Categorias
            </router-link>
          </li>
          <li>
            <router-link to="/profile" class="nav-link" active-class="active">
              <i class="fas fa-user-edit"></i> Editar Perfil
            </router-link>
          </li>
        </ul>
      </nav>

      <div class="sidebar-footer">
        <button @click="handleLogout" class="btn-logout">
          <i class="fas fa-sign-out-alt"></i> Sair
        </button>
      </div>
    </aside>

    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<style scoped>
.admin-layout {
  display: flex;
  height: 100vh;
  background-color: var(--slate-50);
}

/* Sidebar */
.sidebar {
  width: 260px;
  background-color: var(--dark-900);
  color: white;
  display: flex;
  flex-direction: column;
  padding: var(--space-3);
  flex-shrink: 0;
}

.sidebar-logo {
  font-family: var(--font-display);
  font-size: var(--text-xl);
  font-weight: 700;
  margin-bottom: var(--space-5);
  text-align: center;
  padding-bottom: var(--space-3);
  border-bottom: 1px solid rgba(255,255,255,0.1);
}
.sidebar-logo span { color: var(--accent-light); }
.sidebar-logo small { font-size: var(--text-sm); opacity: 0.7; font-weight: 400; display: block; margin-top: var(--space-1); }

.sidebar-nav { list-style: none; }
.sidebar-nav li { margin-bottom: var(--space-1); }

.nav-link {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-2);
  color: var(--slate-300);
  text-decoration: none;
  border-radius: 6px;
  transition: all 0.2s;
  font-weight: 500;
}
.nav-link:hover { background-color: rgba(255,255,255,0.08); color: white; }
.nav-link.active { background-color: var(--accent); color: white; font-weight: 700; }
.nav-link i { width: 20px; text-align: center; }

.sidebar-footer { margin-top: auto; border-top: 1px solid rgba(255,255,255,0.1); padding-top: var(--space-3); }
.btn-logout {
  background: none; border: none; color: #fc8181; cursor: pointer;
  display: flex; align-items: center; gap: var(--space-1); font-size: var(--text-base); padding: var(--space-1); width: 100%;
}
.btn-logout:hover { color: #feb2b2; }

/* Main Content */
.main-content {
  flex-grow: 1;
  padding: var(--space-5);
  overflow-y: auto;
}
</style>
