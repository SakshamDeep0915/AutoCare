import {
  Car,
  LogOut,
  User,
  ChevronDown,
} from "lucide-react";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";


const Navbar = () => {

  const navigate = useNavigate();

  const location =
    useLocation();


  const user =
    JSON.parse(
      localStorage.getItem("user")
    );


  const isLandingPage =
    location.pathname === "/";


  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    navigate("/login");

  };


  // =====================================================
  // LANDING PAGE NAVBAR
  // =====================================================

  if (isLandingPage) {

    return (

      <>

        <nav className="landing-navbar">

          <div className="landing-navbar-inner">


            {/* ==========================================
                LOGO
            ========================================== */}

            <Link
              to="/"
              className="landing-logo"
            >

              <div className="landing-logo-mark">

                <Car size={17} />

              </div>


              <div className="landing-logo-copy">

                <div className="landing-logo-title">

                  AutoCare
                  <span> AI</span>

                </div>


                <div className="landing-logo-subtitle">

                  VEHICLE INTELLIGENCE

                </div>

              </div>

            </Link>


            {/* ==========================================
                NAVIGATION
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
                LOGIN
            ========================================== */}

            <div className="landing-nav-actions">

              <Link
                to="/login"
                className="landing-login-btn"
              >

                Sign in

                <ChevronDown
                  size={12}
                  className="login-arrow"
                />

              </Link>

            </div>

          </div>

        </nav>


        <NavbarStyles />

      </>

    );

  }


  // =====================================================
  // AUTHENTICATED NAVBAR
  // =====================================================

  return (

    <>

      <nav className="app-navbar">


        {/* ==========================================
            BRAND
        ========================================== */}

        <Link
          to="/dashboard"
          className="app-navbar-brand"
        >

          <div className="app-brand-mark">

            <Car size={17} />

          </div>


          <div>

            <div className="app-brand-name">

              AutoCare
              <span> AI</span>

            </div>


            <div className="app-brand-subtitle">

              VEHICLE INTELLIGENCE SYSTEM

            </div>

          </div>

        </Link>


        {/* ==========================================
            RIGHT SIDE
        ========================================== */}

        <div className="app-navbar-right">


          {/* USER */}

          <div className="app-user">

            <div className="app-user-icon">

              <User size={14} />

            </div>


            <div className="app-user-details">

              <span>
                ACCOUNT
              </span>

              <strong>
                {user?.name || "User"}
              </strong>

            </div>

          </div>


          {/* DIVIDER */}

          <div className="navbar-divider"></div>


          {/* LOGOUT */}

          <button
            onClick={handleLogout}
            className="app-logout"
          >

            <LogOut size={14} />

            <span>
              Logout
            </span>

          </button>

        </div>

      </nav>


      <NavbarStyles />

    </>

  );
};


// =====================================================
// NAVBAR STYLES
// =====================================================

function NavbarStyles() {

  return (

    <style>{`

      /* ==========================================
         LANDING NAVBAR
      ========================================== */

      .landing-navbar {

        position: fixed;

        top: 0;

        left: 0;

        right: 0;

        z-index: 100;

        height: 68px;

        background:
          rgba(
            10,
            11,
            11,
            0.88
          );

        backdrop-filter:
          blur(18px);

        -webkit-backdrop-filter:
          blur(18px);

        border-bottom:
          1px solid
          rgba(
            255,
            255,
            255,
            0.055
          );

      }


      .landing-navbar-inner {

        max-width: 1180px;

        height: 100%;

        margin: 0 auto;

        padding:
          0 24px;

        display: flex;

        align-items: center;

        justify-content: space-between;

      }


      /* ==========================================
         LANDING LOGO
      ========================================== */

      .landing-logo {

        display: flex;

        align-items: center;

        gap: 9px;

        text-decoration: none;

        min-width: 190px;

      }


      .landing-logo-mark {

        width: 31px;

        height: 31px;

        display: flex;

        align-items: center;

        justify-content: center;

        border-radius: 7px;

        color: #f0f1f1;

        background:
          #151819;

        border:
          1px solid #303538;

        box-shadow:
          inset
          0 0 0 1px
          rgba(
            255,
            255,
            255,
            0.025
          );

      }


      .landing-logo-copy {

        line-height: 1;

      }


      .landing-logo-title {

        color: #d8dbdc;

        font-size: 13px;

        font-weight: 600;

        letter-spacing:
          -0.025em;

      }


      .landing-logo-title span {

        color: #e8752a;

      }


      .landing-logo-subtitle {

        margin-top: 4px;

        color: #454c50;

        font-size: 5px;

        font-weight: 700;

        letter-spacing:
          0.17em;

      }


      /* ==========================================
         LANDING LINKS
      ========================================== */

      .landing-nav-links {

        display: flex;

        align-items: center;

        gap: 27px;

      }


      .landing-nav-link {

        position: relative;

        color: #686f73;

        font-size: 8px;

        font-weight: 500;

        text-decoration: none;

        transition:
          color 0.2s ease;

      }


      .landing-nav-link:hover {

        color: #d0d4d5;

      }


      .landing-nav-link.active {

        color: #d0d4d5;

      }


      .landing-nav-link.active::after {

        content: "";

        position: absolute;

        left: 50%;

        bottom: -10px;

        width: 14px;

        height: 1px;

        transform:
          translateX(-50%);

        background:
          #e8752a;

      }


      /* ==========================================
         LANDING LOGIN
      ========================================== */

      .landing-nav-actions {

        min-width: 190px;

        display: flex;

        justify-content: flex-end;

      }


      .landing-login-btn {

        display: inline-flex;

        align-items: center;

        gap: 5px;

        padding:
          8px 12px;

        border:
          1px solid
          rgba(
            232,
            117,
            42,
            0.22
          );

        border-radius: 6px;

        color: #d77539;

        background:
          rgba(
            232,
            117,
            42,
            0.045
          );

        font-size: 7px;

        font-weight: 600;

        text-decoration: none;

        transition:
          all 0.2s ease;

      }


      .landing-login-btn:hover {

        background:
          rgba(
            232,
            117,
            42,
            0.10
          );

        border-color:
          rgba(
            232,
            117,
            42,
            0.4
          );

      }


      .login-arrow {

        transform:
          rotate(-90deg);

        opacity: 0.6;

      }


      /* ==========================================
         APP NAVBAR
      ========================================== */

      .app-navbar {

        position: relative;

        z-index: 40;

        width: 100%;

        height: 58px;

        display: flex;

        align-items: center;

        justify-content: space-between;

        padding:
          0 18px;

        margin-bottom: 18px;

        background:
          #131617;

        border:
          1px solid #292e31;

        border-radius: 9px;

        box-shadow:
          0 12px 30px
          rgba(
            0,
            0,
            0,
            0.16
          );

      }


      /* ==========================================
         APP BRAND
      ========================================== */

      .app-navbar-brand {

        display: flex;

        align-items: center;

        gap: 9px;

        text-decoration: none;

      }


      .app-brand-mark {

        width: 32px;

        height: 32px;

        display: flex;

        align-items: center;

        justify-content: center;

        border-radius: 7px;

        color: #e8752a;

        background:
          rgba(
            232,
            117,
            42,
            0.065
          );

        border:
          1px solid
          rgba(
            232,
            117,
            42,
            0.17
          );

      }


      .app-brand-name {

        color: #d2d5d6;

        font-size: 12px;

        font-weight: 600;

        letter-spacing:
          -0.02em;

      }


      .app-brand-name span {

        color: #e8752a;

      }


      .app-brand-subtitle {

        margin-top: 3px;

        color: #454c50;

        font-size: 5px;

        font-weight: 700;

        letter-spacing:
          0.14em;

      }


      /* ==========================================
         RIGHT SIDE
      ========================================== */

      .app-navbar-right {

        display: flex;

        align-items: center;

        gap: 12px;

      }


      /* ==========================================
         USER
      ========================================== */

      .app-user {

        display: flex;

        align-items: center;

        gap: 8px;

        padding:
          6px 9px;

        border:
          1px solid #252a2c;

        border-radius: 6px;

        background: #111314;

      }


      .app-user-icon {

        width: 25px;

        height: 25px;

        display: flex;

        align-items: center;

        justify-content: center;

        border-radius: 5px;

        color: #e8752a;

        background:
          rgba(
            232,
            117,
            42,
            0.06
          );

      }


      .app-user-details span {

        display: block;

        color: #454c50;

        font-size: 5px;

        font-weight: 700;

        letter-spacing:
          0.13em;

      }


      .app-user-details strong {

        display: block;

        max-width: 120px;

        overflow: hidden;

        text-overflow: ellipsis;

        white-space: nowrap;

        margin-top: 2px;

        color: #8f9699;

        font-size: 7px;

        font-weight: 500;

      }


      /* ==========================================
         DIVIDER
      ========================================== */

      .navbar-divider {

        width: 1px;

        height: 24px;

        background: #292e31;

      }


      /* ==========================================
         LOGOUT
      ========================================== */

      .app-logout {

        display: flex;

        align-items: center;

        gap: 6px;

        padding:
          7px 10px;

        border:
          1px solid #292e31;

        border-radius: 6px;

        color: #777e82;

        background: transparent;

        font-size: 7px;

        font-weight: 500;

        cursor: pointer;

        transition:
          all 0.2s ease;

      }


      .app-logout:hover {

        color: #d77539;

        border-color:
          rgba(
            232,
            117,
            42,
            0.22
          );

        background:
          rgba(
            232,
            117,
            42,
            0.045
          );

      }


      /* ==========================================
         RESPONSIVE
      ========================================== */

      @media (max-width: 800px) {

        .landing-nav-links {

          display: none;

        }


        .landing-logo {

          min-width: auto;

        }


        .landing-nav-actions {

          min-width: auto;

        }


        .app-navbar {

          height: 55px;

          padding:
            0 12px;

        }


        .app-brand-subtitle {

          display: none;

        }


        .app-user-details {

          display: none;

        }


        .navbar-divider {

          display: none;

        }

      }


      @media (max-width: 500px) {

        .app-navbar {

          border-radius: 7px;

        }


        .app-brand-name {

          font-size: 11px;

        }


        .app-logout span {

          display: none;

        }


        .app-logout {

          width: 30px;

          height: 30px;

          padding: 0;

          justify-content: center;

        }

      }

    `}</style>

  );
};


export default Navbar;