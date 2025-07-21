import { useState, useEffect } from "react";
import DashboardNavigation from "@/components/DashboardNavigation";
import StudentDashboard from "./dashboards/StudentDashboard";
import EntrepreneurDashboard from "./dashboards/EntrepreneurDashboard";
import MentorDashboard from "./dashboards/MentorDashboard";
import AdminDashboard from "./dashboards/AdminDashboard";

const Dashboard = () => {
  // Pour la démo, on simule un rôle utilisateur
  // En production, ceci viendrait du context d'authentification ou de l'état global
  const [userRole, setUserRole] = useState<string>("student");

  // Simulation de récupération du rôle utilisateur
  useEffect(() => {
    // En production, vous récupéreriez le rôle depuis votre système d'authentification
    // Par exemple depuis localStorage, un context, ou une API
    const storedRole = localStorage.getItem("userRole") || "student";
    setUserRole(storedRole);
  }, []);

  // Pour faciliter les tests, on peut changer de rôle temporairement
  const handleRoleChange = (role: string) => {
    setUserRole(role);
    localStorage.setItem("userRole", role);
  };

  // Composant de sélection de rôle pour la démo (à supprimer en production)
  const RoleSelector = () => (
    <div className="fixed top-4 right-4 z-50 bg-white border border-border rounded-lg p-3 shadow-lg">
      <p className="text-xs text-muted-foreground mb-2">Demo - Changer de rôle:</p>
      <div className="flex space-x-1">
        {[
          { id: "student", label: "👨‍🎓", title: "Étudiant" },
          { id: "entrepreneur", label: "🚀", title: "Entrepreneur" },
          { id: "mentor", label: "👨‍🏫", title: "Mentor" },
          { id: "admin", label: "⚙️", title: "Admin" }
        ].map((role) => (
          <button
            key={role.id}
            onClick={() => handleRoleChange(role.id)}
            title={role.title}
            className={`p-2 rounded text-sm transition-colors ${
              userRole === role.id 
                ? "bg-primary text-white" 
                : "bg-muted hover:bg-muted/80"
            }`}
          >
            {role.label}
          </button>
        ))}
      </div>
    </div>
  );

  // Rendu du dashboard basé sur le rôle
  const renderDashboard = () => {
    switch (userRole) {
      case "student":
        return <StudentDashboard />;
      case "entrepreneur":
        return <EntrepreneurDashboard />;
      case "mentor":
        return <MentorDashboard />;
      case "admin":
        return <AdminDashboard />;
      default:
        return <StudentDashboard />; // Dashboard par défaut
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation spécifique au dashboard */}
      <DashboardNavigation />
      
      {/* Sélecteur de rôle pour la démo - À SUPPRIMER EN PRODUCTION */}
      <RoleSelector />
      
      {/* Dashboard principal avec padding-top pour la navigation fixe */}
      <div className="pt-16">
        {renderDashboard()}
      </div>
    </div>
  );
};

export default Dashboard;