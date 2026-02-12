// Sidebar.jsx - Menu latéral avec onglet Paiements Propriétaires
import React from 'react';
import { LogOut } from 'lucide-react';

const Sidebar = ({ currentUser, activeTab, setActiveTab, handleLogout, hasPermission }) => {
  return (
    <div className="w-64 bg-gradient-to-b from-red-600 to-red-700 text-white p-4 flex flex-col">
      <div className="mb-8 text-center pb-4 border-b border-red-500">
        <h1 className="text-2xl font-bold mb-1">
          <span className="text-red-200">Auto</span><span className="text-white">Fleet</span>
        </h1>
        <p className="text-blue-200 text-xs italic font-medium">La gestion intelligente</p>
        <p className="text-blue-200 text-xs italic font-medium">des chauffeurs</p>
      </div>

      <div className="mb-6 p-3 bg-red-800 rounded-lg">
        <div className="flex items-center gap-3">
          <div className="text-3xl">{currentUser.avatar}</div>
          <div>
            <p className="font-semibold">{currentUser.name}</p>
            <p className="text-xs text-red-200">{currentUser.role}</p>
          </div>
        </div>
      </div>

      <nav className="space-y-2 flex-1">
        <button onClick={() => setActiveTab('dashboard')} className={`w-full text-left p-3 rounded ${activeTab === 'dashboard' ? 'bg-red-800' : 'hover:bg-red-800'}`}>
          📊 Tableau de bord
        </button>
        <button onClick={() => setActiveTab('payments')} className={`w-full text-left p-3 rounded ${activeTab === 'payments' ? 'bg-red-800' : 'hover:bg-red-800'}`}>
          💰 Versements
        </button>
        <button onClick={() => setActiveTab('vehicles')} className={`w-full text-left p-3 rounded ${activeTab === 'vehicles' ? 'bg-red-800' : 'hover:bg-red-800'}`}>
          🚗 Véhicules
        </button>
        <button onClick={() => setActiveTab('owners')} className={`w-full text-left p-3 rounded ${activeTab === 'owners' ? 'bg-red-800' : 'hover:bg-red-800'}`}>
          🏢 Propriétaires
        </button>
        <button onClick={() => setActiveTab('owner-payments')} className={`w-full text-left p-3 rounded ${activeTab === 'owner-payments' ? 'bg-red-800' : 'hover:bg-red-800'}`}>
          💵 Paiements propriétaires
        </button>
        {hasPermission('all') && (
          <button onClick={() => setActiveTab('users')} className={`w-full text-left p-3 rounded border-t border-red-500 mt-4 pt-4 ${activeTab === 'users' ? 'bg-red-800' : 'hover:bg-red-800'}`}>
            👤 Utilisateurs
          </button>
        )}
      </nav>

      <button
        onClick={handleLogout}
        className="w-full p-3 bg-red-900 hover:bg-red-950 rounded-lg flex items-center justify-center gap-2 mt-4"
      >
        <LogOut size={20} />
        Déconnexion
      </button>
    </div>
  );
};

export default Sidebar;
