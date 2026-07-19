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
          <p className="legal-updated">Última atualização: 18 de julho de 2026</p>

          <p>
            Esta Política de Cookies explica como o site {SITE_URL} utiliza cookies e tecnologias
            semelhantes durante a navegação.
          </p>
          <p>
            Ela complementa o nosso <a href="/politica-de-privacidade">Aviso de Privacidade</a>, no qual
            são apresentadas informações mais amplas sobre o tratamento de dados pessoais realizado pelo
            site.
          </p>

          <h2>1. Quem é o responsável pelo site</h2>
          <p>O responsável pelas decisões relacionadas ao uso de cookies e ao tratamento dos dados pessoais é:</p>
          <p>
            <strong>Controlador:</strong> Marcelo Gonçalves<br />
            <strong>Localidade:</strong> Belo Horizonte, Minas Gerais, Brasil<br />
            <strong>E-mail para assuntos de privacidade:</strong>{' '}
            <a href="mailto:marcelo.mjgoncalves@gmail.com">marcelo.mjgoncalves@gmail.com</a>
          </p>

          <h2>2. O que são cookies</h2>
          <p>Cookies são pequenos arquivos armazenados no navegador ou no dispositivo do visitante durante o acesso a um site.</p>
          <p>Eles podem ser utilizados, por exemplo, para:</p>
          <ul>
            <li>permitir o funcionamento de recursos essenciais;</li>
            <li>registrar escolhas e preferências;</li>
            <li>manter configurações durante a navegação;</li>
            <li>produzir estatísticas sobre o uso do site;</li>
            <li>compreender como páginas e conteúdos são acessados.</li>
          </ul>
          <p>Os cookies podem ser temporários, permanecendo apenas durante uma sessão, ou persistentes, permanecendo no dispositivo por um período determinado ou até serem excluídos pelo usuário.</p>

          <h2>3. Tecnologias semelhantes</h2>
          <p>Além de cookies, um site pode utilizar tecnologias como armazenamento local do navegador, identificadores técnicos, pixels e tags.</p>
          <p>Atualmente, este site não utiliza pixels publicitários nem tecnologias destinadas à criação de perfis para publicidade comportamental.</p>
          <p>Quando necessário, o armazenamento local do navegador poderá ser utilizado exclusivamente para registrar a escolha do visitante sobre cookies. Para os fins desta Política, essas tecnologias são tratadas de forma semelhante aos cookies.</p>

          <h2>4. Categorias utilizadas</h2>
          <p>Atualmente, o site utiliza ou poderá utilizar duas categorias:</p>

          <h3>4.1. Cookies necessários</h3>
          <p>São recursos indispensáveis ao funcionamento de determinadas funcionalidades ou à preservação de escolhas feitas pelo próprio visitante.</p>
          <p>Eles podem ser utilizados para:</p>
          <ul>
            <li>registrar a preferência sobre cookies;</li>
            <li>impedir que o banner seja exibido repetidamente;</li>
            <li>manter configurações essenciais;</li>
            <li>preservar a segurança e a integridade da navegação.</li>
          </ul>
          <p>Esses cookies não são utilizados para publicidade ou criação de perfis comerciais.</p>
          <p>Como são necessários para fornecer funcionalidades solicitadas pelo visitante ou manter sua escolha de privacidade, eles não dependem da autorização para cookies analíticos.</p>

          <h3>4.2. Cookies analíticos</h3>
          <p>São utilizados para compreender como o site é acessado e utilizado.</p>
          <p>Mediante autorização do visitante, o Google Analytics 4 poderá coletar estatísticas sobre:</p>
          <ul>
            <li>páginas visitadas;</li>
            <li>duração e sequência das sessões;</li>
            <li>interações com conteúdos;</li>
            <li>origem aproximada do acesso;</li>
            <li>tipo de dispositivo;</li>
            <li>navegador e sistema operacional;</li>
            <li>localização geográfica aproximada;</li>
            <li>número aproximado de visitantes e sessões.</li>
          </ul>
          <p>Esses dados ajudam a avaliar o desempenho das páginas, identificar conteúdos relevantes e melhorar a experiência de navegação.</p>
          <p>Os cookies analíticos não são necessários para acessar o site e somente serão ativados quando o visitante autorizar essa categoria.</p>

          <h2>5. Cookies utilizados</h2>
          <p>A relação abaixo apresenta os cookies previstos na configuração atual.</p>
          <div className="legal-table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Cookie ou tecnologia</th>
                  <th>Fornecedor</th>
                  <th>Categoria</th>
                  <th>Finalidade</th>
                  <th>Duração prevista</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Cookie ou registro de preferência de consentimento</td>
                  <td>Próprio site</td>
                  <td>Necessário</td>
                  <td>Registrar se o visitante aceitou ou rejeitou os cookies analíticos</td>
                  <td>Até 6 meses</td>
                </tr>
                <tr>
                  <td><code>_ga</code></td>
                  <td>Google Analytics</td>
                  <td>Analítico</td>
                  <td>Diferenciar visitantes e sessões por meio de um identificador técnico</td>
                  <td>Até 2 anos</td>
                </tr>
                <tr>
                  <td><code>_ga_&lt;ID&gt;</code></td>
                  <td>Google Analytics</td>
                  <td>Analítico</td>
                  <td>Manter informações relacionadas ao estado da sessão</td>
                  <td>Até 2 anos</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            O nome técnico do cookie ou registro usado para guardar a preferência deverá ser confirmado
            durante a implementação e poderá variar, por exemplo: <code>cookie_consent</code> ou{' '}
            <code>analytics_consent</code>. A política publicada utiliza o nome que realmente estiver
            configurado no site.
          </p>
          <p>Segundo a documentação do Google, o GA4 utiliza o cookie <code>_ga</code> para diferenciar usuários e sessões. Os cookies <code>_ga</code> e <code>_ga_&lt;ID&gt;</code> possuem validade padrão de até dois anos, embora o navegador possa impor prazos menores.</p>

          <h2>6. Base legal</h2>

          <h3>Cookies necessários</h3>
          <p>O uso dos cookies necessários poderá estar fundamentado na necessidade de fornecer funcionalidades solicitadas pelo visitante, preservar sua escolha de privacidade, manter a segurança e assegurar o funcionamento básico da plataforma.</p>
          <p>Dependendo da finalidade concreta, o tratamento poderá estar relacionado ao legítimo interesse do controlador ou aos procedimentos necessários para fornecer a funcionalidade solicitada.</p>

          <h3>Cookies analíticos</h3>
          <p>Os cookies do Google Analytics são utilizados com base no consentimento do visitante.</p>
          <p>O visitante poderá:</p>
          <ul>
            <li>aceitar os cookies analíticos;</li>
            <li>rejeitar os cookies analíticos;</li>
            <li>continuar navegando após a rejeição;</li>
            <li>alterar sua escolha posteriormente;</li>
            <li>retirar o consentimento a qualquer momento.</li>
          </ul>
          <p>A rejeição dos cookies analíticos não deverá impedir o acesso aos artigos, às páginas institucionais, ao formulário ou ao botão de WhatsApp.</p>
          <p>A LGPD prevê o consentimento como uma das bases legais para o tratamento de dados pessoais e determina que ele possa ser revogado por procedimento gratuito e facilitado.</p>

          <h2>7. Como a escolha é apresentada</h2>
          <p>Ao acessar o site pela primeira vez, o visitante receberá informações sobre a utilização de cookies necessários e analíticos.</p>
          <p>Serão apresentadas opções para:</p>
          <ul>
            <li>aceitar os cookies analíticos;</li>
            <li>rejeitar os cookies analíticos;</li>
            <li>consultar informações adicionais.</li>
          </ul>
          <p>Os botões de aceitação e rejeição deverão ser apresentados de maneira igualmente acessível, sem induzir o visitante a escolher uma opção específica.</p>
          <p>A ausência de uma escolha não deverá ser interpretada como consentimento.</p>
          <p>Enquanto o visitante não autorizar os cookies analíticos, o site não deverá armazenar os identificadores do Google Analytics em seu dispositivo.</p>

          <h2>8. Alteração ou retirada do consentimento</h2>
          <p>O visitante poderá modificar sua escolha por meio do link:</p>
          <p><strong>Preferências de cookies</strong></p>
          <p>Esse link deverá permanecer disponível no rodapé do site.</p>
          <p>Ao retirar o consentimento:</p>
          <ul>
            <li>novas informações não deverão ser coletadas pelo Google Analytics;</li>
            <li>o armazenamento analítico deverá ser desativado;</li>
            <li>os cookies analíticos controlados pelo site deverão ser removidos quando tecnicamente possível;</li>
            <li>o funcionamento essencial da plataforma deverá permanecer disponível.</li>
          </ul>
          <p>A retirada do consentimento não torna ilícitos os tratamentos realizados de maneira válida antes da revogação, conforme as condições previstas pela LGPD.</p>

          <h2>9. Google Analytics 4</h2>
          <p>O site utiliza o Google Analytics 4, serviço fornecido pelo Google, exclusivamente depois da autorização do visitante.</p>
          <p>O Google Analytics auxilia na produção de relatórios estatísticos sobre audiência e uso do site.</p>
          <p>A implementação não deverá enviar ao Google Analytics:</p>
          <ul>
            <li>nome;</li>
            <li>e-mail;</li>
            <li>número de telefone;</li>
            <li>nome de empresa;</li>
            <li>conteúdo enviado pelo formulário;</li>
            <li>conteúdo de mensagens;</li>
            <li>dados pessoais sensíveis;</li>
            <li>credenciais ou informações confidenciais.</li>
          </ul>
          <p>Eventos personalizados também não deverão incluir dados que permitam identificar diretamente um visitante.</p>
          <p>Quando o armazenamento analítico está desativado por meio das configurações de consentimento, o identificador de cliente não deve ser armazenado no cookie <code>_ga</code>.</p>

          <h2>10. Recursos publicitários</h2>
          <p>O site não utiliza atualmente:</p>
          <ul>
            <li>Google AdSense;</li>
            <li>Google Ads;</li>
            <li>remarketing;</li>
            <li>pixels publicitários;</li>
            <li>Meta Pixel;</li>
            <li>publicidade comportamental;</li>
            <li>criação de públicos para anúncios;</li>
            <li>compartilhamento de listas de contatos para publicidade.</li>
          </ul>
          <p>O Google Analytics deverá ser configurado exclusivamente para análise estatística, sem integração com ferramentas de publicidade.</p>
          <p>Caso essas práticas sejam adotadas no futuro, esta Política e o mecanismo de consentimento deverão ser revisados antes da ativação.</p>

          <h2>11. Retenção no Google Analytics</h2>
          <p>A propriedade do Google Analytics está configurada para manter dados de usuários e eventos pelo período de 14 meses.</p>
          <p>Esse período se refere aos dados em nível de usuário e de evento sujeitos à configuração de retenção do Google Analytics. Relatórios estatísticos agregados podem não estar sujeitos à mesma exclusão automática.</p>
          <p>O prazo de retenção do Google Analytics é diferente do prazo de validade dos cookies armazenados no navegador:</p>
          <ul>
            <li>retenção configurada no GA4: 14 meses;</li>
            <li>validade padrão dos cookies <code>_ga</code>: até 2 anos;</li>
            <li>preferência de consentimento do site: até 6 meses.</li>
          </ul>

          <h2>12. Processamento por terceiros</h2>
          <p>Quando os cookies analíticos forem autorizados, determinadas informações poderão ser processadas pelo Google para fornecer o Google Analytics.</p>
          <p>O Google poderá atuar por meio de empresas relacionadas, servidores e prestadores localizados em diferentes países.</p>
          <p>O tratamento realizado diretamente pelo Google está sujeito aos termos, às medidas de segurança e às políticas aplicáveis ao Google Analytics.</p>
          <p>O site não vende nem aluga os dados coletados por meio dos cookies.</p>

          <h2>13. Transferência internacional</h2>
          <p>O uso do Google Analytics pode envolver a transferência ou o acesso a dados fora do Brasil.</p>
          <p>Além disso, a infraestrutura principal do site utiliza serviços da Amazon Web Services na região <code>us-east-1</code>, localizada nos Estados Unidos. Entretanto, os cookies do Google Analytics são especificamente tratados no contexto dos serviços fornecidos pelo Google.</p>
          <p>Quando houver transferência internacional, deverão ser observados os mecanismos previstos na LGPD e na regulamentação da Autoridade Nacional de Proteção de Dados.</p>

          <h2>14. Configurações do navegador</h2>
          <p>Os navegadores normalmente permitem:</p>
          <ul>
            <li>consultar os cookies armazenados;</li>
            <li>bloquear cookies;</li>
            <li>excluir cookies;</li>
            <li>bloquear cookies de terceiros;</li>
            <li>definir regras específicas para cada site;</li>
            <li>apagar dados de navegação.</li>
          </ul>
          <p>A exclusão dos cookies pelo navegador poderá fazer com que o banner de preferências seja apresentado novamente, pois o site deixará de encontrar o registro da escolha anterior.</p>
          <p>O bloqueio de cookies analíticos não deverá prejudicar as funcionalidades essenciais da plataforma.</p>

          <h2>15. Sinal &ldquo;Do Not Track&rdquo;</h2>
          <p>Alguns navegadores oferecem mecanismos de sinalização de preferência por não rastreamento.</p>
          <p>Não existe garantia de interpretação uniforme desses sinais por todos os serviços. Por esse motivo, a principal forma de controle oferecida pelo site será o próprio painel de preferências de cookies.</p>

          <h2>16. Atualizações desta Política</h2>
          <p>Esta Política poderá ser atualizada em razão de:</p>
          <ul>
            <li>alteração dos cookies utilizados;</li>
            <li>adoção de novas ferramentas;</li>
            <li>mudanças no Google Analytics;</li>
            <li>inclusão de publicidade;</li>
            <li>alterações legislativas ou regulatórias;</li>
            <li>mudanças nas práticas de tratamento de dados;</li>
            <li>inclusão de novas funcionalidades.</li>
          </ul>
          <p>A versão vigente estará disponível em {SITE_URL}/politica-de-cookies, acompanhada da data de sua última atualização.</p>
          <p>Alterações que envolvam novas finalidades ou novas categorias de cookies poderão exigir uma nova solicitação de consentimento.</p>

          <h2>17. Relação com o Aviso de Privacidade</h2>
          <p>
            Esta Política deve ser interpretada em conjunto com o{' '}
            <a href="/politica-de-privacidade">Aviso de Privacidade</a>, que apresenta informações sobre:
          </p>
          <ul>
            <li>dados enviados pelo formulário;</li>
            <li>comunicações por e-mail e WhatsApp;</li>
            <li>logs técnicos;</li>
            <li>fornecedores;</li>
            <li>retenção;</li>
            <li>segurança;</li>
            <li>transferências internacionais;</li>
            <li>direitos dos titulares.</li>
          </ul>
          <p>Em caso de dúvida sobre o tratamento de dados pessoais, o visitante poderá consultar o Aviso de Privacidade ou entrar em contato pelo canal informado abaixo.</p>

          <h2>18. Contato</h2>
          <p>Dúvidas ou solicitações relacionadas aos cookies e ao tratamento de dados pessoais podem ser enviadas para:</p>
          <p>
            Marcelo Gonçalves<br />
            Belo Horizonte, Minas Gerais, Brasil<br />
            E-mail: <a href="mailto:marcelo.mjgoncalves@gmail.com">marcelo.mjgoncalves@gmail.com</a>
          </p>
        </div>
      </div>
    </>
  );
}
