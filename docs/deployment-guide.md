# VHealth - Deployment Guide

**Project:** health_management_frontend
**Deployment Target:** Google Cloud Run (serverless)
**Infrastructure:** Terraform + Jenkins CI/CD
**Last Updated:** December 2025

---

## Table of Contents

1. [Environment Setup](#environment-setup)
2. [Docker Build Process](#docker-build-process)
3. [Terraform Configuration](#terraform-configuration)
4. [Jenkins CI/CD Pipeline](#jenkins-cicd-pipeline)
5. [Deployment Instructions](#deployment-instructions)
6. [Post-Deployment Verification](#post-deployment-verification)
7. [Monitoring & Troubleshooting](#monitoring--troubleshooting)
8. [Rollback Procedures](#rollback-procedures)
9. [Disaster Recovery](#disaster-recovery)

---

## Environment Setup

### Prerequisites

**Required Software:**

```bash
# GCP CLI
gcloud --version  # v466+

# Docker
docker --version  # 24.0+

# Terraform
terraform --version  # 1.5+

# Bun (for local development)
bun --version  # 1.2+
```

**GCP Setup:**

```bash
# Initialize GCP CLI
gcloud init

# Set default project
gcloud config set project vhealth-prod  # or vhealth-test

# Authenticate
gcloud auth login
gcloud auth application-default login
```

### Environment Configuration

#### Test Environment Variables

```env
# .env.test
ENVIRONMENT=test
GCP_PROJECT_ID=vhealth-test
REGION=asia-southeast1
ARTIFACT_REGISTRY=asia-southeast1-docker.pkg.dev
CLOUD_RUN_SERVICE=vhealth-frontend-test
MIN_INSTANCES=0
MAX_INSTANCES=3
MEMORY=512Mi
CPU=1
```

#### Production Environment Variables

```env
# .env.prod
ENVIRONMENT=prod
GCP_PROJECT_ID=vhealth-prod
REGION=asia-southeast1
ARTIFACT_REGISTRY=asia-southeast1-docker.pkg.dev
CLOUD_RUN_SERVICE=vhealth-frontend-prod
MIN_INSTANCES=1
MAX_INSTANCES=10
MEMORY=1Gi
CPU=2
```

### GCP Service Account Setup

**Create service account with required roles:**

```bash
# Create service account
gcloud iam service-accounts create vhealth-ci-cd

# Grant necessary roles
gcloud projects add-iam-policy-binding vhealth-prod \
  --member=serviceAccount:vhealth-ci-cd@vhealth-prod.iam.gserviceaccount.com \
  --role=roles/artifactregistry.writer

gcloud projects add-iam-policy-binding vhealth-prod \
  --member=serviceAccount:vhealth-ci-cd@vhealth-prod.iam.gserviceaccount.com \
  --role=roles/run.developer

gcloud projects add-iam-policy-binding vhealth-prod \
  --member=serviceAccount:vhealth-ci-cd@vhealth-prod.iam.gserviceaccount.com \
  --role=roles/iam.serviceAccountUser

# Create key
gcloud iam service-accounts keys create jenkins-key.json \
  --iam-account=vhealth-ci-cd@vhealth-prod.iam.gserviceaccount.com
```

**Store key in Jenkins:**

- Jenkins → Manage Jenkins → Credentials
- Add credentials → Secret file
- Upload `jenkins-key.json`
- Note the credential ID for pipeline

---

## Docker Build Process

### Dockerfile Overview

**Location:** `/Dockerfile` (74 lines)
**Strategy:** Multi-stage build
**Base Image:** `oven/bun:1.2-alpine` (~70MB)
**Final Size:** 200-300MB (optimized with output file tracing)

### Build Stages

#### Stage 1: base

```dockerfile
FROM oven/bun:1.2-alpine as base

WORKDIR /app

# Install system dependencies (if needed)
RUN apk add --no-cache libc6-compat

# Create non-root user for security
RUN addgroup -g 1001 -S nextjs
RUN adduser -S nextjs -u 1001
```

**Purpose:** Set up minimal Alpine Linux + Bun runtime

#### Stage 2: deps (Dependency Layer)

```dockerfile
FROM base AS deps

COPY package.json bun.lockb ./

RUN bun install --frozen-lockfile --production=false
```

**Purpose:** Install dependencies (leverages Docker layer caching)

#### Stage 3: builder (Compilation Layer)

```dockerfile
FROM deps AS builder

COPY . .

# Build arguments injected by Jenkins
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_GOOGLE_CLIENT_ID
ARG NEXT_PUBLIC_GOOGLE_SECRET
ARG NEXT_PUBLIC_GOOGLE_REDIRECT_URI

ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_GOOGLE_CLIENT_ID=$NEXT_PUBLIC_GOOGLE_CLIENT_ID
ENV NEXT_PUBLIC_GOOGLE_SECRET=$NEXT_PUBLIC_GOOGLE_SECRET
ENV NEXT_PUBLIC_GOOGLE_REDIRECT_URI=$NEXT_PUBLIC_GOOGLE_REDIRECT_URI

RUN bun run build
```

**Purpose:** Compile Next.js application

#### Stage 4: runner (Production Image)

```dockerfile
FROM base AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

CMD ["bun", "start"]
```

**Purpose:** Minimal production image (build tools removed)

### Local Docker Build

**Build image locally:**

```bash
# Build with build arguments
docker build \
  --build-arg NEXT_PUBLIC_API_URL=http://localhost:8000 \
  --build-arg NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-client-id \
  --build-arg NEXT_PUBLIC_GOOGLE_SECRET=your-secret \
  --build-arg NEXT_PUBLIC_GOOGLE_REDIRECT_URI=http://localhost:3000/auth/google/callback \
  -t vhealth-frontend:latest .

# Run container locally
docker run -p 3000:3000 vhealth-frontend:latest

# Test
curl http://localhost:3000
```

### Docker Best Practices in VHealth

✅ **What we do:**

- Multi-stage builds (no build tools in final image)
- BuildKit inline caching for faster builds
- Output file tracing to reduce image size (~50%)
- Non-root user (nextjs:1001) for security
- Alpine Linux base (minimal CVE surface)
- No secrets in image (build args only)

❌ **What we avoid:**

- Single-stage builds (bloated images)
- Running as root user
- Hardcoded secrets in image
- Large base images (Ubuntu, CentOS)
- Unoptimized layers

---

## Terraform Configuration

### File Structure

```
terraform/
├── main.tf              # Core infrastructure (Cloud Run, Artifact Registry)
├── variables.tf         # Input variables (12 total)
├── outputs.tf           # Export values
├── backends/
│   ├── test.tfbackend   # Test environment backend config
│   └── prod.tfbackend   # Production environment backend config
├── environments/
│   ├── test.tfvars      # Test environment values
│   └── prod.tfvars      # Production environment values
└── README.md            # Terraform documentation
```

### Key Resources

#### Cloud Run Service

```hcl
resource "google_cloud_run_service" "frontend" {
  name            = var.service_name
  location        = var.region
  project         = var.project_id
  template {
    spec {
      service_account_name = var.service_account_email

      containers {
        image = var.image_url

        # Environment variables
        env {
          name  = "NEXT_PUBLIC_API_URL"
          value = var.api_url
        }

        ports {
          container_port = 3000
        }

        resources {
          limits = {
            cpu    = var.cpu
            memory = var.memory
          }
        }
      }

      # Configure timeout
      timeout_seconds = 300

      # Health check
      liveness_probe {
        http_get {
          path = "/"
          port = 3000
        }
        initial_delay_seconds = 5
        timeout_seconds       = 5
      }
    }

    metadata {
      annotations = {
        "autoscaling.knative.dev/maxScale" = var.max_instances
        "autoscaling.knative.dev/minScale" = var.min_instances
      }
    }
  }

  # Allow public access
  traffic {
    percent         = 100
    latest_revision = true
  }
}
```

#### Service Account IAM Bindings

```hcl
resource "google_cloud_run_service_iam_binding" "public_access" {
  service  = google_cloud_run_service.frontend.name
  location = var.region
  role     = "roles/run.invoker"
  members  = ["allUsers"]
}

resource "google_cloud_run_service_iam_binding" "secret_accessor" {
  service  = google_cloud_run_service.frontend.name
  location = var.region
  role     = "roles/secretmanager.secretAccessor"
  members  = ["serviceAccount:${var.service_account_email}"]
}
```

### Variables Configuration

**test.tfvars:**

```hcl
project_id      = "vhealth-test"
service_name    = "vhealth-frontend-test"
region          = "asia-southeast1"
cpu             = "1"
memory          = "512Mi"
min_instances   = 0
max_instances   = 3
api_url         = "https://test-backend.example.com"
image_url       = "asia-southeast1-docker.pkg.dev/vhealth-test/vhealth-frontend-test/vhealth-frontend:latest"
```

**prod.tfvars:**

```hcl
project_id      = "vhealth-prod"
service_name    = "vhealth-frontend-prod"
region          = "asia-southeast1"
cpu             = "2"
memory          = "1Gi"
min_instances   = 1
max_instances   = 10
api_url         = "https://api.vhealth.com"
image_url       = "asia-southeast1-docker.pkg.dev/vhealth-prod/vhealth-frontend-prod/vhealth-frontend:latest"
```

### Terraform Commands

**Initialize Terraform:**

```bash
# Initialize backend and download providers
terraform init \
  -backend-config=bucket=vhealth-prod-frontend-tfstate \
  -backend-config=prefix=terraform/state/frontend-prod

# Or use backend config file
terraform init -backend-config=environments/prod.tfbackend
```

**Plan deployment:**

```bash
# Preview what will be created/changed
terraform plan \
  -var-file=environments/prod.tfvars \
  -var="image_url=asia-southeast1-docker.pkg.dev/vhealth-prod/vhealth-frontend-prod/vhealth-frontend:v42-abc123" \
  -out=tfplan
```

**Apply deployment:**

```bash
# Execute the plan
terraform apply tfplan
```

**Destroy infrastructure (carefully!):**

```bash
# Destroy all resources (be very careful!)
terraform destroy -var-file=environments/prod.tfvars

# Destroy specific resource
terraform destroy -var-file=environments/prod.tfvars -target=google_cloud_run_service.frontend
```

---

## Jenkins CI/CD Pipeline

### Pipeline Overview

**File:** `/Jenkinsfile` (482 lines)
**Type:** Declarative pipeline
**Execution Time:** 15-25 minutes total
**Stages:** 8 major stages

### Pipeline Stages Detail

#### 1. Initialize

```groovy
stage('Initialize') {
  steps {
    script {
      echo "Initializing VHealth Frontend Deployment Pipeline"
      echo "Environment: ${ENVIRONMENT}"
      echo "Branch: ${BRANCH_NAME}"
      echo "Build Number: ${BUILD_NUMBER}"
    }
  }
}
```

**Purpose:** Validate pipeline execution environment
**Time:** <1 minute

#### 2. Checkout

```groovy
stage('Checkout') {
  steps {
    checkout scm
    script {
      GIT_COMMIT_SHORT = sh(
        script: "git rev-parse --short HEAD",
        returnStdout: true
      ).trim()
    }
  }
}
```

**Purpose:** Clone repository at specified branch
**Time:** 2-3 minutes

#### 3. Authenticate to GCP

```groovy
stage('Authenticate to GCP') {
  steps {
    withCredentials([file(
      credentialsId: 'gcp-service-account-key',
      variable: 'GCP_KEY_FILE'
    )]) {
      script {
        sh '''
          gcloud auth activate-service-account --key-file=$GCP_KEY_FILE
          gcloud config set project ${GCP_PROJECT_ID}
          gcloud auth configure-docker ${REGION}-docker.pkg.dev
        '''
      }
    }
  }
}
```

**Purpose:** Authenticate Jenkins to GCP
**Time:** <1 minute

#### 4. Quality Checks (Parallel)

```groovy
stage('Quality Checks') {
  when {
    expression { params.SKIP_TESTS == false }
  }
  parallel {
    stage('Lint') {
      steps {
        sh 'bun run lint'
      }
    }
    stage('Format Check') {
      steps {
        sh 'bun run format:check'
      }
    }
    stage('Type Check') {
      steps {
        sh 'bun run type-check'
      }
    }
  }
}
```

**Purpose:** Validate code quality before build
**Time:** 2-3 minutes
**Failures:** Halt pipeline if any check fails
**Skip Option:** `SKIP_TESTS=true` parameter

#### 5. Fetch Build Secrets

```groovy
stage('Fetch Build Secrets') {
  steps {
    script {
      sh '''
        gcloud secrets versions access latest --secret="google-client-id" > /tmp/client_id
        gcloud secrets versions access latest --secret="google-client-secret" > /tmp/client_secret
        gcloud secrets versions access latest --secret="google-redirect-uri" > /tmp/redirect_uri

        export GOOGLE_CLIENT_ID=$(cat /tmp/client_id)
        export GOOGLE_CLIENT_SECRET=$(cat /tmp/client_secret)
        export GOOGLE_REDIRECT_URI=$(cat /tmp/redirect_uri)
      '''
    }
  }
}
```

**Purpose:** Retrieve OAuth credentials from Secret Manager
**Time:** <1 minute
**Security:** Never logs secrets to console

#### 6. Build & Push Docker Image

```groovy
stage('Build & Push Docker') {
  steps {
    script {
      IMAGE_TAG = "${BUILD_NUMBER}-${GIT_COMMIT_SHORT}"
      IMAGE_URL = "${ARTIFACT_REGISTRY}/${GCP_PROJECT_ID}/${DOCKER_REPO}/vhealth-frontend:${IMAGE_TAG}"

      sh '''
        docker build \
          --build-arg NEXT_PUBLIC_API_URL=${API_URL} \
          --build-arg NEXT_PUBLIC_GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID} \
          --build-arg NEXT_PUBLIC_GOOGLE_SECRET=${GOOGLE_CLIENT_SECRET} \
          --build-arg NEXT_PUBLIC_GOOGLE_REDIRECT_URI=${GOOGLE_REDIRECT_URI} \
          -t ${IMAGE_URL} \
          -t ${ARTIFACT_REGISTRY}/${GCP_PROJECT_ID}/${DOCKER_REPO}/vhealth-frontend:latest \
          .

        docker push ${IMAGE_URL}
        docker push ${ARTIFACT_REGISTRY}/${GCP_PROJECT_ID}/${DOCKER_REPO}/vhealth-frontend:latest
      '''
    }
  }
}
```

**Purpose:** Build Next.js app and Docker image, push to registry
**Time:** 5-8 minutes
**Stages:**

1. Compile Next.js with build args
2. Create Docker image
3. Tag with build number and commit hash
4. Push to Artifact Registry

#### 7. Terraform Deployment

```groovy
stage('Terraform Deployment') {
  steps {
    dir('terraform') {
      sh '''
        # Clean workspace
        rm -rf .terraform/

        # Initialize backend
        terraform init \
          -backend-config="bucket=${TFSTATE_BUCKET}" \
          -backend-config="prefix=terraform/state/frontend-${ENVIRONMENT}" \
          -reconfigure

        # Validate configuration
        terraform validate

        # Plan deployment
        terraform plan \
          -var-file="environments/${ENVIRONMENT}.tfvars" \
          -var="image_url=${IMAGE_URL}" \
          -out=tfplan

        # Apply deployment
        terraform apply tfplan

        # Get outputs
        terraform output service_url
      '''
    }
  }
}
```

**Purpose:** Deploy infrastructure via Terraform
**Time:** 8-12 minutes
**Sub-stages:**

1. Clean workspace (prevent state corruption)
2. Initialize Terraform
3. Validate configuration
4. Plan deployment
5. Apply deployment

#### 8. Cleanup

```groovy
stage('Cleanup') {
  steps {
    sh '''
      # Remove unused Docker resources
      docker system prune -f

      # Clean workspace
      rm -rf /tmp/client_* /tmp/secrets_*
    '''
  }
}
```

**Purpose:** Clean up build artifacts
**Time:** <1 minute

### Pipeline Parameters

**ENVIRONMENT**

- Type: Choice
- Options: test, prod
- Default: test
- Purpose: Specify target environment

**BRANCH_NAME**

- Type: String
- Default: develop
- Purpose: Which branch to deploy

**SKIP_TESTS**

- Type: Boolean
- Default: false
- Purpose: Skip quality checks (use cautiously)

### Pipeline Triggers

**Webhook Triggers:**

- Push to develop → Deploy to test
- Tag release-\* → Deploy to prod

**Manual Triggers:**

- Jenkins job with parameters
- GitHub Actions (future)

---

## Deployment Instructions

### Quick Deploy (Recommended)

**Step 1: Access Jenkins**

```
1. Navigate to Jenkins URL
2. Find "health-management-frontend" job
3. Click "Build with Parameters"
```

**Step 2: Configure Parameters**

```
ENVIRONMENT: prod
BRANCH_NAME: develop
SKIP_TESTS: false
```

**Step 3: Trigger Build**

```
Click "Build"
```

**Step 4: Monitor Progress**

```
1. Watch pipeline progress in real-time
2. Check logs if any stage fails
3. View service URL in final stage
```

### Manual Deployment (Advanced)

**Step 1: Authenticate to GCP**

```bash
export ENVIRONMENT=prod
export GCP_PROJECT_ID=vhealth-prod

gcloud auth login
gcloud config set project $GCP_PROJECT_ID
```

**Step 2: Build Docker Image**

```bash
# Fetch secrets
GOOGLE_CLIENT_ID=$(gcloud secrets versions access latest --secret="google-client-id")
GOOGLE_CLIENT_SECRET=$(gcloud secrets versions access latest --secret="google-client-secret")
GOOGLE_REDIRECT_URI=$(gcloud secrets versions access latest --secret="google-redirect-uri")

# Build image
docker build \
  --build-arg NEXT_PUBLIC_API_URL=https://api.vhealth.com \
  --build-arg NEXT_PUBLIC_GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID \
  --build-arg NEXT_PUBLIC_GOOGLE_SECRET=$GOOGLE_CLIENT_SECRET \
  --build-arg NEXT_PUBLIC_GOOGLE_REDIRECT_URI=$GOOGLE_REDIRECT_URI \
  -t asia-southeast1-docker.pkg.dev/vhealth-prod/vhealth-frontend-prod/vhealth-frontend:v1 .
```

**Step 3: Push to Artifact Registry**

```bash
gcloud auth configure-docker asia-southeast1-docker.pkg.dev

docker push asia-southeast1-docker.pkg.dev/vhealth-prod/vhealth-frontend-prod/vhealth-frontend:v1
```

**Step 4: Deploy via Terraform**

```bash
cd terraform

# Initialize
terraform init \
  -backend-config=bucket=vhealth-prod-frontend-tfstate \
  -backend-config=prefix=terraform/state/frontend-prod \
  -reconfigure

# Plan
terraform plan \
  -var-file=environments/prod.tfvars \
  -var="image_url=asia-southeast1-docker.pkg.dev/vhealth-prod/vhealth-frontend-prod/vhealth-frontend:v1" \
  -out=tfplan

# Apply
terraform apply tfplan
```

**Step 5: Verify Deployment**

```bash
# Get service URL
SERVICE_URL=$(terraform output -raw service_url)

# Test endpoint
curl $SERVICE_URL

# View logs
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=vhealth-frontend-prod" --limit 50
```

---

## Post-Deployment Verification

### Health Checks

**Service Status:**

```bash
gcloud run services describe vhealth-frontend-prod \
  --region=asia-southeast1 \
  --project=vhealth-prod
```

**HTTP Endpoint:**

```bash
# Test home page
curl https://vhealth-frontend-prod-xxxxx.run.app

# Should return 200 OK with HTML content
```

**Health Probe:**

```bash
# Check Container Health
gcloud run revisions describe vhealth-frontend-prod-xxxxx \
  --region=asia-southeast1 \
  --project=vhealth-prod
```

### Smoke Tests

**1. Check Landing Page**

```bash
curl -I https://vhealth-frontend-prod-xxxxx.run.app
# Expected: 200 OK
```

**2. Check API Connectivity**

```bash
# Login endpoint should exist (even if returns 401)
curl -X POST https://vhealth-frontend-prod-xxxxx.run.app/api/health
# Expected: Some response (not 404)
```

**3. Test in Browser**

```
1. Navigate to https://vhealth-frontend-prod-xxxxx.run.app
2. Should see landing page
3. Check browser console for errors
4. Test login flow with test account
```

### Monitor Initial Stability

**View Logs:**

```bash
# Real-time logs from Cloud Run
gcloud logging read \
  "resource.type=cloud_run_revision AND resource.labels.service_name=vhealth-frontend-prod" \
  --limit 100 \
  --format json
```

**Check Metrics:**

```bash
# View CPU, memory, request count
gcloud monitoring read \
  --filter='metric.type="run.googleapis.com/request_count"' \
  --limit 10
```

**Error Tracking:**

```bash
# Check for errors in logs
gcloud logging read \
  "resource.type=cloud_run_revision AND severity=ERROR" \
  --limit 50
```

---

## Monitoring & Troubleshooting

### Common Issues & Solutions

#### Issue: Image Push Fails

**Symptoms:** Docker push fails with authentication error

**Solution:**

```bash
# Reconfigure Docker auth
gcloud auth configure-docker asia-southeast1-docker.pkg.dev

# Verify service account has Artifact Registry access
gcloud projects get-iam-policy vhealth-prod \
  --flatten="bindings[].members" \
  --filter="bindings.members:serviceAccount:vhealth-ci-cd*" \
  --format="table(bindings.role)"
```

#### Issue: Terraform State Lock

**Symptoms:** Terraform init fails with state lock error

**Solution:**

```bash
# View state lock
gsutil ls gs://vhealth-prod-frontend-tfstate/.terraform.lock.hcl

# Force unlock (use with caution)
terraform force-unlock <LOCK_ID>

# Or clear workspace and reinit
rm -rf .terraform
terraform init -backend-config=bucket=vhealth-prod-frontend-tfstate
```

#### Issue: Cloud Run Service Fails to Start

**Symptoms:** Service shows error status or no revisions

**Solution:**

```bash
# Check logs
gcloud logging read \
  "resource.type=cloud_run_revision AND resource.labels.service_name=vhealth-frontend-prod" \
  --limit 50

# Common causes:
# 1. Build secrets not accessible → verify Secret Manager access
# 2. Image doesn't exist → check Artifact Registry
# 3. Port not exposed → verify Dockerfile EXPOSE 3000
# 4. Out of memory → increase memory allocation in Terraform
```

#### Issue: 401 Errors on API Calls

**Symptoms:** All API requests return 401 from browser

**Solution:**

```bash
# Check if backend API is running
curl https://api.vhealth.com/health

# Verify NEXT_PUBLIC_API_URL is correct
# Check Cloud Run environment variables
gcloud run services describe vhealth-frontend-prod --region=asia-southeast1

# If NEXT_PUBLIC_API_URL is wrong:
# 1. Rebuild with correct value
# 2. Push new image
# 3. Run terraform apply with new image_url
```

### Monitoring Dashboards

**Cloud Run Console:**

- Navigate to: Cloud Run → vhealth-frontend-prod
- View: Revisions, Metrics, Logs, Settings

**Cloud Logging:**

- Advanced filter: `resource.type=cloud_run_revision AND resource.labels.service_name=vhealth-frontend-prod`
- View logs, metrics, errors

**Terraform Outputs:**

```bash
cd terraform
terraform output
# Shows service URL, project ID, region, etc.
```

---

## Rollback Procedures

### Option 1: Cloud Run Console (Easiest)

**Steps:**

```
1. Go to Google Cloud Run console
2. Click vhealth-frontend-prod service
3. Click "Revisions" tab
4. Find previous working revision
5. Click revision → "Manage Traffic"
6. Set traffic percentage to 100% for that revision
7. Done - traffic now uses old version
```

### Option 2: Terraform Rollback

**Steps:**

```bash
cd terraform

# List previous images
gcloud artifacts docker images list \
  asia-southeast1-docker.pkg.dev/vhealth-prod/vhealth-frontend-prod

# Plan with previous image
terraform plan \
  -var-file=environments/prod.tfvars \
  -var="image_url=asia-southeast1-docker.pkg.dev/vhealth-prod/vhealth-frontend-prod/vhealth-frontend:PREVIOUS_TAG" \
  -out=rollback.plan

# Apply rollback
terraform apply rollback.plan
```

### Option 3: Terraform State Restore

**Steps:**

```bash
cd terraform

# List previous states
gsutil ls gs://vhealth-prod-frontend-tfstate/terraform/state/frontend-prod/

# Download previous state
gsutil cp \
  gs://vhealth-prod-frontend-tfstate/terraform/state/frontend-prod/default.tfstate.BACKUP \
  ./default.tfstate.backup

# Push previous state
terraform state push ./default.tfstate.backup

# Apply (redeploy with old state)
terraform apply
```

### Rollback Best Practices

✅ **Do:**

- Test rollback procedure in test environment first
- Keep at least 5 previous deployments
- Document rollback reason in commit message
- Monitor logs after rollback

❌ **Don't:**

- Force-delete revisions (use traffic shifting instead)
- Skip state backups
- Deploy without testing in test environment first

---

## Disaster Recovery

### Backup Strategy

**Automated Backups:**

- Terraform state auto-backs up daily (GCS retention)
- Docker images retained in Artifact Registry
- Git commits stored in GitHub

**Manual Backups:**

```bash
# Backup Terraform state
gsutil cp \
  gs://vhealth-prod-frontend-tfstate/terraform/state/frontend-prod/default.tfstate \
  ./backups/tfstate-$(date +%Y%m%d-%H%M%S).json

# List backups
gsutil ls gs://vhealth-prod-frontend-tfstate/terraform/state/frontend-prod/
```

### Recovery Procedures

**If Cloud Run Service Deleted:**

```bash
cd terraform

# Terraform state still exists
terraform plan -var-file=environments/prod.tfvars

# Reapply to recreate
terraform apply
```

**If Docker Image Missing:**

```bash
# Rebuild from source
docker build \
  --build-arg NEXT_PUBLIC_API_URL=https://api.vhealth.com \
  --build-arg NEXT_PUBLIC_GOOGLE_CLIENT_ID=$CLIENT_ID \
  --build-arg NEXT_PUBLIC_GOOGLE_SECRET=$CLIENT_SECRET \
  --build-arg NEXT_PUBLIC_GOOGLE_REDIRECT_URI=$REDIRECT_URI \
  -t asia-southeast1-docker.pkg.dev/vhealth-prod/vhealth-frontend-prod/vhealth-frontend:v2 .

docker push asia-southeast1-docker.pkg.dev/vhealth-prod/vhealth-frontend-prod/vhealth-frontend:v2

# Redeploy
terraform apply -var="image_url=...v2"
```

**If Terraform State Corrupted:**

```bash
cd terraform

# Restore from backup
gsutil cp \
  gs://vhealth-prod-frontend-tfstate/terraform/state/frontend-prod/default.tfstate.BACKUP \
  ./default.tfstate

terraform state push ./default.tfstate

# Verify
terraform plan
```

### Disaster Recovery Checklist

| Item                              | Status | Notes                               |
| --------------------------------- | ------ | ----------------------------------- |
| **Git repository backed up**      | ✅     | GitHub is primary backup            |
| **Terraform state backed up**     | ✅     | GCS versioning enabled              |
| **Docker images backed up**       | ✅     | Artifact Registry retention 30 days |
| **Service account key backed up** | ✅     | Stored in Jenkins secrets           |
| **DNS records documented**        | ✅     | Cloud Run URL is primary            |
| **API credentials documented**    | ✅     | Secret Manager stores them          |
| **Runbooks created**              | ✅     | This document                       |

---

## Deployment Checklist

Before each deployment:

- [ ] Feature branch has all commits
- [ ] Code review approved
- [ ] Tests passing in CI
- [ ] CHANGELOG updated
- [ ] Version bumped if needed
- [ ] Secrets configured in Secret Manager
- [ ] Terraform variables correct for environment
- [ ] Docker build args set correctly
- [ ] Previous deployment verified stable
- [ ] Rollback plan reviewed
- [ ] Monitoring configured
- [ ] Team notified of deployment window

---

## Quick Reference

| Task                      | Command                                                                                                 |
| ------------------------- | ------------------------------------------------------------------------------------------------------- |
| **View pipeline status**  | Jenkins → job → Build History                                                                           |
| **Deploy via Jenkins**    | Jenkins → job → Build with Parameters                                                                   |
| **Check service status**  | `gcloud run services describe vhealth-frontend-prod --region=asia-southeast1`                           |
| **View logs**             | `gcloud logging read "resource.type=cloud_run_revision" --limit 50`                                     |
| **Rollback via console**  | Cloud Run → service → Revisions → manage traffic                                                        |
| **Check Terraform state** | `terraform show`                                                                                        |
| **List Docker images**    | `gcloud artifacts docker images list asia-southeast1-docker.pkg.dev/vhealth-prod/vhealth-frontend-prod` |

---

**For additional information:**

- `/PRODUCTION_DEPLOYMENT_READY.md` - Full deployment readiness guide
- `docs/system-architecture.md` - Infrastructure architecture
- `terraform/README.md` - Terraform-specific documentation
- `/Jenkinsfile` - Pipeline source code
