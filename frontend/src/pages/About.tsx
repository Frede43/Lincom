import Navigation from "@/components/Navigation";
import { MapPin, Mail, Phone, Globe, Award, Users, Target, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

const About = () => {
  const teamMembers = [
    {
      name: "Dr. Marie NKURUNZIZA",
      role: "Directrice Exécutive",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b601?w=300&h=300&fit=crop&crop=face",
      bio: "15 ans d'expérience en innovation technologique et développement entrepreneurial en Afrique.",
      expertise: ["Innovation", "Entrepreneuriat", "Leadership"]
    },
    {
      name: "Jean UWIMANA",
      role: "Directeur Technique",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
      bio: "Expert en technologies émergentes avec une expérience internationale en IA et IoT.",
      expertise: ["IA", "IoT", "Développement"]
    },
    {
      name: "Sarah MUKAMANA",
      role: "Responsable Programmes",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face",
      bio: "Spécialiste en conception pédagogique et accompagnement entrepreneurial.",
      expertise: ["Formation", "Mentorat", "Design"]
    },
    {
      name: "Paul NDAYISENGA",
      role: "Coordinateur Fab Lab",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
      bio: "Ingénieur passionné par la fabrication numérique et le prototypage rapide.",
      expertise: ["Fab Lab", "Prototypage", "Ingénierie"]
    }
  ];

  const recognitions = [
    {
      title: "MIT Fab Lab Certification",
      description: "Certification officielle du réseau mondial MIT Fab Lab",
      icon: Award,
      year: "2023"
    },
    {
      title: "Prix Innovation USAID",
      description: "Reconnu pour l'impact sur le développement technologique",
      icon: Target,
      year: "2023"
    },
    {
      title: "Partenaire ODD",
      description: "Alignement avec les Objectifs de Développement Durable",
      icon: Globe,
      year: "2022"
    },
    {
      title: "Hub d'Innovation Certifié",
      description: "Certification gouvernementale d'excellence",
      icon: Heart,
      year: "2022"
    }
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-b from-muted/30 to-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              À Propos du{" "}
              <span className="bg-gradient-hero bg-clip-text text-transparent">
                Community Lab
              </span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Le premier écosystème d&apos;innovation technologique et entrepreneuriale 
              au Burundi, dédié à former la prochaine génération d&apos;innovateurs africains.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">
                Notre <span className="text-primary">Mission</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Démocratiser l&apos;accès à l&apos;innovation technologique au Burundi en 
                créant un écosystème inclusif où chaque citoyen peut apprendre, 
                innover et entreprendre avec les technologies d&apos;avenir.
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Target className="h-6 w-6 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold">Formation d&apos;Excellence</h3>
                    <p className="text-muted-foreground">Programmes de formation aux standards internationaux</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Users className="h-6 w-6 text-secondary mt-1" />
                  <div>
                    <h3 className="font-semibold">Communauté Inclusive</h3>
                    <p className="text-muted-foreground">Espace ouvert à tous, sans discrimination</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Heart className="h-6 w-6 text-accent mt-1" />
                  <div>
                    <h3 className="font-semibold">Impact Social</h3>
                    <p className="text-muted-foreground">Solutions technologiques pour les défis locaux</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-8">
              <h2 className="text-3xl font-bold mb-6">
                Notre <span className="text-secondary">Vision</span>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Devenir le hub d&apos;innovation de référence en Afrique de l&apos;Est, 
                reconnu pour l&apos;excellence de ses programmes et l&apos;impact de ses 
                innovations sur le développement socio-économique de la région.
              </p>
              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">2030</div>
                  <div className="text-sm text-muted-foreground">Hub régional</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-secondary">10K+</div>
                  <div className="text-sm text-muted-foreground">Innovateurs formés</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Notre{" "}
              <span className="bg-gradient-accent bg-clip-text text-transparent">
                Équipe
              </span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Des experts passionnés dédiés à votre succès et au développement 
              de l&apos;écosystème d&apos;innovation burundais.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="bg-card p-6 rounded-xl shadow-card border border-border hover:shadow-elegant transition-all duration-300 hover:-translate-y-1 group"
              >
                <div className="text-center">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-primary/20 group-hover:border-primary/40 transition-colors"
                  />
                  <h3 className="font-bold text-lg mb-1">{member.name}</h3>
                  <p className="text-primary font-medium mb-3">{member.role}</p>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                    {member.bio}
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {member.expertise.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recognition */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Nos{" "}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Reconnaissances
              </span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Notre excellence reconnue par des institutions prestigieuses 
              et des organisations internationales.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {recognitions.map((recognition, index) => (
              <div
                key={index}
                className="text-center p-6 bg-card rounded-lg shadow-card border border-border hover:shadow-elegant transition-all duration-300"
              >
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <recognition.icon className="h-8 w-8 text-white" />
                </div>
                <div className="text-sm text-primary font-medium mb-2">
                  {recognition.year}
                </div>
                <h3 className="font-bold mb-2">{recognition.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {recognition.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-6">Nous Contacter</h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <MapPin className="h-6 w-6 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold">Adresse</h3>
                    <p className="text-muted-foreground">
                      Avenue de l&apos;Innovation, Quartier Kinindo<br />
                      Bujumbura, Burundi
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Phone className="h-6 w-6 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold">Téléphone</h3>
                    <p className="text-muted-foreground">+257 22 000 000</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Mail className="h-6 w-6 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold">Email</h3>
                    <p className="text-muted-foreground">contact@communitylab.bi</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Globe className="h-6 w-6 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold">Site Web</h3>
                    <p className="text-muted-foreground">www.communitylab.bi</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-card p-8 rounded-xl shadow-card border border-border">
              <h3 className="text-xl font-bold mb-6">Visitez-nous</h3>
              <div className="aspect-video bg-muted rounded-lg mb-6 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <MapPin className="h-12 w-12 mx-auto mb-2" />
                  <p>Carte interactive</p>
                  <p className="text-sm">Google Maps intégré</p>
                </div>
              </div>
              <Button className="w-full" variant="cta">
                Planifier une visite
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;