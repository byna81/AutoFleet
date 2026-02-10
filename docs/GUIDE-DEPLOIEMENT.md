# 🚀 Guide de déploiement AutoFleet

**Guide complet pour déployer l'application AutoFleet en production**

---

## 📋 Résumé de l'architecture

```
┌─────────────────────────────────────────┐
│          UTILISATEURS                    │
│    (Navigateur web / Mobile)            │
└──────────────┬──────────────────────────┘
               │ HTTPS
               ▼
┌─────────────────────────────────────────┐
│          NGINX (Reverse Proxy)          │
│    - SSL/TLS (Let's Encrypt)            │
│    - Compression Gzip                   │
│    - Cache statique                     │
└────────┬────────────────┬───────────────┘
         │                │
         │ Frontend       │ Backend API
         ▼                ▼
┌──────────────┐   ┌──────────────────────┐
│   React      │   │   Node.js/Express    │
│   (Vite)     │   │   (PM2 Cluster)      │
│   Tailwind   │   │   - Routes API       │
└──────────────┘   │   - Auth JWT         │
                   │   - Validation       │
                   └──────────┬───────────┘
                              │
                              ▼
                   ┌──────────────────────┐
                   │   PostgreSQL 14+     │
                   │   - 8 tables         │
                   │   - Triggers         │
                   │   - Vues             │
                   └──────────────────────┘
```

---

## 1️⃣ Prérequis serveur

### Spécifications minimales
- **OS**: Ubuntu 22.04 LTS
- **RAM**: 4 GB
- **CPU**: 2 cores
- **Stockage**: 40 GB SSD
- **Bande passante**: Illimitée

### Installation des logiciels

```bash
# Mise à jour système
sudo apt update && sudo apt upgrade -y

# Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# PostgreSQL 14
sudo apt install -y postgresql postgresql-contrib

# Nginx
sudo apt install -y nginx

# SSL
sudo apt install -y certbot python3-certbot-nginx

# PM2
sudo npm install -g pm2

# Git
sudo apt install -y git
```

---

## 2️⃣ Base de données PostgreSQL

### Création et configuration

```bash
# Connexion PostgreSQL
sudo -u postgres psql
```

```sql
-- Créer utilisateur
CREATE USER autofleet_user WITH PASSWORD 'VotreMOTdePASSE2025!';

-- Créer BDD
CREATE DATABASE autofleet OWNER autofleet_user;

-- Privilèges
GRANT ALL PRIVILEGES ON DATABASE autofleet TO autofleet_user;

\q
```

### Import du schéma

```bash
# Copier database-schema.sql sur le serveur
# Puis importer:
psql -U autofleet_user -d autofleet -f database-schema.sql
```

### Créer le premier admin

```bash
# Générer le hash bcrypt
node << 'EOF'
const bcrypt = require('bcrypt');
bcrypt.hash('admin123', 10).then(hash => console.log(hash));
EOF
```

Puis dans PostgreSQL:
```sql
\c autofleet

INSERT INTO users (username, password_hash, name, role, email, phone, avatar, permissions)
VALUES ('admin', 'LE_HASH_GENERE', 'Amadou Seck', 'Administrateur', 
        'admin@autofleet.sn', '+221 77 999 8888', '👨🏿‍💼', ARRAY['all']);
```

---

## 3️⃣ Backend API

### Structure et installation

```bash
# Créer la structure
sudo mkdir -p /var/www/autofleet/backend
sudo chown -R $USER:$USER /var/www/autofleet
cd /var/www/autofleet/backend

# Créer package.json (copier backend-package.json)
npm install

# Structure des dossiers
mkdir -p config routes middleware logs uploads
```

### Fichiers à copier

Copier ces fichiers sur le serveur:
- `server.js`
- `config/database.js`
- `routes/auth.js`
- `routes/payments.js`
- `middleware/auth.js`
- `.env.example` → `.env` (et configurer)

### Configuration .env

```bash
nano .env
```

```env
# Base de données
DATABASE_URL=postgresql://autofleet_user:MOT_DE_PASSE@localhost:5432/autofleet
DB_HOST=localhost
DB_PORT=5432
DB_USER=autofleet_user
DB_PASSWORD=VotreMOTdePASSE2025!
DB_NAME=autofleet

# JWT (générer avec: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
JWT_SECRET=a3f5c8b9d2e6f7a1b4c3d9e8f2a7b6c4d1e9f3a8b5c2d7e4f1a9b6c3d8e5f2a7
JWT_EXPIRATION=24h

# Application
NODE_ENV=production
PORT=3000
API_URL=https://api.autofleet.sn
FRONTEND_URL=https://autofleet.sn
CORS_ORIGIN=https://autofleet.sn
```

### PM2 Configuration

```bash
nano ecosystem.config.js
```

```javascript
module.exports = {
  apps: [{
    name: 'autofleet-api',
    script: './server.js',
    instances: 2,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
};
```

```bash
# Démarrer
pm2 start ecosystem.config.js
pm2 startup
pm2 save
```

---

## 4️⃣ Frontend React

### Installation

```bash
cd /var/www/autofleet
npm create vite@latest frontend -- --template react
cd frontend
npm install
npm install lucide-react axios
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### Configuration

Copier le contenu de `yango-fleet-management-v2.jsx` dans `src/App.jsx`

Créer `src/services/api.js`:
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://api.autofleet.sn/api'
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
```

Créer `.env.production`:
```env
VITE_API_URL=https://api.autofleet.sn/api
```

### Build

```bash
npm run build
```

---

## 5️⃣ Nginx

### Configuration

```bash
sudo nano /etc/nginx/sites-available/autofleet
```

```nginx
# API Backend
server {
    listen 80;
    server_name api.autofleet.sn;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Frontend
server {
    listen 80;
    server_name autofleet.sn www.autofleet.sn;
    root /var/www/autofleet/frontend/dist;
    index index.html;

    location / {
        try_files $uri /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public";
    }

    gzip on;
    gzip_types text/css application/javascript application/json;
}
```

```bash
# Activer
sudo ln -s /etc/nginx/sites-available/autofleet /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### SSL avec Let's Encrypt

```bash
sudo certbot --nginx -d autofleet.sn -d www.autofleet.sn -d api.autofleet.sn
```

---

## 6️⃣ Sécurité

```bash
# Firewall
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable

# Fail2Ban
sudo apt install fail2ban
sudo systemctl enable fail2ban
```

---

## 7️⃣ Backup automatique

```bash
sudo nano /usr/local/bin/backup-autofleet.sh
```

```bash
#!/bin/bash
BACKUP_DIR="/var/backups/autofleet"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR
pg_dump -U autofleet_user autofleet | gzip > $BACKUP_DIR/db_$DATE.sql.gz
find $BACKUP_DIR -name "db_*.sql.gz" -mtime +30 -delete
```

```bash
sudo chmod +x /usr/local/bin/backup-autofleet.sh
sudo crontab -e
# Ajouter: 0 2 * * * /usr/local/bin/backup-autofleet.sh
```

---

## ✅ Checklist de déploiement

- [ ] PostgreSQL installé + BDD créée
- [ ] Admin créé dans la BDD
- [ ] Backend démarré avec PM2
- [ ] Frontend buildé
- [ ] Nginx configuré
- [ ] SSL actif (HTTPS)
- [ ] Firewall configuré
- [ ] Backups configurés
- [ ] DNS pointé vers le serveur
- [ ] Tests effectués

---

## 🎉 Déploiement terminé !

Votre application AutoFleet est maintenant en ligne à l'adresse :
**https://autofleet.sn**

L'API est accessible à :
**https://api.autofleet.sn**
