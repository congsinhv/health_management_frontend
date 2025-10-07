# Development Environment Configuration
environment = "dev"

# GCP Configuration
project_id = "vhealth-dev"
region     = "asia-southeast1"

# Resource Limits (smaller for dev)
cpu_limit    = "1"
memory_limit = "512Mi"

# Scaling Configuration (minimal for dev)
min_instances = "0"
max_instances = "3"

# Access Control
allow_unauthenticated = true

# Image Configuration (will be overridden by Jenkins)
image_url = "asia-southeast1-docker.pkg.dev/vhealth-dev/health-management-frontend-dev/health-frontend:latest"

# Environment Variables
environment_variables = {
  NODE_ENV                = "development"
  NEXT_TELEMETRY_DISABLED = "1"
}

# Secret Environment Variables (from GCP Secret Manager)
secret_environment_variables = {
  NEXT_PUBLIC_API_URL            = "next-public-api-url-dev"
  NEXT_PUBLIC_GOOGLE_CLIENT_ID   = "next-public-google-client-id-dev"
  NEXT_PUBLIC_GOOGLE_SECRET      = "next-public-google-secret-dev"
  NEXT_PUBLIC_GOOGLE_REDIRECT_URI = "next-public-google-redirect-uri-dev"
}

