'use client';

import { useEffect, useRef } from 'react';
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './bacMap.css';
import { BacLocation } from '@/types/search';

const TRASH_ICON_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg"><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>`;

function buildIcon(active: boolean) {
  return L.divIcon({
    html: `<div class="bac-marker-icon${active ? ' active' : ''}">${TRASH_ICON_SVG}</div>`,
    className: '',
    iconSize: active ? [40, 40] : [34, 34],
    iconAnchor: active ? [20, 20] : [17, 17],
  });
}

interface FlyToProps {
  target: { lat: number; lng: number } | null;
}

function FlyTo({ target }: FlyToProps) {
  const map = useMap();
  useEffect(() => {
    if (target) map.flyTo([target.lat, target.lng], 15, { duration: 0.8 });
  }, [target, map]);
  return null;
}

interface BacMapInnerProps {
  locations: BacLocation[];
  selectedId: number | null;
  flyTarget: { lat: number; lng: number } | null;
  onMarkerClick: (loc: BacLocation) => void;
}

export default function BacMapInner({
  locations,
  selectedId,
  flyTarget,
  onMarkerClick,
}: BacMapInnerProps) {
  const activeIcon = useRef(buildIcon(true)).current;
  const inactiveIcon = useRef(buildIcon(false)).current;

  return (
    <MapContainer
      center={[33.9989, -6.8539]}
      zoom={13}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      <FlyTo target={flyTarget} />
      {locations
        .filter((loc) => loc.locationLat != null && loc.locationLng != null)
        .map((loc) => (
          <Marker
            key={loc.id}
            position={[loc.locationLat as number, loc.locationLng as number]}
            icon={loc.id === selectedId ? activeIcon : inactiveIcon}
            eventHandlers={{ click: () => onMarkerClick(loc) }}
          />
        ))}
    </MapContainer>
  );
}