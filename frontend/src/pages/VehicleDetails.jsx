import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  ArrowRight,
  Car,
  CalendarDays,
  Fuel,
  Gauge,
  ShieldCheck,
  Wrench,
  History,
  Sparkles,
  Bot,
  Droplets,
} from "lucide-react";

import { getVehicleById } from "../services/vehicleService";
import Navbar from "../components/Navbar";
import HealthScore from "../components/HealthScore";


function VehicleDetails() {

  const { id } = useParams();

  const navigate = useNavigate();

  const [vehicle, setVehicle] = useState(null);

  const [loading, setLoading] = useState(true);


  // =====================================================
  // FETCH VEHICLE
  // =====================================================

  useEffect(() => {
    fetchVehicle();
  }, [id]);


  const fetchVehicle = async () => {

    try {

      const res = await getVehicleById(id);

      setVehicle(res.data.vehicle);

    } catch (err) {

      console.error(err);

      alert("Failed to load vehicle");

    } finally {

      setLoading(false);

    }
  };


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (
      <>
        <Navbar />

        <main className="vehicle-details-page">

          <div className="vehicle-details-container">

            <div className="vehicle-skeleton-back"></div>

            <div className="vehicle-skeleton-header"></div>

            <div className="vehicle-skeleton-subtitle"></div>

            <div className="vehicle-skeleton-grid">

              <div></div>
              <div></div>
              <div></div>
              <div></div>

            </div>

          </div>

        </main>
      </>
    );
  }


  // =====================================================
  // VEHICLE NOT FOUND
  // =====================================================

  if (!vehicle) {

    return (
      <>
        <Navbar />

        <main className="vehicle-details-page">

          <div className="vehicle-not-found">

            <div className="not-found-icon">
              <Car size={28} />
            </div>

            <span>
              VEHICLE RECORD
            </span>

            <h2>
              Vehicle not found
            </h2>

            <p>
              We couldn't find the vehicle associated
              with this record.
            </p>

            <button
              onClick={() => navigate("/dashboard")}
              className="not-found-button"
            >
              <ArrowLeft size={17} />
              Back to dashboard
            </button>

          </div>

        </main>
      </>
    );
  }


  // =====================================================
  // MAIN UI
  // =====================================================

  return (
    <>
      <Navbar />

      <main className="vehicle-details-page">

        {/* =================================================
            BACKGROUND
        ================================================= */}

        <div className="vehicle-details-background">

          <div className="vehicle-grid"></div>

          <div className="vehicle-glow"></div>

        </div>


        <div className="vehicle-details-container">


          {/* =================================================
              TOP NAV
          ================================================= */}

          <div className="vehicle-details-topbar">

            <button
              onClick={() => navigate("/dashboard")}
              className="vehicle-back-button"
            >

              <ArrowLeft size={18} />

              Back to dashboard

            </button>


            <div className="vehicle-record-status">

              <span></span>

              VEHICLE RECORD

            </div>

          </div>


          {/* =================================================
              VEHICLE HERO
          ================================================= */}

          <section className="vehicle-hero">

            <div className="vehicle-hero-main">

              <div className="vehicle-icon-box">

                <Car size={34} />

              </div>


              <div>

                <div className="vehicle-kicker">

                  YOUR VEHICLE

                </div>


                <h1>

                  {vehicle.brand}{" "}

                  <em>
                    {vehicle.model}
                  </em>

                </h1>


                <div className="vehicle-registration">

                  <span>
                    {vehicle.registrationNumber?.toUpperCase()}
                  </span>

                  <i></i>

                  <span>
                    {vehicle.year}
                  </span>

                  <i></i>

                  <span>
                    {vehicle.fuelType}
                  </span>

                </div>

              </div>

            </div>


            {/* HERO SIDE */}

            <div className="vehicle-hero-status">

              <div className="hero-status-dot"></div>

              <div>

                <span>
                  STATUS
                </span>

                <strong>
                  Active vehicle
                </strong>

              </div>

            </div>

          </section>


          {/* =================================================
              VEHICLE INFORMATION
          ================================================= */}

          <section className="vehicle-info-section">

            <div className="section-heading">

              <div>

                <div className="section-kicker">

                  <span></span>

                  VEHICLE SPECIFICATIONS

                </div>

                <h2>
                  Vehicle information
                </h2>

              </div>

            </div>


            <div className="vehicle-info-grid">

              <InfoCard
                icon={<CalendarDays size={20} />}
                title="Model year"
                value={vehicle.year}
              />


              <InfoCard
                icon={<Fuel size={20} />}
                title="Fuel type"
                value={vehicle.fuelType}
              />


              <InfoCard
                icon={<Gauge size={20} />}
                title="Current odometer"
                value={`${Number(
                  vehicle.odometer || 0
                ).toLocaleString("en-IN")} km`}
              />


              <InfoCard
                icon={<ShieldCheck size={20} />}
                title="Insurance expiry"
                value={
                  vehicle.insuranceExpiry
                    ? new Date(
                        vehicle.insuranceExpiry
                      ).toLocaleDateString(
                        "en-IN",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        }
                      )
                    : "Not available"
                }
              />

            </div>

          </section>


          {/* =================================================
              HEALTH SCORE
          ================================================= */}

          <section className="health-section">

            <div className="section-heading health-heading">

              <div>

                <div className="section-kicker">

                  <span></span>

                  VEHICLE INTELLIGENCE

                </div>

                <h2>
                  Vehicle health
                </h2>

              </div>


              <div className="health-ai-label">

                <Sparkles size={16} />

                AI POWERED

              </div>

            </div>


            <div className="health-wrapper">

              <HealthScore
                vehicleId={vehicle._id}
              />

            </div>

          </section>


          {/* =================================================
              ACTION CENTER
          ================================================= */}

          <section className="action-section">

            <div className="section-heading">

              <div>

                <div className="section-kicker">

                  <span></span>

                  VEHICLE MANAGEMENT

                </div>

                <h2>
                  What would you like to do?
                </h2>

              </div>

            </div>


            <div className="action-grid">


              {/* ADD SERVICE */}

              <ActionCard
                icon={<Wrench size={21} />}
                title="Add service"
                description="Record a new maintenance or repair."
                primary
                onClick={() =>
                  navigate(
                    `/vehicles/${vehicle._id}/add-service`
                  )
                }
              />


              {/* SERVICE HISTORY */}

              <ActionCard
                icon={<History size={21} />}
                title="Service history"
                description="Review your complete maintenance timeline."
                onClick={() =>
                  navigate(
                    `/vehicles/${vehicle._id}/services`
                  )
                }
              />


              {/* AI REPORT */}

              <ActionCard
                icon={<Bot size={21} />}
                title="AI vehicle analysis"
                description="Generate an intelligent health assessment."
                ai
                onClick={() =>
                  navigate(
                    `/ai-report/${vehicle._id}`
                  )
                }
              />


              {/* ADD FUEL */}

              <ActionCard
                icon={<Droplets size={21} />}
                title="Add fuel"
                description="Record your latest fuel transaction."
                onClick={() =>
                  navigate(
                    `/vehicles/${vehicle._id}/add-fuel`
                  )
                }
              />


              {/* FUEL HISTORY */}

              <ActionCard
                icon={<Fuel size={21} />}
                title="Fuel history"
                description="Track fuel usage and spending."
                onClick={() =>
                  navigate(
                    `/vehicles/${vehicle._id}/fuel-history`
                  )
                }
              />

            </div>

          </section>


          {/* =================================================
              QUICK INFORMATION
          ================================================= */}

          <section className="vehicle-footer-grid">


            <div className="footer-info-card">

              <div className="footer-info-icon">

                <ActivityIcon />

              </div>

              <div>

                <span>
                  MAINTENANCE
                </span>

                <strong>
                  Keep your records updated
                </strong>

                <p>
                  Regular service records help
                  AutoCare AI provide better
                  vehicle insights.
                </p>

              </div>

            </div>


            <div className="footer-info-card">

              <div className="footer-info-icon">

                <ShieldCheck size={20} />

              </div>

              <div>

                <span>
                  VEHICLE SECURITY
                </span>

                <strong>
                  Your vehicle data is protected
                </strong>

                <p>
                  Your maintenance and vehicle
                  information stays connected to
                  your account.
                </p>

              </div>

            </div>

          </section>


        </div>

      </main>


      {/* =====================================================
          STYLES
      ===================================================== */}

      <style>{`

        /* =================================================
           PAGE
        ================================================= */

        .vehicle-details-page {

          min-height: 100vh;

          background: #0b0d0e;

          color: #f1f1f1;

          position: relative;

          overflow: hidden;

        }


        /* =================================================
           BACKGROUND
        ================================================= */

        .vehicle-details-background {

          position: fixed;

          inset: 0;

          pointer-events: none;

          overflow: hidden;

          z-index: 0;

        }

        .vehicle-grid {

          position: absolute;

          inset: 0;

          opacity: 0.14;

          background-image:

            linear-gradient(
              #25292b 1px,
              transparent 1px
            ),

            linear-gradient(
              90deg,
              #25292b 1px,
              transparent 1px
            );

          background-size: 75px 75px;

          mask-image:
            linear-gradient(
              to bottom,
              black,
              transparent 75%
            );

        }

        .vehicle-glow {

          position: absolute;

          width: 650px;

          height: 650px;

          top: -350px;

          right: -250px;

          background:
            radial-gradient(
              circle,
              rgba(
                232,
                117,
                42,
                0.065
              ),
              transparent 70%
            );

        }


        /* =================================================
           CONTAINER
        ================================================= */

        .vehicle-details-container {

          max-width: 1250px;

          margin: 0 auto;

          padding:
            34px 34px
            80px;

          position: relative;

          z-index: 2;

        }


        /* =================================================
           TOP BAR
        ================================================= */

        .vehicle-details-topbar {

          display: flex;

          align-items: center;

          justify-content: space-between;

          margin-bottom: 42px;

        }

        .vehicle-back-button {

          display: inline-flex;

          align-items: center;

          gap: 10px;

          border: none;

          background: transparent;

          padding: 0;

          color: #777f84;

          font-size: 14px;

          font-weight: 500;

          cursor: pointer;

          transition: color 0.2s ease;

        }

        .vehicle-back-button:hover {

          color: #e8752a;

        }

        .vehicle-record-status {

          display: flex;

          align-items: center;

          gap: 8px;

          color: #687075;

          font-size: 11px;

          font-weight: 700;

          letter-spacing: 0.16em;

        }

        .vehicle-record-status span {

          width: 7px;

          height: 7px;

          border-radius: 50%;

          background: #e8752a;

          box-shadow:
            0 0 8px
            rgba(
              232,
              117,
              42,
              0.65
            );

        }


        /* =================================================
           HERO
        ================================================= */

        .vehicle-hero {

          display: flex;

          align-items: center;

          justify-content: space-between;

          gap: 35px;

          padding:
            34px 0
            40px;

          border-bottom: 1px solid #282d2f;

        }

        .vehicle-hero-main {

          display: flex;

          align-items: center;

          gap: 20px;

        }

        .vehicle-icon-box {

          width: 72px;

          height: 72px;

          display: flex;

          align-items: center;

          justify-content: center;

          flex-shrink: 0;

          border-radius: 15px;

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
              0.18
            );

        }

        .vehicle-kicker {

          color: #687075;

          font-size: 11px;

          font-weight: 700;

          letter-spacing: 0.19em;

          margin-bottom: 10px;

        }

        .vehicle-hero h1 {

          margin: 0;

          color: #f0f0f0;

          font-size:
            clamp(
              2.5rem,
              4.5vw,
              4rem
            );

          line-height: 1;

          letter-spacing: -0.055em;

          font-weight: 650;

        }

        .vehicle-hero h1 em {

          color: #e8752a;

          font-style: normal;

        }

        .vehicle-registration {

          display: flex;

          align-items: center;

          gap: 10px;

          margin-top: 13px;

          color: #777f84;

          font-size: 12px;

          font-weight: 600;

          letter-spacing: 0.1em;

        }

        .vehicle-registration i {

          width: 4px;

          height: 4px;

          border-radius: 50%;

          background: #3c4245;

        }


        /* =================================================
           HERO STATUS
        ================================================= */

        .vehicle-hero-status {

          display: flex;

          align-items: center;

          gap: 11px;

          padding:
            14px 17px;

          border:
            1px solid #292e31;

          border-radius: 10px;

          background: #121516;

        }

        .hero-status-dot {

          width: 8px;

          height: 8px;

          border-radius: 50%;

          background: #e8752a;

          box-shadow:
            0 0 10px
            rgba(
              232,
              117,
              42,
              0.65
            );

        }

        .vehicle-hero-status span {

          display: block;

          color: #687075;

          font-size: 10px;

          font-weight: 700;

          letter-spacing: 0.14em;

        }

        .vehicle-hero-status strong {

          display: block;

          margin-top: 4px;

          color: #b7bdc0;

          font-size: 13px;

          font-weight: 500;

        }


        /* =================================================
           SECTIONS
        ================================================= */

        .vehicle-info-section,
        .health-section,
        .action-section {

          margin-top: 48px;

        }

        .section-heading {

          display: flex;

          align-items: flex-end;

          justify-content: space-between;

          margin-bottom: 20px;

        }

        .section-kicker {

          display: flex;

          align-items: center;

          gap: 9px;

          color: #687075;

          font-size: 11px;

          font-weight: 700;

          letter-spacing: 0.17em;

          margin-bottom: 9px;

        }

        .section-kicker span {

          width: 24px;

          height: 2px;

          background: #e8752a;

        }

        .section-heading h2 {

          margin: 0;

          color: #d9ddde;

          font-size: 24px;

          font-weight: 600;

          letter-spacing: -0.025em;

        }


        /* =================================================
           INFO GRID
        ================================================= */

        .vehicle-info-grid {

          display: grid;

          grid-template-columns:
            repeat(
              4,
              minmax(0, 1fr)
            );

          gap: 13px;

        }


        /* =================================================
           INFO CARD
        ================================================= */

        .vehicle-info-card {

          min-height: 128px;

          padding: 20px;

          background: #131617;

          border: 1px solid #292e31;

          border-radius: 11px;

          transition:
            border-color 0.2s ease,
            transform 0.2s ease;

        }

        .vehicle-info-card:hover {

          border-color:
            rgba(
              232,
              117,
              42,
              0.25
            );

          transform:
            translateY(-2px);

        }

        .vehicle-info-icon {

          width: 38px;

          height: 38px;

          display: flex;

          align-items: center;

          justify-content: center;

          border-radius: 8px;

          color: #e8752a;

          background:
            rgba(
              232,
              117,
              42,
              0.065
            );

          border: 1px solid
            rgba(
              232,
              117,
              42,
              0.12
            );

          margin-bottom: 15px;

        }

        .vehicle-info-card span {

          display: block;

          color: #687075;

          font-size: 11px;

          font-weight: 700;

          letter-spacing: 0.12em;

        }

        .vehicle-info-card strong {

          display: block;

          color: #c3c8ca;

          font-size: 15px;

          font-weight: 500;

          margin-top: 6px;

          overflow: hidden;

          white-space: nowrap;

          text-overflow: ellipsis;

        }


        /* =================================================
           HEALTH
        ================================================= */

        .health-heading {

          margin-bottom: 18px;

        }

        .health-ai-label {

          display: flex;

          align-items: center;

          gap: 7px;

          color: #e8752a;

          font-size: 11px;

          font-weight: 700;

          letter-spacing: 0.12em;

        }

        .health-wrapper {

          background: #131617;

          border: 1px solid #292e31;

          border-radius: 13px;

          padding: 7px;

          overflow: hidden;

        }


        /* =================================================
           ACTION GRID
        ================================================= */

        .action-grid {

          display: grid;

          grid-template-columns:
            repeat(
              5,
              minmax(0, 1fr)
            );

          gap: 12px;

        }


        /* =================================================
           ACTION CARD
        ================================================= */

        .vehicle-action-card {

          min-height: 185px;

          display: flex;

          flex-direction: column;

          align-items: flex-start;

          justify-content: space-between;

          padding: 20px;

          border-radius: 11px;

          border: 1px solid #292e31;

          background: #131617;

          color: #f1f1f1;

          text-align: left;

          cursor: pointer;

          transition:
            transform 0.2s ease,
            border-color 0.2s ease,
            background 0.2s ease;

        }

        .vehicle-action-card:hover {

          transform:
            translateY(-3px);

          border-color:
            rgba(
              232,
              117,
              42,
              0.3
            );

          background: #16191a;

        }

        .vehicle-action-card.primary {

          background:
            linear-gradient(
              145deg,
              #e8752a,
              #c75c19
            );

          border-color: #e8752a;

          color: #0b0d0e;

        }

        .vehicle-action-card.primary:hover {

          background:
            linear-gradient(
              145deg,
              #f08a45,
              #d86722
            );

        }

        .vehicle-action-card.ai {

          border-color:
            rgba(
              232,
              117,
              42,
              0.24
            );

        }

        .action-icon {

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
              0.065
            );

          border: 1px solid
            rgba(
              232,
              117,
              42,
              0.12
            );

        }

        .primary .action-icon {

          color: #0b0d0e;

          background:
            rgba(
              11,
              13,
              14,
              0.1
            );

          border-color:
            rgba(
              11,
              13,
              14,
              0.15
            );

        }

        .action-content {

          margin-top: auto;

          padding-top: 26px;

        }

        .action-content h3 {

          margin: 0;

          color: #d1d5d6;

          font-size: 15px;

          font-weight: 600;

        }

        .primary .action-content h3 {

          color: #0b0d0e;

        }

        .action-content p {

          margin: 7px 0 0;

          color: #747c80;

          font-size: 12px;

          line-height: 1.55;

        }

        .primary .action-content p {

          color:
            rgba(
              11,
              13,
              14,
              0.72
            );

        }

        .action-arrow {

          position: absolute;

          right: 17px;

          top: 17px;

          color: #60686c;

        }


        /* =================================================
           FOOTER INFO
        ================================================= */

        .vehicle-footer-grid {

          display: grid;

          grid-template-columns:
            repeat(
              2,
              minmax(0, 1fr)
            );

          gap: 13px;

          margin-top: 30px;

        }

        .footer-info-card {

          display: flex;

          gap: 15px;

          padding: 21px;

          background: #101213;

          border: 1px solid #24292b;

          border-radius: 11px;

        }

        .footer-info-icon {

          width: 38px;

          height: 38px;

          flex-shrink: 0;

          display: flex;

          align-items: center;

          justify-content: center;

          border-radius: 8px;

          background: #171a1b;

          border: 1px solid #2a2f31;

          color: #747c80;

        }

        .footer-info-card span {

          display: block;

          color: #626a6e;

          font-size: 10px;

          font-weight: 700;

          letter-spacing: 0.14em;

        }

        .footer-info-card strong {

          display: block;

          color: #aeb4b7;

          font-size: 14px;

          font-weight: 500;

          margin-top: 5px;

        }

        .footer-info-card p {

          margin: 6px 0 0;

          color: #687075;

          font-size: 12px;

          line-height: 1.55;

        }


        /* =================================================
           NOT FOUND
        ================================================= */

        .vehicle-not-found {

          min-height: 70vh;

          display: flex;

          align-items: center;

          justify-content: center;

          flex-direction: column;

          text-align: center;

        }

        .not-found-icon {

          width: 64px;

          height: 64px;

          display: flex;

          align-items: center;

          justify-content: center;

          border-radius: 12px;

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
              0.15
            );

        }

        .vehicle-not-found > span {

          color: #687075;

          font-size: 11px;

          font-weight: 700;

          letter-spacing: 0.17em;

          margin-top: 18px;

        }

        .vehicle-not-found h2 {

          margin: 8px 0 0;

          color: #d3d6d7;

          font-size: 26px;

        }

        .vehicle-not-found p {

          color: #687075;

          font-size: 14px;

          margin: 8px 0 20px;

        }

        .not-found-button {

          display: flex;

          align-items: center;

          gap: 8px;

          border: 1px solid #303538;

          background: #141718;

          color: #aeb4b7;

          padding: 11px 16px;

          border-radius: 8px;

          font-size: 13px;

          cursor: pointer;

        }


        /* =================================================
           SKELETON
        ================================================= */

        .vehicle-skeleton-back {

          width: 140px;

          height: 14px;

          background: #171a1b;

          border-radius: 6px;

          margin-bottom: 50px;

          animation:
            vehicle-pulse 1.3s infinite;

        }

        .vehicle-skeleton-header {

          width: 400px;

          height: 55px;

          background: #171a1b;

          border-radius: 8px;

          animation:
            vehicle-pulse 1.3s infinite;

        }

        .vehicle-skeleton-subtitle {

          width: 260px;

          height: 13px;

          background: #171a1b;

          border-radius: 6px;

          margin-top: 17px;

          margin-bottom: 45px;

          animation:
            vehicle-pulse 1.3s infinite;

        }

        .vehicle-skeleton-grid {

          display: grid;

          grid-template-columns:
            repeat(
              4,
              1fr
            );

          gap: 13px;

        }

        .vehicle-skeleton-grid div {

          height: 125px;

          background: #131617;

          border: 1px solid #202426;

          border-radius: 11px;

          animation:
            vehicle-pulse 1.3s infinite;

        }

        @keyframes vehicle-pulse {

          0%,
          100% {
            opacity: 0.45;
          }

          50% {
            opacity: 1;
          }

        }


        /* =================================================
           TABLET
        ================================================= */

        @media (max-width: 1050px) {

          .action-grid {

            grid-template-columns:
              repeat(
                3,
                minmax(0, 1fr)
              );

          }

          .vehicle-info-grid {

            grid-template-columns:
              repeat(
                2,
                minmax(0, 1fr)
              );

          }

        }


        /* =================================================
           MOBILE
        ================================================= */

        @media (max-width: 650px) {

          .vehicle-details-container {

            padding:
              24px 17px
              55px;

          }

          .vehicle-record-status {

            display: none;

          }

          .vehicle-details-topbar {

            margin-bottom: 30px;

          }

          .vehicle-back-button {

            font-size: 13px;

          }

          .vehicle-hero {

            align-items: flex-start;

            flex-direction: column;

            padding:
              28px 0
              32px;

          }

          .vehicle-hero-main {

            align-items: flex-start;

          }

          .vehicle-icon-box {

            width: 58px;

            height: 58px;

          }

          .vehicle-hero h1 {

            font-size: 2.35rem;

          }

          .vehicle-registration {

            font-size: 11px;

            flex-wrap: wrap;

          }

          .vehicle-hero-status {

            width: 100%;

            box-sizing: border-box;

          }

          .section-heading h2 {

            font-size: 21px;

          }

          .section-kicker {

            font-size: 10px;

          }

          .vehicle-info-grid {

            grid-template-columns: 1fr;

          }

          .action-grid {

            grid-template-columns:
              1fr 1fr;

          }

          .vehicle-action-card {

            min-height: 165px;

            padding: 17px;

          }

          .action-content h3 {

            font-size: 14px;

          }

          .action-content p {

            font-size: 11px;

          }

          .vehicle-footer-grid {

            grid-template-columns: 1fr;

          }

        }


        @media (max-width: 420px) {

          .action-grid {

            grid-template-columns: 1fr;

          }

          .vehicle-hero h1 {

            font-size: 2rem;

          }

        }

      `}</style>

    </>
  );
}


// =====================================================
// INFO CARD
// =====================================================

function InfoCard({
  icon,
  title,
  value,
}) {

  return (

    <div className="vehicle-info-card">

      <div className="vehicle-info-icon">

        {icon}

      </div>

      <span>
        {title}
      </span>

      <strong>
        {value}
      </strong>

    </div>

  );
}


// =====================================================
// ACTION CARD
// =====================================================

function ActionCard({
  icon,
  title,
  description,
  onClick,
  primary = false,
  ai = false,
}) {

  return (

    <button
      onClick={onClick}
      className={`vehicle-action-card ${
        primary
          ? "primary"
          : ""
      } ${
        ai
          ? "ai"
          : ""
      }`}
    >

      <div className="action-icon">

        {icon}

      </div>


      <div className="action-content">

        <h3>
          {title}
        </h3>

        <p>
          {description}
        </p>

      </div>


      <ArrowRight
        size={17}
        className="action-arrow"
      />

    </button>

  );
}


// =====================================================
// SMALL ACTIVITY ICON
// =====================================================

function ActivityIcon() {

  return (

    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >

      <path d="M3 12h4l3-8 4 16 3-8h4" />

    </svg>

  );
}


export default VehicleDetails;