import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import { useEffect, useState } from "react";

import { getExpenseReport } from "../services/dashboardService";


function ExpenseChart() {

  const [data, setData] = useState([]);

  const [loading, setLoading] =
    useState(true);


  // =====================================================
  // FETCH EXPENSE DATA
  // =====================================================

  useEffect(() => {

    const loadExpenses = async () => {

      try {

        const res =
          await getExpenseReport();

        setData(
          res.data?.monthly ||
          res.data ||
          []
        );

      } catch (err) {

        console.error(
          "Expense chart error:",
          err
        );

      } finally {

        setLoading(false);

      }

    };


    loadExpenses();

  }, []);


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (

      <div className="expense-chart-wrapper">

        <div className="expense-chart-loading">

          <div className="expense-loading-line large" />

          <div className="expense-loading-line medium" />

          <div className="expense-loading-chart" />

        </div>


        <style>{`

          .expense-chart-wrapper {

            width: 100%;

          }


          .expense-chart-loading {

            padding:
              12px 4px 4px;

          }


          .expense-loading-line {

            background: #202426;

            border-radius: 6px;

            animation:
              expensePulse
              1.5s
              ease-in-out
              infinite;

          }


          .expense-loading-line.large {

            width: 150px;

            height: 18px;

          }


          .expense-loading-line.medium {

            width: 230px;

            height: 12px;

            margin-top: 9px;

          }


          .expense-loading-chart {

            width: 100%;

            height: 230px;

            margin-top: 24px;

            border:
              1px solid #252a2c;

            border-radius: 10px;

            background:
              linear-gradient(
                180deg,
                #151819,
                #111314
              );

            animation:
              expensePulse
              1.5s
              ease-in-out
              infinite;

          }


          @keyframes expensePulse {

            0%,
            100% {
              opacity: .45;
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
  // EMPTY STATE
  // =====================================================

  if (!data.length) {

    return (

      <div className="expense-chart-empty">

        <div className="expense-empty-icon">
          ₹
        </div>


        <h3>
          No expense data yet
        </h3>


        <p>
          Add maintenance or fuel expenses to see your spending trend here.
        </p>


        <style>{`

          .expense-chart-empty {

            min-height: 250px;

            display: flex;

            align-items: center;

            justify-content: center;

            flex-direction: column;

            text-align: center;

            padding: 25px;

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
                0.07
              );

            border:
              1px solid
              rgba(
                232,
                117,
                42,
                0.15
              );

            font-size: 20px;

            font-weight: 600;

          }


          .expense-chart-empty h3 {

            margin:
              14px 0 0;

            color: #c8cdcf;

            font-size: 17px;

            font-weight: 600;

          }


          .expense-chart-empty p {

            max-width: 420px;

            margin:
              6px 0 0;

            color: #626a6e;

            font-size: 14px;

            line-height: 1.6;

          }

        `}</style>

      </div>

    );

  }


  // =====================================================
  // NORMALIZE DATA
  // =====================================================

  const chartData = data.map(
    (item) => ({

      month:
        item.month ||
        item.label ||
        item.name ||
        "",

      expense:
        Number(
          item.expense ??
          item.total ??
          item.amount ??
          0
        ),

    })
  );


  // =====================================================
  // TOTAL
  // =====================================================

  const totalExpense =
    chartData.reduce(
      (sum, item) =>
        sum + Number(item.expense || 0),
      0
    );


  // =====================================================
  // FORMAT CURRENCY
  // =====================================================

  const formatCurrency = (value) => {

    return `₹${Number(
      value || 0
    ).toLocaleString("en-IN")}`;

  };


  // =====================================================
  // TOOLTIP
  // =====================================================

  const CustomTooltip = ({
    active,
    payload,
    label,
  }) => {

    if (
      !active ||
      !payload ||
      !payload.length
    ) {

      return null;

    }


    return (

      <div className="expense-tooltip">

        <p className="expense-tooltip-label">
          {label}
        </p>


        <strong>
          {formatCurrency(
            payload[0].value
          )}
        </strong>


        <style>{`

          .expense-tooltip {

            min-width: 135px;

            padding:
              11px 13px;

            background: #0d0f10;

            border:
              1px solid #343a3d;

            border-radius: 8px;

            box-shadow:
              0 12px 30px
              rgba(0,0,0,0.35);

          }


          .expense-tooltip-label {

            margin: 0 0 4px;

            color: #737b7f;

            font-size: 11px;

            font-weight: 600;

          }


          .expense-tooltip strong {

            color: #e8752a;

            font-size: 16px;

            font-weight: 600;

          }

        `}</style>

      </div>

    );

  };


  // =====================================================
  // CHART
  // =====================================================

  return (

    <div className="expense-chart-wrapper">


      {/* =================================================
          CHART HEADER
      ================================================= */}

      <div className="expense-chart-summary">

        <div>

          <span className="expense-summary-label">
            TOTAL SPENDING
          </span>


          <strong className="expense-summary-value">

            {formatCurrency(
              totalExpense
            )}

          </strong>

        </div>


        <div className="expense-summary-period">

          <span className="expense-summary-dot" />

          <span>
            Monthly overview
          </span>

        </div>

      </div>


      {/* =================================================
          CHART
      ================================================= */}

      <div className="expense-chart">

        <ResponsiveContainer
          width="100%"
          height={270}
        >

          <AreaChart
            data={chartData}
            margin={{
              top: 10,
              right: 8,
              left: 0,
              bottom: 5,
            }}
          >

            <defs>

              <linearGradient
                id="expenseAreaGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >

                <stop
                  offset="0%"
                  stopColor="#f97316"
                  stopOpacity={0.25}
                />

                <stop
                  offset="100%"
                  stopColor="#f97316"
                  stopOpacity={0}
                />

              </linearGradient>

            </defs>


            <CartesianGrid
              stroke="#252a2c"
              strokeDasharray="3 5"
              vertical={false}
            />


            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "#687074",
                fontSize: 12,
              }}
              dy={10}
            />


            <YAxis
              axisLine={false}
              tickLine={false}
              width={55}
              tick={{
                fill: "#687074",
                fontSize: 11,
              }}
              tickFormatter={(value) =>
                `₹${Number(
                  value || 0
                ).toLocaleString("en-IN")}`
              }
            />


            <Tooltip
              content={
                <CustomTooltip />
              }
              cursor={{
                stroke: "#3b4144",
                strokeDasharray: "4 4",
              }}
            />


            <Area
              type="monotone"
              dataKey="expense"
              stroke="#f97316"
              strokeWidth={2.5}
              fill="url(#expenseAreaGradient)"
              dot={{
                r: 3,
                fill: "#f97316",
                strokeWidth: 0,
              }}
              activeDot={{
                r: 5,
                fill: "#f97316",
                stroke: "#151718",
                strokeWidth: 2,
              }}
            />

          </AreaChart>

        </ResponsiveContainer>

      </div>


      {/* =================================================
          FOOTER
      ================================================= */}

      <div className="expense-chart-footer">

        <span>
          Vehicle maintenance & fuel expenses
        </span>


        <span>
          {chartData.length} months
        </span>

      </div>


      {/* =================================================
          STYLES
      ================================================= */}

      <style>{`

        /* =================================================
           WRAPPER
        ================================================= */

        .expense-chart-wrapper {

          width: 100%;

        }


        /* =================================================
           SUMMARY
        ================================================= */

        .expense-chart-summary {

          display: flex;

          align-items: flex-end;

          justify-content: space-between;

          gap: 20px;

          padding:
            0 4px 15px;

        }


        .expense-summary-label {

          display: block;

          margin-bottom: 5px;

          color: #626a6e;

          font-size: 11px;

          font-weight: 700;

          letter-spacing:
            0.14em;

        }


        .expense-summary-value {

          display: block;

          color: #e0e3e4;

          font-size: 25px;

          line-height: 1.15;

          font-weight: 600;

          letter-spacing:
            -0.025em;

        }


        .expense-summary-period {

          display: flex;

          align-items: center;

          gap: 7px;

          color: #626a6e;

          font-size: 12px;

          white-space: nowrap;

        }


        .expense-summary-dot {

          width: 7px;

          height: 7px;

          border-radius: 50%;

          background: #e8752a;

          box-shadow:
            0 0 0 3px
            rgba(
              232,
              117,
              42,
              0.08
            );

        }


        /* =================================================
           CHART
        ================================================= */

        .expense-chart {

          width: 100%;

          min-height: 270px;

        }


        /* =================================================
           FOOTER
        ================================================= */

        .expense-chart-footer {

          display: flex;

          align-items: center;

          justify-content: space-between;

          gap: 15px;

          margin-top: 3px;

          padding:
            12px 4px 0;

          border-top:
            1px solid #252a2c;

          color: #565f63;

          font-size: 11px;

          line-height: 1.4;

        }


        .expense-chart-footer span:last-child {

          color: #626a6e;

          white-space: nowrap;

        }


        /* =================================================
           TABLET
        ================================================= */

        @media (max-width: 700px) {

          .expense-chart-summary {

            align-items:
              flex-start;

            flex-direction:
              column;

            gap: 9px;

          }


          .expense-summary-value {

            font-size: 23px;

          }


          .expense-chart {

            min-height: 240px;

          }

        }


        /* =================================================
           MOBILE
        ================================================= */

        @media (max-width: 480px) {

          .expense-chart-summary {

            padding:
              0 2px 10px;

          }


          .expense-summary-label {

            font-size: 10px;

          }


          .expense-summary-value {

            font-size: 21px;

          }


          .expense-summary-period {

            font-size: 11px;

          }


          .expense-chart {

            min-height: 220px;

          }


          .expense-chart-footer {

            font-size: 10px;

          }

        }

      `}</style>

    </div>

  );

}


export default ExpenseChart;