import React, { useState } from 'react'
import { Bell, Check, X, Eye, Settings, Filter, Calendar, MessageCircle, Heart, UserPlus, Award, Zap, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { AvatarPlaceholder } from '@/components/ui/placeholder-image'
import { Link } from 'react-router-dom'
import { useNotifications } from '@/hooks/useNotifications'

const Notifications: React.FC = () => {
  const [filter, setFilter] = useState('all')

  // Utilisation des vraies APIs Django
  const { 
    data: notifications = [], 
    isLoading, 
    error 
  } = useNotifications({
    filter: filter !== 'all' ? filter : undefined,
  })

  // Mock data de fallback si pas de données
  const mockNotifications = [
    {
      id: '1',
      type: 'course_enrollment',
      title: 'Nouvelle inscription à votre cours',
      message: 'Marie UWIMANA s\'est inscrite au cours "Python pour l\'Agriculture"',
      timestamp: '2024-01-15T10:30:00Z',
      isRead: false,
      isImportant: true,
      avatar: null,
      actionUrl: '/courses/1'
    },
    {
      id: '2',
      type: 'project_comment',
      title: 'Nouveau commentaire sur votre projet',
      message: 'Jean NKURUNZIZA a commenté votre projet "EcoFarm Solutions"',
      timestamp: '2024-01-15T09:15:00Z',
      isRead: false,
      isImportant: false,
      avatar: null,
      actionUrl: '/projects/1'
    },
    {
      id: '3',
      type: 'forum_reply',
      title: 'Réponse à votre discussion',
      message: 'Nouvelle réponse dans "Développement durable au Burundi"',
      timestamp: '2024-01-14T16:45:00Z',
      isRead: true,
      isImportant: false,
      avatar: null,
      actionUrl: '/forum/topic/1'
    },
    {
      id: '4',
      type: 'equipment_available',
      title: 'Équipement disponible',
      message: 'L\'imprimante 3D que vous avez réservée est maintenant disponible',
      timestamp: '2024-01-14T14:20:00Z',
      isRead: true,
      isImportant: true,
      avatar: null,
      actionUrl: '/lab/equipment/1'
    },
    {
      id: '5',
      type: 'achievement',
      title: 'Nouveau badge obtenu !',
      message: 'Félicitations ! Vous avez obtenu le badge "Innovateur"',
      timestamp: '2024-01-13T11:00:00Z',
      isRead: true,
      isImportant: false,
      avatar: null,
      actionUrl: '/profile/achievements'
    }
  ]

  // Utiliser les vraies données ou les données mockées en fallback
  const displayNotifications = Array.isArray(notifications) && notifications.length > 0 ? notifications : mockNotifications

  const filteredNotifications = displayNotifications.filter(notification => {
    if (filter === 'unread') return !notification.isRead
    if (filter === 'important') return notification.isImportant
    return true
  })

  const unreadCount = displayNotifications.filter(n => !n.isRead).length
  const importantCount = displayNotifications.filter(n => n.isImportant).length

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'course_enrollment': return <Award className="w-5 h-5 text-blue-500" />
      case 'project_comment': return <MessageCircle className="w-5 h-5 text-green-500" />
      case 'forum_reply': return <MessageCircle className="w-5 h-5 text-purple-500" />
      case 'equipment_available': return <Zap className="w-5 h-5 text-orange-500" />
      case 'achievement': return <Award className="w-5 h-5 text-yellow-500" />
      case 'like': return <Heart className="w-5 h-5 text-red-500" />
      case 'follow': return <UserPlus className="w-5 h-5 text-indigo-500" />
      default: return <Bell className="w-5 h-5 text-gray-500" />
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'À l\'instant'
    if (diffInHours < 24) return `Il y a ${diffInHours}h`
    if (diffInHours < 48) return 'Hier'
    return date.toLocaleDateString('fr-FR')
  }

  const markAsRead = (id: string) => {
    console.log('Mark as read:', id)
  }

  const markAllAsRead = () => {
    console.log('Mark all as read')
  }

  const deleteNotification = (id: string) => {
    console.log('Delete notification:', id)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4 flex items-center justify-center">
              <Bell className="mr-3" />
              Centre de Notifications
            </h1>
            <p className="text-xl opacity-90 mb-6">
              Restez informé de toutes les activités importantes
            </p>
            
            {/* Statistiques rapides */}
            <div className="flex justify-center gap-8">
              <div className="text-center">
                <div className="text-2xl font-bold">{unreadCount}</div>
                <div className="text-sm opacity-75">Non lues</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{importantCount}</div>
                <div className="text-sm opacity-75">Importantes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{displayNotifications.length}</div>
                <div className="text-sm opacity-75">Total</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contenu principal */}
            <div className="lg:col-span-2">
              {/* Filtres et actions */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-muted-foreground" />
                  <Tabs value={filter} onValueChange={setFilter} className="w-auto">
                    <TabsList>
                      <TabsTrigger value="all">Toutes ({displayNotifications.length})</TabsTrigger>
                      <TabsTrigger value="unread">Non lues ({unreadCount})</TabsTrigger>
                      <TabsTrigger value="important">Importantes ({importantCount})</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={markAllAsRead}>
                    <Check className="w-4 h-4 mr-2" />
                    Tout marquer comme lu
                  </Button>
                  <Button asChild variant="outline" size="sm">
                    <Link to="/notifications/settings">
                      <Settings className="w-4 h-4 mr-2" />
                      Paramètres
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Gestion du loading */}
              {isLoading && (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
                  <span className="ml-2 text-lg">Chargement des notifications...</span>
                </div>
              )}

              {/* Gestion des erreurs */}
              {error && (
                <div className="text-center py-12">
                  <div className="text-red-500 mb-4">
                    ❌ Erreur lors du chargement des notifications
                  </div>
                  <p className="text-muted-foreground">
                    {error.message || 'Une erreur est survenue'}
                  </p>
                </div>
              )}

              {/* Liste des notifications */}
              {!isLoading && !error && (
                <div className="space-y-4">
                  {filteredNotifications.map(notification => (
                    <Card key={notification.id} className={`transition-all duration-300 hover:shadow-md ${
                      !notification.isRead ? 'border-l-4 border-l-blue-500 bg-blue-50/50' : ''
                    }`}>
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0">
                            {getNotificationIcon(notification.type)}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <h3 className={`font-semibold mb-1 ${
                                  !notification.isRead ? 'text-foreground' : 'text-muted-foreground'
                                }`}>
                                  {notification.title}
                                  {notification.isImportant && (
                                    <Badge variant="destructive" className="ml-2 text-xs">Important</Badge>
                                  )}
                                </h3>
                                <p className="text-muted-foreground mb-2">{notification.message}</p>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                  <div className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {formatTimestamp(notification.timestamp)}
                                  </div>
                                  {!notification.isRead && (
                                    <Badge variant="secondary" className="text-xs">Nouveau</Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                            
                            {/* Actions */}
                            <div className="flex items-center gap-2 mt-4">
                              {notification.actionUrl && (
                                <Button asChild variant="outline" size="sm">
                                  <Link to={notification.actionUrl}>
                                    <Eye className="w-3 h-3 mr-1" />
                                    Voir
                                  </Link>
                                </Button>
                              )}
                              {!notification.isRead && (
                                <Button variant="ghost" size="sm" onClick={() => markAsRead(notification.id)}>
                                  <Check className="w-3 h-3 mr-1" />
                                  Marquer comme lu
                                </Button>
                              )}
                              <Button variant="ghost" size="sm" onClick={() => deleteNotification(notification.id)}>
                                <X className="w-3 h-3 mr-1" />
                                Supprimer
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {/* Message si aucune notification */}
                  {filteredNotifications.length === 0 && (
                    <div className="text-center py-12">
                      <Bell className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">Aucune notification</h3>
                      <p className="text-muted-foreground">
                        {filter === 'all' ? 
                          'Vous êtes à jour ! Revenez plus tard pour voir les nouvelles activités.' :
                          'Changez de filtre pour voir d\'autres notifications.'
                        }
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-4 space-y-6">
                {/* Paramètres rapides */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Paramètres rapides</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Notifications par email</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Notifications push</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Notifications importantes uniquement</span>
                      <Switch />
                    </div>
                  </CardContent>
                </Card>

                {/* Raccourcis */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Raccourcis</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button asChild variant="ghost" className="w-full justify-start">
                      <Link to="/courses">
                        <Award className="w-4 h-4 mr-2" />
                        Mes cours
                      </Link>
                    </Button>
                    <Button asChild variant="ghost" className="w-full justify-start">
                      <Link to="/projects">
                        <Zap className="w-4 h-4 mr-2" />
                        Mes projets
                      </Link>
                    </Button>
                    <Button asChild variant="ghost" className="w-full justify-start">
                      <Link to="/forum">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Forum
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Notifications
