// Owners-v2.jsx - Gestion propriétaires avec CRUD + Validation Admin
import React, { useState } from 'react';
import { Plus, Edit, Trash2, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const Owners = ({ managementContracts, setManagementContracts, currentUser, hasPermission, setActiveTab }) => {
  const [showAddContract, setShowAddContract] = useState(false);
  const [editingContract, setEditingContract] = useState(null);
  const [newContract, setNewContract] = useState({
    ownerName: '',
    vehicleId: '',
    driverDailyPayment: '',
    ownerDailyShare: '',
    companyDailyShare: ''
  });

  const pendingContracts = managementContracts?.filter(c => c.status === 'pending') || [];
  const validatedContracts = managementContracts?.filter(c => c.status === 'validated') || [];

  const handleAddContract = (e) => {
    e.preventDefault();
    
    const contract = {
      id: (managementContracts?.length || 0) + 1,
      ...newContract,
      driverDailyPayment: parseFloat(newContract.driverDailyPayment),
      ownerDailyShare: parseFloat(newContract.ownerDailyShare),
      companyDailyShare: parseFloat(newContract.companyDailyShare),
      status: hasPermission('all') ? 'validated' : 'pending',
      createdBy: currentUser.id,
      createdByName: currentUser.name,
      createdAt: new Date().toISOString()
    };

    if (hasPermission('all')) {
      contract.validatedBy = currentUser.id;
      contract.validatedByName = currentUser.name;
      contract.validatedAt = new Date().toISOString();
    }

    const updatedContracts = [...(managementContracts || []), contract];
    setManagementContracts(updatedContracts);

    alert(
      hasPermission('all')
        ? `✅ Contrat créé et validé!\n${newContract.ownerName} - ${newContract.vehicleId}`
        : `✅ Contrat créé!\nEn attente de validation Admin\n${newContract.ownerName} - ${newContract.vehicleId}`
    );

    setShowAddContract(false);
    setNewContract({
      ownerName: '',
      vehicleId: '',
      driverDailyPayment: '',
      ownerDailyShare: '',
      companyDailyShare: ''
    });
  };

  const handleEditContract = (e) => {
    e.preventDefault();
    
    const updatedContracts = (managementContracts || []).map(c => {
      if (c.id === editingContract.id) {
        return {
          ...c,
          ...editingContract,
          driverDailyPayment: parseFloat(editingContract.driverDailyPayment),
          ownerDailyShare: parseFloat(editingContract.ownerDailyShare),
          companyDailyShare: parseFloat(editingContract.companyDailyShare),
          status: hasPermission('all') ? c.status : 'pending',
          modifiedBy: currentUser.id,
          modifiedByName: currentUser.name,
          modifiedAt: new Date().toISOString()
        };
      }
      return c;
    });

    setManagementContracts(updatedContracts);
    alert('✅ Contrat modifié!');
    setEditingContract(null);
  };

  const handleDeleteContract = (contractId) => {
    const contract = (managementContracts || []).find(c => c.id === contractId);
    if (!contract) return;

    if (window.confirm(`Supprimer le contrat de ${contract.ownerName} ?`)) {
      const updatedContracts = (managementContracts || []).filter(c => c.id !== contractId);
      setManagementContracts(updatedContracts);
      alert('✅ Contrat supprimé');
    }
  };

  const handleValidateContract = (contractId) => {
    const updatedContracts = (managementContracts || []).map(c => {
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

  const handleRejectContract = (contractId) => {
    const reason = window.prompt('Motif du rejet:');
    if (!reason) return;

    const updatedContracts = (managementContracts || []).map(c => {
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
    alert('❌ Contrat rejeté');
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">🏢 Propriétaires particuliers</h1>
        <button
          onClick={() => setShowAddContract(true)}
          className="bg-green-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-green-700"
        >
          <Plus size={20} />
          Ajouter un contrat
        </button>
      </div>

      {/* Validations en attente - Admin uniquement */}
      {hasPermission('all') && pendingContracts.length > 0 && (
        <div className="mb-8 bg-yellow-50 border-2 border-yellow-300 rounded-xl p-6">
          <h2 className="text-xl font-bold text-yellow-900 mb-4 flex items-center gap-2">
            <AlertCircle size={24} />
            ⚠️ Validations en attente ({pendingContracts.length})
          </h2>
          <div className="space-y-3">
            {pendingContracts.map(contract => (
              <div key={contract.id} className="bg-white p-4 rounded-lg border border-yellow-200">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-lg">{contract.ownerName}</p>
                    <p className="text-sm text-gray-600">Véhicule: {contract.vehicleId}</p>
                    <p className="text-sm text-gray-600">Créé par: {contract.createdByName}</p>
                    <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
                      <p>Chauffeur verse: {contract.driverDailyPayment.toLocaleString()} FCFA</p>
                      <p>Proprio reçoit: {contract.ownerDailyShare.toLocaleString()} FCFA</p>
                      <p>Société garde: {contract.companyDailyShare.toLocaleString()} FCFA</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleValidateContract(contract.id)}
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center gap-1"
                    >
                      <CheckCircle size={16} />
                      Valider
                    </button>
                    <button
                      onClick={() => handleRejectContract(contract.id)}
                      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 flex items-center gap-1"
                    >
                      <XCircle size={16} />
                      Rejeter
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal Ajout */}
      {showAddContract && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">Nouveau contrat de gestion</h2>
            <form onSubmit={handleAddContract}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Nom du propriétaire</label>
                <input
                  type="text"
                  value={newContract.ownerName}
                  onChange={(e) => setNewContract({...newContract, ownerName: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Véhicule (matricule)</label>
                <input
                  type="text"
                  value={newContract.vehicleId}
                  onChange={(e) => setNewContract({...newContract, vehicleId: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Ex: DK-XXX-YY"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Chauffeur verse par jour (FCFA)</label>
                <input
                  type="number"
                  value={newContract.driverDailyPayment}
                  onChange={(e) => setNewContract({...newContract, driverDailyPayment: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Propriétaire reçoit par jour (FCFA)</label>
                <input
                  type="number"
                  value={newContract.ownerDailyShare}
                  onChange={(e) => setNewContract({...newContract, ownerDailyShare: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">AutoFleet garde par jour (FCFA)</label>
                <input
                  type="number"
                  value={newContract.companyDailyShare}
                  onChange={(e) => setNewContract({...newContract, companyDailyShare: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="flex-1 bg-green-600 text-white py-2 rounded-lg">
                  Créer
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddContract(false)}
                  className="flex-1 bg-gray-300 py-2 rounded-lg"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Modification */}
      {editingContract && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">Modifier le contrat</h2>
            <form onSubmit={handleEditContract}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Nom du propriétaire</label>
                <input
                  type="text"
                  value={editingContract.ownerName}
                  onChange={(e) => setEditingContract({...editingContract, ownerName: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Chauffeur verse par jour (FCFA)</label>
                <input
                  type="number"
                  value={editingContract.driverDailyPayment}
                  onChange={(e) => setEditingContract({...editingContract, driverDailyPayment: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Propriétaire reçoit (FCFA)</label>
                <input
                  type="number"
                  value={editingContract.ownerDailyShare}
                  onChange={(e) => setEditingContract({...editingContract, ownerDailyShare: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">AutoFleet garde (FCFA)</label>
                <input
                  type="number"
                  value={editingContract.companyDailyShare}
                  onChange={(e) => setEditingContract({...editingContract, companyDailyShare: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="flex-1 bg-orange-600 text-white py-2 rounded-lg">
                  Modifier
                </button>
                <button
                  type="button"
                  onClick={() => setEditingContract(null)}
                  className="flex-1 bg-gray-300 py-2 rounded-lg"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Liste des contrats validés */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {validatedContracts.map(contract => (
          <div key={contract.id} className="border-2 border-green-200 rounded-lg p-6 bg-green-50">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-xl text-green-800">{contract.ownerName}</h3>
                <p className="text-sm text-gray-600">Véhicule: {contract.vehicleId}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditingContract(contract)}
                  className="text-orange-600 hover:text-orange-800"
                >
                  <Edit size={20} />
                </button>
                <button
                  onClick={() => handleDeleteContract(contract.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="p-3 bg-white rounded">
                <p className="text-xs text-gray-600">Chauffeur verse:</p>
                <p className="font-bold">{contract.driverDailyPayment.toLocaleString()} FCFA/jour</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 bg-green-100 rounded">
                  <p className="text-xs text-green-700">Proprio reçoit:</p>
                  <p className="font-bold text-green-800">{contract.ownerDailyShare.toLocaleString()} FCFA</p>
                </div>
                <div className="p-3 bg-blue-100 rounded">
                  <p className="text-xs text-blue-700">AutoFleet:</p>
                  <p className="font-bold text-blue-800">{contract.companyDailyShare.toLocaleString()} FCFA</p>
                </div>
              </div>
            </div>

            {/* Bouton Paiements - NOUVEAU */}
            <button
              onClick={() => {
                localStorage.setItem('selectedOwnerId', contract.id);
                setActiveTab('owner-payments');
              }}
              className="mt-4 w-full bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 flex items-center justify-center gap-2 font-medium"
            >
              💵 Voir les paiements de ce propriétaire
            </button>
          </div>
        ))}
      </div>

      {validatedContracts.length === 0 && pendingContracts.length === 0 && (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <div className="text-6xl mb-4">🏢</div>
          <p className="text-gray-600">Aucun contrat de gestion enregistré</p>
        </div>
      )}
    </div>
  );
};

export default Owners;
