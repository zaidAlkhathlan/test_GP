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
      <div className="w-full max-w-xs bg-white rounded-lg shadow p-6">
        <h2 className="text-center text-tawreed-green text-xl font-bold mb-2">توريد</h2>
        <p className="text-center text-gray-500 text-sm mb-4">تسجيل الدخول للمشتري</p>

        <form onSubmit={handleSubmit}>
          <label className="block text-xs text-gray-600 mb-1">البريد الإلكتروني</label>
          <input 
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded px-3 py-2 mb-3" 
            placeholder="ادخل بريدك الإلكتروني"
            disabled={isLoading}
          />

          <label className="block text-xs text-gray-600 mb-1">كلمة المرور</label>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded px-3 py-2 mb-4" 
            placeholder="ادخل كلمة المرور"
            disabled={isLoading}
          />

          {error && (
            <div className="text-red-500 text-xs mb-3 text-center">
              {error}
            </div>
          )}

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-green-300 to-green-500 text-white py-2 rounded mb-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
          </button>
        </form>

        <div className="text-center text-xs text-gray-500">
          <Link to="/" className="text-tawreed-green">العودة للصفحة الرئيسية</Link>
        </div>
      </div>
    </div>
  );
}
