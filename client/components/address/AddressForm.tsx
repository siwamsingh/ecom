'use client';

import { useState } from 'react';
import Link from 'next/link';

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat",
  "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh",
  "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
  "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Lakshadweep", "Puducherry"
];

interface AddressFormData {
  specific_location: string;
  area: string;
  landmark: string;
  pincode: string;
  town_or_city: string;
  state: string;
}

interface ValidationErrors {
  specific_location?: string;
  area?: string;
  landmark?: string;
  pincode?: string;
  town_or_city?: string;
  state?: string;
}

interface AddressFormProps {
  onSubmit: (data: AddressFormData) => void;
  loading: boolean;
}

export default function AddressForm({ onSubmit, loading }: AddressFormProps) {
  const [formData, setFormData] = useState<AddressFormData>({
    specific_location: '',
    area: '',
    landmark: '',
    pincode: '',
    town_or_city: '',
    state: ''
  });
  
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear validation error when field is edited
    if (validationErrors[name as keyof ValidationErrors]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm =async () => {
    const errors: ValidationErrors = {};
    
    // Check for empty fields
    Object.entries(formData).forEach(([key, value]) => {
      if (!value || value.trim() === '') {
        errors[key as keyof ValidationErrors] = 'This field is required';
      }
    });
    
    // Validate pincode
    if (formData.pincode && !/^[1-9][0-9]{5}$/.test(formData.pincode)) {
        errors.pincode = 'Pincode must be a 6-digit number';
      } else {
        try {
          const response = await fetch(`https://api.postalpincode.in/pincode/${formData.pincode}`);
          const data = await response.json();
          if (data[0]?.Status !== "Success") {
            errors.pincode = 'Invalid pin code';
          }
        } catch {
          errors.pincode = 'Error validating pin code';
        }
      }
    
    // Validate state
    if (formData.state && !INDIAN_STATES.includes(formData.state)) {
      errors.state = 'Please select a valid state';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit =async (e: React.FormEvent) => {
    e.preventDefault();
    const validForm = await validateForm();
    if (validForm) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="specific_location" className="block text-sm font-medium mb-1">
          Address Line 1 (House No, Building, Street) *
        </label>
        <input
          type="text"
          id="specific_location"
          name="specific_location"
          value={formData.specific_location}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md ${
            validationErrors.specific_location ? 'border-red-500' : 'border-gray-300'
          } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          placeholder="Flat / House No., Floor, Building"
          disabled={loading}
        />
        {validationErrors.specific_location && (
          <p className="mt-1 text-sm text-red-600">{validationErrors.specific_location}</p>
        )}
      </div>

      <div>
        <label htmlFor="area" className="block text-sm font-medium mb-1">
          Area / Locality *
        </label>
        <input
          type="text"
          id="area"
          name="area"
          value={formData.area}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md ${
            validationErrors.area ? 'border-red-500' : 'border-gray-300'
          } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          placeholder="Colony, Street, Area"
          disabled={loading}
        />
        {validationErrors.area && (
          <p className="mt-1 text-sm text-red-600">{validationErrors.area}</p>
        )}
      </div>

      <div>
        <label htmlFor="landmark" className="block text-sm font-medium mb-1">
          Landmark *
        </label>
        <input
          type="text"
          id="landmark"
          name="landmark"
          value={formData.landmark}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md ${
            validationErrors.landmark ? 'border-red-500' : 'border-gray-300'
          } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          placeholder="Near school, hospital, etc."
          disabled={loading}
        />
        {validationErrors.landmark && (
          <p className="mt-1 text-sm text-red-600">{validationErrors.landmark}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="pincode" className="block text-sm font-medium mb-1">
            Pincode *
          </label>
          <input
            type="text"
            id="pincode"
            name="pincode"
            value={formData.pincode}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md ${
              validationErrors.pincode ? 'border-red-500' : 'border-gray-300'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="6-digit pincode"
            maxLength={6}
            disabled={loading}
          />
          {validationErrors.pincode && (
            <p className="mt-1 text-sm text-red-600">{validationErrors.pincode}</p>
          )}
        </div>

        <div>
          <label htmlFor="town_or_city" className="block text-sm font-medium mb-1">
            Town / City *
          </label>
          <input
            type="text"
            id="town_or_city"
            name="town_or_city"
            value={formData.town_or_city}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md ${
              validationErrors.town_or_city ? 'border-red-500' : 'border-gray-300'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="Town or City name"
            disabled={loading}
          />
          {validationErrors.town_or_city && (
            <p className="mt-1 text-sm text-red-600">{validationErrors.town_or_city}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="state" className="block text-sm font-medium mb-1">
          State *
        </label>
        <select
          id="state"
          name="state"
          value={formData.state}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md ${
            validationErrors.state ? 'border-red-500' : 'border-gray-300'
          } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          disabled={loading}
        >
          <option value="">Select State</option>
          {INDIAN_STATES.map(state => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>
        {validationErrors.state && (
          <p className="mt-1 text-sm text-red-600">{validationErrors.state}</p>
        )}
      </div>

      <div className="flex items-center justify-between pt-4">
        <Link
          href="/address/my-addresses"
          className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          Cancel
        </Link>
        <button
          type="submit"
          className={`px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            loading ? 'opacity-75 cursor-not-allowed' : ''
          }`}
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add Address'}
        </button>
      </div>
    </form>
  );
}