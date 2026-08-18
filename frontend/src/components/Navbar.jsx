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
    <nav className="bg-[#0d0d0d]/95 backdrop-blur-xl border border-zinc-800 shadow-2xl shadow-black/30 rounded-2xl px-6 py-4 mb-8 flex justify-between items-center">

      {/* Left */}

      <div className="flex items-center gap-4">

        <div className="bg-gradient-to-br from-orange-500 to-orange-700 p-4 rounded-2xl shadow-lg shadow-orange-950/40">

          <Car className="text-white" size={30} />

        </div>

        <div>

          <h1 className="text-3xl font-extrabold text-white">
            AutoCare AI
          </h1>

          <p className="text-zinc-500">
            AI Powered Vehicle Health Monitoring
          </p>

        </div>

      </div>

      {/* Right */}

      <div className="flex items-center gap-5">

        <div className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 px-4 py-3 rounded-xl">

          <div className="bg-orange-500 p-2 rounded-lg">

            <User className="text-white" size={18} />

          </div>

          <div>

            <p className="text-xs text-zinc-500">
              Logged in as
            </p>

            <p className="font-semibold text-zinc-200">
              {user?.name || "User"}
            </p>

          </div>

        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-400 transition-all duration-300 text-white px-5 py-3 rounded-2xl shadow-lg"
        >

          <LogOut size={18} />

          Logout

        </button>

      </div>

    </nav>
  );
};

export default Navbar;