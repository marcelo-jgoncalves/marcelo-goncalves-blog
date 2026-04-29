import type { ReactNode } from 'react';
import Link from 'next/link';
import './PageCTA.css';

interface PageCTAProps {
  title: ReactNode;
  body: string;
  linkHref: string;
  linkText: string;
}

export default function PageCTA({ title, body, linkHref, linkText }: PageCTAProps) {
  return (
    <section className="page-cta">
      <div className="page-cta__inner">
        <h2 className="page-cta__title">{title}</h2>
        <p className="page-cta__body">{body}</p>
        <Link href={linkHref} className="btn">
          {linkText}
        </Link>
      </div>
    </section>
  );
}
