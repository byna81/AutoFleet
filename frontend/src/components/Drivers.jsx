// Drivers.jsx - Gestion des chauffeurs
import React, { useState } from 'react';
import { Edit, Phone, Mail, Calendar, AlertCircle } from 'lucide-react';

const Drivers = ({ drivers, setDrivers, contracts, vehicles }) => {
  const [editingDriver, setEditingDriver] = useState(null);

  const handleUpdateRestDay = (e) => {
    e.preventDefault();
    
    const updatedDrivers = drivers.map(d => {
      if (d.id === editingDriver.id) {
        return { ...d, restDay: editingDriver.restDay };
      }
      return d;
    });

    setDrivers(updatedDrivers);
    alert(`✅ Jour de repos mis à jour!\n\n${editingDriver.name} : ${editingDriver.restDay}`);
    setEditingDriver(null);
  };

  const getDriverContract = (driverId) => {
    return contracts.find(c => c.driverId === driverId);
  };

  const getDriverVehicle = (vehicleId) => {
    return vehicles.find(v => v.id === vehicleId);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">👨‍✈️ Gestion des chauffeurs</h1>
        <p className="text-gray-600 mt-2">{drivers.length} chauffeur(s) actif(s)</p>
      </div>

      {/* Modal Modification jour de repos */}
      {editingDriver && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-6">Modifier le jour de repos</h2>
            <p className="text-gray-600 mb-4">{editingDriver.name}</p>
            
            <form onSubmit={handleUpdateRestDay}>
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                  Jour de repos
                </label>
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
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                >
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
        {drivers.map(driver => {
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
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        driver.status === 'active' 
                          ? 'bg-green-200 text-green-800' 
                          : 'bg-gray-200 text-gray-800'
                      }`}>
                        {driver.status === 'active' ? '✅ Actif' : '⏸️ Inactif'}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setEditingDriver(driver)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Edit size={20} />
                  </button>
                </div>
              </div>

              <div className="p-4 space-y-3">
                {/* Contact */}
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

                {/* Permis */}
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
                        isLicenseExpired 
                          ? 'text-red-600' 
                          : isLicenseExpiringSoon 
                          ? 'text-yellow-700' 
                          : 'text-gray-900'
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

                {/* Véhicule */}
                {vehicle && (
                  <div className="p-3 bg-green-50 rounded border border-green-200">
                    <p className="text-xs text-green-700">Véhicule attribué</p>
                    <p className="font-bold text-green-900">{vehicle.id}</p>
                    <p className="text-sm text-green-800">{vehicle.brand}</p>
                  </div>
                )}

                {/* Contrat */}
                {contract && (
                  <div className="p-3 bg-purple-50 rounded border border-purple-200">
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-xs text-purple-700">Contrat</p>
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        contract.type === 'LAO' 
                          ? 'bg-blue-200 text-blue-800' 
                          : 'bg-green-200 text-green-800'
                      }`}>
                        {contract.type}
                      </span>
                    </div>
                    <p className="font-bold text-purple-900">
                      {contract.dailyAmount.toLocaleString()} FCFA/jour
                    </p>
                  </div>
                )}

                {/* Jour de repos */}
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
