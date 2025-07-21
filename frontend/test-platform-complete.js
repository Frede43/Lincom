/**
 * Test complet de la plateforme Community Laboratory Burundi
 * Vérifie les APIs Django et les pages React
 */

const API_BASE_URL = 'http://localhost:8000/api'
const FRONTEND_BASE_URL = 'http://localhost:8080'

const tests = [
  {
    name: '📚 Courses (Cours)',
    api: `${API_BASE_URL}/education/courses/`,
    page: `${FRONTEND_BASE_URL}/courses`,
    description: 'Plateforme d\'apprentissage avec cours interactifs',
    status: 'unknown'
  },
  {
    name: '🚀 Projects (Projets)',
    api: `${API_BASE_URL}/entrepreneurship/projects/`,
    page: `${FRONTEND_BASE_URL}/projects`,
    description: 'Projets entrepreneuriaux et startups',
    status: 'unknown'
  },
  {
    name: '🔧 Equipment (Équipements)',
    api: `${API_BASE_URL}/lab-equipment/equipment/`,
    page: `${FRONTEND_BASE_URL}/lab/equipment`,
    description: 'Catalogue des équipements Fab Lab',
    status: 'unknown'
  },
  {
    name: '💬 Forum',
    api: `${API_BASE_URL}/forum/categories/`,
    page: `${FRONTEND_BASE_URL}/forum`,
    description: 'Forum communautaire et discussions',
    status: 'unknown'
  },
  {
    name: '🏢 Organizations (Organisations)',
    api: `${API_BASE_URL}/organizations/`,
    page: `${FRONTEND_BASE_URL}/organizations`,
    description: 'Organisations partenaires',
    status: 'unknown'
  },
  {
    name: '🔔 Notifications',
    api: `${API_BASE_URL}/notifications/`,
    page: `${FRONTEND_BASE_URL}/notifications`,
    description: 'Système de notifications',
    status: 'unknown'
  },
  {
    name: '🔍 Search (Recherche)',
    api: `${API_BASE_URL}/search/?q=test`,
    page: `${FRONTEND_BASE_URL}/search`,
    description: 'Recherche globale',
    status: 'unknown'
  },
  {
    name: '🧪 API Test',
    api: null,
    page: `${FRONTEND_BASE_URL}/api-test`,
    description: 'Page de diagnostic des APIs',
    status: 'unknown'
  }
]

async function testAPI(url) {
  if (!url) return { status: 'skipped', message: 'Pas d\'API à tester', data: null }
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    })
    
    if (response.ok) {
      const data = await response.json()
      const count = Array.isArray(data) 
        ? data.length 
        : Array.isArray(data.results) 
        ? data.results.length 
        : data.count || 'N/A'
      
      return { 
        status: 'success', 
        message: `${count} éléments`,
        data: data
      }
    } else {
      return { 
        status: 'error', 
        message: `HTTP ${response.status}: ${response.statusText}`,
        data: null
      }
    }
  } catch (error) {
    return { 
      status: 'error', 
      message: `Erreur réseau: ${error.message}`,
      data: null
    }
  }
}

async function testPage(url) {
  try {
    const response = await fetch(url, {
      method: 'HEAD', // Juste pour vérifier si la page existe
    })
    
    if (response.ok) {
      return { status: 'success', message: 'Page accessible' }
    } else {
      return { status: 'error', message: `HTTP ${response.status}` }
    }
  } catch (error) {
    return { status: 'error', message: `Erreur: ${error.message}` }
  }
}

function getStatusIcon(status) {
  switch (status) {
    case 'success': return '✅'
    case 'error': return '❌'
    case 'skipped': return '⏭️'
    default: return '❓'
  }
}

async function runCompleteTest() {
  console.log('🚀 TEST COMPLET - COMMUNITY LABORATORY BURUNDI')
  console.log('=' * 60)
  console.log('')
  console.log('🇧🇮 Plateforme d\'innovation technologique du Burundi')
  console.log('   Connectant étudiants, entrepreneurs et innovateurs')
  console.log('')
  console.log('=' * 60)
  
  let apiSuccess = 0
  let apiError = 0
  let pageSuccess = 0
  let pageError = 0
  
  for (const test of tests) {
    console.log(`🔄 Test: ${test.name}`)
    console.log(`   ${test.description}`)
    
    // Test de l'API
    if (test.api) {
      const apiResult = await testAPI(test.api)
      const apiIcon = getStatusIcon(apiResult.status)
      console.log(`   API: ${apiIcon} ${apiResult.message}`)
      
      if (apiResult.status === 'success') {
        apiSuccess++
        
        // Afficher quelques détails sur les données
        if (apiResult.data) {
          if (Array.isArray(apiResult.data) && apiResult.data.length > 0) {
            const sample = apiResult.data[0]
            const keys = Object.keys(sample).slice(0, 3).join(', ')
            console.log(`        Champs: ${keys}...`)
          } else if (apiResult.data.results && apiResult.data.results.length > 0) {
            const sample = apiResult.data.results[0]
            const keys = Object.keys(sample).slice(0, 3).join(', ')
            console.log(`        Champs: ${keys}...`)
          }
        }
      } else if (apiResult.status === 'error') {
        apiError++
      }
    } else {
      console.log(`   API: ⏭️ Pas d'API à tester`)
    }
    
    // Test de la page
    const pageResult = await testPage(test.page)
    const pageIcon = getStatusIcon(pageResult.status)
    console.log(`   Page: ${pageIcon} ${pageResult.message}`)
    console.log(`   URL: ${test.page}`)
    
    if (pageResult.status === 'success') {
      pageSuccess++
    } else {
      pageError++
    }
    
    console.log('')
  }
  
  console.log('=' * 60)
  console.log('📊 RÉSULTATS FINAUX:')
  console.log('')
  console.log('🔌 APIs Django:')
  console.log(`   ✅ Fonctionnelles: ${apiSuccess}`)
  console.log(`   ❌ En erreur: ${apiError}`)
  console.log(`   📊 Taux de réussite: ${apiSuccess > 0 ? Math.round((apiSuccess / (apiSuccess + apiError)) * 100) : 0}%`)
  console.log('')
  console.log('🌐 Pages React:')
  console.log(`   ✅ Accessibles: ${pageSuccess}`)
  console.log(`   ❌ En erreur: ${pageError}`)
  console.log(`   📊 Taux de réussite: ${Math.round((pageSuccess / tests.length) * 100)}%`)
  console.log('')
  
  const totalSuccess = apiSuccess + pageSuccess
  const totalTests = (apiSuccess + apiError) + tests.length
  const overallSuccess = Math.round((totalSuccess / totalTests) * 100)
  
  console.log(`🎯 SCORE GLOBAL: ${overallSuccess}%`)
  console.log('')
  
  if (overallSuccess >= 80) {
    console.log('🎉 EXCELLENT ! La plateforme est opérationnelle.')
    console.log('')
    console.log('🚀 PROCHAINES ÉTAPES:')
    console.log('1. Créer des données de test réalistes')
    console.log('2. Tester les fonctionnalités interactives')
    console.log('3. Optimiser les performances')
    console.log('4. Déployer en production')
  } else if (overallSuccess >= 60) {
    console.log('⚠️  BON DÉBUT ! Quelques corrections nécessaires.')
    console.log('')
    console.log('🔧 ACTIONS REQUISES:')
    console.log('1. Corriger les APIs en erreur')
    console.log('2. Vérifier les pages inaccessibles')
    console.log('3. Tester la connectivité Django ↔ React')
  } else {
    console.log('🚨 ATTENTION ! Problèmes majeurs détectés.')
    console.log('')
    console.log('🆘 ACTIONS URGENTES:')
    console.log('1. Vérifier que Django tourne: python manage.py runserver')
    console.log('2. Vérifier que React tourne: npm run dev')
    console.log('3. Corriger les erreurs de syntaxe')
    console.log('4. Vérifier les permissions Django (AllowAny)')
  }
  
  console.log('')
  console.log('=' * 60)
  console.log('🇧🇮 Community Laboratory Burundi')
  console.log('   "Innovons ensemble pour un Burundi numérique"')
  console.log('=' * 60)
}

// Exécuter le test complet
runCompleteTest().catch(error => {
  console.error('❌ Erreur lors du test:', error)
  console.log('')
  console.log('🔧 Vérifiez que:')
  console.log('1. Django tourne sur http://localhost:8000')
  console.log('2. React tourne sur http://localhost:8080')
  console.log('3. Votre connexion internet fonctionne')
})
