#!/usr/bin/env python
"""
Script de vérification du déploiement ComLab
"""
import os
import sys
import subprocess
import requests
import time
from datetime import datetime

def run_command(command, description):
    """Exécuter une commande et afficher le résultat"""
    print(f"🔄 {description}...")
    try:
        result = subprocess.run(command, shell=True, capture_output=True, text=True)
        if result.returncode == 0:
            print(f"✅ {description} - OK")
            return True
        else:
            print(f"❌ {description} - ERREUR")
            print(f"   {result.stderr}")
            return False
    except Exception as e:
        print(f"❌ {description} - EXCEPTION: {e}")
        return False

def check_api_endpoints():
    """Vérifier que les endpoints API fonctionnent"""
    print("🔄 Vérification des endpoints API...")
    
    # Attendre que le serveur démarre
    time.sleep(3)
    
    try:
        # Test de l'endpoint de base
        response = requests.get('http://localhost:8000/api/', timeout=5)
        if response.status_code == 200:
            print("✅ API de base accessible")
            return True
        else:
            print(f"❌ API de base - Status: {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ API de base - Erreur de connexion: {e}")
        return False

def main():
    """Fonction principale de vérification"""
    print("=" * 60)
    print("🚀 VÉRIFICATION DU DÉPLOIEMENT COMLAB")
    print("=" * 60)
    
    checks = []
    
    # 1. Vérification des dépendances
    checks.append(run_command(
        "python -c \"import django; print('Django version:', django.get_version())\"",
        "Vérification de Django"
    ))
    
    # 2. Vérification de la configuration
    checks.append(run_command(
        "python manage.py check",
        "Vérification de la configuration Django"
    ))
    
    # 3. Vérification des migrations
    checks.append(run_command(
        "python manage.py showmigrations --plan",
        "Vérification des migrations"
    ))
    
    # 4. Collecte des fichiers statiques
    checks.append(run_command(
        "python manage.py collectstatic --noinput",
        "Collecte des fichiers statiques"
    ))
    
    # 5. Démarrage du serveur en arrière-plan
    print("🔄 Démarrage du serveur de développement...")
    server_process = subprocess.Popen(
        ["python", "manage.py", "runserver", "8000"],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE
    )
    
    # 6. Vérification des endpoints API
    api_check = check_api_endpoints()
    checks.append(api_check)
    
    # Arrêter le serveur
    server_process.terminate()
    server_process.wait()
    
    # Résumé
    print("\n" + "=" * 60)
    print("📊 RÉSUMÉ DE LA VÉRIFICATION")
    print("=" * 60)
    
    passed = sum(checks)
    total = len(checks)
    
    print(f"✅ Tests réussis: {passed}/{total}")
    print(f"❌ Tests échoués: {total - passed}/{total}")
    
    if passed == total:
        print("\n🎉 DÉPLOIEMENT PRÊT POUR LA PRODUCTION!")
        print("\n📋 PROCHAINES ÉTAPES:")
        print("   1. Configurer PostgreSQL pour la production")
        print("   2. Configurer un serveur web (Nginx + Gunicorn)")
        print("   3. Configurer les variables d'environnement")
        print("   4. Mettre en place la surveillance et les logs")
    else:
        print("\n⚠️  CORRECTIONS NÉCESSAIRES AVANT LA PRODUCTION")
        print("   Veuillez corriger les erreurs ci-dessus")
    
    return passed == total

if __name__ == '__main__':
    success = main()
    sys.exit(0 if success else 1)
