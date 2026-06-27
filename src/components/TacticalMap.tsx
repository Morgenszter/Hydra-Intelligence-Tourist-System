import { useState, useEffect, useMemo, useCallback } from 'react';
import { MapPin, Crosshair, Navigation, Eye, EyeOff, Trash2 } from 'lucide-react';
import { CountryKey, countryCities } from '../data/pricingData';

interface Waypoint {
  id: string;
  lat: number;
  lng: number;
  label: string;
}

interface TacticalMapProps {
  country: CountryKey;
  city: string;
  selectedItems: Set<string>;
}

export default function TacticalMap({ country, city, selectedItems }: TacticalMapProps) {
  const [waypoints, setWaypoints] = useState<Waypoint[]>([]);
  const [showFree, setShowFree] = useState(true);
  const [showMid, setShowMid] = useState(true);
  const [showLux, setShowLux] = useState(true);
  const [gpsStatus, setGpsStatus] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [mapLoaded, setMapLoaded] = useState(false);

  const cityData = useMemo(() => {
    return countryCities[country].find((c) => c.name === city) || countryCities[country][0];
  }, [country, city]);

  const mapCenter = useMemo(() => cityData.coords, [cityData]);

  useEffect(() => {
    // Dynamically load Leaflet CSS and JS
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }
    if (!window.L) {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = () => setMapLoaded(true);
      document.head.appendChild(script);
    } else {
      setMapLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!mapLoaded || !window.L) return;

    const L = window.L;
    const container = document.getElementById('tactical-map');
    if (!container) return;
    container.innerHTML = '';

    const map = L.map(container, {
      center: mapCenter,
      zoom: 12,
      zoomControl: false,
      attributionControl: false,
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap &copy; CARTO',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map);

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // City marker
    const cityMarker = L.circleMarker(mapCenter, {
      radius: 10,
      fillColor: '#39ff14',
      color: '#39ff14',
      weight: 2,
      opacity: 0.8,
      fillOpacity: 0.3,
    }).addTo(map);
    cityMarker.bindPopup(`<b style="color:#39ff14">${city}</b><br/><span style="color:#0a9396">${cityData.region}</span>`);

    // Budget tier markers (simulated around city)
    const offsets = [
      { tier: 'free', color: '#39ff14', offset: [0.02, 0.02] },
      { tier: 'mid', color: '#0a9396', offset: [-0.015, 0.025] },
      { tier: 'lux', color: '#e63946', offset: [0.01, -0.02] },
    ];

    offsets.forEach((o) => {
      if (
        (o.tier === 'free' && !showFree) ||
        (o.tier === 'mid' && !showMid) ||
        (o.tier === 'lux' && !showLux)
      )
        return;

      const pos: [number, number] = [mapCenter[0] + o.offset[0], mapCenter[1] + o.offset[1]];
      L.circleMarker(pos, {
        radius: 6,
        fillColor: o.color,
        color: o.color,
        weight: 1,
        opacity: 0.6,
        fillOpacity: 0.4,
      }).addTo(map);
    });

    // Waypoints
    waypoints.forEach((wp) => {
      const marker = L.marker([wp.lat, wp.lng], {
        icon: L.divIcon({
          className: 'custom-waypoint',
          html: `<div style="width:14px;height:14px;border:2px solid #ff0033;border-radius:50%;background:transparent;box-shadow:0 0 6px #ff0033;"></div>`,
          iconSize: [14, 14],
          iconAnchor: [7, 7],
        }),
      }).addTo(map);
      marker.bindPopup(`<b style="color:#ff0033">${wp.label}</b>`);
    });

    // Red line connecting waypoints and city
    if (waypoints.length > 0) {
      const points: [number, number][] = [mapCenter, ...waypoints.map((w) => [w.lat, w.lng] as [number, number])];
      L.polyline(points, {
        color: '#ff0033',
        weight: 3,
        opacity: 0.8,
        dashArray: '8, 6',
        className: 'neon-red-line',
      }).addTo(map);
    }

    // Map click to add waypoint
    map.on('click', (e: any) => {
      const { lat, lng } = e.latlng;
      const newWp: Waypoint = {
        id: `${lat}-${lng}-${Date.now()}`,
        lat,
        lng,
        label: `WĘZEŁ ${waypoints.length + 1}`,
      };
      setWaypoints((prev) => [...prev, newWp]);
    });

    return () => {
      map.remove();
    };
  }, [mapLoaded, mapCenter, city, cityData.region, waypoints, showFree, showMid, showLux]);

  const handleGPS = useCallback(() => {
    setGpsStatus('[SYSTEM]: INICJALIZACJA GPS...');
    if (!navigator.geolocation) {
      setGpsStatus('[SYSTEM]: BRAK WSPARCIA GPS - AKTYWACJA SYMULACJI WĘZŁA');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        // Check if outside target country (simplified: just check distance)
        const dist = Math.sqrt(Math.pow(lat - mapCenter[0], 2) + Math.pow(lng - mapCenter[1], 2));
        if (dist > 5) {
          setGpsStatus('[SYSTEM]: WYKRYTO ZDALNY WYWIAD - AKTYWACJA SYMULACJI WĘZŁA');
        } else {
          setGpsStatus(`[SYSTEM]: LOKALIZACJA AGENTA POTWIERDZONA // ${lat.toFixed(4)}, ${lng.toFixed(4)}`);
        }
      },
      () => {
        setGpsStatus('[SYSTEM]: BŁĄD SYGNAŁU GPS - AKTYWACJA SYMULACJI WĘZŁA');
      }
    );
  }, [mapCenter]);

  const removeWaypoint = (id: string) => {
    setWaypoints((prev) => prev.filter((w) => w.id !== id));
  };

  const addSearchWaypoint = () => {
    if (!searchQuery.trim()) return;
    // Simulate geocoding by adding a random offset
    const offsetLat = (Math.random() - 0.5) * 0.05;
    const offsetLng = (Math.random() - 0.5) * 0.05;
    const newWp: Waypoint = {
      id: `search-${Date.now()}`,
      lat: mapCenter[0] + offsetLat,
      lng: mapCenter[1] + offsetLng,
      label: searchQuery.toUpperCase(),
    };
    setWaypoints((prev) => [...prev, newWp]);
    setSearchQuery('');
  };

  return (
    <div className="flex flex-col gap-3 h-full">
      {/* Map Controls */}
      <div className="flex items-center gap-3 pb-2 border-b border-[#005f73]">
        <MapPin size={14} className="text-gold-accent" />
        <span className="text-[12px] uppercase tracking-widest text-alpharius-cyan font-bold font-orbitron">
          KONSOLA MAPY TAKTYCZNEJ
        </span>
        <div className="flex-1" />
        <button
          onClick={() => setShowFree(!showFree)}
          className={`flex items-center gap-1 px-2 py-1 text-[10px] uppercase font-bold rounded-sm font-orbitron transition-all ${
            showFree ? 'bg-[rgba(57,255,20,0.15)] text-gold-accent border border-[#39ff14]' : 'bg-[#0a1118] text-muted-cyan border border-[#005f73]'
          }`}
        >
          {showFree ? <Eye size={10} /> : <EyeOff size={10} />}
          NAJTANIEJ
        </button>
        <button
          onClick={() => setShowMid(!showMid)}
          className={`flex items-center gap-1 px-2 py-1 text-[10px] uppercase font-bold rounded-sm font-orbitron transition-all ${
            showMid ? 'bg-[rgba(10,147,150,0.15)] text-[#0a9396] border border-[#0a9396]' : 'bg-[#0a1118] text-muted-cyan border border-[#005f73]'
          }`}
        >
          {showMid ? <Eye size={10} /> : <EyeOff size={10} />}
          ŚREDNIE
        </button>
        <button
          onClick={() => setShowLux(!showLux)}
          className={`flex items-center gap-1 px-2 py-1 text-[10px] uppercase font-bold rounded-sm font-orbitron transition-all ${
            showLux ? 'bg-[rgba(230,57,70,0.15)] text-[#e63946] border border-[#e63946]' : 'bg-[#0a1118] text-muted-cyan border border-[#005f73]'
          }`}
        >
          {showLux ? <Eye size={10} /> : <EyeOff size={10} />}
          LUKSUS
        </button>
      </div>

      {/* Search + GPS */}
      <div className="flex items-center gap-3">
        <div className="flex-1 flex items-center gap-2">
          <input
            type="text"
            placeholder="WPROWADŹ CEL WYSZUKIWANIA..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addSearchWaypoint()}
            className="flex-1 bg-[#0a1118] border border-[#005f73] text-alpharius-cyan text-[12px] py-1.5 px-3 rounded-sm focus:outline-none focus:border-[#39ff14] font-tech"
          />
          <button
            onClick={addSearchWaypoint}
            className="px-3 py-1.5 bg-[#0a1118] border border-[#005f73] text-gold-accent text-[11px] uppercase font-bold rounded-sm hover:border-[#39ff14] font-orbitron"
          >
            <Crosshair size={12} className="inline mr-1" />
            DODAJ WĘZEŁ
          </button>
        </div>
        <button
          onClick={handleGPS}
          className="px-3 py-1.5 bg-[rgba(57,255,20,0.1)] border border-[#39ff14] text-gold-accent text-[11px] uppercase font-bold rounded-sm hover:bg-[rgba(57,255,20,0.2)] font-orbitron"
        >
          <Navigation size={12} className="inline mr-1" />
          LOKALIZACJA AGENTA (GPS)
        </button>
      </div>

      {gpsStatus && (
        <div className="text-[11px] text-gold-accent font-tech bg-[rgba(57,255,20,0.05)] border border-[#39ff14]/30 px-3 py-1 rounded-sm">
          {gpsStatus}
        </div>
      )}

      {/* Waypoints list */}
      {waypoints.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {waypoints.map((wp) => (
            <div
              key={wp.id}
              className="flex items-center gap-1 px-2 py-1 bg-[#0a1118] border border-[#ff0033]/50 text-[#ff0033] text-[10px] font-tech rounded-sm"
            >
              <Crosshair size={10} />
              {wp.label}
              <button onClick={() => removeWaypoint(wp.id)} className="ml-1 hover:text-white">
                <Trash2 size={10} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Map Container */}
      <div className="flex-1 min-h-[400px] border border-[#005f73] rounded-sm overflow-hidden relative">
        <div id="tactical-map" className="w-full h-full" />
        {!mapLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#040b0e]">
            <span className="text-[12px] text-muted-cyan font-orbitron animate-pulse">
              INICJALIZACJA KONSOLI MAPOWEJ...
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
