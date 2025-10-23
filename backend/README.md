# Backend - API Laravel

API REST pour l'application de gestion de tickets restaurant.

## Stack

-   **Framework**: Laravel 11
-   **Base de données**: PostgreSQL
-   **Authentification**: Laravel Sanctum
-   **PHP**: 8.2+

## Installation locale

```bash
# Installer les dépendances
composer install

# Copier le fichier d'environnement
cp .env.example .env

# Générer la clé d'application
php artisan key:generate

# Configurer la base de données dans .env
DB_CONNECTION=pgsql
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=tickets_restau
DB_USERNAME=postgres
DB_PASSWORD=secret

# Exécuter les migrations
php artisan migrate

# Lancer le serveur de développement
php artisan serve
```

## Installation avec Docker

Le backend est configuré pour fonctionner avec Docker. Voir le `docker-compose.yml` à la racine du projet.

```bash
# À la racine du projet
docker-compose up backend
```

## Structure

### Modèles

-   **User**: Utilisateur de l'application
-   **MealEntry**: Entrée de repas (gamelle ou RIE) pour une personne et une date

### Contrôleurs

-   **AuthController**: Gestion de l'authentification (register, login, logout)
-   **MealEntryController**: Gestion des entrées de repas

### Routes API

#### Authentification (non protégées)

-   `POST /api/register` - Inscription

    ```json
    {
        "name": "John Doe",
        "email": "john@example.com",
        "password": "password",
        "password_confirmation": "password"
    }
    ```

-   `POST /api/login` - Connexion
    ```json
    {
        "email": "john@example.com",
        "password": "password"
    }
    ```

#### Routes protégées (Bearer Token requis)

-   `POST /api/logout` - Déconnexion
-   `GET /api/user` - Obtenir l'utilisateur connecté

#### Meal Entries

-   `GET /api/meal-entries?year=2025&month=10` - Liste des entrées du mois
-   `POST /api/meal-entries` - Toggle une entrée (vide → gamelle → RIE → vide)

    ```json
    {
        "date": "2025-10-15",
        "person": "theo"
    }
    ```

-   `GET /api/meal-entries/stats?year=2025&month=10` - Statistiques du mois
    ```json
    {
        "theo": {
            "gamelle": 16,
            "rie": 13,
            "tickets": 16
        },
        "lucas": {
            "gamelle": 15,
            "rie": 10,
            "tickets": 15
        }
    }
    ```

## Base de données

### Table `users`

| Colonne    | Type      | Description          |
| ---------- | --------- | -------------------- |
| id         | bigint    | Clé primaire         |
| name       | string    | Nom de l'utilisateur |
| email      | string    | Email (unique)       |
| password   | string    | Mot de passe hashé   |
| created_at | timestamp | Date de création     |
| updated_at | timestamp | Date de modification |

### Table `meal_entries`

| Colonne    | Type                            | Description          |
| ---------- | ------------------------------- | -------------------- |
| id         | bigint                          | Clé primaire         |
| user_id    | bigint                          | ID de l'utilisateur  |
| person     | enum('theo', 'lucas')           | Personne concernée   |
| date       | date                            | Date du repas        |
| status     | enum('gamelle', 'rie') nullable | Type de repas        |
| created_at | timestamp                       | Date de création     |
| updated_at | timestamp                       | Date de modification |

**Index**: `(user_id, date, person)` pour optimiser les requêtes mensuelles.

## Tests

```bash
# Exécuter les tests
php artisan test
```

## Configuration

### Sanctum

Sanctum est configuré pour l'authentification API avec tokens. Le trait `HasApiTokens` est ajouté au modèle User.

### CORS

CORS est configuré pour accepter toutes les origines en développement. Pour la production, modifier `config/cors.php`.

## Commandes utiles

```bash
# Créer une migration
php artisan make:migration create_table_name

# Créer un modèle
php artisan make:model ModelName

# Créer un contrôleur
php artisan make:controller ControllerName

# Vider et réexécuter les migrations
php artisan migrate:fresh

# Générer une clé d'application
php artisan key:generate
```
