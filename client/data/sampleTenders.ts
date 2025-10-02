// Sample tender data for demonstration
export const sampleTenders = [
  {
    id: '25073901054',
    title: 'بناء ورشة سيارات',
    company: 'مؤسسة نماء المنشآت',
    category: 'مقاولات عامة للمباني (الإنشاء، الإصلاح، الهدم، الترميم)',
    location: 'شقراء - منطقة الرياض',
    budget: '100,000 ريال',
    publishDate: '2025-8-1م',
    offerDeadline: '2025-08-04م',
    inquiryDeadline: '2025-08-04',
    remainingDays: 15,
    remainingInquiryDays: 8,
    status: 'active' as const,
    referenceNumber: '25073901054'
  },
  {
    id: 't2',
    title: 'إنشاء بوابة أمنية على طريق السلامة بخشم النجار',
    company: 'مؤسسة الحماية والأمان',
    category: 'مشاريع البنية التحتية',
    location: 'خشم النجار - منطقة مكة',
    budget: '850,000 ريال',
    publishDate: '2025-8-2م',
    offerDeadline: '2025-08-10م',
    inquiryDeadline: '2025-08-08',
    remainingDays: 12,
    remainingInquiryDays: 6,
    status: 'active' as const,
    referenceNumber: 't2'
  },
  {
    id: 't3',
    title: 'تطوير نظام إدارة المخزون',
    company: 'شركة التقنية المتطورة',
    category: 'تطوير البرمجيات',
    location: 'الدمام - المنطقة الشرقية',
    budget: '450,000 ريال',
    publishDate: '2025-7-30م',
    offerDeadline: '2025-08-15م',
    inquiryDeadline: '2025-08-12',
    remainingDays: 18,
    remainingInquiryDays: 10,
    status: 'active' as const,
    referenceNumber: 't3'
  }
];