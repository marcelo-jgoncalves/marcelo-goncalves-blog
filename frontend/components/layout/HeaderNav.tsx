'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Header.module.css';

const NAV_LINKS_BEFORE = [{ name: 'Home', href: '/' }] as const;

const NAV_LINKS_AFTER = [
  { name: 'Sobre', href: '/sobre' },
  { name: 'Artigos', href: '/artigos' },
  { name: 'O Projeto', href: '/o-projeto' },
  { name: 'Contato', href: '/contato' },
] as const;

// Artigos is active on /artigos, /todos-artigos, /post/[slug] and /categoria/[slug].
const isArticlesActive = (pathname: string) =>
  pathname === '/artigos' ||
  pathname === '/todos-artigos' ||
  pathname.startsWith('/post/') ||
  pathname.startsWith('/categoria/');

// Pillar landing pages: all 4 are already implemented.
const SERVICE_LINKS = [
  { name: 'Engenharia de Software', href: '/software' },
  { name: 'Cloud & DevOps', href: '/plataforma' },
  { name: 'Integração & Automação', href: '/automacao' },
  { name: 'Inteligência Artificial', href: '/inteligencia-artificial' },
] as const;

// /servicos (central page): first item in the dropdown, above the 4 individual links.
const SERVICES_OVERVIEW_LINK = { name: 'Visão geral dos serviços', href: '/servicos' } as const;

export default function HeaderNav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isServicesMobileOpen, setIsServicesMobileOpen] = useState(false);
  const pathname = usePathname();
  const menuBtnRef = useRef<HTMLButtonElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

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

  // Closes both menus when crossing the desktop/mobile breakpoint.
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

  // Closes the dropdown/drawer immediately on every route change.
  const previousPathnameRef = useRef(pathname);
  useEffect(() => {
    if (previousPathnameRef.current === pathname) return;
    previousPathnameRef.current = pathname;
    setIsServicesOpen(false);
    setIsMenuOpen(false);
    setIsServicesMobileOpen(false);
  }, [pathname]);

  // Locks body scroll while the mobile drawer is open.
  useEffect(() => {
    if (!isMenuOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, [isMenuOpen]);

  // Moves focus into the drawer on open, same pattern as ConsentModal.
  useEffect(() => {
    if (isMenuOpen) drawerRef.current?.focus();
  }, [isMenuOpen]);

  // Escape closes the drawer (mirrors ConsentModal's Escape handling).
  useEffect(() => {
    if (!isMenuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMenu();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isMenuOpen]);

  // Real focus trap: keeps Tab cycling inside the drawer while it's open,
  // same pattern as ConsentModal.tsx's trapFocus.
  const trapDrawerFocus = (e: React.KeyboardEvent) => {
    if (e.key !== 'Tab' || !drawerRef.current) return;
    const focusable = drawerRef.current.querySelectorAll<HTMLElement>(
      'a[href], button:not([tabindex="-1"]), [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

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
      <nav className={styles.menu} aria-label="Navegação Principal" data-audit="header-menu">
        {NAV_LINKS_BEFORE.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            prefetch={false}
            className={isActive(link.href) ? styles.activeLink : ''}
            aria-current={isActive(link.href) ? 'page' : undefined}
          >
            {link.name}
          </Link>
        ))}

        <div className={styles.navDropdown} ref={servicesRef}>
          <span className={`${styles.navDropdownTrigger}${isServicesActive ? ` ${styles.activeLink}` : ''}`}>
            <Link
              href="/servicos"
              prefetch={false}
              className={isActive('/servicos') ? styles.activeLink : ''}
              aria-current={isActive('/servicos') ? 'page' : undefined}
            >
              Serviços
            </Link>
            <button
              ref={servicesTriggerRef}
              type="button"
              className={styles.navDropdownToggle}
              aria-expanded={isServicesOpen}
              aria-controls="services-dropdown"
              aria-label={isServicesOpen ? 'Ocultar páginas de serviços' : 'Mostrar páginas de serviços'}
              onClick={() => setIsServicesOpen((v) => !v)}
            >
              <svg className={styles.navDropdownChevron} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>
            </button>
          </span>
          <div id="services-dropdown" className={`${styles.navDropdownPanel}${isServicesOpen ? ` ${styles.dropdownOpen}` : ''}`}>
            <Link
              href={SERVICES_OVERVIEW_LINK.href}
              prefetch={false}
              onClick={() => setIsServicesOpen(false)}
              className={`${styles.navDropdownOverview}${pathname === SERVICES_OVERVIEW_LINK.href ? ` ${styles.activeLink}` : ''}`}
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
                className={isActive(link.href) ? styles.activeLink : ''}
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
            className={isActive(link.href) ? styles.activeLink : ''}
            aria-current={isActive(link.href) ? 'page' : undefined}
          >
            {link.name}
          </Link>
        ))}
      </nav>

      <Link href="/contato" className={`btn ${styles.navCta}`} prefetch={false} data-audit="header-cta">
        Apresentar um desafio
      </Link>

      <button
        ref={menuBtnRef}
        className={styles.navMobileBtn}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label={isMenuOpen ? 'Fechar menu' : 'Abrir menu'}
        aria-expanded={isMenuOpen}
        aria-controls="mobile-menu-dropdown"
        aria-haspopup="dialog"
      >
        {isMenuOpen ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M18 6L6 18M6 6l12 12"/></svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
        )}
      </button>

      <div
        className={`${styles.navMobileOverlay} ${isMenuOpen ? styles.overlayOpen : ''}`}
        aria-hidden="true"
        onClick={closeMenu}
      />

      <div
        id="mobile-menu-dropdown"
        ref={drawerRef}
        className={`${styles.navMobileMenu} ${isMenuOpen ? styles.menuOpen : ''}`}
        aria-hidden={!isMenuOpen}
        role="dialog"
        aria-modal={isMenuOpen}
        aria-label="Menu de navegação"
        tabIndex={-1}
        onKeyDown={trapDrawerFocus}
      >
        {NAV_LINKS_BEFORE.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            prefetch={false}
            onClick={closeMenu}
            tabIndex={isMenuOpen ? 0 : -1}
            className={isActive(link.href) ? styles.activeLink : ''}
            aria-current={isActive(link.href) ? 'page' : undefined}
          >
            {link.name}
          </Link>
        ))}

        <div className={`${styles.navMobileServicesToggle}${isServicesActive ? ` ${styles.activeLink}` : ''}`}>
          <Link
            href="/servicos"
            prefetch={false}
            onClick={closeMenu}
            tabIndex={isMenuOpen ? 0 : -1}
            className={isActive('/servicos') ? styles.activeLink : ''}
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
            <svg className={`${styles.navDropdownChevron}${isServicesMobileOpen ? ' is-open' : ''}`} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>
          </button>
        </div>
        {isServicesMobileOpen && (
          <div id="mobile-services-list" className={styles.navMobileServicesList}>
            <Link
              href={SERVICES_OVERVIEW_LINK.href}
              prefetch={false}
              onClick={closeMenu}
              tabIndex={isMenuOpen ? 0 : -1}
              className={`${styles.navDropdownOverview}${pathname === SERVICES_OVERVIEW_LINK.href ? ` ${styles.activeLink}` : ''}`}
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
                className={isActive(link.href) ? styles.activeLink : ''}
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
            className={isActive(link.href) ? styles.activeLink : ''}
            aria-current={isActive(link.href) ? 'page' : undefined}
          >
            {link.name}
          </Link>
        ))}
        <Link href="/contato" className={`btn ${styles.navCtaMobile}`} onClick={closeMenu} prefetch={false} tabIndex={isMenuOpen ? 0 : -1}>
          Apresentar um desafio
        </Link>
      </div>
    </>
  );
}
