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
 * Get tenders by specific status
 */
export const getTendersByStatus: RequestHandler = (req, res) => {
  const { status } = req.params;
  
  console.log(`🔍 Getting tenders with status: ${status}`);

  // Map status name to ID
  const statusId = status === 'open' ? TENDER_STATUS.OPEN :
                   status === 'awarding' ? TENDER_STATUS.AWARDING :
                   status === 'finished' ? TENDER_STATUS.FINISHED : null;

  if (!statusId) {
    return res.status(400).json({ 
      error: "حالة غير صالحة. الحالات المتاحة: open, awarding, finished" 
    });
  }

  const sql = `
    SELECT 
      t.*,
      s.name AS status_name,
      b.company_name AS buyer_company_name,
      d.Name AS domain_name
    FROM tender t
    LEFT JOIN status s ON s.id = t.status_id
    LEFT JOIN Buyer b ON b.ID = t.buyer_id  
    LEFT JOIN domains d ON d.ID = t.domain_id
    WHERE t.status_id = ?
    ORDER BY t.created_at DESC
  `;

  db.all(sql, [statusId], (err: Error | null, rows: any[]) => {
    if (err) {
      console.error("❌ Database error getting tenders by status:", err);
      return res.status(500).json({ 
        error: "فشل في استرداد المناقصات",
        details: err.message 
      });
    }

    console.log(`✅ Found ${rows?.length || 0} tenders with status ${status}`);
    res.json(rows || []);
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