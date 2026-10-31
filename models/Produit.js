// =============================================================
// models/Produit.js — à quoi ressemble un produit dans MongoDB
// -------------------------------------------------------------
// Un « schéma » = la fiche d'identité d'un produit : quels champs,
// de quel type, lesquels sont obligatoires. MongoDB refusera
// d'enregistrer un produit qui ne respecte pas ce schéma.
// =============================================================

const mongoose = require('mongoose');

const produitSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },   // "p1", "p2"… (celui de l'adresse produit.html?id=p1)
  nom: { type: String, required: true },
  prix: { type: Number, required: true, min: 0 },
  categorie: { type: String, required: true },
  stock: { type: Number, required: true, min: 0 },
  image: { type: String, required: true },
  images: { type: [String], default: [] },
  description: { type: String, default: '' }
});

// Le « modèle » Produit : c'est lui qu'on utilise pour lire et écrire dans la base.
// MongoDB rangera les produits dans une collection appelée « produits ».
module.exports = mongoose.model('Produit', produitSchema);