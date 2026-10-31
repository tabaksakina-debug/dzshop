// =============================================================
// seed.js — remplit la base MongoDB avec les 24 produits du catalogue
// -------------------------------------------------------------
// « seed » = « semer » : on plante les données de départ dans la base.
// Lancer UNE fois :  npm run seed
// Attention : il efface d'abord tous les produits déjà dans la base.
// =============================================================

require('dotenv').config({ quiet: true });   // lit le fichier .env (MONGODB_URI)
const mongoose = require('mongoose');
const Produit = require('./models/Produit');
const produits = require('./data/produits');

async function semer() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connecté à MongoDB');

    await Produit.deleteMany({});           // 1. on vide la collection
    await Produit.insertMany(produits);     // 2. on y met les 24 produits
    console.log('🌱 ' + produits.length + ' produits ajoutés dans la base');
  } catch (erreur) {
    console.log('❌ Erreur : ' + erreur.message);
  }

  await mongoose.disconnect();   // 3. on raccroche, le script est fini
}

semer();