import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  Calendar, Clock, CheckCircle, AlertTriangle, Wrench, Users,
  Star, ArrowLeft, Download, BookOpen, Shield, Zap, Settings,
  MapPin, DollarSign, Activity, BarChart3, FileText, Video,
  Award, AlertCircle, TrendingUp, Eye, MessageCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { PlaceholderImage, AvatarPlaceholder } from '@/components/ui/placeholder-image'

const EquipmentDetail: React.FC = () => {
  const { equipmentId } = useParams()
  const [selectedDate, setSelectedDate] = useState('')

  // Mock data - sera remplacé par les vrais hooks
  const equipment = {
    id: equipmentId,
    name: 'Imprimante 3D Prusa i3 MK3S+',
    description: 'Imprimante 3D haute précision pour prototypage rapide et fabrication de pièces. Idéale pour les projets étudiants et les prototypes professionnels.',
    longDescription: `La Prusa i3 MK3S+ est une imprimante 3D de qualité professionnelle qui offre une précision exceptionnelle et une fiabilité éprouvée. 

Cette machine est parfaite pour :
- Prototypage rapide de produits
- Fabrication de pièces fonctionnelles
- Projets éducatifs et recherche
- Création d'outils et accessoires personnalisés

Avec sa surface d'impression généreuse et sa compatibilité avec de nombreux matériaux, elle répond aux besoins des makers, étudiants et entrepreneurs du Community Lab.`,
    
    image: null,
    category: 'Impression 3D',
    status: 'available',
    location: 'Atelier Principal - Zone A',
    manufacturer: 'Prusa Research',
    model: 'i3 MK3S+',
    serialNumber: 'PR-001-2024',
    
    acquisitionDate: '2024-01-15',
    lastMaintenance: '2024-01-10',
    nextMaintenance: '2024-04-10',
    warrantyExpiry: '2027-01-15',
    
    specifications: {
      'Volume d\'impression': '250 × 210 × 210 mm',
      'Précision': '±0.1 mm',
      'Vitesse d\'impression': '200 mm/s (max)',
      'Épaisseur de couche': '0.05 - 0.35 mm',
      'Matériaux compatibles': 'PLA, PETG, ABS, ASA, PC, CPE, PVA, HIPS, PP, Flex',
      'Connectivité': 'USB, Ethernet, Wi-Fi, SD Card',
      'Écran': 'LCD couleur 3.5"',
      'Auto-calibration': 'Oui (9 points)',
      'Détection de filament': 'Oui',
      'Reprise après panne': 'Oui'
    },
    
    pricing: {
      hourlyRate: 5000, // BIF
      currency: 'BIF',
      materialCost: 2000, // BIF par gramme
      setupFee: 3000, // BIF
      discounts: {
        student: 50, // 50% de réduction
        bulk: 20, // 20% pour +10h
        member: 30 // 30% pour membres premium
      }
    },
    
    certificationRequired: true,
    certification: {
      name: 'Certification Impression 3D Niveau 1',
      duration: '4 heures',
      cost: 25000, // BIF
      nextSession: '2024-02-01',
      description: 'Formation complète sur l\'utilisation sécurisée et efficace de l\'imprimante 3D'
    },
    
    maxReservationHours: 8,
    advanceBookingDays: 14,
    
    usage: {
      totalHours: 156,
      thisMonth: 23,
      averageSession: 3.2,
      popularTimes: ['14:00-18:00', '09:00-12:00'],
      busyDays: ['Mardi', 'Mercredi', 'Jeudi']
    },
    
    ratings: {
      average: 4.8,
      total: 23,
      breakdown: {
        5: 18,
        4: 4,
        3: 1,
        2: 0,
        1: 0
      }
    },
    
    currentReservations: [
      { date: '2024-01-22', time: '09:00-12:00', user: 'Marie UWIMANA', project: 'Prototype capteur IoT' },
      { date: '2024-01-22', time: '14:00-17:00', user: 'Jean NKURUNZIZA', project: 'Pièces drone agricole' },
      { date: '2024-01-23', time: '10:00-13:00', user: 'Paul NDAYISENGA', project: 'Boîtier électronique' }
    ],
    
    maintenanceHistory: [
      { date: '2024-01-10', type: 'Maintenance préventive', technician: 'Fab Manager', notes: 'Calibration, nettoyage, vérification courroies' },
      { date: '2023-12-15', type: 'Réparation', technician: 'Fab Manager', notes: 'Remplacement buse obstruée' },
      { date: '2023-11-20', type: 'Maintenance préventive', technician: 'Fab Manager', notes: 'Lubrification, mise à jour firmware' }
    ],
    
    resources: [
      { name: 'Manuel utilisateur', type: 'PDF', url: '/downloads/prusa-manual.pdf' },
      { name: 'Guide de démarrage rapide', type: 'PDF', url: '/downloads/prusa-quickstart.pdf' },
      { name: 'Profils de matériaux', type: 'ZIP', url: '/downloads/prusa-profiles.zip' },
      { name: 'Tutoriel vidéo', type: 'Video', url: '/videos/prusa-tutorial.mp4' }
    ],
    
    projects: [
      { id: '1', name: 'Capteurs IoT agricoles', user: 'Marie UWIMANA', image: null, likes: 12 },
      { id: '2', name: 'Prothèses 3D', user: 'Dr. Sarah NDAYISHIMIYE', image: null, likes: 8 },
      { id: '3', name: 'Outils pédagogiques', user: 'Jean NKURUNZIZA', image: null, likes: 15 }
    ],
    
    reviews: [
      {
        id: '1',
        user: { name: 'Marie UWIMANA', avatar: null },
        rating: 5,
        date: '2024-01-15',
        comment: 'Excellente qualité d\'impression ! Parfaite pour mes prototypes de capteurs IoT. Le support est très réactif.',
        helpful: 8
      },
      {
        id: '2',
        user: { name: 'Paul NDAYISENGA', avatar: null },
        rating: 5,
        date: '2024-01-12',
        comment: 'Machine très fiable, facile à utiliser après la formation. Les résultats sont impressionnants.',
        helpful: 6
      }
    ]
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800'
      case 'reserved': return 'bg-yellow-100 text-yellow-800'
      case 'maintenance': return 'bg-orange-100 text-orange-800'
      case 'out-of-order': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'available': return 'Disponible'
      case 'reserved': return 'Réservé'
      case 'maintenance': return 'Maintenance'
      case 'out-of-order': return 'Hors service'
      default: return status
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available': return <CheckCircle className="w-4 h-4" />
      case 'reserved': return <Clock className="w-4 h-4" />
      case 'maintenance': return <Wrench className="w-4 h-4" />
      case 'out-of-order': return <AlertTriangle className="w-4 h-4" />
      default: return <CheckCircle className="w-4 h-4" />
    }
  }

  const calculateCost = (hours: number, isStudent: boolean = false) => {
    let cost = equipment.pricing.setupFee + (hours * equipment.pricing.hourlyRate)
    if (isStudent) {
      cost *= (1 - equipment.pricing.discounts.student / 100)
    }
    return cost
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/lab/equipment" className="hover:text-primary flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" />
              Équipements
            </Link>
            <span>/</span>
            <span className="text-foreground">{equipment.name}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contenu principal */}
          <div className="lg:col-span-2">
            {/* Header de l'équipement */}
            <div className="mb-8">
              <div className="flex items-start gap-6 mb-6">
                <PlaceholderImage
                  width={120}
                  height={120}
                  text={equipment.category}
                  backgroundColor="#3B82F6"
                  className="rounded-lg flex-shrink-0"
                />
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={getStatusColor(equipment.status)}>
                      <span className="flex items-center gap-1">
                        {getStatusIcon(equipment.status)}
                        {getStatusLabel(equipment.status)}
                      </span>
                    </Badge>
                    <Badge variant="outline">{equipment.category}</Badge>
                    {equipment.certificationRequired && (
                      <Badge className="bg-purple-100 text-purple-800">
                        <Shield className="w-3 h-3 mr-1" />
                        Certification requise
                      </Badge>
                    )}
                  </div>
                  
                  <h1 className="text-3xl font-bold mb-2">{equipment.name}</h1>
                  <p className="text-lg text-muted-foreground mb-4">{equipment.description}</p>
                  
                  <div className="flex items-center gap-6 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {equipment.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Wrench className="w-4 h-4" />
                      {equipment.manufacturer} {equipment.model}
                    </div>
                    <div className="flex items-center gap-1">
                      <Activity className="w-4 h-4" />
                      {equipment.usage.totalHours}h d'utilisation
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${i < Math.floor(equipment.ratings.average) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {equipment.ratings.average} ({equipment.ratings.total} avis)
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    {equipment.status === 'available' && (
                      <Button asChild size="lg">
                        <Link to={`/lab/equipment/${equipment.id}/reserve`}>
                          <Calendar className="w-4 h-4 mr-2" />
                          Réserver maintenant
                        </Link>
                      </Button>
                    )}
                    
                    {equipment.certificationRequired && (
                      <Button asChild variant="outline">
                        <Link to={`/lab/certifications/${equipment.certification.name}`}>
                          <Award className="w-4 h-4 mr-2" />
                          Obtenir la certification
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Onglets */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="overview">Aperçu</TabsTrigger>
                <TabsTrigger value="specs">Spécifications</TabsTrigger>
                <TabsTrigger value="schedule">Planning</TabsTrigger>
                <TabsTrigger value="projects">Projets</TabsTrigger>
                <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
                <TabsTrigger value="reviews">Avis</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6">
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Description détaillée</CardTitle>
                    </CardHeader>
                    <CardContent className="prose max-w-none">
                      <p className="whitespace-pre-line">{equipment.longDescription}</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Statistiques d'utilisation</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">{equipment.usage.totalHours}h</div>
                          <div className="text-sm text-muted-foreground">Total utilisé</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">{equipment.usage.thisMonth}h</div>
                          <div className="text-sm text-muted-foreground">Ce mois</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-600">{equipment.usage.averageSession}h</div>
                          <div className="text-sm text-muted-foreground">Session moyenne</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-orange-600">{equipment.currentReservations.length}</div>
                          <div className="text-sm text-muted-foreground">Réservations</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Ressources et documentation</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {equipment.resources.map((resource, index) => (
                          <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center gap-3">
                              {resource.type === 'Video' ? (
                                <Video className="w-5 h-5 text-red-500" />
                              ) : (
                                <FileText className="w-5 h-5 text-blue-500" />
                              )}
                              <div>
                                <div className="font-medium text-sm">{resource.name}</div>
                                <div className="text-xs text-muted-foreground">{resource.type}</div>
                              </div>
                            </div>
                            <Button size="sm" variant="outline">
                              <Download className="w-3 h-3 mr-1" />
                              {resource.type === 'Video' ? 'Voir' : 'Télécharger'}
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="specs" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Spécifications techniques</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(equipment.specifications).map(([key, value]) => (
                        <div key={key} className="flex justify-between p-3 border rounded-lg">
                          <span className="font-medium text-sm">{key}:</span>
                          <span className="text-sm text-muted-foreground">{value}</span>
                        </div>
                      ))}
                    </div>
                    
                    <Separator className="my-6" />
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                      <div>
                        <div className="text-lg font-bold">{equipment.serialNumber}</div>
                        <div className="text-sm text-muted-foreground">N° de série</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold">
                          {new Date(equipment.acquisitionDate).getFullYear()}
                        </div>
                        <div className="text-sm text-muted-foreground">Année d'acquisition</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold">
                          {new Date(equipment.warrantyExpiry).toLocaleDateString('fr-FR')}
                        </div>
                        <div className="text-sm text-muted-foreground">Fin de garantie</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold">
                          {new Date(equipment.nextMaintenance).toLocaleDateString('fr-FR')}
                        </div>
                        <div className="text-sm text-muted-foreground">Prochaine maintenance</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="schedule" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Réservations actuelles</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {equipment.currentReservations.map((reservation, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-4">
                            <div className="text-center">
                              <div className="font-medium">
                                {new Date(reservation.date).toLocaleDateString('fr-FR', { 
                                  weekday: 'short', 
                                  day: 'numeric', 
                                  month: 'short' 
                                })}
                              </div>
                              <div className="text-sm text-muted-foreground">{reservation.time}</div>
                            </div>
                            <div>
                              <div className="font-medium">{reservation.user}</div>
                              <div className="text-sm text-muted-foreground">{reservation.project}</div>
                            </div>
                          </div>
                          <Badge variant="outline">Confirmé</Badge>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-medium mb-2">Créneaux populaires</h4>
                      <div className="flex flex-wrap gap-2">
                        {equipment.usage.popularTimes.map(time => (
                          <Badge key={time} variant="secondary">{time}</Badge>
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        Jours les plus chargés: {equipment.usage.busyDays.join(', ')}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="projects" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Projets réalisés avec cet équipement</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {equipment.projects.map(project => (
                        <div key={project.id} className="border rounded-lg p-4">
                          <div className="flex items-start gap-3">
                            <PlaceholderImage
                              width={60}
                              height={60}
                              text="3D"
                              backgroundColor="#10B981"
                              className="rounded flex-shrink-0"
                            />
                            <div className="flex-1">
                              <h4 className="font-medium mb-1">{project.name}</h4>
                              <p className="text-sm text-muted-foreground mb-2">Par {project.user}</p>
                              <div className="flex items-center gap-2">
                                <Button size="sm" variant="outline">Voir projet</Button>
                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                  <Eye className="w-3 h-3" />
                                  {project.likes}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="maintenance" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Historique de maintenance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {equipment.maintenanceHistory.map((maintenance, index) => (
                        <div key={index} className="flex gap-4 p-4 border rounded-lg">
                          <div className="flex flex-col items-center">
                            <Wrench className="w-5 h-5 text-blue-500" />
                            {index < equipment.maintenanceHistory.length - 1 && (
                              <div className="w-px h-12 bg-border mt-2" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium">{maintenance.type}</span>
                              <Badge variant="secondary" className="text-xs">
                                {new Date(maintenance.date).toLocaleDateString('fr-FR')}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-1">
                              Par {maintenance.technician}
                            </p>
                            <p className="text-sm">{maintenance.notes}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews" className="mt-6">
                <div className="space-y-6">
                  {equipment.reviews.map(review => (
                    <Card key={review.id}>
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <AvatarPlaceholder name={review.user.name} size={40} />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-medium">{review.user.name}</span>
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <Star 
                                    key={i} 
                                    className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-muted-foreground">
                                {new Date(review.date).toLocaleDateString('fr-FR')}
                              </span>
                            </div>
                            <p className="text-muted-foreground mb-3">{review.comment}</p>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <button className="flex items-center gap-1 hover:text-primary">
                                <TrendingUp className="w-4 h-4" />
                                Utile ({review.helpful})
                              </button>
                              <button className="flex items-center gap-1 hover:text-primary">
                                <MessageCircle className="w-4 h-4" />
                                Répondre
                              </button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-6">
              {/* Statut et actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Réservation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <Badge className={getStatusColor(equipment.status)} size="lg">
                        <span className="flex items-center gap-1">
                          {getStatusIcon(equipment.status)}
                          {getStatusLabel(equipment.status)}
                        </span>
                      </Badge>
                    </div>
                    
                    {equipment.status === 'available' && (
                      <>
                        <Button asChild className="w-full" size="lg">
                          <Link to={`/lab/equipment/${equipment.id}/reserve`}>
                            <Calendar className="w-4 h-4 mr-2" />
                            Réserver
                          </Link>
                        </Button>
                        
                        <div className="text-sm text-muted-foreground text-center">
                          Réservation jusqu'à {equipment.maxReservationHours}h
                          <br />
                          {equipment.advanceBookingDays} jours à l'avance max
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Tarification */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Tarification
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Frais de setup:</span>
                    <span className="font-medium">{equipment.pricing.setupFee.toLocaleString()} {equipment.pricing.currency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tarif/heure:</span>
                    <span className="font-medium">{equipment.pricing.hourlyRate.toLocaleString()} {equipment.pricing.currency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Matériau/g:</span>
                    <span className="font-medium">{equipment.pricing.materialCost.toLocaleString()} {equipment.pricing.currency}</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Réductions:</div>
                    <div className="text-xs space-y-1">
                      <div className="flex justify-between">
                        <span>Étudiants:</span>
                        <span className="text-green-600">-{equipment.pricing.discounts.student}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Membres premium:</span>
                        <span className="text-green-600">-{equipment.pricing.discounts.member}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>+10h/mois:</span>
                        <span className="text-green-600">-{equipment.pricing.discounts.bulk}%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 rounded p-3 text-sm">
                    <div className="font-medium mb-1">Exemple (3h, étudiant):</div>
                    <div className="text-muted-foreground">
                      {calculateCost(3, true).toLocaleString()} {equipment.pricing.currency}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Certification */}
              {equipment.certificationRequired && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      Certification
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertCircle className="w-4 h-4 text-orange-600" />
                          <span className="font-medium text-orange-800">Certification requise</span>
                        </div>
                        <p className="text-sm text-orange-700">
                          Vous devez obtenir la certification avant de pouvoir utiliser cet équipement.
                        </p>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Formation:</span>
                          <span>{equipment.certification.duration}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Coût:</span>
                          <span>{equipment.certification.cost.toLocaleString()} BIF</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Prochaine session:</span>
                          <span>{new Date(equipment.certification.nextSession).toLocaleDateString('fr-FR')}</span>
                        </div>
                      </div>
                      
                      <Button asChild className="w-full">
                        <Link to={`/lab/certifications/${equipment.certification.name}`}>
                          <Award className="w-4 h-4 mr-2" />
                          S'inscrire à la formation
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Contact */}
              <Card>
                <CardHeader>
                  <CardTitle>Besoin d'aide ?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Contacter le Fab Manager
                  </Button>
                  <Button variant="outline" className="w-full">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Guide d'utilisation
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Settings className="w-4 h-4 mr-2" />
                    Signaler un problème
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EquipmentDetail
