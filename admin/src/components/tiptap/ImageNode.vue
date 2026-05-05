*/admin/src/components/tiptap/ImageNode.vue*/

<script setup lang="ts">
import { NodeViewWrapper, nodeViewProps } from '@tiptap/vue-3'
import { ref, computed, onMounted } from 'vue'

const props = defineProps(nodeViewProps)

const src = computed(() => props.node.attrs.src)
const alt = computed(() => props.node.attrs.alt)
const isLoading = ref(true)
const hasError = ref(false)
const isDefinitiveError = ref(false)
const retryCount = ref(0)
const maxRetries = 5 // Tenta por ~10 segundos (5 * 2s)

// Cache Buster para forçar o navegador a tentar baixar de novo se der erro
const cacheBuster = ref('')

const currentSrc = computed(() => {
  if (!cacheBuster.value) return src.value
  // Adiciona timestamp apenas se estiver tentando de novo
  return `${src.value}?retry=${cacheBuster.value}`
})

function onLoad() {
  isLoading.value = false
  hasError.value = false
}

function onError() {
  isLoading.value = false
  hasError.value = true

  if (retryCount.value < maxRetries) {
    setTimeout(() => {
      retryCount.value++
      isLoading.value = true
      hasError.value = false
      cacheBuster.value = Date.now().toString()
    }, 2000)
  } else {
    isDefinitiveError.value = true
  }
}
</script>

<template>
  <NodeViewWrapper class="image-node-view">
    <div class="image-container" :class="{ 'selected': selected, 'error': hasError && !isLoading }">
      
      <div v-if="isLoading" class="loading-overlay">
        <i class="fas fa-cog fa-spin"></i> Processando imagem...
      </div>

      <img 
        :src="currentSrc" 
        :alt="alt" 
        @load="onLoad" 
        @error="onError"
        :class="{ 'opacity-50': isLoading }"
      />

      <div v-if="hasError && !isLoading && !isDefinitiveError" class="error-msg">
        ⚠️ Carregando... tentativa {{ retryCount }}/{{ maxRetries }}
      </div>
      <div v-if="isDefinitiveError" class="error-msg error-definitive">
        ✕ Imagem indisponível — verifique a URL
      </div>
    </div>
  </NodeViewWrapper>
</template>

<style scoped>
.image-node-view {
  display: inline-block;
  max-width: 100%;
  margin: 1rem 0;
}
.image-container {
  position: relative;
  display: inline-block;
  border-radius: 8px;
  overflow: hidden;
  line-height: 0; /* Remove espaço extra embaixo da img */
}
.image-container.selected {
  outline: 3px solid var(--aws-orange);
}
img {
  max-width: 100%;
  height: auto;
  display: block;
  border-radius: 8px;
  transition: opacity 0.3s;
}
.opacity-50 {
  opacity: 0.5;
  filter: blur(2px);
}
.loading-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0,0,0,0.7);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  z-index: 2;
  pointer-events: none;
}
.error-msg {
  position: absolute;
  bottom: 10px;
  left: 0;
  width: 100%;
  text-align: center;
  background: rgba(180, 83, 9, 0.85);
  color: white;
  padding: 5px;
  font-size: 0.8rem;
}
.error-definitive {
  background: rgba(185, 28, 28, 0.9);
  font-weight: 600;
}
</style>