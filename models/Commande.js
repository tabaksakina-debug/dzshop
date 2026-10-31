// =============================================================
// models/Commande.js — à quoi ressemble une commande dans MongoDB
// =============================================================

const mongoose = require('mongoose');

const commandeSchema = new mongoose.Schema({
  // Qui commande, et où livrer
  client: {
    nom: { type: String, required: true },
    telephone: { type: String, required: true },
    wilaya: { type: String, required: true },
    adresse: { type: String, required: true }
  },

  // Ce qui est commandé : une « photo » de chaque produit au moment de l'achat.
  // On recopie le nom et le prix : si le prix change demain, la commande garde le bon.
  articles: [
    {
      id: String,
      nom: String,
      prix: Number,
      quantite: Number
    }
  ],

  total: { type: Number, required: true },
  statut: { type: String, default: 'en attente' }
}, {
  timestamps: true   // ajoute automatiquement createdAt (date de la commande) et updatedAt
});

module.exports = mongoose.model('Commande', commandeSchema);