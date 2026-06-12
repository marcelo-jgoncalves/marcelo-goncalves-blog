/* Callout.ts */
import { Node, mergeAttributes } from '@tiptap/core'

export const CALLOUT_TYPES = ['info', 'warn', 'error', 'ok', 'tip'] as const
export type CalloutType = typeof CALLOUT_TYPES[number]

export const CALLOUT_DEFAULTS: Record<CalloutType, { icon: string; title: string; label: string }> = {
  info:  { icon: 'i', title: 'Saiba mais', label: 'Info' },
  warn:  { icon: '!', title: 'Atenção', label: 'Atenção' },
  error: { icon: '✕', title: 'Evite', label: 'Erro' },
  ok:    { icon: '✓', title: 'Boa prática', label: 'Boa prática' },
  tip:   { icon: '!', title: 'Dica de bastidor', label: 'Dica' },
}

function normalizeType(type: unknown): CalloutType {
  const value = String(type || 'info').toLowerCase()
  if (value === 'warning') return 'warn' // alias legado (sessões < 37)
  return (CALLOUT_TYPES as readonly string[]).includes(value) ? (value as CalloutType) : 'info'
}

export const Callout = Node.create({
  name: 'callout',
  group: 'block',
  content: 'inline*',
  defining: true,
  isolating: true,

  addAttributes() {
    return {
      type: { default: 'info', renderHTML: () => ({}) },
      title: { default: null, renderHTML: () => ({}) },
    }
  },

  parseHTML() {
    return [
      {
        // Formato atual (redesign 2026 — specs/ESPECIFICACAO-POSTAGEM.md)
        tag: 'div.callout, div.tip',
        contentElement: (node) => (node as HTMLElement).querySelector('.c p') || node,
        getAttrs: (node) => {
          const el = node as HTMLElement
          let type: CalloutType = 'tip'
          if (el.classList.contains('callout')) {
            const match = el.className.match(/\b(info|warn|error|ok)\b/)
            type = normalizeType(match ? match[1] : 'info')
          }
          const titleEl = el.querySelector('.t')
          return { type, title: titleEl?.textContent?.trim() || null }
        },
      },
      {
        // Formato legado (sessões 16-36) — div.content-callout.callout-{type}
        tag: 'div.content-callout',
        contentElement: (node) => (node as HTMLElement).querySelector('.callout-content-area') || node,
        getAttrs: (node) => {
          const el = node as HTMLElement
          const match = el.className.match(/callout-(\w+)/)
          const titleEl = el.querySelector('.callout-label-container strong')
          return { type: normalizeType(match?.[1]), title: titleEl?.textContent?.trim() || null }
        },
      },
    ]
  },

  renderHTML({ node, HTMLAttributes }) {
    const type = normalizeType(node.attrs.type)
    const config = CALLOUT_DEFAULTS[type]
    const title = node.attrs.title || config.title
    const wrapperClass = type === 'tip' ? 'tip' : `callout ${type}`

    return [
      'div',
      mergeAttributes(HTMLAttributes, { class: wrapperClass }),
      ['div', { class: 'ic', contenteditable: 'false' }, config.icon],
      [
        'div',
        { class: 'c' },
        ['div', { class: 't', contenteditable: 'false' }, title],
        ['p', {}, 0],
      ],
    ]
  },
})
