<script setup lang="ts">
import { onMounted, ref, watch, nextTick } from 'vue'
import Quill from 'quill'
import 'quill/dist/quill.snow.css'

const Block = Quill.import('blots/block') as any
const Parchment = Quill.import('parchment') as any

class CalloutBlot extends Block {
  static blotName = 'callout'
  static tagName = 'div'
  static className = 'content-callout'
  static scope = Parchment.Scope.BLOCK

  static create(value: 'info' | 'warning') {
  const node = super.create() as HTMLElement
  node.classList.add(`callout-${value}`)
  node.setAttribute('data-type', value)
  node.setAttribute('contenteditable', 'true')

  const icon = value === 'info' ? 'ℹ️' : '⚠️'
  const label = value === 'info' ? 'Dica!' : 'Atenção!'

  // Estrutura simplificada para evitar que o Quill injete <p> com margens
  node.innerHTML = `
    <span class="callout-label-container" contenteditable="false">
      <span class="callout-icon">${icon}</span>
      <strong>${label}</strong>
    </span>
  `.trim()

  return node
}
  static formats(node: HTMLElement) {
    return node.getAttribute('data-type')
  }
}

Quill.register('formats/callout', CalloutBlot)

const props = defineProps<{ modelValue: string }>()
const emit = defineEmits<{ (e: 'update:modelValue', v: string): void }>()

const editorContainer = ref<HTMLDivElement | null>(null)
let quill: Quill | null = null

onMounted(async () => {
  await nextTick()
  if (!editorContainer.value) return

  quill = new Quill(editorContainer.value, {
    theme: 'snow',
    modules: {
      toolbar: {
        container: [
          [{ header: [2, 3, false] }],
          ['bold', 'italic', 'underline'],
          ['link', 'image'],
          ['info-callout', 'warning-callout'],
          ['clean']
        ],
        handlers: {
          'info-callout': () => insertCallout('info'),
          'warning-callout': () => insertCallout('warning')
        }
      }
    }
  })

  if (props.modelValue) {
    quill.root.innerHTML = props.modelValue
  }

  quill.on('text-change', () => {
    if (!quill) return
    const html = quill.root.innerHTML
    const cleanHtml = html.replace(/\s?contenteditable="true"/g, '')
    emit('update:modelValue', cleanHtml)
  })
})

function insertCallout(type: 'info' | 'warning') {
  if (!quill) return
  const range = quill.getSelection(true)
  const index = range ? range.index : quill.getLength()
  quill.insertEmbed(index, 'callout', type, 'user')
  
  // Garantia sênior: foca na coluna da direita após inserir
  setTimeout(() => {
    quill?.setSelection(index + 1, 0)
  }, 50)
}

watch(
  () => props.modelValue,
  (nv) => {
    if (quill && nv !== quill.root.innerHTML) {
      quill.root.innerHTML = nv || ''
    }
  }
)
</script>

<template>
  <div class="quill-wrapper-final">
    <div ref="editorContainer"></div>
  </div>
</template>

<style scoped>
.quill-wrapper-final {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
}

:deep(.ql-editor) {
  min-height: 500px;
  font-family: Inter, sans-serif;
}

/* ------------------------------------------------------------------
 * CALLOUT - SISTEMA DE COLUNAS (FIEL AO PROTÓTIPO)
 * ------------------------------------------------------------------ */
:deep(.content-callout) {
  display: flex !important; /* Colunas reais */
  gap: 15px; /* Espaço entre ícone/label e o texto */
  padding: 20px 25px;
  margin: 1.25em 0;
  border-radius: 8px;
  border-left: 5px solid;
  align-items: flex-start;
}

/* Coluna da Esquerda: Estática */
:deep(.callout-column-left) {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0; /* Impede que o ícone seja espremido */
  user-select: none;
  white-space: nowrap;
  margin-top: 2px; /* Alinhamento fino com a linha do texto */
}

/* Coluna da Direita: Editável */
:deep(.callout-column-right) {
  flex: 1; /* Ocupa todo o resto do espaço */
  min-height: 24px;
  outline: none;
}

/* Ajuste para quando o Quill injeta parágrafos */
:deep(.callout-column-right p) {
  margin: 0;
  display: inline;
}

/* CORES (Sincronizadas com o Protótipo) */
:deep(.callout-info) {
  background: #ebf8ff;
  border-left-color: #3182ce;
  color: #2c5282;
}
:deep(.callout-info .callout-column-left) {
  color: #3182ce;
}

:deep(.callout-warning) {
  background: #fffaf0;
  border-left-color: #ff9900;
  color: #744210;
}
:deep(.callout-warning .callout-column-left) {
  color: #ff9900;
}

/* TOOLBAR ICONS */
:deep(.ql-info-callout::before) { content: 'ℹ️'; }
:deep(.ql-warning-callout::before) { content: '⚠️'; }
</style>