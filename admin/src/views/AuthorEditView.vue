<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { authorsApi } from '../services/api'
import UploadModal from '../components/UploadModal.vue'
import RichTextEditor from '../components/RichTextEditor.vue'

const ASSETS_URL = import.meta.env.VITE_ASSETS_URL || ''
const AUTHOR_ID = 'marcelo-goncalves'

const form = ref({
  autor_id: AUTHOR_ID,
  nome_exibicao: '',
  bio: '',
  foto_avatar_url: '',
  foto_avatar_alt_text: '',
  linkedin_url: '',
  github_url: '',
  instagram_url: ''
})

const loading = ref(false)
const saving = ref(false)
const showUploadModal = ref(false)
const toast = ref<{ message: string; type: 'success' | 'error' } | null>(null)

function showToast(message: string, type: 'success' | 'error' = 'success') {
  toast.value = { message, type }
  setTimeout(() => { toast.value = null }, 4000)
}

onMounted(async () => {
  loading.value = true
  try {
    const data = await authorsApi.get(AUTHOR_ID)
    if (data.autor) {
      form.value = { ...form.value, ...data.autor }
    }
  } catch {
    // Autor ainda não existe — será criado ao salvar
  } finally {
    loading.value = false
  }
})

async function save() {
  saving.value = true
  try {
    await authorsApi.save(form.value)
    showToast('Perfil salvo com sucesso!')
  } catch (error: any) {
    showToast('Erro ao salvar perfil: ' + error.message, 'error')
  } finally {
    saving.value = false
  }
}

function onImageUploaded(relativePath: string) {
  form.value.foto_avatar_url = `${ASSETS_URL}/${relativePath}`
}

// basePath sem extensão → variante 480w para o preview do admin
const avatarPreviewUrl = computed(() => {
  const url = form.value.foto_avatar_url
  if (!url) return ''
  const base = url.replace(/\.(avif|webp|jpg|jpeg|png)$/i, '')
  return `${base}-480.webp`
})
</script>

<template>
  <div class="editor">
    <Transition name="toast">
      <div v-if="toast" :class="['toast', `toast--${toast.type}`]" role="alert">
        {{ toast.message }}
      </div>
    </Transition>

    <header class="editor-header">
      <h1>Editar Perfil</h1>
      <button class="btn-primary" @click="save" :disabled="saving">
        {{ saving ? 'Salvando...' : 'Salvar Perfil' }}
      </button>
    </header>

    <div v-if="loading" class="loading">Carregando dados...</div>

    <div v-else class="editor-grid">
      <div class="main-column">
        <div class="form-group">
          <label>Nome de Exibição</label>
          <input v-model="form.nome_exibicao" type="text" placeholder="Ex: Marcelo Gonçalves" />
        </div>

        <div class="form-group">
          <label>Biografia</label>
          <RichTextEditor
            v-model="form.bio"
            :key="AUTHOR_ID"
            @request-upload="() => {}"
          />
          <small>Suporta formatação básica — negrito, itálico, links.</small>
        </div>

        <div class="panel">
          <h3>Redes Sociais</h3>
          <div class="form-group">
            <label>LinkedIn URL</label>
            <input v-model="form.linkedin_url" type="text" placeholder="https://linkedin.com/in/..." />
          </div>
          <div class="form-group">
            <label>GitHub URL</label>
            <input v-model="form.github_url" type="text" placeholder="https://github.com/..." />
          </div>
          <div class="form-group">
            <label>Instagram URL</label>
            <input v-model="form.instagram_url" type="text" placeholder="https://instagram.com/..." />
          </div>
        </div>
      </div>

      <aside class="settings-column">
        <div class="panel">
          <h3>Foto de Perfil</h3>
          <div class="avatar-preview">
            <img v-if="avatarPreviewUrl" :src="avatarPreviewUrl" alt="Avatar" />
            <div v-else class="avatar-placeholder"><i class="fas fa-user"></i></div>
          </div>

          <button class="btn-outline" @click="showUploadModal = true" style="margin-top: 15px;">
            <i class="fas fa-camera"></i> Alterar Foto
          </button>

          <div class="form-group" style="margin-top: 15px;">
            <label>URL da Foto</label>
            <input v-model="form.foto_avatar_url" type="text" disabled />
          </div>
          <div class="form-group">
            <label>Alt Text (Acessibilidade)</label>
            <input v-model="form.foto_avatar_alt_text" type="text" placeholder="Descrição da foto" />
          </div>
        </div>
      </aside>
    </div>

    <UploadModal v-if="showUploadModal" @close="showUploadModal = false" @uploaded="onImageUploaded" />
  </div>
</template>

<style scoped>
.editor-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-4); }
.editor-grid { display: grid; grid-template-columns: 2fr 1fr; gap: var(--space-4); }
.form-group { margin-bottom: var(--space-3); }
label { display: block; font-weight: 600; margin-bottom: var(--space-1); font-size: var(--text-sm); color: var(--dark-900); }
input { width: 100%; padding: 10px; border: 1px solid var(--border-color); border-radius: 4px; font-size: var(--text-base); }
input:focus { outline: none; border-color: var(--accent); }
.panel { background: white; padding: var(--space-3); border-radius: 8px; margin-bottom: var(--space-3); box-shadow: 0 2px 5px rgba(0,0,0,0.05); }
.panel h3 { border-bottom: 1px solid var(--border-color); padding-bottom: var(--space-1); margin-bottom: var(--space-2); font-size: var(--text-lg); }

.avatar-preview {
  width: 150px; height: 150px; margin: 0 auto;
  border-radius: 50%; overflow: hidden;
  background: var(--slate-100); border: 4px solid white;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  display: flex; align-items: center; justify-content: center;
}
.avatar-preview img { width: 100%; height: 100%; object-fit: cover; }
.avatar-placeholder { font-size: var(--text-4xl); color: var(--slate-300); }

.btn-primary { background: var(--accent); color: white; border: none; padding: var(--space-1) var(--space-3); border-radius: 4px; font-weight: 700; cursor: pointer; font-family: var(--font-display); transition: background-color 0.2s; }
.btn-primary:hover { background: var(--accent-hover); }
.btn-outline { background: white; border: 1px solid var(--border-color); padding: 8px 15px; width: 100%; border-radius: 4px; cursor: pointer; color: var(--dark-700); transition: border-color 0.2s; }
.btn-outline:hover { border-color: var(--accent); color: var(--accent); }

.toast {
  position: fixed; top: var(--space-3); right: var(--space-3);
  padding: var(--space-2) var(--space-3); border-radius: 6px; font-weight: 600; color: #fff;
  z-index: 1000; box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}
.toast--success { background: #2d6a4f; }
.toast--error   { background: #c0392b; }
.toast-enter-active, .toast-leave-active { transition: opacity 0.3s, transform 0.3s; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(-10px); }

@media (max-width: 900px) { .editor-grid { grid-template-columns: 1fr; } }
</style>
