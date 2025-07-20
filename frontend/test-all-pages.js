/**
 * Script de test pour toutes les pages avec les vraies APIs Django
 * Community Laboratory Burundi
 */

const API_BASE_URL = 'http://localhost:8000/api'

const endpoints = [
  {
    name: 'Courses',
    url: `${API_BASE_URL}/education/courses/`,
    page: 'http://localhost:8080/courses'
  },
  {
    name: 'Projects',
    url: `${API_BASE_URL}/entrepreneurship/projects/`,
    page: 'http://localhost:8080/projects'
  },
  {
    name: 'Equipment',
    url: `${API_BASE_URL}/lab-equipment/equipment/`,
    page: 'http://localhost:8080/lab/equipment'
  },
  {
    name: 'Forum Categories',
    url: `${API_BASE_URL}/forum/categories/`,
    page: 'http://localhost:8080/forum'
  },
  {
    name: 'Organizations',
    url: `${API_BASE_URL}/organizations/`,
    page: 'http://localhost:8080/organizations'
  },
  {
    name: 'Notifications',
    url: `${API_BASE_URL}/notifications/`,
    page: 'http://localhost:8080/notifications'
  },
  {
    name: 'Search',
    url: `${API_BASE_URL}/search/?q=test`,
    page: 'http://localhost:8080/search'
  }
]

async function testAPI(endpoint) {
  const startTime = Date.now()
  
  try {
    const response = await fetch(endpoint.url)
    const duration = Date.now() - startTime
    
    if (response.ok) {
      const data = await response.json()
      return {
        name: endpoint.name,
        status: 'success',
        data: data,
        duration: duration,
        page: endpoint.page
      }
    } else {
      return {
        name: endpoint.name,
        status: 'error',
        error: `HTTP ${response.status}: ${response.statusText}`,
        duration: duration,
        page: endpoint.page
      }
    }
  } catch (error) {
    const duration = Date.now() - startTime
    return {
      name: endpoint.name,
      status: 'error',
      error: error.message,
      duration: duration,
      page: endpoint.page
    }
  }
}

async function testAllAPIs() {
  console.log('🚀 Test de toutes les APIs Django...')
  console.log('=' * 50)
  
  const results = []
  
  for (const endpoint of endpoints) {
    console.log(`🔄 Test de ${endpoint.name}...`)
    const result = await testAPI(endpoint)
    results.push(result)
    
    const status = result.status === 'success' ? '✅' : '❌'
    const duration = `${result.duration}ms`
    
    console.log(`${status} ${result.name} (${duration})`)
    
    if (result.status === 'error') {
      console.log(`   Erreur: ${result.error}`)
    } else if (result.data) {
      const dataInfo = Array.isArray(result.data) 
        ? `${result.data.length} éléments`
        : Array.isArray(result.data.results)
        ? `${result.data.results.length} éléments (paginé)`
        : 'Objet'
      console.log(`   Données: ${dataInfo}`)
    }
    
    console.log(`   Page: ${result.page}`)
    console.log('')
  }
  
  console.log('=' * 50)
  
  const successCount = results.filter(r => r.status === 'success').length
  const errorCount = results.filter(r => r.status === 'error').length
  
  console.log(`✅ Succès: ${successCount}`)
  console.log(`❌ Erreurs: ${errorCount}`)
  console.log(`📊 Total: ${results.length}`)
  
  if (successCount === results.length) {
    console.log('\n🎉 PARFAIT ! Toutes les APIs fonctionnent correctement.')
    console.log('\n📱 Pages à tester dans le navigateur:')
    results.forEach(result => {
      console.log(`  • ${result.name}: ${result.page}`)
    })
  } else {
    console.log('\n⚠️  Certaines APIs ont des problèmes. Vérifiez:')
    console.log('  1. Django est démarré: python manage.py runserver')
    console.log('  2. Les permissions sont configurées (AllowAny)')
    console.log('  3. Les URLs correspondent aux endpoints')
  }
  
  return results
}

// Exécuter le test
testAllAPIs().catch(console.error)
