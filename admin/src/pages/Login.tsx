import { FormEvent, useState } from "react";
import loginApi from "../apis/login.api";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/slices/userSlice";

export default function LoginPage() {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const user = localStorage.getItem("userData");
    if (user) {
      navigate("/");
    }
  }, [navigate]);

  const dispatch = useDispatch()

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const userData = await loginApi({
        phone_number: phoneNumber,
        userPassword: password,
      });

      console.log(userData);
      dispatch(setUser(userData))
      
      localStorage.setItem("userData", JSON.stringify(userData));

      navigate("/");
    } catch (error: any) {
      console.log(error);
      
      let errorMessage = "Unexpected error occurred during login.";

      if (error.response && error.response.status === 401) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(error.response.data, "text/html");
        const preElement = doc.querySelector("pre");
        errorMessage = preElement
          ? preElement.innerHTML.split("<br>")[0].replace(/^Error:\s*/, "")
          : errorMessage;
      }

      toast.error(errorMessage, {
        autoClose: 5000,
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-base-200">
      <div className="card w-full max-w-md shadow-lg bg-base-100 p-8 rounded-lg">
        <ToastContainer />
        <div className="text-center">
          <h2 className="text-2xl font-bold">Admin Login</h2>
        </div>
        <form onSubmit={handleLogin} className="space-y-4 mt-6">
          <div className="form-control">
            <label htmlFor="phone-number" className="label">
              <span className="label-text">Phone Number</span>
            </label>
            <input
              id="phone-number"
              name="phone-number"
              type="tel"
              autoComplete="tel"
              required
              placeholder="Enter your phone number"
              className="input input-bordered w-full"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
          <div className="form-control">
            <label htmlFor="password" className="label">
              <span className="label-text">Password</span>
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              placeholder="Enter your password"
              className="input input-bordered w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="form-control">
            <label className="label">
              <a href="#" className="label-text-alt link link-hover">
                Forgot your password?
              </a>
            </label>
          </div>
          <button
            type="submit"
            className="btn btn-primary w-full"
          >
            Sign in
          </button>
        </form>
        <div className="text-center mt-4">
          <p>
            Don’t have an account?{" "}
            <a href="#" className="link link-primary">
              Register now
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
