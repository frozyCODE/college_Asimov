/**
 * moyennes.js — Consultation et saisie des moyennes via l'API
 */

let moyennesEnCours = [];

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form-moyenne');
  if (form) form.addEventListener('submit', soumettreFormMoyenne);

  // Déclencher la recherche avec Entrée
  const input = document.getElementById('input-inscription-id');
  if (input) {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') rechercherMoyennes();
    });
  }
});

/* ======================================================
   RECHERCHE
   ====================================================== */
async function rechercherMoyennes() {
  const inscriptionId = document.getElementById('input-inscription-id').value.trim();
  if (!inscriptionId) {
    afficherNotification('Veuillez saisir un ID d\'inscription.', 'error');
    return;
  }

  const btnRechercher = document.getElementById('btn-rechercher-moyennes');
  btnRechercher.disabled = true;

  try {
    const res = await fetch(`/api/moyennes/inscription/${inscriptionId}`);
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Erreur lors de la récupération des moyennes.');
    }

    moyennesEnCours = await res.json();
    afficherMoyennes(moyennesEnCours, inscriptionId);
  } catch (err) {
    afficherNotification(err.message, 'error');
  } finally {
    btnRechercher.disabled = false;
  }
}

/* ======================================================
   AFFICHAGE
   ====================================================== */
function afficherMoyennes(liste, inscId) {
  const tbody = document.getElementById('tbody-moyennes');
  const peutValider = (ROLE_UTILISATEUR === 'Proviseur');
  const cols = peutValider ? 4 : 3;

  if (liste.length === 0) {
    tbody.innerHTML = `<tr><td colspan="${cols}" class="px-6 py-8 text-center text-sm text-slate-500">Aucune moyenne semestrielle trouvée.</td></tr>`;
    return;
  }

  tbody.innerHTML = liste.map((moy) => {
    let statusText  = moy.validee_par_proviseur ? 'Validée' : 'En attente';
    let statusColor = moy.validee_par_proviseur ? 'text-asimov-accent' : 'text-asimov-textMuted';

    return `
    <tr class="group hover:bg-white/[0.02] transition-colors">
      <td class="py-10 px-6 first:pl-8">
        <span class="text-[10px] font-mono text-asimov-accent/70 uppercase tracking-widest">#${moy.id}</span>
      </td>
      <td class="py-10 px-6">
        <span class="text-sm font-clean font-bold text-white">ID Insc. ${moy.inscription_id}</span>
      </td>
      <td class="py-10 px-6">
        <span class="px-3 py-1 bg-white/5 rounded-lg text-[10px] font-black uppercase tracking-widest text-white/50">Semestre ${moy.semestre}</span>
      </td>
      <td class="py-10 px-6">
        <span class="text-2xl font-clean font-black text-white leading-none">${Number(moy.moyenne_generale).toFixed(2)}</span>
        <span class="text-[10px] font-bold text-white/30 ml-1">/20</span>
      </td>
      ${ROLE_UTILISATEUR === 'Proviseur' ? `
      <td class="py-10 px-6 text-right last:pr-8">
        ${!moy.validee_par_proviseur ? `
          <button onclick="validerMoyenne(${moy.id})" class="px-6 py-2 bg-asimov-accent/10 border border-asimov-accent/30 text-asimov-accent hover:bg-asimov-accent hover:text-white rounded-lg text-[10px] font-black uppercase tracking-widest transition-all">Valider</button>
        ` : `
          <div class="flex items-center justify-end gap-2 text-asimov-accent">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
            <span class="text-[9px] font-black uppercase tracking-[0.2em]">Archivé</span>
          </div>
        `}
      </td>` : (ROLE_UTILISATEUR === 'Secretariat' ? `
      <td class="py-10 px-6 text-right last:pr-8">
         <span class="text-[9px] font-black uppercase tracking-[0.2em] ${statusColor}">${statusText}</span>
      </td>` : '')}
    </tr>`;
  }).join('');
}

/* ======================================================
   SAISIE MOYENNE
   ====================================================== */
function ouvrirModalSaisie() {
  const inscriptionId = document.getElementById('input-inscription-id').value.trim();
  if (inscriptionId) {
    document.getElementById('moy-inscription-id').value = inscriptionId;
  }
  document.getElementById('modal-moyenne').classList.remove('hidden');
}

function fermerModalMoyenne() {
  document.getElementById('modal-moyenne').classList.add('hidden');
  document.getElementById('form-moyenne').reset();
}

async function soumettreFormMoyenne(e) {
  e.preventDefault();

  const payload = {
    inscription_id:    parseInt(document.getElementById('moy-inscription-id').value),
    semestre:          document.getElementById('moy-semestre').value,
    moyenne_generale:  parseFloat(document.getElementById('moy-valeur').value),
  };

  const btn = document.getElementById('btn-submit-moyenne');
  btn.disabled = true;
  btn.innerHTML = `<div class="spinner" style="width:14px;height:14px;margin:0;"></div>`;

  try {
    const res  = await fetch('/api/moyennes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();

    if (!res.ok) throw new Error(data.message || 'Erreur lors de la saisie.');

    afficherNotification(data.message || 'Moyenne enregistrée !', 'success');
    fermerModalMoyenne();

    // Recharger les moyennes de cette inscription
    if (payload.inscription_id) {
      document.getElementById('input-inscription-id').value = payload.inscription_id;
      await rechercherMoyennes();
    }
  } catch (err) {
    afficherNotification(err.message, 'error');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Enregistrer';
  }
}

/* ======================================================
   VALIDATION (Proviseur)
   ====================================================== */
async function validerMoyenne(id) {
  try {
    const res  = await fetch(`/api/moyennes/${id}/valider`, { method: 'PATCH' });
    const data = await res.json();

    if (!res.ok) throw new Error(data.message || 'Erreur lors de la validation.');

    afficherNotification(data.message || 'Moyenne validée !', 'success');
    await rechercherMoyennes();
  } catch (err) {
    afficherNotification(err.message, 'error');
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
  if (e.key === 'Escape') fermerModalMoyenne();
});
