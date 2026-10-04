# Deploy do AgendaAI na Vercel

1. Importe o repositório Git na Vercel como projeto Next.js.
2. Deixe o Root Directory na pasta que contém `package.json`.
3. Mantenha o Build Command padrão (`npm run build`) e faça o deploy.

Não são necessárias variáveis de ambiente: o projeto usa dados locais no navegador e não se conecta a banco nem a uma API própria. O armazenamento é específico para cada origem/dispositivo; use os controles **Baixar Excel** e **Importar Excel** para transferir os dados.