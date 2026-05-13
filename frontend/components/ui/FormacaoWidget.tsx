// frontend/components/ui/FormacaoWidget.tsx
import './FormacaoWidget.css';

const FORMACAO = [
  { logo: '/static/logos/estacio-logo.png', instituicao: 'Estácio',             titulo: 'Arquitetura Cloud',      grau: 'Especialização' },
  { logo: '/static/logos/estacio-logo.png', instituicao: 'Estácio',             titulo: 'Sistemas de Informação', grau: 'Graduação'      },
  { logo: '/static/logos/potsdam-logo.png', instituicao: 'Universität Potsdam', titulo: 'Linguística Aplicada',   grau: 'Mestrado'       },
  { logo: '/static/logos/ufmg-logo.png',    instituicao: 'UFMG',                titulo: 'Licenciatura em Letras', grau: 'Graduação'      },
];

export default function FormacaoWidget() {
  return (
    <div className="formacao-widget">

      {/* Header */}
      <div className="formacao-widget__header">
        <div className="formacao-widget__icon" aria-hidden="true">
          <i className="fas fa-user-graduate" />
        </div>
        <p className="formacao-widget__subtitle">Base Acadêmica</p>
        <h3 className="formacao-widget__title">Formação</h3>
      </div>

      {/* Lista */}
      <ul className="formacao-widget__list" role="list">
        {FORMACAO.map((item) => (
          <li key={item.titulo} className="formacao-widget__item">

            {/* Logo — esquerda */}
            <div className="formacao-widget__logo-wrap">
              <img
                src={item.logo}
                alt={item.instituicao}
                className="formacao-widget__logo"
                width={44}
                height={44}
              />
            </div>

            {/* Texto — direita */}
            <div className="formacao-widget__info">
              <span className="formacao-widget__grau">{item.grau}</span>
              <strong>{item.titulo}</strong>
              <em>{item.instituicao}</em>
            </div>

          </li>
        ))}
      </ul>

    </div>
  );
}
