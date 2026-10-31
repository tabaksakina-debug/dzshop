// =============================================================
// commande.js — la page de commande (commande.html)
// -------------------------------------------------------------
// 1. affiche le récapitulatif du panier
// 2. remplit la liste des wilayas (demandée au serveur)
// 3. à l'envoi du formulaire : POST /api/commandes, puis confirmation
// =============================================================

// ---------- 1. Les éléments de la page ----------
const zoneCommande = document.querySelector('#zone-commande');
const formCommande = document.querySelector('#form-commande');
const recap = document.querySelector('#recap-commande');
const selectWilaya = document.querySelector('#wilaya');
const zoneErreur = document.querySelector('#erreur-commande');
const btnValider = document.querySelector('#btn-valider');

// ---------- 2. Le récapitulatif du panier ----------
function afficherRecap() {
  const panier = lirePanier();
  let lignes = '';

  for (let i = 0; i < panier.length; i++) {
    const produit = trouverProduit(panier[i].id);
    if (produit !== undefined) {
      lignes = lignes + `<p class="recap-ligne"><span>${panier[i].quantite} × ${produit.nom}</span><span>${formaterPrix(produit.prix * panier[i].quantite)}</span></p>`;
    }
  }

  recap.innerHTML = `
    <h2>Récapitulatif</h2>
    ${lignes}
    <p class="resume-total">Total : <strong>${formaterPrix(totalPanier())}</strong></p>
  `;
}

// ---------- 3. La liste des wilayas, demandée au serveur ----------
async function chargerWilayas() {
  const reponse = await fetch('/api/wilayas');
  const wilayas = await reponse.json();

  for (let i = 0; i < wilayas.length; i++) {
    const option = document.createElement('option');
    option.value = wilayas[i];
    // « 16 - Alger » : le numéro de la wilaya, c'est sa position dans la liste + 1
    option.textContent = String(i + 1).padStart(2, '0') + ' - ' + wilayas[i];
    selectWilaya.appendChild(option);
  }
}

// ---------- 4. L'envoi de la commande ----------
async function envoyerCommande(event) {
  event.preventDefault();   // pas de rechargement de la page
  zoneErreur.textContent = '';

  // Ce qu'on envoie : les infos de livraison + QUOI et COMBIEN (jamais les prix)
  const commande = {
    client: {
      nom: document.querySelector('#nom').value,
      telephone: document.querySelector('#telephone').value,
      wilaya: selectWilaya.value,
      adresse: document.querySelector('#adresse').value
    },
    articles: lirePanier()   // [ { id: 'p3', quantite: 2 }, ... ]
  };

  btnValider.disabled = true;
  btnValider.textContent = 'Envoi en cours…';

  try {
    const reponse = await fetch('/api/commandes', {
      method: 'POST',                                     // on ENVOIE des données
      headers: { 'Content-Type': 'application/json' },    // « ce que je t'envoie est du JSON »
      body: JSON.stringify(commande)                      // l'objet → texte JSON
    });
    const resultat = await reponse.json();

    // reponse.ok vaut true pour les codes 200 à 299 (ici 201 = créé)
    if (!reponse.ok) {
      zoneErreur.textContent = '⚠️ ' + resultat.message;   // le message envoyé par le serveur
      return;
    }

    viderPanier();
    afficherConfirmation(resultat);
  } catch (erreur) {
    zoneErreur.textContent = '⚠️ Impossible de joindre le serveur. Réessaie dans un instant.';
  } finally {
    // « finally » s'exécute dans tous les cas : réussite, erreur, ou return
    btnValider.disabled = false;
    btnValider.textContent = 'Valider la commande';
  }
}

// ---------- 5. L'écran de confirmation ----------
function afficherConfirmation(resultat) {
  // Un numéro court et lisible : les 6 derniers caractères de l'identifiant MongoDB
  const numero = String(resultat.numero).slice(-6).toUpperCase();

  zoneCommande.innerHTML = `
    <div class="confirmation">
      <p class="confirmation-icone">✅</p>
      <h2>Merci, ta commande est enregistrée !</h2>
      <p>Commande n° <strong id="numero-commande">${numero}</strong></p>
      <p>Total à payer à la livraison : <strong id="total-commande">${formaterPrix(resultat.total)}</strong></p>
      <p>Nous t'appellerons pour confirmer la livraison.</p>
      <a class="btn btn-principal" href="index.html">Retour au catalogue</a>
    </div>
  `;
}

// ---------- 6. Au chargement de la page ----------
async function demarrer() {
  // Panier vide : rien à commander
  if (lirePanier().length === 0) {
    zoneCommande.innerHTML = `
      <div class="vide">
        <p>Ton panier est vide.</p>
        <a class="btn btn-principal" href="index.html">Voir le catalogue</a>
      </div>
    `;
    return;
  }

  try {
    await chargerProduits();   // pour connaître les noms et les prix du récapitulatif
    await chargerWilayas();
    afficherRecap();
  } catch (erreur) {
    zoneCommande.innerHTML = '<p class="vide">😕 Impossible de charger la page. Le serveur est-il lancé ?</p>';
    return;
  }

  formCommande.addEventListener('submit', envoyerCommande);
}

demarrer();