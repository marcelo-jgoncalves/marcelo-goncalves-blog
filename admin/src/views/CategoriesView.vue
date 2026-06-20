<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { categoriesApi } from '../services/api'
import { slugify } from '../utils/slug'
import { MACRO_AREAS } from '../utils/taxonomy'
import type { Categoria, Subcategoria } from '../types'

// --- Estado ---
const categories = ref<Categoria[]>([])
const isModalOpen = ref(false)
const editingSlug = ref<string | null>(null)
const isLoading = ref(true)
const isSaving = ref(false)
const toast = ref<{ message: string; type: 'success' | 'error' | 'warning' } | null>(null)

function showToast(message: string, type: 'success' | 'error' | 'warning' = 'success') {
  toast.value = { message, type }
  setTimeout(() => { toast.value = null }, 4000)
}

// Estado do Formulário
const defaultForm: Categoria = {
  nome: '',
  categoria_slug: '',
  descricao: '',
  macro_areas: [],
  subcategorias: []
}
const form = ref<Categoria>({ ...defaultForm })
const novaSubcategoria = ref('')

function addSubcategoria() {
  const nome = novaSubcategoria.value.trim()
  if (!nome) return
  const slug = slugify(nome)
  if (!form.value.subcategorias) form.value.subcategorias = []
  if (form.value.subcategorias.some((s) => s.slug === slug)) return
  form.value.subcategorias.push({ slug, nome })
  novaSubcategoria.value = ''
}

function removeSubcategoria(slug: string) {
  if (!form.value.subcategorias) return
  form.value.subcategorias = form.value.subcategorias.filter((s) => s.slug !== slug)
}

// --- Lógica de Inicialização (Fetch da API) ---
const fetchCategories = async () => {
  isLoading.value = true
  try {
    const response = await categoriesApi.list()
    categories.value = response.items || []
  } catch (error) {
    showToast('Não foi possível carregar as categorias.', 'error')
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchCategories()
})

// --- Lógica de UX / Auxiliares ---

// Watcher para preencher o slug automaticamente apenas na criação
watch(() => form.value.nome, (newName) => {
  if (!editingSlug.value) {
    form.value.categoria_slug = slugify(newName)
  }
})

// Ações do Modal
const openModal = (category?: Categoria) => {
  if (category) {
    editingSlug.value = category.categoria_slug
    form.value = { ...defaultForm, ...JSON.parse(JSON.stringify(category)) }
    if (!form.value.macro_areas) form.value.macro_areas = []
    if (!form.value.subcategorias) form.value.subcategorias = []
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
    return showToast('Preencha os campos obrigatórios (Nome e Slug)', 'warning')
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
    showToast(editingSlug.value ? 'Categoria atualizada!' : 'Categoria criada!')
    closeModal()
  } catch (error: any) {
    showToast(error.message || 'Erro ao salvar categoria.', 'error')
  } finally {
    isSaving.value = false
  }
}

const handleDelete = async (slug: string) => {
  if (confirm('Tem certeza que deseja excluir esta categoria? Isso não altera os posts associados a ela.')) {
    try {
      await categoriesApi.delete(slug)
      await fetchCategories()
      showToast('Categoria excluída.')
    } catch (error: any) {
      showToast(error.message || 'Erro ao excluir categoria.', 'error')
    }
  }
}
</script>

<template>
  <div class="dashboard">
    <Transition name="toast">
      <div v-if="toast" :class="['toast', `toast--${toast.type}`]" role="alert">
        {{ toast.message }}
      </div>
    </Transition>

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

          <div class="form-group">
            <label>Áreas <small>(usadas nos filtros de Artigos)</small></label>
            <div class="checkbox-row">
              <label v-for="area in MACRO_AREAS" :key="area.value" class="checkbox-pill">
                <input
                  type="checkbox"
                  :value="area.value"
                  v-model="form.macro_areas"
                  :disabled="isSaving"
                >
                {{ area.label }}
              </label>
            </div>
          </div>

          <div class="form-group">
            <label>Subcategorias <small>(lista fixa exibida nos cards)</small></label>
            <div class="subcat-list">
              <span v-for="sub in form.subcategorias" :key="sub.slug" class="subcat-pill">
                {{ sub.nome }}
                <button type="button" @click="removeSubcategoria(sub.slug)" :disabled="isSaving" aria-label="Remover">
                  <i class="fas fa-times"></i>
                </button>
              </span>
              <span v-if="!form.subcategorias?.length" class="subcat-empty">Nenhuma subcategoria ainda.</span>
            </div>
            <div class="subcat-input-row">
              <input
                v-model="novaSubcategoria"
                type="text"
                placeholder="Ex: Kubernetes"
                :disabled="isSaving"
                @keydown.enter.prevent="addSubcategoria"
              >
              <button type="button" class="btn-secondary" @click="addSubcategoria" :disabled="isSaving">Adicionar</button>
            </div>
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
  margin-bottom: var(--space-4);
}

/* =========================================
   BOTÕES & AÇÕES
   ========================================= */
.btn-primary {
  background-color: var(--accent);
  color: white;
  padding: var(--space-1) var(--space-3);
  border-radius: 6px;
  text-decoration: none;
  font-weight: 600;
  border: none;
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  transition: 0.2s;
  cursor: pointer;
  font-size: var(--text-base);
  font-family: var(--font-display);
}

.btn-primary:hover:not(:disabled) {
  background-color: var(--accent-hover);
}

.btn-primary:disabled, .btn-secondary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-secondary {
  background: white;
  border: 1px solid var(--border-color);
  padding: var(--space-1) var(--space-3);
  border-radius: 6px;
  cursor: pointer;
  color: var(--dark-700);
  font-weight: 500;
  transition: 0.2s;
}
.btn-secondary:hover:not(:disabled) { background-color: var(--slate-50); }

/* =========================================
   TABELA (Cópia exata do DashboardView)
   ========================================= */
.table-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  overflow: hidden;
  border: 1px solid var(--border-color);
}

table { width: 100%; border-collapse: collapse; }

th, td {
  padding: var(--space-2) var(--space-3);
  text-align: left;
  border-bottom: 1px solid var(--border-color);
}

th {
  background-color: var(--slate-50);
  font-weight: 600;
  color: var(--slate-500);
  font-size: var(--text-sm);
}

tr:hover { background-color: var(--slate-50); }

.slug-text { color: var(--slate-400); font-size: var(--text-sm); }

.desc-cell {
  max-width: 300px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  color: var(--dark-600); font-size: var(--text-sm);
}

/* =========================================
   AÇÕES & PREVIEWS
   ========================================= */
.actions-cell { display: flex; gap: 12px; }

.btn-icon {
  background: none; border: none; cursor: pointer;
  color: var(--accent); font-size: var(--text-lg); padding: 4px;
}
.btn-icon:hover { color: var(--dark-900); }
.btn-icon.btn-danger { color: #e53e3e; }
.btn-icon.btn-danger:hover { color: #c53030; }

.icon-preview-cell { display: flex; align-items: center; gap: var(--space-1); }
.icon-preview-cell i { width: 24px; text-align: center; color: var(--accent); }
.icon-badge {
  background: var(--slate-100); padding: 2px 8px; border-radius: 4px;
  font-size: var(--text-xs); font-family: var(--font-mono); color: var(--dark-600); border: 1px solid var(--border-color);
}

.empty-state { text-align: center; padding: var(--space-5); color: var(--slate-500); }
.empty-state i { font-size: var(--text-3xl); margin-bottom: var(--space-2); opacity: 0.5; }

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
  padding: var(--space-3); border-bottom: 1px solid var(--border-color);
  display: flex; justify-content: space-between; align-items: center;
}
.modal-header h2 { margin: 0; font-size: var(--text-xl); color: var(--dark-900); font-weight: 700; }
.btn-close { background: none; border: none; font-size: var(--text-xl); cursor: pointer; color: var(--slate-400); }

.modal-body { padding: var(--space-3); display: flex; flex-direction: column; gap: var(--space-3); }

.form-group label { display: block; margin-bottom: 6px; font-weight: 500; font-size: var(--text-sm); color: var(--dark-700); }
.form-group input, .form-group textarea {
  width: 100%; padding: 10px 12px; border: 1px solid var(--border-color); border-radius: 6px;
  font-size: var(--text-base); outline: none; box-sizing: border-box; font-family: inherit;
}
.form-group input:focus, .form-group textarea:focus {
  border-color: var(--accent);
}
.form-group input:disabled, .form-group textarea:disabled {
  background-color: var(--slate-100);
  color: var(--slate-400);
  cursor: not-allowed;
}

.checkbox-row { display: flex; flex-wrap: wrap; gap: var(--space-1); }
.checkbox-pill {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 6px 12px; border: 1px solid var(--border-color); border-radius: 999px;
  font-size: var(--text-sm); font-weight: 500; color: var(--dark-700);
  cursor: pointer; user-select: none; transition: 0.2s;
}
.checkbox-pill:has(input:checked) {
  background: var(--accent-light); border-color: var(--accent); color: var(--accent);
}
.checkbox-pill input { width: auto; margin: 0; }

.subcat-list { display: flex; flex-wrap: wrap; gap: var(--space-1); margin-bottom: var(--space-1); }
.subcat-pill {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 6px 6px 6px 12px; border: 1px solid var(--border-color); border-radius: 999px;
  font-size: var(--text-sm); font-weight: 500; color: var(--dark-700); background: var(--slate-50);
}
.subcat-pill button {
  background: none; border: none; cursor: pointer; color: var(--slate-400);
  width: 20px; height: 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
  font-size: var(--text-xs);
}
.subcat-pill button:hover { background: var(--slate-100); color: #e53e3e; }
.subcat-empty { font-size: var(--text-sm); color: var(--slate-400); }
.subcat-input-row { display: flex; gap: var(--space-1); }
.subcat-input-row input {
  flex: 1; padding: 10px 12px; border: 1px solid var(--border-color); border-radius: 6px;
  font-size: var(--text-base); outline: none; box-sizing: border-box; font-family: inherit;
}
.subcat-input-row input:focus { border-color: var(--accent); }
.subcat-input-row .btn-secondary { flex: none; }

.input-group { display: flex; align-items: center; }
.input-addon {
  background: var(--slate-50); border: 1px solid var(--border-color); border-right: none;
  padding: 10px 12px; border-radius: 6px 0 0 6px; color: var(--slate-500); font-family: var(--font-mono);
}
.input-group input { border-radius: 0 6px 6px 0; }
.input-mono { font-family: var(--font-mono); }

.form-row { display: grid; grid-template-columns: 1fr auto; gap: var(--space-2); align-items: start; }
.preview-box {
  width: 42px; height: 42px; background: var(--accent-light);
  color: var(--accent); border-radius: 6px;
  display: flex; align-items: center; justify-content: center; font-size: var(--text-xl);
  margin-top: 29px;
}

.modal-footer {
  padding: var(--space-2) var(--space-3); border-top: 1px solid var(--border-color);
  background: var(--slate-50); display: flex; justify-content: flex-end; gap: 12px; border-radius: 0 0 8px 8px;
}

.toast {
  position: fixed; top: 20px; right: 20px;
  padding: 14px 20px; border-radius: 6px; font-weight: 600; color: #fff;
  z-index: 10000; box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}
.toast--success  { background: #2d6a4f; }
.toast--error    { background: #c0392b; }
.toast--warning  { background: #b45309; }
.toast-enter-active, .toast-leave-active { transition: opacity 0.3s, transform 0.3s; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(-10px); }
</style>