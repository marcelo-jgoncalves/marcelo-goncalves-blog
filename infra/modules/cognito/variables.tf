
variable "project_name" {
  description = "Project name, used as prefix for resource naming (e.g. user pool name)"
  type        = string
}

variable "environment" {
  description = "Deployment environment (dev/prd), used as suffix for resource naming"
  type        = string
}
