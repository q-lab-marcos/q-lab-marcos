const config = window.SITE_CONFIG || { sheets: {} };
const liveData = { students: null, staff: null, articles: null, projects: null };

const samples = {
  projects: [
    { titulo: "Algoritmos quânticos", descricao: "Desenvolvimento e análise de algoritmos com vantagens quânticas para problemas computacionais complexos.", agencia: "CNPq", periodo: "2025–2027", link: "#" },
    { titulo: "Informação quântica", descricao: "Fundamentos, protocolos e novas formas de codificar, transmitir e proteger informação.", agencia: "CAPES", periodo: "2024–2026", link: "#" },
    { titulo: "Simulação quântica", descricao: "Modelagem de sistemas físicos e materiais por meio de plataformas computacionais quânticas.", agencia: "FAPESP", periodo: "2025–2028", link: "#" },
    { titulo: "Machine learning quântico", descricao: "Interseções entre aprendizado de máquina, otimização e circuitos quânticos variacionais.", agencia: "Finep", periodo: "2026–2028", link: "#" }
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
    const separator = url.includes("?") ? "&" : "?";
    const freshUrl = `${url}${separator}_refresh=${Date.now()}`;
    Papa.parse(freshUrl, { download: true, header: true, skipEmptyLines: true, complete: r => r.errors.length ? reject(r.errors[0]) : resolve(r.data), error: reject });
  });
}

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}

function isCurrent(row) {
  const status = field(row, "status", "situacao", "situação").toLowerCase();
  const inactive = ["inativo", "inativa", "egresso", "egressa", "anterior", "ex-integrante", "concluido", "concluído", "concluida", "concluída", "finalizado", "finalizada", "encerrado", "encerrada", "terminado", "terminada", "não", "nao"];
  return !status || !inactive.includes(status);
}

function isFavorite(row) {
  const value = field(row, "favorito", "favorita", "destaque", "favorite").toLowerCase();
  return ["sim", "s", "true", "1", "x", "favorito", "favorita"].includes(value);
}

function publicationYear(row) {
  return Number.parseInt(field(row, "ano", "year"), 10) || 0;
}

function updateStats() {
  const counts = {
    "stat-staff": liveData.staff?.filter(isCurrent).length,
    "stat-students": liveData.students?.filter(isCurrent).length,
    "stat-publications": liveData.articles?.length,
    "stat-projects": liveData.projects?.filter(isCurrent).length
  };
  Object.entries(counts).forEach(([id, count]) => {
    document.getElementById(id).textContent = count == null ? "—" : count;
  });
}

function renderPeople(targetId, rows, type) {
  const target = document.getElementById(targetId); target.replaceChildren();
  rows.forEach(row => {
    const name = field(row, "nome", "name") || "Nome não informado";
    const role = field(row, "funcao", "função", "cargo", "nivel", "nível", "role");
    const photo = field(row, "foto", "imagem", "photo");
    const href = field(row, "link", "lattes", "perfil", "profile") || "#";
    const email = field(row, "email", "e-mail");
    const agency = field(row, "agencia", "agência", "agencia da bolsa", "agência da bolsa", "agencia_bolsa");
    const grant = field(row, "numero da bolsa", "número da bolsa", "numero_bolsa", "numero", "número", "bolsa");
    const thesis = field(row, "titulo do trabalho", "título do trabalho", "titulo_trabalho", "trabalho", "titulo", "título");
    const col = el("div", `person-col ${type === "student" ? "student-col" : "staff-col"}`); const card = el("article", "person-card");
    const a = el("a"); a.href = href; if (href !== "#") { a.target = "_blank"; a.rel = "noopener"; }
    const visual = el("div", "person-photo");
    if (photo) { const img = el("img"); img.src = photo; img.alt = `Foto de ${name}`; img.loading = "lazy"; img.onerror = () => img.replaceWith(el("div", "person-placeholder", "◌")); visual.append(img); }
    else visual.append(el("div", "person-placeholder", "◌"));
    a.append(visual, el("h4", "", name), el("p", "person-role", role)); card.append(a);
    if (type === "student" && thesis) card.append(el("p", "person-work", thesis));
    if (agency || grant) card.append(el("p", "person-grant", [agency, grant].filter(Boolean).join(" · ")));
    if (email) { const mail = el("a", "person-email", email); mail.href = `mailto:${email}`; card.append(mail); }
    col.append(card); target.append(col);
  });
}

function renderProjects(rows) {
  const target = document.getElementById("projects-grid"); target.replaceChildren();
  const orderedRows = [...rows].sort((a, b) => Number(isCurrent(b)) - Number(isCurrent(a)));
  orderedRows.forEach((row, i) => {
    const completed = !isCurrent(row);
    const col = el("div", "col-lg-6"); const card = el("article", "research-card");
    if (completed) card.classList.add("research-card-completed");
    const header = el("div", "research-card-header");
    header.append(el("span", "card-number", String(i + 1).padStart(2, "0")));
    header.append(el("span", `project-status ${completed ? "status-completed" : "status-active"}`, completed ? "CONCLUÍDO" : "ATIVO"));
    const period = field(row, "periodo", "período", "period");
    if (period) header.append(el("span", "project-period", period));
    card.append(header, el("h3", "", field(row, "titulo", "título", "title")), el("p", "research-description", field(row, "descricao", "descrição", "description")));
    const footer = el("div", "research-card-footer");
    const agency = field(row, "agencia", "agência", "agencia de fomento", "agência de fomento", "fomento", "funding agency");
    if (agency) {
      const funding = el("p", "project-agency");
      funding.append(el("span", "", "FOMENTO"), document.createTextNode(agency));
      footer.append(funding);
    }
    const href = field(row, "link", "url") || "#";
    if (href !== "#") {
      const a = el("a", "", "SAIBA MAIS  →"); a.href = href; a.target = "_blank"; a.rel = "noopener"; footer.append(a);
    }
    card.append(footer); col.append(card); target.append(col);
  });
}

function renderArticles(rows, featuredOnly = true) {
  const target = document.getElementById("articles-list"); target.replaceChildren();
  const orderedRows = [...rows].sort((a, b) => publicationYear(b) - publicationYear(a));
  const visibleRows = featuredOnly ? orderedRows.filter(isFavorite).slice(0, 3) : orderedRows;
  if (!visibleRows.length) {
    target.append(el("p", "empty-message", "Nenhuma publicação favorita foi selecionada."));
    return;
  }
  visibleRows.forEach(row => {
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
  try {
    const rows = await parseSheet(config.sheets?.[kind]);
    liveData[kind] = rows;
    renderer(rows);
    updateStats();
    if (status) status.textContent = "ATUALIZADO VIA SHEETS";
  } catch {
    liveData[kind] = null;
    renderer(samples[kind]);
    updateStats();
    if (status && config.sheets?.[kind]) status.textContent = "FALHA AO CARREGAR · EXIBINDO EXEMPLO";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("year").textContent = new Date().getFullYear();
  const groupPhoto = document.getElementById("group-photo");
  if (groupPhoto && config.groupPhoto) {
    groupPhoto.src = config.groupPhoto;
    groupPhoto.hidden = false;
    document.getElementById("group-photo-placeholder").hidden = true;
    groupPhoto.onerror = () => {
      groupPhoto.hidden = true;
      document.getElementById("group-photo-placeholder").hidden = false;
    };
  }
  if (!document.getElementById("all-publications")) return;
  document.getElementById("all-publications").href = config.publicationsPage || "#";
  hydrate("projects", renderProjects); hydrate("staff", rows => renderPeople("staff-grid", rows.filter(isCurrent), "staff"), "staff-status");
  hydrate("students", rows => renderPeople("students-grid", rows.filter(isCurrent), "student"), "students-status"); hydrate("articles", renderArticles);
  document.querySelectorAll(".navbar .nav-link").forEach(link => link.addEventListener("click", () => bootstrap.Collapse.getInstance(document.getElementById("navbarMenu"))?.hide()));
});
