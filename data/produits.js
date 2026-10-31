const produits = [
  // =========================
  // GAMING
  // =========================
  {
    id: "p1",
    nom: "PlayStation 5",
    categorie: "gaming",
    prix: 89900,
    stock: 3,
    image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "p2",
    nom: "Manette PlayStation 5",
    categorie: "gaming",
    prix: 14500,
    stock: 8,
    image: "https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "p3" ,
    nom: "Casque Gaming",
    categorie: "gaming",
    prix: 12900,
    stock: 5,
    image: "https://images.unsplash.com/photo-1599669454699-248893623440?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "p4",
    nom: "Clavier Gaming RGB",
    categorie: "gaming",
    prix: 16900,
    stock: 12,
    image: "https://images.unsplash.com/photo-1541140532154-b024d705b90a?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "p5",
    nom: "Souris Gaming",
    categorie: "gaming",
    prix: 7900,
    stock: 2,
    image: "https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=800&q=80"
  },

  // =========================
  // AUDIO
  // =========================
  {
    id: "p6",
    nom: "Écouteurs sans fil",
    categorie: "audio",
    prix: 8900,
    stock: 4,
    image: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "p7",
    nom: "Enceinte Bluetooth",
    categorie: "audio",
    prix: 15900,
    stock: 10,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "p8",
    nom: "Casque Bluetooth",
    categorie: "audio",
    prix: 18900,
    stock: 6,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "p9",
    nom: "Microphone USB",
    categorie: "audio",
    prix: 21900,
    stock: 3,
    image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "p10",
    nom: "Barre de son",
    categorie: "audio",
    prix: 29900,
    stock: 0,
    image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80"
  },

  // =========================
  // INFORMATIQUE
  // =========================
  {
    id: "p11",
    nom: "Ordinateur portable",
    categorie: "informatique",
    prix: 125000,
    stock: 2,
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "p12",
    nom: "Écran PC 24 pouces",
    categorie: "informatique",
    prix: 32900,
    stock: 7,
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "p13",
    nom: "Clavier mécanique",
    categorie: "informatique",
    prix: 11900,
    stock: 15,
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "p14",
    nom: "Disque SSD 1 To",
    categorie: "informatique",
    prix: 18900,
    stock: 4,
    image: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "p15",
    nom: "Webcam HD",
    categorie: "informatique",
    prix: 9900,
    stock: 9,
    image: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&w=800&q=80"
  },

  // =========================
  // TÉLÉPHONIE
  // =========================
  {
    id:   "p16",
    nom: "iPhone",
    categorie: "telephonie",
    prix: 145000,
    stock: 0,
    image: "https://images.unsplash.com/photo-1591337676887-a217a6970a8a?auto=format&fit=crop&w=800&q=80"
  },
  {
    id:  "p17",
    nom: "Samsung Galaxy",
    categorie: "telephonie",
    prix: 119000,
    stock: 3,
    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "p18",
    nom: "Smartphone Android",
    categorie: "telephonie",
    prix: 54900,
    stock: 6,
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80"
  },
  {
    id:   "p19",
    nom: "Montre connectée",
    categorie: "telephonie",
    prix: 22900,
    stock: 5,
    image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "p20",
    nom: "Chargeur rapide USB-C",
    categorie: "telephonie",
    prix: 4900,
    stock: 20,
    image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80"
  },

  // =========================
  // MAISON CONNECTÉE
  // =========================
  {
    id:     "p21",
    nom: "Ampoule connectée",
    categorie: "maison",
    prix: 3900,
    stock: 20,
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "p22",
    nom: "Caméra de surveillance Wi-Fi",
    categorie: "maison",
    prix: 15900,
    stock: 4,
    image: "https://images.unsplash.com/photo-1557324232-b8917d3c3dcb?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "p23",
    nom: "Prise connectée",
    categorie: "maison",
    prix: 4500,
    stock: 11,
    image: "https://images.unsplash.com/photo-1558008258-3256797b43f3?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "p24",
    nom: "Enceinte intelligente",
    categorie: "maison",
    prix: 24900,
    stock: 2,
    image: "https://images.unsplash.com/photo-1543512214-318c7553f230?auto=format&fit=crop&w=800&q=80"
  }
];
module.exports = produits;