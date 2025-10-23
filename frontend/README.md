# Frontend - Application Vue.js

Application web pour la gestion de tickets restaurant avec calendrier interactif.

## Stack

- **Framework**: Vue.js 3
- **Routeur**: Vue Router 4
- **State Management**: Pinia
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **HTTP Client**: Axios

## Installation locale

```bash
# Installer les dépendances
npm install

# Configurer l'URL de l'API
# Créer un fichier .env.local
echo "VITE_API_URL=http://localhost:8000" > .env.local

# Lancer le serveur de développement
npm run dev
```

L'application sera disponible sur `http://localhost:5173`

## Installation avec Docker

Le frontend est configuré pour fonctionner avec Docker. Voir le `docker-compose.yml` à la racine du projet.

```bash
# À la racine du projet
docker-compose up frontend
```

## Structure du projet

```
src/
├── assets/          # CSS et ressources statiques
│   └── main.css     # Styles Tailwind CSS
├── components/      # Composants réutilisables
│   ├── CalendarHeader.vue
│   ├── CalendarGrid.vue
│   ├── DayCell.vue
│   └── StatsSummary.vue
├── stores/          # Stores Pinia
│   ├── auth.js      # Gestion de l'authentification
│   └── meal.js      # Gestion des entrées de repas
├── views/           # Pages de l'application
│   ├── LoginView.vue
│   ├── RegisterView.vue
│   └── CalendarView.vue
├── router/          # Configuration des routes
│   └── index.js
├── App.vue          # Composant racine
└── main.js          # Point d'entrée
```

## Fonctionnalités

### Authentification

- **Inscription** : Création de compte utilisateur
- **Connexion** : Authentification avec email et mot de passe
- **Déconnexion** : Suppression du token

### Calendrier

- **Navigation mensuelle** : Boutons pour passer au mois précédent/suivant
- **Cases divisées** : Chaque jour est divisé en deux moitiés (Théo et Lucas)
- **Système de clics** :
  - 1er clic : Gamelle (🍱) → +1 ticket restaurant
  - 2ème clic : RIE (🏢) → 0 ticket
  - 3ème clic : Vide → reset
- **Weekend grisé** : Samedi et dimanche non cliquables
- **Statistiques** : Récapitulatif du mois pour chaque personne

### Stores Pinia

#### authStore

- `user`: Utilisateur connecté
- `token`: Token d'authentification
- `isAuthenticated`: État de connexion
- `register()`: Inscription
- `login()`: Connexion
- `logout()`: Déconnexion
- `checkAuth()`: Vérifier l'authentification

#### mealStore

- `mealEntries`: Liste des entrées du mois
- `stats`: Statistiques mensuelles
- `currentMonth`: Mois actuel affiché
- `fetchMonth()`: Charger les données du mois
- `toggleMeal()`: Toggle une entrée (vide → gamelle → RIE → vide)
- `getEntryStatus()`: Obtenir le statut d'une entrée
- `previousMonth()`: Mois précédent
- `nextMonth()`: Mois suivant

## Routes

| Path        | Composant    | Description               | Protection    |
| ----------- | ------------ | ------------------------- | ------------- |
| `/`         | Redirect     | Redirige vers `/calendar` | -             |
| `/login`    | LoginView    | Page de connexion         | Guest only    |
| `/register` | RegisterView | Page d'inscription        | Guest only    |
| `/calendar` | CalendarView | Calendrier principal      | Auth required |

## Composants

### CalendarHeader

En-tête avec navigation mensuelle et bouton de déconnexion.

**Props:**

- `currentMonth`: Date du mois actuel

**Events:**

- `previous-month`: Mois précédent
- `next-month`: Mois suivant
- `logout`: Déconnexion

### CalendarGrid

Grille du calendrier avec tous les jours du mois.

**Props:**

- `currentMonth`: Date du mois actuel
- `getEntryStatus`: Fonction pour récupérer le statut d'une entrée

**Events:**

- `toggle-meal`: Toggle une entrée

### DayCell

Case d'un jour divisée en deux (Théo/Lucas).

**Props:**

- `day`: Numéro du jour
- `date`: Date complète
- `theoStatus`: Statut de Théo (null/gamelle/rie)
- `lucasStatus`: Statut de Lucas (null/gamelle/rie)

**Events:**

- `toggle`: Toggle pour une personne

### StatsSummary

Résumé des statistiques mensuelles.

**Props:**

- `stats`: Objet avec les stats pour Théo et Lucas

## Styling

### Tailwind CSS

L'application utilise Tailwind CSS pour le styling. Les principales classes utilisées :

- `bg-gray-50` : Fond de page
- `bg-white` : Fond des cartes
- `shadow-md` : Ombres
- `rounded-lg` : Bordures arrondies
- `hover:bg-blue-50` : Effets hover
- `disabled:cursor-not-allowed` : États désactivés

### États visuels

- **Vide** : Fond blanc/gris
- **Gamelle** : Fond vert clair (`bg-green-100`)
- **RIE** : Fond orange clair (`bg-orange-100`)
- **Weekend** : Fond gris (`bg-gray-100`)

## Configuration

### Variables d'environnement

Créer un fichier `.env.local` à la racine du frontend :

```env
VITE_API_URL=http://localhost:8000
```

### API

Le frontend communique avec l'API Laravel via Axios. Le token d'authentification est stocké dans `localStorage` et ajouté automatiquement aux headers des requêtes.

## Build de production

```bash
# Build pour la production
npm run build

# Prévisualiser le build
npm run preview
```

Les fichiers de production sont générés dans le dossier `dist/`.

## Commandes utiles

```bash
# Installer les dépendances
npm install

# Développement
npm run dev

# Build production
npm run build

# Preview production build
npm run preview
```

## Compatibilité navigateurs

L'application fonctionne sur tous les navigateurs modernes supportant ES6+ :

- Chrome/Edge (dernières versions)
- Firefox (dernières versions)
- Safari (dernières versions)
