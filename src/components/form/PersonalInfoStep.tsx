import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    isMblCoordinator: false,
    mblAcademyStatus: ""
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

  const updatePersonalInfo = (field: string, value: string | boolean) => {
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
        updatePersonalInfo("photo", base64);
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
            onChange={(e) => updatePersonalInfo("name", e.target.value)}
            placeholder="Digite seu nome completo"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="whatsapp">Qual é o seu número de WhatsApp? *</Label>
          <Input
            id="whatsapp"
            value={personalInfo.whatsapp}
            onChange={(e) => updatePersonalInfo("whatsapp", e.target.value)}
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
            onChange={(e) => updatePersonalInfo("email", e.target.value)}
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
            onChange={(e) => updatePersonalInfo("confirmEmail", e.target.value)}
            placeholder="seu@email.com"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="state">Estado que você mora atualmente *</Label>
          <Input
            id="state"
            value={personalInfo.state}
            onChange={(e) => updatePersonalInfo("state", e.target.value)}
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

          {/* MBL Questions */}
          <Card>
            <CardHeader>
              <CardTitle>Perguntas sobre MBL</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Label className="text-sm font-medium">Você já é coordenador do MBL?</Label>
                <RadioGroup 
                  value={personalInfo.isMblCoordinator ? "true" : "false"}
                  onValueChange={(value) => updatePersonalInfo("isMblCoordinator", value === "true")}
                  className="flex gap-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="true" id="mbl-coord-yes" />
                    <Label htmlFor="mbl-coord-yes">Sim</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="false" id="mbl-coord-no" />
                    <Label htmlFor="mbl-coord-no">Não</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium">Você já fez academia MBL?</Label>
                <RadioGroup 
                  value={personalInfo.mblAcademyStatus || ""}
                  onValueChange={(value) => updatePersonalInfo("mblAcademyStatus", value)}
                  className="flex flex-col gap-3"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="ja-fiz" id="mbl-academy-done" />
                    <Label htmlFor="mbl-academy-done">Já fiz</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="estou-fazendo" id="mbl-academy-doing" />
                    <Label htmlFor="mbl-academy-doing">Estou fazendo</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="ainda-nao-fiz" id="mbl-academy-not" />
                    <Label htmlFor="mbl-academy-not">Ainda não fiz</Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>
      </div>
    </div>
  );
};

export default PersonalInfoStep;