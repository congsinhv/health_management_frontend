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
            name: 'SKIP_TESTS',
            defaultValue: false,
            description: 'Skip linting and format checks (faster builds)'
        )
    }

    environment {
        GCP_REGION = 'asia-southeast1'
        ENV = "${params.ENVIRONMENT}"
        GCP_PROJECT_ID = "${params.ENVIRONMENT == 'prod' ? 'vhealth-prod' : 'vhealth-dev'}"
        TF_BACKEND_BUCKET = "${GCP_PROJECT_ID}-frontend-tfstate"

        ARTIFACT_REGISTRY_REPO = "vhealth-frontend-${params.ENVIRONMENT}"
        IMAGE_NAME = "vhealth-frontend"
        IMAGE_TAG = "${env.BUILD_NUMBER}-${env.GIT_COMMIT.take(7)}"
        IMAGE_FULL = "${GCP_REGION}-docker.pkg.dev/${GCP_PROJECT_ID}/${ARTIFACT_REGISTRY_REPO}/${IMAGE_NAME}:${IMAGE_TAG}"
        IMAGE_LATEST = "${GCP_REGION}-docker.pkg.dev/${GCP_PROJECT_ID}/${ARTIFACT_REGISTRY_REPO}/${IMAGE_NAME}:latest"

        TF_IN_AUTOMATION = 'true'
        TF_VAR_FILE = "terraform/environments/${params.ENVIRONMENT}.tfvars"
        GOOGLE_APPLICATION_CREDENTIALS = credentials('gcp-service-account-key')

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
                    echo 'Authenticating to GCP...'
                    sh '''
                        gcloud auth activate-service-account --key-file=${GOOGLE_APPLICATION_CREDENTIALS}
                        gcloud config set project ${GCP_PROJECT_ID}
                        gcloud config set compute/region ${GCP_REGION}
                        gcloud auth configure-docker ${GCP_REGION}-docker.pkg.dev --quiet
                    '''
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

                stage('Fetch Secrets') {
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
                            env.TF_VAR_next_public_api_url = fetchSecret("${params.ENVIRONMENT}-api-url", "https://api.placeholder.com")
                            echo 'Secrets fetched!'
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
                                        -var "image_url=${IMAGE_FULL}" \
                                        -out=tfplan \
                                        -no-color
                                """
                            }
                        }
                    }
                }

                stage('Approve Deployment') {
                    when {
                        expression { return params.ENVIRONMENT == 'prod' }
                    }
                    steps {
                        script {
                            echo 'Production deployment - Manual approval required'
                            input message: 'Deploy to PRODUCTION?',
                                  ok: 'Deploy',
                                  submitter: 'admin'
                        }
                    }
                }

                stage('Terraform Apply') {
                    steps {
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
                                echo "Image: ${IMAGE_FULL}"
                                echo "=========================================="
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
            echo "Image: ${IMAGE_FULL}"
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
            sh '''
                docker system prune -f || true
            '''
        }
    }
}
