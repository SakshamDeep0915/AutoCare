import { useEffect, useState } from "react";

import {
  Activity,
  Wrench,
  Fuel,
  Wallet,
  Shield,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Gauge,
} from "lucide-react";

import API from "../services/api";


function HealthScore({ vehicleId }) {

  const [data, setData] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  // =====================================================
  // FETCH HEALTH SCORE
  // =====================================================

  const fetchHealthScore = async () => {

    try {

      setLoading(true);
      setError("");

      const res =
        await API.get(
          `/health-score/${vehicleId}`
        );

      setData(res.data);

    } catch (err) {

      console.error(
        "Health Score Error:",
        err
      );

      setError(
        err.response?.data?.message ||
        "Unable to calculate vehicle health score."
      );

    } finally {

      setLoading(false);

    }
  };


  // =====================================================
  // LOAD
  // =====================================================

  useEffect(() => {

    if (vehicleId) {
      fetchHealthScore();
    }

  }, [vehicleId]);


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (

      <div className="health-score-container">

        <div className="health-score-header">

          <div className="health-score-title">

            <div className="health-score-icon">

              <Activity size={17} />

            </div>

            <div>

              <span className="health-kicker">
                VEHICLE DIAGNOSTICS
              </span>

              <h2>
                Health score
              </h2>

            </div>

          </div>

        </div>


        <div className="health-loading">

          <div className="health-loading-circle">

            <RefreshCw
              size={18}
              className="animate-spin"
            />

          </div>

          <div>

            <strong>
              Calculating vehicle health
            </strong>

            <span>
              Analyzing maintenance, fuel and insurance data...
            </span>

          </div>

        </div>


        <HealthScoreStyles />

      </div>

    );
  }


  // =====================================================
  // ERROR
  // =====================================================

  if (error) {

    return (

      <div className="health-score-container">

        <div className="health-error">

          <div className="health-error-icon">

            <AlertTriangle
              size={18}
            />

          </div>


          <div className="health-error-content">

            <span className="health-kicker">
              DIAGNOSTICS ERROR
            </span>

            <p>
              {error}
            </p>

          </div>


          <button
            onClick={fetchHealthScore}
            className="health-refresh-button"
          >

            <RefreshCw size={13} />

            Retry

          </button>

        </div>


        <HealthScoreStyles />

      </div>

    );
  }


  // =====================================================
  // NO DATA
  // =====================================================

  if (!data) {
    return null;
  }


  // =====================================================
  // SCORE
  // =====================================================

  const score =
    Number(data.healthScore) || 0;


  const scorePercentage =
    Math.min(
      Math.max(score, 0),
      100
    );


  const circumference = 2 * Math.PI * 53;

  const dashOffset =
    circumference -
    (scorePercentage / 100) *
      circumference;


  const getScoreStatus = () => {

    if (score >= 90)
      return "EXCELLENT";

    if (score >= 75)
      return "GOOD";

    if (score >= 60)
      return "FAIR";

    if (score >= 40)
      return "ATTENTION";

    return "CRITICAL";

  };


  const scoreStatus =
    getScoreStatus();


  // =====================================================
  // MAIN
  // =====================================================

  return (

    <div className="health-score-container">


      {/* =================================================
          HEADER
      ================================================= */}

      <div className="health-score-header">


        <div className="health-score-title">

          <div className="health-score-icon">

            <Activity size={17} />

          </div>


          <div>

            <span className="health-kicker">
              VEHICLE DIAGNOSTICS
            </span>

            <h2>
              Health score
            </h2>

          </div>

        </div>


        <button
          onClick={fetchHealthScore}
          className="health-refresh-button"
        >

          <RefreshCw size={13} />

          Refresh

        </button>

      </div>


      {/* =================================================
          SCORE AREA
      ================================================= */}

      <div className="health-score-main">


        {/* SCORE RING */}

        <div className="health-ring-wrapper">

          <svg
            width="142"
            height="142"
            viewBox="0 0 142 142"
            className="health-ring"
          >

            {/* Background */}

            <circle
              cx="71"
              cy="71"
              r="53"
              fill="none"
              stroke="#252a2c"
              strokeWidth="8"
            />


            {/* Progress */}

            <circle
              cx="71"
              cy="71"
              r="53"
              fill="none"
              stroke="#e8752a"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              transform="rotate(-90 71 71)"
              className="health-ring-progress"
            />

          </svg>


          <div className="health-ring-content">

            <strong>
              {score}
            </strong>

            <span>
              / 100
            </span>

          </div>

        </div>


        {/* STATUS */}

        <div className="health-score-status">

          <div className="health-status-label">

            <span></span>

            LIVE VEHICLE ASSESSMENT

          </div>


          <h3>
            {data.status ||
              scoreStatus}
          </h3>


          <p>

            Your vehicle's overall condition
            is calculated using maintenance,
            fuel efficiency, expenses and
            insurance information.

          </p>


          <div className="health-score-meta">

            <div>

              <span>
                SCORE
              </span>

              <strong>
                {scorePercentage}%
              </strong>

            </div>


            <div>

              <span>
                STATUS
              </span>

              <strong>
                {scoreStatus}
              </strong>

            </div>

          </div>

        </div>

      </div>


      {/* =================================================
          BREAKDOWN
      ================================================= */}

      <div className="health-breakdown">


        <div className="health-section-heading">

          <div>

            <span>
              DIAGNOSTIC BREAKDOWN
            </span>

            <h3>
              Vehicle systems
            </h3>

          </div>


          <Gauge
            size={16}
            className="health-section-heading-icon"
          />

        </div>


        <div className="health-breakdown-grid">


          <ScoreCard
            icon={
              <Wrench size={15} />
            }
            title="Maintenance"
            score={
              data.breakdown
                .maintenance
                .score
            }
            maxScore={
              data.breakdown
                .maintenance
                .maxScore
            }
          />


          <ScoreCard
            icon={
              <Fuel size={15} />
            }
            title="Fuel efficiency"
            score={
              data.breakdown
                .fuelEfficiency
                .score
            }
            maxScore={
              data.breakdown
                .fuelEfficiency
                .maxScore
            }
            extra={
              data.breakdown
                .fuelEfficiency
                .currentEfficiency
                ? `${data.breakdown.fuelEfficiency.currentEfficiency} km/L`
                : "Not enough data"
            }
          />


          <ScoreCard
            icon={
              <Wallet size={15} />
            }
            title="Expenses"
            score={
              data.breakdown
                .expenses
                .score
            }
            maxScore={
              data.breakdown
                .expenses
                .maxScore
            }
          />


          <ScoreCard
            icon={
              <Shield size={15} />
            }
            title="Insurance"
            score={
              data.breakdown
                .insurance
                .score
            }
            maxScore={
              data.breakdown
                .insurance
                .maxScore
            }
            extra={
              data.breakdown
                .insurance
                .daysRemaining !== null
                ? data.breakdown
                    .insurance
                    .daysRemaining < 0
                  ? "Expired"
                  : `${data.breakdown.insurance.daysRemaining} days remaining`
                : "Not available"
            }
          />

        </div>

      </div>


      {/* =================================================
          RECOMMENDATIONS
      ================================================= */}

      {data.recommendations &&
        data.recommendations.length > 0 && (

        <div className="health-recommendations">

          <div className="health-section-heading">

            <div>

              <span>
                AI / SYSTEM RECOMMENDATIONS
              </span>

              <h3>
                Recommended actions
              </h3>

            </div>


            <AlertTriangle
              size={16}
              className="health-section-heading-icon"
            />

          </div>


          <div className="recommendation-list">

            {data.recommendations.map(
              (
                recommendation,
                index
              ) => (

                <div
                  key={index}
                  className="recommendation-item"
                >

                  <div className="recommendation-number">

                    {String(
                      index + 1
                    ).padStart(2, "0")}

                  </div>


                  <p>
                    {recommendation}
                  </p>

                </div>

              )
            )}

          </div>

        </div>

      )}


      {/* =================================================
          GOOD HEALTH
      ================================================= */}

      {data.recommendations &&
        data.recommendations.length === 0 && (

        <div className="health-clear">

          <div className="health-clear-icon">

            <CheckCircle
              size={17}
            />

          </div>


          <div>

            <strong>
              Vehicle operating normally
            </strong>

            <span>
              No immediate issues were detected.
            </span>

          </div>

        </div>

      )}


      <HealthScoreStyles />

    </div>

  );
}


// =====================================================
// SCORE CARD
// =====================================================

function ScoreCard({
  icon,
  title,
  score,
  maxScore,
  extra,
}) {

  const safeScore =
    Number(score) || 0;

  const safeMax =
    Number(maxScore) || 1;

  const percentage =
    Math.min(
      Math.max(
        (safeScore / safeMax) *
          100,
        0
      ),
      100
    );


  return (

    <div className="health-breakdown-card">


      <div className="health-breakdown-card-top">


        <div className="health-breakdown-icon">

          {icon}

        </div>


        <span>
          {title}
        </span>


        <strong>

          {safeScore}

          <small>
            /{safeMax}
          </small>

        </strong>

      </div>


      <div className="health-progress">

        <div
          style={{
            width:
              `${percentage}%`,
          }}
        />

      </div>


      {extra && (

        <p className="health-breakdown-extra">
          {extra}
        </p>

      )}

    </div>

  );
}


// =====================================================
// STYLES
// =====================================================

function HealthScoreStyles() {

  return (

    <style>{`

      /* ==========================================
         MAIN
      ========================================== */

      .health-score-container {

        width: 100%;

        margin-top: 20px;

        background: #131617;

        border:
          1px solid #292e31;

        border-radius: 12px;

        overflow: hidden;

      }


      /* ==========================================
         HEADER
      ========================================== */

      .health-score-header {

        display: flex;

        align-items: center;

        justify-content: space-between;

        gap: 15px;

        padding:
          19px 22px;

        border-bottom:
          1px solid #292e31;

        background: #151819;

      }


      .health-score-title {

        display: flex;

        align-items: center;

        gap: 10px;

      }


      .health-score-icon {

        width: 35px;

        height: 35px;

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


      .health-kicker {

        display: block;

        color: #4d5458;

        font-size: 6px;

        font-weight: 700;

        letter-spacing: 0.18em;

        margin-bottom: 4px;

      }


      .health-score-header h2 {

        margin: 0;

        color: #d2d5d6;

        font-size: 14px;

        font-weight: 600;

      }


      .health-refresh-button {

        display: flex;

        align-items: center;

        gap: 6px;

        padding:
          7px 10px;

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
          all 0.2s ease;

      }


      .health-refresh-button:hover {

        background:
          rgba(
            232,
            117,
            42,
            0.12
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
         MAIN SCORE
      ========================================== */

      .health-score-main {

        display: flex;

        align-items: center;

        gap: 35px;

        padding:
          30px 25px;

        border-bottom:
          1px solid #252a2c;

      }


      .health-ring-wrapper {

        position: relative;

        width: 142px;

        height: 142px;

        flex-shrink: 0;

      }


      .health-ring {

        display: block;

      }


      .health-ring-progress {

        transition:
          stroke-dashoffset
          0.9s ease;

      }


      .health-ring-content {

        position: absolute;

        inset: 0;

        display: flex;

        align-items: center;

        justify-content: center;

        flex-direction: column;

      }


      .health-ring-content strong {

        color: #e3e5e6;

        font-size: 33px;

        line-height: 1;

        font-weight: 600;

        letter-spacing: -0.05em;

      }


      .health-ring-content span {

        margin-top: 5px;

        color: #4d5458;

        font-size: 7px;

        letter-spacing: 0.1em;

      }


      /* ==========================================
         STATUS
      ========================================== */

      .health-score-status {

        max-width: 500px;

      }


      .health-status-label {

        display: flex;

        align-items: center;

        gap: 6px;

        color: #51585c;

        font-size: 6px;

        font-weight: 700;

        letter-spacing: 0.15em;

      }


      .health-status-label span {

        width: 5px;

        height: 5px;

        border-radius: 50%;

        background: #e8752a;

      }


      .health-score-status h3 {

        margin:
          9px 0 0;

        color: #e8752a;

        font-size: 23px;

        font-weight: 600;

        letter-spacing: -0.035em;

      }


      .health-score-status p {

        margin:
          8px 0 0;

        color: #626a6e;

        font-size: 8px;

        line-height: 1.75;

      }


      .health-score-meta {

        display: flex;

        gap: 25px;

        margin-top: 15px;

        padding-top: 13px;

        border-top:
          1px solid #252a2c;

      }


      .health-score-meta div {

        display: flex;

        flex-direction: column;

      }


      .health-score-meta span {

        color: #454c50;

        font-size: 5px;

        font-weight: 700;

        letter-spacing: 0.14em;

      }


      .health-score-meta strong {

        margin-top: 4px;

        color: #949a9d;

        font-size: 9px;

        font-weight: 500;

      }


      /* ==========================================
         BREAKDOWN
      ========================================== */

      .health-breakdown {

        padding:
          23px 22px;

      }


      .health-section-heading {

        display: flex;

        align-items: center;

        justify-content: space-between;

        margin-bottom: 13px;

      }


      .health-section-heading span {

        display: block;

        color: #4d5458;

        font-size: 5px;

        font-weight: 700;

        letter-spacing: 0.17em;

      }


      .health-section-heading h3 {

        margin:
          4px 0 0;

        color: #aeb3b5;

        font-size: 11px;

        font-weight: 600;

      }


      .health-section-heading-icon {

        color: #41484c;

      }


      .health-breakdown-grid {

        display: grid;

        grid-template-columns:
          repeat(
            4,
            minmax(0, 1fr)
          );

        gap: 7px;

      }


      .health-breakdown-card {

        padding:
          13px;

        border:
          1px solid #292e31;

        border-radius: 8px;

        background: #111314;

        transition:
          border-color 0.2s ease,
          background 0.2s ease;

      }


      .health-breakdown-card:hover {

        background: #151819;

        border-color:
          rgba(
            232,
            117,
            42,
            0.22
          );

      }


      .health-breakdown-card-top {

        display: grid;

        grid-template-columns:
          auto 1fr auto;

        align-items: center;

        gap: 7px;

      }


      .health-breakdown-icon {

        width: 27px;

        height: 27px;

        display: flex;

        align-items: center;

        justify-content: center;

        border-radius: 6px;

        color: #e8752a;

        background:
          rgba(
            232,
            117,
            42,
            0.055
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


      .health-breakdown-card-top span {

        color: #737a7e;

        font-size: 7px;

      }


      .health-breakdown-card-top strong {

        color: #b0b5b7;

        font-size: 9px;

        font-weight: 500;

      }


      .health-breakdown-card-top small {

        color: #454c50;

        font-size: 6px;

        margin-left: 1px;

      }


      .health-progress {

        height: 2px;

        margin-top: 12px;

        overflow: hidden;

        border-radius: 999px;

        background: #252a2c;

      }


      .health-progress div {

        height: 100%;

        border-radius: inherit;

        background: #e8752a;

        transition:
          width 0.8s ease;

      }


      .health-breakdown-extra {

        margin:
          7px 0 0;

        color: #4e565a;

        font-size: 6px;

      }


      /* ==========================================
         RECOMMENDATIONS
      ========================================== */

      .health-recommendations {

        padding:
          0 22px 22px;

      }


      .recommendation-list {

        display: flex;

        flex-direction: column;

        gap: 5px;

      }


      .recommendation-item {

        display: flex;

        align-items: flex-start;

        gap: 10px;

        padding:
          10px 11px;

        border:
          1px solid #292e31;

        border-radius: 7px;

        background: #111314;

      }


      .recommendation-number {

        color: #e8752a;

        font-family: monospace;

        font-size: 7px;

        padding-top: 1px;

      }


      .recommendation-item p {

        margin: 0;

        color: #686f73;

        font-size: 7px;

        line-height: 1.65;

      }


      /* ==========================================
         CLEAR STATE
      ========================================== */

      .health-clear {

        display: flex;

        align-items: center;

        gap: 10px;

        margin:
          0 22px 22px;

        padding:
          13px;

        border:
          1px solid #292e31;

        border-radius: 7px;

        background: #111314;

      }


      .health-clear-icon {

        width: 30px;

        height: 30px;

        display: flex;

        align-items: center;

        justify-content: center;

        border-radius: 6px;

        color: #e8752a;

        background:
          rgba(
            232,
            117,
            42,
            0.06
          );

      }


      .health-clear strong {

        display: block;

        color: #999fa2;

        font-size: 8px;

        font-weight: 600;

      }


      .health-clear span {

        display: block;

        color: #4e565a;

        font-size: 6px;

        margin-top: 3px;

      }


      /* ==========================================
         LOADING
      ========================================== */

      .health-loading {

        min-height: 180px;

        display: flex;

        align-items: center;

        justify-content: center;

        gap: 10px;

      }


      .health-loading-circle {

        width: 37px;

        height: 37px;

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

      }


      .health-loading strong {

        display: block;

        color: #92999c;

        font-size: 9px;

        font-weight: 600;

      }


      .health-loading span {

        display: block;

        color: #4c5458;

        font-size: 6px;

        margin-top: 3px;

      }


      /* ==========================================
         ERROR
      ========================================== */

      .health-error {

        display: flex;

        align-items: center;

        gap: 10px;

        padding:
          20px 22px;

      }


      .health-error-icon {

        width: 37px;

        height: 37px;

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

      }


      .health-error-content {

        flex: 1;

      }


      .health-error-content p {

        margin: 4px 0 0;

        color: #936464;

        font-size: 7px;

      }


      /* ==========================================
         RESPONSIVE
      ========================================== */

      @media (max-width: 900px) {

        .health-breakdown-grid {

          grid-template-columns:
            repeat(
              2,
              minmax(0, 1fr)
            );

        }

      }


      @media (max-width: 650px) {

        .health-score-header {

          align-items:
            flex-start;

        }


        .health-score-main {

          flex-direction:
            column;

          align-items:
            flex-start;

          padding:
            25px 20px;

        }


        .health-score-status {

          max-width:
            none;

        }


        .health-breakdown {

          padding:
            20px;

        }


        .health-recommendations {

          padding:
            0 20px 20px;

        }


        .health-clear {

          margin:
            0 20px 20px;

        }


        .health-breakdown-grid {

          grid-template-columns:
            1fr;

        }


        .health-error {

          align-items:
            flex-start;

          flex-wrap: wrap;

        }


        .health-refresh-button {

          flex-shrink: 0;

        }

      }

    `}</style>

  );
}


export default HealthScore;