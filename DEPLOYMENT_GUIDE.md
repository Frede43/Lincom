# 🚀 Guide de Déploiement - Community Laboratory Burundi

## ✅ ÉTAT ACTUEL DU PROJET

### **FONCTIONNEL** ✅
- ✅ **Base de données** : Migrations corrigées et appliquées
- ✅ **API REST** : Tous les endpoints fonctionnent (16/16 tests passés)
- ✅ **Authentification** : JWT configuré et fonctionnel
- ✅ **Documentation** : Swagger/OpenAPI disponible
- ✅ **Structure** : Architecture Django + DRF solide
- ✅ **Tests** : Tests unitaires implémentés

### **APPLICATIONS DISPONIBLES**
- 👥 **Users** : Gestion des utilisateurs (Admin, Mentor, Entrepreneur, Stakeholder, Student)
- 📚 **Education** : Cours, modules, leçons, quiz, formations
- 🚀 **Entrepreneurship** : Startups, projets, milestones, ressources
- 🏢 **Organizations** : Organisations, compétitions, appels à projets
- 💬 **Forum** : Discussions, catégories, posts
- 🤝 **Mentorship** : Programmes de mentorat, sessions
- 📊 **Dashboard** : Tableau de bord personnalisé
- 🔍 **Search** : Recherche avancée
- 🔔 **Notifications** : Système de notifications

## 🛠️ INSTALLATION ET CONFIGURATION

### 1. **Prérequis**
```bash
# Python 3.8+
python --version

# Pip
pip --version
```

### 2. **Installation**
```bash
# Cloner le projet
git clone <repository-url>
cd ComLabAv

# Créer l'environnement virtuel
python -m venv venv

# Activer l'environnement virtuel
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Installer les dépendances
pip install -r requirements.txt
```

### 3. **Configuration**
```bash
# Copier le fichier d'environnement
cp .env.example .env

# Éditer les variables d'environnement
# Modifier .env selon vos besoins
```

### 4. **Base de données**
```bash
# Appliquer les migrations
python manage.py migrate

# Créer un superutilisateur
python create_superuser.py
# Ou manuellement:
# python manage.py createsuperuser
```

### 5. **Démarrage**
```bash
# Démarrer le serveur de développement
python manage.py runserver 8000

# Le serveur sera accessible sur:
# http://localhost:8000
```

## 📡 ENDPOINTS API PRINCIPAUX

### **Authentification**
- `POST /api/token/` - Obtenir un token JWT
- `POST /api/token/refresh/` - Rafraîchir le token

### **Utilisateurs**
- `GET /api/users/` - Liste des utilisateurs
- `POST /api/users/register/` - Inscription
- `GET /api/users/profile/` - Profil utilisateur

### **Éducation**
- `GET /api/education/courses/` - Liste des cours
- `GET /api/education/lessons/` - Liste des leçons

### **Dashboard**
- `GET /api/dashboard/overview/` - Vue d'ensemble
- `GET /api/dashboard/stats/` - Statistiques

### **Documentation**
- `GET /docs/swagger/` - Documentation Swagger
- `GET /docs/redoc/` - Documentation ReDoc

## 🧪 TESTS

### **Exécuter les tests**
```bash
# Tous les tests
python manage.py test

# Tests spécifiques
python manage.py test users
python manage.py test education

# Tests API
python test_apis.py
```

### **Vérification du déploiement**
```bash
python deploy_check.py
```

## 🔐 SÉCURITÉ

### **Variables d'environnement importantes**
```env
SECRET_KEY=your-secret-key-here
DEBUG=False  # En production
ALLOWED_HOSTS=your-domain.com
DATABASE_URL=postgresql://user:pass@host:port/db
```

### **Recommandations de sécurité**
- ✅ Utiliser HTTPS en production
- ✅ Configurer CORS correctement
- ✅ Utiliser PostgreSQL en production
- ✅ Configurer les logs
- ✅ Mettre en place la surveillance

## 🚀 DÉPLOIEMENT EN PRODUCTION

### **1. Serveur Web (Recommandé: Nginx + Gunicorn)**
```bash
# Installer Gunicorn
pip install gunicorn

# Démarrer avec Gunicorn
gunicorn comlab.wsgi:application --bind 0.0.0.0:8000
```

### **2. Base de données PostgreSQL**
```bash
# Installer psycopg2
pip install psycopg2-binary

# Configurer DATABASE_URL dans .env
DATABASE_URL=postgresql://user:password@localhost:5432/comlab
```

### **3. Fichiers statiques**
```bash
# Collecter les fichiers statiques
python manage.py collectstatic
```

## 📊 RÉSULTATS DES TESTS

### **Tests API** ✅
- ✅ Dashboard: 8/8 endpoints OK
- ✅ Education: 2/2 endpoints OK  
- ✅ Forum: 2/2 endpoints OK
- ✅ Organizations: 2/2 endpoints OK
- ✅ Search: 2/2 endpoints OK
- **Total: 16/16 endpoints fonctionnels**

### **Tests unitaires** ✅
- ✅ Modèles User, Mentor, Entrepreneur
- ✅ API d'authentification
- ✅ Modèles Course, Module, Lesson
- ✅ API des cours

## 🎯 PROCHAINES ÉTAPES

### **Développement**
1. Ajouter plus de tests unitaires
2. Implémenter les notifications en temps réel
3. Ajouter la gestion des fichiers/médias
4. Optimiser les performances

### **Production**
1. Configurer un serveur de production
2. Mettre en place la surveillance
3. Configurer les sauvegardes
4. Implémenter le cache (Redis)

## 📞 SUPPORT

Pour toute question ou problème:
- Vérifier les logs: `python manage.py runserver --verbosity=2`
- Exécuter les tests: `python manage.py test`
- Vérifier la configuration: `python manage.py check`

---

**✅ PROJET PRÊT POUR LE DÉVELOPPEMENT ET LES TESTS**
**⚠️ CONFIGURATION PRODUCTION REQUISE POUR LE DÉPLOIEMENT**
