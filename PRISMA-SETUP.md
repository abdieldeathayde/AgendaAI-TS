# Correção do Prisma Client

O AgendaAI usa Prisma. O erro:

`Cannot find module '.prisma/client/default'`

significa que o Prisma Client ainda não foi gerado na instalação local.

## Primeira instalação

No terminal, dentro da pasta que contém `package.json`:

```powershell
npm install
npx prisma generate
```

Depois, se você ainda não configurou o banco:

```powershell
npx prisma db push
npm run db:seed
```

E então:

```powershell
npm run dev
```

## Importante

O `package.json` desta versão já possui:

```json
"postinstall": "prisma generate"
```

Portanto, instalações futuras com `npm install` já devem gerar automaticamente o Prisma Client.

O script de produção também executa:

```text
prisma generate → next build
```

Antes de usar `db push` ou `db:seed`, configure `DATABASE_URL` no `.env`.
