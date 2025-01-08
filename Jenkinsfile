pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'react-app-dev:latest'
        CONTAINER_NAME = 'react-app-dev'
    }

    stages {
        stage('Grant Permissions') {
            steps {
                script {
                    // Cấp quyền cho thư mục node_modules và workspace
                    sh 'sudo chmod -R 777 /var/lib/jenkins/workspace/Front-end'
                }
            }
        }

        stage('Clean Old Containers') {
            steps {
                script {
                    sh """
                    if [ \$(docker ps -aq -f name=${CONTAINER_NAME}) ]; then
                        echo 'Stopping and removing old container...'
                        docker stop ${CONTAINER_NAME}
                        docker rm ${CONTAINER_NAME}
                    fi
                    """
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    sh 'docker build -t ${DOCKER_IMAGE} .'
                }
            }
        }

        stage('Deploy New Container') {
            steps {
                script {
                    sh 'docker-compose down'
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
