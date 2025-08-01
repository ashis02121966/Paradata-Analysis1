/*
  # Survey Data Management System Database Schema

  1. New Tables
    - `surveys` - Main survey records with review status
    - `fsus` - First Stage Units (geographic sampling units)
    - `households` - Individual household records within FSUs
    - `scrutiny_changes` - Track all data changes during review process
    - `supervisor_performance` - Performance metrics for supervisors
    - `ds_performance` - Performance metrics for Data Supervisors

  2. Security
    - Enable RLS on all tables
    - Add policies for role-based access control
    - Supervisors can only access their assigned data
    - DS can access data from their state
    - Central users can access all data

  3. Indexes
    - Performance indexes on frequently queried columns
    - Composite indexes for complex queries
*/

-- Surveys table
CREATE TABLE IF NOT EXISTS surveys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  survey_name text NOT NULL,
  state text NOT NULL,
  district text NOT NULL,
  quarter text NOT NULL,
  total_records integer DEFAULT 0,
  records_submitted integer DEFAULT 0,
  records_under_supervisor_review integer DEFAULT 0,
  records_under_ds_review integer DEFAULT 0,
  records_approved integer DEFAULT 0,
  records_rejected integer DEFAULT 0,
  records_pending_correction integer DEFAULT 0,
  submission_date timestamptz DEFAULT now(),
  last_updated timestamptz DEFAULT now(),
  fsu_count integer DEFAULT 0,
  household_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- FSUs (First Stage Units) table
CREATE TABLE IF NOT EXISTS fsus (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  fsu_code text UNIQUE NOT NULL,
  fsu_name text NOT NULL,
  survey_id uuid REFERENCES surveys(id) ON DELETE CASCADE,
  survey_name text NOT NULL,
  state text NOT NULL,
  district text NOT NULL,
  block text NOT NULL,
  village text NOT NULL,
  quarter text NOT NULL,
  enumerator_id text NOT NULL,
  enumerator_name text NOT NULL,
  supervisor_id text NOT NULL,
  supervisor_name text NOT NULL,
  ds_id text NOT NULL,
  ds_name text NOT NULL,
  total_households integer DEFAULT 0,
  households_submitted integer DEFAULT 0,
  households_approved integer DEFAULT 0,
  households_rejected integer DEFAULT 0,
  households_pending_correction integer DEFAULT 0,
  households_under_supervisor_review integer DEFAULT 0,
  households_under_ds_review integer DEFAULT 0,
  data_quality_score numeric(5,2) DEFAULT 0,
  completeness_score numeric(5,2) DEFAULT 0,
  consistency_score numeric(5,2) DEFAULT 0,
  submission_date timestamptz DEFAULT now(),
  last_updated timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Households table
CREATE TABLE IF NOT EXISTS households (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  household_id text UNIQUE NOT NULL,
  fsu_id uuid REFERENCES fsus(id) ON DELETE CASCADE,
  fsu_code text NOT NULL,
  survey_name text NOT NULL,
  state text NOT NULL,
  district text NOT NULL,
  quarter text NOT NULL,
  head_of_household text NOT NULL,
  household_size integer DEFAULT 1,
  enumerator_id text NOT NULL,
  enumerator_name text NOT NULL,
  submission_date timestamptz DEFAULT now(),
  supervisor_review_date timestamptz,
  ds_review_date timestamptz,
  current_status text DEFAULT 'Submitted' CHECK (current_status IN ('Submitted', 'Under Supervisor Review', 'Under DS Review', 'Approved', 'Rejected', 'Pending Correction')),
  supervisor_comments text,
  ds_comments text,
  data_quality_score numeric(5,2) DEFAULT 0,
  completeness_percentage numeric(5,2) DEFAULT 0,
  critical_errors integer DEFAULT 0,
  minor_errors integer DEFAULT 0,
  scrutiny_iterations integer DEFAULT 1,
  original_data jsonb DEFAULT '{}',
  revised_data jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Scrutiny Changes table
CREATE TABLE IF NOT EXISTS scrutiny_changes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  household_id uuid REFERENCES households(id) ON DELETE CASCADE,
  survey_id text,
  schedule text,
  block text,
  field_name text NOT NULL,
  field_label text NOT NULL,
  original_value text,
  revised_value text,
  change_type text DEFAULT 'Correction' CHECK (change_type IN ('Correction', 'Addition', 'Deletion', 'Validation')),
  change_reason text NOT NULL,
  changed_by text DEFAULT 'Supervisor' CHECK (changed_by IN ('Supervisor', 'DS')),
  change_date timestamptz DEFAULT now(),
  severity text DEFAULT 'Minor' CHECK (severity IN ('Critical', 'Major', 'Minor')),
  impact text DEFAULT 'Low' CHECK (impact IN ('High', 'Medium', 'Low')),
  created_at timestamptz DEFAULT now()
);

-- Supervisor Performance table
CREATE TABLE IF NOT EXISTS supervisor_performance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  supervisor_name text NOT NULL,
  supervisor_id text UNIQUE NOT NULL,
  state text NOT NULL,
  district text NOT NULL,
  total_assigned integer DEFAULT 0,
  total_reviewed integer DEFAULT 0,
  total_approved integer DEFAULT 0,
  total_rejected integer DEFAULT 0,
  avg_review_time numeric(5,2) DEFAULT 0,
  quality_score numeric(5,2) DEFAULT 0,
  pending_reviews integer DEFAULT 0,
  last_active timestamptz DEFAULT now(),
  fsus_covered integer DEFAULT 0,
  households_reviewed integer DEFAULT 0,
  critical_errors_found integer DEFAULT 0,
  data_changes_initiated integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- DS Performance table
CREATE TABLE IF NOT EXISTS ds_performance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ds_name text NOT NULL,
  ds_id text UNIQUE NOT NULL,
  state text NOT NULL,
  total_assigned integer DEFAULT 0,
  total_reviewed integer DEFAULT 0,
  total_approved integer DEFAULT 0,
  total_rejected integer DEFAULT 0,
  total_sent_back integer DEFAULT 0,
  avg_review_time numeric(5,2) DEFAULT 0,
  quality_score numeric(5,2) DEFAULT 0,
  pending_reviews integer DEFAULT 0,
  last_active timestamptz DEFAULT now(),
  fsus_covered integer DEFAULT 0,
  households_reviewed integer DEFAULT 0,
  critical_errors_found integer DEFAULT 0,
  data_changes_initiated integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE surveys ENABLE ROW LEVEL SECURITY;
ALTER TABLE fsus ENABLE ROW LEVEL SECURITY;
ALTER TABLE households ENABLE ROW LEVEL SECURITY;
ALTER TABLE scrutiny_changes ENABLE ROW LEVEL SECURITY;
ALTER TABLE supervisor_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE ds_performance ENABLE ROW LEVEL SECURITY;

-- RLS Policies for surveys
CREATE POLICY "Users can read surveys based on role"
  ON surveys FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_role_assignments ura
      JOIN user_roles ur ON ura.role_id = ur.id
      WHERE ura.user_id = auth.uid()
      AND (
        ur.code IN ('ENSD_ADMIN', 'CPG_USER') OR
        (ur.code IN ('RO_USER', 'SSO_USER') AND EXISTS (
          SELECT 1 FROM users u WHERE u.id = auth.uid() AND (u.state = surveys.state OR u.state IS NULL)
        ))
      )
    )
  );

CREATE POLICY "Authorized users can manage surveys"
  ON surveys FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_role_assignments ura
      JOIN user_roles ur ON ura.role_id = ur.id
      WHERE ura.user_id = auth.uid()
      AND ur.code IN ('ENSD_ADMIN', 'CPG_USER', 'RO_USER', 'SSO_USER')
    )
  );

-- RLS Policies for fsus
CREATE POLICY "Users can read FSUs based on role"
  ON fsus FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_role_assignments ura
      JOIN user_roles ur ON ura.role_id = ur.id
      WHERE ura.user_id = auth.uid()
      AND (
        ur.code IN ('ENSD_ADMIN', 'CPG_USER') OR
        (ur.code IN ('RO_USER', 'SSO_USER') AND EXISTS (
          SELECT 1 FROM users u WHERE u.id = auth.uid() AND (u.state = fsus.state OR u.state IS NULL)
        ))
      )
    )
  );

CREATE POLICY "Authorized users can manage FSUs"
  ON fsus FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_role_assignments ura
      JOIN user_roles ur ON ura.role_id = ur.id
      WHERE ura.user_id = auth.uid()
      AND ur.code IN ('ENSD_ADMIN', 'CPG_USER', 'RO_USER', 'SSO_USER')
    )
  );

-- RLS Policies for households
CREATE POLICY "Users can read households based on role"
  ON households FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_role_assignments ura
      JOIN user_roles ur ON ura.role_id = ur.id
      WHERE ura.user_id = auth.uid()
      AND (
        ur.code IN ('ENSD_ADMIN', 'CPG_USER') OR
        (ur.code IN ('RO_USER', 'SSO_USER') AND EXISTS (
          SELECT 1 FROM users u WHERE u.id = auth.uid() AND (u.state = households.state OR u.state IS NULL)
        ))
      )
    )
  );

CREATE POLICY "Authorized users can manage households"
  ON households FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_role_assignments ura
      JOIN user_roles ur ON ura.role_id = ur.id
      WHERE ura.user_id = auth.uid()
      AND ur.code IN ('ENSD_ADMIN', 'CPG_USER', 'RO_USER', 'SSO_USER')
    )
  );

-- RLS Policies for scrutiny_changes
CREATE POLICY "Users can read scrutiny changes based on role"
  ON scrutiny_changes FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM households h
      JOIN user_role_assignments ura ON ura.user_id = auth.uid()
      JOIN user_roles ur ON ura.role_id = ur.id
      WHERE h.id = scrutiny_changes.household_id
      AND (
        ur.code IN ('ENSD_ADMIN', 'CPG_USER') OR
        (ur.code IN ('RO_USER', 'SSO_USER') AND EXISTS (
          SELECT 1 FROM users u WHERE u.id = auth.uid() AND (u.state = h.state OR u.state IS NULL)
        ))
      )
    )
  );

CREATE POLICY "Authorized users can manage scrutiny changes"
  ON scrutiny_changes FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_role_assignments ura
      JOIN user_roles ur ON ura.role_id = ur.id
      WHERE ura.user_id = auth.uid()
      AND ur.code IN ('ENSD_ADMIN', 'CPG_USER', 'RO_USER', 'SSO_USER')
    )
  );

-- RLS Policies for supervisor_performance
CREATE POLICY "Users can read supervisor performance based on role"
  ON supervisor_performance FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_role_assignments ura
      JOIN user_roles ur ON ura.role_id = ur.id
      WHERE ura.user_id = auth.uid()
      AND (
        ur.code IN ('ENSD_ADMIN', 'CPG_USER') OR
        (ur.code IN ('RO_USER', 'SSO_USER') AND EXISTS (
          SELECT 1 FROM users u WHERE u.id = auth.uid() AND (u.state = supervisor_performance.state OR u.state IS NULL)
        ))
      )
    )
  );

CREATE POLICY "Authorized users can manage supervisor performance"
  ON supervisor_performance FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_role_assignments ura
      JOIN user_roles ur ON ura.role_id = ur.id
      WHERE ura.user_id = auth.uid()
      AND ur.code IN ('ENSD_ADMIN', 'CPG_USER', 'RO_USER')
    )
  );

-- RLS Policies for ds_performance
CREATE POLICY "Users can read DS performance based on role"
  ON ds_performance FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_role_assignments ura
      JOIN user_roles ur ON ura.role_id = ur.id
      WHERE ura.user_id = auth.uid()
      AND (
        ur.code IN ('ENSD_ADMIN', 'CPG_USER') OR
        (ur.code IN ('RO_USER', 'SSO_USER') AND EXISTS (
          SELECT 1 FROM users u WHERE u.id = auth.uid() AND (u.state = ds_performance.state OR u.state IS NULL)
        ))
      )
    )
  );

CREATE POLICY "Authorized users can manage DS performance"
  ON ds_performance FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_role_assignments ura
      JOIN user_roles ur ON ura.role_id = ur.id
      WHERE ura.user_id = auth.uid()
      AND ur.code IN ('ENSD_ADMIN', 'CPG_USER', 'RO_USER')
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_surveys_state ON surveys(state);
CREATE INDEX IF NOT EXISTS idx_surveys_quarter ON surveys(quarter);
CREATE INDEX IF NOT EXISTS idx_surveys_survey_name ON surveys(survey_name);

CREATE INDEX IF NOT EXISTS idx_fsus_survey_id ON fsus(survey_id);
CREATE INDEX IF NOT EXISTS idx_fsus_state ON fsus(state);
CREATE INDEX IF NOT EXISTS idx_fsus_fsu_code ON fsus(fsu_code);
CREATE INDEX IF NOT EXISTS idx_fsus_supervisor_id ON fsus(supervisor_id);

CREATE INDEX IF NOT EXISTS idx_households_fsu_id ON households(fsu_id);
CREATE INDEX IF NOT EXISTS idx_households_state ON households(state);
CREATE INDEX IF NOT EXISTS idx_households_status ON households(current_status);
CREATE INDEX IF NOT EXISTS idx_households_household_id ON households(household_id);

CREATE INDEX IF NOT EXISTS idx_scrutiny_changes_household_id ON scrutiny_changes(household_id);
CREATE INDEX IF NOT EXISTS idx_scrutiny_changes_severity ON scrutiny_changes(severity);
CREATE INDEX IF NOT EXISTS idx_scrutiny_changes_changed_by ON scrutiny_changes(changed_by);

CREATE INDEX IF NOT EXISTS idx_supervisor_performance_state ON supervisor_performance(state);
CREATE INDEX IF NOT EXISTS idx_supervisor_performance_supervisor_id ON supervisor_performance(supervisor_id);

CREATE INDEX IF NOT EXISTS idx_ds_performance_state ON ds_performance(state);
CREATE INDEX IF NOT EXISTS idx_ds_performance_ds_id ON ds_performance(ds_id);

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_surveys_updated_at BEFORE UPDATE ON surveys FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_fsus_updated_at BEFORE UPDATE ON fsus FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_households_updated_at BEFORE UPDATE ON households FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_supervisor_performance_updated_at BEFORE UPDATE ON supervisor_performance FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ds_performance_updated_at BEFORE UPDATE ON ds_performance FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();