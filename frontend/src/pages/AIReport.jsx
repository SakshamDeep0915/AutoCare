import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

function AIReport() {
  const { vehicleId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [analysis, setAnalysis] = useState("");

  useEffect(() => {
    fetchAnalysis();
  }, []);

  const fetchAnalysis = async () => {
    try {
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

      setAnalysis(res.data.analysis);
    } catch (err) {
      console.error(err);
      alert("Failed to analyze vehicle.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="max-w-5xl mx-auto mt-10 p-6">

        <button
          onClick={() => navigate(-1)}
          className="mb-6 bg-gray-700 text-white px-4 py-2 rounded"
        >
          ← Back
        </button>

        <div className="bg-white rounded-xl shadow-lg p-8">

          <h1 className="text-3xl font-bold mb-6 text-center">
            🤖 AI Vehicle Health Report
          </h1>

          {loading ? (
            <div className="text-center text-xl py-10">
              Analyzing Vehicle...
            </div>
          ) : (
            <div className="bg-gray-100 rounded-lg p-6 whitespace-pre-wrap text-lg leading-8">
              {analysis}
            </div>
          )}

        </div>

      </div>
    </>
  );
}

export default AIReport;