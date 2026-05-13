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
      <div className="sobre-hero__inner">

        {/* Foto */}
        <div className="sobre-hero__portrait" aria-hidden="true">
          <div className="sobre-hero__portrait-glow" />
          <img src="/static/foto-perfil-oculos.png" alt="" />
        </div>

        {/* Texto */}
        <div className="sobre-hero__text">
          <div className="sobre-hero__eyebrow">
            <span className="sobre-hero__eyebrow-dot" aria-hidden="true" />
            Engenharia Cloud · AWS · DevOps · Educação
          </div>

          <h1 className="sobre-hero__name">
            Marcelo <span className="accent">Gonçalves</span>
          </h1>

          <p className="sobre-hero__lead">
            Engenheiro Cloud especialista em AWS, automação e arquiteturas resilientes.
          </p>

          <p className="sobre-hero__body">
            Transformando experiência prática em conteúdo técnico profundo sobre cloud,
            DevOps, serverless e engenharia de plataformas modernas.
          </p>

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

      </div>
    </section>
  );
}
