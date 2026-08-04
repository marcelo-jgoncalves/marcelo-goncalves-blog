# Visão do produto

## Problema

Consultoria em tecnologia (IA, AWS, DevOps) precisa de presença institucional própria que gere leads qualificados, além de um canal de autoridade técnica que sustente essa credibilidade ao longo do tempo.

## Público

Empresas e times técnicos avaliando consultoria em IA aplicada, AWS e DevOps; leitores técnicos interessados em conteúdo de engenharia sobre o mesmo domínio.

## Proposta de valor

Site institucional (`/`) apresenta a consultoria — hero, serviços, metodologia, resultados, CTA — com um blog de autoridade técnica (`/blog`) como subseção, monetizado também via AdSense. `/contato` concentra a conversão via formulário de diagnóstico.

## Objetivos

- Gerar leads qualificados de consultoria via `/contato`.
- Estabelecer autoridade técnica através do blog e das páginas de pilar (Automação & Integração, Cloud & DevOps, Inteligência Artificial Aplicada, Sistemas & Plataformas Digitais).
- Manter o blog como fonte de receita de AdSense e canal de descoberta orgânica (SEO).

## Não objetivos

- Não é uma plataforma de e-commerce ou SaaS com usuários finais pagantes.
- Não tem múltiplos autores/administradores — é uma plataforma de admin único (ver `docs/engineering/decisions/`, quando um ADR formal existir para essa decisão).
- Não compete por comentários/comunidade — não há sistema de comentários (ver roadmap para features futuras avaliadas e não construídas).

## Histórico

Pivô estrutural na sessão 42 do projeto: a Home (`/`) deixou de ser o blog e passou a ser institucional; o blog anterior migrou para `/blog`; `/contato` foi criada com formulário de diagnóstico. Detalhe histórico completo vive no Git, não neste documento.
