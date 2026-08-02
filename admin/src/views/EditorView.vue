<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, nextTick } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import UploadModal from '../components/UploadModal.vue'
import RichTextEditor from '../components/RichTextEditor.vue'
import EditorTopbar from '../components/editor/EditorTopbar.vue'
import SettingsDrawer from '../components/editor/SettingsDrawer.vue'
import PostPreviewOverlay from '../components/editor/PostPreviewOverlay.vue'
import { usePostForm } from '../composables/usePostForm'
import { useEditorOutline } from '../composables/useEditorOutline'
import { useEditableTitleSubtitle } from '../composables/useEditableTitleSubtitle'

const {
  route, router, toast,
  isEditing, loading, saving, loadingCategories, categorias, form,
  isDirty, captureInitialState,
  authorName, authorInitials, authorAvatarUrl,
  previewUrl, featureImagePreviewUrl, coverFullUrl,
  categoriaNome, availableSubcategorias,
  words, serpTitle, serpDesc, serpUrl,
  generateSlug, loadInitialData, save, publish,
  handleFeatureImageError, applyUploadedImage, removeCover,
} = usePostForm()

const editorRef = ref<InstanceType<typeof RichTextEditor> | null>(null)
const editorWrapperRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const subtitleRef = ref<HTMLElement | null>(null)

const showUploadModal = ref(false)
const uploadContext = ref<'destaque' | 'editor'>('destaque')

// Writing screen panels / modes
const settingsOpen = ref(false)
const focusMode = ref(false)
const previewOpen = ref(false)
const hintOpen = ref(true)
const windowTick = ref(0)
const showOutline = computed(() => {
  void windowTick.value // reevaluate on resize
  return !focusMode.value && typeof window !== 'undefined' && window.innerWidth >= 1180
})

const saveStatus = computed<'saved' | 'editing' | 'saving'>(() => {
  if (saving.value) return 'saving'
  if (isDirty.value) return 'editing'
  return 'saved'
})
const SAVE_STATUS_META = {
  saved:   { label: 'Salvo',      color: 'var(--moss)' },
  editing: { label: 'Editando…',  color: 'var(--accent)' },
  saving:  { label: 'Salvando…',  color: 'var(--slate-400)' },
}

const handleBeforeUnload = (e: BeforeUnloadEvent) => {
  if (isDirty.value) { e.preventDefault(); e.returnValue = '' }
}
function onWindowResize() {
  windowTick.value++
}
onMounted(() => {
  window.addEventListener('beforeunload', handleBeforeUnload)
  window.addEventListener('resize', onWindowResize)
})
onUnmounted(() => {
  window.removeEventListener('beforeunload', handleBeforeUnload)
  window.removeEventListener('resize', onWindowResize)
})

onBeforeRouteLeave(() => {
  if (isDirty.value) {
    return window.confirm('Há alterações não salvas. Deseja sair mesmo assim?')
  }
})

const { outline, refreshOutline, scrollToHeading } = useEditorOutline(
  editorWrapperRef,
  computed(() => form.value.conteudo_html),
)

const {
  syncTitleSubtitleDom, onTitleInput: syncTitleInput, onSubtitleInput,
  onTitleKeydown, onSubtitleKeydown,
} = useEditableTitleSubtitle(titleRef, subtitleRef, {
  getSyncKey: () => (isEditing.value ? 'edit-' + route.params.slug : 'new') as string,
  getTitle: () => form.value.titulo,
  getSubtitle: () => form.value.subtitulo || '',
  onTitleInput: (text) => {
    form.value.titulo = text
    generateSlug()
  },
  onSubtitleInput: (text) => {
    form.value.subtitulo = text
  },
  onSubtitleEnter: () => editorRef.value?.focusStart(),
})

onMounted(async () => {
  await loadInitialData()
  await nextTick()
  syncTitleSubtitleDom()
  refreshOutline()
  captureInitialState()
})

function backToPosts() {
  router.push('/')
}

function openPreview() {
  refreshOutline()
  previewOpen.value = true
}

function toggleFocus() {
  focusMode.value = !focusMode.value
}

// relativePath = "media/{uuid}-{name}" (no extension — multi-variant format)
function onImageUploaded(relativePath: string) {
  applyUploadedImage(relativePath, uploadContext.value, (url, alt) => {
    editorRef.value?.insertImage(url, alt)
  })
}

function openFeatureImageUpload() {
  uploadContext.value = 'destaque'
  showUploadModal.value = true
}
function openEditorImageUpload() {
  uploadContext.value = 'editor'
  showUploadModal.value = true
}
</script>

<template>
  <div data-screen-label="Editor de post" class="ia-write-screen" :class="{ 'ia-focus': focusMode }">
    <Transition name="ia-toast">
      <div v-if="toast" :class="['ia-toast', `ia-toast--${toast.type}`]" role="alert">
        <span class="ia-toast-check">✓</span>{{ toast.message }}
      </div>
    </Transition>

    <EditorTopbar
      :save-status-label="SAVE_STATUS_META[saveStatus].label"
      :save-status-color="SAVE_STATUS_META[saveStatus].color"
      :words="words"
      :tempo-leitura-min="form.tempo_leitura_min"
      :preview-url="previewUrl"
      :focus-mode="focusMode"
      :saving="saving"
      :publish-label="form.status === 'Programado' ? 'Agendar' : 'Publicar'"
      @back="backToPosts"
      @open-settings="settingsOpen = true"
      @toggle-focus="toggleFocus"
      @open-preview="openPreview"
      @save="save"
      @publish="publish"
    />

    <div v-if="loading" class="ia-loading">Carregando…</div>

    <div v-else class="ia-body">
      <aside v-if="showOutline" class="ia-outline">
        <div class="ia-outline-header">Sumário</div>
        <p v-if="outline.length === 0" class="ia-outline-empty">Os títulos que você criar aparecem aqui para navegar.</p>
        <div v-else class="ia-outline-list ia-scroll">
          <a
            v-for="item in outline"
            :key="item.id"
            class="ia-outline-item"
            :class="`ia-outline-item--h${item.level}`"
            @click="scrollToHeading(item.id)"
          >{{ item.text }}</a>
        </div>

        <div class="ia-shortcuts">
          <div class="ia-shortcuts-header">Atalhos</div>
          <div class="ia-shortcuts-list">
            <div class="ia-shortcut-row"><span>Título</span><span class="ia-key">## ␣</span></div>
            <div class="ia-shortcut-row"><span>Lista</span><span class="ia-key">- ␣</span></div>
            <div class="ia-shortcut-row"><span>Citação</span><span class="ia-key">&gt; ␣</span></div>
            <div class="ia-shortcut-row"><span>Blocos ricos</span><span class="ia-key">menu ⌄</span></div>
          </div>
        </div>
      </aside>

      <div class="ia-sheet" :class="{ 'ia-sheet--focus': focusMode }">
        <div v-if="form.imagem_destaque_url" class="ia-cover" :style="{ backgroundImage: `url(${coverFullUrl})` }">
          <div class="ia-cover-actions">
            <button class="ia-cover-btn" @click="openFeatureImageUpload">Trocar capa</button>
            <button class="ia-cover-btn ia-cover-btn--danger" @click="removeCover">Remover</button>
          </div>
        </div>
        <button v-else class="ia-add-cover" @click="openFeatureImageUpload">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 15l5-4 4 3 3-2 6 4"/></svg>
          Adicionar capa
        </button>

        <div
          ref="titleRef"
          class="ia-title"
          contenteditable="true"
          role="textbox"
          aria-multiline="false"
          aria-label="Título do post"
          data-ph="Título do post"
          @input="syncTitleInput"
          @keydown="onTitleKeydown"
        ></div>
        <div
          ref="subtitleRef"
          class="ia-sub"
          contenteditable="true"
          role="textbox"
          aria-multiline="false"
          aria-label="Subtítulo do post"
          data-ph="Um subtítulo que convida à leitura…"
          @input="onSubtitleInput"
          @keydown="onSubtitleKeydown"
        ></div>

        <div class="ia-divider"></div>

        <div ref="editorWrapperRef" class="ia-write-wrap">
          <RichTextEditor
            ref="editorRef"
            v-model="form.conteudo_html"
            :key="form.slug"
            :hide-toolbar="focusMode"
            @request-upload="openEditorImageUpload"
          />
        </div>
      </div>
    </div>

    <Transition name="ia-hint">
      <div v-if="hintOpen && !focusMode" class="ia-hint-bar">
        <span><span class="ia-key ia-key--dark">##&nbsp;␣</span> título</span>
        <span class="ia-hint-sep">·</span>
        <span><span class="ia-key ia-key--dark">-&nbsp;␣</span> lista</span>
        <span class="ia-hint-sep">·</span>
        <span>selecione o texto para formatar</span>
        <button class="ia-hint-close" aria-label="Fechar dica" @click="hintOpen = false">✕</button>
      </div>
    </Transition>

    <SettingsDrawer
      v-model:open="settingsOpen"
      v-model:form="form"
      :categorias="categorias"
      :available-subcategorias="availableSubcategorias"
      :loading-categories="loadingCategories"
      :is-editing="isEditing"
      :is-dirty="isDirty"
      :serp-title="serpTitle"
      :serp-desc="serpDesc"
      :serp-url="serpUrl"
      :feature-image-preview-url="featureImagePreviewUrl"
      @feature-image-error="handleFeatureImageError"
    />

    <PostPreviewOverlay
      v-model:open="previewOpen"
      :form="form"
      :categoria-nome="categoriaNome"
      :author-name="authorName"
      :author-initials="authorInitials"
      :author-avatar-url="authorAvatarUrl"
      :words="words"
      :cover-full-url="coverFullUrl"
    />

    <UploadModal
      v-if="showUploadModal"
      @close="showUploadModal = false"
      @uploaded="onImageUploaded"
    />
  </div>
</template>

<style scoped>
.ia-write-screen { min-height: 100vh; background: var(--slate-50); }

.ia-loading { padding: 60px; text-align: center; color: var(--slate-500); }

/* ===== Body / Outline / Sheet ===== */
.ia-body { padding: 0 24px; position: relative; }

.ia-outline {
  position: fixed; left: 50%; margin-left: -628px; width: 236px; top: 82px; height: calc(100vh - 110px);
  padding: 0 22px; display: flex; flex-direction: column;
}
.ia-outline-header { font-family: var(--font-mono); font-size: 9.5px; letter-spacing: .2em; text-transform: uppercase; color: var(--slate-400); margin-bottom: 16px; }
.ia-outline-empty { font-size: 12.5px; line-height: 1.6; color: #A9B4B0; }
.ia-outline-list { overflow-y: auto; display: flex; flex-direction: column; gap: 2px; }
.ia-outline-item {
  text-align: left; background: transparent; cursor: pointer; border-radius: 7px; border-left: 2px solid transparent;
  line-height: 1.35; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; transition: all .12s; display: block;
}
.ia-outline-item--h2 { font-size: 12.5px; font-weight: 600; color: var(--slate-500); padding: 5px 9px; }
.ia-outline-item--h3 { font-size: 12px; font-weight: 500; color: var(--slate-400); padding: 5px 9px 5px 20px; }
.ia-outline-item:hover { color: var(--petrol); background: var(--slate-100); }

.ia-shortcuts { margin-top: auto; padding-top: 20px; }
.ia-shortcuts-header { font-family: var(--font-mono); font-size: 9px; letter-spacing: .14em; text-transform: uppercase; color: var(--slate-400); margin-bottom: 9px; }
.ia-shortcuts-list { display: flex; flex-direction: column; gap: 7px; font-size: 11.5px; color: var(--slate-500); background: #fff; border: 1px solid var(--border-color); border-radius: 12px; padding: 13px 15px; }
.ia-shortcut-row { display: flex; justify-content: space-between; }
.ia-key { font-family: var(--font-mono); color: var(--petrol); }
.ia-key--dark { background: rgba(255,255,255,.16); padding: 2px 7px; border-radius: 5px; }

.ia-sheet {
  width: 100%; max-width: 740px; margin: 34px auto 80px; padding: 52px 60px 40px; position: relative;
  background: #fff; border: 1px solid #E7E0D3; border-radius: 18px;
  box-shadow: 0 1px 2px rgba(12,32,39,.04), 0 18px 46px rgba(12,32,39,.06); transition: max-width .3s;
}
.ia-sheet--focus { max-width: 760px; }

.ia-cover {
  position: relative; border-radius: 16px; overflow: hidden; height: 200px; margin-bottom: 34px;
  background-size: cover; background-position: center; box-shadow: inset 0 0 0 1px rgba(0,0,0,.06);
}
.ia-cover-actions { position: absolute; top: 12px; right: 12px; display: flex; gap: 8px; }
.ia-cover-btn {
  font-size: 11.5px; font-weight: 600; color: var(--petrol); background: rgba(255,255,255,.92); border: none;
  border-radius: 8px; padding: 7px 12px; cursor: pointer; backdrop-filter: blur(4px);
}
.ia-cover-btn--danger { color: #A94C2D; }

.ia-add-cover {
  display: inline-flex; align-items: center; gap: 8px; background: transparent; border: none; color: var(--slate-400);
  font-size: 13px; font-weight: 600; cursor: pointer; padding: 6px 0; margin-bottom: 12px;
}
.ia-add-cover:hover { color: var(--accent); }

.ia-title {
  width: 100%; font-family: var(--font-sans); font-weight: 800; font-size: 2.7rem; letter-spacing: -.045em;
  line-height: 1.08; color: var(--petrol); outline: none;
}
.ia-title:empty:before { content: attr(data-ph); color: #A9B4B0; pointer-events: none; }

.ia-sub {
  width: 100%; font-family: 'Newsreader', serif; font-size: 1.32rem; line-height: 1.5; color: #5c6f76;
  outline: none; margin-top: 14px;
}
.ia-sub:empty:before { content: attr(data-ph); color: #A9B4B0; pointer-events: none; }

.ia-divider { height: 1px; background: var(--border-color); margin: 26px 0 8px; }

.ia-write-wrap :deep(.tiptap-content .ProseMirror) {
  font-family: 'Newsreader', Georgia, serif; color: #0C2027; font-size: 1.28rem; line-height: 1.75;
  caret-color: var(--accent);
}
.ia-write-wrap :deep(.tiptap-content .ProseMirror p) { margin: 0 0 .85em; }
.ia-write-wrap :deep(.tiptap-content .ProseMirror h2) {
  font-family: var(--font-sans); font-weight: 800; font-size: 1.7rem; letter-spacing: -.03em; color: var(--petrol);
  margin: 1.5em 0 .35em; line-height: 1.15;
}
.ia-write-wrap :deep(.tiptap-content .ProseMirror h3) {
  font-family: var(--font-sans); font-weight: 700; font-size: 1.28rem; letter-spacing: -.015em; color: var(--petrol);
  margin: 1.25em 0 .3em;
}
.ia-write-wrap :deep(.tiptap-content .ProseMirror strong) { color: #A94C2D; font-weight: 600; }
.ia-write-wrap :deep(.tiptap-content .ProseMirror blockquote) {
  margin: 1.1em 0; padding: 2px 0 2px 20px; border-left: 3px solid var(--petrol); font-style: italic; color: var(--slate-500);
}

/* ===== Hint bar ===== */
.ia-hint-bar {
  position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); z-index: 30; display: flex; align-items: center;
  gap: 14px; background: var(--petrol); color: #fff; padding: 10px 16px; border-radius: 999px;
  box-shadow: 0 12px 30px rgba(12,32,39,.24); font-size: 12.5px;
}
.ia-hint-sep { opacity: .5; }
.ia-hint-close { background: transparent; border: none; color: rgba(255,255,255,.6); font-size: 15px; cursor: pointer; margin-left: 2px; padding: 0 2px; }
.ia-hint-enter-active, .ia-hint-leave-active { transition: opacity .2s; }
.ia-hint-enter-from, .ia-hint-leave-to { opacity: 0; }

/* ===== Toast ===== */
.ia-toast {
  position: fixed; bottom: 76px; right: 24px; z-index: 60; background: var(--petrol); color: #fff;
  padding: 13px 18px; border-radius: 12px; box-shadow: 0 14px 34px rgba(12,32,39,.28);
  display: flex; align-items: center; gap: 12px; font-size: 13.5px; font-weight: 500;
}
.ia-toast--error { background: #A94C2D; }
.ia-toast--warning { background: #b45309; }
.ia-toast-check { width: 22px; height: 22px; border-radius: 50%; background: var(--moss); display: flex; align-items: center; justify-content: center; font-size: 12px; flex: none; }
.ia-toast--error .ia-toast-check, .ia-toast--warning .ia-toast-check { background: rgba(255,255,255,.25); }
.ia-toast-enter-active, .ia-toast-leave-active { transition: opacity .25s, transform .25s; }
.ia-toast-enter-from, .ia-toast-leave-to { opacity: 0; transform: translateY(14px); }

@media (max-width: 1179px) {
  .ia-outline { display: none; }
}
</style>
