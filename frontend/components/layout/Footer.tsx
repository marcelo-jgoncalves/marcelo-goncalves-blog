'use client';

import Link from 'next/link';
import './Footer.css';
import ConsentTrigger from '@/components/consent/ConsentTrigger';

const CATEGORY_LINKS = [
  { name: 'Inteligência Artificial', href: '/categoria/inteligencia-artificial' },
  { name: 'DevOps', href: '/categoria/devops-automacao' },
  { name: 'Cloud · AWS', href: '/categoria/cloud-computing' },
  { name: 'Engenharia', href: '/categoria/engenharia-de-software' },
];

const QUICK_LINKS = [
  { name: 'Todos os Artigos', href: '/artigos' },
  { name: 'O Projeto', href: '/o-projeto' },
  { name: 'Serviços', href: '/servicos' },
  { name: 'Sobre', href: '/sobre' },
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
            Engenharia, IA e automação — <em>decifradas</em> por quem constrói em produção.
          </div>
          <button type="button" className="to-top" onClick={scrollToTop} aria-label="Voltar ao topo" data-audit="footer-to-top">
            Voltar ao topo
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 19V5"></path><path d="m5 12 7-7 7 7"></path></svg>
          </button>
        </div>

        <div className="foot-top" data-audit="footer-top">
          <div className="foot-brand" data-audit="footer-brand">
            <div className="b">Marcelo<span className="b2">Gonçalves</span></div>
            <p>Tutoriais, bastidores e decisões reais de um blog construído do zero na AWS, quase 100% com IA.</p>
            <span className="badge"><span className="dot" aria-hidden="true" />No ar · construído com IA</span>
          </div>

          <div className="foot-col" data-audit="footer-col">
            <h5>Categorias</h5>
            <ul>
              {CATEGORY_LINKS.map((link) => (
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
                <li key={link.href}>
                  <Link href={link.href} prefetch={false}>{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="foot-col">
            <h5>Contato</h5>
            <a className="contact" href="mailto:contato@marcelogoncalves.com" data-audit="footer-contact">
              <span className="ic">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"></rect><path d="m3 7 9 6 9-6"></path></svg>
              </span>
              contato@marcelogoncalves.com
            </a>
            <div className="foot-soc" data-audit="footer-soc">
              <a href="https://www.linkedin.com/in/marcelo-jgoncalves" target="_blank" rel="noopener noreferrer" title="LinkedIn" aria-label="LinkedIn">
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.4c0-1.3 0-2.96-1.8-2.96s-2.08 1.4-2.08 2.86V21H9z"></path></svg>
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" title="Instagram" aria-label="Instagram">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"></rect><circle cx="12" cy="12" r="4"></circle><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"></circle></svg>
              </a>
              <a href="https://github.com/marcelo-jgoncalves" target="_blank" rel="noopener noreferrer" title="GitHub" aria-label="GitHub">
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"></path></svg>
              </a>
            </div>
          </div>
        </div>

        <div className="foot-watermark" aria-hidden="true" data-audit="footer-watermark">MarceloGonçalves</div>

        <div className="foot-bottom" data-audit="footer-bottom">
          <span>© {currentYear} Marcelo Gonçalves · Todos os direitos reservados</span>
          <div className="links">
            <Link href="/politica-de-privacidade" prefetch={false}>Privacidade</Link>
            <Link href="/termos-de-uso" prefetch={false}>Termos</Link>
            <Link href="/feed.xml" prefetch={false}>RSS</Link>
            <ConsentTrigger />
          </div>
        </div>
      </div>
    </footer>
  );
}
