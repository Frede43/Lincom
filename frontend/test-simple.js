/**
 * Test simple des APIs pour atteindre 100%
 */

const API_BASE_URL = 'http://localhost:8000/api'

const apis = [
  { name: 'Courses', url: `${API_BASE_URL}/education/courses/` },
  { name: 'Projects', url: `${API_BASE_URL}/entrepreneurship/projects/` },
  { name: 'Equipment', url: `${API_BASE_URL}/lab-equipment/equipment/` },
  { name: 'Forum', url: `${API_BASE_URL}/forum/categories/` },
  { name: 'Organizations', url: `${API_BASE_URL}/organizations/` },
  { name: 'Notifications', url: `${API_BASE_URL}/notifications/` },
  { name: 'Search', url: `${API_BASE_URL}/search/?q=test` }
]

async function testAPI(api) {
  try {
    const response = await fetch(api.url)
    if (response.ok) {
      const data = await response.json()
      const count = Array.isArray(data) ? data.length : 
                   Array.isArray(data.results) ? data.results.length : 'N/A'
      return { success: true, count }
    } else {
      return { success: false, error: `HTTP ${response.status}` }
    }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

async function runTest() {
  console.log('🚀 TEST SIMPLE POUR 100%')
  console.log('=' * 30)
  
  let success = 0
  let total = apis.length
  
  for (const api of apis) {
    const result = await testAPI(api)
    const icon = result.success ? '✅' : '❌'
    const info = result.success ? `${result.count} éléments` : result.error
    
    console.log(`${icon} ${api.name}: ${info}`)
    
    if (result.success) success++
  }
  
  const percentage = Math.round((success / total) * 100)
  console.log('=' * 30)
  console.log(`📊 Score: ${success}/${total} APIs (${percentage}%)`)
  
  if (percentage === 100) {
    console.log('🎉 PARFAIT ! 100% atteint !')
  } else {
    console.log(`⚠️  Il reste ${total - success} API(s) à corriger`)
  }
}

runTest().catch(console.error)
