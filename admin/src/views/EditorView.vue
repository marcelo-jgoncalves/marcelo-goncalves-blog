/* admin/src/views/EditorView.vue */

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch, nextTick } from 'vue'
import { useRoute, useRouter, onBeforeRouteLeave } from 'vue-router'
import DOMPurify from 'dompurify'
import { postsApi, categoriesApi } from '../services/api'
import { useAuthStore } from '../stores/auth'
import UploadModal from '../components/UploadModal.vue'
import RichTextEditor from '../components/RichTextEditor.vue'
import { slugify } from '../utils/slug'

const ALLOWED_TAGS = ['p','br','strong','em','u','s','h2','h3','h4','ul','ol','li',
  'blockquote','pre','code','img','a','table','thead','tbody','tr','td','th','hr']
const ALLOWED_ATTR = ['src','alt','href','title','class','target','rel','width','height']

function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, { ALLOWED_TAGS, ALLOWED_ATTR })
}

const featureImageCacheBuster = ref(Date.now())
const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const editorRef = ref<any>(null)

const ASSETS_URL = import.meta.env.VITE_ASSETS_URL || ''

const form = ref({
  titulo: '',
  slug: '',
  conteudo_html: '', 
  resumo: '',
  categoria_slug: 'tutoriais-aws',
  imagem_destaque_url: '',
  imagem_destaque_alt_text: '',
  meta_titulo_seo: '',
  meta_descricao_seo: '',
  e_popular: false,
  e_projeto: false,
  status: 'Rascunho',
  tempo_leitura_min: 5,
  data_publicacao: '',
  autor_id: ''
})

const isEditing = computed(() => route.params.slug !== undefined)
const showUploadModal = ref(false)
const loading = ref(false)
const saving = ref(false)
const uploadContext = ref<'destaque' | 'editor'>('destaque')
const loadingCategories = ref(true)
const toast = ref<{ message: string; type: 'success' | 'error' | 'warning' } | null>(null)

// Dirty state — detecta alterações não salvas
const initialFormJson = ref('')
const isDirty = computed(() =>
  initialFormJson.value !== '' && JSON.stringify(form.value) !== initialFormJson.value
)

function captureInitialState() {
  initialFormJson.value = JSON.stringify(form.value)
}

const handleBeforeUnload = (e: BeforeUnloadEvent) => {
  if (isDirty.value) { e.preventDefault(); e.returnValue = '' }
}
onMounted(() => window.addEventListener('beforeunload', handleBeforeUnload))
onUnmounted(() => window.removeEventListener('beforeunload', handleBeforeUnload))

onBeforeRouteLeave(() => {
  if (isDirty.value) {
    return window.confirm('Há alterações não salvas. Deseja sair mesmo assim?')
  }
})

// Link de preview no blog
const BLOG_URL = ASSETS_URL.split('/').slice(0, 3).join('/')
const previewUrl = computed(() =>
  isEditing.value && form.value.slug && form.value.status === 'Publicado'
    ? `${BLOG_URL}/post/${form.value.slug}`
    : ''
)

const FALLBACK_CATEGORIAS = [
  { categoria_slug: 'inteligencia-artificial', nome: 'Inteligência Artificial' },
  { categoria_slug: 'cloud-computing', nome: 'Cloud Computing' },
  { categoria_slug: 'devops-automacao', nome: 'DevOps e Automação' },
  { categoria_slug: 'seguranca-na-nuvem', nome: 'Segurança na Nuvem' },
  { categoria_slug: 'engenharia-de-software', nome: 'Engenharia de Software' },
  { categoria_slug: 'noticias-e-mercado', nome: 'Notícias e Mercado' },
]
const categorias = ref(FALLBACK_CATEGORIAS)

function showToast(message: string, type: 'success' | 'error' | 'warning' = 'success') {
  toast.value = { message, type }
  setTimeout(() => { toast.value = null }, 4000)
}

// Auto-cálculo do tempo de leitura (200 palavras/min)
watch(() => form.value.conteudo_html, (html) => {
  if (!html) return
  const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
  const words = text.split(/\s+/).filter(Boolean).length
  form.value.tempo_leitura_min = Math.max(1, Math.round(words / 200))
})

// Preview SERP
const serpTitle = computed(() =>
  (form.value.meta_titulo_seo || form.value.titulo || 'Título do Artigo').substring(0, 70)
)
const serpDesc = computed(() =>
  (form.value.meta_descricao_seo || form.value.resumo || 'Descrição do artigo...').substring(0, 160)
)
const serpUrl = computed(() =>
  `${BLOG_URL}/post/${form.value.slug || 'url-do-artigo'}`
)

onMounted(async () => {
  // autor_id vem do Cognito username (não mais hardcoded)
  if (auth.user?.username) {
    form.value.autor_id = auth.user.username
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

  // 2. Continua com a lógica normal de edição
  if (isEditing.value) {
    loading.value = true
    try {
      const slug = route.params.slug as string
      const data = await postsApi.get(slug)

      form.value = {
        ...data,
        conteudo_html: data.conteudo_html || '', 
        e_popular: !!data.e_popular,
        e_projeto: !!data.e_projeto
      }
    } catch (error) {
      showToast('Erro ao carregar post', 'error')
      router.push('/')
    } finally {
      loading.value = false
    }
  }
  await nextTick()
  captureInitialState()
})

async function save() {
  // Validação: status Programado exige data futura
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
      e_popular: form.value.e_popular ? 1 : 0,
      e_projeto: form.value.e_projeto ? 1 : 0
    }

    if (isEditing.value) {
      await postsApi.update(form.value.slug, payload)
    } else {
      await postsApi.create(payload)
    }
    
    captureInitialState()
    showToast('Post salvo com sucesso!')
    router.push('/')
  } catch (error: any) {
    showToast('Erro ao salvar: ' + error.message, 'error')
  } finally {
    saving.value = false
  }
}

/* Lógica de Upload Unificada */
function handleFeatureImageError() {
  // Espera 2.5 segundos (tempo médio do Lambda) e tenta de novo
  setTimeout(() => {
    featureImageCacheBuster.value = Date.now()
  }, 2500)
}
// O callback único que resolve tudo
// relativePath = "media/{uuid}-{nome}" (sem extensão — novo formato multi-variante)
function onImageUploaded(relativePath: string) {
  const baseUrl = `${ASSETS_URL}/${relativePath}`

  if (uploadContext.value === 'destaque') {
    // Armazena o basePath sem extensão — ResponsiveImage no frontend
    // monta automaticamente as variantes (-480.avif, -480.webp, -768.*, -1280.*)
    form.value.imagem_destaque_url = baseUrl
    featureImageCacheBuster.value = Date.now()
  } else {
    // Para imagens inline no editor: usa a variante desktop WebP (maior qualidade visual)
    const editorUrl = `${baseUrl}-1280.webp`
    editorRef.value?.insertImage(editorUrl, form.value.titulo || 'Imagem do artigo')
  }
}

// Chamado pelo botão da lateral (Imagem de Destaque)
function openFeatureImageUpload() {
  uploadContext.value = 'destaque'
  showUploadModal.value = true
}

// Chamado pelo evento do Editor (Imagem no Texto)
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
  <div class="editor">
    <Transition name="toast">
      <div v-if="toast" :class="['toast', `toast--${toast.type}`]" role="alert">
        {{ toast.message }}
      </div>
    </Transition>
    <header class="editor-header">
      <h1>{{ isEditing ? 'Editar Post' : 'Novo Post' }}</h1>
      <div class="actions">
        <span v-if="isDirty" class="dirty-badge" title="Alterações não salvas">● Não salvo</span>
        <a v-if="previewUrl" :href="previewUrl" target="_blank" rel="noopener" class="btn-secondary btn-preview">
          <i class="fas fa-external-link-alt"></i> Ver no Blog
        </a>
        <button class="btn-secondary" @click="$router.push('/')">Cancelar</button>
        <button class="btn-primary" @click="save" :disabled="saving">
          {{ saving ? 'Salvando...' : 'Salvar Post' }}
        </button>
      </div>
    </header>

    <div v-if="loading" class="loading">Carregando...</div>

    <div v-else class="editor-grid">
      <div class="main-column">
        <div class="form-group">
          <label>Título</label>
          <input v-model="form.titulo" @input="generateSlug" type="text" placeholder="Título do Artigo" />
        </div>
        
        <div class="form-group">
          <label>Slug (URL)</label>
          <input v-model="form.slug" type="text" :disabled="isEditing" />
        </div>

        <div class="form-group">
          <label>Conteúdo</label>
          <RichTextEditor 
            ref="editorRef" 
            v-model="form.conteudo_html" 
            :key="form.slug"
            @request-upload="openEditorImageUpload"
          />
        </div>

        <div class="form-group">
          <label>Resumo</label>
          <textarea v-model="form.resumo" rows="3"></textarea>
        </div>
        
        <div class="seo-box">
          <h3>SEO & Meta Tags</h3>
          <div class="form-group">
            <label>
              Meta Título
              <span :class="['char-count', { warn: serpTitle.length > 60 }]">
                {{ serpTitle.length }}/60
              </span>
            </label>
            <input v-model="form.meta_titulo_seo" type="text" />
          </div>
          <div class="form-group">
            <label>
              Meta Descrição
              <span :class="['char-count', { warn: serpDesc.length > 155 }]">
                {{ serpDesc.length }}/160
              </span>
            </label>
            <textarea v-model="form.meta_descricao_seo" rows="2"></textarea>
          </div>

          <div class="serp-preview">
            <p class="serp-label">Preview Google</p>
            <div class="serp-url">{{ serpUrl }}</div>
            <div class="serp-title">{{ serpTitle }}</div>
            <div class="serp-desc">{{ serpDesc }}</div>
          </div>
        </div>
      </div>

      <aside class="settings-column">
        <div class="panel">
          <h3>Publicação</h3>
          <div class="form-group">
            <label>Status</label>
            <select v-model="form.status">
              <option value="Rascunho">Rascunho</option>
              <option value="Publicado">Publicado</option>
              <option value="Programado">Programado</option>
            </select>
          </div>
          <div class="form-group">
            <label>Data Publicação</label>
            <input v-model="form.data_publicacao" type="datetime-local" />
          </div>
          <div class="form-group">
            <label>Tempo de Leitura (min) <span class="auto-badge">auto</span></label>
            <input v-model.number="form.tempo_leitura_min" type="number" min="1" max="60" />
          </div>
        </div>

        <div class="panel">
          <h3>Organização</h3>
          <div class="form-group">
            <label>Categoria</label>
            <select v-model="form.categoria_slug" :disabled="loadingCategories">
              <option v-if="loadingCategories" value="" disabled>Carregando categorias...</option>
              <option
                v-for="cat in categorias"
                :key="cat.categoria_slug"
                :value="cat.categoria_slug"
              >{{ cat.nome }}</option>
            </select>
          </div>
          <div class="checkbox-group">
            <input type="checkbox" id="popular" v-model="form.e_popular" />
            <label for="popular">É Popular?</label>
          </div>
          <div class="checkbox-group">
            <input type="checkbox" id="projeto" v-model="form.e_projeto" />
            <label for="projeto">É do "Projeto"?</label>
          </div>
        </div>

        <div class="panel">
          <h3>Imagem de Destaque</h3>
          <div class="form-group">
            <button class="btn-outline" @click="openFeatureImageUpload">
              <i class="fas fa-upload"></i> Upload Imagem
            </button>
          </div>
          
          <div class="form-group">
            <label>URL da Imagem</label>
            <input v-model="form.imagem_destaque_url" type="text" />
          </div>

          <div v-if="form.imagem_destaque_url" class="image-preview">
            <img 
              :src="`${form.imagem_destaque_url}?t=${featureImageCacheBuster}`" 
              alt="Preview" 
              @error="handleFeatureImageError"
            />
          </div>

          <div class="form-group">
            <label>Alt Text (Acessibilidade)</label>
            <input v-model="form.imagem_destaque_alt_text" type="text" />
          </div>
        </div>
      </aside>
    </div>

    <UploadModal 
      v-if="showUploadModal" 
      @close="showUploadModal = false" 
      @uploaded="onImageUploaded" 
    />
  </div>
</template>

<style scoped>
.editor-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
.editor-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 30px; }
.form-group { margin-bottom: 20px; }
label { display: block; font-weight: 600; margin-bottom: 5px; color: var(--aws-dark); }
input, select, textarea { width: 100%; padding: 10px; border: 1px solid var(--gray-border); border-radius: 4px; font-family: inherit; }
.panel { background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 5px rgba(0,0,0,0.05); }
.panel h3 { font-size: 1.1rem; border-bottom: 1px solid #eee; padding-bottom: 10px; margin-bottom: 15px; }
.image-preview img { width: 100%; border-radius: 4px; margin-top: 10px; }
.checkbox-group { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
.btn-primary { background: var(--aws-orange); border: none; padding: 10px 20px; border-radius: 4px; font-weight: bold; cursor: pointer; }
.btn-secondary { background: #e0e0e0; border: none; padding: 10px 20px; border-radius: 4px; margin-right: 10px; cursor: pointer; }
.btn-outline { background: transparent; border: 1px solid var(--aws-dark); padding: 8px; width: 100%; border-radius: 4px; cursor: pointer; }
@media (max-width: 900px) { .editor-grid { grid-template-columns: 1fr; } }
.toast {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 14px 20px;
  border-radius: 6px;
  font-weight: 600;
  color: #fff;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
.toast--success { background: #2d6a4f; }
.toast--error   { background: #c0392b; }
.toast--warning { background: #b45309; }

.seo-box { background: white; padding: 20px; border-radius: 8px; margin-top: 20px; box-shadow: 0 2px 5px rgba(0,0,0,0.05); }
.seo-box h3 { font-size: 1.1rem; border-bottom: 1px solid #eee; padding-bottom: 10px; margin-bottom: 15px; }

.char-count { font-size: 0.75rem; font-weight: 400; color: #9ca3af; margin-left: 8px; }
.char-count.warn { color: #dc2626; font-weight: 600; }

.serp-preview {
  margin-top: 16px; padding: 14px 16px; border: 1px solid #e5e7eb;
  border-radius: 8px; background: #f9fafb; font-family: Arial, sans-serif;
}
.serp-label { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin-bottom: 8px; font-family: inherit; }
.serp-url  { font-size: 0.75rem; color: #1a0dab; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.serp-title { font-size: 1rem; color: #1a0dab; font-weight: 400; margin: 2px 0; }
.serp-title:hover { text-decoration: underline; }
.serp-desc { font-size: 0.8rem; color: #545454; line-height: 1.4; margin-top: 4px; }

.auto-badge {
  display: inline-block; font-size: 0.65rem; background: #d1fae5; color: #065f46;
  border-radius: 4px; padding: 1px 6px; font-weight: 600; vertical-align: middle; margin-left: 6px;
}

.dirty-badge {
  font-size: 0.8rem; font-weight: 600; color: #b45309;
  display: flex; align-items: center; gap: 4px;
}
.btn-preview {
  display: inline-flex; align-items: center; gap: 6px;
  text-decoration: none; font-size: 0.875rem;
}
.toast-enter-active, .toast-leave-active { transition: opacity 0.3s, transform 0.3s; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(-10px); }
</style>