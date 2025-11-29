import Link from 'next/link';

export default function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="footer-content">
          {/* Coluna 1: Marca */}
          <div className="footer-column">
            <h3>Marcelo Gonçalves</h3>
            <p>Inteligência Artificial, DevOps, Engenharia de Software e AWS.</p>
            <div className="social-links">
              <a href="#" aria-label="LinkedIn"><i className="fab fa-linkedin-in"></i></a>
              <a href="#" aria-label="GitHub"><i className="fab fa-github"></i></a>
              <a href="#" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
            </div>
          </div>

          {/* Coluna 2: Categorias */}
          <div className="footer-column">
            <h3>Categorias</h3>
            <div className="footer-links">
              <Link href="/categoria/inteligencia-artificial">Inteligência Artificial</Link>
              <Link href="/categoria/cloud-computing">Cloud Computing</Link>
              <Link href="/categoria/devops-automacao">DevOps e Automação</Link>
              <Link href="/categoria/seguranca-na-nuvem">Segurança na Nuvem</Link>
              <Link href="/categoria/engenharia-de-software">Engenharia de Software</Link>
              <Link href="/categoria/noticias-e-mercado">Notícias e Mercado</Link>
            </div>
          </div>

          {/* Coluna 3: Links Rápidos */}
          <div className="footer-column">
            <h3>Links Rápidos</h3>
            <div className="footer-links">
              <Link href="/artigos">Todos os Artigos</Link>
              <Link href="/o-projeto">O Projeto</Link>
              <Link href="/servicos">Serviços</Link>
              <Link href="/newsletter">Newsletter</Link>
            </div>
          </div>

          {/* Coluna 4: Contato */}
          <div className="footer-column">
            <h3>Contato</h3>
            <div className="footer-links">
              <a href="mailto:contato@marcelogoncalves.com.br">
                <i className="fas fa-envelope" style={{ marginRight: '8px' }}></i> 
                contato@iadecifrada.com
              </a>
            </div>
          </div>
        </div>

        <div className="copyright">
          <p>&copy; {new Date().getFullYear()} Marcelo Gonçalves. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
