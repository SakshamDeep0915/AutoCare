import { useEffect, useState } from "react";

import {
  AlertTriangle,
  CheckCircle2,
  Wrench,
  ArrowRight,
  ShieldAlert,
  Clock3,
} from "lucide-react";

import API from "../services/api";


function HealthAlerts() {

  const [alerts, setAlerts] = useState([]);

  const [loading, setLoading] =
    useState(true);


  // =====================================================
  // FETCH HEALTH ALERTS
  // =====================================================

  useEffect(() => {

    const loadAlerts = async () => {

      try {

        const res = await API.get(
          "/alerts/vehicle-health"
        );

        setAlerts(
          res.data?.alerts || []
        );

      } catch (err) {

        console.error(
          "Health Alerts Error:",
          err
        );

      } finally {

        setLoading(false);

      }

    };


    loadAlerts();

  }, []);


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (

      <section className="health-alerts-container">

        <div className="health-alerts-header">

          <div>

            <div className="health-alerts-kicker">

              <span></span>

              VEHICLE HEALTH

            </div>

            <h2>
              Health alerts
            </h2>

            <p>
              Monitoring your vehicles for potential issues.
            </p>

          </div>

        </div>


        <div className="health-alerts-loading">

          <div className="health-loading-row" />

          <div className="health-loading-row" />

        </div>


        <style>{`

          .health-alerts-loading {

            padding: 18px;

            display: flex;

            flex-direction: column;

            gap: 10px;

          }


          .health-loading-row {

            height: 76px;

            border-radius: 10px;

            background: #111314;

            border: 1px solid #252a2c;

            animation:
              healthAlertPulse
              1.4s
              ease-in-out
              infinite;

          }


          @keyframes healthAlertPulse {

            0%,
            100% {
              opacity: .45;
            }

            50% {
              opacity: 1;
            }

          }

        `}</style>

      </section>

    );

  }


  // =====================================================
  // NO ALERTS
  // =====================================================

  if (alerts.length === 0) {

    return (

      <section className="health-alerts-container">

        <div className="health-alerts-header">

          <div className="health-alerts-title-group">

            <div className="health-alerts-icon">

              <CheckCircle2 size={21} />

            </div>


            <div>

              <div className="health-alerts-kicker">

                <span></span>

                VEHICLE HEALTH

              </div>


              <h2>
                Health alerts
              </h2>


              <p>
                Your vehicles currently have no detected health alerts.
              </p>

            </div>

          </div>


          <div className="health-status-clear">

            <CheckCircle2 size={16} />

            <span>
              ALL CLEAR
            </span>

          </div>

        </div>


        <div className="health-alerts-clear-state">

          <div className="health-clear-icon">

            <CheckCircle2 size={28} />

          </div>


          <div>

            <h3>
              Everything looks good
            </h3>


            <p>
              No maintenance or vehicle health issues require your attention right now.
            </p>

          </div>

        </div>


        <style>{`

          .health-alerts-container {

            width: 100%;

            background: #131617;

            border:
              1px solid #292e31;

            border-radius: 12px;

            overflow: hidden;

          }


          .health-alerts-header {

            display: flex;

            align-items: center;

            justify-content: space-between;

            gap: 20px;

            padding:
              22px 24px;

            border-bottom:
              1px solid #292e31;

            background: #151819;

          }


          .health-alerts-title-group {

            display: flex;

            align-items: center;

            gap: 12px;

          }


          .health-alerts-icon {

            width: 40px;

            height: 40px;

            display: flex;

            align-items: center;

            justify-content: center;

            flex-shrink: 0;

            border-radius: 9px;

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
                0.13
              );

          }


          .health-alerts-kicker {

            display: flex;

            align-items: center;

            gap: 8px;

            margin-bottom: 5px;

            color: #646c70;

            font-size: 11px;

            font-weight: 700;

            letter-spacing:
              0.16em;

          }


          .health-alerts-kicker span {

            width: 18px;

            height: 1px;

            background: #e8752a;

          }


          .health-alerts-header h2 {

            margin: 0;

            color: #d2d5d6;

            font-size: 22px;

            line-height: 1.25;

            font-weight: 600;

            letter-spacing:
              -0.02em;

          }


          .health-alerts-header p {

            margin:
              5px 0 0;

            color: #656d71;

            font-size: 14px;

            line-height: 1.5;

          }


          .health-status-clear {

            display: flex;

            align-items: center;

            gap: 7px;

            padding:
              8px 12px;

            color: #7f878b;

            background:
              rgba(
                255,
                255,
                255,
                0.025
              );

            border:
              1px solid #292e31;

            border-radius: 7px;

            font-size: 10px;

            font-weight: 700;

            letter-spacing:
              0.1em;

            white-space: nowrap;

          }


          .health-status-clear svg {

            color: #e8752a;

          }


          .health-alerts-clear-state {

            min-height: 130px;

            display: flex;

            align-items: center;

            justify-content: center;

            gap: 15px;

            padding: 28px;

          }


          .health-clear-icon {

            width: 50px;

            height: 50px;

            display: flex;

            align-items: center;

            justify-content: center;

            flex-shrink: 0;

            color: #e8752a;

            background:
              rgba(
                232,
                117,
                42,
                0.06
              );

            border:
              1px solid
              rgba(
                232,
                117,
                42,
                0.13
              );

            border-radius: 10px;

          }


          .health-alerts-clear-state h3 {

            margin: 0;

            color: #bfc4c6;

            font-size: 17px;

            font-weight: 600;

          }


          .health-alerts-clear-state p {

            max-width: 520px;

            margin:
              5px 0 0;

            color: #626a6e;

            font-size: 14px;

            line-height: 1.6;

          }


          @media (max-width: 650px) {

            .health-alerts-header {

              align-items:
                flex-start;

              flex-direction:
                column;

            }


            .health-status-clear {

              align-self:
                flex-start;

            }


            .health-alerts-clear-state {

              align-items:
                flex-start;

            }

          }

        `}</style>

      </section>

    );

  }


  // =====================================================
  // ALERT HELPERS
  // =====================================================

  const getAlertIcon = (type) => {

    if (
      type === "critical" ||
      type === "danger"
    ) {

      return (
        <ShieldAlert size={20} />
      );

    }


    if (
      type === "warning"
    ) {

      return (
        <AlertTriangle size={20} />
      );

    }


    if (
      type === "maintenance"
    ) {

      return (
        <Wrench size={20} />
      );

    }


    return (
      <Clock3 size={20} />
    );

  };


  const getAlertLabel = (type) => {

    if (
      type === "critical" ||
      type === "danger"
    ) {

      return "CRITICAL";

    }


    if (
      type === "warning"
    ) {

      return "WARNING";

    }


    if (
      type === "maintenance"
    ) {

      return "MAINTENANCE";

    }


    return "ATTENTION";

  };


  const getAlertClass = (type) => {

    if (
      type === "critical" ||
      type === "danger"
    ) {

      return "critical";

    }


    if (
      type === "warning"
    ) {

      return "warning";

    }


    if (
      type === "maintenance"
    ) {

      return "maintenance";

    }


    return "attention";

  };


  // =====================================================
  // ALERT LIST
  // =====================================================

  return (

    <section className="health-alerts-container">


      {/* =================================================
          HEADER
      ================================================= */}

      <div className="health-alerts-header">

        <div className="health-alerts-title-group">

          <div className="health-alerts-icon">

            <AlertTriangle size={21} />

          </div>


          <div>

            <div className="health-alerts-kicker">

              <span></span>

              VEHICLE HEALTH

            </div>


            <h2>
              Health alerts
            </h2>


            <p>
              Important vehicle conditions that may need your attention.
            </p>

          </div>

        </div>


        <div className="health-alert-count">

          <strong>
            {String(alerts.length).padStart(2, "0")}
          </strong>


          <span>
            ALERTS
          </span>

        </div>

      </div>


      {/* =================================================
          ALERT LIST
      ================================================= */}

      <div className="health-alerts-list">

        {alerts.map(
          (alert, index) => {

            const type =
              alert.type ||
              alert.severity ||
              "attention";


            const alertClass =
              getAlertClass(type);


            return (

              <div
                key={
                  alert._id ||
                  `${type}-${index}`
                }
                className={`health-alert-card ${alertClass}`}
              >


                {/* =================================================
                    ICON
                ================================================= */}

                <div className="health-alert-icon">

                  {getAlertIcon(type)}

                </div>


                {/* =================================================
                    CONTENT
                ================================================= */}

                <div className="health-alert-content">

                  <div className="health-alert-topline">

                    <span className="health-alert-label">

                      {getAlertLabel(type)}

                    </span>


                    {alert.vehicle && (

                      <span className="health-alert-vehicle">

                        {alert.vehicle.brand ||
                          "Vehicle"}{" "}

                        {alert.vehicle.model ||
                          ""}

                      </span>

                    )}

                  </div>


                  <h3>

                    {alert.title ||
                      "Vehicle health alert"}

                  </h3>


                  <p>

                    {alert.message ||
                      alert.description ||
                      "This vehicle may require attention."}

                  </p>

                </div>


                {/* =================================================
                    ACTION
                ================================================= */}

                <div className="health-alert-action">

                  <ArrowRight size={18} />

                </div>

              </div>

            );

          }
        )}

      </div>


      {/* =================================================
          STYLES
      ================================================= */}

      <style>{`

        .health-alerts-container {

          width: 100%;

          background: #131617;

          border:
            1px solid #292e31;

          border-radius: 12px;

          overflow: hidden;

        }


        /* =================================================
           HEADER
        ================================================= */

        .health-alerts-header {

          display: flex;

          align-items: center;

          justify-content: space-between;

          gap: 20px;

          padding:
            22px 24px;

          border-bottom:
            1px solid #292e31;

          background: #151819;

        }


        .health-alerts-title-group {

          display: flex;

          align-items: center;

          gap: 12px;

        }


        .health-alerts-icon {

          width: 40px;

          height: 40px;

          display: flex;

          align-items: center;

          justify-content: center;

          flex-shrink: 0;

          border-radius: 9px;

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
              0.13
            );

        }


        .health-alerts-kicker {

          display: flex;

          align-items: center;

          gap: 8px;

          margin-bottom: 5px;

          color: #646c70;

          font-size: 11px;

          font-weight: 700;

          letter-spacing:
            0.16em;

        }


        .health-alerts-kicker span {

          width: 18px;

          height: 1px;

          background: #e8752a;

        }


        .health-alerts-header h2 {

          margin: 0;

          color: #d2d5d6;

          font-size: 22px;

          line-height: 1.25;

          font-weight: 600;

          letter-spacing:
            -0.02em;

        }


        .health-alerts-header p {

          margin:
            5px 0 0;

          color: #656d71;

          font-size: 14px;

          line-height: 1.5;

        }


        /* =================================================
           COUNT
        ================================================= */

        .health-alert-count {

          display: flex;

          align-items: center;

          gap: 8px;

          padding:
            8px 12px;

          border:
            1px solid
            rgba(
              232,
              117,
              42,
              0.18
            );

          border-radius: 7px;

          background:
            rgba(
              232,
              117,
              42,
              0.045
            );

        }


        .health-alert-count strong {

          color: #e8752a;

          font-size: 15px;

          font-weight: 600;

        }


        .health-alert-count span {

          color: #626a6e;

          font-size: 10px;

          font-weight: 700;

          letter-spacing:
            0.12em;

        }


        /* =================================================
           LIST
        ================================================= */

        .health-alerts-list {

          padding: 14px;

          display: flex;

          flex-direction: column;

          gap: 9px;

        }


        /* =================================================
           ALERT CARD
        ================================================= */

        .health-alert-card {

          position: relative;

          display: flex;

          align-items: center;

          gap: 14px;

          min-height: 90px;

          padding:
            15px 16px;

          background: #111314;

          border:
            1px solid #252a2c;

          border-radius: 9px;

          transition:
            transform 0.2s ease,
            background 0.2s ease,
            border-color 0.2s ease;

        }


        .health-alert-card:hover {

          transform:
            translateX(2px);

          background: #151819;

        }


        /* =================================================
           ALERT ICON
        ================================================= */

        .health-alert-icon {

          width: 42px;

          height: 42px;

          display: flex;

          align-items: center;

          justify-content: center;

          flex-shrink: 0;

          border-radius: 9px;

        }


        .health-alert-card.critical
        .health-alert-icon {

          color: #f87171;

          background:
            rgba(
              248,
              113,
              113,
              0.08
            );

          border:
            1px solid
            rgba(
              248,
              113,
              113,
              0.16
            );

        }


        .health-alert-card.warning
        .health-alert-icon {

          color: #e8752a;

          background:
            rgba(
              232,
              117,
              42,
              0.08
            );

          border:
            1px solid
            rgba(
              232,
              117,
              42,
              0.16
            );

        }


        .health-alert-card.maintenance
        .health-alert-icon {

          color: #fb923c;

          background:
            rgba(
              251,
              146,
              60,
              0.08
            );

          border:
            1px solid
            rgba(
              251,
              146,
              60,
              0.16
            );

        }


        .health-alert-card.attention
        .health-alert-icon {

          color: #a1a1aa;

          background:
            rgba(
              255,
              255,
              255,
              0.04
            );

          border:
            1px solid #292e31;

        }


        /* =================================================
           CONTENT
        ================================================= */

        .health-alert-content {

          flex: 1;

          min-width: 0;

        }


        .health-alert-topline {

          display: flex;

          align-items: center;

          flex-wrap: wrap;

          gap: 9px;

          margin-bottom: 4px;

        }


        .health-alert-label {

          display: inline-flex;

          align-items: center;

          padding:
            3px 7px;

          border-radius: 4px;

          font-size: 10px;

          font-weight: 800;

          letter-spacing:
            0.09em;

        }


        .health-alert-card.critical
        .health-alert-label {

          color: #fca5a5;

          background:
            rgba(
              248,
              113,
              113,
              0.09
            );

        }


        .health-alert-card.warning
        .health-alert-label {

          color: #fb923c;

          background:
            rgba(
              232,
              117,
              42,
              0.09
            );

        }


        .health-alert-card.maintenance
        .health-alert-label {

          color: #fdba74;

          background:
            rgba(
              251,
              146,
              60,
              0.09
            );

        }


        .health-alert-card.attention
        .health-alert-label {

          color: #a1a1aa;

          background:
            rgba(
              255,
              255,
              255,
              0.05
            );

        }


        .health-alert-vehicle {

          color: #697175;

          font-size: 12px;

        }


        .health-alert-content h3 {

          margin: 0;

          color: #c8cdcf;

          font-size: 17px;

          line-height: 1.35;

          font-weight: 600;

        }


        .health-alert-content p {

          margin:
            5px 0 0;

          color: #697175;

          font-size: 14px;

          line-height: 1.55;

        }


        /* =================================================
           ACTION
        ================================================= */

        .health-alert-action {

          width: 36px;

          height: 36px;

          display: flex;

          align-items: center;

          justify-content: center;

          flex-shrink: 0;

          border:
            1px solid #292e31;

          border-radius: 7px;

          color: #555d61;

          transition:
            all 0.2s ease;

        }


        .health-alert-card:hover
        .health-alert-action {

          color: #e8752a;

          border-color:
            rgba(
              232,
              117,
              42,
              0.28
            );

        }


        /* =================================================
           MOBILE
        ================================================= */

        @media (max-width: 650px) {

          .health-alerts-header {

            align-items:
              flex-start;

          }


          .health-alert-count {

            display:
              none;

          }


          .health-alert-card {

            align-items:
              flex-start;

            min-height:
              auto;

          }


          .health-alert-icon {

            width: 38px;

            height: 38px;

          }


          .health-alert-content h3 {

            font-size: 15px;

          }


          .health-alert-content p {

            font-size: 13px;

          }


          .health-alert-action {

            display:
              none;

          }

        }

      `}</style>

    </section>

  );
}


export default HealthAlerts;