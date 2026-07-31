output "api_url" {
  description = "Full invoke URL of the API Gateway stage"
  value       = aws_api_gateway_stage.main.invoke_url
}

# Domínio + path do stage, separados (não o invoke_url inteiro) — usados pelo
# CloudFront do admin para montar um origin (domain_name) + origin_path,
# proxyando /admin/* same-origin em vez de CORS cross-origin.
output "api_gateway_domain_name" {
  description = "Bare execute-api domain name of the API Gateway (no protocol, no stage path)"
  value       = "${aws_api_gateway_rest_api.main.id}.execute-api.${var.aws_region}.amazonaws.com"
}

output "api_gateway_stage_path" {
  description = "Stage path prefix of the API Gateway (e.g. /v1)"
  value       = "/${aws_api_gateway_stage.main.stage_name}"
}