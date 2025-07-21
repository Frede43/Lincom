import { GraduationCap, Users, Wrench, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";

const FeaturesSection = () => {
  const features = [
    {
      icon: GraduationCap,
      title: "Formation Technologique",
      description: "Programmes de formation en développement web, mobile, IA, IoT et plus encore. Apprenez des technologies d'avenir avec nos experts.",
      highlights: ["Cours certifiants", "Projets pratiques", "Mentors experts"],
      color: "primary"
    },
    {
      icon: Users,
      title: "Mentorat Personnalisé",
      description: "Accompagnement individuel par des entrepreneurs et experts expérimentés. Bénéficiez de conseils personnalisés pour votre parcours.",
      highlights: ["Matching intelligent", "Sessions 1-on-1", "Réseau d'experts"],
      color: "secondary"
    },
    {
      icon: Wrench,
      title: "Fab Lab Équipé",
      description: "Accès à des équipements de pointe : imprimantes 3D, découpe laser, électronique, robotique. Donnez vie à vos idées.",
      highlights: ["Équipements modernes", "Formations techniques", "Support technique"],
      color: "accent"
    },
    {
      icon: Rocket,
      title: "Incubation Startup",
      description: "Programme d'accompagnement complet pour transformer votre idée en startup viable. Financement, réseau et expertise.",
      highlights: ["Financement seed", "Réseau investisseurs", "Go-to-market"],
      color: "primary"
    }
  ];

  const getGradientClass = (color: string) => {
    switch (color) {
      case "primary": return "bg-gradient-primary";
      case "secondary": return "bg-gradient-secondary";
      case "accent": return "bg-gradient-accent";
      default: return "bg-gradient-primary";
    }
  };

  return (
    <section className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Nos <span className="bg-gradient-hero bg-clip-text text-transparent">Programmes</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Découvrez nos quatre piliers d&apos;innovation qui vous accompagneront 
            dans votre parcours d&apos;entrepreneur ou d&apos;innovateur.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-8 bg-card rounded-xl shadow-card border border-border hover:shadow-elegant transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-start space-x-6">
                <div className={`w-16 h-16 ${getGradientClass(feature.color)} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {feature.description}
                  </p>
                  
                  <div className="space-y-2 mb-6">
                    {feature.highlights.map((highlight, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-primary rounded-full" />
                        <span className="text-sm text-muted-foreground">{highlight}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Button variant="outline" className="group-hover:border-primary group-hover:text-primary transition-colors">
                    En savoir plus
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="cta" size="lg">
            Découvrir tous nos programmes
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;