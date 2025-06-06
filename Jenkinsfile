pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "${DOCKER_USERNAME}/react-app:latest"
        CONTAINER_NAME = 'react-app'
    }

    stages {
        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Clean Old Containers') {
            steps {
                script {
                    echo 'Stopping and removing old containers (if any)...'
                    sh 'docker-compose down || true'
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    echo 'Building Docker image...'
                    sh 'docker-compose build'
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                script {
                    echo 'Pushing Docker image to registry...'
                    sh 'docker login -u $DOCKER_USERNAME -p $DOCKER_PASSWORD'
                    sh 'docker push $DOCKER_IMAGE'
                }
            }
        }

        stage('Deploy New Container') {
            steps {
                script {
                    echo 'Deploying new container...'
                    sh 'docker-compose up -d'
                }
            }
        }
    }

    post {
        always {
            cleanWs()
        }
    }
}
