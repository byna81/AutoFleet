// routes/payments.js
// Routes pour la gestion des versements

const express = require('express');
const router = express.Router();
const { query, transaction } = require('../config/database');
const { authenticate, authorize } = require('../middleware/auth');

// Toutes les routes nécessitent une authentification
router.use(authenticate);

// ========================================
// GET /api/payments - Liste des versements
// ========================================
router.get('/', authorize('payments', 'view_payments'), async (req, res) => {
  try {
    const { startDate, endDate, driverId, status, limit = 100 } = req.query;

    let queryText = `
      SELECT * FROM v_payments_full
      WHERE 1=1
    `;
    const params = [];
    let paramCount = 1;

    if (startDate) {
      queryText += ` AND payment_date >= $${paramCount}`;
      params.push(startDate);
      paramCount++;
    }

    if (endDate) {
      queryText += ` AND payment_date <= $${paramCount}`;
      params.push(endDate);
      paramCount++;
    }

    if (driverId) {
      queryText += ` AND driver_id = $${paramCount}`;
      params.push(driverId);
      paramCount++;
    }

    if (status) {
      queryText += ` AND status = $${paramCount}`;
      params.push(status);
      paramCount++;
    }

    queryText += ` ORDER BY payment_date DESC, payment_time DESC LIMIT $${paramCount}`;
    params.push(limit);

    const result = await query(queryText, params);

    res.json({
      count: result.rows.length,
      payments: result.rows
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des paiements:', error);
    res.status(500).json({
      error: 'Erreur lors de la récupération des paiements'
    });
  }
});

// ========================================
// POST /api/payments - Créer un versement
// ========================================
router.post('/', authorize('payments'), async (req, res) => {
  try {
    const { driverId, contractId, amount, date, time, notes } = req.body;

    // Validation
    if (!driverId || !contractId || !amount || !date || !time) {
      return res.status(400).json({
        error: 'Données manquantes',
        required: ['driverId', 'contractId', 'amount', 'date', 'time']
      });
    }

    // Vérifier que le contrat existe et correspond au chauffeur
    const contractCheck = await query(
      'SELECT daily_amount FROM contracts WHERE id = $1 AND driver_id = $2 AND status = $3',
      [contractId, driverId, 'active']
    );

    if (contractCheck.rows.length === 0) {
      return res.status(404).json({
        error: 'Contrat non trouvé ou inactif'
      });
    }

    // Insérer le paiement
    const result = await query(
      `INSERT INTO payments 
       (driver_id, contract_id, payment_date, payment_time, amount, status, notes, recorded_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [driverId, contractId, date, time, amount, 'paid', notes || null, req.user.id]
    );

    const payment = result.rows[0];

    // Enregistrer dans le journal d'activité
    const driverResult = await query('SELECT name FROM drivers WHERE id = $1', [driverId]);
    const driverName = driverResult.rows[0]?.name || 'Chauffeur inconnu';

    await query(
      `INSERT INTO activity_log (user_id, user_name, user_avatar, action, details, category)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        req.user.id,
        req.user.name,
        req.user.avatar || '👤',
        'Paiement enregistré',
        `${driverName} - ${amount.toLocaleString()} FCFA`,
        'payment'
      ]
    );

    res.status(201).json({
      message: 'Paiement enregistré avec succès',
      payment
    });

  } catch (error) {
    console.error('Erreur lors de la création du paiement:', error);
    res.status(500).json({
      error: 'Erreur lors de la création du paiement'
    });
  }
});

// ========================================
// PUT /api/payments/:id - Modifier un versement
// ========================================
router.put('/:id', authorize('payments'), async (req, res) => {
  try {
    const { id } = req.params;
    const { driverId, amount, date, time, notes, modificationReason } = req.body;

    if (!modificationReason) {
      return res.status(400).json({
        error: 'Le motif de modification est requis'
      });
    }

    // Utiliser une transaction pour garantir la cohérence
    const result = await transaction(async (client) => {
      // Récupérer l'ancien paiement
      const oldPayment = await client.query(
        'SELECT * FROM payments WHERE id = $1',
        [id]
      );

      if (oldPayment.rows.length === 0) {
        throw new Error('Paiement non trouvé');
      }

      const old = oldPayment.rows[0];

      // Construire l'objet des changements
      const changes = {};

      if (driverId && driverId !== old.driver_id) {
        const oldDriver = await client.query('SELECT name FROM drivers WHERE id = $1', [old.driver_id]);
        const newDriver = await client.query('SELECT name FROM drivers WHERE id = $1', [driverId]);
        changes.driver = {
          old: oldDriver.rows[0]?.name,
          new: newDriver.rows[0]?.name
        };
      }

      if (amount && parseFloat(amount) !== parseFloat(old.amount)) {
        changes.amount = {
          old: parseFloat(old.amount),
          new: parseFloat(amount)
        };
      }

      if (date && date !== old.payment_date) {
        changes.date = {
          old: old.payment_date,
          new: date
        };
      }

      if (time && time !== old.payment_time) {
        changes.time = {
          old: old.payment_time,
          new: time
        };
      }

      if (notes !== old.notes) {
        changes.notes = {
          old: old.notes || 'Aucune',
          new: notes || 'Aucune'
        };
      }

      // Mettre à jour le paiement
      const updateResult = await client.query(
        `UPDATE payments 
         SET driver_id = COALESCE($1, driver_id),
             amount = COALESCE($2, amount),
             payment_date = COALESCE($3, payment_date),
             payment_time = COALESCE($4, payment_time),
             notes = COALESCE($5, notes),
             last_modified_by = $6,
             last_modified_at = CURRENT_TIMESTAMP
         WHERE id = $7
         RETURNING *`,
        [driverId, amount, date, time, notes, req.user.id, id]
      );

      // Enregistrer la modification dans l'historique
      await client.query(
        `INSERT INTO payment_modifications 
         (payment_id, modified_by, modification_reason, changes)
         VALUES ($1, $2, $3, $4)`,
        [id, req.user.id, modificationReason, JSON.stringify(changes)]
      );

      // Enregistrer dans le journal d'activité
      const driverResult = await client.query(
        'SELECT name FROM drivers WHERE id = $1',
        [updateResult.rows[0].driver_id]
      );

      await client.query(
        `INSERT INTO activity_log (user_id, user_name, user_avatar, action, details, category)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          req.user.id,
          req.user.name,
          req.user.avatar || '👤',
          'Paiement modifié',
          `${driverResult.rows[0]?.name} - Correction du versement`,
          'payment'
        ]
      );

      return updateResult.rows[0];
    });

    res.json({
      message: 'Paiement modifié avec succès',
      payment: result
    });

  } catch (error) {
    console.error('Erreur lors de la modification du paiement:', error);
    res.status(500).json({
      error: error.message || 'Erreur lors de la modification du paiement'
    });
  }
});

// ========================================
// GET /api/payments/:id/history - Historique
// ========================================
router.get('/:id/history', authorize('payments', 'view_payments'), async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      `SELECT 
         pm.*,
         u.name as modified_by_name,
         u.avatar as modified_by_avatar
       FROM payment_modifications pm
       JOIN users u ON pm.modified_by = u.id
       WHERE pm.payment_id = $1
       ORDER BY pm.modified_at DESC`,
      [id]
    );

    res.json({
      count: result.rows.length,
      modifications: result.rows
    });

  } catch (error) {
    console.error('Erreur lors de la récupération de l\'historique:', error);
    res.status(500).json({
      error: 'Erreur lors de la récupération de l\'historique'
    });
  }
});

// ========================================
// GET /api/payments/stats - Statistiques
// ========================================
router.get('/stats', authorize('payments', 'view_payments'), async (req, res) => {
  try {
    const stats = await query(`
      SELECT 
        COUNT(*) FILTER (WHERE payment_date = CURRENT_DATE AND status = 'paid') as today_payments,
        COUNT(*) FILTER (WHERE status IN ('late', 'pending')) as pending_payments,
        SUM(amount) FILTER (WHERE payment_date = CURRENT_DATE AND status = 'paid') as today_revenue,
        SUM(amount) FILTER (WHERE status = 'paid' AND payment_date >= DATE_TRUNC('month', CURRENT_DATE)) as monthly_revenue,
        COUNT(DISTINCT driver_id) FILTER (WHERE days_late >= 2) as critical_drivers
      FROM payments
    `);

    res.json(stats.rows[0]);

  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    res.status(500).json({
      error: 'Erreur lors de la récupération des statistiques'
    });
  }
});

module.exports = router;