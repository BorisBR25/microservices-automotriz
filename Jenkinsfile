pipeline {
    agent any

    stages {
        stage('Clonar Repositorio') {
            steps {
                echo 'Clonando repositorio...'
                checkout scm
            }
        }

        stage('Ejecutar Pruebas') {
            steps {
                echo 'Ejecutando pruebas en contenedores temporales...'

                script {
                    def services = ['api-gateway', 'inventario-service']

                    for (service in services) {
                        echo "Testing ${service}..."

                        // Crear Dockerfile temporal para testing
                        sh """
                            cat > ${service}/Dockerfile.test <<'EOF'
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run test:cov
EOF
                        """

                        // Construir y ejecutar pruebas
                        sh """
                            docker build -f ${service}/Dockerfile.test -t ${service}-test ${service}
                            docker create --name ${service}-test-container ${service}-test
                            docker cp ${service}-test-container:/app/coverage ./coverage-${service}
                            docker rm ${service}-test-container
                        """
                    }
                }
            }
        }

        stage('Subir Cobertura a Codecov') {
            steps {
                echo 'Subiendo reportes de cobertura a Codecov...'

                script {
                    def services = ['api-gateway', 'inventario-service']

                    withCredentials([string(credentialsId: 'codecov-token', variable: 'CODECOV_TOKEN')]) {
                        // Descargar codecov CLI una sola vez
                        sh """
                            curl -Os https://cli.codecov.io/latest/linux/codecov
                            chmod +x codecov
                        """

                        for (service in services) {
                            echo "Preparando y subiendo cobertura de ${service}..."
                            sh """
                                # Ajustar rutas en lcov.info para que sean relativas al repositorio
                                sed -i 's|SF:/app/|SF:${service}/|g' coverage-${service}/lcov.info

                                # Subir a Codecov
                                ./codecov upload-process --fail-on-error -t ${CODECOV_TOKEN} -f coverage-${service}/lcov.info -F ${service}
                            """
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
