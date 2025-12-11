'use client';

import { useState } from 'react';

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

  // --- RENDERIZAÇÃO MOBILE (Acordeão) ---
  if (variant === 'mobile') {
    return (
      <nav className="toc-mobile-accordion" aria-label="Índice do artigo">
        <button 
          className="toc-mobile-header w-full"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
        >
          {/* CORREÇÃO: Ícone laranja e margem via classes utilitárias ou style limpo */}
          {/* ... dentro do return (mobile) ... */}
          <span className="flex items-center">
             <i className="fas fa-list-ul" style={{ color: 'var(--aws-orange)', marginRight: '8px' }}></i> 
             Neste Artigo
          </span>
          <i className={`fas fa-chevron-down transition-transform ${isOpen ? 'rotate-180' : ''}`}></i>
        </button>
        
        <div className={`toc-mobile-content ${isOpen ? 'open' : ''}`}>
          <ul className="toc-list">
            {headings.map((heading) => (
              <li key={heading.id}>
                <a 
                  href={`#${heading.id}`}
                  onClick={() => setIsOpen(false)} // Fecha ao clicar
                >
                  {heading.text}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    );
  }

  // --- RENDERIZAÇÃO DESKTOP (Widget Sidebar) ---
  return (
    <div className="sidebar-widget toc-widget">
      <span className="widget-title">
        {/* O estilo do ícone aqui é controlado pelo CSS Global que acabamos de editar */}
        <i className="fas fa-list-ul"></i> Neste Artigo
      </span>
      <ul className="toc-list">
        {headings.map((heading) => (
          <li key={heading.id}>
            <a href={`#${heading.id}`}>{heading.text}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}