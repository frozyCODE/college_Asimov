/**
 * moyennes.js — Gestion des moyennes par dossier élève
 */

let allEleves = [];
let currentInscriptionId = null;

document.addEventListener("DOMContentLoaded", async () => {
  await initPage();

  document
    .getElementById("select-student")
    .addEventListener("change", handleStudentSelection);
  document
    .getElementById("select-inscription")
    .addEventListener("change", handleInscriptionSelection);
  document
    .getElementById("form-add-grade")
    .addEventListener("submit", handleAddGrade);
});

/* ======================================================
   INITIALISATION
   ====================================================== */
async function initPage() {
  try {
    const res = await fetch("/api/eleves");
    if (!res.ok) throw new Error("Impossible de charger les élèves");
    allEleves = await res.json();

    const select = document.getElementById("select-student");
    select.innerHTML =
      '<option value="">Choisir un élève...</option>' +
      allEleves
        .map(
          (e) =>
            `<option value="${e.id}">${e.prenom} ${e.nom} (#${e.id})</option>`,
        )
        .join("");
  } catch (err) {
    afficherNotification(err.message, "error");
  }
}

/* ======================================================
   SELECTION HANDLING
   ====================================================== */
async function handleStudentSelection(e) {
  const studentId = e.target.value;
  const selectInsc = document.getElementById("select-inscription");

  // Reset
  currentInscriptionId = null;
  selectInsc.innerHTML = '<option value="">Choisir une session...</option>';
  selectInsc.disabled = true;
  updateFormState(false);
  clearTable();

  if (!studentId) return;

  try {
    const res = await fetch(`/api/inscriptions/eleve/${studentId}`);
    if (!res.ok) throw new Error("Impossible de charger les inscriptions");
    const inscriptions = await res.json();

    if (inscriptions.length === 0) {
      selectInsc.innerHTML =
        '<option value="">Aucune inscription trouvée</option>';
      return;
    }

    selectInsc.disabled = false;
    selectInsc.innerHTML += inscriptions
      .map(
        (i) => `
            <option value="${i.id}">${i.annee_scolaire} — ${i.niveau}ème ${i.lettre_classe || ""}</option>
        `,
      )
      .join("");
  } catch (err) {
    afficherNotification(err.message, "error");
  }
}

async function handleInscriptionSelection(e) {
  currentInscriptionId = e.target.value;

  if (!currentInscriptionId) {
    updateFormState(false);
    clearTable();
    return;
  }

  updateFormState(true);
  await chargerMoyennes();
}

/* ======================================================
   DATA LOADING
   ====================================================== */
async function chargerMoyennes() {
  if (!currentInscriptionId) return;

  try {
    const res = await fetch(
      `/api/moyennes/inscription/${currentInscriptionId}`,
    );
    if (!res.ok) throw new Error("Erreur lors du chargement des notes");
    const averages = await res.json();

    afficherTableau(averages);
  } catch (err) {
    afficherNotification(err.message, "error");
  }
}

function afficherTableau(liste) {
  const tbody = document.getElementById("tbody-moyennes");

  if (liste.length === 0) {
    tbody.innerHTML = `<tr><td colspan="3" class="py-20 text-center text-white/20 text-[10px] font-black uppercase tracking-widest">Aucune note saisie pour ce semestre</td></tr>`;
    return;
  }

  tbody.innerHTML = liste
    .map(
      (moy) => `
        <tr class="group hover:bg-white/[0.02] transition-colors">
            <td class="py-10 px-12 first:pl-12">
                <span class="px-4 py-2 bg-white/5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-asimov-accent">
                    Semestre ${moy.semestre}
                </span>
            </td>
            <td class="py-10 px-8">
                <div class="flex items-end gap-1">
                    <span class="text-4xl font-clean font-black text-white leading-none">${Number(moy.moyenne_generale).toFixed(2)}</span>
                    <span class="text-xs font-bold text-white/20 mb-1">/20</span>
                </div>
            </td>
            <td class="py-10 px-8 text-right last:pr-12">
                <div class="flex items-center justify-end gap-3">
                    ${
                      moy.validee_par_proviseur
                        ? `<span class="flex items-center gap-2 text-emerald-500 text-[10px] font-black uppercase tracking-widest">
                             <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
                             Validée
                           </span>`
                        : `<span class="text-white/30 text-[10px] font-black uppercase tracking-widest">En attente</span>`
                    }
                    <div class="flex items-center gap-2 ml-4">
                        ${
                          ROLE_UTILISATEUR === "Proviseur" &&
                          !moy.validee_par_proviseur
                            ? `
                            <button onclick="validerMoyenne(${moy.id})" class="px-4 py-2 bg-asimov-accent text-white rounded-lg text-[9px] font-black uppercase tracking-widest shadow-glow active:scale-95 transition-all">
                                Valider
                            </button>
                        `
                            : ""
                        }
                        ${
                          ROLE_UTILISATEUR === "Proviseur"
                            ? `
                            <button onclick="supprimerMoyenne(${moy.id})" class="p-2 text-white/10 hover:text-red-500 transition-colors" title="Supprimer">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                            </button>
                        `
                            : ""
                        }
                    </div>
                </div>
            </td>
        </tr>
    `,
    )
    .join("");
}

/* ======================================================
   ACTIONS
   ====================================================== */
async function handleAddGrade(e) {
  e.preventDefault();
  if (!currentInscriptionId) return;

  const payload = {
    inscription_id: parseInt(currentInscriptionId),
    semestre: parseInt(document.getElementById("new-grade-sem").value),
    moyenne_generale: parseFloat(
      document.getElementById("new-grade-val").value,
    ),
  };

  try {
    const res = await fetch("/api/moyennes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Erreur lors de l'ajout");

    afficherNotification("Note enregistrée !", "success");
    document.getElementById("form-add-grade").reset();
    await chargerMoyennes();
  } catch (err) {
    afficherNotification(err.message, "error");
  }
}

async function validerMoyenne(id) {
  try {
    const res = await fetch(`/api/moyennes/${id}/valider`, { method: "PATCH" });
    if (!res.ok) throw new Error("Erreur lors de la validation");

    afficherNotification("Moyenne validée !", "success");
    await chargerMoyennes();
  } catch (err) {
    afficherNotification(err.message, "error");
  }
}

async function supprimerMoyenne(id) {
  if (
    !confirm(
      "Attention : Supprimer cette moyenne générale ? Cette action est réservée au Proviseur pour correction.",
    )
  )
    return;

  try {
    const res = await fetch(`/api/moyennes/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Erreur lors de la suppression");

    afficherNotification("Moyenne supprimée", "success");
    await chargerMoyennes();
  } catch (err) {
    afficherNotification(err.message, "error");
  }
}

/* ======================================================
   UI HELPERS
   ====================================================== */
function updateFormState(enabled) {
  const form = document.getElementById("form-add-grade");
  if (enabled) {
    form.classList.remove("opacity-30", "pointer-events-none");
  } else {
    form.classList.add("opacity-30", "pointer-events-none");
  }
}

function clearTable() {
  document.getElementById("tbody-moyennes").innerHTML = `
        <tr><td colspan="3" class="py-32 px-12 text-center text-asimov-textMuted uppercase tracking-widest text-[10px]">Veuillez sélectionner un dossier pour afficher les résultats...</td></tr>
    `;
}

function afficherNotification(message, type = "success") {
  const container =
    document.getElementById("notification-container") ||
    (function () {
      const c = document.createElement("div");
      c.id = "notification-container";
      c.className = "fixed bottom-8 right-8 z-[200] flex flex-col gap-3";
      document.body.appendChild(c);
      return c;
    })();

  const notif = document.createElement("div");
  const bgClass = type === "success" ? "bg-emerald-500" : "bg-red-500";
  notif.className = `${bgClass} text-white px-8 py-4 rounded-2xl shadow-glow-lg text-sm font-black uppercase tracking-widest animate-in fade-in slide-in-from-right-8`;
  notif.textContent = message;
  container.appendChild(notif);

  setTimeout(() => {
    notif.classList.add("animate-out", "fade-out", "slide-out-to-right-8");
    setTimeout(() => notif.remove(), 500);
  }, 4000);
}
