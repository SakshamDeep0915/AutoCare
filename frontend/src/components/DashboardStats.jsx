import {
  Car,
  HeartPulse,
  Wrench,
  TriangleAlert,
  ArrowUpRight,
} from "lucide-react";

const DashboardStats = ({ totalVehicles }) => {
  const stats = [
    {
      title: "TOTAL VEHICLES",
      value: totalVehicles,
      icon: Car,
      description: "Registered vehicles",
    },
    {
      title: "HEALTH SCORE",
      value: "95%",
      icon: HeartPulse,
      description: "Overall vehicle health",
    },
    {
      title: "SERVICE DUE",
      value: "01",
      icon: Wrench,
      description: "Maintenance required",
    },
    {
      title: "AI ALERTS",
      value: "00",
      icon: TriangleAlert,
      description: "No critical alerts",
    },
  ];

  return (
    <div className="dashboard-stats-grid">

      {stats.map((item, index) => {
        const Icon = item.icon;

        return (
          <div
            key={index}
            className="dashboard-stat-card"
          >

            {/* Top row */}

            <div className="dashboard-stat-top">

              <div className="dashboard-stat-icon">
                <Icon size={17} />
              </div>

              <ArrowUpRight
                size={14}
                className="dashboard-stat-arrow"
              />

            </div>


            {/* Value */}

            <div className="dashboard-stat-content">

              <span className="dashboard-stat-title">
                {item.title}
              </span>

              <div className="dashboard-stat-value">
                {item.value}
              </div>

              <span className="dashboard-stat-description">
                {item.description}
              </span>

            </div>


            {/* Bottom indicator */}

            <div className="dashboard-stat-line">

              <span></span>

            </div>

          </div>
        );
      })}


      <style>{`

        /* =========================================
           STATS GRID
        ========================================= */

        .dashboard-stats-grid {

          display: grid;

          grid-template-columns:
            repeat(
              4,
              minmax(0, 1fr)
            );

          gap: 10px;

          margin-bottom: 32px;

        }


        /* =========================================
           CARD
        ========================================= */

        .dashboard-stat-card {

          position: relative;

          min-height: 155px;

          padding: 18px;

          overflow: hidden;

          background: #131617;

          border: 1px solid #292e31;

          border-radius: 11px;

          transition:
            transform 0.2s ease,
            border-color 0.2s ease,
            background 0.2s ease;

        }


        .dashboard-stat-card::before {

          content: "";

          position: absolute;

          width: 130px;

          height: 130px;

          right: -75px;

          top: -75px;

          border-radius: 50%;

          background:
            radial-gradient(
              circle,
              rgba(
                232,
                117,
                42,
                0.075
              ),
              transparent 70%
            );

          pointer-events: none;

        }


        .dashboard-stat-card:hover {

          transform:
            translateY(-3px);

          border-color:
            rgba(
              232,
              117,
              42,
              0.28
            );

          background: #16191a;

        }


        /* =========================================
           TOP
        ========================================= */

        .dashboard-stat-top {

          display: flex;

          align-items: center;

          justify-content: space-between;

        }


        .dashboard-stat-icon {

          width: 34px;

          height: 34px;

          display: flex;

          align-items: center;

          justify-content: center;

          border-radius: 8px;

          color: #e8752a;

          background:
            rgba(
              232,
              117,
              42,
              0.065
            );

          border: 1px solid
            rgba(
              232,
              117,
              42,
              0.13
            );

        }


        .dashboard-stat-arrow {

          color: #3e4548;

          transition:
            color 0.2s ease,
            transform 0.2s ease;

        }


        .dashboard-stat-card:hover
        .dashboard-stat-arrow {

          color: #e8752a;

          transform:
            translate(
              2px,
              -2px
            );

        }


        /* =========================================
           CONTENT
        ========================================= */

        .dashboard-stat-content {

          margin-top: 22px;

        }


        .dashboard-stat-title {

          display: block;

          color: #555c60;

          font-size: 7px;

          font-weight: 700;

          letter-spacing: 0.17em;

        }


        .dashboard-stat-value {

          margin-top: 6px;

          color: #e3e5e6;

          font-size: 28px;

          line-height: 1;

          font-weight: 600;

          letter-spacing: -0.04em;

        }


        .dashboard-stat-description {

          display: block;

          margin-top: 7px;

          color: #4d5458;

          font-size: 8px;

        }


        /* =========================================
           BOTTOM LINE
        ========================================= */

        .dashboard-stat-line {

          position: absolute;

          left: 18px;

          right: 18px;

          bottom: 14px;

          height: 1px;

          background: #252a2c;

        }


        .dashboard-stat-line span {

          display: block;

          width: 25px;

          height: 1px;

          background: #e8752a;

          transition:
            width 0.3s ease;

        }


        .dashboard-stat-card:hover
        .dashboard-stat-line span {

          width: 55px;

        }


        /* =========================================
           TABLET
        ========================================= */

        @media (max-width: 1000px) {

          .dashboard-stats-grid {

            grid-template-columns:
              repeat(
                2,
                minmax(0, 1fr)
              );

          }

        }


        /* =========================================
           MOBILE
        ========================================= */

        @media (max-width: 550px) {

          .dashboard-stats-grid {

            grid-template-columns: 1fr;

            gap: 9px;

          }


          .dashboard-stat-card {

            min-height: 140px;

          }

        }

      `}</style>

    </div>
  );
};

export default DashboardStats;