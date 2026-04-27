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
    document.getElementById('grid-options').innerHTML =
      `<div class="col-span-full py-12 text-center text-asimov-textMuted italic">Impossible de charger les options.</div>`;
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
    <div class="bg-white/5 border border-white/10 p-12 rounded-[2.5rem] flex flex-col justify-between group hover:border-asimov-accent/50 transition-all duration-500 hover:shadow-glow">
      <div class="space-y-6">
        <h3 class="text-2xl font-wide font-black uppercase tracking-widest text-white mb-2 leading-none">${escapeHtml(o.nom || '—')}</h3>
        <div class="w-12 h-1 bg-asimov-accent mb-6"></div>
        <p class="text-sm font-medium text-asimov-textMuted leading-relaxed max-w-[90%]">${escapeHtml(o.description || 'Catalogue de formations spécialisées.')}</p>
      </div>
      <div class="mt-12 flex justify-between items-center bg-white/5 p-4 rounded-2xl">
        <span class="text-[9px] font-black uppercase tracking-widest text-asimov-textMuted/50">Réf. ADM-${o.id}</span>
        ${peutModifier ? `
          <button onclick="demanderSuppressionOption(${o.id})" class="text-red-500 hover:text-red-400 p-2 opacity-40 group-hover:opacity-100 transition-all" title="Supprimer">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
          </button>
        ` : ''}
      </div>
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
    nom:         document.getElementById('option-nom').value.trim(),
    description: document.getElementById('option-detail').value.trim() || null,
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
    <div id="modal-confirmer-option" class="fixed inset-0 bg-asimov-bg/90 backdrop-blur-sm flex items-center justify-center p-6 z-[200]">
      <div class="bg-asimov-bgSecondary p-10 rounded-2xl border border-white/10 max-w-sm w-full text-center">
        <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-2xl bg-red-500/10 border border-red-500/20 mb-6">
          <svg class="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
        </div>
        <h3 class="text-2xl font-black uppercase tracking-tighter text-white mb-4">Supprimer ?</h3>
        <p class="text-sm text-asimov-textMuted font-medium mb-8">Cette action est définitive et effacera l'option du registre.</p>
        <div class="flex justify-center gap-4">
          <button onclick="fermerConfirmOption()" class="px-6 py-3 bg-white/5 text-white rounded-xl font-bold hover:bg-white/10 transition-colors">Annuler</button>
          <button id="btn-confirm-suppr-option" class="px-8 py-3 bg-red-600 text-white rounded-xl font-bold shadow-lg shadow-red-600/20 hover:bg-red-700 transition-all text-sm uppercase tracking-widest">Confirmer</button>
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
