# Especificação definitiva — Ajuste completo da página Sobre

## 0. Finalidade e precedência deste documento

Este documento é a especificação definitiva para a revisão da página Sobre da plataforma de consultoria.

Ele deve permitir que uma IA engenheira execute todas as mudanças sem precisar:

- interpretar a intenção institucional;
- escolher textos alternativos;
- decidir quais blocos manter ou remover;
- inferir a relação entre Marcelo Gonçalves e a consultoria;
- inventar equipe, parceiros, credenciais ou experiência;
- alterar a identidade visual;
- consultar documentos anteriores para resolver conflitos.

Em caso de divergência entre este arquivo e orientações anteriores referentes à página Sobre, **este documento prevalece**.

---

# 1. Escopo

## 1.1. Página

Aplicar as alterações na rota:

```text
/sobre
```

## 1.2. Incluído

Esta tarefa inclui:

- hero;
- bloco de visão;
- bloco de origem e propósito;
- princípios de engenharia;
- processo de decisão;
- apresentação de Marcelo Gonçalves;
- provas de experiência;
- certificações;
- especialidades;
- explicação do modelo boutique;
- CTA final;
- metadados;
- responsividade;
- acessibilidade;
- testes;
- critérios de aceite.

## 1.3. Não incluído

Não realizar nesta tarefa:

- redesign completo do cabeçalho;
- redesign completo do rodapé;
- mudança de paleta;
- troca das fontes;
- alteração das páginas de serviços;
- criação de uma página separada para Marcelo;
- criação de uma página “Equipe”;
- criação de currículos individuais;
- criação de estudos de caso;
- inclusão de clientes ou logotipos;
- inclusão de depoimentos;
- criação de novas certificações;
- alteração da página de contato;
- alteração de documentos legais;
- criação de uma nova fotografia;
- geração de ilustrações;
- instalação de bibliotecas.

## 1.4. Dependências

O cabeçalho e o rodapé devem seguir a especificação global definida no documento da Home:

```text
ajuste-07-especificacao-completa-home.md
```

Não duplicar header ou footer dentro da página Sobre.

Se os componentes globais ainda não tiverem sido atualizados, a página Sobre deverá continuar funcional com os componentes existentes, sem criar versões locais.

---

# 2. Fonte atual analisada

Página:

```text
https://dsns2wusdrj9z.cloudfront.net/sobre
```

Data da análise:

```text
27 de julho de 2026
```

Estrutura atual identificada:

1. Hero;
2. Nossa Visão;
3. Nossa Origem;
4. Nossa Missão;
5. Nossa Filosofia;
6. Como Pensamos;
7. O que está por trás;
8. Experiência internacional;
9. Certificações;
10. Especialidades;
11. No que acreditamos;
12. CTA final;
13. Rodapé.

---

# 3. Diagnóstico da estrutura atual

## 3.1. Pontos fortes

Preservar conceitualmente:

- foco em eficiência operacional;
- tecnologia como meio, não como protagonista;
- simplicidade;
- modularidade;
- automação;
- precisão;
- evolução;
- engenharia antes da ferramenta;
- liderança técnica de Marcelo;
- experiência internacional;
- certificações;
- frase “Tecnologia não existe para impressionar”;
- CTA final.

## 3.2. Problemas

A estrutura atual repete a mesma ideia em três blocos:

- Nossa Filosofia;
- Como Pensamos;
- No que acreditamos.

Também existe sobreposição entre:

- Nossa Origem;
- Nossa Missão.

A página utiliza “nós” e apresenta apenas Marcelo, mas não explica claramente:

- que se trata de uma consultoria boutique;
- que Marcelo lidera diretamente os projetos;
- que especialistas complementares podem ser incorporados quando necessário;
- que não existe promessa de uma equipe fixa ampla;
- como a autoridade pessoal se relaciona com a identidade da consultoria.

## 3.3. Mudanças estruturais indispensáveis

Realizar:

1. Manter o hero.
2. Manter a visão.
3. Fundir “Nossa Origem” e “Nossa Missão” em um único bloco.
4. Manter os cinco princípios, renomeando “Nossa Filosofia”.
5. Manter “Como Pensamos”, mas diferenciá-lo claramente dos princípios.
6. Incorporar a frase principal de “No que acreditamos” como manifesto dentro do bloco de princípios.
7. Remover o bloco independente “No que acreditamos”.
8. Manter a apresentação de Marcelo.
9. Reorganizar experiência, certificações e especialidades dentro do mesmo macrobloco de autoridade.
10. Incluir a explicação do modelo boutique no macrobloco de autoridade.
11. Manter o CTA final, simplificando-o.

Não criar novas seções além das necessárias para organizar esses conteúdos.

---

# 4. Estrutura final obrigatória

A página deverá seguir exatamente esta ordem:

1. Cabeçalho global;
2. Hero;
3. Visão;
4. Origem e propósito;
5. Princípios de engenharia;
6. Como tomamos decisões;
7. Quem lidera a consultoria;
8. Experiência, certificações e competências;
9. CTA final;
10. Rodapé global.

---

# 5. Regras gerais de linguagem

## 5.1. Modelo institucional

Apresentar o negócio como:

```text
consultoria boutique de tecnologia liderada por Marcelo Gonçalves
```

## 5.2. Uso de “nós”

“Nós” representa institucionalmente a consultoria.

É permitido em:

- visão;
- princípios;
- processo de decisão;
- serviços;
- forma de trabalho.

## 5.3. Uso de “Marcelo”

Usar “Marcelo” ou “Marcelo Gonçalves” ao tratar de:

- trajetória;
- experiência;
- liderança;
- responsabilidade técnica;
- certificações;
- participação nos projetos.

## 5.4. Equipe e especialistas

Não utilizar:

- nossa ampla equipe;
- nosso time multidisciplinar;
- nossos desenvolvedores;
- nossos especialistas, sem qualificação;
- departamento de engenharia;
- equipes dedicadas;
- grande estrutura;
- equipe global.

Utilizar:

```text
especialistas complementares podem ser incorporados quando o escopo exige
```

```text
a estrutura de entrega é dimensionada conforme o projeto
```

```text
a liderança e a responsabilidade técnica permanecem centralizadas
```

## 5.5. Termos a evitar

Não utilizar:

- transformar o mundo;
- revolucionar empresas;
- tecnologia de ponta;
- soluções disruptivas;
- inovação 360°;
- crescimento garantido;
- qualquer desafio;
- equipe completa;
- tecnologia sem limites;
- escalabilidade infinita;
- zero falhas;
- fundador visionário;
- referência mundial;
- especialista em tudo;
- “mais de dez anos como especialista em nuvem”, caso a experiência geral em tecnologia seja maior que a especialização específica.

## 5.6. Tom

O tom deve ser:

- seguro;
- técnico;
- próximo;
- transparente;
- institucional;
- sem autopromoção exagerada;
- sem linguagem de currículo;
- sem parecer uma software house de grande porte;
- sem parecer um freelancer genérico.

---

# 6. Hero

## 6.1. Estrutura

Preservar a composição visual atual.

Ordem:

1. eyebrow;
2. H1;
3. subtítulo;
4. CTA.

Não adicionar segundo CTA nesta página.

Não adicionar métricas ou certificações no hero.

## 6.2. Eyebrow

Substituir:

```text
Sobre Nós
```

por:

```text
Sobre a consultoria
```

Motivo:

- evita sugerir uma equipe ampla;
- mantém linguagem institucional;
- prepara a apresentação do modelo boutique.

## 6.3. H1

Substituir:

```text
Toda empresa merece tecnologias que potencializem seu crescimento.
```

por:

```text
Engenharia próxima da operação, com responsabilidade direta sobre as decisões que sustentam a solução.
```

## 6.4. Subtítulo

Substituir:

```text
Criamos soluções que aumentam a eficiência operacional por meio de engenharia, automação e inteligência artificial.
```

por:

```text
Somos uma consultoria boutique liderada por Marcelo Gonçalves. Combinamos automação, inteligência artificial, software e arquitetura em nuvem para ajudar empresas a operar com mais eficiência, integração e confiabilidade.
```

## 6.5. CTA

Manter o CTA, alterando o texto para:

```text
Conhecer os serviços
```

Destino definitivo:

```text
/servicos
```

Se `/servicos` ainda não estiver implementada:

- usar temporariamente `/#servicos`;
- não apontar para `/`;
- registrar a dependência;
- trocar para `/servicos` antes da produção.

## 6.6. Hierarquia HTML

- eyebrow: texto não heading;
- título: único `<h1>`;
- subtítulo: `<p>`;
- CTA: `<a>`.

## 6.7. Regras visuais

- preservar alinhamento atual;
- preservar fundo;
- preservar grid;
- preservar tipografia e paleta;
- não adicionar fotografia no hero;
- não adicionar ilustração de equipe;
- não adicionar logos;
- manter o H1 legível em duas a quatro linhas;
- CTA deve manter estilo primário existente;
- não aumentar a altura do hero de forma artificial;
- garantir que o início da seção seguinte continue perceptível em notebooks.

---

# 7. Seção Visão

## 7.1. Estrutura

Preservar o bloco atual e seus três resultados curtos.

## 7.2. Eyebrow

```text
Nossa visão
```

## 7.3. Frase principal

Manter a ideia atual, usando exatamente:

```text
Tecnologia deve ampliar a capacidade de uma empresa, não aumentar o esforço necessário para operá-la.
```

## 7.4. Três resultados

Substituir os textos atuais por:

```text
Menos esforço manual
```

```text
Sistemas mais integrados
```

```text
Soluções preparadas para evoluir
```

## 7.5. Regras

- manter três itens;
- não transformar em cards complexos;
- não adicionar parágrafos;
- não adicionar ícones novos;
- preservar o tratamento visual atual;
- manter o bloco curto e de leitura rápida.

---

# 8. Seção Origem e propósito

## 8.1. Mudança estrutural

Fundir integralmente:

- Nossa Origem;
- Nossa Missão.

Remover o bloco independente “Nossa Missão”.

## 8.2. Eyebrow

```text
Por que a consultoria existe
```

## 8.3. H2

```text
Tecnologia só gera valor quando melhora a forma como a empresa opera.
```

## 8.4. Corpo

Usar exatamente estes três parágrafos:

```text
Depois de mais de dez anos atuando em tecnologia no Brasil e na Alemanha, Marcelo Gonçalves acompanhou projetos com diferentes níveis de escala, maturidade e complexidade.
```

```text
Em muitos contextos, o desafio não era a ausência de ferramentas, mas o excesso de etapas, integrações frágeis, processos manuais e decisões técnicas que aumentavam o esforço necessário para manter a operação.
```

```text
A consultoria nasceu dessa experiência: aproximar engenharia e operação para construir soluções mais simples, integradas e capazes de evoluir sem transformar tecnologia em uma nova fonte de complexidade.
```

## 8.5. Destaque de propósito

Abaixo dos parágrafos, manter ou criar um callout simples usando o sistema visual atual.

### Rótulo

```text
Nosso propósito
```

### Texto

```text
Transformar tecnologia em eficiência operacional.
```

### Complemento

```text
Fazemos isso conectando processos, sistemas e plataformas com decisões técnicas proporcionais ao problema, ao risco e à realidade de cada empresa.
```

## 8.6. Regras visuais

- reutilizar um componente de callout existente, se houver;
- não criar ilustração;
- não usar números de experiência como destaque nesta seção;
- não inserir lista de tecnologias;
- não transformar a origem em linha do tempo;
- não inventar datas de fundação;
- não mencionar nomes de clientes;
- não mencionar empresas anteriores neste bloco.

---

# 9. Seção Princípios de engenharia

## 9.1. Origem

Esta seção substitui “Nossa Filosofia”.

## 9.2. Eyebrow

```text
Princípios de engenharia
```

## 9.3. H2

```text
Eficiência nasce de decisões bem projetadas.
```

## 9.4. Introdução

```text
Cada solução precisa funcionar no presente, continuar compreensível no futuro e evoluir sem comprometer o que já está em operação.
```

## 9.5. Número de princípios

Manter exatamente cinco.

## 9.6. Princípio 1

### Número

```text
01
```

### Título

```text
Simplicidade
```

### Texto

```text
Projetamos soluções fáceis de entender, operar e manter. A complexidade só deve existir quando o problema realmente exige.
```

## 9.7. Princípio 2

### Número

```text
02
```

### Título

```text
Modularidade
```

### Texto

```text
Organizamos sistemas em partes bem definidas, com responsabilidades claras e capacidade de evolução sem reconstruções desnecessárias.
```

## 9.8. Princípio 3

### Número

```text
03
```

### Título

```text
Automação
```

### Texto

```text
Procuramos eliminar esforço repetitivo, reduzir retrabalho e criar processos previsíveis antes de adicionar novas ferramentas.
```

## 9.9. Princípio 4

### Número

```text
04
```

### Título

```text
Clareza e precisão
```

### Texto

```text
Cada decisão técnica precisa ter propósito, critérios explícitos e relação direta com o resultado esperado para a operação.
```

## 9.10. Princípio 5

### Número

```text
05
```

### Título

```text
Evolução
```

### Texto

```text
Construímos soluções preparadas para mudanças, novas demandas e crescimento, sem transformar cada etapa em um novo começo.
```

---

# 10. Manifesto dentro da seção de princípios

## 10.1. Mudança estrutural

Remover integralmente o bloco independente:

```text
No que acreditamos
```

Remover seus três cards:

- Tecnologia com propósito;
- Eficiência antes da complexidade;
- Evolução sem recomeços.

Essas ideias já estão cobertas pelos cinco princípios.

## 10.2. Preservação da frase principal

Incorporar ao final da seção de princípios um callout ou faixa de manifesto.

### H3 ou frase destacada

```text
Tecnologia não existe para impressionar. Existe para tornar empresas mais eficientes.
```

### Texto

```text
Ferramentas, sistemas e automações só fazem sentido quando reduzem esforço, eliminam desperdícios e ampliam a capacidade das pessoas de realizar um trabalho melhor.
```

## 10.3. Regras

- não criar uma seção separada;
- o manifesto deve pertencer visualmente ao bloco de princípios;
- não numerar;
- não adicionar CTA;
- não repetir os cinco princípios;
- usar tratamento visual de encerramento;
- manter contraste e legibilidade.

---

# 11. Seção Como tomamos decisões

## 11.1. Origem

Esta seção substitui “Como Pensamos”.

Seu papel deve ser diferente dos princípios:

- princípios: critérios permanentes;
- esta seção: sequência mental aplicada às decisões.

## 11.2. Eyebrow

```text
Como tomamos decisões
```

## 11.3. H2

```text
Boa engenharia começa antes da implementação.
```

## 11.4. Introdução

```text
Não começamos escolhendo ferramentas. Primeiro entendemos o contexto, testamos premissas, priorizamos o impacto e somente então definimos a solução.
```

## 11.5. Número de etapas

Manter exatamente cinco para preservar o componente atual.

## 11.6. Etapa 1

### Número

```text
01
```

### Título

```text
Entendemos o contexto
```

### Texto

```text
Mapeamos a operação, as pessoas envolvidas, os sistemas existentes, as limitações e o resultado que precisa ser alcançado.
```

## 11.7. Etapa 2

### Número

```text
02
```

### Título

```text
Questionamos premissas
```

### Texto

```text
Verificamos se o problema está corretamente definido e se ele exige mais tecnologia, uma integração, uma mudança de processo ou uma combinação dessas alternativas.
```

## 11.8. Etapa 3

### Número

```text
03
```

### Título

```text
Priorizamos impacto
```

### Texto

```text
Comparamos esforço, risco, dependências e retorno esperado para identificar a evolução mais útil e viável.
```

## 11.9. Etapa 4

### Número

```text
04
```

### Título

```text
Projetamos a solução
```

### Texto

```text
Definimos componentes, integrações, responsabilidades e critérios técnicos proporcionais ao contexto e à capacidade de manutenção.
```

## 11.10. Etapa 5

### Número

```text
05
```

### Título

```text
Validamos e evoluímos
```

### Texto

```text
Observamos o uso real, verificamos os resultados e ajustamos a solução conforme a operação aprende e o negócio avança.
```

## 11.11. Regras visuais

- preservar o componente atual;
- manter numeração;
- manter ordem horizontal ou vertical atual;
- não transformar em cronograma de projeto;
- não repetir as cinco etapas da Home;
- não adicionar CTA;
- não utilizar palavras isoladas como títulos;
- garantir que títulos e textos tenham alturas flexíveis.

---

# 12. Seção Quem lidera a consultoria

## 12.1. Origem

Esta seção substitui o bloco “O que está por trás”.

## 12.2. Eyebrow

```text
Quem lidera a consultoria
```

## 12.3. H2

```text
Liderança técnica presente do diagnóstico à evolução.
```

## 12.4. Imagem

Manter a imagem atual de Marcelo Gonçalves.

Regras:

- não gerar nova imagem;
- não substituir por imagem de banco;
- manter proporção atual;
- não deformar;
- preservar tratamento visual atual;
- alt obrigatório:

```text
Marcelo Gonçalves, fundador e líder técnico da consultoria
```

Se a imagem for puramente decorativa e o nome estiver imediatamente adjacente, é aceitável usar alt vazio somente se a estrutura de acessibilidade atual justificar. Preferência: usar o alt definido.

## 12.5. Identificação

### Nome

```text
Marcelo Gonçalves
```

### Cargo

```text
Fundador e líder técnico
```

Não utilizar:

```text
Liderança técnica e fundador
```

## 12.6. Tags de função

Usar:

```text
Arquitetura
```

```text
Cloud e DevOps
```

```text
Automação
```

Não usar tag genérica “Engenharia” se o card já contém o cargo.

## 12.7. Biografia

Usar exatamente estes três parágrafos:

```text
Marcelo Gonçalves é engenheiro de Cloud e DevOps com mais de dez anos de experiência em tecnologia e atuação em projetos no Brasil e na Alemanha.
```

```text
Sua experiência reúne arquitetura AWS, infraestrutura como código, containers, integração de sistemas, automação e engenharia de software em ambientes que exigem segurança, confiabilidade e capacidade de evolução.
```

```text
Na consultoria, participa diretamente do entendimento do problema, da definição da solução e das principais decisões técnicas. O objetivo não é apenas implementar tecnologia, mas ajudar a empresa a construir algo que continue fazendo sentido depois da entrega.
```

## 12.8. Texto sobre o modelo boutique

Adicionar abaixo da biografia, dentro do mesmo macrobloco.

### H3

```text
Uma estrutura adaptável ao projeto
```

### Texto

```text
A liderança e a responsabilidade técnica permanecem centralizadas em Marcelo. Quando o escopo exige competências complementares, especialistas podem ser incorporados à entrega de acordo com a necessidade, sem que o cliente perca proximidade, clareza ou continuidade nas decisões.
```

## 12.9. Regras

Não afirmar:

- que Marcelo executará pessoalmente todas as tarefas;
- que existe uma equipe fixa;
- que todos os projetos terão especialistas externos;
- que a consultoria possui escritórios no Brasil e na Alemanha;
- que a consultoria atende globalmente;
- que Marcelo é especialista sênior em todas as áreas listadas;
- que existe atendimento 24 horas.

---

# 13. Experiência, certificações e competências

## 13.1. Estrutura

Manter os blocos atuais de autoridade, reorganizando-os dentro do macrobloco que sucede a biografia.

Usar exatamente quatro blocos:

1. experiência;
2. atuação internacional;
3. certificações;
4. competências.

## 13.2. Bloco 1 — Experiência

### Eyebrow

```text
Experiência
```

### Destaque

```text
10+ anos
```

### Título

```text
Tecnologia aplicada a ambientes reais
```

### Texto

```text
Experiência projetando, modernizando e operando soluções com diferentes níveis de escala, maturidade e criticidade.
```

## 13.3. Bloco 2 — Atuação internacional

### Eyebrow

```text
Atuação internacional
```

### Título

```text
Projetos no Brasil e na Alemanha
```

### Texto

```text
Vivência em equipes distribuídas e ambientes corporativos que exigem comunicação clara, segurança, confiabilidade e disciplina de engenharia.
```

### Tags

```text
Brasil
```

```text
Alemanha
```

```text
Equipes distribuídas
```

## 13.4. Bloco 3 — Certificações

### Eyebrow

```text
Certificações
```

### Título

```text
Conhecimento técnico validado
```

### Texto

```text
Certificações em arquitetura e operação AWS, infraestrutura como código e observabilidade complementam a experiência prática.
```

### Lista ou tags

Exibir, por extenso:

```text
AWS Certified Solutions Architect – Associate
```

```text
AWS Certified SysOps Administrator – Associate
```

```text
HashiCorp Certified: Terraform Associate
```

Permitir também:

```text
AWS Certified Cloud Practitioner
```

```text
Splunk Core Certified Power User
```

somente se essas certificações estiverem válidas ou se a política da plataforma permitir exibir certificações obtidas mesmo após expiração.

Não inventar datas, códigos de credencial ou links de verificação.

## 13.5. Bloco 4 — Competências

### Eyebrow

```text
Competências
```

### Título

```text
Capacidades que trabalham juntas
```

### Texto

```text
Uma atuação integrada entre estratégia técnica, arquitetura, implementação, automação e evolução contínua.
```

### Tags

Usar:

```text
Arquitetura AWS
```

```text
Cloud e DevOps
```

```text
Automação e integração
```

```text
Sistemas e plataformas
```

```text
Inteligência artificial aplicada
```

## 13.6. Regras visuais

- preservar o estilo dos cards atuais;
- não usar logotipos de certificação sem arquivos oficiais já presentes no projeto;
- não baixar ou incorporar badges de terceiros nesta tarefa;
- não transformar a lista em uma nuvem de dezenas de tecnologias;
- limitar as competências ao conjunto definido;
- manter os quatro blocos visualmente equilibrados;
- permitir quebra de tags;
- não usar altura fixa que corte certificações.

---

# 14. CTA final

## 14.1. Estrutura

Preservar o bloco visual atual, mas simplificar a área de ação.

A página Sobre deve usar a mesma lógica de CTA final definida para a Home.

## 14.2. Eyebrow

```text
Vamos conversar
```

## 14.3. H2

```text
Conte o que sua empresa precisa melhorar.
```

## 14.4. Parágrafo

```text
Descreva o processo, sistema ou desafio que precisa evoluir. Vamos avaliar a aderência, esclarecer os primeiros caminhos e definir se faz sentido avançar para um diagnóstico.
```

## 14.5. Lista

Usar exatamente:

```text
Processos manuais que consomem tempo e geram retrabalho
```

```text
Sistemas desconectados ou difíceis de evoluir
```

```text
Plataformas que precisam ganhar segurança, confiabilidade ou escala
```

## 14.6. Badge

Usar:

```text
Disponível para novos projetos
```

Exibir somente quando a configuração indicar disponibilidade.

Seguir a mesma implementação da Home.

## 14.7. Card de ação

### Rótulo

```text
Primeira conversa
```

### H3

```text
Vamos entender o problema e avaliar o próximo passo.
```

### Texto

```text
Você não precisa saber qual tecnologia ou serviço contratar. Começamos pelo contexto e identificamos o caminho mais adequado.
```

### CTA

```text
Apresentar um desafio
```

Destino:

```text
/contato
```

### Microcopy

```text
Sem compromisso · Retorno em até um dia útil
```

## 14.8. Remover

Remover:

```text
Vamos trabalhar juntos
```

Remover:

```text
Pronto para começar? Vamos conversar sobre seu projeto.
```

Remover:

```text
Se o que você viu aqui faz sentido para o seu momento, o próximo passo é simples: uma conversa sem compromisso para entender seu cenário.
```

Remover os quatro links:

- Engenharia de Software;
- Inteligência Artificial;
- Integração & Automação;
- Cloud & DevOps.

Remover:

```text
Conte-nos seu desafio. Nós ajudamos a encontrar a melhor solução.
```

Remover:

```text
Projetos sob medida · Primeira conversa sem compromisso
```

Substituir pelos textos definidos.

---

# 15. Elementos removidos da página

A implementação final não deverá renderizar:

- bloco independente “Nossa Missão”;
- bloco independente “No que acreditamos”;
- os três cards de crenças;
- repetição da frase “Tecnologia com propósito”;
- repetição de “Eficiência antes da complexidade”;
- repetição de “Evolução sem recomeços”;
- links dos quatro serviços dentro do CTA final;
- textos antigos do hero;
- “Sobre Nós”;
- “Liderança técnica e fundador”;
- “O que está por trás”;
- “Engenharia conduzida por quem constrói todos os dias”.

Remover os elementos do DOM.

Não ocultar apenas com CSS.

---

# 16. Elementos preservados

Preservar:

- ordem visual geral de cima para baixo;
- identidade visual;
- imagem de Marcelo;
- cinco princípios;
- cinco etapas do processo decisório;
- quatro blocos de autoridade;
- CTA final;
- componentes de card;
- animações existentes;
- tokens;
- grid;
- containers;
- cabeçalho;
- rodapé;
- links legais.

---

# 17. IDs de seção

Usar IDs únicos:

```text
visao
```

```text
origem
```

```text
principios
```

```text
decisoes
```

```text
lideranca
```

```text
experiencia
```

```text
contato
```

Aplicar `scroll-margin-top` compatível com o cabeçalho sticky.

Não duplicar IDs.

Não criar links de âncora visíveis sem necessidade.

---

# 18. Hierarquia de headings

Usar:

- hero: `<h1>`;
- origem: `<h2>`;
- princípios: `<h2>`;
- princípios individuais: `<h3>`;
- manifesto: `<h3>` ou parágrafo destacado;
- decisões: `<h2>`;
- etapas: `<h3>`;
- liderança: `<h2>`;
- nome de Marcelo: `<h3>`;
- estrutura adaptável: `<h3>`;
- blocos de experiência: `<h3>`;
- CTA final: `<h2>`;
- card do CTA: `<h3>`.

A frase principal da visão pode ser:

- `<h2>`, se o componente atual já a utiliza como heading; ou
- parágrafo destacado associado a um heading visualmente oculto.

Preferência: utilizar `<h2>`.

Não usar headings apenas para estilização.

Não pular níveis sem justificativa.

---

# 19. Responsividade

## 19.1. Princípio

Usar os breakpoints existentes.

Não criar uma nova estratégia global.

## 19.2. Hero

Desktop:

- preservar composição;
- limitar largura do texto;
- CTA abaixo do subtítulo.

Mobile:

- texto sem `nowrap`;
- CTA em largura adequada;
- sem corte;
- sem overflow;
- padding lateral atual.

## 19.3. Visão

Desktop:

- três itens na disposição atual.

Mobile:

- empilhar ou permitir quebra conforme o componente;
- manter ordem;
- não reduzir fonte a ponto de prejudicar leitura.

## 19.4. Origem e propósito

Desktop:

- preservar grid ou largura textual existente;
- callout abaixo dos parágrafos.

Mobile:

- uma coluna;
- callout com largura total;
- sem recuo excessivo.

## 19.5. Princípios

Desktop:

- preservar grid atual.

Tablet:

- duas colunas quando houver largura suficiente.

Mobile:

- uma coluna;
- números e títulos alinhados;
- textos completos;
- sem altura fixa.

## 19.6. Decisões

Não usar carrossel obrigatório.

Se o componente atual for horizontal:

- permitir quebra em tablet;
- empilhar em mobile;
- preservar numeração;
- não exigir gesto horizontal para ler todos os passos.

## 19.7. Liderança

Desktop:

- imagem e conteúdo podem permanecer lado a lado;
- biografia legível;
- cards de autoridade abaixo ou ao lado, conforme layout existente.

Mobile:

- imagem antes do texto;
- nome e cargo abaixo;
- biografia em uma coluna;
- bloco “Uma estrutura adaptável” após a biografia;
- cards de autoridade em uma coluna;
- certificações com quebra de linha.

## 19.8. CTA final

Seguir as mesmas regras da Home:

- duas áreas somente quando houver largura;
- uma coluna no mobile;
- card de ação após o texto principal;
- sem links concorrentes;
- botão sem corte.

## 19.9. Alturas

Não usar altura fixa em:

- cards de princípios;
- etapas;
- bio;
- certificações;
- CTA.

Permitir expansão do conteúdo com zoom e tradução futura.

---

# 20. Acessibilidade

## 20.1. Imagem

Alt:

```text
Marcelo Gonçalves, fundador e líder técnico da consultoria
```

## 20.2. Contraste

Manter WCAG AA para:

- texto;
- tags;
- CTAs;
- microcopy;
- manifesto;
- foco;
- cards.

## 20.3. Teclado

- todos os links acessíveis por Tab;
- foco visível;
- ordem coerente;
- CTA do hero antes do conteúdo seguinte;
- CTA final funcional com Enter;
- não usar div clicável.

## 20.4. Movimento

Respeitar:

```css
prefers-reduced-motion: reduce
```

Quando ativo:

- desabilitar animações não essenciais;
- evitar translações;
- manter conteúdo imediatamente disponível.

## 20.5. Semântica

- usar listas reais quando houver lista;
- usar `<article>` ou seção semântica para cards quando adequado;
- não usar `<br>` para criar espaçamento;
- não usar texto essencial em pseudo-elementos;
- não depender de cor para diferenciar categorias.

---

# 21. Metadados

## 21.1. Title

```text
Sobre a Consultoria | Marcelo Gonçalves
```

## 21.2. Description

```text
Conheça a consultoria boutique liderada por Marcelo Gonçalves, sua visão de engenharia, experiência em tecnologia, certificações e forma de conduzir projetos.
```

## 21.3. Open Graph

Usar o mesmo title e description.

Preservar a imagem atual, se adequada.

Não gerar nova imagem nesta tarefa.

## 21.4. Canonical

Usar:

```text
/sobre
```

com o domínio canônico configurado no projeto.

Em produção, não utilizar o domínio CloudFront como canonical definitivo.

---

# 22. Dados estruturados

Somente alterar se já houver JSON-LD no projeto.

Não instalar biblioteca.

## 22.1. Person

É permitido atualizar `Person` com:

- name: Marcelo Gonçalves;
- jobTitle: Fundador e líder técnico;
- knowsAbout: AWS, Cloud, DevOps, Automação, Engenharia de Software;
- url: domínio canônico da página Sobre.

Não adicionar:

- endereço pessoal;
- telefone pessoal;
- dados não públicos;
- clientes;
- prêmios;
- credenciais não verificadas.

## 22.2. Organization

Se existir `Organization`, descrever a entidade de forma compatível com:

```text
Consultoria boutique de tecnologia
```

Não afirmar número de funcionários.

Não criar `Organization` nova nesta tarefa se o projeto ainda não utiliza dados estruturados.

---

# 23. Implementação técnica

## 23.1. Reutilização

Reutilizar:

- componentes atuais;
- cards;
- callouts;
- tags;
- botões;
- grids;
- container;
- componente de CTA final;
- componente global de header;
- componente global de footer.

## 23.2. Dados

Se princípios, etapas ou certificações forem data-driven:

- atualizar a fonte de dados;
- não duplicar arrays no componente;
- usar identificadores estáveis;
- preservar tipagem;
- não usar índice como chave se houver identificador.

## 23.3. Refatoração

É permitido:

- fundir os dados de origem e missão;
- remover os dados de crenças;
- mover a frase do manifesto;
- reorganizar os cards de autoridade.

Não realizar refatoração ampla fora da página.

## 23.4. Dependências

Não instalar bibliotecas novas.

Não adicionar:

- slider;
- carrossel;
- timeline;
- pacote de badges;
- biblioteca de ícones;
- animação 3D;
- parallax;
- vídeo.

---

# 24. Analytics

Aplicar somente se existir helper de analytics.

Não instalar provedor.

Eventos recomendados:

```text
about_hero_services_click
```

```text
about_final_cta_click
```

Não rastrear visualização de cada princípio.

Não enviar dados pessoais.

Se não houver helper, ignorar e registrar como melhoria futura.

---

# 25. Elementos proibidos

A IA engenheira não deve:

- inventar uma história de fundação;
- criar data de fundação;
- inventar equipe;
- criar nomes de parceiros;
- inventar clientes;
- inventar países adicionais;
- afirmar escritório na Alemanha;
- afirmar operação global;
- criar depoimentos;
- criar logos;
- criar novas métricas;
- gerar foto;
- utilizar imagem de banco;
- criar seção de cultura;
- criar seção de vagas;
- criar seção de equipe;
- adicionar formulário na página;
- adicionar WhatsApp;
- adicionar calendário;
- criar modal;
- criar popup;
- adicionar newsletter;
- adicionar preço;
- reescrever os textos finais por iniciativa própria;
- manter seções removidas apenas escondidas;
- alterar a ordem final;
- alterar a paleta;
- alterar as fontes;
- transformar a página em currículo;
- listar todas as tecnologias conhecidas;
- citar empregadores sem autorização explícita;
- citar clientes corporativos sem autorização explícita.

---

# 26. Ordem de implementação

Executar:

1. Identificar o componente da rota `/sobre`.
2. Identificar dados e componentes reutilizados.
3. Atualizar o hero.
4. Atualizar a visão.
5. Fundir origem e missão.
6. Atualizar os cinco princípios.
7. Criar o manifesto dentro da seção de princípios.
8. Atualizar as cinco etapas decisórias.
9. Atualizar o bloco de Marcelo.
10. Adicionar o texto do modelo boutique.
11. Reorganizar os quatro blocos de autoridade.
12. Remover o bloco independente “No que acreditamos”.
13. Atualizar o CTA final.
14. Atualizar metadados.
15. Ajustar responsividade.
16. Validar acessibilidade.
17. Executar lint.
18. Executar testes.
19. Executar build.
20. Fazer revisão visual.

---

# 27. Testes obrigatórios

## 27.1. Conteúdo presente

Verificar que a página contém:

```text
Sobre a consultoria
```

```text
Engenharia próxima da operação
```

```text
Por que a consultoria existe
```

```text
Princípios de engenharia
```

```text
Como tomamos decisões
```

```text
Quem lidera a consultoria
```

```text
Fundador e líder técnico
```

```text
Uma estrutura adaptável ao projeto
```

```text
Tecnologia não existe para impressionar
```

```text
Apresentar um desafio
```

## 27.2. Conteúdo ausente

Verificar que não contém:

```text
Sobre Nós
```

```text
Nossa Missão
```

```text
Nossa Filosofia
```

```text
Como Pensamos
```

```text
O que está por trás
```

```text
No que acreditamos
```

```text
Liderança técnica e fundador
```

```text
Conte-nos seu desafio. Nós ajudamos a encontrar a melhor solução.
```

```text
Projetos sob medida · Primeira conversa sem compromisso
```

## 27.3. Navegação

Validar:

- hero CTA → `/servicos` ou fallback temporário `/#servicos`;
- CTA final → `/contato`;
- logo → `/`;
- menu “Sobre” permanece funcional;
- links do footer permanecem funcionais.

## 27.4. Responsividade

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
- imagem sem distorção;
- tags com quebra;
- certificações legíveis;
- CTA final em uma coluna no mobile;
- títulos sem `nowrap`.

## 27.5. Zoom

Validar:

- 100%;
- 200%.

Nenhum conteúdo pode desaparecer.

## 27.6. Teclado

Percorrer a página com Tab:

- foco visível;
- ordem coerente;
- sem armadilhas;
- links funcionais.

## 27.7. Certificações

Validar:

- nomes por extenso;
- sem badges quebrados;
- sem links fictícios;
- sem datas inventadas;
- sem certificação duplicada.

---

# 28. Critérios de aceite por bloco

## 28.1. Hero

- modelo boutique explícito;
- Marcelo mencionado;
- novo H1;
- CTA correto;
- sem linguagem de equipe ampla.

## 28.2. Visão

- frase central preservada;
- três resultados atualizados;
- bloco curto.

## 28.3. Origem

- origem e missão fundidas;
- trajetória Brasil e Alemanha;
- propósito explícito;
- nenhuma história inventada.

## 28.4. Princípios

- cinco princípios;
- textos exatos;
- manifesto incorporado;
- bloco de crenças removido.

## 28.5. Decisões

- cinco etapas;
- distinção clara em relação aos princípios;
- foco em raciocínio, não em cronograma.

## 28.6. Liderança

- foto preservada;
- nome e cargo corretos;
- três parágrafos;
- modelo boutique explicado;
- sem promessa de equipe fixa.

## 28.7. Autoridade

- quatro blocos;
- 10+ anos;
- Brasil e Alemanha;
- certificações;
- competências integradas;
- sem exagero.

## 28.8. CTA

- uma ação principal;
- sem links dos serviços;
- prazo de um dia útil;
- conversa sem compromisso;
- destino `/contato`.

---

# 29. Critérios de aceite da página completa

A implementação será aceita somente quando:

1. A página deixar claro que é uma consultoria boutique.
2. Marcelo estiver identificado como fundador e líder técnico.
3. O uso institucional de “nós” não implicar equipe fixa.
4. Origem e missão estiverem fundidas.
5. Princípios e processo decisório tiverem funções distintas.
6. O bloco “No que acreditamos” tiver sido removido.
7. Sua melhor frase tiver sido preservada como manifesto.
8. A experiência internacional estiver descrita sem sugerir escritórios internacionais.
9. As certificações estiverem nomeadas corretamente.
10. O modelo de especialistas complementares estiver explicado.
11. A liderança técnica direta estiver clara.
12. A página não parecer um currículo.
13. A página não parecer uma empresa de grande porte.
14. A identidade visual estiver preservada.
15. A estrutura final estiver na ordem definida.
16. Não houver conteúdo redundante.
17. Não houver novos textos inventados.
18. Não houver links quebrados.
19. A página funcionar em desktop, tablet e mobile.
20. O build e os testes terminarem sem erros.

---

# 30. Checklist de revisão humana

- [ ] O hero comunica consultoria boutique.
- [ ] O H1 não fica excessivamente longo em desktop.
- [ ] O subtítulo não sugere equipe ampla.
- [ ] A visão continua curta.
- [ ] Origem e missão não aparecem duplicadas.
- [ ] O texto da origem é factual.
- [ ] Os cinco princípios permanecem escaneáveis.
- [ ] O manifesto não parece uma nova seção completa.
- [ ] As etapas decisórias não repetem a Home.
- [ ] A foto de Marcelo está nítida e sem deformação.
- [ ] O cargo está escrito “Fundador e líder técnico”.
- [ ] A biografia não parece currículo.
- [ ] O modelo boutique está explicado.
- [ ] As certificações estão legíveis.
- [ ] As tags não vazam do container.
- [ ] O bloco “No que acreditamos” não existe no DOM.
- [ ] O CTA final possui uma única ação.
- [ ] O CTA aponta para `/contato`.
- [ ] O prazo é de até um dia útil.
- [ ] Não há “Solicitar diagnóstico”.
- [ ] Não há “nossa equipe”.
- [ ] Não há nomes de clientes.
- [ ] Não há erros ortográficos.
- [ ] Não há headings fora de ordem.
- [ ] Não há overflow horizontal.
- [ ] O foco de teclado está visível.
- [ ] `prefers-reduced-motion` é respeitado.
- [ ] Lint concluído.
- [ ] Testes concluídos.
- [ ] Build concluído.

---

# 31. Resultado esperado

Ao final, a página deverá comunicar:

> A consultoria é uma estrutura boutique, liderada diretamente por Marcelo Gonçalves, que aproxima engenharia e operação para construir soluções mais simples, integradas, confiáveis e preparadas para evoluir.

O visitante deverá entender:

- por que a consultoria existe;
- como ela pensa;
- quais princípios orientam as decisões;
- quem conduz os projetos;
- qual experiência sustenta a proposta;
- como competências adicionais podem participar;
- por que existe responsabilidade técnica direta;
- qual é o próximo passo.
