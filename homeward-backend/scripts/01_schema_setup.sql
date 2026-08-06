-- 1. Create Households Table (The shared family entity)
CREATE TABLE households (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    total_loan_amount NUMERIC NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Create Members Table (The individuals contributing)
CREATE TABLE members (
    id TEXT PRIMARY KEY,
    household_id TEXT REFERENCES households(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    role TEXT NOT NULL, -- e.g., 'admin' or 'member'
    access_key TEXT UNIQUE NOT NULL, -- The one-time login code
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Create Payments Table (The ledger)
CREATE TABLE payments (
    id TEXT PRIMARY KEY,
    member_id TEXT REFERENCES members(id) ON DELETE CASCADE,
    member_name TEXT NOT NULL, -- Stored directly here to optimize API read speeds
    amount NUMERIC NOT NULL CHECK (amount > 0),
    is_milestone BOOLEAN DEFAULT FALSE,
    timestamp TIMESTAMPTZ DEFAULT now()
);

-- 4. Create Milestones Table (The gamified progress)
CREATE TABLE milestones (
    id TEXT PRIMARY KEY,
    household_id TEXT REFERENCES households(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    target_percentage NUMERIC NOT NULL,
    is_unlocked BOOLEAN DEFAULT FALSE,
    unlocked_at TIMESTAMPTZ
);