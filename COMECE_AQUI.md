# 🚀 COMECE AQUI - Guia de Início Rápido

Olá Maria! Este arquivo te orienta pelos próximos passos. Siga um por um!

## ✅ Você já tem:

Toda a estrutura criada pronta para rodar!

```
todo-api/
├── src/config/database.js      ← Conexão com MongoDB
├── src/middleware/auth.js      ← Verificação de token
├── src/models/
│   ├── User.js                 ← Estrutura do usuário
│   └── Task.js                 ← Estrutura da tarefa
├── src/controllers/
│   ├── userController.js       ← Lógica de registro/login
│   └── taskController.js       ← Lógica de CRUD de tarefas
├── src/routes/
│   ├── userRoutes.js           ← Rotas de autenticação
│   └── taskRoutes.js           ← Rotas de tarefas
├── server.js                   ← Arquivo principal
├── package.json                ← Dependências
├── .env.example                ← Exemplo de variáveis
├── README.md                   ← Documentação completa
└── ARQUITETURA.md             ← Explicação de como tudo funciona
```

---

## 📋 Passo a Passo para Rodar

### PASSO 1: Instalar Node.js (se não tiver)
- Download: https://nodejs.org/ (recomendo versão LTS)
- Instale normalmente
- Abra PowerShell e verifique: `node --version` e `npm --version`

### PASSO 2: Abrir terminal na pasta do projeto
```powershell
cd C:\Users\maryc\Desktop\todo-api
```

### PASSO 3: Instalar dependências
```powershell
npm install
```

Isso vai baixar todas as bibliotecas listadas em `package.json`:
- Express (framework web)
- Mongoose (para MongoDB)
- JWT (autenticação)
- Bcrypt (criptografia)
- CORS (requisições cruzadas)

### PASSO 4: Configurar variáveis de ambiente

**Opção A: Usar MongoDB Local (mais fácil para aprender)**

1. Baixe MongoDB Community: https://www.mongodb.com/try/download/community
2. Instale normalmente
3. MongoDB rodará automaticamente
4. Copie `.env.example` para `.env`:

```powershell
Copy-Item .env.example .env
```

5. Edit o arquivo `.env`:
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/todo-api
JWT_SECRET=sua_chave_secreta_123456789_mude_isso
JWT_EXPIRES_IN=24h
```

**Opção B: Usar MongoDB Atlas (Cloud)**

1. Crie conta gratuita: https://www.mongodb.com/cloud/atlas
2. Crie um cluster (banco de dados)
3. Copie a string de conexão
4. No `.env`, cole:
```
MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/todo-api
```

### PASSO 5: Rodar o servidor

```powershell
# Modo desenvolvimento (reinicia ao mudar arquivo)
npm run dev

# Ou modo produção (roda uma vez)
npm start
```

Se funcionar, você verá:
```
✅ Servidor TODO API rodando na porta 5000
📍 Acesse: http://localhost:5000
🗄️ Banco de dados: mongodb://localhost:27017/todo-api
```

### PASSO 6: Testar a API

Abra o **Postman** ou **Insomnia** (ferramentas para testar APIs):

**1. Registrar usuário:**
```
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "Maria Luiza",
  "email": "maria@test.com",
  "password": "senha123"
}
```

**Resposta esperada:**
```json
{
  "success": true,
  "message": "Usuário registrado com sucesso!",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { ... }
}
```

⚠️ **IMPORTANTE:** Copie o `token` da resposta!

**2. Criar uma tarefa:**
```
POST http://localhost:5000/api/tasks
Content-Type: application/json
Authorization: Bearer TOKEN_QUE_COPIOU_ACIMA

{
  "title": "Estudar Node.js",
  "description": "Aprender sobre middlewares",
  "priority": "alta"
}
```

**3. Listar tarefas:**
```
GET http://localhost:5000/api/tasks
Authorization: Bearer TOKEN_QUE_COPIOU_ACIMA
```

Se tudo funcionou, parabéns! 🎉

---

## 📚 Próximas etapas de APRENDIZADO

### ETAPA 1: Entender o código (2-3 dias)

1. Leia o arquivo `README.md` (tem TUDO explicado)
2. Leia o arquivo `ARQUITETURA.md` (mostra o fluxo completo)
3. Abra cada arquivo `.js` e leia com calma os comentários
4. Tente "fechar o código" e desenhar o fluxo em papel

### ETAPA 2: Fazer modificações (2-3 dias)

1. **Adicione um novo campo ao Task:**
   - Edit `src/models/Task.js`
   - Adicione: `dueDate: { type: Date }`
   - Reinicie o servidor
   - Crie tarefa com data no Postman

2. **Crie um novo endpoint:**
   - Edit `src/routes/taskRoutes.js`
   - Adicione: `router.get('/completed', getCompletedTasks)`
   - Edit `src/controllers/taskController.js`
   - Crie função que busca apenas tarefas concluídas
   - Teste no Postman

3. **Adicione validação:**
   - Crie `src/middleware/validation.js`
   - Valide se título tem mínimo 5 caracteres
   - Use em `POST /api/tasks`

### ETAPA 3: Fazer deploy (1 dia)

1. **Subir no GitHub:**
   ```powershell
   git init
   git add .
   git commit -m "TODO API com Node.js, Express e MongoDB"
   # ... adicione repositório remoto ...
   git push
   ```

2. **Deploy grátis em uma dessas plataformas:**
   - **Railway:** https://railway.app/ (RECOMENDADO - muito fácil)
   - **Render:** https://render.com/
   - **Heroku:** https://www.heroku.com/

3. **API estará disponível online!**
   - Exemplo: `https://seu-app.railway.app/api/tasks`

---

## 🔗 Links Úteis

### Postman (testar API)
- Download: https://www.postman.com/downloads/
- Tutorial: https://www.postman.com/tutorials/

### MongoDB (banco de dados)
- Download Local: https://www.mongodb.com/try/download/community
- Cloud (Atlas): https://www.mongodb.com/cloud/atlas
- Compass (visualizar dados): https://www.mongodb.com/products/compass

### Deploy
- Railway: https://railway.app/
- Documentação: https://docs.railway.app/

### Documentação
- Node.js: https://nodejs.org/
- Express: https://expressjs.com/
- Mongoose: https://mongoosejs.com/
- JWT: https://jwt.io/

---

## ❓ Dúvidas Comuns

**P: Preciso instalar MongoDB?**
R: Sim, se quiser rodar localmente. Ou use MongoDB Atlas (cloud).

**P: Como uso o token?**
R: Copie da resposta do login/register e coloque em: `Authorization: Bearer TOKEN`

**P: Posso modificar o código?**
R: SIM! Recomendo! Aprender é modificando.

**P: Como debugar erros?**
R: Abra DevTools (F12), vá em Console, estude a mensagem de erro.

**P: Como adicionar novo campo?**
R: Edit o Model (schema), depois use no Controller.

---

## 🎯 Checklist Final

- [ ] Node.js instalado (`node --version`)
- [ ] npm instalado (`npm --version`)
- [ ] Pasta do projeto aberta no terminal
- [ ] `npm install` executado com sucesso
- [ ] `.env` criado com variáveis
- [ ] MongoDB rodando (local ou Atlas)
- [ ] `npm run dev` executado com sucesso
- [ ] Servidor respondendo em http://localhost:5000
- [ ] Conseguiu registrar usuário no Postman
- [ ] Conseguiu criar tarefa no Postman
- [ ] Conseguiu listar tarefas no Postman

---

## 🚀 Quando tiver pronto:

1. **Adicione à seu PORTFÓLIO** (já temos a pasta `portfólio.backend`)
2. **Suba no GitHub** (importante! Recrutadores querem ver código)
3. **Deploy online** (Railway, Render, etc.)
4. **Compartilhe no LinkedIn** com a URL do GitHub

---

**Dúvidas? Volte a ler os arquivos README.md e ARQUITETURA.md!**

Eles têm TUDO explicado! 📚

Bom aprendizado! 🎓

