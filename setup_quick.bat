@echo off
echo ========================================
echo 🚀 SETUP RAPIDE - COMMUNITY LAB BURUNDI
echo ========================================

echo 📦 Création de l'environnement virtuel...
python -m venv venv
if errorlevel 1 (
    echo ❌ Erreur lors de la création de l'environnement virtuel
    pause
    exit /b 1
)

echo 🔧 Activation de l'environnement virtuel...
call venv\Scripts\activate

echo 📥 Installation des dépendances...
pip install -r requirements.txt
if errorlevel 1 (
    echo ❌ Erreur lors de l'installation des dépendances
    pause
    exit /b 1
)

echo 📋 Configuration de l'environnement...
if not exist .env (
    copy .env.example .env
    echo ✅ Fichier .env créé
)

echo 🗄️ Configuration de la base de données...
python manage.py migrate
if errorlevel 1 (
    echo ❌ Erreur lors des migrations
    pause
    exit /b 1
)

echo 👤 Création du superutilisateur...
python create_superuser.py
if errorlevel 1 (
    echo ⚠️ Erreur lors de la création du superutilisateur
)

echo 🔧 Ajout des équipements d'exemple...
python populate_equipment.py
if errorlevel 1 (
    echo ⚠️ Erreur lors de l'ajout des équipements
)

echo.
echo ========================================
echo ✅ INSTALLATION TERMINÉE !
echo ========================================
echo.
echo 🌐 Pour démarrer le serveur :
echo    python manage.py runserver
echo.
echo 📱 Accès à l'application :
echo    http://localhost:8000
echo.
echo 📚 Documentation API :
echo    http://localhost:8000/docs/swagger/
echo.
echo 👨‍💼 Interface Admin :
echo    http://localhost:8000/admin/
echo    Username: admin
echo    Password: admin123
echo.
echo 🎉 Community Laboratory Burundi est prêt !
echo.
pause
