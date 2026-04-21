/**
 * eleves.js — Gestion CRUD des élèves via l'API
 */

let eleveIdASupprimer = null;
let tousLesEleves     = [];
let modeEdition       = false;

/* ======================================================
   INITIALISATION
   ====================================================== */
document.addEventListener('DOMContentLoaded', async () => {
  await chargerEleves();

  const recherche = document.getElementById('recherche-eleve');
  if (recherche) {
    recherche.addEventListener('input', filtrerEleves);
  }

  const form = document.getElementById('form-eleve');
  if (form) form.addEventListener('submit', soumettreFormEleve);
});

/* ======================================================
   CHARGEMENT
   ====================================================== */
async function chargerEleves() {
  try {
    const res = await fetch('/api/eleves');
    if (!res.ok) throw new Error('Accès refusé ou erreur serveur');
    tousLesEleves = await res.json();
    afficherEleves(tousLesEleves);
  } catch (err) {
    afficherNotification('Impossible de charger les élèves : ' + err.message, 'error');
    document.getElementById('tbody-eleves').innerHTML = `
      <tr><td colspan="6" class="text-center text-muted">Aucune donnée disponible.</td></tr>`;
  }
}

/* ======================================================
   AFFICHAGE
   ====================================================== */
function afficherEleves(liste) {
  const tbody = document.getElementById('tbody-eleves');
  const peutModifier = ['Secretariat', 'Proviseur'].includes(ROLE_UTILISATEUR);
  const cols = peutModifier ? 6 : 5;

  if (liste.length === 0) {
    tbody.innerHTML = `<tr><td colspan="${cols}" class="px-6 py-8 text-center text-sm text-slate-500">Aucun élève trouvé.</td></tr>`;
    return;
  }

  tbody.innerHTML = liste.map(e => `
    <tr class="border-b border-gray-200">
      <td class="py-2 px-4 border-r border-gray-200">${e.id}</td>
      <td class="py-2 px-4 border-r border-gray-200 font-semibold">${escapeHtml(e.prenom)} ${escapeHtml(e.nom)}</td>
      <td class="py-2 px-4 border-r border-gray-200">${escapeHtml(e.email)}</td>
      <td class="py-2 px-4 border-r border-gray-200">${escapeHtml(e.identifiant_csv || '—')}</td>
      <td class="py-2 px-4 border-r border-gray-200">${e.referent_id || '—'}</td>
      ${peutModifier ? `
      <td class="py-2 px-4 text-right">
        <button onclick='ouvrirModalModification(${JSON.stringify(e).replace(/'/g, "&#39;")})' class="text-blue-600 hover:underline mr-2 text-sm font-medium">Modifier</button>
        <button onclick="demanderSuppression(${e.id})" class="text-red-600 hover:underline text-sm font-medium">Supprimer</button>
      </td>` : ''}
    </tr>
  `).join('');
}

/* ======================================================
   FILTRE
   ====================================================== */
function filtrerEleves() {
  const q = document.getElementById('recherche-eleve').value.toLowerCase().trim();
  const filtre = q
    ? tousLesEleves.filter(e =>
        (e.nom    || '').toLowerCase().includes(q) ||
        (e.prenom || '').toLowerCase().includes(q) ||
        (e.email  || '').toLowerCase().includes(q)
      )
    : tousLesEleves;
  afficherEleves(filtre);
}

/* ======================================================
   MODALS
   ====================================================== */
function ouvrirModalAjout() {
  modeEdition = false;
  document.getElementById('modal-title').textContent  = 'Ajouter un élève';
  document.getElementById('btn-submit-eleve').textContent = 'Enregistrer';
  document.getElementById('form-eleve').reset();
  document.getElementById('eleve-id').value = '';
  document.getElementById('group-password').style.display = 'block';
  document.getElementById('eleve-password').required = true;
  document.getElementById('modal-eleve').classList.remove('hidden');
}

function ouvrirModalEdition(id) {
  const eleve = tousLesEleves.find(e => e.id === id);
  if (!eleve) return;
  modeEdition = true;

  document.getElementById('modal-title').textContent  = 'Modifier l\'élève';
  document.getElementById('btn-submit-eleve').textContent = 'Enregistrer les modifications';
  document.getElementById('eleve-id').value         = eleve.id;
  document.getElementById('eleve-nom').value        = eleve.nom    || '';
  document.getElementById('eleve-prenom').value     = eleve.prenom || '';
  document.getElementById('eleve-email').value      = eleve.email  || '';
  document.getElementById('eleve-csv').value        = eleve.identifiant_csv || '';
  document.getElementById('group-password').style.display = 'none';
  document.getElementById('eleve-password').required = false;
  document.getElementById('modal-eleve').classList.remove('hidden');
}

function fermerModal() {
  document.getElementById('modal-eleve').classList.add('hidden');
}

function demanderSuppression(id) {
  eleveIdASupprimer = id;
  document.getElementById('modal-confirmer-suppression').classList.remove('hidden');
  document.getElementById('btn-confirmer-suppression').onclick = supprimerEleve;
}

function fermerConfirmation() {
  eleveIdASupprimer = null;
  document.getElementById('modal-confirmer-suppression').classList.add('hidden');
}

/* ======================================================
   CRUD
   ====================================================== */
async function soumettreFormEleve(e) {
  e.preventDefault();

  const id      = document.getElementById('eleve-id').value;
  const payload = {
    nom:             document.getElementById('eleve-nom').value.trim(),
    prenom:          document.getElementById('eleve-prenom').value.trim(),
    email:           document.getElementById('eleve-email').value.trim(),
    identifiant_csv: document.getElementById('eleve-csv').value.trim() || null,
  };

  if (!modeEdition) {
    payload.password = document.getElementById('eleve-password').value;
  }

  const btn = document.getElementById('btn-submit-eleve');
  btn.disabled = true;
  const originalText = btn.textContent;
  btn.innerHTML = `<div class="spinner" style="width:14px;height:14px;margin:0;"></div>`;

  try {
    const url    = modeEdition ? `/api/eleves/${id}` : '/api/eleves';
    const method = modeEdition ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || 'Erreur lors de l\'opération.');
    }

    afficherNotification(data.message || 'Opération réussie !', 'success');
    fermerModal();
    await chargerEleves();
  } catch (err) {
    afficherNotification(err.message, 'error');
  } finally {
    btn.disabled = false;
    btn.textContent = originalText;
  }
}

async function supprimerEleve() {
  if (!eleveIdASupprimer) return;

  const btn = document.getElementById('btn-confirmer-suppression');
  btn.disabled = true;
  btn.textContent = 'Suppression…';

  try {
    const res  = await fetch(`/api/eleves/${eleveIdASupprimer}`, { method: 'DELETE' });
    const data = await res.json();

    if (!res.ok) throw new Error(data.message || 'Erreur lors de la suppression.');

    afficherNotification(data.message || 'Élève supprimé !', 'success');
    fermerConfirmation();
    await chargerEleves();
  } catch (err) {
    afficherNotification(err.message, 'error');
    fermerConfirmation();
  } finally {
    btn.disabled = false;
    btn.textContent = 'Supprimer';
  }
}

/* ======================================================
   UTILITAIRES
   ====================================================== */
function afficherNotification(message, type = 'success') {
  const container = document.getElementById('notification-container') || (function() {
    const c = document.createElement('div');
    c.id = 'notification-container';
    c.className = 'fixed bottom-4 right-4 z-50 flex flex-col gap-2';
    document.body.appendChild(c);
    return c;
  })();
  
  const notif = document.createElement('div');
  const bgClass = type === 'success' ? 'bg-green-600' : type === 'error' ? 'bg-red-600' : 'bg-blue-600';
  notif.className = `${bgClass} text-white px-4 py-2 border border-black shadow-none flex items-center`;
  notif.innerHTML = `<span class="text-sm font-bold">${message}</span>`;
  container.appendChild(notif);
  
  setTimeout(() => notif.remove(), 4000);
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/* Fermer modals avec Escape */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    fermerModal();
    fermerConfirmation();
  }
});
