#!/usr/bin/env python
"""
Script de test et vérification du frontend Community Laboratory Burundi
"""
import os
import json
import subprocess
from pathlib import Path

def print_header(title):
    """Afficher un header stylé"""
    print("\n" + "=" * 60)
    print(f"🎯 {title}")
    print("=" * 60)

def print_success(message):
    """Afficher un message de succès"""
    print(f"✅ {message}")

def print_warning(message):
    """Afficher un avertissement"""
    print(f"⚠️  {message}")

def print_error(message):
    """Afficher une erreur"""
    print(f"❌ {message}")

def check_frontend_structure():
    """Vérifier la structure du frontend"""
    print_header("VÉRIFICATION STRUCTURE FRONTEND")
    
    frontend_path = Path("frontend")
    if not frontend_path.exists():
        print_error("Dossier frontend non trouvé")
        return False
    
    required_files = [
        "package.json",
        "vite.config.ts",
        "tailwind.config.ts",  # Fichier TypeScript au lieu de JS
        "tsconfig.json",
        "src/main.tsx",
        "src/App.tsx",
        "index.html"
    ]
    
    missing_files = []
    for file in required_files:
        file_path = frontend_path / file
        if file_path.exists():
            print_success(f"Fichier trouvé: {file}")
        else:
            missing_files.append(file)
            print_error(f"Fichier manquant: {file}")
    
    if missing_files:
        print_warning(f"{len(missing_files)} fichiers manquants")
        return False
    
    print_success("Structure frontend complète")
    return True

def check_dependencies():
    """Vérifier les dépendances"""
    print_header("VÉRIFICATION DÉPENDANCES")
    
    package_json_path = Path("frontend/package.json")
    if not package_json_path.exists():
        print_error("package.json non trouvé")
        return False
    
    with open(package_json_path, 'r', encoding='utf-8') as f:
        package_data = json.load(f)
    
    required_deps = {
        "react": "^18.0.0",
        "react-dom": "^18.0.0", 
        "typescript": "^5.0.0",
        "vite": "^5.0.0",
        "@radix-ui/react-slot": "*",
        "tailwindcss": "^3.0.0",
        "lucide-react": "*",
        "react-router-dom": "^6.0.0"
    }
    
    dependencies = {**package_data.get("dependencies", {}), **package_data.get("devDependencies", {})}
    
    missing_deps = []
    for dep, version in required_deps.items():
        if dep in dependencies:
            print_success(f"Dépendance trouvée: {dep} ({dependencies[dep]})")
        else:
            missing_deps.append(dep)
            print_error(f"Dépendance manquante: {dep}")
    
    if missing_deps:
        print_warning(f"{len(missing_deps)} dépendances manquantes")
        return False
    
    print_success("Toutes les dépendances requises sont présentes")
    return True

def check_pages_implementation():
    """Vérifier l'implémentation des pages"""
    print_header("VÉRIFICATION PAGES IMPLÉMENTÉES")
    
    src_path = Path("frontend/src")
    pages_path = src_path / "pages"
    
    required_pages = [
        # Phase 1: Découverte
        "Index.tsx",
        "About.tsx", 
        "Programs.tsx",
        
        # Phase 2: Authentification
        "Login.tsx",
        "Signup.tsx",
        "ForgotPassword.tsx",
        "EmailVerification.tsx",
        
        # Phase 3: Onboarding
        "OnboardingWelcome.tsx",
        "RoleSelection.tsx",
        "ProfileSetup.tsx",
        
        # Phase 4: Dashboards
        "dashboards/StudentDashboard.tsx",
        "dashboards/EntrepreneurDashboard.tsx", 
        "dashboards/MentorDashboard.tsx",
        "dashboards/AdminDashboard.tsx"
    ]
    
    implemented_pages = []
    missing_pages = []
    
    for page in required_pages:
        page_path = pages_path / page
        if page_path.exists():
            implemented_pages.append(page)
            print_success(f"Page implémentée: {page}")
        else:
            missing_pages.append(page)
            print_warning(f"Page manquante: {page}")
    
    print(f"\n📊 RÉSUMÉ PAGES:")
    print(f"✅ Implémentées: {len(implemented_pages)}/{len(required_pages)}")
    print(f"⚠️  Manquantes: {len(missing_pages)}")
    
    coverage = (len(implemented_pages) / len(required_pages)) * 100
    print(f"📈 Couverture: {coverage:.1f}%")
    
    return coverage >= 90

def check_components():
    """Vérifier les composants UI"""
    print_header("VÉRIFICATION COMPOSANTS UI")
    
    components_path = Path("frontend/src/components")
    ui_path = components_path / "ui"
    
    required_components = [
        "button.tsx",
        "input.tsx", 
        "card.tsx",
        "progress.tsx",
        "badge.tsx",
        "avatar.tsx",
        "dialog.tsx",
        "dropdown-menu.tsx",
        "form.tsx",
        "label.tsx",
        "select.tsx",
        "textarea.tsx",
        "checkbox.tsx",
        "radio-group.tsx"
    ]
    
    implemented_components = []
    missing_components = []
    
    for component in required_components:
        component_path = ui_path / component
        if component_path.exists():
            implemented_components.append(component)
            print_success(f"Composant trouvé: {component}")
        else:
            missing_components.append(component)
            print_warning(f"Composant manquant: {component}")
    
    coverage = (len(implemented_components) / len(required_components)) * 100
    print(f"\n📊 Couverture composants: {coverage:.1f}%")
    
    return coverage >= 80

def analyze_code_quality():
    """Analyser la qualité du code"""
    print_header("ANALYSE QUALITÉ DU CODE")
    
    src_path = Path("frontend/src")
    
    # Compter les fichiers TypeScript
    ts_files = list(src_path.rglob("*.tsx")) + list(src_path.rglob("*.ts"))
    print_success(f"Fichiers TypeScript: {len(ts_files)}")
    
    # Vérifier la configuration TypeScript
    tsconfig_path = Path("frontend/tsconfig.json")
    if tsconfig_path.exists():
        print_success("Configuration TypeScript présente")
    else:
        print_warning("Configuration TypeScript manquante")
    
    # Vérifier Tailwind
    tailwind_config_js = Path("frontend/tailwind.config.js")
    tailwind_config_ts = Path("frontend/tailwind.config.ts")
    if tailwind_config_js.exists() or tailwind_config_ts.exists():
        print_success("Configuration Tailwind présente")
    else:
        print_warning("Configuration Tailwind manquante")
    
    # Vérifier Vite
    vite_config = Path("frontend/vite.config.ts")
    if vite_config.exists():
        print_success("Configuration Vite présente")
    else:
        print_warning("Configuration Vite manquante")
    
    return True

def run_build_test():
    """Tester le build du frontend"""
    print_header("TEST DE BUILD")
    
    frontend_path = Path("frontend")
    if not frontend_path.exists():
        print_error("Dossier frontend non trouvé")
        return False
    
    try:
        # Changer vers le dossier frontend
        os.chdir(frontend_path)
        
        # Vérifier si node_modules existe
        if not Path("node_modules").exists():
            print("📦 Installation des dépendances...")
            result = subprocess.run(["npm", "install"], capture_output=True, text=True)
            if result.returncode != 0:
                print_error(f"Erreur installation: {result.stderr}")
                return False
            print_success("Dépendances installées")
        
        # Tester le build
        print("🏗️  Test de build...")
        result = subprocess.run(["npm", "run", "build"], capture_output=True, text=True)
        
        if result.returncode == 0:
            print_success("Build réussi")
            
            # Vérifier le dossier dist
            if Path("dist").exists():
                dist_files = list(Path("dist").rglob("*"))
                print_success(f"Fichiers générés: {len(dist_files)}")
            
            return True
        else:
            print_error(f"Erreur de build: {result.stderr}")
            return False
            
    except Exception as e:
        print_error(f"Erreur lors du test de build: {e}")
        return False
    finally:
        # Retourner au dossier racine
        os.chdir("..")

def generate_report():
    """Générer un rapport final"""
    print_header("RAPPORT FINAL")
    
    checks = [
        ("Structure Frontend", check_frontend_structure()),
        ("Dépendances", check_dependencies()),
        ("Pages Implémentées", check_pages_implementation()),
        ("Composants UI", check_components()),
        ("Qualité Code", analyze_code_quality()),
        ("Build Test", run_build_test())
    ]
    
    passed = sum(1 for _, result in checks if result)
    total = len(checks)
    
    print(f"\n📊 RÉSUMÉ FINAL:")
    print(f"✅ Tests réussis: {passed}/{total}")
    print(f"❌ Tests échoués: {total - passed}/{total}")
    
    score = (passed / total) * 100
    print(f"🎯 Score global: {score:.1f}%")
    
    if score >= 90:
        print("🎉 FRONTEND EXCELLENT - Prêt pour production!")
    elif score >= 75:
        print("👍 FRONTEND BON - Quelques améliorations nécessaires")
    elif score >= 50:
        print("⚠️  FRONTEND MOYEN - Corrections importantes requises")
    else:
        print("❌ FRONTEND INSUFFISANT - Refactoring nécessaire")
    
    return score >= 75

def main():
    """Fonction principale"""
    print("🌍 COMMUNITY LABORATORY BURUNDI - TEST FRONTEND")
    print("=" * 60)
    
    success = generate_report()
    
    if success:
        print("\n🚀 Le frontend est prêt pour l'intégration avec le backend Django!")
        print("📋 Prochaines étapes:")
        print("   1. Connecter les APIs Django REST")
        print("   2. Implémenter l'authentification JWT")
        print("   3. Ajouter les tests unitaires")
        print("   4. Optimiser les performances")
        print("   5. Déployer en production")
    else:
        print("\n⚠️  Des améliorations sont nécessaires avant la production")
    
    return success

if __name__ == '__main__':
    success = main()
    exit(0 if success else 1)
