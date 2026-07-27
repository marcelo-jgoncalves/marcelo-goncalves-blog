# Ajuste 15C — CMS e Fluxo Editorial

## 0. Finalidade e precedência

Este documento define o modelo de conteúdo, estados, publicação, preview, segurança, IA, tradução, migração de editor e regras de backend.

Não define o layout detalhado de `/artigos`, `/post/[slug]` ou `/o-projeto`.

---

# 1. Modelo de artigo

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

---

# 2. Estados editoriais

## draft

- estado inicial;
- não público.

## review

- aguardando revisão;
- não público.

## scheduled

- aprovado;
- data futura;
- não público antes do horário.

## published

Público somente quando:

- `publishedAt` existe;
- `publishedAt <= now`;
- campos obrigatórios válidos;
- não teste;
- passou quality gates.

## archived

- removido das consultas;
- fora do sitemap;
- política 404, 410 ou redirect conforme histórico.

---

# 3. Flags

## `isTest`

Nunca público.

Não aparecer em:

- Home;
- `/artigos`;
- categorias;
- busca;
- relacionados;
- sitemap;
- feed.

Build de produção deve falhar se conteúdo de teste for incluído.

## `noindex`

- acessível por URL;
- fora de superfícies de descoberta;
- fora do sitemap;
- `noindex, follow`.

## `featured`

Candidato a destaque.

Não garante exibição se houver prioridade superior.

---

# 4. Filtro público centralizado

Toda consulta pública deve utilizar uma única função ou camada de filtro.

Condições:

```text
status === "published"
publishedAt <= now
isTest === false
noindex === false
```

Além disso:

- slug válido;
- título;
- excerpt;
- body;
- categoria registrada;
- autor registrado.

Bloquear títulos iniciados por:

```text
[TESTE]
TESTE -
TEST:
Lorem Ipsum
```

ignorando caixa e espaços iniciais.

Não duplicar a lógica entre Home, Artigos, Categoria e Relacionados.

---

# 5. Taxonomia

Categorias oficiais definidas no Ajuste 15A.

Regras:

- exatamente uma categoria principal;
- zero a cinco tags;
- tags reutilizáveis;
- sem hashtag;
- sem duplicar categoria;
- sem categoria criada livremente.

---

# 6. Ciclo de vida

## Criação

`draft`.

## Envio para revisão

`review`.

## Correções relevantes

retornar para `draft`.

## Publicação imediata

`published` + `publishedAt`.

## Agendamento

`scheduled` + `scheduledAt`.

## Alteração de post publicado

Preferir versão de trabalho separada.

Não substituir a versão pública por mudanças parciais.

## Arquivamento

`archived` + motivo interno.

---

# 7. Agendamento

Persistir datas em UTC.

Exibir e interpretar editorialmente em:

```text
America/Sao_Paulo
```

O processo agendado deve:

- consultar scheduled vencidos;
- ser idempotente;
- publicar uma vez;
- registrar resultado;
- tolerar repetição;
- não duplicar datas;
- atualizar índices e cache;
- gerar alerta em falha.

---

# 8. Publicação e cache

Ao publicar:

1. validar;
2. persistir status;
3. atualizar índices;
4. atualizar sitemap;
5. revalidar post;
6. revalidar `/artigos`;
7. revalidar categoria;
8. revalidar Home;
9. revalidar relacionados.

Ao arquivar:

- remover consultas;
- atualizar sitemap;
- invalidar cache;
- aplicar status HTTP correto;
- remover relacionados.

Falha de revalidação:

- registrar;
- gerar alerta;
- permitir retry idempotente;
- não alterar data automaticamente.

---

# 9. Preview

Preview exige:

- autenticação;
- sessão ou token curto;
- expiração;
- `noindex, nofollow`;
- sem cache público;
- fora de analytics público;
- fora de relacionados;
- fora de sitemap;
- banner persistente.

Banner:

```text
Visualização de rascunho
```

Texto:

```text
Este conteúdo ainda não está publicado.
```

Proibido:

```text
?preview=true
```

sem autenticação.

---

# 10. Migração Quill → TipTap

Antes da migração:

1. exportar todo o conteúdo;
2. versionar backup;
3. mapear formatos;
4. testar conversão;
5. identificar blocos não suportados;
6. preservar slugs;
7. preservar datas;
8. preservar imagens;
9. preservar headings;
10. validar artigos publicados;
11. preparar rollback.

O preview do editor deve usar o mesmo renderer público.

Não manter dois renderers divergentes.

---

# 11. Modelo estruturado

Blocos permitidos:

- paragraph;
- heading;
- bulletList;
- orderedList;
- blockquote;
- codeBlock;
- table;
- image;
- callout;
- horizontalRule;
- link.

Blocos proibidos:

- script;
- style;
- form;
- input;
- iframe arbitrário;
- HTML livre;
- embed genérico;
- widget de terceiros;
- conteúdo executável.

Validação no servidor obrigatória.

---

# 12. Segurança

Validar:

- tipos de nós;
- níveis de heading;
- URLs;
- protocolos;
- profundidade;
- tamanho;
- imagens;
- tabelas;
- código;
- callouts.

Bloquear:

- `javascript:`;
- `data:` em links;
- eventos inline;
- scripts;
- segredos;
- tokens;
- private keys;
- access keys;
- URLs privadas;
- dados pessoais.

Assets:

- MIME;
- extensão;
- tamanho;
- dimensões;
- metadados;
- conteúdo real.

Admin separado da experiência pública.

---

# 13. Quality gates

Publicação exige:

- título;
- excerpt;
- slug;
- categoria;
- autor;
- body;
- publishedAt;
- metadata;
- canonical;
- headings revisados;
- links verificados;
- ortografia;
- revisão técnica;
- capa ou fallback;
- alt;
- ausência de segredos;
- ausência de PII;
- ausência de placeholders;
- revisão humana quando houver IA.

Bloquear em produção:

```text
[TESTE]
TODO
PLACEHOLDER
LOREM IPSUM
INSERIR IMAGEM
CORRIGIR DEPOIS
```

---

# 14. Uso de IA

Usos permitidos:

- outline;
- revisão;
- resumo;
- título;
- excerpt;
- SEO;
- tradução;
- social;
- sugestão visual;
- análise de consistência.

Usos proibidos sem revisão:

- publicação;
- alteração de publicado;
- citação;
- fonte;
- atualização factual;
- tradução pública;
- postagem social;
- métrica;
- prova de experiência.

Modelo:

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

Não exibir fornecedor ou selo público de IA.

Marcelo pode permanecer autor quando define, revisa e aprova o conteúdo.

---

# 15. Tradução

Fluxo:

1. artigo PT publicado;
2. prioridade editorial;
3. tradução acionada;
4. rascunho por IA;
5. revisão humana;
6. adaptação;
7. aprovação;
8. publicação.

Estados:

```text
not_requested
draft_generated
human_review
approved
published
```

Somente após ambas as versões públicas:

- hreflang pt-BR;
- hreflang en;
- canonical próprio;
- translationGroupId;
- x-default conforme arquitetura.

Não publicar automaticamente.

---

# 16. Renderer público

O renderer deve:

- receber conteúdo validado;
- escapar valores;
- renderizar somente blocos permitidos;
- gerar IDs estáveis;
- sanitizar links;
- não carregar editor;
- não executar HTML;
- não expor dados internos;
- manter comportamento igual ao preview.

---

# 17. Auditoria

Registrar:

- criação;
- mudança de status;
- publicação;
- agendamento;
- arquivamento;
- revisão;
- uso de IA;
- tradução;
- falha de cache;
- falha de publicação.

Não registrar corpo completo em logs gerais.

Não registrar segredos ou conteúdo sensível.

---

# 18. Testes obrigatórios

Testar:

- cada status;
- data futura;
- publicação repetida;
- retry;
- filtro público;
- test;
- noindex;
- categoria inválida;
- campo obrigatório;
- marcador proibido;
- segredo;
- PII;
- preview sem autenticação;
- preview expirado;
- cache;
- migração;
- renderer;
- IA sem revisão;
- tradução sem aprovação;
- arquivamento;
- build.

---

# 19. Critérios de aceite

O fluxo será aceito quando:

1. houver uma única regra pública;
2. rascunhos nunca vazarem;
3. teste nunca vazar;
4. agendamento for idempotente;
5. preview for protegido;
6. conteúdo estruturado for validado;
7. IA não publicar;
8. tradução exigir revisão;
9. cache for revalidado;
10. quality gates bloquearem placeholders e segredos;
11. migração permitir rollback;
12. admin e público permanecerem separados.
