import { FormEvent, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { setUser } from "../redux/slices/userSlice";
import loginApi from "../apis/auth/login.api";
import getErrorMsg from "../utility/getErrorMsg";
import { Eye, EyeOff } from "lucide-react"; 

export default function LoginPage() {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State for password visibility

  useEffect(() => {
    const user = localStorage.getItem("userData");
    if (user) {
      navigate("/");
    }
  }, [navigate]);

  const dispatch = useDispatch();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const userData = await loginApi({
        phone_number: phoneNumber,
        userPassword: password,
      });

      dispatch(setUser(userData));
      localStorage.setItem("userData", JSON.stringify(userData));
      navigate("/");
    } catch (error: any) {
      console.error(error);
      const errorMessage = getErrorMsg(error, 401, "login");
      toast.error(errorMessage, { autoClose: 5000 });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-base-200">
      <div className="card w-full max-w-md shadow-lg bg-base-100 p-8 rounded-lg">
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
          <div className="form-control relative">
            <label htmlFor="password" className="label">
              <span className="label-text">Password</span>
            </label>
            <div className="flex input input-bordered">
              {/* Eye button to toggle visibility */}
              
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"} // Toggle type
                autoComplete="current-password"
                required
                placeholder="Enter your password"
                className="w-full" // Ensure space for eye button
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
          <div className="form-control">
            <label className="label">
              <a href="#" className="label-text-alt link link-hover">
                Forgot your password?
              </a>
            </label>
          </div>
          <button type="submit" className="btn btn-primary w-full">
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
