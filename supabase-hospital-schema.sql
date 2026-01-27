-- =====================================================
-- HOSPITAL DASHBOARD EXTENSION SCHEMA
-- =====================================================
-- Run this AFTER the main supabase-schema.sql
-- This adds hospital-specific tables and features
-- =====================================================

-- =====================================================
-- 1. HOSPITALS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS hospitals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  hospital_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  license_number VARCHAR(100) UNIQUE NOT NULL,
  registration_number VARCHAR(100),
  location TEXT NOT NULL,
  address TEXT NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  postal_code VARCHAR(20),
  hospital_type VARCHAR(50), -- General, Specialty, Emergency, etc.
  bed_capacity INTEGER,
  bio TEXT, -- Short description about the hospital
  website_url TEXT,
  emergency_contact VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  verified BOOLEAN DEFAULT false
);

CREATE INDEX idx_hospitals_email ON hospitals(email);
CREATE INDEX idx_hospitals_city ON hospitals(city);
CREATE INDEX idx_hospitals_status ON hospitals(status);
CREATE INDEX idx_hospitals_license ON hospitals(license_number);

-- =====================================================
-- 2. HOSPITAL-BLOOD BANK CONNECTIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS hospital_blood_bank_connections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hospital_id UUID REFERENCES hospitals(id) ON DELETE CASCADE NOT NULL,
  blood_bank_id UUID REFERENCES blood_banks(id) ON DELETE CASCADE NOT NULL,
  connection_status VARCHAR(20) DEFAULT 'active' CHECK (connection_status IN ('active', 'inactive', 'pending')),
  connected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_transaction_at TIMESTAMP WITH TIME ZONE,
  total_transactions INTEGER DEFAULT 0,
  UNIQUE(hospital_id, blood_bank_id)
);

CREATE INDEX idx_hospital_connections_hospital ON hospital_blood_bank_connections(hospital_id);
CREATE INDEX idx_hospital_connections_bank ON hospital_blood_bank_connections(blood_bank_id);

-- =====================================================
-- 3. PATIENTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS patients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hospital_id UUID REFERENCES hospitals(id) ON DELETE CASCADE NOT NULL,
  patient_name VARCHAR(255) NOT NULL,
  patient_age INTEGER NOT NULL,
  blood_group VARCHAR(5) NOT NULL,
  gender VARCHAR(20),
  contact_number VARCHAR(20),
  emergency_contact VARCHAR(20),
  medical_record_number VARCHAR(100),
  admission_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  condition_description TEXT,
  urgency_level VARCHAR(20) DEFAULT 'normal' CHECK (urgency_level IN ('critical', 'urgent', 'normal')),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'discharged', 'transferred')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_patients_hospital ON patients(hospital_id);
CREATE INDEX idx_patients_blood_group ON patients(blood_group);
CREATE INDEX idx_patients_urgency ON patients(urgency_level);
CREATE INDEX idx_patients_status ON patients(status);

-- =====================================================
-- 4. BLOOD REQUESTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS blood_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hospital_id UUID REFERENCES hospitals(id) ON DELETE CASCADE NOT NULL,
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
  blood_bank_id UUID REFERENCES blood_banks(id) ON DELETE SET NULL,
  blood_group VARCHAR(5) NOT NULL,
  units_needed INTEGER NOT NULL,
  units_received INTEGER DEFAULT 0,
  urgency_level VARCHAR(20) DEFAULT 'normal' CHECK (urgency_level IN ('critical', 'urgent', 'normal')),
  request_status VARCHAR(20) DEFAULT 'requesting' CHECK (request_status IN ('requesting', 'pending', 'approved', 'fulfilled', 'rejected', 'cancelled')),
  request_type VARCHAR(20) DEFAULT 'normal' CHECK (request_type IN ('normal', 'emergency')),
  requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  fulfilled_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  rejection_reason TEXT,
  created_by_name VARCHAR(255), -- Hospital staff name
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_blood_requests_hospital ON blood_requests(hospital_id);
CREATE INDEX idx_blood_requests_patient ON blood_requests(patient_id);
CREATE INDEX idx_blood_requests_bank ON blood_requests(blood_bank_id);
CREATE INDEX idx_blood_requests_status ON blood_requests(request_status);
CREATE INDEX idx_blood_requests_urgency ON blood_requests(urgency_level);
CREATE INDEX idx_blood_requests_type ON blood_requests(request_type);
CREATE INDEX idx_blood_requests_created ON blood_requests(created_at DESC);

-- =====================================================
-- 5. BLOOD TRANSACTIONS TABLE (Patient Records)
-- =====================================================
CREATE TABLE IF NOT EXISTS blood_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hospital_id UUID REFERENCES hospitals(id) ON DELETE CASCADE NOT NULL,
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
  blood_bank_id UUID REFERENCES blood_banks(id) ON DELETE SET NULL NOT NULL,
  blood_request_id UUID REFERENCES blood_requests(id) ON DELETE SET NULL,
  patient_name VARCHAR(255) NOT NULL,
  blood_group VARCHAR(5) NOT NULL,
  units_received INTEGER NOT NULL,
  blood_bank_name VARCHAR(255) NOT NULL,
  transaction_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  received_by VARCHAR(255), -- Hospital staff who received
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_blood_transactions_hospital ON blood_transactions(hospital_id);
CREATE INDEX idx_blood_transactions_patient ON blood_transactions(patient_id);
CREATE INDEX idx_blood_transactions_bank ON blood_transactions(blood_bank_id);
CREATE INDEX idx_blood_transactions_date ON blood_transactions(transaction_date DESC);

-- =====================================================
-- 6. EMERGENCY ALERTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS emergency_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hospital_id UUID REFERENCES hospitals(id) ON DELETE CASCADE NOT NULL,
  hospital_name VARCHAR(255) NOT NULL,
  blood_group VARCHAR(5) NOT NULL,
  units_needed INTEGER NOT NULL,
  urgency_message TEXT,
  alert_status VARCHAR(20) DEFAULT 'active' CHECK (alert_status IN ('active', 'resolved', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_by VARCHAR(255) -- Hospital staff name
);

CREATE INDEX idx_emergency_alerts_hospital ON emergency_alerts(hospital_id);
CREATE INDEX idx_emergency_alerts_status ON emergency_alerts(alert_status);
CREATE INDEX idx_emergency_alerts_created ON emergency_alerts(created_at DESC);

-- =====================================================
-- 7. NOTIFICATIONS TABLE (Universal)
-- =====================================================
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipient_type VARCHAR(20) NOT NULL CHECK (recipient_type IN ('hospital', 'blood_bank', 'donor', 'all')),
  recipient_id UUID, -- Can be hospital_id, blood_bank_id, or donor_id
  sender_type VARCHAR(20) CHECK (sender_type IN ('hospital', 'blood_bank', 'donor', 'system')),
  sender_id UUID,
  notification_type VARCHAR(50) NOT NULL CHECK (notification_type IN ('emergency_alert', 'blood_request', 'request_approved', 'request_rejected', 'blood_received', 'new_connection', 'general')),
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  related_id UUID, -- ID of related record (request_id, alert_id, etc.)
  is_read BOOLEAN DEFAULT false,
  priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'critical')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  read_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_notifications_recipient ON notifications(recipient_type, recipient_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created ON notifications(created_at DESC);
CREATE INDEX idx_notifications_type ON notifications(notification_type);

-- =====================================================
-- 8. TRIGGERS FOR HOSPITALS
-- =====================================================

-- Update updated_at timestamp for patients
CREATE TRIGGER update_patients_updated_at
  BEFORE UPDATE ON patients
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Update updated_at timestamp for blood_requests
CREATE TRIGGER update_blood_requests_updated_at
  BEFORE UPDATE ON blood_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger to update last_login for hospitals
CREATE OR REPLACE FUNCTION update_hospital_last_login()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE hospitals 
  SET last_login = NOW() 
  WHERE auth_id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to send notification when blood request is created
CREATE OR REPLACE FUNCTION notify_blood_request()
RETURNS TRIGGER AS $$
DECLARE
  hospital_name_var VARCHAR(255);
BEGIN
  -- Get hospital name
  SELECT hospital_name INTO hospital_name_var
  FROM hospitals WHERE id = NEW.hospital_id;

  -- Notify the specific blood bank
  IF NEW.blood_bank_id IS NOT NULL THEN
    INSERT INTO notifications (
      recipient_type, recipient_id, sender_type, sender_id,
      notification_type, title, message, related_id, priority
    ) VALUES (
      'blood_bank', NEW.blood_bank_id, 'hospital', NEW.hospital_id,
      'blood_request',
      'New Blood Request from ' || hospital_name_var,
      hospital_name_var || ' has requested ' || NEW.units_needed || ' units of ' || NEW.blood_group || ' blood.',
      NEW.id,
      CASE WHEN NEW.urgency_level = 'critical' THEN 'critical'
           WHEN NEW.urgency_level = 'urgent' THEN 'high'
           ELSE 'normal' END
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_blood_request_created
  AFTER INSERT ON blood_requests
  FOR EACH ROW
  EXECUTE FUNCTION notify_blood_request();

-- Trigger to send notification when emergency alert is created
CREATE OR REPLACE FUNCTION notify_emergency_alert()
RETURNS TRIGGER AS $$
BEGIN
  -- Notify all blood banks
  INSERT INTO notifications (
    recipient_type, sender_type, sender_id,
    notification_type, title, message, related_id, priority
  )
  SELECT 
    'blood_bank', 'hospital', NEW.hospital_id,
    'emergency_alert',
    '🚨 EMERGENCY: ' || NEW.blood_group || ' Blood Needed',
    'URGENT: ' || NEW.hospital_name || ' needs ' || NEW.units_needed || ' units of ' || NEW.blood_group || ' blood immediately!',
    NEW.id,
    'critical'
  FROM blood_banks WHERE status = 'active';

  -- Notify all donors with matching blood type
  INSERT INTO notifications (
    recipient_type, recipient_id, sender_type, sender_id,
    notification_type, title, message, related_id, priority
  )
  SELECT 
    'donor', donors.id, 'hospital', NEW.hospital_id,
    'emergency_alert',
    '🚨 EMERGENCY: Your Blood Type Needed',
    'URGENT: ' || NEW.hospital_name || ' needs ' || NEW.units_needed || ' units of ' || NEW.blood_group || ' blood. Please donate if you can!',
    NEW.id,
    'critical'
  FROM donors 
  WHERE blood_type = NEW.blood_group AND status = 'active';

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_emergency_alert_created
  AFTER INSERT ON emergency_alerts
  FOR EACH ROW
  EXECUTE FUNCTION notify_emergency_alert();

-- Trigger to notify hospital when blood request is approved/rejected
CREATE OR REPLACE FUNCTION notify_request_status_change()
RETURNS TRIGGER AS $$
DECLARE
  blood_bank_name_var VARCHAR(255);
BEGIN
  IF NEW.request_status != OLD.request_status THEN
    -- Get blood bank name
    SELECT bank_name INTO blood_bank_name_var
    FROM blood_banks WHERE id = NEW.blood_bank_id;

    IF NEW.request_status = 'approved' THEN
      INSERT INTO notifications (
        recipient_type, recipient_id, sender_type, sender_id,
        notification_type, title, message, related_id, priority
      ) VALUES (
        'hospital', NEW.hospital_id, 'blood_bank', NEW.blood_bank_id,
        'request_approved',
        'Blood Request Approved',
        blood_bank_name_var || ' has approved your request for ' || NEW.units_needed || ' units of ' || NEW.blood_group || ' blood.',
        NEW.id,
        'high'
      );
    ELSIF NEW.request_status = 'rejected' THEN
      INSERT INTO notifications (
        recipient_type, recipient_id, sender_type, sender_id,
        notification_type, title, message, related_id, priority
      ) VALUES (
        'hospital', NEW.hospital_id, 'blood_bank', NEW.blood_bank_id,
        'request_rejected',
        'Blood Request Rejected',
        blood_bank_name_var || ' has rejected your request. Reason: ' || COALESCE(NEW.rejection_reason, 'Not specified'),
        NEW.id,
        'normal'
      );
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_request_status_changed
  AFTER UPDATE ON blood_requests
  FOR EACH ROW
  EXECUTE FUNCTION notify_request_status_change();

-- Trigger to create transaction record when request is fulfilled
CREATE OR REPLACE FUNCTION create_blood_transaction()
RETURNS TRIGGER AS $$
DECLARE
  patient_name_var VARCHAR(255);
  blood_bank_name_var VARCHAR(255);
BEGIN
  IF NEW.request_status = 'fulfilled' AND OLD.request_status != 'fulfilled' THEN
    -- Get patient and blood bank names
    SELECT patient_name INTO patient_name_var
    FROM patients WHERE id = NEW.patient_id;
    
    SELECT bank_name INTO blood_bank_name_var
    FROM blood_banks WHERE id = NEW.blood_bank_id;

    -- Create transaction record
    INSERT INTO blood_transactions (
      hospital_id, patient_id, blood_bank_id, blood_request_id,
      patient_name, blood_group, units_received, blood_bank_name
    ) VALUES (
      NEW.hospital_id, NEW.patient_id, NEW.blood_bank_id, NEW.id,
      patient_name_var, NEW.blood_group, NEW.units_received, blood_bank_name_var
    );

    -- Notify hospital
    INSERT INTO notifications (
      recipient_type, recipient_id, sender_type, sender_id,
      notification_type, title, message, related_id, priority
    ) VALUES (
      'hospital', NEW.hospital_id, 'blood_bank', NEW.blood_bank_id,
      'blood_received',
      'Blood Received Successfully',
      'You have received ' || NEW.units_received || ' units of ' || NEW.blood_group || ' blood from ' || blood_bank_name_var,
      NEW.id,
      'high'
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_request_fulfilled
  AFTER UPDATE ON blood_requests
  FOR EACH ROW
  EXECUTE FUNCTION create_blood_transaction();

-- Trigger to auto-connect hospital and blood bank on first transaction
CREATE OR REPLACE FUNCTION auto_connect_hospital_blood_bank()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO hospital_blood_bank_connections (hospital_id, blood_bank_id, connection_status)
  VALUES (NEW.hospital_id, NEW.blood_bank_id, 'active')
  ON CONFLICT (hospital_id, blood_bank_id) 
  DO UPDATE SET 
    last_transaction_at = NOW(),
    total_transactions = hospital_blood_bank_connections.total_transactions + 1;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_transaction_created
  AFTER INSERT ON blood_transactions
  FOR EACH ROW
  EXECUTE FUNCTION auto_connect_hospital_blood_bank();

-- =====================================================
-- 9. ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all new tables
ALTER TABLE hospitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE hospital_blood_bank_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE blood_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE blood_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Hospitals can view and update their own profile
CREATE POLICY "Hospitals can view own profile"
  ON hospitals FOR SELECT
  USING (auth.uid() = auth_id);

CREATE POLICY "Hospitals can update own profile"
  ON hospitals FOR UPDATE
  USING (auth.uid() = auth_id);

-- Anyone authenticated can view all hospitals (for connections)
CREATE POLICY "Authenticated users can view hospitals"
  ON hospitals FOR SELECT
  TO authenticated
  USING (true);

-- Hospital-Blood Bank Connections
CREATE POLICY "Hospitals can view their connections"
  ON hospital_blood_bank_connections FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM hospitals
      WHERE hospitals.id = hospital_blood_bank_connections.hospital_id
      AND hospitals.auth_id = auth.uid()
    )
  );

CREATE POLICY "Blood banks can view their connections"
  ON hospital_blood_bank_connections FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM blood_banks
      WHERE blood_banks.id = hospital_blood_bank_connections.blood_bank_id
      AND blood_banks.auth_id = auth.uid()
    )
  );

-- Patients - Hospitals can manage their own patients
CREATE POLICY "Hospitals can manage their patients"
  ON patients FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM hospitals
      WHERE hospitals.id = patients.hospital_id
      AND hospitals.auth_id = auth.uid()
    )
  );

-- Blood Requests - Hospitals can manage their requests
CREATE POLICY "Hospitals can manage their blood requests"
  ON blood_requests FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM hospitals
      WHERE hospitals.id = blood_requests.hospital_id
      AND hospitals.auth_id = auth.uid()
    )
  );

-- Blood banks can view and update requests sent to them
CREATE POLICY "Blood banks can view requests sent to them"
  ON blood_requests FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM blood_banks
      WHERE blood_banks.id = blood_requests.blood_bank_id
      AND blood_banks.auth_id = auth.uid()
    )
  );

CREATE POLICY "Blood banks can update requests sent to them"
  ON blood_requests FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM blood_banks
      WHERE blood_banks.id = blood_requests.blood_bank_id
      AND blood_banks.auth_id = auth.uid()
    )
  );

-- Blood Transactions - Hospitals can view their transactions
CREATE POLICY "Hospitals can view their transactions"
  ON blood_transactions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM hospitals
      WHERE hospitals.id = blood_transactions.hospital_id
      AND hospitals.auth_id = auth.uid()
    )
  );

-- Blood banks can view transactions they're involved in
CREATE POLICY "Blood banks can view their transactions"
  ON blood_transactions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM blood_banks
      WHERE blood_banks.id = blood_transactions.blood_bank_id
      AND blood_banks.auth_id = auth.uid()
    )
  );

-- Emergency Alerts - Hospitals can manage their alerts
CREATE POLICY "Hospitals can manage their emergency alerts"
  ON emergency_alerts FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM hospitals
      WHERE hospitals.id = emergency_alerts.hospital_id
      AND hospitals.auth_id = auth.uid()
    )
  );

-- Blood banks and donors can view active emergency alerts
CREATE POLICY "Blood banks can view emergency alerts"
  ON emergency_alerts FOR SELECT
  TO authenticated
  USING (alert_status = 'active');

-- Notifications - Users can view their own notifications
CREATE POLICY "Users can view their notifications"
  ON notifications FOR SELECT
  USING (
    (recipient_type = 'hospital' AND EXISTS (
      SELECT 1 FROM hospitals WHERE hospitals.id = notifications.recipient_id AND hospitals.auth_id = auth.uid()
    ))
    OR
    (recipient_type = 'blood_bank' AND EXISTS (
      SELECT 1 FROM blood_banks WHERE blood_banks.id = notifications.recipient_id AND blood_banks.auth_id = auth.uid()
    ))
    OR
    (recipient_type = 'donor' AND EXISTS (
      SELECT 1 FROM donors WHERE donors.id = notifications.recipient_id AND donors.auth_id = auth.uid()
    ))
    OR
    recipient_type = 'all'
  );

CREATE POLICY "Users can update their notifications"
  ON notifications FOR UPDATE
  USING (
    (recipient_type = 'hospital' AND EXISTS (
      SELECT 1 FROM hospitals WHERE hospitals.id = notifications.recipient_id AND hospitals.auth_id = auth.uid()
    ))
    OR
    (recipient_type = 'blood_bank' AND EXISTS (
      SELECT 1 FROM blood_banks WHERE blood_banks.id = notifications.recipient_id AND blood_banks.auth_id = auth.uid()
    ))
    OR
    (recipient_type = 'donor' AND EXISTS (
      SELECT 1 FROM donors WHERE donors.id = notifications.recipient_id AND donors.auth_id = auth.uid()
    ))
  );

-- =====================================================
-- 10. SAMPLE DATA FOR TESTING
-- =====================================================

-- Note: You'll need to create hospital auth users first in Supabase Auth
-- Then insert hospital records with the corresponding auth_id

-- Sample hospital (you'll need to replace 'your-auth-id-here' with actual auth IDs)
-- INSERT INTO hospitals (hospital_name, email, phone, license_number, location, address, city, state, postal_code, hospital_type, bed_capacity, bio) VALUES
--   ('LifeCare General Hospital', 'contact@lifecare.hospital', '+1-555-0100', 'LIC-2024-001', 'Downtown Medical District', '123 Healthcare Ave', 'Metro City', 'State', '10001', 'General', 500, 'Leading healthcare provider with 24/7 emergency services');

-- =====================================================
-- SETUP COMPLETE!
-- =====================================================
-- Next steps:
-- 1. Run this script in Supabase SQL Editor
-- 2. Enable Realtime for: notifications, blood_requests, emergency_alerts
-- 3. Create hospital auth users via Supabase Auth
-- 4. Test the notification system
-- =====================================================