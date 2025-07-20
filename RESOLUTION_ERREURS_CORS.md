# 🔧 Résolution des Erreurs CORS et Authentification

## 🚨 **ERREURS IDENTIFIÉES**

1. **Erreur CORS** : `Access-Control-Allow-Origin` manquant
2. **Erreur 401** : Authentification requise mais pas configurée
3. **Port Frontend** : `localhost:8080` (pas 5173 comme prévu)

---

## ✅ **SOLUTION ÉTAPE PAR ÉTAPE**

### **ÉTAPE 1 : Installer django-cors-headers**

```bash
# Dans le terminal backend
cd C:\Users\AlainDev\Downloads\ComLabAv\comlab
pip install django-cors-headers
```

### **ÉTAPE 2 : Configurer Django Settings**

Ouvrir `comlab/settings.py` et ajouter/modifier :

```python
# 1. Ajouter dans INSTALLED_APPS
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    # CORS
    'corsheaders',  # ← AJOUTER CETTE LIGNE
    
    # DRF
    'rest_framework',
    
    # Vos apps
    'education',
    'entrepreneurship',
    'lab',
    'forum',
    'organizations',
    'notifications',
    # ... autres apps
]

# 2. Ajouter dans MIDDLEWARE (EN PREMIER)
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # ← AJOUTER EN PREMIER
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# 3. Configuration CORS
CORS_ALLOWED_ORIGINS = [
    "http://localhost:8080",  # Frontend actuel
    "http://127.0.0.1:8080",
    "http://localhost:5173",  # Vite par défaut
    "http://127.0.0.1:5173",
]

# Pour le développement SEULEMENT
CORS_ALLOW_ALL_ORIGINS = True  # ← TEMPORAIRE POUR TESTS

CORS_ALLOW_CREDENTIALS = True

CORS_ALLOW_HEADERS = [
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
]

# 4. Configuration REST Framework (TEMPORAIRE POUR TESTS)
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        # Commenté temporairement pour les tests
        # 'rest_framework.authentication.TokenAuthentication',
        # 'rest_framework.authentication.SessionAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny',  # ← TEMPORAIRE
        # 'rest_framework.permissions.IsAuthenticated',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20,
}
```

### **ÉTAPE 3 : Redémarrer Django**

```bash
# Arrêter Django (Ctrl+C)
# Puis redémarrer
python manage.py runserver
```

### **ÉTAPE 4 : Tester la Connexion**

1. **Ouvrir** : `http://localhost:8080/api-test`
2. **Cliquer** : "Lancer tous les tests"
3. **Vérifier** : Tous les endpoints doivent être verts ✅

---

## 🔍 **VÉRIFICATION DES URLS DJANGO**

Assurez-vous que vos URLs Django correspondent aux endpoints testés :

### **Dans `comlab/urls.py` :**
```python
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/education/', include('education.urls')),
    path('api/entrepreneurship/', include('entrepreneurship.urls')),
    path('api/lab/', include('lab.urls')),
    path('api/forum/', include('forum.urls')),
    path('api/organizations/', include('organizations.urls')),
    path('api/notifications/', include('notifications.urls')),
    path('api/search/', include('search.urls')),  # Si vous avez une app search
]
```

### **Exemple pour `education/urls.py` :**
```python
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'courses', views.CourseViewSet)
router.register(r'categories', views.CourseCategoryViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
```

---

## 🧪 **CRÉER DES DONNÉES DE TEST**

Une fois la connexion établie, créez des données de test :

```bash
python manage.py shell
```

```python
# Créer des données de test
from django.contrib.auth.models import User
from education.models import Course, CourseCategory

# Créer un utilisateur instructeur
instructor = User.objects.create_user(
    username='instructor1',
    email='instructor@comlab.bi',
    first_name='Jean',
    last_name='NKURUNZIZA'
)

# Créer une catégorie
category = CourseCategory.objects.create(
    name='Programmation',
    description='Cours de programmation et développement'
)

# Créer un cours
course = Course.objects.create(
    title='Python pour l\'Agriculture Intelligente',
    description='Apprenez Python en développant des solutions pour l\'agriculture burundaise moderne.',
    instructor=instructor,
    category=category,
    level='beginner',
    duration_hours=40,
    price=0,
    is_published=True
)

print(f"Cours créé : {course.title}")
```

---

## 🚨 **RÉSOLUTION DES PROBLÈMES COURANTS**

### **Erreur : Module 'corsheaders' not found**
```bash
pip install django-cors-headers
```

### **Erreur : CORS toujours bloqué**
- Vérifiez que `corsheaders.middleware.CorsMiddleware` est EN PREMIER dans MIDDLEWARE
- Redémarrez Django complètement

### **Erreur : 404 sur les APIs**
- Vérifiez vos `urls.py`
- Assurez-vous que les apps sont dans `INSTALLED_APPS`
- Testez directement : `http://localhost:8000/api/education/courses/`

### **Erreur : 500 Internal Server Error**
- Vérifiez les logs Django dans le terminal
- Assurez-vous que les modèles sont migrés : `python manage.py migrate`

---

## ✅ **RÉSULTAT ATTENDU**

Après configuration, vous devriez voir :

✅ **Page de test API** : Tous les endpoints verts  
✅ **Page des cours** : Chargement des vraies données  
✅ **Console navigateur** : Aucune erreur CORS  
✅ **Django logs** : Requêtes API réussies  

---

## 🔄 **PROCHAINES ÉTAPES**

1. **Tester la connexion** avec la page de test
2. **Créer des données de test** pour chaque module
3. **Naviguer dans l'application** pour voir les vraies données
4. **Réactiver l'authentification** une fois les tests terminés

---

## 📞 **SUPPORT**

Si les erreurs persistent :

1. **Vérifiez les logs Django** dans le terminal
2. **Consultez la console navigateur** (F12)
3. **Testez les URLs directement** dans le navigateur
4. **Vérifiez la configuration** étape par étape

---

**🇧🇮 Une fois configuré, votre Community Laboratory Burundi sera pleinement opérationnel !**
