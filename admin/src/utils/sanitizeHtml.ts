import DOMPurify from 'dompurify'

// div/span: wrapper for Tiptap's custom nodes (Callout, PullQuote,
// ClosingFlourish, YouTube embed). Without them DOMPurify "unwraps" those
// nodes, discarding the div and leaving only loose text in the saved HTML.
// Kept in sync with backend/src/common/sanitizer.ts: ALLOWED_TAGS and
// ALLOWED_ATTR must be identical between admin (DOMPurify) and backend (sanitize-html).
const ALLOWED_TAGS = [
  // Block
  'h1','h2','h3','h4','h5','h6',
  'p','blockquote','pre','hr','br',
  'ul','ol','li',
  'div','table','thead','tbody','tr','th','td',
  // Inline
  'strong','em','u','s','code',
  'a','img','span','mark',
  'iframe', // YouTube embeds
]
const ALLOWED_ATTR = [
  'src','alt','href','title','class','id','target','rel','width','height',
  'loading', // img
  'frameborder','allow','allowfullscreen','data-youtube-video', // iframe
  'colspan','rowspan', // th, td
]

export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, { ALLOWED_TAGS, ALLOWED_ATTR })
}
