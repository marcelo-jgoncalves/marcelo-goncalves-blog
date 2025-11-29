<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { postsApi } from '../services/api'
import { useAuthStore } from '../stores/auth'
import UploadModal from '../components/UploadModal.vue'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

// Variável de ambiente para montar a URL final da imagem (Ex: https://d123.cloudfront.net)
const ASSETS_URL = import.meta.env.VITE_ASSETS_URL || ''

// Estado do Formulário
const form = ref({
  titulo: '',
  slug: '',
  conteudo_html: '', // Idealmente usaríamos um Editor Rich Text (Quill/TinyMCE), aqui é textarea simples
  resumo: '',
  categoria_slug: 'tutoriais-aws', // Default
  imagem_destaque_url: '',
  imagem_destaque_alt_text: '',
  meta_titulo_seo: '',
  meta_descricao_seo: '',
  e_popular: false, // Checkbox usa boolean no front
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

// Carregar dados (se for edição)
onMounted(async () => {
  // Define autor padrão
  if (auth.user?.username) {
    // Em um cenário real, buscaríamos o ID do autor no perfil. 
    // Por enquanto, assumimos que o username do login é o ID ou usamos hardcoded 'marcelo-goncalves'
    form.value.autor_id = 'marcelo-goncalves' 
  }

  if (isEditing.value) {
    loading.value = true
    try {
      const slug = route.params.slug as string
      const data = await postsApi.get(slug)
      
      // Converte números 0/1 para booleanos e preenche o form
      form.value = {
        ...data,
        e_popular: !!data.e_popular,
        e_projeto: !!data.e_projeto
      }
    } catch (error) {
      alert('Erro ao carregar post')
      router.push('/')
    } finally {
      loading.value = false
    }
  }
})

// Salvar
async function save() {
  saving.value = true
  try {
    // Prepara payload (converte booleans para números 0/1 conforme DynamoDB)
    const payload = {
      ...form.value,
      e_popular: form.value.e_popular ? 1 : 0,
      e_projeto: form.value.e_projeto ? 1 : 0
    }

    if (isEditing.value) {
      await postsApi.update(form.value.slug, payload)
    } else {
      await postsApi.create(payload)
    }
    
    alert('Post salvo com sucesso!')
    router.push('/')
  } catch (error: any) {
    alert('Erro ao salvar: ' + error.message)
  } finally {
    saving.value = false
  }
}

// Callback do Upload
function onImageUploaded(relativePath: string) {
  // Monta a URL completa
  form.value.imagem_destaque_url = `${ASSETS_URL}/${relativePath}`
}

// Auto-gerar slug do título
function generateSlug() {
  if (!isEditing.value) {
    form.value.slug = form.value.titulo
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, "") // Remove acentos
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
  }
}
</script>

<template>
  <div class="editor">
    <header class="editor-header">
      <h1>{{ isEditing ? 'Editar Post' : 'Novo Post' }}</h1>
      <div class="actions">
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
          <label>Conteúdo (HTML)</label>
          <textarea v-model="form.conteudo_html" class="code-editor" rows="15"></textarea>
          <small>Escreva HTML puro por enquanto.</small>
        </div>

        <div class="form-group">
          <label>Resumo</label>
          <textarea v-model="form.resumo" rows="3"></textarea>
        </div>
        
        <div class="seo-box">
          <h3>SEO & Meta Tags</h3>
          <div class="form-group">
            <label>Meta Título</label>
            <input v-model="form.meta_titulo_seo" type="text" />
          </div>
          <div class="form-group">
            <label>Meta Descrição</label>
            <textarea v-model="form.meta_descricao_seo" rows="2"></textarea>
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
        </div>

        <div class="panel">
          <h3>Organização</h3>
          <div class="form-group">
            <label>Categoria</label>
            <select v-model="form.categoria_slug">
              <option value="inteligencia-artificial">Inteligência Artificial</option>
              <option value="cloud-computing">Cloud Computing</option>
              <option value="devops-automacao">DevOps e Automação</option>
              <option value="seguranca-na-nuvem">Segurança na Nuvem</option>
              <option value="engenharia-de-software">Engenharia de Software</option>
              <option value="noticias-e-mercado">Notícias e Mercado</option>
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
            <button class="btn-outline" @click="showUploadModal = true">
              <i class="fas fa-upload"></i> Upload Imagem
            </button>
          </div>
          <div class="form-group">
            <label>URL da Imagem</label>
            <input v-model="form.imagem_destaque_url" type="text" />
          </div>
          <div v-if="form.imagem_destaque_url" class="image-preview">
            <img :src="form.imagem_destaque_url" alt="Preview" />
          </div>
          <div class="form-group">
            <label>Alt Text (Acessibilidade)</label>
            <input v-model="form.imagem_destaque_alt_text" type="text" />
          </div>
        </div>

      </aside>
    </div>

    <UploadModal v-if="showUploadModal" @close="showUploadModal = false" @uploaded="onImageUploaded" />
  </div>
</template>

<style scoped>
.editor-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
.editor-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 30px; }

.form-group { margin-bottom: 20px; }
label { display: block; font-weight: 600; margin-bottom: 5px; color: var(--aws-dark); }
input, select, textarea { width: 100%; padding: 10px; border: 1px solid var(--gray-border); border-radius: 4px; font-family: inherit; }
.code-editor { font-family: monospace; background: #f9fafb; }

.panel { background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 5px rgba(0,0,0,0.05); }
.panel h3 { font-size: 1.1rem; border-bottom: 1px solid #eee; padding-bottom: 10px; margin-bottom: 15px; }

.image-preview img { width: 100%; border-radius: 4px; margin-top: 10px; }
.checkbox-group { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }

.btn-primary { background: var(--aws-orange); border: none; padding: 10px 20px; border-radius: 4px; font-weight: bold; cursor: pointer; }
.btn-secondary { background: #e0e0e0; border: none; padding: 10px 20px; border-radius: 4px; margin-right: 10px; cursor: pointer; }
.btn-outline { background: transparent; border: 1px solid var(--aws-dark); padding: 8px; width: 100%; border-radius: 4px; cursor: pointer; }

@media (max-width: 900px) { .editor-grid { grid-template-columns: 1fr; } }
</style>