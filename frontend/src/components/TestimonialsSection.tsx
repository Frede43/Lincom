import { Star, Quote } from "lucide-react";
import { useState, useEffect } from "react";

const TestimonialsSection = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      name: "Marie UWIMANA",
      role: "CEO, EcoFarm Solutions",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b601?w=150&h=150&fit=crop&crop=face",
      content: "Grâce au Community Lab, j'ai pu transformer mon idée d'application agricole en startup viable. L'accompagnement et les ressources disponibles sont exceptionnels.",
      rating: 5,
      project: "Application mobile pour agriculteurs"
    },
    {
      name: "Jean NKURUNZIZA",
      role: "Développeur Full-Stack",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      content: "Les formations techniques du Community Lab m'ont permis de maîtriser les technologies modernes. Aujourd'hui, je travaille en remote pour une entreprise européenne.",
      rating: 5,
      project: "Développement web avancé"
    },
    {
      name: "Diane MUKAMANA",
      role: "Designer UX/UI",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      content: "L'environnement collaboratif et les équipements du Fab Lab m'ont aidée à créer des prototypes innovants. Une expérience transformatrice !",
      rating: 5,
      project: "Design thinking & prototypage"
    },
    {
      name: "Paul NDAYISENGA",
      role: "Étudiant en Ingénierie",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      content: "Le programme de mentorat m'a connecté avec des experts qui m'ont guidé dans mes projets. Les connexions que j'ai faites sont inestimables.",
      rating: 5,
      project: "Robotique & IoT"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ce que disent nos{" "}
            <span className="bg-gradient-secondary bg-clip-text text-transparent">
              Innovateurs
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Découvrez les success stories de notre communauté d&apos;entrepreneurs, 
            développeurs et innovateurs.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Main Testimonial */}
          <div className="bg-card rounded-2xl p-8 md:p-12 shadow-elegant border border-border mb-8">
            <div className="flex items-center mb-6">
              <Quote className="h-12 w-12 text-primary/20 mr-4" />
              <div className="flex space-x-1">
                {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                ))}
              </div>
            </div>

            <blockquote className="text-xl md:text-2xl leading-relaxed text-foreground mb-8">
              &ldquo;{testimonials[currentTestimonial].content}&rdquo;
            </blockquote>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <img
                  src={testimonials[currentTestimonial].avatar}
                  alt={testimonials[currentTestimonial].name}
                  className="w-16 h-16 rounded-full border-2 border-primary/20"
                />
                <div>
                  <div className="font-semibold text-lg">
                    {testimonials[currentTestimonial].name}
                  </div>
                  <div className="text-muted-foreground">
                    {testimonials[currentTestimonial].role}
                  </div>
                  <div className="text-sm text-primary font-medium">
                    {testimonials[currentTestimonial].project}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Testimonial Navigation */}
          <div className="flex justify-center space-x-2 mb-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentTestimonial
                    ? "bg-primary scale-125"
                    : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                }`}
              />
            ))}
          </div>

          {/* Other Testimonials Preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials
              .filter((_, index) => index !== currentTestimonial)
              .slice(0, 3)
              .map((testimonial, index) => (
                <div
                  key={index}
                  className="bg-card/50 backdrop-blur-sm p-6 rounded-lg border border-border hover:bg-card transition-colors cursor-pointer"
                  onClick={() => setCurrentTestimonial(testimonials.indexOf(testimonial))}
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <div className="font-medium text-sm">{testimonial.name}</div>
                      <div className="text-xs text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    &ldquo;{testimonial.content}&rdquo;
                  </p>
                </div>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
