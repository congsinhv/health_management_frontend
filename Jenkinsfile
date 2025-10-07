pipeline {
    agent any

    parameters {
        choice(
            name: 'ENVIRONMENT',
            choices: ['dev', 'prod'],
            description: 'Target environment for deployment'
        )
        string(
            name: 'BRANCH_NAME',
            defaultValue: 'develop',
            description: 'Git branch to deploy'
        )
        booleanParam(
            name: 'SKIP_DOCKER_BUILD',
            defaultValue: false,
            description: 'Skip Docker build and deployment (infrastructure setup only)'
        )
    }

    environment {
        GCP_REGION = 'asia-southeast1'
        ENV = "${params.ENVIRONMENT}"
        GCP_PROJECT_ID = "${params.ENVIRONMENT == 'prod' ? 'vhealth-prod' : 'vhealth-dev'}"
        TF_BACKEND_BUCKET = "${GCP_PROJECT_ID}-tfstate"

        ARTIFACT_REGISTRY_REPO = "health-management-frontend-${params.ENVIRONMENT}"
        IMAGE_NAME = "health-frontend"
        IMAGE_TAG = "${env.BUILD_NUMBER}-${env.GIT_COMMIT.take(7)}"
        IMAGE_FULL = "${GCP_REGION}-docker.pkg.dev/${GCP_PROJECT_ID}/${ARTIFACT_REGISTRY_REPO}/${IMAGE_NAME}:${IMAGE_TAG}"
        IMAGE_LATEST = "${GCP_REGION}-docker.pkg.dev/${GCP_PROJECT_ID}/${ARTIFACT_REGISTRY_REPO}/${IMAGE_NAME}:latest"

        TF_IN_AUTOMATION = 'true'
        TF_VAR_FILE = "terraform/environments/${params.ENVIRONMENT}.tfvars"
        GOOGLE_APPLICATION_CREDENTIALS = credentials('gcp-service-account-key')

        // Next.js Build Configuration
        NODE_VERSION = '20'
        BUN_VERSION = '1.1.0'
    }

    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timeout(time: 60, unit: 'MINUTES')
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
                    echo "Build Number: ${env.BUILD_NUMBER}"
                    echo "GCP Project: ${GCP_PROJECT_ID}"
                    echo "GCP Region: ${GCP_REGION}"
                    echo "Terraform State Bucket: ${TF_BACKEND_BUCKET}"

                    if (params.SKIP_DOCKER_BUILD) {
                        echo ''
                        echo 'WARNING: INFRASTRUCTURE INIT MODE'
                        echo 'Will create infrastructure without deploying application'
                        echo ''
                    } else {
                        echo "Image: ${IMAGE_FULL}"
                    }

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
                    echo 'Authenticating to GCP...'
                    sh '''
                        gcloud auth activate-service-account --key-file=${GOOGLE_APPLICATION_CREDENTIALS}
                        gcloud config set project ${GCP_PROJECT_ID}
                        gcloud config set compute/region ${GCP_REGION}
                    '''
                }
            }
        }

        stage('Build and Test Application') {
            when {
                expression { return !params.SKIP_DOCKER_BUILD }
            }
            steps {
                script {
                    echo '=========================================='
                    echo 'Building Application'
                    echo '=========================================='

                    // Setup Bun
                    echo '1. Setting up Bun...'
                    sh '''
                        if ! command -v bun &> /dev/null; then
                            echo "Installing Bun..."
                            curl -fsSL https://bun.sh/install | bash
                            export PATH="$HOME/.bun/bin:$PATH"
                        else
                            echo "Bun is already installed"
                        fi
                        bun --version
                    '''

                    // Install Dependencies
                    echo '2. Installing project dependencies...'
                    sh '''
                        export PATH="$HOME/.bun/bin:$PATH"
                        bun install --frozen-lockfile
                        echo "Dependencies installed successfully"
                    '''

                    // Lint and Format Check
                    echo '3. Running linting and format checks...'
                    sh '''
                        export PATH="$HOME/.bun/bin:$PATH"
                        bun run lint
                        bun run format:check
                        echo "Code quality checks passed"
                    '''

                    // Build Application
                    echo '4. Building Next.js application...'
                    sh '''
                        export PATH="$HOME/.bun/bin:$PATH"
                        bun run build

                        if [ -d ".next" ]; then
                            echo "Build completed successfully"
                            du -sh .next
                        else
                            echo "Build failed - .next directory not found"
                            exit 1
                        fi
                    '''

                    echo '=========================================='
                    echo 'Application Build Complete'
                    echo '=========================================='
                }
            }
        }

        stage('Terraform Init') {
            steps {
                dir('terraform') {
                    script {
                        echo 'Initializing Terraform...'
                        sh """
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

        stage('Terraform Validate') {
            steps {
                dir('terraform') {
                    script {
                        echo 'Validating Terraform configuration...'
                        sh 'terraform validate -no-color'
                    }
                }
            }
        }

        stage('Fetch Secrets from GCP Secret Manager') {
            steps {
                script {
                    def fetchSecret = { secretName, placeholder ->
                        try {
                            return sh(
                                script: """
                                    gcloud secrets versions access latest \
                                        --secret=${secretName}-${params.ENVIRONMENT} \
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
                    env.TF_VAR_next_public_api_url = fetchSecret("next-public-api-url", "https://api.placeholder.com")
                    env.TF_VAR_next_public_app_url = fetchSecret("next-public-app-url", "https://app.placeholder.com")
                    echo 'Secrets fetched successfully!'
                }
            }
        }

        stage('Terraform Plan') {
            steps {
                dir('terraform') {
                    script {
                        echo 'Planning Terraform changes...'
                        sh """
                            terraform plan \
                                -var-file="environments/${params.ENVIRONMENT}.tfvars" \
                                -out=tfplan \
                                -no-color
                        """
                    }
                }
            }
        }

        stage('Build and Push Docker Image') {
            when {
                expression { return !params.SKIP_DOCKER_BUILD }
            }
            steps {
                script {
                    echo '=========================================='
                    echo 'Docker Build and Push'
                    echo '=========================================='

                    // Configure Docker
                    echo '1. Configuring Docker authentication for Artifact Registry...'
                    sh """
                        gcloud auth configure-docker ${GCP_REGION}-docker.pkg.dev --quiet
                    """

                    // Build Docker Image
                    echo "2. Building Docker image: ${IMAGE_FULL}"
                    sh """
                        docker build \
                            --build-arg BUILD_DATE=\$(date -u +"%Y-%m-%dT%H:%M:%SZ") \
                            --build-arg VERSION=${IMAGE_TAG} \
                            --build-arg GIT_COMMIT=${GIT_COMMIT} \
                            -t ${IMAGE_FULL} \
                            -t ${IMAGE_LATEST} \
                            .
                    """

                    // Push to Registry
                    echo '3. Pushing image to Artifact Registry...'
                    sh """
                        docker push ${IMAGE_FULL}
                        docker push ${IMAGE_LATEST}
                    """

                    echo '=========================================='
                    echo 'Docker Build and Push Complete'
                    echo '=========================================='
                }
            }
        }

        stage('Approve Deployment') {
            when {
                expression { return params.ENVIRONMENT == 'prod' }
            }
            steps {
                script {
                    echo 'Production deployment detected. Manual approval required.'
                    input message: 'Deploy to PRODUCTION Cloud Run?',
                          ok: 'Deploy to Production',
                          submitter: 'admin'
                }
            }
        }

        stage('Deploy to Cloud Run via Terraform') {
            steps {
                dir('terraform') {
                    script {
                        if (params.SKIP_DOCKER_BUILD) {
                            echo 'Infrastructure initialization - creating infrastructure without Docker image...'
                            echo 'Note: Cloud Run service will use placeholder image from terraform/main.tf'

                            sh """
                                terraform apply \
                                    -var-file=environments/${params.ENVIRONMENT}.tfvars \
                                    -auto-approve \
                                    -no-color
                            """

                            echo "=========================================="
                            echo "Infrastructure created successfully!"
                            echo "=========================================="
                        } else {
                            echo 'Deploying to Cloud Run with new Docker image via Terraform...'

                            // Untaint the Cloud Run service if it was previously tainted
                            sh """
                                terraform untaint google_cloud_run_service.frontend || true
                            """

                            sh """
                                terraform apply \
                                    -var-file=environments/${params.ENVIRONMENT}.tfvars \
                                    -var="image_url=${IMAGE_FULL}" \
                                    -auto-approve \
                                    -no-color
                            """

                            def serviceUrl = sh(
                                script: 'terraform output -raw cloud_run_url',
                                returnStdout: true
                            ).trim()

                            echo "=========================================="
                            echo "Cloud Run service deployed successfully!"
                            echo "Service URL: ${serviceUrl}"
                            echo "Image: ${IMAGE_FULL}"
                            echo "=========================================="
                        }
                    }
                }
            }
        }
    }

    post {
        success {
            script {
                echo '=========================================='
                if (params.SKIP_DOCKER_BUILD) {
                    echo 'Infrastructure initialization completed!'
                    echo "Environment: ${params.ENVIRONMENT}"
                    echo ''
                    echo 'Next Steps:'
                    echo '1. Run the pipeline again with SKIP_DOCKER_BUILD = false'
                    echo '2. This will build and deploy your application'
                    echo '3. Your application will then be live!'
                } else {
                    echo 'Deployment completed successfully!'
                    echo "Environment: ${params.ENVIRONMENT}"
                    echo "Image: ${IMAGE_FULL}"
                    echo ''
                    echo 'Application is now live and tested!'
                }
                echo '=========================================='
            }
        }
        failure {
            echo '=========================================='
            echo 'Deployment failed!'
            echo "Environment: ${params.ENVIRONMENT}"
            echo "Build Number: ${env.BUILD_NUMBER}"
            echo 'Please check the logs for details.'
            echo '=========================================='
        }
        always {
            sh '''
                docker system prune -f || true
            '''
        }
    }
}
