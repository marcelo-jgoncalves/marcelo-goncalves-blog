📄 Relatório de Implementação: Sistema de Upload e Renderização de Imagens
Data: 03 de Fevereiro de 2026 Contexto: Admin (Vue 3/Tiptap) + Frontend (Next.js) + Infraestrutura Assíncrona (S3/Lambda).

1. Visão Geral da Arquitetura
O sistema de upload não é síncrono imediato. Devido à arquitetura de otimização de mídia, existe um delay de consistência (Eventual Consistency) entre o upload do arquivo e a disponibilidade da URL final.

Fluxo de Dados:

Upload: Cliente envia imagem (PNG/JPG) para Bucket S3 de Upload (via Signed URL).

Processamento (Backend): Trigger do S3 aciona Lambda → Converte para WebP → Salva em Bucket S3 Público.

Consumo: O Frontend/Admin tenta acessar a URL do WebP.

O Problema: O passo 2 leva de 1 a 5 segundos. Se o passo 3 ocorrer antes disso, retorna 404 Not Found.

2. Soluções Implementadas no Admin (Vue 3)
A. Estratégia de "Smart Retry" (Editor de Texto)
Para evitar que imagens quebrem dentro do editor Tiptap enquanto a infraestrutura processa o arquivo, abandonamos a tag <img> padrão.

Arquivo: src/components/tiptap/ImageNode.vue

Lógica: Componente Vue customizado que substitui a visualização do nó de imagem.

Possui estado de loading e error.

Ao receber erro (404), ativa um setTimeout de 2 segundos.

Adiciona um parâmetro ?retry=${timestamp} para forçar o navegador a ignorar o cache de "404" e tentar baixar novamente.

Repete até 10 vezes (20s) antes de falhar definitivamente.

Integração: src/components/tiptap/SmartImage.ts estende a extensão base do Tiptap para usar o VueNodeViewRenderer(ImageNode).

B. Orquestração de Upload (Pai-Filho)
O componente de Upload (UploadModal) vive no Pai (EditorView), mas o botão de acionamento vive na Toolbar do Filho (RichTextEditor).

Comunicação:

RichTextEditor emite evento @request-upload.

EditorView captura, define o contexto (uploadContext.value = 'editor') e abre o modal.

Após upload, EditorView chama método exposto do filho: editorRef.value.insertImage(url).

Arquivo Crítico: src/components/RichTextEditor.vue usa defineExpose({ insertImage }) para permitir essa injeção externa.

C. Imagem de Destaque (Sidebar)
A imagem de destaque não usa o Tiptap, então aplicamos uma versão simplificada da lógica de Retry diretamente no template.

Arquivo: src/views/EditorView.vue

Implementação:

HTML
<img 
  :src="`${url}?t=${cacheBuster}`" 
  @error="handleFeatureImageError" 
/>
A função handleFeatureImageError atualiza o cacheBuster após 2.5s, forçando o reload da imagem sem precisar de um componente complexo.

3. Soluções Implementadas no Frontend (Next.js)
Enfrentamos problemas críticos de Hydration Mismatch (Divergência entre HTML do Servidor e do Cliente).

A. Estrutura de HTML Inválida (Invalid Nesting)
O React é estrito: uma tag <p> nunca pode conter elementos de bloco (<div>, <img>, etc). O conteúdo vindo do CMS ou injeções de anúncios causavam isso.

Solução 1 (Resumo): Alteramos o container do resumo de <p> para <div> em app/post/[slug]/page.tsx.

Risco de Regressão: Não volte a usar <p> para campos de texto rico que podem conter quebras de linha.

Solução 2 (Conteúdo Principal): Adicionamos suppressHydrationWarning={true} no container principal do post (<div className="post-content">).

Motivo: Injeções de scripts de terceiros (AdSense) e correções automáticas do navegador no HTML do Tiptap tornam impossível garantir 100% de paridade Server/Client. Essa flag previne o crash.

B. Componentes Client-Only (ShareButtons)
O componente ShareButtons acessava window.location e usava ícones <i> que o FontAwesome transformava em <svg> no cliente, causando erro de hidratação.

Solução: Padrão "Mounted Check".

TypeScript
if (!mounted) return <div style={{minHeight: '40px'}} />;
Isso garante que o componente só renderize no navegador.

O uso do Placeholder com altura fixa evita CLS (Cumulative Layout Shift), protegendo o SEO.

4. Guia de Prevenção de Regressão (⚠️ IMPORTANTE)
Para a IA ou Desenvolvedor que assumir daqui, NÃO FAÇA O SEGUINTE:

NÃO Remova o ImageNode.vue: Se você voltar a usar a extensão padrão Image do Tiptap, o editor vai mostrar imagens quebradas (404) imediatamente após o upload devido ao delay do Lambda. A lógica de "Retry" é obrigatória.

NÃO Use <p> para renderizar HTML Rico: No Frontend Next.js, sempre use <div> ou <article> para renderizar conteúdo que vem do banco de dados (dangerouslySetInnerHTML). O navegador fecha <p> automaticamente ao ver um bloco, quebrando o React.

NÃO Remova suppressHydrationWarning: No arquivo page.tsx, essa flag é a única barreira impedindo a tela branca de erro (Red Screen of Death) caso um anúncio ou plugin modifique o DOM.

Cuidado com defineExpose: No Vue 3 (<script setup>), métodos internos do componente são privados por padrão. Se precisar controlar o editor externamente, mantenha o defineExpose({ insertImage }) no RichTextEditor.vue.

5. Próximos Passos Sugeridos
Monitoramento de Performance: Observar se o setTimeout de 2s/2.5s está alinhado com a média real de tempo da AWS Lambda. Se a fila aumentar, aumentar o tempo de retry.

Skeleton Loading: Melhorar a UX do ImageNode.vue substituindo a mensagem "Processando WebP..." por um skeleton loader (caixa cinza pulsante) para parecer mais nativo.

Status Final: ✅ Upload Funcional, Editor Resiliente a Delays, Frontend Estável sem erros de Hidratação.