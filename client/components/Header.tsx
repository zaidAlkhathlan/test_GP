import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface User {
  id: number;
  account_name: string;
  account_email: string;
  company_name: string;
  city?: string;
  industry?: string;
}

interface HeaderProps {
  userType: 'buyer' | 'supplier';
  className?: string;
}

export default function Header({ userType, className = '' }: HeaderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Get user data based on user type
    const storageKey = userType === 'buyer' ? 'currentBuyer' : 'currentSupplier';
    const userData = localStorage.getItem(storageKey);
    
    if (userData) {
      try {
        setCurrentUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
        handleLogout();
      }
    }
  }, [userType]);

  const handleLogout = () => {
    const storageKey = userType === 'buyer' ? 'currentBuyer' : 'currentSupplier';
    localStorage.removeItem(storageKey);
    const redirectPath = userType === 'buyer' ? '/buyer/signin' : '/supplier/signin';
    navigate(redirectPath);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement search functionality
    console.log('Searching for:', searchQuery);
  };

  // Navigation items based on user type
  const buyerNavItems = [
    { label: 'الرئيسية', path: '/buyer/home' },
    { label: 'المناقصات النشطة', path: '/tenders/active' },
    { label: 'المناقصات المنتهية', path: '/tenders/expired' },
    { label: 'من نحن', path: '/about' },
    { label: 'اتصل بنا', path: '/contact' }
  ];

  const supplierNavItems = [
    { label: 'المناقصات المتاحة', path: '/supplier/tenders' },
    { label: 'عروضي', path: '/supplier/offers' },
    { label: 'المناقصات المنتهية', path: '/supplier/expired' },
    { label: 'من نحن', path: '/about' },
    { label: 'اتصل بنا', path: '/contact' }
  ];

  const navItems = userType === 'buyer' ? buyerNavItems : supplierNavItems;

  return (
    <header className={`bg-white shadow-sm border-b ${className}`}>
      <div className="w-full px-6 lg:px-8">
        <div className="flex items-center h-16" dir="rtl">
          {/* Far Right - Logo */}
          <div className="flex items-center mr-8">
            <Link to={userType === 'buyer' ? '/buyer/home' : '/supplier/home'} className="text-tawreed-green font-bold text-xl">
              توريد
            </Link>
          </div>

          {/* Center-Right - Navigation Menu */}
          <nav className="hidden lg:flex items-center gap-8 mr-12">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="text-sm text-tawreed-text-dark hover:text-tawreed-green transition-colors hover:underline whitespace-nowrap"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Center - Search Bar */}
          <div className="flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="بحث..."
                dir="rtl"
                className="w-full px-4 py-2 rounded-lg border border-tawreed-border-gray text-sm focus:outline-none focus:ring-2 focus:ring-tawreed-green focus:border-transparent"
              />
              <button
                type="submit"
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-tawreed-green"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>
          </div>

          {/* Center-Left - Settings and Notifications */}
          <div className="flex items-center gap-4 mr-8">
            {currentUser && (
              <>
                {/* Settings Button */}
                <button className="p-2 text-gray-600 hover:text-tawreed-green transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>

                {/* Notification Button */}
                <button className="relative p-2 text-gray-600 hover:text-tawreed-green transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.73 21a2 2 0 01-3.46 0" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9z" />
                  </svg>
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                    3
                  </span>
                </button>
              </>
            )}
          </div>

          {/* Far Left - User Info and Company */}
          <div className="flex items-center">
            {currentUser && (
              <div className="flex items-center gap-4">
                {/* Company Button */}
                <Link 
                  to="/company-profile" 
                  className="bg-tawreed-green text-white px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap hover:bg-green-600 transition-colors cursor-pointer"
                >
                  مؤسسة: {currentUser.company_name}
                </Link>
                
                {/* User Info Section */}
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 whitespace-nowrap">
                    مرحباً، {currentUser.account_name}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50 transition-colors whitespace-nowrap"
                  >
                    تسجيل الخروج
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="lg:hidden border-t border-gray-200 py-2" dir="rtl">
          <nav className="flex flex-wrap justify-center gap-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="text-xs text-tawreed-text-dark hover:text-tawreed-green py-1 px-2"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}