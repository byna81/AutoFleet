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

-- Index pour optimiser les recherches
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

-- Index
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

-- Index
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
    created_by INTEGER REFERENCES users(id),
    CONSTRAINT fk_driver FOREIGN KEY (driver_id) REFERENCES drivers(id),
    CONSTRAINT fk_vehicle FOREIGN KEY (vehicle_id) REFERENCES vehicles(id)
);

-- Index
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
    last_modified_at TIMESTAMP,
    CONSTRAINT fk_payment_driver FOREIGN KEY (driver_id) REFERENCES drivers(id),
    CONSTRAINT fk_payment_contract FOREIGN KEY (contract_id) REFERENCES contracts(id),
    CONSTRAINT fk_payment_recorded_by FOREIGN KEY (recorded_by) REFERENCES users(id)
);

-- Index pour optimiser les recherches
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
    changes JSONB NOT NULL,
    CONSTRAINT fk_modification_payment FOREIGN KEY (payment_id) REFERENCES payments(id),
    CONSTRAINT fk_modification_user FOREIGN KEY (modified_by) REFERENCES users(id)
);

-- Index
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
    created_by INTEGER REFERENCES users(id),
    CONSTRAINT fk_maintenance_vehicle FOREIGN KEY (vehicle_id) REFERENCES vehicles(id)
);

-- Index
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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_activity_user FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Index
CREATE INDEX idx_activity_user ON activity_log(user_id);
CREATE INDEX idx_activity_date ON activity_log(created_at DESC);
CREATE INDEX idx_activity_category ON activity_log(category);

-- ========================================
-- TRIGGERS pour updated_at automatique
-- ========================================

-- Fonction pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Appliquer le trigger sur toutes les tables concernées
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
-- DONNÉES INITIALES
-- ========================================

-- Créer l'administrateur par défaut
-- Note: Le mot de passe 'admin123' doit être hashé avec bcrypt
-- Hash bcrypt de 'admin123': $2b$10$rN6z3YYs5YxFXxJ0KQXqoeTGxGHYLKQvBdvbZXK5aQjKXvJ1YQk3G

INSERT INTO users (username, password_hash, name, role, email, phone, avatar, permissions, created_by)
VALUES 
('admin', '$2b$10$rN6z3YYs5YxFXxJ0KQXqoeTGxGHYLKQvBdvbZXK5aQjKXvJ1YQk3G', 'Amadou Seck', 'Administrateur', 'admin@autofleet.sn', '+221 77 999 8888', '👨🏿‍💼', ARRAY['all'], NULL),
('fatou', '$2b$10$rN6z3YYs5YxFXxJ0KQXqoeTGxGHYLKQvBdvbZXK5aQjKXvJ1YQk3G', 'Fatou Diop', 'Gestionnaire', 'fatou.diop@autofleet.sn', '+221 76 888 7777', '👩🏿‍💼', ARRAY['drivers', 'contracts', 'payments', 'vehicles', 'maintenance', 'alerts'], 1);

-- Données de démonstration (optionnel)

-- Chauffeurs
INSERT INTO drivers (name, phone, address, email, license_number, license_expiry, photo_url, cin, status, rest_day, created_by)
VALUES 
('Mamadou Diallo', '+221 77 123 4567', 'Plateau, Dakar', 'mamadou.diallo@email.com', 'B123456', '2025-08-15', '👨🏿', '1234567890123', 'active', 'Lundi', 1),
('Ibrahima Sarr', '+221 76 234 5678', 'Almadies, Dakar', 'ibrahima.sarr@email.com', 'B234567', '2025-06-20', '👨🏿‍🦱', '2345678901234', 'active', 'Dimanche', 1),
('Moussa Ndiaye', '+221 78 345 6789', 'Médina, Dakar', 'moussa.ndiaye@email.com', 'B345678', '2025-03-10', '👨🏿‍🦲', '3456789012345', 'warning', 'Mardi', 1),
('Cheikh Ba', '+221 77 456 7890', 'Ouakam, Dakar', 'cheikh.ba@email.com', 'B456789', '2026-01-30', '👨🏿', '4567890123456', 'active', 'Mercredi', 1);

-- Véhicules
INSERT INTO vehicles (id, brand, year, color, chassis_number, mileage, status, created_by)
VALUES 
('DK-123-AB', 'Toyota Corolla', 2020, 'Blanc', 'JT2AE09A0N0123456', 145000, 'operational', 1),
('DK-456-CD', 'Hyundai Accent', 2019, 'Gris', 'KMHCT41BABZ123456', 178000, 'operational', 1),
('DK-789-EF', 'Renault Symbol', 2021, 'Noir', 'VF1LB0B0H56123456', 98000, 'maintenance', 1),
('DK-012-GH', 'Kia Picanto', 2022, 'Rouge', 'KNAPC411CC6123456', 67000, 'operational', 1);

-- Contrats
INSERT INTO contracts (driver_id, vehicle_id, type, start_date, end_date, daily_amount, deposit, total_amount, rest_day, created_by)
VALUES 
(1, 'DK-123-AB', 'LAO', '2024-01-15', '2026-01-15', 15000.00, 500000.00, 10950000.00, 'Lundi', 1),
(2, 'DK-456-CD', 'Location', '2024-02-20', '2025-02-20', 12000.00, 300000.00, 4380000.00, 'Dimanche', 1),
(3, 'DK-789-EF', 'Location', '2023-11-10', '2024-11-10', 10000.00, 250000.00, 3650000.00, 'Mardi', 1),
(4, 'DK-012-GH', 'LAO', '2024-03-05', '2026-03-05', 16000.00, 600000.00, 11680000.00, 'Mercredi', 1);

-- ========================================
-- VUES UTILES
-- ========================================

-- Vue pour obtenir les paiements avec informations complètes
CREATE OR REPLACE VIEW v_payments_full AS
SELECT 
    p.id,
    p.payment_date,
    p.payment_time,
    p.amount,
    p.status,
    p.days_late,
    p.notes,
    p.recorded_at,
    d.id as driver_id,
    d.name as driver_name,
    d.phone as driver_phone,
    d.photo_url as driver_photo,
    c.id as contract_id,
    c.type as contract_type,
    c.daily_amount as contract_daily_amount,
    v.id as vehicle_id,
    v.brand as vehicle_brand,
    u1.name as recorded_by_name,
    u1.avatar as recorded_by_avatar,
    u2.name as modified_by_name,
    p.last_modified_at,
    (SELECT COUNT(*) FROM payment_modifications pm WHERE pm.payment_id = p.id) as modification_count
FROM payments p
JOIN drivers d ON p.driver_id = d.id
JOIN contracts c ON p.contract_id = c.id
JOIN vehicles v ON c.vehicle_id = v.id
JOIN users u1 ON p.recorded_by = u1.id
LEFT JOIN users u2 ON p.last_modified_by = u2.id
ORDER BY p.payment_date DESC, p.payment_time DESC;

-- Vue pour les alertes de maintenance
CREATE OR REPLACE VIEW v_maintenance_alerts AS
SELECT 
    m.*,
    v.brand as vehicle_brand,
    v.color as vehicle_color,
    v.mileage as current_mileage,
    CASE 
        WHEN m.status = 'overdue' THEN 'critical'
        WHEN m.days_until <= 7 THEN 'urgent'
        WHEN m.days_until <= 30 THEN 'warning'
        ELSE 'ok'
    END as alert_level
FROM maintenance_schedule m
JOIN vehicles v ON m.vehicle_id = v.id
WHERE m.status != 'completed'
ORDER BY m.days_until ASC;

-- Vue pour les contrats actifs avec détails
CREATE OR REPLACE VIEW v_contracts_active AS
SELECT 
    c.*,
    d.name as driver_name,
    d.phone as driver_phone,
    d.photo_url as driver_photo,
    v.brand as vehicle_brand,
    v.id as vehicle_plate,
    COALESCE(SUM(p.amount), 0) as total_paid,
    ROUND((COALESCE(SUM(p.amount), 0) / c.total_amount * 100)::numeric, 2) as completion_percentage
FROM contracts c
JOIN drivers d ON c.driver_id = d.id
JOIN vehicles v ON c.vehicle_id = v.id
LEFT JOIN payments p ON p.contract_id = c.id AND p.status = 'paid'
WHERE c.status = 'active'
GROUP BY c.id, d.name, d.phone, d.photo_url, v.brand, v.id
ORDER BY c.start_date DESC;

-- ========================================
-- FONCTIONS UTILES
-- ========================================

-- Fonction pour calculer les jours de retard automatiquement
CREATE OR REPLACE FUNCTION calculate_days_late()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status IN ('late', 'pending') THEN
        NEW.days_late := CURRENT_DATE - NEW.payment_date;
    ELSE
        NEW.days_late := 0;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER calculate_payment_days_late
BEFORE INSERT OR UPDATE ON payments
FOR EACH ROW EXECUTE FUNCTION calculate_days_late();

-- Fonction pour mettre à jour les jours jusqu'à maintenance
CREATE OR REPLACE FUNCTION update_maintenance_days_until()
RETURNS TRIGGER AS $$
BEGIN
    NEW.days_until := NEW.next_date - CURRENT_DATE;
    
    -- Mettre à jour le statut automatiquement
    IF NEW.days_until < 0 THEN
        NEW.status := 'overdue';
    ELSIF NEW.days_until <= 7 THEN
        NEW.status := 'urgent';
    ELSIF NEW.status != 'in_progress' AND NEW.status != 'completed' THEN
        NEW.status := 'upcoming';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_maintenance_status
BEFORE INSERT OR UPDATE ON maintenance_schedule
FOR EACH ROW EXECUTE FUNCTION update_maintenance_days_until();

-- ========================================
-- PERMISSIONS
-- ========================================

-- Accorder les permissions à l'utilisateur autofleet_user
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO autofleet_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO autofleet_user;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO autofleet_user;

-- ========================================
-- FIN DU SCRIPT
-- ========================================

-- Vérifier les tables créées
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Afficher un message de succès
DO $$
BEGIN
    RAISE NOTICE '✅ Base de données AutoFleet créée avec succès!';
    RAISE NOTICE '📊 8 tables créées';
    RAISE NOTICE '👥 2 utilisateurs initiaux créés';
    RAISE NOTICE '🚗 Prêt pour la production';
END $$;