// frontend/components/ui/SuperDestaqueNewsletter.tsx
import FullwidthCallout from './FullwidthCallout';

interface SuperDestaqueNewsletterProps {
  title?:       React.ReactNode;
  description?: string;
}

const DEFAULT_TITLE = (
  <>
    Aprofunde-se em <span className="highlight">IA, AWS e DevOps</span>
  </>
);

const DEFAULT_DESC = 'Receba análises exclusivas, arquitetura moderna e bastidores reais de engenharia em sua caixa de entrada.';

export default function SuperDestaqueNewsletter({ title, description }: SuperDestaqueNewsletterProps) {
  return (
    <FullwidthCallout
      variant="newsletter"
      icon="fa-envelope"
      iconVariant="light"
      title={title ?? DEFAULT_TITLE}
      description={description ?? DEFAULT_DESC}
      href="#newsletter"
      ctaText="Inscrever-se →"
      ctaVariant="accent"
      size="lg"
    />
  );
}
