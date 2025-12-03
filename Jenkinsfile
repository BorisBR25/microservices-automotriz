pipeline {
    agent any

    stages {
        stage('Clonar Repositorio') {
            steps {
                echo 'Clonando repositorio...'
                checkout scm
            }
        }

        stage('Instalar Dependencias y Ejecutar Pruebas') {
            agent {
                docker {
                    image 'node:18-alpine'
                    reuseNode true
                }
            }
            steps {
                echo 'Instalando dependencias y ejecutando pruebas...'

                script {
                    def services = ['api-gateway', 'auth-service', 'inventario-service']

                    for (service in services) {
                        echo "Procesando ${service}..."
                        dir(service) {
                            sh 'npm ci'
                            sh 'npm run test:cov'
                        }
                    }
                }
            }
        }

        stage('Subir Cobertura a Codecov') {
            agent {
                docker {
                    image 'node:18-alpine'
                    reuseNode true
                }
            }
            steps {
                echo 'Subiendo reportes de cobertura a Codecov...'

                script {
                    def services = ['api-gateway', 'auth-service', 'inventario-service']

                    withCredentials([string(credentialsId: 'codecov-token', variable: 'CODECOV_TOKEN')]) {
                        for (service in services) {
                            echo "Subiendo cobertura de ${service}..."
                            dir(service) {
                                sh '''
                                    apk add --no-cache curl bash
                                    curl -Os https://uploader.codecov.io/latest/linux/codecov
                                    chmod +x codecov
                                    ./codecov -t ${CODECOV_TOKEN} -f coverage/lcov.info -F ${service}
                                '''
                            }
                        }
                    }
                }
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
        always {
            echo 'Limpiando archivos temporales...'
            sh 'rm -f **/codecov'
        }
    }
}
