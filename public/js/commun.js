// =============================================================
// commun.js — les outils utilisés par TOUTES les pages de DZShop
// -------------------------------------------------------------
// Ce fichier est chargé EN PREMIER, avant panier.js et avant le
// script de la page (catalogue.js, fiche-produit.js, page-panier.js).
// =============================================================

// ---------- Les produits, demandés au serveur ----------
// Au début, le tableau est vide. chargerProduits() le remplit.
let produits = [];

// Demande la liste des produits au serveur (l'API), puis la range dans « produits ».
// « async » : cette fonction prend du temps (un aller-retour avec le serveur).
async function chargerProduits() {
  const reponse = await fetch('/api/produits');   // 1. on envoie la demande, on ATTEND la réponse
  produits = await reponse.json();                // 2. on transforme le texte JSON en tableau
}

// Pour afficher un joli nom à la place du code de la catégorie
const nomsCategories = {
  gaming: 'Gaming',
  audio: 'Audio',
  informatique: 'Informatique',
  telephonie: 'Téléphonie',
  maison: 'Maison connectée'
};

// 5500 → "5 500 DA"
function formaterPrix(prix) {
  return prix.toLocaleString('fr-FR') + ' DA';
}

// Retrouve un produit du catalogue grâce à son id : 'p3' → l'objet du clavier.
// Si aucun produit n'a cet id, la fonction renvoie undefined.
function trouverProduit(id) {
  return produits.find(function (produit) {
    return produit.id === id;
  });
}

// Affiche un petit message en bas de l'écran, qui disparaît tout seul
function afficherMessage(texte) {
  // S'il y a déjà un message affiché, on l'enlève d'abord
  const ancien = document.querySelector('.message-flash');
  if (ancien !== null) {
    ancien.remove();
  }

  const message = document.createElement('div');
  message.className = 'message-flash';
  message.textContent = texte;
  document.body.appendChild(message);

  // Dans 2500 millisecondes (2,5 secondes), on le retire de la page
  setTimeout(function () {
    message.remove();
  }, 2500);
}