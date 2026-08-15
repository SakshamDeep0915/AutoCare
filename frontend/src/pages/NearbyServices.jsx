import { useEffect, useMemo, useState } from "react";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

import Navbar from "../components/Navbar";

import {
  ArrowLeft,
  MapPin,
  Navigation,
  LocateFixed,
  Search,
} from "lucide-react";

import { useNavigate } from "react-router-dom";


// ======================================================
// Leaflet Default Marker Fix
// ======================================================

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",

  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",

  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});


// ======================================================
// Calculate Distance
// ======================================================

const calculateDistance = (
  lat1,
  lon1,
  lat2,
  lon2
) => {
  const R = 6371;

  const dLat =
    ((lat2 - lat1) * Math.PI) / 180;

  const dLon =
    ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) *
      Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c =
    2 *
    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    );

  return R * c;
};


// ======================================================
// Create Custom Marker
// ======================================================

const createMarkerIcon = (
  emoji,
  background
) => {
  return L.divIcon({
    className: "custom-marker",

    html: `
      <div
        style="
          width: 40px;
          height: 40px;
          background: ${background};
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 21px;
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.35);
        "
      >
        ${emoji}
      </div>
    `,

    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20],
  });
};


// ======================================================
// Marker Icons
// ======================================================

const markerIcons = {
  fuel: createMarkerIcon(
    "⛽",
    "#fee2e2"
  ),

  service: createMarkerIcon(
    "🔧",
    "#dbeafe"
  ),

  tyres: createMarkerIcon(
    "🛞",
    "#e5e7eb"
  ),

  ev: createMarkerIcon(
    "⚡",
    "#dcfce7"
  ),

  wash: createMarkerIcon(
    "🚿",
    "#dbeafe"
  ),

  car: createMarkerIcon(
    "🚗",
    "#fef3c7"
  ),

  default: createMarkerIcon(
    "📍",
    "#e0e7ff"
  ),
};


// ======================================================
// Component
// ======================================================

function NearbyServices() {
  const navigate = useNavigate();


  // ====================================================
  // States
  // ====================================================

  const [location, setLocation] =
    useState(null);

  const [places, setPlaces] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [placesLoading, setPlacesLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [placesError, setPlacesError] =
    useState("");

  const [selectedCategory, setSelectedCategory] =
    useState("All");


  // ====================================================
  // Get Place Information
  // ====================================================

  const getPlaceInfo = (place) => {
    const tags = place.tags || {};


    // Fuel
    if (tags.amenity === "fuel") {
      return {
        name:
          tags.name || "Fuel Station",

        category: "Fuel Station",

        type: "fuel",

        icon: "⛽",
      };
    }


    // Car Repair
    if (
      tags.shop === "car_repair" ||
      tags.amenity === "car_repair"
    ) {
      return {
        name:
          tags.name ||
          "Car Service Center",

        category: "Car Repair / Service",

        type: "service",

        icon: "🔧",
      };
    }


    // Tyres
    if (
      tags.shop === "tyres"
    ) {
      return {
        name:
          tags.name ||
          "Tyre Shop",

        category: "Tyre Shop",

        type: "tyres",

        icon: "🛞",
      };
    }


    // EV Charging
    if (
      tags.amenity ===
      "charging_station"
    ) {
      return {
        name:
          tags.name ||
          "EV Charging Station",

        category: "EV Charging",

        type: "ev",

        icon: "⚡",
      };
    }


    // Car Wash
    if (
      tags.amenity === "car_wash"
    ) {
      return {
        name:
          tags.name ||
          "Car Wash",

        category: "Car Wash",

        type: "wash",

        icon: "🚿",
      };
    }


    // Car Shop
    if (
      tags.shop === "car"
    ) {
      return {
        name:
          tags.name ||
          "Car Shop",

        category: "Car Shop",

        type: "car",

        icon: "🚗",
      };
    }


    return {
      name:
        tags.name ||
        "Vehicle Service",

      category:
        "Vehicle Service",

      type: "default",

      icon: "📍",
    };
  };


  // ====================================================
  // Fetch Nearby Services
  // ====================================================

  const fetchNearbyServices = async (
    latitude,
    longitude
  ) => {
    try {
      setPlacesLoading(true);

      setPlacesError("");


      const radius = 5000;


      const query = `
        [out:json][timeout:30];

        (
          nwr["amenity"="fuel"]
            (around:${radius},${latitude},${longitude});

          nwr["shop"="car_repair"]
            (around:${radius},${latitude},${longitude});

          nwr["amenity"="car_repair"]
            (around:${radius},${latitude},${longitude});

          nwr["shop"="tyres"]
            (around:${radius},${latitude},${longitude});

          nwr["amenity"="charging_station"]
            (around:${radius},${latitude},${longitude});

          nwr["amenity"="car_wash"]
            (around:${radius},${latitude},${longitude});

          nwr["shop"="car"]
            (around:${radius},${latitude},${longitude});
        );

        out center;
      `;


      const response = await fetch(
        "https://overpass-api.de/api/interpreter",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "text/plain",
          },

          body: query,
        }
      );


      if (!response.ok) {
        throw new Error(
          "Failed to fetch nearby services"
        );
      }


      const data =
        await response.json();


      console.log(
        "OpenStreetMap Data:",
        data.elements
      );


      const formattedPlaces =
        data.elements
          .map((place) => {

            const lat =
              place.lat ??
              place.center?.lat;

            const lon =
              place.lon ??
              place.center?.lon;


            if (
              lat === undefined ||
              lon === undefined
            ) {
              return null;
            }


            const distance =
              calculateDistance(
                latitude,
                longitude,
                lat,
                lon
              );


            return {
              ...place,

              latitude: lat,

              longitude: lon,

              distance,

              info:
                getPlaceInfo(place),
            };
          })

          .filter(Boolean)

          .sort(
            (a, b) =>
              a.distance -
              b.distance
          );


      setPlaces(
        formattedPlaces
      );

    } catch (err) {

      console.error(
        "Nearby Services Error:",
        err
      );

      setPlacesError(
        "Unable to load nearby services. Please try again."
      );

    } finally {

      setPlacesLoading(false);
    }
  };


  // ====================================================
  // Get User Location
  // ====================================================

  useEffect(() => {

    const getLocation = () => {

      if (
        typeof navigator ===
          "undefined" ||
        !navigator.geolocation
      ) {

        setError(
          "Geolocation is not available in this browser."
        );

        setLoading(false);

        return;
      }


      navigator.geolocation.getCurrentPosition(

        (position) => {

          const latitude =
            position.coords.latitude;

          const longitude =
            position.coords.longitude;


          console.log(
            "Latitude:",
            latitude
          );

          console.log(
            "Longitude:",
            longitude
          );


          setLocation({
            latitude,
            longitude,
          });


          setLoading(false);


          fetchNearbyServices(
            latitude,
            longitude
          );
        },


        (gpsError) => {

          console.error(
            "GPS Error:",
            gpsError
          );


          let message =
            "Unable to get your location.";


          if (
            gpsError.code === 1
          ) {

            message =
              "Location permission denied. Please allow location access.";
          }


          if (
            gpsError.code === 2
          ) {

            message =
              "Location information is unavailable.";
          }


          if (
            gpsError.code === 3
          ) {

            message =
              "Location request timed out. Please try again.";
          }


          setError(message);

          setLoading(false);
        },


        {
          enableHighAccuracy: true,

          timeout: 15000,

          maximumAge: 0,
        }
      );
    };


    getLocation();

  }, []);


  // ====================================================
  // Filter Places
  // ====================================================

  const filteredPlaces = useMemo(() => {

    if (
      selectedCategory ===
      "All"
    ) {
      return places;
    }


    return places.filter(
      (place) =>
        place.info.type ===
        selectedCategory
    );

  }, [
    places,
    selectedCategory,
  ]);


  // ====================================================
  // Nearest Place
  // ====================================================

  const nearestPlace =
    filteredPlaces.length > 0
      ? filteredPlaces[0]
      : null;


  // ====================================================
  // Directions
  // ====================================================

  const getDirectionsUrl = (
    place
  ) => {

    return `https://www.openstreetmap.org/directions?from=${location.latitude},${location.longitude}&to=${place.latitude},${place.longitude}`;
  };


  // ====================================================
  // Loading Screen
  // ====================================================

  if (loading) {

    return (
      <>
        <Navbar />

        <div className="min-h-screen bg-gray-50 py-10 px-4">

          <div className="max-w-7xl mx-auto">

            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">

              <LocateFixed
                className="mx-auto text-blue-600 animate-pulse"
                size={50}
              />

              <h2 className="text-2xl font-bold mt-5">
                Getting Your Location
              </h2>

              <p className="text-gray-500 mt-2">
                Please wait while we find your location...
              </p>

            </div>

          </div>

        </div>
      </>
    );
  }


  // ====================================================
  // GPS Error
  // ====================================================

  if (error) {

    return (
      <>
        <Navbar />

        <div className="min-h-screen bg-gray-50 py-10 px-4">

          <div className="max-w-7xl mx-auto">

            <button
              onClick={() =>
                navigate(
                  "/dashboard"
                )
              }
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 hover:underline mb-6 font-medium"
            >
              <ArrowLeft size={20} />

              Back to Home
            </button>


            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">

              <MapPin
                className="mx-auto text-red-500"
                size={55}
              />

              <h2 className="text-2xl font-bold mt-5">
                Location Access Required
              </h2>

              <p className="text-gray-500 mt-2">
                {error}
              </p>

            </div>

          </div>

        </div>
      </>
    );
  }


  // ====================================================
  // Main UI
  // ====================================================

  return (
    <>
      <Navbar />


      <div className="min-h-screen bg-gray-50 py-8 px-4">

        <div className="max-w-7xl mx-auto">


          {/* ============================================
              Back Button
          ============================================ */}

          <button
            onClick={() =>
              navigate(
                "/dashboard"
              )
            }
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 hover:underline mb-6 font-medium"
          >
            <ArrowLeft size={20} />

            Back to Home
          </button>


          {/* ============================================
              Header
          ============================================ */}

          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">

            <div className="flex items-center gap-4">

              <div className="bg-blue-100 p-4 rounded-full">

                <MapPin
                  className="text-blue-600"
                  size={32}
                />

              </div>


              <div>

                <h1 className="text-3xl font-bold text-gray-800">
                  Nearby Services
                </h1>

                <p className="text-gray-500 mt-1">
                  Find vehicle-related services near your current location
                </p>

              </div>

            </div>

          </div>


          {/* ============================================
              Location Information
          ============================================ */}

          <div className="bg-white rounded-2xl shadow-lg p-5 mb-6">

            <div className="flex items-center gap-3">

              <Navigation
                className="text-blue-600"
                size={25}
              />


              <div>

                <h2 className="font-bold text-lg">
                  Your Current Location
                </h2>

                <p className="text-sm text-gray-500">

                  Latitude:{" "}

                  {location.latitude.toFixed(
                    6
                  )}

                  {" | "}

                  Longitude:{" "}

                  {location.longitude.toFixed(
                    6
                  )}

                </p>

              </div>

            </div>

          </div>


          {/* ============================================
              Category Filters
          ============================================ */}

          <div className="bg-white rounded-2xl shadow-lg p-5 mb-6">

            <div className="flex items-center gap-2 mb-4">

              <Search
                size={20}
                className="text-blue-600"
              />

              <h2 className="text-lg font-bold">
                Find Services
              </h2>

            </div>


            <div className="flex flex-wrap gap-3">


              {/* All */}

              <button
                onClick={() =>
                  setSelectedCategory(
                    "All"
                  )
                }
                className={`px-5 py-2.5 rounded-full font-semibold transition ${
                  selectedCategory ===
                  "All"
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                📍 All
              </button>


              {/* Fuel */}

              <button
                onClick={() =>
                  setSelectedCategory(
                    "fuel"
                  )
                }
                className={`px-5 py-2.5 rounded-full font-semibold transition ${
                  selectedCategory ===
                  "fuel"
                    ? "bg-red-500 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                ⛽ Fuel
              </button>


              {/* Service */}

              <button
                onClick={() =>
                  setSelectedCategory(
                    "service"
                  )
                }
                className={`px-5 py-2.5 rounded-full font-semibold transition ${
                  selectedCategory ===
                  "service"
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                🔧 Service
              </button>


              {/* Tyres */}

              <button
                onClick={() =>
                  setSelectedCategory(
                    "tyres"
                  )
                }
                className={`px-5 py-2.5 rounded-full font-semibold transition ${
                  selectedCategory ===
                  "tyres"
                    ? "bg-gray-700 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                🛞 Tyres
              </button>


              {/* EV */}

              <button
                onClick={() =>
                  setSelectedCategory(
                    "ev"
                  )
                }
                className={`px-5 py-2.5 rounded-full font-semibold transition ${
                  selectedCategory ===
                  "ev"
                    ? "bg-green-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                ⚡ EV Charging
              </button>


              {/* Car Wash */}

              <button
                onClick={() =>
                  setSelectedCategory(
                    "wash"
                  )
                }
                className={`px-5 py-2.5 rounded-full font-semibold transition ${
                  selectedCategory ===
                  "wash"
                    ? "bg-cyan-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                🚿 Car Wash
              </button>


              {/* Car Shop */}

              <button
                onClick={() =>
                  setSelectedCategory(
                    "car"
                  )
                }
                className={`px-5 py-2.5 rounded-full font-semibold transition ${
                  selectedCategory ===
                  "car"
                    ? "bg-yellow-500 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                🚗 Car Shop
              </button>

            </div>

          </div>


          {/* ============================================
              Nearest Service Highlight
          ============================================ */}

          {nearestPlace && (

            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg p-6 mb-6 text-white">

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

                <div>

                  <div className="flex items-center gap-2 mb-2">

                    <span className="text-2xl">
                      🏆
                    </span>

                    <span className="font-semibold">
                      Nearest{" "}
                      {selectedCategory ===
                      "All"
                        ? "Service"
                        : "Service"}
                    </span>

                  </div>


                  <h2 className="text-2xl font-bold">

                    {nearestPlace.info.icon}{" "}

                    {nearestPlace.info.name}

                  </h2>


                  <p className="mt-1 opacity-90">

                    {nearestPlace.info.category}

                  </p>


                  <p className="mt-2 font-semibold">

                    📏{" "}
                    {nearestPlace.distance.toFixed(
                      2
                    )}{" "}
                    km away

                  </p>

                </div>


                <a
                  href={getDirectionsUrl(
                    nearestPlace
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition"
                >

                  <Navigation size={19} />

                  Get Directions

                </a>

              </div>

            </div>
          )}


          {/* ============================================
              Map
          ============================================ */}

          <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">

            <MapContainer
              center={[
                location.latitude,
                location.longitude,
              ]}
              zoom={14}
              scrollWheelZoom={true}
              style={{
                height: "550px",
                width: "100%",
              }}
            >

              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />


              {/* User Marker */}

              <Marker
                position={[
                  location.latitude,
                  location.longitude,
                ]}
              >

                <Popup>

                  <div className="text-center">

                    <strong>
                      📍 You are here
                    </strong>

                    <br />

                    AutoCare AI

                  </div>

                </Popup>

              </Marker>


              {/* Filtered Service Markers */}

              {filteredPlaces.map(
                (place) => {

                  return (
                    <Marker
                      key={`${place.type}-${place.id}`}
                      position={[
                        place.latitude,
                        place.longitude,
                      ]}
                      icon={
                        markerIcons[
                          place.info.type
                        ] ||
                        markerIcons.default
                      }
                    >

                      <Popup>

                        <div className="min-w-[200px]">

                          <h3 className="font-bold text-base">

                            {
                              place.info
                                .icon
                            }{" "}

                            {
                              place.info
                                .name
                            }

                          </h3>


                          <p className="text-gray-500 text-sm mt-1">

                            {
                              place.info
                                .category
                            }

                          </p>


                          <p className="text-blue-600 text-sm mt-2 font-semibold">

                            📏{" "}

                            {place.distance.toFixed(
                              2
                            )}{" "}
                            km away

                          </p>


                          <a
                            href={getDirectionsUrl(
                              place
                            )}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block mt-3 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-semibold"
                          >
                            🧭 Directions
                          </a>

                        </div>

                      </Popup>

                    </Marker>
                  );
                }
              )}

            </MapContainer>

          </div>


          {/* ============================================
              Service List
          ============================================ */}

          <div className="bg-white rounded-2xl shadow-lg p-6">

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">

              <div>

                <h2 className="text-2xl font-bold">
                  📍 Nearby Services
                </h2>

                <p className="text-gray-500 mt-1">

                  {selectedCategory ===
                  "All"
                    ? "All vehicle services"
                    : `Showing ${nearestPlace?.info.category || "services"}`}

                  {" "}within 5 km

                </p>

              </div>


              <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-semibold w-fit">

                {filteredPlaces.length}{" "}
                Found

              </span>

            </div>


            {/* API Loading */}

            {placesLoading && (

              <div className="text-center py-10">

                <Navigation
                  className="mx-auto text-blue-600 animate-pulse"
                  size={40}
                />

                <p className="text-gray-500 mt-3">
                  Finding nearby services...
                </p>

              </div>
            )}


            {/* API Error */}

            {placesError && (

              <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-4 mb-5">

                {placesError}

              </div>
            )}


            {/* No Results */}

            {!placesLoading &&
              !placesError &&
              filteredPlaces.length ===
                0 && (

                <div className="text-center py-12">

                  <MapPin
                    className="mx-auto text-gray-300"
                    size={55}
                  />

                  <h3 className="text-xl font-semibold mt-4">

                    No Services Found

                  </h3>

                  <p className="text-gray-500 mt-2">

                    No services from this category were found within 5 km.

                  </p>

                  {selectedCategory !==
                    "All" && (

                    <button
                      onClick={() =>
                        setSelectedCategory(
                          "All"
                        )
                      }
                      className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-semibold"
                    >
                      Show All Services
                    </button>
                  )}

                </div>
              )}


            {/* Service Cards */}

            {!placesLoading &&
              filteredPlaces.length >
                0 && (

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">

                  {filteredPlaces.map(
                    (place, index) => {

                      const info =
                        place.info;


                      const address =
                        [
                          place.tags?.[
                            "addr:housenumber"
                          ],

                          place.tags?.[
                            "addr:street"
                          ],

                          place.tags?.[
                            "addr:city"
                          ],
                        ]
                          .filter(Boolean)
                          .join(", ");


                      return (

                        <div
                          key={`${place.type}-${place.id}`}
                          className={`border rounded-xl p-5 transition bg-gray-50 ${
                            index === 0
                              ? "border-blue-500 shadow-md"
                              : "hover:shadow-lg"
                          }`}
                        >

                          {/* Nearest Badge */}

                          {index === 0 && (

                            <div className="mb-3">

                              <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">

                                🏆 Nearest

                              </span>

                            </div>
                          )}


                          {/* Icon + Name */}

                          <div className="flex items-start gap-4 mb-4">

                            <div className="bg-blue-100 p-3 rounded-full text-2xl">

                              {info.icon}

                            </div>


                            <div className="flex-1">

                              <h3 className="font-bold text-lg">

                                {info.name}

                              </h3>


                              <p className="text-sm text-gray-500">

                                {info.category}

                              </p>

                            </div>

                          </div>


                          {/* Distance */}

                          <div className="flex items-center gap-2 text-blue-600 font-semibold mb-3">

                            <Navigation
                              size={17}
                            />

                            {place.distance.toFixed(
                              2
                            )}{" "}
                            km away

                          </div>


                          {/* Address */}

                          {address && (

                            <p className="text-sm text-gray-500 mb-2">

                              📍{" "}
                              {address}

                            </p>
                          )}


                          {/* Phone */}

                          {place.tags?.phone && (

                            <p className="text-sm text-gray-500 mb-2">

                              📞{" "}
                              {
                                place
                                  .tags
                                  .phone
                              }

                            </p>
                          )}


                          {/* Opening Hours */}

                          {place.tags
                            ?.opening_hours && (

                            <p className="text-sm text-gray-500 mb-3">

                              🕐{" "}
                              {
                                place
                                  .tags
                                  .opening_hours
                              }

                            </p>
                          )}


                          {/* Directions */}

                          <a
                            href={getDirectionsUrl(
                              place
                            )}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-semibold transition"
                          >

                            <Navigation
                              size={18}
                            />

                            Get Directions

                          </a>

                        </div>

                      );
                    }
                  )}

                </div>
              )}

          </div>

        </div>

      </div>
    </>
  );
}


export default NearbyServices;