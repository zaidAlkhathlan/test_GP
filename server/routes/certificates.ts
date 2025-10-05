import { RequestHandler } from 'express';

// Common certificates that suppliers might need
const certificates = [
  { code: 'ISO_9001', name_ar: 'شهادة الأيزو 9001', name_en: 'ISO 9001 Certificate', category: 'quality' },
  { code: 'ISO_14001', name_ar: 'شهادة الأيزو 14001', name_en: 'ISO 14001 Certificate', category: 'environment' },
  { code: 'OHSAS_18001', name_ar: 'شهادة أوهساس 18001', name_en: 'OHSAS 18001 Certificate', category: 'safety' },
  { code: 'HACCP', name_ar: 'شهادة الهاسب', name_en: 'HACCP Certificate', category: 'food_safety' },
  { code: 'CE_MARKING', name_ar: 'علامة المطابقة الأوروبية', name_en: 'CE Marking', category: 'compliance' },
  { code: 'FDA_APPROVAL', name_ar: 'موافقة إدارة الأغذية والأدوية', name_en: 'FDA Approval', category: 'medical' },
  { code: 'GMP', name_ar: 'ممارسات التصنيع الجيدة', name_en: 'Good Manufacturing Practice', category: 'manufacturing' },
  { code: 'ENERGY_STAR', name_ar: 'شهادة نجمة الطاقة', name_en: 'Energy Star Certificate', category: 'energy' },
  { code: 'LEED', name_ar: 'شهادة ليد للمباني الخضراء', name_en: 'LEED Green Building Certificate', category: 'construction' },
  { code: 'PCI_DSS', name_ar: 'معيار أمان بيانات الدفع', name_en: 'PCI DSS Compliance', category: 'security' }
];

export const getAllCertificates: RequestHandler = (req, res) => {
  try {
    res.json(certificates);
  } catch (error) {
    console.error('Error fetching certificates:', error);
    res.status(500).json({ error: 'Failed to fetch certificates' });
  }
};

export const getCertificateByCode: RequestHandler = (req, res) => {
  try {
    const { code } = req.params;
    const certificate = certificates.find(cert => cert.code === code);
    
    if (!certificate) {
      return res.status(404).json({ error: 'Certificate not found' });
    }
    
    res.json(certificate);
  } catch (error) {
    console.error('Error fetching certificate:', error);
    res.status(500).json({ error: 'Failed to fetch certificate' });
  }
};