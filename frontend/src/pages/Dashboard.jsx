import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import SummaryCards from "../components/SummaryCards";
import RecentServices from "../components/RecentServices";
import ExpenseChart from "../components/ExpenseChart";
import HealthAlerts from "../components/HealthAlerts";

import { getDashboard } from "../services/dashboardService";


function Dashboard() {

  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);


  /* =====================================================
     FETCH DASHBOARD
  ====================================================== */

  const fetchDashboard = async () => {

    try {

      const res = await getDashboard();

      setDashboard(res.data);

    } catch (err) {

      console.error(err);

      alert("Failed to load dashboard");

    } finally {

      setLoading(false);

    }

  };


  useEffect(() => {

    fetchDashboard();

  }, []);


  /* =====================================================
     LOADING
  ====================================================== */

  if (loading) {

    return (

      <div className="dashboard-page">

        {/* Animated Background */}

        <div className="dashboard-background">

          <div className="dashboard-grid"></div>

          <div className="dashboard-glow dashboard-glow-one"></div>

          <div className="dashboard-glow dashboard-glow-two"></div>

          <div className="dashboard-particle dashboard-particle-one"></div>

          <div className="dashboard-particle dashboard-particle-two"></div>

          <div className="dashboard-particle dashboard-particle-three"></div>

          <div className="dashboard-particle dashboard-particle-four"></div>

        </div>


        <div className="dashboard-content">

          <Navbar />

          <div className="flex items-center justify-center min-h-[60vh]">

            <div className="text-center">

              <div className="dashboard-loader"></div>

              <p className="text-orange-400 text-lg font-semibold mt-5">
                Loading Dashboard...
              </p>

            </div>

          </div>

        </div>

      </div>

    );

  }


  /* =====================================================
     DASHBOARD
  ====================================================== */

  return (

    <div className="dashboard-page">


      {/* =====================================================
          ANIMATED BACKGROUND
      ====================================================== */}

      <div className="dashboard-background">

        {/* Moving Grid */}

        <div className="dashboard-grid"></div>


        {/* Orange Glows */}

        <div className="dashboard-glow dashboard-glow-one"></div>

        <div className="dashboard-glow dashboard-glow-two"></div>


        {/* Floating Particles */}

        <div className="dashboard-particle dashboard-particle-one"></div>

        <div className="dashboard-particle dashboard-particle-two"></div>

        <div className="dashboard-particle dashboard-particle-three"></div>

        <div className="dashboard-particle dashboard-particle-four"></div>

      </div>



      {/* =====================================================
          DASHBOARD CONTENT
      ====================================================== */}

      <div className="dashboard-content">


        {/* =====================================================
            NAVBAR
        ====================================================== */}

        <Navbar />


        {/* =====================================================
            MAIN CONTAINER
        ====================================================== */}

        <div className="max-w-7xl mx-auto p-6">


          {/* =====================================================
              DASHBOARD HEADER
          ====================================================== */}

          <div className="flex items-center justify-between mb-8">

            <div>

              <p className="text-orange-500 font-semibold text-sm uppercase tracking-widest mb-2">
                Vehicle Management
              </p>

              <h1 className="text-4xl font-bold text-white">
                Dashboard
              </h1>

              <p className="text-zinc-500 mt-2">
                Monitor your vehicles, maintenance and expenses.
              </p>

            </div>


            <button
              onClick={() => navigate("/chatbot")}
              className="flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white px-5 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg shadow-orange-950/30"
            >

              🤖 Ask AutoCare AI

            </button>

          </div>



          {/* =====================================================
              SUMMARY CARDS
          ====================================================== */}

          <SummaryCards
            totalVehicles={dashboard.totalVehicles}
            totalServices={dashboard.totalServices}
            maintenanceCost={dashboard.maintenanceCost}
            fuelExpense={dashboard.fuelExpense}
          />



          {/* =====================================================
              EXPENSE CHART
          ====================================================== */}

          <div className="my-8">

            <ExpenseChart />

          </div>



          {/* =====================================================
              HEALTH ALERTS
          ====================================================== */}

          <HealthAlerts />



          {/* =====================================================
              EXPENSE REPORT
          ====================================================== */}

          <div className="bg-zinc-950/90 backdrop-blur-xl border border-zinc-800 rounded-2xl shadow-2xl shadow-black/30 p-6 mb-8">

            <div className="flex flex-col md:flex-row items-center justify-between gap-5">


              {/* Left */}

              <div className="flex items-center gap-4">

                <div className="bg-orange-500/10 border border-orange-500/20 p-4 rounded-full text-3xl">
                  📄
                </div>


                <div>

                  <h2 className="text-2xl font-bold text-white">
                    Vehicle Expense Report
                  </h2>

                  <p className="text-zinc-500 mt-1">
                    View maintenance and fuel expenses
                    date-wise and download a detailed PDF report.
                  </p>

                </div>

              </div>


              {/* Button */}

              <button
                onClick={() =>
                  navigate("/expense-report")
                }
                className="flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg shadow-orange-950/30 whitespace-nowrap"
              >

                📄 View Expense Report

              </button>

            </div>

          </div>



          {/* =====================================================
              NEARBY SERVICES
          ====================================================== */}

          <div className="bg-zinc-950/90 backdrop-blur-xl border border-zinc-800 rounded-2xl shadow-2xl shadow-black/30 p-6 mb-8">

            <div className="flex flex-col md:flex-row items-center justify-between gap-5">


              {/* Left */}

              <div className="flex items-center gap-4">

                <div className="bg-orange-500/10 border border-orange-500/20 p-4 rounded-full text-3xl">
                  📍
                </div>


                <div>

                  <h2 className="text-2xl font-bold text-white">
                    Nearby Vehicle Services
                  </h2>

                  <p className="text-zinc-500 mt-1">
                    Find nearby fuel stations, service centers,
                    tyre shops, EV charging stations and more.
                  </p>

                </div>

              </div>


              {/* Button */}

              <button
                onClick={() =>
                  navigate("/nearby-services")
                }
                className="flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg shadow-orange-950/30 whitespace-nowrap"
              >

                📍 Find Nearby Services

              </button>

            </div>

          </div>



          {/* =====================================================
              MY VEHICLES
          ====================================================== */}

          <div className="mb-10">


            {/* Section Header */}

            <div className="flex items-center justify-between mb-5">

              <div>

                <p className="text-orange-500 text-xs font-semibold uppercase tracking-widest mb-1">
                  Your Garage
                </p>

                <h2 className="text-2xl font-bold text-white">
                  🚗 My Vehicles
                </h2>

              </div>


              <button
                onClick={() =>
                  navigate("/add-vehicle")
                }
                className="flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white px-5 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg shadow-orange-950/30"
              >

                <span className="text-xl">
                  +
                </span>

                Add New Vehicle

              </button>

            </div>



            {/* =================================================
                NO VEHICLES
            ================================================== */}

            {dashboard.vehicles.length === 0 ? (

              <div className="bg-zinc-950/90 backdrop-blur-xl border border-zinc-800 rounded-2xl shadow-xl p-8 text-center">


                <div className="text-5xl mb-4">
                  🚗
                </div>


                <h3 className="text-xl font-semibold text-white mb-2">
                  No Vehicles Added
                </h3>


                <p className="text-zinc-500 mb-5">
                  Add your first vehicle to start
                  tracking its health and maintenance.
                </p>


                <button
                  onClick={() =>
                    navigate("/add-vehicle")
                  }
                  className="bg-orange-500 hover:bg-orange-400 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg shadow-orange-950/30"
                >

                  + Add Your First Vehicle

                </button>

              </div>

            ) : (


              /* =================================================
                 VEHICLES
              ================================================== */

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">


                {dashboard.vehicles.map(
                  (vehicle) => (

                    <div
                      key={vehicle._id}
                      className="bg-zinc-950/90 backdrop-blur-xl border border-zinc-800 shadow-xl rounded-2xl p-6 hover:border-orange-500/30 hover:-translate-y-1 transition-all duration-300"
                    >


                      {/* Vehicle Header */}

                      <div className="flex items-center gap-4 mb-5">

                        <div className="bg-orange-500/10 border border-orange-500/20 p-4 rounded-full text-2xl">
                          🚗
                        </div>


                        <div>

                          <h3 className="text-xl font-bold text-white">
                            {vehicle.brand}
                          </h3>

                          <p className="text-zinc-500">
                            {vehicle.model}
                          </p>

                        </div>

                      </div>



                      {/* Vehicle Details */}

                      <div className="space-y-2 text-zinc-400">


                        <p>

                          <span className="font-semibold text-zinc-200">
                            Registration:
                          </span>{" "}

                          {vehicle.registrationNumber?.toUpperCase()}

                        </p>


                        <p>

                          <span className="font-semibold text-zinc-200">
                            Year:
                          </span>{" "}

                          {vehicle.year}

                        </p>


                        <p>

                          <span className="font-semibold text-zinc-200">
                            Fuel:
                          </span>{" "}

                          {vehicle.fuelType}

                        </p>


                        <p>

                          <span className="font-semibold text-zinc-200">
                            Odometer:
                          </span>{" "}

                          {vehicle.odometer} km

                        </p>

                      </div>



                      {/* Buttons */}

                      <div className="flex gap-3 mt-6">


                        <button
                          onClick={() =>
                            navigate(
                              `/vehicles/${vehicle._id}`
                            )
                          }
                          className="flex-1 bg-orange-500 hover:bg-orange-400 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300"
                        >

                          View Details

                        </button>


                        <button
                          onClick={() =>
                            navigate(
                              `/edit-vehicle/${vehicle._id}`
                            )
                          }
                          className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-4 py-2 rounded-xl font-medium transition-all duration-300"
                        >

                          Edit

                        </button>

                      </div>

                    </div>

                  )
                )}

              </div>

            )}

          </div>



          {/* =====================================================
              RECENT SERVICES
          ====================================================== */}

          <RecentServices
            services={
              dashboard.recentServices
            }
          />

        </div>

      </div>

    </div>
  );
}

export default Dashboard;