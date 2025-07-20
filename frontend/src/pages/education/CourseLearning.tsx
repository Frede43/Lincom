import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { 
  Play, Pause, SkipForward, SkipBack, Volume2, Settings, 
  CheckCircle, Lock, BookOpen, FileText, HelpCircle, 
  ArrowLeft, ArrowRight, Download, MessageCircle, Star,
  Clock, Users, Award, RotateCcw
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { AvatarPlaceholder } from '@/components/ui/placeholder-image'

const CourseLearning: React.FC = () => {
  const { courseId } = useParams()
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(245) // 4:05
  const [duration] = useState(1200) // 20:00
  const [playbackSpeed, setPlaybackSpeed] = useState(1)
  const [volume, setVolume] = useState(80)

  // Mock data - sera remplacé par les vrais hooks
  const course = {
    id: courseId,
    title: 'Python pour l\'Agriculture Intelligente',
    instructor: {
      name: 'Dr. Jean NKURUNZIZA',
      avatar: null,
      title: 'Expert en AgriTech'
    },
    progress: 35,
    currentModule: 2,
    currentLesson: 3,
    totalModules: 8,
    totalLessons: 45
  }

  const currentLesson = {
    id: '3',
    title: 'Variables et types de données en Python',
    type: 'video',
    duration: 1200, // 20 minutes
    description: 'Apprenez à utiliser les variables et les différents types de données en Python pour vos projets agricoles.',
    transcript: `Bonjour et bienvenue dans cette leçon sur les variables et types de données en Python.

Dans cette leçon, nous allons explorer comment stocker et manipuler des données dans vos programmes Python, avec des exemples concrets tirés de l'agriculture burundaise.

Une variable en Python est comme un conteneur qui stocke une valeur. Par exemple, si nous voulons stocker la température d'un champ de café à Kayanza, nous pourrions écrire :

temperature_kayanza = 22.5

Ici, "temperature_kayanza" est le nom de notre variable, et 22.5 est sa valeur en degrés Celsius.`,
    resources: [
      { name: 'Code source de la leçon', type: 'file', url: '/downloads/lesson-3-code.py' },
      { name: 'Exercices pratiques', type: 'pdf', url: '/downloads/lesson-3-exercises.pdf' },
      { name: 'Données agricoles exemple', type: 'csv', url: '/downloads/agriculture-data.csv' }
    ],
    quiz: {
      questions: 5,
      passingScore: 80,
      attempts: 3,
      timeLimit: 10
    }
  }

  const modules = [
    {
      id: '1',
      title: 'Introduction à Python et l\'AgriTech',
      lessons: [
        { id: '1', title: 'Bienvenue dans le cours', duration: 600, completed: true, type: 'video' },
        { id: '2', title: 'Installation de Python', duration: 900, completed: true, type: 'video' },
        { id: '3', title: 'Premier programme Python', duration: 1200, completed: true, type: 'video' }
      ],
      completed: true
    },
    {
      id: '2',
      title: 'Bases de Python pour l\'agriculture',
      lessons: [
        { id: '4', title: 'Variables et types de données', duration: 1200, completed: false, current: true, type: 'video' },
        { id: '5', title: 'Opérations mathématiques', duration: 900, completed: false, type: 'video' },
        { id: '6', title: 'Quiz : Bases de Python', duration: 600, completed: false, type: 'quiz' }
      ],
      completed: false,
      current: true
    },
    {
      id: '3',
      title: 'Structures de données agricoles',
      lessons: [
        { id: '7', title: 'Listes et données de récolte', duration: 1500, completed: false, type: 'video' },
        { id: '8', title: 'Dictionnaires pour les cultures', duration: 1200, completed: false, type: 'video' }
      ],
      completed: false
    }
  ]

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const changeSpeed = () => {
    const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2]
    const currentIndex = speeds.indexOf(playbackSpeed)
    const nextIndex = (currentIndex + 1) % speeds.length
    setPlaybackSpeed(speeds[nextIndex])
  }

  const goToNextLesson = () => {
    // Logique pour passer à la leçon suivante
    console.log('Next lesson')
  }

  const goToPreviousLesson = () => {
    // Logique pour revenir à la leçon précédente
    console.log('Previous lesson')
  }

  const markAsComplete = () => {
    // Logique pour marquer la leçon comme terminée
    console.log('Mark as complete')
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button asChild variant="ghost" size="sm">
                <Link to={`/courses/${courseId}`}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Retour au cours
                </Link>
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <div>
                <h1 className="font-semibold text-lg">{course.title}</h1>
                <p className="text-sm text-muted-foreground">
                  Module {course.currentModule} • Leçon {course.currentLesson} sur {course.totalLessons}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-sm text-muted-foreground">
                Progression: {course.progress}%
              </div>
              <Progress value={course.progress} className="w-32" />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Contenu principal */}
          <div className="lg:col-span-3">
            {/* Lecteur vidéo */}
            <Card className="mb-6">
              <div className="relative bg-black rounded-t-lg aspect-video flex items-center justify-center">
                <div className="text-white text-center">
                  <Play className="w-16 h-16 mx-auto mb-4 opacity-80" />
                  <p className="text-lg font-medium">{currentLesson.title}</p>
                  <p className="text-sm opacity-80">Durée: {formatTime(currentLesson.duration)}</p>
                </div>
                
                {/* Overlay de contrôles */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <div className="flex items-center gap-4 text-white">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={togglePlayPause}
                      className="text-white hover:bg-white/20"
                    >
                      {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    </Button>
                    
                    <div className="flex-1">
                      <div className="bg-white/30 rounded-full h-1 mb-2">
                        <div 
                          className="bg-white rounded-full h-1 transition-all"
                          style={{ width: `${(currentTime / duration) * 100}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs">
                        <span>{formatTime(currentTime)}</span>
                        <span>{formatTime(duration)}</span>
                      </div>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={changeSpeed}
                      className="text-white hover:bg-white/20 text-xs"
                    >
                      {playbackSpeed}x
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white hover:bg-white/20"
                    >
                      <Volume2 className="w-4 h-4" />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white hover:bg-white/20"
                    >
                      <Settings className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            {/* Navigation leçons */}
            <div className="flex items-center justify-between mb-6">
              <Button onClick={goToPreviousLesson} variant="outline">
                <SkipBack className="w-4 h-4 mr-2" />
                Leçon précédente
              </Button>
              
              <Button onClick={markAsComplete} className="bg-green-600 hover:bg-green-700">
                <CheckCircle className="w-4 h-4 mr-2" />
                Marquer comme terminée
              </Button>
              
              <Button onClick={goToNextLesson}>
                Leçon suivante
                <SkipForward className="w-4 h-4 ml-2" />
              </Button>
            </div>

            {/* Contenu de la leçon */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Aperçu</TabsTrigger>
                <TabsTrigger value="transcript">Transcription</TabsTrigger>
                <TabsTrigger value="resources">Ressources</TabsTrigger>
                <TabsTrigger value="quiz">Quiz</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>À propos de cette leçon</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      {currentLesson.description}
                    </p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="text-center">
                        <Clock className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                        <div className="font-semibold">{formatTime(currentLesson.duration)}</div>
                        <div className="text-sm text-muted-foreground">Durée</div>
                      </div>
                      <div className="text-center">
                        <BookOpen className="w-8 h-8 text-green-500 mx-auto mb-2" />
                        <div className="font-semibold">{currentLesson.type}</div>
                        <div className="text-sm text-muted-foreground">Type</div>
                      </div>
                      <div className="text-center">
                        <Users className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                        <div className="font-semibold">1,250</div>
                        <div className="text-sm text-muted-foreground">Étudiants</div>
                      </div>
                      <div className="text-center">
                        <Star className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                        <div className="font-semibold">4.8</div>
                        <div className="text-sm text-muted-foreground">Note</div>
                      </div>
                    </div>

                    <div className="bg-muted/50 rounded-lg p-4">
                      <h4 className="font-semibold mb-2">Objectifs de la leçon</h4>
                      <ul className="space-y-1 text-sm">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          Comprendre le concept de variables en Python
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          Maîtriser les types de données de base (int, float, string, bool)
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          Appliquer ces concepts à des données agricoles réelles
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          Créer un programme simple de gestion de données de récolte
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="transcript" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Transcription de la leçon</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose max-w-none">
                      <div className="whitespace-pre-line text-sm leading-relaxed">
                        {currentLesson.transcript}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="resources" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Ressources de la leçon</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {currentLesson.resources.map((resource, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <FileText className="w-5 h-5 text-blue-500" />
                            <div>
                              <div className="font-medium">{resource.name}</div>
                              <div className="text-sm text-muted-foreground">{resource.type.toUpperCase()}</div>
                            </div>
                          </div>
                          <Button size="sm" variant="outline">
                            <Download className="w-4 h-4 mr-2" />
                            Télécharger
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="quiz" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Quiz de la leçon</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="text-center">
                        <HelpCircle className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                        <div className="font-semibold">{currentLesson.quiz.questions}</div>
                        <div className="text-sm text-muted-foreground">Questions</div>
                      </div>
                      <div className="text-center">
                        <Award className="w-8 h-8 text-green-500 mx-auto mb-2" />
                        <div className="font-semibold">{currentLesson.quiz.passingScore}%</div>
                        <div className="text-sm text-muted-foreground">Score requis</div>
                      </div>
                      <div className="text-center">
                        <RotateCcw className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                        <div className="font-semibold">{currentLesson.quiz.attempts}</div>
                        <div className="text-sm text-muted-foreground">Tentatives</div>
                      </div>
                      <div className="text-center">
                        <Clock className="w-8 h-8 text-red-500 mx-auto mb-2" />
                        <div className="font-semibold">{currentLesson.quiz.timeLimit} min</div>
                        <div className="text-sm text-muted-foreground">Temps limite</div>
                      </div>
                    </div>

                    <div className="bg-muted/50 rounded-lg p-4 mb-4">
                      <p className="text-sm text-muted-foreground mb-2">
                        Testez vos connaissances sur les variables et types de données en Python.
                        Vous devez obtenir au moins {currentLesson.quiz.passingScore}% pour valider cette leçon.
                      </p>
                    </div>

                    <Button className="w-full">
                      <HelpCircle className="w-4 h-4 mr-2" />
                      Commencer le quiz
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar - Plan du cours */}
          <div className="lg:col-span-1">
            <div className="sticky top-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Plan du cours</CardTitle>
                  <div className="flex items-center gap-2">
                    <AvatarPlaceholder name={course.instructor.name} size={32} />
                    <div>
                      <div className="font-medium text-sm">{course.instructor.name}</div>
                      <div className="text-xs text-muted-foreground">{course.instructor.title}</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="max-h-96 overflow-y-auto">
                    {modules.map((module, moduleIndex) => (
                      <div key={module.id} className="border-b last:border-b-0">
                        <div className={`p-4 ${module.current ? 'bg-muted/50' : ''}`}>
                          <div className="flex items-center gap-2 mb-2">
                            {module.completed ? (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            ) : module.current ? (
                              <div className="w-4 h-4 border-2 border-primary rounded-full flex items-center justify-center">
                                <div className="w-2 h-2 bg-primary rounded-full" />
                              </div>
                            ) : (
                              <Lock className="w-4 h-4 text-muted-foreground" />
                            )}
                            <span className="font-medium text-sm">{module.title}</span>
                          </div>
                          
                          <div className="space-y-1 ml-6">
                            {module.lessons.map((lesson) => (
                              <div 
                                key={lesson.id}
                                className={`flex items-center justify-between p-2 rounded text-xs hover:bg-muted/50 cursor-pointer ${
                                  lesson.current ? 'bg-primary/10 text-primary' : ''
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  {lesson.completed ? (
                                    <CheckCircle className="w-3 h-3 text-green-500" />
                                  ) : lesson.current ? (
                                    <Play className="w-3 h-3 text-primary" />
                                  ) : (
                                    <div className="w-3 h-3 border border-muted-foreground rounded-full" />
                                  )}
                                  <span className="truncate">{lesson.title}</span>
                                </div>
                                <span className="text-muted-foreground">
                                  {formatTime(lesson.duration)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Notes et discussion */}
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle className="text-lg">Discussion</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full mb-3">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Poser une question
                  </Button>
                  <div className="text-sm text-muted-foreground">
                    23 questions dans cette leçon
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourseLearning
