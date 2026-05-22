<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>Card Post Premium</title>

<style>

/* ===== BASE ===== */

body{
  margin:0;
  background:#f4f7fb;
  font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Inter,sans-serif;
  padding:60px;
}

/* simula grid da home */
.posts-grid{
  display:grid;
  grid-template-columns:repeat(auto-fit,minmax(320px,1fr));
  gap:28px;
  max-width:1100px;
  margin:auto;
}

/* ===== PALETA ===== */

:root{
  --color-primary:#1e63ff;
  --text-main:#0f172a;
  --text-soft:#64748b;
}

/* ===== CARD PREMIUM ===== */

.post-card{
  background:white;
  border-radius:18px;
  overflow:hidden;

  box-shadow:
    0 8px 22px rgba(0,0,0,.06);

  transition:.28s ease;
  cursor:pointer;
}

.post-card:hover{
  transform:translateY(-6px);
  box-shadow:
    0 18px 45px rgba(0,0,0,.12);
}

/* ===== IMAGE ===== */

.post-image{
  position:relative;
  height:190px;
  overflow:hidden;
}

.post-image img{
  width:100%;
  height:100%;
  object-fit:cover;
  transition:transform .5s ease;
}

.post-card:hover img{
  transform:scale(1.06);
}

/* badge categoria */
.post-category{
  position:absolute;
  top:14px;
  left:14px;

  background:rgba(30,99,255,.95);
  color:white;

  padding:6px 12px;
  border-radius:999px;
  font-size:.75rem;
  font-weight:600;

  backdrop-filter:blur(6px);
}

/* ===== CONTENT ===== */

.post-content{
  padding:22px;
}

/* meta */
.post-meta{
  font-size:.8rem;
  color:var(--text-soft);
  margin-bottom:8px;
}

/* título */
.post-title{
  font-size:1.15rem;
  font-weight:600;
  color:var(--text-main);
  line-height:1.4;
  margin-bottom:12px;
}

/* descrição */
.post-excerpt{
  font-size:.92rem;
  color:var(--text-soft);
  line-height:1.6;
  margin-bottom:18px;
}

/* footer */
.post-footer{
  display:flex;
  justify-content:space-between;
  align-items:center;
}

/* leitura */
.read-time{
  font-size:.8rem;
  color:var(--text-soft);
}

/* link */
.read-more{
  font-weight:600;
  font-size:.85rem;
  color:var(--color-primary);
  text-decoration:none;
  transition:.2s;
}

.post-card:hover .read-more{
  transform:translateX(4px);
}

</style>
</head>

<body>

<div class="posts-grid">

  <!-- CARD -->
  <article class="post-card">

    <div class="post-image">
      <img src="https://picsum.photos/600/400" />
      <span class="post-category">AWS</span>
    </div>

    <div class="post-content">

      <div class="post-meta">
        12 Maio 2026 • Marcelo Gonçalves
      </div>

      <h2 class="post-title">
        Arquitetura AWS que escala sem aumentar complexidade
      </h2>

      <p class="post-excerpt">
        Veja como projetar arquiteturas cloud modernas capazes de crescer
        mantendo simplicidade operacional e redução de custos.
      </p>

      <div class="post-footer">
        <span class="read-time">6 min leitura</span>
        <a href="#" class="read-more">Ler artigo →</a>
      </div>

    </div>

  </article>

  <!-- DUPLICADO PARA VISUAL -->
  <article class="post-card">
    <div class="post-image">
      <img src="https://picsum.photos/601/400" />
      <span class="post-category">DevOps</span>
    </div>

    <div class="post-content">
      <div class="post-meta">
        10 Maio 2026 • Marcelo Gonçalves
      </div>

      <h2 class="post-title">
        CI/CD moderno na AWS com práticas profissionais
      </h2>

      <p class="post-excerpt">
        Pipeline profissional usando práticas reais de engenharia
        utilizadas por empresas cloud-native.
      </p>

      <div class="post-footer">
        <span class="read-time">8 min leitura</span>
        <a href="#" class="read-more">Ler artigo →</a>
      </div>
    </div>
  </article>

</div>

</body>
</html>