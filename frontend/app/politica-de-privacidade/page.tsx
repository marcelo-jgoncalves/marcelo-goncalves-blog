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
    <>
      <PageHero
        singleColumn
        className="page-hero--legal"
        title={<>Política de <span className="highlight">Privacidade</span></>}
        subtitle="Como coletamos, usamos e protegemos seus dados pessoais."
      />

      <div className="legal-container container">
        <div className="legal-content">
          <p className="legal-updated">Última atualização: 18 de julho de 2026</p>

          <p>
            Este Aviso de Privacidade explica como os dados pessoais são tratados durante o acesso e a
            utilização do site {SITE_URL}, incluindo suas páginas institucionais, o blog, o formulário de
            contato e os canais de comunicação disponibilizados.
          </p>
          <p>
            O tratamento de dados pessoais é realizado de acordo com a Lei nº 13.709/2018, a Lei Geral de
            Proteção de Dados Pessoais, conhecida como LGPD.
          </p>

          <h2>1. Quem é o controlador dos dados</h2>
          <p>O responsável pelas decisões relacionadas ao tratamento dos dados pessoais é:</p>
          <p>
            <strong>Controlador:</strong> Marcelo Gonçalves<br />
            <strong>Localidade:</strong> Belo Horizonte, Minas Gerais, Brasil<br />
            <strong>E-mail para assuntos de privacidade:</strong>{' '}
            <a href="mailto:marcelo.mjgoncalves@gmail.com">marcelo.mjgoncalves@gmail.com</a>
          </p>
          <p>
            Neste Aviso, o controlador também poderá ser mencionado como &ldquo;nós&rdquo;, &ldquo;nosso&rdquo; ou
            &ldquo;responsável pelo site&rdquo;.
          </p>
          <p>
            O e-mail indicado acima pode ser utilizado para esclarecer dúvidas sobre privacidade ou
            exercer direitos relacionados aos dados pessoais.
          </p>

          <h2>2. A quem este Aviso se aplica</h2>
          <p>Este Aviso se aplica às pessoas que:</p>
          <ul>
            <li>acessam ou navegam pelo site;</li>
            <li>leem os artigos publicados no blog;</li>
            <li>enviam uma solicitação pelo formulário de contato;</li>
            <li>iniciam uma conversa pelo botão de WhatsApp;</li>
            <li>comunicam-se conosco por e-mail;</li>
            <li>autorizam o uso de cookies analíticos.</li>
          </ul>
          <p>
            O site é destinado principalmente a pessoas interessadas em conteúdos e serviços relacionados
            a tecnologia, engenharia, computação em nuvem, inteligência artificial, automação e
            transformação digital.
          </p>

          <h2>3. Dados pessoais tratados</h2>

          <h3>3.1. Dados enviados pelo formulário</h3>
          <p>Quando uma solicitação é enviada pelo formulário de contato, poderão ser tratados os seguintes dados:</p>
          <p><strong>Campos obrigatórios:</strong></p>
          <ul>
            <li>nome;</li>
            <li>empresa;</li>
            <li>e-mail;</li>
            <li>descrição da necessidade, desafio ou objetivo do projeto.</li>
          </ul>
          <p><strong>Campos opcionais:</strong></p>
          <ul>
            <li>cargo;</li>
            <li>telefone;</li>
            <li>número aproximado de colaboradores;</li>
            <li>área de interesse;</li>
            <li>área de atuação da empresa.</li>
          </ul>
          <p>
            O conteúdo digitado no campo de mensagem também poderá conter outras informações fornecidas
            livremente pelo próprio usuário.
          </p>
          <p>
            Recomendamos que não sejam enviados dados pessoais sensíveis, credenciais, senhas, informações
            financeiras, segredos comerciais ou outros dados confidenciais que não sejam necessários para
            o atendimento da solicitação.
          </p>

          <h3>3.2. Dados de comunicações por e-mail</h3>
          <p>Quando uma pessoa entra em contato ou responde a uma comunicação, poderão ser tratados:</p>
          <ul>
            <li>nome;</li>
            <li>endereço de e-mail;</li>
            <li>empresa ou cargo, quando informados;</li>
            <li>conteúdo da mensagem;</li>
            <li>data e horário da comunicação;</li>
            <li>informações incluídas na assinatura do e-mail;</li>
            <li>histórico necessário para compreender e responder à solicitação.</li>
          </ul>

          <h3>3.3. Dados de comunicações pelo WhatsApp</h3>
          <p>O site disponibiliza um link no formato wa.me, que direciona o visitante para o WhatsApp.</p>
          <p>Quando o visitante decide iniciar uma conversa, poderão ser tratados:</p>
          <ul>
            <li>nome ou identificação exibida no WhatsApp;</li>
            <li>número de telefone;</li>
            <li>foto de perfil, quando visível;</li>
            <li>conteúdo das mensagens;</li>
            <li>arquivos ou informações enviados voluntariamente;</li>
            <li>data e horário das comunicações.</li>
          </ul>
          <p>
            O clique no botão não inicia automaticamente uma conversa nem envia o conteúdo do formulário
            para o WhatsApp.
          </p>
          <p>
            A utilização do WhatsApp também está sujeita aos termos e às políticas de privacidade da
            empresa responsável por esse serviço.
          </p>

          <h3>3.4. Dados técnicos e registros de acesso</h3>
          <p>Durante a navegação, a infraestrutura poderá gerar registros técnicos contendo informações como:</p>
          <ul>
            <li>endereço IP;</li>
            <li>data e horário da requisição;</li>
            <li>página ou recurso solicitado;</li>
            <li>tipo e versão do navegador;</li>
            <li>sistema operacional ou tipo de dispositivo;</li>
            <li>identificadores técnicos de requisição;</li>
            <li>código de resposta HTTP;</li>
            <li>informações relacionadas a erros, falhas ou tentativas de abuso.</li>
          </ul>
          <p>Esses registros são utilizados para manter a segurança, a disponibilidade e o funcionamento da plataforma.</p>
          <p>O conteúdo integral das mensagens enviadas pelo formulário não deve ser intencionalmente registrado nos logs técnicos da aplicação.</p>

          <h3>3.5. Dados coletados pelo Google Analytics</h3>
          <p>Mediante autorização do visitante, utilizamos o Google Analytics 4 para compreender como o site e seus conteúdos são utilizados.</p>
          <p>A implementação padrão do GA4 pode coletar informações como:</p>
          <ul>
            <li>número de visitantes;</li>
            <li>sessões e páginas acessadas;</li>
            <li>interações realizadas no site;</li>
            <li>localização geográfica aproximada;</li>
            <li>tipo de dispositivo;</li>
            <li>navegador e sistema operacional;</li>
            <li>origem aproximada do acesso;</li>
            <li>identificadores armazenados em cookies analíticos.</li>
          </ul>
          <p>
            O Google Analytics utiliza, entre outros, o cookie _ga para distinguir usuários e sessões. A
            implementação não deve receber nomes, endereços de e-mail, números de telefone ou o conteúdo
            enviado pelo formulário.
          </p>

          <h2>4. Por que tratamos os dados pessoais</h2>
          <p>Os dados pessoais poderão ser utilizados para:</p>
          <ul>
            <li>receber e analisar solicitações;</li>
            <li>compreender os desafios ou objetivos apresentados;</li>
            <li>entrar em contato com o solicitante;</li>
            <li>responder a dúvidas;</li>
            <li>realizar um diagnóstico inicial;</li>
            <li>preparar uma proposta comercial;</li>
            <li>conduzir tratativas anteriores a uma possível contratação;</li>
            <li>manter o histórico necessário para continuidade do atendimento;</li>
            <li>prevenir spam, fraudes e utilização abusiva do formulário;</li>
            <li>investigar erros e incidentes técnicos;</li>
            <li>proteger a infraestrutura e os visitantes;</li>
            <li>medir, mediante autorização, a audiência e o desempenho dos conteúdos;</li>
            <li>cumprir obrigações legais ou atender determinações de autoridades competentes;</li>
            <li>exercer direitos em processos administrativos, judiciais ou extrajudiciais.</li>
          </ul>
          <p>Os dados não são utilizados para venda de listas, comercialização de informações pessoais ou publicidade comportamental própria.</p>

          <h2>5. Bases legais utilizadas</h2>
          <p>O tratamento poderá ser realizado com fundamento nas seguintes bases legais:</p>

          <h3>Procedimentos preliminares relacionados a contrato</h3>
          <p>
            Os dados enviados pelo formulário, por e-mail ou pelo WhatsApp são tratados para responder à
            iniciativa do próprio titular, compreender sua necessidade e conduzir procedimentos anteriores
            a uma possível contratação.
          </p>
          <p>
            A LGPD permite o tratamento quando necessário para a execução de contrato ou de procedimentos
            preliminares relacionados a contrato, a pedido do titular.
          </p>

          <h3>Legítimo interesse</h3>
          <p>Alguns dados poderão ser tratados para:</p>
          <ul>
            <li>preservar temporariamente o histórico de atendimento;</li>
            <li>proteger a infraestrutura;</li>
            <li>prevenir abusos;</li>
            <li>investigar falhas;</li>
            <li>manter a segurança e a disponibilidade do site;</li>
            <li>resguardar direitos.</li>
          </ul>
          <p>
            O legítimo interesse será utilizado somente quando o tratamento for necessário, proporcional e
            compatível com as expectativas do titular, sem prevalecer sobre seus direitos e liberdades
            fundamentais.
          </p>

          <h3>Consentimento</h3>
          <p>O consentimento será utilizado para a ativação do Google Analytics e dos respectivos cookies analíticos.</p>
          <p>
            O visitante poderá rejeitar essa categoria sem perder o acesso ao conteúdo ou às
            funcionalidades essenciais do site. O consentimento também poderá ser retirado posteriormente
            por meio da opção &ldquo;Preferências de cookies&rdquo;.
          </p>

          <h3>Cumprimento de obrigação legal e exercício de direitos</h3>
          <p>
            Dados poderão ser conservados ou utilizados quando isso for necessário para cumprir obrigações
            legais, responder a autoridades competentes ou exercer direitos em processos judiciais,
            administrativos ou extrajudiciais.
          </p>

          <h2>6. Campos obrigatórios e opcionais</h2>
          <p>Os campos identificados com asterisco são necessários para que a solicitação possa ser compreendida e respondida.</p>
          <p>Os demais campos são opcionais e servem para fornecer contexto adicional, permitindo uma análise mais adequada da empresa e da necessidade apresentada.</p>
          <p>A ausência de preenchimento dos campos opcionais não impede o envio do formulário.</p>

          <h2>7. Como funciona o envio do formulário</h2>
          <p>O formulário utiliza uma infraestrutura serverless hospedada na Amazon Web Services.</p>
          <p>O fluxo poderá envolver:</p>
          <ul>
            <li>Amazon CloudFront;</li>
            <li>Amazon API Gateway;</li>
            <li>AWS Lambda;</li>
            <li>Amazon Simple Email Service (SES).</li>
          </ul>
          <p>Após o envio, os dados são processados para gerar uma mensagem de e-mail entregue à caixa de entrada utilizada pelo controlador.</p>
          <p>No fluxo atual, os dados enviados pelo formulário não são armazenados no Amazon DynamoDB. Eles permanecem no e-mail recebido durante o período de retenção definido neste Aviso.</p>

          <h2>8. Compartilhamento com fornecedores</h2>
          <p>Os dados pessoais poderão ser tratados pelos seguintes fornecedores:</p>

          <h3>Amazon Web Services</h3>
          <p>A AWS fornece a infraestrutura de computação em nuvem utilizada pelo site, incluindo distribuição de conteúdo, APIs, execução das funções da aplicação e envio de e-mails.</p>
          <p>A AWS atua no processamento dos dados de acordo com os serviços contratados e com os termos aplicáveis. Seu adendo de processamento de dados está incorporado aos Termos de Serviço e é aplicado aos clientes que usam os serviços para processar dados.</p>

          <h3>Google</h3>
          <p>O Google poderá tratar dados em duas situações:</p>
          <ul>
            <li>fornecimento da caixa de e-mail Gmail que recebe as solicitações;</li>
            <li>fornecimento do Google Analytics 4, quando autorizado pelo visitante.</li>
          </ul>
          <p>Os dados tratados pelo Google também estão sujeitos aos termos e políticas de privacidade aplicáveis aos respectivos serviços.</p>

          <h3>Meta e WhatsApp</h3>
          <p>Quando o visitante utiliza o link wa.me e inicia uma conversa, a Meta e o WhatsApp passam a tratar informações relacionadas à comunicação de acordo com suas próprias políticas.</p>
          <p>O site não controla os tratamentos realizados diretamente pela plataforma do WhatsApp.</p>

          <h3>Autoridades públicas</h3>
          <p>Os dados poderão ser compartilhados com autoridades administrativas, regulatórias, policiais ou judiciais quando houver obrigação legal, ordem válida ou necessidade de defesa de direitos.</p>

          <p><strong>Não vendemos nem alugamos dados pessoais.</strong></p>

          <h2>9. Transferência internacional de dados</h2>
          <p>A infraestrutura principal utiliza a região us-east-1 da AWS, localizada nos Estados Unidos.</p>
          <p>Além disso, AWS, Google, Meta e WhatsApp podem utilizar servidores, empresas relacionadas ou prestadores estabelecidos fora do Brasil.</p>
          <p>Consequentemente, os dados pessoais poderão ser objeto de transferência internacional ou acesso a partir de outros países.</p>
          <p>
            Nessas situações, buscamos utilizar fornecedores que adotem medidas de segurança e
            compromissos contratuais de proteção de dados. As transferências devem observar os mecanismos
            permitidos pela LGPD e pela regulamentação da ANPD, como cláusulas-padrão contratuais ou outros
            instrumentos juridicamente aplicáveis.
          </p>

          <h2>10. Períodos de retenção</h2>
          <p>Os dados são mantidos somente pelo período necessário para cumprir as finalidades descritas neste Aviso.</p>

          <h3>Formulário e e-mails</h3>
          <p>As mensagens de contatos que não resultarem em contratação serão mantidas por até seis meses, contados do último contato relevante.</p>
          <p>Após esse período, deverão ser excluídas, salvo quando a conservação for necessária para:</p>
          <ul>
            <li>cumprimento de obrigação legal;</li>
            <li>atendimento de solicitação do próprio titular;</li>
            <li>prevenção de fraude;</li>
            <li>exercício ou defesa de direitos;</li>
            <li>existência de contratação ou relacionamento em andamento.</li>
          </ul>
          <p>Quando houver contratação, os dados necessários poderão ser mantidos pelos prazos relacionados à execução do serviço, às obrigações legais e à defesa de direitos.</p>

          <h3>WhatsApp</h3>
          <p>Conversas que não resultarem em contratação deverão ser excluídas em até seis meses após o último contato relevante, salvo quando houver necessidade legítima ou legal de conservação.</p>

          <h3>Logs técnicos</h3>
          <p>Os logs técnicos da infraestrutura são mantidos por 15 dias e, após esse prazo, são automaticamente excluídos ou sobrescritos, salvo quando determinados registros precisarem ser preservados para investigar um incidente específico ou cumprir obrigação legal.</p>

          <h3>Google Analytics</h3>
          <p>A propriedade do Google Analytics está configurada com período de retenção de 14 meses para dados de usuários e eventos sujeitos a essa configuração.</p>
          <p>Essa configuração não afeta necessariamente todos os relatórios estatísticos agregados mantidos pelo Google Analytics.</p>
          <p>O cookie _ga possui validade padrão de até dois anos, embora navegadores possam aplicar limites menores. Quando o visitante retirar o consentimento, o site deverá interromper a coleta analítica e remover os cookies controlados pela implementação sempre que tecnicamente possível.</p>

          <h2>11. Cookies e tecnologias semelhantes</h2>
          <p>O site utiliza ou poderá utilizar duas categorias de tecnologias:</p>

          <h3>Cookies estritamente necessários</h3>
          <p>São utilizados para permitir funcionalidades essenciais, como registrar a escolha do visitante sobre cookies.</p>
          <p>Esses recursos não são utilizados para publicidade e não podem ser desativados pelo painel de preferências quando forem indispensáveis ao funcionamento solicitado.</p>

          <h3>Cookies analíticos</h3>
          <p>São utilizados pelo Google Analytics para produzir estatísticas sobre audiência, sessões e uso dos conteúdos.</p>
          <p>Esses cookies somente deverão ser ativados depois que o visitante selecionar &ldquo;Aceitar análise&rdquo; ou habilitar essa categoria no painel de preferências.</p>
          <p>O visitante poderá:</p>
          <ul>
            <li>aceitar os cookies analíticos;</li>
            <li>rejeitar os cookies analíticos;</li>
            <li>alterar a escolha posteriormente;</li>
            <li>retirar o consentimento sem perder acesso ao conteúdo.</li>
          </ul>
          <p>
            Informações adicionais deverão estar disponíveis na{' '}
            <a href="/politica-de-cookies">Política de Cookies</a>.
          </p>

          <h2>12. Segurança dos dados</h2>
          <p>São adotadas medidas técnicas e organizacionais compatíveis com o porte e as características da plataforma, incluindo:</p>
          <ul>
            <li>controle de acesso à infraestrutura;</li>
            <li>limitação de permissões;</li>
            <li>retenção limitada de logs;</li>
            <li>restrição de acesso às mensagens;</li>
            <li>monitoramento de erros e eventos de segurança;</li>
            <li>uso de serviços gerenciados de computação em nuvem;</li>
            <li>atualização e revisão periódica da aplicação;</li>
            <li>minimização dos dados coletados.</li>
          </ul>
          <p>Nenhum sistema é totalmente imune a riscos. Caso seja identificado um incidente de segurança relevante, serão adotadas medidas de investigação, contenção e comunicação compatíveis com a legislação aplicável.</p>
          <p>A ANPD recomenda que agentes de pequeno porte adotem medidas administrativas e técnicas proporcionais aos riscos de suas atividades.</p>

          <h2>13. Direitos dos titulares</h2>
          <p>O titular poderá solicitar, quando aplicável:</p>
          <ul>
            <li>confirmação da existência de tratamento;</li>
            <li>acesso aos dados pessoais;</li>
            <li>correção de dados incompletos, inexatos ou desatualizados;</li>
            <li>anonimização, bloqueio ou eliminação de dados desnecessários, excessivos ou tratados em desconformidade;</li>
            <li>informação sobre entidades com as quais houve compartilhamento;</li>
            <li>informação sobre a possibilidade de não fornecer consentimento e suas consequências;</li>
            <li>revogação do consentimento;</li>
            <li>eliminação dos dados tratados com base no consentimento, observadas as hipóteses legais de conservação;</li>
            <li>oposição a tratamentos realizados em desconformidade com a LGPD;</li>
            <li>revisão de decisões automatizadas, caso esse tipo de tratamento venha a ser realizado;</li>
            <li>portabilidade, conforme a regulamentação aplicável.</li>
          </ul>
          <p>Atualmente, o site não toma decisões que produzam efeitos sobre o visitante exclusivamente por meio de tratamento automatizado.</p>
          <p>
            Os direitos previstos na LGPD podem ser exercidos gratuitamente por meio do e-mail:{' '}
            <a href="mailto:marcelo.mjgoncalves@gmail.com">marcelo.mjgoncalves@gmail.com</a>.
          </p>
          <p>Para evitar fraudes ou divulgação indevida de informações, poderá ser solicitada confirmação razoável da identidade do requerente.</p>
          <p>Alguns pedidos poderão não ser atendidos integralmente quando houver fundamento legal para conservação dos dados ou quando a solicitação não puder ser associada com segurança ao requerente. Nesses casos, serão apresentadas as justificativas aplicáveis.</p>
          <p>A ANPD apresenta como direitos dos titulares, entre outros, confirmação, acesso, correção, eliminação em situações aplicáveis, oposição e revogação do consentimento.</p>

          <h2>14. Crianças e adolescentes</h2>
          <p>O site e os serviços apresentados não são direcionados especificamente a crianças.</p>
          <p>Não há intenção de coletar conscientemente dados pessoais de crianças por meio do formulário.</p>
          <p>Caso um responsável identifique que dados de uma criança foram enviados indevidamente, poderá solicitar sua análise e exclusão pelo canal de privacidade.</p>

          <h2>15. Links para sites e serviços externos</h2>
          <p>O site poderá conter links para outros sites, redes sociais ou serviços externos, incluindo WhatsApp.</p>
          <p>Ao acessar um serviço externo, o visitante estará sujeito às regras e políticas de privacidade do respectivo fornecedor.</p>
          <p>Este Aviso não se aplica aos tratamentos realizados de forma independente por sites ou plataformas de terceiros.</p>

          <h2>16. Alterações deste Aviso</h2>
          <p>Este Aviso poderá ser atualizado em razão de:</p>
          <ul>
            <li>alterações na legislação;</li>
            <li>orientações de autoridades;</li>
            <li>inclusão de novas funcionalidades;</li>
            <li>mudança de fornecedores;</li>
            <li>adoção de novos serviços de análise;</li>
            <li>alteração das práticas de tratamento.</li>
          </ul>
          <p>
            A versão vigente estará sempre disponível em {SITE_URL}/politica-de-privacidade, acompanhada da
            data de sua última atualização.
          </p>
          <p>Alterações relevantes poderão ser destacadas no próprio site.</p>

          <h2>17. Contato</h2>
          <p>Dúvidas, solicitações ou pedidos relacionados à proteção de dados pessoais podem ser enviados para:</p>
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
