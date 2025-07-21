#!/usr/bin/env node

/**
 * Script de test de connexion au backend Django
 * Community Laboratory Burundi
 */

const axios = require('axios')
const colors = require('colors')

// Configuration
const BACKEND_URL = 'http://localhost:8000/api'
const FRONTEND_URL = 'http://localhost:5173'

// Tests à effectuer
const tests = [
  {
    name: 'Backend Django Health Check',
    url: `${BACKEND_URL}/`,
    method: 'GET',
    expected: 200
  },
  {
    name: 'Users API - Profiles',
    url: `${BACKEND_URL}/users/profiles/`,
    method: 'GET',
    expected: [200, 401] // 401 si auth requise
  },
  {
    name: 'Education API - Courses',
    url: `${BACKEND_URL}/education/courses/`,
    method: 'GET',
    expected: [200, 401]
  },
  {
    name: 'Entrepreneurship API - Projects',
    url: `${BACKEND_URL}/entrepreneurship/projects/`,
    method: 'GET',
    expected: [200, 401]
  },
  {
    name: 'Lab Equipment API - Equipment',
    url: `${BACKEND_URL}/lab-equipment/equipment/`,
    method: 'GET',
    expected: [200, 401]
  },
  {
    name: 'Mentorship API - Programs',
    url: `${BACKEND_URL}/mentorship/programs/`,
    method: 'GET',
    expected: [200, 401]
  }
]

// Fonction utilitaire pour les couleurs
const log = {
  success: (msg) => console.log('✅'.green + ' ' + msg.green),
  error: (msg) => console.log('❌'.red + ' ' + msg.red),
  warning: (msg) => console.log('⚠️'.yellow + ' ' + msg.yellow),
  info: (msg) => console.log('ℹ️'.blue + ' ' + msg.blue),
  title: (msg) => console.log('\n' + '🔗'.cyan + ' ' + msg.cyan.bold)
}

// Fonction de test d'un endpoint
async function testEndpoint(test) {
  try {
    const response = await axios({
      method: test.method,
      url: test.url,
      timeout: 5000,
      validateStatus: () => true // Accepter tous les status codes
    })

    const expectedCodes = Array.isArray(test.expected) ? test.expected : [test.expected]
    
    if (expectedCodes.includes(response.status)) {
      log.success(`${test.name}: ${response.status} ${response.statusText}`)
      return { success: true, status: response.status, test: test.name }
    } else {
      log.error(`${test.name}: Expected ${expectedCodes.join(' or ')}, got ${response.status}`)
      return { success: false, status: response.status, test: test.name, error: `Unexpected status ${response.status}` }
    }
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      log.error(`${test.name}: Connection refused - Backend not running?`)
      return { success: false, test: test.name, error: 'Connection refused' }
    } else if (error.code === 'ETIMEDOUT') {
      log.error(`${test.name}: Timeout - Backend too slow?`)
      return { success: false, test: test.name, error: 'Timeout' }
    } else {
      log.error(`${test.name}: ${error.message}`)
      return { success: false, test: test.name, error: error.message }
    }
  }
}

// Fonction principale
async function runTests() {
  log.title('COMMUNITY LABORATORY BURUNDI - BACKEND CONNECTION TEST')
  
  console.log(`Backend URL: ${BACKEND_URL}`.gray)
  console.log(`Frontend URL: ${FRONTEND_URL}`.gray)
  console.log('─'.repeat(60).gray)

  const results = []
  
  for (const test of tests) {
    const result = await testEndpoint(test)
    results.push(result)
    
    // Petite pause entre les tests
    await new Promise(resolve => setTimeout(resolve, 100))
  }

  // Résumé des résultats
  console.log('\n' + '📊 RÉSUMÉ DES TESTS'.cyan.bold)
  console.log('─'.repeat(60).gray)
  
  const successful = results.filter(r => r.success).length
  const total = results.length
  
  if (successful === total) {
    log.success(`Tous les tests réussis ! (${successful}/${total})`)
    log.info('✨ Votre backend Django est prêt pour le frontend !')
  } else {
    log.warning(`${successful}/${total} tests réussis`)
    
    const failed = results.filter(r => !r.success)
    console.log('\n' + '🔍 TESTS ÉCHOUÉS:'.red.bold)
    failed.forEach(result => {
      console.log(`   • ${result.test}: ${result.error}`.red)
    })
  }

  // Recommandations
  console.log('\n' + '💡 RECOMMANDATIONS:'.yellow.bold)
  
  if (results.some(r => r.error === 'Connection refused')) {
    console.log('   • Démarrez votre backend Django: python manage.py runserver'.yellow)
  }
  
  if (results.some(r => r.status === 404)) {
    console.log('   • Vérifiez que les URLs dans urls.py correspondent aux endpoints testés'.yellow)
  }
  
  if (results.some(r => r.status === 401)) {
    console.log('   • Les endpoints protégés nécessitent une authentification (normal)'.yellow)
  }
  
  if (results.some(r => r.status === 500)) {
    console.log('   • Erreur serveur - vérifiez les logs Django'.yellow)
  }

  console.log('\n' + '🚀 PROCHAINES ÉTAPES:'.green.bold)
  console.log('   1. Démarrez Django: cd C:\\Users\\AlainDev\\Downloads\\ComLabAv && python manage.py runserver'.green)
  console.log('   2. Démarrez React: cd frontend && npm run dev'.green)
  console.log('   3. Ouvrez http://localhost:5173 dans votre navigateur'.green)
  
  console.log('\n' + '─'.repeat(60).gray)
  console.log('🌍 Community Laboratory Burundi - Ready to revolutionize innovation in Burundi!'.rainbow)
}

// Gestion des erreurs non capturées
process.on('unhandledRejection', (error) => {
  log.error(`Erreur non gérée: ${error.message}`)
  process.exit(1)
})

// Lancement des tests
if (require.main === module) {
  runTests().catch(error => {
    log.error(`Erreur fatale: ${error.message}`)
    process.exit(1)
  })
}

module.exports = { runTests, testEndpoint }
