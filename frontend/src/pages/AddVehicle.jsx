import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  Car,
  CalendarDays,
  Fuel,
  Gauge,
  Users,
  ShieldCheck,
  Settings2,
  Save,
  CheckCircle2,
} from "lucide-react";

import { addVehicle } from "../services/vehicleService";

const AddVehicle = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    year: "",
    registrationNumber: "",
    registrationType: "Private",
    fuelType: "Petrol",
    transmission: "Manual",
    odometer: "",
    owners: 1,
    insuranceExpiry: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ==========================================
  // HANDLE INPUT
  // ==========================================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ==========================================
  // SUBMIT
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    try {
      setLoading(true);

      await addVehicle(formData);

      setSuccess("Vehicle added successfully!");

      setTimeout(() => {
        navigate("/dashboard");
      }, 1200);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to add vehicle."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0f10] text-white">

      {/* ==========================================
          TOP BAR
      ========================================== */}

      <div className="border-b border-[#25282b] bg-[#101213]">

        <div className="max-w-6xl mx-auto px-5 lg:px-8 py-5">

          <button
            onClick={() => navigate("/dashboard")}
            className="group flex items-center gap-2 text-sm text-gray-500 hover:text-orange-500 transition"
          >
            <ArrowLeft
              size={17}
              className="group-hover:-translate-x-1 transition"
            />

            Dashboard
          </button>

        </div>

      </div>

      {/* ==========================================
          MAIN CONTENT
      ========================================== */}

      <main className="max-w-6xl mx-auto px-5 lg:px-8 py-10">

        {/* ==========================================
            PAGE HEADER
        ========================================== */}

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">

          <div>

            <div className="flex items-center gap-3 mb-3">

              <span className="text-[11px] tracking-[0.25em] uppercase text-orange-500 font-semibold">
                Garage
              </span>

              <span className="h-px w-8 bg-orange-500/50" />

              <span className="text-[11px] tracking-wider text-gray-600">
                VEHICLE SETUP
              </span>

            </div>

            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
              Add your vehicle
            </h1>

            <p className="text-gray-500 mt-2 max-w-xl">
              Add the basic details of your vehicle to start tracking
              maintenance, fuel and vehicle health.
            </p>

          </div>

          {/* VEHICLE ICON */}

          <div className="flex items-center gap-3">

            <div className="w-11 h-11 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">

              <Car
                size={21}
                className="text-orange-500"
              />

            </div>

            <div>

              <p className="text-sm font-medium text-gray-200">
                New vehicle
              </p>

              <p className="text-xs text-gray-600 uppercase tracking-wider">
                GARAGE ENTRY
              </p>

            </div>

          </div>

        </div>

        {/* ==========================================
            FORM + VEHICLE PREVIEW
        ========================================== */}

        <div className="grid lg:grid-cols-[1fr_300px] gap-6">

          {/* ========================================
              FORM
          ======================================== */}

          <div className="bg-[#151718] border border-[#292c2f] rounded-2xl overflow-hidden">

            <form onSubmit={handleSubmit}>

              {/* ======================================
                  VEHICLE IDENTITY
              ====================================== */}

              <div className="p-6 md:p-8 border-b border-[#292c2f]">

                <div className="mb-6">

                  <p className="text-xs uppercase tracking-[0.18em] text-orange-500 font-semibold">
                    Vehicle identity
                  </p>

                  <p className="text-sm text-gray-600 mt-1">
                    Tell us which vehicle you're adding.
                  </p>

                </div>

                <div className="grid md:grid-cols-2 gap-5">

                  {/* BRAND */}

                  <div>

                    <label className="field-label">
                      Brand <span>*</span>
                    </label>

                    <div className="relative">

                      <Car
                        size={17}
                        className="field-icon"
                      />

                      <select
                        name="brand"
                        value={formData.brand}
                        onChange={handleChange}
                        required
                        className="field-input pl-11 appearance-none"
                      >
                        <option value="">
                          Select brand
                        </option>

                        <option>Maruti Suzuki</option>
                        <option>Hyundai</option>
                        <option>Tata</option>
                        <option>Mahindra</option>
                        <option>Toyota</option>
                        <option>Honda</option>
                        <option>Kia</option>
                        <option>MG</option>
                        <option>Renault</option>
                        <option>Nissan</option>
                        <option>Volkswagen</option>
                        <option>Skoda</option>
                        <option>BMW</option>
                        <option>Mercedes-Benz</option>
                        <option>Audi</option>
                        <option>Jeep</option>
                        <option>Volvo</option>
                        <option>BYD</option>
                        <option>Other</option>
                      </select>

                    </div>

                  </div>

                  {/* MODEL */}

                  <div>

                    <label className="field-label">
                      Model <span>*</span>
                    </label>

                    <div className="relative">

                      <input
                        type="text"
                        name="model"
                        value={formData.model}
                        onChange={handleChange}
                        placeholder="e.g. Creta"
                        required
                        className="field-input"
                      />

                    </div>

                  </div>

                  {/* YEAR */}

                  <div>

                    <label className="field-label">
                      Manufacturing year <span>*</span>
                    </label>

                    <div className="relative">

                      <CalendarDays
                        size={17}
                        className="field-icon"
                      />

                      <input
                        type="number"
                        name="year"
                        value={formData.year}
                        onChange={handleChange}
                        min="1990"
                        max="2035"
                        placeholder="2022"
                        required
                        className="field-input pl-11"
                      />

                    </div>

                  </div>

                  {/* REGISTRATION */}

                  <div>

                    <label className="field-label">
                      Registration number <span>*</span>
                    </label>

                    <input
                      type="text"
                      name="registrationNumber"
                      value={formData.registrationNumber}
                      onChange={handleChange}
                      placeholder="PB10AB1234"
                      required
                      className="field-input uppercase tracking-wider"
                    />

                  </div>

                </div>

              </div>

              {/* ======================================
                  REGISTRATION
              ====================================== */}

              <div className="p-6 md:p-8 border-b border-[#292c2f]">

                <div className="mb-6">

                  <p className="text-xs uppercase tracking-[0.18em] text-orange-500 font-semibold">
                    Registration
                  </p>

                  <p className="text-sm text-gray-600 mt-1">
                    Information about how the vehicle is registered.
                  </p>

                </div>

                <div className="max-w-md">

                  <label className="field-label">
                    Registration type
                  </label>

                  <select
                    name="registrationType"
                    value={formData.registrationType}
                    onChange={handleChange}
                    className="field-input"
                  >
                    <option>Private</option>
                    <option>Commercial</option>
                  </select>

                </div>

              </div>

              {/* ======================================
                  POWERTRAIN
              ====================================== */}

              <div className="p-6 md:p-8 border-b border-[#292c2f]">

                <div className="mb-6">

                  <p className="text-xs uppercase tracking-[0.18em] text-orange-500 font-semibold">
                    Powertrain
                  </p>

                  <p className="text-sm text-gray-600 mt-1">
                    Help AutoCare AI understand your vehicle configuration.
                  </p>

                </div>

                <div className="grid md:grid-cols-2 gap-5">

                  {/* FUEL */}

                  <div>

                    <label className="field-label">
                      Fuel type
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
                        <option>Petrol</option>
                        <option>Diesel</option>
                        <option>CNG</option>
                        <option>Electric</option>
                        <option>Hybrid</option>
                      </select>

                    </div>

                  </div>

                  {/* TRANSMISSION */}

                  <div>

                    <label className="field-label">
                      Transmission
                    </label>

                    <div className="relative">

                      <Settings2
                        size={17}
                        className="field-icon"
                      />

                      <select
                        name="transmission"
                        value={formData.transmission}
                        onChange={handleChange}
                        className="field-input pl-11 appearance-none"
                      >
                        <option>Manual</option>
                        <option>Automatic</option>
                      </select>

                    </div>

                  </div>

                </div>

              </div>

              {/* ======================================
                  VEHICLE HISTORY
              ====================================== */}

              <div className="p-6 md:p-8 border-b border-[#292c2f]">

                <div className="mb-6">

                  <p className="text-xs uppercase tracking-[0.18em] text-orange-500 font-semibold">
                    Vehicle history
                  </p>

                  <p className="text-sm text-gray-600 mt-1">
                    Current mileage and ownership information.
                  </p>

                </div>

                <div className="grid md:grid-cols-2 gap-5">

                  {/* ODOMETER */}

                  <div>

                    <label className="field-label">
                      Current odometer <span>*</span>
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
                        placeholder="42000"
                        min="0"
                        required
                        className="field-input pl-11 pr-12"
                      />

                      <span className="unit-label">
                        km
                      </span>

                    </div>

                  </div>

                  {/* OWNERS */}

                  <div>

                    <label className="field-label">
                      Number of owners
                    </label>

                    <div className="relative">

                      <Users
                        size={17}
                        className="field-icon"
                      />

                      <select
                        name="owners"
                        value={formData.owners}
                        onChange={handleChange}
                        className="field-input pl-11 appearance-none"
                      >
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                        <option value={4}>4+</option>
                      </select>

                    </div>

                  </div>

                </div>

              </div>

              {/* ======================================
                  INSURANCE
              ====================================== */}

              <div className="p-6 md:p-8">

                <div className="mb-6">

                  <p className="text-xs uppercase tracking-[0.18em] text-orange-500 font-semibold">
                    Insurance
                  </p>

                  <p className="text-sm text-gray-600 mt-1">
                    Add the current insurance expiry date.
                  </p>

                </div>

                <div className="max-w-md">

                  <label className="field-label">
                    Insurance expiry
                  </label>

                  <div className="relative">

                    <ShieldCheck
                      size={17}
                      className="field-icon"
                    />

                    <input
                      type="date"
                      name="insuranceExpiry"
                      value={formData.insuranceExpiry}
                      onChange={handleChange}
                      className="field-input pl-11"
                    />

                  </div>

                </div>

              </div>

              {/* ======================================
                  MESSAGES
              ====================================== */}

              {error && (
                <div className="mx-6 md:mx-8 mb-6 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  {error}
                </div>
              )}

              {success && (
                <div className="mx-6 md:mx-8 mb-6 px-4 py-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm flex items-center gap-2">
                  <CheckCircle2 size={17} />
                  {success}
                </div>
              )}

              {/* ======================================
                  ACTIONS
              ====================================== */}

              <div className="px-6 md:px-8 py-5 bg-[#111314] border-t border-[#292c2f] flex flex-col-reverse sm:flex-row sm:justify-end gap-3">

                <button
                  type="button"
                  onClick={() => navigate("/dashboard")}
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
                      Saving vehicle...
                    </>
                  ) : (
                    <>
                      <Save size={17} />
                      Add vehicle
                    </>
                  )}

                </button>

              </div>

            </form>

          </div>

          {/* ==========================================
              VEHICLE PREVIEW
          ========================================== */}

          <aside className="lg:sticky lg:top-24 h-fit">

            <div className="bg-[#151718] border border-[#292c2f] rounded-2xl overflow-hidden">

              {/* PREVIEW HEADER */}

              <div className="p-5 border-b border-[#292c2f]">

                <p className="text-xs uppercase tracking-[0.18em] text-gray-600">
                  Garage preview
                </p>

                <p className="text-lg font-semibold mt-1">
                  Your vehicle
                </p>

              </div>

              {/* VEHICLE VISUAL */}

              <div className="p-6">

                <div className="h-36 rounded-xl bg-[#101213] border border-[#292c2f] flex items-center justify-center relative overflow-hidden">

                  <div className="absolute inset-x-0 bottom-0 h-px bg-orange-500/20" />

                  <Car
                    size={76}
                    strokeWidth={1}
                    className="text-gray-700"
                  />

                  <div className="absolute bottom-3 left-4 text-[10px] uppercase tracking-[0.2em] text-gray-700">
                    AUTOCARE
                  </div>

                </div>

                {/* NAME */}

                <div className="mt-6">

                  <p className="text-xs text-gray-600 uppercase tracking-wider">
                    Vehicle
                  </p>

                  <p className="text-xl font-semibold mt-1">
                    {formData.brand || "Your brand"}{" "}
                    {formData.model || "Model"}
                  </p>

                  <p className="text-xs text-gray-600 mt-1 uppercase tracking-wider">
                    {formData.registrationNumber || "REGISTRATION"}
                  </p>

                </div>

                {/* SPECS */}

                <div className="mt-7 space-y-4">

                  <div className="flex items-center justify-between">

                    <div className="flex items-center gap-2">

                      <CalendarDays
                        size={15}
                        className="text-gray-600"
                      />

                      <span className="text-sm text-gray-600">
                        Year
                      </span>

                    </div>

                    <span className="text-sm text-gray-300">
                      {formData.year || "—"}
                    </span>

                  </div>

                  <div className="flex items-center justify-between">

                    <div className="flex items-center gap-2">

                      <Fuel
                        size={15}
                        className="text-gray-600"
                      />

                      <span className="text-sm text-gray-600">
                        Fuel
                      </span>

                    </div>

                    <span className="text-sm text-gray-300">
                      {formData.fuelType || "—"}
                    </span>

                  </div>

                  <div className="flex items-center justify-between">

                    <div className="flex items-center gap-2">

                      <Settings2
                        size={15}
                        className="text-gray-600"
                      />

                      <span className="text-sm text-gray-600">
                        Gearbox
                      </span>

                    </div>

                    <span className="text-sm text-gray-300">
                      {formData.transmission || "—"}
                    </span>

                  </div>

                  <div className="flex items-center justify-between">

                    <div className="flex items-center gap-2">

                      <Gauge
                        size={15}
                        className="text-gray-600"
                      />

                      <span className="text-sm text-gray-600">
                        Mileage
                      </span>

                    </div>

                    <span className="text-sm text-gray-300">
                      {formData.odometer
                        ? `${formData.odometer} km`
                        : "—"}
                    </span>

                  </div>

                </div>

              </div>

              {/* INFO */}

              <div className="px-5 py-4 bg-orange-500/[0.04] border-t border-orange-500/10">

                <p className="text-xs leading-5 text-gray-500">
                  Once added, this vehicle becomes part of your AutoCare
                  garage and can be used for maintenance and health tracking.
                </p>

              </div>

            </div>

          </aside>

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
    </div>
  );
};

export default AddVehicle;