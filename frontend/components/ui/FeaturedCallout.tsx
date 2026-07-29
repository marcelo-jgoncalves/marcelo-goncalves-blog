// frontend/components/ui/FeaturedCallout.tsx
import FullwidthCallout from './FullwidthCallout';

interface FeaturedCalloutProps {
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

export default function FeaturedCallout({ title, description }: FeaturedCalloutProps) {
  return (
    <FullwidthCallout
      variant="navy"
      icon="fa-envelope"
      iconVariant="dark"
      title={title ?? DEFAULT_TITLE}
      description={description ?? DEFAULT_DESC}
      href="/o-projeto"
      ctaText='Conheça "O Projeto" →'
      ctaVariant="white"
    />
  );
}
