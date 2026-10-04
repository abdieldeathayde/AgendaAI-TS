# Deploy do AgendaAI no Render

O Blueprint `render.yaml` publica o frontend como um Web Service Node, sem banco de dados ou variáveis secretas.

1. No Dashboard do Render, escolha **New > Blueprint** e conecte o repositório.
2. Revise o Web Service e aplique o Blueprint.
3. Quando o serviço estiver `Live`, abra a URL `onrender.com`.

Os comandos configurados são `npm ci && npm run build` e `npm start`. Os registros ficam no `localStorage` de cada navegador; não são enviados ao Render. Para transferi-los para outro navegador ou domínio, baixe o `.xlsx` e importe-o no novo endereço.

Para criar um serviço manualmente, selecione Node, use a raiz do repositório, Build Command `npm ci && npm run build` e Start Command `npm start`.