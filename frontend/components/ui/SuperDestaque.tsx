// frontend/components/ui/SuperDestaque.tsx
import FullwidthCallout from './FullwidthCallout';

interface SuperDestaqueProps {
  title?:       React.ReactNode;
  description?: string;
}

const DEFAULT_TITLE = (
  <>
    Um Blog sobre as tecnologias do futuro, construído{' '}
    <span className="highlight">quase</span> 100% com IA.
  </>
);

const DEFAULT_DESC = 'Acompanhe a jornada, os desafios e os custos reais de construir este site do zero na AWS.';

export default function SuperDestaque({ title, description }: SuperDestaqueProps) {
  return (
    <FullwidthCallout
      variant="light"
      border
      icon="fa-envelope"
      iconVariant="light"
      title={title ?? DEFAULT_TITLE}
      description={description ?? DEFAULT_DESC}
      href="/o-projeto"
      ctaText='Conheça "O Projeto" →'
    />
  );
}
