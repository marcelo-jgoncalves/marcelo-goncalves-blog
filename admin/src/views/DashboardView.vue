/* admin/src/views */

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { postsApi } from '../services/api'

// Estado
const posts = ref<any[]>([])
const loading = ref(true)
const error = ref('')

// Buscar dados ao montar a tela
onMounted(async () => {
  try {
    const data = await postsApi.list()
    // A Lambda retorna { items: [], count: ... }
    posts.value = data.items || []
  } catch (err: any) {
    error.value = err.message || 'Erro ao carregar posts'
  } finally {
    loading.value = false
  }
})

// Função auxiliar para formatar data
function formatDate(isoString: string) {
  if (!isoString) return '-'
  return new Date(isoString).toLocaleDateString('pt-BR')
}
</script>

<template>
  <div class="dashboard">
    <div class="header-actions">
      <h1>Dashboard de Posts</h1>
    </div>

    <div v-if="loading" class="loading">Carregando dados...</div>
    <div v-if="error" class="error-box">{{ error }}</div>

    <div v-else class="table-container">
      <table v-if="posts.length > 0">
        <thead>
          <tr>
            <th>Título</th>
            <th>Status</th>
            <th>Autor</th>
            <th>Data</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="post in posts" :key="post.slug">
            <td>
              <strong>{{ post.titulo }}</strong>
              <br><small class="slug-text">/{{ post.slug }}</small>
            </td>
            <td>
              <span :class="['badge', `status-${post.status.toLowerCase()}`]">
                {{ post.status }}
              </span>
            </td>
            <td>{{ post.autor_id }}</td>
            <td>{{ formatDate(post.data_atualizacao) }}</td>
            <td>
              <router-link :to="`/post/${post.slug}`" class="btn-icon" title="Editar">
                <i class="fas fa-edit"></i>
              </router-link>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-else class="empty-state">
        <p>Nenhum post encontrado.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.header-actions {
  display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;
}

.btn-primary {
  background-color: var(--aws-orange); color: var(--aws-dark);
  padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: 600;
  display: inline-flex; align-items: center; gap: 8px; transition: 0.2s;
}
.btn-primary:hover { background-color: var(--aws-orange-hover); }

.table-container {
  background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); overflow: hidden;
}
table { width: 100%; border-collapse: collapse; }
th, td { padding: 15px 20px; text-align: left; border-bottom: 1px solid var(--gray-border); }
th { background-color: #f9fafb; font-weight: 600; color: var(--gray-text); }
tr:hover { background-color: #f8fafc; }

.slug-text { color: #999; font-size: 0.85rem; }

/* Badges de Status */
.badge { padding: 4px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; }
.status-publicado { background-color: #d1fae5; color: #065f46; }
.status-rascunho { background-color: #fef3c7; color: #92400e; }
.status-programado { background-color: #dbeafe; color: #1e40af; }

.btn-icon { background: none; border: none; cursor: pointer; color: var(--blue-600); font-size: 1.1rem; }
.btn-icon:hover { color: var(--aws-dark); }

.loading, .empty-state { text-align: center; padding: 40px; color: var(--gray-text); }
.error-box { background-color: #fee2e2; color: #b91c1c; padding: 15px; border-radius: 6px; margin-bottom: 20px; }
</style>
