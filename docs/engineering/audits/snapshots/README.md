# Snapshots

Snapshots de notas (YAML) gerados pela auditoria de consistência do projeto (`/project-consistency-audit`), usados para comparação entre execuções (modo `delta`).

Organizados por ano: `YYYY/<data>-<modo>-scores.yaml` (ex.: `2026/2026-08-04-full-scores.yaml`). Cada arquivo é uma execução datada, nunca reescrita depois de criada. Estrutura a partir de `../templates/scores-template.yaml`.

Um snapshot é a fotografia de notas e evidências de uma execução específica — não é state operacional atual, e não deve ser copiado ou reconstruído de memória. Comparações entre snapshots com `weights_version` diferentes devem declarar a mudança de metodologia em vez de comparar números diretamente. Fonte canônica das regras: `../project-consistency-audit.md`.
