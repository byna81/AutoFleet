import React, { useState } from 'react';
import { Car, Users, TrendingUp, FileText, Plus, Search, Calendar, DollarSign, AlertCircle, CheckCircle, Clock, Settings, Menu, X, Camera, Phone, MapPin, CreditCard, AlertTriangle, Bell, Download, Edit, Trash2, Eye, LogOut, User, Lock, History } from 'lucide-react';

const AutoFleetApp = () => {
  // États
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // États pour les versements
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [selectedPaymentDriver, setSelectedPaymentDriver] = useState(null);
  const [newPayment, setNewPayment] = useState({
    amount: '',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    notes: ''
  });
  const [editingPayment, setEditingPayment] = useState(null);
  const [showPaymentHistory, setShowPaymentHistory] = useState(null);

  // Utilisateurs
  const users = [
    { 
      id: 1, 
      username: 'admin', 
      password: 'admin123', 
      name: 'Amadou Seck',
      role: 'Administrateur',
      email: 'admin@autofleet.sn',
      phone: '+221 77 999 8888',
      avatar: '👨🏿‍💼',
      permissions: ['all']
    },
    { 
      id: 2, 
      username: 'fatou', 
      password: 'gestion123', 
      name: 'Fatou Diop',
      role: 'Gestionnaire',
      email: 'fatou.diop@autofleet.sn',
      phone: '+221 76 888 7777',
      avatar: '👩🏿‍💼',
      permissions: ['drivers', 'contracts', 'payments', 'vehicles', 'maintenance']
    }
  ];

  // Chauffeurs
  const drivers = [
    { id: 1, name: 'Mamadou Diallo', photo: '👨🏿', phone: '+221 77 123 4567', contractId: 1, vehicleId: 'DK-123-AB', status: 'active' },
    { id: 2, name: 'Ibrahima Sarr', photo: '👨🏿‍🦱', phone: '+221 76 234 5678', contractId: 2, vehicleId: 'DK-456-CD', status: 'active' },
    { id: 3, name: 'Moussa Ndiaye', photo: '👨🏿‍🦲', phone: '+221 78 345 6789', contractId: 3, vehicleId: 'DK-789-EF', status: 'active' },
    { id: 4, name: 'Cheikh Ba', photo: '👨🏿', phone: '+221 77 456 7890', contractId: 4, vehicleId: 'DK-012-GH', status: 'active' },
  ];

  // Véhicules avec propriétaires
  const vehicles = [
    { id: 'DK-123-AB', brand: 'Toyota Corolla', year: 2020, ownershipType: 'Société' },
    { id: 'DK-456-CD', brand: 'Hyundai Accent', year: 2019, ownershipType: 'Société' },
    { id: 'DK-789-EF', brand: 'Renault Symbol', year: 2021, ownershipType: 'Particulier', ownerName: 'Ousmane Fall' },
    { id: 'DK-012-GH', brand: 'Kia Picanto', year: 2022, ownershipType: 'Particulier', ownerName: 'Awa Diagne' },
  ];

  // Contrats de gestion (pour véhicules particuliers)
  const managementContracts = [
    {
      id: 1,
      vehicleId: 'DK-789-EF',
      ownerName: 'Ousmane Fall',
      driverDailyPayment: 10000,
      ownerDailyShare: 8000,
      companyDailyShare: 2000,
      status: 'active'
    },
    {
      id: 2,
      vehicleId: 'DK-012-GH',
      ownerName: 'Awa Diagne',
      driverDailyPayment: 16000,
      ownerDailyShare: 14000,
      companyDailyShare: 2000,
      status: 'active'
    },
  ];

  // Contrats chauffeurs
  const contracts = [
    { id: 1, driverId: 1, vehicleId: 'DK-123-AB', type: 'LAO', dailyAmount: 15000, status: 'active' },
    { id: 2, driverId: 2, vehicleId: 'DK-456-CD', type: 'Location', dailyAmount: 12000, status: 'active' },
    { id: 3, driverId: 3, vehicleId: 'DK-789-EF', type: 'Location', dailyAmount: 10000, status: 'active' },
    { id: 4, driverId: 4, vehicleId: 'DK-012-GH', type: 'LAO', dailyAmount: 16000, status: 'active' },
  ];

  // Versements avec traçabilité
  const [payments, setPayments] = useState([
    { 
      id: 1, 
      driverId: 1, 
      contractId: 1, 
      date: '2025-02-10', 
      amount: 15000, 
      status: 'paid', 
      time: '18:30', 
      recordedBy: 'Amadou Seck', 
      recordedById: 1,
      recordedAt: '2025-02-10T18:30:00',
      modifications: [] 
    },
    { 
      id: 2, 
      driverId: 3, 
      contractId: 3, 
      date: '2025-02-10', 
      amount: 10000, 
      status: 'paid', 
      time: '19:00', 
      recordedBy: 'Fatou Diop', 
      recordedById: 2,
      recordedAt: '2025-02-10T19:00:00',
      modifications: [] 
    },
  ]);

  // Fonctions
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

  const handleAddPayment = (e) => {
    e.preventDefault();
    
    if (!selectedPaymentDriver) {
      alert('Veuillez sélectionner un chauffeur');
      return;
    }

    const driver = drivers.find(d => d.id === selectedPaymentDriver);
    const contract = contracts.find(c => c.driverId === selectedPaymentDriver);

    if (!contract) {
      alert('Aucun contrat actif trouvé pour ce chauffeur');
      return;
    }

    const paymentAmount = parseFloat(newPayment.amount);
    const contractAmount = contract.dailyAmount;

    // ⚠️ VÉRIFICATION AUTOMATIQUE DU MONTANT
    if (paymentAmount !== contractAmount) {
      const confirmed = confirm(
        `⚠️ ATTENTION!\n\n` +
        `Le montant saisi (${paymentAmount.toLocaleString()} FCFA) ne correspond pas au montant du contrat.\n\n` +
        `Montant prévu selon le contrat ${contract.type}: ${contractAmount.toLocaleString()} FCFA\n\n` +
        `Voulez-vous quand même enregistrer ce paiement ?`
      );
      
      if (!confirmed) {
        return;
      }
    }

    const payment = {
      id: payments.length + 1,
      driverId: selectedPaymentDriver,
      contractId: contract.id,
      date: newPayment.date,
      time: newPayment.time,
      amount: paymentAmount,
      status: 'paid',
      notes: newPayment.notes,
      recordedBy: currentUser.name,
      recordedById: currentUser.id,
      recordedAt: new Date().toISOString(),
      modifications: []
    };

    setPayments([...payments, payment]);

    alert(
      `✅ Paiement enregistré avec succès!\n\n` +
      `Chauffeur: ${driver.name}\n` +
      `Montant: ${paymentAmount.toLocaleString()} FCFA\n` +
      `Date: ${newPayment.date}\n` +
      `Heure: ${newPayment.time}\n` +
      `Enregistré par: ${currentUser.name}`
    );

    setShowAddPayment(false);
    setSelectedPaymentDriver(null);
    setNewPayment({
      amount: '',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      notes: ''
    });
  };

  const handleEditPayment = (e) => {
    e.preventDefault();
    
    if (!editingPayment || !editingPayment.modificationReason) {
      alert('Veuillez indiquer le motif de modification');
      return;
    }

    const payment = payments.find(p => p.id === editingPayment.id);
    const modification = {
      modifiedAt: new Date().toISOString(),
      modifiedBy: currentUser.name,
      modifiedById: currentUser.id,
      reason: editingPayment.modificationReason,
      changes: {}
    };

    if (payment.amount !== parseFloat(editingPayment.amount)) {
      modification.changes.amount = {
        old: payment.amount,
        new: parseFloat(editingPayment.amount)
      };
    }

    if (payment.date !== editingPayment.date) {
      modification.changes.date = {
        old: payment.date,
        new: editingPayment.date
      };
    }

    const updatedPayments = payments.map(p => {
      if (p.id === editingPayment.id) {
        return {
          ...p,
          amount: parseFloat(editingPayment.amount),
          date: editingPayment.date,
          time: editingPayment.time,
          notes: editingPayment.notes,
          modifications: [...(p.modifications || []), modification],
          lastModifiedBy: currentUser.name,
          lastModifiedAt: new Date().toISOString()
        };
      }
      return p;
    });

    setPayments(updatedPayments);
    setEditingPayment(null);
    alert('✅ Paiement modifié avec succès!');
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
          <button onClick={() => setActiveTab('payments')} className={`w-full text-left p-3 rounded ${activeTab === 'payments' ? 'bg-red-800' : 'hover:bg-red-800'}`}>
            💰 Versements
          </button>
          <button onClick={() => setActiveTab('vehicles')} className={`w-full text-left p-3 rounded ${activeTab === 'vehicles' ? 'bg-red-800' : 'hover:bg-red-800'}`}>
            🚗 Véhicules
          </button>
          <button onClick={() => setActiveTab('owners')} className={`w-full text-left p-3 rounded ${activeTab === 'owners' ? 'bg-red-800' : 'hover:bg-red-800'}`}>
            🏢 Propriétaires
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

          {/* Dashboard */}
          {activeTab === 'dashboard' && (
            <div>
              <h1 className="text-3xl font-bold mb-6">📊 Tableau de bord</h1>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-700">Total Chauffeurs</h3>
                    <Users className="text-blue-600" size={32} />
                  </div>
                  <p className="text-4xl font-bold text-blue-600">{drivers.length}</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-700">Véhicules</h3>
                    <Car className="text-green-600" size={32} />
                  </div>
                  <p className="text-4xl font-bold text-green-600">{vehicles.length}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    {vehicles.filter(v => v.ownershipType === 'Société').length} Société / 
                    {vehicles.filter(v => v.ownershipType === 'Particulier').length} Particuliers
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
            </div>
          )}

          {/* VERSEMENTS avec bouton Ajouter */}
          {activeTab === 'payments' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">💰 Suivi des versements</h1>
                <button
                  onClick={() => setShowAddPayment(true)}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-green-700"
                >
                  <Plus size={20} />
                  Ajouter un versement
                </button>
              </div>

              {/* Modal Ajout versement */}
              {showAddPayment && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-xl p-8 max-w-md w-full">
                    <h2 className="text-2xl font-bold mb-6">Nouveau versement</h2>
                    <form onSubmit={handleAddPayment}>
                      <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">Chauffeur</label>
                        <select
                          value={selectedPaymentDriver || ''}
                          onChange={(e) => {
                            const driverId = parseInt(e.target.value);
                            setSelectedPaymentDriver(driverId);
                            const contract = contracts.find(c => c.driverId === driverId);
                            if (contract) {
                              setNewPayment({...newPayment, amount: contract.dailyAmount});
                            }
                          }}
                          className="w-full px-4 py-2 border rounded-lg"
                          required
                        >
                          <option value="">Sélectionner un chauffeur</option>
                          {drivers.map(d => (
                            <option key={d.id} value={d.id}>{d.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">Montant (FCFA)</label>
                        <input
                          type="number"
                          value={newPayment.amount}
                          onChange={(e) => setNewPayment({...newPayment, amount: e.target.value})}
                          className="w-full px-4 py-2 border rounded-lg"
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">Date</label>
                        <input
                          type="date"
                          value={newPayment.date}
                          onChange={(e) => setNewPayment({...newPayment, date: e.target.value})}
                          className="w-full px-4 py-2 border rounded-lg"
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">Heure</label>
                        <input
                          type="time"
                          value={newPayment.time}
                          onChange={(e) => setNewPayment({...newPayment, time: e.target.value})}
                          className="w-full px-4 py-2 border rounded-lg"
                          required
                        />
                      </div>
                      <div className="flex gap-2">
                        <button type="submit" className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">
                          Enregistrer
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowAddPayment(false)}
                          className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
                        >
                          Annuler
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Liste des versements */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Chauffeur</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Montant</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Enregistré par</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {payments.map(payment => {
                      const driver = drivers.find(d => d.id === payment.driverId);
                      return (
                        <tr key={payment.id}>
                          <td className="px-6 py-4">{driver?.name}</td>
                          <td className="px-6 py-4">{payment.date} à {payment.time}</td>
                          <td className="px-6 py-4 font-bold">{payment.amount.toLocaleString()} FCFA</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{payment.recordedBy}</td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => setShowPaymentHistory(payment)}
                              className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                            >
                              <History size={16} />
                              Historique ({payment.modifications?.length || 0})
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* VÉHICULES avec répartition financière */}
          {activeTab === 'vehicles' && (
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

                  return (
                    <div key={vehicle.id} className={`bg-white rounded-xl shadow-lg border-l-4 ${
                      vehicle.ownershipType === 'Société' ? 'border-blue-500' : 'border-green-500'
                    }`}>
                      <div className={`p-4 ${vehicle.ownershipType === 'Société' ? 'bg-blue-50' : 'bg-green-50'}`}>
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold text-xl">{vehicle.id}</h3>
                            <p className="text-sm text-gray-600">{vehicle.brand}</p>
                            {vehicle.ownershipType === 'Particulier' && (
                              <p className="text-sm text-green-700 font-medium mt-1">Propriétaire: {vehicle.ownerName}</p>
                            )}
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            vehicle.ownershipType === 'Société' ? 'bg-blue-200 text-blue-800' : 'bg-green-200 text-green-800'
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
                          <div className="flex justify-between p-3 bg-blue-50 rounded border border-blue-200">
                            <span className="text-sm font-medium text-blue-900">🏢 Part Société:</span>
                            <span className="font-bold text-blue-700">{companyShare.toLocaleString()} FCFA</span>
                          </div>
                          <div className="flex justify-between p-3 bg-green-50 rounded border border-green-200">
                            <span className="text-sm font-medium text-green-900">👤 Part Propriétaire:</span>
                            <span className="font-bold text-green-700">{ownerShare.toLocaleString()} FCFA</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* PROPRIÉTAIRES */}
          {activeTab === 'owners' && (
            <div>
              <h1 className="text-3xl font-bold mb-6">🏢 Propriétaires particuliers</h1>
              <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <div className="text-6xl mb-4">👥</div>
                <h2 className="text-2xl font-bold text-gray-700 mb-2">Gestion des propriétaires</h2>
                <p className="text-gray-600 mb-4">
                  Liste des particuliers ayant confié leurs véhicules à AutoFleet
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  {managementContracts.map(mc => (
                    <div key={mc.id} className="border border-green-200 rounded-lg p-4 bg-green-50">
                      <h3 className="font-bold text-lg text-green-800">{mc.ownerName}</h3>
                      <p className="text-sm text-gray-600 mt-2">Véhicule: {mc.vehicleId}</p>
                      <div className="mt-3 text-sm">
                        <p className="text-gray-700">Répartition journalière:</p>
                        <p className="text-green-700">• Propriétaire: {mc.ownerDailyShare.toLocaleString()} FCFA</p>
                        <p className="text-blue-700">• AutoFleet: {mc.companyDailyShare.toLocaleString()} FCFA</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal Historique */}
      {showPaymentHistory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Historique des modifications</h2>
            <div className="mb-4 p-4 bg-gray-50 rounded">
              <p><strong>Chauffeur:</strong> {drivers.find(d => d.id === showPaymentHistory.driverId)?.name}</p>
              <p><strong>Montant:</strong> {showPaymentHistory.amount.toLocaleString()} FCFA</p>
              <p><strong>Date:</strong> {showPaymentHistory.date}</p>
              <p><strong>Enregistré par:</strong> {showPaymentHistory.recordedBy}</p>
            </div>
            {showPaymentHistory.modifications && showPaymentHistory.modifications.length > 0 ? (
              <div className="space-y-3">
                {showPaymentHistory.modifications.map((mod, idx) => (
                  <div key={idx} className="border border-yellow-200 bg-yellow-50 rounded p-3">
                    <p className="font-bold text-sm">Modification #{idx + 1}</p>
                    <p className="text-xs text-gray-600">Par: {mod.modifiedBy} le {new Date(mod.modifiedAt).toLocaleString('fr-FR')}</p>
                    <p className="text-sm mt-2"><strong>Motif:</strong> {mod.reason}</p>
                    {Object.keys(mod.changes).length > 0 && (
                      <div className="mt-2 text-sm">
                        <p className="font-bold">Changements:</p>
                        {Object.entries(mod.changes).map(([key, change]) => (
                          <p key={key} className="text-xs">
                            • {key}: {JSON.stringify(change.old)} → {JSON.stringify(change.new)}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center">Aucune modification</p>
            )}
            <button
              onClick={() => setShowPaymentHistory(null)}
              className="mt-6 w-full bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AutoFleetApp;
