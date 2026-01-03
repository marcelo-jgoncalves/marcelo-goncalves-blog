import { Node, mergeAttributes } from '@tiptap/core'

export const Callout = Node.create({
  name: 'callout',
  group: 'block',
  content: 'inline*', 
  defining: true,

  addAttributes() {
    return {
      type: { default: 'info' },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type]',
        contentElement: '.callout-content-area', // Crucial para evitar duplicação
        getAttrs: node => ({ type: (node as HTMLElement).getAttribute('data-type') }),
      },
    ]
  },

  renderHTML({ node, HTMLAttributes }) {
    const type = node.attrs.type
    const icon = type === 'info' ? 'ℹ️' : '⚠️'
    const label = type === 'info' ? 'Dica!' : 'Atenção!'

    return [
      'div', 
      mergeAttributes(HTMLAttributes, { class: `content-callout callout-${type}`, 'data-type': type }),
      [
        'span', 
        { class: 'callout-label-container', contenteditable: 'false' }, 
        ['span', { class: 'callout-icon' }, icon],
        ['strong', {}, label]
      ],
      ['span', { class: 'callout-content-area' }, 0]
    ]
  },
})