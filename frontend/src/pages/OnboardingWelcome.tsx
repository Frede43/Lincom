import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Users, BookOpen, Lightbulb, Target } from "lucide-react";

const OnboardingWelcome = () => {
  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Bienvenue au Community Lab !
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Vous faites maintenant partie d'une communauté dynamique d'innovateurs, 
              d'entrepreneurs et de créateurs au Burundi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-white">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-6 w-6" />
              </div>
              <h3 className="font-semibold mb-2">Apprendre</h3>
              <p className="text-sm text-white/80">
                Accédez à des formations de qualité et développez vos compétences
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-white">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Lightbulb className="h-6 w-6" />
              </div>
              <h3 className="font-semibold mb-2">Créer</h3>
              <p className="text-sm text-white/80">
                Transformez vos idées en projets concrets avec nos outils
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-white">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="font-semibold mb-2">Collaborer</h3>
              <p className="text-sm text-white/80">
                Connectez-vous avec des mentors et d'autres innovateurs
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-white">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Target className="h-6 w-6" />
              </div>
              <h3 className="font-semibold mb-2">Réussir</h3>
              <p className="text-sm text-white/80">
                Concrétisez vos ambitions avec notre accompagnement
              </p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              Nos chiffres d'impact
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary mb-1">1,200+</div>
                <p className="text-white/80">Innovateurs formés</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent mb-1">150+</div>
                <p className="text-white/80">Projets incubés</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">50+</div>
                <p className="text-white/80">Startups lancées</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Link to="/role-selection">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 px-8">
                Commencer mon parcours
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            
            <p className="text-white/70 text-sm">
              Cela ne prendra que quelques minutes pour personnaliser votre expérience
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingWelcome;