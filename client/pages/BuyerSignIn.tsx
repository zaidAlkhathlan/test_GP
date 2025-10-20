import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LoginRequest, LoginResponse } from '@shared/api';

export default function BuyerSignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('يرجى إدخال البريد الإلكتروني وكلمة المرور');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const loginData: LoginRequest = {
        account_email: email,
        account_password: password
      };

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData)
      });

      const result: LoginResponse = await response.json();

      if (result.success && result.buyer) {
        // Store buyer info in localStorage for the session
        localStorage.setItem('currentBuyer', JSON.stringify(result.buyer));
        
        // Navigate to buyer home page
        navigate('/buyer/home');
      } else {
        setError(result.message || 'فشل في تسجيل الدخول');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('حدث خطأ في الاتصال بالخادم');
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
          <h2 className="text-lg font-semibold text-gray-800 mb-1">تسجيل الدخول المشتري</h2>
          <p className="text-sm text-gray-500">
            أدخل بياناتك للدخول إلى بوابة المورد والمشترين
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Field */}
          <div>
            <label className="block text-sm text-gray-600 mb-2">
              البريد الإلكتروني أو اسم المستخدم
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="أدخل بريدك الإلكتروني"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-colors"
              disabled={isLoading}
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
              disabled={isLoading}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
