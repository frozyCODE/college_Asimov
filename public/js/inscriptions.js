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
    <tr class="border-b border-gray-200">
      <td class="py-2 px-4 border-r border-gray-200">${insc.id}</td>
      <td class="py-2 px-4 border-r border-gray-200">${escapeHtml(insc.annee_scolaire || '—')}</td>
      <td class="py-2 px-4 border-r border-gray-200">${escapeHtml(insc.niveau ? insc.niveau + 'ème' : '—')}</td>
      <td class="py-2 px-4 border-r border-gray-200">${escapeHtml(insc.niveau && insc.lettre_classe ? insc.niveau + 'ème ' + insc.lettre_classe : insc.lettre_classe || '—')}</td>
      ${peutModifier ? `
      <td class="py-2 px-4 text-right">
        <button onclick="demanderSuppressionInsc(${insc.id})" class="text-red-600 hover:underline text-sm font-medium">Supprimer</button>
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
