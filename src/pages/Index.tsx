import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { authService } from "@/lib/auth";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user) {
      if (user.isAdmin) {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-lg text-center">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Mutuals</CardTitle>
          <CardDescription className="text-lg">
            Sistema de Avaliação de Personalidade Profissional
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Descubra seu perfil de personalidade e complete 
            sua avaliação profissional completa.
          </p>
          <div className="space-y-3">
            <Button onClick={() => navigate("/login")} className="w-full" size="lg">
              Começar Avaliação
            </Button>
            <Button 
              onClick={() => navigate("/login")} 
              variant="outline" 
              className="w-full"
            >
              Já tenho conta
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
