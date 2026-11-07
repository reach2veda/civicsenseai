import React from 'react';
import { Complaint, User } from '../../types';
import { StatCard } from '../../components/common/StatCard';
import { SeverityBadge, StatusBadge } from '../../components/common/Badge';
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  Bot,
  MapPin,
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface CitizenDashboardProps {
  currentUser: User;
  complaints: Complaint[];
  onNavigateTab: (tab: string, complaintId?: string) => void;
}

export const CitizenDashboard: React.FC<CitizenDashboardProps> = ({
  currentUser,
  complaints,
  onNavigateTab
}) => {
  const userComplaints = complaints.filter(
    (c) => c.citizenId === currentUser.id || c.citizenName === currentUser.name
  );

  const totalSubmitted = userComplaints.length;
  const inProgress = userComplaints.filter(
    (c) => c.status === 'in_progress' || c.status === 'assigned'
  ).length;
  const underReview = userComplaints.filter(
    (c) => c.status === 'submitted' || c.status === 'ai_analyzed'
  ).length;
  const resolved = userComplaints.filter(
    (c) => c.status === 'resolved' || c.status === 'verified'
  ).length;

  const pendingVerification = userComplaints.filter((c) => c.status === 'resolved');

  return (
    <div className="space-y-6 text-[#263A32] font-sans">
      {/* Welcome Banner */}
      <div className="rounded-2xl bg-white border border-[#DFE8E1] p-6 shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-[#E7F2EC] px-2.5 py-0.5 text-xs font-semibold text-[#123D32] border border-[#DFE8E1]">
                Verified Citizen Portal
              </span>
              <span className="text-xs text-[#687A70]">Ward: {currentUser.ward || 'Ward 105 - Kondapur'}</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-[#123D32]">
              Welcome back, {currentUser.name}
            </h1>
            <p className="text-xs text-[#687A70] max-w-xl">
              Track your civic grievances, report new community issues with AI automated triage,
              and verify municipal work resolutions.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={() => onNavigateTab('citizen_file')}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#237A57] hover:bg-[#1B6346] px-4 py-2.5 text-xs font-black text-white shadow-xs transition-transform active:scale-95"
            >
              <PlusCircle className="h-4 w-4" /> File New Grievance
            </button>
            <button
              onClick={() => onNavigateTab('citizen_assistant')}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#DFE8E1] bg-white px-4 py-2.5 text-xs font-semibold text-[#263A32] hover:bg-[#F4F7F5] transition-colors"
            >
              <Bot className="h-4 w-4 text-[#237A57]" /> Ask AI Guide
            </button>
          </div>
        </div>
      </div>

      {/* Action alert if resolution awaits citizen verification */}
      {pendingVerification.length > 0 && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-xl border border-amber-300 bg-amber-50 p-4 text-amber-900 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
              <AlertCircle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-amber-900">
                Action Required: {pendingVerification.length} Grievance Marked Resolved
              </p>
              <p className="text-xs text-amber-800">
                Authority has completed work for ticket #{pendingVerification[0].id}. Please inspect
                after-photos and submit citizen verification.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('citizen_track', pendingVerification[0].id)}
            className="rounded-lg bg-amber-500 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-amber-600"
          >
            Verify Resolution Now
          </button>
        </div>
      )}

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Submitted"
          value={totalSubmitted}
          subtitle="Lifetime grievances filed"
          icon={FileText}
          iconColor="text-[#237A57]"
          onClick={() => onNavigateTab('citizen_my_complaints')}
        />
        <StatCard
          title="Under AI Triage"
          value={underReview}
          subtitle="AI classifying & routing"
          icon={Sparkles}
          iconColor="text-[#123D32]"
        />
        <StatCard
          title="Active in Field"
          value={inProgress}
          subtitle="Crew deployed on site"
          icon={Clock}
          iconColor="text-amber-600"
          highlight={inProgress > 0}
        />
        <StatCard
          title="Resolved & Closed"
          value={resolved}
          subtitle="Municipal work complete"
          icon={CheckCircle2}
          iconColor="text-[#237A57]"
        />
      </div>

      {/* Active Grievances & Area Summary */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left 2 Cols: My Active Complaints */}
        <div className="space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#123D32]">My Recent Grievances</h2>
            <button
              onClick={() => onNavigateTab('citizen_my_complaints')}
              className="text-xs font-semibold text-[#237A57] hover:underline flex items-center gap-1"
            >
              View all ({userComplaints.length}) <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {userComplaints.length === 0 ? (
              <div className="rounded-xl border border-[#DFE8E1] bg-white p-8 text-center shadow-xs">
                <FileText className="mx-auto h-8 w-8 text-[#687A70]" />
                <p className="mt-2 text-sm font-semibold text-[#263A32]">No grievances filed yet</p>
                <p className="text-xs text-[#687A70]">Report potholes, leaks, or garbage in your ward.</p>
                <button
                  onClick={() => onNavigateTab('citizen_file')}
                  className="mt-3 inline-flex items-center gap-1 rounded-lg bg-[#237A57] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#1B6346]"
                >
                  <PlusCircle className="h-3.5 w-3.5" /> File First Grievance
                </button>
              </div>
            ) : (
              userComplaints.slice(0, 3).map((c) => (
                <div
                  key={c.id}
                  onClick={() => onNavigateTab('citizen_track', c.id)}
                  className="group rounded-xl border border-[#DFE8E1] bg-white p-4 shadow-xs hover:border-[#237A57] transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#237A57]">{c.id}</span>
                        <SeverityBadge severity={c.aiAnalysis.severity} size="sm" />
                        <StatusBadge status={c.status} size="sm" />
                      </div>
                      <h3 className="text-sm font-bold text-[#263A32] group-hover:text-[#237A57] transition-colors">
                        {c.title}
                      </h3>
                      <p className="text-xs text-[#687A70] line-clamp-1 flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-[#237A57]" /> {c.location.address}
                      </p>
                    </div>

                    {c.mediaUrls.length > 0 && (
                      <img
                        src={c.mediaUrls[0]}
                        alt="Evidence"
                        className="h-14 w-20 rounded-lg object-cover border border-[#DFE8E1] flex-shrink-0"
                      />
                    )}
                  </div>

                  <div className="mt-3 flex items-center justify-between border-t border-[#DFE8E1] pt-2.5 text-[11px] text-[#687A70]">
                    <span>
                      Dept: <strong className="text-[#263A32]">{c.assignedDepartmentName}</strong>
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-[#237A57]">
                      Track Grievance <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right 1 Col: Area-level Civic Summary & Quick Help */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-[#123D32]">Area Civic Intelligence</h2>

          <div className="rounded-xl border border-[#DFE8E1] bg-white p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#DFE8E1] pb-3">
              <div>
                <p className="text-xs font-bold text-[#263A32]">Serilingampally Zone (Ward 105)</p>
                <p className="text-[11px] text-[#687A70]">Live community resolution rate</p>
              </div>
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-800 border border-emerald-200">
                92.4% Resolved
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#687A70]">Garbage Compactor Rounds:</span>
                <span className="font-semibold text-[#263A32]">Daily 7:00 AM & 3:00 PM</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#687A70]">Pothole Response Squad:</span>
                <span className="font-semibold text-emerald-700">Active (QRV-04)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#687A70]">Water Tanker Helpline:</span>
                <span className="font-semibold text-[#263A32]">040-23442844</span>
              </div>
            </div>

            <button
              onClick={() => onNavigateTab('citizen_map')}
              className="w-full rounded-lg border border-[#DFE8E1] bg-[#F4F7F5] py-2 text-center text-xs font-semibold text-[#263A32] hover:bg-[#E7F2EC] hover:text-[#123D32] transition-colors"
            >
              Explore Ward Interactive Map
            </button>
          </div>

          {/* Quick AI Prompt Card */}
          <div className="rounded-xl border border-[#237A57]/30 bg-[#E7F2EC] p-4 space-y-2">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#237A57]" />
              <p className="text-xs font-bold text-[#123D32]">Civic AI Smart Advice</p>
            </div>
            <p className="text-xs text-[#263A32] leading-relaxed">
              Did you know? Taking clear photos with a recognizable landmark (like a shop sign or pillar)
              speeds up AI department routing by 40%.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
