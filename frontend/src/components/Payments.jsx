// Payments.jsx - Gestion des versements
import React, { useState } from 'react';
import { Plus, History } from 'lucide-react';
import { drivers, contracts } from '../data/mockData';

const Payments = ({ payments, setPayments, currentUser }) => {
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [selectedPaymentDriver, setSelectedPaymentDriver] = useState(null);
  const [newPayment, setNewPayment] = useState({
    amount: '',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    notes: ''
  });
  const [showPaymentHistory, setShowPaymentHistory] = useState(null);

  const handleAddPayment = (e) => {
    e.preventDefault();
    
    const driver = drivers.find(d => d.id === selectedPaymentDriver);
    const contract = contracts.find(c => c.driverId === selectedPaymentDriver);

    if (!contract) {
      alert('Aucun contrat actif trouvé');
      return;
    }

    const paymentAmount = parseFloat(newPayment.amount);
    const contractAmount = contract.dailyAmount;

    if (paymentAmount !== contractAmount) {
      const confirmed = confirm(
        `⚠️ ATTENTION!\n\nMontant saisi: ${paymentAmount.toLocaleString()} FCFA\nMontant contrat: ${contractAmount.toLocaleString()} FCFA\n\nContinuer?`
      );
      if (!confirmed) return;
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

    setPayments([payment, ...payments]);
    alert(`✅ Paiement enregistré!\n${driver.name} - ${paymentAmount.toLocaleString()} FCFA`);
    setShowAddPayment(false);
    setSelectedPaymentDriver(null);
    setNewPayment({
      amount: '',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      notes: ''
    });
  };

  return (
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

      {/* Modal Ajout */}
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
                  <option value="">Sélectionner</option>
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

      {/* Modal Historique */}
      {showPaymentHistory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Historique des modifications</h2>
            <div className="mb-4 p-4 bg-gray-50 rounded">
              <p><strong>Montant:</strong> {showPaymentHistory.amount.toLocaleString()} FCFA</p>
              <p><strong>Date:</strong> {showPaymentHistory.date}</p>
              <p><strong>Enregistré par:</strong> {showPaymentHistory.recordedBy}</p>
            </div>
            {showPaymentHistory.modifications?.length > 0 ? (
              <div className="space-y-3">
                {showPaymentHistory.modifications.map((mod, idx) => (
                  <div key={idx} className="border border-yellow-200 bg-yellow-50 rounded p-3">
                    <p className="font-bold">Modification #{idx + 1}</p>
                    <p className="text-xs text-gray-600">Par: {mod.modifiedBy}</p>
                    <p className="text-sm mt-2"><strong>Motif:</strong> {mod.reason}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center">Aucune modification</p>
            )}
            <button
              onClick={() => setShowPaymentHistory(null)}
              className="mt-6 w-full bg-gray-300 text-gray-700 py-2 rounded-lg"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payments;
