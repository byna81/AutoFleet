# 📋 Système de gestion des propriétaires - AutoFleet

## 🎯 Vue d'ensemble

AutoFleet gère maintenant **deux types de véhicules** :

1. **Véhicules de la société** - Propriété d'AutoFleet
2. **Véhicules de particuliers** - Gestion déléguée pour le compte de propriétaires externes

---

## 💼 Modèle économique

### Schéma classique de gestion déléguée

```
┌─────────────┐       15,000 FCFA/jour      ┌──────────────┐
│  CHAUFFEUR  │ ────────────────────────────> │   AUTOFLEET  │
└─────────────┘                               └──────────────┘
                                                      │
                                   ┌──────────────────┴────────────────┐
                                   │                                   │
                              13,000 FCFA                         2,000 FCFA
                         (Part propriétaire)                (Commission AutoFleet)
                                   │                                   │
                                   ▼                                   ▼
                            ┌─────────────┐                    ┌─────────────┐
                            │ PROPRIÉTAIRE│                    │   SOCIÉTÉ   │
                            │   (Awa)     │                    │  AutoFleet  │
                            └─────────────┘                    └─────────────┘
```

### Exemple concret

**Véhicule**: DK-012-GH (Kia Picanto appartenant à Awa Diagne)

- **Chauffeur paie**: 16,000 FCFA/jour
- **Propriétaire reçoit**: 14,000 FCFA/jour
- **AutoFleet garde**: 2,000 FCFA/jour

**Sur 1 mois (26 jours travaillés):**
- Total collecté: 416,000 FCFA
- Versé au propriétaire: 364,000 FCFA
- Commission AutoFleet: 52,000 FCFA

---

## 🗄️ Structure des données

### 1. Propriétaires (`vehicle_owners`)

```javascript
{
  id: 1,
  type: 'Particulier', // ou 'Société'
  firstName: 'Ousmane',
  lastName: 'Fall',
  cin: '1987654321098',
  phone: '+221 77 555 1234',
  email: 'ousmane.fall@email.com',
  address: 'Mermoz, Dakar',
  bankAccount: 'SN001234567890', // IBAN
  mobileMoney: '+221 77 555 1234', // Wave, Orange Money
  status: 'active'
}
```

### 2. Contrats de gestion (`management_contracts`)

```javascript
{
  id: 1,
  vehicleId: 'DK-789-EF',
  ownerId: 1,
  driverDailyPayment: 10000, // ✅ Ce que paie le chauffeur
  ownerDailyShare: 8000,      // ✅ Ce que reçoit le propriétaire
  companyDailyShare: 2000,    // ✅ Ce que garde AutoFleet
  
  // Validation automatique: ownerShare + companyShare ≤ driverPayment
  
  startDate: '2024-01-01',
  endDate: null, // null = durée indéterminée
  
  paymentFrequency: 'mensuel', // hebdomadaire, bi-mensuel, mensuel
  paymentDay: 5, // Le 5 de chaque mois
  
  maintenanceResponsibility: 'société', // propriétaire, société, partagé
  insuranceResponsibility: 'propriétaire',
  
  securityDeposit: 0,
  status: 'active'
}
```

### 3. Paiements aux propriétaires (`owner_payments`)

```javascript
{
  id: 1,
  managementContractId: 1,
  ownerId: 1,
  vehicleId: 'DK-789-EF',
  
  // Période couverte
  periodStart: '2025-01-01',
  periodEnd: '2025-01-31',
  numberOfDays: 26, // Jours travaillés
  
  // Calculs
  totalDriverPayments: 260000,  // 26 × 10,000
  ownerShare: 208000,            // 26 × 8,000
  companyShare: 52000,           // 26 × 2,000
  
  // Déductions éventuelles
  deductions: 0,
  deductionReason: null,
  
  netAmount: 208000, // ownerShare - deductions
  
  // Statut du paiement
  paymentStatus: 'paid', // pending, paid, partial, cancelled
  paymentDate: '2025-02-05',
  paymentMethod: 'Virement bancaire',
  paymentReference: 'VIR-2025-001'
}
```

---

## 🎨 Interface utilisateur

### Onglet "Propriétaires" 🏢

**Liste des propriétaires avec:**
- Type (Particulier/Société)
- Nom complet
- Téléphone
- Nombre de véhicules en gestion
- Montant total versé
- Solde en attente
- Boutons d'action (Voir détails, Modifier, Payer)

**Formulaire d'ajout:**
- Type de propriétaire
- Informations personnelles
- Coordonnées bancaires/Mobile Money
- Documents (CIN, contrat...)

### Onglet "Contrats de gestion" 📋

Intégré dans l'onglet **Contrats** existant, avec distinction visuelle:
- **Contrats chauffeurs** (LAO/Location) - Fond bleu/violet
- **Contrats propriétaires** (Gestion) - Fond vert

**Informations affichées:**
- Véhicule concerné
- Propriétaire
- Répartition financière (graphique visuel)
- Responsabilités (maintenance, assurance)
- Statut du contrat

### Onglet "Paiements propriétaires" 💵

**Tableau des paiements avec:**
- Propriétaire
- Véhicule
- Période
- Jours travaillés
- Montant dû
- Commission AutoFleet
- Statut (Payé/En attente)
- Date de paiement
- Mode de paiement

**Bouton "Générer un paiement":**
- Sélection du propriétaire
- Sélection de la période
- Calcul automatique basé sur les versements chauffeurs
- Déductions éventuelles
- Choix du mode de paiement
- Confirmation et impression de reçu

### Dashboard amélioré 📊

**Nouvelles statistiques:**
- Nombre de véhicules en gestion
- Commission mensuelle AutoFleet
- Paiements propriétaires en attente
- Taux de marge moyen

**Graphiques:**
- Répartition véhicules société vs particuliers
- Évolution des commissions
- Comparaison rentabilité par véhicule

---

## 🔄 Flux de travail

### 1. Ajout d'un nouveau propriétaire

```
1. Clic sur "Propriétaires" → "Ajouter un propriétaire"
2. Remplir le formulaire (type, identité, coordonnées bancaires)
3. Scanner et uploader documents (CIN, RIB)
4. Sauvegarder
```

### 2. Création d'un contrat de gestion

```
1. Onglet "Véhicules" → Sélectionner le véhicule
2. Indiquer "Propriétaire: Particulier"
3. Choisir le propriétaire dans la liste
4. Créer le contrat de gestion:
   - Montant versement chauffeur: 15,000 FCFA
   - Part propriétaire: 13,000 FCFA
   - Commission AutoFleet: 2,000 FCFA
   - Fréquence de paiement: Mensuel
   - Responsabilités
5. Signer et activer
```

### 3. Versement quotidien du chauffeur

```
Processus normal (identique):
1. Chauffeur verse 15,000 FCFA
2. Gestionnaire enregistre le paiement
3. Le système calcule automatiquement:
   - 13,000 FCFA → Compte propriétaire
   - 2,000 FCFA → Revenus AutoFleet
```

### 4. Paiement au propriétaire

```
1. Onglet "Paiements propriétaires"
2. Clic "Générer un paiement"
3. Sélectionner propriétaire et période
4. Le système calcule automatiquement:
   - Nombre de jours travaillés (basé sur les versements reçus)
   - Montant total dû
   - Déductions éventuelles
5. Choisir mode de paiement (Virement/Wave/Orange Money)
6. Valider et marquer comme "Payé"
7. Générer reçu de paiement
```

---

## 💰 Calculs automatiques

### Fonction: Calculer paiement propriétaire

```javascript
function calculateOwnerPayment(ownerId, startDate, endDate) {
  // 1. Récupérer tous les versements de chauffeurs
  const driverPayments = getDriverPayments({
    vehicleOwnerId: ownerId,
    startDate,
    endDate,
    status: 'paid'
  });
  
  // 2. Récupérer le contrat de gestion
  const contract = getManagementContract(ownerId);
  
  // 3. Calculer
  const numberOfDays = driverPayments.length;
  const totalCollected = numberOfDays * contract.driverDailyPayment;
  const ownerShare = numberOfDays * contract.ownerDailyShare;
  const companyShare = numberOfDays * contract.companyDailyShare;
  
  // 4. Appliquer déductions éventuelles
  const deductions = calculateDeductions(ownerId, startDate, endDate);
  const netAmount = ownerShare - deductions;
  
  return {
    numberOfDays,
    totalCollected,
    ownerShare,
    companyShare,
    deductions,
    netAmount
  };
}
```

### Exemples de déductions

- Réparations urgentes prises en charge par AutoFleet
- Amendes ou contraventions
- Frais administratifs exceptionnels
- Retard de paiement du chauffeur (selon contrat)

---

## 📊 Rapports disponibles

### 1. Rapport mensuel par propriétaire

```
Propriétaire: Ousmane Fall
Véhicule: DK-789-EF (Renault Symbol)
Période: Janvier 2025

┌──────────────────────────────────────────┐
│ DÉTAILS DES VERSEMENTS                   │
├──────────────────────────────────────────┤
│ Jours travaillés:        26 jours        │
│ Jours repos/absence:     5 jours         │
│                                          │
│ Total collecté:          260,000 FCFA    │
│ Votre part:              208,000 FCFA    │
│ Commission AutoFleet:    52,000 FCFA     │
│                                          │
│ Déductions:              0 FCFA          │
│ Net à payer:             208,000 FCFA    │
└──────────────────────────────────────────┘

Mode de paiement: Virement bancaire
Date de paiement: 05/02/2025
Référence: VIR-2025-001
```

### 2. Rapport de rentabilité par véhicule

```
┌─────────────┬──────────┬─────────┬──────────┬────────┐
│ Véhicule    │ Propriét.│ Collecté│ Commission│ Marge  │
├─────────────┼──────────┼─────────┼──────────┼────────┤
│ DK-123-AB   │ Société  │ 390,000 │ 390,000  │ 100%   │
│ DK-789-EF   │ O. Fall  │ 260,000 │ 52,000   │ 20%    │
│ DK-012-GH   │ A.Diagne │ 432,000 │ 54,000   │ 12.5%  │
└─────────────┴──────────┴─────────┴──────────┴────────┘
```

---

## ⚠️ Règles de gestion

### Validations automatiques

1. **ownerShare + companyShare ≤ driverDailyPayment**
   - Empêche de dépasser le montant collecté

2. **Statut du contrat**
   - Un véhicule ne peut avoir qu'un seul contrat actif
   - Expiration automatique selon dates

3. **Paiements propriétaires**
   - Impossible de payer deux fois la même période
   - Vérification que les versements chauffeurs sont bien enregistrés

### Alertes

- 🔴 **Paiement propriétaire en retard** (>5 jours après date prévue)
- 🟠 **Écart important** entre versements attendus et réels
- 🟢 **Paiement à effectuer** (approche de la date limite)

---

## 🔐 Permissions

### Administrateur
- Créer/modifier/supprimer propriétaires
- Créer/modifier contrats de gestion
- Générer et valider paiements propriétaires
- Voir tous les rapports financiers

### Gestionnaire
- Voir la liste des propriétaires
- Voir les contrats de gestion
- Enregistrer les versements chauffeurs (normal)
- Voir les paiements propriétaires en attente
- **Ne peut pas** : modifier les termes financiers ni valider les paiements

---

## 📱 Notifications

### Email/SMS au propriétaire
- Paiement effectué (avec reçu PDF)
- Rappel de paiement (2 jours avant)
- Alerte si chauffeur en retard de paiement
- Rapport mensuel automatique

### Email/SMS à AutoFleet
- Nouveau propriétaire ajouté
- Contrat de gestion arrivant à échéance
- Paiement propriétaire effectué

---

## 🎯 Avantages du système

### Pour AutoFleet
✅ Commission garantie sur chaque véhicule  
✅ Élargissement du parc sans investissement  
✅ Gestion centralisée et automatisée  
✅ Traçabilité complète des flux financiers  

### Pour les propriétaires
✅ Revenu passif régulier  
✅ Gestion professionnelle du véhicule  
✅ Rapports transparents  
✅ Paiements fiables et traçables  

### Pour les chauffeurs
✅ Processus identique (aucun changement)  
✅ Support de la société  

---

## 🚀 Prêt pour la production !

Le système est maintenant complet avec :
- ✅ Base de données étendue
- ✅ Calculs automatiques
- ✅ Validation des montants
- ✅ Rapports financiers
- ✅ Traçabilité complète
