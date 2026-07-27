# Ajuste 15D — Página O Projeto

## 0. Finalidade e precedência

Este documento define exclusivamente a página:

```text
/o-projeto
```

Não define a listagem geral, post individual ou fluxo completo do CMS.

A página deverá apresentar a plataforma como produto de engenharia e prova de execução, sem transformar planos futuros em funcionalidades entregues.

---

# 1. Estrutura final

1. Header global;
2. Hero;
3. Por que construir;
4. Estado atual;
5. Arquitetura;
6. Princípios de engenharia;
7. Fluxo editorial e IA;
8. Evolução;
9. Bastidores;
10. CTA final;
11. Footer global.

Não adicionar:

- documentação interna extensa;
- tabela de custos;
- roadmap com datas;
- portfólio;
- preços;
- venda do CMS;
- métricas não verificadas;
- logos de clientes;
- diagrama com dados internos.

---

# 2. Hero

## Eyebrow

```text
O Projeto
```

## H1

```text
Uma plataforma editorial construída como produto de engenharia.
```

## Subtítulo

```text
Este site também funciona como um laboratório prático para arquitetura serverless, infraestrutura como código, automação editorial e uso responsável de inteligência artificial.
```

## CTA primário

```text
Explorar a arquitetura
```

Destino:

```text
#arquitetura
```

## CTA secundário

```text
Ler os bastidores
```

Destino:

```text
/categoria/bastidores-projeto
```

## Microcopy

```text
Projeto próprio · Evolução contínua · Estados publicados com transparência
```

Regras:

- sem mockup;
- sem logos;
- sem diagrama completo;
- dois CTAs;
- mobile empilhado.

---

# 3. Por que construir

## Eyebrow

```text
Por que construir
```

## H2

```text
Mais do que publicar artigos: controlar toda a cadeia editorial.
```

## Parágrafos

```text
A plataforma nasceu da necessidade de publicar conteúdo técnico com identidade própria, bom desempenho, controle sobre os dados e liberdade para evoluir o processo editorial.
```

```text
Em vez de tratar o site apenas como uma vitrine, o projeto reúne conteúdo, administração, automações e infraestrutura em uma base que pode ser observada, testada e aprimorada continuamente.
```

```text
O objetivo não é reconstruir todas as ferramentas existentes, mas criar uma arquitetura adequada à estratégia editorial, à geração de autoridade e às futuras integrações da consultoria.
```

## Callout

Rótulo:

```text
Princípio
```

Texto:

```text
A plataforma deve evoluir sem comprometer o conteúdo já publicado.
```

---

# 4. Estado atual

## Eyebrow

```text
Estado atual
```

## H2

```text
O que já está entregue e o que ainda está em evolução.
```

## Introdução

```text
Cada capacidade possui um estado explícito. Funcionalidades planejadas não são apresentadas como se já estivessem disponíveis.
```

## Estados públicos

```text
Entregue
Em desenvolvimento
Planejado
Adiado
Removido
```

## Valores internos

```text
delivered
in_development
planned
deferred
removed
```

## Modelo

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

## Regra crítica

`delivered` exige:

- implementação;
- fluxo principal funcional;
- validação;
- verifiedAt;
- aprovação.

Não alterar estado por inferência.

---

# 5. Inventário inicial

## Entregue

### Site público em português

```text
Experiência editorial pública com Home, artigos, páginas institucionais e páginas de serviço.
```

### Publicação de artigos

```text
Listagem, categorias e páginas individuais para conteúdo técnico.
```

### Distribuição por CloudFront

```text
Entrega do conteúdo e dos assets por uma camada de distribuição na AWS.
```

### Infraestrutura como código

```text
Recursos de infraestrutura definidos e versionados com Terraform.
```

### Integração e entrega contínuas

```text
Pipelines no GitHub Actions para validação e publicação das mudanças.
```

## Em desenvolvimento

### Administração editorial separada

```text
Interface administrativa independente da experiência pública.
```

### Editor estruturado

```text
Evolução do editor para TipTap com blocos, callouts, código, tabelas e conteúdo versionável.
```

### Métricas editoriais

```text
Visualizações e sinais de interesse para apoiar decisões de conteúdo.
```

## Planejado

### Versão em inglês

```text
Publicação multilíngue com rotas, metadata, canonical e hreflang próprios.
```

### Tradução assistida por IA

```text
Geração de rascunho em inglês após decisão editorial, sempre com revisão humana.
```

### Publicação social com aprovação

```text
Geração de rascunhos e mídias para redes sociais com etapa explícita de aprovação.
```

### Processamento automático de imagens

```text
Geração de formatos otimizados e derivados adequados à web e às redes sociais.
```

### Newsletter

```text
Canal editorial opcional, condicionado a consentimento e infraestrutura específica.
```

### Licenciamento da plataforma

```text
Possibilidade futura de disponibilizar a base editorial como produto self-hosted ou serviço gerenciado.
```

## Divergência

Se o código real divergir:

- manter estado conservador;
- registrar divergência;
- não interromper o restante;
- não publicar promessa.

---

# 6. Arquitetura

## ID

```text
arquitetura
```

## Eyebrow

```text
Arquitetura
```

## H2

```text
Uma base serverless, versionada e orientada à automação.
```

## Introdução

```text
A plataforma separa a experiência pública, a administração editorial, os serviços de conteúdo e a infraestrutura. Essa separação permite evoluir cada parte com responsabilidades mais claras.
```

## Cinco camadas

### Experiência pública

```text
Aplicação web responsável pela navegação, descoberta e leitura do conteúdo, com foco em desempenho, SEO e acessibilidade.
```

Tags:

```text
Next.js
CloudFront
```

### Administração editorial

```text
Interface separada para criação, revisão, organização e publicação do conteúdo.
```

Tags:

```text
Admin separado
Conteúdo estruturado
```

### Serviços de conteúdo

```text
APIs e funções responsáveis por validar, armazenar e disponibilizar artigos, categorias, imagens e metadados.
```

Tags:

```text
API Gateway
Lambda
```

### Dados e mídia

```text
Persistência de metadados e conteúdo, com armazenamento de assets e derivados para distribuição.
```

Tags:

```text
DynamoDB
S3
```

### Infraestrutura e entrega

```text
Recursos versionados e pipelines responsáveis por validar e publicar mudanças de forma reproduzível.
```

Tags:

```text
Terraform
GitHub Actions
```

## Diagrama

Mostrar:

```text
Leitor → CloudFront → Aplicação pública → APIs → Serviços → Dados e mídia
```

```text
Admin → APIs → Serviços → Dados e mídia
```

Infraestrutura e CI/CD como camada transversal.

Pode usar HTML, CSS ou SVG acessível.

Não usar biblioteca.

Não exibir IDs, ARNs, contas, endpoints, tabelas, buckets ou regiões sensíveis.

---

# 7. Princípios de engenharia

## Eyebrow

```text
Princípios de engenharia
```

## H2

```text
A plataforma é construída para continuar compreensível enquanto evolui.
```

## Seis princípios

### Conteúdo como dado estruturado

```text
Artigos, metadados e blocos editoriais devem permanecer versionáveis, validáveis e independentes da apresentação final.
```

### Automação com controle

```text
Publicação, tradução e distribuição podem ser automatizadas, mas ações de maior impacto mantêm validação e aprovação explícitas.
```

### Infraestrutura reproduzível

```text
Mudanças na infraestrutura devem ser declaradas, revisadas e aplicadas por pipelines, evitando configuração manual como fonte de verdade.
```

### Evolução incremental

```text
Novas capacidades são incorporadas em ciclos completos e testáveis, sem transformar a base em uma sequência de exceções.
```

### Falhas observáveis

```text
Erros de publicação, integração ou processamento precisam gerar sinais claros para diagnóstico e correção.
```

### Custo proporcional ao uso

```text
A arquitetura prioriza serviços gerenciados e custos compatíveis com o volume real da plataforma.
```

---

# 8. Fluxo editorial e IA

## Eyebrow

```text
Fluxo editorial
```

## H2

```text
A IA participa do processo, mas não publica sozinha.
```

## Introdução

```text
A inteligência artificial pode acelerar tarefas editoriais, desde que o resultado permaneça como rascunho até ser revisado e aprovado.
```

## Etapas

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

## Callout

Rótulo:

```text
Responsabilidade editorial
```

Texto:

```text
O uso de IA não transfere a responsabilidade sobre o conteúdo, as fontes ou as decisões de publicação.
```

Não exibir:

- fornecedor;
- prompt;
- custo;
- percentual gerado;
- selo de IA.

---

# 9. Evolução

## Eyebrow

```text
Evolução
```

## H2

```text
O roadmap é orientado por valor editorial, não por quantidade de funcionalidades.
```

## Texto

```text
Novas capacidades entram no projeto quando melhoram a produção, a distribuição, a qualidade ou a sustentabilidade da plataforma. Ideias podem ser adiadas ou removidas quando não justificam a complexidade.
```

## Grupos

```text
Agora
Depois
Exploração
```

Mapeamento:

- Agora → `in_development`;
- Depois → `planned` prioritário;
- Exploração → `deferred`.

Regras:

- sem datas;
- sem percentual;
- sem “em breve”;
- removed fora do roadmap principal;
- não transformar roadmap em promessa comercial.

---

# 10. Bastidores

## Eyebrow

```text
Bastidores
```

## H2

```text
Decisões, erros e aprendizados documentados durante a construção.
```

## Consulta

Categoria:

```text
bastidores-projeto
```

Quantidade:

```text
até 6
```

Aplicar filtros públicos do Ajuste 15C.

## CTA com conteúdo

```text
Ver todos os bastidores
```

Destino:

```text
/categoria/bastidores-projeto
```

## Estado vazio

```text
Os bastidores serão publicados conforme as decisões e os aprendizados estiverem documentados.
```

CTA:

```text
Explorar todos os artigos
```

Destino:

```text
/artigos
```

---

# 11. CTA final

## Eyebrow

```text
Da plataforma à operação
```

## H2

```text
Precisa aplicar esse nível de engenharia a um problema da sua empresa?
```

## Texto

```text
Conheça as frentes de atuação da consultoria ou apresente o contexto que precisa evoluir.
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

Sem lista, badge ou formulário.

---

# 12. SEO

Title:

```text
O Projeto | Plataforma Editorial e Engenharia AWS
```

Description:

```text
Conheça a arquitetura, os princípios, o fluxo editorial e a evolução da plataforma construída por Marcelo Gonçalves como produto de engenharia.
```

Canonical:

```text
/o-projeto
```

JSON-LD somente se já existir infraestrutura.

Não adicionar métricas não verificadas.

---

# 13. Analytics

Somente se existir helper.

Eventos:

```text
project_page_view
project_architecture_click
project_article_click
project_cta_click
```

Propriedades permitidas:

- capabilityStatus;
- articleId;
- ctaType.

Sem PII.

---

# 14. Responsividade

Desktop:

- arquitetura em blocos;
- capacidades agrupadas por estado;
- princípios em grid;
- bastidores em cards.

Tablet:

- 2 colunas quando legível.

Mobile:

- 1 coluna;
- diagrama adaptável;
- sem overflow;
- CTAs empilhados;
- estados legíveis.

Validar zoom 200%.

---

# 15. Acessibilidade

- um H1;
- headings coerentes;
- diagrama com descrição textual;
- estado não depende apenas de cor;
- links com foco;
- CTAs acessíveis;
- chips legíveis;
- contraste AA;
- movimento reduzido;
- sem conteúdo essencial em hover.

---

# 16. Testes obrigatórios

Testar:

- cada status;
- delivered sem verifiedAt;
- link público;
- estado vazio;
- bastidores;
- diagrama;
- anchors;
- CTA;
- metadata;
- canonical;
- mobile;
- teclado;
- zoom;
- build.

---

# 17. Critérios de aceite

A página será aceita quando:

1. diferenciar entregue, desenvolvimento e planejamento;
2. não prometer datas;
3. não mostrar planejado como entregue;
4. arquitetura estiver correta e sanitizada;
5. IA for descrita como assistiva;
6. roadmap não for compromisso comercial;
7. bastidores usarem somente conteúdo público;
8. página parecer produto de engenharia, não documentação interna;
9. não houver preços, custos ou métricas inventadas;
10. funcionar em mobile e com teclado.
