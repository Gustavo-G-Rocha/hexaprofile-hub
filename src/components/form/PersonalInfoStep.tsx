import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
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
    state: "",
    photo: "",
    isMBLCoordinator: false,
    didMBLAcademy: false
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

  const handleChange = (field: string, value: string | boolean) => {
    let formattedValue = value;
    
    if (field === 'whatsapp' && typeof value === 'string') {
      formattedValue = formatPhoneNumber(value);
    }
    
    onUpdate({
      personalInfo: {
        ...personalInfo,
        [field]: formattedValue
      }
    });
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        handleChange("photo", base64);
      };
      reader.readAsDataURL(file);
    }
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

        <div className="space-y-2">
          <Label htmlFor="photo">Foto de perfil (opcional)</Label>
          <div className="flex items-center gap-4">
            <Input
              id="photo"
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="flex-1"
            />
            {personalInfo.photo && (
              <img
                src={personalInfo.photo}
                alt="Preview"
                className="w-16 h-16 rounded-full object-cover border-2 border-border"
              />
            )}
          </div>
        </div>

        <div className="space-y-4 border-t pt-4">
          <h3 className="font-semibold">Perguntas sobre MBL</h3>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="mbl-coordinator"
              checked={personalInfo.isMBLCoordinator}
              onCheckedChange={(checked) => 
                handleChange("isMBLCoordinator", checked as boolean)
              }
            />
            <Label htmlFor="mbl-coordinator">
              Você já é coordenador do MBL?
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="mbl-academy"
              checked={personalInfo.didMBLAcademy}
              onCheckedChange={(checked) => 
                handleChange("didMBLAcademy", checked as boolean)
              }
            />
            <Label htmlFor="mbl-academy">
              Você já fez academia MBL?
            </Label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoStep;