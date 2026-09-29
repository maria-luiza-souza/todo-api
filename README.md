# LeadFlow CRM

CRM web desenvolvido para organizar **leads, clientes, pipeline comercial e interações**. O projeto nasceu a partir de uma API de tarefas e foi reestruturado para representar um sistema de negócio completo, com regras de domínio e relacionamento entre entidades.

## Demonstração

- **Frontend:** https://todo-frontend-iota-six.vercel.app
- **API:** https://todo-api-weld-psi.vercel.app

> Os endereços antigos da Vercel foram mantidos para preservar o deploy existente, mas a aplicação exibida agora é o LeadFlow CRM.

## Funcionalidades

- Cadastro e autenticação de usuários
- JWT e rotas protegidas
- Dashboard comercial com pipeline, forecast, taxa de ganho e vendas do mês
- Gestão de leads
- Negociações (Deals) separadas dos leads e clientes
- Pipeline Kanban de negociações com drag and drop
- Etapas: Novo, Contato, Qualificado, Proposta, Negociação, Ganho e Perdido
- Origem do lead e próximo follow-up
- Valor, probabilidade, responsável e previsão de fechamento por negociação
- Motivo de perda e tempo na etapa
- Conversão de lead em cliente
- Gestão de clientes
- Histórico de ligações, WhatsApp, e-mails, reuniões, notas e follow-ups
- Visão 360º de leads e clientes com negociações e interações
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
    │   ├── Deal.js
    │   ├── Lead.js
    │   └── User.js
    └── routes/
        ├── activityRoutes.js
        ├── customerRoutes.js
        ├── dashboardRoutes.js
        ├── dealRoutes.js
        ├── leadRoutes.js
        └── userRoutes.js
```

## Entidades

### Lead
Representa uma oportunidade comercial antes da conversão.

Principais campos: nome, empresa, contato, origem, etapa, valor estimado, observações e próximo follow-up.

### Customer
Representa um cliente da carteira. Um cliente pode nascer diretamente no CRM ou a partir da conversão de um lead.

### Deal
Representa uma negociação comercial separada do cadastro do lead/cliente. Armazena valor, etapa, probabilidade, previsão de fechamento, responsável, motivo de perda e datas de mudança de etapa.

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
| GET | `/api/leads/:id/overview` | Visão 360º do lead |
| GET | `/api/customers/:id/overview` | Visão 360º do cliente |
| GET/POST | `/api/deals` | Listar / criar negociações |
| GET/PUT/DELETE | `/api/deals/:id` | Consultar / editar / excluir negociação |
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

- Empresas e contatos como entidades separadas
- Equipes e permissões comerciais
- Metas e desempenho por responsável
- Importação de contatos por CSV
- Exportação de relatórios
- Funil configurável
- Auditoria de alterações

## Autora

**Maria Luiza de Souza**

- GitHub: https://github.com/maria-luiza-souza
- LinkedIn: https://www.linkedin.com/in/malu-souza-a27564224/
- Portfólio: https://github.com/maria-luiza-souza/Portf-lio-Profissional
