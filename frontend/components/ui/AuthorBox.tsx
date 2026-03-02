// frontend/components/ui/AuthorBox.tsx
import React from 'react';
import { getAuthor } from '@/lib/api';

interface AuthorBoxProps {
  authorId?: string;
}

export default async function AuthorBox({ authorId }: AuthorBoxProps) {
  const id = authorId || 'marcelo-goncalves';
  const data = await getAuthor(id);
  
  if (!data || !data.autor) return null;

  const { autor } = data;

  return (
    /* 🚀 SEO: Marcação Schema.org para validar Autoridade (E-E-A-T) */
    <section className="author-box" itemScope itemType="https://schema.org/Person">
      
      <div className="author-avatar">
        {autor.foto_avatar_url ? (
          /* 🚀 PERFORMANCE: Dimensões explícitas e lazy loading = CLS Zero */
          <img 
            src={autor.foto_avatar_url} 
            alt={autor.foto_avatar_alt_text || `Foto de ${autor.nome_exibicao}`}
            width={80}
            height={80}
            loading="lazy"
            decoding="async"
            itemProp="image"
          />
        ) : (
          <div className="author-avatar-placeholder" aria-hidden="true">
            <i className="fas fa-user"></i>
          </div>
        )}
      </div>

      <div className="author-info">
        <div className="author-text-flow">
            {/* 🚀 UX: Strong no nome para destaque semântico */}
            <strong className="author-name-runin" itemProp="name">
              {autor.nome_exibicao}
            </strong>
            
            <span 
              className="author-bio-content" 
              itemProp="description"
              dangerouslySetInnerHTML={{ __html: autor.bio }} 
            />
        </div>

        <div className="author-social">
            {autor.linkedin_url && (
                <a href={autor.linkedin_url} target="_blank" rel="noopener noreferrer" aria-label={`LinkedIn de ${autor.nome_exibicao}`}>
                    <i className="fab fa-linkedin-in" aria-hidden="true"></i>
                </a>
            )}
            {autor.github_url && (
                <a href={autor.github_url} target="_blank" rel="noopener noreferrer" aria-label={`GitHub de ${autor.nome_exibicao}`}>
                    <i className="fab fa-github" aria-hidden="true"></i>
                </a>
            )}
            {autor.instagram_url && (
                <a href={autor.instagram_url} target="_blank" rel="noopener noreferrer" aria-label={`Instagram de ${autor.nome_exibicao}`}>
                    <i className="fab fa-instagram" aria-hidden="true"></i>
                </a>
            )}
        </div>
      </div>
    </section>
  );
}