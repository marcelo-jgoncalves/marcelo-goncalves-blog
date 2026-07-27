# Ajuste 17B — Rodapé global

## 0. Finalidade, escopo e precedência

Este documento define, de forma exaustiva e diretamente executável, o rodapé global público da plataforma.

O escopo inclui:

- estrutura visual;
- marca e posicionamento;
- links de serviços;
- links institucionais;
- contato;
- localização;
- link de e-mail;
- CTA discreto;
- links legais;
- botão de preferências de cookies;
- controle de ano;
- link “Voltar ao topo”;
- comportamento responsivo;
- semântica;
- foco;
- teclado;
- estados de hover;
- integração futura com o painel de cookies;
- impressão;
- analytics;
- testes;
- critérios de aceite.

Este documento não inclui:

- conteúdo integral do Aviso de Privacidade;
- conteúdo integral da Política de Cookies;
- conteúdo integral dos Termos de Uso;
- implementação do banner de cookies;
- implementação do painel de consentimento;
- configuração do Google Analytics;
- cabeçalho;
- CTA final das páginas;
- formulário de contato;
- SEO global;
- redirects;
- segurança de produção.

Esses temas pertencem aos Ajustes 17A e 17C a 17G.

### Precedência

Em caso de conflito:

1. este documento prevalece sobre qualquer instrução anterior relativa ao rodapé global;
2. o Ajuste 17A prevalece sobre o cabeçalho;
3. o Ajuste 14 prevalece sobre a página de contato e o e-mail transacional;
4. o Ajuste 16 prevalece sobre a página central de Serviços;
5. os Ajustes 15A a 15D prevalecem sobre as rotas editoriais;
6. o Ajuste 17D definirá o comportamento interno do painel de preferências;
7. este documento define somente o controle e a posição do botão que abrirá esse painel.

A IA engenheira não deverá:

- criar outro CTA completo antes do rodapé;
- alterar o CTA final das páginas;
- criar um rodapé diferente por rota;
- criar um rodapé escuro se essa linguagem não estiver presente;
- criar nova paleta;
- trocar tipografia;
- adicionar newsletter;
- adicionar formulário;
- adicionar mapa;
- adicionar endereço residencial;
- adicionar telefone fictício;
- adicionar WhatsApp sem configuração;
- adicionar redes sociais sem URL validada;
- adicionar logos de tecnologias;
- adicionar selos;
- adicionar certificações;
- instalar biblioteca;
- duplicar os links em múltiplos componentes;
- manter nomes antigos dos serviços;
- manter “Blog” como item editorial;
- utilizar link falso para preferências de cookies;
- transformar o rodapé em um sitemap completo;
- esconder links legais em accordion inacessível.

---

# 1. Diagnóstico do rodapé atual

## 1.1. Estrutura observada

O rodapé atual apresenta:

1. link “Voltar ao topo”;
2. nome Marcelo Gonçalves;
3. descrição institucional;
4. coluna Especialidades;
5. coluna Links Rápidos;
6. coluna Contato;
7. copyright;
8. Aviso de Privacidade;
9. Política de Cookies;
10. Termos de Uso;
11. botão Preferências de cookies.

## 1.2. Elementos que devem ser preservados conceitualmente

Preservar:

- rodapé em blocos;
- marca;
- especialidades;
- navegação;
- contato;
- links legais;
- preferências de cookies;
- copyright;
- voltar ao topo;
- integração visual com a paleta;
- estrutura global compartilhada.

## 1.3. Problemas identificados

O rodapé atual apresenta:

1. descrição institucional antiga e genérica;
2. nome “Especialidades” sem uma visão geral dos serviços;
3. nomes antigos:
   - Engenharia de Software;
   - Inteligência Artificial;
   - Integração & Automação;
   - Cloud & DevOps;
4. link editorial “Blog”;
5. coluna Contato sem e-mail;
6. frase “Vamos conversar sobre seu próximo projeto” sem ação clara;
7. ausência de localização;
8. ausência de CTA útil para `/contato`;
9. pouca distinção entre navegação institucional e comercial;
10. copyright separado por ponto central, em vez da frase institucional definida;
11. possibilidade de duplicação de dados entre rodapé e componentes;
12. ausência de especificação de foco;
13. ausência de regra para leitores de tela;
14. ausência de contrato para o botão de cookies;
15. ausência de regra para ano dinâmico;
16. ausência de regra para impressão;
17. ausência de controle de links externos;
18. ausência de regra para rodapé em páginas 404, 500 ou preview;
19. risco de excesso de colunas comprimidas em tablet;
20. risco de accordions desnecessários no mobile.

---

# 2. Objetivos do rodapé

O rodapé deverá:

1. encerrar a experiência de forma institucional;
2. reforçar o posicionamento da consultoria;
3. fornecer acesso às quatro competências;
4. oferecer navegação complementar;
5. apresentar um canal de contato verificável;
6. informar a localização sem expor endereço;
7. manter acesso permanente aos documentos legais;
8. permitir alteração posterior das preferências de cookies;
9. funcionar em todas as rotas públicas;
10. preservar a identidade visual;
11. permanecer simples;
12. não competir com o CTA final da página;
13. não repetir textos comerciais extensos;
14. não apresentar funcionalidades inexistentes;
15. utilizar uma única fonte de verdade.

---

# 3. Estrutura final obrigatória

O rodapé deverá seguir exatamente esta ordem visual:

1. divisor ou transição superior;
2. área principal:
   - marca e posicionamento;
   - Serviços;
   - Navegação;
   - Contato;
3. faixa inferior:
   - copyright;
   - links legais;
   - botão Preferências de cookies;
   - link Voltar ao topo.

## 3.1. Estrutura semântica sugerida

```html
<footer class="site-footer" aria-labelledby="site-footer-title">
  <div class="site-footer__container">
    <div class="site-footer__main">
      <section class="site-footer__brand">
        ...
      </section>

      <nav aria-label="Serviços">
        ...
      </nav>

      <nav aria-label="Navegação do rodapé">
        ...
      </nav>

      <section class="site-footer__contact">
        ...
      </section>
    </div>

    <div class="site-footer__legal">
      ...
    </div>
  </div>
</footer>
```

## 3.2. Título acessível do rodapé

Adicionar heading visualmente oculto:

```text
Rodapé do site
```

ID:

```text
site-footer-title
```

Não utilizar H1.

É permitido usar H2 visualmente oculto ou outro heading coerente com a hierarquia da página.

---

# 4. Fonte única de verdade

## 4.1. Obrigatoriedade

O rodapé deverá consumir dados centralizados.

Não escrever links diretamente em vários componentes.

## 4.2. Estrutura sugerida

```ts
interface FooterLink {
  id: string;
  label: string;
  href: string;
  external?: boolean;
}

interface FooterConfig {
  brand: {
    name: string;
    description: string;
    tagline: string;
    homeHref: string;
  };
  services: FooterLink[];
  navigation: FooterLink[];
  contact: {
    heading: string;
    text: string;
    email: string;
    location: string;
    ctaLabel: string;
    ctaHref: string;
    linkedinUrl?: string;
  };
  legal: FooterLink[];
}
```

## 4.3. Compartilhamento com o header

É permitido que links de Navegação reutilizem a configuração definida no Ajuste 17A.

Não duplicar labels quando puderem ser derivados da fonte principal.

Os links de Serviços poderão reutilizar a configuração de serviços do header, com labels compactos próprios somente se explicitamente definidos.

## 4.4. Conteúdo editável

Não buscar os links do rodapé no CMS público nesta fase.

Os links são estruturais e versionados com o código.

---

# 5. Sistema visual

## 5.1. Identidade

Preservar:

- superfícies azuladas claras;
- títulos em azul escuro;
- bordas discretas;
- tipografia atual;
- ausência de fundos pretos;
- ausência de gradientes;
- espaço generoso;
- design institucional e técnico.

## 5.2. Fundo

Reutilizar a superfície global do rodapé atual.

Fallback:

```css
--footer-background: #e0ecf7;
--footer-surface: #e6eef8;
--footer-border: #c8d9ee;
--footer-heading: #1e3a57;
--footer-accent: #3b5f8a;
--footer-accent-hover: #2d4f76;
```

Não criar uma nova cor exclusiva do rodapé.

## 5.3. Divisor superior

Usar:

```css
border-top: 1px solid var(--footer-border);
```

É permitido adicionar espaço em vez de sombra.

Não utilizar uma sombra intensa entre conteúdo e rodapé.

## 5.4. Container

Reutilizar o container global.

Fallback:

```css
max-width: 1280px;
margin-inline: auto;
padding-inline: clamp(20px, 4vw, 40px);
```

## 5.5. Espaçamento

Área principal:

```css
padding-top: clamp(64px, 7vw, 96px);
padding-bottom: clamp(48px, 5vw, 72px);
```

Faixa legal:

```css
padding-block: 24px;
```

## 5.6. Tipografia

### Nome da marca

```css
font-size: clamp(1.35rem, 2vw, 1.75rem);
font-weight: 700;
letter-spacing: -0.025em;
```

### Títulos de coluna

```css
font-size: 0.78rem;
font-weight: 700;
letter-spacing: 0.1em;
text-transform: uppercase;
```

### Links e texto

```css
font-size: 0.95rem;
line-height: 1.6;
```

### Descrição institucional

```css
font-size: 1rem;
line-height: 1.7;
```

Não reduzir os links legais abaixo de 0.875rem.

---

# 6. Layout desktop

## 6.1. Grid principal

Usar quatro áreas.

Estrutura fallback:

```css
display: grid;
grid-template-columns:
  minmax(280px, 1.55fr)
  minmax(180px, 0.9fr)
  minmax(150px, 0.75fr)
  minmax(240px, 1fr);
gap: clamp(36px, 5vw, 72px);
```

## 6.2. Ordem

1. Marca;
2. Serviços;
3. Navegação;
4. Contato.

## 6.3. Alinhamento

Alinhar todas as colunas ao topo.

Não centralizar textos no desktop.

## 6.4. Altura

Não usar altura fixa.

O rodapé deve crescer conforme o conteúdo.

---

# 7. Bloco de marca

## 7.1. Nome

Usar:

```text
Marcelo Gonçalves
```

## 7.2. Link

O nome será link para:

```text
/
```

## 7.3. Nome acessível

```text
Marcelo Gonçalves — Página inicial
```

Não duplicar o anúncio para leitores de tela.

## 7.4. Descrição

Usar exatamente:

```text
Consultoria boutique liderada por Marcelo Gonçalves, com atuação em automação, inteligência artificial, sistemas e arquitetura AWS.
```

## 7.5. Tagline

Usar exatamente:

```text
Engenharia e tecnologia para operações mais integradas, eficientes e preparadas para crescer.
```

## 7.6. Hierarquia visual

- nome como elemento mais forte do bloco;
- descrição abaixo;
- tagline com destaque discreto ou borda lateral;
- não usar dois headings;
- não usar selo.

## 7.7. Largura

Limitar textos a aproximadamente:

```text
420px
```

## 7.8. Remover

Remover:

```text
Engenharia, IA e automação para quem quer destravar valor com tecnologia.
```

Remover:

```text
Desenvolvemos software, plataformas em nuvem, integrações e soluções com inteligência artificial para empresas que desejam crescer com tecnologia.
```

## 7.9. Não adicionar

- anos de experiência;
- certificações;
- métricas;
- clientes;
- redes sociais neste bloco;
- foto;
- logo AWS.

---

# 8. Coluna Serviços

## 8.1. Título

```text
Serviços
```

## 8.2. Links e ordem

1. Visão geral;
2. Automação e Integração;
3. Inteligência Artificial Aplicada;
4. Sistemas e Plataformas;
5. Cloud, DevOps e Confiabilidade.

## 8.3. Destinos

```text
Visão geral → /servicos
Automação e Integração → /automacao
Inteligência Artificial Aplicada → /inteligencia-artificial
Sistemas e Plataformas → /software
Cloud, DevOps e Confiabilidade → /plataforma
```

## 8.4. Labels compactos

Os nomes do rodapé podem ser ligeiramente mais compactos que os títulos oficiais, conforme acima.

Não usar:

```text
Engenharia de Software
Integração & Automação
Cloud & DevOps
Inteligência Artificial
```

como labels isolados.

## 8.5. Estado ativo

Não é necessário utilizar `aria-current="page"` no rodapé quando o header já indica a página atual.

É permitido utilizar `aria-current="page"` para consistência, desde que não gere excesso de anúncio.

Decisão preferencial:

```text
utilizar aria-current no link correspondente
```

O estilo ativo deve ser discreto.

## 8.6. Descrições

Não adicionar descrições sob cada serviço no rodapé.

O rodapé deve permanecer compacto.

---

# 9. Coluna Navegação

## 9.1. Título

```text
Navegação
```

## 9.2. Links e ordem

1. Home;
2. Sobre;
3. Artigos;
4. O Projeto;
5. Contato.

## 9.3. Destinos

```text
Home → /
Sobre → /sobre
Artigos → /artigos
O Projeto → /o-projeto
Contato → /contato
```

## 9.4. Remover

Remover:

```text
Blog
```

Não duplicar:

```text
Serviços
```

nesta coluna, pois existe a coluna própria.

## 9.5. Página atual

É permitido aplicar estado ativo discreto.

Não substituir o label por texto como “Você está aqui”.

---

# 10. Coluna Contato

## 10.1. Título

```text
Contato
```

## 10.2. Texto

Usar:

```text
Conte o que sua empresa precisa melhorar.
```

## 10.3. E-mail público

Usar:

```text
contato@marcelogoncalves.com
```

Destino:

```text
mailto:contato@marcelogoncalves.com
```

## 10.4. Condição de publicação do e-mail

O endereço só poderá aparecer em produção quando estiver:

- criado;
- recebendo mensagens;
- monitorado;
- com SPF, DKIM e DMARC configurados conforme aplicável;
- testado em envio e resposta;
- coerente com o Ajuste 14.

Se ainda não estiver operacional, utilizar temporariamente o endereço institucional real configurado, sem inventar.

Não exibir placeholder.

## 10.5. Localização

Usar:

```text
Belo Horizonte, MG · Atendimento remoto
```

## 10.6. CTA

Label:

```text
Apresentar um desafio
```

Destino:

```text
/contato
```

## 10.7. Hierarquia

Ordem:

1. texto;
2. e-mail;
3. localização;
4. CTA.

## 10.8. Estilo do CTA

O CTA deverá ser um link textual forte ou botão secundário compacto.

Não utilizar o mesmo botão primário amplo do CTA final.

Preferência:

```text
link com seta discreta
```

A seta deve ser decorativa.

## 10.9. Remover

Remover:

```text
Vamos conversar sobre seu próximo projeto.
```

Não usar:

```text
Fale conosco
Solicitar diagnóstico
Agendar uma conversa
```

## 10.10. Telefone e WhatsApp

Não exibir telefone no rodapé nesta tarefa.

O WhatsApp é tratado na página de Contato.

A inclusão futura exigirá:

- URL válida;
- canal monitorado;
- revisão visual;
- atualização do Aviso de Privacidade quando necessário.

## 10.11. LinkedIn

Não exibir por padrão.

É permitido adicionar um link textual discreto somente quando:

- URL pública validada;
- decisão de design aprovada;
- não houver poluição visual;
- o mesmo link estiver configurado na página Contato.

A implementação inicial deverá permanecer sem LinkedIn no rodapé.

---

# 11. Listas e semântica das colunas

## 11.1. Títulos

Usar headings coerentes, preferencialmente:

```html
<h2> ou <h3>
```

conforme a hierarquia da página.

Como o footer aparece após conteúdo variável, utilizar heading visualmente consistente sem assumir que sempre exista H2 anterior.

Abordagem recomendada:

- heading oculto do rodapé;
- títulos das colunas como `<h3>`.

## 11.2. Links

Usar listas:

```html
<ul>
  <li><a ...></a></li>
</ul>
```

Não usar divs soltas.

## 11.3. Navegações

Coluna Serviços:

```html
<nav aria-label="Serviços no rodapé">
```

Coluna Navegação:

```html
<nav aria-label="Navegação no rodapé">
```

Não envolver o bloco de contato em `<nav>`.

---

# 12. Faixa legal

## 12.1. Estrutura

A faixa inferior deverá conter:

1. copyright;
2. links legais;
3. botão Preferências de cookies;
4. Voltar ao topo.

## 12.2. Layout desktop

Usar:

```css
display: grid;
grid-template-columns: minmax(0, 1fr) auto auto;
align-items: center;
gap: 24px;
```

Agrupar links legais e preferências no mesmo bloco.

É permitido posicionar “Voltar ao topo” como terceiro bloco.

## 12.3. Divisor

Adicionar:

```css
border-top: 1px solid var(--footer-border);
```

## 12.4. Copyright

Usar:

```text
© {ano atual} Marcelo Gonçalves. Todos os direitos reservados.
```

Não usar:

```text
© 2026 Marcelo Gonçalves · Todos os direitos reservados
```

com ano hardcoded.

## 12.5. Ano

O ano deverá ser calculado no servidor ou no build.

Exemplo:

```ts
new Date().getFullYear()
```

Evitar hydration mismatch.

Não armazenar em CMS.

## 12.6. Fuso

O copyright utiliza ano civil atual.

Não é necessário aplicar timezone específico se a renderização no servidor for estável.

Para evitar divergência na virada do ano, é permitido calcular com:

```text
America/Sao_Paulo
```

quando a infraestrutura possuir utilitário de data.

---

# 13. Links legais

## 13.1. Ordem

1. Aviso de Privacidade;
2. Política de Cookies;
3. Termos de Uso.

## 13.2. Destinos

```text
Aviso de Privacidade → /politica-de-privacidade
Política de Cookies → /politica-de-cookies
Termos de Uso → /termos-de-uso
```

## 13.3. Comportamento

- mesma aba;
- links internos;
- foco visível;
- sem `target="_blank"`;
- sem ícone externo;
- sem tooltip.

## 13.4. Estado de rota

É permitido usar `aria-current="page"` quando o usuário estiver no documento atual.

## 13.5. Rotas

Não apontar para:

```text
/privacidade
/cookies
/termos
```

salvo redirects internos já definidos em outro ajuste.

Os links do rodapé devem apontar diretamente para as rotas oficiais.

---

# 14. Botão Preferências de cookies

## 14.1. Tipo

Usar:

```html
<button type="button">
```

Não usar `<a href="#">`.

Não criar rota falsa.

## 14.2. Texto

```text
Preferências de cookies
```

## 14.3. Comportamento

Ao clicar:

- chamar a interface pública do gerenciador de consentimento;
- abrir o painel definido no Ajuste 17D;
- mover foco corretamente;
- anunciar o painel;
- não recarregar a página;
- não alterar a preferência automaticamente.

## 14.4. Contrato técnico

Criar interface desacoplada, equivalente a uma destas opções:

```ts
openCookiePreferences(): void;
```

ou:

```ts
window.dispatchEvent(
  new CustomEvent("cookie-preferences:open")
);
```

ou contexto global existente.

Preferência:

```text
função ou contexto tipado
```

Evitar evento global se o projeto já possuir provider.

## 14.5. Estado antes do Ajuste 17D

Durante desenvolvimento intermediário:

- o botão pode chamar um stub controlado;
- o stub deve falhar de forma visível em desenvolvimento;
- não publicar em produção sem o painel funcional.

Não esconder o botão em produção.

## 14.6. Ausência de analytics

O clique no botão deve funcionar mesmo sem consentimento de analytics.

O evento analítico, se existir, só será enviado conforme as regras do Ajuste 17D.

## 14.7. Estilo

Aparência de link textual.

Manter área de toque mínima.

Não usar cor apagada que reduza a descoberta.

---

# 15. Voltar ao topo

## 15.1. Texto

```text
Voltar ao topo
```

## 15.2. Tipo

Preferir link:

```html
<a href="#top">
```

Se a aplicação exige controle programático, utilizar botão com comportamento equivalente.

## 15.3. Destino

O layout deverá possuir:

```text
id="top"
```

conforme Ajuste 17A.

## 15.4. Ícone

É permitido chevron para cima.

O ícone é decorativo.

## 15.5. Movimento

Comportamento padrão:

- scroll suave somente se o projeto já usar;
- movimento instantâneo quando `prefers-reduced-motion: reduce`.

## 15.6. Foco

Após ativação:

- não é necessário mover foco ao topo em navegação por mouse;
- por teclado, o foco deverá seguir o comportamento nativo do link ou ser movido para o skip link/header de modo previsível;
- não deixar foco visual no rodapé enquanto a viewport está no topo sem necessidade.

Abordagem preferencial:

```text
link nativo para #top
```

## 15.7. Posição visual

Desktop:

- alinhado à direita da faixa legal.

Mobile:

- bloco próprio abaixo dos links ou acima do copyright;
- não flutuar sobre conteúdo;
- não usar botão fixo nesta tarefa.

---

# 16. Estados de interação

## 16.1. Links

Estados:

- normal;
- hover;
- focus-visible;
- active;
- current.

## 16.2. Hover

Pode:

- alterar cor;
- adicionar sublinhado;
- deslocar seta em até 2px.

Não mover o texto ou causar reflow.

## 16.3. Foco

Fallback:

```css
outline: 3px solid rgba(59, 95, 138, 0.58);
outline-offset: 3px;
```

## 16.4. Link atual

Usar:

- `aria-current="page"`;
- peso discretamente maior;
- indicador não dependente apenas de cor.

## 16.5. Visited

Não utilizar cor de visited que quebre a identidade visual ou o contraste.

É permitido manter a mesma cor.

---

# 17. Responsividade — desktop amplo

A partir do breakpoint desktop:

- quatro colunas;
- marca mais ampla;
- faixa legal horizontal;
- links alinhados à esquerda;
- voltar ao topo à direita.

Não criar cinco colunas.

Não adicionar uma coluna exclusiva de redes sociais.

---

# 18. Responsividade — tablet

## 18.1. Faixa recomendada

Aproximadamente:

```text
768px a 1099px
```

## 18.2. Layout

Usar grid de duas colunas:

Primeira linha:

1. marca;
2. contato.

Segunda linha:

1. serviços;
2. navegação.

É permitido manter a ordem DOM original e reorganizar com grid somente quando a ordem de leitura continuar coerente.

Preferência de DOM:

1. marca;
2. serviços;
3. navegação;
4. contato.

No tablet, usar:

- marca ocupando duas colunas, se necessário;
- depois serviços, navegação e contato.

A decisão final deverá priorizar ordem DOM e leitura.

## 18.3. Faixa legal

Permitir quebra em duas linhas:

- copyright;
- links e preferências;
- voltar ao topo.

Não reduzir fonte para manter uma única linha.

---

# 19. Responsividade — mobile

## 19.1. Ordem

1. marca;
2. serviços;
3. navegação;
4. contato;
5. faixa legal;
6. voltar ao topo, se não estiver dentro da faixa.

## 19.2. Colunas

Uma coluna.

## 19.3. Accordions

Não utilizar accordions por padrão.

O número de links é pequeno e deve permanecer visível.

Somente usar accordions se o rodapé atual já tiver esse padrão e se a implementação for acessível.

Decisão preferencial:

```text
listas sempre abertas
```

## 19.4. Espaçamento

Separar blocos com:

- margin;
- ou borda discreta.

Não usar cards completos para cada coluna.

## 19.5. E-mail

Permitir quebra.

Usar:

```css
overflow-wrap: anywhere;
```

somente no link de e-mail, se necessário.

## 19.6. CTA

Não ocupar largura total obrigatoriamente.

Deve possuir área de toque adequada.

## 19.7. Faixa legal

Empilhar:

1. links legais;
2. preferências;
3. copyright;
4. voltar ao topo.

É permitido posicionar copyright primeiro.

A ordem escolhida deve ser consistente e testada.

Preferência:

1. copyright;
2. links legais;
3. preferências;
4. voltar ao topo.

---

# 20. Breakpoints

Reutilizar os breakpoints globais.

Caso não existam:

```css
@media (min-width: 768px)
@media (min-width: 1100px)
```

Não criar breakpoints excessivos.

Não depender de JavaScript para alterar o layout.

---

# 21. Acessibilidade

## 21.1. Landmark

Usar `<footer>`.

Não adicionar `role="contentinfo"` quando o elemento já fornece a semântica, salvo necessidade de compatibilidade documentada.

## 21.2. Quantidade

Deve existir um único rodapé principal por página pública.

## 21.3. Headings

- não pular níveis de forma incoerente;
- heading oculto para o rodapé;
- títulos de coluna consistentes;
- não usar heading apenas para estilo.

## 21.4. Navegações

Cada `<nav>` deve possuir nome único.

## 21.5. Teclado

Todos os links e botões acessíveis por Tab.

Ordem de foco deve acompanhar a ordem visual e DOM.

## 21.6. Área de toque

Links importantes e botão de cookies devem possuir altura ou padding suficiente para aproximadamente:

```text
44px
```

em mobile.

## 21.7. Contraste

WCAG AA para:

- textos;
- links;
- headings;
- foco;
- copyright;
- links legais;
- preferências;
- estados ativos.

## 21.8. Conteúdo oculto

Não ocultar texto essencial somente para reduzir altura.

## 21.9. Ícones

Decorativos com:

```text
aria-hidden="true"
```

## 21.10. Leitores de tela

Validar:

- nome da marca;
- nav Serviços;
- nav Rodapé;
- e-mail;
- localização;
- CTA;
- preferências;
- voltar ao topo;
- copyright;
- link atual.

---

# 22. Progressive enhancement

## 22.1. Sem JavaScript

Devem funcionar:

- todos os links;
- e-mail;
- CTA;
- documentos legais;
- voltar ao topo.

## 22.2. Preferências de cookies

Sem JavaScript, o botão não conseguirá abrir o painel.

O projeto deverá oferecer uma das seguintes alternativas:

1. ocultar o botão apenas quando JavaScript estiver comprovadamente indisponível e fornecer orientação na Política de Cookies;
2. utilizar `<noscript>` com texto:
   ```text
   Para alterar as preferências de cookies, habilite JavaScript ou consulte a Política de Cookies.
   ```

Preferência:

```text
manter botão no HTML e adicionar orientação noscript
```

## 22.3. Não bloquear

A falha do gerenciador de cookies não pode impedir navegação ou leitura do rodapé.

---

# 23. Rodapé em páginas especiais

## 23.1. Home e páginas institucionais

Usar rodapé completo.

## 23.2. Artigos e posts

Usar rodapé completo.

Não adicionar links editoriais extras por rota.

## 23.3. Páginas legais

Usar rodapé completo.

É permitido que o link legal atual receba estado ativo.

## 23.4. Contato

Usar rodapé completo.

Não remover a coluna Contato por redundância.

## 23.5. O Projeto

Usar rodapé completo.

## 23.6. 404

Quando implementada no Ajuste 17F:

- usar rodapé completo ou simplificado;
- decisão preferencial: rodapé completo, desde que não dependa de dados dinâmicos.

## 23.7. 500

Quando implementada:

- rodapé simplificado pode ser utilizado para evitar dependências;
- deve manter links legais e Home;
- especificação final pertence ao Ajuste 17F.

## 23.8. Preview administrativo

O preview público autenticado pode utilizar rodapé completo.

A área administrativa não deverá utilizar este rodapé.

---

# 24. Impressão

## 24.1. Regra geral

Em impressão de artigos e páginas legais:

- ocultar rodapé de navegação ou simplificá-lo;
- preservar identificação básica e canonical, se o template de impressão já possuir;
- não imprimir menus extensos;
- não imprimir botão Preferências;
- não imprimir Voltar ao topo.

## 24.2. CSS

Usar:

```css
@media print
```

Decisão preferencial:

```text
ocultar o rodapé global
```

quando o documento impresso já possui cabeçalho ou metadata.

Para páginas institucionais genéricas, também é aceitável ocultar.

---

# 25. Analytics do rodapé

Aplicar somente se existir helper e consentimento analítico.

Não instalar analytics nesta tarefa.

## 25.1. Eventos

```text
footer_service_click
footer_navigation_click
footer_contact_click
footer_legal_click
footer_cookie_preferences_click
footer_back_to_top_click
```

## 25.2. Propriedades permitidas

- `itemId`;
- `serviceId`;
- `linkType`;
- `currentSection`;
- `viewport`.

## 25.3. Valores de `linkType`

```text
service
navigation
email
contact-cta
legal
cookie-preferences
back-to-top
```

## 25.4. Dados proibidos

Não enviar:

- endereço de e-mail como valor;
- pathname completo com query sensível;
- PII;
- referrer completo;
- URL de WhatsApp;
- texto livre.

## 25.5. Preferências de cookies

O botão deve abrir o painel mesmo quando analytics estiver rejeitado.

O clique não deve ser enviado antes do consentimento.

## 25.6. Funcionamento

Nenhum link pode depender do evento.

---

# 26. Performance

## 26.1. JavaScript

O rodapé deverá ser predominantemente estático.

JavaScript necessário apenas para:

- painel de cookies;
- analytics;
- comportamento opcional de voltar ao topo.

## 26.2. Ícones

Não importar pacote inteiro.

## 26.3. Fontes

Reutilizar.

## 26.4. Layout shift

Não carregar conteúdo tardio que altere altura.

O ano deve estar presente no HTML inicial.

## 26.5. Dados externos

Não buscar links por API.

## 26.6. Redes sociais

Não carregar scripts ou widgets.

---

# 27. Segurança básica

## 27.1. Links

Todos os links internos definidos no código.

## 27.2. E-mail

Não interpolar endereço vindo de query ou CMS sem validação.

## 27.3. Links externos futuros

Quando houver:

- `https`;
- URL validada;
- `noopener noreferrer`;
- indicação acessível.

## 27.4. HTML

Não usar `dangerouslySetInnerHTML`.

## 27.5. Preferências

Não permitir que o botão execute código arbitrário vindo de configuração.

---

# 28. Conteúdo obrigatório

Verificar presença de:

```text
Marcelo Gonçalves
Consultoria boutique liderada por Marcelo Gonçalves, com atuação em automação, inteligência artificial, sistemas e arquitetura AWS.
Engenharia e tecnologia para operações mais integradas, eficientes e preparadas para crescer.
Serviços
Visão geral
Automação e Integração
Inteligência Artificial Aplicada
Sistemas e Plataformas
Cloud, DevOps e Confiabilidade
Navegação
Home
Sobre
Artigos
O Projeto
Contato
Conte o que sua empresa precisa melhorar.
contato@marcelogoncalves.com
Belo Horizonte, MG · Atendimento remoto
Apresentar um desafio
Aviso de Privacidade
Política de Cookies
Termos de Uso
Preferências de cookies
Voltar ao topo
Todos os direitos reservados.
```

O e-mail depende da validação operacional definida.

---

# 29. Conteúdo obrigatório ausente

Verificar ausência no rodapé:

```text
Engenharia de Software
Inteligência Artificial
Integração & Automação
Cloud & DevOps
Blog
Vamos conversar sobre seu próximo projeto.
Engenharia, IA e automação para quem quer destravar valor com tecnologia.
Desenvolvemos software, plataformas em nuvem, integrações e soluções com inteligência artificial para empresas que desejam crescer com tecnologia.
Solicitar diagnóstico
Conheça nossos serviços
```

A frase “Inteligência Artificial” pode aparecer como parte de “Inteligência Artificial Aplicada”, mas não como label isolado do serviço.

---

# 30. Implementação técnica sugerida

## 30.1. Componentes

```text
SiteFooter
├── FooterBrand
├── FooterServicesNavigation
├── FooterPrimaryNavigation
├── FooterContact
└── FooterLegalBar
    ├── Copyright
    ├── LegalLinks
    ├── CookiePreferencesButton
    └── BackToTopLink
```

## 30.2. Reutilização

Reutilizar:

- Link do framework;
- container;
- tokens;
- foco global;
- ícones;
- configuração de navegação;
- serviço de consentimento futuro.

## 30.3. Estado

O rodapé não deverá possuir estado próprio relevante, exceto:

- integração com o painel de cookies;
- possível estado de feedback de erro em desenvolvimento.

## 30.4. Contexto de cookies

Consumir interface pública.

Não conhecer os detalhes internos das categorias.

## 30.5. Renderização

Preferir Server Component ou renderização estática para o conteúdo.

Isolar o botão de cookies em Client Component quando necessário.

Não transformar todo o rodapé em Client Component por causa de um botão.

---

# 31. Ordem de implementação

Executar:

1. localizar o rodapé atual;
2. identificar duplicações;
3. identificar tokens;
4. criar ou atualizar configuração;
5. implementar marca;
6. atualizar descrição;
7. atualizar tagline;
8. atualizar Serviços;
9. atualizar Navegação;
10. implementar Contato;
11. adicionar e-mail validado;
12. adicionar localização;
13. adicionar CTA discreto;
14. reestruturar faixa legal;
15. implementar ano dinâmico;
16. validar rotas legais;
17. transformar Preferências em botão;
18. criar contrato com o painel futuro;
19. implementar Voltar ao topo;
20. ajustar tablet;
21. ajustar mobile;
22. ajustar impressão;
23. adicionar analytics somente se helper existir;
24. remover conteúdo antigo;
25. executar testes;
26. executar lint;
27. executar build;
28. revisar em todas as rotas.

---

# 32. Testes unitários — configuração

Testar:

1. nome;
2. descrição;
3. tagline;
4. cinco links de Serviços;
5. cinco links de Navegação;
6. e-mail;
7. localização;
8. CTA;
9. três links legais;
10. IDs únicos;
11. ausência de `/blog`;
12. ausência de labels antigos;
13. rotas corretas.

---

# 33. Testes unitários — ano

Testar:

- ano atual renderizado;
- sem valor hardcoded;
- sem hydration mismatch;
- virada de ano, quando aplicável.

É permitido mockar a data.

---

# 34. Testes de integração — links

Validar:

```text
/
```

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

```text
/sobre
```

```text
/artigos
```

```text
/o-projeto
```

```text
/contato
```

```text
/politica-de-privacidade
```

```text
/politica-de-cookies
```

```text
/termos-de-uso
```

```text
mailto:contato@marcelogoncalves.com
```

---

# 35. Testes de integração — cookies

Antes do Ajuste 17D:

- botão chama o contrato previsto em teste;
- não navega;
- não submete formulário;
- não recarrega.

Depois do Ajuste 17D:

- abre painel;
- move foco;
- não altera preferência sozinho;
- funciona sem analytics;
- fecha e devolve foco conforme especificação 17D.

---

# 36. Testes de integração — Voltar ao topo

Testar:

- link aponta para `#top`;
- funciona com mouse;
- funciona com teclado;
- não causa erro sem JavaScript;
- movimento reduzido;
- foco previsível;
- não fica fixo no mobile.

---

# 37. Testes de teclado

Ordem esperada dentro do rodapé:

1. marca;
2. links de Serviços;
3. links de Navegação;
4. e-mail;
5. CTA;
6. links legais;
7. Preferências de cookies;
8. Voltar ao topo.

A ordem exata deverá seguir o DOM.

Não usar tabindex positivo.

---

# 38. Testes de leitores de tela

Validar:

- rodapé anunciado;
- heading oculto;
- nav Serviços;
- nav Navegação;
- marca;
- descrição;
- e-mail;
- localização;
- CTA;
- links legais;
- botão Preferências;
- Voltar ao topo;
- copyright;
- link atual;
- ausência de links duplicados sem contexto.

---

# 39. Testes responsivos

Validar:

```text
320px
360px
390px
414px
768px
900px
1024px
1100px
1280px
1366px
1440px
1920px
```

Também:

- zoom 200%;
- texto ampliado;
- landscape móvel;
- e-mail longo;
- fontes não carregadas;
- página com pouco conteúdo;
- página muito longa.

---

# 40. Testes de contraste

Validar:

- fundo e texto;
- headings;
- links;
- hover;
- foco;
- copyright;
- links legais;
- preferências;
- CTA;
- link atual.

---

# 41. Testes de impressão

Validar:

- rodapé oculto ou simplificado;
- sem botão de cookies;
- sem Voltar ao topo;
- sem links extensos;
- sem espaço vazio excessivo;
- artigos e documentos legais continuam imprimíveis.

---

# 42. Testes de regressão

Validar o rodapé em:

- Home;
- Serviços;
- Sobre;
- Automação;
- IA;
- Sistemas;
- Cloud;
- Artigos;
- Categoria;
- Post;
- O Projeto;
- Contato;
- páginas legais;
- preview.

Verificar:

- nenhuma página cria rodapé próprio;
- nenhum CTA final é alterado;
- nenhum conteúdo é coberto;
- banner de cookies futuro terá z-index compatível;
- header e rodapé não compartilham IDs;
- `#top` continua único.

---

# 43. Critérios de aceite — conteúdo

O rodapé será aceito quando:

1. posicionamento novo estiver presente;
2. nomes dos serviços estiverem atualizados;
3. Artigos substituir Blog;
4. e-mail estiver funcional;
5. localização estiver presente;
6. CTA for Apresentar um desafio;
7. links legais estiverem corretos;
8. copyright for dinâmico;
9. textos antigos estiverem removidos;
10. não houver informação inventada.

---

# 44. Critérios de aceite — estrutura

Será aceito quando:

1. houver quatro áreas principais;
2. faixa legal estiver separada;
3. Serviços e Navegação forem navs nomeados;
4. Contato não for nav;
5. listas forem semânticas;
6. uma única configuração alimentar o componente;
7. botão de cookies não for link falso;
8. Voltar ao topo usar destino real;
9. não houver rodapés diferentes por página;
10. a área administrativa não reutilizar o rodapé público.

---

# 45. Critérios de aceite — visual

Será aceito quando:

1. identidade atual for preservada;
2. fundo continuar claro;
3. não houver gradiente;
4. não houver logos;
5. não houver redes sociais por padrão;
6. não houver formulário;
7. não houver newsletter;
8. tablet não comprimir quatro colunas;
9. mobile usar uma coluna;
10. não houver overflow;
11. CTA for discreto;
12. faixa legal for legível.

---

# 46. Critérios de aceite — acessibilidade

Será aceito quando:

1. footer possuir landmark;
2. navs possuírem nomes;
3. foco for visível;
4. ordem de Tab for coerente;
5. área de toque for adequada;
6. links atuais forem identificáveis;
7. botão de cookies for anunciado como botão;
8. Voltar ao topo for compreensível;
9. contraste atender AA;
10. zoom 200% não quebrar;
11. leitores de tela compreenderem a estrutura;
12. sem JavaScript os links funcionarem.

---

# 47. Checklist final de revisão humana

- [ ] Um único rodapé global.
- [ ] Estrutura com quatro áreas.
- [ ] Marca correta.
- [ ] Descrição correta.
- [ ] Tagline correta.
- [ ] Texto antigo removido.
- [ ] Serviços com cinco links.
- [ ] Visão geral presente.
- [ ] Automação e Integração presente.
- [ ] IA Aplicada presente.
- [ ] Sistemas e Plataformas presente.
- [ ] Cloud, DevOps e Confiabilidade presente.
- [ ] Labels antigos removidos.
- [ ] Navegação com cinco links.
- [ ] Artigos substitui Blog.
- [ ] Contato possui texto.
- [ ] E-mail funcional.
- [ ] Localização correta.
- [ ] CTA correto.
- [ ] Sem telefone fictício.
- [ ] Sem WhatsApp no rodapé.
- [ ] Sem LinkedIn por padrão.
- [ ] Faixa legal separada.
- [ ] Copyright dinâmico.
- [ ] Aviso de Privacidade correto.
- [ ] Política de Cookies correta.
- [ ] Termos de Uso corretos.
- [ ] Preferências é botão.
- [ ] Contrato de cookies definido.
- [ ] Voltar ao topo funciona.
- [ ] `#top` único.
- [ ] Nav Serviços nomeado.
- [ ] Nav Rodapé nomeado.
- [ ] Lists semânticas.
- [ ] Foco visível.
- [ ] Estado ativo discreto.
- [ ] Hover sem reflow.
- [ ] Desktop validado.
- [ ] Tablet validado.
- [ ] Mobile validado.
- [ ] 320px validado.
- [ ] 360px validado.
- [ ] 390px validado.
- [ ] 768px validado.
- [ ] 1024px validado.
- [ ] 1366px validado.
- [ ] 1440px validado.
- [ ] Zoom 200% validado.
- [ ] Landscape validado.
- [ ] E-mail não causa overflow.
- [ ] Teclado validado.
- [ ] Leitor de tela validado.
- [ ] Contraste validado.
- [ ] Impressão validada.
- [ ] Sem JavaScript validado.
- [ ] Analytics não é dependência.
- [ ] Lint concluído.
- [ ] Testes concluídos.
- [ ] Build concluído.
- [ ] Todas as rotas revisadas.

---

# 48. Resultado esperado

Ao final, o rodapé deverá encerrar a experiência de forma clara e útil:

> A marca é apresentada com o posicionamento definitivo, os quatro serviços podem ser acessados diretamente, a navegação complementar permanece disponível, o visitante encontra um canal de contato verificável e pode consultar os documentos legais ou alterar suas preferências de cookies.

O rodapé deverá parecer:

- parte natural da plataforma;
- institucional;
- técnico;
- calmo;
- simples;
- consistente;
- acessível;
- fácil de manter.

Ele não deverá parecer:

- um segundo menu principal;
- um CTA comercial completo;
- um catálogo de tecnologias;
- uma página legal comprimida;
- uma área de captura;
- um bloco de redes sociais.
