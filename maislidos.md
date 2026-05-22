# GERAÇÃO EXATA DO NÚMERO “04”

O número “04” é um elemento gráfico editorial.
Ele NÃO deve ser tratado como texto comum.

Ele deve parecer:
- uma marca d’água sofisticada
- tipografia editorial premium
- um elemento visual de composição
- um detalhe gráfico elegante

O “04” deve transmitir:
- refinamento
- precisão tipográfica
- luxo minimalista
- sofisticação atmosférica

---

# PROBLEMA QUE PRECISA SER EVITADO

O “04” NÃO pode apresentar:

- overlap entre o “0” e o “4”
- linhas cruzando
- stroke acumulado
- caracteres colidindo
- distorção
- artefatos de renderização
- aparência quebrada
- aspecto borrado
- deformação do “4”
- interseção entre os strokes

O “04” precisa parecer:
- limpo
- perfeitamente espaçado
- geometricamente equilibrado
- extremamente legível

---

# O “04” NÃO DEVE SER GERADO COMO TEXTO NORMAL

NÃO usar:
- tracking agressivo
- kerning automático da fonte
- stroke grosso
- largura comprimida
- container estreito
- line-height padrão
- renderização padrão do navegador

O número precisa de:
- espaço horizontal dedicado
- renderização geométrica precisa
- alinhamento controlado
- stroke fino
- spacing cuidadosamente calibrado

---

# ESTRUTURA HTML OBRIGATÓRIA

USAR EXATAMENTE ESTA ESTRUTURA:

\`\`\`html
<div class="number-wrap">
  <div class="number">04</div>
</div>
\`\`\`

NÃO remover:
- o wrapper
- o container próprio do número

O wrapper é obrigatório para:
- impedir compressão horizontal
- impedir colisão visual
- controlar alinhamento
- controlar renderização

---

# WRAPPER DO NÚMERO

USAR EXATAMENTE:

\`\`\`css
.number-wrap{

width:92px;

min-width:92px;

display:flex;

align-items:flex-start;

justify-content:flex-start;

position:relative;

overflow:visible;

flex-shrink:0;
}
\`\`\`

---

# A LARGURA DO WRAPPER É CRÍTICA

O “04” PRECISA respirar.

NÃO usar:
- 70px
- 74px
- 80px
- auto
- fit-content

Porque isso:
- comprime os caracteres
- aproxima o “0” do “4”
- causa overlap no stroke
- destrói a composição editorial

A largura correta é:

\`\`\`css
width:92px;
\`\`\`

---

# CSS EXATO DO NÚMERO

USAR EXATAMENTE:

\`\`\`css
.number{

font-size:64px;

font-weight:800;

line-height:.88;

/* CRÍTICO */
letter-spacing:-.08em;

/* CRÍTICO */
font-variant-numeric: tabular-nums;

/* CRÍTICO */
font-feature-settings:"tnum";

/* CRÍTICO */
white-space:nowrap;

/* CRÍTICO */
text-rendering:geometricPrecision;

/* CRÍTICO */
display:block;

/* CRÍTICO */
transform:translateZ(0);

color:transparent;

/* CRÍTICO */
-webkit-text-stroke:
1.5px rgba(28,53,80,.12);

transition:
all .45s cubic-bezier(.22,1,.36,1);
}
\`\`\`

---

# O TRACKING É A PARTE MAIS IMPORTANTE

O valor EXATO deve ser:

\`\`\`css
letter-spacing:-.08em;
\`\`\`

NÃO usar:
- -0.10em
- -0.12em
- -0.14em

Esses valores:
- fazem o “4” invadir o “0”
- criam colisão entre strokes
- geram linhas sobrepostas
- criam aspecto quebrado

---

# O STROKE PRECISA SER FINO

USAR EXATAMENTE:

\`\`\`css
-webkit-text-stroke:
1.5px rgba(28,53,80,.12);
\`\`\`

NÃO usar:
- 2px
- 2.5px
- opacity maior
- stroke escuro

Stroke pesado:
- cria overlap
- destrói a legibilidade
- gera acúmulo visual

---

# O “4” PRECISA PERMANECER TOTALMENTE ABERTO

O caractere “4” deve:
- manter a abertura interna limpa
- permanecer geometricamente legível
- não tocar no “0”
- manter o triângulo interno visível

O stroke NÃO pode:
- fechar a abertura
- engrossar demais
- colidir com o “0”

---

# O “0” PRECISA RESPIRAR

O “0” deve:
- permanecer perfeitamente oval
- manter espaço interno limpo
- não encostar no “4”
- parecer leve

O “0” NÃO pode:
- deformar
- parecer esmagado
- parecer comprimido

---

# COMPORTAMENTO VISUAL CORRETO

O “04” deve parecer:

- um watermark editorial premium
- uma composição tipográfica refinada
- um detalhe de design cuidadosamente calibrado

Visualmente ele deve transmitir:

- sofisticação
- precisão
- luxo minimalista
- profundidade elegante

---

# COMPORTAMENTO INCORRETO

O “04” NÃO pode parecer:

- bugado
- quebrado
- comprimido
- sobreposto
- borrado
- deformado
- glitchado
- com stroke duplicado

---

# HOVER DO “04”

Durante hover:

\`\`\`css
transform:scale(1.04);

opacity:.92;
\`\`\`

IMPORTANTE:
- o hover NÃO pode alterar spacing
- NÃO pode alterar tracking
- NÃO pode alterar width
- NÃO pode alterar kerning

O hover deve:
- apenas ampliar suavemente
- manter geometria perfeita

---

# RESULTADO FINAL OBRIGATÓRIO

O “04” deve parecer:

- perfeitamente equilibrado
- limpo
- sofisticado
- editorial
- premium
- geométrico
- extremamente refinado

Sem QUALQUER:
- overlap
- interseção
- colisão
- artefato visual
- deformação tipográfica