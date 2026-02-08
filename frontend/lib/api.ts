// frontend/lib/api.ts

const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined");
}

export async function getPost(slug: string) {
  // 🚨 DEBUG MODE: cache: 'no-store'
  // Isso força o fetch a bater na API real toda vez.
  // Ignora o cache de dados do Next.js.
  const res = await fetch(`${API_URL}/post/${slug}`, {
    cache: 'no-store', 
    // next: { revalidate: 60 }, <--- Comentado para Debug
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

// 5. Buscar Posts por Termo (Search)
export async function searchPosts(term: string, nextToken?: string) {
  // Constrói a Query String: ?q=termo&nextToken=...
  const params = new URLSearchParams();
  params.set('q', term);
  if (nextToken) {
    params.set('nextToken', nextToken);
  }

  // Busca na API (Endpoint definido no Blueprint seção 6.1)
  const res = await fetch(`${API_URL}/busca?${params.toString()}`, {
    // Busca geralmente não deve ser cacheada por muito tempo, 
    // mas 60s evita DDoS se alguém spammar F5
    next: { revalidate: 60 }, 
  });

  if (!res.ok) {
    // Se a busca falhar ou não retornar nada, retornamos array vazio para não quebrar a UI
    return { posts: [], nextToken: undefined };
  }

  return res.json(); // Retorna { termo_busca: "...", posts: [...], nextToken: "..." }
}

// 6. Buscar Posts do Projeto (Timeline)
export async function getProjectPosts(nextToken?: string) {
  const params = new URLSearchParams();
  if (nextToken) params.set('nextToken', nextToken);

  // Endpoint definido no Blueprint v1.7
  const res = await fetch(`${API_URL}/projeto?${params.toString()}`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) return { posts: [], nextToken: undefined };

  return res.json();
}