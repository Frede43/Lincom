/**
 * Test complet du module Lab Equipment pour vérifier qu'il est totalement dynamique
 */

const API_BASE_URL = 'http://localhost:8000/api/lab-equipment'

// Tests des APIs
const apiTests = [
  { name: 'Equipment', url: `${API_BASE_URL}/equipment/` },
  { name: 'Categories', url: `${API_BASE_URL}/categories/` }
]

// Tests des pages frontend
const pageTests = [
  { name: 'Liste des équipements', url: 'http://localhost:8080/equipment' },
  { name: 'Détail équipement 1', url: 'http://localhost:8080/equipment/1' },
  { name: 'Détail équipement 2', url: 'http://localhost:8080/equipment/2' }
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

async function testEquipmentDetail() {
  try {
    console.log('\n🔍 Test détaillé d\'un équipement:')
    const response = await fetch(`${API_BASE_URL}/equipment/1/`)
    if (response.ok) {
      const equipment = await response.json()
      console.log(`   ✅ Équipement: ${equipment.name}`)
      console.log(`   🏭 Marque: ${equipment.brand}`)
      console.log(`   📦 Modèle: ${equipment.model}`)
      console.log(`   📊 Statut: ${equipment.status}`)
      console.log(`   🔧 Condition: ${equipment.condition}`)
      console.log(`   📍 Localisation: ${equipment.location}`)
      console.log(`   ⏰ Heures d'utilisation: ${equipment.total_usage_hours}h`)
      console.log(`   📋 Réservations totales: ${equipment.total_reservations}`)
      console.log(`   🆔 Catégorie: ${equipment.category}`)
      return true
    }
    return false
  } catch (error) {
    console.log(`   ❌ Erreur: ${error.message}`)
    return false
  }
}

async function testCategoriesDetail() {
  try {
    console.log('\n🔍 Test détaillé des catégories:')
    const response = await fetch(`${API_BASE_URL}/categories/`)
    if (response.ok) {
      const categories = await response.json()
      console.log(`   ✅ ${categories.length} catégories trouvées`)
      
      if (categories.length > 0) {
        const category = categories[0]
        console.log(`   📝 Première catégorie: ${category.name}`)
        console.log(`   📊 Type: ${category.category_type}`)
        console.log(`   🎨 Couleur: ${category.color}`)
        console.log(`   🎓 Formation requise: ${category.requires_training}`)
        console.log(`   ⚠️  Niveau de sécurité: ${category.safety_level}`)
        console.log(`   🔧 Nombre d'équipements: ${category.equipment_count}`)
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
  console.log('🚀 TEST COMPLET DU MODULE LAB EQUIPMENT')
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
  
  // Tests détaillés
  const equipmentDetailSuccess = await testEquipmentDetail()
  const categoriesDetailSuccess = await testCategoriesDetail()
  
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
  console.log(`   🔍 Test équipement détaillé: ${equipmentDetailSuccess ? 'Réussi' : 'Échoué'}`)
  console.log(`   🔍 Test catégories détaillé: ${categoriesDetailSuccess ? 'Réussi' : 'Échoué'}`)
  
  const totalSuccess = apiSuccess + pageSuccess + (equipmentDetailSuccess ? 1 : 0) + (categoriesDetailSuccess ? 1 : 0)
  const totalTests = apiTests.length + pageTests.length + 2
  const globalScore = Math.round((totalSuccess / totalTests) * 100)
  
  console.log(`\n🎯 SCORE GLOBAL: ${totalSuccess}/${totalTests} (${globalScore}%)`)
  
  if (globalScore === 100) {
    console.log('🎉 PARFAIT ! Le module Lab Equipment est totalement dynamique !')
    console.log('✅ Prêt à passer au module suivant')
  } else if (globalScore >= 80) {
    console.log('👍 Très bien ! Le module Lab Equipment est largement dynamique')
    console.log('⚠️  Quelques améliorations mineures possibles')
  } else {
    console.log('⚠️  Le module Lab Equipment nécessite encore des corrections')
  }
  
  console.log('=' * 50)
}

runCompleteTest().catch(console.error)
