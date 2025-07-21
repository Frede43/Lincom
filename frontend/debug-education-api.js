/**
 * Script pour analyser toutes les APIs du module Education
 */

const API_BASE_URL = 'http://localhost:8000/api/education'

const endpoints = [
  { name: 'Courses', url: `${API_BASE_URL}/courses/` },
  { name: 'Modules', url: `${API_BASE_URL}/modules/` },
  { name: 'Lessons', url: `${API_BASE_URL}/lessons/` },
  { name: 'Quizzes', url: `${API_BASE_URL}/quizzes/` },
  { name: 'Media', url: `${API_BASE_URL}/media/` },
  { name: 'Collections', url: `${API_BASE_URL}/collections/` }
]

async function debugEndpoint(endpoint) {
  try {
    console.log(`\n🔍 ${endpoint.name}:`)
    console.log(`   URL: ${endpoint.url}`)
    
    const response = await fetch(endpoint.url)
    if (!response.ok) {
      console.log(`   ❌ HTTP ${response.status}`)
      return
    }
    
    const data = await response.json()
    const items = Array.isArray(data) ? data : data.results || []
    
    console.log(`   ✅ ${items.length} éléments`)
    
    if (items.length > 0) {
      console.log(`   🔑 Champs: ${Object.keys(items[0]).join(', ')}`)
      
      // Afficher le premier élément pour comprendre la structure
      if (endpoint.name === 'Courses') {
        console.log(`   📝 Premier cours:`)
        console.log(`      ID: ${items[0].id}`)
        console.log(`      Titre: ${items[0].title}`)
        console.log(`      Niveau: ${items[0].level}`)
        console.log(`      Durée: ${items[0].duration_weeks} semaines`)
      }
    }
    
  } catch (error) {
    console.log(`   ❌ Erreur: ${error.message}`)
  }
}

async function testCourseDetail() {
  try {
    console.log(`\n🔍 Test Course Detail (ID: 1):`)
    const response = await fetch(`${API_BASE_URL}/courses/1/`)
    if (response.ok) {
      const course = await response.json()
      console.log(`   ✅ Cours trouvé: ${course.title}`)
      console.log(`   🔑 Champs détaillés: ${Object.keys(course).join(', ')}`)
    } else {
      console.log(`   ❌ HTTP ${response.status}`)
    }
  } catch (error) {
    console.log(`   ❌ Erreur: ${error.message}`)
  }
}

async function runAnalysis() {
  console.log('🚀 ANALYSE COMPLÈTE DU MODULE EDUCATION')
  console.log('=' * 50)
  
  for (const endpoint of endpoints) {
    await debugEndpoint(endpoint)
  }
  
  await testCourseDetail()
  
  console.log('\n' + '=' * 50)
  console.log('✅ Analyse terminée')
}

runAnalysis().catch(console.error)
