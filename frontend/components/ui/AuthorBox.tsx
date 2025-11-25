import Link from 'next/link';

// Definimos uma interface para as props que o componente recebe
interface AuthorBoxProps {
  author: {
    nome_exibicao: string;
    bio: string; // HTML string
    foto_avatar_url: string;
    linkedin_url?: string;
    github_url?: string;
  };
}

export default function AuthorBox({ author }: AuthorBoxProps) {
  return (
    <section className="author-box">
      <div className="author-avatar">
        {/* Usamos img simples por enquanto para não complicar com Next/Image domains */}
        <img src={author.foto_avatar_url} alt={author.nome_exibicao} style={{width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover'}} />
      </div>
      <div className="author-info">
        <h4>{author.nome_exibicao}</h4>
        {/* Renderiza o HTML da bio (cuidado com XSS em apps reais, aqui confiamos na API admin) */}
        <div dangerouslySetInnerHTML={{ __html: author.bio }} />
        
        {/* Link CTA de Serviços injetado manualmente se não vier na bio */}
        <p className="cta-servicos" style={{ fontSize: '0.9rem', marginTop: '10px' }}>
            Precisa de um especialista? <Link href="/servicos" style={{ color: 'var(--blue-600)', textDecoration: 'underline' }}>Clique aqui para saber como posso ajudar</Link>.
        </p>

        <div className="author-social">
          {author.linkedin_url && (
            <a href={author.linkedin_url} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <i className="fab fa-linkedin-in"></i>
            </a>
          )}
          {author.github_url && (
            <a href={author.github_url} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <i className="fab fa-github"></i>
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
