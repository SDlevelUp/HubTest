# Hub Pro

Hub de pilotage personnel (Next.js + SQLite local, sans abonnement).

## Démarrage

```bash
npm install
npm run dev
```

Ouvre [http://localhost:3000](http://localhost:3000).

Les données sont stockées dans un fichier SQLite local (`data/hub.sqlite`, ignoré par git) via le module natif `node:sqlite` — aucune dépendance externe ni service payant requis.

## Modules disponibles

- **Tableau de bord** (`/`) — CA brut/net, MRR, panier moyen, progression vers l'objectif annuel, dépenses du mois, dernières ventes.
- **Pilotage & finances** (`/finances`) — journal des ventes (avec suivi des paiements 3x/4x), catalogue produits & tarifs, budget & suivi des dépenses, objectif annuel.
- **Clients** (`/clients`) — fiches clients (nom, email, téléphone, notes).

## À venir

Équipe & organisation, Contenu/lancements/croissance, et gestion étudiants/équipe pourront être ajoutés en sections supplémentaires plus tard.
