/**
 * Test simple des APIs Django
 * Community Laboratory Burundi
 */

const API_BASE_URL = 'http://localhost:8000/api'

const apis = [
  { name: '📚 Courses', url: `${API_BASE_URL}/education/courses/` },
  { name: '🚀 Projects', url: `${API_BASE_URL}/entrepreneurship/projects/` },
  { name: '🔧 Equipment', url: `${API_BASE_URL}/lab-equipment/equipment/` },
  { name: '💬 Forum', url: `${API_BASE_URL}/forum/categories/` },
  { name: '🏢 Organizations', url: `${API_BASE_URL}/organizations/` },
  { name: '🔔 Notifications', url: `${API_BASE_URL}/notifications/` },
  { name: '🔍 Search', url: `${API_BASE_URL}/search/?q=test` }
]

async function testAPI(api) {
  try {
    console.log(`🔄 Test ${api.name}...`)
    const response = await fetch(api.url)
    
    if (response.ok) {
      const data = await response.json()
      const count = Array.isArray(data) ? data.length : 
                   Array.isArray(data.results) ? data.results.length : 'N/A'
      console.log(`✅ ${api.name}: ${count} éléments`)
      return true
    } else {
      console.log(`❌ ${api.name}: HTTP ${response.status}`)
      return false
    }
  } catch (error) {
    console.log(`❌ ${api.name}: ${error.message}`)
    return false
  }
}

async function testAll() {
  console.log('🚀 TEST DES APIs DJANGO')
  console.log('=' * 40)
  
  let success = 0
  let total = apis.length
  
  for (const api of apis) {
    const result = await testAPI(api)
    if (result) success++
  }
  
  console.log('=' * 40)
  console.log(`📊 Résultat: ${success}/${total} APIs fonctionnelles`)
  
  if (success === total) {
    console.log('🎉 PARFAIT ! Toutes les APIs fonctionnent.')
    console.log('')
    console.log('🎯 Maintenant testez les pages:')
    console.log('• http://localhost:8080/courses')
    console.log('• http://localhost:8080/projects')
    console.log('• http://localhost:8080/lab/equipment')
    console.log('• http://localhost:8080/forum')
    console.log('• http://localhost:8080/organizations')
    console.log('• http://localhost:8080/notifications')
    console.log('• http://localhost:8080/search')
    console.log('• http://localhost:8080/api-test')
  } else {
    console.log('⚠️  Problèmes détectés:')
    console.log('1. Assurez-vous que Django tourne: python manage.py runserver')
    console.log('2. Vérifiez les permissions Django (AllowAny)')
    console.log('3. Vérifiez les URLs Django')
  }
}

testAll().catch(console.error)
