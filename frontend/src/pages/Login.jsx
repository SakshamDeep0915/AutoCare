import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Activity,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

import { loginUser } from "../services/authService";


const Login = () => {

  const navigate = useNavigate();


  // ==================================================
  // FORM STATE
  // ==================================================

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });


  const [showPassword, setShowPassword] =
    useState(false);


  const [loading, setLoading] =
    useState(false);


  const [error, setError] =
    useState("");


  // ==================================================
  // HANDLE INPUT
  // ==================================================

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });


    if (error) {
      setError("");
    }

  };


  // ==================================================
  // LOGIN
  // ==================================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");

    setLoading(true);


    try {

      const res =
        await loginUser(formData);


      localStorage.setItem(
        "token",
        res.data.token
      );


      localStorage.setItem(
        "user",
        JSON.stringify(
          res.data.user
        )
      );


      navigate("/dashboard");


    } catch (err) {

      setError(
        err.response?.data?.message ||
        "Invalid email or password."
      );


    } finally {

      setLoading(false);

    }

  };


  return (

    <div className="login-page">


      {/* ==================================================
          BACKGROUND
      ================================================== */}

      <div className="login-background">

        <div className="background-line line-one"></div>

        <div className="background-line line-two"></div>

        <div className="background-line line-three"></div>

        <div className="background-glow"></div>

      </div>


      {/* ==================================================
          MAIN
      ================================================== */}

      <main className="login-container">


        {/* ==================================================
            LEFT BRAND PANEL
        ================================================== */}

        <section className="login-brand">


          {/* ==================================================
              BRAND LOGO
          ================================================== */}

          <Link
            to="/"
            className="brand-logo"
          >

            <img
              src="/autocare-logo.png"
              alt="AutoCare AI"
              className="brand-logo-image"
            />

            <div>

              <strong>
                AutoCare <span>AI</span>
              </strong>

              <small>
                Intelligent Vehicle Care
              </small>

            </div>

          </Link>


          {/* ==================================================
              BRAND CONTENT
          ================================================== */}

          <div className="brand-content">

            <div className="brand-kicker">

              <span></span>

              VEHICLE INTELLIGENCE

            </div>


            <h1>

              Your vehicle.
              <br />

              <em>
                Always in control.
              </em>

            </h1>


            <p>

              Manage maintenance, fuel, expenses and
              vehicle health from one intelligent
              platform.

            </p>

          </div>


          {/* ==================================================
              PRODUCT STATUS
          ================================================== */}

          <div className="brand-status">

            <div className="status-icon">

              <Activity size={18} />

            </div>


            <div>

              <span>
                AUTOCARE SYSTEM
              </span>

              <strong>
                All systems operational
              </strong>

            </div>


            <div className="status-dot"></div>

          </div>


        </section>


        {/* ==================================================
            LOGIN PANEL
        ================================================== */}

        <section className="login-panel">

          <div className="login-card">


            {/* ==================================================
                ACTUAL AUTOCare AI LOGO
            ================================================== */}

            <div className="login-logo-wrapper">

              <img
                src="/autocare-logo.png"
                alt="AutoCare AI"
                className="login-logo"
              />

            </div>


            {/* ==================================================
                LOGIN HEADER
            ================================================== */}

            <div className="login-header">

              <div className="login-icon">

                <ShieldCheck size={21} />

              </div>


              <div>

                <span>
                  SECURE ACCESS
                </span>

                <h2>
                  Sign in
                </h2>

              </div>

            </div>


            <p className="login-subtitle">

              Access your vehicle management dashboard.

            </p>


            {/* ==================================================
                FORM
            ================================================== */}

            <form
              onSubmit={handleSubmit}
              className="login-form"
            >


              {/* ==================================================
                  EMAIL
              ================================================== */}

              <div className="form-group">

                <label>
                  Email address
                </label>


                <div className="input-wrapper">

                  <Mail
                    size={17}
                    className="input-icon"
                  />


                  <input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    autoComplete="email"
                  />

                </div>

              </div>


              {/* ==================================================
                  PASSWORD
              ================================================== */}

              <div className="form-group">

                <div className="password-label">

                  <label>
                    Password
                  </label>

                  <span>
                    Protected
                  </span>

                </div>


                <div className="input-wrapper">

                  <Lock
                    size={17}
                    className="input-icon"
                  />


                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    autoComplete="current-password"
                  />


                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >

                    {showPassword ? (

                      <EyeOff size={17} />

                    ) : (

                      <Eye size={17} />

                    )}

                  </button>

                </div>

              </div>


              {/* ==================================================
                  ERROR
              ================================================== */}

              {error && (

                <div className="login-error">

                  <span></span>

                  {error}

                </div>

              )}


              {/* ==================================================
                  SUBMIT
              ================================================== */}

              <button
                type="submit"
                disabled={loading}
                className="login-button"
              >

                {loading ? (

                  <>

                    <span className="loading-spinner"></span>

                    Signing in...

                  </>

                ) : (

                  <>

                    Continue

                    <ArrowRight
                      size={17}
                    />

                  </>

                )}

              </button>

            </form>


            {/* ==================================================
                REGISTER
            ================================================== */}

            <div className="register-section">

              <span>
                New to AutoCare AI?
              </span>


              <Link to="/register">

                Create an account

                <ArrowRight size={14} />

              </Link>

            </div>


            {/* ==================================================
                SECURITY
            ================================================== */}

            <div className="login-security">

              <ShieldCheck size={13} />

              <span>
                Your account information is securely protected.
              </span>

            </div>


          </div>

        </section>


      </main>


      {/* ==================================================
          STYLES
      ================================================== */}

      <style>{`

        /* ==================================================
           PAGE
        ================================================== */

        .login-page {

          min-height: 100vh;

          background: #0b0d0e;

          color: #f3f3f3;

          position: relative;

          overflow: hidden;

        }


        .login-page * {

          box-sizing: border-box;

        }


        /* ==================================================
           BACKGROUND
        ================================================== */

        .login-background {

          position: fixed;

          inset: 0;

          pointer-events: none;

          overflow: hidden;

        }


        .background-glow {

          position: absolute;

          width: 650px;

          height: 650px;

          left: -250px;

          bottom: -280px;

          background:
            radial-gradient(
              circle,
              rgba(
                232,
                117,
                42,
                0.075
              ),
              transparent 68%
            );

        }


        .background-line {

          position: absolute;

          background: #1c2022;

          opacity: 0.45;

        }


        .line-one {

          width: 1px;

          height: 100vh;

          left: 18%;

        }


        .line-two {

          width: 1px;

          height: 100vh;

          left: 50%;

        }


        .line-three {

          width: 1px;

          height: 100vh;

          right: 18%;

        }


        /* ==================================================
           CONTAINER
        ================================================== */

        .login-container {

          min-height: 100vh;

          max-width: 1280px;

          margin: 0 auto;

          padding: 40px;

          display: grid;

          grid-template-columns:
            1fr
            0.85fr;

          align-items: center;

          gap: 100px;

          position: relative;

          z-index: 2;

        }


        /* ==================================================
           BRAND
        ================================================== */

        .login-brand {

          min-height: 650px;

          display: flex;

          flex-direction: column;

          justify-content: space-between;

          padding: 20px 0;

        }


        .brand-logo {

          display: inline-flex;

          align-items: center;

          gap: 11px;

          width: fit-content;

          text-decoration: none;

          color: white;

        }


        /* ==================================================
           LEFT LOGO IMAGE
        ================================================== */

        .brand-logo-image {

          width: 44px;

          height: 44px;

          object-fit: contain;

          display: block;

          flex-shrink: 0;

        }


        .brand-logo strong {

          display: block;

          font-size: 14px;

          font-weight: 650;

          letter-spacing:
            -0.01em;

        }


        .brand-logo strong span {

          color: #e8752a;

        }


        .brand-logo small {

          display: block;

          color: #555b5f;

          font-size: 8px;

          margin-top: 2px;

          letter-spacing:
            0.05em;

        }


        /* ==================================================
           BRAND CONTENT
        ================================================== */

        .brand-content {

          max-width: 650px;

          margin-top: auto;

          margin-bottom: auto;

        }


        .brand-kicker {

          display: flex;

          align-items: center;

          gap: 10px;

          color: #62686c;

          font-size: 9px;

          font-weight: 700;

          letter-spacing:
            0.2em;

          margin-bottom: 22px;

        }


        .brand-kicker span {

          width: 25px;

          height: 1px;

          background: #e8752a;

        }


        .brand-content h1 {

          margin: 0;

          font-size:
            clamp(
              3.5rem,
              6vw,
              6.2rem
            );

          line-height: 0.92;

          letter-spacing:
            -0.065em;

          font-weight: 650;

        }


        .brand-content h1 em {

          color: #e8752a;

          font-style: normal;

        }


        .brand-content p {

          max-width: 500px;

          margin: 30px 0 0;

          color: #676d71;

          font-size: 15px;

          line-height: 1.8;

        }


        /* ==================================================
           STATUS
        ================================================== */

        .brand-status {

          display: flex;

          align-items: center;

          gap: 12px;

          width: fit-content;

          padding:
            12px 15px;

          border:
            1px solid #292e31;

          border-radius: 9px;

          background: #101213;

        }


        .status-icon {

          width: 31px;

          height: 31px;

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
              0.07
            );

          border:
            1px solid
            rgba(
              232,
              117,
              42,
              0.13
            );

        }


        .brand-status span {

          display: block;

          color: #4e5458;

          font-size: 7px;

          letter-spacing:
            0.17em;

        }


        .brand-status strong {

          display: block;

          color: #9ba0a3;

          font-size: 10px;

          font-weight: 500;

          margin-top: 3px;

        }


        .status-dot {

          width: 6px;

          height: 6px;

          border-radius: 50%;

          background: #e8752a;

          box-shadow:
            0 0 9px
            rgba(
              232,
              117,
              42,
              0.65
            );

          margin-left: 15px;

        }


        /* ==================================================
           LOGIN PANEL
        ================================================== */

        .login-panel {

          display: flex;

          justify-content: center;

        }


        .login-card {

          width: 100%;

          max-width: 450px;

          background: #131617;

          border:
            1px solid #2c3033;

          border-radius: 14px;

          padding: 38px;

          box-shadow:
            0 30px 90px
            rgba(
              0,
              0,
              0,
              0.45
            );

        }


        /* ==================================================
           LOGIN LOGO
        ================================================== */

        .login-logo-wrapper {

          width: 100%;

          display: flex;

          align-items: center;

          justify-content: center;

          margin-bottom: 28px;

          padding-bottom: 4px;

        }


        .login-logo {

          width: 175px;

          height: auto;

          max-height: 75px;

          object-fit: contain;

          display: block;

        }


        /* ==================================================
           LOGIN HEADER
        ================================================== */

        .login-header {

          display: flex;

          align-items: center;

          gap: 13px;

        }


        .login-icon {

          width: 42px;

          height: 42px;

          display: flex;

          align-items: center;

          justify-content: center;

          border-radius: 9px;

          color: #e8752a;

          background:
            rgba(
              232,
              117,
              42,
              0.07
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


        .login-header span {

          display: block;

          color: #62686c;

          font-size: 8px;

          letter-spacing:
            0.18em;

          font-weight: 700;

        }


        .login-header h2 {

          margin:
            5px 0 0;

          color: #f2f2f2;

          font-size: 26px;

          font-weight: 600;

          letter-spacing:
            -0.025em;

        }


        .login-subtitle {

          color: #62686c;

          font-size: 12px;

          line-height: 1.6;

          margin:
            18px 0 30px;

        }


        /* ==================================================
           FORM
        ================================================== */

        .login-form {

          display: flex;

          flex-direction: column;

          gap: 21px;

        }


        .form-group {

          width: 100%;

        }


        .form-group label {

          display: block;

          color: #a0a5a8;

          font-size: 11px;

          font-weight: 600;

          margin-bottom: 8px;

        }


        .password-label {

          display: flex;

          justify-content: space-between;

          align-items: center;

        }


        .password-label span {

          color: #4f5559;

          font-size: 8px;

          text-transform: uppercase;

          letter-spacing:
            0.12em;

        }


        /* ==================================================
           INPUT
        ================================================== */

        .input-wrapper {

          height: 47px;

          display: flex;

          align-items: center;

          background: #0f1112;

          border:
            1px solid #2b3033;

          border-radius: 8px;

          padding:
            0 13px;

          transition:
            border-color 0.2s ease,
            box-shadow 0.2s ease;

        }


        .input-wrapper:focus-within {

          border-color:
            #e8752a;

          box-shadow:
            0 0 0 3px
            rgba(
              232,
              117,
              42,
              0.07
            );

        }


        .input-icon {

          color: #53595d;

          flex-shrink: 0;

          margin-right: 10px;

        }


        .input-wrapper input {

          width: 100%;

          height: 100%;

          background: transparent;

          border: none;

          outline: none;

          color: #e8e8e8;

          font-size: 12px;

        }


        .input-wrapper input::placeholder {

          color: #454b4f;

        }


        /* ==================================================
           PASSWORD
        ================================================== */

        .password-toggle {

          display: flex;

          align-items: center;

          justify-content: center;

          color: #555b5f;

          background: transparent;

          border: none;

          cursor: pointer;

          padding: 3px;

          transition:
            color 0.2s ease;

        }


        .password-toggle:hover {

          color: #e8752a;

        }


        /* ==================================================
           ERROR
        ================================================== */

        .login-error {

          display: flex;

          align-items: center;

          gap: 8px;

          padding:
            11px 12px;

          border:
            1px solid
            rgba(
              239,
              68,
              68,
              0.18
            );

          border-radius: 8px;

          background:
            rgba(
              239,
              68,
              68,
              0.05
            );

          color: #ef8888;

          font-size: 10px;

          line-height: 1.5;

        }


        .login-error span {

          width: 5px;

          height: 5px;

          border-radius: 50%;

          background: #ef6666;

          flex-shrink: 0;

        }


        /* ==================================================
           LOGIN BUTTON
        ================================================== */

        .login-button {

          width: 100%;

          height: 47px;

          display: flex;

          align-items: center;

          justify-content: center;

          gap: 9px;

          border: none;

          border-radius: 8px;

          background: #e8752a;

          color: #0b0d0e;

          font-size: 12px;

          font-weight: 700;

          cursor: pointer;

          transition:
            background 0.2s ease,
            transform 0.2s ease;

        }


        .login-button:hover:not(:disabled) {

          background: #f08a45;

          transform:
            translateY(-1px);

        }


        .login-button:disabled {

          cursor: not-allowed;

          opacity: 0.65;

        }


        /* ==================================================
           LOADING
        ================================================== */

        .loading-spinner {

          width: 15px;

          height: 15px;

          border-radius: 50%;

          border:
            2px solid
            rgba(
              11,
              13,
              14,
              0.25
            );

          border-top-color:
            #0b0d0e;

          animation:
            login-spin
            0.7s
            linear
            infinite;

        }


        @keyframes login-spin {

          to {

            transform:
              rotate(360deg);

          }

        }


        /* ==================================================
           REGISTER
        ================================================== */

        .register-section {

          display: flex;

          align-items: center;

          justify-content: center;

          gap: 5px;

          margin-top: 28px;

          color: #555b5f;

          font-size: 10px;

        }


        .register-section a {

          display: inline-flex;

          align-items: center;

          gap: 4px;

          color: #e8752a;

          text-decoration: none;

          font-weight: 600;

        }


        .register-section a:hover {

          color: #f08a45;

        }


        /* ==================================================
           SECURITY
        ================================================== */

        .login-security {

          display: flex;

          align-items: center;

          justify-content: center;

          gap: 6px;

          padding-top: 22px;

          margin-top: 22px;

          border-top:
            1px solid #25292b;

          color: #444a4e;

          font-size: 8px;

          line-height: 1.5;

          text-align: center;

        }


        .login-security svg {

          color: #565c60;

          flex-shrink: 0;

        }


        /* ==================================================
           TABLET
        ================================================== */

        @media (max-width: 1000px) {

          .login-container {

            grid-template-columns: 1fr;

            max-width: 600px;

            gap: 40px;

            padding:
              35px 25px;

          }


          .login-brand {

            min-height: auto;

            gap: 60px;

          }


          .brand-content {

            margin: 0;

          }


          .brand-content h1 {

            font-size: 4rem;

          }


          .brand-status {

            display: none;

          }

        }


        /* ==================================================
           MOBILE
        ================================================== */

        @media (max-width: 600px) {

          .login-container {

            padding:
              25px 18px;

          }


          .login-brand {

            gap: 40px;

          }


          .brand-content h1 {

            font-size: 3.2rem;

          }


          .brand-content p {

            font-size: 13px;

            margin-top: 22px;

          }


          .login-card {

            padding:
              28px 22px;

            border-radius: 12px;

          }


          .login-logo {

            width: 150px;

            max-height: 65px;

          }


          .login-logo-wrapper {

            margin-bottom: 23px;

          }


          .login-header h2 {

            font-size: 23px;

          }


          .background-line {

            display: none;

          }

        }

      `}</style>

    </div>

  );

};


export default Login;