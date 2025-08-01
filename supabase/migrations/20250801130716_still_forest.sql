/*
  # Insert Sample Data for Survey Management System

  1. Sample Data
    - Insert sample surveys
    - Insert sample FSUs
    - Insert sample households
    - Insert sample scrutiny changes
    - Insert sample performance data

  2. Data Relationships
    - Maintain referential integrity
    - Realistic data distribution
    - Proper status transitions
*/

-- Insert sample surveys
INSERT INTO surveys (id, survey_name, state, district, quarter, total_records, records_submitted, records_under_supervisor_review, records_under_ds_review, records_approved, records_rejected, records_pending_correction, submission_date, fsu_count, household_count) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'National Family Health Survey (NFHS-6)', 'Maharashtra', 'Mumbai', 'Q1 2024', 15420, 15420, 1250, 890, 12180, 650, 450, '2024-01-10', 85, 15420),
('550e8400-e29b-41d4-a716-446655440002', 'Annual Health Survey (AHS)', 'Uttar Pradesh', 'Lucknow', 'Q1 2024', 22350, 22350, 1890, 1240, 18420, 580, 220, '2024-01-08', 120, 22350),
('550e8400-e29b-41d4-a716-446655440003', 'Socio Economic and Caste Census', 'Tamil Nadu', 'Chennai', 'Q2 2024', 18750, 18750, 980, 720, 16250, 450, 350, '2024-01-12', 95, 18750),
('550e8400-e29b-41d4-a716-446655440004', 'Labour Force Survey', 'Karnataka', 'Bangalore', 'Q2 2024', 12890, 12890, 650, 420, 11320, 320, 180, '2024-01-14', 70, 12890),
('550e8400-e29b-41d4-a716-446655440005', 'Consumer Expenditure Survey', 'West Bengal', 'Kolkata', 'Q3 2024', 16240, 16240, 1120, 890, 13580, 420, 230, '2024-01-11', 88, 16240),
('550e8400-e29b-41d4-a716-446655440006', 'Time Use Survey', 'Gujarat', 'Ahmedabad', 'Q3 2024', 9850, 9850, 420, 280, 8890, 180, 80, '2024-01-13', 55, 9850);

-- Insert sample FSUs
INSERT INTO fsus (id, fsu_code, fsu_name, survey_id, survey_name, state, district, block, village, quarter, enumerator_id, enumerator_name, supervisor_id, supervisor_name, ds_id, ds_name, total_households, households_submitted, households_approved, households_rejected, households_pending_correction, households_under_supervisor_review, households_under_ds_review, data_quality_score, completeness_score, consistency_score, submission_date) VALUES
('660e8400-e29b-41d4-a716-446655440001', 'MH-MUM-001', 'Andheri East Block A', '550e8400-e29b-41d4-a716-446655440001', 'National Family Health Survey (NFHS-6)', 'Maharashtra', 'Mumbai', 'Andheri East', 'Chakala', 'Q1 2024', 'ENU001', 'Priya Sharma', 'SUP001', 'Rajesh Kumar', 'DS001', 'Dr. Amit Verma', 180, 180, 165, 8, 4, 2, 1, 92.5, 96.8, 89.2, '2024-01-10'),
('660e8400-e29b-41d4-a716-446655440002', 'UP-LKO-001', 'Gomti Nagar Sector 12', '550e8400-e29b-41d4-a716-446655440002', 'Annual Health Survey (AHS)', 'Uttar Pradesh', 'Lucknow', 'Gomti Nagar', 'Sector 12', 'Q1 2024', 'ENU002', 'Amit Singh', 'SUP002', 'Priya Sharma', 'DS002', 'Dr. Sunita Agarwal', 220, 220, 198, 12, 6, 3, 1, 88.7, 94.2, 91.5, '2024-01-08'),
('660e8400-e29b-41d4-a716-446655440003', 'TN-CHE-001', 'T. Nagar Central', '550e8400-e29b-41d4-a716-446655440003', 'Socio Economic and Caste Census', 'Tamil Nadu', 'Chennai', 'T. Nagar', 'Central Block', 'Q2 2024', 'ENU003', 'Lakshmi Devi', 'SUP003', 'Arjun Patel', 'DS003', 'Dr. Ravi Gupta', 195, 195, 175, 10, 5, 3, 2, 90.3, 93.7, 87.9, '2024-01-12'),
('660e8400-e29b-41d4-a716-446655440004', 'KA-BLR-001', 'Koramangala Block 5', '550e8400-e29b-41d4-a716-446655440004', 'Labour Force Survey', 'Karnataka', 'Bangalore', 'Koramangala', 'Block 5', 'Q2 2024', 'ENU004', 'Suresh Reddy', 'SUP004', 'Meera Reddy', 'DS004', 'Dr. Kavita Joshi', 165, 165, 152, 7, 3, 2, 1, 94.1, 97.2, 92.8, '2024-01-14');

-- Insert sample households
INSERT INTO households (id, household_id, fsu_id, fsu_code, survey_name, state, district, quarter, head_of_household, household_size, enumerator_id, enumerator_name, submission_date, supervisor_review_date, ds_review_date, current_status, supervisor_comments, ds_comments, data_quality_score, completeness_percentage, critical_errors, minor_errors, scrutiny_iterations, original_data, revised_data) VALUES
('770e8400-e29b-41d4-a716-446655440001', 'MH-MUM-001-HH001', '660e8400-e29b-41d4-a716-446655440001', 'MH-MUM-001', 'National Family Health Survey (NFHS-6)', 'Maharashtra', 'Mumbai', 'Q1 2024', 'Ramesh Patel', 4, 'ENU001', 'Priya Sharma', '2024-01-10', '2024-01-12', '2024-01-14', 'Approved', 'Data quality good, minor corrections made', 'Final approval after verification', 94.5, 98.2, 0, 2, 2, '{"household_income": 45000, "education_level": "Graduate", "family_size": 4}', '{"household_income": 42000, "education_level": "Post Graduate", "family_size": 4}'),
('770e8400-e29b-41d4-a716-446655440002', 'MH-MUM-001-HH002', '660e8400-e29b-41d4-a716-446655440001', 'MH-MUM-001', 'National Family Health Survey (NFHS-6)', 'Maharashtra', 'Mumbai', 'Q1 2024', 'Sunita Devi', 6, 'ENU001', 'Priya Sharma', '2024-01-10', '2024-01-13', NULL, 'Under DS Review', 'Multiple inconsistencies found, requires DS review', NULL, 76.8, 89.5, 2, 5, 3, '{"birth_date": "2018-05-15", "vaccination_status": "Complete", "family_size": 6}', '{"birth_date": "2019-05-15", "vaccination_status": "Incomplete", "family_size": 6}'),
('770e8400-e29b-41d4-a716-446655440003', 'UP-LKO-001-HH001', '660e8400-e29b-41d4-a716-446655440002', 'UP-LKO-001', 'Annual Health Survey (AHS)', 'Uttar Pradesh', 'Lucknow', 'Q1 2024', 'Rajesh Kumar', 5, 'ENU002', 'Amit Singh', '2024-01-08', '2024-01-10', '2024-01-12', 'Approved', 'Good data quality overall', 'Approved with minor corrections', 91.2, 95.8, 0, 3, 1, '{"occupation": "Farmer", "family_size": 5}', '{"occupation": "Agricultural Laborer", "family_size": 5}');

-- Insert sample scrutiny changes
INSERT INTO scrutiny_changes (id, household_id, survey_id, schedule, block, field_name, field_label, original_value, revised_value, change_type, change_reason, changed_by, change_date, severity, impact) VALUES
('880e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001', 'NFHS-6', 'Schedule 1.0', 'Block A', 'household_income', 'Monthly Household Income', '45000', '42000', 'Correction', 'Income verification through documents', 'Supervisor', '2024-01-12', 'Minor', 'Low'),
('880e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440001', 'NFHS-6', 'Schedule 1.0', 'Block A', 'education_level', 'Head Education Level', 'Graduate', 'Post Graduate', 'Correction', 'Certificate verification', 'DS', '2024-01-14', 'Minor', 'Medium'),
('880e8400-e29b-41d4-a716-446655440003', '770e8400-e29b-41d4-a716-446655440002', 'NFHS-6', 'Schedule 2.1', 'Block A', 'birth_date', 'Date of Birth - Child 1', '2018-05-15', '2019-05-15', 'Correction', 'Age inconsistency with vaccination records', 'Supervisor', '2024-01-13', 'Critical', 'High'),
('880e8400-e29b-41d4-a716-446655440004', '770e8400-e29b-41d4-a716-446655440002', 'NFHS-6', 'Schedule 2.1', 'Block A', 'vaccination_status', 'Vaccination Status', 'Complete', 'Incomplete', 'Correction', 'Missing BCG vaccination record', 'Supervisor', '2024-01-13', 'Major', 'High'),
('880e8400-e29b-41d4-a716-446655440005', '770e8400-e29b-41d4-a716-446655440003', 'AHS', 'Schedule 2.1', 'Sector 12', 'occupation', 'Primary Occupation', 'Farmer', 'Agricultural Laborer', 'Correction', 'Clarification of employment status', 'Supervisor', '2024-01-10', 'Minor', 'Medium');

-- Insert sample supervisor performance data
INSERT INTO supervisor_performance (id, supervisor_name, supervisor_id, state, district, total_assigned, total_reviewed, total_approved, total_rejected, avg_review_time, quality_score, pending_reviews, last_active, fsus_covered, households_reviewed, critical_errors_found, data_changes_initiated) VALUES
('990e8400-e29b-41d4-a716-446655440001', 'Rajesh Kumar', 'SUP001', 'Maharashtra', 'Mumbai', 2450, 2180, 1890, 290, 4.2, 92.5, 270, '2024-01-15 14:30:00', 15, 2180, 45, 156),
('990e8400-e29b-41d4-a716-446655440002', 'Priya Sharma', 'SUP002', 'Uttar Pradesh', 'Lucknow', 3120, 2890, 2650, 240, 3.8, 95.2, 230, '2024-01-15 16:45:00', 18, 2890, 32, 198),
('990e8400-e29b-41d4-a716-446655440003', 'Arjun Patel', 'SUP003', 'Gujarat', 'Ahmedabad', 1890, 1720, 1580, 140, 5.1, 88.7, 170, '2024-01-15 13:20:00', 12, 1720, 58, 142),
('990e8400-e29b-41d4-a716-446655440004', 'Meera Reddy', 'SUP004', 'Tamil Nadu', 'Chennai', 2680, 2420, 2180, 240, 4.6, 91.8, 260, '2024-01-15 15:10:00', 16, 2420, 41, 167),
('990e8400-e29b-41d4-a716-446655440005', 'Vikram Singh', 'SUP005', 'Karnataka', 'Bangalore', 2150, 1980, 1820, 160, 3.9, 93.4, 170, '2024-01-15 17:25:00', 14, 1980, 38, 134);

-- Insert sample DS performance data
INSERT INTO ds_performance (id, ds_name, ds_id, state, total_assigned, total_reviewed, total_approved, total_rejected, total_sent_back, avg_review_time, quality_score, pending_reviews, last_active, fsus_covered, households_reviewed, critical_errors_found, data_changes_initiated) VALUES
('aa0e8400-e29b-41d4-a716-446655440001', 'Dr. Amit Verma', 'DS001', 'Maharashtra', 1890, 1650, 1420, 180, 50, 6.8, 94.2, 240, '2024-01-15 16:30:00', 12, 1650, 28, 89),
('aa0e8400-e29b-41d4-a716-446655440002', 'Dr. Sunita Agarwal', 'DS002', 'Uttar Pradesh', 2650, 2380, 2120, 190, 70, 5.9, 96.1, 270, '2024-01-15 18:15:00', 15, 2380, 22, 76),
('aa0e8400-e29b-41d4-a716-446655440003', 'Dr. Ravi Gupta', 'DS003', 'Tamil Nadu', 2180, 1920, 1680, 160, 80, 7.2, 92.8, 260, '2024-01-15 14:45:00', 13, 1920, 35, 98),
('aa0e8400-e29b-41d4-a716-446655440004', 'Dr. Kavita Joshi', 'DS004', 'Karnataka', 1820, 1620, 1450, 120, 50, 6.1, 95.7, 200, '2024-01-15 17:50:00', 11, 1620, 19, 67),
('aa0e8400-e29b-41d4-a716-446655440005', 'Dr. Manoj Tiwari', 'DS005', 'Gujarat', 1580, 1420, 1280, 100, 40, 5.4, 93.9, 160, '2024-01-15 16:20:00', 10, 1420, 25, 72);