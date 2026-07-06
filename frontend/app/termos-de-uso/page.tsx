import '../legal.css';
import type { Metadata } from 'next';
import PageHero from '@/components/ui/PageHero';
import { SITE_URL, SITE_NAME } from '@/lib/config';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: { absolute: `Termos de Uso | ${SITE_NAME}` },
  description: 'Termos e condições de uso do blog Marcelo Gonçalves.',
  alternates: { canonical: `${SITE_URL}/termos-de-uso` },
  openGraph: {
    title: `Termos de Uso | ${SITE_NAME}`,
    url: `${SITE_URL}/termos-de-uso`,
    siteName: SITE_NAME,
  },
};

export default function TermosDeUsoPage() {
  return (
    <div className="theme-dark">
      <PageHero>
        <h1 className="hero-title">Termos de <span className="highlight">Uso</span></h1>
        <p className="hero-subtitle">
          Condições que regem o acesso e uso deste site.
        </p>
      </PageHero>

      <div className="legal-container container">
        <div className="legal-content">
          <p className="legal-updated">Última atualização: [data a definir]</p>

          <h2>1. Aceitação dos Termos</h2>
          <p>
            Ao acessar e utilizar este site, você concorda com os presentes Termos de Uso.
            Caso não concorde com alguma condição, solicitamos que não utilize o site.
          </p>

          <h2>2. Sobre o Site</h2>
          <p>
            Este é um blog de conteúdo técnico sobre AWS, DevOps, FinOps e Inteligência Artificial,
            criado e mantido por Marcelo Gonçalves. O conteúdo é de caráter educativo e informativo.
          </p>

          <h2>3. Uso Permitido</h2>
          <p>Você pode utilizar este site para:</p>
          <ul>
            <li>Ler e compartilhar os artigos publicados, com devida atribuição ao autor;</li>
            <li>Entrar em contato para fins profissionais ou de assessoria;</li>
            <li>Inscrever-se na newsletter para receber novos conteúdos.</li>
          </ul>

          <h2>4. Uso Proibido</h2>
          <p>É proibido:</p>
          <ul>
            <li>Reproduzir ou redistribuir conteúdo sem autorização prévia e expressa;</li>
            <li>Utilizar o site para fins ilegais ou que violem direitos de terceiros;</li>
            <li>Tentar acessar áreas restritas ou sistemas do site sem autorização;</li>
            <li>Publicar conteúdo ofensivo, discriminatório ou enganoso nos comentários.</li>
          </ul>

          <h2>5. Propriedade Intelectual</h2>
          <p>
            Todo o conteúdo deste site — textos, imagens, código, logotipos e design — é de
            propriedade de Marcelo Gonçalves ou de seus respectivos detentores e está protegido
            pelas leis de direitos autorais. O uso não autorizado pode resultar em responsabilização civil e criminal.
          </p>

          <h2>6. Links Externos</h2>
          <p>
            Este site pode conter links para sites de terceiros. Não nos responsabilizamos pelo
            conteúdo, políticas de privacidade ou práticas de sites externos. A inclusão de um
            link não implica endosso ao site vinculado.
          </p>

          <h2>7. Isenção de Responsabilidade</h2>
          <p>
            O conteúdo é fornecido &ldquo;como está&rdquo;, sem garantias de qualquer natureza. Não nos
            responsabilizamos por decisões tomadas com base no conteúdo publicado. Recomendamos
            sempre validar as informações técnicas no contexto específico do seu ambiente.
          </p>

          <h2>8. Disponibilidade do Site</h2>
          <p>
            Não garantimos disponibilidade ininterrupta do site. Manutenções, atualizações e
            eventos fora do nosso controle podem causar indisponibilidade temporária.
          </p>

          <h2>9. Modificações</h2>
          <p>
            Reservamo-nos o direito de alterar estes Termos a qualquer momento. As alterações
            entram em vigor na data de publicação. O uso continuado do site após as alterações
            constitui aceitação dos novos termos.
          </p>

          <h2>10. Lei Aplicável e Foro</h2>
          <p>
            Estes Termos são regidos pela legislação brasileira. Fica eleito o foro da Comarca
            de [cidade a definir], com exclusão de qualquer outro, por mais privilegiado que seja.
          </p>

          <h2>11. Contato</h2>
          <p>
            Para dúvidas sobre estes Termos, entre em contato pelo e-mail{' '}
            <a href="mailto:marcelo.mjgoncalves@gmail.com">marcelo.mjgoncalves@gmail.com</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
