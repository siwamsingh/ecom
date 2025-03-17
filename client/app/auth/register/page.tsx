"use client";
import { useState, useEffect } from "react";
import { useForm, FieldValues } from "react-hook-form";
import { useRouter } from "next/navigation";
import Button from "../../../components/common/Button";
import { toast } from "react-hot-toast";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";

interface FormInputs extends FieldValues {
  firstName: string;
  lastName: string;
  password: string;
  contactNo: string;
  userType: string;
}

export default function Register() {
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [otp, setOtp] = useState<string>("");
  const [verified, setVerified] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(0);
  const [canResend, setCanResend] = useState<boolean>(false);
  const [timer, setTimer] = useState<string>("0:00");
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormInputs>();

  const contactNo = watch("contactNo");

  // Timer Effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (countdown > 0) {
      interval = setInterval(() => {
        setCountdown((prev) => {
          const newCount = prev - 1;
          const minutes = Math.floor(newCount / 60);
          const seconds = newCount % 60;
          setTimer(`${minutes}:${seconds.toString().padStart(2, "0")}`);
          return newCount;
        });
      }, 1000);
    } else {
      setCanResend(true);
      setTimer("0:00");
    }
    return () => clearInterval(interval);
  }, [countdown]);

  // Handle form errors with toast
  useEffect(() => {
    if (errors.firstName?.type === "required") {
      toast.error("First name cannot be empty");
    } else if (errors.firstName?.type === "maxLength") {
      toast.error("First Name cannot be more than 20 characters");
    } else if (errors.firstName?.message) {
      toast.error(errors.firstName.message as string);
    }

    if (errors.lastName?.type === "required") {
      toast.error("Last name cannot be empty");
    } else if (errors.lastName?.type === "maxLength") {
      toast.error("Last Name cannot be more than 20 characters");
    } else if (errors.lastName?.message) {
      toast.error(errors.lastName.message as string);
    }

    if (errors.password?.type === "required") {
      toast.error("Password is mandatory");
    } else if (errors.password?.type === "minLength") {
      toast.error("Password should be at least 8 characters");
    }

    if (errors.contactNo?.type === "required") {
      toast.error("Contact number is mandatory");
    } else if (
      errors.contactNo?.type === "minLength" ||
      errors.contactNo?.type === "maxLength"
    ) {
      toast.error("Contact number should have 10 digits");
    }
  }, [errors]);

  useEffect(() => {
    if (errors.password?.message) {
      toast.error(errors.password.message as string);
    }
  }, [errors.password]);

  const handelSendOtp = async () => {
    if (!/^\d{10}$/.test(contactNo)) {
      toast.error("Invalid phone number. It must have 10 digits.");
      return;
    }

    const phone_number = "+91" + contactNo;

    try {
      const res = await fetch("/api/auth/generate_otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone_number,
        }),
      });

      const responseData = await res.json();
      if (responseData.success) {
        toast.success("OTP Generated Successfully!");
        setOtpSent(true);
        setCountdown(300); // 5 minutes
        setCanResend(false);
        const minutes = Math.floor(300 / 60);
        const seconds = 300 % 60;
        setTimer(`${minutes}:${seconds.toString().padStart(2, "0")}`);
        console.log(responseData);
      } else {
        console.log(responseData);
        toast.error(responseData.message, { duration: 6000 });
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to Generate OTP. Try Again.");
    }
  };

  const handleRegister = async (data: FormInputs): Promise<void> => {
    console.log(data);

    const username = data.firstName + " " + data.lastName;
    const phone_number = "+91" + data.contactNo;
    const password = data.password;

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          phone_number,
          password,
        }),
      });

      const responseData = await res.json();
      if (responseData.success) {
        toast.success("Account Created Successfully!");
        console.log(responseData);
      } else {
        console.log(responseData);
        toast.error(responseData.message, { duration: 6000 });
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to Generate OTP. Try Again.");
    }
  };

  const handleVerifyOTP = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (otp.length !== 6) {
      toast.error("OTP must be exactly 6 characters long");
      return;
    }

    if (!/^\d{10}$/.test(contactNo)) {
      toast.error("Invalid phone number. It must have 10 digits.");
      return;
    }
    const phone_number = "+91" + contactNo;

    try {
      const res = await fetch("/api/auth/verify_otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone_number,
          verification_otp: otp,
        }),
      });

      const responseData = await res.json();
      if (responseData.success) {
        toast.success("OTP Verified Successfully!");
        setVerified(true);
      } else {
        toast.error(responseData.message, { duration: 6000 });
      }
    } catch (error) {
      toast.error("Failed to Verify OTP. Try Again.");
    }
    setOtp("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="custom-shadow max-w-md w-full space-y-6 bg-opacity-90 bg-[#fbfbfb94] px-8 py-4 md:w-3/4 lg:w-2/4 rounded-2xl">
        <div className="space-y-4">
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
          <h2 className="text-center text-2xl sm:text-3xl font-extrabold text-gray-900">
            Customer Registration
          </h2>
        </div>
        <form onSubmit={handleSubmit(handleRegister)}>
          <div className="mb-4">
            <label
              className="block text-sm font-medium mb-2"
              htmlFor="firstName"
            >
              First Name
            </label>
            <input
              className="bg-gray-50 border border-gray-300 text-gray-600 text-sm rounded focus:ring-blue-500 focus:border-blue-500 outline-none block w-full px-4 py-3"
              type="text"
              id="firstName"
              placeholder="first name"
              {...register("firstName", {
                required: true,
                minLength: 1,
                maxLength: 20,
                validate: {
                  matchPattern: (v) =>
                    /^[A-Za-z]+$/.test(v) || "Only alphabets are allowed",
                },
              })}
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-sm font-medium mb-2"
              htmlFor="lastName"
            >
              Last Name
            </label>
            <input
              className="bg-gray-50 border border-gray-300 text-gray-600 text-sm rounded focus:ring-blue-500 focus:border-blue-500 outline-none block w-full px-4 py-3"
              type="text"
              id="lastName"
              placeholder="last name"
              {...register("lastName", {
                required: true,
                minLength: 1,
                maxLength: 20,
                validate: {
                  matchPattern: (v) =>
                    /^[A-Za-z]+$/.test(v) || "Only alphabets are allowed",
                },
              })}
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-sm font-medium mb-2"
              htmlFor="contactNo"
            >
              Contact No
            </label>
            <div className="flex items-center bg-gray-50 border border-gray-300 text-gray-600 text-sm rounded focus-within:ring-blue-500 focus-within:border-blue-500 outline-none">
              <span className="mr-2 text-gray-600 pl-4">+91</span>
              <input
                className="bg-transparent outline-none w-full border-l-2 py-3 pl-1"
                type="text"
                id="contactNo"
                placeholder="Enter 10-digit number"
                {...register("contactNo", {
                  required: "Contact number is mandatory",
                  minLength: {
                    value: 10,
                    message: "Contact number must be 10 digits",
                  },
                  maxLength: {
                    value: 10,
                    message: "Contact number must be 10 digits",
                  },
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: "Invalid contact number format",
                  },
                })}
                onInput={(e) => {
                  const target = e.target as HTMLInputElement;
                  target.value = target.value.replace(/\D/g, "").slice(0, 10);
                }}
              />
            </div>
          </div>

          {!verified ? (
            <></>
          ) : (
            <div>
              <div className="mb-4">
                <label
                  className="block text-sm font-medium mb-2"
                  htmlFor="password"
                >
                  Password
                </label>
                <div className="flex border pr-2 bg-gray-50 border-gray-300 text-gray-600 text-sm rounded focus-within:ring-blue-500 focus-within:border-blue-500">
                  <input
                    className="outline-none rounded w-full px-4 py-3"
                    type={showPassword ? "text" : "password"}
                    id="password"
                    placeholder="password"
                    {...register("password", {
                      required: "Password is mandatory",
                      minLength: {
                        value: 8,
                        message:
                          "Password should be at least 8 characters long",
                      },
                      validate: {
                        hasUpperCase: (v) =>
                          /[A-Z]/.test(v) ||
                          "Password must have at least one uppercase letter",
                        hasLowerCase: (v) =>
                          /[a-z]/.test(v) ||
                          "Password must have at least one lowercase letter",
                        hasNumber: (v) =>
                          /[0-9]/.test(v) ||
                          "Password must have at least one number",
                        hasSpecialChar: (v) =>
                          /[@#$%^&*!]/.test(v) ||
                          "Password must have at least one special character (@, #, $, etc.)",
                      },
                    })}
                  />
                  <button
                    type="button"
                    className="text-gray-500 hover:text-gray-700"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              <Button type="submit" className="bg-blue-600 text-white">Register</Button>
            </div>
          )}
        </form>
        {!verified && (
          <div className="mb-4">
            {!otpSent ? (
              <Button onClick={handelSendOtp} className="bg-blue-600 text-white">Send OTP</Button>
            ) : (
              <div className="mt-4">
                <label className="block text-sm font-medium mb-2" htmlFor="otp">
                  Enter OTP
                </label>
                <input
                  className="bg-gray-50 border border-gray-300 text-gray-600 text-sm rounded focus:ring-blue-500 focus:border-blue-500 outline-none block w-full px-4 py-3"
                  type="number"
                  id="otp"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setOtp(e.target.value)
                  }
                  value={otp}
                />
                <div className="flex flex-col gap-2 mt-2">
                  <Button onClick={handleVerifyOTP} className="bg-blue-600">Verify OTP</Button>

                  <div className="flex justify-between items-center gap-2">
                    <Button
                      onClick={handelSendOtp}
                      disabled={!canResend}
                      className={`${
                        !canResend
                          ? "bg-gray-400 text-gray-500 cursor-not-allowed hover:bg-gray-500"
                          : " hover:text-bg-700 text-gray-500 bg-blue-600"
                      } text-xs px-2 sm:px-6 sm:text-sm w-[40%] sm:w-[50%] text-white`}
                    >
                      Resend OTP
                    </Button>
                    <div className="w-[50%] text-xs">
                      {!canResend && (
                        <div className="text-gray-600  text-xs sm:text-sm">
                          Time remaining: {timer}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        <div className="text-center text-sm">
          <p>
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Login now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
