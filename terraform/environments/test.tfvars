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
  NEXT_PUBLIC_API_URL                      = "vhealth-test-api-url"
  NEXT_PUBLIC_GOOGLE_CLIENT_ID             = "vhealth-test-google-client-id"
  NEXT_PUBLIC_GOOGLE_SECRET                = "vhealth-test-google-client-secret"
  NEXT_PUBLIC_GOOGLE_REDIRECT_URI          = "vhealth-test-google-redirect-uri"
  NEXT_PUBLIC_FIREBASE_API_KEY             = "vhealth-test-firebase-api-key"
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN         = "vhealth-test-firebase-auth-domain"
  NEXT_PUBLIC_FIREBASE_PROJECT_ID          = "vhealth-test-firebase-project-id"
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET      = "vhealth-test-firebase-storage-bucket"
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = "vhealth-test-firebase-messaging-sender-id"
  NEXT_PUBLIC_FIREBASE_APP_ID              = "vhealth-test-firebase-app-id"
  NEXT_PUBLIC_FIREBASE_VAPID_KEY           = "vhealth-test-firebase-vapid-key"
}

# Resource Management Flags
# Set to false because:
# - IAM bindings: Jenkins SA doesn't have roles/resourcemanager.projectIamAdmin
# - Artifact Registry: Repository already exists in GCP
manage_iam_bindings      = false
manage_artifact_registry = false

