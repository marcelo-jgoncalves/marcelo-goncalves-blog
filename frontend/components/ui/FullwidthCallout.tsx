// frontend/components/ui/FullwidthCallout.tsx
import type { ReactNode } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faEnvelope, faRocket, faBriefcase } from '@fortawesome/free-solid-svg-icons';
import './FullwidthCallout.css';

// Mapa fechado dos ícones realmente usados pelos 4 callers (FeaturedCallout*) —
// a prop `icon` continua recebendo a mesma string ("fa-envelope") por
// compatibilidade, só resolvida aqui pro ícone SVG correspondente.
const ICON_MAP: Record<string, IconDefinition> = {
  'fa-envelope': faEnvelope,
  'fa-rocket': faRocket,
  'fa-briefcase': faBriefcase,
};

type FwcVariant    = 'light' | 'gradient' | 'newsletter' | 'dark' | 'navy';
type FwcIconVariant = 'light' | 'dark';
type FwcCtaVariant  = 'accent' | 'white';

interface FullwidthCalloutProps {
  variant?:     FwcVariant;      // preset de cores, default: 'light'
  border?:      boolean;         // borda accent topo/base, default: false
  rounded?:     boolean;         // border-radius 14px, para uso dentro de container, default: false
  size?:        'md' | 'lg';    // padding: md=space-6, lg=space-7, default: 'md'
  maxWidth?:    string;          // max-width do inner, default: '680px'
  icon?:        string;          // classe FA sem prefixo, ex: 'fa-envelope'
  iconVariant?: FwcIconVariant;  // 'light'=accent-light bg, 'dark'=accent bg, default: 'light'
  title:        ReactNode;
  description?: string;
  href?:        string;          // omitir = sem botão
  ctaText?:     string;
  ctaVariant?:  FwcCtaVariant;   // 'accent'=azul, 'white'=branco, default: 'accent'
}

export default function FullwidthCallout({
  variant     = 'light',
  border      = false,
  rounded     = false,
  size        = 'md',
  maxWidth    = '680px',
  icon,
  iconVariant = 'light',
  title,
  description,
  href,
  ctaText,
  ctaVariant  = 'accent',
}: FullwidthCalloutProps) {
  return (
    <section
      className="fwc-section"
      data-variant={variant}
      data-border={String(border)}
      data-rounded={String(rounded)}
      data-size={size}
    >
      <div className="fwc-inner" style={{ maxWidth }}>

        {icon && ICON_MAP[icon] && (
          <div className="fwc-icon" data-icon-variant={iconVariant} aria-hidden="true">
            <FontAwesomeIcon icon={ICON_MAP[icon]} />
          </div>
        )}

        <h2 className="fwc-title">{title}</h2>

        {description && (
          <p className="fwc-desc">{description}</p>
        )}

        {href && ctaText && (
          <Link href={href} className={`btn fwc-btn${ctaVariant === 'white' ? ' btn-petrol' : ''}`}>
            {ctaText}
          </Link>
        )}

      </div>
    </section>
  );
}
