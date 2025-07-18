#!/usr/bin/env python
"""
Script pour créer un superutilisateur automatiquement
"""
import os
import sys
import django

# Configuration Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'comlab.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

def create_superuser():
    """Créer un superutilisateur si il n'existe pas"""
    if not User.objects.filter(username='admin').exists():
        User.objects.create_superuser(
            username='admin',
            email='admin@comlab.com',
            password='admin123',
            role='admin'
        )
        print("✅ Superutilisateur créé avec succès!")
        print("   Username: admin")
        print("   Password: admin123")
    else:
        print("ℹ️  Superutilisateur 'admin' existe déjà")

if __name__ == '__main__':
    create_superuser()
