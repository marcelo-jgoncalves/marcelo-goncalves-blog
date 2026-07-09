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

export function IconPin() {
  return (
    <svg {...common}>
      <path d="M12 21s-7-6.1-7-11a7 7 0 0 1 14 0c0 4.9-7 11-7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}
