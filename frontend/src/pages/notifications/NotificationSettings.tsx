import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  ArrowLeft, Settings, Bell, Mail, Smartphone, Volume2, 
  CheckCircle, Save, RotateCcw, Shield, Clock, Users,
  MessageCircle, Award, Calendar, Zap, AlertTriangle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'

const NotificationSettings: React.FC = () => {
  const [settings, setSettings] = useState({
    // Canaux de notification
    pushNotifications: true,
    emailNotifications: true,
    smsNotifications: false,
    soundEnabled: true,
    
    // Fréquence
    emailFrequency: 'immediate', // immediate, daily, weekly
    quietHours: {
      enabled: true,
      start: '22:00',
      end: '08:00'
    },
    
    // Types de notifications
    courses: {
      enrollment: true,
      newLesson: true,
      assignment: true,
      certificate: true
    },
    projects: {
      comments: true,
      likes: true,
      funding: true,
      updates: true
    },
    lab: {
      reservationConfirmed: true,
      reservationReminder: true,
      equipmentAvailable: false,
      maintenance: true
    },
    forum: {
      replies: true,
      mentions: true,
      newTopics: false,
      moderation: true
    },
    mentorship: {
      newRequest: true,
      sessionReminder: true,
      feedback: true,
      matching: true
    },
    system: {
      security: true,
      updates: false,
      maintenance: true,
      newsletter: false
    }
  })

  const updateSetting = (category: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value
      }
    }))
  }

  const updateGlobalSetting = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleSave = () => {
    // Logique de sauvegarde
    console.log('Paramètres sauvegardés:', settings)
    alert('Paramètres sauvegardés avec succès !')
  }

  const resetToDefaults = () => {
    if (confirm('Êtes-vous sûr de vouloir réinitialiser tous les paramètres ?')) {
      // Réinitialiser aux valeurs par défaut
      console.log('Réinitialisation des paramètres')
    }
  }

  const notificationTypes = [
    {
      category: 'courses',
      title: 'Cours & Formations',
      icon: Award,
      color: 'text-blue-500',
      items: [
        { key: 'enrollment', label: 'Nouvelles inscriptions', description: 'Quand quelqu\'un s\'inscrit à vos cours' },
        { key: 'newLesson', label: 'Nouvelles leçons', description: 'Quand une nouvelle leçon est disponible' },
        { key: 'assignment', label: 'Devoirs et quiz', description: 'Rappels pour les devoirs et quiz' },
        { key: 'certificate', label: 'Certificats', description: 'Quand vous obtenez un certificat' }
      ]
    },
    {
      category: 'projects',
      title: 'Projets',
      icon: Zap,
      color: 'text-orange-500',
      items: [
        { key: 'comments', label: 'Commentaires', description: 'Nouveaux commentaires sur vos projets' },
        { key: 'likes', label: 'Likes et réactions', description: 'Quand quelqu\'un aime votre projet' },
        { key: 'funding', label: 'Financement', description: 'Mises à jour sur le financement' },
        { key: 'updates', label: 'Mises à jour', description: 'Nouvelles des projets que vous suivez' }
      ]
    },
    {
      category: 'lab',
      title: 'Fab Lab',
      icon: Settings,
      color: 'text-purple-500',
      items: [
        { key: 'reservationConfirmed', label: 'Réservations confirmées', description: 'Confirmation de vos réservations' },
        { key: 'reservationReminder', label: 'Rappels de réservation', description: 'Rappels avant vos créneaux' },
        { key: 'equipmentAvailable', label: 'Équipement disponible', description: 'Quand un équipement devient libre' },
        { key: 'maintenance', label: 'Maintenance', description: 'Notifications de maintenance' }
      ]
    },
    {
      category: 'forum',
      title: 'Forum',
      icon: MessageCircle,
      color: 'text-indigo-500',
      items: [
        { key: 'replies', label: 'Réponses', description: 'Réponses à vos discussions' },
        { key: 'mentions', label: 'Mentions', description: 'Quand quelqu\'un vous mentionne' },
        { key: 'newTopics', label: 'Nouveaux sujets', description: 'Nouveaux sujets dans vos catégories' },
        { key: 'moderation', label: 'Modération', description: 'Actions de modération sur vos posts' }
      ]
    },
    {
      category: 'mentorship',
      title: 'Mentorat',
      icon: Users,
      color: 'text-green-500',
      items: [
        { key: 'newRequest', label: 'Nouvelles demandes', description: 'Demandes de mentorat' },
        { key: 'sessionReminder', label: 'Rappels de session', description: 'Rappels avant vos sessions' },
        { key: 'feedback', label: 'Feedback', description: 'Nouveaux commentaires et évaluations' },
        { key: 'matching', label: 'Matching', description: 'Suggestions de mentors/mentorés' }
      ]
    },
    {
      category: 'system',
      title: 'Système',
      icon: Shield,
      color: 'text-red-500',
      items: [
        { key: 'security', label: 'Sécurité', description: 'Alertes de sécurité importantes' },
        { key: 'updates', label: 'Mises à jour', description: 'Nouvelles fonctionnalités' },
        { key: 'maintenance', label: 'Maintenance', description: 'Maintenance programmée' },
        { key: 'newsletter', label: 'Newsletter', description: 'Newsletter mensuelle' }
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/notifications" className="hover:text-primary flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" />
              Notifications
            </Link>
            <span>/</span>
            <span className="text-foreground">Paramètres</span>
          </div>
        </div>
      </div>

      {/* Header de paramètres */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-2 flex items-center">
              <Settings className="mr-3" />
              Paramètres de Notifications
            </h1>
            <p className="text-xl text-white/90">
              Personnalisez vos préférences de notification pour rester informé selon vos besoins
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Contenu principal */}
            <div className="lg:col-span-3 space-y-6">
              {/* Paramètres généraux */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    Canaux de notification
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Bell className="w-5 h-5 text-blue-500" />
                        <div>
                          <Label className="font-medium">Notifications push</Label>
                          <p className="text-sm text-muted-foreground">Notifications dans le navigateur</p>
                        </div>
                      </div>
                      <Switch
                        checked={settings.pushNotifications}
                        onCheckedChange={(value) => updateGlobalSetting('pushNotifications', value)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-green-500" />
                        <div>
                          <Label className="font-medium">Notifications email</Label>
                          <p className="text-sm text-muted-foreground">Emails de notification</p>
                        </div>
                      </div>
                      <Switch
                        checked={settings.emailNotifications}
                        onCheckedChange={(value) => updateGlobalSetting('emailNotifications', value)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Smartphone className="w-5 h-5 text-purple-500" />
                        <div>
                          <Label className="font-medium">Notifications SMS</Label>
                          <p className="text-sm text-muted-foreground">Messages texte urgents</p>
                        </div>
                      </div>
                      <Switch
                        checked={settings.smsNotifications}
                        onCheckedChange={(value) => updateGlobalSetting('smsNotifications', value)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Volume2 className="w-5 h-5 text-orange-500" />
                        <div>
                          <Label className="font-medium">Sons</Label>
                          <p className="text-sm text-muted-foreground">Sons de notification</p>
                        </div>
                      </div>
                      <Switch
                        checked={settings.soundEnabled}
                        onCheckedChange={(value) => updateGlobalSetting('soundEnabled', value)}
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label className="font-medium mb-2 block">Fréquence des emails</Label>
                      <Select
                        value={settings.emailFrequency}
                        onValueChange={(value) => updateGlobalSetting('emailFrequency', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="immediate">Immédiat</SelectItem>
                          <SelectItem value="daily">Résumé quotidien</SelectItem>
                          <SelectItem value="weekly">Résumé hebdomadaire</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label className="font-medium">Heures silencieuses</Label>
                        <Switch
                          checked={settings.quietHours.enabled}
                          onCheckedChange={(value) => updateSetting('quietHours', 'enabled', value)}
                        />
                      </div>
                      {settings.quietHours.enabled && (
                        <div className="flex gap-2">
                          <Select
                            value={settings.quietHours.start}
                            onValueChange={(value) => updateSetting('quietHours', 'start', value)}
                          >
                            <SelectTrigger className="flex-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: 24 }, (_, i) => (
                                <SelectItem key={i} value={`${i.toString().padStart(2, '0')}:00`}>
                                  {`${i.toString().padStart(2, '0')}:00`}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <span className="self-center">à</span>
                          <Select
                            value={settings.quietHours.end}
                            onValueChange={(value) => updateSetting('quietHours', 'end', value)}
                          >
                            <SelectTrigger className="flex-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: 24 }, (_, i) => (
                                <SelectItem key={i} value={`${i.toString().padStart(2, '0')}:00`}>
                                  {`${i.toString().padStart(2, '0')}:00`}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Types de notifications */}
              {notificationTypes.map(type => (
                <Card key={type.category}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <type.icon className={`w-5 h-5 ${type.color}`} />
                      {type.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {type.items.map(item => (
                        <div key={item.key} className="flex items-center justify-between">
                          <div className="flex-1">
                            <Label className="font-medium">{item.label}</Label>
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                          </div>
                          <Switch
                            checked={settings[type.category as keyof typeof settings][item.key as keyof any]}
                            onCheckedChange={(value) => updateSetting(type.category, item.key, value)}
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Actions */}
              <div className="flex items-center justify-between">
                <Button variant="outline" onClick={resetToDefaults}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Réinitialiser
                </Button>
                
                <div className="flex gap-2">
                  <Button variant="outline" asChild>
                    <Link to="/notifications">Annuler</Link>
                  </Button>
                  <Button onClick={handleSave}>
                    <Save className="w-4 h-4 mr-2" />
                    Sauvegarder
                  </Button>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-4 space-y-6">
                {/* Aperçu */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Aperçu</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Push:</span>
                      <Badge variant={settings.pushNotifications ? "default" : "secondary"}>
                        {settings.pushNotifications ? 'Activé' : 'Désactivé'}
                      </Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Email:</span>
                      <Badge variant={settings.emailNotifications ? "default" : "secondary"}>
                        {settings.emailNotifications ? 'Activé' : 'Désactivé'}
                      </Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">SMS:</span>
                      <Badge variant={settings.smsNotifications ? "default" : "secondary"}>
                        {settings.smsNotifications ? 'Activé' : 'Désactivé'}
                      </Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Sons:</span>
                      <Badge variant={settings.soundEnabled ? "default" : "secondary"}>
                        {settings.soundEnabled ? 'Activé' : 'Désactivé'}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* Conseils */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5" />
                      Conseils
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm space-y-2">
                    <p>• Activez les notifications de sécurité</p>
                    <p>• Configurez les heures silencieuses</p>
                    <p>• Choisissez les types importants</p>
                    <p>• Testez vos paramètres</p>
                  </CardContent>
                </Card>

                {/* Test */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Test</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full">
                      <Bell className="w-4 h-4 mr-2" />
                      Envoyer notification test
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

export default NotificationSettings
