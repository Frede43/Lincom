import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Rocket, TrendingUp, Users, DollarSign, Calendar, Target, BookOpen, Lightbulb, Award } from "lucide-react";

const EntrepreneurDashboard = () => {
  const startupMetrics = {
    users: { current: 150, growth: 12 },
    revenue: { current: 2400, growth: 15 },
    funding: { current: 15000, target: 50000 }
  };

  const teamMembers = [
    { name: "Marie K.", role: "CTO", status: "online" },
    { name: "Paul M.", role: "Designer", status: "online" },
    { name: "Sara L.", role: "Marketing", status: "offline" }
  ];

  const opportunities = [
    {
      title: "Concours Innovation BDI",
      deadline: "Candidature avant 15/04",
      type: "competition"
    },
    {
      title: "Pitch Night Investors",
      deadline: "25/03 - 19h00",
      type: "event"
    }
  ];

  const mentors = [
    { name: "Jean N.", expertise: "Tech & Produit" },
    { name: "Alice M.", expertise: "Business Development" }
  ];

  return (
    <div className="bg-background">
      {/* Header */}
      <div className="bg-gradient-hero text-white p-6">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2 flex items-center">
                <Rocket className="mr-3" />
                EcoFarm Solutions
              </h1>
              <p className="text-white/90">MVP en développement</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-white/80">Statut</div>
              <div className="text-lg font-semibold">Seed Stage</div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Section 1: Ma Startup */}
          <div className="lg:col-span-2 bg-card rounded-xl shadow-card border border-border p-6">
            <div className="flex items-center mb-6">
              <Rocket className="h-6 w-6 text-primary mr-2" />
              <h2 className="text-xl font-bold">Ma Startup</h2>
            </div>
            
            {/* Métriques clés */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-primary/10 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Utilisateurs</p>
                    <p className="text-2xl font-bold">{startupMetrics.users.current}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-primary" />
                </div>
                <p className="text-sm text-green-600 mt-2">
                  +{startupMetrics.users.growth} cette semaine
                </p>
              </div>
              
              <div className="bg-secondary/10 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Revenus</p>
                    <p className="text-2xl font-bold">${startupMetrics.revenue.current}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-secondary" />
                </div>
                <p className="text-sm text-green-600 mt-2">
                  +{startupMetrics.revenue.growth}%
                </p>
              </div>
              
              <div className="bg-accent/10 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Financement</p>
                    <p className="text-lg font-bold">
                      ${startupMetrics.funding.current}K/${startupMetrics.funding.target}K
                    </p>
                  </div>
                  <Target className="h-8 w-8 text-accent" />
                </div>
                <div className="mt-2">
                  <Progress 
                    value={(startupMetrics.funding.current / startupMetrics.funding.target) * 100} 
                    className="h-2" 
                  />
                  <p className="text-xs text-muted-foreground mt-1">30% complété</p>
                </div>
              </div>
            </div>

            {/* Prochaines étapes */}
            <div className="border-t border-border pt-6">
              <h3 className="font-bold mb-4 flex items-center">
                <Target className="h-5 w-5 text-primary mr-2" />
                Prochaines étapes
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>Finaliser tests utilisateurs</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                  <div className="w-2 h-2 bg-secondary rounded-full"></div>
                  <span>Préparer pitch investisseurs</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  <span>Recruter développeur senior</span>
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <Button variant="cta" className="flex-1">
                  Gérer le projet
                </Button>
                <Button variant="outline" className="flex-1">
                  Analytics
                </Button>
              </div>
            </div>
          </div>

          {/* Section 2: Équipe */}
          <div className="bg-card rounded-xl shadow-card border border-border p-6">
            <div className="flex items-center mb-6">
              <Users className="h-6 w-6 text-secondary mr-2" />
              <h2 className="text-xl font-bold">Équipe ({teamMembers.length + 1} membres)</h2>
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center space-x-3 p-3 bg-primary/10 rounded-lg">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">Moi</span>
                </div>
                <div className="flex-1">
                  <p className="font-semibold">Vous - CEO/Fondateur</p>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                    <span className="text-xs text-muted-foreground">En ligne</span>
                  </div>
                </div>
              </div>
              
              {teamMembers.map((member, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 hover:bg-muted/30 rounded-lg">
                  <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{member.name} - {member.role}</p>
                    <div className="flex items-center">
                      <div className={`w-2 h-2 rounded-full mr-1 ${
                        member.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                      }`}></div>
                      <span className="text-xs text-muted-foreground">
                        {member.status === 'online' ? 'En ligne' : 'Hors ligne'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border-t border-border pt-4">
              <h3 className="font-semibold mb-3">Recherche active</h3>
              <div className="space-y-2 mb-4">
                <div className="text-sm text-muted-foreground">
                  • Développeur Backend (Django)
                </div>
                <div className="text-sm text-muted-foreground">
                  • Commercial B2B
                </div>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="flex-1">
                  Gérer équipe
                </Button>
                <Button variant="secondary" size="sm" className="flex-1">
                  Recruter
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3 & 4: Financement et Formation */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Financement & Opportunités */}
          <div className="bg-card rounded-xl shadow-card border border-border p-6">
            <div className="flex items-center mb-6">
              <DollarSign className="h-6 w-6 text-accent mr-2" />
              <h2 className="text-xl font-bold">Financement</h2>
            </div>
            
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">Objectif: $50,000</span>
                <span className="font-semibold">$15,000 levés (30%)</span>
              </div>
              <Progress value={30} className="h-3" />
            </div>
            
            <div className="border-t border-border pt-6">
              <div className="flex items-center mb-4">
                <Award className="h-5 w-5 text-primary mr-2" />
                <h3 className="font-bold">Opportunités</h3>
              </div>
              
              <div className="space-y-4">
                {opportunities.map((opp, index) => (
                  <div key={index} className="border border-border rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        opp.type === 'competition' ? 'bg-primary/10' : 'bg-secondary/10'
                      }`}>
                        {opp.type === 'competition' ? '🏆' : '🎤'}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">{opp.title}</h4>
                        <p className="text-sm text-muted-foreground flex items-center mt-1">
                          <Calendar className="h-3 w-3 mr-1" />
                          {opp.deadline}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex space-x-2 mt-6">
                <Button variant="outline" className="flex-1">
                  Voir investisseurs
                </Button>
                <Button variant="cta" className="flex-1">
                  Candidater
                </Button>
              </div>
            </div>
          </div>

          {/* Formation & Mentorat */}
          <div className="bg-card rounded-xl shadow-card border border-border p-6">
            <div className="flex items-center mb-6">
              <BookOpen className="h-6 w-6 text-primary mr-2" />
              <h2 className="text-xl font-bold">Formation continue</h2>
            </div>
            
            <div className="mb-6">
              <h3 className="font-semibold mb-3">En cours:</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-primary/10 rounded-lg">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">"Levée de fonds Série A"</p>
                    <Progress value={70} className="h-1 w-20 mt-1" />
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-secondary/10 rounded-lg">
                  <Lightbulb className="h-5 w-5 text-secondary" />
                  <div>
                    <p className="font-medium">"Growth Hacking"</p>
                    <Progress value={45} className="h-1 w-20 mt-1" />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border-t border-border pt-6">
              <div className="flex items-center mb-4">
                <Users className="h-5 w-5 text-secondary mr-2" />
                <h3 className="font-bold">Mentors assignés</h3>
              </div>
              
              <div className="space-y-3">
                {mentors.map((mentor, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                    <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {mentor.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">{mentor.name}</p>
                      <p className="text-sm text-muted-foreground">{mentor.expertise}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex space-x-2 mt-6">
                <Button variant="outline" className="flex-1">
                  Voir formations
                </Button>
                <Button variant="secondary" className="flex-1">
                  Contacter mentors
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EntrepreneurDashboard;