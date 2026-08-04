// Per-route latency breakdown: confirms or refutes the hypothesis that
// /busca, being a full Scan, should be the slowest route.
import http from "k6/http";
import { sleep } from "k6";

const BASE_URL = "https://5duus31al8.execute-api.us-east-1.amazonaws.com/v1";
const REAL_SLUG = "terraform-em-producao-as-licoes-que-so-um-incidente-real-ensina";

export const options = {
  vus: 10,
  duration: "30s",
};

export default function () {
  const routes = {
    artigos: `${BASE_URL}/artigos?limit=10`,
    post: `${BASE_URL}/post/${REAL_SLUG}`,
    busca: `${BASE_URL}/busca?termo=terraform`,
    populares: `${BASE_URL}/posts/populares`,
    projeto: `${BASE_URL}/projeto`,
  };

  for (const [name, url] of Object.entries(routes)) {
    http.get(url, { tags: { route: name } });
  }
  sleep(0.5);
}
