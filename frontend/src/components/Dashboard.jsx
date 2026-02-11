// Dashboard.jsx - Tableau de bord
import React from 'react';
import { Users, Car, DollarSign } from 'lucide-react';
import { drivers, vehicles } from '../data/mockData';

const Dashboard = ({ payments }) => {
  const societyVehicles = vehicles.filter(v => v.ownershipType === 'Société').length;
  const particularVehicles = vehicles.filter(v => v.ownershipType === 'Particulier').length;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">📊 Tableau de bord</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-700">Total Chauffeurs</h3>
            <Users className="text-blue-600" size={32} />
          </div>
          <p className="text-4xl font-bold text-blue-600">{drivers.length}</p>
          <p className="text-sm text-gray-500 mt-2">Actifs</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-700">Véhicules</h3>
            <Car className="text-green-600" size={32} />
          </div>
          <p className="text-4xl font-bold text-green-600">{vehicles.length}</p>
          <p className="text-sm text-gray-500 mt-2">
            {societyVehicles} Société / {particularVehicles} Particuliers
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-700">Versements</h3>
            <DollarSign className="text-purple-600" size={32} />
          </div>
          <p className="text-4xl font-bold text-purple-600">{payments.length}</p>
          <p className="text-sm text-gray-500 mt-2">Ce mois</p>
        </div>
      </div>

      <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4">Bienvenue sur AutoFleet</h2>
        <p className="text-gray-600">
          Système de gestion de flotte automobile pour le Sénégal.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div className="p-3 bg-blue-50 rounded">
            <p className="font-bold text-blue-900">✅ Gestion multi-utilisateurs</p>
          </div>
          <div className="p-3 bg-green-50 rounded">
            <p className="font-bold text-green-900">✅ Versements avec traçabilité</p>
          </div>
          <div className="p-3 bg-purple-50 rounded">
            <p className="font-bold text-purple-900">✅ Propriétaires particuliers</p>
          </div>
          <div className="p-3 bg-orange-50 rounded">
            <p className="font-bold text-orange-900">✅ Répartition automatique</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
