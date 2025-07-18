#!/usr/bin/env python
"""
Test rapide de l'API Équipements
"""
import requests
import json
from datetime import datetime

BASE_URL = 'http://localhost:8000/api'

def test_equipment_api():
    print("🧪 Test de l'API Équipements du Lab")
    print("=" * 50)
    
    # 1. Obtenir un token d'authentification
    print("🔐 Authentification...")
    auth_response = requests.post(f'{BASE_URL}/token/', {
        'username': 'admin',
        'password': 'admin123'
    })
    
    if auth_response.status_code != 200:
        print("[FAIL] Échec de l'authentification")
        return
    
    token = auth_response.json()['access']
    headers = {'Authorization': f'Bearer {token}'}
    print("✅ Authentification réussie")
    
    # 2. Tester les endpoints équipements
    endpoints_tests = [
        ('GET', '/lab-equipment/categories/', 'Liste des catégories'),
        ('GET', '/lab-equipment/equipment/', 'Liste des équipements'),
        ('GET', '/lab-equipment/equipment/available/', 'Équipements disponibles'),
        ('GET', '/lab-equipment/equipment/stats/', 'Statistiques équipements'),
        ('GET', '/lab-equipment/reservations/', 'Liste des réservations'),
        ('GET', '/lab-equipment/maintenance/', 'Logs de maintenance'),
        ('GET', '/lab-equipment/certifications/', 'Certifications'),
        ('GET', '/lab-equipment/usage-logs/', 'Logs d\'utilisation'),
    ]
    
    results = {'success': [], 'failed': []}
    
    for method, endpoint, description in endpoints_tests:
        try:
            if method == 'GET':
                response = requests.get(f'{BASE_URL}{endpoint}', headers=headers)
            
            if response.status_code in [200, 201]:
                results['success'].append({
                    'endpoint': endpoint,
                    'description': description,
                    'status': response.status_code,
                    'data_count': len(response.json().get('results', response.json())) if isinstance(response.json(), (list, dict)) else 0
                })
                print(f"✅ {description}: {response.status_code}")
                
                # Afficher quelques détails pour les équipements
                if 'equipment/' == endpoint.split('/')[-2] + '/':
                    data = response.json()
                    if 'results' in data and data['results']:
                        equipment = data['results'][0]
                        print(f"   📦 Exemple: {equipment.get('name')} ({equipment.get('status')})")
                
            else:
                results['failed'].append({
                    'endpoint': endpoint,
                    'description': description,
                    'status': response.status_code,
                    'error': response.text[:200]
                })
                print(f"❌ {description}: {response.status_code}")
                
        except Exception as e:
            results['failed'].append({
                'endpoint': endpoint,
                'description': description,
                'error': str(e)
            })
            print(f"💥 {description}: Erreur - {str(e)}")
    
    # 3. Test de création d'une réservation
    print("\n📅 Test de création de réservation...")
    try:
        # Récupérer le premier équipement disponible
        equipment_response = requests.get(f'{BASE_URL}/lab-equipment/equipment/available/', headers=headers)
        if equipment_response.status_code == 200 and equipment_response.json():
            equipment_id = equipment_response.json()[0]['id']
            
            # Créer une réservation
            from datetime import datetime, timedelta
            now = datetime.now()
            start_time = now + timedelta(hours=1)
            end_time = start_time + timedelta(hours=2)
            
            reservation_data = {
                'equipment': equipment_id,
                'start_time': start_time.isoformat(),
                'end_time': end_time.isoformat(),
                'purpose': 'Test de prototypage pour projet étudiant',
                'materials_needed': 'Filament PLA, support',
                'expected_output': 'Prototype de boîtier électronique',
                'priority': 'normal'
            }
            
            reservation_response = requests.post(
                f'{BASE_URL}/lab-equipment/reservations/',
                headers=headers,
                json=reservation_data
            )
            
            if reservation_response.status_code == 201:
                print("✅ Réservation créée avec succès")
                reservation = reservation_response.json()
                print(f"   📅 Réservation #{reservation.get('id')} pour {reservation.get('equipment_name')}")
            else:
                print(f"❌ Échec création réservation: {reservation_response.status_code}")
                print(f"   Erreur: {reservation_response.text[:200]}")
        else:
            print("⚠️  Aucun équipement disponible pour test de réservation")
            
    except Exception as e:
        print(f"💥 Erreur test réservation: {str(e)}")
    
    # 4. Résumé final
    print("\n" + "=" * 50)
    print("📊 RÉSUMÉ DES TESTS")
    print("=" * 50)
    
    total_tests = len(results['success']) + len(results['failed'])
    success_rate = (len(results['success']) / total_tests * 100) if total_tests > 0 else 0
    
    print(f"✅ Tests réussis: {len(results['success'])}/{total_tests}")
    print(f"❌ Tests échoués: {len(results['failed'])}/{total_tests}")
    print(f"📈 Taux de réussite: {success_rate:.1f}%")
    
    if results['success']:
        print(f"\n🎉 ENDPOINTS FONCTIONNELS:")
        for test in results['success']:
            data_info = f" ({test['data_count']} éléments)" if test.get('data_count', 0) > 0 else ""
            print(f"   ✅ {test['description']}{data_info}")
    
    if results['failed']:
        print(f"\n⚠️  ENDPOINTS À CORRIGER:")
        for test in results['failed']:
            print(f"   ❌ {test['description']}: {test.get('status', 'Erreur')}")
    
    # 5. Informations sur les données créées
    print(f"\n📦 DONNÉES DISPONIBLES:")
    try:
        categories_response = requests.get(f'{BASE_URL}/lab-equipment/categories/', headers=headers)
        equipment_response = requests.get(f'{BASE_URL}/lab-equipment/equipment/', headers=headers)
        
        if categories_response.status_code == 200:
            categories = categories_response.json()
            print(f"   📂 {len(categories)} catégories d'équipements")
            
        if equipment_response.status_code == 200:
            equipment_data = equipment_response.json()
            equipment_list = equipment_data.get('results', equipment_data)
            print(f"   🔧 {len(equipment_list)} équipements")
            
            # Statistiques par statut
            status_counts = {}
            for eq in equipment_list:
                status = eq.get('status', 'unknown')
                status_counts[status] = status_counts.get(status, 0) + 1
            
            for status, count in status_counts.items():
                print(f"      - {status}: {count}")
                
    except Exception as e:
        print(f"   ⚠️  Erreur récupération statistiques: {str(e)}")
    
    print(f"\n🌐 Interface Admin: http://localhost:8000/admin/")
    print(f"📚 Documentation API: http://localhost:8000/docs/swagger/")
    
    return len(results['failed']) == 0

if __name__ == '__main__':
    success = test_equipment_api()
    exit(0 if success else 1)
