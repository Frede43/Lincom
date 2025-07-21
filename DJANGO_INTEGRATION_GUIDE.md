# 🔗 GUIDE D'INTÉGRATION DJANGO - Community Laboratory Burundi

## 📋 **CONFIGURATION FRONTEND POUR VOTRE BACKEND DJANGO**

### **🚀 ACTIVATION DE L'API DJANGO**

#### **1. Configuration des variables d'environnement**
```bash
# Dans frontend/.env.local
VITE_USE_DJANGO_API=true
VITE_MOCK_API=false
VITE_API_URL=http://localhost:8000/api
```

#### **2. Structure des endpoints attendus**
Le frontend s'attend à ces endpoints Django REST Framework :

```python
# urls.py de votre backend Django
urlpatterns = [
    # Authentification
    path('api/auth/login/', LoginView.as_view()),
    path('api/auth/register/', RegisterView.as_view()),
    path('api/auth/logout/', LogoutView.as_view()),
    path('api/auth/token/refresh/', TokenRefreshView.as_view()),
    path('api/auth/password/reset/', PasswordResetView.as_view()),
    path('api/auth/password/reset/confirm/', PasswordResetConfirmView.as_view()),
    path('api/auth/email/verify/', EmailVerifyView.as_view()),
    path('api/auth/email/resend/', EmailResendView.as_view()),
    
    # Utilisateurs
    path('api/users/', UserListView.as_view()),
    path('api/users/<int:pk>/', UserDetailView.as_view()),
    path('api/users/profile/', UserProfileView.as_view()),
    path('api/users/profile/avatar/', AvatarUploadView.as_view()),
    
    # Cours
    path('api/courses/', CourseListView.as_view()),
    path('api/courses/<int:pk>/', CourseDetailView.as_view()),
    path('api/courses/my-courses/', MyCourseListView.as_view()),
    path('api/courses/<int:pk>/enroll/', CourseEnrollView.as_view()),
    path('api/courses/<int:pk>/progress/', CourseProgressView.as_view()),
    path('api/courses/<int:course_id>/lessons/<int:lesson_id>/complete/', LessonCompleteView.as_view()),
    path('api/courses/<int:course_id>/quizzes/<int:quiz_id>/submit/', QuizSubmitView.as_view()),
    path('api/courses/recommended/', RecommendedCoursesView.as_view()),
    path('api/courses/categories/', CourseCategoriesView.as_view()),
    path('api/courses/search/', CourseSearchView.as_view()),
    
    # Projets
    path('api/projects/', ProjectListView.as_view()),
    path('api/projects/<int:pk>/', ProjectDetailView.as_view()),
    path('api/projects/my-projects/', MyProjectListView.as_view()),
    path('api/projects/<int:pk>/join/', ProjectJoinView.as_view()),
    path('api/projects/<int:project_id>/tasks/', TaskListView.as_view()),
    path('api/projects/<int:project_id>/tasks/<int:pk>/', TaskDetailView.as_view()),
    path('api/projects/stats/', ProjectStatsView.as_view()),
    path('api/projects/search/', ProjectSearchView.as_view()),
    
    # Équipements Fab Lab
    path('api/lab-equipment/', EquipmentListView.as_view()),
    path('api/lab-equipment/<int:pk>/', EquipmentDetailView.as_view()),
    path('api/lab-equipment/<int:pk>/reserve/', EquipmentReserveView.as_view()),
    path('api/lab-equipment/my-reservations/', MyReservationsView.as_view()),
    path('api/lab-equipment/reservations/<int:pk>/', ReservationDetailView.as_view()),
    path('api/lab-equipment/<int:pk>/availability/', EquipmentAvailabilityView.as_view()),
    
    # Mentorat
    path('api/mentorship/my-mentees/', MyMenteesView.as_view()),
    path('api/mentorship/my-mentors/', MyMentorsView.as_view()),
    path('api/mentorship/request/', MentorshipRequestView.as_view()),
    path('api/mentorship/requests/<int:pk>/accept/', AcceptRequestView.as_view()),
    path('api/mentorship/requests/<int:pk>/reject/', RejectRequestView.as_view()),
    path('api/mentorship/sessions/', SessionListView.as_view()),
]
```

### **🔐 AUTHENTIFICATION JWT**

#### **Format des réponses attendues :**

```python
# Login Response
{
    "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "user": {
        "id": 1,
        "email": "user@comlab.bi",
        "first_name": "John",
        "last_name": "Doe",
        "role": "student",
        "avatar": "http://localhost:8000/media/avatars/user.jpg",
        "is_email_verified": true,
        "profile": {
            "bio": "Étudiant passionné",
            "skills": ["Python", "React"],
            "interests": ["AI", "Web Dev"],
            "location": "Bujumbura, Burundi",
            "institution": "Université du Burundi"
        }
    }
}

# Register Request
{
    "email": "user@comlab.bi",
    "password": "securepassword123",
    "password_confirm": "securepassword123",
    "first_name": "John",
    "last_name": "Doe",
    "role": "student",
    "phone": "+257123456789",
    "institution": "Université du Burundi"
}
```

### **📊 MODÈLES DJANGO RECOMMANDÉS**

#### **User Model (Extension)**
```python
# models.py
class UserProfile(models.Model):
    ROLE_CHOICES = [
        ('student', 'Étudiant'),
        ('entrepreneur', 'Entrepreneur'),
        ('mentor', 'Mentor'),
        ('admin', 'Administrateur'),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    avatar = models.ImageField(upload_to='avatars/', blank=True)
    bio = models.TextField(blank=True)
    skills = models.JSONField(default=list)
    interests = models.JSONField(default=list)
    location = models.CharField(max_length=100, blank=True)
    institution = models.CharField(max_length=200, blank=True)
    phone = models.CharField(max_length=20, blank=True)
    is_email_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
```

#### **Course Model**
```python
class Course(models.Model):
    LEVEL_CHOICES = [
        ('beginner', 'Débutant'),
        ('intermediate', 'Intermédiaire'),
        ('advanced', 'Avancé'),
    ]
    
    title = models.CharField(max_length=200)
    description = models.TextField()
    thumbnail = models.ImageField(upload_to='courses/')
    instructor = models.ForeignKey(User, on_delete=models.CASCADE)
    level = models.CharField(max_length=20, choices=LEVEL_CHOICES)
    duration = models.CharField(max_length=50)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    category = models.CharField(max_length=100)
    tags = models.JSONField(default=list)
    is_published = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
```

#### **Project Model**
```python
class Project(models.Model):
    STATUS_CHOICES = [
        ('idea', 'Idée'),
        ('prototype', 'Prototype'),
        ('mvp', 'MVP'),
        ('launched', 'Lancé'),
        ('paused', 'En pause'),
        ('completed', 'Terminé'),
    ]
    
    title = models.CharField(max_length=200)
    description = models.TextField()
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    category = models.CharField(max_length=100)
    tags = models.JSONField(default=list)
    is_public = models.BooleanField(default=True)
    looking_for_members = models.BooleanField(default=False)
    required_skills = models.JSONField(default=list)
    created_at = models.DateTimeField(auto_now_add=True)
```

### **🔧 CONFIGURATION CORS**

```python
# settings.py
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",  # Vite dev server
    "http://127.0.0.1:5173",
    "https://comlab.bi",      # Production
]

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
```

### **📡 WEBSOCKETS (OPTIONNEL)**

```python
# Pour les notifications temps réel
# routing.py
websocket_urlpatterns = [
    re_path(r'ws/notifications/(?P<user_id>\w+)/$', NotificationConsumer.as_view()),
    re_path(r'ws/chat/(?P<room_name>\w+)/$', ChatConsumer.as_view()),
]
```

### **🧪 TESTS D'INTÉGRATION**

#### **Script de test de l'API**
```bash
# Dans le dossier frontend
npm run test:api
```

#### **Endpoints à tester en priorité :**
1. **Auth** : Login, Register, Token Refresh
2. **Users** : Profile, Avatar Upload
3. **Courses** : List, Detail, Enroll
4. **Projects** : CRUD operations
5. **Equipment** : Reservations

### **🚀 DÉPLOIEMENT**

#### **Variables d'environnement production :**
```bash
# .env.production
VITE_USE_DJANGO_API=true
VITE_API_URL=https://api.comlab.bi/api
VITE_WS_URL=wss://api.comlab.bi/ws
VITE_MEDIA_URL=https://api.comlab.bi/media
```

### **📋 CHECKLIST D'INTÉGRATION**

- [ ] **Backend Django** configuré avec les endpoints
- [ ] **CORS** configuré pour le frontend
- [ ] **JWT Authentication** implémenté
- [ ] **Variables d'environnement** configurées
- [ ] **Tests API** passants
- [ ] **WebSockets** configurés (optionnel)
- [ ] **Media files** servis correctement
- [ ] **Pagination** Django REST Framework
- [ ] **Filtres et recherche** implémentés
- [ ] **Permissions** par rôle configurées

### **🆘 DÉPANNAGE**

#### **Erreurs communes :**

1. **CORS Error** : Vérifier `CORS_ALLOWED_ORIGINS`
2. **401 Unauthorized** : Vérifier le token JWT
3. **404 Not Found** : Vérifier les URLs Django
4. **500 Server Error** : Vérifier les logs Django

#### **Debug mode :**
```bash
# Activer les logs détaillés
VITE_DEBUG_MODE=true
```

---

## 🎯 **RÉSULTAT ATTENDU**

Avec cette configuration, votre frontend React communiquera parfaitement avec votre backend Django existant, en utilisant :

✅ **JWT Authentication** avec refresh automatique
✅ **API REST** complète avec pagination
✅ **Upload de fichiers** (avatars, documents)
✅ **WebSockets** pour temps réel (optionnel)
✅ **Gestion d'erreurs** robuste
✅ **Types TypeScript** pour toutes les réponses

**🚀 Votre plateforme sera alors 100% fonctionnelle avec votre backend Django !**
