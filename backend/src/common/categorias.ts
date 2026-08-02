//
// Category display-name lookup for public post listings. Posts only store
// categoria_slug; the frontend fallback used to Title-Case the slug when no
// display name was present, which is wrong for anything with an acronym or
// accent the slug can't encode (categoria_slug "devops-automacao" -> "DevOps
// & Automação" has neither of those). categorias is a tiny table (single-
// digit item count), so a full Scan per request is cheap.
import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import { dynamo } from "./dynamodb";

const TABLE_NAME = process.env.CATEGORIAS_TABLE;

export async function getCategoriaNomeMap(): Promise<Map<string, string>> {
  const result = await dynamo.send(
    new ScanCommand({
      TableName: TABLE_NAME,
      ProjectionExpression: "categoria_slug, nome",
    }),
  );
  const map = new Map<string, string>();
  for (const item of result.Items || []) {
    if (item.categoria_slug && item.nome) {
      map.set(item.categoria_slug, item.nome);
    }
  }
  return map;
}

interface PostWithCategorySlug {
  categoria_slug?: string;
  [key: string]: unknown;
}

// Attaches { categoria: { nome_exibicao } } to each post, matching the shape
// the frontend's PostWithCategory type (frontend/lib/format.ts) already
// expects — no frontend change needed once posts carry this field.
export function attachCategoriaNome<T extends PostWithCategorySlug>(
  posts: T[],
  nomeMap: Map<string, string>,
): (T & { categoria?: { nome_exibicao: string } })[] {
  return posts.map((post) => {
    const nome = post.categoria_slug ? nomeMap.get(post.categoria_slug) : undefined;
    return nome ? { ...post, categoria: { nome_exibicao: nome } } : post;
  });
}
