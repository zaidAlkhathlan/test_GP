-- Migration script to normalize city field in Tender table
-- This script will:
-- 1. Create Region table
-- 2. Create City table
-- 3. Add city_id to Tender table
-- 4. Migrate existing city data
-- 5. Remove old city column

BEGIN TRANSACTION;

-- Step 1: Create Region table
CREATE TABLE IF NOT EXISTS Region (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
);

-- Step 2: Insert all Saudi regions
INSERT OR IGNORE INTO Region (id, name) VALUES
(1, 'الرياض'),
(2, 'مكة المكرمة'),
(3, 'المدينة المنورة'),
(4, 'القصيم'),
(5, 'الشرقية'),
(6, 'عسير'),
(7, 'تبوك'),
(8, 'حائل'),
(9, 'الحدود الشمالية'),
(10, 'جازان'),
(11, 'نجران'),
(12, 'الباحة'),
(13, 'الجوف');

-- Step 3: Create City table
CREATE TABLE IF NOT EXISTS City (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    region_id INTEGER NOT NULL,
    FOREIGN KEY (region_id) REFERENCES Region(id)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    UNIQUE(region_id, name)
);

-- Step 4: Insert all cities for each region
INSERT OR IGNORE INTO City (name, region_id) VALUES
-- الرياض
('الرياض', 1), ('الخرج', 1), ('الدوادمي', 1), ('المجمعة', 1), ('الزلفي', 1), 
('شقراء', 1), ('وادي الدواسر', 1), ('عفيف', 1), ('حوطة بني تميم', 1), 
('الأفلاج', 1), ('السليل', 1), ('الغاط', 1),

-- مكة المكرمة
('مكة المكرمة', 2), ('جدة', 2), ('الطائف', 2), ('رابغ', 2), ('القنفذة', 2), 
('الليث', 2), ('خليص', 2), ('الكامل', 2), ('تربة', 2), ('رنية', 2), ('الخرمة', 2),

-- المدينة المنورة
('المدينة المنورة', 3), ('ينبع', 3), ('العلا', 3), ('الحناكية', 3), ('خيبر', 3), 
('مهد الذهب', 3), ('بدر', 3),

-- القصيم
('بريدة', 4), ('عنيزة', 4), ('الرس', 4), ('المذنب', 4), ('البكيرية', 4), 
('البدائع', 4), ('رياض الخبراء', 4), ('عيون الجواء', 4), ('الأسياح', 4),

-- الشرقية
('الدمام', 5), ('الخبر', 5), ('الظهران', 5), ('الجبيل', 5), ('الأحساء', 5), 
('الهفوف', 5), ('القطيف', 5), ('رأس تنورة', 5), ('بقيق', 5), ('النعيرية', 5), 
('الخفجي', 5), ('حفر الباطن', 5), ('قرية العليا', 5),

-- عسير
('أبها', 6), ('خميس مشيط', 6), ('بيشة', 6), ('النماص', 6), ('محايل عسير', 6), 
('ظهران الجنوب', 6), ('رجال ألمع', 6), ('سراة عبيدة', 6), ('تثليث', 6),

-- تبوك
('تبوك', 7), ('الوجه', 7), ('ضباء', 7), ('أملج', 7), ('تيماء', 7), ('حقل', 7),

-- حائل
('حائل', 8), ('بقعاء', 8), ('الشنان', 8), ('الغزالة', 8),

-- الحدود الشمالية
('عرعر', 9), ('رفحاء', 9), ('طريف', 9),

-- جازان
('جازان', 10), ('صبيا', 10), ('أبو عريش', 10), ('صامطة', 10), ('بيش', 10), 
('الدرب', 10), ('العارضة', 10), ('العيدابي', 10), ('فيفاء', 10), ('الحرث', 10),

-- نجران
('نجران', 11), ('شرورة', 11), ('حبونا', 11), ('بدر الجنوب', 11), ('يدمه', 11),

-- الباحة
('الباحة', 12), ('بلجرشي', 12), ('المخواة', 12), ('قلوة', 12), ('العقيق', 12), 
('المندق', 12), ('بني حسن', 12),

-- الجوف
('سكاكا', 13), ('دومة الجندل', 13), ('القريات', 13), ('طبرجل', 13);

-- Step 5: Add city_id column to tender table
ALTER TABLE tender ADD COLUMN city_id INTEGER;

-- Step 6: Create a mapping for existing cities to handle variations
-- Insert any missing cities that exist in tender table but not in our predefined list
INSERT OR IGNORE INTO City (name, region_id) 
SELECT DISTINCT 
    t.city,
    CASE 
        WHEN LOWER(t.city) IN ('الرياض', 'riyadh') THEN 1
        WHEN LOWER(t.city) IN ('جدة', 'jeddah') THEN 2
        WHEN LOWER(t.city) IN ('test', 'hi', 'zaid', '222', '1', '3', 'file') THEN 1  -- Default test data to Riyadh
        ELSE 1  -- Default to Riyadh for any unrecognized cities
    END
FROM tender t 
WHERE t.city IS NOT NULL 
AND t.city != ''
AND NOT EXISTS (
    SELECT 1 FROM City c WHERE c.name = t.city
);

-- Step 7: Update tender records to set city_id based on city name
UPDATE tender 
SET city_id = (
    SELECT c.id 
    FROM City c 
    WHERE c.name = tender.city
    OR (LOWER(tender.city) = 'riyadh' AND c.name = 'الرياض')
    OR (LOWER(tender.city) = 'jeddah' AND c.name = 'جدة')
    LIMIT 1
)
WHERE city IS NOT NULL 
AND city != '';

-- Step 8: Set default city for records with no city (الرياض)
UPDATE tender 
SET city_id = 1  -- الرياض
WHERE city_id IS NULL;

-- Step 9: Add foreign key constraint by recreating the table
-- First, create the new table structure
CREATE TABLE tender_new (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    buyer_id INTEGER NOT NULL,
    reference_number INTEGER,
    title TEXT NOT NULL,
    domain_id INTEGER NOT NULL,
    project_description TEXT,
    city_id INTEGER NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    submit_deadline TEXT,
    quires_deadline TEXT,
    contract_time TEXT,
    previous_work TEXT,
    evaluation_criteria TEXT,
    used_technologies TEXT,
    tender_coordinator TEXT,
    coordinator_email TEXT,
    coordinator_phone TEXT,
    file1 BLOB,
    file2 BLOB,
    file1_name TEXT,
    file2_name TEXT,
    expected_budget REAL,
    FOREIGN KEY (city_id) REFERENCES City(id)
        ON UPDATE CASCADE ON DELETE RESTRICT
);

-- Copy data to new table
INSERT INTO tender_new 
SELECT 
    id, buyer_id, reference_number, title, domain_id, project_description,
    city_id, created_at, submit_deadline, quires_deadline, contract_time,
    previous_work, evaluation_criteria, used_technologies, tender_coordinator,
    coordinator_email, coordinator_phone, file1, file2, file1_name, file2_name,
    expected_budget
FROM tender;

-- Drop old table and rename new one
DROP TABLE tender;
ALTER TABLE tender_new RENAME TO tender;

COMMIT;

-- Verification query
SELECT 'Migration completed successfully. Sample data:' as status;
SELECT t.id, t.title, c.name AS city, r.name AS region
FROM tender t
JOIN City c ON t.city_id = c.id
JOIN Region r ON c.region_id = r.id
LIMIT 5;