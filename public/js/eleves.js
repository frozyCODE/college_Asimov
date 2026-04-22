/**
 * eleves.js — Gestion CRUD des élèves via l'API
 */

let eleveIdASupprimer = null;
let tousLesEleves     = [];
let modeEdition       = false;
let pageActuelle      = 1;
let totalPages        = 1;

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
async function chargerEleves(page = 1) {
  try {
    const res = await fetch(`/api/eleves?page=${page}&limit=20`);
    if (!res.ok) throw new Error('Accès refusé ou erreur serveur');
    const result = await res.json();
    console.log('DEBUG Eleves API:', result);
    
    if (!result || !result.meta) {
        // Fallback for old API format or missing meta
        tousLesEleves = Array.isArray(result) ? result : (result.data || []);
        pageActuelle  = 1;
        totalPages    = 1;
        document.getElementById('total-eleves').textContent = tousLesEleves.length;
    } else {
        tousLesEleves = result.data;
        pageActuelle  = result.meta.page;
        totalPages    = result.meta.totalPages;
        document.getElementById('total-eleves').textContent = result.meta.total;
    }

    // Update UI
    document.getElementById('current-page').textContent = pageActuelle;
    document.getElementById('total-pages').textContent  = totalPages;
    
    document.getElementById('btn-prev').disabled = (pageActuelle <= 1);
    document.getElementById('btn-next').disabled = (pageActuelle >= totalPages);

    afficherEleves(tousLesEleves);
  } catch (err) {
    console.error('CRASH Eleves:', err);
    afficherNotification('Impossible de charger les élèves : ' + err.message, 'error');
    document.getElementById('tbody-eleves').innerHTML = `
      <tr><td colspan="6" class="text-center text-muted">Aucune donnée disponible.</td></tr>`;
  }
}

function changerPage(direction) {
  const nouvellePage = pageActuelle + direction;
  if (nouvellePage >= 1 && nouvellePage <= totalPages) {
    chargerEleves(nouvellePage);
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
    <tr class="group hover:bg-white/[0.02] transition-colors">
      <td class="py-10 px-6 first:pl-8">
        <span class="text-[10px] font-mono text-asimov-accent font-bold uppercase tracking-widest">#${e.id}</span>
      </td>
      <td class="py-10 px-6">
        <div class="flex flex-col">
          <span class="text-lg font-clean font-bold text-white leading-tight">${escapeHtml(e.prenom)} ${escapeHtml(e.nom)}</span>
          <span class="text-[9px] font-black uppercase tracking-widest text-asimov-textMuted mt-1">Étudiant</span>
        </div>
      </td>
      <td class="py-10 px-6">
        <span class="text-sm font-medium text-white/50 hover:text-asimov-accent transition-colors">${escapeHtml(e.email)}</span>
      </td>
      <td class="py-10 px-6">
        <span class="px-3 py-1 bg-white/5 rounded-lg text-[10px] font-black uppercase tracking-widest text-white/40">${escapeHtml(e.identifiant_csv || '—')}</span>
      </td>
      <td class="py-10 px-6">
        <span class="text-sm font-bold text-white/60">${e.referent_id ? '#' + e.referent_id : '—'}</span>
      </td>
      ${peutModifier ? `
      <td class="py-10 px-6 text-right last:pr-8">
        <div class="flex items-center justify-end gap-3 opacity-60 group-hover:opacity-100 transition-opacity">
          <button onclick="ouvrirModalEdition(${e.id})" class="p-2 bg-white/5 text-white/50 hover:text-white hover:bg-white/10 rounded-lg transition-all" title="Modifier">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
          </button>
          <button onclick="demanderSuppression(${e.id})" class="p-2 bg-white/5 text-white/50 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all" title="Supprimer">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
          </button>
        </div>
      </td>
` : ''}
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
  document.getElementById('eleve-ref').value        = eleve.referant_id || '';
  document.getElementById('group-password').style.display = 'none';
  document.getElementById('eleve-password').required = false;
  document.getElementById('modal-eleve').classList.remove('hidden');
}

function fermerModal() {
  document.getElementById('modal-eleve').classList.add('hidden');
}

function demanderSuppression(id) {
  eleveIdASupprimer = id;
  document.getElementById('modal-confirm').classList.remove('hidden');
  document.getElementById('btn-confirm-suppr').onclick = supprimerEleve;
}

function fermerConfirmation() {
  eleveIdASupprimer = null;
  document.getElementById('modal-confirm').classList.add('hidden');
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
    referant:        document.getElementById('eleve-ref').value || null,
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
