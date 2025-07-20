/**
 * Test final de toutes les pages avec les vraies APIs Django
 * Community Laboratory Burundi
 */

const API_BASE_URL = 'http://localhost:8000/api'
const FRONTEND_BASE_URL = 'http://localhost:8080'

const tests = [
  {
    name: '📚 Courses',
    api: `${API_BASE_URL}/education/courses/`,
    page: `${FRONTEND_BASE_URL}/courses`,
    description: 'Page des cours avec API Django'
  },
  {
    name: '🚀 Projects',
    api: `${API_BASE_URL}/entrepreneurship/projects/`,
    page: `${FRONTEND_BASE_URL}/projects`,
    description: 'Page des projets entrepreneuriaux'
  },
  {
    name: '🔧 Equipment',
    api: `${API_BASE_URL}/lab-equipment/equipment/`,
    page: `${FRONTEND_BASE_URL}/lab/equipment`,
    description: 'Catalogue des équipements Fab Lab'
  },
  {
    name: '💬 Forum',
    api: `${API_BASE_URL}/forum/categories/`,
    page: `${FRONTEND_BASE_URL}/forum`,
    description: 'Forum communautaire'
  },
  {
    name: '🏢 Organizations',
    api: `${API_BASE_URL}/organizations/`,
    page: `${FRONTEND_BASE_URL}/organizations`,
    description: 'Organisations partenaires'
  },
  {
    name: '🔔 Notifications',
    api: `${API_BASE_URL}/notifications/`,
    page: `${FRONTEND_BASE_URL}/notifications`,
    description: 'Système de notifications'
  },
  {
    name: '🔍 Search',
    api: `${API_BASE_URL}/search/?q=test`,
    page: `${FRONTEND_BASE_URL}/search`,
    description: 'Recherche globale'
  },
  {
    name: '🧪 API Test',
    api: null,
    page: `${FRONTEND_BASE_URL}/api-test`,
    description: 'Page de diagnostic des APIs'
  }
]

async function testAPI(url) {
  if (!url) return { status: 'skipped', message: 'Pas d\'API à tester' }
  
  try {
    const response = await fetch(url)
    if (response.ok) {
      const data = await response.json()
      const count = Array.isArray(data) 
        ? data.length 
        : Array.isArray(data.results) 
        ? data.results.length 
        : 'N/A'
      return { 
        status: 'success', 
        message: `${count} éléments`,
        data 
      }
    } else {
      return { 
        status: 'error', 
        message: `HTTP ${response.status}: ${response.statusText}` 
      }
    }
  } catch (error) {
    return { 
      status: 'error', 
      message: error.message 
    }
  }
}

async function runTests() {
  console.log('🚀 TEST FINAL - INTÉGRATION FRONTEND ↔ BACKEND')
  console.log('=' * 60)
  console.log('')
  
  let successCount = 0
  let errorCount = 0
  
  for (const test of tests) {
    console.log(`🔄 Test: ${test.name}`)
    console.log(`   ${test.description}`)
    
    if (test.api) {
      const result = await testAPI(test.api)
      const statusIcon = result.status === 'success' ? '✅' : 
                        result.status === 'error' ? '❌' : '⏭️'
      
      console.log(`   API: ${statusIcon} ${result.message}`)
      
      if (result.status === 'success') {
        successCount++
      } else if (result.status === 'error') {
        errorCount++
      }
    } else {
      console.log(`   API: ⏭️ Pas d'API à tester`)
    }
    
    console.log(`   Page: ${test.page}`)
    console.log('')
  }
  
  console.log('=' * 60)
  console.log('📊 RÉSULTATS:')
  console.log(`   ✅ APIs fonctionnelles: ${successCount}`)
  console.log(`   ❌ APIs en erreur: ${errorCount}`)
  console.log(`   📱 Pages à tester: ${tests.length}`)
  console.log('')
  
  if (errorCount === 0) {
    console.log('🎉 PARFAIT ! Toutes les APIs fonctionnent.')
    console.log('')
    console.log('🎯 PROCHAINES ÉTAPES:')
    console.log('1. Testez chaque page dans le navigateur')
    console.log('2. Vérifiez que les données s\'affichent correctement')
    console.log('3. Testez les fonctionnalités (recherche, filtres, etc.)')
    console.log('4. Créez des données de test si nécessaire')
    console.log('')
    console.log('📋 PAGES À TESTER:')
    tests.forEach(test => {
      console.log(`   • ${test.name}: ${test.page}`)
    })
  } else {
    console.log('⚠️  PROBLÈMES DÉTECTÉS:')
    console.log('1. Assurez-vous que Django tourne: python manage.py runserver')
    console.log('2. Vérifiez les permissions Django (AllowAny)')
    console.log('3. Vérifiez les URLs Django')
    console.log('4. Consultez les logs Django pour plus de détails')
  }
  
  console.log('')
  console.log('🇧🇮 Community Laboratory Burundi - Prêt pour l\'innovation !')
}

// Exécuter les tests
runTests().catch(console.error)
