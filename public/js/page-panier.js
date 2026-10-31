// =============================================================
// page-panier.js — affiche le contenu du panier (panier.html)
// -------------------------------------------------------------
// Les fonctions du panier (lirePanier, ajouterAuPanier…) sont
// dans panier.js. Ici, on s'occupe seulement de l'AFFICHAGE.
// =============================================================

const zonePanier = document.querySelector('#zone-panier');

// ---------- 1. Fabrique le HTML d'UNE ligne du panier ----------
function creerLigne(ligne) {
  // La ligne ne contient que { id, quantite } : on va chercher le reste dans le catalogue
  const produit = trouverProduit(ligne.id);

  // Produit disparu du catalogue : on n'affiche rien pour cette ligne
  if (produit === undefined) {
    return '';
  }

  const sousTotal = produit.prix * ligne.quantite;

  return `
    <article class="ligne-panier">
      <img src="${produit.image}" alt="${produit.nom}">
      <div class="ligne-infos">
        <a href="produit.html?id=${produit.id}">${produit.nom}</a>
        <span class="ligne-prix-unitaire">${formaterPrix(produit.prix)} l'unité</span>
      </div>
      <div class="ligne-quantite">
        <button type="button" class="btn-moins" data-id="${produit.id}" aria-label="Diminuer la quantité">−</button>
        <span>${ligne.quantite}</span>
        <button type="button" class="btn-plus" data-id="${produit.id}" aria-label="Augmenter la quantité">+</button>
      </div>
      <strong class="ligne-sous-total">${formaterPrix(sousTotal)}</strong>
      <button type="button" class="btn-supprimer" data-id="${produit.id}" aria-label="Retirer du panier">🗑️</button>
    </article>
  `;
}

// ---------- 2. Affiche tout le panier ----------
function afficherPanier() {
  const panier = lirePanier();

  // Cas spécial : le panier est vide
  if (panier.length === 0) {
    zonePanier.innerHTML = `
      <div class="vide">
        <p>Ton panier est vide.</p>
        <a class="btn btn-principal" href="index.html">Voir le catalogue</a>
      </div>
    `;
    return;
  }

  let lignes = '';
  for (let i = 0; i < panier.length; i++) {
    lignes = lignes + creerLigne(panier[i]);
  }

  zonePanier.innerHTML = `
    <div class="lignes-panier">${lignes}</div>
    <aside class="resume-panier">
      <p>Articles : <strong id="resume-articles">${compterArticles()}</strong></p>
      <p class="resume-total">Total : <strong id="resume-total">${formaterPrix(totalPanier())}</strong></p>
      <p class="resume-note">Paiement à la livraison</p>
      <button id="btn-commander" type="button" class="btn btn-principal">Commander</button>
      <button id="btn-vider" type="button" class="btn btn-secondaire">Vider le panier</button>
    </aside>
  `;

  // Les boutons viennent d'être (re)créés : il faut les (re)brancher
  brancherBoutons();
}

// ---------- 3. Branche les clics sur les boutons du panier ----------
function brancherBoutons() {
  // --- Les boutons « + » ---
  const boutonsPlus = document.querySelectorAll('.btn-plus');
  for (let i = 0; i < boutonsPlus.length; i++) {
    boutonsPlus[i].addEventListener('click', function () {
      const id = boutonsPlus[i].dataset.id;   // l'id écrit dans data-id="..."
      const ajoute = ajouterAuPanier(id, 1);
      if (ajoute === false) {
        afficherMessage('⚠️ Stock maximum atteint');
      }
      afficherPanier();
    });
  }

  // --- Les boutons « − » ---
  const boutonsMoins = document.querySelectorAll('.btn-moins');
  for (let i = 0; i < boutonsMoins.length; i++) {
    boutonsMoins[i].addEventListener('click', function () {
      const id = boutonsMoins[i].dataset.id;
      const quantite = quantiteDansPanier(id);

      if (quantite <= 1) {
        // Il n'en restait qu'un : on retire la ligne
        retirerDuPanier(id);
      } else {
        changerQuantite(id, quantite - 1);
      }
      afficherPanier();
    });
  }

  // --- Les boutons « 🗑️ » ---
  const boutonsSupprimer = document.querySelectorAll('.btn-supprimer');
  for (let i = 0; i < boutonsSupprimer.length; i++) {
    boutonsSupprimer[i].addEventListener('click', function () {
      retirerDuPanier(boutonsSupprimer[i].dataset.id);
      afficherPanier();
    });
  }

  // --- « Vider le panier » ---
  document.querySelector('#btn-vider').addEventListener('click', function () {
    // confirm affiche une fenêtre OK / Annuler et renvoie true ou false
    if (confirm('Vider tout le panier ?')) {
      viderPanier();
      afficherPanier();
    }
  });

  // --- « Commander » : on part sur la page du formulaire de livraison ---
  document.querySelector('#btn-commander').addEventListener('click', function () {
    window.location.href = 'commande.html';
  });
}

// ---------- 4. Au chargement de la page ----------
// Le panier ne garde que les id : il faut les produits du serveur pour
// connaître les noms, les prix et les images.
async function demarrer() {
  try {
    await chargerProduits();
    afficherPanier();
  } catch (erreur) {
    zonePanier.innerHTML = '<p class="vide">😕 Impossible de charger le panier. Le serveur est-il lancé ?</p>';
  }
}

demarrer();