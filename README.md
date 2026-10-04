# AgendaAI

Aplicação frontend-only de agenda e gestão, construída com **Next.js, React, TypeScript e Tailwind CSS**. Não há API própria, banco de dados ou autenticação de servidor.

## Telas

- Dashboard com indicadores e próximos atendimentos.
- Agenda com busca, filtro por status e cadastro de horários; verifica conflitos do profissional.
- Clientes com busca e formulário de cadastro.
- Profissionais e serviços com formulários de cadastro.
- Login local de demonstração.

Os dados iniciais são fixtures tipados em `lib/demo-data.ts`. Cadastros e alterações são salvos automaticamente no `localStorage` do navegador atual.

Use **Baixar Excel** para exportar um arquivo `.xlsx` com as abas `Clientes`, `Profissionais`, `Serviços` e `Agenda`. **Importar Excel** restaura esses dados; requer as quatro abas e os cabeçalhos do arquivo exportado pelo app. A importação substitui todos os dados locais após confirmação.

O armazenamento é isolado por navegador e endereço do site: não sincroniza entre usuários ou dispositivos e não é enviado ao Render/Vercel. Para transferir dados, baixe a planilha e importe-a no outro navegador. O login é apenas uma demonstração no cliente, não use para proteger dados reais.

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

- **Produção na Vercel:** [Abrir AgendaAI](https://agenda-ai-ts.vercel.app/dashboard). A raiz do domínio redireciona para o dashboard.
- **Render alternativo:** use o Blueprint `render.yaml` ou crie um Web Service Node com `npm ci && npm run build` e `npm start`.

Não são necessárias variáveis de ambiente. O frontend inicia com os dados de demonstração incluídos. O `localStorage` da produção na Vercel é separado do `localhost`; use os controles Excel para transferir registros entre eles.
