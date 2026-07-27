# Ajuste 17 — Índice e subdivisão da camada global

## 0. Situação do documento anterior

O arquivo:

```text
ajuste-17-navegacao-rodape-legais-cookies-producao.md
```

fica oficialmente substituído por esta subdivisão e não deverá ser utilizado como instrução de implementação.

O documento anterior reuniu responsabilidades diferentes demais em uma única rodada:

- navegação;
- rodapé;
- documentos jurídicos;
- cookies;
- analytics;
- SEO;
- redirects;
- segurança;
- observabilidade;
- preparação para produção.

A nova estrutura separa cada responsabilidade para permitir análise, implementação, testes e revisão mais cuidadosos.

---

# 1. Documentos oficiais do Ajuste 17

## 1.1. Ajuste 17A — Navegação global

Arquivo previsto:

```text
ajuste-17a-navegacao-global.md
```

Escopo:

- cabeçalho desktop;
- menu principal;
- dropdown de Serviços;
- estado ativo;
- navegação mobile;
- drawer;
- foco;
- teclado;
- responsividade;
- comportamento sticky;
- links globais;
- testes de navegação.

Não inclui:

- rodapé;
- cookies;
- documentos legais;
- SEO global;
- produção.

---

## 1.2. Ajuste 17B — Rodapé global

Arquivo previsto:

```text
ajuste-17b-rodape-global.md
```

Escopo:

- estrutura visual;
- marca e posicionamento;
- coluna de serviços;
- coluna de navegação;
- contato;
- localização;
- links legais;
- preferências de cookies;
- voltar ao topo;
- responsividade;
- acessibilidade;
- testes.

Não inclui:

- conteúdo integral das páginas legais;
- implementação do painel de cookies;
- header.

---

## 1.3. Ajuste 17C — Aviso de Privacidade

Arquivo previsto:

```text
ajuste-17c-aviso-privacidade.md
```

Escopo:

- estrutura da página;
- controlador;
- dados coletados;
- formulário;
- finalidades;
- bases legais;
- confirmação por e-mail;
- logs;
- retenção;
- fornecedores;
- transferência internacional;
- direitos;
- decisões automatizadas;
- crianças;
- atualização;
- coerência com o Ajuste 14.

Não inclui:

- Política de Cookies;
- Termos de Uso;
- configuração técnica do GA4.

---

## 1.4. Ajuste 17D — Cookies, consentimento e analytics

Arquivo previsto:

```text
ajuste-17d-cookies-consentimento-analytics.md
```

Escopo:

- Política de Cookies;
- inventário real;
- categorias;
- cookie de preferência;
- banner;
- painel de preferências;
- aceitar;
- rejeitar;
- retirada;
- Google Analytics 4;
- ausência de PII;
- Consent Mode;
- acessibilidade;
- testes em sessão limpa.

Não inclui:

- Aviso de Privacidade completo;
- Termos de Uso;
- segurança global da plataforma.

---

## 1.5. Ajuste 17E — Termos de Uso

Arquivo previsto:

```text
ajuste-17e-termos-de-uso.md
```

Escopo:

- finalidade do site;
- conteúdo editorial;
- conteúdo técnico;
- inteligência artificial;
- investimentos;
- páginas de serviços;
- formulário;
- conteúdo enviado;
- propriedade intelectual;
- condutas proibidas;
- indisponibilidade;
- links externos;
- limitações;
- legislação e foro;
- estrutura visual da página.

Não inclui:

- banner de cookies;
- campos detalhados do formulário;
- políticas internas de segurança.

---

## 1.6. Ajuste 17F — SEO global, domínio, redirects e páginas de erro

Arquivo previsto:

```text
ajuste-17f-seo-dominio-redirects-erros.md
```

Escopo:

- domínio principal;
- canonical base;
- redirects;
- sitemap;
- robots;
- metadados globais;
- Open Graph;
- página 404;
- página 500;
- rotas legais;
- migração da URL CloudFront;
- Search Console;
- validação de links;
- testes de status HTTP.

Não inclui:

- Content Security Policy;
- WAF;
- observabilidade;
- consentimento.

---

## 1.7. Ajuste 17G — Segurança, observabilidade e preparação para produção

Arquivo previsto:

```text
ajuste-17g-seguranca-observabilidade-producao.md
```

Escopo:

- Content Security Policy;
- headers de segurança;
- HSTS;
- Permissions Policy;
- WAF;
- rate limiting;
- SES;
- SPF;
- DKIM;
- DMARC;
- logs;
- métricas;
- alarmes;
- inventário de fornecedores;
- matriz de coerência jurídica;
- bloqueios de deploy;
- homologação;
- checklist final de produção.

Não inclui:

- textos completos das páginas legais;
- layout do header;
- layout do footer.

---

# 2. Ordem recomendada de trabalho

Executar nesta ordem:

1. **17A — Navegação global**
2. **17B — Rodapé global**
3. **17C — Aviso de Privacidade**
4. **17D — Cookies, consentimento e analytics**
5. **17E — Termos de Uso**
6. **17F — SEO global, domínio, redirects e erros**
7. **17G — Segurança, observabilidade e produção**

A ordem separa:

- primeiro a interface global;
- depois os documentos e escolhas do visitante;
- por último a infraestrutura e os controles de produção.

---

# 3. Regras de execução

Cada subajuste deverá:

- analisar apenas seu próprio escopo;
- conter textos finais quando aplicável;
- especificar componentes;
- definir comportamento desktop e mobile;
- tratar acessibilidade;
- definir estados e erros;
- listar remoções;
- incluir testes;
- incluir critérios de aceite;
- incluir checklist de revisão humana;
- não incorporar funcionalidades de outro subajuste sem referência explícita.

---

# 4. Regra de precedência

Em caso de conflito:

1. os arquivos 17A a 17G prevalecem dentro de seus respectivos escopos;
2. este índice prevalece sobre o Ajuste 17 unificado anterior;
3. o Ajuste 14 prevalece sobre o formulário de contato;
4. os Ajustes 15A a 15D prevalecem sobre o sistema editorial;
5. o Ajuste 16 prevalece sobre a página central de Serviços;
6. o Ajuste 13 prevalece sobre métricas, provas e estudos de caso.

---

# 5. Critério de conclusão

O Ajuste 17 somente poderá ser considerado concluído quando os sete documentos tiverem sido:

- especificados;
- implementados;
- testados;
- revisados visualmente;
- validados em mobile;
- validados por teclado;
- revisados quanto à coerência entre código e conteúdo;
- aprovados para produção.

A conclusão de um subajuste não autoriza marcar os demais como concluídos.
