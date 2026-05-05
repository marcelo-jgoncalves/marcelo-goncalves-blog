// frontend/lib/api.ts

function getApiUrl(): string {
  const url = process.env.API_URL;
  if (!url) throw new Error('API_URL is not defined');
  return url;
}

export async function getPost(slug: string) {
  const res = await fetch(`${getApiUrl()}/post/${slug}`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error('Failed to fetch post');
  }

  return res.json();
}

export async function getAuthor(authorId: string) {
  const res = await fetch(`${getApiUrl()}/autor/${authorId}`, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) return null;

  return res.json();
}

export async function getRecentPosts(limit: number = 6) {
  const params = new URLSearchParams();
  params.set('limit', limit.toString());
  const res = await fetch(`${getApiUrl()}/posts/recentes?${params.toString()}`, {
    next: { revalidate: 300 },
  });

  if (!res.ok) throw new Error('Failed to fetch recent posts');

  return res.json();
}

export async function getAllPosts(nextToken?: string, limit: number = 9) {
  const params = new URLSearchParams();
  if (nextToken) params.set('nextToken', nextToken);
  params.set('limit', limit.toString());

  const res = await fetch(`${getApiUrl()}/artigos?${params.toString()}`, {
    next: { revalidate: 300 },
  });

  if (!res.ok) throw new Error('Failed to fetch posts');

  return res.json();
}

export async function getPostsByCategory(slug: string, nextToken?: string, limit: number = 9) {
  const params = new URLSearchParams();
  if (nextToken) params.set('nextToken', nextToken);
  params.set('limit', limit.toString());
  const res = await fetch(`${getApiUrl()}/categoria/${slug}?${params.toString()}`, {
    next: { revalidate: 300 },
  });

  if (!res.ok) return null;

  return res.json();
}

export async function getPopularPosts(limit: number = 6) {
  const params = new URLSearchParams();
  params.set('limit', limit.toString());
  const res = await fetch(`${getApiUrl()}/posts/populares?${params.toString()}`, {
    next: { revalidate: 300 },
  });

  if (!res.ok) return { posts: [] };

  return res.json();
}

export async function searchPosts(term: string, nextToken?: string, limit: number = 9) {
  const params = new URLSearchParams();
  params.set('q', term);
  if (nextToken) params.set('nextToken', nextToken);
  params.set('limit', limit.toString());

  const res = await fetch(`${getApiUrl()}/busca?${params.toString()}`, {
    next: { revalidate: 300 },
  });

  if (!res.ok) return { posts: [], nextToken: undefined };

  return res.json();
}

export async function getProjectPosts(nextToken?: string, limit: number = 8) {
  const params = new URLSearchParams();
  if (nextToken) params.set('nextToken', nextToken);
  params.set('limit', limit.toString());

  const res = await fetch(`${getApiUrl()}/projeto?${params.toString()}`, {
    next: { revalidate: 300 },
  });

  if (!res.ok) return { posts: [], nextToken: undefined };

  return res.json();
}
