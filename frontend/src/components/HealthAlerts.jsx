import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  AlertTriangle,
  ShieldAlert,
  Wrench,
  CheckCircle,
  ArrowRight,
  RefreshCw,
  Fuel,
  Car,
  Clock3,
  Gauge,
  CalendarDays,
} from "lucide-react";

import API from "../services/api";


function HealthAlerts() {

  const navigate = useNavigate();

  const [alerts, setAlerts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  // =====================================================
  // FETCH HEALTH ALERTS
  // =====================================================

  const fetchAlerts = async () => {

    try {

      setLoading(true);

      setError("");

      const res =
        await API.get(
          "/alerts/vehicle-health"
        );

      setAlerts(
        res.data.alerts || []
      );

    } catch (err) {

      console.error(
        "Health Alerts Error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to load vehicle health alerts."
      );

    } finally {

      setLoading(false);

    }
  };


  // =====================================================
  // LOAD ALERTS
  // =====================================================

  useEffect(() => {

    fetchAlerts();

  }, []);


  // =====================================================
  // ALERT ICON
  // =====================================================

  const getAlertIcon = (alert) => {

    if (
      alert.type === "insurance"
    ) {

      return (
        <ShieldAlert
          size={18}
        />
      );

    }


    if (
      alert.type === "service"
    ) {

      return (
        <Wrench
          size={18}
        />
      );

    }


    if (
      alert.type ===
      "fuel-efficiency"
    ) {

      return (
        <Fuel
          size={18}
        />
      );

    }


    return (
      <AlertTriangle
        size={18}
      />
    );
  };


  // =====================================================
  // ALERT TYPE
  // =====================================================

  const getAlertType = (alert) => {

    if (
      alert.type === "insurance"
    ) {

      return "INSURANCE";

    }

    if (
      alert.type === "service"
    ) {

      return "MAINTENANCE";

    }

    if (
      alert.type ===
      "fuel-efficiency"
    ) {

      return "FUEL EFFICIENCY";

    }

    return "VEHICLE ALERT";
  };


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (

      <div className="health-alerts-container">

        <div className="health-alerts-header">

          <div className="health-alerts-title-group">

            <div className="health-alerts-icon">

              <AlertTriangle
                size={18}
              />

            </div>

            <div>

              <div className="health-alerts-kicker">

                <span></span>

                VEHICLE MONITORING

              </div>

              <h2>
                Health alerts
              </h2>

              <p>
                Checking your vehicles for important issues.
              </p>

            </div>

          </div>

        </div>


        <div className="health-alert-loading">

          <div className="alert-loading-spinner">

            <RefreshCw
              size={18}
            />

          </div>

          <div>

            <strong>
              Scanning vehicle health
            </strong>

            <span>
              Checking maintenance, insurance and fuel data...
            </span>

          </div>

        </div>

      </div>

    );
  }


  // =====================================================
  // ERROR
  // =====================================================

  if (error) {

    return (

      <div className="health-alerts-container">

        <div className="health-alert-error">

          <div className="health-alert-error-icon">

            <AlertTriangle
              size={19}
            />

          </div>


          <div className="health-alert-error-content">

            <div className="health-alerts-kicker">

              <span></span>

              MONITORING ERROR

            </div>

            <h2>
              Unable to load alerts
            </h2>

            <p>
              {error}
            </p>

          </div>


          <button
            onClick={fetchAlerts}
            className="health-alert-retry"
          >

            <RefreshCw
              size={14}
            />

            Retry

          </button>

        </div>

      </div>

    );
  }


  // =====================================================
  // NO ALERTS
  // =====================================================

  if (
    alerts.length === 0
  ) {

    return (

      <div className="health-alerts-container">

        <div className="health-alerts-header">

          <div className="health-alerts-title-group">

            <div className="health-alerts-icon healthy">

              <CheckCircle
                size={18}
              />

            </div>

            <div>

              <div className="health-alerts-kicker">

                <span></span>

                VEHICLE MONITORING

              </div>

              <h2>
                Health status
              </h2>

              <p>
                Everything currently looks normal.
              </p>

            </div>

          </div>


          <div className="healthy-status">

            <span></span>

            ALL CLEAR

          </div>

        </div>


        <div className="health-clear-state">

          <div className="health-clear-icon">

            <CheckCircle
              size={22}
            />

          </div>


          <div>

            <strong>
              Your vehicles are looking good
            </strong>

            <p>
              No maintenance, insurance or
              fuel-efficiency alerts require
              your attention right now.
            </p>

          </div>

        </div>

      </div>

    );
  }


  // =====================================================
  // ALERTS
  // =====================================================

  return (

    <div className="health-alerts-container">


      {/* =================================================
          HEADER
      ================================================= */}

      <div className="health-alerts-header">

        <div className="health-alerts-title-group">

          <div className="health-alerts-icon">

            <AlertTriangle
              size={18}
            />

          </div>


          <div>

            <div className="health-alerts-kicker">

              <span></span>

              VEHICLE MONITORING

            </div>

            <h2>
              Health alerts
            </h2>

            <p>
              Important vehicle events that need your attention.
            </p>

          </div>

        </div>


        <div className="health-alert-count">

          <strong>
            {String(
              alerts.length
            ).padStart(2, "0")}
          </strong>

          <span>
            ACTIVE
          </span>

        </div>

      </div>


      {/* =================================================
          ALERT LIST
      ================================================= */}

      <div className="health-alert-list">

        {alerts.map(
          (
            alert,
            index
          ) => {

            const isDanger =
              alert.severity ===
              "danger";

            const isWarning =
              alert.severity ===
              "warning";


            return (

              <article
                key={`${alert.vehicleId}-${alert.type}-${index}`}
                className={`health-alert-card ${
                  isDanger
                    ? "danger"
                    : isWarning
                    ? "warning"
                    : "normal"
                }`}
              >


                {/* Left severity indicator */}

                <div className="alert-severity-line"></div>


                {/* =================================================
                    CARD TOP
                ================================================= */}

                <div className="health-alert-card-top">


                  <div className="health-alert-card-identity">


                    <div className="health-alert-card-icon">

                      {getAlertIcon(
                        alert
                      )}

                    </div>


                    <div>

                      <div className="alert-type">

                        {getAlertType(
                          alert
                        )}

                      </div>


                      <h3>
                        {alert.title}
                      </h3>

                    </div>

                  </div>


                  <div
                    className={`alert-severity-badge ${
                      isDanger
                        ? "danger"
                        : isWarning
                        ? "warning"
                        : "normal"
                    }`}
                  >

                    <span></span>

                    {alert.severity}

                  </div>

                </div>


                {/* =================================================
                    VEHICLE
                ================================================= */}

                <div className="alert-vehicle">

                  <div className="alert-vehicle-icon">

                    <Car size={15} />

                  </div>


                  <div>

                    <span>
                      VEHICLE
                    </span>

                    <strong>
                      {alert.vehicleName}
                    </strong>

                  </div>


                  <div className="alert-registration">

                    {alert.registrationNumber?.toUpperCase()}

                  </div>

                </div>


                {/* =================================================
                    MESSAGE
                ================================================= */}

                <p className="health-alert-message">

                  {alert.message}

                </p>


                {/* =================================================
                    FUEL EFFICIENCY
                ================================================= */}

                {alert.type ===
                  "fuel-efficiency" && (

                  <div className="alert-metrics">


                    <AlertMetric
                      icon={
                        <Gauge size={13} />
                      }
                      label="PREVIOUS"
                      value={
                        `${alert.previousEfficiency} ${alert.unit}`
                      }
                    />


                    <AlertMetric
                      icon={
                        <Fuel size={13} />
                      }
                      label="CURRENT"
                      value={
                        `${alert.currentEfficiency} ${alert.unit}`
                      }
                      accent
                    />


                    <AlertMetric
                      icon={
                        <ArrowRight
                          size={13}
                        />
                      }
                      label="DROP"
                      value={
                        `${alert.efficiencyDrop}%`
                      }
                      danger
                    />

                  </div>

                )}


                {/* =================================================
                    SERVICE DATA
                ================================================= */}

                {alert.lastServiceOdometer !==
                  undefined && (

                  <div className="alert-inline-data">

                    <div>

                      <span>
                        LAST SERVICE
                      </span>

                      <strong>

                        {Number(
                          alert.lastServiceOdometer
                        ).toLocaleString(
                          "en-IN"
                        )}

                        {" "}km

                      </strong>

                    </div>


                    <div>

                      <span>
                        CURRENT
                      </span>

                      <strong>

                        {Number(
                          alert.currentOdometer
                        ).toLocaleString(
                          "en-IN"
                        )}

                        {" "}km

                      </strong>

                    </div>

                  </div>

                )}


                {/* =================================================
                    REMAINING KM
                ================================================= */}

                {alert.remainingKm !==
                  undefined && (

                  <div className="alert-service-due">

                    <Wrench
                      size={13}
                    />

                    <span>

                      Service due in approximately{" "}

                      <strong>

                        {Number(
                          alert.remainingKm
                        ).toLocaleString(
                          "en-IN"
                        )}

                        {" "}km

                      </strong>

                    </span>

                  </div>

                )}


                {/* =================================================
                    INSURANCE
                ================================================= */}

                {alert.expiryDate && (

                  <div className="alert-inline-data insurance-data">

                    <div>

                      <span>
                        INSURANCE EXPIRY
                      </span>

                      <strong>

                        {new Date(
                          alert.expiryDate
                        ).toLocaleDateString(
                          "en-IN",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }
                        )}

                      </strong>

                    </div>


                    {alert.daysRemaining !==
                      undefined && (

                      <div>

                        <span>
                          STATUS
                        </span>

                        <strong
                          className={
                            alert.daysRemaining <
                            0
                              ? "danger-text"
                              : "accent-text"
                          }
                        >

                          {alert.daysRemaining >=
                          0
                            ? `${alert.daysRemaining} days remaining`
                            : `${Math.abs(
                                alert.daysRemaining
                              )} days overdue`}

                        </strong>

                      </div>

                    )}

                  </div>

                )}


                {/* =================================================
                    FOOTER
                ================================================= */}

                <div className="health-alert-card-footer">

                  <div className="alert-footer-note">

                    <Clock3
                      size={12}
                    />

                    Review recommended

                  </div>


                  <button
                    onClick={() =>
                      navigate(
                        `/vehicles/${alert.vehicleId}`
                      )
                    }
                    className="alert-view-button"
                  >

                    View vehicle

                    <ArrowRight
                      size={13}
                    />

                  </button>

                </div>

              </article>

            );

          }
        )}

      </div>


      {/* =================================================
          STYLES
      ================================================= */}

      <style>{`

        /* ==========================================
           CONTAINER
        ========================================== */

        .health-alerts-container {

          width: 100%;

          background: #131617;

          border: 1px solid #292e31;

          border-radius: 12px;

          overflow: hidden;

        }


        /* ==========================================
           HEADER
        ========================================== */

        .health-alerts-header {

          display: flex;

          align-items: center;

          justify-content: space-between;

          gap: 20px;

          padding:
            21px 22px;

          border-bottom:
            1px solid #292e31;

          background: #151819;

        }


        .health-alerts-title-group {

          display: flex;

          align-items: center;

          gap: 11px;

        }


        .health-alerts-icon {

          width: 38px;

          height: 38px;

          flex-shrink: 0;

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

          border:
            1px solid
            rgba(
              232,
              117,
              42,
              0.13
            );

        }


        .health-alerts-icon.healthy {

          color: #e8752a;

        }


        .health-alerts-kicker {

          display: flex;

          align-items: center;

          gap: 7px;

          color: #4d5458;

          font-size: 6px;

          font-weight: 700;

          letter-spacing: 0.18em;

          margin-bottom: 5px;

        }


        .health-alerts-kicker span {

          width: 17px;

          height: 1px;

          background: #e8752a;

        }


        .health-alerts-header h2 {

          margin: 0;

          color: #d5d8d9;

          font-size: 14px;

          font-weight: 600;

          letter-spacing: -0.02em;

        }


        .health-alerts-header p {

          margin: 4px 0 0;

          color: #50575b;

          font-size: 8px;

        }


        /* ==========================================
           COUNT
        ========================================== */

        .health-alert-count {

          display: flex;

          align-items: center;

          gap: 7px;

          padding:
            7px 10px;

          border:
            1px solid
            rgba(
              232,
              117,
              42,
              0.17
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

          font-size: 11px;

          font-weight: 600;

        }


        .health-alert-count span {

          color: #565d61;

          font-size: 6px;

          font-weight: 700;

          letter-spacing: 0.12em;

        }


        /* ==========================================
           ALERT LIST
        ========================================== */

        .health-alert-list {

          padding: 12px;

          display: flex;

          flex-direction: column;

          gap: 8px;

        }


        /* ==========================================
           CARD
        ========================================== */

        .health-alert-card {

          position: relative;

          overflow: hidden;

          padding:
            18px 19px
            16px;

          border:
            1px solid #292e31;

          border-radius: 9px;

          background: #111314;

          transition:
            border-color 0.2s ease,
            background 0.2s ease,
            transform 0.2s ease;

        }


        .health-alert-card:hover {

          background: #151819;

          border-color:
            rgba(
              232,
              117,
              42,
              0.22
            );

          transform:
            translateY(-1px);

        }


        .health-alert-card.danger {

          border-color:
            rgba(
              180,
              70,
              70,
              0.25
            );

        }


        /* ==========================================
           SEVERITY LINE
        ========================================== */

        .alert-severity-line {

          position: absolute;

          left: 0;

          top: 0;

          bottom: 0;

          width: 2px;

          background: #e8752a;

          opacity: 0.75;

        }


        .danger
        .alert-severity-line {

          background: #bd5a5a;

        }


        /* ==========================================
           CARD TOP
        ========================================== */

        .health-alert-card-top {

          display: flex;

          align-items: flex-start;

          justify-content: space-between;

          gap: 20px;

        }


        .health-alert-card-identity {

          display: flex;

          align-items: center;

          gap: 10px;

          min-width: 0;

        }


        .health-alert-card-icon {

          width: 35px;

          height: 35px;

          flex-shrink: 0;

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
              0.06
            );

          border:
            1px solid
            rgba(
              232,
              117,
              42,
              0.12
            );

        }


        .danger
        .health-alert-card-icon {

          color: #c96a6a;

          background:
            rgba(
              180,
              70,
              70,
              0.06
            );

          border-color:
            rgba(
              180,
              70,
              70,
              0.15
            );

        }


        .alert-type {

          color: #4d5458;

          font-size: 6px;

          font-weight: 700;

          letter-spacing: 0.16em;

          margin-bottom: 4px;

        }


        .health-alert-card h3 {

          margin: 0;

          color: #c9cdce;

          font-size: 12px;

          font-weight: 600;

          letter-spacing: -0.01em;

        }


        /* ==========================================
           BADGE
        ========================================== */

        .alert-severity-badge {

          display: flex;

          align-items: center;

          gap: 5px;

          flex-shrink: 0;

          padding:
            5px 7px;

          border-radius: 5px;

          font-size: 5px;

          font-weight: 700;

          letter-spacing: 0.12em;

          text-transform: uppercase;

          color: #e8752a;

          background:
            rgba(
              232,
              117,
              42,
              0.05
            );

          border:
            1px solid
            rgba(
              232,
              117,
              42,
              0.15
            );

        }


        .alert-severity-badge span {

          width: 4px;

          height: 4px;

          border-radius: 50%;

          background: #e8752a;

        }


        .alert-severity-badge.danger {

          color: #c96a6a;

          background:
            rgba(
              180,
              70,
              70,
              0.05
            );

          border-color:
            rgba(
              180,
              70,
              70,
              0.18
            );

        }


        .alert-severity-badge.danger span {

          background: #bd5a5a;

        }


        /* ==========================================
           VEHICLE
        ========================================== */

        .alert-vehicle {

          display: flex;

          align-items: center;

          gap: 8px;

          margin-top: 17px;

          padding:
            9px 10px;

          border:
            1px solid #252a2c;

          border-radius: 7px;

          background: #0d0f10;

        }


        .alert-vehicle-icon {

          width: 28px;

          height: 28px;

          display: flex;

          align-items: center;

          justify-content: center;

          border-radius: 6px;

          color: #666d71;

          background: #151819;

          border:
            1px solid #292e31;

        }


        .alert-vehicle > div:nth-child(2) {

          min-width: 0;

          flex: 1;

        }


        .alert-vehicle span {

          display: block;

          color: #454c50;

          font-size: 5px;

          font-weight: 700;

          letter-spacing: 0.14em;

        }


        .alert-vehicle strong {

          display: block;

          color: #8e9598;

          font-size: 9px;

          font-weight: 500;

          margin-top: 2px;

        }


        .alert-registration {

          color: #51585c;

          font-family: monospace;

          font-size: 7px;

          letter-spacing: 0.08em;

        }


        /* ==========================================
           MESSAGE
        ========================================== */

        .health-alert-message {

          margin:
            14px 0 0;

          color: #686f73;

          font-size: 9px;

          line-height: 1.7;

        }


        /* ==========================================
           METRICS
        ========================================== */

        .alert-metrics {

          display: grid;

          grid-template-columns:
            repeat(
              3,
              minmax(0, 1fr)
            );

          gap: 6px;

          margin-top: 14px;

        }


        .alert-metric {

          padding:
            10px;

          border:
            1px solid #252a2c;

          border-radius: 7px;

          background: #0d0f10;

        }


        .alert-metric-icon {

          color: #535b5f;

        }


        .alert-metric span {

          display: block;

          color: #454c50;

          font-size: 5px;

          font-weight: 700;

          letter-spacing: 0.12em;

          margin-top: 7px;

        }


        .alert-metric strong {

          display: block;

          color: #91979a;

          font-size: 10px;

          font-weight: 500;

          margin-top: 4px;

        }


        .alert-metric.accent {

          border-color:
            rgba(
              232,
              117,
              42,
              0.14
            );

        }


        .alert-metric.accent
        .alert-metric-icon {

          color: #e8752a;

        }


        .alert-metric.accent strong {

          color: #e8752a;

        }


        .alert-metric.danger {

          border-color:
            rgba(
              180,
              70,
              70,
              0.14
            );

        }


        .alert-metric.danger strong {

          color: #bd6868;

        }


        /* ==========================================
           INLINE DATA
        ========================================== */

        .alert-inline-data {

          display: flex;

          flex-wrap: wrap;

          gap: 25px;

          margin-top: 14px;

          padding-top: 13px;

          border-top:
            1px solid #252a2c;

        }


        .alert-inline-data div {

          display: flex;

          flex-direction: column;

        }


        .alert-inline-data span {

          color: #444b4f;

          font-size: 5px;

          font-weight: 700;

          letter-spacing: 0.13em;

        }


        .alert-inline-data strong {

          margin-top: 4px;

          color: #858c90;

          font-size: 9px;

          font-weight: 500;

        }


        .accent-text {

          color: #e8752a !important;

        }


        .danger-text {

          color: #bd6868 !important;

        }


        /* ==========================================
           SERVICE DUE
        ========================================== */

        .alert-service-due {

          display: flex;

          align-items: center;

          gap: 7px;

          margin-top: 13px;

          color: #72797d;

          font-size: 8px;

        }


        .alert-service-due svg {

          color: #e8752a;

        }


        .alert-service-due strong {

          color: #e8752a;

          font-weight: 600;

        }


        /* ==========================================
           FOOTER
        ========================================== */

        .health-alert-card-footer {

          display: flex;

          align-items: center;

          justify-content: space-between;

          gap: 15px;

          margin-top: 17px;

          padding-top: 13px;

          border-top:
            1px solid #252a2c;

        }


        .alert-footer-note {

          display: flex;

          align-items: center;

          gap: 5px;

          color: #41484c;

          font-size: 6px;

          letter-spacing: 0.04em;

        }


        .alert-view-button {

          display: inline-flex;

          align-items: center;

          gap: 7px;

          padding:
            8px 11px;

          border:
            1px solid
            rgba(
              232,
              117,
              42,
              0.2
            );

          border-radius: 6px;

          background:
            rgba(
              232,
              117,
              42,
              0.055
            );

          color: #d77539;

          font-size: 7px;

          font-weight: 600;

          cursor: pointer;

          transition:
            background 0.2s ease,
            border-color 0.2s ease;

        }


        .alert-view-button:hover {

          background:
            rgba(
              232,
              117,
              42,
              0.11
            );

          border-color:
            rgba(
              232,
              117,
              42,
              0.35
            );

        }


        /* ==========================================
           LOADING
        ========================================== */

        .health-alert-loading {

          min-height: 170px;

          display: flex;

          align-items: center;

          justify-content: center;

          gap: 11px;

          color: #777e82;

        }


        .alert-loading-spinner {

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
              0.06
            );

          border:
            1px solid
            rgba(
              232,
              117,
              42,
              0.12
            );

        }


        .health-alert-loading strong {

          display: block;

          color: #969c9f;

          font-size: 10px;

          font-weight: 600;

        }


        .health-alert-loading span {

          display: block;

          color: #4e5559;

          font-size: 7px;

          margin-top: 4px;

        }


        /* ==========================================
           ERROR
        ========================================== */

        .health-alert-error {

          display: flex;

          align-items: center;

          gap: 12px;

          padding:
            20px 22px;

        }


        .health-alert-error-icon {

          width: 39px;

          height: 39px;

          flex-shrink: 0;

          display: flex;

          align-items: center;

          justify-content: center;

          border-radius: 8px;

          color: #bd6868;

          background:
            rgba(
              180,
              70,
              70,
              0.06
            );

          border:
            1px solid
            rgba(
              180,
              70,
              70,
              0.15
            );

        }


        .health-alert-error-content {

          flex: 1;

        }


        .health-alert-error-content h2 {

          margin: 0;

          color: #c8cccd;

          font-size: 13px;

          font-weight: 600;

        }


        .health-alert-error-content p {

          margin: 4px 0 0;

          color: #8b6262;

          font-size: 8px;

        }


        .health-alert-retry {

          display: flex;

          align-items: center;

          gap: 6px;

          padding:
            8px 11px;

          border:
            1px solid
            rgba(
              232,
              117,
              42,
              0.2
            );

          border-radius: 6px;

          background:
            rgba(
              232,
              117,
              42,
              0.06
            );

          color: #d77539;

          font-size: 7px;

          cursor: pointer;

        }


        /* ==========================================
           CLEAR STATE
        ========================================== */

        .healthy-status {

          display: flex;

          align-items: center;

          gap: 5px;

          color: #777e82;

          font-size: 6px;

          font-weight: 700;

          letter-spacing: 0.12em;

        }


        .healthy-status span {

          width: 5px;

          height: 5px;

          border-radius: 50%;

          background: #e8752a;

        }


        .health-clear-state {

          display: flex;

          align-items: center;

          gap: 12px;

          margin: 12px;

          padding:
            24px;

          border:
            1px solid #252a2c;

          border-radius: 9px;

          background: #111314;

        }


        .health-clear-icon {

          width: 42px;

          height: 42px;

          flex-shrink: 0;

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
              0.06
            );

          border:
            1px solid
            rgba(
              232,
              117,
              42,
              0.12
            );

        }


        .health-clear-state strong {

          display: block;

          color: #aeb3b5;

          font-size: 10px;

          font-weight: 600;

        }


        .health-clear-state p {

          margin: 4px 0 0;

          color: #555c60;

          font-size: 8px;

          line-height: 1.6;

        }


        /* ==========================================
           MOBILE
        ========================================== */

        @media (max-width: 650px) {

          .health-alerts-header {

            align-items:
              flex-start;

          }


          .health-alert-count {

            align-self:
              flex-start;

          }


          .health-alert-card {

            padding:
              16px 14px;

          }


          .health-alert-card-top {

            flex-direction:
              column;

            gap: 12px;

          }


          .alert-severity-badge {

            align-self:
              flex-start;

          }


          .alert-metrics {

            grid-template-columns:
              1fr;

          }


          .health-alert-card-footer {

            align-items:
              flex-start;

            flex-direction:
              column;

          }


          .alert-view-button {

            width: 100%;

            justify-content:
              center;

          }


          .health-alert-error {

            align-items:
              flex-start;

            flex-wrap: wrap;

          }


          .health-alert-retry {

            margin-left:
              51px;

          }

        }

      `}</style>

    </div>

  );
}


// =====================================================
// ALERT METRIC
// =====================================================

function AlertMetric({
  icon,
  label,
  value,
  accent = false,
  danger = false,
}) {

  return (

    <div
      className={`alert-metric ${
        accent
          ? "accent"
          : ""
      } ${
        danger
          ? "danger"
          : ""
      }`}
    >

      <div className="alert-metric-icon">

        {icon}

      </div>

      <span>
        {label}
      </span>

      <strong>
        {value}
      </strong>

    </div>

  );
}


export default HealthAlerts;