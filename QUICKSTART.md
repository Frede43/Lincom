# 🚀 Guide de Démarrage Rapide - Community Laboratory Burundi

Ce guide vous permettra de faire fonctionner Community Laboratory Burundi en moins de 10 minutes !

## ⚡ **Démarrage Express (5 minutes)**

### **1. Prérequis**
- Python 3.8+ installé
- Git installé
- 10 minutes de votre temps ⏰

### **2. Installation Ultra-Rapide**
```bash
# 1. Cloner le projet
git clone https://github.com/Frede43/Lincom.git
cd Lincom

# 2. Setup automatique (Windows)
setup_quick.bat

# 2. Setup automatique (Linux/Mac)
chmod +x setup_quick.sh
./setup_quick.sh
```

### **3. Accès Immédiat**
- 🌐 **Application** : http://localhost:8000
- 📚 **API Docs** : http://localhost:8000/docs/swagger/
- 👨‍💼 **Admin** : http://localhost:8000/admin/

**Compte admin par défaut :**
- Username: `admin`
- Password: `admin123`

## 🛠️ **Installation Manuelle (10 minutes)**

### **Étape 1 : Environnement**
```bash
# Créer l'environnement virtuel
python -m venv venv

# Activer l'environnement
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate
```

### **Étape 2 : Dépendances**
```bash
# Installer les dépendances principales
pip install -r requirements.txt

# (Optionnel) Dépendances de développement
pip install -r requirements-dev.txt
```

### **Étape 3 : Configuration**
```bash
# Copier la configuration d'exemple
cp .env.example .env

# Éditer .env si nécessaire (optionnel pour le démarrage)
# Les valeurs par défaut fonctionnent pour le développement
```

### **Étape 4 : Base de Données**
```bash
# Appliquer les migrations
python manage.py migrate

# Créer un superutilisateur automatiquement
python create_superuser.py

# Peupler avec des données d'exemple
python populate_equipment.py
```

### **Étape 5 : Démarrage**
```bash
# Lancer le serveur de développement
python manage.py runserver

# Le serveur démarre sur http://localhost:8000
```

## 🧪 **Vérification de l'Installation**

### **Tests Automatiques**
```bash
# Tests unitaires
python manage.py test

# Tests API complets
python test_apis.py

# Tests équipements
python test_equipment_api.py

# Vérification complète du déploiement
python deploy_check.py
```

### **Vérification Manuelle**
1. **Page d'accueil** : http://localhost:8000 ✅
2. **API Documentation** : http://localhost:8000/docs/swagger/ ✅
3. **Interface Admin** : http://localhost:8000/admin/ ✅
4. **Connexion admin** : admin / admin123 ✅

## 📊 **Données de Démonstration**

Le projet inclut des données d'exemple :

### **👥 Utilisateurs**
- **Admin** : admin / admin123
- **Mentor** : Créé automatiquement
- **Entrepreneur** : Créé automatiquement
- **Étudiant** : Créé automatiquement

### **🔧 Équipements Fab Lab**
- **Impression 3D** : Prusa i3 MK3S+, Ultimaker S3
- **Découpe Laser** : Epilog Zing 24
- **CNC** : Shapeoko 4 XXL
- **Électronique** : Station soudage, Oscilloscope
- **Informatique** : Workstation CAO/FAO

### **📚 Formations**
- Cours de base créés automatiquement
- Modules d'apprentissage
- Quiz et évaluations

## 🎯 **Premiers Pas**

### **En tant qu'Administrateur**
1. Connectez-vous à l'admin : http://localhost:8000/admin/
2. Explorez les différentes applications
3. Créez des utilisateurs de test
4. Configurez les équipements

### **En tant qu'Utilisateur**
1. Créez un compte via l'API : http://localhost:8000/docs/swagger/
2. Explorez le catalogue de cours
3. Réservez un équipement
4. Participez au forum

### **En tant que Développeur**
1. Explorez la documentation API
2. Testez les endpoints avec Swagger
3. Consultez le code source
4. Lancez les tests

## 🔧 **Configuration Avancée**

### **Base de Données PostgreSQL**
```bash
# Installer PostgreSQL
# Puis modifier .env :
DATABASE_URL=postgresql://user:password@localhost:5432/comlab
```

### **Variables d'Environnement**
```env
# .env
DEBUG=True
SECRET_KEY=your-secret-key-here
DATABASE_URL=sqlite:///db.sqlite3
ALLOWED_HOSTS=localhost,127.0.0.1
```

### **Développement Frontend**
```bash
# Si vous voulez développer le frontend
cd frontend/
npm install
npm run dev
```

## 🚨 **Résolution de Problèmes**

### **Erreur de Migration**
```bash
# Supprimer la base de données et recommencer
rm db.sqlite3
python manage.py migrate
python create_superuser.py
```

### **Erreur de Dépendances**
```bash
# Réinstaller les dépendances
pip install --upgrade pip
pip install -r requirements.txt --force-reinstall
```

### **Port 8000 Occupé**
```bash
# Utiliser un autre port
python manage.py runserver 8001
```

### **Problème d'Authentification**
```bash
# Recréer le superutilisateur
python manage.py createsuperuser
```

## 📞 **Support**

Si vous rencontrez des problèmes :

1. **Consultez les logs** : Vérifiez la console pour les erreurs
2. **Vérifiez les issues** : https://github.com/Frede43/Lincom/issues
3. **Créez une issue** : Décrivez votre problème en détail
4. **Contactez-nous** : contact@comlab.bi

## 🎉 **Félicitations !**

Vous avez maintenant Community Laboratory Burundi qui fonctionne localement !

### **Prochaines Étapes**
- 📚 Explorez la [documentation complète](README.md)
- 🤝 Consultez le [guide de contribution](CONTRIBUTING.md)
- 🌐 Visitez le [repository GitHub](https://github.com/Frede43/Lincom)
- 💬 Rejoignez la communauté

---

**🌍 Bienvenue dans l'écosystème Community Laboratory Burundi !**
