-- Create licenses table
CREATE TABLE IF NOT EXISTS licenses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT NOT NULL UNIQUE,
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  description_ar TEXT,
  description_en TEXT,
  category TEXT, -- e.g., 'general', 'construction', 'medical', 'tech'
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create tender_required_licenses junction table  
CREATE TABLE IF NOT EXISTS tender_required_licenses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tender_id INTEGER NOT NULL,
  license_code TEXT NOT NULL,
  is_mandatory BOOLEAN DEFAULT true,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (tender_id) REFERENCES tender(id) ON DELETE CASCADE,
  FOREIGN KEY (license_code) REFERENCES licenses(code) ON DELETE CASCADE
);

-- Insert license data
INSERT OR IGNORE INTO licenses (code, name_ar, name_en, category, description_ar, description_en) VALUES 
('INV', 'رخصة الاستثمار الأجنبي', 'Foreign Investment License', 'general', 'رخصة مطلوبة للاستثمار الأجنبي في المملكة', 'License required for foreign investment in Saudi Arabia'),
('CR', 'السجل التجاري', 'Commercial Registration', 'general', 'السجل التجاري الأساسي لممارسة النشاط التجاري', 'Basic commercial registration for business activities'),
('VAT', 'شهادة التسجيل الضريبي / ضريبة القيمة المضافة', 'VAT Registration Certificate', 'general', 'شهادة تسجيل ضريبة القيمة المضافة', 'Value Added Tax registration certificate'),
('GOSI', 'شهادة التأمينات الاجتماعية', 'Social Insurance Certificate', 'general', 'شهادة التأمينات الاجتماعية للموظفين', 'Social insurance certificate for employees'),
('NITAQ', 'شهادة الالتزام بنطاقات العمل', 'Nitaqat Compliance Certificate', 'general', 'شهادة الالتزام بنظام نطاقات العمل', 'Employment localization compliance certificate'),
('BALADY', 'الرخصة البلدية (بلدي)', 'Municipal License', 'construction', 'الرخصة البلدية لممارسة النشاط', 'Municipal license for business activities'),
('ENV', 'الترخيص البيئي', 'Environmental License', 'general', 'ترخيص الأثر البيئي للمشاريع', 'Environmental impact license for projects'),
('CIVDEF', 'شهادة السلامة / الدفاع المدني', 'Civil Defense Safety Certificate', 'general', 'شهادة السلامة من الدفاع المدني', 'Civil defense safety certificate'),
('CLASS-CONTRACT', 'شهادة تصنيف المقاولين', 'Contractor Classification Certificate', 'construction', 'شهادة تصنيف المقاولين حسب التخصص والدرجة', 'Contractor classification certificate by specialty and grade'),
('ENG', 'رخصة مكتب هندسي', 'Engineering Office License', 'construction', 'رخصة ممارسة مهنة الهندسة', 'Engineering profession practice license'),
('IND', 'رخصة صناعية', 'Industrial License', 'industrial', 'رخصة ممارسة النشاط الصناعي', 'Industrial activity license'),
('ELEC', 'رخصة توليد أو توزيع كهرباء', 'Electricity Generation/Distribution License', 'industrial', 'رخصة توليد أو توزيع الطاقة الكهربائية', 'Electricity generation or distribution license'),
('MINING', 'رخصة كشف أو استغلال منجم', 'Mining License', 'industrial', 'رخصة استكشاف أو استغلال المناجم', 'Mine exploration or exploitation license'),
('FOOD', 'رخصة منشأة غذائية', 'Food Facility License', 'medical', 'رخصة إنشاء وتشغيل منشأة غذائية', 'Food facility establishment and operation license'),
('DRUG', 'رخصة منشأة دوائية', 'Pharmaceutical Facility License', 'medical', 'رخصة إنشاء وتشغيل منشأة دوائية', 'Pharmaceutical facility license'),
('MEDDEV', 'رخصة منشأة أجهزة طبية', 'Medical Device Facility License', 'medical', 'رخصة تصنيع أو توزيع الأجهزة الطبية', 'Medical device manufacturing or distribution license'),
('HOSP', 'رخصة مستشفى خاص', 'Private Hospital License', 'medical', 'رخصة تشغيل مستشفى خاص', 'Private hospital operation license'),
('CLINIC', 'رخصة مجمع عيادات', 'Medical Clinic Complex License', 'medical', 'رخصة تشغيل مجمع عيادات طبية', 'Medical clinic complex operation license'),
('LAB', 'رخصة مختبر طبي', 'Medical Laboratory License', 'medical', 'رخصة تشغيل مختبر طبي', 'Medical laboratory operation license'),
('ISP', 'رخصة مزود خدمة إنترنت', 'Internet Service Provider License', 'tech', 'رخصة تقديم خدمات الإنترنت', 'Internet service provider license'),
('FREIGHT', 'رخصة وسيط شحن بري', 'Land Freight Broker License', 'transport', 'رخصة الوساطة في الشحن البري', 'Land freight brokerage license'),
('FLEET', 'رخصة تشغيل أسطول / تأجير مركبات', 'Fleet Operation/Vehicle Rental License', 'transport', 'رخصة تشغيل أسطول أو تأجير المركبات', 'Fleet operation or vehicle rental license'),
('AOC', 'شهادة مشغل جوي (AOC)', 'Air Operator Certificate', 'transport', 'شهادة مشغل الطيران التجاري', 'Commercial aviation operator certificate'),
('AIR-FREIGHT', 'رخصة وكالة شحن جوي', 'Air Freight Agency License', 'transport', 'رخصة وكالة الشحن الجوي', 'Air freight agency license'),
('BANK', 'رخصة بنك', 'Banking License', 'finance', 'رخصة ممارسة الأعمال المصرفية', 'Banking business license'),
('FINANCE', 'رخصة شركة تمويل', 'Finance Company License', 'finance', 'رخصة شركة التمويل', 'Finance company license'),
('INSURANCE', 'رخصة شركة تأمين', 'Insurance Company License', 'finance', 'رخصة شركة التأمين', 'Insurance company license'),
('PAYMENT', 'رخصة خدمات مدفوعات', 'Payment Services License', 'finance', 'رخصة مزود خدمات الدفع', 'Payment services provider license'),
('CMA', 'رخصة أشخاص مرخص لهم (سوق مالية)', 'Capital Market Authority License', 'finance', 'رخصة هيئة السوق المالية', 'Capital Market Authority license');