variable "project_id" {
  description = "GCP Project ID"
  type        = string
}

variable "region" {
  description = "GCP region for resources"
  type        = string
  default     = "us-central1"
}

variable "environment" {
  description = "Environment (test or prod)"
  type        = string
  validation {
    condition     = contains(["test", "prod"], var.environment)
    error_message = "Environment must be 'test' or 'prod'."
  }
}

variable "image_url" {
  description = "Container image URL"
  type        = string
  default     = "gcr.io/cloudrun/hello"
}

variable "cpu_limit" {
  description = "CPU limit for Cloud Run service"
  type        = string
  default     = "1"
}

variable "memory_limit" {
  description = "Memory limit for Cloud Run service"
  type        = string
  default     = "1Gi"
}

variable "min_instances" {
  description = "Minimum number of instances"
  type        = string
  default     = "0"
}

variable "max_instances" {
  description = "Maximum number of instances"
  type        = string
  default     = "10"
}

variable "allow_unauthenticated" {
  description = "Allow unauthenticated access to Cloud Run service"
  type        = bool
  default     = true
}

variable "environment_variables" {
  description = "Environment variables for the Cloud Run service"
  type        = map(string)
  default     = {}
}

variable "secret_environment_variables" {
  description = "Secret environment variables from GCP Secret Manager (format: SECRET_NAME:VERSION)"
  type        = map(string)
  default     = {}
}

