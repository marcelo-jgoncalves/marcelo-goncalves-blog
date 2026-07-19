'use client';

import Link from 'next/link';
import './Footer.css';
import ConsentTrigger from '@/components/consent/ConsentTrigger';

// Os 4 pilares (mesmas landing pages de frontend/app/<slug>/page.tsx) — não são mais
// categorias de blog, ver ESPECIFICACAO-FOOTER.md (atualização 2026-07-12).
const ESPECIALIDADES_LINKS = [
  { name: 'Engenharia de Software', href: '/engenharia-de-software' },
  { name: 'Inteligência Artificial', href: '/inteligencia-artificial' },
  { name: 'Integração & Automação', href: '/integracao-automacao' },
  { name: 'Cloud & DevOps', href: '/cloud-devops' },
];

// Mesma ordem do nav principal (HeaderNav.tsx): Home, Serviços, Contato, Sobre, Blog, O Projeto.
// "O Projeto" é item fixo (2026-07-15) — não mais condicional ao contexto de blog/post.
const QUICK_LINKS = [
  { name: 'Home', href: '/' },
  { name: 'Serviços', href: '/#servicos' },
  { name: 'Contato', href: '/contato' },
  { name: 'Sobre', href: '/sobre' },
  { name: 'Blog', href: '/blog' },
  { name: 'O Projeto', href: '/o-projeto' },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="site-footer" data-audit="footer">
      <div className="foot-in" data-audit="footer-in">
        <div className="foot-lead" data-audit="footer-lead">
          <div className="manifesto" data-audit="footer-manifesto">
            Engenharia, IA e automação para quem quer <em>destravar valor</em> com tecnologia.
          </div>
          <button type="button" className="btn to-top" onClick={scrollToTop} aria-label="Voltar ao topo" data-audit="footer-to-top">
            Voltar ao topo
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 19V5"></path><path d="m5 12 7-7 7 7"></path></svg>
          </button>
        </div>

        <div className="foot-top" data-audit="footer-top">
          <div className="foot-brand" data-audit="footer-brand">
            <div className="b">Marcelo<span className="b2">Gonçalves</span></div>
            <p>Desenvolvemos software, plataformas em nuvem, integrações e soluções com inteligência artificial para empresas que desejam crescer com tecnologia.</p>
          </div>

          <div className="foot-col" data-audit="footer-col">
            <h5>Especialidades</h5>
            <ul>
              {ESPECIALIDADES_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} prefetch={false}>{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="foot-col">
            <h5>Links Rápidos</h5>
            <ul>
              {QUICK_LINKS.map((link) => (
                <li key={link.name}>
                  {link.href.includes('#') ? (
                    <a href={link.href}>{link.name}</a>
                  ) : (
                    <Link href={link.href} prefetch={false}>{link.name}</Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="foot-col">
            <h5>Contato</h5>
            <p className="foot-col-lead">Vamos conversar sobre seu próximo projeto.</p>
            <div className="foot-soc" data-audit="footer-soc">
              <Link href="/contato" title="Contato" aria-label="Contato" data-audit="footer-contact">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"></rect><path d="m3 7 9 6 9-6"></path></svg>
              </Link>
              <a href="https://www.linkedin.com/in/marcelo-jgoncalves" target="_blank" rel="noopener noreferrer" title="LinkedIn" aria-label="LinkedIn">
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.4c0-1.3 0-2.96-1.8-2.96s-2.08 1.4-2.08 2.86V21H9z"></path></svg>
              </a>
              <span role="img" aria-label="Instagram (em breve)">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"></rect><circle cx="12" cy="12" r="4"></circle><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"></circle></svg>
              </span>
            </div>
          </div>
        </div>

        <div className="foot-bottom" data-audit="footer-bottom">
          <div className="foot-legal">
            <div className="foot-legal-row">
              <span>© {currentYear} Marcelo Gonçalves · Todos os direitos reservados</span>
              <Link href="/politica-de-privacidade" prefetch={false}>Aviso de Privacidade</Link>
              <Link href="/politica-de-cookies" prefetch={false}>Política de Cookies</Link>
            </div>
            <div className="foot-legal-row">
              <Link href="/termos-de-uso" prefetch={false}>Termos de Uso</Link>
              <ConsentTrigger />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
