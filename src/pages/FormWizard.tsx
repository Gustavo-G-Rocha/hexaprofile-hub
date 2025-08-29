import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import PersonalInfoStep from "@/components/form/PersonalInfoStep";
import SkillsStep from "@/components/form/SkillsStep";
import SubSkillsStep from "@/components/form/SubSkillsStep";
import BehavioralSkillsStep from "@/components/form/BehavioralSkillsStep";
import HexacoStep from "@/components/form/HexacoStep";
import CurriculumStep from "@/components/form/CurriculumStep";
import ResultsStep from "@/components/form/ResultsStep";
import { FormData, authService } from "@/lib/auth";
import { calculateHexacoScores } from "@/lib/hexaco";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const FormWizard = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Partial<FormData>>({
    personalInfo: {
      name: "",
      whatsapp: "",
      email: "",
      confirmEmail: "",
      state: ""
    },
    skills: [],
    subSkills: {},
    behavioralSkills: [],
    hexacoResponses: {},
    curriculum: {
      experiences: [],
      languages: [],
      portfolio: "",
      education: []
    }
  });

  const navigate = useNavigate();
  const { toast } = useToast();

  const steps = [
    { title: "Informações Pessoais", component: PersonalInfoStep },
    { title: "Áreas de Conhecimento", component: SkillsStep },
    { title: "Habilidades Específicas", component: SubSkillsStep },
    { title: "Habilidades Comportamentais", component: BehavioralSkillsStep },
    { title: "Avaliação HEXACO", component: HexacoStep },
    { title: "Currículo", component: CurriculumStep },
    { title: "Resultados", component: ResultsStep }
  ];

  const handleNext = () => {
    if (currentStep === steps.length - 2) {
      // Calculate HEXACO scores before moving to results
      const scores = calculateHexacoScores(formData.hexacoResponses || {});
      setFormData(prev => ({ ...prev, hexacoScores: scores }));
      
      // Save complete form data
      const user = authService.getCurrentUser();
      if (user) {
        authService.saveUserProfile(user.id, formData as FormData);
        toast({
          title: "Avaliação concluída!",
          description: "Seus dados foram salvos com sucesso."
        });
      }
    }
    setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  };

  const handlePrev = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const handleFinish = () => {
    navigate("/dashboard");
  };

  const updateFormData = (stepData: any) => {
    setFormData(prev => ({ ...prev, ...stepData }));
  };

  const CurrentStepComponent = steps[currentStep].component;
  const progress = ((currentStep + 1) / steps.length) * 100;

  // Check if user is logged in
  const user = authService.getCurrentUser();
  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center mb-4">
              <CardTitle>Avaliação HEXACO - {steps[currentStep].title}</CardTitle>
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
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-muted-foreground">
              Etapa {currentStep + 1} de {steps.length}
            </p>
          </CardHeader>
          
          <CardContent>
            <CurrentStepComponent 
              data={formData} 
              onUpdate={updateFormData}
            />
            
            <div className="flex justify-between mt-8">
              <Button 
                variant="outline" 
                onClick={handlePrev}
                disabled={currentStep === 0}
              >
                Anterior
              </Button>
              
              {currentStep === steps.length - 1 ? (
                <Button onClick={handleFinish}>
                  Finalizar
                </Button>
              ) : (
                <Button onClick={handleNext}>
                  Próximo
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FormWizard;