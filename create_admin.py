import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'comlab.settings')
django.setup()

from django.contrib.auth import get_user_model
User = get_user_model()

# Supprimer l'utilisateur admin s'il existe
User.objects.filter(username='admin').delete()

# Créer un superutilisateur avec le rôle admin
admin = User.objects.create_superuser('admin', 'admin@example.com', 'admin123')
admin.role = 'admin'
admin.save()
