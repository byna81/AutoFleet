// Sidebar.jsx - Menu avec 6 onglets (regroupement fait)
import React from 'react';
import { LogOut } from 'lucide-react';

const Sidebar = ({ currentUser, activeTab, setActiveTab, handleLogout, hasPermission }) => {
  return (
    <div className="w-64 bg-gradient-to-b from-red-600 to-red-700 text-white flex flex-col h-screen">
      <div className="p-3 border-b border-red-500">
        <h1 className="text-xl font-bold mb-1 flex items-center gap-2">
          🚗 <span className="text-red-200">Auto</span><span className="text-white">Fleet</span>
        </h1>
        <p className="text-blue-200 text-xs italic">La gestion intelligente des chauffeurs</p>
      </div>

      <div className="p-3 bg-red-800 mx-3 mt-3 rounded-lg">
        <div className="flex items-center gap-2">
          <div className="text-2xl">{currentUser.avatar}</div>
          <div>
            <p className="font-semibold text-sm">{currentUser.name}</p>
            <p className="text-xs text-red-200">{currentUser.role}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        <button 
          onClick={() => setActiveTab('dashboard')} 
          className={`w-full text-left px-3 py-2 rounded text-sm ${activeTab === 'dashboard' ? 'bg-red-800' : 'hover:bg-red-800'}`}
        >
          📊 Tableau de bord
        </button>

        <button 
          onClick={() => setActiveTab('payments')} 
          className={`w-full text-left px-3 py-2 rounded text-sm ${activeTab === 'payments' ? 'bg-red-800' : 'hover:bg-red-800'}`}
        >
          💰 Versements
        </button>

        <button 
          onClick={() => setActiveTab('drivers')} 
          className={`w-full text-left px-3 py-2 rounded text-sm ${activeTab === 'drivers' ? 'bg-red-800' : 'hover:bg-red-800'}`}
        >
          👨‍✈️ Chauffeurs
        </button>

        <button 
          onClick={() => setActiveTab('vehicles')} 
          className={`w-full text-left px-3 py-2 rounded text-sm ${activeTab === 'vehicles' ? 'bg-red-800' : 'hover:bg-red-800'}`}
        >
          🚗 Véhicules
        </button>

        <button 
          onClick={() => setActiveTab('owners')} 
          className={`w-full text-left px-3 py-2 rounded text-sm ${activeTab === 'owners' ? 'bg-red-800' : 'hover:bg-red-800'}`}
        >
          🏢 Propriétaires
        </button>

        {hasPermission('all') && (
          <button 
            onClick={() => setActiveTab('users')} 
            className={`w-full text-left px-3 py-2 rounded text-sm border-t border-red-500 mt-2 pt-2 ${activeTab === 'users' ? 'bg-red-800' : 'hover:bg-red-800'}`}
          >
            👤 Utilisateurs
          </button>
        )}
      </nav>

      <div className="p-3 border-t border-red-500">
        <button
          onClick={handleLogout}
          className="w-full p-2 bg-red-900 hover:bg-red-950 rounded-lg flex items-center justify-center gap-2 text-sm"
        >
          <LogOut size={18} />
          Déconnexion
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
