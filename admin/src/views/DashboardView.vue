/* admin/src/views */

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { postsApi } from '../services/api'
import type { Post } from '../types'

type PostListItem = Pick<Post, 'slug' | 'titulo' | 'status' | 'data_atualizacao' | 'autor_id'> & {
  categoria_slug?: string
}

const router = useRouter()
const posts = ref<PostListItem[]>([])
const loading = ref(true)
const error = ref('')
const search = ref('')
const statusFilter = ref('Todos')

const STATUS_TABS = ['Todos', 'Publicado', 'Rascunho', 'Programado']

const filteredPosts = computed(() => {
  let result = posts.value
  if (statusFilter.value !== 'Todos') {
    result = result.filter(p => p.status === statusFilter.value)
  }
  if (search.value.trim()) {
    const q = search.value.toLowerCase()
    result = result.filter(p =>
      p.titulo?.toLowerCase().includes(q) || p.slug?.toLowerCase().includes(q)
    )
  }
  return result
})

onMounted(async () => {
  try {
    const data = await postsApi.list()
    posts.value = data.items || []
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Erro ao carregar posts'
  } finally {
    loading.value = false
  }
})

function formatDate(isoString: string | undefined) {
  if (!isoString) return '-'
  return new Date(isoString).toLocaleDateString('pt-BR')
}

async function deletePost(slug: string, titulo: string) {
  if (!confirm(`Excluir "${titulo}"? Esta ação não pode ser desfeita.`)) return
  try {
    await postsApi.delete(slug)
    posts.value = posts.value.filter(p => p.slug !== slug)
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Erro ao excluir post'
  }
}
</script>

<template>
  <div class="dashboard">
    <div class="header-actions">
      <h1>Dashboard de Posts</h1>
      <button class="btn-primary" @click="router.push('/posts/new')">
        <i class="fas fa-plus"></i> Novo Post
      </button>
    </div>

    <div class="toolbar">
      <div class="status-tabs">
        <button
          v-for="tab in STATUS_TABS"
          :key="tab"
          :class="['tab', { active: statusFilter === tab }]"
          @click="statusFilter = tab"
        >
          {{ tab }}
          <span class="tab-count">
            {{ tab === 'Todos' ? posts.length : posts.filter(p => p.status === tab).length }}
          </span>
        </button>
      </div>
      <div class="search-wrap">
        <i class="fas fa-search search-icon"></i>
        <input
          v-model="search"
          type="search"
          placeholder="Buscar por título ou slug..."
          class="search-input"
        />
      </div>
    </div>

    <div v-if="loading" class="loading">Carregando dados...</div>
    <div v-if="error" class="error-box">{{ error }}</div>

    <div v-else class="table-container">
      <table v-if="filteredPosts.length > 0">
        <thead>
          <tr>
            <th>Título</th>
            <th>Status</th>
            <th>Categoria</th>
            <th>Data</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="post in filteredPosts" :key="post.slug">
            <td>
              <strong>{{ post.titulo }}</strong>
              <br><small class="slug-text">/{{ post.slug }}</small>
            </td>
            <td>
              <span :class="['badge', `status-${post.status?.toLowerCase()}`]">
                {{ post.status }}
              </span>
            </td>
            <td>{{ post.categoria_slug || '-' }}</td>
            <td>{{ formatDate(post.data_atualizacao) }}</td>
            <td>
              <div class="actions-cell">
                <router-link :to="`/post/${post.slug}`" class="btn-icon" title="Editar">
                  <i class="fas fa-edit"></i>
                </router-link>
                <button class="btn-icon btn-danger" title="Excluir" @click="deletePost(post.slug, post.titulo)">
                  <i class="fas fa-trash-alt"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-else class="empty-state">
        <i class="fas fa-file-alt"></i>
        <p v-if="search || statusFilter !== 'Todos'">Nenhum post encontrado para este filtro.</p>
        <p v-else>Nenhum post criado ainda.</p>
        <button v-if="!search && statusFilter === 'Todos'" class="btn-primary" @click="router.push('/posts/new')">
          Criar primeiro post
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.header-actions {
  display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-3);
}

.toolbar {
  display: flex; justify-content: space-between; align-items: center;
  gap: var(--space-2); margin-bottom: var(--space-3); flex-wrap: wrap;
}

.status-tabs { display: flex; gap: 4px; }

.tab {
  padding: 6px 14px; border-radius: 6px; border: 1px solid var(--border-color);
  background: white; cursor: pointer; font-size: var(--text-sm); font-weight: 500;
  color: var(--slate-500); transition: 0.15s; display: flex; align-items: center; gap: 6px;
}
.tab:hover { background: var(--slate-50); }
.tab.active { background: var(--dark-900); color: white; border-color: var(--dark-900); }

.tab-count {
  background: rgba(255,255,255,0.2); border-radius: 10px;
  padding: 1px 7px; font-size: var(--text-xs); font-weight: 700;
}
.tab:not(.active) .tab-count { background: var(--slate-100); color: var(--slate-500); }

.search-wrap { position: relative; }
.search-icon { position: absolute; left: 10px; top: 50%; transform: translateY(-50%); color: var(--slate-400); font-size: var(--text-sm); }
.search-input {
  padding: 8px 12px 8px 32px; border: 1px solid var(--border-color); border-radius: 6px;
  font-size: var(--text-sm); outline: none; width: 240px;
}
.search-input:focus { border-color: var(--accent); }

.btn-primary {
  background-color: var(--accent); color: white;
  padding: var(--space-1) var(--space-3); border-radius: 6px; text-decoration: none; font-weight: 600;
  border: none; display: inline-flex; align-items: center; gap: var(--space-1); transition: 0.2s; cursor: pointer;
  font-family: var(--font-display);
}
.btn-primary:hover { background-color: var(--accent-hover); }

.table-container {
  background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); overflow: hidden;
}
table { width: 100%; border-collapse: collapse; }
th, td { padding: var(--space-2) var(--space-3); text-align: left; border-bottom: 1px solid var(--border-color); }
th { background-color: var(--slate-50); font-weight: 600; color: var(--slate-500); font-size: var(--text-sm); }
tr:hover { background-color: var(--slate-50); }

.slug-text { color: var(--slate-400); font-size: var(--text-sm); }

.badge { padding: 4px 8px; border-radius: 4px; font-size: var(--text-xs); font-weight: 700; text-transform: uppercase; }
.status-publicado  { background-color: #d1fae5; color: #065f46; }
.status-rascunho   { background-color: #fef3c7; color: #92400e; }
.status-programado { background-color: #dbeafe; color: #1e40af; }

.actions-cell { display: flex; gap: 12px; }
.btn-icon { background: none; border: none; cursor: pointer; color: var(--accent); font-size: var(--text-lg); padding: 4px; }
.btn-icon:hover { color: var(--dark-900); }
.btn-icon.btn-danger { color: #e53e3e; }
.btn-icon.btn-danger:hover { color: #c53030; }

.loading, .empty-state { text-align: center; padding: var(--space-5); color: var(--slate-500); }
.empty-state i { font-size: var(--text-3xl); margin-bottom: var(--space-2); opacity: 0.3; display: block; }
.empty-state p { margin-bottom: var(--space-2); }
.error-box { background-color: #fee2e2; color: #b91c1c; padding: var(--space-2); border-radius: 6px; margin-bottom: var(--space-3); }
</style>
