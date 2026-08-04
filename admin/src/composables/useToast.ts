import { ref } from 'vue'

export type ToastType = 'success' | 'error' | 'warning'

const DURATION_MS = 2600

/**
 * Toast shared across admin views. Each caller has its own state (not a
 * singleton): this only centralizes the timing, preventing a second toast
 * from firing the first one's timeout and closing the wrong message early.
 */
export function useToast() {
  const toast = ref<{ message: string; type: ToastType } | null>(null)
  let timer: ReturnType<typeof setTimeout> | null = null

  function showToast(message: string, type: ToastType = 'success') {
    if (timer) clearTimeout(timer)
    toast.value = { message, type }
    timer = setTimeout(() => {
      toast.value = null
      timer = null
    }, DURATION_MS)
  }

  return { toast, showToast }
}
