/**
 * inscriptions.js — Gestion des inscriptions via l'API
 */

let inscriptionIdASupprimer = null;

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form-inscription');
  if (form) form.addEventListener('submit', soumettreFormInscription);

  const input = document.getElementById('input-eleve-id');
  if (input) {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') rechercherInscriptions();
    });
  }
});

/* ======================================================
   RECHERCHE
   ====================================================== */
async function rechercherInscriptions() {
  const eleveId = document.getElementById('input-eleve-id').value.trim();
  if (!eleveId) {
    afficherNotification('Veuillez saisir un ID d\'élève.', 'error');
    return;
  }

  const btn = document.getElementById('btn-rechercher-insc');
  btn.disabled = true;

  try {
    const res = await fetch(`/api/inscriptions/eleve/${eleveId}`);
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Erreur lors de la récupération.');
    }
    const liste = await res.json();
    afficherInscriptions(liste, eleveId);
  } catch (err) {
    afficherNotification(err.message, 'error');
  } finally {
    btn.disabled = false;
  }
}

/* ======================================================
   AFFICHAGE
   ====================================================== */
function afficherInscriptions(liste, eleveId) {
  const tbody        = document.getElementById('tbody-inscriptions');
  const peutModifier = ['Secretariat', 'Proviseur'].includes(ROLE_UTILISATEUR);
  const cols         = peutModifier ? 5 : 4;

  if (liste.length === 0) {
    tbody.innerHTML = `<tr><td colspan="${cols}" class="px-6 py-8 text-center text-sm text-slate-500">Aucune inscription pour l'élève #${eleveId}.</td></tr>`;
    return;
  }

  tbody.innerHTML = liste.map((insc) => `
    <tr class="group hover:bg-white/[0.02] transition-colors">
      <td class="py-10 px-6 first:pl-8">
        <span class="text-[10px] font-mono text-asimov-accent font-bold uppercase tracking-widest">#${insc.id}</span>
      </td>
      <td class="py-10 px-6">
        <div class="flex flex-col">
          <span class="text-sm font-clean font-bold text-white">ID Élève #${eleveId}</span>
          <span class="text-[9px] font-black uppercase tracking-widest text-white/30 mt-1">Dossier Actif</span>
        </div>
      </td>
      <td class="py-10 px-6">
        <div class="flex flex-col">
          <span class="text-lg font-clean font-black text-white leading-tight uppercase">${escapeHtml(insc.niveau && insc.lettre_classe ? insc.niveau + 'ème ' + insc.lettre_classe : insc.lettre_classe || '—')}</span>
          <span class="text-[9px] font-black uppercase tracking-widest text-white/30 mt-1">${escapeHtml(insc.annee_scolaire || '—')}</span>
        </div>
      </td>
      <td class="py-10 px-6">
        <span class="px-3 py-1 bg-asimov-accent/10 border border-asimov-accent/20 rounded-lg text-[10px] font-black uppercase tracking-widest text-asimov-accent">Inscrit</span>
      </td>
      ${peutModifier ? `
      <td class="py-10 px-6 text-right last:pr-8">
        <div class="flex items-center justify-end gap-3 opacity-60 group-hover:opacity-100 transition-opacity">
          <button onclick="demanderSuppressionInsc(${insc.id})" class="p-2 bg-white/5 text-white/50 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all" title="Désinscrire">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
          </button>
        </div>
      </td>` : ''}
    </tr>
  `).join('');
}

/* ======================================================
   MODAL INSCRIPTION
   ====================================================== */
function ouvrirModalInscription() {
  const eleveId = document.getElementById('input-eleve-id').value.trim();
  if (eleveId) document.getElementById('insc-eleve-id').value = eleveId;
  document.getElementById('form-inscription').reset();
  document.getElementById('modal-inscription').classList.remove('hidden');
}

function fermerModalInscription() {
  document.getElementById('modal-inscription').classList.add('hidden');
}

async function soumettreFormInscription(e) {
  e.preventDefault();

  const payload = {
    eleve_id:      parseInt(document.getElementById('insc-eleve-id').value),
    annee_scolaire: document.getElementById('insc-annee').value.trim(),
    niveau:        parseInt(document.getElementById('insc-niveau').value),
    lettre_classe: document.getElementById('insc-lettre').value,
  };

  const btn = document.getElementById('btn-submit-inscription');
  btn.disabled = true;
  btn.innerHTML = `<div class="spinner" style="width:14px;height:14px;margin:0;"></div>`;

  try {
    const res  = await fetch('/api/inscriptions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Erreur lors de l\'inscription.');

    afficherNotification(data.message || 'Inscription créée !', 'success');
    fermerModalInscription();
    document.getElementById('input-eleve-id').value = payload.eleve_id;
    await rechercherInscriptions();
  } catch (err) {
    afficherNotification(err.message, 'error');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Inscrire';
  }
}

/* ======================================================
   SUPPRESSION
   ====================================================== */
function demanderSuppressionInsc(id) {
  inscriptionIdASupprimer = id;
  document.getElementById('modal-confirm-insc').classList.remove('hidden');
  document.getElementById('btn-confirm-suppr-insc').onclick = supprimerInscription;
}

function fermerConfirmInsc() {
  inscriptionIdASupprimer = null;
  document.getElementById('modal-confirm-insc').classList.add('hidden');
}

async function supprimerInscription() {
  if (!inscriptionIdASupprimer) return;
  const btn = document.getElementById('btn-confirm-suppr-insc');
  btn.disabled = true;
  btn.textContent = 'Suppression…';

  try {
    const res  = await fetch(`/api/inscriptions/${inscriptionIdASupprimer}`, { method: 'DELETE' });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Erreur lors de la suppression.');

    afficherNotification(data.message || 'Inscription supprimée !', 'success');
    fermerConfirmInsc();
    await rechercherInscriptions();
  } catch (err) {
    afficherNotification(err.message, 'error');
    fermerConfirmInsc();
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

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') { fermerModalInscription(); fermerConfirmInsc(); }
});
