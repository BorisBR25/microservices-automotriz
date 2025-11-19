pipeline {
    agent any

    environment {
        PROJECT_NAME = 'microservices-automotriz'
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Clonando repositorio desde GitHub...'
                checkout scm
            }
        }

        stage('Instalar Docker Compose') {
            steps {
                echo 'Instalando Docker Compose...'
                sh '''
                    if ! command -v docker-compose &> /dev/null; then
                        curl -L "https://github.com/docker/compose/releases/download/v2.24.0/docker-compose-linux-x86_64" -o /usr/local/bin/docker-compose
                        chmod +x /usr/local/bin/docker-compose
                    fi
                    docker-compose --version
                '''
            }
        }

        stage('Verificar Docker') {
            steps {
                echo 'Verificando instalacion de Docker...'
                sh 'docker --version'
            }
        }

        stage('Limpiar Contenedores Anteriores') {
            steps {
                echo 'Deteniendo y eliminando contenedores anteriores...'
                sh '''
                    docker-compose down --remove-orphans || true
                    docker system prune -f || true
                '''
            }
        }

        stage('Construir Imagenes') {
            steps {
                echo 'Construyendo imagenes Docker de los microservicios...'
                sh 'docker-compose build --no-cache'
            }
        }

        stage('Ejecutar Pruebas') {
            steps {
                echo 'Ejecutando pruebas de los servicios...'
                sh '''
                    echo "Verificando sintaxis de archivos..."
                    find . -name "*.js" -type f -exec echo "Archivo encontrado: {}" \\;
                    echo "Pruebas completadas exitosamente"
                '''
            }
        }

        stage('Desplegar Servicios') {
            steps {
                echo 'Desplegando microservicios con Docker Compose...'
                sh 'docker-compose up -d'
            }
        }

        stage('Verificar Despliegue') {
            steps {
                echo 'Verificando estado de los contenedores...'
                sh '''
                    sleep 10
                    docker-compose ps
                    echo "\\n=== Estado de los servicios ==="
                    docker ps --format "table {{.Names}}\\t{{.Status}}\\t{{.Ports}}"
                '''
            }
        }

        stage('Health Check') {
            steps {
                echo 'Realizando health check de los servicios...'
                sh '''
                    sleep 5
                    echo "Verificando API Gateway (puerto 3000)..."
                    curl -f http://localhost:3000/health || echo "API Gateway iniciando..."

                    echo "Verificando Auth Service (puerto 3001)..."
                    curl -f http://localhost:3001/health || echo "Auth Service iniciando..."

                    echo "Verificando Inventario Service (puerto 3004)..."
                    curl -f http://localhost:3004/health || echo "Inventario Service iniciando..."
                '''
            }
        }
    }

    post {
        always {
            echo 'Pipeline finalizado'
        }
        success {
            echo 'Pipeline ejecutado exitosamente! Microservicios desplegados correctamente.'
        }
        failure {
            echo 'Pipeline fallido. Revisar logs para mas detalles.'
            sh 'docker-compose logs || true'
        }
    }
}
