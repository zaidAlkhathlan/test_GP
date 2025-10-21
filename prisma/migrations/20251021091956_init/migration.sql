-- CreateTable
CREATE TABLE "Registrations" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT,
    "commercial_registration_number" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "domains" (
    "ID" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "Name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "sub_domains" (
    "ID" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "domain_id" INTEGER NOT NULL,
    "Name" TEXT NOT NULL,
    CONSTRAINT "sub_domains_domain_id_fkey" FOREIGN KEY ("domain_id") REFERENCES "domains" ("ID") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Licenses" (
    "ID" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "code" TEXT,
    "Name" TEXT,
    "name_ar" TEXT,
    "name_en" TEXT,
    "category" TEXT,
    "description_ar" TEXT,
    "description_en" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Certificates" (
    "ID" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "Name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "status" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Region" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "City" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "region_id" INTEGER NOT NULL,
    CONSTRAINT "City_region_id_fkey" FOREIGN KEY ("region_id") REFERENCES "Region" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Buyer" (
    "ID" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "Commercial_registration_number" TEXT NOT NULL,
    "Commercial_Phone_number" TEXT NOT NULL,
    "domains_id" INTEGER NOT NULL,
    "company_name" TEXT NOT NULL,
    "city_id" INTEGER,
    "Logo" TEXT,
    "Account_name" TEXT NOT NULL,
    "Account_email" TEXT NOT NULL,
    "Account_phone" TEXT,
    "Account_password" TEXT NOT NULL,
    "industry" TEXT,
    "description" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "Buyer_domains_id_fkey" FOREIGN KEY ("domains_id") REFERENCES "domains" ("ID") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Buyer_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "City" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Supplier" (
    "ID" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "Commercial_registration_number" TEXT NOT NULL,
    "Commercial_Phone_number" TEXT NOT NULL,
    "domains_id" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "city_id" INTEGER NOT NULL,
    "updated_at" DATETIME NOT NULL,
    "Logo" TEXT,
    "Account_name" TEXT NOT NULL,
    "Account_email" TEXT NOT NULL,
    "Account_phone" TEXT NOT NULL,
    "company_name" TEXT NOT NULL,
    "Account_password" TEXT NOT NULL,
    "description" TEXT,
    "industry" TEXT,
    "licenses" TEXT,
    "certificates" TEXT,
    CONSTRAINT "Supplier_domains_id_fkey" FOREIGN KEY ("domains_id") REFERENCES "domains" ("ID") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Supplier_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "City" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Buyer_Licenses" (
    "buyer_id" INTEGER NOT NULL,
    "license_id" INTEGER NOT NULL,

    PRIMARY KEY ("buyer_id", "license_id"),
    CONSTRAINT "Buyer_Licenses_buyer_id_fkey" FOREIGN KEY ("buyer_id") REFERENCES "Buyer" ("ID") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Buyer_Licenses_license_id_fkey" FOREIGN KEY ("license_id") REFERENCES "Licenses" ("ID") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Buyer_Certificates" (
    "buyer_id" INTEGER NOT NULL,
    "certificate_id" INTEGER NOT NULL,

    PRIMARY KEY ("buyer_id", "certificate_id"),
    CONSTRAINT "Buyer_Certificates_buyer_id_fkey" FOREIGN KEY ("buyer_id") REFERENCES "Buyer" ("ID") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Buyer_Certificates_certificate_id_fkey" FOREIGN KEY ("certificate_id") REFERENCES "Certificates" ("ID") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "buyer_sub_domains" (
    "buyer_id" INTEGER NOT NULL,
    "sub_domains_id" INTEGER NOT NULL,
    "Name" TEXT,

    PRIMARY KEY ("buyer_id", "sub_domains_id"),
    CONSTRAINT "buyer_sub_domains_buyer_id_fkey" FOREIGN KEY ("buyer_id") REFERENCES "Buyer" ("ID") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "buyer_sub_domains_sub_domains_id_fkey" FOREIGN KEY ("sub_domains_id") REFERENCES "sub_domains" ("ID") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Supplier_Licenses" (
    "supplier_id" INTEGER NOT NULL,
    "license_id" INTEGER NOT NULL,

    PRIMARY KEY ("supplier_id", "license_id"),
    CONSTRAINT "Supplier_Licenses_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "Supplier" ("ID") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Supplier_Licenses_license_id_fkey" FOREIGN KEY ("license_id") REFERENCES "Licenses" ("ID") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Supplier_Certificates" (
    "supplier_id" INTEGER NOT NULL,
    "certificate_id" INTEGER NOT NULL,

    PRIMARY KEY ("supplier_id", "certificate_id"),
    CONSTRAINT "Supplier_Certificates_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "Supplier" ("ID") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Supplier_Certificates_certificate_id_fkey" FOREIGN KEY ("certificate_id") REFERENCES "Certificates" ("ID") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "supplier_sub_domains" (
    "supplier_id" INTEGER NOT NULL,
    "sub_domains_id" INTEGER NOT NULL,
    "Name" TEXT,

    PRIMARY KEY ("supplier_id", "sub_domains_id"),
    CONSTRAINT "supplier_sub_domains_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "Supplier" ("ID") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "supplier_sub_domains_sub_domains_id_fkey" FOREIGN KEY ("sub_domains_id") REFERENCES "sub_domains" ("ID") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "tender" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "buyer_id" INTEGER NOT NULL,
    "reference_number" INTEGER,
    "title" TEXT NOT NULL,
    "domain_id" INTEGER NOT NULL,
    "project_description" TEXT,
    "city_id" INTEGER,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "submit_deadline" DATETIME,
    "quires_deadline" DATETIME,
    "contract_time" TEXT,
    "previous_work" TEXT,
    "evaluation_criteria" TEXT,
    "used_technologies" TEXT,
    "tender_coordinator" TEXT,
    "coordinator_email" TEXT,
    "coordinator_phone" TEXT,
    "file1" BLOB,
    "file2" BLOB,
    "file1_name" TEXT,
    "file2_name" TEXT,
    "expected_budget" REAL,
    "status_id" INTEGER DEFAULT 1,
    "finished_at" DATETIME,
    "supplier_win_id" INTEGER,
    "city" TEXT,
    CONSTRAINT "tender_buyer_id_fkey" FOREIGN KEY ("buyer_id") REFERENCES "Buyer" ("ID") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "tender_domain_id_fkey" FOREIGN KEY ("domain_id") REFERENCES "domains" ("ID") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "tender_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "City" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "tender_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "status" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "tender_supplier_win_id_fkey" FOREIGN KEY ("supplier_win_id") REFERENCES "Supplier" ("ID") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "tender_sub_domains" (
    "tender_id" INTEGER NOT NULL,
    "sub_domain_id" INTEGER NOT NULL,

    PRIMARY KEY ("tender_id", "sub_domain_id"),
    CONSTRAINT "tender_sub_domains_tender_id_fkey" FOREIGN KEY ("tender_id") REFERENCES "tender" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "tender_sub_domains_sub_domain_id_fkey" FOREIGN KEY ("sub_domain_id") REFERENCES "sub_domains" ("ID") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "tender_licenses" (
    "tender_id" INTEGER NOT NULL,
    "license_id" INTEGER NOT NULL,

    PRIMARY KEY ("tender_id", "license_id"),
    CONSTRAINT "tender_licenses_tender_id_fkey" FOREIGN KEY ("tender_id") REFERENCES "tender" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "tender_licenses_license_id_fkey" FOREIGN KEY ("license_id") REFERENCES "Licenses" ("ID") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "tender_certificates" (
    "tender_id" INTEGER NOT NULL,
    "certificate_id" INTEGER NOT NULL,

    PRIMARY KEY ("tender_id", "certificate_id"),
    CONSTRAINT "tender_certificates_tender_id_fkey" FOREIGN KEY ("tender_id") REFERENCES "tender" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "tender_certificates_certificate_id_fkey" FOREIGN KEY ("certificate_id") REFERENCES "Certificates" ("ID") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "tender_required_files" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tender_id" INTEGER NOT NULL,
    "file_type" TEXT NOT NULL,
    "file_name" TEXT NOT NULL,
    "description" TEXT,
    "is_required" BOOLEAN NOT NULL DEFAULT true,
    "max_size_mb" INTEGER,
    "allowed_formats" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "tender_required_files_tender_id_fkey" FOREIGN KEY ("tender_id") REFERENCES "tender" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "tender_offers" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tender_id" INTEGER NOT NULL,
    "supplier_id" INTEGER NOT NULL,
    "financial_offer_file" TEXT,
    "technical_offer_file" TEXT,
    "comment" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "tender_offers_tender_id_fkey" FOREIGN KEY ("tender_id") REFERENCES "tender" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "tender_offers_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "Supplier" ("ID") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Proposal" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "reference_number" INTEGER NOT NULL,
    "proposal_price" REAL NOT NULL,
    "company_name" TEXT,
    "project_description" TEXT,
    "financial_file" BLOB,
    "technical_file" BLOB,
    "company_file" BLOB,
    "extra_file" BLOB,
    "extra_description" TEXT,
    "tender_id" INTEGER NOT NULL,
    "supplier_id" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Proposal_tender_id_fkey" FOREIGN KEY ("tender_id") REFERENCES "tender" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Proposal_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "Supplier" ("ID") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Inquiry" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tender_id" INTEGER NOT NULL,
    "supplier_id" INTEGER NOT NULL,
    "question_text" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Inquiry_tender_id_fkey" FOREIGN KEY ("tender_id") REFERENCES "tender" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Inquiry_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "Supplier" ("ID") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "InquiryAnswer" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "inquiry_id" INTEGER NOT NULL,
    "buyer_id" INTEGER NOT NULL,
    "answer_text" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "InquiryAnswer_inquiry_id_fkey" FOREIGN KEY ("inquiry_id") REFERENCES "Inquiry" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "InquiryAnswer_buyer_id_fkey" FOREIGN KEY ("buyer_id") REFERENCES "Buyer" ("ID") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "offers" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tender_id" INTEGER NOT NULL,
    "supplier_id" INTEGER NOT NULL,
    "offer_value" REAL NOT NULL,
    "additional_notes" TEXT,
    "status" TEXT,
    "submitted_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "offers_tender_id_fkey" FOREIGN KEY ("tender_id") REFERENCES "tender" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "offers_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "Supplier" ("ID") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "offer_files" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "offer_id" INTEGER NOT NULL,
    "file_type" TEXT,
    "file_name" TEXT NOT NULL,
    "file_data" BLOB NOT NULL,
    "file_size" INTEGER,
    "mime_type" TEXT,
    "uploaded_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "offer_files_offer_id_fkey" FOREIGN KEY ("offer_id") REFERENCES "offers" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Registrations_commercial_registration_number_key" ON "Registrations"("commercial_registration_number");

-- CreateIndex
CREATE INDEX "idx_sub_domains_domain_id" ON "sub_domains"("domain_id");

-- CreateIndex
CREATE UNIQUE INDEX "Licenses_code_key" ON "Licenses"("code");

-- CreateIndex
CREATE UNIQUE INDEX "City_region_id_name_key" ON "City"("region_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Buyer_Commercial_registration_number_key" ON "Buyer"("Commercial_registration_number");

-- CreateIndex
CREATE UNIQUE INDEX "Buyer_Account_email_key" ON "Buyer"("Account_email");

-- CreateIndex
CREATE UNIQUE INDEX "Supplier_Commercial_registration_number_key" ON "Supplier"("Commercial_registration_number");

-- CreateIndex
CREATE UNIQUE INDEX "Supplier_Account_email_key" ON "Supplier"("Account_email");
