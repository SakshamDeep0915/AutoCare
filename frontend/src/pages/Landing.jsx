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
  Fuel,
  BarChart3,
  Activity,
  ChevronRight,
} from "lucide-react";

import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const Landing = () => {
  return (
    <div className="landing-page">

      {/* ==================================================
          NAVBAR
      ================================================== */}

      <Navbar />

      {/* ==================================================
          MAIN
      ================================================== */}

      <main>

        {/* ==================================================
            HERO
        ================================================== */}

        <section
          id="home"
          className="landing-hero"
        >

          <div className="hero-content">

            <div className="hero-eyebrow">

              <span className="eyebrow-line"></span>

              <span>
                VEHICLE INTELLIGENCE PLATFORM
              </span>

            </div>

            <h1 className="hero-title">

              Your car.
              <br />

              <span>
                Understood.
              </span>

            </h1>

            <p className="hero-description">

              AutoCare AI brings your vehicle's maintenance,
              fuel, expenses and health information into one
              intelligent system — so you always know what's
              happening under the hood.

            </p>

            <div className="hero-actions">

              <Link
                to="/dashboard"
                className="hero-primary-btn"
              >
                Open Dashboard

                <ArrowRight size={18} />

              </Link>

              <a
                href="#features"
                className="hero-secondary-btn"
              >
                See how it works

                <ChevronRight size={17} />

              </a>

            </div>

            {/* TRUST */}

            <div className="hero-trust">

              <div>
                <CheckCircle2 size={15} />
                Smart diagnostics
              </div>

              <div>
                <CheckCircle2 size={15} />
                Service history
              </div>

              <div>
                <CheckCircle2 size={15} />
                AI assistance
              </div>

            </div>

          </div>


          {/* ==================================================
              PRODUCT VISUAL
          ================================================== */}

          <div className="hero-visual">

            <div className="dashboard-window">

              {/* WINDOW HEADER */}

              <div className="window-header">

                <div className="window-controls">

                  <span></span>
                  <span></span>
                  <span></span>

                </div>

                <span className="window-title">
                  AUTOCARE AI / VEHICLE
                </span>

                <span className="window-status">
                  LIVE
                </span>

              </div>


              {/* VEHICLE HEADER */}

              <div className="vehicle-panel-header">

                <div>

                  <span className="panel-label">
                    CURRENT VEHICLE
                  </span>

                  <h3>
                    Your Vehicle
                  </h3>

                  <p>
                    Connected maintenance profile
                  </p>

                </div>

                <div className="vehicle-status">

                  <span></span>

                  HEALTHY

                </div>

              </div>


              {/* HEALTH SCORE */}

              <div className="health-section">

                <div className="health-ring">

                  <div className="health-ring-inner">

                    <strong>
                      94
                    </strong>

                    <span>
                      HEALTH
                    </span>

                  </div>

                </div>

                <div className="health-info">

                  <span className="panel-label">
                    VEHICLE HEALTH
                  </span>

                  <h4>
                    Everything looks good.
                  </h4>

                  <p>
                    No immediate maintenance concerns
                    detected from your current records.
                  </p>

                  <div className="health-progress">

                    <span></span>

                  </div>

                </div>

              </div>


              {/* STATS */}

              <div className="vehicle-stats">

                <DashboardStat
                  icon={<Gauge />}
                  label="Engine"
                  value="98%"
                />

                <DashboardStat
                  icon={<Wrench />}
                  label="Service"
                  value="Good"
                />

                <DashboardStat
                  icon={<Fuel />}
                  label="Fuel"
                  value="8.4 L"
                />

              </div>


              {/* ACTIVITY */}

              <div className="mini-activity">

                <div className="activity-heading">

                  <span>
                    RECENT ACTIVITY
                  </span>

                  <span>
                    VIEW ALL
                  </span>

                </div>

                <div className="activity-row">

                  <div className="activity-icon">
                    <Wrench size={14} />
                  </div>

                  <div>
                    <strong>
                      Service record updated
                    </strong>

                    <small>
                      Maintenance history
                    </small>
                  </div>

                  <span>
                    2d
                  </span>

                </div>

              </div>

            </div>


            {/* AI TAG */}

            <div className="hero-floating-card ai-card">

              <div className="floating-icon">
                <Bot size={17} />
              </div>

              <div>

                <span>
                  AI INSIGHT
                </span>

                <strong>
                  Maintenance looks healthy
                </strong>

              </div>

            </div>


            {/* LOCATION TAG */}

            <div className="hero-floating-card location-card">

              <MapPin size={16} />

              <div>

                <span>
                  SERVICE NETWORK
                </span>

                <strong>
                  Nearby workshops
                </strong>

              </div>

            </div>

          </div>

        </section>


        {/* ==================================================
            PRODUCT STRIP
        ================================================== */}

        <section className="product-strip">

          <div>

            <Activity size={17} />

            <span>
              VEHICLE HEALTH
            </span>

          </div>

          <div>

            <Wrench size={17} />

            <span>
              MAINTENANCE
            </span>

          </div>

          <div>

            <Fuel size={17} />

            <span>
              FUEL TRACKING
            </span>

          </div>

          <div>

            <BarChart3 size={17} />

            <span>
              EXPENSE ANALYTICS
            </span>

          </div>

          <div>

            <Bot size={17} />

            <span>
              AI ASSISTANCE
            </span>

          </div>

        </section>


        {/* ==================================================
            FEATURES
        ================================================== */}

        <section
          id="features"
          className="landing-section"
        >

          <div className="section-heading">

            <div className="section-kicker">

              <span></span>

              THE PLATFORM

            </div>

            <h2>
              Everything your vehicle
              <br />
              needs. <em>One place.</em>
            </h2>

            <p>
              Built to make vehicle ownership easier,
              more transparent and more intelligent.
            </p>

          </div>


          <div className="feature-grid">

            <FeatureCard
              number="01"
              icon={<Bot />}
              title="AI Diagnostics"
              description="Understand potential vehicle problems with intelligent explanations instead of confusing technical terminology."
              large
            />

            <FeatureCard
              number="02"
              icon={<Wrench />}
              title="Maintenance"
              description="Keep every service, repair and maintenance record organized in one timeline."
            />

            <FeatureCard
              number="03"
              icon={<Fuel />}
              title="Fuel Tracking"
              description="Track fuel purchases, costs, consumption and efficiency over time."
            />

            <FeatureCard
              number="04"
              icon={<BarChart3 />}
              title="Expense Analytics"
              description="See where your vehicle money is going with clear expense reports."
            />

            <FeatureCard
              number="05"
              icon={<Gauge />}
              title="Vehicle Health"
              description="Get a simple view of your vehicle's overall condition."
            />

            <FeatureCard
              number="06"
              icon={<MapPin />}
              title="Nearby Services"
              description="Find useful automotive services when your vehicle needs attention."
            />

          </div>

        </section>


        {/* ==================================================
            HOW IT WORKS
        ================================================== */}

        <section
          id="how-it-works"
          className="landing-section workflow-section"
        >

          <div className="workflow-header">

            <div>

              <div className="section-kicker">

                <span></span>

                SIMPLE BY DESIGN

              </div>

              <h2>
                From vehicle data
                <br />
                to <em>better decisions.</em>
              </h2>

            </div>

            <p>
              AutoCare AI turns everyday vehicle records
              into information you can actually use.
            </p>

          </div>


          <div className="workflow">

            <WorkflowStep
              number="01"
              title="Build your profile"
              text="Add your vehicle details and create its digital profile."
            />

            <WorkflowConnector />

            <WorkflowStep
              number="02"
              title="Track your car"
              text="Record fuel, services, expenses and maintenance history."
            />

            <WorkflowConnector />

            <WorkflowStep
              number="03"
              title="Get insights"
              text="Use AI-powered reports to understand your vehicle better."
            />

          </div>

        </section>


        {/* ==================================================
            SERVICES / CTA
        ================================================== */}

        <section
          id="services"
          className="services-section"
        >

          <div className="services-inner">

            <div className="services-copy">

              <div className="section-kicker">

                <span></span>

                BUILT FOR DRIVERS

              </div>

              <h2>
                Know your car.
                <br />
                <em>Before it tells you.</em>
              </h2>

              <p>
                From routine maintenance to unexpected
                problems, AutoCare AI gives you a clearer
                picture of your vehicle's future.
              </p>

              <Link
                to="/dashboard"
                className="services-btn"
              >

                Start with your vehicle

                <ArrowRight size={18} />

              </Link>

            </div>


            <div className="services-list">

              <ServiceItem text="Vehicle management" />
              <ServiceItem text="Maintenance history" />
              <ServiceItem text="Fuel tracking" />
              <ServiceItem text="Expense reports" />
              <ServiceItem text="AI vehicle reports" />
              <ServiceItem text="Automotive chatbot" />

            </div>

          </div>

        </section>


        {/* ==================================================
            ABOUT
        ================================================== */}

        <section
          id="about"
          className="landing-section about-section"
        >

          <div className="about-layout">

            <div className="about-number">
              06
            </div>

            <div className="about-content">

              <div className="section-kicker">

                <span></span>

                ABOUT AUTOCARE AI

              </div>

              <h2>
                Technology for
                <br />
                <em>better vehicle care.</em>
              </h2>

              <p>
                AutoCare AI is a smart vehicle maintenance
                and diagnostic platform designed to make
                vehicle ownership simpler.
              </p>

              <p>
                Instead of keeping service records,
                fuel expenses and vehicle information
                scattered across different places,
                everything lives inside one connected
                system.
              </p>

            </div>

            <div className="about-mark">

              <Car size={44} />

              <span>
                AUTOCARE
              </span>

              <strong>
                AI
              </strong>

            </div>

          </div>

        </section>

      </main>


      {/* ==================================================
          FOOTER
      ================================================== */}

      <footer className="landing-footer">

        <div className="footer-main">

          <div className="footer-brand">

            <div className="landing-logo-icon">

              <Car size={20} />

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

        </div>

        <div className="footer-bottom">

          <span>
            © {new Date().getFullYear()} AutoCare AI
          </span>

          <span>
            Built for better vehicle ownership.
          </span>

        </div>

      </footer>


      {/* ==================================================
          STYLES
      ================================================== */}

      <style>{`

        /* ==================================================
           GLOBAL
        ================================================== */

        .landing-page {
          min-height: 100vh;
          background: #0b0d0e;
          color: #f3f3f3;
          overflow-x: hidden;
        }

        .landing-page * {
          box-sizing: border-box;
        }

        /* ==================================================
           HERO
        ================================================== */

        .landing-hero {
          max-width: 1280px;
          margin: 0 auto;
          min-height: 760px;
          padding: 100px 40px 100px;
          display: grid;
          grid-template-columns: 0.9fr 1.1fr;
          align-items: center;
          gap: 60px;
          position: relative;
        }

        .landing-hero::before {
          content: "";
          position: absolute;
          width: 700px;
          height: 500px;
          right: -180px;
          top: 60px;
          background: radial-gradient(
            circle,
            rgba(234, 112, 35, 0.07),
            transparent 68%
          );
          pointer-events: none;
        }

        .hero-content {
          position: relative;
          z-index: 2;
        }

        .hero-eyebrow {
          display: flex;
          align-items: center;
          gap: 12px;
          color: #73797d;
          font-size: 10px;
          letter-spacing: 0.22em;
          font-weight: 700;
          margin-bottom: 26px;
        }

        .eyebrow-line {
          width: 30px;
          height: 1px;
          background: #e8752a;
        }

        .hero-title {
          margin: 0;
          font-size: clamp(4rem, 6vw, 6.8rem);
          line-height: 0.92;
          letter-spacing: -0.065em;
          font-weight: 650;
        }

        .hero-title span {
          color: #e8752a;
        }

        .hero-description {
          max-width: 540px;
          color: #777d81;
          font-size: 16px;
          line-height: 1.8;
          margin: 34px 0 30px;
        }

        .hero-actions {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .hero-primary-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 14px 20px;
          border-radius: 8px;
          background: #e8752a;
          color: #0d0f10;
          font-size: 13px;
          font-weight: 700;
          text-decoration: none;
          transition: 0.2s ease;
        }

        .hero-primary-btn:hover {
          background: #f08a45;
          transform: translateY(-2px);
        }

        .hero-secondary-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 13px 16px;
          color: #8b9195;
          font-size: 13px;
          text-decoration: none;
          border: 1px solid #282c2f;
          border-radius: 8px;
          transition: 0.2s ease;
        }

        .hero-secondary-btn:hover {
          color: #f0f0f0;
          border-color: #464b4f;
        }

        .hero-trust {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          margin-top: 34px;
        }

        .hero-trust div {
          display: flex;
          align-items: center;
          gap: 7px;
          color: #555b5f;
          font-size: 11px;
        }

        .hero-trust svg {
          color: #e8752a;
        }

        /* ==================================================
           HERO PRODUCT WINDOW
        ================================================== */

        .hero-visual {
          min-height: 560px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .dashboard-window {
          width: min(100%, 570px);
          background: #131617;
          border: 1px solid #2b2f32;
          border-radius: 16px;
          box-shadow:
            0 30px 80px rgba(0, 0, 0, 0.45);
          overflow: hidden;
          position: relative;
          z-index: 2;
        }

        .window-header {
          height: 43px;
          padding: 0 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid #282c2f;
          background: #101213;
        }

        .window-controls {
          display: flex;
          gap: 5px;
        }

        .window-controls span {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #3b4044;
        }

        .window-title {
          font-size: 8px;
          letter-spacing: 0.18em;
          color: #53595d;
        }

        .window-status {
          font-size: 8px;
          letter-spacing: 0.14em;
          color: #e8752a;
        }

        .vehicle-panel-header {
          padding: 28px 28px 20px;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 20px;
        }

        .panel-label {
          display: block;
          font-size: 8px;
          letter-spacing: 0.2em;
          color: #555b5f;
          font-weight: 700;
        }

        .vehicle-panel-header h3 {
          margin: 8px 0 3px;
          font-size: 22px;
          font-weight: 600;
        }

        .vehicle-panel-header p {
          margin: 0;
          color: #555b5f;
          font-size: 11px;
        }

        .vehicle-status {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 7px 10px;
          border: 1px solid rgba(232, 117, 42, 0.18);
          background: rgba(232, 117, 42, 0.05);
          color: #e8752a;
          font-size: 8px;
          letter-spacing: 0.13em;
          border-radius: 6px;
        }

        .vehicle-status span {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #e8752a;
          box-shadow: 0 0 8px rgba(232, 117, 42, 0.7);
        }

        /* ==================================================
           HEALTH
        ================================================== */

        .health-section {
          margin: 0 28px;
          padding: 24px;
          border: 1px solid #292d30;
          background: #101213;
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 25px;
        }

        .health-ring {
          width: 110px;
          height: 110px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background:
            conic-gradient(
              #e8752a 0deg 338deg,
              #292d30 338deg 360deg
            );
          flex-shrink: 0;
        }

        .health-ring-inner {
          width: 88px;
          height: 88px;
          border-radius: 50%;
          background: #101213;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .health-ring-inner strong {
          font-size: 30px;
          line-height: 1;
        }

        .health-ring-inner span {
          font-size: 7px;
          color: #62686c;
          letter-spacing: 0.15em;
          margin-top: 5px;
        }

        .health-info {
          flex: 1;
        }

        .health-info h4 {
          margin: 7px 0 5px;
          font-size: 15px;
          font-weight: 600;
        }

        .health-info p {
          margin: 0;
          color: #5c6266;
          font-size: 10px;
          line-height: 1.6;
          max-width: 260px;
        }

        .health-progress {
          height: 3px;
          background: #272b2e;
          margin-top: 14px;
          border-radius: 5px;
          overflow: hidden;
        }

        .health-progress span {
          display: block;
          width: 94%;
          height: 100%;
          background: #e8752a;
        }

        /* ==================================================
           STATS
        ================================================== */

        .vehicle-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          padding: 18px 28px;
        }

        .dashboard-stat {
          border: 1px solid #282c2f;
          background: #101213;
          border-radius: 10px;
          padding: 15px;
        }

        .dashboard-stat svg {
          width: 16px;
          height: 16px;
          color: #e8752a;
          margin-bottom: 10px;
        }

        .dashboard-stat span {
          display: block;
          font-size: 9px;
          color: #555b5f;
        }

        .dashboard-stat strong {
          display: block;
          margin-top: 4px;
          font-size: 13px;
          font-weight: 600;
          color: #c8cccf;
        }

        /* ==================================================
           ACTIVITY
        ================================================== */

        .mini-activity {
          margin: 0 28px 28px;
          border-top: 1px solid #282c2f;
          padding-top: 18px;
        }

        .activity-heading {
          display: flex;
          justify-content: space-between;
          margin-bottom: 12px;
          font-size: 8px;
          letter-spacing: 0.16em;
          color: #555b5f;
        }

        .activity-row {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .activity-icon {
          width: 28px;
          height: 28px;
          border-radius: 7px;
          background: rgba(232, 117, 42, 0.08);
          border: 1px solid rgba(232, 117, 42, 0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #e8752a;
        }

        .activity-row div:nth-child(2) {
          flex: 1;
        }

        .activity-row strong {
          display: block;
          font-size: 10px;
          font-weight: 500;
          color: #a1a6a9;
        }

        .activity-row small {
          display: block;
          color: #555b5f;
          font-size: 8px;
          margin-top: 3px;
        }

        .activity-row > span {
          color: #555b5f;
          font-size: 9px;
        }

        /* ==================================================
           FLOATING CARDS
        ================================================== */

        .hero-floating-card {
          position: absolute;
          z-index: 4;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 11px 13px;
          background: #171a1b;
          border: 1px solid #303538;
          border-radius: 9px;
          box-shadow: 0 18px 40px rgba(0,0,0,0.35);
        }

        .hero-floating-card svg {
          color: #e8752a;
          flex-shrink: 0;
        }

        .hero-floating-card span {
          display: block;
          color: #555b5f;
          font-size: 7px;
          letter-spacing: 0.14em;
        }

        .hero-floating-card strong {
          display: block;
          color: #c3c7c9;
          font-size: 10px;
          font-weight: 500;
          margin-top: 3px;
        }

        .floating-icon {
          width: 28px;
          height: 28px;
          border-radius: 7px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(232,117,42,0.08);
        }

        .ai-card {
          top: 90px;
          left: -35px;
        }

        .location-card {
          right: -35px;
          bottom: 80px;
        }

        /* ==================================================
           PRODUCT STRIP
        ================================================== */

        .product-strip {
          max-width: 1280px;
          margin: 0 auto;
          padding: 18px 40px;
          border-top: 1px solid #222628;
          border-bottom: 1px solid #222628;
          display: grid;
          grid-template-columns: repeat(5, 1fr);
        }

        .product-strip div {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          border-right: 1px solid #222628;
          color: #50565a;
          font-size: 9px;
          letter-spacing: 0.14em;
        }

        .product-strip div:last-child {
          border-right: none;
        }

        .product-strip svg {
          width: 14px;
          height: 14px;
          color: #e8752a;
        }

        /* ==================================================
           SECTIONS
        ================================================== */

        .landing-section {
          max-width: 1280px;
          margin: 0 auto;
          padding: 130px 40px;
        }

        .section-heading {
          max-width: 700px;
          margin-bottom: 60px;
        }

        .section-kicker {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #646a6e;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.2em;
          margin-bottom: 20px;
        }

        .section-kicker span {
          width: 24px;
          height: 1px;
          background: #e8752a;
        }

        .section-heading h2,
        .workflow-header h2,
        .services-copy h2,
        .about-content h2 {
          margin: 0;
          font-size: clamp(2.5rem, 4vw, 4.2rem);
          line-height: 1;
          letter-spacing: -0.045em;
          font-weight: 600;
        }

        .section-heading h2 em,
        .workflow-header h2 em,
        .services-copy h2 em,
        .about-content h2 em {
          color: #e8752a;
          font-style: normal;
        }

        .section-heading p {
          margin-top: 18px;
          color: #646a6e;
          font-size: 14px;
          line-height: 1.7;
        }

        /* ==================================================
           FEATURES
        ================================================== */

        .feature-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          border-top: 1px solid #292d30;
          border-left: 1px solid #292d30;
        }

        .feature-card {
          min-height: 260px;
          padding: 30px;
          border-right: 1px solid #292d30;
          border-bottom: 1px solid #292d30;
          position: relative;
          transition: 0.25s ease;
        }

        .feature-card:hover {
          background: #101213;
        }

        .feature-card:hover .feature-icon {
          border-color: rgba(232,117,42,0.35);
          color: #e8752a;
        }

        .feature-card.large {
          grid-column: span 2;
        }

        .feature-icon {
          width: 42px;
          height: 42px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #303438;
          border-radius: 9px;
          color: #71777b;
          transition: 0.25s ease;
        }

        .feature-icon svg {
          width: 19px;
        }

        .feature-card h3 {
          margin: 26px 0 10px;
          font-size: 19px;
          font-weight: 600;
        }

        .feature-card p {
          max-width: 420px;
          margin: 0;
          color: #60666a;
          font-size: 12px;
          line-height: 1.7;
        }

        .feature-number {
          position: absolute;
          right: 28px;
          top: 28px;
          color: #303538;
          font-size: 10px;
          letter-spacing: 0.12em;
        }

        /* ==================================================
           WORKFLOW
        ================================================== */

        .workflow-section {
          border-top: 1px solid #222628;
        }

        .workflow-header {
          display: grid;
          grid-template-columns: 1fr 0.7fr;
          gap: 80px;
          align-items: end;
          margin-bottom: 70px;
        }

        .workflow-header p {
          margin: 0;
          color: #62686c;
          font-size: 14px;
          line-height: 1.8;
          max-width: 360px;
        }

        .workflow {
          display: grid;
          grid-template-columns: 1fr auto 1fr auto 1fr;
          align-items: center;
        }

        .process-step {
          max-width: 280px;
        }

        .process-number {
          width: 42px;
          height: 42px;
          border: 1px solid #303438;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #e8752a;
          font-size: 10px;
          letter-spacing: 0.1em;
          margin-bottom: 25px;
        }

        .process-step h3 {
          margin: 0 0 9px;
          font-size: 17px;
          font-weight: 600;
        }

        .process-step p {
          margin: 0;
          color: #5e6468;
          font-size: 12px;
          line-height: 1.7;
        }

        .process-line {
          width: 90px;
          height: 1px;
          background: #303438;
          margin: 0 25px;
        }

        /* ==================================================
           SERVICES
        ================================================== */

        .services-section {
          background: #111415;
          border-top: 1px solid #222628;
          border-bottom: 1px solid #222628;
        }

        .services-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 120px 40px;
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 120px;
          align-items: center;
        }

        .services-copy p {
          max-width: 510px;
          color: #666c70;
          font-size: 14px;
          line-height: 1.8;
          margin: 25px 0 30px;
        }

        .services-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: #e8752a;
          color: #0d0f10;
          text-decoration: none;
          padding: 14px 20px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 700;
          transition: 0.2s ease;
        }

        .services-btn:hover {
          background: #f08a45;
          transform: translateY(-2px);
        }

        .services-list {
          border-top: 1px solid #303438;
        }

        .services-list div {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 17px 0;
          border-bottom: 1px solid #303438;
          color: #888e92;
          font-size: 13px;
        }

        .services-list svg {
          width: 17px;
          color: #e8752a;
        }

        /* ==================================================
           ABOUT
        ================================================== */

        .about-section {
          padding-top: 110px;
          padding-bottom: 110px;
        }

        .about-layout {
          display: grid;
          grid-template-columns: 100px 1fr 200px;
          gap: 50px;
          align-items: start;
          border-top: 1px solid #292d30;
          padding-top: 55px;
        }

        .about-number {
          color: #303438;
          font-size: 50px;
          letter-spacing: -0.05em;
          font-weight: 600;
        }

        .about-content {
          max-width: 650px;
        }

        .about-content p {
          max-width: 600px;
          color: #62686c;
          font-size: 14px;
          line-height: 1.8;
          margin-top: 22px;
        }

        .about-mark {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          color: #303438;
        }

        .about-mark svg {
          color: #e8752a;
          margin-bottom: 10px;
        }

        .about-mark span {
          font-size: 9px;
          letter-spacing: 0.2em;
        }

        .about-mark strong {
          font-size: 22px;
          color: #e8752a;
          margin-top: 2px;
        }

        /* ==================================================
           FOOTER
        ================================================== */

        .landing-footer {
          border-top: 1px solid #292d30;
          background: #090b0c;
          padding: 35px 40px 25px;
        }

        .footer-main {
          max-width: 1280px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
        }

        .footer-brand {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .landing-logo-icon {
          width: 34px;
          height: 34px;
          border-radius: 8px;
          border: 1px solid #33383b;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #e8752a;
        }

        .footer-brand strong {
          display: block;
          font-size: 13px;
          font-weight: 650;
        }

        .footer-brand strong span {
          color: #e8752a;
        }

        .footer-brand small {
          display: block;
          color: #4f5559;
          font-size: 8px;
          margin-top: 2px;
          letter-spacing: 0.05em;
        }

        .footer-main > p {
          color: #50565a;
          font-size: 11px;
        }

        .footer-bottom {
          max-width: 1280px;
          margin: 30px auto 0;
          padding-top: 18px;
          border-top: 1px solid #1f2325;
          display: flex;
          justify-content: space-between;
          color: #3f4549;
          font-size: 9px;
        }

        /* ==================================================
           RESPONSIVE
        ================================================== */

        @media (max-width: 1050px) {

          .landing-hero {
            grid-template-columns: 1fr;
            padding-top: 70px;
          }

          .hero-content {
            max-width: 700px;
          }

          .hero-visual {
            min-height: 520px;
          }

          .feature-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .feature-card.large {
            grid-column: span 2;
          }

          .services-inner {
            gap: 60px;
          }

        }

        @media (max-width: 768px) {

          .landing-hero {
            padding: 60px 20px 70px;
          }

          .hero-title {
            font-size: clamp(3.4rem, 16vw, 5rem);
          }

          .hero-description {
            font-size: 14px;
          }

          .hero-visual {
            min-height: 430px;
          }

          .dashboard-window {
            width: 100%;
          }

          .health-section {
            padding: 17px;
            gap: 15px;
          }

          .health-ring {
            width: 85px;
            height: 85px;
          }

          .health-ring-inner {
            width: 68px;
            height: 68px;
          }

          .health-ring-inner strong {
            font-size: 22px;
          }

          .vehicle-stats {
            padding: 14px;
          }

          .vehicle-panel-header,
          .mini-activity {
            margin-left: 18px;
            margin-right: 18px;
          }

          .vehicle-panel-header {
            padding-left: 0;
            padding-right: 0;
          }

          .ai-card {
            left: -8px;
            top: 40px;
          }

          .location-card {
            right: -8px;
            bottom: 35px;
          }

          .product-strip {
            padding: 0 20px;
            grid-template-columns: repeat(2, 1fr);
          }

          .product-strip div {
            padding: 16px 5px;
          }

          .product-strip div:nth-child(2) {
            border-right: none;
          }

          .product-strip div:last-child {
            grid-column: span 2;
            border-top: 1px solid #222628;
          }

          .landing-section {
            padding: 85px 20px;
          }

          .feature-grid {
            grid-template-columns: 1fr;
          }

          .feature-card.large {
            grid-column: span 1;
          }

          .workflow-header {
            grid-template-columns: 1fr;
            gap: 25px;
          }

          .workflow {
            display: block;
          }

          .process-step {
            max-width: none;
            margin-bottom: 30px;
          }

          .process-line {
            display: none;
          }

          .services-inner {
            padding: 85px 20px;
            grid-template-columns: 1fr;
            gap: 55px;
          }

          .about-layout {
            grid-template-columns: 50px 1fr;
          }

          .about-mark {
            display: none;
          }

          .footer-main,
          .footer-bottom {
            flex-direction: column;
            align-items: flex-start;
          }

        }

        @media (max-width: 480px) {

          .hero-trust {
            display: grid;
            gap: 10px;
          }

          .vehicle-stats {
            gap: 6px;
          }

          .dashboard-stat {
            padding: 10px;
          }

          .dashboard-stat strong {
            font-size: 11px;
          }

          .health-info p {
            font-size: 9px;
          }

          .ai-card,
          .location-card {
            display: none;
          }

        }

      `}</style>

    </div>
  );
};


/* ======================================================
   DASHBOARD STAT
====================================================== */

function DashboardStat({
  icon,
  label,
  value,
}) {
  return (
    <div className="dashboard-stat">

      {icon}

      <span>
        {label}
      </span>

      <strong>
        {value}
      </strong>

    </div>
  );
}


/* ======================================================
   FEATURE CARD
====================================================== */

function FeatureCard({
  number,
  icon,
  title,
  description,
  large = false,
}) {
  return (
    <div
      className={`feature-card ${
        large ? "large" : ""
      }`}
    >

      <div className="feature-icon">
        {icon}
      </div>

      <h3>
        {title}
      </h3>

      <p>
        {description}
      </p>

      <span className="feature-number">
        {number}
      </span>

    </div>
  );
}


/* ======================================================
   WORKFLOW STEP
====================================================== */

function WorkflowStep({
  number,
  title,
  text,
}) {
  return (
    <div className="process-step">

      <div className="process-number">
        {number}
      </div>

      <h3>
        {title}
      </h3>

      <p>
        {text}
      </p>

    </div>
  );
}


/* ======================================================
   WORKFLOW CONNECTOR
====================================================== */

function WorkflowConnector() {
  return (
    <div className="process-line"></div>
  );
}


/* ======================================================
   SERVICE ITEM
====================================================== */

function ServiceItem({
  text,
}) {
  return (
    <div>

      <CheckCircle2 />

      <span>
        {text}
      </span>

    </div>
  );
}


export default Landing;