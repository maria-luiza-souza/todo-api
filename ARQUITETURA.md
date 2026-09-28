# Arquitetura do LeadFlow CRM

O LeadFlow segue uma arquitetura em camadas com **rotas, middleware, controllers, models e MongoDB**.

## Fluxo de uma requisição

```text
Frontend
   ↓ HTTP + Bearer JWT
Express / Routes
   ↓
Auth Middleware
   ↓ adiciona req.user.id
Controller
   ↓ aplica regras e isolamento por usuário
Mongoose Model
   ↓
MongoDB Atlas
```

## Domínios

### Autenticação
`User` + `userController` + `userRoutes`.

### Leads
`Lead` + `leadController` + `leadRoutes`. Inclui pipeline e conversão em cliente.

### Clientes
`Customer` + `customerController` + `customerRoutes`. A exclusão da interface é um arquivamento lógico (`active=false`).

### Interações
`Activity` + `activityController` + `activityRoutes`. Cada interação pertence ao usuário e pode ser relacionada a um lead ou cliente.

### Dashboard
`dashboardController` consolida indicadores com contagens e agregações do MongoDB.

## Isolamento de dados

O identificador do usuário vem exclusivamente do JWT validado. Os controllers adicionam `owner: req.user.id` às consultas e criações, evitando que um usuário consulte dados de outro.

## Conversão de lead

```text
POST /api/leads/:id/convert
        ↓
valida owner do lead
        ↓
cria Customer com sourceLead
        ↓
muda Lead.stage para "ganho"
        ↓
registra Activity de conversão
```
