import { Car, LogOut, User } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem("user"));

  const isLandingPage = location.pathname === "/";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  /* =====================================================
     LANDING PAGE NAVBAR
  ===================================================== */

  if (isLandingPage) {
    return (
      <nav className="landing-navbar">
        <div className="landing-navbar-inner">

          {/* ==========================================
              LOGO
          ========================================== */}

          <Link to="/" className="landing-logo">

            <div className="landing-logo-icon">
              <Car size={27} />
            </div>

            <div>
              <div className="landing-logo-title">
                AutoCare <span>AI</span>
              </div>

              <div className="landing-logo-subtitle">
                Intelligent Vehicle Care
              </div>
            </div>

          </Link>


          {/* ==========================================
              NAVIGATION LINKS
          ========================================== */}

          <div className="landing-nav-links">

            <a
              href="#home"
              className="landing-nav-link active"
            >
              Home
            </a>

            <a
              href="#features"
              className="landing-nav-link"
            >
              Features
            </a>

            <a
              href="#how-it-works"
              className="landing-nav-link"
            >
              How It Works
            </a>

            <a
              href="#services"
              className="landing-nav-link"
            >
              Services
            </a>

            <a
              href="#about"
              className="landing-nav-link"
            >
              About
            </a>

          </div>


          {/* ==========================================
              LOGIN BUTTON
          ========================================== */}

          <div className="landing-nav-actions">

            <Link
              to="/login"
              className="landing-login-btn"
            >
              Login
            </Link>

          </div>

        </div>
      </nav>
    );
  }


  /* =====================================================
     DASHBOARD / AUTHENTICATED NAVBAR
  ===================================================== */

  return (
    <nav className="bg-[#0d0d0d]/95 backdrop-blur-xl border border-zinc-800 shadow-2xl shadow-black/30 rounded-2xl px-6 py-4 mb-8 flex justify-between items-center">

      {/* ==========================================
          LEFT SIDE
      ========================================== */}

      <div className="flex items-center gap-4">

        <div className="bg-gradient-to-br from-orange-500 to-orange-700 p-4 rounded-2xl shadow-lg shadow-orange-950/40">

          <Car
            className="text-white"
            size={30}
          />

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


      {/* ==========================================
          RIGHT SIDE
      ========================================== */}

      <div className="flex items-center gap-5">

        <div className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 px-4 py-3 rounded-xl">

          <div className="bg-orange-500 p-2 rounded-lg">

            <User
              className="text-white"
              size={18}
            />

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