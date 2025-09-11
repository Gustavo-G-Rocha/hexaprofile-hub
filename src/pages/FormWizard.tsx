import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
  const [hexacoCompleted, setHexacoCompleted] = useState(false);
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

  // Check if user has already completed HEXACO
  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user) {
      const profiles = authService.getUserProfiles();
      const userProfile = profiles.find(p => p.id === user.id);
      
      if (userProfile?.formData) {
        // Load existing form data
        setFormData(userProfile.formData);
        
        // Check if HEXACO is already completed
        if (userProfile.formData.hexacoResponses && 
            Object.keys(userProfile.formData.hexacoResponses).length >= 24) {
          setHexacoCompleted(true);
        }
      }
    }
  }, []);

  const steps = [
    { title: "Informações Pessoais", component: PersonalInfoStep },
    { title: "Áreas de Conhecimento", component: SkillsStep },
    { title: "Habilidades Específicas", component: SubSkillsStep },
    { title: "Habilidades Comportamentais", component: BehavioralSkillsStep },
    { title: "Avaliação HEXACO", component: HexacoStep },
    { title: "Currículo", component: CurriculumStep },
    { title: "Resultados", component: ResultsStep }
  ];

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 0: // Personal Info
        const { name, whatsapp, email, confirmEmail, state } = formData.personalInfo || {};
        if (!name || !whatsapp || !email || !confirmEmail || !state) {
          toast({
            title: "Campos obrigatórios",
            description: "Por favor, preencha todos os campos obrigatórios.",
            variant: "destructive"
          });
          return false;
        }
        if (email !== confirmEmail) {
          toast({
            title: "Emails não coincidem",
            description: "Os emails digitados não são iguais.",
            variant: "destructive"
          });
          return false;
        }
        return true;
      
      case 1: // Skills
        if (!formData.skills || formData.skills.length === 0) {
          toast({
            title: "Seleção obrigatória",
            description: "Selecione pelo menos uma área de conhecimento.",
            variant: "destructive"
          });
          return false;
        }
        return true;
      
      case 2: // SubSkills - não obrigatório
        return true;
      
      case 3: // Behavioral Skills
        if (!formData.behavioralSkills || formData.behavioralSkills.length === 0) {
          toast({
            title: "Seleção obrigatória",
            description: "Selecione pelo menos uma habilidade comportamental.",
            variant: "destructive"
          });
          return false;
        }
        return true;
      
      case 4: // HEXACO
        const responses = formData.hexacoResponses || {};
        if (Object.keys(responses).length < 24) {
          toast({
            title: "Avaliação incompleta",
            description: "Responda todas as 24 perguntas da avaliação HEXACO.",
            variant: "destructive"
          });
          return false;
        }
        return true;
      
      case 5: // Curriculum + Final Questions
        const { experiences, languages, education } = formData.curriculum || {};
        if (!experiences || experiences.length === 0) {
          toast({
            title: "Experiência obrigatória",
            description: "Adicione pelo menos uma experiência profissional.",
            variant: "destructive"
          });
          return false;
        }
        
        // Validar se todas as experiências têm campos preenchidos
        const incompleteExp = experiences.some(exp => !exp.role || !exp.company || !exp.duration);
        if (incompleteExp) {
          toast({
            title: "Experiência incompleta",
            description: "Preencha todos os campos das experiências profissionais.",
            variant: "destructive"
          });
          return false;
        }
        
        if (!languages || languages.length === 0) {
          toast({
            title: "Idioma obrigatório",
            description: "Selecione pelo menos um idioma que você fala fluentemente.",
            variant: "destructive"
          });
          return false;
        }
        
        if (!education || education.length === 0) {
          toast({
            title: "Formação obrigatória",
            description: "Adicione pelo menos uma formação acadêmica.",
            variant: "destructive"
          });
          return false;
        }
        
        // Validar se todas as formações têm campos preenchidos
        const incompleteEdu = education.some(edu => !edu.course || !edu.institution);
        if (incompleteEdu) {
          toast({
            title: "Formação incompleta",
            description: "Preencha todos os campos das formações acadêmicas.",
            variant: "destructive"
          });
          return false;
        }
        
        // Validar pergunta obrigatória sobre verdade importante
        const { importantTruth } = formData;
        if (!importantTruth || importantTruth.trim() === '') {
          toast({
            title: "Resposta obrigatória",
            description: "Por favor, responda à pergunta sobre verdade importante.",
            variant: "destructive"
          });
          return false;
        }
        
        return true;
      
      case 6: // Results - apenas visualização
        return true;
      
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (!validateCurrentStep()) {
      return;
    }
    
    // Skip HEXACO step if already completed
    let nextStep = currentStep + 1;
    if (nextStep === 4 && hexacoCompleted) {
      nextStep = 5; // Skip to Curriculum step
      toast({
        title: "Avaliação HEXACO já concluída",
        description: "Você já completou a avaliação HEXACO anteriormente."
      });
    }
    
    if (currentStep === steps.length - 2) {
      // Calculate HEXACO scores before moving to results (only if not already completed)
      let scores = formData.hexacoScores;
      if (!hexacoCompleted && formData.hexacoResponses) {
        scores = calculateHexacoScores(formData.hexacoResponses);
      }
      const updatedFormData = { ...formData, hexacoScores: scores };
      setFormData(updatedFormData);
      
      // Save complete form data
      const user = authService.getCurrentUser();
      if (user) {
        authService.saveUserProfile(user.id, updatedFormData as FormData);
        toast({
          title: "Avaliação concluída!",
          description: "Seus dados foram salvos com sucesso."
        });
      }
    }
    setCurrentStep(Math.min(nextStep, steps.length - 1));
  };

  const handlePrev = () => {
    // Skip HEXACO step when going back if already completed
    let prevStep = currentStep - 1;
    if (prevStep === 4 && hexacoCompleted) {
      prevStep = 3; // Skip back to Behavioral Skills step
    }
    setCurrentStep(Math.max(prevStep, 0));
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
            {currentStep === 4 && hexacoCompleted ? (
              <Alert>
                <AlertDescription>
                  Você já completou a avaliação HEXACO anteriormente. Esta etapa não pode ser refeita.
                  Seus resultados anteriores serão mantidos.
                </AlertDescription>
              </Alert>
            ) : (
              <CurrentStepComponent 
                data={formData} 
                onUpdate={updateFormData}
              />
            )}
            
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