import {
  Car,
  LogOut,
  User,
  ArrowRight,
} from "lucide-react";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";


const Navbar = () => {

  const navigate = useNavigate();
  const location = useLocation();

  const user = JSON.parse(
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

            {/* =================================================
                LOGO
            ================================================= */}

            <Link
              to="/"
              className="landing-logo"
            >

              <div className="landing-logo-mark">
                <Car size={21} />
              </div>

              <div className="landing-logo-copy">

                <div className="landing-logo-title">
                  AutoCare <span>AI</span>
                </div>

                <div className="landing-logo-subtitle">
                  VEHICLE INTELLIGENCE
                </div>

              </div>

            </Link>


            {/* =================================================
                NAVIGATION
            ================================================= */}

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


            {/* =================================================
                SIGN IN
            ================================================= */}

            <div className="landing-nav-actions">

              <Link
                to="/login"
                className="landing-login-btn"
              >

                <span>
                  Sign in
                </span>

                <ArrowRight size={15} />

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

        {/* =================================================
            BRAND
        ================================================= */}

        <Link
          to="/dashboard"
          className="app-navbar-brand"
        >

          <div className="app-brand-mark">

            <Car size={20} />

          </div>

          <div>

            <div className="app-brand-name">
              AutoCare <span>AI</span>
            </div>

            <div className="app-brand-subtitle">
              VEHICLE INTELLIGENCE SYSTEM
            </div>

          </div>

        </Link>


        {/* =================================================
            RIGHT SIDE
        ================================================= */}

        <div className="app-navbar-right">

          <div className="app-user">

            <div className="app-user-icon">
              <User size={16} />
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


          <div className="navbar-divider"></div>


          <button
            onClick={handleLogout}
            className="app-logout"
          >

            <LogOut size={16} />

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

      /* =================================================
         LANDING NAVBAR
      ================================================= */

      .landing-navbar {

        position: fixed !important;

        top: 0 !important;
        left: 0 !important;
        right: 0 !important;

        width: 100vw !important;

        max-width: none !important;

        height: 76px;

        margin: 0 !important;
        padding: 0 !important;

        z-index: 9999;

        background:
          rgba(8, 9, 9, 0.94);

        backdrop-filter:
          blur(18px);

        -webkit-backdrop-filter:
          blur(18px);

        border-bottom:
          1px solid
          rgba(255, 255, 255, 0.08);

        box-sizing: border-box;

      }


      /* =================================================
         INNER NAVBAR CONTAINER
      ================================================= */

      .landing-navbar-inner {

        width: 100% !important;

        max-width: 1280px !important;

        height: 100%;

        margin: 0 auto !important;

        padding:
          0 34px;

        display: grid;

        grid-template-columns:
          minmax(230px, 1fr)
          auto
          minmax(230px, 1fr);

        align-items: center;

        box-sizing: border-box;

      }


      /* =================================================
         LOGO
      ================================================= */

      .landing-logo {

        display: flex;

        align-items: center;

        justify-self: start;

        gap: 11px;

        text-decoration: none;

        min-width: 0;

      }


      .landing-logo-mark {

        width: 38px;
        height: 38px;

        flex-shrink: 0;

        display: flex;

        align-items: center;
        justify-content: center;

        border-radius: 9px;

        color: #f1f1f1;

        background: #151718;

        border:
          1px solid #303537;

      }


      .landing-logo-copy {

        line-height: 1;

      }


      .landing-logo-title {

        color: #eeeeee;

        font-size: 18px;

        font-weight: 650;

        letter-spacing:
          -0.035em;

        white-space: nowrap;

      }


      .landing-logo-title span {

        color: #f07827;

      }


      .landing-logo-subtitle {

        margin-top: 5px;

        color: #666d70;

        font-size: 8px;

        font-weight: 700;

        letter-spacing:
          0.16em;

      }


      /* =================================================
         NAVIGATION LINKS
      ================================================= */

      .landing-nav-links {

        display: flex;

        align-items: center;

        justify-content: center;

        gap: 30px;

        white-space: nowrap;

      }


      .landing-nav-link {

        position: relative;

        color: #8a9093;

        font-size: 14px;

        font-weight: 500;

        line-height: 1;

        text-decoration: none;

        transition:
          color 0.2s ease;

      }


      .landing-nav-link:hover {

        color: #ffffff;

      }


      .landing-nav-link.active {

        color: #ffffff;

      }


      .landing-nav-link.active::after {

        content: "";

        position: absolute;

        left: 50%;

        bottom: -12px;

        width: 22px;

        height: 2px;

        transform:
          translateX(-50%);

        background:
          #f07827;

        border-radius: 10px;

      }


      /* =================================================
         SIGN IN AREA
      ================================================= */

      .landing-nav-actions {

        display: flex;

        align-items: center;

        justify-content: flex-end;

      }


      .landing-login-btn {

        display: inline-flex;

        align-items: center;

        justify-content: center;

        gap: 8px;

        min-width: 96px;

        padding:
          11px 16px;

        border:
          1px solid
          rgba(240, 120, 39, 0.38);

        border-radius: 8px;

        color: #f28a45;

        background:
          rgba(240, 120, 39, 0.06);

        font-size: 13px;

        font-weight: 600;

        text-decoration: none;

        transition:
          all 0.2s ease;

        box-sizing: border-box;

      }


      .landing-login-btn:hover {

        color: #ffffff;

        background:
          rgba(240, 120, 39, 0.14);

        border-color:
          rgba(240, 120, 39, 0.65);

        transform:
          translateY(-1px);

      }


      /* =================================================
         AUTHENTICATED NAVBAR
      ================================================= */

      .app-navbar {

        position: relative;

        z-index: 40;

        width: 100%;

        min-height: 70px;

        display: flex;

        align-items: center;

        justify-content: space-between;

        padding:
          0 22px;

        margin-bottom: 22px;

        background:
          #131617;

        border:
          1px solid #292e31;

        border-radius: 12px;

        box-shadow:
          0 12px 30px
          rgba(0, 0, 0, 0.18);

        box-sizing: border-box;

      }


      /* =================================================
         APP BRAND
      ================================================= */

      .app-navbar-brand {

        display: flex;

        align-items: center;

        gap: 11px;

        text-decoration: none;

      }


      .app-brand-mark {

        width: 38px;
        height: 38px;

        flex-shrink: 0;

        display: flex;

        align-items: center;
        justify-content: center;

        border-radius: 9px;

        color: #f07827;

        background:
          rgba(240, 120, 39, 0.08);

        border:
          1px solid
          rgba(240, 120, 39, 0.22);

      }


      .app-brand-name {

        color: #e5e7e8;

        font-size: 18px;

        font-weight: 650;

        letter-spacing:
          -0.03em;

      }


      .app-brand-name span {

        color: #f07827;

      }


      .app-brand-subtitle {

        margin-top: 4px;

        color: #626a6e;

        font-size: 8px;

        font-weight: 700;

        letter-spacing:
          0.14em;

      }


      /* =================================================
         APP RIGHT SIDE
      ================================================= */

      .app-navbar-right {

        display: flex;

        align-items: center;

        gap: 14px;

      }


      /* =================================================
         USER
      ================================================= */

      .app-user {

        display: flex;

        align-items: center;

        gap: 10px;

        padding:
          7px 11px;

        border:
          1px solid #292e31;

        border-radius: 8px;

        background:
          #101213;

      }


      .app-user-icon {

        width: 31px;
        height: 31px;

        display: flex;

        align-items: center;
        justify-content: center;

        border-radius: 7px;

        color: #f07827;

        background:
          rgba(240, 120, 39, 0.07);

      }


      .app-user-details span {

        display: block;

        color: #626a6e;

        font-size: 8px;

        font-weight: 700;

        letter-spacing:
          0.12em;

      }


      .app-user-details strong {

        display: block;

        max-width: 160px;

        margin-top: 3px;

        overflow: hidden;

        text-overflow: ellipsis;

        white-space: nowrap;

        color: #c9ced0;

        font-size: 13px;

        font-weight: 500;

      }


      /* =================================================
         DIVIDER
      ================================================= */

      .navbar-divider {

        width: 1px;

        height: 30px;

        background:
          #292e31;

      }


      /* =================================================
         LOGOUT
      ================================================= */

      .app-logout {

        display: flex;

        align-items: center;

        justify-content: center;

        gap: 8px;

        padding:
          10px 14px;

        border:
          1px solid #303538;

        border-radius: 8px;

        color: #a0a6a9;

        background:
          transparent;

        font-size: 13px;

        font-weight: 500;

        cursor: pointer;

        transition:
          all 0.2s ease;

      }


      .app-logout:hover {

        color: #f07827;

        border-color:
          rgba(240, 120, 39, 0.35);

        background:
          rgba(240, 120, 39, 0.06);

      }


      /* =================================================
         TABLET
      ================================================= */

      @media (max-width: 1050px) {

        .landing-navbar-inner {

          grid-template-columns:
            minmax(180px, 1fr)
            auto
            minmax(180px, 1fr);

          padding:
            0 24px;

        }


        .landing-nav-links {

          gap: 18px;

        }


        .landing-nav-link {

          font-size: 13px;

        }

      }


      /* =================================================
         MOBILE
      ================================================= */

      @media (max-width: 760px) {

        .landing-navbar {

          height: 68px;

        }


        .landing-navbar-inner {

          display: flex;

          justify-content: space-between;

          padding:
            0 18px;

        }


        .landing-nav-links {

          display: none;

        }


        .landing-logo-title {

          font-size: 16px;

        }


        .landing-logo-subtitle {

          font-size: 7px;

        }


        .landing-login-btn {

          min-width: 82px;

          padding:
            9px 12px;

          font-size: 12px;

        }


        .app-navbar {

          min-height: 64px;

          padding:
            0 14px;

          border-radius: 10px;

        }


        .app-brand-name {

          font-size: 16px;

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


      /* =================================================
         SMALL MOBILE
      ================================================= */

      @media (max-width: 450px) {

        .landing-logo-mark {

          width: 34px;
          height: 34px;

        }


        .landing-logo-title {

          font-size: 15px;

        }


        .landing-login-btn {

          min-width: 76px;

          font-size: 11px;

        }


        .app-brand-mark {

          width: 34px;
          height: 34px;

        }


        .app-brand-name {

          font-size: 15px;

        }


        .app-logout {

          width: 36px;
          height: 36px;

          padding: 0;

        }


        .app-logout span {

          display: none;

        }

      }

    `}</style>
  );
};


export default Navbar;  