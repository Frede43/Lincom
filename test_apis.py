import requests
import json
from datetime import datetime

BASE_URL = 'http://localhost:8000/api'

def test_api_endpoints():
    # 1. Obtenir un token d'authentification
    auth_response = requests.post(f'{BASE_URL}/token/', {
        'username': 'admin',
        'password': 'admin123'
    })
    
    if auth_response.status_code != 200:
        print("[FAIL] Échec de l'authentification")
        return
    
    token = auth_response.json()['access']
    headers = {'Authorization': f'Bearer {token}'}
    
    # Liste des endpoints à tester avec leurs paramètres
    endpoints = [
        # Dashboard endpoints
        ('/dashboard/overview/', {}),
        ('/dashboard/widgets/', {}),
        ('/dashboard/stats/', {}),
        ('/dashboard/activities/', {}),
        ('/dashboard/progress/', {}),
        ('/dashboard/notifications/', {}),
        ('/dashboard/quick-actions/', {}),
        ('/dashboard/preferences/', {}),
        
        # Education endpoints
        ('/education/courses/', {}),
        ('/education/lessons/', {}),
        
        # Forum endpoints
        ('/forum/topics/', {}),
        ('/forum/posts/', {}),
        
        # Organizations endpoints
        ('/organizations/companies/', {}),
        ('/organizations/competitions/', {}),
        
        # Search endpoints
        ('/search/query/', {'q': 'test'}),  # Ajout du paramètre de recherche
        ('/search/filters/', {'category': 'education'}),  # Ajout du paramètre category
    ]
    
    results = {
        'success': [],
        'failed': []
    }
    
    # Tester chaque endpoint
    for endpoint, params in endpoints:
        try:
            response = requests.get(f'{BASE_URL}{endpoint}', headers=headers, params=params)
            
            if response.status_code in [200, 201]:
                results['success'].append({
                    'endpoint': endpoint,
                    'status': response.status_code
                })
                print(f"[OK] {endpoint} ({response.status_code})")
            else:
                results['failed'].append({
                    'endpoint': endpoint,
                    'status': response.status_code,
                    'error': response.text
                })
                print(f"[FAIL] {endpoint} ({response.status_code})")
        except Exception as e:
            results['failed'].append({
                'endpoint': endpoint,
                'error': str(e)
            })
            print(f"[ERROR] {endpoint} - {str(e)}")
    
    # Sauvegarder les résultats
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    with open(f'api_test_results_{timestamp}.json', 'w') as f:
        json.dump(results, f, indent=2)
    
    # Afficher le résumé
    print("\nRésumé des tests:")
    print(f"[OK] Succès: {len(results['success'])}")
    print(f"[FAIL] Échecs: {len(results['failed'])}")
    
    if results['failed']:
        print("\nDétails des échecs:")
        for failure in results['failed']:
            print(f"- {failure['endpoint']}: {failure.get('error', 'Unknown error')}")

if __name__ == '__main__':
    test_api_endpoints()
