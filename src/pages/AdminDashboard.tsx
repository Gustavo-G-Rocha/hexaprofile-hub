import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { authService, UserProfile } from "@/lib/auth";
import { dimensionNames } from "@/lib/hexaco";
import { useNavigate } from "react-router-dom";
import { Search, User, MapPin, Briefcase } from "lucide-react";

const AdminDashboard = () => {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProfiles, setFilteredProfiles] = useState<UserProfile[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (!user || !user.isAdmin) {
      navigate("/login");
      return;
    }

    const allProfiles = authService.getUserProfiles();
    setProfiles(allProfiles);
    setFilteredProfiles(allProfiles);
  }, [navigate]);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredProfiles(profiles);
      return;
    }

    const filtered = profiles.filter(profile => {
      const formData = profile.formData;
      if (!formData) return false;

      const searchLower = searchTerm.toLowerCase();
      
      // Search in personal info
      const personalMatch = 
        formData.personalInfo.name.toLowerCase().includes(searchLower) ||
        formData.personalInfo.state.toLowerCase().includes(searchLower);

      // Search in skills
      const skillsMatch = formData.skills.some(skill => 
        skill.toLowerCase().includes(searchLower)
      );

      // Search in behavioral skills
      const behavioralMatch = formData.behavioralSkills.some(skill =>
        skill.toLowerCase().includes(searchLower)
      );

      return personalMatch || skillsMatch || behavioralMatch;
    });

    setFilteredProfiles(filtered);
  }, [searchTerm, profiles]);

  const getHexagonColor = (dimension: string, score: number) => {
    if (score >= 75) return "bg-green-500";
    if (score >= 50) return "bg-yellow-500";
    if (score >= 25) return "bg-orange-500";
    return "bg-red-500";
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Painel Administrativo</h1>
          <Button 
            variant="outline" 
            onClick={() => {
              authService.logout();
              navigate("/login");
            }}
          >
            Sair
          </Button>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Buscar Perfis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              placeholder="Busque por nome, cidade, área de conhecimento ou habilidade..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
            <p className="text-sm text-muted-foreground mt-2">
              {filteredProfiles.length} perfis encontrados
            </p>
          </CardContent>
        </Card>

        <div className="grid gap-6">
          {filteredProfiles.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">
                  {searchTerm ? "Nenhum perfil encontrado com os critérios de busca." : "Nenhum perfil cadastrado ainda."}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredProfiles.map((profile) => {
              const formData = profile.formData;
              if (!formData) return null;

              return (
                <Card key={profile.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <CardTitle className="flex items-center gap-2">
                          <User className="h-5 w-5" />
                          {formData.personalInfo.name}
                        </CardTitle>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {formData.personalInfo.state}
                          </div>
                          <div className="flex items-center gap-1">
                            <Briefcase className="h-4 w-4" />
                            {formData.personalInfo.email}
                          </div>
                        </div>
                      </div>
                      <Badge variant="secondary">
                        {profile.completedAt ? 
                          new Date(profile.completedAt).toLocaleDateString('pt-BR') : 
                          'Em andamento'
                        }
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Skills Section */}
                      <div className="space-y-4">
                        <h3 className="font-semibold">Áreas de Conhecimento</h3>
                        <div className="flex flex-wrap gap-2">
                          {formData.skills.slice(0, 3).map((skill) => (
                            <Badge key={skill} variant="outline">
                              {skill}
                            </Badge>
                          ))}
                          {formData.skills.length > 3 && (
                            <Badge variant="secondary">
                              +{formData.skills.length - 3} mais
                            </Badge>
                          )}
                        </div>

                        <h3 className="font-semibold">Habilidades Comportamentais</h3>
                        <div className="flex flex-wrap gap-2">
                          {formData.behavioralSkills.slice(0, 4).map((skill) => (
                            <Badge key={skill} variant="outline">
                              {skill}
                            </Badge>
                          ))}
                          {formData.behavioralSkills.length > 4 && (
                            <Badge variant="secondary">
                              +{formData.behavioralSkills.length - 4} mais
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* HEXACO Scores */}
                      <div className="space-y-4">
                        <h3 className="font-semibold">Perfil HEXACO</h3>
                        {formData.hexacoScores ? (
                          <div className="space-y-2">
                            {Object.entries(formData.hexacoScores).map(([dimension, score]) => (
                              <div key={dimension} className="flex items-center justify-between">
                                <span className="text-sm font-medium">
                                  {dimensionNames[dimension as keyof typeof dimensionNames]}
                                </span>
                                <div className="flex items-center gap-2">
                                  <div className="w-20 bg-muted rounded-full h-2">
                                    <div
                                      className={`h-full rounded-full ${getHexagonColor(dimension, score)}`}
                                      style={{ width: `${Math.max(score, 0)}%` }}
                                    />
                                  </div>
                                  <span className="text-xs w-8 text-right">
                                    {Math.round(score)}%
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            Avaliação HEXACO não concluída
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;