<script setup lang="ts">
import { watch, computed } from 'vue'
import { useEditor, EditorContent, type Editor } from '@tiptap/vue-3'
import { buildTiptapExtensions } from '../composables/useTiptapExtensions'
import { useTiptapCommands } from '../composables/useTiptapCommands'
import EditorToolbar from './tiptap/EditorToolbar.vue'
import EditorBubbleMenus from './tiptap/EditorBubbleMenus.vue'
import EditorFloatingMenu from './tiptap/EditorFloatingMenu.vue'

const props = defineProps<{ modelValue: string; hideToolbar?: boolean }>()
const emit = defineEmits<{(e: 'update:modelValue', v: string): void,(e: 'request-upload'): void }>()

const editorRef = useEditor({
  content: props.modelValue,
  extensions: buildTiptapExtensions(() => emit('request-upload')),
  editorProps: {
    attributes: {
      class: 'tiptap-inner-editor focus:outline-none',
    },
  },
  onUpdate: ({ editor }) => {
    emit('update:modelValue', editor.getHTML())
  },
})

const editorInstance = computed(() => editorRef.value as Editor | undefined)
const commands = useTiptapCommands(editorInstance, () => emit('request-upload'))

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

defineExpose({
  insertImage: commands.insertImage,
  focusStart: commands.focusStart,
})
</script>

<template>
  <div class="tiptap-editor-container" :class="{ 'tiptap-editor-container--bare': hideToolbar }">
    <EditorToolbar v-if="editorInstance && !hideToolbar" :editor="editorInstance" :commands="commands" />

    <EditorBubbleMenus v-if="editorInstance" :editor="editorInstance" :commands="commands" />
    <EditorFloatingMenu v-if="editorInstance" :editor="editorInstance" :commands="commands" />

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

.tiptap-editor-container--bare {
  border: none;
  background: transparent;
}
.tiptap-editor-container--bare .tiptap-content :deep(.ProseMirror) {
  padding: 0;
  min-height: 40vh;
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

/* ===================================================================
   TABLE LAYOUT FIX
   Strategy: inline* schema (see CustomTableCell/CustomTableHeader in
   useTiptapExtensions.ts) + fixed-layout CSS
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
