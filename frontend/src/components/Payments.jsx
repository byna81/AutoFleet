// Payments.jsx - CORRIGÉ avec date dans historique
import React, { useState } from 'react';
import { Plus, History, Edit } from 'lucide-react';

const Payments = ({ payments, setPayments, currentUser, drivers, contracts }) => {
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [selectedPaymentDriver, setSelectedPaymentDriver] = useState(null);
  const [newPayment, setNewPayment] = useState({
    amount: '',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    notes: ''
  });
  const [showPaymentHistory, setShowPaymentHistory] = useState(null);
  const [editingPayment, setEditingPayment] = useState(null);

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
      const confirmed = window.confirm(
        `⚠️ ATTENTION!\n\nMontant saisi: ${paymentAmount.toLocaleString()} FCFA\nMontant contrat ${contract.type}: ${contractAmount.toLocaleString()} FCFA\n\nVoulez-vous continuer?`
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
    alert(`✅ Paiement enregistré!\n\nChauffeur: ${driver.name}\nMontant: ${paymentAmount.toLocaleString()} FCFA\nType: ${contract.type}`);
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
    
    if (!editingPayment.modificationReason || !editingPayment.modificationReason.trim()) {
      alert('⚠️ Le motif de modification est obligatoire');
      return;
    }

    const oldPayment = payments.find(p => p.id === editingPayment.id);
    const modification = {
      modifiedAt: new Date().toISOString(),
      modifiedBy: currentUser.name,
      modifiedById: currentUser.id,
      reason: editingPayment.modificationReason,
      changes: {}
    };

    if (oldPayment.amount !== parseFloat(editingPayment.amount)) {
      modification.changes.amount = {
        old: oldPayment.amount,
        new: parseFloat(editingPayment.amount)
      };
    }

    if (oldPayment.date !== editingPayment.date) {
      modification.changes.date = {
        old: oldPayment.date,
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
          notes: editingPayment.notes || p.notes,
          modifications: [...(p.modifications || []), modification],
          lastModifiedBy: currentUser.name,
          lastModifiedAt: new Date().toISOString()
        };
      }
      return p;
    });

    setPayments(updatedPayments);
    
    const driver = drivers.find(d => d.id === editingPayment.driverId);
    alert(`✅ Versement modifié!\nChauffeur: ${driver?.name}\nNouveau montant: ${parseFloat(editingPayment.amount).toLocaleString()} FCFA`);
    
    setEditingPayment(null);
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

      {/* Modals Ajout et Modification - Identiques à avant */}
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
              
              {selectedPaymentDriver && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
                  <p className="text-sm text-blue-900">
                    <strong>Type:</strong> {contracts.find(c => c.driverId === selectedPaymentDriver)?.type}
                  </p>
                  <p className="text-sm text-blue-900">
                    <strong>Montant:</strong> {contracts.find(c => c.driverId === selectedPaymentDriver)?.dailyAmount.toLocaleString()} FCFA
                  </p>
                </div>
              )}
              
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
                <button type="submit" className="flex-1 bg-green-600 text-white py-2 rounded-lg">
                  Enregistrer
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddPayment(false)}
                  className="flex-1 bg-gray-300 py-2 rounded-lg"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editingPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-6">Modifier le versement</h2>
            <form onSubmit={handleEditPayment}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Montant (FCFA)</label>
                <input
                  type="number"
                  value={editingPayment.amount}
                  onChange={(e) => setEditingPayment({...editingPayment, amount: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Motif <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={editingPayment.modificationReason || ''}
                  onChange={(e) => setEditingPayment({...editingPayment, modificationReason: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg"
                  rows="3"
                  placeholder="Ex: Erreur de saisie..."
                  required
                />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="flex-1 bg-orange-600 text-white py-2 rounded-lg">
                  Valider
                </button>
                <button
                  type="button"
                  onClick={() => setEditingPayment(null)}
                  className="flex-1 bg-gray-300 py-2 rounded-lg"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tableau */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Chauffeur</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Montant</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Enregistré par</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {payments.map(payment => {
              const driver = drivers.find(d => d.id === payment.driverId);
              const contract = contracts.find(c => c.id === payment.contractId);
              
              return (
                <tr key={payment.id}>
                  <td className="px-6 py-4">{driver?.name}</td>
                  <td className="px-6 py-4">{payment.date} à {payment.time}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      contract?.type === 'LAO' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {contract?.type || 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold">{payment.amount.toLocaleString()} FCFA</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{payment.recordedBy}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingPayment({...payment, modificationReason: ''})}
                        className="text-orange-600 hover:text-orange-800"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => setShowPaymentHistory(payment)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <History size={16} /> ({payment.modifications?.length || 0})
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal Historique CORRIGÉ avec DATE */}
      {showPaymentHistory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">📜 Historique</h2>
            
            <div className="mb-6 p-4 bg-gray-50 rounded">
              <p><strong>Par:</strong> {showPaymentHistory.recordedBy}</p>
              <p><strong>Motif:</strong> {showPaymentHistory.modifications?.[0]?.reason || 'Aucune modification'}</p>
            </div>

            {showPaymentHistory.modifications?.length > 0 ? (
              <div className="space-y-3">
                {showPaymentHistory.modifications.map((mod, idx) => (
                  <div key={idx} className="border border-yellow-200 bg-yellow-50 rounded p-4">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-bold text-yellow-900">Modification #{idx + 1}</p>
                      <span className="text-xs text-gray-600 font-mono">
                        {new Date(mod.modifiedAt).toLocaleDateString('fr-FR')} à{' '}
                        {new Date(mod.modifiedAt).toLocaleTimeString('fr-FR')}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-700 mb-2">
                      <strong>Par:</strong> {mod.modifiedBy}
                    </p>
                    
                    <div className="p-3 bg-white rounded mb-2">
                      <p className="text-sm font-bold mb-1">Motif:</p>
                      <p className="text-sm text-gray-700">{mod.reason}</p>
                    </div>

                    {Object.keys(mod.changes).length > 0 && (
                      <div className="p-3 bg-white rounded">
                        <p className="text-sm font-bold mb-2">Changements:</p>
                        {mod.changes.amount && (
                          <p className="text-sm">
                            <strong>Montant:</strong>{' '}
                            <span className="text-red-600 line-through">
                              {mod.changes.amount.old.toLocaleString()} FCFA
                            </span>
                            {' → '}
                            <span className="text-green-600 font-bold">
                              {mod.changes.amount.new.toLocaleString()} FCFA
                            </span>
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">Aucune modification</p>
            )}

            <button
              onClick={() => setShowPaymentHistory(null)}
              className="mt-6 w-full bg-gray-300 py-2 rounded-lg"
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
