import React, { useState, useEffect, useRef, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface LiveMapProps {
  center: { lat: number; lng: number };
  zoom: number;
  onLocationSelect?: (location: { lat: number; lng: number }) => void;
  initialMarker?: { lat: number; lng: number } | null;
}

const LiveMapBox: React.FC<LiveMapProps> = ({ center, zoom, onLocationSelect, initialMarker  }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<mapboxgl.Map | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const markerRef = useRef<mapboxgl.Marker | null>(null);

  const removeExistingMarker = useCallback(() => {
    if (markerRef.current) {
      markerRef.current.remove();
      markerRef.current = null;
    }
  }, []);

  const addMarkerAndNotify = useCallback((lngLat: { lng: number; lat: number }) => {
    if (!mapInstanceRef.current) {
      console.warn('Map not initialized');
      return;
    }

    removeExistingMarker();

    const marker = new mapboxgl.Marker({ 
      color: 'red', 
      draggable: true 
    })
      .setLngLat([lngLat.lng, lngLat.lat])
      .addTo(mapInstanceRef.current);
    
    markerRef.current = marker;

    if (onLocationSelect) {
      onLocationSelect({ lat: lngLat.lat, lng: lngLat.lng });
    }

    marker.on('dragend', () => {
      const newLocation = marker.getLngLat();
      if (onLocationSelect) {
        onLocationSelect({ 
          lat: newLocation.lat, 
          lng: newLocation.lng 
        });
      }
    });

    mapInstanceRef.current.flyTo({ 
      center: [lngLat.lng, lngLat.lat], 
      zoom: Math.max(mapInstanceRef.current.getZoom(), 16) 
    });
  }, [onLocationSelect, removeExistingMarker]);

  useEffect(() => {
    mapboxgl.accessToken = import.meta.env.VITE_MapBoxPublicKey;

    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const mapInstance = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [center.lng, center.lat],
        zoom,
        attributionControl: false
      });

      mapInstanceRef.current = mapInstance;

      mapInstance.on('load', () => {
        const WORLD_VIEW = "MA";
        const adminLayers = [
          'admin-0-boundary',
          'admin-1-boundary',
          'admin-0-boundary-disputed',
          'admin-1-boundary-bg',
          'admin-0-boundary-bg',
          'country-label',
        ];
        adminLayers.forEach((adminLayer) => {
          if (mapInstance.getLayer(adminLayer)) {
            mapInstance.setFilter(
              adminLayer,
              ["match", ["get", "worldview"], ["all", WORLD_VIEW], true, false]
            );
          }
        });

        setIsMapLoaded(true);
        mapInstance.resize();

        mapInstance.on('click', (e) => {
          const { lng, lat } = e.lngLat;
          addMarkerAndNotify({ lng, lat });
        });
      });

      mapInstance.on('error', (e) => {
        console.error('Map loading error:', e);
      });
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [center, zoom, addMarkerAndNotify]);

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (!query) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          query
        )}.json?access_token=${mapboxgl.accessToken}&autocomplete=true&limit=5`
      );

      const data = await response.json();
      setSuggestions(data.features || []);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  const handleSuggestionClick = useCallback((suggestion: any) => {
    if (!mapInstanceRef.current) {
      console.warn('Map not initialized');
      return;
    }

    const [lng, lat] = suggestion.center; 
    
    mapInstanceRef.current.flyTo({ 
      center: [lng, lat], 
      zoom: Math.max(mapInstanceRef.current.getZoom(), 16) 
    });

    setSearchQuery(suggestion.place_name); 
    setSuggestions([]); 
  }, []);

  return (
    <div style={{ height: '100%', width: '100%', position: 'relative' }}>
      <div
        style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          zIndex: 1,
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '8px',
          boxShadow: '0 2px 5px rgba(0, 0, 0, 0.3)',
          width: '300px',
        }}
      >
        <input
          type="text"
          placeholder="Search for an address"
          value={searchQuery}
          onChange={handleInputChange}
          className='text-sm font-medium'
          style={{
            width: '100%',
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            color: 'black'
          }}
        />
        {suggestions.length > 0 && (
          <ul
            style={{
              marginTop: '4px',
              listStyle: 'none',
              padding: 0,
              border: '1px solid #ccc',
              borderRadius: '4px',
              backgroundColor: 'white',
              maxHeight: '200px',
              overflowY: 'auto',
              color: 'black'
            }}
          >
            {suggestions.map((suggestion) => (
              <li
                key={suggestion.id}
                onClick={() => handleSuggestionClick(suggestion)}
                className='text-sm font-medium'
                style={{
                  padding: '8px',
                  cursor: 'pointer',
                  borderBottom: '1px solid #eee',
                }}
              >
                {suggestion.place_name}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div
        ref={mapContainerRef}
        style={{
          height: '100%',
          width: '100%',
        }}
      />
    </div>
  );
};

export default LiveMapBox;