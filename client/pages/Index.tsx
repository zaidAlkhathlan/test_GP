import { Link } from "react-router-dom";

export default function Index() {
  return (
    <div className="min-h-screen bg-tawreed-bg-gray flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-tawreed-green mb-3 font-arabic">
            توريد
          </h1>
          <h2 className="text-lg text-tawreed-text-gray mb-2 font-arabic">
            منصة المشتريات الذكية
          </h2>
          <p className="text-sm text-tawreed-text-gray leading-relaxed font-arabic px-4">
            منصة المشتريات المدعومة بالذكاء الاصطناعي للمشتريات بين<br />
            الشركات
          </p>
        </div>

        {/* Login Cards */}
        <div className="space-y-4 mb-8">
        <Link to="/buyer/signin" className="block">
  <div className="bg-white rounded-xl border-2 border-tawreed-border-gray p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
    <div className="flex items-center gap-4">
      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-tawreed-green to-tawreed-green-light rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
         <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-white"
                >
                  <path
                    d="M8 22C8.55228 22 9 21.5523 9 21C9 20.4477 8.55228 20 8 20C7.44772 20 7 20.4477 7 21C7 21.5523 7.44772 22 8 22Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M19 22C19.5523 22 20 21.5523 20 21C20 20.4477 19.5523 20 19 20C18.4477 20 18 20.4477 18 21C18 21.5523 18.4477 22 19 22Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2.0498 2.05005H4.0498L6.7098 14.47C6.80738 14.9249 7.06048 15.3315 7.42552 15.6199C7.79056 15.9083 8.24471 16.0604 8.7098 16.05H18.4898C18.945 16.0493 19.3863 15.8933 19.7408 15.6079C20.0954 15.3224 20.3419 14.9246 20.4398 14.48L22.0898 7.05005H5.1198"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
      </div>
      <div className="flex-1 text-right">
        <h3 className="text-lg font-bold text-tawreed-text-dark mb-1 font-arabic">
          تسجيل دخول مشتري
        </h3>
        <p className="text-sm text-tawreed-text-gray font-arabic">
          للجهات الحكومية والشركات الباحثة عن موردين
        </p>
      </div>
    </div>
  </div>
</Link>

          {/* Supplier Login Card */}
          <Link to="/supplier/signin" className="block">
          <div className="bg-white rounded-xl border-2 border-tawreed-border-gray p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-tawreed-green to-[rgba(50,164,79,0.8)] rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-white"
                >
                  <path
                    d="M6 22V4C6 3.46957 6.21071 2.96086 6.58579 2.58579C6.96086 2.21071 7.46957 2 8 2H16C16.5304 2 17.0391 2.21071 17.4142 2.58579C17.7893 2.96086 18 3.46957 18 4V22H6Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M6 12H4C3.46957 12 2.96086 12.2107 2.58579 12.5858C2.21071 12.9609 2 13.4696 2 14V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M18 9H20C20.5304 9 21.0391 9.21071 21.4142 9.58579C21.7893 9.96086 22 10.4696 22 11V20C22 20.5304 21.7893 21.0391 21.4142 21.4142C21.0391 21.7893 20.5304 22 20 22H18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M10 6H14"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M10 10H14"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M10 14H14"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M10 18H14"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="flex-1 text-right">
                <h3 className="text-lg font-bold text-tawreed-text-dark mb-1 font-arabic">
                  تسجيل دخول مورد
                </h3>
                <p className="text-sm text-tawreed-text-gray font-arabic">
                  للشركات الموردة والمقاولين المتخصصين
                </p>
              </div>
            </div>
          </div>
          </Link>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-tawreed-text-gray font-arabic">
            ليس لديك حساب؟{" "}
            <Link
              to="/register"
              className="text-tawreed-green hover:underline font-arabic"
            >
              سجل الآن
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
