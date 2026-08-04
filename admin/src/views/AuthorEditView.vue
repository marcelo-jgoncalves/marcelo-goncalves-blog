<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { authorsApi } from '../services/api'
import UploadModal from '../components/UploadModal.vue'
import RichTextEditor from '../components/RichTextEditor.vue'
import { useToast } from '../composables/useToast'

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
const { toast, showToast } = useToast()

const initials = computed(() => {
  const parts = (form.value.nome_exibicao || '').trim().split(/\s+/).filter(Boolean)
  if (!parts.length) return 'MG'
  return parts.slice(0, 2).map(p => p[0]?.toUpperCase() || '').join('')
})

onMounted(async () => {
  loading.value = true
  try {
    const data = await authorsApi.get(AUTHOR_ID)
    if (data.autor) {
      form.value = { ...form.value, ...data.autor }
    }
  } catch {
    // Author doesn't exist yet: will be created on save
  } finally {
    loading.value = false
  }
})

async function save() {
  saving.value = true
  try {
    await authorsApi.save(form.value)
    showToast('Perfil salvo com sucesso!')
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro desconhecido'
    showToast('Erro ao salvar perfil: ' + message, 'error')
  } finally {
    saving.value = false
  }
}

function onImageUploaded(relativePath: string) {
  form.value.foto_avatar_url = `${ASSETS_URL}/${relativePath}`
}

// basePath with no extension → 480w variant for the admin preview
const avatarPreviewUrl = computed(() => {
  const url = form.value.foto_avatar_url
  if (!url) return ''
  const base = url.replace(/\.(avif|webp|jpg|jpeg|png)$/i, '')
  return `${base}-480.webp`
})
</script>

<template>
  <div data-screen-label="Autor" class="ia-author">
    <Transition name="ia-toast">
      <div v-if="toast" :class="['ia-toast', `ia-toast--${toast.type}`]" role="alert">
        <span class="ia-toast-check">✓</span>{{ toast.message }}
      </div>
    </Transition>

    <div class="ia-eyebrow"><span class="ia-eyebrow-line"></span>Configurações</div>
    <h1 class="ia-h1">Perfil do autor</h1>
    <p class="ia-subtitle">Aparece no rodapé de cada post e na página Sobre.</p>

    <div v-if="loading" class="ia-loading">Carregando dados…</div>

    <div v-else class="ia-card">
      <div class="ia-card-top">
        <div class="ia-avatar">
          <img v-if="avatarPreviewUrl" :src="avatarPreviewUrl" alt="Avatar" />
          <span v-else>{{ initials }}</span>
        </div>
        <div>
          <button class="ia-btn-outline" @click="showUploadModal = true">Trocar avatar</button>
          <div class="ia-avatar-hint">Quadrada · mín. 400×400px</div>
        </div>
      </div>

      <div class="ia-field-block">
        <label class="ia-field-label">Nome</label>
        <input v-model="form.nome_exibicao" type="text" placeholder="Ex: Marcelo Gonçalves" class="ia-input" />
      </div>

      <div class="ia-field-block">
        <label class="ia-field-label">Bio</label>
        <RichTextEditor v-model="form.bio" :key="AUTHOR_ID" @request-upload="() => {}" />
      </div>

      <div class="ia-field-block">
        <label class="ia-field-label">URL da foto</label>
        <input v-model="form.foto_avatar_url" type="text" class="ia-input" disabled />
      </div>
      <div class="ia-field-block">
        <label class="ia-field-label">Alt text (acessibilidade)</label>
        <input v-model="form.foto_avatar_alt_text" type="text" placeholder="Descrição da foto" class="ia-input" />
      </div>

      <div class="ia-field-block">
        <label class="ia-field-label">LinkedIn URL</label>
        <input v-model="form.linkedin_url" type="text" placeholder="https://linkedin.com/in/..." class="ia-input" />
      </div>
      <div class="ia-field-block">
        <label class="ia-field-label">GitHub URL</label>
        <input v-model="form.github_url" type="text" placeholder="https://github.com/..." class="ia-input" />
      </div>
      <div class="ia-field-block">
        <label class="ia-field-label">Instagram URL</label>
        <input v-model="form.instagram_url" type="text" placeholder="https://instagram.com/..." class="ia-input" />
      </div>

      <div class="ia-card-footer">
        <button class="ia-btn-primary" @click="save" :disabled="saving">
          {{ saving ? 'Salvando…' : 'Salvar perfil' }}
        </button>
      </div>
    </div>

    <UploadModal v-if="showUploadModal" @close="showUploadModal = false" @uploaded="onImageUploaded" />
  </div>
</template>

<style scoped>
.ia-author { padding: 38px 40px 90px; max-width: 640px; }

.ia-eyebrow {
  display: flex; align-items: center; gap: 10px; font-family: var(--font-mono); font-size: 10.5px;
  letter-spacing: .22em; text-transform: uppercase; color: var(--accent); margin-bottom: 14px;
}
.ia-eyebrow-line { width: 22px; height: 1px; background: var(--accent); }
.ia-h1 { font-weight: 800; font-size: 2rem; letter-spacing: -.04em; color: var(--petrol); line-height: 1.05; margin: 0; }
.ia-subtitle { font-size: 14px; color: var(--slate-500); margin: 10px 0 0; }

.ia-loading { padding: 40px; text-align: center; color: var(--slate-500); }

.ia-card { margin-top: 26px; background: #fff; border: 1px solid var(--border-color); border-radius: 14px; padding: 26px; }
.ia-card-top { display: flex; align-items: center; gap: 18px; padding-bottom: 22px; border-bottom: 1px solid var(--slate-100); }
.ia-avatar {
  width: 66px; height: 66px; border-radius: 50%; background: linear-gradient(150deg, var(--petrol), var(--petrol-deep));
  display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 800; font-size: 22px;
  letter-spacing: -.02em; flex: none; overflow: hidden;
}
.ia-avatar img { width: 100%; height: 100%; object-fit: cover; }
.ia-avatar-hint { font-size: 11.5px; color: var(--slate-400); margin-top: 7px; }

.ia-field-block { margin-top: 22px; }
.ia-field-label {
  display: block; font-family: var(--font-mono); font-size: 10px; letter-spacing: .14em; text-transform: uppercase;
  color: var(--slate-400); margin-bottom: 8px;
}
.ia-input {
  width: 100%; font-family: var(--font-sans); font-size: 14.5px; color: var(--dark-700);
  background: #fff; border: 1px solid var(--border-color); border-radius: 9px; padding: 10px 12px;
}
.ia-input:focus { outline: none; border-color: var(--accent); }
.ia-input:disabled { background: var(--slate-100); color: var(--slate-400); cursor: not-allowed; }

.ia-btn-outline {
  font-size: 13px; font-weight: 600; color: var(--petrol); background: #fff; border: 1px solid var(--border-color);
  border-radius: 9px; padding: 9px 15px; cursor: pointer;
}
.ia-btn-outline:hover { background: var(--slate-100); }

.ia-card-footer { display: flex; justify-content: flex-end; margin-top: 20px; }
.ia-btn-primary {
  display: inline-flex; align-items: center; gap: 8px; background: var(--accent); color: #fff;
  border: none; cursor: pointer; font-weight: 600; font-size: 13.5px;
  padding: 11px 18px; border-radius: 10px; box-shadow: 0 6px 16px rgba(201,96,60,.28); transition: filter .15s;
}
.ia-btn-primary:hover { filter: brightness(.92); }
.ia-btn-primary:disabled { opacity: .6; cursor: not-allowed; }

.ia-toast {
  position: fixed; bottom: 24px; right: 24px; z-index: 60; background: var(--petrol); color: #fff;
  padding: 13px 18px; border-radius: 12px; box-shadow: 0 14px 34px rgba(12,32,39,.28);
  display: flex; align-items: center; gap: 12px; font-size: 13.5px; font-weight: 500;
}
.ia-toast--error { background: #A94C2D; }
.ia-toast-check { width: 22px; height: 22px; border-radius: 50%; background: var(--moss); display: flex; align-items: center; justify-content: center; font-size: 12px; flex: none; }
.ia-toast--error .ia-toast-check { background: rgba(255,255,255,.25); }
.ia-toast-enter-active, .ia-toast-leave-active { transition: opacity .25s, transform .25s; }
.ia-toast-enter-from, .ia-toast-leave-to { opacity: 0; transform: translateY(14px); }
</style>
