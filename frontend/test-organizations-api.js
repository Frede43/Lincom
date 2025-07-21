/**
 * Test des APIs Organizations pour diagnostiquer les erreurs 404
 */

const API_BASE_URL = 'http://localhost:8000/api'

async function testOrganizationsAPI() {
  console.log('🔍 TEST DES APIs ORGANIZATIONS')
  console.log('=' * 50)
  
  // Test de l'endpoint de liste
  console.log('\n📋 Test de la liste des organisations:')
  try {
    const response = await fetch(`${API_BASE_URL}/organizations/`)
    if (response.ok) {
      const data = await response.json()
      console.log('✅ Liste OK')
      console.log(`📊 Nombre d'organisations: ${data.length || data.results?.length || 'N/A'}`)
      
      if (data.length > 0 || data.results?.length > 0) {
        const orgs = data.results || data
        console.log('\n📝 Organisations disponibles:')
        orgs.forEach(org => {
          console.log(`   • ID ${org.id}: ${org.name}`)
        })
        
        // Test des détails pour chaque organisation
        console.log('\n🔍 Test des détails pour chaque organisation:')
        for (const org of orgs.slice(0, 4)) { // Tester les 4 premières
          try {
            const detailResponse = await fetch(`${API_BASE_URL}/organizations/${org.id}/`)
            if (detailResponse.ok) {
              const detailData = await detailResponse.json()
              console.log(`   ✅ ID ${org.id} (${org.name}): OK`)
            } else {
              console.log(`   ❌ ID ${org.id} (${org.name}): HTTP ${detailResponse.status}`)
            }
          } catch (error) {
            console.log(`   ❌ ID ${org.id} (${org.name}): ${error.message}`)
          }
          
          // Attendre un peu entre les requêtes
          await new Promise(resolve => setTimeout(resolve, 500))
        }
      }
    } else {
      console.log(`❌ Liste: HTTP ${response.status}`)
    }
  } catch (error) {
    console.log(`❌ Liste: ${error.message}`)
  }
  
  // Test direct des IDs spécifiques
  console.log('\n🎯 Test direct des IDs spécifiques:')
  const testIds = [1, 2, 3, 4]
  
  for (const id of testIds) {
    try {
      const response = await fetch(`${API_BASE_URL}/organizations/${id}/`)
      if (response.ok) {
        const data = await response.json()
        console.log(`   ✅ ID ${id}: ${data.name}`)
      } else {
        console.log(`   ❌ ID ${id}: HTTP ${response.status}`)
      }
    } catch (error) {
      console.log(`   ❌ ID ${id}: ${error.message}`)
    }
    
    // Attendre un peu entre les requêtes
    await new Promise(resolve => setTimeout(resolve, 500))
  }
  
  // Test des URLs frontend
  console.log('\n🌐 Test des pages frontend:')
  const frontendUrls = [
    'http://localhost:8080/organizations',
    'http://localhost:8080/organizations/1',
    'http://localhost:8080/organizations/2',
    'http://localhost:8080/organizations/partnership'
  ]
  
  for (const url of frontendUrls) {
    try {
      const response = await fetch(url)
      if (response.ok) {
        console.log(`   ✅ ${url}: OK`)
      } else {
        console.log(`   ❌ ${url}: HTTP ${response.status}`)
      }
    } catch (error) {
      console.log(`   ❌ ${url}: ${error.message}`)
    }
  }
  
  console.log('\n' + '=' * 50)
  console.log('🎯 DIAGNOSTIC TERMINÉ')
  console.log('Si des erreurs 404 persistent, vérifiez:')
  console.log('1. Le serveur Django est démarré')
  console.log('2. Les URLs dans api.ts correspondent aux endpoints Django')
  console.log('3. Les IDs existent dans la base de données')
  console.log('4. Les permissions sont configurées correctement')
}

// Démarrer le test
testOrganizationsAPI().catch(console.error)
