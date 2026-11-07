import React, { useState } from 'react';
import { Complaint, User } from '../../types';
import { SeverityBadge, StatusBadge } from '../../components/common/Badge';
import {
  Search,
  ArrowRight,
  MapPin,
  Calendar,
  AlertCircle,
  PlusCircle
} from 'lucide-react';

interface MyComplaintsProps {
  currentUser: User;
  complaints: Complaint[];
  onOpenComplaint: (id: string) => void;
  onNavigateTab: (tab: string) => void;
}

export const MyComplaints: React.FC<MyComplaintsProps> = ({
  currentUser,
  complaints,
  onOpenComplaint,
  onNavigateTab
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');

  const userComplaints = complaints.filter(
    (c) => c.citizenId === currentUser.id || c.citizenName === currentUser.name
  );

  const filtered = userComplaints.filter((c) => {
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const matchText =
        c.id.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.location.address.toLowerCase().includes(q);
      if (!matchText) return false;
    }
    if (selectedCategory !== 'all' && c.category !== selectedCategory) return false;
    if (selectedStatus !== 'all' && c.status !== selectedStatus) return false;
    if (selectedSeverity !== 'all' && c.aiAnalysis.severity !== selectedSeverity) return false;
    return true;
  });

  return (
    <div className="space-y-6 text-[#263A32] font-sans">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#123D32]">My Grievances</h1>
          <p className="text-xs text-[#687A70]">
            History of complaints submitted under your registered citizen account
          </p>
        </div>

        <button
          onClick={() => onNavigateTab('citizen_file')}
          className="inline-flex items-center gap-1.5 rounded-lg bg-[#237A57] hover:bg-[#1B6346] px-4 py-2 text-xs font-bold text-white shadow-xs"
        >
          <PlusCircle className="h-4 w-4" /> File New Grievance
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-xl border border-[#DFE8E1] bg-white p-4 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#687A70]" />
            <input
              type="text"
              placeholder="Search my complaints by ID, title, address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-[#DFE8E1] bg-[#F4F7F5] pl-9 pr-3 py-2 text-xs text-[#263A32] focus:border-[#237A57] focus:bg-white focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="rounded-lg border border-[#DFE8E1] bg-[#F4F7F5] px-2.5 py-2 text-xs text-[#263A32] focus:border-[#237A57] focus:outline-none"
            >
              <option value="all">All Categories</option>
              <option value="road_potholes">Roads & Potholes</option>
              <option value="water_leakage">Water Leakage</option>
              <option value="garbage_waste">Garbage & Waste</option>
              <option value="streetlight_failures">Streetlights</option>
              <option value="drainage_sewage">Drainage & Sewage</option>
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="rounded-lg border border-[#DFE8E1] bg-[#F4F7F5] px-2.5 py-2 text-xs text-[#263A32] focus:border-[#237A57] focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="submitted">Submitted</option>
              <option value="ai_analyzed">AI Analyzed</option>
              <option value="assigned">Assigned</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="verified">Verified</option>
            </select>

            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="rounded-lg border border-[#DFE8E1] bg-[#F4F7F5] px-2.5 py-2 text-xs text-[#263A32] focus:border-[#237A57] focus:outline-none"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-[#687A70] pt-1 border-t border-[#DFE8E1]">
          <span>
            Showing <strong className="text-[#263A32]">{filtered.length}</strong> of{' '}
            {userComplaints.length} records
          </span>
          {(searchTerm || selectedCategory !== 'all' || selectedStatus !== 'all' || selectedSeverity !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setSelectedStatus('all');
                setSelectedSeverity('all');
              }}
              className="text-[#237A57] font-semibold hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Complaints List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="rounded-xl border border-[#DFE8E1] bg-white p-12 text-center shadow-xs">
            <AlertCircle className="mx-auto h-8 w-8 text-[#A7C2B4]" />
            <h3 className="mt-2 text-sm font-bold text-[#123D32]">No matching grievances found</h3>
            <p className="text-xs text-[#687A70]">Try broadening your search or filter options.</p>
          </div>
        ) : (
          filtered.map((c) => (
            <div
              key={c.id}
              onClick={() => onOpenComplaint(c.id)}
              className="group rounded-xl border border-[#DFE8E1] bg-white p-5 shadow-xs hover:border-[#237A57] hover:shadow-sm transition-all cursor-pointer"
            >
              <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#237A57]">{c.id}</span>
                    <SeverityBadge severity={c.aiAnalysis.severity} size="sm" />
                    <StatusBadge status={c.status} size="sm" />
                    <span className="text-xs text-[#DFE8E1]">•</span>
                    <span className="text-xs text-[#687A70] flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(c.submittedAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-[#263A32] group-hover:text-[#237A57] transition-colors">
                    {c.title}
                  </h3>

                  <p className="text-xs text-[#687A70] line-clamp-2 leading-relaxed">
                    {c.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-[#687A70] pt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-[#237A57]" />
                      {c.location.address}
                    </span>
                    <span>
                      Dept: <strong className="text-[#263A32]">{c.assignedDepartmentName}</strong>
                    </span>
                    <span>
                      Priority Score: <strong className="text-[#237A57]">{c.aiAnalysis.priorityScore}/100</strong>
                    </span>
                  </div>
                </div>

                {c.mediaUrls.length > 0 && (
                  <img
                    src={c.mediaUrls[0]}
                    alt="Evidence"
                    className="h-20 w-28 rounded-lg object-cover border border-[#DFE8E1] flex-shrink-0"
                  />
                )}
              </div>

              <div className="mt-3 flex items-center justify-between border-t border-[#DFE8E1] pt-2.5 text-xs">
                <span className="text-[#687A70] text-[11px]">
                  Latest event: {c.timeline[c.timeline.length - 1]?.title}
                </span>
                <span className="flex items-center gap-1 font-bold text-[#237A57] group-hover:translate-x-0.5 transition-transform">
                  Track Grievance <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
