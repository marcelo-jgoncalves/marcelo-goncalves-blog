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
      <nav className="toc-mobile-accordion mobile-only" aria-label="Índice do artigo">
        <button 
          className="toc-mobile-header w-full flex items-center justify-between"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-controls="toc-mobile-content" /* 🚀 A11y: Conecta o botão ao conteúdo */
        >
          <span className="flex items-center">
             {/* 🚀 Clean Code: Estilos delegados ao post.css (.toc-icon) */}
             <i className="fas fa-list-ul toc-icon"></i> 
             Neste Artigo
          </span>
          <i className={`fas fa-chevron-down transition-transform ${isOpen ? 'rotate-180' : ''}`}></i>
        </button>
        
        {/* 🚀 A11y e Animação: ID conectado ao botão e classe para ativar o CSS Grid */}
        <div id="toc-mobile-content" className={`toc-mobile-content ${isOpen ? 'open' : ''}`}>
          
          {/* 🚀 UX: Wrapper interno necessário para esconder o texto suavemente na transição 0fr -> 1fr */}
          <div className="toc-mobile-inner">
            <ul className="toc-list">
              {headings.map((heading) => (
                <li key={heading.id}>
                  <a 
                    href={`#${heading.id}`}
                    onClick={() => setIsOpen(false)} // Fecha suavemente ao clicar
                  >
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

  // --- RENDERIZAÇÃO DESKTOP (Widget Sidebar) ---
  return (
    <div className="sidebar-widget toc-widget desktop-only">
      <span className="widget-title">
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