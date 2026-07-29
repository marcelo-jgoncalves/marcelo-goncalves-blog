import type { Post, Autor } from '../types'

// Always a relative path — never VITE_API_BASE_URL (the API Gateway's
// absolute URL) here. The admin's CloudFront does a same-origin proxy of
// /admin/* to the API Gateway (infra/modules/admin/cloudfront.tf); calling
// the absolute URL would bypass that proxy, making the call genuinely
// cross-origin — and a cross-origin request with `credentials: 'include'`
// never works with Access-Control-Allow-Origin: '*' (a requirement of the
// CORS spec itself), so the session cookie would never be sent.

function redirectToLogin() {
  window.location.href = '/login'
}

export async function apiCall(endpoint: string, options: RequestInit = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  }

  const res = await fetch(endpoint, { ...options, headers, credentials: 'include' })

  // 401 (no session/Lambda authorizer threw "Unauthorized") or 403 (Deny
  // policy from the Lambda Authorizer — missing cookie/expired session/
  // invalid Bearer token) mean the same thing here: invalid session, redo login.
  if (res.status === 401 || res.status === 403) {
    redirectToLogin()
    throw new Error('Sessão expirada')
  }

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}))
    // Don't expose infra details in production
    const message = import.meta.env.PROD
      ? 'Erro ao processar a solicitação'
      : errorBody.message || 'Erro na API'
    throw new Error(message)
  }

  return res.json()
}

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

  // Presigned POST (not PUT): S3 validates `content-length-range` against
  // the `fields` received from the backend, so the size limit is enforced
  // server-side, not only on the client.
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
