output "cloud_run_url" {
  description = "URL of the Cloud Run service"
  value       = google_cloud_run_service.frontend.status[0].url
}

output "service_name" {
  description = "Name of the Cloud Run service"
  value       = google_cloud_run_service.frontend.name
}

output "cloud_run_service_name" {
  description = "Cloud Run service name (alias for compatibility)"
  value       = google_cloud_run_service.frontend.name
}

output "service_account_email" {
  description = "Email of the service account"
  value       = google_service_account.cloud_run_sa.email
}

output "cloud_run_service_account_email" {
  description = "Cloud Run service account email (alias for compatibility)"
  value       = google_service_account.cloud_run_sa.email
}

output "artifact_registry_url" {
  description = "Artifact Registry URL"
  value       = "${var.region}-docker.pkg.dev/${var.project_id}/${google_artifact_registry_repository.docker_repo.repository_id}"
}

output "artifact_registry_repository" {
  description = "Artifact Registry repository ID"
  value       = google_artifact_registry_repository.docker_repo.repository_id
}

output "environment" {
  description = "Current environment"
  value       = var.environment
}

output "region" {
  description = "GCP region"
  value       = var.region
}

output "project_id" {
  description = "GCP project ID"
  value       = var.project_id
}

