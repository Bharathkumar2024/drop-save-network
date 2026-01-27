-- =====================================================
-- COMPLETE SUPABASE SCHEMA FOR BLOOD DONATION PLATFORM
-- =====================================================
-- Run this in your Supabase SQL Editor to set up the full database
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. DONORS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS donors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  blood_type VARCHAR(5) NOT NULL,
  age INTEGER,
  gender VARCHAR(20),
  location TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  postal_code VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE,
  donation_count INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  reputation_score INTEGER DEFAULT 0,
  avatar_url TEXT
);

-- Index for faster queries
CREATE INDEX idx_donors_email ON donors(email);
CREATE INDEX idx_donors_blood_type ON donors(blood_type);
CREATE INDEX idx_donors_status ON donors(status);

-- =====================================================
-- 2. BLOOD BANKS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS blood_banks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  bank_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  location TEXT NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  postal_code VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  license_number VARCHAR(100)
);

CREATE INDEX idx_blood_banks_city ON blood_banks(city);
CREATE INDEX idx_blood_banks_status ON blood_banks(status);

-- =====================================================
-- 3. HOSPITALS TABLE
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
  hospital_type VARCHAR(50),
  bed_capacity INTEGER,
  bio TEXT,
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
-- 4. PATIENTS TABLE
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
  admission_date DATE NOT NULL,
  condition_description TEXT,
  urgency_level VARCHAR(20) DEFAULT 'normal' CHECK (urgency_level IN ('critical', 'urgent', 'normal')),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'discharged', 'transferred')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_patients_hospital ON patients(hospital_id);
CREATE INDEX idx_patients_blood_group ON patients(blood_group);
CREATE INDEX idx_patients_status ON patients(status);
CREATE INDEX idx_patients_urgency ON patients(urgency_level);

-- =====================================================
-- 5. BLOOD REQUESTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS blood_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hospital_id UUID REFERENCES hospitals(id) ON DELETE CASCADE NOT NULL,
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
  blood_bank_id UUID REFERENCES blood_banks(id) ON DELETE SET NULL,
  blood_group VARCHAR(5) NOT NULL,
  units_needed INTEGER NOT NULL CHECK (units_needed > 0),
  units_received INTEGER DEFAULT 0 CHECK (units_received >= 0),
  urgency_level VARCHAR(20) DEFAULT 'normal' CHECK (urgency_level IN ('critical', 'urgent', 'normal')),
  request_status VARCHAR(20) DEFAULT 'requesting' CHECK (request_status IN ('requesting', 'pending', 'approved', 'fulfilled', 'rejected', 'cancelled')),
  request_type VARCHAR(20) DEFAULT 'normal' CHECK (request_type IN ('normal', 'emergency')),
  requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  fulfilled_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  rejection_reason TEXT,
  created_by_name VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_blood_requests_hospital ON blood_requests(hospital_id);
CREATE INDEX idx_blood_requests_blood_bank ON blood_requests(blood_bank_id);
CREATE INDEX idx_blood_requests_status ON blood_requests(request_status);
CREATE INDEX idx_blood_requests_blood_group ON blood_requests(blood_group);
CREATE INDEX idx_blood_requests_urgency ON blood_requests(urgency_level);

-- =====================================================
-- 6. BLOOD TRANSACTIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS blood_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hospital_id UUID REFERENCES hospitals(id) ON DELETE CASCADE NOT NULL,
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
  blood_bank_id UUID REFERENCES blood_banks(id) ON DELETE CASCADE NOT NULL,
  blood_request_id UUID REFERENCES blood_requests(id) ON DELETE SET NULL,
  patient_name VARCHAR(255) NOT NULL,
  blood_group VARCHAR(5) NOT NULL,
  units_received INTEGER NOT NULL CHECK (units_received > 0),
  blood_bank_name VARCHAR(255) NOT NULL,
  transaction_date DATE NOT NULL,
  received_by VARCHAR(255),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_blood_transactions_hospital ON blood_transactions(hospital_id);
CREATE INDEX idx_blood_transactions_blood_bank ON blood_transactions(blood_bank_id);
CREATE INDEX idx_blood_transactions_date ON blood_transactions(transaction_date);

-- =====================================================
-- 7. HOSPITAL-BLOOD BANK CONNECTIONS TABLE
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

CREATE INDEX idx_connections_hospital ON hospital_blood_bank_connections(hospital_id);
CREATE INDEX idx_connections_blood_bank ON hospital_blood_bank_connections(blood_bank_id);
CREATE INDEX idx_connections_status ON hospital_blood_bank_connections(connection_status);

-- =====================================================
-- 8. EMERGENCY ALERTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS emergency_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hospital_id UUID REFERENCES hospitals(id) ON DELETE CASCADE NOT NULL,
  hospital_name VARCHAR(255) NOT NULL,
  blood_group VARCHAR(5) NOT NULL,
  units_needed INTEGER NOT NULL CHECK (units_needed > 0),
  urgency_message TEXT,
  alert_status VARCHAR(20) DEFAULT 'active' CHECK (alert_status IN ('active', 'resolved', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_by VARCHAR(255)
);

CREATE INDEX idx_emergency_alerts_status ON emergency_alerts(alert_status);
CREATE INDEX idx_emergency_alerts_created ON emergency_alerts(created_at DESC);
CREATE INDEX idx_emergency_alerts_blood_group ON emergency_alerts(blood_group);

-- =====================================================
-- 9. NOTIFICATIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipient_type VARCHAR(20) NOT NULL CHECK (recipient_type IN ('hospital', 'blood_bank', 'donor', 'all')),
  recipient_id UUID,
  sender_type VARCHAR(20) CHECK (sender_type IN ('hospital', 'blood_bank', 'donor', 'system')),
  sender_id UUID,
  notification_type VARCHAR(50) NOT NULL CHECK (notification_type IN ('emergency_alert', 'blood_request', 'request_approved', 'request_rejected', 'blood_received', 'new_connection', 'general')),
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  related_id UUID,
  is_read BOOLEAN DEFAULT false,
  priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'critical')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  read_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_notifications_recipient ON notifications(recipient_id);
CREATE INDEX idx_notifications_type ON notifications(notification_type);
CREATE INDEX idx_notifications_read ON notifications(is_read);
CREATE INDEX idx_notifications_created ON notifications(created_at DESC);

-- =====================================================
-- 10. BLOOD CAMPS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS blood_camps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  location TEXT NOT NULL,
  coordinates JSONB,
  date DATE NOT NULL,
  time VARCHAR(50) NOT NULL,
  bank_id UUID REFERENCES blood_banks(id) ON DELETE SET NULL,
  capacity INTEGER DEFAULT 50,
  registered_count INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'ongoing', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_blood_camps_date ON blood_camps(date);
CREATE INDEX idx_blood_camps_status ON blood_camps(status);

-- =====================================================
-- 11. DONATION APPLICATIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS donation_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  donor_id UUID REFERENCES donors(id) ON DELETE CASCADE NOT NULL,
  blood_type VARCHAR(5) NOT NULL,
  age INTEGER NOT NULL,
  weight NUMERIC(5,2) NOT NULL,
  gender VARCHAR(20) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  address_line2 TEXT,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  postal_code VARCHAR(20) NOT NULL,
  pulse VARCHAR(20),
  hb VARCHAR(20),
  bp VARCHAR(20),
  temperature VARCHAR(20),
  has_donated_before BOOLEAN DEFAULT false,
  last_donation_date DATE,
  medical_conditions TEXT,
  recent_procedures JSONB,
  diseases JSONB,
  medications JSONB,
  surgery_history JSONB,
  location TEXT,
  camp_id UUID REFERENCES blood_camps(id) ON DELETE SET NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed_by UUID REFERENCES blood_banks(id) ON DELETE SET NULL,
  review_notes TEXT
);

CREATE INDEX idx_donation_applications_donor ON donation_applications(donor_id);
CREATE INDEX idx_donation_applications_status ON donation_applications(status);
CREATE INDEX idx_donation_applications_camp ON donation_applications(camp_id);
CREATE INDEX idx_donation_applications_created ON donation_applications(created_at DESC);

-- =====================================================
-- 12. MESSAGES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  donor_id UUID REFERENCES donors(id) ON DELETE CASCADE NOT NULL,
  bank_id UUID REFERENCES blood_banks(id) ON DELETE SET NULL,
  message_text TEXT NOT NULL,
  message_type VARCHAR(20) DEFAULT 'general' CHECK (message_type IN ('acceptance', 'rejection', 'reminder', 'general')),
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_messages_donor ON messages(donor_id);
CREATE INDEX idx_messages_is_read ON messages(is_read);
CREATE INDEX idx_messages_created ON messages(created_at DESC);

-- =====================================================
-- 13. BLOOD UNITS TABLE (Stock Management)
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
  storage_location VARCHAR(100) NOT NULL,
  storage_temperature NUMERIC(4,2) DEFAULT 4.0,
  storage_conditions TEXT,

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

CREATE INDEX idx_blood_units_blood_bank ON blood_units(blood_bank_id);
CREATE INDEX idx_blood_units_blood_type ON blood_units(blood_type);
CREATE INDEX idx_blood_units_status ON blood_units(status);
CREATE INDEX idx_blood_units_expiry ON blood_units(expiry_date);
CREATE INDEX idx_blood_units_batch ON blood_units(batch_id);

-- =====================================================
-- 14. BLOOD STOCK TRANSACTIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS blood_stock_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  blood_unit_id UUID REFERENCES blood_units(id) ON DELETE CASCADE NOT NULL,
  blood_bank_id UUID REFERENCES blood_banks(id) ON DELETE CASCADE NOT NULL,
  transaction_type VARCHAR(20) NOT NULL CHECK (transaction_type IN ('collection', 'dispatch', 'reserve', 'unreserve', 'expire', 'discard', 'return')),
  units_affected INTEGER NOT NULL CHECK (units_affected > 0),
  hospital_id UUID REFERENCES hospitals(id) ON DELETE SET NULL,
  patient_id UUID REFERENCES patients(id) ON DELETE SET NULL,
  transaction_date DATE NOT NULL,
  performed_by VARCHAR(255),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_stock_transactions_blood_bank ON blood_stock_transactions(blood_bank_id);
CREATE INDEX idx_stock_transactions_type ON blood_stock_transactions(transaction_type);
CREATE INDEX idx_stock_transactions_date ON blood_stock_transactions(transaction_date);

-- =====================================================
-- 15. BLOOD STOCK ALERTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS blood_stock_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  blood_bank_id UUID REFERENCES blood_banks(id) ON DELETE CASCADE NOT NULL,
  blood_unit_id UUID REFERENCES blood_units(id) ON DELETE SET NULL,
  alert_type VARCHAR(30) NOT NULL CHECK (alert_type IN ('expiring_soon', 'expired', 'low_stock', 'critical_stock', 'quality_issue')),
  severity VARCHAR(20) NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  blood_type VARCHAR(5),
  message TEXT NOT NULL,
  is_resolved BOOLEAN DEFAULT false,
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolved_by VARCHAR(255),
  resolution_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_blood_stock_alerts_blood_bank ON blood_stock_alerts(blood_bank_id);
CREATE INDEX idx_blood_stock_alerts_type ON blood_stock_alerts(alert_type);
CREATE INDEX idx_blood_stock_alerts_severity ON blood_stock_alerts(severity);
CREATE INDEX idx_blood_stock_alerts_resolved ON blood_stock_alerts(is_resolved);

-- =====================================================
-- 16. TRIGGERS
-- =====================================================

-- Trigger to update updated_at timestamp for various tables
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to tables that have updated_at
CREATE TRIGGER update_patients_updated_at BEFORE UPDATE ON patients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_blood_requests_updated_at BEFORE UPDATE ON blood_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_blood_units_updated_at BEFORE UPDATE ON blood_units FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_donation_applications_updated_at BEFORE UPDATE ON donation_applications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger to update total_transactions in connections
CREATE OR REPLACE FUNCTION update_connection_transactions()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE hospital_blood_bank_connections
  SET total_transactions = total_transactions + 1,
      last_transaction_at = NOW()
  WHERE hospital_id = NEW.hospital_id AND blood_bank_id = NEW.blood_bank_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_blood_transaction_insert
  AFTER INSERT ON blood_transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_connection_transactions();

-- Trigger for donation count increment
CREATE OR REPLACE FUNCTION increment_donation_count()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    UPDATE donors
    SET donation_count = donation_count + 1,
        reputation_score = reputation_score + 10
    WHERE id = NEW.donor_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_donation_completed
  AFTER UPDATE ON donation_applications
  FOR EACH ROW
  EXECUTE FUNCTION increment_donation_count();

-- =====================================================
-- 17. ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE donors ENABLE ROW LEVEL SECURITY;
ALTER TABLE blood_banks ENABLE ROW LEVEL SECURITY;
ALTER TABLE hospitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE blood_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE blood_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE hospital_blood_bank_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE blood_camps ENABLE ROW LEVEL SECURITY;
ALTER TABLE donation_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE blood_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE blood_stock_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE blood_stock_alerts ENABLE ROW LEVEL SECURITY;

-- Basic policies for donors
CREATE POLICY "Donors can view own profile" ON donors FOR SELECT USING (auth.uid() = auth_id);
CREATE POLICY "Donors can update own profile" ON donors FOR UPDATE USING (auth.uid() = auth_id);

-- Basic policies for blood banks
CREATE POLICY "Blood banks can view own profile" ON blood_banks FOR SELECT USING (auth.uid() = auth_id);
CREATE POLICY "Blood banks can update own profile" ON blood_banks FOR UPDATE USING (auth.uid() = auth_id);

-- Basic policies for hospitals
CREATE POLICY "Hospitals can view own profile" ON hospitals FOR SELECT USING (auth.uid() = auth_id);
CREATE POLICY "Hospitals can update own profile" ON hospitals FOR UPDATE USING (auth.uid() = auth_id);

-- Allow authenticated users to view blood camps
CREATE POLICY "Anyone authenticated can view blood camps" ON blood_camps FOR SELECT TO authenticated USING (true);

-- Hospital policies for patients and requests
CREATE POLICY "Hospitals can manage their patients" ON patients FOR ALL USING (
  EXISTS (SELECT 1 FROM hospitals WHERE hospitals.id = patients.hospital_id AND hospitals.auth_id = auth.uid())
);

CREATE POLICY "Hospitals can manage their blood requests" ON blood_requests FOR ALL USING (
  EXISTS (SELECT 1 FROM hospitals WHERE hospitals.id = blood_requests.hospital_id AND hospitals.auth_id = auth.uid())
);

-- Blood bank policies for blood units and stock
CREATE POLICY "Blood banks can manage their blood units" ON blood_units FOR ALL USING (
  EXISTS (SELECT 1 FROM blood_banks WHERE blood_banks.id = blood_units.blood_bank_id AND blood_banks.auth_id = auth.uid())
);

-- Allow cross-entity read access for operational purposes
CREATE POLICY "Hospitals can view blood banks" ON blood_banks FOR SELECT TO authenticated USING (true);
CREATE POLICY "Blood banks can view hospitals" ON hospitals FOR SELECT TO authenticated USING (true);

-- Emergency alerts - hospitals can create, blood banks can view
CREATE POLICY "Hospitals can create emergency alerts" ON emergency_alerts FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM hospitals WHERE hospitals.id = emergency_alerts.hospital_id AND hospitals.auth_id = auth.uid())
);
CREATE POLICY "Blood banks can view emergency alerts" ON emergency_alerts FOR SELECT TO authenticated USING (true);

-- Notifications policies
CREATE POLICY "Users can view their notifications" ON notifications FOR SELECT USING (
  (recipient_type = 'donor' AND EXISTS (SELECT 1 FROM donors WHERE donors.id = notifications.recipient_id AND donors.auth_id = auth.uid())) OR
  (recipient_type = 'blood_bank' AND EXISTS (SELECT 1 FROM blood_banks WHERE blood_banks.id = notifications.recipient_id AND blood_banks.auth_id = auth.uid())) OR
  (recipient_type = 'hospital' AND EXISTS (SELECT 1 FROM hospitals WHERE hospitals.id = notifications.recipient_id AND hospitals.auth_id = auth.uid())) OR
  (recipient_type = 'all')
);

-- =====================================================
-- 18. SAMPLE DATA
-- =====================================================

-- Insert sample blood camps
INSERT INTO blood_camps (name, location, coordinates, date, time, capacity, status) VALUES
  ('Central Blood Bank - Main Camp', 'Central District, Metro City', '{"lat": 40.7128, "lng": -74.0060}', CURRENT_DATE + INTERVAL '30 days', '9:00 AM - 4:00 PM', 100, 'upcoming'),
  ('City General Hospital Blood Drive', 'Downtown, Metro City', '{"lat": 40.7580, "lng": -73.9855}', CURRENT_DATE + INTERVAL '35 days', '10:00 AM - 3:00 PM', 75, 'upcoming'),
  ('Community Health Center Camp', 'Westside, Metro City', '{"lat": 40.7489, "lng": -73.9680}', CURRENT_DATE + INTERVAL '40 days', '9:00 AM - 4:00 PM', 80, 'upcoming');

-- =====================================================
-- SETUP COMPLETE!
-- =====================================================
-- Next steps:
-- 1. Enable Realtime in Supabase Dashboard for all tables listed above
-- 2. Configure authentication providers (Email/Password)
-- 3. Update your .env file with Supabase credentials
-- 4. Set VITE_USE_SUPABASE=true in .env
-- 5. Restart your development server
-- =====================================================