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
  Plus,
  Clock3,
  MapPin,
  FileText,
  Bot,
  Droplets,
} from "lucide-react";

import { getVehicleById } from "../services/vehicleService";
import Navbar from "../components/Navbar";
import HealthScore from "../components/HealthScore";


function VehicleDetails() {

  const { id } = useParams();

  const navigate = useNavigate();

  const [vehicle, setVehicle] =
    useState(null);

  const [loading, setLoading] =
    useState(true);


  // =====================================================
  // FETCH VEHICLE
  // =====================================================

  useEffect(() => {
    fetchVehicle();
  }, [id]);


  const fetchVehicle = async () => {

    try {

      const res =
        await getVehicleById(id);

      setVehicle(
        res.data.vehicle
      );

    } catch (err) {

      console.error(err);

      alert(
        "Failed to load vehicle"
      );

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
              <Car size={24} />
            </div>

            <span>
              VEHICLE RECORD
            </span>

            <h2>
              Vehicle not found
            </h2>

            <p>
              We couldn't find the vehicle
              associated with this record.
            </p>

            <button
              onClick={() =>
                navigate("/dashboard")
              }
              className="not-found-button"
            >
              <ArrowLeft size={15} />
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
              onClick={() =>
                navigate("/dashboard")
              }
              className="vehicle-back-button"
            >

              <ArrowLeft size={15} />

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

                <Car size={30} />

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
                icon={<CalendarDays size={17} />}
                title="Model year"
                value={vehicle.year}
              />


              <InfoCard
                icon={<Fuel size={17} />}
                title="Fuel type"
                value={vehicle.fuelType}
              />


              <InfoCard
                icon={<Gauge size={17} />}
                title="Current odometer"
                value={`${Number(
                  vehicle.odometer || 0
                ).toLocaleString("en-IN")} km`}
              />


              <InfoCard
                icon={<ShieldCheck size={17} />}
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

                <Sparkles size={13} />

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
                icon={<Wrench size={19} />}
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
                icon={<History size={19} />}
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
                icon={<Bot size={19} />}
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
                icon={<Droplets size={19} />}
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
                icon={<Fuel size={19} />}
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

                <ShieldCheck size={17} />

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

          max-width: 1180px;

          margin: 0 auto;

          padding:
            28px 30px
            70px;

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

          margin-bottom: 35px;

        }

        .vehicle-back-button {

          display: inline-flex;

          align-items: center;

          gap: 8px;

          border: none;

          background: transparent;

          padding: 0;

          color: #555c60;

          font-size: 10px;

          cursor: pointer;

          transition:
            color 0.2s ease;

        }

        .vehicle-back-button:hover {

          color: #e8752a;

        }

        .vehicle-record-status {

          display: flex;

          align-items: center;

          gap: 6px;

          color: #4b5256;

          font-size: 7px;

          font-weight: 700;

          letter-spacing: 0.18em;

        }

        .vehicle-record-status span {

          width: 5px;

          height: 5px;

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

          gap: 30px;

          padding:
            30px 0
            34px;

          border-bottom: 1px solid #282d2f;

        }

        .vehicle-hero-main {

          display: flex;

          align-items: center;

          gap: 17px;

        }

        .vehicle-icon-box {

          width: 64px;

          height: 64px;

          display: flex;

          align-items: center;

          justify-content: center;

          flex-shrink: 0;

          border-radius: 13px;

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

          color: #555c60;

          font-size: 7px;

          font-weight: 700;

          letter-spacing: 0.2em;

          margin-bottom: 8px;

        }

        .vehicle-hero h1 {

          margin: 0;

          color: #f0f0f0;

          font-size:
            clamp(
              2.3rem,
              4.5vw,
              3.7rem
            );

          line-height: 0.95;

          letter-spacing: -0.06em;

          font-weight: 650;

        }

        .vehicle-hero h1 em {

          color: #e8752a;

          font-style: normal;

        }

        .vehicle-registration {

          display: flex;

          align-items: center;

          gap: 8px;

          margin-top: 11px;

          color: #656c70;

          font-size: 8px;

          font-weight: 600;

          letter-spacing: 0.12em;

        }

        .vehicle-registration i {

          width: 3px;

          height: 3px;

          border-radius: 50%;

          background: #3c4245;

        }


        /* =================================================
           HERO STATUS
        ================================================= */

        .vehicle-hero-status {

          display: flex;

          align-items: center;

          gap: 9px;

          padding:
            11px 14px;

          border:
            1px solid #292e31;

          border-radius: 9px;

          background: #121516;

        }

        .hero-status-dot {

          width: 7px;

          height: 7px;

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

          color: #4b5256;

          font-size: 6px;

          font-weight: 700;

          letter-spacing: 0.16em;

        }

        .vehicle-hero-status strong {

          display: block;

          margin-top: 3px;

          color: #999fa2;

          font-size: 9px;

          font-weight: 500;

        }


        /* =================================================
           SECTIONS
        ================================================= */

        .vehicle-info-section,
        .health-section,
        .action-section {

          margin-top: 42px;

        }

        .section-heading {

          display: flex;

          align-items: flex-end;

          justify-content: space-between;

          margin-bottom: 17px;

        }

        .section-kicker {

          display: flex;

          align-items: center;

          gap: 8px;

          color: #4e5559;

          font-size: 7px;

          font-weight: 700;

          letter-spacing: 0.18em;

          margin-bottom: 8px;

        }

        .section-kicker span {

          width: 20px;

          height: 1px;

          background: #e8752a;

        }

        .section-heading h2 {

          margin: 0;

          color: #cdd1d2;

          font-size: 17px;

          font-weight: 600;

          letter-spacing: -0.02em;

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

          gap: 10px;

        }


        /* =================================================
           INFO CARD
        ================================================= */

        .vehicle-info-card {

          min-height: 108px;

          padding: 17px;

          background: #131617;

          border: 1px solid #292e31;

          border-radius: 10px;

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
              0.065
            );

          border: 1px solid
            rgba(
              232,
              117,
              42,
              0.12
            );

          margin-bottom: 13px;

        }

        .vehicle-info-card span {

          display: block;

          color: #4e5559;

          font-size: 6px;

          font-weight: 700;

          letter-spacing: 0.14em;

        }

        .vehicle-info-card strong {

          display: block;

          color: #aeb3b5;

          font-size: 11px;

          font-weight: 500;

          margin-top: 5px;

          overflow: hidden;

          white-space: nowrap;

          text-overflow: ellipsis;

        }


        /* =================================================
           HEALTH
        ================================================= */

        .health-heading {

          margin-bottom: 15px;

        }

        .health-ai-label {

          display: flex;

          align-items: center;

          gap: 5px;

          color: #e8752a;

          font-size: 7px;

          font-weight: 700;

          letter-spacing: 0.13em;

        }

        .health-wrapper {

          background: #131617;

          border: 1px solid #292e31;

          border-radius: 12px;

          padding: 5px;

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

          gap: 9px;

        }


        /* =================================================
           ACTION CARD
        ================================================= */

        .vehicle-action-card {

          min-height: 155px;

          display: flex;

          flex-direction: column;

          align-items: flex-start;

          justify-content: space-between;

          padding: 17px;

          border-radius: 10px;

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

          width: 36px;

          height: 36px;

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

          padding-top: 22px;

        }

        .action-content h3 {

          margin: 0;

          color: #cdd1d2;

          font-size: 11px;

          font-weight: 600;

        }

        .primary .action-content h3 {

          color: #0b0d0e;

        }

        .action-content p {

          margin: 5px 0 0;

          color: #565d61;

          font-size: 8px;

          line-height: 1.5;

        }

        .primary .action-content p {

          color:
            rgba(
              11,
              13,
              14,
              0.65
            );

        }

        .action-arrow {

          position: absolute;

          right: 15px;

          top: 15px;

          color: #454c50;

        }

        .vehicle-action-card {

          position: relative;

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

          gap: 10px;

          margin-top: 25px;

        }

        .footer-info-card {

          display: flex;

          gap: 12px;

          padding: 18px;

          background: #101213;

          border: 1px solid #24292b;

          border-radius: 10px;

        }

        .footer-info-icon {

          width: 33px;

          height: 33px;

          flex-shrink: 0;

          display: flex;

          align-items: center;

          justify-content: center;

          border-radius: 7px;

          background: #171a1b;

          border: 1px solid #2a2f31;

          color: #656c70;

        }

        .footer-info-card span {

          display: block;

          color: #464d51;

          font-size: 6px;

          font-weight: 700;

          letter-spacing: 0.16em;

        }

        .footer-info-card strong {

          display: block;

          color: #888f93;

          font-size: 9px;

          font-weight: 500;

          margin-top: 4px;

        }

        .footer-info-card p {

          margin: 4px 0 0;

          color: #4d5458;

          font-size: 8px;

          line-height: 1.5;

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

          width: 55px;

          height: 55px;

          display: flex;

          align-items: center;

          justify-content: center;

          border-radius: 11px;

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

          color: #4e5559;

          font-size: 7px;

          font-weight: 700;

          letter-spacing: 0.18em;

          margin-top: 17px;

        }

        .vehicle-not-found h2 {

          margin: 7px 0 0;

          color: #d3d6d7;

          font-size: 22px;

        }

        .vehicle-not-found p {

          color: #555c60;

          font-size: 10px;

          margin: 7px 0 18px;

        }

        .not-found-button {

          display: flex;

          align-items: center;

          gap: 7px;

          border: 1px solid #303538;

          background: #141718;

          color: #8b9194;

          padding: 9px 13px;

          border-radius: 7px;

          font-size: 9px;

          cursor: pointer;

        }


        /* =================================================
           SKELETON
        ================================================= */

        .vehicle-skeleton-back {

          width: 100px;

          height: 10px;

          background: #171a1b;

          border-radius: 5px;

          margin-bottom: 45px;

          animation:
            vehicle-pulse 1.3s infinite;

        }

        .vehicle-skeleton-header {

          width: 350px;

          height: 45px;

          background: #171a1b;

          border-radius: 7px;

          animation:
            vehicle-pulse 1.3s infinite;

        }

        .vehicle-skeleton-subtitle {

          width: 230px;

          height: 10px;

          background: #171a1b;

          border-radius: 5px;

          margin-top: 15px;

          margin-bottom: 40px;

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

          gap: 10px;

        }

        .vehicle-skeleton-grid div {

          height: 110px;

          background: #131617;

          border: 1px solid #202426;

          border-radius: 10px;

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
              22px 15px
              50px;

          }

          .vehicle-record-status {

            display: none;

          }

          .vehicle-hero {

            align-items: flex-start;

            flex-direction: column;

          }

          .vehicle-hero-main {

            align-items: flex-start;

          }

          .vehicle-icon-box {

            width: 52px;

            height: 52px;

          }

          .vehicle-hero h1 {

            font-size: 2.3rem;

          }

          .vehicle-hero-status {

            width: 100%;

          }

          .vehicle-info-grid {

            grid-template-columns: 1fr;

          }

          .action-grid {

            grid-template-columns:
              1fr 1fr;

          }

          .vehicle-action-card {

            min-height: 145px;

          }

          .vehicle-footer-grid {

            grid-template-columns: 1fr;

          }

        }


        @media (max-width: 420px) {

          .action-grid {

            grid-template-columns: 1fr;

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
        size={13}
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
      width="17"
      height="17"
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