import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { Complaint, ComplaintSeverity, ComplaintCategory, ComplaintStatus } from '../../types';
import { SeverityBadge, StatusBadge } from '../common/Badge';
import { MapPin, Layers, Flame, Navigation, AlertTriangle, Filter } from 'lucide-react';

// Fix Leaflet marker icons in React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom colored SVG pin markers for severity
const createCustomPin = (severity: ComplaintSeverity) => {
  const colorMap: Record<ComplaintSeverity, string> = {
    critical: '#EF4444',
    high: '#F97316',
    medium: '#F59E0B',
    low: '#3B82F6'
  };
  const color = colorMap[severity] || '#3B82F6';

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="28" height="42">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 9 12 24 12 24s12-15 12-24c0-6.63-5.37-12-12-12z" fill="${color}" stroke="#ffffff" stroke-width="2"/>
      <circle cx="12" cy="12" r="5" fill="#ffffff"/>
    </svg>
  `;

  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: svg,
    iconSize: [28, 42],
    iconAnchor: [14, 42],
    popupAnchor: [0, -36]
  });
};

interface MapLocationPickerProps {
  onLocationSelect: (lat: number, lng: number) => void;
}

const LocationPickerHandler: React.FC<MapLocationPickerProps> = ({ onLocationSelect }) => {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    }
  });
  return null;
};

interface InteractiveCivicMapProps {
  complaints: Complaint[];
  selectedComplaintId?: string;
  onSelectComplaint?: (complaint: Complaint) => void;
  height?: string;
  enablePicker?: boolean;
  onPickLocation?: (lat: number, lng: number) => void;
  pickedCoords?: { lat: number; lng: number } | null;
}

export const InteractiveCivicMap: React.FC<InteractiveCivicMapProps> = ({
  complaints,
  selectedComplaintId,
  onSelectComplaint,
  height = '500px',
  enablePicker = false,
  onPickLocation,
  pickedCoords
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [showHeatmap, setShowHeatmap] = useState<boolean>(true);

  // Center on Hyderabad West IT Corridor (Madhapur/Gachibowli/Miyapur)
  const defaultCenter: [number, number] = [17.4485, 78.3740];

  const filteredComplaints = complaints.filter((c) => {
    if (selectedCategory !== 'all' && c.category !== selectedCategory) return false;
    if (selectedSeverity !== 'all' && c.aiAnalysis.severity !== selectedSeverity) return false;
    if (selectedStatus !== 'all' && c.status !== selectedStatus) return false;
    return true;
  });

  // Hotspots for simulated heatmap
  const hotspots = [
    { name: 'Cyber Towers Junction', lat: 17.4504, lng: 78.3808, count: 18, radius: 600, color: '#EF4444' },
    { name: 'Kondapur Botanical Garden Road', lat: 17.4648, lng: 78.3662, count: 12, radius: 450, color: '#F97316' },
    { name: 'Miyapur Metro Junction', lat: 17.4969, lng: 78.3614, count: 14, radius: 500, color: '#EF4444' },
    { name: 'Kukatpally Y-Junction', lat: 17.4947, lng: 78.4069, count: 16, radius: 550, color: '#EF4444' },
    { name: 'Gachibowli Financial Hub', lat: 17.4401, lng: 78.3489, count: 9, radius: 400, color: '#F59E0B' }
  ];

  return (
    <div className="relative overflow-hidden rounded-xl border border-[#DFE8E1] bg-white shadow-sm">
      {/* Top Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#DFE8E1] bg-[#F4F7F5] px-4 py-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#263A32]">
            <Filter className="h-3.5 w-3.5 text-[#237A57]" />
            <span>Map Layers:</span>
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-md border border-[#DFE8E1] bg-white px-2.5 py-1 text-xs text-[#263A32] shadow-2xs focus:border-[#237A57] focus:outline-none"
          >
            <option value="all">All Categories ({complaints.length})</option>
            <option value="road_potholes">Roads & Potholes</option>
            <option value="water_leakage">Water Leakage</option>
            <option value="garbage_waste">Garbage & Sanitation</option>
            <option value="streetlight_failures">Streetlights</option>
            <option value="drainage_sewage">Drainage & Sewage</option>
          </select>

          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="rounded-md border border-[#DFE8E1] bg-white px-2.5 py-1 text-xs text-[#263A32] shadow-2xs focus:border-[#237A57] focus:outline-none"
          >
            <option value="all">All Severities</option>
            <option value="critical">Critical Only</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="rounded-md border border-[#DFE8E1] bg-white px-2.5 py-1 text-xs text-[#263A32] shadow-2xs focus:border-[#237A57] focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="in_progress">In Progress</option>
            <option value="assigned">Assigned</option>
            <option value="resolved">Resolved</option>
            <option value="verified">Verified</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowHeatmap(!showHeatmap)}
            className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold transition-colors ${
              showHeatmap
                ? 'bg-red-50 text-red-700 border border-red-200'
                : 'bg-white text-[#687A70] border border-[#DFE8E1] hover:bg-[#F4F7F5]'
            }`}
          >
            <Flame className={`h-3.5 w-3.5 ${showHeatmap ? 'text-red-500' : 'text-[#687A70]'}`} />
            <span>Heatmap Overlay {showHeatmap ? 'ON' : 'OFF'}</span>
          </button>

          <span className="text-xs font-medium text-[#687A70]">
            Showing <strong className="text-[#263A32]">{filteredComplaints.length}</strong> markers
          </span>
        </div>
      </div>

      {/* Map Container */}
      <div style={{ height }} className="relative w-full z-0">
        <MapContainer
          center={defaultCenter}
          zoom={12}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {enablePicker && onPickLocation && (
            <LocationPickerHandler onLocationSelect={onPickLocation} />
          )}

          {/* Picked location marker */}
          {pickedCoords && (
            <Marker
              position={[pickedCoords.lat, pickedCoords.lng]}
              icon={createCustomPin('critical')}
            >
              <Popup>
                <div className="p-1 text-xs">
                  <strong className="text-[#237A57]">Selected GPS Location:</strong>
                  <p className="mt-1 text-[#263A32]">
                    {pickedCoords.lat.toFixed(4)}, {pickedCoords.lng.toFixed(4)}
                  </p>
                </div>
              </Popup>
            </Marker>
          )}

          {/* Heatmap density circles */}
          {showHeatmap &&
            hotspots.map((hs, i) => (
              <Circle
                key={`hs-${i}`}
                center={[hs.lat, hs.lng]}
                radius={hs.radius}
                pathOptions={{
                  fillColor: hs.color,
                  fillOpacity: 0.22,
                  color: hs.color,
                  weight: 1.5,
                  dashArray: '4, 4'
                }}
              >
                <Popup>
                  <div className="p-2 text-xs">
                    <div className="flex items-center gap-1 font-bold text-red-700">
                      <AlertTriangle className="h-3.5 w-3.5" /> High Risk Density Hotspot
                    </div>
                    <div className="mt-1 font-semibold text-[#263A32]">{hs.name}</div>
                    <p className="mt-0.5 text-[#687A70]">
                      {hs.count} civic grievances logged within 500m radius
                    </p>
                  </div>
                </Popup>
              </Circle>
            ))}

          {/* Complaints Markers */}
          {filteredComplaints.map((c) => {
            const isSelected = selectedComplaintId === c.id;
            return (
              <Marker
                key={c.id}
                position={[c.location.lat, c.location.lng]}
                icon={createCustomPin(c.aiAnalysis.severity)}
                eventHandlers={{
                  click: () => onSelectComplaint && onSelectComplaint(c)
                }}
              >
                <Popup>
                  <div className="w-64 p-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-[#237A57]">{c.id}</span>
                      <SeverityBadge severity={c.aiAnalysis.severity} size="sm" />
                    </div>

                    <h4 className="text-xs font-bold text-[#263A32] line-clamp-2 leading-snug">
                      {c.title}
                    </h4>

                    <div className="flex items-center justify-between text-[11px] text-[#687A70]">
                      <span>{c.location.area}</span>
                      <StatusBadge status={c.status} size="sm" />
                    </div>

                    <div className="rounded bg-[#F4F7F5] p-1.5 text-[11px] text-[#263A32] border border-[#DFE8E1]">
                      <strong>AI Priority Score:</strong> {c.aiAnalysis.priorityScore} / 100
                    </div>

                    {onSelectComplaint && (
                      <button
                        onClick={() => onSelectComplaint(c)}
                        className="w-full rounded bg-[#237A57] px-2.5 py-1 text-center text-xs font-semibold text-white hover:bg-[#123D32] transition-colors"
                      >
                        Open Full Investigation
                      </button>
                    )}
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>

        {/* Floating Map Legend */}
        <div className="absolute bottom-4 right-4 z-[400] rounded-lg border border-[#DFE8E1] bg-white/95 p-3 shadow-md backdrop-blur-xs text-xs">
          <p className="font-semibold text-[#263A32] mb-1.5 flex items-center gap-1">
            <Layers className="h-3.5 w-3.5 text-[#237A57]" /> Map Legend
          </p>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px] text-[#263A32]">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500" /> Critical (Score &gt; 90)
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-orange-500" /> High (75-89)
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500" /> Medium (50-74)
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-blue-500" /> Low (&lt; 50)
            </div>
          </div>
          {enablePicker && (
            <p className="mt-2 text-[#237A57] font-semibold border-t border-[#DFE8E1] pt-1.5">
              📍 Click anywhere on map to drop pin
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

