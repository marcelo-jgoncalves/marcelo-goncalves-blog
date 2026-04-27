<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { categoriesApi } from '../services/api' // Importa a nossa nova API

// --- Interfaces (modelo real do DynamoDB via adminCategorias Lambda) ---
interface Categoria {
  categoria_slug: string
  nome: string
  descricao?: string
}

// --- Estado ---
const categories = ref<Categoria[]>([])
const isModalOpen = ref(false)
const editingSlug = ref<string | null>(null)
const isLoading = ref(true)
const isSaving = ref(false)

// Estado do Formulário
const defaultForm: Categoria = {
  nome: '',
  categoria_slug: '',
  descricao: ''
}
const form = ref<Categoria>({ ...defaultForm })

// --- Lógica de Inicialização (Fetch da API) ---
const fetchCategories = async () => {
  isLoading.value = true
  try {
    const response = await categoriesApi.list()
    categories.value = response.items || []
  } catch (error) {
    console.error('Erro ao buscar categorias:', error)
    alert('Não foi possível carregar as categorias.')
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchCategories()
})

// --- Lógica de UX / Auxiliares ---

// Gerador de Slug Automático
const generateSlug = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
}

// Watcher para preencher o slug automaticamente apenas na criação
watch(() => form.value.nome, (newName) => {
  if (!editingSlug.value) {
    form.value.categoria_slug = generateSlug(newName)
  }
})

// Ações do Modal
const openModal = (category?: Categoria) => {
  if (category) {
    editingSlug.value = category.categoria_slug
    form.value = JSON.parse(JSON.stringify(category))
  } else {
    editingSlug.value = null
    form.value = { ...defaultForm }
  }
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  setTimeout(() => {
    form.value = { ...defaultForm }
    editingSlug.value = null
  }, 200)
}

// --- Operações CRUD Reais ---

const handleSave = async () => {
  if (!form.value.nome || !form.value.categoria_slug) {
    return alert('Preencha os campos obrigatórios (Nome e Slug)')
  }

  isSaving.value = true
  try {
    if (editingSlug.value) {
      // Editar
      await categoriesApi.update(editingSlug.value, form.value)
    } else {
      // Criar
      await categoriesApi.create(form.value)
    }
    
    // Recarrega a lista após salvar com sucesso
    await fetchCategories()
    closeModal()
  } catch (error: any) {
    console.error('Erro ao salvar:', error)
    alert(error.message || 'Erro ao salvar categoria.')
  } finally {
    isSaving.value = false
  }
}

const handleDelete = async (slug: string) => {
  if (confirm('Tem certeza que deseja excluir esta categoria? Isso não altera os posts associados a ela.')) {
    try {
      await categoriesApi.delete(slug)
      await fetchCategories() // Atualiza a lista na tela
    } catch (error: any) {
      console.error('Erro ao excluir:', error)
      alert(error.message || 'Erro ao excluir categoria.')
    }
  }
}
</script>

<template>
  <div class="dashboard">
    <div class="header-actions">
      <h1>Gerenciar Categorias</h1>
      <button @click="openModal()" class="btn-primary" :disabled="isLoading">
        <i class="fas fa-plus"></i> Nova Categoria
      </button>
    </div>

    <div class="table-container">
      <div v-if="isLoading" class="empty-state">
        <i class="fas fa-spinner fa-spin"></i>
        <p>Carregando categorias...</p>
      </div>

      <div v-else-if="categories.length === 0" class="empty-state">
        <i class="fas fa-folder-open"></i>
        <p>Nenhuma categoria encontrada.</p>
      </div>

      <table v-else>
        <thead>
          <tr>
            <th>Categoria / Slug</th>
            <th>Descrição</th>
            <th style="width: 100px;">Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="cat in categories" :key="cat.categoria_slug">
            <td>
              <strong>{{ cat.nome }}</strong>
              <br><small class="slug-text">/{{ cat.categoria_slug }}</small>
            </td>
            <td class="desc-cell" :title="cat.descricao">
              {{ cat.descricao || '-' }}
            </td>
            <td>
              <div class="actions-cell">
                <button @click="openModal(cat)" class="btn-icon" title="Editar">
                  <i class="fas fa-edit"></i>
                </button>
                <button @click="handleDelete(cat.categoria_slug)" class="btn-icon btn-danger" title="Excluir">
                  <i class="fas fa-trash-alt"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="isModalOpen" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>{{ editingSlug ? 'Editar Categoria' : 'Nova Categoria' }}</h2>
          <button @click="closeModal" class="btn-close" :disabled="isSaving"><i class="fas fa-times"></i></button>
        </div>

        <div class="modal-body">
          <div class="form-group">
            <label>Nome da Categoria</label>
            <input
              v-model="form.nome"
              type="text"
              placeholder="Ex: Inteligência Artificial"
              autofocus
              :disabled="isSaving"
            >
          </div>

          <div class="form-group">
            <label>Slug URL <small>(Identificador único)</small></label>
            <div class="input-group">
              <span class="input-addon">/</span>
              <input 
                v-model="form.categoria_slug" 
                type="text" 
                class="input-mono"
                :disabled="!!editingSlug || isSaving" 
              >
            </div>
          </div>

          <div class="form-group">
            <label>Descrição</label>
            <textarea
              v-model="form.descricao"
              rows="3"
              placeholder="Descrição opcional da categoria"
              :disabled="isSaving"
            ></textarea>
          </div>
        </div>

        <div class="modal-footer">
          <button @click="closeModal" class="btn-secondary" :disabled="isSaving">Cancelar</button>
          <button @click="handleSave" class="btn-primary" :disabled="isSaving">
            <i v-if="isSaving" class="fas fa-circle-notch fa-spin"></i>
            {{ isSaving ? 'Salvando...' : (editingSlug ? 'Salvar Alterações' : 'Criar Categoria') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* =========================================
   ESTRUTURA IDENTICA AO DASHBOARD
   ========================================= */
.dashboard {
  /* Herda o layout padrão */
}

.header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px; 
}

/* =========================================
   BOTÕES & AÇÕES
   ========================================= */
.btn-primary {
  background-color: var(--aws-orange, #ff9900);
  color: var(--aws-dark, #232f3e);
  padding: 10px 20px;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 600;
  border: none;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: 0.2s;
  cursor: pointer;
  font-size: 1rem; 
}

.btn-primary:hover:not(:disabled) {
  background-color: var(--aws-orange-hover, #e68a00);
}

.btn-primary:disabled, .btn-secondary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-secondary {
  background: white;
  border: 1px solid var(--gray-border, #ddd);
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  color: var(--gray-text, #666);
  font-weight: 500;
  transition: 0.2s;
}
.btn-secondary:hover:not(:disabled) { background-color: #f9f9f9; }

/* =========================================
   TABELA (Cópia exata do DashboardView)
   ========================================= */
.table-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  overflow: hidden;
  border: 1px solid var(--gray-border, #e5e7eb); 
}

table { width: 100%; border-collapse: collapse; }

th, td {
  padding: 15px 20px;
  text-align: left;
  border-bottom: 1px solid var(--gray-border, #e5e7eb);
}

th {
  background-color: #f9fafb;
  font-weight: 600;
  color: var(--gray-text, #4b5563);
  font-size: 0.9rem; 
}

tr:hover { background-color: #f8fafc; }

.slug-text { color: #999; font-size: 0.85rem; }

.desc-cell {
  max-width: 300px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  color: var(--gray-text, #666); font-size: 0.9rem;
}

/* =========================================
   AÇÕES & PREVIEWS
   ========================================= */
.actions-cell { display: flex; gap: 12px; }

.btn-icon {
  background: none; border: none; cursor: pointer;
  color: var(--blue-600, #3182ce); font-size: 1.1rem; padding: 4px;
}
.btn-icon:hover { color: var(--aws-dark, #232f3e); }
.btn-icon.btn-danger { color: #e53e3e; }
.btn-icon.btn-danger:hover { color: #c53030; }

.icon-preview-cell { display: flex; align-items: center; gap: 10px; }
.icon-preview-cell i { width: 24px; text-align: center; color: var(--aws-dark, #232f3e); }
.icon-badge {
  background: #f3f4f6; padding: 2px 8px; border-radius: 4px;
  font-size: 0.75rem; font-family: monospace; color: #666; border: 1px solid #e5e7eb;
}

.empty-state { text-align: center; padding: 40px; color: var(--gray-text, #9ca3af); }
.empty-state i { font-size: 2.5rem; margin-bottom: 15px; opacity: 0.5; }

/* =========================================
   MODAL
   ========================================= */
.modal-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,0.5);
  display: flex; align-items: center; justify-content: center;
  z-index: 9999; backdrop-filter: blur(2px);
}

.modal-content {
  background: white; width: 100%; max-width: 500px;
  border-radius: 8px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  display: flex; flex-direction: column;
}

.modal-header {
  padding: 20px; border-bottom: 1px solid var(--gray-border, #eee);
  display: flex; justify-content: space-between; align-items: center;
}
.modal-header h2 { margin: 0; font-size: 1.25rem; color: var(--aws-dark, #232f3e); font-weight: 700; }
.btn-close { background: none; border: none; font-size: 1.25rem; cursor: pointer; color: #9ca3af; }

.modal-body { padding: 24px; display: flex; flex-direction: column; gap: 20px; }

.form-group label { display: block; margin-bottom: 6px; font-weight: 500; font-size: 0.875rem; color: #374151; }
.form-group input, .form-group textarea {
  width: 100%; padding: 10px 12px; border: 1px solid #d1d5db; border-radius: 6px;
  font-size: 0.95rem; outline: none; box-sizing: border-box; font-family: inherit;
}
.form-group input:focus, .form-group textarea:focus {
  border-color: var(--aws-orange, #ff9900);
}
.form-group input:disabled, .form-group textarea:disabled {
  background-color: #f3f4f6;
  color: #9ca3af;
  cursor: not-allowed;
}

.input-group { display: flex; align-items: center; }
.input-addon {
  background: #f9fafb; border: 1px solid #d1d5db; border-right: none;
  padding: 10px 12px; border-radius: 6px 0 0 6px; color: #6b7280; font-family: monospace;
}
.input-group input { border-radius: 0 6px 6px 0; }
.input-mono { font-family: 'Courier New', Courier, monospace; }

.form-row { display: grid; grid-template-columns: 1fr auto; gap: 16px; align-items: start; }
.preview-box {
  width: 42px; height: 42px; background: var(--aws-dark, #232f3e);
  color: var(--aws-orange, #ff9900); border-radius: 6px;
  display: flex; align-items: center; justify-content: center; font-size: 1.25rem;
  margin-top: 29px; 
}

.modal-footer {
  padding: 16px 24px; border-top: 1px solid var(--gray-border, #eee);
  background: #f9fafb; display: flex; justify-content: flex-end; gap: 12px; border-radius: 0 0 8px 8px;
}
</style>