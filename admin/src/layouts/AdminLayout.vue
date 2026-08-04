<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useRoute, useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

const BLOG_URL = (import.meta.env.VITE_ASSETS_URL || '').split('/').slice(0, 3).join('/')

// Post editor and preview routes also keep the "Posts" sidebar item active
const activeSection = computed(() => {
  if (route.path.startsWith('/categories')) return 'categorias'
  if (route.path.startsWith('/profile')) return 'autor'
  return 'posts'
})

async function handleLogout() {
  try {
    await auth.logout()
  } catch {
    // A remote signOut error should not block local cleanup
  } finally {
    auth.$reset()
    router.push('/login')
  }
}
</script>

<template>
  <div class="ia-shell">
    <aside class="ia-sidebar">
      <div class="ia-brand">
        <div class="ia-brand-row">
          <div class="ia-logo">MG</div>
          <div>
            <div class="ia-brand-name">Marcelo Gonçalves</div>
            <div class="ia-brand-sub">Painel de conteúdo</div>
          </div>
        </div>
      </div>

      <nav class="ia-nav">
        <div class="ia-nav-group">Conteúdo</div>
        <router-link to="/" class="ia-nav-item" :class="{ active: activeSection === 'posts' }">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <path d="M4 5h16M4 12h16M4 19h10"/>
          </svg>
          Posts
        </router-link>
        <router-link to="/categories" class="ia-nav-item" :class="{ active: activeSection === 'categorias' }">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <path d="M3 7l1.5-2.5h5L11 7M3 7h18v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z"/>
          </svg>
          Categorias
        </router-link>

        <div class="ia-nav-group">Configurações</div>
        <router-link to="/profile" class="ia-nav-item" :class="{ active: activeSection === 'autor' }">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <circle cx="12" cy="8" r="3.5"/><path d="M5 20c0-3.3 3.1-6 7-6s7 2.7 7 6"/>
          </svg>
          Autor
        </router-link>
      </nav>

      <div class="ia-sidebar-footer">
        <a v-if="BLOG_URL" :href="BLOG_URL" target="_blank" rel="noopener" class="ia-site-link">
          <span class="ia-dot"></span>
          Ver site publicado
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-left:auto">
            <path d="M7 17L17 7M9 7h8v8"/>
          </svg>
        </a>
        <button @click="handleLogout" class="ia-logout">
          <i class="fas fa-sign-out-alt"></i> Sair
        </button>
      </div>
    </aside>

    <main class="ia-main ia-scroll">
      <router-view />
    </main>
  </div>
</template>

<style scoped>
.ia-shell {
  display: flex;
  min-height: 100vh;
  background: var(--slate-50);
  font-family: var(--font-sans);
  color: var(--dark-700);
}

.ia-sidebar {
  width: 238px;
  flex: none;
  background: var(--petrol-deep);
  position: sticky;
  top: 0;
  height: 100vh;
  display: flex;
  flex-direction: column;
  border-right: 1px solid rgba(255,255,255,.08);
}

.ia-brand { padding: 24px 22px 20px; border-bottom: 1px solid rgba(255,255,255,.1); }
.ia-brand-row { display: flex; align-items: center; gap: 11px; }
.ia-logo {
  width: 32px; height: 32px; border-radius: 9px; background: var(--accent);
  display: flex; align-items: center; justify-content: center;
  font-weight: 800; color: #fff; font-size: 13px; letter-spacing: -.02em; flex: none;
}
.ia-brand-name { font-weight: 800; font-size: 13.5px; color: #fff; line-height: 1.15; letter-spacing: -.01em; }
.ia-brand-sub {
  font-family: var(--font-mono); font-size: 9px; letter-spacing: .16em; text-transform: uppercase;
  color: rgba(255,255,255,.45); margin-top: 3px;
}

.ia-nav { flex: 1; padding: 16px 14px; display: flex; flex-direction: column; gap: 3px; }
.ia-nav-group {
  font-family: var(--font-mono); font-size: 9px; letter-spacing: .22em; text-transform: uppercase;
  color: rgba(255,255,255,.3); padding: 10px 10px 6px;
}
.ia-nav-group:not(:first-child) { padding: 16px 10px 6px; }

.ia-nav-item {
  display: flex; align-items: center; gap: 11px; padding: 10px 12px; border-radius: 9px;
  font-size: 13px; letter-spacing: -.005em; cursor: pointer; transition: all .15s;
  font-weight: 500; color: rgba(255,255,255,.62); background: transparent;
}
.ia-nav-item:hover { color: #fff; }
.ia-nav-item.active { font-weight: 600; color: #fff; background: rgba(201,96,60,.22); }

.ia-sidebar-footer { border-top: 1px solid rgba(255,255,255,.1); padding: 14px 18px; display: flex; flex-direction: column; gap: 4px; }
.ia-site-link {
  display: flex; align-items: center; gap: 9px; font-size: 12px; color: rgba(255,255,255,.55);
  cursor: pointer; padding: 8px; border-radius: 8px; transition: background .15s;
}
.ia-site-link:hover { background: rgba(255,255,255,.06); }
.ia-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--moss); box-shadow: 0 0 0 3px rgba(63,107,71,.2); flex: none; }

.ia-logout {
  background: none; border: none; color: rgba(255,255,255,.55); cursor: pointer;
  display: flex; align-items: center; gap: 9px; font-size: 12px; padding: 8px; border-radius: 8px;
  width: 100%; text-align: left; transition: background .15s, color .15s;
}
.ia-logout:hover { background: rgba(201,96,60,.18); color: #fff; }

.ia-main { flex: 1; min-width: 0; height: 100vh; overflow-y: auto; }
</style>
