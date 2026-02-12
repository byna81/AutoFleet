// Maintenance.jsx - Planning de maintenance
import React, { useState } from 'react';
import { Plus, Wrench, AlertTriangle, CheckCircle, Calendar } from 'lucide-react';

const Maintenance = ({ maintenanceSchedule, setMaintenanceSchedule, vehicles, currentUser }) => {
  const [showAddMaintenance, setShowAddMaintenance] = useState(false);
  const [newMaintenance, setNewMaintenance] = useState({
    vehicleId: '',
    type: 'Vidange',
    currentMileage: '',
    nextMileage: '',
    dueDate: '',
    estimatedCost: '',
    notes: ''
  });

  const handleAddMaintenance = (e) => {
    e.preventDefault();

    const vehicle = vehicles.find(v => v.id === newMaintenance.vehicleId);
    
    const maintenance = {
      id: maintenanceSchedule.length + 1,
      ...newMaintenance,
      vehicleName: vehicle.brand,
      currentMileage: parseInt(newMaintenance.currentMileage),
      nextMileage: parseInt(newMaintenance.nextMileage),
      estimatedCost: parseFloat(newMaintenance.estimatedCost),
      status: 'pending',
      createdBy: currentUser.name,
      createdAt: new Date().toISOString()
    };

    setMaintenanceSchedule([...maintenanceSchedule, maintenance]);
    alert(`✅ Maintenance planifiée!\n\n${vehicle.id} - ${newMaintenance.type}\nDate prévue: ${new Date(newMaintenance.dueDate).toLocaleDateString('fr-FR')}`);
    
    setShowAddMaintenance(false);
    setNewMaintenance({
      vehicleId: '',
      type: 'Vidange',
      currentMileage: '',
      nextMileage: '',
      dueDate: '',
      estimatedCost: '',
      notes: ''
    });
  };

  const handleMarkAsCompleted = (maintenanceId) => {
    const updated = maintenanceSchedule.map(m => {
      if (m.id === maintenanceId) {
        return {
          ...m,
          status: 'completed',
          completedBy: currentUser.name,
          completedAt: new Date().toISOString()
        };
      }
      return m;
    });

    setMaintenanceSchedule(updated);
    alert('✅ Maintenance marquée comme effectuée');
  };

  const getDaysUntilDue = (dueDate) => {
    const due = new Date(dueDate);
    const today = new Date();
    return Math.ceil((due - today) / (1000 * 60 * 60 * 24));
  };

  const pendingMaintenance = maintenanceSchedule.filter(m => m.status === 'pending');
  const urgentMaintenance = pendingMaintenance.filter(m => getDaysUntilDue(m.dueDate) <= 7);
  const completedMaintenance = maintenanceSchedule.filter(m => m.status === 'completed');

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">🔧 Maintenance des véhicules</h1>
          <p className="text-gray-600 mt-2">
            {pendingMaintenance.length} maintenance(s) en attente
          </p>
        </div>
        <button
          onClick={() => setShowAddMaintenance(true)}
          className="bg-green-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-green-700"
        >
          <Plus size={20} />
          Planifier une maintenance
        </button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="text-yellow-600" size={32} />
            <h3 className="font-bold text-yellow-900">En attente</h3>
          </div>
          <p className="text-3xl font-bold text-yellow-700">{pendingMaintenance.length}</p>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="text-red-600" size={32} />
            <h3 className="font-bold text-red-900">Urgent (≤7 jours)</h3>
          </div>
          <p className="text-3xl font-bold text-red-700">{urgentMaintenance.length}</p>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="text-green-600" size={32} />
            <h3 className="font-bold text-green-900">Effectuées</h3>
          </div>
          <p className="text-3xl font-bold text-green-700">{completedMaintenance.length}</p>
        </div>
      </div>

      {/* Modal Ajout */}
      {showAddMaintenance && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">Planifier une maintenance</h2>
            
            <form onSubmit={handleAddMaintenance}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Véhicule</label>
                <select
                  value={newMaintenance.vehicleId}
                  onChange={(e) => {
                    const vehicleId = e.target.value;
                    const vehicle = vehicles.find(v => v.id === vehicleId);
                    setNewMaintenance({
                      ...newMaintenance, 
                      vehicleId,
                      currentMileage: vehicle?.mileage || ''
                    });
                  }}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                >
                  <option value="">Sélectionner</option>
                  {vehicles.map(v => (
                    <option key={v.id} value={v.id}>
                      {v.id} - {v.brand}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Type de maintenance</label>
                <select
                  value={newMaintenance.type}
                  onChange={(e) => setNewMaintenance({...newMaintenance, type: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                >
                  <option value="Vidange">Vidange</option>
                  <option value="Révision">Révision</option>
                  <option value="Freins">Freins</option>
                  <option value="Pneus">Pneus</option>
                  <option value="Climatisation">Climatisation</option>
                  <option value="Batterie">Batterie</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Kilométrage actuel</label>
                  <input
                    type="number"
                    value={newMaintenance.currentMileage}
                    onChange={(e) => setNewMaintenance({...newMaintenance, currentMileage: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Prochain entretien (km)</label>
                  <input
                    type="number"
                    value={newMaintenance.nextMileage}
                    onChange={(e) => setNewMaintenance({...newMaintenance, nextMileage: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Date prévue</label>
                <input
                  type="date"
                  value={newMaintenance.dueDate}
                  onChange={(e) => setNewMaintenance({...newMaintenance, dueDate: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Coût estimé (FCFA)</label>
                <input
                  type="number"
                  value={newMaintenance.estimatedCost}
                  onChange={(e) => setNewMaintenance({...newMaintenance, estimatedCost: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Notes</label>
                <textarea
                  value={newMaintenance.notes}
                  onChange={(e) => setNewMaintenance({...newMaintenance, notes: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg"
                  rows="3"
                  placeholder="Détails sur la maintenance..."
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
                >
                  Planifier
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddMaintenance(false)}
                  className="flex-1 bg-gray-300 py-2 rounded-lg"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Liste des maintenances urgentes */}
      {urgentMaintenance.length > 0 && (
        <div className="mb-8 bg-red-50 border-2 border-red-300 rounded-xl p-6">
          <h2 className="text-xl font-bold text-red-900 mb-4 flex items-center gap-2">
            <AlertTriangle size={24} />
            ⚠️ Maintenances urgentes ({urgentMaintenance.length})
          </h2>
          <div className="space-y-3">
            {urgentMaintenance.map(maintenance => {
              const daysUntil = getDaysUntilDue(maintenance.dueDate);
              return (
                <div key={maintenance.id} className="bg-white p-4 rounded-lg border border-red-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-lg">{maintenance.vehicleId}</p>
                      <p className="text-sm text-gray-600">{maintenance.type}</p>
                      <p className="text-sm text-red-600 font-bold mt-1">
                        {daysUntil <= 0 
                          ? `⚠️ En retard de ${Math.abs(daysUntil)} jour(s)` 
                          : `⏰ Dans ${daysUntil} jour(s)`}
                      </p>
                    </div>
                    <button
                      onClick={() => handleMarkAsCompleted(maintenance.id)}
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                      Marquer effectuée
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Liste des maintenances en attente */}
      <div className="grid grid-cols-1 gap-6 mb-8">
        <h2 className="text-xl font-bold">📋 Maintenances planifiées</h2>
        {pendingMaintenance.map(maintenance => {
          const daysUntil = getDaysUntilDue(maintenance.dueDate);
          const isUrgent = daysUntil <= 7;
          const isOverdue = daysUntil < 0;

          return (
            <div 
              key={maintenance.id}
              className={`bg-white rounded-xl shadow-lg border-l-4 ${
                isOverdue ? 'border-red-500' : isUrgent ? 'border-yellow-500' : 'border-blue-500'
              }`}
            >
              <div className={`p-4 ${
                isOverdue ? 'bg-red-50' : isUrgent ? 'bg-yellow-50' : 'bg-blue-50'
              }`}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-xl">{maintenance.vehicleId}</h3>
                    <p className="text-sm text-gray-600">{maintenance.vehicleName}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    maintenance.type === 'Vidange' ? 'bg-blue-200 text-blue-800' :
                    maintenance.type === 'Révision' ? 'bg-purple-200 text-purple-800' :
                    'bg-gray-200 text-gray-800'
                  }`}>
                    {maintenance.type}
                  </span>
                </div>
              </div>

              <div className="p-4">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="p-3 bg-gray-50 rounded">
                    <p className="text-xs text-gray-600">Kilométrage actuel</p>
                    <p className="font-bold">{maintenance.currentMileage.toLocaleString()} km</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded">
                    <p className="text-xs text-gray-600">Prochain entretien</p>
                    <p className="font-bold">{maintenance.nextMileage.toLocaleString()} km</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="p-3 bg-blue-50 rounded">
                    <p className="text-xs text-blue-700">Date prévue</p>
                    <p className="font-bold">{new Date(maintenance.dueDate).toLocaleDateString('fr-FR')}</p>
                    <p className={`text-xs mt-1 ${
                      isOverdue ? 'text-red-600' : isUrgent ? 'text-yellow-700' : 'text-green-700'
                    }`}>
                      {isOverdue 
                        ? `En retard de ${Math.abs(daysUntil)} jour(s)` 
                        : isUrgent 
                        ? `Dans ${daysUntil} jour(s)`
                        : `Dans ${daysUntil} jour(s)`}
                    </p>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded">
                    <p className="text-xs text-yellow-700">Coût estimé</p>
                    <p className="font-bold text-lg">{maintenance.estimatedCost.toLocaleString()} FCFA</p>
                  </div>
                </div>

                {maintenance.notes && (
                  <div className="p-3 bg-gray-50 rounded mb-4">
                    <p className="text-xs text-gray-600 mb-1">Notes</p>
                    <p className="text-sm">{maintenance.notes}</p>
                  </div>
                )}

                <button
                  onClick={() => handleMarkAsCompleted(maintenance.id)}
                  className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
                >
                  <CheckCircle size={20} />
                  Marquer comme effectuée
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Maintenances effectuées */}
      {completedMaintenance.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4">✅ Maintenances effectuées</h2>
          <div className="space-y-3">
            {completedMaintenance.map(maintenance => (
              <div key={maintenance.id} className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-bold">{maintenance.vehicleId} - {maintenance.type}</p>
                    <p className="text-sm text-gray-600">
                      Effectuée le {new Date(maintenance.completedAt).toLocaleDateString('fr-FR')} par {maintenance.completedBy}
                    </p>
                  </div>
                  <CheckCircle className="text-green-600" size={24} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Maintenance;
