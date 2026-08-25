import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import {
  BarChart3,
  IndianRupee,
  TrendingUp,
} from "lucide-react";

import { getMonthlyExpenses } from "../services/dashboardService";


function ExpenseChart() {

  const [data, setData] =
    useState([]);

  const [loading, setLoading] =
    useState(true);


  // =====================================================
  // LOAD EXPENSE DATA
  // =====================================================

  useEffect(() => {
    loadChart();
  }, []);


  const loadChart = async () => {

    try {

      const res =
        await getMonthlyExpenses();

      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];


      const formattedData =
        res.data.monthlyExpenses.map(
          (item) => ({
            month:
              `${months[item.month - 1]} ${item.year}`,

            shortMonth:
              months[item.month - 1],

            expense:
              item.totalExpense || 0,
          })
        );


      setData(formattedData);

    } catch (err) {

      console.error(
        "Expense Chart Error:",
        err
      );

    } finally {

      setLoading(false);

    }
  };


  // =====================================================
  // TOTAL EXPENSE
  // =====================================================

  const totalExpense =
    data.reduce(
      (total, item) =>
        total +
        Number(item.expense || 0),
      0
    );


  // =====================================================
  // HIGHEST MONTH
  // =====================================================

  const highestExpense =
    data.length > 0
      ? Math.max(
          ...data.map(
            (item) =>
              Number(
                item.expense || 0
              )
          )
        )
      : 0;


  // =====================================================
  // MAIN
  // =====================================================

  return (

    <section className="expense-chart-container">


      {/* =================================================
          HEADER
      ================================================= */}

      <div className="expense-chart-header">


        <div>

          <div className="expense-chart-kicker">

            <span></span>

            EXPENSE ANALYTICS

          </div>


          <div className="expense-chart-title-row">

            <div className="expense-chart-icon">

              <BarChart3 size={17} />

            </div>


            <div>

              <h2>
                Monthly expenses
              </h2>

              <p>
                Maintenance + fuel spending
              </p>

            </div>

          </div>

        </div>


        {/* =================================================
            TOTAL
        ================================================= */}

        <div className="expense-total">

          <span>
            TOTAL SPENDING
          </span>

          <strong>

            ₹
            {totalExpense.toLocaleString(
              "en-IN"
            )}

          </strong>

        </div>

      </div>


      {/* =================================================
          CHART
      ================================================= */}

      <div className="expense-chart-wrapper">

        {loading ? (

          <div className="expense-chart-loading">

            <div className="expense-loading-bar"></div>

            <div className="expense-loading-chart">

              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>

            </div>

          </div>

        ) : data.length === 0 ? (

          <div className="expense-empty">

            <div className="expense-empty-icon">

              <IndianRupee size={20} />

            </div>

            <h3>
              No expense data yet
            </h3>

            <p>
              Add fuel or service records
              to start tracking your spending.
            </p>

          </div>

        ) : (

          <ResponsiveContainer
            width="100%"
            height={320}
          >

            <BarChart
              data={data}
              margin={{
                top: 15,
                right: 10,
                left: -10,
                bottom: 5,
              }}
              barCategoryGap="30%"
            >

              <CartesianGrid
                stroke="#252a2c"
                strokeDasharray="2 5"
                vertical={false}
              />


              <XAxis
                dataKey="month"
                tick={{
                  fill: "#555c60",
                  fontSize: 8,
                }}
                axisLine={{
                  stroke: "#292e31",
                }}
                tickLine={false}
              />


              <YAxis
                tick={{
                  fill: "#555c60",
                  fontSize: 8,
                }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) =>
                  value >= 1000
                    ? `₹${(
                        value / 1000
                      ).toFixed(0)}k`
                    : `₹${value}`
                }
              />


              <Tooltip
                cursor={{
                  fill:
                    "rgba(232,117,42,0.035)",
                }}
                content={
                  <CustomTooltip />
                }
              />


              <Bar
                dataKey="expense"
                fill="#e8752a"
                radius={[
                  5,
                  5,
                  0,
                  0,
                ]}
                maxBarSize={42}
              />

            </BarChart>

          </ResponsiveContainer>

        )}

      </div>


      {/* =================================================
          FOOTER
      ================================================= */}

      {!loading &&
        data.length > 0 && (

          <div className="expense-chart-footer">


            <div className="expense-footer-stat">

              <div className="expense-footer-icon">

                <TrendingUp size={13} />

              </div>

              <div>

                <span>
                  HIGHEST MONTH
                </span>

                <strong>

                  ₹
                  {highestExpense.toLocaleString(
                    "en-IN"
                  )}

                </strong>

              </div>

            </div>


            <div className="expense-footer-note">

              Spending includes recorded
              maintenance and fuel expenses.

            </div>

          </div>

        )}


      {/* =================================================
          STYLES
      ================================================= */}

      <style>{`

        /* ==========================================
           CONTAINER
        ========================================== */

        .expense-chart-container {

          width: 100%;

          margin-top: 20px;

          background: #131617;

          border: 1px solid #292e31;

          border-radius: 12px;

          overflow: hidden;

        }


        /* ==========================================
           HEADER
        ========================================== */

        .expense-chart-header {

          display: flex;

          align-items: center;

          justify-content: space-between;

          gap: 20px;

          padding:
            20px 22px;

          border-bottom:
            1px solid #292e31;

        }


        .expense-chart-kicker {

          display: flex;

          align-items: center;

          gap: 7px;

          color: #4d5458;

          font-size: 6px;

          font-weight: 700;

          letter-spacing: 0.18em;

          margin-bottom: 9px;

        }


        .expense-chart-kicker span {

          width: 18px;

          height: 1px;

          background: #e8752a;

        }


        .expense-chart-title-row {

          display: flex;

          align-items: center;

          gap: 10px;

        }


        .expense-chart-icon {

          width: 33px;

          height: 33px;

          display: flex;

          align-items: center;

          justify-content: center;

          border-radius: 7px;

          color: #e8752a;

          background:
            rgba(
              232,
              117,
              42,
              0.065
            );

          border:
            1px solid
            rgba(
              232,
              117,
              42,
              0.13
            );

        }


        .expense-chart-title-row h2 {

          margin: 0;

          color: #d0d4d5;

          font-size: 13px;

          font-weight: 600;

          letter-spacing: -0.015em;

        }


        .expense-chart-title-row p {

          margin: 4px 0 0;

          color: #50575b;

          font-size: 8px;

        }


        /* ==========================================
           TOTAL
        ========================================== */

        .expense-total {

          text-align: right;

        }


        .expense-total span {

          display: block;

          color: #4d5458;

          font-size: 6px;

          font-weight: 700;

          letter-spacing: 0.15em;

        }


        .expense-total strong {

          display: block;

          margin-top: 5px;

          color: #e8752a;

          font-size: 18px;

          font-weight: 600;

          letter-spacing: -0.025em;

        }


        /* ==========================================
           CHART
        ========================================== */

        .expense-chart-wrapper {

          padding:
            20px 15px
            8px;

          min-height: 350px;

        }


        /* ==========================================
           EMPTY
        ========================================== */

        .expense-empty {

          min-height: 320px;

          display: flex;

          align-items: center;

          justify-content: center;

          flex-direction: column;

          text-align: center;

        }


        .expense-empty-icon {

          width: 48px;

          height: 48px;

          display: flex;

          align-items: center;

          justify-content: center;

          border-radius: 10px;

          color: #e8752a;

          background:
            rgba(
              232,
              117,
              42,
              0.06
            );

          border:
            1px solid
            rgba(
              232,
              117,
              42,
              0.13
            );

        }


        .expense-empty h3 {

          margin: 12px 0 0;

          color: #9da3a6;

          font-size: 13px;

          font-weight: 600;

        }


        .expense-empty p {

          max-width: 320px;

          margin: 6px 0 0;

          color: #50575b;

          font-size: 8px;

          line-height: 1.6;

        }


        /* ==========================================
           FOOTER
        ========================================== */

        .expense-chart-footer {

          display: flex;

          align-items: center;

          justify-content: space-between;

          gap: 20px;

          padding:
            13px 22px;

          border-top:
            1px solid #292e31;

          background: #111314;

        }


        .expense-footer-stat {

          display: flex;

          align-items: center;

          gap: 8px;

        }


        .expense-footer-icon {

          width: 27px;

          height: 27px;

          display: flex;

          align-items: center;

          justify-content: center;

          border-radius: 6px;

          color: #e8752a;

          background:
            rgba(
              232,
              117,
              42,
              0.06
            );

        }


        .expense-footer-stat span {

          display: block;

          color: #474e52;

          font-size: 5px;

          font-weight: 700;

          letter-spacing: 0.14em;

        }


        .expense-footer-stat strong {

          display: block;

          color: #8e9598;

          font-size: 9px;

          margin-top: 3px;

          font-weight: 500;

        }


        .expense-footer-note {

          color: #40474b;

          font-size: 7px;

          text-align: right;

        }


        /* ==========================================
           LOADING
        ========================================== */

        .expense-chart-loading {

          min-height: 320px;

          padding: 25px;

          display: flex;

          flex-direction: column;

          justify-content: flex-end;

        }


        .expense-loading-bar {

          width: 100%;

          height: 1px;

          background: #252a2c;

          margin-bottom: 20px;

        }


        .expense-loading-chart {

          height: 220px;

          display: flex;

          align-items: flex-end;

          justify-content: space-around;

          gap: 20px;

        }


        .expense-loading-chart span {

          width: 8%;

          height: 30%;

          border-radius:
            4px 4px 0 0;

          background: #1b1f20;

          animation:
            expense-pulse
            1.3s infinite;

        }


        .expense-loading-chart
        span:nth-child(2) {

          height: 55%;

          animation-delay:
            0.1s;

        }


        .expense-loading-chart
        span:nth-child(3) {

          height: 40%;

          animation-delay:
            0.2s;

        }


        .expense-loading-chart
        span:nth-child(4) {

          height: 70%;

          animation-delay:
            0.3s;

        }


        .expense-loading-chart
        span:nth-child(5) {

          height: 48%;

          animation-delay:
            0.4s;

        }


        .expense-loading-chart
        span:nth-child(6) {

          height: 65%;

          animation-delay:
            0.5s;

        }


        @keyframes expense-pulse {

          0%,
          100% {
            opacity: 0.45;
          }

          50% {
            opacity: 1;
          }

        }


        /* ==========================================
           TABLET
        ========================================== */

        @media (max-width: 650px) {

          .expense-chart-header {

            align-items:
              flex-start;

            flex-direction:
              column;

          }


          .expense-total {

            text-align: left;

          }


          .expense-chart-wrapper {

            padding:
              15px 5px 5px;

          }


          .expense-chart-footer {

            align-items:
              flex-start;

            flex-direction:
              column;

          }


          .expense-footer-note {

            text-align: left;

          }

        }

      `}</style>

    </section>
  );
}


/* =====================================================
   CUSTOM TOOLTIP
===================================================== */

function CustomTooltip({
  active,
  payload,
  label,
}) {

  if (
    !active ||
    !payload ||
    !payload.length
  ) {
    return null;
  }


  const value =
    payload[0].value || 0;


  return (

    <div
      style={{
        background: "#101213",
        border:
          "1px solid #343a3d",
        borderRadius: "7px",
        padding: "9px 11px",
        boxShadow:
          "0 12px 30px rgba(0,0,0,0.35)",
      }}
    >

      <div
        style={{
          color: "#555c60",
          fontSize: "7px",
          fontWeight: 700,
          letterSpacing: "0.12em",
          marginBottom: "5px",
        }}
      >
        {label}
      </div>


      <div
        style={{
          color: "#e8752a",
          fontSize: "12px",
          fontWeight: 600,
        }}
      >
        ₹
        {Number(value).toLocaleString(
          "en-IN"
        )}
      </div>

    </div>

  );
}


export default ExpenseChart;