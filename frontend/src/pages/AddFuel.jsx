import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Navbar from "../components/Navbar";
import API from "../services/api";

import {
  ArrowLeft,
  Fuel,
  Calculator,
  Gauge,
  MapPin,
  CalendarDays,
  IndianRupee,
  FileText,
  CheckCircle2,
} from "lucide-react";

function AddFuel() {
  const { vehicleId } = useParams();
  const navigate = useNavigate();

  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [vehicleLoading, setVehicleLoading] = useState(true);

  const [formData, setFormData] = useState({
    fuelDate: new Date().toISOString().split("T")[0],
    fuelType: "Petrol",
    quantity: "",
    pricePerUnit: "",
    odometer: "",
    fuelStation: "",
    notes: "",
  });

  // ==========================================
  // GET VEHICLE DETAILS
  // ==========================================

  useEffect(() => {
    fetchVehicle();
  }, [vehicleId]);

  const fetchVehicle = async () => {
    try {
      const res = await API.get(`/vehicles/${vehicleId}`);
      setVehicle(res.data.vehicle);
    } catch (error) {
      console.error("Vehicle Error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to load vehicle"
      );
    } finally {
      setVehicleLoading(false);
    }
  };

  // ==========================================
  // HANDLE INPUT
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // TOTAL COST
  // ==========================================

  const totalCost =
    Number(formData.quantity || 0) *
    Number(formData.pricePerUnit || 0);

  // ==========================================
  // SUBMIT
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.fuelDate ||
      !formData.fuelType ||
      !formData.quantity ||
      !formData.pricePerUnit ||
      !formData.odometer
    ) {
      alert("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);

      await API.post("/fuel", {
        vehicle: vehicleId,
        fuelDate: formData.fuelDate,
        fuelType: formData.fuelType,
        quantity: Number(formData.quantity),
        pricePerUnit: Number(formData.pricePerUnit),
        odometer: Number(formData.odometer),
        fuelStation: formData.fuelStation,
        notes: formData.notes,
      });

      alert("Fuel expense added successfully!");

      navigate(`/vehicles/${vehicleId}`);
    } catch (error) {
      console.error("Fuel Error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to add fuel expense"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (vehicleLoading) {
    return (
      <>
        <Navbar />

        <div className="min-h-screen bg-[#0d0f10] flex items-center justify-center">
          <div className="flex items-center gap-3 text-gray-400">
            <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
            Loading vehicle...
          </div>
        </div>
      </>
    );
  }

  // ==========================================
  // VEHICLE NOT FOUND
  // ==========================================

  if (!vehicle) {
    return (
      <>
        <Navbar />

        <div className="min-h-screen bg-[#0d0f10] flex items-center justify-center px-4">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-[#181a1c] border border-[#292c2f] flex items-center justify-center">
              <Fuel
                size={28}
                className="text-orange-500"
              />
            </div>

            <h2 className="text-2xl font-semibold text-white">
              Vehicle not found
            </h2>

            <button
              onClick={() => navigate("/vehicles")}
              className="mt-5 text-orange-500 hover:text-orange-400 transition"
            >
              Return to vehicles
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#0d0f10] text-white">

        {/* ==========================================
            TOP BAR
        ========================================== */}

        <div className="border-b border-[#25282b] bg-[#101213]">

          <div className="max-w-6xl mx-auto px-5 lg:px-8 py-5">

            <button
              onClick={() =>
                navigate(`/vehicles/${vehicleId}`)
              }
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

        {/* ==========================================
            PAGE CONTENT
        ========================================== */}

        <div className="max-w-6xl mx-auto px-5 lg:px-8 py-10">

          {/* HEADER */}

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">

            <div>

              <div className="flex items-center gap-3 mb-3">

                <span className="text-[11px] tracking-[0.25em] uppercase text-orange-500 font-semibold">
                  Fuel Log
                </span>

                <span className="h-px w-8 bg-orange-500/50" />

                <span className="text-[11px] tracking-wider text-gray-600">
                  {vehicle.registrationNumber?.toUpperCase()}
                </span>

              </div>

              <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
                Add fuel entry
              </h1>

              <p className="text-gray-500 mt-2">
                Record your latest refuelling activity.
              </p>

            </div>

            {/* VEHICLE IDENTIFIER */}

            <div className="flex items-center gap-3">

              <div className="w-11 h-11 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                <Fuel
                  size={21}
                  className="text-orange-500"
                />
              </div>

              <div>

                <p className="text-sm font-medium text-gray-200">
                  {vehicle.brand} {vehicle.model}
                </p>

                <p className="text-xs text-gray-600 uppercase tracking-wider">
                  {vehicle.registrationNumber}
                </p>

              </div>

            </div>

          </div>

          {/* ==========================================
              FORM + SUMMARY
          ========================================== */}

          <div className="grid lg:grid-cols-[1fr_300px] gap-6">

            {/* FORM */}

            <div className="bg-[#151718] border border-[#292c2f] rounded-2xl overflow-hidden">

              <form onSubmit={handleSubmit}>

                {/* SECTION 1 */}

                <div className="p-6 md:p-8 border-b border-[#292c2f]">

                  <div className="mb-6">

                    <p className="text-xs uppercase tracking-[0.18em] text-orange-500 font-semibold">
                      Refuelling details
                    </p>

                    <p className="text-sm text-gray-600 mt-1">
                      Basic information about this fuel stop.
                    </p>

                  </div>

                  <div className="grid md:grid-cols-2 gap-5">

                    {/* DATE */}

                    <div>
                      <label className="field-label">
                        Fuel date <span>*</span>
                      </label>

                      <div className="relative">

                        <CalendarDays
                          size={17}
                          className="field-icon"
                        />

                        <input
                          type="date"
                          name="fuelDate"
                          value={formData.fuelDate}
                          onChange={handleChange}
                          className="field-input pl-11"
                          required
                        />

                      </div>
                    </div>

                    {/* FUEL TYPE */}

                    <div>
                      <label className="field-label">
                        Fuel type <span>*</span>
                      </label>

                      <div className="relative">

                        <Fuel
                          size={17}
                          className="field-icon"
                        />

                        <select
                          name="fuelType"
                          value={formData.fuelType}
                          onChange={handleChange}
                          className="field-input pl-11 appearance-none"
                        >
                          <option value="Petrol">
                            Petrol
                          </option>

                          <option value="Diesel">
                            Diesel
                          </option>

                          <option value="CNG">
                            CNG
                          </option>

                          <option value="Electric">
                            Electric
                          </option>
                        </select>

                      </div>
                    </div>

                  </div>

                </div>

                {/* SECTION 2 */}

                <div className="p-6 md:p-8 border-b border-[#292c2f]">

                  <div className="mb-6">

                    <p className="text-xs uppercase tracking-[0.18em] text-orange-500 font-semibold">
                      Fuel & pricing
                    </p>

                    <p className="text-sm text-gray-600 mt-1">
                      Enter the quantity and rate shown at the station.
                    </p>

                  </div>

                  <div className="grid md:grid-cols-2 gap-5">

                    {/* QUANTITY */}

                    <div>

                      <label className="field-label">
                        Quantity <span>*</span>
                      </label>

                      <div className="relative">

                        <input
                          type="number"
                          name="quantity"
                          value={formData.quantity}
                          onChange={handleChange}
                          placeholder="25.00"
                          min="0"
                          step="0.01"
                          className="field-input pr-20"
                          required
                        />

                        <span className="unit-label">
                          litres
                        </span>

                      </div>

                    </div>

                    {/* PRICE */}

                    <div>

                      <label className="field-label">
                        Price per litre <span>*</span>
                      </label>

                      <div className="relative">

                        <IndianRupee
                          size={16}
                          className="field-icon"
                        />

                        <input
                          type="number"
                          name="pricePerUnit"
                          value={formData.pricePerUnit}
                          onChange={handleChange}
                          placeholder="94.00"
                          min="0"
                          step="0.01"
                          className="field-input pl-10"
                          required
                        />

                      </div>

                    </div>

                  </div>

                </div>

                {/* SECTION 3 */}

                <div className="p-6 md:p-8 border-b border-[#292c2f]">

                  <div className="mb-6">

                    <p className="text-xs uppercase tracking-[0.18em] text-orange-500 font-semibold">
                      Vehicle data
                    </p>

                    <p className="text-sm text-gray-600 mt-1">
                      Useful for tracking fuel economy over time.
                    </p>

                  </div>

                  <div className="grid md:grid-cols-2 gap-5">

                    {/* ODOMETER */}

                    <div>

                      <label className="field-label">
                        Odometer reading <span>*</span>
                      </label>

                      <div className="relative">

                        <Gauge
                          size={17}
                          className="field-icon"
                        />

                        <input
                          type="number"
                          name="odometer"
                          value={formData.odometer}
                          onChange={handleChange}
                          placeholder="21500"
                          min="0"
                          className="field-input pl-11 pr-14"
                          required
                        />

                        <span className="unit-label">
                          km
                        </span>

                      </div>

                    </div>

                    {/* STATION */}

                    <div>

                      <label className="field-label">
                        Fuel station
                      </label>

                      <div className="relative">

                        <MapPin
                          size={17}
                          className="field-icon"
                        />

                        <input
                          type="text"
                          name="fuelStation"
                          value={formData.fuelStation}
                          onChange={handleChange}
                          placeholder="Indian Oil"
                          className="field-input pl-11"
                        />

                      </div>

                    </div>

                  </div>

                </div>

                {/* NOTES */}

                <div className="p-6 md:p-8">

                  <label className="field-label">
                    Notes
                  </label>

                  <div className="relative">

                    <FileText
                      size={17}
                      className="absolute left-4 top-4 text-gray-600"
                    />

                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      placeholder="Full tank, highway refuelling, etc."
                      rows="4"
                      className="field-input pl-11 resize-none"
                    />

                  </div>

                </div>

                {/* ACTIONS */}

                <div className="px-6 md:px-8 py-5 bg-[#111314] border-t border-[#292c2f] flex flex-col-reverse sm:flex-row sm:justify-end gap-3">

                  <button
                    type="button"
                    onClick={() =>
                      navigate(`/vehicles/${vehicleId}`)
                    }
                    className="px-6 py-3 rounded-xl border border-[#303438] text-gray-400 hover:text-white hover:border-[#454a4e] transition font-medium"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className="px-7 py-3 rounded-xl bg-orange-500 hover:bg-orange-400 disabled:bg-gray-700 disabled:text-gray-500 text-black font-semibold transition flex items-center justify-center gap-2"
                  >

                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 size={17} />
                        Save fuel entry
                      </>
                    )}

                  </button>

                </div>

              </form>

            </div>

            {/* ==========================================
                LIVE SUMMARY
            ========================================== */}

            <aside className="lg:sticky lg:top-24 h-fit">

              <div className="bg-[#151718] border border-[#292c2f] rounded-2xl overflow-hidden">

                <div className="p-5 border-b border-[#292c2f]">

                  <p className="text-xs uppercase tracking-[0.18em] text-gray-600">
                    Entry summary
                  </p>

                  <p className="text-lg font-semibold mt-1">
                    Fuel cost
                  </p>

                </div>

                <div className="p-5">

                  <div className="mb-7">

                    <p className="text-xs text-gray-600 uppercase tracking-wider">
                      Total
                    </p>

                    <div className="flex items-baseline gap-1 mt-1">

                      <span className="text-4xl font-semibold tracking-tight">
                        ₹{totalCost.toFixed(2)}
                      </span>

                    </div>

                  </div>

                  <div className="space-y-4">

                    <div className="flex justify-between gap-4">

                      <span className="text-sm text-gray-600">
                        Quantity
                      </span>

                      <span className="text-sm text-gray-300">
                        {formData.quantity || "—"} L
                      </span>

                    </div>

                    <div className="flex justify-between gap-4">

                      <span className="text-sm text-gray-600">
                        Rate
                      </span>

                      <span className="text-sm text-gray-300">
                        {formData.pricePerUnit
                          ? `₹${formData.pricePerUnit}`
                          : "—"}
                      </span>

                    </div>

                    <div className="h-px bg-[#292c2f]" />

                    <div className="flex justify-between gap-4">

                      <span className="text-sm text-gray-600">
                        Odometer
                      </span>

                      <span className="text-sm text-gray-300">
                        {formData.odometer
                          ? `${formData.odometer} km`
                          : "—"}
                      </span>

                    </div>

                  </div>

                </div>

                <div className="px-5 py-4 bg-orange-500/[0.04] border-t border-orange-500/10">

                  <div className="flex gap-3">

                    <Calculator
                      size={17}
                      className="text-orange-500 mt-0.5 shrink-0"
                    />

                    <p className="text-xs leading-5 text-gray-500">
                      Fuel cost is calculated automatically from quantity × price per litre.
                    </p>

                  </div>

                </div>

              </div>

            </aside>

          </div>

        </div>

      </main>

      {/* ==========================================
          PAGE-SPECIFIC STYLES
      ========================================== */}

      <style>{`
        .field-label {
          display: block;
          margin-bottom: 9px;
          font-size: 0.78rem;
          font-weight: 600;
          letter-spacing: 0.02em;
          color: #b6babd;
        }

        .field-label span {
          color: #f97316;
        }

        .field-input {
          width: 100%;
          height: 48px;
          background: #101213;
          border: 1px solid #2c3033;
          border-radius: 10px;
          padding: 0 15px;
          color: #f1f1f1;
          font-size: 0.92rem;
          outline: none;
          transition: all 0.2s ease;
        }

        textarea.field-input {
          height: auto;
          padding-top: 13px;
          padding-bottom: 13px;
        }

        .field-input::placeholder {
          color: #505559;
        }

        .field-input:focus {
          border-color: #e8752a;
          box-shadow: 0 0 0 3px rgba(232, 117, 42, 0.08);
        }

        .field-input option {
          background: #151718;
          color: white;
        }

        .field-icon {
          position: absolute;
          left: 15px;
          top: 50%;
          transform: translateY(-50%);
          color: #5f6468;
          pointer-events: none;
        }

        .unit-label {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 0.75rem;
          color: #62676b;
          pointer-events: none;
        }
      `}</style>
    </>
  );
}

export default AddFuel;