import { RequestHandler } from "express";
import { prisma } from "../db";

export const listInquiriesForTender: RequestHandler = async (req, res) => {
  const tenderId = Number(req.params.id);

  try {
    const inquiries = await prisma.inquiry.findMany({
      where: { tenderId },
      orderBy: { createdAt: "desc" },
      include: {
        answers: {
          include: { buyer: true },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    const safe = inquiries.map((inquiry) => {
      const answer = inquiry.answers?.[0];
      return {
        id: inquiry.id,
        tender_id: inquiry.tenderId,
        question_text: inquiry.questionText,
        created_at: inquiry.createdAt?.toISOString?.() ?? inquiry.createdAt,
        answer_text: answer?.answerText ?? null,
        answer_at: answer?.createdAt?.toISOString?.() ?? answer?.createdAt ?? null,
        buyer_name: answer?.buyer?.accountName ?? null,
      };
    });

    res.json(safe);
  } catch (error) {
    console.error("❌ Error fetching inquiries:", error);
    res.status(500).json({ error: String(error) });
  }
};

export const createInquiry: RequestHandler = async (req, res) => {
  const tenderId = Number(req.params.id);
  const { supplier_id, question_text } = req.body as {
    supplier_id: number;
    question_text: string;
  };

  if (!supplier_id || !question_text) {
    return res.status(400).json({ error: "Missing supplier_id or question_text" });
  }

  try {
    const inquiry = await prisma.inquiry.create({
      data: {
        tenderId,
        supplierId: supplier_id,
        questionText: question_text,
      },
    });

    res.json({
      id: inquiry.id,
      tender_id: inquiry.tenderId,
      supplier_id,
      question_text,
    });
  } catch (error) {
    console.error("❌ Error creating inquiry:", error);
    res.status(500).json({ error: String(error) });
  }
};

export const answerInquiry: RequestHandler = async (req, res) => {
  const inquiryId = Number(req.params.id);
  const { buyer_id, answer_text } = req.body as {
    buyer_id: number;
    answer_text: string;
  };

  if (!buyer_id || !answer_text) {
    return res.status(400).json({ error: "Missing buyer_id or answer_text" });
  }

  try {
    const answer = await prisma.inquiryAnswer.create({
      data: {
        inquiryId,
        buyerId: buyer_id,
        answerText: answer_text,
      },
    });

    res.json({
      id: answer.id,
      inquiry_id: answer.inquiryId,
      buyer_id,
      answer_text,
    });
  } catch (error) {
    console.error("❌ Error creating inquiry answer:", error);
    res.status(500).json({ error: String(error) });
  }
};
