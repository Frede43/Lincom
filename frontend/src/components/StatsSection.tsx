import { Users, BookOpen, Clock, Wrench } from "lucide-react";

const StatsSection = () => {
  const stats = [
    {
      icon: Users,
      number: "1,234",
      label: "Utilisateurs Actifs",
      description: "Innovateurs, entrepreneurs et étudiants"
    },
    {
      icon: BookOpen,
      number: "89",
      label: "Projets Incubés",
      description: "Startups et projets innovants accompagnés"
    },
    {
      icon: Clock,
      number: "5,670",
      label: "Heures de Formation",
      description: "Dispensées par nos experts"
    },
    {
      icon: Wrench,
      number: "24",
      label: "Équipements",
      description: "Impression 3D, électronique, robotique"
    }
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Notre <span className="bg-gradient-primary bg-clip-text text-transparent">Impact</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Des chiffres qui témoignent de notre engagement envers l&apos;innovation 
            et le développement technologique au Burundi.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center p-6 bg-card rounded-lg shadow-card border border-border hover:shadow-elegant transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <stat.icon className="h-8 w-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-primary mb-2">
                {stat.number}
              </div>
              <div className="text-lg font-semibold mb-2">
                {stat.label}
              </div>
              <div className="text-sm text-muted-foreground">
                {stat.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;