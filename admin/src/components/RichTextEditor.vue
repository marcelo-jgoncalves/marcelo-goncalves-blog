/* admin/scr/components/RichTextEditor.vue */

<script setup lang="ts">
import { watch, computed } from 'vue'
import { useEditor, EditorContent, BubbleMenu, type Editor } from '@tiptap/vue-3'
import BubbleMenuExtension from '@tiptap/extension-bubble-menu'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import { Callout } from './Callout'
import { SmartImage } from './tiptap/SmartImage'
import Code from '@tiptap/extension-code'

/* BLOCK: Syntax Highlighting Setup */
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { createLowlight, common } from 'lowlight'
import hljs from 'highlight.js'

const terraformDef = hljs.getLanguage('terraform')?.rawDefinition
const javascriptDef = hljs.getLanguage('javascript')?.rawDefinition
const bashDef = hljs.getLanguage('bash')?.rawDefinition

const lowlightInstance = createLowlight(common)
if (terraformDef) lowlightInstance.register('terraform', terraformDef)
if (javascriptDef) lowlightInstance.register('javascript', javascriptDef)
if (bashDef) lowlightInstance.register('bash', bashDef)
/* END BLOCK: Syntax Highlighting Setup */

const props = defineProps<{ modelValue: string }>()
const emit = defineEmits<{(e: 'update:modelValue', v: string): void,(e: 'request-upload'): void }>()

/* BLOCK: Editor Initialization */
// 1. Definimos as extensões
const editorExtensions = [
  BubbleMenuExtension,
  StarterKit.configure({
    code: false,
    heading: { levels: [2, 3] },
    codeBlock: false,
    blockquote: {},
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
    defaultLanguage: 'terraform',
  }),
  Callout,
  SmartImage.configure({
    inline: false, // Força ser bloco para funcionar bem com o NodeView
    allowBase64: true,
  }),
  Code.configure({
    HTMLAttributes: {
      class: 'inline-code',
    },
  }),
]

// 2. Criamos o editor (isso define o editorRef)
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
// 3. Agora podemos usar o editorRef com segurança
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
    editorInstance.value
      .chain()
      .focus()
      .extendMarkRange('link')
      .unsetLink()
      .run()
    return
  }

  // Se o usuário não digitar http, nós adicionamos para evitar que o Tiptap ignore o link
  const finalUrl = url.startsWith('http') ? url : `https://${url}`

  editorInstance.value
    .chain()
    .focus()
    .extendMarkRange('link')
    .setLink({ href: finalUrl })
    .run()
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
/* END BLOCK: Custom Commands */

// ... (código anterior: const addCallout = ...)

/* BLOCK: Image Upload Logic */
const triggerImageUpload = () => {
  // Dispara o evento para o Pai abrir o Modal
  emit('request-upload')
}

// Método público que o Pai vai chamar quando o upload terminar
const insertImage = (url: string, altText: string = '') => {
  if (!editorInstance.value) return

  // O comando setImage vem da extensão base Image (que o SmartImage estende)
  editorInstance.value
    .chain()
    .focus()
    .setImage({ src: url, alt: altText })
    .run()
}

// Expondo o método para ser acessível via Template Ref no componente Pai
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
      >
        H2
      </button>

      <button
        type="button"
        @click="editorInstance.chain().focus().toggleHeading({ level: 3 }).run()"
        :class="{ 'is-active': editorInstance.isActive('heading', { level: 3 }) }"
      >
        H3
      </button>

      <button
        type="button"
        @click="editorInstance.chain().focus().toggleBold().run()"
        :class="{ 'is-active': editorInstance.isActive('bold') }"
      >
        B
      </button>

      <div class="divider"></div>

      <button
        type="button"
        @click="editorInstance.chain().focus().toggleBulletList().run()"
        :class="{ 'is-active': editorInstance.isActive('bulletList') }"
        title="Lista com Marcadores"
      >
        <i class="fas fa-list-ul"></i>
      </button>

      <button
        type="button"
        @click="editorInstance.chain().focus().toggleOrderedList().run()"
        :class="{ 'is-active': editorInstance.isActive('orderedList') }"
        title="Lista Numerada"
      >
        <i class="fas fa-list-ol"></i>
      </button>

      <div class="divider"></div>

      <button
        type="button"
        @click="editorInstance.chain().focus().toggleCodeBlock().run()"
        :class="{ 'is-active': editorInstance.isActive('codeBlock') }"
        title="Bloco de Código"
      >
        &lt;/&gt;
      </button>

      <button
        type="button"
        @click="editorInstance.chain().focus().toggleBlockquote().run()"
        :class="{ 'is-active': editorInstance.isActive('blockquote') }"
        title="Citação"
      >
        <i class="fas fa-quote-right"></i>
      </button>

      <button
        type="button"
        @click="setLink"
        :class="{ 'is-active': editorInstance.isActive('link') }"
        title="Inserir Link"
      >
        <i class="fas fa-link"></i>
      </button>
      <button 
        type="button" 
        @click="triggerImageUpload" 
        title="Inserir Imagem"
      >
        <i class="fas fa-image"></i>
      </button>

      <div class="divider"></div>

      <button type="button" @click="addCallout('info')" title="Dica">ℹ️</button>
      <button type="button" @click="addCallout('warning')" title="Atenção">
        ⚠️
      </button>

      <div class="divider"></div>

      <button
        type="button"
        @click="editorInstance.chain().focus().clearNodes().run()"
      >
        Limpar
      </button>
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
      >
        Bold
      </button>

      <button
        type="button"
        @click="editorInstance.chain().focus().toggleItalic().run()"
        :class="{ 'is-active': editorInstance.isActive('italic') }"
      >
        Italic
      </button>

      <button
        type="button"
        @click="setLink"
        :class="{ 'is-active': editorInstance.isActive('link') }"
      >
        Link
      </button>

      <button
        type="button"
        @click="editorInstance.chain().focus().toggleCode().run()"
        :class="{ 'is-active': editorInstance.isActive('code') }"
        title="Código em linha"
      >
        &lt;/&gt;
      </button>

      <button 
         type="button"
         @click="editorInstance.chain().focus().unsetAllMarks().run()"
         class="btn-clear"
      >
        Limpar
      </button>
    </bubble-menu>
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

.tiptap-loading {
  padding: 40px;
  text-align: center;
  color: #666;
  font-style: italic;
}

.tiptap-content :deep(.ProseMirror) {
  min-height: 500px;
  padding: 25px;
  outline: none;
}

/* ===== Code Blocks ===== */
:deep(.ProseMirror pre) {
  background: #232f3e;
  color: #e2e8f0;
  font-family: 'JetBrains Mono', monospace;
  padding: 1.5rem;
  border-radius: 8px;
  margin: 2rem 0;
  line-height: 1.6;
}

/* ===== Blockquote ===== */
:deep(.ProseMirror blockquote) {
  border-left: 5px solid #3182ce;
  background-color: #f8fafc;
  padding: 1.25rem 1.75rem;
  margin: 1.5rem 0;
  border-radius: 0 8px 8px 0;
  font-style: italic;
  color: #232f3e;
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
/* ===== Inline Code Styling (Limpo) ===== */
:deep(.inline-code) {
  background-color: #edf2f7; /* Cinza claro */
  color: #d53f8c; /* Rosa/Roxo padrão */
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.85em;
  padding: 0.2em 0.4em;
  border-radius: 4px;
  /* box-decoration-break garante que o fundo siga o texto se quebrar linha */
  box-decoration-break: clone;
  -webkit-box-decoration-break: clone;
}
</style>
