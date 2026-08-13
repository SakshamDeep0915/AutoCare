import { useEffect, useState } from "react";
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
  Fuel,
  Wrench,
  BatteryCharging,
  Car,
  Droplets,
  LocateFixed,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

// ==========================================
// Fix Leaflet Marker Icons
// ==========================================

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",

  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",

  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});


// ==========================================
// Helper: Calculate Distance
// ==========================================

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


// ==========================================
// Component
// ==========================================

function NearbyServices() {
  const navigate = useNavigate();

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


  // ==========================================
  // Get Nearby Services
  // ==========================================

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
        "Nearby OSM Data:",
        data.elements
      );

      // ==========================================
      // Add coordinates + distance
      // ==========================================

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
            };
          })
          .filter(Boolean)
          .sort(
            (a, b) =>
              a.distance - b.distance
          );

      setPlaces(formattedPlaces);

    } catch (error) {
      console.error(
        "Nearby Services Error:",
        error
      );

      setPlacesError(
        "Unable to load nearby services. Please try again."
      );

    } finally {
      setPlacesLoading(false);
    }
  };


  // ==========================================
  // Get User GPS Location
  // ==========================================

  useEffect(() => {
    const getLocation = () => {
      if (
        typeof navigator === "undefined" ||
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

          // Fetch nearby places
          fetchNearbyServices(
            latitude,
            longitude
          );
        },

        (error) => {
          console.error(
            "GPS Error:",
            error
          );

          let message =
            "Unable to get your location.";

          if (error.code === 1) {
            message =
              "Location permission denied. Please allow location access.";
          }

          if (error.code === 2) {
            message =
              "Location information is unavailable.";
          }

          if (error.code === 3) {
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


  // ==========================================
  // Get Place Category
  // ==========================================

  const getPlaceInfo = (place) => {
    const tags = place.tags || {};

    if (tags.amenity === "fuel") {
      return {
        name: tags.name || "Fuel Station",
        category: "Fuel Station",
        icon: "⛽",
      };
    }

    if (
      tags.shop === "car_repair"
    ) {
      return {
        name:
          tags.name || "Car Service Center",
        category: "Car Repair / Service",
        icon: "🔧",
      };
    }

    if (
      tags.shop === "tyres"
    ) {
      return {
        name:
          tags.name || "Tyre Shop",
        category: "Tyre Shop",
        icon: "🛞",
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
        icon: "⚡",
      };
    }

    if (
      tags.amenity === "car_wash"
    ) {
      return {
        name:
          tags.name || "Car Wash",
        category: "Car Wash",
        icon: "🚿",
      };
    }

    if (
      tags.shop === "car"
    ) {
      return {
        name:
          tags.name || "Car Shop",
        category: "Car Shop",
        icon: "🚗",
      };
    }

    return {
      name:
        tags.name || "Vehicle Service",
      category: "Vehicle Service",
      icon: "📍",
    };
  };


  // ==========================================
  // Loading
  // ==========================================

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


  // ==========================================
  // Error
  // ==========================================

  if (error) {
    return (
      <>
        <Navbar />

        <div className="min-h-screen bg-gray-50 py-10 px-4">

          <div className="max-w-7xl mx-auto">

            <button
              onClick={() =>
                navigate("/dashboard")
              }
              className="flex items-center gap-2 text-blue-600 hover:underline mb-6"
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


  // ==========================================
  // Main UI
  // ==========================================

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50 py-8 px-4">

        <div className="max-w-7xl mx-auto">

          {/* Back Button */}

          <button
            onClick={() =>
              navigate("/dashboard")
            }
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 hover:underline mb-6 font-medium"
          >
            <ArrowLeft size={20} />
            Back to Home
          </button>


          {/* Header */}

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


          {/* Location */}

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
                  {location.latitude.toFixed(6)}

                  {" | "}

                  Longitude:{" "}
                  {location.longitude.toFixed(6)}

                </p>

              </div>

            </div>

          </div>


          {/* Map */}

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


              {/* User Location */}

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


              {/* Nearby Places */}

              {places.map((place) => {

                const info =
                  getPlaceInfo(place);

                return (
                  <Marker
                    key={`${place.type}-${place.id}`}
                    position={[
                      place.latitude,
                      place.longitude,
                    ]}
                  >

                    <Popup>

                      <div className="min-w-[180px]">

                        <h3 className="font-bold text-base">
                          {info.icon}{" "}
                          {info.name}
                        </h3>

                        <p className="text-gray-500 text-sm mt-1">
                          {info.category}
                        </p>

                        <p className="text-blue-600 text-sm mt-2">
                          📏{" "}
                          {place.distance.toFixed(
                            2
                          )}{" "}
                          km away
                        </p>

                      </div>

                    </Popup>

                  </Marker>
                );
              })}

            </MapContainer>

          </div>


          {/* Nearby Services */}

          <div className="bg-white rounded-2xl shadow-lg p-6">

            <div className="flex items-center justify-between mb-6">

              <div>

                <h2 className="text-2xl font-bold">
                  📍 Nearby Services
                </h2>

                <p className="text-gray-500 mt-1">
                  Services within 5 km of your location
                </p>

              </div>

              <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-semibold">
                {places.length} Found
              </span>

            </div>


            {/* Loading */}

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


            {/* Error */}

            {placesError && (
              <div className="bg-red-50 text-red-600 rounded-lg p-4">
                {placesError}
              </div>
            )}


            {/* No Results */}

            {!placesLoading &&
              !placesError &&
              places.length === 0 && (

                <div className="text-center py-12">

                  <MapPin
                    className="mx-auto text-gray-300"
                    size={55}
                  />

                  <h3 className="text-xl font-semibold mt-4">
                    No Nearby Services Found
                  </h3>

                  <p className="text-gray-500 mt-2">
                    Try searching from a different location.
                  </p>

                </div>
              )}


            {/* Service Cards */}

            {!placesLoading &&
              places.length > 0 && (

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">

                  {places.map((place) => {

                    const info =
                      getPlaceInfo(place);

                    const address =
                      [
                        place.tags?.["addr:housenumber"],
                        place.tags?.["addr:street"],
                        place.tags?.["addr:city"],
                      ]
                        .filter(Boolean)
                        .join(", ");


                    const directionsUrl =
                      `https://www.openstreetmap.org/directions?from=${location.latitude},${location.longitude}&to=${place.latitude},${place.longitude}`;


                    return (
                      <div
                        key={`${place.type}-${place.id}`}
                        className="border rounded-xl p-5 hover:shadow-lg transition bg-gray-50"
                      >

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

                          <Navigation size={17} />

                          {place.distance.toFixed(
                            2
                          )}{" "}
                          km away

                        </div>


                        {/* Address */}

                        {address && (
                          <p className="text-sm text-gray-500 mb-2">
                            📍 {address}
                          </p>
                        )}


                        {/* Phone */}

                        {place.tags?.phone && (
                          <p className="text-sm text-gray-500 mb-3">
                            📞{" "}
                            {place.tags.phone}
                          </p>
                        )}


                        {/* Opening Hours */}

                        {place.tags?.opening_hours && (
                          <p className="text-sm text-gray-500 mb-3">
                            🕐{" "}
                            {place.tags.opening_hours}
                          </p>
                        )}


                        {/* Directions */}

                        <a
                          href={directionsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-semibold transition"
                        >
                          <Navigation size={18} />
                          Get Directions
                        </a>

                      </div>
                    );
                  })}

                </div>
              )}

          </div>

        </div>

      </div>
    </>
  );
}

export default NearbyServices;