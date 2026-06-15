# 📊 DIAGRAMA VISUAL DA ARQUITETURA

Este arquivo mostra visualmente como toda a aplicação está estruturada!

```
┌────────────────────────────────────────────────────────────────────┐
│                         TODO API                                   │
│                    Node.js + Express + MongoDB                      │
└────────────────────────────────────────────────────────────────────┘

                              ▼
        
        ┌──────────────────────────────────────────┐
        │          CLIENTE (Postman)               │
        │   Envia requisições HTTP (POST, GET...)  │
        └──────────────────┬───────────────────────┘
                           │
                           ▼
        
        ┌──────────────────────────────────────────┐
        │       SERVIDOR EXPRESS (server.js)       │
        │                                          │
        │  app.listen(5000)                        │
        │  ↓                                       │
        │  Middlewares globais:                   │
        │  - express.json()                       │
        │  - cors()                               │
        │  ↓                                       │
        │  Rotas configuradas:                    │
        │  - /api/auth → userRoutes               │
        │  - /api/tasks → taskRoutes              │
        └──────────────────┬───────────────────────┘
                           │
            ┌──────────────┴──────────────┐
            │                             │
            ▼                             ▼
            
    ┌───────────────────┐       ┌───────────────────┐
    │   USER ROUTES     │       │  TASK ROUTES      │
    │                   │       │                   │
    │ POST /register    │       │ GET /             │
    │ POST /login       │       │ GET /:id          │
    │                   │       │ POST /            │
    │ ↓                 │       │ PUT /:id          │
    │ userController    │       │ DELETE /:id       │
    │                   │       │ ↓                 │
    └───────────────────┘       │ taskController    │
            │                   │ + protect         │
            │                   │ middleware!       │
            │                   │                   │
            └────────┬──────────┘
                     │
            ▼────────────────────▼
            
    ┌─────────────────────────────────┐
    │    MIDDLEWARE: auth.js          │
    │                                 │
    │  protect() → verifica JWT       │
    │                                 │
    │  Se válido:                     │
    │    req.user.id = ID do usuário  │
    │  Se inválido:                   │
    │    Erro 401 - Não autorizado    │
    └──────────────┬──────────────────┘
                   │
        ┌──────────┴──────────┐
        │                     │
        ▼                     ▼
        
    ┌──────────────────┐  ┌──────────────────┐
    │  USER CONTROLLER │  │ TASK CONTROLLER  │
    │                  │  │                  │
    │  register()      │  │  getTasks()      │
    │  login()         │  │  getTaskById()   │
    │                  │  │  createTask()    │
    │  ↓ chama Model   │  │  updateTask()    │
    └──────────────────┘  │  deleteTask()    │
                          │                  │
                          │  ↓ chama Model   │
                          └──────────────────┘
                                  │
                    ┌─────────────┴──────────────┐
                    │                            │
                    ▼                            ▼
                    
                ┌──────────────┐          ┌──────────────┐
                │  USER MODEL  │          │  TASK MODEL  │
                │              │          │              │
                │  name        │          │  title       │
                │  email       │          │  description │
                │  password    │          │  completed   │
                │  (schema)    │          │  priority    │
                │              │          │  user (ref)  │
                │  Métodos:    │          │  (schema)    │
                │  - save()    │          │              │
                │  - match()   │          │  Métodos:    │
                │              │          │  - create()  │
                │              │          │  - find()    │
                │              │          │  - update()  │
                │              │          │  - delete()  │
                │              │          │              │
                └──────────────┘          └──────────────┘
                        │                         │
                        └────────────┬────────────┘
                                     │
                                     ▼
                        
                    ┌────────────────────────┐
                    │   MONGODB DATABASE     │
                    │                        │
                    │  Collections:          │
                    │  - users               │
                    │  - tasks               │
                    │                        │
                    │  Armazena dados em     │
                    │  documentos JSON       │
                    │                        │
                    └────────────────────────┘
```

---

## 📁 Estrutura de Pastas Detalhada

```
todo-api/
│
├── src/                           ← Código fonte da aplicação
│   │
│   ├── config/
│   │   └── database.js           ← Configuração do MongoDB
│   │       └── connectDB()        ← Função para conectar
│   │
│   ├── middleware/
│   │   └── auth.js               ← Autenticação JWT
│   │       └── protect()          ← Middleware de proteção
│   │
│   ├── models/                   ← Schemas do MongoDB
│   │   ├── User.js               ← Estrutura de usuário
│   │   │   ├── name (string)
│   │   │   ├── email (string unique)
│   │   │   └── password (string)
│   │   │
│   │   └── Task.js               ← Estrutura de tarefa
│   │       ├── title (string)
│   │       ├── description (string)
│   │       ├── completed (boolean)
│   │       ├── priority (enum)
│   │       └── user (ObjectId ref)
│   │
│   ├── controllers/              ← Lógica de negócio
│   │   ├── userController.js     ← Funções para auth
│   │   │   ├── register()         ← Registrar novo usuário
│   │   │   └── login()            ← Fazer login
│   │   │
│   │   └── taskController.js     ← Funções para tarefas
│   │       ├── getTasks()         ← Listar tarefas
│   │       ├── getTaskById()      ← Buscar tarefa
│   │       ├── createTask()       ← Criar tarefa
│   │       ├── updateTask()       ← Atualizar tarefa
│   │       └── deleteTask()       ← Deletar tarefa
│   │
│   └── routes/                   ← Definição de URLs
│       ├── userRoutes.js         ← Rotas de autenticação
│       │   ├── POST /register
│       │   └── POST /login
│       │
│       └── taskRoutes.js         ← Rotas de tarefas
│           ├── GET /
│           ├── GET /:id
│           ├── POST /
│           ├── PUT /:id
│           └── DELETE /:id
│
├── server.js                      ← Arquivo principal
│   ├── Carrega .env
│   ├── Cria app Express
│   ├── Conecta ao MongoDB
│   ├── Define middlewares
│   ├── Define rotas
│   └── Inicia servidor na porta 5000
│
├── package.json                   ← Dependências do projeto
│   └── Dependencies:
│       ├── express              (framework web)
│       ├── mongoose             (MongoDB)
│       ├── jsonwebtoken         (JWT)
│       ├── bcryptjs             (criptografia)
│       └── cors                 (requisições cruzadas)
│
├── .env.example                   ← Exemplo de variáveis
│   ├── PORT
│   ├── MONGODB_URI
│   ├── JWT_SECRET
│   └── JWT_EXPIRES_IN
│
├── .env                          ← NUNCA COMMITAR! (seu .env real)
│
├── README.md                      ← Documentação completa
├── ARQUITETURA.md                ← Explicação de fluxo
├── COMECE_AQUI.md                ← Guia de início
└── DIAGRAMA.md                   ← Este arquivo!
```

---

## 🔄 Fluxo Completo: Exemplo Real

### Requisição: Criar Tarefa

```
1. CLIENTE
   POST http://localhost:5000/api/tasks
   Authorization: Bearer TOKEN
   {
     "title": "Estudar API",
     "priority": "alta"
   }

2. SERVIDOR (server.js)
   ✓ Recebe a requisição
   ✓ Identifica que é /api/tasks
   ✓ Chama o middleware de CORS e JSON
   ✓ Encaminha para taskRoutes

3. ROTAS (src/routes/taskRoutes.js)
   ✓ POST / é identificado
   ✓ Executa middleware 'protect' (autenticação)
   ✓ Chama createTask do controller

4. MIDDLEWARE (src/middleware/auth.js)
   ✓ Extrai token do header
   ✓ Valida token com JWT_SECRET
   ✓ Coloca req.user.id = "123"
   ✓ Chama next() para continuar

5. CONTROLLER (src/controllers/taskController.js)
   ✓ Extrai dados do body
   ✓ Extrai userId do middleware
   ✓ Chama Task.create({
       title, priority, user: userId
     })

6. MODEL (src/models/Task.js)
   ✓ Valida dados contra schema
   ✓ Chama MongoDB para salvar
   ✓ Retorna objeto Task criado

7. DATABASE (MongoDB)
   ✓ Salva documento em "tasks"
   ✓ Retorna objeto com _id

8. RESPOSTA
   {
     "success": true,
     "message": "Tarefa criada com sucesso!",
     "data": {
       "_id": "507f1f77bcf86cd799439011",
       "title": "Estudar API",
       "priority": "alta",
       "completed": false,
       "user": "507f1f77bcf86cd799439012",
       "createdAt": "2024-06-15...",
       "updatedAt": "2024-06-15..."
     }
   }
```

---

## 🎯 Responsabilidades de Cada Arquivo

| Arquivo | Responsabilidade |
|---------|------------------|
| `server.js` | Iniciar servidor, conectar ao DB, definir middlewares |
| `config/database.js` | Conectar ao MongoDB usando Mongoose |
| `models/User.js` | Definir estrutura de usuário |
| `models/Task.js` | Definir estrutura de tarefa |
| `middleware/auth.js` | Verificar autenticação JWT |
| `controllers/userController.js` | Registrar, fazer login |
| `controllers/taskController.js` | Operações CRUD de tarefas |
| `routes/userRoutes.js` | Definir URLs de autenticação |
| `routes/taskRoutes.js` | Definir URLs de tarefas |
| `package.json` | Listar dependências |
| `.env` | Variáveis sensíveis (senha, tokens) |

---

## 💡 Dica de Aprendizado

Quando estudar este código:

1. **Primeiro:** Entenda `server.js` (é o ponto de entrada)
2. **Depois:** Estude as rotas (como URLs são definidas)
3. **Depois:** Estude middlewares (como autenticação funciona)
4. **Depois:** Estude controllers (lógica de negócio)
5. **Depois:** Estude models (estrutura de dados)
6. **Por fim:** Coloque tudo junto e entenda o fluxo completo

Boa sorte! 🚀

