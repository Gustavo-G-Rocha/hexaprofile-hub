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

  const formatPhoneNumber = (value: string) => {
    // Remove todos os caracteres não numéricos
    const numbers = value.replace(/\D/g, '');
    
    // Limita a 11 dígitos
    const limitedNumbers = numbers.slice(0, 11);
    
    // Aplica a máscara baseada no tamanho
    if (limitedNumbers.length <= 2) {
      return limitedNumbers;
    } else if (limitedNumbers.length <= 6) {
      return `(${limitedNumbers.slice(0, 2)}) ${limitedNumbers.slice(2)}`;
    } else if (limitedNumbers.length <= 10) {
      return `(${limitedNumbers.slice(0, 2)}) ${limitedNumbers.slice(2, 6)}-${limitedNumbers.slice(6)}`;
    } else {
      return `(${limitedNumbers.slice(0, 2)}) ${limitedNumbers.slice(2, 7)}-${limitedNumbers.slice(7)}`;
    }
  };

  const handleChange = (field: string, value: string) => {
    let formattedValue = value;
    
    if (field === 'whatsapp') {
      formattedValue = formatPhoneNumber(value);
    }
    
    onUpdate({
      personalInfo: {
        ...personalInfo,
        [field]: formattedValue
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