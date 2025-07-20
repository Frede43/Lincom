import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Users, MessageSquare, BookOpen, Calendar, Star, DollarSign, Clock, CheckCircle, UserPlus } from "lucide-react";

const MentorDashboard = () => {
  const activeMentees = [
    {
      name: "Marie UWIMANA",
      goal: "Créer app e-commerce", 
      nextSession: "Aujourd'hui 16h",
      progress: 80,
      avatar: "MU"
    },
    {
      name: "Paul NDAYISENGA",
      goal: "Apprendre Python",
      nextSession: "Demain 10h", 
      progress: 60,
      avatar: "PN"
    }
  ];

  const newRequests = [
    {
      name: "Jean HAKIZIMANA",
      request: "Aide pour startup fintech",
      time: "il y a 2h",
      avatar: "JH"
    },
    {
      name: "Sara NIYONKURU", 
      request: "Formation en data science",
      time: "il y a 1j",
      avatar: "SN"
    }
  ];

  const createdCourses = [
    {
      title: "Python pour Entrepreneurs",
      students: 156,
      rating: 4.8,
      revenue: 1240
    },
    {
      title: "Startup 101",
      students: 89,
      rating: 4.6, 
      revenue: 890
    }
  ];

  const weekSchedule = [
    {
      day: "Lundi 15/03",
      sessions: [
        { time: "14h-15h", student: "Marie U.", topic: "App e-commerce" },
        { time: "16h-17h", student: "Paul N.", topic: "Python basics" }
      ]
    },
    {
      day: "Mardi 16/03",
      sessions: [
        { time: "10h-11h", student: "Jean H.", topic: "Fintech" },
        { time: "15h-16h", student: "Workshop", topic: "Pitch Perfect" }
      ]
    }
  ];

  return (
    <div className="bg-background">
      {/* Header */}
      <div className="bg-gradient-hero text-white p-6">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2 flex items-center">
                <Users className="mr-3" />
                Tableau de bord Mentor
              </h1>
              <p className="text-white/90">Accompagnez la prochaine génération d'innovateurs</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-white/80">Mentees actifs</div>
              <div className="text-3xl font-bold">8</div>
            </div>
          </div>
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white/10 rounded-lg p-3">
              <div className="text-sm text-white/80">Impact total</div>
              <div className="text-xl font-bold">156 heures</div>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <div className="text-sm text-white/80">Note moyenne</div>
              <div className="text-xl font-bold flex items-center">
                4.9 <Star className="h-4 w-4 ml-1 fill-current" />
              </div>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <div className="text-sm text-white/80">Revenus</div>
              <div className="text-xl font-bold">$2,130</div>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <div className="text-sm text-white/80">Sessions ce mois</div>
              <div className="text-xl font-bold">24</div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Section 1: Mentees actifs */}
          <div className="bg-card rounded-xl shadow-card border border-border p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <Users className="h-6 w-6 text-primary mr-2" />
                <h2 className="text-xl font-bold">Mentees actifs (8)</h2>
              </div>
            </div>
            
            <div className="space-y-4">
              {activeMentees.map((mentee, index) => (
                <div key={index} className="border border-border rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mr-3">
                      <span className="text-white font-bold">{mentee.avatar}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{mentee.name}</h3>
                      <p className="text-sm text-muted-foreground flex items-center">
                        <div className="w-2 h-2 bg-secondary rounded-full mr-1"></div>
                        {mentee.goal}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progression</span>
                      <span>{mentee.progress}%</span>
                    </div>
                    <Progress value={mentee.progress} className="h-2" />
                  </div>
                  
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-muted-foreground flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {mentee.nextSession}
                    </span>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      Voir profil
                    </Button>
                    <Button variant="secondary" size="sm" className="flex-1">
                      Préparer session
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            <Button variant="ghost" className="w-full mt-4">
              Voir tous les mentees
            </Button>
          </div>

          {/* Section 2: Demandes de mentorat */}
          <div className="bg-card rounded-xl shadow-card border border-border p-6">
            <div className="flex items-center mb-6">
              <MessageSquare className="h-6 w-6 text-secondary mr-2" />
              <h2 className="text-xl font-bold">Nouvelles demandes (3)</h2>
            </div>
            
            <div className="space-y-4">
              {newRequests.map((request, index) => (
                <div key={index} className="border border-border rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mr-3">
                      <span className="text-white font-bold">{request.avatar}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{request.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        "{request.request}"
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Demandé {request.time}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button variant="cta" size="sm" className="flex-1">
                      Accepter
                    </Button>
                    <Button variant="outline" size="sm">
                      Voir profil
                    </Button>
                    <Button variant="ghost" size="sm">
                      Refuser
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            <Button variant="ghost" className="w-full mt-4">
              Voir toutes les demandes
            </Button>
          </div>

          {/* Section 3: Planning */}
          <div className="bg-card rounded-xl shadow-card border border-border p-6">
            <div className="flex items-center mb-6">
              <Calendar className="h-6 w-6 text-accent mr-2" />
              <h2 className="text-xl font-bold">Planning de la semaine</h2>
            </div>
            
            <div className="space-y-4">
              {weekSchedule.map((day, index) => (
                <div key={index} className="border-l-4 border-primary pl-4">
                  <h3 className="font-semibold mb-2">{day.day}</h3>
                  <div className="space-y-2">
                    {day.sessions.map((session, sessionIndex) => (
                      <div key={sessionIndex} className="bg-muted/30 rounded p-2">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-1 text-primary" />
                            <span className="font-medium">{session.time}</span>
                          </div>
                        </div>
                        <p className="text-sm mt-1">
                          <span className="font-medium">{session.student}</span> - {session.topic}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            <Button variant="outline" className="w-full mt-4">
              Voir planning complet
            </Button>
          </div>
        </div>

        {/* Section 4: Mes contenus */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Cours créés */}
          <div className="bg-card rounded-xl shadow-card border border-border p-6">
            <div className="flex items-center mb-6">
              <BookOpen className="h-6 w-6 text-primary mr-2" />
              <h2 className="text-xl font-bold">Mes cours créés</h2>
            </div>
            
            <div className="space-y-4">
              {createdCourses.map((course, index) => (
                <div key={index} className="border border-border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold">{course.title}</h3>
                    <div className="text-right">
                      <div className="text-sm font-medium text-green-600">
                        ${course.revenue}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Users className="h-3 w-3 mr-1" />
                      {course.students} inscrits
                    </div>
                    <div className="flex items-center">
                      <Star className="h-3 w-3 mr-1 fill-current text-yellow-400" />
                      {course.rating}/5
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex space-x-2 mt-6">
              <Button variant="cta" className="flex-1">
                Créer nouveau cours
              </Button>
              <Button variant="outline" className="flex-1">
                Analytics
              </Button>
            </div>
          </div>

          {/* Statistiques & Insights */}
          <div className="space-y-6">
            {/* Évaluations récentes */}
            <div className="bg-card rounded-xl shadow-card border border-border p-6">
              <div className="flex items-center mb-4">
                <Star className="h-6 w-6 text-accent mr-2" />
                <h3 className="font-bold">Évaluations récentes</h3>
              </div>
              
              <div className="space-y-3">
                <div className="border-l-4 border-primary pl-3">
                  <div className="flex items-center mb-1">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-current" />
                      ))}
                    </div>
                    <span className="text-sm ml-2 text-muted-foreground">Marie U.</span>
                  </div>
                  <p className="text-sm">"Excellent mentor, très disponible et pédagogue"</p>
                </div>
                
                <div className="border-l-4 border-secondary pl-3">
                  <div className="flex items-center mb-1">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-current" />
                      ))}
                    </div>
                    <span className="text-sm ml-2 text-muted-foreground">Paul N.</span>
                  </div>
                  <p className="text-sm">"M'a aidé à comprendre des concepts complexes"</p>
                </div>
              </div>
            </div>

            {/* Impact mensuel */}
            <div className="bg-card rounded-xl shadow-card border border-border p-6">
              <div className="flex items-center mb-4">
                <CheckCircle className="h-6 w-6 text-green-500 mr-2" />
                <h3 className="font-bold">Impact ce mois</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">24</div>
                  <p className="text-xs text-muted-foreground">Sessions mentorat</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-secondary">48h</div>
                  <p className="text-xs text-muted-foreground">Temps d'accompagnement</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent">6</div>
                  <p className="text-xs text-muted-foreground">Projets soutenus</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-500">98%</div>
                  <p className="text-xs text-muted-foreground">Satisfaction</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorDashboard;