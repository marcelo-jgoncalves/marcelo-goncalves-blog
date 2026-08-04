// Real load test against the dev API. Never run against prod (does not exist yet).
//
// Usage:
//   k6 run scripts/performance-audit/k6/load-test.js
//   k6 run --vus 20 --duration 60s scripts/performance-audit/k6/load-test.js
//
// Goal: measure real latency (p50/p95/p99) and find out which limit is hit
// first under burst load: Lambda concurrency (10/account) or API Gateway
// throttling (20 rps / burst 40).
import http from "k6/http";
import { check, sleep } from "k6";

const BASE_URL = "https://5duus31al8.execute-api.us-east-1.amazonaws.com/v1";

// Real slug, confirmed via curl; replace if the post is ever removed.
const REAL_SLUG = "terraform-em-producao-as-licoes-que-so-um-incidente-real-ensina";

export const options = {
  scenarios: {
    // Scenario 1: gradual ramp, finds the degradation point
    ramping: {
      executor: "ramping-vus",
      startVUs: 1,
      stages: [
        { duration: "30s", target: 5 },
        { duration: "30s", target: 15 },
        { duration: "30s", target: 30 }, // above the theoretical 10 concurrent/Lambda limit
        { duration: "30s", target: 0 },
      ],
      exec: "browsePublicRoutes",
    },
  },
  thresholds: {
    http_req_duration: ["p(95)<2000"], // initial baseline, adjust after first run
    http_req_failed: ["rate<0.05"],
  },
};

// Realistic mix of public traffic: listing, search (full Scan), single
// post, popular posts, project.
export function browsePublicRoutes() {
  // Note: there is no public GET /categorias, the only "categorias"
  // resource on the API Gateway is /admin/categorias (Cognito-only).
  // Categories are consumed embedded in each post (categoria_slug/nome),
  // not via a listing endpoint of their own. Removed from the real load mix.
  const routes = [
    `${BASE_URL}/artigos?limit=10`,
    `${BASE_URL}/post/${REAL_SLUG}`,
    `${BASE_URL}/busca?termo=terraform`, // searchPosts is a full Scan, expected to be the slowest
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
