/**
 * Test rapide pour détecter les erreurs sur toutes les pages
 */

const pages = [
  { name: 'Home', url: 'http://localhost:8080/' },
  { name: 'Courses', url: 'http://localhost:8080/courses' },
  { name: 'Projects', url: 'http://localhost:8080/projects' },
  { name: 'Equipment', url: 'http://localhost:8080/lab/equipment' },
  { name: 'Forum', url: 'http://localhost:8080/forum' },
  { name: 'Organizations', url: 'http://localhost:8080/organizations' },
  { name: 'Notifications', url: 'http://localhost:8080/notifications' },
  { name: 'Search', url: 'http://localhost:8080/search' },
  { name: 'API Test', url: 'http://localhost:8080/api-test' }
]

async function testPage(page) {
  try {
    console.log(`🔍 Test: ${page.name}`)
    
    const response = await fetch(page.url)
    if (response.ok) {
      const html = await response.text()
      
      // Vérifier si la page contient des erreurs JavaScript visibles
      if (html.includes('Error') || html.includes('undefined') || html.includes('Cannot read properties')) {
        console.log(`   ⚠️  Erreurs potentielles détectées`)
      } else {
        console.log(`   ✅ Page OK`)
      }
    } else {
      console.log(`   ❌ HTTP ${response.status}`)
    }
  } catch (error) {
    console.log(`   ❌ Erreur: ${error.message}`)
  }
}

async function runTests() {
  console.log('🚀 TEST DES PAGES FRONTEND')
  console.log('=' * 30)
  
  for (const page of pages) {
    await testPage(page)
    await new Promise(resolve => setTimeout(resolve, 500)) // Pause entre les tests
  }
  
  console.log('=' * 30)
  console.log('✅ Tests terminés')
}

runTests().catch(console.error)
