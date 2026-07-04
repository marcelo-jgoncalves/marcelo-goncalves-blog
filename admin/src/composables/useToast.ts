import { ref } from 'vue'

export type ToastType = 'success' | 'error' | 'warning'

const DURATION_MS = 2600

/**
 * Toast compartilhado entre as views do admin. Cada chamador tem seu próprio
 * estado (não é singleton) — só centraliza o timing e evita que um segundo
 * toast dispare o timeout do primeiro e feche a mensagem errada antes da hora.
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
