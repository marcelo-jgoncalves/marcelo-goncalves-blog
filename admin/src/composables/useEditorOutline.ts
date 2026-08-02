import { ref, nextTick, watch, type Ref } from 'vue'

export type OutlineItem = { id: string; text: string; level: 2 | 3 }

// Side outline — rebuilt from the H2/H3 actually rendered in Tiptap,
// assigning sequential ids (iah-0, iah-1…) to enable scroll-to-heading.
export function useEditorOutline(editorWrapperRef: Ref<HTMLElement | null>, contentHtml: Ref<string>) {
  const outline = ref<OutlineItem[]>([])

  function refreshOutline() {
    nextTick(() => {
      const root = editorWrapperRef.value
      if (!root) return
      const heads = root.querySelectorAll('.tiptap-content .ProseMirror h2, .tiptap-content .ProseMirror h3')
      const list: OutlineItem[] = []
      heads.forEach((el, i) => {
        const id = 'iah-' + i
        el.id = id
        list.push({ id, text: el.textContent?.trim() || '(sem título)', level: el.tagName === 'H2' ? 2 : 3 })
      })
      outline.value = list
    })
  }

  watch(contentHtml, refreshOutline)

  function scrollToHeading(id: string) {
    const el = document.getElementById(id)
    if (!el) return
    const y = el.getBoundingClientRect().top + window.scrollY - 92
    window.scrollTo({ top: y, behavior: 'smooth' })
  }

  return { outline, refreshOutline, scrollToHeading }
}
