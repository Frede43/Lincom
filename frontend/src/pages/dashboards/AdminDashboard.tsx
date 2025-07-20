import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BarChart3, Users, AlertTriangle, Server, Activity, Clock, CheckCircle, XCircle, Database, Settings } from "lucide-react";

const AdminDashboard = () => {
  const platformMetrics = {
    activeUsers: { count: 1234, growth: 45, retention: 80 },
    courses: { total: 89, enrollments: 2456 },
    projects: { total: 156, activeStartups: 23 },
    equipment: { total: 12, usageRate: 89 }
  };

  const realtimeActivity = [
    {
      user: "Marie U.",
      action: "a terminé \"Python 101\"",
      time: "il y a 5 min",
      type: "completion"
    },
    {
      user: "Jean H.", 
      action: "Nouvelle inscription",
      time: "il y a 12 min",
      type: "registration"
    },
    {
      user: "Paul M.",
      action: "Réservation équipement: Prusa 3D",
      time: "il y a 18 min", 
      type: "booking"
    },
    {
      user: "Sara L. ↔ Alice M.",
      action: "Session mentorat terminée",
      time: "il y a 25 min",
      type: "session"
    }
  ];

  const pendingActions = {
    mentorRequests: 3,
    organizationRequests: 2,
    reports: 2,
    suspensions: 1,
    validations: 2
  };

  const systemStatus = {
    servers: { status: "operational", color: "green" },
    database: { status: "98% performance", color: "green" },
    api: { status: "195ms avg", color: "yellow" },
    cdn: { status: "optimal", color: "green" }
  };

  const maintenanceSchedule = [
    {
      task: "Mise à jour sécurité",
      date: "Dimanche 2h",
      type: "security"
    },
    {
      task: "Backup mensuel", 
      date: "15/03 23h",
      type: "backup"
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
                <BarChart3 className="mr-3" />
                Administration Community Lab
              </h1>
              <p className="text-white/90">Vue d'ensemble de la plateforme</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-sm text-white/80">Uptime</div>
                <div className="text-xl font-bold">99.9%</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-white/80">Utilisateurs actifs</div>
                <div className="text-xl font-bold">856</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Section 1: Métriques globales */}
          <div className="lg:col-span-2 bg-card rounded-xl shadow-card border border-border p-6">
            <div className="flex items-center mb-6">
              <BarChart3 className="h-6 w-6 text-primary mr-2" />
              <h2 className="text-xl font-bold">Métriques plateforme</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Utilisateurs */}
              <div className="bg-primary/10 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <Users className="h-8 w-8 text-primary mr-3" />
                    <div>
                      <p className="text-sm text-muted-foreground">Utilisateurs Actifs</p>
                      <p className="text-2xl font-bold">{platformMetrics.activeUsers.count}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>+{platformMetrics.activeUsers.growth} cette semaine</span>
                    <span className="text-green-600">↗</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Rétention</span>
                    <span>{platformMetrics.activeUsers.retention}%</span>
                  </div>
                  <Progress value={platformMetrics.activeUsers.retention} className="h-2" />
                </div>
              </div>

              {/* Formations */}
              <div className="bg-secondary/10 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <CheckCircle className="h-8 w-8 text-secondary mr-3" />
                    <div>
                      <p className="text-sm text-muted-foreground">Formations</p>
                      <p className="text-2xl font-bold">{platformMetrics.courses.total}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">
                    {platformMetrics.courses.enrollments} inscriptions
                  </div>
                  <div className="text-sm text-green-600">
                    Taux de completion: 87%
                  </div>
                </div>
              </div>

              {/* Projets */}
              <div className="bg-accent/10 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <Activity className="h-8 w-8 text-accent mr-3" />
                    <div>
                      <p className="text-sm text-muted-foreground">Projets</p>
                      <p className="text-2xl font-bold">{platformMetrics.projects.total}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">
                    {platformMetrics.projects.activeStartups} startups actives
                  </div>
                  <div className="text-sm text-green-600">
                    12 nouvelles ce mois
                  </div>
                </div>
              </div>

              {/* Équipements */}
              <div className="bg-green-100 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <Settings className="h-8 w-8 text-green-600 mr-3" />
                    <div>
                      <p className="text-sm text-muted-foreground">Équipements</p>
                      <p className="text-2xl font-bold">{platformMetrics.equipment.total}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Taux d'usage</span>
                    <span>{platformMetrics.equipment.usageRate}%</span>
                  </div>
                  <Progress value={platformMetrics.equipment.usageRate} className="h-2" />
                </div>
              </div>
            </div>
            
            <Button variant="outline" className="w-full mt-6">
              Voir analytics détaillées
            </Button>
          </div>

          {/* Section 2: Activité temps réel */}
          <div className="bg-card rounded-xl shadow-card border border-border p-6">
            <div className="flex items-center mb-6">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-2 animate-pulse"></div>
              <h2 className="text-xl font-bold">Activité temps réel</h2>
            </div>
            
            <div className="space-y-4">
              {realtimeActivity.map((activity, index) => {
                const getIcon = (type: string) => {
                  switch (type) {
                    case 'completion': return <CheckCircle className="h-4 w-4 text-green-500" />;
                    case 'registration': return <Users className="h-4 w-4 text-blue-500" />;
                    case 'booking': return <Settings className="h-4 w-4 text-orange-500" />;
                    case 'session': return <Activity className="h-4 w-4 text-purple-500" />;
                    default: return <Activity className="h-4 w-4 text-gray-500" />;
                  }
                };

                return (
                  <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/30">
                    {getIcon(activity.type)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">
                        <span className="font-medium">{activity.user}</span> {activity.action}
                      </p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <Button variant="ghost" className="w-full mt-4">
              Voir log complet
            </Button>
          </div>
        </div>

        {/* Section 3 & 4: Gestion utilisateurs et Système */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Gestion utilisateurs */}
          <div className="bg-card rounded-xl shadow-card border border-border p-6">
            <div className="flex items-center mb-6">
              <Users className="h-6 w-6 text-secondary mr-2" />
              <h2 className="text-xl font-bold">Gestion utilisateurs</h2>
            </div>
            
            <div className="space-y-4">
              {/* Demandes en attente */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <Clock className="h-5 w-5 text-yellow-600 mr-2" />
                  <h3 className="font-semibold">Demandes en attente ({pendingActions.mentorRequests + pendingActions.organizationRequests})</h3>
                </div>
                <div className="space-y-1 text-sm">
                  <div>• {pendingActions.mentorRequests} demandes mentor</div>
                  <div>• {pendingActions.organizationRequests} demandes organisation</div>
                </div>
              </div>

              {/* Signalements */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
                  <h3 className="font-semibold">Signalements ({pendingActions.reports})</h3>
                </div>
                <div className="space-y-1 text-sm">
                  <div>• Contenu inapproprié</div>
                  <div>• Comportement suspect</div>
                </div>
              </div>

              {/* Actions récentes */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                  <h3 className="font-semibold">Actions récentes</h3>
                </div>
                <div className="space-y-1 text-sm">
                  <div>• {pendingActions.suspensions} utilisateur suspendu</div>
                  <div>• {pendingActions.validations} profils validés</div>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-2 mt-6">
              <Button variant="outline" className="flex-1">
                Modération
              </Button>
              <Button variant="secondary" className="flex-1">
                Validation
              </Button>
              <Button variant="ghost" className="flex-1">
                Rapports
              </Button>
            </div>
          </div>

          {/* Système & Maintenance */}
          <div className="bg-card rounded-xl shadow-card border border-border p-6">
            <div className="flex items-center mb-6">
              <Server className="h-6 w-6 text-accent mr-2" />
              <h2 className="text-xl font-bold">État du système</h2>
            </div>
            
            <div className="space-y-4">
              {/* État système */}
              <div className="space-y-3">
                {Object.entries(systemStatus).map(([key, status]) => {
                  const getStatusColor = (color: string) => {
                    switch (color) {
                      case 'green': return 'text-green-600 bg-green-100';
                      case 'yellow': return 'text-yellow-600 bg-yellow-100';
                      case 'red': return 'text-red-600 bg-red-100';
                      default: return 'text-gray-600 bg-gray-100';
                    }
                  };

                  const getStatusIcon = (color: string) => {
                    switch (color) {
                      case 'green': return '🟢';
                      case 'yellow': return '🟡';
                      case 'red': return '🔴';
                      default: return '⚪';
                    }
                  };

                  return (
                    <div key={key} className="flex items-center justify-between">
                      <span className="capitalize font-medium">{key}</span>
                      <div className={`px-2 py-1 rounded text-sm ${getStatusColor(status.color)}`}>
                        {getStatusIcon(status.color)} {status.status}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Maintenance programmée */}
              <div className="border-t border-border pt-4">
                <div className="flex items-center mb-3">
                  <AlertTriangle className="h-5 w-5 text-orange-500 mr-2" />
                  <h3 className="font-semibold">Maintenance programmée</h3>
                </div>
                
                <div className="space-y-2">
                  {maintenanceSchedule.map((maintenance, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span>• {maintenance.task}</span>
                      <span className="text-muted-foreground">{maintenance.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex space-x-2 mt-6">
              <Button variant="outline" className="flex-1">
                Monitoring
              </Button>
              <Button variant="secondary" className="flex-1">
                Logs
              </Button>
              <Button variant="ghost" className="flex-1">
                Maintenance
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;