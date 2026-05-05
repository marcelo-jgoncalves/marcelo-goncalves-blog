/* admin/src/views */

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { postsApi } from '../services/api'

const router = useRouter()
const posts = ref<any[]>([])
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
  } catch (err: any) {
    error.value = err.message || 'Erro ao carregar posts'
  } finally {
    loading.value = false
  }
})

function formatDate(isoString: string) {
  if (!isoString) return '-'
  return new Date(isoString).toLocaleDateString('pt-BR')
}

async function deletePost(slug: string, titulo: string) {
  if (!confirm(`Excluir "${titulo}"? Esta ação não pode ser desfeita.`)) return
  try {
    await postsApi.delete(slug)
    posts.value = posts.value.filter(p => p.slug !== slug)
  } catch (err: any) {
    error.value = err.message || 'Erro ao excluir post'
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
  display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;
}

.toolbar {
  display: flex; justify-content: space-between; align-items: center;
  gap: 16px; margin-bottom: 20px; flex-wrap: wrap;
}

.status-tabs { display: flex; gap: 4px; }

.tab {
  padding: 6px 14px; border-radius: 6px; border: 1px solid #e5e7eb;
  background: white; cursor: pointer; font-size: 0.875rem; font-weight: 500;
  color: #6b7280; transition: 0.15s; display: flex; align-items: center; gap: 6px;
}
.tab:hover { background: #f3f4f6; }
.tab.active { background: var(--aws-dark, #232f3e); color: white; border-color: var(--aws-dark, #232f3e); }

.tab-count {
  background: rgba(255,255,255,0.2); border-radius: 10px;
  padding: 1px 7px; font-size: 0.75rem; font-weight: 700;
}
.tab:not(.active) .tab-count { background: #f3f4f6; color: #6b7280; }

.search-wrap { position: relative; }
.search-icon { position: absolute; left: 10px; top: 50%; transform: translateY(-50%); color: #9ca3af; font-size: 0.85rem; }
.search-input {
  padding: 8px 12px 8px 32px; border: 1px solid #d1d5db; border-radius: 6px;
  font-size: 0.875rem; outline: none; width: 240px;
}
.search-input:focus { border-color: var(--aws-orange, #ff9900); }

.btn-primary {
  background-color: var(--aws-orange); color: var(--aws-dark);
  padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: 600;
  border: none; display: inline-flex; align-items: center; gap: 8px; transition: 0.2s; cursor: pointer;
}
.btn-primary:hover { background-color: var(--aws-orange-hover, #e68a00); }

.table-container {
  background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); overflow: hidden;
}
table { width: 100%; border-collapse: collapse; }
th, td { padding: 15px 20px; text-align: left; border-bottom: 1px solid var(--gray-border); }
th { background-color: #f9fafb; font-weight: 600; color: var(--gray-text); font-size: 0.875rem; }
tr:hover { background-color: #f8fafc; }

.slug-text { color: #999; font-size: 0.85rem; }

.badge { padding: 4px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; }
.status-publicado { background-color: #d1fae5; color: #065f46; }
.status-rascunho  { background-color: #fef3c7; color: #92400e; }
.status-programado { background-color: #dbeafe; color: #1e40af; }

.actions-cell { display: flex; gap: 12px; }
.btn-icon { background: none; border: none; cursor: pointer; color: var(--blue-600, #3182ce); font-size: 1.1rem; padding: 4px; }
.btn-icon:hover { color: var(--aws-dark); }
.btn-icon.btn-danger { color: #e53e3e; }
.btn-icon.btn-danger:hover { color: #c53030; }

.loading, .empty-state { text-align: center; padding: 48px; color: var(--gray-text); }
.empty-state i { font-size: 2.5rem; margin-bottom: 12px; opacity: 0.3; display: block; }
.empty-state p { margin-bottom: 16px; }
.error-box { background-color: #fee2e2; color: #b91c1c; padding: 15px; border-radius: 6px; margin-bottom: 20px; }
</style>
