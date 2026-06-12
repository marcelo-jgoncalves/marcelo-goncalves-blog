'use client';

import React, { useState, useEffect } from 'react';
import Eyebrow from './Eyebrow';
import './TOC.css';

interface Heading {
  id: string;
  text: string;
}

interface TOCProps {
  headings: Heading[];
  variant: 'desktop' | 'mobile';
}

const HEADER_OFFSET = 112; // altura da nav sticky + margem de segurança

export default function TOC({ headings, variant }: TOCProps) {
  const [isOpen,   setIsOpen]   = useState(false);
  const [activeId, setActiveId] = useState<string>(headings[0]?.id ?? '');

  // Scroll-spy — só ativo no desktop
  useEffect(() => {
    if (variant !== 'desktop' || headings.length === 0) return;

    const handleScroll = () => {
      const scrollY = window.scrollY + HEADER_OFFSET;
      let current = headings[0].id;

      for (const { id } of headings) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top + window.scrollY <= scrollY) {
          current = id;
        }
      }

      setActiveId(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // estado inicial

    return () => window.removeEventListener('scroll', handleScroll);
  }, [headings, variant]);

  if (!headings || headings.length === 0) return null;

  // --- MOBILE ---
  if (variant === 'mobile') {
    return (
      <nav className="toc-wrapper toc-mobile mobile-only" aria-label="Índice do artigo">
        <button
          className="toc-mobile-header"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-controls="toc-mobile-content"
        >
          <span className="toc-mobile-title">
            <i className="fas fa-list-ul toc-icon" aria-hidden="true" />
            Neste Artigo
          </span>
          <i className={`fas fa-chevron-down toc-chevron ${isOpen ? 'open' : ''}`} aria-hidden="true" />
        </button>

        <div id="toc-mobile-content" className={`toc-mobile-content ${isOpen ? 'open' : ''}`}>
          <div className="toc-mobile-inner">
            <ul className="toc-list">
              {headings.map((heading) => (
                <li key={heading.id}>
                  <a href={`#${heading.id}`} onClick={() => setIsOpen(false)}>
                    {heading.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>
    );
  }

  // --- DESKTOP ---
  const activeIdx  = headings.findIndex(h => h.id === activeId);
  const currentIdx = activeIdx === -1 ? 0 : activeIdx;
  const progressPct = `${((currentIdx + 1) / headings.length) * 100}%`;

  return (
    <nav className="toc-wrapper toc-desktop desktop-only" aria-label="Índice do artigo">
      <Eyebrow text="Navegação" color="var(--petrol)" />
      <h2 className="toc-title">Neste artigo</h2>
      <ul className="toc-list">
        {headings.map((heading) => (
          <li key={heading.id}>
            <a
              href={`#${heading.id}`}
              className={activeId === heading.id ? 'toc-active' : ''}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
      <div className="toc-progress">
        <span>{currentIdx + 1}/{headings.length}</span>
        <div
          className="toc-progress__bar"
          style={{ '--p': progressPct } as React.CSSProperties}
        />
      </div>
    </nav>
  );
}
