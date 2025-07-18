#!/usr/bin/env python
"""
Script pour peupler la base de données avec des équipements d'exemple
conformes aux standards Fab Lab internationaux
"""
import os
import sys
import django
from datetime import date, timedelta

# Configuration Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'comlab.settings')
django.setup()

from lab_equipment.models import EquipmentCategory, Equipment
from django.contrib.auth import get_user_model

User = get_user_model()

def create_fab_lab_equipment():
    """Créer les équipements standards d'un Fab Lab"""
    
    print("🔧 Création des catégories d'équipements...")
    
    # Catégories selon MIT Fab Lab Charter
    categories_data = [
        {
            'name': 'Impression 3D',
            'category_type': '3d_printing',
            'description': 'Imprimantes 3D pour prototypage rapide',
            'icon': 'cube',
            'color': '#FF6B35',
            'requires_training': True,
            'safety_level': 2
        },
        {
            'name': 'Découpe Laser',
            'category_type': 'laser_cutting',
            'description': 'Découpeuses laser pour matériaux variés',
            'icon': 'bolt',
            'color': '#F7931E',
            'requires_training': True,
            'safety_level': 4
        },
        {
            'name': 'Fraiseuse CNC',
            'category_type': 'cnc_milling',
            'description': 'Fraiseuses à commande numérique',
            'icon': 'cog',
            'color': '#FFD23F',
            'requires_training': True,
            'safety_level': 5
        },
        {
            'name': 'Électronique',
            'category_type': 'electronics',
            'description': 'Équipements pour prototypage électronique',
            'icon': 'cpu-chip',
            'color': '#06FFA5',
            'requires_training': True,
            'safety_level': 3
        },
        {
            'name': 'Informatique',
            'category_type': 'computers',
            'description': 'Ordinateurs et équipements informatiques',
            'icon': 'computer-desktop',
            'color': '#4ECDC4',
            'requires_training': False,
            'safety_level': 1
        },
        {
            'name': 'Outils Manuels',
            'category_type': 'hand_tools',
            'description': 'Outils manuels traditionnels',
            'icon': 'wrench-screwdriver',
            'color': '#45B7D1',
            'requires_training': False,
            'safety_level': 2
        }
    ]
    
    categories = {}
    for cat_data in categories_data:
        category, created = EquipmentCategory.objects.get_or_create(
            name=cat_data['name'],
            defaults=cat_data
        )
        categories[cat_data['category_type']] = category
        if created:
            print(f"  ✅ Catégorie créée: {category.name}")
    
    print("\n🏭 Création des équipements...")
    
    # Obtenir un utilisateur responsable
    admin_user = User.objects.filter(is_staff=True).first()
    
    # Équipements standards Fab Lab
    equipment_data = [
        # Impression 3D
        {
            'name': 'Prusa i3 MK3S+',
            'category': categories['3d_printing'],
            'description': 'Imprimante 3D FDM haute précision',
            'brand': 'Prusa Research',
            'model': 'i3 MK3S+',
            'serial_number': 'PRUSA001',
            'specifications': {
                'volume_impression': '250×210×210 mm',
                'precision': '±0.1 mm',
                'materiaux': ['PLA', 'PETG', 'ABS', 'ASA'],
                'vitesse_max': '200 mm/s'
            },
            'location': 'Zone Impression 3D - A1',
            'purchase_date': date(2023, 1, 15),
            'purchase_price': 899.00,
            'maintenance_interval_days': 90,
            'manual_url': 'https://help.prusa3d.com/guide/how-to-print-on-the-original-prusa-i3-mk3s-mk3s_1999',
            'safety_instructions': 'Porter des lunettes de protection. Attention aux surfaces chaudes.'
        },
        {
            'name': 'Ultimaker S3',
            'category': categories['3d_printing'],
            'description': 'Imprimante 3D professionnelle double extrusion',
            'brand': 'Ultimaker',
            'model': 'S3',
            'serial_number': 'ULT001',
            'specifications': {
                'volume_impression': '230×190×200 mm',
                'precision': '±0.02 mm',
                'materiaux': ['PLA', 'ABS', 'PETG', 'TPU', 'PVA'],
                'double_extrusion': True
            },
            'location': 'Zone Impression 3D - A2',
            'purchase_date': date(2023, 3, 10),
            'purchase_price': 3995.00,
            'maintenance_interval_days': 60
        },
        
        # Découpe Laser
        {
            'name': 'Epilog Zing 24',
            'category': categories['laser_cutting'],
            'description': 'Découpeuse laser CO2 60W',
            'brand': 'Epilog Laser',
            'model': 'Zing 24',
            'serial_number': 'EPI001',
            'specifications': {
                'puissance': '60W',
                'surface_travail': '610×305 mm',
                'materiaux': ['Bois', 'Acrylique', 'Carton', 'Cuir', 'Tissu'],
                'epaisseur_max': '13 mm'
            },
            'location': 'Zone Découpe - B1',
            'purchase_date': date(2022, 11, 20),
            'purchase_price': 15999.00,
            'maintenance_interval_days': 30,
            'safety_instructions': 'Formation obligatoire. Port des lunettes laser. Ventilation requise.'
        },
        
        # CNC
        {
            'name': 'Shapeoko 4 XXL',
            'category': categories['cnc_milling'],
            'description': 'Fraiseuse CNC pour bois et métaux tendres',
            'brand': 'Carbide 3D',
            'model': 'Shapeoko 4 XXL',
            'serial_number': 'SHP001',
            'specifications': {
                'surface_travail': '838×838×120 mm',
                'precision': '±0.025 mm',
                'materiaux': ['Bois', 'Aluminium', 'Plastique', 'Laiton'],
                'vitesse_broche': '11000 RPM'
            },
            'location': 'Zone CNC - C1',
            'purchase_date': date(2023, 2, 5),
            'purchase_price': 2200.00,
            'maintenance_interval_days': 45,
            'safety_instructions': 'Formation obligatoire. Port des EPI complets. Fixation sécurisée des pièces.'
        },
        
        # Électronique
        {
            'name': 'Station de Soudage Weller',
            'category': categories['electronics'],
            'description': 'Station de soudage professionnelle',
            'brand': 'Weller',
            'model': 'WE 1010',
            'serial_number': 'WEL001',
            'specifications': {
                'puissance': '70W',
                'temperature': '100-450°C',
                'precision': '±6°C',
                'accessoires': ['Fer', 'Support', 'Éponge']
            },
            'location': 'Zone Électronique - D1',
            'purchase_date': date(2023, 1, 8),
            'purchase_price': 189.00,
            'maintenance_interval_days': 180
        },
        {
            'name': 'Oscilloscope Rigol',
            'category': categories['electronics'],
            'description': 'Oscilloscope numérique 2 voies',
            'brand': 'Rigol',
            'model': 'DS1054Z',
            'serial_number': 'RIG001',
            'specifications': {
                'voies': 4,
                'bande_passante': '50 MHz',
                'echantillonnage': '1 GSa/s',
                'memoire': '24 Mpts'
            },
            'location': 'Zone Électronique - D2',
            'purchase_date': date(2022, 12, 15),
            'purchase_price': 399.00,
            'maintenance_interval_days': 365
        },
        
        # Informatique
        {
            'name': 'Workstation Design',
            'category': categories['computers'],
            'description': 'Station de travail pour CAO/FAO',
            'brand': 'Dell',
            'model': 'Precision 3660',
            'serial_number': 'DEL001',
            'specifications': {
                'processeur': 'Intel i7-12700',
                'ram': '32 GB DDR4',
                'gpu': 'NVIDIA RTX A2000',
                'stockage': '1TB NVMe SSD',
                'logiciels': ['Fusion 360', 'SolidWorks', 'KiCad', 'Cura']
            },
            'location': 'Zone Design - E1',
            'purchase_date': date(2023, 4, 1),
            'purchase_price': 2499.00,
            'maintenance_interval_days': 180
        }
    ]
    
    for eq_data in equipment_data:
        equipment, created = Equipment.objects.get_or_create(
            serial_number=eq_data['serial_number'],
            defaults={
                **eq_data,
                'responsible_person': admin_user,
                'next_maintenance': date.today() + timedelta(days=eq_data.get('maintenance_interval_days', 90))
            }
        )
        if created:
            print(f"  ✅ Équipement créé: {equipment.name}")
    
    print(f"\n🎉 Base de données peuplée avec succès!")
    print(f"   📦 {EquipmentCategory.objects.count()} catégories")
    print(f"   🔧 {Equipment.objects.count()} équipements")
    print(f"\n🌐 Accédez aux équipements via: /api/lab-equipment/equipment/")

if __name__ == '__main__':
    create_fab_lab_equipment()
