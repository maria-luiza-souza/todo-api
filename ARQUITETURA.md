# 📚 GUIA DE ESTUDO: Entendendo a Arquitetura

Olá Maria! Este documento explica como TODA essa arquitetura funciona junta. Leia devagar e tente acompanhar o fluxo! 🚀

## 🎬 Vamos seguir uma requisição do início ao fim

Imagine que você está testando no Postman e faz uma requisição:

```http
POST http://localhost:5000/api/tasks
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Content-Type: application/json

{
  "title": "Aprender JavaScript",
  "description": "Estudar funções async/await",
  "priority": "alta"
}
```

Agora vamos ver o que acontece nos bastidores...

---

## 📍 ETAPA 1: Servidor recebe a requisição

**Arquivo: server.js**

```javascript
const app = express();
app.use(express.json()); // Interpreta o JSON do corpo
app.use('/api/tasks', taskRoutes); // Define que /api/tasks usa taskRoutes

app.listen(5000, () => { /* ... */ });
```

O servidor Express está "ouvindo" na porta 5000.

Quando recebe a requisição POST /api/tasks:
1. Express identifica que é uma rota de tasks
2. Procura em `taskRoutes`

---

## 📍 ETAPA 2: Rota é identificada

**Arquivo: src/routes/taskRoutes.js**

```javascript
const { protect } = require('../middleware/auth');

router.use(protect); // Aplica o middleware em TODAS as rotas
router.post('/', createTask); // POST /api/tasks -> função createTask
```

Antes de chamar `createTask`, executa o middleware `protect`:

---

## 📍 ETAPA 3: Middleware verifica autenticação

**Arquivo: src/middleware/auth.js**

```javascript
const protect = (req, res, next) => {
  // 1. Extrai o token do header
  let token = req.headers.authorization.split(' ')[1]; // Remove "Bearer "
  
  // 2. Decodifica e verifica o token
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
  // 3. Se válido, coloca o ID do usuário na requisição
  req.user = { id: decoded.id };
  
  // 4. Continua para a próxima função
  next();
};
```

Agora `req.user.id` contém o ID do usuário autenticado!

---

## 📍 ETAPA 4: Controller processa a requisição

**Arquivo: src/controllers/taskController.js**

```javascript
const createTask = async (req, res) => {
  // 1. Extrai dados do corpo da requisição
  const { title, description, priority } = req.body;
  const userId = req.user.id; // ID do usuário vem do middleware!
  
  // 2. Valida os dados
  if (!title) {
    return res.status(400).json({ success: false });
  }
  
  // 3. Chama o Model para salvar no banco
  const task = await Task.create({
    title,
    description,
    priority,
    user: userId, // Associa a tarefa ao usuário
    completed: false,
  });
  
  // 4. Retorna resposta ao cliente
  res.status(201).json({
    success: true,
    message: 'Tarefa criada com sucesso!',
    data: task,
  });
};
```

O controller chama `Task.create()` que é o Model:

---

## 📍 ETAPA 5: Model salva no banco

**Arquivo: src/models/Task.js**

```javascript
const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Título obrigatório'],
    maxlength: [100, 'Máximo 100 caracteres'],
  },
  description: String,
  completed: { type: Boolean, default: false },
  priority: { type: String, enum: ['baixa', 'média', 'alta'] },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
```

Quando `Task.create()` é chamado:
1. Mongoose valida os dados contra o schema
2. Se algum campo não atender aos requisitos (ex: title vazio), retorna erro
3. Se tudo está OK, salva no MongoDB

---

## 📊 Fluxo Visual Completo

```
┌─────────────────────────────────────────────────────────────────┐
│ CLIENTE (Postman/Navegador)                                     │
│                                                                  │
│  POST /api/tasks                                                │
│  Authorization: Bearer TOKEN                                    │
│  { title: "...", description: "...", priority: "..." }          │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│ SERVER.JS                                                       │
│                                                                  │
│  app.use('/api/tasks', taskRoutes)                              │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│ TASK ROUTES (src/routes/taskRoutes.js)                          │
│                                                                  │
│  router.post('/', createTask) ← Identifica POST /api/tasks      │
│  Mas antes executa: router.use(protect)                         │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│ MIDDLEWARE AUTH (src/middleware/auth.js)                        │
│                                                                  │
│  const protect = (req, res, next) => {                          │
│    1. Extrai token do header                                    │
│    2. Valida o token                                            │
│    3. req.user.id = ID do usuário                              │
│    4. next() → continua                                         │
│  }                                                              │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│ CONTROLLER (src/controllers/taskController.js)                  │
│                                                                  │
│  const createTask = async (req, res) => {                       │
│    1. Extrai { title, description, priority } do body          │
│    2. userId = req.user.id (do middleware!)                    │
│    3. Chama Task.create({ ... })                               │
│    4. res.status(201).json({ ... })                            │
│  }                                                              │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│ MODEL (src/models/Task.js)                                      │
│                                                                  │
│  Task.create(data)                                              │
│  1. Valida contra schema                                        │
│  2. Se válido, salva no MongoDB                                 │
│  3. Retorna objeto Task criado                                  │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│ DATABASE (MongoDB)                                              │
│                                                                  │
│  ┌──────────────────────────────────────┐                       │
│  │ tasks collection                     │                       │
│  │ {                                    │                       │
│  │   _id: "507f1f77bcf86cd799439011",  │                       │
│  │   title: "Aprender JavaScript",      │                       │
│  │   description: "Estudar async/await", │                       │
│  │   priority: "alta",                 │                       │
│  │   completed: false,                 │                       │
│  │   user: "507f1f77bcf86cd799439012", │                       │
│  │   createdAt: "2024-06-15...",       │                       │
│  │   updatedAt: "2024-06-15..."        │                       │
│  │ }                                    │                       │
│  └──────────────────────────────────────┘                       │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│ RESPOSTA AO CLIENTE                                             │
│                                                                  │
│ {                                                               │
│   "success": true,                                              │
│   "message": "Tarefa criada com sucesso!",                      │
│   "data": {                                                     │
│     "_id": "507f1f77bcf86cd799439011",                          │
│     "title": "Aprender JavaScript",                             │
│     ...                                                         │
│   }                                                             │
│ }                                                               │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔍 Entendendo as Camadas

### Camada 1: Rotas (Routes)
**Responsabilidade:** Definir URLs
**Exemplo:** `POST /api/tasks`
**Arquivo:** `src/routes/taskRoutes.js`

### Camada 2: Middlewares
**Responsabilidade:** Executar antes das rotas (validar, autenticar, etc.)
**Exemplo:** Verificar se o usuário tem um token válido
**Arquivo:** `src/middleware/auth.js`

### Camada 3: Controllers
**Responsabilidade:** Lógica de negócio
**Exemplo:** Validar dados, chamar Model, retornar resposta
**Arquivo:** `src/controllers/taskController.js`

### Camada 4: Models
**Responsabilidade:** Definir estrutura dos dados e comunicar com banco
**Exemplo:** Schema de Task, validações, salvar no MongoDB
**Arquivo:** `src/models/Task.js`

### Camada 5: Banco de Dados
**Responsabilidade:** Armazenar dados
**Tecnologia:** MongoDB

---

## 🎓 Conceitos Importantes

### Request (Requisição)
É o que o cliente ENVIA para o servidor.

```
POST /api/tasks HTTP/1.1
Host: localhost:5000
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "title": "...",
  "description": "..."
}
```

### Response (Resposta)
É o que o servidor RETORNA ao cliente.

```
HTTP/1.1 201 Created
Content-Type: application/json

{
  "success": true,
  "message": "...",
  "data": { ... }
}
```

### req (Objeto Requisição)
Contém todos os dados da requisição:
- `req.body` - corpo da requisição (JSON)
- `req.params` - parâmetros da URL (ex: /tasks/:id)
- `req.query` - query strings (ex: /tasks?priority=alta)
- `req.headers` - headers HTTP
- `req.user` - dados do usuário (adicionado pelo middleware)

### res (Objeto Resposta)
Usado para enviar resposta ao cliente:
- `res.status(200)` - define código de status
- `res.json({ ... })` - envia resposta JSON
- `res.send('texto')` - envia texto simples

### Async/Await
Padrão para trabalhar com operações assíncronas (que demoram):

```javascript
// Sem async/await (callback hell)
Task.create(data, (err, task) => {
  if (err) { /* ... */ }
  res.json(task);
});

// Com async/await (muito melhor!)
const createTask = async (req, res) => {
  const task = await Task.create(data); // Espera o MongoDB responder
  res.json(task);
};
```

---

## 💡 Exercícios para praticar

### Exercício 1: Adicionar novo campo
**Objetivo:** Entender Models

1. Abra `src/models/Task.js`
2. Adicione um novo campo: `dueDate` (data de vencimento)
3. Rode o servidor e crie uma tarefa com data
4. Verifique no MongoDB (use MongoDB Compass)

### Exercício 2: Criar novo endpoint
**Objetivo:** Entender Routes + Controllers

1. Abra `src/routes/taskRoutes.js`
2. Adicione uma nova rota: `router.get('/completed', getCompletedTasks)`
3. Abra `src/controllers/taskController.js`
4. Crie a função `getCompletedTasks` que retorna apenas tarefas concluídas
5. Teste no Postman

### Exercício 3: Adicionar validação
**Objetivo:** Entender Middleware

1. Crie um novo arquivo: `src/middleware/validation.js`
2. Crie uma função que valida se o título tem no mínimo 5 caracteres
3. Use esse middleware na rota POST /api/tasks
4. Teste enviando um título muito curto

---

## 🚀 Parabéns!

Agora você entende:
- ✅ Como requisições fluem pelo código
- ✅ O propósito de cada arquivo/pasta
- ✅ Como banco de dados integra com API
- ✅ Como autenticação funciona
- ✅ Padrão MVC (Model-View-Controller)

Próximo passo: **Fazer deploy online** e compartilhar no GitHub!

