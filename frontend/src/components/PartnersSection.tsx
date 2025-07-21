import {
  UniversiteBurundiLogo,
  ARCTLogo,
  MITLogo,
  USAIDLogo,
  LeoClubLogo,
  BRABankLogo,
  BRBLogo,
  UNDPLogo
} from '@/components/ui/partner-logos'

const PartnersSection = () => {
  const partners = [
    {
      name: "Université du Burundi",
      component: UniversiteBurundiLogo,
      category: "Université"
    },
    {
      name: "MIT Fab Foundation",
      component: MITLogo,
      category: "International"
    },
    {
      name: "ARCT",
      component: ARCTLogo,
      category: "Recherche"
    },
    {
      name: "USAID",
      component: USAIDLogo,
      category: "Développement"
    },
    {
      name: "Econet Leo",
      component: LeoClubLogo,
      category: "Telecom"
    },
    {
      name: "BRARUDI",
      component: BRABankLogo,
      category: "Entreprise"
    },
    {
      name: "Banque de la République du Burundi",
      component: BRBLogo,
      category: "Finance"
    },
    {
      name: "UNDP Burundi",
      component: UNDPLogo,
      category: "International"
    }
  ];

  return (
    <section className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Nos{" "}
            <span className="bg-gradient-accent bg-clip-text text-transparent">
              Partenaires
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Nous collaborons avec des institutions de renom pour offrir 
            la meilleure expérience d&apos;innovation à notre communauté.
          </p>
        </div>

        {/* Partners Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {partners.map((partner, index) => {
            const LogoComponent = partner.component
            return (
              <div
                key={index}
                className="flex flex-col items-center justify-center p-6 bg-card rounded-lg border border-border hover:shadow-card transition-all duration-300 hover:-translate-y-1 group"
              >
                <div className="h-16 w-auto mb-4 grayscale group-hover:grayscale-0 transition-all duration-300">
                  <LogoComponent className="w-full h-full" />
                </div>
                <div className="text-center">
                  <div className="font-medium text-sm group-hover:text-primary transition-colors">
                    {partner.name}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {partner.category}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Partnership Benefits */}
        <div className="bg-muted/30 rounded-2xl p-8 md:p-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">🎓</span>
              </div>
              <h3 className="font-semibold mb-2">Partenaires Académiques</h3>
              <p className="text-sm text-muted-foreground">
                Collaboration avec les meilleures universités pour des programmes certifiants
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">🌍</span>
              </div>
              <h3 className="font-semibold mb-2">Organisations Internationales</h3>
              <p className="text-sm text-muted-foreground">
                Soutien des organisations de développement pour un impact durable
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">🏢</span>
              </div>
              <h3 className="font-semibold mb-2">Partenaires Privés</h3>
              <p className="text-sm text-muted-foreground">
                Connexions avec l&apos;écosystème entrepreneurial et les investisseurs
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;