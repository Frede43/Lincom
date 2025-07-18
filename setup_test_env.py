import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'comlab.settings')
django.setup()

from django.contrib.auth import get_user_model
from users.models import Mentor, Entrepreneur, Stakeholder
from education.models import Course, Module
from organizations.models import Organization

User = get_user_model()

def setup_test_environment():
    # Supprimer tous les utilisateurs existants
    User.objects.all().delete()
    
    # Créer un superutilisateur admin
    admin = User.objects.create_superuser(
        username='admin',
        email='admin@example.com',
        password='admin123'
    )
    admin.role = 'admin'
    admin.save()
    
    print("Environnement de test configuré avec succès!")
    print("Utilisateur admin créé:")
    print(f"Username: admin")
    print(f"Password: admin123")
    print(f"Role: {admin.role}")

if __name__ == '__main__':
    setup_test_environment()
