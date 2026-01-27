-- =====================================================
-- DONATION CAMPS MANAGEMENT SCHEMA FOR SUPABASE
-- =====================================================
-- This schema adds comprehensive donation camp tracking
-- with donor details, blood collection, and reporting
-- =====================================================

-- =====================================================
-- 1. DONATION CAMPS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS donation_camps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  blood_bank_id UUID REFERENCES blood_banks(id) ON DELETE CASCADE NOT NULL,
  
  -- Camp Information
  camp_name VARCHAR(255) NOT NULL,
  camp_theme VARCHAR(255) DEFAULT 'Save Lives, Donate Blood',
  camp_date DATE NOT NULL,
  camp_time_start TIME DEFAULT '09:00:00',
  camp_time_end TIME DEFAULT '16:00:00',
  
  -- Location
  location_name VARCHAR(255) NOT NULL,
  location_address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  coordinates JSONB, -- {lat: number, lng: number}
  
  -- Capacity & Registration
  capacity INTEGER DEFAULT 100,
  registered_donors INTEGER DEFAULT 0,
  actual_donors INTEGER DEFAULT 0, -- Donors who actually donated
  
  -- Status
  status VARCHAR(20) DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'ongoing', 'completed', 'cancelled')),
  
  -- Organizer Information
  organizer_name VARCHAR(255),
  organizer_contact VARCHAR(20),
  organizer_email VARCHAR(255),
  
  -- Additional Details
  description TEXT,
  requirements TEXT, -- Special requirements or instructions
  facilities TEXT, -- Available facilities (parking, refreshments, etc.)
  
  -- Statistics (updated after camp completion)
  total_units_collected INTEGER DEFAULT 0,
  total_blood_volume_ml INTEGER DEFAULT 0, -- Total volume in milliliters
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES blood_banks(id) ON DELETE SET NULL,
  
  -- Constraints
  CONSTRAINT valid_camp_time CHECK (camp_time_end > camp_time_start),
  CONSTRAINT valid_capacity CHECK (capacity > 0),
  CONSTRAINT valid_donor_counts CHECK (actual_donors <= registered_donors AND registered_donors <= capacity)
);

-- Indexes for performance
CREATE INDEX idx_donation_camps_blood_bank ON donation_camps(blood_bank_id);
CREATE INDEX idx_donation_camps_date ON donation_camps(camp_date DESC);
CREATE INDEX idx_donation_camps_status ON donation_camps(status);
CREATE INDEX idx_donation_camps_city ON donation_camps(city);

-- =====================================================
-- 2. CAMP DONORS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS camp_donors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  camp_id UUID REFERENCES donation_camps(id) ON DELETE CASCADE NOT NULL,
  donor_id UUID REFERENCES donors(id) ON DELETE SET NULL,
  blood_bank_id UUID REFERENCES blood_banks(id) ON DELETE CASCADE NOT NULL,
  
  -- Donor Information (captured at camp)
  donor_name VARCHAR(255) NOT NULL,
  donor_age INTEGER NOT NULL CHECK (donor_age >= 18 AND donor_age <= 65),
  donor_gender VARCHAR(10) CHECK (donor_gender IN ('Male', 'Female', 'Other')),
  blood_group VARCHAR(5) NOT NULL CHECK (blood_group IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
  donor_phone VARCHAR(20),
  donor_email VARCHAR(255),
  donor_address TEXT,
  
  -- Health Screening
  weight_kg NUMERIC(5,2) CHECK (weight_kg >= 45), -- Minimum 45kg
  hemoglobin_level NUMERIC(4,2), -- g/dL
  blood_pressure VARCHAR(20), -- e.g., "120/80"
  pulse_rate INTEGER, -- beats per minute
  temperature_celsius NUMERIC(4,2),
  
  -- Medical History
  has_donated_before BOOLEAN DEFAULT false,
  last_donation_date DATE,
  medical_conditions TEXT,
  current_medications TEXT,
  
  -- Screening Result
  screening_status VARCHAR(20) DEFAULT 'pending' CHECK (screening_status IN ('pending', 'approved', 'rejected')),
  screening_notes TEXT,
  screened_by VARCHAR(255), -- Staff member name
  screened_at TIMESTAMP WITH TIME ZONE,
  
  -- Donation Details
  donation_status VARCHAR(20) DEFAULT 'registered' CHECK (donation_status IN ('registered', 'screened', 'donated', 'deferred', 'cancelled')),
  donation_time TIMESTAMP WITH TIME ZONE,
  units_donated INTEGER DEFAULT 1 CHECK (units_donated >= 0 AND units_donated <= 2),
  volume_donated_ml INTEGER DEFAULT 450, -- Standard unit is 450ml
  
  -- Blood Collection Details
  collection_batch_id VARCHAR(100), -- Links to blood_units table
  collection_date DATE,
  expiry_date DATE,
  
  -- Post-Donation
  adverse_reaction BOOLEAN DEFAULT false,
  adverse_reaction_notes TEXT,
  follow_up_required BOOLEAN DEFAULT false,
  follow_up_notes TEXT,
  
  -- Metadata
  registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_donation_dates CHECK (expiry_date IS NULL OR expiry_date > collection_date)
);

-- Indexes for performance
CREATE INDEX idx_camp_donors_camp ON camp_donors(camp_id);
CREATE INDEX idx_camp_donors_donor ON camp_donors(donor_id);
CREATE INDEX idx_camp_donors_blood_bank ON camp_donors(blood_bank_id);
CREATE INDEX idx_camp_donors_blood_group ON camp_donors(blood_group);
CREATE INDEX idx_camp_donors_donation_status ON camp_donors(donation_status);
CREATE INDEX idx_camp_donors_collection_date ON camp_donors(collection_date DESC);

-- =====================================================
-- 3. CAMP STATISTICS TABLE (Aggregated Data)
-- =====================================================
CREATE TABLE IF NOT EXISTS camp_statistics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  camp_id UUID REFERENCES donation_camps(id) ON DELETE CASCADE NOT NULL UNIQUE,
  blood_bank_id UUID REFERENCES blood_banks(id) ON DELETE CASCADE NOT NULL,
  
  -- Donor Statistics
  total_registered INTEGER DEFAULT 0,
  total_screened INTEGER DEFAULT 0,
  total_approved INTEGER DEFAULT 0,
  total_rejected INTEGER DEFAULT 0,
  total_donated INTEGER DEFAULT 0,
  total_deferred INTEGER DEFAULT 0,
  
  -- Blood Collection by Type
  a_positive_units INTEGER DEFAULT 0,
  a_negative_units INTEGER DEFAULT 0,
  b_positive_units INTEGER DEFAULT 0,
  b_negative_units INTEGER DEFAULT 0,
  ab_positive_units INTEGER DEFAULT 0,
  ab_negative_units INTEGER DEFAULT 0,
  o_positive_units INTEGER DEFAULT 0,
  o_negative_units INTEGER DEFAULT 0,
  
  -- Volume Statistics
  total_volume_collected_ml INTEGER DEFAULT 0,
  average_volume_per_donor_ml NUMERIC(6,2),
  
  -- Demographics
  male_donors INTEGER DEFAULT 0,
  female_donors INTEGER DEFAULT 0,
  other_gender_donors INTEGER DEFAULT 0,
  average_donor_age NUMERIC(4,2),
  first_time_donors INTEGER DEFAULT 0,
  repeat_donors INTEGER DEFAULT 0,
  
  -- Health Metrics
  average_hemoglobin NUMERIC(4,2),
  adverse_reactions_count INTEGER DEFAULT 0,
  follow_ups_required INTEGER DEFAULT 0,
  
  -- Metadata
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_camp_statistics_camp ON camp_statistics(camp_id);
CREATE INDEX idx_camp_statistics_blood_bank ON camp_statistics(blood_bank_id);

-- =====================================================
-- 4. TRIGGERS FOR AUTOMATIC UPDATES
-- =====================================================

-- Trigger to update camp statistics when camp_donors changes
CREATE OR REPLACE FUNCTION update_camp_statistics()
RETURNS TRIGGER AS $$
BEGIN
  -- Update or insert camp statistics
  INSERT INTO camp_statistics (camp_id, blood_bank_id)
  VALUES (NEW.camp_id, NEW.blood_bank_id)
  ON CONFLICT (camp_id) DO NOTHING;
  
  -- Recalculate statistics
  UPDATE camp_statistics
  SET
    total_registered = (SELECT COUNT(*) FROM camp_donors WHERE camp_id = NEW.camp_id),
    total_screened = (SELECT COUNT(*) FROM camp_donors WHERE camp_id = NEW.camp_id AND screening_status IN ('approved', 'rejected')),
    total_approved = (SELECT COUNT(*) FROM camp_donors WHERE camp_id = NEW.camp_id AND screening_status = 'approved'),
    total_rejected = (SELECT COUNT(*) FROM camp_donors WHERE camp_id = NEW.camp_id AND screening_status = 'rejected'),
    total_donated = (SELECT COUNT(*) FROM camp_donors WHERE camp_id = NEW.camp_id AND donation_status = 'donated'),
    total_deferred = (SELECT COUNT(*) FROM camp_donors WHERE camp_id = NEW.camp_id AND donation_status = 'deferred'),
    
    -- Blood type counts
    a_positive_units = (SELECT COALESCE(SUM(units_donated), 0) FROM camp_donors WHERE camp_id = NEW.camp_id AND blood_group = 'A+' AND donation_status = 'donated'),
    a_negative_units = (SELECT COALESCE(SUM(units_donated), 0) FROM camp_donors WHERE camp_id = NEW.camp_id AND blood_group = 'A-' AND donation_status = 'donated'),
    b_positive_units = (SELECT COALESCE(SUM(units_donated), 0) FROM camp_donors WHERE camp_id = NEW.camp_id AND blood_group = 'B+' AND donation_status = 'donated'),
    b_negative_units = (SELECT COALESCE(SUM(units_donated), 0) FROM camp_donors WHERE camp_id = NEW.camp_id AND blood_group = 'B-' AND donation_status = 'donated'),
    ab_positive_units = (SELECT COALESCE(SUM(units_donated), 0) FROM camp_donors WHERE camp_id = NEW.camp_id AND blood_group = 'AB+' AND donation_status = 'donated'),
    ab_negative_units = (SELECT COALESCE(SUM(units_donated), 0) FROM camp_donors WHERE camp_id = NEW.camp_id AND blood_group = 'AB-' AND donation_status = 'donated'),
    o_positive_units = (SELECT COALESCE(SUM(units_donated), 0) FROM camp_donors WHERE camp_id = NEW.camp_id AND blood_group = 'O+' AND donation_status = 'donated'),
    o_negative_units = (SELECT COALESCE(SUM(units_donated), 0) FROM camp_donors WHERE camp_id = NEW.camp_id AND blood_group = 'O-' AND donation_status = 'donated'),
    
    -- Volume statistics
    total_volume_collected_ml = (SELECT COALESCE(SUM(volume_donated_ml), 0) FROM camp_donors WHERE camp_id = NEW.camp_id AND donation_status = 'donated'),
    average_volume_per_donor_ml = (SELECT COALESCE(AVG(volume_donated_ml), 0) FROM camp_donors WHERE camp_id = NEW.camp_id AND donation_status = 'donated'),
    
    -- Demographics
    male_donors = (SELECT COUNT(*) FROM camp_donors WHERE camp_id = NEW.camp_id AND donor_gender = 'Male' AND donation_status = 'donated'),
    female_donors = (SELECT COUNT(*) FROM camp_donors WHERE camp_id = NEW.camp_id AND donor_gender = 'Female' AND donation_status = 'donated'),
    other_gender_donors = (SELECT COUNT(*) FROM camp_donors WHERE camp_id = NEW.camp_id AND donor_gender = 'Other' AND donation_status = 'donated'),
    average_donor_age = (SELECT COALESCE(AVG(donor_age), 0) FROM camp_donors WHERE camp_id = NEW.camp_id AND donation_status = 'donated'),
    first_time_donors = (SELECT COUNT(*) FROM camp_donors WHERE camp_id = NEW.camp_id AND has_donated_before = false AND donation_status = 'donated'),
    repeat_donors = (SELECT COUNT(*) FROM camp_donors WHERE camp_id = NEW.camp_id AND has_donated_before = true AND donation_status = 'donated'),
    
    -- Health metrics
    average_hemoglobin = (SELECT COALESCE(AVG(hemoglobin_level), 0) FROM camp_donors WHERE camp_id = NEW.camp_id AND donation_status = 'donated' AND hemoglobin_level IS NOT NULL),
    adverse_reactions_count = (SELECT COUNT(*) FROM camp_donors WHERE camp_id = NEW.camp_id AND adverse_reaction = true),
    follow_ups_required = (SELECT COUNT(*) FROM camp_donors WHERE camp_id = NEW.camp_id AND follow_up_required = true),
    
    last_updated = NOW()
  WHERE camp_id = NEW.camp_id;
  
  -- Update donation_camps table
  UPDATE donation_camps
  SET
    actual_donors = (SELECT COUNT(*) FROM camp_donors WHERE camp_id = NEW.camp_id AND donation_status = 'donated'),
    total_units_collected = (SELECT COALESCE(SUM(units_donated), 0) FROM camp_donors WHERE camp_id = NEW.camp_id AND donation_status = 'donated'),
    total_blood_volume_ml = (SELECT COALESCE(SUM(volume_donated_ml), 0) FROM camp_donors WHERE camp_id = NEW.camp_id AND donation_status = 'donated'),
    updated_at = NOW()
  WHERE id = NEW.camp_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_camp_statistics
AFTER INSERT OR UPDATE ON camp_donors
FOR EACH ROW
EXECUTE FUNCTION update_camp_statistics();

-- =====================================================
-- 5. FUNCTION TO AUTO-CREATE BLOOD UNITS FROM DONATIONS
-- =====================================================
CREATE OR REPLACE FUNCTION create_blood_unit_from_donation()
RETURNS TRIGGER AS $$
DECLARE
  v_expiry_date DATE;
  v_batch_id VARCHAR(100);
BEGIN
  -- Only create blood unit when donation status changes to 'donated'
  IF NEW.donation_status = 'donated' AND (OLD IS NULL OR OLD.donation_status != 'donated') THEN
    
    -- Calculate expiry date (42 days from collection for whole blood)
    v_expiry_date := NEW.collection_date + INTERVAL '42 days';
    
    -- Generate batch ID if not provided
    IF NEW.collection_batch_id IS NULL THEN
      v_batch_id := 'CAMP-' || TO_CHAR(NEW.collection_date, 'YYYYMMDD') || '-' || SUBSTRING(NEW.id::TEXT, 1, 8);
      NEW.collection_batch_id := v_batch_id;
    ELSE
      v_batch_id := NEW.collection_batch_id;
    END IF;
    
    -- Set expiry date if not provided
    IF NEW.expiry_date IS NULL THEN
      NEW.expiry_date := v_expiry_date;
    END IF;
    
    -- Create blood unit entry
    INSERT INTO blood_units (
      blood_bank_id,
      blood_type,
      component_type,
      units_available,
      initial_units,
      collection_date,
      expiry_date,
      batch_id,
      donor_id,
      storage_location,
      storage_temperature,
      storage_conditions,
      status,
      created_by
    ) VALUES (
      NEW.blood_bank_id,
      NEW.blood_group,
      'Whole Blood',
      NEW.units_donated,
      NEW.units_donated,
      NEW.collection_date,
      NEW.expiry_date,
      v_batch_id,
      NEW.donor_id,
      'Camp Collection Storage',
      4.0,
      'Collected at donation camp: ' || (SELECT camp_name FROM donation_camps WHERE id = NEW.camp_id),
      'available',
      NEW.blood_bank_id
    );
    
    -- Create transaction record
    INSERT INTO blood_stock_transactions (
      blood_unit_id,
      blood_bank_id,
      transaction_type,
      units_affected,
      performed_by,
      notes
    ) VALUES (
      (SELECT id FROM blood_units WHERE batch_id = v_batch_id ORDER BY created_at DESC LIMIT 1),
      NEW.blood_bank_id,
      'collection',
      NEW.units_donated,
      NEW.screened_by,
      'Collected from donor: ' || NEW.donor_name || ' at camp'
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_create_blood_unit_from_donation
BEFORE UPDATE ON camp_donors
FOR EACH ROW
EXECUTE FUNCTION create_blood_unit_from_donation();

-- =====================================================
-- 6. ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS
ALTER TABLE donation_camps ENABLE ROW LEVEL SECURITY;
ALTER TABLE camp_donors ENABLE ROW LEVEL SECURITY;
ALTER TABLE camp_statistics ENABLE ROW LEVEL SECURITY;

-- Policies for donation_camps
CREATE POLICY "Blood banks can view their own camps"
  ON donation_camps FOR SELECT
  USING (blood_bank_id = auth.uid() OR blood_bank_id IN (
    SELECT id FROM blood_banks WHERE auth_id = auth.uid()
  ));

CREATE POLICY "Blood banks can insert their own camps"
  ON donation_camps FOR INSERT
  WITH CHECK (blood_bank_id = auth.uid() OR blood_bank_id IN (
    SELECT id FROM blood_banks WHERE auth_id = auth.uid()
  ));

CREATE POLICY "Blood banks can update their own camps"
  ON donation_camps FOR UPDATE
  USING (blood_bank_id = auth.uid() OR blood_bank_id IN (
    SELECT id FROM blood_banks WHERE auth_id = auth.uid()
  ));

CREATE POLICY "Blood banks can delete their own camps"
  ON donation_camps FOR DELETE
  USING (blood_bank_id = auth.uid() OR blood_bank_id IN (
    SELECT id FROM blood_banks WHERE auth_id = auth.uid()
  ));

-- Policies for camp_donors
CREATE POLICY "Blood banks can view their camp donors"
  ON camp_donors FOR SELECT
  USING (blood_bank_id = auth.uid() OR blood_bank_id IN (
    SELECT id FROM blood_banks WHERE auth_id = auth.uid()
  ));

CREATE POLICY "Blood banks can insert camp donors"
  ON camp_donors FOR INSERT
  WITH CHECK (blood_bank_id = auth.uid() OR blood_bank_id IN (
    SELECT id FROM blood_banks WHERE auth_id = auth.uid()
  ));

CREATE POLICY "Blood banks can update their camp donors"
  ON camp_donors FOR UPDATE
  USING (blood_bank_id = auth.uid() OR blood_bank_id IN (
    SELECT id FROM blood_banks WHERE auth_id = auth.uid()
  ));

CREATE POLICY "Blood banks can delete their camp donors"
  ON camp_donors FOR DELETE
  USING (blood_bank_id = auth.uid() OR blood_bank_id IN (
    SELECT id FROM blood_banks WHERE auth_id = auth.uid()
  ));

-- Policies for camp_statistics
CREATE POLICY "Blood banks can view their camp statistics"
  ON camp_statistics FOR SELECT
  USING (blood_bank_id = auth.uid() OR blood_bank_id IN (
    SELECT id FROM blood_banks WHERE auth_id = auth.uid()
  ));

-- =====================================================
-- 7. SAMPLE DATA FOR TESTING
-- =====================================================

-- Insert sample donation camps (assuming blood_bank exists with id 'bb1')
INSERT INTO donation_camps (
  id,
  blood_bank_id,
  camp_name,
  camp_theme,
  camp_date,
  location_name,
  location_address,
  city,
  state,
  capacity,
  registered_donors,
  status,
  organizer_name,
  organizer_contact,
  description
) VALUES
  (
    'dc1',
    'bb1',
    'January Community Blood Drive',
    'New Year, New Life - Donate Blood',
    '2025-01-11',
    'Community Center',
    '123 Main Street',
    'Metro City',
    'State',
    100,
    45,
    'completed',
    'Dr. Sarah Johnson',
    '+1-555-0101',
    'Monthly blood donation camp at community center'
  ),
  (
    'dc2',
    'bb1',
    'January Corporate Blood Camp',
    'Save Lives at Work',
    '2025-01-25',
    'Tech Park Convention Hall',
    '456 Tech Boulevard',
    'Metro City',
    'State',
    150,
    78,
    'completed',
    'Dr. Michael Chen',
    '+1-555-0102',
    'Corporate blood donation drive'
  ),
  (
    'dc3',
    'bb1',
    'February Community Blood Drive',
    'Love Saves Lives',
    '2025-02-08',
    'City Mall Atrium',
    '789 Shopping Plaza',
    'Metro City',
    'State',
    120,
    32,
    'upcoming',
    'Dr. Sarah Johnson',
    '+1-555-0101',
    'Valentine month special blood donation camp'
  );

-- Insert sample camp donors for completed camps
INSERT INTO camp_donors (
  camp_id,
  blood_bank_id,
  donor_name,
  donor_age,
  donor_gender,
  blood_group,
  donor_phone,
  weight_kg,
  hemoglobin_level,
  blood_pressure,
  pulse_rate,
  temperature_celsius,
  has_donated_before,
  screening_status,
  donation_status,
  units_donated,
  volume_donated_ml,
  collection_date,
  expiry_date,
  screened_by,
  screened_at,
  donation_time
) VALUES
  ('dc1', 'bb1', 'John Smith', 32, 'Male', 'O+', '+1-555-1001', 75.5, 14.2, '120/80', 72, 36.6, true, 'approved', 'donated', 1, 450, '2025-01-11', '2025-02-22', 'Nurse Emily', '2025-01-11 09:30:00', '2025-01-11 09:45:00'),
  ('dc1', 'bb1', 'Emma Wilson', 28, 'Female', 'A+', '+1-555-1002', 58.0, 13.5, '118/75', 68, 36.5, false, 'approved', 'donated', 1, 450, '2025-01-11', '2025-02-22', 'Nurse Emily', '2025-01-11 10:00:00', '2025-01-11 10:15:00'),
  ('dc1', 'bb1', 'Michael Brown', 45, 'Male', 'B+', '+1-555-1003', 82.0, 15.1, '125/82', 75, 36.7, true, 'approved', 'donated', 1, 450, '2025-01-11', '2025-02-22', 'Nurse Emily', '2025-01-11 10:30:00', '2025-01-11 10:45:00'),
  ('dc1', 'bb1', 'Sarah Davis', 35, 'Female', 'AB+', '+1-555-1004', 62.5, 13.8, '115/70', 70, 36.4, true, 'approved', 'donated', 1, 450, '2025-01-11', '2025-02-22', 'Nurse Emily', '2025-01-11 11:00:00', '2025-01-11 11:15:00'),
  ('dc1', 'bb1', 'David Martinez', 29, 'Male', 'O-', '+1-555-1005', 78.0, 14.8, '122/78', 73, 36.6, false, 'approved', 'donated', 1, 450, '2025-01-11', '2025-02-22', 'Nurse Emily', '2025-01-11 11:30:00', '2025-01-11 11:45:00'),
  ('dc2', 'bb1', 'Lisa Anderson', 31, 'Female', 'A-', '+1-555-1006', 60.0, 13.6, '120/75', 69, 36.5, true, 'approved', 'donated', 1, 450, '2025-01-25', '2025-03-08', 'Nurse Robert', '2025-01-25 09:00:00', '2025-01-25 09:15:00'),
  ('dc2', 'bb1', 'James Taylor', 38, 'Male', 'B-', '+1-555-1007', 85.0, 15.3, '128/85', 76, 36.8, true, 'approved', 'donated', 1, 450, '2025-01-25', '2025-03-08', 'Nurse Robert', '2025-01-25 09:30:00', '2025-01-25 09:45:00'),
  ('dc2', 'bb1', 'Jennifer White', 27, 'Female', 'O+', '+1-555-1008', 55.0, 13.2, '112/68', 67, 36.3, false, 'approved', 'donated', 1, 450, '2025-01-25', '2025-03-08', 'Nurse Robert', '2025-01-25 10:00:00', '2025-01-25 10:15:00');

-- =====================================================
-- 8. USEFUL VIEWS FOR REPORTING
-- =====================================================

-- View for camp summary report
CREATE OR REPLACE VIEW camp_summary_report AS
SELECT 
  dc.id as camp_id,
  dc.camp_name,
  dc.camp_date,
  dc.location_name,
  dc.city,
  dc.status,
  dc.capacity,
  dc.registered_donors,
  dc.actual_donors,
  dc.total_units_collected,
  dc.total_blood_volume_ml,
  cs.total_donated,
  cs.total_rejected,
  cs.a_positive_units,
  cs.a_negative_units,
  cs.b_positive_units,
  cs.b_negative_units,
  cs.ab_positive_units,
  cs.ab_negative_units,
  cs.o_positive_units,
  cs.o_negative_units,
  cs.male_donors,
  cs.female_donors,
  cs.average_donor_age,
  cs.first_time_donors,
  cs.repeat_donors,
  cs.adverse_reactions_count
FROM donation_camps dc
LEFT JOIN camp_statistics cs ON dc.id = cs.camp_id
ORDER BY dc.camp_date DESC;

-- View for donor details report
CREATE OR REPLACE VIEW camp_donor_details_report AS
SELECT 
  cd.id,
  dc.camp_name,
  dc.camp_date,
  cd.donor_name,
  cd.donor_age,
  cd.donor_gender,
  cd.blood_group,
  cd.donor_phone,
  cd.units_donated,
  cd.volume_donated_ml,
  cd.collection_date,
  cd.expiry_date,
  cd.donation_status,
  cd.screening_status,
  cd.has_donated_before,
  cd.hemoglobin_level,
  cd.blood_pressure,
  cd.adverse_reaction,
  cd.collection_batch_id
FROM camp_donors cd
JOIN donation_camps dc ON cd.camp_id = dc.id
ORDER BY dc.camp_date DESC, cd.donation_time DESC;

-- =====================================================
-- SCHEMA CREATION COMPLETE
-- =====================================================
-- Next steps:
-- 1. Enable real-time for these tables in Supabase Dashboard
-- 2. Update frontend to use these tables
-- 3. Set up scheduled jobs for automatic camp status updates
-- =====================================================