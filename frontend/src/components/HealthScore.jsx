import { useEffect, useState } from "react";
import axios from "axios";
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

function HealthScore({ vehicleId }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchHealthScore = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const res = await axios.get(
        `http://localhost:5000/api/health-score/${vehicleId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setData(res.data);
    } catch (err) {
      console.error("Health Score Error:", err);
      setError("Unable to calculate vehicle health score.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (vehicleId) {
      fetchHealthScore();
    }
  }, [vehicleId]);

  // =====================================================
  // Loading
  // =====================================================

  if (loading) {
    return (
      <div className="mt-8 rounded-2xl border border-zinc-800 bg-[#111111] p-8 shadow-xl shadow-black/20">
        <div className="flex items-center justify-center py-8">
          <RefreshCw
            className="animate-spin text-orange-500"
            size={35}
          />

          <span className="ml-3 text-base font-medium text-zinc-400">
            Calculating vehicle health...
          </span>
        </div>
      </div>
    );
  }

  // =====================================================
  // Error
  // =====================================================

  if (error) {
    return (
      <div className="mt-8 rounded-2xl border border-zinc-800 bg-[#111111] p-6 shadow-xl shadow-black/20">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <div className="rounded-full border border-red-500/25 bg-red-500/10 p-3">
              <AlertTriangle
                className="text-red-400"
                size={25}
              />
            </div>

            <p className="text-base font-medium text-red-400">
              {error}
            </p>
          </div>

          {/* ORANGE RETRY BUTTON */}

          <button
            onClick={fetchHealthScore}
            className="flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-orange-950/30 transition-all duration-200 hover:bg-orange-400"
          >
            <RefreshCw size={18} />
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  // =====================================================
  // Score
  // =====================================================

  const score = data.healthScore;

  let scoreColor = "text-red-400";
  let circleColor = "border-red-500";
  let bgColor = "bg-red-500/5";

  if (score >= 90) {
    scoreColor = "text-orange-500";
    circleColor = "border-orange-500";
    bgColor = "bg-orange-500/5";
  } else if (score >= 75) {
    scoreColor = "text-orange-500";
    circleColor = "border-orange-500";
    bgColor = "bg-orange-500/5";
  } else if (score >= 60) {
    scoreColor = "text-orange-400";
    circleColor = "border-orange-400";
    bgColor = "bg-orange-500/5";
  } else if (score >= 40) {
    scoreColor = "text-orange-600";
    circleColor = "border-orange-600";
    bgColor = "bg-orange-500/5";
  }

  return (
    <div className="mt-8 rounded-2xl border border-zinc-800 bg-[#111111] p-6 shadow-xl shadow-black/20 sm:p-8">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-center">

        <div className="flex items-center gap-4">

          <div className="rounded-full border border-orange-500/30 bg-orange-500/10 p-3">
            <Activity
              className="text-orange-500"
              size={30}
            />
          </div>

          <div>
            <h2 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
              Vehicle Health Score
            </h2>

            <p className="mt-1 text-base text-zinc-500">
              Overall condition based on your vehicle data
            </p>
          </div>

        </div>

        {/* ORANGE REFRESH BUTTON */}

        <button
          onClick={fetchHealthScore}
          className="flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-orange-950/30 transition-all duration-200 hover:bg-orange-400"
        >
          <RefreshCw size={18} />
          Refresh
        </button>

      </div>

      {/* =====================================================
          SCORE SECTION
      ===================================================== */}

      <div className="mb-8 flex flex-col items-center gap-10 md:flex-row">

        {/* SCORE CIRCLE */}

        <div
          className={`flex h-44 w-44 shrink-0 flex-col items-center justify-center rounded-full border-[12px] ${circleColor} ${bgColor}`}
        >
          <span
            className={`text-5xl font-black ${scoreColor}`}
          >
            {score}
          </span>

          <span className="font-medium text-zinc-500">
            / 100
          </span>
        </div>

        {/* STATUS */}

        <div className="text-center md:text-left">

          <h3
            className={`text-3xl font-black sm:text-4xl ${scoreColor}`}
          >
            {data.status}
          </h3>

          <p className="mt-3 max-w-xl text-base leading-7 text-zinc-400">
            Your vehicle's health score is calculated
            using maintenance, fuel efficiency,
            expenses and insurance information.
          </p>

        </div>

      </div>

      {/* =====================================================
          HEALTH BREAKDOWN
      ===================================================== */}

      <div>

        <h3 className="mb-5 text-2xl font-black tracking-tight text-white">
          Health Breakdown
        </h3>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          {/* MAINTENANCE */}

          <ScoreCard
            icon={<Wrench size={22} />}
            title="Maintenance"
            score={
              data.breakdown.maintenance.score
            }
            maxScore={
              data.breakdown.maintenance.maxScore
            }
            iconClass="border border-orange-500/20 bg-orange-500/10 text-orange-500"
          />

          {/* FUEL */}

          <ScoreCard
            icon={<Fuel size={22} />}
            title="Fuel Efficiency"
            score={
              data.breakdown.fuelEfficiency.score
            }
            maxScore={
              data.breakdown.fuelEfficiency.maxScore
            }
            iconClass="border border-orange-500/20 bg-orange-500/10 text-orange-500"
            extra={
              data.breakdown.fuelEfficiency
                .currentEfficiency
                ? `${data.breakdown.fuelEfficiency.currentEfficiency} km/L`
                : "Not enough data"
            }
          />

          {/* EXPENSES */}

          <ScoreCard
            icon={<Wallet size={22} />}
            title="Expenses"
            score={
              data.breakdown.expenses.score
            }
            maxScore={
              data.breakdown.expenses.maxScore
            }
            iconClass="border border-orange-500/20 bg-orange-500/10 text-orange-500"
          />

          {/* INSURANCE */}

          <ScoreCard
            icon={<Shield size={22} />}
            title="Insurance"
            score={
              data.breakdown.insurance.score
            }
            maxScore={
              data.breakdown.insurance.maxScore
            }
            iconClass="border border-orange-500/20 bg-orange-500/10 text-orange-500"
            extra={
              data.breakdown.insurance
                .daysRemaining !== null
                ? data.breakdown.insurance
                    .daysRemaining < 0
                  ? "Expired"
                  : `${data.breakdown.insurance.daysRemaining} days remaining`
                : "Not available"
            }
          />

        </div>

      </div>

      {/* =====================================================
          RECOMMENDATIONS
      ===================================================== */}

      {data.recommendations &&
        data.recommendations.length > 0 && (

        <div className="mt-8">

          <h3 className="mb-4 text-2xl font-black tracking-tight text-white">
            💡 Recommendations
          </h3>

          <div className="space-y-3">

            {data.recommendations.map(
              (recommendation, index) => (

              <div
                key={index}
                className="flex items-start gap-3 rounded-xl border border-orange-500/20 bg-orange-500/5 p-4 transition hover:border-orange-500/30 hover:bg-orange-500/10"
              >

                <AlertTriangle
                  className="mt-0.5 flex-shrink-0 text-orange-500"
                  size={20}
                />

                <p className="text-sm leading-6 text-zinc-300 sm:text-base">
                  {recommendation}
                </p>

              </div>

            ))}

          </div>

        </div>
      )}

      {/* =====================================================
          GOOD HEALTH
      ===================================================== */}

      {data.recommendations &&
        data.recommendations.length === 0 && (

        <div className="mt-8 flex items-center gap-3 rounded-xl border border-orange-500/20 bg-orange-500/5 p-5">

          <div className="rounded-full bg-orange-500/10 p-2">

            <CheckCircle
              className="text-orange-500"
              size={25}
            />

          </div>

          <p className="text-base font-semibold text-orange-400">
            Excellent! No immediate issues were detected
            with your vehicle.
          </p>

        </div>
      )}

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
  iconClass,
  extra,
}) {
  const percentage =
    (score / maxScore) * 100;

  // Orange progress for every non-critical score
  let progressColor = "bg-red-500";

  if (percentage >= 40) {
    progressColor = "bg-orange-500";
  }

  return (
    <div className="rounded-xl border border-zinc-800 bg-[#151515] p-5 transition-all duration-300 hover:border-orange-500/30 hover:bg-[#181818]">

      {/* ICON + TITLE */}

      <div className="mb-4 flex items-center gap-3">

        <div
          className={`rounded-full p-3 ${iconClass}`}
        >
          {icon}
        </div>

        <h4 className="text-base font-bold text-zinc-200">
          {title}
        </h4>

      </div>

      {/* SCORE */}

      <div className="mb-2 flex items-end justify-between">

        <span className="text-3xl font-black text-white">
          {score}
        </span>

        <span className="text-sm text-zinc-500">
          / {maxScore}
        </span>

      </div>

      {/* PROGRESS BAR */}

      <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-800">

        <div
          className={`${progressColor} h-2 rounded-full transition-all duration-700`}
          style={{
            width: `${percentage}%`,
          }}
        />

      </div>

      {/* EXTRA INFO */}

      {extra && (
        <p className="mt-3 text-xs font-medium text-zinc-500">
          {extra}
        </p>
      )}

    </div>
  );
}

export default HealthScore;