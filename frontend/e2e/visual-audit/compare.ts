/**
 * compare.ts
 * Diffs two AuditResult objects (prototype vs app) and produces a readable report.
 * Reference: specs/VALIDATION-STRATEGY.md
 */
import type { AuditResult } from './audit-script';

export interface AuditDiff {
  key: string;
  property: string;
  proto: string;
  app: string;
}

export interface CompareOutcome {
  diffs: AuditDiff[];
  report: string;
}

const RECT_PROPERTIES = new Set(['width', 'height']);
const RECT_TOLERANCE_PX = 2;

// Height of containers with dynamic content (real titles/excerpts) varies
// against the prototype's placeholder text: an expected divergence (see VALIDATION-STRATEGY.md).
// Reported but not counted as a failure.
const SOFT_PROPERTIES = new Set(['height']);

const COLOR_PROPERTIES = new Set(['color', 'backgroundColor', 'borderColor']);

function normalizeColor(value: string): string {
  const trimmed = value.replace(/\s+/g, ' ').trim();
  // rgba(r, g, b, 1) -> rgb(r, g, b): alpha 1 is equivalent to opaque
  const rgbaMatch = trimmed.match(/^rgba\((\d+),\s*(\d+),\s*(\d+),\s*1\)$/);
  if (rgbaMatch) {
    return `rgb(${rgbaMatch[1]}, ${rgbaMatch[2]}, ${rgbaMatch[3]})`;
  }
  return trimmed;
}

function firstFontFamily(value: string): string {
  return value.split(',')[0].replace(/['"]/g, '').trim().toLowerCase();
}

function valuesEqual(property: string, proto: string, app: string): boolean {
  if (proto === app) return true;

  if (RECT_PROPERTIES.has(property)) {
    const p = parseFloat(proto);
    const a = parseFloat(app);
    if (!Number.isNaN(p) && !Number.isNaN(a)) {
      return Math.abs(p - a) <= RECT_TOLERANCE_PX;
    }
  }

  if (COLOR_PROPERTIES.has(property)) {
    return normalizeColor(proto) === normalizeColor(app);
  }

  // next/font injects fallback metrics into fontFamily: compare only the 1st family
  if (property === 'fontFamily') {
    return firstFontFamily(proto) === firstFontFamily(app);
  }

  return false;
}

/**
 * Compares the prototype and app audits for a list of `data-audit` keys.
 * `targets` defines which elements are expected on the page: keys missing
 * from either side generate an explicit diff (missing element).
 */
export function compareAudits(proto: AuditResult, app: AuditResult, targets: string[]): CompareOutcome {
  const diffs: AuditDiff[] = [];
  const lines: string[] = [];

  for (const key of targets) {
    const protoEntry = proto[key];
    const appEntry = app[key];

    lines.push(`─── AUDIT: ${key} ───────────────────────────────────────────`);

    if (!protoEntry) {
      lines.push(`  ⚠️  data-audit="${key}" não encontrado no PROTÓTIPO`);
      lines.push('');
      continue;
    }
    if (!appEntry) {
      lines.push(`  ❌  data-audit="${key}" não encontrado no APP`);
      diffs.push({ key, property: '(element)', proto: 'found', app: 'missing' });
      lines.push('');
      continue;
    }

    const properties = Array.from(new Set([...Object.keys(protoEntry), ...Object.keys(appEntry)])).sort();

    for (const property of properties) {
      const protoValue = protoEntry[property] ?? '';
      const appValue = appEntry[property] ?? '';
      const ok = valuesEqual(property, protoValue, appValue);

      if (ok) {
        lines.push(`  ${property.padEnd(20)} ✅  ${appValue}`);
      } else if (SOFT_PROPERTIES.has(property)) {
        lines.push(`  ${property.padEnd(20)} ⚠️  proto: ${protoValue}  |  app: ${appValue}  (conteúdo dinâmico)`);
      } else {
        lines.push(`  ${property.padEnd(20)} ❌  proto: ${protoValue}  |  app: ${appValue}`);
        diffs.push({ key, property, proto: protoValue, app: appValue });
      }
    }

    lines.push('');
  }

  return { diffs, report: lines.join('\n') };
}
