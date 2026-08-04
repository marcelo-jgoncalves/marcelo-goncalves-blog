/**
 * audit-script.ts
 * Extracts computed styles and bounding rects of [data-audit] elements.
 * Reference: specs/VALIDATION-STRATEGY.md
 */
import type { Page } from '@playwright/test';

export const AUDIT_PROPERTIES = [
  'padding',
  'margin',
  'gap',
  'fontSize',
  'fontWeight',
  'fontFamily',
  'lineHeight',
  'letterSpacing',
  'color',
  'backgroundColor',
  'borderColor',
  'borderRadius',
  'boxShadow',
  'display',
  'gridTemplateColumns',
  'flexDirection',
] as const;

export type AuditEntry = Record<string, string>;
export type AuditResult = Record<string, AuditEntry>;

/** Fixed viewport so clamp()/vw values resolve consistently (specs/VALIDATION-STRATEGY.md) */
export const VIEWPORT = { width: 1280, height: 900 };

export async function captureAudit(page: Page): Promise<AuditResult> {
  return page.evaluate((properties) => {
    const result: Record<string, AuditEntry> = {};

    document.querySelectorAll('[data-audit]').forEach((el) => {
      const key = el.getAttribute('data-audit')!;
      const s = getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      const entry: AuditEntry = {};

      for (const prop of properties) {
        entry[prop] = (s as unknown as Record<string, string>)[prop];
      }

      entry.width = `${rect.width.toFixed(1)}px`;
      entry.height = `${rect.height.toFixed(1)}px`;
      result[key] = entry;
    });

    return result;
  }, AUDIT_PROPERTIES);
}
