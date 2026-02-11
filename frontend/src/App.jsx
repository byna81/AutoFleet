import React, { useState } from 'react';
import { Car, Users, TrendingUp, FileText, Plus, Search, Calendar, DollarSign, AlertCircle, CheckCircle, Clock, Settings, Menu, X, Camera, Phone, MapPin, CreditCard, AlertTriangle, Bell, Download, Edit, Trash2, Eye, LogOut, User, Lock } from 'lucide-react';

const AutoFleetApp = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');

  const users = [
    { 
      id: 1, 
      username: 'admin', 
      password: 'admin123', 
      name: 'Amadou Seck',
      role: 'Administrateur',
      avatar: '👨🏿‍💼'
    },
    { 
      id: 2, 
      username: 'fatou', 
      password: 'gestion123', 
      name: 'Fatou Diop',
      role: 'Gestionnaire',
      avatar: '👩🏿‍💼'
    }
  ];

  const handleLogin = (e) => {
    e.preventDefault();
    const user = users.find(u => u.username === loginForm.username && u.password === loginForm.password);
    
    if (user) {
      setCurrentUser(user);
      setIsLoggedIn(true);
      setLoginError('');
    } else {
      setLoginError('Identifiants invalides');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setActiveTab('dashboard');
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-600 via-red-700 to-red-800 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
          <div className="bg-gradient-to-r from-red-600 to-red-700 p-8 text-white text-center rounded-t-2xl">
            <div className="mb-4">
              <div className="text-6xl font-bold mb-2">
                <span className="text-red-200">Auto</span><span className="text-white">Fleet</span>
              </div>
            </div>
            <p className="text-blue-200 text-lg italic font-medium">La gestion intelligente des chauffeurs</p>
            <p className="text-red-100 text-sm mt-2">Sénégal 🇸🇳</p>
          </div>
          
          <form onSubmit={handleLogin} className="p-8">
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="inline mr-2" size={18} />
                Nom d'utilisateur
              </label>
              <input
                type="text"
                value={loginForm.username}
                onChange={(e) => setLoginForm({...loginForm, username: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="admin ou fatou"
                required
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Lock className="inline mr-2" size={18} />
                Mot de passe
              </label>
              <input
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="••••••••"
                required
              />
            </div>

            {loginError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-3 rounded-lg font-semibold hover:from-red-700 hover:to-red-800 transition duration-200"
            >
              Se connecter
            </button>

            <div className="mt-6 text-center text-sm text-gray-600">
              <p className="mb-2">Comptes de démonstration:</p>
              <p className="font-mono">admin / admin123</p>
              <p className="font-mono">fatou / gestion123</p>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
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
          <button onClick={() => setActiveTab('drivers')} className={`w-full text-left p-3 rounded ${activeTab === 'drivers' ? 'bg-red-800' : 'hover:bg-red-800'}`}>
            👥 Chauffeurs
          </button>
          <button onClick={() => setActiveTab('vehicles')} className={`w-full text-left p-3 rounded ${activeTab === 'vehicles' ? 'bg-red-800' : 'hover:bg-red-800'}`}>
            🚗 Véhicules
          </button>
          <button onClick={() => setActiveTab('contracts')} className={`w-full text-left p-3 rounded ${activeTab === 'contracts' ? 'bg-red-800' : 'hover:bg-red-800'}`}>
            📄 Contrats
          </button>
          <button onClick={() => setActiveTab('payments')} className={`w-full text-left p-3 rounded ${activeTab === 'payments' ? 'bg-red-800' : 'hover:bg-red-800'}`}>
            💰 Versements
          </button>
          <button onClick={() => setActiveTab('maintenance')} className={`w-full text-left p-3 rounded ${activeTab === 'maintenance' ? 'bg-red-800' : 'hover:bg-red-800'}`}>
            🔧 Maintenance
          </button>
        </nav>

        <button
          onClick={handleLogout}
          className="w-full p-3 bg-red-900 hover:bg-red-950 rounded-lg flex items-center justify-center gap-2 mt-4"
        >
          <LogOut size={20} />
          Déconnexion
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="mb-8 bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-6 text-white shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-2">
                  <span className="text-red-200">Auto</span><span className="text-white">Fleet</span>
                </h1>
                <p className="text-blue-200 text-lg italic font-medium">La gestion intelligente des chauffeurs</p>
                <p className="text-red-100 text-sm mt-1">🇸🇳 Sénégal</p>
              </div>
              <div className="text-6xl">🚗</div>
            </div>
          </div>

          <h1 className="text-3xl font-bold mb-6">
            {activeTab === 'dashboard' && '📊 Tableau de bord'}
            {activeTab === 'drivers' && '👥 Gestion des chauffeurs'}
            {activeTab === 'vehicles' && '🚗 Parc automobile'}
            {activeTab === 'contracts' && '📄 Gestion des contrats'}
            {activeTab === 'payments' && '💰 Suivi des versements'}
            {activeTab === 'maintenance' && '🔧 Gestion de la maintenance'}
          </h1>

          {/* Dashboard */}
          {activeTab === 'dashboard' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-700">Total Chauffeurs</h3>
                  <Users className="text-blue-600" size={32} />
                </div>
                <p className="text-4xl font-bold text-blue-600">4</p>
                <p className="text-sm text-gray-500 mt-2">Actifs</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-700">Véhicules</h3>
                  <Car className="text-green-600" size={32} />
                </div>
                <p className="text-4xl font-bold text-green-600">4</p>
                <p className="text-sm text-gray-500 mt-2">Opérationnels</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-700">Revenus du mois</h3>
                  <DollarSign className="text-purple-600" size={32} />
                </div>
                <p className="text-4xl font-bold text-purple-600">650K</p>
                <p className="text-sm text-gray-500 mt-2">FCFA</p>
              </div>
            </div>
          )}

          {/* Autres onglets */}
          {activeTab === 'drivers' && (
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <div className="text-6xl mb-4">👥</div>
              <h2 className="text-2xl font-bold text-gray-700 mb-2">Gestion des chauffeurs</h2>
              <p className="text-gray-600">Fonctionnalité disponible dans la version complète</p>
            </div>
          )}

          {activeTab === 'vehicles' && (
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <div className="text-6xl mb-4">🚗</div>
              <h2 className="text-2xl font-bold text-gray-700 mb-2">Parc automobile</h2>
              <p className="text-gray-600">Fonctionnalité disponible dans la version complète</p>
            </div>
          )}

          {activeTab === 'contracts' && (
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <div className="text-6xl mb-4">📄</div>
              <h2 className="text-2xl font-bold text-gray-700 mb-2">Gestion des contrats</h2>
              <p className="text-gray-600">Fonctionnalité disponible dans la version complète</p>
            </div>
          )}

          {activeTab === 'payments' && (
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <div className="text-6xl mb-4">💰</div>
              <h2 className="text-2xl font-bold text-gray-700 mb-2">Suivi des versements</h2>
              <p className="text-gray-600">Fonctionnalité disponible dans la version complète</p>
            </div>
          )}

          {activeTab === 'maintenance' && (
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <div className="text-6xl mb-4">🔧</div>
              <h2 className="text-2xl font-bold text-gray-700 mb-2">Gestion de la maintenance</h2>
              <p className="text-gray-600">Fonctionnalité disponible dans la version complète</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AutoFleetApp;
