// routes/auth.js
// Routes d'authentification

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { query } = require('../config/database');

// POST /api/auth/login - Connexion
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        error: 'Nom d\'utilisateur et mot de passe requis'
      });
    }

    const result = await query(
      'SELECT * FROM users WHERE username = $1 AND is_active = true',
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        error: 'Identifiants invalides'
      });
    }

    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password_hash);

    if (!validPassword) {
      return res.status(401).json({
        error: 'Identifiants invalides'
      });
    }

    const token = jwt.sign(
      {
        userId: user.id,
        username: user.username,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRATION || '24h' }
    );

    await query(
      `INSERT INTO activity_log (user_id, user_name, user_avatar, action, details, category)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [user.id, user.name, user.avatar, 'Connexion', 'Connexion réussie au système', 'auth']
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        permissions: user.permissions
      }
    });

  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    res.status(500).json({
      error: 'Erreur lors de la connexion'
    });
  }
});

// POST /api/auth/logout - Déconnexion
router.post('/logout', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      const userResult = await query(
        'SELECT name, avatar FROM users WHERE id = $1',
        [decoded.userId]
      );

      if (userResult.rows.length > 0) {
        const user = userResult.rows[0];
        await query(
          `INSERT INTO activity_log (user_id, user_name, user_avatar, action, details, category)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [decoded.userId, user.name, user.avatar, 'Déconnexion', 'Déconnexion du système', 'auth']
        );
      }
    }

    res.json({ message: 'Déconnexion réussie' });

  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error);
    res.json({ message: 'Déconnexion réussie' });
  }
});

// GET /api/auth/me - Informations utilisateur
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        error: 'Token manquant'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const result = await query(
      'SELECT id, username, name, role, email, phone, avatar, permissions FROM users WHERE id = $1 AND is_active = true',
      [decoded.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Utilisateur non trouvé'
      });
    }

    res.json(result.rows[0]);

  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Token invalide ou expiré'
      });
    }

    console.error('Erreur lors de la récupération de l\'utilisateur:', error);
    res.status(500).json({
      error: 'Erreur serveur'
    });
  }
});

module.exports = router;
```

4. **Message de commit** :
```
   Ajout routes authentification
