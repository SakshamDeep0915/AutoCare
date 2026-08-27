import {
  Wrench,
  CalendarDays,
  IndianRupee,
  ArrowUpRight,
  ClipboardList,
} from "lucide-react";


function RecentServices({
  services = [],
}) {

  return (

    <div className="recent-services-container">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="recent-services-header">

        <div className="recent-services-title">

          <div className="recent-services-icon">

            <ClipboardList size={20} />

          </div>

          <div>

            <p className="recent-services-kicker">
              MAINTENANCE ACTIVITY
            </p>

            <h3>
              Service history
            </h3>

          </div>

        </div>


        <span className="recent-services-count">

          {services.length}

          <span>
            RECORDS
          </span>

        </span>

      </div>


      {/* =====================================================
          EMPTY STATE
      ===================================================== */}

      {services.length === 0 ? (

        <div className="recent-services-empty">

          <div className="recent-empty-icon">

            <Wrench size={25} />

          </div>


          <h4>
            No service records yet
          </h4>


          <p>
            Your recent maintenance activity will appear here once
            you add a service record.
          </p>

        </div>

      ) : (

        /* ===================================================
           SERVICE LIST
        =================================================== */

        <div className="recent-services-list">

          {services.map(
            (service, index) => {

              const serviceDate =
                service.date ||
                service.serviceDate ||
                service.createdAt;


              const formattedDate =
                serviceDate
                  ? new Date(
                      serviceDate
                    ).toLocaleDateString(
                      "en-IN",
                      {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      }
                    )
                  : "Date unavailable";


              const cost =
                Number(
                  service.cost ||
                  service.amount ||
                  0
                );


              const vehicleName =
                service.vehicle?.brand ||
                service.vehicle?.model ||
                service.vehicleName ||
                "Vehicle";


              return (

                <div
                  key={
                    service._id ||
                    index
                  }
                  className="recent-service-row"
                >

                  {/* =================================================
                      ICON
                  ================================================= */}

                  <div className="recent-service-icon">

                    <Wrench size={19} />

                  </div>


                  {/* =================================================
                      MAIN INFO
                  ================================================= */}

                  <div className="recent-service-main">

                    <div className="recent-service-top">

                      <h4>

                        {service.serviceType ||
                          service.type ||
                          service.title ||
                          "Service"}

                      </h4>


                      <span className="recent-service-number">

                        {String(index + 1).padStart(
                          2,
                          "0"
                        )}

                      </span>

                    </div>


                    <div className="recent-service-meta">

                      <span>

                        <CalendarDays size={14} />

                        {formattedDate}

                      </span>


                      <span>

                        {vehicleName}

                      </span>

                    </div>


                    {service.description && (

                      <p className="recent-service-description">

                        {service.description}

                      </p>

                    )}

                  </div>


                  {/* =================================================
                      COST
                  ================================================= */}

                  <div className="recent-service-cost">

                    <span>
                      COST
                    </span>


                    <strong>

                      <IndianRupee size={15} />

                      {cost.toLocaleString(
                        "en-IN"
                      )}

                    </strong>

                  </div>


                  {/* =================================================
                      ACTION
                  ================================================= */}

                  <div className="recent-service-action">

                    <ArrowUpRight size={17} />

                  </div>

                </div>

              );

            }
          )}

        </div>

      )}


      {/* =====================================================
          STYLES
      ===================================================== */}

      <style>{`

        /* =====================================================
           CONTAINER
        ===================================================== */

        .recent-services-container {

          width: 100%;

          background: #131617;

          border:
            1px solid #292e31;

          border-radius: 12px;

          overflow: hidden;

        }


        /* =====================================================
           HEADER
        ===================================================== */

        .recent-services-header {

          display: flex;

          align-items: center;

          justify-content: space-between;

          gap: 20px;

          padding:
            21px 24px;

          background: #151819;

          border-bottom:
            1px solid #292e31;

        }


        .recent-services-title {

          display: flex;

          align-items: center;

          gap: 12px;

        }


        .recent-services-icon {

          width: 40px;

          height: 40px;

          display: flex;

          align-items: center;

          justify-content: center;

          flex-shrink: 0;

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
              0.14
            );

          border-radius: 9px;

        }


        .recent-services-kicker {

          margin: 0 0 4px;

          color: #626a6e;

          font-size: 11px;

          font-weight: 700;

          letter-spacing:
            0.15em;

        }


        .recent-services-title h3 {

          margin: 0;

          color: #d0d4d5;

          font-size: 21px;

          line-height: 1.25;

          font-weight: 600;

        }


        /* =====================================================
           COUNT
        ===================================================== */

        .recent-services-count {

          display: flex;

          align-items: center;

          gap: 7px;

          color: #e8752a;

          font-size: 15px;

          font-weight: 600;

        }


        .recent-services-count span {

          color: #626a6e;

          font-size: 10px;

          font-weight: 700;

          letter-spacing:
            0.1em;

        }


        /* =====================================================
           LIST
        ===================================================== */

        .recent-services-list {

          display: flex;

          flex-direction: column;

        }


        /* =====================================================
           SERVICE ROW
        ===================================================== */

        .recent-service-row {

          display: flex;

          align-items: center;

          gap: 15px;

          padding:
            18px 20px;

          border-bottom:
            1px solid #252a2c;

          background: #111314;

          transition:
            background 0.2s ease,
            border-color 0.2s ease;

        }


        .recent-service-row:last-child {

          border-bottom: none;

        }


        .recent-service-row:hover {

          background: #151819;

        }


        /* =====================================================
           SERVICE ICON
        ===================================================== */

        .recent-service-icon {

          width: 42px;

          height: 42px;

          display: flex;

          align-items: center;

          justify-content: center;

          flex-shrink: 0;

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
              0.14
            );

          border-radius: 9px;

        }


        /* =====================================================
           MAIN
        ===================================================== */

        .recent-service-main {

          flex: 1;

          min-width: 0;

        }


        .recent-service-top {

          display: flex;

          align-items: center;

          justify-content: space-between;

          gap: 10px;

        }


        .recent-service-top h4 {

          margin: 0;

          color: #cdd1d2;

          font-size: 16px;

          line-height: 1.4;

          font-weight: 600;

          overflow: hidden;

          text-overflow: ellipsis;

          white-space: nowrap;

        }


        .recent-service-number {

          color: #41494d;

          font-family:
            monospace;

          font-size: 10px;

          letter-spacing:
            0.08em;

        }


        /* =====================================================
           META
        ===================================================== */

        .recent-service-meta {

          display: flex;

          align-items: center;

          flex-wrap: wrap;

          gap: 15px;

          margin-top: 6px;

          color: #697175;

          font-size: 13px;

        }


        .recent-service-meta span {

          display: inline-flex;

          align-items: center;

          gap: 5px;

        }


        .recent-service-meta svg {

          color: #555e62;

          flex-shrink: 0;

        }


        /* =====================================================
           DESCRIPTION
        ===================================================== */

        .recent-service-description {

          margin:
            6px 0 0;

          color: #626a6e;

          font-size: 13px;

          line-height: 1.5;

          overflow: hidden;

          text-overflow: ellipsis;

          white-space: nowrap;

        }


        /* =====================================================
           COST
        ===================================================== */

        .recent-service-cost {

          min-width: 110px;

          text-align: right;

        }


        .recent-service-cost span {

          display: block;

          margin-bottom: 4px;

          color: #555e62;

          font-size: 9px;

          font-weight: 700;

          letter-spacing:
            0.12em;

        }


        .recent-service-cost strong {

          display: inline-flex;

          align-items: center;

          justify-content: flex-end;

          gap: 1px;

          color: #d5d9da;

          font-size: 16px;

          font-weight: 600;

        }


        .recent-service-cost strong svg {

          color: #e8752a;

        }


        /* =====================================================
           ACTION
        ===================================================== */

        .recent-service-action {

          width: 35px;

          height: 35px;

          display: flex;

          align-items: center;

          justify-content: center;

          flex-shrink: 0;

          color: #555e62;

          border:
            1px solid #292e31;

          border-radius: 7px;

          transition:
            color 0.2s ease,
            border-color 0.2s ease,
            background 0.2s ease;

        }


        .recent-service-row:hover
        .recent-service-action {

          color: #e8752a;

          border-color:
            rgba(
              232,
              117,
              42,
              0.28
            );

          background:
            rgba(
              232,
              117,
              42,
              0.04
            );

        }


        /* =====================================================
           EMPTY STATE
        ===================================================== */

        .recent-services-empty {

          min-height: 190px;

          display: flex;

          align-items: center;

          justify-content: center;

          flex-direction: column;

          text-align: center;

          padding: 30px;

        }


        .recent-empty-icon {

          width: 50px;

          height: 50px;

          display: flex;

          align-items: center;

          justify-content: center;

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
              0.14
            );

          border-radius: 10px;

        }


        .recent-services-empty h4 {

          margin:
            15px 0 0;

          color: #c4c9ca;

          font-size: 17px;

          font-weight: 600;

        }


        .recent-services-empty p {

          max-width: 480px;

          margin:
            6px 0 0;

          color: #626a6e;

          font-size: 14px;

          line-height: 1.6;

        }


        /* =====================================================
           TABLET
        ===================================================== */

        @media (max-width: 800px) {

          .recent-service-row {

            align-items:
              flex-start;

          }


          .recent-service-cost {

            min-width: 90px;

          }

        }


        /* =====================================================
           MOBILE
        ===================================================== */

        @media (max-width: 600px) {

          .recent-services-header {

            padding:
              18px;

          }


          .recent-services-title h3 {

            font-size: 19px;

          }


          .recent-services-count {

            font-size: 13px;

          }


          .recent-services-list {

            gap: 0;

          }


          .recent-service-row {

            display: grid;

            grid-template-columns:
              40px
              1fr
              auto;

            gap: 11px;

            padding:
              16px;

          }


          .recent-service-icon {

            width: 40px;

            height: 40px;

          }


          .recent-service-top h4 {

            font-size: 15px;

          }


          .recent-service-meta {

            font-size: 12px;

            gap: 9px;

          }


          .recent-service-description {

            font-size: 12px;

          }


          .recent-service-cost {

            grid-column: 2 / 3;

            min-width: 0;

            text-align: left;

            margin-top: 3px;

          }


          .recent-service-cost span {

            display: inline;

            margin-right: 6px;

          }


          .recent-service-cost strong {

            font-size: 14px;

          }


          .recent-service-action {

            grid-column: 3;

            grid-row: 1;

          }

        }

      `}</style>

    </div>

  );
}


export default RecentServices;