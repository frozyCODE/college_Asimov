/**
 * classes.js — Gestion des classes et effectifs via l'API
 */

let selectedClasseId = null;

document.addEventListener('DOMContentLoaded', () => {
    const formCreate = document.getElementById('form-create-classe');
    if (formCreate) formCreate.addEventListener('submit', handleCreateClasse);
});

/* ======================================================
   CLASSES ACTIONS
   ====================================================== */

async function handleCreateClasse(e) {
    e.preventDefault();
    const payload = {
        annee_scolaire: document.getElementById('cls-annee').value.trim(),
        niveau: parseInt(document.getElementById('cls-niveau').value),
        lettre: document.getElementById('cls-lettre').value.trim().toUpperCase()
    };

    try {
        const res = await fetch('/api/classes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Erreur lors de la création');

        afficherNotification('Classe créée avec succès !', 'success');
        setTimeout(() => location.reload(), 1000);
    } catch (err) {
        afficherNotification(err.message, 'error');
    }
}

async function deleteClasse(id) {
    if (!confirm('Voulez-vous vraiment supprimer cette classe ?')) return;

    try {
        const res = await fetch(`/api/classes/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Erreur lors de la suppression');

        afficherNotification('Classe supprimée', 'success');
        setTimeout(() => location.reload(), 1000);
    } catch (err) {
        afficherNotification(err.message, 'error');
    }
}

/* ======================================================
   EFFECTIF MANAGEMENT
   ====================================================== */

async function selectClasse(id, name) {
    selectedClasseId = id;
    
    // UI Update
    document.getElementById('selected-classe-name').textContent = name;
    document.getElementById('effectif-empty').classList.add('hidden');
    document.getElementById('effectif-container').classList.remove('hidden');

    // Highlight selected row
    document.querySelectorAll('#tbody-classes tr').forEach(tr => {
        tr.classList.remove('bg-asimov-accent/10', 'border-l-4', 'border-asimov-accent');
    });
    // Finding the clicked row (the event might not trigger exactly on the row but on a child)
    const targetRow = Array.from(document.querySelectorAll('#tbody-classes tr')).find(tr => tr.innerHTML.includes(`#${id}`));
    if(targetRow) targetRow.classList.add('bg-asimov-accent/10', 'border-l-4', 'border-asimov-accent');

    await chargerEffectif();
}

async function chargerEffectif() {
    if (!selectedClasseId) return;

    try {
        const res = await fetch(`/api/inscriptions/classe/${selectedClasseId}`);
        if (!res.ok) throw new Error('Impossible de charger l\'effectif');
        const students = await res.json();

        const list = document.getElementById('list-effectif');
        document.getElementById('effectif-count').textContent = `${students.length} ÉLÈVES`;

        list.innerHTML = students.map(s => `
            <li class="bg-white/5 p-4 rounded-xl flex justify-between items-center group transition-all hover:bg-white/10">
                <div class="flex items-center gap-4">
                    <div class="w-8 h-8 rounded-lg bg-asimov-accent/20 flex items-center justify-center text-asimov-accent font-black text-[10px]">
                        ${s.prenom.charAt(0)}${s.nom.charAt(0)}
                    </div>
                    <div class="flex flex-col">
                        <span class="text-sm font-bold text-white">${s.prenom} ${s.nom}</span>
                        <span class="text-[9px] text-white/30 uppercase tracking-widest">${s.email}</span>
                    </div>
                </div>
                <button onclick="retirerEleve(${s.id})" class="p-2 text-white/10 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path></svg>
                </button>
            </li>
        `).join('');

        if (students.length === 0) {
            list.innerHTML = `<li class="py-12 text-center text-white/20 text-[9px] font-black uppercase tracking-widest">Aucun élève inscrit</li>`;
        }
    } catch (err) {
        afficherNotification(err.message, 'error');
    }
}

async function inscrireEleve() {
    const eleveId = document.getElementById('select-new-eleve').value;
    if (!eleveId || !selectedClasseId) return;

    try {
        const res = await fetch('/api/inscriptions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                eleve_id: parseInt(eleveId),
                classe_id: selectedClasseId
            })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Erreur lors de l\'inscription');

        afficherNotification('Élève inscrit !', 'success');
        chargerEffectif();
    } catch (err) {
        afficherNotification(err.message, 'error');
    }
}

async function retirerEleve(inscriptionId) {
    if (!confirm('Retirer l\'élève de cette classe ?')) return;

    try {
        const res = await fetch(`/api/inscriptions/${inscriptionId}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Erreur lors de l\'opération');

        afficherNotification('Élève retiré', 'success');
        chargerEffectif();
    } catch (err) {
        afficherNotification(err.message, 'error');
    }
}

/* ======================================================
   UTILITAIRES
   ====================================================== */

function afficherNotification(message, type = 'success') {
    const container = document.getElementById('notification-container');
    const notif = document.createElement('div');
    const bgClass = type === 'success' ? 'bg-emerald-500' : 'bg-red-500';
    notif.className = `${bgClass} text-white px-6 py-3 rounded-xl shadow-glow text-sm font-bold animate-in slide-in-from-right-full`;
    notif.textContent = message;
    container.appendChild(notif);
    setTimeout(() => notif.remove(), 4000);
}
