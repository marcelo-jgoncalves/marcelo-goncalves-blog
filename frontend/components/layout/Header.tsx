'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header>
      {/* CORREÇÃO: class -> className */}
      <nav className="navbar">
        <Link href="/" className="logo" onClick={closeMenu}>
          Marcelo<span>Gonçalves</span>
        </Link>

        <div className="nav-links">
          <Link href="/">Home</Link>
          <Link href="/artigos">Artigos</Link>
          <Link href="/o-projeto">O Projeto</Link>
          <Link href="/servicos" style={{ color: 'var(--aws-orange)', fontWeight: 600 }}>Serviços</Link>
          <Link href="/sobre">Sobre</Link>
        </div>

        <button 
          className="mobile-menu-btn" 
          onClick={toggleMenu}
          aria-label="Abrir menu de navegação"
          aria-expanded={isMenuOpen}
        >
          {/* CORREÇÃO: class -> className */}
          <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'}`} aria-hidden="true"></i>
        </button>

        <div className={`mobile-menu ${isMenuOpen ? 'active' : ''}`}>
          <Link href="/" onClick={closeMenu}>Home</Link>
          <Link href="/artigos" onClick={closeMenu}>Artigos</Link>
          <Link href="/o-projeto" onClick={closeMenu}>O Projeto</Link>
          <Link href="/servicos" onClick={closeMenu} style={{ color: 'var(--aws-orange)' }}>Serviços</Link>
          <Link href="/sobre" onClick={closeMenu}>Sobre</Link>
        </div>
      </nav>
    </header>
  );
}
