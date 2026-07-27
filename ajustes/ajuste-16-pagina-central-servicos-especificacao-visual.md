# Especificação definitiva — Página central de Serviços

## 0. Finalidade, escopo e precedência

Este documento define, de forma exaustiva e diretamente executável, a criação da página central de Serviços da plataforma.

A página deverá ser criada na rota:

```text
/servicos
```

Ela não será uma repetição resumida das quatro páginas individuais.

Sua função é:

1. ajudar o visitante a reconhecer o tipo de problema que possui;
2. explicar a arquitetura comercial dos serviços;
3. mostrar que diferentes competências podem participar da mesma solução;
4. orientar o visitante para a página individual mais adequada;
5. conduzir ao contato sem exigir que a pessoa conheça previamente a tecnologia necessária.

Este documento substitui integralmente qualquer especificação anterior referente à página central de Serviços, inclusive o arquivo anteriormente identificado como Ajuste 5.

Em caso de conflito:

1. este documento prevalece sobre a estrutura, os textos e o comportamento de `/servicos`;
2. os nomes e posicionamentos das páginas individuais seguem os Ajustes 9, 10, 11 e 12;
3. o cabeçalho, o rodapé e o CTA global seguem o Ajuste 7;
4. o contato e as queries de preseleção seguem o Ajuste 14;
5. as provas, métricas e estudos de caso seguem o Ajuste 13.

A IA engenheira não deverá:

- criar uma página diferente por interpretação;
- escolher textos alternativos;
- resumir os textos;
- inventar serviços;
- inventar resultados;
- adicionar preços;
- adicionar depoimentos;
- adicionar logos;
- adicionar tecnologias não especificadas;
- criar uma estética nova;
- copiar integralmente as páginas individuais;
- transformar a página em um catálogo técnico;
- criar formulário;
- instalar bibliotecas;
- alterar as rotas das páginas individuais nesta tarefa.

---

# 1. Fontes analisadas

A especificação foi definida a partir da estrutura e do estilo atualmente utilizados em:

```text
https://dsns2wusdrj9z.cloudfront.net/
```

```text
https://dsns2wusdrj9z.cloudfront.net/sobre
```

```text
https://dsns2wusdrj9z.cloudfront.net/automacao
```

```text
https://dsns2wusdrj9z.cloudfront.net/inteligencia-artificial
```

```text
https://dsns2wusdrj9z.cloudfront.net/software
```

```text
https://dsns2wusdrj9z.cloudfront.net/plataforma
```

Data de referência:

```text
27 de julho de 2026
```

---

# 2. Diagnóstico do estilo da plataforma

## 2.1. Identidade visual percebida

A plataforma utiliza uma linguagem visual:

- minimalista;
- institucional;
- técnica;
- editorial;
- clara;
- espaçosa;
- baseada em tons frios e superfícies azuladas;
- com contraste moderado;
- sem excesso de imagens;
- sustentada por tipografia grande;
- organizada por cards, listas, etapas e callouts.

A página central deverá aprofundar essa linguagem, não substituí-la.

## 2.2. Elementos visuais recorrentes que devem ser preservados

Preservar:

- fundos claros azulados;
- títulos em azul muito escuro;
- cor de destaque azul dessaturada;
- cards com cantos arredondados;
- bordas discretas;
- sombras leves;
- grande quantidade de espaço em branco;
- pequenos rótulos acima dos títulos;
- títulos editoriais grandes;
- parágrafos curtos;
- tags em formato de chips;
- ícones lineares;
- numeração em etapas;
- alternância de superfícies;
- CTAs com forte contraste;
- tratamento técnico sem aparência de painel administrativo.

## 2.3. Pontos fortes do estilo atual

A página central deverá preservar:

- sensação de organização;
- legibilidade;
- autoridade técnica;
- calma visual;
- ausência de elementos promocionais agressivos;
- predominância do conteúdo;
- coerência entre páginas;
- cards suficientemente amplos para textos explicativos;
- combinação entre linguagem institucional e profundidade técnica.

## 2.4. Riscos do estilo atual

A página central deverá corrigir, sem redesenhar a plataforma:

1. repetição excessiva de grids de cards semelhantes;
2. todas as competências recebendo o mesmo peso visual;
3. excesso de listas técnicas antes da compreensão do problema;
4. títulos genéricos como “O que fazemos” e “Onde fazemos a diferença”;
5. muitas seções com a mesma sequência:
   - eyebrow;
   - título;
   - parágrafo;
   - grid;
6. repetição de CTAs completos;
7. páginas longas que explicam capacidades, mas orientam pouco a escolha;
8. ausência de uma visão central que organize as quatro páginas individuais.

## 2.5. Resposta de design

A página central deverá:

- funcionar como um mapa de decisão;
- introduzir assimetria controlada nos blocos;
- agrupar as quatro competências em duas frentes;
- utilizar cards compactos para problemas;
- utilizar cards amplos para serviços;
- utilizar uma faixa sem cards para princípios;
- não repetir a lista completa de capacidades técnicas;
- reservar as explicações aprofundadas para as páginas individuais.

---

# 3. Objetivo comercial

A página deverá comunicar:

> A consultoria ajuda empresas a melhorar a operação por meio de duas frentes complementares: eficiência e automação dos processos; plataformas e modernização tecnológica.

As quatro competências são:

1. Automação e Integração de Processos;
2. Inteligência Artificial Aplicada;
3. Sistemas e Plataformas Digitais;
4. Cloud, DevOps e Confiabilidade.

A página deverá deixar claro que:

- o visitante não precisa saber qual serviço contratar;
- um projeto pode combinar competências;
- a escolha parte do problema;
- tecnologia é definida depois do contexto;
- a consultoria possui estrutura boutique;
- Marcelo participa das principais decisões técnicas;
- especialistas complementares podem participar quando necessário;
- a primeira conversa avalia aderência;
- diagnósticos aprofundados podem ser uma etapa comercial.

---

# 4. Público prioritário

A primeira camada de leitura deverá ser compreensível para:

- sócios;
- proprietários;
- diretores;
- gestores de operações;
- gestores administrativos;
- gestores financeiros;
- responsáveis por processos;
- líderes de tecnologia;
- responsáveis por produto;
- equipes internas que precisam de apoio especializado.

O conteúdo técnico deverá existir, mas não dominar a primeira leitura.

---

# 5. Estrutura final obrigatória

A página deverá seguir exatamente esta ordem:

1. Cabeçalho global;
2. Hero;
3. Comece pelo problema;
4. Frentes de atuação;
5. Como as competências se combinam;
6. Como começamos;
7. Princípios comuns;
8. Perguntas frequentes;
9. CTA final;
10. Rodapé global.

Não adicionar outras seções.

---

# 6. Sistema visual da página

## 6.1. Regra principal

Reutilizar:

- componentes;
- variáveis;
- fontes;
- breakpoints;
- botões;
- chips;
- ícones;
- animações;
- sombras;
- containers;
- espaçamentos globais;

já existentes no projeto.

Não criar um design system paralelo.

## 6.2. Tokens de referência

Quando houver variáveis existentes, utilizar as variáveis.

Os valores abaixo são os fallbacks oficiais da página.

```css
--services-page-bg: #eef3fa;
--services-surface-elevated: #e6eef8;
--services-surface-card: #f5f8fc;
--services-surface-inset: #e0ecf7;
--services-border: #c8d9ee;

--services-accent: #3b5f8a;
--services-accent-hover: #2d4f76;
--services-accent-soft: #ebf1f8;
--services-heading: #1e3a57;
```

Para o texto de corpo, utilizar a variável global atual.

Se não existir variável apropriada, usar um tom derivado do heading com contraste WCAG AA.

Não criar novas cores para cada serviço.

## 6.3. Container

Usar:

```css
max-width: 1200px;
margin-inline: auto;
padding-inline: clamp(20px, 4vw, 40px);
```

Conteúdo de leitura:

```css
max-width: 760px;
```

Hero:

```css
max-width: 920px;
```

## 6.4. Espaçamento entre seções

Desktop:

```css
padding-block: 112px;
```

Tablet:

```css
padding-block: 88px;
```

Mobile:

```css
padding-block: 64px;
```

O hero poderá utilizar:

```css
padding-top: clamp(96px, 11vw, 144px);
padding-bottom: clamp(80px, 9vw, 120px);
```

Não utilizar altura fixa.

## 6.5. Tipografia

Reutilizar a família tipográfica atual.

### H1

```css
font-size: clamp(2.75rem, 5.4vw, 4.75rem);
line-height: 0.99;
letter-spacing: -0.045em;
font-weight: 700;
```

### H2

```css
font-size: clamp(2rem, 3.5vw, 3.25rem);
line-height: 1.06;
letter-spacing: -0.035em;
font-weight: 700;
```

### H3 principal de cards

```css
font-size: clamp(1.35rem, 2vw, 1.75rem);
line-height: 1.15;
letter-spacing: -0.02em;
font-weight: 700;
```

### Corpo introdutório

```css
font-size: clamp(1.0625rem, 1.5vw, 1.25rem);
line-height: 1.65;
```

### Corpo de card

```css
font-size: 1rem;
line-height: 1.65;
```

### Eyebrow

Reutilizar o componente global.

Fallback:

```css
font-size: 0.78rem;
line-height: 1;
font-weight: 700;
letter-spacing: 0.12em;
text-transform: uppercase;
```

Não utilizar caixa alta em títulos.

## 6.6. Bordas e raios

Cards compactos:

```css
border-radius: 20px;
```

Cards de serviço:

```css
border-radius: 24px;
```

Painéis de frente:

```css
border-radius: 32px;
```

Botões:

reutilizar o raio global.

Fallback:

```css
border-radius: 12px;
```

Chips:

```css
border-radius: 999px;
```

## 6.7. Bordas

Usar:

```css
border: 1px solid var(--services-border);
```

Não usar bordas com espessura superior a 1px como padrão.

## 6.8. Sombras

Usar somente sombra discreta.

Fallback:

```css
box-shadow: 0 18px 48px rgba(30, 58, 87, 0.08);
```

No estado hover:

```css
box-shadow: 0 22px 56px rgba(30, 58, 87, 0.12);
```

Não usar sombras escuras, difusas ou múltiplas.

## 6.9. Movimento

Cards poderão utilizar:

```css
transform: translateY(-3px);
```

no hover.

Transição:

```css
transition:
  transform 180ms ease,
  box-shadow 180ms ease,
  border-color 180ms ease;
```

Respeitar:

```css
@media (prefers-reduced-motion: reduce)
```

Nesse modo:

- remover deslocamento;
- remover scroll suave forçado;
- reduzir ou eliminar transições.

## 6.10. Ícones

Reutilizar os ícones lineares atuais.

Cada ícone deverá:

- ocupar entre 24px e 28px;
- estar dentro de uma área de 48px;
- utilizar a cor de destaque;
- possuir fundo suave;
- ter `aria-hidden="true"` quando decorativo.

Não utilizar:

- emojis;
- ilustrações 3D;
- logos de tecnologias;
- robôs;
- cérebros;
- engrenagens genéricas;
- foguetes;
- nuvens como elemento dominante.

## 6.11. Elementos visuais proibidos

Não adicionar:

- gradientes;
- blobs;
- efeitos de vidro;
- neon;
- fundos pretos;
- ilustrações de banco;
- mockups;
- screenshots;
- dashboards fictícios;
- linhas de código decorativas;
- animações 3D;
- parallax;
- vídeo;
- carrossel;
- cores próprias para cada serviço.

---

# 7. Rota, navegação e estado ativo

## 7.1. Criar rota

Criar uma página real em:

```text
/servicos
```

A rota não poderá resolver para a Home.

## 7.2. Cabeçalho

O item:

```text
Serviços
```

deverá apontar para:

```text
/servicos
```

e aparecer ativo nesta página.

## 7.3. Dropdown

Se o cabeçalho utilizar dropdown, a ordem deverá ser:

1. Visão geral dos serviços;
2. Automação e Integração de Processos;
3. Inteligência Artificial Aplicada;
4. Sistemas e Plataformas Digitais;
5. Cloud, DevOps e Confiabilidade.

### Links

```text
/servicos
```

```text
/automacao
```

```text
/inteligencia-artificial
```

```text
/software
```

```text
/plataforma
```

## 7.4. Rodapé

O link “Serviços” deverá apontar para:

```text
/servicos
```

---

# 8. Hero

## 8.1. Estrutura

Ordem obrigatória:

1. eyebrow;
2. H1;
3. subtítulo;
4. grupo de CTAs;
5. microcopy.

## 8.2. Eyebrow

```text
Serviços
```

## 8.3. H1

```text
Tecnologia aplicada aos pontos que mais limitam a operação.
```

## 8.4. Subtítulo

```text
Ajudamos empresas em crescimento a automatizar processos, conectar sistemas, construir plataformas e modernizar ambientes AWS. Cada projeto combina apenas as competências necessárias para resolver o problema com clareza e continuidade.
```

## 8.5. CTA principal

```text
Apresentar um desafio
```

Destino:

```text
/contato
```

## 8.6. CTA secundário

```text
Explorar as frentes
```

Destino:

```text
#frentes
```

## 8.7. Microcopy

```text
Consultoria boutique · Liderança técnica direta · Retorno em até um dia útil
```

## 8.8. Regras visuais

- fundo da página;
- conteúdo alinhado conforme o padrão atual;
- sem imagem;
- sem cards;
- sem lista de tecnologias;
- dois CTAs lado a lado em desktop;
- CTAs empilhados em mobile;
- H1 com largura máxima de 900px;
- subtítulo com largura máxima de 780px;
- microcopy abaixo dos CTAs;
- não adicionar badge de disponibilidade;
- não adicionar números;
- não adicionar quatro links de serviços.

## 8.9. Semântica

- H1 único;
- eyebrow não heading;
- subtítulo como `<p>`;
- CTAs como `<a>`;
- microcopy como `<p>` ou `<small>`.

---

# 9. Seção — Comece pelo problema

## 9.1. ID

```text
problemas
```

## 9.2. Superfície

Usar:

```text
--services-surface-elevated
```

A seção deverá ocupar toda a largura da viewport, com conteúdo dentro do container.

## 9.3. Eyebrow

```text
Comece pelo problema
```

## 9.4. H2

```text
Você não precisa saber qual serviço contratar.
```

## 9.5. Introdução

```text
Os sinais abaixo ajudam a identificar a frente mais próxima do desafio. Se mais de um deles fizer sentido, a solução poderá combinar competências.
```

## 9.6. Quantidade

Exibir exatamente quatro cards compactos.

## 9.7. Ordem

1. Processos manuais;
2. Conhecimento e documentos;
3. Sistemas limitados;
4. Plataforma difícil de operar.

---

# 10. Card de problema 1

## 10.1. Número

```text
01
```

## 10.2. Título

```text
A operação depende de tarefas manuais.
```

## 10.3. Texto

```text
Dados são copiados entre sistemas, aprovações acontecem por e-mail e atividades recorrentes consomem tempo da equipe.
```

## 10.4. Link

```text
Ver Automação e Integração
```

Destino:

```text
#automacao-integracao
```

---

# 11. Card de problema 2

## 11.1. Número

```text
02
```

## 11.2. Título

```text
Informações e documentos consomem tempo demais.
```

## 11.3. Texto

```text
Conhecimento está disperso, solicitações precisam ser triadas e documentos exigem leitura, classificação ou resumo repetitivos.
```

## 11.4. Link

```text
Ver Inteligência Artificial
```

Destino:

```text
#inteligencia-artificial
```

---

# 12. Card de problema 3

## 12.1. Número

```text
03
```

## 12.2. Título

```text
Os sistemas não acompanham o processo.
```

## 12.3. Texto

```text
Planilhas, ferramentas fragmentadas e aplicações difíceis de evoluir impedem que a operação tenha uma base digital adequada.
```

## 12.4. Link

```text
Ver Sistemas e Plataformas
```

Destino:

```text
#sistemas-plataformas
```

---

# 13. Card de problema 4

## 13.1. Número

```text
04
```

## 13.2. Título

```text
A plataforma ficou difícil de entregar e operar.
```

## 13.3. Texto

```text
Ambientes manuais, deploys arriscados, falhas pouco visíveis ou custos crescentes limitam a evolução das aplicações.
```

## 13.4. Link

```text
Ver Cloud, DevOps e Confiabilidade
```

Destino:

```text
#cloud-devops-confiabilidade
```

## 13.5. Regras visuais dos cards de problema

Desktop:

- grid de duas colunas;
- gap de 24px.

Card:

```css
padding: 28px;
background: var(--services-surface-card);
```

Regras:

- número pequeno acima do título;
- título como `<h3>`;
- link textual no rodapé;
- sem tags;
- sem ícones;
- sem lista;
- altura equivalente em cada linha;
- não tornar o card inteiro clicável;
- hover somente no link ou borda discreta;
- mobile em uma coluna.

---

# 14. Seção — Frentes de atuação

## 14.1. ID

```text
frentes
```

## 14.2. Superfície

Usar o fundo principal da página.

## 14.3. Eyebrow

```text
Frentes de atuação
```

## 14.4. H2

```text
Duas frentes, quatro competências que trabalham juntas.
```

## 14.5. Introdução

```text
A estrutura organiza as especialidades sem transformar cada desafio em uma escolha isolada. A combinação final depende dos processos, dos sistemas existentes, dos riscos e dos resultados esperados.
```

## 14.6. Estrutura

Exibir exatamente dois painéis de frente, empilhados.

Cada painel deverá conter:

1. rótulo;
2. título;
3. descrição;
4. dois cards de serviço.

---

# 15. Painel 1 — Eficiência e automação da operação

## 15.1. Rótulo

```text
Frente 01
```

## 15.2. Título

```text
Eficiência e automação da operação
```

## 15.3. Descrição

```text
Reduzimos esforço manual, organizamos a circulação de informações e incorporamos inteligência a tarefas em que interpretação e conhecimento são relevantes.
```

## 15.4. Cards

1. Automação e Integração de Processos;
2. Inteligência Artificial Aplicada.

---

# 16. Card — Automação e Integração de Processos

## 16.1. ID

```text
automacao-integracao
```

Aplicar `scroll-margin-top`.

## 16.2. Número

```text
01
```

## 16.3. Rótulo

```text
Eficiência operacional
```

## 16.4. Título

```text
Automação e Integração de Processos
```

## 16.5. Descrição

```text
Conectamos sistemas e automatizamos atividades repetitivas para reduzir erros, retrabalho e tempo operacional.
```

## 16.6. Rótulo da lista

```text
Indicado quando
```

## 16.7. Lista

```text
O mesmo dado é inserido ou conferido em diferentes sistemas
```

```text
Aprovações e tarefas recorrentes dependem de acompanhamento manual
```

```text
Relatórios, documentos ou notificações consomem tempo da equipe
```

## 16.8. Tags

```text
Integrações
```

```text
Workflows
```

```text
Automação
```

## 16.9. CTA

```text
Conhecer Automação e Integração
```

Destino:

```text
/automacao
```

---

# 17. Card — Inteligência Artificial Aplicada

## 17.1. ID

```text
inteligencia-artificial
```

Aplicar `scroll-margin-top`.

## 17.2. Número

```text
02
```

## 17.3. Rótulo

```text
IA aplicada
```

## 17.4. Título

```text
Inteligência Artificial Aplicada
```

## 17.5. Descrição

```text
Integramos inteligência artificial a documentos, conhecimento e sistemas para ampliar produtividade e apoiar tarefas com critérios de qualidade e controle.
```

## 17.6. Rótulo da lista

```text
Indicado quando
```

## 17.7. Lista

```text
Informações importantes estão dispersas em documentos e bases internas
```

```text
Leitura, classificação ou triagem consomem esforço recorrente
```

```text
Sistemas podem receber apoio inteligente com permissões e supervisão
```

## 17.8. Tags

```text
Assistentes
```

```text
Documentos
```

```text
Agentes controlados
```

## 17.9. CTA

```text
Conhecer Inteligência Artificial
```

Destino:

```text
/inteligencia-artificial
```

---

# 18. Painel 2 — Plataformas e modernização tecnológica

## 18.1. Rótulo

```text
Frente 02
```

## 18.2. Título

```text
Plataformas e modernização tecnológica
```

## 18.3. Descrição

```text
Construímos e evoluímos a base digital da operação, desde sistemas e APIs até a arquitetura AWS, os ambientes e os processos de entrega.
```

## 18.4. Cards

1. Sistemas e Plataformas Digitais;
2. Cloud, DevOps e Confiabilidade.

---

# 19. Card — Sistemas e Plataformas Digitais

## 19.1. ID

```text
sistemas-plataformas
```

Aplicar `scroll-margin-top`.

## 19.2. Número

```text
03
```

## 19.3. Rótulo

```text
Engenharia de software
```

## 19.4. Título

```text
Sistemas e Plataformas Digitais
```

## 19.5. Descrição

```text
Construímos e modernizamos sistemas internos, portais, APIs e plataformas ligados a processos específicos da empresa.
```

## 19.6. Rótulo da lista

```text
Indicado quando
```

## 19.7. Lista

```text
Planilhas e ferramentas fragmentadas sustentam processos importantes
```

```text
O sistema atual não acompanha novas regras, integrações ou usuários
```

```text
A operação precisa de um portal, módulo ou plataforma específica
```

## 19.8. Tags

```text
Sistemas
```

```text
APIs
```

```text
Modernização
```

## 19.9. CTA

```text
Conhecer Sistemas e Plataformas
```

Destino:

```text
/software
```

---

# 20. Card — Cloud, DevOps e Confiabilidade

## 20.1. ID

```text
cloud-devops-confiabilidade
```

Aplicar `scroll-margin-top`.

## 20.2. Número

```text
04
```

## 20.3. Rótulo

```text
Plataformas AWS
```

## 20.4. Título

```text
Cloud, DevOps e Confiabilidade
```

## 20.5. Descrição

```text
Projetamos e modernizamos plataformas AWS para aumentar segurança, observabilidade, previsibilidade de entrega e capacidade de evolução.
```

## 20.6. Rótulo da lista

```text
Indicado quando
```

## 20.7. Lista

```text
Ambientes e implantações dependem de procedimentos manuais
```

```text
Falhas são difíceis de detectar, diagnosticar ou recuperar
```

```text
A arquitetura, a segurança ou os custos precisam de maior controle
```

## 20.8. Tags

```text
AWS
```

```text
DevOps
```

```text
Confiabilidade
```

## 20.9. CTA

```text
Conhecer Cloud, DevOps e Confiabilidade
```

Destino:

```text
/plataforma
```

---

# 21. Layout dos painéis de frente

## 21.1. Desktop amplo

Em larguras a partir de 1200px, cada painel deverá utilizar:

```css
display: grid;
grid-template-columns:
  minmax(240px, 0.72fr)
  minmax(0, 1fr)
  minmax(0, 1fr);
gap: 24px;
```

A primeira coluna contém:

- rótulo;
- título;
- descrição.

As duas colunas seguintes contêm os cards.

## 21.2. Tablet

Entre o breakpoint tablet e 1199px:

- introdução do painel em largura total;
- dois cards abaixo, em duas colunas.

## 21.3. Mobile

- uma coluna;
- introdução;
- primeiro card;
- segundo card.

## 21.4. Aparência do painel

```css
padding: clamp(24px, 4vw, 40px);
background: var(--services-surface-elevated);
border: 1px solid var(--services-border);
border-radius: 32px;
```

Espaço entre os painéis:

```css
margin-top: 32px;
```

## 21.5. Aparência dos cards de serviço

```css
display: flex;
flex-direction: column;
padding: 32px;
background: var(--services-surface-card);
border: 1px solid var(--services-border);
border-radius: 24px;
min-width: 0;
```

O CTA deverá permanecer no rodapé:

```css
margin-top: auto;
padding-top: 28px;
```

## 21.6. Regras

- card não deve ser totalmente clicável;
- apenas CTA é link;
- nenhuma lista pode ser truncada;
- títulos devem quebrar;
- tags podem quebrar linha;
- cards do mesmo painel devem ter altura equivalente;
- não adicionar ícone grande;
- é permitido reutilizar ícone pequeno da Home;
- não adicionar ferramentas além das tags definidas.

---

# 22. Seção — Como as competências se combinam

## 22.1. ID

```text
combinacoes
```

## 22.2. Superfície

Usar:

```text
--services-surface-inset
```

## 22.3. Eyebrow

```text
Competências integradas
```

## 22.4. H2

```text
Um problema pode exigir mais de uma frente.
```

## 22.5. Introdução

```text
Os cenários abaixo são ilustrativos. Eles mostram como diferentes competências podem participar da mesma solução sem transformar cada projeto em um pacote fechado.
```

## 22.6. Quantidade

Exibir exatamente três cards.

## 22.7. Rótulo comum

Cada card deverá exibir:

```text
Cenário ilustrativo
```

Não utilizar:

- estudo de caso;
- resultado;
- projeto realizado;
- cliente;
- antes e depois.

---

# 23. Cenário 1 — Aprovação e gestão de contratos

## 23.1. Título

```text
Aprovação e gestão de contratos
```

## 23.2. Problema

### Rótulo

```text
Situação
```

### Texto

```text
Solicitações chegam por canais diferentes, documentos precisam ser conferidos e aprovações são difíceis de acompanhar.
```

## 23.3. Possível combinação

### Rótulo

```text
Possível combinação
```

### Texto

```text
Um portal operacional organiza o processo, workflows automatizam etapas e recursos de IA apoiam a leitura e a classificação dos documentos.
```

## 23.4. Tags

```text
Sistemas
```

```text
Automação
```

```text
IA aplicada
```

---

# 24. Cenário 2 — Conhecimento e atendimento interno

## 24.1. Título

```text
Conhecimento e atendimento interno
```

## 24.2. Problema

### Rótulo

```text
Situação
```

### Texto

```text
Políticas, procedimentos e respostas estão dispersos, aumentando o tempo necessário para orientar equipes e atender solicitações.
```

## 24.3. Possível combinação

### Rótulo

```text
Possível combinação
```

### Texto

```text
Um assistente consulta fontes autorizadas, uma interface organiza o acesso e a plataforma sustenta segurança, observabilidade e evolução.
```

## 24.4. Tags

```text
IA aplicada
```

```text
Sistemas
```

```text
Cloud
```

---

# 25. Cenário 3 — Modernização de uma operação crítica

## 25.1. Título

```text
Modernização de uma operação crítica
```

## 25.2. Problema

### Rótulo

```text
Situação
```

### Texto

```text
Uma aplicação importante ficou difícil de alterar, os deploys dependem de procedimentos manuais e as integrações geram falhas recorrentes.
```

## 25.3. Possível combinação

### Rótulo

```text
Possível combinação
```

### Texto

```text
A aplicação evolui por etapas, as integrações ganham controles e os ambientes passam a ser versionados, observáveis e entregues por pipelines.
```

## 25.4. Tags

```text
Sistemas
```

```text
Automação
```

```text
Cloud e DevOps
```

## 25.5. Regras visuais dos cenários

Desktop:

- três colunas.

Tablet:

- uma coluna para cada card ou duas mais uma, conforme largura;
- preferir uma coluna quando o texto ficar comprimido.

Mobile:

- uma coluna.

Card:

```css
padding: 30px;
background: var(--services-surface-card);
border: 1px solid var(--services-border);
border-radius: 24px;
```

Não adicionar CTA.

---

# 26. Seção — Como começamos

## 26.1. ID

```text
primeiro-passo
```

## 26.2. Superfície

Usar o fundo principal.

## 26.3. Eyebrow

```text
Primeiro passo
```

## 26.4. H2

```text
A conversa começa pelo contexto, não pela tecnologia.
```

## 26.5. Introdução

```text
O início do trabalho varia conforme o nível de definição do desafio. A primeira conversa serve para avaliar a aderência e organizar o próximo passo.
```

## 26.6. Quantidade

Exibir exatamente quatro etapas.

---

# 27. Etapa 1

## 27.1. Número

```text
01
```

## 27.2. Título

```text
Apresentação do desafio
```

## 27.3. Texto

```text
A empresa descreve a situação atual, as pessoas envolvidas, os sistemas existentes e o resultado que espera alcançar.
```

---

# 28. Etapa 2

## 28.1. Número

```text
02
```

## 28.2. Título

```text
Enquadramento
```

## 28.3. Texto

```text
Avaliamos a aderência, identificamos as competências mais próximas e esclarecemos dúvidas essenciais antes de qualquer recomendação.
```

---

# 29. Etapa 3

## 29.1. Número

```text
03
```

## 29.2. Título

```text
Diagnóstico ou descoberta
```

## 29.3. Texto

```text
Quando o problema exige levantamento, acesso a informações ou definição detalhada, essa análise pode ser estruturada como uma etapa comercial própria.
```

---

# 30. Etapa 4

## 30.1. Número

```text
04
```

## 30.2. Título

```text
Proposta e execução
```

## 30.3. Texto

```text
Com contexto suficiente, definimos escopo, responsabilidades, critérios de aceite, etapas e modelo de continuidade.
```

## 30.4. Nota

```text
A primeira conversa não cria obrigação de contratação ou de apresentação de proposta.
```

## 30.5. Regras visuais

Desktop:

- quatro colunas;
- divisores discretos entre etapas;
- sem cards completos.

Tablet:

- grid de duas colunas.

Mobile:

- uma coluna;
- divisor horizontal;
- ordem preservada.

Não adicionar CTA nesta seção.

---

# 31. Seção — Princípios comuns

## 31.1. ID

```text
principios
```

## 31.2. Superfície

Usar:

```text
--services-surface-elevated
```

## 31.3. Eyebrow

```text
Em todas as frentes
```

## 31.4. H2

```text
A mesma disciplina de engenharia orienta cada projeto.
```

## 31.5. Introdução

```text
As tecnologias variam. Os critérios que orientam a solução permanecem.
```

## 31.6. Quantidade

Exibir exatamente quatro princípios.

## 31.7. Princípio 1

### Título

```text
Problema antes da ferramenta
```

### Texto

```text
A tecnologia só é escolhida depois que o contexto, as restrições e o resultado esperado estão claros.
```

## 31.8. Princípio 2

### Título

```text
Arquitetura proporcional
```

### Texto

```text
A solução deve responder ao risco, ao volume e à capacidade de manutenção, sem antecipar complexidade desnecessária.
```

## 31.9. Princípio 3

### Título

```text
Entrega incremental
```

### Texto

```text
Priorizamos etapas úteis e testáveis para reduzir incerteza, validar premissas e permitir correções antes de ampliar o escopo.
```

## 31.10. Princípio 4

### Título

```text
Operação e continuidade
```

### Texto

```text
Segurança, observabilidade, documentação e manutenção são consideradas desde o projeto, não apenas depois da entrega.
```

## 31.11. Regras visuais

Não utilizar cards completos.

Desktop:

- faixa de quatro colunas;
- divisores verticais de 1px;
- padding horizontal entre itens.

Mobile:

- uma coluna;
- divisores horizontais;
- itens com padding vertical.

Não adicionar ícones.

---

# 32. Perguntas frequentes

## 32.1. ID

```text
perguntas
```

## 32.2. Superfície

Usar fundo principal.

## 32.3. Eyebrow

```text
Perguntas frequentes
```

## 32.4. H2

```text
Dúvidas antes de escolher uma frente de atuação
```

## 32.5. Quantidade

Usar exatamente oito perguntas.

---

# 33. Pergunta 1

## 33.1. Pergunta

```text
Preciso saber qual serviço contratar?
```

## 33.2. Resposta

```text
Não. Descreva o problema, o processo ou o sistema que precisa evoluir. A primeira análise serve para identificar as competências mais relacionadas ao contexto.
```

---

# 34. Pergunta 2

## 34.1. Pergunta

```text
Um projeto pode envolver mais de um serviço?
```

## 34.2. Resposta

```text
Sim. Um portal pode exigir desenvolvimento, integrações, automação, inteligência artificial e uma plataforma AWS. As competências são combinadas conforme a necessidade, e não vendidas como um pacote obrigatório.
```

---

# 35. Pergunta 3

## 35.1. Pergunta

```text
A consultoria atende somente pequenas e médias empresas?
```

## 35.2. Resposta

```text
O foco principal são pequenas e médias empresas em crescimento. Também podem ser avaliados projetos específicos para organizações maiores, especialmente em AWS, DevOps, automação, integração e modernização.
```

---

# 36. Pergunta 4

## 36.1. Pergunta

```text
É possível trabalhar com os sistemas e ambientes que já utilizamos?
```

## 36.2. Resposta

```text
Sim. A primeira alternativa é entender o que pode ser integrado, adaptado ou modernizado. A substituição completa só deve ser considerada quando a base atual impede uma evolução segura ou economicamente viável.
```

---

# 37. Pergunta 5

## 37.1. Pergunta

```text
Todo projeto começa com um diagnóstico?
```

## 37.2. Resposta

```text
Não necessariamente. A primeira conversa avalia aderência e contexto. Quando o desafio exige levantamento, análise de ambiente, definição de requisitos ou recomendações detalhadas, o diagnóstico pode ser uma etapa comercial própria.
```

---

# 38. Pergunta 6

## 38.1. Pergunta

```text
A primeira conversa possui custo?
```

## 38.2. Resposta

```text
Não. Ela serve para conhecer o contexto, esclarecer os primeiros pontos e avaliar a aderência. Ela não inclui automaticamente diagnóstico detalhado, arquitetura, plano de ação ou proposta.
```

---

# 39. Pergunta 7

## 39.1. Pergunta

```text
Quem participa dos projetos?
```

## 39.2. Resposta

```text
Marcelo Gonçalves lidera o entendimento, a arquitetura e as principais decisões técnicas. Especialistas complementares podem participar quando o escopo exige outras competências.
```

---

# 40. Pergunta 8

## 40.1. Pergunta

```text
Existe acompanhamento depois da entrega?
```

## 40.2. Resposta

```text
O modelo de continuidade é definido conforme a solução. Pode incluir acompanhamento inicial, correções, observabilidade, evolução ou transferência estruturada para a equipe do cliente.
```

## 40.3. Regras do accordion

- reutilizar componente atual;
- perguntas como `<button>`;
- `aria-expanded`;
- `aria-controls`;
- Enter e Espaço;
- foco visível;
- respostas no HTML;
- sem respostas vazias;
- respeitar movimento reduzido;
- largura máxima de 900px;
- centralizar o bloco;
- não adicionar colunas no desktop.

---

# 41. CTA final

## 41.1. ID

```text
contato
```

## 41.2. Componente

Reutilizar o componente global definido no Ajuste 7.

## 41.3. Eyebrow

```text
Vamos conversar
```

## 41.4. H2

```text
Conte o que está limitando sua operação.
```

## 41.5. Parágrafo

```text
Descreva o processo, sistema ou desafio que precisa evoluir. Vamos avaliar a aderência, esclarecer os primeiros caminhos e definir se faz sentido avançar.
```

## 41.6. Lista

```text
Processos manuais que consomem tempo e geram retrabalho
```

```text
Sistemas desconectados ou difíceis de evoluir
```

```text
Plataformas que precisam ganhar segurança, confiabilidade ou escala
```

## 41.7. Badge

```text
Disponível para novos projetos
```

Exibir somente quando a configuração global indicar disponibilidade.

## 41.8. Card de ação

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
Você não precisa saber qual tecnologia ou serviço contratar. Começamos pelo contexto e identificamos a combinação de competências mais adequada.
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

## 41.9. Regras

- uma ação principal;
- sem quatro links de serviços;
- sem CTA secundário;
- sem promessa de diagnóstico;
- sem prazo de duas horas;
- sem duração fixa;
- sem formulário.

---

# 42. Cabeçalho e rodapé

## 42.1. Cabeçalho

O item “Serviços” deverá aparecer ativo.

CTA global:

```text
Apresentar um desafio
```

Destino:

```text
/contato
```

## 42.2. Rodapé

Descrição e links deverão seguir o Ajuste 7.

Lista de especialidades:

```text
Automação e Integração
```

```text
Inteligência Artificial Aplicada
```

```text
Sistemas e Plataformas
```

```text
Cloud, DevOps e Confiabilidade
```

Não criar um rodapé específico para esta página.

---

# 43. Hierarquia de headings

Usar:

- Hero: `<h1>`;
- Comece pelo problema: `<h2>`;
- cards de problema: `<h3>`;
- Frentes de atuação: `<h2>`;
- títulos das frentes: `<h3>`;
- serviços: `<h3>` ou `<h4>` conforme agrupamento semântico;
- Combinações: `<h2>`;
- cenários: `<h3>`;
- Como começamos: `<h2>`;
- etapas: `<h3>`;
- Princípios: `<h2>`;
- princípios: `<h3>`;
- FAQ: `<h2>`;
- CTA final: `<h2>`;
- card do CTA: `<h3>`.

Para os cards de serviço dentro de uma frente:

- título da frente deve ser `<h3>`;
- títulos dos serviços devem ser `<h4>`.

Não usar headings apenas por estilo.

---

# 44. IDs e âncoras

Usar exatamente:

```text
problemas
```

```text
frentes
```

```text
automacao-integracao
```

```text
inteligencia-artificial
```

```text
sistemas-plataformas
```

```text
cloud-devops-confiabilidade
```

```text
combinacoes
```

```text
primeiro-passo
```

```text
principios
```

```text
perguntas
```

```text
contato
```

Aplicar:

```css
scroll-margin-top: calc(var(--header-height, 80px) + 24px);
```

Não duplicar IDs.

---

# 45. Responsividade

## 45.1. Breakpoints

Reutilizar os breakpoints existentes.

Caso seja necessário definir fallbacks:

```css
--bp-mobile: 640px;
--bp-tablet: 900px;
--bp-desktop: 1200px;
```

Não alterar breakpoints globais.

## 45.2. Hero

Desktop:

- conteúdo com largura máxima;
- dois CTAs lado a lado.

Mobile:

- dois CTAs empilhados;
- largura total quando compatível com o componente;
- texto sem corte;
- microcopy com quebra natural.

## 45.3. Cards de problema

Desktop e tablet amplo:

- duas colunas.

Mobile:

- uma coluna.

## 45.4. Painéis de frente

Desktop amplo:

- introdução + dois cards em três colunas.

Tablet:

- introdução em largura total;
- dois cards.

Mobile:

- tudo empilhado.

## 45.5. Cenários

Desktop:

- três colunas.

Tablet:

- uma ou duas colunas conforme largura útil;
- não comprimir texto.

Mobile:

- uma coluna.

## 45.6. Etapas

Desktop:

- quatro colunas.

Tablet:

- duas colunas.

Mobile:

- uma coluna.

## 45.7. Princípios

Desktop:

- quatro colunas com divisores.

Tablet:

- duas colunas, com divisores adequados.

Mobile:

- uma coluna com divisores horizontais.

## 45.8. FAQ

- largura legível;
- pergunta com quebra;
- ícone sem sobreposição;
- área de toque mínima adequada.

## 45.9. Zoom

Validar:

- 100%;
- 200%.

Nenhum conteúdo poderá:

- desaparecer;
- sobrepor;
- ficar truncado;
- exigir rolagem horizontal da página.

---

# 46. Acessibilidade

## 46.1. Contraste

Manter WCAG AA para:

- headings;
- texto;
- links;
- botões;
- chips;
- bordas;
- foco;
- accordion;
- microcopy.

## 46.2. Teclado

Validar:

- CTAs;
- links de problema;
- links de serviço;
- links de âncora;
- FAQ;
- menu;
- dropdown;
- botão de voltar ao topo.

## 46.3. Estado ativo

O item “Serviços” do menu não pode depender somente de cor.

## 46.4. Ícones

Ícones decorativos:

```text
aria-hidden="true"
```

## 46.5. Links

- navegação interna com `<a>`;
- não usar `<button>` para links;
- não usar `<div onClick>`;
- não aninhar links;
- páginas internas na mesma aba.

## 46.6. Movimento

Respeitar:

```text
prefers-reduced-motion
```

## 46.7. Listas

Usar:

```html
<ul>
<li>
```

para itens de “Indicado quando”.

---

# 47. SEO e metadados

## 47.1. Title

```text
Serviços de Automação, IA, Software e AWS | Marcelo Gonçalves
```

## 47.2. Description

```text
Conheça os serviços de automação e integração, inteligência artificial aplicada, sistemas e plataformas digitais e arquitetura AWS com DevOps e confiabilidade.
```

## 47.3. Canonical

```text
/servicos
```

## 47.4. Open Graph

Usar o mesmo title e description.

Preservar a imagem institucional atual, se adequada.

Não gerar imagem nesta tarefa.

## 47.5. Indexação

```text
index, follow
```

## 47.6. Sitemap

Adicionar:

```text
/servicos
```

## 47.7. Dados estruturados

Somente se o projeto já utilizar JSON-LD.

É permitido criar ou atualizar:

```text
CollectionPage
```

contendo referências às quatro páginas `Service`.

Não adicionar:

- preços;
- offers;
- reviews;
- ratings;
- clientes;
- garantias;
- disponibilidade;
- área geográfica não verificada.

---

# 48. Analytics

Aplicar somente se existir helper.

Não instalar provedor.

## 48.1. Eventos

```text
services_page_view
```

```text
services_hero_primary_click
```

```text
services_hero_explore_click
```

```text
services_problem_link_click
```

```text
services_service_click
```

```text
services_faq_toggle
```

```text
services_final_cta_click
```

## 48.2. Propriedades permitidas

- `problemId`;
- `serviceId`;
- `faqId`;
- `position`;
- `ctaType`.

## 48.3. Dados proibidos

Não enviar:

- texto livre;
- dados pessoais;
- título completo da página como dado redundante;
- query de usuário;
- referrer completo sem sanitização.

A página deve funcionar sem analytics.

---

# 49. Implementação técnica

## 49.1. Arquivo

Criar ou utilizar o componente responsável por:

```text
/servicos
```

Não duplicar a Home.

## 49.2. CSS

Criar stylesheet próprio ou módulo no padrão atual.

Nome sugerido, se coerente com a estrutura:

```text
app/servicos/servicos.css
```

Não assumir o nome sem verificar o projeto.

## 49.3. Dados

Centralizar os quatro serviços em uma fonte tipada.

Estrutura equivalente:

```ts
interface CentralService {
  id:
    | "automacao-integracao"
    | "inteligencia-artificial"
    | "sistemas-plataformas"
    | "cloud-devops-confiabilidade";

  number: string;
  frontId: "operational-efficiency" | "technology-platforms";

  label: string;
  title: string;
  description: string;
  suitableWhen: string[];
  tags: string[];

  href: string;
  ctaLabel: string;
  iconId?: string;
}
```

Não duplicar textos em mais de um componente.

## 49.4. Frentes

Estrutura equivalente:

```ts
interface ServiceFront {
  id: "operational-efficiency" | "technology-platforms";
  number: string;
  title: string;
  description: string;
  serviceIds: CentralService["id"][];
}
```

## 49.5. Reutilização

Reutilizar:

- Button;
- SectionLabel;
- Tag;
- Accordion;
- CTA final;
- Header;
- Footer;
- Container;
- ícones;
- animação de entrada, se existente.

## 49.6. Não instalar

- biblioteca de cards;
- biblioteca de animação;
- biblioteca de ícones;
- carousel;
- tabs;
- accordion novo;
- analytics;
- grid framework;
- CSS-in-JS adicional.

## 49.7. JavaScript

Não usar JavaScript para:

- grids;
- responsividade;
- hover;
- links de âncora;
- altura igual de cards.

Usar CSS.

---

# 50. Elementos proibidos

A IA engenheira não deverá:

- copiar o conteúdo completo das páginas individuais;
- criar lista extensa de tecnologias;
- criar seção “Nossas tecnologias”;
- adicionar logos AWS, Kubernetes, Terraform ou modelos de IA;
- criar planos;
- criar pacotes;
- criar preços;
- criar orçamento automático;
- criar comparação entre serviços;
- criar formulário;
- criar calculadora;
- criar depoimentos;
- criar logos de clientes;
- criar métricas;
- criar casos reais;
- transformar cenários ilustrativos em cases;
- criar fotos;
- criar mockups;
- adicionar mais de quatro serviços;
- adicionar consultoria genérica como quinto serviço;
- adicionar diagnóstico como card de serviço;
- adicionar suporte como serviço;
- adicionar alocação;
- adicionar body shop;
- criar tabs que escondem serviços;
- criar carrossel;
- adicionar sticky navigation interna;
- adicionar sidebar;
- usar cores distintas para cada serviço;
- alterar fontes;
- alterar a paleta;
- alterar o header localmente;
- alterar o footer localmente;
- reescrever textos definidos.

---

# 51. Ordem de implementação

Executar:

1. Verificar componentes e tokens globais.
2. Criar rota `/servicos`.
3. Atualizar link do menu.
4. Atualizar link do rodapé.
5. Criar fonte tipada de serviços.
6. Criar fonte tipada de frentes.
7. Implementar hero.
8. Implementar mapa de problemas.
9. Implementar os dois painéis de frente.
10. Implementar os quatro cards.
11. Implementar cenários ilustrativos.
12. Implementar processo inicial.
13. Implementar princípios.
14. Implementar FAQ.
15. Integrar CTA final global.
16. Atualizar metadata.
17. Atualizar sitemap.
18. Atualizar JSON-LD somente se existente.
19. Ajustar responsividade.
20. Validar acessibilidade.
21. Adicionar analytics somente se existir helper.
22. Executar lint.
23. Executar testes.
24. Executar build.
25. Revisar visualmente.
26. Validar links.
27. Validar âncoras.
28. Validar estado ativo do menu.

---

# 52. Testes obrigatórios

## 52.1. Rota

Testar:

- `/servicos` retorna 200;
- não renderiza a Home;
- canonical correto;
- menu ativo;
- sitemap.

## 52.2. Hero

Validar:

- H1 único;
- dois CTAs;
- âncora;
- contato;
- microcopy;
- sem imagens.

## 52.3. Problemas

Validar:

- quatro cards;
- quatro links;
- âncoras corretas;
- ordem correta;
- sem cards inteiros clicáveis.

## 52.4. Frentes

Validar:

- duas frentes;
- dois serviços por frente;
- quatro serviços no total;
- IDs únicos;
- CTAs corretos;
- listas com três itens;
- tags com três itens.

## 52.5. Links

Validar:

```text
/automacao
```

```text
/inteligencia-artificial
```

```text
/software
```

```text
/plataforma
```

```text
/contato
```

## 52.6. Cenários

- três cards;
- rótulo “Cenário ilustrativo”;
- sem métricas;
- sem CTA;
- sem linguagem de case real.

## 52.7. Processo

- quatro etapas;
- sem CTA;
- nota de não obrigação;
- sem diagnóstico gratuito.

## 52.8. Princípios

- quatro itens;
- sem cards completos;
- divisores;
- sem ícones.

## 52.9. FAQ

- oito perguntas;
- oito respostas;
- teclado;
- aria;
- foco;
- sem respostas vazias.

## 52.10. Responsividade

Validar:

- 360px;
- 390px;
- 768px;
- 900px;
- 1024px;
- 1200px;
- 1366px;
- 1440px;
- zoom 200%.

Verificar:

- ausência de overflow;
- títulos sem corte;
- tags com quebra;
- cards sem altura fixa;
- CTAs sem sobreposição;
- painéis corretamente empilhados;
- ordem do conteúdo;
- divisores.

## 52.11. Acessibilidade

Validar:

- heading hierarchy;
- foco;
- teclado;
- contraste;
- links;
- accordion;
- movimento reduzido;
- leitores de tela;
- estado ativo do menu.

## 52.12. Build

- lint sem erros;
- testes sem erros;
- build sem erros;
- nenhuma regressão na Home;
- nenhuma regressão nas páginas individuais;
- nenhum link quebrado.

---

# 53. Critérios de aceite por seção

## 53.1. Hero

- comunica resultado;
- não lista tecnologias;
- dois CTAs;
- aparência coerente;
- sem imagem.

## 53.2. Problemas

- orienta sem exigir conhecimento técnico;
- quatro sinais distintos;
- links para as competências;
- cards compactos.

## 53.3. Frentes

- arquitetura comercial explícita;
- duas frentes;
- quatro competências;
- cards amplos;
- conteúdo suficiente para escolha;
- sem copiar páginas individuais.

## 53.4. Combinações

- explica projetos multidisciplinares;
- três cenários;
- caráter ilustrativo;
- sem métricas.

## 53.5. Como começamos

- primeira conversa;
- enquadramento;
- diagnóstico possível;
- proposta;
- nenhuma obrigação automática.

## 53.6. Princípios

- problema;
- proporcionalidade;
- incremento;
- continuidade;
- faixa visual distinta.

## 53.7. FAQ

- escolha;
- combinação;
- porte;
- sistemas existentes;
- diagnóstico;
- custo da conversa;
- participantes;
- acompanhamento.

## 53.8. CTA

- uma ação;
- sem links concorrentes;
- sem promessa de diagnóstico;
- prazo correto.

---

# 54. Critérios de aceite da página completa

A implementação será aceita somente quando:

1. `/servicos` for uma página própria.
2. O estilo permanecer coerente com a plataforma.
3. A página não introduzir nova paleta.
4. A página não introduzir novas fontes.
5. O visitante começar pelo problema.
6. As duas frentes comerciais estiverem explícitas.
7. Os quatro serviços estiverem corretamente agrupados.
8. Automação e IA estiverem na frente operacional.
9. Sistemas e Cloud estiverem na frente de plataformas.
10. O visitante entender que serviços podem ser combinados.
11. Cenários ilustrativos não parecerem cases.
12. A página não repetir as páginas individuais.
13. A página não listar tecnologias em excesso.
14. A primeira conversa não for confundida com diagnóstico.
15. Não houver preços.
16. Não houver métricas inventadas.
17. Não houver clientes ou logos.
18. Não houver formulário.
19. O CTA final utilizar o componente global.
20. O menu e o rodapé apontarem para `/servicos`.
21. A página funcionar em desktop, tablet e mobile.
22. Não houver overflow.
23. Não houver regressão de acessibilidade.
24. O build terminar sem erros.
25. Os textos estiverem exatamente como especificados.

---

# 55. Checklist final de revisão humana

- [ ] `/servicos` criada.
- [ ] Página não renderiza a Home.
- [ ] Menu ativo.
- [ ] Dropdown atualizado.
- [ ] Rodapé atualizado.
- [ ] Hero correto.
- [ ] H1 correto.
- [ ] Dois CTAs corretos.
- [ ] Microcopy correta.
- [ ] Quatro problemas presentes.
- [ ] Quatro âncoras funcionais.
- [ ] Duas frentes presentes.
- [ ] Frente operacional correta.
- [ ] Frente tecnológica correta.
- [ ] Quatro serviços presentes.
- [ ] Três itens “Indicado quando” em cada card.
- [ ] Três tags em cada card.
- [ ] Links individuais corretos.
- [ ] Três cenários ilustrativos.
- [ ] Nenhuma métrica nos cenários.
- [ ] Quatro etapas comerciais.
- [ ] Nota de não obrigação presente.
- [ ] Quatro princípios.
- [ ] Princípios sem cards completos.
- [ ] Oito FAQs respondidas.
- [ ] CTA final correto.
- [ ] Sem formulário.
- [ ] Sem preços.
- [ ] Sem logos.
- [ ] Sem depoimentos.
- [ ] Sem novas cores.
- [ ] Sem novas fontes.
- [ ] Sem carrossel.
- [ ] Sem tabs.
- [ ] Metadata atualizada.
- [ ] Canonical correto.
- [ ] Sitemap atualizado.
- [ ] Analytics sem PII.
- [ ] Mobile validado.
- [ ] Tablet validado.
- [ ] Desktop validado.
- [ ] Zoom 200% validado.
- [ ] Teclado validado.
- [ ] Contraste validado.
- [ ] Movimento reduzido respeitado.
- [ ] Sem overflow.
- [ ] Lint concluído.
- [ ] Testes concluídos.
- [ ] Build concluído.

---

# 56. Resultado esperado

Ao final, a página deverá comunicar:

> A consultoria possui quatro competências organizadas em duas frentes complementares. O visitante começa pelo problema, entende as possibilidades e escolhe um aprofundamento sem precisar conhecer previamente a tecnologia adequada.

A página deverá parecer:

- parte natural da plataforma;
- mais organizada que a seção de serviços da Home;
- menos técnica que as páginas individuais;
- mais orientadora que um catálogo;
- suficientemente completa para apoiar uma decisão;
- suficientemente concisa para não substituir as páginas especializadas.

O visitante deverá sair da página sabendo:

- qual problema mais se aproxima do seu;
- quais serviços podem ajudar;
- que diferentes serviços podem ser combinados;
- como o primeiro passo funciona;
- que não precisa escolher sozinho;
- onde aprofundar;
- como apresentar o desafio.
