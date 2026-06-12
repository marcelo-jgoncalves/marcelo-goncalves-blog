/* frontend/components/layout/Header.tsx */

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
    <header className="site-header" data-audit="header">
      <div className="nav-in" data-audit="header-nav-in">
        <Link href="/" className="brand" onClick={closeMenu} data-audit="header-brand">
          <span>Marcelo</span><span className="b2">Gonçalves</span><span className="tick" aria-hidden="true" />
        </Link>

        {/* Menu Desktop */}
        <nav className="menu" aria-label="Navegação Principal" data-audit="header-menu">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              prefetch={false}
              className={isActive(link.href) ? 'active' : ''}
              aria-current={isActive(link.href) ? 'page' : undefined}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* CTA — desktop only */}
        <Link href="/servicos" className="nav-cta" prefetch={false} data-audit="header-cta">
          Assessoria <span className="arrow">→</span>
        </Link>

        {/* Botão Mobile */}
        <button
          className="nav-mobile-btn"
          onClick={toggleMenu}
          aria-label={isMenuOpen ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={isMenuOpen}
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
          className={`nav-mobile-menu ${isMenuOpen ? 'is-active' : ''}`}
          aria-hidden={!isMenuOpen}
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              prefetch={false}
              onClick={closeMenu}
              className={isActive(link.href) ? 'active' : ''}
              aria-current={isActive(link.href) ? 'page' : undefined}
            >
              {link.name}
            </Link>
          ))}
          <Link href="/servicos" className="nav-cta-mobile" onClick={closeMenu} prefetch={false}>
            Assessoria <span className="arrow">→</span>
          </Link>
        </div>
      </div>

      <ReadingProgressBar />
    </header>
  );
}
