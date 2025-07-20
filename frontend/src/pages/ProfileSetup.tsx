import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Upload, Plus, X } from "lucide-react";
import { useState } from "react";

const ProfileSetup = () => {
  const [formData, setFormData] = useState({
    profilePicture: "",
    bio: "",
    location: "",
    linkedin: "",
    twitter: "",
    website: "",
    skills: [] as string[],
    interests: [] as string[],
    shortTermGoals: "",
    longTermGoals: "",
    projectTypes: [] as string[],
    languages: [] as string[]
  });

  const [newSkill, setNewSkill] = useState("");
  const [newInterest, setNewInterest] = useState("");

  const suggestedSkills = [
    "Python", "JavaScript", "React", "Node.js", "Design Thinking", 
    "Marketing Digital", "Gestion de Projet", "Leadership", "Finance", 
    "Data Science", "UX/UI Design", "Business Development"
  ];

  const suggestedInterests = [
    "Intelligence Artificielle", "Développement Durable", "Fintech", 
    "E-commerce", "Éducation", "Santé", "Agriculture", "Énergie",
    "Transport", "Innovation Sociale", "Blockchain", "IoT"
  ];

  const projectTypes = [
    "Applications Web", "Applications Mobile", "IA/Machine Learning",
    "E-commerce", "Fintech", "Edtech", "Agritech", "Healthtech"
  ];

  const languages = [
    "Français", "Anglais", "Kirundi", "Swahili", "Espagnol", "Allemand"
  ];

  const addSkill = (skill: string) => {
    if (skill && !formData.skills.includes(skill)) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skill]
      }));
      setNewSkill("");
    }
  };

  const removeSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  const addInterest = (interest: string) => {
    if (interest && !formData.interests.includes(interest)) {
      setFormData(prev => ({
        ...prev,
        interests: [...prev.interests, interest]
      }));
      setNewInterest("");
    }
  };

  const removeInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.filter(i => i !== interest)
    }));
  };

  const toggleProjectType = (type: string) => {
    setFormData(prev => ({
      ...prev,
      projectTypes: prev.projectTypes.includes(type)
        ? prev.projectTypes.filter(t => t !== type)
        : [...prev.projectTypes, type]
    }));
  };

  const toggleLanguage = (language: string) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.includes(language)
        ? prev.languages.filter(l => l !== language)
        : [...prev.languages, language]
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <Link to="/role-selection" className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="text-center">
              <div className="text-sm text-muted-foreground mb-1">Étape 2 sur 2</div>
              <div className="w-32 h-2 bg-muted rounded-full mx-auto">
                <div className="w-full h-2 bg-primary rounded-full"></div>
              </div>
            </div>
            <div className="w-5"></div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Configurez votre profil
            </h1>
            <p className="text-xl text-muted-foreground">
              Personnalisez votre profil pour recevoir des recommandations adaptées
            </p>
          </div>

          <div className="space-y-8">
            {/* Photo de profil */}
            <div className="bg-card p-6 rounded-xl border border-border">
              <h3 className="text-lg font-semibold mb-4">Photo de profil</h3>
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center">
                  {formData.profilePicture ? (
                    <img src={formData.profilePicture} alt="Profile" className="w-20 h-20 rounded-full object-cover" />
                  ) : (
                    <Upload className="h-8 w-8 text-muted-foreground" />
                  )}
                </div>
                <div>
                  <Button variant="outline" size="sm">
                    <Upload className="mr-2 h-4 w-4" />
                    Choisir une photo
                  </Button>
                  <p className="text-xs text-muted-foreground mt-1">JPG, PNG max 5MB</p>
                </div>
              </div>
            </div>

            {/* Informations personnelles */}
            <div className="bg-card p-6 rounded-xl border border-border">
              <h3 className="text-lg font-semibold mb-4">Informations personnelles</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Bio/Description</label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData(prev => ({...prev, bio: e.target.value}))}
                    className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    rows={3}
                    placeholder="Parlez-nous de vous, vos passions, votre parcours..."
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Localisation</label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({...prev, location: e.target.value}))}
                      className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                      placeholder="Bujumbura, Burundi"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">LinkedIn</label>
                    <input
                      type="url"
                      value={formData.linkedin}
                      onChange={(e) => setFormData(prev => ({...prev, linkedin: e.target.value}))}
                      className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                      placeholder="https://linkedin.com/in/..."
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Compétences */}
            <div className="bg-card p-6 rounded-xl border border-border">
              <h3 className="text-lg font-semibold mb-4">Compétences & Expertise</h3>
              
              <div className="mb-4">
                <div className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addSkill(newSkill)}
                    className="flex-1 px-4 py-2 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    placeholder="Ajouter une compétence..."
                  />
                  <Button onClick={() => addSkill(newSkill)} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {formData.skills.map((skill) => (
                    <span key={skill} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm flex items-center">
                      {skill}
                      <button onClick={() => removeSkill(skill)} className="ml-2">
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground mb-2">Suggestions :</p>
              <div className="flex flex-wrap gap-2">
                {suggestedSkills.filter(skill => !formData.skills.includes(skill)).map((skill) => (
                  <button
                    key={skill}
                    onClick={() => addSkill(skill)}
                    className="bg-muted hover:bg-muted/80 px-3 py-1 rounded-full text-sm transition-colors"
                  >
                    + {skill}
                  </button>
                ))}
              </div>
            </div>

            {/* Centres d'intérêt */}
            <div className="bg-card p-6 rounded-xl border border-border">
              <h3 className="text-lg font-semibold mb-4">Centres d'intérêt</h3>
              
              <div className="mb-4">
                <div className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    value={newInterest}
                    onChange={(e) => setNewInterest(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addInterest(newInterest)}
                    className="flex-1 px-4 py-2 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    placeholder="Ajouter un centre d'intérêt..."
                  />
                  <Button onClick={() => addInterest(newInterest)} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {formData.interests.map((interest) => (
                    <span key={interest} className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-sm flex items-center">
                      {interest}
                      <button onClick={() => removeInterest(interest)} className="ml-2">
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground mb-2">Suggestions :</p>
              <div className="flex flex-wrap gap-2">
                {suggestedInterests.filter(interest => !formData.interests.includes(interest)).map((interest) => (
                  <button
                    key={interest}
                    onClick={() => addInterest(interest)}
                    className="bg-muted hover:bg-muted/80 px-3 py-1 rounded-full text-sm transition-colors"
                  >
                    + {interest}
                  </button>
                ))}
              </div>
            </div>

            {/* Objectifs */}
            <div className="bg-card p-6 rounded-xl border border-border">
              <h3 className="text-lg font-semibold mb-4">Vos objectifs</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Objectifs à court terme (6 mois)</label>
                  <textarea
                    value={formData.shortTermGoals}
                    onChange={(e) => setFormData(prev => ({...prev, shortTermGoals: e.target.value}))}
                    className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    rows={2}
                    placeholder="Qu'aimeriez-vous accomplir dans les 6 prochains mois ?"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Objectifs à long terme (2-5 ans)</label>
                  <textarea
                    value={formData.longTermGoals}
                    onChange={(e) => setFormData(prev => ({...prev, longTermGoals: e.target.value}))}
                    className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    rows={2}
                    placeholder="Quelle est votre vision à long terme ?"
                  />
                </div>
              </div>
            </div>

            {/* Types de projets */}
            <div className="bg-card p-6 rounded-xl border border-border">
              <h3 className="text-lg font-semibold mb-4">Types de projets qui vous intéressent</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {projectTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => toggleProjectType(type)}
                    className={`p-3 rounded-lg border text-sm transition-colors ${
                      formData.projectTypes.includes(type)
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Langues */}
            <div className="bg-card p-6 rounded-xl border border-border">
              <h3 className="text-lg font-semibold mb-4">Langues parlées</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {languages.map((language) => (
                  <button
                    key={language}
                    onClick={() => toggleLanguage(language)}
                    className={`p-3 rounded-lg border text-sm transition-colors ${
                      formData.languages.includes(language)
                        ? "border-accent bg-accent/10 text-accent"
                        : "border-border hover:border-accent/50"
                    }`}
                  >
                    {language}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-8">
            <Link to="/dashboard">
              <Button size="lg" className="px-8">
                Finaliser mon profil
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;