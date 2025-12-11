import React from 'react';
import Link from 'next/link';
import { getAuthor } from '@/lib/api';

interface AuthorBoxProps {
  authorId?: string;
}

export default async function AuthorBox({ authorId }: AuthorBoxProps) {
  // Se não vier ID (ex: post antigo), usa o autor padrão
  const id = authorId || 'marcelo-goncalves';
  
  // Busca dados do autor
  const data = await getAuthor(id);
  
  // Se a API falhar, não renderiza nada
  if (!data || !data.autor) return null;

  const { autor } = data;

  return (
    <div className="author-box">
      <div className="author-avatar">
        {autor.foto_avatar_url ? (
          <img 
            src={autor.foto_avatar_url} 
            alt={autor.foto_avatar_alt_text || `Foto de ${autor.nome_exibicao}`} 
          />
        ) : (
          <div className="author-avatar-placeholder">
            <i className="fas fa-user"></i>
          </div>
        )}
      </div>

      <div className="author-info">
        <div className="author-text-flow">
            {/* CORREÇÃO: Nome em destaque (Run-in) */}
            <span className="author-name-runin">{autor.nome_exibicao} </span>
            
            {/* Renderiza o restante da bio */}
            <span 
              className="author-bio-content" 
              dangerouslySetInnerHTML={{ __html: autor.bio }} 
            />
        </div>

        <div className="author-social">
            {autor.linkedin_url && (
                <a href={autor.linkedin_url} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                    <i className="fab fa-linkedin-in"></i>
                </a>
            )}
            {autor.github_url && (
                <a href={autor.github_url} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                    <i className="fab fa-github"></i>
                </a>
            )}
            {autor.instagram_url && (
                <a href={autor.instagram_url} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                    <i className="fab fa-instagram"></i>
                </a>
            )}
        </div>
      </div>
    </div>
  );
}