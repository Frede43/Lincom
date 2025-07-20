import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Mail, CheckCircle, RefreshCw } from "lucide-react";
import { useState } from "react";

const EmailVerification = () => {
  const [resendCount, setResendCount] = useState(0);
  const [isVerified, setIsVerified] = useState(false);

  const handleResend = () => {
    setResendCount(prev => prev + 1);
  };

  if (isVerified) {
    return (
      <div className="min-h-screen">
        <Navigation />
        
        <section className="pt-24 pb-20 flex items-center justify-center min-h-screen">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto">
              <div className="bg-card p-8 rounded-xl shadow-elegant border border-border text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                
                <h1 className="text-2xl font-bold mb-4">
                  Email vérifié !
                </h1>
                <p className="text-muted-foreground mb-6">
                  Votre compte a été vérifié avec succès. Vous pouvez maintenant accéder à toutes les fonctionnalités.
                </p>
                
                <Link to="/onboarding">
                  <Button variant="cta" size="lg" className="w-full">
                    Commencer l'expérience
                  </Button>
                </Link>
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
            <div className="bg-card p-8 rounded-xl shadow-elegant border border-border text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Mail className="h-8 w-8 text-primary" />
              </div>
              
              <h1 className="text-2xl font-bold mb-4">
                Vérifiez votre email
              </h1>
              <p className="text-muted-foreground mb-6">
                Nous avons envoyé un lien de vérification à votre adresse email. 
                Cliquez sur le lien pour activer votre compte.
              </p>
              
              <div className="space-y-4">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Si vous ne voyez pas l'email, vérifiez votre dossier spam ou courrier indésirable.
                  </p>
                </div>
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={handleResend}
                  disabled={resendCount >= 3}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  {resendCount >= 3 ? "Limite atteinte" : "Renvoyer l'email"}
                </Button>
                
                {resendCount > 0 && (
                  <p className="text-sm text-green-600">
                    Email renvoyé ! ({resendCount}/3)
                  </p>
                )}
                
                <div className="pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground mb-4">
                    Problème avec la vérification ?
                  </p>
                  <Link to="/contact" className="text-primary hover:underline text-sm">
                    Contactez notre support
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EmailVerification;