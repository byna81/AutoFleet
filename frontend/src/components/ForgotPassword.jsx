// ForgotPassword.jsx - Récupération mot de passe
import React, { useState } from 'react';
import { Mail, Key, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';

const ForgotPassword = ({ allUsers, setAllUsers, onBack }) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [recoveryCode, setRecoveryCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [userToReset, setUserToReset] = useState(null);

  const handleSendCode = (e) => {
    e.preventDefault();
    
    const user = allUsers.find(u => u.email === email);
    if (!user) {
      setError('Email introuvable');
      return;
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(code);
    setUserToReset(user);
    setError('');
    
    alert(`Code de récupération : ${code}\n\n(En production, ce code sera envoyé par email)`);
    setStep(2);
  };

  const handleVerifyCode = (e) => {
    e.preventDefault();
    
    if (recoveryCode !== generatedCode) {
      setError('Code incorrect');
      return;
    }

    setError('');
    setStep(3);
  };

  const handleResetPassword = (e) => {
    e.preventDefault();

    if (newPassword.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    const updatedUsers = allUsers.map(u => {
      if (u.id === userToReset.id) {
        return {
          ...u,
          password: newPassword,
          passwordChangedAt: new Date().toISOString()
        };
      }
      return u;
    });

    setAllUsers(updatedUsers);
    
    alert('✅ Mot de passe réinitialisé avec succès !\nVous pouvez maintenant vous connecter.');
    onBack();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft size={20} />
          Retour
        </button>

        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🔐</div>
          <h1 className="text-3xl font-bold mb-2">Mot de passe oublié</h1>
          <p className="text-gray-600 text-sm">
            {step === 1 && 'Entrez votre email'}
            {step === 2 && 'Entrez le code reçu'}
            {step === 3 && 'Nouveau mot de passe'}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded-lg mb-4 flex items-center gap-2 text-sm">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        {step === 1 && (
          <form onSubmit={handleSendCode}>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {setEmail(e.target.value); setError('');}}
                  placeholder="email@autofleet.sn"
                  className="w-full pl-10 pr-4 py-3 border rounded-lg"
                  required
                />
              </div>
            </div>
            <button type="submit" className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700">
              Envoyer le code
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyCode}>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Code</label>
              <input
                type="text"
                value={recoveryCode}
                onChange={(e) => {setRecoveryCode(e.target.value); setError('');}}
                maxLength={6}
                className="w-full px-4 py-3 border rounded-lg text-center text-2xl tracking-widest font-mono"
                required
              />
            </div>
            <button type="submit" className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700">
              Vérifier
            </button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleResetPassword}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Nouveau mot de passe</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => {setNewPassword(e.target.value); setError('');}}
                className="w-full px-4 py-3 border rounded-lg"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Confirmer</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => {setConfirmPassword(e.target.value); setError('');}}
                className="w-full px-4 py-3 border rounded-lg"
                required
              />
            </div>
            <button type="submit" className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700">
              Réinitialiser
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
