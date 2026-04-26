# Permissions Analysis — Autonomous Engineering Agent
**Data:** 2026-04-26  
**Contexto:** Análise de permissões mínimas para operação autônoma do agente de engenharia no projeto Blog Marcelo Gonçalves.

---

## 1. Princípios Aplicados

| Princípio | Aplicação |
|---|---|
| Least Privilege | Cada permissão justificada individualmente; nada "just in case" |
| No Long-Lived Credentials | AWS via OIDC no CI/CD; sem access keys no código ou .env commitados |
| Auditability | Todos os acessos logados via CloudTrail (AWS) e GitHub Audit Log |
| Read-Only by Default | Permissões de escrita separadas e restritas a contextos de deploy |
| Zero Trust | Nunca assume que um recurso existe; sempre valida antes de alterar |

---

## 2. Permissões GitHub

### 2.1 Token Scopes

| Scope | Justificativa | Risco | Alternativa |
|---|---|---|---|
| `repo` | Push de código, criação de branches, abertura de PRs, leitura de issues | Médio — acesso total ao repositório | Sem alternativa para operação de PR |
| `workflow` | Trigger e monitoramento de GitHub Actions | Médio — pode executar workflows | Limitar com `workflow:read` quando apenas monitorando |
| `read:org` | Verificar políticas e membros da organização | Baixo — somente leitura | Pode ser removido se não houver org |

### 2.2 CLI Capabilities

| Comando | Uso | Risco |
|---|---|---|
| `gh run list` | Monitorar status de pipelines após push | Baixo (read) |
| `gh run view` | Ver detalhes e logs de pipeline | Baixo (read) |
| `gh run watch` | Aguardar conclusão de pipeline | Baixo (read) |
| `gh pr create` | Abrir PR após ciclo de desenvolvimento | Médio (cria objeto no repo) |
| `gh secret set` | Configurar secrets de CI/CD (ex: AWS role ARN) | Alto — acesso a secrets do repo |
| `gh variable set` | Configurar variáveis de ambiente do CI/CD | Médio |
| `gh workflow run` | Disparar workflow manualmente | Médio — pode causar deploys |

**Recomendação:** `gh secret set` deve ser usado apenas uma vez para configuração inicial. Documentar secrets configurados em `docs/`.

---

## 3. Permissões AWS

### 3.1 Operações Read-Only (Validação e Observabilidade)

| Permissão | Recurso Alvo | Justificativa |
|---|---|---|
| `sts:GetCallerIdentity` | `*` | Confirmar identidade antes de qualquer operação |
| `s3:ListBucket` | Buckets do projeto | Validar existência de buckets antes de sync |
| `s3:GetObject` | Buckets do projeto | Ler artefatos de build gerados |
| `lambda:ListFunctions` | Lambdas do projeto | Verificar estado das funções |
| `lambda:GetFunction` | Lambdas do projeto | Validar versão deployada |
| `logs:DescribeLogGroups` | `/aws/lambda/*-blog-*` | Listar grupos de logs existentes |
| `logs:GetLogEvents` | Grupos de logs do projeto | Ler logs para debugging |
| `logs:FilterLogEvents` | Grupos de logs do projeto | Filtrar erros em logs |
| `dynamodb:DescribeTable` | Tabelas do projeto | Validar schema e GSIs |
| `dynamodb:ListTables` | `*` | Confirmar tabelas criadas |
| `apigateway:GET` | APIs do projeto | Validar endpoints configurados |
| `cloudfront:GetDistribution` | Distribuições do projeto | Validar configuração de CloudFront |
| `cognito-idp:DescribeUserPool` | User Pool do projeto | Validar configuração de autenticação |

### 3.2 Operações de Deploy (Apenas em Contexto CI/CD)

| Permissão | Recurso Alvo | Justificativa | Risco |
|---|---|---|---|
| `s3:PutObject` | `assets-bucket/` e `admin-bucket/` | Sync de build do frontend e admin | Médio — pode sobrescrever assets |
| `lambda:UpdateFunctionCode` | Lambdas do projeto | Deploy de novo código | Alto — afeta produção |
| `lambda:UpdateFunctionConfiguration` | Lambdas do projeto | Atualizar env vars | Alto — afeta produção |
| `cloudfront:CreateInvalidation` | Distribuição do frontend | Invalidar cache após deploy | Baixo — só afeta cache |
| `iam:PassRole` | Execution role do Terraform | Terraform assume role para apply | Alto — escopo deve ser restrito à role específica |

**Recomendação:** Todas as permissões de deploy devem ser concedidas apenas à IAM Role assumida via OIDC pelo GitHub Actions (`GitHubActions-Terraform-Role-Dev`/`Prod`). O agente local NUNCA deve ter permissões de escrita diretamente.

### 3.3 Permissões Não Necessárias (Proibidas)

| Permissão | Motivo da Exclusão |
|---|---|
| `iam:CreateRole`, `iam:AttachPolicy` | Terraform faz isso via role com trust policy; agente não precisa criar IAM diretamente |
| `dynamodb:DeleteTable` | Operação destrutiva; protegida por `prevent_destroy` no Terraform |
| `s3:DeleteBucket` | Operação destrutiva não programática |
| `cognito-idp:DeleteUserPool` | Operação destrutiva crítica |
| `ec2:*` | Projeto não usa EC2 |
| `AdministratorAccess` | Violação absoluta do Least Privilege |

---

## 4. Ambiente Local

### 4.1 Ferramentas Necessárias

| Ferramenta | Versão | Justificativa |
|---|---|---|
| `git` | >=2.40 | Versionamento e push |
| `gh` | >=2.40 | GitHub CLI para pipeline monitoring |
| `aws-cli` | >=2.0 | Validação de infraestrutura |
| `node` | >=20 | Build do backend (Lambda) e frontend |
| `npm` | >=10 | Gerenciamento de dependências |
| `terraform` | >=1.8 | IaC apply e validate |
| `zip` | qualquer | Empacotamento das Lambdas (build.js) |

### 4.2 Configurações Locais (Não Commitadas)

| Arquivo | Conteúdo | Gitignore? |
|---|---|---|
| `infra/env/dev.tfvars` | Variáveis de ambiente dev | ✅ Sim |
| `infra/env/prd.tfvars` | Variáveis de ambiente prod | ✅ Sim |
| `frontend/.env.local` | `NEXT_PUBLIC_API_URL` | ✅ Sim |
| `admin/.env.local` | `VITE_API_BASE_URL`, `VITE_COGNITO_*`, `VITE_ASSETS_URL` | ✅ Sim |
| `~/.aws/credentials` | Perfil `devops-blog-dev` | Fora do repo |

---

## 5. Análise de Risco por Operação

### Alto Risco
- **Terraform apply em prod**: Requer aprovação manual (job de aprovação no GitHub Actions)
- **Lambda UpdateFunctionCode em prod**: Potencial downtime
- **gh secret set**: Configura secrets permanentes no repo

### Médio Risco
- **Push para main**: Aciona workflow de prod (com pausa para aprovação)
- **s3 sync em prod**: Sobrescreve assets; requer invalidação de CloudFront

### Baixo Risco
- **Leitura de logs e estado**: Sem side effects
- **gh run list/view**: Somente leitura
- **terraform plan**: Dry-run, sem alterações

---

## 6. Configuração OIDC (Recomendada para CI/CD)

O arquivo `docs/oidc.yaml.txt` no repositório documenta o setup OIDC necessário. O padrão correto:

```hcl
# Terraform: IAM Role para GitHub Actions
resource "aws_iam_role" "github_actions" {
  name = "GitHubActions-Terraform-Role-Dev"
  
  assume_role_policy = jsonencode({
    Statement = [{
      Principal = { Federated = "arn:aws:iam::ACCOUNT:oidc-provider/token.actions.githubusercontent.com" }
      Condition = {
        StringEquals = { "token.actions.githubusercontent.com:sub": "repo:marcelo-jgoncalves/marcelo-goncalves-blog:ref:refs/heads/develop" }
      }
    }]
  })
}
```

**Vantagem:** Sem access keys estáticas. Token temporário gerado por request, auditável via CloudTrail.

---

## 7. Recomendações de Segurança

1. **Configurar AWS profile `devops-blog-dev` localmente** com permissões read-only para validação. Permissões de deploy somente via OIDC no CI/CD.
2. **Nunca usar `AdministratorAccess`** em nenhum contexto, mesmo dev.
3. **Habilitar CloudTrail** na conta AWS para auditabilidade completa de todas as operações.
4. **Rotacionar AWS access keys** se atualmente configuradas como long-lived; migrar para OIDC.
5. **Revisar GitHub Personal Access Token**: scope mínimo necessário (`repo` + `workflow`); expiração de 90 dias.
6. **Adicionar environment protection rules** no GitHub: branch `main` requer aprovação antes de deploy em prod.

---

## 8. Estado Atual

| Ferramenta | Status |
|---|---|
| Git local | ✅ Configurado |
| GitHub CLI (`gh`) | ✅ Autenticado como `marcelo-jgoncalves` |
| AWS CLI | ⚠️ Instalado mas sem perfil `devops-blog-dev` configurado |
| Node/npm | ✅ v24.15.0 / v11.12.1 |
| Terraform | ❓ Não verificado no PATH local |

**Ação necessária:** Configurar perfil AWS `devops-blog-dev` localmente para habilitar validação de infra. Ver `docs/oidc.yaml.txt` para setup da role.
