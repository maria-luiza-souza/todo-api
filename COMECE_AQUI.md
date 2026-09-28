# Comece aqui — LeadFlow CRM

## 1. Instale as dependências

```bash
npm install
```

## 2. Configure o ambiente

Copie `.env.example` para `.env` e defina:

```env
PORT=3001
MONGODB_URI=sua_connection_string
JWT_SECRET=sua_chave_secreta
JWT_EXPIRES_IN=24h
```

## 3. Execute a API

```bash
npm start
```

A API local usa `http://localhost:3001`.

## 4. Teste a autenticação

```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "Maria",
  "email": "maria@example.com",
  "password": "uma-senha-segura"
}
```

Guarde o token retornado e envie-o nas rotas protegidas:

```http
Authorization: Bearer SEU_TOKEN
```

## 5. Crie um lead

```http
POST /api/leads
Authorization: Bearer SEU_TOKEN
Content-Type: application/json

{
  "name": "Cliente potencial",
  "company": "Empresa Exemplo",
  "source": "indicacao",
  "stage": "novo",
  "estimatedValue": 3500
}
```

## 6. Explore o fluxo

1. Cadastre leads.
2. Arraste os cards no pipeline.
3. Registre interações.
4. Converta um lead em cliente.
5. Acompanhe os indicadores no dashboard.
