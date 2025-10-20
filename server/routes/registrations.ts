import { Router, Request, Response } from "express";
import { db } from "../db";

const router = Router();

const AUTHENTICA_API_KEY =
  "$2y$10$fCkBNRg/tLv249x2qA6xP.TlqFyNF8X3y4ZJoAxnBx5U.V1i4o53S";
const AUTHENTICA_API_URL = "https://api.authentica.sa/api/v2";

/* ---------------------- Verify Commercial Number ---------------------- */
router.get("/verify/:commercialNumber", (req, res) => {
  const { commercialNumber } = req.params;
  if (!commercialNumber)
    return res.status(400).json({ message: "Commercial number is required." });

  const sql =
    "SELECT name, phone_number FROM Registrations WHERE commercial_registration_number = ?";
  db.get(sql, [commercialNumber], (err, row) => {
    if (err) return res.status(500).json({ message: "Database error." });
    if (!row || !row.phone_number)
      return res
        .status(404)
        .json({ message: "Commercial number not found in database." });

    res.json({ success: true, name: row.name, phoneNumber: row.phone_number });
  });
});

/* ---------------------- Send OTP ---------------------- */
router.post("/send-otp", async (req, res) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ message: "Phone number is required." });

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
    if (!response.ok || data.status === "error")
      throw new Error(data.message || "Failed to send OTP.");

    res.json({ success: true, message: "OTP sent successfully." });
  } catch (err: any) {
    console.error("❌ Authentica send error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ---------------------- Verify OTP ---------------------- */
router.post("/verify-otp", async (req, res) => {
  const { phoneNumber, otpCode } = req.body;
  if (!phoneNumber || !otpCode)
    return res.status(400).json({ message: "Phone number and OTP code are required." });

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
    if (!response.ok || !data.message?.toLowerCase().includes("verified"))
      throw new Error(data.message || "Invalid or expired OTP.");

    res.json({ success: true, message: "OTP verified successfully!" });
  } catch (err: any) {
    console.error("❌ Authentica verify error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ---------------------- Registration Save ---------------------- */
router.post("/register", async (req: Request, res: Response) => {
  try {
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

    const now = new Date().toISOString();
    let sql = "";
    let params: any[] = [];

    if (institutionType === "buyer") {
      sql = `
        INSERT INTO Buyer (
          company_name, commercial_registration_number, commercial_phone_number,
          domains_id, city_id, account_name, account_email,
          account_phone, account_password, description, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      params = [
        institutionName,
        commercialRegNumber,
        mobileNumber,
        selectedDomain,
        cityId,
        coordinator.name,
        coordinator.email,
        coordinator.mobile,
        coordinator.password,
        activityDescription,
        now,
        now,
      ];
    } else if (institutionType === "supplier") {
      sql = `
        INSERT INTO Supplier (
          company_name, commercial_registration_number, commercial_phone_number,
          domains_id, licenses, certificates, city_id, account_name,
          account_email, account_phone, account_password, description,
          created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      params = [
        institutionName,
        commercialRegNumber,
        mobileNumber,
        selectedDomain,
        JSON.stringify(licenses),
        JSON.stringify(certificates),
        cityId,
        coordinator.name,
        coordinator.email,
        coordinator.mobile,
        coordinator.password,
        activityDescription,
        now,
        now,
      ];
    } else {
      return res.status(400).json({
        success: false,
        message: "نوع التسجيل غير صالح."
      });
    }

    await new Promise<void>((resolve, reject) => {
      db.run(sql, params, (err) => {
        if (err) return reject(err);
        resolve();
      });
    });

    console.log("🧾 SQL to run:", sql);
    console.log("🧩 Values:", params);
    console.log("✅ Record saved:", {
      type: institutionType,
      company_name: institutionName,
      mobileNumber,
      domain: selectedDomain,
      description: activityDescription,
    });

    res.json({
      success: true,
      message: "تم حفظ البيانات بنجاح.",
      saved: {
        type: institutionType,
        company_name: institutionName,
        mobileNumber,
        domain: selectedDomain,
        description: activityDescription,
      },
    });
  } catch (err: any) {
    console.error("❌ Register Error:", err);
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

export default router;

