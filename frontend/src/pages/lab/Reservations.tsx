import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  User, 
  Settings,
  CheckCircle,
  XCircle,
  AlertCircle,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  Loader2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AvatarPlaceholder } from '@/components/ui/placeholder-image'

const Reservations: React.FC = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')

  // Données mockées des réservations (en attendant l'API)
  const reservations = [
    {
      id: 1,
      equipmentName: 'Imprimante 3D Ultimaker S3',
      equipmentId: 1,
      user: 'Alice NIYONKURU',
      userId: 1,
      startTime: '2024-01-22T09:00:00Z',
      endTime: '2024-01-22T12:00:00Z',
      duration: 3,
      status: 'confirmed',
      purpose: 'Prototype pour projet de fin d\'études',
      cost: 45000,
      currency: 'BIF',
      createdAt: '2024-01-20T14:30:00Z',
      notes: 'Matériau PLA blanc fourni'
    },
    {
      id: 2,
      equipmentName: 'Découpeuse Laser CO2',
      equipmentId: 2,
      user: 'David HAKIZIMANA',
      userId: 2,
      startTime: '2024-01-22T14:00:00Z',
      endTime: '2024-01-22T16:00:00Z',
      duration: 2,
      status: 'pending',
      purpose: 'Découpe de panneaux pour maquette architecturale',
      cost: 30000,
      currency: 'BIF',
      createdAt: '2024-01-21T10:15:00Z',
      notes: 'Matériau contreplaqué 3mm'
    },
    {
      id: 3,
      equipmentName: 'Station de Soudure Weller',
      equipmentId: 4,
      user: 'Marie UWIMANA',
      userId: 3,
      startTime: '2024-01-21T10:00:00Z',
      endTime: '2024-01-21T11:00:00Z',
      duration: 1,
      status: 'completed',
      purpose: 'Réparation de circuit électronique',
      cost: 5000,
      currency: 'BIF',
      createdAt: '2024-01-20T16:45:00Z',
      notes: 'Réparation réussie'
    },
    {
      id: 4,
      equipmentName: 'Scanner 3D EinScan',
      equipmentId: 5,
      user: 'Paul NDAYISENGA',
      userId: 4,
      startTime: '2024-01-23T09:00:00Z',
      endTime: '2024-01-23T11:00:00Z',
      duration: 2,
      status: 'cancelled',
      purpose: 'Numérisation d\'objets pour archive',
      cost: 20000,
      currency: 'BIF',
      createdAt: '2024-01-19T13:20:00Z',
      notes: 'Annulé par l\'utilisateur'
    },
    {
      id: 5,
      equipmentName: 'Imprimante 3D Ultimaker S3',
      equipmentId: 1,
      user: 'Sarah NDAYISHIMIYE',
      userId: 5,
      startTime: '2024-01-24T13:00:00Z',
      endTime: '2024-01-24T17:00:00Z',
      duration: 4,
      status: 'confirmed',
      purpose: 'Production de pièces pour startup',
      cost: 60000,
      currency: 'BIF',
      createdAt: '2024-01-21T11:30:00Z',
      notes: 'Matériau PETG transparent'
    }
  ]

  // Filtrage des réservations
  const filteredReservations = reservations.filter(reservation =>
    reservation.equipmentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    reservation.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
    reservation.purpose.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'confirmed': 'bg-blue-100 text-blue-800',
      'completed': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getStatusIcon = (status: string) => {
    const icons: Record<string, React.ReactNode> = {
      'pending': <AlertCircle className="w-4 h-4" />,
      'confirmed': <CheckCircle className="w-4 h-4" />,
      'completed': <CheckCircle className="w-4 h-4" />,
      'cancelled': <XCircle className="w-4 h-4" />
    }
    return icons[status] || <AlertCircle className="w-4 h-4" />
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      'pending': 'En attente',
      'confirmed': 'Confirmée',
      'completed': 'Terminée',
      'cancelled': 'Annulée'
    }
    return labels[status] || status
  }

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    return {
      date: date.toLocaleDateString('fr-FR'),
      time: date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    }
  }

  // Statistiques
  const stats = {
    total: reservations.length,
    pending: reservations.filter(r => r.status === 'pending').length,
    confirmed: reservations.filter(r => r.status === 'confirmed').length,
    completed: reservations.filter(r => r.status === 'completed').length,
    totalRevenue: reservations.filter(r => r.status === 'completed').reduce((sum, r) => sum + r.cost, 0)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/equipment')}
                className="text-white hover:bg-white/10"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour aux équipements
              </Button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Calendar className="w-12 h-12" />
                  <h1 className="text-4xl font-bold">Réservations</h1>
                </div>
                <p className="text-xl text-white/90">
                  Gérez vos réservations d'équipements du Fab Lab
                </p>
              </div>
              
              <Button asChild size="lg" className="bg-white text-green-600 hover:bg-white/90">
                <Link to="/equipment">
                  <Plus className="w-5 h-5 mr-2" />
                  Nouvelle réservation
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Barre de recherche */}
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-6xl mx-auto">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Rechercher une réservation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {/* Statistiques */}
      <div className="container mx-auto px-4 pb-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
            <Card>
              <CardContent className="p-6 text-center">
                <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="text-3xl font-bold text-blue-600">{stats.total}</div>
                <div className="text-sm text-muted-foreground">Total</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <AlertCircle className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                <div className="text-3xl font-bold text-yellow-600">{stats.pending}</div>
                <div className="text-sm text-muted-foreground">En attente</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <CheckCircle className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="text-3xl font-bold text-blue-600">{stats.confirmed}</div>
                <div className="text-sm text-muted-foreground">Confirmées</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <div className="text-3xl font-bold text-green-600">{stats.completed}</div>
                <div className="text-sm text-muted-foreground">Terminées</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Settings className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <div className="text-3xl font-bold text-purple-600">
                  {stats.totalRevenue.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">BIF générés</div>
              </CardContent>
            </Card>
          </div>

          {/* Contenu principal */}
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-4 mx-auto mb-8">
              <TabsTrigger value="all">Toutes</TabsTrigger>
              <TabsTrigger value="pending">En attente</TabsTrigger>
              <TabsTrigger value="confirmed">Confirmées</TabsTrigger>
              <TabsTrigger value="completed">Terminées</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              {/* Liste des réservations */}
              {filteredReservations.length > 0 ? (
                <div className="space-y-4">
                  {filteredReservations.map(reservation => {
                    const startDateTime = formatDateTime(reservation.startTime)
                    const endDateTime = formatDateTime(reservation.endTime)
                    
                    return (
                      <Card key={reservation.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-3">
                                <h3 className="text-lg font-semibold">{reservation.equipmentName}</h3>
                                <Badge className={getStatusColor(reservation.status)}>
                                  {getStatusIcon(reservation.status)}
                                  <span className="ml-1">{getStatusLabel(reservation.status)}</span>
                                </Badge>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <div className="flex items-center gap-2">
                                  <User className="w-4 h-4 text-muted-foreground" />
                                  <span className="text-sm">{reservation.user}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Calendar className="w-4 h-4 text-muted-foreground" />
                                  <span className="text-sm">{startDateTime.date}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Clock className="w-4 h-4 text-muted-foreground" />
                                  <span className="text-sm">
                                    {startDateTime.time} - {endDateTime.time} ({reservation.duration}h)
                                  </span>
                                </div>
                              </div>
                              
                              <p className="text-muted-foreground text-sm mb-3">
                                <strong>Objectif:</strong> {reservation.purpose}
                              </p>
                              
                              {reservation.notes && (
                                <p className="text-muted-foreground text-sm">
                                  <strong>Notes:</strong> {reservation.notes}
                                </p>
                              )}
                            </div>
                            
                            <div className="text-right ml-6">
                              <div className="text-2xl font-bold text-primary mb-2">
                                {reservation.cost.toLocaleString()} {reservation.currency}
                              </div>
                              
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm">
                                  <Eye className="w-4 h-4" />
                                </Button>
                                {reservation.status === 'pending' && (
                                  <>
                                    <Button variant="outline" size="sm">
                                      <Edit className="w-4 h-4" />
                                    </Button>
                                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Aucune réservation trouvée</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchQuery ? 'Essayez avec d\'autres mots-clés' : 'Vous n\'avez pas encore de réservations'}
                  </p>
                  <Button asChild>
                    <Link to="/equipment">
                      <Plus className="w-4 h-4 mr-2" />
                      Créer une réservation
                    </Link>
                  </Button>
                </div>
              )}
            </TabsContent>

            {/* Autres onglets avec filtrage par statut */}
            {['pending', 'confirmed', 'completed'].map(status => (
              <TabsContent key={status} value={status} className="mt-6">
                <div className="text-center py-12">
                  {getStatusIcon(status)}
                  <h3 className="text-xl font-semibold mb-2 mt-4">
                    Réservations {getStatusLabel(status).toLowerCase()}
                  </h3>
                  <p className="text-muted-foreground">
                    Filtrage par statut en cours de développement
                  </p>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </div>
  )
}

export default Reservations
