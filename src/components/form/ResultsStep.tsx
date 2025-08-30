import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FormData } from "@/lib/auth";
import { dimensionNames } from "@/lib/hexaco";
import HexagonChart from "@/components/HexagonChart";
import { CheckCircle, User, Mail, Phone, MapPin } from "lucide-react";

interface ResultsStepProps {
  data: Partial<FormData>;
  onUpdate: (data: any) => void;
}

const ResultsStep = ({ data }: ResultsStepProps) => {
  if (!data.hexacoScores) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          Calculando seus resultados HEXACO...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Avaliação Concluída!</h2>
        <p className="text-muted-foreground">
          Aqui está o seu perfil HEXACO completo
        </p>
      </div>

      {/* Personal Information Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Informações Pessoais</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {data.personalInfo && (
            <>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>{data.personalInfo.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{data.personalInfo.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{data.personalInfo.whatsapp}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{data.personalInfo.state}</span>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* HEXACO Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Seu Perfil HEXACO</CardTitle>
        </CardHeader>
        <CardContent>
          <HexagonChart scores={data.hexacoScores} />
        </CardContent>
      </Card>

      {/* HEXACO Detailed Scores */}
      <Card>
        <CardHeader>
          <CardTitle>Pontuações Detalhadas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(data.hexacoScores).map(([dimension, score]) => (
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

      {/* Skills Summary with Sub-skills */}
      <div className="space-y-6">
        {/* Main Skills with Sub-skills */}
        {data.skills && data.skills.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Áreas de Conhecimento e Especialidades</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {data.skills.map((skill) => (
                <div key={skill} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="default" className="text-sm font-medium">
                      {skill}
                    </Badge>
                  </div>
                  
                  {/* Show sub-skills for this area */}
                  {data.subSkills && data.subSkills[skill] && data.subSkills[skill].length > 0 && (
                    <div className="ml-4 space-y-2">
                      <h4 className="text-sm font-medium text-muted-foreground">
                        Especialidades:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {data.subSkills[skill].map((subSkill) => (
                          <Badge key={subSkill} variant="secondary" className="text-xs">
                            {subSkill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Behavioral Skills */}
        {data.behavioralSkills && data.behavioralSkills.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Habilidades Comportamentais</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {data.behavioralSkills.map((skill) => (
                  <Badge key={skill} variant="outline">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Professional Summary */}
      {data.curriculum && (
        <Card>
          <CardHeader>
            <CardTitle>Resumo Profissional</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.curriculum.experiences && data.curriculum.experiences.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Experiências Profissionais</h3>
                <div className="space-y-2">
                  {data.curriculum.experiences.map((exp, index) => (
                    <div key={index} className="border-l-2 border-primary pl-4">
                      <h4 className="font-medium">{exp.role}</h4>
                      <p className="text-sm text-muted-foreground">{exp.company}</p>
                      <p className="text-xs text-muted-foreground">{exp.duration}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {data.curriculum.languages && data.curriculum.languages.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Idiomas</h3>
                <div className="flex flex-wrap gap-2">
                  {data.curriculum.languages.map((lang) => (
                    <Badge key={lang} variant="secondary">
                      {lang}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {data.curriculum.education && data.curriculum.education.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Formação</h3>
                <div className="space-y-2">
                  {data.curriculum.education.map((edu, index) => (
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
    </div>
  );
};

export default ResultsStep;