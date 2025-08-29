import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { mainSkills } from "@/lib/skillsData";
import { FormData } from "@/lib/auth";

interface SkillsStepProps {
  data: Partial<FormData>;
  onUpdate: (data: any) => void;
}

const SkillsStep = ({ data, onUpdate }: SkillsStepProps) => {
  const skills = data.skills || [];

  const handleSkillChange = (skill: string, checked: boolean) => {
    let updatedSkills;
    if (checked) {
      updatedSkills = [...skills, skill];
    } else {
      updatedSkills = skills.filter(s => s !== skill);
    }
    onUpdate({ skills: updatedSkills });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">Áreas de conhecimento *</h2>
          <p className="text-muted-foreground mb-4">
            Defina as áreas de conhecimento que você acredita que tem habilidades técnicas sobre.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mainSkills.map((skill) => (
            <div key={skill} className="flex items-center space-x-2">
              <Checkbox
                id={skill}
                checked={skills.includes(skill)}
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

export default SkillsStep;