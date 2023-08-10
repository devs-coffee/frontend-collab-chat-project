pipeline {
    agent any 
    
    stages {
        stage('Clean') {
            steps {
                sh 'printenv'
                cleanWs()
            }
        }
        
        stage('Checkout') {
            steps {
                checkout([$class: 'GitSCM', branches: [[name: '*/main']],
                userRemoteConfigs: [[url: 'https://github.com/devs-coffee/frontend-collab-chat-project']]])
            }
        }

        stage('Install') {
            steps {
                echo 'Hello there!'
                sh '''
                    npm ci
                '''
            }
        }

        stage('Build') {
            steps {
                sh '''
                    cp /var/www/codevert/environments/front/.env .
                    CI=false npm run build
                    rm -r /var/www/codevert/front/
                    cp -r build/ /var/www/codevert/front
                '''
            }
        }

        stage('Update portainer') {
            steps {
                sh '''
                    docker service update --force codevert_front
                '''
            }
        }
    }
}
