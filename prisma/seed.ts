import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seedRegistrations() {
  const registrations = [
    { name: "Company 11", crn: "CR90123", phone: "+966595936701" },
    { name: "Company 2", crn: "CR90124", phone: "+966553334444" },
    { name: "Company 3", crn: "CR90125", phone: "+966545556666" },
    { name: "Company 4", crn: "CR90128", phone: "+966545556612" },
    { name: "Company 5", crn: "CR90129", phone: "+966594428924" },
  ];

  for (const registration of registrations) {
    await prisma.registration.upsert({
      where: { commercialRegistrationNumber: registration.crn },
      update: {
        name: registration.name,
        phoneNumber: registration.phone,
      },
      create: {
        name: registration.name,
        commercialRegistrationNumber: registration.crn,
        phoneNumber: registration.phone,
      },
    });
  }
}

async function seedStatuses() {
  const statuses = [
    { id: 1, name: "OPEN" },
    { id: 2, name: "AWARDING" },
    { id: 3, name: "FINISHED" },
  ];

  for (const status of statuses) {
    await prisma.status.upsert({
      where: { id: status.id },
      update: { name: status.name },
      create: {
        id: status.id,
        name: status.name,
      },
    });
  }
}

async function seedDomains() {
  const domainData = [
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

  for (const domain of domainData) {
    await prisma.domain.upsert({
      where: { id: domain.id },
      update: { name: domain.name },
      create: {
        id: domain.id,
        name: domain.name,
      },
    });

    for (const subDomain of domain.subDomains) {
      await prisma.subDomain.upsert({
        where: { id: subDomain.id },
        update: {
          name: subDomain.name,
          domainId: domain.id,
        },
        create: {
          id: subDomain.id,
          name: subDomain.name,
          domainId: domain.id,
        },
      });
    }
  }
}

async function seedLicenses() {
  const licenses = [
    {
      id: 1,
      code: "INV",
      nameAr: "رخصة الاستثمار الأجنبي",
      nameEn: "Foreign Investment License",
      category: "general",
      descriptionAr: "رخصة مطلوبة للاستثمار الأجنبي في المملكة",
      descriptionEn: "License required for foreign investment in Saudi Arabia",
    },
    {
      id: 2,
      code: "CR",
      nameAr: "السجل التجاري",
      nameEn: "Commercial Registration",
      category: "general",
      descriptionAr: "السجل التجاري الأساسي لممارسة النشاط التجاري",
      descriptionEn: "Basic commercial registration for business activities",
    },
    {
      id: 3,
      code: "VAT",
      nameAr: "شهادة التسجيل الضريبي",
      nameEn: "VAT Registration Certificate",
      category: "general",
      descriptionAr: "شهادة تسجيل ضريبة القيمة المضافة",
      descriptionEn: "Value Added Tax registration certificate",
    },
  ];

  for (const license of licenses) {
    await prisma.license.upsert({
      where: { id: license.id },
      update: {
        code: license.code,
        name: license.nameEn,
        nameAr: license.nameAr,
        nameEn: license.nameEn,
        category: license.category,
        descriptionAr: license.descriptionAr,
        descriptionEn: license.descriptionEn,
      },
      create: {
        id: license.id,
        code: license.code,
        name: license.nameEn,
        nameAr: license.nameAr,
        nameEn: license.nameEn,
        category: license.category,
        descriptionAr: license.descriptionAr,
        descriptionEn: license.descriptionEn,
      },
    });
  }
}

async function seedCertificates() {
  const certificates = [
    { id: 1, name: "ISO 9001" },
    { id: 2, name: "ISO 27001" },
    { id: 3, name: "ISO 14001" },
  ];

  for (const certificate of certificates) {
    await prisma.certificate.upsert({
      where: { id: certificate.id },
      update: { name: certificate.name },
      create: certificate,
    });
  }
}

async function seedRegionsAndCities() {
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

  for (let index = 0; index < regions.length; index++) {
    const name = regions[index];
    const id = index + 1;
    await prisma.region.upsert({
      where: { id },
      update: { name },
      create: { id, name },
    });
  }

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

  for (const [regionIdString, cities] of Object.entries(regionCities)) {
    const regionId = Number(regionIdString);
    for (const city of cities) {
      await prisma.city.upsert({
        where: {
          regionId_name: {
            regionId,
            name: city,
          },
        },
        update: { name: city, regionId },
        create: { name: city, regionId },
      });
    }
  }
}

async function main() {
  console.log("🌱 Seeding database using Prisma...");
  await seedStatuses();
  await seedDomains();
  await seedLicenses();
  await seedCertificates();
  await seedRegionsAndCities();
  await seedRegistrations();
  console.log("✅ Seeding complete.");
}

main()
  .catch((error) => {
    console.error("❌ Seeding failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
