# Deploy do AgendaAI na Vercel

## Requisitos

- Um banco MySQL gerenciado, acessível publicamente pela Vercel. O schema Prisma deste projeto usa MySQL; PostgreSQL não é compatível.
- Node.js e npm compatíveis com a versão do Next.js definida no `package.json`.

## Variáveis de ambiente

Configure em **Vercel > Project > Settings > Environment Variables** para Production e, se necessário, Preview:

- `DATABASE_URL`: URL de conexão MySQL fornecida pelo provedor. Codifique caracteres especiais na senha conforme o formato URL.
- `AUTH_SECRET`: segredo aleatório forte, diferente do segredo local. Pode ser gerado com `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`.
- `NEXT_PUBLIC_APP_URL`: opcional; atualmente não é consumida pelo código. Se for usada futuramente, configure com a URL pública do deployment.

Não versione `.env` nem copie credenciais para arquivos do projeto. O `.env` local já está no `.gitignore`.

## Importar e fazer deploy

1. Envie o repositório para GitHub e importe-o na Vercel como um projeto Next.js.
2. Mantenha o Root Directory na pasta que contém `package.json`.
3. Configure as variáveis acima antes de executar as rotas que acessam o banco.
4. Use `npm run build` como Build Command. O script gera o Prisma Client e executa `next build`; a Vercel detecta o Next.js automaticamente.

## Banco e migrations

O repositório ainda não contém migrations Prisma. Para criar o schema inicial num banco vazio, configure temporariamente `DATABASE_URL` para o banco de destino numa máquina confiável e execute:

```bash
npx prisma db push
```

Não execute `db push` nem seed automaticamente durante cada build da Vercel. Para alterações futuras, crie e versione migrations num banco de desenvolvimento com `npx prisma migrate dev --name nome_da_alteracao`; aplique-as no banco de produção com `npx prisma migrate deploy` antes de direcionar tráfego para a versão que depende delas.

O seed é apenas para demonstração e deve ser executado conscientemente, nunca como parte automática do deploy.

## Verificação após deploy

Abra `/api/health`. Uma resposta HTTP 200 com `status: "ok"` confirma que a aplicação alcançou o banco. Se retornar HTTP 503, confira `DATABASE_URL`, a permissão de acesso remoto e as regras de rede do provedor.