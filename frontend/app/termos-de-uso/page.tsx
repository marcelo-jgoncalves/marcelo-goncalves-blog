import type { Metadata } from 'next';
import PageHero from '@/components/ui/PageHero';
import { SITE_URL, SITE_NAME } from '@/lib/config';
import styles from '../legal.module.css';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: { absolute: `Termos de Uso | ${SITE_NAME}` },
  description: 'Termos e condições de uso do site Marcelo Gonçalves.',
  alternates: { canonical: `${SITE_URL}/termos-de-uso` },
  openGraph: {
    title: `Termos de Uso | ${SITE_NAME}`,
    url: `${SITE_URL}/termos-de-uso`,
    siteName: SITE_NAME,
  },
};

export default function TermosDeUsoPage() {
  return (
    <>
      <PageHero
        singleColumn
        className={styles.pageHeroLegal}
        title={<>Termos de <span className="highlight">Uso</span></>}
        subtitle="Condições que regem o acesso e uso deste site."
      />

      <div className={`${styles.legalContainer} container`}>
        <div className={styles.legalContent}>
          <p className={styles.legalUpdated}>Última atualização: 18 de julho de 2026</p>

          <p>
            Estes Termos de Uso estabelecem as condições para acesso e utilização do site{' '}
            {SITE_URL}, incluindo suas páginas institucionais, seu blog, seus artigos, materiais,
            formulários e demais funcionalidades disponibilizadas.
          </p>
          <p>
            Ao acessar ou utilizar o site, o visitante declara estar ciente destes Termos. Caso
            não concorde com alguma de suas disposições, deverá deixar de utilizar as
            funcionalidades relacionadas, especialmente o formulário de contato e os canais de
            comunicação disponibilizados.
          </p>
          <p>Estes Termos não afastam direitos assegurados pela legislação aplicável.</p>

          <h2>1. Identificação do responsável</h2>
          <p>O site é mantido por:</p>
          <p>
            <strong>Responsável:</strong> Marcelo Gonçalves<br />
            <strong>Localidade:</strong> Belo Horizonte, Minas Gerais, Brasil<br />
            <strong>E-mail:</strong>{' '}
            <a href="mailto:marcelo.mjgoncalves@gmail.com">marcelo.mjgoncalves@gmail.com</a>
          </p>
          <p>
            Para fins destes Termos, poderão ser utilizadas as expressões &ldquo;Responsável&rdquo;,
            &ldquo;nós&rdquo;, &ldquo;nosso&rdquo; ou &ldquo;Site&rdquo;.
          </p>

          <h2>2. Finalidade do site</h2>
          <p>O site possui caráter institucional, informativo e editorial.</p>
          <p>Suas principais finalidades são:</p>
          <ul>
            <li>apresentar informações sobre o responsável e sua atuação profissional;</li>
            <li>divulgar serviços relacionados a tecnologia, computação em nuvem, engenharia, automação, inteligência artificial, desenvolvimento de software e transformação digital;</li>
            <li>disponibilizar artigos, análises, opiniões, estudos, exemplos e conteúdos educacionais;</li>
            <li>compartilhar experiências, projetos e aprendizados profissionais;</li>
            <li>permitir que visitantes entrem em contato;</li>
            <li>receber solicitações de diagnóstico, informações ou propostas;</li>
            <li>direcionar o visitante para canais externos de comunicação, como o WhatsApp.</li>
          </ul>
          <p>O acesso às páginas públicas do site é, atualmente, gratuito e não exige cadastro.</p>

          <h2>3. Natureza informativa do conteúdo</h2>
          <p>Os conteúdos publicados possuem finalidade geral, informativa, educacional ou editorial.</p>
          <p>Embora sejam adotados cuidados razoáveis na pesquisa, elaboração e revisão das informações, não há garantia de que todo conteúdo estará permanentemente:</p>
          <ul>
            <li>completo;</li>
            <li>atualizado;</li>
            <li>isento de erros;</li>
            <li>adequado a uma situação específica;</li>
            <li>compatível com todas as versões de ferramentas, sistemas ou serviços;</li>
            <li>aplicável a todos os ambientes, organizações ou projetos.</li>
          </ul>
          <p>Tecnologias, normas, preços, serviços, interfaces, documentações, práticas de mercado e condições comerciais podem mudar após a publicação de um conteúdo.</p>
          <p>A data de publicação ou de atualização de cada material deve ser considerada pelo visitante antes de utilizá-lo.</p>

          <h2>4. Conteúdos técnicos</h2>
          <p>Artigos, códigos, comandos, arquiteturas, configurações, exemplos, diagramas, modelos e recomendações técnicas são fornecidos para fins informativos e educacionais.</p>
          <p>Esses materiais não devem ser aplicados diretamente em ambientes de desenvolvimento, homologação ou produção sem análise prévia.</p>
          <p>Antes de utilizar qualquer conteúdo técnico, o visitante deve, conforme aplicável:</p>
          <ul>
            <li>verificar a documentação oficial das tecnologias envolvidas;</li>
            <li>avaliar a compatibilidade com seu ambiente;</li>
            <li>revisar o código ou a configuração;</li>
            <li>realizar testes em ambiente controlado;</li>
            <li>criar cópias de segurança;</li>
            <li>analisar custos, riscos, segurança e impactos operacionais;</li>
            <li>verificar requisitos legais, regulatórios e contratuais;</li>
            <li>adotar controles de acesso e mecanismos de recuperação;</li>
            <li>consultar profissionais qualificados quando necessário.</li>
          </ul>
          <p>Exemplos de infraestrutura, segurança, DevOps, computação em nuvem, inteligência artificial e automação podem exigir adaptações relevantes antes de qualquer utilização real.</p>
          <p>O Responsável não controla o ambiente, os dados, as permissões, os sistemas ou as decisões do visitante. Por isso, a utilização prática dos materiais ocorre sob responsabilidade de quem os aplica, observadas as responsabilidades que não possam ser legalmente excluídas.</p>

          <h2>5. Conteúdos sobre segurança da informação</h2>
          <p>Conteúdos relacionados a segurança, vulnerabilidades, permissões, identidade, credenciais, redes ou testes técnicos devem ser utilizados somente:</p>
          <ul>
            <li>em sistemas próprios;</li>
            <li>em ambientes para os quais o usuário possua autorização expressa;</li>
            <li>para finalidades legítimas;</li>
            <li>de acordo com a legislação;</li>
            <li>sem causar indisponibilidade, acesso indevido ou prejuízo a terceiros.</li>
          </ul>
          <p>Nenhum conteúdo do site deve ser interpretado como autorização para acessar, testar, explorar, modificar ou interferir em sistemas pertencentes a terceiros.</p>
          <p>O visitante é responsável por verificar se possui autorização suficiente antes de executar qualquer procedimento técnico.</p>

          <h2>6. Conteúdos sobre inteligência artificial</h2>
          <p>Conteúdos relacionados a inteligência artificial, modelos de linguagem, automações e sistemas generativos possuem caráter informativo e podem envolver tecnologias probabilísticas.</p>
          <p>Resultados gerados por sistemas de inteligência artificial podem conter:</p>
          <ul>
            <li>erros factuais;</li>
            <li>informações incompletas;</li>
            <li>interpretações inadequadas;</li>
            <li>vieses;</li>
            <li>código inseguro;</li>
            <li>referências inexistentes;</li>
            <li>respostas incompatíveis com um contexto específico.</li>
          </ul>
          <p>O visitante deve revisar e validar de forma independente qualquer resultado gerado com apoio de inteligência artificial antes de utilizá-lo em decisões, documentos, sistemas ou processos.</p>
          <p>O conteúdo do site não substitui avaliações jurídicas, técnicas, financeiras, médicas, contábeis ou profissionais aplicáveis ao caso concreto.</p>

          <h2>7. Conteúdos sobre finanças e investimentos</h2>
          <p>O site poderá publicar conteúdos gerais e educacionais relacionados a finanças pessoais, investimentos, ações, fundos imobiliários, fundos de índice, renda fixa, análise de empresas ou funcionamento do mercado financeiro.</p>
          <p>Salvo quando expressamente informado e devidamente estruturado de acordo com a regulamentação aplicável, esses conteúdos:</p>
          <ul>
            <li>não são personalizados para um investidor específico;</li>
            <li>não consideram objetivos individuais, situação financeira, patrimônio, tolerância a risco ou horizonte de investimento;</li>
            <li>não constituem gestão de carteira;</li>
            <li>não constituem consultoria individualizada de investimentos;</li>
            <li>não representam promessa de rentabilidade;</li>
            <li>não representam garantia de resultado;</li>
            <li>não constituem oferta pública ou solicitação de investimento;</li>
            <li>não substituem a análise independente do leitor;</li>
            <li>não substituem a orientação de profissionais devidamente autorizados.</li>
          </ul>
          <p>Exemplos, simulações, rankings, cálculos, opiniões e análises históricas não garantem resultados futuros.</p>
          <p>Investimentos envolvem riscos, incluindo perda parcial ou total do capital. O visitante deve verificar informações em fontes oficiais, avaliar sua própria situação e buscar orientação profissional quando necessário.</p>
          <p>Caso o site venha a oferecer no futuro atividades, relatórios, recomendações ou serviços sujeitos a regulamentação específica, serão disponibilizados termos, identificações, avisos e condições adicionais antes da respectiva oferta.</p>

          <h2>8. Informações sobre os serviços</h2>
          <p>As descrições de serviços apresentadas no site têm caráter geral e institucional.</p>
          <p>Elas não definem automaticamente:</p>
          <ul>
            <li>escopo definitivo;</li>
            <li>preço;</li>
            <li>prazo;</li>
            <li>nível de serviço;</li>
            <li>cronograma;</li>
            <li>equipe;</li>
            <li>tecnologias;</li>
            <li>entregáveis;</li>
            <li>garantias;</li>
            <li>responsabilidades das partes;</li>
            <li>condições de pagamento.</li>
          </ul>
          <p>A contratação de qualquer serviço dependerá de tratativa específica e, quando aplicável, da aceitação de proposta comercial, contrato, ordem de serviço ou outro instrumento próprio.</p>
          <p>O envio de uma mensagem pelo formulário, por e-mail ou pelo WhatsApp não cria automaticamente uma relação contratual e não obriga o Responsável a apresentar proposta ou aceitar determinado projeto.</p>
          <p>Uma eventual contratação será regida pelo documento específico celebrado entre as partes, sem prejuízo dos direitos previstos na legislação aplicável.</p>

          <h2>9. Diagnóstico inicial</h2>
          <p>O site poderá permitir que o visitante solicite um diagnóstico inicial relacionado à sua empresa, projeto, processo ou necessidade.</p>
          <p>Esse diagnóstico:</p>
          <ul>
            <li>poderá depender da análise das informações fornecidas;</li>
            <li>não representa garantia de contratação;</li>
            <li>não representa auditoria completa;</li>
            <li>não substitui avaliação técnica aprofundada;</li>
            <li>não garante viabilidade, prazo, custo ou resultado;</li>
            <li>poderá exigir reuniões ou informações adicionais;</li>
            <li>não cria obrigação de execução do projeto.</li>
          </ul>
          <p>Informações preliminares apresentadas durante esse contato poderão ser revistas após uma análise mais detalhada.</p>

          <h2>10. Formulário de contato</h2>
          <p>O visitante deve fornecer informações verdadeiras, atualizadas e suficientes para que sua solicitação possa ser compreendida.</p>
          <p>Não devem ser enviados por meio do formulário:</p>
          <ul>
            <li>senhas;</li>
            <li>chaves de acesso;</li>
            <li>tokens;</li>
            <li>credenciais;</li>
            <li>números completos de cartões;</li>
            <li>informações bancárias desnecessárias;</li>
            <li>dados pessoais sensíveis sem necessidade;</li>
            <li>dados de terceiros sem autorização;</li>
            <li>segredos comerciais que exijam proteção contratual específica;</li>
            <li>códigos maliciosos;</li>
            <li>arquivos ou links prejudiciais;</li>
            <li>conteúdo ilegal, ofensivo ou fraudulento.</li>
          </ul>
          <p>O formulário não deve ser considerado um canal apropriado para o envio de informações altamente confidenciais.</p>
          <p>O envio de uma solicitação não estabelece, por si só, obrigação de confidencialidade além dos deveres previstos na legislação, no Aviso de Privacidade e em eventual acordo específico celebrado entre as partes.</p>
          <p>
            Os dados pessoais enviados serão tratados conforme o{' '}
            <a href="/politica-de-privacidade">Aviso de Privacidade</a>.
          </p>

          <h2>11. Comunicação por WhatsApp</h2>
          <p>O site poderá disponibilizar um link no formato <code>wa.me</code>, que direciona o visitante para o aplicativo ou para a página do WhatsApp.</p>
          <p>Ao utilizar esse recurso:</p>
          <ul>
            <li>o visitante será direcionado para uma plataforma externa;</li>
            <li>o envio da mensagem dependerá de uma ação do próprio visitante;</li>
            <li>os termos e políticas do WhatsApp também serão aplicáveis;</li>
            <li>o tempo de resposta poderá variar;</li>
            <li>o início da conversa não representa contratação ou garantia de atendimento imediato.</li>
          </ul>
          <p>O visitante não deve enviar pelo WhatsApp credenciais, senhas, dados financeiros ou informações confidenciais desnecessárias.</p>

          <h2>12. Propriedade intelectual</h2>
          <p>Salvo indicação expressa em sentido contrário, os textos, artigos, análises, diagramas, elementos gráficos, identidade visual, organização editorial, materiais, códigos autorais, documentos e demais conteúdos originais do site pertencem ao Responsável ou são utilizados com autorização ou licença adequada.</p>
          <p>A disponibilização do conteúdo no site não transfere ao visitante qualquer direito de propriedade intelectual.</p>
          <p>É permitido:</p>
          <ul>
            <li>compartilhar links para as páginas do site;</li>
            <li>citar pequenos trechos para fins de comentário, estudo, crítica ou referência;</li>
            <li>compartilhar publicações por meio dos recursos disponibilizados;</li>
            <li>fazer uso permitido pela legislação.</li>
          </ul>
          <p>Ao citar um conteúdo, devem ser preservados:</p>
          <ul>
            <li>o nome do autor;</li>
            <li>o título do conteúdo, quando aplicável;</li>
            <li>o link para a publicação original;</li>
            <li>o contexto adequado da informação.</li>
          </ul>
          <p>Sem autorização prévia, não é permitido:</p>
          <ul>
            <li>reproduzir integralmente artigos ou materiais;</li>
            <li>remover créditos, avisos ou referências;</li>
            <li>apresentar conteúdo do site como se fosse de autoria própria;</li>
            <li>vender, licenciar ou explorar comercialmente os materiais;</li>
            <li>criar cópias substanciais do site;</li>
            <li>republicar sistematicamente o conteúdo em outra plataforma;</li>
            <li>utilizar os materiais para alimentar produtos comerciais que reproduzam ou substituam o conteúdo original;</li>
            <li>modificar materiais de modo que prejudique a reputação ou atribua ao autor uma afirmação que ele não tenha feito.</li>
          </ul>
          <p>
            Pedidos de autorização podem ser enviados para:{' '}
            <a href="mailto:marcelo.mjgoncalves@gmail.com">marcelo.mjgoncalves@gmail.com</a>
          </p>

          <h2>13. Marcas e conteúdos de terceiros</h2>
          <p>Nomes de empresas, marcas, produtos, serviços, logotipos, capturas de tela, códigos, bibliotecas, documentações e demais materiais de terceiros pertencem aos seus respectivos titulares.</p>
          <p>A menção a uma marca ou produto não significa necessariamente:</p>
          <ul>
            <li>parceria;</li>
            <li>patrocínio;</li>
            <li>certificação;</li>
            <li>aprovação;</li>
            <li>vínculo comercial;</li>
            <li>recomendação oficial.</li>
          </ul>
          <p>Os materiais de terceiros eventualmente utilizados permanecem sujeitos às licenças, termos e direitos de seus respectivos titulares.</p>

          <h2>14. Conteúdo enviado pelo visitante</h2>
          <p>O visitante permanece responsável pelas informações, textos, documentos e materiais que decidir enviar por meio dos canais de contato.</p>
          <p>O envio dessas informações não transfere sua titularidade ao Responsável.</p>
          <p>O visitante autoriza apenas o tratamento necessário para:</p>
          <ul>
            <li>receber a solicitação;</li>
            <li>compreender o contexto apresentado;</li>
            <li>responder ao contato;</li>
            <li>avaliar uma possível prestação de serviço;</li>
            <li>preparar um diagnóstico ou proposta;</li>
            <li>cumprir obrigações legais;</li>
            <li>proteger ou exercer direitos.</li>
          </ul>
          <p>O visitante declara possuir autorização para compartilhar eventuais dados pessoais, documentos ou informações de terceiros enviados pelo formulário, por e-mail ou pelo WhatsApp.</p>
          <p>Os materiais enviados não serão publicados no site sem autorização, salvo quando a divulgação for exigida por lei, autoridade competente ou necessária para o exercício regular de direitos.</p>

          <h2>15. Condutas proibidas</h2>
          <p>Ao utilizar o site, o visitante não poderá:</p>
          <ul>
            <li>praticar atos ilícitos;</li>
            <li>fornecer deliberadamente informações falsas;</li>
            <li>tentar acessar áreas, sistemas ou dados sem autorização;</li>
            <li>interferir no funcionamento da infraestrutura;</li>
            <li>explorar vulnerabilidades;</li>
            <li>contornar mecanismos de segurança;</li>
            <li>executar ataques de negação de serviço;</li>
            <li>introduzir vírus, scripts maliciosos ou código prejudicial;</li>
            <li>utilizar o formulário para spam;</li>
            <li>realizar envios automatizados abusivos;</li>
            <li>utilizar robôs ou sistemas de coleta que provoquem carga desproporcional;</li>
            <li>copiar sistematicamente o conteúdo para republicação não autorizada;</li>
            <li>utilizar a identidade do site para fraude ou falsidade ideológica;</li>
            <li>violar direitos autorais, marcas, privacidade ou outros direitos;</li>
            <li>tentar obter credenciais, chaves ou informações internas;</li>
            <li>utilizar o site para assediar, ameaçar ou prejudicar terceiros.</li>
          </ul>
          <p>A indexação regular por mecanismos de busca e o uso legítimo de citações, referências e links não são proibidos.</p>

          <h2>16. Medidas de proteção do site</h2>
          <p>Quando forem identificados indícios de abuso, fraude, ataque, automação excessiva ou violação destes Termos, poderão ser adotadas medidas como:</p>
          <ul>
            <li>bloqueio temporário ou permanente de endereços IP;</li>
            <li>limitação de requisições;</li>
            <li>rejeição de mensagens;</li>
            <li>suspensão de funcionalidades;</li>
            <li>preservação de registros relacionados ao incidente;</li>
            <li>comunicação aos provedores envolvidos;</li>
            <li>adoção de medidas administrativas ou judiciais;</li>
            <li>comunicação às autoridades competentes, quando aplicável.</li>
          </ul>
          <p>Essas medidas serão adotadas de forma proporcional à ocorrência identificada.</p>

          <h2>17. Links externos</h2>
          <p>O site poderá conter links para páginas, documentações, ferramentas, serviços, redes sociais ou plataformas mantidas por terceiros.</p>
          <p>Esses links são disponibilizados para conveniência, referência ou complementação do conteúdo.</p>
          <p>O Responsável não controla os sites externos e não garante:</p>
          <ul>
            <li>sua disponibilidade;</li>
            <li>sua segurança;</li>
            <li>sua continuidade;</li>
            <li>a precisão de seus conteúdos;</li>
            <li>suas práticas de privacidade;</li>
            <li>seus preços ou condições;</li>
            <li>a ausência de conteúdo malicioso;</li>
            <li>o cumprimento de obrigações por terceiros.</li>
          </ul>
          <p>O acesso a sites externos ocorre sob responsabilidade do visitante e está sujeito aos termos e políticas dos respectivos fornecedores.</p>

          <h2>18. Links de afiliados, publicidade e patrocínios</h2>
          <p>Atualmente, o site não utiliza Google AdSense, pixels publicitários ou publicidade comportamental.</p>
          <p>Caso sejam incluídos futuramente anúncios, links de afiliados, patrocínios, publieditoriais ou outras relações comerciais, essas situações deverão ser identificadas de forma transparente no conteúdo ou na página correspondente.</p>
          <p>A existência de uma relação comercial não deverá impedir a apresentação de informações honestas sobre o produto, serviço ou fornecedor mencionado.</p>
          <p>A inclusão dessas funcionalidades também poderá exigir atualização destes Termos, do Aviso de Privacidade e da Política de Cookies.</p>

          <h2>19. Disponibilidade do site</h2>
          <p>O site é fornecido conforme sua disponibilidade técnica.</p>
          <p>Poderão ocorrer interrupções ou limitações relacionadas a:</p>
          <ul>
            <li>manutenção;</li>
            <li>atualizações;</li>
            <li>falhas de infraestrutura;</li>
            <li>indisponibilidade de fornecedores;</li>
            <li>incidentes de segurança;</li>
            <li>problemas de conectividade;</li>
            <li>eventos fora do controle razoável do Responsável;</li>
            <li>alterações necessárias para proteger o site e seus usuários.</li>
          </ul>
          <p>Não é garantido que o site estará disponível de forma ininterrupta, livre de falhas ou permanentemente compatível com todos os navegadores e dispositivos.</p>
          <p>Sempre que razoavelmente possível, serão adotadas medidas para restaurar o funcionamento da plataforma.</p>

          <h2>20. Alterações e remoção de conteúdos</h2>
          <p>O Responsável poderá, a qualquer momento:</p>
          <ul>
            <li>corrigir conteúdos;</li>
            <li>atualizar informações;</li>
            <li>remover artigos;</li>
            <li>alterar a estrutura das páginas;</li>
            <li>substituir tecnologias;</li>
            <li>descontinuar funcionalidades;</li>
            <li>modificar a apresentação dos serviços;</li>
            <li>corrigir links ou referências.</li>
          </ul>
          <p>A alteração ou remoção de conteúdo público não modifica automaticamente contratos já celebrados.</p>
          <p>O visitante não deve depender da permanência indefinida de um artigo, arquivo, código ou material no site.</p>

          <h2>21. Limitação de responsabilidade</h2>
          <p>Na extensão permitida pela legislação, o Responsável não será responsabilizado por danos decorrentes exclusivamente:</p>
          <ul>
            <li>da aplicação de conteúdo técnico sem análise adequada;</li>
            <li>de decisões tomadas com base apenas em conteúdo geral;</li>
            <li>da utilização de versões desatualizadas de artigos ou códigos;</li>
            <li>de alterações feitas por terceiros;</li>
            <li>da indisponibilidade de serviços externos;</li>
            <li>de informações fornecidas incorretamente pelo visitante;</li>
            <li>do uso não autorizado ou contrário a estes Termos;</li>
            <li>da ausência de backups ou testes pelo próprio usuário;</li>
            <li>de incompatibilidades específicas do ambiente do visitante;</li>
            <li>de decisões financeiras tomadas sem avaliação individual.</li>
          </ul>
          <p>Nada nestes Termos exclui ou limita responsabilidades que não possam ser afastadas pela legislação, incluindo direitos eventualmente aplicáveis ao consumidor, deveres de proteção de dados e responsabilidades decorrentes de dolo ou outras hipóteses legalmente protegidas.</p>

          <h2>22. Privacidade e proteção de dados</h2>
          <p>
            O tratamento de dados pessoais relacionado ao site é descrito no{' '}
            <a href="/politica-de-privacidade">Aviso de Privacidade</a>.
          </p>
          <p>
            A utilização de cookies e tecnologias semelhantes é detalhada na{' '}
            <a href="/politica-de-cookies">Política de Cookies</a>.
          </p>
          <p>Esses documentos devem ser interpretados em conjunto com estes Termos de Uso.</p>
          <p>
            O visitante poderá gerenciar sua autorização para cookies analíticos por meio da opção
            &ldquo;Preferências de cookies&rdquo;, disponível no site.
          </p>

          <h2>23. Ausência de cadastro e comentários</h2>
          <p>Atualmente, o site não oferece:</p>
          <ul>
            <li>criação de contas;</li>
            <li>perfis de usuários;</li>
            <li>comentários públicos;</li>
            <li>publicação direta de conteúdo por visitantes;</li>
            <li>fóruns;</li>
            <li>áreas privadas para clientes;</li>
            <li>assinaturas pagas;</li>
            <li>newsletter ativa.</li>
          </ul>
          <p>Caso essas funcionalidades sejam adicionadas, estes Termos e os documentos de privacidade deverão ser atualizados antes ou no momento de sua disponibilização.</p>

          <h2>24. Alterações destes Termos</h2>
          <p>Estes Termos poderão ser alterados para refletir:</p>
          <ul>
            <li>mudanças no site;</li>
            <li>inclusão de novas funcionalidades;</li>
            <li>alteração dos serviços;</li>
            <li>mudanças legislativas ou regulatórias;</li>
            <li>adoção de novos fornecedores;</li>
            <li>correções ou melhorias no documento.</li>
          </ul>
          <p>A versão vigente estará disponível em {SITE_URL}/termos-de-uso.</p>
          <p>A data da atualização será apresentada no início do documento.</p>
          <p>Alterações não modificarão retroativamente condições estabelecidas em contratos específicos já celebrados, salvo quando permitido pela legislação ou acordado entre as partes.</p>

          <h2>25. Independência das disposições</h2>
          <p>Caso uma disposição destes Termos seja considerada inválida, ilegal ou inexequível, as demais disposições permanecerão aplicáveis na medida permitida pela legislação.</p>
          <p>A ausência de aplicação imediata de determinada disposição não representa renúncia a direitos.</p>

          <h2>26. Legislação aplicável e solução de controvérsias</h2>
          <p>Estes Termos são regidos pela legislação brasileira.</p>
          <p>Em caso de dúvida ou controvérsia, as partes deverão buscar inicialmente uma solução amigável por meio do canal de contato indicado neste documento.</p>
          <p>Quando houver relação de consumo, serão preservados os direitos e as regras de competência previstos na legislação aplicável, inclusive o acesso do consumidor aos órgãos e ao foro legalmente competente.</p>
          <p>Nas situações que não envolvam relação de consumo e em que seja juridicamente válida a eleição de foro, fica eleito o foro da comarca de Belo Horizonte, Minas Gerais, sem prejuízo de outra competência obrigatória prevista em lei.</p>

          <h2>27. Versões em outros idiomas</h2>
          <p>Caso estes Termos sejam disponibilizados em outros idiomas, a versão em português será utilizada como referência principal para interpretação, respeitados os direitos assegurados pela legislação aplicável.</p>
          <p>Eventuais divergências de tradução deverão ser comunicadas para correção.</p>

          <h2>28. Contato</h2>
          <p>Dúvidas, solicitações, pedidos de autorização para uso de conteúdo ou comunicações relacionadas a estes Termos podem ser enviados para:</p>
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
