#!/usr/bin/env python3
"""
Script pour créer des données dynamiques réalistes
Community Laboratory Burundi - Version adaptée aux modèles existants
"""

import os
import sys
import django
from datetime import datetime, timedelta, date
from decimal import Decimal

# Configuration Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'comlab.settings')
django.setup()

# Imports des modèles existants
from django.contrib.auth import get_user_model
from education.models import Course
from entrepreneurship.models import Startup, Project
from lab_equipment.models import Equipment, EquipmentCategory
from forum.models import Category as ForumCategory, Topic, Post
from organizations.models import Organization
from notifs.models import Notification

User = get_user_model()

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

def create_courses(users):
    """Créer des cours de test"""
    print("📚 Création des cours...")
    
    courses_data = [
        {
            'title': 'Python pour l\'Agriculture Intelligente',
            'description': 'Apprenez Python en développant des solutions pour l\'agriculture burundaise moderne. Ce cours couvre les bases de la programmation Python appliquées aux défis agricoles locaux.',
            'level': 'beginner',
            'duration_weeks': 8,
            'syllabus': 'Semaine 1-2: Bases de Python\nSemaine 3-4: Manipulation de données agricoles\nSemaine 5-6: APIs météo et IoT\nSemaine 7-8: Projet final',
            'objectives': 'Maîtriser Python pour créer des solutions agricoles innovantes',
            'prerequisites': 'Aucun prérequis, cours pour débutants'
        },
        {
            'title': 'Entrepreneuriat Social au Burundi',
            'description': 'Créez une entreprise sociale qui répond aux défis locaux. Apprenez les méthodologies de l\'entrepreneuriat social adapté au contexte burundais.',
            'level': 'intermediate',
            'duration_weeks': 6,
            'syllabus': 'Module 1: Identification des problèmes sociaux\nModule 2: Modèles économiques durables\nModule 3: Financement et partenariats\nModule 4: Impact et mesure',
            'objectives': 'Lancer une entreprise sociale viable au Burundi',
            'prerequisites': 'Expérience de base en gestion ou entrepreneuriat'
        },
        {
            'title': 'Design Thinking pour l\'Innovation',
            'description': 'Méthodologie de design thinking appliquée aux défis burundais. Apprenez à innover de manière centrée sur l\'utilisateur.',
            'level': 'beginner',
            'duration_weeks': 4,
            'syllabus': 'Phase 1: Empathie et définition\nPhase 2: Idéation créative\nPhase 3: Prototypage rapide\nPhase 4: Test et itération',
            'objectives': 'Maîtriser la méthodologie du design thinking',
            'prerequisites': 'Curiosité et créativité'
        },
        {
            'title': 'Agriculture de Précision avec IoT',
            'description': 'Utilisez l\'Internet des Objets pour optimiser vos cultures. Cours avancé sur les technologies IoT appliquées à l\'agriculture.',
            'level': 'advanced',
            'duration_weeks': 10,
            'syllabus': 'Capteurs et microcontrôleurs\nRéseaux IoT et connectivité\nAnalyse de données agricoles\nAutomatisation des systèmes',
            'objectives': 'Implémenter des solutions IoT pour l\'agriculture de précision',
            'prerequisites': 'Connaissances en électronique et programmation'
        }
    ]
    
    created_courses = []
    for i, course_data in enumerate(courses_data):
        instructor = users[i % len(users)]  # Rotation des instructeurs
        
        course, created = Course.objects.get_or_create(
            title=course_data['title'],
            defaults={
                'description': course_data['description'],
                'instructor': instructor,
                'level': course_data['level'],
                'duration_weeks': course_data['duration_weeks'],
                'syllabus': course_data['syllabus'],
                'objectives': course_data['objectives'],
                'prerequisites': course_data['prerequisites'],
                'is_active': True
            }
        )
        if created:
            print(f"   ✅ Cours créé: {course.title}")
        else:
            print(f"   ⏭️  Cours existe: {course.title}")
        created_courses.append(course)
    
    return created_courses

def create_startups(users):
    """Créer des startups entrepreneuriales"""
    print("🚀 Création des startups...")
    
    startups_data = [
        {
            'name': 'EcoFarm Solutions',
            'description': 'Plateforme digitale pour connecter les agriculteurs burundais aux marchés locaux et internationaux. Solution complète incluant prévisions météo, conseils agricoles et marketplace.',
            'industry': 'AgriTech',
            'founding_date': date(2023, 6, 15),
            'website': 'https://ecofarm-solutions.bi',
            'team_size': 8,
            'funding_stage': 'seed',
            'total_funding': Decimal('32000.00')
        },
        {
            'name': 'BurundiCraft Marketplace',
            'description': 'Marketplace en ligne pour promouvoir et vendre l\'artisanat traditionnel burundais. Plateforme e-commerce dédiée aux artisans locaux.',
            'industry': 'E-commerce',
            'founding_date': date(2023, 9, 10),
            'website': 'https://burundicraft.bi',
            'team_size': 5,
            'funding_stage': 'pre_seed',
            'total_funding': Decimal('8500.00')
        },
        {
            'name': 'EduTech Burundi',
            'description': 'Plateforme d\'apprentissage en ligne adaptée au contexte éducatif burundais. Solutions e-learning accessibles et culturellement pertinentes.',
            'industry': 'EdTech',
            'founding_date': date(2023, 3, 20),
            'website': 'https://edutech-burundi.com',
            'team_size': 12,
            'funding_stage': 'series_a',
            'total_funding': Decimal('75000.00')
        },
        {
            'name': 'HealthConnect Burundi',
            'description': 'Application mobile pour connecter les patients aux professionnels de santé dans les zones rurales du Burundi.',
            'industry': 'HealthTech',
            'founding_date': date(2023, 11, 5),
            'website': 'https://healthconnect.bi',
            'team_size': 6,
            'funding_stage': 'pre_seed',
            'total_funding': Decimal('15000.00')
        }
    ]
    
    created_startups = []
    for i, startup_data in enumerate(startups_data):
        founder = users[i % len(users)]
        
        startup, created = Startup.objects.get_or_create(
            name=startup_data['name'],
            defaults={
                'description': startup_data['description'],
                'founder': founder,
                'industry': startup_data['industry'],
                'founding_date': startup_data['founding_date'],
                'website': startup_data['website'],
                'team_size': startup_data['team_size'],
                'funding_stage': startup_data['funding_stage'],
                'total_funding': startup_data['total_funding'],
                'status': 'active'
            }
        )
        if created:
            print(f"   ✅ Startup créée: {startup.name}")
        else:
            print(f"   ⏭️  Startup existe: {startup.name}")
        created_startups.append(startup)
    
    return created_startups

def create_projects(startups, users):
    """Créer des projets pour les startups"""
    print("📋 Création des projets...")

    projects_data = [
        {
            'title': 'Développement de l\'application mobile EcoFarm',
            'description': 'Création de l\'application mobile pour connecter les agriculteurs aux marchés. Interface utilisateur intuitive et fonctionnalités de géolocalisation.',
            'startup_name': 'EcoFarm Solutions',
            'status': 'in_progress',
            'priority': 'high',
            'start_date': date(2024, 1, 15),
            'end_date': date(2024, 6, 30),
            'budget': Decimal('25000.00')
        },
        {
            'title': 'Plateforme e-commerce BurundiCraft',
            'description': 'Développement de la plateforme e-commerce pour les artisans burundais. Système de paiement mobile et logistique intégrée.',
            'startup_name': 'BurundiCraft Marketplace',
            'status': 'in_progress',
            'priority': 'high',
            'start_date': date(2024, 2, 1),
            'end_date': date(2024, 8, 31),
            'budget': Decimal('15000.00')
        },
        {
            'title': 'Contenu éducatif adapté au Burundi',
            'description': 'Création de contenu éducatif en kirundi et français, adapté au curriculum burundais. Vidéos interactives et exercices pratiques.',
            'startup_name': 'EduTech Burundi',
            'status': 'in_progress',
            'priority': 'medium',
            'start_date': date(2024, 1, 10),
            'end_date': date(2024, 12, 31),
            'budget': Decimal('35000.00')
        },
        {
            'title': 'Application de télémédecine',
            'description': 'Développement de l\'application mobile pour connecter patients et médecins dans les zones rurales. Consultation vidéo et suivi médical.',
            'startup_name': 'HealthConnect Burundi',
            'status': 'not_started',
            'priority': 'high',
            'start_date': date(2024, 3, 1),
            'end_date': date(2024, 10, 31),
            'budget': Decimal('20000.00')
        }
    ]

    created_projects = []
    for project_data in projects_data:
        # Trouver la startup correspondante
        startup = next((s for s in startups if s.name == project_data['startup_name']), startups[0])
        manager = users[0]  # Marie comme manager par défaut

        project, created = Project.objects.get_or_create(
            title=project_data['title'],
            defaults={
                'description': project_data['description'],
                'startup': startup,
                'status': project_data['status'],
                'priority': project_data['priority'],
                'start_date': project_data['start_date'],
                'end_date': project_data['end_date'],
                'budget': project_data['budget'],
                'manager': manager
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

    # D'abord créer les catégories d'équipements
    categories_data = [
        {
            'name': 'Impression 3D',
            'category_type': '3d_printing',
            'description': 'Équipements d\'impression 3D pour prototypage',
            'icon': 'printer',
            'color': '#2196F3'
        },
        {
            'name': 'Électronique',
            'category_type': 'electronics',
            'description': 'Composants et outils électroniques',
            'icon': 'cpu',
            'color': '#FF9800'
        },
        {
            'name': 'Découpe Laser',
            'category_type': 'laser_cutting',
            'description': 'Découpeuses laser pour matériaux fins',
            'icon': 'zap',
            'color': '#F44336'
        },
        {
            'name': 'Textile',
            'category_type': 'textiles',
            'description': 'Équipements pour travail textile',
            'icon': 'scissors',
            'color': '#9C27B0'
        }
    ]

    created_categories = []
    for cat_data in categories_data:
        category, created = EquipmentCategory.objects.get_or_create(
            name=cat_data['name'],
            defaults={
                'category_type': cat_data['category_type'],
                'description': cat_data['description'],
                'icon': cat_data['icon'],
                'color': cat_data['color']
            }
        )
        if created:
            print(f"   ✅ Catégorie créée: {category.name}")
        created_categories.append(category)

    # Maintenant créer les équipements
    equipment_data = [
        {
            'name': 'Imprimante 3D Prusa i3 MK3S+',
            'description': 'Imprimante 3D professionnelle pour prototypage rapide. Idéale pour créer des pièces en plastique de haute qualité.',
            'category_name': 'Impression 3D',
            'status': 'available',
            'location': 'Atelier Principal',
            'serial_number': 'PRUSA-001'
        },
        {
            'name': 'Arduino Starter Kit',
            'description': 'Kit complet pour débuter en électronique et programmation. Inclut microcontrôleur, capteurs et composants.',
            'category_name': 'Électronique',
            'status': 'available',
            'location': 'Espace Électronique',
            'serial_number': 'ARD-KIT-001'
        },
        {
            'name': 'Découpeuse Laser CO2',
            'description': 'Découpeuse laser pour matériaux fins (bois, acrylique, carton). Précision professionnelle.',
            'category_name': 'Découpe Laser',
            'status': 'maintenance',
            'location': 'Atelier Laser',
            'serial_number': 'LASER-001'
        },
        {
            'name': 'Machine à Coudre Industrielle',
            'description': 'Machine à coudre pour projets textiles et prototypage. Idéale pour les projets de mode et design.',
            'category_name': 'Textile',
            'status': 'available',
            'location': 'Atelier Textile',
            'serial_number': 'SEW-001'
        },
        {
            'name': 'Oscilloscope Numérique',
            'description': 'Oscilloscope pour analyse de signaux électroniques. Outil essentiel pour le développement électronique.',
            'category_name': 'Électronique',
            'status': 'available',
            'location': 'Laboratoire Électronique',
            'serial_number': 'OSC-001'
        }
    ]

    created_equipment = []
    for equip_data in equipment_data:
        # Trouver la catégorie
        category = next((c for c in created_categories if c.name == equip_data['category_name']), created_categories[0])

        equipment, created = Equipment.objects.get_or_create(
            name=equip_data['name'],
            defaults={
                'description': equip_data['description'],
                'category': category,
                'status': equip_data['status'],
                'location': equip_data['location'],
                'serial_number': equip_data['serial_number'],
                'purchase_date': date(2023, 1, 15),  # Date d'achat par défaut
                'purchase_price': Decimal('1000.00')  # Prix par défaut
            }
        )
        if created:
            print(f"   ✅ Équipement créé: {equipment.name}")
        else:
            print(f"   ⏭️  Équipement existe: {equipment.name}")
        created_equipment.append(equipment)

    return created_equipment

def create_forum_categories():
    """Créer des catégories de forum"""
    print("💬 Création des catégories de forum...")

    categories_data = [
        {
            'name': 'Général',
            'description': 'Discussions générales sur l\'innovation et la technologie au Burundi',
            'order': 1
        },
        {
            'name': 'Projets',
            'description': 'Partage et discussion de projets entrepreneuriaux et techniques',
            'order': 2
        },
        {
            'name': 'Fab Lab',
            'description': 'Questions et astuces sur l\'utilisation des équipements du Fab Lab',
            'order': 3
        },
        {
            'name': 'Mentorat',
            'description': 'Demandes de mentorat et conseils d\'experts',
            'order': 4
        },
        {
            'name': 'Événements',
            'description': 'Annonces et discussions sur les événements du Community Lab',
            'order': 5
        },
        {
            'name': 'Emploi & Stages',
            'description': 'Offres d\'emploi, stages et opportunités professionnelles',
            'order': 6
        }
    ]

    created_categories = []
    for cat_data in categories_data:
        category, created = ForumCategory.objects.get_or_create(
            name=cat_data['name'],
            defaults={
                'description': cat_data['description'],
                'order': cat_data['order']
            }
        )
        if created:
            print(f"   ✅ Catégorie forum créée: {category.name}")
        else:
            print(f"   ⏭️  Catégorie forum existe: {category.name}")
        created_categories.append(category)

    return created_categories

def create_organizations():
    """Créer des organisations partenaires"""
    print("🏢 Création des organisations...")
    
    organizations_data = [
        {
            'name': 'Université du Burundi',
            'description': 'Première université publique du Burundi, partenaire académique principal du Community Lab.',
            'organization_type': 'university',
            'sector': 'education',
            'location': 'Bujumbura, Burundi',
            'website': 'https://ub.edu.bi',
            'email': 'info@ub.edu.bi',
            'phone': '+257 22 22 30 54'
        },
        {
            'name': 'ARCT - Agence de Régulation des Communications',
            'description': 'Régulateur des télécommunications et des TIC au Burundi. Partenaire stratégique pour l\'innovation numérique.',
            'organization_type': 'government',
            'sector': 'technology',
            'location': 'Bujumbura, Burundi',
            'website': 'https://arct.gov.bi',
            'email': 'info@arct.gov.bi',
            'phone': '+257 22 21 21 21'
        },
        {
            'name': 'Burundi Entrepreneurs Network',
            'description': 'Réseau d\'entrepreneurs burundais pour l\'innovation et la croissance. Communauté active de startups.',
            'organization_type': 'ngo',
            'sector': 'entrepreneurship',
            'location': 'Bujumbura, Burundi',
            'website': 'https://ben.bi',
            'email': 'contact@ben.bi',
            'phone': '+257 79 12 34 56'
        },
        {
            'name': 'Banque de la République du Burundi',
            'description': 'Banque centrale du Burundi. Partenaire pour les initiatives FinTech et l\'inclusion financière.',
            'organization_type': 'government',
            'sector': 'finance',
            'location': 'Bujumbura, Burundi',
            'website': 'https://brb.bi',
            'email': 'info@brb.bi',
            'phone': '+257 22 22 56 00'
        }
    ]
    
    for org_data in organizations_data:
        organization, created = Organization.objects.get_or_create(
            name=org_data['name'],
            defaults={
                'description': org_data['description'],
                'type': org_data['organization_type'],
                'sector': org_data['sector'],
                'location': org_data['location'],
                'website': org_data['website'],
                'contact_email': org_data['email'],
                'contact_phone': org_data.get('phone', ''),
                'founding_date': date(2020, 1, 1),  # Date par défaut
                'stage': 'established',  # Stage par défaut
                'team_size': 50,  # Taille d'équipe par défaut
                'funding_raised': Decimal('0.00'),  # Financement par défaut
                'is_active': True
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
            'message': 'Le cours "Python pour l\'Agriculture" est maintenant disponible ! Inscrivez-vous dès maintenant.',
            'notification_type': 'course',
            'priority': 'medium'
        },
        {
            'title': 'Votre startup a été approuvée',
            'message': 'Félicitations ! Votre startup EcoFarm Solutions a été approuvée et ajoutée à notre incubateur.',
            'notification_type': 'startup',
            'priority': 'high'
        },
        {
            'title': 'Nouveau projet assigné',
            'message': 'Un nouveau projet vous a été assigné. Consultez vos projets pour plus de détails.',
            'notification_type': 'project',
            'priority': 'medium'
        },
        {
            'title': 'Notification système',
            'message': 'Maintenance programmée du système ce weekend. Prévoyez vos activités en conséquence.',
            'notification_type': 'system',
            'priority': 'low'
        }
    ]
    
    for notif_data in notifications_data:
        for user in users[:3]:  # Créer pour les 3 premiers utilisateurs
            notification, created = Notification.objects.get_or_create(
                recipient=user,
                title=notif_data['title'],
                defaults={
                    'message': notif_data['message'],
                    'notification_type': notif_data['notification_type'],
                    'priority': notif_data['priority'],
                    'is_read': False
                }
            )
            if created:
                print(f"   ✅ Notification créée pour {user.username}: {notification.title}")

def main():
    """Fonction principale"""
    print("🚀 CRÉATION DES DONNÉES DYNAMIQUES")
    print("Community Laboratory Burundi")
    print("=" * 50)
    print("")
    
    try:
        # Créer les utilisateurs
        users = create_users()
        print("")
        
        # Créer les cours
        courses = create_courses(users)
        print("")
        
        # Créer les startups
        startups = create_startups(users)
        print("")

        # Créer les projets
        projects = create_projects(startups, users)
        print("")

        # Créer les équipements
        equipment = create_equipment()
        print("")

        # Créer les catégories de forum
        forum_categories = create_forum_categories()
        print("")
        
        # Créer les organisations
        create_organizations()
        print("")
        
        # Créer les notifications
        create_notifications(users)
        print("")
        
        print("=" * 50)
        print("✅ DONNÉES DYNAMIQUES CRÉÉES AVEC SUCCÈS !")
        print("")
        print("📊 Résumé:")
        print(f"   👥 Utilisateurs: {len(users)}")
        print(f"   📚 Cours: {len(courses)}")
        print(f"   🚀 Startups: {len(startups)}")
        print(f"   � Projets: {Project.objects.count()}")
        print(f"   �🔧 Équipements: {len(equipment)}")
        print(f"   💬 Catégories Forum: {ForumCategory.objects.count()}")
        print(f"   🏢 Organisations: {Organization.objects.count()}")
        print(f"   🔔 Notifications: {Notification.objects.count()}")
        print("")
        print("🎯 La plateforme est maintenant dynamique avec des données réelles !")
        print("🌐 Testez les pages frontend pour voir les données en action.")
        print("=" * 50)
        
    except Exception as e:
        print(f"❌ Erreur lors de la création des données: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == '__main__':
    main()
