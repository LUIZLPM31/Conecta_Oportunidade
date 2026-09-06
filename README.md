# Conecta Oportunidades 🚀

> Plataforma de empregabilidade e capacitação profissional — ODS 8 e ODS 10

🔗 **Acesse o projeto online:** [https://conecta-oportunidades.vercel.app/](https://conecta-oportunidades.vercel.app/)  
📖 **Documentação da API (Swagger):** `http://168.138.128.72/swagger-ui.html`

---

## 🛠️ Stack Tecnológica

| Camada | Tecnologia |
|---|---|
| **Banco de Dados** | MySQL 8 / TiDB Serverless (Cloud) |
| **Backend** | Java 17 + Spring Boot 3.3.0 + Spring Security + JWT |
| **Documentação API** | SpringDoc OpenAPI 3 (Swagger UI) |
| **Frontend** | React 18 + Vite 5 + Bootstrap 5 + Tailwind CSS + Lucide React |
| **Deploy API** | Docker Compose + Oracle Cloud Free Tier (Ubuntu 22.04) |
| **Deploy Frontend** | Vercel (SPA com proxy reverso no `vercel.json`) |

---

## 📁 Estrutura do Projeto

```text
Conecta_Portunidade/
├── database/
│   ├── init.sql             # Script DDL com tabelas, constraints e dados iniciais
│   └── update.sql           # Script auxiliar de padronização de senhas
├── backend/                 # API RESTful Spring Boot
│   ├── src/
│   │   └── main/
│   │       ├── java/com/conectaoportunidades/  # Controllers, Services, Entities, Repositories, Security
│   │       └── resources/
│   │           └── application.properties     # Configurações de datasource, JWT e CORS
│   ├── Dockerfile           # Build multi-stage Maven + OpenJDK JRE 17
│   └── pom.xml
├── frontend/                # Single Page Application (React)
│   ├── src/
│   │   ├── components/      # Navbar, Footer e componentes reutilizáveis
│   │   ├── pages/           # Home, Vagas, Cursos, Login, Registro, Dashboards
│   │   ├── services/        # Cliente Axios e chamadas às APIs
│   │   └── routes/          # Rotas públicas e privadas (RBAC)
│   ├── Dockerfile           # Imagem Node.js + Nginx
│   ├── vercel.json          # Configuração de rewrites para produção
│   ├── vite.config.js       # Configuração de Proxy local (/api -> :8080)
│   └── package.json
├── docker-compose.yml       # Orquestração do Backend na VM de produção
├── .env.example             # Modelo de variáveis de ambiente
└── README.md
```

---

## 💻 Rodando em Desenvolvimento Local

### Pré-requisitos
- **Java 17+** (JDK)
- **Node.js 20+** e **npm**
- **Maven 3.8+** (ou Maven Wrapper)
- **Instância MySQL 8** (local na porta `3306` ou conta no TiDB Serverless na porta `4000`)

---

### 1. Configuração das Variáveis de Ambiente
Copie o arquivo de exemplo na raiz e configure suas credenciais:
```bash
cp .env.example .env
```

Exemplo para banco local (MySQL tradicional):
```properties
DB_HOST=localhost
DB_PORT=3306
DB_NAME=conecta_db
DB_USER=root
DB_PASSWORD=suasenha
JWT_SECRET=uma-chave-secreta-forte-com-no-minimo-256-bits-base64
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

---

### 2. Backend (Spring Boot)

1. No terminal, acesse a pasta `backend`:
   ```bash
   cd backend
   ```

2. Carregue as variáveis de ambiente ou passe-as na execução:
   - **Linux / macOS (Bash):**
     ```bash
     export DB_HOST=localhost DB_PORT=3306 DB_NAME=conecta_db DB_USER=root DB_PASSWORD=suasenha JWT_SECRET="chave-secreta-com-256-bits"
     mvn spring-boot:run
     ```
   - **Windows (PowerShell):**
     ```powershell
     $env:DB_HOST="localhost"; $env:DB_PORT="3306"; $env:DB_NAME="conecta_db"; $env:DB_USER="root"; $env:DB_PASSWORD="suasenha"; $env:JWT_SECRET="chave-secreta-com-256-bits"
     mvn spring-boot:run
     ```

3. A API estará disponível em: `http://localhost:8080`
   - Documentação Swagger: `http://localhost:8080/swagger-ui.html`

---

### 3. Frontend (React + Vite)

1. Em outro terminal, acesse a pasta `frontend`:
   ```bash
   cd frontend
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

4. Acesse a aplicação em: `http://localhost:5173`
   *(O Vite já está configurado via `vite.config.js` para redirecionar requisições `/api/*` para `http://localhost:8080`)*.

---

## 🚀 Arquitetura de Deploy

A arquitetura do projeto foi desenhada de forma desacoplada para alta performance e gratuidade contínua:

1. **Frontend (Vercel):**
   - Build e hospedagem estática contínua na Vercel.
   - O arquivo `vercel.json` atua como proxy reverso para `/api/:path*`, encaminhando o tráfego de forma transparente para a API na VM Oracle Cloud sem bloqueios de CORS ou certificados mistos.

2. **Backend (Oracle Cloud Free Tier):**
   - VM Ubuntu 22.04 (`VM.Standard.E2.1.Micro`).
   - O `docker-compose.yml` compila e executa o container da API mapeado na porta `80:8080`, com flags de baixo consumo de memória JVM (`-XX:+UseSerialGC -Xmx256m`).

3. **Banco de Dados (TiDB Cloud Serverless):**
   - Cluster gerenciado MySQL-compatible com alta disponibilidade e conexões seguras TLSv1.2/1.3.

### Deploy do Backend na Oracle Cloud:
```bash
# 1. Clonar o repositório na VM
git clone https://github.com/LUIZLPM31/Conecta_Portunidade.git
cd Conecta_Portunidade

# 2. Configurar o arquivo .env de produção
cp .env.example .env
nano .env

# 3. Subir o container da API em background
docker compose up -d --build
```

---

## 🔑 Credenciais Padrão de Teste

Usuários pré-cadastrados no script inicial de banco de dados (`database/init.sql`):

| Perfil | E-mail | Senha Padrão | Descrição |
|---|---|---|---|
| **Administrador** | `admin2@conecta.com` ou `admin@conecta.com` | `admin123` | Acesso completo ao Dashboard Admin |
| **Empresa Demo** | `empresa@demo.com` | `empresa123` *(ou `admin123`)* | Publicação e gestão de vagas |

---

## 🛣️ Endpoints da API (CRUDs)

| Módulo | Método | Rota | Descrição |
|---|---|---|---|
| **Auth** | `POST` | `/api/auth/login` | Autenticação com geração de token JWT |
| **Auth** | `POST` | `/api/auth/registro` | Cadastro de novos usuários (Candidato / Empresa) |
| **Usuários** | `GET`, `POST` | `/api/usuarios` | Listagem e criação de usuários |
| **Usuários** | `GET`, `PUT`, `DELETE` | `/api/usuarios/{id}` | Obter dados, atualizar e remover perfil |
| **Vagas** | `GET`, `POST` | `/api/vagas` | Listagem geral de vagas e cadastro de novas vagas |
| **Vagas** | `GET`, `PUT`, `DELETE` | `/api/vagas/{id}` | Detalhes, edição e encerramento de vaga |
| **Vagas** | `GET` | `/api/vagas/empresa/{id}` | Vagas anunciadas por uma empresa específica |
| **Capacitações** | `GET`, `POST` | `/api/capacitacoes` | Catálogo de cursos e inclusão de capacitação |
| **Capacitações** | `GET`, `PUT`, `DELETE` | `/api/capacitacoes/{id}` | Detalhes, atualização e exclusão de curso |
| **Candidaturas** | `GET`, `POST` | `/api/candidaturas` | Listar candidaturas e aplicar para uma vaga |
| **Candidaturas** | `PUT` | `/api/candidaturas/{id}/status` | Alteração de status (PENDENTE, APROVADO, REJEITADO) |
| **Candidaturas** | `DELETE` | `/api/candidaturas/{id}` | Cancelamento de inscrição em vaga |

---

## 🎯 ODS Atendidas

- 🟫 **ODS 8 — Trabalho Decente e Crescimento Econômico**: Conecta candidatos em busca de oportunidades com empresas contratantes, além de disponibilizar capacitações para inserção no mercado de trabalho.
- 🟪 **ODS 10 — Redução das Desigualdades**: Promove democratização do acesso a vagas e cursos de capacitação gratuitos com foco em inclusão produtiva.
