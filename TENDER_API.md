# Tender Database Schema & API Documentation

## Database Schema

### Core Tender Table

```sql
CREATE TABLE tender (
  id                    INTEGER PRIMARY KEY,
  reference_number      INTEGER,
  title                 TEXT NOT NULL,
  domain_id             INTEGER NOT NULL,              -- Links to domains table
  project_description   TEXT,
  city                  TEXT,
  created_at            TEXT    DEFAULT (CURRENT_TIMESTAMP),
  submit_deadline       TEXT,                          -- Offer submission deadline
  quires_deadline       TEXT,                          -- Inquiry deadline  
  contract_time         TEXT,                          -- Expected contract duration
  previous_work         TEXT,                          -- Previous work requirements
  evaluation_criteria   TEXT,                          -- Tender evaluation criteria
  used_technologies     TEXT,                          -- Required technologies
  tender_coordinator    TEXT,                          -- Coordinator name
  coordinator_email     TEXT,                          -- Coordinator email
  coordinator_phone     TEXT,                          -- Coordinator phone
  file1                 BLOB,                          -- Attachment file 1
  file2                 BLOB,                          -- Attachment file 2
  
  FOREIGN KEY (domain_id) REFERENCES domains(ID) ON DELETE RESTRICT ON UPDATE CASCADE
);
```

### Relationship Tables

#### Tender ↔ Sub-Domains (Many-to-Many)
```sql
CREATE TABLE tender_sub_domains (
  tender_id     INTEGER NOT NULL,
  sub_domain_id INTEGER NOT NULL,
  PRIMARY KEY (tender_id, sub_domain_id),
  FOREIGN KEY (tender_id)     REFERENCES tender(id)      ON DELETE CASCADE,
  FOREIGN KEY (sub_domain_id) REFERENCES sub_domains(ID) ON DELETE CASCADE
);
```

#### Tender ↔ Licenses (Many-to-Many)
```sql
CREATE TABLE tender_licenses (
  tender_id   INTEGER NOT NULL,
  license_id  INTEGER NOT NULL,
  PRIMARY KEY (tender_id, license_id),
  FOREIGN KEY (tender_id)  REFERENCES tender(id)   ON DELETE CASCADE,
  FOREIGN KEY (license_id) REFERENCES Licenses(ID) ON DELETE CASCADE
);
```

#### Tender ↔ Certificates (Many-to-Many)
```sql
CREATE TABLE tender_certificates (
  tender_id      INTEGER NOT NULL,
  certificate_id INTEGER NOT NULL,
  PRIMARY KEY (tender_id, certificate_id),
  FOREIGN KEY (tender_id)       REFERENCES tender(id)        ON DELETE CASCADE,
  FOREIGN KEY (certificate_id)  REFERENCES Certificates(ID)  ON DELETE CASCADE
);
```

## TypeScript Interfaces

### Database Entity (Backend)
```typescript
export interface TenderEntity {
  id?: number;
  reference_number?: number;
  title: string;
  domain_id: number;
  project_description?: string;
  city?: string;
  created_at?: string;
  submit_deadline?: string;
  quires_deadline?: string;
  contract_time?: string;
  previous_work?: string;
  evaluation_criteria?: string;
  used_technologies?: string;
  tender_coordinator?: string;
  coordinator_email?: string;
  coordinator_phone?: string;
  file1?: Blob | null;
  file2?: Blob | null;
}
```

### Frontend Display Interface (Existing)
```typescript
export interface Tender {
  id: string;
  title: string;
  company: string;
  category?: string;
  location?: string;
  budget?: string;
  publishDate: string;
  offerDeadline: string;
  inquiryDeadline: string;
  remainingDays: number;
  remainingInquiryDays: number;
  status: 'active' | 'expired' | 'awarded' | 'draft';
  description?: string;
  referenceNumber?: string;
}
```

## API Endpoints

### 1. Get All Tenders
- **GET** `/api/tenders`
- **Response**: `{ tenders: TenderEntity[] }`

### 2. Get Tender by ID
- **GET** `/api/tenders/:id`
- **Response**: 
```json
{
  "tender": TenderEntity,
  "subDomains": [{ "ID": 1, "Name": "..." }],
  "licenses": [{ "ID": 1, "Name": "..." }],
  "certificates": [{ "ID": 1, "Name": "..." }]
}
```

### 3. Create New Tender
- **POST** `/api/tenders`
- **Request Body**:
```json
{
  "reference_number": 25073901055,
  "title": "Project Title",
  "domain_id": 1,
  "project_description": "Description...",
  "city": "Riyadh",
  "submit_deadline": "2025-12-31T23:59:59",
  "quires_deadline": "2025-11-30T23:59:59",
  "contract_time": "6 months",
  "tender_coordinator": "Ahmed Mohammed",
  "coordinator_email": "ahmed@company.com",
  "coordinator_phone": "966501234567",
  "subDomainIds": [1, 2],
  "licenseIds": [1],
  "certificateIds": [1]
}
```
- **Response**: `{ success: true, tenderId: number, message: string }`

### 4. Update Tender
- **PUT** `/api/tenders/:id`
- **Request Body**: Partial TenderEntity (only fields to update)
- **Response**: `{ success: true, message: string }`

### 5. Delete Tender
- **DELETE** `/api/tenders/:id`
- **Response**: `{ success: true, message: string }`

### 6. Get Tenders by Domain
- **GET** `/api/domains/:domainId/tenders`
- **Response**: `{ tenders: TenderEntity[] }`

## Database Relationships

```
tender (1:N) ← domain_id → domains
tender (M:N) ← tender_sub_domains → sub_domains  
tender (M:N) ← tender_licenses → Licenses
tender (M:N) ← tender_certificates → Certificates
tender (1:N) ← tender_id → Inquiry (existing)
```

## Indexes Created

- `idx_tender_domain` - On tender(domain_id) for domain-based queries
- `idx_ts_subdomain` - On tender_sub_domains(sub_domain_id) 
- `idx_tl_license` - On tender_licenses(license_id)
- `idx_tc_certificate` - On tender_certificates(certificate_id)

## Usage Examples

### Create a Tender with Relationships
```javascript
const response = await fetch('/api/tenders', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'Mobile App Development',
    domain_id: 1,
    project_description: 'E-commerce mobile app',
    city: 'Riyadh',
    submit_deadline: '2025-12-31T23:59:59',
    subDomainIds: [1, 2], // Multiple sub-domains
    licenseIds: [1, 3],   // Multiple required licenses
    certificateIds: [2]   // Required certificates
  })
});
```

### Get Full Tender Details
```javascript
const response = await fetch('/api/tenders/1');
const data = await response.json();
// Returns tender + all related sub-domains, licenses, certificates
```

## File Attachments

The tender table includes `file1` and `file2` BLOB columns for file attachments. These can be used to store:
- Tender documents
- Technical specifications  
- Requirements documents
- Images/diagrams

For larger files or multiple files, consider implementing a separate file storage system with file references in the tender table.

## Testing

Use the provided `test-tender-api.mjs` script to test all endpoints:

```bash
# Make sure dev server is running on port 8085
node test-tender-api.mjs
```