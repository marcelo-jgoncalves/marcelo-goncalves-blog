import Image from '@tiptap/extension-image'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import ImageNode from './ImageNode.vue'

export const SmartImage = Image.extend({
  addNodeView() {
    return VueNodeViewRenderer(ImageNode)
  },
})