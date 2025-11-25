import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import styles from "../styles/map.module.css";

// Custom icons
const userIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [35, 35],
});

const placeIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/2991/2991155.png",
  iconSize: [35, 35],
});

const pinIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684809.png",
  iconSize: [35, 35],
});

// Component to update map view
const UpdateMapView = ({ coords }) => {
  const map = useMap();
  map.setView(coords, 13);
  return null;
};

// Component for selecting a location by clicking on the map
const SelectLocation = ({ setSelectedLocation }) => {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setSelectedLocation({ lat, lng });
    },
  });
  return null;
};

const Map = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [nearbyPlaces, setNearbyPlaces] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Get user's location on mount
  useEffect(() => {
    if (!navigator.geolocation) {
      console.error("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        console.log(`User location: ${latitude}, ${longitude}, Accuracy: ${accuracy}m`);
        setUserLocation({ lat: latitude, lng: longitude });
        fetchNearbyPlaces(latitude, longitude);
      },
      (error) => {
        console.error("Error getting location:", error.message);
        alert("Failed to get your location. Please enable GPS and allow location access.");
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 }
    );
  }, []);

  // Fetch nearby dermatology centers using OpenStreetMap Overpass API
  const fetchNearbyPlaces = async (lat, lng) => {
    const overpassQuery = `
      [out:json];
      (
        node(around:5000,${lat},${lng})["healthcare"="dermatologist"];
        node(around:5000,${lat},${lng})["shop"="beauty"];
      );
      out;
    `;
    const overpassUrl = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`;

    try {
      const response = await fetch(overpassUrl);
      const data = await response.json();

      const places = data.elements.map((place) => ({
        name: place.tags.name || "Unknown Dermatology Center",
        lat: place.lat,
        lng: place.lon,
      }));

      setNearbyPlaces(places);
    } catch (error) {
      console.error("Error fetching OSM data:", error);
    }
  };

  // Fetch places when a new location is selected
  useEffect(() => {
    if (selectedLocation) {
      fetchNearbyPlaces(selectedLocation.lat, selectedLocation.lng);
    }
  }, [selectedLocation]);

  // Handle location search
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    const nominatimUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`;

    try {
      const response = await fetch(nominatimUrl);
      const data = await response.json();

      if (data.length > 0) {
        const { lat, lon } = data[0];
        setSelectedLocation({ lat: parseFloat(lat), lng: parseFloat(lon) });
      } else {
        alert("Location not found. Try a different search.");
      }
    } catch (error) {
      console.error("Error searching location:", error);
    }
  };

  return (
    <div className={styles.mapContainer}>
      {/* Search Bar */}
      <div className={styles.searchBar}>
        <input
          type="text"
          placeholder="Search location..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      <MapContainer 
        center={[12.8797, 121.7740]} 
        zoom={6} 
        style={{ width: "100%", height: "80vh" }} 
        className={styles.map}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {userLocation && (
          <>
            <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
              <Popup>You are here</Popup>
            </Marker>
            <UpdateMapView coords={[userLocation.lat, userLocation.lng]} />
          </>
        )}

        {selectedLocation && (
          <Marker position={[selectedLocation.lat, selectedLocation.lng]} icon={pinIcon}>
            <Popup>Selected Location</Popup>
          </Marker>
        )}

        {nearbyPlaces.map((place, index) => (
          <Marker key={index} position={[place.lat, place.lng]} icon={placeIcon}>
            <Popup>
              <strong>{place.name}</strong>
              <br />
              Location: {place.lat}, {place.lng}
            </Popup>
          </Marker>
        ))}

        <SelectLocation setSelectedLocation={setSelectedLocation} />
      </MapContainer>
    </div>
  );
};

export default Map;
