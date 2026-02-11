// Users.jsx - Gestion des utilisateurs (Admin uniquement)
import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

const Users = ({ allUsers, setAllUsers, currentUser }) => {
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUser, setNewUser] = useState({
    username: '',
    password: '',
    name: '',
    email: '',
    phone: ''
  });

  const handleAddUser = (e) => {
    e.preventDefault();
    
    const avatars = ['👨🏿‍💼', '👩🏿‍💼', '👨🏿', '👩🏿', '👨🏿‍🔧', '👩🏿‍🔧'];
    const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];
    
    const user = {
      id: allUsers.length + 1,
      ...newUser,
      role: 'Gestionnaire',
      avatar: randomAvatar,
      permissions: ['drivers', 'contracts', 'payments', 'vehicles', 'maintenance', 'alerts'],
      createdBy: currentUser.id,
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    setAllUsers([...allUsers, user]);
    alert(`✅ Utilisateur créé!\n${newUser.name} - Gestionnaire`);
    setShowAddUser(false);
    setNewUser({ username: '', password: '', name: '', email: '', phone: '' });
  };

  const handleDeleteUser = (userId) => {
    const user = allUsers.find(u => u.id === userId);
    if (user.role === 'Administrateur') {
      alert('Impossible de supprimer un administrateur');
      return;
    }
    
    if (confirm(`Supprimer ${user.name} ?`)) {
      setAllUsers(allUsers.filter(u => u.id !== userId));
      alert(`✅ ${user.name} supprimé`);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">👤 Gestion des utilisateurs</h1>
        <button
          onClick={() => setShowAddUser(true)}
          className="bg-green-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-green-700"
        >
          <Plus size={20} />
          Ajouter un gestionnaire
        </button>
      </div>

      {/* Modal Ajout */}
      {showAddUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-6">Nouveau gestionnaire</h2>
            <form onSubmit={handleAddUser}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Nom complet</label>
                <input
                  type="text"
                  value={newUser.name}
                  onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Nom d'utilisateur</label>
                <input
                  type="text"
                  value={newUser.username}
                  onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Mot de passe</label>
                <input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Téléphone</label>
                <input
                  type="tel"
                  value={newUser.phone}
                  onChange={(e) => setNewUser({...newUser, phone: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="+221 XX XXX XXXX"
                  required
                />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">
                  Créer
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddUser(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Liste */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {allUsers.map(user => (
          <div key={user.id} className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="text-5xl">{user.avatar}</div>
                <div>
                  <h3 className="font-bold text-xl">{user.name}</h3>
                  <p className="text-sm text-gray-600">{user.role}</p>
                  <p className="text-xs text-gray-500 mt-1">@{user.username}</p>
                </div>
              </div>
              {user.role !== 'Administrateur' && (
                <button
                  onClick={() => handleDeleteUser(user.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 size={20} />
                </button>
              )}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200 text-sm">
              <p className="text-gray-600">📧 {user.email}</p>
              <p className="text-gray-600">📱 {user.phone}</p>
              {user.createdAt && (
                <p className="text-xs text-gray-500 mt-2">Créé le {user.createdAt}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Users;
