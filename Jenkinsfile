pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'urutare/open-esm-service'
        DOCKER_REGISTRY = 'https://registry.hub.docker.com'
        DOCKER_TAG = "${DOCKER_IMAGE}:latest"
        DOCKERHUB_CREDENTIALS = 'docker-hub-credentials-id'
        DEPLOY_SERVER = credentials('deployment_server_ip')
        REMOTE_PROJECT_DIR = "/root/open-esm"
    }
  
    stages {
        stage('Build Docker Image') {
            steps {
                script {
                    // Build the Docker image using the Dockerfile in the project root
                    def dockerImage = docker.build("${DOCKER_TAG}")

                    // Check if the build was successful before pushing
                    if (dockerImage != null) {
                        echo 'Docker build successful'
                        currentBuild.result = 'SUCCESS'
                    } else {
                        echo 'Docker build failed'
                        currentBuild.result = 'FAILURE'
                    }
                }
            }
        }

        stage('Push Docker Image to Docker Hub') {
            steps {
                script {
                    // Push the Docker image to Docker Hub
                    docker.withRegistry('https://registry.hub.docker.com', 'docker-hub-credentials-id') {
                        def dockerImage = docker.image("${DOCKER_TAG}")

                        // Check if the image exists before pushing
                        if (dockerImage != null) {
                            dockerImage.push()
                            echo 'Docker push successful'
                        } else {
                            echo 'Docker push failed'
                            currentBuild.result = 'FAILURE'
                        }
                    }
                }
            }
        }

        stage('Deploy to Remote Server') {
            steps {
                // Use withCredentials to retrieve username and password
                withCredentials([usernamePassword(credentialsId: 'urutare_server',
                                                  usernameVariable: 'SSH_USERNAME',
                                                  passwordVariable: 'SSH_PASSWORD')]) {
                    script {
                        def remote = [:]
                        remote.name = 'server'
                        remote.host = DEPLOY_SERVER
                        remote.user = SSH_USERNAME
                        remote.password = SSH_PASSWORD
                        remote.allowAnyHosts = true

                        echo "Connecting to remote server: ${remote.host}"

                        // Command to execute on the remote server
                        def commands = """
                            set -e  # Exit immediately if a command exits with a non-zero status
                            cd "${REMOTE_PROJECT_DIR}" || exit 1
                            echo "Changed to directory: \$(pwd)"

                            # Pull the latest image for the service
                            docker-compose pull openmrs_frontend

                            # Bring the service up with force recreate
                            docker-compose up -d --build --remove-orphans --no-deps openmrs_frontend

                        """

                        sshCommand remote: remote, command: commands
                    }
                }
            }
        }

    }

    post {
        always {
            echo 'One way or another, I have finished'
            cleanWs()
        }
        success {
            script {
                echo "I am successful"
            }
        }
        unstable {
            echo 'I am unstable :/'
        }
        failure {
            script {
                echo "I am a failure"
            }
        }
        changed {
            echo 'Things were different before...'
        }
    }
}