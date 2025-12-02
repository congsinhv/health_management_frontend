# Production Environment Configuration
environment = "prod"

# GCP Configuration
project_id = "vhealth-prod"
region     = "asia-southeast1"

# Resource Limits (optimized for production)
cpu_limit    = "2"
memory_limit = "1Gi"

# Scaling Configuration (production scale)
min_instances = "1"
max_instances = "10"

# Access Control
allow_unauthenticated = true

# Image Configuration
# NOTE: This is a fallback value. Jenkins pipeline will override this with the specific build-tagged image
# via: -var "image_url=${IMAGE_FULL}" in terraform plan/apply
image_url = "asia-southeast1-docker.pkg.dev/vhealth-prod/vhealth-frontend-prod/vhealth-frontend:latest"

# Environment Variables
environment_variables = {
  NODE_ENV                = "production"
  NEXT_TELEMETRY_DISABLED = "1"
}

# Secret Environment Variables (from GCP Secret Manager)
secret_environment_variables = {
  NEXT_PUBLIC_API_URL             = "vhealth-prod-api-url"
  NEXT_PUBLIC_GOOGLE_CLIENT_ID    = "vhealth-prod-google-client-id"
  NEXT_PUBLIC_GOOGLE_SECRET       = "vhealth-prod-google-client-secret"
  NEXT_PUBLIC_GOOGLE_REDIRECT_URI = "vhealth-prod-google-redirect-uri"
}

# Resource Management Flags
# Set to false because:
# - IAM bindings: Jenkins SA doesn't have roles/resourcemanager.projectIamAdmin
# - Artifact Registry: Repository already exists in GCP
manage_iam_bindings      = false
manage_artifact_registry = false

