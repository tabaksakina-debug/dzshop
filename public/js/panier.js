// =============================================================
// panier.js — le panier de DZShop, gardé dans le localStorage
// -------------------------------------------------------------
// Le panier est un tableau de lignes : { id: 'p3', quantite: 2 }
// On ne garde QUE l'id et la quantité : le nom, le prix et l'image
// sont toujours relus dans le catalogue (trouverProduit).
// Ce fichier a besoin de produits.js et commun.js, chargés avant lui.
// =============================================================

// Le nom du « tiroir » dans le localStorage
const CLE_PANIER = 'dzshop-panier';

// ---------- 1. Lire et sauvegarder ----------

// Renvoie le panier sous forme de tableau (vide s'il n'y a encore rien)
function lirePanier() {
  const texte = localStorage.getItem(CLE_PANIER);

  // Premier passage sur le site : rien n'a encore été enregistré
  if (texte === null) {
    return [];
  }

  return JSON.parse(texte);   // texte → tableau
}

// Enregistre le panier, puis met à jour le compteur de la navbar
function sauverPanier(panier) {
  localStorage.setItem(CLE_PANIER, JSON.stringify(panier));   // tableau → texte
  majCompteurPanier();
}

// ---------- 2. Modifier le panier ----------

// Combien d'exemplaires de ce produit sont déjà dans le panier ? (0 s'il n'y est pas)
function quantiteDansPanier(idProduit) {
  const panier = lirePanier();
  const ligne = panier.find(function (l) {
    return l.id === idProduit;
  });

  if (ligne === undefined) {
    return 0;
  }
  return ligne.quantite;
}

// Ajoute « quantite » exemplaires d'un produit.
// Renvoie true si c'est fait, false si c'est impossible (produit inconnu ou stock insuffisant).
function ajouterAuPanier(idProduit, quantite) {
  const produit = trouverProduit(idProduit);
  if (produit === undefined) {
    return false;
  }

  // On ne peut pas mettre dans le panier plus que le stock
  if (quantiteDansPanier(idProduit) + quantite > produit.stock) {
    return false;
  }

  const panier = lirePanier();
  const ligne = panier.find(function (l) {
    return l.id === idProduit;
  });

  if (ligne === undefined) {
    // Le produit n'est pas encore dans le panier : nouvelle ligne
    panier.push({ id: idProduit, quantite: quantite });
  } else {
    // Il y est déjà : on augmente la quantité de sa ligne
    ligne.quantite = ligne.quantite + quantite;
  }

  sauverPanier(panier);
  return true;
}

// Remplace la quantité d'un produit déjà dans le panier.
// Renvoie false si la quantité demandée est impossible.
function changerQuantite(idProduit, nouvelleQuantite) {
  const produit = trouverProduit(idProduit);
  if (produit === undefined || nouvelleQuantite < 1 || nouvelleQuantite > produit.stock) {
    return false;
  }

  const panier = lirePanier();
  const ligne = panier.find(function (l) {
    return l.id === idProduit;
  });
  if (ligne === undefined) {
    return false;
  }

  ligne.quantite = nouvelleQuantite;
  sauverPanier(panier);
  return true;
}

// Enlève complètement un produit du panier
function retirerDuPanier(idProduit) {
  const panier = lirePanier();

  // On garde toutes les lignes SAUF celle du produit à retirer
  const nouveauPanier = panier.filter(function (l) {
    return l.id !== idProduit;
  });

  sauverPanier(nouveauPanier);
}

// Vide tout le panier
function viderPanier() {
  localStorage.removeItem(CLE_PANIER);
  majCompteurPanier();
}

// ---------- 3. Calculer ----------

// Nombre total d'articles (2 souris + 1 casque = 3)
function compterArticles() {
  const panier = lirePanier();
  let total = 0;
  for (let i = 0; i < panier.length; i++) {
    total = total + panier[i].quantite;
  }
  return total;
}

// Prix total du panier en DA
function totalPanier() {
  const panier = lirePanier();
  let total = 0;
  for (let i = 0; i < panier.length; i++) {
    const produit = trouverProduit(panier[i].id);
    // Si un produit a disparu du catalogue, on l'ignore
    if (produit !== undefined) {
      total = total + produit.prix * panier[i].quantite;
    }
  }
  return total;
}

// ---------- 4. Le compteur de la navbar ----------
function majCompteurPanier() {
  const compteurPanier = document.querySelector('#compteur-panier');
  if (compteurPanier !== null) {
    compteurPanier.textContent = compterArticles();
  }
}

// Au chargement de chaque page : on affiche le bon nombre tout de suite
majCompteurPanier();