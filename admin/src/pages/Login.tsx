import { FormEvent, useState } from "react";
import loginApi from "../apis/login.api";
import { useNavigate } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function LoginPage() {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: FormEvent) => {
    try {
      e.preventDefault();
      const userData = await loginApi({
        phone_number: phoneNumber,
        userPassword: password,
      });
      console.log(userData);
      //store user data in local storage

      //navigate to home page
      navigate("/");
      console.log("Candidate Logged in...");
    } catch (error: any) {
      let errorMessage: string | undefined = "";

      if (error.response && error.response.status === 401) {
        // Parse HTML response to extract error message
        const parser = new DOMParser();
        const doc = parser.parseFromString(error.response.data, "text/html");
        const preElement = doc.querySelector("pre");

        errorMessage = preElement
          ? preElement.innerHTML.split("<br>")[0]
          : "An error occurred";

        errorMessage = errorMessage.replace(/^Error:\s*/, "");

      } else {
        errorMessage = "Unexpected error while login.";
      }

      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 custom-shadow bg-opacity-90 bg-[#fbfbfb94] p-8 md:w-3/4 lg:w-2/4 rounded-2xl">
        <div>
          <ToastContainer />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Admin Login
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <input type="hidden" name="remember" defaultValue="true" />
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="mb-8">
              <label htmlFor="phone-number" className="sr-only">
                Phone Number
              </label>
              <input
                id="phone-number"
                name="phone-number"
                type="tel"
                autoComplete="tel"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Phone number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="text-sm text-center mb-4">
            <a
              href="#"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Forgot your password?
            </a>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Sign in
            </button>
          </div>
        </form>
        <div className="text-center text-sm">
          <p>
            Don’t have an account?{" "}
            <a
              href="/candidate/signup"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Register now
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
