
// JSON.stringify não escapa `<`/`>`/`/` por padrão — um post com
// titulo/resumo contendo `</script><script>...` quebraria para fora da tag
// <script type="application/ld+json"> quando embutido via
// dangerouslySetInnerHTML. Mitigação padrão: escapar `<` no JSON antes de
// embutir (suficiente para impedir o fechamento da tag).
export function jsonLdScript(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
