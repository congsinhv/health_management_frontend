# Test Environment Configuration
environment = "test"

# GCP Configuration
project_id = "vhealth-test"
region     = "asia-southeast1"

# Resource Limits (smaller for test)
cpu_limit    = "1"
memory_limit = "512Mi"

# Scaling Configuration (minimal for test)
min_instances = "0"
max_instances = "3"

# Access Control
allow_unauthenticated = true

# Image Configuration
# NOTE: This is a fallback value. Jenkins pipeline will override this with the specific build-tagged image
# via: -var "image_url=${IMAGE_FULL}" in terraform plan/apply
image_url = "asia-southeast1-docker.pkg.dev/vhealth-test/vhealth-frontend-test/vhealth-frontend:latest"

# Environment Variables
environment_variables = {
  NODE_ENV                = "test"
  NEXT_TELEMETRY_DISABLED = "1"
}

# Secret Environment Variables (from GCP Secret Manager)
secret_environment_variables = {
  NEXT_PUBLIC_API_URL             = "vhealth-test-api-url"
  NEXT_PUBLIC_GOOGLE_CLIENT_ID    = "vhealth-test-google-client-id"
  NEXT_PUBLIC_GOOGLE_SECRET       = "vhealth-test-google-client-secret"
  NEXT_PUBLIC_GOOGLE_REDIRECT_URI = "vhealth-test-google-redirect-uri"
}

# Resource Management Flags
# Set to false because:
# - IAM bindings: Jenkins SA doesn't have roles/resourcemanager.projectIamAdmin
# - Artifact Registry: Repository already exists in GCP
manage_iam_bindings      = false
manage_artifact_registry = false

