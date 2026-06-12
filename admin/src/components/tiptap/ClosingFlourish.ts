/* admin/src/components/tiptap/ClosingFlourish.ts */
import { Node, mergeAttributes } from '@tiptap/core'

export const ClosingFlourish = Node.create({
  name: 'closingFlourish',
  group: 'block',
  content: 'block+',
  defining: true,
  isolating: true,

  parseHTML() {
    return [{ tag: 'div.closing' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { class: 'closing' }), 0]
  },
})
