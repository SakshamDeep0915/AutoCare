import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";

import Navbar from "../components/Navbar";

import {
  ArrowLeft,
  Brain,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  ShieldCheck,
  Download,
  Car,
} from "lucide-react";

import { getVehicleById } from "../services/vehicleService";


function AIReport() {
  const { vehicleId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [analysis, setAnalysis] = useState("");

  // Vehicle details
  const [vehicle, setVehicle] = useState(null);


  // =====================================================
  // Fetch AI Analysis + Vehicle
  // =====================================================

  useEffect(() => {
    fetchData();
  }, [vehicleId]);


  const fetchData = async () => {
    try {
      setLoading(true);

      const token =
        localStorage.getItem("token");


      // ===============================================
      // Fetch Vehicle Details
      // ===============================================

      const vehicleRes =
        await getVehicleById(vehicleId);

      setVehicle(
        vehicleRes.data.vehicle
      );


      // ===============================================
      // Fetch AI Analysis
      // ===============================================

      const res = await axios.post(
        `http://localhost:5000/api/ai/analyze/${vehicleId}`,
        {},
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );


      setAnalysis(
        res.data.analysis || ""
      );

    } catch (err) {

      console.error(
        "AI Analysis Error:",
        err
      );


      if (err.response) {

        console.log(
          "Status:",
          err.response.status
        );

        console.log(
          "Backend Response:",
          err.response.data
        );


        alert(
          `AI Analysis Failed\n\nStatus: ${err.response.status}\nMessage: ${
            err.response.data?.message ||
            "Unknown error"
          }`
        );

      } else if (err.request) {

        console.log(
          "No response received:",
          err.request
        );

        alert(
          "Backend server is not responding."
        );

      } else {

        console.log(
          "Request Error:",
          err.message
        );

        alert(
          `Request Error: ${err.message}`
        );
      }

    } finally {

      setLoading(false);

    }
  };


  // =====================================================
  // Analyze Again
  // =====================================================

  const fetchAnalysis = async () => {
    try {

      setLoading(true);

      const token =
        localStorage.getItem("token");


      const res = await axios.post(
        `http://localhost:5000/api/ai/analyze/${vehicleId}`,
        {},
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );


      setAnalysis(
        res.data.analysis || ""
      );

    } catch (err) {

      console.error(
        "AI Analysis Error:",
        err
      );

      alert(
        "Failed to analyze vehicle again."
      );

    } finally {

      setLoading(false);

    }
  };


  // =====================================================
  // Extract Health Score
  // =====================================================

  const scoreMatch =
    analysis.match(
      /Health Score:\s*(\d+)\s*\/\s*100/i
    );

  const healthScore =
    scoreMatch
      ? Number(scoreMatch[1])
      : null;


  // =====================================================
  // Extract Condition
  // =====================================================

  const conditionMatch =
    analysis.match(
      /Condition:\s*([\s\S]*?)(?=\n\s*Recommendations?:|$)/i
    );


  const condition =
    conditionMatch
      ? conditionMatch[1].trim()
      : "Analysis completed";


  // =====================================================
  // Extract Recommendations
  // =====================================================

  const recommendationsMatch =
    analysis.match(
      /Recommendations?:\s*([\s\S]*)/i
    );


  const recommendations =
    recommendationsMatch
      ? recommendationsMatch[1]
          .split("\n")
          .map(
            (item) =>
              item
                .replace(
                  /^[-•*]\s*/,
                  ""
                )
                .trim()
          )
          .filter(Boolean)
      : [];


  // =====================================================
  // Score Color
  // =====================================================

  const getScoreColor = () => {

    if (
      healthScore === null
    ) {
      return "text-gray-600";
    }


    if (
      healthScore >= 80
    ) {
      return "text-green-600";
    }


    if (
      healthScore >= 60
    ) {
      return "text-yellow-600";
    }


    return "text-red-600";
  };


  // =====================================================
  // Score Background
  // =====================================================

  const getScoreBackground = () => {

    if (
      healthScore === null
    ) {
      return "bg-gray-100";
    }


    if (
      healthScore >= 80
    ) {
      return "bg-green-100";
    }


    if (
      healthScore >= 60
    ) {
      return "bg-yellow-100";
    }


    return "bg-red-100";
  };


  // =====================================================
  // Condition Icon
  // =====================================================

  const getConditionIcon = () => {

    if (
      healthScore >= 80
    ) {

      return (
        <CheckCircle
          className="text-green-600"
          size={28}
        />
      );

    }


    if (
      healthScore >= 60
    ) {

      return (
        <AlertTriangle
          className="text-yellow-600"
          size={28}
        />
      );

    }


    return (
      <AlertTriangle
        className="text-red-600"
        size={28}
      />
    );
  };


  // =====================================================
  // DOWNLOAD PDF
  // =====================================================

  const downloadPDF = () => {

    if (!analysis) {
      alert(
        "AI analysis is not available yet."
      );

      return;
    }


    const doc =
      new jsPDF();


    const pageWidth =
      doc.internal.pageSize.getWidth();

    const pageHeight =
      doc.internal.pageSize.getHeight();


    let y = 20;


    // ===================================================
    // Helper: Page Space
    // ===================================================

    const checkPageSpace =
      (requiredSpace = 10) => {

        if (
          y + requiredSpace >
          pageHeight - 20
        ) {

          doc.addPage();

          y = 20;
        }
      };


    // ===================================================
    // Helper: Wrapped Text
    // ===================================================

    const addWrappedText =
      (
        text,
        x,
        fontSize = 11,
        lineHeight = 6
      ) => {

        doc.setFontSize(
          fontSize
        );

        const lines =
          doc.splitTextToSize(
            String(text),
            pageWidth - x - 20
          );


        lines.forEach(
          (line) => {

            checkPageSpace(
              lineHeight
            );

            doc.text(
              line,
              x,
              y
            );

            y +=
              lineHeight;
          }
        );
      };


    // ===================================================
    // HEADER
    // ===================================================

    doc.setFont(
      "helvetica",
      "bold"
    );

    doc.setFontSize(22);

    doc.text(
      "AutoCare AI",
      pageWidth / 2,
      y,
      {
        align: "center",
      }
    );


    y += 9;


    doc.setFontSize(17);

    doc.text(
      "AI Vehicle Health Report",
      pageWidth / 2,
      y,
      {
        align: "center",
      }
    );


    y += 8;


    doc.setFont(
      "helvetica",
      "normal"
    );

    doc.setFontSize(10);

    doc.text(
      `Generated on: ${new Date().toLocaleDateString(
        "en-IN"
      )}`,
      pageWidth / 2,
      y,
      {
        align: "center",
      }
    );


    y += 15;


    // ===================================================
    // VEHICLE INFORMATION
    // ===================================================

    doc.setFont(
      "helvetica",
      "bold"
    );

    doc.setFontSize(15);

    doc.text(
      "Vehicle Information",
      20,
      y
    );


    y += 10;


    doc.setFont(
      "helvetica",
      "normal"
    );

    doc.setFontSize(11);


    const vehicleName =
      vehicle
        ? `${vehicle.brand} ${vehicle.model}`
        : "Vehicle";


    const registrationNumber =
      vehicle?.registrationNumber
        ? vehicle.registrationNumber.toUpperCase()
        : "N/A";


    const vehicleYear =
      vehicle?.year || "N/A";


    const fuelType =
      vehicle?.fuelType || "N/A";


    const odometer =
      vehicle?.odometer !== undefined
        ? `${vehicle.odometer.toLocaleString(
            "en-IN"
          )} km`
        : "N/A";


    addWrappedText(
      `Vehicle: ${vehicleName}`,
      20
    );


    addWrappedText(
      `Registration Number: ${registrationNumber}`,
      20
    );


    addWrappedText(
      `Year: ${vehicleYear}`,
      20
    );


    addWrappedText(
      `Fuel Type: ${fuelType}`,
      20
    );


    addWrappedText(
      `Odometer: ${odometer}`,
      20
    );


    y += 8;


    // ===================================================
    // HEALTH SCORE
    // ===================================================

    checkPageSpace(45);


    doc.setFont(
      "helvetica",
      "bold"
    );

    doc.setFontSize(15);

    doc.text(
      "AI Health Score",
      20,
      y
    );


    y += 12;


    doc.setFontSize(28);

    doc.text(
      `${healthScore ?? "--"} / 100`,
      20,
      y
    );


    y += 12;


    doc.setFontSize(11);

    doc.setFont(
      "helvetica",
      "normal"
    );


    let scoreStatus =
      "Analysis Completed";


    if (
      healthScore !== null
    ) {

      if (
        healthScore >= 80
      ) {
        scoreStatus =
          "Excellent";
      } else if (
        healthScore >= 60
      ) {
        scoreStatus =
          "Fair";
      } else {
        scoreStatus =
          "Needs Attention";
      }
    }


    doc.text(
      `Status: ${scoreStatus}`,
      20,
      y
    );


    y += 15;


    // ===================================================
    // CONDITION
    // ===================================================

    checkPageSpace(35);


    doc.setFont(
      "helvetica",
      "bold"
    );

    doc.setFontSize(15);

    doc.text(
      "Vehicle Condition",
      20,
      y
    );


    y += 10;


    doc.setFont(
      "helvetica",
      "normal"
    );


    addWrappedText(
      condition,
      20,
      11,
      6
    );


    y += 8;


    // ===================================================
    // RECOMMENDATIONS
    // ===================================================

    checkPageSpace(35);


    doc.setFont(
      "helvetica",
      "bold"
    );

    doc.setFontSize(15);

    doc.text(
      "AI Recommendations",
      20,
      y
    );


    y += 10;


    doc.setFont(
      "helvetica",
      "normal"
    );


    if (
      recommendations.length >
      0
    ) {

      recommendations.forEach(
        (
          recommendation,
          index
        ) => {

          checkPageSpace(20);


          addWrappedText(
            `${index + 1}. ${recommendation}`,
            20,
            11,
            6
          );


          y += 3;
        }
      );

    } else {

      addWrappedText(
        "No specific recommendations were returned.",
        20
      );
    }


    y += 8;


    // ===================================================
    // FULL AI RESPONSE
    // ===================================================

    checkPageSpace(35);


    doc.setFont(
      "helvetica",
      "bold"
    );

    doc.setFontSize(15);

    doc.text(
      "Full AI Analysis",
      20,
      y
    );


    y += 10;


    doc.setFont(
      "helvetica",
      "normal"
    );

    doc.setFontSize(10);


    const analysisLines =
      doc.splitTextToSize(
        analysis,
        pageWidth - 40
      );


    analysisLines.forEach(
      (line) => {

        checkPageSpace(7);

        doc.text(
          line,
          20,
          y
        );

        y += 5;

      }
    );


    // ===================================================
    // FOOTER ON EVERY PAGE
    // ===================================================

    const totalPages =
      doc.internal.getNumberOfPages();


    for (
      let page = 1;
      page <= totalPages;
      page++
    ) {

      doc.setPage(page);

      doc.setFont(
        "helvetica",
        "normal"
      );

      doc.setFontSize(9);

      doc.text(
        `AutoCare AI | ${registrationNumber} | Page ${page} of ${totalPages}`,
        pageWidth / 2,
        pageHeight - 10,
        {
          align: "center",
        }
      );
    }


    // ===================================================
    // FILE NAME
    // ===================================================

    const safeRegistration =
      registrationNumber
        .replace(
          /[^a-zA-Z0-9]/g,
          "_"
        );


    doc.save(
      `AI_Vehicle_Report_${safeRegistration}.pdf`
    );
  };


  // =====================================================
  // Loading
  // =====================================================

  if (loading) {

    return (
      <>
        <Navbar />

        <div className="min-h-screen bg-gray-50 py-8 px-4">

          <div className="max-w-5xl mx-auto">

            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">

              <div className="animate-spin mx-auto mb-6 w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full"></div>

              <h2 className="text-2xl font-semibold text-gray-800">
                Analyzing Your Vehicle
              </h2>

              <p className="text-gray-500 mt-2">
                AI is reviewing your vehicle and service history...
              </p>

            </div>

          </div>

        </div>
      </>
    );
  }


  // =====================================================
  // MAIN UI
  // =====================================================

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50 py-8 px-4">

        <div className="max-w-5xl mx-auto">


          {/* =================================================
              Back Button
          ================================================= */}

          <button
            onClick={() =>
              navigate(-1)
            }
            className="flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-6 transition"
          >

            <ArrowLeft size={20} />

            Back to Vehicle

          </button>


          {/* =================================================
              Header
          ================================================= */}

          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-6">

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">


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

                  {vehicle && (

                    <p className="text-sm text-gray-500 mt-2 font-medium">

                      🚗 {vehicle.brand}{" "}
                      {vehicle.model}
                      {" • "}
                      {vehicle.registrationNumber?.toUpperCase()}

                    </p>

                  )}

                </div>

              </div>


              {/* Buttons */}

              <div className="flex flex-wrap gap-3">

                <button
                  onClick={
                    fetchAnalysis
                  }
                  className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-3 rounded-lg transition"
                >

                  <RefreshCw
                    size={18}
                  />

                  Analyze Again

                </button>


                <button
                  onClick={
                    downloadPDF
                  }
                  className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-lg transition"
                >

                  <Download
                    size={18}
                  />

                  Download PDF

                </button>

              </div>

            </div>

          </div>


          {/* =================================================
              Vehicle Summary
          ================================================= */}

          {vehicle && (

            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">

              <div className="flex items-center gap-3 mb-5">

                <div className="bg-blue-100 p-3 rounded-full">

                  <Car
                    className="text-blue-600"
                    size={24}
                  />

                </div>

                <h2 className="text-xl font-bold">
                  Vehicle Summary
                </h2>

              </div>


              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

                <div className="bg-gray-50 rounded-xl p-4">

                  <p className="text-sm text-gray-500">
                    Vehicle
                  </p>

                  <p className="font-semibold mt-1">
                    {vehicle.brand}{" "}
                    {vehicle.model}
                  </p>

                </div>


                <div className="bg-gray-50 rounded-xl p-4">

                  <p className="text-sm text-gray-500">
                    Registration
                  </p>

                  <p className="font-semibold mt-1">
                    {vehicle.registrationNumber?.toUpperCase()}
                  </p>

                </div>


                <div className="bg-gray-50 rounded-xl p-4">

                  <p className="text-sm text-gray-500">
                    Fuel Type
                  </p>

                  <p className="font-semibold mt-1">
                    {vehicle.fuelType}
                  </p>

                </div>


                <div className="bg-gray-50 rounded-xl p-4">

                  <p className="text-sm text-gray-500">
                    Odometer
                  </p>

                  <p className="font-semibold mt-1">
                    {Number(
                      vehicle.odometer
                    ).toLocaleString(
                      "en-IN"
                    )}{" "}
                    km
                  </p>

                </div>

              </div>

            </div>

          )}


          {/* =================================================
              Health Score + Condition
          ================================================= */}

          <div className="grid md:grid-cols-2 gap-6 mb-6">


            {/* Health Score */}

            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">

              <div className="flex justify-center mb-4">

                <ShieldCheck
                  className={
                    getScoreColor()
                  }
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
                    {healthScore ??
                      "--"}
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

                  <li>
                    ✓ Vehicle information
                  </li>

                  <li>
                    ✓ Service history
                  </li>

                  <li>
                    ✓ Maintenance records
                  </li>

                </ul>

              </div>

            </div>

          </div>


          {/* =================================================
              Recommendations
          ================================================= */}

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


            {recommendations.length >
            0 ? (

              <div className="grid md:grid-cols-2 gap-4">

                {recommendations.map(
                  (
                    recommendation,
                    index
                  ) => (

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
                          Recommendation{" "}
                          {index + 1}
                        </h3>

                        <p className="text-gray-600 mt-1 leading-6">
                          {recommendation}
                        </p>

                      </div>

                    </div>

                  )
                )}

              </div>

            ) : (

              <div className="bg-gray-50 rounded-xl p-6 text-gray-600">
                No specific recommendations were returned.
              </div>

            )}

          </div>


          {/* =================================================
              Original AI Response
          ================================================= */}

          <details className="bg-white rounded-2xl shadow-lg p-6 mb-8">

            <summary className="cursor-pointer font-semibold text-gray-700">
              View Full AI Response
            </summary>


            <div className="mt-5 bg-gray-50 rounded-xl p-5 whitespace-pre-wrap text-gray-700 leading-7">
              {analysis}
            </div>

          </details>

        </div>

      </div>
    </>
  );
}


export default AIReport;