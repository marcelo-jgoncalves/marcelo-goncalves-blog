# Especificação definitiva — Sistema editorial, Artigos, Posts e O Projeto

## 0. Finalidade e precedência

Este documento define, de forma exaustiva e diretamente executável, todas as alterações necessárias no sistema editorial público da plataforma.

O escopo compreende:

- página principal de artigos;
- páginas de categoria;
- páginas individuais de post;
- página O Projeto;
- estados editoriais;
- publicação e agendamento;
- conteúdo de teste;
- uso de inteligência artificial no fluxo editorial;
- tradução;
- SEO;
- navegação;
- conteúdo relacionado;
- CTAs editoriais;
- acessibilidade;
- responsividade;
- performance;
- analytics;
- segurança;
- preview;
- cache;
- testes;
- regras para o CMS e para as consultas públicas.

A IA engenheira deverá implementar exatamente o que está definido, sem:

- escolher textos alternativos;
- resumir os textos finais;
- criar categorias;
- mudar rotas por iniciativa própria;
- publicar conteúdo de teste;
- publicar rascunhos;
- publicar conteúdo gerado por IA sem revisão humana;
- apresentar funcionalidades planejadas como entregues;
- transformar o blog em catálogo de serviços;
- adicionar newsletter ainda não ativa;
- criar comentários;
- criar login público;
- inventar artigos;
- inventar datas;
- inventar autor;
- inventar métricas;
- alterar a identidade visual;
- instalar bibliotecas sem necessidade;
- criar novas páginas além das autorizadas.

Em caso de conflito:

1. este documento prevalece sobre rotas, textos, regras editoriais, listagem, posts, categorias e página O Projeto;
2. o Ajuste 7 continua prevalecendo sobre a estrutura geral da Home;
3. este documento substitui o destino `/blog` definido anteriormente, padronizando-o como `/artigos`;
4. o Ajuste 13 continua prevalecendo sobre provas, métricas, clientes e estudos de caso;
5. os componentes globais de cabeçalho, rodapé e CTA continuam seguindo o Ajuste 7;
6. as regras da página de contato continuam seguindo o Ajuste 14.

---

# 1. Rotas definitivas

## 1.1. Página principal de artigos

Usar:

```text
/artigos
```

Esta será a única rota canônica para a página principal do conteúdo editorial.

## 1.2. Rota `/blog`

Se `/blog` existir:

- criar redirecionamento permanente para `/artigos`;
- preservar somente parâmetros de consulta reconhecidos;
- descartar parâmetros desconhecidos quando necessário para segurança;
- não manter duas páginas indexáveis;
- não usar `/blog` como canonical;
- atualizar todos os links internos.

## 1.3. Posts individuais

Preservar nesta etapa:

```text
/post/[slug]
```

Não migrar os posts para `/artigos/[slug]` nesta tarefa.

Uma futura migração só poderá ocorrer com:

- inventário completo de slugs;
- redirects permanentes;
- canonical atualizado;
- sitemap atualizado;
- links internos atualizados;
- validação de compartilhamentos e backlinks;
- especificação separada.

## 1.4. Categorias

Preservar:

```text
/categoria/[slug]
```

## 1.5. O Projeto

Preservar:

```text
/o-projeto
```

## 1.6. Rotas futuras em inglês

Reservar, sem publicar automaticamente:

```text
/en/articles
```

```text
/en/post/[slug]
```

A versão em inglês só poderá ser ativada quando houver conteúdo revisado e estrutura completa de SEO multilíngue.

---

# 2. Atualização transversal dos links

## 2.1. Home

Na seção de conteúdo técnico, substituir o destino:

```text
/blog
```

por:

```text
/artigos
```

Usar o CTA:

```text
Explorar os artigos
```

Destino:

```text
/artigos
```

## 2.2. Cabeçalho

O item editorial principal deverá ser:

```text
Artigos
```

Destino:

```text
/artigos
```

Não usar “Blog” no menu principal.

## 2.3. Rodapé

Usar:

```text
Artigos
```

Destino:

```text
/artigos
```

É permitido manter um grupo de links chamado:

```text
Publicações
```

## 2.4. O Projeto

Links para conteúdo relacionado deverão apontar para:

```text
/categoria/bastidores-projeto
```

## 2.5. Links antigos

Executar busca global por:

```text
/blog
```

Atualizar links internos para:

```text
/artigos
```

Não alterar URLs externas que contenham `/blog`.

---

# 3. Papel editorial da plataforma

O conteúdo deverá cumprir quatro funções:

1. demonstrar raciocínio técnico;
2. registrar decisões, erros e aprendizados;
3. explicar aplicações práticas de cloud, automação, IA e software;
4. criar uma ponte natural para os serviços da consultoria.

A plataforma editorial deverá continuar:

- autoral;
- humana;
- opinativa quando apropriado;
- tecnicamente profunda;
- baseada em experiências e fontes;
- separada do tom comercial das páginas de serviços.

Não transformar artigos em:

- textos publicitários;
- páginas de captura;
- listas superficiais de ferramentas;
- material genérico produzido em massa;
- cópias de documentação oficial;
- resumos sem posicionamento;
- anúncios disfarçados;
- páginas de afiliados sem conteúdo editorial real.

---

# 4. Taxonomia editorial

## 4.1. Categorias principais

Usar exatamente estas seis categorias públicas:

| Nome público | Slug |
|---|---|
| Cloud e AWS | `cloud-aws` |
| DevOps e Confiabilidade | `devops-confiabilidade` |
| Automação e Integração | `automacao-integracao` |
| Inteligência Artificial | `inteligencia-artificial` |
| Sistemas e Engenharia | `sistemas-engenharia` |
| Bastidores do Projeto | `bastidores-projeto` |

## 4.2. Regra de categoria

Cada artigo deverá possuir exatamente uma categoria principal.

Não permitir:

- zero categorias;
- múltiplas categorias principais;
- categoria livre digitada manualmente;
- categoria não registrada;
- variações ortográficas.

## 4.3. Tags

Cada artigo poderá possuir de zero a cinco tags.

As tags:

- não substituem a categoria;
- devem utilizar nomes curtos;
- devem ser reutilizadas;
- não devem ser criadas para um único artigo sem justificativa;
- não devem duplicar o nome da categoria;
- não devem conter hashtags;
- não devem conter tecnologias irrelevantes mencionadas apenas uma vez.

## 4.4. Páginas de tag

Não criar páginas públicas de tag nesta tarefa.

Tags poderão aparecer nos artigos e ser usadas internamente para conteúdo relacionado.

## 4.5. Categorias adicionais

Não criar categorias como:

- Carreira;
- Opinião;
- Notícias;
- Investimentos;
- Tutoriais;
- Diversos;
- Outros.

Uma nova categoria exigirá decisão editorial e especificação adicional.

---

# 5. Estados editoriais

Usar exatamente:

```text
draft
```

```text
review
```

```text
scheduled
```

```text
published
```

```text
archived
```

## 5.1. draft

Conteúdo em elaboração.

Não pode aparecer publicamente.

## 5.2. review

Conteúdo aguardando revisão humana.

Não pode aparecer publicamente.

## 5.3. scheduled

Conteúdo aprovado com data futura.

Não pode aparecer antes de `publishedAt`.

## 5.4. published

Conteúdo público somente quando:

- `publishedAt` existe;
- `publishedAt <= agora`;
- não é teste;
- não está marcado como `noindex` nas listagens;
- possui todos os campos obrigatórios;
- passou pelos quality gates.

## 5.5. archived

Conteúdo retirado da listagem.

Comportamento:

- se nunca foi público: retornar 404;
- se já foi público e não existe substituto: retornar 410;
- se existe conteúdo realmente equivalente: redirecionamento permanente;
- remover do sitemap;
- remover de relacionados;
- remover da Home;
- não redirecionar genericamente para `/artigos`.

---

# 6. Flags editoriais

Cada artigo deverá possuir:

```ts
isTest: boolean;
noindex: boolean;
featured: boolean;
featuredPriority?: number;
```

## 6.1. `isTest`

Artigo de teste.

Regras:

- nunca público em produção;
- não aparece em busca;
- não aparece em categorias;
- não aparece em relacionados;
- não aparece na Home;
- não entra no sitemap;
- o processo de build deve falhar se um artigo de teste for incluído em coleção pública.

## 6.2. `noindex`

Conteúdo acessível por URL, mas fora de mecanismos de busca e das superfícies editoriais de descoberta.

Regras:

- não aparecer na Home;
- não aparecer em `/artigos`;
- não aparecer em categorias;
- não aparecer em relacionados;
- não entrar no sitemap;
- incluir `noindex, follow`;
- usar apenas para situações editoriais específicas.

## 6.3. `featured`

Marca o artigo como candidato a destaque.

Apenas um artigo será exibido como destaque na página principal.

## 6.4. Seleção de destaque

Ordenar candidatos por:

1. `featuredPriority` decrescente;
2. `publishedAt` decrescente;
3. `id` como critério estável.

O primeiro artigo é o destaque.

Se não houver artigo elegível:

- não renderizar o bloco;
- não exibir placeholder;
- não alterar o restante da página.

---

# 7. Modelo de dados do artigo

Usar estrutura equivalente:

```ts
type ArticleStatus =
  | "draft"
  | "review"
  | "scheduled"
  | "published"
  | "archived";

type ArticleLocale = "pt-BR" | "en";

interface Article {
  id: string;
  slug: string;
  locale: ArticleLocale;
  translationGroupId?: string;

  status: ArticleStatus;
  isTest: boolean;
  noindex: boolean;

  title: string;
  subtitle?: string;
  excerpt: string;
  body: RichTextContent;

  categoryId: string;
  tags: string[];

  authorId: string;

  coverImage?: MediaReference;
  coverAlt?: string;
  coverCaption?: string;

  featured: boolean;
  featuredPriority?: number;

  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  scheduledAt?: string;

  seoTitle?: string;
  seoDescription?: string;
  canonicalUrl?: string;

  relatedServiceId?: string;

  sourceReferences?: SourceReference[];

  aiWorkflow?: ArticleAIWorkflow;
}
```

## 7.1. Campos públicos obrigatórios

Para publicação:

- `id`;
- `slug`;
- `locale`;
- `status`;
- `title`;
- `excerpt`;
- `body`;
- `categoryId`;
- `authorId`;
- `publishedAt`;
- `updatedAt`;
- `isTest`;
- `noindex`.

## 7.2. Capa

A capa é obrigatória para:

- artigo em destaque;
- cards da Home;
- compartilhamento social.

Para artigos comuns, utilizar capa própria ou fallback editorial oficial.

Não utilizar imagem quebrada.

---

# 8. Consulta pública obrigatória

Toda consulta pública deverá aplicar:

```text
status === "published"
```

```text
publishedAt <= now
```

```text
isTest === false
```

```text
noindex === false
```

Além disso:

- slug válido;
- título não vazio;
- excerpt não vazio;
- body válido;
- categoria registrada;
- autor registrado.

## 8.1. Bloqueio por título

Em produção, excluir e sinalizar erro quando o título começar por:

```text
[TESTE]
```

ignorando maiúsculas, minúsculas e espaços iniciais.

Também bloquear:

```text
TESTE -
```

```text
TEST:
```

```text
Lorem Ipsum
```

quando usados como marcadores editoriais.

## 8.2. Conteúdo futuro

Artigos com data futura não podem aparecer mesmo que o status tenha sido incorretamente salvo como `published`.

---

# 9. Página principal de Artigos

## 9.1. Rota

```text
/artigos
```

## 9.2. Ordem final

1. Cabeçalho global;
2. Hero editorial;
3. Artigo em destaque, quando existir;
4. Busca e categorias;
5. Lista de artigos;
6. Paginação;
7. CTA editorial compacto;
8. Rodapé global.

## 9.3. Estrutura proibida

Não criar:

- carrossel;
- sidebar fixa;
- nuvem de tags;
- ranking de mais lidos nesta tarefa;
- newsletter;
- anúncios;
- seção de serviços antes dos artigos;
- popup;
- modal;
- filtros avançados;
- ordenação manual pelo usuário;
- login.

---

# 10. Hero da página Artigos

## 10.1. Eyebrow

Substituir qualquer texto equivalente a:

```text
Arquivo · Todos os artigos
```

por:

```text
Artigos
```

## 10.2. H1

Usar:

```text
Engenharia aplicada, decisões técnicas e aprendizados de produção.
```

## 10.3. Subtítulo

Usar:

```text
Um acervo de aprendizados reais sobre cloud, automação, inteligência artificial e operações — do problema à solução.
```

## 10.4. CTA

Não adicionar CTA no hero.

## 10.5. Regras visuais

- preservar identidade editorial;
- hero mais compacto que a Home;
- não adicionar imagem;
- não adicionar números de artigos;
- não exibir contagem total no hero;
- limitar largura do texto;
- manter alinhamento atual;
- mobile sem corte;
- não usar `white-space: nowrap`.

---

# 11. Artigo em destaque

## 11.1. Condição

Renderizar somente quando houver artigo elegível.

## 11.2. Eyebrow

```text
Em destaque
```

## 11.3. Conteúdo

Exibir:

- imagem;
- categoria;
- data;
- tempo de leitura;
- título;
- excerpt;
- CTA.

## 11.4. CTA

```text
Ler artigo
```

## 11.5. Link

Destino:

```text
/post/{slug}
```

## 11.6. Regras

- o card inteiro pode ser clicável somente se o componente atual já suportar sem links aninhados;
- imagem com proporção consistente;
- título como `<h2>`;
- categoria não deve ser heading;
- não exibir autor no destaque;
- não exibir tags;
- não exibir mais de um destaque;
- excluir o destaque do grid da primeira página;
- em páginas de paginação maiores que 1, não renderizar o bloco de destaque.

---

# 12. Busca e categorias

## 12.1. Estrutura

Exibir em uma barra ou bloco único:

1. campo de busca;
2. categorias.

## 12.2. Campo de busca

### Label

```text
Pesquisar artigos
```

### Placeholder

```text
Busque por tema, tecnologia ou problema
```

### Query parameter

```text
q
```

### Regras

- aceitar busca a partir de 2 caracteres;
- máximo de 100 caracteres;
- remover espaços externos;
- busca sem diferenciar maiúsculas e minúsculas;
- normalizar acentos para comparação;
- considerar título, excerpt, tags e categoria;
- não buscar no HTML bruto;
- não refletir HTML da query;
- manter a query na URL;
- permitir compartilhamento da busca;
- limpar pelo botão acessível “Limpar busca”;
- não executar busca a cada caractere sem debounce;
- se client-side, debounce de 300 ms;
- se server-side, enviar por formulário GET.

## 12.3. Categorias

Exibir:

```text
Todos
```

seguido pelas seis categorias oficiais.

## 12.4. Comportamento

Na página `/artigos`:

- “Todos” ativo por padrão;
- selecionar categoria navega para `/categoria/[slug]`;
- não filtrar categoria apenas por JavaScript;
- manter URLs indexáveis de categoria.

## 12.5. Acessibilidade

- label visível;
- botão de limpar com nome acessível;
- estado ativo da categoria não depender apenas de cor;
- links de categoria acessíveis por teclado;
- sem rolagem horizontal obrigatória;
- em mobile, permitir quebra;
- rolagem horizontal só será aceita se o componente atual já utilizá-la com foco visível e indicação de conteúdo lateral.

---

# 13. Cabeçalho da listagem

## 13.1. Sem busca

Usar:

```text
Todos os artigos
```

como `<h2>`.

## 13.2. Com busca

Usar:

```text
Resultados para “{query sanitizada}”
```

## 13.3. Contagem

É permitido exibir:

```text
{n} artigos encontrados
```

ou:

```text
1 artigo encontrado
```

Não exibir contagem se a consulta não retornar total confiável.

## 13.4. Query curta

Quando a query possuir menos de 2 caracteres:

- não executar busca;
- manter listagem padrão;
- exibir helper:

```text
Digite pelo menos 2 caracteres para pesquisar.
```

---

# 14. Grid de artigos

## 14.1. Quantidade

Exibir até:

```text
9 artigos por página
```

O destaque não conta nesse limite.

## 14.2. Ordenação

Ordenar por:

1. `publishedAt` decrescente;
2. `id` como desempate estável.

## 14.3. Card

Cada card deverá exibir:

1. imagem;
2. categoria;
3. data;
4. tempo de leitura;
5. título;
6. excerpt;
7. link.

## 14.4. CTA

```text
Ler artigo
```

## 14.5. Não exibir

- autor;
- tags;
- número de visualizações;
- número de curtidas;
- comentários;
- percentual de leitura;
- badges de IA;
- tempo desde a publicação em formato relativo;
- data futura.

## 14.6. Data

Formato:

```text
27 de julho de 2026
```

Usar locale:

```text
pt-BR
```

Não usar:

```text
há 2 dias
```

como única informação.

## 14.7. Tempo de leitura

Calcular a partir do conteúdo textual limpo.

Regra:

```text
200 palavras por minuto
```

Arredondar para cima.

Mínimo:

```text
1 min de leitura
```

Não contar:

- código;
- alt text;
- navegação;
- metadados.

## 14.8. Excerpt

- máximo visual de aproximadamente 160 caracteres;
- utilizar excerpt editorial;
- não cortar palavras no dado;
- truncamento visual pode usar line-clamp;
- não gerar automaticamente a partir do HTML durante a renderização pública.

---

# 15. Estado vazio da página Artigos

## 15.1. Busca sem resultado

### H2

```text
Nenhum artigo encontrado.
```

### Texto

```text
Tente outro termo ou explore as categorias disponíveis.
```

### Ação

```text
Limpar busca
```

## 15.2. Sem artigos publicados

### H2

```text
Novos artigos estão em preparação.
```

### Texto

```text
O conteúdo será publicado quando estiver revisado e pronto para leitura.
```

Não exibir:

- cards falsos;
- datas estimadas;
- artigos de teste;
- placeholders.

---

# 16. Paginação

## 16.1. Query parameter

```text
pagina
```

## 16.2. Primeira página

URL canônica:

```text
/artigos
```

Não gerar:

```text
/artigos?pagina=1
```

como canonical.

## 16.3. Controles

Exibir:

```text
Anterior
```

```text
Próxima
```

e números de página quando o componente atual comportar.

## 16.4. Regras

- links reais;
- não depender de JavaScript;
- preservar `q` quando houver busca;
- não preservar categoria na rota `/artigos`, pois categoria possui rota própria;
- desabilitar visualmente sem criar link quando não houver página;
- usar `aria-current="page"`;
- não usar scroll infinito;
- após navegação, posicionar foco no título da listagem;
- páginas inválidas retornam 404.

## 16.5. SEO da busca

URLs com `q`:

- `noindex, follow`;
- canonical para `/artigos`;
- não entrar no sitemap.

## 16.6. SEO da paginação

Páginas válidas sem busca:

- indexáveis;
- canonical próprio;
- título com número da página quando `pagina > 1`.

Exemplo:

```text
Artigos — Página 2 | Marcelo Gonçalves
```

---

# 17. CTA editorial compacto

## 17.1. Posição

Após a paginação.

Não criar bloco maior que o CTA das páginas comerciais.

## 17.2. Eyebrow

```text
Aplicação prática
```

## 17.3. H2

```text
Precisa transformar um desafio técnico em uma solução para a operação?
```

## 17.4. Texto

```text
Conheça as frentes de atuação da consultoria ou apresente o contexto que sua empresa precisa resolver.
```

## 17.5. CTA principal

```text
Conhecer os serviços
```

Destino:

```text
/servicos
```

## 17.6. CTA secundário

```text
Apresentar um desafio
```

Destino:

```text
/contato
```

## 17.7. Regras

- não repetir lista de serviços;
- não adicionar prazo;
- não adicionar badge;
- não adicionar formulário;
- não adicionar newsletter;
- mobile com botões empilhados;
- manter tratamento visual discreto e editorial.

---

# 18. Página de categoria

## 18.1. Rota

```text
/categoria/[slug]
```

## 18.2. Slugs válidos

Somente os seis slugs oficiais.

Slug inválido:

- retornar 404;
- não redirecionar para `/artigos`;
- não criar categoria automaticamente.

## 18.3. Hero

### Eyebrow

```text
Categoria
```

### H1

Usar o nome público da categoria.

### Descrição por categoria

#### Cloud e AWS

```text
Arquitetura, serviços gerenciados, segurança, custos e decisões práticas para construir e operar na AWS.
```

#### DevOps e Confiabilidade

```text
Entrega contínua, infraestrutura como código, observabilidade, incidentes e práticas para operar sistemas com previsibilidade.
```

#### Automação e Integração

```text
Processos, APIs, workflows e integrações para reduzir trabalho manual e conectar sistemas.
```

#### Inteligência Artificial

```text
Aplicações responsáveis de IA em documentos, conhecimento, sistemas e processos empresariais.
```

#### Sistemas e Engenharia

```text
Arquitetura de software, APIs, qualidade, modernização e decisões que tornam sistemas mais fáceis de evoluir.
```

#### Bastidores do Projeto

```text
Decisões, erros, arquitetura e evolução da plataforma editorial construída como produto de engenharia.
```

## 18.4. Listagem

- até 9 artigos;
- mesma estrutura do grid;
- sem destaque separado;
- ordenação por data;
- paginação;
- busca não obrigatória dentro da categoria;
- link “Ver todos os artigos” para `/artigos`.

## 18.5. Estado vazio

### H2

```text
Ainda não há artigos publicados nesta categoria.
```

### CTA

```text
Ver todos os artigos
```

Destino:

```text
/artigos
```

## 18.6. SEO

Cada categoria:

- indexável quando possuir ao menos 2 artigos publicados;
- canonical próprio;
- entrar no sitemap quando indexável.

Quando possuir menos de 2:

- `noindex, follow`;
- permanecer acessível;
- não entrar no sitemap.

---

# 19. Página individual do post

## 19.1. Rota

```text
/post/[slug]
```

## 19.2. Ordem final

1. Cabeçalho global;
2. Breadcrumb;
3. Cabeçalho do artigo;
4. Imagem de capa, quando existir;
5. Sumário, quando aplicável;
6. Corpo;
7. Fontes e referências, quando existirem;
8. Compartilhamento discreto;
9. CTA contextual;
10. Bloco do autor;
11. Artigos relacionados;
12. Rodapé global.

## 19.3. Não criar

- comentários;
- reações;
- curtidas nesta tarefa;
- barra fixa de compartilhamento;
- paywall;
- login;
- newsletter;
- popup;
- anúncios;
- índice lateral fixo obrigatório;
- texto gerado automaticamente para preencher seções;
- CTA no meio do artigo.

---

# 20. Breadcrumb do post

Usar:

```text
Início
```

```text
Artigos
```

```text
{Categoria}
```

```text
{Título do artigo}
```

Links:

- Início → `/`;
- Artigos → `/artigos`;
- Categoria → `/categoria/[slug]`;
- título atual sem link, com `aria-current="page"`.

Em mobile:

- permitir quebra;
- não truncar o título de forma inacessível;
- é permitido ocultar visualmente o último item se o H1 estiver imediatamente abaixo, mantendo semântica adequada.

---

# 21. Cabeçalho do artigo

## 21.1. Ordem

1. categoria;
2. H1;
3. subtitle ou excerpt;
4. metadados;
5. autor.

## 21.2. H1

Usar o título do artigo.

Não criar outro H1 no corpo.

## 21.3. Subtitle

Usar `subtitle` quando existir.

Caso não exista, usar `excerpt`.

Não repetir o mesmo texto duas vezes.

## 21.4. Metadados

Exibir:

- data de publicação;
- data de atualização, somente quando relevante;
- tempo de leitura.

Formato:

```text
Publicado em 27 de julho de 2026
```

```text
Atualizado em 3 de agosto de 2026
```

```text
8 min de leitura
```

## 21.5. Atualização relevante

Exibir “Atualizado” somente quando houver:

- correção ou ampliação substantiva;
- mudança técnica relevante;
- atualização de versão;
- nova seção;
- nova evidência.

Não alterar a data pública por:

- build;
- republicação sem mudança;
- correção de espaço;
- alteração de metadata sem mudança do conteúdo principal.

## 21.6. Autor

Exibir:

```text
Por Marcelo Gonçalves
```

Link para:

```text
/sobre
```

Não criar página separada de autor.

---

# 22. Imagem de capa

## 22.1. Condição

Renderizar quando existir capa válida.

## 22.2. Alt

Obrigatório.

O alt deve descrever:

- conceito;
- diagrama;
- cena;
- informação relevante.

Não repetir o título integral.

## 22.3. Legenda

Exibir somente quando existir `coverCaption`.

## 22.4. Regras visuais

- proporção consistente;
- sem deformação;
- `sizes` adequado;
- carregamento otimizado;
- preservar espaço para evitar layout shift;
- não usar imagem em resolução insuficiente;
- não usar screenshot com dados sensíveis;
- não adicionar imagem genérica apenas para preencher.

---

# 23. Sumário do artigo

## 23.1. Condição

Renderizar quando o corpo possuir:

```text
4 ou mais headings H2
```

## 23.2. Título

```text
Neste artigo
```

## 23.3. Conteúdo

Listar apenas H2.

H3 poderá aparecer aninhado somente se o componente atual já suportar com clareza.

## 23.4. Slugs de seção

- derivados do heading;
- normalizados;
- únicos;
- estáveis;
- sem caracteres perigosos;
- preservar IDs editoriais existentes quando houver.

## 23.5. Regras

- não usar posição fixa obrigatória;
- permitir collapse em mobile se o componente já existir;
- acessível por teclado;
- aplicar `scroll-margin-top`;
- não adicionar animação excessiva;
- respeitar movimento reduzido.

---

# 24. Corpo do artigo

## 24.1. Largura

Manter uma largura confortável, equivalente a aproximadamente:

```text
720px a 780px
```

Não aplicar largura fixa absoluta que quebre em mobile.

## 24.2. Headings

Permitidos:

- H2;
- H3;
- H4 somente quando necessário.

Não permitir H1 no corpo.

Não pular níveis.

## 24.3. Parágrafos

- comprimento visual confortável;
- espaçamento consistente;
- sem texto justificado;
- sem linhas excessivamente longas.

## 24.4. Links

Internos:

- mesma aba.

Externos:

- podem abrir em nova aba;
- `rel="noopener noreferrer"`;
- indicador acessível de link externo;
- não adicionar `nofollow` automaticamente a fontes editoriais legítimas.

## 24.5. Listas

Usar HTML semântico.

Não simular bullets com caracteres.

## 24.6. Ênfase

- negrito para ênfase;
- itálico com moderação;
- não usar cor como única ênfase;
- não usar sublinhado em texto não clicável.

---

# 25. Blocos de código

## 25.1. Estrutura

Cada bloco poderá possuir:

- linguagem;
- título opcional;
- botão de copiar;
- código;
- indicação de linhas destacadas, somente se já suportada.

## 25.2. Botão

Texto padrão:

```text
Copiar código
```

Após sucesso:

```text
Código copiado
```

Após dois segundos, retornar ao texto original.

## 25.3. Acessibilidade

- botão acessível por teclado;
- status anunciado;
- contraste adequado;
- código selecionável;
- scroll horizontal dentro do bloco;
- não criar scroll horizontal na página.

## 25.4. Segurança

- escapar código;
- nunca executar;
- não interpolar;
- remover credenciais;
- remover contas, tokens e endpoints privados;
- não publicar comandos destrutivos sem aviso contextual.

## 25.5. Linhas longas

Não quebrar automaticamente comandos quando isso alterar significado.

Usar rolagem horizontal no bloco.

---

# 26. Tabelas

## 26.1. Semântica

Usar:

- `<table>`;
- `<caption>` quando necessário;
- `<thead>`;
- `<tbody>`;
- `<th scope>`.

## 26.2. Mobile

Quando a tabela exceder a largura:

- envolver em container com scroll horizontal;
- indicar visualmente que existe conteúdo lateral;
- manter foco acessível;
- não converter automaticamente em imagem.

## 26.3. Proibido

Não usar tabela para layout.

Não reduzir a fonte de forma ilegível.

---

# 27. Imagens, diagramas e legendas

## 27.1. Cada imagem

Deve possuir:

- arquivo otimizado;
- alt;
- largura e altura;
- legenda quando útil;
- fonte ou autoria quando aplicável.

## 27.2. Screenshots

Antes de publicar:

- remover e-mails;
- remover nomes;
- remover IDs;
- remover contas;
- remover tokens;
- remover IPs;
- remover endpoints privados;
- remover dados de clientes;
- remover notificações pessoais;
- remover metadados desnecessários.

## 27.3. Diagramas

Devem possuir:

- descrição textual;
- legibilidade em mobile;
- contraste;
- independência de cor;
- versão ampliável, quando necessário.

---

# 28. Callouts editoriais

Permitir exatamente quatro tipos:

```text
Informação
```

```text
Decisão
```

```text
Atenção
```

```text
Aprendizado
```

## 28.1. Uso

### Informação

Contexto complementar.

### Decisão

Escolha técnica e motivo.

### Atenção

Risco, cuidado ou limitação.

### Aprendizado

Conclusão obtida após execução, falha ou revisão.

## 28.2. Regras

- não usar emojis como ícone;
- ícone decorativo com `aria-hidden`;
- título visível;
- contraste adequado;
- não criar novos tipos sem especificação;
- não usar callout para propaganda.

---

# 29. Fontes e referências

## 29.1. Condição

Renderizar quando `sourceReferences` possuir itens.

## 29.2. H2

```text
Fontes e referências
```

## 29.3. Estrutura

Cada referência deve conter:

- título;
- entidade ou autor, quando conhecido;
- link;
- data de acesso somente quando editorialmente necessária.

## 29.4. Regras

- não inventar fonte;
- não copiar longos trechos;
- não usar links quebrados;
- links externos com tratamento acessível;
- não incluir tracking desnecessário;
- remover parâmetros de campanha quando seguro.

---

# 30. Compartilhamento

## 30.1. Posição

Após o corpo e referências.

## 30.2. Ações

Exibir somente:

```text
Copiar link
```

```text
Compartilhar no LinkedIn
```

## 30.3. Regras

- não carregar scripts sociais;
- construir URL de compartilhamento somente após clique;
- LinkedIn abre em nova aba;
- `rel="noopener noreferrer"`;
- copiar link usa canonical;
- anunciar sucesso;
- não adicionar Facebook, X, WhatsApp ou Instagram nesta tarefa;
- não adicionar contagem de compartilhamento.

---

# 31. CTA contextual do artigo

## 31.1. Posição

Após compartilhamento.

## 31.2. Eyebrow

```text
Aplicação prática
```

## 31.3. H2

```text
Precisa aplicar esse tipo de engenharia na sua operação?
```

## 31.4. Texto

```text
Conheça as frentes de atuação da consultoria ou apresente o contexto que sua empresa precisa resolver.
```

## 31.5. CTA principal

```text
Conhecer os serviços
```

Destino:

```text
/servicos
```

## 31.6. CTA secundário

Texto:

```text
Apresentar um desafio
```

Destino definido pela categoria:

| Categoria | Destino |
|---|---|
| Cloud e AWS | `/contato?area=cloud-devops-confiabilidade` |
| DevOps e Confiabilidade | `/contato?area=cloud-devops-confiabilidade` |
| Automação e Integração | `/contato?area=automacao-integracao` |
| Inteligência Artificial | `/contato?area=inteligencia-artificial` |
| Sistemas e Engenharia | `/contato?area=sistemas-plataformas` |
| Bastidores do Projeto | `/contato` |

## 31.7. Regras

- não inserir no meio do artigo;
- não adicionar lista de serviços;
- não prometer diagnóstico;
- não mostrar quando o artigo estiver em preview interno;
- mobile com botões empilhados;
- manter visual mais discreto que CTAs comerciais.

---

# 32. Bloco do autor

## 32.1. Estrutura

Exibir:

- foto atual de Marcelo;
- nome;
- cargo;
- texto curto;
- link.

## 32.2. Nome

```text
Marcelo Gonçalves
```

## 32.3. Cargo

```text
Fundador e líder técnico
```

## 32.4. Texto

```text
Engenheiro de Cloud e DevOps com mais de dez anos de experiência em tecnologia, atuando com AWS, automação, sistemas e confiabilidade.
```

Usar somente após a validação de trajetória definida no Ajuste 13.

## 32.5. CTA

```text
Conhecer a trajetória
```

Destino:

```text
/sobre
```

## 32.6. Regras

- não criar página de autor;
- não listar todas as certificações;
- não listar redes sociais;
- não transformar em currículo;
- preservar imagem atual;
- alt conforme Ajuste 8.

---

# 33. Artigos relacionados

## 33.1. Título

```text
Continue explorando
```

## 33.2. Quantidade

Exibir até:

```text
3 artigos
```

## 33.3. Algoritmo

Pontuação:

1. mesma categoria: +5;
2. tag compartilhada: +1 por tag;
3. relacionado ao mesmo serviço: +2;
4. publicado nos últimos 12 meses: +1.

Ordenar por:

1. pontuação;
2. `publishedAt` decrescente;
3. `id`.

## 33.4. Exclusões

Excluir:

- artigo atual;
- teste;
- noindex;
- arquivado;
- rascunho;
- conteúdo futuro;
- versão em outro idioma;
- artigo sem capa válida quando o componente exigir capa.

## 33.5. Fallback

Se houver menos de três:

- completar com artigos recentes;
- não repetir;
- não criar placeholders.

Se não houver nenhum:

- ocultar o bloco.

---

# 34. SEO do post

## 34.1. Title

Prioridade:

1. `seoTitle`;
2. `{title} | Marcelo Gonçalves`.

## 34.2. Description

Prioridade:

1. `seoDescription`;
2. `excerpt`.

## 34.3. Canonical

Usar canonical absoluto do post.

Não usar URL com parâmetros.

## 34.4. Open Graph

Incluir:

- title;
- description;
- canonical;
- type `article`;
- image;
- published time;
- modified time;
- author;
- section;
- tags relevantes.

## 34.5. Twitter/X metadata

Manter somente se o projeto já utilizar.

Não adicionar conta inexistente.

## 34.6. JSON-LD

Usar:

```text
TechArticle
```

ou:

```text
Article
```

Preferência:

```text
TechArticle
```

quando o conteúdo for técnico.

Campos:

- headline;
- description;
- image;
- author;
- datePublished;
- dateModified;
- mainEntityOfPage;
- publisher;
- articleSection;
- keywords.

Não incluir:

- reviews;
- rating;
- offers;
- clientes;
- métricas não verificadas.

## 34.7. Breadcrumb JSON-LD

Incluir estrutura coerente com o breadcrumb visual.

---

# 35. Slugs e redirects

## 35.1. Slug

- minúsculo;
- hífen;
- sem acentos;
- sem data;
- descritivo;
- máximo recomendado de 80 caracteres;
- não utilizar ID técnico.

## 35.2. Mudança de slug

Quando alterar artigo publicado:

- criar redirect permanente;
- atualizar canonical;
- atualizar links;
- preservar histórico;
- não reutilizar o slug antigo em outro artigo.

## 35.3. Registro

Manter mapa de redirects.

Não depender de cadeia com múltiplos redirects.

---

# 36. Versão em inglês

## 36.1. Prioridade

A versão PT-BR continua sendo a principal.

## 36.2. Gatilho

A tradução não deverá ocorrer automaticamente após publicação.

Fluxo:

1. artigo publicado em PT-BR;
2. analytics ou decisão editorial indica prioridade;
3. tradução é acionada manualmente;
4. IA gera rascunho;
5. revisão humana;
6. adaptação cultural e técnica;
7. aprovação;
8. publicação em inglês.

## 36.3. Estados da tradução

Usar:

```text
not_requested
```

```text
draft_generated
```

```text
human_review
```

```text
approved
```

```text
published
```

## 36.4. SEO multilíngue

Somente quando ambas as versões estiverem públicas:

- `hreflang="pt-BR"`;
- `hreflang="en"`;
- `x-default` apontando para PT-BR ou página de idioma, conforme arquitetura final;
- canonical próprio para cada idioma;
- `translationGroupId` comum.

## 36.5. Proibido

Não:

- publicar tradução sem revisão;
- usar tradução automática diretamente em produção;
- misturar idiomas na mesma página;
- redirecionar por IP;
- substituir o post em português;
- marcar tradução como duplicada;
- copiar slug português quando ele não fizer sentido em inglês.

---

# 37. Uso de IA no fluxo editorial

## 37.1. Princípio

A IA poderá assistir o processo, mas não publicar sozinha.

## 37.2. Usos permitidos

- sugestão de estrutura;
- revisão;
- resumo;
- título alternativo;
- metadata;
- tradução;
- rascunho de publicação social;
- sugestão de imagem;
- identificação de links quebrados;
- análise de consistência;
- geração de excerpt.

## 37.3. Usos proibidos sem revisão

- publicação;
- alteração de post publicado;
- tradução pública;
- atualização automática de fatos;
- inclusão de fonte;
- citação;
- resposta a comentário;
- postagem em rede social;
- envio de newsletter;
- criação de afirmação de experiência;
- criação de métricas.

## 37.4. Modelo de auditoria

```ts
interface ArticleAIWorkflow {
  assisted: boolean;
  operations: Array<
    | "outline"
    | "rewrite"
    | "summary"
    | "seo"
    | "translation"
    | "social"
    | "image_idea"
    | "quality_review"
  >;
  providerInternal?: string;
  generatedAt?: string;
  humanReviewedBy?: string;
  humanReviewedAt?: string;
}
```

Não exibir fornecedor publicamente no post.

## 37.5. Autor

Marcelo poderá permanecer como autor quando:

- definir o conteúdo;
- revisar;
- corrigir;
- aprovar;
- assumir responsabilidade editorial.

Não adicionar rótulo:

```text
Criado com IA
```

na interface pública.

A página O Projeto explicará o uso de IA de forma transparente.

---

# 38. Quality gates de publicação

Um artigo não poderá ser publicado sem:

- título;
- excerpt;
- categoria;
- autor;
- slug;
- body;
- data;
- metadata;
- canonical;
- revisão de headings;
- verificação de links;
- revisão ortográfica;
- revisão técnica;
- capa ou fallback;
- alt da capa;
- ausência de segredos;
- ausência de dados pessoais;
- ausência de marcador de teste;
- ausência de placeholders;
- status correto;
- revisão humana quando houver IA.

## 38.1. Bloqueios

O build ou processo de publicação deverá falhar se houver em conteúdo público:

```text
[TESTE]
```

```text
TODO
```

```text
PLACEHOLDER
```

```text
LOREM IPSUM
```

```text
INSERIR IMAGEM
```

```text
CORRIGIR DEPOIS
```

## 38.2. Segredos

Criar validações para padrões de:

- access keys;
- tokens;
- senhas;
- private keys;
- credenciais;
- ARNs sensíveis;
- IDs de contas quando não autorizados;
- URLs privadas.

Não depender somente de regex.

Manter revisão humana.

---

# 39. Página O Projeto

## 39.1. Papel

A página deverá mostrar que a própria plataforma é:

- um produto de engenharia;
- uma prova de execução;
- um laboratório de arquitetura;
- uma plataforma editorial;
- um projeto em evolução.

Não deverá parecer:

- documentação interna completa;
- página de venda do CMS;
- portfólio inflado;
- promessa de funcionalidades futuras;
- lista de ferramentas;
- diário pessoal sem estrutura.

## 39.2. Ordem final

1. Cabeçalho global;
2. Hero;
3. Por que construir;
4. Estado atual;
5. Arquitetura;
6. Princípios de engenharia;
7. Fluxo editorial e IA;
8. Evolução do projeto;
9. Artigos de bastidores;
10. CTA final;
11. Rodapé global.

---

# 40. Hero de O Projeto

## 40.1. Eyebrow

```text
O Projeto
```

## 40.2. H1

```text
Uma plataforma editorial construída como produto de engenharia.
```

## 40.3. Subtítulo

```text
Este site também funciona como um laboratório prático para arquitetura serverless, infraestrutura como código, automação editorial e uso responsável de inteligência artificial.
```

## 40.4. CTA principal

```text
Explorar a arquitetura
```

Destino:

```text
#arquitetura
```

## 40.5. CTA secundário

```text
Ler os bastidores
```

Destino:

```text
/categoria/bastidores-projeto
```

## 40.6. Microcopy

```text
Projeto próprio · Evolução contínua · Estados publicados com transparência
```

## 40.7. Regras visuais

- preservar identidade atual;
- não adicionar mockup genérico;
- é permitido preservar visual técnico existente;
- não adicionar logos;
- não inserir diagrama completo no hero;
- mobile com CTAs empilhados;
- microcopy discreta.

---

# 41. Seção — Por que construir

## 41.1. Eyebrow

```text
Por que construir
```

## 41.2. H2

```text
Mais do que publicar artigos: controlar toda a cadeia editorial.
```

## 41.3. Texto

Usar exatamente estes três parágrafos:

```text
A plataforma nasceu da necessidade de publicar conteúdo técnico com identidade própria, bom desempenho, controle sobre os dados e liberdade para evoluir o processo editorial.
```

```text
Em vez de tratar o site apenas como uma vitrine, o projeto reúne conteúdo, administração, automações e infraestrutura em uma base que pode ser observada, testada e aprimorada continuamente.
```

```text
O objetivo não é reconstruir todas as ferramentas existentes, mas criar uma arquitetura adequada à estratégia editorial, à geração de autoridade e às futuras integrações da consultoria.
```

## 41.4. Callout

### Rótulo

```text
Princípio
```

### Texto

```text
A plataforma deve evoluir sem comprometer o conteúdo já publicado.
```

---

# 42. Seção — Estado atual

## 42.1. Eyebrow

```text
Estado atual
```

## 42.2. H2

```text
O que já está entregue e o que ainda está em evolução.
```

## 42.3. Introdução

```text
Cada capacidade possui um estado explícito. Funcionalidades planejadas não são apresentadas como se já estivessem disponíveis.
```

## 42.4. Estados públicos

Usar exatamente:

```text
Entregue
```

```text
Em desenvolvimento
```

```text
Planejado
```

```text
Adiado
```

```text
Removido
```

## 42.5. Valores internos

```text
delivered
```

```text
in_development
```

```text
planned
```

```text
deferred
```

```text
removed
```

## 42.6. Fonte de dados

Criar:

```ts
interface ProjectCapability {
  id: string;
  title: string;
  description: string;
  status:
    | "delivered"
    | "in_development"
    | "planned"
    | "deferred"
    | "removed";
  category:
    | "public"
    | "editorial"
    | "automation"
    | "internationalization"
    | "distribution"
    | "business";
  verifiedAt?: string;
  publicLink?: string;
}
```

## 42.7. Regra de status

A IA engenheira não poderá alterar uma capacidade para `delivered` por inferência.

`delivered` exige:

- implementação presente;
- fluxo principal funcional;
- validação;
- `verifiedAt`;
- aprovação do responsável pelo produto.

## 42.8. Inventário inicial

Cadastrar exatamente estes itens com os estados abaixo.

### Entregue

#### Site público em português

```text
Experiência editorial pública com Home, artigos, páginas institucionais e páginas de serviço.
```

#### Publicação de artigos

```text
Listagem, categorias e páginas individuais para conteúdo técnico.
```

#### Distribuição por CloudFront

```text
Entrega do conteúdo e dos assets por uma camada de distribuição na AWS.
```

#### Infraestrutura como código

```text
Recursos de infraestrutura definidos e versionados com Terraform.
```

#### Integração e entrega contínuas

```text
Pipelines no GitHub Actions para validação e publicação das mudanças.
```

### Em desenvolvimento

#### Administração editorial separada

```text
Interface administrativa independente da experiência pública.
```

#### Editor de conteúdo estruturado

```text
Evolução do editor para TipTap com blocos, callouts, código, tabelas e conteúdo versionável.
```

#### Métricas editoriais

```text
Visualizações e sinais de interesse para apoiar decisões de conteúdo.
```

### Planejado

#### Versão em inglês

```text
Publicação multilíngue com rotas, metadata, canonical e hreflang próprios.
```

#### Tradução assistida por IA

```text
Geração de rascunho em inglês após decisão editorial, sempre com revisão humana.
```

#### Publicação social com aprovação

```text
Geração de rascunhos e mídias para redes sociais com etapa explícita de aprovação.
```

#### Processamento automático de imagens

```text
Geração de formatos otimizados e derivados adequados à web e às redes sociais.
```

#### Newsletter

```text
Canal editorial opcional, condicionado a consentimento e infraestrutura específica.
```

#### Licenciamento da plataforma

```text
Possibilidade futura de disponibilizar a base editorial como produto self-hosted ou serviço gerenciado.
```

## 42.9. Alteração dos estados

Caso algum estado acima não corresponda ao código real no momento da implementação:

- não fazer alteração silenciosa;
- registrar a divergência;
- manter o estado mais conservador;
- solicitar decisão do responsável pelo produto fora da interface pública;
- não interromper as demais mudanças.

## 42.10. Exibição

- agrupar por estado;
- não agrupar por categoria;
- exibir título e descrição;
- link somente quando existir destino público;
- não exibir data de previsão;
- não exibir percentual de conclusão;
- não ordenar por promessa comercial.

---

# 43. Seção — Arquitetura

## 43.1. ID

```text
arquitetura
```

## 43.2. Eyebrow

```text
Arquitetura
```

## 43.3. H2

```text
Uma base serverless, versionada e orientada à automação.
```

## 43.4. Introdução

```text
A plataforma separa a experiência pública, a administração editorial, os serviços de conteúdo e a infraestrutura. Essa separação permite evoluir cada parte com responsabilidades mais claras.
```

## 43.5. Camadas

Exibir exatamente cinco blocos.

### Bloco 1 — Experiência pública

Texto:

```text
Aplicação web responsável pela navegação, descoberta e leitura do conteúdo, com foco em desempenho, SEO e acessibilidade.
```

Tags:

```text
Next.js
```

```text
CloudFront
```

### Bloco 2 — Administração editorial

Texto:

```text
Interface separada para criação, revisão, organização e publicação do conteúdo.
```

Tags:

```text
Admin separado
```

```text
Conteúdo estruturado
```

### Bloco 3 — Serviços de conteúdo

Texto:

```text
APIs e funções responsáveis por validar, armazenar e disponibilizar artigos, categorias, imagens e metadados.
```

Tags:

```text
API Gateway
```

```text
Lambda
```

### Bloco 4 — Dados e mídia

Texto:

```text
Persistência de metadados e conteúdo, com armazenamento de assets e derivados para distribuição.
```

Tags:

```text
DynamoDB
```

```text
S3
```

### Bloco 5 — Infraestrutura e entrega

Texto:

```text
Recursos versionados e pipelines responsáveis por validar e publicar mudanças de forma reproduzível.
```

Tags:

```text
Terraform
```

```text
GitHub Actions
```

## 43.6. Diagrama

É permitido criar diagrama visual usando:

- HTML;
- CSS;
- SVG acessível produzido no projeto.

Não utilizar biblioteca de graph.

O diagrama deve mostrar:

```text
Leitor → CloudFront → Aplicação pública → APIs → Serviços → Dados e mídia
```

e:

```text
Admin → APIs → Serviços → Dados e mídia
```

Infraestrutura e CI/CD devem aparecer como camada transversal.

## 43.7. Restrições

Não exibir:

- IDs;
- ARNs;
- contas;
- regiões privadas;
- endpoints;
- nomes de tabelas;
- nomes de buckets;
- credenciais;
- nomes de ambientes internos;
- custos;
- diagramas não confirmados.

---

# 44. Seção — Princípios de engenharia

## 44.1. Eyebrow

```text
Princípios de engenharia
```

## 44.2. H2

```text
A plataforma é construída para continuar compreensível enquanto evolui.
```

## 44.3. Quantidade

Usar exatamente seis princípios.

## 44.4. Conteúdo como dado estruturado

```text
Artigos, metadados e blocos editoriais devem permanecer versionáveis, validáveis e independentes da apresentação final.
```

## 44.5. Automação com controle

```text
Publicação, tradução e distribuição podem ser automatizadas, mas ações de maior impacto mantêm validação e aprovação explícitas.
```

## 44.6. Infraestrutura reproduzível

```text
Mudanças na infraestrutura devem ser declaradas, revisadas e aplicadas por pipelines, evitando configuração manual como fonte de verdade.
```

## 44.7. Evolução incremental

```text
Novas capacidades são incorporadas em ciclos completos e testáveis, sem transformar a base em uma sequência de exceções.
```

## 44.8. Falhas observáveis

```text
Erros de publicação, integração ou processamento precisam gerar sinais claros para diagnóstico e correção.
```

## 44.9. Custo proporcional ao uso

```text
A arquitetura prioriza serviços gerenciados e custos compatíveis com o volume real da plataforma.
```

---

# 45. Seção — Fluxo editorial e IA

## 45.1. Eyebrow

```text
Fluxo editorial
```

## 45.2. H2

```text
A IA participa do processo, mas não publica sozinha.
```

## 45.3. Introdução

```text
A inteligência artificial pode acelerar tarefas editoriais, desde que o resultado permaneça como rascunho até ser revisado e aprovado.
```

## 45.4. Etapas

Usar exatamente cinco.

### Conteúdo original

```text
O artigo nasce de uma experiência, análise, pesquisa ou decisão editorial definida por Marcelo.
```

### Assistência

```text
A IA pode sugerir estrutura, resumo, revisão, metadata, tradução ou adaptação para redes sociais.
```

### Revisão humana

```text
Fatos, exemplos, código, fontes, tom e conclusões são verificados antes da aprovação.
```

### Publicação controlada

```text
O conteúdo só se torna público após os quality gates e a mudança explícita do estado editorial.
```

### Medição e evolução

```text
Sinais de leitura e interesse podem orientar atualizações, tradução ou novos conteúdos.
```

## 45.5. Callout

### Rótulo

```text
Responsabilidade editorial
```

### Texto

```text
O uso de IA não transfere a responsabilidade sobre o conteúdo, as fontes ou as decisões de publicação.
```

## 45.6. Não exibir

- fornecedor do modelo;
- prompt;
- custo por artigo;
- texto “Criado com IA”;
- percentual de conteúdo gerado;
- selo de IA;
- comparação com redatores humanos.

---

# 46. Seção — Evolução do projeto

## 46.1. Eyebrow

```text
Evolução
```

## 46.2. H2

```text
O roadmap é orientado por valor editorial, não por quantidade de funcionalidades.
```

## 46.3. Texto

```text
Novas capacidades entram no projeto quando melhoram a produção, a distribuição, a qualidade ou a sustentabilidade da plataforma. Ideias podem ser adiadas ou removidas quando não justificam a complexidade.
```

## 46.4. Estrutura

Exibir três grupos:

```text
Agora
```

```text
Depois
```

```text
Exploração
```

## 46.5. Mapeamento

### Agora

Exibir capacidades com status:

```text
in_development
```

### Depois

Exibir capacidades com status:

```text
planned
```

que possuam prioridade aprovada.

### Exploração

Exibir capacidades com status:

```text
deferred
```

## 46.6. Removidos

Não exibir capacidades `removed` no roadmap principal.

Não criar uma página de decisões removidas nesta tarefa.

## 46.7. Regras

- não exibir datas;
- não prometer trimestre;
- não exibir percentual;
- não criar timeline infinita;
- não usar “em breve”;
- não transformar roadmap em compromisso comercial.

---

# 47. Seção — Artigos de bastidores

## 47.1. Eyebrow

```text
Bastidores
```

## 47.2. H2

```text
Decisões, erros e aprendizados documentados durante a construção.
```

## 47.3. Quantidade

Exibir até:

```text
6 artigos
```

## 47.4. Consulta

Usar categoria:

```text
bastidores-projeto
```

Aplicar todos os filtros públicos.

Ordenar por data.

## 47.5. Estado vazio

### Texto

```text
Os bastidores serão publicados conforme as decisões e os aprendizados estiverem documentados.
```

### CTA

```text
Explorar todos os artigos
```

Destino:

```text
/artigos
```

## 47.6. CTA com artigos

```text
Ver todos os bastidores
```

Destino:

```text
/categoria/bastidores-projeto
```

---

# 48. CTA final de O Projeto

## 48.1. Eyebrow

```text
Da plataforma à operação
```

## 48.2. H2

```text
Precisa aplicar esse nível de engenharia a um problema da sua empresa?
```

## 48.3. Texto

```text
Conheça as frentes de atuação da consultoria ou apresente o contexto que precisa evoluir.
```

## 48.4. CTA principal

```text
Conhecer os serviços
```

Destino:

```text
/servicos
```

## 48.5. CTA secundário

```text
Apresentar um desafio
```

Destino:

```text
/contato
```

## 48.6. Regras

- sem lista de serviços;
- sem badge;
- sem prazo repetido;
- sem formulário;
- mobile com botões empilhados.

---

# 49. Metadados da página Artigos

## 49.1. Title

```text
Artigos sobre Cloud, Automação, IA e Engenharia | Marcelo Gonçalves
```

## 49.2. Description

```text
Artigos técnicos e aprendizados de produção sobre AWS, DevOps, confiabilidade, automação, inteligência artificial e engenharia de software.
```

## 49.3. Canonical

```text
/artigos
```

## 49.4. Open Graph

Usar o mesmo title e description.

Preservar imagem editorial oficial.

Não gerar imagem nesta tarefa.

---

# 50. Metadados de O Projeto

## 50.1. Title

```text
O Projeto | Plataforma Editorial e Engenharia AWS
```

## 50.2. Description

```text
Conheça a arquitetura, os princípios, o fluxo editorial e a evolução da plataforma construída por Marcelo Gonçalves como produto de engenharia.
```

## 50.3. Canonical

```text
/o-projeto
```

## 50.4. Open Graph

Usar o mesmo title e description.

Preservar imagem atual, se adequada.

---

# 51. Sitemap

Incluir:

- `/artigos`;
- categorias indexáveis;
- posts publicados e indexáveis;
- `/o-projeto`.

Excluir:

- busca;
- query strings;
- testes;
- rascunhos;
- agendados futuros;
- noindex;
- arquivados;
- categorias com menos de dois artigos;
- previews;
- admin.

`lastmod`:

- usar atualização editorial substantiva;
- não usar data de build.

---

# 52. RSS ou feed

## 52.1. Condição

Se já existir feed:

- preservar;
- atualizar rota base;
- filtrar conteúdo;
- utilizar canonical.

Se não existir:

- não criar nesta tarefa.

## 52.2. Conteúdo

Nunca incluir:

- testes;
- noindex;
- rascunhos;
- artigos futuros;
- conteúdo em revisão.

---

# 53. Performance

## 53.1. Listagens

- otimizar imagens;
- definir dimensões;
- não carregar corpo completo;
- não carregar todas as páginas no cliente;
- paginar no backend ou build;
- não enviar dados administrativos;
- não carregar tags completas se não forem exibidas;
- não carregar conteúdo relacionado antes de necessário.

## 53.2. Post

- não carregar scripts sociais;
- lazy-load de imagens abaixo da dobra;
- capa prioritária somente quando necessária;
- evitar hidratação para conteúdo estático;
- não carregar editor no leitor;
- não carregar TipTap editável na página pública;
- renderizar conteúdo estruturado com renderer próprio ou modo somente leitura otimizado.

## 53.3. O Projeto

- diagrama leve;
- sem bibliotecas de graph;
- sem animações pesadas;
- sem vídeo automático;
- sem canvas complexo.

---

# 54. Acessibilidade

## 54.1. Headings

- um H1 por página;
- ordem sem saltos;
- cards com headings coerentes;
- headings não usados apenas por estilo.

## 54.2. Teclado

Validar:

- busca;
- limpar busca;
- categorias;
- paginação;
- copiar código;
- sumário;
- compartilhar;
- CTAs;
- links de arquitetura.

## 54.3. Foco

- visível;
- ordem coerente;
- reposicionado após paginação;
- sem armadilhas;
- não mover foco sem ação do usuário;
- após copiar código, anunciar o sucesso sem retirar o foco do botão.

## 54.4. Contraste

Manter WCAG AA para:

- textos;
- metadados;
- links;
- categorias;
- tags;
- código;
- callouts;
- botões;
- foco;
- paginação;
- estados ativos;
- captions.

## 54.5. Movimento

Respeitar:

```css
prefers-reduced-motion: reduce
```

Quando ativo:

- remover animações de entrada;
- remover contagem animada;
- remover scroll suave forçado;
- manter o conteúdo disponível imediatamente;
- preservar mudanças de estado sem transições longas.

## 54.6. Links externos

Indicar de forma acessível quando abrem nova aba.

Não depender apenas de ícone.

## 54.7. Imagens

- alt obrigatório quando informativas;
- alt vazio quando decorativas;
- não duplicar a legenda;
- não colocar texto essencial apenas na imagem.

## 54.8. Código e tabelas

- código selecionável;
- botão de copiar acessível;
- tabelas semânticas;
- scroll interno sem bloquear teclado;
- não esconder informação em hover.

---

# 55. Analytics editorial

Aplicar somente se já existir helper de analytics.

Não instalar novo provedor.

## 55.1. Eventos permitidos

```text
articles_page_view
```

```text
article_featured_click
```

```text
article_search
```

```text
article_search_clear
```

```text
article_category_click
```

```text
article_card_click
```

```text
article_view
```

```text
article_read_progress
```

```text
article_code_copy
```

```text
article_share
```

```text
article_cta_click
```

```text
article_related_click
```

```text
project_page_view
```

```text
project_architecture_click
```

```text
project_article_click
```

```text
project_cta_click
```

## 55.2. Progresso de leitura

Registrar no máximo:

```text
25
```

```text
50
```

```text
75
```

```text
100
```

Cada percentual deverá ser enviado uma única vez por sessão de página.

Não considerar apenas scroll vertical quando o artigo possuir conteúdo curto.

O cálculo deverá considerar a área do artigo, não o rodapé completo.

## 55.3. Propriedades permitidas

- `articleId`;
- `slug`;
- `categoryId`;
- `tagCount`;
- `readingTime`;
- `position`;
- `page`;
- `queryLength`;
- `resultCount`;
- `progress`;
- `shareChannel`;
- `ctaType`;
- `relatedArticleId`;
- `projectCapabilityStatus`.

## 55.4. Dados proibidos

Não enviar:

- query completa de busca;
- título completo quando não necessário;
- corpo;
- trechos;
- código;
- nome;
- e-mail;
- IP;
- texto copiado;
- conteúdo de referência;
- dados administrativos;
- prompts;
- informação de rascunho;
- URL de preview.

É permitido enviar uma versão normalizada da query apenas se houver aprovação específica de privacidade. Não implementar nesta tarefa.

## 55.5. Consentimento

Respeitar o mecanismo de consentimento já adotado.

A navegação, busca e leitura devem funcionar sem analytics.

---

# 56. Implementação da busca

## 56.1. Primeira versão

Implementar busca utilizando a fonte de dados atual.

Não instalar serviço externo de busca nesta tarefa.

## 56.2. Índice

Criar representação indexável contendo somente:

- `id`;
- `slug`;
- `title`;
- `excerpt`;
- `category`;
- `tags`;
- `publishedAt`;
- `locale`.

Não incluir body completo na resposta inicial da página.

## 56.3. Normalização

Para comparação:

- lowercase;
- normalização Unicode;
- remoção de acentos;
- espaços consecutivos reduzidos;
- trim.

## 56.4. Ordenação de resultado

Pontuação recomendada:

1. título contém a frase completa: +10;
2. título contém todos os termos: +6;
3. tag corresponde: +5;
4. categoria corresponde: +4;
5. excerpt contém a frase: +3;
6. excerpt contém termos: +1 por termo.

Desempate:

1. pontuação;
2. `publishedAt` decrescente;
3. `id`.

## 56.5. Segurança

- não interpretar operadores;
- não executar regex criada diretamente pelo usuário;
- limitar query;
- escapar saída;
- não refletir HTML;
- não expor rascunhos.

---

# 57. CMS e editor estruturado

## 57.1. Editor

A evolução planejada para TipTap deverá preservar um modelo de conteúdo estruturado.

Não armazenar apenas HTML sem validação.

## 57.2. Blocos permitidos

O renderer público deverá reconhecer:

- paragraph;
- heading;
- bullet list;
- ordered list;
- blockquote;
- code block;
- table;
- image;
- callout;
- horizontal rule;
- link.

## 57.3. Blocos proibidos na primeira versão

Não permitir:

- iframe arbitrário;
- script;
- style;
- form;
- input;
- embed genérico;
- HTML livre;
- vídeo externo sem política específica;
- widget de terceiros;
- conteúdo executável.

## 57.4. Migração do conteúdo existente

Antes de substituir Quill por TipTap:

- exportar conteúdo;
- versionar backup;
- mapear formatos;
- testar conversão;
- identificar blocos não suportados;
- preservar slugs;
- preservar datas;
- preservar headings;
- preservar imagens;
- validar visualmente cada artigo publicado;
- permitir rollback.

## 57.5. Preview no editor

O preview deverá utilizar o mesmo renderer público.

Não manter dois renderers com comportamentos diferentes.

## 57.6. Validação

O backend deverá validar:

- tipos de nó;
- níveis de heading;
- URLs;
- protocolos;
- tamanho;
- profundidade;
- tabelas;
- imagens;
- callouts;
- código.

---

# 58. Segurança do conteúdo

## 58.1. Sanitização

Mesmo com conteúdo estruturado:

- validar no servidor;
- escapar na renderização;
- permitir somente atributos previstos;
- bloquear eventos HTML;
- bloquear `javascript:`;
- bloquear `data:` em links;
- permitir `https:`, `http:` e links internos;
- `mailto:` somente quando editorialmente necessário;
- não permitir URLs de arquivo local.

## 58.2. Content Security Policy

Preservar ou reforçar CSP.

Não adicionar domínios de scripts sociais.

Imagens externas só poderão ser carregadas de origens autorizadas.

## 58.3. Admin

A administração editorial deverá permanecer separada da experiência pública.

Não expor:

- endpoints administrativos;
- dados de usuários;
- rascunhos;
- tokens;
- configurações;
- prompts;
- logs;
- chaves;
- histórico interno.

## 58.4. Assets

Validar:

- MIME type;
- extensão;
- tamanho;
- dimensões;
- nome;
- metadados;
- conteúdo malicioso.

Não confiar apenas na extensão.

---

# 59. Preview de rascunho

## 59.1. Regra

Preview não pode tornar o rascunho publicamente descobrível.

## 59.2. Requisitos

- autenticação;
- token curto ou sessão;
- expiração;
- não entrar em sitemap;
- `noindex, nofollow`;
- não ser cacheado publicamente;
- não aparecer em analytics público;
- não aparecer em relacionados;
- não compartilhar canonical público até publicação.

## 59.3. Banner

Exibir:

```text
Visualização de rascunho
```

Texto:

```text
Este conteúdo ainda não está publicado.
```

O banner deve permanecer visível.

## 59.4. Proibido

Não utilizar query string simples como:

```text
?preview=true
```

sem autenticação.

---

# 60. Cache e publicação

## 60.1. Princípio

A mudança de status editorial deve controlar a disponibilidade pública.

## 60.2. Publicação

Ao publicar:

- validar quality gates;
- persistir estado;
- atualizar índices;
- atualizar sitemap;
- invalidar ou revalidar a página do post;
- revalidar `/artigos`;
- revalidar categoria;
- revalidar Home quando o artigo puder aparecer;
- revalidar relacionados quando necessário.

## 60.3. Arquivamento

Ao arquivar:

- remover das consultas;
- revalidar superfícies;
- atualizar sitemap;
- manter política de 404, 410 ou redirect;
- invalidar cache da URL.

## 60.4. Falha parcial

Se a persistência ocorrer, mas a invalidação falhar:

- registrar erro;
- gerar alerta;
- permitir repetição idempotente;
- não duplicar publicação;
- não alterar data automaticamente.

## 60.5. Agendamento

O processo agendado deve:

- verificar `scheduled`;
- verificar data;
- executar no máximo uma vez;
- ser idempotente;
- registrar resultado;
- respeitar timezone editorial;
- utilizar datas em UTC na persistência;
- exibir datas em `America/Sao_Paulo`.

---

# 61. Ciclo de vida editorial

## 61.1. Criação

Estado inicial:

```text
draft
```

## 61.2. Revisão

Mudança explícita para:

```text
review
```

## 61.3. Correções

Retornar para:

```text
draft
```

quando houver alterações relevantes após revisão.

## 61.4. Aprovação imediata

Mudança para:

```text
published
```

com `publishedAt`.

## 61.5. Agendamento

Mudança para:

```text
scheduled
```

com data futura.

## 61.6. Atualização

Conteúdo publicado pode voltar a:

```text
review
```

sem substituir a versão pública até aprovação.

Preferir versionamento ou draft editorial separado.

Não publicar alterações parciais automaticamente.

## 61.7. Arquivamento

Mudança explícita para:

```text
archived
```

com registro de motivo.

---

# 62. Implementação técnica

## 62.1. Reutilizar

- componentes atuais;
- cards editoriais;
- imagens;
- tags;
- categorias;
- renderer;
- header;
- footer;
- containers;
- tokens;
- mecanismos de metadata;
- consultas existentes;
- infraestrutura de publicação.

## 62.2. Não instalar

- mecanismo externo de busca;
- comentários;
- scripts sociais;
- carrossel;
- infinite scroll;
- biblioteca de diagramas;
- editor no frontend público;
- newsletter;
- player de vídeo;
- pacote de anúncios;
- biblioteca de reações.

## 62.3. Dados

- centralizar categorias;
- centralizar filtros públicos;
- centralizar cálculo de tempo de leitura;
- centralizar seleção de relacionados;
- não duplicar lógica na Home;
- não duplicar query de publicação;
- usar IDs estáveis;
- tipagem estrita.

## 62.4. Remoção real

Artigos de teste e elementos antigos devem ser removidos das consultas.

Não ocultar com CSS.

---

# 63. Ordem de implementação

Executar:

1. Inventariar rotas editoriais atuais.
2. Inventariar categorias atuais.
3. Inventariar posts de teste.
4. Criar taxonomia oficial.
5. Atualizar modelo de dados.
6. Centralizar filtro público.
7. Corrigir links `/blog`.
8. Atualizar página `/artigos`.
9. Implementar destaque.
10. Implementar busca.
11. Implementar paginação.
12. Atualizar páginas de categoria.
13. Atualizar página de post.
14. Implementar sumário.
15. Implementar código, tabelas e callouts.
16. Atualizar compartilhamento.
17. Implementar CTA contextual.
18. Atualizar autor.
19. Implementar relacionados.
20. Atualizar SEO e JSON-LD.
21. Atualizar sitemap.
22. Implementar estados editoriais.
23. Implementar quality gates.
24. Implementar preview seguro.
25. Implementar cache e revalidação.
26. Atualizar O Projeto.
27. Criar inventário de capacidades.
28. Validar estados reais.
29. Atualizar analytics sem PII.
30. Validar responsividade.
31. Validar acessibilidade.
32. Executar lint.
33. Executar testes.
34. Executar build.
35. Revisar visualmente artigos publicados.
36. Validar redirects.
37. Validar produção sem conteúdo de teste.

---

# 64. Testes obrigatórios

## 64.1. Rotas

Validar:

- `/artigos`;
- `/blog` → redirect;
- `/post/[slug]`;
- `/categoria/[slug]`;
- `/o-projeto`;
- categoria inválida;
- post inválido;
- post arquivado;
- query de busca;
- paginação.

## 64.2. Estados

Testar:

- draft;
- review;
- scheduled futuro;
- scheduled vencido;
- published;
- archived;
- test;
- noindex;
- featured;
- múltiplos featured.

## 64.3. Filtros

Garantir ausência em:

- Home;
- artigos;
- categoria;
- busca;
- relacionados;
- sitemap;
- feed.

para conteúdo não publicável.

## 64.4. Busca

Testar:

- vazio;
- 1 caractere;
- 2 caracteres;
- acentos;
- maiúsculas;
- tags;
- categoria;
- sem resultado;
- caracteres especiais;
- query de 100 caracteres;
- query de 101 caracteres;
- HTML;
- script;
- espaços.

## 64.5. Paginação

Testar:

- primeira página;
- intermediária;
- última;
- inválida;
- busca paginada;
- canonical;
- foco;
- `aria-current`.

## 64.6. Post

Testar:

- com capa;
- sem capa;
- com subtitle;
- sem subtitle;
- com quatro H2;
- sem sumário;
- código;
- tabela;
- imagem;
- callout;
- referências;
- relacionados;
- sem relacionados;
- links externos;
- copy code;
- share.

## 64.7. SEO

Validar:

- title;
- description;
- canonical;
- OG;
- JSON-LD;
- breadcrumb;
- sitemap;
- noindex;
- busca;
- categoria com um artigo;
- categoria com dois artigos;
- updatedAt.

## 64.8. O Projeto

Testar:

- capacidades por status;
- capacidade sem `verifiedAt`;
- delivered inválido;
- links;
- arquitetura;
- bastidores vazios;
- bastidores com conteúdo;
- roadmap sem datas;
- mobile.

## 64.9. Segurança

Testar:

- `javascript:` em link;
- HTML;
- script;
- iframe;
- style;
- evento inline;
- code com HTML;
- imagem inválida;
- URL privada;
- segredo;
- preview sem autenticação;
- cache de preview.

## 64.10. Responsividade

Validar:

- 360px;
- 390px;
- 768px;
- 1024px;
- 1366px;
- 1440px;
- zoom 200%.

## 64.11. Acessibilidade

Validar:

- headings;
- teclado;
- foco;
- busca;
- categorias;
- paginação;
- sumário;
- code copy;
- tabelas;
- imagens;
- compartilhamento;
- CTAs;
- contraste;
- movimento reduzido.

## 64.12. Build

- lint sem erros;
- testes sem erros;
- build sem erros;
- ausência de `[TESTE]`;
- ausência de `TODO`;
- ausência de placeholder;
- ausência de segredo;
- ausência de rascunho público.

---

# 65. Critérios de aceite por superfície

## 65.1. Página Artigos

- rota `/artigos`;
- hero atualizado;
- destaque condicional;
- busca;
- categorias;
- 9 artigos;
- paginação;
- CTA editorial;
- sem newsletter;
- sem mais lidos nesta tarefa;
- sem teste.

## 65.2. Categoria

- seis categorias;
- descrições exatas;
- slug validado;
- paginação;
- SEO condicional;
- estado vazio.

## 65.3. Post

- breadcrumb;
- header;
- metadata;
- corpo estruturado;
- sumário condicional;
- código;
- tabelas;
- callouts;
- referências;
- compartilhamento;
- CTA;
- autor;
- relacionados.

## 65.4. O Projeto

- nova estrutura;
- capacidades com status;
- arquitetura;
- princípios;
- fluxo de IA;
- roadmap sem promessas;
- bastidores;
- CTA.

## 65.5. CMS

- estados;
- filtros;
- preview;
- qualidade;
- IA sem publicação automática;
- migração segura para TipTap.

## 65.6. SEO

- canonical;
- metadata;
- JSON-LD;
- sitemap;
- redirects;
- noindex;
- futuras traduções previstas.

---

# 66. Critérios de aceite do sistema completo

A implementação será aceita somente quando:

1. `/artigos` for a rota editorial canônica.
2. `/blog` redirecionar corretamente.
3. Nenhum conteúdo de teste aparecer.
4. Rascunhos não aparecerem.
5. Agendados futuros não aparecerem.
6. Categorias estiverem padronizadas.
7. Cada artigo possuir uma categoria principal.
8. A busca não expuser conteúdo privado.
9. A paginação utilizar links reais.
10. O destaque não for duplicado no grid.
11. O post possuir apenas um H1.
12. O conteúdo estruturado for sanitizado.
13. Blocos de código forem acessíveis.
14. Tabelas funcionarem no mobile.
15. Referências não forem inventadas.
16. Compartilhamento não carregar scripts sociais.
17. O CTA do artigo respeitar a categoria.
18. Relacionados não repetirem o artigo atual.
19. Datas públicas refletirem mudanças editoriais reais.
20. Canonicals estiverem corretos.
21. Busca não for indexada.
22. Categorias vazias não forem indexadas.
23. Preview exigir autenticação.
24. Preview não for cacheado publicamente.
25. IA não publicar automaticamente.
26. Traduções exigirem revisão.
27. O Projeto distinguir entregue, em desenvolvimento e planejado.
28. Funcionalidades futuras não parecerem entregues.
29. A página O Projeto não parecer documentação interna.
30. Não houver newsletter ativa sem infraestrutura e consentimento.
31. Não houver comentários, anúncios ou mais lidos criados nesta tarefa.
32. A plataforma funcionar sem analytics.
33. Analytics não receber PII.
34. A interface funcionar em desktop, tablet e mobile.
35. Não houver regressão de acessibilidade.
36. Lint, testes e build terminarem sem erros.
37. Os textos estiverem exatamente como especificados.
38. O sistema editorial permanecer coerente com a consultoria e com a autoridade técnica desejada.

---

# 67. Checklist final de revisão humana

- [ ] `/artigos` funciona.
- [ ] `/blog` redireciona.
- [ ] Menu usa “Artigos”.
- [ ] Footer usa “Artigos”.
- [ ] Home aponta para `/artigos`.
- [ ] Seis categorias cadastradas.
- [ ] Nenhuma categoria extra.
- [ ] Estados editoriais implementados.
- [ ] Flags implementadas.
- [ ] Filtro público centralizado.
- [ ] Testes excluídos.
- [ ] Rascunhos excluídos.
- [ ] Agendados futuros excluídos.
- [ ] Noindex excluído das listagens.
- [ ] Hero de Artigos atualizado.
- [ ] Destaque condicional.
- [ ] Busca funcional.
- [ ] Busca acessível.
- [ ] Paginação funcional.
- [ ] Grid com nove itens.
- [ ] Estado vazio correto.
- [ ] Categorias com descrições corretas.
- [ ] Post com breadcrumb.
- [ ] Post com metadata.
- [ ] Sumário condicional.
- [ ] Código copiável.
- [ ] Tabelas responsivas.
- [ ] Callouts padronizados.
- [ ] Referências presentes quando necessárias.
- [ ] Compartilhamento sem scripts.
- [ ] CTA contextual correto.
- [ ] Bloco do autor correto.
- [ ] Relacionados corretos.
- [ ] Metadata e canonical corretos.
- [ ] JSON-LD válido.
- [ ] Sitemap filtrado.
- [ ] Redirects de slug previstos.
- [ ] Preview protegido.
- [ ] Preview noindex.
- [ ] Preview sem cache público.
- [ ] Quality gates implementados.
- [ ] Segredos verificados.
- [ ] Fluxo de IA auditável.
- [ ] Tradução sem publicação automática.
- [ ] O Projeto atualizado.
- [ ] Estados do projeto validados.
- [ ] Arquitetura sem dados sensíveis.
- [ ] Fluxo editorial explicado.
- [ ] Roadmap sem datas.
- [ ] Bastidores conectados.
- [ ] CTA de O Projeto correto.
- [ ] Analytics sem PII.
- [ ] Mobile validado.
- [ ] Zoom 200% validado.
- [ ] Teclado validado.
- [ ] Contraste validado.
- [ ] Movimento reduzido respeitado.
- [ ] Lint concluído.
- [ ] Testes concluídos.
- [ ] Build concluído.

---

# 68. Resultado esperado

Ao final, o sistema editorial deverá comunicar:

> A plataforma publica conteúdo técnico autoral com estrutura, revisão, rastreabilidade e uma separação clara entre o que está em produção, o que está em desenvolvimento e o que ainda é apenas planejamento.

O visitante deverá entender:

- quais temas são cobertos;
- como encontrar um artigo;
- quando um conteúdo foi publicado ou atualizado;
- quem assume a autoria;
- como o tema se relaciona aos serviços;
- como a própria plataforma foi construída;
- como a IA participa do fluxo editorial;
- que funcionalidades futuras não são apresentadas como prontas.

A administração deverá garantir:

- publicação controlada;
- ausência de conteúdo de teste;
- preview seguro;
- SEO consistente;
- tradução revisada;
- conteúdo estruturado;
- reversibilidade;
- proteção contra vazamento de informações;
- evolução incremental sem quebrar os artigos existentes.
