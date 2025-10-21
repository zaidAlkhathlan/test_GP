import { useState, useEffect } from "react";
import Select from "react-select";
import { Link } from "react-router-dom";
import { Domain, SubDomain, DomainsResponse, SubDomainsResponse } from "@shared/api";
import LocationSelector from "../components/LocationSelector";
import { Eye, EyeOff } from "lucide-react"; // make sure you have lucide-react installed

export default function Register() {
  // --- State for the new verification flow ---
  const [commercialRegNumber, setCommercialRegNumber] = useState("");
  const [isCrVerified, setIsCrVerified] = useState(false); // Tracks if the CR is verified
  const [verificationMessage, setVerificationMessage] = useState("");
  const [verificationError, setVerificationError] = useState("");
  // --- End of new state ---


  const [currentStep, setCurrentStep] = useState(1);
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

  const [domains, setDomains] = useState<Domain[]>([]);
  const [allSubDomains, setAllSubDomains] = useState<SubDomain[]>([]);
  const [filteredSubDomains, setFilteredSubDomains] = useState<{ value: string; label: string }[]>([]);
  const [loading, setLoading] = useState(false);


    const [coordinatorPassword, setCoordinatorPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);


const [isVerifying, setIsVerifying] = useState(false);
const [isResendDisabled, setIsResendDisabled] = useState(false);
const [resendCountdown, setResendCountdown] = useState(0);
const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

const handleVerifyCrNumber = async () => {
  if (!commercialRegNumber || isVerifying) return; // prevent spam

  setIsVerifying(true);
  setVerificationError("");
  setVerificationMessage("");

  try {
    // 1️⃣ Verify CR
    const verifyRes = await fetch(`/api/registrations/verify/${commercialRegNumber}`);
    const verifyData = await verifyRes.json();
    if (!verifyRes.ok) throw new Error(verifyData.message || "رقم السجل التجاري غير موجود.");

    const phone = verifyData.phoneNumber;
    setInstitutionName(verifyData.name);
    setMobileNumber(phone);

    // 2️⃣ Send OTP
    const sendRes = await fetch(`/api/registrations/send-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone }),
    });

    const sendData = await sendRes.json();
    if (!sendRes.ok || !sendData.success)
      throw new Error(sendData.message || "فشل في إرسال رمز التحقق.");

    // 3️⃣ Success
    const lastFour = phone.slice(-4);
    setVerificationMessage(`تم إرسال رمز التحقق إلى الرقم المنتهي بـ ******${lastFour}`);
    setIsCrVerified(true);
  } catch (err: any) {
    console.error("❌ Verification error:", err);
    setVerificationError(err.message);
  } finally {
    setIsVerifying(false);
  }
};

const handleResendOtp = async () => {
  if (isResendDisabled) return; // prevent spam

  setIsResendDisabled(true);
  setResendCountdown(20);

  const timer = setInterval(() => {
    setResendCountdown((prev) => {
      if (prev <= 1) {
        clearInterval(timer);
        setIsResendDisabled(false);
        return 0;
      }
      return prev - 1;
    });
  }, 1000);

  try {
    const sendRes = await fetch(`/api/registrations/send-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: mobileNumber }),
    });

    const sendData = await sendRes.json();
    if (!sendRes.ok || !sendData.success)
      throw new Error(sendData.message || "فشل في إرسال رمز التحقق.");

    setVerificationMessage("تم إرسال رمز جديد بنجاح.");
    setVerificationError("");
  } catch (err: any) {
    console.error("❌ Resend error:", err);
    setVerificationError(err.message);
    setIsResendDisabled(false);
    setResendCountdown(0);
  }
};


const handleVerifyOtp = async () => {
  if (!otpCode || isVerifyingOtp) return; // prevent double click
  setVerificationError("");
  setIsVerifyingOtp(true);

  try {
    const response = await fetch(`/api/registrations/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phoneNumber: mobileNumber,
        otpCode,
      }),
    });

    const data = await response.json();
    if (!response.ok || !data.success)
      throw new Error(data.message || "رمز التحقق غير صحيح أو منتهي الصلاحية.");

    setVerificationMessage("✅ تم التحقق بنجاح!");
    setVerificationError("");
    setTimeout(() => setCurrentStep(2), 800);
  } catch (error: any) {
    console.error("❌ OTP Verify Error:", error);
    setVerificationError(error.message);
  } finally {
    setIsVerifyingOtp(false);
  }
};





  // --- End of new function ---

  // Fetch domains on component mount
  useEffect(() => {
    const fetchDomains = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/domains');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data: DomainsResponse = await response.json();
        setDomains(data.domains);
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
        .map(sub => ({ value: sub.ID.toString(), label: sub.Name }));
      setFilteredSubDomains(domainSubDomains);
      setSelectedSubDomains([]);
    } else {
      setFilteredSubDomains([]);
    }
  }, [selectedDomain, allSubDomains]);

  const certificateOptions: { value: string; label: string }[] = Array.from({ length: 100 }, (_, i) => ({ value: `cert${i+1}`, label: `شهادة رقم ${i+1}` }));
  const licenseOptions: { value: string; label: string }[] = Array.from({ length: 100 }, (_, i) => ({ value: `license${i+1}`, label: `ترخيص رقم ${i+1}` }));
  const steps = [1, 2, 3, 4, 5];


  const [verifiedPhoneNumber, setVerifiedPhoneNumber] = useState("");


const handleSubmit = async () => {
  const payload = {
    institutionType,
    commercialRegNumber,
    institutionName,
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
      password: coordinatorPassword,
    },
  };

  try {
    const res = await fetch("/api/registrations/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.message);
    alert("✅ تم التسجيل بنجاح!");
  } catch (err: any) {
    alert(`❌ فشل التسجيل: ${err.message}`);
  }
};



  return (
    <div className="min-h-screen bg-white px-14 py-16" dir="rtl">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="text-right mb-24">
          <h1 className="text-3xl font-bold text-tawreed-text-dark mb-4 font-arabic">تسجيل جديد</h1>
          <p className="text-base text-tawreed-text-gray font-arabic">املأ البيانات المطلوبة لتسجيل حسابك الجديد!</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-16">
          <div className="flex items-center gap-0">
            {steps.map((step, index) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step <= currentStep ? "bg-tawreed-green text-white" : "bg-gray-100 text-tawreed-text-gray"}`}>
                  {step}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-12 h-1 ${step < currentStep ? "bg-tawreed-green" : "bg-gray-100"}`} />
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
    <h2 className="text-xl font-bold text-tawreed-text-dark mb-6 text-right font-arabic">
      بيانات المؤسسة
    </h2>

    {/* سجل تجاري */}
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
            disabled={isCrVerified}
          />
        </div>
     <button
  onClick={handleVerifyCrNumber}
  disabled={isVerifying || isCrVerified}
  className={`px-4 py-2.5 rounded-lg border text-sm font-arabic transition-colors ${
    isVerifying
      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
      : "bg-gray-200 text-tawreed-text-dark hover:bg-gray-300"
  }`}
>
  {isVerifying ? "جاري التحقق..." : "تحقق"}
</button>

      </div>

      {/* Messages */}
      {verificationMessage && (
        <p className="text-green-600 text-right mt-2 font-arabic">{verificationMessage}</p>
      )}
      {verificationError && (
        <p className="text-red-600 text-right mt-2 font-arabic">{verificationError}</p>
      )}
    </div>

    {/* OTP Input + Buttons */}
    {isCrVerified && (
      <div className="mb-6">
        <input
          type="text"
          value={otpCode}
          onChange={(e) => setOtpCode(e.target.value)}
          placeholder="أدخل رقم OTP المرسل إلى رقم الجوال المسجل"
          className="w-full px-3 py-2.5 text-right border border-tawreed-border-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-tawreed-green focus:border-transparent font-arabic text-sm"
          dir="rtl"
        />
        <div className="flex justify-between mt-3">
<button
  onClick={handleVerifyOtp}
  disabled={isVerifyingOtp}
  className={`px-4 py-2.5 rounded-lg font-medium text-sm font-arabic transition-all ${
    isVerifyingOtp
      ? "bg-gray-300 text-gray-600 cursor-not-allowed"
      : "bg-tawreed-green text-white hover:shadow-md"
  }`}
>
  {isVerifyingOtp ? "جاري التحقق..." : "تحقق من الرمز"}
</button>

       <button
  onClick={handleResendOtp}
  disabled={isResendDisabled}
  className="px-4 py-2.5 bg-gray-100 text-tawreed-text-dark border border-tawreed-border-gray rounded-lg font-medium text-sm font-arabic hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
>
  {isResendDisabled ? `إعادة الإرسال بعد ${resendCountdown} ث` : "إعادة الإرسال"}
</button>

        </div>
      </div>
    )}
  </>

  ) : currentStep === 2 ? (
  <>
    <h2 className="text-xl font-bold text-tawreed-text-dark mb-6 text-right font-arabic">
      نوع التسجيل
    </h2>
    <p className="text-right text-tawreed-text-gray mb-8 font-arabic">
      يرجى اختيار نوع الحساب الذي ترغب في تسجيله في المنصة:
    </p>

    <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-10">
      <button
        onClick={() => {
          setInstitutionType("buyer");
          setCurrentStep(3);
        }}
        className={`w-64 py-4 border rounded-xl text-lg font-arabic transition-all ${
          institutionType === "buyer"
            ? "bg-tawreed-green text-white shadow-md"
            : "bg-white text-tawreed-text-dark border-tawreed-border-gray hover:bg-gray-50"
        }`}
      >
        مشتري
      </button>

      <button
        onClick={() => {
          setInstitutionType("supplier");
          setCurrentStep(3);
        }}
        className={`w-64 py-4 border rounded-xl text-lg font-arabic transition-all ${
          institutionType === "supplier"
            ? "bg-tawreed-green text-white shadow-md"
            : "bg-white text-tawreed-text-dark border-tawreed-border-gray hover:bg-gray-50"
        }`}
      >
        مورد
      </button>
    </div>
  </>

  ) : currentStep === 3 ? (
  <>
    <h2 className="text-xl font-bold text-tawreed-text-dark mb-6 text-right font-arabic">
      البيانات الأساسية
    </h2>

    {/* Company Name */}
    <div className="mb-6">
      <label className="block text-sm font-medium text-tawreed-text-dark mb-2 text-right font-arabic">
        اسم المؤسسة التجارية
      </label>
      <input
        type="text"
        value={institutionName}
        className="w-full px-3 py-2.5 text-right border border-tawreed-border-gray rounded-lg
        focus:outline-none focus:ring-2 focus:ring-tawreed-green focus:border-transparent font-arabic text-sm"
        dir="rtl"
        disabled
      />
    </div>

    {/* City / Location */}
    <div className="mb-6">
      <LocationSelector
        regionId={selectedRegionId}
        cityId={selectedCityId}
        onRegionChange={setSelectedRegionId}
        onCityChange={setSelectedCityId}
        required
      />
    </div>

    {/* Domain */}
    <div className="mb-6">
      <label className="block text-sm font-medium text-tawreed-text-dark mb-2 text-right font-arabic">
        النشاط الرئيسي
      </label>
      <div className="relative">
        <select
          value={selectedDomain}
          onChange={(e) => setSelectedDomain(e.target.value)}
          className="w-full px-3 py-2.5 text-right border border-tawreed-border-gray rounded-lg
          focus:outline-none focus:ring-2 focus:ring-tawreed-green focus:border-transparent font-arabic text-sm appearance-none bg-white"
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
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
            xmlns="http://www.w3.org/2000/svg" className="opacity-50">
            <path d="M4 6L8 10L12 6" stroke="#22262A" strokeWidth="1.33333"
              strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </div>

    {/* Subdomain */}
    <div className="mb-6">
      <label className="block text-sm font-medium text-tawreed-text-dark mb-2 text-right font-arabic">
        النشاط الفرعي
      </label>
      <Select
        isMulti
        options={filteredSubDomains}
        value={selectedSubDomains}
        onChange={(selected: any) =>
          setSelectedSubDomains(selected ? [...selected] : [])
        }
        placeholder={
          selectedDomain ? "اختر الأنشطة الفرعية..." : "اختر النشاط الرئيسي أولاً"
        }
        isDisabled={!selectedDomain}
        classNamePrefix="react-select"
        styles={{
          control: (base) => ({
            ...base,
            direction: "rtl",
            fontFamily: "inherit",
            fontSize: "1rem",
            borderColor: "#E5E7EB",
            opacity: !selectedDomain ? 0.5 : 1,
          }),
          menu: (base) => ({
            ...base,
            direction: "rtl",
            fontFamily: "inherit",
            fontSize: "1rem",
          }),
        }}
      />
    </div>

    {/* Mobile Number */}
    <div className="mb-6">
      <label className="block text-sm font-medium text-tawreed-text-dark mb-2 text-right font-arabic">
        رقم جوال المؤسسة
      </label>
      <input
        type="tel"
        value={mobileNumber}
        className="w-full px-3 py-2.5 text-right border border-tawreed-border-gray rounded-lg
        focus:outline-none focus:ring-2 focus:ring-tawreed-green focus:border-transparent font-arabic text-sm"
        dir="ltr"
        disabled

      />
    </div>
  </>
) : currentStep === 4 ? (
  <>
    <h2 className="text-xl font-bold text-tawreed-text-dark mb-6 text-right font-arabic">
      الوصف والمتطلبات
    </h2>

    {/* Supplier only */}
    {institutionType === "supplier" && (
      <>
        {/* Certificates */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-tawreed-text-dark mb-2 text-right font-arabic">
            شهادات المؤسسة (شهادة الزكاة، شهادة السعودة...)
          </label>
          <Select
            isMulti
            options={certificateOptions}
            value={certificates}
            onChange={(selected: any) =>
              setCertificates(selected ? [...selected] : [])
            }
            placeholder="اختر الشهادات..."
            classNamePrefix="react-select"
            styles={{
              control: (base) => ({
                ...base,
                direction: "rtl",
                fontFamily: "inherit",
                fontSize: "1rem",
                borderColor: "#E5E7EB",
              }),
              menu: (base) => ({
                ...base,
                direction: "rtl",
                fontFamily: "inherit",
                fontSize: "1rem",
              }),
            }}
          />
        </div>

        {/* Licenses */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-tawreed-text-dark mb-2 text-right font-arabic">
            التراخيص المرتبطة بنشاط المؤسسة
          </label>
          <Select
            isMulti
            options={licenseOptions}
            value={licenses}
            onChange={(selected: any) =>
              setLicenses(selected ? [...selected] : [])
            }
            placeholder="اختر التراخيص..."
            classNamePrefix="react-select"
            styles={{
              control: (base) => ({
                ...base,
                direction: "rtl",
                fontFamily: "inherit",
                fontSize: "1rem",
                borderColor: "#E5E7EB",
              }),
              menu: (base) => ({
                ...base,
                direction: "rtl",
                fontFamily: "inherit",
                fontSize: "1rem",
              }),
            }}
          />
        </div>
      </>
    )}

    {/* Shared Description */}
    <div className="mb-6">
      <label className="block text-sm font-medium text-tawreed-text-dark mb-2 text-right font-arabic">
        وصف نشاط المؤسسة
      </label>
      <textarea
        value={activityDescription}
        onChange={(e) => setActivityDescription(e.target.value)}
        placeholder="اكتب وصفاً مفصلاً للمؤسسة ونشاطها..."
        rows={6}
        className="w-full px-3 py-2.5 text-right border border-tawreed-border-gray rounded-lg
        focus:outline-none focus:ring-2 focus:ring-tawreed-green focus:border-transparent font-arabic text-sm resize-none"
        dir="rtl"
      />
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


<div className="mb-4 relative">
  <label className="block text-sm font-medium text-tawreed-text-dark mb-2 text-right font-arabic">
    كلمة المرور *
  </label>

  <div className="relative flex items-center">
    <input
      type={showPassword ? "text" : "password"}
      value={coordinatorPassword}
      onChange={(e) => setCoordinatorPassword(e.target.value)}
      placeholder="••••••••••"
      className="w-full  py-2.5 text-right border border-tawreed-border-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-tawreed-green focus:border-transparent font-arabic text-sm pr-2"
      dir="rtl"
    />
    <button
      type="button"
      onClick={() => setShowPassword((prev) => !prev)}
      className="absolute left-3 flex items-center justify-center text-gray-500 hover:text-gray-700 h-full"
    >
      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
    </button>
  </div>
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
            {currentStep < 5 ? (
              <button onClick={() => setCurrentStep(Math.min(currentStep + 1, 5))} className="px-4 py-2.5 bg-gradient-to-r from-tawreed-green to-tawreed-green-light text-white rounded-lg font-medium text-sm font-arabic hover:shadow-md transition-all">التالي</button>
            ) : (
              <button onClick={handleSubmit} className="px-4 py-2.5 bg-tawreed-green text-white rounded-lg font-medium text-sm font-arabic hover:shadow-md transition-all">إنهاء التسجيل</button>
            )}
            <div className="flex gap-2">
              <Link to="/" className="px-6 py-2.5 bg-white text-tawreed-text-dark border border-tawreed-border-gray rounded-lg font-medium text-sm font-arabic hover:bg-gray-50 transition-colors">تسجيل الدخول</Link>
              <button onClick={() => setCurrentStep(Math.max(currentStep - 1, 1))} disabled={currentStep === 1} className="px-4 py-2.5 bg-white text-tawreed-text-dark border border-tawreed-border-gray rounded-lg font-medium text-sm font-arabic hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">السابق</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}