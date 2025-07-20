import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Eye, EyeOff, CheckCircle } from "lucide-react";
import { useState } from "react";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <section className="pt-24 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-4">
                Rejoignez{" "}
                <span className="bg-gradient-hero bg-clip-text text-transparent">
                  Community Lab
                </span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Créez votre compte et commencez votre parcours d&apos;innovation dès aujourd&apos;hui
              </p>
            </div>

            <div className="bg-card p-8 rounded-xl shadow-elegant border border-border">
              <form className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h2 className="text-xl font-semibold mb-4">Informations personnelles</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Prénom *</label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                        placeholder="Votre prénom"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Nom *</label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                        placeholder="Votre nom"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Email *</label>
                      <input
                        type="email"
                        className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                        placeholder="votre.email@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Téléphone</label>
                      <input
                        type="tel"
                        className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                        placeholder="+257 79 000 000"
                      />
                    </div>
                  </div>
                </div>

                {/* Professional Information */}
                <div>
                  <h2 className="text-xl font-semibold mb-4">Profil professionnel</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Statut *</label>
                      <select className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none">
                        <option value="">Sélectionnez votre statut</option>
                        <option value="student">Étudiant</option>
                        <option value="professional">Professionnel</option>
                        <option value="entrepreneur">Entrepreneur</option>
                        <option value="freelancer">Freelancer</option>
                        <option value="unemployed">En recherche d&apos;emploi</option>
                        <option value="other">Autre</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Institution/Entreprise</label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                        placeholder="Nom de votre institution ou entreprise"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Domaine d&apos;expertise</label>
                      <select className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none">
                        <option value="">Choisissez votre domaine</option>
                        <option value="technology">Technologie</option>
                        <option value="business">Business</option>
                        <option value="design">Design</option>
                        <option value="marketing">Marketing</option>
                        <option value="engineering">Ingénierie</option>
                        <option value="education">Éducation</option>
                        <option value="health">Santé</option>
                        <option value="agriculture">Agriculture</option>
                        <option value="other">Autre</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Account Security */}
                <div>
                  <h2 className="text-xl font-semibold mb-4">Sécurité du compte</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Mot de passe *</label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          className="w-full px-4 py-3 pr-12 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                          placeholder="Créez un mot de passe fort"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Confirmer le mot de passe *</label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          className="w-full px-4 py-3 pr-12 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                          placeholder="Confirmez votre mot de passe"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Terms and Conditions */}
                <div className="space-y-4">
                  <label className="flex items-start">
                    <input type="checkbox" className="rounded border-input mt-1" />
                    <span className="ml-3 text-sm text-muted-foreground">
                      J&apos;accepte les{" "}
                      <Link to="/terms" className="text-primary hover:underline">
                        conditions d&apos;utilisation
                      </Link>{" "}
                      et la{" "}
                      <Link to="/privacy" className="text-primary hover:underline">
                        politique de confidentialité
                      </Link>
                    </span>
                  </label>
                  <label className="flex items-start">
                    <input type="checkbox" className="rounded border-input mt-1" />
                    <span className="ml-3 text-sm text-muted-foreground">
                      Je souhaite recevoir des mises à jour sur les programmes et événements
                    </span>
                  </label>
                </div>

                <Link to="/email-verification">
                  <Button variant="cta" size="lg" className="w-full">
                    Créer mon compte
                  </Button>
                </Link>
              </form>

              <div className="mt-6 text-center">
                <p className="text-muted-foreground">
                  Vous avez déjà un compte ?{" "}
                  <Link to="/login" className="text-primary hover:underline font-medium">
                    Se connecter
                  </Link>
                </p>
              </div>
            </div>

            {/* Benefits */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2">Gratuit pour toujours</h3>
                <p className="text-sm text-muted-foreground">
                  Accès de base gratuit, upgrades optionnels
                </p>
              </div>
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-gradient-secondary rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2">Communauté active</h3>
                <p className="text-sm text-muted-foreground">
                  Rejoignez plus de 1,200 innovateurs
                </p>
              </div>
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-gradient-accent rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2">Support expert</h3>
                <p className="text-sm text-muted-foreground">
                  Accompagnement par des mentors qualifiés
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Signup;