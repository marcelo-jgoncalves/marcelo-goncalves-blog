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
      <div className="formacao-widget__header">
        <div className="formacao-widget__icon" aria-hidden="true">
          <i className="fas fa-user-graduate" />
        </div>
        <h3 className="formacao-widget__title">Formação Acadêmica</h3>
      </div>

      <ul className="formacao-widget__list" role="list">
        {FORMACAO.map((item) => (
          <li key={item.titulo} className="formacao-widget__item">
            <div className="formacao-widget__logo-wrap">
              <img
                src={item.logo}
                alt={item.instituicao}
                className="formacao-widget__logo"
              />
            </div>
            <div className="formacao-widget__info">
              <strong>{item.titulo}</strong>
              <span>{item.grau}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
