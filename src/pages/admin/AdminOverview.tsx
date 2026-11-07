import React from 'react';
import { Complaint, Department, User, CityAnalyticsSummary } from '../../types';
import { StatCard } from '../../components/common/StatCard';
import {
  Users,
  Building2,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ShieldAlert,
  ArrowRight,
  Activity,
  Layers
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

interface AdminOverviewProps {
  complaints: Complaint[];
  departments: Department[];
  users: User[];
  cityAnalytics: CityAnalyticsSummary;
  onNavigateTab: (tab: string) => void;
}

export const AdminOverview: React.FC<AdminOverviewProps> = ({
  complaints,
  departments,
  users,
  cityAnalytics,
  onNavigateTab
}) => {
  const citizensCount = users.filter((u) => u.role === 'citizen').length;
  const authoritiesCount = users.filter((u) => u.role === 'authority').length;

  const resolved = complaints.filter(
    (c) => c.status === 'resolved' || c.status === 'verified'
  ).length;
  const pending = complaints.filter(
    (c) => c.status !== 'resolved' && c.status !== 'verified'
  ).length;
  const critical = complaints.filter((c) => c.aiAnalysis.severity === 'critical').length;

  // Ward performance chart data
  const wardChartData = cityAnalytics.wardPerformance.map((w) => ({
    name: w.ward.split(' - ')[1] || w.ward,
    total: w.total,
    resolved: w.resolved,
    critical: w.critical
  }));

  // AI Pipeline Telemetry
  const duplicateCaught = complaints.filter(
    (c) => c.aiAnalysis.duplicateDetection.isDuplicateLikely
  ).length;
  const suspiciousBlocked = complaints.filter(
    (c) => c.aiAnalysis.suspiciousCheck.isFlagged
  ).length;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-2xl bg-white border border-[#DFE8E1] p-6 text-[#263A32] shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-[#E7F2EC] px-2.5 py-0.5 text-xs font-semibold text-[#123D32] border border-[#DFE8E1]">
                Central Operations Command
              </span>
              <span className="text-xs text-[#687A70]">
                Commissioner Office • Greater Hyderabad Municipal Corporation
              </span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-[#263A32]">
              Platform-Wide Civic Intelligence
            </h1>
            <p className="text-xs text-[#687A70] max-w-2xl">
              Cross-departmental monitoring, AI risk scoring telemetry, duplicate detection filters,
              and ward-level municipal governance KPIs.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onNavigateTab('admin_coordinator')}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#237A57] px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#123D32] transition-colors"
            >
              <Layers className="h-4 w-4" /> Work Coordinator (Dispatch)
            </button>
            <button
              onClick={() => onNavigateTab('admin_ai_hub')}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#DFE8E1] bg-[#E7F2EC] px-4 py-2.5 text-xs font-bold text-[#123D32] hover:bg-[#237A57] hover:text-white transition-colors"
            >
              <Sparkles className="h-4 w-4" /> 11 AI Workflows Hub
            </button>
          </div>
        </div>
      </div>

      {/* Primary KPI Metrics */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
        <StatCard
          title="Citizens"
          value={citizensCount}
          subtitle="Registered profiles"
          icon={Users}
          iconColor="text-[#237A57]"
          onClick={() => onNavigateTab('admin_users')}
        />
        <StatCard
          title="Authorities"
          value={authoritiesCount}
          subtitle="Engineers & staff"
          icon={Building2}
          iconColor="text-[#123D32]"
          onClick={() => onNavigateTab('admin_departments')}
        />
        <StatCard
          title="Complaints"
          value={complaints.length}
          subtitle="Live registered tickets"
          icon={FileText}
          iconColor="text-[#237A57]"
          onClick={() => onNavigateTab('admin_monitoring')}
        />
        <StatCard
          title="Critical"
          value={critical}
          subtitle="Priority score > 90"
          icon={ShieldAlert}
          iconColor="text-red-500"
          highlight={critical > 0}
        />
        <StatCard
          title="Resolved"
          value={resolved}
          subtitle="Closed & verified"
          icon={CheckCircle2}
          iconColor="text-[#237A57]"
        />
        <StatCard
          title="Satisfaction"
          value="91.4%"
          subtitle="Citizen approval rating"
          icon={Activity}
          iconColor="text-[#237A57]"
        />
      </div>

      {/* Telemetry Strip: AI Duplicate & Suspicious Performance */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl border border-[#DFE8E1] bg-white p-4 flex items-center justify-between shadow-sm">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#237A57]">
              AI Duplicate Prevention
            </span>
            <p className="text-xl font-black text-[#263A32]">{duplicateCaught} Identified</p>
            <p className="text-xs text-[#687A70]">Consolidated ~23.6% redundant inspections</p>
          </div>
          <Sparkles className="h-8 w-8 text-[#237A57] opacity-80" />
        </div>

        <div className="rounded-xl border border-[#DFE8E1] bg-white p-4 flex items-center justify-between shadow-sm">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600">
              Trust & Anti-Spam Layer
            </span>
            <p className="text-xl font-black text-[#263A32]">{suspiciousBlocked} Flagged</p>
            <p className="text-xs text-[#687A70]">Protected public squads from spoof reports</p>
          </div>
          <ShieldAlert className="h-8 w-8 text-amber-500 opacity-80" />
        </div>

        <div className="rounded-xl border border-[#DFE8E1] bg-white p-4 flex items-center justify-between shadow-sm">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#123D32]">
              Active Municipal Divisions
            </span>
            <p className="text-xl font-black text-[#263A32]">{departments.length} Integrated</p>
            <p className="text-xs text-[#687A70]">GHMC, HMWSSB, TSSPDCL on shared mesh</p>
          </div>
          <Building2 className="h-8 w-8 text-[#237A57] opacity-80" />
        </div>
      </div>

      {/* Ward Performance Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-[#DFE8E1] bg-white p-5 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between border-b border-[#DFE8E1] pb-3">
            <div>
              <h3 className="text-sm font-bold text-[#263A32]">Ward Grievance Volume & Resolution</h3>
              <p className="text-[11px] text-[#687A70]">Total vs Resolved across key Hyderabad technology wards</p>
            </div>
            <span className="text-xs font-mono font-semibold text-[#237A57]">Ward Analytics</span>
          </div>

          <div className="h-72 mt-4 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={wardChartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
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
                <Legend wrapperStyle={{ fontSize: '11px', color: '#687A70' }} />
                <Bar dataKey="total" name="Total Filed" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="resolved" name="Resolved" fill="#237A57" radius={[4, 4, 0, 0]} />
                <Bar dataKey="critical" name="Critical" fill="#EF4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Administration Actions */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-[#263A32]">Administrative Shortcuts</h3>

          <div className="rounded-xl border border-[#DFE8E1] bg-white p-5 shadow-sm space-y-3">
            <button
              onClick={() => onNavigateTab('admin_coordinator')}
              className="flex w-full items-center justify-between rounded-xl border border-[#237A57]/30 bg-[#E7F2EC] p-3 text-xs font-bold text-[#123D32] hover:bg-[#237A57] hover:text-white transition-colors"
            >
              <span className="flex items-center gap-2">
                <Layers className="h-4 w-4" /> Work Coordinator (Dispatch & QA)
              </span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>

            <button
              onClick={() => onNavigateTab('admin_users')}
              className="flex w-full items-center justify-between rounded-xl border border-[#DFE8E1] bg-[#F4F7F5] p-3 text-xs font-semibold text-[#263A32] hover:bg-[#E7F2EC] hover:text-[#123D32] transition-colors"
            >
              <span className="flex items-center gap-2">
                <Users className="h-4 w-4 text-[#237A57]" /> User & Role Management
              </span>
              <ArrowRight className="h-3.5 w-3.5 text-[#687A70]" />
            </button>

            <button
              onClick={() => onNavigateTab('admin_departments')}
              className="flex w-full items-center justify-between rounded-xl border border-[#DFE8E1] bg-[#F4F7F5] p-3 text-xs font-semibold text-[#263A32] hover:bg-[#E7F2EC] hover:text-[#123D32] transition-colors"
            >
              <span className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-[#123D32]" /> Department Registry
              </span>
              <ArrowRight className="h-3.5 w-3.5 text-[#687A70]" />
            </button>

            <button
              onClick={() => onNavigateTab('admin_ai_hub')}
              className="flex w-full items-center justify-between rounded-xl border border-[#DFE8E1] bg-[#F4F7F5] p-3 text-xs font-semibold text-[#263A32] hover:bg-[#E7F2EC] hover:text-[#123D32] transition-colors"
            >
              <span className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-500" /> 11 Core AI Workflows Hub
              </span>
              <ArrowRight className="h-3.5 w-3.5 text-[#687A70]" />
            </button>

            <button
              onClick={() => onNavigateTab('admin_analytics')}
              className="flex w-full items-center justify-between rounded-xl border border-[#DFE8E1] bg-[#F4F7F5] p-3 text-xs font-semibold text-[#263A32] hover:bg-[#E7F2EC] hover:text-[#123D32] transition-colors"
            >
              <span className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-[#237A57]" /> Geospatial & City Heatmaps
              </span>
              <ArrowRight className="h-3.5 w-3.5 text-[#687A70]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
