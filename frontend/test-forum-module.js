/**
 * Test complet du module Forum pour vérifier qu'il est totalement dynamique
 */

const API_BASE_URL = 'http://localhost:8000/api/forum'

// Tests des APIs
const apiTests = [
  { name: 'Categories', url: `${API_BASE_URL}/categories/` },
  { name: 'Topics', url: `${API_BASE_URL}/topics/` }
]

// Tests des pages frontend
const pageTests = [
  { name: 'Forum principal', url: 'http://localhost:8080/forum' }
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

async function testForumDetail() {
  try {
    console.log('\n🔍 Test détaillé du Forum:')
    
    // Test des catégories
    const categoriesResponse = await fetch(`${API_BASE_URL}/categories/`)
    if (categoriesResponse.ok) {
      const categories = await categoriesResponse.json()
      console.log(`   ✅ ${categories.length} catégories trouvées`)
      
      if (categories.length > 0) {
        const category = categories[0]
        console.log(`   📝 Première catégorie: ${category.name}`)
        console.log(`   📊 Type: ${category.category_type}`)
        console.log(`   🎨 Couleur: ${category.color}`)
        console.log(`   📋 Nombre de topics: ${category.topic_count}`)
        console.log(`   💬 Nombre de posts: ${category.post_count}`)
      }
    } else {
      console.log(`   ❌ Catégories: HTTP ${categoriesResponse.status}`)
    }
    
    // Test des topics
    const topicsResponse = await fetch(`${API_BASE_URL}/topics/`)
    if (topicsResponse.ok) {
      const topics = await topicsResponse.json()
      const topicsList = Array.isArray(topics) ? topics : topics.results || []
      console.log(`   ✅ ${topicsList.length} topics trouvés`)
      
      if (topicsList.length > 0) {
        const topic = topicsList[0]
        console.log(`   📝 Premier topic: ${topic.title}`)
        console.log(`   👤 Auteur: ${topic.author}`)
        console.log(`   📊 Statut: ${topic.status}`)
        console.log(`   💬 Réponses: ${topic.reply_count}`)
        console.log(`   👁️  Vues: ${topic.view_count}`)
      }
    } else {
      console.log(`   ❌ Topics: HTTP ${topicsResponse.status}`)
    }
    
    return true
  } catch (error) {
    console.log(`   ❌ Erreur: ${error.message}`)
    return false
  }
}

async function runCompleteTest() {
  console.log('🚀 TEST COMPLET DU MODULE FORUM')
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
  
  // Test détaillé
  const forumDetailSuccess = await testForumDetail()
  
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
  console.log(`   🔍 Test forum détaillé: ${forumDetailSuccess ? 'Réussi' : 'Échoué'}`)
  
  const totalSuccess = apiSuccess + pageSuccess + (forumDetailSuccess ? 1 : 0)
  const totalTests = apiTests.length + pageTests.length + 1
  const globalScore = Math.round((totalSuccess / totalTests) * 100)
  
  console.log(`\n🎯 SCORE GLOBAL: ${totalSuccess}/${totalTests} (${globalScore}%)`)
  
  if (globalScore === 100) {
    console.log('🎉 PARFAIT ! Le module Forum est totalement dynamique !')
    console.log('✅ Prêt à passer au module suivant')
  } else if (globalScore >= 80) {
    console.log('👍 Très bien ! Le module Forum est largement dynamique')
    console.log('⚠️  Quelques améliorations mineures possibles')
  } else {
    console.log('⚠️  Le module Forum nécessite encore des corrections')
  }
  
  console.log('=' * 50)
}

// Attendre un peu pour éviter le rate limiting
setTimeout(() => {
  runCompleteTest().catch(console.error)
}, 2000)
