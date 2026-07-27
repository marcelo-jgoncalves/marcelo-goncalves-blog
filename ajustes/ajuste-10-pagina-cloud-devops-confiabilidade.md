# Especificação definitiva — Página Cloud, DevOps e Confiabilidade

## 0. Finalidade e precedência

Este documento define todas as alterações necessárias na página individual do serviço de cloud e DevOps.

A implementação deverá ser realizada exatamente conforme esta especificação. A IA engenheira não deverá:

- escolher textos alternativos;
- resumir ou reescrever os textos finais;
- decidir uma nova ordem de blocos;
- criar seções adicionais;
- transformar tecnologias em serviços independentes;
- apresentar Kubernetes, serverless ou qualquer serviço AWS como solução obrigatória;
- ampliar a promessa para multicloud sem base;
- inventar métricas, clientes, certificações ou resultados;
- alterar a identidade visual;
- instalar novas bibliotecas;
- consultar documentos anteriores para decidir entre versões conflitantes.

Em caso de conflito com instruções anteriores referentes a esta página, **este documento prevalece**.

---

# 1. Escopo

## 1.1. Rota atual

```text
/plataforma
```

A rota atual deverá ser preservada nesta tarefa.

A rota comercial definitiva poderá ser alterada futuramente para:

```text
/servicos/cloud-devops-confiabilidade
```

A migração de rota não faz parte deste ajuste.

Quando a rota definitiva for implementada:

- criar redirecionamento permanente da rota antiga;
- atualizar links internos;
- atualizar canonical;
- preservar os parâmetros de consulta;
- validar o sitemap;
- não manter duas páginas indexáveis com o mesmo conteúdo.

## 1.2. Página de referência

```text
https://dsns2wusdrj9z.cloudfront.net/plataforma
```

## 1.3. Incluído

Esta tarefa inclui:

- hero;
- áreas de atuação;
- benefícios;
- abordagem;
- capacidades técnicas;
- segurança, confiabilidade e continuidade;
- perguntas frequentes;
- CTA final;
- metadados;
- dados estruturados, somente se já existirem;
- analytics, somente se já existir infraestrutura;
- responsividade;
- acessibilidade;
- testes;
- critérios de aceite.

## 1.4. Não incluído

Não realizar:

- redesign do cabeçalho;
- redesign do rodapé;
- mudança de paleta;
- troca de tipografia;
- criação de calculadora de custos AWS;
- criação de assessment automático;
- criação de estudo de caso completo;
- criação de diagrama de arquitetura;
- criação de comparação entre provedores;
- criação de tabela de preços;
- criação de formulário na página;
- criação de pacote de sustentação;
- criação de SLA comercial;
- inclusão de clientes ou logos;
- inclusão de depoimentos;
- migração de rota;
- instalação de bibliotecas;
- criação de novas ilustrações;
- alteração das demais páginas de serviço.

## 1.5. Componentes globais

Cabeçalho, rodapé e padrões globais de CTA deverão seguir:

```text
ajuste-07-especificacao-completa-home.md
```

Não duplicar componentes globais dentro desta página.

---

# 2. Objetivo comercial da página

A página deverá posicionar o serviço como:

> Estruturação e modernização de plataformas AWS para aumentar segurança, previsibilidade de entrega, visibilidade operacional, confiabilidade e capacidade de evolução.

O visitante deverá entender que a consultoria pode ajudar quando:

- a arquitetura atual limita o crescimento;
- ambientes são configurados manualmente;
- deploys são arriscados;
- falhas são difíceis de diagnosticar;
- custos aumentam sem visibilidade;
- acessos e permissões são difíceis de controlar;
- aplicações precisam de maior disponibilidade;
- a recuperação após falhas não está definida;
- a empresa precisa migrar ou modernizar workloads;
- a equipe interna precisa de apoio especializado.

A página não deverá comunicar apenas:

> Fazemos AWS, Kubernetes, Terraform e CI/CD.

Tecnologias deverão aparecer como capacidades utilizadas para alcançar resultados operacionais.

---

# 3. Diagnóstico do posicionamento atual

## 3.1. Elementos conceitualmente corretos

Preservar:

- AWS como especialização principal;
- arquitetura em nuvem;
- Kubernetes e containers;
- serverless;
- infraestrutura como código;
- CI/CD;
- observabilidade;
- segurança;
- alta disponibilidade;
- recuperação de desastres;
- FinOps;
- automação;
- evolução contínua;
- apoio a ambientes existentes e híbridos.

## 3.2. Problemas a corrigir

A página atual apresenta ou tende a apresentar os seguintes problemas:

1. “Cloud e DevOps” descreve disciplinas, mas não explicita o resultado de confiabilidade.
2. O nome “Plataforma” na rota e em alguns rótulos é excessivamente genérico.
3. A comunicação pode dar a impressão de que Kubernetes é o destino natural de qualquer modernização.
4. Serverless pode parecer arquitetura padrão.
5. A lista de tecnologias aparece antes da compreensão dos cenários de negócio.
6. Arquitetura, DevOps, observabilidade, segurança e FinOps são apresentados como itens equivalentes, embora tenham funções diferentes.
7. A especialização em AWS é diluída por menções genéricas a outras nuvens.
8. A página não explica claramente que nem toda aplicação precisa ser migrada ou reescrita.
9. O conteúdo técnico pode afastar compradores não técnicos.
10. A página não diferencia modernização, operação e sustentação.
11. O CTA pode prometer diagnóstico gratuito, duração fixa ou prazo de resposta excessivo.
12. A FAQ precisa tratar objeções reais: AWS, Kubernetes, migração, custos, segurança, continuidade e equipe interna.
13. A página deve explicar que redução de custos não é garantida e depende do ambiente.
14. A confiabilidade precisa ser ligada a práticas concretas, não a afirmações genéricas.

---

# 4. Decisão estrutural definitiva

## 4.1. Ordem final

A página deverá seguir esta ordem:

1. Cabeçalho global;
2. Hero;
3. O que estruturamos e modernizamos;
4. Benefícios para a operação;
5. Nossa abordagem;
6. Capacidades técnicas;
7. Segurança, confiabilidade e continuidade;
8. Perguntas frequentes;
9. CTA final;
10. Rodapé global.

## 4.2. Mudanças estruturais autorizadas

Realizar:

1. Manter o hero e substituir integralmente seu conteúdo textual.
2. Organizar a primeira seção em seis áreas de atuação comercialmente distintas.
3. Manter o bloco de benefícios, atualizando sua função e seus textos.
4. Posicionar a abordagem antes da lista técnica.
5. Renomear “Especialidades” para “Capacidades técnicas”.
6. Consolidar segurança, disponibilidade, recuperação, observabilidade e governança em um bloco de controles.
7. Substituir integralmente a FAQ.
8. Simplificar o CTA final.

## 4.3. Seções proibidas

Não criar:

- seção “Por que AWS?”;
- seção “AWS versus Azure”;
- seção de certificações;
- seção de ferramentas;
- seção exclusiva de Kubernetes;
- seção exclusiva de serverless;
- seção exclusiva de FinOps;
- seção de preços;
- seção de clientes;
- seção de depoimentos;
- seção de parceiros;
- seção de diagramas;
- seção de processo adicional;
- formulário incorporado;
- carrossel.

---

# 5. Regras gerais de linguagem

## 5.1. Nome comercial

Usar exatamente:

```text
Cloud, DevOps e Confiabilidade
```

Não alternar na página com:

- Cloud & DevOps;
- Plataforma;
- Infraestrutura;
- Serviços AWS;
- Cloud Engineering;
- Cloud Native;
- Modernização 360°;
- Transformação Cloud.

É permitido utilizar “arquitetura AWS”, “plataformas em nuvem” e “infraestrutura” dentro dos textos.

## 5.2. Promessa central

A página deverá comunicar:

> Estruturamos e modernizamos plataformas AWS para que aplicações sejam entregues com mais segurança, observadas com mais clareza e operadas com menos dependência de procedimentos manuais.

## 5.3. Especialização principal

A comunicação deverá deixar explícito:

```text
AWS é a principal especialização em nuvem da consultoria.
```

Não afirmar:

- domínio equivalente de AWS, Azure e Google Cloud;
- operação multicloud como especialização principal;
- parceria oficial com AWS;
- status de AWS Partner;
- competência oficial AWS;
- suporte a qualquer provedor.

## 5.4. Ambientes híbridos

É permitido afirmar:

> Integrações com ambientes existentes, serviços externos e componentes híbridos são consideradas quando o contexto exige.

Não utilizar “multicloud” no hero.

## 5.5. Ordem narrativa

Em cada seção:

1. problema operacional;
2. impacto;
3. resultado;
4. abordagem;
5. tecnologia.

## 5.6. Termos preferenciais

Preferir:

- previsibilidade;
- confiabilidade;
- segurança;
- observabilidade;
- automação;
- padronização;
- recuperação;
- evolução;
- modernização;
- rastreabilidade;
- ambientes reproduzíveis;
- deploys mais seguros;
- custos visíveis;
- responsabilidade;
- disponibilidade proporcional ao contexto;
- infraestrutura como código;
- operação;
- manutenção;
- transferência de conhecimento.

## 5.7. Termos proibidos

Não utilizar:

- infraestrutura infinitamente escalável;
- zero downtime;
- zero falhas;
- ambiente invulnerável;
- segurança total;
- custos mínimos garantidos;
- redução garantida de custos;
- Kubernetes para tudo;
- serverless first;
- cloud native obrigatório;
- modernização completa;
- migração sem risco;
- qualquer workload;
- qualquer nuvem;
- operação 24x7, caso não exista;
- suporte 24 horas;
- SLA garantido, sem contrato correspondente;
- diagnóstico gratuito;
- chamada gratuita de 60 minutos;
- resposta em até duas horas;
- tecnologia de ponta;
- soluções disruptivas;
- melhor arquitetura;
- arquitetura perfeita.

---

# 6. Hero

## 6.1. Estrutura

Preservar a composição visual atual.

Ordem:

1. eyebrow;
2. H1;
3. subtítulo;
4. CTA;
5. microcopy.

Não adicionar segundo CTA.

Não adicionar logos de AWS.

Não adicionar badges de certificações.

Não adicionar diagrama.

## 6.2. Eyebrow

```text
Cloud, DevOps e Confiabilidade
```

Remover qualquer rótulo equivalente a:

```text
Pilar · Plataforma
```

ou:

```text
Pilar · Cloud
```

## 6.3. H1

```text
Plataformas AWS mais seguras, observáveis e preparadas para evoluir.
```

## 6.4. Subtítulo

```text
Projetamos e modernizamos arquiteturas, ambientes e processos de entrega para reduzir trabalho manual, aumentar a confiabilidade e dar mais visibilidade sobre desempenho, riscos e custos.
```

## 6.5. CTA

```text
Apresentar um desafio de plataforma
```

Destino:

```text
/contato
```

## 6.6. Microcopy

```text
Conversa inicial sem compromisso · Retorno em até um dia útil
```

## 6.7. Semântica

- eyebrow: texto não heading;
- título: único `<h1>`;
- subtítulo: `<p>`;
- CTA: `<a>`;
- microcopy: `<p>` ou `<small>`.

## 6.8. Regras visuais

- preservar fundo;
- preservar alinhamento;
- preservar container;
- não inserir console, terminal ou código como decoração;
- não inserir nuvem genérica;
- não inserir mapa global;
- não alterar a paleta para cores da AWS;
- não usar o laranja da AWS como nova cor de destaque;
- limitar largura do texto;
- não aumentar altura sem necessidade;
- mobile sem texto cortado;
- CTA com estilo primário atual.

---

# 7. Seção — O que estruturamos e modernizamos

## 7.1. Origem

Esta seção substitui a abertura técnica atual equivalente a “O que fazemos”.

## 7.2. Eyebrow

```text
O que fazemos
```

## 7.3. H2

```text
Da arquitetura à operação contínua da plataforma.
```

## 7.4. Introdução

```text
Atuamos nos pontos em que a base tecnológica limita entregas, aumenta riscos ou exige esforço operacional excessivo. A solução pode envolver modernização incremental, automação de ambientes, melhoria da observabilidade ou revisão da arquitetura existente.
```

## 7.5. Quantidade de cards

Usar exatamente seis cards.

## 7.6. Ordem

1. Arquitetura e modernização AWS;
2. Infraestrutura como código;
3. Entrega contínua e automação;
4. Containers e plataformas de execução;
5. Observabilidade e confiabilidade;
6. Segurança, continuidade e custos.

---

# 8. Card 1 — Arquitetura e modernização AWS

## 8.1. Título

```text
Arquitetura e modernização AWS
```

## 8.2. Texto

```text
Projetamos novas arquiteturas e evoluímos ambientes existentes considerando requisitos de segurança, disponibilidade, desempenho, custo e capacidade de manutenção.
```

## 8.3. Tags

```text
Arquitetura AWS
```

```text
Modernização
```

```text
Well-Architected
```

## 8.4. Restrição

Não afirmar que toda arquitetura será migrada para microserviços.

---

# 9. Card 2 — Infraestrutura como código

## 9.1. Título

```text
Infraestrutura como código
```

## 9.2. Texto

```text
Transformamos configurações manuais em definições versionadas, revisáveis e reproduzíveis para reduzir divergências entre ambientes e aumentar a segurança das mudanças.
```

## 9.3. Tags

```text
Terraform
```

```text
OpenTofu
```

```text
CloudFormation
```

## 9.4. Regra

É permitido exibir as três ferramentas porque representam alternativas de capacidade.

Não comunicar que todas serão usadas no mesmo projeto.

---

# 10. Card 3 — Entrega contínua e automação

## 10.1. Título

```text
Entrega contínua e automação
```

## 10.2. Texto

```text
Estruturamos pipelines, validações e estratégias de implantação para tornar mudanças mais previsíveis, rastreáveis e fáceis de interromper ou reverter quando necessário.
```

## 10.3. Tags

```text
CI/CD
```

```text
Quality gates
```

```text
Deploys
```

---

# 11. Card 4 — Containers e plataformas de execução

## 11.1. Título

```text
Containers e plataformas de execução
```

## 11.2. Texto

```text
Avaliamos e implementamos a forma de execução mais adequada para cada workload, incluindo containers, serviços gerenciados e arquiteturas serverless quando elas reduzem complexidade operacional.
```

## 11.3. Tags

```text
ECS
```

```text
EKS
```

```text
Serverless
```

## 11.4. Restrição obrigatória

O texto deve deixar claro que:

- Kubernetes não é obrigatório;
- serverless não é obrigatório;
- a escolha depende do workload;
- serviço gerenciado pode ser preferível.

Não usar:

```text
Arquiteturas modernas com Kubernetes
```

como promessa universal.

---

# 12. Card 5 — Observabilidade e confiabilidade

## 12.1. Título

```text
Observabilidade e confiabilidade
```

## 12.2. Texto

```text
Organizamos métricas, logs, traces, dashboards e alertas para reduzir o tempo de detecção, facilitar diagnósticos e acompanhar o comportamento real das aplicações.
```

## 12.3. Tags

```text
Métricas
```

```text
Logs e traces
```

```text
Alertas
```

---

# 13. Card 6 — Segurança, continuidade e custos

## 13.1. Título

```text
Segurança, continuidade e custos
```

## 13.2. Texto

```text
Revisamos identidades, permissões, backups, recuperação de desastres e consumo de recursos para reduzir riscos e tornar decisões de continuidade e custo mais explícitas.
```

## 13.3. Tags

```text
IAM
```

```text
Recuperação
```

```text
FinOps
```

## 13.4. Regras dos cards

- manter componente visual existente;
- seis cards;
- exatamente três tags;
- não incluir listas adicionais;
- não criar CTA por card;
- não adicionar logos;
- não adicionar preços;
- altura flexível;
- desktop em três colunas, se o grid atual suportar;
- tablet em duas colunas;
- mobile em uma coluna;
- ordem preservada;
- sem carrossel.

---

# 14. Seção — Benefícios para a operação

## 14.1. Eyebrow

```text
Benefícios
```

## 14.2. H2

```text
Menos improviso na infraestrutura. Mais previsibilidade para entregar e operar.
```

## 14.3. Introdução

```text
Os resultados variam conforme a arquitetura, a maturidade da equipe e as restrições do ambiente. O objetivo é reduzir riscos operacionais e tornar mudanças, falhas e custos mais visíveis.
```

## 14.4. Quantidade

Usar exatamente oito benefícios.

## 14.5. Benefícios

```text
Ambientes reproduzíveis e versionados
```

```text
Deploys mais seguros e rastreáveis
```

```text
Detecção mais rápida de falhas
```

```text
Diagnósticos apoiados por métricas, logs e traces
```

```text
Permissões e responsabilidades mais claras
```

```text
Maior visibilidade sobre custos e capacidade
```

```text
Recuperação planejada para cenários de falha
```

```text
Menor dependência de procedimentos manuais
```

## 14.6. Regras

- não prometer disponibilidade total;
- não prometer redução percentual;
- não afirmar “escalabilidade automática” como benefício universal;
- preservar componente;
- sem métricas;
- sem textos longos;
- ícones decorativos com `aria-hidden="true"`.

---

# 15. Seção — Nossa abordagem

## 15.1. Ordem

Posicionar após os benefícios e antes das capacidades técnicas.

## 15.2. Eyebrow

```text
Nossa abordagem
```

## 15.3. H2

```text
A arquitetura deve responder ao contexto, não ao modismo.
```

## 15.4. Texto principal

```text
Antes de propor serviços ou ferramentas, entendemos os workloads, as dependências, os riscos, a frequência de mudanças, a capacidade da equipe e os objetivos de negócio. A arquitetura é escolhida a partir dessas condições.
```

## 15.5. Subbloco 1

### Rótulo

```text
AWS como especialização principal
```

### H3

```text
Profundidade onde ela gera decisões melhores.
```

### Texto

```text
A principal especialização em nuvem da consultoria é AWS. Integrações com ambientes existentes, serviços externos e componentes híbridos são consideradas quando o cenário exige.
```

## 15.6. Subbloco 2

### Rótulo

```text
Modernização incremental
```

### H3

```text
Evoluir sem reescrever tudo.
```

### Texto

```text
Sempre que possível, priorizamos mudanças graduais: automatizar um ambiente, melhorar um pipeline, adicionar observabilidade ou modernizar um componente antes de comprometer toda a plataforma.
```

## 15.7. Subbloco 3

### Rótulo

```text
Operação desde o projeto
```

### H3

```text
Construir considerando quem vai manter.
```

### Texto

```text
Documentação, automação, observabilidade, segurança e transferência de conhecimento fazem parte da solução. O objetivo é evitar uma arquitetura que funcione apenas enquanto quem a criou está presente.
```

## 15.8. Regras

- reutilizar o componente existente;
- não criar framework proprietário;
- não criar diagrama;
- não listar serviços AWS;
- não apresentar multicloud como diferencial;
- não adicionar CTA nesta seção;
- mobile em uma coluna.

---

# 16. Seção — Capacidades técnicas

## 16.1. Origem

Esta seção substitui “Especialidades”.

## 16.2. Eyebrow

```text
Capacidades técnicas
```

## 16.3. H2

```text
Da fundação da conta à operação das aplicações.
```

## 16.4. Introdução

```text
As capacidades são combinadas conforme o estágio da plataforma e o problema que precisa ser resolvido. Nenhum projeto precisa utilizar todas elas.
```

## 16.5. Quantidade

Usar exatamente dez itens.

## 16.6. Itens

```text
Arquitetura AWS e Well-Architected Framework
```

```text
AWS Organizations, governança e ambientes multi-conta
```

```text
IAM, identidade e princípio do menor privilégio
```

```text
Terraform, OpenTofu e CloudFormation
```

```text
Docker, ECS, EKS e Kubernetes
```

```text
Lambda, API Gateway e arquiteturas serverless
```

```text
GitHub Actions, GitLab CI, Jenkins e CodePipeline
```

```text
CloudWatch, X-Ray, Prometheus, Grafana e Splunk
```

```text
Alta disponibilidade, backup e recuperação de desastres
```

```text
FinOps, dimensionamento e otimização de custos
```

## 16.7. Regras

- itens são capacidades, não promessas de uso;
- não transformar em links;
- não criar subpáginas;
- não adicionar logos;
- não adicionar descrição individual extensa;
- permitir quebra de linha;
- não usar fonte reduzida para encaixar;
- mobile em uma coluna ou duas somente se legível.

## 16.8. Observação sobre ferramentas

Manter nomes de ferramentas somente nesta seção técnica.

Não repetir listas completas no hero, benefícios ou CTA.

---

# 17. Seção — Segurança, confiabilidade e continuidade

## 17.1. Função

Consolidar controles e critérios de operação.

## 17.2. Eyebrow

```text
Segurança e confiabilidade
```

## 17.3. H2

```text
Falhas, mudanças e recuperação precisam ser tratadas antes de se tornarem incidentes.
```

## 17.4. Texto

```text
A confiabilidade não depende de um único serviço. Ela resulta da combinação entre arquitetura, automação, visibilidade, segurança e procedimentos testados para responder quando algo não funciona como esperado.
```

## 17.5. Lista

Usar exatamente oito itens:

```text
Infraestrutura versionada e revisada
```

```text
Segregação de ambientes e responsabilidades
```

```text
Acessos temporários e menor privilégio
```

```text
Validações e bloqueios antes do deploy
```

```text
Métricas, logs, traces e alertas acionáveis
```

```text
Estratégias de rollback e recuperação
```

```text
Backups e restauração testados conforme a criticidade
```

```text
Documentação e transferência de conhecimento
```

## 17.6. Encerramento

```text
O nível de redundância, disponibilidade e recuperação deve ser proporcional ao impacto da indisponibilidade e ao investimento que a operação consegue sustentar.
```

## 17.7. Regras

- reutilizar checklist atual;
- não adicionar selo “100% seguro”;
- não prometer zero downtime;
- não afirmar backups testados se isso não fizer parte do escopo;
- o texto deverá usar “conforme a criticidade”;
- não adicionar SLA;
- não adicionar RTO ou RPO genéricos;
- não adicionar ícone de escudo dominante.

---

# 18. Perguntas frequentes

## 18.1. Estrutura

Preservar o accordion atual.

Substituir todas as perguntas e respostas.

## 18.2. Eyebrow

```text
Perguntas frequentes
```

## 18.3. H2

```text
Dúvidas antes de modernizar uma plataforma
```

## 18.4. Quantidade

Usar exatamente dez perguntas.

## 18.5. Pergunta 1

### Pergunta

```text
A consultoria trabalha apenas com AWS?
```

### Resposta

```text
AWS é a principal especialização em nuvem da consultoria. Também avaliamos integrações com ambientes existentes, serviços externos e componentes híbridos quando eles fazem parte do contexto da empresa.
```

## 18.6. Pergunta 2

### Pergunta

```text
Precisamos migrar toda a aplicação para a nuvem?
```

### Resposta

```text
Não. A modernização pode começar por um ambiente, pipeline, serviço ou problema específico. A migração completa só deve ser considerada quando houver justificativa técnica, operacional e econômica.
```

## 18.7. Pergunta 3

### Pergunta

```text
Toda aplicação precisa de Kubernetes?
```

### Resposta

```text
Não. Kubernetes é adequado para alguns cenários, mas adiciona responsabilidades operacionais. ECS, serviços gerenciados, máquinas virtuais ou arquiteturas serverless podem ser opções mais simples, dependendo do workload e da equipe.
```

## 18.8. Pergunta 4

### Pergunta

```text
Serverless é sempre a opção de menor custo?
```

### Resposta

```text
Não. O custo depende do volume, do padrão de uso, da duração das execuções, da transferência de dados e de outros serviços envolvidos. Serverless deve ser escolhido quando seus benefícios técnicos e operacionais compensam suas limitações.
```

## 18.9. Pergunta 5

### Pergunta

```text
É possível melhorar a plataforma sem reescrever a aplicação?
```

### Resposta

```text
Sim. Muitas melhorias podem ser realizadas na infraestrutura, nos pipelines, na observabilidade, na segurança ou em componentes específicos, preservando a maior parte da aplicação existente.
```

## 18.10. Pergunta 6

### Pergunta

```text
Vocês conseguem reduzir nossos custos de AWS?
```

### Resposta

```text
Podemos identificar desperdícios, revisar dimensionamento, modelos de compra, armazenamento e padrões de uso. A economia possível depende do ambiente e não pode ser garantida antes da análise.
```

## 18.11. Pergunta 7

### Pergunta

```text
Como a segurança é tratada?
```

### Resposta

```text
Avaliamos identidade, permissões, segregação de ambientes, proteção de dados, exposição de serviços, trilhas de auditoria e controles de implantação. As medidas são definidas conforme o risco e a responsabilidade compartilhada entre AWS, aplicação e operação.
```

## 18.12. Pergunta 8

### Pergunta

```text
Vocês trabalham com a equipe interna da empresa?
```

### Resposta

```text
Sim. Podemos atuar em conjunto com desenvolvedores, infraestrutura, segurança e produto, contribuindo com arquitetura, implementação, revisão técnica e transferência de conhecimento.
```

## 18.13. Pergunta 9

### Pergunta

```text
Como funciona recuperação de desastres?
```

### Resposta

```text
Primeiro definimos quais falhas precisam ser cobertas, quanto tempo de indisponibilidade é aceitável e quanto dado pode ser perdido. A partir disso, projetamos backups, replicação, procedimentos e testes proporcionais à criticidade.
```

## 18.14. Pergunta 10

### Pergunta

```text
Existe acompanhamento depois da entrega?
```

### Resposta

```text
O modelo de sustentação é definido conforme a solução. Pode incluir acompanhamento inicial, observabilidade, correções, evolução, apoio à operação ou transferência estruturada para a equipe do cliente.
```

## 18.15. Regras do accordion

- botão semântico;
- acessível por teclado;
- `aria-expanded`;
- `aria-controls`;
- foco visível;
- respostas presentes no HTML;
- respeitar `prefers-reduced-motion`;
- nenhuma pergunta sem resposta;
- não usar hover como único mecanismo;
- manter comportamento atual de uma ou várias perguntas abertas.

---

# 19. CTA final

## 19.1. Estrutura

Preservar o componente visual global.

Substituir integralmente os textos locais.

## 19.2. Eyebrow

```text
Vamos começar
```

## 19.3. H2

```text
Qual parte da sua plataforma está limitando a operação?
```

## 19.4. Parágrafo

```text
Conte o que está acontecendo hoje: deploys arriscados, falhas difíceis de diagnosticar, custos crescentes, ambientes manuais ou uma arquitetura que já não acompanha a aplicação.
```

## 19.5. Lista

```text
Arquitetura que precisa evoluir sem interromper o negócio
```

```text
Ambientes e deploys que dependem de procedimentos manuais
```

```text
Aplicações que precisam ganhar visibilidade, segurança ou confiabilidade
```

## 19.6. Badge

```text
Disponível para novos projetos
```

Exibir somente se a configuração global indicar disponibilidade.

## 19.7. Card de ação

### Rótulo

```text
Primeira conversa
```

### H3

```text
Vamos entender o ambiente e avaliar o próximo passo.
```

### Texto

```text
A conversa inicial serve para verificar a aderência e esclarecer os primeiros caminhos. Análises que exigem levantamento, acesso ao ambiente ou recomendações detalhadas podem ser estruturadas como um diagnóstico comercial.
```

### CTA

```text
Apresentar um desafio de plataforma
```

Destino:

```text
/contato
```

### Microcopy

```text
Sem compromisso · Retorno em até um dia útil
```

## 19.8. Remover

Remover qualquer texto equivalente a:

- agendar chamada gratuita de 60 minutos;
- diagnóstico inicial gratuito;
- plano de ação gratuito;
- resposta máxima de duas horas;
- sem custo;
- redução garantida de custos;
- análise completa na primeira conversa;
- auditoria gratuita;
- assessment gratuito.

## 19.9. Restrição

Não informar duração fixa.

Não prometer acesso técnico na primeira conversa.

Não solicitar credenciais pelo CTA.

Não prometer diagnóstico antes de conhecer o escopo.

---

# 20. Cabeçalho e rodapé

## 20.1. Cabeçalho

Seguir a especificação global.

CTA:

```text
Apresentar um desafio
```

Destino:

```text
/contato
```

## 20.2. Rodapé

Na lista de especialidades, usar:

```text
Cloud, DevOps e Confiabilidade
```

Destino temporário:

```text
/plataforma
```

Não alterar o componente localmente.

---

# 21. Hierarquia de headings

Usar:

- hero: `<h1>`;
- O que fazemos: `<h2>`;
- cards: `<h3>`;
- Benefícios: `<h2>`;
- Nossa abordagem: `<h2>`;
- subblocos: `<h3>`;
- Capacidades técnicas: `<h2>`;
- Segurança e confiabilidade: `<h2>`;
- FAQ: `<h2>`;
- CTA final: `<h2>`;
- card do CTA: `<h3>`.

Não pular níveis.

Não usar heading apenas por estilo.

---

# 22. IDs das seções

Usar:

```text
atuacao
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

# 23. Responsividade

## 23.1. Regras gerais

- usar breakpoints existentes;
- não criar carrossel;
- não usar largura fixa;
- não usar altura fixa;
- não reduzir excessivamente a fonte;
- não permitir overflow horizontal.

## 23.2. Hero

Desktop:

- manter composição atual;
- limitar largura do texto.

Mobile:

- CTA com largura adequada;
- H1 sem `nowrap`;
- microcopy completa;
- sem corte.

## 23.3. Cards de atuação

Desktop:

- três colunas;
- duas linhas com três cards;
- alturas visualmente equilibradas.

Tablet:

- duas colunas;
- três linhas.

Mobile:

- uma coluna;
- ordem preservada.

## 23.4. Benefícios

- desktop conforme componente atual;
- tablet em duas colunas;
- mobile em uma coluna ou duas somente se houver legibilidade;
- textos completos.

## 23.5. Abordagem

Desktop:

- três subblocos lado a lado quando houver largura.

Tablet/mobile:

- empilhados;
- ordem preservada;
- sem rolagem horizontal.

## 23.6. Capacidades técnicas

- evitar cards estreitos;
- permitir quebra de nomes longos;
- mobile em uma coluna;
- não truncar ferramentas.

## 23.7. Confiabilidade

- desktop em duas colunas, se o componente permitir;
- mobile em uma coluna;
- checks alinhados.

## 23.8. FAQ

- largura total do conteúdo;
- botão com área de toque adequada;
- ícone sem sobrepor texto;
- pergunta com quebra de linha.

## 23.9. CTA

- desktop conforme componente global;
- mobile em uma coluna;
- card de ação depois do texto principal.

## 23.10. Zoom

Validar em 200%.

Nenhum texto pode desaparecer ou ficar sobreposto.

---

# 24. Acessibilidade

## 24.1. Contraste

Manter WCAG AA para:

- textos;
- tags;
- botões;
- FAQ;
- microcopy;
- checks;
- foco.

## 24.2. Teclado

- links acessíveis por Tab;
- FAQ acessível por Tab;
- Enter e Espaço nos accordions;
- foco visível;
- ordem coerente;
- sem armadilhas.

## 24.3. Movimento

Respeitar:

```css
prefers-reduced-motion: reduce
```

## 24.4. Ícones

- decorativos: `aria-hidden="true"`;
- não depender de ícones;
- não utilizar emojis;
- não utilizar logos sem necessidade.

## 24.5. Semântica

- listas com `<ul>` e `<li>`;
- CTAs com `<a>`;
- accordion com `<button>`;
- não usar `<div onClick>`;
- não colocar texto essencial em pseudo-elementos.

---

# 25. Metadados

## 25.1. Title

```text
Cloud, DevOps e Confiabilidade AWS | Marcelo Gonçalves
```

## 25.2. Description

```text
Arquitetura AWS, infraestrutura como código, CI/CD, containers, observabilidade, segurança, recuperação de desastres e otimização de custos.
```

## 25.3. Open Graph

Usar o mesmo title e description.

Preservar imagem atual, se adequada.

Não criar imagem.

## 25.4. Canonical

Manter:

```text
/plataforma
```

até a migração definitiva.

---

# 26. Dados estruturados

Somente atualizar se já houver JSON-LD.

É permitido atualizar um objeto `Service`:

```text
name: Cloud, DevOps e Confiabilidade
```

```text
serviceType: Arquitetura e modernização de plataformas AWS
```

Não adicionar:

- preços;
- avaliações;
- ofertas;
- SLA;
- disponibilidade 24x7;
- certificação de parceiro;
- clientes;
- áreas não verificadas.

Não instalar biblioteca.

---

# 27. Analytics

Somente se já existir helper.

Eventos:

```text
cloud_hero_cta_click
```

```text
cloud_faq_toggle
```

```text
cloud_final_cta_click
```

No FAQ, usar identificador estável.

Não enviar dados pessoais.

Não instalar provedor.

---

# 28. Implementação técnica

## 28.1. Reutilizar

- componentes existentes;
- cards;
- tags;
- benefícios;
- abordagem;
- checklist;
- FAQ;
- CTA;
- header;
- footer;
- containers;
- tokens.

## 28.2. Dados

Se o conteúdo for data-driven:

- atualizar fonte original;
- remover itens antigos;
- preservar tipagem;
- usar IDs estáveis;
- não duplicar arrays;
- não usar índice como chave quando houver ID.

## 28.3. Não instalar

- biblioteca de diagramas;
- biblioteca de badges;
- biblioteca de ícones;
- biblioteca de FAQ;
- carrossel;
- slider;
- calculadora;
- SDK AWS no frontend;
- pacote de estimativa de custos.

## 28.4. Remoção

Conteúdo removido deve deixar de ser renderizado.

Não ocultar com CSS.

---

# 29. Elementos proibidos

A IA engenheira não deverá:

- criar diagrama de arquitetura;
- criar calculadora AWS;
- adicionar logos de serviços AWS;
- alterar a paleta para laranja;
- adicionar selo AWS Partner;
- inventar parceria;
- inventar número de contas gerenciadas;
- inventar disponibilidade;
- inventar economia;
- inventar SLA;
- inventar clientes;
- criar seção multicloud;
- afirmar especialização equivalente em Azure ou GCP;
- apresentar Kubernetes como padrão;
- apresentar serverless como padrão;
- prometer zero downtime;
- prometer redução de custos;
- adicionar formulário;
- adicionar chat;
- adicionar WhatsApp;
- adicionar chamada de 60 minutos;
- prometer diagnóstico gratuito;
- criar seção de preços;
- criar novas rotas;
- alterar o header localmente;
- alterar o footer localmente;
- reescrever os textos finais.

---

# 30. Ordem de implementação

Executar:

1. Identificar o componente da rota `/plataforma`.
2. Identificar fontes de dados e componentes compartilhados.
3. Atualizar hero.
4. Atualizar seis cards de atuação.
5. Atualizar benefícios.
6. Mover e atualizar abordagem.
7. Atualizar capacidades técnicas.
8. Consolidar segurança, confiabilidade e continuidade.
9. Substituir FAQ.
10. Atualizar CTA final.
11. Aplicar header e footer globais.
12. Atualizar metadados.
13. Atualizar JSON-LD somente se existir.
14. Ajustar responsividade.
15. Validar acessibilidade.
16. Executar lint.
17. Executar testes.
18. Executar build.
19. Fazer revisão visual.
20. Validar links.

---

# 31. Testes obrigatórios

## 31.1. Conteúdo presente

Verificar:

```text
Cloud, DevOps e Confiabilidade
```

```text
Plataformas AWS mais seguras, observáveis e preparadas para evoluir.
```

```text
Arquitetura e modernização AWS
```

```text
Infraestrutura como código
```

```text
Entrega contínua e automação
```

```text
Containers e plataformas de execução
```

```text
Observabilidade e confiabilidade
```

```text
Segurança, continuidade e custos
```

```text
A arquitetura deve responder ao contexto, não ao modismo.
```

```text
Dúvidas antes de modernizar uma plataforma
```

```text
Apresentar um desafio de plataforma
```

## 31.2. Conteúdo ausente

Verificar que não existe:

```text
Pilar · Plataforma
```

```text
Pilar · Cloud
```

```text
Kubernetes para tudo
```

```text
arquitetura leve (Serverless)
```

```text
diagnóstico inicial gratuito
```

```text
Chamada inicial 60 min
```

```text
Tempo de resposta max. 2h
```

```text
zero downtime
```

```text
redução garantida
```

## 31.3. Links

Validar:

- hero CTA → `/contato`;
- CTA final → `/contato`;
- header CTA → `/contato`;
- logo → `/`;
- links do menu;
- links do footer.

## 31.4. FAQ

- dez perguntas;
- dez respostas;
- teclado;
- `aria-expanded`;
- foco;
- abertura e fechamento;
- sem respostas vazias.

## 31.5. Responsividade

Validar:

- 360px;
- 390px;
- 768px;
- 1024px;
- 1366px;
- 1440px.

Verificar:

- sem overflow;
- cards sem corte;
- tags com quebra;
- títulos longos legíveis;
- FAQ sem sobreposição;
- CTA sem corte;
- nenhuma coluna excessivamente estreita.

## 31.6. Zoom

Validar 100% e 200%.

## 31.7. Build

- lint sem erros;
- testes sem erros;
- build de produção sem erros;
- rota funcional;
- nenhuma regressão nas outras páginas.

---

# 32. Critérios de aceite por seção

## 32.1. Hero

- AWS explícita;
- confiabilidade explícita;
- sem tecnologias em lista;
- sem promessas absolutas;
- CTA padronizado.

## 32.2. Atuação

- seis cards;
- cards comercialmente distintos;
- Kubernetes e serverless dentro de contexto;
- segurança, continuidade e custos consolidados.

## 32.3. Benefícios

- oito itens;
- foco operacional;
- sem métricas inventadas;
- sem disponibilidade garantida.

## 32.4. Abordagem

- AWS como principal especialização;
- modernização incremental;
- operação considerada desde o projeto;
- sem multicloud genérico.

## 32.5. Capacidades

- dez itens;
- nomes técnicos;
- nenhuma obrigação de uso;
- sem logos.

## 32.6. Confiabilidade

- infraestrutura versionada;
- identidade;
- deploy;
- observabilidade;
- rollback;
- backup;
- documentação.

## 32.7. FAQ

- AWS;
- migração;
- Kubernetes;
- serverless;
- modernização;
- custos;
- segurança;
- equipe interna;
- DR;
- sustentação.

## 32.8. CTA

- sem chamada gratuita;
- sem diagnóstico gratuito;
- sem prazo de duas horas;
- sem promessa de acesso imediato;
- CTA correto.

---

# 33. Critérios de aceite da página completa

A implementação será aceita somente quando:

1. A página apresentar AWS como principal especialização.
2. A página não tentar parecer multicloud.
3. Cloud, DevOps e confiabilidade estiverem conectados a resultados operacionais.
4. Kubernetes não estiver apresentado como solução padrão.
5. Serverless não estiver apresentado como solução padrão.
6. Modernização incremental estiver explícita.
7. A operação e a manutenção forem consideradas parte da arquitetura.
8. Entregas e capacidades técnicas estiverem separadas.
9. Segurança e continuidade estiverem descritas de forma concreta.
10. Custos forem tratados sem garantia de economia.
11. A FAQ responder objeções reais.
12. O CTA não prometer diagnóstico gratuito.
13. O prazo estiver padronizado em um dia útil.
14. A estrutura visual existente estiver preservada.
15. Não houver seções não autorizadas.
16. Não houver logos ou badges inventados.
17. Não houver métricas inventadas.
18. A página funcionar em desktop, tablet e mobile.
19. Não houver regressão de acessibilidade.
20. Build e testes terminarem sem erros.
21. Os textos estiverem exatamente como especificados.
22. A página estiver coerente com Home, Sobre e Automação.

---

# 34. Checklist final de revisão humana

- [ ] Hero atualizado.
- [ ] Eyebrow correto.
- [ ] AWS mencionada no H1.
- [ ] CTA correto.
- [ ] Seis cards presentes.
- [ ] Kubernetes contextualizado.
- [ ] Serverless contextualizado.
- [ ] Oito benefícios.
- [ ] Abordagem antes das capacidades.
- [ ] AWS como especialização principal.
- [ ] Modernização incremental explícita.
- [ ] Dez capacidades técnicas.
- [ ] Seção de segurança e confiabilidade consolidada.
- [ ] Dez FAQs respondidas.
- [ ] Nenhuma resposta vazia.
- [ ] CTA sem 60 minutos.
- [ ] CTA sem gratuito.
- [ ] Prazo de um dia útil.
- [ ] Nenhum logo AWS adicionado.
- [ ] Nenhum selo de parceiro adicionado.
- [ ] Nenhuma promessa de zero downtime.
- [ ] Nenhuma promessa de economia.
- [ ] Header e footer globais coerentes.
- [ ] Metadata atualizada.
- [ ] Sem overflow horizontal.
- [ ] Mobile validado.
- [ ] Zoom 200% validado.
- [ ] Teclado validado.
- [ ] `prefers-reduced-motion` respeitado.
- [ ] Lint concluído.
- [ ] Testes concluídos.
- [ ] Build concluído.

---

# 35. Resultado esperado

Ao final, a página deverá comunicar:

> A consultoria projeta e moderniza plataformas AWS com automação, observabilidade, segurança e critérios de confiabilidade proporcionais ao contexto, sem impor Kubernetes, serverless ou uma reescrita completa.

O visitante deverá entender:

- que AWS é a principal especialização;
- que a arquitetura será escolhida conforme o workload;
- que é possível modernizar gradualmente;
- que infraestrutura como código reduz divergências e procedimentos manuais;
- que CI/CD precisa incluir validação e possibilidade de recuperação;
- que observabilidade apoia operação e diagnóstico;
- que custos precisam ser analisados sem promessa antecipada;
- que segurança e continuidade dependem da criticidade;
- que a primeira conversa avalia aderência;
- que um diagnóstico detalhado pode ser uma entrega comercial.
