'use client';

import { useEffect, useRef, useState } from 'react';

export interface TocHeading {
  id: string;
  text: string;
}

interface TableOfContentsProps {
  headings: TocHeading[];
  readingTimeMin?: number;
}

export default function TableOfContents({ headings, readingTimeMin }: TableOfContentsProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [progHeight, setProgHeight] = useState(0);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  useEffect(() => {
    if (headings.length === 0) return;

    const targets = headings.map((h) => document.getElementById(h.id));

    const spy = () => {
      let idx = 0;
      const y = window.scrollY + 150;
      targets.forEach((t, i) => {
        if (t && t.offsetTop <= y) idx = i;
      });
      setActiveIndex(idx);

      const active = itemRefs.current[idx];
      if (active) {
        const mk = active.querySelector<HTMLElement>('.post-toc-mk');
        const center = active.offsetTop + (mk ? mk.offsetTop : 12) + 6;
        setProgHeight(Math.max(0, center - 16));
      }
    };

    document.addEventListener('scroll', spy, { passive: true });
    window.addEventListener('resize', spy);
    spy();

    return () => {
      document.removeEventListener('scroll', spy);
      window.removeEventListener('resize', spy);
    };
  }, [headings]);

  if (headings.length === 0) return null;

  const handleClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <aside className="post-toc" data-audit="post-toc">
      <div className="post-toc-lbl">Neste artigo</div>
      <nav className="post-toc-items">
        <span className="post-toc-prog" style={{ height: `${progHeight}px` }} aria-hidden="true" />
        {headings.map((h, i) => (
          <a
            key={h.id}
            ref={(el) => { itemRefs.current[i] = el; }}
            className={`post-toc-item ${i === activeIndex ? 'active' : ''} ${i < activeIndex ? 'read' : ''}`}
            href={`#${h.id}`}
            onClick={(e) => handleClick(e, h.id)}
          >
            <span className="post-toc-mk" aria-hidden="true" />
            <span className="post-toc-ix">{String(i + 1).padStart(2, '0')}</span>
            <span className="post-toc-tx">{h.text}</span>
          </a>
        ))}
      </nav>
      {readingTimeMin != null && (
        <div className="post-toc-read-meta">
          <span><b>{readingTimeMin} min</b> de leitura</span>
          <span><b>{headings.length}</b> seções</span>
        </div>
      )}
    </aside>
  );
}
