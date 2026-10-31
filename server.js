// =============================================================
// server.js — le serveur de DZShop (Node.js + Express + MongoDB)
// -------------------------------------------------------------
//   1. il envoie au navigateur les pages du dossier public/ (le site)
//   2. il répond aux demandes de données (l'API) :
//        GET  /api/produits       la liste des produits (lue dans MongoDB)
//        GET  /api/produits/:id   un seul produit
//        GET  /api/wilayas        les 58 wilayas (pour le formulaire)
//        POST /api/commandes      enregistrer une commande
// En local : npm run dev   puis ouvrir http://localhost:3000
// =============================================================

require('dotenv').config({ quiet: true });   // lit le fichier .env et remplit process.env
const express = require('express');
const mongoose = require('mongoose');
const Produit = require('./models/Produit');
const Commande = require('./models/Commande');
const wilayas = require('./data/wilayas');

const app = express();

// En ligne, c'est l'hébergeur (Render) qui choisit le port et le donne dans process.env.PORT.
// Sur ton ordinateur, cette variable n'existe pas : on prend 3000.
const PORT = process.env.PORT || 3000;

// ---------- 1. Réglages ----------
app.use(express.json());              // pour lire le JSON envoyé par le site (req.body)
app.use(express.static('public'));    // le site : tous les fichiers du dossier public

// ---------- 2. Les produits (lus dans MongoDB) ----------
app.get('/api/produits', async function (req, res) {
  try {
    const produits = await Produit.find().sort({ _id: 1 });   // tous, dans l'ordre où ils ont été ajoutés
    res.json(produits);
  } catch (erreur) {
    res.status(500).json({ message: 'Erreur du serveur' });
  }
});

app.get('/api/produits/:id', async function (req, res) {
  try {
    const produit = await Produit.findOne({ id: req.params.id });

    if (produit === null) {
      res.status(404).json({ message: 'Produit introuvable' });
      return;
    }

    res.json(produit);
  } catch (erreur) {
    res.status(500).json({ message: 'Erreur du serveur' });
  }
});

// ---------- 3. Les wilayas ----------
app.get('/api/wilayas', function (req, res) {
  res.json(wilayas);
});

// ---------- 4. Passer une commande ----------
// Le site envoie : { client: { nom, telephone, wilaya, adresse }, articles: [ { id: 'p3', quantite: 2 } ] }
// Règle d'or : on ne fait JAMAIS confiance au navigateur pour les prix.
// Il envoie seulement QUOI et COMBIEN ; le serveur relit les vrais prix dans la base.
app.post('/api/commandes', async function (req, res) {
  try {
    const client = req.body.client || {};
    const articles = req.body.articles;

    // --- a. On vérifie les informations de livraison ---
    const nom = String(client.nom || '').trim();
    const telephone = String(client.telephone || '').replace(/\s/g, '');   // "05 50 12 34 56" → "0550123456"
    const wilaya = String(client.wilaya || '');
    const adresse = String(client.adresse || '').trim();

    if (nom.length < 2) {
      res.status(400).json({ message: 'Indique ton nom' });
      return;
    }
    if (!/^0[567][0-9]{8}$/.test(telephone)) {
      res.status(400).json({ message: 'Numéro de téléphone invalide (exemple : 0550123456)' });
      return;
    }
    if (!wilayas.includes(wilaya)) {
      res.status(400).json({ message: 'Choisis une wilaya dans la liste' });
      return;
    }
    if (adresse.length < 5) {
      res.status(400).json({ message: 'Adresse trop courte' });
      return;
    }
    if (!Array.isArray(articles) || articles.length === 0) {
      res.status(400).json({ message: 'Le panier est vide' });
      return;
    }

    // --- b. On relit chaque produit dans la base, et on calcule le total NOUS-MÊMES ---
    const lignes = [];
    let total = 0;

    for (let i = 0; i < articles.length; i++) {
      const quantite = Number(articles[i].quantite);
      const produit = await Produit.findOne({ id: String(articles[i].id) });

      if (produit === null) {
        res.status(400).json({ message: 'Un produit du panier n\'existe plus' });
        return;
      }
      if (!Number.isInteger(quantite) || quantite < 1) {
        res.status(400).json({ message: 'Quantité invalide pour ' + produit.nom });
        return;
      }
      if (quantite > produit.stock) {
        res.status(400).json({ message: 'Stock insuffisant pour ' + produit.nom + ' (il en reste ' + produit.stock + ')' });
        return;
      }

      lignes.push({ id: produit.id, nom: produit.nom, prix: produit.prix, quantite: quantite });
      total = total + produit.prix * quantite;
    }

    // --- c. On retire les articles vendus du stock ---
    for (let i = 0; i < lignes.length; i++) {
      await Produit.updateOne({ id: lignes[i].id }, { $inc: { stock: -lignes[i].quantite } });
    }

    // --- d. On enregistre la commande ---
    const commande = await Commande.create({
      client: { nom: nom, telephone: telephone, wilaya: wilaya, adresse: adresse },
      articles: lignes,
      total: total
    });

    // 201 = « créé ». On renvoie le numéro et le total calculé par le serveur.
    res.status(201).json({ numero: commande._id, total: commande.total });
  } catch (erreur) {
    res.status(500).json({ message: 'Erreur du serveur' });
  }
});

// ---------- 5. On se connecte à MongoDB, PUIS on démarre le serveur ----------
mongoose.connect(process.env.MONGODB_URI)
  .then(function () {
    console.log('✅ Connecté à MongoDB');
    app.listen(PORT, function () {
      console.log('✅ DZShop tourne sur http://localhost:' + PORT);
    });
  })
  .catch(function (erreur) {
    console.log('❌ Connexion à MongoDB impossible : ' + erreur.message);
  });