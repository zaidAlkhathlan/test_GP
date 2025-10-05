-- Add sample license requirements for tender ID 1 (if it exists)
INSERT OR IGNORE INTO tender_required_licenses (tender_id, license_code, is_mandatory) VALUES
-- For Construction/Engineering tenders
(1, 'CR', 1),              -- Commercial Registration (mandatory)
(1, 'CLASS-CONTRACT', 1),   -- Contractor Classification (mandatory) 
(1, 'ENG', 1),             -- Engineering Office License (mandatory)
(1, 'CIVDEF', 1),          -- Civil Defense Safety (mandatory)
(1, 'BALADY', 0),          -- Municipal License (optional)
(1, 'ENV', 0),             -- Environmental License (optional)
(1, 'GOSI', 1);            -- Social Insurance (mandatory)

-- Add for any other existing tenders (example for tender ID 2, 3)
INSERT OR IGNORE INTO tender_required_licenses (tender_id, license_code, is_mandatory) VALUES
-- For Tech/Software tenders
(2, 'CR', 1),              -- Commercial Registration (mandatory)
(2, 'VAT', 1),             -- VAT Registration (mandatory)
(2, 'GOSI', 1),            -- Social Insurance (mandatory)
(2, 'ISP', 0),             -- Internet Service Provider (optional)
(2, 'PAYMENT', 0);         -- Payment Services (optional)

INSERT OR IGNORE INTO tender_required_licenses (tender_id, license_code, is_mandatory) VALUES  
-- For Medical/Healthcare tenders
(3, 'CR', 1),              -- Commercial Registration (mandatory)
(3, 'FOOD', 1),            -- Food Facility License (mandatory)
(3, 'DRUG', 0),            -- Pharmaceutical License (optional)
(3, 'LAB', 0),             -- Medical Laboratory (optional)
(3, 'CIVDEF', 1),          -- Civil Defense Safety (mandatory)
(3, 'GOSI', 1);            -- Social Insurance (mandatory)