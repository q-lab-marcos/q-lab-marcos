const config = window.SITE_CONFIG || { sheets: {} };

const samples = {
  projects: [
    { titulo: "Algoritmos quânticos", descricao: "Desenvolvimento e análise de algoritmos com vantagens quânticas para problemas computacionais complexos.", link: "#" },
    { titulo: "Informação quântica", descricao: "Fundamentos, protocolos e novas formas de codificar, transmitir e proteger informação.", link: "#" },
    { titulo: "Simulação quântica", descricao: "Modelagem de sistemas físicos e materiais por meio de plataformas computacionais quânticas.", link: "#" },
    { titulo: "Machine learning quântico", descricao: "Interseções entre aprendizado de máquina, otimização e circuitos quânticos variacionais.", link: "#" }
  ],
  staff: [
    { nome: "Nome do Pesquisador", funcao: "Professor(a) responsável", foto: "", link: "#" },
    { nome: "Nome do Pesquisador", funcao: "Professor(a) associado(a)", foto: "", link: "#" },
    { nome: "Nome do Pesquisador", funcao: "Pesquisador(a) pós-doc", foto: "", link: "#" }
  ],
  students: [
    { nome: "Nome do Estudante", funcao: "Doutorado", foto: "", link: "#" },
    { nome: "Nome do Estudante", funcao: "Mestrado", foto: "", link: "#" },
    { nome: "Nome do Estudante", funcao: "Iniciação científica", foto: "", link: "#" },
    { nome: "Nome do Estudante", funcao: "Doutorado", foto: "", link: "#" }
  ],
  articles: [
    { ano: "2026", titulo: "Título do artigo científico publicado pelo grupo", autores: "Sobrenome, A.; Sobrenome, B.", revista: "Nome do Periódico", link: "#" },
    { ano: "2025", titulo: "Outro trabalho relevante em computação quântica", autores: "Sobrenome, C.; Sobrenome, D.", revista: "Nome da Conferência", link: "#" },
    { ano: "2025", titulo: "Título de uma publicação recente do laboratório", autores: "Sobrenome, E. et al.", revista: "Nome do Periódico", link: "#" }
  ]
};

const field = (row, ...names) => {
  const normalized = Object.fromEntries(Object.entries(row).map(([k, v]) => [k.trim().toLowerCase(), String(v || "").trim()]));
  return names.map(n => normalized[n]).find(Boolean) || "";
};

function parseSheet(url) {
  return new Promise((resolve, reject) => {
    if (!url || typeof Papa === "undefined") return reject(new Error("not-configured"));
    Papa.parse(url, { download: true, header: true, skipEmptyLines: true, complete: r => r.errors.length ? reject(r.errors[0]) : resolve(r.data), error: reject });
  });
}

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}

function renderPeople(targetId, rows) {
  const target = document.getElementById(targetId); target.replaceChildren();
  rows.forEach(row => {
    const name = field(row, "nome", "name") || "Nome não informado";
    const role = field(row, "funcao", "função", "cargo", "nivel", "nível", "role");
    const photo = field(row, "foto", "imagem", "photo");
    const href = field(row, "link", "lattes", "perfil", "profile") || "#";
    const col = el("div", "col-6 col-md-4 col-lg-3"); const card = el("article", "person-card");
    const a = el("a"); a.href = href; if (href !== "#") { a.target = "_blank"; a.rel = "noopener"; }
    const visual = el("div", "person-photo");
    if (photo) { const img = el("img"); img.src = photo; img.alt = `Foto de ${name}`; img.loading = "lazy"; img.onerror = () => img.replaceWith(el("div", "person-placeholder", "◌")); visual.append(img); }
    else visual.append(el("div", "person-placeholder", "◌"));
    a.append(visual, el("h4", "", name), el("p", "", role)); card.append(a); col.append(card); target.append(col);
  });
}

function renderProjects(rows) {
  const target = document.getElementById("projects-grid"); target.replaceChildren();
  rows.forEach((row, i) => {
    const col = el("div", "col-md-6 col-lg-3"); const card = el("article", "research-card");
    card.append(el("span", "card-number", String(i + 1).padStart(2, "0")), el("h3", "", field(row, "titulo", "título", "title")), el("p", "", field(row, "descricao", "descrição", "description")));
    const a = el("a", "", "SAIBA MAIS  →"); a.href = field(row, "link", "url") || "#"; card.append(a); col.append(card); target.append(col);
  });
}

function renderArticles(rows) {
  const target = document.getElementById("articles-list"); target.replaceChildren();
  rows.forEach(row => {
    const item = el("article", "publication"); const content = el("div");
    content.append(el("h3", "", field(row, "titulo", "título", "title")), el("p", "", [field(row, "autores", "authors"), field(row, "revista", "periodico", "periódico", "journal")].filter(Boolean).join(" · ")));
    const a = el("a", "", "↗"); const href = field(row, "link", "doi", "url") || "#"; a.href = href; a.setAttribute("aria-label", "Abrir publicação");
    if (href !== "#") { a.target = "_blank"; a.rel = "noopener"; }
    item.append(el("span", "publication-year", field(row, "ano", "year")), content, a); target.append(item);
  });
}

async function hydrate(kind, renderer, targetId) {
  const status = targetId ? document.getElementById(targetId) : null;
  if (status) status.textContent = config.sheets?.[kind] ? "CARREGANDO…" : "DADOS DE EXEMPLO";
  try { const rows = await parseSheet(config.sheets?.[kind]); renderer(rows); if (status) status.textContent = "ATUALIZADO VIA SHEETS"; }
  catch { renderer(samples[kind]); if (status && config.sheets?.[kind]) status.textContent = "FALHA AO CARREGAR · EXIBINDO EXEMPLO"; }
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("year").textContent = new Date().getFullYear();
  document.getElementById("all-publications").href = config.publicationsPage || "#";
  hydrate("projects", renderProjects); hydrate("staff", rows => renderPeople("staff-grid", rows), "staff-status");
  hydrate("students", rows => renderPeople("students-grid", rows), "students-status"); hydrate("articles", renderArticles);
  document.querySelectorAll(".navbar .nav-link").forEach(link => link.addEventListener("click", () => bootstrap.Collapse.getInstance(document.getElementById("navbarMenu"))?.hide()));
});
