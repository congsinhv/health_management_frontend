pipeline {
    agent any

    parameters {
        choice(
            name: 'ENVIRONMENT',
            choices: ['test', 'prod'],
            description: 'Target environment for deployment'
        )
        string(
            name: 'BRANCH_NAME',
            defaultValue: 'develop',
            description: 'Git branch to deploy'
        )
        booleanParam(
            name: 'SKIP_TESTS',
            defaultValue: false,
            description: 'Skip linting and format checks (faster builds)'
        )
    }

    environment {
        GCP_REGION = 'asia-southeast1'
        ENV = "${params.ENVIRONMENT}"
        GCP_PROJECT_ID = "vhealth-${params.ENVIRONMENT}"
        TF_BACKEND_BUCKET = "${GCP_PROJECT_ID}-frontend-tfstate"

        ARTIFACT_REGISTRY_REPO = "vhealth-frontend-${params.ENVIRONMENT}"
        IMAGE_NAME = "vhealth-frontend"
        IMAGE_TAG = "${env.BUILD_NUMBER}-${env.GIT_COMMIT.take(7)}"
        IMAGE_FULL = "${GCP_REGION}-docker.pkg.dev/${GCP_PROJECT_ID}/${ARTIFACT_REGISTRY_REPO}/${IMAGE_NAME}:${IMAGE_TAG}"
        IMAGE_LATEST = "${GCP_REGION}-docker.pkg.dev/${GCP_PROJECT_ID}/${ARTIFACT_REGISTRY_REPO}/${IMAGE_NAME}:latest"

        TF_IN_AUTOMATION = 'true'
        TF_VAR_FILE = "terraform/environments/${params.ENVIRONMENT}.tfvars"
        ENV_CREDENTIAL = "gcp-service-account-key-${params.ENVIRONMENT}"

        // Docker BuildKit for better caching
        DOCKER_BUILDKIT = '1'
    }

    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timeout(time: 30, unit: 'MINUTES')
        timestamps()
        disableConcurrentBuilds()
    }

    stages {
        stage('Initialize') {
            steps {
                script {
                    echo '=========================================='
                    echo 'Deployment Configuration'
                    echo '=========================================='
                    echo "Environment: ${params.ENVIRONMENT}"
                    echo "Branch: ${params.BRANCH_NAME}"
                    echo "GCP Project: ${GCP_PROJECT_ID}"
                    echo "GCP Region: ${GCP_REGION}"
                    echo "Terraform State Bucket: ${TF_BACKEND_BUCKET}"
                    echo "Image: ${IMAGE_FULL}"
                    echo "Skip Tests: ${params.SKIP_TESTS}"
                    echo '=========================================='
                }
            }
        }

        stage('Checkout') {
            steps {
                script {
                    echo "Checking out branch: ${params.BRANCH_NAME}"
                    checkout([
                        $class: 'GitSCM',
                        branches: [[name: "*/${params.BRANCH_NAME}"]],
                        userRemoteConfigs: scm.userRemoteConfigs
                    ])
                }
            }
        }

        stage('Authenticate to GCP') {
            steps {
                script {
                    withCredentials([file(credentialsId: "${ENV_CREDENTIAL}", variable: 'GOOGLE_APPLICATION_CREDENTIALS')]) {
                        sh """
                            echo 'Using credentials: ${ENV_CREDENTIAL}'
                            gcloud auth activate-service-account --key-file="$GOOGLE_APPLICATION_CREDENTIALS"
                            gcloud config set project "${GCP_PROJECT_ID}"
                            gcloud config set compute/region "${GCP_REGION}"
                            gcloud auth configure-docker "${GCP_REGION}-docker.pkg.dev" --quiet
                        """
                    }
                }
            }
        }

        stage('Quality Checks') {
            when {
                expression { return !params.SKIP_TESTS }
            }
            parallel {
                stage('Lint') {
                    steps {
                        script {
                            echo 'Running linting...'
                            sh '''
                                if ! command -v bun &> /dev/null; then
                                    curl -fsSL https://bun.sh/install | bash
                                    export PATH="$HOME/.bun/bin:$PATH"
                                fi
                                bun install --frozen-lockfile
                                bun run lint
                            '''
                        }
                    }
                }
                stage('Format Check') {
                    steps {
                        script {
                            echo 'Checking code format...'
                            sh '''
                                export PATH="$HOME/.bun/bin:$PATH"
                                bun run format:check
                            '''
                        }
                    }
                }
            }
        }

        stage('Fetch Build Secrets') {
            steps {
                script {
                    echo 'Fetching secrets from GCP Secret Manager for build...'

                    // Fetch API URL
                    env.NEXT_PUBLIC_API_URL = sh(
                        script: """
                            gcloud secrets versions access latest \
                                --secret=vhealth-${params.ENVIRONMENT}-api-url \
                                --project=${GCP_PROJECT_ID} 2>/dev/null || echo 'http://localhost:8000'
                        """,
                        returnStdout: true
                    ).trim()

                    // Fetch Google OAuth Client ID
                    env.NEXT_PUBLIC_GOOGLE_CLIENT_ID = sh(
                        script: """
                            gcloud secrets versions access latest \
                                --secret=vhealth-${params.ENVIRONMENT}-google-client-id \
                                --project=${GCP_PROJECT_ID} 2>/dev/null || echo ''
                        """,
                        returnStdout: true
                    ).trim()

                    // Fetch Google OAuth Client Secret
                    env.NEXT_PUBLIC_GOOGLE_SECRET = sh(
                        script: """
                            gcloud secrets versions access latest \
                                --secret=vhealth-${params.ENVIRONMENT}-google-client-secret \
                                --project=${GCP_PROJECT_ID} 2>/dev/null || echo ''
                        """,
                        returnStdout: true
                    ).trim()

                    // Fetch Google OAuth Redirect URI
                    env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI = sh(
                        script: """
                            gcloud secrets versions access latest \
                                --secret=vhealth-${params.ENVIRONMENT}-google-redirect-uri \
                                --project=${GCP_PROJECT_ID} 2>/dev/null || echo ''
                        """,
                        returnStdout: true
                    ).trim()

                    // Fetch Firebase Configuration
                    env.NEXT_PUBLIC_FIREBASE_API_KEY = sh(
                        script: """
                            gcloud secrets versions access latest \
                                --secret=vhealth-${params.ENVIRONMENT}-firebase-api-key \
                                --project=${GCP_PROJECT_ID} 2>/dev/null || echo ''
                        """,
                        returnStdout: true
                    ).trim()

                    env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = sh(
                        script: """
                            gcloud secrets versions access latest \
                                --secret=vhealth-${params.ENVIRONMENT}-firebase-auth-domain \
                                --project=${GCP_PROJECT_ID} 2>/dev/null || echo ''
                        """,
                        returnStdout: true
                    ).trim()

                    env.NEXT_PUBLIC_FIREBASE_PROJECT_ID = sh(
                        script: """
                            gcloud secrets versions access latest \
                                --secret=vhealth-${params.ENVIRONMENT}-firebase-project-id \
                                --project=${GCP_PROJECT_ID} 2>/dev/null || echo ''
                        """,
                        returnStdout: true
                    ).trim()

                    env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET = sh(
                        script: """
                            gcloud secrets versions access latest \
                                --secret=vhealth-${params.ENVIRONMENT}-firebase-storage-bucket \
                                --project=${GCP_PROJECT_ID} 2>/dev/null || echo ''
                        """,
                        returnStdout: true
                    ).trim()

                    env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = sh(
                        script: """
                            gcloud secrets versions access latest \
                                --secret=vhealth-${params.ENVIRONMENT}-firebase-messaging-sender-id \
                                --project=${GCP_PROJECT_ID} 2>/dev/null || echo ''
                        """,
                        returnStdout: true
                    ).trim()

                    env.NEXT_PUBLIC_FIREBASE_APP_ID = sh(
                        script: """
                            gcloud secrets versions access latest \
                                --secret=vhealth-${params.ENVIRONMENT}-firebase-app-id \
                                --project=${GCP_PROJECT_ID} 2>/dev/null || echo ''
                        """,
                        returnStdout: true
                    ).trim()

                    env.NEXT_PUBLIC_FIREBASE_VAPID_KEY = sh(
                        script: """
                            gcloud secrets versions access latest \
                                --secret=vhealth-${params.ENVIRONMENT}-firebase-vapid-key \
                                --project=${GCP_PROJECT_ID} 2>/dev/null || echo ''
                        """,
                        returnStdout: true
                    ).trim()

                    echo "API URL: ${env.NEXT_PUBLIC_API_URL}"
                    echo "Google Client ID: ${env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ? '***' : '(not set)'}"
                    echo "Google Client Secret: ${env.NEXT_PUBLIC_GOOGLE_SECRET ? '***' : '(not set)'}"
                    echo "Google Redirect URI: ${env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI}"
                    echo "Firebase API Key: ${env.NEXT_PUBLIC_FIREBASE_API_KEY ? '***' : '(not set)'}"
                    echo "Firebase Auth Domain: ${env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? '***' : '(not set)'}"
                    echo "Firebase Project ID: ${env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? '***' : '(not set)'}"
                    echo "Firebase Storage Bucket: ${env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ? '***' : '(not set)'}"
                    echo "Firebase Messaging Sender ID: ${env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ? '***' : '(not set)'}"
                    echo "Firebase App ID: ${env.NEXT_PUBLIC_FIREBASE_APP_ID ? '***' : '(not set)'}"
                    echo "Firebase VAPID Key: ${env.NEXT_PUBLIC_FIREBASE_VAPID_KEY ? '***' : '(not set)'}"
                }
            }
        }

        stage('Build & Push Docker Image') {
            steps {
                script {
                    echo "Building Docker image with BuildKit: ${IMAGE_FULL}"
                    sh """
                        docker build \
                            --build-arg BUILDKIT_INLINE_CACHE=1 \
                            --build-arg BUILD_DATE=\$(date -u +"%Y-%m-%dT%H:%M:%SZ") \
                            --build-arg VERSION=${IMAGE_TAG} \
                            --build-arg GIT_COMMIT=${GIT_COMMIT} \
                            --build-arg NEXT_PUBLIC_API_URL='${NEXT_PUBLIC_API_URL}' \
                            --build-arg NEXT_PUBLIC_GOOGLE_CLIENT_ID='${NEXT_PUBLIC_GOOGLE_CLIENT_ID}' \
                            --build-arg NEXT_PUBLIC_GOOGLE_SECRET='${NEXT_PUBLIC_GOOGLE_SECRET}' \
                            --build-arg NEXT_PUBLIC_GOOGLE_REDIRECT_URI='${NEXT_PUBLIC_GOOGLE_REDIRECT_URI}' \
                            --build-arg NEXT_PUBLIC_FIREBASE_API_KEY='${NEXT_PUBLIC_FIREBASE_API_KEY}' \
                            --build-arg NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN='${NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN}' \
                            --build-arg NEXT_PUBLIC_FIREBASE_PROJECT_ID='${NEXT_PUBLIC_FIREBASE_PROJECT_ID}' \
                            --build-arg NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET='${NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET}' \
                            --build-arg NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID='${NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID}' \
                            --build-arg NEXT_PUBLIC_FIREBASE_APP_ID='${NEXT_PUBLIC_FIREBASE_APP_ID}' \
                            --build-arg NEXT_PUBLIC_FIREBASE_VAPID_KEY='${NEXT_PUBLIC_FIREBASE_VAPID_KEY}' \
                            --cache-from ${IMAGE_LATEST} \
                            -t ${IMAGE_FULL} \
                            -t ${IMAGE_LATEST} \
                            .

                        echo 'Pushing to Artifact Registry...'
                        docker push ${IMAGE_FULL}
                        docker push ${IMAGE_LATEST}
                    """
                }
            }
        }

        stage('Terraform Deployment') {
            stages {
                stage('Clean Terraform Workspace') {
                    steps {
                        dir('terraform') {
                            script {
                                echo '=========================================='
                                echo 'Cleaning Terraform workspace to prevent cross-environment contamination'
                                echo '=========================================='
                                sh '''
                                    rm -rf .terraform .terraform.lock.hcl terraform.tfstate* tfplan
                                    echo "Workspace cleaned"
                                '''
                            }
                        }
                    }
                }

                stage('Terraform Init') {
                    steps {
                        withCredentials([file(credentialsId: "${ENV_CREDENTIAL}", variable: 'GOOGLE_APPLICATION_CREDENTIALS')]) {
                            dir('terraform') {
                                script {
                                    echo '=========================================='
                                    echo "Initializing Terraform for ${params.ENVIRONMENT}"
                                    echo "Backend Bucket: ${TF_BACKEND_BUCKET}"
                                    echo "State Prefix: terraform/state/frontend-${params.ENVIRONMENT}"
                                    echo "Project: ${GCP_PROJECT_ID}"
                                    echo '=========================================='
                                    sh """
                                        gcloud auth activate-service-account --key-file="\$GOOGLE_APPLICATION_CREDENTIALS"
                                        gcloud config set project "${GCP_PROJECT_ID}"
                                        terraform init \
                                            -backend-config="bucket=${TF_BACKEND_BUCKET}" \
                                            -backend-config="prefix=terraform/state/frontend-${params.ENVIRONMENT}" \
                                            -reconfigure \
                                            -no-color
                                    """
                                }
                            }
                        }
                    }
                }

                stage('Validate State Environment') {
                    steps {
                        withCredentials([file(credentialsId: "${ENV_CREDENTIAL}", variable: 'GOOGLE_APPLICATION_CREDENTIALS')]) {
                            dir('terraform') {
                                script {
                                    echo '=========================================='
                                    echo 'Validating Terraform state matches target environment'
                                    echo '=========================================='

                                    def stateCheck = sh(
                                        script: """
                                            terraform show -json 2>/dev/null | jq -r '.values.root_module.resources[]? | select(.type == "google_cloud_run_service") | .values.project' | head -1 || echo ''
                                        """,
                                        returnStdout: true
                                    ).trim()

                                    echo "Expected Project: ${GCP_PROJECT_ID}"
                                    echo "State Project: ${stateCheck ?: '(empty state - first deployment)'}"

                                    if (stateCheck && stateCheck != "" && stateCheck != "${GCP_PROJECT_ID}") {
                                        error """
========================================
CRITICAL ERROR: State Contamination Detected!
========================================
Expected Project: ${GCP_PROJECT_ID}
Found in State:   ${stateCheck}

This deployment would DESTROY resources in the wrong environment!
Aborting to prevent cross-environment contamination.

Action Required:
1. Verify you selected the correct ENVIRONMENT parameter
2. Check Jenkins workspace for leftover state files
3. Contact DevOps team if this persists
========================================
                                        """
                                    }

                                    echo "State validation passed"
                                }
                            }
                        }
                    }
                }

                stage('Terraform Validate') {
                    steps {
                        withCredentials([file(credentialsId: "${ENV_CREDENTIAL}", variable: 'GOOGLE_APPLICATION_CREDENTIALS')]) {
                            dir('terraform') {
                                script {
                                    echo 'Validating Terraform configuration...'
                                    sh 'terraform validate -no-color'
                                }
                            }
                        }
                    }
                }

                stage('Fetch Secrets') {
                    steps {
                        withCredentials([file(credentialsId: "${ENV_CREDENTIAL}", variable: 'GOOGLE_APPLICATION_CREDENTIALS')]) {
                            script {
                                def fetchSecret = { secretName, placeholder ->
                                    try {
                                        return sh(
                                            script: """
                                                gcloud secrets versions access latest \
                                                    --secret=vhealth-${params.ENVIRONMENT}-${secretName} \
                                                    --project=${GCP_PROJECT_ID} 2>/dev/null \
                                                || echo '${placeholder}'
                                            """,
                                            returnStdout: true
                                        ).trim()
                                    } catch (Exception e) {
                                        return placeholder
                                    }
                                }

                                echo 'Fetching secrets from GCP Secret Manager...'
                                env.TF_VAR_next_public_api_url = fetchSecret("api-url", "https://api.placeholder.com")
                                echo 'Secrets fetched!'
                            }
                        }
                    }
                }

                stage('Validate Docker Image') {
                    steps {
                        withCredentials([file(credentialsId: "${ENV_CREDENTIAL}", variable: 'GOOGLE_APPLICATION_CREDENTIALS')]) {
                            script {
                                echo 'Validating Docker image exists...'
                                def imageExists = sh(
                                    script: """
                                        gcloud artifacts docker images describe ${IMAGE_FULL} \
                                            --project=${GCP_PROJECT_ID} \
                                            >/dev/null 2>&1 && echo 'true' || echo 'false'
                                    """,
                                    returnStdout: true
                                ).trim()

                                if (imageExists == 'false') {
                                    echo "WARNING: Image ${IMAGE_FULL} does not exist!"
                                    echo "This happens when pipeline is restarted from Terraform stage."
                                    echo "Falling back to 'latest' tag..."
                                    env.IMAGE_DEPLOYMENT = "${IMAGE_LATEST}"
                                } else {
                                    echo "Image ${IMAGE_FULL} exists"
                                    env.IMAGE_DEPLOYMENT = "${IMAGE_FULL}"
                                }

                                echo "Image to deploy: ${env.IMAGE_DEPLOYMENT}"
                            }
                        }
                    }
                }

                stage('Terraform Plan') {
                    steps {
                        withCredentials([file(credentialsId: "${ENV_CREDENTIAL}", variable: 'GOOGLE_APPLICATION_CREDENTIALS')]) {
                            dir('terraform') {
                                script {
                                    echo '=========================================='
                                    echo 'Planning Terraform changes'
                                    echo "Environment: ${params.ENVIRONMENT}"
                                    echo "Project: ${GCP_PROJECT_ID}"
                                    echo "Image: ${env.IMAGE_DEPLOYMENT}"
                                    echo '=========================================='

                                    sh """
                                        terraform plan \
                                            -var-file="environments/${params.ENVIRONMENT}.tfvars" \
                                            -var "image_url=${env.IMAGE_DEPLOYMENT}" \
                                            -out=tfplan \
                                            -no-color
                                    """

                                    echo '=========================================='
                                    echo 'Validating Terraform plan for cross-environment operations'
                                    echo '=========================================='

                                    // Check if plan contains operations on wrong environment
                                    def wrongEnvCheck = sh(
                                        script: """
                                            terraform show -json tfplan | jq -r '.resource_changes[]? | select(.change.actions[] | contains("delete") or contains("create")) | .address' | grep -v "${params.ENVIRONMENT}" || echo ''
                                        """,
                                        returnStdout: true
                                    ).trim()

                                    if (wrongEnvCheck) {
                                        echo "WARNING: Plan contains operations on resources not matching environment: ${params.ENVIRONMENT}"
                                        echo "Resources: ${wrongEnvCheck}"
                                        // Note: Not failing here as resource names might legitimately differ
                                        // But logging for audit purposes
                                    }

                                    echo "Plan validation complete"
                                }
                            }
                        }
                    }
                }

                stage('Terraform Apply') {
                    steps {
                        withCredentials([file(credentialsId: "${ENV_CREDENTIAL}", variable: 'GOOGLE_APPLICATION_CREDENTIALS')]) {
                            dir('terraform') {
                                script {
                                    echo 'Deploying to Cloud Run via Terraform...'
                                    sh 'terraform apply -auto-approve -no-color tfplan'

                                    sh '''
                                        terraform output -json > terraform_outputs.json
                                        cat terraform_outputs.json
                                    '''

                                    def serviceUrl = sh(
                                        script: 'terraform output -raw service_url',
                                        returnStdout: true
                                    ).trim()

                                    echo "=========================================="
                                    echo "Deployment Successful!"
                                    echo "Service URL: ${serviceUrl}"
                                    echo "Image Deployed: ${env.IMAGE_DEPLOYMENT}"
                                    echo "=========================================="
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    post {
        success {
            echo '=========================================='
            echo 'Deployment completed successfully!'
            echo "Environment: ${params.ENVIRONMENT}"
            echo "Image Deployed: ${env.IMAGE_DEPLOYMENT ?: IMAGE_FULL}"
            echo '=========================================='
        }
        failure {
            echo '=========================================='
            echo 'Deployment failed!'
            echo "Environment: ${params.ENVIRONMENT}"
            echo 'Check logs for details'
            echo '=========================================='
        }
        always {
            script {
                echo 'Cleaning up resources...'

                sh 'docker system prune -f || true'

                dir('terraform') {
                    sh '''
                        echo 'Cleaning Terraform workspace for next deployment'
                        rm -rf .terraform .terraform.lock.hcl terraform.tfstate* tfplan || true
                    '''
                }

                echo 'Cleanup complete'
            }
        }
    }
}
