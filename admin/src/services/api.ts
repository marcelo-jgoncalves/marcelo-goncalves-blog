/**admin/src/services/api.ts */

import type { Post, Autor } from '../types'

// Sem prefixo por padrão: o CloudFront do admin faz proxy same-origin de
// /admin/* para o API Gateway (ver infra/modules/admin/cloudfront.tf) — a
// sessão (cookie httpOnly) viaja automaticamente com `credentials: 'include'`,
// sem precisar montar Authorization header. VITE_API_BASE_URL só é usado em
// dev local direto contra a API real (cross-origin, sem cookie de sessão
// funcionando — ver reference_admin_local_dev_env).
const API_URL = import.meta.env.VITE_API_BASE_URL ?? ''

function redirectToLogin() {
  window.location.href = '/login'
}

export async function apiCall(endpoint: string, options: RequestInit = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  }

  const res = await fetch(`${API_URL}${endpoint}`, { ...options, headers, credentials: 'include' })

  // 401 (sem sessão/Lambda authorizer lançou "Unauthorized") ou 403 (policy
  // Deny do Lambda Authorizer — cookie ausente/sessão expirada/token Bearer
  // inválido) significam a mesma coisa aqui: sessão inválida, refazer login.
  if (res.status === 401 || res.status === 403) {
    redirectToLogin()
    throw new Error('Sessão expirada')
  }

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}))
    // Em produção, não expõe detalhes de infra
    const message = import.meta.env.PROD
      ? 'Erro ao processar a solicitação'
      : errorBody.message || 'Erro na API'
    throw new Error(message)
  }

  return res.json()
}

// --- MÉTODOS EXPORTADOS ---

export const postsApi = {
  list: () => apiCall('/admin/posts'),
  get: (slug: string) => apiCall(`/admin/post/${slug}`),
  create: (data: Partial<Post>) => apiCall('/admin/posts', { method: 'POST', body: JSON.stringify(data) }),
  update: (slug: string, data: Partial<Post>) => apiCall(`/admin/post/${slug}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (slug: string) => apiCall(`/admin/post/${slug}`, { method: 'DELETE' })
}

export const mediaApi = {
  getUploadUrl: (fileName: string, fileType: string) =>
    apiCall('/admin/media/upload-url', {
      method: 'POST',
      body: JSON.stringify({ nome_arquivo: fileName, tipo_arquivo: fileType })
    }),

  // Presigned POST (não PUT): o S3 valida `content-length-range` nos `fields`
  // recebidos do backend, então o limite de tamanho é aplicado no servidor,
  // não só no client (achado AppSec, Cat. 2).
  uploadToS3: async (url: string, fields: Record<string, string>, file: File) => {
    const formData = new FormData()
    Object.entries(fields).forEach(([key, value]) => formData.append(key, value))
    formData.append('file', file)

    const res = await fetch(url, { method: 'POST', body: formData })
    if (!res.ok) throw new Error('Falha no upload para o S3')
  }
}

export const authorsApi = {
  get: (id: string) => apiCall(`/admin/autor/${id}`),
  save: (data: Partial<Autor> & { autor_id: string }) => apiCall(`/admin/autor/${data.autor_id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  })
}

export const categoriesApi = {
  list: (): Promise<{ items: Array<{ categoria_slug: string; nome: string }> }> =>
    apiCall('/admin/categorias'),
  get: (slug: string) => apiCall(`/admin/categorias/${slug}`),
  create: (data: { categoria_slug: string; nome: string; descricao?: string }) =>
    apiCall('/admin/categorias', { method: 'POST', body: JSON.stringify(data) }),
  update: (slug: string, data: { categoria_slug: string; nome: string; descricao?: string }) =>
    apiCall(`/admin/categorias/${slug}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (slug: string) =>
    apiCall(`/admin/categorias/${slug}`, { method: 'DELETE' }),
}
