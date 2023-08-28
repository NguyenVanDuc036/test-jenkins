pipeline {
    agent any
    stages {
        stage('Login Docker Hub') {
            steps {
                withDockerRegistry(credentialsId: 'dockerhub', url: 'https://index.docker.io/v1/') {}
            }
        }

         stage('Build and Push') {
            steps {
                script {
                    def image = docker.build("nguyenduc036/jenkins")
                    image.push()
                    image.push("latest")
                }
            }
        }
    }
}
