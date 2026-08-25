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
  Fuel,
  Wrench,
  CircleDot,
  Zap,
  Droplets,
  CarFront,
  Crosshair,
  ExternalLink,
  Phone,
  Clock3,
  MapPinned,
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
// Custom Map Marker
// ======================================================

const createMarkerIcon = (
  icon,
  active = false
) => {
  return L.divIcon({
    className: "autocare-map-marker",

    html: `
      <div class="map-marker ${
        active
          ? "map-marker-active"
          : ""
      }">
        <div class="map-marker-inner">
          ${icon}
        </div>
      </div>
    `,

    iconSize: [42, 48],
    iconAnchor: [21, 48],
    popupAnchor: [0, -45],
  });
};


// ======================================================
// Marker Icons
// ======================================================

const markerIcons = {
  fuel: createMarkerIcon(
    `<span>⛽</span>`
  ),

  service: createMarkerIcon(
    `<span>+</span>`
  ),

  tyres: createMarkerIcon(
    `<span>◉</span>`
  ),

  ev: createMarkerIcon(
    `<span>⚡</span>`
  ),

  wash: createMarkerIcon(
    `<span>≋</span>`
  ),

  car: createMarkerIcon(
    `<span>◆</span>`
  ),

  default: createMarkerIcon(
    `<span>•</span>`
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
  // Category Configuration
  // ====================================================

  const categories = [
    {
      key: "All",
      label: "All services",
      icon: <Search size={15} />,
    },
    {
      key: "fuel",
      label: "Fuel",
      icon: <Fuel size={15} />,
    },
    {
      key: "service",
      label: "Service",
      icon: <Wrench size={15} />,
    },
    {
      key: "tyres",
      label: "Tyres",
      icon: <CircleDot size={15} />,
    },
    {
      key: "ev",
      label: "EV charging",
      icon: <Zap size={15} />,
    },
    {
      key: "wash",
      label: "Car wash",
      icon: <Droplets size={15} />,
    },
    {
      key: "car",
      label: "Car shops",
      icon: <CarFront size={15} />,
    },
  ];


  // ====================================================
  // Get Place Information
  // ====================================================

  const getPlaceInfo = (place) => {
    const tags = place.tags || {};

    if (tags.amenity === "fuel") {
      return {
        name:
          tags.name ||
          "Fuel Station",

        category: "Fuel Station",

        type: "fuel",

        icon: <Fuel size={18} />,
      };
    }

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

        icon: <Wrench size={18} />,
      };
    }

    if (
      tags.shop === "tyres"
    ) {
      return {
        name:
          tags.name ||
          "Tyre Shop",

        category: "Tyre Shop",

        type: "tyres",

        icon: <CircleDot size={18} />,
      };
    }

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

        icon: <Zap size={18} />,
      };
    }

    if (
      tags.amenity === "car_wash"
    ) {
      return {
        name:
          tags.name ||
          "Car Wash",

        category: "Car Wash",

        type: "wash",

        icon: <Droplets size={18} />,
      };
    }

    if (
      tags.shop === "car"
    ) {
      return {
        name:
          tags.name ||
          "Car Shop",

        category: "Car Shop",

        type: "car",

        icon: <CarFront size={18} />,
      };
    }

    return {
      name:
        tags.name ||
        "Vehicle Service",

      category:
        "Vehicle Service",

      type: "default",

      icon: <MapPin size={18} />,
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
    if (!location) return "#";

    return `https://www.openstreetmap.org/directions?from=${location.latitude},${location.longitude}&to=${place.latitude},${place.longitude}`;
  };


  // ====================================================
  // Loading Screen
  // ====================================================

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="min-h-screen bg-[#0d0f10] text-white">

          <div className="max-w-7xl mx-auto px-5 lg:px-8 py-12">

            <div className="w-24 h-3 bg-[#1b1e20] rounded animate-pulse mb-6" />

            <div className="w-80 max-w-full h-10 bg-[#1b1e20] rounded animate-pulse mb-3" />

            <div className="w-[500px] max-w-full h-4 bg-[#1b1e20] rounded animate-pulse mb-10" />

            <div className="h-[520px] bg-[#151718] border border-[#292c2f] rounded-2xl animate-pulse" />

          </div>

        </main>
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

        <main className="min-h-screen bg-[#0d0f10] text-white">

          <div className="max-w-7xl mx-auto px-5 lg:px-8 py-10">

            <button
              onClick={() =>
                navigate(
                  "/dashboard"
                )
              }
              className="group flex items-center gap-2 text-sm text-gray-500 hover:text-orange-500 transition mb-8"
            >
              <ArrowLeft
                size={17}
                className="group-hover:-translate-x-1 transition"
              />

              Back to dashboard
            </button>

            <div className="max-w-xl mx-auto mt-20 text-center">

              <div className="w-16 h-16 mx-auto rounded-2xl bg-red-500/[0.06] border border-red-500/15 flex items-center justify-center">

                <MapPin
                  size={28}
                  className="text-red-400"
                />

              </div>

              <h2 className="text-2xl font-semibold mt-6">
                Location access required
              </h2>

              <p className="text-gray-600 mt-2 leading-7">
                {error}
              </p>

            </div>

          </div>

        </main>
      </>
    );
  }


  // ====================================================
  // MAIN UI
  // ====================================================

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#0d0f10] text-white">

        <div className="max-w-7xl mx-auto px-5 lg:px-8 py-10">


          {/* ==================================================
              BACK
          ================================================== */}

          <button
            onClick={() =>
              navigate(
                "/dashboard"
              )
            }
            className="group flex items-center gap-2 text-sm text-gray-500 hover:text-orange-500 transition mb-8"
          >

            <ArrowLeft
              size={17}
              className="group-hover:-translate-x-1 transition"
            />

            Back to dashboard

          </button>


          {/* ==================================================
              HEADER
          ================================================== */}

          <section className="mb-8">

            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">

              <div>

                <div className="flex items-center gap-3 mb-3">

                  <span className="text-[10px] tracking-[0.25em] uppercase text-orange-500 font-semibold">
                    Service Network
                  </span>

                  <span className="h-px w-8 bg-orange-500/50" />

                  <span className="text-[10px] tracking-wider text-gray-600">
                    NEARBY
                  </span>

                </div>

                <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
                  Find automotive services
                </h1>

                <p className="text-gray-500 mt-2 max-w-xl">
                  Discover fuel stations, workshops, tyre shops,
                  charging points and other vehicle services around you.
                </p>

              </div>


              {/* LOCATION STATUS */}

              {location && (

                <div className="flex items-center gap-3 bg-[#151718] border border-[#292c2f] rounded-xl px-4 py-3">

                  <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/15 flex items-center justify-center">

                    <LocateFixed
                      size={16}
                      className="text-orange-500"
                    />

                  </div>

                  <div>

                    <span className="block text-[9px] uppercase tracking-wider text-gray-700">
                      Current location
                    </span>

                    <span className="block text-xs text-gray-400 mt-1">
                      GPS location detected
                    </span>

                  </div>

                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500 ml-2" />

                </div>

              )}

            </div>

          </section>


          {/* ==================================================
              LOCATION PANEL
          ================================================== */}

          <section className="bg-[#151718] border border-[#292c2f] rounded-2xl p-5 mb-6">

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

              <div className="flex items-center gap-4">

                <div className="w-11 h-11 rounded-xl bg-[#101213] border border-[#292c2f] flex items-center justify-center">

                  <MapPinned
                    size={20}
                    className="text-orange-500"
                  />

                </div>

                <div>

                  <p className="text-[10px] uppercase tracking-[0.18em] text-gray-700">
                    Your position
                  </p>

                  <p className="text-sm text-gray-300 mt-1 font-mono">

                    {location.latitude.toFixed(
                      6
                    )}

                    <span className="text-gray-700 mx-2">
                      /
                    </span>

                    {location.longitude.toFixed(
                      6
                    )}

                  </p>

                </div>

              </div>


              <div className="text-left md:text-right">

                <p className="text-[10px] uppercase tracking-wider text-gray-700">
                  Search radius
                </p>

                <p className="text-sm text-gray-400 mt-1">
                  5 km
                </p>

              </div>

            </div>

          </section>


          {/* ==================================================
              FILTERS
          ================================================== */}

          <section className="bg-[#151718] border border-[#292c2f] rounded-2xl p-5 mb-6">

            <div className="flex items-center gap-3 mb-5">

              <div className="w-9 h-9 rounded-lg bg-orange-500/10 border border-orange-500/15 flex items-center justify-center">

                <Search
                  size={16}
                  className="text-orange-500"
                />

              </div>

              <div>

                <h2 className="font-semibold">
                  Service categories
                </h2>

                <p className="text-xs text-gray-700 mt-1">
                  Filter the map and results list.
                </p>

              </div>

            </div>


            <div className="flex flex-wrap gap-2">

              {categories.map(
                (category) => (

                  <button
                    key={
                      category.key
                    }
                    onClick={() =>
                      setSelectedCategory(
                        category.key
                      )
                    }
                    className={`category-button ${
                      selectedCategory ===
                      category.key
                        ? "category-active"
                        : ""
                    }`}
                  >

                    {category.icon}

                    {category.label}

                  </button>

                )
              )}

            </div>

          </section>


          {/* ==================================================
              NEAREST SERVICE
          ================================================== */}

          {nearestPlace && (

            <section className="bg-[#151718] border border-orange-500/25 rounded-2xl overflow-hidden mb-6">

              <div className="p-6">

                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

                  <div className="flex items-start gap-4">

                    <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500">

                      {nearestPlace.info.icon}

                    </div>

                    <div>

                      <div className="flex items-center gap-2 mb-1">

                        <span className="text-[9px] uppercase tracking-[0.18em] text-orange-500 font-semibold">
                          Nearest service
                        </span>

                        <span className="w-1 h-1 rounded-full bg-orange-500" />

                        <span className="text-[9px] text-gray-700">
                          {nearestPlace.info.category}
                        </span>

                      </div>

                      <h2 className="text-xl font-semibold">
                        {nearestPlace.info.name}
                      </h2>

                      <p className="text-sm text-gray-600 mt-2 flex items-center gap-2">

                        <Navigation
                          size={14}
                          className="text-orange-500"
                        />

                        {nearestPlace.distance.toFixed(
                          2
                        )}{" "}
                        km from your location

                      </p>

                    </div>

                  </div>


                  <a
                    href={getDirectionsUrl(
                      nearestPlace
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-orange-500 hover:bg-orange-400 text-black font-semibold text-sm transition"
                  >

                    <Navigation
                      size={16}
                    />

                    Get directions

                    <ExternalLink
                      size={14}
                    />

                  </a>

                </div>

              </div>

              <div className="px-6 py-3 bg-orange-500/[0.025] border-t border-[#292c2f]">

                <span className="text-[10px] uppercase tracking-wider text-gray-700">
                  Closest result in selected category
                </span>

              </div>

            </section>

          )}


          {/* ==================================================
              MAP
          ================================================== */}

          <section className="bg-[#151718] border border-[#292c2f] rounded-2xl overflow-hidden mb-8">

            <div className="px-6 py-5 border-b border-[#292c2f] flex items-center justify-between">

              <div className="flex items-center gap-3">

                <div className="w-9 h-9 rounded-lg bg-[#101213] border border-[#292c2f] flex items-center justify-center">

                  <MapPin
                    size={17}
                    className="text-orange-500"
                  />

                </div>

                <div>

                  <h2 className="font-semibold">
                    Service map
                  </h2>

                  <p className="text-xs text-gray-700 mt-1">
                    Nearby automotive locations
                  </p>

                </div>

              </div>


              <span className="text-[10px] uppercase tracking-wider text-gray-700">
                OpenStreetMap
              </span>

            </div>


            <div className="map-wrapper">

              <MapContainer
                center={[
                  location.latitude,
                  location.longitude,
                ]}
                zoom={14}
                scrollWheelZoom={true}
                style={{
                  height: "540px",
                  width: "100%",
                }}
              >

                <TileLayer
                  attribution='&copy; OpenStreetMap contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />


                {/* USER LOCATION */}

                <Marker
                  position={[
                    location.latitude,
                    location.longitude,
                  ]}
                >

                  <Popup>

                    <div className="map-popup">

                      <strong>
                        Your location
                      </strong>

                      <span>
                        AutoCare AI
                      </span>

                    </div>

                  </Popup>

                </Marker>


                {/* SERVICES */}

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

                          <div className="map-popup">

                            <strong>
                              {
                                place.info
                                  .name
                              }
                            </strong>

                            <span>
                              {
                                place.info
                                  .category
                              }
                            </span>

                            <small>
                              {place.distance.toFixed(
                                2
                              )}{" "}
                              km away
                            </small>

                            <a
                              href={getDirectionsUrl(
                                place
                              )}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Get directions
                            </a>

                          </div>

                        </Popup>

                      </Marker>
                    );
                  }
                )}

              </MapContainer>

            </div>

          </section>


          {/* ==================================================
              RESULTS
          ================================================== */}

          <section className="bg-[#151718] border border-[#292c2f] rounded-2xl overflow-hidden">

            <div className="px-6 py-5 border-b border-[#292c2f] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

              <div>

                <div className="flex items-center gap-2">

                  <Navigation
                    size={17}
                    className="text-orange-500"
                  />

                  <h2 className="font-semibold">
                    Nearby results
                  </h2>

                </div>

                <p className="text-xs text-gray-700 mt-1">
                  Sorted by distance from your current position.
                </p>

              </div>


              <div className="result-count">

                {filteredPlaces.length}

                <span>
                  results
                </span>

              </div>

            </div>


            {/* API LOADING */}

            {placesLoading && (

              <div className="py-16 text-center">

                <div className="w-10 h-10 mx-auto border-2 border-[#292c2f] border-t-orange-500 rounded-full animate-spin" />

                <p className="text-sm text-gray-600 mt-4">
                  Finding nearby services...
                </p>

              </div>

            )}


            {/* API ERROR */}

            {placesError && (

              <div className="m-6 p-4 rounded-xl bg-red-500/[0.05] border border-red-500/15 text-red-400 text-sm">
                {placesError}
              </div>

            )}


            {/* NO RESULTS */}

            {!placesLoading &&
              !placesError &&
              filteredPlaces.length ===
                0 && (

                <div className="py-16 text-center px-5">

                  <div className="w-14 h-14 mx-auto rounded-2xl bg-[#101213] border border-[#292c2f] flex items-center justify-center">

                    <MapPin
                      size={23}
                      className="text-gray-700"
                    />

                  </div>

                  <h3 className="text-lg font-semibold text-gray-300 mt-5">
                    No services found
                  </h3>

                  <p className="text-sm text-gray-600 mt-2 max-w-md mx-auto">
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
                      className="mt-5 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-black text-sm font-semibold transition"
                    >
                      Show all services
                    </button>

                  )}

                </div>

              )}


            {/* SERVICE CARDS */}

            {!placesLoading &&
              filteredPlaces.length >
                0 && (

                <div className="grid md:grid-cols-2 lg:grid-cols-3">

                  {filteredPlaces.map(
                    (
                      place,
                      index
                    ) => {

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
                          className={`service-card ${
                            index === 0
                              ? "nearest-card"
                              : ""
                          }`}
                        >

                          {index === 0 && (

                            <div className="nearest-label">

                              <span />

                              Nearest

                            </div>

                          )}


                          <div className="service-card-top">

                            <div className="service-icon">

                              {info.icon}

                            </div>

                            <div className="flex-1 min-w-0">

                              <h3>
                                {info.name}
                              </h3>

                              <p>
                                {info.category}
                              </p>

                            </div>

                          </div>


                          <div className="service-distance">

                            <Navigation
                              size={14}
                            />

                            {place.distance.toFixed(
                              2
                            )}{" "}
                            km away

                          </div>


                          <div className="service-details">

                            {address && (

                              <div>

                                <MapPin
                                  size={13}
                                />

                                <span>
                                  {address}
                                </span>

                              </div>

                            )}


                            {place.tags
                              ?.phone && (

                              <div>

                                <Phone
                                  size={13}
                                />

                                <span>
                                  {
                                    place
                                      .tags
                                      .phone
                                  }
                                </span>

                              </div>

                            )}


                            {place.tags
                              ?.opening_hours && (

                              <div>

                                <Clock3
                                  size={13}
                                />

                                <span>
                                  {
                                    place
                                      .tags
                                      .opening_hours
                                  }
                                </span>

                              </div>

                            )}

                          </div>


                          <a
                            href={getDirectionsUrl(
                              place
                            )}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="service-direction"
                          >

                            <Navigation
                              size={15}
                            />

                            Directions

                            <ExternalLink
                              size={13}
                            />

                          </a>

                        </div>

                      );
                    }
                  )}

                </div>

              )}

          </section>

        </div>

      </main>


      {/* ==================================================
          CUSTOM STYLES
      ================================================== */}

      <style>{`

        /* ==================================================
           CATEGORY BUTTONS
        ================================================== */

        .category-button {
          display: inline-flex;
          align-items: center;
          gap: 8px;

          padding: 10px 14px;

          border-radius: 9px;

          border: 1px solid #2b3033;

          background: #101213;

          color: #777d81;

          font-size: 11px;

          font-weight: 600;

          transition: all 0.2s ease;

          cursor: pointer;
        }

        .category-button:hover {
          color: #d4d7d9;

          border-color: #444a4e;

          background: #171a1b;
        }

        .category-button svg {
          color: #62686c;
        }

        .category-active {
          background: rgba(
            232,
            117,
            42,
            0.09
          );

          border-color: rgba(
            232,
            117,
            42,
            0.35
          );

          color: #e8752a;
        }

        .category-active svg {
          color: #e8752a;
        }


        /* ==================================================
           RESULT COUNT
        ================================================== */

        .result-count {
          display: flex;
          align-items: baseline;
          gap: 5px;

          color: #e8752a;

          font-size: 17px;

          font-weight: 600;
        }

        .result-count span {
          color: #555b5f;

          font-size: 9px;

          text-transform: uppercase;

          letter-spacing: 0.12em;

          font-weight: 500;
        }


        /* ==================================================
           SERVICE CARD
        ================================================== */

        .service-card {
          position: relative;

          padding: 25px;

          border-right: 1px solid #24282a;

          border-bottom: 1px solid #24282a;

          background: #151718;

          transition:
            background 0.2s ease,
            border-color 0.2s ease;
        }

        .service-card:hover {
          background: #191b1d;
        }

        .nearest-card {
          background: rgba(
            232,
            117,
            42,
            0.025
          );
        }


        /* ==================================================
           NEAREST LABEL
        ================================================== */

        .nearest-label {
          display: inline-flex;

          align-items: center;

          gap: 6px;

          margin-bottom: 15px;

          color: #e8752a;

          font-size: 8px;

          text-transform: uppercase;

          letter-spacing: 0.16em;

          font-weight: 700;
        }

        .nearest-label span {
          width: 5px;

          height: 5px;

          border-radius: 50%;

          background: #e8752a;
        }


        /* ==================================================
           CARD TOP
        ================================================== */

        .service-card-top {
          display: flex;

          align-items: flex-start;

          gap: 13px;
        }

        .service-icon {
          width: 40px;

          height: 40px;

          flex-shrink: 0;

          display: flex;

          align-items: center;

          justify-content: center;

          border-radius: 10px;

          background: rgba(
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
              0.14
            );

          color: #e8752a;
        }

        .service-card h3 {
          margin: 1px 0 4px;

          color: #d7d9da;

          font-size: 14px;

          font-weight: 600;

          line-height: 1.4;
        }

        .service-card-top p {
          margin: 0;

          color: #555b5f;

          font-size: 10px;
        }


        /* ==================================================
           DISTANCE
        ================================================== */

        .service-distance {
          display: flex;

          align-items: center;

          gap: 6px;

          margin-top: 18px;

          color: #e8752a;

          font-size: 11px;

          font-weight: 600;
        }


        /* ==================================================
           DETAILS
        ================================================== */

        .service-details {
          margin-top: 14px;

          min-height: 50px;
        }

        .service-details div {
          display: flex;

          align-items: flex-start;

          gap: 7px;

          margin-top: 7px;

          color: #555b5f;

          font-size: 10px;

          line-height: 1.5;
        }

        .service-details svg {
          flex-shrink: 0;

          margin-top: 1px;

          color: #4f5559;
        }


        /* ==================================================
           DIRECTIONS
        ================================================== */

        .service-direction {
          display: flex;

          align-items: center;

          justify-content: center;

          gap: 7px;

          width: 100%;

          margin-top: 20px;

          padding: 10px;

          border-radius: 8px;

          border: 1px solid #303438;

          background: #101213;

          color: #8c9295;

          text-decoration: none;

          font-size: 10px;

          font-weight: 600;

          transition: all 0.2s ease;
        }

        .service-direction:hover {
          background: rgba(
            232,
            117,
            42,
            0.07
          );

          border-color: rgba(
            232,
            117,
            42,
            0.3
          );

          color: #e8752a;
        }


        /* ==================================================
           MAP
        ================================================== */

        .map-wrapper {
          position: relative;
        }

        .map-wrapper .leaflet-container {
          background: #111415;
          font-family: inherit;
        }

        .map-wrapper .leaflet-control-zoom {
          border: 1px solid #34393c !important;
          box-shadow: none !important;
        }

        .map-wrapper .leaflet-control-zoom a {
          background: #151718 !important;
          color: #aaa !important;
          border-color: #34393c !important;
        }

        .map-wrapper
          .leaflet-control-zoom
          a:hover {
          background: #202426 !important;
          color: #e8752a !important;
        }

        .map-wrapper .leaflet-control-attribution {
          background: rgba(
            13,
            15,
            16,
            0.85
          ) !important;

          color: #555 !important;
        }

        .map-wrapper
          .leaflet-control-attribution
          a {
          color: #777 !important;
        }


        /* ==================================================
           CUSTOM MARKERS
        ================================================== */

        .autocare-map-marker {
          background: transparent !important;

          border: none !important;
        }

        .map-marker {
          width: 42px;

          height: 48px;

          display: flex;

          align-items: flex-start;

          justify-content: center;

          position: relative;

          filter:
            drop-shadow(
              0 5px 8px
              rgba(
                0,
                0,
                0,
                0.35
              )
            );
        }

        .map-marker::after {
          content: "";

          position: absolute;

          bottom: 0;

          left: 50%;

          width: 0;

          height: 0;

          transform:
            translateX(-50%);

          border-left:
            7px solid transparent;

          border-right:
            7px solid transparent;

          border-top:
            10px solid #e8752a;
        }

        .map-marker-inner {
          width: 34px;

          height: 34px;

          border-radius: 50%;

          display: flex;

          align-items: center;

          justify-content: center;

          background: #e8752a;

          border: 2px solid #f4f4f4;

          color: #101213;

          font-size: 14px;

          font-weight: 700;

          position: relative;

          z-index: 2;
        }

        .map-marker-active
          .map-marker-inner {
          box-shadow:
            0 0 0 5px
              rgba(
                232,
                117,
                42,
                0.16
              );
        }


        /* ==================================================
           POPUP
        ================================================== */

        .map-wrapper
          .leaflet-popup-content-wrapper {
          background: #151718;

          color: #ddd;

          border: 1px solid #303438;

          border-radius: 10px;

          box-shadow:
            0 15px 35px
            rgba(
              0,
              0,
              0,
              0.4
            );
        }

        .map-wrapper
          .leaflet-popup-tip {
          background: #151718;
        }

        .map-wrapper
          .leaflet-popup-content {
          margin: 13px;
        }

        .map-popup {
          min-width: 170px;

          display: flex;

          flex-direction: column;

          gap: 5px;
        }

        .map-popup strong {
          color: #e5e5e5;

          font-size: 13px;

          font-weight: 600;
        }

        .map-popup span {
          color: #666d71;

          font-size: 10px;
        }

        .map-popup small {
          color: #e8752a;

          font-size: 10px;

          margin-top: 3px;
        }

        .map-popup a {
          display: inline-flex;

          justify-content: center;

          margin-top: 7px;

          padding: 7px 9px;

          border-radius: 6px;

          background: #e8752a;

          color: #0d0f10;

          font-size: 10px;

          font-weight: 700;

          text-decoration: none;
        }


        /* ==================================================
           LEAFLET CLOSE BUTTON
        ================================================== */

        .map-wrapper
          .leaflet-popup-close-button {
          color: #666 !important;
        }

        .map-wrapper
          .leaflet-popup-close-button:hover {
          color: #e8752a !important;
        }


        /* ==================================================
           MOBILE
        ================================================== */

        @media (max-width: 768px) {

          .service-card {
            border-right: none;
          }

          .map-wrapper
            .leaflet-container {
            height: 430px !important;
          }

        }

      `}</style>

    </>
  );
}

export default NearbyServices;