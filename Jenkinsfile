pipeline {
    agent any
    stages {
        stage('Authenticate') {
            steps {
                withDockerRegistry(credentialsId: 'dockerhub', url: 'https://index.docker.io/v1/') {}
            }
        }
    }
}
