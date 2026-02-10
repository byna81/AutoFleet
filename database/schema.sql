-- ========================================
-- AutoFleet - Script de création de base de données
-- Version: 1.0.0
-- Date: Février 2025
-- ========================================

-- Créer la base de données
CREATE DATABASE autofleet
    WITH 
    OWNER = autofleet_user
    ENCODING = 'UTF8'
    LC_COLLATE = 'fr_FR.UTF-8'
    LC_CTYPE = 'fr_FR.UTF-8'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;

-- Se connecter à la base de données
\c autofleet;

-- Activer l'extension pour UUID si nécessaire
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========================================
-- TABLE 1: users (Utilisateurs)
-- ========================================
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('Administrateur', 'Gestionnaire')),
    email VARCHAR(100),
    phone VARCHAR(20),
    avatar VARCHAR(10) DEFAULT '👤',
    permissions TEXT[] DEFAULT ARRAY[]::TEXT[],
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_active ON users(is_active);

-- ========================================
-- TABLE 2: drivers (Chauffeurs)
-- ========================================
CREATE TABLE drivers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address TEXT,
    email VARCHAR(100),
    license_number VARCHAR(50) NOT NULL,
    license_expiry DATE NOT NULL,
    photo_url TEXT,
    cin VARCHAR(20) NOT NULL UNIQUE,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'warning')),
    rest_day VARCHAR(20),
    join_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(id)
);

CREATE INDEX idx_drivers_status ON drivers(status);
CREATE INDEX idx_drivers_name ON drivers(name);
CREATE INDEX idx_drivers_license_expiry ON drivers(license_expiry);

-- ========================================
-- TABLE 3: vehicles (Véhicules)
-- ========================================
CREATE TABLE vehicles (
    id VARCHAR(20) PRIMARY KEY,
    brand VARCHAR(100) NOT NULL,
    year INTEGER NOT NULL,
    color VARCHAR(50),
    chassis_number VARCHAR(50) UNIQUE NOT NULL,
    mileage INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'operational' CHECK (status IN ('operational', 'maintenance', 'out_of_service')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(id)
);

CREATE INDEX idx_vehicles_status ON vehicles(status);
CREATE INDEX idx_vehicles_brand ON vehicles(brand);

-- ========================================
-- TABLE 4: contracts (Contrats)
-- ========================================
CREATE TABLE contracts (
    id SERIAL PRIMARY KEY,
    driver_id INTEGER REFERENCES drivers(id) ON DELETE CASCADE,
    vehicle_id VARCHAR(20) REFERENCES vehicles(id),
    type VARCHAR(20) NOT NULL CHECK (type IN ('LAO', 'Location')),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    daily_amount DECIMAL(10, 2) NOT NULL,
    deposit DECIMAL(10, 2) NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'terminated')),
    rest_day VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(id)
);

CREATE INDEX idx_contracts_driver ON contracts(driver_id);
CREATE INDEX idx_contracts_vehicle ON contracts(vehicle_id);
CREATE INDEX idx_contracts_status ON contracts(status);
CREATE INDEX idx_contracts_type ON contracts(type);

-- ========================================
-- TABLE 5: payments (Versements)
-- ========================================
CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    driver_id INTEGER REFERENCES drivers(id) ON DELETE CASCADE,
    contract_id INTEGER REFERENCES contracts(id) ON DELETE CASCADE,
    payment_date DATE NOT NULL,
    payment_time TIME NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'paid' CHECK (status IN ('paid', 'late', 'pending')),
    days_late INTEGER DEFAULT 0,
    notes TEXT,
    recorded_by INTEGER REFERENCES users(id) NOT NULL,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_modified_by INTEGER REFERENCES users(id),
    last_modified_at TIMESTAMP
);

CREATE INDEX idx_payments_date ON payments(payment_date DESC);
CREATE INDEX idx_payments_driver ON payments(driver_id);
CREATE INDEX idx_payments_contract ON payments(contract_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_recorded_by ON payments(recorded_by);

-- ========================================
-- TABLE 6: payment_modifications (Historique)
-- ========================================
CREATE TABLE payment_modifications (
    id SERIAL PRIMARY KEY,
    payment_id INTEGER REFERENCES payments(id) ON DELETE CASCADE,
    modified_by INTEGER REFERENCES users(id) NOT NULL,
    modified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modification_reason TEXT NOT NULL,
    changes JSONB NOT NULL
);

CREATE INDEX idx_payment_modifications_payment ON payment_modifications(payment_id);
CREATE INDEX idx_payment_modifications_date ON payment_modifications(modified_at DESC);

-- ========================================
-- TABLE 7: maintenance_schedule (Planning)
-- ========================================
CREATE TABLE maintenance_schedule (
    id SERIAL PRIMARY KEY,
    vehicle_id VARCHAR(20) REFERENCES vehicles(id) ON DELETE CASCADE,
    maintenance_type VARCHAR(100) NOT NULL,
    last_date DATE,
    next_date DATE NOT NULL,
    last_mileage INTEGER,
    next_mileage INTEGER,
    status VARCHAR(20) DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'urgent', 'overdue', 'in_progress', 'completed')),
    days_until INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(id)
);

CREATE INDEX idx_maintenance_vehicle ON maintenance_schedule(vehicle_id);
CREATE INDEX idx_maintenance_status ON maintenance_schedule(status);
CREATE INDEX idx_maintenance_next_date ON maintenance_schedule(next_date);

-- ========================================
-- TABLE 8: activity_log (Journal d'activité)
-- ========================================
CREATE TABLE activity_log (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) NOT NULL,
    user_name VARCHAR(100) NOT NULL,
    user_avatar VARCHAR(10),
    action VARCHAR(100) NOT NULL,
    details TEXT,
    category VARCHAR(50) NOT NULL CHECK (category IN ('payment', 'driver', 'contract', 'vehicle', 'maintenance', 'alert', 'user', 'auth', 'report')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_activity_user ON activity_log(user_id);
CREATE INDEX idx_activity_date ON activity_log(created_at DESC);
CREATE INDEX idx_activity_category ON activity_log(category);

-- ========================================
-- TRIGGERS
-- ========================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_drivers_updated_at BEFORE UPDATE ON drivers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vehicles_updated_at BEFORE UPDATE ON vehicles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contracts_updated_at BEFORE UPDATE ON contracts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_maintenance_updated_at BEFORE UPDATE ON maintenance_schedule
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- PERMISSIONS
-- ========================================

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO autofleet_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO autofleet_user;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO autofleet_user;

-- ========================================
-- Message de confirmation
-- ========================================

DO $$
BEGIN
    RAISE NOTICE '✅ Base de données AutoFleet créée avec succès!';
    RAISE NOTICE '📊 8 tables créées';
    RAISE NOTICE '🚗 Prêt pour la production';
END $$;
```

4. **Message de commit** :
```
   Ajout schéma base de données
