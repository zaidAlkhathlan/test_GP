import React from 'react';
import { Link } from 'react-router-dom';

export default function BuyerSignIn() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center" dir="rtl">
      <div className="w-full max-w-xs bg-white rounded-lg shadow p-6">
        <h2 className="text-center text-tawreed-green text-xl font-bold mb-2">توريد</h2>
        <p className="text-center text-gray-500 text-sm mb-4">تسجيل الدخول للمشتري</p>

        <label className="block text-xs text-gray-600 mb-1">البريد الإلكتروني أو اسم المستخدم</label>
        <input className="w-full border rounded px-3 py-2 mb-3" placeholder="ادخل بريدك الإلكتروني" />

        <label className="block text-xs text-gray-600 mb-1">كلمة المرور</label>
        <input type="password" className="w-full border rounded px-3 py-2 mb-4" placeholder="ادخل كلمة المرور" />

        <button className="w-full bg-gradient-to-r from-green-300 to-green-500 text-white py-2 rounded mb-3">تسجيل الدخول</button>

        <div className="text-center text-xs text-gray-500">
          <Link to="/buyer" className="text-tawreed-green">العودة للصفحة الرئيسية</Link>
        </div>
      </div>
    </div>
  );
}
