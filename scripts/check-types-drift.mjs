// scripts/check-types-drift.mjs
//
// Compara a interface `Post` de backend/src/common/types.ts (fonte de
// verdade, mais próxima do schema real do DynamoDB) contra a de
// admin/src/types/index.ts. Não exige que os dois lados tenham exatamente
// os mesmos campos (backend tem sparse index markers que o admin não
// precisa conhecer, e isso é esperado) — só falha quando um campo existe
// nos DOIS lados com tipos diferentes, que é a classe de bug real já
// encontrada uma vez neste projeto (e_popular: number no backend vs
// boolean|0|1 no admin, corrigido em 2026-07-24).
//
// Uso: node scripts/check-types-drift.mjs
// Exit code 1 se achar divergência de tipo em campo compartilhado.

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

// Extrai `type Nome = ...;` (aliases simples, uma linha) do arquivo, para
// resolver referências como `status: PostStatus` de volta pra união literal
// real antes de comparar — comparação textual pura trataria alias e união
// inline como "diferentes" mesmo quando são o mesmo tipo.
function extractTypeAliases(filePath) {
  const source = readFileSync(filePath, 'utf-8');
  const aliases = new Map();
  const re = /^export type (\w+)\s*=\s*(.+?);?$/gm;
  let match;
  while ((match = re.exec(source))) {
    aliases.set(match[1], match[2].trim());
  }
  return aliases;
}

// Normaliza uniões de literais pra comparação (`'A' | 'B'` === `'B' | 'A'`
// — mesmo conjunto, ordem irrelevante para o TypeScript e para nós).
function normalizeUnion(typeText) {
  return typeText
    .split('|')
    .map((member) => member.trim())
    .sort()
    .join(' | ');
}

// Dois tipos são compatíveis se forem iguais após normalizar ordem de união
// (e resolver aliases), OU se o tipo do admin for uma união de literais
// numéricos e o do backend for `number` (subtipo mais estrito é
// intencional e correto — não é o bug que este script existe pra pegar).
function typesCompatible(backendType, adminType) {
  if (normalizeUnion(backendType) === normalizeUnion(adminType)) return true;
  const isNumericLiteralUnion = (t) => /^\d+(\s*\|\s*\d+)*$/.test(t.trim());
  if (backendType === 'number' && isNumericLiteralUnion(adminType)) return true;
  return false;
}

function resolveAlias(typeText, aliases) {
  return aliases.get(typeText.trim()) ?? typeText;
}

function extractInterfaceFields(filePath, interfaceName) {
  const source = readFileSync(filePath, 'utf-8');
  const startMarker = `interface ${interfaceName} {`;
  const startIdx = source.indexOf(startMarker);
  if (startIdx === -1) {
    throw new Error(`Interface "${interfaceName}" não encontrada em ${filePath}`);
  }
  const bodyStart = startIdx + startMarker.length;
  const endIdx = source.indexOf('\n}', bodyStart);
  if (endIdx === -1) {
    throw new Error(`Fechamento da interface "${interfaceName}" não encontrado em ${filePath}`);
  }
  const body = source.slice(bodyStart, endIdx);

  const fields = new Map();
  for (const rawLine of body.split('\n')) {
    const line = rawLine.split('//')[0].trim();
    if (!line) continue;
    const match = line.match(/^([A-Za-z0-9_]+)(\?)?\s*:\s*(.+?);?$/);
    if (!match) continue;
    const [, name, optional, typeText] = match;
    const normalizedType = typeText.replace(/;$/, '').trim();
    fields.set(name, { optional: !!optional, type: normalizedType });
  }
  return fields;
}

const ADMIN_TYPES_PATH = join(ROOT, 'admin/src/types/index.ts');
const backendFields = extractInterfaceFields(
  join(ROOT, 'backend/src/common/types.ts'),
  'Post',
);
const adminFields = extractInterfaceFields(ADMIN_TYPES_PATH, 'Post');
const adminAliases = extractTypeAliases(ADMIN_TYPES_PATH);

const onlyInBackend = [];
const onlyInAdmin = [];
const mismatched = [];

for (const [name, backendField] of backendFields) {
  const adminField = adminFields.get(name);
  if (!adminField) {
    onlyInBackend.push(name);
    continue;
  }
  const resolvedAdminType = resolveAlias(adminField.type, adminAliases);
  if (!typesCompatible(backendField.type, resolvedAdminType)) {
    mismatched.push({ name, backend: backendField.type, admin: adminField.type });
  }
}
for (const name of adminFields.keys()) {
  if (!backendFields.has(name)) onlyInAdmin.push(name);
}

if (onlyInBackend.length) {
  console.log(`ℹ️  Campos só no backend (Post): ${onlyInBackend.join(', ')}`);
}
if (onlyInAdmin.length) {
  console.log(`ℹ️  Campos só no admin (Post): ${onlyInAdmin.join(', ')}`);
}

if (mismatched.length) {
  console.error('\n❌ Divergência de tipo em campos compartilhados entre backend e admin:\n');
  for (const { name, backend, admin } of mismatched) {
    console.error(`  - ${name}: backend="${backend}" vs admin="${admin}"`);
  }
  console.error(
    '\nEsses campos representam o MESMO contrato de API (mesma entidade Post salva/lida ' +
    'pelo adminPosts) — o tipo do admin deve refletir o que a API realmente envia/aceita, ' +
    'não uma suposição. Corrija admin/src/types/index.ts ou backend/src/common/types.ts.',
  );
  process.exit(1);
}

console.log('\n✅ Nenhuma divergência de tipo entre backend e admin nos campos compartilhados de Post.');
