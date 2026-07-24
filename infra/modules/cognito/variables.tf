
variable "project_name" {
  description = "Nome do projeto, usado como prefixo de nomenclatura de recursos (ex: user pool name)"
  type        = string
}

variable "environment" {
  description = "Ambiente de deploy (dev/prd), usado como sufixo de nomenclatura de recursos"
  type        = string
}