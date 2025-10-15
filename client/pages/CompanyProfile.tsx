import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import LocationSelector from '../components/LocationSelector';

interface CompanyProfile {
  id: number;
  company_name: string;
  commercial_registration_number: string;
  commercial_phone_number: string;
  city_id?: number;
  city_name?: string;
  region_name?: string;
  account_name: string;
  account_email: string;
  account_phone: number;
  created_at: string;
  logo?: string;
  industry?: string;
}

interface License {
  id: number;
  name: string;
  description?: string;
}

interface Certificate {
  id: number;
  name: string;
  description?: string;
}

export default function CompanyProfile() {
  const [companyData, setCompanyData] = useState<CompanyProfile | null>(null);
  const [editableData, setEditableData] = useState<Partial<CompanyProfile>>({});
  const [companyDescription, setCompanyDescription] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState<'buyer' | 'supplier'>('buyer');
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showCertificatesDialog, setShowCertificatesDialog] = useState(false);
  const [showLicensesDialog, setShowLicensesDialog] = useState(false);
  const [companyLicenses, setCompanyLicenses] = useState<License[]>([]);
  const [companyCertificates, setCompanyCertificates] = useState<Certificate[]>([]);
  const [licensesLoading, setLicensesLoading] = useState(false);
  const [certificatesLoading, setCertificatesLoading] = useState(false);
  const [availableLicenses, setAvailableLicenses] = useState<License[]>([]);
  const [availableCertificates, setAvailableCertificates] = useState<Certificate[]>([]);
  const [selectedRegionId, setSelectedRegionId] = useState<number>(0);
  const [selectedCityId, setSelectedCityId] = useState<number>(0);
  const [showAddLicenseDialog, setShowAddLicenseDialog] = useState(false);
  const [showAddCertificateDialog, setShowAddCertificateDialog] = useState(false);

  useEffect(() => {
    // Determine user type and get company data
    const buyerData = localStorage.getItem('currentBuyer');
    const supplierData = localStorage.getItem('currentSupplier');
    
    if (buyerData) {
      setUserType('buyer');
      const data = JSON.parse(buyerData);
      setCompanyData(data);
      setEditableData(data);
      setCompanyDescription(data.industry || '');
    } else if (supplierData) {
      setUserType('supplier');
      const data = JSON.parse(supplierData);
      setCompanyData(data);
      setEditableData(data);
      setCompanyDescription(data.industry || '');
    }
    
    setLoading(false);
  }, []);

  // Fetch company licenses and certificates
  const fetchCompanyLicenses = async () => {
    if (!companyData) return;
    
    setLicensesLoading(true);
    try {
      const endpoint = userType === 'buyer' ? 'buyers' : 'suppliers';
      const response = await fetch(`/api/${endpoint}/${companyData.id}/licenses`);
      if (response.ok) {
        const licenses = await response.json();
        setCompanyLicenses(licenses);
      }
    } catch (error) {
      console.error('Error fetching company licenses:', error);
    } finally {
      setLicensesLoading(false);
    }
  };

  const fetchCompanyCertificates = async () => {
    if (!companyData) return;
    
    setCertificatesLoading(true);
    try {
      const endpoint = userType === 'buyer' ? 'buyers' : 'suppliers';
      const response = await fetch(`/api/${endpoint}/${companyData.id}/certificates`);
      if (response.ok) {
        const certificates = await response.json();
        setCompanyCertificates(certificates);
      }
    } catch (error) {
      console.error('Error fetching company certificates:', error);
    } finally {
      setCertificatesLoading(false);
    }
  };

  // Fetch available licenses and certificates for selection
  const fetchAvailableLicenses = async () => {
    try {
      const response = await fetch('/api/available-licenses');
      if (response.ok) {
        const licenses = await response.json();
        setAvailableLicenses(licenses);
      }
    } catch (error) {
      console.error('Error fetching available licenses:', error);
    }
  };

  const fetchAvailableCertificates = async () => {
    try {
      const response = await fetch('/api/available-certificates');
      if (response.ok) {
        const certificates = await response.json();
        setAvailableCertificates(certificates);
      }
    } catch (error) {
      console.error('Error fetching available certificates:', error);
    }
  };

  // Add license to company
  const addLicenseToCompany = async (licenseId: number) => {
    if (!companyData) return;
    
    try {
      const endpoint = userType === 'buyer' ? 'buyers' : 'suppliers';
      const response = await fetch(`/api/${endpoint}/${companyData.id}/licenses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ licenseId })
      });

      if (response.ok) {
        // Refresh company licenses
        await fetchCompanyLicenses();
        setShowAddLicenseDialog(false);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to add license');
      }
    } catch (error) {
      console.error('Error adding license:', error);
      alert('Failed to add license');
    }
  };

  // Remove license from company
  const removeLicenseFromCompany = async (licenseId: number) => {
    if (!companyData) return;
    
    try {
      const endpoint = userType === 'buyer' ? 'buyers' : 'suppliers';
      const response = await fetch(`/api/${endpoint}/${companyData.id}/licenses/${licenseId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        // Refresh company licenses
        await fetchCompanyLicenses();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to remove license');
      }
    } catch (error) {
      console.error('Error removing license:', error);
      alert('Failed to remove license');
    }
  };

  // Add certificate to company
  const addCertificateToCompany = async (certificateId: number) => {
    if (!companyData) return;
    
    try {
      const endpoint = userType === 'buyer' ? 'buyers' : 'suppliers';
      const response = await fetch(`/api/${endpoint}/${companyData.id}/certificates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ certificateId })
      });

      if (response.ok) {
        // Refresh company certificates
        await fetchCompanyCertificates();
        setShowAddCertificateDialog(false);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to add certificate');
      }
    } catch (error) {
      console.error('Error adding certificate:', error);
      alert('Failed to add certificate');
    }
  };

  // Remove certificate from company
  const removeCertificateFromCompany = async (certificateId: number) => {
    if (!companyData) return;
    
    try {
      const endpoint = userType === 'buyer' ? 'buyers' : 'suppliers';
      const response = await fetch(`/api/${endpoint}/${companyData.id}/certificates/${certificateId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        // Refresh company certificates
        await fetchCompanyCertificates();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to remove certificate');
      }
    } catch (error) {
      console.error('Error removing certificate:', error);
      alert('Failed to remove certificate');
    }
  };

  // Save company profile changes
  const saveProfileChanges = async () => {
    if (!companyData) return;

    setIsSaving(true);
    try {
      const endpoint = userType === 'buyer' ? 'buyers' : 'suppliers';
      const dataToUpdate = {
        ...editableData,
        industry: companyDescription || companyData.industry
      };

      const response = await fetch(`/api/${endpoint}/${companyData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToUpdate)
      });

      if (response.ok) {
        const updatedData = await response.json();
        // Update local storage and state
        if (userType === 'buyer') {
          localStorage.setItem('currentBuyer', JSON.stringify(updatedData));
        } else {
          localStorage.setItem('currentSupplier', JSON.stringify(updatedData));
        }
        setCompanyData(updatedData);
        setEditableData({});
        setIsEditing(false);
        alert('تم حفظ التغييرات بنجاح!');
      } else {
        const error = await response.json();
        alert(error.message || 'فشل في حفظ التغييرات');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('حدث خطأ أثناء حفظ التغييرات');
    } finally {
      setIsSaving(false);
    }
  };

  // Fetch licenses and certificates when companyData is available
  useEffect(() => {
    if (companyData) {
      fetchCompanyLicenses();
      fetchCompanyCertificates();
      fetchAvailableLicenses();
      fetchAvailableCertificates();
    }
  }, [companyData, userType]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header userType={userType} />
        <div className="max-w-4xl mx-auto px-6 py-10">
          <div className="bg-white rounded-lg shadow-sm p-8 animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!companyData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header userType={userType} />
        <div className="max-w-4xl mx-auto px-6 py-10">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">لم يتم العثور على بيانات الشركة</h3>
            <p className="text-gray-600 mb-6">يرجى تسجيل الدخول مرة أخرى</p>
            <Link to={userType === 'buyer' ? '/buyer/signin' : '/supplier/signin'} className="px-4 py-2 bg-tawreed-green text-white rounded-lg hover:bg-green-600">
              تسجيل الدخول
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <Header userType={userType} />
      
      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">الملف الشخصي</h1>
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 bg-tawreed-green text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              {isEditing ? 'إلغاء التعديل' : 'تعديل الملف الشخصي'}
            </button>
          </div>
          <p className="text-gray-600">بإمكانك إدارة ملفك الشخصي من خلال هذه الصفحة</p>
        </div>

        {/* Company Logo and Basic Info */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
              {companyData.logo ? (
                <img src={companyData.logo} alt="Company Logo" className="w-full h-full rounded-full object-cover" />
              ) : (
                <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7V10C2 16 6 20.5 12 22C18 20.5 22 16 22 10V7L12 2Z" />
                </svg>
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">{companyData.company_name}</h2>
              <p className="text-gray-600">{companyData.industry || 'خطأ في التحميل'}</p>
              <button 
                className="mt-2 text-sm text-tawreed-green hover:underline"
                onClick={() => {
                  // Create hidden file input and trigger click
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = 'image/*';
                  input.onchange = (e) => {
                    const file = (e.target as HTMLInputElement).files?.[0];
                    if (file) {
                      // Handle logo upload here
                      console.log('Logo file selected:', file);
                      // TODO: Implement logo upload functionality
                    }
                  };
                  input.click();
                }}
              >
                تغيير الشعار
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">البيانات الأساسية</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">اسم المؤسسة التجارية</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editableData.company_name || ''}
                    onChange={(e) => setEditableData(prev => ({ ...prev, company_name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tawreed-green"
                  />
                ) : (
                  <div className="px-3 py-2 bg-gray-50 rounded-lg text-gray-900">
                    {companyData.company_name}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">مختار تواصل</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editableData.account_name || ''}
                    onChange={(e) => setEditableData(prev => ({ ...prev, account_name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tawreed-green"
                  />
                ) : (
                  <div className="px-3 py-2 bg-gray-50 rounded-lg text-gray-900">
                    {companyData.account_name}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">تصنيف المؤسسة</label>
                <div className="px-3 py-2 bg-gray-50 rounded-lg text-gray-900">
                  {userType === 'buyer' ? 'مشتري' : 'مورد'}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الموقع</label>
                {isEditing ? (
                  <LocationSelector
                    regionId={selectedRegionId}
                    cityId={selectedCityId}
                    onRegionChange={(regionId) => {
                      setSelectedRegionId(regionId);
                    }}
                    onCityChange={(cityId) => {
                      setSelectedCityId(cityId);
                      setEditableData(prev => ({ ...prev, city_id: cityId }));
                    }}
                    required={true}
                  />
                ) : (
                  <div className="px-3 py-2 bg-gray-50 rounded-lg text-gray-900 flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12,2C15.31,2 18,4.66 18,7.95C18,12.41 12,19 12,19S6,12.41 6,7.95C6,4.66 8.69,2 12,2M12,6A2,2 0 0,0 10,8A2,2 0 0,0 12,10A2,2 0 0,0 14,8A2,2 0 0,0 12,6Z" />
                    </svg>
                    {companyData.city_name && companyData.region_name 
                      ? `${companyData.city_name}, ${companyData.region_name}`
                      : 'خطأ في التحميل'
                    }
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">رقم جوال المؤسسة</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editableData.commercial_phone_number || ''}
                    onChange={(e) => setEditableData(prev => ({ ...prev, commercial_phone_number: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tawreed-green"
                  />
                ) : (
                  <div className="px-3 py-2 bg-gray-50 rounded-lg text-gray-900">
                    {companyData.commercial_phone_number}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">معلومات التواصل</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">وصف نشاط المؤسسة</label>
                <textarea 
                  value={companyDescription}
                  onChange={(e) => setCompanyDescription(e.target.value)}
                  disabled={!isEditing}
                  className={`w-full px-3 py-2 rounded-lg h-24 resize-none focus:outline-none focus:ring-2 focus:ring-tawreed-green ${
                    isEditing 
                      ? 'border border-gray-300' 
                      : 'bg-gray-50 border-none text-gray-900'
                  }`}
                  placeholder="اكتب محاور وخبرات ونماذج الأعمال والأنشطة الرئيسية التي يمكن أن تكون في المؤسسة"
                />
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">مؤهلات المؤسسة (الشهادات)</h4>
                <div className="space-y-2">
                  {certificatesLoading ? (
                    <div className="text-sm text-gray-500">جاري التحميل...</div>
                  ) : companyCertificates.length > 0 ? (
                    <div className="space-y-1">
                      {companyCertificates.map((cert) => (
                        <div key={cert.id} className="px-3 py-2 bg-green-50 border border-green-200 rounded-lg text-sm flex items-center gap-2">
                          <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2L2 7V10C2 16 6 20.5 12 22C18 20.5 22 16 22 10V7L12 2Z" />
                          </svg>
                          <span className="text-green-800">{cert.name}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500">لا توجد شهادات مضافة</div>
                  )}
                  <div className="flex gap-2">
                    <button 
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-right hover:bg-gray-50 flex items-center justify-between"
                      onClick={() => setShowCertificatesDialog(true)}
                    >
                      <span className="text-gray-500">عرض الشهادات</span>
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                    <button 
                      className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-1"
                      onClick={() => setShowAddCertificateDialog(true)}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      إضافة
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">التراخيص المرتبطة بنشاط المؤسسة</h4>
                <div className="space-y-2">
                  {licensesLoading ? (
                    <div className="text-sm text-gray-500">جاري التحميل...</div>
                  ) : companyLicenses.length > 0 ? (
                    <div className="space-y-1">
                      {companyLicenses.map((license) => (
                        <div key={license.id} className="px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg text-sm flex items-center gap-2">
                          <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                          </svg>
                          <span className="text-blue-800">{license.name}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500">لا توجد تراخيص مضافة</div>
                  )}
                  <div className="flex gap-2">
                    <button 
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-right hover:bg-gray-50 flex items-center justify-between"
                      onClick={() => setShowLicensesDialog(true)}
                    >
                      <span className="text-gray-500">عرض التراخيص</span>
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                    <button 
                      className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-1"
                      onClick={() => setShowAddLicenseDialog(true)}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      إضافة
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">اسم المسئول</label>
                <div className="px-3 py-2 bg-gray-50 rounded-lg text-gray-900">
                  {companyData.account_name}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني</label>
                <div className="px-3 py-2 bg-gray-50 rounded-lg text-gray-900">
                  {companyData.account_email}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">رقم الجوال</label>
                <div className="px-3 py-2 bg-gray-50 rounded-lg text-gray-900">
                  {companyData.account_phone}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">تغيير كلمة المرور</h4>
                <button 
                  className="w-full px-3 py-2 border border-tawreed-green text-tawreed-green rounded-lg hover:bg-green-50 flex items-center justify-center gap-2"
                  onClick={() => setShowPasswordDialog(true)}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1721 9z" />
                  </svg>
                  تغيير كلمة المرور
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Commercial Registration Section */}
        <div className="bg-white rounded-lg shadow-sm p-8 mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">معلومات السجل التجاري</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">رقم السجل التجاري</label>
              <div className="px-3 py-2 bg-gray-50 rounded-lg text-gray-900">
                {companyData.commercial_registration_number}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">تاريخ التسجيل</label>
              <div className="px-3 py-2 bg-gray-50 rounded-lg text-gray-900">
                {new Date(companyData.created_at).toLocaleDateString('ar-SA')}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-8">
          <button 
            onClick={saveProfileChanges}
            disabled={isSaving || !isEditing}
            className={`px-6 py-3 rounded-lg transition-colors ${
              isSaving || !isEditing 
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                : 'bg-tawreed-green text-white hover:bg-green-600'
            }`}
          >
            {isSaving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
          </button>
          <Link 
            to={userType === 'buyer' ? '/buyer/home' : '/supplier/home'} 
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            إلغاء
          </Link>
        </div>
      </div>

      {/* Password Change Dialog */}
      {showPasswordDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowPasswordDialog(false)}>
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()} dir="rtl">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">تغيير كلمة المرور</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">كلمة المرور الحالية</label>
                <input type="password" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tawreed-green" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">كلمة المرور الجديدة</label>
                <input type="password" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tawreed-green" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">تأكيد كلمة المرور الجديدة</label>
                <input type="password" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tawreed-green" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button className="flex-1 px-4 py-2 bg-tawreed-green text-white rounded-lg hover:bg-green-600">
                حفظ
              </button>
              <button 
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                onClick={() => setShowPasswordDialog(false)}
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Certificates Management Dialog */}
      {showCertificatesDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowCertificatesDialog(false)}>
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()} dir="rtl">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">إدارة الشهادات</h3>
            <div className="space-y-4">
              <button className="w-full px-4 py-2 border border-dashed border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2 text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                إضافة شهادة جديدة
              </button>
              
              {certificatesLoading ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-tawreed-green"></div>
                  <p className="text-sm text-gray-500 mt-2">جاري التحميل...</p>
                </div>
              ) : companyCertificates.length > 0 ? (
                <div className="space-y-2">
                  {companyCertificates.map((cert) => (
                    <div key={cert.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2L2 7V10C2 16 6 20.5 12 22C18 20.5 22 16 22 10V7L12 2Z" />
                        </svg>
                        <span className="font-medium">{cert.name}</span>
                      </div>
                      <button 
                        className="text-red-600 hover:text-red-800 text-sm"
                        onClick={() => removeCertificateFromCompany(cert.id)}
                      >
                        حذف
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-gray-500 text-center py-8">
                  لا توجد شهادات مضافة حالياً
                </div>
              )}
            </div>
            <div className="flex justify-end mt-6">
              <button 
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                onClick={() => setShowCertificatesDialog(false)}
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Licenses Management Dialog */}
      {showLicensesDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowLicensesDialog(false)}>
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()} dir="rtl">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">إدارة التراخيص</h3>
            <div className="space-y-4">
              <button className="w-full px-4 py-2 border border-dashed border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2 text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                إضافة ترخيص جديد
              </button>
              
              {licensesLoading ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-tawreed-green"></div>
                  <p className="text-sm text-gray-500 mt-2">جاري التحميل...</p>
                </div>
              ) : companyLicenses.length > 0 ? (
                <div className="space-y-2">
                  {companyLicenses.map((license) => (
                    <div key={license.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                        </svg>
                        <span className="font-medium">{license.name}</span>
                      </div>
                      <button 
                        className="text-red-600 hover:text-red-800 text-sm"
                        onClick={() => removeLicenseFromCompany(license.id)}
                      >
                        حذف
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-gray-500 text-center py-8">
                  لا توجد تراخيص مضافة حالياً
                </div>
              )}
            </div>
            <div className="flex justify-end mt-6">
              <button 
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                onClick={() => setShowLicensesDialog(false)}
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add License Dialog */}
      {showAddLicenseDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowAddLicenseDialog(false)}>
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()} dir="rtl">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">إضافة ترخيص جديد</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {availableLicenses
                .filter(license => !companyLicenses.some(cl => cl.id === license.id))
                .map((license) => (
                  <div key={license.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                      </svg>
                      <span className="font-medium">{license.name}</span>
                    </div>
                    <button 
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                      onClick={() => addLicenseToCompany(license.id)}
                    >
                      إضافة
                    </button>
                  </div>
                ))}
              {availableLicenses.filter(license => !companyLicenses.some(cl => cl.id === license.id)).length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  جميع التراخيص المتاحة مضافة بالفعل
                </div>
              )}
            </div>
            <div className="flex justify-end mt-6">
              <button 
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                onClick={() => setShowAddLicenseDialog(false)}
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Certificate Dialog */}
      {showAddCertificateDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowAddCertificateDialog(false)}>
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()} dir="rtl">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">إضافة شهادة جديدة</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {availableCertificates
                .filter(certificate => !companyCertificates.some(cc => cc.id === certificate.id))
                .map((certificate) => (
                  <div key={certificate.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2L2 7V10C2 16 6 20.5 12 22C18 20.5 22 16 22 10V7L12 2Z" />
                      </svg>
                      <span className="font-medium">{certificate.name}</span>
                    </div>
                    <button 
                      className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                      onClick={() => addCertificateToCompany(certificate.id)}
                    >
                      إضافة
                    </button>
                  </div>
                ))}
              {availableCertificates.filter(certificate => !companyCertificates.some(cc => cc.id === certificate.id)).length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  جميع الشهادات المتاحة مضافة بالفعل
                </div>
              )}
            </div>
            <div className="flex justify-end mt-6">
              <button 
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                onClick={() => setShowAddCertificateDialog(false)}
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}