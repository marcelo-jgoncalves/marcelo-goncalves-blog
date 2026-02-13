variable "project_name" {}
variable "environment" {}
variable "aws_region" {}
variable "get_post_invoke_arn" {}
variable "get_post_function_name" {}
variable "get_author_invoke_arn" {}
variable "get_author_function_name" {}
variable "cognito_user_pool_arn" {}
variable "admin_posts_invoke_arn" {}
variable "admin_posts_function_name" {}
variable "media_upload_invoke_arn" {}
variable "media_upload_function_name" {}
variable "get_posts_invoke_arn" {}
variable "get_posts_function_name" {}
variable "admin_authors_invoke_arn" {}
variable "admin_authors_function_name" {}
variable "admin_categories_invoke_arn" {
  type = string
}

variable "admin_categories_function_name" {
  type = string
}