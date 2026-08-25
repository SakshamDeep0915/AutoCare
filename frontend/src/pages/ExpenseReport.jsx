import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import {
  ArrowLeft,
  Download,
  Fuel,
  Wrench,
  IndianRupee,
  Search,
  Car,
  CalendarDays,
  Gauge,
  FileBarChart,
  Receipt,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import { getExpenseReport } from "../services/dashboardService";

function ExpenseReport() {
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const [registrationNumber, setRegistrationNumber] =
    useState("");

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  // =====================================================
  // LOAD EXPENSE REPORT
  // =====================================================

  const loadReport = async () => {
    try {
      setLoading(true);

      const res = await getExpenseReport(
        registrationNumber,
        from,
        to
      );

      setData(res.data);
    } catch (error) {
      console.error(
        "Expense Report Error:",
        error
      );

      setData(null);

      alert(
        error.response?.data?.message ||
          "Failed to load expense report"
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    loadReport();
  }, []);

  // =====================================================
  // CURRENCY FORMATTER
  // =====================================================

  const formatCurrency = (amount) => {
    return `₹${Number(
      amount || 0
    ).toLocaleString("en-IN")}`;
  };

  // =====================================================
  // DATE FORMATTER
  // =====================================================

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // =====================================================
  // CLEAR FILTERS
  // =====================================================

  const clearFilters = () => {
    setRegistrationNumber("");
    setFrom("");
    setTo("");
  };

  // =====================================================
  // DOWNLOAD PDF
  // =====================================================

  const downloadPDF = () => {
    if (
      !data ||
      !data.expenses ||
      data.expenses.length === 0
    ) {
      alert(
        "No expense records available for PDF."
      );

      return;
    }

    const doc = new jsPDF();

    const pageWidth =
      doc.internal.pageSize.getWidth();

    const pageHeight =
      doc.internal.pageSize.getHeight();

    let y = 20;

    const checkPage = (space = 10) => {
      if (
        y + space >
        pageHeight - 20
      ) {
        doc.addPage();

        y = 20;
      }
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
      "Vehicle Expense Report",
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

    doc.setFontSize(14);

    doc.text(
      "Vehicle Information",
      20,
      y
    );

    y += 9;

    doc.setFont(
      "helvetica",
      "normal"
    );

    doc.setFontSize(10);

    if (data.vehicle) {
      doc.text(
        `Vehicle: ${data.vehicle.brand} ${data.vehicle.model}`,
        20,
        y
      );

      y += 6;

      doc.text(
        `Registration Number: ${data.vehicle.registrationNumber}`,
        20,
        y
      );

      y += 6;

      doc.text(
        `Year: ${data.vehicle.year || "N/A"}`,
        20,
        y
      );

      y += 6;

      doc.text(
        `Fuel Type: ${data.vehicle.fuelType || "N/A"}`,
        20,
        y
      );

      y += 6;

      doc.text(
        `Odometer: ${
          data.vehicle.odometer !==
          undefined
            ? Number(
                data.vehicle.odometer
              ).toLocaleString(
                "en-IN"
              )
            : "N/A"
        } km`,
        20,
        y
      );

      y += 12;
    }

    // ===================================================
    // REPORT PERIOD
    // ===================================================

    doc.setFont(
      "helvetica",
      "bold"
    );

    doc.setFontSize(12);

    doc.text(
      "Report Period",
      20,
      y
    );

    y += 7;

    doc.setFont(
      "helvetica",
      "normal"
    );

    doc.setFontSize(10);

    doc.text(
      `From: ${
        from
          ? formatDate(from)
          : "All Dates"
      }`,
      20,
      y
    );

    doc.text(
      `To: ${
        to
          ? formatDate(to)
          : "Present"
      }`,
      105,
      y
    );

    y += 12;

    // ===================================================
    // EXPENSE SUMMARY
    // ===================================================

    doc.setFont(
      "helvetica",
      "bold"
    );

    doc.setFontSize(14);

    doc.text(
      "Expense Summary",
      20,
      y
    );

    y += 9;

    doc.setFont(
      "helvetica",
      "normal"
    );

    doc.setFontSize(11);

    doc.text(
      `Maintenance Cost: ${formatCurrency(
        data.totalMaintenance
      )}`,
      20,
      y
    );

    y += 7;

    doc.text(
      `Fuel Cost: ${formatCurrency(
        data.totalFuel
      )}`,
      20,
      y
    );

    y += 7;

    doc.setFont(
      "helvetica",
      "bold"
    );

    doc.text(
      `Total Expense: ${formatCurrency(
        data.totalExpense
      )}`,
      20,
      y
    );

    y += 15;

    // ===================================================
    // TABLE HEADER
    // ===================================================

    checkPage(20);

    doc.setFont(
      "helvetica",
      "bold"
    );

    doc.setFontSize(8.5);

    doc.text(
      "Date",
      15,
      y
    );

    doc.text(
      "Type",
      42,
      y
    );

    doc.text(
      "Vehicle",
      63,
      y
    );

    doc.text(
      "Description",
      103,
      y
    );

    doc.text(
      "Amount",
      175,
      y
    );

    y += 5;

    doc.line(
      15,
      y,
      195,
      y
    );

    y += 7;

    // ===================================================
    // TABLE ROWS
    // ===================================================

    doc.setFont(
      "helvetica",
      "normal"
    );

    doc.setFontSize(8);

    data.expenses.forEach(
      (expense) => {
        checkPage(15);

        const vehicleName =
          expense.vehicle || "-";

        const vehicle =
          vehicleName.length > 18
            ? vehicleName.substring(
                0,
                18
              ) + "..."
            : vehicleName;

        const description =
          expense.description || "-";

        const shortDescription =
          description.length > 27
            ? description.substring(
                0,
                27
              ) + "..."
            : description;

        doc.text(
          formatDate(
            expense.date
          ),
          15,
          y
        );

        doc.text(
          expense.type || "-",
          42,
          y
        );

        doc.text(
          vehicle,
          63,
          y
        );

        doc.text(
          shortDescription,
          103,
          y
        );

        doc.text(
          formatCurrency(
            expense.amount
          ),
          175,
          y
        );

        y += 7;
      }
    );

    // ===================================================
    // GRAND TOTAL
    // ===================================================

    checkPage(20);

    y += 3;

    doc.line(
      15,
      y,
      195,
      y
    );

    y += 8;

    doc.setFont(
      "helvetica",
      "bold"
    );

    doc.setFontSize(11);

    doc.text(
      "GRAND TOTAL",
      15,
      y
    );

    doc.text(
      formatCurrency(
        data.totalExpense
      ),
      175,
      y
    );

    // ===================================================
    // FOOTER
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

      doc.setFontSize(8);

      doc.text(
        `AutoCare AI | Expense Report | Page ${page} of ${totalPages}`,
        pageWidth / 2,
        pageHeight - 10,
        {
          align: "center",
        }
      );
    }

    // ===================================================
    // FILENAME
    // ===================================================

    const registration =
      data.vehicle?.registrationNumber ||
      registrationNumber ||
      "Vehicle";

    const safeRegistration =
      registration.replace(
        /[^a-zA-Z0-9]/g,
        "_"
      );

    doc.save(
      `AutoCare_AI_Expense_Report_${safeRegistration}.pdf`
    );
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="min-h-screen bg-[#0d0f10] text-white">

          <div className="max-w-7xl mx-auto px-5 lg:px-8 py-10">

            <div className="w-28 h-3 bg-[#1b1e20] rounded animate-pulse mb-5" />

            <div className="w-72 h-10 bg-[#1b1e20] rounded animate-pulse mb-3" />

            <div className="w-96 max-w-full h-4 bg-[#1b1e20] rounded animate-pulse mb-10" />

            <div className="h-40 bg-[#151718] border border-[#292c2f] rounded-2xl animate-pulse mb-6" />

            <div className="grid md:grid-cols-3 gap-5">

              {[1, 2, 3].map(
                (item) => (
                  <div
                    key={item}
                    className="h-32 bg-[#151718] border border-[#292c2f] rounded-2xl animate-pulse"
                  />
                )
              )}

            </div>

          </div>

        </main>
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

        {/* =================================================
            TOP BAR
        ================================================= */}

        <div className="border-b border-[#25282b] bg-[#101213]">

          <div className="max-w-7xl mx-auto px-5 lg:px-8 py-5">

            <button
              onClick={() =>
                navigate(-1)
              }
              className="group flex items-center gap-2 text-sm text-gray-500 hover:text-orange-500 transition"
            >

              <ArrowLeft
                size={17}
                className="group-hover:-translate-x-1 transition"
              />

              Back

            </button>

          </div>

        </div>

        <div className="max-w-7xl mx-auto px-5 lg:px-8 py-10">

          {/* =================================================
              HEADER
          ================================================= */}

          <section className="mb-8">

            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">

              <div>

                <div className="flex items-center gap-3 mb-3">

                  <span className="text-[11px] tracking-[0.25em] uppercase text-orange-500 font-semibold">
                    Garage Analytics
                  </span>

                  <span className="h-px w-8 bg-orange-500/50" />

                  <span className="text-[11px] tracking-wider text-gray-600">
                    EXPENSE REPORT
                  </span>

                </div>

                <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
                  Vehicle expenses
                </h1>

                <p className="text-gray-500 mt-2 max-w-xl">
                  Understand where your vehicle running costs are going across fuel and maintenance.
                </p>

              </div>

              <button
                onClick={downloadPDF}
                disabled={
                  !data ||
                  !data.expenses?.length
                }
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-orange-500 hover:bg-orange-400 disabled:bg-[#292c2f] disabled:text-gray-600 text-black font-semibold transition"
              >

                <Download size={17} />

                Download PDF

              </button>

            </div>

          </section>

          {/* =================================================
              FILTER PANEL
          ================================================= */}

          <section className="bg-[#151718] border border-[#292c2f] rounded-2xl overflow-hidden mb-6">

            <div className="px-6 py-5 border-b border-[#292c2f]">

              <div className="flex items-center gap-3">

                <div className="w-9 h-9 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">

                  <Search
                    size={17}
                    className="text-orange-500"
                  />

                </div>

                <div>

                  <h2 className="font-semibold">
                    Filter expenses
                  </h2>

                  <p className="text-xs text-gray-600 mt-1">
                    Select a vehicle and optional date range.
                  </p>

                </div>

              </div>

            </div>

            <div className="p-6">

              <div className="grid md:grid-cols-3 gap-5">

                {/* REGISTRATION */}

                <div>

                  <label className="filter-label">
                    Registration number
                  </label>

                  <input
                    type="text"
                    value={
                      registrationNumber
                    }
                    onChange={(e) =>
                      setRegistrationNumber(
                        e.target.value.toUpperCase()
                      )
                    }
                    placeholder="PB11DQ0915"
                    className="filter-input uppercase"
                  />

                </div>

                {/* FROM */}

                <div>

                  <label className="filter-label">
                    From date
                  </label>

                  <div className="relative">

                    <CalendarDays
                      size={16}
                      className="filter-icon"
                    />

                    <input
                      type="date"
                      value={from}
                      onChange={(e) =>
                        setFrom(
                          e.target.value
                        )
                      }
                      className="filter-input pl-10"
                    />

                  </div>

                </div>

                {/* TO */}

                <div>

                  <label className="filter-label">
                    To date
                  </label>

                  <div className="relative">

                    <CalendarDays
                      size={16}
                      className="filter-icon"
                    />

                    <input
                      type="date"
                      value={to}
                      onChange={(e) =>
                        setTo(
                          e.target.value
                        )
                      }
                      className="filter-input pl-10"
                    />

                  </div>

                </div>

              </div>

              <div className="flex flex-wrap gap-3 mt-5">

                <button
                  onClick={loadReport}
                  disabled={
                    !registrationNumber.trim() ||
                    loading
                  }
                  className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 disabled:bg-[#292c2f] disabled:text-gray-600 text-black font-semibold transition"
                >
                  Apply filters
                </button>

                {(registrationNumber ||
                  from ||
                  to) && (

                  <button
                    onClick={
                      clearFilters
                    }
                    className="px-5 py-2.5 rounded-xl border border-[#303438] text-gray-500 hover:text-white transition flex items-center gap-2"
                  >

                    <X size={15} />

                    Clear

                  </button>

                )}

              </div>

            </div>

          </section>

          {/* =================================================
              VEHICLE INFORMATION
          ================================================= */}

          {data?.vehicle && (

            <section className="bg-[#151718] border border-[#292c2f] rounded-2xl overflow-hidden mb-6">

              <div className="p-6">

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

                  <div className="flex items-center gap-4">

                    <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">

                      <Car
                        size={23}
                        className="text-orange-500"
                      />

                    </div>

                    <div>

                      <h2 className="text-xl font-semibold">
                        {data.vehicle.brand}{" "}
                        {data.vehicle.model}
                      </h2>

                      <p className="text-xs text-gray-600 mt-1 tracking-wider uppercase">
                        {
                          data.vehicle
                            .registrationNumber
                        }
                      </p>

                    </div>

                  </div>

                  <div className="grid grid-cols-3 gap-6 md:gap-8">

                    <VehicleMeta
                      label="Year"
                      value={
                        data.vehicle.year ||
                        "N/A"
                      }
                    />

                    <VehicleMeta
                      label="Fuel"
                      value={
                        data.vehicle.fuelType ||
                        "N/A"
                      }
                    />

                    <VehicleMeta
                      label="Odometer"
                      value={
                        data.vehicle
                          .odometer !==
                        undefined
                          ? `${Number(
                              data.vehicle
                                .odometer
                            ).toLocaleString(
                              "en-IN"
                            )} km`
                          : "N/A"
                      }
                    />

                  </div>

                </div>

              </div>

              <div className="px-6 py-3 bg-orange-500/[0.025] border-t border-[#292c2f]">

                <span className="text-xs text-gray-600">
                  {data.totalRecords || 0} expense records found
                </span>

              </div>

            </section>

          )}

          {/* =================================================
              SUMMARY
          ================================================= */}

          {data && (

            <section className="grid md:grid-cols-3 gap-5 mb-6">

              <ExpenseSummary
                icon={
                  <Wrench size={20} />
                }
                label="Maintenance"
                value={formatCurrency(
                  data.totalMaintenance
                )}
                description="Service and repair costs"
              />

              <ExpenseSummary
                icon={
                  <Fuel size={20} />
                }
                label="Fuel"
                value={formatCurrency(
                  data.totalFuel
                )}
                description="Fuel-related expenses"
              />

              <ExpenseSummary
                icon={
                  <IndianRupee
                    size={20}
                  />
                }
                label="Total expense"
                value={formatCurrency(
                  data.totalExpense
                )}
                description="Combined vehicle spending"
                primary
              />

            </section>

          )}

          {/* =================================================
              EXPENSE HISTORY
          ================================================= */}

          <section className="bg-[#151718] border border-[#292c2f] rounded-2xl overflow-hidden">

            <div className="px-6 py-5 border-b border-[#292c2f] flex items-center justify-between">

              <div className="flex items-center gap-3">

                <div className="w-9 h-9 rounded-lg bg-[#101213] border border-[#292c2f] flex items-center justify-center">

                  <Receipt
                    size={17}
                    className="text-gray-500"
                  />

                </div>

                <div>

                  <h2 className="font-semibold">
                    Expense history
                  </h2>

                  <p className="text-xs text-gray-600 mt-1">
                    Detailed record of vehicle expenses.
                  </p>

                </div>

              </div>

              {data?.expenses?.length >
                0 && (

                <span className="text-xs text-gray-600">
                  {data.expenses.length} records
                </span>

              )}

            </div>

            {data?.expenses?.length >
            0 ? (

              <div className="overflow-x-auto">

                <table className="w-full">

                  <thead>

                    <tr className="bg-[#111314] border-b border-[#292c2f]">

                      <th className="table-head">
                        Date
                      </th>

                      <th className="table-head">
                        Type
                      </th>

                      <th className="table-head">
                        Vehicle
                      </th>

                      <th className="table-head">
                        Description
                      </th>

                      <th className="table-head text-right">
                        Amount
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {data.expenses.map(
                      (
                        expense,
                        index
                      ) => (

                        <tr
                          key={index}
                          className="border-b border-[#222527] last:border-b-0 hover:bg-[#191b1d] transition"
                        >

                          <td className="table-cell whitespace-nowrap">

                            {formatDate(
                              expense.date
                            )}

                          </td>

                          <td className="table-cell">

                            <span
                              className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] uppercase tracking-wider font-medium ${
                                expense.type ===
                                "Fuel"
                                  ? "bg-orange-500/10 text-orange-500 border border-orange-500/15"
                                  : "bg-[#101213] text-gray-400 border border-[#303438]"
                              }`}
                            >
                              {expense.type}
                            </span>

                          </td>

                          <td className="table-cell">

                            <div className="text-gray-300 font-medium">
                              {
                                expense.vehicle
                              }
                            </div>

                            {expense.registrationNumber && (

                              <div className="text-[11px] text-gray-600 mt-1 tracking-wider">
                                {
                                  expense.registrationNumber
                                }
                              </div>

                            )}

                          </td>

                          <td className="table-cell text-gray-500 max-w-xs">

                            <span className="line-clamp-2">
                              {
                                expense.description ||
                                "-"
                              }
                            </span>

                          </td>

                          <td className="table-cell text-right font-semibold text-gray-200 whitespace-nowrap">

                            {formatCurrency(
                              expense.amount
                            )}

                          </td>

                        </tr>

                      )
                    )}

                  </tbody>

                  <tfoot>

                    <tr className="bg-[#111314]">

                      <td
                        colSpan="4"
                        className="px-5 py-5 text-right text-xs uppercase tracking-wider text-gray-600 font-semibold"
                      >
                        Grand total
                      </td>

                      <td className="px-5 py-5 text-right text-lg font-semibold text-orange-500">

                        {formatCurrency(
                          data.totalExpense
                        )}

                      </td>

                    </tr>

                  </tfoot>

                </table>

              </div>

            ) : (

              <div className="py-16 text-center px-5">

                <div className="w-12 h-12 mx-auto rounded-xl bg-[#101213] border border-[#292c2f] flex items-center justify-center">

                  <Receipt
                    size={21}
                    className="text-gray-700"
                  />

                </div>

                <h3 className="text-base font-semibold text-gray-400 mt-4">
                  No expenses found
                </h3>

                <p className="text-sm text-gray-600 mt-1 max-w-md mx-auto">
                  No expense records match the selected vehicle and date range.
                </p>

              </div>

            )}

          </section>

        </div>

      </main>

      {/* =================================================
          STYLES
      ================================================= */}

      <style>{`

        .filter-label {
          display: block;
          margin-bottom: 9px;
          font-size: 0.78rem;
          font-weight: 600;
          color: #b6babd;
        }

        .filter-input {
          width: 100%;
          height: 46px;
          background: #101213;
          border: 1px solid #2c3033;
          border-radius: 10px;
          padding: 0 14px;
          color: #f1f1f1;
          font-size: 0.9rem;
          outline: none;
          transition: all 0.2s ease;
        }

        .filter-input::placeholder {
          color: #505559;
        }

        .filter-input:focus {
          border-color: #e8752a;
          box-shadow: 0 0 0 3px rgba(232, 117, 42, 0.08);
        }

        .filter-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #5f6468;
          pointer-events: none;
        }

        .table-head {
          padding: 14px 20px;
          text-align: left;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.14em;
          color: #5f6468;
          font-weight: 600;
          white-space: nowrap;
        }

        .table-cell {
          padding: 16px 20px;
          font-size: 0.88rem;
          color: #9ca1a5;
        }

      `}</style>

    </>
  );
}

// =====================================================
// VEHICLE META
// =====================================================

function VehicleMeta({
  label,
  value,
}) {
  return (
    <div>

      <p className="text-[10px] uppercase tracking-wider text-gray-700">
        {label}
      </p>

      <p className="text-sm text-gray-300 mt-1 whitespace-nowrap">
        {value}
      </p>

    </div>
  );
}

// =====================================================
// EXPENSE SUMMARY
// =====================================================

function ExpenseSummary({
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

          <p className="text-[11px] uppercase tracking-[0.18em] text-gray-600">
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
              : "bg-[#101213] border border-[#292c2f] text-gray-500"
          }`}
        >
          {icon}
        </div>

      </div>

    </div>
  );
}

export default ExpenseReport;