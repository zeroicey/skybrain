import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { Drone } from '../../types'

// Fix default marker icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

const statusColors = {
  flying: '#10B981',
  idle: '#6b7280',
  charging: '#F59E0B',
  warning: '#EF4444',
  offline: '#374151',
}

interface Props {
  drones: Drone[]
}

function createDroneIcon(status: Drone['status']) {
  const color = statusColors[status]
  return L.divIcon({
    className: 'custom-drone-marker',
    html: `
      <div style="
        width: 32px;
        height: 32px;
        background: ${color};
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
      ">
        🚁
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  })
}

export default function DroneMap({ drones }: Props) {
  // Center on first drone or default location
  const center = drones.length > 0
    ? [drones[0].location.lat, drones[0].location.lng] as [number, number]
    : [31.2304, 121.4737] as [number, number]

  return (
    <MapContainer
      center={center}
      zoom={15}
      style={{ height: '350px', width: '100%', borderRadius: 8 }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      {drones.map(drone => (
        <Marker
          key={drone.id}
          position={[drone.location.lat, drone.location.lng]}
          icon={createDroneIcon(drone.status)}
        >
          <Popup>
            <div style={{ minWidth: 150 }}>
              <strong>{drone.name}</strong><br />
              状态: {drone.status}<br />
              电池: {drone.battery}%<br />
              高度: {drone.altitude}m<br />
              速度: {drone.speed}m/s
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}