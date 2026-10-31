// =============================================================
// catalogue.js — affiche les produits, la recherche et le filtre
// -------------------------------------------------------------
// formaterPrix et nomsCategories sont maintenant dans commun.js :
// on les a déplacés pour que toutes les pages puissent s'en servir.
// =============================================================

// ---------- 1. On récupère les éléments HTML dont on a besoin ----------
const grille = document.querySelector('#grille-produits');
const champRecherche = document.querySelector('#recherche');
const selectCategorie = document.querySelector('#categorie');
const btnReinitialiser = document.querySelector('#btn-reinitialiser');
const compteur = document.querySelector('#compteur');

// ---------- 2. Fabrique le HTML d'UNE carte produit ----------
function creerCarte(produit) {
  // Le badge dépend du stock
  let badge = '';
  let classeCarte = 'carte';

  if (produit.stock === 0) {
    badge = '<span class="badge badge-rupture">Rupture de stock</span>';
    classeCarte = 'carte en-rupture';
  } else if (produit.stock <= 5) {
    badge = '<span class="badge badge-bientot">Plus que ' + produit.stock + ' en stock</span>';
  }

  // Nouveau : la carte est un lien <a>. Un clic ouvre la page du produit,
  // et l'id du produit voyage dans l'adresse : produit.html?id=p3
  return `
    <a class="${classeCarte}" href="produit.html?id=${produit.id}">
      <img src="${produit.image}" alt="${produit.nom}">
      <div class="carte-corps">
        <span class="carte-categorie">${nomsCategories[produit.categorie]}</span>
        <h3>${produit.nom}</h3>
        ${badge}
        <p class="carte-prix">${formaterPrix(produit.prix)}</p>
      </div>
    </a>
  `;
}

// ---------- 3. Afficher une liste de produits dans la grille ----------
function afficherProduits(liste) {
  // Cas spécial : aucun produit trouvé
  if (liste.length === 0) {
    grille.innerHTML = '<p class="vide">😕 Aucun produit ne correspond à ta recherche.</p>';
    compteur.textContent = '0 produit trouvé';
    return;
  }

  // On construit tout le HTML, carte par carte
  let html = '';
  for (let i = 0; i < liste.length; i++) {
    html = html + creerCarte(liste[i]);
  }

  // Une seule écriture dans la page (plus rapide)
  grille.innerHTML = html;

  if (liste.length === 1) {
    compteur.textContent = '1 produit trouvé';
  } else {
    compteur.textContent = liste.length + ' produits trouvés';
  }
}

// ---------- 4. Recherche + filtre par catégorie ----------
function filtrerProduits() {
  const texte = champRecherche.value.trim().toLowerCase();
  const categorie = selectCategorie.value;

  const resultat = produits.filter(function (produit) {
    const nomOk = produit.nom.toLowerCase().includes(texte);
    const categorieOk = categorie === 'toutes' || produit.categorie === categorie;
    return nomOk && categorieOk;
  });

  afficherProduits(resultat);
}

// ---------- 5. On écoute les actions de l'utilisateur ----------
champRecherche.addEventListener('input', filtrerProduits);
selectCategorie.addEventListener('change', filtrerProduits);

btnReinitialiser.addEventListener('click', function () {
  champRecherche.value = '';
  selectCategorie.value = 'toutes';
  afficherProduits(produits);
});

// ---------- 6. Au chargement de la page ----------
// On demande d'abord les produits au serveur, PUIS on les affiche.
async function demarrer() {
  grille.innerHTML = '<p class="vide">⏳ Chargement des produits…</p>';

  try {
    await chargerProduits();
    afficherProduits(produits);
  } catch (erreur) {
    // Le serveur est éteint, ou la connexion a coupé
    grille.innerHTML = '<p class="vide">😕 Impossible de charger les produits. Le serveur est-il lancé ?</p>';
    compteur.textContent = '';
  }
}

demarrer();