// Payments.jsx - Gestion des versements avec Type de contrat et Modification tracée
import React, { useState } from 'react';
import { Plus, History, Edit } from 'lucide-react';
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
      const confirmed = confirm(
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
    alert(`✅ Paiement enregistré!\n\nChauffeur: ${driver.name}\nMontant: ${paymentAmount.toLocaleString()} FCFA\nType: ${contract.type}\nEnregistré par: ${currentUser.name}`);
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

    if (oldPayment.time !== editingPayment.time) {
      modification.changes.time = {
        old: oldPayment.time,
        new: editingPayment.time
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
    alert(`✅ Versement modifié avec succès!\n\nChauffeur: ${driver?.name}\nNouveau montant: ${parseFloat(editingPayment.amount).toLocaleString()} FCFA\nModifié par: ${currentUser.name}\nMotif: ${editingPayment.modificationReason}`);
    
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
              
              {selectedPaymentDriver && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
                  <p className="text-sm text-blue-900">
                    <strong>Type de contrat:</strong>{' '}
                    {contracts.find(c => c.driverId === selectedPaymentDriver)?.type}
                  </p>
                  <p className="text-sm text-blue-900">
                    <strong>Montant journalier:</strong>{' '}
                    {contracts.find(c => c.driverId === selectedPaymentDriver)?.dailyAmount.toLocaleString()} FCFA
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
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Notes (optionnel)</label>
                <textarea
                  value={newPayment.notes}
                  onChange={(e) => setNewPayment({...newPayment, notes: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg"
                  rows="2"
                  placeholder="Remarques éventuelles..."
                />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">
                  Enregistrer
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddPayment(false);
                    setSelectedPaymentDriver(null);
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Modification */}
      {editingPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-6">✏️ Modifier le versement</h2>
            <form onSubmit={handleEditPayment}>
              <div className="mb-4 p-4 bg-gray-50 rounded border">
                <p className="text-sm text-gray-600">
                  <strong>Chauffeur:</strong> {drivers.find(d => d.id === editingPayment.driverId)?.name}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Type:</strong>{' '}
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    contracts.find(c => c.id === editingPayment.contractId)?.type === 'LAO'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {contracts.find(c => c.id === editingPayment.contractId)?.type}
                  </span>
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Enregistré par:</strong> {editingPayment.recordedBy}
                </p>
              </div>

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
                <label className="block text-sm font-medium mb-2">Date</label>
                <input
                  type="date"
                  value={editingPayment.date}
                  onChange={(e) => setEditingPayment({...editingPayment, date: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Heure</label>
                <input
                  type="time"
                  value={editingPayment.time}
                  onChange={(e) => setEditingPayment({...editingPayment, time: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Motif de modification <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={editingPayment.modificationReason || ''}
                  onChange={(e) => setEditingPayment({...editingPayment, modificationReason: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg"
                  rows="3"
                  placeholder="Ex: Erreur de saisie, montant corrigé selon contrat, etc."
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  ⚠️ Le motif est obligatoire pour la traçabilité
                </p>
              </div>

              <div className="flex gap-2">
                <button type="submit" className="flex-1 bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700">
                  ✅ Valider la modification
                </button>
                <button
                  type="button"
                  onClick={() => setEditingPayment(null)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg"
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
                <tr key={payment.id} className={payment.modifications?.length > 0 ? 'bg-yellow-50' : ''}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span>{driver?.name}</span>
                      {payment.modifications?.length > 0 && (
                        <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded" title="Ce versement a été modifié">
                          ✏️
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">{payment.date} à {payment.time}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      contract?.type === 'LAO' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {contract?.type || 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold">{payment.amount.toLocaleString()} FCFA</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {payment.recordedBy}
                    {payment.lastModifiedBy && (
                      <div className="text-xs text-orange-600">
                        Modifié par {payment.lastModifiedBy}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingPayment({
                          ...payment,
                          modificationReason: ''
                        })}
                        className="text-orange-600 hover:text-orange-800 flex items-center gap-1"
                        title="Modifier ce versement"
                      >
                        <Edit size={16} />
                        Modifier
                      </button>
                      <button
                        onClick={() => setShowPaymentHistory(payment)}
                        className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                        title="Voir l'historique des modifications"
                      >
                        <History size={16} />
                        Historique ({payment.modifications?.length || 0})
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {payments.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p>Aucun versement enregistré</p>
          </div>
        )}
      </div>

      {/* Modal Historique */}
      {showPaymentHistory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">📜 Historique des modifications</h2>
            
            <div className="mb-6 p-4 bg-gray-50 rounded border">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <p><strong>Chauffeur:</strong> {drivers.find(d => d.id === showPaymentHistory.driverId)?.name}</p>
                <p><strong>Montant actuel:</strong> {showPaymentHistory.amount.toLocaleString()} FCFA</p>
                <p><strong>Date:</strong> {showPaymentHistory.date}</p>
                <p><strong>Heure:</strong> {showPaymentHistory.time}</p>
                <p className="col-span-2"><strong>Enregistré par:</strong> {showPaymentHistory.recordedBy}</p>
                <p className="col-span-2 text-xs text-gray-500">
                  Le {new Date(showPaymentHistory.recordedAt).toLocaleString('fr-FR')}
                </p>
              </div>
            </div>

            {showPaymentHistory.modifications && showPaymentHistory.modifications.length > 0 ? (
              <div className="space-y-4">
                <h3 className="font-bold text-lg">Modifications ({showPaymentHistory.modifications.length})</h3>
                {showPaymentHistory.modifications.map((mod, idx) => (
                  <div key={idx} className="border-l-4 border-yellow-500 bg-yellow-50 rounded p-4">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-bold text-yellow-900">Modification #{idx + 1}</p>
                      <span className="text-xs text-gray-600">
                        {new Date(mod.modifiedAt).toLocaleString('fr-FR')}
                      </span>
                    </div>
                    
                    <p className="text-sm mb-2">
                      <strong>Par:</strong> {mod.modifiedBy}
                    </p>
                    
                    <div className="bg-white p-3 rounded mb-2">
                      <p className="text-sm font-bold mb-1">Motif:</p>
                      <p className="text-sm text-gray-700">{mod.reason}</p>
                    </div>

                    {Object.keys(mod.changes).length > 0 && (
                      <div className="bg-white p-3 rounded">
                        <p className="text-sm font-bold mb-2">Changements:</p>
                        {Object.entries(mod.changes).map(([key, change]) => (
                          <div key={key} className="text-sm mb-1">
                            <span className="font-medium">{key === 'amount' ? 'Montant' : key === 'date' ? 'Date' : 'Heure'}:</span>
                            <span className="text-red-600 line-through ml-2">
                              {typeof change.old === 'number' ? change.old.toLocaleString() : change.old}
                            </span>
                            <span className="mx-2">→</span>
                            <span className="text-green-600 font-bold">
                              {typeof change.new === 'number' ? change.new.toLocaleString() : change.new}
                            </span>
                            {typeof change.new === 'number' && <span> FCFA</span>}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <History size={48} className="mx-auto mb-4 opacity-50" />
                <p>Aucune modification effectuée sur ce versement</p>
                <p className="text-sm mt-2">Le versement est dans son état d'origine</p>
              </div>
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

export default Payments;
