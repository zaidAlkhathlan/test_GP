-- Update Supplier table to use city_id instead of City text field
-- Add city_id column
ALTER TABLE Supplier ADD COLUMN city_id INTEGER;

-- Update existing records to map current city text to city_id
-- First, let's see what cities exist in the Supplier table
-- UPDATE Supplier SET city_id = (SELECT id FROM City WHERE name = Supplier.City) WHERE City IS NOT NULL;

-- For testing, let's set some default city_id values
UPDATE Supplier SET city_id = 1 WHERE City = 'الرياض';
UPDATE Supplier SET city_id = 2 WHERE City = 'جدة';
UPDATE Supplier SET city_id = 3 WHERE City = 'الدمام';
UPDATE Supplier SET city_id = 4 WHERE City = 'مكة المكرمة';
UPDATE Supplier SET city_id = 5 WHERE City = 'المدينة المنورة';
UPDATE Supplier SET city_id = 6 WHERE City = 'تبوك';
UPDATE Supplier SET city_id = 7 WHERE City = 'بريدة';
UPDATE Supplier SET city_id = 8 WHERE City = 'أبها';
UPDATE Supplier SET city_id = 9 WHERE City = 'حائل';
UPDATE Supplier SET city_id = 10 WHERE City = 'الخبر';

-- Set a default city_id for any remaining records
UPDATE Supplier SET city_id = 1 WHERE city_id IS NULL;

-- Create temporary table with new structure
CREATE TABLE Supplier_new (
  ID INTEGER PRIMARY KEY,
  Commercial_registration_number TEXT NOT NULL,
  Commercial_Phone_number TEXT NOT NULL,
  domains_id INTEGER NOT NULL,
  created_at TIMESTAMP NOT NULL,
  city_id INTEGER NOT NULL,
  updated_at TIMESTAMP NOT NULL,
  Logo TEXT,
  Account_name TEXT NOT NULL,
  Account_email TEXT NOT NULL UNIQUE,
  Account_phone INTEGER NOT NULL,
  company_name TEXT NOT NULL,
  Account_password TEXT NOT NULL,
  FOREIGN KEY (domains_id) REFERENCES domains(ID),
  FOREIGN KEY (city_id) REFERENCES City(id)
);

-- Copy data from old table to new table
INSERT INTO Supplier_new (
  ID, Commercial_registration_number, Commercial_Phone_number, domains_id, 
  created_at, city_id, updated_at, Logo, Account_name, Account_email, 
  Account_phone, company_name, Account_password
)
SELECT 
  ID, Commercial_registration_number, Commercial_Phone_number, domains_id,
  created_at, city_id, updated_at, Logo, Account_name, Account_email,
  Account_phone, company_name, Account_password
FROM Supplier;

-- Drop old table and rename new table
DROP TABLE Supplier;
ALTER TABLE Supplier_new RENAME TO Supplier;

-- Recreate indexes
CREATE INDEX IF NOT EXISTS idx_supplier_domain ON Supplier(domains_id);
CREATE INDEX IF NOT EXISTS idx_supplier_city ON Supplier(city_id);