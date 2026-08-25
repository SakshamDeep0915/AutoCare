import {
  Wrench,
  Car,
  CalendarDays,
  ArrowRight,
  ClipboardList,
} from "lucide-react";


function RecentServices({ services = [] }) {

  return (

    <section className="recent-services-container">


      {/* =================================================
          HEADER
      ================================================= */}

      <div className="recent-services-header">

        <div className="recent-services-title-group">

          <div className="recent-services-icon">

            <Wrench size={17} />

          </div>


          <div>

            <div className="recent-services-kicker">

              <span></span>

              MAINTENANCE ACTIVITY

            </div>

            <h2>
              Recent services
            </h2>

            <p>
              Latest maintenance records across your vehicles.
            </p>

          </div>

        </div>


        {services.length > 0 && (

          <div className="recent-services-count">

            <strong>
              {String(
                services.length
              ).padStart(2, "0")}
            </strong>

            <span>
              RECORDS
            </span>

          </div>

        )}

      </div>


      {/* =================================================
          EMPTY STATE
      ================================================= */}

      {services.length === 0 ? (

        <div className="recent-services-empty">

          <div className="recent-empty-icon">

            <ClipboardList
              size={20}
            />

          </div>


          <div>

            <h3>
              No recent services
            </h3>

            <p>
              Service records will appear here once maintenance is added.
            </p>

          </div>

        </div>

      ) : (

        /* =================================================
           SERVICE LIST
        ================================================= */

        <div className="recent-services-list">

          {services.map(
            (service, index) => (

              <div
                key={service._id}
                className="recent-service-card"
              >


                {/* ======================================
                    NUMBER
                ====================================== */}

                <div className="recent-service-number">

                  {String(
                    index + 1
                  ).padStart(2, "0")}

                </div>


                {/* ======================================
                    SERVICE ICON
                ====================================== */}

                <div className="recent-service-icon">

                  <Wrench
                    size={15}
                  />

                </div>


                {/* ======================================
                    SERVICE DETAILS
                ====================================== */}

                <div className="recent-service-details">

                  <h3>
                    {service.serviceType}
                  </h3>


                  <div className="recent-service-meta">


                    <span>

                      <Car
                        size={11}
                      />

                      {service.vehicle?.brand ||
                        "Vehicle"}{" "}

                      {service.vehicle?.model ||
                        ""}

                    </span>


                    <span>

                      <CalendarDays
                        size={11}
                      />

                      {new Date(
                        service.serviceDate
                      ).toLocaleDateString(
                        "en-IN",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        }
                      )}

                    </span>


                    {service.serviceCenter && (

                      <span className="service-center">

                        {service.serviceCenter}

                      </span>

                    )}

                  </div>

                </div>


                {/* ======================================
                    COST
                ====================================== */}

                <div className="recent-service-cost">

                  <span>
                    COST
                  </span>

                  <strong>

                    ₹
                    {Number(
                      service.cost || 0
                    ).toLocaleString(
                      "en-IN"
                    )}

                  </strong>

                </div>


                {/* ======================================
                    ARROW
                ====================================== */}

                <div className="recent-service-arrow">

                  <ArrowRight
                    size={14}
                  />

                </div>

              </div>

            )
          )}

        </div>

      )}


      {/* =================================================
          STYLES
      ================================================= */}

      <style>{`

        /* ==========================================
           CONTAINER
        ========================================== */

        .recent-services-container {

          width: 100%;

          margin-top: 20px;

          background: #131617;

          border:
            1px solid #292e31;

          border-radius: 12px;

          overflow: hidden;

        }


        /* ==========================================
           HEADER
        ========================================== */

        .recent-services-header {

          display: flex;

          align-items: center;

          justify-content: space-between;

          gap: 20px;

          padding:
            20px 22px;

          border-bottom:
            1px solid #292e31;

          background: #151819;

        }


        .recent-services-title-group {

          display: flex;

          align-items: center;

          gap: 10px;

        }


        .recent-services-icon {

          width: 35px;

          height: 35px;

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

          border:
            1px solid
            rgba(
              232,
              117,
              42,
              0.13
            );

        }


        .recent-services-kicker {

          display: flex;

          align-items: center;

          gap: 7px;

          color: #4d5458;

          font-size: 6px;

          font-weight: 700;

          letter-spacing:
            0.18em;

          margin-bottom: 4px;

        }


        .recent-services-kicker span {

          width: 17px;

          height: 1px;

          background:
            #e8752a;

        }


        .recent-services-header h2 {

          margin: 0;

          color: #d2d5d6;

          font-size: 14px;

          font-weight: 600;

          letter-spacing:
            -0.02em;

        }


        .recent-services-header p {

          margin:
            4px 0 0;

          color: #50575b;

          font-size: 8px;

        }


        /* ==========================================
           COUNT
        ========================================== */

        .recent-services-count {

          display: flex;

          align-items: center;

          gap: 7px;

          padding:
            7px 10px;

          border:
            1px solid
            rgba(
              232,
              117,
              42,
              0.16
            );

          border-radius: 6px;

          background:
            rgba(
              232,
              117,
              42,
              0.045
            );

        }


        .recent-services-count strong {

          color:
            #e8752a;

          font-size: 10px;

          font-weight: 600;

        }


        .recent-services-count span {

          color:
            #555d61;

          font-size: 5px;

          font-weight: 700;

          letter-spacing:
            0.13em;

        }


        /* ==========================================
           LIST
        ========================================== */

        .recent-services-list {

          padding: 11px;

          display: flex;

          flex-direction: column;

          gap: 6px;

        }


        /* ==========================================
           SERVICE CARD
        ========================================== */

        .recent-service-card {

          position: relative;

          display: flex;

          align-items: center;

          gap: 10px;

          min-height: 65px;

          padding:
            10px 11px;

          border:
            1px solid #252a2c;

          border-radius: 8px;

          background: #111314;

          transition:
            border-color 0.2s ease,
            background 0.2s ease,
            transform 0.2s ease;

        }


        .recent-service-card:hover {

          background: #151819;

          border-color:
            rgba(
              232,
              117,
              42,
              0.2
            );

          transform:
            translateX(2px);

        }


        /* ==========================================
           NUMBER
        ========================================== */

        .recent-service-number {

          width: 23px;

          flex-shrink: 0;

          color: #3f464a;

          font-family:
            monospace;

          font-size: 7px;

          text-align: center;

        }


        /* ==========================================
           ICON
        ========================================== */

        .recent-service-icon {

          width: 32px;

          height: 32px;

          flex-shrink: 0;

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


        /* ==========================================
           DETAILS
        ========================================== */

        .recent-service-details {

          min-width: 0;

          flex: 1;

        }


        .recent-service-details h3 {

          margin: 0;

          overflow: hidden;

          text-overflow:
            ellipsis;

          white-space:
            nowrap;

          color: #b9bec0;

          font-size: 9px;

          font-weight: 600;

        }


        .recent-service-meta {

          display: flex;

          align-items: center;

          flex-wrap: wrap;

          gap: 11px;

          margin-top: 5px;

        }


        .recent-service-meta span {

          display: inline-flex;

          align-items: center;

          gap: 4px;

          color: #50585c;

          font-size: 6px;

        }


        .recent-service-meta svg {

          color: #454c50;

        }


        .recent-service-meta
        .service-center {

          padding-left: 9px;

          border-left:
            1px solid #292e31;

          color: #454c50;

        }


        /* ==========================================
           COST
        ========================================== */

        .recent-service-cost {

          flex-shrink: 0;

          min-width: 80px;

          text-align: right;

          padding-left: 12px;

        }


        .recent-service-cost span {

          display: block;

          color: #41484c;

          font-size: 5px;

          font-weight: 700;

          letter-spacing:
            0.14em;

        }


        .recent-service-cost strong {

          display: block;

          margin-top: 4px;

          color: #e8752a;

          font-size: 10px;

          font-weight: 500;

        }


        /* ==========================================
           ARROW
        ========================================== */

        .recent-service-arrow {

          width: 27px;

          height: 27px;

          flex-shrink: 0;

          display: flex;

          align-items: center;

          justify-content: center;

          border:
            1px solid #292e31;

          border-radius: 6px;

          color: #4e565a;

          transition:
            all 0.2s ease;

        }


        .recent-service-card:hover
        .recent-service-arrow {

          color: #e8752a;

          border-color:
            rgba(
              232,
              117,
              42,
              0.22
            );

        }


        /* ==========================================
           EMPTY STATE
        ========================================== */

        .recent-services-empty {

          min-height: 145px;

          display: flex;

          align-items: center;

          justify-content: center;

          gap: 12px;

          padding: 25px;

        }


        .recent-empty-icon {

          width: 42px;

          height: 42px;

          flex-shrink: 0;

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


        .recent-services-empty h3 {

          margin: 0;

          color: #999fa2;

          font-size: 10px;

          font-weight: 600;

        }


        .recent-services-empty p {

          margin:
            4px 0 0;

          color: #4e565a;

          font-size: 7px;

          line-height: 1.6;

        }


        /* ==========================================
           MOBILE
        ========================================== */

        @media (max-width: 650px) {

          .recent-services-header {

            align-items:
              flex-start;

          }


          .recent-service-number {

            display: none;

          }


          .recent-service-card {

            align-items:
              flex-start;

          }


          .recent-service-cost {

            min-width: auto;

          }


          .recent-service-arrow {

            display: none;

          }


          .recent-service-meta {

            gap: 6px;

          }


          .recent-service-meta
          .service-center {

            width: 100%;

            padding-left: 0;

            border-left: none;

          }


          .recent-services-empty {

            align-items:
              flex-start;

          }

        }

      `}</style>

    </section>

  );
}


export default RecentServices;