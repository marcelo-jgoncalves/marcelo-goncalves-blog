// frontend/components/ui/PageCTA.tsx
import type { ReactNode } from 'react';
import FullwidthCallout from './FullwidthCallout';

interface PageCTAProps {
  title:     ReactNode;
  body:      string;
  linkHref:  string;
  linkText:  string;
  /** 'newsletter' = gradiente claro; 'services' = Classic Blue escuro */
  variant?:  'newsletter' | 'services';
}

export default function PageCTA({ title, body, linkHref, linkText, variant = 'newsletter' }: PageCTAProps) {
  const isServices = variant === 'services';
  return (
    <FullwidthCallout
      variant={isServices ? 'dark' : 'newsletter'}
      size="lg"
      maxWidth="760px"
      title={title}
      description={body}
      href={linkHref}
      ctaText={linkText}
      ctaVariant={isServices ? 'white' : 'accent'}
    />
  );
}
