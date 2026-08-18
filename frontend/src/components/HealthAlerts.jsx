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
} from "lucide-react";

import axios from "axios";

function HealthAlerts() {
  const navigate = useNavigate();

  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // Fetch Health Alerts
  // =====================================================

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/alerts/vehicle-health",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAlerts(res.data.alerts || []);
    } catch (err) {
      console.error("Health Alerts Error:", err);

      setError("Unable to load vehicle health alerts.");
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // Load Alerts
  // =====================================================

  useEffect(() => {
    fetchAlerts();
  }, []);

  // =====================================================
  // Alert Icon
  // =====================================================

  const getAlertIcon = (alert) => {
    // Insurance
    if (alert.type === "insurance") {
      return (
        <ShieldAlert
          size={27}
          className="text-red-400"
        />
      );
    }

    // Service
    if (alert.type === "service") {
      return (
        <Wrench
          size={27}
          className="text-orange-400"
        />
      );
    }

    // Fuel Efficiency
    if (alert.type === "fuel-efficiency") {
      return (
        <Fuel
          size={27}
          className="text-orange-400"
        />
      );
    }

    // Default
    return (
      <AlertTriangle
        size={27}
        className="text-orange-400"
      />
    );
  };

  // =====================================================
  // Alert Styling
  // =====================================================

  const getAlertStyle = (severity) => {
    // Danger
    if (severity === "danger") {
      return {
        container:
          "border-red-500/25 bg-[#151515]",

        icon:
          "border border-red-500/25 bg-red-500/10",

        title:
          "text-red-400",

        badge:
          "border border-red-500/25 bg-red-500/10 text-red-400",

        button:
          "bg-red-600 hover:bg-red-500 shadow-lg shadow-red-950/30",
      };
    }

    // Warning
    if (severity === "warning") {
      return {
        container:
          "border-zinc-800 bg-[#151515] hover:border-orange-500/40",

        icon:
          "border border-orange-500/25 bg-orange-500/10",

        title:
          "text-white",

        badge:
          "border border-orange-500/25 bg-orange-500/10 text-orange-400",

        button:
          "bg-orange-500 hover:bg-orange-400 shadow-lg shadow-orange-950/30",
      };
    }

    // Info
    return {
      container:
        "border-zinc-800 bg-[#151515] hover:border-orange-500/30",

      icon:
        "border border-sky-500/25 bg-sky-500/10",

      title:
        "text-sky-400",

      badge:
        "border border-sky-500/25 bg-sky-500/10 text-sky-400",

      button:
        "bg-sky-600 hover:bg-sky-500 shadow-lg shadow-sky-950/30",
    };
  };

  // =====================================================
  // Loading
  // =====================================================

  if (loading) {
    return (
      <div className="rounded-2xl border border-zinc-800 bg-[#111111] p-6 shadow-xl shadow-black/20">

        <div className="mb-6 flex items-center gap-4">

          <div className="flex h-14 w-14 items-center justify-center rounded-full border border-orange-500/30 bg-orange-500/10">

            <AlertTriangle
              className="text-orange-500"
              size={27}
            />

          </div>

          <div>

            <h2 className="text-2xl font-black tracking-tight text-white">
              Vehicle Health Alerts
            </h2>

            <p className="mt-1 text-base text-zinc-500">
              Checking your vehicles...
            </p>

          </div>

        </div>

        <div className="flex justify-center py-12">

          <RefreshCw
            className="animate-spin text-orange-500"
            size={35}
          />

        </div>

      </div>
    );
  }

  // =====================================================
  // Error
  // =====================================================

  if (error) {
    return (
      <div className="rounded-2xl border border-zinc-800 bg-[#111111] p-6 shadow-xl shadow-black/20">

        <div className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">

          <div className="flex items-center gap-4">

            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-red-500/25 bg-red-500/10">

              <AlertTriangle
                className="text-red-400"
                size={27}
              />

            </div>

            <div>

              <h2 className="text-2xl font-black tracking-tight text-white">
                Vehicle Health Alerts
              </h2>

              <p className="mt-1 text-base text-red-400">
                {error}
              </p>

            </div>

          </div>

          <button
            onClick={fetchAlerts}
            className="flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-orange-950/30 transition-all duration-200 hover:bg-orange-400"
          >

            <RefreshCw size={18} />

            Retry

          </button>

        </div>

      </div>
    );
  }

  // =====================================================
  // No Alerts
  // =====================================================

  if (alerts.length === 0) {
    return (
      <div className="rounded-2xl border border-zinc-800 bg-[#111111] p-6 shadow-xl shadow-black/20">

        <div className="flex items-center gap-4">

          <div className="flex h-14 w-14 items-center justify-center rounded-full border border-emerald-500/25 bg-emerald-500/10">

            <CheckCircle
              className="text-emerald-400"
              size={30}
            />

          </div>

          <div>

            <h2 className="text-2xl font-black tracking-tight text-white">
              Vehicle Health Alerts
            </h2>

            <p className="mt-1 text-base font-semibold text-emerald-400">
              ✓ All your vehicles are looking good!
            </p>

            <p className="mt-1 text-sm leading-6 text-zinc-500">
              No maintenance, insurance or fuel-efficiency alerts at the moment.
            </p>

          </div>

        </div>

      </div>
    );
  }

  // =====================================================
  // Alerts
  // =====================================================

  return (
    <div className="rounded-2xl border border-zinc-800 bg-[#111111] p-5 shadow-xl shadow-black/20 sm:p-6">

      {/* Header */}

      <div className="mb-7 flex flex-col justify-between gap-5 md:flex-row md:items-center">

        <div className="flex items-center gap-4">

          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-orange-500/30 bg-orange-500/10">

            <AlertTriangle
              className="text-orange-500"
              size={28}
            />

          </div>

          <div>

            <h2 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
              Vehicle Health Alerts
            </h2>

            <p className="mt-1 text-base text-zinc-500">
              Important things that need your attention
            </p>

          </div>

        </div>

        {/* Alert Count */}

        <div className="w-fit rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-sm font-bold text-orange-400">

          {alerts.length}{" "}

          {alerts.length === 1
            ? "Alert"
            : "Alerts"}

        </div>

      </div>

      {/* Alert Cards */}

      <div className="space-y-4">

        {alerts.map((alert, index) => {

          const style =
            getAlertStyle(
              alert.severity
            );

          return (
            <div
              key={`${alert.vehicleId}-${alert.type}-${index}`}
              className={`group relative overflow-hidden rounded-2xl border p-5 transition-all duration-300 sm:p-6 ${style.container}`}
            >

              {/* Orange left accent */}

              {alert.severity === "warning" && (
                <div className="absolute left-0 top-0 h-full w-1 bg-orange-500" />
              )}

              {alert.severity === "danger" && (
                <div className="absolute left-0 top-0 h-full w-1 bg-red-500" />
              )}

              {/* Content */}

              <div className="flex flex-col gap-5 md:flex-row">

                {/* Icon */}

                <div
                  className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full ${style.icon}`}
                >

                  {getAlertIcon(alert)}

                </div>

                {/* Content */}

                <div className="flex-1">

                  {/* Title */}

                  <div className="flex flex-wrap items-center gap-3">

                    <h3
                      className={`text-lg font-bold sm:text-xl ${style.title}`}
                    >
                      {alert.title}
                    </h3>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${style.badge}`}
                    >
                      {alert.severity}
                    </span>

                  </div>

                  {/* Vehicle */}

                  <p className="mt-3 flex items-center gap-2 text-base font-medium text-zinc-300">

                    🚗{" "}
                    {alert.vehicleName}

                  </p>

                  {/* Registration */}

                  <p className="mt-1 text-sm font-semibold text-zinc-500">

                    Registration:

                    <span className="ml-1 text-zinc-300">
                      {alert.registrationNumber?.toUpperCase()}
                    </span>

                  </p>

                  {/* Message */}

                  <p className="mt-4 text-sm leading-6 text-zinc-400 sm:text-base">

                    {alert.message}

                  </p>

                  {/* =================================================
                      Fuel Efficiency Details
                  ================================================= */}

                  {alert.type ===
                    "fuel-efficiency" && (

                    <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">

                      {/* Previous Average */}

                      <div className="rounded-xl border border-zinc-800 bg-[#101010] p-4">

                        <p className="text-xs font-medium uppercase tracking-wider text-zinc-600">
                          Previous Average
                        </p>

                        <p className="mt-2 text-xl font-bold text-zinc-200">

                          {alert.previousEfficiency}

                          <span className="ml-1 text-sm font-medium text-zinc-500">
                            {alert.unit}
                          </span>

                        </p>

                      </div>

                      {/* Current Average */}

                      <div className="rounded-xl border border-orange-500/20 bg-orange-500/5 p-4">

                        <p className="text-xs font-medium uppercase tracking-wider text-zinc-600">
                          Current Average
                        </p>

                        <p className="mt-2 text-xl font-bold text-orange-400">

                          {alert.currentEfficiency}

                          <span className="ml-1 text-sm font-medium text-zinc-500">
                            {alert.unit}
                          </span>

                        </p>

                      </div>

                      {/* Efficiency Drop */}

                      <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">

                        <p className="text-xs font-medium uppercase tracking-wider text-zinc-600">
                          Efficiency Drop
                        </p>

                        <p className="mt-2 text-xl font-bold text-red-400">

                          ↓{" "}
                          {alert.efficiencyDrop}%

                        </p>

                      </div>

                    </div>
                  )}

                  {/* =================================================
                      Service Information
                  ================================================= */}

                  {alert.lastServiceOdometer !==
                    undefined && (

                    <div className="mt-4 flex flex-wrap gap-5 text-sm text-zinc-500">

                      <span>

                        Last Service:

                        <strong className="ml-1 text-zinc-300">

                          {Number(
                            alert.lastServiceOdometer
                          ).toLocaleString(
                            "en-IN"
                          )}

                          {" "}km

                        </strong>

                      </span>

                      <span>

                        Current:

                        <strong className="ml-1 text-zinc-300">

                          {Number(
                            alert.currentOdometer
                          ).toLocaleString(
                            "en-IN"
                          )}

                          {" "}km

                        </strong>

                      </span>

                    </div>
                  )}

                  {/* =================================================
                      Remaining Service KM
                  ================================================= */}

                  {alert.remainingKm !==
                    undefined && (

                    <p className="mt-4 text-sm font-semibold text-orange-400">

                      🔧 Service due in approximately{" "}

                      {Number(
                        alert.remainingKm
                      ).toLocaleString(
                        "en-IN"
                      )}

                      {" "}km

                    </p>
                  )}

                  {/* =================================================
                      Insurance Date
                  ================================================= */}

                  {alert.expiryDate && (

                    <p className="mt-4 text-sm text-zinc-500">

                      🛡️ Insurance Expiry:

                      <span className="ml-1 font-semibold text-zinc-300">

                        {new Date(
                          alert.expiryDate
                        ).toLocaleDateString(
                          "en-IN"
                        )}

                      </span>

                      {alert.daysRemaining !==
                        undefined && (

                        <span className="ml-2 text-zinc-500">

                          (
                          {alert.daysRemaining >=
                          0
                            ? `${alert.daysRemaining} days remaining`
                            : `${Math.abs(
                                alert.daysRemaining
                              )} days overdue`}
                          )

                        </span>
                      )}

                    </p>
                  )}

                  {/* =================================================
                      Action
                  ================================================= */}

                  <div className="mt-5">

                    <button
                      onClick={() =>
                        navigate(
                          `/vehicles/${alert.vehicleId}`
                        )
                      }
                      className={`inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-white transition-all duration-200 ${style.button}`}
                    >

                      View Vehicle

                      <ArrowRight
                        size={18}
                      />

                    </button>

                  </div>

                </div>

              </div>

            </div>
          );
        })}

      </div>

    </div>
  );
}

export default HealthAlerts;