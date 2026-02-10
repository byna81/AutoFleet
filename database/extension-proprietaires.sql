-- ========================================
-- AutoFleet - Extension: Gestion des propriétaires
-- Ajout de la fonctionnalité de gestion déléguée
-- ========================================

-- ========================================
-- TABLE: vehicle_owners (Propriétaires de véhicules)
-- ========================================
CREATE TABLE vehicle_owners (
    id SERIAL PRIMARY KEY,
    type VARCHAR(20) NOT NULL CHECK (type IN ('Société', 'Particulier')),
    company_name VARCHAR(200),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    cin VARCHAR(20) UNIQUE,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(100),
    address TEXT,
    bank_name VARCHAR(100),
    bank_account VARCHAR(50),
    mobile_money VARCHAR(20),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(id)
);

CREATE INDEX idx_owners_type ON vehicle_owners(type);
CREATE INDEX idx_owners_status ON vehicle_owners(status);
CREATE INDEX idx_owners_phone ON vehicle_owners(phone);

-- ========================================
-- TABLE: management_contracts (Contrats de gestion)
-- ========================================
CREATE TABLE management_contracts (
    id SERIAL PRIMARY KEY,
    vehicle_id VARCHAR(20) REFERENCES vehicles(id) ON DELETE CASCADE,
    owner_id INTEGER REFERENCES vehicle_owners(id) ON DELETE CASCADE,
    driver_daily_payment DECIMAL(10, 2) NOT NULL,
    owner_daily_share DECIMAL(10, 2) NOT NULL,
    company_daily_share DECIMAL(10, 2) NOT NULL,
    CONSTRAINT check_shares_total CHECK (owner_daily_share + company_daily_share <= driver_daily_payment),
    start_date DATE NOT NULL,
    end_date DATE,
    payment_frequency VARCHAR(20) DEFAULT 'mensuel' CHECK (payment_frequency IN ('hebdomadaire', 'bi-mensuel', 'mensuel')),
    payment_day INTEGER,
    maintenance_responsibility VARCHAR(20) DEFAULT 'société' CHECK (maintenance_responsibility IN ('propriétaire', 'société', 'partagé')),
    insurance_responsibility VARCHAR(20) DEFAULT 'propriétaire' CHECK (insurance_responsibility IN ('propriétaire', 'société')),
    security_deposit DECIMAL(10, 2) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'terminated', 'expired')),
    special_conditions TEXT,
    termination_notice_days INTEGER DEFAULT 30,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(id)
);

CREATE INDEX idx_mgmt_contracts_vehicle ON management_contracts(vehicle_id);
CREATE INDEX idx_mgmt_contracts_owner ON management_contracts(owner_id);
CREATE INDEX idx_mgmt_contracts_status ON management_contracts(status);
CREATE INDEX idx_mgmt_contracts_payment_day ON management_contracts(payment_day);

-- ========================================
-- TABLE: owner_payments (Paiements aux propriétaires)
-- ========================================
CREATE TABLE owner_payments (
    id SERIAL PRIMARY KEY,
    management_contract_id INTEGER REFERENCES management_contracts(id) ON DELETE CASCADE,
    owner_id INTEGER REFERENCES vehicle_owners(id) ON DELETE CASCADE,
    vehicle_id VARCHAR(20) REFERENCES vehicles(id),
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    total_driver_payments DECIMAL(10, 2) NOT NULL,
    owner_share DECIMAL(10, 2) NOT NULL,
    company_share DECIMAL(10, 2) NOT NULL,
    number_of_days INTEGER NOT NULL,
    daily_rate DECIMAL(10, 2) NOT NULL,
    deductions DECIMAL(10, 2) DEFAULT 0,
    deduction_reason TEXT,
    net_amount DECIMAL(10, 2) NOT NULL,
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'partial', 'cancelled')),
    payment_date DATE,
    payment_method VARCHAR(50),
    payment_reference VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(id),
    paid_at TIMESTAMP,
    paid_by INTEGER REFERENCES users(id),
    notes TEXT
);

CREATE INDEX idx_owner_payments_contract ON owner_payments(management_contract_id);
CREATE INDEX idx_owner_payments_owner ON owner_payments(owner_id);
CREATE INDEX idx_owner_payments_status ON owner_payments(payment_status);
CREATE INDEX idx_owner_payments_period ON owner_payments(period_start, period_end);
CREATE INDEX idx_owner_payments_date ON owner_payments(payment_date);

-- ========================================
-- Modifier la table vehicles
-- ========================================
ALTER TABLE vehicles 
ADD COLUMN owner_id INTEGER REFERENCES vehicle_owners(id),
ADD COLUMN ownership_type VARCHAR(20) DEFAULT 'Société' CHECK (ownership_type IN ('Société', 'Particulier'));

CREATE INDEX idx_vehicles_owner ON vehicles(owner_id);
CREATE INDEX idx_vehicles_ownership ON vehicles(ownership_type);

-- ========================================
-- TRIGGERS
-- ========================================

CREATE TRIGGER update_vehicle_owners_updated_at 
BEFORE UPDATE ON vehicle_owners
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_management_contracts_updated_at 
BEFORE UPDATE ON management_contracts
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- PERMISSIONS
-- ========================================

GRANT ALL PRIVILEGES ON vehicle_owners TO autofleet_user;
GRANT ALL PRIVILEGES ON management_contracts TO autofleet_user;
GRANT ALL PRIVILEGES ON owner_payments TO autofleet_user;
GRANT ALL PRIVILEGES ON SEQUENCE vehicle_owners_id_seq TO autofleet_user;
GRANT ALL PRIVILEGES ON SEQUENCE management_contracts_id_seq TO autofleet_user;
GRANT ALL PRIVILEGES ON SEQUENCE owner_payments_id_seq TO autofleet_user;

-- ========================================
-- Message de confirmation
-- ========================================

DO $$
BEGIN
    RAISE NOTICE '✅ Extension "Gestion des propriétaires" installée avec succès!';
    RAISE NOTICE '📊 3 nouvelles tables créées';
    RAISE NOTICE '👥 Propriétaires particuliers et contrats de gestion ajoutés';
    RAISE NOTICE '💰 Système de répartition des paiements opérationnel';
END $$;
```

4. **Message de commit** :
```
   Ajout extension propriétaires
