import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { authService, UserProfile } from "@/lib/auth";
import { dimensionNames } from "@/lib/hexaco";
import { useNavigate } from "react-router-dom";
import HexagonChart from "@/components/HexagonChart";
import { User, Mail, Phone, MapPin, RefreshCw } from "lucide-react";

const UserDashboard = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (!user) {
      navigate("/login");
      return;
    }

    const profiles = authService.getUserProfiles();
    const profile = profiles.find(p => p.id === user.id);
    setUserProfile(profile || null);
  }, [navigate]);

  const handleRetakeForm = () => {
    const user = authService.getCurrentUser();
    if (user && userProfile) {
      // Remove the completedAt date but keep the form data and HEXACO responses
      const updatedProfile = { ...userProfile };
      delete updatedProfile.completedAt;
      
      // Save the updated profile
      authService.saveUserProfile(user.id, updatedProfile.formData as any);
      
      // Navigate to form
      navigate("/form");
    }
  };

  if (!userProfile || !userProfile.formData) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Bem-vindo!</h2>
              <p className="text-muted-foreground mb-6">
                Você ainda não completou sua avaliação HEXACO.
              </p>
              <Button onClick={() => navigate("/form")}>
                Iniciar Avaliação
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const { formData } = userProfile;

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Seu Perfil HEXACO</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleRetakeForm}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refazer Avaliação
            </Button>
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
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Informações Pessoais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>{formData.personalInfo.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{formData.personalInfo.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{formData.personalInfo.whatsapp}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{formData.personalInfo.state}</span>
              </div>
              
              {/* MBL Information */}
              {(formData.personalInfo.isMblCoordinator !== undefined || formData.personalInfo.mblAcademyStatus) && (
                <div className="pt-2 border-t">
                  <h4 className="text-sm font-semibold mb-2">Informações MBL</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Coordenador MBL:</span>
                      <Badge variant={formData.personalInfo.isMblCoordinator ? "default" : "secondary"}>
                        {formData.personalInfo.isMblCoordinator ? "Sim" : "Não"}
                      </Badge>
                    </div>
                    {formData.personalInfo.mblAcademyStatus && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Academia MBL:</span>
                        <Badge variant="outline">
                          {formData.personalInfo.mblAcademyStatus}
                        </Badge>
                      </div>
                    )}
                    {formData.personalInfo.mblHistory && (
                      <div className="space-y-1">
                        <span className="text-sm font-medium">História na militância do MBL:</span>
                        <div className="p-2 bg-muted rounded-md">
                          <p className="text-xs">{formData.personalInfo.mblHistory}</p>
                        </div>
                      </div>
                    )}
                    {formData.personalInfo.wasMissionCollector !== undefined && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Coletor da Missão:</span>
                        <Badge variant={formData.personalInfo.wasMissionCollector ? "default" : "secondary"}>
                          {formData.personalInfo.wasMissionCollector ? "Sim" : "Não"}
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Photo */}
              {formData.personalInfo.photo && (
                <div className="pt-2">
                  <span className="text-sm font-medium">Foto:</span>
                  <div className="mt-2">
                    <img 
                      src={formData.personalInfo.photo} 
                      alt="Foto do perfil" 
                      className="w-20 h-20 object-cover rounded-full border"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* HEXACO Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Seu HEXACO</CardTitle>
            </CardHeader>
            <CardContent>
              {formData.hexacoScores ? (
                <HexagonChart scores={formData.hexacoScores} />
              ) : (
                <p className="text-muted-foreground">Scores não disponíveis</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* HEXACO Detailed Scores */}
        {formData.hexacoScores && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Dimensões HEXACO Detalhadas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(formData.hexacoScores).map(([dimension, score]) => (
                  <div key={dimension} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">
                        {dimensionNames[dimension as keyof typeof dimensionNames]}
                      </h3>
                      <Badge variant={score >= 60 ? "default" : score >= 40 ? "secondary" : "destructive"}>
                        {Math.round(score)}%
                      </Badge>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${Math.max(score, 0)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Skills */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Áreas de Conhecimento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {formData.skills.map((skill) => (
                  <Badge key={skill} variant="outline">
                    {skill}
                  </Badge>
                ))}
              </div>
              
              {/* Sub Skills */}
              {formData.subSkills && Object.keys(formData.subSkills).length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold">Especializações:</h4>
                  {Object.entries(formData.subSkills).map(([area, subSkills]) => (
                    <div key={area} className="space-y-2">
                      <span className="text-xs font-medium text-muted-foreground">{area}:</span>
                      <div className="flex flex-wrap gap-1">
                        {subSkills.map((subSkill) => (
                          <Badge key={subSkill} variant="secondary" className="text-xs">
                            {subSkill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Habilidades Comportamentais</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {formData.behavioralSkills.map((skill) => (
                  <Badge key={skill} variant="outline">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Curriculum */}
        {formData.curriculum && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Resumo Profissional</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.curriculum.experiences.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Experiências Profissionais</h3>
                  <div className="space-y-2">
                    {formData.curriculum.experiences.map((exp, index) => (
                      <div key={index} className="border-l-2 border-primary pl-4">
                        <h4 className="font-medium">{exp.role}</h4>
                        <p className="text-sm text-muted-foreground">{exp.company}</p>
                        <p className="text-xs text-muted-foreground">{exp.duration}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {formData.curriculum.languages.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Idiomas</h3>
                  <div className="flex flex-wrap gap-2">
                    {formData.curriculum.languages.map((lang) => (
                      <Badge key={lang} variant="secondary">
                        {lang}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {formData.curriculum.education && formData.curriculum.education.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Formação</h3>
                  <div className="space-y-2">
                    {formData.curriculum.education.map((edu, index) => (
                      <div key={index} className="border-l-2 border-secondary pl-4">
                        <h4 className="font-medium">{edu.course}</h4>
                        <p className="text-sm text-muted-foreground">{edu.institution}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Final Questions */}
        {(formData.importantTruth || formData.isPublicServant) && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Perguntas Finais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.importantTruth && (
                <div className="space-y-2">
                  <h4 className="font-medium">Sobre que verdade importante pouquíssimas pessoas concordam com você?</h4>
                  <div className="p-3 bg-muted rounded-md">
                    <p className="text-sm">{formData.importantTruth}</p>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Servidor público:</span>
                  <Badge variant={formData.isPublicServant ? "default" : "secondary"}>
                    {formData.isPublicServant ? "Sim" : "Não"}
                  </Badge>
                </div>

                {formData.isPublicServant && formData.publicServiceArea && (
                  <div className="ml-4">
                    <span className="text-sm font-medium">Área de atuação:</span>
                    <p className="text-sm text-muted-foreground mt-1">{formData.publicServiceArea}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;