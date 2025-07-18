#!/bin/bash

echo "========================================"
echo "🚀 SETUP RAPIDE - COMMUNITY LAB BURUNDI"
echo "========================================"

# Fonction pour afficher les erreurs
handle_error() {
    echo "❌ Erreur: $1"
    exit 1
}

# Vérifier Python
if ! command -v python3 &> /dev/null; then
    if ! command -v python &> /dev/null; then
        handle_error "Python n'est pas installé"
    else
        PYTHON_CMD="python"
    fi
else
    PYTHON_CMD="python3"
fi

echo "📦 Création de l'environnement virtuel..."
$PYTHON_CMD -m venv venv || handle_error "Création de l'environnement virtuel"

echo "🔧 Activation de l'environnement virtuel..."
source venv/bin/activate || handle_error "Activation de l'environnement virtuel"

echo "📥 Installation des dépendances..."
pip install -r requirements.txt || handle_error "Installation des dépendances"

echo "📋 Configuration de l'environnement..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ Fichier .env créé"
fi

echo "🗄️ Configuration de la base de données..."
python manage.py migrate || handle_error "Migrations de base de données"

echo "👤 Création du superutilisateur..."
python create_superuser.py || echo "⚠️ Erreur lors de la création du superutilisateur"

echo "🔧 Ajout des équipements d'exemple..."
python populate_equipment.py || echo "⚠️ Erreur lors de l'ajout des équipements"

echo ""
echo "========================================"
echo "✅ INSTALLATION TERMINÉE !"
echo "========================================"
echo ""
echo "🌐 Pour démarrer le serveur :"
echo "   python manage.py runserver"
echo ""
echo "📱 Accès à l'application :"
echo "   http://localhost:8000"
echo ""
echo "📚 Documentation API :"
echo "   http://localhost:8000/docs/swagger/"
echo ""
echo "👨‍💼 Interface Admin :"
echo "   http://localhost:8000/admin/"
echo "   Username: admin"
echo "   Password: admin123"
echo ""
echo "🎉 Community Laboratory Burundi est prêt !"
echo ""

# Demander si l'utilisateur veut démarrer le serveur
read -p "Voulez-vous démarrer le serveur maintenant ? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🚀 Démarrage du serveur..."
    python manage.py runserver
fi
