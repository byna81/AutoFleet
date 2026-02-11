// Vehicles.jsx - Parc automobile avec répartition financière
import React from 'react';
import { vehicles, managementContracts, contracts } from '../data/mockData';

const Vehicles = ({ payments }) => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">🚗 Parc automobile</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {vehicles.map(vehicle => {
          const mgmtContract = managementContracts.find(mc => mc.vehicleId === vehicle.id);
          const vehiclePayments = payments.filter(p => {
            const contract = contracts.find(c => c.id === p.contractId);
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
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    vehicle.ownershipType === 'Société' 
                      ? 'bg-blue-200 text-blue-800' 
                      : 'bg-green-200 text-green-800'
                  }`}>
                    {vehicle.ownershipType === 'Société' ? '🏢 Société' : '👤 Particulier'}
                  </span>
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
                  {vehicle.ownershipType === 'Société' ? (
                    <div className="text-center text-xs text-gray-600 mt-2">
                      Marge: 100%
                    </div>
                  ) : (
                    <div className="text-center text-xs text-gray-600 mt-2">
                      Marge société: {margin}%
                    </div>
                  )}
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

      {/* Résumé global */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="font-bold text-blue-900 mb-2">🏢 Total Société (Février)</h3>
          <p className="text-3xl font-bold text-blue-700">
            {payments
              .filter(p => p.date.startsWith('2025-02'))
              .reduce((sum, p) => {
                const contract = contracts.find(c => c.id === p.contractId);
                const vehicle = vehicles.find(v => v.id === contract?.vehicleId);
                if (vehicle?.ownershipType === 'Société') {
                  return sum + p.amount;
                } else {
                  const mgmt = managementContracts.find(mc => mc.vehicleId === vehicle?.id);
                  return sum + (mgmt?.companyDailyShare || 0);
                }
              }, 0)
              .toLocaleString()} FCFA
          </p>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
          <h3 className="font-bold text-green-900 mb-2">👤 Total Propriétaires (Février)</h3>
          <p className="text-3xl font-bold text-green-700">
            {payments
              .filter(p => p.date.startsWith('2025-02'))
              .reduce((sum, p) => {
                const contract = contracts.find(c => c.id === p.contractId);
                const vehicle = vehicles.find(v => v.id === contract?.vehicleId);
                const mgmt = managementContracts.find(mc => mc.vehicleId === vehicle?.id);
                return sum + (mgmt?.ownerDailyShare || 0);
              }, 0)
              .toLocaleString()} FCFA
          </p>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
          <h3 className="font-bold text-purple-900 mb-2">💰 Total Collecté (Février)</h3>
          <p className="text-3xl font-bold text-purple-700">
            {payments
              .filter(p => p.date.startsWith('2025-02'))
              .reduce((sum, p) => sum + p.amount, 0)
              .toLocaleString()} FCFA
          </p>
        </div>
      </div>
    </div>
  );
};

export default Vehicles;
