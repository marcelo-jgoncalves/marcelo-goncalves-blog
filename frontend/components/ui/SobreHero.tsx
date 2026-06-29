// frontend/components/ui/SobreHero.tsx
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedinIn, faInstagram, faGithub } from '@fortawesome/free-brands-svg-icons';
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

        {/* Texto — esquerda */}
        <div className="sobre-hero__text">
          <h1 className="sobre-hero__name">
            Marcelo <span className="accent">Gonçalves</span> é Engenheiro Cloud
            especialista em AWS e arquiteturas resilientes.
          </h1>

          <p className="sobre-hero__lead">
            Transformando experiência prática em conteúdo técnico sobre cloud,
            DevOps, FinOps e desenvolvimento serverless.
          </p>

          <div className="sobre-hero__actions">
            <a href="/servicos" className="sobre-hero__btn-primary">Conheça Meu Trabalho</a>
            <a href="/artigos" className="sobre-hero__btn-secondary">Ver Artigos Técnicos</a>
          </div>

          <div className="sobre-hero__social">
            <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <FontAwesomeIcon icon={faLinkedinIn} aria-hidden="true" />
            </a>
            <a href={instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <FontAwesomeIcon icon={faInstagram} aria-hidden="true" />
            </a>
            <a href={githubUrl} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <FontAwesomeIcon icon={faGithub} aria-hidden="true" />
            </a>
          </div>
        </div>

        {/* Foto com moldura — direita */}
        <div className="sobre-hero__portrait" aria-hidden="true">
          <div className="sobre-hero__portrait-glow" />
          <div className="sobre-hero__portrait-frame">
            <img src="/static/foto-perfil-oculos.png" alt="" />
          </div>
        </div>

      </div>
    </section>
  );
}
