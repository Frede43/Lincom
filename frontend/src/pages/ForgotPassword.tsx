import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft, Mail } from "lucide-react";
import { useState } from "react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen">
        <Navigation />
        
        <section className="pt-24 pb-20 flex items-center justify-center min-h-screen">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto">
              <div className="bg-card p-8 rounded-xl shadow-elegant border border-border text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Mail className="h-8 w-8 text-primary" />
                </div>
                
                <h1 className="text-2xl font-bold mb-4">
                  Email envoyé !
                </h1>
                <p className="text-muted-foreground mb-6">
                  Nous avons envoyé les instructions de récupération à <strong>{email}</strong>
                </p>
                
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Vérifiez votre boîte de réception et vos spams.
                  </p>
                  
                  <Button variant="outline" className="w-full" onClick={() => setIsSubmitted(false)}>
                    Renvoyer l'email
                  </Button>
                  
                  <Link to="/login" className="block">
                    <Button variant="ghost" className="w-full">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Retour à la connexion
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <section className="pt-24 pb-20 flex items-center justify-center min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto">
            <div className="bg-card p-8 rounded-xl shadow-elegant border border-border">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-2">
                  Mot de passe oublié ?
                </h1>
                <p className="text-muted-foreground">
                  Entrez votre email pour recevoir les instructions de récupération
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Adresse email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    placeholder="votre.email@example.com"
                    required
                  />
                </div>

                <Button variant="cta" size="lg" className="w-full">
                  <Mail className="mr-2 h-5 w-5" />
                  Envoyer les instructions
                </Button>
              </form>

              <div className="mt-6 text-center">
                <Link to="/login" className="text-primary hover:underline flex items-center justify-center">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Retour à la connexion
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ForgotPassword;