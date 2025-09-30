import { useState, useEffect } from 'react';

export type UserType = 'buyer' | 'supplier' | null;

export function useUserType(): UserType {
  const [userType, setUserType] = useState<UserType>(null);

  useEffect(() => {
    const buyerData = localStorage.getItem('currentBuyer');
    const supplierData = localStorage.getItem('currentSupplier');

    if (buyerData) {
      setUserType('buyer');
    } else if (supplierData) {
      setUserType('supplier');
    } else {
      setUserType(null);
    }
  }, []);

  return userType;
}