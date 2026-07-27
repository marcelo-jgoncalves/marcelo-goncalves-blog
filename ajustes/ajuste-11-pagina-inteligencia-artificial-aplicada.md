# Especificação definitiva — Página Inteligência Artificial Aplicada

## 0. Finalidade e precedência

Este documento define, de forma exaustiva e diretamente executável, todas as alterações necessárias na página individual do serviço de inteligência artificial.

A IA engenheira deverá implementar exatamente o que está especificado, sem:

- escolher textos alternativos;
- resumir os textos finais;
- criar novas promessas;
- inventar casos, clientes, métricas ou resultados;
- transformar agentes autônomos no centro da oferta;
- apresentar inteligência artificial como solução para qualquer problema;
- prometer substituição de pessoas;
- prometer ausência de erros;
- prometer proteção absoluta de dados;
- escolher modelos, provedores ou arquiteturas por conta própria;
- criar novas seções além das autorizadas;
- alterar a identidade visual;
- consultar documentos anteriores para decidir entre versões conflitantes.

Em caso de divergência com qualquer orientação anterior sobre esta página, **este documento prevalece**.

---

# 1. Escopo

## 1.1. Rota atual

```text
/inteligencia-artificial
```

Preservar a rota nesta tarefa.

A futura arquitetura poderá utilizar:

```text
/servicos/inteligencia-artificial
```

A migração de rota não faz parte desta implementação.

Quando a rota definitiva for adotada:

- criar redirecionamento permanente da rota atual;
- atualizar canonical;
- atualizar sitemap;
- atualizar links internos;
- preservar parâmetros de consulta;
- impedir a indexação duplicada.

## 1.2. Página analisada

```text
https://dsns2wusdrj9z.cloudfront.net/inteligencia-artificial
```

Data de referência:

```text
27 de julho de 2026
```

## 1.3. Incluído

Esta tarefa inclui:

- hero;
- tipos de solução;
- casos de aplicação;
- benefícios;
- abordagem;
- governança, segurança e controle;
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
- criação de chatbot demonstrativo;
- criação de playground de IA;
- criação de simulador;
- criação de formulário dentro da página;
- criação de calculadora de retorno;
- criação de estudo de caso;
- inclusão de depoimentos;
- inclusão de logos de modelos ou provedores;
- criação de preços;
- comparação pública entre modelos;
- criação de benchmark;
- criação de política de IA completa;
- revisão de documentos legais;
- migração de rota;
- instalação de novas bibliotecas;
- geração de imagens;
- alteração das demais páginas de serviço.

## 1.5. Componentes globais

Cabeçalho, rodapé e padrões globais de CTA deverão seguir:

```text
ajuste-07-especificacao-completa-home.md
```

Não duplicar header ou footer dentro desta página.

---

# 2. Objetivo comercial da página

A página deverá posicionar o serviço como:

> Aplicação de inteligência artificial a processos, documentos, conhecimento e sistemas empresariais, com objetivos mensuráveis, acesso controlado, avaliação contínua e supervisão humana quando necessária.

O visitante deverá entender que a consultoria pode ajudar quando:

- informações importantes estão dispersas em documentos;
- equipes repetem consultas semelhantes;
- o atendimento depende de conhecimento difícil de localizar;
- documentos precisam ser lidos, classificados ou resumidos;
- solicitações precisam ser triadas;
- relatórios consomem tempo excessivo;
- sistemas existentes podem ganhar novas capacidades;
- algumas etapas operacionais podem receber apoio inteligente;
- agentes podem executar ações limitadas por regras e permissões;
- a empresa quer avaliar IA sem transformar um experimento em risco operacional.

A página não deverá comunicar apenas:

> Desenvolvemos chatbots, automações e agentes autônomos.

Ela deverá explicar:

- qual problema será resolvido;
- que dados serão utilizados;
- como a qualidade será avaliada;
- quais ações exigirão aprovação;
- como falhas serão tratadas;
- como a solução será monitorada;
- como custos e uso serão controlados;
- como a IA será integrada à operação existente.

---

# 3. Diagnóstico da página atual

## 3.1. Elementos conceitualmente válidos

Preservar:

- IA aplicada a processos reais;
- agentes;
- assistentes;
- automação combinada com IA;
- integração a sistemas existentes;
- processamento de documentos;
- assistente corporativo;
- atendimento;
- pesquisa em documentos;
- extração de informações;
- geração assistida de conteúdo;
- apoio às equipes;
- produtividade;
- melhor uso do conhecimento;
- integração gradual;
- primeira conversa;
- FAQ.

## 3.2. Problemas a corrigir

A página atual apresenta:

1. Rótulo “Pilar · Inteligência”, excessivamente abstrato.
2. Headline genérica sobre “resultados para o negócio”.
3. Promessa de redução de custos sem contexto.
4. Agentes descritos como capazes de operar com “mínima intervenção humana”.
5. Automação descrita como tomada de decisão e execução autônoma.
6. Tags como “Decisão Autônoma”, que ampliam riscos e expectativas.
7. Sobreposição entre “Agentes de IA” e “Automação Inteligente”.
8. Sobreposição entre “O que fazemos” e “Casos de aplicação”.
9. Atendimento descrito sem transferência para humanos.
10. Processamento de documentos descrito como interpretação automática sem mencionar validação.
11. Geração de conteúdo apresentada sem revisão.
12. Benefícios genéricos e não condicionados ao contexto.
13. Ausência de bloco específico sobre qualidade, segurança, controle e governança.
14. Abordagem reduzida a uma pergunta genérica sobre valor.
15. Objetivo centrado apenas em liberar pessoas de tarefas repetitivas.
16. FAQ incompleta: três perguntas sem resposta.
17. CTA prometendo chamada gratuita de 60 minutos.
18. CTA prometendo diagnóstico e plano de ação gratuitos.
19. Prazo de resposta máximo de duas horas.
20. Ausência de explicação sobre dados, privacidade, alucinações, avaliação, modelos, custos, permissões e manutenção.
21. Ausência de diferenciação entre assistente informativo e agente com capacidade de ação.
22. Ausência de explicação de que IA nem sempre é necessária.

---

# 4. Decisão estrutural definitiva

## 4.1. Ordem final dos blocos

A página deverá seguir exatamente:

1. Cabeçalho global;
2. Hero;
3. Soluções que desenvolvemos;
4. Casos de aplicação;
5. Benefícios para a operação;
6. Nossa abordagem;
7. Governança, segurança e controle;
8. Perguntas frequentes;
9. CTA final;
10. Rodapé global.

## 4.2. Alterações estruturais autorizadas

Realizar:

1. Manter o hero e substituir integralmente os textos.
2. Manter cinco cards em “O que fazemos”, redefinindo cada categoria.
3. Manter seis casos de aplicação, removendo sobreposição e autonomia irrestrita.
4. Manter oito benefícios, com linguagem condicionada ao contexto.
5. Expandir “Nossa abordagem” para cinco etapas claras.
6. Substituir o bloco “Objetivo” por “Governança, segurança e controle”.
7. Substituir integralmente a FAQ.
8. Simplificar o CTA final.

## 4.3. Seções que não devem ser criadas

Não criar:

- seção “Modelos que usamos”;
- seção “Nossos provedores”;
- seção de ferramentas;
- seção de preços;
- seção “IA generativa” separada;
- seção exclusiva de agentes;
- seção exclusiva de chatbot;
- seção de comparação humano versus IA;
- seção de benchmark;
- seção de depoimentos;
- seção de logos;
- seção de clientes;
- seção de estudos de caso;
- formulário incorporado;
- demonstração interativa;
- carrossel.

---

# 5. Regras gerais de linguagem

## 5.1. Nome comercial

Usar exatamente:

```text
Inteligência Artificial Aplicada
```

Não alternar com:

- Inteligência Artificial;
- Pilar Inteligência;
- IA empresarial;
- IA autônoma;
- IA 360°;
- Automação cognitiva;
- Soluções inteligentes;
- IA de ponta;
- IA revolucionária.

É permitido utilizar “IA” após o nome completo ter sido apresentado.

## 5.2. Promessa central

A página deverá comunicar:

> Integramos inteligência artificial a processos, documentos e sistemas para ampliar produtividade, acesso à informação e capacidade de decisão, com limites, métricas e supervisão definidos.

## 5.3. Diferenciação principal

Usar como orientação interna:

> IA integrada à operação, não um chatbot isolado.

Essa frase poderá aparecer uma única vez na página, no bloco da abordagem.

## 5.4. Ordem narrativa

Em cada seção:

1. problema;
2. impacto;
3. função da IA;
4. controle;
5. resultado;
6. tecnologia, somente quando necessária.

## 5.5. Vocabulário preferencial

Preferir:

- apoiar;
- ampliar;
- classificar;
- extrair;
- resumir;
- pesquisar;
- sugerir;
- triar;
- validar;
- revisar;
- integrar;
- controlar;
- avaliar;
- monitorar;
- supervisionar;
- registrar;
- limitar;
- autorizar;
- transferência para atendimento humano;
- ponto de aprovação;
- ação controlada;
- resposta fundamentada;
- contexto;
- fonte;
- critério de qualidade;
- fallback;
- incerteza;
- custo por tarefa;
- uso responsável;
- capacidade complementar.

## 5.6. Vocabulário proibido

Não utilizar:

- mínima intervenção humana;
- decisão autônoma;
- operação autônoma;
- sem intervenção humana;
- substituir equipes;
- substituir pessoas;
- eliminar erros;
- resposta sempre correta;
- zero alucinações;
- totalmente seguro;
- dados 100% protegidos;
- IA que entende tudo;
- inteligência humana;
- qualquer documento;
- qualquer sistema;
- qualquer tarefa;
- automação completa;
- redução garantida de custos;
- produtividade garantida;
- implementação instantânea;
- agente que faz tudo;
- chatbot inteligente como descrição principal;
- tecnologia de ponta;
- revolucionar;
- disrupção;
- diagnóstico gratuito;
- chamada gratuita de 60 minutos;
- plano de ação gratuito;
- resposta em até duas horas;
- sem custo;
- sem risco.

## 5.7. Humanização correta

Não usar a expressão:

```text
a IA pensa
```

Preferir:

```text
o sistema analisa
```

```text
o modelo gera
```

```text
a solução classifica
```

```text
o assistente consulta
```

Não atribuir intenção, consciência ou compreensão humana ao modelo.

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

Não adicionar chatbot no hero.

Não adicionar animação de conversa.

Não adicionar logos de provedores.

## 6.2. Eyebrow

Substituir:

```text
Pilar · Inteligência
```

por:

```text
Inteligência Artificial Aplicada
```

## 6.3. H1

Substituir o título atual por:

```text
Inteligência artificial integrada aos processos, documentos e sistemas da sua empresa.
```

## 6.4. Subtítulo

Usar exatamente:

```text
Desenvolvemos soluções que ajudam equipes a localizar conhecimento, processar informações e executar etapas controladas da operação, com critérios de qualidade, permissões e supervisão definidos desde o projeto.
```

## 6.5. CTA

Texto:

```text
Apresentar uma oportunidade de IA
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
- H1: único `<h1>`;
- subtítulo: `<p>`;
- CTA: `<a>`;
- microcopy: `<p>` ou `<small>`.

## 6.8. Regras visuais

- preservar fundo e alinhamento;
- não adicionar robô;
- não adicionar cérebro digital;
- não adicionar partículas;
- não adicionar prompt ou chat fictício;
- não adicionar logos de OpenAI, Anthropic, Google ou AWS;
- não alterar a paleta;
- limitar a largura do texto;
- CTA com estilo primário;
- microcopy com menor destaque;
- mobile sem corte;
- sem `white-space: nowrap`;
- não aumentar a altura sem necessidade.

## 6.9. Remover

Remover:

```text
Transformamos inteligência artificial em resultados para o seu negócio.
```

Remover:

```text
Desenvolvemos soluções de IA integradas aos processos da sua empresa, sempre com foco em gerar valor real, reduzir custos operacionais e aumentar a produtividade.
```

Remover:

```text
Solicitar diagnóstico
```

---

# 7. Seção — Soluções que desenvolvemos

## 7.1. Origem

Esta seção substitui “O que fazemos”.

## 7.2. Eyebrow

```text
O que desenvolvemos
```

## 7.3. H2

Substituir:

```text
IA aplicada a processos reais da sua empresa
```

por:

```text
Soluções de IA conectadas ao contexto real da operação.
```

## 7.4. Introdução

Substituir:

```text
Cinco frentes que levam inteligência artificial do conceito à operação do dia a dia.
```

por:

```text
A solução pode consultar conhecimento, interpretar documentos, apoiar decisões ou executar ações limitadas. O desenho depende do problema, dos dados disponíveis e do nível de controle exigido.
```

## 7.5. Quantidade

Manter exatamente cinco cards.

## 7.6. Ordem

1. Assistentes de conhecimento;
2. Processamento inteligente de documentos;
3. Classificação, triagem e extração;
4. IA integrada a sistemas e workflows;
5. Agentes com ações controladas.

---

# 8. Card 1 — Assistentes de conhecimento

## 8.1. Título

```text
Assistentes de conhecimento
```

## 8.2. Texto

```text
Criamos assistentes conectados a políticas, procedimentos, manuais e bases internas para ajudar equipes e clientes a localizar informações com mais rapidez.
```

## 8.3. Tags

```text
Busca contextual
```

```text
Bases internas
```

```text
Respostas com fontes
```

## 8.4. Restrição

Quando tecnicamente viável, respostas devem apresentar ou preservar referência à fonte utilizada.

Não prometer que todas as respostas terão fontes se a arquitetura final não suportar essa capacidade.

---

# 9. Card 2 — Processamento inteligente de documentos

## 9.1. Título

```text
Processamento inteligente de documentos
```

## 9.2. Texto

```text
Aplicamos IA à leitura, ao resumo e à organização de contratos, formulários, notas fiscais, relatórios e outros documentos, mantendo validação humana quando a criticidade exige.
```

## 9.3. Tags

```text
Leitura
```

```text
Resumo
```

```text
Validação
```

---

# 10. Card 3 — Classificação, triagem e extração

## 10.1. Título

```text
Classificação, triagem e extração
```

## 10.2. Texto

```text
Identificamos categorias, prioridades, campos e informações relevantes para encaminhar solicitações, estruturar dados e reduzir etapas manuais.
```

## 10.3. Tags

```text
Classificação
```

```text
Triagem
```

```text
Extração
```

---

# 11. Card 4 — IA integrada a sistemas e workflows

## 11.1. Título

```text
IA integrada a sistemas e workflows
```

## 11.2. Texto

```text
Incorporamos capacidades de IA a aplicações e processos existentes para apoiar análises, sugerir próximos passos e acionar fluxos sem substituir desnecessariamente os sistemas atuais.
```

## 11.3. Tags

```text
Integrações
```

```text
APIs
```

```text
Apoio operacional
```

---

# 12. Card 5 — Agentes com ações controladas

## 12.1. Título

```text
Agentes com ações controladas
```

## 12.2. Texto

```text
Desenvolvemos agentes capazes de consultar informações e executar ações específicas dentro de limites definidos, com permissões, registros, aprovações e possibilidade de interrupção.
```

## 12.3. Tags

```text
Permissões
```

```text
Aprovações
```

```text
Auditoria
```

## 12.4. Restrições

Não utilizar:

```text
Agentes de IA
```

como título isolado.

Não utilizar:

```text
mínima intervenção humana
```

Não utilizar:

```text
decisão autônoma
```

Não utilizar:

```text
execução autônoma
```

## 12.5. Cards antigos removidos

Remover:

- Agentes de IA;
- Automação Inteligente;
- Assistentes Inteligentes;
- IA Integrada aos Sistemas;

como categorias antigas.

“Processamento Inteligente de Documentos” será mantido com novo texto.

Remover os dados antigos da fonte da página.

Não ocultar somente com CSS.

## 12.6. Regras dos cards

- reutilizar componente atual;
- exatamente cinco cards;
- exatamente três tags;
- sem CTA individual;
- sem logos;
- sem lista de modelos;
- altura flexível;
- desktop conforme grid atual;
- tablet em duas colunas;
- mobile em uma coluna;
- sem carrossel.

---

# 13. Seção — Casos de aplicação

## 13.1. Estrutura

Preservar o bloco atual e seis cards.

## 13.2. Eyebrow

```text
Casos de aplicação
```

## 13.3. H2

Substituir:

```text
IA em ação no dia a dia da empresa
```

por:

```text
Onde a IA pode apoiar a operação.
```

## 13.4. Introdução

Substituir:

```text
Seis maneiras concretas de aplicar inteligência artificial na operação.
```

por:

```text
Os exemplos abaixo representam pontos de partida. A viabilidade depende dos dados, das integrações, dos riscos e da forma como o resultado será avaliado.
```

## 13.5. Ordem

1. Consulta ao conhecimento interno;
2. Atendimento com transferência para pessoas;
3. Leitura e extração de documentos;
4. Triagem de solicitações;
5. Geração assistida de relatórios e comunicações;
6. Apoio a decisões operacionais.

---

# 14. Caso 1 — Consulta ao conhecimento interno

## 14.1. Título

```text
Consulta ao conhecimento interno
```

## 14.2. Texto

```text
Assistente para localizar políticas, procedimentos, manuais e respostas em bases internas, respeitando as permissões de cada usuário.
```

---

# 15. Caso 2 — Atendimento com transferência para pessoas

## 15.1. Título

```text
Atendimento com transferência para pessoas
```

## 15.2. Texto

```text
Atendimento inicial para responder dúvidas conhecidas, registrar solicitações e encaminhar a conversa para uma pessoa quando houver incerteza, exceção ou necessidade de decisão.
```

## 15.3. Restrição

Não utilizar apenas:

```text
Atendimento inteligente
```

Não prometer atendimento totalmente automatizado.

---

# 16. Caso 3 — Leitura e extração de documentos

## 16.1. Título

```text
Leitura e extração de documentos
```

## 16.2. Texto

```text
Identificação de campos, cláusulas, datas, valores e categorias em documentos, com revisão proporcional ao impacto de eventuais erros.
```

---

# 17. Caso 4 — Triagem de solicitações

## 17.1. Título

```text
Triagem de solicitações
```

## 17.2. Texto

```text
Classificação de e-mails, tickets, formulários ou mensagens por assunto, urgência e destino, reduzindo o tempo até o encaminhamento correto.
```

---

# 18. Caso 5 — Geração assistida de relatórios e comunicações

## 18.1. Título

```text
Geração assistida de relatórios e comunicações
```

## 18.2. Texto

```text
Produção de rascunhos, resumos e relatórios a partir de informações autorizadas, com revisão antes do envio ou da publicação.
```

## 18.3. Restrição

Não utilizar:

```text
Geração de conteúdo
```

como título genérico.

Não sugerir publicação automática irrestrita.

---

# 19. Caso 6 — Apoio a decisões operacionais

## 19.1. Título

```text
Apoio a decisões operacionais
```

## 19.2. Texto

```text
Organização de informações, identificação de padrões e sugestão de próximos passos para que a decisão final seja tomada com mais contexto.
```

## 19.3. Restrição

Não descrever a IA como responsável pela decisão final em processos críticos.

## 19.4. Regras dos casos

- sem tags, caso o componente atual não utilize;
- sem CTA individual;
- sem ícones novos;
- sem métricas;
- sem promessa de resultado;
- altura flexível;
- mobile em uma coluna;
- textos completos;
- não repetir integralmente os cards da seção anterior.

---

# 20. Seção — Benefícios para a operação

## 20.1. Eyebrow

```text
Benefícios
```

## 20.2. H2

Substituir:

```text
IA que gera valor mensurável para a operação
```

por:

```text
Mais acesso à informação, menos esforço em tarefas de interpretação.
```

## 20.3. Introdução

Adicionar:

```text
Os ganhos dependem da qualidade dos dados, do desenho do processo, da integração e dos critérios de avaliação. A IA deve ser medida pelo resultado da tarefa, não apenas pela capacidade de gerar uma resposta.
```

## 20.4. Quantidade

Manter exatamente oito benefícios.

## 20.5. Benefícios

```text
Menos tempo para localizar informações
```

```text
Redução de etapas repetitivas de leitura e classificação
```

```text
Triagem mais rápida de solicitações
```

```text
Respostas mais consistentes em situações conhecidas
```

```text
Melhor aproveitamento do conhecimento interno
```

```text
Capacidade de processar maior volume de conteúdo
```

```text
Apoio à análise e à tomada de decisão
```

```text
Novas capacidades incorporadas aos sistemas existentes
```

## 20.6. Remover

Remover:

```text
Redução de custos operacionais
```

como benefício genérico.

A redução de custo poderá ser consequência medida em um caso específico, mas não deve ser prometida sem contexto.

Remover:

```text
Soluções preparadas para evoluir
```

desta lista. Evolução será tratada na abordagem.

## 20.7. Regras

- sem métricas;
- sem garantias;
- sem ícones novos;
- preservar componente;
- ícones decorativos com `aria-hidden="true"`;
- mobile com leitura completa.

---

# 21. Seção — Nossa abordagem

## 21.1. Estrutura

Preservar a seção atual, expandindo-a para cinco etapas.

## 21.2. Eyebrow

```text
Nossa abordagem
```

## 21.3. H2

Substituir:

```text
Cada projeto começa com uma pergunta simples: onde a IA pode gerar mais valor para o negócio?
```

por:

```text
Começamos pelo problema, pelos dados e pela forma de medir a qualidade.
```

## 21.4. Introdução

Substituir o texto atual por:

```text
Nem todo processo precisa de inteligência artificial. Primeiro avaliamos se regras, integração ou automação convencional já resolvem o problema. Quando a IA é adequada, definimos o escopo, os limites e os critérios de avaliação antes de conectá-la à operação.
```

## 21.5. Número de etapas

Usar exatamente cinco.

---

# 22. Etapa 1 — Identificar uma tarefa adequada

## 22.1. Número

```text
01
```

## 22.2. Título

```text
Identificar uma tarefa adequada
```

## 22.3. Texto

```text
Selecionamos um problema com entradas, usuários, resultado esperado e impacto identificáveis. A IA não deve ser adotada apenas porque a tecnologia está disponível.
```

---

# 23. Etapa 2 — Avaliar dados e acessos

## 23.1. Número

```text
02
```

## 23.2. Título

```text
Avaliar dados e acessos
```

## 23.3. Texto

```text
Verificamos quais informações são necessárias, quem pode acessá-las, como serão protegidas e quais restrições impedem o uso de determinados dados.
```

---

# 24. Etapa 3 — Definir critérios de qualidade

## 24.1. Número

```text
03
```

## 24.2. Título

```text
Definir critérios de qualidade
```

## 24.3. Texto

```text
Estabelecemos exemplos de referência, métricas, níveis de confiança e situações em que a resposta deve ser recusada, revisada ou encaminhada para uma pessoa.
```

---

# 25. Etapa 4 — Integrar com controle

## 25.1. Número

```text
04
```

## 25.2. Título

```text
Integrar com controle
```

## 25.3. Texto

```text
Conectamos a solução aos sistemas e fluxos necessários, limitando permissões, registrando ações e mantendo aprovações humanas onde o risco exige.
```

---

# 26. Etapa 5 — Monitorar e evoluir

## 26.1. Número

```text
05
```

## 26.2. Título

```text
Monitorar e evoluir
```

## 26.3. Texto

```text
Acompanhamos qualidade, falhas, custo, tempo de resposta e comportamento de uso para ajustar prompts, dados, regras, modelos ou etapas do processo.
```

## 26.4. Manifesto da abordagem

Adicionar ao final da seção, dentro do mesmo bloco:

### Frase

```text
IA integrada à operação, não um chatbot isolado.
```

### Texto

```text
O valor surge quando a solução participa de um processo definido, utiliza informações autorizadas e produz um resultado que pode ser avaliado.
```

## 26.5. Regras visuais

- reutilizar o componente de etapas, se existir;
- não criar timeline animada;
- não criar diagrama;
- desktop conforme layout atual;
- tablet com quebra;
- mobile em uma coluna;
- sem carrossel;
- manifesto integrado à seção;
- não adicionar CTA.

---

# 27. Seção — Governança, segurança e controle

## 27.1. Origem

Esta seção substitui integralmente o bloco:

```text
Objetivo
```

e o conteúdo:

```text
Liberdade para focar no que importa.
```

## 27.2. Eyebrow

```text
Governança e controle
```

## 27.3. H2

```text
Qualidade, permissões e supervisão fazem parte da solução.
```

## 27.4. Introdução

```text
Soluções de IA podem produzir respostas incorretas, incompletas ou inadequadas ao contexto. Por isso, o projeto precisa definir como avaliar resultados, limitar acessos, registrar decisões e transferir situações de risco para pessoas responsáveis.
```

## 27.5. Quantidade

Usar exatamente oito itens.

## 27.6. Itens

```text
Dados e fontes autorizados para cada caso de uso
```

```text
Permissões limitadas ao necessário
```

```text
Critérios de qualidade e conjuntos de avaliação
```

```text
Respostas fundamentadas e referências quando aplicável
```

```text
Aprovação humana para ações de maior impacto
```

```text
Logs e trilhas de auditoria
```

```text
Fallback e transferência para pessoas
```

```text
Monitoramento de qualidade, uso e custos
```

## 27.7. Encerramento

```text
O nível de automação deve ser proporcional ao impacto de uma resposta ou ação incorreta.
```

## 27.8. Subbloco opcional obrigatório somente se o componente atual comportar texto adicional

### H3

```text
Privacidade e uso de dados
```

### Texto

```text
A arquitetura deve considerar a natureza das informações, os fornecedores envolvidos, as configurações de retenção, os controles de acesso e as obrigações aplicáveis ao tratamento dos dados.
```

## 27.9. Restrição legal

Não afirmar:

- conformidade automática com a LGPD;
- anonimização completa;
- ausência de retenção por provedores;
- treinamento ou não treinamento de modelos com dados do cliente sem verificar o fornecedor;
- residência de dados específica;
- criptografia ponta a ponta;
- sigilo absoluto.

A implementação textual deverá permanecer genérica conforme definido.

## 27.10. Regras visuais

- reutilizar componente de checklist ou callout;
- não adicionar escudo dominante;
- não adicionar selo “IA responsável”;
- não adicionar certificação;
- não adicionar texto jurídico longo;
- mobile em uma coluna;
- sem altura fixa.

---

# 28. Perguntas frequentes

## 28.1. Estrutura

Preservar o accordion atual.

Substituir todas as perguntas e respostas.

Não manter nenhuma pergunta sem resposta.

## 28.2. Eyebrow

```text
Perguntas frequentes
```

## 28.3. H2

```text
Dúvidas antes de aplicar IA à operação
```

## 28.4. Quantidade

Usar exatamente dez perguntas.

---

# 29. Pergunta 1

## 29.1. Pergunta

```text
Minha empresa precisa desenvolver um sistema novo para usar IA?
```

## 29.2. Resposta

```text
Não necessariamente. A IA pode ser integrada a aplicações, documentos e fluxos existentes. Um sistema novo só deve ser considerado quando a interface ou o processo atual não oferece uma forma adequada de incorporar a solução.
```

---

# 30. Pergunta 2

## 30.1. Pergunta

```text
Como saber se um processo realmente precisa de IA?
```

## 30.2. Resposta

```text
Avaliamos se a tarefa exige interpretação de linguagem, classificação, extração, síntese ou geração. Quando regras determinísticas ou automação convencional resolvem o problema com menor custo e risco, elas devem ser preferidas.
```

---

# 31. Pergunta 3

## 31.1. Pergunta

```text
É possível utilizar informações internas da empresa com segurança?
```

## 31.2. Resposta

```text
É possível estruturar controles de acesso, seleção de fontes, registros e configurações de uso adequados ao caso. A arquitetura depende da sensibilidade dos dados, dos fornecedores escolhidos e das obrigações aplicáveis.
```

---

# 32. Pergunta 4

## 32.1. Pergunta

```text
Os dados da empresa serão usados para treinar modelos?
```

## 32.2. Resposta

```text
Isso depende do serviço e do contrato do fornecedor utilizado. Antes da implementação, é necessário verificar as políticas, as configurações de retenção e as opções disponíveis para o ambiente escolhido.
```

---

# 33. Pergunta 5

## 33.1. Pergunta

```text
Como lidar com respostas incorretas ou inventadas?
```

## 33.2. Resposta

```text
Definimos fontes, critérios de avaliação, limites de resposta, validações e encaminhamento para pessoas. Em processos críticos, a IA deve apoiar a tarefa, e não atuar como única autoridade.
```

---

# 34. Pergunta 6

## 34.1. Pergunta

```text
A IA substitui o trabalho das equipes?
```

## 34.2. Resposta

```text
O objetivo é reduzir esforço em tarefas específicas e ampliar a capacidade das pessoas. A redistribuição do trabalho depende do processo, da qualidade da solução e das decisões da empresa, não apenas da tecnologia.
```

---

# 35. Pergunta 7

## 35.1. Pergunta

```text
Um agente pode executar ações nos nossos sistemas?
```

## 35.2. Resposta

```text
Pode, quando existe justificativa e controle adequado. As ações devem ser limitadas por permissões, regras, aprovações, registros e mecanismos de interrupção proporcionais ao impacto.
```

---

# 36. Pergunta 8

## 36.1. Pergunta

```text
Como a qualidade da solução é medida?
```

## 36.2. Resposta

```text
Criamos exemplos de referência e métricas relacionadas à tarefa, como precisão de classificação, cobertura, taxa de encaminhamento, tempo economizado ou necessidade de correção humana. A avaliação continua depois da entrada em operação.
```

---

# 37. Pergunta 9

## 37.1. Pergunta

```text
Como os custos de IA são controlados?
```

## 37.2. Resposta

```text
Acompanhamos volume de uso, tamanho das entradas e respostas, modelo utilizado, chamadas externas e custo por tarefa. Limites, cache, modelos menores e processamento assíncrono podem ser considerados conforme o caso.
```

---

# 38. Pergunta 10

## 38.1. Pergunta

```text
Existe manutenção depois da entrega?
```

## 38.2. Resposta

```text
O modelo de sustentação é definido conforme a solução. Pode incluir monitoramento de qualidade e custos, correções, atualização de fontes, ajustes de prompts e regras, troca de modelos ou transferência estruturada para a equipe do cliente.
```

## 38.3. Regras do accordion

- usar `<button>`;
- acessível por teclado;
- abrir com Enter e Espaço;
- `aria-expanded`;
- `aria-controls`;
- foco visível;
- respostas presentes no HTML;
- respeitar `prefers-reduced-motion`;
- nenhuma resposta vazia;
- manter o comportamento atual de uma ou várias perguntas abertas;
- não depender de hover;
- não carregar resposta sob demanda.

---

# 39. CTA final

## 39.1. Estrutura

Preservar o componente visual global.

Substituir integralmente os textos.

## 39.2. Eyebrow

```text
Vamos começar
```

## 39.3. H2

```text
Qual tarefa poderia ganhar velocidade com melhor acesso à informação?
```

## 39.4. Parágrafo

```text
Conte o processo, os documentos ou o conhecimento envolvidos e o resultado que sua empresa espera alcançar. Vamos avaliar se a IA é adequada e qual deve ser o próximo passo.
```

## 39.5. Lista

Usar exatamente:

```text
Informações difíceis de localizar em documentos e bases internas
```

```text
Tarefas recorrentes de leitura, classificação ou triagem
```

```text
Sistemas que podem receber apoio inteligente com controles definidos
```

## 39.6. Badge

```text
Disponível para novos projetos
```

Exibir somente quando a configuração global indicar disponibilidade.

## 39.7. Card de ação

### Rótulo

```text
Primeira conversa
```

### H3

```text
Vamos entender o problema antes de propor IA.
```

### Texto

```text
A conversa inicial serve para avaliar a aderência e esclarecer os primeiros caminhos. Análises de dados, riscos, integrações e critérios de qualidade podem ser estruturadas como um diagnóstico comercial.
```

### CTA

```text
Apresentar uma oportunidade de IA
```

Destino:

```text
/contato
```

### Microcopy

```text
Sem compromisso · Retorno em até um dia útil
```

## 39.8. Remover

Remover:

```text
Vamos conversar sobre como aplicar IA no seu negócio.
```

Remover:

```text
Agende uma chamada inicial de 60 minutos sem custo e sem compromisso para discutirmos como a inteligência artificial pode gerar valor real para sua empresa.
```

Remover:

```text
Diagnóstico objetivo de onde a IA gera mais valor
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

Remover:

```text
Sem compromisso · sem custo
```

## 39.9. Restrições

Não informar duração fixa.

Não prometer diagnóstico gratuito.

Não prometer plano de ação na conversa inicial.

Não solicitar dados sensíveis no CTA.

Não pedir upload de documentos na primeira interação da página.

---

# 40. Cabeçalho e rodapé

## 40.1. Cabeçalho

Seguir a especificação global da Home.

CTA:

```text
Apresentar um desafio
```

Destino:

```text
/contato
```

## 40.2. Rodapé

Na lista de especialidades, usar:

```text
Inteligência Artificial Aplicada
```

Destino:

```text
/inteligencia-artificial
```

Não alterar header ou footer localmente.

---

# 41. Hierarquia de headings

Usar:

- hero: `<h1>`;
- Soluções: `<h2>`;
- cards: `<h3>`;
- Casos: `<h2>`;
- casos individuais: `<h3>`;
- Benefícios: `<h2>`;
- Abordagem: `<h2>`;
- etapas: `<h3>`;
- manifesto: `<h3>` ou parágrafo destacado;
- Governança: `<h2>`;
- subbloco de privacidade: `<h3>`;
- FAQ: `<h2>`;
- CTA final: `<h2>`;
- card do CTA: `<h3>`.

Não pular níveis.

Não usar headings apenas para estilo.

---

# 42. IDs das seções

Usar:

```text
solucoes
```

```text
aplicacoes
```

```text
beneficios
```

```text
abordagem
```

```text
governanca
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

# 43. Responsividade

## 43.1. Regras gerais

Usar os breakpoints existentes.

Não criar nova estratégia global.

Não utilizar carrossel.

Não usar alturas fixas.

Não reduzir fonte para encaixar conteúdo.

Não permitir overflow horizontal.

## 43.2. Hero

Desktop:

- manter composição;
- limitar largura do H1 e subtítulo.

Mobile:

- CTA com largura adequada;
- H1 sem `nowrap`;
- microcopy completa;
- sem corte.

## 43.3. Cards de soluções

Desktop:

- preservar grid atual;
- se houver três colunas, organizar 3 + 2 sem comprimir os cards finais.

Tablet:

- duas colunas.

Mobile:

- uma coluna;
- ordem preservada.

## 43.4. Casos de aplicação

Desktop:

- três colunas e duas linhas, se o componente permitir.

Tablet:

- duas colunas.

Mobile:

- uma coluna.

## 43.5. Benefícios

- preservar componente atual;
- tablet em duas colunas;
- mobile em uma coluna ou duas somente se legível;
- textos completos.

## 43.6. Abordagem

Desktop:

- etapas em linha ou grid conforme componente existente;
- não exigir scroll horizontal.

Tablet:

- duas colunas ou quebra natural.

Mobile:

- uma coluna;
- ordem de 01 a 05.

## 43.7. Governança

- desktop em duas colunas, se o checklist atual permitir;
- mobile em uma coluna;
- textos sem corte;
- subbloco de privacidade abaixo da lista.

## 43.8. FAQ

- largura total;
- pergunta com quebra;
- área de toque adequada;
- ícone sem sobreposição.

## 43.9. CTA

- desktop conforme componente global;
- mobile em uma coluna;
- card de ação após o texto principal.

## 43.10. Zoom

Validar em 200%.

Nenhum conteúdo poderá desaparecer, ficar sobreposto ou exigir scroll horizontal.

---

# 44. Acessibilidade

## 44.1. Contraste

Manter WCAG AA para:

- textos;
- botões;
- tags;
- benefícios;
- checklist;
- FAQ;
- microcopy;
- foco.

## 44.2. Teclado

- links acessíveis por Tab;
- accordion acessível por Tab;
- Enter e Espaço;
- foco visível;
- ordem coerente;
- sem armadilhas.

## 44.3. Movimento

Respeitar:

```css
prefers-reduced-motion: reduce
```

## 44.4. Ícones

- decorativos: `aria-hidden="true"`;
- não usar emojis;
- não usar ícones como única identificação;
- não adicionar robô ou cérebro.

## 44.5. Semântica

- listas com `<ul>` e `<li>`;
- CTAs com `<a>`;
- FAQ com `<button>`;
- não usar `<div onClick>`;
- não colocar texto essencial em pseudo-elementos;
- não usar tooltip como único lugar de informação importante.

---

# 45. Metadados

## 45.1. Title

```text
Inteligência Artificial Aplicada | Marcelo Gonçalves
```

## 45.2. Description

```text
Assistentes corporativos, processamento de documentos, triagem, extração e agentes com ações controladas, integrados aos processos e sistemas da empresa.
```

## 45.3. Open Graph

Usar o mesmo title e description.

Preservar imagem atual se adequada.

Não gerar imagem.

## 45.4. Canonical

Manter:

```text
/inteligencia-artificial
```

até a migração de rota.

---

# 46. Dados estruturados

Somente atualizar se já houver JSON-LD.

Não instalar biblioteca.

É permitido atualizar `Service`:

```text
name: Inteligência Artificial Aplicada
```

```text
serviceType: Soluções de inteligência artificial integradas a processos e sistemas
```

Não adicionar:

- preços;
- avaliações;
- ofertas;
- clientes;
- modelos;
- provedores;
- garantias;
- métricas;
- disponibilidade;
- certificações não existentes.

---

# 47. Analytics

Aplicar somente se houver helper existente.

Eventos:

```text
ai_hero_cta_click
```

```text
ai_faq_toggle
```

```text
ai_final_cta_click
```

No FAQ, incluir identificador estável.

Não enviar:

- documentos;
- texto livre;
- prompts;
- dados pessoais;
- conteúdo do usuário.

Não instalar provedor.

---

# 48. Implementação técnica

## 48.1. Reutilizar

- componentes atuais;
- cards;
- tags;
- casos;
- benefícios;
- etapas;
- checklist;
- accordion;
- CTA;
- header;
- footer;
- containers;
- tokens.

## 48.2. Dados

Se soluções, casos, benefícios ou FAQ forem data-driven:

- atualizar a fonte original;
- remover dados antigos;
- preservar tipagem;
- usar IDs estáveis;
- não duplicar arrays;
- não usar índice como chave quando existir ID.

## 48.3. Não instalar

- SDK de modelo no frontend;
- widget de chat;
- biblioteca de prompt;
- biblioteca de FAQ;
- biblioteca de animação;
- carrossel;
- slider;
- biblioteca de ícones;
- ferramenta de analytics;
- pacote de upload.

## 48.4. Remoção real

Conteúdos removidos devem deixar de ser renderizados.

Não ocultar com CSS.

---

# 49. Elementos proibidos

A IA engenheira não deverá:

- criar chatbot demonstrativo;
- chamar API de modelo;
- adicionar campo de prompt;
- adicionar upload;
- adicionar exemplos com dados reais;
- criar respostas fictícias de IA;
- adicionar logos de provedores;
- informar modelos específicos;
- recomendar um modelo na interface;
- incluir comparação de custos;
- prometer segurança absoluta;
- prometer ausência de alucinação;
- prometer autonomia;
- inventar clientes;
- inventar métricas;
- criar depoimentos;
- criar preços;
- criar chamada de 60 minutos;
- prometer diagnóstico gratuito;
- adicionar formulário;
- adicionar WhatsApp;
- adicionar popup;
- criar nova rota;
- alterar a paleta;
- alterar as fontes;
- alterar o header localmente;
- alterar o footer localmente;
- reescrever os textos finais;
- adicionar “IA responsável” como selo;
- afirmar conformidade automática com a LGPD.

---

# 50. Ordem de implementação

Executar:

1. Identificar componente da rota `/inteligencia-artificial`.
2. Identificar fonte de dados e componentes.
3. Atualizar hero.
4. Atualizar cinco cards de solução.
5. Atualizar seis casos de aplicação.
6. Atualizar benefícios.
7. Expandir a abordagem para cinco etapas.
8. Substituir o bloco Objetivo por Governança.
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

# 51. Testes obrigatórios

## 51.1. Conteúdo presente

Verificar:

```text
Inteligência Artificial Aplicada
```

```text
Inteligência artificial integrada aos processos, documentos e sistemas da sua empresa.
```

```text
Assistentes de conhecimento
```

```text
Processamento inteligente de documentos
```

```text
Classificação, triagem e extração
```

```text
IA integrada a sistemas e workflows
```

```text
Agentes com ações controladas
```

```text
Onde a IA pode apoiar a operação.
```

```text
Começamos pelo problema, pelos dados e pela forma de medir a qualidade.
```

```text
Governança e controle
```

```text
Dúvidas antes de aplicar IA à operação
```

```text
Apresentar uma oportunidade de IA
```

## 51.2. Conteúdo ausente

Verificar que não existe:

```text
Pilar · Inteligência
```

```text
mínima intervenção humana
```

```text
Decisão Autônoma
```

```text
executar ações de forma autônoma
```

```text
Agentes de IA
```

como título de card.

```text
Automação Inteligente
```

como título de card.

```text
redução de custos operacionais
```

como promessa no hero.

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

## 51.3. Links

Validar:

- hero CTA → `/contato`;
- CTA final → `/contato`;
- header CTA → `/contato`;
- logo → `/`;
- menu funcional;
- footer funcional.

## 51.4. FAQ

- dez perguntas;
- dez respostas;
- teclado;
- `aria-expanded`;
- `aria-controls`;
- foco visível;
- abertura e fechamento;
- sem respostas vazias.

## 51.5. Responsividade

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
- etapas legíveis;
- checklist completo;
- FAQ sem sobreposição;
- CTA sem corte.

## 51.6. Zoom

Validar:

- 100%;
- 200%.

## 51.7. Build

- lint sem erros;
- testes sem erros;
- build de produção sem erros;
- rota funcional;
- sem regressão em páginas compartilhadas.

---

# 52. Critérios de aceite por seção

## 52.1. Hero

- nome comercial correto;
- IA integrada a processo;
- controles mencionados;
- sem redução de custo;
- CTA padronizado.

## 52.2. Soluções

- cinco cards;
- distinção entre assistente, documento, classificação, integração e agente;
- agente com permissões e aprovações;
- sem autonomia irrestrita.

## 52.3. Aplicações

- seis casos;
- atendimento com transferência humana;
- documentos com revisão;
- geração assistida;
- decisão final não delegada à IA em casos críticos.

## 52.4. Benefícios

- oito itens;
- condicionados à qualidade do projeto;
- sem promessa genérica de redução de custo.

## 52.5. Abordagem

- avaliação de adequação;
- dados e acesso;
- qualidade;
- integração controlada;
- monitoramento;
- manifesto integrado.

## 52.6. Governança

- fontes autorizadas;
- menor privilégio;
- avaliação;
- aprovação humana;
- auditoria;
- fallback;
- monitoramento de custos;
- privacidade sem garantias absolutas.

## 52.7. FAQ

- sistema novo;
- adequação;
- dados internos;
- treinamento de modelos;
- erros;
- equipes;
- agentes;
- qualidade;
- custos;
- manutenção.

## 52.8. CTA

- sem chamada de 60 minutos;
- sem diagnóstico gratuito;
- sem upload;
- prazo de um dia útil;
- CTA correto.

---

# 53. Critérios de aceite da página completa

A implementação será aceita somente quando:

1. A página apresentar IA como capacidade integrada à operação.
2. A página não utilizar autonomia como promessa central.
3. Agentes tiverem limites, permissões, aprovações e registros.
4. Assistentes forem diferenciados de agentes.
5. Processamento de documentos mencionar validação proporcional ao risco.
6. Atendimento mencionar transferência para pessoas.
7. Geração de conteúdo for apresentada como assistida e revisada.
8. A abordagem avaliar se IA é realmente necessária.
9. Dados e acessos fizerem parte da abordagem.
10. Critérios de qualidade forem explícitos.
11. Monitoramento de qualidade e custos estiver previsto.
12. Governança fizer parte da página.
13. A FAQ estiver completa.
14. Não houver promessa de segurança absoluta.
15. Não houver promessa de redução de custo.
16. Não houver promessa de diagnóstico gratuito.
17. O prazo estiver padronizado em um dia útil.
18. A identidade visual estiver preservada.
19. Não houver novas seções não autorizadas.
20. Não houver chatbot ou integração real com modelo.
21. A página funcionar em desktop, tablet e mobile.
22. Não houver regressão de acessibilidade.
23. Build e testes terminarem sem erros.
24. Os textos estiverem exatamente como especificados.
25. A página estiver coerente com Home, Sobre, Automação e Cloud.

---

# 54. Checklist final de revisão humana

- [ ] Hero atualizado.
- [ ] Eyebrow sem “Pilar”.
- [ ] CTA correto.
- [ ] Microcopy de um dia útil.
- [ ] Cinco cards de solução.
- [ ] “Agentes com ações controladas” presente.
- [ ] “mínima intervenção humana” removido.
- [ ] “Decisão Autônoma” removido.
- [ ] Seis casos de aplicação.
- [ ] Atendimento com transferência humana.
- [ ] Documento com validação.
- [ ] Geração assistida com revisão.
- [ ] Oito benefícios.
- [ ] Abordagem com cinco etapas.
- [ ] Avaliação de adequação explícita.
- [ ] Critérios de qualidade explícitos.
- [ ] Governança com oito itens.
- [ ] Privacidade sem promessa absoluta.
- [ ] Dez FAQs respondidas.
- [ ] Nenhuma resposta vazia.
- [ ] CTA sem 60 minutos.
- [ ] CTA sem diagnóstico gratuito.
- [ ] CTA sem upload.
- [ ] Nenhum chatbot adicionado.
- [ ] Nenhum logo de provedor.
- [ ] Nenhum modelo específico listado.
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

# 55. Resultado esperado

Ao final, a página deverá comunicar:

> A consultoria aplica inteligência artificial a tarefas específicas da operação, integrando conhecimento, documentos e sistemas com critérios de qualidade, acesso controlado, supervisão e monitoramento.

O visitante deverá entender:

- que IA não é adequada para todos os processos;
- que uma solução pode ser integrada ao sistema atual;
- que assistentes e agentes possuem funções diferentes;
- que agentes só executam ações dentro de limites;
- que documentos críticos podem exigir revisão;
- que atendimento automatizado precisa de transferência humana;
- que qualidade precisa ser medida;
- que dados e permissões precisam ser definidos;
- que respostas incorretas precisam de tratamento;
- que uso e custos precisam ser monitorados;
- que a primeira conversa avalia aderência;
- que um diagnóstico aprofundado pode ser uma entrega comercial.
