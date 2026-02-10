/* admin/scr/components/RichTextEditor.vue */
<script setup lang="ts">
import { watch, computed } from 'vue'
import { useEditor, EditorContent, BubbleMenu, FloatingMenu, type Editor } from '@tiptap/vue-3'
import BubbleMenuExtension from '@tiptap/extension-bubble-menu'
import FloatingMenuExtension from '@tiptap/extension-floating-menu'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import { Callout } from './Callout'
import { SmartImage } from './tiptap/SmartImage'
import Code from '@tiptap/extension-code'
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import Youtube from '@tiptap/extension-youtube'

/* BLOCK: Syntax Highlighting Setup */
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { createLowlight, common } from 'lowlight'
import hljs from 'highlight.js'

const CustomTableCell = TableCell.extend({
  content: 'inline*', // Define que a célula só aceita texto, img, etc. (sem blocos)
})
// Importando definições específicas para o nicho Tech/DevOps/AI
const terraformDef = hljs.getLanguage('terraform')?.rawDefinition
const javascriptDef = hljs.getLanguage('javascript')?.rawDefinition
const typescriptDef = hljs.getLanguage('typescript')?.rawDefinition
const bashDef = hljs.getLanguage('bash')?.rawDefinition
const pythonDef = hljs.getLanguage('python')?.rawDefinition // IA/Data Science
const yamlDef = hljs.getLanguage('yaml')?.rawDefinition // K8s, CloudFormation, Actions
const jsonDef = hljs.getLanguage('json')?.rawDefinition // IAM Policies, Configs
const sqlDef = hljs.getLanguage('sql')?.rawDefinition // Data Engineering

const lowlightInstance = createLowlight(common)

// Registrando as linguagens
if (terraformDef) lowlightInstance.register('terraform', terraformDef)
if (javascriptDef) lowlightInstance.register('javascript', javascriptDef)
if (typescriptDef) lowlightInstance.register('typescript', typescriptDef)
if (bashDef) lowlightInstance.register('bash', bashDef)
if (pythonDef) lowlightInstance.register('python', pythonDef)
if (yamlDef) lowlightInstance.register('yaml', yamlDef)
if (jsonDef) lowlightInstance.register('json', jsonDef)
if (sqlDef) lowlightInstance.register('sql', sqlDef)
/* END BLOCK: Syntax Highlighting Setup */


const props = defineProps<{ modelValue: string }>()
const emit = defineEmits<{(e: 'update:modelValue', v: string): void,(e: 'request-upload'): void }>()

/* BLOCK: Editor Initialization */
// 1. Definimos as extensões
const editorExtensions = [
  BubbleMenuExtension,
  FloatingMenuExtension,
  StarterKit.configure({
    code: false,
    heading: { levels: [2, 3] },
    codeBlock: false,
    blockquote: {},
    horizontalRule: {
      HTMLAttributes: {
        style: 'border: none; border-top: 1px solid #e0e0e0; margin: 2rem 0; height: 0; background: transparent;',
      },
    },
  }),
  Table.configure({
    resizable: true,
    HTMLAttributes: {
      class: 'my-custom-table',
    },
  }),
  TableRow,
  TableHeader,
  CustomTableCell,,
  Youtube.configure({
    controls: true,
    nocookie: true,
    // Deixar responsivo via CSS é melhor, mas definimos um default aqui
    width: 640, 
    height: 360,
  }),
  Link.configure({
    openOnClick: false,
    autolink: true,
    linkOnPaste: true,
    HTMLAttributes: { 
      class: 'content-link',
      rel: 'noopener noreferrer',
      target: '_blank',
    },
  }),
  CodeBlockLowlight.configure({
    lowlight: lowlightInstance,
    defaultLanguage: 'python',
  }),
  Callout,
  SmartImage.configure({
    inline: false, 
    allowBase64: true,
  }),
  Code.configure({
    HTMLAttributes: {
      class: 'inline-code',
    },
  }),
]

// 2. Criamos o editor
const editorRef = useEditor({
  content: props.modelValue,
  extensions: editorExtensions,
  editorProps: {
    attributes: {
      class: 'tiptap-inner-editor focus:outline-none',
    },
  },
  onUpdate: ({ editor }) => {
    emit('update:modelValue', editor.getHTML())
  },
})
/* END BLOCK: Editor Initialization */

/* BLOCK: Reactivity Logic */
const editorInstance = computed(() => editorRef.value as Editor | undefined)

watch(
  () => props.modelValue,
  (newValue) => {
    if (!editorInstance.value) return
    const isSame = editorInstance.value.getHTML() === newValue
    if (!isSame) {
      editorInstance.value.commands.setContent(newValue, false)
    }
  },
)
/* END BLOCK: Reactivity Logic */

/* BLOCK: Custom Commands */
const setLink = () => {
  if (!editorInstance.value) return
  const previousUrl = editorInstance.value.getAttributes('link').href
  const url = window.prompt('URL do Link:', previousUrl)

  if (url === null) return

  if (url === '') {
    editorInstance.value.chain().focus().extendMarkRange('link').unsetLink().run()
    return
  }

  const finalUrl = url.startsWith('http') ? url : `https://${url}`
  editorInstance.value.chain().focus().extendMarkRange('link').setLink({ href: finalUrl }).run()
}

const addCallout = (type: 'info' | 'warning') => {
  editorInstance.value
    ?.chain()
    .focus()
    .insertContent({
      type: 'callout',
      attrs: { type },
    })
    .run()
}

const setHorizontalRule = () => {
  editorInstance.value?.chain().focus().setHorizontalRule().run()
}
/* END BLOCK: Custom Commands */

/* BLOCK: New Media Commands */
const addYoutubeVideo = () => {
  const url = window.prompt('Cole a URL do YouTube:')
  
  if (url) {
    // Tiptap valida automaticamente se é link do Youtube
    editorInstance.value?.commands.setYoutubeVideo({ src: url })
  }
}

const insertTable = () => {
  editorInstance.value?.chain().focus()
    .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
    .run()
}
/* END BLOCK: New Media Commands */

/* BLOCK: Image Upload Logic */
const triggerImageUpload = () => {
  emit('request-upload')
}

const insertImage = (url: string, altText: string = '') => {
  if (!editorInstance.value) return
  editorInstance.value.chain().focus().setImage({ src: url, alt: altText }).run()
}

defineExpose({
  insertImage
})
/* END BLOCK: Image Upload Logic */
</script>

<template>
  <div class="tiptap-editor-container">
    <div v-if="editorInstance" class="tiptap-toolbar">
      <button
        type="button"
        @click="editorInstance.chain().focus().toggleHeading({ level: 2 }).run()"
        :class="{ 'is-active': editorInstance.isActive('heading', { level: 2 }) }"
      >H2</button>

      <button
        type="button"
        @click="editorInstance.chain().focus().toggleHeading({ level: 3 }).run()"
        :class="{ 'is-active': editorInstance.isActive('heading', { level: 3 }) }"
      >H3</button>

      <button
        type="button"
        @click="editorInstance.chain().focus().toggleBold().run()"
        :class="{ 'is-active': editorInstance.isActive('bold') }"
      >B</button>

      <div class="divider"></div>

      <button
        type="button"
        @click="editorInstance.chain().focus().toggleBulletList().run()"
        :class="{ 'is-active': editorInstance.isActive('bulletList') }"
        title="Lista com Marcadores"
      ><i class="fas fa-list-ul"></i></button>

      <button
        type="button"
        @click="editorInstance.chain().focus().toggleOrderedList().run()"
        :class="{ 'is-active': editorInstance.isActive('orderedList') }"
        title="Lista Numerada"
      ><i class="fas fa-list-ol"></i></button>

      <div class="divider"></div>

      <button
        type="button"
        @click="editorInstance.chain().focus().toggleCodeBlock().run()"
        :class="{ 'is-active': editorInstance.isActive('codeBlock') }"
        title="Bloco de Código"
      >&lt;/&gt;</button>

      <button
        type="button"
        @click="editorInstance.chain().focus().toggleBlockquote().run()"
        :class="{ 'is-active': editorInstance.isActive('blockquote') }"
        title="Citação"
      ><i class="fas fa-quote-right"></i></button>

      <button
        type="button"
        @click="setLink"
        :class="{ 'is-active': editorInstance.isActive('link') }"
        title="Inserir Link"
      ><i class="fas fa-link"></i></button>
      
      <button 
        type="button" 
        @click="triggerImageUpload" 
        title="Inserir Imagem"
      ><i class="fas fa-image"></i></button>

      <div class="divider"></div>

      <button 
        type="button" 
        @click="insertTable" 
        title="Inserir Tabela"
        :class="{ 'is-active': editorInstance.isActive('table') }"
      >
        <i class="fas fa-table"></i>
      </button>

      <button 
        type="button" 
        @click="addYoutubeVideo" 
        title="Inserir Vídeo do YouTube"
        :class="{ 'is-active': editorInstance.isActive('youtube') }"
      >
        <i class="fab fa-youtube"></i>
      </button>

      <div class="divider"></div>

      <button type="button" @click="addCallout('info')" title="Dica">ℹ️</button>
      <button type="button" @click="addCallout('warning')" title="Atenção">⚠️</button>

      <div class="divider"></div>
      
      <button
        type="button"
        @click="setHorizontalRule"
        title="Divisor Horizontal"
      >—</button>

      <button
        type="button"
        @click="editorInstance.chain().focus().clearNodes().run()"
        title="Limpar Formatação do Bloco"
      >Limpar</button>
    </div>

    <bubble-menu
      v-if="editorInstance"
      :editor="editorInstance"
      :tippy-options="{ duration: 100 }"
      class="bubble-menu"
    >
      <button
        type="button"
        @click="editorInstance.chain().focus().toggleBold().run()"
        :class="{ 'is-active': editorInstance.isActive('bold') }"
      >Bold</button>

      <button
        type="button"
        @click="editorInstance.chain().focus().toggleItalic().run()"
        :class="{ 'is-active': editorInstance.isActive('italic') }"
      >Italic</button>

      <button
        type="button"
        @click="setLink"
        :class="{ 'is-active': editorInstance.isActive('link') }"
      >Link</button>

      <button
        type="button"
        @click="editorInstance.chain().focus().toggleCode().run()"
        :class="{ 'is-active': editorInstance.isActive('code') }"
        title="Código em linha"
      >&lt;/&gt;</button>

      <button 
         type="button"
         @click="editorInstance.chain().focus().unsetAllMarks().run()"
         class="btn-clear"
      >Limpar</button>
    </bubble-menu>
    <bubble-menu
      v-if="editorInstance"
      :editor="editorInstance"
      :tippy-options="{ duration: 100, placement: 'top' }"
      :should-show="({ editor }) => editor.isActive('table')"
      class="bubble-menu-table"
    >
      <div class="btn-group">
        <button 
          type="button"
          @click="editorInstance.chain().focus().addColumnAfter().run()" 
          title="Inserir Coluna (Direita)"
          class="btn-icon"
        >
          <i class="fas fa-columns"></i>
          <span class="mini-badge">+</span>
        </button>
        
        <button 
          type="button"
          @click="editorInstance.chain().focus().addRowAfter().run()" 
          title="Inserir Linha (Abaixo)"
          class="btn-icon"
        >
          <i class="fas fa-bars"></i>
          <span class="mini-badge">+</span>
        </button>
      </div>

      <div class="menu-divider"></div>

      <div class="btn-group">
        <button 
          type="button"
          @click="editorInstance.chain().focus().deleteColumn().run()" 
          title="Remover Coluna"
          class="btn-icon btn-danger"
        >
          <i class="fas fa-columns"></i>
          <span class="mini-badge">-</span>
        </button>

        <button 
          type="button"
          @click="editorInstance.chain().focus().deleteRow().run()" 
          title="Remover Linha"
          class="btn-icon btn-danger"
        >
          <i class="fas fa-bars"></i>
          <span class="mini-badge">-</span>
        </button>
      </div>

      <div class="menu-divider"></div>

      <div class="btn-group">
        <button 
          type="button"
          @click="editorInstance.chain().focus().mergeCells().run()" 
          title="Mesclar/Desmesclar Células"
          class="btn-text"
        >
          <i class="fas fa-expand-arrows-alt"></i>
        </button>
        
        <button 
          type="button"
          @click="editorInstance.chain().focus().deleteTable().run()" 
          title="Excluir Tabela Inteira"
          class="btn-icon btn-danger"
        >
          <i class="fas fa-trash-alt"></i>
        </button>
      </div>
    </bubble-menu>

    <floating-menu
      v-if="editorInstance"
      :editor="editorInstance"
      :tippy-options="{ duration: 100, placement: 'left-start', maxWidth: 'none' }"
    >
      <div class="floating-menu-card">
        <button
          type="button"
          @click="editorInstance.chain().focus().toggleHeading({ level: 2 }).run()"
          :class="{ 'is-active': editorInstance.isActive('heading', { level: 2 }) }"
          title="Título 2"
        >H2</button>
        
        <button
          type="button"
          @click="editorInstance.chain().focus().toggleHeading({ level: 3 }).run()"
          :class="{ 'is-active': editorInstance.isActive('heading', { level: 3 }) }"
          title="Título 3"
        >H3</button>

        <button
          type="button"
          @click="editorInstance.chain().focus().toggleBulletList().run()"
          :class="{ 'is-active': editorInstance.isActive('bulletList') }"
          title="Lista"
        ><i class="fas fa-list-ul"></i></button>
        
        <button
          type="button"
          @click="editorInstance.chain().focus().toggleOrderedList().run()"
          :class="{ 'is-active': editorInstance.isActive('orderedList') }"
          title="Lista Numerada"
        ><i class="fas fa-list-ol"></i></button>

        <button
          type="button"
          @click="editorInstance.chain().focus().toggleCodeBlock().run()"
          :class="{ 'is-active': editorInstance.isActive('codeBlock') }"
          title="Bloco de Código"
        >&lt;/&gt;</button>
        
        <button
          type="button"
          @click="editorInstance.chain().focus().toggleBlockquote().run()"
          :class="{ 'is-active': editorInstance.isActive('blockquote') }"
          title="Citação"
        ><i class="fas fa-quote-right"></i></button>

        <button 
          type="button" 
          @click="triggerImageUpload" 
          title="Inserir Imagem"
        ><i class="fas fa-image"></i></button>

        <button 
          type="button" 
          @click="insertTable" 
          title="Inserir Tabela"
          :class="{ 'is-active': editorInstance.isActive('table') }"
        >
          <i class="fas fa-table"></i>
        </button>

        <button 
          type="button" 
          @click="addYoutubeVideo" 
          title="Inserir Vídeo"
          :class="{ 'is-active': editorInstance.isActive('youtube') }"
        >
          <i class="fab fa-youtube"></i>
        </button>

        <div class="menu-divider"></div>

        <button type="button" @click="addCallout('info')" title="Dica">ℹ️</button>
        <button type="button" @click="addCallout('warning')" title="Atenção">⚠️</button>
        
        <div class="menu-divider"></div>

        <button
          type="button"
          @click="setHorizontalRule"
          title="Divisor"
        >—</button>
      </div>
    </floating-menu>

    <EditorContent
      v-if="editorInstance"
      :editor="editorInstance"
      class="tiptap-content"
    />

    <div v-else class="tiptap-loading">Iniciando editor...</div>
  </div>
</template>
<style scoped>
/* ===== Layout ===== */
.tiptap-editor-container {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: white;
  display: flex;
  flex-direction: column;
}

.tiptap-toolbar {
  padding: 8px;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  gap: 8px;
  background: #f9f9f9;
  border-radius: 8px 8px 0 0;
  flex-wrap: wrap;
}

.tiptap-toolbar button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px 12px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  min-width: 40px;
}

.tiptap-toolbar button.is-active {
  background: #3182ce;
  color: white;
  border-color: #3182ce;
}

.divider {
  width: 1px;
  background: #ddd;
  margin: 0 4px;
}

/* ===== Floating & Bubble Menu Styles (UNIFICADOS E CORRIGIDOS) ===== */
.bubble-menu,
.floating-menu-card {
  display: flex;
  align-items: center;
  background-color: white;
  padding: 0.2rem 0.4rem;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border: 1px solid #e2e8f0;
  gap: 0.2rem;
  
  /* CRUCIAL: Impede que os botões caiam para a linha de baixo ou vazem */
  white-space: nowrap;
  flex-wrap: nowrap;
}

.bubble-menu button,
.floating-menu-card button {
  border: none;
  background: transparent;
  color: #4a5568;
  font-size: 0.9rem;
  font-weight: 600;
  padding: 0.4rem 0.6rem;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: all 0.2s;
  line-height: 1; /* Alinhamento vertical preciso */
}

.bubble-menu button:hover,
.floating-menu-card button:hover {
  background-color: #edf2f7;
  color: #2d3748;
}

.bubble-menu button.is-active,
.floating-menu-card button.is-active {
  background-color: #ebf8ff;
  color: #3182ce;
}

.menu-divider {
  width: 1px;
  height: 1.25rem;
  background-color: #cbd5e0;
  margin: 0 0.3rem;
  display: inline-block;
}

.btn-clear {
  color: #e53e3e !important;
}

.btn-clear:hover {
  background-color: #fff5f5 !important;
}

/* ===== Loading State ===== */
.tiptap-loading {
  padding: 40px;
  text-align: center;
  color: #666;
  font-style: italic;
}

/* ===== Content Padding (Mantido conforme original) ===== */
.tiptap-content :deep(.ProseMirror) {
  min-height: 500px;
  padding: 25px; /* Isso garante que o texto não cola na borda */
  outline: none;
}

/* ===== Code Blocks (Mantido conforme original) ===== */
:deep(.ProseMirror pre) {
  background: #232f3e; /* Isso garante o fundo escuro */
  color: #e2e8f0;
  font-family: 'JetBrains Mono', monospace;
  padding: 1.5rem;
  border-radius: 8px;
  margin: 2rem 0;
  line-height: 1.6;
}

/* ===== Blockquote (Mantido) ===== */
:deep(.ProseMirror blockquote) {
  border-left: 5px solid #3182ce;
  background-color: #f8fafc;
  padding: 1.25rem 1.75rem;
  margin: 1.5rem 0;
  border-radius: 0 8px 8px 0;
  font-style: italic;
  color: #232f3e;
}

/* ===== Horizontal Rule (Divider) ===== */
:deep(.ProseMirror hr) {
  /* Estilo visual vem do 'style' inline. Aqui apenas comportamento. */
  cursor: pointer;
}

:deep(.ProseMirror hr.ProseMirror-selectednode) {
  outline: 2px solid #3182ce;
  outline-offset: 2px;
}

/* ===== Links ===== */
:deep(.ProseMirror .content-link) {
  color: var(--blue-600);
  text-decoration: underline;
  font-weight: 500;
  cursor: pointer;
}

:deep(.ProseMirror .content-link:hover) {
  color: var(--aws-dark);
}

/* ===== Lists ===== */
:deep(.ProseMirror ul),
:deep(.ProseMirror ol) {
  padding-left: 5px;
  margin-bottom: 2em;
}

:deep(.ProseMirror ul) {
  list-style: none !important;
}

:deep(.ProseMirror ul li) {
  position: relative;
  padding-left: 25px;
  margin-bottom: 10px;
  line-height: 1.6;
}

:deep(.ProseMirror ul li::before) {
  content: '';
  position: absolute;
  left: 0;
  top: 0.6em;
  width: 8px;
  height: 8px;
  background-color: #ff9900;
  border-radius: 50%;
}

:deep(.ProseMirror ol) {
  list-style-type: decimal;
  padding-left: 25px;
}

:deep(.ProseMirror ol li) {
  margin-bottom: 10px;
  line-height: 1.6;
  padding-left: 5px;
}

:deep(.ProseMirror ol li::marker) {
  color: #ff9900;
  font-weight: bold;
}

/* ===== Callouts ===== */
:deep(.content-callout) {
  display: block !important;
  padding: 20px 25px !important;
  margin: 1.5em 0 0.5em 0 !important;
  border-radius: 8px;
  border-left: 5px solid;
}

:deep(.callout-warning) {
  background-color: #fffaf0 !important;
  border-left-color: #ff9900 !important;
  color: #744210 !important;
}

:deep(.callout-info) {
  background-color: #ebf8ff !important;
  border-left-color: #3182ce !important;
  color: #2c5282 !important;
}

/* ===== Inline Code Styling ===== */
:deep(.inline-code) {
  background-color: #edf2f7;
  color: #d53f8c;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.85em;
  padding: 0.2em 0.4em;
  border-radius: 4px;
  box-decoration-break: clone;
  -webkit-box-decoration-break: clone;
}

/* ===== TABLES (CRITICAL SETUP) ===== */
:deep(.ProseMirror table) {
  border-collapse: collapse;
  table-layout: fixed;
  width: 100%;
  margin: 0;
  overflow: hidden;
}

:deep(.ProseMirror td),
:deep(.ProseMirror th) {
  min-width: 1em;
  border: 2px solid #ced4da;
  padding: 8px 12px;
  vertical-align: top;
  box-sizing: border-box;
  position: relative;
}

:deep(.ProseMirror th) {
  font-weight: bold;
  text-align: left;
  background-color: #f1f3f5;
}

:deep(.ProseMirror .selectedCell:after) {
  z-index: 2;
  position: absolute;
  content: "";
  left: 0; right: 0; top: 0; bottom: 0;
  background: rgba(200, 200, 255, 0.4);
  pointer-events: none;
}

:deep(.ProseMirror .column-resize-handle) {
  position: absolute;
  right: -2px;
  top: 0;
  bottom: -2px;
  width: 4px;
  background-color: #adf;
  pointer-events: none;
}

:deep(.ProseMirror p) {
  margin: 0; /* Remove margem extra dentro das células */
}

/* ===== YOUTUBE EMBED ===== */
:deep(.ProseMirror div[data-youtube-video]) {
  cursor: move;
  padding-right: 24px;
}

:deep(.ProseMirror iframe) {
  border: 8px solid #000;
  border-radius: 4px;
  display: block;
  margin: 1.5rem auto;
  max-width: 100%;
}
/* === LAYOUT DO MENU DE TABELA OTIMIZADO === */
.bubble-menu-table {
  display: flex;
  align-items: center;
  background-color: #2d3748; /* Fundo escuro (Slate 800) */
  padding: 0.3rem 0.5rem;
  border-radius: 8px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3);
  gap: 0.5rem;
  z-index: 50; /* Garante que fique acima de tudo */
}

/* Agrupadores para manter os botões juntos visualmente */
.bubble-menu-table .btn-group {
  display: flex;
  gap: 2px;
  align-items: center;
}

/* Botões Base */
.bubble-menu-table button {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: #cbd5e0; /* Cinza claro */
  padding: 6px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 28px;
  height: 28px;
}

.bubble-menu-table button:hover {
  background-color: #4a5568; /* Hover mais claro */
  color: #fff;
}

/* Ícones */
.bubble-menu-table i {
  font-size: 0.9rem;
}

/* Pequeno indicador (+ ou -) sobreposto ao ícone */
.mini-badge {
  position: absolute;
  top: 2px;
  right: 0px;
  font-size: 0.6rem;
  font-weight: bold;
  line-height: 1;
}

/* === ESTILOS DE AÇÃO === */

/* Botões de Perigo (Delete) */
.bubble-menu-table .btn-danger:hover {
  background-color: rgba(229, 62, 62, 0.3); /* Vermelho translúcido */
  color: #fc8181;
}

/* Divisor Vertical Elegante */
.bubble-menu-table .menu-divider {
  width: 1px;
  height: 20px;
  background-color: #4a5568; /* Cinza médio */
  margin: 0 2px;
}

/* Ajuste específico para o botão de Mesclar */
.bubble-menu-table .btn-text {
  padding: 0 8px;
}

/* ===================================================================
   CORREÇÃO DEFINITIVA DE TABELAS (TI-PTAP)
   Estratégia: Schema inline* (Script) + CSS de Layout Fixo
   =================================================================== */

:deep(.ProseMirror table) {
  border-collapse: collapse;
  table-layout: fixed;
  width: 100%;
  margin: 1.5rem 0; /* Espaçamento vertical saudável */
  overflow: hidden;
}

:deep(.ProseMirror table td),
:deep(.ProseMirror table th) {
  position: relative;
  vertical-align: top;
  box-sizing: border-box;
  
  /* Com o schema inline*, height: auto funciona perfeitamente */
  height: auto !important; 
  min-height: 0 !important;
  padding: 8px 10px !important;
  
  border: 1px solid #ced4da; /* Borda visível no editor */
}

/* Header estilizado */
:deep(.ProseMirror table th) {
  background-color: #f8f9fa;
  font-weight: 600;
  text-align: left;
}

/* UX: Feedback visual de seleção (Crucial para edição) */
:deep(.ProseMirror .selectedCell:after) {
  z-index: 2;
  position: absolute;
  content: "";
  left: 0; right: 0; top: 0; bottom: 0;
  background: rgba(200, 200, 255, 0.4);
  pointer-events: none;
}

/* Handle de redimensionamento de coluna */
:deep(.ProseMirror .column-resize-handle) {
  position: absolute;
  right: -2px;
  top: 0;
  bottom: -2px;
  width: 4px;
  background-color: #adf;
  pointer-events: none;
}
</style>