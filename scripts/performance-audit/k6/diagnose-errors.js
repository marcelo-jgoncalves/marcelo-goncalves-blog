// Diagnóstico rápido: qual rota e qual status code está causando as falhas
// vistas no load-test.js (16.66% de erro, mas não 429).
import http from "k6/http";

const BASE_URL = "https://5duus31al8.execute-api.us-east-1.amazonaws.com/v1";
const REAL_SLUG = "terraform-em-producao-as-licoes-que-so-um-incidente-real-ensina";

export const options = {
  vus: 10,
  duration: "20s",
};

export default function () {
  const routes = {
    artigos: `${BASE_URL}/artigos?limit=10`,
    post: `${BASE_URL}/post/${REAL_SLUG}`,
    busca: `${BASE_URL}/busca?termo=terraform`,
    populares: `${BASE_URL}/posts/populares`,
    projeto: `${BASE_URL}/projeto`,
    categorias: `${BASE_URL}/categorias`,
  };

  for (const [name, url] of Object.entries(routes)) {
    const res = http.get(url);
    if (res.status !== 200) {
      console.log(`FALHA rota=${name} status=${res.status} body=${res.body.substring(0, 200)}`);
    }
  }
}
