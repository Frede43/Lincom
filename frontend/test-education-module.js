/**
 * Test complet du module Education pour vérifier qu'il est totalement dynamique
 */

const API_BASE_URL = 'http://localhost:8000/api/education'

// Tests des APIs
const apiTests = [
  { name: 'Courses', url: `${API_BASE_URL}/courses/` },
  { name: 'Modules', url: `${API_BASE_URL}/modules/` },
  { name: 'Lessons', url: `${API_BASE_URL}/lessons/` },
  { name: 'Quizzes', url: `${API_BASE_URL}/quizzes/` },
  { name: 'Media', url: `${API_BASE_URL}/media/` },
  { name: 'Collections', url: `${API_BASE_URL}/collections/` }
]

// Tests des pages frontend
const pageTests = [
  { name: 'Liste des cours', url: 'http://localhost:8080/courses' },
  { name: 'Détail cours 1', url: 'http://localhost:8080/courses/1' },
  { name: 'Détail cours 2', url: 'http://localhost:8080/courses/2' },
  { name: 'Apprentissage cours 1', url: 'http://localhost:8080/courses/1/learn' }
]

async function testAPI(api) {
  try {
    const response = await fetch(api.url)
    if (response.ok) {
      const data = await response.json()
      const count = Array.isArray(data) ? data.length : 
                   Array.isArray(data.results) ? data.results.length : 'N/A'
      return { success: true, count, data: Array.isArray(data) ? data[0] : data.results?.[0] }
    } else {
      return { success: false, error: `HTTP ${response.status}` }
    }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

async function testPage(page) {
  try {
    const response = await fetch(page.url)
    if (response.ok) {
      return { success: true, status: response.status }
    } else {
      return { success: false, error: `HTTP ${response.status}` }
    }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

async function testCourseDetail() {
  try {
    console.log('\n🔍 Test détaillé d\'un cours:')
    const response = await fetch(`${API_BASE_URL}/courses/1/`)
    if (response.ok) {
      const course = await response.json()
      console.log(`   ✅ Cours: ${course.title}`)
      console.log(`   📖 Modules: ${course.modules?.length || course.total_modules || 0}`)
      console.log(`   👥 Étudiants: ${course.total_students || 0}`)
      console.log(`   ⏱️  Durée: ${course.duration_weeks} semaines`)
      console.log(`   📚 Niveau: ${course.level}`)
      
      // Test des modules du cours
      const modulesResponse = await fetch(`${API_BASE_URL}/modules/?course=1`)
      if (modulesResponse.ok) {
        const modules = await modulesResponse.json()
        console.log(`   📋 Modules trouvés: ${modules.length}`)
        
        if (modules.length > 0) {
          const module = modules[0]
          console.log(`   📝 Premier module: ${module.title}`)
          console.log(`   ⏰ Durée module: ${module.duration_hours}h`)
          
          // Test des leçons du module
          const lessonsResponse = await fetch(`${API_BASE_URL}/lessons/?module=${module.id}`)
          if (lessonsResponse.ok) {
            const lessons = await lessonsResponse.json()
            console.log(`   📖 Leçons trouvées: ${lessons.length}`)
            if (lessons.length > 0) {
              console.log(`   📝 Première leçon: ${lessons[0].title}`)
            }
          }
        }
      }
      return true
    }
    return false
  } catch (error) {
    console.log(`   ❌ Erreur: ${error.message}`)
    return false
  }
}

async function runCompleteTest() {
  console.log('🚀 TEST COMPLET DU MODULE EDUCATION')
  console.log('=' * 50)
  
  // Test des APIs
  console.log('\n📡 Test des APIs Backend:')
  let apiSuccess = 0
  for (const api of apiTests) {
    const result = await testAPI(api)
    const icon = result.success ? '✅' : '❌'
    const info = result.success ? `${result.count} éléments` : result.error
    console.log(`   ${icon} ${api.name}: ${info}`)
    if (result.success) apiSuccess++
  }
  
  // Test détaillé d'un cours
  const courseDetailSuccess = await testCourseDetail()
  
  // Test des pages frontend
  console.log('\n🌐 Test des pages Frontend:')
  let pageSuccess = 0
  for (const page of pageTests) {
    const result = await testPage(page)
    const icon = result.success ? '✅' : '❌'
    const info = result.success ? 'Accessible' : result.error
    console.log(`   ${icon} ${page.name}: ${info}`)
    if (result.success) pageSuccess++
  }
  
  // Résumé final
  console.log('\n' + '=' * 50)
  console.log('📊 RÉSULTATS FINAUX:')
  console.log(`   📡 APIs Backend: ${apiSuccess}/${apiTests.length} (${Math.round(apiSuccess/apiTests.length*100)}%)`)
  console.log(`   🌐 Pages Frontend: ${pageSuccess}/${pageTests.length} (${Math.round(pageSuccess/pageTests.length*100)}%)`)
  console.log(`   🔍 Test détaillé: ${courseDetailSuccess ? 'Réussi' : 'Échoué'}`)
  
  const totalSuccess = apiSuccess + pageSuccess + (courseDetailSuccess ? 1 : 0)
  const totalTests = apiTests.length + pageTests.length + 1
  const globalScore = Math.round((totalSuccess / totalTests) * 100)
  
  console.log(`\n🎯 SCORE GLOBAL: ${totalSuccess}/${totalTests} (${globalScore}%)`)
  
  if (globalScore === 100) {
    console.log('🎉 PARFAIT ! Le module Education est totalement dynamique !')
    console.log('✅ Prêt à passer au module suivant')
  } else if (globalScore >= 80) {
    console.log('👍 Très bien ! Le module Education est largement dynamique')
    console.log('⚠️  Quelques améliorations mineures possibles')
  } else {
    console.log('⚠️  Le module Education nécessite encore des corrections')
  }
  
  console.log('=' * 50)
}

runCompleteTest().catch(console.error)
