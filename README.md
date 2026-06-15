# TODO API - Documentação Completa 📚

Bem-vindo! Este é um projeto **TODO API** profissional criado em **Node.js + Express + MongoDB**. Este documento é seu guia de aprendizado!

## 📋 Índice

1. [O que é este projeto](#o-que-é-este-projeto)
2. [Arquitetura](#arquitetura)
3. [Instalação](#instalação)
4. [Como usar](#como-usar)
5. [Endpoints da API](#endpoints-da-api)
6. [Explicação detalhada](#explicação-detalhada)

---

## 🎯 O que é este projeto?

Uma **API REST** que permite:
- ✅ Criar conta de usuário (register)
- ✅ Fazer login
- ✅ Criar, ler, atualizar e deletar tarefas (CRUD)
- ✅ Proteger dados com JWT (JSON Web Token)
- ✅ Conectar a um banco de dados MongoDB

**Perfeito para aprender:**
- Arquitetura de APIs profissionais
- Node.js + Express
- Autenticação com JWT
- Banco de dados MongoDB
- Boas práticas de código

---

## 🏗️ Arquitetura

```
projeto/
├── src/
│   ├── config/          ← Configurações (conexão com DB)
│   ├── controllers/     ← Lógica de negócio
│   ├── middleware/      ← Funções que rodam antes das rotas
│   ├── models/          ← Estrutura dos dados (schemas)
│   └── routes/          ← URLs da API
├── .env                 ← Variáveis de ambiente (NUNCA commitar!)
├── .env.example         ← Exemplo do .env (pode commitar)
├── package.json         ← Dependências do projeto
└── server.js            ← Arquivo principal
```

### Fluxo de uma requisição:

```
Cliente faz requisição HTTP
         ↓
Express recebe a requisição
         ↓
Middleware 'auth' verifica se tem token (se rota exigir)
         ↓
Route (URL) é identificada
         ↓
Controller processa a lógica
         ↓
Model valida e salva/busca dados no MongoDB
         ↓
Resposta JSON é retornada ao cliente
```

---

## 💻 Instalação

### Passo 1: Instalar dependências

```bash
cd C:\Users\maryc\Desktop\todo-api
npm install
```

### Passo 2: Criar arquivo .env

Copie `.env.example` para `.env` e configure:

```bash
# Windows PowerShell
Copy-Item .env.example .env
```

Edit o arquivo `.env`:
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/todo-api
JWT_SECRET=sua_chave_super_secreta_123456
JWT_EXPIRES_IN=24h
```

### Passo 3: Instalar MongoDB (opção local)

**Opção A: Local (Recomendado para aprender)**
1. Baixe em: https://www.mongodb.com/try/download/community
2. Instale normalmente
3. MongoDB rodará em `mongodb://localhost:27017`

**Opção B: Cloud (MongoDB Atlas)**
1. Crie conta em: https://www.mongodb.com/cloud/atlas
2. Crie um cluster grátis
3. Copie a string de conexão
4. Cole em `MONGODB_URI` no `.env`

### Passo 4: Rodar o servidor

```bash
# Modo produção (roda uma vez)
npm start

# Modo desenvolvimento (reinicia automaticamente quando muda arquivo)
npm run dev
```

Você verá:
```
✅ Servidor TODO API rodando na porta 5000
📍 Acesse: http://localhost:5000
🗄️ Banco de dados: mongodb://localhost:27017/todo-api
```

---

## 📡 Como usar

### Usando Postman ou Insomnia (recomendado)

#### 1. Registrar usuário

```http
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "Maria Luiza",
  "email": "maria@example.com",
  "password": "senha123"
}
```

**Resposta:**
```json
{
  "success": true,
  "message": "Usuário registrado com sucesso!",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Maria Luiza",
    "email": "maria@example.com"
  }
}
```

**IMPORTANTE:** Copie o `token` retornado! Você usará em todas as outras requisições.

#### 2. Login

```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "maria@example.com",
  "password": "senha123"
}
```

Retorna um novo `token`.

#### 3. Criar tarefa

```http
POST http://localhost:5000/api/tasks
Content-Type: application/json
Authorization: Bearer SEU_TOKEN_AQUI

{
  "title": "Estudar Node.js",
  "description": "Aprender sobre middlewares e controllers",
  "priority": "alta"
}
```

#### 4. Listar tarefas

```http
GET http://localhost:5000/api/tasks
Authorization: Bearer SEU_TOKEN_AQUI
```

**Resposta:**
```json
{
  "success": true,
  "count": 1,
  "message": "Tarefas recuperadas com sucesso",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Estudar Node.js",
      "description": "Aprender sobre middlewares e controllers",
      "completed": false,
      "priority": "alta",
      "user": "507f1f77bcf86cd799439012",
      "createdAt": "2024-06-15T10:30:00.000Z",
      "updatedAt": "2024-06-15T10:30:00.000Z"
    }
  ]
}
```

#### 5. Atualizar tarefa

```http
PUT http://localhost:5000/api/tasks/507f1f77bcf86cd799439011
Content-Type: application/json
Authorization: Bearer SEU_TOKEN_AQUI

{
  "completed": true,
  "priority": "média"
}
```

#### 6. Deletar tarefa

```http
DELETE http://localhost:5000/api/tasks/507f1f77bcf86cd799439011
Authorization: Bearer SEU_TOKEN_AQUI
```

---

## 📚 Endpoints da API

| Método | Rota | Descrição | Autenticação |
|--------|------|-----------|--------------|
| POST | `/api/auth/register` | Registrar novo usuário | ❌ Não |
| POST | `/api/auth/login` | Fazer login | ❌ Não |
| GET | `/api/tasks` | Listar tarefas do usuário | ✅ Sim |
| GET | `/api/tasks/:id` | Buscar tarefa específica | ✅ Sim |
| POST | `/api/tasks` | Criar nova tarefa | ✅ Sim |
| PUT | `/api/tasks/:id` | Atualizar tarefa | ✅ Sim |
| DELETE | `/api/tasks/:id` | Deletar tarefa | ✅ Sim |

---

## 🔍 Explicação Detalhada

### 1. Models (Modelos/Schemas)

**O que são?**
Definem a ESTRUTURA dos dados no banco.

**Exemplo: User.js**
```javascript
const userSchema = new mongoose.Schema({
  name: String,        // Nome é texto
  email: String,       // Email é texto
  password: String,    // Senha é texto (será criptografada)
}, { timestamps: true }); // Adiciona createdAt e updatedAt automaticamente
```

**Exemplo: Task.js**
```javascript
const taskSchema = new mongoose.Schema({
  title: String,                    // Título da tarefa
  description: String,              // Descrição (opcional)
  completed: Boolean,               // true ou false
  priority: String,                 // 'baixa', 'média', 'alta'
  user: mongoose.Schema.Types.ObjectId, // Referência ao usuário
}, { timestamps: true });
```

### 2. Controllers (Lógica de Negócio)

**O que são?**
Contêm as FUNÇÕES que processam os dados.

**Exemplo: userController.js**
```javascript
const register = async (req, res) => {
  // 1. Recebe dados (name, email, password)
  // 2. Valida se email já existe
  // 3. Cria novo usuário (senha é criptografada)
  // 4. Gera token JWT
  // 5. Retorna resposta
};

const login = async (req, res) => {
  // 1. Recebe email e senha
  // 2. Busca usuário no banco
  // 3. Compara senha
  // 4. Se correto, gera token
  // 5. Retorna resposta
};
```

### 3. Routes (Rotas/URLs)

**O que são?**
Definem as URLs e qual função chamar.

**Exemplo: userRoutes.js**
```javascript
router.post('/register', register);  // POST /api/auth/register -> função register
router.post('/login', login);        // POST /api/auth/login -> função login
```

### 4. Middleware

**O que é?**
Função que executa ANTES da rota ser processada.

**Exemplo: middleware/auth.js**
```javascript
const protect = (req, res, next) => {
  // 1. Extrai token do header
  // 2. Verifica se é válido
  // 3. Se válido, coloca ID do usuário em req.user
  // 4. Chama next() para continuar
  // 5. Se inválido, retorna erro 401
};
```

### 5. Server (Arquivo Principal)

**O que é?**
Inicializa a aplicação e define configurações gerais.

```javascript
require('dotenv').config(); // Carrega .env
const app = express();

connectDB();                 // Conecta ao MongoDB
app.use(express.json());    // Permite JSON
app.use(cors());            // Permite requisições cross-origin

app.use('/api/auth', userRoutes);  // Rotas de autenticação
app.use('/api/tasks', taskRoutes); // Rotas de tarefas

app.listen(5000, () => {
  console.log('Servidor rodando!');
});
```

---

## 🔐 Como funciona a autenticação (JWT)?

### Fluxo:

1. **Usuário se registra:**
   ```
   POST /api/auth/register
   { name, email, password }
         ↓
   Server criptografa senha
   Server salva usuário no DB
   Server cria JWT Token com ID do usuário
   Server retorna token ao cliente
   ```

2. **Cliente armazena o token:**
   ```
   Token no navegador (localStorage, sessionStorage, etc.)
   Ou em variável do Postman
   ```

3. **Cliente acessa rota protegida:**
   ```
   GET /api/tasks
   Header: Authorization: Bearer TOKEN
         ↓
   Middleware 'protect' verifica token
   Se válido, coloca ID do usuário em req.user
   Controller usa req.user.id para buscar tarefas daquele usuário
   ```

4. **Segurança:**
   - Token expira em 24 horas (JWT_EXPIRES_IN)
   - Senha é criptografada com bcrypt
   - Cada usuário só vê suas próprias tarefas

---

## 📝 Estrutura de uma Resposta de Sucesso

```json
{
  "success": true,
  "message": "Descrição do que aconteceu",
  "data": { /* dados retornados */ },
  "count": 5 /* quantidade de itens (se aplicável) */
}
```

## ❌ Estrutura de uma Resposta de Erro

```json
{
  "success": false,
  "message": "Descrição do erro",
  "error": "Detalhes técnicos"
}
```

---

## 🚀 Próximos passos para aprender

1. ✅ **Rodar o servidor localmente**
2. ✅ **Testar os endpoints no Postman**
3. ✅ **Estudar cada arquivo e entender o fluxo**
4. ✅ **Modificar o código e ver o que muda**
5. ✅ **Criar endpoints novos** (ex: filtrar tarefas por prioridade)
6. ✅ **Fazer deploy online** (Heroku, Railway, Render)

---

## 📚 Recursos para aprender mais

- **Node.js docs:** https://nodejs.org/docs/
- **Express docs:** https://expressjs.com/
- **Mongoose docs:** https://mongoosejs.com/
- **JWT docs:** https://jwt.io/

---

## 💡 Dicas

- Sempre verifique se MongoDB está rodando
- Copie o token completo (sem aspas)
- Tarefas pertencem a usuários (não vê tarefas de outro usuário)
- Erro 401 = token inválido/expirado
- Erro 403 = sem permissão
- Erro 404 = não encontrado

---

**Criado com ❤️ para aprender backend development**

Autor: Maria Luiza de Souza Neta

