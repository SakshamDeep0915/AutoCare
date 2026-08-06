import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { sendOTP, verifyOTP } from "../services/authService";
import {
  Car,
  User,
  Phone,
  Mail,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const navigate = useNavigate();

const [loading, setLoading] = useState(false);
const [error, setError] = useState("");
const [success, setSuccess] = useState("");

const [otp, setOtp] = useState("");
const [otpSent, setOtpSent] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const {
      name,
      phone,
      email,
      password,
      confirmPassword,
    } = formData;

    if (
      !name || !phone || !email || !password || !confirmPassword) {
        setError("Please fill all fields.");
        return;
      }

      if(phone.length !== 10) {
        setError("Phone number must be 10 digits.");
        return;
      }

      if(password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }

      try {
        setLoading(true);

        if(!otpSent) {
          const res = await sendOTP({
            name,
            phone,
            email,
            password,
          });

          setSuccess(res.data.message);
          setOtpSent(true);
        } else {
          const res = await verifyOTP({
            name,
            phone,
            email,
            password,
            otp,
          });
          setSuccess(res.data.message);

          setTimeout(() => {
            navigate("/login");
          }, 1500);
        }

      } catch (err) {
        setError(
          err.response?.data?.message || "Something went wrong"
        );
      } finally {
        setLoading(false);
      }
  };
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-700 flex">

      {/* LEFT SIDE */}

      <div className="hidden lg:flex w-1/2 flex-col justify-center items-center text-white px-16">

        <div className="flex items-center gap-4 mb-8">
          <Car size={60} />
          <h1 className="text-6xl font-bold">
            AutoCare AI
          </h1>
        </div>

        <h2 className="text-4xl font-semibold mb-8 text-center">
          Smart Vehicle Health Platform
        </h2>

        <p className="text-xl text-center leading-10 opacity-90">
          Register today and let AI monitor your vehicle's
          health, predict maintenance, and help you drive smarter.
        </p>

      </div>

      {/* RIGHT SIDE */}

      <div className="flex-1 flex justify-center items-center p-8">

        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8">
          <form onSubmit={handleSubmit}>  

          <h2 className="text-4xl font-bold text-center">
            Create Account
          </h2>

          <p className="text-gray-500 text-center mt-2 mb-8">
            Welcome to AutoCare AI
          </p>

          {/* NAME */}

          <div className="mb-5">

            <label className="font-medium">
              Full Name
            </label>

            <div className="flex items-center border rounded-xl mt-2 px-4">

              <User className="text-gray-400" size={20} />

              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 outline-none"
              />

            </div>

          </div>

          {/* PHONE */}

          <div className="mb-5">

            <label className="font-medium">
              Phone Number
            </label>

            <div className="flex items-center border rounded-xl mt-2 px-4">

              <Phone className="text-gray-400" size={20} />

              <input
                type="tel"
                name="phone"
                placeholder="Enter phone number"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-3 outline-none"
              />

            </div>

          </div>

          {/* EMAIL */}

          <div className="mb-5">

            <label className="font-medium">
              Email
            </label>

            <div className="flex items-center border rounded-xl mt-2 px-4">

              <Mail className="text-gray-400" size={20} />

              <input
                type="email"
                name="email"
                placeholder="Enter email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 outline-none"
              />

            </div>

          </div>

          {/* PASSWORD */}

          <div className="mb-5">

            <label className="font-medium">
              Password
            </label>

            <div className="flex items-center border rounded-xl mt-2 px-4">

              <Lock className="text-gray-400" size={20} />

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-3 outline-none"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
              >
                {showPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>

            </div>

          </div>

          {/* CONFIRM PASSWORD */}

          <div className="mb-6">

            <label className="font-medium">
              Confirm Password
            </label>

            <div className="flex items-center border rounded-xl mt-2 px-4">

              <Lock className="text-gray-400" size={20} />

              <input
                type={showConfirm ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full p-3 outline-none"
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirm(!showConfirm)
                }
              >
                {showConfirm ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>

            </div>
            </div>

            // otp field (appears only after OTP is sent)

            {otpSent && (
              <div className="mb-6">
                <label className="font-medium">
                  Enter OTP
                </label>

                <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full border rounded-xl p-3 mt-2"
                placeholder="Enter OTP"
                />
                </div>
            )}

          {error && (
  <div className="bg-red-100 text-red-700 p-3 rounded-xl mb-4 text-center">
    {error}
  </div>
)}

{success && (
  <div className="bg-green-100 text-green-700 p-3 rounded-xl mb-4 text-center">
    {success}
  </div>
)}

<button
  type="submit"
  disabled={loading}
  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition"
>
  {loading ? "Please Wait..." : otpSent ? "Verify OTP" : "Send OTP"}
</button>

          {/* Button will come in Part 2 */}

          <p className="text-center mt-8 text-gray-600">

            Already have an account?{" "}

            <Link
              to="/login"
              className="text-blue-600 font-semibold"
            >
              Login
            </Link>

          </p>
          </form>

        </div>

      </div>

    </div>
  );
};

export default Register;