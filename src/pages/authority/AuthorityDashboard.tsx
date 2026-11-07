import React from 'react';
import { Complaint, Department, User } from '../../types';
import { StatCard } from '../../components/common/StatCard';
import { SeverityBadge, StatusBadge } from '../../components/common/Badge';
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  ArrowRight,
  ShieldAlert
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
  Cell,
  LineChart,
  Line,
  Legend
} from 'recharts';

interface AuthorityDashboardProps {
  currentUser: User;
  complaints: Complaint[];
  departments: Department[];
  selectedDepartmentId?: string;
  onNavigateTab: (tab: string, complaintId?: string) => void;
}

export const AuthorityDashboard: React.FC<AuthorityDashboardProps> = ({
  complaints,
  selectedDepartmentId,
  onNavigateTab
}) => {
  // Filter by selected department if any
  const deptComplaints =
    selectedDepartmentId && selectedDepartmentId !== 'all'
      ? complaints.filter((c) => c.assignedDepartmentId === selectedDepartmentId)
      : complaints;

  const totalAssigned = deptComplaints.length;
  const newComplaints = deptComplaints.filter(
    (c) => c.status === 'submitted' || c.status === 'ai_analyzed'
  ).length;
  const highPriority = deptComplaints.filter(
    (c) => c.aiAnalysis.severity === 'high'
  ).length;
  const critical = deptComplaints.filter(
    (c) => c.aiAnalysis.severity === 'critical'
  ).length;
  const inProgress = deptComplaints.filter((c) => c.status === 'in_progress').length;
  const resolved = deptComplaints.filter(
    (c) => c.status === 'resolved' || c.status === 'verified'
  ).length;

  // Chart 1: Complaints by Category
  const categoryCounts = [
    { name: 'Roads & Potholes', count: deptComplaints.filter((c) => c.category === 'road_potholes').length },
    { name: 'Water Supply', count: deptComplaints.filter((c) => c.category === 'water_leakage').length },
    { name: 'Solid Waste', count: deptComplaints.filter((c) => c.category === 'garbage_waste').length },
    { name: 'Streetlights', count: deptComplaints.filter((c) => c.category === 'streetlight_failures').length },
    { name: 'Drainage/Sewage', count: deptComplaints.filter((c) => c.category === 'drainage_sewage').length }
  ];

  // Chart 2: Complaints by Priority
  const priorityData = [
    { name: 'Critical', value: deptComplaints.filter((c) => c.aiAnalysis.severity === 'critical').length, color: '#EF4444' },
    { name: 'High', value: deptComplaints.filter((c) => c.aiAnalysis.severity === 'high').length, color: '#F97316' },
    { name: 'Medium', value: deptComplaints.filter((c) => c.aiAnalysis.severity === 'medium').length, color: '#F59E0B' },
    { name: 'Low', value: deptComplaints.filter((c) => c.aiAnalysis.severity === 'low').length, color: '#3B82F6' }
  ];

  // Chart 3: Weekly Resolution Trend
  const resolutionTrendData = [
    { day: 'Mon', reported: 14, resolved: 12 },
    { day: 'Tue', reported: 18, resolved: 15 },
    { day: 'Wed', reported: 22, resolved: 20 },
    { day: 'Thu', reported: 16, resolved: 18 },
    { day: 'Fri', reported: 25, resolved: 21 },
    { day: 'Sat', reported: 12, resolved: 14 },
    { day: 'Sun', reported: 9, resolved: 11 }
  ];

  // Top Critical List
  const criticalList = deptComplaints
    .filter((c) => c.aiAnalysis.severity === 'critical')
    .slice(0, 3);

  return (
    <div className="space-y-6 text-[#263A32] font-sans">
      {/* Top Welcome / Status Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-[#DFE8E1] bg-white p-5 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-[#237A57] animate-ping" />
            <h1 className="text-xl font-black tracking-tight text-[#123D32]">
              Operations Command & Authority Triage
            </h1>
          </div>
          <p className="text-xs text-[#687A70] mt-0.5">
            Monitoring active grievances, dispatching field remediation, and maintaining municipal SLA targets
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateTab('auth_queue')}
            className="rounded-xl bg-[#237A57] hover:bg-[#1B6346] px-4 py-2 text-xs font-black text-white shadow-xs transition-all"
          >
            Open Official Queue ({deptComplaints.length})
          </button>
          <button
            onClick={() => onNavigateTab('auth_resolutions')}
            className="rounded-xl border border-[#DFE8E1] bg-white px-4 py-2 text-xs font-bold text-[#263A32] hover:bg-[#F4F7F5] transition-colors"
          >
            Submit Resolution
          </button>
        </div>
      </div>

      {/* Critical SLA Alert Banner */}
      {critical > 0 && (
        <div className="flex items-center justify-between rounded-xl border border-red-300 bg-red-50 p-4 text-red-900 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-700">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-black text-red-800 uppercase tracking-wider">
                Immediate Hazard SLA Warning: {critical} Critical Incidents Open
              </p>
              <p className="text-xs text-red-700">
                Potholes or sewer overflows with AI Priority Score &gt; 90 require field response unit deployment within 4 hours.
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('auth_investigation', criticalList[0]?.id)}
            className="rounded-xl bg-red-600 px-3.5 py-1.5 text-xs font-black text-white shadow-xs hover:bg-red-700 whitespace-nowrap transition-colors"
          >
            Triage Top Hazard
          </button>
        </div>
      )}

      {/* Metric Stat Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <StatCard
          title="Total Assigned"
          value={totalAssigned}
          icon={FileText}
          iconColor="text-[#123D32]"
          onClick={() => onNavigateTab('auth_queue')}
        />
        <StatCard
          title="New Triage"
          value={newComplaints}
          icon={Clock}
          iconColor="text-[#237A57]"
          highlight={newComplaints > 0}
        />
        <StatCard
          title="Critical"
          value={critical}
          icon={ShieldAlert}
          iconColor="text-red-600"
          highlight={critical > 0}
        />
        <StatCard
          title="High Priority"
          value={highPriority}
          icon={AlertTriangle}
          iconColor="text-orange-600"
        />
        <StatCard
          title="In Progress"
          value={inProgress}
          icon={TrendingUp}
          iconColor="text-[#237A57]"
        />
        <StatCard
          title="Resolved"
          value={resolved}
          icon={CheckCircle2}
          iconColor="text-[#237A57]"
        />
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Chart 1: Categories */}
        <div className="rounded-2xl border border-[#DFE8E1] bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between border-b border-[#DFE8E1] pb-3">
            <div>
              <h3 className="text-sm font-bold text-[#123D32]">Complaints by Civic Category</h3>
              <p className="text-[11px] text-[#687A70]">Distribution across municipal divisions</p>
            </div>
            <span className="text-xs font-mono font-semibold text-[#237A57]">Live Telemetry</span>
          </div>
          <div className="h-64 mt-4 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryCounts} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EDF3EF" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#687A70' }} interval={0} angle={-15} textAnchor="end" />
                <YAxis tick={{ fontSize: 11, fill: '#687A70' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#DFE8E1',
                    borderRadius: '12px',
                    color: '#263A32',
                    fontSize: '12px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar dataKey="count" fill="#237A57" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Priority Distribution Donut */}
        <div className="rounded-2xl border border-[#DFE8E1] bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between border-b border-[#DFE8E1] pb-3">
            <div>
              <h3 className="text-sm font-bold text-[#123D32]">AI Risk & Priority Distribution</h3>
              <p className="text-[11px] text-[#687A70]">Breakdown by calculated urgency score</p>
            </div>
            <span className="text-xs font-mono font-semibold text-[#237A57]">6-Factor Algorithm</span>
          </div>
          <div className="h-64 mt-4 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={priorityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#DFE8E1',
                    borderRadius: '12px',
                    color: '#263A32',
                    fontSize: '12px'
                  }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', color: '#687A70' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Weekly Resolution Trend */}
        <div className="rounded-2xl border border-[#DFE8E1] bg-white p-5 shadow-xs lg:col-span-2">
          <div className="flex items-center justify-between border-b border-[#DFE8E1] pb-3">
            <div>
              <h3 className="text-sm font-bold text-[#123D32]">7-Day Ingestion vs Resolution Velocity</h3>
              <p className="text-[11px] text-[#687A70]">Comparison of newly registered vs verified closed grievances</p>
            </div>
            <span className="rounded-full bg-emerald-100 border border-emerald-200 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
              Avg Resolution Time: 28.4 Hours
            </span>
          </div>
          <div className="h-64 mt-4 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={resolutionTrendData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EDF3EF" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#687A70' }} />
                <YAxis tick={{ fontSize: 11, fill: '#687A70' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#DFE8E1',
                    borderRadius: '12px',
                    color: '#263A32',
                    fontSize: '12px'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', color: '#687A70' }} />
                <Line type="monotone" dataKey="reported" name="New Grievances" stroke="#3B82F6" strokeWidth={2.5} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="resolved" name="Resolved Grievances" stroke="#237A57" strokeWidth={2.5} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Critical Action List */}
      <div className="rounded-2xl border border-[#DFE8E1] bg-white p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#DFE8E1] pb-3">
          <h3 className="text-sm font-bold text-[#123D32]">Highest Priority Escalations</h3>
          <button
            onClick={() => onNavigateTab('auth_queue')}
            className="text-xs font-semibold text-[#237A57] hover:underline flex items-center gap-1"
          >
            View all ({deptComplaints.length}) <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="space-y-2.5">
          {deptComplaints.slice(0, 4).map((c) => (
            <div
              key={c.id}
              onClick={() => onNavigateTab('auth_investigation', c.id)}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-xl border border-[#DFE8E1] bg-[#F4F7F5] p-3.5 hover:border-[#237A57] hover:bg-white transition-all cursor-pointer"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#237A57]">{c.id}</span>
                  <SeverityBadge severity={c.aiAnalysis.severity} size="sm" />
                  <StatusBadge status={c.status} size="sm" />
                  <span className="text-[11px] text-[#687A70] font-mono">
                    Score: {c.aiAnalysis.priorityScore}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-[#263A32]">{c.title}</h4>
                <p className="text-[11px] text-[#687A70]">{c.location.address} ({c.location.area})</p>
              </div>

              <button
                type="button"
                className="inline-flex items-center gap-1 rounded-xl bg-white border border-[#DFE8E1] px-3 py-1.5 text-xs font-bold text-[#237A57] hover:bg-[#237A57] hover:text-white flex-shrink-0 transition-colors shadow-2xs"
              >
                Investigate & Triage <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
