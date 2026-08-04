import { Extension } from '@tiptap/core'
import Suggestion, { type SuggestionOptions } from '@tiptap/suggestion'
import { VueRenderer } from '@tiptap/vue-3'
import tippy, { type Instance as TippyInstance } from 'tippy.js'
import SlashCommandList from './SlashCommandList.vue'
import type { CalloutType } from '../Callout'
import type { Editor, Range } from '@tiptap/core'

export interface SlashCommandItem {
  title: string
  icon: string
  keywords: string[]
  command: (args: { editor: Editor; range: Range }) => void
}

function insertCallout(type: CalloutType) {
  return ({ editor, range }: { editor: Editor; range: Range }) => {
    editor
      .chain()
      .focus()
      .deleteRange(range)
      .insertContent({
        type: 'callout',
        attrs: { type },
        content: [{ type: 'text', text: `Escreva aqui o conteúdo do callout.` }],
      })
      .run()
  }
}

// Mirrors the blocks already reachable via the fixed toolbar and the
// floating-menu (RichTextEditor.vue): same insertion behavior, just
// reachable by typing "/" instead of clicking. Image upload is the one
// exception: it needs the parent Vue component's file picker, wired in via
// the onRequestImage option below rather than duplicated here.
export function buildSlashCommandItems(onRequestImage: () => void): SlashCommandItem[] {
  return [
    {
      title: 'Título 2',
      icon: 'fas fa-heading',
      keywords: ['h2', 'titulo', 'título', 'heading'],
      command: ({ editor, range }) => editor.chain().focus().deleteRange(range).setNode('heading', { level: 2 }).run(),
    },
    {
      title: 'Título 3',
      icon: 'fas fa-heading',
      keywords: ['h3', 'titulo', 'título', 'heading'],
      command: ({ editor, range }) => editor.chain().focus().deleteRange(range).setNode('heading', { level: 3 }).run(),
    },
    {
      title: 'Lista com marcadores',
      icon: 'fas fa-list-ul',
      keywords: ['lista', 'bullet', 'marcadores'],
      command: ({ editor, range }) => editor.chain().focus().deleteRange(range).toggleBulletList().run(),
    },
    {
      title: 'Lista numerada',
      icon: 'fas fa-list-ol',
      keywords: ['lista', 'numerada', 'ordered'],
      command: ({ editor, range }) => editor.chain().focus().deleteRange(range).toggleOrderedList().run(),
    },
    {
      title: 'Bloco de código',
      icon: 'fas fa-code',
      keywords: ['codigo', 'código', 'code'],
      command: ({ editor, range }) => editor.chain().focus().deleteRange(range).toggleCodeBlock().run(),
    },
    {
      title: 'Citação',
      icon: 'fas fa-quote-right',
      keywords: ['citacao', 'citação', 'quote', 'blockquote'],
      command: ({ editor, range }) => editor.chain().focus().deleteRange(range).toggleBlockquote().run(),
    },
    {
      title: 'Inserir imagem',
      icon: 'fas fa-image',
      keywords: ['imagem', 'image', 'foto'],
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).run()
        onRequestImage()
      },
    },
    {
      title: 'Inserir tabela',
      icon: 'fas fa-table',
      keywords: ['tabela', 'table'],
      command: ({ editor, range }) =>
        editor.chain().focus().deleteRange(range).insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(),
    },
    {
      title: 'Inserir vídeo do YouTube',
      icon: 'fab fa-youtube',
      keywords: ['youtube', 'video', 'vídeo'],
      command: ({ editor, range }) => {
        const url = window.prompt('Cole a URL do YouTube:')
        editor.chain().focus().deleteRange(range).run()
        if (url) editor.commands.setYoutubeVideo({ src: url })
      },
    },
    {
      title: 'Callout: Saiba mais',
      icon: 'fas fa-circle-info',
      keywords: ['callout', 'info', 'saiba mais'],
      command: insertCallout('info'),
    },
    {
      title: 'Callout: Atenção',
      icon: 'fas fa-triangle-exclamation',
      keywords: ['callout', 'atencao', 'atenção', 'warn'],
      command: insertCallout('warn'),
    },
    {
      title: 'Callout: Evite',
      icon: 'fas fa-circle-xmark',
      keywords: ['callout', 'evite', 'error'],
      command: insertCallout('error'),
    },
    {
      title: 'Callout: Boa prática',
      icon: 'fas fa-circle-check',
      keywords: ['callout', 'boa pratica', 'boa prática', 'ok'],
      command: insertCallout('ok'),
    },
    {
      title: 'Callout: Dica de bastidor',
      icon: 'fas fa-lightbulb',
      keywords: ['callout', 'dica', 'tip'],
      command: insertCallout('tip'),
    },
    {
      title: 'Citação em destaque',
      icon: 'fas fa-quote-left',
      keywords: ['pullquote', 'destaque', 'citacao'],
      command: ({ editor, range }) =>
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .insertContent({
            type: 'pullQuote',
            content: [{ type: 'text', text: 'Escreva a citação em destaque aqui.' }],
          })
          .run(),
    },
    {
      title: 'Bloco de encerramento',
      icon: 'fas fa-flag-checkered',
      keywords: ['encerramento', 'closing', 'conclusao', 'conclusão'],
      command: ({ editor, range }) =>
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .insertContent({
            type: 'closingFlourish',
            content: [
              { type: 'heading', attrs: { level: 3 }, content: [{ type: 'text', text: 'Pronto para começar?' }] },
              { type: 'paragraph', content: [{ type: 'text', text: 'Escreva aqui a conclusão do artigo.' }] },
            ],
          })
          .run(),
    },
    {
      title: 'Divisor horizontal',
      icon: 'fas fa-minus',
      keywords: ['divisor', 'linha', 'hr', 'horizontal'],
      command: ({ editor, range }) => editor.chain().focus().deleteRange(range).setHorizontalRule().run(),
    },
    {
      title: 'Link',
      icon: 'fas fa-link',
      keywords: ['link', 'url'],
      command: ({ editor, range }) => {
        const url = window.prompt('URL do Link:')
        editor.chain().focus().deleteRange(range).run()
        if (url) {
          const finalUrl = url.startsWith('http') ? url : `https://${url}`
          editor.chain().focus().extendMarkRange('link').setLink({ href: finalUrl }).run()
        }
      },
    },
  ]
}

export const SlashCommand = Extension.create<{ onRequestImage: () => void }>({
  name: 'slashCommand',

  addOptions() {
    return {
      onRequestImage: () => {},
    }
  },

  addProseMirrorPlugins() {
    const items = buildSlashCommandItems(this.options.onRequestImage)

    const suggestion: Omit<SuggestionOptions<SlashCommandItem>, 'editor'> = {
      char: '/',
      startOfLine: false,
      items: ({ query }) => {
        const q = query.trim().toLowerCase()
        if (!q) return items
        return items.filter(
          (item) => item.title.toLowerCase().includes(q) || item.keywords.some((k) => k.includes(q)),
        )
      },
      command: ({ editor, range, props }) => {
        ;(props as SlashCommandItem).command({ editor, range })
      },
      render: () => {
        let component: VueRenderer
        let popup: TippyInstance[]

        return {
          onStart: (props) => {
            component = new VueRenderer(SlashCommandList, {
              props,
              editor: props.editor,
            })
            if (!props.clientRect) return

            popup = tippy('body', {
              getReferenceClientRect: props.clientRect as () => DOMRect,
              appendTo: () => document.body,
              content: component.element as Element,
              showOnCreate: true,
              interactive: true,
              trigger: 'manual',
              placement: 'bottom-start',
            })
          },
          onUpdate: (props) => {
            component.updateProps(props)
            if (!props.clientRect) return
            popup[0]?.setProps({ getReferenceClientRect: props.clientRect as () => DOMRect })
          },
          onKeyDown: (props) => {
            if (props.event.key === 'Escape') {
              popup[0]?.hide()
              return true
            }
            return (component.ref as { onKeyDown: (e: KeyboardEvent) => boolean })?.onKeyDown(props.event) ?? false
          },
          onExit: () => {
            popup?.[0]?.destroy()
            component?.destroy()
          },
        }
      },
    }

    return [Suggestion({ editor: this.editor, ...suggestion })]
  },
})
