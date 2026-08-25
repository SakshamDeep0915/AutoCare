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
  ArrowRight,
  ShieldCheck,
  Activity,
  CheckCircle2,
} from "lucide-react";

const Register = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirm, setShowConfirm] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [otp, setOtp] =
    useState("");

  const [otpSent, setOtpSent] =
    useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });


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
  // SUBMIT
  // ==================================================

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


    // ------------------------------
    // VALIDATION
    // ------------------------------

    if (
      !name ||
      !phone ||
      !email ||
      !password ||
      !confirmPassword
    ) {
      setError(
        "Please fill all required fields."
      );
      return;
    }


    if (phone.length !== 10) {
      setError(
        "Phone number must be 10 digits."
      );
      return;
    }


    if (password !== confirmPassword) {
      setError(
        "Passwords do not match."
      );
      return;
    }


    try {
      setLoading(true);


      // ==================================================
      // SEND OTP
      // ==================================================

      if (!otpSent) {

        const res = await sendOTP({
          name,
          phone,
          email,
          password,
        });

        setSuccess(
          res.data.message
        );

        setOtpSent(true);

        return;
      }


      // ==================================================
      // VERIFY OTP
      // ==================================================

      const res = await verifyOTP({
        name,
        phone,
        email,
        password,
        otp,
      });

      setSuccess(
        res.data.message
      );


      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (err) {

      console.error(err);

      setError(
        err.response?.data?.message ||
          "Something went wrong. Please try again."
      );

    } finally {
      setLoading(false);
    }
  };


  // ==================================================
  // PAGE
  // ==================================================

  return (

    <div className="register-page">


      {/* ==================================================
          BACKGROUND
      ================================================== */}

      <div className="register-background">

        <div className="register-line line-one"></div>

        <div className="register-line line-two"></div>

        <div className="register-line line-three"></div>

        <div className="register-glow"></div>

      </div>


      {/* ==================================================
          MAIN CONTAINER
      ================================================== */}

      <main className="register-container">


        {/* ==================================================
            LEFT BRAND PANEL
        ================================================== */}

        <section className="register-brand">


          {/* LOGO */}

          <Link
            to="/"
            className="register-logo"
          >

            <div className="register-logo-icon">

              <Car size={21} />

            </div>

            <div>

              <strong>
                AutoCare <span>AI</span>
              </strong>

              <small>
                Intelligent Vehicle Care
              </small>

            </div>

          </Link>


          {/* BRAND CONTENT */}

          <div className="register-brand-content">

            <div className="register-kicker">

              <span></span>

              START YOUR JOURNEY

            </div>


            <h1>

              Smarter care.
              <br />

              <em>
                Better driving.
              </em>

            </h1>


            <p>

              Create your AutoCare AI account and
              bring your vehicle's maintenance,
              expenses and health information
              into one intelligent workspace.

            </p>


            {/* FEATURES */}

            <div className="register-features">

              <div className="register-feature">

                <div className="feature-icon">
                  <Activity size={16} />
                </div>

                <div>

                  <strong>
                    Vehicle intelligence
                  </strong>

                  <span>
                    Keep track of your vehicle health.
                  </span>

                </div>

              </div>


              <div className="register-feature">

                <div className="feature-icon">
                  <CheckCircle2 size={16} />
                </div>

                <div>

                  <strong>
                    Maintenance tracking
                  </strong>

                  <span>
                    Never lose your service history.
                  </span>

                </div>

              </div>


              <div className="register-feature">

                <div className="feature-icon">
                  <ShieldCheck size={16} />
                </div>

                <div>

                  <strong>
                    Secure account
                  </strong>

                  <span>
                    Verify your email before joining.
                  </span>

                </div>

              </div>

            </div>

          </div>


          {/* SYSTEM STATUS */}

          <div className="register-status">

            <div className="status-icon">

              <ShieldCheck size={17} />

            </div>

            <div>

              <span>
                AUTOCARE SYSTEM
              </span>

              <strong>
                Secure registration
              </strong>

            </div>

            <div className="status-dot"></div>

          </div>

        </section>


        {/* ==================================================
            RIGHT REGISTER PANEL
        ================================================== */}

        <section className="register-panel">


          <div className="register-card">


            {/* ==================================================
                HEADER
            ================================================== */}

            <div className="register-header">

              <div className="register-header-icon">

                {otpSent ? (
                  <ShieldCheck size={21} />
                ) : (
                  <User size={21} />
                )}

              </div>


              <div>

                <span>
                  {otpSent
                    ? "EMAIL VERIFICATION"
                    : "NEW ACCOUNT"}
                </span>

                <h2>

                  {otpSent
                    ? "Verify your email"
                    : "Create account"}

                </h2>

              </div>

            </div>


            <p className="register-subtitle">

              {otpSent
                ? `We've sent a verification code to ${formData.email}.`
                : "Set up your AutoCare AI account in a few simple steps."}

            </p>


            {/* ==================================================
                FORM
            ================================================== */}

            <form
              onSubmit={handleSubmit}
              className="register-form"
            >


              {/* ==================================================
                  BASIC DETAILS
              ================================================== */}

              {!otpSent && (

                <>


                  {/* NAME */}

                  <div className="register-form-group">

                    <label>
                      Full name
                    </label>

                    <div className="register-input-wrapper">

                      <User
                        size={16}
                        className="register-input-icon"
                      />

                      <input
                        type="text"
                        name="name"
                        placeholder="Your full name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />

                    </div>

                  </div>


                  {/* PHONE */}

                  <div className="register-form-group">

                    <label>
                      Phone number
                    </label>

                    <div className="register-input-wrapper">

                      <Phone
                        size={16}
                        className="register-input-icon"
                      />

                      <span className="country-code">
                        +91
                      </span>

                      <input
                        type="tel"
                        name="phone"
                        placeholder="10 digit mobile number"
                        value={formData.phone}
                        onChange={handleChange}
                        maxLength={10}
                        required
                      />

                    </div>

                  </div>


                  {/* EMAIL */}

                  <div className="register-form-group">

                    <label>
                      Email address
                    </label>

                    <div className="register-input-wrapper">

                      <Mail
                        size={16}
                        className="register-input-icon"
                      />

                      <input
                        type="email"
                        name="email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />

                    </div>

                  </div>


                  {/* PASSWORD */}

                  <div className="register-form-group">

                    <label>
                      Password
                    </label>

                    <div className="register-input-wrapper">

                      <Lock
                        size={16}
                        className="register-input-icon"
                      />

                      <input
                        type={
                          showPassword
                            ? "text"
                            : "password"
                        }
                        name="password"
                        placeholder="Create a password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                      />

                      <button
                        type="button"
                        className="register-password-toggle"
                        onClick={() =>
                          setShowPassword(
                            !showPassword
                          )
                        }
                      >

                        {showPassword ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}

                      </button>

                    </div>

                  </div>


                  {/* CONFIRM PASSWORD */}

                  <div className="register-form-group">

                    <label>
                      Confirm password
                    </label>

                    <div className="register-input-wrapper">

                      <Lock
                        size={16}
                        className="register-input-icon"
                      />

                      <input
                        type={
                          showConfirm
                            ? "text"
                            : "password"
                        }
                        name="confirmPassword"
                        placeholder="Repeat your password"
                        value={
                          formData.confirmPassword
                        }
                        onChange={
                          handleChange
                        }
                        required
                      />

                      <button
                        type="button"
                        className="register-password-toggle"
                        onClick={() =>
                          setShowConfirm(
                            !showConfirm
                          )
                        }
                      >

                        {showConfirm ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}

                      </button>

                    </div>

                  </div>

                </>

              )}


              {/* ==================================================
                  OTP
              ================================================== */}

              {otpSent && (

                <div className="otp-section">

                  <div className="otp-heading">

                    <div className="otp-heading-icon">

                      <Mail size={17} />

                    </div>

                    <div>

                      <strong>
                        Enter verification code
                      </strong>

                      <span>
                        Check your inbox for the 6-digit OTP.
                      </span>

                    </div>

                  </div>


                  <input
                    type="text"
                    value={otp}
                    onChange={(e) =>
                      setOtp(
                        e.target.value
                      )
                    }
                    className="otp-input"
                    placeholder="000000"
                    maxLength={6}
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    required
                  />

                </div>

              )}


              {/* ==================================================
                  ERROR
              ================================================== */}

              {error && (

                <div className="register-message error-message">

                  <span></span>

                  {error}

                </div>

              )}


              {/* ==================================================
                  SUCCESS
              ================================================== */}

              {success && (

                <div className="register-message success-message">

                  <CheckCircle2 size={15} />

                  {success}

                </div>

              )}


              {/* ==================================================
                  SUBMIT
              ================================================== */}

              <button
                type="submit"
                disabled={loading}
                className="register-button"
              >

                {loading ? (

                  <>
                    <span className="register-spinner"></span>

                    {otpSent
                      ? "Verifying..."
                      : "Sending OTP..."}
                  </>

                ) : (

                  <>
                    {otpSent
                      ? "Verify & create account"
                      : "Continue"}

                    <ArrowRight
                      size={16}
                    />

                  </>

                )}

              </button>


            </form>


            {/* ==================================================
                LOGIN
            ================================================== */}

            <div className="already-account">

              <span>
                Already have an account?
              </span>

              <Link to="/login">

                Sign in

                <ArrowRight
                  size={13}
                />

              </Link>

            </div>


            {/* ==================================================
                SECURITY
            ================================================== */}

            <div className="register-security">

              <ShieldCheck size={13} />

              <span>
                Email verification helps keep your account secure.
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

        .register-page {
          min-height: 100vh;

          background: #0b0d0e;

          color: #f3f3f3;

          position: relative;

          overflow: hidden;
        }

        .register-page * {
          box-sizing: border-box;
        }


        /* ==================================================
           BACKGROUND
        ================================================== */

        .register-background {
          position: fixed;

          inset: 0;

          pointer-events: none;

          overflow: hidden;
        }

        .register-glow {
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

        .register-line {
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

        .register-container {
          min-height: 100vh;

          max-width: 1280px;

          margin: 0 auto;

          padding: 35px 40px;

          display: grid;

          grid-template-columns:
            1fr 0.85fr;

          align-items: center;

          gap: 100px;

          position: relative;

          z-index: 2;
        }


        /* ==================================================
           BRAND
        ================================================== */

        .register-brand {
          min-height: 700px;

          display: flex;

          flex-direction: column;

          justify-content: space-between;

          padding: 20px 0;
        }

        .register-logo {
          display: inline-flex;

          align-items: center;

          gap: 11px;

          width: fit-content;

          color: white;

          text-decoration: none;
        }

        .register-logo-icon {
          width: 38px;

          height: 38px;

          border: 1px solid #34393c;

          border-radius: 9px;

          display: flex;

          align-items: center;

          justify-content: center;

          color: #e8752a;

          background: #111415;
        }

        .register-logo strong {
          display: block;

          font-size: 14px;

          font-weight: 650;
        }

        .register-logo strong span {
          color: #e8752a;
        }

        .register-logo small {
          display: block;

          color: #555b5f;

          font-size: 8px;

          margin-top: 2px;

          letter-spacing: 0.05em;
        }


        /* ==================================================
           BRAND CONTENT
        ================================================== */

        .register-brand-content {
          max-width: 630px;

          margin-top: auto;

          margin-bottom: auto;
        }

        .register-kicker {
          display: flex;

          align-items: center;

          gap: 10px;

          color: #62686c;

          font-size: 9px;

          font-weight: 700;

          letter-spacing: 0.2em;

          margin-bottom: 22px;
        }

        .register-kicker span {
          width: 25px;

          height: 1px;

          background: #e8752a;
        }

        .register-brand-content h1 {
          margin: 0;

          font-size:
            clamp(
              3.4rem,
              5.7vw,
              5.8rem
            );

          line-height: 0.92;

          letter-spacing: -0.065em;

          font-weight: 650;
        }

        .register-brand-content h1 em {
          color: #e8752a;

          font-style: normal;
        }

        .register-brand-content > p {
          max-width: 500px;

          margin: 28px 0 0;

          color: #676d71;

          font-size: 14px;

          line-height: 1.8;
        }


        /* ==================================================
           FEATURES
        ================================================== */

        .register-features {
          margin-top: 32px;

          display: flex;

          flex-direction: column;

          gap: 13px;
        }

        .register-feature {
          display: flex;

          align-items: center;

          gap: 11px;
        }

        .feature-icon {
          width: 31px;

          height: 31px;

          display: flex;

          align-items: center;

          justify-content: center;

          border-radius: 7px;

          background:
            rgba(
              232,
              117,
              42,
              0.06
            );

          border: 1px solid
            rgba(
              232,
              117,
              42,
              0.12
            );

          color: #e8752a;
        }

        .register-feature strong {
          display: block;

          color: #999fa2;

          font-size: 10px;

          font-weight: 600;
        }

        .register-feature span {
          display: block;

          color: #4d5357;

          font-size: 9px;

          margin-top: 2px;
        }


        /* ==================================================
           STATUS
        ================================================== */

        .register-status {
          display: flex;

          align-items: center;

          gap: 12px;

          width: fit-content;

          padding: 12px 15px;

          border: 1px solid #292e31;

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

          border: 1px solid
            rgba(
              232,
              117,
              42,
              0.13
            );
        }

        .register-status span {
          display: block;

          color: #4e5458;

          font-size: 7px;

          letter-spacing: 0.17em;
        }

        .register-status strong {
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
           REGISTER PANEL
        ================================================== */

        .register-panel {
          display: flex;

          justify-content: center;
        }

        .register-card {
          width: 100%;

          max-width: 450px;

          background: #131617;

          border: 1px solid #2c3033;

          border-radius: 14px;

          padding: 35px 38px;

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
           HEADER
        ================================================== */

        .register-header {
          display: flex;

          align-items: center;

          gap: 13px;
        }

        .register-header-icon {
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

          border: 1px solid
            rgba(
              232,
              117,
              42,
              0.17
            );
        }

        .register-header span {
          display: block;

          color: #62686c;

          font-size: 8px;

          letter-spacing: 0.18em;

          font-weight: 700;
        }

        .register-header h2 {
          margin: 5px 0 0;

          color: #f2f2f2;

          font-size: 25px;

          font-weight: 600;

          letter-spacing: -0.025em;
        }

        .register-subtitle {
          color: #62686c;

          font-size: 11px;

          line-height: 1.6;

          margin: 17px 0 25px;
        }


        /* ==================================================
           FORM
        ================================================== */

        .register-form {
          display: flex;

          flex-direction: column;

          gap: 16px;
        }

        .register-form-group {
          width: 100%;
        }

        .register-form-group label {
          display: block;

          color: #a0a5a8;

          font-size: 10px;

          font-weight: 600;

          margin-bottom: 7px;
        }


        /* ==================================================
           INPUT
        ================================================== */

        .register-input-wrapper {
          height: 44px;

          display: flex;

          align-items: center;

          background: #0f1112;

          border: 1px solid #2b3033;

          border-radius: 8px;

          padding: 0 12px;

          transition:
            border-color 0.2s ease,
            box-shadow 0.2s ease;
        }

        .register-input-wrapper:focus-within {
          border-color: #e8752a;

          box-shadow:
            0 0 0 3px
            rgba(
              232,
              117,
              42,
              0.07
            );
        }

        .register-input-icon {
          color: #53595d;

          flex-shrink: 0;

          margin-right: 9px;
        }

        .register-input-wrapper input {
          width: 100%;

          height: 100%;

          background: transparent;

          border: none;

          outline: none;

          color: #e8e8e8;

          font-size: 11px;
        }

        .register-input-wrapper input::placeholder {
          color: #454b4f;
        }

        .country-code {
          color: #62686c;

          font-size: 10px;

          padding-right: 8px;

          margin-right: 8px;

          border-right: 1px solid #292d30;
        }


        /* ==================================================
           PASSWORD TOGGLE
        ================================================== */

        .register-password-toggle {
          display: flex;

          align-items: center;

          justify-content: center;

          color: #555b5f;

          background: transparent;

          border: none;

          cursor: pointer;

          padding: 3px;
        }

        .register-password-toggle:hover {
          color: #e8752a;
        }


        /* ==================================================
           OTP
        ================================================== */

        .otp-section {
          padding: 17px;

          border: 1px solid
            rgba(
              232,
              117,
              42,
              0.16
            );

          background:
            rgba(
              232,
              117,
              42,
              0.035
            );

          border-radius: 10px;
        }

        .otp-heading {
          display: flex;

          align-items: center;

          gap: 10px;

          margin-bottom: 13px;
        }

        .otp-heading-icon {
          width: 32px;

          height: 32px;

          display: flex;

          align-items: center;

          justify-content: center;

          border-radius: 7px;

          background:
            rgba(
              232,
              117,
              42,
              0.08
            );

          color: #e8752a;
        }

        .otp-heading strong {
          display: block;

          color: #b4b8ba;

          font-size: 10px;

          font-weight: 600;
        }

        .otp-heading span {
          display: block;

          color: #555b5f;

          font-size: 8px;

          margin-top: 2px;
        }

        .otp-input {
          width: 100%;

          height: 48px;

          background: #0f1112;

          border: 1px solid #34393c;

          border-radius: 8px;

          outline: none;

          color: #f1f1f1;

          text-align: center;

          letter-spacing: 0.45em;

          font-size: 18px;

          font-weight: 600;

          padding-left: 0.45em;

          transition:
            border-color 0.2s ease,
            box-shadow 0.2s ease;
        }

        .otp-input:focus {
          border-color: #e8752a;

          box-shadow:
            0 0 0 3px
            rgba(
              232,
              117,
              42,
              0.07
            );
        }

        .otp-input::placeholder {
          color: #383d40;
        }


        /* ==================================================
           MESSAGES
        ================================================== */

        .register-message {
          display: flex;

          align-items: center;

          justify-content: center;

          gap: 7px;

          padding: 10px 12px;

          border-radius: 8px;

          font-size: 9px;

          line-height: 1.5;

          text-align: center;
        }

        .error-message {
          background:
            rgba(
              239,
              68,
              68,
              0.05
            );

          border: 1px solid
            rgba(
              239,
              68,
              68,
              0.17
            );

          color: #ef8888;
        }

        .error-message > span {
          width: 5px;

          height: 5px;

          border-radius: 50%;

          background: #ef6666;

          flex-shrink: 0;
        }

        .success-message {
          background:
            rgba(
              232,
              117,
              42,
              0.05
            );

          border: 1px solid
            rgba(
              232,
              117,
              42,
              0.16
            );

          color: #d39168;
        }

        .success-message svg {
          color: #e8752a;
          flex-shrink: 0;
        }


        /* ==================================================
           BUTTON
        ================================================== */

        .register-button {
          width: 100%;

          height: 46px;

          display: flex;

          align-items: center;

          justify-content: center;

          gap: 8px;

          border: none;

          border-radius: 8px;

          background: #e8752a;

          color: #0b0d0e;

          font-size: 11px;

          font-weight: 700;

          cursor: pointer;

          transition:
            background 0.2s ease,
            transform 0.2s ease;
        }

        .register-button:hover:not(:disabled) {
          background: #f08a45;

          transform: translateY(-1px);
        }

        .register-button:disabled {
          cursor: not-allowed;

          opacity: 0.65;
        }


        /* ==================================================
           SPINNER
        ================================================== */

        .register-spinner {
          width: 14px;

          height: 14px;

          border-radius: 50%;

          border: 2px solid
            rgba(
              11,
              13,
              14,
              0.25
            );

          border-top-color: #0b0d0e;

          animation:
            register-spin 0.7s linear infinite;
        }

        @keyframes register-spin {

          to {
            transform:
              rotate(360deg);
          }

        }


        /* ==================================================
           LOGIN
        ================================================== */

        .already-account {
          display: flex;

          align-items: center;

          justify-content: center;

          gap: 5px;

          margin-top: 22px;

          color: #555b5f;

          font-size: 9px;
        }

        .already-account a {
          display: inline-flex;

          align-items: center;

          gap: 4px;

          color: #e8752a;

          text-decoration: none;

          font-weight: 600;
        }

        .already-account a:hover {
          color: #f08a45;
        }


        /* ==================================================
           SECURITY
        ================================================== */

        .register-security {
          display: flex;

          align-items: center;

          justify-content: center;

          gap: 6px;

          padding-top: 18px;

          margin-top: 18px;

          border-top: 1px solid #25292b;

          color: #444a4e;

          font-size: 8px;

          text-align: center;

          line-height: 1.5;
        }

        .register-security svg {
          color: #565c60;

          flex-shrink: 0;
        }


        /* ==================================================
           TABLET
        ================================================== */

        @media (max-width: 1000px) {

          .register-container {
            grid-template-columns: 1fr;

            max-width: 600px;

            gap: 40px;

            padding: 35px 25px;
          }

          .register-brand {
            min-height: auto;

            gap: 45px;
          }

          .register-brand-content {
            margin: 0;
          }

          .register-brand-content h1 {
            font-size: 4rem;
          }

          .register-status {
            display: none;
          }

        }


        /* ==================================================
           MOBILE
        ================================================== */

        @media (max-width: 600px) {

          .register-container {
            padding: 25px 18px;
          }

          .register-brand {
            gap: 35px;
          }

          .register-brand-content h1 {
            font-size: 3rem;
          }

          .register-brand-content > p {
            font-size: 12px;
          }

          .register-features {
            display: none;
          }

          .register-card {
            padding: 28px 22px;

            border-radius: 12px;
          }

          .register-header h2 {
            font-size: 23px;
          }

          .register-line {
            display: none;
          }

        }

      `}</style>

    </div>
  );
};

export default Register;