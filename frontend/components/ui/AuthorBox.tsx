import Link from 'next/link';

interface AuthorBoxProps {
  author: {
    nome_exibicao: string;
    bio: string;
    foto_avatar_url?: string;
    linkedin_url?: string;
    github_url?: string;
  };
}

export default function AuthorBox({ author }: AuthorBoxProps) {
  const hasAvatar = author.foto_avatar_url && author.foto_avatar_url.trim() !== '';

  return (
    <section className="author-box">
      <div className="author-avatar">
        {hasAvatar ? (
          <img 
            src={author.foto_avatar_url} 
            alt={author.nome_exibicao} 
          />
        ) : (
          <div className="author-avatar-placeholder">
            <i className="fas fa-user"></i>
          </div>
        )}
      </div>

      <div className="author-info">
        {/* Container de Texto Fluido (Run-in) */}
        <div className="author-text-flow">
          {/* 1. Nome do Autor (Estilo Destaque) */}
          <span className="author-name-runin">
            {author.nome_exibicao}
          </span>
          
          {/* Espaço entre nome e bio */}
          {' '}

          {/* 2. Bio HTML (Estilo Inline) */}
          <span 
            className="author-bio-content" 
            dangerouslySetInnerHTML={{ __html: author.bio }} 
          />
        </div>

        {/* Redes Sociais (Mantidas abaixo do texto) */}
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
          {/* Adicionando Instagram se houver no futuro, já que criamos o campo */}
          {(author as any).instagram_url && (
             <a href={(author as any).instagram_url} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <i className="fab fa-instagram"></i>
            </a>
          )}
        </div>
      </div>
    </section>
  );
}