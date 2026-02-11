// Owners.jsx - Gestion des propriétaires
import React from 'react';
import { managementContracts } from '../data/mockData';

const Owners = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">🏢 Propriétaires particuliers</h1>
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">👥</div>
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Gestion des propriétaires</h2>
          <p className="text-gray-600">
            Liste des particuliers ayant confié leurs véhicules à AutoFleet
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {managementContracts.map(mc => (
            <div key={mc.id} className="border-2 border-green-200 rounded-lg p-6 bg-green-50">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-xl text-green-800">{mc.ownerName}</h3>
                  <p className="text-sm text-gray-600 mt-1">Véhicule: {mc.vehicleId}</p>
                </div>
                <span className="px-3 py-1 bg-green-200 text-green-800 text-xs font-bold rounded-full">
                  {mc.status === 'active' ? 'Actif' : 'Inactif'}
                </span>
              </div>

              <div className="space-y-2">
                <div className="p-3 bg-white rounded border border-green-200">
                  <p className="text-xs text-gray-600 mb-1">Chauffeur verse par jour:</p>
                  <p className="font-bold text-lg">{mc.driverDailyPayment.toLocaleString()} FCFA</p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 bg-green-100 rounded border border-green-300">
                    <p className="text-xs text-green-700 mb-1">👤 Propriétaire reçoit:</p>
                    <p className="font-bold text-green-800">{mc.ownerDailyShare.toLocaleString()} FCFA</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded border border-blue-300">
                    <p className="text-xs text-blue-700 mb-1">🏢 AutoFleet garde:</p>
                    <p className="font-bold text-blue-800">{mc.companyDailyShare.toLocaleString()} FCFA</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-green-200 text-xs text-gray-600">
                  <p>• Paiement: {mc.paymentFrequency}</p>
                  <p>• Maintenance: {mc.maintenanceResponsibility}</p>
                  <p>• Début contrat: {mc.startDate}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {managementContracts.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p>Aucun propriétaire particulier enregistré</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Owners;
