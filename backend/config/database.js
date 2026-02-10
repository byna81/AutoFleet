// config/database.js
// Configuration de la connexion PostgreSQL

const { Pool } = require('pg');
require('dotenv').config();

// Configuration du pool de connexions
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'autofleet_user',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'autofleet',
  ssl: process.env.DB_SSL === 'true' ? {
    rejectUnauthorized: false
  } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Gestion des événements du pool
pool.on('connect', () => {
  console.log('✅ Connexion à la base de données PostgreSQL établie');
});

pool.on('error', (err) => {
  console.error('❌ Erreur inattendue avec le client PostgreSQL:', err);
  process.exit(-1);
});

// Fonction pour tester la connexion
const testConnection = async () => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    console.log('🕒 Heure du serveur DB:', result.rows[0].now);
    client.release();
    return true;
  } catch (error) {
    console.error('❌ Erreur de connexion à la base de données:', error.message);
    return false;
  }
};

// Fonction helper pour exécuter des requêtes
const query = async (text, params) => {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Requête exécutée', { text, duration, rows: result.rowCount });
    return result;
  } catch (error) {
    console.error('Erreur de requête:', error);
    throw error;
  }
};

// Fonction pour obtenir un client pour les transactions
const getClient = async () => {
  const client = await pool.connect();
  const query = client.query.bind(client);
  const release = client.release.bind(client);

  const timeout = setTimeout(() => {
    console.error('Un client a été extrait du pool pendant plus de 5 secondes!');
  }, 5000);

  client.release = () => {
    clearTimeout(timeout);
    client.release = release;
    return release();
  };

  return client;
};

// Fonction pour les transactions
const transaction = async (callback) => {
  const client = await getClient();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

module.exports = {
  pool,
  query,
  getClient,
  transaction,
  testConnection
};
```

5. **En bas**, message de commit :
```
   Ajout configuration base de données
