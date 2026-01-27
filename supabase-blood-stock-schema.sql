-- =====================================================
-- BLOOD STOCK MANAGEMENT SCHEMA FOR SUPABASE
-- =====================================================
-- This schema adds comprehensive blood stock tracking
-- with expiry management and real-time updates
-- =====================================================

-- =====================================================
-- 1. BLOOD UNITS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS blood_units (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  blood_bank_id UUID REFERENCES blood_banks(id) ON DELETE CASCADE NOT NULL,
  
  -- Blood Information
  blood_type VARCHAR(5) NOT NULL CHECK (blood_type IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
  component_type VARCHAR(50) DEFAULT 'Whole Blood' CHECK (component_type IN ('Whole Blood', 'Red Blood Cells', 'Platelets', 'Plasma', 'Cryoprecipitate')),
  
  -- Quantity
  units_available INTEGER NOT NULL DEFAULT 1 CHECK (units_available >= 0),
  initial_units INTEGER NOT NULL DEFAULT 1,
  
  -- Dates
  collection_date DATE NOT NULL,
  expiry_date DATE NOT NULL,
  
  -- Batch Information
  batch_id VARCHAR(100) NOT NULL,
  donor_id UUID REFERENCES donors(id) ON DELETE SET NULL,
  
  -- Storage Information
  storage_location VARCHAR(100) NOT NULL, -- e.g., "Refrigerator FR-12"
  storage_temperature NUMERIC(4,2) DEFAULT 4.0, -- in Celsius
  storage_conditions TEXT, -- Additional storage notes
  
  -- Status
  status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available', 'reserved', 'dispatched', 'expired', 'discarded')),
  
  -- Quality Control
  quality_check_passed BOOLEAN DEFAULT true,
  quality_check_date DATE,
  quality_check_notes TEXT,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES blood_banks(id) ON DELETE SET NULL,
  
  -- Constraints
  CONSTRAINT valid_dates CHECK (expiry_date > collection_date),
  CONSTRAINT valid_units CHECK (units_available <= initial_units)
);

-- Indexes for performance
CREATE INDEX idx_blood_units_blood_bank ON blood_units(blood_bank_id);
CREATE INDEX idx_blood_units_blood_type ON blood_units(blood_type);
CREATE INDEX idx_blood_units_status ON blood_units(status);
CREATE INDEX idx_blood_units_expiry ON blood_units(expiry_date);
CREATE INDEX idx_blood_units_collection ON blood_units(collection_date);
CREATE INDEX idx_blood_units_batch ON blood_units(batch_id);

-- =====================================================
-- 2. BLOOD STOCK TRANSACTIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS blood_stock_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  blood_unit_id UUID REFERENCES blood_units(id) ON DELETE CASCADE NOT NULL,
  blood_bank_id UUID REFERENCES blood_banks(id) ON DELETE CASCADE NOT NULL,
  
  -- Transaction Details
  transaction_type VARCHAR(20) NOT NULL CHECK (transaction_type IN ('collection', 'dispatch', 'reserve', 'unreserve', 'expire', 'discard', 'return')),
  units_affected INTEGER NOT NULL,
  
  -- Related Entities
  hospital_id UUID, -- If dispatched to hospital
  patient_id UUID, -- If for specific patient
  
  -- Transaction Info
  transaction_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  performed_by VARCHAR(255), -- Staff member name
  notes TEXT,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_transactions_blood_unit ON blood_stock_transactions(blood_unit_id);
CREATE INDEX idx_transactions_blood_bank ON blood_stock_transactions(blood_bank_id);
CREATE INDEX idx_transactions_type ON blood_stock_transactions(transaction_type);
CREATE INDEX idx_transactions_date ON blood_stock_transactions(transaction_date DESC);

-- =====================================================
-- 3. BLOOD STOCK ALERTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS blood_stock_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  blood_bank_id UUID REFERENCES blood_banks(id) ON DELETE CASCADE NOT NULL,
  blood_unit_id UUID REFERENCES blood_units(id) ON DELETE CASCADE,
  
  -- Alert Information
  alert_type VARCHAR(30) NOT NULL CHECK (alert_type IN ('expiring_soon', 'expired', 'low_stock', 'critical_stock', 'quality_issue')),
  severity VARCHAR(20) DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  
  -- Alert Details
  blood_type VARCHAR(5),
  message TEXT NOT NULL,
  
  -- Status
  is_resolved BOOLEAN DEFAULT false,
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolved_by VARCHAR(255),
  resolution_notes TEXT,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_alerts_blood_bank ON blood_stock_alerts(blood_bank_id);
CREATE INDEX idx_alerts_type ON blood_stock_alerts(alert_type);
CREATE INDEX idx_alerts_resolved ON blood_stock_alerts(is_resolved);
CREATE INDEX idx_alerts_created ON blood_stock_alerts(created_at DESC);

-- =====================================================
-- 4. TRIGGERS FOR AUTOMATIC UPDATES
-- =====================================================

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_blood_units_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER blood_units_updated_at
  BEFORE UPDATE ON blood_units
  FOR EACH ROW
  EXECUTE FUNCTION update_blood_units_updated_at();

-- Trigger to create transaction record on blood unit changes
CREATE OR REPLACE FUNCTION log_blood_unit_transaction()
RETURNS TRIGGER AS $$
BEGIN
  -- Log when units are dispatched
  IF NEW.status = 'dispatched' AND OLD.status != 'dispatched' THEN
    INSERT INTO blood_stock_transactions (
      blood_unit_id, 
      blood_bank_id, 
      transaction_type, 
      units_affected,
      notes
    ) VALUES (
      NEW.id,
      NEW.blood_bank_id,
      'dispatch',
      OLD.units_available - NEW.units_available,
      'Blood unit dispatched'
    );
  END IF;
  
  -- Log when units are reserved
  IF NEW.status = 'reserved' AND OLD.status = 'available' THEN
    INSERT INTO blood_stock_transactions (
      blood_unit_id, 
      blood_bank_id, 
      transaction_type, 
      units_affected,
      notes
    ) VALUES (
      NEW.id,
      NEW.blood_bank_id,
      'reserve',
      NEW.units_available,
      'Blood unit reserved'
    );
  END IF;
  
  -- Log when units expire
  IF NEW.status = 'expired' AND OLD.status != 'expired' THEN
    INSERT INTO blood_stock_transactions (
      blood_unit_id, 
      blood_bank_id, 
      transaction_type, 
      units_affected,
      notes
    ) VALUES (
      NEW.id,
      NEW.blood_bank_id,
      'expire',
      NEW.units_available,
      'Blood unit expired'
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER log_blood_unit_changes
  AFTER UPDATE ON blood_units
  FOR EACH ROW
  EXECUTE FUNCTION log_blood_unit_transaction();

-- Trigger to automatically mark expired units
CREATE OR REPLACE FUNCTION auto_expire_blood_units()
RETURNS void AS $$
BEGIN
  UPDATE blood_units
  SET status = 'expired'
  WHERE expiry_date < CURRENT_DATE
    AND status NOT IN ('expired', 'dispatched', 'discarded');
END;
$$ LANGUAGE plpgsql;

-- Trigger to create alerts for expiring units
CREATE OR REPLACE FUNCTION check_expiring_units()
RETURNS void AS $$
BEGIN
  -- Create alerts for units expiring within 7 days
  INSERT INTO blood_stock_alerts (blood_bank_id, blood_unit_id, alert_type, severity, blood_type, message)
  SELECT 
    bu.blood_bank_id,
    bu.id,
    'expiring_soon',
    CASE 
      WHEN bu.expiry_date - CURRENT_DATE <= 3 THEN 'high'
      WHEN bu.expiry_date - CURRENT_DATE <= 7 THEN 'medium'
      ELSE 'low'
    END,
    bu.blood_type,
    'Blood unit ' || bu.batch_id || ' (' || bu.blood_type || ') expires in ' || 
    (bu.expiry_date - CURRENT_DATE) || ' days'
  FROM blood_units bu
  WHERE bu.expiry_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '7 days'
    AND bu.status = 'available'
    AND NOT EXISTS (
      SELECT 1 FROM blood_stock_alerts bsa
      WHERE bsa.blood_unit_id = bu.id
        AND bsa.alert_type = 'expiring_soon'
        AND bsa.is_resolved = false
    );
  
  -- Create alerts for expired units
  INSERT INTO blood_stock_alerts (blood_bank_id, blood_unit_id, alert_type, severity, blood_type, message)
  SELECT 
    bu.blood_bank_id,
    bu.id,
    'expired',
    'critical',
    bu.blood_type,
    'Blood unit ' || bu.batch_id || ' (' || bu.blood_type || ') has EXPIRED - Remove from stock immediately'
  FROM blood_units bu
  WHERE bu.expiry_date < CURRENT_DATE
    AND bu.status NOT IN ('expired', 'dispatched', 'discarded')
    AND NOT EXISTS (
      SELECT 1 FROM blood_stock_alerts bsa
      WHERE bsa.blood_unit_id = bu.id
        AND bsa.alert_type = 'expired'
        AND bsa.is_resolved = false
    );
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 5. FUNCTIONS FOR STOCK MANAGEMENT
-- =====================================================

-- Function to get current stock summary
CREATE OR REPLACE FUNCTION get_blood_stock_summary(bank_id UUID)
RETURNS TABLE (
  blood_type VARCHAR(5),
  total_units BIGINT,
  available_units BIGINT,
  reserved_units BIGINT,
  expiring_soon BIGINT,
  expired_units BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    bu.blood_type,
    SUM(bu.units_available) as total_units,
    SUM(CASE WHEN bu.status = 'available' THEN bu.units_available ELSE 0 END) as available_units,
    SUM(CASE WHEN bu.status = 'reserved' THEN bu.units_available ELSE 0 END) as reserved_units,
    SUM(CASE WHEN bu.expiry_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '7 days' 
             AND bu.status = 'available' THEN bu.units_available ELSE 0 END) as expiring_soon,
    SUM(CASE WHEN bu.status = 'expired' THEN bu.units_available ELSE 0 END) as expired_units
  FROM blood_units bu
  WHERE bu.blood_bank_id = bank_id
  GROUP BY bu.blood_type
  ORDER BY bu.blood_type;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate days until expiry
CREATE OR REPLACE FUNCTION days_until_expiry(expiry_date DATE)
RETURNS INTEGER AS $$
BEGIN
  RETURN (expiry_date - CURRENT_DATE);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- =====================================================
-- 6. ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS
ALTER TABLE blood_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE blood_stock_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE blood_stock_alerts ENABLE ROW LEVEL SECURITY;

-- Blood banks can manage their own blood units
CREATE POLICY "Blood banks can view own blood units"
  ON blood_units FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM blood_banks
      WHERE blood_banks.id = blood_units.blood_bank_id
      AND blood_banks.auth_id = auth.uid()
    )
  );

CREATE POLICY "Blood banks can insert own blood units"
  ON blood_units FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM blood_banks
      WHERE blood_banks.id = blood_units.blood_bank_id
      AND blood_banks.auth_id = auth.uid()
    )
  );

CREATE POLICY "Blood banks can update own blood units"
  ON blood_units FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM blood_banks
      WHERE blood_banks.id = blood_units.blood_bank_id
      AND blood_banks.auth_id = auth.uid()
    )
  );

CREATE POLICY "Blood banks can delete own blood units"
  ON blood_units FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM blood_banks
      WHERE blood_banks.id = blood_units.blood_bank_id
      AND blood_banks.auth_id = auth.uid()
    )
  );

-- Hospitals can view available blood units
CREATE POLICY "Hospitals can view available blood units"
  ON blood_units FOR SELECT
  USING (
    status = 'available' AND
    EXISTS (
      SELECT 1 FROM hospitals
      WHERE hospitals.auth_id = auth.uid()
    )
  );

-- Transaction policies
CREATE POLICY "Blood banks can view own transactions"
  ON blood_stock_transactions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM blood_banks
      WHERE blood_banks.id = blood_stock_transactions.blood_bank_id
      AND blood_banks.auth_id = auth.uid()
    )
  );

-- Alert policies
CREATE POLICY "Blood banks can view own alerts"
  ON blood_stock_alerts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM blood_banks
      WHERE blood_banks.id = blood_stock_alerts.blood_bank_id
      AND blood_banks.auth_id = auth.uid()
    )
  );

CREATE POLICY "Blood banks can update own alerts"
  ON blood_stock_alerts FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM blood_banks
      WHERE blood_banks.id = blood_stock_alerts.blood_bank_id
      AND blood_banks.auth_id = auth.uid()
    )
  );

-- =====================================================
-- 7. SAMPLE DATA FOR TESTING
-- =====================================================

-- Note: Replace 'your-blood-bank-id' with actual blood bank ID
-- INSERT INTO blood_units (blood_bank_id, blood_type, units_available, initial_units, collection_date, expiry_date, batch_id, storage_location, storage_temperature, status) VALUES
-- ('your-blood-bank-id', 'O+', 45, 45, '2025-01-15', '2025-02-26', 'BATCH-O-POS-012025', 'Refrigerator FR-12', 4.0, 'available'),
-- ('your-blood-bank-id', 'A+', 32, 32, '2025-01-18', '2025-03-01', 'BATCH-A-POS-012025', 'Refrigerator FR-13', 4.0, 'available'),
-- ('your-blood-bank-id', 'B+', 28, 28, '2025-01-20', '2025-03-03', 'BATCH-B-POS-012025', 'Refrigerator FR-14', 4.0, 'available');

-- =====================================================
-- 8. SCHEDULED JOBS (Run these periodically)
-- =====================================================

-- Run this daily to auto-expire units and create alerts
-- You can set this up as a Supabase Edge Function or cron job
-- SELECT auto_expire_blood_units();
-- SELECT check_expiring_units();

-- =====================================================
-- SETUP COMPLETE!
-- =====================================================
-- Next steps:
-- 1. Run this SQL in your Supabase SQL Editor
-- 2. Enable Realtime for blood_units, blood_stock_transactions, and blood_stock_alerts tables
-- 3. Set up a cron job or Edge Function to run auto_expire_blood_units() and check_expiring_units() daily
-- 4. Update your frontend to use these new tables
-- =====================================================