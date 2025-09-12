import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { languages } from "@/lib/skillsData";
import { FormData } from "@/lib/auth";
import { Plus, Trash2 } from "lucide-react";

interface CurriculumStepProps {
  data: Partial<FormData>;
  onUpdate: (data: any) => void;
}

const CurriculumStep = ({ data, onUpdate }: CurriculumStepProps) => {
  const curriculum = data.curriculum || {
    experiences: [],
    languages: [],
    portfolio: "",
    education: []
  };

  const updateCurriculum = (field: string, value: any) => {
    onUpdate({
      curriculum: {
        ...curriculum,
        [field]: value
      }
    });
  };

  const addExperience = () => {
    const newExperiences = [...curriculum.experiences, { role: "", company: "", duration: "" }];
    updateCurriculum("experiences", newExperiences);
  };

  const removeExperience = (index: number) => {
    const newExperiences = curriculum.experiences.filter((_, i) => i !== index);
    updateCurriculum("experiences", newExperiences);
  };

  const updateExperience = (index: number, field: string, value: string) => {
    const newExperiences = curriculum.experiences.map((exp, i) => 
      i === index ? { ...exp, [field]: value } : exp
    );
    updateCurriculum("experiences", newExperiences);
  };

  const addEducation = () => {
    const newEducation = [...curriculum.education, { course: "", institution: "", educationLevel: "" }];
    updateCurriculum("education", newEducation);
  };

  const removeEducation = (index: number) => {
    const newEducation = curriculum.education.filter((_, i) => i !== index);
    updateCurriculum("education", newEducation);
  };

  const updateEducation = (index: number, field: string, value: string) => {
    const newEducation = curriculum.education.map((edu, i) => 
      i === index ? { ...edu, [field]: value } : edu
    );
    updateCurriculum("education", newEducation);
  };

  const handleLanguageChange = (language: string, checked: boolean) => {
    let updatedLanguages;
    if (checked) {
      updatedLanguages = [...curriculum.languages, language];
    } else {
      updatedLanguages = curriculum.languages.filter(l => l !== language);
    }
    updateCurriculum("languages", updatedLanguages);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Currículo</h2>
        <p className="text-muted-foreground mb-6">
          A partir de agora faremos perguntas sobre o seu currículo
        </p>
      </div>

      {/* Professional Experiences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Últimas experiências profissionais
            <Button onClick={addExperience} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar
            </Button>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Descreva as três últimas funções que exerceu, o tempo que ficou nela e o nome da instituição. 
            Se não houver três, preencha só o que tiver.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {curriculum.experiences.map((exp, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Experiência {index + 1}</h4>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removeExperience(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="grid md:grid-cols-3 gap-3">
                <div>
                  <Label>Cargo/Função</Label>
                  <Input
                    value={exp.role}
                    onChange={(e) => updateExperience(index, "role", e.target.value)}
                    placeholder="Ex: Analista de Marketing"
                  />
                </div>
                <div>
                  <Label>Empresa/Instituição</Label>
                  <Input
                    value={exp.company}
                    onChange={(e) => updateExperience(index, "company", e.target.value)}
                    placeholder="Ex: Tech Company Ltda"
                  />
                </div>
                <div>
                  <Label>Período</Label>
                  <Input
                    value={exp.duration}
                    onChange={(e) => updateExperience(index, "duration", e.target.value)}
                    placeholder="Ex: Jan 2020 - Dez 2022"
                  />
                </div>
              </div>
            </div>
          ))}
          
          {curriculum.experiences.length === 0 && (
            <p className="text-center text-muted-foreground py-4">
              Nenhuma experiência adicionada ainda. Clique em "Adicionar" para começar.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Languages */}
      <Card>
        <CardHeader>
          <CardTitle>Quais idiomas você fala FLUENTEMENTE?</CardTitle>
          <p className="text-sm text-muted-foreground">
            Idiomas que você tenha fluência tanto de conversação quanto de escrita
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {languages.map((language) => (
              <div key={language} className="flex items-center space-x-2">
                <Checkbox
                  id={language}
                  checked={curriculum.languages.includes(language)}
                  onCheckedChange={(checked) => handleLanguageChange(language, checked as boolean)}
                />
                <Label htmlFor={language} className="text-sm cursor-pointer">
                  {language}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Portfolio */}
      <Card>
        <CardHeader>
          <CardTitle>Tem portfólio/GitHub?</CardTitle>
          <p className="text-sm text-muted-foreground">
            Insira o link abaixo
          </p>
        </CardHeader>
        <CardContent>
          <Input
            value={curriculum.portfolio}
            onChange={(e) => updateCurriculum("portfolio", e.target.value)}
            placeholder="https://github.com/seuusuario ou https://seuportfolio.com"
          />
        </CardContent>
      </Card>

      {/* Education */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Insira sua formação
            <Button onClick={addEducation} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar
            </Button>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            O campo deve conter o nome do curso e a instituição de ensino
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {curriculum.education.map((edu, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Formação {index + 1}</h4>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removeEducation(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-3">
                <div>
                  <Label>Nível de Escolaridade</Label>
                  <Select 
                    value={edu.educationLevel || ""} 
                    onValueChange={(value) => updateEducation(index, "educationLevel", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o nível de escolaridade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ensino-fundamental">Ensino Fundamental</SelectItem>
                      <SelectItem value="ensino-medio">Ensino Médio</SelectItem>
                      <SelectItem value="ensino-tecnico">Ensino Técnico</SelectItem>
                      <SelectItem value="ensino-superior">Ensino Superior</SelectItem>
                      <SelectItem value="pos-graduacao">Pós-graduação</SelectItem>
                      <SelectItem value="mestrado">Mestrado</SelectItem>
                      <SelectItem value="doutorado">Doutorado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <Label>Curso</Label>
                    <Input
                      value={edu.course}
                      onChange={(e) => updateEducation(index, "course", e.target.value)}
                      placeholder="Ex: Bacharelado em Ciência da Computação"
                    />
                  </div>
                  <div>
                    <Label>Instituição de Ensino</Label>
                    <Input
                      value={edu.institution}
                      onChange={(e) => updateEducation(index, "institution", e.target.value)}
                      placeholder="Ex: Universidade Federal de São Paulo"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {curriculum.education.length === 0 && (
            <p className="text-center text-muted-foreground py-4">
              Nenhuma formação adicionada ainda. Clique em "Adicionar" para começar.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Final Questions */}
      <Card>
        <CardHeader>
          <CardTitle>Perguntas Finais</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Label htmlFor="important-truth" className="text-sm font-medium">
              Sobre que verdade importante pouquíssimas pessoas concordam com você? *
            </Label>
            <Textarea
              id="important-truth"
              value={data.importantTruth || ""}
              onChange={(e) => onUpdate({ importantTruth: e.target.value })}
              placeholder="Digite sua resposta aqui..."
              rows={4}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="public-servant"
                checked={data.isPublicServant || false}
                onCheckedChange={(checked) => onUpdate({ isPublicServant: checked as boolean })}
              />
              <Label htmlFor="public-servant" className="text-sm font-medium">
                Você é servidor público?
              </Label>
            </div>
            
            {data.isPublicServant && (
              <div className="space-y-2 pl-6">
                <Label htmlFor="public-area" className="text-sm">
                  Em qual área?
                </Label>
                <Input
                  id="public-area"
                  value={data.publicServiceArea || ""}
                  onChange={(e) => onUpdate({ publicServiceArea: e.target.value })}
                  placeholder="Digite a área de atuação"
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CurriculumStep;