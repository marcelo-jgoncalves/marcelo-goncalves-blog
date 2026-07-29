import { sanitizePostHtml } from './sanitizer';

describe('sanitizePostHtml', () => {
  describe('passthrough', () => {
    it('returns empty string unchanged', () => {
      expect(sanitizePostHtml('')).toBe('');
    });

    it('preserves allowed block tags', () => {
      const input = '<h1>Title</h1><p>Paragraph</p><ul><li>Item</li></ul>';
      expect(sanitizePostHtml(input)).toBe(input);
    });

    it('preserves allowed inline tags', () => {
      const input = '<strong>bold</strong> <em>italic</em> <code>code()</code>';
      expect(sanitizePostHtml(input)).toBe(input);
    });

    it('preserves img with allowed attributes', () => {
      const input = '<img src="https://example.com/img.webp" alt="desc">';
      const result = sanitizePostHtml(input);
      expect(result).toContain('src="https://example.com/img.webp"');
      expect(result).toContain('alt="desc"');
    });

    it('preserves pre/code blocks', () => {
      const input = '<pre><code class="language-typescript">const x = 1;</code></pre>';
      expect(sanitizePostHtml(input)).toBe(input);
    });

    it('preserves blockquote', () => {
      const input = '<blockquote><p>Quote text</p></blockquote>';
      expect(sanitizePostHtml(input)).toBe(input);
    });

    it('preserves table structure', () => {
      const input = '<table><thead><tr><th>A</th></tr></thead><tbody><tr><td>B</td></tr></tbody></table>';
      expect(sanitizePostHtml(input)).toBe(input);
    });

    it('preserves Tiptap callout div with class', () => {
      const input = '<div class="content-callout callout-info"><p>Info</p></div>';
      expect(sanitizePostHtml(input)).toBe(input);
    });
  });

  describe('XSS stripping', () => {
    it('removes script tags entirely', () => {
      const input = '<p>Text</p><script>alert("xss")</script>';
      const result = sanitizePostHtml(input);
      expect(result).not.toContain('<script>');
      expect(result).not.toContain('alert');
      expect(result).toContain('<p>Text</p>');
    });

    it('removes inline event handlers', () => {
      const input = '<p onclick="evil()">Click me</p>';
      const result = sanitizePostHtml(input);
      expect(result).not.toContain('onclick');
      expect(result).toContain('<p>Click me</p>');
    });

    it('removes javascript: hrefs', () => {
      const input = '<a href="javascript:alert(1)">click</a>';
      const result = sanitizePostHtml(input);
      expect(result).not.toContain('javascript:');
    });

    it('removes style attribute', () => {
      const input = '<p style="color:red">Text</p>';
      const result = sanitizePostHtml(input);
      expect(result).not.toContain('style=');
    });

    it('strips iframe src from non-whitelisted hostnames (XSS vector neutralized)', () => {
      const input = '<iframe src="evil.html">content</iframe>';
      const result = sanitizePostHtml(input);
      expect(result).not.toContain('evil.html');
      expect(result).not.toContain('src=');
    });

    it('allows iframe src from YouTube (embed use case)', () => {
      const input = '<iframe src="https://www.youtube.com/embed/abc123"></iframe>';
      const result = sanitizePostHtml(input);
      expect(result).toContain('src="https://www.youtube.com/embed/abc123"');
    });

    it('removes data-uri in img src', () => {
      const input = '<img src="data:image/svg+xml,<svg onload=alert(1)>">';
      const result = sanitizePostHtml(input);
      expect(result).not.toContain('data:');
    });
  });

  describe('link transformation', () => {
    it('adds rel="noopener noreferrer" to all links', () => {
      const input = '<a href="https://example.com">Link</a>';
      const result = sanitizePostHtml(input);
      expect(result).toContain('rel="noopener noreferrer"');
    });

    it('preserves href and existing attributes when adding rel', () => {
      const input = '<a href="https://example.com" target="_blank">Link</a>';
      const result = sanitizePostHtml(input);
      expect(result).toContain('href="https://example.com"');
      expect(result).toContain('rel="noopener noreferrer"');
    });

    it('allows https links', () => {
      const input = '<a href="https://example.com">Link</a>';
      expect(sanitizePostHtml(input)).toContain('href="https://example.com"');
    });

    it('allows mailto links', () => {
      const input = '<a href="mailto:test@example.com">Email</a>';
      expect(sanitizePostHtml(input)).toContain('href="mailto:test@example.com"');
    });
  });

  describe('allowed attributes', () => {
    it('preserves class and id on any element', () => {
      const input = '<p class="highlight" id="para1">Text</p>';
      expect(sanitizePostHtml(input)).toBe(input);
    });

    it('preserves colspan and rowspan on th/td', () => {
      const input = '<table><tr><th colspan="2">Header</th></tr></table>';
      expect(sanitizePostHtml(input)).toContain('colspan="2"');
    });
  });
});
