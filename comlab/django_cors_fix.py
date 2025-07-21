# Configuration Django pour résoudre les problèmes CORS et d'authentification
# À ajouter dans comlab/settings.py

# 1. CORS Configuration
CORS_ALLOWED_ORIGINS = [
    "http://localhost:8080",  # Frontend Vite
    "http://127.0.0.1:8080",
    "http://localhost:5173",  # Vite par défaut
    "http://127.0.0.1:5173",
]

# Pour le développement seulement - ATTENTION: Ne pas utiliser en production
CORS_ALLOW_ALL_ORIGINS = True

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

CORS_ALLOW_METHODS = [
    'DELETE',
    'GET',
    'OPTIONS',
    'PATCH',
    'POST',
    'PUT',
]

# 2. Désactiver temporairement l'authentification pour les tests
# Ajouter ceci dans vos vues ou settings pour les tests

# Dans settings.py, ajouter:
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        # Commenté temporairement pour les tests
        # 'rest_framework.authentication.TokenAuthentication',
        # 'rest_framework.authentication.SessionAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        # Temporairement ouvert pour les tests
        'rest_framework.permissions.AllowAny',
        # 'rest_framework.permissions.IsAuthenticated',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20,
}

# 3. Installer django-cors-headers si pas déjà fait
# pip install django-cors-headers

# 4. Ajouter dans INSTALLED_APPS:
INSTALLED_APPS = [
    # ... autres apps
    'corsheaders',
    # ... vos apps
]

# 5. Ajouter dans MIDDLEWARE (en premier):
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    # ... autres middlewares
]

print("""
🔧 INSTRUCTIONS POUR CONFIGURER DJANGO:

1. Installer django-cors-headers:
   pip install django-cors-headers

2. Ajouter dans comlab/settings.py:
   - Copier la configuration CORS ci-dessus
   - Ajouter 'corsheaders' dans INSTALLED_APPS
   - Ajouter 'corsheaders.middleware.CorsMiddleware' en premier dans MIDDLEWARE
   - Configurer REST_FRAMEWORK comme ci-dessus

3. Redémarrer Django:
   python manage.py runserver

4. Tester la connexion:
   http://localhost:8080/api-test
""")
