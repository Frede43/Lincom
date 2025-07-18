#!/usr/bin/env python
"""
Script pour configurer et pousser le projet vers GitHub
"""
import os
import subprocess
import sys
from pathlib import Path

def run_command(command, description, check=True):
    """Exécuter une commande et afficher le résultat"""
    print(f"🔄 {description}...")
    try:
        result = subprocess.run(command, shell=True, capture_output=True, text=True, check=check)
        if result.returncode == 0:
            print(f"✅ {description} - OK")
            if result.stdout.strip():
                print(f"   Output: {result.stdout.strip()}")
            return True
        else:
            print(f"❌ {description} - ERREUR")
            if result.stderr.strip():
                print(f"   Erreur: {result.stderr.strip()}")
            return False
    except subprocess.CalledProcessError as e:
        print(f"❌ {description} - EXCEPTION: {e}")
        if e.stderr:
            print(f"   Erreur: {e.stderr}")
        return False

def check_git_installed():
    """Vérifier que Git est installé"""
    return run_command("git --version", "Vérification de Git", check=False)

def check_github_repo_exists():
    """Vérifier si le repository GitHub existe"""
    result = subprocess.run(
        "git ls-remote https://github.com/Frede43/Lincom.git",
        shell=True, capture_output=True, text=True
    )
    return result.returncode == 0

def setup_git_repository():
    """Configurer le repository Git local"""
    commands = [
        ("git init", "Initialisation du repository Git"),
        ("git add .", "Ajout de tous les fichiers"),
        ('git commit -m "Initial commit: Community Laboratory Burundi platform"', "Commit initial"),
        ("git branch -M main", "Renommage de la branche en main"),
        ("git remote add origin https://github.com/Frede43/Lincom.git", "Ajout du remote GitHub")
    ]
    
    for command, description in commands:
        if not run_command(command, description, check=False):
            return False
    return True

def push_to_github():
    """Pousser le code vers GitHub"""
    return run_command(
        "git push -u origin main", 
        "Push vers GitHub", 
        check=False
    )

def create_development_branch():
    """Créer une branche de développement"""
    commands = [
        ("git checkout -b develop", "Création de la branche develop"),
        ("git push -u origin develop", "Push de la branche develop")
    ]
    
    for command, description in commands:
        run_command(command, description, check=False)

def setup_github_actions():
    """Créer les workflows GitHub Actions"""
    github_dir = Path(".github/workflows")
    github_dir.mkdir(parents=True, exist_ok=True)
    
    # Workflow CI/CD
    ci_workflow = """name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:13
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: comlab_test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Set up Python
      uses: actions/setup-python@v4
      with:
        python-version: '3.9'
    
    - name: Install dependencies
      run: |
        python -m pip install --upgrade pip
        pip install -r requirements.txt
    
    - name: Run migrations
      run: |
        python manage.py migrate
      env:
        DATABASE_URL: postgresql://postgres:postgres@localhost:5432/comlab_test
    
    - name: Run tests
      run: |
        python manage.py test
        python test_apis.py
      env:
        DATABASE_URL: postgresql://postgres:postgres@localhost:5432/comlab_test
    
    - name: Run deployment check
      run: |
        python deploy_check.py
      env:
        DATABASE_URL: postgresql://postgres:postgres@localhost:5432/comlab_test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Deploy to production
      run: |
        echo "🚀 Deployment would happen here"
        # Add your deployment commands here
"""
    
    with open(github_dir / "ci.yml", "w", encoding="utf-8") as f:
        f.write(ci_workflow)
    
    print("✅ Workflow GitHub Actions créé")

def main():
    """Fonction principale"""
    print("=" * 60)
    print("🚀 CONFIGURATION GITHUB - COMMUNITY LABORATORY BURUNDI")
    print("=" * 60)
    
    # Vérifications préliminaires
    if not check_git_installed():
        print("❌ Git n'est pas installé. Veuillez l'installer d'abord.")
        return False
    
    # Vérifier si le repository GitHub existe
    if not check_github_repo_exists():
        print("⚠️  Le repository GitHub n'existe pas encore.")
        print("   Veuillez créer le repository https://github.com/Frede43/Lincom.git d'abord")
        print("   Puis relancer ce script.")
        return False
    
    print("✅ Repository GitHub trouvé")
    
    # Configuration Git locale
    if not setup_git_repository():
        print("❌ Échec de la configuration Git locale")
        return False
    
    # Création des workflows GitHub Actions
    setup_github_actions()
    
    # Commit des workflows
    run_command("git add .github/", "Ajout des workflows GitHub Actions", check=False)
    run_command('git commit -m "Add GitHub Actions CI/CD workflow"', "Commit des workflows", check=False)
    
    # Push vers GitHub
    if push_to_github():
        print("🎉 Code poussé vers GitHub avec succès!")
    else:
        print("⚠️  Problème lors du push. Vérifiez vos permissions GitHub.")
        print("   Vous devrez peut-être vous authentifier ou configurer SSH.")
    
    # Création de la branche develop
    create_development_branch()
    
    # Instructions finales
    print("\n" + "=" * 60)
    print("📋 PROCHAINES ÉTAPES")
    print("=" * 60)
    print("1. 🌐 Visitez: https://github.com/Frede43/Lincom")
    print("2. 📝 Configurez les secrets GitHub pour le déploiement")
    print("3. 🔧 Activez GitHub Pages si nécessaire")
    print("4. 👥 Invitez des collaborateurs")
    print("5. 📊 Configurez les issues et projects")
    print("6. 🏷️ Créez votre première release")
    
    print(f"\n🎯 Repository configuré avec succès!")
    print(f"   📂 Local: {os.getcwd()}")
    print(f"   🌐 GitHub: https://github.com/Frede43/Lincom")
    
    return True

if __name__ == '__main__':
    success = main()
    sys.exit(0 if success else 1)
