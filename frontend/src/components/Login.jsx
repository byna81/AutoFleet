// Login.jsx - Page de connexion
import React from 'react';
import { User, Lock } from 'lucide-react';

const Login = ({ loginForm, setLoginForm, handleLogin, loginError }) => {
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
};

export default Login;