#!/usr/bin/env python3
"""
Script pour créer des données de test réalistes
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

# Imports des modèles
from django.contrib.auth.models import User
from education.models import Course, Category as CourseCategory, Enrollment
from entrepreneurship.models import Project, Category as ProjectCategory
from lab_equipment.models import Equipment, Category as EquipmentCategory, Reservation
from forum.models import Category as ForumCategory, Topic, Post
from organizations.models import Organization
from notifs.models import Notification

def create_users():
    """Créer des utilisateurs de test"""
    print("🧑‍💻 Création des utilisateurs...")
    
    users_data = [
        {
            'username': 'marie_uwimana',
            'email': 'marie@ecofarm.bi',
            'first_name': 'Marie',
            'last_name': 'UWIMANA',
            'is_staff': False
        },
        {
            'username': 'jean_nkurunziza',
            'email': 'jean@burundicraft.bi',
            'first_name': 'Jean',
            'last_name': 'NKURUNZIZA',
            'is_staff': False
        },
        {
            'username': 'grace_ndayisenga',
            'email': 'grace@edutech.bi',
            'first_name': 'Grace',
            'last_name': 'NDAYISENGA',
            'is_staff': False
        },
        {
            'username': 'admin_lab',
            'email': 'admin@communitylab.bi',
            'first_name': 'Admin',
            'last_name': 'Community Lab',
            'is_staff': True,
            'is_superuser': True
        }
    ]
    
    created_users = []
    for user_data in users_data:
        user, created = User.objects.get_or_create(
            username=user_data['username'],
            defaults={
                'email': user_data['email'],
                'first_name': user_data['first_name'],
                'last_name': user_data['last_name'],
                'is_staff': user_data.get('is_staff', False),
                'is_superuser': user_data.get('is_superuser', False)
            }
        )
        if created:
            user.set_password('password123')
            user.save()
            print(f"   ✅ Utilisateur créé: {user.username}")
        else:
            print(f"   ⏭️  Utilisateur existe: {user.username}")
        created_users.append(user)
    
    return created_users

def create_course_categories():
    """Créer les catégories de cours"""
    print("📚 Création des catégories de cours...")
    
    categories_data = [
        {
            'name': 'Programmation',
            'description': 'Cours de développement logiciel et programmation',
            'color': '#3B82F6'
        },
        {
            'name': 'Agriculture',
            'description': 'Technologies agricoles et innovations',
            'color': '#10B981'
        },
        {
            'name': 'Entrepreneuriat',
            'description': 'Création d\'entreprise et gestion',
            'color': '#F59E0B'
        },
        {
            'name': 'Design',
            'description': 'Design graphique et UX/UI',
            'color': '#EF4444'
        }
    ]
    
    created_categories = []
    for cat_data in categories_data:
        category, created = CourseCategory.objects.get_or_create(
            name=cat_data['name'],
            defaults={
                'description': cat_data['description'],
                'color': cat_data['color']
            }
        )
        if created:
            print(f"   ✅ Catégorie créée: {category.name}")
        else:
            print(f"   ⏭️  Catégorie existe: {category.name}")
        created_categories.append(category)
    
    return created_categories

def create_courses(users, categories):
    """Créer des cours de test"""
    print("📖 Création des cours...")
    
    courses_data = [
        {
            'title': 'Python pour l\'Agriculture Intelligente',
            'description': 'Apprenez Python en développant des solutions pour l\'agriculture burundaise moderne.',
            'category': 'Programmation',
            'level': 'beginner',
            'duration': 40,
            'price': Decimal('25000'),
            'is_featured': True
        },
        {
            'title': 'Entrepreneuriat Social au Burundi',
            'description': 'Créez une entreprise sociale qui répond aux défis locaux.',
            'category': 'Entrepreneuriat',
            'level': 'intermediate',
            'duration': 30,
            'price': Decimal('35000'),
            'is_featured': True
        },
        {
            'title': 'Design Thinking pour l\'Innovation',
            'description': 'Méthodologie de design thinking appliquée aux défis burundais.',
            'category': 'Design',
            'level': 'beginner',
            'duration': 25,
            'price': Decimal('20000'),
            'is_featured': False
        },
        {
            'title': 'Agriculture de Précision avec IoT',
            'description': 'Utilisez l\'Internet des Objets pour optimiser vos cultures.',
            'category': 'Agriculture',
            'level': 'advanced',
            'duration': 50,
            'price': Decimal('45000'),
            'is_featured': True
        }
    ]
    
    created_courses = []
    for course_data in courses_data:
        category = next((c for c in categories if c.name == course_data['category']), categories[0])
        instructor = users[0]  # Marie comme instructrice par défaut
        
        course, created = Course.objects.get_or_create(
            title=course_data['title'],
            defaults={
                'description': course_data['description'],
                'instructor': instructor,
                'category': category,
                'level': course_data['level'],
                'duration_hours': course_data['duration'],
                'price': course_data['price'],
                'is_featured': course_data['is_featured'],
                'is_published': True
            }
        )
        if created:
            print(f"   ✅ Cours créé: {course.title}")
        else:
            print(f"   ⏭️  Cours existe: {course.title}")
        created_courses.append(course)
    
    return created_courses

def create_projects(users):
    """Créer des projets entrepreneuriaux"""
    print("🚀 Création des projets...")
    
    # Créer les catégories de projets
    project_categories = []
    for cat_name in ['AgriTech', 'EdTech', 'FinTech', 'E-commerce', 'HealthTech']:
        category, created = ProjectCategory.objects.get_or_create(
            name=cat_name,
            defaults={'description': f'Projets dans le domaine {cat_name}'}
        )
        project_categories.append(category)
    
    projects_data = [
        {
            'title': 'EcoFarm Solutions',
            'description': 'Plateforme digitale pour connecter les agriculteurs burundais aux marchés locaux et internationaux.',
            'category': 'AgriTech',
            'stage': 'growth',
            'funding_goal': Decimal('50000'),
            'current_funding': Decimal('32000'),
            'is_featured': True
        },
        {
            'title': 'BurundiCraft Marketplace',
            'description': 'Marketplace en ligne pour promouvoir et vendre l\'artisanat traditionnel burundais.',
            'category': 'E-commerce',
            'stage': 'launch',
            'funding_goal': Decimal('25000'),
            'current_funding': Decimal('8500'),
            'is_featured': False
        },
        {
            'title': 'EduTech Burundi',
            'description': 'Plateforme d\'apprentissage en ligne adaptée au contexte éducatif burundais.',
            'category': 'EdTech',
            'stage': 'development',
            'funding_goal': Decimal('75000'),
            'current_funding': Decimal('15000'),
            'is_featured': True
        }
    ]
    
    created_projects = []
    for i, project_data in enumerate(projects_data):
        category = next((c for c in project_categories if c.name == project_data['category']), project_categories[0])
        founder = users[i % len(users)]
        
        project, created = Project.objects.get_or_create(
            title=project_data['title'],
            defaults={
                'description': project_data['description'],
                'founder': founder,
                'category': category,
                'stage': project_data['stage'],
                'funding_goal': project_data['funding_goal'],
                'current_funding': project_data['current_funding'],
                'is_featured': project_data['is_featured'],
                'is_published': True
            }
        )
        if created:
            print(f"   ✅ Projet créé: {project.title}")
        else:
            print(f"   ⏭️  Projet existe: {project.title}")
        created_projects.append(project)
    
    return created_projects

def create_equipment():
    """Créer des équipements Fab Lab"""
    print("🔧 Création des équipements...")
    
    # Créer les catégories d'équipements
    equipment_categories = []
    for cat_name in ['Impression 3D', 'Électronique', 'Menuiserie', 'Textile', 'Informatique']:
        category, created = EquipmentCategory.objects.get_or_create(
            name=cat_name,
            defaults={'description': f'Équipements de {cat_name}'}
        )
        equipment_categories.append(category)
    
    equipment_data = [
        {
            'name': 'Imprimante 3D Prusa i3 MK3S+',
            'description': 'Imprimante 3D professionnelle pour prototypage rapide',
            'category': 'Impression 3D',
            'status': 'available',
            'hourly_rate': Decimal('5000')
        },
        {
            'name': 'Arduino Starter Kit',
            'description': 'Kit complet pour débuter en électronique et programmation',
            'category': 'Électronique',
            'status': 'available',
            'hourly_rate': Decimal('2000')
        },
        {
            'name': 'Découpeuse Laser CO2',
            'description': 'Découpeuse laser pour matériaux fins (bois, acrylique, carton)',
            'category': 'Menuiserie',
            'status': 'maintenance',
            'hourly_rate': Decimal('8000')
        },
        {
            'name': 'Machine à Coudre Industrielle',
            'description': 'Machine à coudre pour projets textiles et prototypage',
            'category': 'Textile',
            'status': 'available',
            'hourly_rate': Decimal('3000')
        }
    ]
    
    created_equipment = []
    for equip_data in equipment_data:
        category = next((c for c in equipment_categories if c.name == equip_data['category']), equipment_categories[0])
        
        equipment, created = Equipment.objects.get_or_create(
            name=equip_data['name'],
            defaults={
                'description': equip_data['description'],
                'category': category,
                'status': equip_data['status'],
                'hourly_rate': equip_data['hourly_rate'],
                'is_available': equip_data['status'] == 'available'
            }
        )
        if created:
            print(f"   ✅ Équipement créé: {equipment.name}")
        else:
            print(f"   ⏭️  Équipement existe: {equipment.name}")
        created_equipment.append(equipment)
    
    return created_equipment

def create_forum_data(users):
    """Créer des données de forum"""
    print("💬 Création des données de forum...")
    
    # Créer les catégories de forum
    forum_categories = []
    categories_data = [
        {
            'name': 'Général',
            'description': 'Discussions générales sur l\'innovation au Burundi',
            'color': '#6B7280'
        },
        {
            'name': 'Projets',
            'description': 'Partage et discussion de projets',
            'color': '#8B5CF6'
        },
        {
            'name': 'Fab Lab',
            'description': 'Questions et astuces sur les équipements',
            'color': '#F59E0B'
        },
        {
            'name': 'Mentorat',
            'description': 'Demandes de mentorat et conseils',
            'color': '#10B981'
        }
    ]
    
    for cat_data in categories_data:
        category, created = ForumCategory.objects.get_or_create(
            name=cat_data['name'],
            defaults={
                'description': cat_data['description'],
                'color': cat_data['color']
            }
        )
        if created:
            print(f"   ✅ Catégorie forum créée: {category.name}")
        forum_categories.append(category)
    
    # Créer quelques topics
    topics_data = [
        {
            'title': 'Bienvenue au Community Lab Burundi !',
            'content': 'Présentez-vous et partagez vos projets d\'innovation.',
            'category': 'Général',
            'is_pinned': True
        },
        {
            'title': 'Recherche mentor pour projet AgriTech',
            'content': 'Je développe une app pour les agriculteurs et cherche un mentor expérimenté.',
            'category': 'Mentorat',
            'is_pinned': False
        },
        {
            'title': 'Problème avec l\'imprimante 3D',
            'content': 'L\'imprimante fait du bruit étrange, quelqu\'un a une idée ?',
            'category': 'Fab Lab',
            'is_pinned': False
        }
    ]
    
    for topic_data in topics_data:
        category = next((c for c in forum_categories if c.name == topic_data['category']), forum_categories[0])
        author = users[0]  # Marie comme auteur par défaut
        
        topic, created = Topic.objects.get_or_create(
            title=topic_data['title'],
            defaults={
                'content': topic_data['content'],
                'author': author,
                'category': category,
                'is_pinned': topic_data['is_pinned']
            }
        )
        if created:
            print(f"   ✅ Topic créé: {topic.title}")

def create_organizations():
    """Créer des organisations partenaires"""
    print("🏢 Création des organisations...")
    
    organizations_data = [
        {
            'name': 'Université du Burundi',
            'description': 'Première université publique du Burundi, partenaire académique principal.',
            'type': 'university',
            'sector': 'education',
            'location': 'Bujumbura, Burundi',
            'website': 'https://ub.edu.bi',
            'email': 'info@ub.edu.bi'
        },
        {
            'name': 'ARCT - Agence de Régulation des Communications',
            'description': 'Régulateur des télécommunications et des TIC au Burundi.',
            'type': 'government',
            'sector': 'technology',
            'location': 'Bujumbura, Burundi',
            'website': 'https://arct.gov.bi',
            'email': 'info@arct.gov.bi'
        },
        {
            'name': 'Burundi Entrepreneurs Network',
            'description': 'Réseau d\'entrepreneurs burundais pour l\'innovation et la croissance.',
            'type': 'ngo',
            'sector': 'entrepreneurship',
            'location': 'Bujumbura, Burundi',
            'website': 'https://ben.bi',
            'email': 'contact@ben.bi'
        }
    ]
    
    for org_data in organizations_data:
        organization, created = Organization.objects.get_or_create(
            name=org_data['name'],
            defaults={
                'description': org_data['description'],
                'organization_type': org_data['type'],
                'sector': org_data['sector'],
                'location': org_data['location'],
                'website': org_data['website'],
                'email': org_data['email']
            }
        )
        if created:
            print(f"   ✅ Organisation créée: {organization.name}")
        else:
            print(f"   ⏭️  Organisation existe: {organization.name}")

def create_notifications(users):
    """Créer des notifications de test"""
    print("🔔 Création des notifications...")
    
    notifications_data = [
        {
            'title': 'Nouveau cours disponible',
            'message': 'Le cours "Python pour l\'Agriculture" est maintenant disponible !',
            'type': 'course',
            'priority': 'medium'
        },
        {
            'title': 'Votre projet a été approuvé',
            'message': 'Félicitations ! Votre projet EcoFarm Solutions a été approuvé.',
            'type': 'project',
            'priority': 'high'
        },
        {
            'title': 'Équipement disponible',
            'message': 'L\'imprimante 3D que vous avez réservée est maintenant disponible.',
            'type': 'system',
            'priority': 'medium'
        }
    ]
    
    for notif_data in notifications_data:
        for user in users[:2]:  # Créer pour les 2 premiers utilisateurs
            notification, created = Notification.objects.get_or_create(
                recipient=user,
                title=notif_data['title'],
                defaults={
                    'message': notif_data['message'],
                    'notification_type': notif_data['type'],
                    'priority': notif_data['priority']
                }
            )
            if created:
                print(f"   ✅ Notification créée pour {user.username}: {notification.title}")

def main():
    """Fonction principale"""
    print("🚀 CRÉATION DES DONNÉES DE TEST")
    print("Community Laboratory Burundi")
    print("=" * 50)
    print("")
    
    try:
        # Créer les utilisateurs
        users = create_users()
        print("")
        
        # Créer les catégories et cours
        course_categories = create_course_categories()
        courses = create_courses(users, course_categories)
        print("")
        
        # Créer les projets
        projects = create_projects(users)
        print("")
        
        # Créer les équipements
        equipment = create_equipment()
        print("")
        
        # Créer les données de forum
        create_forum_data(users)
        print("")
        
        # Créer les organisations
        create_organizations()
        print("")
        
        # Créer les notifications
        create_notifications(users)
        print("")
        
        print("=" * 50)
        print("✅ DONNÉES DE TEST CRÉÉES AVEC SUCCÈS !")
        print("")
        print("📊 Résumé:")
        print(f"   👥 Utilisateurs: {len(users)}")
        print(f"   📚 Cours: {len(courses)}")
        print(f"   🚀 Projets: {len(projects)}")
        print(f"   🔧 Équipements: {len(equipment)}")
        print(f"   🏢 Organisations: {Organization.objects.count()}")
        print(f"   🔔 Notifications: {Notification.objects.count()}")
        print("")
        print("🎯 Vous pouvez maintenant tester la plateforme avec des données réalistes !")
        print("=" * 50)
        
    except Exception as e:
        print(f"❌ Erreur lors de la création des données: {e}")
        sys.exit(1)

if __name__ == '__main__':
    main()
