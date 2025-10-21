import { Router, Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { prisma } from "../db";

const router = Router();

const AUTHENTICA_API_KEY =
  "$2y$10$fCkBNRg/tLv249x2qA6xP.TlqFyNF8X3y4ZJoAxnBx5U.V1i4o53S";
const AUTHENTICA_API_URL = "https://api.authentica.sa/api/v2";

const normalizeIds = (value: unknown): number[] => {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    const normalized = value
      .map((item) => {
        if (typeof item === "number") {
          return item;
        }
        if (typeof item === "string") {
          return Number(item);
        }
        if (typeof item === "object" && item !== null) {
          const maybeId = (item as { id?: number | string; value?: number | string })?.id ?? (
            item as { id?: number | string; value?: number | string }
          )?.value;

          if (typeof maybeId === "number") {
            return maybeId;
          }
          if (typeof maybeId === "string") {
            return Number(maybeId);
          }
        }
        return NaN;
      })
      .filter((id) => Number.isFinite(id) && id > 0) as number[];

    return Array.from(new Set(normalized));
  }

  if (typeof value === "string" || typeof value === "number") {
    const numeric = Number(value);
    return Number.isFinite(numeric) && numeric > 0 ? [numeric] : [];
  }

  return [];
};

/* ---------------------- Verify Commercial Number ---------------------- */
router.get("/verify/:commercialNumber", async (req, res) => {
  console.log('[Registration] GET /api/registrations/verify/%s', req.params.commercialNumber);
  const { commercialNumber } = req.params;
  if (!commercialNumber) {
    return res.status(400).json({ message: "Commercial number is required." });
  }

  try {
    const registration = await prisma.registration.findUnique({
      where: { commercialRegistrationNumber: commercialNumber },
    });

    if (!registration || !registration.phoneNumber) {
      return res
        .status(404)
        .json({ message: "Commercial number not found in database." });
    }

    res.json({
      success: true,
      name: registration.name,
      phoneNumber: registration.phoneNumber,
    });
  } catch (error) {
    console.error("❌ Registration lookup error:", error);
    res.status(500).json({ message: "Database error." });
  }
});

/* ---------------------- Send OTP ---------------------- */
router.post("/send-otp", async (req, res) => {
  const masked = (req.body?.phone || '').toString().replace(/\d(?=\d{4})/g, '*');
  console.log('[Registration] POST /api/registrations/send-otp phone=%s', masked);
  const { phone } = req.body;
  if (!phone) {
    return res.status(400).json({ message: "Phone number is required." });
  }

  try {
    const response = await fetch(`${AUTHENTICA_API_URL}/send-otp`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-Authorization": AUTHENTICA_API_KEY,
      },
      body: JSON.stringify({ method: "sms", phone, template_id: 1 }),
    });

    const data = await response.json();
    if (!response.ok || data.status === "error") {
      throw new Error(data.message || "Failed to send OTP.");
    }

    res.json({ success: true, message: "OTP sent successfully." });
  } catch (err: any) {
    console.error("❌ Authentica send error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ---------------------- Verify OTP ---------------------- */
router.post("/verify-otp", async (req, res) => {
  const masked = (req.body?.phoneNumber || '').toString().replace(/\d(?=\d{4})/g, '*');
  console.log('[Registration] POST /api/registrations/verify-otp phone=%s otp_len=%s', masked, (req.body?.otpCode || '').toString().length);
  const { phoneNumber, otpCode } = req.body;
  if (!phoneNumber || !otpCode) {
    return res
      .status(400)
      .json({ message: "Phone number and OTP code are required." });
  }

  try {
    const response = await fetch(`${AUTHENTICA_API_URL}/verify-otp`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-Authorization": AUTHENTICA_API_KEY,
      },
      body: JSON.stringify({ phone: phoneNumber, otp: otpCode }),
    });

    const data = await response.json();
    if (!response.ok || !data.message?.toLowerCase().includes("verified")) {
      throw new Error(data.message || "Invalid or expired OTP.");
    }

    res.json({ success: true, message: "OTP verified successfully!" });
  } catch (err: any) {
    console.error("❌ Authentica verify error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ---------------------- Registration Save ---------------------- */
router.post("/register", async (req: Request, res: Response) => {
  const maskedEmail = (req.body?.coordinator?.email || '').toString().replace(/(^.).*(@.*$)/, '$1***$2');
  const maskedPhone = (req.body?.coordinator?.mobile || '').toString().replace(/\d(?=\d{4})/g, '*');
  console.log('[Registration] POST /api/registrations/register', {
    institutionType: req.body?.institutionType,
    domainId: Number(req.body?.selectedDomain) || null,
    cityId: Number(req.body?.cityId) || null,
    subDomainCount: Array.isArray(req.body?.selectedSubDomains) ? req.body.selectedSubDomains.length : 0,
    licenseCount: Array.isArray(req.body?.licenses) ? req.body.licenses.length : 0,
    certificateCount: Array.isArray(req.body?.certificates) ? req.body.certificates.length : 0,
    coordinator: {
      name: req.body?.coordinator?.name || '',
      email: maskedEmail,
      mobile: maskedPhone,
      password: req.body?.coordinator?.password ? '***' : '(none)'
    }
  });
  const {
    institutionType,
    commercialRegNumber,
    institutionName,
    selectedDomain,
    selectedSubDomains,
    regionId,
    cityId,
    mobileNumber,
    activityDescription,
    certificates,
    licenses,
    coordinator,
  } = req.body;

  const now = new Date();
  const domainId = Number(selectedDomain) || null;
  const buyerCityId = Number(cityId) || null;
  const subDomainIds = normalizeIds(selectedSubDomains);
  const licenseIds = normalizeIds(licenses);
  const certificateIds = normalizeIds(certificates);

  if (!institutionType || !commercialRegNumber || !institutionName) {
    return res.status(400).json({
      success: false,
      message: "الحقول الأساسية مطلوبة لإتمام التسجيل.",
    });
  }

  if (!domainId) {
    return res.status(400).json({
      success: false,
      message: "النشاط الرئيسي مطلوب للتسجيل.",
    });
  }

  if (!coordinator || !coordinator.email || !coordinator.password) {
    return res.status(400).json({
      success: false,
      message: "بيانات منسق التسجيل مطلوبة.",
    });
  }

  try {
    if (institutionType === "buyer") {
      const buyer = await prisma.$transaction(async (tx) => {
        const createdBuyer = await tx.buyer.create({
          data: {
            companyName: institutionName,
            commercialRegistrationNumber: commercialRegNumber,
            commercialPhoneNumber: mobileNumber,
            domainId,
            cityId: buyerCityId,
            accountName: coordinator.name,
            accountEmail: coordinator.email,
            accountPhone: coordinator.mobile,
            accountPassword: coordinator.password,
            description: activityDescription || null,
            createdAt: now,
          },
        });

        if (subDomainIds.length > 0) {
          const subDomains = await tx.subDomain.findMany({
            where: { id: { in: subDomainIds } },
            select: { id: true, name: true },
          });

          if (subDomains.length > 0) {
            // Note: skipDuplicates is not supported on SQLite; relying on transaction isolation and unique constraints
            await tx.buyerSubDomain.createMany({
              data: subDomains.map((subDomain) => ({
                buyerId: createdBuyer.id,
                subDomainId: subDomain.id,
                name: subDomain.name,
              })),
            });
          }
        }

        if (licenseIds.length > 0) {
          // Note: skipDuplicates is not supported on SQLite
          await tx.buyerLicense.createMany({
            data: licenseIds.map((licenseId) => ({
              buyerId: createdBuyer.id,
              licenseId,
            })),
          });
        }

        if (certificateIds.length > 0) {
          // Note: skipDuplicates is not supported on SQLite
          await tx.buyerCertificate.createMany({
            data: certificateIds.map((certificateId) => ({
              buyerId: createdBuyer.id,
              certificateId,
            })),
          });
        }

        return createdBuyer;
      });

      return res.json({
        success: true,
        message: "تم حفظ بيانات المشتري بنجاح.",
        saved: {
          type: institutionType,
          company_name: buyer.companyName,
          mobileNumber,
          domain: domainId,
          description: activityDescription,
        },
      });
    }

    if (institutionType === "supplier") {
      const supplier = await prisma.$transaction(async (tx) => {
        const createdSupplier = await tx.supplier.create({
          data: {
            companyName: institutionName,
            commercialRegistrationNumber: commercialRegNumber,
            commercialPhoneNumber: mobileNumber,
            domainId,
            cityId: buyerCityId ?? 1,
            accountName: coordinator.name,
            accountEmail: coordinator.email,
            accountPhone: coordinator.mobile,
            accountPassword: coordinator.password,
            description: activityDescription || null,
            licensesJson: JSON.stringify(licenseIds),
            certificatesJson: JSON.stringify(certificateIds),
            createdAt: now,
          },
        });

        if (subDomainIds.length > 0) {
          const subDomains = await tx.subDomain.findMany({
            where: { id: { in: subDomainIds } },
            select: { id: true, name: true },
          });

          if (subDomains.length > 0) {
            // Note: skipDuplicates is not supported on SQLite; relying on transaction isolation and unique constraints
            await tx.supplierSubDomain.createMany({
              data: subDomains.map((subDomain) => ({
                supplierId: createdSupplier.id,
                subDomainId: subDomain.id,
                name: subDomain.name,
              })),
            });
          }
        }

        if (licenseIds.length > 0) {
          // Note: skipDuplicates is not supported on SQLite
          await tx.supplierLicense.createMany({
            data: licenseIds.map((licenseId) => ({
              supplierId: createdSupplier.id,
              licenseId,
            })),
          });
        }

        if (certificateIds.length > 0) {
          // Note: skipDuplicates is not supported on SQLite
          await tx.supplierCertificate.createMany({
            data: certificateIds.map((certificateId) => ({
              supplierId: createdSupplier.id,
              certificateId,
            })),
          });
        }

        return createdSupplier;
      });

      return res.json({
        success: true,
        message: "تم حفظ بيانات المورد بنجاح.",
        saved: {
          type: institutionType,
          company_name: supplier.companyName,
          mobileNumber,
          domain: domainId,
          description: activityDescription,
        },
      });
    }

    return res.status(400).json({
      success: false,
      message: "نوع التسجيل غير صالح.",
    });
  } catch (error: any) {
    console.error("❌ Register Error:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return res.status(409).json({
        success: false,
        message: "توجد سجلات بنفس البيانات بالفعل.",
      });
    }

    res.status(500).json({
      success: false,
      message: error?.message || "حدث خطأ أثناء حفظ البيانات.",
    });
  }
});

export default router;
