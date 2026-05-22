# Investigation Template — Trabalho Incremental com Reflexão

Use este template TODA VEZ que investigar um problema. Preencha ANTES de agir, DEPOIS de testar.

---

## Tentativa #[N]

### 📋 ANTES DE AGIR

**Estado Atual do Problema:**
- Descrição concisa do que não funciona
- O que funciona vs o que não funciona
- Dados concretos observados

**Meu Modelo Mental ATUAL:**
- O que EU ACHO que é o problema
- Por que EU ACHO que é assim
- Quais são as diferenças reais entre os dois casos

**Hipótese desta Tentativa:**
- Se eu fizer X, então Y acontecerá
- Baseado em qual dado concreto?
- Qual é meu nível de certeza (0-100%)?

**Escopo da Mudança:**
- Qual é EXATAMENTE a mudança que vou fazer?
- Qual arquivo(s)?
- Qual é a mudança MÍNIMA possível?

**Como Testar:**
- Qual será meu critério de sucesso?
- Como vou verificar se funcionou?
- Qual é o resultado esperado?

---

### ⚙️ DEPOIS DE AGIR

**O Que Realmente Aconteceu:**
- A mudança foi feita? (sim/não)
- Compila? (sim/não)
- O teste passou? (sim/não/n/a)
- Qual foi o resultado visual/técnico?

**Resultado vs Hipótese:**
- ✅ Funcionou como esperado?
- ❌ Não funcionou. Como foi diferente?
- 🤷 Resultado inesperado. Como?

---

### 🧠 RECONSTRUIR MODELO MENTAL

**O Que Aprendi:**
- Minha hipótese estava certa ou errada?
- Se errada: qual era a suposição errada?
- Que dado concreto novo descobri?

**Modelo Mental ATUALIZADO:**
- Antes eu achava: [X]
- Agora sei que: [Y]
- A diferença entre os dois casos é: [Z]

**Por Que Falhou (se falhou):**
- Qual era minha suposição errada?
- Qual é o dado concreto que mostra isso?
- Isso muda meu entendimento do problema?

---

### 🎯 PRÓXIMA TENTATIVA

**Nova Hipótese (baseada no que aprendi):**
- Se eu fizer X [NOVO], então Y [NOVO] acontecerá
- Por que? [baseado nos dados que aprendi]
- Nível de certeza: [0-100%]

**OU: Devo parar de agir e investigar mais?**
- Sim, porque...
- Preciso entender melhor: [X]
- Preciso ver dados sobre: [Y]

---

## Exemplo Preenchido

### Tentativa #1

**ANTES:**
- Problema: Eyebrow gradient não aparece em NewsletterWidget
- Funciona: ProjetoWidget ✅
- Não funciona: NewsletterWidget ❌
- Dados: computed styles idênticos, mas visualmente diferentes

Modelo Mental ATUAL:
- Acho que é CSS que está interferindo
- text-align: center talvez?
- Certeza: 30%

Hipótese:
- Se remover text-align: center, o gradient aparecerá
- Baseado em: observação que ProjetoWidget não tem text-align

Escopo:
- Remover text-align: center de .widget-newsletter
- 1 arquivo, 1 propriedade

Teste:
- Visualmente no browser
- Eyebrow gradient deve aparecer em ambos widgets

**DEPOIS:**
- Mudança feita? SIM
- Funcionou? NÃO

Aprendizado:
- Minha hipótese estava ERRADA
- text-align: center não era o problema
- Descobri: havia um ::before com filter: blur(60px) que foi removido acidentalmente

Modelo Mental ATUALIZADO:
- Antes: text-align era o culpado
- Agora: o blob decorativo (::before com filter) é mais importante
- Diferença real: um widget tinha o blob, outro não

Nova Hipótese:
- Se restaurar o ::before com filter, o widget voltará ao estado original
- Depois investigar POR QUÊ o gradient ainda não aparece mesmo com CSS idêntico
- Certeza: 85%

---

## Regras Obrigatórias

✅ **SEMPRE** preencher antes de agir  
✅ **SEMPRE** preencher depois de testar  
✅ **SEMPRE** reconstruir modelo mental  
✅ **SEMPRE** fazer próxima tentativa baseada no que aprendi  
✅ Se hipótese estava errada → PARAR e investigar mais ANTES de próxima ação  
✅ Se não tenho dado concreto → BUSCAR dado concreto antes de agir  

❌ **NUNCA** fazer múltiplas mudanças simultaneamente  
❌ **NUNCA** fazer ação destrutiva (reset, revert) sem preencher isso  
❌ **NUNCA** ignorar "não funcionou" e tentar algo novo sem entender por que falhou  
❌ **NUNCA** confiar em suposição quando tenho dúvida
