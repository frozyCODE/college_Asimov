/**
 * options.js — Gestion des options via l'API
 */

let optionIdASupprimer = null;
let toutesLesOptions   = [];

document.addEventListener('DOMContentLoaded', async () => {
  await chargerOptions();
  const form = document.getElementById('form-option');
  if (form) form.addEventListener('submit', soumettreFormOption);
});

/* ======================================================
   CHARGEMENT
   ====================================================== */
async function chargerOptions() {
  try {
    const res = await fetch('/api/options');
    if (!res.ok) throw new Error('Erreur lors du chargement des options.');
    toutesLesOptions = await res.json();
    afficherOptions(toutesLesOptions);
  } catch (err) {
    afficherNotification(err.message, 'error');
    document.getElementById('tbody-options').innerHTML =
      `<tr><td colspan="4" class="text-center text-muted">Impossible de charger les options.</td></tr>`;
  }
}

/* ======================================================
   AFFICHAGE
   ====================================================== */
function afficherOptions(liste) {
  const grid = document.getElementById('grid-options');
  if (!grid) return;
  const peutModifier = ['Secretariat', 'Proviseur'].includes(ROLE_UTILISATEUR);

  grid.innerHTML = liste.map((o) => `
    <div class="bg-white border border-gray-300 p-4 flex justify-between items-center">
      <div>
        <h3 class="text-lg font-bold">${escapeHtml(o.nom || '—')}</h3>
        <p class="text-sm text-gray-500">${escapeHtml(o.description || '—')}</p>
      </div>
      ${peutModifier ? `
      <div>
        <button onclick="demanderSuppressionOption(${o.id})" class="text-red-600 hover:underline text-sm font-medium">Supprimer</button>
      </div>` : ''}
    </div>
  `).join('');
}

/* ======================================================
   MODAL CRÉATION
   ====================================================== */
function ouvrirModalOption() {
  document.getElementById('form-option').reset();
  document.getElementById('modal-option').classList.remove('hidden');
}

function fermerModalOption() {
  document.getElementById('modal-option').classList.add('hidden');
}

async function soumettreFormOption(e) {
  e.preventDefault();

  const payload = {
    nom:         document.getElementById('opt-nom').value.trim(),
    description: document.getElementById('opt-description').value.trim() || null,
  };

  const btn = document.getElementById('btn-submit-option');
  btn.disabled = true;
  btn.innerHTML = `<div class="spinner" style="width:14px;height:14px;margin:0;"></div>`;

  try {
    const res  = await fetch('/api/options', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Erreur lors de la création.');

    afficherNotification(data.message || 'Option créée !', 'success');
    fermerModalOption();
    await chargerOptions();
  } catch (err) {
    afficherNotification(err.message, 'error');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Créer';
  }
}

/* ======================================================
   SUPPRESSION
   ====================================================== */
function demanderSuppressionOption(id) {
  optionIdASupprimer = id;
  // Ajout dynamique de la modal de confirmation
  let modalConfirm = document.getElementById('modal-confirmer-option');
  if(!modalConfirm) {
    document.body.insertAdjacentHTML('beforeend', `
    <div id="modal-confirmer-option" class="fixed inset-0 bg-slate-900 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-xl shadow-xl max-w-sm w-full overflow-hidden p-6 text-center">
        <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
          <svg class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
        </div>
        <h3 class="text-lg font-medium text-slate-900 mb-2">Supprimer cette option ?</h3>
        <p class="text-sm text-slate-500 mb-6">Action irréversible.</p>
        <div class="flex justify-center gap-3">
          <button onclick="fermerConfirmOption()" class="bg-white px-4 py-2 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 hover:bg-slate-50">Annuler</button>
          <button id="btn-confirm-suppr-option" class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700">Supprimer</button>
        </div>
      </div>
    </div>`);
    modalConfirm = document.getElementById('modal-confirmer-option');
  }
  modalConfirm.classList.remove('hidden');
  document.getElementById('btn-confirm-suppr-option').onclick = supprimerOption;
}

function fermerConfirmOption() {
  optionIdASupprimer = null;
  const modal = document.getElementById('modal-confirmer-option');
  if(modal) modal.classList.add('hidden');
}

async function supprimerOption() {
  if (!optionIdASupprimer) return;
  const btn = document.getElementById('btn-confirm-suppr-option');
  btn.disabled = true;
  btn.textContent = 'Suppression…';

  try {
    const res  = await fetch(`/api/options/${optionIdASupprimer}`, { method: 'DELETE' });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Erreur lors de la suppression.');

    afficherNotification(data.message || 'Option supprimée !', 'success');
    fermerConfirmOption();
    await chargerOptions();
  } catch (err) {
    afficherNotification(err.message, 'error');
    fermerConfirmOption();
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
  const bgClass = type === 'success' ? 'bg-emerald-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500';
  notif.className = `${bgClass} text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 transform transition-all duration-300 translate-y-8 opacity-0`;
  notif.innerHTML = `
    <span class="text-sm font-medium">${message}</span>
  `;
  container.appendChild(notif);
  
  // Animation CSS
  requestAnimationFrame(() => {
    notif.classList.remove('translate-y-8', 'opacity-0');
  });

  setTimeout(() => {
    notif.classList.add('translate-y-8', 'opacity-0');
    setTimeout(() => notif.remove(), 300);
  }, 4000);
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') { fermerModalOption(); fermerConfirmOption(); }
});
