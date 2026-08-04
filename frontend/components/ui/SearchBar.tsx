// Reusable search bar (inside a dark hero): single source of truth, used
// in both /artigos and /busca. Always submits to /busca?q=... Magnifying
// glass icon sits only on the right, as the submit button (no icon on the
// left).

import styles from './SearchBar.module.css';

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
    <form className={`${styles.searchBar} search-bar`} action="/busca" method="get" role="search" data-audit={dataAudit}>
      <input type="search" name={name} defaultValue={defaultValue} placeholder={placeholder} aria-label={ariaLabel} required />
      <button type="submit" className={styles.searchBarSubmit} aria-label="Pesquisar">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>
      </button>
    </form>
  );
}
