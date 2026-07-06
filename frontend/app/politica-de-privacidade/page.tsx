import '../legal.css';
import type { Metadata } from 'next';
import PageHero from '@/components/ui/PageHero';
import { SITE_URL, SITE_NAME } from '@/lib/config';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: { absolute: `Política de Privacidade | ${SITE_NAME}` },
  description: 'Saiba como coletamos, usamos e protegemos seus dados pessoais em conformidade com a LGPD.',
  alternates: { canonical: `${SITE_URL}/politica-de-privacidade` },
  openGraph: {
    title: `Política de Privacidade | ${SITE_NAME}`,
    url: `${SITE_URL}/politica-de-privacidade`,
    siteName: SITE_NAME,
  },
};

export default function PoliticaDePrivacidadePage() {
  return (
    <div className="theme-dark">
      <PageHero>
        <h1 className="hero-title">Política de <span className="highlight">Privacidade</span></h1>
        <p className="hero-subtitle">
          Como coletamos, usamos e protegemos seus dados pessoais.
        </p>
      </PageHero>

      <div className="legal-container container">
        <div className="legal-content">
          <p className="legal-updated">Última atualização: [data a definir]</p>

          <h2>1. Quem Somos</h2>
          <p>
            [Nome do responsável / empresa] é o controlador dos dados pessoais coletados por este site,
            localizado em [endereço]. Para dúvidas sobre esta política, entre em contato pelo e-mail
            <a href="mailto:marcelo.mjgoncalves@gmail.com"> marcelo.mjgoncalves@gmail.com</a>.
          </p>

          <h2>2. Dados que Coletamos</h2>
          <p>Podemos coletar os seguintes dados pessoais:</p>
          <ul>
            <li>Nome e endereço de e-mail (quando você se inscreve na newsletter ou entra em contato);</li>
            <li>Dados de navegação (páginas visitadas, tempo de sessão, via cookies analíticos);</li>
            <li>Endereço IP e informações do dispositivo (coletados automaticamente pelo servidor).</li>
          </ul>

          <h2>3. Como Usamos Seus Dados</h2>
          <p>Utilizamos os dados coletados para:</p>
          <ul>
            <li>Enviar a newsletter, caso você tenha se inscrito voluntariamente;</li>
            <li>Responder às suas mensagens e solicitações;</li>
            <li>Analisar o desempenho do site e melhorar o conteúdo;</li>
            <li>Cumprir obrigações legais.</li>
          </ul>

          <h2>4. Base Legal (LGPD)</h2>
          <p>
            O tratamento dos seus dados é fundamentado nas seguintes bases legais previstas na
            Lei Geral de Proteção de Dados (Lei nº 13.709/2018):
          </p>
          <ul>
            <li><strong>Consentimento</strong> — para envio de newsletter e uso de cookies não essenciais;</li>
            <li><strong>Legítimo interesse</strong> — para análise de tráfego e segurança do site;</li>
            <li><strong>Cumprimento de obrigação legal</strong> — quando exigido por lei.</li>
          </ul>

          <h2>5. Compartilhamento de Dados</h2>
          <p>
            Não vendemos seus dados pessoais. Podemos compartilhá-los apenas com prestadores de serviço
            que nos auxiliam na operação do site (ex.: serviços de e-mail, hospedagem em nuvem),
            sempre sob acordos que garantem a proteção dos dados.
          </p>

          <h2>6. Retenção dos Dados</h2>
          <p>
            Mantemos seus dados pelo tempo necessário para a finalidade para a qual foram coletados,
            ou enquanto houver base legal para o tratamento. Dados de newsletter são removidos
            imediatamente após o descadastramento.
          </p>

          <h2>7. Seus Direitos</h2>
          <p>
            Nos termos da LGPD, você tem direito a:
          </p>
          <ul>
            <li>Confirmar se tratamos seus dados;</li>
            <li>Acessar, corrigir ou solicitar a exclusão dos seus dados;</li>
            <li>Revogar o consentimento a qualquer momento;</li>
            <li>Solicitar a portabilidade dos dados;</li>
            <li>Apresentar reclamação à ANPD.</li>
          </ul>
          <p>
            Para exercer qualquer desses direitos, envie um e-mail para{' '}
            <a href="mailto:marcelo.mjgoncalves@gmail.com">marcelo.mjgoncalves@gmail.com</a>.
          </p>

          <h2>8. Cookies</h2>
          <p>
            Este site utiliza cookies. Consulte nossa{' '}
            <a href="/politica-de-cookies">Política de Cookies</a> para mais detalhes.
          </p>

          <h2>9. Alterações nesta Política</h2>
          <p>
            Podemos atualizar esta política periodicamente. A data de última atualização será sempre
            indicada no topo desta página. O uso continuado do site após a publicação de alterações
            constitui aceitação das mudanças.
          </p>
        </div>
      </div>
    </div>
  );
}
