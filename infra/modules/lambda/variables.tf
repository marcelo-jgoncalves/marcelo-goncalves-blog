variable "project_name" {}
variable "environment" {}
variable "posts_table_arn" {}
variable "autores_table_arn" {}
variable "uploads_bucket_name" {}
variable "uploads_bucket_arn" {}

variable "categorias_table_name" {
  type        = string
  description = "Nome da tabela de categorias"
}

variable "categorias_table_arn" {
  type        = string
  description = "ARN da tabela de categorias para permissões IAM"
}