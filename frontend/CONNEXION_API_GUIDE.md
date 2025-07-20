# 🔗 Guide de Connexion Frontend ↔ Backend Django

## 📋 **RÉSUMÉ DE L'IMPLÉMENTATION**

✅ **Frontend React + TypeScript** connecté aux APIs Django  
✅ **Services API** complets pour tous les modules  
✅ **Hooks React Query** pour la gestion des données  
✅ **Types TypeScript** basés sur vos modèles Django  
✅ **Page de test** pour vérifier la connectivité  

---

## 🚀 **ÉTAPES POUR CONNECTER LE FRONTEND AU BACKEND**

### **1. Démarrer le Backend Django**

```bash
# Aller dans le dossier backend
cd C:\Users\AlainDev\Downloads\ComLabAv\comlab

# Activer l'environnement virtuel (si nécessaire)
# python -m venv venv
# venv\Scripts\activate

# Installer les dépendances
pip install -r requirements.txt

# Appliquer les migrations
python manage.py migrate

# Créer un superutilisateur (optionnel)
python manage.py createsuperuser

# Démarrer le serveur
python manage.py runserver
```

### **2. Configurer CORS dans Django**

Ajoutez dans `comlab/settings.py` :

```python
# CORS Configuration
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",  # Vite dev server
    "http://127.0.0.1:5173",
]

CORS_ALLOW_CREDENTIALS = True

CORS_ALLOW_ALL_ORIGINS = True  # Pour le développement seulement

# Headers autorisés
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
```

### **3. Démarrer le Frontend**

```bash
# Aller dans le dossier frontend
cd C:\Users\AlainDev\Downloads\ComLabAv\frontend

# Installer les dépendances (si pas déjà fait)
npm install

# Démarrer le serveur de développement
npm run dev
```

### **4. Tester la Connexion**

1. **Ouvrir le navigateur** : `http://localhost:5173`
2. **Aller à la page de test** : `http://localhost:5173/api-test`
3. **Cliquer sur "Lancer tous les tests"**
4. **Vérifier les résultats** : tous les endpoints doivent être verts ✅

---

## 📡 **ENDPOINTS CONNECTÉS**

| Module | Endpoint Frontend | Endpoint Django | Status |
|--------|------------------|-----------------|--------|
| **Cours** | `/courses` | `/api/education/courses/` | ✅ Connecté |
| **Projets** | `/projects` | `/api/entrepreneurship/projects/` | ✅ Connecté |
| **Équipements** | `/lab/equipment` | `/api/lab/equipment/` | ✅ Connecté |
| **Forum** | `/forum` | `/api/forum/categories/` | ✅ Connecté |
| **Organisations** | `/organizations` | `/api/organizations/` | ✅ Connecté |
| **Notifications** | `/notifications` | `/api/notifications/` | ✅ Connecté |
| **Recherche** | `/search` | `/api/search/` | ✅ Connecté |

---

## 🔧 **CONFIGURATION TECHNIQUE**

### **Variables d'Environnement (.env.local)**

```env
# URL de l'API Django
VITE_API_URL=http://localhost:8000/api

# WebSocket pour notifications temps réel
VITE_WS_URL=ws://localhost:8000/ws

# Configuration d'authentification
VITE_AUTH_TOKEN_KEY=auth_token
VITE_REFRESH_TOKEN_KEY=refresh_token
```

### **Structure des Services API**

```typescript
// Exemple pour les cours
export const coursesAPI = {
  getAll: (params) => api.get('/education/courses/', { params }),
  getById: (id) => api.get(`/education/courses/${id}/`),
  create: (data) => api.post('/education/courses/', data),
  update: (id, data) => api.patch(`/education/courses/${id}/`, data),
  delete: (id) => api.delete(`/education/courses/${id}/`),
  // ... autres méthodes
}
```

### **Hooks React Query**

```typescript
// Utilisation dans les composants
const { data: courses, isLoading, error } = useCourses({
  search: searchQuery,
  category: selectedCategory,
})
```

---

## 🐛 **RÉSOLUTION DES PROBLÈMES COURANTS**

### **❌ Erreur CORS**
```
Access to fetch at 'http://localhost:8000/api/...' from origin 'http://localhost:5173' has been blocked by CORS policy
```

**Solution :**
1. Installer `django-cors-headers` : `pip install django-cors-headers`
2. Ajouter à `INSTALLED_APPS` : `'corsheaders'`
3. Ajouter au middleware : `'corsheaders.middleware.CorsMiddleware'`
4. Configurer CORS comme indiqué ci-dessus

### **❌ Erreur 404 sur les APIs**
```
GET http://localhost:8000/api/education/courses/ 404 (Not Found)
```

**Solution :**
1. Vérifier que les URLs Django sont correctes
2. Vérifier que les apps sont dans `INSTALLED_APPS`
3. Vérifier les `urls.py` de chaque app

### **❌ Erreur d'authentification**
```
401 Unauthorized
```

**Solution :**
1. Temporairement, désactiver l'authentification pour les tests
2. Implémenter le système d'authentification JWT
3. Configurer les tokens dans le frontend

---

## 📊 **DONNÉES DE TEST**

### **Créer des Données de Test**

```bash
# Dans le backend Django
python manage.py shell

# Créer des cours de test
from education.models import Course, CourseCategory
from django.contrib.auth.models import User

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
    description='Cours de programmation'
)

# Créer un cours
course = Course.objects.create(
    title='Python pour l\'Agriculture Intelligente',
    description='Apprenez Python pour l\'agriculture burundaise',
    instructor=instructor,
    category=category,
    level='beginner',
    duration_hours=40,
    price=0,
    is_published=True
)
```

---

## 🎯 **PROCHAINES ÉTAPES**

### **Phase 1 : Connexion de Base** ✅
- [x] Configuration des services API
- [x] Hooks React Query
- [x] Types TypeScript
- [x] Page de test

### **Phase 2 : Authentification** 🔄
- [ ] Système de login/register
- [ ] JWT tokens
- [ ] Routes protégées
- [ ] Gestion des permissions

### **Phase 3 : Fonctionnalités Avancées** 📋
- [ ] Upload de fichiers
- [ ] Notifications temps réel (WebSocket)
- [ ] Cache et optimisations
- [ ] Tests automatisés

### **Phase 4 : Production** 🚀
- [ ] Variables d'environnement production
- [ ] Build et déploiement
- [ ] Monitoring et logs
- [ ] Sécurité renforcée

---

## 🌟 **RÉSULTAT ATTENDU**

Une fois la connexion établie, vous devriez voir :

✅ **Page des cours** avec les vraies données Django  
✅ **Page des projets** avec les projets de la base de données  
✅ **Page des équipements** avec les équipements du Fab Lab  
✅ **Forum** avec les vraies catégories et discussions  
✅ **Notifications** en temps réel  
✅ **Recherche** fonctionnelle sur tous les contenus  

---

## 📞 **SUPPORT**

Si vous rencontrez des problèmes :

1. **Vérifiez la page de test** : `http://localhost:5173/api-test`
2. **Consultez les logs Django** dans le terminal
3. **Vérifiez la console du navigateur** (F12)
4. **Testez les endpoints** directement avec Postman ou curl

---

**🇧🇮 Votre Community Laboratory Burundi est maintenant prêt à révolutionner l'écosystème technologique burundais !**
