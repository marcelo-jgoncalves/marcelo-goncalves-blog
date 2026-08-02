<script setup lang="ts">
defineProps<{
  saveStatusLabel: string
  saveStatusColor: string
  words: number
  tempoLeituraMin: number
  previewUrl: string
  focusMode: boolean
  saving: boolean
  publishLabel: string
}>()

const emit = defineEmits<{
  (e: 'back'): void
  (e: 'open-settings'): void
  (e: 'toggle-focus'): void
  (e: 'open-preview'): void
  (e: 'save'): void
  (e: 'publish'): void
}>()
</script>

<template>
  <header class="ia-topbar" :class="{ 'ia-topbar--focus': focusMode }">
    <button class="ia-btn-back" @click="emit('back')">‹ Posts</button>

    <div class="ia-save-status">
      <span class="ia-save-dot" :style="{ background: saveStatusColor }"></span>
      <span class="ia-save-text" :style="{ color: saveStatusColor }">{{ saveStatusLabel }}</span>
    </div>

    <div style="flex:1"></div>

    <div class="ia-counters">
      <span>{{ words }} palavras</span>
      <span class="ia-counters-divider"></span>
      <span>{{ tempoLeituraMin }} min</span>
    </div>

    <a v-if="previewUrl" :href="previewUrl" target="_blank" rel="noopener" class="ia-btn-ghost" title="Ver no Blog" aria-label="Ver no Blog">
      <i class="fas fa-external-link-alt" aria-hidden="true"></i>
    </a>

    <button class="ia-btn-ghost" @click="emit('open-settings')" title="Configurações do post" aria-label="Configurações do post">
      <i class="fas fa-sliders-h" aria-hidden="true"></i>
    </button>

    <button class="ia-btn-focus" :class="{ on: focusMode }" @click="emit('toggle-focus')">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>
      {{ focusMode ? 'Sair do foco' : 'Foco' }}
    </button>

    <button class="ia-btn-read" @click="emit('open-preview')">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="2.5"/></svg>
      Ler
    </button>

    <button class="ia-btn-save" @click="emit('save')" :disabled="saving">Salvar</button>
    <button class="ia-btn-publish" @click="emit('publish')" :disabled="saving">
      {{ publishLabel }}
    </button>
  </header>
</template>

<style scoped>
.ia-topbar {
  position: sticky; top: 0; z-index: 40; display: flex; align-items: center; gap: 14px;
  padding: 11px 24px; background: rgba(250,248,243,.9); backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--border-color); transition: background .3s, border-color .3s;
}
.ia-topbar--focus { background: rgba(250,248,243,.7); border-bottom-color: transparent; }

.ia-btn-back {
  display: inline-flex; align-items: center; gap: 6px; background: transparent; border: 1px solid var(--border-color);
  color: var(--slate-500); font-size: 12.5px; font-weight: 600; padding: 7px 13px; border-radius: 9px; cursor: pointer;
}
.ia-btn-back:hover { background: #fff; }

.ia-save-status { display: flex; align-items: center; gap: 9px; min-width: 0; }
.ia-save-dot { width: 8px; height: 8px; border-radius: 50%; flex: none; }
.ia-save-text { font-family: var(--font-mono); font-size: 11px; letter-spacing: .04em; white-space: nowrap; }

.ia-counters { display: flex; align-items: center; gap: 16px; font-family: var(--font-mono); font-size: 11px; color: var(--slate-400); white-space: nowrap; }
.ia-counters-divider { width: 1px; height: 14px; background: var(--border-color); }

.ia-btn-ghost {
  display: inline-flex; align-items: center; gap: 7px; background: #fff; border: 1px solid var(--border-color);
  color: var(--petrol); font-size: 12.5px; font-weight: 600; padding: 8px 12px; border-radius: 9px; cursor: pointer;
}
.ia-btn-ghost:hover { background: var(--slate-100); }

.ia-btn-focus {
  display: inline-flex; align-items: center; gap: 7px; font-size: 12.5px; font-weight: 600; padding: 8px 13px;
  border-radius: 9px; cursor: pointer; background: #fff; border: 1px solid var(--border-color); color: var(--slate-500);
}
.ia-btn-focus.on { background: var(--petrol); border-color: var(--petrol); color: #fff; }
.ia-btn-focus:hover { background: var(--slate-100); }
.ia-btn-focus.on:hover { background: var(--petrol); }

.ia-btn-read {
  display: inline-flex; align-items: center; gap: 7px; background: #fff; border: 1px solid var(--border-color);
  color: var(--petrol); font-size: 12.5px; font-weight: 600; padding: 8px 14px; border-radius: 9px; cursor: pointer;
}
.ia-btn-read:hover { background: var(--slate-100); }

.ia-btn-save {
  background: #fff; border: 1px solid var(--petrol); color: var(--petrol); font-size: 12.5px; font-weight: 600;
  padding: 8px 16px; border-radius: 9px; cursor: pointer;
}
.ia-btn-save:hover { background: rgba(15,76,92,.06); }
.ia-btn-save:disabled { opacity: .6; cursor: not-allowed; }

.ia-btn-publish {
  background: var(--accent); color: #fff; border: none; font-size: 12.5px; font-weight: 600; padding: 8px 16px;
  border-radius: 9px; cursor: pointer; box-shadow: 0 6px 16px rgba(201,96,60,.28);
}
.ia-btn-publish:hover { filter: brightness(.92); }
.ia-btn-publish:disabled { opacity: .6; cursor: not-allowed; }
</style>
