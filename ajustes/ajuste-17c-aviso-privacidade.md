# Ajuste 17C — Aviso de Privacidade

## 0. Finalidade, escopo e precedência

Este documento define, de forma exaustiva e diretamente executável, a revisão da página pública de Aviso de Privacidade da plataforma.

A rota pública permanece:

```text
/politica-de-privacidade
```

O nome exibido ao visitante deverá ser:

```text
Aviso de Privacidade
```

O escopo inclui:

- estrutura visual da página;
- identificação do controlador;
- canal de privacidade;
- categorias de dados;
- origens dos dados;
- finalidades;
- bases legais;
- formulário de contato;
- confirmação por e-mail;
- comunicações por e-mail e WhatsApp;
- dados técnicos e logs;
- cookies e analytics em nível descritivo;
- fornecedores;
- compartilhamento;
- transferências internacionais;
- retenção;
- eliminação;
- segurança;
- incidentes;
- direitos dos titulares;
- procedimento para solicitações;
- crianças e adolescentes;
- decisões automatizadas;
- alterações do aviso;
- governança interna;
- validações automáticas;
- responsividade;
- acessibilidade;
- impressão;
- testes;
- critérios de aceite.

Este documento não inclui:

- texto completo da Política de Cookies;
- implementação do banner de consentimento;
- configuração do Google Analytics;
- Termos de Uso;
- contratos com fornecedores;
- política interna completa de segurança;
- plano operacional completo de resposta a incidentes;
- parecer jurídico individualizado.

Esses temas pertencem aos Ajustes 17D, 17E e 17G.

### Precedência

Em caso de conflito:

1. este documento prevalece sobre qualquer texto anterior do Aviso ou da Política de Privacidade;
2. o Ajuste 14 prevalece sobre os campos e o comportamento real do formulário;
3. o Ajuste 17D prevalecerá sobre cookies, consentimento e analytics;
4. o Ajuste 17G prevalecerá sobre controles técnicos de segurança e produção;
5. o comportamento real do sistema deve ser corrigido quando divergir do aviso;
6. o aviso não pode ser usado para legitimar tratamento que não possua base legal, necessidade ou controles adequados.

### Natureza do documento

Esta é uma especificação de produto, conteúdo e governança.

Ela deve ser revisada juridicamente quando houver:

- mudança relevante do modelo de negócio;
- contratação de novos operadores;
- publicidade comportamental;
- newsletter;
- pagamentos;
- contas de usuário;
- tratamento de dados sensíveis;
- tratamento de crianças;
- perfilamento;
- decisões automatizadas;
- comercialização ou enriquecimento de dados;
- integração com CRM;
- treinamento de modelos com dados de visitantes;
- transferência internacional não coberta pelo inventário atual.

---

# 1. Fundamentos normativos considerados

A implementação deverá considerar, no mínimo:

- Lei nº 13.709/2018 — Lei Geral de Proteção de Dados Pessoais;
- princípios do art. 6º da LGPD;
- hipóteses legais do art. 7º;
- transparência e livre acesso do art. 9º;
- legítimo interesse e necessidade do art. 10;
- direitos dos titulares do art. 18;
- confirmação e acesso do art. 19;
- término e conservação do tratamento dos arts. 15 e 16;
- transferências internacionais dos arts. 33 a 36;
- registro das operações do art. 37;
- segurança dos arts. 46 e seguintes;
- comunicação de incidentes do art. 48;
- Resolução CD/ANPD nº 2/2022, quando confirmada a qualificação como agente de tratamento de pequeno porte;
- Resolução CD/ANPD nº 15/2024, sobre comunicação de incidentes;
- Resolução CD/ANPD nº 18/2024, sobre a atuação do encarregado;
- Resolução CD/ANPD nº 19/2024, sobre transferências internacionais;
- guias vigentes da ANPD sobre agentes de tratamento, legítimo interesse, direitos dos titulares e segurança.

A IA engenheira não deverá:

- copiar extensos trechos legais para a página;
- apresentar esta lista normativa ao visitante como texto principal;
- afirmar conformidade absoluta;
- declarar que uma resolução dispensa todas as obrigações;
- presumir que a consultoria se enquadra como agente de pequeno porte sem validação;
- substituir análise de tratamento por referência genérica à LGPD.

---

# 2. Diagnóstico do aviso atual

## 2.1. Elementos que devem ser preservados conceitualmente

Preservar:

- identificação de Marcelo como controlador;
- localização em Belo Horizonte;
- explicação do formulário;
- referência a logs;
- referência à AWS;
- referência ao Google Analytics;
- referência ao WhatsApp;
- referência à transferência internacional;
- prazos de retenção;
- direitos dos titulares;
- medidas de segurança;
- ausência de newsletter ativa;
- ausência de publicidade;
- possibilidade de atualização.

## 2.2. Pontos a corrigir

O aviso deverá ser corrigido para:

1. usar os campos definitivos do Ajuste 14;
2. separar campos obrigatórios e opcionais;
3. remover campos que não existem;
4. não prometer diagnóstico ou proposta após todo envio;
5. não usar consentimento genérico como base do formulário;
6. descrever confirmação automática por e-mail;
7. distinguir o uso do site do uso de canais externos;
8. distinguir controlador e operadores;
9. alinhar o prazo dos logs com a infraestrutura;
10. alinhar o prazo do GA4 com a configuração real;
11. alinhar o prazo de contatos sem relação comercial;
12. incluir o cookie de preferência sem antecipar toda a Política de Cookies;
13. descrever transferências sem afirmar que tudo permanece no Brasil;
14. não afirmar que “os dados ficam apenas conosco”;
15. não afirmar segurança absoluta;
16. apresentar canal institucional funcional;
17. distinguir revogação de consentimento de oposição a outros tratamentos;
18. explicar que eliminação possui exceções legais;
19. explicar verificação de identidade proporcional;
20. declarar ausência atual de decisões exclusivamente automatizadas relevantes;
21. bloquear produção diante de divergência entre texto e sistema.

---

# 3. Configuração obrigatória

Criar uma fonte central de dados jurídicos e institucionais.

Estrutura equivalente:

```ts
interface PrivacyPublicConfig {
  controllerDisplayName: string;
  controllerLegalName: string;
  controllerLocation: string;

  privacyEmail: string;
  contactEmail: string;

  canonicalSiteUrl: string;
  privacyNoticePath: "/politica-de-privacidade";
  cookiesPolicyPath: "/politica-de-cookies";

  lastUpdatedAt: string;
  noticeVersion: string;

  contactRetentionMonths: number;
  securityLogRetentionDays: number;
  cookiePreferenceRetentionMonths: number;
  analyticsRetentionLabel: string;

  designatedDpo: boolean;
  smallProcessingAgentStatus:
    | "not-assessed"
    | "eligible"
    | "not-eligible";

  enabledProviders: string[];
}
```

## 3.1. Valores iniciais esperados

```text
controllerDisplayName: Marcelo Gonçalves
controllerLocation: Belo Horizonte, Minas Gerais, Brasil
privacyNoticePath: /politica-de-privacidade
cookiesPolicyPath: /politica-de-cookies
contactRetentionMonths: 6
securityLogRetentionDays: 30
cookiePreferenceRetentionMonths: 6
```

Os seguintes valores exigem confirmação antes da produção:

- nome civil completo do controlador;
- e-mail de privacidade;
- domínio canônico;
- retenção do GA4;
- qualificação como agente de pequeno porte;
- existência de encarregado formal;
- fornecedores habilitados;
- regiões e mecanismos de transferência;
- prazo real de cada log.

## 3.2. E-mail de privacidade

Preferência:

```text
privacidade@marcelogoncalves.com
```

Enquanto não estiver operacional, usar:

```text
contato@marcelogoncalves.com
```

O endereço publicado deverá:

- existir;
- receber mensagens;
- ser monitorado;
- permitir respostas;
- possuir autenticação adequada;
- ter recuperação de acesso;
- ser testado antes do deploy.

Não publicar:

- placeholder;
- endereço inexistente;
- e-mail não monitorado;
- caixa pessoal antiga depois da ativação do domínio institucional.

## 3.3. Nome legal

Confirmar o nome civil completo.

Não publicar:

- CPF;
- documento de identidade;
- endereço residencial;
- telefone pessoal;
- data de nascimento.

O nome visual do site pode permanecer:

```text
Marcelo Gonçalves
```

O aviso deverá utilizar o nome legal validado na identificação do controlador.

---

# 4. Estrutura visual da página

Usar exatamente:

1. Header global;
2. Breadcrumb;
3. Hero legal;
4. Resumo de leitura;
5. Sumário;
6. Corpo do aviso;
7. Bloco final de contato;
8. Footer global.

Não adicionar:

- CTA comercial;
- cards de serviços;
- depoimentos;
- formulário de contato;
- banner de venda;
- newsletter;
- logos de fornecedores;
- selos LGPD;
- selo “site seguro”;
- tabela de preços;
- FAQ comercial.

---

# 5. Breadcrumb

Usar:

```text
Início
Aviso de Privacidade
```

Destino de Início:

```text
/
```

O item atual:

- sem link;
- `aria-current="page"`.

---

# 6. Hero legal

## Eyebrow

```text
Privacidade
```

## H1

```text
Aviso de Privacidade
```

## Descrição

```text
Este aviso explica quais dados pessoais podem ser tratados durante o uso do site e dos canais de contato, para quais finalidades, com quem podem ser compartilhados e como você pode exercer seus direitos.
```

## Atualização

Formato:

```text
Última atualização: 27 de julho de 2026
```

A data será dinâmica a partir de `lastUpdatedAt`.

Não alterar por:

- build;
- deploy;
- correção de estilo;
- mudança de código sem impacto no tratamento.

---

# 7. Resumo de leitura

Criar bloco compacto com quatro itens:

## Controlador

```text
Marcelo Gonçalves, em Belo Horizonte, Minas Gerais.
```

Usar o nome legal configurado.

## Dados principais

```text
Dados de contato, informações sobre a solicitação e dados técnicos necessários ao funcionamento e à segurança.
```

## Finalidade principal

```text
Responder a contatos, avaliar possíveis próximos passos, manter a segurança e, quando autorizado, produzir estatísticas de uso.
```

## Canal

```text
Solicitações sobre dados pessoais podem ser enviadas para {privacyEmail}.
```

Regras:

- não apresentar como cards promocionais;
- pode usar definição em lista;
- links de e-mail funcionais;
- não substituir o texto completo.

---

# 8. Sumário

Renderizar porque o documento terá mais de quatro H2.

Título:

```text
Neste aviso
```

Itens:

1. Quem controla os dados;
2. A quem este aviso se aplica;
3. Quais dados podem ser tratados;
4. Como os dados são obtidos;
5. Finalidades e bases legais;
6. Formulário e comunicações;
7. Cookies e análise de uso;
8. Compartilhamento e fornecedores;
9. Transferências internacionais;
10. Retenção e eliminação;
11. Segurança e incidentes;
12. Seus direitos;
13. Como exercer seus direitos;
14. Crianças e adolescentes;
15. Decisões automatizadas;
16. Alterações deste aviso;
17. Contato.

Regras:

- IDs estáveis;
- `scroll-margin-top`;
- links acessíveis;
- sem posição sticky obrigatória;
- mobile com lista aberta ou disclosure acessível;
- preferir lista aberta.

---

# 9. Texto público definitivo — introdução

Usar:

```text
A privacidade é considerada desde a definição dos formulários, das integrações e dos serviços utilizados pela plataforma. Este aviso descreve o tratamento de dados pessoais realizado no site público e nos contatos iniciados a partir dele.

O aviso não abrange os tratamentos realizados por terceiros em seus próprios ambientes, como WhatsApp, LinkedIn ou outros sites externos, antes que as informações sejam recebidas e tratadas por Marcelo Gonçalves. Esses serviços possuem regras próprias de privacidade.
```

Não usar:

```text
Seus dados ficam apenas conosco.
```

Não usar:

```text
Garantimos a segurança dos seus dados.
```

---

# 10. Seção — Quem controla os dados

## H2

```text
1. Quem controla os dados
```

## Texto

```text
O controlador dos dados pessoais descritos neste aviso é {controllerLegalName}, localizado em Belo Horizonte, Minas Gerais, Brasil.

Para assuntos relacionados à privacidade e ao exercício de direitos, utilize o e-mail {privacyEmail}.
```

## Regra sobre encarregado

Não inserir publicamente:

```text
Encarregado de dados
```

sem designação formal.

Se houver encarregado formal:

- atualizar o texto;
- publicar nome ou identidade definida;
- publicar canal;
- atualizar configuração;
- revisar a Resolução CD/ANPD nº 18/2024.

Se for confirmada a condição de agente de pequeno porte sem encarregado:

- manter canal funcional;
- não é necessário transformar o texto em justificativa jurídica;
- registrar internamente a avaliação.

---

# 11. Seção — A quem este aviso se aplica

## H2

```text
2. A quem este aviso se aplica
```

## Texto

```text
Este aviso se aplica a pessoas que:

- navegam pelas páginas e artigos;
- enviam o formulário de contato;
- enviam ou recebem mensagens relacionadas a uma solicitação;
- iniciam contato por e-mail ou WhatsApp a partir do site;
- exercem direitos relacionados aos seus dados pessoais.

O site é voltado principalmente a profissionais e representantes de empresas. Ele não é direcionado a crianças.
```

Não afirmar que pessoas físicas não podem utilizar o formulário.

---

# 12. Seção — Quais dados podem ser tratados

## H2

```text
3. Quais dados podem ser tratados
```

## 12.1. Formulário de contato

### Obrigatórios

```text
- nome;
- e-mail;
- empresa ou projeto;
- área mais relacionada ao desafio;
- descrição do desafio.
```

### Opcionais

```text
- função;
- telefone ou WhatsApp;
- tamanho da empresa.
```

## 12.2. Comunicações

```text
- conteúdo das mensagens;
- data e horário;
- participantes;
- histórico necessário para compreender e responder à solicitação;
- informações fornecidas voluntariamente durante conversas.
```

## 12.3. Dados técnicos

```text
- endereço IP e dados de rede tratados pela infraestrutura;
- data e horário de acesso ou envio;
- rota ou página de origem;
- identificadores técnicos de requisição;
- navegador e informações técnicas necessárias para segurança e diagnóstico;
- resultado técnico do envio;
- dados de referência e campanhas sanitizados, quando presentes.
```

## 12.4. Preferências e analytics

```text
- escolha sobre recursos analíticos;
- identificadores e eventos analíticos, somente quando autorizados;
- páginas acessadas e interações permitidas, sem o conteúdo do formulário.
```

## 12.5. Solicitações de direitos

```text
- identificação e contato do solicitante;
- conteúdo da solicitação;
- informações necessárias para verificar a identidade de forma proporcional;
- registros da análise e da resposta.
```

## 12.6. Texto de cautela

```text
Não solicitamos pelo formulário senhas, chaves de acesso, dados bancários, informações médicas, documentos confidenciais ou outras categorias de dados sensíveis. Evite incluir essas informações. Se elas forem necessárias para uma futura prestação de serviço, o canal, a finalidade e os controles adequados serão definidos separadamente.
```

## 12.7. Proibição

Não afirmar que IP é anonimizado se a infraestrutura registra o endereço.

Não afirmar que user-agent completo é armazenado se isso não estiver confirmado.

A versão pública deverá listar apenas categorias realmente tratadas.

---

# 13. Seção — Como os dados são obtidos

## H2

```text
4. Como os dados são obtidos
```

## Texto

```text
Os dados podem ser obtidos:

- diretamente de você, ao preencher o formulário ou enviar uma mensagem;
- automaticamente pela infraestrutura, quando você acessa o site ou envia uma solicitação;
- por tecnologias analíticas, somente após a autorização aplicável;
- pelos canais externos que você escolhe utilizar, como e-mail ou WhatsApp;
- de representantes da sua empresa, quando eles incluem você em uma comunicação relacionada a uma solicitação legítima.
```

## Dados de terceiros fornecidos pelo visitante

Adicionar:

```text
Se você informar dados de outra pessoa, deverá fazê-lo apenas quando tiver fundamento e necessidade para isso. Evite incluir dados de colegas, clientes ou terceiros que não sejam necessários para explicar o desafio.
```

---

# 14. Seção — Finalidades e bases legais

## H2

```text
5. Finalidades e bases legais
```

Criar tabela responsiva com as colunas:

```text
Finalidade
Dados principais
Base legal
```

## 14.1. Responder ao contato

### Finalidade

```text
Receber, organizar e responder à solicitação.
```

### Dados

```text
Dados do formulário, mensagens e dados de contato.
```

### Base

```text
Procedimentos preliminares relacionados a possível contrato, quando solicitados pelo titular; e legítimo interesse, quando necessário para responder a contatos que ainda não constituem tratativa pré-contratual.
```

## 14.2. Avaliar aderência e próximo passo

### Finalidade

```text
Compreender o contexto, avaliar se a solicitação está relacionada às competências da consultoria e definir possíveis próximos passos.
```

### Dados

```text
Empresa, função, área, mensagem e histórico da comunicação.
```

### Base

```text
Procedimentos preliminares a pedido do titular e legítimo interesse, com tratamento limitado ao necessário.
```

## 14.3. Enviar confirmação

### Finalidade

```text
Confirmar o recebimento do formulário e fornecer uma referência da solicitação.
```

### Dados

```text
Nome, e-mail, área e identificador da solicitação.
```

### Base

```text
Procedimentos preliminares a pedido do titular e legítimo interesse em manter uma comunicação confiável.
```

## 14.4. Manter segurança

### Finalidade

```text
Prevenir abuso, spam, fraude, acessos não autorizados e diagnosticar falhas.
```

### Dados

```text
Dados técnicos, logs, identificadores de requisição e sinais de segurança.
```

### Base

```text
Legítimo interesse na segurança do site e dos usuários, cumprimento de obrigações aplicáveis e exercício regular de direitos.
```

## 14.5. Produzir estatísticas

### Finalidade

```text
Compreender o uso das páginas e dos artigos para melhorar conteúdo e navegação.
```

### Dados

```text
Eventos analíticos e identificadores definidos na Política de Cookies.
```

### Base

```text
Consentimento.
```

## 14.6. Cumprir obrigações e defender direitos

### Finalidade

```text
Cumprir obrigações legais ou regulatórias, responder a autoridades e exercer direitos em processos administrativos, judiciais ou extrajudiciais.
```

### Dados

```text
Dados relacionados à obrigação, solicitação, contrato, incidente ou controvérsia.
```

### Base

```text
Cumprimento de obrigação legal ou regulatória e exercício regular de direitos.
```

## 14.7. Atender direitos do titular

### Finalidade

```text
Receber, verificar, analisar e responder a solicitações relacionadas à proteção de dados.
```

### Dados

```text
Identificação, contato, solicitação, evidências e resposta.
```

### Base

```text
Cumprimento de obrigação legal e exercício regular de direitos.
```

## 14.8. Nota após a tabela

Usar:

```text
O consentimento não é a base genérica do formulário de contato. Quando o tratamento estiver baseado em consentimento, você poderá revogá-lo de forma gratuita e facilitada. A revogação não torna ilícitos os tratamentos realizados anteriormente e não impede tratamentos sustentados por outra base legal.
```

---

# 15. Legítimo interesse — controle interno obrigatório

Sempre que `legítimo interesse` for utilizado:

- registrar finalidade concreta;
- demonstrar necessidade;
- avaliar expectativa do titular;
- avaliar impacto;
- identificar salvaguardas;
- documentar teste de balanceamento;
- permitir oposição quando aplicável;
- reavaliar após mudança material.

Criar registro equivalente:

```ts
interface LegitimateInterestAssessment {
  id: string;
  processingActivityId: string;
  purpose: string;
  benefit: string;
  necessity: string;
  dataCategories: string[];
  reasonableExpectations: string;
  risks: string[];
  safeguards: string[];
  oppositionMechanism: string;
  conclusion: "approved" | "rejected" | "review";
  reviewedAt: string;
}
```

O aviso não substitui o teste.

O build não precisa expor o teste publicamente.

---

# 16. Seção — Formulário e comunicações

## H2

```text
6. Formulário e comunicações
```

## Texto definitivo

```text
As informações enviadas pelo formulário são utilizadas para compreender a solicitação, responder ao contato e avaliar possíveis próximos passos.

A primeira conversa não corresponde automaticamente a um diagnóstico detalhado, proposta ou contratação. Quando forem necessários levantamento, acesso a ambientes, análise documental ou recomendações específicas, essa atividade poderá ser estruturada separadamente.

Após o envio, uma confirmação automática poderá ser enviada ao e-mail informado. Essa confirmação é transacional e não inclui o visitante em newsletter ou comunicação promocional.

As mensagens poderão ser tratadas por e-mail e, quando você escolher esse canal, por WhatsApp. Não envie credenciais, senhas ou dados sensíveis por esses meios.
```

## 16.1. Newsletter

Adicionar:

```text
Atualmente, o envio do formulário não realiza inscrição em newsletter. Caso um canal de conteúdo seja criado no futuro, a adesão deverá ser opcional, separada e desmarcada por padrão.
```

## 16.2. Marketing

Não afirmar que nenhum contato comercial poderá ocorrer.

É permitido responder sobre a própria solicitação.

Não usar dados para campanhas não relacionadas sem nova avaliação e base legal.

---

# 17. Seção — Cookies e análise de uso

## H2

```text
7. Cookies e análise de uso
```

## Texto

```text
O site utiliza um recurso necessário para registrar sua escolha sobre cookies. Recursos analíticos do Google Analytics somente devem ser carregados depois da autorização correspondente.

Quando você rejeita a análise, a navegação, a leitura de artigos e o envio do formulário devem continuar disponíveis.

A lista atualizada de tecnologias, finalidades, duração e formas de alterar a escolha está na Política de Cookies.
```

Link:

```text
Política de Cookies
```

Destino:

```text
/politica-de-cookies
```

## Proibição

Não listar cookies específicos nesta página.

Não prometer que analytics é totalmente anônimo.

Não afirmar que o Google não recebe endereço IP durante o processamento.

Esses detalhes pertencem ao Ajuste 17D e à configuração real.

---

# 18. Seção — Compartilhamento e fornecedores

## H2

```text
8. Compartilhamento e fornecedores
```

## Introdução

```text
Os dados não são vendidos. Eles podem ser compartilhados apenas quando necessário para operar o site, responder à solicitação, manter a segurança, cumprir obrigações ou exercer direitos.
```

## Categorias

### Amazon Web Services

```text
Infraestrutura de hospedagem, distribuição, APIs, logs, armazenamento e envio transacional de e-mails, conforme os serviços efetivamente habilitados.
```

### Provedor de e-mail

```text
Recebimento, armazenamento e organização das comunicações.
```

Usar o nome público do provedor somente se confirmado:

```text
Google Workspace
```

ou outro.

### Google Analytics

```text
Produção de estatísticas de uso, somente após autorização.
```

### WhatsApp / Meta

```text
Tratamento relacionado às mensagens iniciadas por você nesse canal e ao funcionamento do serviço externo.
```

### LinkedIn

```text
Tratamento realizado quando você escolhe acessar o perfil ou utilizar os recursos do serviço externo.
```

### Prestadores profissionais

```text
Profissionais de contabilidade, assessoria jurídica, segurança ou tecnologia, quando o acesso for necessário e sujeito a deveres adequados.
```

### Autoridades

```text
Autoridades públicas, órgãos reguladores ou partes envolvidas em processos, quando houver obrigação, solicitação válida ou necessidade de exercer direitos.
```

## 18.1. Regras de fornecedores

A lista pública deve corresponder à configuração real.

Não listar:

- CRM não utilizado;
- ferramenta de marketing inexistente;
- processador de pagamento inexistente;
- plataforma de newsletter inexistente;
- fornecedor apenas avaliado;
- LinkedIn como operador do site se houver apenas link externo.

## 18.2. Contratos e permissões

Internamente, cada fornecedor deverá possuir:

- finalidade;
- dados acessados;
- papel;
- localização;
- retenção;
- suboperadores relevantes;
- medidas de segurança;
- mecanismo de transferência;
- contrato ou termos aplicáveis;
- data de revisão.

---

# 19. Seção — Transferências internacionais

## H2

```text
9. Transferências internacionais
```

## Texto público

```text
Alguns fornecedores de infraestrutura, e-mail, comunicação ou análise possuem operação global e podem tratar dados pessoais fora do Brasil ou permitir acesso a partir de outros países.

Quando houver transferência internacional de dados, deverão ser observadas a LGPD, a regulamentação da ANPD e as garantias aplicáveis ao caso, como cláusulas contratuais, mecanismos reconhecidos ou outras hipóteses legalmente previstas.

A localização de um servidor específico não elimina a possibilidade de suporte, subcontratação ou acesso internacional. Por isso, a avaliação deve considerar toda a cadeia do fornecedor.
```

## 19.1. Controle interno

Manter inventário:

```ts
interface InternationalTransferRecord {
  providerId: string;
  dataCategories: string[];
  destinationCountries: string[];
  accessCountries: string[];
  purpose: string;
  legalBasis: string;
  transferMechanism: string;
  contractReference: string;
  onwardTransfers: string[];
  reviewedAt: string;
}
```

## 19.2. Proibições

Não afirmar:

```text
Todos os dados permanecem no Brasil.
```

sem evidência completa.

Não afirmar:

```text
O uso de AWS garante conformidade.
```

Não publicar mecanismo contratual sem validação.

---

# 20. Seção — Retenção e eliminação

## H2

```text
10. Retenção e eliminação
```

Criar tabela:

```text
Categoria
Período ou critério
```

## 20.1. Contatos sem relação ativa

```text
Até 6 meses após a última interação, quando não houver negociação, proposta, contrato, obrigação ou necessidade de defesa.
```

## 20.2. Negociações e propostas

```text
Durante a análise e a negociação e, depois, pelo período necessário para demonstrar as tratativas e exercer direitos, conforme o contexto e os prazos legais aplicáveis.
```

## 20.3. Contratos e obrigações

```text
Durante a relação contratual e pelos prazos necessários ao cumprimento de obrigações legais, fiscais, contábeis e ao exercício de direitos.
```

## 20.4. Logs de segurança

```text
Em regra, 30 dias, salvo necessidade de investigação de incidente, prevenção de fraude, obrigação ou exercício de direitos.
```

Este prazo deve coincidir com a infraestrutura.

## 20.5. Preferência de cookies

```text
6 meses, ou até você alterar a escolha, ocorrer mudança material ou a versão da preferência ser substituída.
```

## 20.6. Analytics

```text
Pelo período configurado e informado na Política de Cookies.
```

Antes da produção, substituir por período real quando a propriedade estiver validada.

## 20.7. Solicitações de direitos

```text
Pelo tempo necessário para atender a solicitação, comprovar o atendimento e cumprir obrigações aplicáveis.
```

## 20.8. Nota

```text
Ao final do período aplicável, os dados serão eliminados, anonimizados ou mantidos somente quando houver fundamento para conservação, como cumprimento de obrigação, pesquisa com salvaguardas ou exercício regular de direitos.
```

## 20.9. Matriz interna

Criar registro de retenção:

```ts
interface RetentionRule {
  processingActivityId: string;
  dataCategory: string;
  activePeriod: string;
  inactiveRetention: string;
  deletionMethod: string;
  exceptionCriteria: string[];
  systemLocations: string[];
  owner: string;
  reviewedAt: string;
}
```

---

# 21. Seção — Segurança e incidentes

## H2

```text
11. Segurança e incidentes
```

## Texto público

```text
São adotadas medidas técnicas e administrativas proporcionais ao contexto, como conexão criptografada, controle de acesso, permissões limitadas, registros operacionais, atualização de componentes e monitoramento de falhas.

Nenhum sistema é totalmente imune a incidentes. Caso ocorra uma situação envolvendo dados pessoais, ela será avaliada e tratada conforme o risco, as obrigações aplicáveis e os procedimentos de resposta a incidentes.

Quando a legislação e a regulamentação exigirem, a ANPD e os titulares afetados serão comunicados.
```

## Não utilizar

```text
100% seguro
Segurança garantida
Risco zero
Proteção total
```

## 21.1. Interno

O aviso não substitui:

- política de segurança;
- controle de acessos;
- backup;
- gestão de vulnerabilidades;
- resposta a incidentes;
- avaliação de risco;
- comunicação regulatória.

O Ajuste 17G deverá detalhar esses controles.

---

# 22. Seção — Seus direitos

## H2

```text
12. Seus direitos
```

## Texto introdutório

```text
Nos termos aplicáveis da LGPD, você pode solicitar:
```

## Lista

```text
- confirmação da existência de tratamento;
- acesso aos dados;
- correção de dados incompletos, inexatos ou desatualizados;
- anonimização, bloqueio ou eliminação de dados desnecessários, excessivos ou tratados em desconformidade;
- portabilidade, quando regulamentada e aplicável;
- informação sobre entidades com as quais houve compartilhamento;
- informação sobre a possibilidade de não fornecer consentimento e suas consequências, quando o consentimento for solicitado;
- revogação do consentimento;
- eliminação dos dados tratados com consentimento, observadas as hipóteses legais de conservação;
- oposição a tratamento realizado com fundamento diferente do consentimento, quando houver descumprimento da LGPD;
- revisão e informações sobre decisões exclusivamente automatizadas que afetem seus interesses, quando existirem;
- peticionamento perante a ANPD e, em relações de consumo, perante órgãos competentes.
```

## Nota

```text
Os direitos não são absolutos. Uma solicitação poderá não ser atendida integralmente quando houver obrigação de conservação, necessidade de proteger direitos de terceiros, segredo comercial ou industrial, impossibilidade técnica ou outra hipótese legal. Nesse caso, a resposta apresentará a justificativa aplicável.
```

---

# 23. Seção — Como exercer seus direitos

## H2

```text
13. Como exercer seus direitos
```

## Texto público

```text
Envie a solicitação para {privacyEmail}, de preferência com o assunto “Solicitação sobre dados pessoais”.

Informe:

- seu nome;
- o e-mail ou canal utilizado no contato;
- o direito que deseja exercer;
- informações suficientes para localizar os dados.

Para proteger você e terceiros, poderemos solicitar informações adicionais para confirmar a identidade. A verificação será proporcional à solicitação e não deverá exigir mais dados do que o necessário.

O exercício dos direitos é gratuito. As solicitações serão analisadas e respondidas nos prazos aplicáveis.
```

## 23.1. Não exigir publicamente

Não exigir:

- cópia de documento em toda solicitação;
- selfie;
- reconhecimento facial;
- CPF;
- assinatura eletrônica;

como regra geral.

A verificação dependerá do risco.

## 23.2. Fluxo interno

Usar estados:

```text
received
identity-check
in-analysis
awaiting-information
completed
partially-completed
denied
```

Registro:

```ts
interface DataSubjectRequest {
  id: string;
  receivedAt: string;
  channel: string;
  requesterContact: string;
  requestTypes: string[];
  identityVerification: string;
  status: string;
  systemsChecked: string[];
  responseSummary: string;
  completedAt?: string;
  legalHold?: boolean;
}
```

## 23.3. Confirmação

Enviar confirmação de recebimento.

Não prometer prazo público menor que o operacionalmente sustentável.

Internamente, definir triagem inicial recomendada em até:

```text
2 dias úteis
```

Esse prazo interno não substitui prazos legais.

---

# 24. Canal e encarregado

## 24.1. Avaliação interna

Antes da produção, definir:

```text
smallProcessingAgentStatus
designatedDpo
```

## 24.2. Se não houver encarregado

Manter canal de comunicação público e funcional.

Não usar título:

```text
DPO
Encarregado
```

para uma caixa genérica.

## 24.3. Se houver encarregado

Atualizar:

- nome ou identidade;
- canal;
- atribuições;
- configuração;
- documento de indicação;
- Aviso;
- registros internos.

## 24.4. Agente de pequeno porte

A dispensa de encarregado, quando aplicável, não dispensa:

- transparência;
- bases legais;
- direitos;
- segurança;
- atendimento;
- registro;
- governança.

---

# 25. Seção — Crianças e adolescentes

## H2

```text
14. Crianças e adolescentes
```

## Texto

```text
O site e os serviços não são direcionados a crianças. O formulário foi criado para contatos profissionais e empresariais.

Não coletamos intencionalmente dados de crianças por meio do formulário. Se identificarmos que dados desse tipo foram enviados sem necessidade, adotaremos medidas proporcionais para interromper o tratamento e eliminar as informações, salvo quando a conservação for legalmente necessária.
```

Não implementar:

- age gate;
- checkbox de maioridade;
- coleta de documento.

---

# 26. Seção — Decisões automatizadas

## H2

```text
15. Decisões automatizadas
```

## Texto

```text
Atualmente, o site não utiliza dados de visitantes ou contatos para tomar decisões exclusivamente automatizadas que produzam efeitos jurídicos ou afetem de forma relevante seus interesses.

Ferramentas de inteligência artificial podem auxiliar processos editoriais ou técnicos, mas não devem utilizar o conteúdo do formulário para treinamento, perfilamento ou decisão comercial automática sem nova avaliação, transparência e base legal.
```

## Gate

Antes de ativar:

- lead scoring;
- rejeição automática;
- classificação de prioridade com impacto;
- perfilamento comercial;
- resumo enviado a modelo externo;
- treinamento de modelos;
- decisão de contratação;

atualizar:

- inventário;
- contratos;
- bases legais;
- notice;
- medidas de segurança;
- direitos;
- avaliação de impacto, quando necessária.

---

# 27. Seção — Alterações deste aviso

## H2

```text
16. Alterações deste aviso
```

## Texto

```text
Este aviso poderá ser atualizado para refletir mudanças no site, nos serviços, nos fornecedores, nas finalidades ou nas regras aplicáveis.

A versão vigente será indicada pela data de atualização. Quando uma alteração for relevante para o tratamento ou para uma escolha baseada em consentimento, será utilizado um meio adequado para informar a mudança e, quando necessário, solicitar uma nova decisão.
```

## Versionamento

Usar:

```text
noticeVersion
lastUpdatedAt
```

Manter histórico interno das versões.

Não precisa publicar changelog completo.

É permitido publicar resumo de alteração material.

---

# 28. Seção — Contato

## H2

```text
17. Contato
```

## Texto

```text
Controlador: {controllerLegalName}

Localização: Belo Horizonte, Minas Gerais, Brasil

E-mail para privacidade: {privacyEmail}

E-mail geral: {contactEmail}
```

## Link adicional

```text
Conhecer a Política de Cookies
```

Destino:

```text
/politica-de-cookies
```

Não adicionar CTA comercial.

---

# 29. Bloco final de contato

Após o documento, criar bloco visual discreto.

## Eyebrow

```text
Privacidade
```

## H2 ou H3

```text
Precisa falar sobre seus dados?
```

## Texto

```text
Use o canal de privacidade para solicitar informações, correções, eliminação ou exercer outro direito aplicável.
```

## CTA

```text
Enviar solicitação por e-mail
```

Destino:

```text
mailto:{privacyEmail}?subject=Solicitação%20sobre%20dados%20pessoais
```

Não criar formulário específico nesta tarefa.

Não usar o CTA global de serviços.

---

# 30. Dados sensíveis recebidos indevidamente

Criar procedimento interno:

1. não reproduzir em logs;
2. restringir acesso;
3. avaliar necessidade;
4. solicitar reenvio por canal adequado, quando necessário;
5. eliminar quando não houver fundamento;
6. registrar a decisão sem copiar o dado;
7. não utilizar para finalidade adicional.

Não prometer eliminação imediata quando houver backup ou obrigação, mas executar dentro de prazo razoável e documentado.

---

# 31. Compartilhamento entre canais

## 31.1. E-mail

Mensagens enviadas pelo site poderão chegar a uma caixa de e-mail.

## 31.2. WhatsApp

Quando o visitante inicia WhatsApp:

- Meta trata dados no serviço;
- Marcelo trata a conversa recebida;
- não importar automaticamente contatos para marketing;
- não sincronizar com CRM sem atualização.

## 31.3. LinkedIn

A visita ao perfil é um tratamento do LinkedIn.

Mensagens recebidas pelo LinkedIn passam a integrar a comunicação com Marcelo.

## 31.4. Migração de canal

Se uma conversa for movida para outro canal:

- informar quando necessário;
- não copiar dados excessivos;
- preservar histórico apenas conforme necessidade.

---

# 32. Inventário das atividades de tratamento

Manter registro interno, inclusive em formato simplificado quando aplicável.

Estrutura:

```ts
interface ProcessingActivity {
  id: string;
  name: string;
  purpose: string;
  dataSubjects: string[];
  dataCategories: string[];
  sensitiveData: boolean;
  sources: string[];
  legalBases: string[];
  recipients: string[];
  providers: string[];
  internationalTransfers: string[];
  retentionRuleId: string;
  systems: string[];
  securityMeasures: string[];
  owner: string;
  reviewedAt: string;
}
```

Atividades mínimas:

```text
website-access-logs
contact-form
contact-email-confirmation
email-communications
whatsapp-communications
analytics
cookie-preferences
data-subject-requests
security-incidents
```

---

# 33. Registro de fornecedores

Para cada fornecedor:

```ts
interface PrivacyProviderRecord {
  id: string;
  legalName: string;
  publicName: string;
  purpose: string;
  role: "operator" | "independent-controller" | "mixed" | "to-assess";
  dataCategories: string[];
  services: string[];
  regions: string[];
  subprocessorReference: string;
  contractReference: string;
  transferMechanism: string;
  securityReference: string;
  retentionReference: string;
  enabled: boolean;
  reviewedAt: string;
}
```

Não publicar papel como operador se a relação jurídica indicar controlador independente.

---

# 34. Coerência com o formulário

Criar esquema exportável dos campos públicos.

O Aviso deverá ser validado contra:

```ts
const contactFormFields = [
  "name",
  "email",
  "company",
  "role",
  "phone",
  "companySize",
  "area",
  "message",
];
```

Mapeamento público:

```ts
const privacyNoticeContactFields = [
  "nome",
  "e-mail",
  "empresa ou projeto",
  "função",
  "telefone ou WhatsApp",
  "tamanho da empresa",
  "área relacionada ao desafio",
  "descrição do desafio",
];
```

O build deverá falhar quando:

- campo novo não estiver mapeado;
- campo removido continuar listado;
- obrigatoriedade divergir;
- finalidade divergir;
- retenção divergir;
- confirmação por e-mail estiver ativa e ausente do aviso.

---

# 35. Coerência com fornecedores

O build deverá falhar quando:

- fornecedor com dados pessoais estiver ativo e não estiver no registro;
- analytics estiver ativo e não houver referência;
- e-mail transacional estiver ativo e AWS não estiver registrada;
- WhatsApp estiver ativo e não houver explicação;
- CRM estiver ativo e ausente;
- serviço externo receber mensagem e não estiver inventariado;
- transferência existir sem avaliação.

Não é necessário listar no texto todo suboperador individual, mas o inventário interno deve ser mantido.

---

# 36. Coerência com retenção

Criar teste que compare:

```text
contactRetentionMonths
securityLogRetentionDays
cookiePreferenceRetentionMonths
analyticsRetentionLabel
```

com:

- infraestrutura;
- configurações;
- Aviso;
- Política de Cookies.

Bloquear deploy quando houver divergência conhecida.

Não permitir valores como:

```text
15 dias no aviso
30 dias no CloudWatch
```

sem regra documentada por tipo de log.

---

# 37. Metadados

## Title

```text
Aviso de Privacidade | Marcelo Gonçalves
```

## Description

```text
Entenda como os dados pessoais podem ser tratados no site e nos canais de contato, para quais finalidades e como exercer seus direitos.
```

## Canonical

```text
/politica-de-privacidade
```

## Robots

```text
index, follow
```

## Open Graph

Usar title e description equivalentes.

Não exigir imagem exclusiva.

## Dados estruturados

Não são obrigatórios.

Se já houver infraestrutura:

- WebPage;
- dateModified;
- mainEntity compatível.

Não usar:

- LegalService;
- certification;
- rating.

---

# 38. Responsividade

## Desktop

- hero compacto;
- resumo em até quatro colunas ou lista;
- sumário e corpo com largura legível;
- tabelas responsivas;
- bloco final discreto.

## Tablet

- resumo em duas colunas;
- corpo em uma coluna;
- sumário acima;
- tabelas com scroll.

## Mobile

- uma coluna;
- resumo empilhado;
- sumário aberto;
- tabelas em container;
- e-mail com quebra;
- headings sem corte;
- CTA de e-mail com área adequada.

Validar:

```text
320px
360px
390px
414px
768px
1024px
1366px
1440px
```

E:

```text
zoom 200%
```

---

# 39. Acessibilidade

## 39.1. Headings

- um H1;
- H2 para seções;
- H3 apenas para subseções;
- ordem coerente.

## 39.2. Tabelas

- caption;
- th;
- scope;
- scroll acessível;
- não usar tabela para layout.

## 39.3. Links

- foco visível;
- texto descritivo;
- e-mail acessível;
- links internos na mesma aba;
- fontes externas, se adicionadas, com indicação adequada.

## 39.4. Sumário

- lista semântica;
- links de âncora;
- destino não coberto pelo header.

## 39.5. Contraste

WCAG AA.

## 39.6. Linguagem

- frases claras;
- parágrafos curtos;
- termos jurídicos explicados pelo contexto;
- não simplificar a ponto de alterar o significado.

## 39.7. Leitor de tela

Validar:

- breadcrumb;
- H1;
- atualização;
- resumo;
- sumário;
- tabelas;
- listas;
- e-mails;
- bloco final;
- footer.

---

# 40. Impressão

Criar estilo de impressão.

Em impressão:

- ocultar header de navegação;
- ocultar footer global ou simplificar;
- ocultar CTA de e-mail como botão, preservando endereço;
- expandir sumário, se necessário;
- manter URL e data;
- evitar quebra de título da seção;
- manter tabelas legíveis;
- não imprimir fundos desnecessários;
- incluir canonical ou URL no cabeçalho/rodapé da impressão, se o projeto já possui helper.

---

# 41. Analytics da página

Aplicar somente após consentimento e se existir helper.

Eventos permitidos:

```text
privacy_notice_view
privacy_notice_toc_click
privacy_notice_contact_click
privacy_notice_cookies_policy_click
```

Propriedades permitidas:

- `sectionId`;
- `linkType`;
- `noticeVersion`.

Não enviar:

- e-mail;
- dados da solicitação;
- direito selecionado;
- conteúdo;
- query;
- PII.

A página deverá funcionar integralmente sem analytics.

---

# 42. Testes de conteúdo

Validar presença de:

```text
Aviso de Privacidade
Marcelo Gonçalves
Belo Horizonte
dados do formulário
finalidades e bases legais
procedimentos preliminares
legítimo interesse
consentimento para analytics
AWS
transferências internacionais
6 meses
30 dias
direitos
canal de privacidade
crianças
decisões automatizadas
```

Validar ausência de:

```text
Seus dados ficam apenas conosco
diagnóstico gratuito
proposta garantida
segurança garantida
100% seguro
riscos zero
consentimento obrigatório para contato
newsletter automática
```

---

# 43. Testes funcionais

Testar:

- rota;
- canonical;
- breadcrumb;
- sumário;
- âncoras;
- links legais;
- e-mail;
- assunto do mailto;
- data;
- versão;
- tabelas;
- mobile;
- impressão;
- ausência de CTA comercial.

---

# 44. Testes de coerência

Testar automaticamente:

1. oito campos do formulário;
2. cinco obrigatórios;
3. três opcionais;
4. confirmação automática;
5. retenção de contato;
6. retenção de logs;
7. retenção de preferência;
8. analytics condicionado;
9. fornecedores;
10. e-mail de privacidade;
11. domínio;
12. versão.

---

# 45. Testes jurídicos e operacionais manuais

Antes da produção, revisar:

- nome legal;
- canal;
- enquadramento como pequeno agente;
- encarregado;
- bases legais;
- teste de legítimo interesse;
- fornecedores;
- contratos;
- transferências;
- retenções;
- logs;
- GA4;
- direitos;
- incidentes;
- crianças;
- IA;
- mudanças de finalidade.

Registrar responsável e data da revisão.

---

# 46. Bloqueios de produção

Bloquear quando:

1. nome legal não estiver validado;
2. e-mail de privacidade não funcionar;
3. existir placeholder;
4. formulário divergir;
5. finalidade divergir;
6. retenção divergir;
7. fornecedor ativo estiver ausente;
8. analytics estiver ativo sem consentimento;
9. transferência estiver sem avaliação;
10. campo sensível for solicitado sem revisão;
11. CRM estiver ativo sem atualização;
12. newsletter estiver ativa sem atualização;
13. decisão automatizada estiver ativa sem atualização;
14. noticeVersion estiver vazia;
15. lastUpdatedAt estiver vazia;
16. canonical apontar para URL temporária após domínio definitivo;
17. link de cookies estiver quebrado;
18. texto afirmar segurança absoluta.

---

# 47. Ordem de implementação

1. Inventariar o aviso atual.
2. Inventariar o formulário.
3. Inventariar logs.
4. Inventariar fornecedores.
5. Inventariar cookies e analytics em nível preliminar.
6. Confirmar nome legal.
7. Confirmar e-mail.
8. Confirmar domínio.
9. Confirmar prazos.
10. Criar configuração.
11. Criar template legal ou reutilizar.
12. Implementar hero.
13. Implementar resumo.
14. Implementar sumário.
15. Substituir texto integralmente.
16. Implementar tabelas.
17. Implementar bloco final.
18. Implementar metadata.
19. Criar registro de tratamentos.
20. Criar registro de fornecedores.
21. Criar registro de retenção.
22. Criar teste de legítimo interesse.
23. Criar validações de coerência.
24. Ajustar mobile.
25. Ajustar impressão.
26. Executar testes.
27. Realizar revisão técnica.
28. Realizar revisão jurídica adequada.
29. Publicar em homologação.
30. comparar comportamento real e texto;
31. promover para produção.

---

# 48. Critérios de aceite — transparência

Será aceito quando:

1. controlador estiver identificado;
2. canal estiver funcional;
3. dados estiverem listados;
4. obrigatórios e opcionais estiverem separados;
5. finalidades estiverem específicas;
6. bases legais estiverem separadas;
7. consentimento não for base genérica;
8. compartilhamentos estiverem claros;
9. transferências estiverem explicadas;
10. retenções estiverem claras;
11. direitos estiverem completos;
12. limitações estiverem explicadas.

---

# 49. Critérios de aceite — coerência técnica

Será aceito quando:

1. texto refletir o formulário;
2. texto refletir SES e e-mail;
3. texto refletir analytics;
4. texto refletir logs;
5. texto refletir fornecedores;
6. texto refletir WhatsApp;
7. texto refletir ausência de newsletter;
8. texto refletir ausência de decisões automatizadas;
9. prazos coincidirem;
10. build bloquear divergências.

---

# 50. Critérios de aceite — visual e acessibilidade

Será aceito quando:

1. template legal for consistente;
2. não houver CTA comercial;
3. sumário funcionar;
4. corpo for legível;
5. tabelas funcionarem em mobile;
6. e-mail não gerar overflow;
7. headings forem coerentes;
8. contraste atender AA;
9. teclado funcionar;
10. zoom 200% funcionar;
11. impressão funcionar;
12. leitor de tela compreender a página.

---

# 51. Checklist final de revisão humana

- [ ] Rota preservada.
- [ ] H1 Aviso de Privacidade.
- [ ] Metadata correta.
- [ ] Canonical correto.
- [ ] Data correta.
- [ ] Versão correta.
- [ ] Nome legal confirmado.
- [ ] Localização correta.
- [ ] E-mail de privacidade funcional.
- [ ] E-mail geral funcional.
- [ ] Sem CPF.
- [ ] Sem endereço residencial.
- [ ] Resumo presente.
- [ ] Sumário presente.
- [ ] Introdução correta.
- [ ] Aplicação do aviso correta.
- [ ] Campos obrigatórios corretos.
- [ ] Campos opcionais corretos.
- [ ] Dados técnicos corretos.
- [ ] Dados sensíveis não solicitados.
- [ ] Origens descritas.
- [ ] Finalidades específicas.
- [ ] Bases legais corretas.
- [ ] Formulário sem consentimento genérico.
- [ ] Confirmação por e-mail descrita.
- [ ] Newsletter ausente.
- [ ] Cookies referenciados.
- [ ] AWS descrita.
- [ ] Provedor de e-mail descrito.
- [ ] Analytics condicionado.
- [ ] WhatsApp descrito.
- [ ] LinkedIn descrito.
- [ ] Fornecedores reais.
- [ ] Transferência internacional explicada.
- [ ] Mecanismos avaliados.
- [ ] Contato por 6 meses.
- [ ] Logs por 30 dias ou prazo real alinhado.
- [ ] Preferência por 6 meses.
- [ ] GA4 com prazo real.
- [ ] Segurança sem absolutos.
- [ ] Incidentes descritos.
- [ ] Direitos completos.
- [ ] Solicitação gratuita.
- [ ] Verificação proporcional.
- [ ] Canal de titulares funcional.
- [ ] Crianças descritas.
- [ ] Decisões automatizadas descritas.
- [ ] IA não usa formulário sem revisão.
- [ ] Atualizações descritas.
- [ ] Bloco final correto.
- [ ] Registro de tratamentos criado.
- [ ] Registro de fornecedores criado.
- [ ] Matriz de retenção criada.
- [ ] Testes de legítimo interesse registrados.
- [ ] Formulário e aviso sincronizados.
- [ ] Retenção e infraestrutura sincronizadas.
- [ ] Mobile validado.
- [ ] Zoom 200% validado.
- [ ] Teclado validado.
- [ ] Leitor de tela validado.
- [ ] Impressão validada.
- [ ] Sem placeholders.
- [ ] Sem texto absoluto.
- [ ] Lint concluído.
- [ ] Testes concluídos.
- [ ] Build concluído.
- [ ] Revisão jurídica adequada registrada.

---

# 52. Resultado esperado

Ao final, o visitante deverá compreender:

> quais dados podem ser tratados, por que são necessários, quais bases sustentam cada finalidade, quais fornecedores podem participar, por quanto tempo os dados podem ser mantidos e como exercer direitos.

O aviso deverá ser:

- transparente;
- específico;
- coerente com o sistema;
- compreensível;
- acessível;
- tecnicamente verificável;
- atualizável;
- conservador nas afirmações.

Ele não deverá ser:

- uma autorização genérica;
- um texto copiado;
- uma promessa de segurança absoluta;
- uma lista de serviços;
- uma justificativa para coleta excessiva;
- um documento desconectado da implementação.
