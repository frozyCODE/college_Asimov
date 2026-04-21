/**
 * login.js — Gestion du formulaire de connexion
 */
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form-login');
  const btn  = document.getElementById('btn-login');

  if (!form) return;

  form.addEventListener('submit', () => {
    btn.disabled = true;
    btn.innerHTML = `<div class="spinner" style="width:16px;height:16px;margin:0;"></div> Connexion…`;
  });
});
