document.addEventListener("DOMContentLoaded", async () => {
  const loadFormer = async (kind, target, type, statusId) => {
    const status = document.getElementById(statusId);
    try {
      const rows = await parseSheet(config.sheets?.[kind]);
      const former = rows.filter(row => !isCurrent(row));
      renderPeople(target, former, type);
      status.textContent = former.length ? `${former.length} NO ARQUIVO` : "NENHUM REGISTRO";
    } catch {
      status.textContent = "NÃO FOI POSSÍVEL CARREGAR";
    }
  };
  await Promise.all([
    loadFormer("staff", "former-staff-grid", "staff", "former-staff-status"),
    loadFormer("students", "former-students-grid", "student", "former-students-status")
  ]);
});
