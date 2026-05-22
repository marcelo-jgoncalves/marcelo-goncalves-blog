# Active Investigations — Rastreamento em Tempo Real

Arquivo para rastrear investigações em progresso. Ajuda a manter continuidade de uma tentativa para outra.

---

## 🔍 Investigação Ativa: Eyebrow Gradient em NewsletterWidget

**Status:** ❓ Incompleto — Problema não resolvido  
**Iniciado:** 2026-05-22  
**Última Tentativa:** #1  
**Próximo Passo:** Investigar diferença estrutural profunda entre widgets

### Modelo Mental Atual

**O Que FUNCIONA:**
- ProjetoWidget mostra eyebrow gradient fade (branco → transparente)
- CSS está idêntico entre os dois (verificado via computed styles)
- Componentes renderizam ambos em flex containers

**O Que NÃO FUNCIONA:**
- NewsletterWidget NOT mostra o fade effect visualmente
- Apesar de computed styles idênticos
- HTML estrutura é praticamente igual

**Dado Concreto:**
```
Debug output (eyebrow-result.json):
- Newsletter ::before: background = linear-gradient(90deg, rgb(255, 255, 255), rgb(255, 255, 255) 50%, rgba(0, 0, 0, 0))
- Projeto ::before: background = linear-gradient(90deg, rgb(255, 255, 255), rgb(255, 255, 255) 50%, rgba(0, 0, 0, 0))
✓ Idêntico no computed style
❌ Visualmente diferente

Tentativa #1 resultado:
- Remover text-align: center NÃO funcionou
- Descoberta: ::before blob com filter: blur(60px) havia sido removido
- Restaurado blob, problema ainda persiste
```

### Modelo Mental em Evolução

**Suposições Testadas:**
1. ❌ text-align: center interferia → Não era o problema
2. ❌ Blob decorativo afetava z-index → Restaurado, problema persiste

**Suposições NÃO Testadas:**
- [ ] Sub-pixel rendering difere entre contextos
- [ ] Filter ou blend-mode de elemento pai afeta pseudo-element
- [ ] Stacking context diferente entre sidebar e footer
- [ ] Renderização hardware accelerated diferente
- [ ] Anti-aliasing aplica-se diferentemente

### Próxima Tentativa (#2)

**Investigação Necessária:**
- [ ] Verificar ALL computed styles de elementos pais em ambos contextos
- [ ] Comparar position, display, overflow, filter, transform, blend-mode
- [ ] Verificar z-index e stacking context de cada parent chain
- [ ] Testar: aumentar height de 1px para 2px (visibilidade)
- [ ] Testar: mudar gradient para cor sólida (isolate gradient issue)

**Hipótese a Testar:**
- Diferença está não no CSS do eyebrow/::before
- Mas no contexto de renderização do parent container
- Newsletter está em contexto que afeta pseudo-element rendering de forma diferente

---

## 📋 Template Para Próxima Tentativa

Antes de agir novamente, preencher:

```markdown
### Tentativa #[N]

ANTES DE AGIR:
- Estado atual do problema: [resumo]
- Meu modelo mental: [o que acho que é]
- Hipótese: [se X então Y]
- Mudança mínima: [exatamente o quê]
- Teste: [como verificar]

DEPOIS DE AGIR:
- Resultado: [funcionou/não funcionou]
- Diferença vs esperado: [qual foi]

APRENDIZADO:
- Modelo mental atualizado: [mudou o quê]
- Por que falhou: [qual era suposição errada]
- Próxima hipótese: [baseado no novo dado]
```

---

## Regras Para Esta Investigação

1. **Uma mudança por tentativa** — Nunca múltiplas mudanças
2. **Testar após cada mudança** — Antes de próxima ação
3. **Preencher template** — Obrigatório antes de seguir
4. **Incrementar certeza** — Cada tentativa deveria aumentar confiança em hipótese
5. **Se certeza cai** — Parar agir, investigar dados mais
6. **Sem reset/revert** — Exceto como último recurso, após análise completa

---

## Histórico de Tentativas

### ✅ Tentativa #1: Remove text-align: center
- **Data:** 2026-05-22
- **Resultado:** ❌ Não funcionou
- **Aprendizado:** Descobriu que blob ::before havia sido removido. Restaurado.
- **Impacto:** Removeu uma pista vermelha falsa, descobriu asset faltante
- **Modelo mental depois:** Problema não é CSS simples, é algo mais profundo

### ⏳ Tentativa #2: [Próxima]
- **Data:** [quando executar]
- **Hipótese:** [qual]
- **Resultado:** [depois de testar]
- **Aprendizado:** [depois de agir]
