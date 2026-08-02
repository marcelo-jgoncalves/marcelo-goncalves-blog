import type { ComputedRef } from 'vue'
import type { Editor } from '@tiptap/vue-3'
import { CALLOUT_DEFAULTS, type CalloutType } from '../components/Callout'

export function useTiptapCommands(
  editorInstance: ComputedRef<Editor | undefined>,
  emitRequestUpload: () => void,
) {
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

  const setCodeLanguage = (event: Event) => {
    const language = (event.target as HTMLSelectElement).value
    editorInstance.value?.chain().focus().updateAttributes('codeBlock', { language }).run()
  }

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

  const triggerImageUpload = () => {
    emitRequestUpload()
  }

  const insertImage = (url: string, altText: string = '') => {
    if (!editorInstance.value) return
    editorInstance.value.chain().focus().setImage({ src: url, alt: altText }).run()
  }

  const focusStart = () => {
    editorInstance.value?.chain().focus('start').run()
  }

  return {
    setLink,
    addCallout,
    editCalloutTitle,
    setPullQuote,
    editPullQuoteCite,
    setClosingFlourish,
    setHorizontalRule,
    setCodeLanguage,
    addYoutubeVideo,
    insertTable,
    triggerImageUpload,
    insertImage,
    focusStart,
  }
}

export type TiptapCommands = ReturnType<typeof useTiptapCommands>
