import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, Car } from "lucide-react";
import { loginUser } from "../services/authService";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const res = await loginUser(formData);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message || "Invalid email or password."
      );
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-indigo-600 flex items-center justify-center p-6">

      {/* Left Side */}

      <div className="hidden lg:flex flex-col justify-center w-1/2 text-white pr-16">

        <div className="flex items-center gap-4 mb-8">
          <Car size={60} />
          <h1 className="text-5xl font-bold">AutoCare AI</h1>
        </div>

        <h2 className="text-3xl font-semibold mb-6">
          Welcome Back!
        </h2>

        <p className="text-lg leading-8 text-blue-100">
          Manage your vehicles effortlessly, monitor maintenance,
          predict health issues using AI, and never miss an important
          service again.
        </p>

      </div>

      {/* Login Card */}

      <div className="w-full max-w-md bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-10">

        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Login
        </h2>

        <p className="text-center text-gray-500 mb-8">
          Sign in to continue
        </p>

        <form onSubmit={handleSubmit}>

          {/* Email */}

          <div className="mb-5">

            <label className="font-medium text-gray-700">
              Email
            </label>

            <div className="flex items-center border rounded-xl mt-2 px-4">

              <Mail className="text-gray-400" size={20} />

              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full p-3 outline-none"
              />

            </div>

          </div>

          {/* Password */}

          <div className="mb-6">

            <label className="font-medium text-gray-700">
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
                required
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

          {error && (
            <div className="bg-red-100 text-red-700 rounded-xl p-3 mb-5 text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 hover:scale-105 transition-all duration-300 text-white py-3 rounded-xl font-semibold shadow-lg"
          >
            {loading ? "Signing In..." : "Login"}
          </button>

        </form>

        <p className="text-center mt-8 text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-blue-600 font-semibold hover:underline"
          >
            Create Account
          </Link>
        </p>

      </div>

    </div>
  );
};

export default Login;