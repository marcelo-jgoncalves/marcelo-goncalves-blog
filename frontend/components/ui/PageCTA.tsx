import type { ReactNode } from 'react';
import Link from 'next/link';
import './PageCTA.css';

interface PageCTAProps {
  title: ReactNode;
  body: string;
  linkHref: string;
  linkText: string;
  /** 'newsletter' (padrão) = gradiente claro; 'services' = dark navy como ServiceCallout */
  variant?: 'newsletter' | 'services';
}

export default function PageCTA({ title, body, linkHref, linkText, variant = 'newsletter' }: PageCTAProps) {
  return (
    <section className={`page-cta page-cta--${variant}`}>
      <div className="page-cta__inner">
        <h2 className="page-cta__title">{title}</h2>
        <p className="page-cta__body">{body}</p>
        <Link href={linkHref} className="page-cta__btn">
          {linkText}
        </Link>
      </div>
    </section>
  );
}
