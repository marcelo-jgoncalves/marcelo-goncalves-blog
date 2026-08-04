---
id: WORK-2026-003
title: Especificação definitiva - Autoridade, provas e estudos de caso
type: change-instruction
status: cancelled
created_at:
approved_at:
started_at:
completed_at: 2026-08-04
requested_by: Marcelo Gonçalves
execution_agent:
scope: ["Home", "Sobre", "Serviços", "blog", "estudos de caso"]
related_audits: []
related_cases: []
related_commits: []
related_pull_requests: []
superseded_by: []
resulting_documents: []
contains_sensitive_content: false
---

# Especificação definitiva — Autoridade, provas e estudos de caso

## Resultado da execução

- Status: cancelled
- Data: 2026-08-04
- Commit: nenhum (decisão de não implementar, sem código produzido)
- Pull request: nenhuma
- Arquivos alterados: nenhum
- Critérios satisfeitos: não aplicável
- Critérios não satisfeitos: não aplicável
- Desvios em relação à instrução original: nenhum — a especificação inteira foi descartada por decisão consciente
- Decisões humanas adicionais: Marcelo decidiu explicitamente não implementar este ajuste ("o ajuste 13 não vamos implementar", 2026-08-04), depois de um pente-fino na pasta `ajustes/` identificar que era o único item sem rota correspondente no código
- Documentação canônica resultante: nenhuma
- Estudo de caso relacionado: nenhum aberto

## 0. Finalidade e precedência

Este documento define a estratégia transversal para apresentar autoridade, experiência, certificações, projetos, métricas e estudos de caso em toda a plataforma da consultoria.

A especificação deve ser aplicada a:

- Home;
- página Sobre;
- página central de Serviços;
- páginas individuais de serviços;
- blog;
- futuras páginas de estudos de caso;
- metadados;
- componentes compartilhados;
- fonte de dados;
- processo editorial;
- validações de produção.

Este arquivo não cria uma nova página imediatamente. Ele define:

1. quais tipos de prova podem ser publicados;
2. como cada prova deve ser validada;
3. como números devem ser medidos e contextualizados;
4. como preservar confidencialidade;
5. onde cada tipo de prova deve aparecer;
6. qual estrutura usar em estudos de caso;
7. quais dados e estados o sistema deve manter;
8. quais validações devem impedir publicação indevida.

Em caso de conflito com documentos anteriores:

- as estruturas de página já aprovadas continuam válidas;
- este documento prevalece especificamente sobre regras de autoridade, métricas, provas, certificações, clientes, resultados e estudos de caso;
- este documento não autoriza a criação de novas seções em páginas cuja estrutura já foi fechada, exceto quando uma regra futura for explicitamente marcada como opcional.

A IA engenheira não deverá:

- inventar resultados;
- inventar clientes;
- inventar projetos;
- transformar exemplos ilustrativos em casos reais;
- publicar métricas sem registro de evidência;
- criar depoimentos;
- criar logos;
- atribuir a Marcelo um papel não comprovado;
- assumir autorização para citar empresas;
- criar páginas de caso antes dos critérios mínimos;
- utilizar selos ou badges sem arquivos oficiais;
- reescrever afirmações para torná-las mais fortes;
- omitir limitações relevantes;
- usar números aproximados como exatos.

---

# 1. Objetivo estratégico

A plataforma deverá construir confiança por meio de uma progressão coerente de evidências:

1. **clareza de posicionamento**  
   O visitante entende o problema que a consultoria resolve.

2. **experiência profissional verificável**  
   O visitante entende quem lidera os projetos e qual trajetória sustenta a proposta.

3. **credenciais técnicas**  
   Certificações e competências complementam a experiência prática.

4. **provas de execução**  
   Projetos e contextos demonstram que o conhecimento foi aplicado.

5. **resultados mensuráveis**  
   Métricas mostram impacto quando existe uma comparação válida.

6. **estudos de caso**  
   Casos completos explicam contexto, decisões, limites e resultados.

A plataforma não deverá tentar produzir confiança apenas com:

- listas de tecnologias;
- superlativos;
- números isolados;
- nomes de clientes;
- badges;
- afirmações genéricas como “alta qualidade”;
- textos sobre excelência sem evidência;
- quantidade de anos sem contexto.

---

# 2. Princípio central

Usar esta regra em toda a plataforma:

> Quanto mais forte a afirmação, mais forte deve ser a evidência e mais preciso deve ser o contexto.

Exemplos:

| Afirmação | Evidência mínima |
|---|---|
| “Atuação em projetos no Brasil e na Alemanha” | Histórico profissional documentado |
| “Mais de dez anos em tecnologia” | Linha do tempo profissional coerente |
| “Certificado AWS” | Certificação identificada e status revisado |
| “Redução de 40% no custo” | Baseline, período, fórmula, fonte e aprovação |
| “Aumento de 40% na performance” | Métrica técnica nomeada, coleta antes/depois e condições equivalentes |
| “Projeto para empresa X” | Autorização para citar o nome ou fonte pública |
| “Alta disponibilidade” | Arquitetura, objetivo e medição definida |
| “Resultado garantido” | Não publicar; a consultoria não deve garantir resultado variável |

---

# 3. Tipos de autoridade

A plataforma deverá utilizar cinco categorias.

## 3.1. Autoridade de trajetória

Inclui:

- anos de experiência;
- atuação no Brasil e na Alemanha;
- participação em equipes distribuídas;
- experiência em contextos corporativos;
- liderança técnica;
- atuação com ambientes de diferentes níveis de criticidade;
- experiência prática com cloud, DevOps, automação e software.

## 3.2. Autoridade de credencial

Inclui:

- certificações AWS;
- certificação Terraform;
- certificação Splunk;
- formação acadêmica relevante;
- pós-graduação;
- outros certificados que tenham relação direta com os serviços.

## 3.3. Autoridade de execução

Inclui:

- projetos concluídos;
- sistemas implantados;
- migrações;
- automações;
- modernizações;
- plataformas construídas;
- ambientes operados;
- iniciativas de segurança;
- processos de CI/CD;
- observabilidade;
- recuperação de desastres;
- FinOps.

## 3.4. Autoridade de resultado

Inclui:

- redução de custo;
- redução de tempo;
- aumento de desempenho;
- redução de falhas;
- aumento de cobertura;
- diminuição de etapas manuais;
- maior previsibilidade;
- melhoria de tempo de recuperação;
- aumento de rastreabilidade.

## 3.5. Autoridade editorial

Inclui:

- artigos técnicos;
- análises;
- bastidores;
- decisões de arquitetura;
- incidentes e aprendizados;
- documentação da própria plataforma;
- materiais que demonstrem raciocínio e profundidade.

A autoridade editorial complementa provas de execução, mas não substitui resultados verificáveis.

---

# 4. Estados obrigatórios de uma evidência

Toda prova utilizada na plataforma deverá possuir um estado explícito.

Usar exatamente estes estados lógicos:

```text
draft
```

```text
awaiting_evidence
```

```text
verified
```

```text
approved_anonymized
```

```text
approved_public
```

```text
rejected
```

```text
archived
```

## 4.1. draft

Informação registrada, ainda incompleta.

Não pode ser publicada.

## 4.2. awaiting_evidence

Afirmação plausível, mas ainda sem documentos ou dados suficientes.

Não pode ser publicada como fato.

Pode ser usada internamente para solicitar comprovação.

## 4.3. verified

Evidência revisada e considerada suficiente, mas ainda sem decisão sobre confidencialidade e publicação.

Não publicar automaticamente.

## 4.4. approved_anonymized

Pode ser publicada sem nome do cliente e com os campos autorizados.

## 4.5. approved_public

Pode ser publicada com os nomes, marcas, links e detalhes explicitamente aprovados.

## 4.6. rejected

Não possui evidência suficiente, apresenta conflito ou não pode ser divulgada.

Não publicar.

## 4.7. archived

Foi válida ou utilizada anteriormente, mas não deve permanecer em publicação ativa.

Exemplos:

- certificação que não deve mais aparecer como vigente;
- case antigo retirado;
- métrica substituída por medição mais precisa.

---

# 5. Classificação de confidencialidade

Toda evidência deverá possuir uma classificação.

Usar:

```text
public
```

```text
anonymized
```

```text
internal
```

```text
restricted
```

```text
prohibited
```

## 5.1. public

Existe autorização explícita ou fonte pública para divulgar todos os campos selecionados.

## 5.2. anonymized

O projeto pode ser descrito sem identificar a organização.

Devem ser removidos ou generalizados:

- nome;
- marca;
- domínio;
- localização específica;
- nomes de sistemas internos;
- identificadores de contas;
- nomes de clusters;
- dados financeiros confidenciais;
- volumes que permitam identificação;
- datas precisas, quando sensíveis;
- arquitetura detalhada, quando sensível;
- nomes de funcionários;
- screenshots;
- repositórios;
- credenciais;
- endpoints.

## 5.3. internal

Pode ser usado para validação interna, mas não para publicação.

## 5.4. restricted

Possui restrições contratuais ou operacionais relevantes.

Não publicar sem revisão e autorização específica.

## 5.5. prohibited

Não pode ser divulgado.

O sistema deve bloquear publicação.

---

# 6. Níveis de prova

## 6.1. Nível A — Evidência pública verificável

Exemplos:

- certificação com página pública;
- artigo publicado;
- projeto open source;
- página pública do próprio projeto;
- comunicado público;
- case aprovado pelo cliente;
- repositório público.

Pode sustentar afirmações públicas, respeitando direitos e contexto.

## 6.2. Nível B — Evidência privada verificável

Exemplos:

- dashboard;
- relatório;
- ticket;
- gráfico;
- pipeline;
- documentação;
- e-mail de aprovação;
- relatório de custo;
- dados antes/depois;
- contrato;
- registro de implantação.

Pode sustentar publicação anonimizada após revisão de confidencialidade.

## 6.3. Nível C — Histórico profissional documentado

Exemplos:

- currículo;
- contrato de trabalho;
- perfil profissional;
- certificado;
- histórico acadêmico;
- carta de referência.

Pode sustentar trajetória e credenciais.

## 6.4. Nível D — Memória ou relato sem evidência suficiente

Não publicar como resultado objetivo.

Pode servir para localizar documentos ou reconstruir a evidência.

## 6.5. Nível E — Exemplo hipotético

Pode aparecer apenas com rótulo explícito:

```text
Exemplo de aplicação
```

ou:

```text
Cenário ilustrativo
```

Não utilizar métricas específicas que pareçam resultados reais.

Não inserir no bloco “Resultados”.

---

# 7. Registro central de evidências

## 7.1. Obrigatoriedade

Criar uma fonte central de verdade para provas publicáveis.

A implementação pode utilizar:

- arquivo TypeScript;
- JSON validado;
- coleção no CMS;
- tabela no banco;
- outra fonte estruturada já compatível com o projeto.

Não manter métricas espalhadas diretamente nos componentes.

Não duplicar a mesma prova em arquivos diferentes.

## 7.2. Nome conceitual

Usar internamente:

```text
Evidence Registry
```

ou:

```text
Registro de Evidências
```

Não é necessário exibir esse nome ao público.

## 7.3. Estrutura mínima

Cada registro deverá conter:

```ts
type EvidenceStatus =
  | "draft"
  | "awaiting_evidence"
  | "verified"
  | "approved_anonymized"
  | "approved_public"
  | "rejected"
  | "archived";

type Confidentiality =
  | "public"
  | "anonymized"
  | "internal"
  | "restricted"
  | "prohibited";

type EvidenceType =
  | "career"
  | "certification"
  | "project"
  | "metric"
  | "client"
  | "testimonial"
  | "publication"
  | "education";

interface EvidenceRecord {
  id: string;
  type: EvidenceType;
  status: EvidenceStatus;
  confidentiality: Confidentiality;

  title: string;
  publicClaim?: string;
  internalDescription: string;

  sourceType: string;
  sourceReferences: string[];

  owner: string;
  reviewedBy?: string;
  reviewedAt?: string;
  approvedBy?: string;
  approvedAt?: string;

  validFrom?: string;
  validUntil?: string;
  lastVerifiedAt?: string;

  allowedPlacements: string[];
  prohibitedPlacements?: string[];

  clientNameInternal?: string;
  clientNamePublic?: string;
  clientApprovalReference?: string;

  anonymizationNotes?: string;
  limitations?: string[];

  relatedCaseStudyId?: string;
  relatedServiceIds?: string[];

  metric?: MetricEvidence;
}
```

## 7.4. Estrutura de métrica

```ts
interface MetricEvidence {
  direction: "increase" | "decrease";
  value: number;
  unit: "percent" | "hours" | "days" | "currency" | "count" | "ratio";
  publicValueLabel: string;

  metricName: string;
  metricDefinition: string;

  baselineValue: number;
  finalValue: number;
  calculationFormula: string;

  baselinePeriod: string;
  comparisonPeriod: string;

  dataSource: string;
  sampleSize?: number;
  aggregation?: "mean" | "median" | "sum" | "p50" | "p90" | "p95" | "p99";

  conditionsBefore: string[];
  conditionsAfter: string[];
  exclusions?: string[];

  measurementNotes: string;
}
```

## 7.5. Campos obrigatórios para publicação de métrica

Uma métrica só pode ser publicada quando possuir:

- `status` igual a `approved_anonymized` ou `approved_public`;
- `metricName`;
- `metricDefinition`;
- `baselineValue`;
- `finalValue`;
- `calculationFormula`;
- `baselinePeriod`;
- `comparisonPeriod`;
- `dataSource`;
- `measurementNotes`;
- ao menos uma fonte de evidência;
- revisão registrada;
- classificação de confidencialidade;
- texto público aprovado;
- limitações relevantes.

---

# 8. Validação das afirmações de trajetória

## 8.1. “Mais de dez anos de experiência em tecnologia”

Pode ser publicado quando a linha do tempo profissional documentada sustentar dez anos completos ou mais.

Texto permitido:

```text
Mais de dez anos de experiência em tecnologia
```

ou:

```text
10+ anos de experiência em tecnologia
```

Não utilizar:

```text
Mais de dez anos como especialista em cloud
```

sem uma linha do tempo específica que sustente essa especialização pelo mesmo período.

## 8.2. Atuação internacional

Texto permitido:

```text
Experiência em projetos no Brasil e na Alemanha
```

```text
Atuação em equipes distribuídas e contextos corporativos internacionais
```

Não utilizar:

- escritório na Alemanha;
- operação global;
- empresa internacional;
- presença internacional;
- clientes em todo o mundo;
- consultoria alemã;
- consultoria multinacional.

## 8.3. Liderança

Texto permitido:

```text
Fundador e líder técnico
```

```text
Participação direta no diagnóstico e nas principais decisões técnicas
```

Não utilizar:

- CEO, se a denominação não estiver formalmente adotada;
- equipe liderada internacionalmente;
- diretor de engenharia, se não for o cargo real da consultoria;
- responsável por todas as tarefas;
- execução integral por Marcelo.

## 8.4. Contextos corporativos

Texto permitido:

```text
Experiência em projetos corporativos e ambientes que exigem segurança, confiabilidade e disciplina de engenharia.
```

Não citar nomes de empresas ou clientes sem autorização ou fonte pública adequada.

---

# 9. Certificações

## 9.1. Certificações candidatas

O registro poderá conter:

```text
AWS Certified Solutions Architect – Associate
```

```text
AWS Certified SysOps Administrator – Associate
```

```text
AWS Certified Cloud Practitioner
```

```text
HashiCorp Certified: Terraform Associate
```

```text
Splunk Core Certified Power User
```

## 9.2. Verificação obrigatória

Antes da publicação, verificar para cada certificação:

- nome oficial;
- titular;
- entidade emissora;
- data de obtenção;
- status que será comunicado;
- validade, quando aplicável;
- política para certificações expiradas;
- link público, caso exista e possa ser usado;
- direito de uso de badge ou logo.

## 9.3. Texto padrão

Na página Sobre, usar nomes por extenso.

Não exibir somente:

- AWS;
- Terraform;
- Splunk;
- Observabilidade.

## 9.4. Certificação não vigente

Caso uma certificação não esteja vigente, escolher uma destas abordagens:

### Opção preferencial

Não exibir na lista de certificações principais.

### Opção alternativa

Exibir com texto factual que não sugira vigência:

```text
Certificação obtida em [ano]
```

Somente usar se houver motivo editorial e revisão.

## 9.5. Badges

Por padrão, usar texto.

Badges somente poderão ser exibidos quando:

- existir arquivo oficial autorizado;
- a política da entidade permitir o uso;
- o badge corresponder à certificação correta;
- não sugerir parceria;
- não deformar;
- possuir alt adequado.

Não baixar automaticamente imagens de certificações.

Não recriar badges.

Não compartilhar nem incorporar arquivos de fontes.

---

# 10. Clientes, empregadores e marcas

## 10.1. Regra geral

Não publicar nome ou logo de cliente apenas porque Marcelo trabalhou no projeto.

Distinguir:

- empregador;
- cliente do empregador;
- parceiro;
- cliente direto da consultoria;
- projeto público;
- experiência pessoal.

## 10.2. Nome de cliente

Só pode ser publicado quando existir:

- autorização explícita;
- relação pública verificável e sem conflito contratual;
- ou aprovação jurídica/editorial registrada.

## 10.3. Logos

Não adicionar logos sem:

- autorização;
- arquivo adequado;
- direito de uso;
- vínculo corretamente descrito;
- aprovação registrada.

## 10.4. Formulações seguras

Preferir:

```text
Projeto corporativo no setor financeiro
```

```text
Ambiente empresarial de grande porte
```

```text
Equipe distribuída na Alemanha
```

```text
Operação com requisitos elevados de segurança e confiabilidade
```

A generalização não pode criar uma descrição falsa.

## 10.5. Formulações proibidas sem autorização

- “Clientes: [nomes]”;
- “Empresas que confiam em nós”;
- “Nossos clientes” para experiências anteriores;
- “Parceiro de [empresa]”;
- “Projeto oficial de [empresa]”;
- logos em carrossel;
- logos em escala de cinza para contornar autorização;
- menção que sugira contratação direta da consultoria quando o vínculo foi por empregador.

---

# 11. Depoimentos

## 11.1. Estado atual

Não criar seção de depoimentos até existir material real e autorizado.

## 11.2. Requisitos

Um depoimento precisa possuir:

- texto original;
- autoria;
- função da pessoa;
- relação com o projeto;
- autorização de publicação;
- autorização de nome;
- autorização de empresa;
- autorização de fotografia, se utilizada;
- data;
- escopo aprovado;
- registro da aprovação.

## 11.3. Anonimização

Evitar depoimentos como:

```text
Diretor de uma grande empresa
```

se a anonimização eliminar credibilidade ou puder induzir interpretação.

É preferível não publicar.

## 11.4. Proibido

Não:

- escrever depoimentos em nome de clientes;
- parafrasear elogios sem aprovação;
- usar avaliações de colegas como se fossem clientes;
- usar recomendações do LinkedIn sem permissão;
- criar avatares fictícios;
- usar texto “exemplo”.

---

# 12. Métricas — regra de cálculo

## 12.1. Variação percentual

Para redução:

```text
((baseline - final) / baseline) × 100
```

Para aumento:

```text
((final - baseline) / baseline) × 100
```

A fórmula deve permanecer registrada.

## 12.2. Não misturar

Não comparar:

- meses com sazonalidade muito diferente sem nota;
- ambientes com escopos diferentes;
- uma média com um percentil;
- custo previsto com custo real;
- testes sintéticos com produção sem identificação;
- volumes diferentes sem normalização;
- valor bruto com valor líquido;
- tempo de uma etapa com tempo total;
- throughput com latência;
- custo unitário com custo total.

## 12.3. Arredondamento

A métrica pública pode ser arredondada somente quando:

- a regra de arredondamento estiver registrada;
- o arredondamento não tornar a afirmação mais favorável de forma enganosa;
- o valor não parecer mais preciso que a medição.

Exemplo:

- resultado calculado: 39,6%;
- exibição permitida: 40%;
- exibição não permitida: 40,0%, salvo precisão real.

## 12.4. “Até”

Usar “até” somente quando:

- houver múltiplos resultados;
- o valor máximo for relevante;
- o texto deixar claro que não é o resultado típico;
- a amostra estiver documentada.

Não usar “até” para suavizar ausência de medição.

## 12.5. Faixas

Quando existe variabilidade, preferir:

```text
Entre X% e Y%
```

ou:

```text
Resultado observado no período analisado
```

em vez de uma média que esconda dispersão.

---

# 13. Validação dos quatro resultados atuais da Home

A Home atual apresenta quatro métricas. Elas devem permanecer bloqueadas para produção até preencherem os requisitos abaixo.

---

## 13.1. Redução de 40% no custo de infraestrutura

### Afirmação atual

```text
-40% no custo de infraestrutura
```

### Campos obrigatórios

Registrar:

- qual ambiente;
- quais contas;
- quais serviços AWS;
- moeda;
- impostos incluídos ou excluídos;
- créditos incluídos ou excluídos;
- período baseline;
- período de comparação;
- volume da aplicação;
- alteração de tráfego;
- alteração de workloads;
- custos de migração excluídos ou incluídos;
- média, total mensal ou custo unitário;
- fonte do dado;
- fórmula;
- evidência de disponibilidade preservada;
- autorização de divulgação.

### Texto público permitido após validação

```text
Redução de 40% no custo mensal de infraestrutura
```

Somente usar “mensal” se essa for a unidade comparada.

### Texto de contexto

Deve identificar:

- ambiente Kubernetes na AWS;
- right-sizing;
- autoscaling;
- estratégia de capacidade;
- período medido;
- condição de disponibilidade.

### Não publicar

```text
sem abrir mão de disponibilidade
```

sem evidência operacional correspondente.

---

## 13.2. Aumento de 40% na performance e redução de 60% no custo operacional

### Problema atual

“Performance” não é uma métrica suficientemente específica.

### Antes da publicação

Definir exatamente:

- latência média;
- p95;
- p99;
- throughput;
- tempo de carregamento;
- tempo de processamento;
- duração de job;
- utilização de recurso;
- outra medida.

### Afirmação pública recomendada

Substituir “performance” pelo nome real da métrica.

Exemplos permitidos apenas se verdadeiros:

```text
Redução de 40% no tempo de resposta p95
```

```text
Aumento de 40% no throughput
```

```text
Redução de 40% no tempo de processamento
```

Não usar “+40% performance” sem definição.

### Custo operacional

Definir:

- custo de infraestrutura;
- horas de operação;
- licenças;
- manutenção;
- custo por transação;
- ou outro componente.

Não utilizar “custo operacional” se o dado medir apenas cloud.

---

## 13.3. Redução de 70% no tempo de aprovação de contratos

### Campos obrigatórios

Registrar:

- início do ciclo;
- fim do ciclo;
- média ou mediana;
- quantidade de contratos;
- período baseline;
- período posterior;
- variação de volume;
- contratos excluídos;
- etapas automatizadas;
- fonte dos dados;
- aprovação para divulgar;
- setor anonimizado;
- tempo absoluto anterior e posterior, quando permitido.

### Texto público

```text
Redução de 70% no tempo mediano do ciclo de aprovação
```

Somente usar “mediano” se a mediana tiver sido calculada.

Caso a medição seja média:

```text
Redução de 70% no tempo médio do ciclo de aprovação
```

Não utilizar apenas “tempo de aprovação” se a medição abranger o ciclo completo.

---

## 13.4. Redução de 85% no tempo de fechamento financeiro

### Campos obrigatórios

Registrar:

- definição de fechamento;
- número de entidades;
- quantidade de fontes;
- período baseline;
- período posterior;
- horas ou dias;
- média ou mediana;
- tarefas incluídas;
- tarefas excluídas;
- volume;
- papel da automação;
- fonte;
- autorização.

### Texto público

```text
Redução de 85% no tempo do fechamento mensal
```

Somente se o processo inteiro tiver sido medido.

Caso a automação cubra apenas consolidação:

```text
Redução de 85% no tempo de consolidação do fechamento mensal
```

Não ampliar a métrica além da etapa medida.

---

# 14. Regra de fallback para resultados não verificados

## 14.1. Home

Se um resultado não estiver aprovado:

- não renderizar o card numérico em produção;
- não substituir por número fictício;
- não utilizar placeholder;
- não publicar o card com rótulo “em validação”.

## 14.2. Preservação do layout

Se houver menos resultados aprovados:

- quatro: renderizar quatro;
- três: renderizar três com grid equilibrado;
- dois: renderizar dois;
- um: renderizar um em largura adequada;
- zero: ocultar o grid de métricas e manter a introdução sem afirmar “projetos reais”.

Quando zero:

Substituir temporariamente o H2 por:

```text
Engenharia aplicada a problemas reais da operação.
```

Substituir o parágrafo por:

```text
Os resultados são documentados e publicados somente quando contexto, medição e autorização permitem uma apresentação responsável.
```

Não exibir CTA “ver resultados” sem conteúdo.

## 14.3. Ambiente de desenvolvimento

É permitido renderizar métricas em desenvolvimento com rótulo visual:

```text
Dado de desenvolvimento — não publicar
```

Esse rótulo deve ser:

- impossível de ocultar acidentalmente por estilo de produção;
- incluído no componente quando `status` não for publicável;
- bloqueado no build de produção.

---

# 15. Componentes de prova

## 15.1. Componente `AuthorityFact`

Usar para fatos curtos:

- 10+ anos;
- Brasil e Alemanha;
- AWS como especialização;
- liderança técnica direta.

Campos:

```ts
interface AuthorityFact {
  id: string;
  value?: string;
  label: string;
  description?: string;
  evidenceId: string;
}
```

Não renderizar se a evidência não estiver publicável.

## 15.2. Componente `CertificationItem`

Campos:

```ts
interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  statusLabel?: string;
  credentialUrl?: string;
  badgeAsset?: string;
  evidenceId: string;
}
```

Regras:

- nome por extenso;
- link somente se válido;
- não exigir badge;
- não abrir em nova aba sem indicador acessível;
- se abrir externamente, usar sinalização visual e textual apropriada;
- não exibir estado “ativo” sem validação.

## 15.3. Componente `ResultCard`

Campos:

```ts
interface ResultCard {
  id: string;
  evidenceId: string;
  metricValue: string;
  metricLabel: string;
  title: string;
  summary: string;
  tags: string[];
  caseStudySlug?: string;
}
```

Regras:

- renderização condicionada ao registro;
- no máximo duas métricas por card;
- rótulo contextual;
- título não deve repetir apenas o número;
- summary deve explicar problema e intervenção;
- link para case somente se a página existir;
- sem botão desabilitado;
- sem placeholder.

## 15.4. Componente `CaseStudyCard`

Campos:

```ts
interface CaseStudyCard {
  id: string;
  slug: string;
  title: string;
  contextLabel: string;
  challengeSummary: string;
  resultSummary?: string;
  serviceIds: string[];
  evidenceIds: string[];
  publicationStatus: "draft" | "published" | "archived";
}
```

## 15.5. Componente `ProofNote`

Para limitações:

```text
Os resultados variam conforme contexto, escopo e condições de cada projeto.
```

Usar abaixo de grids de resultados.

Não utilizar como substituto de contexto em cada métrica.

---

# 16. Distribuição das provas por página

## 16.1. Home

Manter a estrutura definida no Ajuste 7.

Usar:

- bloco de resultados;
- conteúdo técnico;
- textos de método.

Não criar uma nova seção autônoma de autoridade nesta fase.

O bloco de resultados deverá:

- usar somente métricas aprovadas;
- começar por casos operacionais;
- terminar com casos técnicos;
- exibir nota de variação;
- não afirmar “projetos reais” se houver exemplos ainda não verificados.

## 16.2. Sobre

Usar a estrutura definida no Ajuste 8.

Exibir:

- 10+ anos;
- Brasil e Alemanha;
- certificações;
- competências;
- liderança técnica;
- modelo boutique.

Não inserir resultados numéricos nessa página.

Não inserir logos de clientes.

## 16.3. Página central de Serviços

Não adicionar métricas na primeira versão.

A página tem função de orientação comercial.

É permitido, futuramente, incluir links para casos publicados em seção já planejada somente após existir conteúdo suficiente.

## 16.4. Páginas individuais de serviço

Não adicionar nova seção de case nesta fase.

Depois que houver casos publicados, é permitido inserir um bloco opcional:

```text
Resultado relacionado
```

Condições:

- ao menos um caso publicado;
- relação direta com o serviço;
- não duplicar o case completo;
- exibir apenas título, contexto, resultado e link;
- no máximo dois itens;
- não alterar a estrutura sem uma especificação adicional.

## 16.5. Blog

Artigos técnicos podem referenciar experiências, mas devem distinguir:

- caso real;
- cenário anonimizado;
- exemplo ilustrativo;
- reprodução em laboratório;
- opinião;
- hipótese.

Usar rótulo editorial explícito quando necessário.

## 16.6. “O Projeto”

Pode ser usado como prova da capacidade de construir a própria plataforma.

Não apresentar automaticamente todos os recursos planejados como entregues.

Utilizar estados:

- entregue;
- em desenvolvimento;
- planejado;
- adiado;
- removido.

---

# 17. Critérios para criar a área pública de estudos de caso

## 17.1. Não criar agora se não houver conteúdo suficiente

Criar a rota:

```text
/casos
```

somente quando existirem ao menos:

- dois estudos de caso completos;
- aprovados para publicação;
- com contextos distintos;
- com evidências e revisão;
- com imagens ou composição visual adequada sem dados confidenciais.

## 17.2. Rotas futuras

```text
/casos
```

```text
/casos/[slug]
```

## 17.3. Navegação

Adicionar “Casos” ao menu principal somente quando:

- existirem pelo menos três casos publicados;
- houver plano de manutenção;
- a página não parecer vazia.

Com dois casos, é permitido:

- manter links dentro de resultados e serviços;
- não adicionar ao menu principal.

## 17.4. Arquivamento

Caso um case seja removido:

- retornar 404 ou redirecionar somente quando houver destino realmente equivalente;
- remover do sitemap;
- remover links internos;
- não redirecionar todos os cases para `/casos`.

---

# 18. Estrutura obrigatória de um estudo de caso completo

Cada case público deverá conter exatamente estes macroblocos:

1. Hero;
2. Resumo executivo;
3. Contexto;
4. Desafio;
5. Restrições;
6. Papel da consultoria;
7. Abordagem;
8. Solução;
9. Implementação;
10. Resultado;
11. Como o resultado foi medido;
12. Limitações e aprendizados;
13. Capacidades relacionadas;
14. CTA final.

Não adicionar seções vazias.

---

# 19. Hero do estudo de caso

## 19.1. Eyebrow

Usar:

```text
Estudo de caso
```

ou:

```text
Estudo de caso anonimizado
```

Quando aplicável.

## 19.2. H1

O título deve combinar transformação e contexto.

Formato recomendado:

```text
Como [tipo de solução] reduziu [problema] em [contexto]
```

Exemplo apenas estrutural:

```text
Como um fluxo digital reduziu o tempo de aprovação de contratos
```

Não usar número no H1 se ele não estiver aprovado.

## 19.3. Subtítulo

Deve explicar:

- tipo de organização, de forma autorizada;
- processo;
- objetivo;
- escopo.

## 19.4. Rótulos

É permitido exibir:

- setor;
- serviço;
- natureza do projeto;
- status anonimizado;
- período geral.

Não exibir:

- nome interno;
- data exata sensível;
- localização sensível;
- volume confidencial.

---

# 20. Resumo executivo

Exibir entre três e cinco itens:

- situação inicial;
- intervenção;
- resultado principal;
- duração, somente se autorizada;
- capacidades utilizadas.

O resumo não substitui as seções detalhadas.

---

# 21. Contexto

Explicar:

- tipo de organização;
- processo ou plataforma;
- usuários envolvidos;
- estágio de maturidade;
- sistemas relevantes, de forma segura;
- por que o problema importava.

Não apresentar a organização como cliente direto quando não foi.

---

# 22. Desafio

Descrever:

- sintomas;
- consequências;
- gargalo;
- risco;
- impacto;
- motivo pelo qual soluções anteriores não resolveram.

Evitar:

- culpar equipes;
- expor falhas de segurança;
- divulgar vulnerabilidades;
- descrever negligência;
- exagerar o estado inicial para valorizar a solução.

---

# 23. Restrições

Incluir limitações relevantes:

- sistemas legados;
- prazo;
- janela de mudança;
- orçamento;
- confidencialidade;
- dependências;
- disponibilidade;
- requisitos regulatórios;
- capacidade da equipe;
- necessidade de migração gradual.

A presença de restrições aumenta a credibilidade e explica decisões.

---

# 24. Papel da consultoria

Informar exatamente:

- diagnóstico;
- arquitetura;
- implementação;
- liderança;
- coordenação;
- revisão;
- operação;
- sustentação;
- participação parcial.

Não utilizar:

```text
Nós fizemos
```

quando a entrega foi coletiva e o papel foi apenas uma parte.

Formato recomendado:

```text
Papel de Marcelo no projeto
```

ou:

```text
Responsabilidade da consultoria
```

Selecionar conforme o vínculo.

---

# 25. Abordagem

Explicar o raciocínio:

- o que foi analisado;
- alternativas;
- por que determinada estratégia foi escolhida;
- o que foi descartado;
- como o risco foi reduzido;
- como a implantação foi dividida.

Não transformar a seção em propaganda de ferramentas.

---

# 26. Solução

Descrever:

- componentes;
- fluxos;
- integrações;
- controles;
- responsabilidades;
- experiência do usuário;
- dados;
- automação;
- observabilidade;
- segurança.

Detalhes técnicos devem ser proporcionais ao público.

É permitido incluir um diagrama somente quando:

- produzido especificamente;
- sem dados confidenciais;
- acessível;
- legível em mobile;
- acompanhado por descrição textual.

Não usar screenshot real sem autorização e sanitização.

---

# 27. Implementação

Explicar:

- etapas;
- validações;
- rollout;
- homologação;
- migração;
- treinamento;
- monitoramento;
- transferência.

Não publicar cronograma exato se sensível.

---

# 28. Resultado

## 28.1. Resultado quantitativo

Usar somente métricas aprovadas.

Cada métrica deve informar:

- valor;
- nome;
- período;
- definição;
- contexto;
- comparação.

## 28.2. Resultado qualitativo

Pode incluir:

- mais rastreabilidade;
- processo mais previsível;
- menor dependência manual;
- facilidade de manutenção;
- melhor visibilidade;
- redução de risco;
- conhecimento transferido.

Resultados qualitativos devem ter base em evidência ou observação documentada.

---

# 29. Como o resultado foi medido

Seção obrigatória para qualquer case com número.

Incluir:

- fonte;
- baseline;
- comparação;
- fórmula;
- agregação;
- amostra;
- exclusões;
- arredondamento;
- mudanças de contexto.

Exemplo de estrutura:

```text
A métrica compara o tempo mediano entre o envio e a aprovação final em [período A] e [período B]. Foram incluídos [tipos] e excluídos [tipos]. A variação foi calculada por [fórmula].
```

Não precisa expor valores confidenciais quando a porcentagem estiver aprovada, mas o método deve ser compreensível.

---

# 30. Limitações e aprendizados

Incluir:

- o que permaneceu fora do escopo;
- resultado que ainda precisa de tempo;
- dependências;
- trade-offs;
- limitações técnicas;
- condições que influenciaram a métrica;
- aprendizados.

Não usar essa seção para enfraquecer artificialmente o case.

Usar para precisão e confiança.

---

# 31. Capacidades relacionadas

Exibir links para no máximo três serviços:

- Automação e Integração de Processos;
- Inteligência Artificial Aplicada;
- Sistemas e Plataformas Digitais;
- Cloud, DevOps e Confiabilidade.

Não exibir lista de ferramentas como CTA.

---

# 32. CTA do case

Usar:

## Eyebrow

```text
Um desafio semelhante?
```

## H2

```text
Conte como esse processo funciona na sua empresa.
```

## Texto

```text
O contexto, as restrições e os resultados possíveis variam. A primeira conversa serve para avaliar a aderência e definir o próximo passo.
```

## CTA

```text
Apresentar um desafio
```

Destino:

```text
/contato
```

## Microcopy

```text
Sem compromisso · Retorno em até um dia útil
```

Não prometer o mesmo resultado do case.

---

# 33. Template de case no CMS ou fonte de dados

Usar estrutura equivalente:

```ts
interface CaseStudy {
  id: string;
  slug: string;
  publicationStatus: "draft" | "review" | "published" | "archived";
  confidentiality: Confidentiality;

  title: string;
  eyebrow: string;
  subtitle: string;

  organizationLabel: string;
  sector?: string;
  periodLabel?: string;

  executiveSummary: string[];
  context: RichText;
  challenge: RichText;
  constraints: RichText;
  role: RichText;
  approach: RichText;
  solution: RichText;
  implementation: RichText;
  results: CaseResult[];
  measurementMethod?: RichText;
  limitations: RichText;

  serviceIds: string[];
  evidenceIds: string[];

  heroImage?: MediaReference;
  diagram?: MediaReference;

  seoTitle: string;
  seoDescription: string;
  canonicalUrl: string;

  approvedBy?: string;
  approvedAt?: string;
  lastReviewedAt: string;
}
```

Resultado:

```ts
interface CaseResult {
  id: string;
  evidenceId: string;
  displayValue?: string;
  label: string;
  explanation: string;
}
```

---

# 34. Processo editorial de publicação

## 34.1. Etapa 1 — Registro

Criar o registro de evidência.

## 34.2. Etapa 2 — Coleta

Anexar ou referenciar:

- dashboards;
- relatórios;
- documentos;
- tickets;
- certificados;
- autorizações;
- fontes públicas.

Não armazenar segredos.

## 34.3. Etapa 3 — Validação factual

Confirmar:

- datas;
- papel;
- números;
- fórmula;
- contexto;
- nomenclatura;
- fontes.

## 34.4. Etapa 4 — Confidencialidade

Classificar e sanitizar.

## 34.5. Etapa 5 — Redação

Escrever apenas dentro do escopo aprovado.

## 34.6. Etapa 6 — Revisão técnica

Verificar se:

- solução está corretamente descrita;
- termos técnicos são precisos;
- não há inferências indevidas;
- limitações foram preservadas.

## 34.7. Etapa 7 — Aprovação

Registrar aprovação.

## 34.8. Etapa 8 — Publicação

Publicar somente quando todos os gates estiverem satisfeitos.

## 34.9. Etapa 9 — Revisão periódica

Revisar:

- links;
- certificações;
- status;
- autorização;
- relevância;
- precisão;
- canonical;
- componentes relacionados.

---

# 35. Bloqueios automáticos de produção

O build de produção deverá falhar quando ocorrer qualquer um destes casos:

1. `ResultCard` sem `evidenceId`.
2. Evidência de métrica não aprovada.
3. Evidência classificada como `internal`, `restricted` ou `prohibited`.
4. Métrica sem baseline.
5. Métrica sem valor final.
6. Métrica sem fórmula.
7. Métrica sem período.
8. Métrica sem fonte.
9. Case publicado com evidência não aprovada.
10. Case publicado sem data de revisão.
11. Certificação publicada sem registro.
12. Logo de cliente sem aprovação registrada.
13. Depoimento sem autorização.
14. Texto público contendo marcador interno.
15. Conteúdo com `[TESTE]` em produção.
16. Conteúdo com `TODO`, `PLACEHOLDER` ou `LOREM IPSUM`.
17. Status `draft` ou `awaiting_evidence` em componente público.
18. Rota de case publicada sem canonical.
19. Case com métrica sem seção de método de medição.
20. Evidência com `validUntil` vencido e sem revisão.

---

# 36. Validação de conteúdo por lint

Criar validações ou testes para detectar em conteúdo público:

```text
garantido
```

```text
zero falhas
```

```text
100% seguro
```

```text
sem risco
```

```text
qualquer empresa
```

```text
qualquer sistema
```

```text
resultado garantido
```

```text
diagnóstico gratuito
```

```text
resposta em até 2h
```

A ocorrência não precisa falhar sempre, caso o termo esteja sendo criticado ou citado em documentação interna.

A validação deve considerar somente campos públicos ou exigir allowlist explícita.

---

# 37. Acessibilidade das métricas

## 37.1. Sinal visual

Não depender apenas de:

- verde;
- vermelho;
- seta;
- sinal de mais;
- sinal de menos.

## 37.2. Texto acessível

Para:

```text
-40%
```

o leitor de tela deve receber contexto equivalente a:

```text
Redução de 40 por cento no custo mensal de infraestrutura
```

Para:

```text
+40%
```

usar:

```text
Aumento de 40 por cento no throughput
```

com a métrica real.

## 37.3. HTML

É permitido usar:

```html
<data value="-40">-40%</data>
```

desde que o contexto textual esteja próximo.

## 37.4. Cards

- título claro;
- valor não isolado;
- ordem de leitura coerente;
- link descritivo;
- foco visível;
- não colocar conteúdo essencial em tooltip;
- não animar contagem sem respeitar movimento reduzido.

---

# 38. Responsividade dos componentes de prova

## 38.1. Resultados

Desktop:

- até duas colunas, conforme Home aprovada.

Tablet:

- duas ou uma conforme largura.

Mobile:

- uma coluna;
- número sem corte;
- contexto completo;
- tags com quebra.

## 38.2. Certificações

- texto deve quebrar;
- badges não podem reduzir o nome;
- mobile em uma coluna;
- link de credencial com área adequada;
- sem carrossel.

## 38.3. Case cards

Desktop:

- duas ou três colunas, dependendo da largura e quantidade.

Mobile:

- uma coluna;
- sem resumo truncado por altura;
- imagem com proporção consistente;
- sem hover obrigatório.

## 38.4. Página do case

- conteúdo principal em coluna legível;
- tabelas devem possuir alternativa mobile;
- diagramas devem permitir leitura ou descrição;
- métricas sem overflow;
- headings com quebra;
- nenhuma largura fixa.

---

# 39. SEO de estudos de caso

## 39.1. Title

Formato:

```text
[Título do caso] | Marcelo Gonçalves
```

## 39.2. Description

Descrever:

- contexto;
- solução;
- resultado aprovado.

Não incluir métrica não validada.

## 39.3. Canonical

Cada case possui canonical único.

## 39.4. Sitemap

Incluir somente:

```text
publicationStatus === "published"
```

## 39.5. Dados estruturados

Se o projeto já utiliza JSON-LD, usar tipo compatível como:

```text
Article
```

ou:

```text
TechArticle
```

quando o conteúdo for técnico.

Não inventar tipo não suportado.

É permitido incluir:

- headline;
- description;
- author;
- datePublished;
- dateModified;
- mainEntityOfPage;
- image, se existir;
- publisher, se configurado corretamente.

Não incluir:

- aggregateRating;
- review;
- offers;
- clientes;
- métricas como prêmio;
- autorizações internas.

---

# 40. Imagens e diagramas

## 40.1. Regra geral

Não usar screenshots de ambientes reais sem:

- autorização;
- sanitização;
- revisão;
- remoção de dados;
- validação em resolução alta;
- verificação de metadados.

## 40.2. Diagrama

Preferir diagrama abstrato e reconstruído.

Remover:

- nomes de contas;
- IDs;
- ARNs;
- IPs;
- endpoints;
- nomes internos;
- regiões sensíveis;
- volumes;
- credenciais;
- segredos;
- tickets;
- nomes de pessoas.

## 40.3. Alt text

Descrever a função.

Exemplo:

```text
Fluxo simplificado entre o portal, o serviço de automação e o ERP
```

Não repetir todo o conteúdo textual.

## 40.4. Imagem genérica

Não adicionar imagens de banco apenas para preencher a página.

---

# 41. Textos institucionais aprovados

## 41.1. Trajetória curta

```text
Mais de dez anos de experiência em tecnologia, com atuação em projetos no Brasil e na Alemanha.
```

Usar somente após validar a linha do tempo.

## 41.2. Liderança

```text
Marcelo Gonçalves participa diretamente do entendimento do problema, da definição da solução e das principais decisões técnicas.
```

## 41.3. Contexto corporativo

```text
Experiência em ambientes corporativos que exigem segurança, confiabilidade, automação e clareza operacional.
```

## 41.4. Certificações

```text
Certificações em arquitetura e operação AWS, infraestrutura como código e observabilidade complementam a experiência prática.
```

## 41.5. Resultados

```text
Os resultados são publicados somente quando contexto, método de medição e autorização permitem uma apresentação responsável.
```

## 41.6. Limitação

```text
Os resultados variam conforme o contexto, o escopo e as condições de cada projeto.
```

---

# 42. Textos proibidos

Não publicar:

- “empresas que confiam em nós”, sem clientes autorizados;
- “nossos clientes”, para empregadores anteriores;
- “projetos reconhecidos”, sem reconhecimento identificável;
- “resultados comprovados”, sem registro;
- “milhões economizados”, sem evidência;
- “centenas de projetos”, sem contagem;
- “especialista premiado”, sem prêmio;
- “líder do mercado”;
- “referência internacional”;
- “parceiro AWS”, sem status;
- “certificado em todas as principais tecnologias”;
- “mais de dez anos em AWS”, sem evidência;
- “disponibilidade garantida”;
- “redução garantida de custo”;
- “100% de sucesso”;
- “sem incidentes”;
- “zero downtime”;
- “100% seguro”.

---

# 43. Relação com o currículo e LinkedIn

## 43.1. Fonte

O currículo pode ser fonte para:

- trajetória;
- cargos;
- datas;
- certificações;
- projetos;
- competências.

## 43.2. Não copiar integralmente

O site não deve reproduzir:

- descrições extensas de cargos;
- lista de responsabilidades;
- todas as ferramentas;
- cronologia completa.

## 43.3. Coerência

Datas e títulos no site, currículo e LinkedIn devem ser coerentes.

Antes da produção, revisar:

- início da carreira;
- período na Alemanha;
- cargo atual;
- certificações;
- nomenclatura profissional;
- número de anos.

## 43.4. Divergência

Quando houver divergência:

- não escolher a versão mais favorável;
- confirmar a fonte;
- corrigir todas as superfícies;
- atualizar o registro de evidência.

---

# 44. Ordem de implementação

Executar nesta ordem:

1. Mapear todas as afirmações de autoridade atuais.
2. Mapear todas as métricas atuais.
3. Mapear certificações.
4. Mapear nomes de clientes, empregadores e projetos.
5. Criar o Registro de Evidências.
6. Criar os tipos e validações.
7. Migrar fatos da página Sobre.
8. Migrar métricas da Home.
9. Definir quais registros podem ser publicados.
10. Bloquear os demais em produção.
11. Atualizar componentes.
12. Adicionar nota de variação.
13. Criar testes.
14. Revisar conteúdo do blog que utiliza casos.
15. Validar metadados.
16. Validar responsividade.
17. Validar acessibilidade.
18. Executar lint.
19. Executar testes.
20. Executar build.
21. Revisar manualmente cada afirmação publicada.
22. Registrar pendências de evidência.

---

# 45. Inventário inicial obrigatório

Criar uma planilha, JSON interno ou documento com ao menos estes itens:

## 45.1. Trajetória

- 10+ anos em tecnologia;
- Brasil;
- Alemanha;
- equipes distribuídas;
- ambientes corporativos;
- liderança técnica;
- fundador.

## 45.2. Certificações

- AWS Solutions Architect – Associate;
- AWS SysOps Administrator – Associate;
- AWS Cloud Practitioner;
- Terraform Associate;
- Splunk Power User.

## 45.3. Resultados atuais

- 40% de redução de custo;
- 60% de redução de custo operacional;
- 40% de aumento de performance;
- 70% de redução do ciclo de aprovação;
- 85% de redução do fechamento financeiro.

## 45.4. Projetos candidatos

- iniciativa de redução de chaves de acesso;
- migração de aplicações;
- plataformas ECS e EKS;
- infraestrutura como código;
- CI/CD;
- observabilidade;
- recuperação de desastres;
- automação de processos;
- plataforma editorial;
- outros projetos aprovados.

A inclusão no inventário não autoriza publicação.

---

# 46. Testes obrigatórios

## 46.1. Registro

Testar:

- IDs únicos;
- estados válidos;
- classificação válida;
- fonte presente;
- campos obrigatórios;
- datas válidas;
- evidências relacionadas existentes.

## 46.2. Métricas

Testar:

- baseline;
- final;
- fórmula;
- direção;
- período;
- fonte;
- status;
- autorização;
- arredondamento;
- rótulo.

## 46.3. Produção

Validar que produção não contém:

```text
Dado de desenvolvimento
```

```text
awaiting_evidence
```

```text
draft
```

```text
[TESTE]
```

```text
PLACEHOLDER
```

```text
TODO
```

## 46.4. Clientes

Validar que todo logo ou nome público possui registro aprovado.

## 46.5. Certificações

Validar:

- nome;
- emissor;
- status;
- link;
- evidência.

## 46.6. Cases

Validar:

- status publicado;
- evidências;
- canonical;
- metadados;
- método de medição, se houver métrica;
- links;
- datas;
- serviços relacionados.

## 46.7. Responsividade

Validar:

- 360px;
- 390px;
- 768px;
- 1024px;
- 1366px;
- 1440px;
- zoom de 200%.

## 46.8. Acessibilidade

Validar:

- leitura da métrica;
- foco;
- links;
- imagens;
- headings;
- movimento reduzido;
- contraste.

---

# 47. Critérios de aceite

A implementação será aceita somente quando:

1. Toda métrica publicada possuir evidência registrada.
2. Toda métrica possuir método de medição.
3. Toda prova possuir classificação de confidencialidade.
4. Nenhum dado não aprovado aparecer em produção.
5. “Performance” não for utilizada como métrica sem definição.
6. Os quatro resultados atuais estiverem validados ou bloqueados.
7. Certificações tiverem nomes e estados revisados.
8. Não houver logos não autorizados.
9. Não houver clientes inventados.
10. Não houver depoimentos inventados.
11. Trajetória estiver coerente com currículo e LinkedIn.
12. Home mantiver sua estrutura aprovada.
13. Sobre mantiver sua estrutura aprovada.
14. Páginas de serviço não ganharem cases sem especificação adicional.
15. Exemplos ilustrativos estiverem rotulados.
16. Cases futuros possuírem estrutura completa.
17. Métricas forem acessíveis.
18. Componentes funcionarem em mobile.
19. Build falhar diante de conteúdo proibido.
20. Lint, testes e build terminarem sem erros.
21. A plataforma não utilizar superlativos sem evidência.
22. A autoridade for construída por trajetória, credenciais, execução e resultados, e não apenas por ferramentas.

---

# 48. Checklist final de revisão humana

- [ ] Registro de Evidências criado.
- [ ] Estados implementados.
- [ ] Confidencialidade implementada.
- [ ] Fontes referenciadas.
- [ ] 10+ anos validados.
- [ ] Brasil e Alemanha validados.
- [ ] Liderança validada.
- [ ] Certificações revisadas.
- [ ] Status das certificações revisado.
- [ ] Logos não autorizados ausentes.
- [ ] Clientes não autorizados ausentes.
- [ ] Métrica de custo de 40% revisada.
- [ ] Métrica de custo operacional de 60% definida.
- [ ] Métrica de performance de 40% substituída por métrica específica.
- [ ] Métrica de aprovação de 70% revisada.
- [ ] Métrica de fechamento de 85% revisada.
- [ ] Resultados não verificados bloqueados.
- [ ] Nota de variação presente.
- [ ] Cards acessíveis.
- [ ] Sem números fictícios.
- [ ] Sem depoimentos fictícios.
- [ ] Sem badges recriados.
- [ ] Sem “projetos reais” quando não aplicável.
- [ ] Exemplos ilustrativos rotulados.
- [ ] Critérios para `/casos` respeitados.
- [ ] Template de case implementável.
- [ ] Canonical previsto.
- [ ] Sitemap previsto.
- [ ] Testes de produção implementados.
- [ ] Sem `[TESTE]`.
- [ ] Sem `TODO`.
- [ ] Sem `PLACEHOLDER`.
- [ ] Mobile validado.
- [ ] Zoom 200% validado.
- [ ] Acessibilidade validada.
- [ ] Lint concluído.
- [ ] Testes concluídos.
- [ ] Build concluído.

---

# 49. Resultado esperado

Ao final, a plataforma deverá comunicar autoridade de forma precisa:

> A consultoria é liderada por um profissional com trajetória documentada, certificações relevantes, experiência prática em ambientes corporativos e resultados publicados somente quando existem evidência, contexto e autorização.

O visitante deverá conseguir distinguir:

- experiência;
- credencial;
- projeto;
- resultado;
- exemplo;
- opinião;
- conteúdo técnico.

Nenhum número deverá depender apenas de confiança no texto.

Nenhum nome deverá depender de uma autorização presumida.

Nenhum estudo de caso deverá esconder como o resultado foi medido.

A plataforma deverá parecer mais confiável justamente porque evita exageros e mostra o contexto necessário para interpretar cada prova.
