import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { GraduationCap, Rocket, Wrench, Users, Clock, Award, ArrowRight } from "lucide-react";

const Programs = () => {
  const programs = [
    {
      id: "formation",
      title: "Formation Technologique",
      icon: GraduationCap,
      description: "Programmes de formation complets aux technologies d'avenir",
      color: "primary",
      duration: "3-12 mois",
      level: "Tous niveaux",
      price: "Gratuit à 500,000 BIF",
      features: [
        "Développement Web & Mobile",
        "Intelligence Artificielle",
        "Data Science & Analytics",
        "IoT & Systèmes Embarqués",
        "Cybersécurité",
        "Design UX/UI"
      ],
      outcomes: [
        "Certificats reconnus",
        "Portfolio de projets",
        "Stages en entreprise",
        "Placement emploi (85%)"
      ],
      testimonial: {
        text: "La formation m'a permis de décrocher un emploi en remote pour une startup européenne.",
        author: "Jean NKURU",
        role: "Développeur Full-Stack"
      }
    },
    {
      id: "incubation",
      title: "Incubation Startup",
      icon: Rocket,
      description: "Programme d'accompagnement pour transformer vos idées en startups viables",
      color: "secondary",
      duration: "6-18 mois",
      level: "Entrepreneurs",
      price: "Équité ou 2,000,000 BIF",
      features: [
        "Validation d'idée business",
        "Développement MVP",
        "Stratégie go-to-market",
        "Levée de fonds",
        "Mentorat expert",
        "Réseau investisseurs"
      ],
      outcomes: [
        "Startup opérationnelle",
        "Financement seed",
        "Équipe constituée",
        "Premiers clients"
      ],
      testimonial: {
        text: "Notre startup a levé 50,000$ grâce au programme d'incubation.",
        author: "Marie UWIMANA",
        role: "CEO EcoFarm Solutions"
      }
    },
    {
      id: "fablab",
      title: "Fab Lab & Prototypage",
      icon: Wrench,
      description: "Accès aux équipements de fabrication numérique et formation technique",
      color: "accent",
      duration: "Sessions flexibles",
      level: "Tous niveaux",
      price: "20,000 BIF/session",
      features: [
        "Impression 3D",
        "Découpe laser",
        "Électronique & Arduino",
        "Robotique",
        "Conception 3D",
        "Prototypage rapide"
      ],
      outcomes: [
        "Prototypes fonctionnels",
        "Compétences techniques",
        "Projets personnels",
        "Innovations concrètes"
      ],
      testimonial: {
        text: "J'ai pu créer mon premier prototype de dispositif médical grâce au Fab Lab.",
        author: "Dr. Paul NDAYISENGA",
        role: "Inventeur"
      }
    },
    {
      id: "mentorat",
      title: "Programme de Mentorat",
      icon: Users,
      description: "Accompagnement personnalisé par des experts et entrepreneurs",
      color: "primary",
      duration: "3-12 mois",
      level: "Tous niveaux",
      price: "Gratuit à 200,000 BIF",
      features: [
        "Matching intelligent",
        "Sessions 1-on-1",
        "Mentorat de groupe",
        "Experts internationaux",
        "Suivi personnalisé",
        "Réseau alumni"
      ],
      outcomes: [
        "Croissance accélérée",
        "Réseau professionnel",
        "Conseils stratégiques",
        "Opportunités business"
      ],
      testimonial: {
        text: "Mon mentor m'a aidé à structurer ma startup et à lever mes premiers fonds.",
        author: "Diane MUKAMANA",
        role: "Entrepreneure"
      }
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

  const getColorClass = (color: string) => {
    switch (color) {
      case "primary": return "text-primary";
      case "secondary": return "text-secondary";
      case "accent": return "text-accent";
      default: return "text-primary";
    }
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-b from-muted/30 to-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Nos{" "}
              <span className="bg-gradient-hero bg-clip-text text-transparent">
                Programmes
              </span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed mb-8">
              Découvrez nos programmes d&apos;innovation conçus pour vous accompagner 
              à chaque étape de votre parcours entrepreneurial et technologique.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="cta" size="lg">
                Candidater maintenant
              </Button>
              <Button variant="outline" size="lg">
                Télécharger la brochure
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-20">
            {programs.map((program, index) => (
              <div
                key={program.id}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                  index % 2 === 1 ? "lg:grid-cols-2" : ""
                }`}
              >
                {/* Program Info */}
                <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                  <div className="flex items-center space-x-4 mb-6">
                    <div className={`w-16 h-16 ${getGradientClass(program.color)} rounded-xl flex items-center justify-center`}>
                      <program.icon className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold">{program.title}</h2>
                      <p className="text-muted-foreground">{program.description}</p>
                    </div>
                  </div>

                  {/* Program Details */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <Clock className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                      <div className="font-medium text-sm">{program.duration}</div>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <GraduationCap className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                      <div className="font-medium text-sm">{program.level}</div>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <Award className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                      <div className="font-medium text-sm">{program.price}</div>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="mb-6">
                    <h3 className="font-bold mb-4">Ce que vous apprendrez :</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {program.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${getGradientClass(program.color)}`} />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Outcomes */}
                  <div className="mb-6">
                    <h3 className="font-bold mb-4">Résultats attendus :</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {program.outcomes.map((outcome, idx) => (
                        <div key={idx} className="flex items-center space-x-2">
                          <ArrowRight className={`h-4 w-4 ${getColorClass(program.color)}`} />
                          <span className="text-sm">{outcome}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button variant="cta" size="lg" className="w-full sm:w-auto">
                    S&apos;inscrire au programme
                  </Button>
                </div>

                {/* Testimonial Card */}
                <div className={index % 2 === 1 ? "lg:order-1" : ""}>
                  <div className="bg-card p-8 rounded-2xl shadow-elegant border border-border">
                    <div className="mb-6">
                      <div className={`w-12 h-12 ${getGradientClass(program.color)} rounded-lg flex items-center justify-center mb-4`}>
                        <program.icon className="h-6 w-6 text-white" />
                      </div>
                      <blockquote className="text-lg leading-relaxed mb-4">
                        &ldquo;{program.testimonial.text}&rdquo;
                      </blockquote>
                      <div>
                        <div className="font-semibold">{program.testimonial.author}</div>
                        <div className="text-sm text-muted-foreground">{program.testimonial.role}</div>
                      </div>
                    </div>

                    <div className="border-t border-border pt-6">
                      <h4 className="font-semibold mb-4">Informations pratiques :</h4>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Prochaine session :</span>
                          <span className="font-medium">15 Avril 2024</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Places disponibles :</span>
                          <span className="font-medium">12/25</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Modalité :</span>
                          <span className="font-medium">Présentiel + Remote</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-hero">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Prêt à Commencer Votre Parcours ?
          </h2>
          <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">
            Rejoignez plus de 1,200 innovateurs qui transforment leurs idées en réalité 
            grâce à nos programmes d&apos;excellence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10">
              Programmer un appel
            </Button>
            <Button className="bg-white text-primary hover:bg-white/90" size="lg">
              Candidater maintenant
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Programs;