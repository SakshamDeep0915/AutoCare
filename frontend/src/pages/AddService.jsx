import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { addService } from "../services/serviceService";

import {
  ArrowLeft,
  Wrench,
  CalendarDays,
  Gauge,
  IndianRupee,
  Building2,
  FileText,
  CheckCircle2,
} from "lucide-react";

function AddService() {
  const { vehicleId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    serviceType: "",
    serviceCenter: "",
    serviceDate: "",
    odometer: "",
    cost: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);

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
  // SUBMIT SERVICE
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await addService(vehicleId, formData);

      alert("Service added successfully!");

      navigate(`/vehicles/${vehicleId}/services`);
    } catch (error) {
      console.error(error);
      alert("Failed to add service");
    } finally {
      setLoading(false);
    }
  };

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
                navigate(`/vehicles/${vehicleId}/services`)
              }
              className="group flex items-center gap-2 text-sm text-gray-500 hover:text-orange-500 transition"
            >
              <ArrowLeft
                size={17}
                className="group-hover:-translate-x-1 transition"
              />

              Service History
            </button>

          </div>

        </div>

        {/* ==========================================
            PAGE CONTENT
        ========================================== */}

        <div className="max-w-6xl mx-auto px-5 lg:px-8 py-10">

          {/* ==========================================
              HEADER
          ========================================== */}

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">

            <div>

              <div className="flex items-center gap-3 mb-3">

                <span className="text-[11px] tracking-[0.25em] uppercase text-orange-500 font-semibold">
                  Service Log
                </span>

                <span className="h-px w-8 bg-orange-500/50" />

                <span className="text-[11px] tracking-wider text-gray-600">
                  MAINTENANCE
                </span>

              </div>

              <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
                Add service record
              </h1>

              <p className="text-gray-500 mt-2">
                Keep a detailed record of work performed on your vehicle.
              </p>

            </div>

            {/* ICON */}

            <div className="flex items-center gap-3">

              <div className="w-11 h-11 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">

                <Wrench
                  size={21}
                  className="text-orange-500"
                />

              </div>

              <div>

                <p className="text-sm font-medium text-gray-200">
                  Vehicle maintenance
                </p>

                <p className="text-xs text-gray-600 uppercase tracking-wider">
                  SERVICE RECORD
                </p>

              </div>

            </div>

          </div>

          {/* ==========================================
              FORM + SUMMARY
          ========================================== */}

          <div className="grid lg:grid-cols-[1fr_300px] gap-6">

            {/* ==========================================
                FORM
            ========================================== */}

            <div className="bg-[#151718] border border-[#292c2f] rounded-2xl overflow-hidden">

              <form onSubmit={handleSubmit}>

                {/* ======================================
                    SERVICE DETAILS
                ====================================== */}

                <div className="p-6 md:p-8 border-b border-[#292c2f]">

                  <div className="mb-6">

                    <p className="text-xs uppercase tracking-[0.18em] text-orange-500 font-semibold">
                      Service details
                    </p>

                    <p className="text-sm text-gray-600 mt-1">
                      What work was performed on the vehicle?
                    </p>

                  </div>

                  <div className="grid md:grid-cols-2 gap-5">

                    {/* SERVICE TYPE */}

                    <div>

                      <label className="field-label">
                        Service type <span>*</span>
                      </label>

                      <div className="relative">

                        <Wrench
                          size={17}
                          className="field-icon"
                        />

                        <input
                          type="text"
                          name="serviceType"
                          value={formData.serviceType}
                          onChange={handleChange}
                          required
                          placeholder="Engine oil change"
                          className="field-input pl-11"
                        />

                      </div>

                    </div>

                    {/* SERVICE CENTER */}

                    <div>

                      <label className="field-label">
                        Service center <span>*</span>
                      </label>

                      <div className="relative">

                        <Building2
                          size={17}
                          className="field-icon"
                        />

                        <input
                          type="text"
                          name="serviceCenter"
                          value={formData.serviceCenter}
                          onChange={handleChange}
                          required
                          placeholder="Mahindra Service Center"
                          className="field-input pl-11"
                        />

                      </div>

                    </div>

                  </div>

                </div>

                {/* ======================================
                    SERVICE DATE + ODOMETER
                ====================================== */}

                <div className="p-6 md:p-8 border-b border-[#292c2f]">

                  <div className="mb-6">

                    <p className="text-xs uppercase tracking-[0.18em] text-orange-500 font-semibold">
                      Service information
                    </p>

                    <p className="text-sm text-gray-600 mt-1">
                      Record when the service happened and the vehicle mileage.
                    </p>

                  </div>

                  <div className="grid md:grid-cols-2 gap-5">

                    {/* DATE */}

                    <div>

                      <label className="field-label">
                        Service date <span>*</span>
                      </label>

                      <div className="relative">

                        <CalendarDays
                          size={17}
                          className="field-icon"
                        />

                        <input
                          type="date"
                          name="serviceDate"
                          value={formData.serviceDate}
                          onChange={handleChange}
                          required
                          className="field-input pl-11"
                        />

                      </div>

                    </div>

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
                          required
                          min="0"
                          placeholder="21500"
                          className="field-input pl-11 pr-14"
                        />

                        <span className="unit-label">
                          km
                        </span>

                      </div>

                    </div>

                  </div>

                </div>

                {/* ======================================
                    COST
                ====================================== */}

                <div className="p-6 md:p-8 border-b border-[#292c2f]">

                  <div className="mb-6">

                    <p className="text-xs uppercase tracking-[0.18em] text-orange-500 font-semibold">
                      Cost
                    </p>

                    <p className="text-sm text-gray-600 mt-1">
                      Record the amount paid for this service.
                    </p>

                  </div>

                  <div className="max-w-md">

                    <label className="field-label">
                      Service cost <span>*</span>
                    </label>

                    <div className="relative">

                      <IndianRupee
                        size={17}
                        className="field-icon"
                      />

                      <input
                        type="number"
                        name="cost"
                        value={formData.cost}
                        onChange={handleChange}
                        required
                        min="0"
                        step="0.01"
                        placeholder="1500"
                        className="field-input pl-11"
                      />

                    </div>

                  </div>

                </div>

                {/* ======================================
                    DESCRIPTION
                ====================================== */}

                <div className="p-6 md:p-8">

                  <div className="mb-5">

                    <p className="text-xs uppercase tracking-[0.18em] text-orange-500 font-semibold">
                      Notes
                    </p>

                    <p className="text-sm text-gray-600 mt-1">
                      Add any useful details about the work performed.
                    </p>

                  </div>

                  <label className="field-label">
                    Description
                  </label>

                  <div className="relative">

                    <FileText
                      size={17}
                      className="absolute left-4 top-4 text-gray-600"
                    />

                    <textarea
                      rows="5"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Parts replaced, issues found, technician notes..."
                      className="field-input pl-11 resize-none"
                    />

                  </div>

                </div>

                {/* ======================================
                    ACTIONS
                ====================================== */}

                <div className="px-6 md:px-8 py-5 bg-[#111314] border-t border-[#292c2f] flex flex-col-reverse sm:flex-row sm:justify-end gap-3">

                  <button
                    type="button"
                    onClick={() =>
                      navigate(`/vehicles/${vehicleId}/services`)
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
                        Save service record
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
                    Record summary
                  </p>

                  <p className="text-lg font-semibold mt-1">
                    Service overview
                  </p>

                </div>

                <div className="p-5">

                  {/* SERVICE */}

                  <div className="mb-6">

                    <p className="text-xs text-gray-600 uppercase tracking-wider">
                      Service
                    </p>

                    <p className="text-base text-gray-200 mt-1 font-medium">
                      {formData.serviceType || "Not specified"}
                    </p>

                  </div>

                  {/* COST */}

                  <div className="mb-6">

                    <p className="text-xs text-gray-600 uppercase tracking-wider">
                      Cost
                    </p>

                    <p className="text-3xl font-semibold tracking-tight mt-1">
                      ₹{formData.cost || "0"}
                    </p>

                  </div>

                  <div className="space-y-4">

                    <div className="flex justify-between gap-4">

                      <span className="text-sm text-gray-600">
                        Date
                      </span>

                      <span className="text-sm text-gray-300">
                        {formData.serviceDate || "—"}
                      </span>

                    </div>

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

                    <div className="h-px bg-[#292c2f]" />

                    <div className="flex justify-between gap-4">

                      <span className="text-sm text-gray-600">
                        Center
                      </span>

                      <span className="text-sm text-gray-300 text-right max-w-[150px] truncate">
                        {formData.serviceCenter || "—"}
                      </span>

                    </div>

                  </div>

                </div>

                {/* INFO */}

                <div className="px-5 py-4 bg-orange-500/[0.04] border-t border-orange-500/10">

                  <div className="flex gap-3">

                    <Wrench
                      size={17}
                      className="text-orange-500 mt-0.5 shrink-0"
                    />

                    <p className="text-xs leading-5 text-gray-500">
                      Keeping service records updated helps AutoCare AI understand your vehicle's maintenance history.
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

export default AddService;