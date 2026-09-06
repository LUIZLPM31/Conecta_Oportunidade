# Conecta Oportunidades 🚀

> Plataforma de empregabilidade e capacitação profissional — ODS 8 e ODS 10

🔗 **Acesse o projeto online:** [https://conecta-oportunidades.vercel.app/](https://conecta-oportunidades.vercel.app/)
## Stack

| Camada | Tecnologia |
|---|---|
| Banco de Dados | MySQL 8  |
| Backend | Java 17 + Spring Boot 3 |
| Frontend | React 18 + Vite + Bootstrap 5 |
| Deploy | Docker Compose + Oracle Cloud Free Tier |

---

## Estrutura do Projeto

```
ProjetoFinalRecolde/
├── database/
│   └── init.sql             # Script SQL com tabelas e dados iniciais
├── backend/                 # API Spring Boot
│   ├── src/
│   └── pom.xml
├── frontend/                # SPA React
│   ├── src/
│   └── package.json
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## Rodando em desenvolvimento

### Pré-requisitos
- Java 17
- Node.js 20+
- MySQL 8 rodando localmente

### Backend
```bash
cd backend

export DB_HOST=localhost DB_USER=root DB_PASSWORD=suasenha

mvn spring-boot:run

```

### Frontend
```bash
cd frontend
npm install
npm run dev

```

---

## Deploy na Oracle Cloud

### 1. Criar VM
- Shape: `VM.Standard.E2.1.Micro` 
- OS: Ubuntu 22.04


### 2. Instalar Docker na VM
```bash
sudo apt update && sudo apt install -y docker.io docker-compose-plugin
sudo usermod -aG docker $USER
```

### 3. Clonar e configurar
```bash
git clone <url-do-repo>
cd ProjetoFinalRecolde

cp .env.example .env
nano .env   
```

### 4. Subir os containers
```bash
docker compose up -d --build
```





## Credenciais padrão (desenvolvimento)

| Perfil | E-mail | Senha |
|---|---|---|
| Admin | admin@conecta.com | admin123 |
| Empresa Demo | empresa@demo.com | admin123 |



---

## CRUDs implementados

| CRUD | Entidade | Rotas |
|---|---|---|
| 1 | Usuários | `/api/usuarios` |
| 2 | Vagas | `/api/vagas` |
| 3 | Capacitações | `/api/capacitacoes` |
| 4 (bônus) | Candidaturas | `/api/candidaturas` |

---

## ODS Atendidas

- 🟫 **ODS 8** — Trabalho Decente e Crescimento Econômico
- 🟪 **ODS 10** — Redução das Desigualdades
