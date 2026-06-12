/* admin/src/components/tiptap/PullQuote.ts */
import { Node, mergeAttributes } from '@tiptap/core'

export const PullQuote = Node.create({
  name: 'pullQuote',
  group: 'block',
  content: 'inline*',
  defining: true,
  isolating: true,

  addAttributes() {
    return {
      cite: { default: null, renderHTML: () => ({}) },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div.pull',
        contentElement: (node) => (node as HTMLElement).querySelector('p') || node,
        getAttrs: (node) => {
          const citeEl = (node as HTMLElement).querySelector('.cite')
          return { cite: citeEl?.textContent?.trim() || null }
        },
      },
    ]
  },

  renderHTML({ node, HTMLAttributes }) {
    const cite = node.attrs.cite
      ? [['div', { class: 'cite', contenteditable: 'false' }, node.attrs.cite]]
      : []
    return ['div', mergeAttributes(HTMLAttributes, { class: 'pull' }), ['p', {}, 0], ...cite]
  },
})
