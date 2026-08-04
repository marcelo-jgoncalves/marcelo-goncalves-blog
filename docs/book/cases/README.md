# Cases

Armazena estudos de caso históricos com valor pedagógico, como:

- hipóteses refutadas;
- erros ou limitações da IA;
- decisões humanas relevantes;
- testes que não provavam o comportamento pretendido;
- divergências entre mocks e serviços reais;
- controles de segurança ineficazes;
- mudanças importantes no modelo mental;
- decisões conscientes de não implementar.

Esses arquivos serão históricos e não deverão ser interpretados como descrição canônica do estado atual do sistema.

## Organização dos arquivos

Cada caso é um arquivo `CASE-NNN-slug-descritivo.md` diretamente nesta pasta, a partir de `templates/case-template.md`.

Quando um caso exigir evidência extensa de antes e depois (vários arquivos, muitos exemplos, tabela de migração longa, diff com alto valor pedagógico), o pacote de evidências vive em um subdiretório próprio:

```text
docs/book/cases/evidence/CASE-NNN/
  before-after.md
  migration-table.md
  <nome-descritivo>.patch
```

Esse subdiretório é opcional e criado sob demanda — não existe um por padrão para cada caso, e um diretório vazio nunca deve ser criado. As regras completas sobre quando criar cada arquivo e como preservar evidência de antes e depois estão em `docs/book/capture-protocol.md`, seção "Evidência de antes e depois" — não duplicadas aqui.

Os protocolos detalhados serão definidos em uma etapa posterior.
