// Vehicles-v2.jsx - Gestion véhicules avec CRUD + Validation Admin
import React, { useState } from 'react';
import { Plus, Edit, Trash2, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const Vehicles = ({ payments, vehicles, setVehicles, currentUser, hasPermission, managementContracts, contracts }) => {
  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [newVehicle, setNewVehicle] = useState({
    id: '',
    brand: '',
    year: '',
    ownershipType: 'Société',
    ownerName: ''
  });

  const pendingVehicles = vehicles?.filter(v => v.status === 'pending') || [];
  const validatedVehicles = vehicles?.filter(v => v.status === 'validated' || !v.status) || [];

  const handleAddVehicle = (e) => {
    e.preventDefault();

    const vehicle = {
      ...newVehicle,
      year: parseInt(newVehicle.year),
      status: hasPermission('all') ? 'validated' : 'pending',
      createdBy: currentUser.id,
      createdByName: currentUser.name,
      createdAt: new Date().toISOString()
    };

    if (hasPermission('all')) {
      vehicle.validatedBy = currentUser.id;
      vehicle.validatedByName = currentUser.name;
      vehicle.validatedAt = new Date().toISOString();
    }

    const updatedVehicles = [...(vehicles || []), vehicle];
    setVehicles(updatedVehicles);

    alert(
      hasPermission('all')
        ? `✅ Véhicule ajouté et validé!\n${newVehicle.id} - ${newVehicle.brand}`
        : `✅ Véhicule ajouté!\nEn attente de validation Admin\n${newVehicle.id} - ${newVehicle.brand}`
    );

    setShowAddVehicle(false);
    setNewVehicle({
      id: '',
      brand: '',
      year: '',
      ownershipType: 'Société',
      ownerName: ''
    });
  };

  const handleEditVehicle = (e) => {
    e.preventDefault();

    const updatedVehicles = (vehicles || []).map(v => {
      if (v.id === editingVehicle.id) {
        return {
          ...v,
          ...editingVehicle,
          year: parseInt(editingVehicle.year),
          status: hasPermission('all') ? v.status : 'pending',
          modifiedBy: currentUser.id,
          modifiedByName: currentUser.name,
          modifiedAt: new Date().toISOString()
        };
      }
      return v;
    });

    setVehicles(updatedVehicles);
    alert('✅ Véhicule modifié!');
    setEditingVehicle(null);
  };

  const handleDeleteVehicle = (vehicleId) => {
    const vehicle = (vehicles || []).find(v => v.id === vehicleId);
    if (!vehicle) return;

    if (window.confirm(`Supprimer le véhicule ${vehicleId} ?`)) {
      const updatedVehicles = (vehicles || []).filter(v => v.id !== vehicleId);
      setVehicles(updatedVehicles);
      alert('✅ Véhicule supprimé');
    }
  };

  const handleValidateVehicle = (vehicleId) => {
    const updatedVehicles = (vehicles || []).map(v => {
      if (v.id === vehicleId) {
        return {
          ...v,
          status: 'validated',
          validatedBy: currentUser.id,
          validatedByName: currentUser.name,
          validatedAt: new Date().toISOString()
        };
      }
      return v;
    });

    setVehicles(updatedVehicles);
    alert('✅ Véhicule validé');
  };

  const handleRejectVehicle = (vehicleId) => {
    const reason = window.prompt('Motif du rejet:');
    if (!reason) return;

    const updatedVehicles = (vehicles || []).map(v => {
      if (v.id === vehicleId) {
        return {
          ...v,
          status: 'rejected',
          rejectedBy: currentUser.id,
          rejectedByName: currentUser.name,
          rejectedAt: new Date().toISOString(),
          rejectionReason: reason
        };
      }
      return v;
    });

    setVehicles(updatedVehicles);
    alert('❌ Véhicule rejeté');
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">🚗 Parc automobile</h1>
        <button
          onClick={() => setShowAddVehicle(true)}
          className="bg-green-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-green-700"
        >
          <Plus size={20} />
          Ajouter un véhicule
        </button>
      </div>

      {/* Validations en attente */}
      {hasPermission('all') && pendingVehicles.length > 0 && (
        <div className="mb-8 bg-yellow-50 border-2 border-yellow-300 rounded-xl p-6">
          <h2 className="text-xl font-bold text-yellow-900 mb-4 flex items-center gap-2">
            <AlertCircle size={24} />
            ⚠️ Validations en attente ({pendingVehicles.length})
          </h2>
          <div className="space-y-3">
            {pendingVehicles.map(vehicle => (
              <div key={vehicle.id} className="bg-white p-4 rounded-lg border border-yellow-200">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-lg">{vehicle.id}</p>
                    <p className="text-sm text-gray-600">{vehicle.brand} ({vehicle.year})</p>
                    <p className="text-sm text-gray-600">Type: {vehicle.ownershipType}</p>
                    {vehicle.ownerName && <p className="text-sm text-gray-600">Propriétaire: {vehicle.ownerName}</p>}
                    <p className="text-sm text-gray-500">Créé par: {vehicle.createdByName}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleValidateVehicle(vehicle.id)}
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center gap-1"
                    >
                      <CheckCircle size={16} />
                      Valider
                    </button>
                    <button
                      onClick={() => handleRejectVehicle(vehicle.id)}
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
      {showAddVehicle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-6">Nouveau véhicule</h2>
            <form onSubmit={handleAddVehicle}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Matricule</label>
                <input
                  type="text"
                  value={newVehicle.id}
                  onChange={(e) => setNewVehicle({...newVehicle, id: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Ex: DK-123-AB"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Marque / Modèle</label>
                <input
                  type="text"
                  value={newVehicle.brand}
                  onChange={(e) => setNewVehicle({...newVehicle, brand: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Ex: Toyota Corolla"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Année</label>
                <input
                  type="number"
                  value={newVehicle.year}
                  onChange={(e) => setNewVehicle({...newVehicle, year: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg"
                  min="2000"
                  max="2030"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Type de propriété</label>
                <select
                  value={newVehicle.ownershipType}
                  onChange={(e) => setNewVehicle({...newVehicle, ownershipType: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  <option value="Société">Société</option>
                  <option value="Particulier">Particulier</option>
                </select>
              </div>
              {newVehicle.ownershipType === 'Particulier' && (
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Nom du propriétaire</label>
                  <input
                    type="text"
                    value={newVehicle.ownerName}
                    onChange={(e) => setNewVehicle({...newVehicle, ownerName: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  />
                </div>
              )}
              <div className="flex gap-2">
                <button type="submit" className="flex-1 bg-green-600 text-white py-2 rounded-lg">
                  Ajouter
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddVehicle(false)}
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
      {editingVehicle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-6">Modifier le véhicule</h2>
            <form onSubmit={handleEditVehicle}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Matricule</label>
                <input
                  type="text"
                  value={editingVehicle.id}
                  className="w-full px-4 py-2 border rounded-lg bg-gray-100"
                  disabled
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Marque / Modèle</label>
                <input
                  type="text"
                  value={editingVehicle.brand}
                  onChange={(e) => setEditingVehicle({...editingVehicle, brand: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Année</label>
                <input
                  type="number"
                  value={editingVehicle.year}
                  onChange={(e) => setEditingVehicle({...editingVehicle, year: e.target.value})}
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
                  onClick={() => setEditingVehicle(null)}
                  className="flex-1 bg-gray-300 py-2 rounded-lg"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Liste des véhicules avec répartition financière */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {validatedVehicles.map(vehicle => {
          const mgmtContract = (managementContracts || []).find(mc => mc.vehicleId === vehicle.id);
          const vehiclePayments = (payments || []).filter(p => {
            const contract = (contracts || []).find(c => c.id === p.contractId);
            return contract?.vehicleId === vehicle.id && p.date.startsWith('2025-02');
          });

          const totalCollected = vehiclePayments.reduce((sum, p) => sum + p.amount, 0);
          let companyShare, ownerShare;

          if (vehicle.ownershipType === 'Société') {
            companyShare = totalCollected;
            ownerShare = 0;
          } else if (mgmtContract) {
            ownerShare = vehiclePayments.length * mgmtContract.ownerDailyShare;
            companyShare = vehiclePayments.length * mgmtContract.companyDailyShare;
          } else {
            ownerShare = 0;
            companyShare = 0;
          }

          const margin = totalCollected > 0 ? ((companyShare / totalCollected) * 100).toFixed(1) : 0;

          return (
            <div
              key={vehicle.id}
              className={`bg-white rounded-xl shadow-lg border-l-4 ${
                vehicle.ownershipType === 'Société' ? 'border-blue-500' : 'border-green-500'
              }`}
            >
              <div className={`p-4 ${vehicle.ownershipType === 'Société' ? 'bg-blue-50' : 'bg-green-50'}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-xl">{vehicle.id}</h3>
                    <p className="text-sm text-gray-600">{vehicle.brand} ({vehicle.year})</p>
                    {vehicle.ownershipType === 'Particulier' && (
                      <p className="text-sm text-green-700 font-medium mt-1">
                        Propriétaire: {vehicle.ownerName}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2 items-start">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        vehicle.ownershipType === 'Société'
                          ? 'bg-blue-200 text-blue-800'
                          : 'bg-green-200 text-green-800'
                      }`}
                    >
                      {vehicle.ownershipType === 'Société' ? '🏢 Société' : '👤 Particulier'}
                    </span>
                    <button
                      onClick={() => setEditingVehicle(vehicle)}
                      className="text-orange-600 hover:text-orange-800"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteVehicle(vehicle.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-4">
                <h4 className="font-bold text-sm text-gray-700 mb-3">💰 Février 2025</h4>
                <div className="space-y-2">
                  <div className="flex justify-between p-2 bg-gray-50 rounded">
                    <span className="text-xs text-gray-600">Total collecté:</span>
                    <span className="font-bold">{totalCollected.toLocaleString()} FCFA</span>
                  </div>
                  <div className="flex justify-between p-2 bg-gray-50 rounded">
                    <span className="text-xs text-gray-600">Jours payés:</span>
                    <span className="font-bold">{vehiclePayments.length}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-blue-50 rounded border border-blue-200">
                    <span className="text-sm font-medium text-blue-900">🏢 Part Société:</span>
                    <span className="font-bold text-blue-700">{companyShare.toLocaleString()} FCFA</span>
                  </div>
                  <div className="flex justify-between p-3 bg-green-50 rounded border border-green-200">
                    <span className="text-sm font-medium text-green-900">👤 Part Propriétaire:</span>
                    <span className="font-bold text-green-700">{ownerShare.toLocaleString()} FCFA</span>
                  </div>
                  <div className="text-center text-xs text-gray-600 mt-2">
                    {vehicle.ownershipType === 'Société' ? 'Marge: 100%' : `Marge société: ${margin}%`}
                  </div>
                </div>

                {mgmtContract && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-600 mb-2">Répartition journalière:</p>
                    <div className="flex justify-between text-xs">
                      <span className="text-green-700">Propriétaire: {mgmtContract.ownerDailyShare.toLocaleString()} FCFA</span>
                      <span className="text-blue-700">Société: {mgmtContract.companyDailyShare.toLocaleString()} FCFA</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {validatedVehicles.length === 0 && pendingVehicles.length === 0 && (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <div className="text-6xl mb-4">🚗</div>
          <p className="text-gray-600">Aucun véhicule enregistré</p>
        </div>
      )}
    </div>
  );
};

export default Vehicles;
