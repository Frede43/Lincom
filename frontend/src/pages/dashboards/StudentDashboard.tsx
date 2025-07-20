import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Clock, Star, Users, Calendar, MessageCircle, Wrench, Award } from "lucide-react";

const StudentDashboard = () => {
  const currentCourses = [
    {
      title: "Python pour Débutants",
      progress: 80,
      timeLeft: "2h restantes",
      icon: "🐍"
    },
    {
      title: "Entrepreneuriat Digital",
      progress: 30,
      timeLeft: "8h restantes", 
      icon: "🚀"
    }
  ];

  const recentActivities = [
    {
      type: "quiz",
      title: "Quiz \"Variables Python\" complété",
      score: "18/20",
      time: "il y a 2h",
      icon: Star
    },
    {
      type: "session",
      title: "Session mentorat avec Jean K.",
      details: "Programmée pour demain 14h",
      time: "",
      icon: Users
    },
    {
      type: "course",
      title: "Nouveau cours disponible",
      details: "\"Design Thinking\" ajouté",
      time: "",
      icon: BookOpen
    }
  ];

  const projects = [
    {
      title: "App Mobile Météo",
      progress: 80,
      collaborators: 2,
      icon: "📱"
    },
    {
      title: "Chatbot Service Client", 
      progress: 30,
      collaborators: 0,
      icon: "🤖"
    }
  ];

  return (
    <div className="bg-background">
      {/* Header */}
      <div className="bg-gradient-hero text-white p-6">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold mb-2">
            Bon retour, Marie ! 👋
          </h1>
          <p className="text-white/90">
            Continuez votre parcours d'apprentissage
          </p>
          <div className="mt-4 bg-white/10 rounded-lg p-3 inline-block">
            <div className="text-sm mb-1">Progression globale</div>
            <div className="flex items-center space-x-3">
              <Progress value={65} className="w-32" />
              <span className="font-semibold">65%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Section 1: Formations en cours */}
          <div className="bg-card rounded-xl shadow-card border border-border p-6">
            <div className="flex items-center mb-6">
              <BookOpen className="h-6 w-6 text-primary mr-2" />
              <h2 className="text-xl font-bold">Cours en cours</h2>
            </div>
            
            <div className="space-y-4">
              {currentCourses.map((course, index) => (
                <div key={index} className="border border-border rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <span className="text-2xl mr-3">{course.icon}</span>
                    <h3 className="font-semibold">{course.title}</h3>
                  </div>
                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span>{course.progress}%</span>
                      <span className="text-muted-foreground flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {course.timeLeft}
                      </span>
                    </div>
                    <Progress value={course.progress} className="h-2" />
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    Continuer
                  </Button>
                </div>
              ))}
            </div>
            
            <Button variant="ghost" className="w-full mt-4">
              Voir tous mes cours
            </Button>
          </div>

          {/* Section 2: Activités récentes */}
          <div className="bg-card rounded-xl shadow-card border border-border p-6">
            <div className="flex items-center mb-6">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              <h2 className="text-xl font-bold">Activités récentes</h2>
            </div>
            
            <div className="space-y-4">
              {recentActivities.map((activity, index) => {
                const Icon = activity.icon;
                return (
                  <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50">
                    <Icon className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{activity.title}</p>
                      {activity.score && (
                        <p className="text-green-600 text-sm font-medium">
                          ⭐ {activity.score}
                        </p>
                      )}
                      {activity.details && (
                        <p className="text-muted-foreground text-sm">
                          📅 {activity.details}
                        </p>
                      )}
                      {activity.time && (
                        <p className="text-muted-foreground text-xs">
                          {activity.time}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            
            <Button variant="ghost" className="w-full mt-4">
              Voir toutes les activités
            </Button>
          </div>

          {/* Section 3: Mentorat & Communauté */}
          <div className="bg-card rounded-xl shadow-card border border-border p-6">
            <div className="flex items-center mb-6">
              <Users className="h-6 w-6 text-secondary mr-2" />
              <h2 className="text-xl font-bold">Mon mentorat</h2>
            </div>
            
            <div className="bg-gradient-to-r from-secondary/10 to-accent/10 rounded-lg p-4 mb-4">
              <div className="flex items-center mb-3">
                <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mr-3">
                  <span className="text-white font-bold">JN</span>
                </div>
                <div>
                  <h3 className="font-semibold">Jean NKURUNZIZA</h3>
                  <p className="text-sm text-muted-foreground">Expert Python & IA</p>
                </div>
              </div>
              <p className="text-sm mb-3 flex items-center">
                <Calendar className="h-4 w-4 mr-1 text-primary" />
                Prochaine session: Demain 14h
              </p>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="flex-1">
                  Voir profil
                </Button>
                <Button variant="secondary" size="sm" className="flex-1">
                  Contacter
                </Button>
              </div>
            </div>
            
            <div className="border-t border-border pt-4">
              <div className="flex items-center mb-3">
                <MessageCircle className="h-5 w-5 text-accent mr-2" />
                <h3 className="font-semibold">Discussions récentes</h3>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">
                  • "Aide avec les boucles Python"
                </div>
                <div className="text-sm text-muted-foreground">
                  • "Projet de fin de cours"
                </div>
              </div>
              <Button variant="cta" size="sm" className="w-full mt-4">
                Trouver un mentor
              </Button>
            </div>
          </div>
        </div>

        {/* Section 4: Projets & Équipements */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-card rounded-xl shadow-card border border-border p-6">
            <div className="flex items-center mb-6">
              <Wrench className="h-6 w-6 text-accent mr-2" />
              <h2 className="text-xl font-bold">Mes projets</h2>
            </div>
            
            <div className="space-y-4">
              {projects.map((project, index) => (
                <div key={index} className="border border-border rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <span className="text-2xl mr-3">{project.icon}</span>
                    <h3 className="font-semibold">{project.title}</h3>
                  </div>
                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span>{project.progress}%</span>
                      <span className="text-muted-foreground flex items-center">
                        <Users className="h-3 w-3 mr-1" />
                        {project.collaborators > 0 ? `${project.collaborators} collaborateurs` : 'Solo'}
                      </span>
                    </div>
                    <Progress value={project.progress} className="h-2" />
                  </div>
                </div>
              ))}
            </div>
            
            <Button variant="cta" className="w-full mt-4">
              Créer nouveau projet
            </Button>
          </div>

          {/* Widgets supplémentaires */}
          <div className="space-y-6">
            {/* Calendrier */}
            <div className="bg-card rounded-xl shadow-card border border-border p-6">
              <div className="flex items-center mb-4">
                <Calendar className="h-6 w-6 text-primary mr-2" />
                <h3 className="font-bold">Événements à venir</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <div>
                    <p className="font-medium text-sm">Workshop React</p>
                    <p className="text-xs text-muted-foreground">Demain 16h</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-secondary rounded-full"></div>
                  <div>
                    <p className="font-medium text-sm">Pitch Competition</p>
                    <p className="text-xs text-muted-foreground">Vendredi 14h</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Badges */}
            <div className="bg-card rounded-xl shadow-card border border-border p-6">
              <div className="flex items-center mb-4">
                <Award className="h-6 w-6 text-accent mr-2" />
                <h3 className="font-bold">Achievements</h3>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="text-center p-2">
                  <div className="text-2xl mb-1">🏆</div>
                  <p className="text-xs">First Course</p>
                </div>
                <div className="text-center p-2">
                  <div className="text-2xl mb-1">⭐</div>
                  <p className="text-xs">Top Student</p>
                </div>
                <div className="text-center p-2 opacity-50">
                  <div className="text-2xl mb-1">🚀</div>
                  <p className="text-xs">Innovator</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;