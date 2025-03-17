"use client"
import { useState, useEffect } from "react";
import Link from "next/link";
import { useForm, FieldValues } from "react-hook-form";
// import { toast } from "react-toastify";

import { toast } from 'react-hot-toast';
import Button from "../../../components/common/Button";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react"; 

interface FormInputs extends FieldValues {
  phone_number: string;
  userPassword: string;
}

export default function LoginPage() {
  
  const [showPassword, setShowPassword] = useState(false); 

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormInputs>();

  const phone = watch("phone");

  const handleLogin = async (data: FormInputs) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone_number: `+91${data.phone}`, // Ensuring +91 is sent
          userPassword: data.password,
        }),
      });

      const responseData = await res.json();
      if (responseData.success) {
        toast.success("Logged in successfully!",{duration: 4000});
        // router.push("/candidate/profile");
      } else {
        toast.error(responseData.message||"Something went wrong.",{duration: 4000});
      }
    } catch (error) {
      toast.error("Login failed! Please try again.");
    }
  };

  useEffect(() => {
    if (errors.phone?.message) {
      toast.error(errors.phone.message as string);
    }
    if (errors.password?.message) {
      toast.error(errors.password.message as string);
    }
  }, [errors]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 custom-shadow bg-opacity-90 bg-[#fbfbfb94] p-8 md:w-3/4 lg:w-2/4 rounded-2xl">
        <div>
          <div className="border flex justify-center w-full opacity-30">
            <Link href="/">
              <Image
                priority
                src="/logo-b.png"
                alt="kara shop logo"
                width={80}
                height={35}
                quality={100}
              />
            </Link>
          </div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900">
            Customer Login
          </h2>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(handleLogin)}>
          <div className="rounded-md shadow-sm -space-y-px">
            {/* Phone Number Input with +91 */}
            <div className="mb-8">
              <label htmlFor="phone" className="block text-sm font-medium mb-2">
                Phone Number
              </label>
              <div className="flex items-center bg-gray-50 border border-gray-300 text-gray-600 text-sm rounded focus-within:ring-blue-500 focus-within:border-blue-500 outline-none">
                <span className="mr-2 text-gray-600">+91</span>
                <input
                  id="phone"
                  type="text"
                  placeholder="Enter 10-digit number"
                  className="bg-transparent outline-none w-full py-3 pl-2 border-l-2"
                  {...register("phone", {
                    required: "Phone number is required",
                    minLength: {
                      value: 10,
                      message: "Phone number must be 10 digits",
                    },
                    maxLength: {
                      value: 10,
                      message: "Phone number must be 10 digits",
                    },
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: "Invalid phone number format",
                    },
                  })}
                  onInput={(e) => {
                    const target = e.target as HTMLInputElement;
                    target.value = target.value.replace(/\D/g, "").slice(0, 10);
                  }}
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                Password
              </label>
              <div className="flex pr-2 bg-gray-50 border border-gray-300 rounded focus-within:ring-blue-500 focus-within:border-blue-500">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                className="bg-transparent  outline-none w-full py-3 pl-4  text-gray-600 text-lg sm:text-sm"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                })}
              />
              <button
                type="button"
                className="  text-gray-500 hover:text-gray-700"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              </div>
            </div>
          </div>

          <div className="text-sm text-center mb-4">
            <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
              Forgot your password?
            </a>
          </div>

          {/* Submit Button */}
          <div>
            <Button type="submit" className="bg-blue-600 text-white">Sign in</Button>
          </div>
        </form>

        {/* Register Link */}
        <div className="text-center text-sm">
          <p>
            Don&apos;t have an account?{" "}
            <Link href="/auth/register" className="font-medium text-blue-600 hover:text-blue-500">
              Register now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
