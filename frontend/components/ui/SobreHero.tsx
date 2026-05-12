// frontend/components/ui/SobreHero.tsx
import './SobreHero.css';

interface SobreHeroProps {
  nome: string;
  linkedinUrl: string;
  instagramUrl: string;
  githubUrl: string;
}

export default function SobreHero({ nome, linkedinUrl, instagramUrl, githubUrl }: SobreHeroProps) {
  return (
    <section className="sobre-hero" aria-label={`Perfil de ${nome}`}>

      {/* Foto: absolutamente colada à esquerda da section fullwidth */}
      <div className="sobre-hero__portrait" aria-hidden="true">
        <img
          src="/static/foto-perfil-oculos.png"
          alt=""
        />
      </div>

      {/* Texto: fluxo normal, centralizado na largura total da hero */}
      <div className="sobre-hero__text">
        <h1 className="sobre-hero__name">
          Marcelo <span className="accent">Gonçalves</span> é<br />
          Engenheiro de Cloud Especialista em AWS &amp; Educador
        </h1>

        <div className="sobre-hero__social">
          <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <i className="fab fa-linkedin-in" aria-hidden="true" />
          </a>
          <a href={instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <i className="fab fa-instagram" aria-hidden="true" />
          </a>
          <a href={githubUrl} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <i className="fab fa-github" aria-hidden="true" />
          </a>
        </div>
      </div>

    </section>
  );
}
