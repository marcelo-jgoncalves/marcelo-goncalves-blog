# Especificação definitiva — Página de Contato e estratégia de conversão

## 0. Finalidade e precedência

Este documento define, de forma exaustiva e diretamente executável, todas as alterações necessárias na página de contato e no fluxo de conversão da plataforma.

A implementação deverá ser realizada exatamente conforme esta especificação.

A IA engenheira não deverá:

- escolher textos alternativos;
- resumir os textos definidos;
- inventar campos;
- criar novas promessas comerciais;
- exigir que o visitante escolha uma tecnologia;
- prometer diagnóstico gratuito;
- prometer proposta na primeira conversa;
- prometer resposta em duas horas;
- criar formulário excessivamente longo;
- adicionar upload de arquivos;
- incluir newsletter ou marketing;
- utilizar dados enviados para analytics;
- expor credenciais AWS;
- enviar e-mail diretamente pelo navegador;
- criar novos canais de contato sem configuração real;
- alterar a identidade visual;
- instalar bibliotecas sem necessidade;
- consultar especificações anteriores para escolher entre versões conflitantes.

Em caso de divergência:

- este documento prevalece sobre textos, campos, CTAs, processo comercial, prazo de retorno e comportamento da página `/contato`;
- as regras globais de identidade, cabeçalho e rodapé definidas no Ajuste 7 continuam válidas;
- as regras de privacidade e páginas legais deverão ser mantidas coerentes com este documento.

---

# 1. Escopo

## 1.1. Rota

```text
/contato
```

Preservar a rota.

Não criar rota adicional para:

- diagnóstico;
- orçamento;
- agendamento;
- briefing;
- proposta;
- mensagem enviada.

O estado de sucesso deverá ocorrer dentro da própria página.

## 1.2. Página analisada

```text
https://dsns2wusdrj9z.cloudfront.net/contato
```

Data de referência:

```text
27 de julho de 2026
```

## 1.3. Incluído

Esta tarefa inclui:

- hero;
- formulário;
- seleção da área;
- próximos passos;
- canais alternativos;
- WhatsApp;
- e-mail;
- LinkedIn;
- FAQ;
- estados de carregamento, sucesso e erro;
- contrato da API;
- validação no cliente e no servidor;
- envio por Amazon SES;
- proteção contra spam e abuso;
- privacidade;
- retenção;
- logs e monitoramento;
- analytics sem dados pessoais;
- metadados;
- acessibilidade;
- responsividade;
- testes;
- critérios de aceite;
- atualização dos destinos dos CTAs das páginas de serviço.

## 1.4. Não incluído

Não realizar:

- redesign completo do cabeçalho;
- redesign completo do rodapé;
- criação de CRM;
- criação de área administrativa;
- criação de agenda integrada;
- integração com Google Calendar;
- integração com Calendly;
- integração com HubSpot;
- integração com Salesforce;
- integração com Slack;
- newsletter;
- automação de marketing;
- lead scoring;
- orçamento automático;
- chatbot;
- upload de documentos;
- anexos;
- chamada por vídeo dentro da página;
- telefonia;
- criação de novo número de WhatsApp;
- criação de e-mail;
- alteração dos textos completos do Aviso de Privacidade;
- instalação de CAPTCHA de terceiros;
- criação de nova paleta;
- troca de fontes.

---

# 2. Diagnóstico da página atual

## 2.1. Estrutura identificada

A página atual possui:

1. Hero;
2. Bloco “Solicitação”;
3. Bloco “Como funciona” com cinco etapas;
4. Grade de quatro áreas de atuação;
5. Outras formas de contato;
6. FAQ;
7. Segundo CTA completo;
8. Rodapé.

## 2.2. Elementos válidos

Preservar conceitualmente:

- retorno em até um dia útil;
- primeira conversa sem compromisso;
- explicação do que acontece depois;
- e-mail;
- atendimento remoto;
- foco principal em pequenas e médias empresas;
- possibilidade de projetos específicos para empresas maiores;
- FAQ;
- formulário;
- disponibilidade controlável para novos projetos.

## 2.3. Problemas a corrigir

A página atual apresenta:

1. Hero genérico sobre “tecnologia que impulsiona”.
2. CTA “Solicitar diagnóstico”, embora a primeira etapa seja apenas uma conversa.
3. Afirmação “Seus dados ficam apenas conosco”, incompatível com o uso de infraestrutura e operadores externos.
4. Processo com cinco etapas que mistura triagem, conversa, análise e proposta como se fossem automáticas.
5. Promessa implícita de que toda solicitação gera proposta.
6. Grade de serviços após o formulário, criando nova decisão.
7. Nomes antigos dos serviços.
8. Afirmações absolutas como alta disponibilidade e eliminação de retrabalho.
9. Instagram apresentado como canal de contato profissional.
10. Ausência visível do WhatsApp, embora exista integração configurável por `wa.me`.
11. FAQ incompleta.
12. Pergunta sobre diagnóstico sem resposta.
13. Segundo CTA completo na própria página de contato.
14. Repetição de “Vamos conversar”.
15. Ausência de especificação clara dos campos.
16. Ausência de mensagens de erro e sucesso definidas.
17. Ausência de regras antispam.
18. Ausência de regras para SES.
19. Ausência de confirmação automática ao remetente.
20. Ausência de orientação para não enviar credenciais ou dados sensíveis.
21. Ausência de preseleção da área a partir das páginas de serviço.
22. Ausência de contrato claro para API e analytics.
23. Ausência de definição de retenção e minimização de dados.

---

# 3. Objetivo da página

A página deverá realizar uma única função principal:

> Permitir que uma empresa apresente um problema ou oportunidade e receba uma resposta sobre aderência e próximos passos.

O visitante não deverá precisar:

- saber qual tecnologia utilizar;
- entender todos os serviços;
- solicitar um diagnóstico;
- preparar um briefing completo;
- informar orçamento;
- criar conta;
- agendar uma reunião antes da triagem;
- enviar documentos;
- compartilhar credenciais;
- escolher um pacote.

A página deverá:

1. reduzir a insegurança sobre o primeiro contato;
2. coletar contexto suficiente para uma triagem inicial;
3. explicar o que acontecerá;
4. oferecer canais alternativos;
5. proteger os dados e a infraestrutura;
6. confirmar o recebimento;
7. evitar promessas comerciais prematuras.

---

# 4. Decisão estrutural definitiva

## 4.1. Ordem final

A página deverá seguir exatamente:

1. Cabeçalho global;
2. Hero compacto;
3. Bloco principal de contato:
   - formulário;
   - próximos passos;
4. Canais alternativos;
5. Perguntas frequentes;
6. Rodapé global.

## 4.2. Mudanças estruturais obrigatórias

Realizar:

1. Tornar o hero mais curto.
2. Fundir “Solicitação” e “Como funciona” em um único macrobloco.
3. Exibir formulário e próximos passos lado a lado em desktop.
4. Remover a grade “Áreas de atuação”.
5. Substituir a grade por um campo de área no formulário.
6. Preservar os canais alternativos, atualizando-os.
7. Remover Instagram da área principal de contato.
8. Adicionar WhatsApp somente quando houver URL válida configurada.
9. Substituir integralmente a FAQ.
10. Remover o segundo CTA completo.
11. Encerrar a página com a FAQ e o rodapé.
12. Adicionar, ao final da FAQ, apenas um link discreto para retornar ao formulário.

## 4.3. Seções proibidas

Não criar:

- grade de serviços;
- cards de resultados;
- depoimentos;
- logos;
- preços;
- calendário;
- formulário de orçamento;
- formulário em várias etapas;
- wizard;
- chatbot;
- CTA final de grande porte;
- banner flutuante;
- popup;
- modal automático;
- newsletter;
- mapa;
- endereço completo;
- número de telefone público, exceto WhatsApp configurado;
- seção de equipe.

---

# 5. Regras gerais de linguagem

## 5.1. Ação principal

Usar:

```text
Apresentar um desafio
```

ou, no botão do formulário:

```text
Enviar mensagem
```

Não utilizar:

- Solicitar diagnóstico;
- Solicitar orçamento;
- Agendar diagnóstico;
- Agendar consultoria;
- Contratar;
- Receber proposta;
- Falar com especialista;
- Chamada gratuita;
- Auditoria gratuita.

## 5.2. Processo comercial

A primeira conversa deverá ser descrita como:

```text
conversa inicial sem compromisso
```

Ela serve para:

- compreender o contexto;
- avaliar aderência;
- esclarecer dúvidas;
- indicar o próximo passo.

Ela não inclui automaticamente:

- diagnóstico detalhado;
- acesso ao ambiente;
- análise documental;
- arquitetura;
- plano de ação;
- estimativa definitiva;
- proposta;
- orçamento;
- auditoria.

## 5.3. Diagnóstico

Usar:

```text
Quando o desafio exige levantamento, análise ou recomendações detalhadas, o diagnóstico pode ser estruturado como uma etapa comercial própria.
```

Não utilizar:

```text
diagnóstico gratuito
```

## 5.4. Prazo de retorno

Usar exatamente:

```text
Retorno em até um dia útil
```

Interpretação:

- envios em dia útil: retorno até o final do dia útil seguinte;
- envios em fins de semana ou feriados: contagem iniciada no próximo dia útil.

Não prometer:

- duas horas;
- resposta imediata;
- contato no mesmo dia;
- atendimento 24 horas.

## 5.5. Uso de primeira pessoa

É permitido usar:

- “vamos avaliar”;
- “recebemos”;
- “entramos em contato”.

Não utilizar “nossa equipe comercial”.

Quando necessário, usar:

```text
Marcelo Gonçalves ou uma pessoa responsável pela entrega
```

Não criar um departamento comercial fictício.

---

# 6. Hero

## 6.1. Estrutura

Manter composição visual atual, reduzindo sua altura quando necessário.

Ordem:

1. eyebrow;
2. H1;
3. subtítulo;
4. CTA de âncora;
5. microcopy.

## 6.2. Eyebrow

```text
Contato
```

## 6.3. H1

Substituir o título atual por:

```text
Conte o que está limitando sua operação.
```

## 6.4. Subtítulo

```text
Você não precisa saber qual serviço contratar. Descreva o processo, sistema ou desafio que precisa evoluir e vamos avaliar a aderência e o próximo passo.
```

## 6.5. CTA

```text
Ir para o formulário
```

Destino:

```text
#formulario-contato
```

## 6.6. Microcopy

```text
Retorno em até um dia útil · Primeira conversa sem compromisso
```

## 6.7. Semântica

- eyebrow: texto não heading;
- H1: único `<h1>`;
- subtítulo: `<p>`;
- CTA: `<a>`;
- microcopy: `<p>` ou `<small>`.

## 6.8. Regras visuais

- preservar paleta;
- preservar alinhamento;
- não adicionar imagem;
- não adicionar ícones de telefone;
- não adicionar ilustração de conversa;
- não adicionar formulário dentro do hero;
- não adicionar segundo CTA;
- limitar largura do texto;
- aplicar `scroll-margin-top` no destino;
- mobile sem corte;
- CTA com estilo primário;
- microcopy com menor destaque.

## 6.9. Remover

Remover:

```text
Vamos conversar sobre a tecnologia que vai impulsionar sua empresa.
```

Remover:

```text
Conte-nos seus desafios. Desenvolvemos soluções em software, cloud, integração e inteligência artificial para ajudar sua empresa a crescer com mais eficiência, segurança e inovação.
```

Remover:

```text
Solicitar diagnóstico
```

---

# 7. Bloco principal de contato

## 7.1. Identificação

Adicionar:

```html
id="formulario-contato"
```

Aplicar `scroll-margin-top`.

## 7.2. Layout

Desktop:

- grid de duas colunas;
- formulário ocupando aproximadamente 60% a 65%;
- painel de próximos passos ocupando aproximadamente 35% a 40%;
- alinhamento superior;
- ambos dentro do mesmo macrobloco.

Tablet:

- duas colunas apenas se o formulário mantiver largura confortável;
- caso contrário, empilhar.

Mobile:

1. título;
2. texto;
3. formulário;
4. painel de próximos passos.

## 7.3. Eyebrow

```text
Apresente o contexto
```

## 7.4. H2

Substituir:

```text
Conte um pouco sobre a sua empresa.
```

por:

```text
O que sua empresa precisa melhorar?
```

## 7.5. Parágrafo

```text
Informe apenas o necessário para entendermos a situação inicial. Não envie senhas, credenciais, documentos confidenciais ou dados pessoais sensíveis pelo formulário.
```

## 7.6. Reassurances

Exibir exatamente três itens:

```text
Retorno em até um dia útil
```

```text
Primeira conversa sem compromisso
```

```text
Seus dados serão usados apenas para responder à solicitação e conduzir os próximos passos
```

Remover:

```text
Seus dados ficam apenas conosco
```

## 7.7. Regras

- utilizar check visual somente se já existir;
- checks decorativos com `aria-hidden="true"`;
- não apresentar os itens como garantias legais;
- não utilizar selo de segurança;
- não mencionar LGPD como certificação.

---

# 8. Campos do formulário

O formulário deverá conter exatamente os campos visíveis abaixo, nesta ordem.

## 8.1. Campo 1 — Nome

### `name`

```text
name
```

### Label

```text
Seu nome
```

### Obrigatório

Sim.

### Tipo

```html
<input type="text">
```

### Autocomplete

```text
name
```

### Placeholder

```text
Como podemos chamar você?
```

### Regras

- mínimo: 2 caracteres;
- máximo: 100 caracteres;
- permitir acentos;
- permitir nomes compostos;
- não exigir sobrenome;
- remover espaços externos;
- não alterar capitalização automaticamente.

### Erro

```text
Informe seu nome.
```

---

# 9. Campo 2 — E-mail

## 9.1. `name`

```text
email
```

## 9.2. Label

```text
Seu e-mail
```

## 9.3. Obrigatório

Sim.

## 9.4. Tipo

```html
<input type="email">
```

## 9.5. Autocomplete

```text
email
```

## 9.6. Placeholder

```text
voce@empresa.com.br
```

## 9.7. Regras

- máximo: 254 caracteres;
- aceitar e-mails pessoais e corporativos;
- normalizar espaços externos;
- não alterar caracteres internos;
- validação sintática no cliente e no servidor;
- não verificar existência do domínio por requisição no navegador;
- não bloquear Gmail, Outlook ou outros provedores.

## 9.8. Erro vazio

```text
Informe seu e-mail.
```

## 9.9. Erro inválido

```text
Informe um e-mail válido.
```

---

# 10. Campo 3 — Empresa ou projeto

## 10.1. `name`

```text
company
```

## 10.2. Label

```text
Empresa ou projeto
```

## 10.3. Obrigatório

Sim.

## 10.4. Tipo

```html
<input type="text">
```

## 10.5. Autocomplete

```text
organization
```

## 10.6. Placeholder

```text
Nome da empresa ou iniciativa
```

## 10.7. Regras

- mínimo: 2 caracteres;
- máximo: 120 caracteres;
- aceitar profissionais autônomos e projetos em formação;
- não exigir CNPJ;
- não consultar bases externas.

## 10.8. Erro

```text
Informe a empresa ou o projeto.
```

---

# 11. Campo 4 — Função

## 11.1. `name`

```text
role
```

## 11.2. Label

```text
Sua função
```

## 11.3. Obrigatório

Não.

## 11.4. Tipo

```html
<input type="text">
```

## 11.5. Autocomplete

```text
organization-title
```

## 11.6. Placeholder

```text
Ex.: Sócio, Operações, Tecnologia
```

## 11.7. Regras

- máximo: 120 caracteres;
- não exibir erro quando vazio.

---

# 12. Campo 5 — Telefone ou WhatsApp

## 12.1. `name`

```text
phone
```

## 12.2. Label

```text
Telefone ou WhatsApp
```

## 12.3. Indicador

```text
Opcional
```

## 12.4. Obrigatório

Não.

## 12.5. Tipo

```html
<input type="tel">
```

## 12.6. Autocomplete

```text
tel
```

## 12.7. Placeholder

```text
(31) 99999-9999
```

## 12.8. Regras

- máximo: 30 caracteres;
- permitir código de país;
- não exigir máscara rígida;
- é permitido aplicar máscara apenas como auxílio visual;
- o valor armazenado deverá ser normalizado no servidor;
- não enviar mensagem automática para o número;
- não adicionar à lista de contatos;
- não exigir WhatsApp.

## 12.9. Erro

Exibir somente quando houver conteúdo claramente inválido:

```text
Revise o telefone informado.
```

---

# 13. Campo 6 — Tamanho da empresa

## 13.1. `name`

```text
companySize
```

## 13.2. Label

```text
Tamanho da empresa
```

## 13.3. Indicador

```text
Opcional
```

## 13.4. Obrigatório

Não.

## 13.5. Tipo

```html
<select>
```

## 13.6. Opção inicial

```text
Selecione, se quiser
```

Valor:

```text
""
```

## 13.7. Opções

```text
1 a 10 pessoas
```

Valor:

```text
1-10
```

```text
11 a 50 pessoas
```

Valor:

```text
11-50
```

```text
51 a 200 pessoas
```

Valor:

```text
51-200
```

```text
201 a 500 pessoas
```

Valor:

```text
201-500
```

```text
Mais de 500 pessoas
```

Valor:

```text
501-plus
```

## 13.8. Regras

- não inferir faturamento;
- não bloquear envio;
- não usar para discriminação automática;
- usar apenas para contextualização e análise agregada.

---

# 14. Campo 7 — Área relacionada

## 14.1. `name`

```text
area
```

## 14.2. Label

```text
Qual área está mais relacionada ao desafio?
```

## 14.3. Obrigatório

Sim.

## 14.4. Tipo

```html
<select>
```

## 14.5. Opção inicial

```text
Selecione uma opção
```

Valor:

```text
""
```

## 14.6. Opções e valores

```text
Automação e Integração de Processos
```

```text
automacao-integracao
```

```text
Inteligência Artificial Aplicada
```

```text
inteligencia-artificial
```

```text
Sistemas e Plataformas Digitais
```

```text
sistemas-plataformas
```

```text
Cloud, DevOps e Confiabilidade
```

```text
cloud-devops-confiabilidade
```

```text
Mais de uma área
```

```text
multiplas-areas
```

```text
Ainda não sei
```

```text
nao-sei
```

```text
Outro assunto
```

```text
outro
```

## 14.7. Erro

```text
Selecione a área mais próxima do desafio.
```

## 14.8. Preseleção por URL

Aceitar:

```text
/contato?area=automacao-integracao
```

```text
/contato?area=inteligencia-artificial
```

```text
/contato?area=sistemas-plataformas
```

```text
/contato?area=cloud-devops-confiabilidade
```

Se o valor não estiver na enumeração:

- ignorar;
- manter opção inicial;
- não refletir conteúdo arbitrário no HTML;
- não gerar erro.

A preseleção deve ser anunciada corretamente por leitores de tela.

---

# 15. Campo 8 — Descrição do desafio

## 15.1. `name`

```text
message
```

## 15.2. Label

```text
Conte o que está acontecendo hoje
```

## 15.3. Obrigatório

Sim.

## 15.4. Tipo

```html
<textarea>
```

## 15.5. Placeholder

```text
Descreva o processo, sistema ou dificuldade, quem é afetado e o resultado que você gostaria de alcançar.
```

## 15.6. Helper

```text
Não inclua senhas, chaves de acesso, dados bancários, informações médicas ou documentos confidenciais.
```

## 15.7. Regras

- mínimo: 50 caracteres;
- máximo: 3000 caracteres;
- permitir múltiplas linhas;
- preservar quebras de linha no e-mail;
- escapar HTML;
- não renderizar o conteúdo como HTML;
- não bloquear URLs;
- não executar Markdown;
- não enviar o conteúdo para analytics;
- exibir contador a partir de 2500 caracteres;
- contador acessível.

## 15.8. Erro vazio ou curto

```text
Descreva o desafio com pelo menos 50 caracteres.
```

## 15.9. Erro longo

```text
A mensagem deve ter no máximo 3000 caracteres.
```

---

# 16. Campos invisíveis e contexto

## 16.1. Honeypot

Criar campo:

```text
website
```

Características:

- invisível visualmente;
- fora da ordem de tabulação;
- `autocomplete="off"`;
- não usar `display: none` se isso comprometer detecção simples;
- label inacessível ou instrução para não preencher;
- nunca incluir o valor em e-mail.

Se preenchido:

- retornar resposta genérica de sucesso;
- não enviar e-mail;
- incrementar métrica de spam;
- não informar ao remetente que foi bloqueado.

## 16.2. Contexto técnico

Coletar internamente:

```text
sourcePath
```

```text
referrerPath
```

```text
utmSource
```

```text
utmMedium
```

```text
utmCampaign
```

```text
submissionStartedAt
```

```text
formVersion
```

## 16.3. Regras

- aceitar apenas strings com limites definidos;
- não aceitar URL arbitrária sem sanitização;
- não armazenar query completa;
- remover parâmetros sensíveis;
- não enviar IP no e-mail;
- não enviar user-agent completo no e-mail;
- não coletar fingerprint;
- não coletar geolocalização;
- não coletar dados de dispositivo além do necessário para logs operacionais.

## 16.4. Versão

Usar:

```text
contact-form-v1
```

Atualizar somente quando o contrato do formulário mudar.

---

# 17. Texto de privacidade abaixo do formulário

Exibir antes do botão ou imediatamente abaixo dele:

```text
Ao enviar, você declara ciência de que os dados informados serão usados para responder à solicitação e conduzir os próximos passos, conforme o Aviso de Privacidade.
```

Transformar:

```text
Aviso de Privacidade
```

em link para:

```text
/privacidade
```

Se a rota legal atual for diferente:

- utilizar a rota já existente;
- não criar uma duplicata;
- validar o destino.

## 17.1. Consentimento

Não adicionar checkbox obrigatório:

```text
Aceito a Política de Privacidade
```

O formulário não deverá usar um consentimento genérico como condição visual para responder à solicitação.

Não adicionar consentimento de marketing.

Caso newsletter ou comunicação promocional sejam criadas futuramente:

- utilizar opção separada;
- opcional;
- desmarcada por padrão;
- com finalidade específica;
- não implementar nesta tarefa.

---

# 18. Botão de envio

## 18.1. Texto padrão

```text
Enviar mensagem
```

## 18.2. Estado de carregamento

```text
Enviando...
```

## 18.3. Regras

- `type="submit"`;
- desabilitar durante a requisição;
- manter largura suficiente para evitar salto;
- exibir indicador visual de carregamento;
- indicador com texto acessível;
- não desabilitar antes da validação;
- evitar envio duplo;
- permitir nova tentativa após erro;
- não limpar os campos após erro;
- não enviar pelo método GET.

---

# 19. Validação no cliente

## 19.1. Princípio

A validação no cliente melhora a experiência, mas não substitui a validação no servidor.

## 19.2. Comportamento

Ao submeter com erro:

1. impedir envio;
2. exibir resumo de erros no início do formulário;
3. mover foco para o resumo;
4. vincular cada item ao campo;
5. marcar campos com `aria-invalid="true"`;
6. usar `aria-describedby`;
7. manter os valores preenchidos;
8. não limpar o formulário.

## 19.3. Resumo

Título:

```text
Revise os campos indicados.
```

O resumo deve listar somente campos com erro.

## 19.4. Validação progressiva

- não exibir erros antes de interação;
- após a primeira tentativa de envio, atualizar erros conforme correção;
- não validar a cada tecla de forma agressiva;
- não depender apenas de cor.

---

# 20. Contrato da API

## 20.1. Endpoint

Usar o endpoint de contato existente.

Se o projeto ainda não possuir uma rota padronizada, utilizar:

```text
POST /api/contact
```

## 20.2. Content-Type

```text
application/json
```

## 20.3. Payload

```ts
interface ContactRequest {
  name: string;
  email: string;
  company: string;
  role?: string;
  phone?: string;
  companySize?: "" | "1-10" | "11-50" | "51-200" | "201-500" | "501-plus";
  area:
    | "automacao-integracao"
    | "inteligencia-artificial"
    | "sistemas-plataformas"
    | "cloud-devops-confiabilidade"
    | "multiplas-areas"
    | "nao-sei"
    | "outro";
  message: string;

  website?: string;

  context: {
    sourcePath: string;
    referrerPath?: string;
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
    submissionStartedAt?: string;
    formVersion: "contact-form-v1";
  };
}
```

## 20.4. Resposta de sucesso

Status:

```text
200
```

Payload:

```json
{
  "success": true,
  "referenceId": "string"
}
```

`referenceId`:

- gerar no servidor;
- não usar e-mail ou nome;
- não expor ID interno sensível;
- pode ser UUID ou identificador curto seguro;
- registrar nos logs e no e-mail interno.

## 20.5. Erro de validação

Status:

```text
400
```

Payload:

```json
{
  "success": false,
  "code": "VALIDATION_ERROR",
  "fieldErrors": {
    "fieldName": "Mensagem de erro"
  }
}
```

## 20.6. Limite excedido

Status:

```text
429
```

Payload:

```json
{
  "success": false,
  "code": "RATE_LIMITED",
  "message": "Muitas tentativas foram realizadas. Aguarde alguns minutos e tente novamente."
}
```

## 20.7. Erro interno

Status:

```text
500
```

Payload:

```json
{
  "success": false,
  "code": "DELIVERY_FAILED",
  "message": "Não foi possível enviar a mensagem agora."
}
```

## 20.8. Regras

- não retornar stack trace;
- não retornar erro AWS;
- não retornar ARN;
- não retornar nome de função;
- não retornar endereço interno;
- não retornar detalhes do SES;
- não aceitar destinatário no payload;
- não aceitar assunto livre;
- não aceitar HTML;
- não aceitar campos desconhecidos;
- limitar corpo da requisição a 16 KB;
- validar `Origin` e `Host`;
- CORS restrito aos domínios oficiais e ambientes de desenvolvimento autorizados.

---

# 21. Validação no servidor

## 21.1. Obrigatoriedade

Validar todos os campos novamente no servidor.

## 21.2. Regras

- esquema estrito;
- rejeitar chaves desconhecidas;
- remover espaços externos;
- normalizar Unicode quando seguro;
- preservar acentos;
- bloquear caracteres CR e LF em campos usados em cabeçalhos;
- permitir quebras apenas na mensagem;
- validar enumerações;
- limitar tamanho;
- escapar HTML;
- não usar conteúdo do usuário em comandos;
- não registrar corpo completo em logs;
- não interpolar o conteúdo em templates sem escape.

## 21.3. Cabeçalhos

Nunca usar o e-mail do visitante como `From`.

Usar o endereço verificado da consultoria como `From`.

Usar o e-mail do visitante apenas em:

```text
Reply-To
```

Isso evita tentativa de falsificação do remetente e problemas de autenticação.

---

# 22. Envio por Amazon SES

## 22.1. Serviço

Preservar Amazon SES como serviço de envio.

Não enviar e-mail diretamente do navegador.

## 22.2. Identidade

Usar domínio ou endereço verificado.

Remetente padrão:

```text
contato@marcelogoncalves.com
```

Caso o projeto já utilize outro endereço técnico verificado:

- preservar apenas se estiver documentado;
- manter o endereço público como `Reply-To` das confirmações, quando adequado.

## 22.3. Autenticação

Configurar e validar:

- DKIM;
- SPF por meio do MAIL FROM apropriado, quando configurado;
- DMARC no domínio;
- domínio verificado no SES;
- conta fora do sandbox para destinatários não verificados;
- região configurada corretamente.

Não recriar registros DNS se já estiverem corretos.

## 22.4. Configuration set

Criar ou reutilizar um configuration set específico para mensagens transacionais do site.

Nome recomendado:

```text
website-contact
```

Utilizar para:

- envio;
- entrega;
- bounce;
- complaint;
- reject.

Não habilitar tracking de abertura ou clique para a confirmação de contato, salvo decisão explícita posterior.

## 22.5. Bounce e complaint

Configurar destino de eventos existente ou:

- Amazon SNS;
- CloudWatch;
- mecanismo já adotado.

Monitorar:

- bounce;
- complaint;
- reject;
- delivery failure.

Não criar lista de marketing.

## 22.6. Permissões IAM

A função do backend deverá possuir somente o necessário para:

- enviar pelos remetentes autorizados;
- usar o configuration set definido;
- escrever logs e métricas necessários.

Não utilizar:

```text
ses:*
```

Não armazenar access key no frontend.

Usar role da execução.

---

# 23. E-mail interno

## 23.1. Destinatário

```text
contato@marcelogoncalves.com
```

Não aceitar destinatário enviado pelo navegador.

## 23.2. From

```text
contato@marcelogoncalves.com
```

## 23.3. Reply-To

Usar o e-mail informado pelo visitante.

## 23.4. Assunto

Formato:

```text
[Novo contato] {área legível} — {empresa ou projeto}
```

Limites:

- máximo de 180 caracteres;
- remover quebras de linha;
- remover caracteres de controle;
- não incluir mensagem;
- não incluir telefone.

## 23.5. Corpo em texto puro

Usar exatamente esta ordem:

```text
Novo contato pelo site

Referência: {referenceId}
Data e hora: {timestamp em America/Sao_Paulo}

Nome: {name}
E-mail: {email}
Empresa ou projeto: {company}
Função: {role ou "Não informado"}
Telefone ou WhatsApp: {phone ou "Não informado"}
Tamanho da empresa: {companySize legível ou "Não informado"}
Área: {area legível}

Mensagem:
{message}

Origem:
Página: {sourcePath}
Referência interna: {referrerPath ou "Não informada"}
UTM source: {utmSource ou "Não informada"}
UTM medium: {utmMedium ou "Não informada"}
UTM campaign: {utmCampaign ou "Não informada"}
Versão do formulário: {formVersion}
```

## 23.6. Corpo HTML

É permitido enviar versão HTML, desde que:

- contenha a mesma informação;
- todos os valores sejam escapados;
- não renderize HTML do usuário;
- não carregue imagens externas;
- não inclua scripts;
- não use CSS remoto;
- possua alternativa em texto puro.

---

# 24. Confirmação automática para o visitante

## 24.1. Regra

Após o SES aceitar o e-mail interno, enviar uma confirmação ao endereço informado.

A falha da confirmação não deve transformar em erro uma solicitação cujo e-mail interno foi enviado com sucesso.

Registrar métrica da falha.

## 24.2. Assunto

```text
Recebemos sua mensagem
```

## 24.3. From

```text
Marcelo Gonçalves <contato@marcelogoncalves.com>
```

## 24.4. Reply-To

```text
contato@marcelogoncalves.com
```

## 24.5. Texto

```text
Olá, {primeiro nome}.

Recebemos sua mensagem sobre {área legível}.

Vamos analisar o contexto informado e retornar em até um dia útil. A primeira conversa serve para avaliar a aderência, esclarecer dúvidas e definir o próximo passo.

Por segurança, não responda enviando senhas, chaves de acesso ou outros dados sensíveis.

Referência da solicitação: {referenceId}

Atenciosamente,

Marcelo Gonçalves
Consultoria em Tecnologia
```

## 24.6. Regras

- extrair primeiro nome de forma simples;
- se a extração for incerta, utilizar `Olá.`;
- não inserir link de marketing;
- não inserir pixel;
- não inserir promoção;
- não adicionar usuário a newsletter;
- não prometer reunião;
- não prometer proposta;
- não prometer diagnóstico.

---

# 25. Estado de sucesso no formulário

## 25.1. Comportamento

Após sucesso:

- substituir o formulário pelo estado de sucesso;
- preservar o painel de próximos passos;
- manter a página na mesma URL;
- mover foco para o título do sucesso;
- anunciar com `role="status"` ou região adequada;
- não redirecionar;
- limpar valores sensíveis da memória do componente quando possível.

## 25.2. H2

```text
Mensagem recebida.
```

## 25.3. Texto

```text
Obrigado pelo contato. Vamos analisar as informações e retornar em até um dia útil.
```

## 25.4. Referência

```text
Referência: {referenceId}
```

## 25.5. Confirmação

```text
Também enviamos uma confirmação para o e-mail informado.
```

Exibir somente se a confirmação tiver sido aceita pelo SES.

Caso o e-mail interno tenha sido enviado, mas a confirmação falhe:

```text
Sua mensagem foi recebida. Não foi possível enviar a confirmação por e-mail, mas o retorno seguirá normalmente.
```

## 25.6. Ações

Exibir:

```text
Voltar à página inicial
```

Destino:

```text
/
```

E link discreto:

```text
Enviar outra mensagem
```

Ao clicar:

- restaurar formulário vazio;
- não reenviar dados;
- manter área preselecionada somente se veio por query string;
- mover foco para o primeiro campo.

---

# 26. Estado de erro

## 26.1. Mensagem principal

```text
Não foi possível enviar sua mensagem agora.
```

## 26.2. Texto

```text
Tente novamente em alguns minutos ou envie um e-mail para contato@marcelogoncalves.com.
```

Transformar o e-mail em:

```text
mailto:contato@marcelogoncalves.com
```

## 26.3. Regras

- não apagar campos;
- permitir nova tentativa;
- mover foco para a mensagem;
- usar `role="alert"`;
- não expor erro técnico;
- não mostrar “erro desconhecido”;
- não prometer que a mensagem foi recebida;
- não disparar confirmação.

## 26.4. Rate limit

Mensagem:

```text
Muitas tentativas foram realizadas. Aguarde alguns minutos e tente novamente ou use o e-mail de contato.
```

---

# 27. Proteção contra spam e abuso

## 27.1. Camadas obrigatórias

Implementar:

1. honeypot;
2. validação estrita;
3. limite de tamanho;
4. validação de origem;
5. rate limiting;
6. logs e métricas;
7. bloqueio de padrões de abuso;
8. Challenge ou CAPTCHA somente quando necessário.

## 27.2. AWS WAF

Se a distribuição já utiliza AWS WAF, criar regra baseada em taxa para:

- método `POST`;
- caminho exato do endpoint de contato;
- agregação por IP;
- janela de avaliação de cinco minutos;
- limite inicial de 20 requisições.

A ação inicial deverá ser:

```text
Block
```

Monitorar falsos positivos.

É permitido adicionar `Challenge` em comportamento suspeito antes do bloqueio, se o projeto já utilizar integração de tokens do WAF.

## 27.3. CAPTCHA

Não exibir CAPTCHA visível por padrão.

Adicionar CAPTCHA somente quando:

- houver abuso comprovado;
- honeypot e rate limit forem insuficientes;
- a experiência acessível tiver sido validada;
- custos tiverem sido avaliados.

Não utilizar CAPTCHA de terceiro nesta tarefa.

## 27.4. Tempo de preenchimento

É permitido utilizar o tempo como sinal adicional.

Não bloquear apenas por tempo.

## 27.5. Conteúdo

Não bloquear mensagens apenas por conter:

- URL;
- termos técnicos;
- código;
- nomes de serviços.

Aplicar limite e sanitização.

---

# 28. Logs, métricas e alertas

## 28.1. Logs

Registrar:

- `referenceId`;
- timestamp;
- resultado;
- código da área;
- versão do formulário;
- código de erro;
- message ID do SES;
- origem resumida;
- status da confirmação.

Não registrar:

- mensagem completa;
- e-mail completo;
- telefone;
- nome completo;
- credenciais;
- corpo do e-mail.

## 28.2. Mascaramento

Se o e-mail for necessário para correlação temporária:

```text
m***@dominio.com
```

Preferência: não registrar.

## 28.3. Métricas

Criar ou reutilizar:

```text
ContactSubmissionAttempt
```

```text
ContactSubmissionSuccess
```

```text
ContactSubmissionValidationError
```

```text
ContactSubmissionRateLimited
```

```text
ContactSubmissionSpamDiscarded
```

```text
ContactInternalEmailFailure
```

```text
ContactConfirmationEmailFailure
```

## 28.4. Alertas

Criar alerta quando:

- envio interno falhar repetidamente;
- taxa de erro exceder o padrão;
- SES rejeitar mensagens;
- houver aumento anormal de spam;
- endpoint apresentar erros 5xx.

Não alertar por uma única validação de usuário.

---

# 29. Retenção e minimização

## 29.1. Formulário

Não persistir os dados em banco nesta tarefa.

Os dados serão enviados por e-mail e mantidos conforme o processo definido no Aviso de Privacidade.

## 29.2. Período operacional

Manter as mensagens de contatos sem relação comercial ativa por:

```text
6 meses
```

Após esse período:

- excluir, salvo necessidade legítima documentada;
- ou manter somente informações não pessoais e agregadas.

Quando houver:

- proposta;
- contrato;
- obrigação legal;
- disputa;
- relação comercial;

aplicar o período correspondente documentado nas políticas internas.

## 29.3. Logs

Logs operacionais sem corpo da mensagem:

```text
30 dias
```

Caso a infraestrutura atual utilize período diferente:

- alinhar com o Aviso de Privacidade;
- manter o menor período compatível com segurança e diagnóstico;
- registrar a decisão.

## 29.4. Coerência legal

Atualizar o Aviso de Privacidade se ele divergir em:

- campos coletados;
- finalidade;
- operadores;
- Amazon SES;
- retenção;
- canais para direitos;
- uso de analytics;
- WhatsApp;
- LinkedIn.

Não publicar a página com contradições conhecidas entre formulário e aviso.

---

# 30. Painel — O que acontece depois

## 30.1. Eyebrow

```text
Próximos passos
```

## 30.2. H2 ou H3 conforme hierarquia

```text
O que acontece depois do envio
```

## 30.3. Quantidade

Usar exatamente quatro etapas.

## 30.4. Etapa 1

### Número

```text
1
```

### Título

```text
Você apresenta o contexto
```

### Texto

```text
O formulário reúne as informações necessárias para uma primeira compreensão do desafio.
```

## 30.5. Etapa 2

### Número

```text
2
```

### Título

```text
Avaliamos a aderência
```

### Texto

```text
Analisamos se a necessidade está relacionada às competências da consultoria e se precisamos esclarecer algum ponto.
```

## 30.6. Etapa 3

### Número

```text
3
```

### Título

```text
Realizamos uma conversa inicial
```

### Texto

```text
Quando houver aderência, combinamos uma conversa para entender melhor o problema, as restrições e os resultados esperados.
```

## 30.7. Etapa 4

### Número

```text
4
```

### Título

```text
Definimos o próximo passo
```

### Texto

```text
O próximo passo pode ser uma proposta, um diagnóstico comercial, uma etapa de descoberta ou a indicação de que outro caminho é mais adequado.
```

## 30.8. Nota

```text
O envio do formulário não cria obrigação de contratação ou de apresentação de proposta.
```

## 30.9. Remover

Remover as cinco etapas antigas:

- Recebemos sua solicitação;
- Entramos em contato;
- Agendamos uma conversa;
- Avaliamos oportunidades;
- Elaboramos uma proposta.

## 30.10. Regras visuais

- preservar o estilo de etapas;
- não usar timeline complexa;
- não adicionar prazo a cada etapa;
- não adicionar ícones novos;
- mobile em uma coluna;
- manter numeração.

---

# 31. Canais alternativos

## 31.1. Estrutura

Criar ou atualizar um bloco após o contato principal.

## 31.2. Eyebrow

```text
Outros canais
```

## 31.3. H2

```text
Prefere entrar em contato de outra forma?
```

## 31.4. Introdução

```text
Use o canal mais conveniente. Para projetos, o formulário costuma ajudar a reunir o contexto inicial.
```

## 31.5. Quantidade

Exibir até três canais:

1. E-mail;
2. WhatsApp;
3. LinkedIn.

Não exibir Instagram como canal de contato principal.

---

# 32. Canal — E-mail

## 32.1. Título

```text
E-mail
```

## 32.2. Valor

```text
contato@marcelogoncalves.com
```

## 32.3. Link

```text
mailto:contato@marcelogoncalves.com
```

## 32.4. Texto auxiliar

```text
Para mensagens mais detalhadas ou quando preferir usar seu próprio cliente de e-mail.
```

## 32.5. Comportamento

- não abrir nova aba;
- endereço selecionável;
- não esconder o endereço apenas em ícone.

---

# 33. Canal — WhatsApp

## 33.1. Condição

Exibir somente quando existir uma URL válida em configuração:

```ts
contactChannels.whatsappUrl
```

Formato esperado:

```text
https://wa.me/{numero}
```

Não colocar número fictício.

Não inferir número.

Não incluir placeholder em produção.

## 33.2. Título

```text
WhatsApp
```

## 33.3. CTA

```text
Conversar pelo WhatsApp
```

## 33.4. Mensagem predefinida

```text
Olá, Marcelo. Vim pelo site e gostaria de conversar sobre um desafio da minha empresa.
```

Codificar corretamente na URL.

Se houver `area` selecionada na query string, é permitido adaptar:

```text
Olá, Marcelo. Vim pelo site e gostaria de conversar sobre {área legível}.
```

Não incluir dados do formulário na URL.

## 33.5. Texto auxiliar

```text
Para iniciar uma conversa breve. Informações detalhadas podem ser enviadas depois pelos canais adequados.
```

## 33.6. Comportamento

- abrir em nova aba;
- `rel="noopener noreferrer"`;
- indicar de forma acessível que é um serviço externo;
- não carregar widget do WhatsApp;
- não incorporar script da Meta;
- não enviar dados antes do clique.

---

# 34. Canal — LinkedIn

## 34.1. Título

```text
LinkedIn
```

## 34.2. Link

Utilizar a URL pública já configurada para Marcelo Gonçalves.

Não alterar username sem verificação.

## 34.3. CTA

```text
Acessar perfil no LinkedIn
```

## 34.4. Texto auxiliar

```text
Para conhecer a trajetória profissional e acompanhar publicações técnicas.
```

## 34.5. Comportamento

- abrir em nova aba;
- `rel="noopener noreferrer"`;
- indicar serviço externo;
- não incorporar feed;
- não carregar pixels por causa do link.

---

# 35. Localização

Exibir abaixo dos canais:

```text
Belo Horizonte, MG · Atendimento remoto
```

Não exibir endereço residencial.

Não adicionar mapa.

Não afirmar atendimento presencial como padrão.

Não afirmar atendimento em outros países.

---

# 36. Remoção da grade de serviços

Remover integralmente a seção:

```text
Áreas de atuação
```

Remover:

```text
Como podemos ajudar.
```

Remover os quatro cards:

- Engenharia de Software;
- Inteligência Artificial;
- Cloud & DevOps;
- Integração & Automação.

Motivo:

- a página já possui o campo de área;
- os cards desviam o visitante;
- os nomes estão desatualizados;
- a página de Serviços já cumpre a função de exploração.

Remover do DOM e da fonte local.

Não ocultar somente com CSS.

---

# 37. Perguntas frequentes

## 37.1. Estrutura

Preservar o accordion existente.

Substituir integralmente perguntas e respostas.

## 37.2. Eyebrow

```text
Perguntas frequentes
```

## 37.3. H2

```text
Dúvidas antes do primeiro contato
```

## 37.4. Quantidade

Usar exatamente oito perguntas.

---

# 38. Pergunta 1

## 38.1. Pergunta

```text
Preciso saber qual serviço contratar?
```

## 38.2. Resposta

```text
Não. Descreva o problema, o processo ou o sistema que precisa evoluir. A primeira análise serve justamente para identificar se existe aderência e qual competência pode participar da solução.
```

---

# 39. Pergunta 2

## 39.1. Pergunta

```text
A primeira conversa possui custo?
```

## 39.2. Resposta

```text
Não. A conversa inicial serve para conhecer o contexto, avaliar aderência e esclarecer os primeiros caminhos. Quando o desafio exige levantamento, acesso a ambientes ou recomendações detalhadas, o diagnóstico pode ser estruturado como uma etapa comercial própria.
```

---

# 40. Pergunta 3

## 40.1. Pergunta

```text
Atendem empresas de qualquer porte?
```

## 40.2. Resposta

```text
O foco principal são pequenas e médias empresas em crescimento. Também podem ser avaliados projetos específicos para organizações maiores, especialmente quando envolvem AWS, DevOps, automação, integração ou modernização.
```

---

# 41. Pergunta 4

## 41.1. Pergunta

```text
É necessário utilizar AWS?
```

## 41.2. Resposta

```text
Não. AWS é a principal especialização em nuvem da consultoria, mas o ponto de partida é o contexto da empresa. Projetos de automação, integração, software e inteligência artificial podem envolver sistemas e ambientes já existentes.
```

---

# 42. Pergunta 5

## 42.1. Pergunta

```text
O atendimento é remoto?
```

## 42.2. Resposta

```text
Sim. O atendimento e a maior parte das entregas são realizados remotamente. Eventuais necessidades presenciais devem ser avaliadas separadamente.
```

---

# 43. Pergunta 6

## 43.1. Pergunta

```text
Em quanto tempo receberei uma resposta?
```

## 43.2. Resposta

```text
O retorno ocorre em até um dia útil. Mensagens enviadas em fins de semana ou feriados começam a ser consideradas no próximo dia útil.
```

---

# 44. Pergunta 7

## 44.1. Pergunta

```text
Posso enviar documentos ou acessos pelo formulário?
```

## 44.2. Resposta

```text
Não. O formulário não aceita anexos e não deve ser usado para enviar senhas, chaves, dados sensíveis ou documentos confidenciais. Caso essas informações sejam necessárias, o canal e os controles adequados serão definidos depois.
```

---

# 45. Pergunta 8

## 45.1. Pergunta

```text
O envio do formulário garante uma proposta?
```

## 45.2. Resposta

```text
Não. Primeiro avaliamos a aderência e o nível de definição disponível. O próximo passo pode ser uma conversa, uma etapa de descoberta, um diagnóstico comercial, uma proposta ou a indicação de outro caminho.
```

## 45.3. Regras do accordion

- botão semântico;
- Tab;
- Enter;
- Espaço;
- `aria-expanded`;
- `aria-controls`;
- foco visível;
- respostas presentes no HTML;
- nenhuma resposta vazia;
- respeitar `prefers-reduced-motion`;
- manter comportamento atual;
- não carregar respostas sob demanda.

---

# 46. Link após a FAQ

Adicionar dentro do encerramento da própria seção, sem criar CTA de grande porte:

```text
Pronto para apresentar o contexto?
```

Link:

```text
Ir para o formulário
```

Destino:

```text
#formulario-contato
```

Estilo:

- link ou botão secundário discreto;
- não criar novo card;
- não repetir listas;
- não criar badge;
- não repetir prazo.

---

# 47. Remoção do CTA final antigo

Remover integralmente o bloco final iniciado por:

```text
Vamos conversar
```

Remover:

```text
Vamos construir o próximo passo da tecnologia que impulsiona a sua empresa.
```

Remover o parágrafo sobre vantagem competitiva.

Remover a lista:

- Sistemas desenvolvidos para a realidade da sua empresa;
- Processos integrados e automatizados;
- Plataformas escaláveis preparadas para crescer.

Remover os links dos quatro serviços.

Remover:

```text
Conte-nos seu desafio. Nós ajudamos a encontrar a melhor solução.
```

Remover:

```text
Solicitar diagnóstico
```

Remover:

```text
Projetos sob medida · Primeira conversa sem compromisso
```

Não substituir por outro CTA grande.

---

# 48. Atualização transversal dos CTAs

Atualizar os destinos dos CTAs específicos das páginas de serviço.

## 48.1. Automação

```text
/contato?area=automacao-integracao
```

## 48.2. Inteligência Artificial

```text
/contato?area=inteligencia-artificial
```

## 48.3. Sistemas

```text
/contato?area=sistemas-plataformas
```

## 48.4. Cloud

```text
/contato?area=cloud-devops-confiabilidade
```

## 48.5. CTAs genéricos

Manter:

```text
/contato
```

## 48.6. Precedência

Esta seção substitui os destinos `/contato` sem query definidos nos Ajustes 9, 10, 11 e 12 apenas para CTAs específicos de serviço.

Header, Home, Sobre e CTAs genéricos continuam apontando para:

```text
/contato
```

---

# 49. Analytics

Aplicar somente se já existir helper.

Não instalar provedor.

## 49.1. Eventos

```text
contact_form_view
```

```text
contact_form_start
```

```text
contact_form_validation_error
```

```text
contact_form_submit_attempt
```

```text
contact_form_submit_success
```

```text
contact_form_submit_error
```

```text
contact_alternative_channel_click
```

```text
contact_faq_toggle
```

## 49.2. Propriedades permitidas

- `area`;
- `companySize`;
- `sourcePath`;
- `formVersion`;
- `channel`;
- `errorCode`;
- `fieldName`, apenas identificador;
- `faqId`.

## 49.3. Dados proibidos

Não enviar:

- nome;
- e-mail;
- telefone;
- empresa;
- função;
- mensagem;
- URL completa com parâmetros não sanitizados;
- referenceId;
- IP;
- user-agent completo;
- conteúdo da FAQ;
- texto de erro do backend quando contiver detalhes.

## 49.4. Consentimento de analytics

Respeitar a configuração de cookies e analytics já adotada.

Não bloquear o envio do formulário quando analytics não estiver autorizado.

---

# 50. Metadados

## 50.1. Title

```text
Contato | Consultoria em Tecnologia | Marcelo Gonçalves
```

## 50.2. Description

```text
Apresente um desafio de automação, inteligência artificial, sistemas ou AWS e receba um retorno sobre aderência e próximos passos em até um dia útil.
```

## 50.3. Open Graph

Usar o mesmo title e description.

Preservar a imagem existente, se adequada.

Não gerar nova imagem.

## 50.4. Canonical

```text
/contato
```

Query strings de `area` não devem criar canonicals diferentes.

## 50.5. Indexação

Manter:

```text
index, follow
```

Não indexar URLs de contato com parâmetros como páginas separadas.

---

# 51. Dados estruturados

Somente atualizar se já houver JSON-LD.

Não instalar biblioteca.

É permitido usar:

```text
ContactPage
```

com:

- name;
- description;
- url;
- mainEntity compatível com a entidade já configurada.

Não publicar:

- endereço residencial;
- telefone não público;
- horário não definido;
- preço;
- atendimento 24 horas;
- área geográfica não validada.

---

# 52. Hierarquia de headings

Usar:

- hero: `<h1>`;
- bloco principal: `<h2>`;
- painel de próximos passos: `<h2>` ou `<h3>` conforme agrupamento semântico;
- etapas: `<h3>` se o painel usar `<h2>`;
- canais alternativos: `<h2>`;
- cards dos canais: `<h3>`;
- FAQ: `<h2>`.

Não existe CTA final com novo `<h2>`.

Não pular níveis.

Não usar heading apenas para estilo.

---

# 53. IDs

Usar:

```text
formulario-contato
```

```text
canais
```

```text
perguntas
```

Não duplicar IDs.

Aplicar `scroll-margin-top`.

---

# 54. Responsividade

## 54.1. Regras gerais

- usar breakpoints existentes;
- não criar carrossel;
- não usar altura fixa;
- não usar largura fixa;
- não permitir overflow horizontal;
- não reduzir fonte para encaixar;
- manter ordem de tabulação igual à ordem visual.

## 54.2. Hero

Desktop:

- compacto;
- texto central ou alinhamento atual;
- CTA de âncora.

Mobile:

- H1 com quebra;
- CTA sem corte;
- microcopy completa.

## 54.3. Bloco principal

Desktop:

- duas colunas;
- formulário maior;
- painel menor;
- gap conforme sistema existente.

Tablet:

- duas colunas apenas se o formulário mantiver pelo menos aproximadamente 520 px de largura útil;
- caso contrário, uma coluna.

Mobile:

- formulário antes dos passos;
- campos em uma coluna;
- botão com largura total ou padrão mobile do projeto;
- helper completo.

## 54.4. Pares de campos

Desktop:

- nome e e-mail lado a lado;
- empresa e função lado a lado;
- telefone e tamanho lado a lado;
- área em largura total;
- mensagem em largura total.

Tablet estreito e mobile:

- todos em uma coluna.

## 54.5. Canais

Desktop:

- até três cards em uma linha.

Tablet:

- duas colunas e um card abaixo, se necessário.

Mobile:

- uma coluna;
- links completos;
- e-mail sem corte;
- permitir quebra.

## 54.6. FAQ

- largura legível;
- botão com área de toque;
- perguntas com quebra;
- ícone sem sobreposição.

## 54.7. Zoom

Validar:

- 100%;
- 200%.

Nenhum campo, texto ou botão pode desaparecer.

---

# 55. Acessibilidade

## 55.1. Labels

Todos os campos devem possuir `<label>` visível.

Placeholder não substitui label.

## 55.2. Obrigatoriedade

Indicar campos obrigatórios por:

- texto ou símbolo;
- explicação no início;
- atributo `required`, quando adequado;
- não depender somente de cor.

Texto no início:

```text
Campos marcados com * são obrigatórios.
```

## 55.3. Erros

- resumo;
- erro junto ao campo;
- `aria-invalid`;
- `aria-describedby`;
- foco;
- anúncio.

## 55.4. Estado

- loading anunciado;
- sucesso anunciado;
- erro anunciado;
- não usar toast como única mensagem.

## 55.5. Autocomplete

Usar os valores definidos.

Não desabilitar autocomplete globalmente.

Honeypot é exceção.

## 55.6. Teclado

- ordem lógica;
- sem armadilhas;
- Enter para enviar quando apropriado;
- não enviar acidentalmente ao pressionar Enter em textarea;
- FAQ funcional com Espaço.

## 55.7. Contraste

Manter WCAG AA para:

- labels;
- helper;
- placeholders;
- erros;
- links;
- botão;
- estados;
- foco.

## 55.8. Movimento

Respeitar:

```css
prefers-reduced-motion: reduce
```

---

# 56. Segurança

## 56.1. Transporte

- HTTPS obrigatório;
- não aceitar endpoint HTTP;
- não enviar dados para terceiros não documentados;
- não colocar dados em query string.

## 56.2. Conteúdo

- escapar HTML;
- bloquear injeção em cabeçalhos;
- não executar Markdown;
- não refletir payload na página;
- não incluir stack trace;
- não confiar no cliente.

## 56.3. Segredos

- SES por IAM role;
- sem access key no código;
- sem segredo no frontend;
- variáveis sensíveis no mecanismo já adotado;
- não incluir dados em arquivos estáticos.

## 56.4. Dependências

Não adicionar biblioteca apenas para validação, se o projeto já possui uma solução.

Se existir biblioteca de schema no backend:

- reutilizar;
- manter uma única definição compartilhada quando seguro;
- não confiar apenas no tipo TypeScript.

---

# 57. Testes obrigatórios

## 57.1. Campos

Testar:

- todos vazios;
- somente obrigatórios;
- todos preenchidos;
- caracteres acentuados;
- nome com duas letras;
- e-mail inválido;
- e-mail longo;
- empresa curta;
- telefone internacional;
- telefone vazio;
- área inválida;
- query `area` válida;
- query `area` inválida;
- mensagem com 49 caracteres;
- mensagem com 50;
- mensagem com 3000;
- mensagem com 3001;
- mensagem com HTML;
- mensagem com URL;
- mensagem multilinha.

## 57.2. Spam

Testar:

- honeypot preenchido;
- muitas requisições;
- body maior que 16 KB;
- origem inválida;
- campos desconhecidos;
- cabeçalho com CRLF;
- payload sem JSON;
- enum inválida.

## 57.3. SES

Testar com simulador ou ambiente apropriado:

- envio aceito;
- destinatário rejeitado;
- bounce;
- complaint;
- confirmação falha;
- interno falha;
- configuration set;
- DKIM;
- remetente;
- Reply-To;
- texto puro;
- HTML escapado.

## 57.4. Estados

Testar:

- loading;
- sucesso com confirmação;
- sucesso sem confirmação;
- erro de validação;
- erro 429;
- erro 500;
- nova tentativa;
- enviar outra mensagem;
- foco em sucesso;
- foco em erro.

## 57.5. Navegação

Validar:

- hero → `#formulario-contato`;
- Automação → query correta;
- IA → query correta;
- Sistemas → query correta;
- Cloud → query correta;
- e-mail → `mailto`;
- WhatsApp → URL configurada;
- LinkedIn → URL configurada;
- aviso → página legal;
- voltar para Home;
- link após FAQ → formulário.

## 57.6. Responsividade

Validar:

- 360px;
- 390px;
- 768px;
- 1024px;
- 1366px;
- 1440px;
- zoom 200%.

## 57.7. Acessibilidade

Validar:

- labels;
- autocomplete;
- required;
- erros;
- resumo;
- teclado;
- foco;
- contraste;
- accordion;
- leitor de tela;
- movimento reduzido.

## 57.8. Analytics

Validar:

- evento de sucesso;
- evento de erro;
- nenhuma PII;
- funciona sem consentimento de analytics;
- formulário não depende do analytics;
- query sanitizada.

## 57.9. Build

- lint sem erros;
- testes sem erros;
- build sem erros;
- nenhuma regressão em header;
- nenhuma regressão em footer;
- nenhuma regressão nas páginas de serviço.

---

# 58. Critérios de aceite por bloco

## 58.1. Hero

- novo H1;
- sem diagnóstico;
- CTA de âncora;
- prazo correto.

## 58.2. Formulário

- oito campos visíveis;
- cinco obrigatórios:
  - nome;
  - e-mail;
  - empresa;
  - área;
  - mensagem;
- sem upload;
- sem orçamento;
- sem marketing;
- privacidade clara;
- erros acessíveis.

## 58.3. Próximos passos

- quatro etapas;
- sem proposta automática;
- diagnóstico comercial possível;
- nota de não obrigação.

## 58.4. Canais

- e-mail;
- WhatsApp condicional;
- LinkedIn;
- sem Instagram;
- localização sem endereço.

## 58.5. FAQ

- oito perguntas;
- oito respostas;
- diagnóstico explicado;
- prazo explicado;
- segurança explicada.

## 58.6. Backend

- validação;
- SES;
- Reply-To correto;
- confirmação;
- logs sem corpo;
- rate limit;
- honeypot.

## 58.7. Privacidade

- sem checkbox genérico;
- aviso com link;
- sem newsletter;
- retenção coerente;
- sem dados em analytics.

## 58.8. Remoções

- grade de serviços removida;
- CTA final removido;
- textos antigos removidos;
- “Seus dados ficam apenas conosco” removido.

---

# 59. Critérios de aceite da página completa

A implementação será aceita somente quando:

1. A página tiver uma ação principal clara.
2. O visitante não precisar escolher tecnologia.
3. O formulário coletar apenas o necessário.
4. Os campos obrigatórios estiverem limitados a cinco.
5. Não houver upload.
6. Não houver campo de orçamento.
7. Não houver consentimento genérico obrigatório.
8. O processo comercial estiver explicado.
9. Diagnóstico não for prometido gratuitamente.
10. Proposta não for automática.
11. O prazo for de até um dia útil.
12. A grade de serviços tiver sido removida.
13. O CTA final duplicado tiver sido removido.
14. O WhatsApp depender de configuração real.
15. Instagram não estiver como canal principal.
16. A FAQ estiver completa.
17. A validação ocorrer no cliente e servidor.
18. SES não for chamado pelo navegador.
19. Remetente estiver autenticado.
20. Reply-To utilizar o e-mail do visitante.
21. Confirmação automática existir.
22. Falha da confirmação não invalidar o contato interno.
23. O formulário possuir honeypot e rate limit.
24. Logs não armazenarem a mensagem.
25. Analytics não receber dados pessoais.
26. Retenção estiver coerente com o Aviso de Privacidade.
27. A página funcionar sem analytics.
28. O formulário for acessível por teclado.
29. Estados de erro e sucesso forem anunciados.
30. A página funcionar em desktop, tablet e mobile.
31. Não houver overflow.
32. Build, lint e testes terminarem sem erros.
33. CTAs específicos preselecionarem a área correta.
34. Nenhum texto for inventado ou reescrito pela IA engenheira.

---

# 60. Checklist final de revisão humana

- [ ] Hero atualizado.
- [ ] CTA leva ao formulário.
- [ ] Formulário e passos no mesmo macrobloco.
- [ ] Nome obrigatório.
- [ ] E-mail obrigatório.
- [ ] Empresa obrigatória.
- [ ] Área obrigatória.
- [ ] Mensagem obrigatória.
- [ ] Função opcional.
- [ ] Telefone opcional.
- [ ] Tamanho opcional.
- [ ] Sem upload.
- [ ] Sem orçamento.
- [ ] Área preselecionada por query.
- [ ] Query inválida ignorada.
- [ ] Aviso de privacidade presente.
- [ ] Sem checkbox genérico.
- [ ] Honeypot presente.
- [ ] Limite de corpo presente.
- [ ] Rate limit presente.
- [ ] Formulário não envia SES do cliente.
- [ ] From verificado.
- [ ] Reply-To correto.
- [ ] E-mail interno correto.
- [ ] Confirmação automática correta.
- [ ] Estado de sucesso acessível.
- [ ] Estado de erro acessível.
- [ ] Campos preservados após erro.
- [ ] Próximos passos com quatro etapas.
- [ ] Sem proposta automática.
- [ ] Grade de serviços removida.
- [ ] E-mail alternativo presente.
- [ ] WhatsApp condicional.
- [ ] LinkedIn presente.
- [ ] Instagram removido da área de contato.
- [ ] Oito FAQs respondidas.
- [ ] CTA final antigo removido.
- [ ] Link da FAQ retorna ao formulário.
- [ ] Analytics sem PII.
- [ ] Logs sem mensagem.
- [ ] Retenção revisada.
- [ ] Aviso de Privacidade coerente.
- [ ] DKIM revisado.
- [ ] SPF/MAIL FROM revisado.
- [ ] DMARC revisado.
- [ ] Eventos de bounce e complaint revisados.
- [ ] Mobile validado.
- [ ] Zoom 200% validado.
- [ ] Teclado validado.
- [ ] Leitor de tela validado.
- [ ] `prefers-reduced-motion` respeitado.
- [ ] Sem overflow.
- [ ] Sem textos truncados.
- [ ] Lint concluído.
- [ ] Testes concluídos.
- [ ] Build concluído.

---

# 61. Resultado esperado

Ao final, a página deverá comunicar:

> O primeiro contato é simples: a empresa apresenta o contexto, a consultoria avalia a aderência e o próximo passo é definido sem prometer antecipadamente diagnóstico, proposta ou contratação.

O visitante deverá entender:

- o que informar;
- o que não enviar;
- quando receberá resposta;
- que a primeira conversa não tem compromisso;
- que um diagnóstico aprofundado pode ser comercial;
- que não precisa escolher tecnologia;
- que pode utilizar e-mail, WhatsApp ou LinkedIn;
- que seus dados serão tratados para responder à solicitação;
- que o formulário não o adicionará a comunicações de marketing;
- que o envio não garante proposta.

A página deverá converter melhor porque reduz escolhas, elimina promessas ambíguas e torna o processo comercial previsível.
