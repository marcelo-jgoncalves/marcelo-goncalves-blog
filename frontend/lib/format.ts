// frontend/lib/format.ts

const MONTHS_PT = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];

export function formatDateShort(dateStr?: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const day = String(date.getDate()).padStart(2, '0');
  return `${day} ${MONTHS_PT[date.getMonth()]} ${date.getFullYear()}`;
}
