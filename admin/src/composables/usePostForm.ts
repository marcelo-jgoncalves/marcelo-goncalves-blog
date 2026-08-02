import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { postsApi, categoriesApi, authorsApi } from '../services/api'
import { useAuthStore } from '../stores/auth'
import { slugify } from '../utils/slug'
import { sanitizeHtml } from '../utils/sanitizeHtml'
import { useToast } from './useToast'
import type { Autor, Categoria, Post } from '../types'

// e_popular/e_projeto become boolean only here (toggle UI state) — Post's
// real type (API contract) is 0|1 (backend/src/common/types.ts, DynamoDB
// has no boolean type for an indexed attribute). The conversion to 0|1
// already happened on save ("? 1 : 0"); only the form's type was wrong,
// inheriting Post directly instead of having its own local state type.
export type PostFormState = Omit<Post, 'e_popular' | 'e_projeto'> & {
  e_popular: boolean
  e_projeto: boolean
}

const FALLBACK_CATEGORIAS = [
  { categoria_slug: 'inteligencia-artificial', nome: 'Inteligência Artificial' },
  { categoria_slug: 'cloud-computing', nome: 'Cloud Computing' },
  { categoria_slug: 'devops-automacao', nome: 'DevOps e Automação' },
  { categoria_slug: 'seguranca-na-nuvem', nome: 'Segurança na Nuvem' },
  { categoria_slug: 'engenharia-de-software', nome: 'Engenharia de Software' },
  { categoria_slug: 'noticias-e-mercado', nome: 'Notícias e Mercado' },
]

// The blog has only 1 author by design — same hardcoded AUTHOR_ID used in AuthorEditView.vue.
const AUTHOR_ID = 'marcelo-goncalves'
const ASSETS_URL = import.meta.env.VITE_ASSETS_URL || ''

export function usePostForm() {
  const route = useRoute()
  const router = useRouter()
  const auth = useAuthStore()
  const { toast, showToast } = useToast()

  const isEditing = computed(() => route.params.slug !== undefined)
  const loading = ref(false)
  const saving = ref(false)
  const loadingCategories = ref(true)
  const author = ref<Autor | null>(null)
  const categorias = ref<Categoria[]>(FALLBACK_CATEGORIAS)
  const featureImageCacheBuster = ref(Date.now())

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
    variante_card: '',
  })

  // Dirty state — detects unsaved changes
  const initialFormJson = ref('')
  const isDirty = computed(() =>
    initialFormJson.value !== '' && JSON.stringify(form.value) !== initialFormJson.value
  )
  function captureInitialState() {
    initialFormJson.value = JSON.stringify(form.value)
  }

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

  function generateSlug() {
    if (!isEditing.value) {
      form.value.slug = slugify(form.value.titulo)
    }
  }

  async function loadInitialData() {
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
          subtitulo: data.subtitulo || '',
        }
      } catch {
        showToast('Erro ao carregar post', 'error')
        router.push('/')
      } finally {
        loading.value = false
      }
    }
  }

  async function save() {
    // Validation: Programado status requires a future date
    if (form.value.status === 'Programado') {
      if (!form.value.data_publicacao) {
        showToast('Defina a data de publicação para agendar o post.', 'error')
        return
      }
      if (new Date(form.value.data_publicacao) <= new Date()) {
        showToast('A data de publicação deve ser no futuro para agendar o post.', 'error')
        return
      }
    }

    saving.value = true
    try {
      const payload = {
        ...form.value,
        conteudo_html: sanitizeHtml(form.value.conteudo_html),
        e_popular: (form.value.e_popular ? 1 : 0) as 0 | 1,
        e_projeto: (form.value.e_projeto ? 1 : 0) as 0 | 1,
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
      const status = (error as { status?: number } | undefined)?.status
      if (status === 409) {
        // Optimistic concurrency conflict (backend/src/functions/adminPosts):
        // someone else saved this post since it was loaded here. Reloading
        // now would discard whatever the user just typed, so instead the
        // form is left as-is and `form.value.version` stays stale on
        // purpose — the very next save attempt hits the same 409 until the
        // user reloads the page deliberately, which is the correct outcome
        // (silently overwriting the other edit would be the bug this exists
        // to prevent).
        showToast('Este post foi alterado em outra sessão desde que foi carregado. Recarregue a página antes de salvar novamente.', 'error')
      } else {
        const message = error instanceof Error ? error.message : 'Erro desconhecido'
        showToast('Erro ao salvar: ' + message, 'error')
      }
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

  function handleFeatureImageError() {
    // Waits 2.5 seconds (the Lambda's average processing time) and retries
    setTimeout(() => {
      featureImageCacheBuster.value = Date.now()
    }, 2500)
  }

  // relativePath = "media/{uuid}-{name}" (no extension — multi-variant format)
  function applyUploadedImage(relativePath: string, context: 'destaque' | 'editor', onEditorImage: (url: string, alt: string) => void) {
    const baseUrl = `${ASSETS_URL}/${relativePath}`

    if (context === 'destaque') {
      // Stores the basePath with no extension — the frontend's
      // ResponsiveImage automatically builds the variants (-480.avif, -480.webp, -768.*, -1280.*)
      form.value.imagem_destaque_url = baseUrl
      featureImageCacheBuster.value = Date.now()
    } else {
      // For inline images in the editor: uses the desktop WebP variant (higher visual quality)
      const editorUrl = `${baseUrl}-1280.webp`
      onEditorImage(editorUrl, form.value.titulo || 'Imagem do artigo')
    }
  }

  function removeCover() {
    form.value.imagem_destaque_url = ''
  }

  return {
    route,
    router,
    toast,
    showToast,
    isEditing,
    loading,
    saving,
    loadingCategories,
    author,
    categorias,
    form,
    isDirty,
    captureInitialState,
    authorName,
    authorInitials,
    authorAvatarUrl,
    previewUrl,
    featureImagePreviewUrl,
    coverFullUrl,
    categoriaNome,
    availableSubcategorias,
    words,
    serpTitle,
    serpDesc,
    serpUrl,
    generateSlug,
    loadInitialData,
    save,
    publish,
    handleFeatureImageError,
    applyUploadedImage,
    removeCover,
  }
}
