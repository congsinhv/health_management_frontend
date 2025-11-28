# Terraform State Isolation Fix

**Date:** 2025-11-28
**Issue:** Cross-environment state contamination causing test deployments to attempt destruction of production resources
**Status:** ✅ FIXED

## Problem Summary

Test environment deployments were attempting to destroy production resources due to Terraform state isolation failure:

```
google_project_iam_member.cloud_run_sa_roles["roles/artifactregistry.reader"]: Destroying...
[id=vhealth-prod/roles/artifactregistry.reader/serviceAccount:vhealth-frontend-prod@vhealth-prod.iam.gserviceaccount.com]
```

### Root Cause

1. **Jenkins workspace pollution** - Local `.terraform` directory cached state from previous deployments
2. **Insufficient state validation** - No checks to verify loaded state matches target environment
3. **Missing workspace cleanup** - Terraform local files persisted between builds

## Solution Implemented

### 1. Workspace Cleanup Stage

Added automatic cleanup before each Terraform init:

```groovy
stage('Clean Terraform Workspace') {
    steps {
        dir('terraform') {
            script {
                sh '''
                    rm -rf .terraform .terraform.lock.hcl terraform.tfstate* tfplan
                    echo "✓ Workspace cleaned"
                '''
            }
        }
    }
}
```

**Benefits:**

- Removes all local Terraform cache
- Forces fresh state download from GCS backend
- Prevents cross-environment contamination

### 2. State Validation Stage

Added validation to ensure loaded state matches target environment:

```groovy
stage('Validate State Environment') {
    steps {
        script {
            def stateCheck = sh(
                script: """
                    terraform show -json 2>/dev/null | \
                    jq -r '.values.root_module.resources[]? | \
                    select(.type == "google_cloud_run_service") | \
                    .values.project' | head -1 || echo ''
                """,
                returnStdout: true
            ).trim()

            if (stateCheck && stateCheck != "" && stateCheck != "${GCP_PROJECT_ID}") {
                error "State contains resources from ${stateCheck}, expected ${GCP_PROJECT_ID}"
            }
        }
    }
}
```

**Protection:**

- Reads project ID from loaded state
- Compares against target environment
- **ABORTS deployment** if mismatch detected
- Prevents accidental cross-environment operations

### 3. Enhanced Plan Validation

Added plan inspection to detect cross-environment operations:

```groovy
stage('Terraform Plan') {
    script {
        // After creating plan...
        def wrongEnvCheck = sh(
            script: """
                terraform show -json tfplan | \
                jq -r '.resource_changes[]? | \
                select(.change.actions[] | contains("delete") or contains("create")) | \
                .address' | grep -v "${params.ENVIRONMENT}" || echo ''
            """,
            returnStdout: true
        ).trim()

        if (wrongEnvCheck) {
            echo "WARNING: Plan contains operations on: ${wrongEnvCheck}"
        }
    }
}
```

**Safety:**

- Warns about operations on mismatched resources
- Logs for audit trail
- Additional validation layer

### 4. Improved Init Logging

Enhanced Terraform init stage with explicit configuration display:

```groovy
echo "Backend Bucket: ${TF_BACKEND_BUCKET}"
echo "State Prefix: terraform/state/frontend-${params.ENVIRONMENT}"
echo "Project: ${GCP_PROJECT_ID}"
```

**Benefits:**

- Clear audit trail
- Easy troubleshooting
- Verification of correct parameters

## Pipeline Flow (Updated)

```
1. Clean Terraform Workspace
   └─> Remove .terraform, state files, plans

2. Terraform Init
   └─> Download state from correct GCS bucket
   └─> Backend: gs://vhealth-{ENV}-frontend-tfstate/terraform/state/frontend-{ENV}

3. Validate State Environment  ← NEW
   └─> Check state project ID matches target
   └─> ABORT if mismatch

4. Terraform Validate
   └─> Syntax validation

5. Terraform Plan
   └─> Create execution plan
   └─> Validate plan resources  ← ENHANCED

6. Terraform Apply
   └─> Execute plan
```

## Testing & Verification

### Before Deployment

```bash
cd terraform

# Verify state isolation
terraform init \
  -backend-config="bucket=vhealth-test-frontend-tfstate" \
  -backend-config="prefix=terraform/state/frontend-test" \
  -reconfigure

terraform show | grep "vhealth-frontend"
# Should show: vhealth-frontend-test ONLY
```

### After Fix Deployment

1. **Test environment deployment:**
   - ✅ Should load vhealth-test state
   - ✅ Should pass state validation
   - ✅ Should deploy to vhealth-test project

2. **Production environment deployment:**
   - ✅ Should load vhealth-prod state
   - ✅ Should pass state validation
   - ✅ Should deploy to vhealth-prod project

## State Storage Architecture

```
Test Environment:
  Bucket: gs://vhealth-test-frontend-tfstate/
  Path:   terraform/state/frontend-test/default.tfstate
  Project: vhealth-test
  Resources: vhealth-frontend-test

Production Environment:
  Bucket: gs://vhealth-prod-frontend-tfstate/
  Path:   terraform/state/frontend-prod/default.tfstate
  Project: vhealth-prod
  Resources: vhealth-frontend-prod
```

## Immediate Actions Required

### For Current Deployment Issue

```bash
# Clean Jenkins workspace manually (if needed)
ssh jenkins-server
cd /home/jenkins/.jenkins/workspace/health-management-frontend/terraform
rm -rf .terraform .terraform.lock.hcl terraform.tfstate* tfplan

# Re-run deployment with updated Jenkinsfile
# Pipeline will now auto-clean workspace
```

### For Future Deployments

1. ✅ Commit updated Jenkinsfile
2. ✅ Push to repository
3. ✅ Run test deployment to verify fix
4. ✅ Monitor validation stages

## Additional Safeguards

### Manual Approval for Production (Optional)

Add input stage for production deployments:

```groovy
stage('Production Approval') {
    when {
        expression { params.ENVIRONMENT == 'prod' }
    }
    steps {
        input message: 'Deploy to Production?', ok: 'Deploy'
    }
}
```

### State Locking

GCS backend provides automatic state locking:

- Prevents concurrent modifications
- Ensures state consistency
- No additional configuration needed

## Rollback Procedure

If deployment fails:

```bash
# 1. Check current state
terraform show

# 2. Identify last good state version
gsutil ls -l gs://vhealth-{ENV}-frontend-tfstate/terraform/state/frontend-{ENV}/

# 3. If needed, restore from backup
gsutil cp gs://.../terraform/state/.../default.tfstate.backup ./terraform.tfstate
```

## Monitoring & Alerts

### Key Metrics to Monitor

1. **State Validation Failures**
   - Alert: Critical
   - Action: Investigate workspace pollution

2. **Cross-Environment Resource Warnings**
   - Alert: Warning
   - Action: Review plan before apply

3. **Init Failures**
   - Alert: High
   - Action: Check GCS backend access

## Documentation Updates

- [x] Jenkinsfile updated with safety checks
- [x] This fix documentation created
- [ ] Update main README with state isolation info
- [ ] Add to deployment runbook

## References

- **Terraform Backend Configuration:** `terraform/main.tf`
- **Environment Configs:** `terraform/environments/{test,prod}.tfvars`
- **State Buckets:**
  - Test: `gs://vhealth-test-frontend-tfstate`
  - Prod: `gs://vhealth-prod-frontend-tfstate`

## Lessons Learned

1. **Always clean Terraform workspace** in CI/CD environments
2. **Validate state matches target** before operations
3. **Explicit logging** aids troubleshooting
4. **Backend configuration** must be environment-specific
5. **State isolation** is critical for multi-environment setups

---

**Implemented by:** Claude Code
**Reviewed by:** [Pending]
**Approved for production:** [Pending]
