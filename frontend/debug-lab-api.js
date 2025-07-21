/**
 * Script pour analyser toutes les APIs du module Lab Equipment
 */

const API_BASE_URL = 'http://localhost:8000/api/lab-equipment'

const endpoints = [
  { name: 'Equipment', url: `${API_BASE_URL}/equipment/` },
  { name: 'Reservations', url: `${API_BASE_URL}/reservations/` },
  { name: 'Categories', url: `${API_BASE_URL}/categories/` },
  { name: 'Maintenance', url: `${API_BASE_URL}/maintenance/` },
  { name: 'Usage Logs', url: `${API_BASE_URL}/usage-logs/` }
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
      if (endpoint.name === 'Equipment') {
        console.log(`   📝 Premier équipement:`)
        console.log(`      ID: ${items[0].id}`)
        console.log(`      Nom: ${items[0].name}`)
        console.log(`      Type: ${items[0].type}`)
        console.log(`      Statut: ${items[0].status}`)
        console.log(`      Disponible: ${items[0].is_available}`)
      } else if (endpoint.name === 'Reservations') {
        console.log(`   📝 Première réservation:`)
        console.log(`      ID: ${items[0].id}`)
        console.log(`      Équipement: ${items[0].equipment}`)
        console.log(`      Utilisateur: ${items[0].user}`)
        console.log(`      Statut: ${items[0].status}`)
      }
    }
    
  } catch (error) {
    console.log(`   ❌ Erreur: ${error.message}`)
  }
}

async function testEquipmentDetail() {
  try {
    console.log(`\n🔍 Test Equipment Detail (ID: 1):`)
    const response = await fetch(`${API_BASE_URL}/equipment/1/`)
    if (response.ok) {
      const equipment = await response.json()
      console.log(`   ✅ Équipement trouvé: ${equipment.name}`)
      console.log(`   🔑 Champs détaillés: ${Object.keys(equipment).join(', ')}`)
      console.log(`   📊 Type: ${equipment.type}`)
      console.log(`   🔧 Statut: ${equipment.status}`)
      console.log(`   💰 Prix/heure: ${equipment.hourly_rate}`)
    } else {
      console.log(`   ❌ HTTP ${response.status}`)
    }
  } catch (error) {
    console.log(`   ❌ Erreur: ${error.message}`)
  }
}

async function runAnalysis() {
  console.log('🚀 ANALYSE COMPLÈTE DU MODULE LAB EQUIPMENT')
  console.log('=' * 50)
  
  for (const endpoint of endpoints) {
    await debugEndpoint(endpoint)
  }
  
  await testEquipmentDetail()
  
  console.log('\n' + '=' * 50)
  console.log('✅ Analyse terminée')
}

runAnalysis().catch(console.error)
