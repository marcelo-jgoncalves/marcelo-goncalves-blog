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
        <p className="formacao-widget__subtitle">Formação</p>
        <h3 className="formacao-widget__title">Base acadêmica multidisciplinar</h3>
      </div>

      {/* Lista */}
      <ul className="formacao-widget__list" role="list">
        {FORMACAO.map((item) => (
          <li key={item.titulo} className="formacao-widget__item">
            <span className="formacao-widget__grau">{item.grau}</span>
            <strong className="formacao-widget__titulo">{item.titulo}</strong>
            <div className="formacao-widget__inst">
              <img
                src={item.logo}
                alt={item.instituicao}
                className="formacao-widget__logo"
                width={20}
                height={20}
              />
              <span>{item.instituicao}</span>
            </div>
          </li>
        ))}
      </ul>

    </div>
  );
}
