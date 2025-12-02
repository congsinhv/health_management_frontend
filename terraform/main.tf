terraform {
  required_version = ">= 1.0"

  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }

  backend "gcs" {
    # Bucket and prefix are configured via backend-config in Jenkinsfile
    # -backend-config="bucket=${TF_BACKEND_BUCKET}"
    # -backend-config="prefix=terraform/state/${ENVIRONMENT}"
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}

# Enable required APIs
resource "google_project_service" "required_apis" {
  for_each = toset([
    "run.googleapis.com",
    "artifactregistry.googleapis.com",
    "compute.googleapis.com",
    "cloudresourcemanager.googleapis.com",
    "secretmanager.googleapis.com",
  ])

  project = var.project_id
  service = each.key

  disable_on_destroy = false
}

# Service Account for Cloud Run
# NOTE: The service account and its IAM bindings should be pre-created manually
# or by a separate Terraform configuration with elevated permissions.
# This data source references an existing service account.
data "google_service_account" "cloud_run_sa" {
  account_id = "vhealth-frontend-${var.environment}"
  project    = var.project_id
}

# IAM bindings for Service Account
# IMPORTANT: These require the Jenkins service account to have roles/resourcemanager.projectIamAdmin
# If you get 403 errors, grant the IAM roles manually via GCP Console or gcloud:
#   gcloud projects add-iam-policy-binding PROJECT_ID \
#     --member="serviceAccount:vhealth-frontend-ENV@PROJECT_ID.iam.gserviceaccount.com" \
#     --role="roles/secretmanager.secretAccessor"
#   gcloud projects add-iam-policy-binding PROJECT_ID \
#     --member="serviceAccount:vhealth-frontend-ENV@PROJECT_ID.iam.gserviceaccount.com" \
#     --role="roles/artifactregistry.reader"
resource "google_project_iam_member" "cloud_run_sa_roles" {
  for_each = var.manage_iam_bindings ? toset([
    "roles/secretmanager.secretAccessor",
    "roles/artifactregistry.reader",
  ]) : toset([])

  project = var.project_id
  role    = each.key
  member  = "serviceAccount:${data.google_service_account.cloud_run_sa.email}"
}

# Cloud Run Service
resource "google_cloud_run_service" "frontend" {
  name     = "vhealth-frontend-${var.environment}"
  location = var.region
  project  = var.project_id

  template {
    spec {
      containers {
        image = var.image_url

        ports {
          container_port = 8080
        }

        resources {
          limits = {
            cpu    = var.cpu_limit
            memory = var.memory_limit
          }
        }

        startup_probe {
          http_get {
            path = "/"
          }
          initial_delay_seconds = 0
          timeout_seconds       = 1
          period_seconds        = 3
          failure_threshold     = 10
        }

        env {
          name  = "NODE_ENV"
          value = var.environment == "prod" ? "production" : "development"
        }

        env {
          name  = "HOSTNAME"
          value = "0.0.0.0"
        }

        dynamic "env" {
          for_each = var.environment_variables
          content {
            name  = env.key
            value = env.value
          }
        }

        dynamic "env" {
          for_each = var.secret_environment_variables
          content {
            name = env.key
            value_from {
              secret_key_ref {
                name = env.value
                key  = "latest"
              }
            }
          }
        }
      }

      service_account_name = data.google_service_account.cloud_run_sa.email
    }

    metadata {
      annotations = {
        "autoscaling.knative.dev/minScale" = var.min_instances
        "autoscaling.knative.dev/maxScale" = var.max_instances
      }
    }
  }

  traffic {
    percent         = 100
    latest_revision = true
  }

  autogenerate_revision_name = true

  depends_on = [google_project_service.required_apis]
}

# IAM policy for public access
resource "google_cloud_run_service_iam_member" "public_access" {
  count = var.allow_unauthenticated ? 1 : 0

  service  = google_cloud_run_service.frontend.name
  location = google_cloud_run_service.frontend.location
  project  = var.project_id
  role     = "roles/run.invoker"
  member   = "allUsers"
}

# Artifact Registry Repository
# NOTE: Set manage_artifact_registry = false if the repository already exists
resource "google_artifact_registry_repository" "docker_repo" {
  count = var.manage_artifact_registry ? 1 : 0

  location      = var.region
  repository_id = "vhealth-frontend-${var.environment}"
  description   = "Docker repository for VHealth frontend - ${var.environment}"
  format        = "DOCKER"
  project       = var.project_id

  depends_on = [google_project_service.required_apis]
}

