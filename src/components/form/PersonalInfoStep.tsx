import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormData } from "@/lib/auth";

interface PersonalInfoStepProps {
  data: Partial<FormData>;
  onUpdate: (data: any) => void;
}

const PersonalInfoStep = ({ data, onUpdate }: PersonalInfoStepProps) => {
  const personalInfo = data.personalInfo || {
    name: "",
    whatsapp: "",
    email: "",
    confirmEmail: "",
    state: ""
  };

  const handleChange = (field: string, value: string) => {
    onUpdate({
      personalInfo: {
        ...personalInfo,
        [field]: value
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nome completo *</Label>
          <Input
            id="name"
            value={personalInfo.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="Digite seu nome completo"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="whatsapp">Qual é o seu número de WhatsApp? *</Label>
          <Input
            id="whatsapp"
            value={personalInfo.whatsapp}
            onChange={(e) => handleChange("whatsapp", e.target.value)}
            placeholder="(xx) xxxxx-xxxx"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={personalInfo.email}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="seu@email.com"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmEmail">Confirme seu email *</Label>
          <Input
            id="confirmEmail"
            type="email"
            value={personalInfo.confirmEmail}
            onChange={(e) => handleChange("confirmEmail", e.target.value)}
            placeholder="seu@email.com"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="state">Estado que você mora atualmente *</Label>
          <Input
            id="state"
            value={personalInfo.state}
            onChange={(e) => handleChange("state", e.target.value)}
            placeholder="Digite seu estado"
            required
          />
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoStep;