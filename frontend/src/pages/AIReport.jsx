import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import {
  ArrowLeft,
  Brain,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";

function AIReport() {
  const { vehicleId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [analysis, setAnalysis] = useState("");

  useEffect(() => {
    fetchAnalysis();
  }, [vehicleId]);

  const fetchAnalysis = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await axios.post(
        `http://localhost:5000/api/ai/analyze/${vehicleId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAnalysis(res.data.analysis || "");
    } catch (err) {
      console.error("AI Analysis Error:", err);

      if(err.response) {
        console.log("Status:", err.response.status);
        console.log("Backend Response:", err.response.data);

        alert(
          `AI Analysis Failed\n\nStatus: ${err.response.status}\nMessage: ${
            err.response.data?.message || "Unknown error"
          }`
        );
      } else if (err.request) {
        console.log("No response received:", err.request);
        alert("Backend server is not responding.");
      } else {
        console.log("Request Error:", err.message);
        alert(`Request Error: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Extract health score
  const scoreMatch = analysis.match(/Health Score:\s*(\d+)\s*\/\s*100/i);
  const healthScore = scoreMatch ? Number(scoreMatch[1]) : null;

  // Extract condition
  const conditionMatch = analysis.match(
    /Condition:\s*([\s\S]*?)(?=\n\s*Recommendations?:|$)/i
  );

  const condition = conditionMatch
    ? conditionMatch[1].trim()
    : "Analysis completed";

  // Extract recommendations
  const recommendationsMatch = analysis.match(
    /Recommendations?:\s*([\s\S]*)/i
  );

  const recommendations = recommendationsMatch
    ? recommendationsMatch[1]
        .split("\n")
        .map((item) => item.replace(/^[-•*]\s*/, "").trim())
        .filter(Boolean)
    : [];

  const getScoreColor = () => {
    if (healthScore === null) return "text-gray-600";

    if (healthScore >= 80) return "text-green-600";
    if (healthScore >= 60) return "text-yellow-600";

    return "text-red-600";
  };

  const getScoreBackground = () => {
    if (healthScore === null) return "bg-gray-100";

    if (healthScore >= 80) return "bg-green-100";
    if (healthScore >= 60) return "bg-yellow-100";

    return "bg-red-100";
  };

  const getConditionIcon = () => {
    if (healthScore >= 80) {
      return <CheckCircle className="text-green-600" size={28} />;
    }

    if (healthScore >= 60) {
      return <AlertTriangle className="text-yellow-600" size={28} />;
    }

    return <AlertTriangle className="text-red-600" size={28} />;
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50 py-8 px-4">

        <div className="max-w-5xl mx-auto">

          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-6 transition"
          >
            <ArrowLeft size={20} />
            Back to Vehicle
          </button>

          {/* Main Header */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-6">

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

              <div className="flex items-center gap-4">

                <div className="bg-purple-100 p-4 rounded-full">
                  <Brain
                    className="text-purple-600"
                    size={32}
                  />
                </div>

                <div>
                  <h1 className="text-3xl font-bold text-gray-800">
                    AI Vehicle Health Report
                  </h1>

                  <p className="text-gray-500 mt-1">
                    Powered by AI vehicle analysis
                  </p>
                </div>

              </div>

              {!loading && (
                <button
                  onClick={fetchAnalysis}
                  className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-3 rounded-lg transition"
                >
                  <RefreshCw size={18} />
                  Analyze Again
                </button>
              )}

            </div>

          </div>

          {loading ? (

            /* Loading */
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">

              <div className="animate-spin mx-auto mb-6 w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full"></div>

              <h2 className="text-2xl font-semibold text-gray-800">
                Analyzing Your Vehicle
              </h2>

              <p className="text-gray-500 mt-2">
                AI is reviewing your vehicle and service history...
              </p>

            </div>

          ) : (

            <>
              {/* Health Score + Condition */}
              <div className="grid md:grid-cols-2 gap-6 mb-6">

                {/* Health Score */}
                <div className="bg-white rounded-2xl shadow-lg p-8 text-center">

                  <div className="flex justify-center mb-4">
                    <ShieldCheck
                      className={getScoreColor()}
                      size={42}
                    />
                  </div>

                  <h2 className="text-xl font-semibold text-gray-700">
                    Vehicle Health Score
                  </h2>

                  <div
                    className={`inline-flex items-center justify-center w-36 h-36 rounded-full ${getScoreBackground()} mt-5`}
                  >
                    <div>
                      <div
                        className={`text-5xl font-bold ${getScoreColor()}`}
                      >
                        {healthScore ?? "--"}
                      </div>

                      <div className="text-gray-500">
                        / 100
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-500 mt-4">
                    AI-generated vehicle health assessment
                  </p>

                </div>

                {/* Condition */}
                <div className="bg-white rounded-2xl shadow-lg p-8">

                  <div className="flex items-center gap-3 mb-5">
                    {getConditionIcon()}

                    <h2 className="text-xl font-semibold text-gray-700">
                      Vehicle Condition
                    </h2>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-5">
                    <p className="text-gray-700 leading-7">
                      {condition}
                    </p>
                  </div>

                  <div className="mt-6">
                    <p className="text-sm text-gray-500">
                      AI assessment based on:
                    </p>

                    <ul className="mt-3 space-y-2 text-gray-600">
                      <li>✓ Vehicle information</li>
                      <li>✓ Service history</li>
                      <li>✓ Maintenance records</li>
                    </ul>
                  </div>

                </div>

              </div>

              {/* Recommendations */}
              <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">

                <div className="flex items-center gap-3 mb-6">

                  <div className="bg-blue-100 p-3 rounded-full">
                    <Brain
                      className="text-blue-600"
                      size={25}
                    />
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      AI Recommendations
                    </h2>

                    <p className="text-gray-500">
                      Recommended maintenance actions
                    </p>
                  </div>

                </div>

                {recommendations.length > 0 ? (

                  <div className="grid md:grid-cols-2 gap-4">

                    {recommendations.map((recommendation, index) => (

                      <div
                        key={index}
                        className="flex gap-4 bg-gray-50 hover:bg-blue-50 border border-gray-100 rounded-xl p-5 transition"
                      >

                        <div className="flex-shrink-0">
                          <div className="bg-green-100 p-2 rounded-full">
                            <CheckCircle
                              className="text-green-600"
                              size={22}
                            />
                          </div>
                        </div>

                        <div>
                          <h3 className="font-semibold text-gray-800">
                            Recommendation {index + 1}
                          </h3>

                          <p className="text-gray-600 mt-1 leading-6">
                            {recommendation}
                          </p>
                        </div>

                      </div>

                    ))}

                  </div>

                ) : (

                  <div className="bg-gray-50 rounded-xl p-6 text-gray-600">
                    No specific recommendations were returned.
                  </div>

                )}

              </div>

              {/* Original AI Response */}
              <details className="bg-white rounded-2xl shadow-lg p-6 mb-8">

                <summary className="cursor-pointer font-semibold text-gray-700">
                  View Full AI Response
                </summary>

                <div className="mt-5 bg-gray-50 rounded-xl p-5 whitespace-pre-wrap text-gray-700 leading-7">
                  {analysis}
                </div>

              </details>

            </>

          )}

        </div>

      </div>
    </>
  );
}

export default AIReport;