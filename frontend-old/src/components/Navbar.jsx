import { Car, LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="bg-white/90 backdrop-blur-xl border border-gray-200 shadow-xl rounded-3xl px-8 py-5 mb-8 flex justify-between items-center">

      {/* Left */}

      <div className="flex items-center gap-4">

        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 rounded-2xl shadow-lg">

          <Car className="text-white" size={30} />

        </div>

        <div>

          <h1 className="text-3xl font-extrabold text-gray-800">
            AutoCare AI
          </h1>

          <p className="text-gray-500">
            AI Powered Vehicle Health Monitoring
          </p>

        </div>

      </div>

      {/* Right */}

      <div className="flex items-center gap-5">

        <div className="flex items-center gap-3 bg-gray-100 px-5 py-3 rounded-2xl">

          <div className="bg-blue-600 p-2 rounded-full">

            <User className="text-white" size={18} />

          </div>

          <div>

            <p className="text-xs text-gray-500">
              Logged in as
            </p>

            <p className="font-semibold text-gray-800">
              {user?.name || "User"}
            </p>

          </div>

        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-500 hover:bg-red-600 hover:scale-105 transition-all duration-300 text-white px-5 py-3 rounded-2xl shadow-lg"
        >

          <LogOut size={18} />

          Logout

        </button>

      </div>

    </nav>
  );
};

export default Navbar;