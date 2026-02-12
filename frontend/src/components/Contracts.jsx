// Contracts.jsx - Gestion des contrats LAO/Location
import React, { useState } from 'react';
import { FileText, Calendar, DollarSign, AlertCircle } from 'lucide-react';

const Contracts = ({ contracts, drivers, vehicles }) => {
  const [selectedContract, setSelectedContract] = useState(null);

  const getDriver = (driverId) => drivers.find(d => d.id === driverId);
  const getVehicle = (vehicleId) => vehicles.find(v => v.id === vehicleId);

  const calculateDaysRemaining = (endDate) => {
    const end = new Date(endDate);
    const today = new Date();
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const calculateProgress = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    const total = end - start;
    const elapsed = today - start;
    return Math.min(Math.max((elapsed / total) * 100, 0), 100);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">📋 Gestion des contrats</h1>
        <p className="text-gray-600 mt-2">{contracts.length} contrat(s) actif(s)</p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="text-blue-600" size={32} />
            <h3 className="font-bold text-blue-900">Contrats LAO</h3>
          </div>
          <p className="text-3xl font-bold text-blue-700">
            {contracts.filter(c => c.type === 'LAO').length}
          </p>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="text-green-600" size={32} />
            <h3 className="font-bold text-green-900">Contrats Location</h3>
          </div>
          <p className="text-3xl font-bold text-green-700">
            {contracts.filter(c => c.type === 'Location').length}
          </p>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="text-purple-600" size={32} />
            <h3 className="font-bold text-purple-900">Revenus journaliers</h3>
          </div>
          <p className="text-3xl font-bold text-purple-700">
            {contracts.reduce((sum, c) => sum + c.dailyAmount, 0).toLocaleString()} FCFA
          </p>
        </div>
      </div>

      {/* Modal Détails */}
      {selectedContract && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">📋 Détails du contrat</h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded">
                  <p className="text-sm text-blue-700">Chauffeur</p>
                  <p className="font-bold text-lg">{selectedContract.driverName}</p>
                </div>
                <div className="p-4 bg-green-50 rounded">
                  <p className="text-sm text-green-700">Véhicule</p>
                  <p className="font-bold text-lg">{selectedContract.vehicleId}</p>
                </div>
              </div>

              <div className="p-4 bg-purple-50 rounded border border-purple-200">
                <p className="text-sm text-purple-700 mb-1">Type de contrat</p>
                <span className={`px-3 py-1 rounded-full font-bold ${
                  selectedContract.type === 'LAO' 
                    ? 'bg-blue-200 text-blue-800' 
                    : 'bg-green-200 text-green-800'
                }`}>
                  {selectedContract.type}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded">
                  <p className="text-sm text-gray-600">Début</p>
                  <p className="font-bold">{new Date(selectedContract.startDate).toLocaleDateString('fr-FR')}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded">
                  <p className="text-sm text-gray-600">Fin</p>
                  <p className="font-bold">{new Date(selectedContract.endDate).toLocaleDateString('fr-FR')}</p>
                </div>
              </div>

              <div className="p-4 bg-yellow-50 rounded border border-yellow-200">
                <p className="text-sm text-yellow-700">Montant journalier</p>
                <p className="text-2xl font-bold text-yellow-900">
                  {selectedContract.dailyAmount.toLocaleString()} FCFA
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded">
                  <p className="text-sm text-gray-600">Caution versée</p>
                  <p className="font-bold">{selectedContract.deposit.toLocaleString()} FCFA</p>
                </div>
                <div className="p-4 bg-gray-50 rounded">
                  <p className="text-sm text-gray-600">Montant total</p>
                  <p className="font-bold">{selectedContract.totalAmount.toLocaleString()} FCFA</p>
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded border border-blue-200">
                <p className="text-sm text-blue-700">Jour de repos</p>
                <p className="font-bold text-blue-900">{selectedContract.restDay}</p>
              </div>
            </div>

            <button
              onClick={() => setSelectedContract(null)}
              className="mt-6 w-full bg-gray-300 py-2 rounded-lg hover:bg-gray-400"
            >
              Fermer
            </button>
          </div>
        </div>
      )}

      {/* Liste des contrats */}
      <div className="grid grid-cols-1 gap-6">
        {contracts.map(contract => {
          const driver = getDriver(contract.driverId);
          const vehicle = getVehicle(contract.vehicleId);
          const daysRemaining = calculateDaysRemaining(contract.endDate);
          const progress = calculateProgress(contract.startDate, contract.endDate);
          const isExpiringSoon = daysRemaining <= 30 && daysRemaining > 0;
          const isExpired = daysRemaining <= 0;

          return (
            <div 
              key={contract.id}
              className={`bg-white rounded-xl shadow-lg border-l-4 ${
                contract.type === 'LAO' ? 'border-blue-500' : 'border-green-500'
              }`}
            >
              <div className={`p-4 ${
                contract.type === 'LAO' ? 'bg-blue-50' : 'bg-green-50'
              }`}>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-xl">{contract.driverName}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        contract.type === 'LAO' 
                          ? 'bg-blue-200 text-blue-800' 
                          : 'bg-green-200 text-green-800'
                      }`}>
                        {contract.type}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      🚗 {contract.vehicleId} • {vehicle?.brand}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedContract(contract)}
                    className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                  >
                    Détails →
                  </button>
                </div>
              </div>

              <div className="p-4">
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-600">Montant/jour</p>
                    <p className="font-bold text-lg">
                      {contract.dailyAmount.toLocaleString()} FCFA
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Caution</p>
                    <p className="font-bold text-lg">
                      {contract.deposit.toLocaleString()} FCFA
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Jour de repos</p>
                    <p className="font-bold text-lg flex items-center gap-1">
                      <Calendar size={16} />
                      {contract.restDay}
                    </p>
                  </div>
                </div>

                {/* Période */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>{new Date(contract.startDate).toLocaleDateString('fr-FR')}</span>
                    <span>{new Date(contract.endDate).toLocaleDateString('fr-FR')}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        isExpired ? 'bg-red-500' : isExpiringSoon ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className={`text-xs mt-1 ${
                    isExpired ? 'text-red-600' : isExpiringSoon ? 'text-yellow-700' : 'text-green-700'
                  }`}>
                    {isExpired 
                      ? `⚠️ Expiré depuis ${Math.abs(daysRemaining)} jour(s)` 
                      : isExpiringSoon 
                      ? `⏰ Expire dans ${daysRemaining} jour(s)`
                      : `✅ ${daysRemaining} jour(s) restant(s)`}
                  </p>
                </div>

                {/* Total */}
                <div className="p-3 bg-gray-50 rounded">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Montant total du contrat</span>
                    <span className="font-bold text-lg">
                      {contract.totalAmount.toLocaleString()} FCFA
                    </span>
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

export default Contracts;
