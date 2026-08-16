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
  // Load Expense Report
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
  // Initial Load
  // =====================================================

  useEffect(() => {
    loadReport();
  }, []);

  // =====================================================
  // Currency Formatter
  // =====================================================

  const formatCurrency = (amount) => {
    return `₹${Number(
      amount || 0
    ).toLocaleString("en-IN")}`;
  };

  // =====================================================
  // Date Formatter
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
  // Download PDF
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

    // ===================================================
    // Page Space Helper
    // ===================================================

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
    // Header
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
    // Vehicle Information
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
          data.vehicle.odometer !== undefined
            ? Number(
                data.vehicle.odometer
              ).toLocaleString("en-IN")
            : "N/A"
        } km`,
        20,
        y
      );

      y += 12;
    }

    // ===================================================
    // Report Period
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
    // Expense Summary
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
    // Table Header
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
    // Table Rows
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
    // Grand Total
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
    // Footer
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
    // Filename
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
  // Loading Screen
  // =====================================================

  if (loading) {
    return (
      <>
        <Navbar />

        <div className="min-h-screen flex justify-center items-center bg-gray-50">

          <div className="text-center">

            <div className="animate-spin w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto mb-4"></div>

            <h2 className="text-xl font-semibold text-gray-700">
              Loading Expense Report...
            </h2>

          </div>

        </div>
      </>
    );
  }

  // =====================================================
  // Main UI
  // =====================================================

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50 p-6">

        <div className="max-w-7xl mx-auto">

          {/* =================================================
              Back Button
          ================================================= */}

          <button
            onClick={() =>
              navigate(-1)
            }
            className="flex items-center gap-2 text-blue-600 hover:underline mb-6"
          >
            <ArrowLeft size={20} />

            Back
          </button>

          {/* =================================================
              Main Card
          ================================================= */}

          <div className="bg-white rounded-2xl shadow-lg p-8">

            {/* Header */}

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

              <div>

                <h1 className="text-3xl font-bold text-gray-800">
                  Vehicle Expense Report
                </h1>

                <p className="text-gray-500 mt-2">
                  Date-wise maintenance and fuel expenses
                </p>

              </div>

              <button
                onClick={
                  downloadPDF
                }
                disabled={
                  !data ||
                  !data.expenses?.length
                }
                className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-5 py-3 rounded-lg transition"
              >
                <Download size={20} />

                Download PDF
              </button>

            </div>

            {/* =================================================
                Filters
            ================================================= */}

            <div className="mt-8 bg-gray-50 rounded-xl p-5">

              <div className="flex items-center gap-2 mb-5">

                <Search
                  size={20}
                  className="text-blue-600"
                />

                <h2 className="font-semibold text-lg">
                  Filter Expenses
                </h2>

              </div>

              <div className="grid md:grid-cols-3 gap-4">

                {/* Registration Number */}

                <div>

                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Vehicle Registration Number
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
                    placeholder="e.g. PB11DQ0915"
                    className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                </div>

                {/* From Date */}

                <div>

                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    From Date
                  </label>

                  <input
                    type="date"
                    value={from}
                    onChange={(e) =>
                      setFrom(
                        e.target.value
                      )
                    }
                    className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                </div>

                {/* To Date */}

                <div>

                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    To Date
                  </label>

                  <input
                    type="date"
                    value={to}
                    onChange={(e) =>
                      setTo(
                        e.target.value
                      )
                    }
                    className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                </div>

              </div>

              <button
                onClick={
                  loadReport
                }
                disabled={
                  !registrationNumber.trim()
                }
                className="mt-5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition"
              >
                Apply Filters
              </button>

            </div>

            {/* =================================================
                Vehicle Information
            ================================================= */}

            {data?.vehicle && (

              <div className="mt-8 bg-blue-50 border border-blue-100 rounded-xl p-6">

                <div className="flex items-center gap-3 mb-5">

                  <div className="bg-blue-100 p-3 rounded-full">

                    <Car
                      className="text-blue-600"
                      size={25}
                    />

                  </div>

                  <div>

                    <h2 className="text-xl font-bold text-gray-800">
                      {data.vehicle.brand}{" "}
                      {data.vehicle.model}
                    </h2>

                    <p className="text-gray-500">
                      {data.vehicle.registrationNumber}
                    </p>

                  </div>

                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

                  <div>

                    <p className="text-sm text-gray-500">
                      Year
                    </p>

                    <p className="font-semibold">
                      {data.vehicle.year ||
                        "N/A"}
                    </p>

                  </div>

                  <div>

                    <p className="text-sm text-gray-500">
                      Fuel Type
                    </p>

                    <p className="font-semibold">
                      {data.vehicle.fuelType ||
                        "N/A"}
                    </p>

                  </div>

                  <div>

                    <p className="text-sm text-gray-500">
                      Odometer
                    </p>

                    <p className="font-semibold">
                      {data.vehicle.odometer !==
                      undefined
                        ? `${Number(
                            data.vehicle.odometer
                          ).toLocaleString(
                            "en-IN"
                          )} km`
                        : "N/A"}
                    </p>

                  </div>

                  <div>

                    <p className="text-sm text-gray-500">
                      Records
                    </p>

                    <p className="font-semibold">
                      {data.totalRecords}
                    </p>

                  </div>

                </div>

              </div>

            )}

            {/* =================================================
                Summary Cards
            ================================================= */}

            {data && (

              <div className="grid md:grid-cols-3 gap-5 mt-8">

                {/* Maintenance */}

                <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">

                  <div className="flex items-center gap-4">

                    <div className="bg-blue-100 p-3 rounded-full">

                      <Wrench
                        className="text-blue-600"
                        size={26}
                      />

                    </div>

                    <div>

                      <p className="text-gray-500">
                        Maintenance Cost
                      </p>

                      <h2 className="text-2xl font-bold text-gray-800">
                        {formatCurrency(
                          data.totalMaintenance
                        )}
                      </h2>

                    </div>

                  </div>

                </div>

                {/* Fuel */}

                <div className="bg-green-50 border border-green-100 rounded-xl p-6">

                  <div className="flex items-center gap-4">

                    <div className="bg-green-100 p-3 rounded-full">

                      <Fuel
                        className="text-green-600"
                        size={26}
                      />

                    </div>

                    <div>

                      <p className="text-gray-500">
                        Fuel Cost
                      </p>

                      <h2 className="text-2xl font-bold text-gray-800">
                        {formatCurrency(
                          data.totalFuel
                        )}
                      </h2>

                    </div>

                  </div>

                </div>

                {/* Total */}

                <div className="bg-purple-50 border border-purple-100 rounded-xl p-6">

                  <div className="flex items-center gap-4">

                    <div className="bg-purple-100 p-3 rounded-full">

                      <IndianRupee
                        className="text-purple-600"
                        size={26}
                      />

                    </div>

                    <div>

                      <p className="text-gray-500">
                        Total Expense
                      </p>

                      <h2 className="text-2xl font-bold text-gray-800">
                        {formatCurrency(
                          data.totalExpense
                        )}
                      </h2>

                    </div>

                  </div>

                </div>

              </div>

            )}

            {/* =================================================
                Expense History
            ================================================= */}

            <div className="mt-8">

              <h2 className="text-xl font-bold mb-4">
                Expense History
              </h2>

              {data?.expenses?.length >
              0 ? (

                <div className="overflow-x-auto">

                  <table className="w-full border-collapse">

                    <thead>

                      <tr className="bg-gray-100">

                        <th className="text-left p-4">
                          Date
                        </th>

                        <th className="text-left p-4">
                          Type
                        </th>

                        <th className="text-left p-4">
                          Vehicle
                        </th>

                        <th className="text-left p-4">
                          Description
                        </th>

                        <th className="text-right p-4">
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
                            className="border-b hover:bg-gray-50"
                          >

                            <td className="p-4">
                              {formatDate(
                                expense.date
                              )}
                            </td>

                            <td className="p-4">

                              <span
                                className={`px-3 py-1 rounded-full text-sm font-medium ${
                                  expense.type ===
                                  "Fuel"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-blue-100 text-blue-700"
                                }`}
                              >
                                {expense.type}
                              </span>

                            </td>

                            <td className="p-4">

                              <div className="font-medium">
                                {expense.vehicle}
                              </div>

                              {expense.registrationNumber && (

                                <div className="text-xs text-gray-500">
                                  {
                                    expense.registrationNumber
                                  }
                                </div>

                              )}

                            </td>

                            <td className="p-4 text-gray-600">
                              {
                                expense.description
                              }
                            </td>

                            <td className="p-4 text-right font-semibold">
                              {formatCurrency(
                                expense.amount
                              )}
                            </td>

                          </tr>

                        )
                      )}

                    </tbody>

                    {/* Total */}

                    {data && (

                      <tfoot>

                        <tr className="bg-gray-50 font-bold">

                          <td
                            colSpan="4"
                            className="p-4 text-right"
                          >
                            Grand Total
                          </td>

                          <td className="p-4 text-right">
                            {formatCurrency(
                              data.totalExpense
                            )}
                          </td>

                        </tr>

                      </tfoot>

                    )}

                  </table>

                </div>

              ) : (

                <div className="bg-gray-50 border rounded-xl p-10 text-center">

                  <p className="text-gray-500">
                    No expenses found for the selected vehicle and date range.
                  </p>

                </div>

              )}

            </div>

          </div>

        </div>

      </div>
    </>
  );
}

export default ExpenseReport;