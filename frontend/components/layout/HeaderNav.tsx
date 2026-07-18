'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_LINKS_BEFORE = [{ name: 'Home', href: '/' }] as const;

// Ordem pedida por Marcelo (2026-07-15): Home, Serviços (dropdown), Contato, Sobre, Blog, O Projeto.
// "O Projeto" é item fixo na nav (não mais condicional ao contexto de blog/post).
const NAV_LINKS_AFTER = [
  { name: 'Contato', href: '/contato' },
  { name: 'Sobre', href: '/sobre' },
  { name: 'Blog', href: '/blog' },
  { name: 'O Projeto', href: '/o-projeto' },
] as const;

// Landing pages de pilar (specs/ESPECIFICACAO-*.md) — as 4 já estão implementadas.
// Ver project_engenharia_software_landing (memória).
const SERVICE_LINKS = [
  { name: 'Engenharia de Software', href: '/engenharia-de-software' },
  { name: 'Cloud & DevOps', href: '/cloud-devops' },
  { name: 'Integração & Automação', href: '/integracao-automacao' },
  { name: 'Inteligência Artificial', href: '/inteligencia-artificial' },
] as const;

export default function HeaderNav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isServicesMobileOpen, setIsServicesMobileOpen] = useState(false);
  const pathname = usePathname();
  const menuBtnRef = useRef<HTMLButtonElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  const isServicesActive = SERVICE_LINKS.some((link) => isActive(link.href));
  // No contexto de blog/post/o-projeto o visitante ainda não escolheu um pilar —
  // o CTA do nav aponta pro menu de serviços em vez de pular direto pro formulário.
  const isBlogContext = pathname === '/blog' || pathname.startsWith('/post/') || pathname === '/o-projeto';

  const closeMenu = () => {
    setIsMenuOpen(false);
    setIsServicesMobileOpen(false);
    menuBtnRef.current?.focus();
  };

  useEffect(() => {
    if (!isServicesOpen) return;

    const handlePointerDown = (e: PointerEvent) => {
      if (servicesRef.current && !servicesRef.current.contains(e.target as Node)) {
        setIsServicesOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsServicesOpen(false);
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isServicesOpen]);

  return (
    <>
      <nav className="menu" aria-label="Navegação Principal" data-audit="header-menu">
        {NAV_LINKS_BEFORE.map((link) => (
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

        <div className="nav-dropdown" ref={servicesRef}>
          <button
            type="button"
            className={`nav-dropdown-trigger${isServicesActive ? ' active' : ''}`}
            aria-haspopup="true"
            aria-expanded={isServicesOpen}
            onClick={() => setIsServicesOpen((v) => !v)}
          >
            Serviços
            <svg className="nav-dropdown-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>
          </button>
          <div className={`nav-dropdown-panel${isServicesOpen ? ' is-active' : ''}`} role="menu">
            {SERVICE_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                prefetch={false}
                role="menuitem"
                onClick={() => setIsServicesOpen(false)}
                className={isActive(link.href) ? 'active' : ''}
                aria-current={isActive(link.href) ? 'page' : undefined}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        {NAV_LINKS_AFTER.map((link) => (
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

      {isBlogContext ? (
        // eslint-disable-next-line @next/next/no-html-link-for-pages -- <a> nativo intencional: next/link não dispara scroll até o hash no 1º clique
        <a href="/#servicos" className="nav-cta" data-audit="header-cta">
          Conheça nossos serviços
        </a>
      ) : (
        <Link href="/contato" className="nav-cta" prefetch={false} data-audit="header-cta">
          Solicitar diagnóstico
        </Link>
      )}

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
        {NAV_LINKS_BEFORE.map((link) => (
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

        <button
          type="button"
          className={`nav-mobile-services-toggle${isServicesActive ? ' active' : ''}`}
          aria-expanded={isServicesMobileOpen}
          onClick={() => setIsServicesMobileOpen((v) => !v)}
          tabIndex={isMenuOpen ? 0 : -1}
        >
          Serviços
          <svg className={`nav-dropdown-chevron${isServicesMobileOpen ? ' is-open' : ''}`} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>
        </button>
        {isServicesMobileOpen && (
          <div className="nav-mobile-services-list">
            {SERVICE_LINKS.map((link) => (
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
          </div>
        )}

        {NAV_LINKS_AFTER.map((link) => (
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
        {isBlogContext ? (
          // eslint-disable-next-line @next/next/no-html-link-for-pages -- ver comentário acima (desktop)
          <a href="/#servicos" className="nav-cta-mobile" onClick={closeMenu} tabIndex={isMenuOpen ? 0 : -1}>
            Conheça nossos serviços
          </a>
        ) : (
          <Link href="/contato" className="nav-cta-mobile" onClick={closeMenu} prefetch={false} tabIndex={isMenuOpen ? 0 : -1}>
            Solicitar diagnóstico
          </Link>
        )}
      </div>
    </>
  );
}
