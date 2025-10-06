import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import Header from '../components/Header';
import { Domain, SubDomain, DomainsResponse, SubDomainsResponse } from '@shared/api';

export default function CreateTender() {
  const [step, setStep] = useState(1); // start at step 1

  // timing fields
  const [enquiryEndDate, setEnquiryEndDate] = useState('');
  const [enquiryEndTime, setEnquiryEndTime] = useState('');
  const [bidOpenDate, setBidOpenDate] = useState('');
  const [bidOpenTime, setBidOpenTime] = useState('');
  const [durationDays, setDurationDays] = useState('');

  // License and certificate options from database
  const [licenseOptions, setLicenseOptions] = useState<{ value: string; label: string; isMandatory?: boolean }[]>([]);
  const [certificateOptions, setCertificateOptions] = useState<{ value: string; label: string }[]>([]);
  const [selectedLicenses, setSelectedLicenses] = useState<{ value: string; label: string; isMandatory?: boolean }[]>([]);
  const [selectedCertificates, setSelectedCertificates] = useState<{ value: string; label: string }[]>([]);
  const [loadingLicenses, setLoadingLicenses] = useState(false);

  // Domain/Sub-domain state (like Register page)
  const [domains, setDomains] = useState<Domain[]>([]);
  const [allSubDomains, setAllSubDomains] = useState<SubDomain[]>([]);
  const [filteredSubDomains, setFilteredSubDomains] = useState<{ value: string; label: string }[]>([]);
  const [selectedDomain, setSelectedDomain] = useState<string>("");
  const [selectedSubDomains, setSelectedSubDomains] = useState<{ value: string; label: string }[]>([]);
  const [loadingDomains, setLoadingDomains] = useState(false);

  // Form data state
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    projectDescription: '',
    previousWork: '',
    coordinatorName: '',
    coordinatorEmail: '',
    coordinatorPhone: '',
    expectedBudget: '',
    evaluationCriteria: '',
    usedTechnologies: ''
  });
  
  // File upload state
  const [file1, setFile1] = useState<File | null>(null);
  const [file2, setFile2] = useState<File | null>(null);
  
  const [currentBuyer, setCurrentBuyer] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);

  // Check buyer authentication
  useEffect(() => {
    const buyerData = localStorage.getItem('currentBuyer');
    if (buyerData) {
      setCurrentBuyer(JSON.parse(buyerData));
    } else {
      // Redirect to sign-in if not authenticated
      window.location.href = '/buyer/signin';
    }
  }, []);

  // Fetch domains (once)
  useEffect(() => {
    const fetchDomains = async () => {
      try {
        setLoadingDomains(true);
        const res = await fetch('/api/domains');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: DomainsResponse = await res.json();
        setDomains(data.domains);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Error fetching domains', e);
      } finally {
        setLoadingDomains(false);
      }
    };
    fetchDomains();
  }, []);

  // Fetch all sub-domains (once)
  useEffect(() => {
    const fetchAllSubDomains = async () => {
      try {
        const res = await fetch('/api/sub-domains');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: SubDomainsResponse = await res.json();
        setAllSubDomains(data.subDomains);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Error fetching sub-domains', e);
      }
    };
    fetchAllSubDomains();
  }, []);

  // Fetch licenses from database
  useEffect(() => {
    const fetchLicenses = async () => {
      try {
        setLoadingLicenses(true);
        const response = await fetch('/api/licenses');
        if (response.ok) {
          const licenses = await response.json();
          const options = licenses.map((license: any) => ({
            value: license.code,
            label: `${license.name_ar} - ${license.name_en}`,
            category: license.category
          }));
          setLicenseOptions(options);
        }
      } catch (error) {
        console.error('Error fetching licenses:', error);
      } finally {
        setLoadingLicenses(false);
      }
    };

    fetchLicenses();
  }, []);

  // Fetch certificates from database
  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const response = await fetch('/api/certificates');
        if (response.ok) {
          const certificates = await response.json();
          const options = certificates.map((cert: any) => ({
            value: cert.code,
            label: `${cert.name_ar} - ${cert.name_en}`,
            category: cert.category
          }));
          setCertificateOptions(options);
        }
      } catch (error) {
        console.error('Error fetching certificates:', error);
      }
    };

    fetchCertificates();
  }, []);

  // Filter sub-domains when the main domain changes
  useEffect(() => {
    if (selectedDomain && allSubDomains.length > 0) {
      const opts = allSubDomains
        .filter((s) => s.domain_id.toString() === selectedDomain)
        .map((s) => ({ value: s.ID.toString(), label: s.Name }));
      setFilteredSubDomains(opts);
      // clear previous selection if domain changes
      setSelectedSubDomains([]);
    } else {
      setFilteredSubDomains([]);
      setSelectedSubDomains([]);
    }
  }, [selectedDomain, allSubDomains]);

  const next = () => setStep((s) => Math.min(5, s + 1));
  const prev = () => setStep((s) => Math.max(1, s - 1));

  // Handle form data changes
  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Handle file uploads
  const handleFileUpload = (fileNumber: 1 | 2, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('حجم الملف كبير جداً. الحد الأقصى 10 ميجابايت');
        return;
      }
      
      // Validate file type
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        alert('نوع الملف غير مدعوم. يرجى رفع ملفات PDF أو Word أو صور فقط');
        return;
      }
      
      if (fileNumber === 1) {
        setFile1(file);
      } else {
        setFile2(file);
      }
    }
  };

  // Remove uploaded file
  const removeFile = (fileNumber: 1 | 2) => {
    if (fileNumber === 1) {
      setFile1(null);
    } else {
      setFile2(null);
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!currentBuyer) {
      alert('يجب تسجيل الدخول أولاً');
      return;
    }

    // Validate required fields
    if (!formData.title.trim()) {
      alert('يجب إدخال عنوان المناقصة');
      return;
    }

    if (!selectedDomain || selectedSubDomains.length === 0) {
      alert('يجب اختيار النشاط الرئيسي والفرعي');
      return;
    }

    if (!formData.expectedBudget.trim() || parseFloat(formData.expectedBudget) <= 0) {
      alert('يجب إدخال الميزانية المتوقعة');
      return;
    }

    if (!formData.projectDescription.trim()) {
      alert('يجب إدخال وصف المشروع');
      return;
    }

    if (!bidOpenDate || !bidOpenTime) {
      alert('يجب تحديد تاريخ ووقت فتح العروض');
      return;
    }

    if (!enquiryEndDate || !enquiryEndTime) {
      alert('يجب تحديد تاريخ ووقت انتهاء الاستفسارات');
      return;
    }

    try {
      setSubmitting(true);
      
      // Create FormData to handle files
      const formDataToSend = new FormData();
      
      // Add text fields
      formDataToSend.append('buyer_id', currentBuyer.id.toString());
      formDataToSend.append('title', formData.title);
      formDataToSend.append('domain_id', selectedDomain);
      formDataToSend.append('sub_domain_ids', JSON.stringify(selectedSubDomains.map(sd => parseInt(sd.value))));
      formDataToSend.append('project_description', formData.projectDescription);
      formDataToSend.append('city', formData.location);
      formDataToSend.append('submit_deadline', `${bidOpenDate} ${bidOpenTime}`);
      formDataToSend.append('quires_deadline', `${enquiryEndDate} ${enquiryEndTime}`);
      formDataToSend.append('contract_time', `${durationDays} يوم`);
      formDataToSend.append('previous_work', formData.previousWork);
      formDataToSend.append('tender_coordinator', formData.coordinatorName);
      formDataToSend.append('coordinator_email', formData.coordinatorEmail);
      formDataToSend.append('coordinator_phone', formData.coordinatorPhone);
      formDataToSend.append('expected_budget', formData.expectedBudget);
      
      // Add required licenses and certificates
      formDataToSend.append('required_licenses', JSON.stringify(selectedLicenses.map(l => l.value)));
      formDataToSend.append('required_certificates', JSON.stringify(selectedCertificates.map(c => c.value)));
      
      // Add evaluation criteria and used technologies
      formDataToSend.append('evaluation_criteria', formData.evaluationCriteria);
      formDataToSend.append('used_technologies', formData.usedTechnologies);
      
      // Add files if they exist
      if (file1) {
        formDataToSend.append('file1', file1);
      }
      if (file2) {
        formDataToSend.append('file2', file2);
      }

      const response = await fetch('/api/tenders', {
        method: 'POST',
        // Don't set Content-Type header - let browser set it for FormData
        body: formDataToSend
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      alert('تم إنشاء المناقصة بنجاح!');
      // Redirect to buyer home or tender details
      window.location.href = '/buyer/home';
      
    } catch (error) {
      console.error('Error creating tender:', error);
      alert('حدث خطأ أثناء إنشاء المناقصة. يرجى المحاولة مرة أخرى.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100" dir="rtl">
      <Header userType="buyer" />
      <div className="max-w-[1100px] mx-auto px-6 py-12">
        {/* Page header */}
        <div className="text-right mb-8">
          <h1 className="text-3xl font-bold text-tawreed-text-dark">إنشاء مناقصة جديدة</h1>
          <p className="text-sm text-tawreed-text-gray mt-1">املأ البيانات المطلوبة لنشر مناقصتك والعثور على أفضل الموردين</p>
        </div>

        {/* Centered RTL stepper (match Register) */}
        <div className="flex items-center justify-center mb-16">
          <div className="flex items-center gap-0">
            {[1,2,3,4,5].map((s, index) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    s <= step ? 'bg-tawreed-green text-white' : 'bg-gray-100 text-tawreed-text-gray'
                  }`}
                >
                  {s}
                </div>
                {index < 4 && (
                  <div
                    className={`w-12 h-1 ${
                      s < step ? 'bg-tawreed-green' : s === step ? 'bg-tawreed-green' : 'bg-gray-100'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main card with form */}
        <div className="bg-white rounded-xl shadow p-6">
          {/* Step 2: timings (as in screenshot) */}
          {step === 2 && (
            <div>
              <div className="mb-4">
                <h2 className="text-right text-lg font-semibold">المواعيد والتوقيتات</h2>
              </div>

              <div className="bg-white border border-tawreed-border-gray rounded-lg p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="text-right">
                    <label className="text-sm text-tawreed-text-dark mb-2 block">تاريخ انتهاء الاستفسارات *</label>
                    <div className="flex gap-3 flex-row-reverse">
                      <input 
                        type="time" 
                        value={enquiryEndTime} 
                        onChange={(e)=>setEnquiryEndTime(e.target.value)} 
                        className="px-3 py-2 border rounded-lg bg-white flex-1 text-right" 
                        placeholder="الوقت"
                      />
                      <input 
                        type="date" 
                        value={enquiryEndDate} 
                        onChange={(e)=>setEnquiryEndDate(e.target.value)} 
                        className="px-3 py-2 border rounded-lg bg-white flex-1 text-right" 
                      />
                    </div>
                  </div>

                  <div className="text-right">
                    <label className="text-sm text-tawreed-text-dark mb-2 block">تاريخ فتح المظاريف *</label>
                    <div className="flex gap-3 flex-row-reverse">
                      <input 
                        type="time" 
                        value={bidOpenTime} 
                        onChange={(e)=>setBidOpenTime(e.target.value)} 
                        className="px-3 py-2 border rounded-lg bg-white flex-1 text-right" 
                        placeholder="الوقت"
                      />
                      <input 
                        type="date" 
                        value={bidOpenDate} 
                        onChange={(e)=>setBidOpenDate(e.target.value)} 
                        className="px-3 py-2 border rounded-lg bg-white flex-1 text-right" 
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <label className="text-sm text-tawreed-text-dark mb-2 block">مدة العقد / تاريخ تسليم المشروع *</label>
                  <div className="flex gap-2 items-center">
                    <input 
                      type="number" 
                      value={durationDays} 
                      onChange={(e)=>setDurationDays(e.target.value)} 
                      className="px-3 py-2 border rounded-lg bg-white w-24 text-right" 
                      placeholder="30"
                      min="1"
                    />
                    <span className="text-sm text-tawreed-text-dark">يوم</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 1 (basic), Step 3 (description), Step 4 (additional), Step 5 (contact) keep previous structure but match spacing */}
          {step === 1 && (
            <div>
              <h2 className="text-right text-lg font-semibold mb-6">البيانات الأساسية</h2>

              {/* عنوان المناقصة */}
              <div className="mb-5">
                <input 
                  className="w-full border rounded-lg px-3 py-2.5 bg-white" 
                  placeholder="عنوان المناقصة" 
                  value={formData.title}
                  onChange={(e) => updateFormData('title', e.target.value)}
                />
              </div>

              {/* النشاط الرئيسي */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-tawreed-text-dark mb-2 text-right">النشاط الرئيسي</label>
                <div className="relative">
                  <select
                    value={selectedDomain}
                    onChange={(e) => setSelectedDomain(e.target.value)}
                    className="w-full px-3 py-2.5 text-right border border-tawreed-border-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-tawreed-green focus:border-transparent appearance-none bg-white"
                    dir="rtl"
                    disabled={loadingDomains}
                  >
                    <option value="">
                      {loadingDomains ? 'جاري التحميل...' : `اختر النشاط الرئيسي (${domains.length})`}
                    </option>
                    {domains.map((d) => (
                      <option key={d.ID} value={d.ID.toString()}>{d.Name}</option>
                    ))}
                  </select>
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-60">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4 6L8 10L12 6" stroke="#22262A" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              </div>

              {/* النشاط الفرعي */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-tawreed-text-dark mb-2 text-right">النشاط الفرعي</label>
                <Select
                  isMulti
                  options={filteredSubDomains}
                  value={selectedSubDomains}
                  onChange={(v: any) => setSelectedSubDomains(v ? [...v] : [])}
                  placeholder={selectedDomain ? 'اختر الأنشطة الفرعية...' : 'اختر النشاط الرئيسي أولاً'}
                  isDisabled={!selectedDomain}
                  classNamePrefix="react-select"
                  styles={{
                    control: (base) => ({ ...base, direction: 'rtl', backgroundColor: '#fff', borderColor: '#E5E7EB', opacity: !selectedDomain ? 0.6 : 1 }),
                    menu: (base) => ({ ...base, direction: 'rtl' })
                  }}
                />
              </div>

              {/* الموقع */}
              <div className="mb-5">
                <input 
                  className="w-full border rounded-lg px-3 py-2.5 bg-white" 
                  placeholder="الموقع" 
                  value={formData.location}
                  onChange={(e) => updateFormData('location', e.target.value)}
                />
              </div>

              {/* الميزانية المتوقعة */}
              <div className="mb-2">
                <label className="block text-sm font-medium text-tawreed-text-dark mb-2 text-right">الميزانية المتوقعة *</label>
                <div className="flex gap-2 items-center">
                  <input 
                    type="number" 
                    className="flex-1 border rounded-lg px-3 py-2.5 bg-white text-right" 
                    placeholder="100,000" 
                    value={formData.expectedBudget}
                    onChange={(e) => updateFormData('expectedBudget', e.target.value)}
                    min="0"
                    step="1000"
                  />
                  <span className="text-sm text-tawreed-text-dark">ريال</span>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-right text-lg font-semibold mb-4">الوصف والمتطلبات</h2>
              <div className="space-y-4">
                <textarea 
                  className="w-full border rounded p-3 h-48 bg-white" 
                  placeholder="وصف المشروع والمتطلبات"
                  value={formData.projectDescription}
                  onChange={(e) => updateFormData('projectDescription', e.target.value)}
                />
                
                <textarea 
                  className="w-full border rounded p-3 h-32 bg-white" 
                  placeholder="معايير التقييم (اختياري)"
                  value={formData.evaluationCriteria}
                  onChange={(e) => updateFormData('evaluationCriteria', e.target.value)}
                />
                
                <textarea 
                  className="w-full border rounded p-3 h-32 bg-white" 
                  placeholder="التقنيات المستخدمة (اختياري)"
                  value={formData.usedTechnologies}
                  onChange={(e) => updateFormData('usedTechnologies', e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {/* File Upload Slot 1 */}
                <div className="border-dashed border-2 border-gray-200 rounded p-6 text-center hover:border-tawreed-green transition-colors">
                  {file1 ? (
                    <div className="space-y-2">
                      <div className="text-sm text-tawreed-green">📄 {file1.name}</div>
                      <div className="text-xs text-gray-500">{(file1.size / 1024 / 1024).toFixed(2)} MB</div>
                      <button 
                        type="button"
                        onClick={() => removeFile(1)}
                        className="text-red-500 text-xs hover:underline"
                      >
                        إزالة الملف
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div className="text-gray-500 mb-2">📎 ملف المواصفات التقنية</div>
                      <input
                        type="file"
                        id="file1"
                        className="hidden"
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileUpload(1, e)}
                      />
                      <label 
                        htmlFor="file1" 
                        className="cursor-pointer text-tawreed-green hover:underline"
                      >
                        اضغط لرفع ملف
                      </label>
                      <div className="text-xs text-gray-400 mt-1">PDF, Word, أو صورة (حد أقصى 10MB)</div>
                    </div>
                  )}
                </div>
                
                {/* File Upload Slot 2 */}
                <div className="border-dashed border-2 border-gray-200 rounded p-6 text-center hover:border-tawreed-green transition-colors">
                  {file2 ? (
                    <div className="space-y-2">
                      <div className="text-sm text-tawreed-green">📄 {file2.name}</div>
                      <div className="text-xs text-gray-500">{(file2.size / 1024 / 1024).toFixed(2)} MB</div>
                      <button 
                        type="button"
                        onClick={() => removeFile(2)}
                        className="text-red-500 text-xs hover:underline"
                      >
                        إزالة الملف
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div className="text-gray-500 mb-2">📋 ملف إضافي</div>
                      <input
                        type="file"
                        id="file2"
                        className="hidden"
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileUpload(2, e)}
                      />
                      <label 
                        htmlFor="file2" 
                        className="cursor-pointer text-tawreed-green hover:underline"
                      >
                        اضغط لرفع ملف
                      </label>
                      <div className="text-xs text-gray-400 mt-1">PDF, Word, أو صورة (حد أقصى 10MB)</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <h2 className="text-right text-lg font-semibold mb-4">المتطلبات الإضافية (اختياري)</h2>
              <div className="grid grid-cols-1 gap-4">
                <Select
                  isMulti
                  options={licenseOptions}
                  value={selectedLicenses}
                  onChange={(v: any) => setSelectedLicenses(v ? [...v] : [])}
                  placeholder={loadingLicenses ? "جاري تحميل التراخيص..." : "اختر التراخيص المطلوبة..."}
                  isDisabled={loadingLicenses}
                  classNamePrefix="react-select"
                  styles={{ control: (base) => ({ ...base, direction: 'rtl', backgroundColor: '#fff', borderColor: '#E5E7EB' }), menu: (base) => ({ ...base, direction: 'rtl' }) }}
                />

                <Select
                  isMulti
                  options={certificateOptions}
                  value={selectedCertificates}
                  onChange={(v: any) => setSelectedCertificates(v ? [...v] : [])}
                  placeholder="اختر الشهادات المطلوبة..."
                  classNamePrefix="react-select"
                  styles={{ control: (base) => ({ ...base, direction: 'rtl', backgroundColor: '#fff', borderColor: '#E5E7EB' }), menu: (base) => ({ ...base, direction: 'rtl' }) }}
                />

                <textarea 
                  className="w-full border rounded p-3 h-32 bg-white" 
                  placeholder="الأعمال السابقة المطلوبة"
                  value={formData.previousWork}
                  onChange={(e) => updateFormData('previousWork', e.target.value)}
                />
              </div>
            </div>
          )}

          {step === 5 && (
            <div>
              <h2 className="text-right text-lg font-semibold mb-4">معلومات التواصل</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input 
                  className="border rounded px-3 py-2 bg-white" 
                  placeholder="اسم المنسق" 
                  value={formData.coordinatorName}
                  onChange={(e) => updateFormData('coordinatorName', e.target.value)}
                />
                <input 
                  className="border rounded px-3 py-2 bg-white" 
                  placeholder="البريد الإلكتروني" 
                  type="email"
                  value={formData.coordinatorEmail}
                  onChange={(e) => updateFormData('coordinatorEmail', e.target.value)}
                />
                <input 
                  className="border rounded px-3 py-2 bg-white" 
                  placeholder="رقم الجوال (966xxxxxxxxx)" 
                  type="tel"
                  pattern="[0-9]{12}"
                  value={formData.coordinatorPhone}
                  onChange={(e) => {
                    // Only allow numbers
                    const value = e.target.value.replace(/\D/g, '');
                    updateFormData('coordinatorPhone', value);
                  }}
                />
              </div>
            </div>
          )}

          {/* Footer buttons matching screenshot: Previous on right, Save Draft + Next on left */}
          <div className="mt-6 flex items-center justify-between">
            {/* Place Previous on the left side */}
            <div>
              <button onClick={prev} className="px-4 py-2 bg-white border rounded">السابق</button>
            </div>
            {/* Save Draft + Next on the right side */}
            <div className="flex items-center gap-3">
              <button onClick={() => {/* save draft stub */}} className="px-4 py-2 border rounded bg-white">حفظ كمسودة</button>
              {step < 5 ? (
                <button onClick={next} className="px-4 py-2 bg-tawreed-green text-white rounded">التالي</button>
              ) : (
                <button 
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="px-4 py-2 bg-tawreed-green text-white rounded disabled:opacity-50"
                >
                  {submitting ? 'جاري النشر...' : 'نشر المناقصة'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
