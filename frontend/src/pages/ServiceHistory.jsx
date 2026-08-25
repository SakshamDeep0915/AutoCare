import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";

import {
  ArrowLeft,
  Wrench,
  MapPin,
  CalendarDays,
  Gauge,
  IndianRupee,
  Pencil,
  Trash2,
  Plus,
  FileText,
  Clock3,
  ArrowRight,
} from "lucide-react";

import {
  getServices,
  deleteService,
} from "../services/serviceService";


function ServiceHistory() {
  const { vehicleId } = useParams();

  const navigate = useNavigate();

  const [services, setServices] =
    useState([]);

  const [loading, setLoading] =
    useState(true);


  // ==================================================
  // FETCH SERVICES
  // ==================================================

  const fetchServices = async () => {
    try {
      const res =
        await getServices(vehicleId);

      setServices(
        res.data.services || []
      );

    } catch (error) {

      console.error(error);

      alert(
        "Failed to load service history"
      );

    } finally {

      setLoading(false);

    }
  };


  useEffect(() => {
    fetchServices();
  }, []);


  // ==================================================
  // DELETE SERVICE
  // ==================================================

  const handleDelete = async (id) => {

    const confirmDelete =
      window.confirm(
        "Delete this service record?"
      );

    if (!confirmDelete) return;

    try {

      await deleteService(id);

      setServices((prev) =>
        prev.filter(
          (service) =>
            service._id !== id
        )
      );

    } catch (error) {

      console.error(error);

      alert(
        "Failed to delete service"
      );

    }
  };


  // ==================================================
  // LOADING
  // ==================================================

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="service-history-page">

          <div className="service-history-container">

            <div className="history-skeleton-small"></div>

            <div className="history-skeleton-title"></div>

            <div className="history-skeleton-subtitle"></div>

            <div className="history-skeleton-card"></div>

            <div className="history-skeleton-card"></div>

          </div>

        </main>
      </>
    );
  }


  // ==================================================
  // TOTAL COST
  // ==================================================

  const totalCost =
    services.reduce(
      (total, service) =>
        total +
        Number(service.cost || 0),
      0
    );


  // ==================================================
  // MAIN
  // ==================================================

  return (
    <>
      <Navbar />

      <main className="service-history-page">

        <div className="service-history-container">


          {/* ==================================================
              BACK
          ================================================== */}

          <button
            onClick={() =>
              navigate(
                `/vehicles/${vehicleId}`
              )
            }
            className="history-back-button"
          >

            <ArrowLeft size={16} />

            Back to vehicle

          </button>


          {/* ==================================================
              HEADER
          ================================================== */}

          <section className="history-header">

            <div>

              <div className="history-kicker">

                <span></span>

                VEHICLE MAINTENANCE

              </div>


              <h1>
                Service History
              </h1>


              <p>
                A complete record of your vehicle's
                maintenance and servicing activity.
              </p>

            </div>


            <Link
              to={`/vehicles/${vehicleId}/add-service`}
              className="add-service-button"
            >

              <Plus size={17} />

              Add service

              <ArrowRight size={14} />

            </Link>

          </section>


          {/* ==================================================
              SUMMARY
          ================================================== */}

          {services.length > 0 && (

            <section className="history-summary">

              <div className="summary-item">

                <div className="summary-icon">

                  <Wrench size={17} />

                </div>

                <div>

                  <span>
                    SERVICE RECORDS
                  </span>

                  <strong>
                    {services.length}
                  </strong>

                </div>

              </div>


              <div className="summary-divider"></div>


              <div className="summary-item">

                <div className="summary-icon">

                  <IndianRupee size={17} />

                </div>

                <div>

                  <span>
                    TOTAL MAINTENANCE
                  </span>

                  <strong>
                    ₹{totalCost.toLocaleString("en-IN")}
                  </strong>

                </div>

              </div>


              <div className="summary-divider"></div>


              <div className="summary-item">

                <div className="summary-icon">

                  <Clock3 size={17} />

                </div>

                <div>

                  <span>
                    LATEST SERVICE
                  </span>

                  <strong>

                    {services.length > 0
                      ? new Date(
                          services[0].serviceDate
                        ).toLocaleDateString(
                          "en-IN",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }
                        )
                      : "—"}

                  </strong>

                </div>

              </div>

            </section>

          )}


          {/* ==================================================
              EMPTY STATE
          ================================================== */}

          {services.length === 0 ? (

            <section className="empty-service-state">

              <div className="empty-icon">

                <FileText size={26} />

              </div>


              <div className="empty-content">

                <span className="empty-kicker">
                  MAINTENANCE LOG
                </span>

                <h2>
                  No service records yet
                </h2>

                <p>
                  Start building your vehicle's
                  maintenance history by adding
                  your first service record.
                </p>

                <Link
                  to={`/vehicles/${vehicleId}/add-service`}
                  className="empty-add-button"
                >

                  <Plus size={16} />

                  Add first service

                </Link>

              </div>

            </section>

          ) : (

            /* ==================================================
               SERVICE LIST
            ================================================== */

            <section className="service-list-section">

              <div className="list-header">

                <div>

                  <div className="list-title">

                    <Wrench
                      size={17}
                    />

                    <h2>
                      Maintenance records
                    </h2>

                  </div>

                  <p>
                    Your vehicle's recorded service activity.
                  </p>

                </div>


                <span className="record-count">

                  {services.length}{" "}

                  {services.length === 1
                    ? "record"
                    : "records"}

                </span>

              </div>


              <div className="service-list">

                {services.map(
                  (
                    service,
                    index
                  ) => (

                    <article
                      key={service._id}
                      className="service-record"
                    >


                      {/* TIMELINE */}

                      <div className="record-timeline">

                        <div className="timeline-number">

                          {String(
                            index + 1
                          ).padStart(
                            2,
                            "0"
                          )}

                        </div>

                        {index !==
                          services.length -
                            1 && (

                          <div className="timeline-line"></div>

                        )}

                      </div>


                      {/* RECORD */}

                      <div className="record-content">


                        {/* TOP */}

                        <div className="record-top">

                          <div>

                            <div className="record-type">

                              <span className="record-status-dot"></span>

                              SERVICE RECORD

                            </div>

                            <h3>
                              {
                                service.serviceType
                              }
                            </h3>

                          </div>


                          {/* ACTIONS */}

                          <div className="record-actions">

                            <Link
                              to={`/services/edit/${service._id}`}
                              className="record-action edit-action"
                              title="Edit service"
                            >

                              <Pencil
                                size={14}
                              />

                              <span>
                                Edit
                              </span>

                            </Link>


                            <button
                              onClick={() =>
                                handleDelete(
                                  service._id
                                )
                              }
                              className="record-action delete-action"
                              title="Delete service"
                            >

                              <Trash2
                                size={14}
                              />

                              <span>
                                Delete
                              </span>

                            </button>

                          </div>

                        </div>


                        {/* DETAILS */}

                        <div className="record-details">


                          {/* SERVICE CENTER */}

                          <div className="detail-item">

                            <div className="detail-icon">

                              <MapPin
                                size={14}
                              />

                            </div>

                            <div>

                              <span>
                                SERVICE CENTER
                              </span>

                              <strong>
                                {
                                  service.serviceCenter
                                }
                              </strong>

                            </div>

                          </div>


                          {/* DATE */}

                          <div className="detail-item">

                            <div className="detail-icon">

                              <CalendarDays
                                size={14}
                              />

                            </div>

                            <div>

                              <span>
                                SERVICE DATE
                              </span>

                              <strong>

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

                              </strong>

                            </div>

                          </div>


                          {/* ODOMETER */}

                          <div className="detail-item">

                            <div className="detail-icon">

                              <Gauge
                                size={14}
                              />

                            </div>

                            <div>

                              <span>
                                ODOMETER
                              </span>

                              <strong>
                                {Number(
                                  service.odometer
                                ).toLocaleString(
                                  "en-IN"
                                )}{" "}
                                km
                              </strong>

                            </div>

                          </div>


                          {/* COST */}

                          <div className="detail-item cost-item">

                            <div className="detail-icon">

                              <IndianRupee
                                size={14}
                              />

                            </div>

                            <div>

                              <span>
                                SERVICE COST
                              </span>

                              <strong>
                                ₹
                                {Number(
                                  service.cost
                                ).toLocaleString(
                                  "en-IN"
                                )}
                              </strong>

                            </div>

                          </div>

                        </div>


                        {/* DESCRIPTION */}

                        {service.description && (

                          <div className="record-description">

                            <div className="description-icon">

                              <FileText
                                size={14}
                              />

                            </div>

                            <div>

                              <span>
                                NOTES
                              </span>

                              <p>
                                {
                                  service.description
                                }
                              </p>

                            </div>

                          </div>

                        )}

                      </div>

                    </article>

                  )
                )}

              </div>

            </section>

          )}

        </div>

      </main>


      {/* ==================================================
          STYLES
      ================================================== */}

      <style>{`

        /* ==================================================
           PAGE
        ================================================== */

        .service-history-page {
          min-height: 100vh;

          background: #0b0d0e;

          color: #f3f3f3;

          position: relative;

          overflow: hidden;
        }

        .service-history-page::before {
          content: "";

          position: fixed;

          width: 550px;

          height: 550px;

          left: -300px;

          bottom: -250px;

          background:
            radial-gradient(
              circle,
              rgba(
                232,
                117,
                42,
                0.055
              ),
              transparent 70%
            );

          pointer-events: none;
        }


        /* ==================================================
           CONTAINER
        ================================================== */

        .service-history-container {
          max-width: 1180px;

          margin: 0 auto;

          padding:
            35px 30px
            70px;

          position: relative;

          z-index: 2;
        }


        /* ==================================================
           BACK
        ================================================== */

        .history-back-button {
          display: inline-flex;

          align-items: center;

          gap: 8px;

          padding: 0;

          margin-bottom: 35px;

          background: transparent;

          border: none;

          color: #555b5f;

          font-size: 11px;

          cursor: pointer;

          transition:
            color 0.2s ease;
        }

        .history-back-button:hover {
          color: #e8752a;
        }


        /* ==================================================
           HEADER
        ================================================== */

        .history-header {
          display: flex;

          align-items: flex-end;

          justify-content: space-between;

          gap: 30px;

          margin-bottom: 32px;
        }

        .history-kicker {
          display: flex;

          align-items: center;

          gap: 9px;

          color: #62686c;

          font-size: 8px;

          font-weight: 700;

          letter-spacing: 0.2em;

          margin-bottom: 13px;
        }

        .history-kicker span {
          width: 23px;

          height: 1px;

          background: #e8752a;
        }

        .history-header h1 {
          margin: 0;

          color: #f1f1f1;

          font-size:
            clamp(
              2.2rem,
              4vw,
              3.3rem
            );

          line-height: 1;

          letter-spacing: -0.055em;

          font-weight: 650;
        }

        .history-header p {
          max-width: 540px;

          margin: 13px 0 0;

          color: #5f666a;

          font-size: 12px;

          line-height: 1.7;
        }


        /* ==================================================
           ADD BUTTON
        ================================================== */

        .add-service-button {
          display: inline-flex;

          align-items: center;

          gap: 8px;

          flex-shrink: 0;

          padding: 12px 16px;

          border-radius: 9px;

          background: #e8752a;

          color: #0b0d0e;

          text-decoration: none;

          font-size: 10px;

          font-weight: 700;

          transition:
            background 0.2s ease,
            transform 0.2s ease;
        }

        .add-service-button:hover {
          background: #f08a45;

          transform:
            translateY(-1px);
        }


        /* ==================================================
           SUMMARY
        ================================================== */

        .history-summary {
          display: grid;

          grid-template-columns:
            1fr auto 1fr auto 1fr;

          align-items: center;

          background: #131617;

          border: 1px solid #292e31;

          border-radius: 12px;

          padding: 18px 22px;

          margin-bottom: 25px;
        }

        .summary-item {
          display: flex;

          align-items: center;

          gap: 11px;

          min-width: 0;
        }

        .summary-icon {
          width: 36px;

          height: 36px;

          flex-shrink: 0;

          display: flex;

          align-items: center;

          justify-content: center;

          border-radius: 8px;

          background:
            rgba(
              232,
              117,
              42,
              0.07
            );

          border: 1px solid
            rgba(
              232,
              117,
              42,
              0.13
            );

          color: #e8752a;
        }

        .summary-item span {
          display: block;

          color: #4e5458;

          font-size: 7px;

          font-weight: 700;

          letter-spacing: 0.16em;
        }

        .summary-item strong {
          display: block;

          margin-top: 4px;

          color: #b8bdc0;

          font-size: 13px;

          font-weight: 600;
        }

        .summary-divider {
          width: 1px;

          height: 35px;

          background: #292e31;

          margin: 0 25px;
        }


        /* ==================================================
           LIST SECTION
        ================================================== */

        .service-list-section {
          background: #131617;

          border: 1px solid #292e31;

          border-radius: 13px;

          overflow: hidden;
        }

        .list-header {
          display: flex;

          align-items: center;

          justify-content: space-between;

          gap: 20px;

          padding: 21px 24px;

          border-bottom: 1px solid #292e31;
        }

        .list-title {
          display: flex;

          align-items: center;

          gap: 9px;
        }

        .list-title svg {
          color: #e8752a;
        }

        .list-title h2 {
          margin: 0;

          color: #d5d8d9;

          font-size: 13px;

          font-weight: 600;
        }

        .list-header p {
          margin: 5px 0 0;

          color: #4f5559;

          font-size: 9px;
        }

        .record-count {
          padding: 6px 9px;

          border: 1px solid #2d3235;

          border-radius: 6px;

          color: #666d71;

          font-size: 8px;

          text-transform: uppercase;

          letter-spacing: 0.1em;
        }


        /* ==================================================
           SERVICE LIST
        ================================================== */

        .service-list {
          padding: 5px 0;
        }


        /* ==================================================
           RECORD
        ================================================== */

        .service-record {
          display: grid;

          grid-template-columns: 75px 1fr;

          min-height: 220px;

          border-bottom: 1px solid #25292b;

          transition:
            background 0.2s ease;
        }

        .service-record:last-child {
          border-bottom: none;
        }

        .service-record:hover {
          background:
            rgba(
              255,
              255,
              255,
              0.012
            );
        }


        /* ==================================================
           TIMELINE
        ================================================== */

        .record-timeline {
          position: relative;

          display: flex;

          justify-content: center;

          padding-top: 28px;
        }

        .timeline-number {
          width: 31px;

          height: 31px;

          display: flex;

          align-items: center;

          justify-content: center;

          border-radius: 8px;

          background: #101213;

          border: 1px solid #303438;

          color: #62686c;

          font-size: 8px;

          font-family: monospace;

          position: relative;

          z-index: 2;
        }

        .service-record:first-child
          .timeline-number {
          border-color:
            rgba(
              232,
              117,
              42,
              0.4
            );

          color: #e8752a;

          background:
            rgba(
              232,
              117,
              42,
              0.06
            );
        }

        .timeline-line {
          position: absolute;

          width: 1px;

          top: 58px;

          bottom: 0;

          background: #292e31;
        }


        /* ==================================================
           RECORD CONTENT
        ================================================== */

        .record-content {
          padding:
            27px 25px
            27px 5px;
        }

        .record-top {
          display: flex;

          align-items: flex-start;

          justify-content: space-between;

          gap: 20px;
        }

        .record-type {
          display: flex;

          align-items: center;

          gap: 6px;

          color: #555b5f;

          font-size: 7px;

          font-weight: 700;

          letter-spacing: 0.17em;

          margin-bottom: 7px;
        }

        .record-status-dot {
          width: 5px;

          height: 5px;

          border-radius: 50%;

          background: #e8752a;

          box-shadow:
            0 0 7px
            rgba(
              232,
              117,
              42,
              0.5
            );
        }

        .record-content h3 {
          margin: 0;

          color: #e0e2e3;

          font-size: 18px;

          font-weight: 600;

          letter-spacing: -0.025em;
        }


        /* ==================================================
           ACTIONS
        ================================================== */

        .record-actions {
          display: flex;

          gap: 6px;
        }

        .record-action {
          display: inline-flex;

          align-items: center;

          gap: 6px;

          padding: 7px 9px;

          border-radius: 7px;

          font-size: 9px;

          font-weight: 600;

          cursor: pointer;

          text-decoration: none;

          transition: all 0.2s ease;
        }

        .edit-action {
          color: #777e82;

          border: 1px solid #303538;

          background: #101213;
        }

        .edit-action:hover {
          color: #e8752a;

          border-color:
            rgba(
              232,
              117,
              42,
              0.3
            );
        }

        .delete-action {
          color: #6d5959;

          border: 1px solid
            rgba(
              180,
              70,
              70,
              0.15
            );

          background:
            rgba(
              180,
              70,
              70,
              0.025
            );
        }

        .delete-action:hover {
          color: #e77777;

          border-color:
            rgba(
              220,
              80,
              80,
              0.3
            );
        }


        /* ==================================================
           DETAILS
        ================================================== */

        .record-details {
          display: grid;

          grid-template-columns:
            repeat(
              4,
              minmax(0, 1fr)
            );

          gap: 15px;

          margin-top: 25px;

          padding:
            17px 0;

          border-top: 1px solid #25292b;

          border-bottom: 1px solid #25292b;
        }

        .detail-item {
          display: flex;

          align-items: center;

          gap: 9px;

          min-width: 0;
        }

        .detail-icon {
          width: 30px;

          height: 30px;

          flex-shrink: 0;

          display: flex;

          align-items: center;

          justify-content: center;

          border-radius: 7px;

          background: #101213;

          border: 1px solid #292e31;

          color: #62686c;
        }

        .detail-item > div:last-child {
          min-width: 0;
        }

        .detail-item span {
          display: block;

          color: #4c5256;

          font-size: 6px;

          font-weight: 700;

          letter-spacing: 0.13em;
        }

        .detail-item strong {
          display: block;

          margin-top: 4px;

          color: #a9aeb0;

          font-size: 10px;

          font-weight: 500;

          white-space: nowrap;

          overflow: hidden;

          text-overflow: ellipsis;
        }

        .cost-item strong {
          color: #e8752a;
        }


        /* ==================================================
           DESCRIPTION
        ================================================== */

        .record-description {
          display: flex;

          align-items: flex-start;

          gap: 10px;

          margin-top: 17px;
        }

        .description-icon {
          width: 29px;

          height: 29px;

          flex-shrink: 0;

          display: flex;

          align-items: center;

          justify-content: center;

          border-radius: 7px;

          background: #101213;

          border: 1px solid #292e31;

          color: #555b5f;
        }

        .record-description span {
          display: block;

          color: #4c5256;

          font-size: 6px;

          font-weight: 700;

          letter-spacing: 0.13em;
        }

        .record-description p {
          margin: 4px 0 0;

          color: #666d71;

          font-size: 10px;

          line-height: 1.6;
        }


        /* ==================================================
           EMPTY STATE
        ================================================== */

        .empty-service-state {
          display: flex;

          align-items: center;

          gap: 25px;

          padding: 55px;

          background: #131617;

          border: 1px solid #292e31;

          border-radius: 13px;
        }

        .empty-icon {
          width: 62px;

          height: 62px;

          flex-shrink: 0;

          display: flex;

          align-items: center;

          justify-content: center;

          border-radius: 13px;

          background:
            rgba(
              232,
              117,
              42,
              0.06
            );

          border: 1px solid
            rgba(
              232,
              117,
              42,
              0.14
            );

          color: #e8752a;
        }

        .empty-kicker {
          color: #555b5f;

          font-size: 7px;

          font-weight: 700;

          letter-spacing: 0.17em;
        }

        .empty-content h2 {
          margin: 7px 0 0;

          color: #d5d8d9;

          font-size: 20px;

          font-weight: 600;
        }

        .empty-content p {
          max-width: 480px;

          margin: 7px 0 17px;

          color: #5c6367;

          font-size: 11px;

          line-height: 1.7;
        }

        .empty-add-button {
          display: inline-flex;

          align-items: center;

          gap: 7px;

          padding: 9px 13px;

          border-radius: 7px;

          background: #e8752a;

          color: #0b0d0e;

          text-decoration: none;

          font-size: 9px;

          font-weight: 700;
        }


        /* ==================================================
           SKELETON
        ================================================== */

        .history-skeleton-small {
          width: 100px;

          height: 10px;

          border-radius: 5px;

          background: #191c1e;

          margin-bottom: 25px;

          animation:
            history-pulse 1.4s infinite;
        }

        .history-skeleton-title {
          width: 300px;

          height: 42px;

          border-radius: 7px;

          background: #191c1e;

          animation:
            history-pulse 1.4s infinite;
        }

        .history-skeleton-subtitle {
          width: 470px;

          max-width: 90%;

          height: 12px;

          border-radius: 5px;

          background: #191c1e;

          margin-top: 13px;

          margin-bottom: 35px;

          animation:
            history-pulse 1.4s infinite;
        }

        .history-skeleton-card {
          height: 230px;

          border-radius: 13px;

          background: #131617;

          border: 1px solid #202426;

          margin-bottom: 15px;

          animation:
            history-pulse 1.4s infinite;
        }

        @keyframes history-pulse {

          0%,
          100% {
            opacity: 0.55;
          }

          50% {
            opacity: 1;
          }

        }


        /* ==================================================
           TABLET
        ================================================== */

        @media (max-width: 900px) {

          .history-summary {
            grid-template-columns:
              repeat(
                3,
                1fr
              );
          }

          .summary-divider {
            display: none;
          }

          .record-details {
            grid-template-columns:
              repeat(
                2,
                minmax(0, 1fr)
              );
          }

        }


        /* ==================================================
           MOBILE
        ================================================== */

        @media (max-width: 650px) {

          .service-history-container {
            padding:
              25px 16px
              50px;
          }

          .history-header {
            flex-direction: column;

            align-items: flex-start;

            gap: 20px;
          }

          .add-service-button {
            width: 100%;

            justify-content: center;
          }

          .history-summary {
            grid-template-columns: 1fr;

            gap: 17px;

            padding: 17px;
          }

          .summary-divider {
            display: block;

            width: 100%;

            height: 1px;

            margin: 0;
          }

          .service-record {
            grid-template-columns: 45px 1fr;
          }

          .record-content {
            padding:
              25px 15px
              25px 0;
          }

          .record-top {
            flex-direction: column;

            gap: 15px;
          }

          .record-actions {
            width: 100%;
          }

          .record-action {
            flex: 1;

            justify-content: center;
          }

          .record-details {
            grid-template-columns: 1fr;

            gap: 13px;
          }

          .empty-service-state {
            flex-direction: column;

            align-items: flex-start;

            padding: 35px 25px;
          }

          .empty-icon {
            width: 50px;

            height: 50px;
          }

        }

      `}</style>
    </>
  );
}

export default ServiceHistory;