# Ajuste 17A — Navegação global

## 0. Finalidade, escopo e precedência

Este documento define, de forma exaustiva e diretamente executável, a navegação global pública da plataforma.

O escopo inclui:

- cabeçalho desktop;
- cabeçalho mobile;
- logo;
- menu principal;
- item Serviços;
- dropdown de Serviços;
- menu lateral ou drawer mobile;
- estado ativo;
- relações entre rotas;
- foco;
- teclado;
- comportamento sticky;
- comportamento durante scroll;
- bloqueio de scroll no mobile;
- progressive enhancement;
- responsividade;
- analytics da navegação;
- testes;
- critérios de aceite.

Este documento não inclui:

- rodapé;
- páginas legais;
- cookies;
- consentimento;
- SEO global;
- sitemap;
- redirects;
- páginas 404 ou 500;
- segurança de produção;
- conteúdo das páginas;
- CTA interno das páginas.

Esses temas serão tratados nos Ajustes 17B a 17G.

Em caso de conflito:

1. este documento prevalece sobre qualquer instrução anterior relativa ao cabeçalho e à navegação global;
2. o Ajuste 16 prevalece sobre o conteúdo da página central `/servicos`;
3. os Ajustes 15A a 15D prevalecem sobre as rotas e nomenclaturas editoriais;
4. o Ajuste 14 prevalece sobre a página `/contato`;
5. os textos globais de CTA definidos neste documento prevalecem somente no cabeçalho;
6. a IA engenheira não deverá alterar rodapé ou páginas internas durante esta implementação.

A implementação deverá preservar a identidade visual existente.

A IA engenheira não deverá:

- criar uma nova linguagem visual;
- alterar a paleta;
- trocar tipografia;
- criar um mega menu complexo;
- adicionar animações decorativas;
- instalar biblioteca de navegação;
- instalar biblioteca de focus trap se já houver solução no projeto;
- criar submenu de terceiro nível;
- adicionar login;
- adicionar busca global;
- adicionar seletor de idioma;
- adicionar tema claro ou escuro;
- adicionar ícones sociais;
- alterar rotas;
- manter duas fontes de verdade para desktop e mobile;
- duplicar manualmente os itens do menu em vários componentes;
- utilizar hover como única forma de acesso ao submenu;
- transformar o link Serviços em um botão sem destino;
- ocultar links importantes em menus não acessíveis;
- inventar novos itens.

---

# 1. Diagnóstico da navegação atual

## 1.1. Estrutura observada

A navegação atual utiliza, em diferentes páginas, a sequência:

```text
Home
Serviços
Contato
Sobre
Blog
O Projeto
```

O CTA varia entre:

```text
Solicitar diagnóstico
```

e:

```text
Conheça nossos serviços
```

A estrutura aparece duplicada no conteúdo renderizado para desktop e mobile.

## 1.2. Problemas identificados

A navegação atual apresenta:

1. ordem pouco orientada à jornada do visitante;
2. Contato antes de Sobre e do conteúdo editorial;
3. uso de `Blog`, embora a rota editorial definitiva seja `/artigos`;
4. CTA `Solicitar diagnóstico`, incompatível com o processo comercial definido;
5. CTA diferente em páginas editoriais;
6. Serviços sem uma página central própria consolidada na versão atual;
7. nomes antigos nas páginas individuais;
8. risco de duas listas independentes para desktop e mobile;
9. ausência de uma relação formal entre páginas de serviço e o item pai Serviços;
10. ausência de especificação para estado ativo em posts e categorias;
11. ausência de regra clara para teclado;
12. ausência de regra clara para abrir e fechar o submenu;
13. ausência de comportamento definido para Escape;
14. ausência de regra de foco para drawer mobile;
15. ausência de regra para bloqueio de scroll;
16. ausência de comportamento sem JavaScript;
17. risco de dropdown acionado somente por hover;
18. risco de links e botões aninhados;
19. risco de mudanças de altura durante scroll;
20. risco de diferentes CTAs conforme a página.

---

# 2. Objetivos da navegação

A navegação deverá:

1. orientar o visitante pelas principais superfícies;
2. dar acesso direto à página central de Serviços;
3. permitir aprofundamento nas quatro competências;
4. utilizar nomenclaturas definitivas;
5. apresentar o mesmo conteúdo em desktop e mobile;
6. tornar clara a seção atual;
7. funcionar integralmente por teclado;
8. funcionar em telas pequenas;
9. preservar a identidade visual;
10. manter uma única fonte de verdade;
11. não exigir hover;
12. manter acesso à navegação quando JavaScript falhar;
13. não ocupar espaço desproporcional;
14. não competir visualmente com os heróis das páginas;
15. conduzir ao contato sem prometer diagnóstico.

---

# 3. Ordem definitiva do menu

Usar exatamente esta ordem:

1. Home;
2. Serviços;
3. Sobre;
4. Artigos;
5. O Projeto;
6. Contato;
7. CTA Apresentar um desafio.

## 3.1. Links

```text
Home → /
Serviços → /servicos
Sobre → /sobre
Artigos → /artigos
O Projeto → /o-projeto
Contato → /contato
Apresentar um desafio → /contato
```

## 3.2. Remoções

Remover globalmente do cabeçalho:

```text
Blog
```

Remover:

```text
Solicitar diagnóstico
```

Remover:

```text
Conheça nossos serviços
```

como CTA do cabeçalho.

Remover qualquer variação de:

```text
Fale conosco
Vamos conversar
Solicitar orçamento
Agendar conversa
```

no cabeçalho.

## 3.3. Regra do CTA

O CTA global do cabeçalho será sempre:

```text
Apresentar um desafio
```

Destino:

```text
/contato
```

Não alterar conforme a rota.

---

# 4. Rotas relacionadas a Serviços

O item Serviços é considerado ativo nas seguintes rotas:

```text
/servicos
/automacao
/inteligencia-artificial
/software
/plataforma
```

Também deverá ser considerado ativo em futuras subrotas explicitamente registradas como pertencentes à área de serviços.

Não utilizar comparação genérica por substring que possa marcar rotas incorretas.

Usar um mapeamento explícito.

Exemplo conceitual:

```ts
const serviceRouteMap = {
  "/servicos": "services-overview",
  "/automacao": "automation-integration",
  "/inteligencia-artificial": "applied-ai",
  "/software": "systems-platforms",
  "/plataforma": "cloud-devops-reliability",
} as const;
```

---

# 5. Rotas relacionadas a Artigos

O item Artigos é considerado ativo em:

```text
/artigos
/post/[slug]
/categoria/[slug]
```

Também deverá ser considerado ativo em:

- paginação de `/artigos`;
- busca de `/artigos`;
- páginas de categoria válidas;
- futuras rotas em português explicitamente associadas ao sistema editorial.

Não marcar Artigos como ativo em:

```text
/o-projeto
```

Embora O Projeto possua artigos relacionados, ele é uma seção independente.

---

# 6. Fonte única de verdade

## 6.1. Obrigatoriedade

Criar uma configuração central da navegação.

Desktop e mobile deverão consumir os mesmos dados.

Não manter:

- array desktop;
- array mobile;
- links escritos diretamente em JSX;
- labels duplicados;
- rotas duplicadas;
- descrições duplicadas.

## 6.2. Estrutura sugerida

```ts
type PrimaryNavigationId =
  | "home"
  | "services"
  | "about"
  | "articles"
  | "project"
  | "contact";

type ServiceNavigationId =
  | "services-overview"
  | "automation-integration"
  | "applied-ai"
  | "systems-platforms"
  | "cloud-devops-reliability";

interface NavigationLink {
  id: PrimaryNavigationId;
  label: string;
  href: string;
  activePatterns: string[];
  children?: ServiceNavigationLink[];
}

interface ServiceNavigationLink {
  id: ServiceNavigationId;
  label: string;
  description: string;
  href: string;
  activePatterns: string[];
  iconId?: string;
}
```

## 6.3. Configuração esperada

```ts
const primaryNavigation: NavigationLink[] = [
  {
    id: "home",
    label: "Home",
    href: "/",
    activePatterns: ["/"],
  },
  {
    id: "services",
    label: "Serviços",
    href: "/servicos",
    activePatterns: [
      "/servicos",
      "/automacao",
      "/inteligencia-artificial",
      "/software",
      "/plataforma",
    ],
    children: serviceNavigation,
  },
  {
    id: "about",
    label: "Sobre",
    href: "/sobre",
    activePatterns: ["/sobre"],
  },
  {
    id: "articles",
    label: "Artigos",
    href: "/artigos",
    activePatterns: [
      "/artigos",
      "/post",
      "/categoria",
    ],
  },
  {
    id: "project",
    label: "O Projeto",
    href: "/o-projeto",
    activePatterns: ["/o-projeto"],
  },
  {
    id: "contact",
    label: "Contato",
    href: "/contato",
    activePatterns: ["/contato"],
  },
];
```

A implementação concreta poderá utilizar outro formato, desde que:

- exista uma única fonte;
- seja tipada;
- desktop e mobile reutilizem;
- estado ativo seja previsível;
- testes possam importar a configuração.

---

# 7. Cabeçalho — estrutura geral

## 7.1. HTML semântico

Usar estrutura equivalente:

```html
<header class="site-header">
  <div class="site-header__container">
    <a class="site-header__brand" href="/">
      Marcelo Gonçalves
    </a>

    <nav aria-label="Navegação principal">
      ...
    </nav>

    <a class="site-header__cta" href="/contato">
      Apresentar um desafio
    </a>

    <button class="site-header__menu-button">
      ...
    </button>
  </div>
</header>
```

## 7.2. ID do topo

Adicionar ao início da aplicação ou do layout:

```html
id="top"
```

O header não deverá receber o ID `top` quando isso causar comportamento incorreto em mudanças de rota.

## 7.3. Quantidade de H1

O header não deverá conter heading.

O nome da marca não deverá ser H1.

## 7.4. Landmark

Deverá existir apenas uma navegação principal visível por viewport.

Quando menu mobile estiver fechado:

- seu conteúdo não pode permanecer navegável por teclado;
- não pode ser anunciado como uma segunda navegação ativa.

---

# 8. Marca e logo

## 8.1. Texto visual

Preservar a marca atual:

```text
MarceloGonçalves
```

ou a composição visual existente equivalente.

A forma visual poderá utilizar diferenciação tipográfica entre nome e sobrenome.

## 8.2. Nome acessível

O link deverá possuir nome acessível:

```text
Marcelo Gonçalves — Página inicial
```

O nome acessível poderá vir do texto visível ou de `aria-label`, sem duplicação para leitores de tela.

## 8.3. Destino

```text
/
```

## 8.4. Página inicial

Na Home, o logo continua sendo link para `/`.

Não remover o link por já estar na página.

## 8.5. Imagem

Caso o logo seja texto, não substituir por imagem.

Caso já exista SVG:

- preservar;
- fornecer título acessível somente quando necessário;
- não duplicar nome com texto oculto;
- não carregar arquivo excessivo.

---

# 9. Container e dimensões do cabeçalho

## 9.1. Container

Reutilizar o container global.

Fallback:

```css
max-width: 1280px;
margin-inline: auto;
padding-inline: clamp(20px, 4vw, 40px);
```

O cabeçalho poderá utilizar largura ligeiramente superior ao conteúdo das páginas, desde que permaneça alinhado ao sistema atual.

## 9.2. Altura desktop

Usar aproximadamente:

```css
--header-height-desktop: 80px;
```

Faixa aceitável:

```text
76px a 84px
```

## 9.3. Altura mobile

Usar aproximadamente:

```css
--header-height-mobile: 68px;
```

Faixa aceitável:

```text
64px a 72px
```

## 9.4. Proibição

Não alterar a altura após carregamento de fontes.

Reservar espaço adequado.

Não usar altura fixa menor que o conteúdo.

---

# 10. Comportamento sticky

## 10.1. Regra

Usar:

```css
position: sticky;
top: 0;
z-index: 50;
```

caso o layout atual suporte sticky header.

Se a implementação atual já for `fixed`, é permitido preservar, desde que:

- o conteúdo tenha compensação;
- âncoras não sejam cobertas;
- não haja salto.

## 10.2. Fundo

No topo, usar o fundo já previsto pelo design.

Durante scroll, é permitido:

- aumentar discretamente a opacidade;
- adicionar borda inferior;
- adicionar sombra leve.

Não utilizar blur intenso.

Fallback:

```css
background: rgba(238, 243, 250, 0.96);
border-bottom: 1px solid rgba(200, 217, 238, 0.82);
```

## 10.3. Estado de scroll

Se o projeto implementar estado `scrolled`, ele deverá ser acionado somente após:

```text
16px a 24px
```

de deslocamento.

Não mudar:

- ordem;
- labels;
- altura em mais de 8px;
- tamanho do CTA;
- estrutura do logo.

## 10.4. JavaScript

Não criar listener sem throttling ou abordagem eficiente.

Preferir:

- CSS quando possível;
- IntersectionObserver com sentinel;
- listener passivo e atualização controlada.

## 10.5. Sem JavaScript

O cabeçalho deverá continuar visível e funcional sem o estado de scroll.

---

# 11. Aparência desktop

## 11.1. Estrutura horizontal

Ordem visual:

1. marca;
2. espaço flexível;
3. menu;
4. CTA.

## 11.2. Espaçamento

Entre itens do menu:

```css
gap: clamp(18px, 2vw, 30px);
```

Entre menu e CTA:

```css
margin-left: clamp(20px, 2.5vw, 36px);
```

## 11.3. Links

Estilo coerente com a plataforma.

Fallback:

```css
font-size: 0.9375rem;
font-weight: 600;
line-height: 1;
```

Não usar tamanho muito pequeno.

## 11.4. Estado hover

Pode alterar:

- cor;
- opacidade;
- sublinhado;
- fundo discreto.

Não mover o layout.

## 11.5. Estado ativo

Usar uma combinação de:

- peso;
- cor;
- indicador inferior;
- atributo `aria-current`.

Indicador fallback:

```css
height: 2px;
border-radius: 999px;
background: var(--accent);
```

Não depender somente de cor.

## 11.6. Área de clique

Cada link deverá possuir área vertical mínima aproximada de:

```text
40px
```

Não limitar ao texto estrito.

---

# 12. CTA do cabeçalho

## 12.1. Texto

```text
Apresentar um desafio
```

## 12.2. Destino

```text
/contato
```

## 12.3. Estilo

Reutilizar botão primário compacto.

Não utilizar o mesmo tamanho dos CTAs grandes dos heróis.

Fallback:

```css
min-height: 44px;
padding-inline: 20px;
```

## 12.4. Estado ativo

Na página Contato:

- o link `Contato` recebe `aria-current="page"`;
- o CTA não precisa receber `aria-current`;
- o CTA permanece clicável;
- não mudar o texto para “Você está aqui”.

## 12.5. Mobile

O CTA deverá aparecer dentro do drawer, após os links.

Não manter um segundo CTA externo ao drawer em telas estreitas.

---

# 13. Breakpoint desktop versus mobile

## 13.1. Regra

Utilizar o breakpoint global existente.

Caso o projeto não possua breakpoint adequado, usar:

```css
@media (min-width: 1100px)
```

para navegação desktop completa.

## 13.2. Justificativa de largura

O menu possui seis itens, dropdown e CTA.

Não forçar todos os elementos em uma linha quando não houver espaço.

## 13.3. Faixa intermediária

Entre aproximadamente 900px e 1099px:

- usar navegação mobile;
- não comprimir textos;
- não reduzir fonte excessivamente;
- não ocultar itens individuais.

## 13.4. Proibição

Não usar versão “tablet” com parte do menu visível e parte escondida.

Escolher somente:

- desktop completo;
- mobile completo.

---

# 14. Item Serviços no desktop

## 14.1. Dois controles

A célula de Serviços deverá conter:

1. link para `/servicos`;
2. botão para expandir submenu.

Estrutura equivalente:

```html
<li class="nav-item nav-item--services">
  <a href="/servicos">Serviços</a>
  <button
    type="button"
    aria-expanded="false"
    aria-controls="services-dropdown"
    aria-label="Mostrar páginas de serviços"
  >
    ...
  </button>
</li>
```

## 14.2. Proibição de aninhamento

Não colocar `<button>` dentro de `<a>`.

Não colocar `<a>` dentro de `<button>`.

## 14.3. Área visual

Link e botão podem parecer uma unidade, mas devem manter:

- áreas de clique distintas;
- foco individual;
- nomes acessíveis.

## 14.4. Ícone

Usar chevron simples.

O ícone:

- gira quando aberto, se movimento permitido;
- possui `aria-hidden="true"`;
- não é o único indicador de estado.

## 14.5. Label do botão

Fechado:

```text
Mostrar páginas de serviços
```

Aberto:

```text
Ocultar páginas de serviços
```

Atualizar o nome acessível conforme estado.

---

# 15. Conteúdo do dropdown

## 15.1. ID

```text
services-dropdown
```

Garantir unicidade.

## 15.2. Ordem

1. Visão geral dos serviços;
2. Automação e Integração de Processos;
3. Inteligência Artificial Aplicada;
4. Sistemas e Plataformas Digitais;
5. Cloud, DevOps e Confiabilidade.

## 15.3. Destinos

```text
/servicos
/automacao
/inteligencia-artificial
/software
/plataforma
```

## 15.4. Descrições

### Visão geral dos serviços

```text
Comece pelo problema e identifique a frente mais adequada.
```

### Automação e Integração de Processos

```text
Conecte sistemas e reduza tarefas manuais.
```

### Inteligência Artificial Aplicada

```text
Aplique IA a documentos, conhecimento e processos.
```

### Sistemas e Plataformas Digitais

```text
Construa ou modernize sistemas ligados à operação.
```

### Cloud, DevOps e Confiabilidade

```text
Evolua plataformas AWS, entregas e operação.
```

## 15.5. Ícones

É permitido reutilizar um ícone linear por item.

Não criar novos ícones se os atuais já representarem as quatro áreas.

O item Visão geral poderá utilizar:

- grid;
- compass;
- layers;

somente se o ícone existir no conjunto atual.

## 15.6. Semântica

Usar lista de links.

Não usar `role="menu"`.

Estrutura recomendada:

```html
<div id="services-dropdown">
  <ul>
    <li><a>...</a></li>
  </ul>
</div>
```

---

# 16. Layout do dropdown

## 16.1. Posicionamento

Alinhar preferencialmente ao início do item Serviços.

Usar:

```css
position: absolute;
top: calc(100% + 12px);
```

## 16.2. Largura

Faixa:

```text
420px a 520px
```

A largura deverá permitir título e descrição sem compressão.

## 16.3. Superfície

Reutilizar superfícies da plataforma.

Fallback:

```css
background: #f5f8fc;
border: 1px solid #c8d9ee;
border-radius: 20px;
box-shadow: 0 22px 56px rgba(30, 58, 87, 0.14);
```

## 16.4. Padding

```css
padding: 12px;
```

## 16.5. Itens

Cada item:

```css
display: grid;
grid-template-columns: auto minmax(0, 1fr);
gap: 14px;
padding: 14px;
border-radius: 14px;
```

## 16.6. Separação da visão geral

É permitido:

- usar fundo levemente distinto;
- ou adicionar divisor inferior.

Não transformar Visão geral em CTA destacado exagerado.

## 16.7. Hover e foco

Item pode ganhar:

- fundo suave;
- borda;
- mudança de cor.

Foco deverá ser visível e não depender do fundo de hover.

## 16.8. Overflow

Não cortar sombras.

O container pai não deverá possuir `overflow: hidden` que recorte o dropdown.

---

# 17. Abertura e fechamento do dropdown

## 17.1. Abertura obrigatória

Abrir quando:

- botão recebe clique;
- botão recebe Enter;
- botão recebe Espaço.

## 17.2. Abertura opcional por hover

É permitido abrir por hover em dispositivos com ponteiro preciso, desde que:

- clique continue funcionando;
- teclado continue funcionando;
- haja atraso de fechamento;
- não haja “corredor impossível” até o painel;
- hover não seja única forma.

## 17.3. Fechamento

Fechar quando:

- botão é acionado novamente;
- Escape;
- clique fora;
- foco sai do conjunto;
- navegação é concluída;
- rota muda;
- viewport muda para mobile;
- outro overlay é aberto.

## 17.4. Escape

Ao pressionar Escape com dropdown aberto:

1. fechar;
2. manter ou devolver foco ao botão;
3. atualizar `aria-expanded=false`.

## 17.5. Clique fora

Não fechar por clique dentro do dropdown.

Usar listeners limpos no unmount.

## 17.6. Mudança de rota

Fechar imediatamente.

Não manter menu aberto em nova página.

## 17.7. Foco

Não prender foco no dropdown.

Trata-se de disclosure de navegação, não modal.

---

# 18. Estado ativo no dropdown

## 18.1. Página central

Em `/servicos`:

- link principal Serviços recebe estado ativo;
- item Visão geral recebe `aria-current="page"`.

## 18.2. Página individual

Em `/automacao`:

- Serviços ativo;
- Automação e Integração ativo.

Repetir lógica para as demais.

## 18.3. Indicador

No submenu, usar:

- `aria-current="page"`;
- fundo discreto;
- texto ou marcador.

Não alterar a descrição.

## 18.4. Não ativo

Outros itens permanecem links normais.

---

# 19. Navegação mobile — estrutura

## 19.1. Elementos visíveis com menu fechado

Exibir:

1. marca;
2. botão Abrir menu.

Não exibir CTA externo quando a largura não comportar.

## 19.2. Botão

Fechado:

```text
Abrir menu
```

Aberto:

```text
Fechar menu
```

Atributos:

```html
type="button"
aria-expanded
aria-controls="mobile-navigation"
```

## 19.3. Ícone

Usar hamburger e fechar.

Ícone decorativo:

```text
aria-hidden="true"
```

Não depender somente da transformação visual das linhas para informar estado.

## 19.4. Área de toque

Mínimo:

```text
44px × 44px
```

---

# 20. Drawer mobile

## 20.1. ID

```text
mobile-navigation
```

## 20.2. Modalidade

Preferir drawer modal em telas pequenas.

Usar:

```html
role="dialog"
aria-modal="true"
```

somente se:

- fundo for tornado inerte;
- foco permanecer dentro;
- Escape fechar;
- foco retornar.

Caso não seja possível implementar corretamente, usar painel não modal abaixo do cabeçalho, sem `aria-modal`.

Não declarar semântica modal incompleta.

## 20.3. Posição

Pode abrir:

- da direita;
- ou de cima abaixo do header.

Preferência alinhada ao estilo atual:

```text
painel lateral pela direita
```

## 20.4. Dimensões

```css
width: min(88vw, 420px);
height: 100dvh;
```

Respeitar safe areas.

## 20.5. Superfície

Usar fundo claro consistente.

Não usar fundo escuro se o site não adota essa linguagem.

## 20.6. Conteúdo

Ordem:

1. cabeçalho do drawer;
2. lista principal;
3. grupo de serviços;
4. CTA;
5. microcopy opcional.

## 20.7. Microcopy opcional

É permitido utilizar:

```text
Primeira conversa sem compromisso
```

Não incluir prazo no drawer para evitar duplicação visual.

Não adicionar telefone ou redes sociais.

---

# 21. Ordem mobile

Usar:

```text
Home
Serviços
  Visão geral
  Automação e Integração de Processos
  Inteligência Artificial Aplicada
  Sistemas e Plataformas Digitais
  Cloud, DevOps e Confiabilidade
Sobre
Artigos
O Projeto
Contato
Apresentar um desafio
```

O submenu poderá estar recolhido.

---

# 22. Serviços no mobile

## 22.1. Dois controles

Usar link e botão separados, como no desktop.

## 22.2. Estado inicial

Em rotas fora de Serviços:

```text
recolhido
```

Em rota de serviço:

```text
expandido
```

É permitido preservar a última interação somente durante a sessão do drawer aberto.

Não persistir em localStorage.

## 22.3. Botão

Fechado:

```text
Mostrar páginas de serviços
```

Aberto:

```text
Ocultar páginas de serviços
```

## 22.4. Subitens

Usar recuo visual, não redução excessiva de fonte.

Cada item deve possuir área de toque mínima adequada.

## 22.5. Animação

Pode animar altura ou opacity somente se:

- não causar reflow brusco;
- respeitar movimento reduzido;
- não impedir navegação imediata.

---

# 23. Bloqueio de scroll

## 23.1. Ao abrir drawer modal

Bloquear scroll do documento.

## 23.2. Preservação

Salvar posição atual.

Ao fechar:

- restaurar;
- não mover para o topo;
- não gerar salto horizontal.

## 23.3. Barra de rolagem

Compensar a largura da scrollbar quando necessário para evitar deslocamento da página.

## 23.4. iOS

Utilizar abordagem compatível com Safari móvel.

Não depender somente de:

```css
overflow: hidden
```

se a implementação atual demonstrar falha.

## 23.5. Rotação

Ao mudar orientação:

- recalcular;
- preservar menu funcional;
- não deixar body bloqueado após fechamento.

---

# 24. Foco no drawer

## 24.1. Abertura

Ao abrir:

- foco no botão Fechar menu ou primeiro link;
- escolha consistente.

Preferência:

```text
botão Fechar menu
```

## 24.2. Contenção

Se modal:

- Tab circula dentro;
- Shift+Tab circula;
- elementos externos ficam inertes;
- leitores de tela não navegam pelo fundo.

## 24.3. Fechamento

Ao fechar:

- devolver foco ao botão Abrir menu.

## 24.4. Navegação

Ao selecionar link:

- fechar drawer;
- permitir mudança de rota;
- foco segue o comportamento da nova página.

## 24.5. Erro

Nunca deixar foco em elemento desmontado.

---

# 25. Overlay mobile

## 25.1. Comportamento

Clique fecha o drawer.

## 25.2. Semântica

Overlay decorativo.

Não deve receber foco.

## 25.3. Visual

Fallback:

```css
background: rgba(30, 58, 87, 0.28);
```

Evitar escurecimento excessivo.

## 25.4. Z-index

Definir escala consistente:

```text
header: 50
overlay: 70
drawer: 80
```

Adaptar à escala global.

Não usar valores arbitrários muito altos.

---

# 26. Progressive enhancement

## 26.1. Sem JavaScript

Os links essenciais deverão continuar acessíveis.

Abordagens permitidas:

- navegação desktop sempre renderizada em largura adequada;
- mobile com `<details>` sem JavaScript;
- fallback CSS;
- link direto Serviços sempre disponível.

## 26.2. Requisito mínimo

Mesmo se dropdown não abrir:

- `/servicos` continua acessível;
- os demais itens principais continuam acessíveis;
- página não fica bloqueada;
- CTA continua acessível.

## 26.3. Não exigir

Não é obrigatório disponibilizar os quatro links individuais sem JavaScript, desde que a página central de Serviços esteja acessível e o menu mobile principal funcione por fallback.

## 26.4. Hidratação

Evitar diferença estrutural entre HTML inicial e cliente.

Não gerar warning de hydration devido ao estado ativo ou viewport.

---

# 27. Detecção de viewport

## 27.1. CSS primeiro

Visibilidade desktop/mobile deve ser controlada por CSS.

## 27.2. JavaScript

Não renderizar estruturas diferentes com base em `window.innerWidth` no primeiro render.

## 27.3. Estado aberto

Ao cruzar breakpoint:

- fechar dropdown;
- fechar drawer;
- restaurar body;
- limpar focus trap;
- manter a página utilizável.

---

# 28. Navegação em SPA

## 28.1. Links internos

Usar o componente de link do framework.

## 28.2. Fechamento

Dropdown e drawer fecham após mudança de pathname.

## 28.3. Foco após rota

A aplicação deve possuir estratégia global para:

- mover foco ao conteúdo principal;
- ou permitir que o framework anuncie a mudança de forma adequada.

Não mover foco em simples atualização de query que não troca a superfície principal, salvo especificação da página.

## 28.4. Scroll

Navegação para nova página:

- topo padrão;
- preservar quando explicitamente necessário;
- âncoras respeitam header.

---

# 29. Link para conteúdo principal

## 29.1. Skip link

Adicionar como primeiro controle focável:

```text
Ir para o conteúdo principal
```

Destino:

```text
#conteudo-principal
```

## 29.2. Conteúdo principal

Cada layout público deve possuir:

```html
<main id="conteudo-principal">
```

## 29.3. Visual

Skip link:

- oculto fora de foco;
- visível ao receber foco;
- alto contraste;
- acima do header;
- não recortado.

## 29.4. Páginas especiais

404, 500 e legais também devem possuir o destino, quando forem implementadas.

---

# 30. Estados de foco

## 30.1. Padrão

Reutilizar foco global.

Fallback:

```css
outline: 3px solid rgba(59, 95, 138, 0.58);
outline-offset: 3px;
```

## 30.2. Contraste

O foco deve permanecer visível:

- no fundo do header;
- no dropdown;
- no drawer;
- no CTA;
- em estado ativo.

## 30.3. `:focus-visible`

Utilizar quando suportado.

Não remover foco para mouse se isso quebrar navegadores.

---

# 31. Nomenclatura acessível

Usar exatamente:

```text
Navegação principal
```

para o nav desktop.

Para a navegação do drawer:

```text
Navegação principal no celular
```

ou manter apenas um nav disponível no accessibility tree.

Não usar:

```text
Menu 1
Menu 2
```

## 31.1. CTA

Nome acessível igual ao texto:

```text
Apresentar um desafio
```

Não adicionar “botão” no aria-label.

---

# 32. Estado ativo — algoritmo

## 32.1. Normalização

Antes de comparar:

- remover query;
- remover hash;
- remover barra final, salvo raiz;
- decodificar com segurança;
- manter lowercase para rotas definidas em lowercase.

## 32.2. Correspondência

Raiz:

```text
/
```

deve corresponder somente à Home.

Não utilizar:

```ts
pathname.startsWith("/")
```

para Home.

## 32.3. Prefixos

Para Artigos:

```text
/artigos
/post
/categoria
```

Para Serviços:

usar mapa explícito.

## 32.4. Rotas desconhecidas

Nenhum item ativo.

## 32.5. Query de contato

Em:

```text
/contato?area=...
```

Contato permanece ativo.

---

# 33. Estilo visual do drawer

## 33.1. Título interno

Não é necessário repetir “Menu”.

É permitido usar a marca no topo.

## 33.2. Links principais

Fallback:

```css
font-size: 1.125rem;
font-weight: 650;
padding-block: 12px;
```

## 33.3. Subitens

Fallback:

```css
font-size: 0.975rem;
padding-block: 11px;
```

## 33.4. Separadores

Usar bordas discretas entre grupos, não entre todos os links.

## 33.5. CTA

Largura total.

Espaço superior suficiente.

Não fixar o CTA no fundo se isso cobrir itens em telas baixas.

---

# 34. Conteúdo proibido no menu

Não adicionar:

- descrições longas no mobile;
- certificações;
- tecnologias;
- “10+ anos”;
- disponibilidade;
- e-mail;
- telefone;
- LinkedIn;
- WhatsApp;
- cookies;
- links legais;
- seletor de idioma;
- busca;
- carrinho;
- login;
- área do cliente;
- indicador de notificação;
- modo escuro.

---

# 35. Ícones

## 35.1. Header principal

Não adicionar ícones aos itens principais.

## 35.2. Serviços

Ícones são opcionais no dropdown.

## 35.3. Mobile

Não adicionar ícones a todos os itens.

Manter somente:

- chevron;
- menu;
- fechar;
- ícones opcionais de serviço.

## 35.4. Biblioteca

Reutilizar a biblioteca existente.

Não instalar nova biblioteca.

---

# 36. Motion

## 36.1. Dropdown

Transição máxima aproximada:

```text
160ms a 220ms
```

Pode utilizar:

- opacity;
- translateY de até 6px.

## 36.2. Drawer

Transição máxima:

```text
220ms a 280ms
```

## 36.3. Reduced motion

Quando ativo:

- remover translate;
- reduzir duração a quase zero;
- manter abertura e fechamento funcional;
- não usar smooth scroll forçado.

## 36.4. Proibição

Não utilizar:

- spring;
- overshoot;
- bounce;
- stagger;
- animação por item;
- blur animado.

---

# 37. Analytics da navegação

Aplicar somente se já existir helper e consentimento.

Não instalar analytics nesta tarefa.

## 37.1. Eventos

```text
navigation_primary_click
navigation_services_toggle
navigation_service_click
navigation_mobile_open
navigation_mobile_close
navigation_header_cta_click
navigation_skip_link_click
```

## 37.2. Propriedades permitidas

- `itemId`;
- `serviceId`;
- `viewport`;
- `interaction`;
- `currentSection`;
- `closeReason`.

## 37.3. Valores de `interaction`

```text
mouse
keyboard
touch
```

Somente quando puder ser identificado sem fingerprint.

## 37.4. Valores de `closeReason`

```text
toggle
escape
outside
navigation
breakpoint
```

## 37.5. Proibido

Não enviar:

- texto livre;
- pathname completo com query sensível;
- dados pessoais;
- `area` de contato como dado bruto;
- user-agent;
- dimensões exatas de tela;
- endereço de referrer completo.

## 37.6. Funcionamento sem analytics

Nenhum comportamento da navegação pode depender do envio de evento.

---

# 38. Performance

## 38.1. JavaScript

O componente deve ser leve.

Não carregar:

- biblioteca de animação;
- biblioteca de menu;
- ícones inteiros quando tree-shaking for possível.

## 38.2. Eventos

Remover listeners no unmount.

Evitar listeners globais permanentes quando menu fechado.

## 38.3. Fonts

Não aguardar fonte para renderizar navegação.

## 38.4. Layout shift

Reservar dimensões da marca, CTA e botão mobile.

## 38.5. Dropdown

Não prefetch excessivamente todas as páginas se o framework já fizer prefetch automático agressivo e isso prejudicar a página.

É permitido ajustar prefetch conforme estratégia existente.

---

# 39. Segurança básica do componente

## 39.1. Links

Todos os links são internos e definidos em configuração.

Não aceitar URL de CMS para navegação principal.

## 39.2. HTML

Não usar `dangerouslySetInnerHTML`.

## 39.3. IDs

Gerar IDs estáveis.

Não utilizar texto do usuário.

## 39.4. Foco

Não expor elementos ocultos.

## 39.5. Tabindex

Não usar `tabindex` positivo.

---

# 40. Implementação técnica recomendada

## 40.1. Componentes

Estrutura conceitual:

```text
SiteHeader
├── SkipLink
├── BrandLink
├── DesktopNavigation
│   ├── PrimaryNavigationLink
│   ├── ServicesDisclosure
│   │   └── ServicesDropdown
│   └── HeaderCTA
└── MobileNavigation
    ├── MobileMenuButton
    ├── MobileDrawer
    │   ├── MobilePrimaryNavigation
    │   ├── MobileServicesDisclosure
    │   └── MobileHeaderCTA
    └── MobileOverlay
```

## 40.2. Hooks ou utilitários

É permitido criar:

```text
useActiveNavigation
useDisclosure
useBodyScrollLock
useFocusReturn
```

Somente quando reutilizáveis e testáveis.

Não criar abstração desnecessária.

## 40.3. Estado

Estados mínimos:

```ts
isServicesOpen: boolean;
isMobileOpen: boolean;
isMobileServicesOpen: boolean;
```

Desktop e mobile não devem permanecer abertos simultaneamente.

## 40.4. Contexto

Não criar contexto global apenas para o header, salvo se o layout exigir controle externo real.

## 40.5. Portal

O drawer poderá usar portal.

O dropdown não precisa de portal, salvo recorte por stacking context não solucionável.

---

# 41. Comportamento inicial por rota

## 41.1. Desktop

Dropdown fechado em todas as rotas.

Não abrir automaticamente em página de serviço.

## 41.2. Mobile

Drawer fechado.

Quando aberto em página de serviço:

- grupo Serviços expandido.

Quando aberto em outra página:

- grupo recolhido.

## 41.3. SSR

O HTML inicial não deverá variar de forma que cause hidratação incorreta.

É permitido expandir o grupo mobile após hidratação, mas evitar mudança visível desnecessária.

Preferir calcular pelo pathname disponível no servidor.

---

# 42. Regras de scroll e âncoras

## 42.1. Variável global

Definir:

```css
--header-height: var(--header-height-desktop);
```

No mobile:

```css
--header-height: var(--header-height-mobile);
```

## 42.2. Destinos internos

Elementos com âncora devem utilizar:

```css
scroll-margin-top: calc(var(--header-height) + 24px);
```

## 42.3. Skip link

O destino `#conteudo-principal` deve utilizar margem adequada.

## 42.4. Página Serviços

O CTA `Explorar as frentes` deverá continuar respeitando o header, mas sua implementação pertence ao Ajuste 16.

---

# 43. Comportamento com zoom e texto ampliado

Validar em:

```text
200% de zoom
```

e, quando possível:

```text
400% para fluxo linear
```

Em zoom elevado:

- mudar para menu mobile se necessário;
- não sobrepor marca e botão;
- drawer permitir scroll;
- CTA não sair da viewport;
- dropdown desktop não ser forçado se não houver largura.

Não reduzir fonte.

---

# 44. Internacionalização futura

Esta tarefa não adiciona idioma.

A configuração deverá permitir futura tradução dos labels sem alterar a arquitetura.

Não adicionar:

- PT;
- EN;
- bandeiras;
- locale switcher.

Quando a versão inglesa existir, deverá haver especificação separada para:

- navegação;
- rotas;
- estado ativo;
- persistência de idioma.

---

# 45. Testes unitários — configuração

Testar:

1. ordem exata dos itens;
2. labels;
3. rotas;
4. seis itens principais;
5. cinco itens no submenu;
6. IDs únicos;
7. nenhum `/blog`;
8. nenhum `Solicitar diagnóstico`;
9. CTA correto;
10. rotas de serviço mapeadas.

---

# 46. Testes unitários — estado ativo

Testar:

```text
/
```

Somente Home.

```text
/servicos
```

Serviços e Visão geral.

```text
/automacao
```

Serviços e Automação.

```text
/inteligencia-artificial
```

Serviços e IA.

```text
/software
```

Serviços e Sistemas.

```text
/plataforma
```

Serviços e Cloud.

```text
/sobre
```

Sobre.

```text
/artigos
```

Artigos.

```text
/artigos?pagina=2
```

Artigos.

```text
/post/exemplo
```

Artigos.

```text
/categoria/cloud-aws
```

Artigos.

```text
/o-projeto
```

O Projeto.

```text
/contato?area=automacao-integracao
```

Contato.

```text
/rota-inexistente
```

Nenhum.

---

# 47. Testes de integração — desktop

Testar:

1. logo navega para Home;
2. cada link funciona;
3. CTA funciona;
4. botão Serviços abre;
5. `aria-expanded` muda;
6. dropdown recebe foco;
7. Tab percorre itens;
8. Escape fecha;
9. foco retorna;
10. clique fora fecha;
11. clique dentro não fecha antes da navegação;
12. mudança de rota fecha;
13. estado ativo atualiza;
14. resize fecha;
15. sem overflow;
16. sticky permanece correto;
17. skip link funciona.

---

# 48. Testes de integração — mobile

Testar:

1. botão abre;
2. label muda;
3. drawer aparece;
4. body bloqueia;
5. foco vai para drawer;
6. Tab permanece no modal, se modal;
7. Escape fecha;
8. overlay fecha;
9. foco retorna;
10. Serviços expande;
11. subitens funcionam;
12. CTA funciona;
13. rota fecha drawer;
14. scroll é restaurado;
15. rotação não quebra;
16. viewport baixa permite scroll;
17. safe area;
18. movimento reduzido;
19. sem elementos ocultos focáveis;
20. sem segunda navegação anunciada.

---

# 49. Testes de teclado

Sequência desktop:

1. skip link;
2. marca;
3. Home;
4. Serviços;
5. botão de Serviços;
6. Sobre;
7. Artigos;
8. O Projeto;
9. Contato;
10. CTA.

Quando dropdown abre:

- itens entram na ordem após o botão conforme estrutura DOM.

Sequência mobile:

1. skip link;
2. marca;
3. Abrir menu.

Com drawer aberto:

1. Fechar menu;
2. Home;
3. Serviços;
4. botão Serviços;
5. subitens quando abertos;
6. Sobre;
7. Artigos;
8. O Projeto;
9. Contato;
10. CTA.

Não utilizar ordem visual diferente da DOM.

---

# 50. Testes de leitores de tela

Validar:

- landmark de navegação;
- marca;
- estado atual;
- botão expandido ou recolhido;
- nome do dropdown;
- links;
- drawer modal;
- retorno de foco;
- skip link;
- CTA;
- ausência de conteúdo duplicado oculto anunciado.

Testar ao menos com combinação disponível de:

- NVDA + Chrome ou Firefox;
- VoiceOver + Safari;
- TalkBack + Chrome, quando possível.

---

# 51. Testes responsivos

Validar:

```text
320px
360px
390px
414px
768px
900px
1024px
1099px
1100px
1280px
1366px
1440px
1920px
```

Validar também:

- zoom 200%;
- landscape móvel;
- altura de 568px;
- textos ampliados;
- fonte não carregada;
- scrollbar presente e ausente.

---

# 52. Testes de reduced motion

Com `prefers-reduced-motion: reduce`:

- dropdown abre sem deslocamento relevante;
- drawer abre sem slide prolongado;
- chevron não precisa girar;
- scroll por âncora não é suave;
- nenhum conteúdo demora a aparecer;
- foco permanece correto.

---

# 53. Testes sem JavaScript

Validar:

- marca;
- links principais;
- link Serviços;
- CTA;
- conteúdo principal;
- navegação não bloqueia a página.

Documentar o comportamento do submenu.

Não exigir experiência idêntica, mas exigir caminho funcional para `/servicos`.

---

# 54. Testes de regressão

Confirmar que o novo header não altera:

- Hero da Home;
- Hero de Sobre;
- página Serviços;
- páginas individuais;
- Artigos;
- Post;
- O Projeto;
- Contato;
- páginas legais;
- largura do conteúdo;
- z-index de modais existentes;
- banner de cookies futuro;
- âncoras;
- impressão.

O banner de cookies será implementado depois, mas reservar escala de z-index para evitar conflito.

---

# 55. Conteúdo presente obrigatório

Verificar:

```text
Home
Serviços
Sobre
Artigos
O Projeto
Contato
Apresentar um desafio
Visão geral dos serviços
Automação e Integração de Processos
Inteligência Artificial Aplicada
Sistemas e Plataformas Digitais
Cloud, DevOps e Confiabilidade
```

---

# 56. Conteúdo ausente obrigatório

Verificar ausência no cabeçalho:

```text
Blog
Solicitar diagnóstico
Conheça nossos serviços
Engenharia de Software
Integração & Automação
Cloud & DevOps
Pilar
```

A expressão Engenharia de Software poderá aparecer em páginas internas como competência, mas não no menu.

---

# 57. Ordem de implementação

Executar:

1. localizar componentes atuais;
2. identificar duplicações desktop/mobile;
3. identificar estilos;
4. criar configuração central;
5. criar utilitário de estado ativo;
6. implementar skip link;
7. atualizar marca acessível;
8. implementar desktop;
9. implementar Serviços com dois controles;
10. implementar dropdown;
11. implementar CTA;
12. implementar mobile;
13. implementar drawer;
14. implementar disclosure mobile;
15. implementar scroll lock;
16. implementar foco;
17. implementar fechamento por rota;
18. implementar fechamento por breakpoint;
19. aplicar sticky;
20. aplicar estilos;
21. remover componentes antigos;
22. remover labels antigos;
23. adicionar analytics somente se helper existir;
24. executar testes unitários;
25. executar testes de integração;
26. validar teclado;
27. validar leitores de tela;
28. validar responsividade;
29. executar lint;
30. executar build;
31. revisar visualmente todas as rotas.

---

# 58. Critérios de aceite — estrutura

A estrutura será aceita quando:

1. existir uma única fonte de verdade;
2. desktop e mobile reutilizarem dados;
3. houver seis itens principais;
4. houver cinco itens de Serviços;
5. CTA for único e consistente;
6. `/servicos` estiver acessível pelo texto Serviços;
7. dropdown for acionado por botão separado;
8. não houver links e botões aninhados;
9. header não possuir H1;
10. skip link existir.

---

# 59. Critérios de aceite — acessibilidade

Será aceito quando:

1. funcionar por teclado;
2. Escape fechar dropdown e drawer;
3. foco retornar;
4. estado ativo usar `aria-current`;
5. disclosures usarem `aria-expanded`;
6. drawer modal, se usado, for realmente modal;
7. conteúdo oculto não for focável;
8. foco for visível;
9. estado ativo não depender somente de cor;
10. movimento reduzido for respeitado;
11. zoom 200% não quebrar;
12. leitores de tela não anunciarem navegação duplicada.

---

# 60. Critérios de aceite — comportamento

Será aceito quando:

1. dropdown fechar em mudança de rota;
2. drawer fechar em mudança de rota;
3. resize limpar estados;
4. body não permanecer bloqueado;
5. sticky não cobrir conteúdo;
6. âncoras respeitarem altura;
7. clique fora funcionar;
8. clique dentro não fechar incorretamente;
9. sem JavaScript existir acesso à página Serviços;
10. nenhuma interação depender de analytics.

---

# 61. Critérios de aceite — visual

Será aceito quando:

1. identidade atual for preservada;
2. header não ocupar espaço excessivo;
3. dropdown utilizar superfícies claras;
4. drawer utilizar linguagem visual coerente;
5. não houver nova paleta;
6. não houver imagens;
7. não houver logos técnicos;
8. não houver animação excessiva;
9. CTA permanecer compacto;
10. não houver overflow.

---

# 62. Checklist final de revisão humana

- [ ] Configuração central criada.
- [ ] Desktop e mobile compartilham dados.
- [ ] Ordem final correta.
- [ ] Home aponta para `/`.
- [ ] Serviços aponta para `/servicos`.
- [ ] Sobre aponta para `/sobre`.
- [ ] Artigos aponta para `/artigos`.
- [ ] O Projeto aponta para `/o-projeto`.
- [ ] Contato aponta para `/contato`.
- [ ] CTA correto.
- [ ] Nenhum Blog.
- [ ] Nenhum Solicitar diagnóstico.
- [ ] Logo acessível.
- [ ] Skip link funcional.
- [ ] H1 ausente no header.
- [ ] Dropdown acessível.
- [ ] Serviços possui link e botão.
- [ ] Cinco itens no dropdown.
- [ ] Descrições corretas.
- [ ] Estado ativo na página central.
- [ ] Estado ativo nas quatro páginas.
- [ ] Artigos ativo em posts.
- [ ] Artigos ativo em categorias.
- [ ] Contato ativo com query.
- [ ] Home ativa somente na raiz.
- [ ] Dropdown fecha por Escape.
- [ ] Dropdown fecha por clique fora.
- [ ] Dropdown fecha por rota.
- [ ] Foco retorna ao botão.
- [ ] Botão mobile possui 44px.
- [ ] Drawer abre.
- [ ] Drawer fecha.
- [ ] Body bloqueia.
- [ ] Body restaura.
- [ ] Overlay funciona.
- [ ] Serviços expande no mobile.
- [ ] Grupo vem aberto em rota de serviço.
- [ ] Foco fica dentro, se modal.
- [ ] Foco retorna.
- [ ] Resize limpa estado.
- [ ] Sticky não cobre conteúdo.
- [ ] Âncoras respeitam header.
- [ ] Reduced motion respeitado.
- [ ] Sem JS há acesso funcional.
- [ ] Sem analytics tudo funciona.
- [ ] 320px validado.
- [ ] 360px validado.
- [ ] 390px validado.
- [ ] 768px validado.
- [ ] 1024px validado.
- [ ] 1100px validado.
- [ ] 1366px validado.
- [ ] 1440px validado.
- [ ] Zoom 200% validado.
- [ ] Landscape validado.
- [ ] Teclado validado.
- [ ] NVDA ou VoiceOver validado.
- [ ] Sem overflow.
- [ ] Sem layout shift.
- [ ] Lint concluído.
- [ ] Testes concluídos.
- [ ] Build concluído.
- [ ] Rotas revisadas visualmente.

---

# 63. Resultado esperado

Ao final, a plataforma deverá possuir uma navegação única, coerente e previsível:

> O visitante encontra as principais superfícies na mesma ordem em todas as páginas, acessa uma visão central dos serviços, aprofunda-se nas quatro competências e chega ao contato sem ser conduzido por uma promessa de diagnóstico.

A navegação deverá funcionar igualmente bem para:

- mouse;
- toque;
- teclado;
- leitores de tela;
- movimento reduzido;
- telas estreitas;
- zoom elevado.

O componente deverá permanecer simples o suficiente para ser mantido, testado e ampliado sem duplicar links ou criar comportamentos diferentes entre desktop e mobile.
