# Ambientes

> last_verified: 2026-08-04

## Ambiente ativo

Apenas `dev`. Produção não existe ainda — quando existir, este documento passa a listar também `prd` e o fluxo de deploy de produção precisa ser reconstruído (ver `docs/operations/deployment.md`).

## Sistema ao vivo (dev)

| Serviço | URL |
|---|---|
| Site público | CloudFront (Home institucional em `/`, blog em `/blog`, contato em `/contato`) |
| Admin Vue | CloudFront (distribuição própria) |
| API Gateway | endpoint próprio, `v1` |

URLs exatas mudam quando o ambiente é recriado — consultar `terraform output` ou o pipeline de CD para o valor atual em vez de fixá-las em documentação. Evitar segredos e endpoints privados neste arquivo.

## AWS

- Profile local: `claude-dev` — sempre usar este.
- Terraform state: `s3://marcelo-goncalves-blog-dev-tfstate/blog/terraform.tfstate`.

## Branch por ambiente

`develop` → `dev` (push dispara CD automático). Não há branch/pipeline de produção no momento — ver `docs/operations/deployment.md`.
