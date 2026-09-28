# LeadFlow CRM

CRM web desenvolvido para organizar **leads, clientes, pipeline comercial e interações**. O projeto nasceu a partir de uma API de tarefas e foi reestruturado para representar um sistema de negócio completo, com regras de domínio e relacionamento entre entidades.

## Demonstração

- **Frontend:** https://todo-frontend-iota-six.vercel.app
- **API:** https://todo-api-weld-psi.vercel.app

> Os endereços antigos da Vercel foram mantidos para preservar o deploy existente, mas a aplicação exibida agora é o LeadFlow CRM.

## Funcionalidades

- Cadastro e autenticação de usuários
- JWT e rotas protegidas
- Dashboard comercial
- Gestão de leads
- Pipeline Kanban com drag and drop
- Etapas: Novo, Contato, Qualificado, Proposta, Negociação, Ganho e Perdido
- Origem do lead e valor estimado
- Follow-up e próximo contato
- Conversão de lead em cliente
- Gestão de clientes
- Histórico de ligações, WhatsApp, e-mails, reuniões, notas e follow-ups
- Busca e filtros
- Isolamento de dados por usuário
- PWA e interface responsiva

## Stack

**Backend:** Node.js, Express, MongoDB, Mongoose, JWT, bcrypt  
**Frontend:** HTML, CSS e JavaScript  
**Infraestrutura:** MongoDB Atlas e Vercel

## Arquitetura

```text
LeadFlow CRM
├── api/
│   └── index.js
├── frontend/
│   ├── index.html
│   ├── manifest.json
│   └── sw.js
└── src/
    ├── controllers/
    │   ├── activityController.js
    │   ├── customerController.js
    │   ├── dashboardController.js
    │   ├── leadController.js
    │   └── userController.js
    ├── middleware/
    │   └── auth.js
    ├── models/
    │   ├── Activity.js
    │   ├── Customer.js
    │   ├── Lead.js
    │   └── User.js
    └── routes/
        ├── activityRoutes.js
        ├── customerRoutes.js
        ├── dashboardRoutes.js
        ├── leadRoutes.js
        └── userRoutes.js
```

## Entidades

### Lead
Representa uma oportunidade comercial antes da conversão.

Principais campos: nome, empresa, contato, origem, etapa, valor estimado, observações e próximo follow-up.

### Customer
Representa um cliente da carteira. Um cliente pode nascer diretamente no CRM ou a partir da conversão de um lead.

### Activity
Registra o histórico de relacionamento com leads e clientes: ligação, WhatsApp, e-mail, reunião, nota ou follow-up.

### User
Responsável pela autenticação e pelo isolamento dos dados do CRM.

## Endpoints principais

| Método | Endpoint | Descrição |
| --- | --- | --- |
| POST | `/api/auth/register` | Criar conta |
| POST | `/api/auth/login` | Fazer login |
| GET | `/api/dashboard` | Indicadores comerciais |
| GET/POST | `/api/leads` | Listar / criar leads |
| GET/PUT/DELETE | `/api/leads/:id` | Consultar / editar / excluir lead |
| POST | `/api/leads/:id/convert` | Converter lead em cliente |
| GET/POST | `/api/customers` | Listar / criar clientes |
| GET/PUT/DELETE | `/api/customers/:id` | Consultar / editar / arquivar cliente |
| GET/POST | `/api/activities` | Listar / registrar interações |
| PUT/DELETE | `/api/activities/:id` | Editar / excluir interação |

Todas as rotas de negócio exigem:

```http
Authorization: Bearer SEU_TOKEN_JWT
```

## Executando localmente

```bash
git clone https://github.com/maria-luiza-souza/todo-api.git
cd todo-api
npm install
```

Crie o arquivo `.env` a partir de `.env.example`:

```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/todo-api
JWT_SECRET=sua_chave_privada
JWT_EXPIRES_IN=24h
```

Depois:

```bash
npm start
```

## Segurança

- Senhas com hash bcrypt
- JWT para autenticação
- Dados filtrados pelo usuário autenticado
- Rotas protegidas
- Campos de atualização permitidos por whitelist
- Credenciais fora do código-fonte
- Respostas de erro sem detalhes internos do servidor

## Evolução planejada

- Equipes e responsáveis por lead
- Motivos de perda
- Metas comerciais
- Importação de contatos
- Exportação de relatórios
- Histórico completo por cliente
- Funil configurável

## Autora

**Maria Luiza de Souza**

- GitHub: https://github.com/maria-luiza-souza
- LinkedIn: https://www.linkedin.com/in/malu-souza-a27564224/
- Portfólio: https://github.com/maria-luiza-souza/Portf-lio-Profissional
