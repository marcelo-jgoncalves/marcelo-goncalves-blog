# Auditoria de Engenharia — Critério 11: Developer Experience

> Data: 2026-06-27
> Escopo: onboarding rápido, ambiente reproduzível, setup automatizado.
> Apenas análise — nenhum código foi alterado nesta etapa.

## 🟡 Achados de impacto médio

### 1. A skill `dev-hub` — o próprio guia de onboarding do projeto — documenta variáveis de ambiente erradas para o admin

A skill `dev-hub` (criada para ser o centro de comando de desenvolvimento do monorepo) documenta, para configurar o admin localmente:

```
VITE_API_URL=...
VITE_ADMIN_ORIGIN=...
```

O código real (`admin/src/services/api.ts:5`: `import.meta.env.VITE_API_BASE_URL`) e o pipeline real (`.github/workflows/cd.yml:186-189`) usam:

```
VITE_API_BASE_URL=...
VITE_COGNITO_USER_POOL_ID=...
VITE_COGNITO_CLIENT_ID=...
VITE_ASSETS_URL=...
```

Nomes diferentes, e a skill nem menciona as duas variáveis de Cognito — sem elas, o Amplify Auth do admin não inicializa. Quem seguir a skill ao pé da letra para rodar o admin localmente vai precisar descobrir, por tentativa e erro, as variáveis certas. É um achado um pouco irônico: a ferramenta criada especificamente para reduzir fricção de onboarding tem, ela mesma, uma instrução desatualizada.

### 2. Sem `.env.example` para backend e admin

Só `frontend/.env.example` existe. Para rodar o admin localmente, as 4 variáveis necessárias (citadas acima) não têm nenhum template no repositório — duas delas (Cognito pool/client ID) não são descobríveis só lendo o código, exigem rodar `terraform output` ou perguntar a alguém.

### 3. Nenhum guia de onboarding escrito para humanos

`CLAUDE.md`/`docs/contract.md` são excelentes como documento operacional para um agente de IA com capacidade de ler o repositório inteiro — mas não substituem um `CONTRIBUTING.md` curto, pensado para um humano que abre o projeto por 5 minutos e precisa saber "como eu rodo isso na minha máquina". Hoje, sem ser o próprio Marcelo (ou uma IA com contexto completo), a curva de entrada é alta.

## 🟢 Pontos positivos (manter)

- **`frontend/.env.example` é um exemplo de DX bem feito**: comentários claros, e o valor de exemplo (`API_URL`) aponta direto para a API Gateway real de dev — um novo colaborador clona o repo, copia o arquivo, e já roda contra dados reais, sem precisar coordenar nada com ninguém.
- **`admin/src/services/api.ts:7`** já tem um toque de DX pensado: `if (import.meta.env.DEV && !API_URL) console.error('VITE_API_BASE_URL não definida!')` — expõe a configuração ausente imediatamente em vez de falhar de forma silenciosa/críptica mais tarde.
- **A ideia da skill `dev-hub` está certa** — centralizar servidores, testes, lint, build e fluxo de git num único lugar de referência para um monorepo de 3 workspaces é exatamente o tipo de investimento de DX que vale fazer. O achado aqui é sobre acurácia do conteúdo, não sobre o conceito.
- **Scripts de convenção na raiz** (`build:backend`, `build:frontend`, `build:admin`, `install:all`) já reduzem a fricção de "lembrar de entrar em 3 pastas" — incompletos (faltam `dev:*`/`test:all`), mas é uma base correta.

## Resumo

A experiência de desenvolvimento tem uma peça muito boa (o `.env.example` do frontend) e uma peça que precisa de atenção rápida (a skill de onboarding com variável errada para o admin) — exatamente o tipo de achado que é barato de corrigir e caro de deixar acumulando, porque cada nova sessão (humana ou de IA) que tentar seguir a skill desatualizada perde tempo do mesmo jeito.
