// OwnerPayments.jsx - Gestion des paiements aux propriétaires particuliers
import React, { useState } from 'react';
import { DollarSign, CheckCircle, Clock, Calendar } from 'lucide-react';

const OwnerPayments = ({ payments, ownerPayments, setOwnerPayments, currentUser, managementContracts, contracts }) => {
  const [showPaymentModal, setShowPaymentModal] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentNotes, setPaymentNotes] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(2); // Février
  const [selectedYear, setSelectedYear] = useState(2025);

  // Calculer automatiquement les paiements dus pour un mois donné
  const calculateMonthlyPayments = () => {
    const calculated = [];
    
    managementContracts.forEach(mgmtContract => {
      // Filtrer les versements pour ce véhicule ce mois-ci
      const monthKey = `${selectedYear}-${selectedMonth.toString().padStart(2, '0')}`;
      const vehiclePayments = payments.filter(p => {
        const contract = contracts.find(c => c.id === p.contractId);
        return contract?.vehicleId === mgmtContract.vehicleId && p.date.startsWith(monthKey);
      });

      if (vehiclePayments.length > 0) {
        const numberOfDays = vehiclePayments.length;
        const ownerShare = numberOfDays * mgmtContract.ownerDailyShare;
        const companyShare = numberOfDays * mgmtContract.companyDailyShare;
        const totalCollected = numberOfDays * mgmtContract.driverDailyPayment;

        // Vérifier si déjà payé
        const existingPayment = ownerPayments.find(
          op => op.vehicleId === mgmtContract.vehicleId && 
                op.month === selectedMonth && 
                op.year === selectedYear
        );

        calculated.push({
          id: existingPayment?.id || `${mgmtContract.id}-${selectedMonth}-${selectedYear}`,
          managementContractId: mgmtContract.id,
          vehicleId: mgmtContract.vehicleId,
          ownerName: mgmtContract.ownerName,
          month: selectedMonth,
          year: selectedYear,
          numberOfDays,
          dailyRate: mgmtContract.ownerDailyShare,
          ownerShare,
          companyShare,
          totalCollected,
          status: existingPayment?.status || 'unpaid',
          paidAt: existingPayment?.paidAt,
          paidBy: existingPayment?.paidBy,
          paidByName: existingPayment?.paidByName,
          paymentMethod: existingPayment?.paymentMethod,
          paymentNotes: existingPayment?.paymentNotes
        });
      }
    });

    return calculated;
  };

  const monthlyPayments = calculateMonthlyPayments();

  const handleMarkAsPaid = () => {
    if (!paymentMethod) {
      alert('⚠️ Veuillez sélectionner une méthode de paiement');
      return;
    }

    const updatedPayments = ownerPayments.map(op => {
      if (op.id === showPaymentModal.id) {
        return {
          ...op,
          status: 'paid',
          paidAt: new Date().toISOString(),
          paidBy: currentUser.id,
          paidByName: currentUser.name,
          paymentMethod,
          paymentNotes
        };
      }
      return op;
    });

    // Si le paiement n'existe pas encore dans ownerPayments, l'ajouter
    const paymentExists = ownerPayments.find(op => op.id === showPaymentModal.id);
    if (!paymentExists) {
      updatedPayments.push({
        ...showPaymentModal,
        status: 'paid',
        paidAt: new Date().toISOString(),
        paidBy: currentUser.id,
        paidByName: currentUser.name,
        paymentMethod,
        paymentNotes
      });
    }

    setOwnerPayments(updatedPayments);

    alert(
      `✅ Paiement marqué comme effectué!\n\n` +
      `Propriétaire: ${showPaymentModal.ownerName}\n` +
      `Véhicule: ${showPaymentModal.vehicleId}\n` +
      `Montant: ${showPaymentModal.ownerShare.toLocaleString()} FCFA\n` +
      `Méthode: ${paymentMethod}\n` +
      `Par: ${currentUser.name}\n` +
      `Date: ${new Date().toLocaleDateString('fr-FR')}`
    );

    setShowPaymentModal(null);
    setPaymentMethod('');
    setPaymentNotes('');
  };

  const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">💵 Paiements aux propriétaires</h1>
        
        <div className="flex gap-3">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            className="px-4 py-2 border rounded-lg"
          >
            {monthNames.map((month, idx) => (
              <option key={idx} value={idx + 1}>{month}</option>
            ))}
          </select>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="2024">2024</option>
            <option value="2025">2025</option>
            <option value="2026">2026</option>
          </select>
        </div>
      </div>

      {/* Résumé global */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="text-green-600" size={32} />
            <h3 className="font-bold text-green-900">Total à payer</h3>
          </div>
          <p className="text-3xl font-bold text-green-700">
            {monthlyPayments
              .filter(mp => mp.status === 'unpaid')
              .reduce((sum, mp) => sum + mp.ownerShare, 0)
              .toLocaleString()} FCFA
          </p>
          <p className="text-sm text-green-600 mt-1">
            {monthlyPayments.filter(mp => mp.status === 'unpaid').length} paiement(s) en attente
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="text-blue-600" size={32} />
            <h3 className="font-bold text-blue-900">Déjà payé</h3>
          </div>
          <p className="text-3xl font-bold text-blue-700">
            {monthlyPayments
              .filter(mp => mp.status === 'paid')
              .reduce((sum, mp) => sum + mp.ownerShare, 0)
              .toLocaleString()} FCFA
          </p>
          <p className="text-sm text-blue-600 mt-1">
            {monthlyPayments.filter(mp => mp.status === 'paid').length} paiement(s) effectué(s)
          </p>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="text-purple-600" size={32} />
            <h3 className="font-bold text-purple-900">Période</h3>
          </div>
          <p className="text-3xl font-bold text-purple-700">
            {monthNames[selectedMonth - 1]}
          </p>
          <p className="text-sm text-purple-600 mt-1">{selectedYear}</p>
        </div>
      </div>

      {/* Liste des paiements */}
      <div className="grid grid-cols-1 gap-6">
        {monthlyPayments.length > 0 ? (
          monthlyPayments.map(monthlyPayment => (
            <div 
              key={monthlyPayment.id} 
              className={`rounded-xl shadow-lg p-6 border-l-4 ${
                monthlyPayment.status === 'paid' 
                  ? 'bg-green-50 border-green-500' 
                  : 'bg-yellow-50 border-yellow-500'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-xl flex items-center gap-2">
                    {monthlyPayment.ownerName}
                    <span className="text-sm font-normal text-gray-600">
                      ({monthlyPayment.vehicleId})
                    </span>
                  </h3>
                  <p className="text-sm text-gray-600">
                    {monthNames[monthlyPayment.month - 1]} {monthlyPayment.year}
                  </p>
                </div>
                <span className={`px-4 py-2 rounded-full font-bold ${
                  monthlyPayment.status === 'paid'
                    ? 'bg-green-200 text-green-800'
                    : 'bg-yellow-200 text-yellow-800'
                }`}>
                  {monthlyPayment.status === 'paid' ? '✅ Payé' : '⏳ À payer'}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="bg-white p-3 rounded border">
                  <p className="text-xs text-gray-600">Jours travaillés</p>
                  <p className="text-2xl font-bold">{monthlyPayment.numberOfDays}</p>
                </div>
                <div className="bg-white p-3 rounded border">
                  <p className="text-xs text-gray-600">Taux journalier</p>
                  <p className="text-2xl font-bold">
                    {monthlyPayment.dailyRate.toLocaleString()}
                  </p>
                </div>
                <div className="bg-white p-3 rounded border">
                  <p className="text-xs text-gray-600">Total collecté</p>
                  <p className="text-2xl font-bold">
                    {monthlyPayment.totalCollected.toLocaleString()}
                  </p>
                </div>
                <div className="bg-green-100 p-3 rounded border border-green-300">
                  <p className="text-xs text-green-700">Part propriétaire</p>
                  <p className="text-2xl font-bold text-green-800">
                    {monthlyPayment.ownerShare.toLocaleString()}
                  </p>
                </div>
              </div>

              {monthlyPayment.status === 'unpaid' ? (
                <button
                  onClick={() => setShowPaymentModal(monthlyPayment)}
                  className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700"
                >
                  💰 Marquer comme payé
                </button>
              ) : (
                <div className="bg-white p-4 rounded border border-green-300">
                  <p className="text-sm font-bold text-green-800 mb-2">
                    ✅ Paiement effectué
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
                    <p><strong>Par:</strong> {monthlyPayment.paidByName}</p>
                    <p><strong>Date:</strong> {new Date(monthlyPayment.paidAt).toLocaleDateString('fr-FR')}</p>
                    <p><strong>Méthode:</strong> {monthlyPayment.paymentMethod}</p>
                    {monthlyPayment.paymentNotes && (
                      <p className="col-span-2">
                        <strong>Notes:</strong> {monthlyPayment.paymentNotes}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">💵</div>
            <p className="text-gray-600">
              Aucun versement enregistré pour {monthNames[selectedMonth - 1]} {selectedYear}
            </p>
          </div>
        )}
      </div>

      {/* Modal Marquer comme payé */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-6">💰 Confirmer le paiement</h2>
            
            <div className="mb-6 p-4 bg-green-50 rounded border border-green-200">
              <p className="font-bold text-lg">{showPaymentModal.ownerName}</p>
              <p className="text-sm text-gray-600">
                {showPaymentModal.vehicleId} • {monthNames[showPaymentModal.month - 1]} {showPaymentModal.year}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {showPaymentModal.numberOfDays} jours × {showPaymentModal.dailyRate.toLocaleString()} FCFA
              </p>
              <p className="text-3xl font-bold text-green-700 mt-3">
                {showPaymentModal.ownerShare.toLocaleString()} FCFA
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Méthode de paiement <span className="text-red-500">*</span>
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
                required
              >
                <option value="">Sélectionner</option>
                <option value="Virement bancaire">Virement bancaire</option>
                <option value="Wave">Wave</option>
                <option value="Orange Money">Orange Money</option>
                <option value="Free Money">Free Money</option>
                <option value="Espèces">Espèces</option>
                <option value="Chèque">Chèque</option>
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Notes (optionnel)
              </label>
              <textarea
                value={paymentNotes}
                onChange={(e) => setPaymentNotes(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
                rows="3"
                placeholder="Numéro de transaction, référence bancaire, etc."
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleMarkAsPaid}
                className="flex-1 bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700"
              >
                ✅ Confirmer le paiement
              </button>
              <button
                onClick={() => {
                  setShowPaymentModal(null);
                  setPaymentMethod('');
                  setPaymentNotes('');
                }}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerPayments;
