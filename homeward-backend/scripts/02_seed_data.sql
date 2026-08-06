-- 1. Seed the Household
INSERT INTO households (id, name, total_loan_amount)
VALUES ('hh_98765', 'The Mistry Home', 5000000.00); 

-- 2. Seed the Members (with their one-time access keys)
INSERT INTO members (id, household_id, name, role, access_key)
VALUES
    ('mem_12345', 'hh_98765', 'Hemant', 'admin', 'MISTRY-COOP-2026'),
    ('mem_67890', 'hh_98765', 'Dad', 'member', 'DAD-COOP-2026'),
    ('mem_54321', 'hh_98765', 'Mom', 'member', 'MOM-COOP-2026');

-- 3. Seed the Payment Ledger (Simulating recent activity)
-- We use Postgres interval math to make the timestamps look like they just happened
INSERT INTO payments (id, member_id, member_name, amount, is_milestone, timestamp)
VALUES
    ('pay_001', 'mem_54321', 'Mom', 1200.00, FALSE, now() - interval '2 hours'),
    ('pay_002', 'mem_67890', 'Dad', 150.00, FALSE, now() - interval '1 day'),
    ('pay_003', 'mem_12345', 'Hemant', 500.00, TRUE, now() - interval '3 days');

-- 4. Seed the Milestones (For the curved path progress)
INSERT INTO milestones (id, household_id, title, target_percentage, is_unlocked, unlocked_at)
VALUES
    ('ms_25', 'hh_98765', 'The Foundation', 25.0, TRUE, now() - interval '180 days'),
    ('ms_50', 'hh_98765', 'Halfway There', 50.0, TRUE, now() - interval '30 days'),
    ('ms_75', 'hh_98765', 'The Final Stretch', 75.0, FALSE, NULL),
    ('ms_100', 'hh_98765', 'Homeward', 100.0, FALSE, NULL);