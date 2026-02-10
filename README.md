# 🚗 AutoFleet - La gestion intelligente des chauffeurs

[![License](https://img.shields.io/badge/license-Proprietary-red.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/autofleet/autofleet)
[![Status](https://img.shields.io/badge/status-Production%20Ready-brightgreen.svg)](https://github.com/autofleet/autofleet)

**Application complète de gestion de flotte automobile pour le Sénégal**

---

## 📋 Table des matières

- [À propos](#à-propos)
- [Fonctionnalités](#fonctionnalités)
- [Technologies](#technologies)
- [Installation](#installation)
- [Structure du projet](#structure-du-projet)
- [Déploiement](#déploiement)
- [Documentation](#documentation)
- [Licence](#licence)

---

## 🎯 À propos

**AutoFleet** est une solution complète de gestion de flotte automobile conçue spécifiquement pour le marché sénégalais. Elle permet de gérer efficacement :

- 👥 **Chauffeurs** - Profils complets, documents, performance
- 🚗 **Véhicules** - Parc automobile (société + particuliers)
- 📄 **Contrats** - LAO, Location, et Contrats de gestion
- 💰 **Versements** - Suivi journalier avec historique complet
- 🔧 **Maintenance** - Planning automatisé et alertes
- 🏢 **Propriétaires** - Gestion déléguée pour particuliers
- 💵 **Paiements** - Versements aux propriétaires avec répartition automatique

### 💼 Modèle économique unique

AutoFleet permet deux modes de fonctionnement :

1. **Véhicules société** - 100% des revenus pour AutoFleet
2. **Véhicules particuliers** - Gestion déléguée avec répartition automatique

**Exemple de gestion déléguée :**
```
Chauffeur verse : 15,000 FCFA/jour
  ↓
Propriétaire reçoit : 13,000 FCFA/jour
Commission AutoFleet : 2,000 FCFA/jour
```

---

## ✨ Fonctionnalités

### 🔐 Authentification & Utilisateurs
- ✅ 2 rôles : Administrateur & Gestionnaire
- ✅ Authentification JWT sécurisée
- ✅ Gestion des permissions granulaire
- ✅ Journal d'activité complet

### 👥 Gestion des chauffeurs
- ✅ Profils détaillés (CIN, permis, contacts)
- ✅ Suivi des documents (expiration)
- ✅ Jour de repos personnalisé
- ✅ Historique de performance

### 🚗 Gestion des véhicules
- ✅ Distinction Société / Particulier
- ✅ Suivi kilométrage et maintenance
- ✅ Assignation chauffeur/véhicule
- ✅ Statuts opérationnels

### 📄 Contrats
- ✅ Contrats chauffeurs (LAO / Location)
- ✅ Contrats de gestion (particuliers)
- ✅ Calcul automatique des échéances
- ✅ Suivi de progression

### 💰 Versements chauffeurs
- ✅ Enregistrement sécurisé avec traçabilité
- ✅ Vérification automatique selon contrat
- ✅ **Modification avec historique complet**
- ✅ Alertes de retard automatiques

### 💵 Paiements propriétaires
- ✅ Calcul automatique basé sur les jours travaillés
- ✅ Répartition Société/Propriétaire
- ✅ Modes de paiement multiples (Virement, Wave, Orange Money)
- ✅ Génération de reçus

### 🔧 Maintenance
- ✅ 10 types de maintenance prédéfinis
- ✅ Planning automatique avec alertes
- ✅ Suivi par date ET kilométrage
- ✅ Responsabilités définies par contrat

### 📊 Tableaux de bord
- ✅ Statistiques en temps réel
- ✅ Suivi financier par véhicule
- ✅ Revenus Société vs Propriétaires
- ✅ Alertes et notifications

---

## 🛠 Technologies

### Frontend
- **React 18** - Interface utilisateur
- **Tailwind CSS** - Styles modernes
- **Lucide React** - Icônes
- **Vite** - Build tool

### Backend
- **Node.js 18+** - Runtime
- **Express.js** - API REST
- **PostgreSQL 14+** - Base de données
- **bcrypt** - Hash des mots de passe
- **JWT** - Authentification
- **PM2** - Process manager

### Déploiement
- **Nginx** - Reverse proxy
- **Let's Encrypt** - SSL/HTTPS
- **Ubuntu 22.04** - Serveur

---

## 🚀 Installation

### Prérequis
```bash
Node.js >= 18.0.0
PostgreSQL >= 14.0
npm >= 9.0.0
```

### 1. Cloner le dépôt
```bash
git clone https://github.com/votre-organisation/autofleet.git
cd autofleet
```

### 2. Installer les dépendances

**Backend :**
```bash
cd backend
npm install
```

**Frontend :**
```bash
cd frontend
npm install
```

### 3. Configuration

**Backend - Créer `.env` :**
```bash
cp .env.example .env
# Éditer .env avec vos configurations
```

**Générer un secret JWT :**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 4. Base de données

**Créer la base :**
```bash
sudo -u postgres psql
CREATE USER autofleet_user WITH PASSWORD 'votre_password';
CREATE DATABASE autofleet OWNER autofleet_user;
\q
```

**Importer le schéma :**
```bash
psql -U autofleet_user -d autofleet -f database/schema.sql
psql -U autofleet_user -d autofleet -f database/extension-proprietaires.sql
```

### 5. Lancer l'application

**Développement :**
```bash
# Backend
cd backend
npm run dev

# Frontend (autre terminal)
cd frontend
npm run dev
```

**Production :**
```bash
# Backend avec PM2
cd backend
pm2 start ecosystem.config.js

# Frontend
cd frontend
npm run build
```

---

## 📁 Structure du projet

```
autofleet/
├── backend/
│   ├── config/
│   │   └── database.js          # Configuration PostgreSQL
│   ├── routes/
│   │   ├── auth.js              # Authentification
│   │   ├── users.js             # Gestion utilisateurs
│   │   ├── drivers.js           # Gestion chauffeurs
│   │   ├── vehicles.js          # Gestion véhicules
│   │   ├── contracts.js         # Gestion contrats
│   │   ├── payments.js          # Versements chauffeurs
│   │   ├── owner-payments.js    # Paiements propriétaires
│   │   ├── maintenance.js       # Maintenance
│   │   └── activity.js          # Journal d'activité
│   ├── middleware/
│   │   └── auth.js              # Middleware authentification
│   ├── server.js                # Serveur Express
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── App.jsx              # Application principale
│   │   ├── services/
│   │   │   └── api.js           # Service API
│   │   └── main.jsx
│   ├── public/
│   ├── package.json
│   └── vite.config.js
├── database/
│   ├── schema.sql               # Schéma principal (8 tables)
│   └── extension-proprietaires.sql # Extension propriétaires
├── docs/
│   ├── GUIDE-DEPLOIEMENT.md     # Guide de déploiement
│   └── DOCUMENTATION-PROPRIETAIRES.md
├── README.md
└── LICENSE
```

---

## 🌐 Déploiement

Consultez le [Guide de déploiement complet](docs/GUIDE-DEPLOIEMENT.md) pour les instructions détaillées.

**Résumé rapide :**

1. **Serveur** : Ubuntu 22.04 (4GB RAM, 2 CPU)
2. **Base de données** : PostgreSQL 14+
3. **Backend** : PM2 + Node.js
4. **Frontend** : Nginx + Build Vite
5. **SSL** : Let's Encrypt (gratuit)

**Hébergement recommandé :**
- DigitalOcean Droplet (~15€/mois)
- OVH VPS (~10€/mois)
- AWS EC2 t3.small

---

## 📚 Documentation

### Guides disponibles
- 📖 [Guide de déploiement](docs/GUIDE-DEPLOIEMENT.md)
- 🏢 [Documentation propriétaires](docs/DOCUMENTATION-PROPRIETAIRES.md)
- 🗄️ [Schéma de base de données](database/schema.sql)
- 🔐 [API Endpoints](docs/API.md)

### API Endpoints

**Authentification**
```
POST   /api/auth/login      - Connexion
POST   /api/auth/logout     - Déconnexion
GET    /api/auth/me         - Utilisateur courant
```

**Paiements**
```
GET    /api/payments             - Liste des versements
POST   /api/payments             - Créer un versement
PUT    /api/payments/:id         - Modifier un versement
GET    /api/payments/:id/history - Historique modifications
```

**Propriétaires**
```
GET    /api/owners               - Liste des propriétaires
POST   /api/owners               - Créer un propriétaire
GET    /api/owner-payments       - Paiements propriétaires
POST   /api/owner-payments       - Générer un paiement
```

[Voir la documentation complète de l'API](docs/API.md)

---

## 👥 Équipe

- **Développement** - AutoFleet Team
- **Design** - AutoFleet UI/UX
- **Product Owner** - AutoFleet Management

---

## 📄 Licence

© 2025 AutoFleet - Tous droits réservés

Ce logiciel est propriétaire. Toute utilisation, distribution ou modification non autorisée est strictement interdite.

Pour obtenir une licence commerciale, contactez : license@autofleet.sn

---

## 🆘 Support

**Email :** support@autofleet.sn  
**Téléphone :** +221 77 XXX XXXX  
**Documentation :** https://docs.autofleet.sn

---

## 🎯 Roadmap

### Version 1.1 (Q2 2025)
- [ ] Application mobile (React Native)
- [ ] Notifications push
- [ ] Export PDF/Excel

### Version 1.2 (Q3 2025)
- [ ] Intégration GPS
- [ ] Géolocalisation des versements
- [ ] Module de facturation

### Version 2.0 (Q4 2025)
- [ ] Dashboard analytique avancé
- [ ] API mobile pour chauffeurs
- [ ] Intelligence artificielle (prédictions)

---

## ⭐ Remerciements

Merci à tous ceux qui ont contribué à faire d'AutoFleet une réalité !

---

**Made with ❤️ in Senegal 🇸🇳**
