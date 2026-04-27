/**
 * dashboard.js — Chargement des statistiques du tableau de bord
 */
document.addEventListener('DOMContentLoaded', async () => {
  await Promise.all([
    chargerNombreEleves(),
    chargerNombreOptions(),
    chargerNombreClasses()
  ]);
});

async function chargerNombreEleves() {
  try {
    const res = await fetch('/api/eleves');
    if (!res.ok) return;
    const data = await res.json();
    const el = document.getElementById('stat-eleves');
    if (el) {
      if (Array.isArray(data)) {
        el.textContent = data.length;
      } else if (data && data.meta && data.meta.total !== undefined) {
        el.textContent = data.meta.total;
      } else if (data && Array.isArray(data.data)) {
        el.textContent = data.data.length;
      } else {
        el.textContent = '—';
      }
    }
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

async function chargerNombreClasses() {
  try {
    const res = await fetch('/api/classes');
    if (!res.ok) return;
    const data = await res.json();
    const el = document.getElementById('stat-classes');
    if (el) el.textContent = Array.isArray(data) ? data.length : '—';
  } catch {
    // Silencieux
  }
}
