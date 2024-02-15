import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax

mapboxgl.accessToken = 'pk.eyJ1IjoiZmllcnJhIiwiYSI6ImNsczBjbHA5azAwc2EybG16bjYwZmp4YmoifQ.ijrwRddvyqN70Grt5W_AEA';

export default function App() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const marker = useRef(null); // Add a ref for the marker
  const [lng, setLng] = useState(-70.9);
  const [lat, setLat] = useState(42.35);
  const [zoom, setZoom] = useState(9);
  const [data, setData] = useState({})

  const refreshLocation = () => {
    fetch('https://5l48zzz6-3000.asse.devtunnels.ms/getLocation')
      .then(response => response.json())
      .then(data => {
        console.log(data)
        setLng(data.location[0].coords.longitude);
        setLat(data.location[0].coords.latitude);
        setZoom(18); // Set zoom level as per your requirement
        setData(data)
      })
      .catch(error => console.error(error));
  };

  useEffect(() => {
    refreshLocation(); // Fetch location data on component mount
    const interval = setInterval(refreshLocation, 10000); // Fetches data every 10 seconds

    return () => clearInterval(interval); // Clears interval on component unmount
  }, []);

  useEffect(() => {
    if (map.current) {
      // If map is already initialized, update center and add a pin
      map.current.flyTo({ center: [lng, lat], zoom: zoom });
      if (marker.current) {
        marker.current.remove(); // Remove the old marker
      }
      marker.current = new mapboxgl.Marker().setLngLat([lng, lat]).addTo(map.current); // Add a new marker
    } else {
      // If map is not initialized, initialize it
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/satellite-streets-v12', // Use satellite view
        center: [lng, lat],
        zoom: zoom
      });
      marker.current = new mapboxgl.Marker().setLngLat([lng, lat]).addTo(map.current); // Add a marker
    }
  }, [lng, lat, zoom]);
 

  //<button onClick={refreshLocation}>Refresh Location</button>
  return (
    <div className='container'>
      <div className='sidebar'>
        <h1>Raw Data:</h1>
        <p className='codeblock'>{JSON.stringify(data)}</p>
      </div>
      <div ref={mapContainer} className="map" />
    </div>
  );
}
