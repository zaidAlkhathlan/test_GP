import { useState } from "react";
import { Link } from "react-router-dom";

export default function Register() {
  const [currentStep, setCurrentStep] = useState(1); // Start from step 1
  const [commercialRegNumber, setCommercialRegNumber] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [institutionName, setInstitutionName] = useState("");
  const [institutionType, setInstitutionType] = useState("");
  const [location, setLocation] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [activityDescription, setActivityDescription] = useState("");
  const [certificates, setCertificates] = useState("");
  const [licenses, setLicenses] = useState("");

  const steps = [1, 2, 3, 4]; // Remove step 5

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
                    تصنيف الموسسة
                  </label>
                  <div className="relative">
                    <select
                      value={institutionType}
                      onChange={(e) => setInstitutionType(e.target.value)}
                      className="w-full px-3 py-2.5 text-right border border-tawreed-border-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-tawreed-green focus:border-transparent font-arabic text-sm appearance-none bg-white"
                      dir="rtl"
                    >
                      <option value="">اختر فئة الموسسة</option>
                      <option value="manufacturing">تصنيع</option>
                      <option value="services">خدمات</option>
                      <option value="trading">تجارة</option>
                      <option value="contracting">مقاولات</option>
                    </select>
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-50">
                        <path d="M4 6L8 10L12 6" stroke="#22262A" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-tawreed-text-dark mb-2 text-right font-arabic">
                    الموقع
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="أدخل موقع الرئيسي للشركة"
                      className="w-full px-3 py-2.5 pr-10 text-right border border-tawreed-border-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-tawreed-green focus:border-transparent font-arabic text-sm"
                      dir="rtl"
                    />
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13.3334 6.66634C13.3334 9.99501 9.64075 13.4617 8.40075 14.5323C8.28523 14.6192 8.14461 14.6662 8.00008 14.6662C7.85555 14.6662 7.71493 14.6192 7.59941 14.5323C6.35941 13.4617 2.66675 9.99501 2.66675 6.66634C2.66675 5.25185 3.22865 3.8953 4.22885 2.89511C5.22904 1.89491 6.58559 1.33301 8.00008 1.33301C9.41457 1.33301 10.7711 1.89491 11.7713 2.89511C12.7715 3.8953 13.3334 5.25185 13.3334 6.66634Z" stroke="#64748B" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M8 8.66699C9.10457 8.66699 10 7.77156 10 6.66699C10 5.56242 9.10457 4.66699 8 4.66699C6.89543 4.66699 6 5.56242 6 6.66699C6 7.77156 6.89543 8.66699 8 8.66699Z" stroke="#64748B" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
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
            ) : (
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
                    <select
                      value={certificates}
                      onChange={(e) => setCertificates(e.target.value)}
                      className="w-full px-3 py-2.5 text-right border border-tawreed-border-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-tawreed-green focus:border-transparent font-arabic text-sm appearance-none bg-white"
                      dir="rtl"
                    >
                      <option value="">اختر الشهادات</option>
                      <option value="zakat">شهادة الزكاة</option>
                      <option value="saudization">شهادة السعودة</option>
                      <option value="gosi">شهادة التأمينات الاجتماعية</option>
                      <option value="chamber">شهادة الغ��فة التجارية</option>
                    </select>
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-50">
                        <path d="M4 6L8 10L12 6" stroke="#22262A" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Related Licenses */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-tawreed-text-dark mb-2 text-right font-arabic">
                    التراخيص المربوطة بنشاط المؤسسة
                  </label>
                  <div className="relative">
                    <select
                      value={licenses}
                      onChange={(e) => setLicenses(e.target.value)}
                      className="w-full px-3 py-2.5 text-right border border-tawreed-border-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-tawreed-green focus:border-transparent font-arabic text-sm appearance-none bg-white"
                      dir="rtl"
                    >
                      <option value="">اختر التراخيص</option>
                      <option value="commercial">الرخصة التجارية</option>
                      <option value="industrial">الرخصة الصناعية</option>
                      <option value="construction">رخصة المقاولات</option>
                      <option value="professional">الرخصة المهنية</option>
                    </select>
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-50">
                        <path d="M4 6L8 10L12 6" stroke="#22262A" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center">
            {/* Next Button */}
            <button
              onClick={() => setCurrentStep(Math.min(currentStep + 1, 4))}
              className="px-4 py-2.5 bg-gradient-to-r from-tawreed-green to-tawreed-green-light text-white rounded-lg font-medium text-sm font-arabic hover:shadow-md transition-all"
            >
              التالي
            </button>

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
