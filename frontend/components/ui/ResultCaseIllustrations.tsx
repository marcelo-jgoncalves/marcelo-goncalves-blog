/* frontend/components/ui/ResultCaseIllustrations.tsx
   Ilustrações SVG dos 4 cases da seção Resultados (Home) —
   specs/ESPECIFICACAO-RESULTADOS.md §5.9 */

export function ResultCase1() {
  return (
    <svg viewBox="0 0 220 150" fill="none" style={{ width: '72%', height: '72%' }} aria-hidden="true">
      <path d="M20 124 L218 124" stroke="rgba(255,255,255,.25)" strokeWidth="1.2" />
      <rect x="30" y="44" width="26" height="80" rx="4" fill="rgba(255,255,255,.16)" />
      <rect x="68" y="60" width="26" height="64" rx="4" fill="rgba(255,255,255,.16)" />
      <rect x="106" y="74" width="26" height="50" rx="4" fill="rgba(255,255,255,.16)" />
      <rect x="144" y="90" width="26" height="34" rx="4" fill="#C9603C" />
      <rect x="182" y="102" width="26" height="22" rx="4" fill="#C9603C" />
    </svg>
  );
}

export function ResultCase2() {
  return (
    <svg viewBox="0 0 220 150" fill="none" style={{ width: '72%', height: '72%' }} aria-hidden="true">
      <path d="M26 34 L52 60 M52 60 L24 88 M24 88 L58 108 M40 20 L52 60 M26 34 L24 88" stroke="rgba(255,255,255,.22)" strokeWidth="1.2" />
      <circle cx="26" cy="34" r="4.5" fill="#0A2A33" stroke="rgba(255,255,255,.5)" strokeWidth="1" />
      <circle cx="52" cy="60" r="4.5" fill="#C9603C" />
      <circle cx="24" cy="88" r="4.5" fill="#0A2A33" stroke="rgba(255,255,255,.5)" strokeWidth="1" />
      <circle cx="58" cy="108" r="4.5" fill="#C9603C" />
      <circle cx="40" cy="20" r="4.5" fill="#0A2A33" stroke="rgba(255,255,255,.5)" strokeWidth="1" />
      <path d="M84 68 L128 68" stroke="rgba(255,255,255,.4)" strokeWidth="1.6" />
      <path d="M120 61 L129 68 L120 75" stroke="rgba(255,255,255,.4)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="140" y="30" width="58" height="24" rx="7" fill="rgba(255,255,255,.16)" />
      <rect x="140" y="60" width="58" height="24" rx="7" fill="#C9603C" />
      <rect x="140" y="90" width="58" height="24" rx="7" fill="rgba(255,255,255,.16)" />
      <path d="M169 54 L169 60 M169 84 L169 90" stroke="rgba(255,255,255,.35)" strokeWidth="1.4" />
    </svg>
  );
}

export function ResultCase3() {
  return (
    <svg viewBox="0 0 220 150" fill="none" style={{ width: '76%', height: '76%' }} aria-hidden="true">
      <path d="M28 62 L192 62" stroke="rgba(255,255,255,.28)" strokeWidth="1.4" />
      <circle cx="28" cy="62" r="9" fill="#0A2A33" stroke="rgba(255,255,255,.4)" strokeWidth="1.6" />
      <circle cx="69" cy="62" r="9" fill="#0A2A33" stroke="rgba(255,255,255,.4)" strokeWidth="1.6" />
      <circle cx="110" cy="62" r="9" fill="#0A2A33" stroke="rgba(255,255,255,.4)" strokeWidth="1.6" />
      <circle cx="151" cy="62" r="9" fill="#C9603C" />
      <circle cx="192" cy="62" r="10" fill="#3F6B47" />
      <path d="M187 62 L191 66 L198 58" stroke="#FAF8F3" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M22 100 L198 100" stroke="rgba(255,255,255,.2)" strokeWidth="1.2" strokeDasharray="2 5" />
      <path d="M28 96 L28 104 M69 96 L69 104 M110 96 L110 104 M151 96 L151 104 M192 96 L192 104" stroke="rgba(255,255,255,.24)" strokeWidth="1.2" />
    </svg>
  );
}

export function ResultCase4() {
  return (
    <svg viewBox="0 0 220 150" fill="none" style={{ width: '74%', height: '74%' }} aria-hidden="true">
      <rect x="16" y="26" width="46" height="30" rx="5" fill="rgba(255,255,255,.14)" stroke="rgba(255,255,255,.22)" strokeWidth="1" transform="rotate(-8 39 41)" />
      <rect x="20" y="64" width="46" height="30" rx="5" fill="rgba(255,255,255,.14)" stroke="rgba(255,255,255,.22)" strokeWidth="1" transform="rotate(5 43 79)" />
      <rect x="16" y="98" width="46" height="30" rx="5" fill="rgba(255,255,255,.14)" stroke="rgba(255,255,255,.22)" strokeWidth="1" transform="rotate(-4 39 113)" />
      <path d="M64 40 C 96 40, 96 75, 128 75" stroke="rgba(255,255,255,.3)" strokeWidth="1.3" />
      <path d="M66 78 L128 78" stroke="rgba(255,255,255,.3)" strokeWidth="1.3" />
      <path d="M62 112 C 96 112, 96 80, 128 80" stroke="rgba(255,255,255,.3)" strokeWidth="1.3" />
      <rect x="130" y="34" width="72" height="82" rx="10" fill="rgba(255,255,255,.1)" stroke="rgba(255,255,255,.28)" strokeWidth="1.4" />
      <path d="M144 54 L188 54 M144 68 L188 68 M144 82 L174 82" stroke="rgba(255,255,255,.4)" strokeWidth="2" strokeLinecap="round" />
      <circle cx="188" cy="98" r="10" fill="#3F6B47" />
      <path d="M183 98 L187 102 L194 94" stroke="#FAF8F3" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export const RESULT_CASE_ILLUSTRATIONS = [ResultCase1, ResultCase2, ResultCase3, ResultCase4];
