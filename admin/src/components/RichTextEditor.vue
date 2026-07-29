<script setup lang="ts">
import { watch, computed } from 'vue'
import { useEditor, EditorContent, BubbleMenu, FloatingMenu, type Editor } from '@tiptap/vue-3'
import BubbleMenuExtension from '@tiptap/extension-bubble-menu'
import FloatingMenuExtension from '@tiptap/extension-floating-menu'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import { Callout, CALLOUT_DEFAULTS, type CalloutType } from './Callout'
import { PullQuote } from './tiptap/PullQuote'
import { ClosingFlourish } from './tiptap/ClosingFlourish'
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

// Prevents paragraphs (<p>) inside table cells (TD)
const CustomTableCell = TableCell.extend({
  content: 'inline*',
})

// Prevents paragraphs (<p>) inside table headers (TH)
const CustomTableHeader = TableHeader.extend({
  content: 'inline*',
})
// Languages chosen for the Tech/DevOps/AI niche this blog covers
const terraformDef = hljs.getLanguage('terraform')?.rawDefinition
const javascriptDef = hljs.getLanguage('javascript')?.rawDefinition
const typescriptDef = hljs.getLanguage('typescript')?.rawDefinition
const bashDef = hljs.getLanguage('bash')?.rawDefinition
const pythonDef = hljs.getLanguage('python')?.rawDefinition // AI/Data Science
const yamlDef = hljs.getLanguage('yaml')?.rawDefinition // K8s, CloudFormation, Actions
const jsonDef = hljs.getLanguage('json')?.rawDefinition // IAM Policies, Configs
const sqlDef = hljs.getLanguage('sql')?.rawDefinition // Data Engineering

const lowlightInstance = createLowlight(common)

if (terraformDef) lowlightInstance.register('terraform', terraformDef)
if (javascriptDef) lowlightInstance.register('javascript', javascriptDef)
if (typescriptDef) lowlightInstance.register('typescript', typescriptDef)
if (bashDef) lowlightInstance.register('bash', bashDef)
if (pythonDef) lowlightInstance.register('python', pythonDef)
if (yamlDef) lowlightInstance.register('yaml', yamlDef)
if (jsonDef) lowlightInstance.register('json', jsonDef)
if (sqlDef) lowlightInstance.register('sql', sqlDef)
/* END BLOCK: Syntax Highlighting Setup */


const props = defineProps<{ modelValue: string; hideToolbar?: boolean }>()
const emit = defineEmits<{(e: 'update:modelValue', v: string): void,(e: 'request-upload'): void }>()

/* BLOCK: Editor Initialization */
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
  CustomTableHeader,
  CustomTableCell,
  Youtube.configure({
    controls: true,
    nocookie: true,
    // Responsive sizing via CSS is preferable, but a default is set here
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
  PullQuote,
  ClosingFlourish,
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

const addCallout = (type: CalloutType) => {
  editorInstance.value
    ?.chain()
    .focus()
    .insertContent({
      type: 'callout',
      attrs: { type },
      content: [{ type: 'text', text: 'Escreva aqui o conteúdo do callout.' }],
    })
    .run()
}

const editCalloutTitle = () => {
  if (!editorInstance.value?.isActive('callout')) return
  const attrs = editorInstance.value.getAttributes('callout')
  const type = (attrs.type || 'info') as CalloutType
  const current = attrs.title || CALLOUT_DEFAULTS[type]?.title || ''
  const title = window.prompt('Título do callout:', current)
  if (title === null) return
  editorInstance.value.chain().focus().updateAttributes('callout', { title: title || null }).run()
}

const setPullQuote = () => {
  editorInstance.value
    ?.chain()
    .focus()
    .insertContent({
      type: 'pullQuote',
      content: [{ type: 'text', text: 'Escreva a citação em destaque aqui.' }],
    })
    .run()
}

const editPullQuoteCite = () => {
  if (!editorInstance.value?.isActive('pullQuote')) return
  const current = editorInstance.value.getAttributes('pullQuote').cite || ''
  const cite = window.prompt('Atribuição da citação (ex: — princípio nº 3):', current)
  if (cite === null) return
  editorInstance.value.chain().focus().updateAttributes('pullQuote', { cite: cite || null }).run()
}

const setClosingFlourish = () => {
  editorInstance.value
    ?.chain()
    .focus()
    .insertContent({
      type: 'closingFlourish',
      content: [
        { type: 'heading', attrs: { level: 3 }, content: [{ type: 'text', text: 'Pronto para começar?' }] },
        { type: 'paragraph', content: [{ type: 'text', text: 'Escreva aqui a conclusão do artigo.' }] },
      ],
    })
    .run()
}

const setHorizontalRule = () => {
  editorInstance.value?.chain().focus().setHorizontalRule().run()
}
/* END BLOCK: Custom Commands */

/* BLOCK: Code Block Language */
const CODE_LANGUAGES = [
  { value: 'python', label: 'Python' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'bash', label: 'Bash' },
  { value: 'terraform', label: 'Terraform' },
  { value: 'yaml', label: 'YAML' },
  { value: 'json', label: 'JSON' },
  { value: 'sql', label: 'SQL' },
]

const setCodeLanguage = (event: Event) => {
  const language = (event.target as HTMLSelectElement).value
  editorInstance.value?.chain().focus().updateAttributes('codeBlock', { language }).run()
}
/* END BLOCK: Code Block Language */

/* BLOCK: New Media Commands */
const addYoutubeVideo = () => {
  const url = window.prompt('Cole a URL do YouTube:')
  
  if (url) {
    // Tiptap automatically validates whether it's a YouTube link
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

const focusStart = () => {
  editorInstance.value?.chain().focus('start').run()
}

defineExpose({
  insertImage,
  focusStart
})
/* END BLOCK: Image Upload Logic */
</script>

<template>
  <div class="tiptap-editor-container" :class="{ 'tiptap-editor-container--bare': hideToolbar }">
    <div v-if="editorInstance && !hideToolbar" class="tiptap-toolbar">
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

      <select
        v-if="editorInstance.isActive('codeBlock')"
        class="lang-select"
        :value="editorInstance.getAttributes('codeBlock').language"
        @change="setCodeLanguage"
        title="Linguagem do bloco de código"
      >
        <option v-for="lang in CODE_LANGUAGES" :key="lang.value" :value="lang.value">{{ lang.label }}</option>
      </select>

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

      <button type="button" @click="addCallout('info')" :class="{ 'is-active': editorInstance.isActive('callout', { type: 'info' }) }" title="Callout: Saiba mais"><i class="fas fa-circle-info"></i></button>
      <button type="button" @click="addCallout('warn')" :class="{ 'is-active': editorInstance.isActive('callout', { type: 'warn' }) }" title="Callout: Atenção"><i class="fas fa-triangle-exclamation"></i></button>
      <button type="button" @click="addCallout('error')" :class="{ 'is-active': editorInstance.isActive('callout', { type: 'error' }) }" title="Callout: Evite"><i class="fas fa-circle-xmark"></i></button>
      <button type="button" @click="addCallout('ok')" :class="{ 'is-active': editorInstance.isActive('callout', { type: 'ok' }) }" title="Callout: Boa prática"><i class="fas fa-circle-check"></i></button>
      <button type="button" @click="addCallout('tip')" :class="{ 'is-active': editorInstance.isActive('callout', { type: 'tip' }) }" title="Callout: Dica de bastidor"><i class="fas fa-lightbulb"></i></button>
      <button type="button" @click="editCalloutTitle" :disabled="!editorInstance.isActive('callout')" title="Editar título do callout"><i class="fas fa-pen"></i></button>

      <div class="divider"></div>

      <button type="button" @click="setPullQuote" :class="{ 'is-active': editorInstance.isActive('pullQuote') }" title="Citação em destaque"><i class="fas fa-quote-left"></i></button>
      <button type="button" @click="editPullQuoteCite" :disabled="!editorInstance.isActive('pullQuote')" title="Editar atribuição da citação"><i class="fas fa-signature"></i></button>

      <div class="divider"></div>

      <button type="button" @click="setClosingFlourish" title="Bloco de encerramento"><i class="fas fa-flag-checkered"></i></button>

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

        <button type="button" @click="addCallout('info')" title="Callout: Saiba mais"><i class="fas fa-circle-info"></i></button>
        <button type="button" @click="addCallout('warn')" title="Callout: Atenção"><i class="fas fa-triangle-exclamation"></i></button>
        <button type="button" @click="addCallout('error')" title="Callout: Evite"><i class="fas fa-circle-xmark"></i></button>
        <button type="button" @click="addCallout('ok')" title="Callout: Boa prática"><i class="fas fa-circle-check"></i></button>
        <button type="button" @click="addCallout('tip')" title="Callout: Dica de bastidor"><i class="fas fa-lightbulb"></i></button>

        <div class="menu-divider"></div>

        <button type="button" @click="setPullQuote" title="Citação em destaque"><i class="fas fa-quote-left"></i></button>
        <button type="button" @click="setClosingFlourish" title="Bloco de encerramento"><i class="fas fa-flag-checkered"></i></button>

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
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: white;
  display: flex;
  flex-direction: column;
}

.tiptap-toolbar {
  padding: var(--space-1);
  border-bottom: 1px solid var(--border-color);
  display: flex;
  gap: var(--space-1);
  background: var(--slate-50);
  border-radius: 8px 8px 0 0;
  flex-wrap: wrap;
}

.tiptap-editor-container--bare {
  border: none;
  background: transparent;
}
.tiptap-editor-container--bare .tiptap-content :deep(.ProseMirror) {
  padding: 0;
  min-height: 40vh;
}

.tiptap-toolbar button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px 12px;
  border: 1px solid var(--border-color);
  background: white;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  min-width: 40px;
}

.tiptap-toolbar button.is-active {
  background: var(--accent);
  color: white;
  border-color: var(--accent);
}

.tiptap-toolbar button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.lang-select {
  padding: 4px 8px;
  border: 1px solid var(--border-color);
  background: white;
  border-radius: 4px;
  font-weight: 600;
  font-size: var(--text-sm);
  cursor: pointer;
}

.divider {
  width: 1px;
  background: var(--border-color);
  margin: 0 4px;
}

/* ===== Floating & Bubble Menu Styles (unified) ===== */
.bubble-menu,
.floating-menu-card {
  display: flex;
  align-items: center;
  background-color: white;
  padding: 0.2rem 0.4rem;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border: 1px solid var(--border-color);
  gap: 0.2rem;
  white-space: nowrap;
  flex-wrap: nowrap;
}

.bubble-menu button,
.floating-menu-card button {
  border: none;
  background: transparent;
  color: var(--dark-600);
  font-size: var(--text-sm);
  font-weight: 600;
  padding: 0.4rem 0.6rem;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: all 0.2s;
  line-height: 1;
}

.bubble-menu button:hover,
.floating-menu-card button:hover {
  background-color: var(--slate-100);
  color: var(--dark-800);
}

.bubble-menu button.is-active,
.floating-menu-card button.is-active {
  background-color: var(--accent-light);
  color: var(--accent);
}

.menu-divider {
  width: 1px;
  height: 1.25rem;
  background-color: var(--slate-300);
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
  padding: var(--space-5);
  text-align: center;
  color: var(--dark-600);
  font-style: italic;
}

/* ===== Content Padding ===== */
.tiptap-content :deep(.ProseMirror) {
  min-height: 500px;
  padding: 25px;
  outline: none;
}

/* ===== Code Blocks ===== */
:deep(.ProseMirror pre) {
  background: var(--dark-900);
  color: #e2e8f0;
  font-family: var(--font-mono);
  padding: 1.5rem;
  border-radius: 8px;
  margin: 2rem 0;
  line-height: 1.6;
}

/* ===== Blockquote ===== */
:deep(.ProseMirror blockquote) {
  border-left: 5px solid var(--accent);
  background-color: var(--slate-50);
  padding: 1.25rem 1.75rem;
  margin: 1.5rem 0;
  border-radius: 0 8px 8px 0;
  font-style: italic;
  color: var(--dark-900);
}

/* ===== Horizontal Rule (Divider) ===== */
:deep(.ProseMirror hr) {
  /* Visual style comes from the inline 'style'. Only behavior here. */
  cursor: pointer;
}

:deep(.ProseMirror hr.ProseMirror-selectednode) {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

/* ===== Links ===== */
:deep(.ProseMirror .content-link) {
  color: var(--accent);
  text-decoration: underline;
  font-weight: 500;
  cursor: pointer;
}

:deep(.ProseMirror .content-link:hover) {
  color: var(--dark-900);
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
  background-color: var(--accent);
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
  color: var(--accent);
  font-weight: bold;
}

/* ===== Callouts ===== */
:deep(.ProseMirror .callout),
:deep(.ProseMirror .tip) {
  display: flex !important;
  gap: 18px;
  align-items: flex-start;
  background: #FFFFFF;
  border: 1px solid #E4DDD0;
  border-left: 4px solid #0F4C5C;
  border-radius: 12px;
  padding: 22px 26px;
  margin: 1.6em 0;
}

:deep(.ProseMirror .callout .ic),
:deep(.ProseMirror .tip .ic) {
  flex: none;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-mono);
  font-weight: 700;
  font-size: 18px;
  background: rgba(15, 76, 92, 0.1);
  color: #0F4C5C;
}

:deep(.ProseMirror .callout .c),
:deep(.ProseMirror .tip .c) {
  min-width: 0;
}

:deep(.ProseMirror .callout .t),
:deep(.ProseMirror .tip .t) {
  font-family: var(--font-mono);
  font-size: 10.5px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  font-weight: 500;
  margin-bottom: 6px;
  color: #0F4C5C;
}

:deep(.ProseMirror .callout .c p),
:deep(.ProseMirror .tip .c p) {
  margin: 0 !important;
  font-size: 1.05rem;
  line-height: 1.6;
}

/* Warning — clay accent */
:deep(.ProseMirror .callout.warn) {
  border-left-color: #C9603C;
  background: #FCF6F1;
}
:deep(.ProseMirror .callout.warn .ic) { background: #F3DDD0; color: #A94C2D; }
:deep(.ProseMirror .callout.warn .t) { color: #A94C2D; }

/* Error — red accent */
:deep(.ProseMirror .callout.error) {
  border-left-color: #A33A2B;
  background: #FBF0EE;
}
:deep(.ProseMirror .callout.error .ic) { background: #F4D9D4; color: #A33A2B; }
:deep(.ProseMirror .callout.error .t) { color: #A33A2B; }

/* Ok — moss accent */
:deep(.ProseMirror .callout.ok) {
  border-left-color: #3F6B47;
  background: #F1F5F0;
}
:deep(.ProseMirror .callout.ok .ic) { background: #DCE8DD; color: #3F6B47; }
:deep(.ProseMirror .callout.ok .t) { color: #3F6B47; }

/* Tip — clay accent, standalone class */
:deep(.ProseMirror .tip) {
  border-left-color: #C9603C;
}
:deep(.ProseMirror .tip .ic) { background: #F3DDD0; color: #A94C2D; }
:deep(.ProseMirror .tip .t) { color: #C9603C; }

/* ===== Pull Quote (.pull) ===== */
:deep(.ProseMirror .pull) {
  margin: 1.8em 0;
  padding: 8px 0 8px 28px;
  border-left: 3px solid #C9603C;
}

:deep(.ProseMirror .pull p) {
  margin: 0 !important;
  font-size: 1.5rem;
  line-height: 1.4;
  font-weight: 500;
  font-style: italic;
  color: #0F4C5C;
  letter-spacing: -0.015em;
}

:deep(.ProseMirror .pull .cite) {
  font-family: var(--font-mono);
  font-size: 11.5px;
  letter-spacing: 0.08em;
  color: #7E969E;
  margin-top: 14px;
  font-style: normal;
}

/* ===== Closing Flourish (.closing) ===== */
:deep(.ProseMirror .closing) {
  margin-top: 1.8em;
  padding: 30px 32px;
  background: #0F4C5C;
  border-radius: 16px;
  color: #FAF8F3;
}

:deep(.ProseMirror .closing h3) {
  font-weight: 800;
  font-size: 1.4rem;
  letter-spacing: -0.025em;
  color: #fff;
  margin-bottom: 8px;
}

:deep(.ProseMirror .closing p) {
  font-size: 1.05rem;
  line-height: 1.6;
  color: rgba(250, 248, 243, 0.72);
  max-width: 520px;
  margin: 0 !important;
}

/* ===== Inline Code Styling ===== */
:deep(.inline-code) {
  background-color: var(--slate-100);
  color: #d53f8c;
  font-family: var(--font-mono);
  font-size: 0.85em;
  padding: 0.2em 0.4em;
  border-radius: 4px;
  box-decoration-break: clone;
  -webkit-box-decoration-break: clone;
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
/* === OPTIMIZED TABLE MENU LAYOUT === */
.bubble-menu-table {
  display: flex;
  align-items: center;
  background-color: var(--dark-800);
  padding: 0.3rem 0.5rem;
  border-radius: 8px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3);
  gap: 0.5rem;
  z-index: 50;
}

/* Groups buttons visually together */
.bubble-menu-table .btn-group {
  display: flex;
  gap: 2px;
  align-items: center;
}

/* Base buttons */
.bubble-menu-table button {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: var(--slate-300);
  padding: 6px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 28px;
  height: 28px;
}

.bubble-menu-table button:hover {
  background-color: var(--dark-600);
  color: #fff;
}

/* Icons */
.bubble-menu-table i {
  font-size: 0.9rem;
}

/* Small (+/-) indicator overlaid on the icon */
.mini-badge {
  position: absolute;
  top: 2px;
  right: 0px;
  font-size: 0.6rem;
  font-weight: bold;
  line-height: 1;
}

/* Danger buttons (delete) */
.bubble-menu-table .btn-danger:hover {
  background-color: rgba(229, 62, 62, 0.3);
  color: #fc8181;
}

.bubble-menu-table .menu-divider {
  width: 1px;
  height: 20px;
  background-color: var(--dark-600);
  margin: 0 2px;
}

/* Merge button gets its own padding */
.bubble-menu-table .btn-text {
  padding: 0 8px;
}

/* ===================================================================
   TABLE LAYOUT FIX
   Strategy: inline* schema (see CustomTableCell/CustomTableHeader above)
   + fixed-layout CSS
   =================================================================== */

:deep(.ProseMirror table) {
  border-collapse: collapse;
  table-layout: fixed;
  width: 100%;
  margin: 1.5rem 0;
  overflow: hidden;
}

:deep(.ProseMirror table td),
:deep(.ProseMirror table th) {
  position: relative;
  vertical-align: top;
  box-sizing: border-box;

  /* With the inline* schema, height: auto works correctly */
  height: auto !important;
  min-height: 0 !important;
  padding: 8px 10px !important;

  border: 1px solid var(--border-color);
}

:deep(.ProseMirror table th) {
  background-color: var(--slate-50);
  font-weight: 600;
  text-align: left;
}

/* Visual feedback for cell selection */
:deep(.ProseMirror .selectedCell:after) {
  z-index: 2;
  position: absolute;
  content: "";
  left: 0; right: 0; top: 0; bottom: 0;
  background: rgba(200, 200, 255, 0.4);
  pointer-events: none;
}

/* Column resize handle */
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