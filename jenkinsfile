pipeline{
  agent any 
  stages{
    stage('Bomanai'){
      steps{
         sh 'pip install --no-cache-dir --upgrade boman-cli'
         sh '~/.local/bin/boman-cli -a run -cicd jenkins'
      }
    }
  }
}
