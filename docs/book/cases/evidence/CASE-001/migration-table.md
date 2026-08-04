# Tabela de migração — CASE-001

Reconstruída retrospectivamente a partir do conteúdo real do `CLAUDE.md` antes da refatoração (commit `060412f`, baseline deste caso) e do diff efetivamente aplicado — não é uma reconstrução inventada, mas também não foi mantida viva durante a execução original (ver limitação registrada no corpo do caso). Classificações conforme `docs/book/capture-protocol.md`, seção "Classificação das informações".

Movida para este arquivo separado (fora do corpo principal do `CASE-001`) por atender ao critério "tabela de migração extensa" de `docs/book/capture-protocol.md`, seção "Evidência de antes e depois" — 25 linhas, cobrindo todo o `CLAUDE.md` original.

| Seção ou conteúdo original | Classificação | Resultado | Destino canônico | Justificativa |
|---|---|---|---|---|
| §1 Contexto do Projeto — frase de abertura (tipo de sistema, papéis) | KEEP-SUMMARY | Reduzido a uma frase | `CLAUDE.md` §1 | Papel/autoridade é regra durável; racional completo não precisa estar sempre carregado |
| §1 Pivô estrutural da sessão 42 | HISTORICAL | Removido do CLAUDE.md | `docs/product/vision.md` (nota curta) + Git | Narrativa de mudança de rota, não regra atual |
| §1 Sistema ao vivo (URLs, indicação de pipeline verde) | TEMPORARY | Migrado | `docs/operations/environments.md` | Muda quando o ambiente é recriado; não é regra durável |
| §1 Arquivos de contexto obrigatórios | MOVE | Consolidado | `CLAUDE.md` §10 (mapa de fontes canônicas) | Redundante com a tabela de mapa nova |
| §2 Modo de Operação — papéis, ciclos pequenos | KEEP | Mantido | `CLAUDE.md` §1/§2 | Regra durável central, sem detalhe a mover |
| §2 Princípios de design (DRY/KISS/YAGNI) | KEEP-SUMMARY | Resumido a 1 regra + link | `docs/engineering/standards/engineering-principles.md` | Racional e exemplos são detalhe; o "aplicar com julgamento" é o invariante |
| §2 Protocolo de início de sessão | KEEP-SUMMARY | Resumido | `CLAUDE.md` §3 | Passos operacionais atemporais, cabem em poucas linhas |
| §2 Antes de qualquer commit | KEEP | Incorporado | `CLAUDE.md` §6 (critérios de conclusão) | Consolidado com a regra de validação proporcional ao risco, evitando duas seções sobre o mesmo tema |
| §2 Protocolos de Feedback (Analysis vs Action, Questions Only, Incremental Investigation) | KEEP-SUMMARY | Resumido a 3 bullets | `docs/engineering/standards/ai-assisted-workflow.md` | Regra durável, mas exemplos extensos não precisam estar sempre carregados |
| §2 Captura de aprendizado para o livro | KEEP | Preservado quase integralmente | `CLAUDE.md` §11 | Já era um resumo operacional desde a Etapa 5 deste mesmo processo; sem mudança de conteúdo, só de posição — ver Exemplo representativo 3 no corpo do caso |
| §2 Regra de Bash | KEEP | Reduzido (tabela → texto curto) | `CLAUDE.md` §7 | Restrição crítica da ferramenta, afeta toda sessão — mas a tabela de exemplos era maior que o necessário |
| §2 Convenção de nomenclatura (idioma) | KEEP-SUMMARY | Resumido | `docs/engineering/standards/code-conventions.md` | Regra dura (código=inglês/dado=português) cabe em 1 linha; exceções e racional são detalhe |
| §2 Comentário "why not what" | KEEP-SUMMARY | Resumido | `docs/engineering/standards/code-conventions.md` | Mesma lógica acima |
| §3 Arquitetura (árvore de pastas comentada) | MOVE | Substituído por 1 linha de mapa | `docs/architecture/system-overview.md` | Estrutura de diretório é derivável do próprio repositório |
| §4 Regras Críticas (Next.js/OpenNext/DynamoDB/Backend/Sharp/env vars/CORS/CloudFront/SEO dev) | MOVE | Consolidado numa seção própria | `docs/architecture/system-overview.md` ("Invariantes críticos transversais") | Gotchas cross-componente — ver Exemplo representativo 2 no corpo do caso |
| §5 Design System (fontes, paleta, escalas, botões, CSS Modules, enforcement Stylelint) | MOVE | Migrado por completo | `frontend/docs/design-system.md` | Valores hex/escala completos são deriváveis do CSS; a regra operacional ("usar tokens") ficou resumida no CLAUDE.md — ver Exemplo representativo 1 no corpo do caso |
| §6 Imagens (pipeline de upload, assets estáticos) | MOVE | Migrado por completo | `frontend/docs/image-pipeline.md` | Detalhe de componente específico, não invariante de todo o projeto |
| §7 Testes — suítes por workspace, validação por nível de risco | MOVE | Migrado | `docs/engineering/standards/testing-strategy.md` | Contagens de teste são deriváveis; a estratégia de nível de risco é regra, mas detalhada demais para o CLAUDE.md |
| §7 Vulnerabilidades residuais aceitas | TEMPORARY | Migrado | `docs/operations/known-issues.md` | Estado atual de risco operacional, não regra de comportamento |
| §7 Estratégia de registro em contexto/memória (meta-regra) | MOVE | Incorporado | `docs/README.md` (política de fonte canônica) + `CLAUDE.md` §12 (regra de manutenção) | Mesmo princípio da regra de manutenção nova — duplicar seria redundante |
| §8 Commits e Pipeline (branch, Conventional Commits, estrutura de PR) | KEEP-SUMMARY + MOVE | Resumido no CLAUDE.md, detalhe migrado | `CLAUDE.md` §9 + `docs/engineering/standards/git-and-review-workflow.md` | Estratégia resumida é regra durável; passo a passo de PR/revisão é detalhe operacional |
| §8 Pipeline CD / regra de `terraform apply` só via pipeline | TEMPORARY | Migrado | `docs/operations/deployment.md` | Estado operacional do fluxo de deploy, não regra de comportamento da IA em geral |
| §9 JSON-LD por tipo de página | MOVE | Migrado | `frontend/docs/seo.md` | Matriz é regra do frontend público, não do agente em geral |
| §10 Backlog Atual (link para `docs/backlog.md`) | KEEP-SUMMARY | Preservado como 1 linha de mapa | `CLAUDE.md` §10 (mapa) — `docs/backlog.md` inalterado | Já era só um ponteiro antes desta tarefa (extraído em 2026-08-02); nada a migrar além do ponteiro |
| §11 Dependências Críticas (tabela de versões exatas) | DERIVED | Removido | `package.json`/lockfiles/Terraform; nota em `docs/architecture/system-overview.md` | Versão exata é fato derivável, muda com frequência maior do que a revisão deste documento |

Nenhuma linha foi classificada `UNKNOWN` ou `CONFLICT` — não foi identificado, durante esta reconstrução, nenhum bloco do `CLAUDE.md` original sem destino determinável, nem contradição interna real entre seções.
