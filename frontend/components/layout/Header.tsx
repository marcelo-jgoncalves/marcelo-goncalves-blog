'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Artigos', href: '/artigos' },
    { name: 'O Projeto', href: '/o-projeto' },
    { name: 'Serviços', href: '/servicos' },
    { name: 'Sobre', href: '/sobre' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header>
      <nav className="navbar">
        <Link href="/" className="logo" onClick={closeMenu}>
          Marcelo<span>Gonçalves</span>
        </Link>

        {/* Menu Desktop */}
        <div className="nav-links">
          {navLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href}
              style={{ 
                // CORREÇÃO: Só aplica cor fixa se estiver ativo. 
                // Se for undefined, o CSS global assume (permitindo o hover funcionar)
                color: isActive(link.href) ? 'var(--aws-orange)' : undefined,
                fontWeight: 500,
                transition: 'color 0.3s'
              }}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Botão Mobile */}
        <button 
          className="mobile-menu-btn" 
          onClick={toggleMenu}
          aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={isMenuOpen}
        >
          <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'}`} aria-hidden="true"></i>
        </button>

        {/* Menu Mobile */}
        <div className={`mobile-menu ${isMenuOpen ? 'active' : ''}`}>
          {navLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href} 
              onClick={closeMenu}
              style={{ 
                // Mesma lógica para o mobile
                color: isActive(link.href) ? 'var(--aws-orange)' : undefined,
                fontWeight: isActive(link.href) ? 600 : 500
              }}
            >
              {link.name}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}