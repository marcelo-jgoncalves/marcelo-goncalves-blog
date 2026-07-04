<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { categoriesApi } from '../services/api'
import { slugify } from '../utils/slug'
import { MACRO_AREAS } from '../utils/taxonomy'
import type { Categoria } from '../types'

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
  } catch {
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
  } catch (error) {
    showToast(error instanceof Error ? error.message : 'Erro ao salvar categoria.', 'error')
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
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Erro ao excluir categoria.', 'error')
    }
  }
}
</script>

<template>
  <div data-screen-label="Categorias" class="ia-categories">
    <Transition name="ia-toast">
      <div v-if="toast" :class="['ia-toast', `ia-toast--${toast.type}`]" role="alert">
        <span class="ia-toast-check">✓</span>{{ toast.message }}
      </div>
    </Transition>

    <div class="ia-eyebrow"><span class="ia-eyebrow-line"></span>Organização</div>
    <h1 class="ia-h1">Categorias</h1>
    <p class="ia-subtitle">Agrupe os posts por tema. A contagem reflete os posts publicados e rascunhos.</p>

    <div class="ia-add-row">
      <button @click="openModal()" class="ia-btn-primary" :disabled="isLoading">
        <i class="fas fa-plus"></i> Nova categoria
      </button>
    </div>

    <div class="ia-list">
      <div v-if="isLoading" class="ia-empty">
        <i class="fas fa-spinner fa-spin"></i>
        <p>Carregando categorias…</p>
      </div>

      <div v-else-if="categories.length === 0" class="ia-empty">
        <i class="fas fa-folder-open"></i>
        <p>Nenhuma categoria encontrada.</p>
      </div>

      <div v-else v-for="cat in categories" :key="cat.categoria_slug" class="ia-list-item">
        <span class="ia-list-dot"></span>
        <div class="ia-list-main">
          <div class="ia-list-name">{{ cat.nome }}</div>
          <div class="ia-list-slug">/{{ cat.categoria_slug }}</div>
          <div v-if="cat.descricao" class="ia-list-desc">{{ cat.descricao }}</div>
        </div>
        <div class="ia-actions-cell">
          <button @click="openModal(cat)" class="ia-icon-btn" title="Editar">
            <i class="fas fa-edit"></i>
          </button>
          <button @click="handleDelete(cat.categoria_slug)" class="ia-icon-btn ia-icon-btn--danger" title="Excluir">
            <i class="fas fa-trash-alt"></i>
          </button>
        </div>
      </div>
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
.ia-categories { padding: 38px 40px 90px; max-width: 780px; }

.ia-eyebrow {
  display: flex; align-items: center; gap: 10px; font-family: var(--font-mono); font-size: 10.5px;
  letter-spacing: .22em; text-transform: uppercase; color: var(--accent); margin-bottom: 14px;
}
.ia-eyebrow-line { width: 22px; height: 1px; background: var(--accent); }
.ia-h1 { font-weight: 800; font-size: 2rem; letter-spacing: -.04em; color: var(--petrol); line-height: 1.05; margin: 0; }
.ia-subtitle { font-size: 14px; color: var(--slate-500); margin: 10px 0 0; }

.ia-add-row { display: flex; gap: 10px; margin-top: 26px; }

/* =========================================
   BOTÕES & AÇÕES
   ========================================= */
.ia-btn-primary, .btn-primary {
  background-color: var(--accent);
  color: white;
  padding: 11px 18px;
  border-radius: 10px;
  text-decoration: none;
  font-weight: 600;
  border: none;
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  transition: filter 0.15s;
  cursor: pointer;
  font-size: 13.5px;
  font-family: var(--font-sans);
  box-shadow: 0 6px 16px rgba(201,96,60,.28);
}

.ia-btn-primary:hover:not(:disabled), .btn-primary:hover:not(:disabled) {
  filter: brightness(.92);
}

.ia-btn-primary:disabled, .btn-primary:disabled, .btn-secondary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-secondary {
  background: white;
  border: 1px solid var(--border-color);
  padding: var(--space-1) var(--space-3);
  border-radius: 9px;
  cursor: pointer;
  color: var(--slate-500);
  font-weight: 600;
  transition: 0.2s;
}
.btn-secondary:hover:not(:disabled) { background-color: var(--slate-100); }

/* =========================================
   LISTA (spec seção 9)
   ========================================= */
.ia-list {
  margin-top: 22px; background: #fff; border: 1px solid var(--border-color); border-radius: 14px; overflow: hidden;
}
.ia-list-item {
  display: flex; align-items: center; gap: 14px; padding: 15px 18px; border-bottom: 1px solid var(--slate-100);
}
.ia-list-item:last-child { border-bottom: none; }
.ia-list-dot { width: 8px; height: 8px; border-radius: 2px; background: var(--petrol); flex: none; }
.ia-list-main { flex: 1; min-width: 0; }
.ia-list-name { font-weight: 600; font-size: 14px; color: var(--dark-700); }
.ia-list-slug { font-family: var(--font-mono); font-size: 11px; color: var(--slate-400); margin-top: 2px; }
.ia-list-desc { font-size: 12.5px; color: var(--slate-500); margin-top: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

.ia-actions-cell { display: flex; gap: 6px; flex: none; }
.ia-icon-btn {
  width: 30px; height: 30px; border-radius: 8px; border: 1px solid var(--border-color); background: #fff;
  color: var(--slate-500); cursor: pointer; display: flex; align-items: center; justify-content: center;
}
.ia-icon-btn:hover { background: var(--slate-100); color: var(--petrol); }
.ia-icon-btn--danger:hover { background: var(--clay-red-bg); color: #A94C2D; border-color: var(--clay-red-bd); }

.ia-empty { text-align: center; padding: 56px 24px; color: var(--slate-500); }
.ia-empty i { font-size: 2rem; margin-bottom: var(--space-2); opacity: 0.5; }

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

.ia-toast {
  position: fixed; bottom: 24px; right: 24px; z-index: 60; background: var(--petrol); color: #fff;
  padding: 13px 18px; border-radius: 12px; box-shadow: 0 14px 34px rgba(12,32,39,.28);
  display: flex; align-items: center; gap: 12px; font-size: 13.5px; font-weight: 500;
}
.ia-toast--error   { background: #A94C2D; }
.ia-toast--warning { background: #b45309; }
.ia-toast-check {
  width: 22px; height: 22px; border-radius: 50%; background: var(--moss);
  display: flex; align-items: center; justify-content: center; font-size: 12px; flex: none;
}
.ia-toast--error .ia-toast-check, .ia-toast--warning .ia-toast-check { background: rgba(255,255,255,.25); }
.ia-toast-enter-active, .ia-toast-leave-active { transition: opacity 0.25s, transform 0.25s; }
.ia-toast-enter-from, .ia-toast-leave-to { opacity: 0; transform: translateY(14px); }
</style>