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

        stage('install') {
            steps {
                echo 'Hello there!'
                sh '''
                    npm ci
                '''
            }
        }

        stage('build') {
            steps {
                sh '''
                    CI= false npm run build
                    rm -r /var/www/codevert/front/
                    cp -r build/ /var/www/codevert/front
                '''
            }
        }
    }
}
