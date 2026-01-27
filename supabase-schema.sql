-- =====================================================
-- SUPABASE DATABASE SCHEMA FOR BLOOD DONATION APP
-- =====================================================
-- Copy and paste this into your Supabase SQL Editor
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
-- 3. BLOOD CAMPS TABLE
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
-- 4. DONATION APPLICATIONS TABLE
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
-- 5. MESSAGES TABLE
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
-- 6. TRIGGERS
-- =====================================================

-- Trigger to update last_login when user logs in
CREATE OR REPLACE FUNCTION update_last_login()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE donors 
  SET last_login = NOW() 
  WHERE auth_id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on auth.users table (if you have access)
-- Note: This might need to be adjusted based on Supabase permissions
-- DROP TRIGGER IF EXISTS on_auth_user_login ON auth.users;
-- CREATE TRIGGER on_auth_user_login
--   AFTER UPDATE ON auth.users
--   FOR EACH ROW
--   WHEN (OLD.last_sign_in_at IS DISTINCT FROM NEW.last_sign_in_at)
--   EXECUTE FUNCTION update_last_login();

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_donation_applications_updated_at
  BEFORE UPDATE ON donation_applications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger to increment donation count when application is completed
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

-- Trigger to send message when application is accepted
CREATE OR REPLACE FUNCTION send_acceptance_message()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'accepted' AND OLD.status = 'pending' THEN
    INSERT INTO messages (donor_id, bank_id, message_text, message_type)
    VALUES (
      NEW.donor_id,
      NEW.reviewed_by,
      'Congratulations! Your blood donation application has been accepted. Please visit the blood camp on the scheduled date.',
      'acceptance'
    );
  ELSIF NEW.status = 'rejected' AND OLD.status = 'pending' THEN
    INSERT INTO messages (donor_id, bank_id, message_text, message_type)
    VALUES (
      NEW.donor_id,
      NEW.reviewed_by,
      'We regret to inform you that your blood donation application has been rejected. ' || COALESCE(NEW.review_notes, 'Please contact us for more information.'),
      'rejection'
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_application_reviewed
  AFTER UPDATE ON donation_applications
  FOR EACH ROW
  EXECUTE FUNCTION send_acceptance_message();

-- =====================================================
-- 7. ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE donors ENABLE ROW LEVEL SECURITY;
ALTER TABLE blood_banks ENABLE ROW LEVEL SECURITY;
ALTER TABLE blood_camps ENABLE ROW LEVEL SECURITY;
ALTER TABLE donation_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Donors can read and update their own data
CREATE POLICY "Donors can view own profile"
  ON donors FOR SELECT
  USING (auth.uid() = auth_id);

CREATE POLICY "Donors can update own profile"
  ON donors FOR UPDATE
  USING (auth.uid() = auth_id);

-- Blood banks can view all donors
CREATE POLICY "Blood banks can view all donors"
  ON donors FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM blood_banks
      WHERE blood_banks.auth_id = auth.uid()
    )
  );

-- Blood camps are publicly readable
CREATE POLICY "Anyone can view blood camps"
  ON blood_camps FOR SELECT
  TO authenticated
  USING (true);

-- Blood banks can manage their camps
CREATE POLICY "Blood banks can manage their camps"
  ON blood_camps FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM blood_banks
      WHERE blood_banks.id = blood_camps.bank_id
      AND blood_banks.auth_id = auth.uid()
    )
  );

-- Donors can create and view their own applications
CREATE POLICY "Donors can create applications"
  ON donation_applications FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM donors
      WHERE donors.id = donation_applications.donor_id
      AND donors.auth_id = auth.uid()
    )
  );

CREATE POLICY "Donors can view own applications"
  ON donation_applications FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM donors
      WHERE donors.id = donation_applications.donor_id
      AND donors.auth_id = auth.uid()
    )
  );

-- Blood banks can view and update all applications
CREATE POLICY "Blood banks can view all applications"
  ON donation_applications FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM blood_banks
      WHERE blood_banks.auth_id = auth.uid()
    )
  );

CREATE POLICY "Blood banks can update applications"
  ON donation_applications FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM blood_banks
      WHERE blood_banks.auth_id = auth.uid()
    )
  );

-- Donors can view their own messages
CREATE POLICY "Donors can view own messages"
  ON messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM donors
      WHERE donors.id = messages.donor_id
      AND donors.auth_id = auth.uid()
    )
  );

CREATE POLICY "Donors can update own messages"
  ON messages FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM donors
      WHERE donors.id = messages.donor_id
      AND donors.auth_id = auth.uid()
    )
  );

-- Blood banks can create messages
CREATE POLICY "Blood banks can create messages"
  ON messages FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM blood_banks
      WHERE blood_banks.id = messages.bank_id
      AND blood_banks.auth_id = auth.uid()
    )
  );

-- =====================================================
-- 8. SAMPLE DATA (Optional - for testing)
-- =====================================================

-- Insert sample blood camps
INSERT INTO blood_camps (name, location, coordinates, date, time, capacity, status) VALUES
  ('Central Blood Bank - Main Camp', 'Central District, Metro City', '{"lat": 40.7128, "lng": -74.0060}', '2025-02-15', '9:00 AM - 4:00 PM', 100, 'upcoming'),
  ('City General Hospital Blood Drive', 'Downtown, Metro City', '{"lat": 40.7580, "lng": -73.9855}', '2025-02-20', '10:00 AM - 3:00 PM', 75, 'upcoming'),
  ('Community Health Center Camp', 'Westside, Metro City', '{"lat": 40.7489, "lng": -73.9680}', '2025-02-25', '9:00 AM - 4:00 PM', 80, 'upcoming'),
  ('Metro Medical Center Blood Camp', 'Eastside, Metro City', '{"lat": 40.7282, "lng": -73.9942}', '2025-03-01', '8:00 AM - 2:00 PM', 60, 'upcoming');

-- =====================================================
-- SETUP COMPLETE!
-- =====================================================
-- Next steps:
-- 1. Enable Realtime in Supabase Dashboard for these tables
-- 2. Configure authentication providers (Email/Password)
-- 3. Update your .env file with Supabase credentials
-- =====================================================