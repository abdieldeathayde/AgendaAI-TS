# AgendaAI Next

Migração do AgendaAI Django para **Next.js + TypeScript + Prisma + PostgreSQL**, preparada para deploy na Vercel ou no Render.

## Stack

- Next.js
- TypeScript
- React
- Prisma ORM
- PostgreSQL
- API Routes / Route Handlers
- Cookie de sessão HTTP-only
- Vercel

## 1. Instalação

```bash
npm install
```

Copie `.env.example` para `.env` e configure as credenciais de um banco PostgreSQL. Em produção, configure também um `AUTH_SECRET` aleatório e forte na plataforma de deploy:

```env
DATABASE_URL="postgresql://USUARIO:SENHA@HOST:5432/agendaai?schema=public"
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
2. Crie um banco PostgreSQL gerenciado acessível pela aplicação.
3. No projeto da Vercel, importe o repositório.
4. Configure `DATABASE_URL` e `AUTH_SECRET`. `NEXT_PUBLIC_APP_URL` é opcional e não é consumida pelo código atual.
5. Faça o deploy.
6. Inicialize o schema do banco conforme [VERCEL.md](VERCEL.md). Não execute seed automaticamente no deploy.

## Deploy no Render

Use o Blueprint `render.yaml` ou siga o guia [RENDER.md](RENDER.md). O Blueprint cria um PostgreSQL no Render e configura a conexão privada para o serviço.

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


## PostgreSQL local

Exemplo de URL para PostgreSQL local:

```env
DATABASE_URL="postgresql://postgres:SUA_SENHA@localhost:5432/agendaai?schema=public"
```

Crie o banco `agendaai` no PostgreSQL antes de executar o Prisma. Depois:

```sql
CREATE DATABASE agendaai;
```

Depois:

```bash
npx prisma generate
npx prisma db push
npm run db:seed
```
