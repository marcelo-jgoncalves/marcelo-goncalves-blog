/* frontend/components/ui/layout/Header.tsx */


'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import './Header.css';
import ReadingProgressBar from '@/components/ui/ReadingProgressBar';

const NAV_LINKS = [
  { name: 'Home', href: '/' },
  { name: 'Artigos', href: '/artigos' },
  { name: 'O Projeto', href: '/o-projeto' },
  { name: 'Serviços', href: '/servicos' },
  { name: 'Sobre', href: '/sobre' },
] as const;

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="op-header">
      {/* 1. ADIÇÃO: aria-label para identificar a Landmark */}
      <nav className="op-navbar" aria-label="Navegação Principal">
        <Link href="/" className="op-logo" onClick={closeMenu}>
          Marcelo<span>Gonçalves</span>
        </Link>

        {/* Menu Desktop */}
        <div className="op-nav-links">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              prefetch={false}
              className={`op-nav-link ${isActive(link.href) ? 'op-active' : ''}`}
              aria-current={isActive(link.href) ? 'page' : undefined}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Botão Mobile */}
        <button 
          className="op-mobile-btn" 
          onClick={toggleMenu}
          aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={isMenuOpen}
          /* ADIÇÃO: Controla o foco em dispositivos leitores de tela */
          aria-controls="mobile-menu-dropdown"
        >
          {isMenuOpen ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M18 6L6 18M6 6l12 12"/></svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
          )}
        </button>

        {/* Menu Mobile */}
        <div
          id="mobile-menu-dropdown"
          className={`op-mobile-menu ${isMenuOpen ? 'op-active' : ''}`}
          aria-hidden={!isMenuOpen}
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              prefetch={false}
              onClick={closeMenu}
              className={`op-nav-link-mobile ${isActive(link.href) ? 'op-active' : ''}`}
              aria-current={isActive(link.href) ? 'page' : undefined}
            >
              {link.name}
            </Link>
          ))}
        </div>
      </nav>

      <ReadingProgressBar />
    </header>
  );
}