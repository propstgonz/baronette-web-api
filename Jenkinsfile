pipeline {
  agent any

  environment {
    COMPOSE_CMD = "docker compose --project-directory ${WORKSPACE}"
  }

  stages {

    stage('Checkout') {
      steps {
        echo 'Checking out code...'
        checkout scm
      }
    }

    stage('Stop Previous Deployment') {
      steps {
        script {
          echo 'Stopping previous deployment...'
          sh "${COMPOSE_CMD} down --remove-orphans || true"
        }
      }
    }

    stage('Recreate API container') {
      steps {
        script {
          sh """
            ${COMPOSE_CMD} build --no-cache
            ${COMPOSE_CMD} up -d
          """
        }
      }
    }

    stage('Verify Deployment') {
      steps {
        script {
          echo 'Verifying deployment...'
          sh """
            sleep 5
            ${COMPOSE_CMD} ps
            ${COMPOSE_CMD} logs --tail=50
          """
        }
      }
    }

    stage('Cleanup') {
      steps {
        script {
          echo '🧹 Cleaning up local images...'
          sh 'docker system prune -f'
        }
      }
    }
  }

  post {
    success {
      echo 'Deployment completed successfully.'
    }
    failure {
      echo 'Deployment failed.'
    }
  }
}
