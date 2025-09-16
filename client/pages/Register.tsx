import { useState } from "react";
import { Link } from "react-router-dom";

export default function Register() {
  const [currentStep, setCurrentStep] = useState(1);
  const [commercialRegNumber, setCommercialRegNumber] = useState("");
  const [otpCode, setOtpCode] = useState("");

  const steps = [1, 2, 3, 4, 5];

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
            {/* Form Header */}
            <h2 className="text-xl font-bold text-tawreed-text-dark mb-6 text-right font-arabic">
              بيانات الموسسة
            </h2>

            {/* Commercial Registration Number */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-tawreed-text-dark mb-2 text-right font-arabic">
                السجل التجاري
              </label>
              <div className="flex gap-4">
                {/* Main Input */}
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
                {/* Verify Button */}
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
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center">
            {/* Next Button */}
            <button
              onClick={() => setCurrentStep(Math.min(currentStep + 1, 5))}
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
