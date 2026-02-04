Relatório de Engenharia: Correção de Listas e Injeção de Anúncios
Data: 03 de Fevereiro de 2026 Status: ✅ Resolvido / Implantado Arquivos Impactados: frontend/app/globals.css, frontend/lib/postUtils.tsx

1. Contexto do Problema
O blog apresentava erros de renderização em listas dentro das postagens:

Listas Ordenadas (<ol>): Não exibiam números, mas sim "bolinhas amarelas" (estilo das listas desordenadas).

Listas Desordenadas (<ul>): Apresentavam recuos inconsistentes e quebras de layout visual.

Injeção de Anúncios: O banner de publicidade aparecia, ocasionalmente, no meio de uma lista, quebrando a formatação dos itens subsequentes.

2. Diagnóstico e Causa Raiz (Root Cause Analysis)
A. O Conflito Visual (CSS)
Problema: Regras de CSS com especificidade genérica excessiva e reset agressivo.

Detalhe: O seletor .post-content li aplicava um pseudo-elemento ::before (a bolinha amarela) e display: block para todos os itens de lista. Isso sobrescrevia o comportamento nativo das listas ordenadas (list-style: decimal), ocultando os números e forçando a bolinha em ambos os tipos.

B. O Conflito Lógico (Algoritmo de Injeção)
Problema: A lógica de inserção de anúncios era "cega" à estrutura hierárquica do HTML.

Detalhe: O algoritmo no postUtils.tsx dividia o conteúdo HTML baseando-se apenas na string </p>. Como o editor Tiptap envolve o conteúdo dos itens de lista em parágrafos (<li><p>Texto</p></li>), a lógica inseria a <div> do anúncio logo após esse parágrafo interno.

Resultado: O navegador recebia uma estrutura inválida (<ul><li>...<div id="ad"></div></li></ul>), forçava o fechamento prematuro da lista e quebrava o layout visual dos itens seguintes.

3. Solução Implementada
Correção Visual (globals.css)
Foi realizada uma refatoração na Seção 14 (Listas) do CSS global:

Isolamento de Escopo: O estilo de "bolinha amarela" foi restrito estritamente a .post-content ul li.

Restauração de Padrões: A .post-content ol teve seu estilo restaurado para decimal e o display: block foi removido dos itens de lista, permitindo o alinhamento nativo correto.

Blindagem: Adicionada regra content: none !important para ol li::before para garantir que estilos globais não vazem para listas numeradas.

Correção Lógica (postUtils.tsx)
Implementação de um algoritmo de Injeção Consciente de Contexto (Context-Aware Injection):

Lookahead (Espiada): Antes de injetar um anúncio após um parágrafo, o código verifica o início do próximo fragmento de texto (nextPart).

Guardrails de Segurança: Se o próximo fragmento começar com tags de fechamento de container (</li>, </blockquote>, </div>), o sistema identifica que está dentro de uma estrutura complexa (lista, citação ou callout).

Ação: O sistema pula a injeção naquele ponto e aguarda o próximo parágrafo seguro (nível raiz) para inserir o anúncio, preservando a integridade do DOM.

4. Decisões Arquiteturais e Limitações (Callouts)
Durante a correção, avaliamos a possibilidade de permitir blocos (parágrafos múltiplos/listas) dentro do componente Callout (Callout.ts).

Decisão: Manter o Callout restrito a conteúdo inline (texto, negrito, links).

Justificativa: Permitir blocos dentro do Callout criaria o mesmo cenário de risco das listas: o algoritmo de injeção poderia inserir um anúncio no meio de uma caixa de destaque ("Dica" ou "Atenção"), quebrando o componente visualmente. Como a lógica atual protege apenas o final dos containers, manter o conteúdo do Callout simples é a forma mais segura de evitar regressões sem reescrever todo o parser de HTML.