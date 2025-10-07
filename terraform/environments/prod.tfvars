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

# Image Configuration (will be overridden by Jenkins)
image_url = "asia-southeast1-docker.pkg.dev/vhealth-prod/health-management-prod/health-frontend:latest"

# Environment Variables
environment_variables = {
  NODE_ENV                = "production"
  NEXT_TELEMETRY_DISABLED = "1"
}

# Secret Environment Variables (from GCP Secret Manager)
secret_environment_variables = {
  NEXT_PUBLIC_API_URL            = "next-public-api-url-prod"
  NEXT_PUBLIC_GOOGLE_CLIENT_ID   = "next-public-google-client-id-prod"
  NEXT_PUBLIC_GOOGLE_SECRET      = "next-public-google-secret-prod"
  NEXT_PUBLIC_GOOGLE_REDIRECT_URI = "next-public-google-redirect-uri-prod"
}

