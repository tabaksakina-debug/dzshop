// =============================================================
// fiche-produit.js — la page détail d'un produit (produit.html?id=p3)
// =============================================================

// ---------- 1. La zone de la page qu'on va remplir ----------
const zoneProduit = document.querySelector('#zone-produit');

// ---------- 2. Les fonctions d'affichage ----------

// Fabrique le HTML des petites images sous la grande
function creerMiniatures(produit) {
  let html = '';
  for (let i = 0; i < produit.images.length; i++) {
    html = html + `<img class="miniature" src="${produit.images[i]}" alt="${produit.nom}, photo ${i + 1}">`;
  }
  return html;
}

// Affiche la fiche complète du produit
function afficherProduit(produit) {
  // Le titre de l'onglet du navigateur
  document.title = produit.nom + ' — DZShop';

  // Le bloc d'achat dépend du stock
  let blocAchat = '';
  if (produit.stock === 0) {
    blocAchat = '<p><span class="badge badge-rupture">Rupture de stock</span></p>';
  } else {
    blocAchat = `
      <p class="fiche-stock">✅ En stock : ${produit.stock} disponible(s)</p>
      <div class="achat">
        <label for="quantite">Quantité</label>
        <input type="number" id="quantite" value="1" min="1" max="${produit.stock}">
        <button id="btn-ajouter" type="button" class="btn btn-principal">🛒 Ajouter au panier</button>
      </div>
    `;
  }

  zoneProduit.innerHTML = `
    <div class="galerie">
      <img id="image-principale" src="${produit.image}" alt="${produit.nom}">
      <div class="miniatures">${creerMiniatures(produit)}</div>
    </div>
    <div class="fiche-infos">
      <span class="carte-categorie">${nomsCategories[produit.categorie]}</span>
      <h1>${produit.nom}</h1>
      <p class="fiche-prix">${formaterPrix(produit.prix)}</p>
      ${blocAchat}
      <h2>Description</h2>
      <p class="fiche-description">${produit.description}</p>
    </div>
  `;

  // Le HTML existe maintenant dans la page : on peut brancher les clics
  brancherGalerie();
  brancherAchat(produit);
}

// Message affiché quand l'id de l'URL ne correspond à aucun produit
function afficherIntrouvable() {
  document.title = 'Produit introuvable — DZShop';
  zoneProduit.innerHTML = `
    <div class="vide">
      <p>😕 Ce produit n'existe pas (ou plus).</p>
      <a class="btn btn-principal" href="index.html">Voir le catalogue</a>
    </div>
  `;
}

// ---------- 3. La galerie : un clic sur une miniature change la grande image ----------
function brancherGalerie() {
  const imagePrincipale = document.querySelector('#image-principale');
  const miniatures = document.querySelectorAll('.miniature');

  for (let i = 0; i < miniatures.length; i++) {
    miniatures[i].addEventListener('click', function () {
      imagePrincipale.src = miniatures[i].src;

      // On enlève le cadre vert partout, puis on le met sur la miniature cliquée
      for (let j = 0; j < miniatures.length; j++) {
        miniatures[j].classList.remove('active');
      }
      miniatures[i].classList.add('active');
    });
  }

  // Au départ, c'est la première miniature qui est sélectionnée
  if (miniatures.length > 0) {
    miniatures[0].classList.add('active');
  }
}

// ---------- 4. Le bouton « Ajouter au panier » ----------
function brancherAchat(produit) {
  const btnAjouter = document.querySelector('#btn-ajouter');

  // Produit en rupture : il n'y a pas de bouton, donc rien à brancher
  if (btnAjouter === null) {
    return;
  }

  const champQuantite = document.querySelector('#quantite');

  btnAjouter.addEventListener('click', function () {
    // .value est toujours un texte : on le transforme en nombre
    const quantite = Number(champQuantite.value);

    // On refuse 0, les négatifs, les nombres à virgule et le champ vide
    if (Number.isInteger(quantite) === false || quantite < 1) {
      afficherMessage('⚠️ Choisis une quantité valide');
      return;
    }

    const ajoute = ajouterAuPanier(produit.id, quantite);

    if (ajoute === true) {
      afficherMessage('✅ Ajouté au panier');
    } else {
      afficherMessage('⚠️ Stock insuffisant : il y en a ' + produit.stock + ' en tout');
    }
  });
}

// ---------- 5. Au chargement de la page ----------

// On lit l'id dans l'adresse : produit.html?id=p3 → 'p3'
const parametres = new URLSearchParams(window.location.search);
const idProduit = parametres.get('id');

async function demarrer() {
  try {
    // On attend que le serveur nous envoie les produits…
    await chargerProduits();
  } catch (erreur) {
    zoneProduit.innerHTML = '<p class="vide">😕 Impossible de charger le produit. Le serveur est-il lancé ?</p>';
    return;
  }

  // …puis on cherche celui de l'adresse, comme avant
  const produit = trouverProduit(idProduit);

  if (produit === undefined) {
    afficherIntrouvable();
  } else {
    afficherProduit(produit);
  }
}

demarrer();