// frontend/components/ui/SuperDestaqueProjeto.tsx
import FullwidthCallout from './FullwidthCallout';

interface SuperDestaqueProjetoProps {
  title?:       React.ReactNode;
  description?: string;
}

const DEFAULT_TITLE = (
  <>
    Veja como este <span className="highlight">blog foi construído</span>
  </>
);

const DEFAULT_DESC = 'Do zero na AWS, quase 100% com IA. Uma jornada técnica documentada em tempo real — arquitetura, custos e desafios.';

export default function SuperDestaqueProjeto({ title, description }: SuperDestaqueProjetoProps) {
  return (
    <FullwidthCallout
      variant="dark"
      icon="fa-rocket"
      iconVariant="dark"
      title={title ?? DEFAULT_TITLE}
      description={description ?? DEFAULT_DESC}
      href="/o-projeto"
      ctaText="Acompanhe a Jornada →"
      ctaVariant="white"
      size="lg"
    />
  );
}
