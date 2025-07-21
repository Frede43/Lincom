#!/usr/bin/env python
"""
Script pour peupler tous les modules avec des données de test
Community Laboratory Burundi
"""

import os
import sys
import django
from datetime import datetime, timedelta
from decimal import Decimal

# Configuration Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'comlab.settings')
django.setup()

from django.contrib.auth.models import User
from education.models import Course
from entrepreneurship.models import Startup, Project
from lab_equipment.models import EquipmentCategory, Equipment
from forum.models import Category as ForumCategory, Topic
from organizations.models import Organization
from notifs.models import Notification

def create_users():
    """Créer des utilisateurs de test"""
    print("🔄 Création des utilisateurs...")
    
    # Superutilisateur
    if not User.objects.filter(username='admin').exists():
        User.objects.create_superuser(
            username='admin',
            email='admin@comlab.bi',
            password='admin123',
            first_name='Admin',
            last_name='ComLab'
        )
    
    # Instructeur
    instructor, created = User.objects.get_or_create(
        username='instructor1',
        defaults={
            'email': 'instructor@comlab.bi',
            'first_name': 'Jean',
            'last_name': 'NKURUNZIZA',
            'is_staff': True
        }
    )
    
    # Entrepreneur
    entrepreneur, created = User.objects.get_or_create(
        username='entrepreneur1',
        defaults={
            'email': 'entrepreneur@comlab.bi',
            'first_name': 'Marie',
            'last_name': 'UWIMANA'
        }
    )
    
    # Utilisateur normal
    user, created = User.objects.get_or_create(
        username='user1',
        defaults={
            'email': 'user@comlab.bi',
            'first_name': 'Pierre',
            'last_name': 'NDAYISENGA'
        }
    )
    
    print("✅ Utilisateurs créés")
    return instructor, entrepreneur, user

def create_courses(instructor):
    """Créer des cours de test"""
    print("🔄 Création des cours...")
    
    courses_data = [
        {
            'title': 'Python pour l\'Agriculture Intelligente',
            'description': 'Apprenez Python pour développer des solutions agricoles innovantes au Burundi.',
            'level': 'beginner',
            'duration_weeks': 8,
            'syllabus': 'Introduction à Python, Analyse de données agricoles, IoT pour l\'agriculture',
            'objectives': 'Maîtriser Python pour créer des solutions agricoles'
        },
        {
            'title': 'Développement Web avec Django',
            'description': 'Créez des applications web robustes avec Django pour votre startup.',
            'level': 'intermediate',
            'duration_weeks': 12,
            'syllabus': 'Django basics, REST APIs, Déploiement',
            'objectives': 'Développer des applications web complètes'
        },
        {
            'title': 'Intelligence Artificielle pour les PME',
            'description': 'Intégrez l\'IA dans votre entreprise burundaise.',
            'level': 'advanced',
            'duration_weeks': 10,
            'syllabus': 'Machine Learning, Deep Learning, Applications pratiques',
            'objectives': 'Implémenter des solutions IA dans les PME'
        }
    ]
    
    for course_data in courses_data:
        course, created = Course.objects.get_or_create(
            title=course_data['title'],
            defaults={
                **course_data,
                'instructor': instructor,
                'is_active': True
            }
        )
        if created:
            print(f"  ✅ Cours créé: {course.title}")
    
    print("✅ Cours créés")

def create_startups_projects(entrepreneur):
    """Créer des startups et projets"""
    print("🔄 Création des startups et projets...")
    
    # Startups
    startups_data = [
        {
            'name': 'AgriTech Burundi',
            'description': 'Solutions technologiques pour l\'agriculture burundaise moderne.',
            'industry': 'Agriculture',
            'founding_date': datetime.now().date() - timedelta(days=365),
            'website': 'https://agritech.bi',
            'team_size': 5,
            'funding_stage': 'seed',
            'total_funding': Decimal('50000.00')
        },
        {
            'name': 'EduConnect BI',
            'description': 'Plateforme d\'éducation en ligne pour le Burundi.',
            'industry': 'Education',
            'founding_date': datetime.now().date() - timedelta(days=200),
            'website': 'https://educonnect.bi',
            'team_size': 3,
            'funding_stage': 'pre_seed',
            'total_funding': Decimal('15000.00')
        }
    ]
    
    for startup_data in startups_data:
        startup, created = Startup.objects.get_or_create(
            name=startup_data['name'],
            defaults={
                **startup_data,
                'founder': entrepreneur,
                'status': 'active'
            }
        )
        if created:
            print(f"  ✅ Startup créée: {startup.name}")
            
            # Créer un projet pour cette startup
            project, created = Project.objects.get_or_create(
                title=f'Projet {startup.name}',
                defaults={
                    'description': f'Projet principal de {startup.name}',
                    'startup': startup,
                    'start_date': datetime.now().date(),
                    'end_date': datetime.now().date() + timedelta(days=180),
                    'status': 'in_progress',
                    'priority': 'high',
                    'budget': Decimal('25000.00')
                }
            )
            if created:
                print(f"    ✅ Projet créé: {project.title}")
    
    print("✅ Startups et projets créés")

def create_equipment():
    """Créer des équipements de lab"""
    print("🔄 Création des équipements...")
    
    # Catégories d'équipements
    categories_data = [
        {'name': 'Impression 3D', 'description': 'Imprimantes 3D et accessoires'},
        {'name': 'Électronique', 'description': 'Composants et outils électroniques'},
        {'name': 'Informatique', 'description': 'Ordinateurs et périphériques'},
        {'name': 'Prototypage', 'description': 'Outils de prototypage rapide'}
    ]
    
    for cat_data in categories_data:
        category, created = EquipmentCategory.objects.get_or_create(
            name=cat_data['name'],
            defaults=cat_data
        )
        if created:
            print(f"  ✅ Catégorie créée: {category.name}")
    
    # Équipements
    equipment_data = [
        {
            'name': 'Imprimante 3D Prusa i3',
            'category': 'Impression 3D',
            'brand': 'Prusa',
            'model': 'i3 MK3S+',
            'description': 'Imprimante 3D haute précision pour prototypage',
            'location': 'Atelier Principal',
            'status': 'available',
            'condition': 'excellent'
        },
        {
            'name': 'Arduino Uno Kit',
            'category': 'Électronique',
            'brand': 'Arduino',
            'model': 'Uno R3',
            'description': 'Kit de développement Arduino avec composants',
            'location': 'Lab Électronique',
            'status': 'available',
            'condition': 'good'
        },
        {
            'name': 'Ordinateur de Développement',
            'category': 'Informatique',
            'brand': 'Dell',
            'model': 'OptiPlex 7090',
            'description': 'PC haute performance pour développement',
            'location': 'Espace Coworking',
            'status': 'available',
            'condition': 'excellent'
        }
    ]
    
    for eq_data in equipment_data:
        category = EquipmentCategory.objects.get(name=eq_data['category'])
        equipment, created = Equipment.objects.get_or_create(
            name=eq_data['name'],
            defaults={
                **{k: v for k, v in eq_data.items() if k != 'category'},
                'category': category
            }
        )
        if created:
            print(f"  ✅ Équipement créé: {equipment.name}")
    
    print("✅ Équipements créés")

def create_forum_content():
    """Créer du contenu de forum"""
    print("🔄 Création du contenu forum...")
    
    # Catégories de forum
    categories_data = [
        {'name': 'Général', 'description': 'Discussions générales sur l\'innovation'},
        {'name': 'Programmation', 'description': 'Questions et discussions sur la programmation'},
        {'name': 'Entrepreneuriat', 'description': 'Conseils et expériences entrepreneuriales'},
        {'name': 'Agriculture Tech', 'description': 'Technologies pour l\'agriculture'}
    ]
    
    for cat_data in categories_data:
        category, created = ForumCategory.objects.get_or_create(
            name=cat_data['name'],
            defaults=cat_data
        )
        if created:
            print(f"  ✅ Catégorie forum créée: {category.name}")
    
    # Topics
    user = User.objects.get(username='user1')
    general_cat = ForumCategory.objects.get(name='Général')
    
    topic, created = Topic.objects.get_or_create(
        title='Bienvenue au Community Lab Burundi !',
        defaults={
            'content': 'Bienvenue dans notre communauté d\'innovateurs burundais !',
            'category': general_cat,
            'author': user,
            'is_pinned': True
        }
    )
    if created:
        print(f"  ✅ Topic créé: {topic.title}")
    
    print("✅ Contenu forum créé")

def create_organizations():
    """Créer des organisations partenaires"""
    print("🔄 Création des organisations...")
    
    orgs_data = [
        {
            'name': 'Ministère de l\'Éducation du Burundi',
            'description': 'Partenaire institutionnel pour l\'éducation',
            'organization_type': 'government',
            'website': 'https://education.gov.bi',
            'contact_email': 'contact@education.gov.bi'
        },
        {
            'name': 'Banque Mondiale Burundi',
            'description': 'Partenaire financier pour le développement',
            'organization_type': 'international',
            'website': 'https://worldbank.org/bi',
            'contact_email': 'burundi@worldbank.org'
        },
        {
            'name': 'Université du Burundi',
            'description': 'Partenaire académique principal',
            'organization_type': 'academic',
            'website': 'https://ub.edu.bi',
            'contact_email': 'info@ub.edu.bi'
        }
    ]
    
    for org_data in orgs_data:
        org, created = Organization.objects.get_or_create(
            name=org_data['name'],
            defaults=org_data
        )
        if created:
            print(f"  ✅ Organisation créée: {org.name}")
    
    print("✅ Organisations créées")

def main():
    """Fonction principale"""
    print("🚀 Démarrage du peuplement des données...")
    print("=" * 50)
    
    try:
        # Créer les utilisateurs
        instructor, entrepreneur, user = create_users()
        
        # Créer les données pour chaque module
        create_courses(instructor)
        create_startups_projects(entrepreneur)
        create_equipment()
        create_forum_content()
        create_organizations()
        
        print("=" * 50)
        print("🎉 SUCCÈS ! Toutes les données de test ont été créées.")
        print("\n📊 Résumé:")
        print(f"  👥 Utilisateurs: {User.objects.count()}")
        print(f"  📚 Cours: {Course.objects.count()}")
        print(f"  🚀 Startups: {Startup.objects.count()}")
        print(f"  📋 Projets: {Project.objects.count()}")
        print(f"  🔧 Équipements: {Equipment.objects.count()}")
        print(f"  💬 Catégories Forum: {ForumCategory.objects.count()}")
        print(f"  🏢 Organisations: {Organization.objects.count()}")
        
        print("\n🌐 Testez maintenant vos APIs:")
        print("  📚 Cours: http://localhost:8000/api/education/courses/")
        print("  🚀 Projets: http://localhost:8000/api/entrepreneurship/projects/")
        print("  🔧 Équipements: http://localhost:8000/api/lab-equipment/equipment/")
        print("  💬 Forum: http://localhost:8000/api/forum/categories/")
        print("  🏢 Organisations: http://localhost:8000/api/organizations/")
        
    except Exception as e:
        print(f"❌ Erreur: {e}")
        sys.exit(1)

if __name__ == '__main__':
    main()
