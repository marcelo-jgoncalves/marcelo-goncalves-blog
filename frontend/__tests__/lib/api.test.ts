import {
  getPost,
  getAuthor,
  getRecentPosts,
  getAllPosts,
  getPostsByCategory,
  getPopularPosts,
  searchPosts,
  getProjectPosts,
} from '../../lib/api';

const BASE = 'https://test-api.example.com/v1';

function mockFetch(status: number, body: unknown) {
  global.fetch = jest.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(body),
  } as Response);
}

afterEach(() => jest.resetAllMocks());

// ─── getPost ──────────────────────────────────────────────────────────────────

describe('getPost', () => {
  it('fetches correct URL', async () => {
    mockFetch(200, { slug: 'my-post' });
    await getPost('my-post');
    expect(fetch).toHaveBeenCalledWith(`${BASE}/post/my-post`, expect.any(Object));
  });

  it('returns data on success', async () => {
    mockFetch(200, { slug: 'my-post', titulo: 'Title' });
    const result = await getPost('my-post');
    expect(result).toEqual({ slug: 'my-post', titulo: 'Title' });
  });

  it('returns null on 404', async () => {
    mockFetch(404, null);
    const result = await getPost('not-found');
    expect(result).toBeNull();
  });

  it('throws on non-404 error', async () => {
    mockFetch(500, null);
    await expect(getPost('err')).rejects.toThrow('Failed to fetch post');
  });

  it('uses revalidate: 60', async () => {
    mockFetch(200, {});
    await getPost('slug');
    expect(fetch).toHaveBeenCalledWith(expect.any(String), { next: { revalidate: 60 } });
  });
});

// ─── getAuthor ────────────────────────────────────────────────────────────────

describe('getAuthor', () => {
  it('fetches correct URL', async () => {
    mockFetch(200, { autor_id: 'abc' });
    await getAuthor('abc');
    expect(fetch).toHaveBeenCalledWith(`${BASE}/autor/abc`, expect.any(Object));
  });

  it('returns null on error', async () => {
    mockFetch(404, null);
    const result = await getAuthor('missing');
    expect(result).toBeNull();
  });

  it('uses revalidate: 3600', async () => {
    mockFetch(200, {});
    await getAuthor('id');
    expect(fetch).toHaveBeenCalledWith(expect.any(String), { next: { revalidate: 3600 } });
  });
});

// ─── getRecentPosts ───────────────────────────────────────────────────────────

describe('getRecentPosts', () => {
  it('sends default limit=6', async () => {
    mockFetch(200, { posts: [] });
    await getRecentPosts();
    const url = (fetch as jest.Mock).mock.calls[0][0] as string;
    expect(url).toContain('limit=6');
  });

  it('sends custom limit', async () => {
    mockFetch(200, { posts: [] });
    await getRecentPosts(3);
    expect((fetch as jest.Mock).mock.calls[0][0]).toContain('limit=3');
  });

  it('calls /posts/recentes endpoint', async () => {
    mockFetch(200, { posts: [] });
    await getRecentPosts();
    expect((fetch as jest.Mock).mock.calls[0][0]).toContain('/posts/recentes');
  });

  it('throws on error', async () => {
    mockFetch(500, null);
    await expect(getRecentPosts()).rejects.toThrow('Failed to fetch recent posts');
  });
});

// ─── getAllPosts ──────────────────────────────────────────────────────────────

describe('getAllPosts', () => {
  it('calls /artigos with default limit=9', async () => {
    mockFetch(200, { posts: [] });
    await getAllPosts();
    const url = (fetch as jest.Mock).mock.calls[0][0] as string;
    expect(url).toContain('/artigos');
    expect(url).toContain('limit=9');
  });

  it('includes nextToken when provided', async () => {
    mockFetch(200, { posts: [] });
    await getAllPosts('tok123');
    expect((fetch as jest.Mock).mock.calls[0][0]).toContain('nextToken=tok123');
  });

  it('does not include nextToken when omitted', async () => {
    mockFetch(200, { posts: [] });
    await getAllPosts();
    expect((fetch as jest.Mock).mock.calls[0][0]).not.toContain('nextToken');
  });
});

// ─── getPostsByCategory ───────────────────────────────────────────────────────

describe('getPostsByCategory', () => {
  it('calls correct category URL', async () => {
    mockFetch(200, { posts: [] });
    await getPostsByCategory('cloud-computing');
    expect((fetch as jest.Mock).mock.calls[0][0]).toContain('/categoria/cloud-computing');
  });

  it('sends default limit=9', async () => {
    mockFetch(200, { posts: [] });
    await getPostsByCategory('ia');
    expect((fetch as jest.Mock).mock.calls[0][0]).toContain('limit=9');
  });

  it('includes nextToken when provided', async () => {
    mockFetch(200, { posts: [] });
    await getPostsByCategory('ia', 'next123');
    expect((fetch as jest.Mock).mock.calls[0][0]).toContain('nextToken=next123');
  });

  it('returns null on error', async () => {
    mockFetch(500, null);
    const result = await getPostsByCategory('ia');
    expect(result).toBeNull();
  });
});

// ─── getPopularPosts ─────────────────────────────────────────────────────────

describe('getPopularPosts', () => {
  it('calls /posts/populares', async () => {
    mockFetch(200, { posts: [] });
    await getPopularPosts();
    expect((fetch as jest.Mock).mock.calls[0][0]).toContain('/posts/populares');
  });

  it('returns empty posts on error (graceful fallback)', async () => {
    mockFetch(500, null);
    const result = await getPopularPosts();
    expect(result).toEqual({ posts: [] });
  });
});

// ─── searchPosts ──────────────────────────────────────────────────────────────

describe('searchPosts', () => {
  it('sends q param', async () => {
    mockFetch(200, { posts: [] });
    await searchPosts('typescript');
    expect((fetch as jest.Mock).mock.calls[0][0]).toContain('q=typescript');
  });

  it('sends default limit=9', async () => {
    mockFetch(200, { posts: [] });
    await searchPosts('aws');
    expect((fetch as jest.Mock).mock.calls[0][0]).toContain('limit=9');
  });

  it('includes nextToken when provided', async () => {
    mockFetch(200, { posts: [] });
    await searchPosts('aws', 'tok');
    expect((fetch as jest.Mock).mock.calls[0][0]).toContain('nextToken=tok');
  });

  it('returns empty posts on error (graceful fallback)', async () => {
    mockFetch(500, null);
    const result = await searchPosts('term');
    expect(result).toEqual({ posts: [], nextToken: undefined });
  });

  it('calls /busca endpoint', async () => {
    mockFetch(200, { posts: [] });
    await searchPosts('lambda');
    expect((fetch as jest.Mock).mock.calls[0][0]).toContain('/busca');
  });
});

// ─── getProjectPosts ─────────────────────────────────────────────────────────

describe('getProjectPosts', () => {
  it('calls /projeto with default limit=8', async () => {
    mockFetch(200, { posts: [] });
    await getProjectPosts();
    const url = (fetch as jest.Mock).mock.calls[0][0] as string;
    expect(url).toContain('/projeto');
    expect(url).toContain('limit=8');
  });

  it('includes nextToken when provided', async () => {
    mockFetch(200, { posts: [] });
    await getProjectPosts('next456');
    expect((fetch as jest.Mock).mock.calls[0][0]).toContain('nextToken=next456');
  });

  it('returns empty posts on error (graceful fallback)', async () => {
    mockFetch(500, null);
    const result = await getProjectPosts();
    expect(result).toEqual({ posts: [], nextToken: undefined });
  });
});

// ─── getApiUrl guard ─────────────────────────────────────────────────────────

describe('API_URL guard', () => {
  it('throws if API_URL is not defined', async () => {
    const original = process.env.API_URL;
    delete process.env.API_URL;
    jest.resetModules();
    const { getPost: getPostFresh } = await import('../../lib/api');
    await expect(getPostFresh('slug')).rejects.toThrow('API_URL is not defined');
    process.env.API_URL = original;
  });
});
