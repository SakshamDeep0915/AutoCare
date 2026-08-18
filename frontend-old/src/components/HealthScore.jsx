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

  // ===============================
  // Loading
  // ===============================

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 mt-8">
        <div className="flex justify-center items-center py-8">
          <RefreshCw
            className="animate-spin text-blue-600"
            size={35}
          />

          <span className="ml-3 text-gray-600">
            Calculating vehicle health...
          </span>
        </div>
      </div>
    );
  }

  // ===============================
  // Error
  // ===============================

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 mt-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle
              className="text-red-500"
              size={25}
            />

            <p className="text-red-600 font-medium">
              {error}
            </p>
          </div>

          <button
            onClick={fetchHealthScore}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
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

  // ===============================
  // Score
  // ===============================

  const score = data.healthScore;

  let scoreColor = "text-red-600";
  let circleColor = "border-red-500";
  let bgColor = "bg-red-50";

  if (score >= 90) {
    scoreColor = "text-green-600";
    circleColor = "border-green-500";
    bgColor = "bg-green-50";
  } else if (score >= 75) {
    scoreColor = "text-green-600";
    circleColor = "border-green-500";
    bgColor = "bg-green-50";
  } else if (score >= 60) {
    scoreColor = "text-yellow-600";
    circleColor = "border-yellow-500";
    bgColor = "bg-yellow-50";
  } else if (score >= 40) {
    scoreColor = "text-orange-600";
    circleColor = "border-orange-500";
    bgColor = "bg-orange-50";
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 mt-8">

      {/* Header */}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">

        <div className="flex items-center gap-4">

          <div className="bg-blue-100 p-3 rounded-full">
            <Activity
              className="text-blue-600"
              size={30}
            />
          </div>

          <div>
            <h2 className="text-2xl font-bold">
              Vehicle Health Score
            </h2>

            <p className="text-gray-500">
              Overall condition based on your vehicle data
            </p>
          </div>

        </div>

        <button
          onClick={fetchHealthScore}
          className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium"
        >
          <RefreshCw size={18} />
          Refresh
        </button>

      </div>


      {/* Score Section */}

      <div className="flex flex-col md:flex-row items-center gap-10 mb-8">

        {/* Score Circle */}

        <div
          className={`w-44 h-44 rounded-full border-[12px] ${circleColor} ${bgColor} flex flex-col items-center justify-center`}
        >

          <span
            className={`text-5xl font-bold ${scoreColor}`}
          >
            {score}
          </span>

          <span className="text-gray-500 font-medium">
            / 100
          </span>

        </div>


        {/* Status */}

        <div className="text-center md:text-left">

          <h3
            className={`text-3xl font-bold ${scoreColor}`}
          >
            {data.status}
          </h3>

          <p className="text-gray-600 mt-2 max-w-md">
            Your vehicle's health score is calculated
            using maintenance, fuel efficiency,
            expenses and insurance information.
          </p>

        </div>

      </div>


      {/* Score Breakdown */}

      <div>

        <h3 className="text-xl font-bold mb-5">
          Health Breakdown
        </h3>


        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">

          {/* Maintenance */}

          <ScoreCard
            icon={<Wrench size={22} />}
            title="Maintenance"
            score={
              data.breakdown.maintenance.score
            }
            maxScore={
              data.breakdown.maintenance.maxScore
            }
            iconClass="bg-blue-100 text-blue-600"
          />


          {/* Fuel */}

          <ScoreCard
            icon={<Fuel size={22} />}
            title="Fuel Efficiency"
            score={
              data.breakdown.fuelEfficiency.score
            }
            maxScore={
              data.breakdown.fuelEfficiency.maxScore
            }
            iconClass="bg-orange-100 text-orange-600"
            extra={
              data.breakdown.fuelEfficiency
                .currentEfficiency
                ? `${data.breakdown.fuelEfficiency.currentEfficiency} km/L`
                : "Not enough data"
            }
          />


          {/* Expenses */}

          <ScoreCard
            icon={<Wallet size={22} />}
            title="Expenses"
            score={
              data.breakdown.expenses.score
            }
            maxScore={
              data.breakdown.expenses.maxScore
            }
            iconClass="bg-green-100 text-green-600"
          />


          {/* Insurance */}

          <ScoreCard
            icon={<Shield size={22} />}
            title="Insurance"
            score={
              data.breakdown.insurance.score
            }
            maxScore={
              data.breakdown.insurance.maxScore
            }
            iconClass="bg-purple-100 text-purple-600"
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


      {/* Recommendations */}

      {data.recommendations &&
        data.recommendations.length > 0 && (

        <div className="mt-8">

          <h3 className="text-xl font-bold mb-4">
            💡 Recommendations
          </h3>

          <div className="space-y-3">

            {data.recommendations.map(
              (recommendation, index) => (

              <div
                key={index}
                className="flex items-start gap-3 bg-yellow-50 border border-yellow-200 rounded-lg p-4"
              >

                <AlertTriangle
                  className="text-yellow-600 mt-0.5 flex-shrink-0"
                  size={20}
                />

                <p className="text-gray-700">
                  {recommendation}
                </p>

              </div>

            ))}

          </div>

        </div>
      )}


      {/* Good Health Message */}

      {data.recommendations &&
        data.recommendations.length === 0 && (

        <div className="mt-8 bg-green-50 border border-green-200 rounded-xl p-5 flex items-center gap-3">

          <CheckCircle
            className="text-green-600"
            size={25}
          />

          <p className="text-green-700 font-medium">
            Excellent! No immediate issues were detected
            with your vehicle.
          </p>

        </div>
      )}

    </div>
  );
}


// =====================================================
// Score Card
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

  let progressColor =
    "bg-red-500";

  if (percentage >= 75) {
    progressColor = "bg-green-500";
  } else if (percentage >= 50) {
    progressColor = "bg-yellow-500";
  } else if (percentage >= 40) {
    progressColor = "bg-orange-500";
  }

  return (
    <div className="border rounded-xl p-5">

      <div className="flex items-center gap-3 mb-4">

        <div
          className={`p-3 rounded-full ${iconClass}`}
        >
          {icon}
        </div>

        <h4 className="font-semibold">
          {title}
        </h4>

      </div>


      <div className="flex items-end justify-between mb-2">

        <span className="text-2xl font-bold">
          {score}
        </span>

        <span className="text-gray-400 text-sm">
          / {maxScore}
        </span>

      </div>


      {/* Progress Bar */}

      <div className="w-full bg-gray-200 rounded-full h-2">

        <div
          className={`${progressColor} h-2 rounded-full transition-all duration-500`}
          style={{
            width: `${percentage}%`,
          }}
        />

      </div>


      {extra && (
        <p className="text-xs text-gray-500 mt-3">
          {extra}
        </p>
      )}

    </div>
  );
}

export default HealthScore;