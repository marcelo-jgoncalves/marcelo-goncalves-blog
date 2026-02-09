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

/* BLOCK: Syntax Highlighting Setup */
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { createLowlight, common } from 'lowlight'
import hljs from 'highlight.js'

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
</style>