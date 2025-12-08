<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { authorsApi } from '../services/api'
import { useAuthStore } from '../stores/auth'
import UploadModal from '../components/UploadModal.vue'

const auth = useAuthStore()
const ASSETS_URL = import.meta.env.VITE_ASSETS_URL || ''

// ID do Autor fixo para este MVP (o mesmo usado no post: 'marcelo-goncalves')
// Futuramente pode vir do login do auth.user.username
const AUTHOR_ID = 'marcelo-goncalves' 

const form = ref({
  autor_id: AUTHOR_ID,
  nome_exibicao: '',
  bio: '', // Rich Text HTML
  foto_avatar_url: '',
  foto_avatar_alt_text: '',
  linkedin_url: '',
  github_url: '',
  instagram_url: '' // Novo campo
})

const loading = ref(false)
const saving = ref(false)
const showUploadModal = ref(false)

// Carregar dados
onMounted(async () => {
  loading.value = true
  try {
    const data = await authorsApi.get(AUTHOR_ID)
    if (data.autor) {
      form.value = { ...form.value, ...data.autor }
    }
  } catch (error) {
    console.log('Autor ainda não existe, criando novo profile...')
  } finally {
    loading.value = false
  }
})

// Salvar
async function save() {
  saving.value = true
  try {
    await authorsApi.save(form.value)
    alert('Perfil salvo com sucesso!')
  } catch (error: any) {
    alert('Erro ao salvar perfil: ' + error.message)
  } finally {
    saving.value = false
  }
}

// Upload Foto
function onImageUploaded(relativePath: string) {
  form.value.foto_avatar_url = `${ASSETS_URL}/${relativePath}`
}
</script>

<template>
  <div class="editor">
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
          <label>Biografia (Bio)</label>
          <div class="quill-wrapper">
             <QuillEditor theme="snow" v-model:content="form.bio" contentType="html" toolbar="essential" />
          </div>
          <small>Use este espaço para inserir o link "Clique aqui" para Serviços.</small>
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
             <img v-if="form.foto_avatar_url" :src="form.foto_avatar_url" alt="Avatar" />
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
/* Reutilizando estilos do EditorView para consistência */
.editor-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
.editor-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 30px; }
.form-group { margin-bottom: 20px; }
label { display: block; font-weight: 600; margin-bottom: 5px; color: var(--aws-dark); }
input { width: 100%; padding: 10px; border: 1px solid var(--gray-border); border-radius: 4px; }
.panel { background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 5px rgba(0,0,0,0.05); }
.panel h3 { border-bottom: 1px solid #eee; padding-bottom: 10px; margin-bottom: 15px; }

/* Estilos específicos do Avatar */
.avatar-preview {
    width: 150px; height: 150px; margin: 0 auto;
    border-radius: 50%; overflow: hidden;
    background: #f0f0f0; border: 4px solid white;
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    display: flex; align-items: center; justify-content: center;
}
.avatar-preview img { width: 100%; height: 100%; object-fit: cover; }
.avatar-placeholder { font-size: 3rem; color: #ccc; }

.quill-wrapper { background: white; border-radius: 4px; overflow: hidden; }
/* Altura mínima pro editor */
:deep(.ql-editor) { min-height: 200px; font-size: 1rem; }

.btn-primary { background: var(--aws-orange); border: none; padding: 10px 20px; border-radius: 4px; font-weight: bold; cursor: pointer; }
.btn-outline { background: white; border: 1px solid #ddd; padding: 8px 15px; width: 100%; border-radius: 4px; cursor: pointer; }

@media (max-width: 900px) { .editor-grid { grid-template-columns: 1fr; } }
</style>