# Deploy do AgendaAI na Vercel

## Banco

Use Use um MySQL gerenciado acessível pela internet. Não use `localhost` para o banco quando a aplicação estiver na Vercel.

## Vercel

Importe o repositório GitHub e configure:

- `DATABASE_URL`
- `AUTH_SECRET`
- `NEXT_PUBLIC_APP_URL`

Build:

```bash
npm run build
```

Start:

```bash
npm start
```

A Vercel normalmente detecta o Next.js automaticamente.

## Prisma

O script `build` executa:

```bash
prisma generate && next build
```

Para produção com migrations, prefira:

```bash
npx prisma migrate deploy
```

e mantenha as migrations versionadas no Git.

## Seed

Não execute seed automaticamente em todo deploy. Faça isso uma vez no banco de demonstração.
