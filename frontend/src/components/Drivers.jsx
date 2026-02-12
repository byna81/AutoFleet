// Drivers-v2.jsx - Gestion chauffeurs avec CRUD + Validation Admin
import React, { useState } from 'react';
import { Edit, Phone, Mail, Calendar, AlertCircle, Plus, Trash2, CheckCircle, XCircle } from 'lucide-react';

const Drivers = ({ drivers, setDrivers, contracts, vehicles, currentUser, hasPermission }) => {
  const [editingDriver, setEditingDriver] = useState(null);
  const [showAddDriver, setShowAddDriver] = useState(false);
  const [newDriver, setNewDriver] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    licenseNumber: '',
    licenseExpiry: '',
    cin: '',
    restDay: 'Lundi',
    photo: '👨🏿'
  });

  const pendingDrivers = drivers?.filter(d => d.status === 'pending') || [];
  const validatedDrivers = drivers?.filter(d => d.status === 'active' || !d.status) || [];

  const handleAddDriver = (e) => {
    e.preventDefault();

    const driver = {
      id: (drivers?.length || 0) + 1,
      ...newDriver,
      status: hasPermission('all') ? 'active' : 'pending',
      createdBy: currentUser.id,
      createdByName: currentUser.name,
      createdAt: new Date().toISOString()
    };

    if (hasPermission('all')) {
      driver.validatedBy = currentUser.id;
      driver.validatedByName = currentUser.name;
      driver.validatedAt = new Date().toISOString();
    }

    setDrivers([...(drivers || []), driver]);

    alert(
      hasPermission('all')
        ? `✅ Chauffeur ajouté et validé!\n${newDriver.name}`
        : `✅ Chauffeur ajouté!\nEn attente de validation Admin\n${newDriver.name}`
    );

    setShowAddDriver(false);
    setNewDriver({
      name: '',
      phone: '',
      email: '',
      address: '',
      licenseNumber: '',
      licenseExpiry: '',
      cin: '',
      restDay: 'Lundi',
      photo: '👨🏿'
    });
  };

  const handleUpdateRestDay = (e) => {
    e.preventDefault();
    
    const updatedDrivers = (drivers || []).map(d => {
      if (d.id === editingDriver.id) {
        return { 
          ...d, 
          restDay: editingDriver.restDay,
          modifiedBy: currentUser.id,
          modifiedByName: currentUser.name,
          modifiedAt: new Date().toISOString()
        };
      }
      return d;
    });

    setDrivers(updatedDrivers);
    alert(`✅ Jour de repos mis à jour!\n${editingDriver.name} : ${editingDriver.restDay}`);
    setEditingDriver(null);
  };

  const handleDeleteDriver = (driverId) => {
    const driver = (drivers || []).find(d => d.id === driverId);
    if (!driver) return;

    if (window.confirm(`Supprimer le chauffeur ${driver.name} ?`)) {
      const updatedDrivers = (drivers || []).filter(d => d.id !== driverId);
      setDrivers(updatedDrivers);
      alert('✅ Chauffeur supprimé');
    }
  };

  const handleValidateDriver = (driverId) => {
    const updatedDrivers = (drivers || []).map(d => {
      if (d.id === driverId) {
        return {
          ...d,
          status: 'active',
          validatedBy: currentUser.id,
          validatedByName: currentUser.name,
          validatedAt: new Date().toISOString()
        };
      }
      return d;
    });

    setDrivers(updatedDrivers);
    alert('✅ Chauffeur validé');
  };

  const handleRejectDriver = (driverId) => {
    const reason = window.prompt('Motif du rejet:');
    if (!reason) return;

    const updatedDrivers = (drivers || []).map(d => {
      if (d.id === driverId) {
        return {
          ...d,
          status: 'rejected',
          rejectedBy: currentUser.id,
          rejectedByName: currentUser.name,
          rejectedAt: new Date().toISOString(),
          rejectionReason: reason
        };
      }
      return d;
    });

    setDrivers(updatedDrivers);
    alert('❌ Chauffeur rejeté');
  };

  const getDriverContract = (driverId) => {
    return contracts.find(c => c.driverId === driverId);
  };

  const getDriverVehicle = (vehicleId) => {
    return vehicles.find(v => v.id === vehicleId);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">👨‍✈️ Gestion des chauffeurs</h1>
          <p className="text-gray-600 mt-2">{validatedDrivers.length} chauffeur(s) actif(s)</p>
        </div>
        <button
          onClick={() => setShowAddDriver(true)}
          className="bg-green-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-green-700"
        >
          <Plus size={20} />
          Ajouter un chauffeur
        </button>
      </div>

      {/* Validations en attente - Admin uniquement */}
      {hasPermission('all') && pendingDrivers.length > 0 && (
        <div className="mb-8 bg-yellow-50 border-2 border-yellow-300 rounded-xl p-6">
          <h2 className="text-xl font-bold text-yellow-900 mb-4 flex items-center gap-2">
            <AlertCircle size={24} />
            ⚠️ Validations en attente ({pendingDrivers.length})
          </h2>
          <div className="space-y-3">
            {pendingDrivers.map(driver => (
              <div key={driver.id} className="bg-white p-4 rounded-lg border border-yellow-200">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-lg">{driver.name}</p>
                    <p className="text-sm text-gray-600">Téléphone: {driver.phone}</p>
                    <p className="text-sm text-gray-600">Permis: {driver.licenseNumber}</p>
                    <p className="text-sm text-gray-500">Créé par: {driver.createdByName}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleValidateDriver(driver.id)}
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center gap-1"
                    >
                      <CheckCircle size={16} />
                      Valider
                    </button>
                    <button
                      onClick={() => handleRejectDriver(driver.id)}
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
      {showAddDriver && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">Nouveau chauffeur</h2>
            <form onSubmit={handleAddDriver}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Nom complet</label>
                <input
                  type="text"
                  value={newDriver.name}
                  onChange={(e) => setNewDriver({...newDriver, name: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Téléphone</label>
                <input
                  type="tel"
                  value={newDriver.phone}
                  onChange={(e) => setNewDriver({...newDriver, phone: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="+221 XX XXX XXXX"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={newDriver.email}
                  onChange={(e) => setNewDriver({...newDriver, email: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Adresse</label>
                <input
                  type="text"
                  value={newDriver.address}
                  onChange={(e) => setNewDriver({...newDriver, address: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">N° Permis</label>
                <input
                  type="text"
                  value={newDriver.licenseNumber}
                  onChange={(e) => setNewDriver({...newDriver, licenseNumber: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Expiration permis</label>
                <input
                  type="date"
                  value={newDriver.licenseExpiry}
                  onChange={(e) => setNewDriver({...newDriver, licenseExpiry: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">N° CIN</label>
                <input
                  type="text"
                  value={newDriver.cin}
                  onChange={(e) => setNewDriver({...newDriver, cin: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Jour de repos</label>
                <select
                  value={newDriver.restDay}
                  onChange={(e) => setNewDriver({...newDriver, restDay: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                >
                  <option value="Lundi">Lundi</option>
                  <option value="Mardi">Mardi</option>
                  <option value="Mercredi">Mercredi</option>
                  <option value="Jeudi">Jeudi</option>
                  <option value="Vendredi">Vendredi</option>
                  <option value="Samedi">Samedi</option>
                  <option value="Dimanche">Dimanche</option>
                </select>
              </div>
              <div className="flex gap-2">
                <button type="submit" className="flex-1 bg-green-600 text-white py-2 rounded-lg">
                  Créer
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddDriver(false)}
                  className="flex-1 bg-gray-300 py-2 rounded-lg"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Modification jour de repos */}
      {editingDriver && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-6">Modifier le jour de repos</h2>
            <p className="text-gray-600 mb-4">{editingDriver.name}</p>
            
            <form onSubmit={handleUpdateRestDay}>
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Jour de repos</label>
                <select
                  value={editingDriver.restDay}
                  onChange={(e) => setEditingDriver({...editingDriver, restDay: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                >
                  <option value="Lundi">Lundi</option>
                  <option value="Mardi">Mardi</option>
                  <option value="Mercredi">Mercredi</option>
                  <option value="Jeudi">Jeudi</option>
                  <option value="Vendredi">Vendredi</option>
                  <option value="Samedi">Samedi</option>
                  <option value="Dimanche">Dimanche</option>
                </select>
              </div>
              <div className="flex gap-2">
                <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded-lg">
                  Enregistrer
                </button>
                <button
                  type="button"
                  onClick={() => setEditingDriver(null)}
                  className="flex-1 bg-gray-300 py-2 rounded-lg"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Liste des chauffeurs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {validatedDrivers.map(driver => {
          const contract = getDriverContract(driver.id);
          const vehicle = getDriverVehicle(driver.vehicleId);
          const licenseExpiry = new Date(driver.licenseExpiry);
          const daysUntilExpiry = Math.floor((licenseExpiry - new Date()) / (1000 * 60 * 60 * 24));
          const isLicenseExpiringSoon = daysUntilExpiry < 30 && daysUntilExpiry >= 0;
          const isLicenseExpired = daysUntilExpiry < 0;

          return (
            <div 
              key={driver.id} 
              className="bg-white rounded-xl shadow-lg border-l-4 border-blue-500 overflow-hidden"
            >
              <div className="bg-blue-50 p-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="text-5xl">{driver.photo}</div>
                    <div>
                      <h3 className="font-bold text-xl">{driver.name}</h3>
                      <span className="px-2 py-1 rounded-full text-xs font-bold bg-green-200 text-green-800">
                        ✅ Actif
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingDriver(driver)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Edit size={20} />
                    </button>
                    <button
                      onClick={() => handleDeleteDriver(driver.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-4 space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Phone size={16} className="text-gray-500" />
                    <span>{driver.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail size={16} className="text-gray-500" />
                    <span className="truncate">{driver.email}</span>
                  </div>
                </div>

                <div className={`p-3 rounded border ${
                  isLicenseExpired 
                    ? 'bg-red-50 border-red-300' 
                    : isLicenseExpiringSoon 
                    ? 'bg-yellow-50 border-yellow-300' 
                    : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs text-gray-600">Permis N°</p>
                      <p className="font-bold">{driver.licenseNumber}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-600">Expiration</p>
                      <p className={`font-bold text-sm ${
                        isLicenseExpired ? 'text-red-600' : isLicenseExpiringSoon ? 'text-yellow-700' : 'text-gray-900'
                      }`}>
                        {new Date(driver.licenseExpiry).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                  {(isLicenseExpired || isLicenseExpiringSoon) && (
                    <div className="mt-2 flex items-center gap-2 text-xs">
                      <AlertCircle size={14} className={isLicenseExpired ? 'text-red-600' : 'text-yellow-600'} />
                      <span className={isLicenseExpired ? 'text-red-600' : 'text-yellow-700'}>
                        {isLicenseExpired 
                          ? `Expiré depuis ${Math.abs(daysUntilExpiry)} jour(s)` 
                          : `Expire dans ${daysUntilExpiry} jour(s)`}
                      </span>
                    </div>
                  )}
                </div>

                {vehicle && (
                  <div className="p-3 bg-green-50 rounded border border-green-200">
                    <p className="text-xs text-green-700">Véhicule attribué</p>
                    <p className="font-bold text-green-900">{vehicle.id}</p>
                    <p className="text-sm text-green-800">{vehicle.brand}</p>
                  </div>
                )}

                {contract && (
                  <div className="p-3 bg-purple-50 rounded border border-purple-200">
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-xs text-purple-700">Contrat</p>
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        contract.type === 'LAO' ? 'bg-blue-200 text-blue-800' : 'bg-green-200 text-green-800'
                      }`}>
                        {contract.type}
                      </span>
                    </div>
                    <p className="font-bold text-purple-900">
                      {contract.dailyAmount.toLocaleString()} FCFA/jour
                    </p>
                  </div>
                )}

                <div className="p-3 bg-blue-50 rounded border border-blue-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs text-blue-700">Jour de repos</p>
                      <p className="font-bold text-blue-900 flex items-center gap-2">
                        <Calendar size={16} />
                        {driver.restDay}
                      </p>
                    </div>
                    <button
                      onClick={() => setEditingDriver(driver)}
                      className="text-blue-600 hover:text-blue-800 text-sm underline"
                    >
                      Modifier
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Drivers;
