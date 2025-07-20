/**
 * Script de test pour vérifier la connectivité avec toutes les APIs Django
 * Community Laboratory Burundi
 */

import { 
  coursesAPI, 
  projectsAPI, 
  equipmentAPI, 
  forumAPI, 
  organizationsAPI, 
  notificationsAPI, 
  searchAPI 
} from '@/lib/api'

export interface APITestResult {
  endpoint: string
  status: 'success' | 'error'
  data?: any
  error?: string
  duration: number
}

export class APITester {
  private results: APITestResult[] = []

  async testEndpoint(
    name: string, 
    apiCall: () => Promise<any>
  ): Promise<APITestResult> {
    const startTime = Date.now()
    
    try {
      const data = await apiCall()
      const duration = Date.now() - startTime
      
      const result: APITestResult = {
        endpoint: name,
        status: 'success',
        data,
        duration
      }
      
      this.results.push(result)
      return result
    } catch (error: any) {
      const duration = Date.now() - startTime
      
      const result: APITestResult = {
        endpoint: name,
        status: 'error',
        error: error.message || 'Erreur inconnue',
        duration
      }
      
      this.results.push(result)
      return result
    }
  }

  async testAllAPIs(): Promise<APITestResult[]> {
    console.log('🔄 Test de toutes les APIs Django...')
    this.results = []

    // Test des cours
    await this.testEndpoint('Courses - Liste', () => coursesAPI.getAll())
    
    // Test des projets
    await this.testEndpoint('Projects - Liste', () => projectsAPI.getAll())
    
    // Test des équipements
    await this.testEndpoint('Equipment - Liste', () => equipmentAPI.getAll())
    
    // Test du forum
    await this.testEndpoint('Forum - Catégories', () => forumAPI.getCategories())
    
    // Test des organisations
    await this.testEndpoint('Organizations - Liste', () => organizationsAPI.getAll())
    
    // Test des notifications
    await this.testEndpoint('Notifications - Liste', () => notificationsAPI.getAll())
    
    // Test de la recherche
    await this.testEndpoint('Search - Test', () => searchAPI.search('test'))

    return this.results
  }

  getResults(): APITestResult[] {
    return this.results
  }

  getSuccessCount(): number {
    return this.results.filter(r => r.status === 'success').length
  }

  getErrorCount(): number {
    return this.results.filter(r => r.status === 'error').length
  }

  printResults(): void {
    console.log('\n📊 RÉSULTATS DES TESTS API:')
    console.log('=' * 50)
    
    this.results.forEach(result => {
      const status = result.status === 'success' ? '✅' : '❌'
      const duration = `${result.duration}ms`
      
      console.log(`${status} ${result.endpoint} (${duration})`)
      
      if (result.status === 'error') {
        console.log(`   Erreur: ${result.error}`)
      } else if (result.data) {
        const dataInfo = Array.isArray(result.data) 
          ? `${result.data.length} éléments`
          : 'Objet'
        console.log(`   Données: ${dataInfo}`)
      }
    })
    
    console.log('=' * 50)
    console.log(`✅ Succès: ${this.getSuccessCount()}`)
    console.log(`❌ Erreurs: ${this.getErrorCount()}`)
    console.log(`📊 Total: ${this.results.length}`)
  }
}

// Fonction utilitaire pour tester depuis la console
export const testAllAPIs = async (): Promise<void> => {
  const tester = new APITester()
  await tester.testAllAPIs()
  tester.printResults()
}

// Export pour utilisation dans les composants
export default APITester
