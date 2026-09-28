# Diagrama do LeadFlow CRM

```text
┌──────────────────────┐
│      FRONTEND        │
│ Dashboard / Pipeline │
│ Leads / Clientes     │
│ Interações           │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│   EXPRESS API        │
│ /auth                │
│ /dashboard           │
│ /leads               │
│ /customers           │
│ /activities          │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│  JWT AUTH MIDDLEWARE │
│ req.user.id          │
└──────────┬───────────┘
           │
     ┌─────┼──────────────┐
     ▼     ▼              ▼
┌────────┐ ┌──────────┐ ┌──────────┐
│ Leads  │ │Customers │ │Activities│
└────┬───┘ └────┬─────┘ └────┬─────┘
     └───────────┼────────────┘
                 ▼
        ┌────────────────┐
        │ MongoDB Atlas  │
        │ users          │
        │ leads          │
        │ customers      │
        │ activities     │
        └────────────────┘
```

## Pipeline

```text
Novo
  ↓
Contato
  ↓
Qualificado
  ↓
Proposta
  ↓
Negociação
  ├──→ Ganho → Cliente
  └──→ Perdido
```
