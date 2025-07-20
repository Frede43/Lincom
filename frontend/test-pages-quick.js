/**
 * Script de test rapide pour toutes les pages
 * Community Laboratory Burundi
 */

const pages = [
  {
    name: 'Courses',
    url: 'http://localhost:8080/courses',
    api: 'http://localhost:8000/api/education/courses/'
  },
  {
    name: 'Projects',
    url: 'http://localhost:8080/projects',
    api: 'http://localhost:8000/api/entrepreneurship/projects/'
  },
  {
    name: 'Equipment',
    url: 'http://localhost:8080/lab/equipment',
    api: 'http://localhost:8000/api/lab-equipment/equipment/'
  },
  {
    name: 'Forum',
    url: 'http://localhost:8080/forum',
    api: 'http://localhost:8000/api/forum/categories/'
  },
  {
    name: 'Organizations',
    url: 'http://localhost:8080/organizations',
    api: 'http://localhost:8000/api/organizations/'
  },
  {
    name: 'Notifications',
    url: 'http://localhost:8080/notifications',
    api: 'http://localhost:8000/api/notifications/'
  },
  {
    name: 'Search',
    url: 'http://localhost:8080/search',
    api: 'http://localhost:8000/api/search/?q=test'
  }
]

async function testAPI(api) {
  try {
    const response = await fetch(api)
    if (response.ok) {
      const data = await response.json()
      return { status: 'success', data }
    } else {
      return { status: 'error', error: `HTTP ${response.status}` }
    }
  } catch (error) {
    return { status: 'error', error: error.message }
  }
}

async function testAllPages() {
  console.log('🚀 Test rapide de toutes les pages...')
  console.log('=' * 50)
  
  for (const page of pages) {
    console.log(`🔄 Test de ${page.name}...`)
    
    const result = await testAPI(page.api)
    const status = result.status === 'success' ? '✅' : '❌'
    
    console.log(`${status} ${page.name}`)
    console.log(`   API: ${page.api}`)
    console.log(`   Page: ${page.url}`)
    
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
    
    console.log('')
  }
  
  console.log('=' * 50)
  console.log('🎯 Instructions:')
  console.log('1. Assurez-vous que Django tourne: python manage.py runserver')
  console.log('2. Testez chaque page dans le navigateur')
  console.log('3. Vérifiez que les données s\'affichent correctement')
  console.log('4. Si erreurs, vérifiez les permissions Django (AllowAny)')
}

// Exécuter le test
testAllPages().catch(console.error)
