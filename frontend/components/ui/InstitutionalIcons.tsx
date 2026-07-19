/* frontend/components/ui/InstitutionalIcons.tsx
   Ícones inline reutilizados nas páginas institucionais (Home, Contato) —
   specs/ESPECIFICACAO-HOME.md §8.2, ESPECIFICACAO-CONTATO.md §9.3/§10.2 */

const common = {
  width: 22,
  height: 22,
  viewBox: '0 0 24 24',
  fill: 'none' as const,
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
};

export function IconCycle() {
  return (
    <svg {...common}>
      <path d="M4 12a8 8 0 0 1 14-5" />
      <path d="M20 12a8 8 0 0 1-14 5" />
      <path d="M18 3v4h-4" />
      <path d="M6 21v-4h4" />
    </svg>
  );
}

export function IconBolt() {
  return (
    <svg {...common}>
      <path d="M13 3 5 13h6l-1 8 8-10h-6z" />
    </svg>
  );
}

export function IconCloud() {
  return (
    <svg {...common}>
      <path d="M7 18a4 4 0 0 1 0-8 5.5 5.5 0 0 1 10.6 1.5A3.5 3.5 0 0 1 17 18z" />
    </svg>
  );
}

export function IconChip() {
  return (
    <svg {...common}>
      <rect x="7" y="7" width="10" height="10" rx="2" />
      <path d="M9 3v2M15 3v2M9 19v2M15 19v2M3 9h2M3 15h2M19 9h2M19 15h2" />
    </svg>
  );
}

export function IconChart() {
  return (
    <svg {...common}>
      <path d="M3 17l6-6 4 4 8-8" />
      <path d="M21 7v5h-5" />
    </svg>
  );
}

export function IconCube() {
  return (
    <svg {...common}>
      <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z" />
      <path d="M12 3v9M4 7.5l8 4.5 8-4.5" />
    </svg>
  );
}

export function IconLayers() {
  return (
    <svg {...common}>
      <path d="M12 3 3 8l9 5 9-5-9-5z" />
      <path d="M3 13l9 5 9-5" />
    </svg>
  );
}

export function IconEnvelope() {
  return (
    <svg {...common}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

export function IconLinkedin() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.4c0-1.3 0-2.96-1.8-2.96s-2.08 1.4-2.08 2.86V21H9z" />
    </svg>
  );
}

export function IconGithub() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

export function IconInstagram() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconPin() {
  return (
    <svg {...common}>
      <path d="M12 21s-7-6.1-7-11a7 7 0 0 1 14 0c0 4.9-7 11-7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

/* Ícones dos cards "O que fazemos" — specs/ESPECIFICACAO-ENGENHARIA-SOFTWARE.md §7 (26×26 dentro do selo de 54×54) */
const cardIcon = { ...common, width: 26, height: 26 };

export function IconSistemasSobMedida() {
  return (
    <svg {...cardIcon}>
      <path d="M12 2 2 7l10 5 10-5-10-5z" />
      <path d="m2 17 10 5 10-5" />
      <path d="m2 12 10 5 10-5" />
    </svg>
  );
}

export function IconApisIntegracoes() {
  return (
    <svg {...cardIcon}>
      <path d="M9 17H7a5 5 0 0 1 0-10h2" />
      <path d="M15 7h2a5 5 0 0 1 0 10h-2" />
      <path d="M8 12h8" />
    </svg>
  );
}

export function IconArquiteturaSoftware() {
  return (
    <svg {...cardIcon}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18M9 21V9" />
    </svg>
  );
}

export function IconModernizacaoSistemas() {
  return (
    <svg {...cardIcon}>
      <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
      <path d="M3 21v-5h5" />
    </svg>
  );
}

export function IconEngenhariaQualidade() {
  return (
    <svg {...cardIcon}>
      <rect x="5" y="4" width="14" height="17" rx="2" />
      <path d="M9 4h6v3H9z" />
      <path d="m9 13 2 2 4-4" />
    </svg>
  );
}

export function IconSustentacaoEvolucao() {
  return (
    <svg {...cardIcon}>
      <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.8 2.8-2-2z" />
    </svg>
  );
}

/* Ícones dos cards "O que fazemos" — specs/ESPECIFICACAO-CLOUD-DEVOPS.md §7 */
export function IconArquiteturaNuvem() {
  return (
    <svg {...cardIcon}>
      <path d="M17.5 19a4.5 4.5 0 0 0 .9-8.9 6 6 0 0 0-11.6-1.4A4 4 0 0 0 6 19h11.5z" />
    </svg>
  );
}

export function IconDevOps() {
  return (
    <svg {...cardIcon}>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" />
    </svg>
  );
}

export function IconInfraestruturaCodigo() {
  return (
    <svg {...cardIcon}>
      <path d="M8 8l-4 4 4 4M16 8l4 4-4 4M14 6l-4 12" />
    </svg>
  );
}

export function IconContainersKubernetes() {
  return (
    <svg {...cardIcon}>
      <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z" />
      <path d="M12 12l8-4.5M12 12v9M12 12L4 7.5" />
    </svg>
  );
}

export function IconObservabilidade() {
  return (
    <svg {...cardIcon}>
      <path d="M4 19h16" />
      <path d="M7 16V9M11.5 16V5M16 16v-4" />
      <circle cx="19" cy="6" r="2.2" />
      <path d="m20.6 7.6 1.4 1.4" />
    </svg>
  );
}

export function IconSegurancaCloud() {
  return (
    <svg {...cardIcon}>
      <path d="M12 2 4 5v6c0 5 3.4 8.5 8 11 4.6-2.5 8-6 8-11V5l-8-3z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

/* Ícones dos cards "O que fazemos" — specs/ESPECIFICACAO-INTEGRACAO-AUTOMACAO.md §7 */
export function IconIntegracaoSistemas() {
  return (
    <svg {...cardIcon}>
      <path d="M10 13a5 5 0 0 1 0-7l1-1a5 5 0 0 1 7 7l-1 1" />
      <path d="M14 11a5 5 0 0 1 0 7l-1 1a5 5 0 0 1-7-7l1-1" />
    </svg>
  );
}

export function IconAutomacaoProcessos() {
  return (
    <svg {...cardIcon}>
      <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z" />
    </svg>
  );
}

export function IconOrquestracaoProcessos() {
  return (
    <svg {...cardIcon}>
      <circle cx="5" cy="6" r="2" />
      <circle cx="5" cy="18" r="2" />
      <circle cx="19" cy="12" r="2" />
      <path d="M7 6h6a4 4 0 0 1 4 4" />
      <path d="M7 18h6a4 4 0 0 0 4-4" />
    </svg>
  );
}

export function IconApisServicos() {
  return (
    <svg {...cardIcon}>
      <path d="M9 2v4M15 2v4M9 18v4M15 18v4M6 9h12v6a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3V9z" />
    </svg>
  );
}

export function IconArquiteturasEscalaveis() {
  return (
    <svg {...cardIcon}>
      <path d="m12 2 9 5-9 5-9-5 9-5z" />
      <path d="m3 12 9 5 9-5" />
      <path d="m3 17 9 5 9-5" />
    </svg>
  );
}

/* Ícones dos cards "O que fazemos" — specs/ESPECIFICACAO-INTELIGENCIA-ARTIFICIAL.md §7
   (spec descreve os ícones por nome, sem path literal — glifos escolhidos aqui,
   mesmo estilo stroke-based dos demais). */
export function IconAssistenteInteligente() {
  return (
    <svg {...cardIcon}>
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  );
}

export function IconAgenteIA() {
  return (
    <svg {...cardIcon}>
      <rect x="4" y="8" width="16" height="12" rx="2" />
      <circle cx="9" cy="14" r="1" />
      <circle cx="15" cy="14" r="1" />
      <path d="M9 8V5h6v3" />
      <path d="M2 12v3M22 12v3" />
    </svg>
  );
}

export function IconIaIntegrada() {
  return (
    <svg {...cardIcon}>
      <path d="M4 7a2 2 0 0 1 2-2h2.17a2 2 0 0 0 1.83-1.2 2 2 0 0 1 3.7 0A2 2 0 0 0 15.53 5H18a2 2 0 0 1 2 2v2.47a2 2 0 0 1-1.2 1.83 2 2 0 0 0 0 3.7 2 2 0 0 1 1.2 1.83V19a2 2 0 0 1-2 2h-2.47a2 2 0 0 1-1.83-1.2 2 2 0 0 0-3.7 0A2 2 0 0 1 8.47 21H6a2 2 0 0 1-2-2v-2.47a2 2 0 0 1 1.2-1.83 2 2 0 0 0 0-3.7A2 2 0 0 1 4 9.47V7z" />
    </svg>
  );
}

/* Ícones dos chips das seções "mosaico" (Especialidades, Maturidade técnica,
   Casos de Aplicação) — 16×16 dentro do selo de 28×28 (sessão 2026-07-18). */
const chipIcon = { ...common, width: 20, height: 20 };

export function IconFinOps() {
  return (
    <svg {...chipIcon}>
      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}

export function IconAltaDisponibilidade() {
  return (
    <svg {...chipIcon}>
      <path d="M12 2 4 5v6c0 5 3.4 8.5 8 11 4.6-2.5 8-6 8-11V5l-8-3z" />
      <path d="M7 13h2.5l1.5-3 2 6 1.5-3H17" />
    </svg>
  );
}

export function IconCICD() {
  return (
    <svg {...chipIcon}>
      <path d="M17 2.1l4 4-4 4" />
      <path d="M3 12.5v-1a4 4 0 0 1 4-4h14" />
      <path d="M7 21.9l-4-4 4-4" />
      <path d="M21 11.5v1a4 4 0 0 1-4 4H3" />
    </svg>
  );
}

export function IconEventos() {
  return (
    <svg {...chipIcon}>
      <path d="M12 2a7 7 0 0 0-7 7c0 5-2 6-2 6h18s-2-1-2-6a7 7 0 0 0-7-7z" />
      <path d="M9 21a3 3 0 0 0 6 0" />
    </svg>
  );
}

export function IconAsync() {
  return (
    <svg {...chipIcon}>
      <path d="M12 21a9 9 0 1 1 9-9" />
      <path d="M21 3v6h-6" />
      <path d="M12 8v4l3 2" />
    </svg>
  );
}

export function IconCodigoLimpo() {
  return (
    <svg {...chipIcon}>
      <path d="m8 6-6 6 6 6M16 6l6 6-6 6" />
    </svg>
  );
}

export function IconTestes() {
  return (
    <svg {...chipIcon}>
      <path d="M9 3h6M10 3v4.5L5.5 16a2 2 0 0 0 1.8 3h9.4a2 2 0 0 0 1.8-3L14 7.5V3" />
    </svg>
  );
}

export function IconDocumentacao() {
  return (
    <svg {...chipIcon}>
      <path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v17H6.5A2.5 2.5 0 0 0 4 21.5v-17z" />
      <path d="M4 19a2.5 2.5 0 0 1 2.5-2.5H20" />
    </svg>
  );
}

export function IconDividaTecnica() {
  return (
    <svg {...chipIcon}>
      <path d="M12 3a9 9 0 1 0 9 9" />
      <path d="M12 12l4.5-4.5" />
      <circle cx="12" cy="12" r="1.2" />
    </svg>
  );
}

export function IconAtendimentoInteligente() {
  return (
    <svg {...chipIcon}>
      <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
      <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
    </svg>
  );
}

export function IconPesquisaDocumentos() {
  return (
    <svg {...chipIcon}>
      <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h7" />
      <circle cx="16.5" cy="16.5" r="3" />
      <path d="m20.5 20.5-1.7-1.7" />
    </svg>
  );
}

export function IconProcessamentoDocumentos() {
  return (
    <svg {...chipIcon}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
      <path d="M9 15l3 3 3-3" />
    </svg>
  );
}

export function IconGeracaoConteudo() {
  return (
    <svg {...chipIcon}>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  );
}
