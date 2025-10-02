import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { authService, UserProfile } from "@/lib/auth";
import { dimensionNames } from "@/lib/hexaco";
import { subSkillsMap } from "@/lib/skillsData";
import { useNavigate } from "react-router-dom";
import { Search, User, MapPin, Briefcase, Shield, ShieldCheck, Crown, MessageCircle, Mail, Trash2, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import HexagonChart from "@/components/HexagonChart";

const AdminDashboard = () => {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProfiles, setFilteredProfiles] = useState<UserProfile[]>([]);
  const [selectedSkill, setSelectedSkill] = useState<string>("");
  const [selectedSubSkill, setSelectedSubSkill] = useState<string>("");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (!user || !user.isAdmin) {
      navigate("/login");
      return;
    }
    setCurrentUser(user);
    const allProfiles = authService.getUserProfiles();
    setProfiles(allProfiles);
    setFilteredProfiles(allProfiles);
  }, [navigate]);

  useEffect(() => {
    let filtered = profiles;
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(profile => {
        const formData = profile.formData;
        if (!formData) return false;
        const personalMatch =
          (formData.personalInfo.name || "").toLowerCase().includes(searchLower) ||
          (formData.personalInfo.state || "").toLowerCase().includes(searchLower) ||
          (formData.personalInfo.email || "").toLowerCase().includes(searchLower);
        const skillsMatch = (formData.skills || []).some((skill: string) =>
          skill.toLowerCase().includes(searchLower)
        );
        const behavioralMatch = (formData.behavioralSkills || []).some((skill: string) =>
          skill.toLowerCase().includes(searchLower)
        );
        return personalMatch || skillsMatch || behavioralMatch;
      });
    }
    if (selectedSkill && selectedSkill !== "__all__") {
      filtered = filtered.filter(profile => {
        const formData = profile.formData;
        return (formData?.skills || []).includes(selectedSkill);
      });
    }
    if (selectedSubSkill && selectedSubSkill !== "__all__") {
      filtered = filtered.filter(profile => {
        const formData = profile.formData;
        if (!formData?.subSkills) return false;
        const list = formData.subSkills[selectedSkill] || [];
        return list.includes(selectedSubSkill);
      });
    }
    setFilteredProfiles(filtered);
  }, [searchTerm, profiles, selectedSkill, selectedSubSkill]);

  const handleSkillChange = (skill: string) => {
    setSelectedSkill(skill);
    setSelectedSubSkill("");
  };

  const handlePromoteToAdmin = async (userId: string, userName: string) => {
    const success = authService.promoteToAdmin(userId);
    if (success) {
      toast({
        title: "Usuário promovido",
        description: `${userName} agora é administrador`
      });
      const allProfiles = authService.getUserProfiles();
      setProfiles(allProfiles);
      setFilteredProfiles(allProfiles);
    } else {
      toast({
        title: "Erro",
        description: "Não foi possível promover o usuário",
        variant: "destructive"
      });
    }
  };

  const handleRevokeAdmin = async (userId: string, userName: string) => {
    const success = authService.revokeAdmin(userId);
    if (success) {
      toast({
        title: "Permissões removidas",
        description: `${userName} não é mais administrador`
      });
      const allProfiles = authService.getUserProfiles();
      setProfiles(allProfiles);
      setFilteredProfiles(allProfiles);
    } else {
      toast({
        title: "Erro",
        description: "Não foi possível remover as permissões",
        variant: "destructive"
      });
    }
  };

  const handlePromoteToMasterAdmin = async (userId: string, userName: string) => {
    const success = authService.promoteToMasterAdmin(userId);
    if (success) {
      toast({
        title: "Usuário promovido",
        description: `${userName} agora é Master Admin`
      });
      const allProfiles = authService.getUserProfiles();
      setProfiles(allProfiles);
      setFilteredProfiles(allProfiles);
    } else {
      toast({
        title: "Erro",
        description: "Não foi possível promover o usuário a Master Admin",
        variant: "destructive"
      });
    }
  };

  const handleRevokeMasterAdmin = async (userId: string, userName: string) => {
    const success = authService.revokeMasterAdmin(userId);
    if (success) {
      toast({
        title: "Permissões removidas",
        description: `${userName} não é mais Master Admin`
      });
      const allProfiles = authService.getUserProfiles();
      setProfiles(allProfiles);
      setFilteredProfiles(allProfiles);
    } else {
      toast({
        title: "Erro",
        description: "Não foi possível remover as permissões de Master Admin",
        variant: "destructive"
      });
    }
  };

  const handleToggleCoordinatorVerified = async (userId: string, userName: string) => {
    const success = authService.toggleCoordinatorVerified(userId);
    if (success) {
      toast({
        title: "Coordenador verificado",
        description: `${userName} agora tem o selo de verificado`
      });
      const allProfiles = authService.getUserProfiles();
      setProfiles(allProfiles);
      setFilteredProfiles(allProfiles);
    } else {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status de coordenador verificado",
        variant: "destructive"
      });
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    const success = authService.deleteUserProfile(userId);
    if (success) {
      toast({
        title: "Usuário excluído",
        description: `${userName} foi removido do sistema`
      });
      const allProfiles = authService.getUserProfiles();
      setProfiles(allProfiles);
      setFilteredProfiles(allProfiles);
    } else {
      toast({
        title: "Erro",
        description: "Não foi possível excluir o usuário",
        variant: "destructive"
      });
    }
  };

  const getHexagonColor = (dimension: string, score: number) => {
    if (score >= 75) return "bg-green-500";
    if (score >= 50) return "bg-yellow-500";
    if (score >= 25) return "bg-orange-500";
    return "bg-red-500";
  };

  const getAvailableSubSkills = () => {
    if (!selectedSkill || selectedSkill === "__all__") return [];
    return subSkillsMap[selectedSkill] || [];
  };

  const getUserRoleIcon = (profile: UserProfile) => {
    if (profile.isMasterAdmin) return <Crown className="h-4 w-4 text-yellow-600" />;
    if (profile.isAdmin) return <ShieldCheck className="h-4 w-4 text-blue-600" />;
    if (profile.coordinatorVerified) return <CheckCircle className="h-4 w-4 text-green-600" />;
    return <User className="h-4 w-4 text-gray-600" />;
  };

  const getUserRoleText = (profile: UserProfile) => {
    if (profile.isMasterAdmin) return "Master Admin";
    if (profile.isAdmin) return "Administrador";
    return "Usuário";
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold">Mutuals - Painel Administrativo</h1>
            {currentUser?.isMasterAdmin && (
              <Badge variant="outline" className="flex items-center gap-1">
                <Crown className="h-3 w-3" />
                Master Admin
              </Badge>
            )}
          </div>
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

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Buscar e Filtrar Perfis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <Input
                placeholder="Busque por nome, cidade, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Select value={selectedSkill} onValueChange={(val) => handleSkillChange(val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Área de atuação" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">Todas as áreas</SelectItem>
                  {Object.keys(subSkillsMap).map((skill) => (
                    <SelectItem key={skill} value={skill}>
                      {skill}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={selectedSubSkill}
                onValueChange={(val) => setSelectedSubSkill(val)}
                disabled={!selectedSkill || selectedSkill === "__all__"}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Especialização" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">Todas as especializações</SelectItem>
                  {getAvailableSubSkills().map((subSkill) => (
                    <SelectItem key={subSkill} value={subSkill}>
                      {subSkill}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <p className="text-sm text-muted-foreground">{filteredProfiles.length} perfis encontrados</p>
          </CardContent>
        </Card>

        <div className="grid gap-6">
          {filteredProfiles.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">
                  {searchTerm || selectedSkill || selectedSubSkill
                    ? "Nenhum perfil encontrado com os critérios de busca."
                    : "Nenhum perfil cadastrado ainda."}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredProfiles.map((profile) => {
              const formData = profile.formData;
              if (!formData) return null;
              const isSelf = currentUser && profile.id === currentUser.id;
              return (
                <Card key={profile.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <CardTitle className="flex items-center gap-2">
                          {getUserRoleIcon(profile)}
                          {formData.personalInfo.name}
                          <Badge variant="secondary" className="text-xs">
                            {getUserRoleText(profile)}
                          </Badge>
                          

                        </CardTitle>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {formData.personalInfo.state}
                          </div>
                          <div className="flex items-center gap-1">
                            <Briefcase className="h-4 w-4" />
                            {formData.personalInfo.email}
                          </div>
                          {formData.personalInfo.whatsapp && (
                            <div className="flex items-center gap-1">
                              <MessageCircle className="h-4 w-4" />
                              {formData.personalInfo.whatsapp}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {formData.personalInfo.whatsapp && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              const phoneNumber = formData.personalInfo.whatsapp.replace(/\D/g, "");
                              window.open(`https://wa.me/55${phoneNumber}`, "_blank");
                            }}
                            className="flex items-center gap-1"
                          >
                            <MessageCircle className="h-3 w-3" />
                            WhatsApp
                          </Button>
                        )}
                        {formData.personalInfo.email && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              window.open(`mailto:${formData.personalInfo.email}`, "_blank");
                            }}
                            className="flex items-center gap-1"
                          >
                            <Mail className="h-3 w-3" />
                            Email
                          </Button>
                        )}

                        {(currentUser?.isAdmin || currentUser?.isMasterAdmin) && !isSelf && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleToggleCoordinatorVerified(profile.id, formData.personalInfo.name)}
                            className="flex items-center gap-1"
                          >
                            <CheckCircle className="h-3 w-3" />
                            {profile.coordinatorVerified ? "Remover selo" : "Coordenador Verificado"}
                          </Button>
                        )}

                        {currentUser?.isMasterAdmin && !profile.isMasterAdmin && !isSelf && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                className="flex items-center gap-1 text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-3 w-3" />
                                Excluir
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Excluir usuário</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tem certeza que deseja excluir o usuário <strong>{formData.personalInfo.name}</strong>? Esta
                                  ação não pode ser desfeita e todos os dados do usuário serão perdidos permanentemente.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteUser(profile.id, formData.personalInfo.name)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Excluir usuário
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}

                        {currentUser?.isMasterAdmin && !isSelf && (
                          <>
                            {!profile.isAdmin ? (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handlePromoteToAdmin(profile.id, formData.personalInfo.name)}
                                className="flex items-center gap-1"
                              >
                                <Shield className="h-3 w-3" />
                                Promover a Admin
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleRevokeAdmin(profile.id, formData.personalInfo.name)}
                                className="flex items-center gap-1"
                              >
                                <Shield className="h-3 w-3" />
                                Remover Admin
                              </Button>
                            )}

                            {!profile.isMasterAdmin ? (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handlePromoteToMasterAdmin(profile.id, formData.personalInfo.name)}
                                className="flex items-center gap-1"
                              >
                                <Crown className="h-3 w-3" />
                                Promover a Master Admin
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleRevokeMasterAdmin(profile.id, formData.personalInfo.name)}
                                className="flex items-center gap-1"
                              >
                                <Crown className="h-3 w-3" />
                                Remover Master Admin
                              </Button>
                            )}
                          </>
                        )}

                        <Badge variant="secondary">
                          {profile.completedAt ? new Date(profile.completedAt).toLocaleDateString("pt-BR") : "Em andamento"}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className="font-semibold">Perfil</h3>
                        <div className="flex justify-center">
                          {formData.personalInfo.photo ? (
                            <img
                              src={formData.personalInfo.photo}
                              alt={`Foto de ${formData.personalInfo.name}`}
                              className="w-24 h-24 rounded-full object-cover border-4 border-border"
                            />
                          ) : (
                            <div className="w-24 h-24 rounded-full bg-muted border-4 border-border flex items-center justify-center">
                              <User className="h-12 w-12 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        {formData.hexacoScores && (
                          <div className="flex justify-center">
                            <HexagonChart scores={formData.hexacoScores} size={200} />
                          </div>
                        )}

                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">Informações MBL:</h4>
                          <div className="space-y-1 text-xs">
                            <div>
                              <span className="font-medium">Coordenador MBL:</span> {formData.personalInfo.isMblCoordinator ? "Sim" : "Não"}
                            </div>
                            <div>
                              <span className="font-medium">Academia MBL:</span>
                              {formData.personalInfo.mblAcademyStatus === "ja-fiz" ? " Já fiz"
                                : formData.personalInfo.mblAcademyStatus === "estou-fazendo" ? " Estou fazendo"
                                : formData.personalInfo.mblAcademyStatus === "ainda-nao-fiz" ? " Ainda não fiz"
                                : " Não informado"}
                            </div>
                            {formData.personalInfo.mblHistory && (
                              <div>
                                <span className="font-medium">História na militância:</span>
                                <p className="text-muted-foreground bg-muted p-2 rounded text-xs mt-1">{formData.personalInfo.mblHistory}</p>
                              </div>
                            )}
                            {formData.personalInfo.wasMissionCollector !== undefined && (
                              <div>
                                <span className="font-medium">Coletor da Missão:</span> {formData.personalInfo.wasMissionCollector ? "Sim" : "Não"}
                              </div>
                            )}
                          </div>
                        </div>

                        {(formData.importantTruth || formData.isPublicServant) && (
                          <div className="space-y-2">
                            <h4 className="text-sm font-medium">Perguntas Finais:</h4>
                            <div className="space-y-1 text-xs">
                              {formData.importantTruth && (
                                <div>
                                  <span className="font-medium">Verdade importante:</span>
                                  <p className="text-muted-foreground bg-muted p-2 rounded text-xs mt-1">{formData.importantTruth}</p>
                                </div>
                              )}
                              <div>
                                <span className="font-medium">Servidor Público:</span>{" "}
                                {formData.isPublicServant ? `Sim - ${formData.publicServiceArea || "Área não especificada"}` : "Não"}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="space-y-4">
                        <h3 className="font-semibold">Experiência Profissional e Formação</h3>
                        {formData.curriculum?.experiences && formData.curriculum.experiences.length > 0 && (
                          <div className="space-y-2">
                            <h4 className="text-sm font-medium">Últimas experiências profissionais:</h4>
                            <div className="space-y-2">
                              {formData.curriculum.experiences.slice(0, 3).map((exp: any, index: number) => (
                                <div key={index} className="text-xs bg-muted p-2 rounded">
                                  <div className="font-medium">{exp.role}</div>
                                  <div className="text-muted-foreground">{exp.company} - {exp.duration}</div>
                                </div>
                              ))}
                              {formData.curriculum.experiences.length > 3 && (
                                <div className="text-xs text-muted-foreground">+{formData.curriculum.experiences.length - 3} experiência(s) adicional(is)</div>
                              )}
                            </div>
                          </div>
                        )}

                        {formData.curriculum?.languages && formData.curriculum.languages.length > 0 && (
                          <div className="space-y-2">
                            <h4 className="text-sm font-medium">Idiomas:</h4>
                            <div className="flex flex-wrap gap-1">
                              {formData.curriculum.languages.map((lang: string) => (
                                <Badge key={lang} variant="outline" className="text-xs">{lang}</Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {formData.curriculum?.portfolio && (
                          <div className="space-y-2">
                            <h4 className="text-sm font-medium">Link do portfólio:</h4>
                            <a
                              href={formData.curriculum.portfolio.startsWith("http") ? formData.curriculum.portfolio : `https://${formData.curriculum.portfolio}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-primary hover:underline break-all"
                            >
                              {formData.curriculum.portfolio}
                            </a>
                          </div>
                        )}

                        {formData.curriculum?.education && formData.curriculum.education.length > 0 && (
                          <div className="space-y-2">
                            <h4 className="text-sm font-medium">Formações:</h4>
                            <div className="space-y-2">
                              {formData.curriculum.education.slice(0, 3).map((edu: any, index: number) => (
                                <div key={index} className="text-xs bg-muted p-2 rounded">
                                  {edu.educationLevel && (
                                    <div className="font-medium text-primary">
                                      {edu.educationLevel.replace(/-/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase())}
                                    </div>
                                  )}
                                  <div className="font-medium">{edu.course}</div>
                                  <div className="text-muted-foreground">{edu.institution}</div>
                                </div>
                              ))}
                              {formData.curriculum.education.length > 3 && (
                                <div className="text-xs text-muted-foreground">+{formData.curriculum.education.length - 3} formação(ões) adicional(is)</div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="space-y-4">
                        <h3 className="font-semibold">Áreas de Conhecimento</h3>
                        <div className="flex flex-wrap gap-2">
                          {formData.skills.slice(0, 3).map((skill: string) => (
                            <Badge key={skill} variant="outline">{skill}</Badge>
                          ))}
                          {formData.skills.length > 3 && <Badge variant="secondary">+{formData.skills.length - 3} mais</Badge>}
                        </div>

                        {Object.keys(formData.subSkills || {}).length > 0 && (
                          <div className="space-y-2">
                            <h4 className="text-sm font-medium">Especializações:</h4>
                            {Object.entries(formData.subSkills).map(([area, subSkills]: any) => (
                              <div key={area} className="space-y-1">
                                <span className="text-xs font-medium text-muted-foreground">{area}:</span>
                                <div className="flex flex-wrap gap-1">
                                  {subSkills.slice(0, 2).map((subSkill: string) => (
                                    <Badge key={subSkill} variant="outline" className="text-xs">{subSkill}</Badge>
                                  ))}
                                  {subSkills.length > 2 && <Badge variant="secondary" className="text-xs">+{subSkills.length - 2}</Badge>}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        <h3 className="font-semibold">Habilidades Comportamentais</h3>
                        <div className="flex flex-wrap gap-2">
                          {formData.behavioralSkills.slice(0, 4).map((skill: string) => (
                            <Badge key={skill} variant="outline">{skill}</Badge>
                          ))}
                          {formData.behavioralSkills.length > 4 && <Badge variant="secondary">+{formData.behavioralSkills.length - 4} mais</Badge>}
                        </div>
                      </div>

                      <div className="space-y-4 lg:col-span-3 md:col-span-2">
                        <h3 className="font-semibold">Detalhes de Personalidade</h3>
                        {formData.hexacoScores ? (
                          <div className="space-y-2">
                            {Object.entries(formData.hexacoScores).map(([dimension, score]: any) => (
                              <div key={dimension} className="flex items-center justify-between">
                                <span className="text-sm font-medium">{dimensionNames[dimension as keyof typeof dimensionNames]}</span>
                                <div className="flex items-center gap-2">
                                  <div className="w-20 bg-muted rounded-full h-2">
                                    <div className={`h-full rounded-full ${getHexagonColor(dimension, score)}`} style={{ width: `${Math.max(score, 0)}%` }} />
                                  </div>
                                  <span className="text-xs w-8 text-right">{Math.round(score)}%</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">Avaliação de personalidade não concluída</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
