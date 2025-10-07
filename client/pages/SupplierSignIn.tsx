import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SupplierLoginRequest, SupplierLoginResponse } from '@shared/api';

export default function SupplierSignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!email || !password) {
      setError('يرجى إدخال البريد الإلكتروني وكلمة المرور');
      setIsLoading(false);
      return;
    }

    try {
      const loginRequest: SupplierLoginRequest = {
        account_email: email,
        account_password: password
      };

      const response = await fetch('/api/auth/supplier/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginRequest),
      });

      const data: SupplierLoginResponse = await response.json();

      if (response.ok && data.success) {
        // Store supplier info in localStorage
        const supplierData = {
          id: data.supplier.id,
          account_name: data.supplier.account_name,
          account_email: data.supplier.account_email,
          company_name: data.supplier.company_name,
          city: data.supplier.city,
          commercial_registration_number: data.supplier.commercial_registration_number,
          commercial_phone_number: data.supplier.commercial_phone_number,
          account_phone: data.supplier.account_phone,
          domain: data.supplier.domain,
          created_at: data.supplier.created_at
        };
        
        // Store in both keys for compatibility
        localStorage.setItem('supplierSession', JSON.stringify(supplierData));
        localStorage.setItem('currentSupplier', JSON.stringify(supplierData));
        
        // Redirect to supplier home page
        navigate('/supplier/home');
      } else {
        setError(data.message || 'فشل في تسجيل الدخول');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center" dir="rtl">
      <div className="w-full max-w-sm bg-white rounded-lg shadow-md p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-green-600 mb-2">توريد</h1>
          <h2 className="text-lg font-semibold text-gray-800 mb-1">تسجيل الدخول المورد</h2>
          <p className="text-sm text-gray-500">
            أدخل بياناتك للدخول إلى بوابة المورد والمشترين
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Email Field */}
          <div>
            <label className="block text-sm text-gray-600 mb-2">
              البريد الإلكتروني أو اسم المستخدم
            </label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="أدخل بريدك الإلكتروني"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-colors"
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm text-gray-600 mb-2">
              أدخل كلمة المرور
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="أدخل كلمة المرور"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-colors"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-500 hover:bg-green-600 disabled:bg-green-300 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
          >
            {isLoading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
          </button>
        </form>

        {/* Footer Link */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
             <Link to="/" className="text-green-600 hover:text-green-700">
                          العودة للصفحة الرئيسية
              </Link>
          </p>
          <p className="text-xs text-gray-400 mt-2">
            بالنقر على تسجيل الدخول فإنك تتفق مع شروط الخدمة
          </p>
        </div>
      </div>
    </div>
  );
}