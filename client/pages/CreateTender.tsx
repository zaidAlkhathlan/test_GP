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
  const [durationDays, setDurationDays] = useState('31');

  // select options (used in other steps)
  const certificateOptions = Array.from({ length: 20 }).map((_, i) => ({ value: `cert${i+1}`, label: `شهادة ${i+1}` }));
  const licenseOptions = Array.from({ length: 20 }).map((_, i) => ({ value: `lic${i+1}`, label: `ترخيص ${i+1}` }));
  const [certificates, setCertificates] = useState<any[]>([]);
  const [licenses, setLicenses] = useState<any[]>([]);

  // Domain/Sub-domain state (like Register page)
  const [domains, setDomains] = useState<Domain[]>([]);
  const [allSubDomains, setAllSubDomains] = useState<SubDomain[]>([]);
  const [filteredSubDomains, setFilteredSubDomains] = useState<{ value: string; label: string }[]>([]);
  const [selectedDomain, setSelectedDomain] = useState<string>("");
  const [selectedSubDomains, setSelectedSubDomains] = useState<{ value: string; label: string }[]>([]);
  const [loadingDomains, setLoadingDomains] = useState(false);

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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                  <div className="text-right">
                    <label className="text-sm text-tawreed-text-dark">تاريخ انتهاء الاستفسارات *</label>
                    <div className="mt-2 flex gap-3">
                      <input type="date" value={enquiryEndDate} onChange={(e)=>setEnquiryEndDate(e.target.value)} className="px-3 py-2 border rounded-lg bg-white w-1/2" />
                      <input type="time" value={enquiryEndTime} onChange={(e)=>setEnquiryEndTime(e.target.value)} className="px-3 py-2 border rounded-lg bg-white w-1/2" />
                    </div>
                  </div>

                  <div className="text-right">
                    <label className="text-sm text-tawreed-text-dark">تاريخ فتح المظاريف *</label>
                    <div className="mt-2 flex gap-3">
                      <input type="date" value={bidOpenDate} onChange={(e)=>setBidOpenDate(e.target.value)} className="px-3 py-2 border rounded-lg bg-white w-1/2" />
                      <input type="time" value={bidOpenTime} onChange={(e)=>setBidOpenTime(e.target.value)} className="px-3 py-2 border rounded-lg bg-white w-1/2" />
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="text-sm text-tawreed-text-dark">مدة العقد / تاريخ تسليم المشروع *</label>
                  <input value={durationDays} onChange={(e)=>setDurationDays(e.target.value)} className="mt-2 w-full px-3 py-2 border rounded-lg bg-white" />
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
                <input className="w-full border rounded-lg px-3 py-2.5 bg-white" placeholder="عنوان المناقصة" />
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
              <div className="mb-2">
                <input className="w-full border rounded-lg px-3 py-2.5 bg-white" placeholder="الموقع" />
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-right text-lg font-semibold mb-4">الوصف والمتطلبات</h2>
              <textarea className="w-full border rounded p-3 h-48 bg-white" placeholder="وصف المشروع والمتطلبات" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="border-dashed border-2 border-gray-200 rounded p-6 text-center">اضغط لرفع ملف</div>
                <div className="border-dashed border-2 border-gray-200 rounded p-6 text-center">اضغط لرفع ملف</div>
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
                  value={licenses}
                  onChange={(v: any) => setLicenses(v ? [...v] : [])}
                  placeholder="اختر التراخيص..."
                  classNamePrefix="react-select"
                  styles={{ control: (base) => ({ ...base, direction: 'rtl', backgroundColor: '#fff', borderColor: '#E5E7EB' }), menu: (base) => ({ ...base, direction: 'rtl' }) }}
                />

                <Select
                  isMulti
                  options={certificateOptions}
                  value={certificates}
                  onChange={(v: any) => setCertificates(v ? [...v] : [])}
                  placeholder="اختر الشهادات..."
                  classNamePrefix="react-select"
                  styles={{ control: (base) => ({ ...base, direction: 'rtl', backgroundColor: '#fff', borderColor: '#E5E7EB' }), menu: (base) => ({ ...base, direction: 'rtl' }) }}
                />

                <textarea className="w-full border rounded p-3 h-32 bg-white" placeholder="الأعمال السابقة المطلوبة" />
              </div>
            </div>
          )}

          {step === 5 && (
            <div>
              <h2 className="text-right text-lg font-semibold mb-4">معلومات التواصل</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input className="border rounded px-3 py-2 bg-white" placeholder="اسم المنسق" />
                <input className="border rounded px-3 py-2 bg-white" placeholder="البريد الإلكتروني" />
                <input className="border rounded px-3 py-2 bg-white" placeholder="رقم الجوال" />
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
                <button className="px-4 py-2 bg-tawreed-green text-white rounded">نشر المناقصة</button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
