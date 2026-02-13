// Dashboard.jsx - Tableau de bord avec suivi des demandes
import React from 'react';
import { AlertCircle, CheckCircle, Clock, TrendingUp } from 'lucide-react';

const Dashboard = ({ 
  payments, 
  drivers, 
  vehicles, 
  managementContracts, 
  contracts,
  maintenanceSchedule,
  currentUser, 
  hasPermission,
  setActiveTab 
}) => {
  // Calculer les statistiques de versements
  const totalPayments = (payments || []).reduce((sum, p) => sum + p.amount, 0);
  const currentMonth = new Date().toLocaleString('fr-FR', { month: 'long', year: 'numeric' });

  // Filtrer les demandes en attente
  const pendingDrivers = (drivers || []).filter(d => d.status === 'pending');
  const pendingVehicles = (vehicles || []).filter(v => v.status === 'pending');
  const pendingOwners = (managementContracts || []).filter(o => o.status === 'pending');
  const pendingContracts = (contracts || []).filter(c => c.status === 'pending');
  const pendingMaintenance = (maintenanceSchedule || []).filter(m => m.status === 'pending-validation');

  // Filtrer les demandes du gestionnaire connecté
  const myPendingDrivers = pendingDrivers.filter(d => d.createdBy === currentUser.id);
  const myPendingVehicles = pendingVehicles.filter(v => v.createdBy === currentUser.id);
  const myPendingOwners = pendingOwners.filter(o => o.createdBy === currentUser.id);
  const myPendingContracts = pendingContracts.filter(c => c.createdBy === currentUser.id);
  const myPendingMaintenance = pendingMaintenance.filter(m => m.createdBy === currentUser.id);

  const totalPending = pendingDrivers.length + pendingVehicles.length + pendingOwners.length + pendingContracts.length + pendingMaintenance.length;
  const myTotalPending = myPendingDrivers.length + myPendingVehicles.length + myPendingOwners.length + myPendingContracts.length + myPendingMaintenance.length;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">📊 Tableau de bord</h1>

      {/* Statistiques globales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="text-blue-600" size={32} />
            <h3 className="font-bold text-blue-900">Versements</h3>
          </div>
          <p className="text-3xl font-bold text-blue-700">{totalPayments.toLocaleString()} FCFA</p>
          <p className="text-sm text-blue-600 mt-1">{currentMonth}</p>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="text-green-600" size={32} />
            <h3 className="font-bold text-green-900">Chauffeurs</h3>
          </div>
          <p className="text-3xl font-bold text-green-700">
            {(drivers || []).filter(d => d.status === 'active' || !d.status).length}
          </p>
          <p className="text-sm text-green-600 mt-1">Actifs</p>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="text-purple-600" size={32} />
            <h3 className="font-bold text-purple-900">Véhicules</h3>
          </div>
          <p className="text-3xl font-bold text-purple-700">
            {(vehicles || []).filter(v => v.status === 'validated' || !v.status).length}
          </p>
          <p className="text-sm text-purple-600 mt-1">Validés</p>
        </div>

        <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="text-orange-600" size={32} />
            <h3 className="font-bold text-orange-900">Propriétaires</h3>
          </div>
          <p className="text-3xl font-bold text-orange-700">
            {(managementContracts || []).filter(o => o.status === 'validated' || !o.status).length}
          </p>
          <p className="text-sm text-orange-600 mt-1">Contrats actifs</p>
        </div>
      </div>

      {/* Section Admin - Toutes les validations en attente */}
      {hasPermission('all') && totalPending > 0 && (
        <div className="mb-8 bg-yellow-50 border-2 border-yellow-300 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <AlertCircle className="text-yellow-700" size={32} />
            <div>
              <h2 className="text-2xl font-bold text-yellow-900">
                ⚠️ Validations en attente ({totalPending})
              </h2>
              <p className="text-sm text-yellow-700">Demandes nécessitant votre approbation</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Chauffeurs en attente */}
            {pendingDrivers.length > 0 && (
              <button
                onClick={() => setActiveTab('drivers')}
                className="bg-white p-4 rounded-lg border-2 border-yellow-200 hover:border-yellow-400 text-left"
              >
                <div className="flex justify-between items-start mb-2">
                  <p className="font-bold text-lg">👨‍✈️ Chauffeurs</p>
                  <span className="bg-yellow-200 text-yellow-900 px-3 py-1 rounded-full text-sm font-bold">
                    {pendingDrivers.length}
                  </span>
                </div>
                <p className="text-sm text-gray-600">Cliquez pour valider →</p>
              </button>
            )}

            {/* Véhicules en attente */}
            {pendingVehicles.length > 0 && (
              <button
                onClick={() => setActiveTab('vehicles')}
                className="bg-white p-4 rounded-lg border-2 border-yellow-200 hover:border-yellow-400 text-left"
              >
                <div className="flex justify-between items-start mb-2">
                  <p className="font-bold text-lg">🚗 Véhicules</p>
                  <span className="bg-yellow-200 text-yellow-900 px-3 py-1 rounded-full text-sm font-bold">
                    {pendingVehicles.length}
                  </span>
                </div>
                <p className="text-sm text-gray-600">Cliquez pour valider →</p>
              </button>
            )}

            {/* Propriétaires en attente */}
            {pendingOwners.length > 0 && (
              <button
                onClick={() => setActiveTab('owners')}
                className="bg-white p-4 rounded-lg border-2 border-yellow-200 hover:border-yellow-400 text-left"
              >
                <div className="flex justify-between items-start mb-2">
                  <p className="font-bold text-lg">🏢 Propriétaires</p>
                  <span className="bg-yellow-200 text-yellow-900 px-3 py-1 rounded-full text-sm font-bold">
                    {pendingOwners.length}
                  </span>
                </div>
                <p className="text-sm text-gray-600">Cliquez pour valider →</p>
              </button>
            )}

            {/* Contrats en attente */}
            {pendingContracts.length > 0 && (
              <button
                onClick={() => setActiveTab('drivers')}
                className="bg-white p-4 rounded-lg border-2 border-yellow-200 hover:border-yellow-400 text-left"
              >
                <div className="flex justify-between items-start mb-2">
                  <p className="font-bold text-lg">📋 Contrats</p>
                  <span className="bg-yellow-200 text-yellow-900 px-3 py-1 rounded-full text-sm font-bold">
                    {pendingContracts.length}
                  </span>
                </div>
                <p className="text-sm text-gray-600">Cliquez pour valider →</p>
              </button>
            )}

            {/* Maintenance en attente */}
            {pendingMaintenance.length > 0 && (
              <button
                onClick={() => setActiveTab('vehicles')}
                className="bg-white p-4 rounded-lg border-2 border-yellow-200 hover:border-yellow-400 text-left"
              >
                <div className="flex justify-between items-start mb-2">
                  <p className="font-bold text-lg">🔧 Maintenance</p>
                  <span className="bg-yellow-200 text-yellow-900 px-3 py-1 rounded-full text-sm font-bold">
                    {pendingMaintenance.length}
                  </span>
                </div>
                <p className="text-sm text-gray-600">Cliquez pour valider →</p>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Section Gestionnaire - Mes demandes en attente */}
      {!hasPermission('all') && myTotalPending > 0 && (
        <div className="mb-8 bg-blue-50 border-2 border-blue-300 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <Clock className="text-blue-700" size={32} />
            <div>
              <h2 className="text-2xl font-bold text-blue-900">
                ⏳ Mes demandes en attente ({myTotalPending})
              </h2>
              <p className="text-sm text-blue-700">En cours de validation par l'administrateur</p>
            </div>
          </div>

          <div className="space-y-3">
            {/* Mes chauffeurs en attente */}
            {myPendingDrivers.map(driver => (
              <div key={driver.id} className="bg-white p-4 rounded-lg border border-blue-200">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold">👨‍✈️ Chauffeur: {driver.name}</p>
                    <p className="text-sm text-gray-600">
                      Créé le {new Date(driver.createdAt).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-200 text-blue-800">
                    ⏳ En attente
                  </span>
                </div>
              </div>
            ))}

            {/* Mes véhicules en attente */}
            {myPendingVehicles.map(vehicle => (
              <div key={vehicle.id} className="bg-white p-4 rounded-lg border border-blue-200">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold">🚗 Véhicule: {vehicle.id}</p>
                    <p className="text-sm text-gray-600">{vehicle.brand}</p>
                    <p className="text-sm text-gray-600">
                      Créé le {new Date(vehicle.createdAt).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-200 text-blue-800">
                    ⏳ En attente
                  </span>
                </div>
              </div>
            ))}

            {/* Mes propriétaires en attente */}
            {myPendingOwners.map(owner => (
              <div key={owner.id} className="bg-white p-4 rounded-lg border border-blue-200">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold">🏢 Propriétaire: {owner.ownerName}</p>
                    <p className="text-sm text-gray-600">Véhicule: {owner.vehicleId}</p>
                    <p className="text-sm text-gray-600">
                      Créé le {new Date(owner.createdAt).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-200 text-blue-800">
                    ⏳ En attente
                  </span>
                </div>
              </div>
            ))}

            {/* Mes contrats en attente */}
            {myPendingContracts.map(contract => (
              <div key={contract.id} className="bg-white p-4 rounded-lg border border-blue-200">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold">📋 Contrat: {contract.driverName}</p>
                    <p className="text-sm text-gray-600">Type: {contract.type}</p>
                    <p className="text-sm text-gray-600">
                      Créé le {new Date(contract.createdAt).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-200 text-blue-800">
                    ⏳ En attente
                  </span>
                </div>
              </div>
            ))}

            {/* Mes maintenances en attente */}
            {myPendingMaintenance.map(maintenance => (
              <div key={maintenance.id} className="bg-white p-4 rounded-lg border border-blue-200">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold">🔧 Maintenance: {maintenance.vehicleId}</p>
                    <p className="text-sm text-gray-600">Type: {maintenance.type}</p>
                    <p className="text-sm text-gray-600">
                      Créé le {new Date(maintenance.createdAt).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-200 text-blue-800">
                    ⏳ En attente
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Message si aucune demande */}
      {!hasPermission('all') && myTotalPending === 0 && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
          <CheckCircle className="text-green-600 mx-auto mb-4" size={48} />
          <h3 className="text-xl font-bold text-green-900 mb-2">
            ✅ Aucune demande en attente
          </h3>
          <p className="text-green-700">Toutes vos demandes ont été traitées !</p>
        </div>
      )}

      {hasPermission('all') && totalPending === 0 && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
          <CheckCircle className="text-green-600 mx-auto mb-4" size={48} />
          <h3 className="text-xl font-bold text-green-900 mb-2">
            ✅ Aucune validation en attente
          </h3>
          <p className="text-green-700">Tout est à jour !</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
