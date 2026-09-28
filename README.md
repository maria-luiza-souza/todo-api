# TaskFlow — TODO API

Aplicação full stack para gerenciamento de tarefas, desenvolvida como projeto de portfólio com **Node.js, Express, MongoDB e autenticação JWT**.

O projeto combina uma API REST com uma interface responsiva, permitindo que cada usuário cadastre e gerencie suas próprias tarefas com prioridade, categoria e data de vencimento.

## Demonstração

- **Frontend:** https://todo-frontend-iota-six.vercel.app
- **API:** https://todo-api-weld-psi.vercel.app

## Principais funcionalidades

- Cadastro e autenticação de usuários
- Senhas armazenadas com hash usando bcrypt
- Autenticação por JWT
- Rotas protegidas
- CRUD completo de tarefas
- Isolamento das tarefas por usuário
- Prioridade, categoria e data de vencimento
- Busca, filtros e ordenação
- Estatísticas de tarefas
- Interface responsiva
- Modo escuro
- PWA com manifest e service worker
- Deploy de frontend e API na Vercel

## Tecnologias

**Backend:** Node.js, Express, MongoDB, Mongoose, JWT e bcrypt  
**Frontend:** HTML, CSS e JavaScript  
**Ferramentas:** Git, GitHub, Vercel, Postman e MongoDB Atlas

## Estrutura do projeto

```text
todo-api/
├── api/
│   └── index.js              # Entrada da API na Vercel
├── frontend/
│   ├── index.html            # Interface do TaskFlow
│   ├── manifest.json         # Configuração PWA
│   └── sw.js                 # Service Worker
├── src/
│   ├── config/               # Banco de dados
│   ├── controllers/          # Regras das operações
│   ├── middleware/           # Autenticação JWT
│   ├── models/               # Schemas Mongoose
│   └── routes/               # Endpoints REST
├── server.js                 # Execução local
├── vercel.json               # Deploy da API
└── .env.example              # Exemplo de configuração
```

Documentação adicional:

- [Arquitetura](./ARQUITETURA.md)
- [Diagrama](./DIAGRAMA.md)
- [Guia do projeto](./COMECE_AQUI.md)

## Endpoints

| Método | Endpoint | Descrição | Autenticação |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | Criar usuário | Não |
| POST | `/api/auth/login` | Fazer login | Não |
| GET | `/api/tasks` | Listar tarefas | Sim |
| GET | `/api/tasks/stats` | Estatísticas | Sim |
| GET | `/api/tasks/:id` | Buscar tarefa | Sim |
| POST | `/api/tasks` | Criar tarefa | Sim |
| PUT | `/api/tasks/:id` | Atualizar tarefa | Sim |
| DELETE | `/api/tasks/:id` | Excluir tarefa | Sim |

As rotas protegidas utilizam:

```http
Authorization: Bearer SEU_TOKEN_JWT
```

## Executando localmente

### Requisitos

- Node.js
- npm
- MongoDB local ou MongoDB Atlas

### Instalação

```bash
git clone https://github.com/maria-luiza-souza/todo-api.git
cd todo-api
npm install
```

Crie o arquivo `.env` usando `.env.example` como referência:

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

A API local fica disponível em:

```text
http://localhost:3001
```

## Segurança

- Hash de senhas com bcrypt
- JWT para autenticação
- Middleware nas rotas privadas
- Dados de tarefas associados ao usuário autenticado
- Variáveis sensíveis mantidas fora do código-fonte
- Respostas de erro sem exposição de detalhes internos do servidor

> Arquivos `.env`, senhas, tokens e strings privadas de conexão nunca devem ser enviados ao repositório.

## O que este projeto demonstra

- Estruturação de APIs REST
- Modelagem de dados com MongoDB e Mongoose
- Autenticação e autorização
- Organização em rotas, controllers, models e middleware
- Integração entre frontend e backend
- Deploy de aplicações web

## Autora

**Maria Luiza de Souza**

- GitHub: https://github.com/maria-luiza-souza
- LinkedIn: https://www.linkedin.com/in/malu-souza-a27564224/
- Portfólio: https://github.com/maria-luiza-souza/Portf-lio-Profissional
