/**
 * Test complet du module Entrepreneurship pour vérifier qu'il est totalement dynamique
 */

const API_BASE_URL = 'http://localhost:8000/api/entrepreneurship'

// Tests des APIs
const apiTests = [
  { name: 'Startups', url: `${API_BASE_URL}/startups/` },
  { name: 'Projects', url: `${API_BASE_URL}/projects/` }
]

// Tests des pages frontend
const pageTests = [
  { name: 'Liste des projets', url: 'http://localhost:8080/projects' },
  { name: 'Détail projet 1', url: 'http://localhost:8080/projects/1' },
  { name: 'Détail projet 2', url: 'http://localhost:8080/projects/2' }
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

async function testStartupDetail() {
  try {
    console.log('\n🔍 Test détaillé d\'une startup:')
    const response = await fetch(`${API_BASE_URL}/startups/1/`)
    if (response.ok) {
      const startup = await response.json()
      console.log(`   ✅ Startup: ${startup.name}`)
      console.log(`   🏭 Secteur: ${startup.industry}`)
      console.log(`   👥 Équipe: ${startup.team_size} personnes`)
      console.log(`   💰 Financement: ${startup.total_funding} (${startup.funding_stage})`)
      console.log(`   📅 Fondée: ${startup.founding_date}`)
      console.log(`   🌐 Site: ${startup.website || 'N/A'}`)
      
      // Test des projets de la startup
      const projectsResponse = await fetch(`${API_BASE_URL}/projects/?startup=1`)
      if (projectsResponse.ok) {
        const projects = await projectsResponse.json()
        console.log(`   📋 Projets associés: ${projects.length}`)
        
        if (projects.length > 0) {
          const project = projects[0]
          console.log(`   📝 Premier projet: ${project.title}`)
          console.log(`   💰 Budget: ${project.budget}`)
          console.log(`   📊 Statut: ${project.status}`)
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

async function testProjectDetail() {
  try {
    console.log('\n🔍 Test détaillé d\'un projet:')
    const response = await fetch(`${API_BASE_URL}/projects/1/`)
    if (response.ok) {
      const project = await response.json()
      console.log(`   ✅ Projet: ${project.title}`)
      console.log(`   📊 Statut: ${project.status}`)
      console.log(`   🎯 Priorité: ${project.priority}`)
      console.log(`   💰 Budget: ${project.budget}`)
      console.log(`   📅 Période: ${project.start_date} → ${project.end_date}`)
      console.log(`   🏢 Startup ID: ${project.startup}`)
      console.log(`   👤 Manager ID: ${project.manager}`)
      return true
    }
    return false
  } catch (error) {
    console.log(`   ❌ Erreur: ${error.message}`)
    return false
  }
}

async function runCompleteTest() {
  console.log('🚀 TEST COMPLET DU MODULE ENTREPRENEURSHIP')
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
  const startupDetailSuccess = await testStartupDetail()
  const projectDetailSuccess = await testProjectDetail()
  
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
  console.log(`   🔍 Test startup détaillé: ${startupDetailSuccess ? 'Réussi' : 'Échoué'}`)
  console.log(`   🔍 Test projet détaillé: ${projectDetailSuccess ? 'Réussi' : 'Échoué'}`)
  
  const totalSuccess = apiSuccess + pageSuccess + (startupDetailSuccess ? 1 : 0) + (projectDetailSuccess ? 1 : 0)
  const totalTests = apiTests.length + pageTests.length + 2
  const globalScore = Math.round((totalSuccess / totalTests) * 100)
  
  console.log(`\n🎯 SCORE GLOBAL: ${totalSuccess}/${totalTests} (${globalScore}%)`)
  
  if (globalScore === 100) {
    console.log('🎉 PARFAIT ! Le module Entrepreneurship est totalement dynamique !')
    console.log('✅ Prêt à passer au module suivant')
  } else if (globalScore >= 80) {
    console.log('👍 Très bien ! Le module Entrepreneurship est largement dynamique')
    console.log('⚠️  Quelques améliorations mineures possibles')
  } else {
    console.log('⚠️  Le module Entrepreneurship nécessite encore des corrections')
  }
  
  console.log('=' * 50)
}

runCompleteTest().catch(console.error)
