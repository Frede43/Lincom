import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft, BarChart3, BookOpen, Users, Settings, LogOut } from "lucide-react";

const DashboardNavigation = () => {
  // Pour la démo, on simule un utilisateur connecté
  const userName = "Marie UWIMANA";
  const userRole = localStorage.getItem("userRole") || "student";

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "student": return "👨‍🎓";
      case "entrepreneur": return "🚀";
      case "mentor": return "👨‍🏫";
      case "admin": return "⚙️";
      default: return "👤";
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "student": return "Étudiant";
      case "entrepreneur": return "Entrepreneur";
      case "mentor": return "Mentor";
      case "admin": return "Administrateur";
      default: return "Utilisateur";
    }
  };

  return (
    <nav className="fixed top-0 w-full bg-background/95 backdrop-blur-sm border-b border-border z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo et retour */}
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-2">
              <ArrowLeft className="h-5 w-5 text-muted-foreground hover:text-foreground" />
            </Link>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-md flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Dashboard
              </span>
            </div>
          </div>

          {/* Navigation rapide */}
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              to="/dashboard" 
              className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <BarChart3 className="h-4 w-4" />
              <span>Vue d'ensemble</span>
            </Link>
            <Link 
              to="/courses" 
              className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <BookOpen className="h-4 w-4" />
              <span>Formations</span>
            </Link>
            <Link 
              to="/community" 
              className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Users className="h-4 w-4" />
              <span>Communauté</span>
            </Link>
          </div>

          {/* Profil utilisateur */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium">{userName}</p>
              <p className="text-xs text-muted-foreground flex items-center justify-end">
                <span className="mr-1">{getRoleIcon(userRole)}</span>
                {getRoleLabel(userRole)}
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/profile">
                  <Settings className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/">
                  <LogOut className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default DashboardNavigation;