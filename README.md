# AgendaAI Next — Vercel Ready

Migração do AgendaAI Django para **Next.js + TypeScript + Prisma + MySQL**, pensada para deploy simples na Vercel.

## Stack

- Next.js
- TypeScript
- React
- Prisma ORM
- MySQL
- API Routes / Route Handlers
- Cookie de sessão HTTP-only
- Vercel

## 1. Instalação

```bash
npm install
```

Copie `.env.example` para `.env` e configure:

```env
DATABASE_URL="postgresql://..."
NEXT_PUBLIC_APP_URL="http://localhost:3000"
AUTH_SECRET="uma-chave-longa-e-aleatoria"
```

## 2. Banco

```bash
npx prisma generate
npx prisma db push
npm run db:seed
```

## 3. Executar

```bash
npm run dev
```

Abra `http://localhost:3000`.

## Credenciais de demonstração

Administrador:

```text
admin@agendaai.local
Admin@12345
```

Clientes:

```text
cliente1@agendaai.local
...
cliente12@agendaai.local
Senha: Demo@12345
```

Profissionais:

```text
prof1@agendaai.local
...
prof5@agendaai.local
Senha: Demo@12345
```

## Deploy na Vercel

1. Envie este projeto para um repositório GitHub.
2. Crie um banco MySQL em um provedor com plano gratuito compatível, como Neon ou Supabase.
3. No projeto da Vercel, importe o repositório.
4. Configure `DATABASE_URL`, `AUTH_SECRET` e `NEXT_PUBLIC_APP_URL`.
5. Faça o deploy.
6. Depois que o banco estiver acessível, execute `npx prisma db push` e `npm run db:seed` em ambiente local apontando temporariamente para o banco, ou use um mecanismo de migration/seed apropriado.

### Variáveis

```env
DATABASE_URL=...
AUTH_SECRET=...
NEXT_PUBLIC_APP_URL=https://seu-projeto.vercel.app
```

## Observação importante

O projeto mantém a lógica central do AgendaAI original: usuários, clientes, profissionais, serviços, disponibilidade, agendamentos, status, preço no momento do agendamento e bloqueio de conflitos.

A camada visual e as rotas administrativas podem ser expandidas conforme a versão Django original. Esta base já está organizada para crescer sem precisar voltar ao servidor Django.

## API

- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/customers`
- `POST /api/customers`
- `GET /api/professionals`
- `GET /api/services`
- `GET /api/appointments`
- `POST /api/appointments`


## MySQL

Exemplo para MySQL local:

```env
DATABASE_URL="mysql://root:SUA_SENHA@localhost:3306/agendaai"
```

Crie o banco antes de executar o Prisma:

```sql
CREATE DATABASE agendaai CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Depois:

```bash
npx prisma generate
npx prisma db push
npm run db:seed
```
