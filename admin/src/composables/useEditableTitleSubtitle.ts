import type { Ref } from 'vue'

// Title / Subtitle — contenteditable, synced via innerText only when the
// open post changes (never on every keystroke, to avoid resetting the cursor).
export function useEditableTitleSubtitle(
  titleRef: Ref<HTMLElement | null>,
  subtitleRef: Ref<HTMLElement | null>,
  options: {
    getSyncKey: () => string
    getTitle: () => string
    getSubtitle: () => string
    onTitleInput: (text: string) => void
    onSubtitleInput: (text: string) => void
    onSubtitleEnter: () => void
  },
) {
  let syncedKey = ''

  function syncTitleSubtitleDom() {
    const key = options.getSyncKey()
    if (syncedKey === key) return
    syncedKey = key
    if (titleRef.value) titleRef.value.innerText = options.getTitle() || ''
    if (subtitleRef.value) subtitleRef.value.innerText = options.getSubtitle() || ''
  }

  function onTitleInput() {
    options.onTitleInput(titleRef.value?.innerText || '')
  }
  function onSubtitleInput() {
    options.onSubtitleInput(subtitleRef.value?.innerText || '')
  }
  function onTitleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      e.preventDefault()
      subtitleRef.value?.focus()
    }
  }
  function onSubtitleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      e.preventDefault()
      options.onSubtitleEnter()
    }
  }

  return { syncTitleSubtitleDom, onTitleInput, onSubtitleInput, onTitleKeydown, onSubtitleKeydown }
}
