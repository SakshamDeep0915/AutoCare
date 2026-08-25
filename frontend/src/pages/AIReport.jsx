import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";

import Navbar from "../components/Navbar";
import API from "../services/api";

import {
  ArrowLeft,
  Brain,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  ShieldCheck,
  Download,
  Car,
  Activity,
  Wrench,
  Gauge,
  CalendarDays,
  Sparkles,
  ChevronDown,
} from "lucide-react";

import { getVehicleById } from "../services/vehicleService";

function AIReport() {
  const { vehicleId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [analysis, setAnalysis] = useState("");
  const [vehicle, setVehicle] = useState(null);

  // =====================================================
  // FETCH VEHICLE + AI ANALYSIS
  // =====================================================

  useEffect(() => {
    fetchData();
  }, [vehicleId]);

  const fetchData = async () => {
    try {
      setLoading(true);

      const vehicleRes =
        await getVehicleById(vehicleId);

      setVehicle(vehicleRes.data.vehicle);

      const res = await API.post(
        `/ai/analyze/${vehicleId}`,
        {}
      );

      setAnalysis(res.data.analysis || "");
    } catch (err) {
      console.error("AI Analysis Error:", err);

      if (err.response) {
        alert(
          `AI Analysis Failed\n\nStatus: ${err.response.status}\nMessage: ${
            err.response.data?.message ||
            "Unknown error"
          }`
        );
      } else if (err.request) {
        alert("Backend server is not responding.");
      } else {
        alert(`Request Error: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // ANALYZE AGAIN
  // =====================================================

  const fetchAnalysis = async () => {
    try {
      setLoading(true);

      const res = await API.post(
        `/ai/analyze/${vehicleId}`,
        {}
      );

      setAnalysis(res.data.analysis || "");
    } catch (err) {
      console.error("AI Analysis Error:", err);

      alert(
        err.response?.data?.message ||
          "Failed to analyze vehicle again."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // EXTRACT HEALTH SCORE
  // =====================================================

  const scoreMatch = analysis.match(
    /Health Score:\s*(\d+)\s*\/\s*100/i
  );

  const healthScore = scoreMatch
    ? Number(scoreMatch[1])
    : null;

  // =====================================================
  // CONDITION
  // =====================================================

  const conditionMatch = analysis.match(
    /Condition:\s*([\s\S]*?)(?=\n\s*Recommendations?:|$)/i
  );

  const condition = conditionMatch
    ? conditionMatch[1].trim()
    : "Analysis completed";

  // =====================================================
  // RECOMMENDATIONS
  // =====================================================

  const recommendationsMatch = analysis.match(
    /Recommendations?:\s*([\s\S]*)/i
  );

  const recommendations = recommendationsMatch
    ? recommendationsMatch[1]
        .split("\n")
        .map((item) =>
          item
            .replace(/^[-•*]\s*/, "")
            .trim()
        )
        .filter(Boolean)
    : [];

  // =====================================================
  // SCORE STATUS
  // =====================================================

  const getScoreStatus = () => {
    if (healthScore === null) return "Awaiting analysis";

    if (healthScore >= 80) return "Excellent";

    if (healthScore >= 60) return "Needs attention";

    return "Critical";
  };

  const getScoreColor = () => {
    if (healthScore === null)
      return "text-zinc-500";

    if (healthScore >= 80)
      return "text-orange-500";

    if (healthScore >= 60)
      return "text-orange-400";

    return "text-red-400";
  };

  const getScoreBar = () => {
    if (healthScore === null)
      return 0;

    return Math.min(
      Math.max(healthScore, 0),
      100
    );
  };

  const getConditionIcon = () => {
    if (healthScore >= 80) {
      return (
        <CheckCircle
          size={22}
          className="text-orange-500"
        />
      );
    }

    if (healthScore >= 60) {
      return (
        <AlertTriangle
          size={22}
          className="text-orange-400"
        />
      );
    }

    return (
      <AlertTriangle
        size={22}
        className="text-red-400"
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

    const doc = new jsPDF();

    const pageWidth =
      doc.internal.pageSize.getWidth();

    const pageHeight =
      doc.internal.pageSize.getHeight();

    let y = 20;

    const checkPageSpace = (
      requiredSpace = 10
    ) => {
      if (
        y + requiredSpace >
        pageHeight - 20
      ) {
        doc.addPage();
        y = 20;
      }
    };

    const addWrappedText = (
      text,
      x,
      fontSize = 11,
      lineHeight = 6
    ) => {
      doc.setFontSize(fontSize);

      const lines =
        doc.splitTextToSize(
          String(text),
          pageWidth - x - 20
        );

      lines.forEach((line) => {
        checkPageSpace(lineHeight);

        doc.text(line, x, y);

        y += lineHeight;
      });
    };

    // HEADER

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

    // VEHICLE

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

    const vehicleName = vehicle
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
        ? `${Number(
            vehicle.odometer
          ).toLocaleString(
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

    // SCORE

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

    doc.text(
      `Status: ${getScoreStatus()}`,
      20,
      y
    );

    y += 15;

    // CONDITION

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

    // RECOMMENDATIONS

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

    if (recommendations.length > 0) {
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

    // FULL RESPONSE

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

    // FOOTER

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

    const safeRegistration =
      registrationNumber.replace(
        /[^a-zA-Z0-9]/g,
        "_"
      );

    doc.save(
      `AI_Vehicle_Report_${safeRegistration}.pdf`
    );
  };

  // =====================================================
  // LOADING SCREEN
  // =====================================================

  if (loading) {
    return (
      <>
        <Navbar />

        <div className="min-h-screen bg-[#0d0f10] text-white flex items-center justify-center px-5">

          <div className="w-full max-w-xl">

            <div className="relative overflow-hidden bg-[#151718] border border-[#292c2f] rounded-2xl p-10 text-center">

              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-orange-500 to-transparent" />

              <div className="relative mx-auto w-20 h-20 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">

                <Brain
                  size={36}
                  className="text-orange-500"
                />

                <div className="absolute inset-0 rounded-2xl border border-orange-500/20 animate-pulse" />

              </div>

              <p className="mt-7 text-[11px] tracking-[0.25em] uppercase text-orange-500 font-semibold">
                AutoCare Intelligence
              </p>

              <h2 className="text-2xl font-semibold mt-2">
                Reading vehicle data
              </h2>

              <p className="text-gray-500 mt-2">
                Reviewing vehicle history and maintenance records.
              </p>

              <div className="mt-8 h-1 bg-[#242729] rounded-full overflow-hidden">

                <div className="h-full w-1/2 bg-orange-500 rounded-full animate-pulse" />

              </div>

              <p className="text-xs text-gray-600 mt-3">
                Generating health assessment...
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

      <main className="min-h-screen bg-[#0d0f10] text-white">

        {/* ==========================================
            TOP NAVIGATION
        ========================================== */}

        <div className="border-b border-[#25282b] bg-[#101213]">

          <div className="max-w-6xl mx-auto px-5 lg:px-8 py-5">

            <button
              onClick={() => navigate(-1)}
              className="group flex items-center gap-2 text-sm text-gray-500 hover:text-orange-500 transition"
            >
              <ArrowLeft
                size={17}
                className="group-hover:-translate-x-1 transition"
              />

              Vehicle
            </button>

          </div>

        </div>

        <div className="max-w-6xl mx-auto px-5 lg:px-8 py-10">

          {/* ==========================================
              REPORT HEADER
          ========================================== */}

          <section className="mb-8">

            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-7">

              <div>

                <div className="flex items-center gap-3 mb-4">

                  <span className="text-[11px] tracking-[0.25em] uppercase text-orange-500 font-semibold">
                    Vehicle Intelligence
                  </span>

                  <span className="h-px w-8 bg-orange-500/50" />

                  <span className="text-[11px] tracking-wider text-gray-600">
                    AI REPORT
                  </span>

                </div>

                <h1 className="text-3xl md:text-5xl font-semibold tracking-tight">
                  Vehicle health
                </h1>

                <p className="text-gray-500 mt-2 max-w-xl">
                  A data-driven assessment of your vehicle's current condition and recommended maintenance actions.
                </p>

                {vehicle && (
                  <div className="flex flex-wrap items-center gap-3 mt-5">

                    <span className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[#151718] border border-[#292c2f] text-sm text-gray-300">

                      <Car
                        size={15}
                        className="text-orange-500"
                      />

                      {vehicle.brand}{" "}
                      {vehicle.model}

                    </span>

                    <span className="px-3 py-2 rounded-lg bg-[#151718] border border-[#292c2f] text-xs tracking-wider text-gray-500 uppercase">
                      {vehicle.registrationNumber?.toUpperCase()}
                    </span>

                  </div>
                )}

              </div>

              <div className="flex flex-wrap gap-3">

                <button
                  onClick={fetchAnalysis}
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-[#303438] text-gray-300 hover:text-white hover:border-orange-500/40 transition font-medium"
                >
                  <RefreshCw size={17} />

                  Analyze again
                </button>

                <button
                  onClick={downloadPDF}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-orange-500 hover:bg-orange-400 text-black transition font-semibold"
                >
                  <Download size={17} />

                  Download report
                </button>

              </div>

            </div>

          </section>

          {/* ==========================================
              MAIN DIAGNOSTIC PANEL
          ========================================== */}

          <section className="grid lg:grid-cols-[1.15fr_0.85fr] gap-6 mb-6">

            {/* HEALTH SCORE */}

            <div className="relative overflow-hidden bg-[#151718] border border-[#292c2f] rounded-2xl p-7 md:p-9">

              <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/[0.025] rounded-full blur-3xl pointer-events-none" />

              <div className="relative">

                <div className="flex items-start justify-between gap-5">

                  <div>

                    <p className="text-[11px] tracking-[0.2em] uppercase text-gray-600">
                      Primary diagnostic
                    </p>

                    <h2 className="text-xl font-semibold mt-1">
                      Vehicle health score
                    </h2>

                  </div>

                  <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">

                    <ShieldCheck
                      size={20}
                      className={getScoreColor()}
                    />

                  </div>

                </div>

                <div className="mt-10 flex flex-col sm:flex-row sm:items-end gap-8">

                  <div>

                    <div className="flex items-baseline">

                      <span
                        className={`text-7xl md:text-8xl font-semibold tracking-[-0.06em] ${getScoreColor()}`}
                      >
                        {healthScore ?? "--"}
                      </span>

                      <span className="text-xl text-gray-600 ml-2">
                        /100
                      </span>

                    </div>

                    <div className="flex items-center gap-2 mt-3">

                      {getConditionIcon()}

                      <span className="text-sm text-gray-300">
                        {getScoreStatus()}
                      </span>

                    </div>

                  </div>

                  <div className="flex-1 pb-2">

                    <div className="flex justify-between text-[11px] uppercase tracking-wider text-gray-600 mb-2">

                      <span>
                        Vehicle condition
                      </span>

                      <span>
                        {healthScore ?? 0}%
                      </span>

                    </div>

                    <div className="h-2 bg-[#242729] rounded-full overflow-hidden">

                      <div
                        className="h-full bg-orange-500 rounded-full transition-all duration-700"
                        style={{
                          width: `${getScoreBar()}%`,
                        }}
                      />

                    </div>

                    <p className="text-xs text-gray-600 mt-3">
                      AI-generated assessment based on available vehicle records.
                    </p>

                  </div>

                </div>

              </div>

            </div>

            {/* VEHICLE SNAPSHOT */}

            <div className="bg-[#151718] border border-[#292c2f] rounded-2xl p-7">

              <div className="flex items-center justify-between mb-7">

                <div>

                  <p className="text-[11px] tracking-[0.2em] uppercase text-gray-600">
                    Vehicle data
                  </p>

                  <h2 className="text-xl font-semibold mt-1">
                    Snapshot
                  </h2>

                </div>

                <Gauge
                  size={21}
                  className="text-gray-600"
                />

              </div>

              {vehicle && (

                <div className="space-y-0">

                  <SnapshotRow
                    icon={<Car size={16} />}
                    label="Vehicle"
                    value={`${vehicle.brand} ${vehicle.model}`}
                  />

                  <SnapshotRow
                    icon={<CalendarDays size={16} />}
                    label="Year"
                    value={vehicle.year || "—"}
                  />

                  <SnapshotRow
                    icon={<Activity size={16} />}
                    label="Fuel"
                    value={vehicle.fuelType || "—"}
                  />

                  <SnapshotRow
                    icon={<Gauge size={16} />}
                    label="Odometer"
                    value={
                      vehicle.odometer !== undefined
                        ? `${Number(
                            vehicle.odometer
                          ).toLocaleString(
                            "en-IN"
                          )} km`
                        : "—"
                    }
                  />

                </div>

              )}

            </div>

          </section>

          {/* ==========================================
              CONDITION
          ========================================== */}

          <section className="bg-[#151718] border border-[#292c2f] rounded-2xl overflow-hidden mb-6">

            <div className="px-7 py-5 border-b border-[#292c2f] flex items-center justify-between">

              <div className="flex items-center gap-3">

                {getConditionIcon()}

                <div>

                  <p className="text-[11px] tracking-[0.2em] uppercase text-gray-600">
                    Assessment
                  </p>

                  <h2 className="text-lg font-semibold">
                    Current condition
                  </h2>

                </div>

              </div>

              <span className="hidden sm:block text-[10px] tracking-wider uppercase text-gray-600">
                AI evaluation
              </span>

            </div>

            <div className="p-7">

              <p className="text-gray-300 leading-8 text-[15px] max-w-4xl">
                {condition}
              </p>

            </div>

          </section>

          {/* ==========================================
              RECOMMENDATIONS
          ========================================== */}

          <section className="bg-[#151718] border border-[#292c2f] rounded-2xl overflow-hidden mb-6">

            <div className="px-7 py-6 border-b border-[#292c2f]">

              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">

                <div>

                  <div className="flex items-center gap-3">

                    <Wrench
                      size={19}
                      className="text-orange-500"
                    />

                    <h2 className="text-xl font-semibold">
                      Recommended actions
                    </h2>

                  </div>

                  <p className="text-sm text-gray-600 mt-2">
                    Maintenance actions identified from your vehicle data.
                  </p>

                </div>

                <span className="text-xs text-gray-600">
                  {recommendations.length}{" "}
                  {recommendations.length === 1
                    ? "action"
                    : "actions"}
                </span>

              </div>

            </div>

            <div className="p-7">

              {recommendations.length > 0 ? (

                <div className="space-y-3">

                  {recommendations.map(
                    (
                      recommendation,
                      index
                    ) => (

                      <div
                        key={index}
                        className="group flex gap-5 p-5 bg-[#101213] border border-[#292c2f] hover:border-orange-500/30 rounded-xl transition"
                      >

                        <div className="shrink-0">

                          <div className="w-9 h-9 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500 font-semibold text-sm">
                            {String(
                              index + 1
                            ).padStart(
                              2,
                              "0"
                            )}
                          </div>

                        </div>

                        <div className="flex-1">

                          <div className="flex items-start justify-between gap-4">

                            <p className="text-gray-300 leading-7">
                              {recommendation}
                            </p>

                            <CheckCircle
                              size={17}
                              className="text-gray-700 group-hover:text-orange-500 transition shrink-0 mt-1"
                            />

                          </div>

                        </div>

                      </div>

                    )
                  )}

                </div>

              ) : (

                <div className="py-8 text-center">

                  <Wrench
                    size={28}
                    className="mx-auto text-gray-700"
                  />

                  <p className="text-gray-500 mt-3">
                    No specific recommendations were returned.
                  </p>

                </div>

              )}

            </div>

          </section>

          {/* ==========================================
              AI DETAILS
          ========================================== */}

          <details className="group bg-[#151718] border border-[#292c2f] rounded-2xl overflow-hidden mb-8">

            <summary className="cursor-pointer list-none px-7 py-5 flex items-center justify-between hover:bg-[#181a1c] transition">

              <div className="flex items-center gap-3">

                <Sparkles
                  size={18}
                  className="text-orange-500"
                />

                <div>

                  <p className="font-semibold text-gray-200">
                    Full AI analysis
                  </p>

                  <p className="text-xs text-gray-600 mt-1">
                    View the complete response generated by AutoCare AI.
                  </p>

                </div>

              </div>

              <ChevronDown
                size={18}
                className="text-gray-600 group-open:rotate-180 transition-transform"
              />

            </summary>

            <div className="px-7 pb-7">

              <div className="bg-[#101213] border border-[#292c2f] rounded-xl p-6 whitespace-pre-wrap text-gray-400 leading-7 text-sm">
                {analysis}
              </div>

            </div>

          </details>

        </div>

      </main>
    </>
  );
}

// =====================================================
// SNAPSHOT ROW
// =====================================================

function SnapshotRow({
  icon,
  label,
  value,
}) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-[#242729] last:border-b-0">

      <div className="flex items-center gap-3 text-gray-600">

        {icon}

        <span className="text-sm">
          {label}
        </span>

      </div>

      <span className="text-sm text-gray-300 text-right max-w-[180px] truncate">
        {value}
      </span>

    </div>
  );
}

export default AIReport;