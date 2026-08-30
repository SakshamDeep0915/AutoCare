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


      setData(
        res.data
      );

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

      <div className="vehicle-health-card">

        <div className="vehicle-health-loading">

          <RefreshCw
            className="vehicle-health-spin"
            size={32}
          />

          <span>
            Calculating vehicle health...
          </span>

        </div>

      </div>

    );

  }


  // =====================================================
  // ERROR
  // =====================================================

  if (error) {

    return (

      <div className="vehicle-health-card">

        <div className="vehicle-health-error">

          <div className="vehicle-health-error-icon">

            <AlertTriangle
              size={27}
            />

          </div>


          <div className="vehicle-health-error-text">

            <strong>
              Unable to calculate vehicle health
            </strong>

            <p>
              {error}
            </p>

          </div>


          <button
            onClick={fetchHealthScore}
            className="vehicle-health-retry"
          >

            <RefreshCw
              size={17}
            />

            Retry

          </button>

        </div>

      </div>

    );

  }


  if (!data) {

    return null;

  }


  const score =
    Number(
      data.healthScore
    ) || 0;


  // =====================================================
  // SCORE COLOR
  // =====================================================

  const getScoreColor = () => {

    if (score >= 80) {

      return "#f97316";

    }

    if (score >= 60) {

      return "#fb923c";

    }

    return "#ef4444";

  };


  const scoreColor =
    getScoreColor();


  // =====================================================
  // CONDITION ICON
  // =====================================================

  const getConditionIcon = () => {

    if (score >= 80) {

      return (
        <CheckCircle
          size={28}
        />
      );

    }

    return (
      <AlertTriangle
        size={28}
      />
    );

  };


  // =====================================================
  // BREAKDOWN DATA
  // =====================================================

  const breakdown = [

    {
      key: "maintenance",
      icon: <Wrench size={23} />,
      title: "Maintenance",
      score:
        data.breakdown
          ?.maintenance
          ?.score ?? 0,
      maxScore:
        data.breakdown
          ?.maintenance
          ?.maxScore ?? 30,
      extra: null,
    },

    {
      key: "fuel",
      icon: <Fuel size={23} />,
      title: "Fuel Efficiency",
      score:
        data.breakdown
          ?.fuelEfficiency
          ?.score ?? 0,
      maxScore:
        data.breakdown
          ?.fuelEfficiency
          ?.maxScore ?? 25,
      extra:
        data.breakdown
          ?.fuelEfficiency
          ?.currentEfficiency
          ? `${data.breakdown.fuelEfficiency.currentEfficiency} km/L`
          : "Not enough data",
    },

    {
      key: "expenses",
      icon: <Wallet size={23} />,
      title: "Expenses",
      score:
        data.breakdown
          ?.expenses
          ?.score ?? 0,
      maxScore:
        data.breakdown
          ?.expenses
          ?.maxScore ?? 20,
      extra: null,
    },

    {
      key: "insurance",
      icon: <Shield size={23} />,
      title: "Insurance",
      score:
        data.breakdown
          ?.insurance
          ?.score ?? 0,
      maxScore:
        data.breakdown
          ?.insurance
          ?.maxScore ?? 25,
      extra:
        data.breakdown
          ?.insurance
          ?.daysRemaining !== null &&
        data.breakdown
          ?.insurance
          ?.daysRemaining !== undefined
          ? data.breakdown
              .insurance
              .daysRemaining < 0
            ? "Expired"
            : `${data.breakdown.insurance.daysRemaining} days remaining`
          : "Not available",
    },

  ];


  // =====================================================
  // RECOMMENDATIONS
  // =====================================================

  const recommendations =
    data.recommendations || [];


  return (

    <div className="vehicle-health-card">


      {/* =================================================
          HEALTH OVERVIEW
      ================================================= */}

      <div className="health-overview">


        {/* SCORE RING */}

        <div className="health-score-ring">

          <div
            className="health-score-ring-fill"
            style={{
              background:
                `conic-gradient(
                  ${scoreColor}
                  ${score * 3.6}deg,
                  #292e31
                  ${score * 3.6}deg
                )`,
            }}
          >

            <div className="health-score-ring-inner">

              <span className="health-score-number">
                {score}
              </span>

              <span className="health-score-total">
                / 100
              </span>

            </div>

          </div>

        </div>


        {/* STATUS */}

        <div className="health-status-content">


          <div className="health-status-label">

            <span
              className="health-status-dot"
            ></span>

            LIVE VEHICLE ASSESSMENT

          </div>


          <div className="health-status-icon">

            <div
              style={{
                color: scoreColor,
              }}
            >

              {getConditionIcon()}

            </div>

          </div>


          <h3
            style={{
              color: scoreColor,
            }}
          >
            {data.status}
          </h3>


          <p className="health-status-description">

            Your vehicle's overall condition is
            calculated using maintenance, fuel
            efficiency, expenses and insurance
            information.

          </p>


          <div className="health-mini-stats">

            <div>

              <span>
                SCORE
              </span>

              <strong>
                {score}%
              </strong>

            </div>


            <div>

              <span>
                STATUS
              </span>

              <strong>
                {data.status}
              </strong>

            </div>

          </div>

        </div>

      </div>


      {/* =================================================
          BREAKDOWN
      ================================================= */}

      <div className="health-breakdown-section">


        <div className="health-breakdown-heading">

          <div>

            <span>
              DIAGNOSTIC BREAKDOWN
            </span>

            <h3>
              Vehicle systems
            </h3>

          </div>


          <Activity
            size={25}
          />

        </div>


        <div className="health-breakdown-grid">

          {breakdown.map(
            (item) => (

            <ScoreCard
              key={item.key}
              icon={item.icon}
              title={item.title}
              score={item.score}
              maxScore={item.maxScore}
              extra={item.extra}
            />

          ))}

        </div>

      </div>


      {/* =================================================
          RECOMMENDATIONS
      ================================================= */}

      {recommendations.length > 0 && (

        <div className="health-recommendations">


          <div className="health-recommendations-heading">

            <div>

              <span>
                AI / SYSTEM RECOMMENDATIONS
              </span>

              <h3>
                Recommended actions
              </h3>

            </div>


            <AlertTriangle
              size={25}
            />

          </div>


          <div className="health-recommendations-list">

            {recommendations.map(
              (
                recommendation,
                index
              ) => (

              <div
                key={index}
                className="health-recommendation"
              >

                <span className="health-recommendation-number">

                  {String(
                    index + 1
                  ).padStart(
                    2,
                    "0"
                  )}

                </span>


                <p>
                  {recommendation}
                </p>

              </div>

            ))}

          </div>

        </div>

      )}


      {/* =================================================
          GOOD HEALTH
      ================================================= */}

      {recommendations.length === 0 && (

        <div className="health-good-message">

          <CheckCircle
            size={25}
          />

          <div>

            <strong>
              Excellent vehicle condition
            </strong>

            <p>
              No immediate issues were detected
              with your vehicle.
            </p>

          </div>

        </div>

      )}


      {/* =================================================
          STYLES
      ================================================= */}

      <style>{`

        /* =================================================
           MAIN CARD
        ================================================= */

        .vehicle-health-card {

          width: 100%;

          background: #101213;

          color: #f1f1f1;

          border-radius: 12px;

          overflow: hidden;

        }


        /* =================================================
           OVERVIEW
        ================================================= */

        .health-overview {

          display: flex;

          align-items: center;

          gap: 55px;

          padding: 48px 45px;

          border-bottom:
            1px solid #292e31;

        }


        /* =================================================
           SCORE RING
        ================================================= */

        .health-score-ring {

          width: 190px;

          height: 190px;

          flex-shrink: 0;

        }


        .health-score-ring-fill {

          width: 100%;

          height: 100%;

          border-radius: 50%;

          display: flex;

          align-items: center;

          justify-content: center;

          transition:
            background 0.5s ease;

        }


        .health-score-ring-inner {

          width: 156px;

          height: 156px;

          border-radius: 50%;

          background: #101213;

          display: flex;

          flex-direction: column;

          align-items: center;

          justify-content: center;

          box-shadow:
            inset 0 0 25px
            rgba(
              0,
              0,
              0,
              0.35
            );

        }


        .health-score-number {

          color: #f2f2f2;

          font-size: 50px;

          line-height: 1;

          font-weight: 700;

          letter-spacing:
            -0.05em;

        }


        .health-score-total {

          color: #697175;

          font-size: 15px;

          margin-top: 7px;

          font-weight: 600;

        }


        /* =================================================
           STATUS
        ================================================= */

        .health-status-content {

          flex: 1;

          min-width: 0;

        }


        .health-status-label {

          display: flex;

          align-items: center;

          gap: 9px;

          color: #70787c;

          font-size: 11px;

          font-weight: 700;

          letter-spacing:
            0.17em;

          margin-bottom: 12px;

        }


        .health-status-dot {

          width: 7px;

          height: 7px;

          flex-shrink: 0;

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

        }


        .health-status-icon {

          display: none;

        }


        .health-status-content h3 {

          margin: 0;

          font-size: 32px;

          line-height: 1.1;

          font-weight: 700;

          letter-spacing:
            -0.035em;

        }


        .health-status-description {

          max-width: 700px;

          margin: 15px 0 0;

          color: #858d91;

          font-size: 15px;

          line-height: 1.7;

        }


        /* =================================================
           MINI STATS
        ================================================= */

        .health-mini-stats {

          display: flex;

          align-items: center;

          gap: 45px;

          margin-top: 25px;

          padding-top: 19px;

          border-top:
            1px solid #292e31;

        }


        .health-mini-stats div {

          display: flex;

          flex-direction: column;

          gap: 5px;

        }


        .health-mini-stats span {

          color: #555e62;

          font-size: 10px;

          font-weight: 700;

          letter-spacing:
            0.14em;

        }


        .health-mini-stats strong {

          color: #c9ced0;

          font-size: 15px;

          font-weight: 600;

        }


        /* =================================================
           BREAKDOWN
        ================================================= */

        .health-breakdown-section {

          padding: 32px 45px 38px;

        }


        .health-breakdown-heading {

          display: flex;

          align-items: center;

          justify-content: space-between;

          margin-bottom: 22px;

        }


        .health-breakdown-heading > div span {

          display: block;

          color: #626a6e;

          font-size: 10px;

          font-weight: 700;

          letter-spacing:
            0.17em;

          margin-bottom: 7px;

        }


        .health-breakdown-heading h3 {

          margin: 0;

          color: #d8dcdd;

          font-size: 23px;

          font-weight: 600;

          letter-spacing:
            -0.025em;

        }


        .health-breakdown-heading > svg {

          color: #596166;

        }


        .health-breakdown-grid {

          display: grid;

          grid-template-columns:
            repeat(
              4,
              minmax(0, 1fr)
            );

          gap: 14px;

        }


        /* =================================================
           SCORE CARD
        ================================================= */

        .health-score-card {

          min-height: 155px;

          padding: 20px;

          border: 1px solid #292e31;

          border-radius: 11px;

          background: #131617;

          transition:
            border-color 0.2s ease,
            transform 0.2s ease;

        }


        .health-score-card:hover {

          transform:
            translateY(-2px);

          border-color:
            rgba(
              232,
              117,
              42,
              0.3
            );

        }


        .health-score-card-top {

          display: flex;

          align-items: center;

          justify-content: space-between;

          gap: 10px;

        }


        .health-score-card-icon {

          width: 43px;

          height: 43px;

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
              0.08
            );

          border: 1px solid
            rgba(
              232,
              117,
              42,
              0.16
            );

        }


        .health-score-card-title {

          flex: 1;

          color: #8f979a;

          font-size: 13px;

          font-weight: 600;

        }


        .health-score-card-value {

          color: #d8dcdd;

          font-size: 16px;

          font-weight: 700;

        }


        .health-score-card-progress {

          height: 5px;

          width: 100%;

          margin-top: 22px;

          overflow: hidden;

          border-radius: 999px;

          background: #292e31;

        }


        .health-score-card-progress span {

          display: block;

          height: 100%;

          border-radius: inherit;

          background: #e8752a;

          transition:
            width 0.5s ease;

        }


        .health-score-card-extra {

          margin-top: 10px;

          color: #626b70;

          font-size: 11px;

          line-height: 1.4;

        }


        /* =================================================
           RECOMMENDATIONS
        ================================================= */

        .health-recommendations {

          padding:
            0 45px
            42px;

        }


        .health-recommendations-heading {

          display: flex;

          align-items: center;

          justify-content: space-between;

          margin-bottom: 18px;

        }


        .health-recommendations-heading span {

          display: block;

          color: #626a6e;

          font-size: 10px;

          font-weight: 700;

          letter-spacing:
            0.17em;

          margin-bottom: 7px;

        }


        .health-recommendations-heading h3 {

          margin: 0;

          color: #d8dcdd;

          font-size: 23px;

          font-weight: 600;

        }


        .health-recommendations-heading > svg {

          color: #596166;

        }


        .health-recommendations-list {

          display: flex;

          flex-direction: column;

          gap: 10px;

        }


        .health-recommendation {

          display: flex;

          align-items: flex-start;

          gap: 16px;

          padding: 17px 19px;

          border:
            1px solid #292e31;

          border-radius: 9px;

          background: #121415;

        }


        .health-recommendation-number {

          color: #e8752a;

          font-family: monospace;

          font-size: 12px;

          font-weight: 700;

          min-width: 25px;

          padding-top: 2px;

        }


        .health-recommendation p {

          margin: 0;

          color: #a5abad;

          font-size: 14px;

          line-height: 1.6;

        }


        /* =================================================
           GOOD HEALTH
        ================================================= */

        .health-good-message {

          display: flex;

          align-items: center;

          gap: 14px;

          margin:
            0 45px
            42px;

          padding: 20px;

          border:
            1px solid
            rgba(
              232,
              117,
              42,
              0.2
            );

          border-radius: 10px;

          background:
            rgba(
              232,
              117,
              42,
              0.05
            );

          color: #e8752a;

        }


        .health-good-message strong {

          display: block;

          color: #d8dcdd;

          font-size: 15px;

        }


        .health-good-message p {

          margin: 4px 0 0;

          color: #747d81;

          font-size: 13px;

        }


        /* =================================================
           LOADING
        ================================================= */

        .vehicle-health-loading {

          min-height: 260px;

          display: flex;

          align-items: center;

          justify-content: center;

          gap: 14px;

          color: #929a9e;

          font-size: 15px;

          font-weight: 500;

        }


        .vehicle-health-spin {

          color: #f97316;

          animation:
            vehicle-health-spin
            1s linear infinite;

        }


        @keyframes vehicle-health-spin {

          to {
            transform: rotate(360deg);
          }

        }


        /* =================================================
           ERROR
        ================================================= */

        .vehicle-health-error {

          min-height: 220px;

          padding: 35px;

          display: flex;

          align-items: center;

          gap: 18px;

        }


        .vehicle-health-error-icon {

          width: 50px;

          height: 50px;

          display: flex;

          align-items: center;

          justify-content: center;

          flex-shrink: 0;

          border-radius: 10px;

          color: #ef4444;

          background:
            rgba(
              239,
              68,
              68,
              0.08
            );

          border:
            1px solid
            rgba(
              239,
              68,
              68,
              0.2
            );

        }


        .vehicle-health-error-text {

          flex: 1;

        }


        .vehicle-health-error-text strong {

          color: #d7dbdc;

          font-size: 16px;

        }


        .vehicle-health-error-text p {

          margin: 5px 0 0;

          color: #777f83;

          font-size: 13px;

        }


        .vehicle-health-retry {

          display: flex;

          align-items: center;

          gap: 8px;

          padding: 11px 17px;

          border: 1px solid
            rgba(
              249,
              115,
              22,
              0.3
            );

          border-radius: 8px;

          background:
            rgba(
              249,
              115,
              22,
              0.08
            );

          color: #f97316;

          font-size: 13px;

          font-weight: 600;

          cursor: pointer;

        }


        /* =================================================
           TABLET
        ================================================= */

        @media (max-width: 1000px) {

          .health-overview {

            gap: 35px;

            padding:
              40px 30px;

          }


          .health-breakdown-section {

            padding:
              30px;

          }


          .health-recommendations {

            padding:
              0 30px
              35px;

          }


          .health-good-message {

            margin:
              0 30px
              35px;

          }


          .health-breakdown-grid {

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

          .health-overview {

            flex-direction: column;

            align-items: center;

            text-align: center;

            gap: 28px;

            padding:
              35px 20px;

          }


          .health-score-ring {

            width: 165px;

            height: 165px;

          }


          .health-score-ring-inner {

            width: 135px;

            height: 135px;

          }


          .health-score-number {

            font-size: 44px;

          }


          .health-status-content {

            width: 100%;

          }


          .health-status-label {

            justify-content: center;

            font-size: 9px;

          }


          .health-status-content h3 {

            font-size: 29px;

          }


          .health-status-description {

            font-size: 14px;

          }


          .health-mini-stats {

            justify-content: center;

            gap: 35px;

          }


          .health-breakdown-section {

            padding:
              28px 20px
              32px;

          }


          .health-breakdown-grid {

            grid-template-columns: 1fr;

          }


          .health-breakdown-heading h3,
          .health-recommendations-heading h3 {

            font-size: 20px;

          }


          .health-recommendations {

            padding:
              0 20px
              30px;

          }


          .health-recommendation p {

            font-size: 13px;

          }


          .health-good-message {

            margin:
              0 20px
              30px;

          }


          .vehicle-health-error {

            flex-direction: column;

            align-items: flex-start;

            padding: 25px 20px;

          }

        }

      `}</style>

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

  const percentage =
    maxScore > 0
      ? Math.min(
          100,
          Math.max(
            0,
            (score / maxScore) *
              100
          )
        )
      : 0;


  return (

    <div className="health-score-card">


      <div className="health-score-card-top">


        <div className="health-score-card-icon">

          {icon}

        </div>


        <span className="health-score-card-title">

          {title}

        </span>


        <strong className="health-score-card-value">

          {score}
          <span
            style={{
              color: "#596166",
              fontSize: "11px",
              fontWeight: 500,
            }}
          >
            {" "}
            / {maxScore}
          </span>

        </strong>

      </div>


      <div className="health-score-card-progress">

        <span
          style={{
            width:
              `${percentage}%`,
          }}
        ></span>

      </div>


      {extra && (

        <div className="health-score-card-extra">

          {extra}

        </div>

      )}

    </div>

  );
}


export default HealthScore;