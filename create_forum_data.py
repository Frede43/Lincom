#!/usr/bin/env python
import os
import sys
import django

# Configuration Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'comlab.settings')
django.setup()

from forum.models import Category, Topic, Post
from users.models import User

def create_forum_data():
    """Créer des données pour le module Forum"""
    print("🔧 Création des données Forum...")
    
    # Créer des catégories de forum
    categories_data = [
        {
            'name': 'Général',
            'description': 'Discussions générales sur Community Lab',
            'order': 1
        },
        {
            'name': 'Aide & Support',
            'description': 'Demandez de l\'aide à la communauté',
            'order': 2
        },
        {
            'name': 'Annonces',
            'description': 'Annonces officielles et nouvelles importantes',
            'order': 3
        },
        {
            'name': 'Projets & Showcase',
            'description': 'Partagez vos projets et créations',
            'order': 4
        },
        {
            'name': 'Entrepreneuriat',
            'description': 'Discussions sur l\'entrepreneuriat et les startups',
            'order': 5
        },
        {
            'name': 'Technologie',
            'description': 'Discussions techniques et innovations',
            'order': 6
        }
    ]
    
    categories = []
    for cat_data in categories_data:
        category, created = Category.objects.get_or_create(
            name=cat_data['name'],
            defaults=cat_data
        )
        categories.append(category)
        if created:
            print(f"   ✅ Catégorie créée: {category.name}")
    
    # Obtenir ou créer un utilisateur admin
    admin_user, created = User.objects.get_or_create(
        username='admin',
        defaults={
            'email': 'admin@communitylab.bi',
            'first_name': 'Admin',
            'last_name': 'Community Lab',
            'is_staff': True,
            'is_superuser': True
        }
    )
    if created:
        admin_user.set_password('admin123')
        admin_user.save()
        print(f"   ✅ Utilisateur admin créé")
    
    # Créer des topics
    topics_data = [
        {
            'title': 'Bienvenue dans le Community Lab !',
            'content': 'Bienvenue dans notre espace de discussion communautaire. N\'hésitez pas à vous présenter et à partager vos projets !',
            'category': categories[0],
            'is_pinned': True
        },
        {
            'title': 'Comment utiliser l\'imprimante 3D ?',
            'content': 'Je suis nouveau et j\'aimerais savoir comment réserver et utiliser l\'imprimante 3D. Quelqu\'un peut m\'aider ?',
            'category': categories[1]
        },
        {
            'title': 'Nouveau cours Python disponible',
            'content': 'Nous avons ajouté un nouveau cours Python pour débutants. Inscrivez-vous dès maintenant !',
            'category': categories[2],
            'is_pinned': True
        },
        {
            'title': 'Mon projet IoT pour l\'agriculture',
            'content': 'Je partage mon projet de capteurs IoT pour aider les agriculteurs burundais. Qu\'en pensez-vous ?',
            'category': categories[3]
        },
        {
            'title': 'Recherche co-fondateur pour startup AgriTech',
            'content': 'Je développe une solution AgriTech et je cherche un co-fondateur technique. Qui est intéressé ?',
            'category': categories[4]
        },
        {
            'title': 'Tutoriel: Impression 3D pour débutants',
            'content': 'Voici un guide complet pour débuter avec l\'impression 3D au Community Lab.',
            'category': categories[5]
        }
    ]
    
    topics_created = 0
    for topic_data in topics_data:
        topic, created = Topic.objects.get_or_create(
            title=topic_data['title'],
            defaults={
                **topic_data,
                'author': admin_user
            }
        )
        if created:
            topics_created += 1
            print(f"   ✅ Topic créé: {topic.title}")
    
    print(f"✅ {len(categories)} catégories et {topics_created} topics créés pour le Forum")
    print(f"📊 Total catégories: {Category.objects.count()}")
    print(f"📊 Total topics: {Topic.objects.count()}")

if __name__ == "__main__":
    create_forum_data()
