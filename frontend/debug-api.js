/**
 * Script pour déboguer la structure des données API
 */

const API_BASE_URL = 'http://localhost:8000/api'

async function debugAPI() {
  try {
    console.log('🔍 Débogage de l\'API Courses...')
    
    const response = await fetch(`${API_BASE_URL}/education/courses/`)
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }
    
    const data = await response.json()
    console.log('📊 Données reçues:', data)
    
    if (Array.isArray(data) && data.length > 0) {
      console.log('🔑 Champs disponibles dans le premier cours:')
      console.log(Object.keys(data[0]))
      console.log('📝 Premier cours complet:')
      console.log(JSON.stringify(data[0], null, 2))
    } else if (data.results && data.results.length > 0) {
      console.log('🔑 Champs disponibles dans le premier cours (paginé):')
      console.log(Object.keys(data.results[0]))
      console.log('📝 Premier cours complet:')
      console.log(JSON.stringify(data.results[0], null, 2))
    }
    
  } catch (error) {
    console.error('❌ Erreur:', error.message)
  }
}

debugAPI()
