import { useState, useEffect } from "react";
import Select from "react-select";
import { Link } from "react-router-dom";
import { Domain, SubDomain, DomainsResponse, SubDomainsResponse } from "@shared/api";
import LocationSelector from "../components/LocationSelector";


export default function Register() {
  const [currentStep, setCurrentStep] = useState(1); // Start from step 1
  const [commercialRegNumber, setCommercialRegNumber] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [institutionName, setInstitutionName] = useState("");
  const [institutionType, setInstitutionType] = useState("");
  const [selectedDomain, setSelectedDomain] = useState<string>("");
  const [selectedSubDomains, setSelectedSubDomains] = useState<{ value: string; label: string }[]>([]);
  const [selectedRegionId, setSelectedRegionId] = useState<number>(0);
  const [selectedCityId, setSelectedCityId] = useState<number>(0);
  const [mobileNumber, setMobileNumber] = useState("");
  const [activityDescription, setActivityDescription] = useState("");
  const [certificates, setCertificates] = useState<{ value: string; label: string }[]>([]);
  const [licenses, setLicenses] = useState<{ value: string; label: string }[]>([]);
  const [coordinatorName, setCoordinatorName] = useState("");
  const [coordinatorEmail, setCoordinatorEmail] = useState("");
  const [coordinatorMobile, setCoordinatorMobile] = useState("");

  // Domain and sub-domain data
  const [domains, setDomains] = useState<Domain[]>([]);
  const [allSubDomains, setAllSubDomains] = useState<SubDomain[]>([]);
  const [filteredSubDomains, setFilteredSubDomains] = useState<{ value: string; label: string }[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch domains on component mount
  useEffect(() => {
    const fetchDomains = async () => {
      try {
        setLoading(true);
        console.log('🔄 Fetching domains from /api/domains...');
        const response = await fetch('/api/domains');
        console.log('📡 Response status:', response.status);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data: DomainsResponse = await response.json();
        console.log('📊 Domains data received:', data);
        setDomains(data.domains);
        console.log('✅ Domains set in state:', data.domains);
      } catch (error) {
        console.error('❌ Error fetching domains:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDomains();
  }, []);

  // Fetch all sub-domains on component mount
  useEffect(() => {
    const fetchAllSubDomains = async () => {
      try {
        const response = await fetch('/api/sub-domains');
        const data: SubDomainsResponse = await response.json();
        setAllSubDomains(data.subDomains);
      } catch (error) {
        console.error('Error fetching sub-domains:', error);
      }
    };

    fetchAllSubDomains();
  }, []);

  // Filter sub-domains when domain is selected
  useEffect(() => {
    if (selectedDomain && allSubDomains.length > 0) {
      const domainSubDomains = allSubDomains
        .filter(sub => sub.domain_id.toString() === selectedDomain)
        .map(sub => ({
          value: sub.ID.toString(),
          label: sub.Name
        }));
      setFilteredSubDomains(domainSubDomains);
      // Clear selected sub-domains when domain changes
      setSelectedSubDomains([]);
    } else {
      setFilteredSubDomains([]);
    }
  }, [selectedDomain, allSubDomains]);

  // Example: Replace with your real data source for large lists
  const certificateOptions: { value: string; label: string }[] = Array.from({ length: 100 }, (_, i) => ({ value: `cert${i+1}`, label: `شهادة رقم ${i+1}` }));
  const licenseOptions: { value: string; label: string }[] = Array.from({ length: 100 }, (_, i) => ({ value: `license${i+1}`, label: `ترخيص رقم ${i+1}` }));

  const steps = [1, 2, 3, 4]; // Remove step 5

  const handleSubmit = () => {
    const payload = {
      commercialRegNumber,
      institutionName,
      institutionType,
      selectedDomain,
      selectedSubDomains,
      regionId: selectedRegionId,
      cityId: selectedCityId,
      mobileNumber,
      activityDescription,
      certificates,
      licenses,
      coordinator: {
        name: coordinatorName,
        email: coordinatorEmail,
        mobile: coordinatorMobile,
      },
    };
    // TODO: send payload to server. For now, just log it.
    // Replace with fetch('/api/register', { method: 'POST', body: JSON.stringify(payload) }) etc.
    // eslint-disable-next-line no-console
    console.log('submit payload', payload);
    alert('تم إرسال النموذج. تحقق من الكونسول (console) للتفاصيل.');
  };

  return (
    <div className="min-h-screen bg-white px-14 py-16" dir="rtl">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="text-right mb-24">
          <h1 className="text-3xl font-bold text-tawreed-text-dark mb-4 font-arabic">
            تسجيل جديد
          </h1>
          <p className="text-base text-tawreed-text-gray font-arabic">
            املأ البيانات المطلوبة لتسجيل حسابك الجديد!
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-16">
          <div className="flex items-center gap-0">
            {steps.map((step, index) => (
              <div key={step} className="flex items-center">
                {/* Step Circle */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    step <= currentStep
                      ? "bg-tawreed-green text-white"
                      : "bg-gray-100 text-tawreed-text-gray"
                  }`}
                >
                  {step}
                </div>

                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div
                    className={`w-12 h-1 ${
                      step < currentStep
                        ? "bg-tawreed-green"
                        : step === currentStep
                        ? "bg-tawreed-green"
                        : "bg-gray-100"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Form Container */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white border border-tawreed-border-gray rounded-xl shadow-sm p-6 mb-8">
            {currentStep === 1 ? (
              <>
                {/* Step 1: Institution Data */}
                <h2 className="text-xl font-bold text-tawreed-text-dark mb-6 text-right font-arabic">
                  بيانات الموسسة
                </h2>

                {/* Commercial Registration Number */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-tawreed-text-dark mb-2 text-right font-arabic">
                    السجل التجاري
                  </label>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={commercialRegNumber}
                        onChange={(e) => setCommercialRegNumber(e.target.value)}
                        placeholder="رقم السجل التجاري"
                        className="w-full px-3 py-2.5 text-right border border-tawreed-border-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-tawreed-green focus:border-transparent font-arabic"
                        dir="rtl"
                      />
                    </div>
                    <button className="px-4 py-2.5 bg-gray-200 text-tawreed-text-dark rounded-lg border border-tawreed-border-gray font-medium text-sm font-arabic hover:bg-gray-300 transition-colors">
                      تحقق
                    </button>
                  </div>
                </div>

                {/* OTP Input */}
                <div className="mb-6">
                  <input
                    type="text"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="ادخل رقم OTP  المرسل الى رقم الجوال المؤسسة التجارية"
                    className="w-full px-3 py-2.5 text-right border border-tawreed-border-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-tawreed-green focus:border-transparent font-arabic text-sm"
                    dir="rtl"
                  />
                </div>
              </>
            ) : currentStep === 2 ? (
              <>
                {/* Step 2: Basic Information */}
                <h2 className="text-xl font-bold text-tawreed-text-dark mb-6 text-right font-arabic">
                  البيانات الأساسية
                </h2>

                {/* Institution Name */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-tawreed-text-dark mb-2 text-right font-arabic">
                    اسم المؤسسة التجارية
                  </label>
                  <input
                    type="text"
                    value={institutionName}
                    onChange={(e) => setInstitutionName(e.target.value)}
                    placeholder="أدخل عنوان الموسسة التجارية المسجلة في وزارة التجارة"
                    className="w-full px-3 py-2.5 text-right border border-tawreed-border-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-tawreed-green focus:border-transparent font-arabic text-sm"
                    dir="rtl"
                  />
                </div>

                {/* Institution Classification */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-tawreed-text-dark mb-2 text-right font-arabic">
                    النشاط الرئيسي
                  </label>
                  <div className="relative">
                    <select
                      value={selectedDomain}
                      onChange={(e) => setSelectedDomain(e.target.value)}
                      className="w-full px-3 py-2.5 text-right border border-tawreed-border-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-tawreed-green focus:border-transparent font-arabic text-sm appearance-none bg-white"
                      dir="rtl"
                      disabled={loading}
                    >
                      <option value="">
                        {loading ? "جاري التحميل..." : `اختر النشاط الرئيسي (${domains.length})`}
                      </option>
                      {domains.map((domain) => (
                        <option key={domain.ID} value={domain.ID.toString()}>
                          {domain.Name}
                        </option>
                      ))}
                    </select>
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-50">
                        <path d="M4 6L8 10L12 6" stroke="#22262A" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                  
                  {/* Debug Info */}
                  <div className="mt-2 text-xs text-gray-600 text-right">
                    Status: {loading ? 'Loading...' : 'Ready'} | 
                    Domains: {domains.length} | 
                    Selected: {selectedDomain || 'None'}
                  </div>
                </div>
                {/* Sub-Domain Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-tawreed-text-dark mb-2 text-right font-arabic">
                    النشاط الفرعي
                  </label>
                  <div className="relative">
                    <Select
                      isMulti
                      options={filteredSubDomains}
                      value={selectedSubDomains}
                      onChange={(selected: any) => setSelectedSubDomains(selected ? [...selected] : [])}
                      placeholder={selectedDomain ? "اختر الأنشطة الفرعية..." : "اختر النشاط الرئيسي أولاً"}
                      isDisabled={!selectedDomain}
                      classNamePrefix="react-select"
                      styles={{
                        control: (base) => ({ 
                          ...base, 
                          direction: 'rtl', 
                          fontFamily: 'inherit', 
                          fontSize: '1rem', 
                          borderColor: '#E5E7EB',
                          opacity: !selectedDomain ? 0.5 : 1
                        }),
                        menu: (base) => ({ ...base, direction: 'rtl', fontFamily: 'inherit', fontSize: '1rem' })
                      }}
                    />
                  </div>
                  {selectedSubDomains.length > 0 && (
                    <div className="mt-2 text-sm text-tawreed-text-gray text-right">
                      تم اختيار {selectedSubDomains.length} نشاط فرعي
                    </div>
                  )}
                </div>

                {/* Location Selector */}
                <div className="mb-6">
                  <LocationSelector
                    regionId={selectedRegionId}
                    cityId={selectedCityId}
                    onRegionChange={setSelectedRegionId}
                    onCityChange={setSelectedCityId}
                    required={true}
                  />
                </div>

                {/* Mobile Number */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-tawreed-text-dark mb-2 text-right font-arabic">
                    رقم جوال الموسسة
                  </label>
                  <input
                    type="tel"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    placeholder="ادخل رقم جوال الموسسة التجارية"
                    className="w-full px-3 py-2.5 text-right border border-tawreed-border-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-tawreed-green focus:border-transparent font-arabic text-sm"
                    dir="rtl"
                  />
                </div>
              </>
            ) : currentStep === 3 ? (
              <>
                {/* Step 3: Description and Requirements */}
                <h2 className="text-xl font-bold text-tawreed-text-dark mb-6 text-right font-arabic">
                  الوصف والمتطلبات
                </h2>

                {/* Institution Activity Description */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-tawreed-text-dark mb-2 text-right font-arabic">
                    وصف نشاط المؤسسة
                  </label>
                  <textarea
                    value={activityDescription}
                    onChange={(e) => setActivityDescription(e.target.value)}
                    placeholder="اكتب وصفاً مفصلاً للموسسة ونشاطها..."
                    rows={6}
                    className="w-full px-3 py-2.5 text-right border border-tawreed-border-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-tawreed-green focus:border-transparent font-arabic text-sm resize-none"
                    dir="rtl"
                  />
                </div>

                {/* Institution Certificates */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-tawreed-text-dark mb-2 text-right font-arabic">
                    شهادات الموسسة (شهادة الزكاة، شهادة السعودة...)
                  </label>
                  <div className="relative">
                    <Select
                      isMulti
                      options={certificateOptions}
                      value={certificates}
                      onChange={(selected: any) => setCertificates(selected ? [...selected] : [])}
                      placeholder="اختر الشهادات..."
                      classNamePrefix="react-select"
                      styles={{
                        control: (base) => ({ ...base, direction: 'rtl', fontFamily: 'inherit', fontSize: '1rem', borderColor: '#E5E7EB' }),
                        menu: (base) => ({ ...base, direction: 'rtl', fontFamily: 'inherit', fontSize: '1rem' })
                      }}
                    />
                  </div>
                </div>

                {/* Related Licenses */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-tawreed-text-dark mb-2 text-right font-arabic">
                    التراخيص المربوطة بنشاط المؤسسة
                  </label>
                  <div className="relative">
                    <Select
                      isMulti
                      options={licenseOptions}
                      value={licenses}
                      onChange={(selected: any) => setLicenses(selected ? [...selected] : [])}
                      placeholder="اختر التراخيص..."
                      classNamePrefix="react-select"
                      styles={{
                        control: (base) => ({ ...base, direction: 'rtl', fontFamily: 'inherit', fontSize: '1rem', borderColor: '#E5E7EB' }),
                        menu: (base) => ({ ...base, direction: 'rtl', fontFamily: 'inherit', fontSize: '1rem' })
                      }}
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Step 4: Contact info (matches screenshot) */}
                <h2 className="text-xl font-bold text-tawreed-text-dark mb-6 text-right font-arabic">
                  معلومات التواصل
                </h2>

                <div className="bg-white border border-tawreed-border-gray rounded-xl shadow-sm p-6 mb-8 max-w-4xl mx-auto">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-tawreed-text-dark mb-2 text-right font-arabic">اسم المنسق *</label>
                    <input
                      type="text"
                      value={coordinatorName}
                      onChange={(e) => setCoordinatorName(e.target.value)}
                      placeholder="أدخل اسم ممثل المؤسسة"
                      className="w-full px-3 py-2.5 text-right border border-tawreed-border-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-tawreed-green focus:border-transparent font-arabic text-sm"
                      dir="rtl"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-tawreed-text-dark mb-2 text-right font-arabic">البريد الإلكتروني *</label>
                    <input
                      type="email"
                      value={coordinatorEmail}
                      onChange={(e) => setCoordinatorEmail(e.target.value)}
                      placeholder="example@domain.com"
                      className="w-full px-3 py-2.5 text-right border border-tawreed-border-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-tawreed-green focus:border-transparent font-arabic text-sm"
                      dir="rtl"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-tawreed-text-dark mb-2 text-right font-arabic">رقم الجوال *</label>
                    <input
                      type="tel"
                      value={coordinatorMobile}
                      onChange={(e) => setCoordinatorMobile(e.target.value)}
                      placeholder="05xxxxxxxx"
                      className="w-full px-3 py-2.5 text-right border border-tawreed-border-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-tawreed-green focus:border-transparent font-arabic text-sm"
                      dir="rtl"
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center">
            {/* Next / Submit Button */}
            {currentStep < 4 ? (
              <button
                onClick={() => setCurrentStep(Math.min(currentStep + 1, 4))}
                className="px-4 py-2.5 bg-gradient-to-r from-tawreed-green to-tawreed-green-light text-white rounded-lg font-medium text-sm font-arabic hover:shadow-md transition-all"
              >
                التالي
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="px-4 py-2.5 bg-tawreed-green text-white rounded-lg font-medium text-sm font-arabic hover:shadow-md transition-all"
              >
                إنهاء التسجيل
              </button>
            )}

            <div className="flex gap-2">
              {/* Login Button */}
              <Link
                to="/"
                className="px-6 py-2.5 bg-white text-tawreed-text-dark border border-tawreed-border-gray rounded-lg font-medium text-sm font-arabic hover:bg-gray-50 transition-colors"
              >
                تسجيل الدخول
              </Link>

              {/* Previous Button */}
              <button
                onClick={() => setCurrentStep(Math.max(currentStep - 1, 1))}
                disabled={currentStep === 1}
                className="px-4 py-2.5 bg-white text-tawreed-text-dark border border-tawreed-border-gray rounded-lg font-medium text-sm font-arabic hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                السابق
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
