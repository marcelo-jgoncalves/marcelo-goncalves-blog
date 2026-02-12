<script setup lang="ts">
import { ref, watch } from 'vue'

// --- Interfaces ---
interface Category {
  id: string
  name: string
  slug: string
  icon: string
  seoDescription: string
  count?: number
}

// --- Estado ---
const categories = ref<Category[]>([])
const isModalOpen = ref(false)
const editingId = ref<string | null>(null)

// Estado do Formulário
const defaultForm = {
  name: '',
  slug: '',
  icon: 'fas fa-tag',
  seoDescription: ''
}
const form = ref({ ...defaultForm })

// --- Inicialização (Mock) ---
const initMockData = () => {
  categories.value = [
    {
      id: '1',
      name: 'Inteligência Artificial',
      slug: 'inteligencia-artificial',
      icon: 'fas fa-robot',
      seoDescription: 'Artigos sobre LLMs, Machine Learning e IA.',
      count: 12
    },
    {
      id: '2',
      name: 'DevOps & Cloud',
      slug: 'devops-cloud',
      icon: 'fas fa-cloud',
      seoDescription: 'Tutoriais de AWS e Kubernetes.',
      count: 8
    },
    {
      id: '3',
      name: 'Frontend Moderno',
      slug: 'frontend-moderno',
      icon: 'fab fa-vuejs',
      seoDescription: 'Dicas de Vue 3 e React.',
      count: 24
    }
  ]
}
initMockData()

// --- Lógica ---

// Gerador de Slug
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

// Watcher para Slug Automático
watch(() => form.value.name, (newName) => {
  if (!editingId.value) {
    form.value.slug = generateSlug(newName)
  }
})

// Ações do Modal
const openModal = (category?: Category) => {
  if (category) {
    editingId.value = category.id
    // Cópia profunda simples para quebrar reatividade indesejada
    form.value = JSON.parse(JSON.stringify(category))
  } else {
    editingId.value = null
    form.value = { ...defaultForm }
  }
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  // Pequeno delay para limpar o form
  setTimeout(() => {
    form.value = { ...defaultForm }
    editingId.value = null
  }, 200)
}

const handleSave = () => {
  if (!form.value.name || !form.value.slug) return alert('Preencha os campos obrigatórios')

  if (editingId.value) {
    // Editar
    const index = categories.value.findIndex(c => c.id === editingId.value)
    if (index !== -1) {
      categories.value[index] = { 
        ...categories.value[index],
        ...form.value,
        id: editingId.value // Mantém o ID original
      }
    }
  } else {
    // Criar
    categories.value.push({
      ...form.value,
      id: Date.now().toString(),
      count: 0
    })
  }
  closeModal()
}

const handleDelete = (id: string) => {
  if (confirm('Tem certeza que deseja excluir esta categoria?')) {
    categories.value = categories.value.filter(c => c.id !== id)
  }
}
</script>

<template>
  <div class="dashboard">
    <div class="header-actions">
      <h1>Gerenciar Categorias</h1>
      <button @click="openModal()" class="btn-primary">
        <i class="fas fa-plus"></i> Nova Categoria
      </button>
    </div>

    <div class="table-container">
      <div v-if="categories.length === 0" class="empty-state">
        <i class="fas fa-folder-open"></i>
        <p>Nenhuma categoria encontrada.</p>
      </div>

      <table v-else>
        <thead>
          <tr>
            <th>Categoria / Slug</th>
            <th>Ícone</th>
            <th>Descrição SEO</th>
            <th style="width: 100px;">Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="cat in categories" :key="cat.id">
            <td>
              <strong>{{ cat.name }}</strong>
              <br><small class="slug-text">/{{ cat.slug }}</small>
            </td>
            <td>
              <div class="icon-preview-cell">
                <i :class="cat.icon"></i>
                <span>{{ cat.icon }}</span>
              </div>
            </td>
            <td class="desc-cell" :title="cat.seoDescription">
              {{ cat.seoDescription || '-' }}
            </td>
            <td>
              <div class="actions-cell">
                <button @click="openModal(cat)" class="btn-icon" title="Editar">
                  <i class="fas fa-edit"></i>
                </button>
                <button @click="handleDelete(cat.id)" class="btn-icon btn-danger" title="Excluir">
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
          <h2>{{ editingId ? 'Editar Categoria' : 'Nova Categoria' }}</h2>
          <button @click="closeModal" class="btn-close"><i class="fas fa-times"></i></button>
        </div>

        <div class="modal-body">
          <div class="form-group">
            <label>Nome da Categoria</label>
            <input 
              v-model="form.name" 
              type="text" 
              placeholder="Ex: Inteligência Artificial"
              autofocus
            >
          </div>

          <div class="form-group">
            <label>Slug URL</label>
            <div class="input-group">
              <span class="input-addon">/</span>
              <input v-model="form.slug" type="text" class="input-mono">
            </div>
          </div>

          <div class="form-row">
            <div class="form-group" style="flex: 1;">
              <label>Ícone (FontAwesome)</label>
              <input 
                v-model="form.icon" 
                type="text" 
                placeholder="Ex: fas fa-robot"
                class="input-mono"
              >
            </div>
            <div class="preview-box">
              <i :class="form.icon"></i>
            </div>
          </div>

          <div class="form-group">
            <label>Descrição SEO</label>
            <textarea v-model="form.seoDescription" rows="3"></textarea>
          </div>
        </div>

        <div class="modal-footer">
          <button @click="closeModal" class="btn-secondary">Cancelar</button>
          <button @click="handleSave" class="btn-primary">
            {{ editingId ? 'Salvar' : 'Criar' }}
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
  margin-bottom: 30px; /* Mesma distância da tabela que o Dashboard */
}

/* O H1 foi removido daqui para usar o estilo global/nativo, 
   garantindo tamanho e margens idênticos ao "Dashboard de Posts" */

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
  font-size: 1rem; /* Garante consistência */
}

.btn-primary:hover {
  background-color: var(--aws-orange-hover, #e68a00);
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
.btn-secondary:hover { background-color: #f9f9f9; }

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
  font-size: 0.9rem; /* Consistência com headers */
}

tr:hover { background-color: #f8fafc; }

/* Tipografia da tabela */
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
  margin-top: 29px; /* Alinhamento visual com input com label */
}

.modal-footer {
  padding: 16px 24px; border-top: 1px solid var(--gray-border, #eee);
  background: #f9fafb; display: flex; justify-content: flex-end; gap: 12px; border-radius: 0 0 8px 8px;
}
</style>