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
];

const ALLOWED_ATTRIBUTES: sanitizeHtml.IOptions["allowedAttributes"] = {
  "*": ["class", "id"],
  "a": ["href", "target", "rel"],
  "img": ["src", "alt", "width", "height", "loading"],
  "th": ["colspan", "rowspan"],
  "td": ["colspan", "rowspan"],
};

const ALLOWED_SCHEMES = ["http", "https", "mailto"];

export function sanitizePostHtml(html: string): string {
  if (!html) return html;

  return sanitizeHtml(html, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: ALLOWED_ATTRIBUTES,
    allowedSchemes: ALLOWED_SCHEMES,
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
