/**
 * Script pour analyser toutes les APIs du module Entrepreneurship
 */

const API_BASE_URL = 'http://localhost:8000/api/entrepreneurship'

const endpoints = [
  { name: 'Startups', url: `${API_BASE_URL}/startups/` },
  { name: 'Projects', url: `${API_BASE_URL}/projects/` },
  { name: 'Mentors', url: `${API_BASE_URL}/mentors/` },
  { name: 'Investors', url: `${API_BASE_URL}/investors/` },
  { name: 'Applications', url: `${API_BASE_URL}/applications/` },
  { name: 'Funding Rounds', url: `${API_BASE_URL}/funding-rounds/` }
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
      if (endpoint.name === 'Startups') {
        console.log(`   📝 Première startup:`)
        console.log(`      ID: ${items[0].id}`)
        console.log(`      Nom: ${items[0].name}`)
        console.log(`      Secteur: ${items[0].industry}`)
        console.log(`      Statut: ${items[0].status}`)
      } else if (endpoint.name === 'Projects') {
        console.log(`   📝 Premier projet:`)
        console.log(`      ID: ${items[0].id}`)
        console.log(`      Titre: ${items[0].title}`)
        console.log(`      Statut: ${items[0].status}`)
        console.log(`      Budget: ${items[0].budget}`)
      }
    }
    
  } catch (error) {
    console.log(`   ❌ Erreur: ${error.message}`)
  }
}

async function testStartupDetail() {
  try {
    console.log(`\n🔍 Test Startup Detail (ID: 1):`)
    const response = await fetch(`${API_BASE_URL}/startups/1/`)
    if (response.ok) {
      const startup = await response.json()
      console.log(`   ✅ Startup trouvée: ${startup.name}`)
      console.log(`   🔑 Champs détaillés: ${Object.keys(startup).join(', ')}`)
      console.log(`   📊 Équipe: ${startup.team_size} personnes`)
      console.log(`   💰 Financement: ${startup.total_funding} ${startup.funding_stage}`)
    } else {
      console.log(`   ❌ HTTP ${response.status}`)
    }
  } catch (error) {
    console.log(`   ❌ Erreur: ${error.message}`)
  }
}

async function testProjectDetail() {
  try {
    console.log(`\n🔍 Test Project Detail (ID: 1):`)
    const response = await fetch(`${API_BASE_URL}/projects/1/`)
    if (response.ok) {
      const project = await response.json()
      console.log(`   ✅ Projet trouvé: ${project.title}`)
      console.log(`   🔑 Champs détaillés: ${Object.keys(project).join(', ')}`)
      console.log(`   📅 Dates: ${project.start_date} → ${project.end_date}`)
      console.log(`   💰 Budget: ${project.budget}`)
    } else {
      console.log(`   ❌ HTTP ${response.status}`)
    }
  } catch (error) {
    console.log(`   ❌ Erreur: ${error.message}`)
  }
}

async function runAnalysis() {
  console.log('🚀 ANALYSE COMPLÈTE DU MODULE ENTREPRENEURSHIP')
  console.log('=' * 50)
  
  for (const endpoint of endpoints) {
    await debugEndpoint(endpoint)
  }
  
  await testStartupDetail()
  await testProjectDetail()
  
  console.log('\n' + '=' * 50)
  console.log('✅ Analyse terminée')
}

runAnalysis().catch(console.error)
