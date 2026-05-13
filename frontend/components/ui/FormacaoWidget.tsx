// frontend/components/ui/FormacaoWidget.tsx
import './FormacaoWidget.css';

const FORMACAO = [
  { titulo: 'Arquitetura Cloud',      grau: 'Especialização' },
  { titulo: 'Sistemas de Informação', grau: 'Graduação'      },
  { titulo: 'Linguística Aplicada',   grau: 'Mestrado'       },
  { titulo: 'Licenciatura em Letras', grau: 'Graduação'      },
];

export default function FormacaoWidget() {
  return (
    <div className="formacao-widget">

      {/* Header */}
      <div className="formacao-widget__header">
        <h3 className="formacao-widget__title">Base acadêmica multidisciplinar</h3>
      </div>

      {/* Lista */}
      <ul className="formacao-widget__list" role="list">
        {FORMACAO.map((item) => (
          <li key={item.titulo} className="formacao-widget__item">
            <span className="formacao-widget__grau">{item.grau}</span>
            <strong className="formacao-widget__titulo">{item.titulo}</strong>
          </li>
        ))}
      </ul>

    </div>
  );
}
