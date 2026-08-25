import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Navbar from "../components/Navbar";
import API from "../services/api";

import {
  ArrowLeft,
  Fuel,
  Trash2,
  Plus,
  CalendarDays,
  Gauge,
  IndianRupee,
  TrendingUp,
  MapPin,
  CarFront,
  Receipt,
  Droplets,
  CircleDollarSign,
} from "lucide-react";

function FuelHistory() {
  const { vehicleId } = useParams();
  const navigate = useNavigate();

  const [vehicle, setVehicle] = useState(null);
  const [fuelExpenses, setFuelExpenses] = useState([]);
  const [fuelEfficiency, setFuelEfficiency] =
    useState(null);
  const [efficiencyMessage, setEfficiencyMessage] =
    useState("");
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] =
    useState(null);

  // =====================================================
  // FETCH DATA
  // =====================================================

  useEffect(() => {
    fetchData();
  }, [vehicleId]);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Vehicle
      const vehicleRes = await API.get(
        `/vehicles/${vehicleId}`
      );

      setVehicle(vehicleRes.data.vehicle);

      // Fuel history
      const fuelRes = await API.get(
        `/fuel/vehicle/${vehicleId}`
      );

      setFuelExpenses(
        fuelRes.data.fuelExpenses || []
      );

      // Efficiency
      const efficiencyRes = await API.get(
        `/fuel/vehicle/${vehicleId}/efficiency`
      );

      if (
        efficiencyRes.data.fuelEfficiency !==
        null
      ) {
        setFuelEfficiency(
          efficiencyRes.data.fuelEfficiency
        );

        setEfficiencyMessage("");
      } else {
        setFuelEfficiency(null);

        setEfficiencyMessage(
          efficiencyRes.data.message ||
            "Add more fuel records to calculate efficiency."
        );
      }
    } catch (error) {
      console.error(
        "Fuel History Error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to load fuel history"
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // DELETE FUEL ENTRY
  // =====================================================

  const handleDelete = async (fuelId) => {
    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this fuel record?"
      );

    if (!confirmDelete) return;

    try {
      setDeletingId(fuelId);

      await API.delete(
        `/fuel/${fuelId}`
      );

      await fetchData();
    } catch (error) {
      console.error(
        "Delete Fuel Error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to delete fuel record"
      );
    } finally {
      setDeletingId(null);
    }
  };

  // =====================================================
  // TOTAL FUEL EXPENSE
  // =====================================================

  const totalExpense =
    fuelExpenses.reduce(
      (total, fuel) =>
        total +
        Number(fuel.totalCost || 0),
      0
    );

  // =====================================================
  // TOTAL FUEL QUANTITY
  // =====================================================

  const totalQuantity =
    fuelExpenses.reduce(
      (total, fuel) =>
        total +
        Number(fuel.quantity || 0),
      0
    );

  // =====================================================
  // AVERAGE PRICE
  // =====================================================

  const averagePrice =
    totalQuantity > 0
      ? totalExpense / totalQuantity
      : 0;

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="min-h-screen bg-[#0d0f10] text-white">

          <div className="max-w-6xl mx-auto px-5 lg:px-8 py-10">

            <div className="w-32 h-3 bg-[#1b1e20] rounded animate-pulse mb-5" />

            <div className="w-64 h-10 bg-[#1b1e20] rounded animate-pulse mb-3" />

            <div className="w-96 max-w-full h-4 bg-[#1b1e20] rounded animate-pulse mb-10" />

            <div className="h-44 bg-[#151718] border border-[#292c2f] rounded-2xl animate-pulse mb-6" />

            <div className="grid md:grid-cols-3 gap-5 mb-6">

              {[1, 2, 3].map(
                (item) => (
                  <div
                    key={item}
                    className="h-32 bg-[#151718] border border-[#292c2f] rounded-2xl animate-pulse"
                  />
                )
              )}

            </div>

            <div className="h-96 bg-[#151718] border border-[#292c2f] rounded-2xl animate-pulse" />

          </div>

        </main>
      </>
    );
  }

  // =====================================================
  // VEHICLE NOT FOUND
  // =====================================================

  if (!vehicle) {
    return (
      <>
        <Navbar />

        <main className="min-h-screen bg-[#0d0f10] text-white flex items-center justify-center px-5">

          <div className="text-center">

            <div className="w-14 h-14 mx-auto rounded-2xl bg-[#151718] border border-[#292c2f] flex items-center justify-center">

              <CarFront
                size={26}
                className="text-gray-600"
              />

            </div>

            <h2 className="text-2xl font-semibold mt-5">
              Vehicle not found
            </h2>

            <p className="text-gray-600 mt-2">
              We couldn't find this vehicle in your garage.
            </p>

            <button
              onClick={() =>
                navigate("/dashboard")
              }
              className="mt-6 px-5 py-3 rounded-xl bg-orange-500 hover:bg-orange-400 text-black font-semibold transition"
            >
              Back to dashboard
            </button>

          </div>

        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#0d0f10] text-white">

        {/* =================================================
            TOP BAR
        ================================================= */}

        <div className="border-b border-[#25282b] bg-[#101213]">

          <div className="max-w-6xl mx-auto px-5 lg:px-8 py-5">

            <button
              onClick={() =>
                navigate(
                  `/vehicles/${vehicleId}`
                )
              }
              className="group flex items-center gap-2 text-sm text-gray-500 hover:text-orange-500 transition"
            >

              <ArrowLeft
                size={17}
                className="group-hover:-translate-x-1 transition"
              />

              Vehicle overview

            </button>

          </div>

        </div>

        <div className="max-w-6xl mx-auto px-5 lg:px-8 py-10">

          {/* =================================================
              HEADER
          ================================================= */}

          <section className="mb-8">

            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">

              <div>

                <div className="flex items-center gap-3 mb-3">

                  <span className="text-[11px] tracking-[0.25em] uppercase text-orange-500 font-semibold">
                    Fuel Management
                  </span>

                  <span className="h-px w-8 bg-orange-500/50" />

                  <span className="text-[11px] tracking-wider text-gray-600">
                    HISTORY
                  </span>

                </div>

                <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
                  Fuel history
                </h1>

                <p className="text-gray-500 mt-2">
                  Track fuel spending, consumption and efficiency.
                </p>

              </div>

              <button
                onClick={() =>
                  navigate(
                    `/vehicles/${vehicleId}/add-fuel`
                  )
                }
                className="self-start flex items-center gap-2 px-5 py-3 rounded-xl bg-orange-500 hover:bg-orange-400 text-black font-semibold transition"
              >

                <Plus size={17} />

                Add fuel

              </button>

            </div>

          </section>

          {/* =================================================
              VEHICLE HEADER
          ================================================= */}

          <section className="bg-[#151718] border border-[#292c2f] rounded-2xl overflow-hidden mb-6">

            <div className="p-6">

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

                <div className="flex items-center gap-4">

                  <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">

                    <CarFront
                      size={23}
                      className="text-orange-500"
                    />

                  </div>

                  <div>

                    <h2 className="text-xl font-semibold">
                      {vehicle.brand}{" "}
                      {vehicle.model}
                    </h2>

                    <div className="flex items-center gap-3 mt-1">

                      <span className="text-xs uppercase tracking-[0.16em] text-gray-600">
                        {vehicle.registrationNumber?.toUpperCase()}
                      </span>

                      <span className="w-1 h-1 rounded-full bg-gray-700" />

                      <span className="text-xs text-gray-600">
                        {vehicle.fuelType}
                      </span>

                    </div>

                  </div>

                </div>

                <div className="flex items-center gap-3">

                  <div className="text-right">

                    <p className="text-[10px] uppercase tracking-wider text-gray-700">
                      Current odometer
                    </p>

                    <p className="text-sm font-medium text-gray-300 mt-1">
                      {Number(
                        vehicle.odometer || 0
                      ).toLocaleString(
                        "en-IN"
                      )}{" "}
                      km
                    </p>

                  </div>

                  <div className="w-9 h-9 rounded-lg bg-[#101213] border border-[#292c2f] flex items-center justify-center">

                    <Gauge
                      size={17}
                      className="text-gray-600"
                    />

                  </div>

                </div>

              </div>

            </div>

          </section>

          {/* =================================================
              SUMMARY
          ================================================= */}

          <section className="grid md:grid-cols-3 gap-5 mb-6">

            <SummaryCard
              icon={
                <IndianRupee
                  size={20}
                />
              }
              label="Total fuel expense"
              value={`₹${totalExpense.toLocaleString(
                "en-IN",
                {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }
              )}`}
              description="Total spent on fuel"
              primary
            />

            <SummaryCard
              icon={
                <Droplets size={20} />
              }
              label="Fuel consumed"
              value={`${totalQuantity.toLocaleString(
                "en-IN",
                {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }
              )} L`}
              description="Total recorded quantity"
            />

            <SummaryCard
              icon={
                <TrendingUp
                  size={20}
                />
              }
              label="Fuel efficiency"
              value={
                fuelEfficiency !== null
                  ? `${Number(
                      fuelEfficiency
                    ).toFixed(2)} km/L`
                  : "—"
              }
              description={
                fuelEfficiency !== null
                  ? "Calculated from fuel records"
                  : efficiencyMessage
              }
            />

          </section>

          {/* =================================================
              ADDITIONAL STATS
          ================================================= */}

          {fuelExpenses.length > 0 && (

            <section className="grid md:grid-cols-2 gap-5 mb-6">

              <div className="bg-[#151718] border border-[#292c2f] rounded-2xl p-5">

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-[10px] uppercase tracking-[0.18em] text-gray-700">
                      Average fuel price
                    </p>

                    <p className="text-xl font-semibold text-gray-200 mt-2">
                      ₹
                      {averagePrice.toFixed(
                        2
                      )}
                      <span className="text-sm text-gray-600 font-normal">
                        {" "}
                        / L
                      </span>
                    </p>

                  </div>

                  <div className="w-10 h-10 rounded-xl bg-[#101213] border border-[#292c2f] flex items-center justify-center">

                    <CircleDollarSign
                      size={19}
                      className="text-gray-600"
                    />

                  </div>

                </div>

              </div>

              <div className="bg-[#151718] border border-[#292c2f] rounded-2xl p-5">

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-[10px] uppercase tracking-[0.18em] text-gray-700">
                      Fuel records
                    </p>

                    <p className="text-xl font-semibold text-gray-200 mt-2">
                      {fuelExpenses.length}
                      <span className="text-sm text-gray-600 font-normal">
                        {" "}
                        entries
                      </span>
                    </p>

                  </div>

                  <div className="w-10 h-10 rounded-xl bg-[#101213] border border-[#292c2f] flex items-center justify-center">

                    <Receipt
                      size={19}
                      className="text-gray-600"
                    />

                  </div>

                </div>

              </div>

            </section>

          )}

          {/* =================================================
              FUEL RECORDS
          ================================================= */}

          <section className="bg-[#151718] border border-[#292c2f] rounded-2xl overflow-hidden">

            <div className="px-6 py-5 border-b border-[#292c2f] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

              <div>

                <div className="flex items-center gap-2">

                  <Fuel
                    size={18}
                    className="text-orange-500"
                  />

                  <h2 className="text-lg font-semibold">
                    Fuel records
                  </h2>

                </div>

                <p className="text-xs text-gray-600 mt-1">
                  Complete fuel transaction history.
                </p>

              </div>

              {fuelExpenses.length > 0 && (

                <span className="text-[10px] uppercase tracking-[0.15em] text-gray-700">
                  {fuelExpenses.length} records
                </span>

              )}

            </div>

            {fuelExpenses.length === 0 ? (

              <div className="py-16 px-6 text-center">

                <div className="w-14 h-14 mx-auto rounded-2xl bg-[#101213] border border-[#292c2f] flex items-center justify-center">

                  <Fuel
                    size={25}
                    className="text-gray-700"
                  />

                </div>

                <h3 className="text-lg font-semibold text-gray-300 mt-5">
                  No fuel records yet
                </h3>

                <p className="text-sm text-gray-600 mt-2 max-w-md mx-auto">
                  Start recording your fuel purchases to track spending and calculate fuel efficiency.
                </p>

                <button
                  onClick={() =>
                    navigate(
                      `/vehicles/${vehicleId}/add-fuel`
                    )
                  }
                  className="mt-6 inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-orange-500 hover:bg-orange-400 text-black font-semibold transition"
                >

                  <Plus size={17} />

                  Add first fuel record

                </button>

              </div>

            ) : (

              <div>

                {fuelExpenses.map(
                  (fuel, index) => (

                    <FuelRecord
                      key={fuel._id}
                      fuel={fuel}
                      index={index}
                      deleting={
                        deletingId ===
                        fuel._id
                      }
                      onDelete={
                        handleDelete
                      }
                    />

                  )
                )}

              </div>

            )}

          </section>

        </div>

      </main>
    </>
  );
}

// =====================================================
// SUMMARY CARD
// =====================================================

function SummaryCard({
  icon,
  label,
  value,
  description,
  primary = false,
}) {
  return (
    <div
      className={`bg-[#151718] border rounded-2xl p-6 ${
        primary
          ? "border-orange-500/30"
          : "border-[#292c2f]"
      }`}
    >

      <div className="flex items-start justify-between gap-4">

        <div>

          <p className="text-[10px] uppercase tracking-[0.18em] text-gray-600">
            {label}
          </p>

          <p
            className={`text-2xl md:text-3xl font-semibold mt-2 ${
              primary
                ? "text-orange-500"
                : "text-gray-200"
            }`}
          >
            {value}
          </p>

          <p className="text-xs text-gray-700 mt-2">
            {description}
          </p>

        </div>

        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            primary
              ? "bg-orange-500/10 border border-orange-500/20 text-orange-500"
              : "bg-[#101213] border border-[#292c2f] text-gray-600"
          }`}
        >
          {icon}
        </div>

      </div>

    </div>
  );
}

// =====================================================
// FUEL RECORD
// =====================================================

function FuelRecord({
  fuel,
  index,
  deleting,
  onDelete,
}) {
  return (
    <div className="relative">

      <div className="p-6 hover:bg-[#191b1d] transition">

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

          {/* =================================================
              LEFT
          ================================================= */}

          <div className="flex items-start gap-4 min-w-0">

            <div className="relative shrink-0">

              <div className="w-11 h-11 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">

                <Fuel
                  size={19}
                  className="text-orange-500"
                />

              </div>

              {index !== undefined && (
                <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-[#0d0f10] border border-[#303438] flex items-center justify-center text-[9px] text-gray-600">
                  {index + 1}
                </span>
              )}

            </div>

            <div className="min-w-0">

              <div className="flex items-center gap-3 flex-wrap">

                <h3 className="text-base font-semibold text-gray-200">
                  {fuel.fuelType ||
                    "Fuel"}
                </h3>

                <span className="px-2.5 py-1 rounded-md bg-orange-500/10 border border-orange-500/15 text-[10px] uppercase tracking-wider text-orange-500">
                  {fuel.quantity} L
                </span>

              </div>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-3 text-xs text-gray-600">

                <span className="flex items-center gap-1.5">

                  <CalendarDays
                    size={14}
                  />

                  {new Date(
                    fuel.fuelDate
                  ).toLocaleDateString(
                    "en-IN",
                    {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    }
                  )}

                </span>

                <span className="flex items-center gap-1.5">

                  <Gauge
                    size={14}
                  />

                  {Number(
                    fuel.odometer || 0
                  ).toLocaleString(
                    "en-IN"
                  )}{" "}
                  km

                </span>

                {fuel.fuelStation && (

                  <span className="flex items-center gap-1.5">

                    <MapPin
                      size={14}
                    />

                    {fuel.fuelStation}

                  </span>

                )}

              </div>

              {fuel.notes && (

                <p className="text-xs text-gray-700 mt-3 max-w-xl">
                  {fuel.notes}
                </p>

              )}

            </div>

          </div>

          {/* =================================================
              RIGHT
          ================================================= */}

          <div className="flex items-center justify-between lg:justify-end gap-6 lg:min-w-[270px]">

            <div className="text-left lg:text-right">

              <p className="text-xl font-semibold text-gray-200">

                ₹
                {Number(
                  fuel.totalCost || 0
                ).toLocaleString(
                  "en-IN",
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }
                )}

              </p>

              <p className="text-[11px] text-gray-700 mt-1">

                ₹
                {Number(
                  fuel.pricePerUnit ||
                    0
                ).toFixed(2)}

                {" "}
                / unit

              </p>

            </div>

            <button
              onClick={() =>
                onDelete(fuel._id)
              }
              disabled={deleting}
              title="Delete fuel record"
              className="w-9 h-9 rounded-lg border border-[#292c2f] text-gray-600 hover:text-red-400 hover:border-red-500/20 hover:bg-red-500/[0.04] disabled:opacity-50 transition flex items-center justify-center"
            >

              {deleting ? (

                <div className="w-4 h-4 border-2 border-gray-700 border-t-red-400 rounded-full animate-spin" />

              ) : (

                <Trash2 size={16} />

              )}

            </button>

          </div>

        </div>

      </div>

      {/* RECORD DIVIDER */}

      <div className="mx-6 border-b border-[#222527]" />

    </div>
  );
}

export default FuelHistory;