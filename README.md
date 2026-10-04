# AgendaAI

Aplicação frontend-only de agenda e gestão, construída com **Next.js, React, TypeScript e Tailwind CSS**. Não há API própria, banco de dados ou autenticação de servidor.

## Telas

- Dashboard com indicadores e próximos atendimentos.
- Agenda com busca e filtro por status.
- Clientes com busca por nome, e-mail ou telefone.
- Catálogo de profissionais e serviços.
- Login local de demonstração.

Os dados iniciais são fixtures tipados em `lib/demo-data.ts`. Novos registros são salvos automaticamente no `localStorage` deste navegador. Use **Baixar Excel** para guardar uma cópia `.xlsx` ou **Importar Excel** para restaurá-la em outro navegador/dispositivo; a importação substitui os dados locais após confirmação. O `localStorage` não sincroniza entre dispositivos. A sessão de demonstração também fica nele e não é autenticação segura.

## Desenvolvimento

Requisito: Node.js 20.9 ou superior.

```bash
npm install
npm run dev
```

Abra `http://localhost:3000`. Acesso de demonstração: `admin@agendaai.local` / `Admin@12345`.

```bash
npm run typecheck
npm run build
npm start
```

## Deploy

- **Vercel:** importe o repositório; a plataforma detecta Next.js automaticamente e executa o build.
- **Render:** use o Blueprint `render.yaml` ou crie um Web Service Node com `npm ci && npm run build` e `npm start`.

Não são necessárias variáveis de ambiente. O frontend funciona com os dados de demonstração incluídos.
