-- Add new columns to existing Licenses table
ALTER TABLE Licenses ADD COLUMN code TEXT;
ALTER TABLE Licenses ADD COLUMN name_ar TEXT;
ALTER TABLE Licenses ADD COLUMN name_en TEXT; 
ALTER TABLE Licenses ADD COLUMN category TEXT;
ALTER TABLE Licenses ADD COLUMN description_ar TEXT;
ALTER TABLE Licenses ADD COLUMN description_en TEXT;
ALTER TABLE Licenses ADD COLUMN created_at DATETIME DEFAULT CURRENT_TIMESTAMP;

-- Update existing licenses if any exist
UPDATE Licenses SET name_ar = Name, name_en = Name WHERE Name IS NOT NULL;

-- Create unique index on code (will be set below)
-- CREATE UNIQUE INDEX idx_licenses_code ON Licenses(code);

-- Insert/Update license data with codes
-- First, clear existing data and insert fresh license data with proper codes
DELETE FROM Licenses;

-- Reset auto-increment
DELETE FROM sqlite_sequence WHERE name='Licenses';

-- Insert license data with proper structure
INSERT INTO Licenses (ID, code, Name, name_ar, name_en, category, description_ar, description_en) VALUES 
(1, 'INV', 'رخصة الاستثمار الأجنبي', 'رخصة الاستثمار الأجنبي', 'Foreign Investment License', 'general', 'رخصة مطلوبة للاستثمار الأجنبي في المملكة', 'License required for foreign investment in Saudi Arabia'),
(2, 'CR', 'السجل التجاري', 'السجل التجاري', 'Commercial Registration', 'general', 'السجل التجاري الأساسي لممارسة النشاط التجاري', 'Basic commercial registration for business activities'),
(3, 'VAT', 'شهادة التسجيل الضريبي / ضريبة القيمة المضافة', 'شهادة التسجيل الضريبي / ضريبة القيمة المضافة', 'VAT Registration Certificate', 'general', 'شهادة تسجيل ضريبة القيمة المضافة', 'Value Added Tax registration certificate'),
(4, 'GOSI', 'شهادة التأمينات الاجتماعية', 'شهادة التأمينات الاجتماعية', 'Social Insurance Certificate', 'general', 'شهادة التأمينات الاجتماعية للموظفين', 'Social insurance certificate for employees'),
(5, 'NITAQ', 'شهادة الالتزام بنطاقات العمل', 'شهادة الالتزام بنطاقات العمل', 'Nitaqat Compliance Certificate', 'general', 'شهادة الالتزام بنظام نطاقات العمل', 'Employment localization compliance certificate'),
(6, 'BALADY', 'الرخصة البلدية (بلدي)', 'الرخصة البلدية (بلدي)', 'Municipal License', 'construction', 'الرخصة البلدية لممارسة النشاط', 'Municipal license for business activities'),
(7, 'ENV', 'الترخيص البيئي', 'الترخيص البيئي', 'Environmental License', 'general', 'ترخيص الأثر البيئي للمشاريع', 'Environmental impact license for projects'),
(8, 'CIVDEF', 'شهادة السلامة / الدفاع المدني', 'شهادة السلامة / الدفاع المدني', 'Civil Defense Safety Certificate', 'general', 'شهادة السلامة من الدفاع المدني', 'Civil defense safety certificate'),
(9, 'CLASS-CONTRACT', 'شهادة تصنيف المقاولين', 'شهادة تصنيف المقاولين', 'Contractor Classification Certificate', 'construction', 'شهادة تصنيف المقاولين حسب التخصص والدرجة', 'Contractor classification certificate by specialty and grade'),
(10, 'ENG', 'رخصة مكتب هندسي', 'رخصة مكتب هندسي', 'Engineering Office License', 'construction', 'رخصة ممارسة مهنة الهندسة', 'Engineering profession practice license'),
(11, 'IND', 'رخصة صناعية', 'رخصة صناعية', 'Industrial License', 'industrial', 'رخصة ممارسة النشاط الصناعي', 'Industrial activity license'),
(12, 'ELEC', 'رخصة توليد أو توزيع كهرباء', 'رخصة توليد أو توزيع كهرباء', 'Electricity Generation/Distribution License', 'industrial', 'رخصة توليد أو توزيع الطاقة الكهربائية', 'Electricity generation or distribution license'),
(13, 'MINING', 'رخصة كشف أو استغلال منجم', 'رخصة كشف أو استغلال منجم', 'Mining License', 'industrial', 'رخصة استكشاف أو استغلال المناجم', 'Mine exploration or exploitation license'),
(14, 'FOOD', 'رخصة منشأة غذائية', 'رخصة منشأة غذائية', 'Food Facility License', 'medical', 'رخصة إنشاء وتشغيل منشأة غذائية', 'Food facility establishment and operation license'),
(15, 'DRUG', 'رخصة منشأة دوائية', 'رخصة منشأة دوائية', 'Pharmaceutical Facility License', 'medical', 'رخصة إنشاء وتشغيل منشأة دوائية', 'Pharmaceutical facility license'),
(16, 'MEDDEV', 'رخصة منشأة أجهزة طبية', 'رخصة منشأة أجهزة طبية', 'Medical Device Facility License', 'medical', 'رخصة تصنيع أو توزيع الأجهزة الطبية', 'Medical device manufacturing or distribution license'),
(17, 'HOSP', 'رخصة مستشفى خاص', 'رخصة مستشفى خاص', 'Private Hospital License', 'medical', 'رخصة تشغيل مستشفى خاص', 'Private hospital operation license'),
(18, 'CLINIC', 'رخصة مجمع عيادات', 'رخصة مجمع عيادات', 'Medical Clinic Complex License', 'medical', 'رخصة تشغيل مجمع عيادات طبية', 'Medical clinic complex operation license'),
(19, 'LAB', 'رخصة مختبر طبي', 'رخصة مختبر طبي', 'Medical Laboratory License', 'medical', 'رخصة تشغيل مختبر طبي', 'Medical laboratory operation license'),
(20, 'ISP', 'رخصة مزود خدمة إنترنت', 'رخصة مزود خدمة إنترنت', 'Internet Service Provider License', 'tech', 'رخصة تقديم خدمات الإنترنت', 'Internet service provider license'),
(21, 'FREIGHT', 'رخصة وسيط شحن بري', 'رخصة وسيط شحن بري', 'Land Freight Broker License', 'transport', 'رخصة الوساطة في الشحن البري', 'Land freight brokerage license'),
(22, 'FLEET', 'رخصة تشغيل أسطول / تأجير مركبات', 'رخصة تشغيل أسطول / تأجير مركبات', 'Fleet Operation/Vehicle Rental License', 'transport', 'رخصة تشغيل أسطول أو تأجير المركبات', 'Fleet operation or vehicle rental license'),
(23, 'AOC', 'شهادة مشغل جوي (AOC)', 'شهادة مشغل جوي (AOC)', 'Air Operator Certificate', 'transport', 'شهادة مشغل الطيران التجاري', 'Commercial aviation operator certificate'),
(24, 'AIR-FREIGHT', 'رخصة وكالة شحن جوي', 'رخصة وكالة شحن جوي', 'Air Freight Agency License', 'transport', 'رخصة وكالة الشحن الجوي', 'Air freight agency license'),
(25, 'BANK', 'رخصة بنك', 'رخصة بنك', 'Banking License', 'finance', 'رخصة ممارسة الأعمال المصرفية', 'Banking business license'),
(26, 'FINANCE', 'رخصة شركة تمويل', 'رخصة شركة تمويل', 'Finance Company License', 'finance', 'رخصة شركة التمويل', 'Finance company license'),
(27, 'INSURANCE', 'رخصة شركة تأمين', 'رخصة شركة تأمين', 'Insurance Company License', 'finance', 'رخصة شركة التأمين', 'Insurance company license'),
(28, 'PAYMENT', 'رخصة خدمات مدفوعات', 'رخصة خدمات مدفوعات', 'Payment Services License', 'finance', 'رخصة مزود خدمات الدفع', 'Payment services provider license'),
(29, 'CMA', 'رخصة أشخاص مرخص لهم (سوق مالية)', 'رخصة أشخاص مرخص لهم (سوق مالية)', 'Capital Market Authority License', 'finance', 'رخصة هيئة السوق المالية', 'Capital Market Authority license');

-- Add some sample tender-license associations for existing tenders
-- This will show licenses for tender ID 1 if it exists
INSERT OR IGNORE INTO tender_required_licenses (tender_id, license_code, is_mandatory) VALUES
(1, 'CR', 1),  -- Commercial Registration (mandatory)
(1, 'CLASS-CONTRACT', 1),  -- Contractor Classification (mandatory)
(1, 'CIVDEF', 1),  -- Civil Defense Safety (mandatory)  
(1, 'BALADY', 0),  -- Municipal License (optional)
(1, 'ENV', 0);     -- Environmental License (optional)