/**
 * dashboard.js — Chargement des statistiques du tableau de bord
 */
document.addEventListener('DOMContentLoaded', async () => {
  await Promise.all([chargerNombreEleves(), chargerNombreOptions()]);
});

async function chargerNombreEleves() {
  try {
    const res = await fetch('/api/eleves');
    if (!res.ok) return;
    const data = await res.json();
    const el = document.getElementById('stat-eleves');
    if (el) el.textContent = Array.isArray(data) ? data.length : '—';
  } catch {
    // Silencieux si l'utilisateur n'a pas accès
  }
}

async function chargerNombreOptions() {
  try {
    const res = await fetch('/api/options');
    if (!res.ok) return;
    const data = await res.json();
    const el = document.getElementById('stat-options');
    if (el) el.textContent = Array.isArray(data) ? data.length : '—';
  } catch {
    // Silencieux
  }
}
