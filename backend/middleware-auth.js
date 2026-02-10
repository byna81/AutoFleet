// middleware/auth.js
// Middleware d'authentification et d'autorisation

const jwt = require('jsonwebtoken');
const { query } = require('../config/database');

// ========================================
// Middleware pour vérifier le token JWT
// ========================================
const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        error: 'Authentification requise'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Vérifier que l'utilisateur existe toujours et est actif
    const result = await query(
      'SELECT id, username, name, role, permissions FROM users WHERE id = $1 AND is_active = true',
      [decoded.userId]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        error: 'Utilisateur non trouvé ou inactif'
      });
    }

    // Ajouter les infos utilisateur à la requête
    req.user = result.rows[0];
    next();

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: 'Token invalide'
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Token expiré'
      });
    }

    console.error('Erreur d\'authentification:', error);
    res.status(500).json({
      error: 'Erreur serveur'
    });
  }
};

// ========================================
// Middleware pour vérifier les permissions
// ========================================
const authorize = (...allowedPermissions) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Authentification requise'
      });
    }

    // Les administrateurs ont accès à tout
    if (req.user.permissions.includes('all')) {
      return next();
    }

    // Vérifier si l'utilisateur a au moins une des permissions requises
    const hasPermission = allowedPermissions.some(permission =>
      req.user.permissions.includes(permission)
    );

    if (!hasPermission) {
      return res.status(403).json({
        error: 'Permission refusée',
        required: allowedPermissions
      });
    }

    next();
  };
};

// ========================================
// Middleware pour les administrateurs uniquement
// ========================================
const adminOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      error: 'Authentification requise'
    });
  }

  if (req.user.role !== 'Administrateur') {
    return res.status(403).json({
      error: 'Accès réservé aux administrateurs'
    });
  }

  next();
};

module.exports = {
  authenticate,
  authorize,
  adminOnly
};