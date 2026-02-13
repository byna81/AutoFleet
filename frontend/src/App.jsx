// App.jsx - Application FINALE avec tous les props corrects
import { supabase } from './lib/supabaseClient';
import { useEffect } from 'react';
import React, { useState } from 'react';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Payments from './components/Payments';
import Drivers from './components/Drivers';
import Contracts from './components/Contracts';
import Vehicles from './components/Vehicles';
import Owners from './components/Owners';
import Users from './components/Users';
import OwnerPayments from './components/OwnerPayments';
import Maintenance from './components/Maintenance';
import ChangePassword from './components/ChangePassword';
import ForgotPassword from './components/ForgotPassword';
import { 
  users as initialUsers, 
  initialPayments, 
  initialOwnerPayments, 
  managementContracts as initialManagementContracts, 
  contracts as initialContracts,
  drivers as initialDrivers,
  vehicles as initialVehicles,
  maintenanceSchedule as initialMaintenanceSchedule
} from './data/mockData';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [allUsers, setAllUsers] = useState(initialUsers);
  const [payments, setPayments] = useState(initialPayments);
  const [ownerPayments, setOwnerPayments] = useState(initialOwnerPayments);
  const [managementContracts, setManagementContracts] = useState(initialManagementContracts);
  const [vehicles, setVehicles] = useState(initialVehicles);
  const [drivers, setDrivers] = useState(initialDrivers);
  const [contracts, setContracts] = useState(initialContracts);
  const [maintenanceSchedule, setMaintenanceSchedule] = useState(initialMaintenanceSchedule);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    const user = allUsers.find(u => u.username === loginForm.username && u.password === loginForm.password);
    
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

  const hasPermission = (permission) => {
    if (!currentUser) return false;
    return currentUser.permissions.includes('all') || currentUser.permissions.includes(permission);
  };

  if (!isLoggedIn) {
    if (showForgotPassword) {
      return (
        <ForgotPassword
          allUsers={allUsers}
          setAllUsers={setAllUsers}
          onBack={() => setShowForgotPassword(false)}
        />
      );
    }
    
    return (
      <Login
        loginForm={loginForm}
        setLoginForm={setLoginForm}
        handleLogin={handleLogin}
        loginError={loginError}
        onForgotPassword={() => setShowForgotPassword(true)}
      />
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        currentUser={currentUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        handleLogout={handleLogout}
        hasPermission={hasPermission}
        setShowChangePassword={setShowChangePassword}
      />

      <div className="flex-1 overflow-auto">
        {showChangePassword && (
          <ChangePassword
            currentUser={currentUser}
            allUsers={allUsers}
            setAllUsers={setAllUsers}
            onClose={() => setShowChangePassword(false)}
          />
        )}
        
        <div className="p-8">
          {/* Header */}
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

          {/* Content */}
          {activeTab === 'dashboard' && (
            <Dashboard 
              payments={payments}
              drivers={drivers}
              vehicles={vehicles}
              managementContracts={managementContracts}
              contracts={contracts}
              maintenanceSchedule={maintenanceSchedule}
              currentUser={currentUser}
              hasPermission={hasPermission}
              setActiveTab={setActiveTab}
            />
          )}
          
          {activeTab === 'payments' && (
            <Payments
              payments={payments}
              setPayments={setPayments}
              currentUser={currentUser}
              drivers={drivers}
              contracts={contracts}
            />
          )}

          {activeTab === 'drivers' && (
            <Drivers
              drivers={drivers}
              setDrivers={setDrivers}
              contracts={contracts}
              vehicles={vehicles}
              currentUser={currentUser}
              hasPermission={hasPermission}
            />
          )}

          {activeTab === 'contracts' && (
            <Contracts
              contracts={contracts}
              setContracts={setContracts}
              drivers={drivers}
              vehicles={vehicles}
              currentUser={currentUser}
              hasPermission={hasPermission}
            />
          )}
          
          {activeTab === 'vehicles' && (
            <Vehicles
              payments={payments}
              vehicles={vehicles}
              setVehicles={setVehicles}
              currentUser={currentUser}
              hasPermission={hasPermission}
              managementContracts={managementContracts}
              contracts={contracts}
              setActiveTab={setActiveTab}
            />
          )}
          
          {activeTab === 'owners' && (
            <Owners
              managementContracts={managementContracts}
              setManagementContracts={setManagementContracts}
              currentUser={currentUser}
              hasPermission={hasPermission}
              setActiveTab={setActiveTab}
            />
          )}
          
          {activeTab === 'owner-payments' && (
            <OwnerPayments
              payments={payments}
              ownerPayments={ownerPayments}
              setOwnerPayments={setOwnerPayments}
              currentUser={currentUser}
              managementContracts={managementContracts}
              contracts={contracts}
            />
          )}

          {activeTab === 'maintenance' && (
            <Maintenance
              maintenanceSchedule={maintenanceSchedule}
              setMaintenanceSchedule={setMaintenanceSchedule}
              vehicles={vehicles}
              currentUser={currentUser}
              hasPermission={hasPermission}
            />
          )}
          
          {activeTab === 'users' && hasPermission('all') && (
            <Users
              allUsers={allUsers}
              setAllUsers={setAllUsers}
              currentUser={currentUser}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
