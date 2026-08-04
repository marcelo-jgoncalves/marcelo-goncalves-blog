import type { ReactNode } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faEnvelope, faRocket, faBriefcase } from '@fortawesome/free-solid-svg-icons';
import './FullwidthCallout.css';

// Closed map of the icons actually used by the 4 callers (FeaturedCallout*):
// the `icon` prop keeps receiving the same string ("fa-envelope") for
// compatibility, only resolved here to the matching SVG icon.
const ICON_MAP: Record<string, IconDefinition> = {
  'fa-envelope': faEnvelope,
  'fa-rocket': faRocket,
  'fa-briefcase': faBriefcase,
};

type FwcVariant    = 'light' | 'gradient' | 'newsletter' | 'dark' | 'navy';
type FwcIconVariant = 'light' | 'dark';
type FwcCtaVariant  = 'accent' | 'white';

interface FullwidthCalloutProps {
  variant?:     FwcVariant;      // color preset, default: 'light'
  border?:      boolean;         // top/bottom accent border, default: false
  rounded?:     boolean;         // border-radius 14px, for use inside a container, default: false
  size?:        'md' | 'lg';    // padding: md=space-6, lg=space-7, default: 'md'
  maxWidth?:    string;          // inner max-width, default: '680px'
  icon?:        string;          // FA class without prefix, e.g. 'fa-envelope'
  iconVariant?: FwcIconVariant;  // 'light'=accent-light bg, 'dark'=accent bg, default: 'light'
  title:        ReactNode;
  description?: string;
  href?:        string;          // omit = no button
  ctaText?:     string;
  ctaVariant?:  FwcCtaVariant;   // 'accent'=blue, 'white'=white, default: 'accent'
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
