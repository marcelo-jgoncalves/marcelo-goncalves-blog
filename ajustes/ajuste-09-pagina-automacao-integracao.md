# Especificação definitiva — Página Automação e Integração de Processos

## 0. Finalidade e precedência

Este documento define, de forma exaustiva e diretamente executável, todas as alterações necessárias na página individual do serviço de automação e integração.

A IA engenheira deverá implementar o conteúdo e os comportamentos exatamente como descritos, sem:

- escolher textos alternativos;
- resumir os textos fornecidos;
- criar novas seções por iniciativa própria;
- inventar entregas, métricas, tecnologias ou garantias;
- alterar a identidade visual;
- reinterpretar a estratégia comercial;
- transformar a página em uma landing page genérica;
- consultar instruções anteriores para decidir entre versões conflitantes.

Em caso de conflito com especificações anteriores sobre esta página, **este documento prevalece**.

---

# 1. Escopo

## 1.1. Rota atual

```text
/automacao
```

A rota deverá ser preservada nesta tarefa.

A futura rota definitiva poderá ser:

```text
/servicos/automacao-integracao
```

A migração de rota não faz parte desta implementação. Quando a arquitetura definitiva de rotas for executada, criar redirecionamento permanente da rota atual para a nova.

## 1.2. Página analisada

```text
https://dsns2wusdrj9z.cloudfront.net/automacao
```

Data de referência:

```text
27 de julho de 2026
```

## 1.3. Incluído

Esta tarefa inclui:

- hero;
- seção de entregas;
- benefícios;
- abordagem;
- capacidades técnicas;
- critérios de confiabilidade;
- perguntas frequentes;
- CTA final;
- metadados;
- responsividade;
- acessibilidade;
- testes;
- critérios de aceite.

## 1.4. Não incluído

Não realizar nesta tarefa:

- redesign completo do header;
- redesign completo do footer;
- mudança da paleta;
- troca das fontes;
- alteração das outras páginas de serviço;
- criação de formulário dentro da página;
- criação de calculadora de economia;
- criação de simulador de automação;
- criação de estudo de caso completo;
- inclusão de depoimentos;
- inclusão de logos;
- criação de preços;
- migração de rota;
- instalação de bibliotecas;
- criação de animações complexas;
- criação de nova identidade visual;
- criação de imagens por IA.

## 1.5. Componentes globais

O cabeçalho, o rodapé e o CTA global devem seguir as regras já definidas na especificação completa da Home.

Não duplicar componentes globais dentro desta página.

---

# 2. Diagnóstico da página atual

## 2.1. Elementos que funcionam e devem ser preservados

Preservar conceitualmente:

- foco em redução de retrabalho;
- integração entre sistemas;
- automação de processos;
- APIs;
- workflows;
- confiabilidade;
- rastreabilidade;
- monitoramento;
- evolução;
- benefícios operacionais;
- FAQ;
- CTA final.

Preservar visualmente, sempre que possível:

- hero existente;
- grid da seção “O que fazemos”;
- bloco de benefícios;
- bloco de abordagem;
- lista de capacidades;
- componente de FAQ;
- CTA final;
- tokens, cores, bordas, sombras, grids e espaçamentos.

## 2.2. Problemas de posicionamento

A página atual apresenta os seguintes problemas:

1. O rótulo “Pilar · Automação” trata o serviço como disciplina técnica, não como solução comercial.
2. O hero utiliza “eliminamos retrabalho” de forma absoluta.
3. O CTA “Solicitar diagnóstico” cria expectativa de diagnóstico gratuito.
4. “Automação de Processos” e “Orquestração de Processos” têm grande sobreposição.
5. “Arquiteturas Escaláveis” não é uma frente de entrega equivalente às demais; é um atributo de qualidade.
6. A seção “Especialidades” repete automação, APIs e integração já descritas.
7. A abordagem aparece depois das especialidades técnicas, invertendo a prioridade da narrativa.
8. O objetivo “integrar de verdade” é correto, mas abstrato.
9. A lista de confiabilidade contém afirmações genéricas.
10. A FAQ foi parcialmente reaproveitada da página de software.
11. Algumas respostas da FAQ estão ausentes.
12. O CTA final promete chamada gratuita de 60 minutos, diagnóstico, plano de ação e resposta máxima de duas horas.
13. O texto “automação completa da operação” sugere escopo excessivamente amplo.
14. A página não explica adequadamente que a automação pode começar por um processo pequeno.
15. A página não explica como erros, indisponibilidades e exceções são tratados.

---

# 3. Decisão estrutural definitiva

## 3.1. Ordem final dos blocos

A página deverá seguir esta ordem:

1. Cabeçalho global;
2. Hero;
3. O que automatizamos e integramos;
4. Benefícios para a operação;
5. Nossa abordagem;
6. Capacidades técnicas;
7. Confiabilidade e controle;
8. Perguntas frequentes;
9. CTA final;
10. Rodapé global.

## 3.2. Alterações estruturais necessárias

Realizar:

1. Manter o hero, reescrevendo seu conteúdo.
2. Manter cinco cards na primeira seção, mas substituir as frentes atuais por entregas comerciais claramente distintas.
3. Manter a seção de benefícios, reduzindo a repetição e organizando os resultados.
4. Mover “Nossa abordagem” para antes das especialidades técnicas.
5. Renomear “Especialidades” para “Capacidades técnicas”.
6. Transformar o bloco “Objetivo” e a lista “Confiabilidade em cada integração” em uma seção própria de confiabilidade e controle.
7. Substituir integralmente a FAQ.
8. Manter o CTA final, removendo promessas incompatíveis com o modelo comercial.

## 3.3. Seções que não devem ser criadas

Não criar:

- seção adicional “Problemas que resolvemos”;
- seção de casos de uso separada;
- seção de tecnologias;
- seção de preços;
- seção de depoimentos;
- seção de logos;
- seção “Por que escolher automação”;
- seção de comparação antes/depois;
- carrossel;
- formulário embutido.

A identificação do problema será feita pelo hero, pelas entregas e pela abordagem.

---

# 4. Regras gerais de linguagem

## 4.1. Nome comercial

Usar exatamente:

```text
Automação e Integração de Processos
```

Não alternar com:

- Integração & Automação;
- Integração e Automação;
- Automação Empresarial;
- Automação Inteligente;
- Automação completa;
- Hiperautomação;
- Automação 360°.

## 4.2. Promessa central

A página deverá comunicar:

> Conectamos sistemas e automatizamos processos para reduzir trabalho manual, erros e tempo operacional, preservando controle, rastreabilidade e capacidade de evolução.

## 4.3. Público

A primeira camada da página deve ser compreensível para:

- proprietários;
- gestores de operações;
- gestores administrativos;
- gestores financeiros;
- responsáveis por processos;
- líderes de tecnologia.

## 4.4. Ordem narrativa

Em cada seção:

1. situação ou problema;
2. impacto operacional;
3. resultado esperado;
4. solução;
5. capacidade técnica.

## 4.5. Vocabulário permitido

Preferir:

- reduzir;
- conectar;
- automatizar;
- rastrear;
- validar;
- integrar;
- monitorar;
- tratar exceções;
- diminuir retrabalho;
- melhorar consistência;
- acelerar etapas;
- eliminar transferências manuais quando viável;
- começar por um processo;
- evolução gradual;
- controle;
- regras;
- permissões;
- logs;
- alertas;
- retomada;
- idempotência, somente em contexto técnico.

## 4.6. Vocabulário proibido

Não utilizar:

- eliminar todo o trabalho manual;
- operação totalmente autônoma;
- automação completa da operação;
- zero erros;
- sem intervenção humana;
- funcionamento garantido;
- qualquer sistema;
- integração instantânea;
- transformação digital completa;
- solução 360°;
- revolucionar;
- tecnologia de ponta;
- processos perfeitos;
- escalabilidade infinita;
- diagnóstico gratuito;
- plano de ação gratuito;
- resposta em até duas horas;
- chamada gratuita de 60 minutos;
- sem custo;
- sem pressão de venda;
- “o que realmente importa” sem especificação;
- “integrar de verdade” como única explicação.

---

# 5. Hero

## 5.1. Estrutura

Preservar a composição visual atual.

Ordem obrigatória:

1. eyebrow;
2. H1;
3. subtítulo;
4. CTA principal;
5. microcopy.

Não adicionar segundo CTA.

Não adicionar listas de tecnologias.

## 5.2. Eyebrow

Substituir:

```text
Pilar · Automação
```

por:

```text
Automação e Integração de Processos
```

## 5.3. H1

Substituir o título atual por:

```text
Reduza tarefas manuais e conecte os sistemas que sustentam sua operação.
```

## 5.4. Subtítulo

Usar:

```text
Automatizamos fluxos, integramos aplicações e organizamos a circulação de informações para reduzir retrabalho, erros e tempo operacional — sem exigir a substituição imediata dos sistemas que sua empresa já utiliza.
```

Usar travessão longo.

Não substituir por hífen simples.

## 5.5. CTA

Texto:

```text
Apresentar um processo
```

Destino:

```text
/contato
```

## 5.6. Microcopy

```text
Conversa inicial sem compromisso · Retorno em até um dia útil
```

## 5.7. Semântica

- eyebrow: texto não heading;
- título: único `<h1>`;
- subtítulo: `<p>`;
- CTA: `<a>`;
- microcopy: `<p>` ou `<small>`.

## 5.8. Regras visuais

- preservar fundo e composição;
- não adicionar ilustração de engrenagens;
- não adicionar robô;
- não adicionar diagrama de fluxo no hero;
- não adicionar logos de ERP, CRM ou plataformas;
- limitar largura textual;
- CTA com estilo primário;
- microcopy com menor destaque;
- não aumentar excessivamente a altura;
- mobile sem `nowrap`;
- nenhum texto truncado.

## 5.9. Remover

Remover:

```text
Conectamos sistemas e eliminamos retrabalho para tornar sua operação mais eficiente.
```

Remover:

```text
Desenvolvemos soluções que integram plataformas e automatizam fluxos de trabalho para que as informações circulem de forma segura, rápida e confiável, permitindo que sua equipe concentre esforços no que realmente importa.
```

Remover:

```text
Solicitar diagnóstico
```

---

# 6. Seção — O que automatizamos e integramos

## 6.1. Origem

Esta seção substitui “O que fazemos”.

## 6.2. Eyebrow

```text
O que fazemos
```

## 6.3. H2

Substituir:

```text
Da integração à automação completa da operação
```

por:

```text
Processos mais conectados, previsíveis e fáceis de acompanhar.
```

## 6.4. Introdução

Substituir:

```text
Cinco frentes que conectam sistemas e eliminam trabalho manual.
```

por:

```text
Começamos pelos fluxos que concentram mais esforço, erros ou dependências manuais. A solução pode integrar ferramentas existentes, automatizar etapas específicas ou criar uma camada operacional para coordenar todo o processo.
```

## 6.5. Quantidade de cards

Manter exatamente cinco cards.

## 6.6. Ordem

1. Automação de processos;
2. Integração entre sistemas;
3. Workflows e aprovações;
4. Processamento de documentos e dados;
5. APIs e serviços de integração.

---

# 7. Card 1 — Automação de processos

## 7.1. Título

```text
Automação de processos
```

## 7.2. Texto

```text
Transformamos tarefas repetitivas e baseadas em regras em fluxos automatizados, com execução consistente, registros de cada etapa e tratamento explícito das exceções.
```

## 7.3. Tags

```text
Tarefas recorrentes
```

```text
Regras de negócio
```

```text
Rastreabilidade
```

---

# 8. Card 2 — Integração entre sistemas

## 8.1. Título

```text
Integração entre sistemas
```

## 8.2. Texto

```text
Conectamos aplicações para que dados circulem automaticamente entre ERP, CRM, plataformas financeiras, serviços externos e sistemas internos.
```

## 8.3. Tags

```text
ERP e CRM
```

```text
Sistemas internos
```

```text
Serviços externos
```

---

# 9. Card 3 — Workflows e aprovações

## 9.1. Título

```text
Workflows e aprovações
```

## 9.2. Texto

```text
Estruturamos fluxos com responsáveis, regras, prazos, notificações e trilhas de auditoria para reduzir esperas e aumentar a visibilidade sobre cada processo.
```

## 9.3. Tags

```text
Aprovações
```

```text
Notificações
```

```text
Auditoria
```

---

# 10. Card 4 — Processamento de documentos e dados

## 10.1. Título

```text
Processamento de documentos e dados
```

## 10.2. Texto

```text
Automatizamos o recebimento, a validação, a transformação e o encaminhamento de documentos e informações entre pessoas e sistemas.
```

## 10.3. Tags

```text
Documentos
```

```text
Validação
```

```text
Relatórios
```

## 10.4. Restrição

Não mencionar inteligência artificial neste card.

A IA poderá participar da solução, mas será detalhada na página específica.

---

# 11. Card 5 — APIs e serviços de integração

## 11.1. Título

```text
APIs e serviços de integração
```

## 11.2. Texto

```text
Desenvolvemos interfaces documentadas e componentes de integração para conectar aplicações atuais e facilitar a incorporação de novos sistemas no futuro.
```

## 11.3. Tags

```text
APIs
```

```text
Webhooks
```

```text
Baixo acoplamento
```

## 11.4. Remoções

Os cards antigos:

- Orquestração de Processos;
- Arquiteturas Escaláveis;

não devem permanecer.

Remover do DOM e da fonte de dados.

Não ocultar apenas com CSS.

## 11.5. Regras dos cards

- manter o componente atual;
- cards com altura flexível;
- títulos sem capitalização excessiva;
- exatamente três tags;
- sem listas adicionais;
- sem CTA individual;
- sem ícones novos;
- mobile em uma coluna;
- tablet conforme grid atual;
- sem carrossel.

---

# 12. Seção — Benefícios para a operação

## 12.1. Origem

Esta seção substitui o bloco “Benefícios”.

## 12.2. Eyebrow

```text
Benefícios
```

## 12.3. H2

Substituir:

```text
Uma operação conectada, do primeiro ao último sistema
```

por:

```text
Menos esforço para operar. Mais controle para evoluir.
```

## 12.4. Introdução

Adicionar:

```text
Os ganhos dependem do processo e do contexto, mas uma automação bem projetada deve reduzir atividades repetitivas sem retirar visibilidade, controle ou capacidade de intervenção.
```

## 12.5. Quantidade

Manter oito benefícios caso o componente atual esteja desenhado para oito itens.

Usar exatamente:

```text
Menos tarefas repetitivas
```

```text
Redução de erros de transferência e digitação
```

```text
Processos mais rápidos e previsíveis
```

```text
Informações consistentes entre sistemas
```

```text
Maior rastreabilidade das etapas
```

```text
Equipes menos dependentes de controles manuais
```

```text
Facilidade para incorporar novos sistemas
```

```text
Capacidade de crescer sem aumentar o retrabalho na mesma proporção
```

## 12.6. Regras

- não prometer eliminação absoluta;
- não utilizar “melhor experiência para clientes” sem contexto;
- não incluir métricas;
- não adicionar parágrafos individuais;
- preservar o tratamento visual atual;
- ícones, se existentes, devem ser decorativos e ter `aria-hidden="true"`;
- não usar emojis.

---

# 13. Seção — Nossa abordagem

## 13.1. Ordem

Mover esta seção para imediatamente depois dos benefícios.

Ela deve aparecer antes das capacidades técnicas.

## 13.2. Eyebrow

```text
Nossa abordagem
```

## 13.3. H2

Manter com ajuste de redação:

```text
Cada automação deve resolver um problema real da operação.
```

## 13.4. Texto principal

Substituir o parágrafo atual por:

```text
Antes de automatizar, entendemos como o processo funciona, quem participa, quais sistemas estão envolvidos, onde ocorrem exceções e como o resultado será medido. Só então definimos o fluxo, as integrações e os controles necessários.
```

## 13.5. Subbloco 1

### Rótulo

```text
Começar pelo processo
```

### H3

```text
Automatizar uma etapa útil antes de ampliar o escopo.
```

### Texto

```text
Sempre que possível, iniciamos pelo processo com melhor relação entre impacto, risco e esforço. Isso permite validar a abordagem, corrigir premissas e ampliar a solução com mais segurança.
```

## 13.6. Subbloco 2

### Rótulo

```text
Preservar o que funciona
```

### H3

```text
Integrar antes de substituir.
```

### Texto

```text
Não propomos trocar sistemas apenas para viabilizar uma automação. Quando a base atual é adequada, criamos integrações e camadas complementares para reduzir mudanças desnecessárias.
```

## 13.7. Subbloco 3

### Rótulo

```text
Manter controle
```

### H3

```text
Automação não significa perder visibilidade.
```

### Texto

```text
Definimos logs, alertas, permissões, pontos de validação e formas de intervenção para que a empresa consiga acompanhar o fluxo e agir quando uma situação foge do esperado.
```

## 13.8. Regras visuais

- reutilizar o componente atual da abordagem;
- se o componente atual comportar apenas um subbloco, adaptar para três itens dentro do mesmo bloco;
- não criar nova seção;
- não utilizar diagrama técnico;
- não listar ferramentas;
- não apresentar metodologia proprietária;
- não utilizar “automação total”.

---

# 14. Seção — Capacidades técnicas

## 14.1. Origem

Esta seção substitui “Especialidades”.

## 14.2. Ordem

Posicionar depois de “Nossa abordagem”.

## 14.3. Eyebrow

```text
Capacidades técnicas
```

## 14.4. H2

Substituir:

```text
Onde fazemos a diferença
```

por:

```text
A engenharia que sustenta cada integração.
```

## 14.5. Introdução

Substituir:

```text
Oito frentes que sustentam cada projeto de integração, da arquitetura à operação contínua.
```

por:

```text
Selecionamos padrões e componentes conforme o volume, a criticidade, os sistemas envolvidos e a capacidade de manutenção da empresa.
```

## 14.6. Quantidade

Manter exatamente oito itens.

## 14.7. Itens

Usar:

```text
Integração de sistemas corporativos
```

```text
APIs e webhooks
```

```text
Arquiteturas orientadas a eventos
```

```text
Processamento assíncrono
```

```text
Filas, retentativas e filas de mensagens não processadas
```

```text
Idempotência e prevenção de duplicidades
```

```text
Monitoramento, logs e alertas
```

```text
Integração com serviços em nuvem
```

## 14.8. Terminologia técnica

O termo “filas de mensagens não processadas” deverá aparecer na interface.

Não utilizar apenas:

```text
DLQ
```

É permitido incluir `DLQ` em texto acessível ou tooltip técnico, mas não é necessário.

## 14.9. Regras

- os itens são capacidades, não serviços independentes;
- não criar links individuais;
- não adicionar descrições longas;
- não inserir nomes de produtos AWS;
- não inserir logos;
- preservar o componente atual;
- permitir quebra de linha;
- mobile em uma coluna ou layout atual sem overflow.

---

# 15. Seção — Confiabilidade e controle

## 15.1. Origem

Esta seção é formada pela consolidação de:

- bloco “Objetivo”;
- H3 “Confiabilidade em cada integração”;
- lista de seis checks.

## 15.2. Eyebrow

```text
Confiabilidade e controle
```

## 15.3. H2

```text
A automação precisa continuar segura quando algo foge do esperado.
```

## 15.4. Texto

```text
Integrações dependem de sistemas externos, dados variáveis e condições que nem sempre estão sob o mesmo controle. Por isso, projetamos formas de detectar falhas, evitar duplicidades, retomar o processamento e tornar cada etapa rastreável.
```

## 15.5. Lista

Usar exatamente seis itens:

```text
Regras e responsabilidades claramente definidas
```

```text
Validação de dados antes do processamento
```

```text
Retentativas controladas e tratamento de indisponibilidades
```

```text
Prevenção de registros duplicados
```

```text
Logs, métricas e alertas sobre o fluxo
```

```text
Intervenção humana quando a exceção exige análise
```

## 15.6. Encerramento

```text
O objetivo não é ocultar a complexidade, mas impedir que ela seja transferida para quem opera o processo.
```

## 15.7. Remover

Remover:

```text
Objetivo
```

Remover:

```text
Mais que conectar, integrar de verdade.
```

Remover:

```text
Nosso objetivo não é apenas conectar aplicações, mas construir uma operação mais eficiente, integrada e sustentável.
```

Remover os checks antigos:

- Soluções desenvolvidas sob medida;
- Arquiteturas modernas e escaláveis;
- Processos orientados à confiabilidade;
- Fácil evolução e manutenção;
- Integração nativa com plataformas em nuvem;
- Monitoramento e rastreabilidade dos fluxos.

## 15.8. Regras visuais

- reaproveitar o componente de checklist;
- não adicionar selo de segurança;
- não utilizar cadeado genérico como elemento dominante;
- não prometer alta disponibilidade em todas as integrações;
- checks devem ser visualmente consistentes;
- texto de encerramento deve ter tratamento discreto.

---

# 16. Perguntas frequentes

## 16.1. Estrutura

Preservar o componente de accordion atual.

Substituir todas as perguntas e respostas.

Não manter nenhuma pergunta antiga.

## 16.2. Eyebrow

```text
Perguntas frequentes
```

## 16.3. H2

```text
Dúvidas antes de automatizar um processo
```

## 16.4. Quantidade

Usar exatamente oito perguntas.

## 16.5. Pergunta 1

### Pergunta

```text
É necessário substituir os sistemas que já utilizamos?
```

### Resposta

```text
Não necessariamente. Em muitos projetos, o melhor caminho é conectar, complementar ou reorganizar o fluxo existente. A substituição só deve ser considerada quando a limitação do sistema impede uma solução confiável ou economicamente viável.
```

## 16.6. Pergunta 2

### Pergunta

```text
É possível começar por um único processo?
```

### Resposta

```text
Sim. Sempre que possível, começamos por um fluxo com impacto relevante e escopo controlado. Isso permite validar a abordagem antes de ampliar a automação para outras áreas.
```

## 16.7. Pergunta 3

### Pergunta

```text
Quais processos podem ser automatizados?
```

### Resposta

```text
Processos repetitivos, baseados em regras e com entradas e resultados identificáveis costumam ser bons candidatos. Aprovações, consolidação de dados, geração de relatórios, notificações, cadastros e processamento de documentos são exemplos comuns.
```

## 16.8. Pergunta 4

### Pergunta

```text
Vocês conseguem integrar sistemas legados?
```

### Resposta

```text
Depende das interfaces disponíveis, do acesso aos dados e das restrições do sistema. Quando não existe uma API adequada, avaliamos alternativas seguras e sustentáveis antes de propor a integração.
```

## 16.9. Pergunta 5

### Pergunta

```text
O que acontece quando um sistema fica indisponível?
```

### Resposta

```text
A solução pode utilizar filas, retentativas, alertas e mecanismos de retomada para evitar perda de informações. O desenho exato depende da criticidade do processo e do comportamento de cada sistema envolvido.
```

## 16.10. Pergunta 6

### Pergunta

```text
Como evitamos dados duplicados ou processamentos repetidos?
```

### Resposta

```text
Projetamos identificadores, validações e regras de idempotência para que uma mesma solicitação não produza efeitos duplicados quando houver reenvios, falhas ou retentativas.
```

## 16.11. Pergunta 7

### Pergunta

```text
A equipe consegue acompanhar o que a automação está fazendo?
```

### Resposta

```text
Sim. Definimos registros, indicadores, alertas e, quando necessário, interfaces de acompanhamento para que as pessoas responsáveis consigam visualizar o estado e tratar exceções.
```

## 16.12. Pergunta 8

### Pergunta

```text
Como funciona a manutenção depois da entrega?
```

### Resposta

```text
O modelo de sustentação é definido conforme a solução. Pode incluir acompanhamento inicial, correções, monitoramento, evolução contínua ou transferência estruturada para a equipe do cliente.
```

## 16.13. Regras do accordion

- todas as perguntas acessíveis por teclado;
- usar botão semântico para abrir e fechar;
- `aria-expanded`;
- `aria-controls`;
- foco visível;
- permitir abertura de uma ou várias perguntas conforme comportamento atual;
- não alterar o comportamento sem necessidade;
- respostas devem existir no HTML e não depender de requisição;
- respeitar `prefers-reduced-motion`;
- não deixar perguntas sem resposta.

---

# 17. CTA final

## 17.1. Estrutura

Preservar a composição visual do CTA atual.

Substituir integralmente o conteúdo.

## 17.2. Eyebrow

```text
Vamos começar
```

## 17.3. H2

```text
Qual processo está consumindo mais tempo da sua equipe?
```

## 17.4. Parágrafo

```text
Conte como o fluxo funciona hoje, quais sistemas participam e onde estão os principais gargalos. Vamos avaliar a aderência e definir se faz sentido avançar para um diagnóstico.
```

## 17.5. Lista

Usar:

```text
Tarefas repetitivas e transferências manuais de dados
```

```text
Aprovações lentas ou difíceis de acompanhar
```

```text
Sistemas que precisam trocar informações com mais confiabilidade
```

## 17.6. Badge

```text
Disponível para novos projetos
```

Exibir somente quando a configuração indicar disponibilidade.

Seguir a implementação da Home.

## 17.7. Card de ação

### Rótulo

```text
Primeira conversa
```

### H3

```text
Vamos entender o processo e avaliar o próximo passo.
```

### Texto

```text
A conversa inicial serve para verificar a aderência e esclarecer os primeiros caminhos. Diagnósticos que exigem levantamento e recomendações detalhadas podem ser estruturados como uma entrega comercial própria.
```

### CTA

```text
Apresentar um processo
```

Destino:

```text
/contato
```

### Microcopy

```text
Sem compromisso · Retorno em até um dia útil
```

## 17.8. Remover

Remover:

```text
Agende uma chamada inicial de 60 minutos e sem custo e sem compromisso para discutirmos como podemos conectar seus sistemas e eliminar retrabalho.
```

Remover:

```text
Diagnóstico objetivo da sua operação atual
```

Remover:

```text
Plano de ação claro, sem pressão de venda
```

Remover:

```text
Resposta rápida, 100% remoto
```

Remover:

```text
Agende um diagnóstico inicial gratuito
```

Remover:

```text
Chamada inicial 60 min · gratuita
```

Remover:

```text
Formato 100% remoto
```

Remover:

```text
Tempo de resposta max. 2h
```

Remover:

```text
Entrar em contato
```

Substituir pelo novo CTA.

Remover:

```text
Sem compromisso · sem custo
```

Substituir pela nova microcopy.

## 17.9. Restrição

Não informar duração fixa da conversa.

Não prometer diagnóstico gratuito.

Não prometer plano de ação na conversa inicial.

Não prometer atendimento em duas horas.

---

# 18. Cabeçalho e rodapé

## 18.1. Cabeçalho

Seguir a especificação global da Home.

O CTA do header deverá ser:

```text
Apresentar um desafio
```

Destino:

```text
/contato
```

## 18.2. Rodapé

Seguir a especificação global da Home.

Na lista de especialidades, exibir:

```text
Automação e Integração
```

para esta página.

Destino temporário:

```text
/automacao
```

Não repetir alterações locais no componente da página.

---

# 19. Hierarquia de headings

Usar:

- hero: `<h1>`;
- O que fazemos: `<h2>`;
- cards: `<h3>`;
- Benefícios: `<h2>`;
- Nossa abordagem: `<h2>`;
- subblocos: `<h3>`;
- Capacidades técnicas: `<h2>`;
- Confiabilidade e controle: `<h2>`;
- FAQ: `<h2>`;
- perguntas: botão, não heading obrigatório;
- CTA final: `<h2>`;
- card do CTA: `<h3>`.

Não pular níveis.

Não usar headings apenas para estilo.

---

# 20. IDs de seção

Usar:

```text
entregas
```

```text
beneficios
```

```text
abordagem
```

```text
capacidades
```

```text
confiabilidade
```

```text
perguntas
```

```text
contato
```

Aplicar `scroll-margin-top`.

Não duplicar IDs.

---

# 21. Responsividade

## 21.1. Regras gerais

Usar breakpoints existentes.

Não criar uma estratégia global nova.

Não usar largura fixa nos cards.

Não utilizar carrossel.

## 21.2. Hero

Desktop:

- manter composição;
- limitar largura textual;
- CTA e microcopy abaixo.

Mobile:

- CTA com largura adequada;
- sem corte;
- sem overflow;
- título sem `nowrap`.

## 21.3. Cards de entregas

Desktop:

- preservar grid atual;
- se o grid atual tiver três colunas, permitir uma distribuição 3 + 2 equilibrada;
- os dois cards finais não devem parecer cards órfãos estreitos.

Tablet:

- duas colunas.

Mobile:

- uma coluna;
- ordem preservada.

Não definir altura fixa.

## 21.4. Benefícios

- manter distribuição atual;
- tablet com duas colunas, se aplicável;
- mobile em uma coluna ou duas colunas apenas se cada item permanecer legível;
- não cortar os textos longos.

## 21.5. Abordagem

Desktop:

- preservar composição existente;
- os três subblocos podem formar três colunas se houver largura.

Tablet/mobile:

- empilhar;
- manter ordem;
- sem rolagem horizontal.

## 21.6. Capacidades

- permitir quebra dos itens;
- sem cards muito estreitos;
- mobile em uma coluna ou duas conforme legibilidade;
- não usar fonte reduzida para manter o grid.

## 21.7. Confiabilidade

- lista em uma ou duas colunas conforme layout atual;
- mobile em uma coluna;
- checks alinhados;
- textos completos.

## 21.8. FAQ

- largura total do container de conteúdo;
- títulos das perguntas com quebra;
- área clicável mínima adequada;
- ícone sem sobrepor texto.

## 21.9. CTA

- desktop conforme componente global;
- mobile em uma coluna;
- card de ação depois do texto;
- botão sem corte.

## 21.10. Zoom

Todo conteúdo deve funcionar em 200% de zoom.

---

# 22. Acessibilidade

## 22.1. Contraste

Manter WCAG AA para:

- textos;
- botões;
- tags;
- microcopy;
- checks;
- FAQ;
- foco.

## 22.2. Teclado

Todos os CTAs e accordions devem:

- receber foco;
- exibir foco visível;
- funcionar com Enter;
- no FAQ, funcionar também com Espaço.

## 22.3. Movimento

Respeitar:

```css
prefers-reduced-motion: reduce
```

## 22.4. Ícones

- decorativos: `aria-hidden="true"`;
- não utilizar emojis;
- não depender do ícone para transmitir o significado.

## 22.5. Semântica

- listas devem usar `<ul>` e `<li>`;
- CTA de navegação deve ser `<a>`;
- FAQ deve usar `<button>`;
- não usar `<div onClick>`;
- não usar texto essencial em pseudo-elementos.

---

# 23. Metadados

## 23.1. Title

```text
Automação e Integração de Processos | Marcelo Gonçalves
```

## 23.2. Description

```text
Automatize processos, conecte ERP, CRM e sistemas internos e reduza retrabalho com integrações confiáveis, rastreáveis e preparadas para evoluir.
```

## 23.3. Open Graph

Usar o mesmo title e description.

Preservar a imagem atual, se adequada.

Não gerar nova imagem.

## 23.4. Canonical

Manter canonical para:

```text
/automacao
```

enquanto a rota definitiva não for implementada.

Quando houver migração:

- canonical para nova rota;
- redirecionamento 301 da antiga;
- atualizar links internos;
- preservar histórico de SEO.

---

# 24. Dados estruturados

Somente atualizar se a página já utilizar JSON-LD.

Não instalar biblioteca.

É permitido atualizar um `Service` existente com:

- name: Automação e Integração de Processos;
- serviceType: Automação e integração de sistemas;
- provider: entidade institucional já configurada;
- areaServed: manter o valor existente;
- url: canonical da página.

Não inventar:

- preços;
- avaliações;
- disponibilidade;
- região;
- clientes;
- resultados;
- offers.

---

# 25. Analytics

Aplicar somente se existir helper.

Não instalar provedor.

Eventos:

```text
automation_hero_cta_click
```

```text
automation_faq_toggle
```

```text
automation_final_cta_click
```

Para o FAQ, incluir identificador estável da pergunta.

Não enviar texto livre do usuário.

Se não houver analytics, ignorar.

---

# 26. Implementação técnica

## 26.1. Reutilizar

- componentes atuais;
- cards;
- tags;
- benefícios;
- bloco de abordagem;
- checklist;
- accordion;
- CTA final;
- header;
- footer;
- containers;
- tokens.

## 26.2. Dados

Se cards, benefícios, capacidades ou FAQ forem data-driven:

- atualizar arrays na fonte original;
- remover dados antigos;
- não duplicar;
- usar IDs estáveis;
- preservar tipos;
- não usar índice como chave quando houver ID.

## 26.3. Não instalar

- biblioteca de FAQ;
- biblioteca de diagramas;
- biblioteca de animação;
- biblioteca de ícones;
- carrossel;
- slider;
- pacote de formulários.

## 26.4. Remoção real

Conteúdos removidos devem deixar de ser renderizados e, quando não utilizados por outra página, devem ser removidos da fonte da página.

Não ocultar com:

```css
display: none;
```

---

# 27. Elementos proibidos

A IA engenheira não deve:

- inventar sistemas integrados;
- incluir logos de ERP ou CRM;
- citar SAP, Salesforce, Totvs ou outros fornecedores sem necessidade;
- prometer compatibilidade universal;
- prometer economia percentual;
- inventar estudo de caso;
- adicionar depoimentos;
- adicionar preços;
- criar formulário;
- criar chamada de 60 minutos;
- prometer diagnóstico gratuito;
- criar novo bloco;
- alterar a ordem final;
- adicionar IA a todas as automações;
- apresentar RPA como solução padrão;
- adicionar robôs;
- adicionar ilustrações genéricas;
- alterar paleta;
- alterar fonte;
- alterar o header localmente;
- alterar o footer localmente;
- reescrever textos;
- resumir respostas do FAQ;
- manter respostas vazias;
- usar “eliminar todo o trabalho manual”;
- usar “automação completa”.

---

# 28. Ordem de implementação

Executar:

1. Identificar componente da rota `/automacao`.
2. Identificar fonte de dados.
3. Atualizar hero.
4. Atualizar os cinco cards.
5. Atualizar benefícios.
6. Mover e atualizar abordagem.
7. Atualizar capacidades técnicas.
8. Consolidar confiabilidade e controle.
9. Substituir FAQ.
10. Atualizar CTA final.
11. Aplicar regras globais do header e footer.
12. Atualizar metadados.
13. Atualizar JSON-LD, somente se existente.
14. Ajustar responsividade.
15. Validar acessibilidade.
16. Executar lint.
17. Executar testes.
18. Executar build.
19. Fazer revisão visual.
20. Validar links.

---

# 29. Testes obrigatórios

## 29.1. Conteúdo presente

Verificar:

```text
Automação e Integração de Processos
```

```text
Reduza tarefas manuais e conecte os sistemas
```

```text
Processos mais conectados, previsíveis e fáceis de acompanhar.
```

```text
Workflows e aprovações
```

```text
Processamento de documentos e dados
```

```text
Cada automação deve resolver um problema real da operação.
```

```text
Confiabilidade e controle
```

```text
Dúvidas antes de automatizar um processo
```

```text
Apresentar um processo
```

## 29.2. Conteúdo ausente

Verificar que não existe:

```text
Pilar · Automação
```

```text
automação completa da operação
```

```text
Orquestração de Processos
```

```text
Arquiteturas Escaláveis
```

```text
Mais que conectar, integrar de verdade.
```

```text
Vocês desenvolvem apenas sistemas novos?
```

```text
Agende um diagnóstico inicial gratuito
```

```text
Chamada inicial 60 min · gratuita
```

```text
Tempo de resposta max. 2h
```

```text
Sem compromisso · sem custo
```

## 29.3. Links

Validar:

- hero CTA → `/contato`;
- CTA final → `/contato`;
- header CTA → `/contato`;
- footer links funcionais;
- logo → `/`;
- menu de serviços funcional.

## 29.4. FAQ

Testar:

- oito perguntas;
- oito respostas;
- teclado;
- `aria-expanded`;
- estado aberto;
- estado fechado;
- múltiplas aberturas conforme componente atual;
- sem salto de layout anormal.

## 29.5. Responsividade

Validar:

- 360px;
- 390px;
- 768px;
- 1024px;
- 1366px;
- 1440px.

Verificar:

- ausência de overflow;
- cards sem corte;
- tags com quebra;
- FAQ sem sobreposição;
- CTA legível;
- headings sem `nowrap`.

## 29.6. Zoom

Validar 100% e 200%.

## 29.7. Build

- lint sem erros;
- testes sem erros;
- build de produção sem erros;
- nenhuma rota quebrada.

---

# 30. Critérios de aceite por seção

## 30.1. Hero

- nome comercial correto;
- promessa sem absolutos;
- CTA sem diagnóstico;
- prazo padronizado.

## 30.2. Entregas

- cinco cards;
- distinção clara;
- sem “Arquiteturas Escaláveis” como serviço;
- sem “Orquestração” redundante.

## 30.3. Benefícios

- oito benefícios;
- linguagem não absoluta;
- foco em operação e controle.

## 30.4. Abordagem

- antes das capacidades;
- três subblocos;
- começar pequeno;
- integrar antes de substituir;
- manter controle.

## 30.5. Capacidades

- oito capacidades;
- técnicas, não comerciais;
- sem produtos específicos;
- sem repetição integral dos cards.

## 30.6. Confiabilidade

- tratamento de falhas;
- duplicidades;
- retentativas;
- observabilidade;
- intervenção humana.

## 30.7. FAQ

- perguntas específicas;
- respostas completas;
- acessível;
- sem conteúdo de software reaproveitado.

## 30.8. CTA

- sem chamada gratuita de 60 minutos;
- sem diagnóstico gratuito;
- sem plano de ação prometido;
- prazo de um dia útil;
- CTA “Apresentar um processo”.

---

# 31. Critérios de aceite da página completa

A implementação será aceita somente quando:

1. O visitante entender que o serviço reduz esforço manual e conecta sistemas.
2. A página não prometer eliminação absoluta de retrabalho.
3. O serviço puder começar por um processo.
4. A integração não implicar substituição obrigatória de sistemas.
5. As cinco entregas forem distintas.
6. Benefícios e capacidades técnicas não se confundirem.
7. A abordagem vier antes do detalhamento técnico.
8. Exceções e falhas forem tratadas explicitamente.
9. A FAQ responder dúvidas reais de integração.
10. O CTA não prometer diagnóstico gratuito.
11. O prazo estiver padronizado em um dia útil.
12. A identidade visual estiver preservada.
13. Nenhuma nova seção não autorizada tiver sido criada.
14. A página funcionar em desktop, tablet e mobile.
15. Não houver overflow.
16. Não houver regressão de acessibilidade.
17. Não houver link quebrado.
18. O build terminar sem erros.
19. Os textos estiverem exatamente como especificados.
20. A página permanecer coerente com a Home e a página Sobre.

---

# 32. Checklist final de revisão humana

- [ ] Hero atualizado.
- [ ] Eyebrow sem “Pilar”.
- [ ] CTA sem “diagnóstico”.
- [ ] Microcopy de um dia útil.
- [ ] Cinco cards corretos.
- [ ] Cards antigos removidos.
- [ ] Benefícios atualizados.
- [ ] Abordagem movida antes das capacidades.
- [ ] Três subblocos de abordagem presentes.
- [ ] Oito capacidades técnicas.
- [ ] Seção de confiabilidade consolidada.
- [ ] Oito perguntas respondidas.
- [ ] Nenhuma resposta vazia.
- [ ] CTA final sem 60 minutos.
- [ ] CTA final sem “gratuito”.
- [ ] Header e footer globais coerentes.
- [ ] Metadata atualizada.
- [ ] Mobile validado.
- [ ] Zoom 200% validado.
- [ ] Teclado validado.
- [ ] `prefers-reduced-motion` respeitado.
- [ ] Sem overflow horizontal.
- [ ] Sem textos truncados.
- [ ] Sem erros ortográficos.
- [ ] Lint concluído.
- [ ] Testes concluídos.
- [ ] Build concluído.

---

# 33. Resultado esperado

Ao final, a página deverá comunicar:

> A consultoria ajuda empresas a automatizar processos e integrar sistemas de forma gradual, rastreável e confiável, reduzindo trabalho manual sem retirar controle da operação.

O visitante deverá entender:

- que pode começar por um fluxo específico;
- que seus sistemas atuais podem ser preservados;
- que automação envolve exceções e controle;
- que integrações precisam ser monitoradas;
- que a solução é escolhida depois do entendimento do processo;
- que a primeira conversa verifica aderência;
- que um diagnóstico detalhado pode ser uma entrega comercial.
