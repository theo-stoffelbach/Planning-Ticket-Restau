# 📅 PLANNING-TICKET-RESTAU

Ce document fournit les informations essentielles pour le développement et le déploiement de l'application Planning-Ticket-Restau.

---

## 📋 Vue d'ensemble

**Nom:** Planning-Ticket-Restau  
**Type:** Application de gestion de tickets et planning pour restaurant  
**Stack:** Laravel (backend) + React + Vite (frontend) + PostgreSQL

### Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Nginx Proxy Manager               │
│         (https://tickets-restau.theo-stoffelbach.fr)       │
└─────────────────────────────────────────────────────┘
                           │
                      npm-public network
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
   ┌─────────┐      ┌─────────────┐   ┌──────────┐
   │ Frontend│      │   Backend   │   │  PgAdmin │
   │  :5173  │      │  :8000      │   │   :5050  │
   │  (Vite) │      │  (Laravel)  │   │          │
   └─────────┘      └─────────────┘   └──────────┘
        │                  │
        └──────────────────┘
                  │
           ┌─────────────┐
           │  PostgreSQL │
           │    :5433    │
           └─────────────┘
```

---

## 📁 Structure du projet

```
Planning-Ticket-Restau/
├── backend/                 # API Laravel + PHP
│   ├── app/                 # Code métier
│   ├── config/              # Configuration
│   ├── database/            # Migrations + seeds
│   ├── routes/              # Routes API
│   ├── Dockerfile
│   └── composer.json
│
├── frontend/                # Interface React + Vite
│   ├── src/                 # Code source
│   ├── public/              # Assets
│   ├── Dockerfile
│   └── package.json
│
├── .github/workflows/
│   ├── deploy-ghcr.yml      # 🚀 CI/CD GHCR (recommandé)
│   └── deploy.yml           # CI/CD Self-Hosted (legacy)
│
├── docker-compose.yml       # Développement (build local)
├── docker-compose.prod.yml  # Production (images GHCR + Watchtower)
├── .env                     # Variables d'environnement
└── CLAUDE.md                # Ce fichier
```

---

## 🚀 Méthodes de déploiement

### Option 1: GHCR + Watchtower (RECOMMANDÉ) ✅

Build sur GitHub Actions → Images sur GHCR → Watchtower auto-update

```bash
# Sur le NAS - Utiliser docker-compose.prod.yml
cd /volume2/docker/Planning-Ticket-Restau
docker compose -f docker-compose.prod.yml up -d
```

### Option 2: Self-Hosted Runner (Legacy)

```bash
cd /volume2/docker/Planning-Ticket-Restau
docker compose up -d
```

---

## 🔧 Configuration requise

### Fichier `.env`

```bash
# Database
DB_DATABASE=tickets_restau
DB_USERNAME=postgres
DB_PASSWORD=changeme_strong_password

# Backend
BACKEND_PORT=8000
APP_KEY=base64:votre_cle_app_ici
APP_DEBUG=false
APP_ENV=production

# Frontend
FRONTEND_PORT=5173
VITE_API_URL=http://localhost:8000

# PgAdmin
PGADMIN_DEFAULT_EMAIL=admin@admin.com
PGADMIN_DEFAULT_PASSWORD=changeme_pgadmin_password
```

### GitHub Secrets requis

Pour le déploiement GHCR, ajouter dans GitHub → Settings → Secrets:

| Secret | Description |
|--------|-------------|
| `VITE_API_URL` | URL de l'API en production (ex: `https://api.tickets-restau.theo-stoffelbach.fr`) |

---

## 🐳 Commandes Docker essentielles

### Développement (build local)

```bash
cd /volume2/docker/Planning-Ticket-Restau

# Démarrer
docker compose up -d --build

# Voir les logs
docker compose logs -f

# Redémarrer
docker compose restart

# Arrêter
docker compose down

# Reset DB
docker compose down -v
```

### Production (GHCR)

```bash
cd /volume2/docker/Planning-Ticket-Restau

# Démarrer avec les images GHCR
docker compose -f docker-compose.prod.yml up -d

# Forcer la mise à jour
docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d

# Voir les logs Watchtower
docker logs -f watchtower-central
```

### Logs et debugging

```bash
# Logs backend (Laravel)
docker logs -f planning_backend

# Logs frontend (React)
docker logs -f planning_frontend

# Logs PostgreSQL
docker logs -f planning_postgres

# Accéder au container backend
docker exec -it planning_backend sh

# Commandes Artisan
docker exec planning_backend php artisan migrate
docker exec planning_backend php artisan db:seed
```

---

## 🌐 Configuration Nginx Proxy Manager (NPM)

### Frontend
| Champ | Valeur |
|-------|--------|
| Domain Names | `tickets-restau.theo-stoffelbach.fr` |
| Scheme | `http` |
| Forward Hostname / IP | `planning_frontend` |
| Forward Port | `5173` |

### Backend API
| Champ | Valeur |
|-------|--------|
| Domain Names | `api.tickets-restau.theo-stoffelbach.fr` |
| Scheme | `http` |
| Forward Hostname / IP | `planning_backend` |
| Forward Port | `8000` |

**SSL** : Request a new SSL Certificate + Force SSL

---

## 🗄️ Base de données

### Migrations Laravel

```bash
# Dans le container backend
docker exec planning_backend php artisan migrate

# Seed la base
docker exec planning_backend php artisan db:seed

# Reset complet
docker exec planning_backend php artisan migrate:fresh --seed
```

### Backup PostgreSQL

```bash
# Backup
docker exec planning_postgres pg_dump -U postgres tickets_restau > backup_$(date +%Y%m%d).sql

# Restore
docker exec -i planning_postgres psql -U postgres -d tickets_restau < backup_xxxx.sql
```

---

## 📝 Notes

- **Port PostgreSQL:** 5433 (évite le conflit avec d'autres projets)
- **Backend Laravel:** PHP 8.2 avec PostgreSQL driver
- **Frontend:** React 18 + Vite + Tailwind CSS
- **Watchtower:** Vérifie les mises à jour toutes les 2 minutes

---

## 🔗 Liens utiles

- **Application:** https://tickets-restau.theo-stoffelbach.fr
- **API:** https://api.tickets-restau.theo-stoffelbach.fr
- **PgAdmin:** http://localhost:5050 (local only)
- **GitHub Actions:** https://github.com/theo-stoffelbach/Planning-Ticket-Restau/actions

---

**Dernière mise à jour:** 2025-02-09
