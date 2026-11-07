import React, { useState } from 'react';
import { Complaint, Department, CityAnalyticsSummary } from '../../types';
import { InteractiveCivicMap } from '../../components/map/InteractiveCivicMap';
import {
  Activity,
  Layers,
  Sparkles,
  ShieldAlert,
  Copy,
  MapPin,
  Clock,
  TrendingUp,
  Filter
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface PlatformMonitoringProps {
  complaints: Complaint[];
  departments: Department[];
  cityAnalytics: CityAnalyticsSummary;
}

export const PlatformMonitoring: React.FC<PlatformMonitoringProps> = ({
  complaints,
  departments,
  cityAnalytics
}) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'30d' | '90d' | 'all'>('30d');

  // AI Pipeline Telemetry
  const duplicateCaught = complaints.filter(
    (c) => c.aiAnalysis.duplicateDetection.isDuplicateLikely
  ).length;
  const suspiciousBlocked = complaints.filter(
    (c) => c.aiAnalysis.suspiciousCheck.isFlagged
  ).length;

  const categoryDistribution = [
    { name: 'Roads & Infrastructure', count: complaints.filter((c) => c.category === 'road_potholes').length },
    { name: 'Water Leakage', count: complaints.filter((c) => c.category === 'water_leakage').length },
    { name: 'Solid Waste & Garbage', count: complaints.filter((c) => c.category === 'garbage_waste').length },
    { name: 'Street Lighting', count: complaints.filter((c) => c.category === 'streetlight_failures').length },
    { name: 'Drainage & Sewage', count: complaints.filter((c) => c.category === 'drainage_sewage').length }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#263A32]">
            Platform Monitoring & City Intelligence
          </h1>
          <p className="text-xs text-[#687A70]">
            Geospatial density analysis, automated triage metrics, and municipal SLA surveillance
          </p>
        </div>

        <div className="flex items-center gap-2">
          {(['30d', '90d', 'all'] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => setSelectedTimeframe(tf)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold uppercase transition-colors ${
                selectedTimeframe === tf
                  ? 'bg-[#237A57] text-white shadow-xs'
                  : 'bg-white border border-[#DFE8E1] text-[#687A70] hover:bg-[#F4F7F5]'
              }`}
            >
              {tf === 'all' ? 'All Time' : `Last ${tf}`}
            </button>
          ))}
        </div>
      </div>

      {/* Geospatial Map */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#263A32] flex items-center gap-2">
            <MapPin className="h-4 w-4 text-[#237A57]" />
            <span>Greater Hyderabad Interactive Geospatial Map</span>
          </h2>
          <span className="text-xs text-[#687A70]">Demo Data • Wards 92-118</span>
        </div>

        <InteractiveCivicMap complaints={complaints} height="480px" />
      </div>

      {/* AI Telemetry Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl border border-[#DFE8E1] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between border-b border-[#DFE8E1] pb-2">
            <span className="text-xs font-bold text-[#263A32] flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-[#237A57]" /> AI Semantic Duplicate Rate
            </span>
            <span className="font-mono text-xs font-extrabold text-[#237A57]">23.6%</span>
          </div>
          <p className="mt-3 text-xs text-[#687A70] leading-relaxed">
            Identified <strong className="text-[#263A32]">{duplicateCaught} related submissions</strong> within 250m buffer.
            Consolidated inspections prevent duplicate worker deployment.
          </p>
        </div>

        <div className="rounded-xl border border-[#DFE8E1] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between border-b border-[#DFE8E1] pb-2">
            <span className="text-xs font-bold text-[#263A32] flex items-center gap-1.5">
              <ShieldAlert className="h-4 w-4 text-amber-500" /> Trust & Anti-Spam Telemetry
            </span>
            <span className="font-mono text-xs font-extrabold text-amber-600">99.1% Trust</span>
          </div>
          <p className="mt-3 text-xs text-[#687A70] leading-relaxed">
            Flagged <strong className="text-[#263A32]">{suspiciousBlocked} anomalous reports</strong> (duplicate photo hashes / GPS
            mismatches). Human-in-the-loop review protected field crews.
          </p>
        </div>

        <div className="rounded-xl border border-[#DFE8E1] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between border-b border-[#DFE8E1] pb-2">
            <span className="text-xs font-bold text-[#263A32] flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-blue-500" /> Mean Resolution Velocity
            </span>
            <span className="font-mono text-xs font-extrabold text-blue-600">1.8 Days</span>
          </div>
          <p className="mt-3 text-xs text-[#687A70] leading-relaxed">
            Critical grievances remediated under <strong className="text-[#263A32]">12-hour SLA</strong>. High citizen
            verification rate of <strong className="text-[#263A32]">91.4% approved on first inspection</strong>.
          </p>
        </div>
      </div>

      {/* Category Ingestion Chart */}
      <div className="rounded-xl border border-[#DFE8E1] bg-white p-5 shadow-sm">
        <h3 className="text-sm font-bold text-[#263A32] border-b border-[#DFE8E1] pb-3">
          Civic Grievance Distribution by Category
        </h3>
        <div className="h-64 mt-4 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryDistribution} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E7F2EC" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#687A70' }} />
              <YAxis tick={{ fontSize: 11, fill: '#687A70' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderColor: '#DFE8E1',
                  borderRadius: '8px',
                  color: '#263A32',
                  fontSize: '12px'
                }}
              />
              <Bar dataKey="count" fill="#237A57" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

