import {
  Calendar,
  Car,
  Fuel,
  Gauge,
  Trash2,
  Edit,
  User,
  Shield,
  Eye,
  Settings2,
  ArrowUpRight,
} from "lucide-react";

import { useNavigate } from "react-router-dom";


const VehicleCard = ({
  vehicle,
  onDelete,
}) => {

  const navigate =
    useNavigate();


  return (

    <article className="vehicle-card">


      {/* =================================================
          VEHICLE HEADER
      ================================================= */}

      <div className="vehicle-card-header">


        {/* Brand / Model */}

        <div className="vehicle-card-title">

          <div className="vehicle-status-dot"></div>

          <div>

            <div className="vehicle-card-label">
              VEHICLE PROFILE
            </div>

            <h2>
              {vehicle.brand}{" "}
              {vehicle.model}
            </h2>

            <p>
              {vehicle.registrationNumber?.toUpperCase()}
            </p>

          </div>

        </div>


        {/* Vehicle Icon */}

        <div className="vehicle-card-mark">

          <Car size={19} />

        </div>

      </div>


      {/* =================================================
          VEHICLE DATA
      ================================================= */}

      <div className="vehicle-card-body">


        <div className="vehicle-data-grid">


          {/* Fuel */}

          <VehicleData
            icon={
              <Fuel size={14} />
            }
            label="FUEL TYPE"
            value={
              vehicle.fuelType ||
              "—"
            }
          />


          {/* Odometer */}

          <VehicleData
            icon={
              <Gauge size={14} />
            }
            label="ODOMETER"
            value={
              vehicle.odometer !==
              undefined
                ? `${Number(
                    vehicle.odometer
                  ).toLocaleString(
                    "en-IN"
                  )} km`
                : "—"
            }
          />


          {/* Transmission */}

          <VehicleData
            icon={
              <Settings2
                size={14}
              />
            }
            label="TRANSMISSION"
            value={
              vehicle.transmission ||
              "—"
            }
          />


          {/* Owners */}

          <VehicleData
            icon={
              <User size={14} />
            }
            label="OWNERS"
            value={
              vehicle.owners ??
              "—"
            }
          />

        </div>


        {/* =================================================
            INSURANCE
        ================================================= */}

        <div className="vehicle-insurance">

          <div className="vehicle-insurance-icon">

            <Shield size={15} />

          </div>


          <div className="vehicle-insurance-info">

            <span>
              INSURANCE EXPIRY
            </span>

            <strong>

              <Calendar size={11} />

              {vehicle.insuranceExpiry
                ? new Date(
                    vehicle.insuranceExpiry
                  ).toLocaleDateString(
                    "en-IN",
                    {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    }
                  )
                : "Not Available"}

            </strong>

          </div>


          <div className="insurance-status">

            {vehicle.insuranceExpiry
              ? "ACTIVE"
              : "N/A"}

          </div>

        </div>


        {/* =================================================
            ACTIONS
        ================================================= */}

        <div className="vehicle-card-actions">


          {/* View Details */}

          <button
            onClick={() =>
              navigate(
                `/vehicles/${vehicle._id}`
              )
            }
            className="vehicle-view-button"
          >

            <Eye size={14} />

            View details

            <ArrowUpRight
              size={13}
            />

          </button>


          {/* Edit */}

          <button
            onClick={() =>
              navigate(
                `/edit-vehicle/${vehicle._id}`
              )
            }
            className="vehicle-edit-button"
          >

            <Edit size={14} />

            Edit

          </button>


          {/* Delete */}

          <button
            onClick={() =>
              onDelete(
                vehicle._id
              )
            }
            className="vehicle-delete-button"
          >

            <Trash2 size={14} />

          </button>

        </div>

      </div>


      {/* =================================================
          STYLES
      ================================================= */}

      <style>{`

        /* ==========================================
           CARD
        ========================================== */

        .vehicle-card {

          position: relative;

          width: 100%;

          overflow: hidden;

          background: #131617;

          border:
            1px solid #292e31;

          border-radius: 10px;

          transition:
            transform 0.2s ease,
            border-color 0.2s ease,
            background 0.2s ease;

        }


        .vehicle-card:hover {

          transform:
            translateY(-3px);

          background: #151819;

          border-color:
            rgba(
              232,
              117,
              42,
              0.25
            );

        }


        /* ==========================================
           ORANGE TOP LINE
        ========================================== */

        .vehicle-card::before {

          content: "";

          position: absolute;

          top: 0;

          left: 18px;

          width: 34px;

          height: 1px;

          background:
            #e8752a;

          opacity: 0.85;

        }


        /* ==========================================
           HEADER
        ========================================== */

        .vehicle-card-header {

          display: flex;

          align-items: center;

          justify-content: space-between;

          gap: 15px;

          padding:
            18px 18px 16px;

          border-bottom:
            1px solid #252a2c;

        }


        .vehicle-card-title {

          display: flex;

          align-items: flex-start;

          gap: 9px;

          min-width: 0;

        }


        .vehicle-status-dot {

          width: 5px;

          height: 5px;

          flex-shrink: 0;

          margin-top: 7px;

          border-radius: 50%;

          background:
            #e8752a;

          box-shadow:
            0 0 8px
            rgba(
              232,
              117,
              42,
              0.45
            );

        }


        .vehicle-card-label {

          color: #4d5458;

          font-size: 5px;

          font-weight: 700;

          letter-spacing:
            0.17em;

          margin-bottom: 5px;

        }


        .vehicle-card-title h2 {

          margin: 0;

          color: #d0d4d5;

          font-size: 14px;

          font-weight: 600;

          letter-spacing:
            -0.025em;

          white-space: nowrap;

          overflow: hidden;

          text-overflow: ellipsis;

        }


        .vehicle-card-title p {

          margin:
            5px 0 0;

          color: #565e62;

          font-family:
            monospace;

          font-size: 7px;

          letter-spacing:
            0.09em;

        }


        /* ==========================================
           VEHICLE MARK
        ========================================== */

        .vehicle-card-mark {

          width: 37px;

          height: 37px;

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
              0.14
            );

        }


        /* ==========================================
           BODY
        ========================================== */

        .vehicle-card-body {

          padding:
            15px 18px 17px;

        }


        /* ==========================================
           DATA GRID
        ========================================== */

        .vehicle-data-grid {

          display: grid;

          grid-template-columns:
            repeat(
              2,
              minmax(0, 1fr)
            );

          gap:
            7px;

        }


        .vehicle-data-item {

          display: flex;

          align-items: center;

          gap: 8px;

          min-width: 0;

          padding:
            10px;

          border:
            1px solid #252a2c;

          border-radius: 7px;

          background: #0f1112;

        }


        .vehicle-data-icon {

          width: 27px;

          height: 27px;

          flex-shrink: 0;

          display: flex;

          align-items: center;

          justify-content: center;

          border-radius: 6px;

          color: #6b7377;

          background: #171a1b;

          border:
            1px solid #292e31;

        }


        .vehicle-data-item:first-child
        .vehicle-data-icon {

          color: #e8752a;

          background:
            rgba(
              232,
              117,
              42,
              0.05
            );

          border-color:
            rgba(
              232,
              117,
              42,
              0.11
            );

        }


        .vehicle-data-copy {

          min-width: 0;

        }


        .vehicle-data-copy span {

          display: block;

          color: #444c50;

          font-size: 5px;

          font-weight: 700;

          letter-spacing:
            0.12em;

        }


        .vehicle-data-copy strong {

          display: block;

          margin-top: 4px;

          color: #858c90;

          font-size: 8px;

          font-weight: 500;

          white-space: nowrap;

          overflow: hidden;

          text-overflow: ellipsis;

        }


        /* ==========================================
           INSURANCE
        ========================================== */

        .vehicle-insurance {

          display: flex;

          align-items: center;

          gap: 8px;

          margin-top: 8px;

          padding:
            10px;

          border:
            1px solid #292e31;

          border-radius: 7px;

          background: #0f1112;

        }


        .vehicle-insurance-icon {

          width: 28px;

          height: 28px;

          flex-shrink: 0;

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
              0.055
            );

        }


        .vehicle-insurance-info {

          min-width: 0;

          flex: 1;

        }


        .vehicle-insurance-info span {

          display: block;

          color: #444c50;

          font-size: 5px;

          font-weight: 700;

          letter-spacing:
            0.13em;

        }


        .vehicle-insurance-info strong {

          display: flex;

          align-items: center;

          gap: 4px;

          margin-top: 4px;

          color: #858c90;

          font-size: 8px;

          font-weight: 500;

        }


        .vehicle-insurance-info strong svg {

          color: #555d61;

        }


        .insurance-status {

          padding:
            4px 6px;

          border:
            1px solid
            rgba(
              232,
              117,
              42,
              0.15
            );

          border-radius: 4px;

          color: #c66d35;

          background:
            rgba(
              232,
              117,
              42,
              0.04
            );

          font-size: 5px;

          font-weight: 700;

          letter-spacing:
            0.1em;

        }


        /* ==========================================
           ACTIONS
        ========================================== */

        .vehicle-card-actions {

          display: grid;

          grid-template-columns:
            1fr auto auto;

          gap: 6px;

          margin-top: 10px;

        }


        .vehicle-view-button,
        .vehicle-edit-button,
        .vehicle-delete-button {

          display: flex;

          align-items: center;

          justify-content: center;

          gap: 6px;

          height: 32px;

          border-radius: 6px;

          font-size: 7px;

          font-weight: 600;

          cursor: pointer;

          transition:
            all 0.2s ease;

        }


        /* ==========================================
           VIEW
        ========================================== */

        .vehicle-view-button {

          color: #d77539;

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
              0.2
            );

        }


        .vehicle-view-button:hover {

          background:
            rgba(
              232,
              117,
              42,
              0.12
            );

          border-color:
            rgba(
              232,
              117,
              42,
              0.35
            );

        }


        /* ==========================================
           EDIT
        ========================================== */

        .vehicle-edit-button {

          padding:
            0 11px;

          color: #777e82;

          background: #151819;

          border:
            1px solid #292e31;

        }


        .vehicle-edit-button:hover {

          color: #d77539;

          border-color:
            rgba(
              232,
              117,
              42,
              0.25
            );

          background:
            rgba(
              232,
              117,
              42,
              0.045
            );

        }


        /* ==========================================
           DELETE
        ========================================== */

        .vehicle-delete-button {

          width: 32px;

          color: #696f73;

          background: #151819;

          border:
            1px solid #292e31;

        }


        .vehicle-delete-button:hover {

          color: #bd6868;

          background:
            rgba(
              180,
              70,
              70,
              0.06
            );

          border-color:
            rgba(
              180,
              70,
              70,
              0.2
            );

        }


        /* ==========================================
           RESPONSIVE
        ========================================== */

        @media (max-width: 650px) {

          .vehicle-card-header {

            padding:
              15px;

          }


          .vehicle-card-body {

            padding:
              13px 15px 15px;

          }


          .vehicle-data-grid {

            grid-template-columns:
              1fr;

          }


          .vehicle-card-title h2 {

            font-size: 12px;

          }


          .vehicle-card-mark {

            width: 33px;

            height: 33px;

          }

        }

      `}</style>

    </article>

  );
};


// =====================================================
// VEHICLE DATA
// =====================================================

function VehicleData({
  icon,
  label,
  value,
}) {

  return (

    <div className="vehicle-data-item">

      <div className="vehicle-data-icon">

        {icon}

      </div>


      <div className="vehicle-data-copy">

        <span>
          {label}
        </span>

        <strong>
          {value}
        </strong>

      </div>

    </div>

  );
}


export default VehicleCard;