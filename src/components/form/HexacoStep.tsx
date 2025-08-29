import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { hexacoQuestions } from "@/lib/hexaco";
import { FormData } from "@/lib/auth";

interface HexacoStepProps {
  data: Partial<FormData>;
  onUpdate: (data: any) => void;
}

const HexacoStep = ({ data, onUpdate }: HexacoStepProps) => {
  const responses = data.hexacoResponses || {};

  const handleResponseChange = (questionId: string, value: string) => {
    onUpdate({
      hexacoResponses: {
        ...responses,
        [questionId]: parseInt(value)
      }
    });
  };

  const scaleLabels = [
    { value: "1", label: "Discordo totalmente" },
    { value: "2", label: "Discordo parcialmente" },
    { value: "3", label: "Neutro" },
    { value: "4", label: "Concordo parcialmente" },
    { value: "5", label: "Concordo totalmente" }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Instruções para avaliação HEXACO</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Avalie cada uma das 24 afirmações usando a escala de 1 (Discordo totalmente) a 5 (Concordo totalmente). 
            Responda pensando em como você realmente se comporta ou sente, não em como gostaria de ser.
          </p>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {hexacoQuestions.map((question, index) => (
          <Card key={question.id}>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">
                    {index + 1}. {question.text}
                  </h3>
                </div>
                
                <RadioGroup
                  value={responses[question.id]?.toString() || ""}
                  onValueChange={(value) => handleResponseChange(question.id, value)}
                >
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {scaleLabels.map(({ value, label }) => (
                      <div key={value} className="flex items-center space-x-2">
                        <RadioGroupItem 
                          value={value} 
                          id={`${question.id}-${value}`} 
                        />
                        <Label 
                          htmlFor={`${question.id}-${value}`}
                          className="text-sm cursor-pointer"
                        >
                          {label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center text-sm text-muted-foreground">
        {Object.keys(responses).length} de {hexacoQuestions.length} perguntas respondidas
      </div>
    </div>
  );
};

export default HexacoStep;