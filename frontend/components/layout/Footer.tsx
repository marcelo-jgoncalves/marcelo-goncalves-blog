'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import './Footer.css';
import ConsentTrigger from '@/components/consent/ConsentTrigger';
import { AUTHOR_EMAIL, AUTHOR_LOCATION } from '@/lib/config';

// Visão geral first, then the 4 pillars.
const SERVICES_LINKS = [
  { name: 'Visão geral', href: '/servicos' },
  { name: 'Automação e Integração', href: '/automacao' },
  { name: 'Inteligência Artificial Aplicada', href: '/inteligencia-artificial' },
  { name: 'Sistemas e Plataformas', href: '/software' },
  { name: 'Cloud, DevOps e Confiabilidade', href: '/plataforma' },
];

// No "Serviços" (already has its own column) and no "Blog".
const NAVIGATION_LINKS = [
  { name: 'Home', href: '/' },
  { name: 'Sobre', href: '/sobre' },
  { name: 'Artigos', href: '/artigos' },
  { name: 'O Projeto', href: '/o-projeto' },
  { name: 'Contato', href: '/contato' },
];

export default function Footer() {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();
  const [locationCity, locationMode] = AUTHOR_LOCATION.split(' · ');

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

  // href="#top" is the real fallback (works without JS/if the handler throws);
  // preventDefault + smooth scroll is progressive enhancement on top of it.
  const scrollToTop = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="site-footer" aria-labelledby="site-footer-title" data-audit="footer">
      <h2 id="site-footer-title" className="sr-only">Rodapé do site</h2>
      <div className="foot-in" data-audit="footer-in">
        <div className="foot-top" data-audit="footer-top">
          <div className="foot-brand" data-audit="footer-brand">
            <Link href="/" className="b" aria-label="Marcelo Gonçalves — Página inicial">
              Marcelo<span className="b2">Gonçalves</span>
            </Link>
            <p>Consultoria boutique liderada por Marcelo Gonçalves, com atuação em automação, inteligência artificial, sistemas e arquitetura AWS.</p>
            <p className="foot-tagline">Engenharia e tecnologia para operações mais integradas, eficientes e preparadas para crescer.</p>
          </div>

          <nav className="foot-col" aria-label="Serviços no rodapé" data-audit="footer-col">
            <h3>Serviços</h3>
            <ul>
              {SERVICES_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    prefetch={false}
                    className={isActive(link.href) ? 'active' : ''}
                    aria-current={isActive(link.href) ? 'page' : undefined}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav className="foot-col" aria-label="Navegação no rodapé">
            <h3>Navegação</h3>
            <ul>
              {NAVIGATION_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    prefetch={false}
                    className={isActive(link.href) ? 'active' : ''}
                    aria-current={isActive(link.href) ? 'page' : undefined}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <section className="foot-col foot-contact" data-audit="footer-contact">
            <h3>Contato</h3>
            <p className="foot-col-lead">Conte o que sua empresa precisa melhorar.</p>
            <a className="foot-contact-email" href={`mailto:${AUTHOR_EMAIL}`}>{AUTHOR_EMAIL}</a>
            <p className="foot-contact-location">{locationCity}<br />{locationMode}</p>
            <Link href="/contato" className="btn foot-contact-cta" prefetch={false}>
              Apresentar um desafio <span className="arrow" aria-hidden="true">→</span>
            </Link>
          </section>
        </div>

        <div className="foot-bottom" data-audit="footer-bottom">
          <span className="foot-copyright">© {currentYear} Marcelo Gonçalves. Todos os direitos reservados.</span>
          <div className="foot-legal-row">
            <Link
              href="/politica-de-privacidade"
              prefetch={false}
              className={isActive('/politica-de-privacidade') ? 'active' : ''}
              aria-current={isActive('/politica-de-privacidade') ? 'page' : undefined}
            >
              Aviso de Privacidade
            </Link>
            <Link
              href="/politica-de-cookies"
              prefetch={false}
              className={isActive('/politica-de-cookies') ? 'active' : ''}
              aria-current={isActive('/politica-de-cookies') ? 'page' : undefined}
            >
              Política de Cookies
            </Link>
            <Link
              href="/termos-de-uso"
              prefetch={false}
              className={isActive('/termos-de-uso') ? 'active' : ''}
              aria-current={isActive('/termos-de-uso') ? 'page' : undefined}
            >
              Termos de Uso
            </Link>
            <ConsentTrigger />
          </div>
          <a href="#top" className="foot-to-top" onClick={scrollToTop}>
            Voltar ao topo
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 19V5"></path><path d="m5 12 7-7 7 7"></path></svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
