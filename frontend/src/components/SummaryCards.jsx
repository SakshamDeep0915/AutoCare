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

            {/* ==========================================
                TOP
            ========================================== */}

            <div className="summary-card-top">

              <div className="summary-card-icon">
                <Icon size={16} />
              </div>

              <div className="summary-card-index">
                {String(index + 1).padStart(2, "0")}
              </div>

            </div>


            {/* ==========================================
                CONTENT
            ========================================== */}

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


            {/* ==========================================
                FOOTER
            ========================================== */}

            <div className="summary-card-footer">

              <span>
                AutoCare AI monitoring
              </span>

              <ArrowUpRight
                size={12}
              />

            </div>

          </div>
        );
      })}


      {/* ================================================
          STYLES
      ================================================= */}

      <style>{`

        /* ==========================================
           GRID
        ========================================== */

        .summary-cards-grid {

          display: grid;

          grid-template-columns:
            repeat(
              4,
              minmax(0, 1fr)
            );

          gap: 8px;

          margin-bottom: 20px;

        }


        /* ==========================================
           CARD
        ========================================== */

        .summary-card {

          position: relative;

          min-height: 145px;

          padding:
            15px;

          display: flex;

          flex-direction: column;

          justify-content: space-between;

          overflow: hidden;

          background: #131617;

          border:
            1px solid #292e31;

          border-radius: 9px;

          transition:
            transform 0.2s ease,
            border-color 0.2s ease,
            background 0.2s ease;

        }


        .summary-card::after {

          content: "";

          position: absolute;

          top: 0;

          left: 15px;

          width: 25px;

          height: 1px;

          background:
            #e8752a;

          opacity: 0.75;

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
              0.23
            );

        }


        /* ==========================================
           TOP
        ========================================== */

        .summary-card-top {

          display: flex;

          align-items: center;

          justify-content: space-between;

        }


        .summary-card-icon {

          width: 30px;

          height: 30px;

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
              0.055
            );

          border:
            1px solid
            rgba(
              232,
              117,
              42,
              0.12
            );

        }


        .summary-card-index {

          color: #343b3f;

          font-family:
            monospace;

          font-size: 7px;

          letter-spacing:
            0.08em;

        }


        /* ==========================================
           CONTENT
        ========================================== */

        .summary-card-content {

          margin-top: 13px;

        }


        .summary-card-label {

          display: block;

          color: #4a5256;

          font-size: 5px;

          font-weight: 700;

          letter-spacing:
            0.16em;

        }


        .summary-card-content h3 {

          margin:
            4px 0 0;

          color: #737b7f;

          font-size: 7px;

          font-weight: 500;

        }


        .summary-card-value {

          margin-top: 7px;

          color: #d0d4d5;

          font-size: 21px;

          font-weight: 600;

          line-height: 1;

          letter-spacing:
            -0.04em;

          white-space: nowrap;

          overflow: hidden;

          text-overflow: ellipsis;

        }


        /* ==========================================
           FOOTER
        ========================================== */

        .summary-card-footer {

          display: flex;

          align-items: center;

          justify-content: space-between;

          padding-top: 10px;

          border-top:
            1px solid #252a2c;

          color: #3f474b;

          font-size: 5px;

        }


        .summary-card-footer svg {

          color: #555d61;

        }


        /* ==========================================
           RESPONSIVE
        ========================================== */

        @media (max-width: 1000px) {

          .summary-cards-grid {

            grid-template-columns:
              repeat(
                2,
                minmax(0, 1fr)
              );

          }

        }


        @media (max-width: 600px) {

          .summary-cards-grid {

            grid-template-columns:
              1fr;

          }


          .summary-card {

            min-height:
              125px;

          }

        }

      `}</style>

    </div>
  );
}

export default SummaryCards;