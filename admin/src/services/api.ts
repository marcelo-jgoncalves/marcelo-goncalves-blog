/**admin/src/services/api.ts */

import { fetchAuthSession } from 'aws-amplify/auth'

const API_URL = import.meta.env.VITE_API_BASE_URL

if (!API_URL) console.error('VITE_API_BASE_URL não definida!')

export async function apiCall(endpoint: string, options: RequestInit = {}) {
  const session = await fetchAuthSession()
  const token = session.tokens?.idToken?.toString()

  if (!token) throw new Error('Usuário não autenticado')

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    ...(options.headers || {})
  }

  const res = await fetch(`${API_URL}${endpoint}`, { ...options, headers })

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}))
    throw new Error(errorBody.message || 'Erro na API')
  }

  return res.json()
}

// --- MÉTODOS EXPORTADOS ---

export const postsApi = {
  list: () => apiCall('/admin/posts'),
  
  get: (slug: string) => apiCall(`/admin/post/${slug}`),
  
  create: (data: any) => apiCall('/admin/posts', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  
  update: (slug: string, data: any) => apiCall(`/admin/post/${slug}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),

  delete: (slug: string) => apiCall(`/admin/post/${slug}`, {
    method: 'DELETE'
  })
}

export const mediaApi = {
  // 1. Pede a URL assinada para a nossa API
  getUploadUrl: (fileName: string, fileType: string) => 
    apiCall('/admin/media/upload-url', {
      method: 'POST',
      body: JSON.stringify({ nome_arquivo: fileName, tipo_arquivo: fileType })
    }),

  // 2. Faz o upload direto para o S3 (sem Auth Header, pois a URL já tem a assinatura)
  uploadToS3: async (presignedUrl: string, file: File) => {
    const res = await fetch(presignedUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type
      }
    })
    if (!res.ok) throw new Error('Falha no upload para o S3')
  }
}

export const authorsApi = {
  // Busca autor pelo ID
  get: (id: string) => apiCall(`/admin/autor/${id}`),

  // Salva ou atualiza autor
  // Usamos PUT na rota /admin/autor/{id} conforme configurado no Terraform
  save: (data: any) => apiCall(`/admin/autor/${data.autor_id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  })
}

export const categoriesApi = {
  // Lista todas as categorias
  list: () => apiCall('/admin/categorias'),
  
  // Busca uma categoria específica
  get: (slug: string) => apiCall(`/admin/categorias/${slug}`),
  
  // Cria uma nova categoria
  create: (data: any) => apiCall('/admin/categorias', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  
  // Atualiza uma categoria existente
  update: (slug: string, data: any) => apiCall(`/admin/categorias/${slug}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),

  // Deleta uma categoria
  delete: (slug: string) => apiCall(`/admin/categorias/${slug}`, {
    method: 'DELETE'
  })
}