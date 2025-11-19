pipeline {
    agent any

    stages {
        stage('Clonar Repositorio') {
            steps {
                echo 'Clonando repositorio...'
                checkout scm
            }
        }

        stage('Construir Imagenes') {
            steps {
                echo 'Construyendo imagenes Docker...'
                sh 'docker build -t api-gateway ./api-gateway'
                sh 'docker build -t auth-service ./auth-service'
                sh 'docker build -t inventario-service ./inventario-service'
            }
        }

        stage('Listar Imagenes') {
            steps {
                echo 'Imagenes construidas:'
                sh 'docker images | grep -E "api-gateway|auth-service|inventario-service"'
            }
        }
    }

    post {
        success {
            echo 'Pipeline ejecutado exitosamente!'
        }
        failure {
            echo 'Pipeline fallido.'
        }
    }
}
