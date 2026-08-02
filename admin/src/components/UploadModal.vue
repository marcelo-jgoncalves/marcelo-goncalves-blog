<script setup lang="ts">
import { ref, onBeforeUnmount } from 'vue'
import { mediaApi } from '../services/api'

const emit = defineEmits(['close', 'uploaded'])
const fileInput = ref<HTMLInputElement | null>(null)
const uploading = ref(false)
const error = ref('')
const previewUrl = ref('')

const VALID_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/heic', 'image/heif']
const MAX_SIZE_MB = 10
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024

function openFilePicker() {
  if (uploading.value) return
  fileInput.value?.click()
}

function clearPreview() {
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
  previewUrl.value = ''
}

async function handleFileChange() {
  const file = fileInput.value?.files?.[0]
  if (!file) return
  await handleUpload(file)
}

async function handleUpload(file: File) {
  if (!VALID_TYPES.includes(file.type)) {
    error.value = `Tipo inválido: ${file.type || 'desconhecido'}. Use PNG, JPEG, WebP, HEIC ou HEIF.`
    return
  }
  if (file.size > MAX_SIZE_BYTES) {
    error.value = `Arquivo muito grande: ${(file.size / 1024 / 1024).toFixed(1)} MB (máximo ${MAX_SIZE_MB} MB).`
    return
  }

  clearPreview()
  previewUrl.value = URL.createObjectURL(file)
  uploading.value = true
  error.value = ''

  try {
    const { url, fields, basePath } = await mediaApi.getUploadUrl(file.name, file.type)

    await mediaApi.uploadToS3(url, fields, file)

    // basePath = "media/{uuid}-{name}" (no extension) — imageProcessor
    // generates the variants: -480.avif, -480.webp, -768.*, -1280.*
    emit('uploaded', basePath)
    emit('close')
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Erro no upload'
  } finally {
    uploading.value = false
    if (fileInput.value) fileInput.value.value = ''
  }
}

onBeforeUnmount(clearPreview)
</script>

<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-box">
      <header class="modal-header">
        <h2>Upload de Imagem</h2>
        <button class="close-btn" @click="$emit('close')">&times;</button>
      </header>
      
      <div class="modal-body">
        <div class="form-group">
          <input
            type="file"
            ref="fileInput"
            class="file-input-hidden"
            accept="image/png, image/jpeg, image/webp, image/heic, image/heif"
            :disabled="uploading"
            @change="handleFileChange"
          >
          <div v-if="previewUrl" class="preview-wrap">
            <img :src="previewUrl" class="preview-img" alt="Pré-visualização da imagem selecionada">
            <span v-if="uploading" class="preview-uploading"><i class="fas fa-spinner fa-spin"></i> Enviando...</span>
          </div>
          <p class="hint">Selecione PNG, JPEG, WebP, HEIC ou HEIF (máx. {{ MAX_SIZE_MB }} MB).</p>
        </div>
        <p v-if="error" class="error">{{ error }}</p>
      </div>

      <footer class="modal-footer">
        <button class="btn-secondary" @click="$emit('close')" :disabled="uploading">Cancelar</button>
        <button class="btn-primary" @click="openFilePicker" :disabled="uploading">
          <span v-if="uploading"><i class="fas fa-spinner fa-spin"></i> Enviando...</span>
          <span v-else>Selecionar e Enviar</span>
        </button>
      </footer>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0,0,0,0.5); z-index: 1000;
  display: flex; justify-content: center; align-items: center;
}
.modal-box { background: white; padding: var(--space-3); border-radius: 8px; width: 90%; max-width: 500px; }
.modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-3); }
.modal-header h2 { font-size: var(--text-xl); color: var(--dark-900); margin: 0; }
.close-btn { background: none; border: none; font-size: var(--text-xl); cursor: pointer; color: var(--slate-400); }
.form-group { margin-bottom: var(--space-2); }
.file-input-hidden { display: none; }
.preview-wrap { position: relative; margin-bottom: var(--space-2); border-radius: 6px; overflow: hidden; }
.preview-img { display: block; width: 100%; max-height: 260px; object-fit: cover; }
.preview-uploading {
  position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
  gap: var(--space-1); background: rgba(12, 32, 39, 0.55); color: #fff; font-weight: 600;
}
.hint { color: var(--slate-400); font-size: var(--text-sm); margin: 0; }
.modal-footer { display: flex; justify-content: flex-end; gap: var(--space-1); margin-top: var(--space-3); }
.error { color: #c0392b; font-size: var(--text-sm); }

.btn-primary { background: var(--accent); color: white; border: none; padding: var(--space-1) var(--space-3); border-radius: 4px; font-weight: 700; cursor: pointer; font-family: var(--font-display); transition: background-color 0.2s; }
.btn-primary:hover { background: var(--accent-hover); }
.btn-secondary { background: var(--slate-100); border: 1px solid var(--border-color); padding: var(--space-1) var(--space-3); border-radius: 4px; cursor: pointer; color: var(--dark-700); transition: background-color 0.2s; }
.btn-secondary:hover { background: var(--slate-200); }
</style>