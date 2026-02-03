/*admin/src/components/UploadModal.vue */

<script setup lang="ts">
import { ref } from 'vue'
import { mediaApi } from '../services/api'

const emit = defineEmits(['close', 'uploaded'])
const fileInput = ref<HTMLInputElement | null>(null)
const uploading = ref(false)
const error = ref('')

async function handleUpload() {
  const file = fileInput.value?.files?.[0]
  if (!file) return

  uploading.value = true
  error.value = ''

  try {
    // 1. Obter URL Assinada
    const { uploadURL, finalPath } = await mediaApi.getUploadUrl(file.name, file.type)

    // 2. Enviar para o S3
    await mediaApi.uploadToS3(uploadURL, file)

    // 3. Retornar a URL pública final (Assumindo que o bucket de assets é servido pelo CloudFront do Frontend)
    // Nota: Precisamos saber o domínio do CloudFront do Frontend.
    // Por enquanto, vamos retornar o caminho relativo e deixar o Editor montar a URL completa ou usar variável de ambiente.
    // Para simplificar, vamos assumir que você vai configurar VITE_ASSETS_URL no .env.local
    
    emit('uploaded', finalPath)
    emit('close')
  } catch (err: any) {
    error.value = err.message || 'Erro no upload'
  } finally {
    uploading.value = false
  }
}
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
          <label>Selecionar Arquivo</label>
          <input type="file" ref="fileInput" accept="image/png, image/jpeg, image/webp" :disabled="uploading">
        </div>
        <p v-if="error" class="error">{{ error }}</p>
      </div>

      <footer class="modal-footer">
        <button class="btn-secondary" @click="$emit('close')" :disabled="uploading">Cancelar</button>
        <button class="btn-primary" @click="handleUpload" :disabled="uploading">
          <span v-if="uploading"><i class="fas fa-spinner fa-spin"></i> Enviando...</span>
          <span v-else>Fazer Upload</span>
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
.modal-box { background: white; padding: 25px; border-radius: 8px; width: 90%; max-width: 500px; }
.modal-header { display: flex; justify-content: space-between; margin-bottom: 20px; }
.close-btn { background: none; border: none; font-size: 1.5rem; cursor: pointer; }
.form-group { margin-bottom: 15px; }
.modal-footer { display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px; }
.error { color: red; font-size: 0.9rem; }

.btn-primary { background: var(--aws-orange); border: none; padding: 10px 20px; border-radius: 4px; font-weight: bold; cursor: pointer; }
.btn-secondary { background: #e0e0e0; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; }
</style>