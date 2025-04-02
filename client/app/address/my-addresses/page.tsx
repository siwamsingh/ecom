'use client';


import { useEffect, useState } from 'react';
import axios from 'axios';
import { MapPin, Trash2, Plus, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Dialog } from '@headlessui/react';
import { useRouter } from 'next/navigation'
import MainLayout from '@/app/MainLayout';


interface Address {
  _id: number;
  specific_location: string;
  area: string;
  landmark: string;
  pincode: string;
  town_or_city: string;
  state: string;
  country: string;
  is_default: boolean;
}

interface ApiResponse {
  data: {
    addresses: Address[];
  };
  statusCode: number;
  message: string;
  success: boolean;
}

const MAX_ADDRESSES = 3;

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedAddress, setExpandedAddress] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [selectedAddress, setSelectedAddress] = useState<number | null>(null);

  const router = useRouter()

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await axios.post<ApiResponse>('/api/address/get-address', {});

        if (response.data && response.data.success && Array.isArray(response.data.data?.addresses)) {
          setAddresses(response.data.data.addresses);
        } else {
          throw new Error(response.data.message || 'Invalid response format');
        }
      } catch (err: any) {
          if(err?.response?.status === 577 || err?.response?.status === 477){
                    toast.error("Session Expired. Login to continue.");
                     setTimeout(()=>{router.push("/auth/login")},3000);
                     return;
                    
                }
        setError('Failed to load addresses.');
      } finally {
        setLoading(false);
      }
    };

    fetchAddresses();
  }, []);

  const handleDelete = async () => {
    
    if (selectedAddress === null) return;
    try {
      await axios.post('/api/address/delete-address', selectedAddress);

      setAddresses(addresses.filter((address) => address._id !== selectedAddress));
      toast.success('Address deleted successfully');
    } catch {
      toast.error('Failed to delete address');
    } finally {
      setIsDialogOpen(false);
      setSelectedAddress(null);
    }
  };

  const toggleExpand = (id: number) => {
    setExpandedAddress(expandedAddress === id ? null : id);
  };

  const handleAddClick = () => {
    if (addresses.length < MAX_ADDRESSES) {
      router.push('/address/add')
    } else {
      toast.error('Address limit reached. Remove an address to add a new one.');
    }
  };

  const setDefaultAddress = async (id: number) => {
    try {
      await axios.post('/api/address/change-default-address', id);
      
      setAddresses(addresses.map(addr => ({ ...addr, is_default: addr._id === id })));
      toast.success('Default address updated');
    } catch {
      toast.error('Failed to update default address');
    }
  };

  if (loading) return <div className="flex justify-center items-center h-64">
  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
</div>  ;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <MainLayout>
    <div className="p-6 max-w-3xl min-h-[70vh] mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Addresses</h1>
        <span className="text-gray-600 text-sm">{addresses.length}/{MAX_ADDRESSES}</span>
      </div>

      {addresses.length > 0 ? (
        <ul className="space-y-4">
          {addresses.map((address) => (
            <li key={address._id} className="bg-white border border-gray-300 rounded-lg shadow-sm">
              <div className="p-5 flex justify-between items-center cursor-pointer" onClick={() => toggleExpand(address._id)}>
                <div className="w-11/12 flex items-start space-x-3">
                  <MapPin className="w-2/12 sm:w-1/12 h-6 text-gray-500 mt-1" />
                  <div className='w-10/12 sm:w-11/12'>
                    <p className="text-gray-900 font-semibold">{address.specific_location}, {address.area}</p>
                    <p className="text-gray-600 text-sm">{address.town_or_city}, {address.state}, {address.country} - {address.pincode}</p>
                    {address.is_default && <span className="text-blue-600 text-sm font-bold">[Default]</span>}
                  </div>
                </div>
                {expandedAddress === address._id ? <ChevronUp className="w-1/12 h-5 text-gray-500" /> : <ChevronDown className="w-1/12 h-5 text-gray-500" />}
              </div>
              {expandedAddress === address._id && (
                <div className="p-4 bg-gray-100 flex justify-end space-x-3">
                  {!address.is_default && (
                    <button
                      onClick={() => setDefaultAddress(address._id)}
                      className="text-blue-500 hover:text-blue-700 transition flex items-center space-x-2"
                    >
                      <Check className="w-5 h-5" />
                      <span>Set Default</span>
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setSelectedAddress(address._id);
                      setIsDialogOpen(true);
                    }}
                    className="text-red-500 hover:text-red-700 transition flex items-center space-x-2"
                  >
                    <Trash2 className="w-5 h-5" />
                    <span>Delete</span>
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-600">No addresses found.</p>
      )}

      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-bold">Confirm Deletion</h2>
            <p className="text-gray-600 mt-2">Are you sure you want to delete this address?</p>
            <div className="flex justify-end space-x-3 mt-4">
              <button onClick={() => setIsDialogOpen(false)} className="px-4 py-2 bg-gray-300 rounded-lg">Cancel</button>
              <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded-lg">Delete</button>
            </div>
          </div>
        </div>
      </Dialog>

      <button
        className={` mx-auto my-10 rounded-full p-4 shadow-sm transition flex items-center space-x-2
          ${addresses.length >= MAX_ADDRESSES ? 'bg-gray-400 ' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
        onClick={handleAddClick}
      >
        <Plus className="w-6 h-6" />
      </button>
    </div>
    </MainLayout>
  );
}
