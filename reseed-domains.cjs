const fs = require('fs');
const path = require('path');

// Helper function to run with sql.js  
async function reseedDomainsAndSubDomains() {
  console.log("🔄 Starting re-seeding of domains and sub-domains...");

  try {
    const initSqlJs = require('sql.js');
    const SQL = await initSqlJs();
    
    const dbPath = path.join(__dirname, 'data', 'app.db');
    if (!fs.existsSync(dbPath)) {
      console.error('❌ Database file not found');
      return;
    }
    
    const fileBuffer = fs.readFileSync(dbPath);
    const db = new SQL.Database(fileBuffer);

    // Step 1: Clear existing domains and sub-domains (but preserve relationships)
    console.log('\n🧹 Clearing existing domains and sub-domains...');
    
    // Clear in order to respect foreign keys
    db.run("DELETE FROM buyer_sub_domains");
    console.log('✅ Cleared buyer_sub_domains relationships');
    
    db.run("DELETE FROM sub_domains");
    console.log('✅ Cleared sub_domains');
    
    db.run("DELETE FROM domains");
    console.log('✅ Cleared domains');

    // Step 2: Insert new domains
    console.log('\n📝 Inserting new domains...');
    
    const newDomains = [
      { id: 1, name: "الاستشارات" },
      { id: 2, name: "تقنية المعلومات والبرمجيات" },
      { id: 3, name: "الإنشاءات والتشييد" },
      { id: 4, name: "الصحة والعلوم الحيوية" },
      { id: 5, name: "التعليم والتدريب" },
      { id: 6, name: "التسويق والإعلام والإبداع" },
      { id: 7, name: "الخدمات القانونية والمالية" },
      { id: 8, name: "الموارد البشرية" },
      { id: 9, name: "اللوجستيات وسلاسل الإمداد" },
      { id: 10, name: "الطاقة والبيئة" },
      { id: 11, name: "التجزئة والتجارة الإلكترونية" },
      { id: 12, name: "الضيافة والسياحة" },
      { id: 13, name: "الزراعة والأغذية" },
      { id: 14, name: "الاتصالات" }
    ];

    for (const domain of newDomains) {
      db.run("INSERT INTO domains (ID, Name) VALUES (?, ?)", [domain.id, domain.name]);
      console.log(`✅ Added domain ${domain.id}: ${domain.name}`);
    }

    // Step 3: Insert new sub-domains
    console.log('\n📝 Inserting new sub-domains...');
    
    const newSubDomains = [
      // الاستشارات (1)
      { id: 1, domain_id: 1, name: "الاستشارات الإدارية" },
      { id: 2, domain_id: 1, name: "الاستشارات الاستراتيجية" },
      { id: 3, domain_id: 1, name: "استشارات تطوير الأعمال" },
      { id: 4, domain_id: 1, name: "الاستشارات التقنية" },
      { id: 5, domain_id: 1, name: "الاستشارات في الموارد البشرية" },
      { id: 6, domain_id: 1, name: "الاستشارات التسويقية" },
      { id: 7, domain_id: 1, name: "استشارات العمليات وسلاسل الإمداد" },
      { id: 8, domain_id: 1, name: "الاستشارات المالية" },
      { id: 9, domain_id: 1, name: "استشارات المخاطر والامتثال" },
      { id: 10, domain_id: 1, name: "الاستشارات القانونية والتنظيمية" },
      { id: 11, domain_id: 1, name: "استشارات الاستدامة والمسؤولية الاجتماعية" },

      // تقنية المعلومات والبرمجيات (2)
      { id: 12, domain_id: 2, name: "تطوير البرمجيات" },
      { id: 13, domain_id: 2, name: "تطوير المواقع والتصميم" },
      { id: 14, domain_id: 2, name: "تطوير تطبيقات الجوال" },
      { id: 15, domain_id: 2, name: "البنية التحتية والشبكات" },
      { id: 16, domain_id: 2, name: "خدمات السحابة (Cloud)" },
      { id: 17, domain_id: 2, name: "الأمن السيبراني" },
      { id: 18, domain_id: 2, name: "تحليلات البيانات والذكاء الاصطناعي" },
      { id: 19, domain_id: 2, name: "البلوكتشين والحلول الرقمية" },
      { id: 20, domain_id: 2, name: "الدعم الفني وإدارة الأنظمة" },

      // الإنشاءات والتشييد (3)
      { id: 21, domain_id: 3, name: "المقاولات العامة" },
      { id: 22, domain_id: 3, name: "الإنشاءات السكنية" },
      { id: 23, domain_id: 3, name: "الإنشاءات التجارية" },
      { id: 24, domain_id: 3, name: "مشاريع البنية التحتية (طرق، جسور، مطارات، سكك حديد)" },
      { id: 25, domain_id: 3, name: "الترميم وإعادة التأهيل" },
      { id: 26, domain_id: 3, name: "التطوير العقاري" },
      { id: 27, domain_id: 3, name: "إدارة الأملاك والمرافق" },
      { id: 28, domain_id: 3, name: "التصميم المعماري والتخطيط العمراني" },
      { id: 29, domain_id: 3, name: "إدارة المشاريع الإنشائية" },

      // الصحة والعلوم الحيوية (4)
      { id: 30, domain_id: 4, name: "الخدمات الصحية وإدارة المستشفيات" },
      { id: 31, domain_id: 4, name: "المعدات والأجهزة الطبية" },
      { id: 32, domain_id: 4, name: "الأدوية" },
      { id: 33, domain_id: 4, name: "التكنولوجيا الحيوية (Biotech)" },
      { id: 34, domain_id: 4, name: "الصحة الرقمية / HealthTech" },
      { id: 35, domain_id: 4, name: "الأبحاث السريرية" },
      { id: 36, domain_id: 4, name: "الاستشارات الصحية" },

      // التعليم والتدريب (5)
      { id: 37, domain_id: 5, name: "الخدمات الأكاديمية" },
      { id: 38, domain_id: 5, name: "التدريب المهني والتقني" },
      { id: 39, domain_id: 5, name: "التعليم الإلكتروني (EdTech)" },
      { id: 40, domain_id: 5, name: "التدريب المؤسسي" },
      { id: 41, domain_id: 5, name: "التدريب على اللغات" },
      { id: 42, domain_id: 5, name: "الشهادات المهنية" },

      // التسويق والإعلام والإبداع (6)
      { id: 43, domain_id: 6, name: "استراتيجيات التسويق" },
      { id: 44, domain_id: 6, name: "الإعلان (رقمي، مطبوع، تلفزيوني، إذاعي)" },
      { id: 45, domain_id: 6, name: "الهوية والعلامة التجارية" },
      { id: 46, domain_id: 6, name: "أبحاث السوق" },
      { id: 47, domain_id: 6, name: "العلاقات العامة (PR)" },
      { id: 48, domain_id: 6, name: "إدارة وسائل التواصل الاجتماعي" },
      { id: 49, domain_id: 6, name: "التصميم الجرافيكي" },
      { id: 50, domain_id: 6, name: "صناعة المحتوى (كتابة، تدوين)" },
      { id: 51, domain_id: 6, name: "إنتاج الفيديو والتصوير" },
      { id: 52, domain_id: 6, name: "الرسوم المتحركة والجرافيك المتحرك" },

      // الخدمات القانونية والمالية (7)
      { id: 53, domain_id: 7, name: "الاستشارات القانونية" },
      { id: 54, domain_id: 7, name: "المحاماة والقوانين التجارية" },
      { id: 55, domain_id: 7, name: "الضرائب والاستشارات الضريبية" },
      { id: 56, domain_id: 7, name: "المحاسبة والتدقيق" },
      { id: 57, domain_id: 7, name: "الاستشارات الاستثمارية" },
      { id: 58, domain_id: 7, name: "التأمين وإدارة المخاطر" },
      { id: 59, domain_id: 7, name: "البنوك والخدمات المالية" },
      { id: 60, domain_id: 7, name: "حلول التكنولوجيا المالية (FinTech)" },

      // الموارد البشرية (8)
      { id: 61, domain_id: 8, name: "التوظيف والاستقدام" },
      { id: 62, domain_id: 8, name: "الرواتب والمزايا" },
      { id: 63, domain_id: 8, name: "التدريب والتطوير" },
      { id: 64, domain_id: 8, name: "التعهيد (Outsourcing)" },
      { id: 65, domain_id: 8, name: "التطوير التنظيمي" },
      { id: 66, domain_id: 8, name: "علاقات العمل" },

      // اللوجستيات وسلاسل الإمداد (9)
      { id: 67, domain_id: 9, name: "خدمات النقل" },
      { id: 68, domain_id: 9, name: "التخزين وإدارة المستودعات" },
      { id: 69, domain_id: 9, name: "الشحن والنقل البحري/الجوي" },
      { id: 70, domain_id: 9, name: "الاستيراد والتصدير" },
      { id: 71, domain_id: 9, name: "المشتريات والتوريد" },
      { id: 72, domain_id: 9, name: "إدارة سلاسل الإمداد" },

      // الطاقة والبيئة (10)
      { id: 73, domain_id: 10, name: "الطاقة المتجددة (شمسية، رياح، مياه)" },
      { id: 74, domain_id: 10, name: "النفط والغاز" },
      { id: 75, domain_id: 10, name: "المرافق والطاقة الكهربائية" },
      { id: 76, domain_id: 10, name: "إدارة النفايات" },
      { id: 77, domain_id: 10, name: "الاستشارات البيئية" },
      { id: 78, domain_id: 10, name: "خدمات الاستدامة" },

      // التجزئة والتجارة الإلكترونية (11)
      { id: 79, domain_id: 11, name: "البيع بالجملة والتوزيع" },
      { id: 80, domain_id: 11, name: "التجارة الإلكترونية والمنصات الرقمية" },
      { id: 81, domain_id: 11, name: "أنظمة نقاط البيع (POS)" },
      { id: 82, domain_id: 11, name: "برامج ولاء العملاء" },
      { id: 83, domain_id: 11, name: "إدارة سلاسل الإمداد للتجزئة" },

      // الضيافة والسياحة (12)
      { id: 84, domain_id: 12, name: "الفنادق والمنتجعات" },
      { id: 85, domain_id: 12, name: "وكالات السفر والسياحة" },
      { id: 86, domain_id: 12, name: "إدارة الفعاليات والمؤتمرات" },
      { id: 87, domain_id: 12, name: "المطاعم وخدمات الأغذية" },
      { id: 88, domain_id: 12, name: "خدمات التموين (Catering)" },
      { id: 89, domain_id: 12, name: "الترويج السياحي" },

      // الزراعة والأغذية (13)
      { id: 90, domain_id: 13, name: "الزراعة والمحاصيل" },
      { id: 91, domain_id: 13, name: "الثروة الحيوانية والألبان" },
      { id: 92, domain_id: 13, name: "التصنيع الغذائي" },
      { id: 93, domain_id: 13, name: "الحلول الزراعية التقنية (AgriTech)" },
      { id: 94, domain_id: 13, name: "استشارات زراعية" },
      { id: 95, domain_id: 13, name: "التوزيع والإمداد الغذائي" },

      // الاتصالات (14)
      { id: 96, domain_id: 14, name: "خدمات الإنترنت" },
      { id: 97, domain_id: 14, name: "خدمات شبكات الهاتف المحمول" },
      { id: 98, domain_id: 14, name: "البنية التحتية للاتصالات" },
      { id: 99, domain_id: 14, name: "الاتصالات عبر الأقمار الصناعية" },
      { id: 100, domain_id: 14, name: "حلول الاتصال الصوتي (VoIP)" },
      { id: 101, domain_id: 14, name: "أمن الشبكات" }
    ];

    for (const subDomain of newSubDomains) {
      db.run("INSERT INTO sub_domains (ID, domain_id, Name) VALUES (?, ?, ?)", 
        [subDomain.id, subDomain.domain_id, subDomain.name]);
      console.log(`✅ Added sub-domain ${subDomain.id}: ${subDomain.name}`);
    }

    // Step 4: Save the database
    console.log('\n💾 Saving updated database...');
    const data = db.export();
    fs.writeFileSync(dbPath, data);
    
    db.close();
    
    console.log('\n✅ Re-seeding completed successfully!');
    console.log(`📊 Total domains: ${newDomains.length}`);
    console.log(`📊 Total sub-domains: ${newSubDomains.length}`);
    
  } catch (error) {
    console.error('❌ Error during re-seeding:', error);
  }
}

// Execute the re-seeding
reseedDomainsAndSubDomains();