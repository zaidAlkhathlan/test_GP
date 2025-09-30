import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import Header from '../components/Header';

export default function CreateTender() {
  const [step, setStep] = useState(2); // show step 2 as in screenshot

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

        {/* Full header bar (static) copied visually from BuyerHome */}
        <header className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button className="bg-tawreed-green text-white px-3 py-1 rounded-md">مؤسسة: اسم المنشأة</button>
              <div className="hidden md:flex items-center gap-6 text-sm text-tawreed-text-dark" dir="rtl">
                <Link to="/tenders/active" className="hover:underline">المناقصات النشطة</Link>
                <Link to="/tenders/expired" className="hover:underline">المناقصات المنتهية</Link>
                <a className="hover:underline">من نحن</a>
                <a className="hover:underline">اتصل بنا</a>
              </div>
            </div>

            <div className="flex-1 px-6">
              <div className="max-w-xl mx-auto">
                <input dir="rtl" placeholder="بحث..." className="w-full px-4 py-2 rounded-lg border border-tawreed-border-gray text-sm" />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-3">
                <button className="relative">
                  <span className="inline-block w-8 h-8 bg-gray-100 rounded-full"></span>
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">3</span>
                </button>
                <button className="px-3 py-1 border rounded text-sm">حسابي</button>
              </div>
              <div className="text-tawreed-green font-bold">توريد</div>
            </div>
          </div>
        </header>

        {/* Centered RTL stepper (use Register's exact layout for pixel alignment) */}
          <div className="flex items-center justify-center mb-16">
            <div className="flex items-center gap-0">
              {/* Render visual left-to-right as 5..1 so the sequence reads right-to-left (1 at right) */}
              {[5, 4, 3, 2, 1].map((s, index, arr) => {
                const next = arr[index + 1];
                const filled = s <= step; // circle filled when number <= current step
                const connectorFilled = next !== undefined && next <= step; // connector is filled if the right-side (next) number is completed
                return (
                  <div key={s} className="flex items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        filled ? 'bg-tawreed-green text-white' : 'bg-gray-100 text-tawreed-text-gray'
                      }`}
                    >
                      {s}
                    </div>

                    {index < arr.length - 1 && (
                      <div className={`w-12 h-1 ${connectorFilled ? 'bg-tawreed-green' : 'bg-gray-100'}`} />
                    )}
                  </div>
                );
              })}
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
              <h2 className="text-right text-lg font-semibold mb-4">البيانات الأساسية</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input className="border rounded px-3 py-2 bg-white" placeholder="عنوان المناقصة" />
                <select className="border rounded px-3 py-2 bg-white appearance-none">
                  <option>اختر فئة المشروع</option>
                  <option>مقاولات</option>
                  <option>خدمات</option>
                </select>
                <input className="border rounded px-3 py-2 md:col-span-2 bg-white" placeholder="الموقع" />
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-right text-lg font-semibold mb-4">الوصف والمتطلبات</h2>
              <textarea className="w-full border rounded p-3 h-48 bg-white" placeholder="وصف المشروع والمتطلبات" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <label className="border-dashed border-2 border-gray-200 rounded p-6 text-center cursor-pointer flex items-center justify-center">
                  <input type="file" accept="*/*" multiple className="hidden" onChange={(e)=>{/* handle files in e.target.files */}} />
                  <span className="text-sm">اضغط لرفع ملف</span>
                </label>

                <label className="border-dashed border-2 border-gray-200 rounded p-6 text-center cursor-pointer flex items-center justify-center">
                  <input type="file" accept="*/*" multiple className="hidden" onChange={(e)=>{/* handle files in e.target.files */}} />
                  <span className="text-sm">اضغط لرفع ملف</span>
                </label>
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
            <div className="flex items-center gap-3">
              <button onClick={() => {/* save draft stub */}} className="px-4 py-2 border rounded bg-white">حفظ كمسودة</button>
              {step < 5 ? (
                <button onClick={next} className="px-4 py-2 bg-tawreed-green text-white rounded">التالي</button>
              ) : (
                <button className="px-4 py-2 bg-tawreed-green text-white rounded">نشر المناقصة</button>
              )}
            </div>

            <div>
              <button onClick={prev} className="px-4 py-2 bg-white border rounded">السابق</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
