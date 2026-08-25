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

import { createPortal } from "react-dom";


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
  // LANDING NAVBAR
  // Render directly inside BODY
  // =====================================================

  if (isLandingPage) {

    const landingNavbar = (
      <>
        <nav className="ac-landing-navbar">

          <div className="ac-landing-navbar-inner">


            {/* =================================================
                LOGO
            ================================================= */}

            <Link
              to="/"
              className="ac-landing-logo"
            >

              <div className="ac-landing-logo-mark">

                <Car size={21} />

              </div>


              <div className="ac-landing-logo-copy">

                <div className="ac-landing-logo-title">

                  AutoCare{" "}

                  <span>
                    AI
                  </span>

                </div>


                <div className="ac-landing-logo-subtitle">

                  VEHICLE INTELLIGENCE

                </div>

              </div>

            </Link>


            {/* =================================================
                NAVIGATION
            ================================================= */}

            <div className="ac-landing-nav-links">

              <a
                href="#home"
                className="ac-landing-nav-link active"
              >
                Home
              </a>


              <a
                href="#features"
                className="ac-landing-nav-link"
              >
                Features
              </a>


              <a
                href="#how-it-works"
                className="ac-landing-nav-link"
              >
                How It Works
              </a>


              <a
                href="#services"
                className="ac-landing-nav-link"
              >
                Services
              </a>


              <a
                href="#about"
                className="ac-landing-nav-link"
              >
                About
              </a>

            </div>


            {/* =================================================
                SIGN IN
            ================================================= */}

            <div className="ac-landing-nav-actions">

              <Link
                to="/login"
                className="ac-landing-login"
              >

                <span>
                  Sign in
                </span>

                <ArrowRight size={15} />

              </Link>

            </div>


          </div>

        </nav>


        <style>{`

          /* =====================================================
             FULL LANDING NAVBAR
          ===================================================== */

          .ac-landing-navbar {

            position: fixed !important;

            top: 0 !important;

            left: 0 !important;

            right: 0 !important;

            width: 100% !important;

            height: 76px !important;

            margin: 0 !important;

            padding: 0 !important;

            z-index: 999999 !important;

            display: block !important;

            background:
              rgba(8, 9, 9, 0.96);

            border-bottom:
              1px solid
              rgba(255,255,255,0.08);

            backdrop-filter:
              blur(18px);

            -webkit-backdrop-filter:
              blur(18px);

            box-sizing: border-box;

          }


          /* =====================================================
             INNER CONTAINER
          ===================================================== */

          .ac-landing-navbar-inner {

            width: 100% !important;

            max-width: 1320px !important;

            height: 76px !important;

            margin: 0 auto !important;

            padding:
              0 32px !important;

            display: grid !important;

            grid-template-columns:
              1fr
              auto
              1fr !important;

            align-items: center !important;

            box-sizing: border-box;

          }


          /* =====================================================
             LOGO
          ===================================================== */

          .ac-landing-logo {

            display: flex !important;

            align-items: center !important;

            justify-self: start !important;

            gap: 11px;

            text-decoration: none !important;

            min-width: 0;

          }


          .ac-landing-logo-mark {

            width: 38px;

            height: 38px;

            flex-shrink: 0;

            display: flex;

            align-items: center;

            justify-content: center;

            border-radius: 9px;

            color: #f2f2f2;

            background:
              #151718;

            border:
              1px solid #303537;

          }


          .ac-landing-logo-copy {

            line-height: 1;

          }


          .ac-landing-logo-title {

            color: #eeeeee;

            font-size: 19px;

            font-weight: 650;

            letter-spacing:
              -0.035em;

            white-space: nowrap;

          }


          .ac-landing-logo-title span {

            color: #f07827;

          }


          .ac-landing-logo-subtitle {

            margin-top: 5px;

            color: #666d70;

            font-size: 8px;

            font-weight: 700;

            letter-spacing:
              0.15em;

          }


          /* =====================================================
             NAVIGATION
          ===================================================== */

          .ac-landing-nav-links {

            display: flex !important;

            align-items: center !important;

            justify-content: center !important;

            gap: 32px;

            white-space: nowrap;

          }


          .ac-landing-nav-link {

            position: relative;

            display: block;

            color: #8d9497;

            font-size: 14px;

            font-weight: 500;

            text-decoration: none !important;

            transition:
              color 0.2s ease;

          }


          .ac-landing-nav-link:hover {

            color: #ffffff;

          }


          .ac-landing-nav-link.active {

            color: #ffffff;

          }


          .ac-landing-nav-link.active::after {

            content: "";

            position: absolute;

            left: 50%;

            bottom: -13px;

            width: 22px;

            height: 2px;

            transform:
              translateX(-50%);

            background:
              #f07827;

            border-radius: 10px;

          }


          /* =====================================================
             SIGN IN
          ===================================================== */

          .ac-landing-nav-actions {

            display: flex !important;

            align-items: center !important;

            justify-content: flex-end !important;

          }


          .ac-landing-login {

            display: inline-flex !important;

            align-items: center !important;

            justify-content: center !important;

            gap: 8px;

            min-width: 98px;

            height: 44px;

            padding:
              0 16px;

            color: #f28a45;

            background:
              rgba(240,120,39,0.055);

            border:
              1px solid
              rgba(240,120,39,0.38);

            border-radius: 8px;

            font-size: 14px;

            font-weight: 600;

            text-decoration: none !important;

            box-sizing: border-box;

            transition:
              all 0.2s ease;

          }


          .ac-landing-login:hover {

            color: #ffffff;

            background:
              rgba(240,120,39,0.13);

            border-color:
              rgba(240,120,39,0.65);

            transform:
              translateY(-1px);

          }


          /* =====================================================
             TABLET
          ===================================================== */

          @media (max-width: 1050px) {

            .ac-landing-navbar-inner {

              padding:
                0 22px !important;

            }


            .ac-landing-nav-links {

              gap: 20px;

            }


            .ac-landing-nav-link {

              font-size: 13px;

            }

          }


          /* =====================================================
             MOBILE
          ===================================================== */

          @media (max-width: 760px) {

            .ac-landing-navbar {

              height: 68px !important;

            }


            .ac-landing-navbar-inner {

              height: 68px !important;

              display: flex !important;

              align-items: center !important;

              justify-content: space-between !important;

              padding:
                0 18px !important;

            }


            .ac-landing-nav-links {

              display: none !important;

            }


            .ac-landing-logo-title {

              font-size: 17px;

            }


            .ac-landing-logo-subtitle {

              font-size: 7px;

            }


            .ac-landing-login {

              min-width: 84px;

              height: 40px;

              font-size: 12px;

            }

          }


          /* =====================================================
             SMALL MOBILE
          ===================================================== */

          @media (max-width: 450px) {

            .ac-landing-logo-mark {

              width: 34px;

              height: 34px;

            }


            .ac-landing-logo-title {

              font-size: 16px;

            }


            .ac-landing-logo-subtitle {

              display: none;

            }


            .ac-landing-login {

              min-width: 78px;

              height: 38px;

              font-size: 11px;

            }

          }

        `}</style>

      </>
    );


    return createPortal(
      landingNavbar,
      document.body
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

              AutoCare{" "}

              <span>
                AI
              </span>

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


      <style>{`

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

          box-sizing: border-box;

        }


        .app-navbar-brand {

          display: flex;

          align-items: center;

          gap: 11px;

          text-decoration: none;

        }


        .app-brand-mark {

          width: 38px;

          height: 38px;

          display: flex;

          align-items: center;

          justify-content: center;

          border-radius: 9px;

          color: #f07827;

          background:
            rgba(240,120,39,0.08);

          border:
            1px solid
            rgba(240,120,39,0.22);

        }


        .app-brand-name {

          color: #e5e7e8;

          font-size: 18px;

          font-weight: 650;

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


        .app-navbar-right {

          display: flex;

          align-items: center;

          gap: 14px;

        }


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
            rgba(240,120,39,0.07);

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

          margin-top: 3px;

          color: #c9ced0;

          font-size: 13px;

          font-weight: 500;

        }


        .navbar-divider {

          width: 1px;

          height: 30px;

          background:
            #292e31;

        }


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

          cursor: pointer;

        }


        .app-logout:hover {

          color: #f07827;

          border-color:
            rgba(240,120,39,0.35);

          background:
            rgba(240,120,39,0.06);

        }


        @media (max-width: 760px) {

          .app-navbar {

            min-height: 64px;

            padding:
              0 14px;

          }


          .app-brand-subtitle,
          .app-user-details {

            display: none;

          }


          .navbar-divider {

            display: none;

          }

        }

      `}</style>

    </>

  );
};


export default Navbar;