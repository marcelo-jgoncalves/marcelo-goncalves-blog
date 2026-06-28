# Auditoria AppSec — Categoria 3: Criptografia, Comunicação e Configuração

> Data: 2026-06-28
> Referência: OWASP ASVS V6 (Criptografia), V9 (Comunicação), V10 (Configuração)
> Escopo: `infra/modules/frontend/s3.tf`, `infra/modules/media/s3.tf`, `infra/modules/*/cloudfront.tf`, DynamoDB (verificado via AWS CLI).
> Apenas análise — nenhum código foi alterado nesta etapa.

## 🟡 Achados de impacto médio

### 1. CloudFront usa certificado default — impede fixar versão mínima de TLS moderna

As duas distributions (`admin`, `frontend`) declaram `viewer_certificate { cloudfront_default_certificate = true }`. Esse modo só é compatível com a política de protocolo padrão da AWS — **não é possível** declarar `minimum_protocol_version = "TLSv1.2_2021"` (a recomendação atual) junto com certificado default; isso só fica disponível ao usar um certificado ACM customizado com SNI. Hoje isso está bloqueado por uma dependência já conhecida do backlog (domínio definitivo ainda não configurado) — não é um achado novo, é a formalização do motivo técnico exato do bloqueio.

### 2. DynamoDB sem criptografia em repouso declarada explicitamente no Terraform

Nenhuma das 3 tabelas (`infra/modules/dynamodb/main.tf`) declara `server_side_encryption`. Confirmado via AWS CLI (`describe-table` → `SSEDescription: null`) que a tabela está usando o comportamento **default** da AWS — que desde 2018 criptografa todas as tabelas em repouso automaticamente com uma chave **AWS-owned** (gratuita, mas sem visibilidade de uso via CloudTrail/KMS e sem possibilidade de revogar acesso via política de chave). Não há exposição de dados em texto claro — é uma lacuna de **explicitação e auditabilidade**, não uma vulnerabilidade de dados em si. Migrar para uma chave AWS-managed (KMS, ainda gratuita) daria visibilidade de uso sem custo adicional.

## 🟢 Pontos positivos (manter)

- **CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy e Strict-Transport-Security agora são headers HTTP reais** via `aws_cloudfront_response_headers_policy` (sessão 53) — substituiu `<meta>` tags não-funcionais no admin e preencheu o gap de CSP que não existia no frontend. Validado em produção (dev) via `curl` real.
- `frontend_assets`/`assets` (S3) têm `aws_s3_bucket_server_side_encryption_configuration` explícito (AES256), `aws_s3_bucket_versioning` habilitado, `aws_s3_bucket_public_access_block` com os 4 flags `true`, e política restrita a `cloudfront.amazonaws.com` via OAC com `SourceArn` condicionado à distribution exata — não há acesso público direto possível.
- `uploads-raw` (S3) também com `public_access_block` completo e CORS restrito aos domínios reais (sessão 51) — sem wildcard `*`.
- IAM least-privilege por Lambda (sessão 52) elimina superexposição de permissões que poderia agravar qualquer vazamento de credencial.
- Toda comunicação browser↔CloudFront↔origem já é HTTPS-only (`viewer_protocol_policy = "redirect-to-https"` em todos os `cache_behavior`), e a origem Lambda usa `origin_ssl_protocols = ["TLSv1.2"]` explicitamente.

## Resumo

Esta categoria já recebeu a maior parte de sua correção real na sessão imediatamente anterior (headers de segurança via CloudFront). Os dois achados restantes são de baixo risco prático imediato e ambos têm a mesma natureza: dependem de uma pré-condição externa (domínio definitivo para TLS moderno; decisão de custo/visibilidade para KMS) — não são bugs, são lacunas de explicitação que vale fechar quando a pré-condição existir.
