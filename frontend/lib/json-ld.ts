
// JSON.stringify does not escape `<`/`>`/`/` by default: a post with
// titulo/resumo containing `</script><script>...` would break out of the
// <script type="application/ld+json"> tag when embedded via
// dangerouslySetInnerHTML. Standard mitigation: escape `<` in the JSON
// before embedding (enough to prevent the tag from closing).
export function jsonLdScript(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
