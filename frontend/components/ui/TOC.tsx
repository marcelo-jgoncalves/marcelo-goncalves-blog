'use client';

import { useState } from 'react';
import './TOC.css';

interface Heading {
  id: string;
  text: string;
}

interface TOCProps {
  headings: Heading[];
  variant: 'desktop' | 'mobile';
}

export default function TOC({ headings, variant }: TOCProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!headings || headings.length === 0) return null;

  // --- RENDERIZAÇÃO MOBILE (Acordeão sem Tailwind) ---
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
             <i className="fas fa-list-ul toc-icon" aria-hidden="true"></i> 
             Neste Artigo
          </span>
          <i className={`fas fa-chevron-down toc-chevron ${isOpen ? 'open' : ''}`} aria-hidden="true"></i>
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

  // --- RENDERIZAÇÃO DESKTOP (Intacta) ---
  return (
    <nav className="toc-wrapper toc-desktop desktop-only" aria-label="Índice do artigo">
      <h2 className="toc-title">
        <i className="fas fa-list-ul" aria-hidden="true"></i> Neste Artigo
      </h2>
      <ul className="toc-list">
        {headings.map((heading) => (
          <li key={heading.id}>
            <a href={`#${heading.id}`}>{heading.text}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}