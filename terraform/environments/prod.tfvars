# Production Environment Configuration
environment = "prod"

# GCP Configuration
project_id = "vhealth-prod"
region     = "asia-southeast1"

# Resource Limits (optimized for production)
cpu_limit    = "2"
memory_limit = "1Gi"

# Scaling Configuration (production scale)
min_instances = 1
max_instances = 10

# Access Control
allow_unauthenticated = true

# Image Configuration (will be updated by Jenkins after docker build)
image_url = "asia-southeast1-docker.pkg.dev/vhealth-prod/health-management-frontend-prod/health-frontend:latest"

# Environment Variables
environment_variables = {
  NODE_ENV                = "production"
  NEXT_TELEMETRY_DISABLED = "1"
}

# Secret Environment Variables (from GCP Secret Manager)
secret_environment_variables = {
  NEXT_PUBLIC_API_URL             = "prod-api-url:latest"
  NEXT_PUBLIC_GOOGLE_CLIENT_ID    = "prod-google-client-id:latest"
  NEXT_PUBLIC_GOOGLE_SECRET       = "prod-google-client-secret:latest"
  NEXT_PUBLIC_GOOGLE_REDIRECT_URI = "prod-google-redirect-uri:latest"
}

