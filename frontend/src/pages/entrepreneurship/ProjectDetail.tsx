import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { 
  Heart, Share2, MessageCircle, Users, Calendar, MapPin, 
  DollarSign, TrendingUp, Award, Eye, ArrowLeft, ExternalLink,
  Github, Globe, Mail, Phone, Linkedin, Twitter, Plus,
  CheckCircle, Clock, AlertCircle, Target, Lightbulb
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { ProjectImagePlaceholder, AvatarPlaceholder } from '@/components/ui/placeholder-image'

const ProjectDetail: React.FC = () => {
  const { projectId } = useParams()
  const [isFollowing, setIsFollowing] = useState(false)
  const [isLiked, setIsLiked] = useState(false)

  // Mock data - sera remplacé par les vrais hooks
  const project = {
    id: projectId,
    title: 'EcoFarm Solutions',
    tagline: 'Révolutionner l\'agriculture burundaise avec l\'IoT et l\'IA',
    description: `EcoFarm Solutions est une plateforme digitale innovante qui combine Internet des Objets (IoT) et Intelligence Artificielle pour optimiser la production agricole au Burundi.

Notre solution permet aux agriculteurs de monitorer en temps réel leurs cultures, d'optimiser l'irrigation, de prédire les maladies des plantes et d'améliorer leurs rendements de manière durable.

Nous nous concentrons sur les principales cultures burundaises : café, thé, bananes, haricots et maïs, en adaptant nos algorithmes aux conditions climatiques et aux pratiques agricoles locales.`,
    
    founder: {
      id: '1',
      name: 'Marie UWIMANA',
      avatar: null,
      title: 'CEO & Fondatrice',
      bio: 'Ingénieure agronome avec 8 ans d\'expérience, passionnée par l\'innovation agricole au Burundi.',
      location: 'Bujumbura, Burundi',
      email: 'marie@ecofarm.bi',
      phone: '+257 79 123 456',
      linkedin: 'marie-uwimana',
      twitter: '@marie_uwimana'
    },
    
    team: [
      { id: '2', name: 'Jean NKURUNZIZA', role: 'CTO', avatar: null, skills: ['Python', 'IoT', 'Machine Learning'] },
      { id: '3', name: 'Paul NDAYISENGA', role: 'Lead Developer', avatar: null, skills: ['React', 'Node.js', 'MongoDB'] },
      { id: '4', name: 'Sarah NDAYISHIMIYE', role: 'Agronome', avatar: null, skills: ['Agriculture', 'Recherche', 'Analyse'] }
    ],
    
    category: 'AgriTech',
    stage: 'MVP',
    location: 'Bujumbura, Burundi',
    foundedDate: '2023-06-15',
    
    funding: {
      goal: 50000,
      raised: 15000,
      currency: 'USD',
      investors: 8,
      lastRound: 'Seed',
      nextMilestone: 25000
    },
    
    metrics: {
      followers: 156,
      views: 2340,
      likes: 89,
      comments: 23,
      shares: 12
    },
    
    milestones: [
      { id: '1', title: 'Prototype développé', date: '2023-08-15', status: 'completed', description: 'Premier prototype fonctionnel avec capteurs IoT' },
      { id: '2', title: 'Tests pilotes', date: '2023-11-30', status: 'completed', description: '10 fermes pilotes dans la région de Kayanza' },
      { id: '3', title: 'MVP lancé', date: '2024-01-15', status: 'current', description: 'Version minimale viable disponible pour 50 agriculteurs' },
      { id: '4', title: 'Levée de fonds Série A', date: '2024-06-30', status: 'upcoming', description: 'Objectif: $100K pour expansion nationale' }
    ],
    
    technologies: ['Python', 'React', 'Node.js', 'MongoDB', 'TensorFlow', 'Arduino', 'LoRaWAN', 'AWS'],
    
    links: {
      website: 'https://ecofarm.bi',
      github: 'https://github.com/ecofarm-solutions',
      demo: 'https://demo.ecofarm.bi',
      pitch: '/downloads/ecofarm-pitch.pdf'
    },
    
    tags: ['Agriculture', 'IoT', 'IA', 'Durabilité', 'Innovation', 'Burundi', 'Tech4Good'],
    
    updates: [
      {
        id: '1',
        date: '2024-01-18',
        title: 'Nouveau partenariat avec l\'Université du Burundi',
        content: 'Nous sommes ravis d\'annoncer notre partenariat avec la Faculté d\'Agronomie pour des recherches avancées.',
        author: 'Marie UWIMANA'
      },
      {
        id: '2',
        date: '2024-01-10',
        title: 'Résultats des tests pilotes',
        content: 'Les tests dans 10 fermes montrent une amélioration moyenne de 23% des rendements.',
        author: 'Sarah NDAYISHIMIYE'
      }
    ],
    
    faqs: [
      {
        question: 'Comment votre solution s\'adapte-t-elle aux petits agriculteurs ?',
        answer: 'Notre solution est conçue pour être abordable et facile à utiliser. Nous proposons des packages adaptés aux petites exploitations avec un support en kirundi.'
      },
      {
        question: 'Quels types de capteurs utilisez-vous ?',
        answer: 'Nous utilisons des capteurs d\'humidité du sol, de température, d\'humidité de l\'air, et de luminosité, tous connectés via LoRaWAN pour une longue portée.'
      }
    ]
  }

  const toggleFollow = () => {
    setIsFollowing(!isFollowing)
  }

  const toggleLike = () => {
    setIsLiked(!isLiked)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'current': return <Clock className="w-4 h-4 text-blue-500" />
      case 'upcoming': return <AlertCircle className="w-4 h-4 text-orange-500" />
      default: return <div className="w-4 h-4 border border-gray-300 rounded-full" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'current': return 'bg-blue-100 text-blue-800'
      case 'upcoming': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const fundingProgress = (project.funding.raised / project.funding.goal) * 100

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/projects" className="hover:text-primary flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" />
              Projets
            </Link>
            <span>/</span>
            <span className="text-foreground">{project.title}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contenu principal */}
          <div className="lg:col-span-2">
            {/* Header du projet */}
            <div className="mb-8">
              <div className="flex items-start gap-6 mb-6">
                <ProjectImagePlaceholder
                  title={project.title}
                  type={project.category.toLowerCase()}
                  className="w-24 h-24 rounded-lg flex-shrink-0"
                />
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-green-100 text-green-800">{project.stage}</Badge>
                    <Badge variant="outline">{project.category}</Badge>
                  </div>
                  
                  <h1 className="text-3xl font-bold mb-2">{project.title}</h1>
                  <p className="text-lg text-muted-foreground mb-4">{project.tagline}</p>
                  
                  <div className="flex items-center gap-6 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {project.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Fondé en {new Date(project.foundedDate).getFullYear()}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {project.team.length + 1} membres
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <Button onClick={toggleFollow} variant={isFollowing ? "default" : "outline"}>
                      <Heart className={`w-4 h-4 mr-2 ${isFollowing ? 'fill-current' : ''}`} />
                      {isFollowing ? 'Suivi' : 'Suivre'} ({project.metrics.followers})
                    </Button>
                    
                    <Button onClick={toggleLike} variant="outline">
                      <Heart className={`w-4 h-4 mr-2 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                      {project.metrics.likes}
                    </Button>
                    
                    <Button variant="outline">
                      <Share2 className="w-4 h-4 mr-2" />
                      Partager
                    </Button>
                    
                    <Button variant="outline">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      {project.metrics.comments}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Onglets */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview">Aperçu</TabsTrigger>
                <TabsTrigger value="team">Équipe</TabsTrigger>
                <TabsTrigger value="milestones">Jalons</TabsTrigger>
                <TabsTrigger value="updates">Actualités</TabsTrigger>
                <TabsTrigger value="faq">FAQ</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6">
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Description du projet</CardTitle>
                    </CardHeader>
                    <CardContent className="prose max-w-none">
                      <p className="whitespace-pre-line">{project.description}</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Technologies utilisées</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map(tech => (
                          <Badge key={tech} variant="secondary">{tech}</Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Liens utiles</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        {project.links.website && (
                          <Button asChild variant="outline" className="justify-start">
                            <a href={project.links.website} target="_blank" rel="noopener noreferrer">
                              <Globe className="w-4 h-4 mr-2" />
                              Site web
                            </a>
                          </Button>
                        )}
                        {project.links.github && (
                          <Button asChild variant="outline" className="justify-start">
                            <a href={project.links.github} target="_blank" rel="noopener noreferrer">
                              <Github className="w-4 h-4 mr-2" />
                              Code source
                            </a>
                          </Button>
                        )}
                        {project.links.demo && (
                          <Button asChild variant="outline" className="justify-start">
                            <a href={project.links.demo} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-4 h-4 mr-2" />
                              Démo live
                            </a>
                          </Button>
                        )}
                        {project.links.pitch && (
                          <Button asChild variant="outline" className="justify-start">
                            <a href={project.links.pitch} target="_blank" rel="noopener noreferrer">
                              <Award className="w-4 h-4 mr-2" />
                              Pitch deck
                            </a>
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="team" className="mt-6">
                <div className="space-y-6">
                  {/* Fondateur */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Fondateur</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-start gap-4">
                        <AvatarPlaceholder name={project.founder.name} size={64} />
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{project.founder.name}</h3>
                          <p className="text-muted-foreground mb-2">{project.founder.title}</p>
                          <p className="text-sm mb-4">{project.founder.bio}</p>
                          
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {project.founder.location}
                            </div>
                            <div className="flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {project.founder.email}
                            </div>
                            <div className="flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {project.founder.phone}
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Linkedin className="w-3 h-3 mr-1" />
                              LinkedIn
                            </Button>
                            <Button size="sm" variant="outline">
                              <Twitter className="w-3 h-3 mr-1" />
                              Twitter
                            </Button>
                            <Button size="sm" variant="outline">
                              <Mail className="w-3 h-3 mr-1" />
                              Contact
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Équipe */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Équipe ({project.team.length} membres)</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {project.team.map(member => (
                          <div key={member.id} className="flex items-start gap-3 p-4 border rounded-lg">
                            <AvatarPlaceholder name={member.name} size={48} />
                            <div className="flex-1">
                              <h4 className="font-medium">{member.name}</h4>
                              <p className="text-sm text-muted-foreground mb-2">{member.role}</p>
                              <div className="flex flex-wrap gap-1">
                                {member.skills.map(skill => (
                                  <Badge key={skill} variant="secondary" className="text-xs">
                                    {skill}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="milestones" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Jalons du projet</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {project.milestones.map((milestone, index) => (
                        <div key={milestone.id} className="flex gap-4">
                          <div className="flex flex-col items-center">
                            {getStatusIcon(milestone.status)}
                            {index < project.milestones.length - 1 && (
                              <div className="w-px h-12 bg-border mt-2" />
                            )}
                          </div>
                          <div className="flex-1 pb-4">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium">{milestone.title}</h4>
                              <Badge className={getStatusColor(milestone.status)}>
                                {milestone.status === 'completed' ? 'Terminé' :
                                 milestone.status === 'current' ? 'En cours' : 'À venir'}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {new Date(milestone.date).toLocaleDateString('fr-FR')}
                            </p>
                            <p className="text-sm">{milestone.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="updates" className="mt-6">
                <div className="space-y-4">
                  {project.updates.map(update => (
                    <Card key={update.id}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg">{update.title}</CardTitle>
                            <p className="text-sm text-muted-foreground">
                              Par {update.author} • {new Date(update.date).toLocaleDateString('fr-FR')}
                            </p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p>{update.content}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="faq" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Questions fréquentes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {project.faqs.map((faq, index) => (
                        <div key={index} className="border-b pb-4 last:border-b-0">
                          <h4 className="font-medium mb-2">{faq.question}</h4>
                          <p className="text-sm text-muted-foreground">{faq.answer}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-6">
              {/* Financement */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Financement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Progression</span>
                        <span>{fundingProgress.toFixed(0)}%</span>
                      </div>
                      <Progress value={fundingProgress} className="h-2" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-primary">
                          ${project.funding.raised.toLocaleString()}
                        </div>
                        <div className="text-xs text-muted-foreground">Levés</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold">
                          ${project.funding.goal.toLocaleString()}
                        </div>
                        <div className="text-xs text-muted-foreground">Objectif</div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span>{project.funding.investors} investisseurs</span>
                      <span>Tour {project.funding.lastRound}</span>
                    </div>
                    
                    <Button className="w-full">
                      <Target className="w-4 h-4 mr-2" />
                      Investir
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Métriques */}
              <Card>
                <CardHeader>
                  <CardTitle>Métriques</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Vues:</span>
                    <span className="font-medium">{project.metrics.views.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Followers:</span>
                    <span className="font-medium">{project.metrics.followers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Likes:</span>
                    <span className="font-medium">{project.metrics.likes}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Partages:</span>
                    <span className="font-medium">{project.metrics.shares}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Tags */}
              <Card>
                <CardHeader>
                  <CardTitle>Tags</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Rejoindre l'équipe
                  </Button>
                  <Button variant="outline" className="w-full">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Contacter
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Lightbulb className="w-4 h-4 mr-2" />
                    Suggérer
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

export default ProjectDetail
