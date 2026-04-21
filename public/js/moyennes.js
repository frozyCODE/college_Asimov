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

    return `
    <tr class="border-b border-gray-200">
      <td class="py-2 px-4 border-r border-gray-200">S${moy.semestre}</td>
      <td class="py-2 px-4 border-r border-gray-200 font-bold">${Number(moy.moyenne_generale).toFixed(2)}</td>
      <td class="py-2 px-4 border-r border-gray-200">${statusText}</td>
      ${peutValider ? `
      <td class="py-2 px-4 text-right">
        ${!moy.validee_par_proviseur ? `
        <button onclick="validerMoyenne(${moy.id})" class="text-green-600 hover:underline text-sm font-medium">Valider</button>
        ` : `
        <span class="text-green-600 font-bold uppercase text-xs">V</span>
        `}
      </td>` : ''}
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
