<script setup lang="ts">
import { watch, computed } from 'vue'
import { useEditor, EditorContent, type Editor } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import { Callout } from './Callout'

// Importações para Bloco de Código com Realce (Syntax Highlighting)
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { createLowlight, common } from 'lowlight'
import hljs from 'highlight.js'

// 1. Obter as definições das linguagens do HLJS
const terraformDef = hljs.getLanguage('terraform')?.rawDefinition
const javascriptDef = hljs.getLanguage('javascript')?.rawDefinition
const bashDef = hljs.getLanguage('bash')?.rawDefinition

// 2. Criar a instância lowlight
const lowlightInstance = createLowlight(common)

// 3. Registrar linguagens
if (terraformDef) lowlightInstance.register('terraform', terraformDef)
if (javascriptDef) lowlightInstance.register('javascript', javascriptDef)
if (bashDef) lowlightInstance.register('bash', bashDef)

const props = defineProps<{ modelValue: string }>()
const emit = defineEmits<{ (e: 'update:modelValue', v: string): void }>()

// Inicialização do Editor
const editorRef = useEditor({
  content: props.modelValue,
  extensions: [
    StarterKit.configure({ 
      heading: { levels: [2, 3] },
      codeBlock: false,
      // O blockquote já vem no StarterKit, mas garantimos a configuração aqui
      blockquote: {} 
    }),
    CodeBlockLowlight.configure({ 
      lowlight: lowlightInstance,
      defaultLanguage: 'terraform' 
    }),
    Callout,
  ],
  editorProps: {
    attributes: { class: 'tiptap-inner-editor focus:outline-none' },
  },
  onUpdate: ({ editor: e }) => {
    emit('update:modelValue', e.getHTML())
  },
})

// Computed tipada para resolver o conflito de ShallowRef
const editorInstance = computed(() => editorRef.value as Editor | undefined)

watch(() => props.modelValue, (newValue) => {
  if (!editorInstance.value) return
  if (editorInstance.value.getHTML() !== newValue) {
    editorInstance.value.commands.setContent(newValue, { emitUpdate: false })
  }
})

const addCallout = (type: 'info' | 'warning') => {
  editorInstance.value?.chain().focus().insertContent({
    type: 'callout',
    attrs: { type },
  }).run()
}
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
        @click="editorInstance.chain().focus().toggleBold().run()"
        :class="{ 'is-active': editorInstance.isActive('bold') }"
      >B</button>

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
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
          <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H16.017C15.4647 8 15.017 8.44772 15.017 9V12C15.017 12.5523 14.5693 13 14.017 13H12.017V9C12.017 6.79086 13.8079 5 16.017 5H19.017C21.2261 5 23.017 6.79086 23.017 9V15C23.017 17.2091 21.2261 19 19.017 19H17.017C16.4647 19 16.017 19.4477 16.017 20V21H14.017ZM3.01693 21L3.01693 18C3.01693 16.8954 3.91236 16 5.01693 16H8.01693C8.56921 16 9.01693 15.5523 9.01693 15V9C9.01693 8.44772 8.56921 8 8.01693 8H5.01693C4.46464 8 4.01693 8.44772 4.01693 9V12C4.01693 12.5523 3.56921 13 3.01693 13H1.01693V9C1.01693 6.79086 2.80779 5 5.01693 5H8.01693C10.2261 5 12.0169 6.79086 12.0169 9V15C12.0169 17.2091 10.2261 19 8.01693 19H6.01693C5.46464 19 5.01693 19.4477 5.01693 20V21H3.01693Z"></path>
        </svg>
      </button>

      <div class="divider"></div>

      <button type="button" @click="addCallout('info')" title="Dica">ℹ️</button>
      <button type="button" @click="addCallout('warning')" title="Atenção">⚠️</button>
      
      <div class="divider"></div>

      <button type="button" @click="editorInstance.chain().focus().clearNodes().run()">
        Limpar
      </button>
    </div>

    <editor-content v-if="editorInstance" :editor="editorInstance" class="tiptap-content" />
    
    <div v-else class="tiptap-loading">Iniciando editor...</div>
  </div>
</template>

<style scoped>
.tiptap-editor-container { border: 1px solid #e0e0e0; border-radius: 8px; background: white; display: flex; flex-direction: column; }
.tiptap-toolbar { padding: 8px; border-bottom: 1px solid #e0e0e0; display: flex; gap: 8px; background: #f9f9f9; border-radius: 8px 8px 0 0; }
.tiptap-toolbar button { display: flex; align-items: center; justify-content: center; padding: 4px 12px; border: 1px solid #ddd; background: white; border-radius: 4px; cursor: pointer; font-weight: 600; min-width: 40px; }
.tiptap-toolbar button.is-active { background: #3182ce; color: white; border-color: #3182ce; }
.divider { width: 1px; background: #ddd; margin: 0 4px; }
.tiptap-loading { padding: 40px; text-align: center; color: #666; font-style: italic; }
.tiptap-content :deep(.ProseMirror) { min-height: 500px; padding: 25px; outline: none; }

/* ------------------------------------------------------------------
 * BLOCO DE CÓDIGO (AWS DARK THEME)
 * ------------------------------------------------------------------ */
:deep(.ProseMirror pre) {
  background: #232F3E; 
  color: #e2e8f0;
  font-family: 'JetBrains Mono', monospace;
  padding: 1.5rem;
  border-radius: 8px;
  margin: 2rem 0;
  line-height: 1.6;
}

/* ------------------------------------------------------------------
 * CITAÇÃO (BLOCKQUOTE) - DESIGN COMPLEMENTAR AZUL
 * ------------------------------------------------------------------ */
:deep(.ProseMirror blockquote) {
  border-left: 5px solid #3182CE; /* Azul complementar ao laranja AWS */
  background-color: #f8fafc;
  padding: 1.25rem 1.75rem;
  margin: 1.5rem 0;
  border-radius: 0 8px 8px 0;
  font-style: italic;
  color: #232F3E;
}

:deep(.ProseMirror blockquote p) {
  margin: 0;
  line-height: 1.7;
}

/* ------------------------------------------------------------------
 * CONFIGURAÇÃO DE LISTAS (BOLINHAS AMARELAS)
 * ------------------------------------------------------------------ */
:deep(.ProseMirror ul) { padding-left: 5px; margin-bottom: 2em; list-style: none !important; }
:deep(.ProseMirror li) { position: relative; padding-left: 25px; margin-bottom: 10px; line-height: 1.6; }
:deep(.ProseMirror li::before) { content: ''; position: absolute; left: 0; top: 0.6em; width: 8px; height: 8px; background-color: #FF9900; border-radius: 50%; display: inline-block; }

/* ------------------------------------------------------------------
 * CSS DO CALLOUT
 * ------------------------------------------------------------------ */
:deep(.content-callout) { display: block !important; padding: 20px 25px !important; margin: 1.5em 0 0.5em 0 !important; border-radius: 8px; border-left: 5px solid; }
:deep(.callout-warning) { background-color: #fffaf0 !important; border-left-color: #ff9900 !important; color: #744210 !important; }
:deep(.callout-info) { background-color: #ebf8ff !important; border-left-color: #3182ce !important; color: #2c5282 !important; }
</style>