import React from 'react'
import { Link } from 'react-router-dom'
import { 
  BookOpen, Rocket, Wrench, MessageCircle, Building, Search, 
  Bell, BarChart3, Users, Calendar, Award, Zap, ArrowRight,
  CheckCircle, Star, TrendingUp
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const Home: React.FC = () => {
  const modules = [
    {
      title: 'Cours & Formations',
      description: 'Développez vos compétences avec nos formations adaptées au contexte burundais',
      icon: BookOpen,
      href: '/courses',
      color: 'bg-blue-500',
      features: ['Cours Python Agriculture', 'Entrepreneuriat Social', 'Fab Lab', 'Certifications'],
      stats: { courses: 25, students: 1250, rating: 4.8 }
    },
    {
      title: 'Projets Entrepreneuriaux',
      description: 'Découvrez et soutenez les startups innovantes du Burundi',
      icon: Rocket,
      href: '/projects',
      color: 'bg-orange-500',
      features: ['EcoFarm Solutions', 'BurundiCraft', 'HealthTech', 'Financement'],
      stats: { projects: 45, funded: 12, raised: '$98K' }
    },
    {
      title: 'Fab Lab & Équipements',
      description: 'Accédez aux outils de fabrication numérique de pointe',
      icon: Wrench,
      href: '/lab/equipment',
      color: 'bg-purple-500',
      features: ['Impression 3D', 'Découpe Laser', 'Arduino', 'Réservations'],
      stats: { equipment: 15, reservations: 89, hours: '368h' }
    },
    {
      title: 'Forum Communautaire',
      description: 'Échangez et collaborez avec la communauté burundaise',
      icon: MessageCircle,
      href: '/forum',
      color: 'bg-indigo-500',
      features: ['Discussions Tech', 'Entraide', 'Mentors', 'Événements'],
      stats: { topics: 514, messages: 3576, members: 1234 }
    },
    {
      title: 'Organisations Partenaires',
      description: 'Notre réseau de partenaires qui soutiennent l\'innovation',
      icon: Building,
      href: '/organizations',
      color: 'bg-green-500',
      features: ['Université du Burundi', 'MIT Fab Foundation', 'USAID', 'ARCT'],
      stats: { partners: 12, projects: 56, students: 1350 }
    },
    {
      title: 'Recherche Globale',
      description: 'Trouvez tout ce dont vous avez besoin dans l\'écosystème',
      icon: Search,
      href: '/search',
      color: 'bg-pink-500',
      features: ['Recherche Intelligente', 'Filtres Avancés', 'Suggestions', 'Historique'],
      stats: { indexed: '10K+', searches: 2340, accuracy: '95%' }
    },
    {
      title: 'Notifications',
      description: 'Restez informé de toutes les activités',
      icon: Bell,
      href: '/notifications',
      color: 'bg-yellow-500',
      features: ['Temps Réel', 'Filtres Intelligents', 'Actions Rapides', 'Paramètres'],
      stats: { notifications: 156, unread: 12, types: 8 }
    },
    {
      title: 'Dashboard Analytics',
      description: 'Tableaux de bord et métriques de performance',
      icon: BarChart3,
      href: '/dashboard',
      color: 'bg-red-500',
      features: ['Métriques Temps Réel', 'Rapports', 'KPIs', 'Visualisations'],
      stats: { dashboards: 4, metrics: 50, users: 890 }
    }
  ]

  const quickStats = [
    { label: 'Utilisateurs Actifs', value: '1,234', icon: Users, color: 'text-blue-600' },
    { label: 'Projets Lancés', value: '45', icon: Rocket, color: 'text-orange-600' },
    { label: 'Cours Disponibles', value: '25', icon: BookOpen, color: 'text-green-600' },
    { label: 'Partenaires', value: '12', icon: Building, color: 'text-purple-600' }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-orange-500 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mr-4">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-5xl font-bold">
                Community Laboratory Burundi
              </h1>
            </div>
            
            <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
              Plateforme d'innovation complète pour développer l'écosystème technologique et entrepreneurial du Burundi. 
              Formez-vous, innovez, collaborez et transformez vos idées en réalité.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <Badge className="bg-white/20 text-white px-4 py-2 text-sm">
                <CheckCircle className="w-4 h-4 mr-2" />
                100% Gratuit
              </Badge>
              <Badge className="bg-white/20 text-white px-4 py-2 text-sm">
                <Star className="w-4 h-4 mr-2" />
                Certifié MIT
              </Badge>
              <Badge className="bg-white/20 text-white px-4 py-2 text-sm">
                <TrendingUp className="w-4 h-4 mr-2" />
                Impact Local
              </Badge>
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-white/90">
                <Link to="/courses">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Commencer à Apprendre
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <Link to="/projects">
                  <Rocket className="w-5 h-5 mr-2" />
                  Explorer les Projets
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="py-12 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {quickStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-background mb-3 ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modules Grid */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Explorez Tous Nos Modules</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Découvrez toutes les fonctionnalités de notre plateforme d'innovation. 
              Chaque module est conçu pour vous accompagner dans votre parcours entrepreneurial.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {modules.map((module, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 ${module.color} rounded-lg flex items-center justify-center`}>
                      <module.icon className="w-5 h-5 text-white" />
                    </div>
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                      {module.title}
                    </CardTitle>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {module.description}
                  </p>
                </CardHeader>

                <CardContent className="pt-0">
                  {/* Features */}
                  <div className="space-y-2 mb-4">
                    {module.features.slice(0, 3).map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <CheckCircle className="w-3 h-3 text-green-500" />
                        {feature}
                      </div>
                    ))}
                    {module.features.length > 3 && (
                      <div className="text-xs text-muted-foreground">
                        +{module.features.length - 3} autres fonctionnalités
                      </div>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                    {Object.entries(module.stats).map(([key, value], idx) => (
                      <div key={idx}>
                        <div className="text-sm font-bold text-primary">{value}</div>
                        <div className="text-xs text-muted-foreground capitalize">{key}</div>
                      </div>
                    ))}
                  </div>

                  {/* Action Button */}
                  <Button asChild className="w-full" size="sm">
                    <Link to={module.href}>
                      Explorer
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-gradient-to-r from-primary to-primary/80 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Prêt à Révolutionner l'Innovation au Burundi ?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Rejoignez notre communauté d'innovateurs, entrepreneurs et makers. 
            Ensemble, construisons l'avenir technologique du Burundi.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90">
              <Link to="/signup">
                Rejoindre la Communauté
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              <Link to="/organizations">
                Devenir Partenaire
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
