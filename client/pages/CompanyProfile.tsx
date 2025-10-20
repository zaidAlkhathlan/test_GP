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
  domain_name?: string;
  domains_id?: number;
  account_name: string;
  account_email: string;
  account_phone: number;
  created_at: string;
  updated_at?: string;
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
  const [logoFile, setLogoFile] = useState<string | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0); // Force re-render key
  
  // Computed logo source with proper fallback
  const currentLogoSrc = logoPreview || logoFile || companyData?.logo;

  useEffect(() => {
    console.log('🔍 CompanyProfile: Determining user type from localStorage...');
    
    // Determine user type and get company data
    const buyerData = localStorage.getItem('currentBuyer');
    const supplierData = localStorage.getItem('currentSupplier');
    
    console.log('🏪 localStorage currentBuyer exists:', !!buyerData);
    console.log('🏭 localStorage currentSupplier exists:', !!supplierData);
    
    // First check if we're on a supplier route - this overrides localStorage priority
    const isSupplierRoute = window.location.pathname.includes('supplier');
    console.log('🛤️ Is supplier route:', isSupplierRoute);
    
    if (isSupplierRoute && supplierData) {
      console.log('✅ Using supplier data from supplier route');
      setUserType('supplier');
      const data = JSON.parse(supplierData);
      setCompanyData(data);
      setEditableData(data);
      setCompanyDescription(data.industry || '');
      
      // Clean up potential conflicting buyer data to prevent confusion
      if (buyerData) {
        console.log('🧹 Cleaning up conflicting buyer localStorage (supplier route active)');
        localStorage.removeItem('currentBuyer');
      }
    } else if (!isSupplierRoute && buyerData) {
      console.log('✅ Using buyer data from buyer route');
      setUserType('buyer');
      const data = JSON.parse(buyerData);
      setCompanyData(data);
      setEditableData(data);
      setCompanyDescription(data.industry || '');
      
      // Clean up potential conflicting supplier data to prevent confusion
      if (supplierData) {
        console.log('🧹 Cleaning up conflicting supplier localStorage (buyer route active)');
        localStorage.removeItem('currentSupplier');
      }
    } else if (buyerData) {
      // Fallback to buyer if no route preference
      console.log('✅ Fallback to buyer data');
      setUserType('buyer');
      const data = JSON.parse(buyerData);
      setCompanyData(data);
      setEditableData(data);
      setCompanyDescription(data.industry || '');
    } else if (supplierData) {
      // Fallback to supplier
      console.log('✅ Fallback to supplier data');
      setUserType('supplier');
      const data = JSON.parse(supplierData);
      setCompanyData(data);
      setEditableData(data);
      setCompanyDescription(data.industry || '');
    } else {
      console.log('❌ No user data found in localStorage');
    }
    
    console.log('🎯 Final userType set to:', buyerData || supplierData ? (isSupplierRoute && supplierData ? 'supplier' : 'buyer') : 'none');
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

  // Handle logo file selection and convert to Base64
  const handleLogoChange = (file: File) => {
    // Automatically enable edit mode if not already editing
    if (!isEditing) {
      console.log('Auto-enabling edit mode for logo upload');
      setIsEditing(true);
    }
    
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      alert('نوع الملف غير مدعوم. يرجى اختيار صورة (JPG, PNG, GIF)');
      return;
    }
    
    // Validate file size (max 2MB)
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      alert('حجم الملف كبير جداً. يرجى اختيار صورة أصغر من 2 ميجابايت');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64String = e.target?.result as string;
      console.log('New logo uploaded, base64 length:', base64String.length);
      setLogoFile(base64String);
      setLogoPreview(base64String);
      
      // Update editable data to include logo - this marks the logo as changed
      setEditableData(prev => ({ 
        ...prev, 
        logo: base64String,
        // Add a flag to indicate logo was changed
        logoChanged: true 
      }));
      
      console.log('Logo states updated - logoFile set, logoPreview set, editableData updated');
    };
    reader.readAsDataURL(file);
  };

  // Save company profile changes
  const saveProfileChanges = async () => {
    console.log('🚀 saveProfileChanges called');
    if (!companyData) {
      console.log('❌ No companyData available');
      return;
    }

    console.log('📊 Current state before save:');
    console.log('- companyData.id:', companyData.id);
    console.log('- userType:', userType);
    console.log('- logoFile:', !!logoFile);
    console.log('- logoPreview:', !!logoPreview);
    console.log('- editableData:', editableData);
    console.log('- companyDescription:', companyDescription);

    setIsSaving(true);
    try {
      const endpoint = userType === 'buyer' ? 'buyers' : 'suppliers';
      const { logoChanged, ...cleanEditableData } = editableData as any;
      
      // CRITICAL FIX: Start with complete current data, then apply changes
      const dataToUpdate = {
        ...companyData, // Start with ALL current data
        ...cleanEditableData, // Apply only the changed fields
        industry: companyDescription || companyData.industry
      };

      // Always include logo if it exists (either new upload or existing)
      if (logoFile) {
        dataToUpdate.logo = logoFile;
        console.log('📷 Including logoFile in update');
      } else if (logoPreview) {
        dataToUpdate.logo = logoPreview;
        console.log('📷 Including logoPreview in update');
      }

      // Remove fields that shouldn't be updated (server will handle these)
      delete dataToUpdate.city_name;
      delete dataToUpdate.region_name;
      delete dataToUpdate.domain_name;
      delete dataToUpdate.created_at;
      delete dataToUpdate.updated_at;
      
      console.log('📋 Final data being sent:', Object.keys(dataToUpdate));
      console.log('📋 Critical fields preserved: id=', dataToUpdate.id, 'company_name=', dataToUpdate.company_name);

      console.log('📤 API Request Details:');
      console.log('- URL:', `/api/${endpoint}/${companyData.id}`);
      console.log('- Method: PUT');
      console.log('- Data keys:', Object.keys(dataToUpdate));
      console.log('- Logo included:', !!dataToUpdate.logo);

      const response = await fetch(`/api/${endpoint}/${companyData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToUpdate)
      });

      console.log('📥 API Response:');
      console.log('- Status:', response.status);
      console.log('- OK:', response.ok);
      console.log('- Status Text:', response.statusText);

      if (response.ok) {
        console.log('✅ Save successful - now fetching fresh data from database');
        
        console.log('✅ Save API call successful');
        
        // APPROACH 1: Try to fetch fresh data from database
        console.log('🔄 Step 1: Attempting to fetch fresh data from database...');
        
        let freshDataSuccess = false;
        try {
          await fetchFreshCompanyData();
          freshDataSuccess = true;
          console.log('✅ Fresh data successfully loaded from database');
        } catch (fetchError) {
          console.error('❌ Failed to fetch fresh data after save:', fetchError);
          console.log('🔄 Will use fallback approach instead...');
        }
        
        // APPROACH 2: If fetching fresh data failed, use the data we sent as fallback
        if (!freshDataSuccess) {
          console.log('🔄 Step 2: Using fallback - updating state with data we sent');
          
          // Update main state with the data we successfully saved
          const updatedData = { ...companyData, ...dataToUpdate };
          setCompanyData(updatedData);
          setCompanyDescription(updatedData.industry || '');
          
          // Update localStorage with the new data
          const storageKey = userType === 'buyer' ? 'currentBuyer' : 'currentSupplier';
          localStorage.setItem(storageKey, JSON.stringify(updatedData));
          
          console.log('💾 Fallback: Updated state and localStorage with saved data');
        }
        
        // Clear all editing states regardless of which approach worked
        console.log('🧹 Clearing all editing states...');
        setEditableData({});
        setLogoFile(null);
        setLogoPreview(null);
        setIsEditing(false);
        setSelectedRegionId(0);
        setSelectedCityId(0);
        setRefreshKey(prev => prev + 1);
        
        console.log('🎉 Save operation completed successfully');
        alert('تم حفظ التغييرات بنجاح!');
        
        // Force multiple UI refreshes to ensure changes are visible
        console.log('🔄 Initiating forced UI refreshes...');
        setRefreshKey(prev => prev + 1);
        
        setTimeout(() => {
          setRefreshKey(prev => prev + 1);
          console.log('🔄 First forced UI refresh completed');
        }, 100);
        
        setTimeout(() => {
          setRefreshKey(prev => prev + 1);
          console.log('🔄 Second forced UI refresh completed');
        }, 300);
      } else {
        console.log('❌ API Error Response:');
        const errorText = await response.text();
        console.log('- Error text:', errorText);
        
        // Check if it's an authentication error
        if (response.status === 401 || response.status === 403) {
          console.log('🔒 Authentication error detected during save operation');
          console.log('🔍 Current userType:', userType);
          console.log('🔍 Company ID being used:', companyData?.id);
          console.log('🔍 API endpoint being called:', `/api/${endpoint}/${companyData.id}`);
          alert('انتهت صلاحية الجلسة. يرجى تسجيل الدخول مرة أخرى');
          // Clear localStorage and redirect to login
          localStorage.removeItem('currentBuyer');
          localStorage.removeItem('currentSupplier');
          window.location.href = userType === 'buyer' ? '/buyer/signin' : '/supplier/signin';
          return;
        }

        // Check if it's a "not found" error - might indicate wrong userType/ID combination
        if (response.status === 404) {
          console.log('🔍 404 Error - possible userType/ID mismatch');
          console.log('🔍 Current userType:', userType);
          console.log('🔍 Company ID being used:', companyData?.id);
          console.log('🔍 Expected endpoint:', `/api/${endpoint}/${companyData.id}`);
          alert(`خطأ: البيانات المطلوبة غير موجودة. يرجى تسجيل الدخول مرة أخرى.`);
          // Clear localStorage and redirect to login for safety
          localStorage.removeItem('currentBuyer');
          localStorage.removeItem('currentSupplier'); 
          window.location.href = userType === 'buyer' ? '/buyer/signin' : '/supplier/signin';
          return;
        }

        try {
          const error = JSON.parse(errorText);
          alert(error.message || error.error || 'فشل في حفظ التغييرات');
        } catch {
          alert('فشل في حفظ التغييرات: ' + errorText);
        }
      }
    } catch (error) {
      console.error('💥 Network/Exception error:', error);
      alert('حدث خطأ أثناء حفظ التغييرات: ' + error.message);
    } finally {
      setIsSaving(false);
      console.log('🏁 saveProfileChanges completed, isSaving set to false');
    }
  };

  // Fetch fresh company data from database after save
  const fetchFreshCompanyData = async () => {
    if (!companyData) {
      console.error('❌ fetchFreshCompanyData: No companyData available');
      throw new Error('No company data available for refresh');
    }
    
    const endpoint = userType === 'buyer' ? 'buyers' : 'suppliers';
    const fetchUrl = `/api/${endpoint}/${companyData.id}`;
    
    console.log('📖 fetchFreshCompanyData starting...');
    console.log('📖 Endpoint:', endpoint);
    console.log('📖 Company ID:', companyData.id);
    console.log('📖 Fetch URL:', fetchUrl);
    console.log('📖 Current userType:', userType);
    
    try {
      // Add cache-busting parameter to ensure we get fresh data
      const cacheBuster = new Date().getTime();
      const response = await fetch(`${fetchUrl}?_cb=${cacheBuster}`, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      console.log('📥 Fetch Response received:');
      console.log('📥 Status:', response.status);
      console.log('📥 StatusText:', response.statusText);
      console.log('📥 OK:', response.ok);
      console.log('📥 Headers:', Object.fromEntries(response.headers.entries()));
      
      if (response.ok) {
        const freshData = await response.json();
        console.log('✅ Fresh data received from API:', freshData);
        console.log('✅ Key fields: id=', freshData.id, 'company_name=', freshData.company_name, 'logo length=', freshData.logo?.length);
        
        // Validate that we got meaningful data
        if (!freshData.id || !freshData.company_name) {
          throw new Error('Invalid data received from API - missing required fields');
        }
        
        // Update all states with fresh database data
        console.log('🔄 Updating React state with fresh data...');
        setCompanyData(freshData);
        setCompanyDescription(freshData.industry || '');
        
        // Update localStorage with fresh data
        const storageKey = userType === 'buyer' ? 'currentBuyer' : 'currentSupplier';
        console.log('💾 Updating localStorage key:', storageKey);
        localStorage.setItem(storageKey, JSON.stringify(freshData));
        
        console.log('✅ fetchFreshCompanyData completed successfully');
        console.log('✅ State and localStorage updated with fresh data');
        
      } else {
        // Handle error responses
        let errorText;
        try {
          errorText = await response.text();
        } catch (e) {
          errorText = 'Could not read error response';
        }
        
        console.error('❌ API Error in fetchFreshCompanyData:');
        console.error('❌ Status:', response.status);
        console.error('❌ StatusText:', response.statusText);
        console.error('❌ Error text:', errorText);
        console.error('❌ URL attempted:', fetchUrl);
        console.error('❌ UserType:', userType);
        console.error('❌ Company ID:', companyData.id);
        
        // Create detailed error message
        const errorMsg = `HTTP ${response.status}: ${response.statusText} - ${errorText}`;
        throw new Error(errorMsg);
      }
    } catch (error) {
      console.error('💥 Exception in fetchFreshCompanyData:', error);
      console.error('� Error details:', {
        message: error.message,
        stack: error.stack,
        userType: userType,
        companyId: companyData?.id,
        endpoint: endpoint,
        url: fetchUrl
      });
      
      // Re-throw with additional context
      throw new Error(`Failed to fetch fresh data: ${error.message}`);
    }
  };

  // Reset edit state when canceling
  const cancelEdit = () => {
    console.log('Canceling edit - resetting all states');
    setIsEditing(false);
    setEditableData({});
    setLogoFile(null);
    setLogoPreview(null);
    setCompanyDescription(companyData?.industry || '');
    setSelectedRegionId(0);
    setSelectedCityId(0);
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
              onClick={() => {
                if (isEditing) {
                  console.log('Canceling edit mode');
                  cancelEdit();
                } else {
                  console.log('Entering edit mode');
                  setIsEditing(true);
                  // Initialize editable data with current company data
                  setEditableData({
                    company_name: companyData.company_name,
                    account_name: companyData.account_name,
                    commercial_phone_number: companyData.commercial_phone_number,
                    city_id: companyData.city_id
                  });
                  // Clear any previous logo changes when starting to edit
                  setLogoFile(null);
                  setLogoPreview(null);
                }
              }}
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
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center relative">
              {currentLogoSrc ? (
                <img 
                  src={currentLogoSrc} 
                  alt="Company Logo" 
                  className="w-full h-full rounded-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    console.log('❌ Logo failed to load:', target.src);
                  }}
                  onLoad={() => {
                    console.log('✅ Logo loaded successfully');
                  }}
                />
              ) : (
                <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7V10C2 16 6 20.5 12 22C18 20.5 22 16 22 10V7L12 2Z" />
                </svg>
              )}
              {(logoPreview || logoFile) && isEditing && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">{companyData.company_name}</h2>
              <p className="text-gray-600">{companyData.industry || 'خطأ في التحميل'}</p>
              {isEditing ? (
                <button 
                  className="mt-2 text-sm text-tawreed-green hover:underline cursor-pointer flex items-center gap-1"
                  onClick={() => {
                    // Create hidden file input and trigger click
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = 'image/jpeg,image/jpg,image/png,image/gif';
                    input.onchange = (e) => {
                      const file = (e.target as HTMLInputElement).files?.[0];
                      if (file) {
                        handleLogoChange(file);
                      }
                    };
                    input.click();
                  }}
                >
                  تغيير الشعار
                  {(logoFile || logoPreview) && (
                    <span className="text-xs text-green-600">● تم التعديل</span>
                  )}
                </button>
              ) : (
                <span className="mt-2 text-sm text-gray-400">
                  تغيير الشعار (متاح في وضع التعديل)
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8" key={refreshKey}>
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">البيانات الأساسية</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">اسم المؤسسة التجارية</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editableData.company_name ?? companyData.company_name ?? ''}
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
                    value={editableData.account_name ?? companyData.account_name ?? ''}
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
                    value={editableData.commercial_phone_number ?? companyData.commercial_phone_number ?? ''}
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
            onClick={() => {
              console.log('🔴 SAVE BUTTON CLICKED');
              console.log('Button state - isEditing:', isEditing, 'isSaving:', isSaving);
              console.log('Button disabled?', isSaving || !isEditing);
              console.log('logoFile:', !!logoFile, 'logoPreview:', !!logoPreview);
              console.log('editableData keys:', Object.keys(editableData));
              console.log('companyDescription changed:', companyDescription !== (companyData?.industry || ''));
              console.log('userType:', userType);
              console.log('companyData.id:', companyData?.id);
              
              // Check if we have user data in localStorage
              const buyerData = localStorage.getItem('currentBuyer');
              const supplierData = localStorage.getItem('currentSupplier');
              console.log('localStorage currentBuyer exists:', !!buyerData);
              console.log('localStorage currentSupplier exists:', !!supplierData);
              
              saveProfileChanges();
            }}
            disabled={isSaving || !isEditing}
            className={`px-6 py-3 rounded-lg transition-colors ${
              isSaving || !isEditing 
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                : 'bg-tawreed-green text-white hover:bg-green-600'
            }`}
          >
            {isSaving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
            {(logoFile || logoPreview || Object.keys(editableData).length > 0 || companyDescription !== (companyData?.industry || '')) && isEditing && (
              <span className="mr-2 text-xs">●</span>
            )}
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