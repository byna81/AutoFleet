// Sidebar.jsx - Menu avec 7 onglets (regroupement Maintenance + Paiements)
import React from 'react';
import { LogOut } from 'lucide-react';

const Sidebar = ({ currentUser, activeTab, setActiveTab, handleLogout, hasPermission }) => {
  return (
    <div className="w-64 bg-gradient-to-b from-red-600 to-red-700 text-white flex flex-col h-screen">
      <div className="p-4 border-b border-red-500">
        <h1 className="text-2xl font-bold mb-1">
          <span className="text-red-200">Auto</span><span className="text-white">Fleet</span>
        </h1>
        <p className="text-blue-200 text-xs italic font-medium">La gestion intelligente</p>
        <p className="text-blue-200 text-xs italic font-medium">des chauffeurs</p>
      </div>

      <div className="p-4 bg-red-800 mx-4 mt-4 rounded-lg">
        <div className="flex items-center gap-3">
          <div className="text-3xl">{currentUser.avatar}</div>
          <div>
            <p className="font-semibold">{currentUser.name}</p>
            <p className="text-xs text-red-200">{currentUser.role}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        <button 
          onClick={() => setActiveTab('dashboard')} 
          className={`w-full text-left p-3 rounded ${activeTab === 'dashboard' ? 'bg-red-800' : 'hover:bg-red-800'}`}
        >
          📊 Tableau de bord
        </button>

        <button 
          onClick={() => setActiveTab('payments')} 
          className={`w-full text-left p-3 rounded ${activeTab === 'payments' ? 'bg-red-800' : 'hover:bg-red-800'}`}
        >
          💰 Versements
        </button>

        <button 
          onClick={() => setActiveTab('drivers')} 
          className={`w-full text-left p-3 rounded ${activeTab === 'drivers' ? 'bg-red-800' : 'hover:bg-red-800'}`}
        >
          👨‍✈️ Chauffeurs
        </button>

        <button 
          onClick={() => setActiveTab('contracts')} 
          className={`w-full text-left p-3 rounded ${activeTab === 'contracts' ? 'bg-red-800' : 'hover:bg-red-800'}`}
        >
          📋 Contrats
        </button>

        <button 
          onClick={() => setActiveTab('vehicles')} 
          className={`w-full text-left p-3 rounded ${activeTab === 'vehicles' ? 'bg-red-800' : 'hover:bg-red-800'}`}
        >
          🚗 Véhicules
        </button>

        <button 
          onClick={() => setActiveTab('owners')} 
          className={`w-full text-left p-3 rounded ${activeTab === 'owners' ? 'bg-red-800' : 'hover:bg-red-800'}`}
        >
          🏢 Propriétaires
        </button>

        {hasPermission('all') && (
          <button 
            onClick={() => setActiveTab('users')} 
            className={`w-full text-left p-3 rounded border-t border-red-500 mt-4 pt-4 ${activeTab === 'users' ? 'bg-red-800' : 'hover:bg-red-800'}`}
          >
            👤 Utilisateurs
          </button>
        )}
      </nav>

      <div className="p-4 border-t border-red-500">
        <button
          onClick={handleLogout}
          className="w-full p-3 bg-red-900 hover:bg-red-950 rounded-lg flex items-center justify-center gap-2"
        >
          <LogOut size={20} />
          Déconnexion
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
