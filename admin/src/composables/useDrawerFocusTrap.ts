import { ref, nextTick, watch, type Ref } from 'vue'

// Dialog semantics (focus trap, Escape, focus restore) for an overlay panel:
// same pattern as frontend/components/consent/ConsentModal.tsx.
export function useDrawerFocusTrap(open: Ref<boolean>, panelRef: Ref<HTMLElement | null>) {
  const previousFocusRef = ref<HTMLElement | null>(null)

  watch(open, (isOpen) => {
    if (isOpen) {
      previousFocusRef.value = document.activeElement instanceof HTMLElement ? document.activeElement : null
      nextTick(() => panelRef.value?.focus())
    } else {
      previousFocusRef.value?.focus()
      previousFocusRef.value = null
    }
  })

  function onKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      open.value = false
      return
    }
    if (e.key !== 'Tab' || !panelRef.value) return
    const focusable = panelRef.value.querySelectorAll<HTMLElement>(
      'button, input, select, textarea, a[href], [tabindex]:not([tabindex="-1"])'
    )
    if (!focusable.length) return
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last?.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first?.focus()
    }
  }

  return { onKeydown }
}
