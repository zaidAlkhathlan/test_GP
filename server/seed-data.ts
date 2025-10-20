export function seedDatabase(db: any) {
  console.log("🌱 Seeding initial data...");

  // ===========================
  // Seed Registrations
  // ===========================
  const registrations = [
    { name: "Company 11", crn: "CR90123", phone: "+966595936701" },
    { name: "Company 2", crn: "CR90124", phone: "+966553334444" },
    { name: "Company 3", crn: "CR90125", phone: "+966545556666" },
    { name: "Company 4", crn: "CR90128", phone: "+966545556612" },
  ];

  const regStmt = db.prepare(
    "INSERT INTO Registrations (name, commercial_registration_number, phone_number) VALUES (?, ?, ?)"
  );
  registrations.forEach((r) => regStmt.run([r.name, r.crn, r.phone]));
  regStmt.free();
  console.log(`   - Seeded ${registrations.length} registrations.`);

  // ===========================
  // Seed Statuses
  // ===========================
  const statuses = [
    { id: 1, name: "OPEN" },
    { id: 2, name: "AWARDING" },
    { id: 3, name: "FINISHED" },
  ];
  const statusStmt = db.prepare("INSERT INTO status (id, name) VALUES (?, ?)");
  statuses.forEach((s) => statusStmt.run([s.id, s.name]));
  statusStmt.free();
  console.log(`   - Seeded ${statuses.length} statuses.`);

  // ===========================
  // Seed Domains & SubDomains
  // ===========================
  const newDomainsData = [
    {
      id: 1,
      name: "الاستشارات",
      subDomains: [
        { id: 1, name: "الاستشارات الإدارية" },
        { id: 2, name: "الاستشارات الاستراتيجية" },
        { id: 3, name: "استشارات تطوير الأعمال" },
      ],
    },
    {
      id: 2,
      name: "تقنية المعلومات والبرمجيات",
      subDomains: [
        { id: 4, name: "تطوير البرمجيات" },
        { id: 5, name: "البنية التحتية والشبكات" },
        { id: 6, name: "الأمن السيبراني" },
      ],
    },
    {
      id: 3,
      name: "الإنشاءات والتشييد",
      subDomains: [
        { id: 7, name: "المقاولات العامة" },
        { id: 8, name: "الترميم وإعادة التأهيل" },
        { id: 9, name: "التطوير العقاري" },
      ],
    },
  ];

  const domainStmt = db.prepare("INSERT INTO domains (ID, Name) VALUES (?, ?)");
  const subDomainStmt = db.prepare(
    "INSERT INTO sub_domains (ID, domain_id, Name) VALUES (?, ?, ?)"
  );

  newDomainsData.forEach((d) => {
    domainStmt.run([d.id, d.name]);
    d.subDomains.forEach((s) => subDomainStmt.run([s.id, d.id, s.name]));
  });

  domainStmt.free();
  subDomainStmt.free();
  console.log(`   - Seeded ${newDomainsData.length} domains and subdomains.`);

  // ===========================
  // Seed Licenses
  // ===========================
  const licenses = [
    {
      id: 1,
      code: "INV",
      name_ar: "رخصة الاستثمار الأجنبي",
      name_en: "Foreign Investment License",
      category: "general",
      description_ar: "رخصة مطلوبة للاستثمار الأجنبي في المملكة",
      description_en: "License required for foreign investment in Saudi Arabia",
    },
    {
      id: 2,
      code: "CR",
      name_ar: "السجل التجاري",
      name_en: "Commercial Registration",
      category: "general",
      description_ar: "السجل التجاري الأساسي لممارسة النشاط التجاري",
      description_en: "Basic commercial registration for business activities",
    },
    {
      id: 3,
      code: "VAT",
      name_ar: "شهادة التسجيل الضريبي",
      name_en: "VAT Registration Certificate",
      category: "general",
      description_ar: "شهادة تسجيل ضريبة القيمة المضافة",
      description_en: "Value Added Tax registration certificate",
    },
  ];

  const licStmt = db.prepare(
    "INSERT INTO Licenses (ID, code, name_ar, name_en, category, description_ar, description_en) VALUES (?, ?, ?, ?, ?, ?, ?)"
  );
  licenses.forEach((l) =>
    licStmt.run([
      l.id,
      l.code,
      l.name_ar,
      l.name_en,
      l.category,
      l.description_ar,
      l.description_en,
    ])
  );
  licStmt.free();
  console.log(`   - Seeded ${licenses.length} licenses.`);

// 2️⃣ Seed Regions
// ===========================
const regions = [
  "الرياض",
  "مكة المكرمة",
  "المدينة المنورة",
  "القصيم",
  "الشرقية",
  "عسير",
  "تبوك",
  "حائل",
  "الحدود الشمالية",
  "جازان",
  "نجران",
  "الباحة",
  "الجوف",
];
const regionStmt = db.prepare("INSERT OR IGNORE INTO Region (id, name) VALUES (?, ?)");
regions.forEach((r, i) => regionStmt.run([i + 1, r]));
regionStmt.free();
console.log(`   - Seeded ${regions.length} regions.`);

// ===========================
// 3️⃣ Seed Cities with region_id
// ===========================
const regionCities: Record<number, string[]> = {
  1: ["الرياض", "الخرج", "الدوادمي", "المجمعة", "الزلفي", "شقراء", "وادي الدواسر", "عفيف", "حوطة بني تميم", "الأفلاج", "السليل", "الغاط"],
  2: ["مكة المكرمة", "جدة", "الطائف", "رابغ", "القنفذة", "الليث", "خليص", "الكامل", "تربة", "رنية", "الخرمة"],
  3: ["المدينة المنورة", "ينبع", "العلا", "الحناكية", "خيبر", "مهد الذهب", "بدر"],
  4: ["بريدة", "عنيزة", "الرس", "المذنب", "البكيرية", "البدائع", "رياض الخبراء", "عيون الجواء", "الأسياح"],
  5: ["الدمام", "الخبر", "الظهران", "الجبيل", "الأحساء", "الهفوف", "القطيف", "رأس تنورة", "بقيق", "النعيرية", "الخفجي", "حفر الباطن", "قرية العليا"],
  6: ["أبها", "خميس مشيط", "بيشة", "النماص", "محايل عسير", "ظهران الجنوب", "رجال ألمع", "سراة عبيدة", "تثليث"],
  7: ["تبوك", "الوجه", "ضباء", "أملج", "تيماء", "حقل"],
  8: ["حائل", "بقعاء", "الشنان", "الغزالة"],
  9: ["عرعر", "رفحاء", "طريف"],
  10: ["جازان", "صبيا", "أبو عريش", "صامطة", "بيش", "الدرب", "العارضة", "العيدابي", "فيفاء", "الحرث"],
  11: ["نجران", "شرورة", "حبونا", "بدر الجنوب", "يدمه"],
  12: ["الباحة", "بلجرشي", "المخواة", "قلوة", "العقيق", "المندق", "بني حسن"],
  13: ["سكاكا", "دومة الجندل", "القريات", "طبرجل"],
};

const cityStmt = db.prepare("INSERT OR IGNORE INTO City (name, region_id) VALUES (?, ?)");
for (const [regionId, cities] of Object.entries(regionCities)) {
  cities.forEach((city) => cityStmt.run([city, Number(regionId)]));
}
cityStmt.free();
console.log("   - Seeded all cities by region.");

}
