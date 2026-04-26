// frontend/lib/api.ts

const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined");
}

export async function getPost(slug: string) {
  const res = await fetch(`${API_URL}/post/${slug}`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error('Failed to fetch post');
  }

  return res.json();
}
export async function getAuthor(authorId: string) {
  const res = await fetch(`${API_URL}/autor/${authorId}`, {
    next: { revalidate: 3600 }, // Cache de autor por 1 hora (muda pouco)
  });

  if (!res.ok) return null;

  return res.json();
}

// 1. Buscar Posts Recentes (Para a Home)
export async function getRecentPosts(limit: number = 6) {
  const params = new URLSearchParams();
  params.set('limit', limit.toString());
  const res = await fetch(`${API_URL}/posts/recentes?${params.toString()}`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) throw new Error('Failed to fetch recent posts');

  return res.json();
}

export async function getAllPosts(nextToken?: string, limit: number = 9) {
  const params = new URLSearchParams();
  if (nextToken) params.set('nextToken', nextToken);
  params.set('limit', limit.toString());

  const res = await fetch(`${API_URL}/artigos?${params.toString()}`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) throw new Error('Failed to fetch posts');

  return res.json(); 
}

// 3. Buscar por Categoria
export async function getPostsByCategory(slug: string, nextToken?: string, limit: number = 9) {
  const params = new URLSearchParams();
  if (nextToken) params.set('nextToken', nextToken);
  params.set('limit', limit.toString());
  const res = await fetch(`${API_URL}/categoria/${slug}?${params.toString()}`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) return null;

  return res.json();
}

// 4. Buscar Posts Populares
export async function getPopularPosts() {
  const res = await fetch(`${API_URL}/posts/populares`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    // Fallback: se a API de populares falhar ou não existir, retorna array vazio para não quebrar a home
    return { posts: [] };
  }

  return res.json();
}

// 5. Buscar Posts por Termo (Search)
export async function searchPosts(term: string, nextToken?: string, limit: number = 9) {
  const params = new URLSearchParams();
  params.set('q', term);
  if (nextToken) params.set('nextToken', nextToken);
  params.set('limit', limit.toString());

  const res = await fetch(`${API_URL}/busca?${params.toString()}`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) return { posts: [], nextToken: undefined };

  return res.json();
}

// 6. Buscar Posts do Projeto (Timeline)
export async function getProjectPosts(nextToken?: string, limit: number = 8) {
  const params = new URLSearchParams();
  if (nextToken) params.set('nextToken', nextToken);
  params.set('limit', limit.toString());

  const res = await fetch(`${API_URL}/projeto?${params.toString()}`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) return { posts: [], nextToken: undefined };

  return res.json();
}