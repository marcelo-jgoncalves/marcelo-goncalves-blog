// backend/src/common/sanitizer.ts
// Sanitizes HTML content from the Tiptap editor before persisting to DynamoDB.
// Allows the full set of tags/attributes the editor produces while stripping
// any script injection vectors.
import sanitizeHtml from "sanitize-html";

const ALLOWED_TAGS = [
  // Block
  "h1", "h2", "h3", "h4", "h5", "h6",
  "p", "blockquote", "pre", "hr", "br",
  "ul", "ol", "li",
  "div", // Tiptap callout node
  "table", "thead", "tbody", "tr", "th", "td",
  // Inline
  "strong", "em", "u", "s", "code",
  "a", "img", "span", "mark",
  "iframe", // YouTube embeds (data-youtube-video attribute)
];

const ALLOWED_ATTRIBUTES: sanitizeHtml.IOptions["allowedAttributes"] = {
  "*": ["class", "id"],
  "a": ["href", "target", "rel", "title"],
  "img": ["src", "alt", "width", "height", "loading"],
  "iframe": ["src", "width", "height", "frameborder", "allow", "allowfullscreen", "data-youtube-video"],
  "th": ["colspan", "rowspan"],
  "td": ["colspan", "rowspan"],
};

const ALLOWED_SCHEMES = ["http", "https", "mailto"];

// iframe só é permitido para embeds de YouTube — sanitize-html remove
// qualquer <iframe> cujo src não resolva para um desses hostnames,
// mesmo com a tag/atributo allowlisted. Sem isso, "iframe" em
// ALLOWED_TAGS permitiria <iframe src="qualquer-coisa.html"> (XSS).
const ALLOWED_IFRAME_HOSTNAMES = ["www.youtube.com", "youtube.com", "youtube-nocookie.com", "www.youtube-nocookie.com"];

export function sanitizePostHtml(html: string): string {
  if (!html) return html;

  return sanitizeHtml(html, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: ALLOWED_ATTRIBUTES,
    allowedSchemes: ALLOWED_SCHEMES,
    allowedIframeHostnames: ALLOWED_IFRAME_HOSTNAMES,
    // Force rel="noopener noreferrer" on external links
    transformTags: {
      a: (tagName, attribs) => ({
        tagName,
        attribs: {
          ...attribs,
          rel: "noopener noreferrer",
        },
      }),
    },
  });
}
