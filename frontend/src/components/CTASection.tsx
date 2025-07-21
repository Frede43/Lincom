import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Zap, Target } from "lucide-react";
import { Link } from "react-router-dom";

const CTASection = () => {
  return (
    <section className="py-20 bg-gradient-hero relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-20 h-20 border border-white/20 rounded-full" />
        <div className="absolute top-32 right-20 w-16 h-16 border border-white/20 rounded-full" />
        <div className="absolute bottom-20 left-32 w-24 h-24 border border-white/20 rounded-full" />
        <div className="absolute bottom-40 right-10 w-12 h-12 border border-white/20 rounded-full" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center text-white">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Rejoignez la Révolution de l&apos;Innovation
          </h2>
          <p className="text-xl text-white/90 max-w-3xl mx-auto mb-12 leading-relaxed">
            Transformez vos idées en réalité avec le soutien d&apos;une communauté 
            dynamique d&apos;innovateurs, entrepreneurs et experts au Burundi.
          </p>

          {/* Quick Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold mb-2">Communauté Active</h3>
              <p className="text-white/80 text-sm">
                Plus de 1,200 innovateurs connectés
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold mb-2">Formation Accélérée</h3>
              <p className="text-white/80 text-sm">
                Programmes intensifs et pratiques
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4">
                <Target className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold mb-2">Résultats Concrets</h3>
              <p className="text-white/80 text-sm">
                89% de taux de succès des projets
              </p>
            </div>
          </div>

          {/* Quick Signup Form */}
          <div className="max-w-md mx-auto mb-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <h3 className="font-semibold mb-4">Inscription Rapide</h3>
              <form className="space-y-4">
                <input
                  type="email"
                  placeholder="Votre adresse email"
                  className="w-full px-4 py-3 rounded-lg bg-white/90 text-gray-900 placeholder-gray-500 border-0 focus:ring-2 focus:ring-white focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Votre nom complet"
                  className="w-full px-4 py-3 rounded-lg bg-white/90 text-gray-900 placeholder-gray-500 border-0 focus:ring-2 focus:ring-white focus:outline-none"
                />
                <Button className="w-full bg-white text-primary hover:bg-white/90 font-semibold" size="lg">
                  Commencer Gratuitement
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </form>
              <p className="text-xs text-white/70 mt-3">
                Gratuit pour toujours • Aucune carte de crédit requise
              </p>
            </div>
          </div>

          {/* Alternative CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10" asChild>
              <Link to="/about">
                En savoir plus sur nous
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10" asChild>
              <Link to="/programs">
                Voir nos programmes
              </Link>
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 pt-8 border-t border-white/20">
            <p className="text-white/70 text-sm mb-4">
              Approuvé par nos partenaires de confiance
            </p>
            <div className="flex justify-center items-center space-x-8 opacity-60">
              <span className="text-white/60 text-sm font-medium">MIT Fab Foundation</span>
              <span className="text-white/60">•</span>
              <span className="text-white/60 text-sm font-medium">USAID</span>
              <span className="text-white/60">•</span>
              <span className="text-white/60 text-sm font-medium">Université du Burundi</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;