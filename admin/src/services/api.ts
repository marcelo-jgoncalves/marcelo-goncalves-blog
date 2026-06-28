/**admin/src/services/api.ts */

import { fetchAuthSession, signOut } from 'aws-amplify/auth'
import type { Post, Autor } from '../types'

const API_URL = import.meta.env.VITE_API_BASE_URL

if (import.meta.env.DEV && !API_URL) console.error('VITE_API_BASE_URL não definida!')

async function getToken(forceRefresh = false): Promise<string> {
  const session = await fetchAuthSession({ forceRefresh })
  const token = session.tokens?.idToken?.toString()
  if (!token) throw new Error('Sessão inválida')
  return token
}

async function redirectToLogin() {
  await signOut().catch(() => {})
  window.location.href = '/login'
}

export async function apiCall(endpoint: string, options: RequestInit = {}) {
  let token: string
  try {
    token = await getToken()
  } catch {
    await redirectToLogin()
    throw new Error('Sessão expirada')
  }

  const makeRequest = async (authToken: string) => {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`,
      ...(options.headers || {})
    }
    return fetch(`${API_URL}${endpoint}`, { ...options, headers })
  }

  let res = await makeRequest(token)

  // Token expirou no servidor — tenta refresh uma vez
  if (res.status === 401) {
    try {
      token = await getToken(true)
      res = await makeRequest(token)
    } catch {
      await redirectToLogin()
      throw new Error('Sessão expirada')
    }
    // Ainda 401 após refresh: sessão inválida
    if (res.status === 401) {
      await redirectToLogin()
      throw new Error('Sessão expirada')
    }
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
