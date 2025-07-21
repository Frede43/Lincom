/**
 * Script pour analyser toutes les APIs du module Forum
 */

const API_BASE_URL = 'http://localhost:8000/api/forum'

const endpoints = [
  { name: 'Categories', url: `${API_BASE_URL}/categories/` },
  { name: 'Topics', url: `${API_BASE_URL}/topics/` },
  { name: 'Posts', url: `${API_BASE_URL}/posts/` },
  { name: 'Tags', url: `${API_BASE_URL}/tags/` }
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
      if (endpoint.name === 'Categories') {
        console.log(`   📝 Première catégorie: ${items[0].name}`)
        console.log(`   📊 Type: ${items[0].category_type}`)
        console.log(`   📋 Nombre de topics: ${items[0].topic_count}`)
      } else if (endpoint.name === 'Topics') {
        console.log(`   📝 Premier topic: ${items[0].title}`)
        console.log(`   👤 Auteur: ${items[0].author}`)
        console.log(`   📊 Statut: ${items[0].status}`)
        console.log(`   💬 Réponses: ${items[0].reply_count}`)
      }
    }
    
  } catch (error) {
    console.log(`   ❌ Erreur: ${error.message}`)
  }
}

async function testTopicDetail() {
  try {
    console.log(`\n🔍 Test Topic Detail (ID: 1):`)
    const response = await fetch(`${API_BASE_URL}/topics/1/`)
    if (response.ok) {
      const topic = await response.json()
      console.log(`   ✅ Topic trouvé: ${topic.title}`)
      console.log(`   🔑 Champs détaillés: ${Object.keys(topic).join(', ')}`)
      console.log(`   📊 Catégorie: ${topic.category}`)
      console.log(`   👤 Auteur: ${topic.author}`)
      console.log(`   💬 Réponses: ${topic.reply_count}`)
      console.log(`   👁️  Vues: ${topic.view_count}`)
    } else {
      console.log(`   ❌ HTTP ${response.status}`)
    }
  } catch (error) {
    console.log(`   ❌ Erreur: ${error.message}`)
  }
}

async function runAnalysis() {
  console.log('🚀 ANALYSE COMPLÈTE DU MODULE FORUM')
  console.log('=' * 50)
  
  for (const endpoint of endpoints) {
    await debugEndpoint(endpoint)
  }
  
  await testTopicDetail()
  
  console.log('\n' + '=' * 50)
  console.log('✅ Analyse terminée')
}

runAnalysis().catch(console.error)
