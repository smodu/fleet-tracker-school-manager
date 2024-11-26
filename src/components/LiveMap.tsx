import React, { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface LiveMapProps {
  center: { lat: number; lng: number };
  zoom: number;
  onLocationSelect: (location: { lat: number; lng: number }) => void;
}

const LiveMap: React.FC<LiveMapProps> = ({ center, zoom }) => {
    const mapContainerRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  
    useEffect(() => {
      mapboxgl.accessToken = 'pk.eyJ1IjoiYW50aHJvcGljLWFpIiwiYSI6ImNsZWc3a2FtdzBjcnQzdXA4d3I0ODB6NWEifQ.7z7T5j38uAehxD7Q5EJMxQ';
  
      const initializeMap = ({ setMap, mapContainer }: { setMap: any; mapContainer: any }) => {
        const mapInstance = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/streets-v11',
          center,
          zoom,
        });
  
        mapInstance.on('load', () => {
          setMap(mapInstance);
          mapInstance.resize();
        });
      };
  
      if (!map && mapContainerRef.current) {
        initializeMap({ setMap, mapContainer: mapContainerRef });
      }
  
      return () => {
        if (map) {
          map.remove(); 
        }
      };
  
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