'use client';

/* Entrance animation triggered once on mount, specs/ESPECIFICACAO-CLOUD-DEVOPS.md §15.
   Not a scroll-reveal: all elements animate together 60ms after the page loads. */

import { useEffect, useState, type CSSProperties, type ElementType, type ReactNode } from 'react';

interface RevealProps {
  children: ReactNode;
  delay?: number;
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
  dataAudit?: string;
}

export default function Reveal({ children, delay = 0, as: Tag = 'div', className, style, dataAudit }: RevealProps) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setReady(true), 60);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Tag
      data-reveal
      data-audit={dataAudit}
      className={className}
      style={{
        ...style,
        opacity: ready ? 1 : 0,
        transform: ready ? 'none' : 'translateY(24px)',
        transition: `opacity .7s cubic-bezier(.2,.7,.2,1) ${delay}ms, transform .7s cubic-bezier(.2,.7,.2,1) ${delay}ms`,
      }}
    >
      {children}
    </Tag>
  );
}
