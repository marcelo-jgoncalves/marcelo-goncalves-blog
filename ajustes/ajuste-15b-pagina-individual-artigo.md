# Ajuste 15B — Página Individual de Artigo

## 0. Finalidade e precedência

Este documento define exclusivamente a experiência pública de leitura em:

```text
/post/[slug]
```

Não inclui:

- listagem;
- categorias;
- CMS;
- editor;
- preview administrativo;
- página O Projeto.

---

# 1. Estrutura final

1. Header global;
2. Breadcrumb;
3. Cabeçalho editorial;
4. Capa;
5. Sumário, quando aplicável;
6. Corpo;
7. Fontes e referências;
8. Compartilhamento;
9. CTA contextual;
10. Autor;
11. Relacionados;
12. Footer global.

Não adicionar:

- comentários;
- reações;
- paywall;
- login;
- newsletter;
- anúncios;
- popup;
- barra social fixa;
- CTA no meio do artigo.

---

# 2. Breadcrumb

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
{Título}
```

Links:

- `/`;
- `/artigos`;
- `/categoria/[slug]`;
- título sem link e com `aria-current="page"`.

Mobile:

- permitir quebra;
- não gerar overflow;
- o último item pode ser visualmente simplificado se o H1 vier logo abaixo.

---

# 3. Cabeçalho editorial

Ordem:

1. categoria;
2. H1;
3. subtitle ou excerpt;
4. data;
5. atualização, quando relevante;
6. tempo de leitura;
7. autor.

## Autor

```text
Por Marcelo Gonçalves
```

Destino:

```text
/sobre
```

## Data

```text
Publicado em 27 de julho de 2026
```

## Atualização

```text
Atualizado em 3 de agosto de 2026
```

Exibir somente quando houver alteração substantiva.

Não alterar data por build, metadata ou correção cosmética.

## Tempo de leitura

Regra:

- 200 palavras/minuto;
- arredondar para cima;
- mínimo 1 minuto;
- não contar código, metadata ou navegação.

---

# 4. Capa

Renderizar quando houver imagem válida.

Campos:

- arquivo;
- width;
- height;
- alt;
- legenda opcional.

Regras:

- sem deformação;
- sem layout shift;
- otimização adequada;
- não usar screenshot com dados sensíveis;
- alt não deve repetir o título;
- legenda somente se informativa;
- fallback oficial quando exigido pelo design.

---

# 5. Sumário

Renderizar quando houver:

```text
4 ou mais H2
```

Título:

```text
Neste artigo
```

Listar H2.

H3 somente se o componente existente suportar aninhamento claro.

Regras:

- IDs únicos e estáveis;
- `scroll-margin-top`;
- acessível por teclado;
- sem posição fixa obrigatória;
- sem scroll lateral;
- respeitar movimento reduzido.

---

# 6. Corpo

## Largura

Entre aproximadamente:

```text
720px e 780px
```

com largura fluida.

## Headings

Permitidos:

- H2;
- H3;
- H4 quando necessário.

Proibido:

- H1 dentro do corpo;
- salto de níveis;
- heading usado somente para estilo.

## Parágrafos

- alinhamento à esquerda;
- sem justificação;
- espaçamento consistente;
- largura confortável.

## Links

Internos:

- mesma aba.

Externos:

- nova aba, quando adotado pelo padrão;
- `noopener noreferrer`;
- indicação acessível.

Não permitir:

- javascript:;
- data:;
- HTML arbitrário.

---

# 7. Código

Cada bloco pode conter:

- linguagem;
- título opcional;
- botão de cópia;
- código.

Botão:

```text
Copiar código
```

Após sucesso:

```text
Código copiado
```

Retornar após 2 segundos.

Regras:

- acessível;
- status anunciado;
- código escapado;
- nunca executado;
- scroll interno horizontal;
- sem overflow da página;
- remover credenciais, IDs e endpoints privados;
- preservar linhas longas quando quebrar altera o significado.

---

# 8. Tabelas

Usar HTML semântico:

- table;
- caption quando útil;
- thead;
- tbody;
- th com scope.

Mobile:

- container com scroll horizontal;
- foco acessível;
- indicação visual de conteúdo lateral.

Não usar tabela para layout.

---

# 9. Imagens e diagramas

Cada imagem deve possuir:

- alt;
- dimensões;
- otimização;
- legenda quando necessária;
- autoria ou fonte quando aplicável.

Antes de publicar screenshot, remover:

- nomes;
- e-mails;
- IDs;
- contas;
- ARNs;
- tokens;
- IPs;
- endpoints;
- clientes;
- notificações pessoais.

Diagramas:

- legíveis em mobile;
- contraste adequado;
- descrição textual;
- não depender somente de cor.

---

# 10. Callouts

Tipos permitidos:

```text
Informação
Decisão
Atenção
Aprendizado
```

Cada callout possui:

- título;
- corpo;
- ícone decorativo opcional.

Não criar outros tipos.

Não usar emojis.

Não usar callout como propaganda.

---

# 11. Fontes e referências

Renderizar quando houver itens.

H2:

```text
Fontes e referências
```

Cada item:

- título;
- entidade ou autor;
- link;
- data de acesso somente quando necessária.

Regras:

- não inventar;
- não manter link quebrado;
- não copiar longos trechos;
- remover tracking quando seguro.

---

# 12. Compartilhamento

Exibir somente:

```text
Copiar link
```

```text
Compartilhar no LinkedIn
```

Regras:

- sem scripts sociais;
- copiar canonical;
- anunciar sucesso;
- LinkedIn em nova aba;
- sem contagem;
- sem Facebook, X, Instagram ou WhatsApp nesta tarefa.

---

# 13. CTA contextual

## Eyebrow

```text
Aplicação prática
```

## H2

```text
Precisa aplicar esse tipo de engenharia na sua operação?
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

Destino por categoria:

| Categoria | Destino |
|---|---|
| Cloud e AWS | `/contato?area=cloud-devops-confiabilidade` |
| DevOps e Confiabilidade | `/contato?area=cloud-devops-confiabilidade` |
| Automação e Integração | `/contato?area=automacao-integracao` |
| Inteligência Artificial | `/contato?area=inteligencia-artificial` |
| Sistemas e Engenharia | `/contato?area=sistemas-plataformas` |
| Bastidores do Projeto | `/contato` |

Não renderizar no preview interno.

---

# 14. Autor

Exibir:

- foto;
- nome;
- cargo;
- texto curto;
- CTA.

Nome:

```text
Marcelo Gonçalves
```

Cargo:

```text
Fundador e líder técnico
```

Texto:

```text
Engenheiro de Cloud e DevOps com mais de dez anos de experiência em tecnologia, atuando com AWS, automação, sistemas e confiabilidade.
```

O texto depende da validação do Ajuste 13.

CTA:

```text
Conhecer a trajetória
```

Destino:

```text
/sobre
```

Não criar página de autor.

---

# 15. Artigos relacionados

Título:

```text
Continue explorando
```

Quantidade:

```text
até 3
```

Pontuação:

1. mesma categoria: +5;
2. tag compartilhada: +1;
3. mesmo serviço: +2;
4. últimos 12 meses: +1.

Desempate:

1. pontuação;
2. data;
3. ID.

Excluir:

- atual;
- teste;
- draft;
- review;
- futuro;
- noindex;
- archived;
- outro idioma.

Fallback:

- completar com recentes;
- sem repetição;
- ocultar quando vazio.

---

# 16. SEO

## Title

Prioridade:

1. `seoTitle`;
2. `{title} | Marcelo Gonçalves`.

## Description

Prioridade:

1. `seoDescription`;
2. excerpt.

## Canonical

URL absoluta sem parâmetros.

## Open Graph

- type article;
- title;
- description;
- image;
- publishedTime;
- modifiedTime;
- author;
- section;
- tags.

## JSON-LD

Preferir:

```text
TechArticle
```

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

Adicionar BreadcrumbList coerente.

Não incluir rating, offers ou métricas não verificadas.

---

# 17. Slug e redirect

Slug:

- minúsculo;
- hífen;
- sem acento;
- sem data;
- até 80 caracteres;
- descritivo.

Mudança em artigo publicado:

- redirect permanente;
- canonical atualizado;
- links internos atualizados;
- slug antigo nunca reutilizado;
- evitar cadeias.

---

# 18. Performance

- não carregar editor;
- não carregar scripts sociais;
- lazy-load abaixo da dobra;
- capa com prioridade somente quando necessário;
- renderer público otimizado;
- evitar hidratação desnecessária;
- reservar espaço de mídia;
- não carregar dados administrativos.

---

# 19. Analytics

Somente se existir helper.

Eventos:

```text
article_view
article_read_progress
article_code_copy
article_share
article_cta_click
article_related_click
```

Progresso:

- 25;
- 50;
- 75;
- 100;

uma vez por página.

Propriedades permitidas:

- articleId;
- slug;
- categoryId;
- readingTime;
- progress;
- shareChannel;
- ctaType;
- relatedArticleId.

Não enviar corpo, código, texto copiado, query, PII ou preview.

---

# 20. Acessibilidade

Validar:

- um H1;
- ordem de headings;
- breadcrumb;
- foco;
- sumário;
- copiar código;
- tabelas;
- imagens;
- links externos;
- compartilhamento;
- CTA;
- contraste;
- movimento reduzido;
- zoom 200%.

---

# 21. Testes obrigatórios

Testar:

- post válido;
- slug inválido;
- capa presente e ausente;
- subtitle e fallback;
- atualização relevante;
- 3 e 4 H2;
- código;
- tabela;
- imagem;
- callout;
- referência;
- relacionados;
- sem relacionados;
- canonical;
- JSON-LD;
- copy link;
- LinkedIn;
- CTA por categoria;
- mobile;
- teclado;
- build.

---

# 22. Critérios de aceite

A página será aceita quando:

1. possuir apenas um H1;
2. breadcrumb estiver correto;
3. conteúdo estruturado estiver sanitizado;
4. código não executar;
5. tabelas funcionarem em mobile;
6. referências forem reais;
7. compartilhamento não carregar scripts;
8. CTA respeitar categoria;
9. relacionados não incluírem conteúdo privado;
10. preview não usar esta experiência como página pública indexável;
11. SEO estiver válido;
12. não houver comentários, anúncios ou newsletter.
