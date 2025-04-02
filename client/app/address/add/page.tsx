'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AddressForm from '@/components/address/AddressForm';
import axios from 'axios';
import MainLayout from '@/app/MainLayout';

export default function AddAddressPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAddAddress = async (addressData: any) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post('/api/address/add-new-address', addressData);
      
      if (response.data.success) {
        // Show success message
        // You could implement a toast notification here
        
        // Redirect to address list page on success
        router.push('/address/my-addresses');
        router.refresh();
      } else {
        throw new Error(response.data.message || 'Failed to add address');
      }
    } catch (err: any) {
      
      // Handle session expiration
      if (err?.response?.status === 477 || err?.response?.status === 577) {
        // Redirect to login page
        router.push('/login?redirect=' + encodeURIComponent('/address/add'));
        return;
      }
      
      setError(err.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
    <div className="max-w-2xl my-10 mx-auto p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-6">Add New Address</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <AddressForm onSubmit={handleAddAddress} loading={loading} />
    </div>
    </MainLayout>
  );
}