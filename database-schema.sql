-- =============================================
-- MUTUALS DATABASE SCHEMA
-- Sistema de Avaliação de Perfis e Habilidades
-- =============================================

-- Criação do enum para tipos de papéis de usuário
CREATE TYPE app_role AS ENUM ('user', 'admin', 'master_admin');

-- =============================================
-- TABELA: users
-- Armazena informações básicas dos usuários
-- =============================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- TABELA: user_roles
-- Gerencia os papéis/permissões dos usuários
-- =============================================
CREATE TABLE user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role app_role NOT NULL DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, role)
);

-- =============================================
-- TABELA: profiles
-- Armazena os perfis completos dos usuários
-- =============================================
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    coordinator_verified BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- TABELA: personal_info
-- Informações pessoais dos usuários
-- =============================================
CREATE TABLE personal_info (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    whatsapp VARCHAR(20),
    state VARCHAR(100),
    city VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(profile_id)
);

-- =============================================
-- TABELA: curriculum_info
-- Informações de currículo dos usuários
-- =============================================
CREATE TABLE curriculum_info (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    in_militancy BOOLEAN DEFAULT FALSE,
    militancy_history TEXT,
    was_mbl_collector BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(profile_id)
);

-- =============================================
-- TABELA: skills
-- Habilidades selecionadas pelos usuários
-- =============================================
CREATE TABLE skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    skill_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índice para melhorar buscas por perfil
CREATE INDEX idx_skills_profile_id ON skills(profile_id);

-- =============================================
-- TABELA: sub_skills
-- Sub-habilidades relacionadas às habilidades
-- =============================================
CREATE TABLE sub_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    skill_name VARCHAR(255) NOT NULL,
    sub_skill_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índice para melhorar buscas por perfil e habilidade
CREATE INDEX idx_sub_skills_profile_id ON sub_skills(profile_id);
CREATE INDEX idx_sub_skills_skill_name ON sub_skills(skill_name);

-- =============================================
-- TABELA: behavioral_skills
-- Habilidades comportamentais dos usuários
-- =============================================
CREATE TABLE behavioral_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    skill_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índice para melhorar buscas por perfil
CREATE INDEX idx_behavioral_skills_profile_id ON behavioral_skills(profile_id);

-- =============================================
-- TABELA: hexaco_scores
-- Scores do teste de personalidade HEXACO
-- =============================================
CREATE TABLE hexaco_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    honesty_humility DECIMAL(5,2) NOT NULL CHECK (honesty_humility >= 0 AND honesty_humility <= 100),
    emotionality DECIMAL(5,2) NOT NULL CHECK (emotionality >= 0 AND emotionality <= 100),
    extraversion DECIMAL(5,2) NOT NULL CHECK (extraversion >= 0 AND extraversion <= 100),
    agreeableness DECIMAL(5,2) NOT NULL CHECK (agreeableness >= 0 AND agreeableness <= 100),
    conscientiousness DECIMAL(5,2) NOT NULL CHECK (conscientiousness >= 0 AND conscientiousness <= 100),
    openness DECIMAL(5,2) NOT NULL CHECK (openness >= 0 AND openness <= 100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(profile_id)
);

-- =============================================
-- FUNÇÕES DE SEGURANÇA
-- =============================================

-- Função para verificar se um usuário tem um papel específico
CREATE OR REPLACE FUNCTION has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM user_roles
        WHERE user_id = _user_id
        AND role = _role
    )
$$;

-- Função para verificar se um usuário é admin (admin ou master_admin)
CREATE OR REPLACE FUNCTION is_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM user_roles
        WHERE user_id = _user_id
        AND role IN ('admin', 'master_admin')
    )
$$;

-- =============================================
-- TRIGGERS
-- =============================================

-- Trigger para atualizar o campo updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger nas tabelas relevantes
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_personal_info_updated_at BEFORE UPDATE ON personal_info
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_curriculum_info_updated_at BEFORE UPDATE ON curriculum_info
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- DADOS INICIAIS (OPCIONAL)
-- =============================================

-- Você pode descomentar as linhas abaixo para criar um usuário admin inicial
-- Lembre-se de alterar o email e a senha!

-- INSERT INTO users (id, email, password_hash) 
-- VALUES (
--     'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 
--     'admin@mutuals.com',
--     '$2a$10$exemplo_hash_de_senha_aqui'
-- );

-- INSERT INTO user_roles (user_id, role)
-- VALUES ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'master_admin');

-- INSERT INTO profiles (id)
-- VALUES ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11');

-- =============================================
-- ÍNDICES ADICIONAIS PARA PERFORMANCE
-- =============================================

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX idx_user_roles_role ON user_roles(role);
CREATE INDEX idx_profiles_completed_at ON profiles(completed_at);
CREATE INDEX idx_personal_info_profile_id ON personal_info(profile_id);
CREATE INDEX idx_curriculum_info_profile_id ON curriculum_info(profile_id);
CREATE INDEX idx_hexaco_scores_profile_id ON hexaco_scores(profile_id);

-- =============================================
-- COMENTÁRIOS NAS TABELAS
-- =============================================

COMMENT ON TABLE users IS 'Tabela principal de usuários do sistema';
COMMENT ON TABLE user_roles IS 'Gerenciamento de papéis e permissões dos usuários';
COMMENT ON TABLE profiles IS 'Perfis completos dos usuários com status de conclusão';
COMMENT ON TABLE personal_info IS 'Informações pessoais e de contato';
COMMENT ON TABLE curriculum_info IS 'Informações sobre histórico na militância';
COMMENT ON TABLE skills IS 'Habilidades técnicas selecionadas pelos usuários';
COMMENT ON TABLE sub_skills IS 'Especializações dentro de cada habilidade';
COMMENT ON TABLE behavioral_skills IS 'Habilidades comportamentais e soft skills';
COMMENT ON TABLE hexaco_scores IS 'Resultados do teste de personalidade HEXACO';
