// frontend/components/ui/FullwidthCallout.tsx
import type { ReactNode } from 'react';
import Link from 'next/link';
import './FullwidthCallout.css';

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

        {icon && (
          <div className="fwc-icon" data-icon-variant={iconVariant} aria-hidden="true">
            <i className={`fas ${icon}`} />
          </div>
        )}

        <h2 className="fwc-title">{title}</h2>

        {description && (
          <p className="fwc-desc">{description}</p>
        )}

        {href && ctaText && (
          <Link href={href} className="fwc-btn" data-cta-variant={ctaVariant}>
            {ctaText}
          </Link>
        )}

      </div>
    </section>
  );
}
