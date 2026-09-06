
-- ----------------------------------------------------------
-- Tabela 1: usuarios
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS usuarios (
    id          BIGINT        NOT NULL AUTO_INCREMENT,
    nome        VARCHAR(150)  NOT NULL,
    email       VARCHAR(150)  NOT NULL UNIQUE,
    senha       VARCHAR(255)  NOT NULL,
    tipo_usuario ENUM('CANDIDATO','EMPRESA','ADMIN') NOT NULL DEFAULT 'CANDIDATO',
    telefone    VARCHAR(20),
    cidade      VARCHAR(100),
    criado_em   DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
) ENGINE=InnoDB;

-- ----------------------------------------------------------
-- Tabela 2: vagas
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS vagas (
    id          BIGINT        NOT NULL AUTO_INCREMENT,
    titulo_vaga VARCHAR(200)  NOT NULL,
    descricao   TEXT,
    salario     DECIMAL(10,2),
    requisitos  TEXT,
    modalidade  ENUM('PRESENCIAL','REMOTO','HIBRIDO') NOT NULL DEFAULT 'PRESENCIAL',
    status      ENUM('ATIVA','ENCERRADA')             NOT NULL DEFAULT 'ATIVA',
    empresa_id  BIGINT        NOT NULL,
    criado_em   DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_vaga_empresa FOREIGN KEY (empresa_id)
        REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ----------------------------------------------------------
-- Tabela 3: capacitacoes
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS capacitacoes (
    id                    BIGINT        NOT NULL AUTO_INCREMENT,
    titulo_curso          VARCHAR(200)  NOT NULL,
    descricao             TEXT,
    carga_horaria         INT,
    link_acesso           VARCHAR(500),
    instituicao_parceira  VARCHAR(200),
    gratuito              BOOLEAN       NOT NULL DEFAULT TRUE,
    criado_em             DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
) ENGINE=InnoDB;

-- ----------------------------------------------------------
-- Tabela 4: candidaturas
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS candidaturas (
    id               BIGINT   NOT NULL AUTO_INCREMENT,
    candidato_id     BIGINT   NOT NULL,
    vaga_id          BIGINT   NOT NULL,
    status           ENUM('PENDENTE','APROVADO','REJEITADO') NOT NULL DEFAULT 'PENDENTE',
    data_candidatura DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_candidatura (candidato_id, vaga_id),
    CONSTRAINT fk_cand_candidato FOREIGN KEY (candidato_id)
        REFERENCES usuarios(id) ON DELETE CASCADE,
    CONSTRAINT fk_cand_vaga FOREIGN KEY (vaga_id)
        REFERENCES vagas(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ----------------------------------------------------------
-- Dados iniciais — Admin padrão (senha: admin123)
-- ----------------------------------------------------------
INSERT IGNORE INTO usuarios (nome, email, senha, tipo_usuario, cidade)
VALUES (
    'Administrador',
    'admin2@conecta.com',
    '$2a$10$pz00FiK4v11faflAlvH0ZeucbDRYQO5O6F2taD/wdjk.h2QufvnTS', -- admin123 (BCrypt)
    'ADMIN',
    'Porto Alegre'
);

-- Empresa (senha: empresa123)
INSERT IGNORE INTO usuarios (nome, email, senha, tipo_usuario, telefone, cidade)
VALUES (
    'TechEmpresa Demo',
    'empresa@demo.com',
    '$2a$12$VBoo91DYPNncjko/gBZ2.ujsy4rWhU/yugpBbqgwfRWB94lalVTdm', -- empresa123
    'EMPRESA',
    '(51) 99999-0000',
    'Porto Alegre'
);

-- Vagas -
INSERT IGNORE INTO vagas (titulo_vaga, descricao, salario, requisitos, modalidade, empresa_id)
VALUES
    ('Auxiliar Administrativo', 'Apoio em tarefas administrativas, atendimento ao cliente e organização de documentos.', 1800.00, 'Ensino médio completo, pacote Office básico.', 'PRESENCIAL', 2),
    ('Assistente de Logística', 'Controle de estoque, separação e conferência de pedidos.', 2100.00, 'Ensino médio completo, experiência com estoque desejável.', 'PRESENCIAL', 2),
    ('Atendente de Suporte Remoto', 'Suporte técnico de nível 1 para clientes via chat e e-mail.', 2400.00, 'Boa comunicação escrita, noções de informática.', 'REMOTO', 2);

-- Capacitações
INSERT IGNORE INTO capacitacoes (titulo_curso, descricao, carga_horaria, link_acesso, instituicao_parceira, gratuito)
VALUES
    ('Excel do Básico ao Avançado', 'Aprenda planilhas, fórmulas, gráficos e análise de dados com Excel.', 20, 'https://cursa.com.br/curso-de-excel', 'Cursa', TRUE),
    ('Introdução à Programação com Python', 'Lógica de programação e primeiros passos com Python para iniciantes.', 40, 'https://www.cursoemvideo.com/curso/python-3-mundo-1/', 'Curso em Vídeo', TRUE),
    ('Comunicação e Oratória Profissional', 'Técnicas para comunicação assertiva, apresentações e entrevistas de emprego.', 10, 'https://www.ev.org.br/', 'Fundação Bradesco', TRUE),
    ('Empreendedorismo e Negócios Digitais', 'Como iniciar um negócio digital com baixo investimento.', 30, 'https://sebrae.com.br/cursosonline', 'SEBRAE', TRUE),
    ('IAgora! Formações de IA', 'Aprenda os conceitos fundamentais de Inteligência Artificial para o mercado de trabalho com as formações gratuitas da Recode.', 40, 'https://recode.org.br/', 'Recode', TRUE);
