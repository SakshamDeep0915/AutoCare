import {
  ArrowRight,
  Bot,
  Car,
  CheckCircle2,
  Gauge,
  MapPin,
  ShieldCheck,
  Sparkles,
  Wrench,
} from "lucide-react";

import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const Landing = () => {
  return (
    <div className="landing-page">

      {/* ==================================================
          ANIMATED BACKGROUND
      ================================================== */}

      <div className="landing-background">

        <div className="background-grid"></div>

        <div className="glow glow-one"></div>
        <div className="glow glow-two"></div>

        <div className="floating-particle particle-one"></div>
        <div className="floating-particle particle-two"></div>
        <div className="floating-particle particle-three"></div>
        <div className="floating-particle particle-four"></div>

      </div>


      {/* ==================================================
          NAVBAR
      ================================================== */}

      <Navbar />


      {/* ==================================================
          HERO
      ================================================== */}

      <main>

        <section id="home" className="landing-hero">

          <div className="hero-content">

            <div className="hero-badge">
              <Sparkles size={16} />
              AI-POWERED VEHICLE INTELLIGENCE
            </div>

            <h1 className="hero-title">

              Smarter Care.

              <span>
                Better Drives.
              </span>

            </h1>

            <p className="hero-description">
              AutoCare AI brings intelligent vehicle diagnostics,
              maintenance tracking and personalized insights into
              one powerful platform.
            </p>

            <div className="hero-actions">

              <Link to="/dashboard" className="hero-primary-btn">
                Explore Dashboard
                <ArrowRight size={19} />
              </Link>

              <a href="#features" className="hero-secondary-btn">
                Discover Features
              </a>

            </div>

            <div className="hero-trust">

              <div>
                <CheckCircle2 size={17} />
                Smart Diagnostics
              </div>

              <div>
                <CheckCircle2 size={17} />
                Maintenance Tracking
              </div>

              <div>
                <CheckCircle2 size={17} />
                AI Assistance
              </div>

            </div>

          </div>


          {/* ==================================================
              VEHICLE VISUAL
          ================================================== */}

          <div className="hero-visual">

            <div className="vehicle-orbit orbit-one"></div>
            <div className="vehicle-orbit orbit-two"></div>

            <div className="vehicle-glow"></div>

            <div className="vehicle-card">

              <div className="vehicle-card-top">

                <span>
                  VEHICLE STATUS
                </span>

                <div className="status-online">
                  <span></span>
                  HEALTHY
                </div>

              </div>

              <div className="vehicle-icon">

                <Car size={125} strokeWidth={1} />

              </div>

              <div className="vehicle-name">
                Your Vehicle
              </div>

              <div className="vehicle-stats">

                <div>
                  <Gauge size={18} />

                  <span>
                    Engine
                  </span>

                  <strong>
                    98%
                  </strong>
                </div>

                <div>
                  <Wrench size={18} />

                  <span>
                    Service
                  </span>

                  <strong>
                    Good
                  </strong>
                </div>

                <div>
                  <ShieldCheck size={18} />

                  <span>
                    Safety
                  </span>

                  <strong>
                    96%
                  </strong>
                </div>

              </div>

            </div>

            <div className="floating-info info-one">
              <Bot size={19} />
              AI Diagnostics
            </div>

            <div className="floating-info info-two">
              <MapPin size={19} />
              Nearby Services
            </div>

          </div>

        </section>


        {/* ==================================================
            FEATURES
        ================================================== */}

        <section id="features" className="landing-section">

          <div className="section-heading">

            <span>
              POWERFUL FEATURES
            </span>

            <h2>
              Everything Your Vehicle Needs.
            </h2>

            <p>
              One intelligent platform to understand, maintain
              and improve your vehicle.
            </p>

          </div>


          <div className="feature-grid">

            <div className="feature-card">

              <div className="feature-icon">
                <Bot />
              </div>

              <h3>
                AI Diagnostics
              </h3>

              <p>
                Get intelligent vehicle health insights and
                understand potential problems before they become
                expensive repairs.
              </p>

              <span className="feature-number">
                01
              </span>

            </div>


            <div className="feature-card">

              <div className="feature-icon">
                <Wrench />
              </div>

              <h3>
                Service Management
              </h3>

              <p>
                Track maintenance, service history and upcoming
                work for every vehicle you own.
              </p>

              <span className="feature-number">
                02
              </span>

            </div>


            <div className="feature-card">

              <div className="feature-icon">
                <Gauge />
              </div>

              <h3>
                Vehicle Health
              </h3>

              <p>
                Monitor your vehicle through an easy-to-understand
                health score and detailed statistics.
              </p>

              <span className="feature-number">
                03
              </span>

            </div>


            <div className="feature-card">

              <div className="feature-icon">
                <MapPin />
              </div>

              <h3>
                Nearby Services
              </h3>

              <p>
                Find useful automotive services around you when
                your vehicle needs attention.
              </p>

              <span className="feature-number">
                04
              </span>

            </div>

          </div>

        </section>


        {/* ==================================================
            HOW IT WORKS
        ================================================== */}

        <section id="how-it-works" className="landing-section process-section">

          <div className="section-heading">

            <span>
              HOW IT WORKS
            </span>

            <h2>
              Your Vehicle. One Intelligent System.
            </h2>

          </div>


          <div className="process-grid">

            <div className="process-step">

              <div className="process-number">
                01
              </div>

              <h3>
                Add Your Vehicle
              </h3>

              <p>
                Add your vehicle details and create its digital
                profile inside AutoCare AI.
              </p>

            </div>


            <div className="process-line"></div>


            <div className="process-step">

              <div className="process-number">
                02
              </div>

              <h3>
                Track Everything
              </h3>

              <p>
                Record services, fuel, expenses and maintenance
                history in one place.
              </p>

            </div>


            <div className="process-line"></div>


            <div className="process-step">

              <div className="process-number">
                03
              </div>

              <h3>
                Get AI Insights
              </h3>

              <p>
                Use AI-powered reports and assistance to better
                understand your vehicle.
              </p>

            </div>

          </div>

        </section>


        {/* ==================================================
            SERVICES
        ================================================== */}

        <section id="services" className="landing-section services-section">

          <div className="services-content">

            <div>

              <span className="section-label">
                BUILT FOR MODERN DRIVERS
              </span>

              <h2>
                Take Control Of Your
                <span> Vehicle's Future.</span>
              </h2>

              <p>
                AutoCare AI transforms scattered vehicle information
                into a simple, intelligent experience.
              </p>

              <Link to="/dashboard" className="services-btn">
                Start Using AutoCare AI
                <ArrowRight size={18} />
              </Link>

            </div>


            <div className="services-list">

              <div>
                <CheckCircle2 />
                <span>Vehicle management</span>
              </div>

              <div>
                <CheckCircle2 />
                <span>Maintenance history</span>
              </div>

              <div>
                <CheckCircle2 />
                <span>Fuel tracking</span>
              </div>

              <div>
                <CheckCircle2 />
                <span>Expense reports</span>
              </div>

              <div>
                <CheckCircle2 />
                <span>AI vehicle reports</span>
              </div>

              <div>
                <CheckCircle2 />
                <span>Automotive chatbot</span>
              </div>

            </div>

          </div>

        </section>


        {/* ==================================================
            ABOUT
        ================================================== */}

        <section id="about" className="landing-section about-section">

          <div className="about-card">

            <div className="about-icon">
              <Car size={38} />
            </div>

            <span>
              ABOUT AUTOCARE AI
            </span>

            <h2>
              Technology For
              <span> Better Vehicle Care.</span>
            </h2>

            <p>
              AutoCare AI is designed to make vehicle ownership
              simpler by combining vehicle management, maintenance
              tracking, intelligent diagnostics and AI assistance
              into one modern platform.
            </p>

          </div>

        </section>

      </main>


      {/* ==================================================
          FOOTER
      ================================================== */}

      <footer className="landing-footer">

        <div className="footer-logo">

          <div className="landing-logo-icon">
            <Car size={22} />
          </div>

          <div>
            <strong>
              AutoCare <span>AI</span>
            </strong>

            <small>
              Intelligent Vehicle Care
            </small>
          </div>

        </div>

        <p>
          Smarter Care. Better Drives.
        </p>

        <div className="footer-copy">
          © {new Date().getFullYear()} AutoCare AI. All rights reserved.
        </div>

      </footer>

    </div>
  );
};

export default Landing;