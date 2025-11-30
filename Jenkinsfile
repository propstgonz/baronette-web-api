pipeline {
  agent any

  environment {
    // Fuerza a Docker Compose a usar el workspace correcto
    COMPOSE = "docker compose --project-directory ${WORKSPACE}"
  }

  stages {

    stage('Checkout') {
      steps {
        echo '📥 Descargando repo...'
        checkout scm
      }
    }

    stage('Validar carpeta src') {
      steps {
        script {
          sh """
            echo '📂 Workspace actual:' 
            pwd
            echo '📂 Contenido:'
            ls -la

            echo '📂 Verificando carpeta src...'
            if [ ! -d src ]; then
              echo '❌ ERROR: La carpeta src NO existe en el workspace'
              exit 1
            fi

            echo '✔ Carpeta src encontrada correctamente.'
          """
        }
      }
    }

    stage('Stop Previous Deployment') {
      steps {
        script {
          echo '🛑 Deteniendo despliegue previo...'
          sh """
            cd ${WORKSPACE}
            ${COMPOSE} down --remove-orphans || true
          """
        }
      }
    }

    stage('Rebuild & Deploy') {
      steps {
        script {
          echo '🚀 Reconstruyendo y levantando servicio...'
          sh """
            cd ${WORKSPACE}
            ${COMPOSE} build --no-cache
            ${COMPOSE} up -d
          """
        }
      }
    }

    stage('Verify Deployment') {
      steps {
        script {
          echo '🔍 Verificando contenedores...'
          sh """
            sleep 5
            cd ${WORKSPACE}
            ${COMPOSE} ps
            ${COMPOSE} logs --tail=100
          """
        }
      }
    }

    stage('Cleanup Docker') {
      steps {
        script {
          echo '🧹 Limpiando imágenes...'
          sh "docker system prune -f"
        }
      }
    }
  }

  post {
    success {
      echo '🎉 Despliegue completado correctamente.'
    }
    failure {
      echo '❌ El despliegue ha fallado.'
    }
  }
}
