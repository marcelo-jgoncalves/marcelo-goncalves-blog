// PERF-LOAD — docs/plano-auditoria-performance.md
// Teste de carga real contra a API de dev. Nunca rodar contra prod (não existe ainda).
//
// Uso:
//   k6 run scripts/performance-audit/k6/load-test.js
//   k6 run --vus 20 --duration 60s scripts/performance-audit/k6/load-test.js
//
// Objetivo: medir latência real (p50/p95/p99) e descobrir qual limite é
// atingido primeiro sob rajada — concorrência de Lambda (10/conta, backlog
// #6) ou throttling do API Gateway (20 rps / burst 40, sessão 53).
import http from "k6/http";
import { check, sleep } from "k6";

const BASE_URL = "https://5duus31al8.execute-api.us-east-1.amazonaws.com/v1";

// Slug real confirmado via curl em 2026-06-28 — trocar se o post for removido.
const REAL_SLUG = "terraform-em-producao-as-licoes-que-so-um-incidente-real-ensina";

export const options = {
  scenarios: {
    // Cenário 1: rampa gradual — descobre o ponto de degradação
    ramping: {
      executor: "ramping-vus",
      startVUs: 1,
      stages: [
        { duration: "30s", target: 5 },
        { duration: "30s", target: 15 },
        { duration: "30s", target: 30 }, // acima do limite teórico de 10 concurrent/Lambda
        { duration: "30s", target: 0 },
      ],
      exec: "browsePublicRoutes",
    },
  },
  thresholds: {
    http_req_duration: ["p(95)<2000"], // referência inicial, ajustar após primeira rodada
    http_req_failed: ["rate<0.05"],
  },
};

// Mistura realista de tráfego público: listagem, busca (o Scan completo
// de PERF4), post individual, populares, projeto.
export function browsePublicRoutes() {
  // Nota (achado de execução): não existe GET /categorias público — o único
  // recurso "categorias" no API Gateway é /admin/categorias (Cognito-only).
  // Categorias são consumidas embutidas em cada post (categoria_slug/nome),
  // não via endpoint de listagem própria. Removido da carga real.
  const routes = [
    `${BASE_URL}/artigos?limit=10`,
    `${BASE_URL}/post/${REAL_SLUG}`,
    `${BASE_URL}/busca?termo=terraform`, // PERF4 — searchPosts é Scan completo, esperado ser o mais lento
    `${BASE_URL}/posts/populares`,
    `${BASE_URL}/projeto`,
  ];

  for (const url of routes) {
    const res = http.get(url);
    check(res, {
      "status é 200": (r) => r.status === 200,
      "não é 429 (throttled)": (r) => r.status !== 429,
    });
    sleep(0.5);
  }
}
