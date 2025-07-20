import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Users, Lightbulb, Wrench } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-lab.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Community Lab Innovation"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-background/95" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                <span className="bg-gradient-hero bg-clip-text text-transparent">
                  Révolutionnez
                </span>
                <br />
                l&apos;Innovation au Burundi
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl">
                Le premier Community Lab du Burundi pour former, innover et 
                entreprendre. Rejoignez un écosystème dynamique d&apos;innovation 
                technologique et sociale.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="hero" size="xl" asChild>
                <Link to="/signup">
                  Commencer Gratuitement
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="xl">
                <Play className="mr-2 h-5 w-5" />
                Voir la Démo
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-border">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">1,234+</div>
                <div className="text-sm text-muted-foreground">Innovateurs</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary">156</div>
                <div className="text-sm text-muted-foreground">Projets</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">89%</div>
                <div className="text-sm text-muted-foreground">Succès</div>
              </div>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-2 gap-6 animate-slide-up">
            <div className="bg-card/80 backdrop-blur-sm p-6 rounded-lg shadow-card border border-border">
              <Users className="h-8 w-8 text-primary mb-4" />
              <h3 className="font-semibold mb-2">Formation</h3>
              <p className="text-sm text-muted-foreground">
                Cours techniques et entrepreneuriaux
              </p>
            </div>
            <div className="bg-card/80 backdrop-blur-sm p-6 rounded-lg shadow-card border border-border">
              <Lightbulb className="h-8 w-8 text-secondary mb-4" />
              <h3 className="font-semibold mb-2">Innovation</h3>
              <p className="text-sm text-muted-foreground">
                Incubation de startups innovantes
              </p>
            </div>
            <div className="bg-card/80 backdrop-blur-sm p-6 rounded-lg shadow-card border border-border">
              <Wrench className="h-8 w-8 text-accent mb-4" />
              <h3 className="font-semibold mb-2">Fab Lab</h3>
              <p className="text-sm text-muted-foreground">
                Équipements de fabrication numérique
              </p>
            </div>
            <div className="bg-card/80 backdrop-blur-sm p-6 rounded-lg shadow-card border border-border">
              <ArrowRight className="h-8 w-8 text-primary mb-4" />
              <h3 className="font-semibold mb-2">Mentorat</h3>
              <p className="text-sm text-muted-foreground">
                Accompagnement par des experts
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-primary rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;