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

  const [services, setServices] = useState([]);

  const [loading, setLoading] = useState(true);


  // ==================================================
  // FETCH SERVICES
  // ==================================================

  const fetchServices = async () => {

    try {

      const res = await getServices(vehicleId);

      setServices(
        res.data.services || []
      );

    } catch (error) {

      console.error(error);

      alert("Failed to load service history");

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

      alert("Failed to delete service");

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
  // MAIN UI
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

            <ArrowLeft size={18} />

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

              <Plus size={19} />

              Add service

              <ArrowRight size={16} />

            </Link>

          </section>


          {/* ==================================================
              SUMMARY
          ================================================== */}

          {services.length > 0 && (

            <section className="history-summary">


              <div className="summary-item">

                <div className="summary-icon">

                  <Wrench size={20} />

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

                  <IndianRupee size={20} />

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

                  <Clock3 size={20} />

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

                <FileText size={30} />

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

                  <Plus size={18} />

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

                    <Wrench size={20} />

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
                          services.length - 1 && (

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
                              {service.serviceType}
                            </h3>

                          </div>


                          {/* ACTIONS */}

                          <div className="record-actions">

                            <Link
                              to={`/services/edit/${service._id}`}
                              className="record-action edit-action"
                              title="Edit service"
                            >

                              <Pencil size={16} />

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

                              <Trash2 size={16} />

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

                              <MapPin size={17} />

                            </div>

                            <div>

                              <span>
                                SERVICE CENTER
                              </span>

                              <strong>
                                {service.serviceCenter}
                              </strong>

                            </div>

                          </div>


                          {/* DATE */}

                          <div className="detail-item">

                            <div className="detail-icon">

                              <CalendarDays size={17} />

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

                              <Gauge size={17} />

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

                              <IndianRupee size={17} />

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


                        {/* NOTES */}

                        {service.description && (

                          <div className="record-description">

                            <div className="description-icon">

                              <FileText size={17} />

                            </div>

                            <div>

                              <span>
                                NOTES
                              </span>

                              <p>
                                {service.description}
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

          max-width: 1280px;

          margin: 0 auto;

          padding:
            40px 38px
            80px;

          position: relative;

          z-index: 2;

        }


        /* ==================================================
           BACK
        ================================================== */

        .history-back-button {

          display: inline-flex;

          align-items: center;

          gap: 10px;

          padding: 0;

          margin-bottom: 40px;

          background: transparent;

          border: none;

          color: #858d91;

          font-size: 15px;

          font-weight: 500;

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

          gap: 35px;

          margin-bottom: 40px;

        }


        .history-kicker {

          display: flex;

          align-items: center;

          gap: 11px;

          color: #858d91;

          font-size: 12px;

          font-weight: 700;

          letter-spacing: 0.18em;

          margin-bottom: 15px;

        }


        .history-kicker span {

          width: 28px;

          height: 2px;

          background: #e8752a;

        }


        .history-header h1 {

          margin: 0;

          color: #f5f5f5;

          font-size:
            clamp(
              3rem,
              4.8vw,
              4rem
            );

          line-height: 1;

          letter-spacing: -0.055em;

          font-weight: 700;

        }


        .history-header p {

          max-width: 650px;

          margin: 17px 0 0;

          color: #858d91;

          font-size: 16px;

          line-height: 1.7;

        }


        /* ==================================================
           ADD SERVICE
        ================================================== */

        .add-service-button {

          display: inline-flex;

          align-items: center;

          justify-content: center;

          gap: 10px;

          flex-shrink: 0;

          padding: 14px 20px;

          border-radius: 10px;

          background: #e8752a;

          color: #0b0d0e;

          text-decoration: none;

          font-size: 14px;

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

          border:
            1px solid #292e31;

          border-radius: 13px;

          padding:
            23px 27px;

          margin-bottom: 30px;

        }


        .summary-item {

          display: flex;

          align-items: center;

          gap: 14px;

          min-width: 0;

        }


        .summary-icon {

          width: 45px;

          height: 45px;

          flex-shrink: 0;

          display: flex;

          align-items: center;

          justify-content: center;

          border-radius: 10px;

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

          color: #e8752a;

        }


        .summary-item span {

          display: block;

          color: #727a7e;

          font-size: 11px;

          font-weight: 700;

          letter-spacing: 0.15em;

        }


        .summary-item strong {

          display: block;

          margin-top: 5px;

          color: #e0e3e4;

          font-size: 19px;

          font-weight: 600;

        }


        .summary-divider {

          width: 1px;

          height: 45px;

          background: #292e31;

          margin:
            0 30px;

        }


        /* ==================================================
           SERVICE LIST
        ================================================== */

        .service-list-section {

          background: #131617;

          border:
            1px solid #292e31;

          border-radius: 14px;

          overflow: hidden;

        }


        .list-header {

          display: flex;

          align-items: center;

          justify-content: space-between;

          gap: 20px;

          padding:
            27px 29px;

          border-bottom:
            1px solid #292e31;

        }


        .list-title {

          display: flex;

          align-items: center;

          gap: 12px;

        }


        .list-title svg {

          color: #e8752a;

        }


        .list-title h2 {

          margin: 0;

          color: #e5e7e8;

          font-size: 21px;

          font-weight: 650;

        }


        .list-header p {

          margin:
            7px 0 0;

          color: #727a7e;

          font-size: 14px;

        }


        .record-count {

          padding:
            8px 12px;

          border:
            1px solid #303538;

          border-radius: 8px;

          color: #858d91;

          font-size: 12px;

          font-weight: 600;

          text-transform: uppercase;

          letter-spacing: 0.09em;

        }


        /* ==================================================
           SERVICE RECORD
        ================================================== */

        .service-list {

          padding: 5px 0;

        }


        .service-record {

          display: grid;

          grid-template-columns:
            88px 1fr;

          min-height: 255px;

          border-bottom:
            1px solid #25292b;

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

          padding-top: 32px;

        }


        .timeline-number {

          width: 39px;

          height: 39px;

          display: flex;

          align-items: center;

          justify-content: center;

          border-radius: 9px;

          background: #101213;

          border:
            1px solid #303438;

          color: #858d91;

          font-size: 11px;

          font-family: monospace;

          font-weight: 600;

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

          top: 72px;

          bottom: 0;

          background: #292e31;

        }


        /* ==================================================
           RECORD CONTENT
        ================================================== */

        .record-content {

          padding:
            33px 31px
            33px 5px;

        }


        .record-top {

          display: flex;

          align-items: flex-start;

          justify-content: space-between;

          gap: 25px;

        }


        .record-type {

          display: flex;

          align-items: center;

          gap: 8px;

          color: #727a7e;

          font-size: 11px;

          font-weight: 700;

          letter-spacing: 0.16em;

          margin-bottom: 9px;

        }


        .record-status-dot {

          width: 7px;

          height: 7px;

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

          color: #f0f1f2;

          font-size: 27px;

          font-weight: 650;

          letter-spacing: -0.025em;

        }


        /* ==================================================
           ACTION BUTTONS
        ================================================== */

        .record-actions {

          display: flex;

          gap: 9px;

        }


        .record-action {

          display: inline-flex;

          align-items: center;

          gap: 8px;

          padding:
            10px 13px;

          border-radius: 8px;

          font-size: 13px;

          font-weight: 600;

          cursor: pointer;

          text-decoration: none;

          transition:
            all 0.2s ease;

        }


        .edit-action {

          color: #90989c;

          border:
            1px solid #303538;

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

          color: #936f6f;

          border:
            1px solid
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
           SERVICE DETAILS
        ================================================== */

        .record-details {

          display: grid;

          grid-template-columns:
            repeat(
              4,
              minmax(0, 1fr)
            );

          gap: 20px;

          margin-top: 30px;

          padding:
            21px 0;

          border-top:
            1px solid #25292b;

          border-bottom:
            1px solid #25292b;

        }


        .detail-item {

          display: flex;

          align-items: center;

          gap: 12px;

          min-width: 0;

        }


        .detail-icon {

          width: 38px;

          height: 38px;

          flex-shrink: 0;

          display: flex;

          align-items: center;

          justify-content: center;

          border-radius: 9px;

          background: #101213;

          border:
            1px solid #292e31;

          color: #7b8387;

        }


        .detail-item > div:last-child {

          min-width: 0;

        }


        .detail-item span {

          display: block;

          color: #687075;

          font-size: 10px;

          font-weight: 700;

          letter-spacing: 0.12em;

        }


        .detail-item strong {

          display: block;

          margin-top: 5px;

          color: #d0d4d5;

          font-size: 15px;

          font-weight: 500;

          white-space: nowrap;

          overflow: hidden;

          text-overflow: ellipsis;

        }


        .cost-item strong {

          color: #e8752a;

          font-size: 16px;

        }


        /* ==================================================
           NOTES
        ================================================== */

        .record-description {

          display: flex;

          align-items: flex-start;

          gap: 12px;

          margin-top: 20px;

        }


        .description-icon {

          width: 35px;

          height: 35px;

          flex-shrink: 0;

          display: flex;

          align-items: center;

          justify-content: center;

          border-radius: 8px;

          background: #101213;

          border:
            1px solid #292e31;

          color: #737b7f;

        }


        .record-description span {

          display: block;

          color: #687075;

          font-size: 10px;

          font-weight: 700;

          letter-spacing: 0.12em;

        }


        .record-description p {

          margin:
            6px 0 0;

          color: #90989c;

          font-size: 15px;

          line-height: 1.65;

        }


        /* ==================================================
           EMPTY STATE
        ================================================== */

        .empty-service-state {

          display: flex;

          align-items: center;

          gap: 30px;

          padding: 65px;

          background: #131617;

          border:
            1px solid #292e31;

          border-radius: 14px;

        }


        .empty-icon {

          width: 72px;

          height: 72px;

          flex-shrink: 0;

          display: flex;

          align-items: center;

          justify-content: center;

          border-radius: 14px;

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

          color: #e8752a;

        }


        .empty-kicker {

          color: #687075;

          font-size: 11px;

          font-weight: 700;

          letter-spacing: 0.16em;

        }


        .empty-content h2 {

          margin:
            9px 0 0;

          color: #e5e7e8;

          font-size: 25px;

          font-weight: 650;

        }


        .empty-content p {

          max-width: 540px;

          margin:
            9px 0 20px;

          color: #7d8589;

          font-size: 15px;

          line-height: 1.7;

        }


        .empty-add-button {

          display: inline-flex;

          align-items: center;

          gap: 8px;

          padding:
            12px 16px;

          border-radius: 8px;

          background: #e8752a;

          color: #0b0d0e;

          text-decoration: none;

          font-size: 13px;

          font-weight: 700;

        }


        /* ==================================================
           SKELETON
        ================================================== */

        .history-skeleton-small {

          width: 130px;

          height: 13px;

          border-radius: 5px;

          background: #191c1e;

          margin-bottom: 30px;

          animation:
            history-pulse 1.4s infinite;

        }


        .history-skeleton-title {

          width: 360px;

          height: 54px;

          border-radius: 7px;

          background: #191c1e;

          animation:
            history-pulse 1.4s infinite;

        }


        .history-skeleton-subtitle {

          width: 520px;

          max-width: 90%;

          height: 15px;

          border-radius: 5px;

          background: #191c1e;

          margin-top: 16px;

          margin-bottom: 42px;

          animation:
            history-pulse 1.4s infinite;

        }


        .history-skeleton-card {

          height: 270px;

          border-radius: 14px;

          background: #131617;

          border:
            1px solid #202426;

          margin-bottom: 17px;

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
              28px 16px
              55px;

          }


          .history-header {

            flex-direction: column;

            align-items: flex-start;

            gap: 23px;

          }


          .history-header h1 {

            font-size: 2.7rem;

          }


          .history-header p {

            font-size: 14px;

          }


          .add-service-button {

            width: 100%;

            justify-content: center;

          }


          .history-summary {

            grid-template-columns: 1fr;

            gap: 19px;

            padding: 20px;

          }


          .summary-divider {

            display: block;

            width: 100%;

            height: 1px;

            margin: 0;

          }


          .summary-item span {

            font-size: 10px;

          }


          .summary-item strong {

            font-size: 18px;

          }


          .service-record {

            grid-template-columns:
              50px 1fr;

          }


          .record-content {

            padding:
              28px 15px
              28px 0;

          }


          .record-top {

            flex-direction: column;

            gap: 18px;

          }


          .record-content h3 {

            font-size: 22px;

          }


          .record-actions {

            width: 100%;

          }


          .record-action {

            flex: 1;

            justify-content: center;

            font-size: 12px;

          }


          .record-details {

            grid-template-columns: 1fr;

            gap: 16px;

          }


          .detail-item span {

            font-size: 10px;

          }


          .detail-item strong {

            font-size: 15px;

          }


          .record-description p {

            font-size: 14px;

          }


          .empty-service-state {

            flex-direction: column;

            align-items: flex-start;

            padding:
              40px 25px;

          }

        }

      `}</style>

    </>

  );

}


export default ServiceHistory;