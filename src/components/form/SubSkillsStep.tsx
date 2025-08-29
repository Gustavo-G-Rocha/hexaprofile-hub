import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { subSkillsMap } from "@/lib/skillsData";
import { FormData } from "@/lib/auth";

interface SubSkillsStepProps {
  data: Partial<FormData>;
  onUpdate: (data: any) => void;
}

const SubSkillsStep = ({ data, onUpdate }: SubSkillsStepProps) => {
  const skills = data.skills || [];
  const subSkills = data.subSkills || {};

  const handleSubSkillChange = (mainSkill: string, subSkill: string, checked: boolean) => {
    const currentSubSkills = subSkills[mainSkill] || [];
    let updatedSubSkills;
    
    if (checked) {
      updatedSubSkills = [...currentSubSkills, subSkill];
    } else {
      updatedSubSkills = currentSubSkills.filter(s => s !== subSkill);
    }

    onUpdate({
      subSkills: {
        ...subSkills,
        [mainSkill]: updatedSubSkills
      }
    });
  };

  // Filter skills that have sub-skills defined
  const skillsWithSubSkills = skills.filter(skill => subSkillsMap[skill]);

  if (skillsWithSubSkills.length === 0) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            Nenhuma das áreas selecionadas possui habilidades específicas configuradas ainda.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Continue para a próxima etapa.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">Habilidades Específicas</h2>
          <p className="text-muted-foreground mb-4">
            Selecione as habilidades específicas que melhor se encaixam no seu perfil para cada área escolhida.
          </p>
        </div>

        {skillsWithSubSkills.map((skill) => (
          <Card key={skill}>
            <CardHeader>
              <CardTitle className="text-lg">Habilidades de {skill}</CardTitle>
              <p className="text-sm text-muted-foreground">
                Selecione as habilidades que melhor se encaixam no seu perfil
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {subSkillsMap[skill].map((subSkill) => (
                  <div key={subSkill} className="flex items-center space-x-2">
                    <Checkbox
                      id={`${skill}-${subSkill}`}
                      checked={(subSkills[skill] || []).includes(subSkill)}
                      onCheckedChange={(checked) => 
                        handleSubSkillChange(skill, subSkill, checked as boolean)
                      }
                    />
                    <Label
                      htmlFor={`${skill}-${subSkill}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {subSkill}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SubSkillsStep;