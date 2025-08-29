import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { behavioralSkills } from "@/lib/skillsData";
import { FormData } from "@/lib/auth";

interface BehavioralSkillsStepProps {
  data: Partial<FormData>;
  onUpdate: (data: any) => void;
}

const BehavioralSkillsStep = ({ data, onUpdate }: BehavioralSkillsStepProps) => {
  const selectedSkills = data.behavioralSkills || [];

  const handleSkillChange = (skill: string, checked: boolean) => {
    let updatedSkills;
    if (checked) {
      updatedSkills = [...selectedSkills, skill];
    } else {
      updatedSkills = selectedSkills.filter(s => s !== skill);
    }
    onUpdate({ behavioralSkills: updatedSkills });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">Habilidades comportamentais *</h2>
          <p className="text-muted-foreground mb-4">
            Aponte quais dessas características melhor se identificam com você.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {behavioralSkills.map((skill) => (
            <div key={skill} className="flex items-center space-x-2">
              <Checkbox
                id={skill}
                checked={selectedSkills.includes(skill)}
                onCheckedChange={(checked) => handleSkillChange(skill, checked as boolean)}
              />
              <Label
                htmlFor={skill}
                className="text-sm font-normal cursor-pointer"
              >
                {skill}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BehavioralSkillsStep;