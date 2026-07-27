# Ajuste 15A — Página Artigos e Categorias

## 0. Finalidade e precedência

Este documento define exclusivamente:

- página principal de artigos;
- busca;
- destaque;
- cards;
- paginação;
- páginas de categoria;
- navegação e SEO dessas superfícies.

Não inclui:

- página individual do post;
- CMS;
- editor;
- preview;
- tradução;
- página O Projeto.

Em caso de conflito, este documento prevalece para `/artigos`, `/blog` e `/categoria/[slug]`.

---

# 1. Rotas

## 1.1. Rota canônica

```text
/artigos
```

## 1.2. Rota antiga

```text
/blog
```

Deverá redirecionar permanentemente para:

```text
/artigos
```

Regras:

- não manter duas páginas indexáveis;
- atualizar links internos;
- `/blog` não recebe canonical próprio;
- não preservar parâmetros desconhecidos;
- preservar `q` e `pagina` somente se forem válidos.

## 1.3. Categorias

```text
/categoria/[slug]
```

Slug inválido:

- retornar 404;
- não redirecionar para `/artigos`;
- não criar categoria automaticamente.

---

# 2. Categorias oficiais

Usar exatamente:

| Nome | Slug |
|---|---|
| Cloud e AWS | `cloud-aws` |
| DevOps e Confiabilidade | `devops-confiabilidade` |
| Automação e Integração | `automacao-integracao` |
| Inteligência Artificial | `inteligencia-artificial` |
| Sistemas e Engenharia | `sistemas-engenharia` |
| Bastidores do Projeto | `bastidores-projeto` |

Cada artigo público deve possuir exatamente uma categoria principal.

Não criar páginas públicas de tags nesta tarefa.

---

# 3. Links globais

## Header

Texto:

```text
Artigos
```

Destino:

```text
/artigos
```

## Footer

Texto:

```text
Artigos
```

Destino:

```text
/artigos
```

## Home

CTA editorial:

```text
Explorar os artigos
```

Destino:

```text
/artigos
```

Não utilizar “Blog” como item principal da navegação.

---

# 4. Estrutura da página `/artigos`

Ordem obrigatória:

1. Header global;
2. Hero;
3. Destaque, quando existir;
4. Busca e categorias;
5. Cabeçalho da listagem;
6. Grid;
7. Paginação;
8. CTA editorial compacto;
9. Footer global.

Não adicionar:

- sidebar;
- carrossel;
- mais lidos;
- newsletter;
- anúncios;
- tags navegáveis;
- ordenação manual;
- login;
- popup.

---

# 5. Hero

## Eyebrow

```text
Artigos
```

## H1

```text
Engenharia aplicada, decisões técnicas e aprendizados de produção.
```

## Subtítulo

```text
Um acervo de aprendizados reais sobre cloud, automação, inteligência artificial e operações — do problema à solução.
```

## Regras

- sem CTA;
- sem imagem;
- sem contagem;
- mais compacto que o hero da Home;
- H1 único;
- largura máxima aproximada de 900px;
- subtítulo com largura máxima aproximada de 760px.

---

# 6. Artigo em destaque

## Condição

Renderizar somente quando existir artigo elegível.

Seleção:

1. `featured === true`;
2. `featuredPriority` decrescente;
3. `publishedAt` decrescente;
4. `id` estável.

## Conteúdo

- imagem;
- eyebrow `Em destaque`;
- categoria;
- data;
- tempo de leitura;
- título;
- excerpt;
- CTA.

## CTA

```text
Ler artigo
```

Destino:

```text
/post/{slug}
```

## Regras

- um único destaque;
- excluir do grid da primeira página;
- não exibir destaque em `pagina > 1`;
- sem autor;
- sem tags;
- sem métricas;
- sem placeholder quando não houver destaque.

---

# 7. Busca

## Label

```text
Pesquisar artigos
```

## Placeholder

```text
Busque por tema, tecnologia ou problema
```

## Query parameter

```text
q
```

## Regras

- mínimo de 2 caracteres;
- máximo de 100;
- trim;
- comparação sem diferenciação de caixa;
- normalizar acentos;
- buscar em título, excerpt, tags e categoria;
- não buscar no HTML bruto;
- não executar regex fornecida pelo usuário;
- não refletir HTML;
- botão acessível para limpar;
- preservar a query na URL;
- GET, quando server-side;
- debounce de 300 ms, quando client-side.

## Query curta

Exibir:

```text
Digite pelo menos 2 caracteres para pesquisar.
```

Manter a listagem padrão.

## Busca sem resultado

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

---

# 8. Categorias na página principal

Exibir:

```text
Todos
```

e as seis categorias oficiais.

Regras:

- “Todos” ativo em `/artigos`;
- cada categoria é link real;
- destino `/categoria/[slug]`;
- estado ativo não depende apenas de cor;
- permitir quebra no mobile;
- não filtrar somente via JavaScript.

---

# 9. Cabeçalho da listagem

## Sem busca

```text
Todos os artigos
```

## Com busca

```text
Resultados para “{query sanitizada}”
```

## Contagem

Quando disponível:

```text
1 artigo encontrado
```

ou:

```text
{n} artigos encontrados
```

Não exibir contagem aproximada.

---

# 10. Grid de artigos

## Quantidade

```text
9 artigos por página
```

O destaque não conta.

## Ordenação

1. `publishedAt` decrescente;
2. `id`.

## Card

Exibir:

1. imagem;
2. categoria;
3. data;
4. tempo de leitura;
5. título;
6. excerpt;
7. CTA.

CTA:

```text
Ler artigo
```

Não exibir:

- autor;
- views;
- likes;
- comentários;
- tags;
- data relativa;
- badge de IA.

## Data

Formato:

```text
27 de julho de 2026
```

Locale:

```text
pt-BR
```

## Tempo de leitura

- 200 palavras por minuto;
- arredondar para cima;
- mínimo de 1 minuto;
- não contar código;
- não contar metadados.

## Excerpt

- usar campo editorial;
- não gerar em runtime;
- line-clamp visual;
- não cortar o dado persistido.

---

# 11. Paginação

## Query

```text
pagina
```

## Primeira página

Canonical:

```text
/artigos
```

Não usar `?pagina=1`.

## Controles

- Anterior;
- números;
- Próxima.

Regras:

- links reais;
- `aria-current="page"`;
- preservar `q`;
- sem infinite scroll;
- página inválida retorna 404;
- foco volta ao título da listagem;
- estado sem página não deve ser link.

## Busca

URLs com `q`:

- `noindex, follow`;
- canonical para `/artigos`;
- fora do sitemap.

## Paginação sem busca

- indexável;
- canonical próprio;
- title com número para página 2 ou superior.

---

# 12. Estado sem artigos publicados

## H2

```text
Novos artigos estão em preparação.
```

## Texto

```text
O conteúdo será publicado quando estiver revisado e pronto para leitura.
```

Não exibir:

- testes;
- placeholders;
- datas futuras;
- cards falsos.

---

# 13. CTA editorial compacto

## Eyebrow

```text
Aplicação prática
```

## H2

```text
Precisa transformar um desafio técnico em uma solução para a operação?
```

## Texto

```text
Conheça as frentes de atuação da consultoria ou apresente o contexto que sua empresa precisa resolver.
```

## Primário

```text
Conhecer os serviços
```

Destino:

```text
/servicos
```

## Secundário

```text
Apresentar um desafio
```

Destino:

```text
/contato
```

Regras:

- sem lista;
- sem formulário;
- sem badge;
- visual editorial, menos dominante que CTA comercial;
- botões empilhados no mobile.

---

# 14. Página de categoria

## Hero

Eyebrow:

```text
Categoria
```

H1:

nome oficial.

Descrições:

### Cloud e AWS

```text
Arquitetura, serviços gerenciados, segurança, custos e decisões práticas para construir e operar na AWS.
```

### DevOps e Confiabilidade

```text
Entrega contínua, infraestrutura como código, observabilidade, incidentes e práticas para operar sistemas com previsibilidade.
```

### Automação e Integração

```text
Processos, APIs, workflows e integrações para reduzir trabalho manual e conectar sistemas.
```

### Inteligência Artificial

```text
Aplicações responsáveis de IA em documentos, conhecimento, sistemas e processos empresariais.
```

### Sistemas e Engenharia

```text
Arquitetura de software, APIs, qualidade, modernização e decisões que tornam sistemas mais fáceis de evoluir.
```

### Bastidores do Projeto

```text
Decisões, erros, arquitetura e evolução da plataforma editorial construída como produto de engenharia.
```

## Listagem

- 9 artigos;
- sem destaque;
- paginação;
- ordenação por data;
- link para todos os artigos.

## Estado vazio

```text
Ainda não há artigos publicados nesta categoria.
```

CTA:

```text
Ver todos os artigos
```

Destino:

```text
/artigos
```

## Indexação

Com 2 ou mais artigos:

- index, follow;
- sitemap;
- canonical próprio.

Com menos de 2:

- noindex, follow;
- fora do sitemap.

---

# 15. SEO

## `/artigos`

Title:

```text
Artigos sobre Cloud, Automação, IA e Engenharia | Marcelo Gonçalves
```

Description:

```text
Artigos técnicos e aprendizados de produção sobre AWS, DevOps, confiabilidade, automação, inteligência artificial e engenharia de software.
```

Canonical:

```text
/artigos
```

## Categorias

Title:

```text
{Categoria} — Artigos | Marcelo Gonçalves
```

Description:

usar a descrição oficial da categoria.

## JSON-LD

Somente se o projeto já utilizar.

É permitido:

- CollectionPage;
- ItemList;
- BreadcrumbList.

Não incluir rascunhos ou conteúdo futuro.

---

# 16. Analytics

Somente se existir helper.

Eventos:

```text
articles_page_view
article_featured_click
article_search
article_search_clear
article_category_click
article_card_click
```

Propriedades permitidas:

- articleId;
- categoryId;
- position;
- page;
- queryLength;
- resultCount.

Não enviar:

- query completa;
- dados pessoais;
- título completo quando desnecessário;
- conteúdo.

---

# 17. Responsividade

Desktop:

- grid de 3 colunas;
- destaque amplo;
- categorias em linha.

Tablet:

- 2 colunas;
- destaque com imagem e conteúdo empilháveis;
- categorias com quebra.

Mobile:

- 1 coluna;
- sem scroll horizontal da página;
- cards sem altura fixa;
- busca em largura total;
- paginação com controles acessíveis.

Validar:

- 360;
- 390;
- 768;
- 1024;
- 1366;
- 1440;
- zoom 200%.

---

# 18. Testes obrigatórios

- redirect `/blog`;
- busca vazia;
- busca com 1, 2 e 100 caracteres;
- acentos;
- categoria válida e inválida;
- 0, 1, 2, 9 e 10 artigos;
- destaque único;
- múltiplos candidatos;
- paginação válida e inválida;
- canonical;
- noindex da busca;
- indexação condicional da categoria;
- teclado;
- foco;
- contraste;
- mobile;
- build.

---

# 19. Critérios de aceite

A implementação será aceita quando:

1. `/artigos` for canônica;
2. `/blog` redirecionar;
3. busca não expuser conteúdo privado;
4. categorias estiverem padronizadas;
5. destaque não se repetir;
6. paginação usar links reais;
7. conteúdo de teste não aparecer;
8. categorias com pouco conteúdo não forem indexadas;
9. interface funcionar sem analytics;
10. não houver newsletter, mais lidos, comentários ou anúncios.
