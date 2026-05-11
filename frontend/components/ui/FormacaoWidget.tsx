// frontend/components/ui/FormacaoWidget.tsx
import './FormacaoWidget.css';

const FORMACAO = [
  { icon: 'fa-cloud',          titulo: 'Pós em Arquitetura Cloud',  grau: 'Especialização' },
  { icon: 'fa-graduation-cap', titulo: 'Sistemas de Informação',    grau: 'Graduação'      },
  { icon: 'fa-flask',          titulo: 'Mestrado em Linguística',   grau: 'Mestrado'       },
  { icon: 'fa-book-open',      titulo: 'Graduação em Letras',       grau: 'Graduação'      },
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
            <div className="formacao-widget__badge" aria-hidden="true">
              <i className={`fas ${item.icon}`} />
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
