// Error policy is deliberately two-tiered, not uniform:
// - Primary content of a page (getPost 5xx, getRecentPosts, getAllPosts)
//   THROWS: a broken main listing should surface the error boundary, not
//   render a page that looks legitimately empty.
// - Secondary/degradable content (populares, busca, projeto, categoria,
//   autor) returns a fallback: a widget failing must not take down the page.
// When adding a fetcher, pick the tier by asking: "is an empty result here
// indistinguishable from a bug for the reader?"

function getApiUrl(): string {
  const url = process.env.API_URL;
  if (!url) throw new Error('API_URL is not defined');
  return url;
}

// The static build fetches every published post in parallel (3 workers,
// several requests per page), which can trip API Gateway's stage throttle
// even after raising its limits (confirmed against real dev data: some
// requests came back with zero Lambda invocation at all, consistent with a
// 429 rejected upstream). A transient 429/5xx here fails the entire build,
// not just one page, so it's worth a few short retries before giving up.
async function fetchWithRetry(url: string, init: RequestInit, maxRetries = 4): Promise<Response> {
  let lastResponse: Response;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    lastResponse = await fetch(url, init);
    if (lastResponse.ok || lastResponse.status === 404) return lastResponse;
    if (lastResponse.status !== 429 && lastResponse.status < 500) return lastResponse;
    if (attempt < maxRetries) await new Promise((r) => setTimeout(r, 400 * 2 ** attempt));
  }
  return lastResponse!;
}

export async function getPost(slug: string) {
  const res = await fetchWithRetry(`${getApiUrl()}/post/${slug}`, {
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
