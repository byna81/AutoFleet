// App.jsx - Application AVEC SUPABASE
import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabaseClient';
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

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // États vides - chargés depuis Supabase
  const [allUsers, setAllUsers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [ownerPayments, setOwnerPayments] = useState([]);
  const [managementContracts, setManagementContracts] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [maintenanceSchedule, setMaintenanceSchedule] = useState([]);
  
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Charger données au démarrage
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setIsLoading(true);
      
      const { data: usersData } = await supabase.from('users').select('*');
      if (usersData) setAllUsers(usersData);

      const { data: driversData } = await supabase.from('drivers').select('*');
      if (driversData) setDrivers(driversData);

      const { data: vehiclesData } = await supabase.from('vehicles').select('*');
      if (vehiclesData) setVehicles(vehiclesData);

      const { data: contractsData } = await supabase.from('contracts').select('*');
      if (contractsData) setContracts(contractsData);

      const { data: mgmtData } = await supabase.from('management_contracts').select('*');
      if (mgmtData) setManagementContracts(mgmtData);

      const { data: paymentsData } = await supabase.from('payments').select('*');
      if (paymentsData) setPayments(paymentsData);

      const { data: ownerPayData } = await supabase.from('owner_payments').select('*');
      if (ownerPayData) setOwnerPayments(ownerPayData);

      const { data: maintenanceData } = await supabase.from('maintenance_schedule').select('*');
      if (maintenanceData) setMaintenanceSchedule(maintenanceData);

      setIsLoading(false);
    } catch (error) {
      console.error('Erreur:', error);
      setIsLoading(false);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const user = allUsers.find(u => u.username === loginForm.username && u.password === loginForm.password);
    
    if (user) {
      setCurrentUser(user);
      setIsLoggedIn(true);
      setLoginError('');
    } else {
      setLoginError('Identifiants incorrects');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setLoginForm({ username: '', password: '' });
    setActiveTab('dashboard');
  };

  const hasPermission = (permission) => {
    if (!currentUser) return false;
    return currentUser.permissions.includes('all') || currentUser.permissions.includes(permission);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🚗</div>
          <h2 className="text-2xl font-bold mb-2">AutoFleet</h2>
          <p className="text-gray-600">Chargement des données...</p>
        </div>
      </div>
    );
  }

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
              vehicles={vehicles}
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
