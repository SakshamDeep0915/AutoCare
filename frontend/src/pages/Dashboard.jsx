import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import SummaryCards from "../components/SummaryCards";
import RecentServices from "../components/RecentServices";
import ExpenseChart from "../components/ExpenseChart";
import HealthAlerts from "../components/HealthAlerts";

import { getDashboard } from "../services/dashboardService";

import {
  CarFront,
  Plus,
  ArrowUpRight,
  Bot,
  FileText,
  MapPin,
  Gauge,
  Fuel,
  CalendarDays,
  Settings2,
  Wrench,
  ChevronRight,
  Activity,
} from "lucide-react";

function Dashboard() {
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  // =====================================================
  // FETCH DASHBOARD
  // =====================================================

  const fetchDashboard = async () => {
    try {
      const res = await getDashboard();

      setDashboard(res.data);
    } catch (err) {
      console.error(err);

      alert("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d0f10] text-white">
        <Navbar />

        <div className="max-w-7xl mx-auto px-5 lg:px-8">

          <div className="pt-10">

            <div className="dashboard-skeleton w-32 h-3 mb-4" />

            <div className="dashboard-skeleton w-64 h-10 mb-3" />

            <div className="dashboard-skeleton w-96 max-w-full h-4" />

          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mt-10">

            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="dashboard-skeleton-card"
              />
            ))}

          </div>

          <div className="grid lg:grid-cols-[1fr_320px] gap-5 mt-6">

            <div className="dashboard-skeleton-card h-72" />

            <div className="dashboard-skeleton-card h-72" />

          </div>

        </div>

        <style>{`
          .dashboard-skeleton {
            background: #1b1e20;
            border-radius: 6px;
            animation: dashboardPulse 1.5s ease-in-out infinite;
          }

          .dashboard-skeleton-card {
            background: #151718;
            border: 1px solid #292c2f;
            border-radius: 16px;
            animation: dashboardPulse 1.5s ease-in-out infinite;
          }

          @keyframes dashboardPulse {
            0%, 100% {
              opacity: .5;
            }

            50% {
              opacity: 1;
            }
          }
        `}</style>
      </div>
    );
  }

  // =====================================================
  // DASHBOARD
  // =====================================================

  return (
    <div className="min-h-screen bg-[#0d0f10] text-white">

      <Navbar />

      <main className="max-w-7xl mx-auto px-5 lg:px-8 py-9">

        {/* =================================================
            HEADER
        ================================================= */}

        <section className="mb-9">

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">

            <div>

              <div className="flex items-center gap-3 mb-3">

                <span className="text-[11px] tracking-[0.25em] uppercase text-orange-500 font-semibold">
                  AutoCare Garage
                </span>

                <span className="h-px w-8 bg-orange-500/50" />

                <span className="text-[11px] tracking-wider text-gray-600">
                  OVERVIEW
                </span>

              </div>

              <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
                Your garage
              </h1>

              <p className="text-gray-500 mt-2">
                Keep track of vehicle health, maintenance and running costs.
              </p>

            </div>

            <div className="flex flex-wrap gap-3">

              <button
                onClick={() => navigate("/chatbot")}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#303438] text-gray-300 hover:text-orange-500 hover:border-orange-500/30 transition"
              >
                <Bot size={17} />

                Ask AutoCare AI
              </button>

              <button
                onClick={() => navigate("/add-vehicle")}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-black font-semibold transition"
              >
                <Plus size={17} />

                Add vehicle
              </button>

            </div>

          </div>

        </section>

        {/* =================================================
            SUMMARY
        ================================================= */}

        <section className="mb-7">

          <SummaryCards
            totalVehicles={dashboard.totalVehicles}
            totalServices={dashboard.totalServices}
            maintenanceCost={dashboard.maintenanceCost}
            fuelExpense={dashboard.fuelExpense}
          />

        </section>

        {/* =================================================
            PRIMARY DASHBOARD GRID
        ================================================= */}

        <section className="grid lg:grid-cols-[1fr_320px] gap-5 mb-7">

          {/* EXPENSE CHART */}

          <div className="bg-[#151718] border border-[#292c2f] rounded-2xl overflow-hidden">

            <div className="px-6 py-5 border-b border-[#292c2f]">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-[11px] tracking-[0.2em] uppercase text-gray-600">
                    Spending
                  </p>

                  <h2 className="text-lg font-semibold mt-1">
                    Expense overview
                  </h2>

                </div>

                <Activity
                  size={19}
                  className="text-gray-600"
                />

              </div>

            </div>

            <div className="p-5">

              <ExpenseChart />

            </div>

          </div>

          {/* AI CARD */}

          <div className="relative overflow-hidden bg-[#151718] border border-[#292c2f] rounded-2xl">

            <div className="absolute top-0 right-0 w-40 h-40 bg-orange-500/[0.025] rounded-full blur-3xl" />

            <div className="relative p-6 h-full flex flex-col">

              <div className="flex items-center justify-between">

                <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">

                  <Bot
                    size={20}
                    className="text-orange-500"
                  />

                </div>

                <span className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-gray-600">

                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />

                  AI Assistant

                </span>

              </div>

              <div className="mt-7">

                <p className="text-[11px] uppercase tracking-[0.2em] text-gray-600">
                  Vehicle intelligence
                </p>

                <h2 className="text-2xl font-semibold mt-2">
                  Need help with your car?
                </h2>

                <p className="text-sm text-gray-500 leading-6 mt-3">
                  Describe a noise, warning light, maintenance issue or
                  anything unusual. AutoCare AI can help you understand it.
                </p>

              </div>

              <button
                onClick={() => navigate("/chatbot")}
                className="mt-auto pt-7 flex items-center justify-between group"
              >

                <span className="text-sm font-semibold text-orange-500">
                  Start a diagnosis
                </span>

                <span className="w-9 h-9 rounded-lg border border-[#303438] group-hover:border-orange-500/40 flex items-center justify-center transition">

                  <ArrowUpRight
                    size={17}
                    className="text-gray-500 group-hover:text-orange-500 transition"
                  />

                </span>

              </button>

            </div>

          </div>

        </section>

        {/* =================================================
            HEALTH ALERTS
        ================================================= */}

        <section className="mb-7">

          <HealthAlerts />

        </section>

        {/* =================================================
            QUICK TOOLS
        ================================================= */}

        <section className="mb-9">

          <div className="flex items-end justify-between mb-4">

            <div>

              <p className="text-[11px] uppercase tracking-[0.2em] text-gray-600">
                Tools
              </p>

              <h2 className="text-xl font-semibold mt-1">
                Garage tools
              </h2>

            </div>

          </div>

          <div className="grid md:grid-cols-2 gap-4">

            {/* EXPENSE REPORT */}

            <button
              onClick={() =>
                navigate("/expense-report")
              }
              className="group text-left bg-[#151718] border border-[#292c2f] hover:border-orange-500/30 rounded-2xl p-5 transition"
            >

              <div className="flex items-center justify-between">

                <div className="w-10 h-10 rounded-xl bg-[#101213] border border-[#292c2f] flex items-center justify-center">

                  <FileText
                    size={19}
                    className="text-gray-500 group-hover:text-orange-500 transition"
                  />

                </div>

                <ArrowUpRight
                  size={17}
                  className="text-gray-700 group-hover:text-orange-500 transition"
                />

              </div>

              <h3 className="text-base font-semibold mt-5">
                Expense report
              </h3>

              <p className="text-sm text-gray-600 mt-1 leading-5">
                Review maintenance and fuel expenses and download a detailed
                report.
              </p>

            </button>

            {/* NEARBY SERVICES */}

            <button
              onClick={() =>
                navigate("/nearby-services")
              }
              className="group text-left bg-[#151718] border border-[#292c2f] hover:border-orange-500/30 rounded-2xl p-5 transition"
            >

              <div className="flex items-center justify-between">

                <div className="w-10 h-10 rounded-xl bg-[#101213] border border-[#292c2f] flex items-center justify-center">

                  <MapPin
                    size={19}
                    className="text-gray-500 group-hover:text-orange-500 transition"
                  />

                </div>

                <ArrowUpRight
                  size={17}
                  className="text-gray-700 group-hover:text-orange-500 transition"
                />

              </div>

              <h3 className="text-base font-semibold mt-5">
                Nearby services
              </h3>

              <p className="text-sm text-gray-600 mt-1 leading-5">
                Find fuel stations, service centers, tyre shops and EV
                charging locations.
              </p>

            </button>

          </div>

        </section>

        {/* =================================================
            MY VEHICLES
        ================================================= */}

        <section className="mb-10">

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-5">

            <div>

              <p className="text-[11px] uppercase tracking-[0.2em] text-gray-600">
                Your garage
              </p>

              <h2 className="text-xl font-semibold mt-1">
                My vehicles
              </h2>

            </div>

            <button
              onClick={() =>
                navigate("/add-vehicle")
              }
              className="self-start sm:self-auto flex items-center gap-2 text-sm text-orange-500 hover:text-orange-400 transition"
            >

              <Plus size={16} />

              Add another vehicle

            </button>

          </div>

          {/* =================================================
              NO VEHICLES
          ================================================= */}

          {dashboard.vehicles.length === 0 ? (

            <div className="bg-[#151718] border border-[#292c2f] rounded-2xl p-10 text-center">

              <div className="w-14 h-14 mx-auto rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">

                <CarFront
                  size={27}
                  className="text-orange-500"
                />

              </div>

              <h3 className="text-xl font-semibold mt-5">
                Your garage is empty
              </h3>

              <p className="text-gray-600 max-w-md mx-auto mt-2">
                Add your first vehicle to start tracking maintenance,
                fuel expenses and vehicle health.
              </p>

              <button
                onClick={() =>
                  navigate("/add-vehicle")
                }
                className="mt-6 px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-400 text-black font-semibold transition"
              >
                Add your first vehicle
              </button>

            </div>

          ) : (

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">

              {dashboard.vehicles.map(
                (vehicle) => (

                  <VehicleCard
                    key={vehicle._id}
                    vehicle={vehicle}
                    onView={() =>
                      navigate(
                        `/vehicles/${vehicle._id}`
                      )
                    }
                    onEdit={() =>
                      navigate(
                        `/edit-vehicle/${vehicle._id}`
                      )
                    }
                  />

                )
              )}

            </div>

          )}

        </section>

        {/* =================================================
            RECENT SERVICES
        ================================================= */}

        <section className="mb-10">

          <div className="flex items-end justify-between mb-5">

            <div>

              <p className="text-[11px] uppercase tracking-[0.2em] text-gray-600">
                Maintenance
              </p>

              <h2 className="text-xl font-semibold mt-1">
                Recent services
              </h2>

            </div>

          </div>

          <RecentServices
            services={
              dashboard.recentServices
            }
          />

        </section>

      </main>
    </div>
  );
}

// =====================================================
// VEHICLE CARD
// =====================================================

function VehicleCard({
  vehicle,
  onView,
  onEdit,
}) {
  return (
    <div className="group bg-[#151718] border border-[#292c2f] hover:border-orange-500/30 rounded-2xl overflow-hidden transition">

      {/* CARD TOP */}

      <div className="p-5">

        <div className="flex items-start justify-between gap-4">

          <div className="flex items-center gap-3">

            <div className="w-11 h-11 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">

              <CarFront
                size={21}
                className="text-orange-500"
              />

            </div>

            <div>

              <h3 className="font-semibold text-white">
                {vehicle.brand}
              </h3>

              <p className="text-sm text-gray-600">
                {vehicle.model}
              </p>

            </div>

          </div>

          <ChevronRight
            size={17}
            className="text-gray-700 group-hover:text-orange-500 transition"
          />

        </div>

        {/* REGISTRATION */}

        <div className="mt-5">

          <span className="inline-flex px-2.5 py-1 rounded-md bg-[#101213] border border-[#292c2f] text-[10px] uppercase tracking-[0.15em] text-gray-500">

            {vehicle.registrationNumber?.toUpperCase()}

          </span>

        </div>

        {/* DETAILS */}

        <div className="grid grid-cols-2 gap-x-4 gap-y-4 mt-6">

          <VehicleDetail
            icon={<CalendarDays size={14} />}
            label="Year"
            value={vehicle.year}
          />

          <VehicleDetail
            icon={<Fuel size={14} />}
            label="Fuel"
            value={vehicle.fuelType}
          />

          <VehicleDetail
            icon={<Gauge size={14} />}
            label="Odometer"
            value={`${vehicle.odometer} km`}
          />

          <VehicleDetail
            icon={<Settings2 size={14} />}
            label="Type"
            value={vehicle.registrationType || "Private"}
          />

        </div>

      </div>

      {/* ACTIONS */}

      <div className="grid grid-cols-2 border-t border-[#292c2f]">

        <button
          onClick={onView}
          className="py-3.5 text-sm font-medium text-orange-500 hover:bg-orange-500/[0.04] transition"
        >
          View vehicle
        </button>

        <button
          onClick={onEdit}
          className="py-3.5 text-sm font-medium text-gray-500 hover:text-white hover:bg-[#191b1d] border-l border-[#292c2f] transition"
        >
          Edit
        </button>

      </div>

    </div>
  );
}

// =====================================================
// VEHICLE DETAIL
// =====================================================

function VehicleDetail({
  icon,
  label,
  value,
}) {
  return (
    <div>

      <div className="flex items-center gap-1.5 text-gray-700">

        {icon}

        <span className="text-[10px] uppercase tracking-wider">
          {label}
        </span>

      </div>

      <p className="text-sm text-gray-300 mt-1 truncate">
        {value || "—"}
      </p>

    </div>
  );
}

export default Dashboard;