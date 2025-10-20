import { RequestHandler } from 'express';
import { db } from '../db';

// GET /api/tenders/:id/inquiries - list inquiries for a tender (supplier sees question + buyer answer but not other suppliers)
export const listInquiriesForTender: RequestHandler = (req, res) => {
  const tenderId = req.params.id;

  const sql = `
    SELECT i.id, i.tender_id, i.supplier_id, i.question_text, i.created_at,
           a.answer_text, a.created_at AS answer_at, b.account_name AS buyer_name
    FROM Inquiry i
    LEFT JOIN InquiryAnswer a ON a.inquiry_id = i.id
    LEFT JOIN Buyer b ON a.buyer_id = b.id
    WHERE i.tender_id = ?
    ORDER BY i.created_at DESC
  `;

  db.all(sql, [tenderId], (err, rows) => {
    if (err) return res.status(500).json({ error: String(err) });

    // For supplier view: hide supplier_id (do not reveal other supplier identities)
    const safe = rows.map((r: any) => ({
      id: r.id,
      tender_id: r.tender_id,
      question_text: r.question_text,
      created_at: r.created_at,
      answer_text: r.answer_text || null,
      answer_at: r.answer_at || null,
      buyer_name: r.buyer_name || null
    }));

    res.json(safe);
  });
};

// POST /api/tenders/:id/inquiries - create a new inquiry (supplier)
export const createInquiry: RequestHandler = (req, res) => {
  const tenderId = req.params.id;
  const { supplier_id, question_text } = req.body;

  if (!supplier_id || !question_text) {
    return res.status(400).json({ error: 'Missing supplier_id or question_text' });
  }

  const sql = `INSERT INTO Inquiry (tender_id, supplier_id, question_text) VALUES (?,?,?)`;
  db.run(sql, [tenderId, supplier_id, question_text], function (this: any, err: any) {
    if (err) return res.status(500).json({ error: String(err) });
    res.json({ id: this.lastID, tender_id: tenderId, supplier_id, question_text });
  });
};

// POST /api/inquiries/:id/answer - buyer answers an inquiry
export const answerInquiry: RequestHandler = (req, res) => {
  const inquiryId = req.params.id;
  const { buyer_id, answer_text } = req.body;

  if (!buyer_id || !answer_text) {
    return res.status(400).json({ error: 'Missing buyer_id or answer_text' });
  }

  const sql = `INSERT INTO InquiryAnswer (inquiry_id, buyer_id, answer_text) VALUES (?,?,?)`;
  db.run(sql, [inquiryId, buyer_id, answer_text], function (this: any, err: any) {
    if (err) return res.status(500).json({ error: String(err) });
    res.json({ id: this.lastID, inquiry_id: inquiryId, buyer_id, answer_text });
  });
};
