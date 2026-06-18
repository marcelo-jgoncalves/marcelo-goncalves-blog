// frontend/components/ui/SuperDestaqueServicos.tsx
import FullwidthCallout from './FullwidthCallout';

interface SuperDestaqueServicosProps {
  title?:       React.ReactNode;
  description?: string;
}

const DEFAULT_TITLE = (
  <>
    Transforme sua <span className="highlight">arquitetura na AWS</span>
  </>
);

const DEFAULT_DESC = 'Assessoria especializada em Cloud Computing, IA e automação. Estratégia, implementação e otimização para empresas que querem escalar.';

export default function SuperDestaqueServicos({ title, description }: SuperDestaqueServicosProps) {
  return (
    <FullwidthCallout
      variant="navy"
      icon="fa-briefcase"
      iconVariant="dark"
      title={title ?? DEFAULT_TITLE}
      description={description ?? DEFAULT_DESC}
      href="/servicos"
      ctaText="Solicitar Proposta →"
      ctaVariant="white"
      size="lg"
    />
  );
}
