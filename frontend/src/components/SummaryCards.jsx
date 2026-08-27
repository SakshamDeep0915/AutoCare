import {
  Car,
  Wrench,
  IndianRupee,
  Fuel,
  ArrowUpRight,
} from "lucide-react";


function SummaryCards({
  totalVehicles,
  totalServices,
  maintenanceCost,
  fuelExpense,
}) {

  const cards = [
    {
      label: "TOTAL VEHICLES",
      title: "Vehicles",
      value: totalVehicles || 0,
      icon: Car,
      suffix: "",
    },
    {
      label: "SERVICE RECORDS",
      title: "Services",
      value: totalServices || 0,
      icon: Wrench,
      suffix: "",
    },
    {
      label: "MAINTENANCE",
      title: "Maintenance cost",
      value: `₹${Number(
        maintenanceCost || 0
      ).toLocaleString("en-IN")}`,
      icon: IndianRupee,
      suffix: "",
    },
    {
      label: "FUEL SPENDING",
      title: "Fuel expense",
      value: `₹${Number(
        fuelExpense || 0
      ).toLocaleString("en-IN")}`,
      icon: Fuel,
      suffix: "",
    },
  ];


  return (

    <div className="summary-cards-grid">

      {cards.map((card, index) => {

        const Icon = card.icon;


        return (

          <div
            key={index}
            className="summary-card"
          >

            {/* =================================================
                TOP
            ================================================= */}

            <div className="summary-card-top">

              <div className="summary-card-icon">

                <Icon size={19} />

              </div>


              <div className="summary-card-index">

                {String(index + 1).padStart(2, "0")}

              </div>

            </div>


            {/* =================================================
                CONTENT
            ================================================= */}

            <div className="summary-card-content">

              <span className="summary-card-label">

                {card.label}

              </span>


              <h3>

                {card.title}

              </h3>


              <div className="summary-card-value">

                {card.value}

              </div>

            </div>


            {/* =================================================
                FOOTER
            ================================================= */}

            <div className="summary-card-footer">

              <span>
                AutoCare AI monitoring
              </span>


              <ArrowUpRight size={15} />

            </div>

          </div>

        );

      })}


      {/* =====================================================
          STYLES
      ===================================================== */}

      <style>{`

        /* =====================================================
           GRID
        ===================================================== */

        .summary-cards-grid {

          display: grid;

          grid-template-columns:
            repeat(
              4,
              minmax(0, 1fr)
            );

          gap: 14px;

          margin-bottom: 24px;

        }


        /* =====================================================
           CARD
        ===================================================== */

        .summary-card {

          position: relative;

          min-height: 175px;

          padding: 20px;

          display: flex;

          flex-direction: column;

          justify-content: space-between;

          overflow: hidden;

          background: #131617;

          border:
            1px solid #292e31;

          border-radius: 12px;

          transition:
            transform 0.2s ease,
            border-color 0.2s ease,
            background 0.2s ease;

        }


        .summary-card::after {

          content: "";

          position: absolute;

          top: 0;

          left: 20px;

          width: 34px;

          height: 2px;

          background: #e8752a;

          opacity: 0.8;

        }


        .summary-card:hover {

          transform:
            translateY(-2px);

          background: #151819;

          border-color:
            rgba(
              232,
              117,
              42,
              0.3
            );

        }


        /* =====================================================
           TOP
        ===================================================== */

        .summary-card-top {

          display: flex;

          align-items: center;

          justify-content: space-between;

        }


        .summary-card-icon {

          width: 38px;

          height: 38px;

          display: flex;

          align-items: center;

          justify-content: center;

          border-radius: 9px;

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

        }


        .summary-card-index {

          color: #41494d;

          font-family:
            monospace;

          font-size: 10px;

          letter-spacing:
            0.08em;

        }


        /* =====================================================
           CONTENT
        ===================================================== */

        .summary-card-content {

          margin-top: 16px;

        }


        .summary-card-label {

          display: block;

          color: #626a6e;

          font-size: 11px;

          font-weight: 700;

          letter-spacing:
            0.14em;

          line-height: 1.3;

        }


        .summary-card-content h3 {

          margin:
            6px 0 0;

          color: #969da0;

          font-size: 15px;

          font-weight: 500;

          line-height: 1.4;

        }


        .summary-card-value {

          margin-top: 8px;

          color: #e0e3e4;

          font-size: 30px;

          font-weight: 650;

          line-height: 1.05;

          letter-spacing:
            -0.035em;

          white-space: nowrap;

          overflow: hidden;

          text-overflow: ellipsis;

        }


        /* =====================================================
           FOOTER
        ===================================================== */

        .summary-card-footer {

          display: flex;

          align-items: center;

          justify-content: space-between;

          gap: 10px;

          padding-top: 12px;

          border-top:
            1px solid #252a2c;

          color: #565f63;

          font-size: 11px;

          line-height: 1.4;

        }


        .summary-card-footer svg {

          flex-shrink: 0;

          color: #697175;

        }


        /* =====================================================
           LARGE SCREENS
        ===================================================== */

        @media (min-width: 1280px) {

          .summary-cards-grid {

            gap: 16px;

          }


          .summary-card {

            min-height: 180px;

            padding: 21px;

          }


          .summary-card-value {

            font-size: 32px;

          }

        }


        /* =====================================================
           TABLET
        ===================================================== */

        @media (max-width: 1000px) {

          .summary-cards-grid {

            grid-template-columns:
              repeat(
                2,
                minmax(0, 1fr)
              );

            gap: 14px;

          }


          .summary-card {

            min-height: 165px;

          }


          .summary-card-value {

            font-size: 28px;

          }

        }


        /* =====================================================
           MOBILE
        ===================================================== */

        @media (max-width: 600px) {

          .summary-cards-grid {

            grid-template-columns: 1fr;

            gap: 12px;

          }


          .summary-card {

            min-height: 150px;

            padding: 18px;

          }


          .summary-card-icon {

            width: 36px;

            height: 36px;

          }


          .summary-card-label {

            font-size: 10px;

          }


          .summary-card-content h3 {

            font-size: 15px;

          }


          .summary-card-value {

            font-size: 27px;

          }


          .summary-card-footer {

            font-size: 10px;

          }

        }

      `}</style>

    </div>

  );
}


export default SummaryCards;