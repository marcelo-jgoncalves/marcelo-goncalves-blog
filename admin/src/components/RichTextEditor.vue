<script setup lang="ts">
import { watch, computed } from 'vue'
import { useEditor, EditorContent, type Editor } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import { Callout } from './Callout'

const props = defineProps<{ modelValue: string }>()
const emit = defineEmits<{ (e: 'update:modelValue', v: string): void }>()

// 1. Inicialização do Editor
const editorRef = useEditor({
  content: props.modelValue,
  extensions: [
    StarterKit.configure({ heading: { levels: [2, 3] } }),
    Callout,
  ],
  editorProps: {
    attributes: { class: 'tiptap-inner-editor focus:outline-none' },
  },
  onUpdate: ({ editor: e }) => {
    emit('update:modelValue', e.getHTML())
  },
})

// 2. ESTRATÉGIA SÊNIOR: Computed tipada para resolver o conflito de ShallowRef
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
.tiptap-toolbar button { padding: 4px 12px; border: 1px solid #ddd; background: white; border-radius: 4px; cursor: pointer; }
.tiptap-toolbar button.is-active { background: #3182ce; color: white; border-color: #3182ce; }
.divider { width: 1px; background: #ddd; margin: 0 4px; }
.tiptap-loading { padding: 40px; text-align: center; color: #666; font-style: italic; }
.tiptap-content :deep(.ProseMirror) { min-height: 500px; padding: 25px; outline: none; }

/* ------------------------------------------------------------------
 * CONFIGURAÇÃO DE LISTAS (BOLINHAS AMARELAS) - ADMIN
 * ------------------------------------------------------------------ */
:deep(.ProseMirror ul) {
  padding-left: 5px;
  margin-bottom: 2em;
  list-style: none !important;
}

:deep(.ProseMirror li) {
  position: relative;
  padding-left: 25px;
  margin-bottom: 10px;
  line-height: 1.6;
}

:deep(.ProseMirror li::before) {
  content: '';
  position: absolute;
  left: 0;
  top: 0.6em; /* Centraliza a bolinha com a primeira linha de texto */
  width: 8px;
  height: 8px;
  background-color: #FF9900; /* aws-orange */
  border-radius: 50%;
  display: inline-block;
}

/* Garante que o texto dentro do li (geralmente em um p) não quebre linha */
:deep(.ProseMirror li p) {
  display: inline;
  margin: 0;
}

/* ------------------------------------------------------------------
 * CSS DO CALLOUT
 * ------------------------------------------------------------------ */
:deep(.content-callout) { display: block !important; padding: 20px 25px !important; margin: 1.5em 0 0.5em 0 !important; border-radius: 8px; border-left: 5px solid; }
:deep(.callout-label-container) { display: inline-flex; align-items: center; gap: 8px; margin-right: 8px; user-select: none; }
:deep(.callout-warning) { background-color: #fffaf0 !important; border-left-color: #ff9900 !important; color: #744210 !important; }
:deep(.callout-info) { background-color: #ebf8ff !important; border-left-color: #3182ce !important; color: #2c5282 !important; }
:deep(.content-callout p) { display: inline; margin: 0; }
</style>