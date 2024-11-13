import React, { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const LiveMap = ({ center, zoom }) => {
    const mapContainerRef = useRef(null);
    const [map, setMap] = useState(null);
  
    useEffect(() => {
      mapboxgl.accessToken = 'pk.eyJ1IjoiYW50aHJvcGljLWFpIiwiYSI6ImNsZWc3a2FtdzBjcnQzdXA4d3I0ODB6NWEifQ.7z7T5j38uAehxD7Q5EJMxQ';
  
      const initializeMap = ({ setMap, mapContainer }) => {
        const map = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/streets-v11',
          center,
          zoom
        });
  
        map.on('load', () => {
          setMap(map);
          map.resize();
        });
      };
  
      if (!map) initializeMap({ setMap, mapContainer: mapContainerRef });
  
      return () => map && map.remove();
    }, [map, center, zoom]);

  return (
    <div
    ref={mapContainerRef}
    style={{
      height: '100%',
      width: '100%',
    }}
  />
  );
};

export default LiveMap;