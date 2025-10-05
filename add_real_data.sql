-- Add some real detailed information to existing tenders

-- Update tender 1 with detailed description and coordinator info
UPDATE tender SET 
  project_description = 'مشروع شامل لترحيل البنية التحتية التقنية للشركة إلى الحوسبة السحابية مع ضمان الأمان والأداء العالي',
  tender_coordinator = 'م. أحمد السالم',
  coordinator_email = 'ahmed.salem@techsolutions.com',
  coordinator_phone = '+966 11 234 5678'
WHERE id = 1;

-- Update tender 2 with coordinator info
UPDATE tender SET
  project_description = 'تطوير وتنفيذ نظام شامل لتعزيز الأمن السيبراني للشركة مع التدريب والصيانة',
  tender_coordinator = 'د. سارة الأحمد',
  coordinator_email = 'sara.ahmed@cybersec.sa',
  coordinator_phone = '+966 11 345 6789'
WHERE id = 2;

-- Update tender 3 with minimal info (to show difference)
UPDATE tender SET
  project_description = 'تطوير تطبيق موبايل متقدم للخدمات الرقمية'
WHERE id = 3;