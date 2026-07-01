'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_LINKS = [
  { name: 'Home', href: '/' },
  { name: 'Artigos', href: '/artigos' },
  { name: 'O Projeto', href: '/o-projeto' },
  { name: 'Serviços', href: '/servicos' },
  { name: 'Sobre', href: '/sobre' },
] as const;

export default function HeaderNav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const menuBtnRef = useRef<HTMLButtonElement>(null);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  const closeMenu = () => {
    setIsMenuOpen(false);
    menuBtnRef.current?.focus();
  };

  return (
    <>
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

      <Link href="/servicos" className="nav-cta" prefetch={false} data-audit="header-cta">
        Assessoria <span className="arrow" aria-hidden="true">→</span>
      </Link>

      <button
        ref={menuBtnRef}
        className="nav-mobile-btn"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
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
            tabIndex={isMenuOpen ? 0 : -1}
            className={isActive(link.href) ? 'active' : ''}
            aria-current={isActive(link.href) ? 'page' : undefined}
          >
            {link.name}
          </Link>
        ))}
        <Link href="/servicos" className="nav-cta-mobile" onClick={closeMenu} prefetch={false} tabIndex={isMenuOpen ? 0 : -1}>
          Assessoria <span className="arrow" aria-hidden="true">→</span>
        </Link>
      </div>
    </>
  );
}
