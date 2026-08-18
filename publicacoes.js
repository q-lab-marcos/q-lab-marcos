document.addEventListener("DOMContentLoaded", async () => {
  const body = document.getElementById("publications-table-body");
  const count = document.getElementById("publications-count");
  const error = document.getElementById("publications-error");
  try {
    const rows = await parseSheet(config.sheets?.articles);
    rows.sort((a, b) => publicationYear(b) - publicationYear(a));
    rows.forEach(row => {
      const tr = el("tr");
      const details = [
        field(row, "volume") && `v. ${field(row, "volume")}`,
        field(row, "numero", "número", "issue") && `n. ${field(row, "numero", "número", "issue")}`,
        field(row, "paginas", "páginas", "pages") && `p. ${field(row, "paginas", "páginas", "pages")}`,
        field(row, "doi") && `DOI: ${field(row, "doi")}`
      ].filter(Boolean).join(", ");
      const titleCell = el("td", "publication-title-cell");
      titleCell.append(el("strong", "", field(row, "titulo", "título", "title")), el("span", "", field(row, "autores", "authors")));
      const href = field(row, "link", "doi", "url");
      const linkCell = el("td");
      if (href) { const a = el("a", "publication-link", "ABRIR ↗"); a.href = href; a.target = "_blank"; a.rel = "noopener"; linkCell.append(a); }
      else linkCell.textContent = "—";
      tr.append(el("td", "publication-table-year", field(row, "ano", "year")), titleCell, el("td", "", field(row, "revista", "periodico", "periódico", "journal", "evento")), el("td", "", details || "—"), el("td", "", field(row, "tipo", "type") || "Artigo"), linkCell);
      body.append(tr);
    });
    count.textContent = `${rows.length} PUBLICA${rows.length === 1 ? "ÇÃO" : "ÇÕES"}`;
  } catch {
    count.textContent = "INDISPONÍVEL";
    error.hidden = false;
    error.textContent = "Não foi possível carregar as publicações. Tente novamente em instantes.";
  }
});
