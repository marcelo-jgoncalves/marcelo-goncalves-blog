'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_LINKS_BEFORE = [{ name: 'Home', href: '/' }] as const;

// Ordem definitiva (ajuste-17a §3): Home, Serviços, Sobre, Artigos, O Projeto, Contato, CTA.
const NAV_LINKS_AFTER = [
  { name: 'Sobre', href: '/sobre' },
  { name: 'Artigos', href: '/artigos' },
  { name: 'O Projeto', href: '/o-projeto' },
  { name: 'Contato', href: '/contato' },
] as const;

// Artigos ativo em /artigos, /todos-artigos, /post/[slug] e /categoria/[slug] (ajuste-17a §5).
const isArticlesActive = (pathname: string) =>
  pathname === '/artigos' ||
  pathname === '/todos-artigos' ||
  pathname.startsWith('/post/') ||
  pathname.startsWith('/categoria/');

// Landing pages de pilar (specs/ESPECIFICACAO-*.md) — as 4 já estão implementadas.
// Ver project_engenharia_software_landing (memória).
const SERVICE_LINKS = [
  { name: 'Engenharia de Software', href: '/software' },
  { name: 'Cloud & DevOps', href: '/plataforma' },
  { name: 'Integração & Automação', href: '/automacao' },
  { name: 'Inteligência Artificial', href: '/inteligencia-artificial' },
] as const;

// /servicos (página central, ajuste-05) — primeiro item do dropdown, acima
// dos 4 links individuais (ajuste-07 §5.3).
const SERVICES_OVERVIEW_LINK = { name: 'Visão geral dos serviços', href: '/servicos' } as const;

export default function HeaderNav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isServicesMobileOpen, setIsServicesMobileOpen] = useState(false);
  const pathname = usePathname();
  const menuBtnRef = useRef<HTMLButtonElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);

  const servicesTriggerRef = useRef<HTMLButtonElement>(null);

  const isActive = (href: string) =>
    href === '/'
      ? pathname === '/'
      : href === '/artigos'
        ? isArticlesActive(pathname)
        : pathname.startsWith(href);

  const isServicesActive = pathname === SERVICES_OVERVIEW_LINK.href || SERVICE_LINKS.some((link) => isActive(link.href));

  const closeMenu = () => {
    setIsMenuOpen(false);
    setIsServicesMobileOpen(false);
    menuBtnRef.current?.focus();
  };

  // Fecha os dois menus ao cruzar o breakpoint desktop/mobile (ajuste-17a §27.3).
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1300) {
        setIsMenuOpen(false);
        setIsServicesMobileOpen(false);
      } else {
        setIsServicesOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fecha o dropdown/drawer imediatamente em toda mudança de rota (ajuste-17a §17.6/§28.2).
  const previousPathnameRef = useRef(pathname);
  useEffect(() => {
    if (previousPathnameRef.current === pathname) return;
    previousPathnameRef.current = pathname;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sincroniza com mudança de rota (fonte externa ao React), não com props/state
    setIsServicesOpen(false);
    setIsMenuOpen(false);
    setIsServicesMobileOpen(false);
  }, [pathname]);

  // Bloqueio de scroll do body enquanto o drawer mobile estiver aberto (ajuste-17a §23).
  useEffect(() => {
    if (!isMenuOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, [isMenuOpen]);

  useEffect(() => {
    if (!isServicesOpen) return;

    const handlePointerDown = (e: PointerEvent) => {
      if (servicesRef.current && !servicesRef.current.contains(e.target as Node)) {
        setIsServicesOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsServicesOpen(false);
        servicesTriggerRef.current?.focus();
      }
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
          <span className={`nav-dropdown-trigger${isServicesActive ? ' active' : ''}`}>
            <Link
              href="/servicos"
              prefetch={false}
              className={isActive('/servicos') ? 'active' : ''}
              aria-current={isActive('/servicos') ? 'page' : undefined}
            >
              Serviços
            </Link>
            <button
              ref={servicesTriggerRef}
              type="button"
              className="nav-dropdown-toggle"
              aria-expanded={isServicesOpen}
              aria-controls="services-dropdown"
              aria-label={isServicesOpen ? 'Ocultar páginas de serviços' : 'Mostrar páginas de serviços'}
              onClick={() => setIsServicesOpen((v) => !v)}
            >
              <svg className="nav-dropdown-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>
            </button>
          </span>
          <div id="services-dropdown" className={`nav-dropdown-panel${isServicesOpen ? ' is-active' : ''}`}>
            <Link
              href={SERVICES_OVERVIEW_LINK.href}
              prefetch={false}
              onClick={() => setIsServicesOpen(false)}
              className={`nav-dropdown-overview${pathname === SERVICES_OVERVIEW_LINK.href ? ' active' : ''}`}
              aria-current={pathname === SERVICES_OVERVIEW_LINK.href ? 'page' : undefined}
            >
              {SERVICES_OVERVIEW_LINK.name}
            </Link>
            {SERVICE_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                prefetch={false}
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

      <Link href="/contato" className="btn nav-cta" prefetch={false} data-audit="header-cta">
        Apresentar um desafio
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

        <div className={`nav-mobile-services-toggle${isServicesActive ? ' active' : ''}`}>
          <Link
            href="/servicos"
            prefetch={false}
            onClick={closeMenu}
            tabIndex={isMenuOpen ? 0 : -1}
            className={isActive('/servicos') ? 'active' : ''}
            aria-current={isActive('/servicos') ? 'page' : undefined}
          >
            Serviços
          </Link>
          <button
            type="button"
            aria-expanded={isServicesMobileOpen}
            aria-controls="mobile-services-list"
            aria-label={isServicesMobileOpen ? 'Ocultar páginas de serviços' : 'Mostrar páginas de serviços'}
            onClick={() => setIsServicesMobileOpen((v) => !v)}
            tabIndex={isMenuOpen ? 0 : -1}
          >
            <svg className={`nav-dropdown-chevron${isServicesMobileOpen ? ' is-open' : ''}`} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>
          </button>
        </div>
        {isServicesMobileOpen && (
          <div id="mobile-services-list" className="nav-mobile-services-list">
            <Link
              href={SERVICES_OVERVIEW_LINK.href}
              prefetch={false}
              onClick={closeMenu}
              tabIndex={isMenuOpen ? 0 : -1}
              className={`nav-dropdown-overview${pathname === SERVICES_OVERVIEW_LINK.href ? ' active' : ''}`}
              aria-current={pathname === SERVICES_OVERVIEW_LINK.href ? 'page' : undefined}
            >
              {SERVICES_OVERVIEW_LINK.name}
            </Link>
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
        <Link href="/contato" className="btn nav-cta-mobile" onClick={closeMenu} prefetch={false} tabIndex={isMenuOpen ? 0 : -1}>
          Apresentar um desafio
        </Link>
      </div>
    </>
  );
}
