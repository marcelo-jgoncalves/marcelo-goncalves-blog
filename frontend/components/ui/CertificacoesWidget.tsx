// frontend/components/ui/CertificacoesWidget.tsx
import './CertificacoesWidget.css';

const CERTS = [
  { id: '3d246d86-7316-43af-9094-f0f3459970ce', nome: 'Solutions Architect',  nivel: 'Associate',           imagem: '/static/badges/solutions.png'    },
  { id: '9b4b2ee7-9fd5-4a71-8b4a-40f1d6aac606', nome: 'SysOps Administrator', nivel: 'Associate',           imagem: '/static/badges/sysops.png'       },
  { id: 'eb295814-0c5c-4961-a685-84c80e779439', nome: 'HashiCorp Terraform',   nivel: 'Certified Associate', imagem: '/static/badges/terraform.png'     },
  { id: '02d3ce05-a8d2-4b85-9dde-b14c22e10397', nome: 'Splunk Core',           nivel: 'Certified Power User',imagem: '/static/badges/splunk.png'       },
  { id: '5326ba20-c51f-4565-a7fc-36fcc3fccf7d', nome: 'Cloud Practitioner',   nivel: 'Foundational',        imagem: '/static/badges/pactitioner.png'  },
];

export default function CertificacoesWidget() {
  return (
    <div className="certs-widget">
      <div className="certs-widget__header">
        <div className="certs-widget__icon" aria-hidden="true">
          <i className="fas fa-certificate" />
        </div>
        <h3 className="certs-widget__title">Certificações</h3>
      </div>

      <ul className="certs-widget__list" role="list">
        {CERTS.map((cert) => (
          <li key={cert.id}>
            <a
              href={`https://www.credly.com/badges/${cert.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="certs-widget__card"
              aria-label={`Ver credencial: ${cert.nome} — ${cert.nivel}`}
            >
              <img
                src={cert.imagem}
                alt={`${cert.nome} — ${cert.nivel}`}
                className="certs-widget__badge"
                width={40}
                height={40}
              />
              <div className="certs-widget__info">
                <strong>{cert.nome}</strong>
                <span>{cert.nivel}</span>
              </div>
              <i className="fas fa-arrow-up-right-from-square certs-widget__ext" aria-hidden="true" />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
