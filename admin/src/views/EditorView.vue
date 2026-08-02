<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch, nextTick } from 'vue'
import { useRoute, useRouter, onBeforeRouteLeave } from 'vue-router'
import DOMPurify from 'dompurify'
import { postsApi, categoriesApi, authorsApi } from '../services/api'
import { useAuthStore } from '../stores/auth'
import UploadModal from '../components/UploadModal.vue'
import RichTextEditor from '../components/RichTextEditor.vue'
import { slugify } from '../utils/slug'
import { CARD_VARIANTS } from '../utils/taxonomy'
import { useToast } from '../composables/useToast'
import type { Autor, Categoria, Post } from '../types'

// div/span: wrapper for Tiptap's custom nodes (Callout, PullQuote,
// ClosingFlourish, YouTube embed) — without them DOMPurify "unwraps" those
// nodes, discarding the div and leaving only loose text in the saved HTML.
// Kept in sync with backend/src/common/sanitizer.ts — ALLOWED_TAGS and
// ALLOWED_ATTR must be identical between admin (DOMPurify) and backend (sanitize-html).
const ALLOWED_TAGS = [
  // Block
  'h1','h2','h3','h4','h5','h6',
  'p','blockquote','pre','hr','br',
  'ul','ol','li',
  'div','table','thead','tbody','tr','th','td',
  // Inline
  'strong','em','u','s','code',
  'a','img','span','mark',
  'iframe', // YouTube embeds
]
const ALLOWED_ATTR = [
  'src','alt','href','title','class','id','target','rel','width','height',
  'loading', // img
  'frameborder','allow','allowfullscreen','data-youtube-video', // iframe
  'colspan','rowspan', // th, td
]

function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, { ALLOWED_TAGS, ALLOWED_ATTR })
}

const featureImageCacheBuster = ref(Date.now())
const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const editorRef = ref<InstanceType<typeof RichTextEditor> | null>(null)
const editorWrapperRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const subtitleRef = ref<HTMLElement | null>(null)
const drawerRef = ref<HTMLElement | null>(null)
const drawerPreviousFocusRef = ref<HTMLElement | null>(null)

const ASSETS_URL = import.meta.env.VITE_ASSETS_URL || ''
// The blog has only 1 author by design — same hardcoded AUTHOR_ID used in AuthorEditView.vue.
const AUTHOR_ID = 'marcelo-goncalves'
const author = ref<Autor | null>(null)
const authorName = computed(() => author.value?.nome_exibicao || 'Marcelo Gonçalves')
const authorInitials = computed(() => {
  const parts = authorName.value.trim().split(/\s+/).filter(Boolean)
  if (!parts.length) return 'MG'
  return parts.slice(0, 2).map((p) => p[0]?.toUpperCase() || '').join('')
})
const authorAvatarUrl = computed(() => {
  const url = author.value?.foto_avatar_url
  if (!url) return ''
  const base = url.replace(/\.(avif|webp|jpg|jpeg|png)$/i, '')
  return `${base}-480.webp`
})

// e_popular/e_projeto become boolean only here (toggle UI state) — Post's
// real type (API contract) is 0|1 (backend/src/common/types.ts, DynamoDB
// has no boolean type for an indexed attribute). The conversion to 0|1
// already happened on save ("? 1 : 0"); only the form's type was wrong,
// inheriting Post directly instead of having its own local state type.
type PostFormState = Omit<Post, 'e_popular' | 'e_projeto'> & {
  e_popular: boolean
  e_projeto: boolean
}

const form = ref<PostFormState>({
  titulo: '',
  slug: '',
  conteudo_html: '',
  resumo: '',
  subtitulo: '',
  categoria_slug: 'tutoriais-aws',
  subcategoria_slug: '',
  subcategoria_nome: '',
  imagem_destaque_url: '',
  imagem_destaque_alt_text: '',
  meta_titulo_seo: '',
  meta_descricao_seo: '',
  e_popular: false,
  e_projeto: false,
  status: 'Rascunho',
  tempo_leitura_min: 5,
  data_publicacao: '',
  autor_id: '',
  topico: '',
  variante_card: ''
})

const isEditing = computed(() => route.params.slug !== undefined)
const showUploadModal = ref(false)
const loading = ref(false)
const saving = ref(false)
const uploadContext = ref<'destaque' | 'editor'>('destaque')
const loadingCategories = ref(true)
const { toast, showToast } = useToast()

// Writing screen panels / modes
const settingsOpen = ref(false)
const focusMode = ref(false)
const previewOpen = ref(false)
const hintOpen = ref(true)
const showOutline = computed(() => !focusMode.value && typeof window !== 'undefined' && window.innerWidth >= 1180)

// Dirty state — detects unsaved changes
const initialFormJson = ref('')
const isDirty = computed(() =>
  initialFormJson.value !== '' && JSON.stringify(form.value) !== initialFormJson.value
)

function captureInitialState() {
  initialFormJson.value = JSON.stringify(form.value)
}

const saveStatus = computed<'saved' | 'editing' | 'saving'>(() => {
  if (saving.value) return 'saving'
  if (isDirty.value) return 'editing'
  return 'saved'
})
const SAVE_STATUS_META = {
  saved:   { label: 'Salvo',      color: 'var(--moss)' },
  editing: { label: 'Editando…',  color: 'var(--accent)' },
  saving:  { label: 'Salvando…',  color: 'var(--slate-400)' }
}

const handleBeforeUnload = (e: BeforeUnloadEvent) => {
  if (isDirty.value) { e.preventDefault(); e.returnValue = '' }
}
function onWindowResize() {
  // forces showOutline to reevaluate (the computed already reads window.innerWidth)
  windowTick.value++
}
const windowTick = ref(0)
onMounted(() => {
  window.addEventListener('beforeunload', handleBeforeUnload)
  window.addEventListener('resize', onWindowResize)
})
onUnmounted(() => {
  window.removeEventListener('beforeunload', handleBeforeUnload)
  window.removeEventListener('resize', onWindowResize)
})

// Settings drawer — dialog semantics (focus trap, Escape, focus restore).
// Same pattern as frontend/components/consent/ConsentModal.tsx.
watch(settingsOpen, (open) => {
  if (open) {
    drawerPreviousFocusRef.value = document.activeElement instanceof HTMLElement ? document.activeElement : null
    nextTick(() => drawerRef.value?.focus())
  } else {
    drawerPreviousFocusRef.value?.focus()
    drawerPreviousFocusRef.value = null
  }
})
// Roving tabindex for the status radiogroup (WCAG radiogroup pattern) — Tab
// enters the group at the checked option, arrow keys move the selection.
const STATUS_OPTIONS = ['Rascunho', 'Publicado', 'Programado'] as const
function onStatusRadioKeydown(e: KeyboardEvent) {
  if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft' && e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return
  e.preventDefault()
  const currentIndex = STATUS_OPTIONS.indexOf(form.value.status as (typeof STATUS_OPTIONS)[number])
  const delta = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : -1
  const nextIndex = (currentIndex + delta + STATUS_OPTIONS.length) % STATUS_OPTIONS.length
  form.value.status = STATUS_OPTIONS[nextIndex]!
  nextTick(() => {
    const group = (e.currentTarget as HTMLElement)
    group.querySelectorAll<HTMLElement>('[role="radio"]')[nextIndex]?.focus()
  })
}
function onDrawerKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    settingsOpen.value = false
    return
  }
  if (e.key !== 'Tab' || !drawerRef.value) return
  const focusable = drawerRef.value.querySelectorAll<HTMLElement>(
    'button, input, select, textarea, a[href], [tabindex]:not([tabindex="-1"])'
  )
  if (!focusable.length) return
  const first = focusable[0]
  const last = focusable[focusable.length - 1]
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault()
    last?.focus()
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault()
    first?.focus()
  }
}

onBeforeRouteLeave(() => {
  if (isDirty.value) {
    return window.confirm('Há alterações não salvas. Deseja sair mesmo assim?')
  }
})

// Blog preview link
const BLOG_URL = ASSETS_URL.split('/').slice(0, 3).join('/')
const previewUrl = computed(() =>
  isEditing.value && form.value.slug && form.value.status === 'Publicado'
    ? `${BLOG_URL}/post/${form.value.slug}`
    : ''
)

// basePath with no extension → 480w variant for the admin preview
const featureImagePreviewUrl = computed(() => {
  const url = form.value.imagem_destaque_url
  if (!url) return ''
  const base = url.replace(/\.(avif|webp|jpg|jpeg|png)$/i, '')
  return `${base}-480.webp?t=${featureImageCacheBuster.value}`
})
// 1280w variant for the sheet's large cover and the reading preview
const coverFullUrl = computed(() => {
  const url = form.value.imagem_destaque_url
  if (!url) return ''
  const base = url.replace(/\.(avif|webp|jpg|jpeg|png)$/i, '')
  return `${base}-1280.webp?t=${featureImageCacheBuster.value}`
})

const FALLBACK_CATEGORIAS = [
  { categoria_slug: 'inteligencia-artificial', nome: 'Inteligência Artificial' },
  { categoria_slug: 'cloud-computing', nome: 'Cloud Computing' },
  { categoria_slug: 'devops-automacao', nome: 'DevOps e Automação' },
  { categoria_slug: 'seguranca-na-nuvem', nome: 'Segurança na Nuvem' },
  { categoria_slug: 'engenharia-de-software', nome: 'Engenharia de Software' },
  { categoria_slug: 'noticias-e-mercado', nome: 'Notícias e Mercado' },
]
const categorias = ref<Categoria[]>(FALLBACK_CATEGORIAS)

const categoriaNome = computed(() =>
  categorias.value.find((c) => c.categoria_slug === form.value.categoria_slug)?.nome || 'Sem categoria'
)

const availableSubcategorias = computed(() =>
  categorias.value.find((c) => c.categoria_slug === form.value.categoria_slug)?.subcategorias || []
)

watch(() => form.value.categoria_slug, () => {
  if (!availableSubcategorias.value.some((s) => s.slug === form.value.subcategoria_slug)) {
    form.value.subcategoria_slug = ''
  }
})

watch(() => form.value.subcategoria_slug, (slug) => {
  const found = availableSubcategorias.value.find((s) => s.slug === slug)
  form.value.subcategoria_nome = found?.nome || ''
})

// Word count / reading time (200 words/min, minimum 1)
const words = computed(() => {
  const text = (form.value.conteudo_html || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
  return text ? text.split(/\s+/).length : 0
})
watch(words, (n) => {
  form.value.tempo_leitura_min = Math.max(1, Math.round(n / 200))
}, { immediate: true })

// Side outline — rebuilt from the H2/H3 actually rendered in Tiptap,
// assigning sequential ids (iah-0, iah-1…) to enable scroll-to-heading.
type OutlineItem = { id: string; text: string; level: 2 | 3 }
const outline = ref<OutlineItem[]>([])
function refreshOutline() {
  nextTick(() => {
    const root = editorWrapperRef.value
    if (!root) return
    const heads = root.querySelectorAll('.tiptap-content .ProseMirror h2, .tiptap-content .ProseMirror h3')
    const list: OutlineItem[] = []
    heads.forEach((el, i) => {
      const id = 'iah-' + i
      el.id = id
      list.push({ id, text: el.textContent?.trim() || '(sem título)', level: el.tagName === 'H2' ? 2 : 3 })
    })
    outline.value = list
  })
}
watch(() => form.value.conteudo_html, refreshOutline)

function scrollToHeading(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  const y = el.getBoundingClientRect().top + window.scrollY - 92
  window.scrollTo({ top: y, behavior: 'smooth' })
}

// SERP preview
const serpTitle = computed(() =>
  (form.value.meta_titulo_seo || form.value.titulo || 'Título do Artigo').substring(0, 70)
)
const serpDesc = computed(() =>
  (form.value.meta_descricao_seo || form.value.resumo || 'Descrição do artigo...').substring(0, 160)
)
const serpUrl = computed(() =>
  `${BLOG_URL}/post/${form.value.slug || 'url-do-artigo'}`
)

// Title / Subtitle — contenteditable, synced via innerText only when the
// open post changes (never on every keystroke, to avoid resetting the cursor).
let syncedKey = ''
function syncTitleSubtitleDom() {
  const key = (isEditing.value ? 'edit-' + route.params.slug : 'new') as string
  if (syncedKey === key) return
  syncedKey = key
  if (titleRef.value) titleRef.value.innerText = form.value.titulo || ''
  if (subtitleRef.value) subtitleRef.value.innerText = form.value.subtitulo || ''
}
function onTitleInput() {
  form.value.titulo = titleRef.value?.innerText || ''
  generateSlug()
}
function onSubtitleInput() {
  form.value.subtitulo = subtitleRef.value?.innerText || ''
}
function onTitleKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter') {
    e.preventDefault()
    subtitleRef.value?.focus()
  }
}
function onSubtitleKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter') {
    e.preventDefault()
    editorRef.value?.focusStart()
  }
}

onMounted(async () => {
  // autor_id comes from the Cognito username (no longer hardcoded)
  if (auth.username) {
    form.value.autor_id = auth.username
  }

  try {
    const res = await categoriesApi.list()
    if (res.items?.length) {
      categorias.value = res.items
      if (!isEditing.value && res.items[0]) form.value.categoria_slug = res.items[0].categoria_slug
    }
  } catch {
    showToast('API de categorias indisponível — usando categorias padrão.', 'warning')
  } finally {
    loadingCategories.value = false
  }

  try {
    const data = await authorsApi.get(AUTHOR_ID)
    if (data.autor) author.value = data.autor
  } catch {
    // Author not registered yet — preview falls back to the default author name
  }

  if (isEditing.value) {
    loading.value = true
    try {
      const slug = route.params.slug as string
      const data = await postsApi.get(slug)

      form.value = {
        ...data,
        conteudo_html: data.conteudo_html || '',
        e_popular: !!data.e_popular,
        e_projeto: !!data.e_projeto,
        topico: data.topico || '',
        variante_card: data.variante_card || '',
        subcategoria_slug: data.subcategoria_slug || '',
        subcategoria_nome: data.subcategoria_nome || '',
        subtitulo: data.subtitulo || ''
      }
    } catch {
      showToast('Erro ao carregar post', 'error')
      router.push('/')
    } finally {
      loading.value = false
    }
  }
  await nextTick()
  syncTitleSubtitleDom()
  refreshOutline()
  captureInitialState()
})

async function save() {
  // Validation: Programado status requires a future date
  if (form.value.status === 'Programado') {
    if (!form.value.data_publicacao) {
      return showToast('Defina a data de publicação para agendar o post.', 'error')
    }
    if (new Date(form.value.data_publicacao) <= new Date()) {
      return showToast('A data de publicação deve ser no futuro para agendar o post.', 'error')
    }
  }

  saving.value = true
  try {
    const payload = {
      ...form.value,
      conteudo_html: sanitizeHtml(form.value.conteudo_html),
      e_popular: (form.value.e_popular ? 1 : 0) as 0 | 1,
      e_projeto: (form.value.e_projeto ? 1 : 0) as 0 | 1
    }

    const wasNew = !isEditing.value
    if (isEditing.value) {
      await postsApi.update(form.value.slug, payload)
    } else {
      await postsApi.create(payload)
    }

    // captureInitialState() BEFORE router.replace: onBeforeRouteLeave only
    // allows navigating without confirmation if isDirty is already false —
    // otherwise the replace below would trigger the "unsaved changes"
    // prompt even right after a successful save.
    captureInitialState()
    showToast('Alterações salvas')

    if (wasNew) {
      // Without this, "Salvar" (without publishing) twice in a row on a new
      // post would call postsApi.create again with the same slug —
      // router.replace switches the route to edit-post without remounting
      // the component (only the param changes), so isEditing then reflects
      // reality and the slug locks, exactly like reopening an already-saved post.
      await router.replace({ name: 'edit-post', params: { slug: form.value.slug } })
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro desconhecido'
    showToast('Erro ao salvar: ' + message, 'error')
  } finally {
    saving.value = false
  }
}

async function publish() {
  if (form.value.status !== 'Programado') form.value.status = 'Publicado'
  await save()
  if (!toast.value || toast.value.type !== 'error') {
    showToast(form.value.status === 'Programado' ? 'Post agendado' : 'Post publicado')
    // Toast vive nesta view (useToast não é singleton, ver composable) — sem
    // esse delay, router.push desmonta o componente antes do toast ser visto.
    await new Promise((resolve) => setTimeout(resolve, 1400))
    router.push('/')
  }
}

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

function handleFeatureImageError() {
  // Waits 2.5 seconds (the Lambda's average processing time) and retries
  setTimeout(() => {
    featureImageCacheBuster.value = Date.now()
  }, 2500)
}
// relativePath = "media/{uuid}-{name}" (no extension — multi-variant format)
function onImageUploaded(relativePath: string) {
  const baseUrl = `${ASSETS_URL}/${relativePath}`

  if (uploadContext.value === 'destaque') {
    // Stores the basePath with no extension — the frontend's
    // ResponsiveImage automatically builds the variants (-480.avif, -480.webp, -768.*, -1280.*)
    form.value.imagem_destaque_url = baseUrl
    featureImageCacheBuster.value = Date.now()
  } else {
    // For inline images in the editor: uses the desktop WebP variant (higher visual quality)
    const editorUrl = `${baseUrl}-1280.webp`
    editorRef.value?.insertImage(editorUrl, form.value.titulo || 'Imagem do artigo')
  }
}

function openFeatureImageUpload() {
  uploadContext.value = 'destaque'
  showUploadModal.value = true
}
function removeCover() {
  form.value.imagem_destaque_url = ''
}

function openEditorImageUpload() {
  uploadContext.value = 'editor'
  showUploadModal.value = true
}

function generateSlug() {
  if (!isEditing.value) {
    form.value.slug = slugify(form.value.titulo)
  }
}
</script>

<template>
  <div data-screen-label="Editor de post" class="ia-write-screen" :class="{ 'ia-focus': focusMode }">
    <Transition name="ia-toast">
      <div v-if="toast" :class="['ia-toast', `ia-toast--${toast.type}`]" role="alert">
        <span class="ia-toast-check">✓</span>{{ toast.message }}
      </div>
    </Transition>

    <header class="ia-topbar" :class="{ 'ia-topbar--focus': focusMode }">
      <button class="ia-btn-back" @click="backToPosts">‹ Posts</button>

      <div class="ia-save-status">
        <span class="ia-save-dot" :style="{ background: SAVE_STATUS_META[saveStatus].color }"></span>
        <span class="ia-save-text" :style="{ color: SAVE_STATUS_META[saveStatus].color }">{{ SAVE_STATUS_META[saveStatus].label }}</span>
      </div>

      <div style="flex:1"></div>

      <div class="ia-counters">
        <span>{{ words }} palavras</span>
        <span class="ia-counters-divider"></span>
        <span>{{ form.tempo_leitura_min }} min</span>
      </div>

      <a v-if="previewUrl" :href="previewUrl" target="_blank" rel="noopener" class="ia-btn-ghost" title="Ver no Blog" aria-label="Ver no Blog">
        <i class="fas fa-external-link-alt" aria-hidden="true"></i>
      </a>

      <button class="ia-btn-ghost" @click="settingsOpen = true" title="Configurações do post" aria-label="Configurações do post">
        <i class="fas fa-sliders-h" aria-hidden="true"></i>
      </button>

      <button class="ia-btn-focus" :class="{ on: focusMode }" @click="toggleFocus">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>
        {{ focusMode ? 'Sair do foco' : 'Foco' }}
      </button>

      <button class="ia-btn-read" @click="openPreview">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="2.5"/></svg>
        Ler
      </button>

      <button class="ia-btn-save" @click="save" :disabled="saving">Salvar</button>
      <button class="ia-btn-publish" @click="publish" :disabled="saving">
        {{ form.status === 'Programado' ? 'Agendar' : 'Publicar' }}
      </button>
    </header>

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
          @input="onTitleInput"
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

    <!-- Settings panel (fields that aren't part of the writing sheet) -->
    <Transition name="ia-drawer">
      <div v-if="settingsOpen" class="ia-drawer-overlay" role="presentation" @click.self="settingsOpen = false">
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
            <button class="ia-drawer-close" aria-label="Fechar configurações" @click="settingsOpen = false">✕</button>
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
              <input v-model="form.data_publicacao" type="datetime-local" class="ia-input" />
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
              <img :src="featureImagePreviewUrl" alt="Preview" @error="handleFeatureImageError" />
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

    <!-- Preview — how the reader will see it -->
    <Transition name="ia-fade">
      <div v-if="previewOpen" class="ia-preview-overlay ia-scroll">
        <header class="ia-preview-top">
          <button class="ia-preview-back" @click="previewOpen = false">‹ Voltar à escrita</button>
          <span class="ia-preview-label">Como o leitor verá</span>
        </header>
        <article class="ia-preview-article">
          <div class="ia-preview-eyebrow"><span class="ia-preview-eyebrow-line"></span>{{ categoriaNome }}</div>
          <h1 class="ia-preview-h1">{{ form.titulo || 'Título do post' }}</h1>
          <p v-if="form.subtitulo" class="ia-preview-sub">{{ form.subtitulo }}</p>
          <div class="ia-preview-author">
            <div class="ia-preview-avatar">
              <img v-if="authorAvatarUrl" :src="authorAvatarUrl" :alt="authorName" />
              <span v-else>{{ authorInitials }}</span>
            </div>
            <div>
              <div class="ia-preview-author-name">{{ authorName }}</div>
              <div class="ia-preview-author-meta">{{ form.tempo_leitura_min }} min de leitura · {{ words }} palavras</div>
            </div>
          </div>
          <div v-if="coverFullUrl" class="ia-preview-cover" :style="{ backgroundImage: `url(${coverFullUrl})` }"></div>
          <div class="ia-read" v-html="sanitizeHtml(form.conteudo_html) || '<p style=\'color:#7E969E\'>Sem conteúdo ainda.</p>'"></div>
        </article>
      </div>
    </Transition>

    <UploadModal
      v-if="showUploadModal"
      @close="showUploadModal = false"
      @uploaded="onImageUploaded"
    />
  </div>
</template>

<style scoped>
.ia-write-screen { min-height: 100vh; background: var(--slate-50); }

/* ===== Top bar ===== */
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

/* ===== Settings drawer ===== */
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

/* ===== Preview overlay ===== */
.ia-fade-enter-active, .ia-fade-leave-active { transition: opacity .2s; }
.ia-fade-enter-from, .ia-fade-leave-to { opacity: 0; }

.ia-preview-overlay { position: fixed; inset: 0; z-index: 50; background: var(--slate-50); overflow-y: auto; }
.ia-preview-top {
  position: sticky; top: 0; z-index: 2; background: rgba(15,76,92,.96); backdrop-filter: blur(10px);
  padding: 12px 28px; display: flex; align-items: center; gap: 14px; color: #fff;
}
.ia-preview-back {
  background: rgba(255,255,255,.12); border: 1px solid rgba(255,255,255,.2); color: #fff; font-size: 12.5px;
  font-weight: 600; padding: 8px 14px; border-radius: 9px; cursor: pointer;
}
.ia-preview-back:hover { background: rgba(255,255,255,.2); }
.ia-preview-label { font-family: var(--font-mono); font-size: 10px; letter-spacing: .18em; text-transform: uppercase; color: rgba(255,255,255,.7); }

.ia-preview-article { max-width: 720px; margin: 0 auto; padding: 52px 32px 120px; }
.ia-preview-eyebrow { display: flex; align-items: center; gap: 10px; font-family: var(--font-mono); font-size: 11px; letter-spacing: .22em; text-transform: uppercase; color: var(--accent); margin-bottom: 18px; }
.ia-preview-eyebrow-line { width: 24px; height: 1px; background: var(--accent); }
.ia-preview-h1 { font-family: var(--font-sans); font-weight: 800; font-size: clamp(2.2rem,4.6vw,3.1rem); line-height: 1.04; letter-spacing: -.04em; color: var(--petrol); margin: 0 0 18px; }
.ia-preview-sub { font-family: 'Newsreader', serif; font-size: 1.4rem; line-height: 1.5; color: #5c6f76; margin: 0 0 26px; }
.ia-preview-author { display: flex; align-items: center; gap: 14px; padding-bottom: 26px; border-bottom: 1px solid var(--border-color); }
.ia-preview-avatar {
  width: 42px; height: 42px; border-radius: 50%; background: linear-gradient(150deg, var(--petrol), var(--petrol-deep));
  display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 700; font-size: 14px; flex: none;
  overflow: hidden;
}
.ia-preview-avatar img { width: 100%; height: 100%; object-fit: cover; }
.ia-preview-author-name { font-weight: 700; font-size: 13.5px; color: var(--dark-700); }
.ia-preview-author-meta { font-family: var(--font-mono); font-size: 11px; color: var(--slate-400); margin-top: 2px; }
.ia-preview-cover { aspect-ratio: 16/8; border-radius: 16px; background-size: cover; background-position: center; margin: 32px 0 8px; box-shadow: 0 12px 30px rgba(12,32,39,.12); }

.ia-read { margin-top: 32px; font-family: 'Newsreader', Georgia, serif; }
.ia-read :deep(p) { font-size: 1.32rem; line-height: 1.8; color: #26343a; margin: 0 0 1em; }
.ia-read :deep(h2) { font-family: var(--font-sans); font-weight: 800; font-size: 1.8rem; color: var(--petrol); margin: 1.5em 0 .4em; }
.ia-read :deep(h3) { font-family: var(--font-sans); font-weight: 700; font-size: 1.3rem; color: var(--petrol); margin: 1.3em 0 .35em; }
.ia-read :deep(strong) { color: #A94C2D; font-weight: 600; }
.ia-read :deep(blockquote) { margin: 1.2em 0; padding-left: 20px; border-left: 3px solid var(--petrol); font-style: italic; color: var(--slate-500); }
.ia-read :deep(ul), .ia-read :deep(ol) { color: #26343a; font-size: 1.2rem; line-height: 1.75; margin: 0 0 1em 1.3em; }
.ia-read :deep(a) { color: var(--petrol); border-bottom: 1px solid rgba(15,76,92,.4); }
.ia-read :deep(.inline-code) {
  font-family: var(--font-mono); font-size: .85em; background: var(--slate-100); color: #d53f8c;
  padding: 1px 6px; border-radius: 4px;
}
.ia-read :deep(pre) {
  font-family: var(--font-mono); font-size: .92rem; line-height: 1.6; background: var(--petrol-deep);
  color: #D6E4E7; padding: 16px 18px; border-radius: 12px; overflow: auto; margin: 1.1em 0;
}
.ia-read :deep(hr) { border: none; border-top: 1px solid #D8CEBD; margin: 2em auto; width: 70px; }

/* Tiptap rich blocks (same classes as RichTextEditor.vue / frontend post.css) */
.ia-read :deep(.callout), .ia-read :deep(.tip) {
  display: flex; gap: 18px; align-items: flex-start; background: #fff; border: 1px solid var(--border-color);
  border-left: 4px solid var(--petrol); border-radius: 12px; padding: 22px 26px; margin: 1.6em 0;
}
.ia-read :deep(.callout .ic), .ia-read :deep(.tip .ic) {
  flex: none; width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center;
  font-family: var(--font-mono); font-weight: 700; font-size: 18px; background: rgba(15,76,92,.1); color: var(--petrol);
}
.ia-read :deep(.callout .t), .ia-read :deep(.tip .t) {
  font-family: var(--font-mono); font-size: 10.5px; letter-spacing: .18em; text-transform: uppercase;
  font-weight: 500; margin-bottom: 6px; color: var(--petrol);
}
.ia-read :deep(.callout .c p), .ia-read :deep(.tip .c p) { margin: 0; font-size: 1.05rem; line-height: 1.6; }
.ia-read :deep(.callout.warn) { border-left-color: var(--accent); background: #FCF6F1; }
.ia-read :deep(.callout.warn .ic) { background: var(--accent-light); color: #A94C2D; }
.ia-read :deep(.callout.warn .t) { color: #A94C2D; }
.ia-read :deep(.callout.error) { border-left-color: #A33A2B; background: #FBF0EE; }
.ia-read :deep(.callout.error .ic) { background: #F4D9D4; color: #A33A2B; }
.ia-read :deep(.callout.error .t) { color: #A33A2B; }
.ia-read :deep(.callout.ok) { border-left-color: var(--moss); background: #F1F5F0; }
.ia-read :deep(.callout.ok .ic) { background: #DCE8DD; color: var(--moss); }
.ia-read :deep(.callout.ok .t) { color: var(--moss); }
.ia-read :deep(.tip) { border-left-color: var(--accent); }
.ia-read :deep(.tip .ic) { background: var(--accent-light); color: #A94C2D; }
.ia-read :deep(.tip .t) { color: var(--accent); }

.ia-read :deep(.pull) { margin: 1.8em 0; padding: 8px 0 8px 28px; border-left: 3px solid var(--accent); }
.ia-read :deep(.pull p) {
  margin: 0; font-size: 1.5rem; line-height: 1.4; font-weight: 500; font-style: italic;
  color: var(--petrol); letter-spacing: -.015em;
}
.ia-read :deep(.pull .cite) { font-family: var(--font-mono); font-size: 11.5px; letter-spacing: .08em; color: var(--slate-400); margin-top: 14px; font-style: normal; }

.ia-read :deep(.closing) { margin-top: 1.8em; padding: 30px 32px; background: var(--petrol); border-radius: 16px; color: var(--slate-50); }
.ia-read :deep(.closing h3) { font-weight: 800; font-size: 1.4rem; letter-spacing: -.025em; color: #fff; margin-bottom: 8px; }
.ia-read :deep(.closing p) { font-size: 1.05rem; line-height: 1.6; color: rgba(250,248,243,.72); max-width: 520px; margin: 0; }

.ia-read :deep(table) { border-collapse: collapse; table-layout: fixed; width: 100%; margin: 1.5rem 0; }
.ia-read :deep(table td), .ia-read :deep(table th) { position: relative; vertical-align: top; padding: 8px 10px; border: 1px solid var(--border-color); }
.ia-read :deep(table th) { background: var(--slate-50); font-weight: 600; text-align: left; }

.ia-read :deep(div[data-youtube-video]) { margin: 1.3em 0; }
.ia-read :deep(iframe) { border: 8px solid #000; border-radius: 4px; display: block; margin: 0 auto; max-width: 100%; }

@media (max-width: 1179px) {
  .ia-outline { display: none; }
}
</style>
