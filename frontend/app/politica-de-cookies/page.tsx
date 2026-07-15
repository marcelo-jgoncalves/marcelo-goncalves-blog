import '../legal.css';
import type { Metadata } from 'next';
import PageHero from '@/components/ui/PageHero';
import { SITE_URL, SITE_NAME } from '@/lib/config';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: { absolute: `Política de Cookies | ${SITE_NAME}` },
  description: 'Entenda como utilizamos cookies neste site e como você pode gerenciá-los.',
  alternates: { canonical: `${SITE_URL}/politica-de-cookies` },
  openGraph: {
    title: `Política de Cookies | ${SITE_NAME}`,
    url: `${SITE_URL}/politica-de-cookies`,
    siteName: SITE_NAME,
  },
};

export default function PoliticaDeCookiesPage() {
  return (
    <>
      <PageHero singleColumn>
        <h1 className="hero-title">Política de <span className="highlight">Cookies</span></h1>
        <p className="hero-subtitle">
          O que são cookies, quais usamos e como você pode gerenciá-los.
        </p>
      </PageHero>

      <div className="legal-container container">
        <div className="legal-content">
          <p className="legal-updated">Última atualização: [data a definir]</p>

          <h2>1. O que São Cookies</h2>
          <p>
            Cookies são pequenos arquivos de texto armazenados no seu dispositivo quando você
            visita um site. Eles permitem que o site lembre suas preferências e melhore sua
            experiência de navegação em visitas futuras.
          </p>

          <h2>2. Cookies que Utilizamos</h2>

          <p><strong>Cookies Essenciais</strong></p>
          <p>
            Necessários para o funcionamento básico do site. Não podem ser desativados.
            Não coletam dados pessoais identificáveis.
          </p>
          <ul>
            <li>Preferências de consentimento de cookies;</li>
            <li>Manutenção de sessão de navegação.</li>
          </ul>

          <p><strong>Cookies Analíticos</strong></p>
          <p>
            Utilizados para entender como os visitantes interagem com o site — páginas acessadas,
            tempo de permanência e origem do tráfego. Os dados são coletados de forma agregada e
            anônima. Requerem seu consentimento.
          </p>
          <ul>
            <li>[Ferramenta de analytics a definir, ex.: Google Analytics, Plausible];</li>
          </ul>

          <p><strong>Cookies de Publicidade (AdSense)</strong></p>
          <p>
            Quando ativo, o Google AdSense pode utilizar cookies para exibir anúncios personalizados
            com base nos seus interesses. Requerem seu consentimento explícito.
          </p>

          <h2>3. Cookies de Terceiros</h2>
          <p>
            Alguns conteúdos incorporados neste site (vídeos, mapas, botões de compartilhamento)
            podem definir seus próprios cookies. Não temos controle sobre esses cookies — consulte
            as políticas de privacidade dos respectivos serviços.
          </p>

          <h2>4. Como Gerenciar Cookies</h2>
          <p>
            Você pode controlar e excluir cookies nas configurações do seu navegador:
          </p>
          <ul>
            <li><strong>Chrome:</strong> Configurações → Privacidade e segurança → Cookies;</li>
            <li><strong>Firefox:</strong> Preferências → Privacidade e Segurança;</li>
            <li><strong>Safari:</strong> Preferências → Privacidade;</li>
            <li><strong>Edge:</strong> Configurações → Cookies e permissões do site.</li>
          </ul>
          <p>
            Note que desabilitar cookies pode afetar o funcionamento de algumas funcionalidades do site.
          </p>

          <h2>5. Consentimento</h2>
          <p>
            Ao acessar este site, você será informado sobre o uso de cookies e poderá aceitar ou
            recusar os cookies não essenciais. Você pode alterar sua preferência a qualquer momento
            pelo painel de gerenciamento de cookies.
          </p>

          <h2>6. Mais Informações</h2>
          <p>
            Para dúvidas sobre o uso de cookies, consulte nossa{' '}
            <a href="/politica-de-privacidade">Política de Privacidade</a> ou entre em contato
            pelo e-mail{' '}
            <a href="mailto:marcelo.mjgoncalves@gmail.com">marcelo.mjgoncalves@gmail.com</a>.
          </p>
        </div>
      </div>
    </>
  );
}
