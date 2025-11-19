FROM jenkins/jenkins:lts

USER root

# Instalar Docker
RUN apt-get update && \
    apt-get install -y docker.io && \
    apt-get clean

# Dar permisos al usuario jenkins
RUN usermod -aG docker jenkins

# Mantener como root para evitar problemas de permisos
# USER jenkins
