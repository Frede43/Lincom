import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, GraduationCap, Rocket, Users, Building } from "lucide-react";
import { useState } from "react";

const RoleSelection = () => {
  const [selectedRole, setSelectedRole] = useState<string>("");

  const roles = [
    {
      id: "student",
      title: "Étudiant/Apprenant",
      description: "Je veux apprendre et me former",
      icon: GraduationCap,
      features: [
        "Accès aux cours et formations",
        "Mentorat personnalisé",
        "Certifications reconnues",
        "Communauté d'apprentissage"
      ],
      color: "border-primary bg-primary/5"
    },
    {
      id: "entrepreneur", 
      title: "Entrepreneur",
      description: "Je veux créer ma startup",
      icon: Rocket,
      features: [
        "Programme d'incubation",
        "Accompagnement au financement",
        "Réseau d'investisseurs",
        "Outils de gestion de projet"
      ],
      color: "border-secondary bg-secondary/5"
    },
    {
      id: "mentor",
      title: "Mentor/Expert", 
      description: "Je veux partager mes connaissances",
      icon: Users,
      features: [
        "Créer du contenu éducatif",
        "Accompagner des projets",
        "Revenus de formation",
        "Reconnaissance d'expertise"
      ],
      color: "border-accent bg-accent/5"
    },
    {
      id: "organization",
      title: "Organisation",
      description: "Je représente une organisation",
      icon: Building,
      features: [
        "Partenariats stratégiques",
        "Recrutement de talents",
        "Programmes de formation",
        "Impact social mesurable"
      ],
      color: "border-muted bg-muted/5"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <Link to="/onboarding" className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="text-center">
              <div className="text-sm text-muted-foreground mb-1">Étape 1 sur 2</div>
              <div className="w-32 h-2 bg-muted rounded-full mx-auto">
                <div className="w-16 h-2 bg-primary rounded-full"></div>
              </div>
            </div>
            <div className="w-5"></div>
          </div>

          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Quel est votre profil principal ?
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choisissez le rôle qui correspond le mieux à vos objectifs. 
              Vous pourrez toujours le modifier plus tard.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {roles.map((role) => {
              const Icon = role.icon;
              const isSelected = selectedRole === role.id;
              
              return (
                <div
                  key={role.id}
                  className={`cursor-pointer rounded-xl border-2 p-6 transition-all hover:shadow-md ${
                    isSelected 
                      ? `${role.color} border-primary shadow-md` 
                      : "border-border hover:border-primary/50"
                  }`}
                  onClick={() => setSelectedRole(role.id)}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      isSelected ? "bg-primary text-white" : "bg-muted"
                    }`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">{role.title}</h3>
                      <p className="text-muted-foreground mb-4">{role.description}</p>
                      
                      <div className="space-y-2">
                        <p className="font-medium text-sm text-foreground/80">Avantages inclus :</p>
                        <ul className="space-y-1">
                          {role.features.map((feature, index) => (
                            <li key={index} className="text-sm text-muted-foreground flex items-center">
                              <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></div>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    {isSelected && (
                      <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center">
            {selectedRole ? (
              <Link to="/profile-setup">
                <Button size="lg" className="px-8">
                  Continuer
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            ) : (
              <Button size="lg" disabled className="px-8">
                Sélectionnez un rôle pour continuer
              </Button>
            )}
            
            <p className="text-sm text-muted-foreground mt-4">
              Note: Vous pourrez changer de rôle à tout moment dans vos paramètres
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;