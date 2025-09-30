-- =============================================================================
-- SQL INSERT Statements for Domains and Sub-Domains
-- Generated for SQLite database
-- =============================================================================

-- Clear existing data (optional - remove if you want to keep existing data)
-- DELETE FROM sub_domains;
-- DELETE FROM domains;

-- =============================================================================
-- DOMAINS TABLE INSERTS
-- =============================================================================

INSERT INTO domains (ID, Name) VALUES (1, 'الاستشارات');
INSERT INTO domains (ID, Name) VALUES (2, 'تقنية المعلومات والبرمجيات');
INSERT INTO domains (ID, Name) VALUES (3, 'الإنشاءات والتشييد');
INSERT INTO domains (ID, Name) VALUES (4, 'الصحة والعلوم الحيوية');
INSERT INTO domains (ID, Name) VALUES (5, 'التعليم والتدريب');
INSERT INTO domains (ID, Name) VALUES (6, 'التسويق والإعلام والإبداع');
INSERT INTO domains (ID, Name) VALUES (7, 'الخدمات القانونية والمالية');
INSERT INTO domains (ID, Name) VALUES (8, 'الموارد البشرية');
INSERT INTO domains (ID, Name) VALUES (9, 'اللوجستيات وسلاسل الإمداد');
INSERT INTO domains (ID, Name) VALUES (10, 'الطاقة والبيئة');
INSERT INTO domains (ID, Name) VALUES (11, 'التجزئة والتجارة الإلكترونية');
INSERT INTO domains (ID, Name) VALUES (12, 'الضيافة والسياحة');
INSERT INTO domains (ID, Name) VALUES (13, 'الزراعة والأغذية');
INSERT INTO domains (ID, Name) VALUES (14, 'الاتصالات');

-- =============================================================================
-- SUB-DOMAINS TABLE INSERTS
-- =============================================================================

-- Sub-Domains for "الاستشارات" (ID: 1)
INSERT INTO sub_domains (domain_id, Name) VALUES (1, 'الاستشارات الإدارية');
INSERT INTO sub_domains (domain_id, Name) VALUES (1, 'الاستشارات الاستراتيجية');
INSERT INTO sub_domains (domain_id, Name) VALUES (1, 'استشارات تطوير الأعمال');
INSERT INTO sub_domains (domain_id, Name) VALUES (1, 'الاستشارات التقنية');
INSERT INTO sub_domains (domain_id, Name) VALUES (1, 'الاستشارات في الموارد البشرية');
INSERT INTO sub_domains (domain_id, Name) VALUES (1, 'الاستشارات التسويقية');
INSERT INTO sub_domains (domain_id, Name) VALUES (1, 'استشارات العمليات وسلاسل الإمداد');
INSERT INTO sub_domains (domain_id, Name) VALUES (1, 'الاستشارات المالية');
INSERT INTO sub_domains (domain_id, Name) VALUES (1, 'استشارات المخاطر والامتثال');
INSERT INTO sub_domains (domain_id, Name) VALUES (1, 'الاستشارات القانونية والتنظيمية');
INSERT INTO sub_domains (domain_id, Name) VALUES (1, 'استشارات الاستدامة والمسؤولية الاجتماعية');

-- Sub-Domains for "تقنية المعلومات والبرمجيات" (ID: 2)
INSERT INTO sub_domains (domain_id, Name) VALUES (2, 'تطوير البرمجيات');
INSERT INTO sub_domains (domain_id, Name) VALUES (2, 'تطوير المواقع والتصميم');
INSERT INTO sub_domains (domain_id, Name) VALUES (2, 'تطوير تطبيقات الجوال');
INSERT INTO sub_domains (domain_id, Name) VALUES (2, 'البنية التحتية والشبكات');
INSERT INTO sub_domains (domain_id, Name) VALUES (2, 'خدمات السحابة (Cloud)');
INSERT INTO sub_domains (domain_id, Name) VALUES (2, 'الأمن السيبراني');
INSERT INTO sub_domains (domain_id, Name) VALUES (2, 'تحليلات البيانات والذكاء الاصطناعي');
INSERT INTO sub_domains (domain_id, Name) VALUES (2, 'البلوكتشين والحلول الرقمية');
INSERT INTO sub_domains (domain_id, Name) VALUES (2, 'الدعم الفني وإدارة الأنظمة');

-- Sub-Domains for "الإنشاءات والتشييد" (ID: 3)
INSERT INTO sub_domains (domain_id, Name) VALUES (3, 'المقاولات العامة');
INSERT INTO sub_domains (domain_id, Name) VALUES (3, 'الإنشاءات السكنية');
INSERT INTO sub_domains (domain_id, Name) VALUES (3, 'الإنشاءات التجارية');
INSERT INTO sub_domains (domain_id, Name) VALUES (3, 'مشاريع البنية التحتية (طرق، جسور، مطارات، سكك حديد)');
INSERT INTO sub_domains (domain_id, Name) VALUES (3, 'الترميم وإعادة التأهيل');
INSERT INTO sub_domains (domain_id, Name) VALUES (3, 'التطوير العقاري');
INSERT INTO sub_domains (domain_id, Name) VALUES (3, 'إدارة الأملاك والمرافق');
INSERT INTO sub_domains (domain_id, Name) VALUES (3, 'التصميم المعماري والتخطيط العمراني');
INSERT INTO sub_domains (domain_id, Name) VALUES (3, 'إدارة المشاريع الإنشائية');

-- Sub-Domains for "الصحة والعلوم الحيوية" (ID: 4)
INSERT INTO sub_domains (domain_id, Name) VALUES (4, 'الخدمات الصحية وإدارة المستشفيات');
INSERT INTO sub_domains (domain_id, Name) VALUES (4, 'المعدات والأجهزة الطبية');
INSERT INTO sub_domains (domain_id, Name) VALUES (4, 'الأدوية');
INSERT INTO sub_domains (domain_id, Name) VALUES (4, 'التكنولوجيا الحيوية (Biotech)');
INSERT INTO sub_domains (domain_id, Name) VALUES (4, 'الصحة الرقمية / HealthTech');
INSERT INTO sub_domains (domain_id, Name) VALUES (4, 'الأبحاث السريرية');
INSERT INTO sub_domains (domain_id, Name) VALUES (4, 'الاستشارات الصحية');

-- Sub-Domains for "التعليم والتدريب" (ID: 5)
INSERT INTO sub_domains (domain_id, Name) VALUES (5, 'الخدمات الأكاديمية');
INSERT INTO sub_domains (domain_id, Name) VALUES (5, 'التدريب المهني والتقني');
INSERT INTO sub_domains (domain_id, Name) VALUES (5, 'التعليم الإلكتروني (EdTech)');
INSERT INTO sub_domains (domain_id, Name) VALUES (5, 'التدريب المؤسسي');
INSERT INTO sub_domains (domain_id, Name) VALUES (5, 'التدريب على اللغات');
INSERT INTO sub_domains (domain_id, Name) VALUES (5, 'الشهادات المهنية');

-- Sub-Domains for "التسويق والإعلام والإبداع" (ID: 6)
INSERT INTO sub_domains (domain_id, Name) VALUES (6, 'استراتيجيات التسويق');
INSERT INTO sub_domains (domain_id, Name) VALUES (6, 'الإعلان (رقمي، مطبوع، تلفزيوني، إذاعي)');
INSERT INTO sub_domains (domain_id, Name) VALUES (6, 'الهوية والعلامة التجارية');
INSERT INTO sub_domains (domain_id, Name) VALUES (6, 'أبحاث السوق');
INSERT INTO sub_domains (domain_id, Name) VALUES (6, 'العلاقات العامة (PR)');
INSERT INTO sub_domains (domain_id, Name) VALUES (6, 'إدارة وسائل التواصل الاجتماعي');
INSERT INTO sub_domains (domain_id, Name) VALUES (6, 'التصميم الجرافيكي');
INSERT INTO sub_domains (domain_id, Name) VALUES (6, 'صناعة المحتوى (كتابة، تدوين)');
INSERT INTO sub_domains (domain_id, Name) VALUES (6, 'إنتاج الفيديو والتصوير');
INSERT INTO sub_domains (domain_id, Name) VALUES (6, 'الرسوم المتحركة والجرافيك المتحرك');

-- Sub-Domains for "الخدمات القانونية والمالية" (ID: 7)
INSERT INTO sub_domains (domain_id, Name) VALUES (7, 'الاستشارات القانونية');
INSERT INTO sub_domains (domain_id, Name) VALUES (7, 'المحاماة والقوانين التجارية');
INSERT INTO sub_domains (domain_id, Name) VALUES (7, 'الضرائب والاستشارات الضريبية');
INSERT INTO sub_domains (domain_id, Name) VALUES (7, 'المحاسبة والتدقيق');
INSERT INTO sub_domains (domain_id, Name) VALUES (7, 'الاستشارات الاستثمارية');
INSERT INTO sub_domains (domain_id, Name) VALUES (7, 'التأمين وإدارة المخاطر');
INSERT INTO sub_domains (domain_id, Name) VALUES (7, 'البنوك والخدمات المالية');
INSERT INTO sub_domains (domain_id, Name) VALUES (7, 'حلول التكنولوجيا المالية (FinTech)');

-- Sub-Domains for "الموارد البشرية" (ID: 8)
INSERT INTO sub_domains (domain_id, Name) VALUES (8, 'التوظيف والاستقدام');
INSERT INTO sub_domains (domain_id, Name) VALUES (8, 'الرواتب والمزايا');
INSERT INTO sub_domains (domain_id, Name) VALUES (8, 'التدريب والتطوير');
INSERT INTO sub_domains (domain_id, Name) VALUES (8, 'التعهيد (Outsourcing)');
INSERT INTO sub_domains (domain_id, Name) VALUES (8, 'التطوير التنظيمي');
INSERT INTO sub_domains (domain_id, Name) VALUES (8, 'علاقات العمل');

-- Sub-Domains for "اللوجستيات وسلاسل الإمداد" (ID: 9)
INSERT INTO sub_domains (domain_id, Name) VALUES (9, 'خدمات النقل');
INSERT INTO sub_domains (domain_id, Name) VALUES (9, 'التخزين وإدارة المستودعات');
INSERT INTO sub_domains (domain_id, Name) VALUES (9, 'الشحن والنقل البحري/الجوي');
INSERT INTO sub_domains (domain_id, Name) VALUES (9, 'الاستيراد والتصدير');
INSERT INTO sub_domains (domain_id, Name) VALUES (9, 'المشتريات والتوريد');
INSERT INTO sub_domains (domain_id, Name) VALUES (9, 'إدارة سلاسل الإمداد');

-- Sub-Domains for "الطاقة والبيئة" (ID: 10)
INSERT INTO sub_domains (domain_id, Name) VALUES (10, 'الطاقة المتجددة (شمسية، رياح، مياه)');
INSERT INTO sub_domains (domain_id, Name) VALUES (10, 'النفط والغاز');
INSERT INTO sub_domains (domain_id, Name) VALUES (10, 'المرافق والطاقة الكهربائية');
INSERT INTO sub_domains (domain_id, Name) VALUES (10, 'إدارة النفايات');
INSERT INTO sub_domains (domain_id, Name) VALUES (10, 'الاستشارات البيئية');
INSERT INTO sub_domains (domain_id, Name) VALUES (10, 'خدمات الاستدامة');

-- Sub-Domains for "التجزئة والتجارة الإلكترونية" (ID: 11)
INSERT INTO sub_domains (domain_id, Name) VALUES (11, 'البيع بالجملة والتوزيع');
INSERT INTO sub_domains (domain_id, Name) VALUES (11, 'التجارة الإلكترونية والمنصات الرقمية');
INSERT INTO sub_domains (domain_id, Name) VALUES (11, 'أنظمة نقاط البيع (POS)');
INSERT INTO sub_domains (domain_id, Name) VALUES (11, 'برامج ولاء العملاء');
INSERT INTO sub_domains (domain_id, Name) VALUES (11, 'إدارة سلاسل الإمداد للتجزئة');

-- Sub-Domains for "الضيافة والسياحة" (ID: 12)
INSERT INTO sub_domains (domain_id, Name) VALUES (12, 'الفنادق والمنتجعات');
INSERT INTO sub_domains (domain_id, Name) VALUES (12, 'وكالات السفر والسياحة');
INSERT INTO sub_domains (domain_id, Name) VALUES (12, 'إدارة الفعاليات والمؤتمرات');
INSERT INTO sub_domains (domain_id, Name) VALUES (12, 'المطاعم وخدمات الأغذية');
INSERT INTO sub_domains (domain_id, Name) VALUES (12, 'خدمات التموين (Catering)');
INSERT INTO sub_domains (domain_id, Name) VALUES (12, 'الترويج السياحي');

-- Sub-Domains for "الزراعة والأغذية" (ID: 13)
INSERT INTO sub_domains (domain_id, Name) VALUES (13, 'الزراعة والمحاصيل');
INSERT INTO sub_domains (domain_id, Name) VALUES (13, 'الثروة الحيوانية والألبان');
INSERT INTO sub_domains (domain_id, Name) VALUES (13, 'التصنيع الغذائي');
INSERT INTO sub_domains (domain_id, Name) VALUES (13, 'الحلول الزراعية التقنية (AgriTech)');
INSERT INTO sub_domains (domain_id, Name) VALUES (13, 'استشارات زراعية');
INSERT INTO sub_domains (domain_id, Name) VALUES (13, 'التوزيع والإمداد الغذائي');

-- Sub-Domains for "الاتصالات" (ID: 14)
INSERT INTO sub_domains (domain_id, Name) VALUES (14, 'خدمات الإنترنت');
INSERT INTO sub_domains (domain_id, Name) VALUES (14, 'خدمات شبكات الهاتف المحمول');
INSERT INTO sub_domains (domain_id, Name) VALUES (14, 'البنية التحتية للاتصالات');
INSERT INTO sub_domains (domain_id, Name) VALUES (14, 'الاتصالات عبر الأقمار الصناعية');
INSERT INTO sub_domains (domain_id, Name) VALUES (14, 'حلول الاتصال الصوتي (VoIP)');
INSERT INTO sub_domains (domain_id, Name) VALUES (14, 'أمن الشبكات');

-- =============================================================================
-- VERIFICATION QUERIES (Optional - to check the data)
-- =============================================================================

-- Count domains and sub-domains
-- SELECT 'Total Domains' as Type, COUNT(*) as Count FROM domains
-- UNION ALL
-- SELECT 'Total Sub-Domains' as Type, COUNT(*) as Count FROM sub_domains;

-- List all domains with their sub-domain counts
-- SELECT d.ID, d.Name as Domain, COUNT(sd.ID) as SubDomainCount
-- FROM domains d
-- LEFT JOIN sub_domains sd ON d.ID = sd.domain_id
-- GROUP BY d.ID, d.Name
-- ORDER BY d.ID;

-- =============================================================================
-- END OF SQL INSERTS
-- =============================================================================