// frontend/lib/api.ts

const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined");
}

export async function getPost(slug: string) {
  // O next: { revalidate: 60 } ativa o ISR (Incremental Static Regeneration)
  // Isso significa que a página será cacheada por 60 segundos na borda.
  const res = await fetch(`${API_URL}/post/${slug}`, {
    next: { revalidate: 60 }, 
  });

  if (!res.ok) {
    // Retorna null se der 404, para tratarmos na página
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
export async function getRecentPosts() {
  const res = await fetch(`${API_URL}/posts/recentes`, {
    next: { revalidate: 60 }, // Cache ISR de 60s
  });

  if (!res.ok) throw new Error('Failed to fetch recent posts');

  return res.json(); // Retorna { posts: [...] }
}

// 2. Buscar Todos os Posts (Para /artigos)
export async function getAllPosts(nextToken?: string) {
  const query = nextToken ? `?nextToken=${nextToken}` : '';
  const res = await fetch(`${API_URL}/artigos${query}`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) throw new Error('Failed to fetch posts');

  return res.json(); // Retorna { posts: [...], nextToken: "..." }
}

// 3. Buscar por Categoria
export async function getPostsByCategory(slug: string, nextToken?: string) {
  const query = nextToken ? `?nextToken=${nextToken}` : '';
  const res = await fetch(`${API_URL}/categoria/${slug}${query}`, {
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