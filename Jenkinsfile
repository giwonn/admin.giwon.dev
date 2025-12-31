pipeline {
    agent any

    environment {
        NETWORK_NAME = 'blog-network'
    }

    triggers {
        githubPush()
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Ensure Network Exists') {
            steps {
                script {
                    sh "docker network create ${NETWORK_NAME} || true"
                }
            }
        }

        stage('Build & Deploy') {
            steps {
                script {
                    sh "docker compose build --no-cache"
                    sh "docker compose up -d"
                }
            }
        }

        stage('Cleanup') {
            steps {
                script {
                    sh "docker image prune -f"
                }
            }
        }
    }

    post {
        success {
            echo 'Deployment successful!'
        }
        failure {
            echo 'Deployment failed!'
        }
    }
}
