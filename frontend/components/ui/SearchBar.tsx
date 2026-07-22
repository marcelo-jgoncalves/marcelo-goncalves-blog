/* frontend/components/ui/SearchBar.tsx
   Barra de busca reutilizável (dentro de hero escuro) — único ponto de
   verdade, usada tanto em /artigos quanto em /busca. Sempre envia para
   /busca?q=... Ícone de lupa fica só do lado direito, como botão de
   submit (sem ícone do lado esquerdo). */

import './SearchBar.css';

interface SearchBarProps {
  name?: string;
  defaultValue?: string;
  placeholder?: string;
  ariaLabel?: string;
  dataAudit?: string;
}

export default function SearchBar({
  name = 'q',
  defaultValue,
  placeholder = 'Buscar por título, tema ou tecnologia…',
  ariaLabel = 'Buscar no blog',
  dataAudit,
}: SearchBarProps) {
  return (
    <form className="search-bar" action="/busca" method="get" role="search" data-audit={dataAudit}>
      <input type="search" name={name} defaultValue={defaultValue} placeholder={placeholder} aria-label={ariaLabel} required />
      <button type="submit" className="search-bar-submit" aria-label="Pesquisar">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>
      </button>
    </form>
  );
}
