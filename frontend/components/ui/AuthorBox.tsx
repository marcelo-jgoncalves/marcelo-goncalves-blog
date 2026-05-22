// frontend/components/ui/AuthorBox.tsx

import Image from 'next/image';
import { getAuthor } from '@/lib/api';
import './AuthorBox.css'; 

interface AuthorBoxProps {
  authorId?: string;
}

export default async function AuthorBox({ authorId }: AuthorBoxProps) {
  const id = authorId || 'marcelo-goncalves';
  const data = await getAuthor(id);
  
  if (!data || !data.autor) return null;

  const { autor } = data;

  return (
    <section className="author-box" itemScope itemType="https://schema.org/Person" aria-label={`Sobre o autor: ${autor.nome_exibicao}`}>

      <div className="author-avatar">
        <Image
          src={autor.foto_avatar_url || '/static/foto-perfil-oculos.png'}
          alt={autor.foto_avatar_alt_text || `Foto de ${autor.nome_exibicao}`}
          width={120}
          height={120}
          itemProp="image"
          className="author-avatar-img"
        />
      </div>

      <div className="author-info">
        <div className="author-eyebrow">Sobre o autor</div>
        <div className="author-text-flow">
            <strong className="author-name-runin" itemProp="name">
              {autor.nome_exibicao}
            </strong>
            <div
              className="author-bio-content"
              itemProp="description"
              dangerouslySetInnerHTML={{ __html: autor.bio }}
            />
        </div>
        <nav className="author-social" aria-label={`Redes sociais de ${autor.nome_exibicao}`}>
            {autor.linkedin_url && (
                <a href={autor.linkedin_url} target="_blank" rel="noopener noreferrer author" aria-label={`LinkedIn de ${autor.nome_exibicao}`}>
                    <i className="fab fa-linkedin-in" aria-hidden="true"></i>
                </a>
            )}
            {autor.github_url && (
                <a href={autor.github_url} target="_blank" rel="noopener noreferrer author" aria-label={`GitHub de ${autor.nome_exibicao}`}>
                    <i className="fab fa-github" aria-hidden="true"></i>
                </a>
            )}
            {autor.instagram_url && (
                <a href={autor.instagram_url} target="_blank" rel="noopener noreferrer author" aria-label={`Instagram de ${autor.nome_exibicao}`}>
                    <i className="fab fa-instagram" aria-hidden="true"></i>
                </a>
            )}
        </nav>
      </div>
    </section>
  );
}