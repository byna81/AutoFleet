# 📚 Exemples de code pour v2

## 1. Colonne "Type" dans Versements

```jsx
// Dans Payments.jsx - Modifier le tableau

<thead>
  <tr>
    <th>Chauffeur</th>
    <th>Date</th>
    <th>Type</th>  {/* NOUVEAU */}
    <th>Montant</th>
    <th>Enregistré par</th>
    <th>Actions</th>
  </tr>
</thead>

<tbody>
  {payments.map(payment => {
    const driver = drivers.find(d => d.id === payment.driverId);
    const contract = contracts.find(c => c.id === payment.contractId);
    
    return (
      <tr key={payment.id}>
        <td>{driver?.name}</td>
        <td>{payment.date}</td>
        <td>
          <span className={`px-2 py-1 rounded text-xs ${
            contract?.type === 'LAO' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
          }`}>
            {contract?.type}
          </span>
        </td>
        <td>{payment.amount.toLocaleString()} FCFA</td>
        <td>{payment.recordedBy}</td>
        <td>
          <button onClick={() => setEditingPayment(payment)}>
            Modifier
          </button>
        </td>
      </tr>
    );
  })}
</tbody>
```

## 2. Modification de versement avec motif

```jsx
// Modal de modification
const [editingPayment, setEditingPayment] = useState(null);
const [editReason, setEditReason] = useState('');

const handleEditPayment = (e) => {
  e.preventDefault();
  
  if (!editReason.trim()) {
    alert('Veuillez indiquer le motif de modification');
    return;
  }

  const modification = {
    modifiedAt: new Date().toISOString(),
    modifiedBy: currentUser.name,
    modifiedById: currentUser.id,
    reason: editReason,
    changes: {
      amount: {
        old: editingPayment.originalAmount,
        new: parseFloat(editingPayment.amount)
      }
    }
  };

  const updatedPayments = payments.map(p => {
    if (p.id === editingPayment.id) {
      return {
        ...p,
        amount: parseFloat(editingPayment.amount),
        modifications: [...(p.modifications || []), modification]
      };
    }
    return p;
  });

  setPayments(updatedPayments);
  setEditingPayment(null);
  setEditReason('');
  alert('✅ Versement modifié avec succès');
};
```

## 3. Validation Admin pour contrats

```jsx
// Dans OwnersEnhanced.jsx

const [pendingContracts, setPendingContracts] = useState([]);

const handleValidateContract = (contractId) => {
  const updatedContracts = managementContracts.map(c => {
    if (c.id === contractId) {
      return {
        ...c,
        status: 'validated',
        validatedBy: currentUser.id,
        validatedByName: currentUser.name,
        validatedAt: new Date().toISOString()
      };
    }
    return c;
  });
  
  setManagementContracts(updatedContracts);
  alert('✅ Contrat validé');
};

const handleRejectContract = (contractId, reason) => {
  const updatedContracts = managementContracts.map(c => {
    if (c.id === contractId) {
      return {
        ...c,
        status: 'rejected',
        rejectedBy: currentUser.id,
        rejectedByName: currentUser.name,
        rejectedAt: new Date().toISOString(),
        rejectionReason: reason
      };
    }
    return c;
  });
  
  setManagementContracts(updatedContracts);
};

// Dans le rendu - Section Admin
{hasPermission('all') && (
  <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-xl p-6">
    <h3 className="font-bold text-yellow-900 mb-4">
      ⚠️ Validations en attente ({pendingContracts.length})
    </h3>
    {pendingContracts.map(contract => (
      <div key={contract.id} className="bg-white p-4 rounded mb-2">
        <p><strong>{contract.ownerName}</strong> - {contract.vehicleId}</p>
        <div className="mt-2 flex gap-2">
          <button 
            onClick={() => handleValidateContract(contract.id)}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            ✅ Valider
          </button>
          <button 
            onClick={() => {
              const reason = prompt('Motif du rejet:');
              if (reason) handleRejectContract(contract.id, reason);
            }}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            ❌ Rejeter
          </button>
        </div>
      </div>
    ))}
  </div>
)}
```

## 4. Calcul paiement propriétaire

```jsx
// Dans OwnerPayments.jsx

const calculateOwnerPayment = (ownerId, month, year) => {
  const mgmtContract = managementContracts.find(mc => mc.ownerId === ownerId);
  if (!mgmtContract) return null;

  const monthPayments = payments.filter(p => {
    const contract = contracts.find(c => c.id === p.contractId);
    return (
      contract?.vehicleId === mgmtContract.vehicleId &&
      p.date.startsWith(`${year}-${month.toString().padStart(2, '0')}`)
    );
  });

  const numberOfDays = monthPayments.length;
  const ownerShare = numberOfDays * mgmtContract.ownerDailyShare;
  const companyShare = numberOfDays * mgmtContract.companyDailyShare;

  return {
    ownerId,
    ownerName: mgmtContract.ownerName,
    vehicleId: mgmtContract.vehicleId,
    month,
    year,
    numberOfDays,
    dailyRate: mgmtContract.ownerDailyShare,
    ownerShare,
    companyShare,
    totalCollected: numberOfDays * mgmtContract.driverDailyPayment,
    status: 'unpaid'
  };
};

// Marquer comme payé
const handleMarkAsPaid = (paymentId, method, notes) => {
  const updatedPayments = ownerPayments.map(op => {
    if (op.id === paymentId) {
      return {
        ...op,
        status: 'paid',
        paidAt: new Date().toISOString(),
        paidBy: currentUser.id,
        paidByName: currentUser.name,
        paymentMethod: method,
        paymentNotes: notes
      };
    }
    return op;
  });
  
  setOwnerPayments(updatedPayments);
  alert(`✅ Paiement marqué comme effectué\nMontant: ${payment.ownerShare.toLocaleString()} FCFA`);
};
```

## 5. Boutons Ajouter/Modifier/Supprimer véhicule

```jsx
// Dans VehiclesEnhanced.jsx

const [showAddVehicle, setShowAddVehicle] = useState(false);
const [newVehicle, setNewVehicle] = useState({
  id: '',
  brand: '',
  year: '',
  ownershipType: 'Société'
});

const handleAddVehicle = (e) => {
  e.preventDefault();
  
  const vehicle = {
    ...newVehicle,
    status: hasPermission('all') ? 'validated' : 'pending',
    createdBy: currentUser.id,
    createdByName: currentUser.name,
    createdAt: new Date().toISOString()
  };

  setVehicles([...vehicles, vehicle]);
  
  if (vehicle.status === 'pending') {
    alert('✅ Véhicule ajouté!\nEn attente de validation Admin');
  } else {
    alert('✅ Véhicule ajouté et validé!');
  }
  
  setShowAddVehicle(false);
};
```

---

**Ces exemples vous montrent la structure. Vous pouvez les adapter selon vos besoins ! 🚀**
