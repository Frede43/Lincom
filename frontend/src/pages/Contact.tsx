import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { MapPin, Mail, Phone, Clock, Send } from "lucide-react";

const Contact = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      
      <section className="pt-24 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Contactez{" "}
              <span className="bg-gradient-hero bg-clip-text text-transparent">
                Notre Équipe
              </span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Nous sommes là pour répondre à vos questions et vous accompagner 
              dans votre parcours d&apos;innovation.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-card p-8 rounded-xl shadow-card border border-border">
              <h2 className="text-2xl font-bold mb-6">Envoyez-nous un message</h2>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Prénom"
                    className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Nom"
                    className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  />
                </div>
                <input
                  type="email"
                  placeholder="Adresse email"
                  className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                />
                <input
                  type="tel"
                  placeholder="Numéro de téléphone"
                  className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                />
                <select className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none">
                  <option value="">Sujet de votre demande</option>
                  <option value="formation">Formations</option>
                  <option value="incubation">Incubation</option>
                  <option value="fablab">Fab Lab</option>
                  <option value="mentorat">Mentorat</option>
                  <option value="partenariat">Partenariat</option>
                  <option value="autre">Autre</option>
                </select>
                <textarea
                  rows={6}
                  placeholder="Votre message..."
                  className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none"
                />
                <Button variant="cta" size="lg" className="w-full">
                  <Send className="mr-2 h-5 w-5" />
                  Envoyer le message
                </Button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-8">
              <div className="bg-card p-6 rounded-xl shadow-card border border-border">
                <div className="flex items-start space-x-4">
                  <MapPin className="h-6 w-6 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold mb-2">Notre Adresse</h3>
                    <p className="text-muted-foreground">
                      Avenue de l&apos;Innovation, Quartier Kinindo<br />
                      Bujumbura, Burundi
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-card p-6 rounded-xl shadow-card border border-border">
                <div className="flex items-start space-x-4">
                  <Phone className="h-6 w-6 text-secondary mt-1" />
                  <div>
                    <h3 className="font-semibold mb-2">Téléphone</h3>
                    <p className="text-muted-foreground">
                      +257 22 000 000<br />
                      +257 79 000 000
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-card p-6 rounded-xl shadow-card border border-border">
                <div className="flex items-start space-x-4">
                  <Mail className="h-6 w-6 text-accent mt-1" />
                  <div>
                    <h3 className="font-semibold mb-2">Email</h3>
                    <p className="text-muted-foreground">
                      contact@communitylab.bi<br />
                      info@communitylab.bi
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-card p-6 rounded-xl shadow-card border border-border">
                <div className="flex items-start space-x-4">
                  <Clock className="h-6 w-6 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold mb-2">Heures d&apos;ouverture</h3>
                    <div className="text-muted-foreground space-y-1">
                      <p>Lundi - Vendredi: 8h00 - 18h00</p>
                      <p>Samedi: 9h00 - 16h00</p>
                      <p>Dimanche: Fermé</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;