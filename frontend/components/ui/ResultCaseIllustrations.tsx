/* frontend/components/ui/ResultCaseIllustrations.tsx
   Ilustrações SVG dos 4 cases da seção Resultados (Home) —
   specs/ESPECIFICACAO-RESULTADOS-ILUSTRACOES-V2.md
   Tamanho controlado via classe (não inline style) para permitir
   override responsivo em home.css — ver .ih-illustration. */

export function ResultCase1() {
  return (
    <svg viewBox="4 31 222 108" className="ih-illustration" fill="none" aria-hidden="true">
      <text x="12" y="48" textAnchor="start" fill="rgba(255,255,255,.4)" fontFamily="'JetBrains Mono', monospace" fontSize="9">100%</text>
      <text x="12" y="86" textAnchor="start" fill="rgba(255,255,255,.4)" fontFamily="'JetBrains Mono', monospace" fontSize="9">50%</text>
      <text x="12" y="128" textAnchor="start" fill="rgba(255,255,255,.4)" fontFamily="'JetBrains Mono', monospace" fontSize="9">0%</text>
      <path d="M40 124 L218 124" stroke="rgba(255,255,255,.25)" strokeWidth="1.2" />
      <path d="M40 86 L218 86" stroke="rgba(255,255,255,.12)" strokeWidth="1" strokeDasharray="2 4" />
      <path d="M40 44 L218 44" stroke="rgba(255,255,255,.12)" strokeWidth="1" strokeDasharray="2 4" />
      <rect x="48" y="44" width="26" height="80" rx="4" fill="rgba(255,255,255,.16)" />
      <rect x="84" y="60" width="26" height="64" rx="4" fill="rgba(255,255,255,.16)" />
      <rect x="120" y="74" width="26" height="50" rx="4" fill="rgba(255,255,255,.16)" />
      <rect x="156" y="90" width="26" height="34" rx="4" fill="#C9603C" />
      <rect x="192" y="102" width="26" height="22" rx="4" fill="#C9603C" />
      <path d="M61 44 L97 60 L133 74 L169 90 L205 102" stroke="#C9603C" strokeWidth="1.6" strokeDasharray="4 4" />
    </svg>
  );
}

export function ResultCase2() {
  return (
    <svg viewBox="6 8 200 114" className="ih-illustration" fill="none" aria-hidden="true">
      <path d="M26 20 L48 34 M48 34 L18 52 M18 52 L50 60 M50 60 L22 82 M22 82 L52 94 M52 94 L30 108 M26 20 L18 52 M48 34 L50 60 M18 52 L22 82 M50 60 L52 94" stroke="rgba(255,255,255,.2)" strokeWidth="1.1" />
      <circle cx="26" cy="20" r="4.5" fill="#0A2A33" stroke="rgba(255,255,255,.5)" strokeWidth="1" />
      <circle cx="48" cy="34" r="4.5" fill="rgba(255,255,255,.08)" stroke="rgba(255,255,255,.3)" strokeWidth="1" strokeDasharray="2 2" />
      <path d="M45.5 31.5 L50.5 36.5 M50.5 31.5 L45.5 36.5" stroke="rgba(255,255,255,.6)" strokeWidth="1" strokeLinecap="round" />
      <circle cx="18" cy="52" r="4.5" fill="#0A2A33" stroke="rgba(255,255,255,.5)" strokeWidth="1" />
      <circle cx="50" cy="60" r="4.5" fill="#C9603C" />
      <circle cx="22" cy="82" r="4.5" fill="rgba(255,255,255,.08)" stroke="rgba(255,255,255,.3)" strokeWidth="1" strokeDasharray="2 2" />
      <path d="M19.5 79.5 L24.5 84.5 M24.5 79.5 L19.5 84.5" stroke="rgba(255,255,255,.6)" strokeWidth="1" strokeLinecap="round" />
      <circle cx="52" cy="94" r="4.5" fill="#C9603C" />
      <circle cx="30" cy="108" r="4.5" fill="#0A2A33" stroke="rgba(255,255,255,.5)" strokeWidth="1" />
      <path d="M84 68 L128 68" stroke="rgba(255,255,255,.4)" strokeWidth="1.6" />
      <path d="M120 61 L129 68 L120 75" stroke="rgba(255,255,255,.4)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="140" y="30" width="58" height="24" rx="7" fill="rgba(255,255,255,.16)" />
      <path d="M148 38 L168 38 M148 46 L168 46" stroke="rgba(255,255,255,.35)" strokeWidth="1.2" strokeLinecap="round" />
      <rect x="140" y="60" width="58" height="24" rx="7" fill="#C9603C" />
      <path d="M148 68 L168 68 M148 76 L168 76" stroke="rgba(255,255,255,.65)" strokeWidth="1.2" strokeLinecap="round" />
      <rect x="140" y="90" width="58" height="24" rx="7" fill="rgba(255,255,255,.16)" />
      <path d="M148 98 L168 98 M148 106 L168 106" stroke="rgba(255,255,255,.35)" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M169 54 L169 60 M169 84 L169 90" stroke="rgba(255,255,255,.35)" strokeWidth="1.4" />
    </svg>
  );
}

export function ResultCase3() {
  return (
    <svg viewBox="11 40 206 70" className="ih-illustration" fill="none" aria-hidden="true">
      <circle cx="192" cy="62" r="17" fill="#3F6B47" fillOpacity=".2" />
      <path d="M28 62 L151 62" stroke="#C9603C" strokeWidth="2" />
      <path d="M151 62 L192 62" stroke="#3F6B47" strokeWidth="2" />
      <circle cx="28" cy="62" r="9" fill="#0A2A33" stroke="rgba(255,255,255,.4)" strokeWidth="1.6" />
      <circle cx="69" cy="62" r="9" fill="#0A2A33" stroke="rgba(255,255,255,.4)" strokeWidth="1.6" />
      <circle cx="110" cy="62" r="9" fill="#0A2A33" stroke="rgba(255,255,255,.4)" strokeWidth="1.6" />
      <circle cx="151" cy="62" r="9" fill="#C9603C" />
      <circle cx="192" cy="62" r="12" fill="#3F6B47" />
      <path d="M186 62 L191 67 L199 57" stroke="#FAF8F3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M22 100 L198 100" stroke="rgba(255,255,255,.2)" strokeWidth="1.2" strokeDasharray="2 5" />
      <path d="M28 96 L28 104 M69 96 L69 104 M110 96 L110 104 M151 96 L151 104 M192 96 L192 104" stroke="rgba(255,255,255,.24)" strokeWidth="1.2" />
    </svg>
  );
}

export function ResultCase4() {
  return (
    <svg viewBox="6 15 204 123" className="ih-illustration" fill="none" aria-hidden="true">
      <path d="M64 40 C 96 40, 100 48, 130 48" stroke="rgba(255,255,255,.32)" strokeWidth="1.3" />
      <path d="M66 78 C 96 78, 100 72, 130 72" stroke="rgba(255,255,255,.32)" strokeWidth="1.3" />
      <path d="M62 112 C 96 112, 100 96, 130 96" stroke="rgba(255,255,255,.32)" strokeWidth="1.3" />
      <rect x="16" y="26" width="46" height="30" rx="5" fill="rgba(255,255,255,.14)" stroke="rgba(255,255,255,.22)" strokeWidth="1" transform="rotate(-8 39 41)" />
      <path d="M26 36 L52 36 M26 42 L52 42 M26 48 L44 48" stroke="rgba(255,255,255,.4)" strokeWidth="1.3" strokeLinecap="round" transform="rotate(-8 39 41)" />
      <rect x="20" y="64" width="46" height="30" rx="5" fill="rgba(255,255,255,.14)" stroke="rgba(255,255,255,.22)" strokeWidth="1" transform="rotate(5 43 79)" />
      <circle cx="32" cy="74" r="2" fill="rgba(255,255,255,.4)" transform="rotate(5 43 79)" />
      <circle cx="42" cy="74" r="2" fill="rgba(255,255,255,.4)" transform="rotate(5 43 79)" />
      <circle cx="52" cy="74" r="2" fill="rgba(255,255,255,.4)" transform="rotate(5 43 79)" />
      <circle cx="32" cy="84" r="2" fill="rgba(255,255,255,.4)" transform="rotate(5 43 79)" />
      <circle cx="42" cy="84" r="2" fill="rgba(255,255,255,.4)" transform="rotate(5 43 79)" />
      <circle cx="52" cy="84" r="2" fill="rgba(255,255,255,.4)" transform="rotate(5 43 79)" />
      <rect x="16" y="98" width="46" height="30" rx="5" fill="rgba(255,255,255,.14)" stroke="rgba(255,255,255,.22)" strokeWidth="1" transform="rotate(-4 39 113)" />
      <path d="M24 105 L39 114 L54 105 L54 121 L24 121 Z" stroke="rgba(255,255,255,.4)" strokeWidth="1.2" fill="none" strokeLinejoin="round" transform="rotate(-4 39 113)" />
      <rect x="130" y="34" width="72" height="82" rx="10" fill="rgba(255,255,255,.1)" stroke="rgba(255,255,255,.28)" strokeWidth="1.4" />
      <path d="M144 54 L188 54 M144 68 L188 68 M144 82 L174 82" stroke="rgba(255,255,255,.4)" strokeWidth="2" strokeLinecap="round" />
      <circle cx="192" cy="42" r="7" fill="none" stroke="#C9603C" strokeWidth="1.2" opacity=".5" />
      <circle cx="192" cy="42" r="3" fill="#C9603C" />
      <circle cx="188" cy="98" r="10" fill="#3F6B47" />
      <path d="M183 98 L187 102 L194 94" stroke="#FAF8F3" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export const RESULT_CASE_ILLUSTRATIONS = [ResultCase1, ResultCase2, ResultCase3, ResultCase4];
