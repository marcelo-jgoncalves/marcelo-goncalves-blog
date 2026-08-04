<script setup lang="ts">
import { ref } from 'vue'
import { CARD_VARIANTS } from '../../utils/taxonomy'
import { useDrawerFocusTrap } from '../../composables/useDrawerFocusTrap'
import type { PostFormState } from '../../composables/usePostForm'
import type { Categoria, Subcategoria } from '../../types'

const props = defineProps<{
  categorias: Categoria[]
  availableSubcategorias: Subcategoria[]
  loadingCategories: boolean
  isEditing: boolean
  isDirty: boolean
  serpTitle: string
  serpDesc: string
  serpUrl: string
  featureImagePreviewUrl: string
}>()

const emit = defineEmits<{ (e: 'feature-image-error'): void }>()

const open = defineModel<boolean>('open', { required: true })
const form = defineModel<PostFormState>('form', { required: true })

const drawerRef = ref<HTMLElement | null>(null)
const { onKeydown: onDrawerKeydown } = useDrawerFocusTrap(open, drawerRef)

// Roving tabindex for the status radiogroup (WCAG radiogroup pattern): Tab
// enters the group at the checked option, arrow keys move the selection.
const STATUS_OPTIONS = ['Rascunho', 'Publicado', 'Programado'] as const
function onStatusRadioKeydown(e: KeyboardEvent) {
  if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft' && e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return
  e.preventDefault()
  const currentIndex = STATUS_OPTIONS.indexOf(form.value.status as (typeof STATUS_OPTIONS)[number])
  const delta = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : -1
  const nextIndex = (currentIndex + delta + STATUS_OPTIONS.length) % STATUS_OPTIONS.length
  form.value.status = STATUS_OPTIONS[nextIndex]!
  const group = (e.currentTarget as HTMLElement)
  requestAnimationFrame(() => {
    group.querySelectorAll<HTMLElement>('[role="radio"]')[nextIndex]?.focus()
  })
}

void props
</script>

<template>
  <Transition name="ia-drawer">
    <div v-if="open" class="ia-drawer-overlay" role="presentation" @click.self="open = false">
      <aside
        ref="drawerRef"
        class="ia-drawer ia-scroll"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ia-drawer-title"
        tabindex="-1"
        @keydown="onDrawerKeydown"
      >
        <div class="ia-drawer-header">
          <span id="ia-drawer-title">Configurações do post</span>
          <button class="ia-drawer-close" aria-label="Fechar configurações" @click="open = false">✕</button>
        </div>

        <div class="ia-rail-card">
          <div class="ia-rail-header">Status</div>
          <div class="ia-segmented" role="radiogroup" aria-label="Status do post" @keydown="onStatusRadioKeydown">
            <button role="radio" :aria-checked="form.status === 'Rascunho'" :tabindex="form.status === 'Rascunho' ? 0 : -1" :class="['ia-seg', { active: form.status === 'Rascunho' }]" @click="form.status = 'Rascunho'">Rascunho</button>
            <button role="radio" :aria-checked="form.status === 'Publicado'" :tabindex="form.status === 'Publicado' ? 0 : -1" :class="['ia-seg', { active: form.status === 'Publicado' }]" @click="form.status = 'Publicado'">Publicado</button>
            <button role="radio" :aria-checked="form.status === 'Programado'" :tabindex="form.status === 'Programado' ? 0 : -1" :class="['ia-seg', { active: form.status === 'Programado' }]" @click="form.status = 'Programado'">Programado</button>
          </div>
          <div v-if="form.status === 'Programado'" class="ia-sched">
            <label class="ia-field-label">Publicar em</label>
            <input v-model="form.data_publicacao_programada" type="datetime-local" class="ia-input" />
          </div>
        </div>

        <div class="ia-rail-card">
          <div class="ia-rail-header">URL</div>
          <div class="ia-slug-field">
            <span class="ia-slug-prefix">/post/</span>
            <input v-model="form.slug" type="text" :disabled="isEditing" class="ia-slug-input" />
          </div>
          <div class="ia-field-block" style="margin-top:12px">
            <label class="ia-field-label">Resumo</label>
            <textarea v-model="form.resumo" rows="2" class="ia-textarea"></textarea>
          </div>
        </div>

        <div class="ia-rail-card">
          <div class="ia-rail-header">Categoria</div>
          <select v-model="form.categoria_slug" :disabled="loadingCategories" class="ia-select-full">
            <option v-if="loadingCategories" value="" disabled>Carregando categorias…</option>
            <option v-for="cat in categorias" :key="cat.categoria_slug" :value="cat.categoria_slug">{{ cat.nome }}</option>
          </select>
          <div v-if="availableSubcategorias.length" class="ia-field-block" style="margin-top:10px">
            <label class="ia-field-label">Subcategoria <small>(eyebrow do card)</small></label>
            <select v-model="form.subcategoria_slug" class="ia-select-full">
              <option value="">Nenhuma</option>
              <option v-for="sub in availableSubcategorias" :key="sub.slug" :value="sub.slug">{{ sub.nome }}</option>
            </select>
          </div>
          <div class="ia-field-block" style="margin-top:10px">
            <label class="ia-field-label">Tópico <small>(não exibido no blog ainda)</small></label>
            <input v-model="form.topico" type="text" placeholder="Ex: Bastidores, Monetização..." class="ia-input" />
          </div>
          <div class="ia-field-block" style="margin-top:10px">
            <label class="ia-field-label">Variante visual do card</label>
            <select v-model="form.variante_card" class="ia-select-full">
              <option value="">Padrão (definida pela categoria)</option>
              <option v-for="variant in CARD_VARIANTS" :key="variant.value" :value="variant.value">{{ variant.label }}</option>
            </select>
          </div>
        </div>

        <div class="ia-rail-card">
          <div class="ia-rail-header" style="margin-bottom:14px">Destaques</div>
          <div class="ia-toggle-row">
            <div>
              <div class="ia-toggle-title">Post popular</div>
              <div class="ia-toggle-sub">Aparece na seção "Em alta"</div>
            </div>
            <button
              class="ia-toggle-track"
              role="switch"
              :aria-checked="form.e_popular"
              aria-label="Post popular"
              @click="form.e_popular = !form.e_popular"
            >
              <span class="ia-toggle-track-bg" :style="{ background: form.e_popular ? 'var(--accent)' : '#D8CEBD' }"></span>
              <span class="ia-toggle-knob" :style="{ left: form.e_popular ? '19px' : '2.5px' }"></span>
            </button>
          </div>
          <div class="ia-toggle-row" style="margin-top:14px">
            <div>
              <div class="ia-toggle-title">Página do projeto</div>
              <div class="ia-toggle-sub">Lista em "O Projeto"</div>
            </div>
            <button
              class="ia-toggle-track"
              role="switch"
              :aria-checked="form.e_projeto"
              aria-label="Página do projeto"
              @click="form.e_projeto = !form.e_projeto"
            >
              <span class="ia-toggle-track-bg" :style="{ background: form.e_projeto ? 'var(--petrol)' : '#D8CEBD' }"></span>
              <span class="ia-toggle-knob" :style="{ left: form.e_projeto ? '19px' : '2.5px' }"></span>
            </button>
          </div>
        </div>

        <div class="ia-rail-card">
          <div class="ia-rail-header" style="margin-bottom:14px">SEO</div>
          <div class="ia-field-block">
            <label class="ia-field-label ia-field-label--row">
              Meta título
              <span class="ia-char-count" :class="{ warn: serpTitle.length > 60 }">{{ serpTitle.length }}/60</span>
            </label>
            <input v-model="form.meta_titulo_seo" type="text" class="ia-input" />
          </div>
          <div class="ia-field-block" style="margin-top:10px">
            <label class="ia-field-label ia-field-label--row">
              Meta descrição
              <span class="ia-char-count" :class="{ warn: serpDesc.length > 160 }">{{ serpDesc.length }}/160</span>
            </label>
            <textarea v-model="form.meta_descricao_seo" rows="3" class="ia-textarea"></textarea>
          </div>
          <div class="ia-serp">
            <div class="ia-serp-label">Pré-visualização · Google</div>
            <div class="ia-serp-title">{{ serpTitle }}</div>
            <div class="ia-serp-url">{{ serpUrl }}</div>
            <div class="ia-serp-desc">{{ serpDesc }}</div>
          </div>
        </div>

        <div class="ia-rail-card">
          <div class="ia-rail-header">Imagem de destaque</div>
          <div v-if="featureImagePreviewUrl" class="ia-image-preview">
            <img :src="featureImagePreviewUrl" alt="Preview" @error="emit('feature-image-error')" />
          </div>
          <div class="ia-field-block" style="margin-top:10px">
            <label class="ia-field-label">Alt text (acessibilidade)</label>
            <input v-model="form.imagem_destaque_alt_text" type="text" class="ia-input" />
          </div>
        </div>

        <div class="ia-rail-card ia-rail-card--compact">
          <div class="ia-meta-row">
            <span class="ia-meta-label">Tempo de leitura</span>
            <span class="ia-meta-value">{{ form.tempo_leitura_min }} min</span>
          </div>
          <div class="ia-meta-row" style="margin-top:9px">
            <span class="ia-meta-label">Última alteração</span>
            <span class="ia-meta-value ia-meta-value--muted">{{ isDirty ? 'agora (não salvo)' : 'salvo' }}</span>
          </div>
        </div>
      </aside>
    </div>
  </Transition>
</template>

<style scoped>
.ia-drawer-overlay { position: fixed; inset: 0; z-index: 65; background: rgba(8,50,61,.32); display: flex; justify-content: flex-end; }
.ia-drawer {
  width: 380px; max-width: 92vw; height: 100vh; background: #FCFAF6; border-left: 1px solid var(--border-color);
  padding: 20px 20px 60px; overflow-y: auto;
}
.ia-drawer-header {
  display: flex; align-items: center; justify-content: space-between; font-family: var(--font-mono); font-size: 11px;
  letter-spacing: .12em; text-transform: uppercase; color: var(--petrol); font-weight: 600; margin-bottom: 18px;
}
.ia-drawer-close { background: none; border: none; font-size: 16px; color: var(--slate-400); cursor: pointer; }
.ia-drawer-enter-active, .ia-drawer-leave-active { transition: opacity .18s; }
.ia-drawer-enter-from, .ia-drawer-leave-to { opacity: 0; }

.ia-rail-card { background: #fff; border: 1px solid var(--border-color); border-radius: 13px; padding: 18px; margin-top: 16px; }
.ia-rail-card:first-of-type { margin-top: 0; }
.ia-rail-card--compact { padding: 16px 18px; }
.ia-rail-header { font-family: var(--font-mono); font-size: 10px; letter-spacing: .16em; text-transform: uppercase; color: var(--petrol); font-weight: 600; margin-bottom: 12px; }

.ia-segmented { display: flex; gap: 4px; background: var(--slate-100); border-radius: 9px; padding: 4px; }
.ia-seg { flex: 1; padding: 8px 4px; border-radius: 7px; border: none; cursor: pointer; font-size: 11.5px; font-weight: 500; color: var(--slate-500); background: transparent; }
.ia-seg.active { font-weight: 600; color: #fff; background: var(--petrol); }
.ia-sched { margin-top: 12px; }

.ia-slug-field { display: flex; align-items: center; background: #fff; border: 1px solid var(--border-color); border-radius: 9px; padding: 0 12px; font-family: var(--font-mono); font-size: 12.5px; }
.ia-slug-prefix { color: var(--slate-400); padding: 9px 0; white-space: nowrap; }
.ia-slug-input { flex: 1; font-family: var(--font-mono); font-size: 12.5px; color: var(--petrol); background: transparent; border: none; padding: 9px 2px; }
.ia-slug-input:focus { outline: none; }

.ia-field-block { margin-top: 0; }
.ia-field-label { display: block; font-family: var(--font-mono); font-size: 10px; letter-spacing: .14em; text-transform: uppercase; color: var(--slate-400); margin-bottom: 8px; }
.ia-field-label small { text-transform: none; letter-spacing: 0; font-family: var(--font-sans); }
.ia-field-label--row { display: flex; justify-content: space-between; align-items: center; }
.ia-textarea, .ia-input, .ia-select-full {
  width: 100%; font-family: var(--font-sans); font-size: 13.5px; color: var(--slate-500); background: #fff;
  border: 1px solid var(--border-color); border-radius: 9px; padding: 10px 12px;
}
.ia-textarea:focus, .ia-input:focus, .ia-select-full:focus { outline: none; border-color: var(--accent); }
.ia-select-full { appearance: none; cursor: pointer; }

.ia-toggle-row { display: flex; align-items: center; justify-content: space-between; }
.ia-toggle-title { font-size: 13.5px; font-weight: 600; color: var(--dark-700); }
.ia-toggle-sub { font-size: 11.5px; color: var(--slate-400); }
.ia-toggle-track { width: 40px; height: 23px; border-radius: 999px; border: none; cursor: pointer; position: relative; padding: 0; flex: none; background: transparent; }
.ia-toggle-track-bg { position: absolute; inset: 0; border-radius: 999px; transition: background .2s; }
.ia-toggle-knob { position: absolute; top: 2.5px; width: 18px; height: 18px; border-radius: 50%; background: #fff; transition: left .2s; box-shadow: 0 1px 3px rgba(0,0,0,.22); }

.ia-char-count { font-family: var(--font-mono); font-size: 10px; color: var(--slate-400); }
.ia-char-count.warn { color: #A94C2D; }
.ia-serp { margin-top: 14px; background: var(--slate-50); border: 1px solid var(--border-color); border-radius: 10px; padding: 14px; }
.ia-serp-label { font-family: var(--font-mono); font-size: 9px; letter-spacing: .14em; text-transform: uppercase; color: var(--slate-400); margin-bottom: 8px; }
.ia-serp-title { font-size: 15px; color: var(--petrol); font-weight: 500; line-height: 1.3; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ia-serp-url { font-family: var(--font-mono); font-size: 11.5px; color: var(--moss); margin: 3px 0 5px; }
.ia-serp-desc { font-size: 12.5px; line-height: 1.5; color: var(--slate-500); }

.ia-image-preview { border-radius: 10px; overflow: hidden; aspect-ratio: 16/9; background: var(--slate-100); }
.ia-image-preview img { width: 100%; height: 100%; object-fit: cover; }

.ia-meta-row { display: flex; align-items: center; justify-content: space-between; font-size: 12.5px; color: var(--slate-500); }
.ia-meta-label { color: var(--slate-400); }
.ia-meta-value { font-family: var(--font-mono); font-weight: 600; color: var(--petrol); }
.ia-meta-value--muted { font-weight: 400; color: var(--slate-400); }
</style>
