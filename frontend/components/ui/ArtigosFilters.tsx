/* frontend/components/ui/ArtigosFilters.tsx */
'use client';

import { useEffect } from 'react';

export interface ArtigoCategory {
  slug: string;
  label: string;
}

interface ArtigosFiltersProps {
  categories: ArtigoCategory[];
  totalCount: number;
  renderedCount: number;
}

export default function ArtigosFilters({ categories, totalCount, renderedCount }: ArtigosFiltersProps) {
  useEffect(() => {
    const chips = Array.from(document.querySelectorAll<HTMLButtonElement>('.art-chip'));
    const cards = Array.from(document.querySelectorAll<HTMLElement>('.art-grid .post-card'));
    const countEl = document.getElementById('art-count');
    const titleEl = document.getElementById('art-grid-title');
    const emptyEl = document.getElementById('art-empty');

    const labels: Record<string, string> = { all: 'Todos os artigos' };
    categories.forEach((c) => { labels[c.slug] = c.label; });

    function applyFilter(filter: string) {
      let shown = 0;
      cards.forEach((card) => {
        const cat = card.dataset.cat || '';
        const match = filter === 'all' || cat.split(' ').includes(filter);
        card.classList.toggle('is-hidden', !match);
        if (match) shown++;
      });
      if (titleEl) titleEl.textContent = labels[filter] || 'Todos os artigos';
      if (countEl) countEl.innerHTML = `<b>${shown}</b> de ${totalCount} artigos`;
      if (emptyEl) emptyEl.classList.toggle('show', shown === 0);
    }

    function handleClick(event: Event) {
      const chip = event.currentTarget as HTMLButtonElement;
      chips.forEach((c) => c.classList.remove('active'));
      chip.classList.add('active');
      applyFilter(chip.dataset.filter || 'all');
    }

    chips.forEach((chip) => chip.addEventListener('click', handleClick));

    return () => {
      chips.forEach((chip) => chip.removeEventListener('click', handleClick));
    };
  }, [categories, totalCount]);

  return (
    <div className="art-filterbar" data-audit="art-filterbar">
      <div className="art-filterbar-in">
        <div className="art-chips" id="art-chips">
          <button className="art-chip active" data-filter="all" type="button">Todos</button>
          {categories.map((c) => (
            <button key={c.slug} className="art-chip" data-filter={c.slug} type="button">{c.label}</button>
          ))}
        </div>
        <div className="art-filter-right">
          <span className="art-result-count" id="art-count">
            <b>{renderedCount}</b> de {totalCount} artigos
          </span>
          <div className="art-sort">
            <select aria-label="Ordenar artigos" defaultValue="recentes">
              <option value="recentes">Mais recentes</option>
              <option value="lidos">Mais lidos</option>
              <option value="az">A–Z</option>
            </select>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
          </div>
        </div>
      </div>
    </div>
  );
}
