import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import apiClient from '@/lib/api'

interface TestResult {
  endpoint: string
  status: 'pending' | 'success' | 'error'
  data?: any
  error?: string
  duration?: number
}

const ApiTest: React.FC = () => {
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [isRunning, setIsRunning] = useState(false)

  const endpoints = [
    { name: 'Courses', url: '/education/courses/', method: 'GET' },
    { name: 'Course Categories', url: '/education/categories/', method: 'GET' },
    { name: 'Projects', url: '/entrepreneurship/projects/', method: 'GET' },
    { name: 'Project Categories', url: '/entrepreneurship/categories/', method: 'GET' },
    { name: 'Equipment', url: '/lab-equipment/equipment/', method: 'GET' },
    { name: 'Equipment Categories', url: '/lab-equipment/categories/', method: 'GET' },
    { name: 'Forum Categories', url: '/forum/categories/', method: 'GET' },
    { name: 'Forum Topics', url: '/forum/topics/', method: 'GET' },
    { name: 'Organizations', url: '/organizations/', method: 'GET' },
    { name: 'Notifications', url: '/notifications/', method: 'GET' },
    { name: 'Search', url: '/search/?q=test', method: 'GET' },
  ]

  const testEndpoint = async (endpoint: { name: string; url: string; method: string }): Promise<TestResult> => {
    const startTime = Date.now()

    try {
      const response = await apiClient.get(endpoint.url)
      const duration = Date.now() - startTime

      return {
        endpoint: endpoint.name,
        status: 'success',
        data: response.data,
        duration
      }
    } catch (error: any) {
      const duration = Date.now() - startTime

      return {
        endpoint: endpoint.name,
        status: 'error',
        error: error.response?.data?.message || error.message || 'Erreur inconnue',
        duration
      }
    }
  }

  const runAllTests = async () => {
    setIsRunning(true)
    setTestResults([])

    // Initialiser tous les tests comme pending
    const initialResults: TestResult[] = endpoints.map(endpoint => ({
      endpoint: endpoint.name,
      status: 'pending'
    }))
    setTestResults(initialResults)

    // Exécuter les tests un par un
    for (let i = 0; i < endpoints.length; i++) {
      const result = await testEndpoint(endpoints[i])
      
      setTestResults(prev => 
        prev.map((item, index) => 
          index === i ? result : item
        )
      )
    }

    setIsRunning(false)
  }

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'pending':
        return <Loader2 className="w-4 h-4 animate-spin text-yellow-500" />
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />
    }
  }

  const getStatusBadge = (status: TestResult['status']) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">En cours</Badge>
      case 'success':
        return <Badge className="bg-green-100 text-green-800">Succès</Badge>
      case 'error':
        return <Badge className="bg-red-100 text-red-800">Erreur</Badge>
    }
  }

  const successCount = testResults.filter(r => r.status === 'success').length
  const errorCount = testResults.filter(r => r.status === 'error').length
  const pendingCount = testResults.filter(r => r.status === 'pending').length

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Test de Connexion API</h1>
          <p className="text-muted-foreground">
            Vérifiez la connectivité avec le backend Django sur{' '}
            <code className="bg-muted px-2 py-1 rounded text-sm">
              {import.meta.env.VITE_API_URL || 'http://localhost:8000/api'}
            </code>
          </p>
        </div>

        {/* Contrôles */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Contrôles de Test</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex gap-4">
                <Button 
                  onClick={runAllTests} 
                  disabled={isRunning}
                  className="flex items-center gap-2"
                >
                  {isRunning && <Loader2 className="w-4 h-4 animate-spin" />}
                  {isRunning ? 'Tests en cours...' : 'Lancer tous les tests'}
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={() => setTestResults([])}
                  disabled={isRunning}
                >
                  Effacer les résultats
                </Button>
              </div>

              {testResults.length > 0 && (
                <div className="flex gap-2">
                  {successCount > 0 && (
                    <Badge className="bg-green-100 text-green-800">
                      {successCount} succès
                    </Badge>
                  )}
                  {errorCount > 0 && (
                    <Badge className="bg-red-100 text-red-800">
                      {errorCount} erreurs
                    </Badge>
                  )}
                  {pendingCount > 0 && (
                    <Badge className="bg-yellow-100 text-yellow-800">
                      {pendingCount} en cours
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Résultats des tests */}
        {testResults.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Résultats des Tests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {testResults.map((result, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(result.status)}
                      <div>
                        <div className="font-medium">{result.endpoint}</div>
                        <div className="text-sm text-muted-foreground">
                          {endpoints[index]?.url}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      {result.duration && (
                        <span className="text-sm text-muted-foreground">
                          {result.duration}ms
                        </span>
                      )}
                      {getStatusBadge(result.status)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        {testResults.length === 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Instructions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Avant de lancer les tests :</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Assurez-vous que le serveur Django est démarré sur le port 8000</li>
                  <li>Vérifiez que CORS est configuré pour accepter les requêtes depuis localhost:5173</li>
                  <li>Confirmez que les URLs d'API correspondent à votre configuration Django</li>
                </ol>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Commandes Django utiles :</h4>
                <div className="bg-muted p-3 rounded text-sm font-mono space-y-1">
                  <div>cd C:\Users\AlainDev\Downloads\ComLabAv\comlab</div>
                  <div>python manage.py runserver</div>
                  <div>python manage.py migrate</div>
                  <div>python manage.py createsuperuser</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default ApiTest
