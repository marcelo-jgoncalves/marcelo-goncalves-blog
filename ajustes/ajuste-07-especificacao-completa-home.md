# Especificação definitiva — Ajuste completo da Home

## 0. Finalidade e precedência deste documento

Este documento é a especificação definitiva para a revisão da Home da plataforma de consultoria.

Ele deve ser suficiente para que uma IA engenheira implemente todas as alterações sem precisar:

- interpretar a intenção comercial;
- escolher textos alternativos;
- decidir a ordem dos blocos;
- criar novas seções por conta própria;
- redefinir a identidade visual;
- alterar comportamentos não especificados;
- consultar documentos anteriores para resolver conflitos.

Em caso de divergência entre este arquivo e instruções anteriores referentes à Home, **este documento prevalece**.

O documento anterior sobre o hero pode ser considerado incorporado e substituído por esta especificação.

---

# 1. Escopo

## 1.1. Incluído

Aplicar as alterações na página renderizada na rota `/`, incluindo:

- CTA do cabeçalho global exibido na Home;
- hero;
- seção de serviços;
- seção “Como trabalhamos”;
- seção de resultados;
- seção de conteúdo técnico;
- CTA final;
- ajustes mínimos de coerência no rodapé global;
- responsividade dos blocos alterados;
- acessibilidade;
- comportamento dos links;
- regras para conteúdo dinâmico;
- validação final.

## 1.2. Não incluído

Não realizar nesta tarefa:

- redesign completo do cabeçalho;
- redesign completo do rodapé;
- alteração da paleta;
- troca das fontes;
- criação de uma nova identidade visual;
- revisão integral das páginas individuais de serviços;
- revisão integral da página de contato;
- revisão das páginas legais;
- migração definitiva das rotas dos serviços;
- implantação de um novo provedor de analytics;
- criação de estudos de caso completos;
- criação de novos artigos;
- alteração da arquitetura geral do projeto;
- instalação de bibliotecas de interface ou animação.

## 1.3. Princípio de implementação

Preservar:

- componentes existentes;
- grid;
- identidade visual;
- tokens;
- bordas;
- raios;
- sombras;
- padrões de card;
- animações existentes;
- largura dos containers;
- linguagem visual;
- estrutura geral da página.

Alterar estrutura somente nos pontos explicitamente descritos neste documento.

Não reinterpretar a página nem criar uma nova Home do zero.

---

# 2. Fonte atual analisada

Página analisada:

`https://dsns2wusdrj9z.cloudfront.net/`

Data da análise:

`27 de julho de 2026`

Estrutura atual identificada:

1. Cabeçalho;
2. Hero;
3. Serviços;
4. Como trabalhamos;
5. Resultados;
6. Conteúdo técnico;
7. CTA final;
8. Rodapé.

---

# 3. Decisão estrutural definitiva

## 3.1. Ordem final dos blocos

A ordem principal atual será mantida:

1. Cabeçalho;
2. Hero;
3. Serviços;
4. Como trabalhamos;
5. Resultados;
6. Conteúdo técnico;
7. CTA final;
8. Rodapé.

## 3.2. Motivo

Não existe necessidade de criar uma nova seção entre o hero e os serviços.

A identificação dos problemas será incorporada:

- ao subtítulo do hero;
- ao texto introdutório da seção de serviços;
- às descrições dos cards;
- ao método;
- aos resultados.

A estrutura existente já oferece uma sequência comercial válida:

> proposta → capacidades → método → prova → conhecimento → conversão.

## 3.3. Mudanças estruturais internas autorizadas

Realizar somente estas alterações estruturais:

1. Adicionar um CTA secundário no hero.
2. Adicionar microcopy abaixo dos CTAs do hero.
3. Reordenar os quatro cards de serviços.
4. Atualizar os rótulos internos dos cards.
5. Reescrever os cinco passos do método.
6. Reordenar os quatro casos da seção de resultados.
7. Adicionar uma nota discreta abaixo dos resultados.
8. Adicionar um parágrafo introdutório à seção de conteúdo técnico.
9. Remover os quatro links de serviços de dentro do card do CTA final.
10. Manter apenas uma ação principal no card do CTA final.
11. Atualizar minimamente o CTA global do cabeçalho.
12. Atualizar minimamente os textos institucionais do rodapé.

Não criar outras seções.

---

# 4. Regras gerais de texto

## 4.1. Posicionamento

Toda a Home deverá obedecer ao posicionamento:

> Engenharia e tecnologia para tornar operações mais eficientes, integradas e preparadas para crescer.

## 4.2. Público

A comunicação principal deverá falar com:

> pequenas e médias empresas em crescimento que enfrentam processos manuais, sistemas desconectados, limitações de software ou desafios de infraestrutura.

## 4.3. Hierarquia narrativa

Em cada bloco, respeitar esta ordem:

1. problema;
2. impacto;
3. resultado;
4. solução;
5. tecnologia.

Não começar seções com listas de ferramentas.

## 4.4. Vocabulário preferencial

Preferir:

- operação;
- processo;
- integração;
- eficiência;
- confiabilidade;
- evolução;
- segurança;
- rastreabilidade;
- redução de retrabalho;
- modernização;
- implementação incremental;
- resultado mensurável;
- decisão técnica;
- plataforma;
- sistema;
- arquitetura;
- acompanhamento.

## 4.5. Vocabulário a remover da Home

Não utilizar nos textos novos:

- “destravar crescimento”;
- “destravar valor”;
- “soluções 360°”;
- “tecnologia de ponta”;
- “revolucionar”;
- “disruptivo”;
- “cobrir toda a operação”;
- “qualquer problema”;
- “escalabilidade ilimitada”;
- “zero falhas”;
- “diagnóstico gratuito”;
- “consultoria gratuita”;
- “resposta em até 2h”;
- “arquitetura Serverless” como solução obrigatória;
- “mínima intervenção humana”;
- “decisão autônoma” sem menção a controle;
- “nossa equipe” quando o texto implicar equipe fixa;
- “nosso time multidisciplinar”.

## 4.6. Consistência terminológica

Usar exatamente estes nomes comerciais:

1. Automação e Integração de Processos;
2. Inteligência Artificial Aplicada;
3. Sistemas e Plataformas Digitais;
4. Cloud, DevOps e Confiabilidade.

Não alternar com os títulos antigos na Home.

Os títulos antigos poderão permanecer temporariamente nas páginas internas até a revisão específica dessas páginas.

---

# 5. Cabeçalho global — ajuste mínimo

## 5.1. Preservar

Manter:

- layout;
- logo;
- navegação;
- menu mobile;
- comportamento sticky, se existente;
- animações;
- tipografia;
- cores;
- espaçamentos;
- dropdown de serviços, se existente.

## 5.2. Alterar o CTA

Substituir em desktop e mobile:

```text
Solicitar diagnóstico
```

por:

```text
Apresentar um desafio
```

Destino:

```text
/contato
```

## 5.3. Link “Serviços”

Quando a página central `/servicos` estiver implementada, o item “Serviços” deverá oferecer acesso a ela.

Caso exista dropdown:

- manter o dropdown;
- inserir “Visão geral dos serviços” como primeiro item;
- destino: `/servicos`;
- preservar os links individuais abaixo dele.

Caso o item seja apenas um link:

- definir o destino como `/servicos`.

Não apontar “Serviços” para `/`.

## 5.4. Estado atual da rota

Se `/servicos` ainda não estiver disponível no momento desta implementação:

- não criar redirecionamento para `/`;
- manter temporariamente o comportamento atual do menu;
- registrar a dependência como pendência;
- não bloquear a publicação da Home no ambiente de desenvolvimento;
- corrigir obrigatoriamente antes da publicação em produção.

---

# 6. Hero

## 6.1. Estrutura final

Manter a estrutura visual existente do hero.

Ordem obrigatória dos elementos:

1. eyebrow;
2. H1;
3. subtítulo;
4. grupo de dois CTAs;
5. microcopy.

Não inserir cards, selos adicionais, métricas ou listas de tecnologias dentro do hero.

## 6.2. Texto final

### Eyebrow

```text
Consultoria boutique de tecnologia
```

### H1

```text
Engenharia para uma operação mais eficiente, integrada e preparada para crescer.
```

### Subtítulo

```text
Ajudamos pequenas e médias empresas em crescimento a eliminar gargalos, automatizar processos, conectar sistemas e modernizar as plataformas que sustentam o negócio.
```

### CTA principal

```text
Apresentar um desafio
```

Destino:

```text
/contato
```

### CTA secundário

```text
Conhecer os serviços
```

Destino:

```text
#servicos
```

O CTA secundário deverá executar rolagem para a seção de serviços da própria Home.

Não apontar o CTA secundário para uma página externa.

### Microcopy

```text
Conversa inicial sem compromisso · Retorno em até um dia útil
```

## 6.3. Hierarquia HTML

Usar:

- eyebrow: elemento de texto não heading;
- headline: único `<h1>` da página;
- subtítulo: `<p>`;
- CTA principal e secundário: links semânticos;
- microcopy: `<p>` ou `<small>`.

A Home não pode conter outro `<h1>`.

## 6.4. Regras visuais

- Preservar o alinhamento atual.
- Preservar a composição visual atual.
- Não adicionar fotografia genérica, ilustração de nuvem ou imagem de banco.
- Não adicionar gradientes novos.
- Não alterar a paleta.
- Manter a headline como elemento dominante.
- Limitar a largura textual da headline para evitar linha excessivamente longa.
- Limitar o subtítulo a uma largura confortável de leitura.
- Exibir os CTAs lado a lado em desktop quando houver espaço.
- Empilhar os CTAs em telas estreitas.
- CTA principal deve manter o estilo primário atual.
- CTA secundário deve utilizar o estilo secundário já existente.
- A microcopy deve ter contraste suficiente, mas menor destaque que os botões.
- Não transformar a microcopy em badge ou terceiro botão.
- Não aumentar artificialmente a altura do hero.
- Em notebooks, o início da próxima seção deve permanecer perceptível sem exigir grande rolagem.

## 6.5. Remover

Remover do hero:

```text
Consultoria em Tecnologia
```

Substituir pelo novo eyebrow.

Remover:

```text
Tecnologia que sustenta a operação, aumenta eficiência e destrava crescimento.
```

Substituir pelo novo H1.

Remover:

```text
Desenvolvimento, IA, Automação, Cloud & DevOps aplicados aos problemas reais da sua empresa.
```

Substituir pelo novo subtítulo.

Remover o CTA:

```text
Solicitar diagnóstico
```

---

# 7. Seção de serviços

## 7.1. Identificação da seção

Adicionar ou preservar:

```html
id="servicos"
```

Aplicar `scroll-margin-top` suficiente para que a seção não fique encoberta pelo cabeçalho sticky.

Usar o valor já adotado pelo projeto para âncoras. Se não houver padrão, usar um valor correspondente à altura do cabeçalho mais uma margem de segurança.

## 7.2. Estrutura visual

Preservar:

- o bloco existente;
- o grid existente;
- o estilo dos cards;
- os ícones existentes, desde que ainda sejam semanticamente adequados;
- os efeitos de hover;
- os links “Saiba mais” ou seu componente equivalente.

Não criar uma seção adicional para dividir as duas frentes.

A distinção entre as frentes será comunicada pela ordem e pelos rótulos dos cards.

## 7.3. Texto da abertura

### Eyebrow

```text
Serviços
```

### H2

```text
Quatro competências que trabalham juntas para melhorar sua operação.
```

### Parágrafo

```text
Partimos do problema, não da ferramenta. Combinamos automação, inteligência artificial, software e cloud conforme o contexto, sem exigir que você escolha previamente uma tecnologia.
```

## 7.4. Ordem definitiva dos cards

Exibir os cards nesta ordem:

1. Automação e Integração de Processos;
2. Inteligência Artificial Aplicada;
3. Sistemas e Plataformas Digitais;
4. Cloud, DevOps e Confiabilidade.

Em um grid de duas colunas:

- primeira linha: Automação e IA;
- segunda linha: Sistemas e Cloud.

Isso representa:

- primeira linha: eficiência e automação da operação;
- segunda linha: plataformas e modernização tecnológica.

## 7.5. Card 1 — Automação e Integração de Processos

### Rótulo superior

```text
Eficiência operacional
```

Não utilizar:

```text
Pilar · Automação
```

### Título

```text
Automação e Integração de Processos
```

### Descrição

```text
Conectamos sistemas e automatizamos atividades repetitivas para reduzir erros, retrabalho e tempo operacional.
```

### Lista

Usar exatamente três itens:

```text
Integração entre ERP, CRM e sistemas internos
```

```text
Workflows para aprovações, documentos e tarefas recorrentes
```

```text
Sincronização de dados, relatórios e notificações
```

### Tags

```text
Integrações
```

```text
Workflows
```

```text
Automação
```

### CTA

```text
Conhecer Automação e Integração
```

### Destino temporário

```text
/automacao
```

Não alterar a rota nesta tarefa.

---

# 8. Card 2 — Inteligência Artificial Aplicada

## 8.1. Rótulo superior

```text
IA aplicada
```

Não utilizar:

```text
Pilar · Inteligência
```

## 8.2. Título

```text
Inteligência Artificial Aplicada
```

## 8.3. Descrição

```text
Integramos inteligência artificial a processos, documentos e sistemas para ampliar produtividade, acesso à informação e capacidade de decisão.
```

## 8.4. Lista

Usar exatamente três itens:

```text
Assistentes conectados ao conhecimento da empresa
```

```text
Extração, classificação e pesquisa em documentos
```

```text
Agentes com regras, permissões e ações controladas
```

## 8.5. Tags

```text
Assistentes
```

```text
Documentos
```

```text
Agentes
```

## 8.6. CTA

```text
Conhecer Inteligência Artificial Aplicada
```

## 8.7. Destino temporário

```text
/inteligencia-artificial
```

Não alterar a rota nesta tarefa.

---

# 9. Card 3 — Sistemas e Plataformas Digitais

## 9.1. Rótulo superior

```text
Engenharia de software
```

Não utilizar:

```text
Pilar · Software
```

## 9.2. Título

```text
Sistemas e Plataformas Digitais
```

## 9.3. Descrição

```text
Construímos e modernizamos sistemas ligados à operação, à integração de informações e à evolução do negócio.
```

## 9.4. Lista

Usar exatamente três itens:

```text
Sistemas internos e portais operacionais
```

```text
APIs e backends para integrar dados e serviços
```

```text
Modernização gradual de aplicações existentes
```

## 9.5. Tags

```text
Sistemas
```

```text
APIs
```

```text
Modernização
```

## 9.6. CTA

```text
Conhecer Sistemas e Plataformas
```

## 9.7. Destino temporário

```text
/software
```

Não alterar a rota nesta tarefa.

---

# 10. Card 4 — Cloud, DevOps e Confiabilidade

## 10.1. Rótulo superior

```text
Plataformas em nuvem
```

Não utilizar:

```text
Pilar · Plataforma
```

## 10.2. Título

```text
Cloud, DevOps e Confiabilidade
```

## 10.3. Descrição

```text
Estruturamos plataformas em nuvem seguras, automatizadas, observáveis e preparadas para crescer.
```

## 10.4. Lista

Usar exatamente três itens:

```text
Arquitetura AWS, modernização e infraestrutura como código
```

```text
CI/CD, containers e automação de ambientes
```

```text
Observabilidade, segurança e recuperação de desastres
```

## 10.5. Tags

```text
AWS
```

```text
DevOps
```

```text
Confiabilidade
```

## 10.6. CTA

```text
Conhecer Cloud, DevOps e Confiabilidade
```

## 10.7. Destino temporário

```text
/plataforma
```

Não alterar a rota nesta tarefa.

---

# 11. Regras dos cards de serviços

## 11.1. Card inteiro

Se atualmente o card inteiro for clicável, preservar esse comportamento.

Se apenas o CTA for clicável, não alterar a estrutura para card inteiro nesta tarefa.

Não aninhar links.

## 11.2. Altura e alinhamento

- Os quatro cards devem manter altura visual equilibrada em cada linha.
- O CTA deve permanecer alinhado na parte inferior dos cards.
- As descrições devem possuir espaço equivalente.
- As listas devem ter exatamente três itens para evitar desequilíbrio.
- As tags devem permanecer após a lista e antes do CTA, respeitando o layout atual.

## 11.3. Ícones

- Reutilizar os ícones atuais se representarem adequadamente os novos nomes.
- Não adicionar ícones de robô, cérebro, foguete ou lâmpada genérica.
- Ícones decorativos devem usar `aria-hidden="true"`.
- Não utilizar emojis.

## 11.4. Mobile

Em telas menores que o breakpoint mobile atual:

- uma coluna;
- ordem dos cards preservada;
- largura total;
- sem rolagem horizontal;
- CTAs visíveis;
- tags podem quebrar linha;
- nenhum texto deve ser truncado por altura fixa.

---

# 12. Seção “Como trabalhamos”

## 12.1. Estrutura

Preservar o bloco atual e seus cinco passos.

Não criar uma nova seção de diagnóstico.

Não separar o método em outra página nesta tarefa.

## 12.2. Abertura da seção

### Eyebrow

```text
Como trabalhamos
```

### H2

```text
Um processo claro para reduzir incerteza e construir o que realmente precisa evoluir.
```

### Parágrafo

```text
Cada projeto começa pela compreensão do contexto, dos processos e dos resultados esperados. A tecnologia é definida somente depois que o problema, as restrições e as prioridades estão claros.
```

## 12.3. Bloco interno do método

Caso o layout atual possua o rótulo “Nosso Método”, manter o rótulo e alterar somente a capitalização para:

```text
Nosso método
```

### H3

```text
Entregas incrementais, decisões transparentes.
```

### Parágrafo

```text
Estruturamos o trabalho em etapas úteis e testáveis, com escopo visível, comunicação direta e validação contínua. Isso reduz riscos, evita compromissos prematuros e permite que a solução evolua com base no que aprendemos durante o projeto.
```

---

# 13. Passos do método

## 13.1. Passo 1

### Número

```text
1
```

### Título

```text
Entendimento do desafio
```

### Descrição

```text
Na conversa inicial, você apresenta o contexto, os principais sintomas e o resultado que espera alcançar. Avaliamos a aderência e definimos o próximo passo.
```

## 13.2. Passo 2

### Número

```text
2
```

### Título

```text
Diagnóstico e plano de ação
```

### Descrição

```text
Quando o desafio exige análise aprofundada, mapeamos processos, sistemas, restrições, riscos e oportunidades para definir prioridades e uma abordagem viável.
```

## 13.3. Passo 3

### Número

```text
3
```

### Título

```text
Implementação incremental
```

### Descrição

```text
Construímos a solução em ciclos testáveis, priorizando entregas úteis, segurança, manutenibilidade e controle de custos.
```

## 13.4. Passo 4

### Número

```text
4
```

### Título

```text
Validação e entrada em operação
```

### Descrição

```text
Validamos os fluxos com as pessoas envolvidas, tratamos ajustes e preparamos a entrada em produção com critérios claros de aceite.
```

## 13.5. Passo 5

### Número

```text
5
```

### Título

```text
Acompanhamento e evolução
```

### Descrição

```text
Acompanhamos o comportamento da solução, corrigimos desvios e planejamos novas etapas quando elas geram valor real para a operação.
```

## 13.6. CTA da seção

Substituir:

```text
Fale conosco
```

por:

```text
Apresentar um desafio
```

Destino:

```text
/contato
```

## 13.7. Remoção obrigatória

Remover a frase:

```text
Executamos o projeto de forma ágil, com arquitetura leve (Serverless) e segurança nativa.
```

Serverless não pode ser apresentado como arquitetura obrigatória.

Não substituir por outro padrão tecnológico universal.

---

# 14. Seção de resultados

## 14.1. Estrutura

Preservar:

- o bloco atual;
- os quatro cases;
- o formato de métricas;
- o grid;
- as tags;
- o CTA existente, com novo texto.

Reordenar os cards.

## 14.2. Abertura

### Eyebrow

```text
Resultados
```

### H2

```text
Impacto mensurável em processos e plataformas.
```

### Parágrafo

```text
Exemplos de melhorias alcançadas por meio de automação, software, arquitetura e otimização de ambientes em nuvem.
```

Não utilizar:

```text
Resultado que aparece na fatura
```

Não limitar a introdução a projetos de nuvem, pois metade dos exemplos se refere a processos operacionais.

## 14.3. Ordem dos casos

Exibir nesta ordem:

1. aprovação de contratos;
2. fechamento financeiro;
3. custo de infraestrutura;
4. performance da aplicação.

A seção deverá começar pelos resultados mais reconhecíveis para o público prioritário e terminar com os casos técnicos de cloud.

---

# 15. Caso 1 — Aprovação de contratos

## 15.1. Métrica principal

```text
-70%
```

## 15.2. Rótulo da métrica

```text
tempo do ciclo de aprovação
```

## 15.3. Título

```text
Redução de 70% no ciclo de aprovação de contratos
```

## 15.4. Texto

```text
O processo dependia de planilhas, trocas de e-mail e aprovações manuais, gerando atrasos, retrabalho e pouca rastreabilidade. Desenvolvemos um portal interno com fluxo automatizado, trilha de auditoria e notificações em cada etapa, tornando o processo mais rápido, seguro e transparente.
```

## 15.5. Tags

```text
Portal interno
```

```text
Automação de fluxo
```

```text
Auditoria
```

---

# 16. Caso 2 — Fechamento financeiro

## 16.1. Métrica principal

```text
-85%
```

## 16.2. Rótulo da métrica

```text
tempo de fechamento mensal
```

## 16.3. Título

```text
Redução de 85% no tempo de fechamento financeiro
```

## 16.4. Texto

```text
O fechamento mensal exigia consolidação manual de dados, conferências repetitivas e relatórios produzidos em diferentes sistemas. Automatizamos a consolidação das informações, os lançamentos e a geração de indicadores, reduzindo o esforço operacional e liberando a equipe para análises de maior valor.
```

## 16.5. Tags

```text
Automação
```

```text
Relatórios
```

```text
Operação financeira
```

---

# 17. Caso 3 — Custo de infraestrutura

## 17.1. Métrica principal

```text
-40%
```

## 17.2. Rótulo da métrica

```text
custo de infraestrutura
```

## 17.3. Título

```text
Redução de 40% no custo de infraestrutura
```

## 17.4. Texto

```text
O ambiente Kubernetes na AWS apresentava desperdício de recursos e custos crescentes. Revisamos a arquitetura, ajustamos o dimensionamento de CPU e memória, configuramos autoscaling e adotamos uma combinação adequada de instâncias On-Demand e Spot, preservando disponibilidade e desempenho.
```

## 17.5. Tags

```text
FinOps
```

```text
Kubernetes
```

```text
AWS
```

---

# 18. Caso 4 — Performance da aplicação

## 18.1. Métrica principal

```text
+40%
```

## 18.2. Rótulo da métrica principal

```text
performance
```

## 18.3. Métrica secundária

```text
-60%
```

## 18.4. Rótulo da métrica secundária

```text
custo operacional
```

## 18.5. Título

```text
Mais performance com menor custo operacional
```

## 18.6. Texto

```text
A aplicação apresentava baixo desempenho, alto consumo de recursos e uma infraestrutura que limitava sua evolução. Reprojetamos a arquitetura da solução e revisamos a configuração do ambiente, elevando a performance em 40% e reduzindo o custo operacional em 60%.
```

## 18.7. Tags

```text
Arquitetura
```

```text
Cloud
```

```text
Performance
```

---

# 19. Regras de publicação dos resultados

## 19.1. Validação

Os percentuais só poderão ser publicados em produção quando:

- corresponderem a resultados reais;
- puderem ser sustentados por registros, medições ou evidências;
- não violarem confidencialidade;
- estiverem autorizados para divulgação anonimizada;
- compararem períodos ou condições equivalentes.

## 19.2. Implementação

Se os resultados forem controlados por dados:

- adicionar ou utilizar um campo booleano equivalente a `verified`;
- exibir em produção somente cards com `verified === true`;
- permitir cards não verificados apenas no ambiente de desenvolvimento.

Se a seção for hardcoded:

- adicionar comentário de código informando que a validação é obrigatória antes de produção;
- não escrever “projetos reais” enquanto a validação não estiver concluída.

## 19.3. Nota exibida

Adicionar abaixo do grid, em texto discreto:

```text
Os resultados variam conforme o contexto, o escopo e as condições de cada projeto.
```

A nota não deve parecer alerta jurídico destacado.

## 19.4. CTA

Substituir:

```text
Conte-nos seu desafio
```

por:

```text
Apresentar um desafio
```

Destino:

```text
/contato
```

---

# 20. Seção de conteúdo técnico

## 20.1. Estrutura

Preservar:

- seção atual;
- três cards;
- imagens;
- categorias;
- data;
- CTA para o blog.

Não transformar a seção em catálogo.

Não adicionar newsletter nesta tarefa.

## 20.2. Abertura

### Eyebrow

```text
Conteúdo técnico
```

### H2

```text
Engenharia aplicada, decisões explicadas e aprendizados de produção.
```

### Parágrafo

Adicionar abaixo do H2:

```text
Artigos sobre cloud, automação, inteligência artificial e desenvolvimento, com contexto, escolhas técnicas, erros e resultados observados na prática.
```

## 20.3. CTA

Substituir:

```text
Conheça o blog
```

por:

```text
Explorar o blog
```

Destino:

```text
/blog
```

## 20.4. Regra de seleção dos artigos

Exibir exatamente três artigos.

Critérios obrigatórios:

1. status publicado;
2. não marcado como rascunho;
3. não marcado como teste;
4. não marcado como `noindex`;
5. não possuir título iniciado por `[TESTE]`, ignorando maiúsculas e minúsculas;
6. possuir título;
7. possuir slug válido;
8. possuir data;
9. possuir resumo ou excerpt;
10. possuir imagem válida ou fallback editorial oficial.

## 20.5. Prioridade

Selecionar:

1. artigos marcados como destaque, ordenados do mais recente para o mais antigo;
2. completar as posições restantes com os artigos publicados mais recentes.

Quando houver conteúdo suficiente, evitar três artigos da mesma categoria.

Preferência editorial:

- um artigo de automação ou IA aplicada;
- um artigo de cloud, DevOps ou arquitetura;
- um artigo de engenharia de software, operação ou bastidores.

A diversidade não deve impedir a exibição caso existam poucos artigos publicados.

## 20.6. Ambiente de desenvolvimento

Artigos de teste podem continuar existindo no banco ou CMS, mas não devem ser retornados pela consulta que alimenta a Home.

Não resolver o problema apenas ocultando `[TESTE]` por CSS.

A filtragem deve ocorrer na fonte de dados ou antes da renderização.

## 20.7. Estado com menos de três artigos

Se houver:

- três ou mais: renderizar três;
- dois: renderizar dois, sem cards vazios;
- um: renderizar um com largura coerente;
- zero: ocultar o grid e exibir somente o CTA para o blog, sem mensagem de erro.

Não exibir skeleton permanente, placeholder de artigo ou card falso.

---

# 21. CTA final

## 21.1. Estrutura

Preservar o bloco visual atual e sua divisão principal, se houver.

Simplificar a área de ação.

Remover os quatro links internos de serviços atualmente apresentados no card do CTA.

O CTA final deve ter uma única ação principal.

## 21.2. Coluna ou bloco principal

### Eyebrow

```text
Vamos conversar
```

### H2

```text
Conte o que está limitando sua operação.
```

### Parágrafo

```text
Descreva o processo, sistema ou desafio que precisa evoluir. Vamos avaliar a aderência, esclarecer os primeiros caminhos e definir se faz sentido avançar para um diagnóstico.
```

### Lista

Usar exatamente três itens:

```text
Processos manuais que consomem tempo e geram retrabalho
```

```text
Sistemas desconectados ou difíceis de evoluir
```

```text
Plataformas que precisam ganhar segurança, confiabilidade ou escala
```

## 21.3. Badge de disponibilidade

Texto:

```text
Disponível para novos projetos
```

Exibir somente quando a configuração da aplicação indicar que novos projetos estão sendo aceitos.

Implementar por meio do mecanismo de configuração já existente.

Caso não exista mecanismo:

- criar uma constante local claramente nomeada;
- exemplo: `acceptingNewProjects`;
- não criar backend ou painel administrativo nesta tarefa.

Quando o valor for falso:

- ocultar completamente o badge;
- não exibir mensagem de indisponibilidade automática.

## 21.4. Card de ação

### Eyebrow ou rótulo

```text
Primeira conversa
```

### H3

```text
Vamos entender o problema e avaliar o próximo passo.
```

### Parágrafo

```text
Você não precisa saber qual tecnologia ou serviço contratar. Começamos pelo contexto e identificamos o caminho mais adequado.
```

### CTA

```text
Apresentar um desafio
```

Destino:

```text
/contato
```

### Microcopy

```text
Sem compromisso · Retorno em até um dia útil
```

## 21.5. Remover do CTA final

Remover:

```text
Vamos construir a solução que vai impulsionar seu negócio.
```

Remover o parágrafo atual que enumera:

```text
software, cloud, integração e inteligência artificial
```

Remover:

```text
Conte-nos seu desafio. Nós ajudamos a encontrar a melhor solução.
```

Remover os links ou chips:

```text
Engenharia de Software
```

```text
Inteligência Artificial
```

```text
Integração & Automação
```

```text
Cloud & DevOps
```

Remover:

```text
Projetos sob medida · Primeira conversa sem compromisso
```

Substituir pela nova microcopy.

## 21.6. Motivo da remoção dos links

O usuário já chegou ao final da página.

Links para quatro páginas diferentes criam escolhas concorrentes no momento em que o objetivo é iniciar contato.

A exploração dos serviços já foi oferecida na seção correspondente.

---

# 22. Rodapé global — ajuste mínimo de coerência

## 22.1. Preservar

Manter:

- estrutura;
- colunas;
- links legais;
- copyright;
- controle de cookies;
- layout;
- cores;
- espaçamento;
- comportamento mobile.

## 22.2. Tagline anterior ao rodapé

Substituir:

```text
Engenharia, IA e automação para quem quer destravar valor com tecnologia.
```

por:

```text
Engenharia e tecnologia para operações mais integradas, eficientes e preparadas para crescer.
```

## 22.3. Descrição institucional

Substituir:

```text
Desenvolvemos software, plataformas em nuvem, integrações e soluções com inteligência artificial para empresas que desejam crescer com tecnologia.
```

por:

```text
Consultoria boutique liderada por Marcelo Gonçalves, com atuação em automação, inteligência artificial, sistemas e arquitetura AWS.
```

## 22.4. Especialidades

Alterar os nomes visíveis para:

```text
Automação e Integração
```

Destino temporário:

```text
/automacao
```

```text
Inteligência Artificial Aplicada
```

Destino temporário:

```text
/inteligencia-artificial
```

```text
Sistemas e Plataformas
```

Destino temporário:

```text
/software
```

```text
Cloud, DevOps e Confiabilidade
```

Destino temporário:

```text
/plataforma
```

## 22.5. Texto de contato

Substituir:

```text
Vamos conversar sobre seu próximo projeto.
```

por:

```text
Conte o que sua empresa precisa melhorar.
```

Não alterar e-mails ou canais nesta tarefa.

---

# 23. Estrutura de headings

Aplicar esta hierarquia:

- Hero: `<h1>`;
- Serviços: `<h2>`;
- títulos dos serviços: `<h3>`;
- Como trabalhamos: `<h2>`;
- título interno do método: `<h3>`;
- passos: `<h4>` somente se a estrutura atual exigir; caso contrário, `<h3>`;
- Resultados: `<h2>`;
- títulos dos cases: `<h3>`;
- Conteúdo técnico: `<h2>`;
- títulos dos artigos: `<h3>`;
- CTA final: `<h2>`;
- card interno do CTA: `<h3>`.

Não pular de `<h2>` para `<h4>` sem nível intermediário.

Não utilizar headings apenas para estilização.

---

# 24. IDs e âncoras

Usar:

```text
servicos
```

```text
como-trabalhamos
```

```text
resultados
```

```text
conteudo
```

```text
vamos-conversar
```

Não duplicar IDs.

Links internos devem apontar para IDs existentes.

Aplicar `scroll-margin-top` às seções para compensar o cabeçalho fixo.

---

# 25. Responsividade

## 25.1. Regra geral

Usar os breakpoints já existentes no projeto.

Não criar uma nova estratégia global de breakpoints.

Caso os componentes atuais não cubram os comportamentos abaixo, aplicar ajustes locais.

## 25.2. Desktop amplo

Em larguras iguais ou superiores ao breakpoint desktop atual:

- preservar container atual;
- hero com composição atual;
- CTAs lado a lado;
- serviços em duas colunas;
- resultados em duas colunas;
- artigos em três colunas;
- CTA final com composição em duas áreas, caso esse seja o layout atual;
- método conforme layout atual, sem overflow.

## 25.3. Tablet

- serviços em duas colunas, se cada card mantiver leitura confortável;
- resultados em duas colunas;
- artigos em duas colunas ou uma coluna conforme o componente atual;
- não deixar o terceiro artigo estreito ou isolado de forma visualmente defeituosa;
- método pode quebrar para duas linhas;
- não utilizar rolagem horizontal obrigatória para ler etapas;
- CTA final pode permanecer em duas áreas somente se ambas mantiverem largura legível.

## 25.4. Mobile

- todos os cards em uma coluna;
- ordem de conteúdo preservada;
- hero CTAs empilhados;
- botões com área de toque adequada;
- nenhuma largura fixa;
- nenhum texto cortado;
- tags com quebra de linha;
- métricas não devem ultrapassar o card;
- CTA final em uma coluna;
- card de ação após o texto principal;
- conteúdo sem rolagem horizontal;
- headings sem `white-space: nowrap`;
- manter padding lateral atual ou equivalente.

## 25.5. Alturas

Não usar alturas fixas para:

- hero;
- cards de serviços;
- cards de resultados;
- cards de artigos;
- CTA final.

Pode ser utilizado `min-height` somente se já fizer parte do sistema visual e não causar corte em zoom ou mobile.

---

# 26. Acessibilidade

## 26.1. Contraste

Manter contraste compatível com WCAG AA para:

- texto;
- links;
- botões;
- tags;
- métricas;
- microcopy;
- foco.

## 26.2. Teclado

Todos os links e botões devem:

- ser acessíveis por Tab;
- exibir foco visível;
- respeitar a ordem visual;
- funcionar com Enter;
- não depender exclusivamente de hover.

## 26.3. Movimento

Respeitar:

```css
prefers-reduced-motion: reduce
```

Quando ativo:

- remover animações não essenciais;
- evitar deslocamentos;
- manter o conteúdo imediatamente disponível.

## 26.4. Links

- Usar links para navegação.
- Não usar `<button>` para navegar.
- Não usar `<div onClick>` como substituto de link.
- Não abrir páginas internas em nova aba.
- Não adicionar `target="_blank"` aos CTAs internos.

## 26.5. Ícones e imagens

- ícones decorativos: `aria-hidden="true"`;
- imagens editoriais: alt descritivo;
- imagens puramente decorativas: alt vazio;
- não repetir no alt o mesmo texto integral do título;
- não usar texto essencial dentro de imagens.

---

# 27. Performance e implementação técnica

## 27.1. Dependências

Não instalar bibliotecas novas.

Não adicionar:

- carrossel;
- slider;
- vídeo;
- biblioteca de animação;
- biblioteca de ícones adicional;
- pacote de layout.

## 27.2. Reutilização

Reutilizar:

- componentes atuais;
- componentes de botão;
- componentes de card;
- componente de tag;
- sistema de container;
- classes utilitárias existentes;
- mecanismo atual de consulta de artigos.

## 27.3. Conteúdo dinâmico

Se serviços, resultados ou artigos forem data-driven:

- alterar a fonte de dados;
- não duplicar conteúdo hardcoded no componente;
- preservar tipos;
- atualizar interfaces quando necessário;
- garantir chaves estáveis;
- não usar índice do array como chave quando existir identificador estável.

## 27.4. Imagens dos artigos

- preservar otimização já existente;
- informar `sizes` adequadamente, se o projeto usar `next/image`;
- manter proporção consistente;
- não carregar imagens acima do necessário;
- usar fallback editorial oficial;
- evitar layout shift.

## 27.5. JavaScript

Não adicionar JavaScript para comportamentos que podem ser resolvidos com:

- HTML semântico;
- CSS;
- links de âncora;
- media queries.

---

# 28. Analytics

Somente aplicar esta seção se já existir um helper de analytics no projeto.

Não instalar um novo provedor.

Eventos recomendados:

```text
home_header_cta_click
```

```text
home_hero_primary_click
```

```text
home_hero_services_click
```

```text
home_service_card_click
```

```text
home_method_cta_click
```

```text
home_results_cta_click
```

```text
home_blog_click
```

```text
home_final_cta_click
```

Para `home_service_card_click`, incluir propriedade com o identificador do serviço.

Não enviar dados pessoais.

Caso não exista helper, ignorar esta seção e registrar como melhoria futura.

---

# 29. Metadados da Home

Atualizar os metadados da rota `/`.

## 29.1. Title

```text
Consultoria em Automação, Software e AWS | Marcelo Gonçalves
```

## 29.2. Description

```text
Consultoria boutique para automatizar processos, integrar sistemas, desenvolver plataformas e modernizar ambientes AWS com segurança e confiabilidade.
```

## 29.3. Open Graph

Usar o mesmo title e description.

Preservar a imagem Open Graph atual se ela já estiver alinhada à identidade.

Não gerar nova imagem nesta tarefa.

## 29.4. Canonical

Preservar o canonical configurado para a Home.

Quando o domínio definitivo estiver disponível:

- substituir o domínio temporário;
- não manter o CloudFront como canonical de produção.

---

# 30. Elementos proibidos

A IA engenheira não deve:

- criar nova seção “Problemas que resolvemos”;
- criar seção de depoimentos;
- inventar clientes;
- inventar logos;
- inventar certificações;
- inventar números;
- adicionar fotos de banco;
- inserir imagem de Marcelo sem arquivo fornecido;
- redesenhar o header;
- redesenhar o footer;
- alterar cores;
- alterar fontes;
- trocar a ordem principal dos seis blocos;
- criar carrossel de serviços;
- criar carrossel de resultados;
- criar animações 3D;
- criar parallax;
- adicionar chat;
- adicionar popup;
- adicionar modal automático;
- adicionar formulário diretamente na Home;
- substituir o CTA por WhatsApp;
- adicionar preço;
- prometer diagnóstico gratuito;
- prometer prazo de duas horas;
- apresentar Serverless como solução universal;
- ocultar conteúdo de teste apenas com CSS;
- inventar texto alternativo;
- resumir ou reescrever os textos definidos neste documento.

---

# 31. Arquivos e componentes

Aplicar as alterações no componente atualmente responsável pela rota `/`.

Não criar uma segunda Home.

Atualizar o stylesheet atualmente utilizado pela Home.

Se a estrutura do projeto permanecer conforme a organização anterior, verificar:

```text
app/page.tsx
```

ou o componente importado por essa rota, e:

```text
app/home.css
```

Não assumir esses arquivos sem verificar o código atual.

Cabeçalho e rodapé devem ser alterados nos componentes compartilhados já existentes.

Não duplicar header ou footer dentro da Home.

---

# 32. Ordem de implementação

Executar nesta ordem:

1. Criar uma branch específica.
2. Identificar componentes e fontes de dados atuais.
3. Atualizar textos do hero.
4. Adicionar segundo CTA e microcopy.
5. Atualizar CTA do cabeçalho.
6. Atualizar abertura da seção de serviços.
7. Reordenar e atualizar cards de serviços.
8. Atualizar seção “Como trabalhamos”.
9. Reordenar e atualizar resultados.
10. Adicionar validação ou gate dos resultados.
11. Atualizar conteúdo técnico e filtro de posts.
12. Simplificar CTA final.
13. Aplicar ajuste mínimo no rodapé.
14. Atualizar metadata.
15. Ajustar responsividade.
16. Executar testes.
17. Fazer revisão visual em desktop, tablet e mobile.
18. Validar todos os links.
19. Validar acessibilidade por teclado.
20. Confirmar que nenhuma página interna foi quebrada.

---

# 33. Testes obrigatórios

## 33.1. Testes de conteúdo

Verificar que a Home contém:

- `Consultoria boutique de tecnologia`;
- o novo H1;
- os quatro novos nomes de serviços;
- os cinco novos passos;
- o novo título de resultados;
- o novo título de conteúdo;
- o novo CTA final.

Verificar que a Home não contém:

- `Solicitar diagnóstico`;
- `Quatro pilares que cobrem toda a sua operação`;
- `Resultado que aparece na fatura`;
- `arquitetura leve (Serverless)`;
- `Tempo de resposta max. 2h`;
- `destravar valor`;
- `[TESTE]`.

## 33.2. Testes de navegação

Validar:

- header CTA → `/contato`;
- hero CTA principal → `/contato`;
- hero CTA secundário → `#servicos`;
- card Automação → `/automacao`;
- card IA → `/inteligencia-artificial`;
- card Sistemas → `/software`;
- card Cloud → `/plataforma`;
- método CTA → `/contato`;
- resultados CTA → `/contato`;
- blog CTA → `/blog`;
- CTA final → `/contato`.

## 33.3. Testes de responsividade

Validar pelo menos:

- 360px;
- 390px;
- 768px;
- 1024px;
- 1366px;
- 1440px.

Em cada largura verificar:

- ausência de overflow horizontal;
- headings legíveis;
- botões sem corte;
- cards sem texto oculto;
- tags com quebra correta;
- ordem preservada;
- CTA final sem sobreposição;
- menu funcional.

## 33.4. Zoom

Validar em desktop:

- 100%;
- 200%.

Nenhum texto deve ser cortado.

## 33.5. Teclado

Percorrer toda a Home com Tab.

Confirmar:

- foco visível;
- ordem coerente;
- ausência de armadilhas;
- links acionáveis;
- menu acessível;
- CTA secundário leva corretamente à seção.

## 33.6. Conteúdo dinâmico

Criar cenários de teste com:

- três artigos válidos;
- dois artigos;
- um artigo;
- zero artigos;
- artigo `[TESTE]`;
- artigo rascunho;
- resultado não verificado em produção.

---

# 34. Critérios de aceite por seção

## 34.1. Cabeçalho

- CTA alterado em desktop e mobile.
- Link direciona a `/contato`.
- Layout não foi redesenhado.

## 34.2. Hero

- novo eyebrow;
- novo H1;
- novo subtítulo;
- dois CTAs;
- microcopy;
- nenhuma lista de tecnologia;
- nenhum novo elemento decorativo relevante.

## 34.3. Serviços

- quatro cards;
- ordem correta;
- textos exatos;
- listas com três itens;
- tags corretas;
- links preservados;
- sem “pilar”.

## 34.4. Método

- cinco etapas;
- nenhum Serverless obrigatório;
- conversa inicial separada do diagnóstico;
- implementação incremental explícita;
- CTA padronizado.

## 34.5. Resultados

- casos operacionais aparecem primeiro;
- textos atualizados;
- nota de variação presente;
- validação de produção prevista;
- CTA padronizado.

## 34.6. Conteúdo

- abertura atualizada;
- três artigos no máximo;
- teste e rascunho excluídos pela consulta;
- CTA atualizado;
- estado vazio tratado.

## 34.7. CTA final

- links de serviços removidos;
- uma ação principal;
- textos exatos;
- disponibilidade controlável;
- prazo de um dia útil.

## 34.8. Rodapé

- tagline atualizada;
- descrição institucional atualizada;
- nomes dos serviços atualizados;
- estrutura preservada.

---

# 35. Critérios de aceite da página completa

A implementação será aceita somente quando:

1. A página preservar sua identidade visual.
2. A ordem principal dos blocos permanecer intacta.
3. A comunicação começar por resultado e problema, não por ferramentas.
4. O público prioritário estiver explícito no hero.
5. Os serviços estiverem coerentes com a nova arquitetura comercial.
6. A IA estiver apresentada como aplicação integrada e controlada.
7. Software estiver apresentado como sistemas e plataformas.
8. Cloud incluir confiabilidade como resultado.
9. O método diferenciar conversa, diagnóstico e implementação.
10. Serverless não estiver prometido como arquitetura padrão.
11. Os resultados abrangerem operação e cloud.
12. Métricas não verificadas não forem publicadas em produção.
13. Artigos de teste não aparecerem na Home.
14. O CTA “Solicitar diagnóstico” tiver sido removido da Home e do header.
15. O prazo institucional estiver padronizado em um dia útil.
16. O CTA final possuir uma única ação.
17. A Home funcionar em desktop, tablet e mobile.
18. Não houver regressão de acessibilidade.
19. Não houver regressão de performance perceptível.
20. Nenhum link interno estiver quebrado.
21. Não houver texto definido por iniciativa da IA engenheira além do fornecido neste arquivo.

---

# 36. Checklist final de revisão humana

Antes de considerar a tarefa encerrada, revisar visualmente:

- [ ] O hero continua equilibrado com o texto maior.
- [ ] O novo H1 não produz linhas isoladas inadequadas.
- [ ] Os dois CTAs funcionam em todas as larguras.
- [ ] A microcopy não compete com os botões.
- [ ] Os cards de serviços mantêm altura equilibrada.
- [ ] Os títulos longos não quebram o grid.
- [ ] As listas dos cards possuem alinhamento consistente.
- [ ] O método permanece fácil de escanear.
- [ ] As descrições das etapas não ficam comprimidas.
- [ ] As métricas continuam visualmente dominantes.
- [ ] Os cases operacionais aparecem antes dos técnicos.
- [ ] A nota de resultados está discreta e legível.
- [ ] Nenhum artigo de teste aparece.
- [ ] O CTA final está mais simples que antes.
- [ ] Não existem quatro links concorrentes no card final.
- [ ] O rodapé continua funcional.
- [ ] A página não ganhou seções não autorizadas.
- [ ] A paleta e a tipografia permanecem as mesmas.
- [ ] Não existem erros de ortografia.
- [ ] Não existem espaços duplos ou inconsistência de pontuação.
- [ ] Todos os textos usam português do Brasil.
- [ ] Todos os CTAs usam a mesma capitalização.
- [ ] O build de produção é concluído sem erros.
- [ ] Testes e lint são concluídos sem erros.

---

# 37. Resultado esperado

Ao final, a Home deverá transmitir com clareza:

> Esta é uma consultoria boutique, liderada diretamente por um profissional técnico experiente, que ajuda empresas em crescimento a melhorar processos e plataformas por meio de automação, IA aplicada, software e cloud.

O visitante não deverá precisar:

- entender qual tecnologia contratar;
- escolher previamente um serviço;
- interpretar o que “quatro pilares” significam;
- presumir que a primeira conversa é um diagnóstico gratuito;
- concluir que Serverless será utilizado em todos os projetos.

A página deverá conduzi-lo a:

1. reconhecer o problema;
2. entender as competências;
3. confiar no método;
4. visualizar resultados;
5. conhecer a profundidade técnica;
6. apresentar seu desafio.
