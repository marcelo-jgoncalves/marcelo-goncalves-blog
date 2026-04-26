📐 Design System: Diretrizes de Ritmo Vertical
O Ritmo Vertical é a espinha dorsal da nossa Experiência de Usuário (UX). Ele garante que o leitor navegue pelo conteúdo com o mínimo de carga cognitiva, criando previsibilidade visual e fluidez na rolagem da tela.

1. A Regra de Ouro (A Escala de 8px)
Todos os espaçamentos (margens, paddings e gaps) devem ser múltiplos de 8.

✅ Permitido: 8px, 16px, 24px, 32px, 40px, 48px, 64px.

❌ Proibido: 10px, 15px, 25px, 50px.

Por quê? O sistema de 8px escala perfeitamente em telas Retina/Alta resolução sem quebrar o "pixel-perfect" e é o padrão das maiores empresas de tecnologia do mundo.

2. Micro-Ritmo (Conteúdo Denso e Tipografia)
O Micro-ritmo lida com a leitura e o espaçamento interno de componentes. O objetivo é manter os elementos relacionados visualmente "abraçados".

Espaçamento entre Parágrafos (p): * Mobile: 16px (1rem).

Desktop: 20px (1.25rem).

Line-height (Entrelinhas): 1.6 ou 1.7 para blocos de texto longo.

Espaço entre Título e Texto Interno: 16px (1rem).

3. Macro-Ritmo (Blocos e Seções Estruturais)
O Macro-ritmo lida com a separação entre assuntos ou componentes diferentes (ex: Fim do texto -> CTA de Serviço -> Caixa de Autor). O objetivo é dar ao cérebro do leitor uma pausa visual indicando "mudança de contexto".

Espaçamento entre Componentes Independentes:

Mobile: 32px (2rem).

Desktop: 48px (3rem) ou 64px (4rem).

Respiro das Bordas da Tela (Padding lateral geral): 16px ou 20px no mobile.

4. Engenharia CSS: Práticas Obrigatórias
Para evitar a "Guerra de Margens" (Margin Collapse) e espaços somados acidentalmente (ex: 40px + 40px = 80px):

Prefira gap a margin: Sempre que agrupar componentes estruturais (como no Rodapé ou na Sidebar), use um container com display: flex ou display: grid e aplique a propriedade gap. O gap é inteligente e não dobra espaços.

Margens Unidirecionais: Se não puder usar gap, empurre os elementos sempre para baixo (margin-bottom). Evite aplicar margin-top em um elemento e margin-bottom no elemento de cima.

Componentes "Agnósticos": Um componente React (ex: <AuthorBox />, <Newsletter />) NÃO deve ter margens externas grandes definidas dentro de si próprio. Ele não sabe onde será inserido. O espaçamento deve ser ditado pelo elemento "Pai" (o container onde ele é renderizado).