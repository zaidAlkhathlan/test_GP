import { RequestHandler } from "express";
import { db } from "../db";

// Tender status constants
export const TENDER_STATUS = {
  OPEN: 1,
  AWARDING: 2,
  FINISHED: 3
} as const;

export const STATUS_NAMES = {
  1: 'OPEN',
  2: 'AWARDING', 
  3: 'FINISHED'
} as const;

// Interface for tender with status
export interface TenderWithStatus {
  id: number;
  title: string;
  status_id: number;
  status_name: string;
  submit_deadline: string;
  finished_at?: string;
  created_at: string;
}

/**
 * Get all tenders with their human-readable status
 */
export const getTendersWithStatus: RequestHandler = (req, res) => {
  console.log("📊 Getting all tenders with status information...");

  const sql = `
    SELECT 
      t.id,
      t.title,
      t.status_id,
      s.name AS status_name,
      t.submit_deadline,
      t.finished_at,
      t.created_at,
      t.buyer_id,
      t.expected_budget,
      t.city,
      b.company_name AS buyer_company_name,
      d.Name AS domain_name
    FROM tender t
    LEFT JOIN status s ON s.id = t.status_id
    LEFT JOIN Buyer b ON b.ID = t.buyer_id
    LEFT JOIN domains d ON d.ID = t.domain_id
    ORDER BY t.created_at DESC
  `;

  db.all(sql, [], (err: Error | null, rows: any[]) => {
    if (err) {
      console.error("❌ Database error getting tenders with status:", err);
      return res.status(500).json({ 
        error: "فشل في استرداد المناقصات",
        details: err.message 
      });
    }

    console.log(`✅ Found ${rows?.length || 0} tenders with status information`);
    res.json(rows || []);
  });
};

/**
 * Update tender status to AWARDING when deadline passes
 */
export const updateExpiredTenders: RequestHandler = (req, res) => {
  console.log("⏰ Checking for tenders that have passed their deadline...");

  const sql = `
    UPDATE tender
    SET status_id = ?
    WHERE status_id = ?
      AND datetime('now') >= datetime(submit_deadline)
  `;

  db.run(sql, [TENDER_STATUS.AWARDING, TENDER_STATUS.OPEN], function(err: Error | null) {
    if (err) {
      console.error("❌ Database error updating expired tenders:", err);
      return res.status(500).json({ 
        error: "فشل في تحديث المناقصات المنتهية الصلاحية",
        details: err.message 
      });
    }

    const updatedCount = (this as any).changes || 0;
    console.log(`✅ Updated ${updatedCount} expired tenders to AWARDING status`);
    
    res.json({
      success: true,
      message: `تم تحديث ${updatedCount} مناقصة منتهية الصلاحية`,
      updated_count: updatedCount
    });
  });
};

/**
 * Mark a tender as FINISHED and set finished_at timestamp
 */
export const finishTender: RequestHandler = (req, res) => {
  const { id } = req.params;
  
  console.log(`🏁 Finishing tender ${id}...`);

  if (!id) {
    return res.status(400).json({ error: "معرف المناقصة مطلوب" });
  }

  const sql = `
    UPDATE tender
    SET status_id = ?,
        finished_at = datetime('now')
    WHERE id = ?
      AND status_id = ?
  `;

  db.run(sql, [TENDER_STATUS.FINISHED, id, TENDER_STATUS.AWARDING], function(err: Error | null) {
    if (err) {
      console.error("❌ Database error finishing tender:", err);
      return res.status(500).json({ 
        error: "فشل في إنهاء المناقصة",
        details: err.message 
      });
    }

    const changes = (this as any).changes || 0;
    if (changes === 0) {
      return res.status(404).json({ 
        error: "المناقصة غير موجودة أو ليست في حالة التقييم" 
      });
    }

    console.log(`✅ Tender ${id} marked as FINISHED`);
    res.json({
      success: true,
      message: "تم إنهاء المناقصة بنجاح",
      tender_id: parseInt(id)
    });
  });
};

/**
 * Get tender status statistics
 */
export const getTenderStatusStats: RequestHandler = (req, res) => {
  console.log("📈 Getting tender status statistics...");

  const sql = `
    SELECT 
      s.name AS status_name,
      COUNT(t.id) AS count
    FROM status s
    LEFT JOIN tender t ON t.status_id = s.id
    GROUP BY s.id, s.name
    ORDER BY s.id
  `;

  db.all(sql, [], (err: Error | null, rows: any[]) => {
    if (err) {
      console.error("❌ Database error getting status statistics:", err);
      return res.status(500).json({ 
        error: "فشل في استرداد إحصائيات المناقصات",
        details: err.message 
      });
    }

    console.log("✅ Status statistics retrieved successfully");
    res.json(rows || []);
  });
};

/**
 * Award tender to winning supplier and mark as FINISHED
 */
export const awardTender: RequestHandler = (req, res) => {
  const { tenderId } = req.params;
  const { supplierId, proposalId } = req.body;

  console.log(`🏆 Awarding tender ${tenderId} to supplier ${supplierId}`);

  if (!tenderId || !supplierId || !proposalId) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields: tenderId, supplierId, proposalId"
    });
  }

  // Update tender with winner and mark as finished
  const updateSql = `
    UPDATE tender 
    SET 
      status_id = ?,
      supplier_win_id = ?,
      finished_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `;

  db.run(updateSql, [TENDER_STATUS.FINISHED, supplierId, tenderId], function(err) {
    if (err) {
      console.error("❌ Error awarding tender:", err);
      return res.status(500).json({
        success: false,
        message: "Database error while awarding tender"
      });
    }

    if (this.changes === 0) {
      return res.status(404).json({
        success: false,
        message: "Tender not found"
      });
    }

    console.log(`✅ Successfully awarded tender ${tenderId} to supplier ${supplierId}`);
    
    // Get updated tender info for response
    const selectSql = `
      SELECT 
        t.id,
        t.title,
        t.supplier_win_id,
        t.status_id,
        s.name as status_name,
        t.finished_at,
        sup.company_name as winner_company_name
      FROM tender t
      LEFT JOIN status s ON s.id = t.status_id
      LEFT JOIN Supplier sup ON sup.ID = t.supplier_win_id
      WHERE t.id = ?
    `;

    db.get(selectSql, [tenderId], (err, row) => {
      if (err) {
        console.error("❌ Error fetching updated tender:", err);
        return res.status(500).json({
          success: false,
          message: "Tender awarded but failed to fetch updated info"
        });
      }

      res.json({
        success: true,
        message: "Tender successfully awarded",
        data: {
          tender: row,
          awardedAt: new Date().toISOString()
        }
      });
    });
  });
};

/**
 * Get awarded supplier details for a specific tender
 */
export const getAwardedSupplier: RequestHandler = (req, res) => {
  const { tenderId } = req.params;
  
  console.log(`🏆 Getting awarded supplier for tender ${tenderId}`);

  if (!tenderId || isNaN(Number(tenderId))) {
    return res.status(400).json({
      success: false,
      message: "Invalid tender ID"
    });
  }

  const sql = `
    SELECT 
      t.id as tender_id,
      t.title as tender_title,
      t.status_id,
      t.finished_at,
      t.supplier_win_id,
      s.company_name,
      s.Commercial_registration_number as commercial_register,
      s.Commercial_Phone_number as phone,
      s.Account_email as email,
      s.Account_name as contact_person,
      s.city_id,
      c.name as city_name,
      r.name as region_name,
      d.Name as domain_name
    FROM tender t
    LEFT JOIN Supplier s ON s.ID = t.supplier_win_id
    LEFT JOIN City c ON s.city_id = c.id
    LEFT JOIN Region r ON c.region_id = r.id
    LEFT JOIN domains d ON t.domain_id = d.ID
    WHERE t.id = ? AND t.status_id = ? AND t.supplier_win_id IS NOT NULL
  `;

  db.get(sql, [tenderId, TENDER_STATUS.FINISHED], (err, row) => {
    if (err) {
      console.error("❌ Error fetching awarded supplier:", err);
      return res.status(500).json({
        success: false,
        message: "Database error while fetching awarded supplier"
      });
    }

    if (!row) {
      return res.status(404).json({
        success: false,
        message: "No awarded supplier found for this tender"
      });
    }

    console.log(`✅ Found awarded supplier: ${row.company_name}`);
    
    res.json({
      success: true,
      data: {
        tender: {
          id: row.tender_id,
          title: row.tender_title,
          status_id: row.status_id,
          finished_at: row.finished_at,
          domain_name: row.domain_name
        },
        supplier: {
          id: row.supplier_win_id,
          company_name: row.company_name,
          commercial_register: row.commercial_register,
          phone: row.phone,
          email: row.email,
          contact_person: row.contact_person,
          city_name: row.city_name,
          region_name: row.region_name
        }
      }
    });
  });
};

/**
 * Get tenders by specific status ID
 */
export const getTendersByStatus: RequestHandler = (req, res) => {
  const { statusId } = req.params;
  
  if (!statusId || isNaN(Number(statusId))) {
    return res.status(400).json({
      success: false,
      message: "Invalid status ID"
    });
  }

  const statusIdNum = Number(statusId);
  
  // Validate status ID
  if (![1, 2, 3].includes(statusIdNum)) {
    return res.status(400).json({
      success: false,
      message: "Invalid status ID. Must be 1 (OPEN), 2 (AWARDING), or 3 (FINISHED)"
    });
  }

  const sql = `
    SELECT 
      t.id,
      t.title,
      t.status_id,
      s.name AS status_name,
      t.submit_deadline,
      t.finished_at,
      t.created_at,
      t.expected_budget,
      b.company_name AS buyer_company_name
    FROM tender t
    LEFT JOIN status s ON s.id = t.status_id
    LEFT JOIN Buyer b ON b.ID = t.buyer_id
    WHERE t.status_id = ?
    ORDER BY t.created_at DESC
  `;

  db.all(sql, [statusIdNum], (err, rows) => {
    if (err) {
      console.error("❌ Error fetching tenders by status:", err);
      return res.status(500).json({
        success: false,
        message: "Database error"
      });
    }

    res.json({
      success: true,
      data: rows,
      count: rows.length,
      status: STATUS_NAMES[statusIdNum as keyof typeof STATUS_NAMES]
    });
  });
};

/**
 * Utility function to get human-readable status name
 */
export function getStatusName(statusId: number): string {
  return STATUS_NAMES[statusId as keyof typeof STATUS_NAMES] || 'UNKNOWN';
}

/**
 * Utility function to check if a tender can transition to a new status
 */
export function canTransitionToStatus(currentStatus: number, newStatus: number): boolean {
  // Define valid transitions
  const validTransitions: Record<number, number[]> = {
    [TENDER_STATUS.OPEN]: [TENDER_STATUS.AWARDING],
    [TENDER_STATUS.AWARDING]: [TENDER_STATUS.FINISHED],
    [TENDER_STATUS.FINISHED]: [] // No transitions from finished
  };

  return validTransitions[currentStatus]?.includes(newStatus) || false;
}