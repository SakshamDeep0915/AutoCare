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
      console.error(
        "Health Alerts Error:",
        err
      );

      setError(
        "Unable to load vehicle health alerts."
      );

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
          size={28}
          className="text-red-600"
        />
      );
    }


    // Service
    if (alert.type === "service") {
      return (
        <Wrench
          size={28}
          className="text-yellow-600"
        />
      );
    }


    // Fuel Efficiency
    if (
      alert.type ===
      "fuel-efficiency"
    ) {
      return (
        <Fuel
          size={28}
          className="text-orange-600"
        />
      );
    }


    // Default
    return (
      <AlertTriangle
        size={28}
        className="text-orange-600"
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
          "border-red-200 bg-red-50",

        icon:
          "bg-red-100",

        title:
          "text-red-800",

        badge:
          "bg-red-100 text-red-700",

        button:
          "bg-red-600 hover:bg-red-700",
      };
    }


    // Warning
    if (severity === "warning") {
      return {
        container:
          "border-yellow-200 bg-yellow-50",

        icon:
          "bg-yellow-100",

        title:
          "text-yellow-800",

        badge:
          "bg-yellow-100 text-yellow-700",

        button:
          "bg-yellow-500 hover:bg-yellow-600",
      };
    }


    // Info
    return {
      container:
        "border-blue-200 bg-blue-50",

      icon:
        "bg-blue-100",

      title:
        "text-blue-800",

      badge:
        "bg-blue-100 text-blue-700",

      button:
        "bg-blue-600 hover:bg-blue-700",
    };
  };


  // =====================================================
  // Loading
  // =====================================================

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">

        <div className="flex items-center gap-3 mb-6">

          <div className="bg-red-100 p-3 rounded-full">

            <AlertTriangle
              className="text-red-600"
              size={25}
            />

          </div>


          <div>

            <h2 className="text-2xl font-bold">
              Vehicle Health Alerts
            </h2>

            <p className="text-gray-500">
              Checking your vehicles...
            </p>

          </div>

        </div>


        <div className="flex justify-center py-10">

          <RefreshCw
            className="text-blue-600 animate-spin"
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
      <div className="bg-white rounded-2xl shadow-lg p-6">

        <div className="flex items-center justify-between">

          <div className="flex items-center gap-3">

            <div className="bg-red-100 p-3 rounded-full">

              <AlertTriangle
                className="text-red-600"
                size={25}
              />

            </div>


            <div>

              <h2 className="text-2xl font-bold">
                Vehicle Health Alerts
              </h2>

              <p className="text-red-500">
                {error}
              </p>

            </div>

          </div>


          <button
            onClick={fetchAlerts}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold"
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
      <div className="bg-white rounded-2xl shadow-lg p-6">

        <div className="flex items-center gap-4">

          <div className="bg-green-100 p-4 rounded-full">

            <CheckCircle
              className="text-green-600"
              size={32}
            />

          </div>


          <div>

            <h2 className="text-2xl font-bold">
              Vehicle Health Alerts
            </h2>

            <p className="text-green-600 font-medium mt-1">
              ✓ All your vehicles are looking good!
            </p>

            <p className="text-gray-500 text-sm mt-1">
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
    <div className="bg-white rounded-2xl shadow-lg p-6">

      {/* Header */}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">

        <div className="flex items-center gap-4">

          <div className="bg-red-100 p-3 rounded-full">

            <AlertTriangle
              className="text-red-600"
              size={28}
            />

          </div>


          <div>

            <h2 className="text-2xl font-bold">
              Vehicle Health Alerts
            </h2>

            <p className="text-gray-500">
              Important things that need your attention
            </p>

          </div>

        </div>


        {/* Alert Count */}

        <div className="bg-red-100 text-red-700 px-4 py-2 rounded-full font-bold w-fit">

          {alerts.length}{" "}

          {alerts.length === 1
            ? "Alert"
            : "Alerts"}

        </div>

      </div>


      {/* Alert Cards */}

      <div className="space-y-4">

        {alerts.map(
          (alert, index) => {

            const style =
              getAlertStyle(
                alert.severity
              );


            return (
              <div
                key={`${alert.vehicleId}-${alert.type}-${index}`}
                className={`border rounded-xl p-5 ${style.container}`}
              >

                <div className="flex flex-col md:flex-row gap-4">

                  {/* Icon */}

                  <div
                    className={`p-3 rounded-full w-fit h-fit ${style.icon}`}
                  >

                    {getAlertIcon(
                      alert
                    )}

                  </div>


                  {/* Content */}

                  <div className="flex-1">

                    {/* Title */}

                    <div className="flex flex-wrap items-center gap-3">

                      <h3
                        className={`text-lg font-bold ${style.title}`}
                      >
                        {alert.title}
                      </h3>


                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full uppercase ${style.badge}`}
                      >
                        {alert.severity}
                      </span>

                    </div>


                    {/* Vehicle */}

                    <p className="font-semibold text-gray-800 mt-2">

                      🚗{" "}
                      {alert.vehicleName}

                    </p>


                    {/* Registration */}

                    <p className="text-sm text-gray-500 font-semibold">

                      Registration:{" "}

                      {alert.registrationNumber?.toUpperCase()}

                    </p>


                    {/* Message */}

                    <p className="text-gray-700 mt-3 leading-6">

                      {alert.message}

                    </p>


                    {/* =================================================
                        Fuel Efficiency Details
                    ================================================= */}

                    {alert.type ===
                      "fuel-efficiency" && (

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">


                        {/* Previous Average */}

                        <div className="bg-white rounded-lg p-4 border border-gray-200">

                          <p className="text-xs text-gray-500 font-medium">
                            Previous Average
                          </p>

                          <p className="text-xl font-bold text-gray-800 mt-1">

                            {alert.previousEfficiency}

                            <span className="text-sm font-medium ml-1">
                              {alert.unit}
                            </span>

                          </p>

                        </div>


                        {/* Current Average */}

                        <div className="bg-white rounded-lg p-4 border border-gray-200">

                          <p className="text-xs text-gray-500 font-medium">
                            Current Average
                          </p>

                          <p className="text-xl font-bold text-orange-600 mt-1">

                            {alert.currentEfficiency}

                            <span className="text-sm font-medium ml-1">
                              {alert.unit}
                            </span>

                          </p>

                        </div>


                        {/* Efficiency Drop */}

                        <div className="bg-white rounded-lg p-4 border border-red-200">

                          <p className="text-xs text-gray-500 font-medium">
                            Efficiency Drop
                          </p>

                          <p className="text-xl font-bold text-red-600 mt-1">

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

                      <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-600">

                        <span>

                          Last Service:{" "}

                          {Number(
                            alert.lastServiceOdometer
                          ).toLocaleString(
                            "en-IN"
                          )}{" "}

                          km

                        </span>


                        <span>

                          Current:{" "}

                          {Number(
                            alert.currentOdometer
                          ).toLocaleString(
                            "en-IN"
                          )}{" "}

                          km

                        </span>

                      </div>
                    )}


                    {/* =================================================
                        Remaining Service KM
                    ================================================= */}

                    {alert.remainingKm !==
                      undefined && (

                      <p className="text-sm text-yellow-700 font-semibold mt-3">

                        🔧 Service due in approximately{" "}

                        {Number(
                          alert.remainingKm
                        ).toLocaleString(
                          "en-IN"
                        )}{" "}

                        km

                      </p>
                    )}


                    {/* =================================================
                        Insurance Date
                    ================================================= */}

                    {alert.expiryDate && (

                      <p className="text-sm text-gray-600 mt-3">

                        🛡️ Insurance Expiry:{" "}

                        {new Date(
                          alert.expiryDate
                        ).toLocaleDateString(
                          "en-IN"
                        )}

                        {alert.daysRemaining !==
                          undefined && (
                          <span className="ml-2 font-semibold">

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

                    <div className="mt-4">

                      <button
                        onClick={() =>
                          navigate(
                            `/vehicles/${alert.vehicleId}`
                          )
                        }
                        className={`inline-flex items-center gap-2 text-white px-4 py-2 rounded-lg font-semibold transition ${style.button}`}
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
          }
        )}

      </div>

    </div>
  );
}


export default HealthAlerts;