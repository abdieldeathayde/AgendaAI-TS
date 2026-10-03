# Deploy do AgendaAI no Render

## Requisitos

- Um repositório Git conectado à sua conta Render.
- Um plano Render compatível com o banco PostgreSQL definido no Blueprint. O banco usa o plano `0.1c-256mb` e pode gerar cobrança.

## Criar o serviço

O arquivo `render.yaml` declara um Web Service Node e um banco PostgreSQL no Render. O serviço recebe a connection string privada do banco e usa `/api/health` como health check.

1. No Dashboard do Render, escolha **New > Blueprint** e conecte o repositório.
2. Revise os recursos e custos definidos pelo Blueprint e aplique-o. O Render provisiona o PostgreSQL, gera `AUTH_SECRET`, instala dependências e compila o Next.js antes de iniciar `npm start`.
3. Aguarde o serviço ficar `Live` e teste `https://<servico>.onrender.com/api/health`.

O Blueprint passa a URL interna do PostgreSQL para o serviço. Não substitua por `localhost`.

## Inicializar o banco

Este repositório ainda não possui migrations Prisma. Antes de usar o app, copie a External Database URL do PostgreSQL no Render para o `.env` local (não versione esse arquivo) e execute uma vez:

```bash
npx prisma db push
```

O seed é opcional e apenas para uma base de demonstração vazia. Ele apaga os registros atuais antes de recriá-los, então não o execute em um banco com dados que queira preservar:

```bash
npm run db:seed
```

Não coloque `db push` ou seed no build/start command. Para alterações futuras do schema, crie e versione migrations em desenvolvimento e aplique-as ao banco de produção antes do deploy que depende delas:

```bash
npx prisma migrate dev --name nome_da_alteracao
npx prisma migrate deploy
```

## Variáveis e operação

- `DATABASE_URL`: preenchida pelo Blueprint com a connection string interna do PostgreSQL.
- `AUTH_SECRET`: gerada pelo Blueprint. Se criar o serviço manualmente em vez do Blueprint, defina um valor aleatório forte no Dashboard.
- `NEXT_PUBLIC_APP_URL`: não é usada pelo código atual e não é necessária.

Se o serviço falhar no health check, verifique os Runtime Logs e confirme que o banco está ativo e `DATABASE_URL` está configurada. Planos gratuitos do serviço web podem suspender a aplicação após inatividade, aumentando o tempo da primeira resposta.

## Banco MySQL existente

Trocar o provider Prisma para PostgreSQL não transfere dados de um banco MySQL existente. Faça backup e migre os dados separadamente antes de apontar produção para o novo banco; não execute `db push` ou seed contra uma base que contenha dados a preservar.