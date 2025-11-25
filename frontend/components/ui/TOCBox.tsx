export default function TOCBox() {
  // Na v1.0, faremos estático ou simples. 
  // Para funcionar dinamicamente, precisaríamos parsear o HTML do post.
  // Como MVP, vamos deixar um placeholder que você pode preencher manualmente no CMS ou implementar o parser depois.
  return (
    <aside className="toc-box">
      <h3>Neste Artigo</h3>
      <ol>
        <li><a href="#introducao">Introdução</a></li>
        <li><a href="#desenvolvimento">Desenvolvimento</a></li>
        <li><a href="#conclusao">Conclusão</a></li>
      </ol>
    </aside>
  );
}
